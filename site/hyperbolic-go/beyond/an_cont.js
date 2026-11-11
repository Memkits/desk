// 蔓延：网络上落子 + 自动扩散。
function contStep(c, adj) { const d = c.slice(); for (let i = 0; i < c.length; i++) { let a = 0, b = 0; adj[i].forEach(j => { if (c[j] === 1) a++; else if (c[j] === 2) b++; });
  if (!c[i]) { if (a >= 2 && a > b) d[i] = 1; else if (b >= 2 && b > a) d[i] = 2; } else { const e = c[i] === 1 ? b : a; if (2 * e > adj[i].length) d[i] = 3 - c[i]; } } return d; }
function mkAdj(n, E) { const adj = Array.from({ length: n }, () => []); E.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); }); return adj; }
// 画网络：a → b 进度 u；o.pop = {i,v,u}；o.ring = {i:颜色}；o.r 半径
function drawNet(g, P, E, a, b, u, o = {}) { const r = o.r || 26, e = SS(u);
  E.forEach(([p, q]) => { const same = a[p] && a[p] === a[q] && (!b || b[p] === a[p] && b[q] === a[q]); line(g, [P[p], P[q]], same ? PC[a[p]] : C.line2, same ? 5 : 3); });
  P.forEach(([x, y], i) => { let va = a[i], vb = b ? b[i] : va;
    dot(g, x, y, r, '#0B1020'); g.strokeStyle = C.fg3; g.lineWidth = 2.5; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke();
    if (o.pop && o.pop.i === i) { const pu = o.pop.u; g.save(); g.globalAlpha = CL(pu * 3); dot(g, x, y, r * (.7 + .3 * SS(pu) + .3 * Math.sin(Math.PI * CL(pu))), PC[o.pop.v]); g.restore(); if (pu < 1.6) { g.save(); g.globalAlpha = CL(1.6 - pu); g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.arc(x, y, r * (1.2 + .6 * CL(pu)), 0, 7); g.stroke(); g.restore(); } }
    else if (va === vb) { if (va) dot(g, x, y, r, PC[va]); }
    else { if (va) dot(g, x, y, r, PC[va]); g.save(); g.globalAlpha = e; dot(g, x, y, r * (va ? 1 : .5 + .5 * e), PC[vb]); g.restore(); if (e > 0 && e < 1) { g.save(); g.globalAlpha = 1 - e; g.strokeStyle = PC[vb]; g.lineWidth = 4; g.beginPath(); g.arc(x, y, r * (1 + e), 0, 7); g.stroke(); g.restore(); } }
    if (o.ring && o.ring[i]) { g.strokeStyle = o.ring[i]; g.lineWidth = 4; g.setLineDash([7, 6]); g.beginPath(); g.arc(x, y, r + 10, 0, 7); g.stroke(); g.setLineDash([]); }
    if (o.lab && o.lab[i]) txt(g, o.lab[i], x, y + r + 26, C.fg2, fnt(600, 20), 'center'); }); }

