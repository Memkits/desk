// 围棋与 AlphaGo、线与膜、弱点与变体、总结。
function goBoard(g, ox, oy, s, n, stones, o = {}) { rr(g, ox - s * .7, oy - s * .7, s * (n - 1) + s * 1.4, s * (n - 1) + s * 1.4, 10, '#C9A66B'); for (let i = 0; i < n; i++) { line(g, [[ox, oy + i * s], [ox + (n - 1) * s, oy + i * s]], '#5A4526', 1.6); line(g, [[ox + i * s, oy], [ox + i * s, oy + (n - 1) * s]], '#5A4526', 1.6); }
  stones.forEach(([x, y, c, a = 1]) => { g.save(); g.globalAlpha *= a; dot(g, ox + x * s, oy + y * s, s * .46, c === 1 ? '#10131B' : '#F1F3F7'); if (c === 2) { g.strokeStyle = '#8A8F9A'; g.lineWidth = 1; g.beginPath(); g.arc(ox + x * s, oy + y * s, s * .46, 0, 7); g.stroke(); } g.restore(); }); }
AN.gohist = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, s = 50, ox = R.x + 120, oy = R.y + 120;
  // 一块有两只眼的黑棋：眼在 (2,6) 和 (4,6)
  const blk = [[1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [1, 6], [3, 6], [5, 6], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7]].map(([x, y]) => [x, y, 1]);
  const wht = [[0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [6, 5], [6, 6], [6, 7], [0, 5], [0, 6], [0, 7], [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [3, 2], [5, 1], [2, 1]].map(([x, y]) => [x, y, 2]);
  const fill = SS((tk - .3 * d) / .6);
  fadeIn(g, tk / .6, () => { goBoard(g, ox, oy, s, 9, [...blk, ...wht, ...(fill > 0 ? [[2, 6, 1, fill]] : [])]); txt(g, '黑棋有两只眼，本来是活棋', ox + 200, oy - 70, C.fg2, fnt(600, 24), 'center');
    if (fill > 0) { g.save(); g.globalAlpha = fill; rr(g, ox + 2 * s - 30, oy + 6 * s - 30, 60, 60, 10, null, C.bad, 4); txt(g, '乱下：把自己的眼填了', ox + 200, oy + 9 * s + 20, C.bad, fnt(700, 26), 'center'); g.restore(); } });
  const x = R.x + 720, ev = [['2006', 'Crazy Stone：提出“蒙特卡洛树搜索”这个名字；同年 UCT 发表', C.fg2], ['2008', 'MoGo：九路小棋盘达到业余段位', C.fg2], ['2012', 'Zen：十九路 3:1 胜业余二段', C.fg2], ['2015', 'AlphaGo 5:0 胜职业棋手樊麾', C.gold], ['2016', 'AlphaGo 4:1 胜李世石', C.gold]];
  line(g, [[x + 20, R.y + 60], [x + 20, R.y + 60 + 5 * 110 * SS((tk - .4 * d) / (.5 * d))]], C.line2, 3);
  ev.forEach(([y, s2, col], i) => { const u = SS((tk - (.4 + i * .1) * d) / .5); if (u <= 0) return; g.save(); g.globalAlpha = u; dot(g, x + 20, R.y + 80 + i * 110, 10, col); txt(g, y, x + 50, R.y + 80 + i * 110, col, fnt(800, 30, 'mono')); txt(g, s2, x + 160, R.y + 80 + i * 110, C.fg, fnt(600, 25)); g.restore(); });
  fadeIn(g, (tk - .7 * d) / .5, () => txt(g, '加了围棋知识的“重”模拟，进步很快，但离职业还远', x + 20, R.y + 660, C.fg3, fnt(500, 23))); };
let PU = null;
function puctRun() { if (PU) return PU; const P = [.5, .24, .13, .08, .05], q = [.52, .6, .42, .3, .36], R = mkRng(9), n = [0, 0, 0, 0, 0], w = [0, 0, 0, 0, 0], hist = [];
  for (let N = 0; N < 300; N++) { let b = 0, bv = -1e9; for (let i = 0; i < 5; i++) { const Q = n[i] ? w[i] / n[i] : 0, v = Q + 1.6 * P[i] * Math.sqrt(N + 1) / (1 + n[i]); if (v > bv) { bv = v; b = i; } } const val = CL(q[b] + (R() - .5) * .5); n[b]++; w[b] += val; hist.push({ n: n.slice(), w: w.slice() }); }
  PU = { P, hist }; return PU; }
AN.puct = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, { P, hist } = puctRun();
  fadeIn(g, tk / .6, () => { card(g, R.x, R.y + 20, 520, 220, '策略网络', ['看一眼局面', '给每一步一个先验概率 P'], C.p, 1, false, 24); });
  fadeIn(g, (tk - .25 * d) / .6, () => { card(g, R.x, R.y + 270, 520, 250, '价值网络', ['直接估计这个局面谁会赢', '和随机模拟的结果一起用'], C.g, 1, false, 24); });
  fadeIn(g, (tk - .5 * d) / .6, () => { rr(g, R.x, R.y + 560, 520, 170, 16, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '选择的分数（PUCT）', R.x + 24, R.y + 600, C.fg3, fnt(600, 22)); txt(g, 'Q + c · P · √N ÷ (1 + n)', R.x + 24, R.y + 652, C.gold, fnt(800, 30, 'mono')); txt(g, 'P 高、n 少 → 奖励大', R.x + 24, R.y + 702, C.fg2, fnt(600, 22)); });
  const N = Math.round(CL((tk - .2 * d) / (.7 * d)) * 299), H = hist[N], x0 = R.x + 640, cx = x0 + 520;
  fadeIn(g, (tk - .15 * d) / .6, () => { dot(g, cx, R.y + 60, 14, C.fg); txt(g, `第 ${N + 1} 轮`, cx + 30, R.y + 60, C.fg, fnt(700, 26));
    P.forEach((p, i) => { const x = x0 + 60 + i * 210, y = R.y + 200; line(g, [[cx, R.y + 74], [x + 60, y - 20]], C.line2, 2);
      rr(g, x, y, 120, 26, 6, 'rgba(199,155,255,.15)'); rr(g, x, y, 120 * p / .5, 26, 6, C.p); txt(g, 'P ' + pct(p), x + 60, y + 50, C.p, fnt(700, 21), 'center');
      const h = 360 * H.n[i] / 300 * 1.6; rr(g, x + 20, R.y + 640 - h, 80, Math.max(2, h), 8, C.b); txt(g, String(H.n[i]), x + 60, R.y + 620 - h, C.fg, fnt(700, 23, 'mono'), 'center');
      txt(g, 'Q ' + (H.n[i] ? (H.w[i] / H.n[i]).toFixed(2) : '–'), x + 60, R.y + 680, C.g, fnt(700, 21, 'mono'), 'center'); });
    txt(g, '蓝柱 = 盘数 n　　（示意数据）', cx, R.y + 740, C.fg3, fnt(500, 21), 'center'); }); };
