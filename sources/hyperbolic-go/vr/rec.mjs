// 线与膜: N^3 立方格。线方(1)要用 ADJ 相邻的己方格从 z=0 连到 z=N-1；膜方(2)要阻止。线方每回合1子，膜方每回合K子。
const N=+process.env.N||5, H=+process.env.H||N, KL=+process.env.KL||1, K=+process.env.K||2, ADJ=+process.env.ADJ||6, FIRST=+process.env.FIRST||1;
const V=N*N*H, id=(x,y,z)=>x+N*(y+N*z);
const NB=[];for(let z=0;z<H;z++)for(let y=0;y<N;y++)for(let x=0;x<N;x++){const a=[];for(let dz=-1;dz<=1;dz++)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const m=Math.abs(dx)+Math.abs(dy)+Math.abs(dz);if(!m)continue;if(ADJ==6&&m>1)continue;if(ADJ==18&&m>2)continue;const X=x+dx,Y=y+dy,Z=z+dz;if(X<0||Y<0||Z<0||X>=N||Y>=N||Z>=H)continue;a.push(id(X,Y,Z));}NB[id(x,y,z)]=a;}
// ply 序列: FIRST=1: L,M*K,...; FIRST=2: M*K,L,...
const HC=+process.env.HC||0;const who=q=>{if(q<HC)return 1;const p=q-HC;const c=p%(K+KL);return FIRST==1?(c<KL?1:2):(c<K?2:1)};
function linePath(b,asEmpty){ // 线方是否连通(asEmpty: 空格算线方)
  const seen=new Uint8Array(V),st=[];for(let i=0;i<N*N;i++)if(b[i]==1||(asEmpty&&!b[i])){seen[i]=1;st.push(i)}
  while(st.length){const c=st.pop();if(c>=V-N*N)return true;for(const n of NB[c])if(!seen[n]&&(b[n]==1||(asEmpty&&!b[n]))){seen[n]=1;st.push(n)}}return false}
function winner(b){return linePath(b,false)?1:2}
function playout(b,ply){const e=[];for(let i=0;i<V;i++)if(!b[i])e.push(i);for(let i=e.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[e[i],e[j]]=[e[j],e[i]]}
  for(const c of e){b[c]=who(ply++)}return winner(b)}
function uct(b0,ply0,iters){const root={n:0,w:0,ch:null,mv:-1,pl:0};
  for(let it=0;it<iters;it++){const b=b0.slice();let ply=ply0,nd=root;const path=[root];
    while(true){if(!nd.ch){nd.ch=[];for(let i=0;i<V;i++)if(!b[i])nd.ch.push({n:0,w:0,ch:null,mv:i,pl:who(ply)});}
      if(!nd.ch.length)break;let best=null,bv=-1;const ln=Math.log(nd.n+1);
      for(const c of nd.ch){const v=c.n?c.w/c.n+0.7*Math.sqrt(ln/c.n):1e9+Math.random();if(v>bv){bv=v;best=c}}
      b[best.mv]=best.pl;ply++;path.push(best);const fresh=best.n==0;nd=best;if(fresh)break;}
    const w=playout(b,ply);for(const p of path){p.n++;if(p.pl==w)p.w++}}
  let best=null;for(const c of root.ch)if(!best||c.n>best.n)best=c;return best.mv}
function game(itL,itM){const b=new Uint8Array(V);let ply=0;const mv=[];globalThis.MV=mv;
  while(ply<V){ // 提前结束
    if(linePath(b,false))return [1,ply];if(!linePath(b,true))return [2,ply];
    const p=who(ply);const m=uct(b,ply,p==1?itL:itM);b[m]=p;mv.push([m,p]);ply++}
  return [winner(b),ply]}
const G=+process.env.G||20,itL=+process.env.IL||400,itM=+process.env.IM||400;let wl=0,pl=0;
for(let g=0;g<G;g++){const[w,p]=game(itL,itM);if(w==1)wl++;pl+=p;if(process.env.REC)console.log('REC',w,p,JSON.stringify(MV))}
console.log(`N=${N} H=${H} KL=${KL} K=${K} ADJ=${ADJ} FIRST=${FIRST} L${itL} M${itM}: 线方 ${wl}/${G}, 平均手数 ${(pl/G).toFixed(0)}/${V}`);
