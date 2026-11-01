import numpy as np, json
pc=3.0857e16; ly=9.4607e15; yr=3.15576e7; AU=1.495979e11
ra=np.radians(219.9021); dec=np.radians(-60.8340); d=1000/747.17*pc
pmra=-3619.9e-3; pmde=693.8e-3; rv=-22.393e3   # arcsec/yr, m/s
k=4.74047e3*d/pc   # m/s per arcsec/yr
n=np.array([np.cos(dec)*np.cos(ra),np.cos(dec)*np.sin(ra),np.sin(dec)])
e_ra=np.array([-np.sin(ra),np.cos(ra),0]); e_de=np.array([-np.sin(dec)*np.cos(ra),-np.sin(dec)*np.sin(ra),np.cos(dec)])
V=rv*n+k*(pmra*e_ra+pmde*e_de)
eps=np.radians(23.4393); R=np.array([[1,0,0],[0,np.cos(eps),np.sin(eps)],[0,-np.sin(eps),np.cos(eps)]])  # eq->ecl
P=R@(n*d); Ve=R@V
lat=lambda v: np.degrees(np.arcsin(v[2]/np.linalg.norm(v))); lon=lambda v: np.degrees(np.arctan2(v[1],v[0]))%360
print('dist %.3f ly, |V| %.2f km/s, vt %.2f km/s'%(d/ly,np.linalg.norm(V)/1e3,k*np.hypot(pmra,pmde)/1e3))
print('pos ecl lon %.1f lat %.1f'%(lon(P),lat(P)), ' vel dir lon %.1f lat %.1f'%(lon(Ve),lat(Ve)))
tc=-P@Ve/(Ve@Ve); print('closest approach in %.0f yr at %.2f ly'%(tc/yr, np.linalg.norm(P+Ve*tc)/ly))
# intercept: earth leaves with heliocentric velocity w (straight line), arrive at time T: w*T = P + Ve*T -> w = P/T + Ve
rows=[]
for T in [25e3,30e3,35e3,40e3,50e3,60e3,70e3]:
    w=P/(T*yr)+Ve; u=w-Ve
    rows.append(dict(T=T,w=np.linalg.norm(w)/1e3,lon=lon(w),lat=lat(w),urel=np.linalg.norm(u)/1e3))
    print('T %6.0f yr  w %.1f km/s dir lon %.1f lat %.1f  arrival rel %.1f km/s'%(T,rows[-1]['w'],lon(w),lat(w),rows[-1]['urel']))
Tmin=min(np.linspace(1e4,2e5,4000),key=lambda T: np.linalg.norm(P/(T*yr)+Ve)); w=P/(Tmin*yr)+Ve
print('min-w at T %.0f yr: w %.1f km/s lat %.1f rel %.1f'%(Tmin,np.linalg.norm(w)/1e3,lat(w),np.linalg.norm(P/(Tmin*yr))/1e3))
json.dump(dict(P=P.tolist(),V=Ve.tolist(),rows=rows),open('ac.json','w'))
