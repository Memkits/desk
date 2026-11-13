// 四步循环、井字棋案例、迷宫。
const ucbv = (w, n, N) => n ? w / n + Math.SQRT2 * Math.sqrt(Math.log(N) / n) : Infinity;
let LT = null;
function loopLayout() { if (LT) return LT; const T = DM.TB, K0 = DM.slow, L = T.log[K0], vis = T.nodes.filter(n => n.born <= K0 + 1);
  const pos = {}; let leaf = 0; const rec = id => { const n = T.nodes[id], ks = n.kids.filter(k => T.nodes[k].born <= K0 + 1).sort((a, b) => T.nodes[a].mv - T.nodes[b].mv); if (!ks.length) { pos[id] = leaf++; return pos[id]; } ks.forEach(rec); pos[id] = (pos[ks[0]] + pos[ks[ks.length - 1]]) / 2; return pos[id]; }; rec(0);
  LT = { T, K0, L, vis, pos, leaves: leaf, s0: MC.statsAt(T, K0), s1: MC.statsAt(T, K0 + 1) }; return LT; }
// 画循环树。o: {pathU: 选择进度 0..len, expU, backU: 回溯进度 (0..len), ucb: 是否显示 UCB}
function drawLoopTree(g, R, o = {}) { const { T, K0, L, vis, pos, leaves, s0, s1 } = loopLayout(); const W = o.w || R.w - 60;
  const X = id => R.x + 30 + (pos[id] + .5) * W / leaves, Y = id => R.y + 80 + T.nodes[id].d * 205, path = L.path, plen = path.length - 1;
  const shown = id => T.nodes[id].born <= K0 || (id === L.exp && (o.expU ?? 0) > 0);
  const onPath = i => path.indexOf(i);
  vis.forEach(n => { if (n.id === 0 || !shown(n.id)) return; const pi = onPath(n.id), lit = pi > 0 && pi < plen && (o.pathU ?? 0) >= pi, u = n.id === L.exp ? SS(o.expU) : 1;
    g.save(); g.globalAlpha *= u; line(g, [[X(n.par), Y(n.par) + 46], [X(n.id), Y(n.id) - 46]], lit || (n.id === L.exp && o.expU > 0) ? C.gold : C.line2, lit ? 5 : 2); g.restore(); });
  vis.forEach(n => { if (!shown(n.id)) return; const id = n.id, pi = onPath(id), u = id === L.exp ? SS(o.expU) : 1; if (u <= 0) return;
    const bu = o.backU ?? -1, upd = pi >= 0 && bu >= 0 && bu >= plen - pi + .5, S = upd ? s1 : s0;
    const hl = pi >= 0 && ((o.pathU ?? -1) >= pi || upd || (bu >= 0)); g.save(); g.globalAlpha *= u; const sc = id === L.exp ? .6 + .4 * u : 1;
    tboard(g, X(id), Y(id), 19 * sc, n.b, { hl: n.mv, hlc: n.pl === 1 ? XC : OC, frame: hl ? C.gold : C.line2 });
    const w = S.w[id], nn = S.n[id]; const sw = Number.isInteger(w) ? String(w) : w.toFixed(1);
    const flash = upd && bu < plen - pi + 1.3 ? 1 - (bu - (plen - pi + .5)) / .8 : 0;
    if (flash > 0) { g.save(); g.globalAlpha *= CL(flash); rr(g, X(id) - 54, Y(id) + 44, 108, 34, 10, 'rgba(255,210,122,.3)'); g.restore(); }
    if (id === 0) txt(g, `共 ${nn} 盘`, X(id) + 52, Y(id), C.fg, fnt(700, 22, 'mono')); else txt(g, `${sw}/${nn}`, X(id), Y(id) + 61, id === 0 ? C.fg : n.pl === 1 ? '#9FD0FF' : '#FFCF94', fnt(700, 22, 'mono'), 'center');
    if (o.ucb && n.par >= 0 && id !== L.exp) { const p = T.nodes[n.par], pp = onPath(p.id); if (pp >= 0 && pp < plen - 1 + 1 && (o.pathU ?? 0) >= pp && (o.pathU ?? 0) < pp + 1.6 && p.untried.length + 0 >= 0) { const v = ucbv(s0.w[id], s0.n[id], s0.n[p.id]); if (pp === 0 || pi === pp + 1) txt(g, 'UCB ' + v.toFixed(2), X(id), Y(id) - 58, pi === pp + 1 ? C.gold : C.fg3, fnt(700, 19, 'mono'), 'center'); } }
    g.restore(); });
  return { X, Y }; }
