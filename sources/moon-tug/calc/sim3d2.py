from plan import *
import json
def sim(a_ms2, r_on, tgt, alpha_deg, Pmax=6, tmax=300, save=False):
    a=a_ms2*A1; al=np.radians(alpha_deg)
    def f(t,y):
        r=np.linalg.norm(y[:3]); v=np.linalg.norm(y[3:6]); g=-MU/r**3
        E=(y[3:6]@y[3:6])/2-MU/r
        P = 2*np.pi*(-MU/(2*E))**1.5/np.sqrt(MU) if E<0 else 1e9
        on = r<r_on or P>Pmax
        th=a if on else 0
        vh=y[3:6]/v; zt=np.array([0,0,-1.])+vh*vh[2]; n=np.linalg.norm(zt); zt=zt/n if n>1e-9 else zt
        d=np.cos(al)*vh+np.sin(al)*zt
        return [*y[3:6], *(g*y[:3]+th*d), th]
    ev=lambda t,y: vinf_of(y)-tgt; ev.terminal=True; ev.direction=1
    s=solve_ivp(f,[0,tmax],np.array([1.,0,0,0,2*np.pi,0,0]),events=ev,rtol=1e-9,atol=1e-11,max_step=.01,dense_output=save)
    y=s.y[:,-1]; asy=asymptote(y)
    lat=np.degrees(np.arcsin(asy[2])) if asy is not None else float('nan')
    return s, s.t[-1], y[6]*KMS, lat
if __name__=='__main__':
    import sys
    a=float(sys.argv[1])
    for Pmax in [4,8]:
        for r_on in [1.2,1.4]:
            for al in [12,18]:
                s,t,dv,lat=sim(a,r_on,23.4,al,Pmax=Pmax)
                print(f'a={a} Pmax {Pmax} r_on {r_on} alpha {al}: {t:.1f} yr dv {dv:.1f} lat {lat:.1f}',flush=True)
