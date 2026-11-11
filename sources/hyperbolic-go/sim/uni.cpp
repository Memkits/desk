// 棋盘之外的双人博弈原型：同一个蒙特卡洛树搜索，六种“世界”。
// 用法：./uni 游戏 match 甲模拟数 乙模拟数 局数 种子   （模拟数 0 = 随机走）；./uni 游戏 play 模拟数 种子
// 游戏：contagion[:grid|sw|ba] 蔓延  life 生命对决  switch 道岔  skyline 天际线  seesaw 跷跷板  sand 沙堆
#include <bits/stdc++.h>
using namespace std;
mt19937_64 rng; inline int rnd(int k){ return (int)(rng()%k); }
struct Game{ int tm=1; virtual ~Game(){} virtual Game*clone()const=0; virtual void legal(vector<int>&m)const=0; virtual void play(int m)=0; virtual bool over()const=0; virtual int result()const=0; virtual string show()const{ return ""; } };

// ---------- 蔓延：网络上轮流占一个点，然后自动扩散 ----------
// 规则：占一个无主节点；随后同步演化一步：无主节点若某方邻居 ≥2 且多于对方，就归该方；有主节点若对方邻居超过它邻居总数的一半，就倒戈。全部有主时节点多者胜。
struct Contagion:Game{ bool dbl=false; int n; vector<vector<int>> adj; vector<int8_t> c; int moves=0; string kind;
  Contagion(string k):kind(k){ if(k.back()=='2'){ dbl=true; k.pop_back(); } if(k=="grid"){ n=36; adj.assign(n,{}); for(int y=0;y<6;y++)for(int x=0;x<6;x++){ int i=y*6+x; if(x<5){adj[i].push_back(i+1);adj[i+1].push_back(i);} if(y<5){adj[i].push_back(i+6);adj[i+6].push_back(i);} } }
    else if(k=="sw"){ n=40; set<pair<int,int>> E; for(int i=0;i<n;i++)for(int d=1;d<=2;d++){ int j=(i+d)%n; if(rnd(100)<20){ j=rnd(n); } if(j!=i) E.insert({min(i,j),max(i,j)}); } adj.assign(n,{}); for(auto&e:E){adj[e.first].push_back(e.second);adj[e.second].push_back(e.first);} }
    else{ n=40; adj.assign(n,{}); vector<int> ends={0,1,1,2,2,0}; auto add=[&](int a,int b){adj[a].push_back(b);adj[b].push_back(a);ends.push_back(a);ends.push_back(b);}; adj[0]={1,2};adj[1]={0,2};adj[2]={0,1};
      for(int i=3;i<n;i++){ int a=ends[rnd(ends.size())], b; do b=ends[rnd(ends.size())]; while(b==a); add(i,a); add(i,b); } }
    c.assign(n,0); }
  Game*clone()const override{ return new Contagion(*this); }
  void legal(vector<int>&m)const override{ m.clear(); for(int i=0;i<n;i++) if(!c[i]) m.push_back(i); }
  void play(int m)override{ c[m]=tm; vector<int8_t> d=c; for(int i=0;i<n;i++){ int a=0,b=0; for(int j:adj[i]){ if(c[j]==1)a++; else if(c[j]==2)b++; }
      if(!c[i]){ if(a>=2&&a>b) d[i]=1; else if(b>=2&&b>a) d[i]=2; } else{ int e=c[i]==1?b:a; if(2*e>(int)adj[i].size()) d[i]=3-c[i]; } }
    c=d; if(!dbl||moves%2==0) tm=3-tm; moves++; }
  bool over()const override{ if(moves>=4*n) return true; for(int i=0;i<n;i++) if(!c[i]) return false; return true; }
  int result()const override{ int s=0; for(int i=0;i<n;i++) s+=c[i]==1?1:c[i]==2?-1:0; return s>0?1:s<0?-1:0; }
  string show()const override{ string s; for(int i=0;i<n;i++) s+=".XO"[c[i]]; return s; } };

