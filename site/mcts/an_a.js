// 公共画法 + 开场、树太大、随机模拟、老虎机。
const XC = BL, OC = OR, YAWT = t => .6 + t * .16;
const pct = x => Math.round(x * 100) + '%';
// 井字棋盘。cx, cy 为中心，s 为格宽。o: {heat:[0..1], lab:[str], labc, hl:idx, hlc, a, newi, newu, lw, sym}
function tboard(g, cx, cy, s, b, o = {}) {
  g.save(); g.globalAlpha *= o.a ?? 1; const x0 = cx - 1.5 * s, y0 = cy - 1.5 * s;
  if (o.bg !== false) rr(g, x0 - s * .12, y0 - s * .12, s * 3.24, s * 3.24, s * .16, 'rgba(14,20,36,.92)', o.frame || C.line2, Math.max(1, s * .03));
  for (let i = 0; i < 9; i++) { const x = x0 + (i % 3) * s, y = y0 + ((i / 3) | 0) * s;
    if (o.heat && o.heat[i] > 0) { g.fillStyle = `rgba(255,210,122,${.08 + .6 * CL(o.heat[i])})`; g.beginPath(); g.roundRect(x + s * .06, y + s * .06, s * .88, s * .88, s * .12); g.fill(); }
    if (o.hl === i || (o.hls && o.hls.includes(i))) rr(g, x + s * .06, y + s * .06, s * .88, s * .88, s * .12, null, o.hlc || C.gold, Math.max(2, s * .06)); }
  const lw = o.lw || Math.max(1.5, s * .045);
  for (let k = 1; k < 3; k++) { line(g, [[x0 + k * s, y0 + s * .08], [x0 + k * s, y0 + 3 * s - s * .08]], C.line2, lw); line(g, [[x0 + s * .08, y0 + k * s], [x0 + 3 * s - s * .08, y0 + k * s]], C.line2, lw); }
  for (let i = 0; i < 9; i++) { const v = b[i]; if (!v) { if (o.lab && o.lab[i] != null) txt(g, o.lab[i], x0 + (i % 3 + .5) * s, y0 + ((i / 3 | 0) + .5) * s, (o.labc && o.labc[i]) || C.fg, fnt(800, Math.round(s * (o.labs || .3)), 'mono'), 'center'); continue; }
    const u = o.newi === i ? SS(o.newu ?? 1) : 1; if (u <= 0) continue; const x = x0 + (i % 3 + .5) * s, y = y0 + ((i / 3 | 0) + .5) * s, r = s * .28 * (.6 + .4 * u);
    g.save(); g.globalAlpha *= u; g.lineCap = 'round';
    if (v === 1) { g.strokeStyle = XC; g.lineWidth = Math.max(2, s * .1); g.beginPath(); g.moveTo(x - r, y - r); g.lineTo(x + r, y + r); g.moveTo(x + r, y - r); g.lineTo(x - r, y + r); g.stroke(); }
    else { g.strokeStyle = OC; g.lineWidth = Math.max(2, s * .1); g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); }
    g.restore(); }
  g.restore();
}
const cellXY = (cx, cy, s, i) => [cx + (i % 3 - 1) * s, cy + ((i / 3 | 0) - 1) * s];
// 折线图。series: [{pts:[[x,y]], col, lw, lab}]；xr/yr 数据范围；u 揭示进度（按 x）
function chart(g, x, y, w, h, o) {
  const { xr, yr } = o, X = v => x + (o.logx ? (Math.log10(v) - Math.log10(xr[0])) / (Math.log10(xr[1]) - Math.log10(xr[0])) : (v - xr[0]) / (xr[1] - xr[0])) * w, Y = v => y + h - (v - yr[0]) / (yr[1] - yr[0]) * h;
  rr(g, x - 20, y - 20, w + 40, h + 40, 14, 'rgba(14,20,36,.7)');
  (o.yt || []).forEach(v => { line(g, [[x, Y(v)], [x + w, Y(v)]], C.line, 1.5); txt(g, o.yf ? o.yf(v) : String(v), x - 14, Y(v), C.fg3, fnt(500, 19, 'mono'), 'right'); });
  (o.xt || []).forEach(v => txt(g, o.xf ? o.xf(v) : String(v), X(v), y + h + 26, C.fg3, fnt(500, 19, 'mono'), 'center'));
  line(g, [[x, y + h], [x + w, y + h]], C.line2, 2);
  if (o.xl) txt(g, o.xl, x + w, y + h + 56, C.fg3, fnt(500, 19), 'right'); if (o.yl) txt(g, o.yl, x, y - 36, C.fg3, fnt(500, 19));
  const xm = o.u == null ? xr[1] : (o.logx ? 10 ** LERP(Math.log10(xr[0]), Math.log10(xr[1]), CL(o.u)) : LERP(xr[0], xr[1], CL(o.u)));
  o.series.forEach(s => { if (s.dash) { line(g, s.pts.map(p => [X(p[0]), Y(p[1])]), s.col, s.lw || 2, s.dash); return; }
    const pts = s.pts.filter(p => p[0] <= xm).map(p => [X(p[0]), Y(p[1])]); if (pts.length < 2) return; line(g, pts, s.col, s.lw || 3);
    const L = pts[pts.length - 1]; dot(g, L[0], L[1], (s.lw || 3) + 2, s.col); if (s.lab) txt(g, s.lab, L[0] + 12, L[1] + (s.ldy || 0), s.col, fnt(700, 21)); });
  return { X, Y };
}
// 径向树（开场用）：按最终盘数分配角度
function radialTree(T, maxD) { const pos = new Map(); const rec = (id, a0, a1) => { const nd = T.nodes[id]; pos.set(id, [(a0 + a1) / 2, nd.d]); if (nd.d >= maxD) return; const ks = nd.kids.filter(k => T.nodes[k].n > 0), tot = ks.reduce((s, k) => s + T.nodes[k].n, 0); let a = a0; ks.sort((p, q) => T.nodes[p].mv - T.nodes[q].mv).forEach(k => { const da = (a1 - a0) * T.nodes[k].n / tot; rec(k, a, a + da); a += da; }); }; rec(0, -Math.PI, Math.PI); return pos; }
let RT = null;
AN.open = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, T = DM.TE; if (!RT) RT = radialTree(T, 5);
  const cx = R.x + 520, cy = R.y + 400, k = st.k === 0 ? Math.round(10 ** LERP(.5, 4, SS((tk - 3.5) / (d - 4)))) : 10000;
  const a = st.k === 0 ? SS((tk - 3.6) / 1) : 1 - .55 * SS(tk / 1.2);
  if (a > 0) { g.save(); g.globalAlpha = a; RT.forEach(([an, dd], id) => { const nd = T.nodes[id]; if (id === 0 || nd.born > k) return; const p = RT.get(nd.par), r0 = p[1] * 70, r1 = dd * 70;
    const u = CL((k - nd.born) / (k * .15 + 3)); line(g, [[cx + Math.cos(p[0]) * r0, cy + Math.sin(p[0]) * r0], [cx + Math.cos(an) * r1, cy + Math.sin(an) * r1]], nd.pl === 1 ? 'rgba(92,180,255,.45)' : 'rgba(255,178,92,.45)', 1.2 + Math.min(3, Math.log10(1 + nd.n) * .2 * u));
    if (dd <= 2) dot(g, cx + Math.cos(an) * r1, cy + Math.sin(an) * r1, 3 + dd, nd.pl === 1 ? XC : OC); });
    dot(g, cx, cy, 10, C.fg); g.restore();
    if (st.k === 0) txt(g, `已经搜索 ${k.toLocaleString()} 轮`, cx, R.y + 790, C.fg3, fnt(600, 24), 'center'); }
  const x = R.x + 1060;
  if (st.k === 0) { [['二〇一六', 'AlphaGo 战胜李世石', .3], ['二〇一七', 'AlphaZero 自学国际象棋、将棋和围棋', .38], ['这个系列', '检验新棋的对弈程序', .5]].forEach(([y0, s, at], i) => fadeIn(g, (tk - at * d) / .6, () => { txt(g, y0, x, R.y + 180 + i * 130, C.fg3, fnt(600, 24)); txt(g, s, x, R.y + 222 + i * 130, C.fg, fnt(700, 32)); }));
    fadeIn(g, (tk - .72 * d) / .6, () => { rr(g, x - 20, R.y + 560, 640, 110, 16, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '同一个算法：蒙特卡洛树搜索', x + 300, R.y + 615, C.gold, fnt(800, 34), 'center'); }); }
  else { fadeIn(g, tk / .6, () => { txt(g, '不会判断好坏，就随便下到底', x, R.y + 120, C.fg, fnt(800, 40)); txt(g, '哪一步有希望，就在哪一步多花时间', x, R.y + 190, C.gold, fnt(700, 32)); });
    [['井字棋', '被随机模拟骗了的局面'], ['老虎机', '试新的，还是用熟的'], ['迷宫', '一个人的规划'], ['围棋', '从 MoGo 到 AlphaGo'], ['线与膜', '拿搜索当量尺']].forEach(([n, s], i) => fadeIn(g, (tk - (.3 + i * .07) * d) / .5, () => { chip(g, n, x, R.y + 300 + i * 82, [C.b, C.gold, C.g, C.p, C.o][i], 1, 26); txt(g, s, x + 150, R.y + 300 + i * 82, C.fg2, fnt(500, 26)); }));
    fadeIn(g, (tk - .82 * d) / .6, () => txt(g, '文稿与画面由 AI（Claude）生成 · 配音由 AI 合成 · 树、老虎机与迷宫的数据由程序实际运行得到', R.x + R.w / 2, R.y + 760, C.fg3, fnt(500, 23), 'center')); } };

