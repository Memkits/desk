// 生命对决：规则演示、手筋、对局回放。
function lifeStep(c, S = 8) { const d = new Array(S * S).fill(0);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) { let a = 0, b = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (dx || dy) { const v = c[((y + dy + S) % S) * S + (x + dx + S) % S]; if (v === 1) a++; else if (v === 2) b++; }
    const i = y * S + x, n = a + b; d[i] = c[i] ? ((n === 2 || n === 3) ? c[i] : 0) : (n === 3 ? (a > b ? 1 : 2) : 0); } return d; }
const lifeParse = s => [...s].map(ch => ch === 'X' ? 1 : ch === 'O' ? 2 : 0);
const lifeMk = (cells, S = 8) => { const c = new Array(S * S).fill(0); cells.forEach(([x, y, v]) => c[y * S + x] = v); return c; };
function lifeCell(g, x, y, cs, v, s = 1, a = 1) { if (s <= 0 || !v) return; const p = cs * .1, w = (cs - 2 * p) * s; g.save(); g.globalAlpha *= a; rr(g, x + cs / 2 - w / 2, y + cs / 2 - w / 2, w, w, cs * .2 * s, PC[v]); g.globalAlpha *= .35; rr(g, x + cs / 2 - w / 2 + 3, y + cs / 2 - w / 2 + 3, w - 6, w * .4, cs * .15 * s, '#fff'); g.restore(); }
// a → b 之间进度 u；o.pop = {i,v,u} 新放的细胞；o.ring = {i: 颜色}
function drawLife(g, x, y, cs, S, a, b, u, o = {}) {
  rr(g, x - 10, y - 10, S * cs + 20, S * cs + 20, 14, 'rgba(10,15,28,.95)', C.line2, 2);
  for (let i = 0; i <= S; i++) { line(g, [[x + i * cs, y], [x + i * cs, y + S * cs]], C.line, 1.5); line(g, [[x, y + i * cs], [x + S * cs, y + i * cs]], C.line, 1.5); }
  const e = SS(u);
  for (let i = 0; i < S * S; i++) { const va = a[i], vb = b ? b[i] : va, cx = x + (i % S) * cs, cy = y + Math.floor(i / S) * cs;
    if (o.pop && o.pop.i === i) { const pu = o.pop.u; lifeCell(g, cx, cy, cs, o.pop.v, .6 + .4 * SS(pu) + .25 * Math.sin(Math.PI * CL(pu)), CL(pu * 3)); if (pu < 1.6) { g.save(); g.globalAlpha = CL(1.6 - pu); g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.arc(cx + cs / 2, cy + cs / 2, cs * (.5 + .35 * CL(pu)), 0, 7); g.stroke(); g.restore(); } continue; }
    if (va && vb) lifeCell(g, cx, cy, cs, vb); else if (va) lifeCell(g, cx, cy, cs, va, 1 - e * .6, 1 - e); else if (vb) lifeCell(g, cx, cy, cs, vb, e, e);
    if (o.ring && o.ring[i]) { g.strokeStyle = o.ring[i]; g.lineWidth = 4; g.setLineDash([8, 6]); g.strokeRect(cx + 3, cy + 3, cs - 6, cs - 6); g.setLineDash([]); } }
}
const cnt = (c, v) => c.reduce((s, q) => s + (q === v), 0);
function score2(g, x, y, a, b, big = 64) { txt(g, '蓝方', x, y, BL, fnt(700, 26)); txt(g, String(a), x + 80, y, BL, fnt(800, big, 'mono')); txt(g, '橙方', x + 250, y, OR, fnt(700, 26)); txt(g, String(b), x + 330, y, OR, fnt(800, big, 'mono')); }

