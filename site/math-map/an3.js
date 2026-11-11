// 第三集画面（非地图）
const RACE_G = r => { const s = r.reg;
  if (/法兰西/.test(s)) return '法国（各政权）'; if (/波希米亚|奥地利/.test(s)) return '奥地利/哈布斯堡'; if (/普鲁士|德意志|汉诺威|萨克森|不伦瑞克|巴伐利亚|巴登|神圣罗马/.test(s)) return '德意志诸邦';
  if (/英格兰|不列颠|苏格兰/.test(s)) return '英国'; if (/俄罗斯/.test(s)) return '俄罗斯帝国'; if (/荷兰/.test(s)) return '荷兰'; if (/瑞士/.test(s)) return '瑞士';
  if (/意大利|撒丁|托斯卡纳|教皇|威尼斯|米兰/.test(s)) return '意大利诸邦'; if (/瑞典/.test(s)) return '瑞典-挪威'; if (/美国/.test(s)) return '美国'; if (/日本/.test(s)) return '日本'; if (/^清/.test(s)) return '清朝'; return s; };
const RACE_C = { '法国（各政权）': C.b, '德意志诸邦': C.o, '英国': C.r, '俄罗斯帝国': C.g, '意大利诸邦': C.p, '荷兰': '#FF9F43', '瑞士': '#E8E8E8', '奥地利/哈布斯堡': '#F7D774', '瑞典-挪威': '#7FD6FF', '美国': '#9AA8FF', '日本': '#FF8FB1', '清朝': '#D9A066' };
Object.assign(AN, {
  tangent: (g, t, R, st) => {
    hdr(g, R, '切线：割线的极限', '微积分的核心问题之一：曲线上一点有多陡？');
    const ox = R.x + 140, oy = R.y + 760, s = 150, f = x => .35 * x * x + .2, X = x => ox + x * s, Y = y => oy - y * s;
    line(g, [[ox - 20, oy], [ox + 1150, oy]], C.line2, 2); line(g, [[ox, oy + 20], [ox, R.y + 160]], C.line2, 2);
    g.save(); g.strokeStyle = C.b; g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= 100; i++) { const x = i / 100 * 7; i ? g.lineTo(X(x), Y(f(x))) : g.moveTo(X(x), Y(f(x))); } g.stroke(); g.restore();
    const x0 = 2.4, D = st.D || 12, h = LERP(3.6, .02, SS(CL((t - 1) / (D * .7)))); const x1 = x0 + h, m = (f(x1) - f(x0)) / h;
    const L = x => f(x0) + m * (x - x0); line(g, [[X(x0 - 2), Y(L(x0 - 2))], [X(x0 + 4.4), Y(L(x0 + 4.4))]], h < .05 ? C.gold : C.o, 3);
    dot(g, X(x0), Y(f(x0)), 10, '#fff'); txt(g, 'P', X(x0) - 30, Y(f(x0)) - 20, '#fff', fnt(800, 28)); if (h > .05) { dot(g, X(x1), Y(f(x1)), 9, C.o); txt(g, 'Q', X(x1) + 14, Y(f(x1)) - 20, C.o, fnt(800, 28)); }
    const PX = R.x + 1240; txt(g, `P 与 Q 的距离 h = ${h.toFixed(3)}`, PX, R.y + 260, C.fg, fnt(700, 30, 'mono')); txt(g, `割线斜率 = ${m.toFixed(3)}`, PX, R.y + 320, C.o, fnt(700, 30, 'mono'));
    txt(g, `切线斜率 = ${(0.7 * x0).toFixed(3)}`, PX, R.y + 380, C.gold, fnt(800, 30, 'mono'));
    al(g, pop(t, D * .75, .6), () => { txt(g, 'h → 0：割线变成切线', PX, R.y + 470, C.gold, fnt(800, 32)); txt(g, '莱布尼茨写作 dy/dx', PX, R.y + 530, C.fg2, fnt(600, 28)); });
  },
  basel: (g, t, R, st) => {
    hdr(g, R, '巴塞尔问题', '欧拉 · 1735 年 · 圣彼得堡');
    eq(g, '1 + 1/4 + 1/9 + 1/16 + … = π²/6', R.x + 860, R.y + 160, C.gold, 52);
    const X0 = R.x + 120, Yb = R.y + 790, W = 1450, Hs = 280; const tgt = Math.PI ** 2 / 6;
    line(g, [[X0, Yb - tgt * Hs], [X0 + W, Yb - tgt * Hs]], C.gold, 2, [10, 7]); txt(g, 'π²/6 = 1.644934…', X0 + W - 250, Yb - tgt * Hs - 26, C.gold, fnt(700, 26));
    const n = Math.max(1, Math.floor(CL((t - .8) / 9) * 30)); let s = 0;
    for (let i = 1; i <= 30; i++) { s += 1 / (i * i); const x = X0 + (i - 1) * W / 30, h = s * Hs; if (i > n) break; rr(g, x + 4, Yb - h, W / 30 - 8, h, 4, i === n ? C.o : 'rgba(255,178,92,.45)'); }
    let sn = 0; for (let i = 1; i <= n; i++) sn += 1 / (i * i);
    txt(g, `前 ${n} 项之和 = ${sn.toFixed(6)}`, X0, R.y + 235, C.fg, fnt(800, 34, 'mono'));
    txt(g, '欧拉之前，伯努利兄弟等人都没能求出这个和', X0, R.y + 285, C.fg3, fnt(500, 24));
  },
  bridges: (g, t, R, st) => {
    hdr(g, R, '柯尼斯堡七桥', '欧拉 · 1736 年 · 图论的开端');
    // 左：示意地图
    const ox = R.x + 60, oy = R.y + 160;
    g.save(); g.fillStyle = '#1b3350'; g.fillRect(ox, oy + 230, 760, 160); g.fillRect(ox + 520, oy + 60, 120, 230); g.fillRect(ox + 520, oy + 330, 240, 60); g.restore();
    rr(g, ox + 200, oy + 255, 260, 110, 50, '#2a3a52', C.fg3, 2); // 岛
    txt(g, 'A 北岸', ox + 100, oy + 150, C.fg2, fnt(700, 26)); txt(g, 'B 南岸', ox + 100, oy + 470, C.fg2, fnt(700, 26)); txt(g, 'C 岛', ox + 330, oy + 310, '#fff', fnt(800, 26), 'center'); txt(g, 'D 东', ox + 700, oy + 200, C.fg2, fnt(700, 26), 'center');
    const br = [[ox + 260, oy + 200, ox + 260, oy + 262], [ox + 400, oy + 200, ox + 400, oy + 262], [ox + 260, oy + 358, ox + 260, oy + 440], [ox + 400, oy + 358, ox + 400, oy + 440], [ox + 460, oy + 310, ox + 520, oy + 310], [ox + 580, oy + 200, ox + 580, oy + 230], [ox + 680, oy + 310, ox + 680, oy + 330]];
    br.forEach((b, i) => al(g, pop(t, .5 + i * .25, .3), () => line(g, [[b[0], b[1]], [b[2], b[3]]], C.gold, 10)));
    // 右：图
    const P = { A: [R.x + 1260, R.y + 220], B: [R.x + 1260, R.y + 700], C: [R.x + 1140, R.y + 460], D: [R.x + 1540, R.y + 460] };
    const E = [['A', 'C', -.25], ['A', 'C', .25], ['B', 'C', -.25], ['B', 'C', .25], ['C', 'D', 0], ['A', 'D', 0], ['B', 'D', 0]]; const u = pop(t, 3.4, 1);
    al(g, u, () => { E.forEach(([a, b, c]) => { const p = P[a], q = P[b], mx = (p[0] + q[0]) / 2 + c * (q[1] - p[1]), my = (p[1] + q[1]) / 2 - c * (q[0] - p[0]); g.save(); g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); g.moveTo(...p); g.quadraticCurveTo(mx, my, ...q); g.stroke(); g.restore(); });
      const deg = { A: 3, B: 3, C: 5, D: 3 }; Object.entries(P).forEach(([k, p]) => { dot(g, ...p, 30, 'rgba(14,20,36,1)'); g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(...p, 30, 0, TAU); g.stroke(); txt(g, k, p[0], p[1] + 1, '#fff', fnt(800, 28), 'center');
        al(g, pop(t, 5.5, .5), () => txt(g, `${deg[k]} 座桥`, p[0] + (k === 'C' ? -60 : 46), p[1] + (k === 'C' ? 56 : 0), C.r, fnt(800, 24), k === 'C' ? 'center' : 'left')); }); });
    al(g, pop(t, 7, .6), () => banner(g, R, '一笔画走遍每座桥：连着奇数座桥的陆地最多只能有 2 块；这里有 4 块，所以不可能', 1));
  },
  euler: (g, t, R, st) => {
    hdr(g, R, '欧拉公式', '《无穷分析引论》· 1748 年 · 柏林');
    const cx = R.x + 420, cy = R.y + 480, r = 260; const D = st.D || 12, th = Math.PI * SS(CL((t - 1) / (D * .5)));
    line(g, [[cx - r - 60, cy], [cx + r + 60, cy]], C.line2, 2); line(g, [[cx, cy - r - 60], [cx, cy + r + 60]], C.line2, 2); txt(g, '实轴', cx + r + 70, cy, C.fg3, fnt(600, 22)); txt(g, 'i', cx + 10, cy - r - 60, C.fg3, fnt(700, 24));
    g.save(); g.strokeStyle = C.fg3; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke(); g.strokeStyle = C.gold; g.lineWidth = 5; g.beginPath(); g.arc(cx, cy, r, 0, -th, true); g.stroke(); g.restore();
    const p = [cx + r * Math.cos(th), cy - r * Math.sin(th)]; line(g, [[cx, cy], p], C.b, 3); line(g, [p, [p[0], cy]], C.g, 2, [6, 5]); dot(g, ...p, 12, C.gold);
    txt(g, `x = ${(th / Math.PI).toFixed(2)}π`, cx - 80, cy + r + 90, C.fg, fnt(700, 30, 'mono'));
    eq(g, 'e^(ix) = cos x + i·sin x', R.x + 1230, R.y + 300, C.fg, 52);
    al(g, pop(t, 1 + D * .55, .6), () => { eq(g, 'x = π：  e^(iπ) + 1 = 0', R.x + 1230, R.y + 470, C.gold, 58); txt(g, 'e、i、π、1、0 五个常数连在一起', R.x + 1230, R.y + 570, C.fg2, fnt(600, 28), 'center'); });
  },
  fourier: (g, t, R, st) => {
    hdr(g, R, '傅里叶：任何函数都能拆成正弦波', '1807 年热传导论文 · 格勒诺布尔（1822 年在巴黎出版专著）');
    const X0 = R.x + 80, W = 1100, Yc = R.y + 470, A = 200; const D = st.D || 12, N = 1 + Math.floor(CL((t - .8) / (D * .7)) * 7);
    line(g, [[X0, Yc], [X0 + W, Yc]], C.line2, 2);
    g.save(); g.strokeStyle = C.fg3; g.lineWidth = 2; g.setLineDash([8, 6]); g.beginPath(); for (let i = 0; i <= 400; i++) { const x = i / 400 * 4 * Math.PI; const y = Math.sin(x) >= 0 ? 1 : -1; i ? g.lineTo(X0 + x / (4 * Math.PI) * W, Yc - y * A * .8) : g.moveTo(X0, Yc - y * A * .8); } g.stroke(); g.restore();
    for (let k = 0; k < N; k++) { const n = 2 * k + 1; g.save(); g.globalAlpha = .25; g.strokeStyle = [C.b, C.g, C.p, C.r, C.o, C.b, C.g][k]; g.lineWidth = 2; g.beginPath(); for (let i = 0; i <= 400; i++) { const x = i / 400 * 4 * Math.PI, y = 4 / Math.PI / n * Math.sin(n * x); i ? g.lineTo(X0 + x / (4 * Math.PI) * W, Yc - y * A * .8) : g.moveTo(X0, Yc - y * A * .8); } g.stroke(); g.restore(); }
    g.save(); g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= 600; i++) { const x = i / 600 * 4 * Math.PI; let y = 0; for (let k = 0; k < N; k++) { const n = 2 * k + 1; y += 4 / Math.PI / n * Math.sin(n * x); } i ? g.lineTo(X0 + x / (4 * Math.PI) * W, Yc - y * A * .8) : g.moveTo(X0, Yc - y * A * .8); } g.stroke(); g.restore();
    const PX = R.x + 1260; txt(g, `叠加了 ${N} 个正弦波`, PX, R.y + 280, C.gold, fnt(800, 34)); txt(g, 'sin x + sin 3x/3 + sin 5x/5 + …', PX, R.y + 340, C.fg2, fnt(600, 26, 'mono')); txt(g, '越加越接近方波（虚线）', PX, R.y + 400, C.fg2, fnt(600, 26));
    al(g, pop(t, D * .7, .6), () => { txt(g, '今天：MP3、JPEG、', PX, R.y + 520, C.fg, fnt(700, 28)); txt(g, '核磁共振成像……', PX, R.y + 566, C.fg, fnt(700, 28)); });
  },
  parallel: (g, t, R, st) => {
    if (st.bi === 0) {
      hdr(g, R, '第五公设', '过直线外一点，只能作一条与它平行的直线（今天常用的等价说法）');
      const y = R.y + 600; line(g, [[R.x + 100, y], [R.x + 1100, y]], C.fg2, 4); const P = [R.x + 600, R.y + 360]; dot(g, ...P, 12, '#fff'); txt(g, 'P', P[0] + 18, P[1] - 18, '#fff', fnt(800, 30));
      al(g, pop(t, 1, .6), () => line(g, [[R.x + 100, P[1]], [R.x + 1100, P[1]]], C.gold, 4));
      [-.12, -.05, .05, .12].forEach((a, i) => al(g, pop(t, 2.4 + i * .4, .5), () => { line(g, [[P[0] - 500, P[1] - 500 * a], [P[0] + 500, P[1] + 500 * a]], C.fg3, 2, [8, 6]); }));
      al(g, pop(t, 4.4, .6), () => { txt(g, '稍微一斜，就会和下面的直线相交', R.x + 1180, R.y + 360, C.fg2, fnt(600, 28)); txt(g, '能不能从前四条公设推出它？', R.x + 1180, R.y + 450, C.fg, fnt(700, 30)); txt(g, '两千年来许多人试过，都失败了', R.x + 1180, R.y + 510, C.fg3, fnt(600, 26)); });
    } else {
      hdr(g, R, '双曲几何：三角形内角和小于 180°', '庞加莱圆盘模型示意（这一模型是后来才提出的）');
      const cx = R.x + 460, cy = R.y + 480, r = 320; g.save(); g.fillStyle = 'rgba(92,180,255,.06)'; g.strokeStyle = C.b; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill(); g.stroke(); g.restore();
      // 三个顶点之间的“直线”是与边界正交的圆弧
      const V = [[-.55, -.35], [.6, -.25], [-.05, .62]].map(([x, y]) => [cx + x * r, cy + y * r]);
      const arcThrough = (p, q) => { // 与单位圆正交、过 p q 的圆
        const a = [(p[0] - cx) / r, (p[1] - cy) / r], b = [(q[0] - cx) / r, (q[1] - cy) / r]; const ai = [a[0] / (a[0] ** 2 + a[1] ** 2), a[1] / (a[0] ** 2 + a[1] ** 2)];
        const circ = (p1, p2, p3) => { const ax = p1[0], ay = p1[1], bx = p2[0], by = p2[1], cx_ = p3[0], cy_ = p3[1]; const d = 2 * (ax * (by - cy_) + bx * (cy_ - ay) + cx_ * (ay - by)); const ux = ((ax * ax + ay * ay) * (by - cy_) + (bx * bx + by * by) * (cy_ - ay) + (cx_ * cx_ + cy_ * cy_) * (ay - by)) / d; const uy = ((ax * ax + ay * ay) * (cx_ - bx) + (bx * bx + by * by) * (ax - cx_) + (cx_ * cx_ + cy_ * cy_) * (bx - ax)) / d; return [ux, uy, Math.hypot(ax - ux, ay - uy)]; };
        const [ux, uy, rr_] = circ(a, b, ai); let a1 = Math.atan2(a[1] - uy, a[0] - ux), a2 = Math.atan2(b[1] - uy, b[0] - ux); let d = a2 - a1; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU;
        return { ux: cx + ux * r, uy: cy + uy * r, R: rr_ * r, a1, d }; };
      const u = pop(t, .6, 1.2);
      [[0, 1], [1, 2], [2, 0]].forEach(([i, j]) => { const A_ = arcThrough(V[i], V[j]); g.save(); g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); g.arc(A_.ux, A_.uy, A_.R, A_.a1, A_.a1 + A_.d * u, A_.d < 0); g.stroke(); g.restore(); });
      V.forEach(p => dot(g, ...p, 9, '#fff'));
      al(g, pop(t, 2.2, .6), () => { txt(g, '在圆盘里，“直线”是与边界垂直的圆弧', R.x + 900, R.y + 280, C.fg, fnt(700, 30)); txt(g, '三角形的边向内弯', R.x + 900, R.y + 350, C.fg2, fnt(600, 28)); txt(g, '内角和 < 180°，三角形越大，差得越多', R.x + 900, R.y + 420, C.gold, fnt(800, 30)); txt(g, '过直线外一点，有无数条直线与它不相交', R.x + 900, R.y + 490, C.fg2, fnt(600, 28)); });
    }
  },
  race: (g, t, R, st) => {
    const bs = st.bs || [0], D = st.D || 30; const k = st.k; const u = CL((t - bs[k]) / Math.max(.1, ((k + 1 < bs.length ? bs[k + 1] : D) - bs[k]) * .85));
    const year = k === 0 ? LERP(1650, 1800, u) : k === 1 ? LERP(1800, 1900, u) : 1900;
    hdr(g, R, '1650 – 1900：按成果当时的政权计数', '本片地图收录的数学家人数（去重）；德意志诸邦含普鲁士、汉诺威、萨克森等');
    const cnt = {}; MREC.filter(r => r.y >= 1650 && r.y <= year).forEach(r => { const k2 = RACE_G(r); (cnt[k2] = cnt[k2] || new Set()).add(r.who); });
    const rows = Object.entries(cnt).map(([n, s]) => [n, s.size]).sort((a, b) => b[1] - a[1]).slice(0, 7); const mx = Math.max(10, ...rows.map(r => r[1]));
    rows.forEach(([n, v], i) => { const y = R.y + 160 + i * 78; txt(g, n, R.x + 300, y + 26, '#fff', fnt(700, 28), 'right'); rr(g, R.x + 320, y + 6, 1100 * v / mx, 42, 8, RACE_C[n] || C.fg3); txt(g, String(v), R.x + 330 + 1100 * v / mx, y + 27, '#fff', fnt(800, 28, 'mono')); });
    g.save(); g.shadowColor = '#000'; g.shadowBlur = 16; txt(g, String(Math.round(year)), R.x + R.w - 20, R.y + 60, 'rgba(255,255,255,.85)', fnt(800, 80, 'serif'), 'right'); g.restore();
    if (k === 2) al(g, pop(st.tk, .4, .6), () => banner(g, R, '只统计本片收录的成果；边界在变：柯尼斯堡先属普鲁士王国，后属德意志帝国，今在俄罗斯', 1));
  },
});