// ---------- 01 树太大 ----------
AN.tree = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, cx = R.x + R.w / 2, E = new Array(9).fill(0);
  fadeIn(g, tk / .5, () => { tboard(g, cx, R.y + 70, 22, E); txt(g, '当前局面', cx + 60, R.y + 70, C.fg3, fnt(600, 22)); });
  const L = [9, 72, 504, 3024, 15120], y0 = R.y + 200;
  L.forEach((n, li) => { const u = SS((tk - (.12 + li * .14) * d) / .8); if (u <= 0) return; const y = y0 + li * 125, w = [1100, 1300, 1400, 1450, 1500][li], x0 = cx - w / 2;
    g.save(); g.globalAlpha = u;
    if (li === 0) { for (let i = 0; i < 9; i++) { const b = E.slice(); b[i] = 1; const x = x0 + (i + .5) * w / 9; line(g, [[cx, R.y + 110], [x, y - 40]], C.line2, 2); tboard(g, x, y, 22, b, { newi: i, newu: u }); } }
    else { const m = Math.min(n, 400), pw = L[li - 1] <= 72 ? Math.min(1500, 160 * li ** 1.6) : 0; for (let i = 0; i < m * u; i++) { const x = x0 + (i + .5) * w / m; if (li === 1) { const pi = Math.floor(i / 8), px = cx - 1100 / 2 + (pi + .5) * 1100 / 9; line(g, [[px, y - 125 + 30], [x, y - 6]], 'rgba(92,180,255,.18)', 1); }
      dot(g, x, y, li === 1 ? 5 : 3, li % 2 ? OC : XC); } }
    txt(g, `第 ${li + 1} 步`, R.x + 10, y, C.fg3, fnt(600, 22)); txt(g, n.toLocaleString() + ' 种', R.x + R.w - 10, y, C.fg, fnt(700, 26, 'mono'), 'right');
    g.restore(); });
  fadeIn(g, (tk - .82 * d) / .6, () => txt(g, '……一直分叉到棋局结束', cx, y0 + 5 * 125 - 10, C.fg2, fnt(600, 26), 'center')); };