// ---- 规则 ----
AN.life_rule = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk;
  if (st.k === 0) {
    const cs = 58, bw = 5 * cs, gap = (R.w - 4 * bw) / 5, y = R.y + 190;
    const demo = (i, at, nb, res, head, sub, col) => { const a = SS((tk - at) / .6); if (a <= 0) return; g.save(); g.globalAlpha = a; const x = R.x + gap + i * (bw + gap);
      const c = lifeMk([[2, 2, 1], ...nb.map(([x, y]) => [x, y, 1])], 5), dead = res === 0, u = dead ? SS((tk - at - 1.6) / .8) : 0;
      const b = c.slice(); if (dead) b[12] = 0; drawLife(g, x, y, cs, 5, c, b, u, i === 0 ? { ring: Object.fromEntries([6, 7, 8, 11, 13, 16, 17, 18].map(q => [q, C.fg3])) } : {});
      txt(g, head, x + bw / 2, y - 60, col, fnt(800, 30), 'center'); txt(g, sub, x + bw / 2, y + bw + 50, C.fg2, fnt(600, 24), 'center');
      if (i > 0) { const v = SS((tk - at - 1.6) / .5); if (dead) cross(g, x + 2.5 * cs, y + 2.5 * cs, v, C.bad, 16); else ticks(g, x + 2.5 * cs + 14, y + 2.5 * cs - 26, v, '#fff'); }
      g.restore(); };
    txt(g, '康威生命游戏：每一代，所有格子同时按邻居数更新', R.x + R.w / 2, R.y + 40, C.fg, fnt(700, 32), 'center');
    demo(0, .3, [[1, 1], [3, 2], [2, 3]], 1, '周围 8 个邻居', '数一数其中有几个活的', C.fg2);
    demo(1, .38 * d, [[1, 1], [3, 2]], 1, '2 或 3 个', '活下去', C.ok);
    demo(2, .66 * d, [[1, 1]], 0, '少于 2 个', '孤单而死', C.bad);
    demo(3, .82 * d, [[1, 1], [3, 2], [2, 3], [1, 3]], 0, '多于 3 个', '拥挤而死', C.bad);
  } else {
    const cs = 84, bw = 5 * cs, y = R.y + 170;
    txt(g, '出生：空格恰好有 3 个活邻居', R.x + R.w / 2, R.y + 40, C.fg, fnt(700, 32), 'center');
    const demo = (x, at, cells, v, sub) => { const a = SS((tk - at) / .6); if (a <= 0) return; g.save(); g.globalAlpha = a; const c = lifeMk(cells, 5), b = c.slice(); b[12] = v;
      drawLife(g, x, y, cs, 5, c, b, (tk - at - 1.8) / .9, { ring: { 12: C.fg3 } }); txt(g, sub, x + bw / 2, y + bw + 54, PC[v], fnt(700, 28), 'center'); g.restore(); };
    demo(R.x + 300, .5, [[1, 1, 1], [3, 1, 1], [2, 3, 2]], 1, '2 蓝 1 橙 → 生出蓝色');
    demo(R.x + R.w - 300 - bw, .52 * d, [[1, 1, 2], [3, 1, 1], [2, 3, 2]], 2, '1 蓝 2 橙 → 生出橙色');
  } };

// 第 k 手（从 1 数）的动画，f ∈ [0,1]
function lifePly(g, x, y, cs, k, f, o = {}) { const G = GD.life, S = 8; if (!G._st) G._st = G.st.map(lifeParse);
  if (k <= 0) return drawLife(g, x, y, cs, S, G._st[0], null, 0, o);
  const [who, m] = G.mv[k - 1], a = G._st[k - 1].slice(), b = G._st[k];
  if (f < .5) { drawLife(g, x, y, cs, S, a, null, 0, { ...o, pop: { i: m, v: who, u: f / .3 } }); return; }
  a[m] = who; drawLife(g, x, y, cs, S, a, b, (f - .55) / .45, o); }
function lifeCounts(k, f) { const G = GD.life; if (!G._st) G._st = G.st.map(lifeParse); const c = (k > 0 && f < .8) ? G._st[k - 1] : G._st[Math.max(0, k)]; let a = cnt(c, 1), b = cnt(c, 2); if (k > 0 && f < .8 && f > .1) { if (G.mv[k - 1][0] === 1) a++; else b++; } return [a, b]; }