AN.idea = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, Rr = { x: R.x, y: R.y, w: 1100, h: R.h }; fadeIn(g, tk / .6, () => drawLoopTree(g, Rr, { w: 1040 }));
  const { T, K0, pos } = loopLayout(), x = R.x + 1160;
  fadeIn(g, (tk - .15 * d) / .6, () => { const kids = T.nodes[0].kids; rr(g, R.x + 30, R.y + 230, 1040, 120, 14, null, C.gold, 2.5); txt(g, '根节点下面的每一种走法 = 一台老虎机', R.x + 550, R.y + 370, C.gold, fnt(700, 24), 'center'); });
  fadeIn(g, (tk - .3 * d) / .6, () => { txt(g, '每个节点记两个数', x, R.y + 120, C.fg3, fnt(600, 24)); txt(g, '赢了几分 / 一共下了几盘', x, R.y + 170, C.fg, fnt(800, 32)); txt(g, '（站在走这一步的一方看）', x, R.y + 215, C.fg3, fnt(500, 22)); });
  fadeIn(g, (tk - .5 * d) / .6, () => { txt(g, '拉一次老虎机', x, R.y + 320, C.fg3, fnt(600, 24)); txt(g, '= 从那里随机下一盘', x, R.y + 370, C.fg, fnt(800, 32)); txt(g, '用 UCB 决定下一盘', x, R.y + 450, C.fg3, fnt(600, 24)); txt(g, '从哪里开始下', x, R.y + 500, C.fg, fnt(800, 32)); });
  fadeIn(g, (tk - .7 * d) / .6, () => { rr(g, x - 20, R.y + 580, 560, 100, 16, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '= 蒙特卡洛树搜索', x + 260, R.y + 630, C.gold, fnt(800, 36), 'center'); });
  fadeIn(g, (tk - .1 * d) / .6, () => txt(g, `井字棋：蓝方必须堵中间一列 · 已搜 ${K0} 轮`, R.x + 550, R.y + 790, C.fg3, fnt(500, 22), 'center')); };
