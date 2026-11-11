import sys
from analyze import *
mv,facts,bf,own,sc=analyze(sys.argv[1]); 
def pt(s): l=0 if s[0]=='上' else 1; x='ABCDEFGHJ'.index(s[1]); y=n-int(s[2]); return l*nn+y*n+x
qs=[a.split('@') for a in sys.argv[2:]]  # 手数@点
b=[0]*N
for k,(c,p,cap,wr) in enumerate(mv):
    if p>=0:
        b[p]=c
        for j in NB[p]:
            if b[j]==3-c:
                st,l=group(b,j)
                if not l:
                    for s in st: b[s]=0
    for kk,s in qs:
        if int(kk)==k+1:
            i=pt(s)
            if not b[i]: print(kk,s,'空',i); continue
            st,l=group(b,i); print(kk,s,'idx',i,'黑白'[b[i]-1],len(st),'子:',' '.join(sorted(name(x) for x in st)) if len(st)<12 else '...','| 气',len(l),':',' '.join(sorted(name(x) for x in l)))
