from plan import *
# 近似冲量：很大的推力
for vp in [38.6,39.5,40.5,41.5,42.5,44,46]:
    for rp in [3e6,6e6,1.2e7]:
        r=run(3e-3,vp,rp,23.7,-16.2,post=False)
        if r: print(f"impulsive dv1 {r['dv1']:.1f}  rp {rp/1e6:.0f}Mkm vinfJ {r['vinfJ']:.1f} turn {r['turn']:.0f} -> vinf final {r['vf']:.1f} lat {r['lat']:.1f} (best lat match to -16)")