// 极小化极大：三个空格的小树，按真实规则算
let MMT = null;
function mmTree(b) { const nd = { b, w: MC.winner(b), kids: [] }; if (!nd.w) { const p = MC.toMove(b); for (const m of MC.moves(b)) { const c = b.slice(); c[m] = p; const k = mmTree(c); k.mv = m; k.pl = p; nd.kids.push(k); } nd.v = p === 1 ? Math.max(...nd.kids.map(k => k.v)) : Math.min(...nd.kids.map(k => k.v)); nd.turn = p; } else nd.v = nd.w === 3 ? 0 : nd.w === 1 ? 1 : -1; return nd; }
AN.minimax = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk; if (!MMT) { MMT = mmTree(DM.M); let leaf = 0; const lay = (n, dep) => { n.dep = dep; if (!n.kids.length) { n.x = leaf++; return; } n.kids.forEach(k => lay(k, dep + 1)); n.x = n.kids.reduce((s, k) => s + k.x, 0) / n.kids.length; }; lay(MMT, 0); MMT.leaves = leaf; }
  const W = R.w - 200, X = x => R.x + 100 + (x + .5) * W / MMT.leaves, Y = dep => R.y + 60 + dep * 190, s = 22, maxDep = 3;
  const vcol = v => v > 0 ? XC : v < 0 ? OC : C.fg2, vs = v => v > 0 ? '蓝胜' : v < 0 ? '橙胜' : '平';
  const all = []; const walk = n => { all.push(n); n.kids.forEach(walk); }; walk(MMT);
  const show = SS(tk / .8), leafU = SS((tk - .25 * d) / .6), up = dep => SS((tk - (.42 + (maxDep - dep) * .12) * d) / .6);
  g.save(); g.globalAlpha = show;
  all.forEach(n => n.kids.forEach(k => line(g, [[X(n.x), Y(n.dep) + 42], [X(k.x), Y(k.dep) - 42]], C.line2, 2)));
  all.forEach(n => { tboard(g, X(n.x), Y(n.dep), s, n.b, { hl: n.mv, hlc: n.pl === 1 ? XC : OC });
    const u = n.kids.length ? up(n.dep) : leafU; if (u > 0) { g.save(); g.globalAlpha *= u; chip(g, vs(n.v), X(n.x) + 44, Y(n.dep) + 40, vcol(n.v), 1, 20); g.restore(); } });
  g.restore();
  [[0, '蓝方走：取最大'], [1, '橙方走：取最小'], [2, '蓝方走：取最大']].forEach(([dep, s2]) => { const u = up(dep); if (u > 0 && Y(dep) < R.y + 700) fadeIn(g, u, () => txt(g, s2, R.x - 60, Y(dep) - 70, dep % 2 ? OC : XC, fnt(700, 22))); });
  fadeIn(g, (tk - .82 * d) / .6, () => { const n = MMT.kids.find(k => k.v === MMT.v); banner(g, R, `结论：蓝方下在右下角，直接连成一条线（这棵树一共 ${all.length} 个局面）`, 1); }); };