// ---------- 生命对决：双色生命游戏（8×8 环面），每手放一个自己的活细胞，然后演化一代 ----------
// 出生：恰好 3 个活邻居，颜色随多数；存活：2 或 3 个活邻居。各下 20 手后活细胞多者胜。
struct Life:Game{ static const int S=8; int8_t c[S*S]; int moves=0;
  Life(){ memset(c,0,sizeof c); for(int k=0;k<10;k++){ int i=rnd(S*S); if(c[i]||c[S*S-1-i]) {k--;continue;} c[i]=1; c[S*S-1-i]=2; } }
  Game*clone()const override{ return new Life(*this); }
  void legal(vector<int>&m)const override{ m.clear(); for(int i=0;i<S*S;i++) if(!c[i]) m.push_back(i); if(m.empty()) m.push_back(-1); }
  void play(int m)override{ if(m>=0) c[m]=tm; int8_t d[S*S]; for(int y=0;y<S;y++)for(int x=0;x<S;x++){ int a=0,b=0; for(int dy=-1;dy<=1;dy++)for(int dx=-1;dx<=1;dx++) if(dx||dy){ int v=c[((y+dy+S)%S)*S+(x+dx+S)%S]; if(v==1)a++; else if(v==2)b++; }
      int i=y*S+x, t=a+b; d[i]=c[i]?((t==2||t==3)?c[i]:0):(t==3?(a>b?1:2):0); }
    memcpy(c,d,sizeof c); tm=3-tm; moves++; }
  bool over()const override{ return moves>=40; }
  int result()const override{ int s=0; for(int i=0;i<S*S;i++) s+=c[i]==1?1:c[i]==2?-1:0; return s>0?1:s<0?-1:0; }
  string show()const override{ string s; for(int i=0;i<S*S;i++) s+=".XO"[c[i]]; return s; } };

// ---------- 道岔：包裹在有向网络里自动前进，双方轮流扳一个道岔 ----------
// 16 个节点各有两条出边和一个道岔；每手扳一个道岔（不能扳对方刚扳过的），然后包裹走两步；走进谁的终点谁得 1 分并回到起点。先得 4 分者胜，80 手内未分胜负比分数。
struct Switch:Game{ static const int n=16; int out[n][2], sw[n], home[n], pos=0, lastSw=-1, sc[3]={0,0,0}, moves=0;
  Switch(){ for(int i=0;i<n;i++){ out[i][0]=(i+1)%n; do out[i][1]=rnd(n); while(out[i][1]==i||out[i][1]==out[i][0]); sw[i]=rnd(2); home[i]=0; } home[4]=home[11]=1; home[6]=home[13]=2; }
  Game*clone()const override{ return new Switch(*this); }
  void legal(vector<int>&m)const override{ m.clear(); for(int i=0;i<n;i++) if(i!=lastSw) m.push_back(i); }
  void play(int m)override{ sw[m]^=1; lastSw=m; for(int k=0;k<2;k++){ pos=out[pos][sw[pos]]; if(home[pos]){ sc[home[pos]]++; pos=0; break; } } tm=3-tm; moves++; }
  bool over()const override{ return sc[1]>=4||sc[2]>=4||moves>=80; }
  int result()const override{ return sc[1]>sc[2]?1:sc[1]<sc[2]?-1:0; } };