const STEPS = [['选择', C.b], ['扩展', C.g], ['模拟', C.p], ['回溯', C.gold]];
AN.loop = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, k = st.k, { T, K0, L } = loopLayout(), plen = L.path.length - 1, Rr = { x: R.x, y: R.y, w: 1160, h: R.h };
  STEPS.forEach(([s, col], i) => { const on = i === k; rr(g, R.x + 1230 + i * 120, R.y - 10, 108, 52, 12, on ? col : 'rgba(255,255,255,.04)', on ? col : C.line2, 2); txt(g, `${i + 1} ${s}`, R.x + 1284 + i * 120, R.y + 16, on ? '#0B1020' : C.fg3, fnt(800, 22), 'center'); });
  const o = { w: 1100, ucb: k === 0 };
  if (k === 0) o.pathU = CL((tk - .15 * d) / (.6 * d)) * (plen - 1 + .6) + .4; else o.pathU = plen;
  o.expU = k === 0 ? 0 : k === 1 ? SS((tk - .2 * d) / .8) : 1;
  if (k === 3) o.backU = CL((tk - .1 * d) / (.65 * d)) * (plen + 1.4);
  drawLoopTree(g, Rr, o);
  const x = R.x + 1230, nd = T.nodes[L.exp];
  if (k === 0) { card(g, x, R.y + 80, 470, 340, '1 选择', ['从根出发，每层挑 UCB 分数最高的孩子', '走到一个还有走法没试过的节点就停'], C.b, SS(tk / .6), false, 24);
    fadeIn(g, (tk - .5 * d) / .6, () => txt(g, 'UCB = 赢的比例 + 奖励', x + 10, R.y + 480, C.gold, fnt(700, 26))); }
  if (k === 1) card(g, x, R.y + 80, 470, 300, '2 扩展', ['挑一种没试过的走法', '长出一个新节点（赢 0 / 0 盘）'], C.g, SS(tk / .6), false, 24);
  if (k === 2) { const seq = L.seq, kk = Math.floor(CL((tk - .15 * d) / (.5 * d)) * (seq.length + .99)), b = boardAfter(nd.b, seq, kk);
    card(g, x, R.y + 80, 470, 220, '3 模拟', ['从新节点开始乱下到底', '不留在树上，只留结果'], C.p, SS(tk / .6), false, 24);
    fadeIn(g, (tk - .1 * d) / .5, () => { tboard(g, x + 235, R.y + 480, 80, b, { newi: kk ? seq[kk - 1] : -1, newu: ((tk - .15 * d) / (.5 * d) * (seq.length + .99)) % 1 * 3 }); line(g, [[R.x + 30 + 1100 * (loopLayout().pos[L.exp] + .5) / loopLayout().leaves + 60, R.y + 80 + nd.d * 205], [x + 100, R.y + 480]], C.p, 2, [6, 6]);
      if (kk >= seq.length) { const w = L.w; chip(g, w === 1 ? '结果：蓝方赢' : w === 3 ? '结果：平局' : '结果：橙方赢', x + 140, R.y + 650, w === 1 ? XC : w === 3 ? C.fg2 : OC, 1, 26); } }); }
  if (k === 3) { const w = L.w; card(g, x, R.y + 80, 470, 380, '4 回溯', ['沿原路送回根节点', '每个节点：盘数 +1', w === 3 ? '平局：每个节点各加半分' : (w === 1 ? '蓝方赢：蓝方走的那几层加 1 分' : '橙方赢：橙方走的那几层加 1 分'), '另一方的那几层不加'], C.gold, SS(tk / .6), false, 24);
    const bu = o.backU; if (bu < plen + .5) { const lt = drawLoopTree.__x; } } };
AN.many = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, T = DM.TB, K0 = DM.slow + 1, k = Math.round(LERP(K0, 400, SS((tk - .05 * d) / (.55 * d)))), S = MC.statsAt(T, k), kids = T.nodes[0].kids.map(i => T.nodes[i]).sort((a, b) => a.mv - b.mv);
  const mx = Math.max(...kids.map(c => S.n[c.id])), best = kids.reduce((a, c) => S.n[c.id] > S.n[a.id] ? c : a);
  txt(g, `已搜 ${k} 轮`, R.x + 40, R.y + 30, C.fg, fnt(800, 34));
  kids.forEach((c, i) => { const x = R.x + 120 + i * 230, y = R.y + 560, h = 380 * S.n[c.id] / Math.max(60, mx), isB = c === best && tk > .62 * d;
    rr(g, x, y - h, 130, Math.max(2, h), 10, isB ? C.gold : 'rgba(92,180,255,.7)'); txt(g, String(S.n[c.id]), x + 65, y - h - 22, C.fg, fnt(700, 26, 'mono'), 'center');
    tboard(g, x + 65, y + 90, 26, c.b, { hl: c.mv, hlc: XC, frame: isB ? C.gold : C.line2 }); txt(g, '平均 ' + pct(S.w[c.id] / S.n[c.id]), x + 65, y + 160, C.fg2, fnt(600, 21), 'center'); });
  fadeIn(g, (tk - .62 * d) / .6, () => { const x = R.x + 1290; card(g, x, R.y + 120, 430, 420, '最后选哪一步？', ['选盘数最多的', '盘数多 = 每一轮比较都站得住', '平均分高、盘数少的可能只是运气好'], C.gold, 1, true, 24); }); };

