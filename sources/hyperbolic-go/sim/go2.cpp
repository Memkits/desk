// 双层围棋自对弈：UCT + RAVE，走子模拟带“提子 / 逃跑 / 不自填一气”启发。
// 点的编号 i = 层*n*n + y*n + x（层 0 = 上层），与网页版一致。
// 用法：./go2 n 每手模拟数 贴目 随机种子   输出：每手一行 “手数 颜色 着点 提子数 胜率 局面串”
#include <bits/stdc++.h>
using namespace std;
int n,N; vector<array<int,5>> nb; vector<int> deg;
mt19937_64 rng;
inline int rnd(int k){ return (int)(rng()%k); }
struct Pos{ int8_t c[400]; int ko=-1, passes=0, moves=0; };
static int stampv[400], lstamp[400], stk[400], grp[400], gn, st=1, lst=1, lastLib;
int libs(const Pos&P,int p,int lim){ int col=P.c[p]; st++; lst++; int l=0, sp=0; gn=0; stk[sp++]=p; stampv[p]=st;
  while(sp){ int q=stk[--sp]; grp[gn++]=q; for(int k=0;k<deg[q];k++){ int r=nb[q][k];
    if(!P.c[r]){ if(lstamp[r]!=lst){ lstamp[r]=lst; l++; lastLib=r; if(l>=lim) return l; } }
    else if(P.c[r]==col&&stampv[r]!=st){ stampv[r]=st; stk[sp++]=r; } } }
  return l; }
// 落子；返回提子数，非法返回 -1
int play(Pos&P,int p,int col){
  if(p<0){ P.ko=-1; P.passes++; P.moves++; return 0; }
  if(P.c[p]||p==P.ko) return -1;
  P.c[p]=col; int opp=3-col, cap=0, capPt=-1;
  for(int k=0;k<deg[p];k++){ int r=nb[p][k]; if(P.c[r]==opp&&libs(P,r,1)==0){ for(int i=0;i<gn;i++){ P.c[grp[i]]=0; capPt=grp[i]; } cap+=gn; } }
  if(!cap&&libs(P,p,1)==0){ P.c[p]=0; return -1; }
  P.ko=-1; if(cap==1){ if(libs(P,p,2)==1&&gn==1) P.ko=capPt; }
  P.passes=0; P.moves++; return cap; }
inline bool isEye(const Pos&P,int p,int col){ for(int k=0;k<deg[p];k++) if(P.c[nb[p][k]]!=col) return false; return true; }
int score(const Pos&P){ int s=0; static int8_t seen[400]; memset(seen,0,N);
  for(int i=0;i<N;i++){ if(P.c[i]==1) s++; else if(P.c[i]==2) s--; else if(!seen[i]){ int sp=0,cnt=0,b=0; stk[sp++]=i; seen[i]=1;
    while(sp){ int x=stk[--sp]; cnt++; for(int k=0;k<deg[x];k++){ int r=nb[x][k]; if(!P.c[r]){ if(!seen[r]){seen[r]=1;stk[sp++]=r;} } else b|=P.c[r]; } }
    if(b==1) s+=cnt; else if(b==2) s-=cnt; } }
  return s; }
static int8_t firstBy[400];   // 模拟中每个点最先由谁落子
int playout(Pos&P,int col,int last){
  static int cand[400], urg[16];
  while(P.passes<2&&P.moves<3*N){
    int mv=-2;
    if(last>=0&&P.c[last]){ // 紧急着：上一手周围只剩一口气的棋块
      int un=0; int pts[6]={last,-1,-1,-1,-1,-1}; for(int k=0;k<deg[last];k++) pts[k+1]=nb[last][k];
      for(int a=0;a<6&&un<12;a++){ int q=pts[a]; if(q<0||!P.c[q]) continue; if(libs(P,q,2)==1) urg[un++]=lastLib; }
      while(un){ int j=rnd(un), p=urg[j]; urg[j]=urg[--un]; Pos Q=P; int c=play(Q,p,col); if(c<0) continue; if(c==0&&libs(Q,p,2)<2) continue; P=Q; mv=p; break; } }
    if(mv==-2){ int cn=0; for(int i=0;i<N;i++) if(!P.c[i]) cand[cn++]=i;
      while(cn){ int j=rnd(cn), p=cand[j]; cand[j]=cand[--cn]; if(isEye(P,p,col)) continue;
        Pos Q=P; int c=play(Q,p,col); if(c<0) continue; if(c==0&&libs(Q,p,2)<2&&rnd(10)) continue; P=Q; mv=p; break; }
      if(mv==-2){ play(P,-1,col); mv=-1; } }
    if(mv>=0&&!firstBy[mv]) firstBy[mv]=col;
    last=mv; col=3-col; }
  return score(P); }