// ---------- 天际线：带重力的搭积木，比谁占的“楼顶”多 ----------
// 7 列、限高 6。积木必须有支撑：落在地面或别的积木正上方；或者“悬挑”：紧贴自己一块有正下方支撑的积木的侧面。终局时每一列最高的积木属于谁，谁得这一列。
struct Skyline:Game{ static const int W=7,H=6; int8_t c[W][H]; int moves=0, cap=2*W*H;
  Skyline(int cp=0){ if(cp) cap=cp; memset(c,0,sizeof c); }
  Game*clone()const override{ return new Skyline(*this); }
  bool sup(int x,int y)const{ return y==0||c[x][y-1]; }
  bool ok(int x,int y,int col)const{ if(c[x][y]) return false; if(sup(x,y)) return true; for(int d=-1;d<=1;d+=2){ int u=x+d; if(u>=0&&u<W&&c[u][y]==col&&sup(u,y)) return true; } return false; }
  void legal(vector<int>&m)const override{ m.clear(); for(int x=0;x<W;x++)for(int y=0;y<H;y++) if(ok(x,y,tm)) m.push_back(x*H+y); if(m.empty()) m.push_back(-1); }
  void play(int m)override{ if(m>=0) c[m/H][m%H]=tm; tm=3-tm; moves++; }
  bool over()const override{ if(moves>=cap) return true; for(int col=1;col<=2;col++) for(int x=0;x<W;x++)for(int y=0;y<H;y++) if(ok(x,y,col)) return false; return true; }
  int result()const override{ int s=0; for(int x=0;x<W;x++) for(int y=H-1;y>=0;y--) if(c[x][y]){ s+=c[x][y]==1?1:-1; break; } return s>0?1:s<0?-1:0; }
  string show()const override{ string s; for(int y=H-1;y>=0;y--){ for(int x=0;x<W;x++) s+=".XO"[c[x][y]]; s+='/'; } return s; } };

// ---------- 跷跷板：轮流往横梁上放砝码，谁让它翻倒谁输 ----------
// 横梁有 -5…5 共 10 个位置（没有 0），每人有重量 1 到 5 的砝码各一个。每手把一个砝码放到空位上；力矩（重量 × 位置之和）绝对值超过 8 就翻倒，放的人输；无处可放也输。
struct Seesaw:Game{ int8_t pos[11]; int used[3]={0,0,0}; int tq=0, loser=0, moves=0;
  Seesaw(){ memset(pos,0,sizeof pos); }
  Game*clone()const override{ return new Seesaw(*this); }
  void legal(vector<int>&m)const override{ m.clear(); for(int p=0;p<11;p++) if(p!=5&&!pos[p]) for(int w=1;w<=5;w++) if(!(used[tm]>>w&1)) m.push_back(p*8+w); if(m.empty()) m.push_back(-1); }
  void play(int m)override{ if(m<0){ loser=tm; } else{ int p=m/8,w=m%8; pos[p]=w; used[tm]|=1<<w; tq+=w*(p-5); if(abs(tq)>8) loser=tm; } tm=3-tm; moves++; }
  bool over()const override{ return loser!=0; }
  int result()const override{ return loser==1?-1:1; } };

// ---------- 沙堆：轮流加一粒沙，满 4 粒就崩塌并染色 ----------
// 6×6 格子。每手往空格或自己的格子加一粒；任何格子满 4 粒就崩塌：减 4 粒，上下左右各加一粒并变成崩塌者的颜色，掉出边界的沙粒消失。各下 25 手后格子多者胜。
struct Sand:Game{ static const int S=6; int8_t g[S*S], o[S*S]; int moves=0;
  Sand(){ memset(g,0,sizeof g); memset(o,0,sizeof o); }
  Game*clone()const override{ return new Sand(*this); }
  void legal(vector<int>&m)const override{ m.clear(); for(int i=0;i<S*S;i++) if(!o[i]||o[i]==tm) m.push_back(i); if(m.empty()) m.push_back(-1); }
  void play(int m)override{ if(m>=0){ g[m]++; o[m]=tm; bool ch=true; int guard=0; while(ch&&guard++<500){ ch=false; for(int i=0;i<S*S;i++) if(g[i]>=4){ ch=true; g[i]-=4; int own=o[i]; if(!g[i]) o[i]=0; int x=i%S,y=i/S;
          if(x>0){g[i-1]++;o[i-1]=own;} if(x<S-1){g[i+1]++;o[i+1]=own;} if(y>0){g[i-S]++;o[i-S]=own;} if(y<S-1){g[i+S]++;o[i+S]=own;} } } }
    tm=3-tm; moves++; }
  bool over()const override{ return moves>=50; }
  int result()const override{ int s=0; for(int i=0;i<S*S;i++) s+=o[i]==1?1:o[i]==2?-1:0; return s>0?1:s<0?-1:0; } };