// ---------- 05 井字棋 ----------
const chkAt = k => DM.Achk.reduce((a, c) => Math.abs(Math.log(c.k / k)) < Math.abs(Math.log(a.k / k)) ? c : a);
AN.fix = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, A = DM.A;
  [[100, .05], [1000, .3], [10000, .55]].forEach(([k, at], i) => { const u = SS((tk - at * d) / .6); if (u <= 0) return; const c = chkAt(k), tot = Object.values(c.row).reduce((s, r) => s + r[0], 0), lab = new Array(9).fill(null), heat = new Array(9).fill(0); let bm = -1, bn = -1;
    Object.entries(c.row).forEach(([m, [n]]) => { lab[m] = pct(n / tot); heat[m] = n / tot * 1.6; if (n > bn) { bn = n; bm = +m; } });
    g.save(); g.globalAlpha = u; const x = R.x + 260 + i * 560; tboard(g, x, R.y + 190, 100, A, { heat, lab, labs: .26, hl: bm }); txt(g, `${k.toLocaleString()} 轮`, x, R.y + 30, C.fg, fnt(800, 32), 'center');
    txt(g, `推荐：${bm === 4 ? '中间' : bm === 6 ? '左下角' : '其他'}`, x, R.y + 370, bm === 6 ? C.ok : C.gold, fnt(700, 26), 'center'); g.restore(); });
  const u = SS((tk - .05 * d) / (.8 * d)); if (tk < .05 * d) return;
  const ser = m => DM.Achk.map(c => { const tot = Object.values(c.row).reduce((s, r) => s + r[0], 0); return [c.k, (c.row[m] || [0])[0] / tot]; });
  chart(g, R.x + 300, R.y + 470, 1100, 260, { xr: [10, 10000], logx: 1, yr: [0, 1], u, yt: [0, .5, 1], yf: v => pct(v), xt: [10, 100, 1000, 10000], xf: v => v.toLocaleString(), xl: '搜索轮数（对数刻度）', yl: '这一步分到的盘数占比',
    series: [{ pts: ser(4), col: C.gold, lab: '中间' }, { pts: ser(6), col: XC, lw: 5, lab: '左下角' }] }); };
AN.fixwhy = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, A = DM.A, b6 = A.slice(); b6[6] = 1; const b60 = b6.slice(); b60[0] = 2;
  fadeIn(g, tk / .6, () => { tboard(g, R.x + 130, R.y + 200, 56, b6, { hl: 6, hlc: XC }); txt(g, '蓝方下左下角之后', R.x + 130, R.y + 50, C.fg2, fnt(600, 22), 'center'); txt(g, '下面两层', R.x + 130, R.y + 330, C.fg3, fnt(600, 22), 'center'); });
  DM.A6.forEach((S, j) => { const u = SS((tk - (.15 + j * .3) * d) / .6); if (u <= 0) return; g.save(); g.globalAlpha = u; const x0 = R.x + 300 + j * 720, w = 680;
    panel(g, x0, R.y + 10, w, 700, `搜了 ${S.k.toLocaleString()} 轮时`);
    const grp = (items, y, head, col, best, base, pl) => { txt(g, head, x0 + 24, y, col, fnt(700, 23)); const mx = Math.max(4, ...items.map(c => c.n)); items.slice().sort((a, b) => a.mv - b.mv).forEach((c, i) => { const yy = y + 50 + i * 46, bb = base.slice(); bb[c.mv] = pl; tboard(g, x0 + 50, yy, 12, bb, { hl: c.mv, hlc: col }); const bw = 420 * c.n / mx; rr(g, x0 + 90, yy - 13, Math.max(3, bw), 26, 7, c.mv === best ? col : col === OC ? 'rgba(255,178,92,.3)' : 'rgba(92,180,255,.3)'); txt(g, String(c.n), x0 + 102 + Math.max(3, bw), yy, C.fg, fnt(700, 20, 'mono')); }); };
    grp(S.kids, R.y + 90, '橙方的应对（盘数）', OC, 0, b6, 2); grp(S.x, R.y + 440, '橙方堵左上角之后，蓝方的下一步', XC, 4, b60, 1); g.restore(); });
  fadeIn(g, (tk - .75 * d) / .6, () => banner(g, R, '每一层都在用 UCB：橙方学会了堵，蓝方学会了摆出两条线', 1)); };