// 规则演示用的小网络
const CN = { P: [[0, 0], [1, -1], [2, 0], [1, 1], [3, -1], [3, 1], [4, 0], [5, -1], [5, 1], [2, -2], [0, 2], [4, 2]], E: [[0, 1], [0, 3], [1, 2], [3, 2], [2, 4], [2, 5], [4, 6], [5, 6], [6, 7], [6, 8], [1, 9], [4, 9], [3, 10], [5, 11], [8, 11]] };
AN.cont_rule = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, sx = 150, sy = 135, ox = R.x + 120, oy = R.y + 400, P = CN.P.map(([x, y]) => [ox + x * sx, oy + y * sy]), adj = mkAdj(12, CN.E);
  const px = R.x + 1000, pw = R.x + R.w - px - 40; let head, lines, at;
  const E0 = new Array(12).fill(0);
  if (st.k === 0) { head = '蔓延 · 玩法'; lines = ['网络：节点和连线', '每一手：占一个无主的节点', '然后整个网络自动扩散一步', '全部有主时，节点多者胜']; at = [.2, .5, .68, .9];
    const tp = .52 * d; drawNet(g, P, CN.E, E0, null, 0, tk > tp ? { pop: { i: 2, v: 1, u: (tk - tp) / .5 } } : {});
  } else if (st.k === 1) { head = '规则一：占领'; lines = ['无主节点：同一方的邻居至少 2 个，', '并且比对方的邻居多 → 被占领', '只有 1 个邻居：不扩散', '两颗子配合才能带出新的节点']; at = [.05, .25, .55, .8];
    // 蓝：2 已有；再占 9 → 节点 1、4 各有 2 个蓝邻居
    const a = E0.slice(); a[2] = 1; const tp = .5 * d, ts = .66 * d; const b = a.slice(); b[9] = 1; const c2 = contStep(b, adj);
    if (tk < tp) drawNet(g, P, CN.E, a, null, 0, { ring: tk > .2 * d ? { 1: C.fg3, 4: C.fg3 } : {}, lab: tk > .2 * d ? { 1: '1 个蓝邻居', 4: '1 个蓝邻居' } : {} });
    else if (tk < ts) drawNet(g, P, CN.E, a, null, 0, { pop: { i: 9, v: 1, u: (tk - tp) / .5 }, ring: { 1: '#fff', 4: '#fff' }, lab: { 1: '2 个蓝邻居', 4: '2 个蓝邻居' } });
    else drawNet(g, P, CN.E, b, c2, (tk - ts) / 1);
  } else { head = '规则二：倒戈'; lines = ['有主节点：对方的邻居超过', '它邻居总数的一半 → 倒戈', '连线少的节点容易被策反', '全部有主时，节点多者胜']; at = [.05, .2, .6, .85];
    // 蓝 1,2,4,5,9；橙 6,8。橙占 11 → 节点 5（3 条连线）有 2 个橙邻居，倒戈
    const a = E0.slice(); [1, 2, 4, 5, 9].forEach(i => a[i] = 1); a[6] = 2; a[8] = 2; const tp = .34 * d, ts = .5 * d; const b = a.slice(); b[11] = 2; const c2 = contStep(b, adj);
    if (tk < tp) drawNet(g, P, CN.E, a, null, 0, { ring: tk > .12 * d ? { 5: '#fff' } : {}, lab: tk > .12 * d ? { 5: '3 条连线' } : {} });
    else if (tk < ts) drawNet(g, P, CN.E, a, null, 0, { pop: { i: 11, v: 2, u: (tk - tp) / .5 }, ring: { 5: '#fff' }, lab: { 5: '1 蓝 2 橙' } });
    else drawNet(g, P, CN.E, b, c2, (tk - ts) / 1, { lab: { 5: '倒戈' } }); }
  panel(g, px, R.y + 60, pw, 520, head);
  lines.forEach((l, i) => { const u = SS((tk - at[i] * d) / .5); if (u > 0) { g.save(); g.globalAlpha = u; txt(g, l, px + 40, R.y + 170 + i * 88, C.fg, fnt(600, 27)); g.restore(); } }); };

AN.cont_fix = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, x = R.x + 120, y = R.y + 40, w = 1480;
  panel(g, x, y, w, 330, '每回合一手：两个一样强的程序对下，先手赢了多少局');
  [['方格网络', 16], ['小世界网络', 19], ['无标度网络', 20]].forEach(([l, v], i) => wbar(g, x + 40, y + 110 + i * 74, w - 80, l, v, 20, (tk - .2 * d - i * .5) / .8, C.bad));
  const u = SS((tk - .62 * d) / .6); if (u <= 0) return; g.save(); g.globalAlpha = u; panel(g, x, y + 370, w, 330, '改成：第一回合一手，之后每回合两手');
  const seqs = [1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2]; let cx = x + 60; seqs.forEach((v, i) => { const a = SS((tk - .68 * d - i * .18) / .3); if (a <= 0) return; g.globalAlpha = u * a; const gapb = i > 0 && seqs[i - 1] !== v ? 34 : 8; cx += i ? gapb : 0; rr(g, cx, y + 470, 96, 96, 18, PC[v]); txt(g, String(i + 1), cx + 48, y + 518, '#0B1020', fnt(800, 38, 'mono'), 'center'); cx += 96; });
  g.globalAlpha = u; txt(g, '数字是第几手。先手多下的那一手被抵消，和六子棋的办法一样。', x + 60, y + 630, C.fg2, fnt(500, 24)); g.restore(); };