AN.size = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, x = R.x + 330, w = 1250, E = 370, X = e => x + w * e / E;
  const rows = [['井字棋', '所有可能的对局', 5.4, '约 26 万盘', C.g], ['国际象棋', '博弈树的规模（估计）', 120, '约 10¹²⁰', C.b], ['围棋', '博弈树的规模（估计）', 360, '约 10³⁶⁰', C.p]];
  txt(g, '数字的位数（对数刻度）', x, R.y + 40, C.fg3, fnt(500, 21));
  [0, 100, 200, 300].forEach(e => { line(g, [[X(e), R.y + 70], [X(e), R.y + 620]], C.line, 1.5); txt(g, e ? `10^${e}` : '1', X(e), R.y + 650, C.fg3, fnt(500, 19, 'mono'), 'center'); });
  rows.forEach(([n, s, e, lab, col], i) => { const u = SS((tk - (.05 + i * .18) * d) / .9); if (u <= 0) return; const y = R.y + 140 + i * 160;
    txt(g, n, R.x + 20, y - 14, C.fg, fnt(800, 34)); txt(g, s, R.x + 20, y + 26, C.fg3, fnt(500, 20)); rr(g, x, y - 22, Math.max(14, (X(e) - x) * u), 44, 10, col); if (u > .9) txt(g, lab, Math.max(x + 30, X(e) * 1) + 16, y, C.fg, fnt(700, 26), 'left'); });
  const ua = SS((tk - .6 * d) / .6); if (ua > 0) { g.save(); g.globalAlpha = ua; line(g, [[X(80), R.y + 70], [X(80), R.y + 620]], C.gold, 3, [8, 6]); txt(g, '宇宙中的原子 ≈ 10⁸⁰', X(80) + 12, R.y + 86, C.gold, fnt(700, 22)); g.restore(); }
  fadeIn(g, (tk - .8 * d) / .6, () => banner(g, R, '井字棋一眨眼就能算完；国际象棋和围棋的树永远画不完', 1)); };

AN.evalfn = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, lx = R.x + 40, rx = R.x + 900;
  fadeIn(g, tk / .6, () => { panel(g, lx, R.y + 20, 800, 640, '只看几步，然后打分');
    const P = [[400, 150, '现在']]; const rt = [lx + 400, R.y + 120]; dot(g, rt[0], rt[1], 12, C.fg);
    for (let i = 0; i < 3; i++) { const a = [lx + 160 + i * 240, R.y + 250]; line(g, [rt, a], C.line2, 2); dot(g, a[0], a[1], 9, XC); for (let j = 0; j < 3; j++) { const b = [a[0] - 70 + j * 70, R.y + 380]; line(g, [a, b], C.line2, 2); dot(g, b[0], b[1], 7, OC);
      const u = SS((tk - .15 * d - (i * 3 + j) * .05 * d) / .4); if (u > 0) { g.save(); g.globalAlpha = u; const v = [+3, -1, +2, 0, -4, +1, +5, -2, +1][i * 3 + j]; chip(g, (v > 0 ? '+' : '') + v, b[0] - 22, R.y + 440, v >= 0 ? XC : OC, 1, 19); g.restore(); } } }
    line(g, [[lx + 40, R.y + 400], [lx + 760, R.y + 400]], C.gold, 2, [6, 6]); txt(g, '看到这里就停，打分', lx + 40, R.y + 374, C.gold, fnt(600, 20));
    txt(g, '打分：数一数双方的子力，比如', lx + 40, R.y + 530, C.fg2, fnt(600, 24)); txt(g, '后 9　车 5　象 3　马 3　兵 1', lx + 40, R.y + 580, C.fg, fnt(700, 28, 'mono')); });
  fadeIn(g, (tk - .55 * d) / .6, () => { panel(g, rx, R.y + 20, 760, 640, '围棋：这个局面谁好？');
    const s = 52, ox = rx + 380 - 4 * s, oy = R.y + 110, Rn = mkRng(17);
    for (let i = 0; i < 9; i++) { line(g, [[ox, oy + i * s], [ox + 8 * s, oy + i * s]], '#6B5A3A', 2); line(g, [[ox + i * s, oy], [ox + i * s, oy + 8 * s]], '#6B5A3A', 2); }
    for (let i = 0; i < 81; i++) { const r = Rn(); if (r < .52) { const x = ox + (i % 9) * s, y = oy + ((i / 9) | 0) * s; dot(g, x, y, s * .44, r < .26 ? '#0B0F18' : '#E9EEF7'); if (r < .26) { g.strokeStyle = '#444'; g.lineWidth = 1; g.beginPath(); g.arc(x, y, s * .44, 0, 7); g.stroke(); } } }
    txt(g, '？', rx + 380, oy + 4 * s, C.gold, fnt(900, 160), 'center');
    txt(g, '子都一样，价值全看形状和死活', rx + 380, R.y + 610, C.fg2, fnt(600, 24), 'center'); }); };

