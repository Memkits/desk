from arcs import *
import json
out=[]
for a in [1e-4,2e-4,4e-4,1e-3]:
    for r_on in [1.15,1.3,1.6,99]:
        t,dv,vf,r,_=strat(a,r_on,23.7,tmax=300)
        d=np.sqrt(6.674e-11*7.342e22/a)/1e3
        out.append(dict(a=a,r_on=r_on,t=t,dv=dv,vf=vf,d=d))
        print(f'a={a:.0e} (tug at {d:,.0f} km)  arcs r<{r_on}: {t:6.1f} yr dv {dv:5.1f} vinf {vf:.1f}',flush=True)
json.dump(out,open('scan.json','w'))