// ---- 对局回放（6×6 方格网络） ----
const CG = (() => { const E = []; for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) { const i = y * 6 + x; if (x < 5) E.push([i, i + 1]); if (y < 5) E.push([i, i + 6]); } return { E }; })();
AN.cont_game = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, G = GD.cont; if (!G._st) G._st = G.st.map(lifeParse);
  const sp = 128, ox = R.x + 150, oy = R.y + 80, P = []; for (let i = 0; i < 36; i++) P.push([ox + (i % 6) * sp, oy + Math.floor(i / 6) * sp]);
  const rng = [[0, 3], [3, 7], [7, 13]][st.k], n = rng[1] - rng[0], a0 = .1 * d, slot = (.95 * d - a0) / n;
  let k = rng[0], f = 1; if (tk >= a0) { const u = Math.min(n - 1e-6, (tk - a0) / slot); k = rng[0] + Math.floor(u) + 1; f = u - Math.floor(u); if (tk >= .95 * d) { k = rng[1]; f = 1; } }
  if (k > rng[0] || tk >= a0) { const [who, m] = G.mv[k - 1], a = G._st[k - 1].slice();
    if (f < .4) drawNet(g, P, CG.E, a, null, 0, { r: 30, pop: { i: m, v: who, u: f / .25 } }); else { a[m] = who; drawNet(g, P, CG.E, a, G._st[k], (f - .45) / .4, { r: 30 }); }
  } else drawNet(g, P, CG.E, G._st[k], null, 0, { r: 30 });
  const px = R.x + 1010, pw = R.x + R.w - px - 40; panel(g, px, R.y + 50, pw, 700, '对局回放 · 6×6 方格网络');
  const kd = f >= .8 ? k : Math.max(0, k - 1), c = G._st[kd]; txt(g, k ? `第 ${k} 手 · ${PN[G.mv[k - 1][0]]}` : '开局', px + 40, R.y + 150, C.fg2, fnt(600, 28)); score2(g, px + 40, R.y + 230, cnt(c, 1), cnt(c, 2));
  // 手顺条
  txt(g, '手顺', px + 40, R.y + 330, C.fg3, fnt(500, 20)); G.mv.forEach(([who], i) => { const bx = px + 40 + i * 44; rr(g, bx, R.y + 356, 38, 38, 8, i < k ? PC[who] : 'rgba(255,255,255,.05)', i === k - 1 ? '#fff' : null, 3); txt(g, String(i + 1), bx + 19, R.y + 376, i < k ? '#0B1020' : C.fg3, fnt(700, 18, 'mono'), 'center'); });
  const notes = [['橙方两手夹一个空点', '空点有 2 个橙邻居 → 染成橙色'], ['每一手要算它能带出几个节点', '扩散只在落子后发生一步'], ['各自筑墙，网络一分为二', '终局 18 : 18，平局']][st.k];
  notes.forEach((s, i) => fadeIn(g, (tk - [.45, .7][i] * d) / .5, () => { dot(g, px + 50, R.y + 480 + i * 70, 6, C.gold); txt(g, s, px + 72, R.y + 480 + i * 70, C.fg, fnt(600, 25)); })); };

AN.cont_res = (g, t, R, st) => { const d = BTOF(st).d; resPanel(g, t, R, { name: '蔓延（方格网络，每回合两手）', tiers: [['每步试 400 次 对 100 次', 18, 20], ['1600 次 对 400 次', 18, 20]], first: [2, 20, '另有 8 局平局；后手占优', C.bad],
  at: [.3 * d, .5 * d, .75 * d], notes: [['技巧梯度明显', C.g, ['多想四倍：20 局赢 18 局']], ['公平性有问题', C.r, ['每步试 800 次：后手占优', '每步试 6000 次：8 局全部 18 : 18 平局']], ['下一步', C.gold, ['更大的网络，或者换一种平衡办法']]] }); };