AN.zero = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, k = st.k;
  if (k === 0) { const cx = R.x + 520, cy = R.y + 380, r = 260, B = [['自己和自己下', C.b], ['每一步先搜索', C.gold], ['得到更准的走法分布', C.p], ['训练网络', C.g]];
    B.forEach(([s, col], i) => { const a = -Math.PI / 2 + i * Math.PI / 2, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * .8, u = SS((tk - i * .08 * d) / .5); if (u <= 0) return; g.save(); g.globalAlpha = u; g.font = fnt(800, 26); const w = g.measureText(s).width + 50; rr(g, x - w / 2, y - 36, w, 72, 16, 'rgba(14,20,36,.95)', col, 3); txt(g, s, x, y, C.fg, fnt(800, 26), 'center'); g.restore(); });
    const ph = (tk * .25) % 1, a = -Math.PI / 2 + ph * Math.PI * 2; if (tk > .35 * d) { g.save(); g.strokeStyle = 'rgba(255,210,122,.35)'; g.lineWidth = 3; g.setLineDash([6, 8]); g.beginPath(); g.ellipse(cx, cy, r, r * .8, 0, 0, 7); g.stroke(); g.restore(); dot(g, cx + Math.cos(a) * r, cy + Math.sin(a) * r * .8, 12, C.gold); }
    const x = R.x + 1080; fadeIn(g, (tk - .1 * d) / .6, () => card(g, x, R.y + 30, 620, 220, '去掉了随机模拟', ['叶子节点只用价值网络打分', 'AlphaGo Zero（2017）每步搜 1,600 次'], C.r, 1, false, 25));
    fadeIn(g, (tk - .45 * d) / .6, () => { panel(g, x, R.y + 290, 620, 360, '同一个局面'); const P = [.42, .3, .18, .1], Pi = [.12, .7, .13, .05];
      [['网络的直觉', P, C.p], ['搜索之后', Pi, C.gold]].forEach(([s, v, col], j) => { const y = R.y + 380 + j * 140; txt(g, s, x + 30, y, col, fnt(700, 24)); v.forEach((p, i) => { rr(g, x + 200 + i * 100, y + 60 - p * 120, 70, p * 120, 6, col); }); });
      fadeIn(g, (tk - .7 * d) / .5, () => txt(g, '→ 拿搜索结果当答案去训练', x + 30, R.y + 630, C.fg, fnt(700, 24))); }); return; }
  const y = R.y + 120, B = [['表示', '看局面 → 内部状态', C.b], ['动态', '内部状态 + 一步 → 下一个内部状态', C.p], ['预测', '内部状态 → 走法概率与价值', C.g]];
  B.forEach(([h, s, col], i) => card(g, R.x + i * 580, y, 540, 200, h + '（学出来的）', [s], col, SS((tk - i * .1 * d) / .6), false, 24));
  fadeIn(g, (tk - .35 * d) / .6, () => { const x0 = R.x + 200; [[0, 0], [1, -1], [1, 1], [2, -1.5], [2, -.5]].forEach(([dd, o], i, A) => { const x = x0 + dd * 260, yy = R.y + 470 + o * 70; if (i) { const p = dd === 1 ? A[0] : A[1]; line(g, [[x0 + p[0] * 260 + 40, R.y + 470 + p[1] * 70], [x - 40, yy]], C.p, 2, [6, 6]); } g.save(); g.setLineDash([6, 5]); rr(g, x - 40, yy - 26, 80, 52, 12, 'rgba(199,155,255,.1)', C.p, 2); g.restore(); });
    txt(g, '搜索在“想象”出来的状态上进行，不需要规则', R.x + 1000, R.y + 450, C.fg2, fnt(600, 26)); txt(g, 'MuZero（2020）：棋类每步 800 次，Atari 游戏每步 50 次', R.x + 1000, R.y + 510, C.gold, fnt(600, 23)); });
  fadeIn(g, (tk - .65 * d) / .6, () => { const s = ['乱下到底', '网络打分', '网络想象']; s.forEach((x, i) => chip(g, x, R.x + 140 + i * 440, R.y + 700, [C.fg2, C.g, C.p][i], 1, 28)); [0, 1].forEach(i => arrow(g, R.x + 330 + i * 440, R.y + 700, R.x + 560 + i * 440, R.y + 700, C.fg3, 3)); txt(g, '四步循环不变', R.x + 1500, R.y + 700, C.gold, fnt(800, 30)); }); };

