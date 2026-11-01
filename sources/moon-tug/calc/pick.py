from sim3d import *
import sys
for r_on in [1.15,1.3]:
    for al in [10,14,18]:
        s,t,dv,lat=sim(2e-4,r_on,23.4,al,tmax=300)
        print(f'a=2e-4 r_on {r_on} alpha {al}: {t:.1f} yr dv {dv:.1f} lat {lat:.1f}',flush=True)
