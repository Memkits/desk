# 近日点加速（奥伯特效应）：月球拖船只在近日点附近开机，看攒够速度要多久、用掉多少 Δv
import numpy as np
from scipy.integrate import solve_ivp
MU=4*np.pi**2; AU=1.495979e11; yr=3.15576e7; KMS=AU/yr/1e3   # 1 AU/yr = 4.74 km/s
A1=yr**2/AU   # 1 m/s^2 in AU/yr^2
def pump(a_ms2, r_on, vp_target, max_years=400):
    a=a_ms2*A1
    def f(t,y):
        r=np.hypot(y[0],y[1]); v=np.hypot(y[2],y[3]); g=-MU/r**3
        th=a if r<r_on else 0
        return [y[2],y[3],g*y[0]+th*y[2]/v,g*y[1]+th*y[3]/v, th]
    def done(t,y):   # 能量达到目标：近日点速度 vp_target 对应的能量（以 1 AU 计）
        r=np.hypot(y[0],y[1]); v2=y[2]**2+y[3]**2
        return (v2/2-MU/r) - ((vp_target/KMS)**2/2-MU/1.0)
    done.terminal=True; done.direction=1
    s=solve_ivp(f,[0,max_years],[1,0,0,2*np.pi,0],events=done,rtol=1e-9,atol=1e-11,max_step=0.01)
    t=s.t[-1]; y=s.y[:,-1]; return t, y[4]*AU/yr/1e3, y
if __name__=='__main__':
    for d_mult in [1,1.5,2,3]:
        a=6.674e-11*7.342e22/(3.844e8*d_mult)**2
        for r_on in [1.15,1.3,99]:
            for vp in [38,41,44]:
                t,dv,y=pump(a,r_on,vp)
                print(f'tug {d_mult}x a={a:.2e}  thrust r<{r_on}  vp={vp}  -> {t:6.1f} yr  dv used {dv:5.1f} km/s')