// ---------- 02 随便下到底 ----------
AN.ulam = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, x0 = R.x + 640, y0 = R.y + 40, s = 64, Rn = mkRng(3), res = [];
  for (let i = 0; i < 100; i++) res.push(Rn() < .32);
  fadeIn(g, tk / .6, () => { txt(g, '一局单人纸牌', R.x + 40, R.y + 80, C.fg3, fnt(600, 26)); txt(g, '能玩通的概率是多少？', R.x + 40, R.y + 140, C.fg, fnt(800, 40));
    [0, 1, 2, 3].forEach(i => { g.save(); g.translate(R.x + 150 + i * 70, R.y + 330); g.rotate((i - 1.5) * .18); rr(g, -50, -75, 100, 150, 10, '#E9EEF7', '#9AA6BE', 2); txt(g, ['A', '7', 'K', '3'][i], -34, -50, i % 2 ? '#C43B3B' : '#0B1020', fnt(800, 30)); txt(g, i % 2 ? '♥' : '♠', 0, 10, i % 2 ? '#C43B3B' : '#0B1020', fnt(800, 54), 'center'); g.restore(); }); });
  const n = Math.floor(CL((tk - .3 * d) / (.6 * d)) * 100); let win = 0;
  for (let i = 0; i < 100; i++) { const x = x0 + (i % 10) * (s + 8), y = y0 + ((i / 10) | 0) * (s + 8); if (i < n) { if (res[i]) win++; rr(g, x, y, s, s, 10, res[i] ? 'rgba(95,211,154,.25)' : 'rgba(255,107,107,.12)', res[i] ? C.ok : 'rgba(255,107,107,.5)', 2); if (res[i]) ticks(g, x + s / 2 - 16, y + s / 2, 1); else cross(g, x + s / 2, y + s / 2, 1, 'rgba(255,107,107,.8)', 9); } else rr(g, x, y, s, s, 10, null, C.line, 1.5); }
  if (n > 0) { txt(g, `玩了 ${n} 局，通了 ${win} 局`, R.x + 40, R.y + 520, C.fg, fnt(700, 32)); txt(g, `≈ ${pct(win / n)}`, R.x + 40, R.y + 580, C.gold, fnt(800, 44, 'mono')); }
  fadeIn(g, (tk - .9 * d) / .5, () => txt(g, '（示意，数字不是真实的通关率）', R.x + 40, R.y + 640, C.fg3, fnt(500, 20))); };

function boardAfter(b, seq, k) { b = b.slice(); for (let i = 0; i < k && i < seq.length; i++) b[seq[i]] = MC.toMove(b); return b; }
AN.playout = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, A = DM.A;
  fadeIn(g, tk / .6, () => { txt(g, '蒙特卡洛方法', R.x + 40, R.y + 50, C.fg3, fnt(600, 24)); txt(g, '用随机抽样代替精确计算', R.x + 40, R.y + 100, C.fg, fnt(800, 38)); });
  const u0 = SS((tk - .38 * d) / .6); if (u0 <= 0) return;
  g.save(); g.globalAlpha = u0; txt(g, '一次模拟：双方闭着眼睛乱下，直到分出胜负', R.x + 40, R.y + 200, C.gold, fnt(700, 28)); g.restore();
  const games = DM.Arand.map(r => ({ m: r.m, g: r.games[0] })).slice(0, 6);
  games.forEach((G, i) => { const x = R.x + 150 + i * 270, y = R.y + 420, t0 = .42 * d + i * .07 * d, seq = [G.m, ...G.g.seq], k = Math.floor(CL((tk - t0) / 2.4) * (seq.length + .99));
    if (tk < t0) return; const b = boardAfter(A, seq, k); tboard(g, x, y, 62, b, { newi: k > 0 ? seq[k - 1] : -1, newu: ((tk - t0) / 2.4 * (seq.length + .99)) % 1 * 3, hl: G.m, hlc: XC });
    if (k >= seq.length) { const w = G.g.w; chip(g, w === 1 ? '蓝胜 记 1' : w === 3 ? '平局 记 ½' : '橙胜 记 0', x - 70, y + 150, w === 1 ? XC : w === 3 ? C.fg2 : OC, 1, 22); } });
  fadeIn(g, (tk - .85 * d) / .5, () => txt(g, '每个格子都这样下很多盘，平均分高的就是好棋', R.x + R.w / 2, R.y + 720, C.fg2, fnt(600, 26), 'center')); };