// ---------- 08 线与膜 ----------
AN.lm = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, yaw = YAWT(t), b = LM.B[LM.B.length - 1], fl = lmFlood(b, v => v !== 2), mem = new Set(); fl.q.forEach(c => NB6[c].forEach(n => { if (b[n] === 2) mem.add(n); }));
  fadeIn(g, tk / .8, () => lmDraw(g, R.x + 480, R.y + 420, 76, yaw, b, { mem: tk > .5 * d ? mem : null, labels: true }));
  const x = R.x + 1000; fadeIn(g, (tk - .1 * d) / .6, () => { txt(g, '线与膜（本系列设计的新棋）', x, R.y + 80, C.fg, fnt(800, 36)); txt(g, '5 × 5 × 5 的立方格', x, R.y + 150, C.fg2, fnt(600, 26)); });
  fadeIn(g, (tk - .25 * d) / .6, () => { ball(g, x + 20, R.y + 230, 16, PAL[1]); txt(g, '蓝方：每回合 1 子，从底面连到顶面', x + 50, R.y + 230, C.fg, fnt(600, 26)); g.fillStyle = '#EB963C'; g.fillRect(x + 6, R.y + 278, 28, 28); txt(g, '橙方：每回合 2 子，织膜挡住', x + 50, R.y + 292, C.fg, fnt(600, 26)); });
  fadeIn(g, (tk - .6 * d) / .6, () => card(g, x, R.y + 380, 640, 230, '没有人会下', ['只能让程序自己和自己下', '图中是一盘程序对局的终局：膜合拢了'], C.gold, 1, true, 24)); };
