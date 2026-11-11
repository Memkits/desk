"""分析自对弈棋谱：python3 analyze.py game.txt [-v] → 每手事实 + 汇总。"""
import sys, json
n=9; nn=n*n; N=2*nn
def nbs(i):
    l,p=divmod(i,nn); y,x=divmod(p,n); r=[]
    if x>0:r.append(i-1)
    if x<n-1:r.append(i+1)
    if y>0:r.append(i-n)
    if y<n-1:r.append(i+n)
    r.append((1-l)*nn+p); return r
NB=[nbs(i) for i in range(N)]
def group(b,i):
    c=b[i]; st=[i]; seen={i}; libs=set()
    for s in st:
        for j in NB[s]:
            if b[j]==0: libs.add(j)
            elif b[j]==c and j not in seen: seen.add(j); st.append(j)
    return st,libs
def name(i):
    l,p=divmod(i,nn); y,x=divmod(p,n); return ('上' if l==0 else '下')+'ABCDEFGHJ'[x]+str(n-y)
def score(b):
    own=[0]*N; seen=[0]*N
    for i in range(N):
        if b[i]: own[i]=b[i]
        elif not seen[i]:
            reg=[i]; seen[i]=1; bd=set()
            for s in reg:
                for j in NB[s]:
                    if b[j]: bd.add(b[j])
                    elif not seen[j]: seen[j]=1; reg.append(j)
            if len(bd)==1:
                for s in reg: own[s]=list(bd)[0]
    return own
def load(fn):
    mv=[]; sc=None
    for l in open(fn):
        p=l.split()
        if p and p[0]=='SCORE': sc=int(p[1])
        elif len(p)>=5 and p[0].isdigit(): mv.append((1 if p[1]=='B' else 2,int(p[2]),int(p[3]),float(p[4])))
    return mv,sc
def analyze(fn):
    mv,sc=load(fn); b=[0]*N; facts=[]; caps=[0,0,0]
    for k,(c,p,cap,wr) in enumerate(mv):
        f={'k':k+1,'c':c,'p':p,'wr':wr if c==1 else 1-wr,'cap':[], 'atari':[], 'cross':False,'save':False}
        if p>=0:
            # 落子前自己相邻的被打吃棋块
            pre=[group(b,j) for j in NB[p] if b[j]==c]; was_atari=any(len(l)==1 for s,l in pre)
            b[p]=c
            for j in NB[p]:
                if b[j]==3-c:
                    st,l=group(b,j)
                    if not l:
                        for s in st: b[s]=0
                        f['cap']+=st
            caps[c]+=len(f['cap'])
            st,l=group(b,p); f['size']=len(st); f['libs']=len(l)
            f['cross']=b[(p+nn)%N]==c
            f['span']=len({s//nn for s in st})==2
            f['save']=was_atari and len(l)>=2
            seen=set()
            for j in NB[p]:
                if b[j]==3-c and j not in seen:
                    st2,l2=group(b,j); seen|=set(st2)
                    if len(l2)==1: f['atari'].append((len(st2),st2[0]))
            f['self_atari']=len(l)==1
        f['name']='停' if p<0 else name(p); f['caps']=caps[1:]
        facts.append(f)
    own=score(b); bs=own.count(1); ws=own.count(2)
    return mv,facts,b,own,(bs,ws,sc)
if __name__=='__main__':
    for fn in sys.argv[1:]:
        if fn=='-v': continue
        mv,facts,b,own,(bs,ws,sc)=analyze(fn)
        capev=[f for f in facts if f['cap']]; big=max([len(f['cap']) for f in capev] or [0])
        wr=[f['wr'] for f in facts]; flips=sum(1 for i in range(1,len(wr)) if (wr[i]-.5)*(wr[i-1]-.5)<0)
        passes=sum(1 for f in facts if f['p']<0)
        cross=sum(1 for f in facts if f['cross']); saves=sum(1 for f in facts if f.get('save')); sa=sum(1 for f in facts if f.get('self_atari'))
        print(f"{fn}: {len(mv)}手 黑{bs} 白{ws} 差{bs-ws} (SCORE {sc}) 提子{len(capev)}次 共{sum(len(f['cap']) for f in capev)} 最大{big} 提子数黑{facts[-1]['caps'][0]}白{facts[-1]['caps'][1]} 跨层连{cross} 逃{saves} 自打吃{sa} 胜率翻转{flips} 停{passes} 中立{N-bs-ws}")
        if '-v' in sys.argv:
            for f in facts:
                ex=[]
                if f['cap']: ex.append('提'+str(len(f['cap']))+':'+','.join(name(s) for s in f['cap'][:6]))
                if f['atari']: ex.append('打吃'+','.join(f"{a}子@{name(s)}" for a,s in f['atari']))
                if f.get('cross'): ex.append('跨层连')
                if f.get('save'): ex.append('逃')
                if f.get('self_atari'): ex.append('自打吃')
                print(f"{f['k']:3d} {'黑' if f['c']==1 else '白'} {f['name']:4s} 块{f.get('size','-')}气{f.get('libs','-')} 黑胜率{f['wr']:.2f} {' '.join(ex)}")