AN.converge = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, A = DM.A, u = SS((tk - .25 * d) / (.6 * d)), k = Math.max(1, Math.round(u * 1000));
  const avg = DM.Arand.map(r => r.cum[k] / k), lab = new Array(9).fill(null), heat = new Array(9).fill(0);
  const best = DM.Arand.reduce((a, r) => r.avg > a.avg ? r : a);
  DM.Arand.forEach((r, j) => { lab[r.m] = tk > .25 * d ? pct(avg[j]) : ''; heat[r.m] = (avg[j] - .4) / .35; });
  fadeIn(g, tk / .6, () => { tboard(g, R.x + 300, R.y + 360, 150, A, { heat: tk > .25 * d ? heat : null, lab, labs: .24, hl: tk > .85 * d ? best.m : -1 }); txt(g, '轮到蓝方（叉）', R.x + 300, R.y + 40, C.fg2, fnt(600, 26), 'center'); });
  if (tk > .2 * d) { const S = DM.Arand.map(r => ({ col: r.m === 4 ? C.gold : r.m === 6 ? XC : 'rgba(163,174,195,.45)', lw: r.m === 4 || r.m === 6 ? 4 : 2, lab: r.m === 4 ? '中间' : r.m === 6 ? '左下角' : '', ldy: r.m === 6 ? 14 : -10, pts: r.cum.map((c, i) => [i, i ? c / i : .5]).filter((p, i) => i >= 5 && (i < 60 || i % 5 === 0)) }));
    chart(g, R.x + 760, R.y + 80, 800, 520, { xr: [5, 1000], yr: [.3, .9], u, series: S, yt: [.3, .5, .7, .9], yf: v => pct(v), xt: [5, 250, 500, 750, 1000], xl: '每格随机下的盘数', yl: '平均分（赢 1，平 ½）' });
    txt(g, `每格已下 ${k} 盘`, R.x + 1160, R.y + 720, C.fg, fnt(700, 28), 'center'); }
  fadeIn(g, (tk - .86 * d) / .5, () => txt(g, '随机模拟推荐：中间', R.x + 300, R.y + 640, C.gold, fnt(800, 32), 'center')); };

AN.wrong = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, A = DM.A, seq = [6, 0, 4], cx = R.x + 330, cy = R.y + 330, s = 150;
  const k = tk < .05 * d ? 0 : Math.min(3, 1 + Math.floor((tk - .05 * d) / (.12 * d))), b = boardAfter(A, seq, k);
  tboard(g, cx, cy, s, b, { newi: k ? seq[k - 1] : -1, newu: ((tk - .05 * d) / (.12 * d)) % 1 * 2.5 });
  txt(g, ['', '蓝：左下角', '橙：只能堵上面', '蓝：中间，两条线同时差一子'][k], cx, R.y + 600, C.fg, fnt(700, 28), 'center');
  if (k === 3) { const u = SS((tk - .45 * d) / .5); g.save(); g.globalAlpha = u; [[3, 5], [6, 2]].forEach(([a, c]) => { const p = cellXY(cx, cy, s, a), q = cellXY(cx, cy, s, c); line(g, [p, q], C.gold, 8, [14, 10]); }); g.restore(); }
  const x = R.x + 760; fadeIn(g, (tk - .5 * d) / .6, () => { panel(g, x, R.y + 20, 840, 300, '把树画完（极小化极大）的答案');
    const lab = new Array(9).fill(null), lc = new Array(9).fill(null); DM.Amoves.forEach((m, j) => { const v = DM.Amm[j]; lab[m] = v > 0 ? '赢' : v < 0 ? '输' : '平'; lc[m] = v > 0 ? C.ok : v < 0 ? C.bad : C.fg2; });
    tboard(g, x + 160, R.y + 190, 60, A, { lab, labc: lc, labs: .42 }); txt(g, '只有左下角能赢', x + 320, R.y + 150, C.ok, fnt(800, 30)); txt(g, '中间和上面两个角：和棋', x + 320, R.y + 205, C.fg2, fnt(600, 24)); txt(g, '其他：会输', x + 320, R.y + 250, C.fg2, fnt(600, 24)); });
  fadeIn(g, (tk - .72 * d) / .6, () => { card(g, x, R.y + 360, 400, 250, '随机模拟以为', ['对手也在乱下', '中间的“平均分”最高'], C.fg3, 1, false, 24); card(g, x + 440, R.y + 360, 400, 250, '真正的对手', ['会挑对自己最好的一步', '只看最坏的情况'], C.gold, 1, true, 24); }); };

