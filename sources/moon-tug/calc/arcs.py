from plan import *
def strat(a_ms2, r_on, tgt, tmax=400):
    a=a_ms2*A1
    def f(t,y):
        r=np.linalg.norm(y[:3]); v=np.linalg.norm(y[3:6]); g=-MU/r**3
        E=(y[3:6]@y[3:6])/2-MU/r
        th=a if (r<r_on or E>0) else 0
        return [*y[3:6], *(g*y[:3]+th*y[3:6]/v), th]
    ev=lambda t,y: vinf_of(y)-tgt; ev.terminal=True; ev.direction=1
    s=solve_ivp(f,[0,tmax],np.array([1.,0,0,0,2*np.pi,0,0]),events=ev,rtol=1e-9,atol=1e-11,max_step=.02)
    y=s.y[:,-1]; return s.t[-1], y[6]*KMS, vinf_of(y), np.linalg.norm(y[:3]), s
if __name__=='__main__':
    for tug in [1,1.5,2]:
        a=6.674e-11*7.342e22/(3.844e8*tug)**2
        for r_on in [1.3,1.6,2.0,3.0,99]:
            t,dv,vf,r,_=strat(a,r_on,23.7)
            print(f'tug {tug}x a={a:.2e}  arcs r<{r_on}: {t:6.1f} yr  dv {dv:5.1f} km/s  vinf {vf:.1f}  r_end {r:.0f} AU')
