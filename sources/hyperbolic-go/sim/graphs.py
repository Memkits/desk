# 生成各种棋盘的邻接表：每个文件第一行 N，之后每行 "deg n1 n2 ..."
import numpy as np, math, itertools, os
from collections import defaultdict
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'boards'); os.makedirs(OUT,exist_ok=True)
def save(name,adj):
    with open(f'{OUT}/{name}.txt','w') as f:
        f.write(f'{len(adj)}\n')
        for a in adj: f.write(' '.join(map(str,[len(a)]+sorted(a)))+'\n')
    degs=defaultdict(int)
    for a in adj: degs[len(a)]+=1
    print(name,len(adj),dict(sorted(degs.items())))
def grid(dims,periodic=False):
    pts=list(itertools.product(*[range(d) for d in dims])); idx={p:i for i,p in enumerate(pts)}
    adj=[set() for _ in pts]
    for p in pts:
        for ax in range(len(dims)):
            for s in (-1,1):
                q=list(p); q[ax]+=s
                if periodic: q[ax]%=dims[ax]
                q=tuple(q)
                if q in idx and q!=p: adj[idx[p]].add(idx[q])
    return [list(a) for a in adj]
def hyperbolic(p,q,L):
    def rot(a):
        c,s=math.cos(a),math.sin(a); return np.array([[c,-s,0],[s,c,0],[0,0,1.]])
    def tr(d): return np.array([[math.cosh(d),0,math.sinh(d)],[0,1,0],[math.sinh(d),0,math.cosh(d)]])
    def key(v): x,y,t=v; return (round(x/(1+t),8),round(y/(1+t),8))
    r=math.acosh(math.cos(math.pi/q)/math.sin(math.pi/p)); Rc=math.acosh(1/(math.tan(math.pi/p)*math.tan(math.pi/q)))
    faces={}; order=[]; dist={}
    k=key(np.eye(3)[:,2]); faces[k]=np.eye(3); order.append(k); dist[k]=0; i=0
    while i<len(order):
        k=order[i]; i+=1
        if dist[k]>=2*L+2: continue
        for j in range(p):
            N=faces[k]@rot(2*math.pi*j/p)@tr(2*r)@rot(math.pi); kk=key(N[:,2])
            if kk not in faces: faces[kk]=N; dist[kk]=dist[k]+1; order.append(kk)
    fv={}; vf=defaultdict(set)
    for k in order:
        ids=[key((faces[k]@rot(2*math.pi*(j+.5)/p)@tr(Rc))[:,2]) for j in range(p)]
        fv[k]=ids
        for v in ids: vf[v].add(k)
    sel={key(np.eye(3)[:,2])}
    for _ in range(L):
        vs={v for f in sel for v in fv[f]}; sel|={f for v in vs for f in vf[v]}
    E=set()
    for f in sel:
        ids=fv[f]
        for j in range(p): a,b=ids[j],ids[(j+1)%p]; E.add((min(a,b),max(a,b)))
    vs=sorted({v for e in E for v in e}); idx={v:i for i,v in enumerate(vs)}
    adj=[set() for _ in vs]
    for a,b in E: adj[idx[a]].add(idx[b]); adj[idx[b]].add(idx[a])
    return [list(a) for a in adj]
def diamond(Lx,Ly,Lz):
    # 金刚石晶格，周期边界。A 子格：坐标全偶且和≡0 mod 4；B = A+(1,1,1)
    A=[(x,y,z) for x in range(0,Lx,2) for y in range(0,Ly,2) for z in range(0,Lz,2) if (x+y+z)%4==0]
    B=[((x+1)%Lx,(y+1)%Ly,(z+1)%Lz) for x,y,z in A]
    pts=A+B; idx={p:i for i,p in enumerate(pts)}
    vecs=[(1,1,1),(1,-1,-1),(-1,1,-1),(-1,-1,1)]
    adj=[set() for _ in pts]
    for (x,y,z) in A:
        for dx,dy,dz in vecs:
            q=((x+dx)%Lx,(y+dy)%Ly,(z+dz)%Lz); assert q in idx
            adj[idx[(x,y,z)]].add(idx[q]); adj[idx[q]].add(idx[(x,y,z)])
    return [list(a) for a in adj]
def diamond_open(n):
    # 非周期金刚石块：取 0..n 范围内的点
    pts=[]
    for x in range(n+1):
        for y in range(n+1):
            for z in range(n+1):
                if x%2==y%2==z%2:
                    s=x+y+z
                    if (x%2==0 and s%4==0) or (x%2==1 and s%4==3): pts.append((x,y,z))
    idx={p:i for i,p in enumerate(pts)}; adj=[set() for _ in pts]
    vecs=[(1,1,1),(1,-1,-1),(-1,1,-1),(-1,-1,1)]
    for p in pts:
        if p[0]%2==0:
            for d in vecs:
                q=tuple(a+b for a,b in zip(p,d))
                if q in idx: adj[idx[p]].add(idx[q]); adj[idx[q]].add(idx[p])
    alive=set(range(len(pts)))
    while True:  # 反复删掉度数<2 的点，避免出现“一口气”的死点
        bad={i for i in alive if len(adj[i]&alive)<2}
        if not bad: break
        alive-=bad
    keep=sorted(alive); m={o:i for i,o in enumerate(keep)}
    return [[m[j] for j in adj[o] if j in alive] for o in keep]
save('sq9',grid((9,9)))
save('sq11',grid((11,11)))
save('torus11',grid((11,11),True))
save('hyp54',hyperbolic(5,4,2))
save('hyp45',hyperbolic(4,5,2))
save('layer2_8x8',grid((8,8,2)))
save('layer2_9x9',grid((9,9,2)))
save('layer3_7x7',grid((7,7,3)))
save('cube5',grid((5,5,5)))
save('diamond_torus128',diamond(8,8,16))
save('diamond_open',diamond_open(9))