AN.lmres = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, k = st.k, rows = [['500 轮', 30], ['2,000 轮', 22], ['8,000 轮', 2], ['32,000 轮', 0]], x = R.x + 40, w = 900;
  panel(g, x, R.y + 20, w + 80, 560, '双方一样强，蓝方（线）30 局里赢几局');
  txt(g, '每一步搜多少轮', x + 30, R.y + 90, C.fg3, fnt(500, 21));
  rows.forEach(([lab, win], i) => { const u = k ? 1 : SS((tk - (.25 + i * .14) * d) / .7); wbar(g, x + 30, R.y + 160 + i * 100, w, lab, win, 30, u, i < 2 ? XC : C.r); });
  if (k === 0) { fadeIn(g, (tk - .82 * d) / .5, () => txt(g, '搜得越深，蓝方越输', x + 40, R.y + 640, C.gold, fnt(800, 32))); return; }
  const x2 = R.x + 1100; card(g, x2, R.y + 20, 600, 220, '浅的搜索', ['会织线，还不会织膜 → 线方占优'], XC, SS(tk / .6), false, 24); card(g, x2, R.y + 270, 600, 220, '深的搜索', ['膜方的优势才显现出来'], C.o, SS((tk - .3 * d) / .6), false, 24);
  fadeIn(g, (tk - .6 * d) / .6, () => { rr(g, x, R.y + 610, 1660, 110, 16, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '量尺本身的精度，会改变测量的结果', R.x + 870, R.y + 665, C.fg, fnt(800, 34), 'center'); }); };

// ---------- 09 弱点与变体 ----------
AN.trap = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, rx = R.x + 520, ry = R.y + 60, my = R.y + 230, ly = R.y + 470;
  fadeIn(g, tk / .5, () => { dot(g, rx, ry, 14, C.fg); txt(g, '现在', rx + 26, ry, C.fg3, fnt(600, 22)); line(g, [[rx, ry + 14], [rx, my - 40]], C.gold, 4); rr(g, rx - 100, my - 36, 200, 72, 14, 'rgba(14,20,36,.95)', XC, 3); txt(g, '蓝方的一步棋', rx, my, C.fg, fnt(700, 24), 'center'); });
  for (let i = 0; i < 10; i++) { const u = SS((tk - (.08 + i * .03) * d) / .4); if (u <= 0) continue; const x = R.x + 70 + i * 100, bad = i === 7; g.save(); g.globalAlpha = u; line(g, [[rx, my + 36], [x, ly - 30]], bad ? C.bad : C.line2, bad ? 3 : 2); dot(g, x, ly, 24, bad ? C.bad : C.ok); txt(g, bad ? '妙手' : '', x, ly + 50, C.bad, fnt(800, 22), 'center');
    const n = bad ? 2 : 13 + (i * 7) % 6; txt(g, String(n), x, ly, '#0B1020', fnt(800, 20, 'mono'), 'center'); g.restore(); }
  fadeIn(g, (tk - .3 * d) / .5, () => txt(g, '橙方的十种应对（圆里的数 = 被试了几盘）', R.x + 520, ly + 100, C.fg3, fnt(500, 22), 'center'));
  const x = R.x + 1140; fadeIn(g, (tk - .4 * d) / .6, () => card(g, x, R.y + 20, 560, 200, '随机模拟的看法', ['九成能赢，是好棋'], C.ok, 1, false, 26));
  fadeIn(g, (tk - .55 * d) / .6, () => card(g, x, R.y + 250, 560, 230, '把树画完的看法', ['对方只要找到那一手', '这步棋就是输棋'], C.bad, 1, false, 26));
  fadeIn(g, (tk - .7 * d) / .6, () => txt(g, '妙手被试得太少，搜索就看不到它', R.x + 520, R.y + 700, C.gold, fnt(800, 30), 'center')); };
