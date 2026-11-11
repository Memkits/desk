import sys
from analyze import *
mv,facts,bf,own,sc=analyze(sys.argv[1]); b=[0]*N; want=set(int(x) for x in sys.argv[2:])
def show(b,k):
    print(f'--- 第{k}手后  (左上层 右下层)  X黑 O白')
    for y in range(n):
        print(f'{n-y} '+' '.join('.XO'[b[y*n+x]] for x in range(n))+'    '+' '.join('.XO'[b[nn+y*n+x]] for x in range(n)))
    print('  A B C D E F G H J    A B C D E F G H J')
for k,(c,p,cap,wr) in enumerate(mv):
    if p>=0:
        b[p]=c
        for j in NB[p]:
            if b[j]==3-c:
                st,l=group(b,j)
                if not l:
                    for s in st: b[s]=0
    if k+1 in want: show(b,k+1)
if 0 in want:
    print('归属'); show(own,'终')
