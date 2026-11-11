// n 维 Hex（Gale 1979）：棋盘 {0..k-1}^n，n 个玩家，玩家 i 要连通第 i 维的两个对面。
// 相邻：两点坐标差全部 ∈{0,1} 或全部 ∈{0,-1}（不全为 0）。n=2 即普通 Hex。
#include <bits/stdc++.h>
using namespace std;
int n,k,N,P; vector<vector<int>> adj; vector<vector<int>> coord;
mt19937_64 rng(1);
struct UF{ vector<int> p; void init(int m){p.resize(m); iota(p.begin(),p.end(),0);} int f(int x){ while(p[x]!=x){p[x]=p[p[x]];x=p[x];} return x;} void u(int a,int b){p[f(a)]=f(b);} };
struct St{ vector<int8_t> c; vector<UF> uf; int turn=0, winner=-1, filled=0; };
void init(St& s){ s.c.assign(N,-1); s.uf.assign(P,UF()); for(auto& u:s.uf) u.init(N+2); s.turn=0; s.winner=-1; s.filled=0; }
void play(St& s,int p){
  int pl=s.turn; s.c[p]=pl; UF& u=s.uf[pl];
  if(coord[p][pl]==0) u.u(p,N); if(coord[p][pl]==k-1) u.u(p,N+1);
  for(int q:adj[p]) if(s.c[q]==pl) u.u(p,q);
  if(u.f(N)==u.f(N+1)) s.winner=pl;
  s.filled++; s.turn=(s.turn+1)%P;
}
int playout(St s){
  vector<int> e; for(int i=0;i<N;i++) if(s.c[i]<0) e.push_back(i);
  shuffle(e.begin(),e.end(),rng);
  for(int p:e){ if(s.winner>=0) break; play(s,p); }
  return s.winner; // -1 = 平局（n=2 时不会发生）
}
struct Node{ int mv; int vis=0; vector<double> w; vector<int> kids; bool exp=false; };
vector<Node> T;
int best(const St& root,int it){
  T.clear(); T.push_back(Node{-1}); T[0].w.assign(P,0);
  for(int i=0;i<it;i++){
    St s=root; vector<int> path={0}; int cur=0;
    while(s.winner<0 && s.filled<N){
      if(!T[cur].exp){ T[cur].exp=true; for(int p=0;p<N;p++) if(s.c[p]<0){ Node nd{p}; nd.w.assign(P,0); T.push_back(nd); T[cur].kids.push_back(T.size()-1);} 
        int kk=T[cur].kids[rng()%T[cur].kids.size()]; play(s,T[kk].mv); path.push_back(kk); cur=kk; break; }
      int mover=s.turn; double lg=log(T[cur].vis+1.0); int bk=-1; double bv=-1;
      for(int kk:T[cur].kids){ Node& c=T[kk]; double v=c.vis==0?1e9+rng()%1000: c.w[mover]/c.vis+0.8*sqrt(lg/c.vis); if(v>bv){bv=v;bk=kk;} }
      play(s,T[bk].mv); path.push_back(bk); cur=bk;
    }
    int w = s.winner>=0? s.winner : playout(s);
    for(int x:path){ T[x].vis++; if(w>=0) T[x].w[w]+=1; else for(int q=0;q<P;q++) T[x].w[q]+=1.0/P; }
  }
  int bm=-1,bv=-1; for(int kk:T[0].kids) if(T[kk].vis>bv){bv=T[kk].vis;bm=T[kk].mv;} return bm;
}
int main(int argc,char**argv){
  n=atoi(argv[1]); k=atoi(argv[2]); P=atoi(argv[3]); // P 个玩家（P<=n）
  int games=atoi(argv[4]); int strong=atoi(argv[5]), weak=atoi(argv[6]); rng.seed(atoi(argv[7]));
  N=1; for(int i=0;i<n;i++) N*=k;
  coord.resize(N); for(int i=0;i<N;i++){ int x=i; for(int d=0;d<n;d++){ coord[i].push_back(x%k); x/=k; } }
  map<vector<int>,int> id; for(int i=0;i<N;i++) id[coord[i]]=i; adj.assign(N,{});
  for(int i=0;i<N;i++) for(int m=1;m<(1<<n);m++) for(int sg:{1,-1}){ vector<int> q=coord[i]; bool ok=true; for(int d=0;d<n;d++) if(m>>d&1){ q[d]+=sg; if(q[d]<0||q[d]>=k) ok=false; } if(ok) adj[i].push_back(id[q]); }
  // 随机对局：各座位胜率、平局率、平均手数
  vector<int> rw(P+1,0); double len=0;
  for(int g=0;g<20000;g++){ St s; init(s); vector<int> e(N); iota(e.begin(),e.end(),0); shuffle(e.begin(),e.end(),rng); for(int p:e){ if(s.winner>=0) break; play(s,p);} rw[s.winner<0?P:s.winner]++; len+=s.filled; }
  printf("{\"n\":%d,\"k\":%d,\"players\":%d,\"cells\":%d,\"randomSeatWin\":[",n,k,P,N); for(int i=0;i<P;i++) printf("%s%.3f",i?",":"",rw[i]/20000.0); printf("],\"randomDraw\":%.3f,\"randomLen\":%.1f,",rw[P]/20000.0,len/20000);
  // MCTS：同等强度各座位胜率；以及一个强者（轮换座位）对其余弱者
  vector<int> eqw(P+1,0), seatOfStrongWins(P,0); int strongWins=0; double mlen=0;
  for(int g=0;g<games;g++){
    for(int mode=0;mode<2;mode++){
      int ss = g%P; St s; init(s);
      while(s.winner<0 && s.filled<N){ int it = mode==0? weak : (s.turn==ss? strong:weak); play(s,best(s,it)); }
      if(mode==0){ eqw[s.winner<0?P:s.winner]++; mlen+=s.filled; } else if(s.winner==ss) strongWins++;
    }
  }
  printf("\"mctsSeatWin\":["); for(int i=0;i<P;i++) printf("%s%.3f",i?",":"",eqw[i]/(double)games); printf("],\"mctsDraw\":%.3f,\"mctsLen\":%.1f,\"strongVsWeakWin\":%.3f,\"baseline\":%.3f}\n",eqw[P]/(double)games,mlen/games,strongWins/(double)games,1.0/P);
}