// ---------- 03 老虎机 ----------
function slot(g, x, y, i, o = {}) { const col = [C.r, C.b, C.p, C.g][i]; g.save(); g.globalAlpha *= o.a ?? 1;
  rr(g, x - 80, y - 110, 160, 220, 18, 'rgba(14,20,36,.95)', o.hi ? C.gold : col, o.hi ? 4 : 2.5); rr(g, x - 58, y - 82, 116, 70, 10, '#05070D', C.line2, 2);
  txt(g, o.p != null ? pct(o.p) : '?', x, y - 47, o.p != null ? C.gold : C.fg3, fnt(800, 34, 'mono'), 'center');
  txt(g, '机器 ' + 'ABCD'[i], x, y + 30, C.fg, fnt(700, 26), 'center'); line(g, [[x + 80, y - 40], [x + 104, y - 40], [x + 104, y - 110 + (o.pull || 0) * 60]], C.fg3, 5); dot(g, x + 104, y - 116 + (o.pull || 0) * 60, 12, C.r);
  if (o.sub) txt(g, o.sub, x, y + 78, C.fg2, fnt(600, 21), 'center'); g.restore(); }
AN.bandit = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, reveal = SS((tk - .7 * d) / .6);
  for (let i = 0; i < 4; i++) { const a = SS((tk - i * .25) / .6); slot(g, R.x + 280 + i * 380, R.y + 240, i, { a, p: reveal > .5 ? DM.P[i] : null, pull: i === Math.floor(tk * 1.3) % 4 ? .5 + .5 * Math.sin(tk * 9) : 0 }); }
  fadeIn(g, (tk - .3 * d) / .6, () => { txt(g, '每台中奖的概率不一样，但你不知道', R.x + R.w / 2, R.y + 470, C.fg, fnt(700, 32), 'center'); txt(g, '一共可以拉 10,000 次，怎样中奖最多？', R.x + R.w / 2, R.y + 530, C.gold, fnt(700, 30), 'center'); });
  fadeIn(g, reveal, () => txt(g, '（揭晓：这是程序里设的真实概率，拉的人看不到）', R.x + R.w / 2, R.y + 600, C.fg3, fnt(500, 22), 'center')); };
function pullRow(g, x, y, H, tt, name, col, note) { const N = H[Math.max(0, tt - 1)], n = tt ? N.n : [0, 0, 0, 0];
  txt(g, name, x, y - 70, col, fnt(800, 30)); txt(g, note, x, y - 28, C.fg3, fnt(500, 21));
  for (let i = 0; i < 4; i++) { const X = x + i * 190, bw = 120, h = Math.min(260, n[i] * .85); rr(g, X, y + 280 - h, bw, Math.max(2, h), 8, [C.r, C.b, C.p, C.g][i]); txt(g, 'ABCD'[i], X + bw / 2, y + 310, C.fg2, fnt(700, 24), 'center'); txt(g, String(n[i]), X + bw / 2, y + 262 - h, C.fg, fnt(700, 23, 'mono'), 'center');
    if (tt && H[tt - 1].a === i) rr(g, X - 6, y + 274 - h, bw + 12, Math.max(2, h) + 12, 10, null, C.gold, 3); } }
AN.greedy = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, tt = Math.round(CL((tk - .05 * d) / (.8 * d)) * 300);
  pullRow(g, R.x + 40, R.y + 120, DM.run.greedy, Math.min(tt, tk < .5 * d ? tt : 300), '贪心', C.fg, '每台先试一次，以后只拉平均最高的');
  fadeIn(g, (tk - .38 * d) / .6, () => pullRow(g, R.x + 900, R.y + 120, DM.run.eps, tt, '每十次试一次别的', C.fg, '其余九次拉平均最高的'));
  txt(g, `已拉 ${tt} 次`, R.x + R.w / 2, R.y + 520, C.fg2, fnt(600, 26), 'center');
  fadeIn(g, (tk - .3 * d) / .5, () => txt(g, 'D 一开始运气差，被永远放弃了', R.x + 380, R.y + 600, C.bad, fnt(700, 26), 'center'));
  fadeIn(g, (tk - .75 * d) / .5, () => txt(g, '找到了 D，但每十次仍有一次白白浪费', R.x + 1240, R.y + 600, C.gold, fnt(700, 26), 'center')); };