struct Node{ int move; float v=0,w=0,rv=0,rw=0; vector<int> kids; bool ex=false; };
vector<Node> tree;
pair<int,double> best(const Pos&root,int col,int iters,double komi){
  tree.clear(); tree.reserve(iters*40); tree.push_back(Node{-2});
  vector<int> path; vector<int> pc;
  for(int it=0;it<iters;it++){
    Pos P=root; int c=col, cur=0, last=-1; path.assign(1,0); pc.assign(1,c); memset(firstBy,0,N);
    while(P.passes<2&&P.moves<3*N){
      if(!tree[cur].ex){ tree[cur].ex=true;
        for(int i=0;i<N;i++) if(!P.c[i]&&!isEye(P,i,c)){ Pos Q=P; int cp=play(Q,i,c); if(cp<0) continue; if(cp==0&&libs(Q,i,2)<2&&gn>1) continue; tree.push_back(Node{i}); tree[cur].kids.push_back(tree.size()-1); }
        if(tree[cur].kids.empty()||P.passes||P.moves>N){ tree.push_back(Node{-1}); tree[cur].kids.push_back(tree.size()-1); } }
      int bk=-1; double bv=-1e9; double lg=log(tree[cur].v+1.0);
      for(int k:tree[cur].kids){ Node&nd=tree[k]; double val;
        if(nd.v==0&&nd.rv==0) val=1e6+rnd(1000);
        else{ double beta=nd.rv/(nd.rv+nd.v+nd.rv*nd.v/2500.0+1e-9), q=nd.v?nd.w/nd.v:0.5, rq=nd.rv?nd.rw/nd.rv:0.5;
          val=(1-beta)*q+beta*rq+(nd.v?0.35*sqrt(lg/nd.v):0.3); }
        if(val>bv){bv=val;bk=k;} }
      int m=tree[bk].move; play(P,m,c); if(m>=0&&!firstBy[m]) firstBy[m]=c; last=m; c=3-c; bool fresh=tree[bk].v==0; cur=bk; path.push_back(bk); pc.push_back(c); if(fresh) break; }
    double s=playout(P,c,last)-komi; double bw=s>0?1:0;
    for(size_t i=1;i<path.size();i++){ int mover=pc[i-1]; double r=mover==1?bw:1-bw; tree[path[i]].v++; tree[path[i]].w+=r;
      for(int k:tree[path[i-1]].kids){ int m=tree[k].move; if(m>=0&&firstBy[m]==mover){ tree[k].rv++; tree[k].rw+=r; } } }
    tree[0].v++; }
  int bm=-1; double bv=-1,wr=0.5; for(int k:tree[0].kids) if(tree[k].v>bv){ bv=tree[k].v; bm=tree[k].move; wr=tree[k].w/max(1.f,tree[k].v); }
  return {bm,wr}; }
int main(int argc,char**argv){
  n=atoi(argv[1]); int iters=atoi(argv[2]); double komi=atof(argv[3]); rng.seed(atoi(argv[4])); N=2*n*n; nb.resize(N); deg.assign(N,0);
  for(int l=0;l<2;l++)for(int y=0;y<n;y++)for(int x=0;x<n;x++){ int i=l*n*n+y*n+x; auto add=[&](int j){ nb[i][deg[i]++]=j; };
    if(x>0)add(i-1); if(x<n-1)add(i+1); if(y>0)add(i-n); if(y<n-1)add(i+n); add((1-l)*n*n+y*n+x); }
  if(argc>5&&string(argv[5])=="bench"){ Pos P; memset(P.c,0,sizeof P.c); auto t=chrono::steady_clock::now(); best(P,1,iters,komi); printf("%.2fs\n",chrono::duration<double>(chrono::steady_clock::now()-t).count()); return 0; }
  Pos P; memset(P.c,0,sizeof P.c); int col=1;
  while(P.passes<2&&P.moves<3*N){ auto r=best(P,col,iters,komi); int cap=play(P,r.first,col); if(cap<0){ cap=play(P,-1,col); r.first=-1; }
    string b; for(int i=0;i<N;i++) b+=".XO"[P.c[i]];
    printf("%d %c %d %d %.3f %s\n",P.moves,col==1?'B':'W',r.first,cap,r.second,b.c_str()); fflush(stdout); col=3-col; }
  printf("SCORE %d\n",score(P)); }
