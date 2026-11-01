import numpy as np, json, sys
from scipy.integrate import solve_ivp
MU=4*np.pi**2; AU=1.495979e11; yr=3.15576e7; KMS=AU/yr/1e3; A1=yr**2/AU
MUJ_SI=1.26687e17; RJ=5.2026; VJ=np.sqrt(MU/RJ)
def thrust_rhs(a, cond=lambda r:True):
    def f(t,y):
        r=np.linalg.norm(y[:3]); v=np.linalg.norm(y[3:6]); g=-MU/r**3
        th=a if cond(r) else 0
        return [*y[3:6], *(g*y[:3]+th*y[3:6]/v), th]
    return f
def vinf_of(y):
    r=np.linalg.norm(y[:3]); v2=y[3:6]@y[3:6]; e=v2/2-MU/r; return np.sqrt(max(0,2*e))*KMS
def asymptote(y):
    r=y[:3]; v=y[3:6]; h=np.cross(r,v); ev=np.cross(v,h)/MU-r/np.linalg.norm(r); e=np.linalg.norm(ev)
    if e<=1: return None
    nu=np.arccos(-1/e); p=ev/e; q=np.cross(h,ev); q/=np.linalg.norm(q)
    return np.cos(nu)*p+np.sin(nu)*q
def run(a_ms2, vp, rp_km, tgt_w, tgt_lat, post=True):
    a=a_ms2*A1
    # 1 持续推到目标能量
    E_t=(vp/KMS)**2/2-MU
    ev=lambda t,y: (y[3:6]@y[3:6])/2-MU/np.linalg.norm(y[:3])-E_t; ev.terminal=True; ev.direction=1
    s=solve_ivp(thrust_rhs(a),[0,300],np.array([1.,0,0,0,2*np.pi,0,0]),events=ev,rtol=1e-9,atol=1e-11,max_step=.02)
    t1=s.t[-1]; y=s.y[:,-1]; dv1=y[6]*KMS
    # 2 滑行到木星轨道
    ev2=lambda t,y: np.linalg.norm(y[:3])-RJ; ev2.terminal=True; ev2.direction=1
    s2=solve_ivp(thrust_rhs(0),[0,50],y,events=ev2,rtol=1e-10,atol=1e-12)
    if s2.status!=1: return None
    t2=s2.t[-1]; y=s2.y[:,-1]
    rhat=y[:3]/RJ; vJ=VJ*np.cross([0,0,1],rhat); vinf=y[3:6]-vJ; vi=np.linalg.norm(vinf)*KMS
    sinh=1/(1+rp_km*1e3*(vi*1e3)**2/MUJ_SI); dl=2*np.arcsin(sinh)
    best=None
    u=vinf/np.linalg.norm(vinf); e1=np.cross(u,[0,0,1]); e1/=np.linalg.norm(e1); e2=np.cross(u,e1)
    for ph in np.linspace(0,2*np.pi,72,endpoint=False):
        k=np.cos(ph)*e1+np.sin(ph)*e2   # 转向方向
        vout=np.linalg.norm(vinf)*(np.cos(dl)*u+np.sin(dl)*k)
        yy=np.r_[y[:3], vJ+vout, 0]
        # 3 飞掠后继续推，直到 v∞ 达到目标
        if post and vinf_of(yy)<tgt_w:
            ev3=lambda t,z: vinf_of(z)-tgt_w; ev3.terminal=True; ev3.direction=1
            s3=solve_ivp(thrust_rhs(a),[0,300],yy,events=ev3,rtol=1e-9,atol=1e-11,max_step=.05)
            if s3.status!=1: continue
            z=s3.y[:,-1]; t3=s3.t[-1]; dv3=z[6]*KMS
        else: z=yy; t3=0; dv3=0
        asy=asymptote(z); vf=vinf_of(z)
        if asy is None: lat=float('nan'); score=1e3-vf
        else: lat=np.degrees(np.arcsin(asy[2])); score=abs(lat-tgt_lat)-vf*1e-3
        if best is None or score<best['err']: best=dict(err=score,lat=lat,vf=vf,dv3=dv3,t3=t3,ph=ph)
    return dict(t1=t1,dv1=dv1,t2=t2,vinfJ=vi,turn=np.degrees(dl),dvJ=2*vi*sinh, **best, dv=dv1+best['dv3'], T=t1+t2+best['t3'])
if __name__=='__main__':
    tug=float(sys.argv[1]) if len(sys.argv)>1 else 1.5
    a=6.674e-11*7.342e22/(3.844e8*tug)**2
    for (tw,tl,lab) in [(25.6,-25.6,'40k'),(23.7,-16.2,'50k'),(23.4,-9.0,'60k')]:
        for vp in [38.6,40,41.5]:
            for rp in [3e6,6e6]:
                r=run(a,vp,rp,tw,tl)
                if r: print(f"tug{tug} trip{lab} vp{vp} rp{rp/1e6:.0f}Mkm: pump {r['t1']:.1f}yr dv{r['dv1']:.1f} | coast {r['t2']:.1f}yr vinfJ {r['vinfJ']:.1f} turn {r['turn']:.0f}° dvJ {r['dvJ']:.1f} | post {r['t3']:.1f}yr dv{r['dv3']:.1f} | total dv {r['dv']:.1f} T {r['T']:.0f}yr lat {r['lat']:.1f} vf {r['vf']:.1f}")