AN.life_play = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, cs = 86, x = R.x + 60, y = R.y + 60;
  const s = seq(tk - .42 * d, [.2 * d, .16 * d, 99]); const k = tk < .42 * d ? 0 : s.i === 0 ? 1 : 2, f = tk < .42 * d ? 0 : s.i === 2 ? 1 : s.f * 1.15;
  lifePly(g, x, y, cs, k, Math.min(1, f));
  // 边缘连通的提示
  const e = SS((tk - .12 * d) / .5) * (1 - SS((tk - .3 * d) / .5)); if (e > 0) { g.save(); g.globalAlpha = e; [[0, 1], [1, 0]].forEach(([h, v]) => { const L = 8 * cs; if (h) { arrow(g, x - 16, y + L / 2, x - 56, y + L / 2, C.gold, 4); arrow(g, x + L + 56, y + L / 2, x + L + 16, y + L / 2, C.gold, 4); } else { arrow(g, x + L / 2, y - 16, x + L / 2, y - 50, C.gold, 4); arrow(g, x + L / 2, y + L + 50, x + L / 2, y + L + 16, C.gold, 4); } }); g.restore(); }
  const px = x + 8 * cs + 110, pw = R.x + R.w - px - 40; panel(g, px, y - 10, pw, 8 * cs + 20, '生命对决 · 玩法');
  const steps = [['8×8 格子，四边连通', .1], ['开局对称撒下 10 对细胞', .22], ['轮到你：在空格放一个自己的细胞', .36], ['然后整个盘面演化一代', .5], ['各下 20 手，活细胞多者胜', .8]];
  steps.forEach(([s2, at], i) => { const u = SS((tk - at * d) / .5); if (u > 0) { g.save(); g.globalAlpha = u; txt(g, String(i + 1), px + 40, y + 110 + i * 74, C.gold, fnt(800, 30, 'mono'), 'center'); txt(g, s2, px + 74, y + 110 + i * 74, C.fg, fnt(600, 27)); g.restore(); } });
  const [a, b] = lifeCounts(k, f); score2(g, px + 40, y + 8 * cs - 90, a, b);
  if (k > 0) txt(g, `第 ${k} 手 · ${PN[GD.life.mv[k - 1][0]]}${f < .5 ? '落子' : '，演化一代'}`, px + 40, y + 8 * cs - 180, C.fg2, fnt(600, 26)); };

// ---- 两种手筋 ----
AN.life_trick = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, cs = 86, x = R.x + 60, y = R.y + 60, S = 8;
  const px = x + 8 * cs + 110, pw = R.x + R.w - px - 40; let gen = 0, c, pop = null, head, lines;
  if (st.k === 0) { const base = lifeMk([[3, 3, 1], [4, 3, 1], [3, 4, 1], [4, 4, 1]]), placed = base.slice(); placed[3 * 8 + 5] = 2; const gens = [placed]; for (let i = 0; i < 4; i++) gens.push(lifeStep(gens[i]));
    head = '用法一：破坏'; lines = ['2×2 方块：每个细胞正好 3 个邻居，稳定不变', '橙方贴上一个，方块里有细胞变成 4 个邻居', '形状被打散，四代之后全部消失'];
    const tp = .46 * d, t0 = .58 * d, gd = (.94 * d - t0) / 4;
    if (tk < tp) drawLife(g, x, y, cs, S, base, null, 0); else if (tk < t0) drawLife(g, x, y, cs, S, base, null, 0, { pop: { i: 29, v: 2, u: (tk - tp) / .5 } });
    else { const s = seq(tk - t0, [gd, gd, gd, gd]); gen = s.i + (s.f > .6 ? 1 : 0); drawLife(g, x, y, cs, S, gens[s.i], gens[s.i + 1], (s.f - .15) / .6); }
    c = tk < tp ? base : gens[gen];
  } else { const base = lifeMk([[3, 3, 2], [4, 3, 2]]), placed = base.slice(); placed[4 * 8 + 3] = 2; const nxt = lifeStep(placed);
    head = '用法二：繁殖'; lines = ['两个细胞各只有 1 个邻居，下一代都会死', '补上第三个：三个互相支撑', '旁边的空格凑够 3 个邻居，生出第四个'];
    const tp = .42 * d, t0 = .66 * d;
    if (tk < tp) drawLife(g, x, y, cs, S, base, null, 0, { ring: tk > .15 * d ? { 27: C.bad, 28: C.bad } : {} }); else if (tk < t0) drawLife(g, x, y, cs, S, base, null, 0, { pop: { i: 35, v: 2, u: (tk - tp) / .5 }, ring: { 36: C.fg3 } });
    else { drawLife(g, x, y, cs, S, placed, nxt, (tk - t0) / 1); gen = tk > t0 + .6 ? 1 : 0; }
    c = tk < tp ? base : tk < t0 + .6 ? placed : nxt; }
  panel(g, px, y - 10, pw, 8 * cs + 20, head);
  lines.forEach((l, i) => { const u = SS((tk - [.05, .42, .7][i] * d) / .5); if (u > 0) { g.save(); g.globalAlpha = u; dot(g, px + 36, y + 100 + i * 96, 6, C.gold); wrapTxt(g, l, px + 60, y + 100 + i * 96, pw - 90, 36, C.fg, fnt(600, 26)); g.restore(); } });
  txt(g, `演化 ${gen} 代`, px + 40, y + 8 * cs - 180, C.fg2, fnt(600, 26)); score2(g, px + 40, y + 8 * cs - 90, cnt(c, 1), cnt(c, 2)); };

