// 通用“图上围棋”引擎 + UCT 蒙特卡洛树搜索
// 规则：落子后，相邻的对方棋块若气数 < T 则被提；自己棋块若气数 < T 则视为自杀（禁止）。
// T=1 即普通围棋。劫：禁止回到两手之前的局面（基本劫）；数子法计分。
#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long u64;
int N, T=1; vector<int> off, nb; vector<u64> zob[3];
mt19937_64 rng(12345);
struct Pos {
  array<int8_t,512> c{}; u64 h=0, prevh=0, prev2=0; int passes=0, moves=0, caps=0;
};
static vector<int> stamp, lstamp, stk, grp; static int st=1, lst=1;
inline int rnd(int n){ return (int)(rng()%n); }
// 取以 p 为起点的棋块，返回气数（数到 lim 为止）
int groupLibs(const Pos& P,int p,int lim,bool collect){
  int col=P.c[p]; st++; lst++; int libs=0; stk.clear(); stk.push_back(p); stamp[p]=st; if(collect) grp.clear();
  while(!stk.empty()){ int q=stk.back(); stk.pop_back(); if(collect) grp.push_back(q);
    for(int k=off[q];k<off[q+1];k++){ int r=nb[k];
      if(P.c[r]==0){ if(lstamp[r]!=lst){ lstamp[r]=lst; libs++; if(!collect && libs>=lim) return libs; } }
      else if(P.c[r]==col && stamp[r]!=st){ stamp[r]=st; stk.push_back(r);} } }
  return libs;
}
// 尝试落子，成功返回 true 并修改 P
bool play(Pos& P,int p,int col){
  if(p<0){ P.prev2=P.prevh; P.prevh=P.h; P.passes++; return true; }
  if(P.c[p]) return false;
  Pos Q=P; Q.c[p]=col; Q.h^=zob[col][p]; int opp=3-col; int captured=0;
  for(int k=off[p];k<off[p+1];k++){ int r=nb[k];
    if(Q.c[r]==opp){ int l=groupLibs(Q,r,T,true);
      if(l<T){ for(int g:grp){ Q.c[g]=0; Q.h^=zob[opp][g]; captured++; } } } }
  if(groupLibs(Q,p,T,false)<T) return false;      // 自杀
  if(Q.h==P.prevh) return false;                  // 基本劫（回到两手前）
  Q.prev2=P.prevh; Q.prevh=P.h; Q.passes=0; Q.moves=P.moves+1; Q.caps=P.caps+captured; P=Q; return true;
}
bool isEye(const Pos& P,int p,int col){ for(int k=off[p];k<off[p+1];k++) if(P.c[nb[k]]!=col) return false; return true; }
// 黑减白（数子法）
int score(const Pos& P){
  int s=0; vector<int8_t> seen(N,0);
  for(int i=0;i<N;i++){ if(P.c[i]==1) s++; else if(P.c[i]==2) s--; else if(!seen[i]){
      vector<int> q={i}; seen[i]=1; int cnt=0, border=0;
      while(!q.empty()){ int x=q.back(); q.pop_back(); cnt++;
        for(int k=off[x];k<off[x+1];k++){ int r=nb[k]; if(P.c[r]==0){ if(!seen[r]){seen[r]=1;q.push_back(r);} } else border|=P.c[r]; } }
      if(border==1) s+=cnt; else if(border==2) s-=cnt; } }
  return s;
}
static vector<int> cand;
// 随机走一步（不填自己的眼），没有可下点则停一手
int randomMove(Pos& P,int col){
  cand.clear(); for(int i=0;i<N;i++) if(!P.c[i]) cand.push_back(i);
  int n=cand.size();
  while(n>0){ int j=rnd(n); int p=cand[j]; swap(cand[j],cand[n-1]); n--;
    if(isEye(P,p,col)) continue; if(play(P,p,col)) return p; }
  play(P,-1,col); return -1;
}
int maxMoves(){ return 3*N; }
// 随机对局走完，返回黑减白
int playout(Pos P,int col){
  while(P.passes<2 && P.moves<maxMoves()){ randomMove(P,col); col=3-col; }
  return score(P);
}
// ---------- UCT ----------
struct Node{ int move; int visits=0; double wins=0; vector<int> kids; bool expanded=false; };
vector<Node> tree;
int bestMove(const Pos& root,int col,int iters,double komi){
  tree.clear(); tree.push_back(Node{-2});
  for(int it=0;it<iters;it++){
    Pos P=root; int c=col; vector<int> path={0};
    int cur=0;
    while(true){
      if(P.passes>=2 || P.moves>=maxMoves()) break;
      if(!tree[cur].expanded){
        tree[cur].expanded=true;
        for(int i=0;i<N;i++) if(!P.c[i] && !isEye(P,i,c)){ Pos Q=P; if(play(Q,i,c)){ tree.push_back(Node{i}); tree[cur].kids.push_back(tree.size()-1);} }
        tree.push_back(Node{-1}); tree[cur].kids.push_back(tree.size()-1);
        // 扩展后随机选一个子节点
        int k=tree[cur].kids[rnd(tree[cur].kids.size())]; play(P,tree[k].move,c); c=3-c; path.push_back(k); cur=k; break;
      }
      int best=-1; double bv=-1; double lg=log((double)tree[cur].visits+1);
      for(int k:tree[cur].kids){ Node& n=tree[k]; double v= n.visits==0? 1e9+rnd(1000) : n.wins/n.visits + 0.8*sqrt(lg/n.visits); if(v>bv){bv=v;best=k;} }
      play(P,tree[best].move,c); c=3-c; path.push_back(best); cur=best;
    }
    double s=playout(P,c)-komi; double blackWin= s>0?1:0;
    // 每个节点存“走这步的一方”的胜率
    for(size_t i=1;i<path.size();i++){ int mover = ((i-1)%2==0)? col : 3-col; tree[path[i]].visits++; tree[path[i]].wins += (mover==1? blackWin:1-blackWin); }
    tree[0].visits++;
  }
  int best=-1, bv=-1; for(int k:tree[0].kids) if(tree[k].visits>bv){bv=tree[k].visits; best=tree[k].move;}
  return best;
}
void load(const char* f){
  ifstream in(f); in>>N; off.assign(N+1,0); nb.clear();
  for(int i=0;i<N;i++){ int d; in>>d; off[i+1]=off[i]+d; for(int j=0;j<d;j++){int x;in>>x;nb.push_back(x);} }
  for(int c=0;c<3;c++){ zob[c].resize(N); for(auto& z:zob[c]) z=rng(); }
  stamp.assign(N,0); lstamp.assign(N,0);
}
int main(int argc,char** argv){
  string mode=argv[1]; load(argv[2]); T=atoi(argv[3]);
  if(mode=="random"){
    int games=atoi(argv[4]); rng.seed(atoi(argv[5]));
    double sumMoves=0,sumCaps=0,sumBr=0,brTurns=0,sumLogTree=0,bw=0,sumS=0,sumS2=0,capHit=0;
    for(int g=0;g<games;g++){
      Pos P; P.c.fill(0); int col=1; double lt=0;
      while(P.passes<2 && P.moves<maxMoves()){
        if(g<200){ int b=0; for(int i=0;i<N;i++) if(!P.c[i]){ Pos Q=P; if(play(Q,i,col)) b++; } b++; sumBr+=b; brTurns++; lt+=log10((double)b); }
        randomMove(P,col); col=3-col; }
      if(g<200) sumLogTree+=lt;
      int s=score(P); sumMoves+=P.moves; sumCaps+=P.caps; bw+= s>0; sumS+=s; sumS2+=(double)s*s; capHit+= P.moves>=maxMoves();
    }
    double m=sumS/games;
    printf("{\"moves\":%.1f,\"caps\":%.1f,\"branch\":%.1f,\"log10tree\":%.0f,\"blackWin\":%.3f,\"scoreMean\":%.2f,\"scoreStd\":%.2f,\"capHit\":%.3f}\n",
      sumMoves/games,sumCaps/games,sumBr/brTurns,sumLogTree/min(games,200),bw/games,m,sqrt(sumS2/games-m*m),capHit/games);
  } else if(mode=="record"){
    // 记录一盘自对弈：每手一行 “手数 着点 提子数 局面串”
    int it=atoi(argv[4]); double komi=atof(argv[5]); rng.seed(atoi(argv[6]));
    Pos P; P.c.fill(0); int col=1;
    while(P.passes<2 && P.moves<maxMoves()){
      int c0=P.caps; int mv=bestMove(P,col,it,komi); play(P,mv,col);
      string b; for(int i=0;i<N;i++) b+= ".XO"[P.c[i]];
      printf("%d %d %d %s\n",P.moves,mv,P.caps-c0,b.c_str()); fflush(stdout); col=3-col; }
    printf("SCORE %d\n",score(P));
  } else if(mode=="match"){
    int A=atoi(argv[4]),B=atoi(argv[5]),games=atoi(argv[6]); double komi=atof(argv[7]); rng.seed(atoi(argv[8]));
    int aWins=0,blackWins=0,capHit=0; double sumMargin=0,sumMoves=0,sumCaps=0;
    for(int g=0;g<games;g++){
      bool aBlack = g%2==0; Pos P; P.c.fill(0); int col=1;
      while(P.passes<2 && P.moves<maxMoves()){
        int it = ((col==1)==aBlack)? A:B; int mv=bestMove(P,col,it,komi); play(P,mv,col); col=3-col; }
      double s=score(P)-komi; bool bwin=s>0; blackWins+=bwin; aWins+= (bwin==aBlack); sumMargin+=score(P); sumMoves+=P.moves; sumCaps+=P.caps; capHit+=P.moves>=maxMoves();
    }
    printf("{\"games\":%d,\"aWins\":%d,\"blackWins\":%d,\"rawBlackMargin\":%.2f,\"moves\":%.1f,\"caps\":%.1f,\"capHit\":%d}\n",games,aWins,blackWins,sumMargin/games,sumMoves/games,sumCaps/games,capHit);
  }
}