Game*make(const string&name){ if(name.rfind("contagion",0)==0) return new Contagion(name.size()>10?name.substr(10):"grid"); if(name=="life") return new Life(); if(name=="switch") return new Switch(); if(name.rfind("skyline",0)==0) return new Skyline(name.size()>7?atoi(name.c_str()+7):0); if(name=="seesaw") return new Seesaw(); return new Sand(); }

// ---------- 通用 UCT ----------
struct Node{ int move, par; float v=0,w=0; vector<int> kids; bool ex=false; };
int best(const Game&root,int iters,double*wr=nullptr){ vector<int> mv; root.legal(mv); if(iters==0) return mv[rnd(mv.size())];
  vector<Node> t; t.reserve(iters+2); t.push_back(Node{-9,-1});
  for(int it=0;it<iters;it++){ unique_ptr<Game> g(root.clone()); int cur=0; vector<int> path={0}; vector<int> who;
    while(!g->over()){ if(!t[cur].ex){ t[cur].ex=true; g->legal(mv); for(int m:mv){ t.push_back(Node{m,cur}); t[cur].kids.push_back(t.size()-1); } }
      int bk=-1; double bv=-1e18, lg=log(t[cur].v+1.0); for(int k:t[cur].kids){ double val=t[k].v==0?1e9+rnd(1000):t[k].w/t[k].v+0.7*sqrt(lg/t[k].v); if(val>bv){bv=val;bk=k;} }
      who.push_back(g->tm); g->play(t[bk].move); bool fresh=t[bk].v==0; cur=bk; path.push_back(bk); if(fresh) break; }
    while(!g->over()){ g->legal(mv); g->play(mv[rnd(mv.size())]); }
    int r=g->result(); for(size_t i=1;i<path.size();i++){ t[path[i]].v++; t[path[i]].w+=r==0?.5:((r>0)==(who[i-1]==1)?1:0); } t[0].v++; }
  int bm=-1; double bv=-1; for(int k:t[0].kids) if(t[k].v>bv){ bv=t[k].v; bm=t[k].move; if(wr)*wr=t[k].w/max(1.f,t[k].v); } return bm; }
int main(int argc,char**argv){ string name=argv[1], mode=argv[2];
  if(mode=="match"){ int a=atoi(argv[3]), b=atoi(argv[4]), games=atoi(argv[5]); int seed=atoi(argv[6]); int aw=0,dr=0,fw=0,len=0; double fl=0; auto t0=chrono::steady_clock::now();
    for(int gi=0;gi<games;gi++){ rng.seed(seed*1000+gi/2); unique_ptr<Game> g(make(name)); rng.seed(seed*7919+gi); bool aBlack=gi%2==0; int n=0; double last=.5; int f=0;   // 每对局同一张随机网络，双方换先
      while(!g->over()){ double wr=.5; int it=(g->tm==1)==aBlack?a:b; int who=g->tm; int m=best(*g,it,&wr); if(it){ double bw=who==1?wr:1-wr; if(n>4&&(bw-.5)*(last-.5)<0&&fabs(bw-.5)>.05) f++; if(fabs(bw-.5)>.05) last=bw; } g->play(m); n++; }
      int r=g->result(); len+=n; fl+=f; if(r==0) dr++; else{ if((r>0)==aBlack) aw++; if(r>0) fw++; } }
    printf("%s %d-%d games %d A %d draw %d first %d len %.1f flips %.2f t %.1f\n",name.c_str(),a,b,games,aw,dr,fw,(double)len/games,fl/games,chrono::duration<double>(chrono::steady_clock::now()-t0).count()); }
  else{ int it=atoi(argv[3]); rng.seed(atoi(argv[4])); unique_ptr<Game> g(make(name)); int n=0; printf("0 0 -1 0.500 %s\n",g->show().c_str()); while(!g->over()){ double wr=.5; int who=g->tm; int m=best(*g,it,&wr); g->play(m); n++; printf("%d %d %d %.3f %s\n",n,who,m,who==1?wr:1-wr,g->show().c_str()); } printf("RESULT %d\n",g->result()); } }