AN.ucb = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, H = DM.run.ucb, tt = Math.max(5, Math.round(10 ** LERP(.7, 2.6, SS((tk - .25 * d) / (.65 * d)))));
  fadeIn(g, tk / .6, () => { rr(g, R.x + 300, R.y + 10, 1120, 120, 16, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, '分数 = 平均中奖率 + 奖励', R.x + 360, R.y + 50, C.fg, fnt(800, 34)); txt(g, '奖励 = √( 2 × ln 总次数 ÷ 这台的次数 )', R.x + 360, R.y + 100, C.gold, fnt(700, 28, 'mono')); });
  if (tk < .2 * d) return; const N = H[tt - 1], tot = tt; const sc = N.n.map((n, i) => [N.s[i] / n, Math.sqrt(2 * Math.log(tot) / n)]); const nxt = H[Math.min(H.length - 1, tt)].a;
  const y0 = R.y + 700, Hh = 330, Yv = v => y0 - v / 2 * Hh * 1.6;
  [0, .5, 1, 1.5, 2].forEach(v => { if (Yv(v) < R.y + 190) return; line(g, [[R.x + 300, Yv(v)], [R.x + 1420, Yv(v)]], C.line, 1.2); txt(g, v.toFixed(1), R.x + 285, Yv(v), C.fg3, fnt(500, 18, 'mono'), 'right'); });
  sc.forEach(([m, b], i) => { const x = R.x + 380 + i * 270, w = 140, top = Math.max(R.y + 190, Yv(m + b));
    rr(g, x, Yv(m), w, y0 - Yv(m), 6, [C.r, C.b, C.p, C.g][i]); g.fillStyle = 'rgba(255,210,122,.25)'; g.fillRect(x, top, w, Yv(m) - top); g.strokeStyle = C.gold; g.setLineDash([6, 5]); g.lineWidth = 2; g.strokeRect(x, top, w, Yv(m) - top); g.setLineDash([]);
    if (i === nxt) { rr(g, x - 8, top - 8, w + 16, y0 - top + 16, 10, null, C.gold, 4); txt(g, '下一次拉它', x + w / 2, top - 30, C.gold, fnt(700, 22), 'center'); }
    txt(g, 'ABCD'[i], x + w / 2, y0 + 28, C.fg, fnt(800, 26), 'center'); txt(g, `拉了 ${N.n[i]} 次`, x + w / 2, y0 + 62, C.fg2, fnt(500, 21), 'center'); });
  txt(g, `总次数 ${tt}`, R.x + 1500, R.y + 260, C.fg, fnt(700, 30)); rr(g, R.x + 1500, R.y + 320, 30, 24, 4, C.b); txt(g, '平均中奖率', R.x + 1544, R.y + 332, C.fg2, fnt(500, 21)); rr(g, R.x + 1500, R.y + 370, 30, 24, 4, 'rgba(255,210,122,.25)', C.gold, 2); txt(g, '奖励', R.x + 1544, R.y + 382, C.fg2, fnt(500, 21)); };
AN.regret = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, u = SS((tk - .1 * d) / (.75 * d)), pts = a => DM.reg[a].map((v, i) => [i * 50, v]);
  chart(g, R.x + 120, R.y + 60, 1000, 600, { xr: [0, 10000], yr: [0, 1200], u, yt: [0, 300, 600, 900, 1200], xt: [0, 2500, 5000, 7500, 10000], xf: v => v.toLocaleString(), xl: '拉的次数', yl: '损失：比一直拉最好那台少中的次数（100 次实验的平均）',
    series: [{ pts: pts('greedy'), col: C.fg2, lab: '贪心' }, { pts: pts('eps'), col: C.r, lab: '每十次试一次' }, { pts: pts('ucb'), col: C.gold, lw: 5, lab: 'UCB' }] });
  const x = R.x + 1300; fadeIn(g, (tk - .2 * d) / .6, () => card(g, x, R.y + 60, 420, 220, '一开始', ['UCB 试得多，损失比“每十次试一次”还大'], C.r, 1, false, 23));
  fadeIn(g, (tk - .62 * d) / .6, () => card(g, x, R.y + 310, 420, 250, '拉得越久', ['另外两种按比例往上涨', 'UCB 越涨越慢，约和对数成正比'], C.gold, 1, true, 23)); };