let ICI = null;
AN.shape = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, T = DM.TE, E = DM.Eck, fi = CL((tk - .05 * d) / (.7 * d)) * (E.length - 1), i0 = Math.floor(fi), i1 = Math.min(E.length - 1, i0 + 1), f = fi - i0;
  const N = id => LERP(E[i0].n[id], E[i1].n[id], f), k = Math.round(LERP(E[i0].k, E[i1].k, f));
  const kids = T.nodes[0].kids.map(i => T.nodes[i]), heat = new Array(9).fill(0), lab = new Array(9).fill(null), r = N(0);
  kids.forEach(c => { heat[c.mv] = N(c.id) / r * 2; lab[c.mv] = pct(N(c.id) / r); });
  tboard(g, R.x + 220, R.y + 280, 120, new Array(9).fill(0), { heat, lab, labs: .24 }); txt(g, `空棋盘 · 已搜 ${k.toLocaleString()} 轮`, R.x + 220, R.y + 30, C.fg, fnt(700, 26), 'center'); txt(g, '第一步的盘数占比', R.x + 220, R.y + 520, C.fg3, fnt(500, 22), 'center');
  const x0 = R.x + 520, W = 1180, rh = 120, y0 = R.y + 40;
  const rec = (id, x, w) => { const n = T.nodes[id]; if (w < 1) return; if (n.d > 0) { g.fillStyle = n.pl === 1 ? `rgba(92,180,255,${.85 - n.d * .09})` : `rgba(255,178,92,${.85 - n.d * .09})`; g.fillRect(x + .5, y0 + (n.d - 1) * rh, Math.max(.5, w - 1), rh - 14); if (n.d === 1 && w > 60) tboard(g, x + w / 2, y0 + rh / 2 - 7, 28, n.b, { bg: false, lw: 1.5 }); }
    if (n.d >= 6) return; const nn = N(id); let xx = x; n.kids.slice().sort((a, b) => T.nodes[a].mv - T.nodes[b].mv).forEach(c => { const cw = w * N(c) / Math.max(1, nn); rec(c, xx, cw); xx += cw; }); };
  rec(0, x0, W); for (let dd = 1; dd <= 6; dd++) txt(g, `第 ${dd} 步`, x0 - 14, y0 + (dd - .5) * rh - 7, C.fg3, fnt(500, 19), 'right');
  fadeIn(g, (tk - .45 * d) / .6, () => txt(g, '宽度 = 盘数。好棋下面又宽又深，坏棋下面只有短枝', x0 + W / 2, y0 + 6 * rh + 30, C.fg2, fnt(600, 24), 'center')); };