// ---- 对局回放 ----
AN.life_game = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, cs = 86, x = R.x + 60, y = R.y + 60, G = GD.life; if (!G._st) G._st = G.st.map(lifeParse);
  let k, f, o = {};
  if (st.k === 0) { const u = CL((tk - .06 * d) / (.9 * d)) * 37; k = Math.min(37, Math.floor(u) + 1); f = u >= 37 ? 1 : u - Math.floor(u); if (tk < .06 * d) { k = 0; f = 0; } }
  else if (st.k === 1) { const tp = .55 * d; if (tk < tp) { k = 37; f = 1; if (tk > .25 * d) { o.ring = {}; G._st[37].forEach((v, i) => { if (v === 1 && i < 32) o.ring[i] = '#fff'; }); } } else { k = 38; f = CL((tk - tp) / (.3 * d)); } }
  else { const s = seq(tk - .06 * d, [.3 * d, .22 * d, .3 * d, 99]); if (tk < .06 * d) { k = 38; f = 1; } else if (s.i === 0) { k = 39; f = s.f; } else if (s.i === 1) { k = 39; f = 1; } else if (s.i === 2) { k = 40; f = s.f; } else { k = 40; f = 1; } }
  lifePly(g, x, y, cs, k, f, o);
  const px = x + 8 * cs + 110, pw = R.x + R.w - px - 40; panel(g, px, y - 10, pw, 8 * cs + 20, '对局回放 · 程序自对弈');
  const kd = Math.max(0, f >= .8 ? k : k - 1), [a, b] = lifeCounts(k, f);
  txt(g, k ? `第 ${k} 手 · ${PN[G.mv[k - 1][0]]}` : '开局', px + 40, y + 96, C.fg2, fnt(600, 28)); score2(g, px + 40, y + 170, a, b);
  // 细胞数曲线
  const gx = px + 60, gy = y + 250, gw = pw - 100, gh = 330; rr(g, gx, gy, gw, gh, 8, 'rgba(255,255,255,.03)', C.line, 1.5);
  [0, 10, 20].forEach(v => { const yy = gy + gh - v / 20 * gh; txt(g, String(v), gx - 12, yy, C.fg3, fnt(500, 18, 'mono'), 'right'); if (v === 10) line(g, [[gx, yy], [gx + gw, yy]], C.line, 1, [4, 6]); });
  [0, 10, 20, 30, 40].forEach(v => txt(g, String(v), gx + v / 40 * gw, gy + gh + 22, C.fg3, fnt(500, 18, 'mono'), 'center')); txt(g, '手数', gx + gw, gy + gh + 50, C.fg3, fnt(500, 18), 'right'); txt(g, '活细胞数', gx, gy - 20, C.fg3, fnt(500, 18));
  [1, 2].forEach(v => { const pts = []; for (let i = 0; i <= kd; i++) pts.push([gx + i / 40 * gw, gy + gh - Math.min(20, cnt(G._st[i], v)) / 20 * gh]); if (pts.length > 1) line(g, pts, PC[v], 3.5); const p = pts[pts.length - 1]; dot(g, p[0], p[1], 6, PC[v]); });
  if (st.k === 0 && tk > .8 * d) fadeIn(g, (tk - .8 * d) / .5, () => chip(g, '领先的一方换了 14 次', px + 40, y + 8 * cs - 40, C.gold));
  if (st.k === 1) fadeIn(g, (tk - .25 * d) / .5, () => chip(g, tk < .8 * d ? '蓝方 9 个细胞，左上一团' : '挤死一大半：蓝方 9 → 4', px + 40, y + 8 * cs - 40, tk < .8 * d ? BL : C.bad));
  if (st.k === 2 && tk > .82 * d) fadeIn(g, (tk - .82 * d) / .5, () => chip(g, '终局 橙方 9 : 8 蓝方，橙方胜', px + 40, y + 8 * cs - 40, OR, 1, 26)); };

AN.life_res = (g, t, R, st) => { const d = BTOF(st).d; resPanel(g, t, R, { name: '生命对决', tiers: [['每步试 400 次 对 100 次', 18, 20], ['1600 次 对 400 次', 19, 20], ['6400 次 对 1600 次', 10, 12]], first: [10, 20, '正好一半'],
  at: [.42 * d, .62 * d, .82 * d], notes: [['混乱，但有技巧', C.g, ['生命游戏难以长期预测，但短期的局部计算有用']], ['不算全新', C.gold, ['和 2002 年 Levene 与 Roussos 的双人生命游戏 p2life 接近', '区别：每手只放一个细胞，不能删对方的，盘面小']], ['未验证', C.r, ['人眼能否看懂盘面', '样本只有 12 到 20 局']]] }); };