// ---- 方格 vs 随机网络 ----
AN.cont_net = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk;
  if (!AN._ba) { const rnd = mkRng(11), n = 40, E = [[0, 1], [1, 2], [0, 2]], ends = [0, 1, 1, 2, 2, 0]; for (let i = 3; i < n; i++) { const a = ends[Math.floor(rnd() * ends.length)]; let b; do b = ends[Math.floor(rnd() * ends.length)]; while (b === a); E.push([i, a], [i, b]); ends.push(i, a, i, b); }
    const deg = new Array(n).fill(0); E.forEach(([a, b]) => { deg[a]++; deg[b]++; });
    // 简单的力导向布局
    const P = Array.from({ length: n }, (_, i) => [Math.cos(i * 2.4) * (40 + i * 5), Math.sin(i * 2.4) * (40 + i * 5)]);
    for (let it = 0; it < 300; it++) { const F = P.map(() => [0, 0]); for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const dx = P[i][0] - P[j][0], dy = P[i][1] - P[j][1], r2 = dx * dx + dy * dy + 1, f = 9000 / r2; F[i][0] += dx * f / Math.sqrt(r2); F[i][1] += dy * f / Math.sqrt(r2); F[j][0] -= dx * f / Math.sqrt(r2); F[j][1] -= dy * f / Math.sqrt(r2); }
      E.forEach(([a, b]) => { const dx = P[b][0] - P[a][0], dy = P[b][1] - P[a][1], r = Math.hypot(dx, dy) + .1, f = (r - 70) * .05; F[a][0] += dx / r * f; F[a][1] += dy / r * f; F[b][0] -= dx / r * f; F[b][1] -= dy / r * f; });
      P.forEach((p, i) => { p[0] += CL(F[i][0], -8, 8) - p[0] * .01; p[1] += CL(F[i][1], -8, 8) - p[1] * .012; }); }
    const xs = P.map(p => p[0]), ys = P.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    AN._ba = { E, deg, P: P.map(([x, y]) => [(x - x0) / (x1 - x0), (y - y0) / (y1 - y0)]) }; }
  const B = AN._ba, lx = R.x + 60, ly = R.y + 80, lw = 520, rx = R.x + 720, rw = 940, rh = 480;
  txt(g, '方格网络', lx + lw / 2, R.y + 40, C.fg, fnt(700, 30), 'center'); txt(g, '无标度网络（随机生成，40 个节点）', rx + rw / 2, R.y + 40, C.fg, fnt(700, 30), 'center');
  const P1 = []; for (let i = 0; i < 36; i++) P1.push([lx + 10 + (i % 6) * 94, ly + 10 + Math.floor(i / 6) * 94]); drawNet(g, P1, CG.E, new Array(36).fill(0), null, 0, { r: 16 });
  const P2 = B.P.map(([x, y]) => [rx + x * rw, ly + y * rh]); const hub = B.deg.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0]).slice(0, 3).map(q => q[1]);
  B.E.forEach(([p, q]) => line(g, [P2[p], P2[q]], C.line2, 2.5)); const hu = SS((tk - .7 * d) / .6);
  P2.forEach(([x, y], i) => { const r = 9 + B.deg[i] * 1.6, isH = hub.includes(i); dot(g, x, y, r, '#0B1020'); g.strokeStyle = isH && hu > 0 ? C.gold : C.fg3; g.lineWidth = isH && hu > 0 ? 5 : 2.5; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); });
  if (hu > 0) { const i = hub[0], [x, y] = P2[i]; g.save(); g.globalAlpha = hu; rr(g, x + 44, y - 20, 250, 40, 10, 'rgba(14,20,36,.95)', C.gold, 2); txt(g, `枢纽：${B.deg[i]} 条连线`, x + 60, y, C.gold, fnt(700, 22)); g.restore(); }
  const by = R.y + 640; txt(g, '多想四倍的一方（1600 次 对 400 次）', R.x + 60, by, C.fg3, fnt(500, 22));
  wbar(g, lx, by + 50, 640, '方格', 18, 20, (tk - .3 * d) / .8, C.g); wbar(g, rx, by + 50, 800, '小世界', 10, 20, (tk - .42 * d) / .8, C.bad); wbar(g, rx, by + 100, 800, '无标度', 8, 20, (tk - .48 * d) / .8, C.bad); };