AN.converge2 = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, u = SS((tk - .05 * d) / (.6 * d));
  const ser = m => DM.Achk.filter(c => c.row[m]).map(c => [c.k, c.row[m][1]]);
  chart(g, R.x + 140, R.y + 80, 950, 520, { xr: [10, 10000], logx: 1, yr: [0, 1], u, yt: [0, .5, 1], yf: v => v === 1 ? '1（赢）' : v === .5 ? '½（平）' : '0（输）', xt: [10, 100, 1000, 10000], xf: v => v.toLocaleString(), xl: '搜索轮数（对数刻度）', yl: '树搜索估计的平均分',
    series: [{ pts: [[10, 1], [10000, 1]], col: 'rgba(92,180,255,.6)', dash: [8, 8] }, { pts: [[10, .5], [10000, .5]], col: 'rgba(255,210,122,.6)', dash: [8, 8] }, { pts: ser(6), col: XC, lw: 5, lab: '左下角 → 赢', ldy: -16 }, { pts: ser(4), col: C.gold, lab: '中间', ldy: 16 }] });
  fadeIn(g, (tk - .1 * d) / .6, () => txt(g, '虚线：把树画完得到的真实价值', R.x + 140, R.y + 700, C.fg3, fnt(500, 21)));
  const x = R.x + 1220; fadeIn(g, (tk - .5 * d) / .6, () => { txt(g, '它只需要知道规则', x, R.y + 120, C.fg, fnt(800, 34)); [['哪些走法合法', C.b], ['什么时候结束', C.p], ['谁赢了', C.g]].forEach(([s, col], i) => chip(g, s, x, R.y + 220 + i * 90, col, SS((tk - (.55 + i * .07) * d) / .5), 28));
    fadeIn(g, (tk - .8 * d) / .5, () => txt(g, '不需要任何打分的知识', x, R.y + 520, C.gold, fnt(700, 28))); }); };

// ---------- 06 迷宫 ----------
function mazeDraw(g, x0, y0, s, o = {}) { const Z = DM.Z; for (let y = 0; y < Z.H; y++) for (let x = 0; x < Z.W; x++) { const i = y * Z.W + x; if (Z.wall[i]) rr(g, x0 + x * s + 1, y0 + y * s + 1, s - 2, s - 2, 6, '#2A3550'); else { const h = o.heat ? o.heat[i] : 0; rr(g, x0 + x * s + 1, y0 + y * s + 1, s - 2, s - 2, 6, h > 0 ? `rgba(95,224,160,${CL(.05 + h * .75)})` : 'rgba(255,255,255,.03)'); } }
  const gx = x0 + (Z.G % Z.W + .5) * s, gy = y0 + ((Z.G / Z.W | 0) + .5) * s; g.save(); g.fillStyle = C.gold; g.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? s * .17 : s * .4; g.lineTo(gx + Math.cos(a) * r, gy + Math.sin(a) * r); } g.fill(); g.restore(); }