AN.variants = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, w = 540, y = R.y + 30, H = 620;
  const C3 = [['早下晚下都一样', '落子游戏里，一步棋在哪一轮下都差不多：把所有模拟里出现过它的结果都算上，起步更快', C.g, .02], ['多台机器搜一棵树', '正在搜的路先记一次“假的输”，别人就会绕开，免得挤到一条路上', C.b, .3], ['看不到对方的牌', '先猜几副可能的手牌，每副分别搜，再把结果合起来', C.p, .6]];
  C3.forEach(([h, s, col, at], i) => { const u = SS((tk - at * d) / .6); if (u <= 0) return; const x = R.x + i * (w + 50); card(g, x, y, w, H, h, [s], col, u, false, 24);
    g.save(); g.globalAlpha = u; const cx = x + w / 2, cy = y + 450;
    if (i === 0) { [[-150, 0], [0, 0], [150, 0]].forEach(([dx], j) => { tboard(g, cx + dx, cy, 30, [0, 0, 0, 0, j === 1 ? 1 : 0, 0, 0, 0, 0].map((v, q) => q === [2, 4, 6][j] ? 1 : v), { hl: [2, 4, 6][j] === 4 ? 4 : [2, 4, 6][j] }); }); txt(g, '同一手出现在不同模拟的不同时刻', cx, cy + 90, C.fg3, fnt(500, 20), 'center'); }
    if (i === 1) { dot(g, cx, cy - 80, 12, C.fg); [-1, 0, 1].forEach(j => { line(g, [[cx, cy - 70], [cx + j * 140, cy + 20]], j === 0 ? C.bad : C.line2, 3); dot(g, cx + j * 140, cy + 20, 14, j === 0 ? C.bad : C.b); bot(g, cx + j * 140, cy + 100, [C.b, C.g, C.o][j + 1], .7); }); txt(g, '−1', cx + 26, cy + 20, C.bad, fnt(800, 24, 'mono')); }
    if (i === 2) { [-1, 0, 1].forEach(j => { for (let q = 0; q < 3; q++) { g.save(); g.translate(cx + j * 150 + q * 18 - 18, cy - 20); g.rotate((q - 1) * .15); rr(g, -22, -32, 44, 64, 6, '#E9EEF7', '#9AA6BE', 1.5); txt(g, '?', 0, 0, '#0B1020', fnt(800, 24), 'center'); g.restore(); } dot(g, cx + j * 150, cy + 70, 9, C.p); line(g, [[cx + j * 150, cy + 70], [cx + j * 150 - 25, cy + 110]], C.p, 2); line(g, [[cx + j * 150, cy + 70], [cx + j * 150 + 25, cy + 110]], C.p, 2); }); }
    g.restore(); }); };
AN.llm = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk;
  const N = [{ id: 0, x: 860, y: 40, s: '题目：x² − 5x + 6 = 0，求 x', col: C.fg }, { id: 1, p: 0, x: 300, y: 200, s: '试着因式分解', v: .82 }, { id: 2, p: 0, x: 860, y: 200, s: '用求根公式', v: .71 }, { id: 3, p: 0, x: 1420, y: 200, s: '两边同除以 x', v: .08 },
    { id: 4, p: 1, x: 120, y: 380, s: '(x − 2)(x − 3) = 0', v: .91 }, { id: 5, p: 1, x: 520, y: 380, s: '(x − 1)(x − 6) = 0', v: .12 }, { id: 6, p: 4, x: 300, y: 560, s: 'x = 2 或 x = 3', v: .97, ok: 1 }];
  const at = [0, .1, .14, .18, .36, .4, .55], best = new Set([0, 1, 4, 6]);
  N.forEach((n, i) => { const u = SS((tk - at[i] * d) / .5); if (u <= 0) return; g.save(); g.globalAlpha = u; const X = R.x + n.x, Y = R.y + n.y; if (n.p != null) { const p = N[n.p]; line(g, [[R.x + p.x, R.y + p.y + 34], [X, Y - 34]], best.has(n.id) && tk > .62 * d ? C.gold : C.line2, best.has(n.id) && tk > .62 * d ? 5 : 2); }
    g.font = fnt(700, 25); const w = g.measureText(n.s).width + 50; rr(g, X - w / 2, Y - 34, w, 68, 14, 'rgba(14,20,36,.95)', n.ok ? C.ok : n.v != null && n.v < .3 ? C.bad : C.line2, 2.5); txt(g, n.s, X, Y, C.fg, fnt(700, 25), 'center');
    if (n.v != null) chip(g, '打分 ' + n.v.toFixed(2), X + w / 2 + 12, Y, n.v > .5 ? C.g : C.bad, 1, 19); g.restore(); });
  fadeIn(g, (tk - .1 * d) / .5, () => txt(g, '语言模型生成几种下一步', R.x + 1300, R.y + 380, C.p, fnt(700, 26))); fadeIn(g, (tk - .3 * d) / .5, () => txt(g, '另一个模型给每一步打分', R.x + 1300, R.y + 440, C.g, fnt(700, 26)));
  fadeIn(g, (tk - .7 * d) / .6, () => { rr(g, R.x + 900, R.y + 520, 800, 110, 16, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '找到的好路线 → 拿来训练模型自己', R.x + 1300, R.y + 560, C.gold, fnt(800, 30), 'center'); txt(g, '例：rStar-Math（微软，2025）', R.x + 1300, R.y + 605, C.fg2, fnt(600, 22), 'center'); }); };