const mxy = (x0, y0, s, p) => [x0 + (p % DM.Z.W + .5) * s, y0 + ((p / DM.Z.W | 0) + .5) * s];
AN.maze = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, k = st.k, s = 66, x0 = R.x + 30, y0 = R.y + 60, Z = DM.Z, P = p => mxy(x0, y0, s, p), x = R.x + 960;
  if (k === 0) { mazeDraw(g, x0, y0, s); const [sx, sy] = P(Z.S); bot(g, sx, sy + 6, C.p, .9);
    fadeIn(g, (tk - .5 * d) / .6, () => { const [gx, gy] = P(Z.G); line(g, [[sx, sy + 30], [gx, gy - 30]], C.bad, 4, [10, 8]); cross(g, sx, y0 + 4.5 * s, 1, C.bad, 16); });
    fadeIn(g, tk / .6, () => { txt(g, '机器人要走到星星那里', x, R.y + 120, C.fg, fnt(800, 36)); txt(g, '墙的开口在背面（下方）', x, R.y + 180, C.fg2, fnt(600, 28)); });
    fadeIn(g, (tk - .5 * d) / .6, () => txt(g, '直着走过去会撞墙', x, R.y + 260, C.bad, fnt(700, 28)));
    fadeIn(g, (tk - .7 * d) / .6, () => card(g, x, R.y + 340, 700, 260, '一个人的问题，同样的四步', ['每个节点 = 机器人在某个格子', '每一步有上下左右几种走法', '模拟 = 随机乱走，到终点越快分越高'], C.g, 1, false, 24)); return; }
  if (k === 1) { const D0 = DM.mz[0], m = Math.floor(CL((tk - .05 * d) / (.75 * d)) * D0.walks.length), mx = Math.max(...D0.heat), heat = Array.from(D0.heat, v => Math.sqrt(v / mx) * CL(m / D0.walks.length * 1.2));
    mazeDraw(g, x0, y0, s, { heat }); const [sx, sy] = P(Z.S);
    for (let i = Math.max(0, m - 25); i < m; i++) { const w = D0.walks[i], a = (1 - (m - i) / 25) * .7; g.save(); g.globalAlpha = a; line(g, w.map(p => { const [px, py] = P(p); return [px + (i % 7 - 3) * 2, py + (i % 5 - 2) * 2]; }), D0.T.log[i].r > 0 ? C.gold : 'rgba(199,155,255,.8)', D0.T.log[i].r > 0 ? 3 : 1.5); g.restore(); }
    bot(g, sx, sy + 6, C.p, .9);
    const hits = DM.mz[0].T.log.slice(0, m).filter(L => L.r > 0).length;
    txt(g, `已搜 ${Math.round(m / D0.walks.length * 1500)} 轮`, x, R.y + 120, C.fg, fnt(800, 34)); txt(g, '紫线：随机乱走　金线：碰巧走到终点的', x, R.y + 180, C.fg2, fnt(600, 24)); txt(g, '绿色越亮：树在这个格子上花的盘数越多', x, R.y + 225, C.ok, fnt(600, 24));
    fadeIn(g, (tk - .5 * d) / .6, () => card(g, x, R.y + 300, 700, 250, '大多数乱走都白费了', ['碰巧绕到开口的那几次，把分数送回树上', '树就沿着绕行的方向长过去'], C.gold, 1, true, 24)); return; }
  const n = DM.mz.length, f = CL((tk - .05 * d) / (.75 * d)) * n, i = Math.min(n - 1, Math.floor(f)), D0 = DM.mz[i], mx = Math.max(...D0.heat), heat = Array.from(D0.heat, v => Math.sqrt(v / mx) * .8);
  mazeDraw(g, x0, y0, s, { heat }); const trail = DM.mz.slice(0, i + 1).map(z => P(z.p)); if (f >= n) trail.push(P(DM.mzEnd)); line(g, trail, C.p, 6);
  const fr = f >= n ? 1 : SS(f - i), a = P(D0.p), b = P(D0.next), rp = [LERP(a[0], b[0], fr), LERP(a[1], b[1], fr)]; bot(g, rp[0], rp[1] + 6, C.p, .9);
  txt(g, `第 ${Math.min(n, Math.floor(f) + 1)} 步`, x, R.y + 120, C.fg, fnt(800, 40)); txt(g, '每一步之前都重新搜 1,500 轮', x, R.y + 180, C.fg2, fnt(600, 26));
  fadeIn(g, (tk - .82 * d) / .5, () => { rr(g, x, R.y + 260, 700, 150, 16, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, `${n} 步到达 · 最短也是 ${n} 步`, x + 350, R.y + 310, C.gold, fnt(800, 34), 'center'); txt(g, '没有人告诉它墙在哪里', x + 350, R.y + 365, C.fg2, fnt(600, 26), 'center'); }); };
AN.apps = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, w = 520;
  [['化学合成', ['从目标分子往回拆，每一步选一个反应，直到拆成买得到的原料', '例：Segler 等，2018 年《自然》'], C.g], ['任务调度', ['一步一步决定下一件事交给哪台机器，最后看总用时'], C.b], ['游戏里的对手', ['战略游戏的电脑对手，在每回合之前把将来试很多遍', '例：《全面战争：罗马 2》的战役 AI'], C.o]].forEach(([h, s, col], i) => { const u = SS((tk - (.1 + i * .15) * d) / .6); if (u <= 0) return; card(g, R.x + i * (w + 40), R.y + 60, w, 330, h, s, col, u, false, 25); });
  fadeIn(g, (tk - .62 * d) / .6, () => { rr(g, R.x, R.y + 450, 1640, 150, 16, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '能写成一步一步的选择 + 最后有一个分数', R.x + 820, R.y + 505, C.fg, fnt(800, 36), 'center'); txt(g, '就可以试试', R.x + 820, R.y + 560, C.gold, fnt(700, 28), 'center'); }); };