// ---------- 10 总结 ----------
AN.end = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, k = st.k;
  if (k === 0) { const cx = R.x + 480, cy = R.y + 380, r = 250; STEPS.forEach(([s, col], i) => { const a = -Math.PI / 2 + i * Math.PI / 2, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * .85, u = SS((tk - i * .1 * d) / .5); if (u <= 0) return; g.save(); g.globalAlpha = u; rr(g, x - 110, y - 50, 220, 100, 18, 'rgba(14,20,36,.95)', col, 3); txt(g, `${i + 1} ${s}`, x, y, C.fg, fnt(800, 34), 'center'); g.restore();
      const b = -Math.PI / 2 + (i + .5) * Math.PI / 2; arrow(g, cx + Math.cos(b - .25) * r * .95, cy + Math.sin(b - .25) * r * .8, cx + Math.cos(b + .25) * r * .95, cy + Math.sin(b + .25) * r * .8, C.fg3, 3, 12, u); });
    txt(g, '重复几千轮', cx, cy, C.fg3, fnt(600, 26), 'center');
    const x = R.x + 1000; [['选择', '按 UCB 往下走：平均分 + 奖励'], ['扩展', '长一个新节点'], ['模拟', '从那里随机下到底'], ['回溯', '把结果沿路送回去']].forEach(([h, s], i) => fadeIn(g, (tk - (.1 + i * .1) * d) / .5, () => { txt(g, h, x, R.y + 120 + i * 90, STEPS[i][1], fnt(800, 30)); txt(g, s, x + 100, R.y + 120 + i * 90, C.fg, fnt(600, 28)); }));
    fadeIn(g, (tk - .6 * d) / .6, () => { rr(g, x - 20, R.y + 500, 720, 180, 16, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '不需要会打分：树自己往好的方向长', x + 340, R.y + 560, C.fg, fnt(700, 28), 'center'); txt(g, '只要知道规则，就能下新游戏', x + 340, R.y + 620, C.gold, fnt(700, 28), 'center'); }); return; }
  card(g, R.x, R.y + 20, 760, 300, '弱点来自同一个地方', ['一切判断都来自试过的样本', '没试到的妙手，它就不知道'], C.r, SS(tk / .6), false, 26);
  fadeIn(g, (tk - .35 * d) / .6, () => { const x = R.x + 860, y = R.y + 20; rr(g, x, y, 840, 560, 16, '#0B1020', C.line2, 2); rr(g, x, y, 840, 44, 16, '#131B2E'); [0, 1, 2].forEach(i => dot(g, x + 24 + i * 20, y + 22, 6, ['#FF6B6B', '#FFD27A', '#5FD39A'][i])); txt(g, '可以直接玩的网页', x + 100, y + 22, C.fg3, fnt(500, 18));
    tboard(g, x + 200, y + 260, 90, [1, 2, 1, 0, 2, 0, 0, 0, 0], { heat: [0, 0, 0, .2, 0, .2, .1, 1, .15] }); txt(g, '和它下井字棋', x + 200, y + 430, C.fg, fnt(700, 26), 'center'); txt(g, '一轮一轮看树长出来', x + 200, y + 470, C.fg2, fnt(500, 22), 'center');
    [[C.r, .3], [C.b, .55], [C.p, .4], [C.g, .8]].forEach(([col, h], i) => rr(g, x + 470 + i * 80, y + 340 - h * 200, 56, h * 200, 8, col)); txt(g, '老虎机 · 迷宫', x + 620, y + 430, C.fg, fnt(700, 26), 'center'); txt(g, '链接见简介', x + 420, y + 520, C.gold, fnt(800, 28), 'center'); });
  fadeIn(g, (tk - .6 * d) / .6, () => card(g, R.x, R.y + 360, 760, 260, '数据说明', ['井字棋、老虎机、迷宫：程序实际运行', '线与膜：本系列之前的自对弈测试', 'AlphaGo、陷阱和语言模型的图是示意'], C.fg3, 1, false, 23)); };
