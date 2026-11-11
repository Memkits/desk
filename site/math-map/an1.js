// 第一集画面（非地图）
// 楔形数字：1 = 竖楔，10 = 角楔
function wedge1(g, x, y, s, col) { g.save(); g.fillStyle = col; g.beginPath(); g.moveTo(x - 9 * s, y - 20 * s); g.lineTo(x + 9 * s, y - 20 * s); g.lineTo(x, y - 8 * s); g.fill(); g.fillRect(x - 2 * s, y - 12 * s, 4 * s, 34 * s); g.restore(); }
function wedge10(g, x, y, s, col) { g.save(); g.fillStyle = col; g.beginPath(); g.moveTo(x + 10 * s, y - 16 * s); g.lineTo(x - 12 * s, y); g.lineTo(x + 10 * s, y + 16 * s); g.lineTo(x + 2 * s, y); g.fill(); g.restore(); }
function cune(g, n, x, y, s = 1, col = C.gold) { const t = Math.floor(n / 10), o = n % 10; let cx = x; for (let i = 0; i < t; i++) { wedge10(g, cx, y, s, col); cx += 18 * s; } if (t) cx += 8 * s;
  const sm = o > 3 ? .62 : 1, rows = Math.ceil(o / 3); for (let i = 0; i < o; i++) { const c = i % 3, r = Math.floor(i / 3); wedge1(g, cx + c * 18 * s * sm, y + (r - (rows - 1) / 2) * 34 * s * sm, s * sm, col); } return cx + 3 * 18 * s * sm; }

Object.assign(AN, {
  tally: (g, t, R, st) => {
    hdr(g, R, '伊尚戈骨上的刻痕', '约两万年前 · 今刚果（金）· 用途存疑');
    const bx = R.x + 60, by = R.y + 160, bw = 1000, bh = 150;
    g.save(); const gr = g.createLinearGradient(bx, by, bx, by + bh); gr.addColorStop(0, '#d9c9a3'); gr.addColorStop(1, '#8f7d58'); g.fillStyle = gr;
    g.beginPath(); g.ellipse(bx + 40, by + bh / 2, 60, 80, 0, 0, TAU); g.ellipse(bx + bw - 40, by + bh / 2, 60, 70, 0, 0, TAU); g.fill(); g.fillRect(bx + 30, by + 20, bw - 60, bh - 40); g.restore();
    const groups = [11, 13, 17, 19]; let x = bx + 120; let cnt = 0;
    groups.forEach((n, gi) => { for (let i = 0; i < n; i++) { const u = pop(t, .4 + cnt * .05, .2); cnt++; if (u > 0) line(g, [[x, by + 34], [x, by + 34 + 82 * u]], '#3b2f1c', 4); x += 13; }
      const cxg = x - n * 13 / 2; al(g, pop(t, .4 + cnt * .05, .4), () => { txt(g, String(n), cxg, by + bh + 46, C.gold, fnt(800, 40, 'mono'), 'center'); }); x += 46; });
    al(g, pop(t, 4.5, .6), () => txt(g, '11、13、17、19：恰好是 10 到 20 之间的全部质数，巧合还是有意？', R.x + 60, by + bh + 120, C.fg, fnt(700, 30)));
    // beat 1：一一对应
    const a = K(st, 1, .3, .6); if (a <= 0) return;
    al(g, a, () => {
      const y0 = R.y + 560; txt(g, '一一对应：一道刻痕 ↔ 一个对象', R.x + 60, y0 - 50, C.fg2, fnt(700, 28));
      for (let i = 0; i < 10; i++) { const u = st.k > 1 ? 1 : pop(st.tk, .6 + i * .25, .3); const xx = R.x + 80 + i * 110;
        line(g, [[xx, y0], [xx, y0 + 70]], '#d9c9a3', 6);
        al(g, u, () => { arrow(g, xx, y0 + 84, xx, y0 + 140, C.fg3, 2, 10); const ph = i / 9; g.save(); g.fillStyle = '#e8e3c8'; g.beginPath(); g.arc(xx, y0 + 180, 24, 0, TAU); g.fill(); g.fillStyle = '#0A1426'; g.beginPath(); g.arc(xx + (ph * 2 - 1) * 48, y0 + 180, 24, 0, TAU); g.fill(); g.restore(); }); }
      txt(g, '例如：一次月相 = 一道刻痕（示意）', R.x + 1240, y0 + 180, C.fg3, fnt(500, 24));
    });
  },
  sexa: (g, t, R, st) => {
    hdr(g, R, '巴比伦的六十进制与位值', '同一个符号，放在不同的位置，代表不同的大小');
    const y0 = R.y + 230; const vals = [[1, 3600, '× 3600'], [2, 60, '× 60'], [5, 1, '× 1']];
    vals.forEach(([d, w, lab], i) => { const x = R.x + 160 + i * 320, a = pop(t, .5 + i * .6, .5);
      al(g, a, () => { rr(g, x, y0, 260, 200, 18, 'rgba(14,20,36,.9)', C.gold, 2); cune(g, d, x + 120 - (d > 3 ? 20 : d * 8), y0 + 100, 1.6); txt(g, String(d), x + 130, y0 + 240, C.fg, fnt(800, 40, 'mono'), 'center'); txt(g, lab, x + 130, y0 + 290, C.fg3, fnt(600, 26, 'mono'), 'center'); }); });
    al(g, pop(t, 2.6, .6), () => { eq(g, '1×3600 + 2×60 + 5 = 3725', R.x + 620, y0 + 400, C.gold, 50); });
    al(g, pop(t, 4.2, .6), () => { txt(g, '楔形符号：', R.x + 1180, y0 + 40, C.fg2, fnt(600, 26)); wedge1(g, R.x + 1340, y0 + 46, 1.2, C.gold); txt(g, '= 1', R.x + 1370, y0 + 40, C.fg, fnt(700, 28, 'mono'));
      wedge10(g, R.x + 1340, y0 + 120, 1.2, C.gold); txt(g, '= 10', R.x + 1370, y0 + 120, C.fg, fnt(700, 28, 'mono'));
      txt(g, '今天的遗产：', R.x + 1180, y0 + 230, C.fg2, fnt(600, 26)); txt(g, '1 小时 = 60 分 = 3600 秒', R.x + 1180, y0 + 280, C.fg, fnt(600, 26)); txt(g, '1 圈 = 360°', R.x + 1180, y0 + 326, C.fg, fnt(600, 26)); });
  },
  ybc: (g, t, R, st) => {
    hdr(g, R, 'YBC 7289：泥板上的 √2', '约前 1800–前 1600 年 · 耶鲁大学藏 · 出土地不明');
    const cx = R.x + 330, cy = R.y + 450, s = 250;
    g.save(); g.translate(cx, cy); g.rotate(Math.PI / 4); const gr = g.createRadialGradient(0, 0, 40, 0, 0, 340); gr.addColorStop(0, '#b89b6c'); gr.addColorStop(1, '#6e5a3c'); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 300, 0, TAU); g.fill();
    g.strokeStyle = '#3b2f1c'; g.lineWidth = 5; g.strokeRect(-s / 2, -s / 2, s, s); const d = pop(t, .6, 1); g.beginPath(); g.moveTo(-s / 2, -s / 2); g.lineTo(LERP(-s / 2, s / 2, d), LERP(-s / 2, s / 2, d)); g.moveTo(s / 2, -s / 2); g.lineTo(LERP(s / 2, -s / 2, d), LERP(-s / 2, s / 2, d)); g.stroke(); g.restore();
    al(g, pop(t, 1.4, .5), () => { txt(g, '边长 30', cx - 200, cy - 150, C.fg, fnt(700, 26), 'center'); txt(g, '1;24,51,10', cx + 10, cy - 20, '#fff', fnt(800, 30, 'mono'), 'center'); txt(g, '42;25,35', cx + 10, cy + 40, '#fff', fnt(800, 30, 'mono'), 'center'); });
    const X0 = R.x + 760;
    if (st.k === 0) {
      [['1;24,51,10（六十进制）', C.fg2], ['= 1 + 24/60 + 51/60² + 10/60³', C.fg], ['= 1.41421296…', C.gold], ['√2 = 1.41421356…', C.b], ['误差约 0.0000006', C.fg3]].forEach(([s_, col], i) => al(g, pop(t, 2 + i * .9, .5), () => txt(g, s_, X0, R.y + 220 + i * 90, col, fnt(700, 40, i === 4 ? 'sans' : 'mono'))));
    } else {
      txt(g, '一种推测的算法：反复取平均（示意）', X0, R.y + 200, C.fg2, fnt(700, 30));
      const it = [1.5]; for (let i = 0; i < 3; i++) it.push((it[i] + 2 / it[i]) / 2);
      it.forEach((v, i) => al(g, pop(st.tk, .5 + i * 1.6, .5), () => { const y = R.y + 290 + i * 120; txt(g, `第 ${i} 步`, X0, y, C.fg3, fnt(600, 26));
        txt(g, i ? `(${it[i - 1].toFixed(6)} + 2 ÷ ${it[i - 1].toFixed(6)}) ÷ 2` : '先猜 1.5', X0 + 120, y, C.fg2, fnt(600, 26, 'mono')); txt(g, v.toFixed(8), X0 + 120, y + 42, i === 3 ? C.gold : C.fg, fnt(800, 34, 'mono')); }));
    }
  },
  plimpton: (g, t, R, st) => {
    hdr(g, R, '普林顿 322：勾股数表', '约前 1800 年 · 很可能来自拉尔萨 · 哥伦比亚大学藏');
    const rows = [[119, 120, 169], [3367, 3456, 4825], [4601, 4800, 6649], [12709, 13500, 18541], [65, 72, 97], [319, 360, 481], [2291, 2700, 3541], [799, 960, 1249]];
    const X = R.x + 40, Y = R.y + 150; ['短边 a', '（长边 b）', '斜边 c', 'a² + b² = c² ?'].forEach((h, i) => txt(g, h, X + [0, 190, 390, 600][i], Y, i === 1 ? C.fg3 : C.fg2, fnt(700, 24)));
    rows.forEach((r, i) => al(g, pop(t, .4 + i * .3, .4), () => { const y = Y + 56 + i * 62; if (i === 0) rr(g, X - 14, y - 26, 880, 52, 10, 'rgba(255,210,122,.1)', C.gold, 1.5);
      txt(g, String(r[0]), X, y, C.fg, fnt(700, 30, 'mono')); txt(g, String(r[1]), X + 190, y, C.fg3, fnt(600, 30, 'mono')); txt(g, String(r[2]), X + 390, y, C.fg, fnt(700, 30, 'mono')); ticks(g, X + 600, y, pop(t, 1.2 + i * .3, .4)); }));
    al(g, pop(t, .4, .5), () => txt(g, '泥板列出短边与斜边，长边是今人补出的；共 15 行，只列前 8 行', X, Y + 560, C.fg3, fnt(500, 22)));
    // 三角形
    const ox = R.x + 1080, oy = R.y + 600, sc = 3.2; const u = pop(t, 1.8, 1);
    g.save(); g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); g.moveTo(ox, oy); g.lineTo(ox + 120 * sc * u, oy); g.lineTo(ox + 120 * sc * u, oy - 119 * sc * u); g.closePath(); g.stroke(); g.restore();
    if (u > .9) { txt(g, '120', ox + 60 * sc, oy + 32, C.fg, fnt(700, 28, 'mono'), 'center'); txt(g, '119', ox + 120 * sc + 20, oy - 60 * sc, C.fg, fnt(700, 28, 'mono')); txt(g, '169', ox + 50 * sc, oy - 70 * sc, C.gold, fnt(800, 30, 'mono'), 'center');
      txt(g, '119² + 120² = 14161 + 14400 = 28561 = 169²', ox - 60, oy + 80, C.fg2, fnt(600, 24, 'mono')); }
    al(g, K(st, 1, .5, .6), () => banner(g, R, '比毕达哥拉斯早一千多年 · 只有算法和表格，不写“为什么”', 1));
  },
  unitfrac: (g, t, R, st) => {
    hdr(g, R, '莱因德纸草书', '约前 1550 年 · 书吏阿赫摩斯抄写 · 大英博物馆藏');
    const X = R.x + 60, Y = R.y + 190, cw = 50;
    txt(g, '2/5 = 1/3 + 1/15', X, Y - 30, C.gold, fnt(800, 44, 'serif'));
    for (let i = 0; i < 15; i++) { const xx = X + i * (cw + 6); const inA = i < 5, inB = i === 5, u = pop(t, 1.4, .6);
      const col = i < 6 ? LERP(0, 1, u) > .5 ? (inA ? C.b : inB ? C.r : C.line2) : C.o : C.line2; rr(g, xx, Y + 30, cw, 90, 8, i < 6 ? col : 'rgba(255,255,255,.04)', C.line2, 1.5); }
    al(g, pop(t, 1.4, .6), () => { txt(g, '1/3 = 5 格', X + 2.5 * (cw + 6), Y + 160, C.b, fnt(700, 26), 'center'); txt(g, '1/15 = 1 格', X + 5.5 * (cw + 6) + 60, Y + 160, C.r, fnt(700, 26)); });
    al(g, pop(t, .6, .5), () => txt(g, '15 格中的 6 格 = 2/5', X + 900, Y + 75, C.fg2, fnt(600, 26)));
    // 第二段：圆面积
    const a = K(st, 1, .3, .6); if (a <= 0) return;
    al(g, a, () => { const cx = R.x + 330, cy = R.y + 600, s = 250 / 9;
      g.strokeStyle = C.line2; g.lineWidth = 1; for (let i = 0; i <= 9; i++) { line(g, [[cx - 125 + i * s, cy - 125], [cx - 125 + i * s, cy + 125]], C.line2, 1); line(g, [[cx - 125, cy - 125 + i * s], [cx + 125, cy - 125 + i * s]], C.line2, 1); }
      g.save(); g.strokeStyle = C.b; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, 125, 0, TAU); g.stroke(); g.strokeStyle = C.gold; g.beginPath(); const P = [[-1.5, -4.5], [1.5, -4.5], [4.5, -1.5], [4.5, 1.5], [1.5, 4.5], [-1.5, 4.5], [-4.5, 1.5], [-4.5, -1.5]]; P.forEach((p, i) => i ? g.lineTo(cx + p[0] * s, cy + p[1] * s) : g.moveTo(cx + p[0] * s, cy + p[1] * s)); g.closePath(); g.stroke(); g.restore();
      txt(g, '直径 9 的圆 ≈ 去掉四角的八边形（面积 63）', R.x + 560, cy - 80, C.fg, fnt(700, 28));
      txt(g, '书中规则：圆面积 = (直径 × 8/9)²', R.x + 560, cy - 10, C.fg2, fnt(600, 28));
      txt(g, '相当于 π ≈ 256/81 ≈ 3.16', R.x + 560, cy + 60, C.gold, fnt(800, 36, 'mono'));
      txt(g, '八边形与这条规则的联系，是学者的一种解释（第 48 题）', R.x + 560, cy + 120, C.fg3, fnt(500, 22)); });
  },
  irr: (g, t, R, st) => {
    hdr(g, R, '不可公度：找不到的整数比', '毕达哥拉斯学派 · 约前 5 世纪 · 发现者已无从考证');
    const cx = R.x + 300, cy = R.y + 480, s = 300;
    g.save(); g.strokeStyle = C.fg2; g.lineWidth = 4; g.strokeRect(cx - s / 2, cy - s / 2, s, s); const d = pop(t, .5, .8); g.strokeStyle = C.gold; g.beginPath(); g.moveTo(cx - s / 2, cy + s / 2); g.lineTo(cx - s / 2 + s * d, cy + s / 2 - s * d); g.stroke(); g.restore();
    txt(g, '边 = 1', cx, cy + s / 2 + 36, C.fg2, fnt(700, 26), 'center'); al(g, d, () => txt(g, '对角线 = ?', cx + 20, cy - 20, C.gold, fnt(800, 30), 'center'));
    if (st.k === 0) {
      const tries = [['3/2', 1.5], ['7/5', 1.4], ['17/12', 1.41667], ['41/29', 1.41379], ['99/70', 1.414286], ['239/169', 1.414201]];
      tries.forEach(([f, v], i) => al(g, pop(t, 1.4 + i * .7, .4), () => { const y = R.y + 200 + i * 90; txt(g, f, R.x + 700, y, C.fg, fnt(800, 36, 'mono')); txt(g, `(${f})² = ${(v * v).toFixed(5)}`, R.x + 900, y, C.fg2, fnt(600, 28, 'mono')); cross(g, R.x + 1340, y, 1); }));
      al(g, pop(t, 6.2, .6), () => txt(g, '越来越接近 2，却永远不会恰好等于 2', R.x + 700, R.y + 760, C.gold, fnt(700, 30)));
    } else {
      const steps = ['公设：大家公认的出发点', '命题 1：由公设推出', '命题 2：由公设和命题 1 推出', '……每一步都不容反驳', '结论'];
      steps.forEach((s_, i) => al(g, pop(st.tk, .4 + i * .7, .5), () => { const y = R.y + 190 + i * 130; node(g, R.x + 760, y, 640, 86, s_, i === 4 ? C.gold : C.b); if (i) arrow(g, R.x + 1080, y - 40, R.x + 1080, y - 4, C.fg3, 3, 10); }));
    }
  },
  gcd: (g, t, R, st) => {
    if (st.k === 0) {
      hdr(g, R, '辗转相除法', '《几何原本》第七卷 · 求 252 和 105 的最大公约数');
      const X = R.x + 60, Y = R.y + 170, sc = 2.4; const W = 252 * sc, H = 105 * sc;
      rr(g, X, Y, W, H, 0, null, C.fg2, 2);
      const sq = [[0, 0, 105, C.b], [105, 0, 105, C.b], [210, 0, 42, C.g], [210, 42, 42, C.g], [210, 84, 21, C.o], [231, 84, 21, C.o]];
      sq.forEach(([x, y, s, col], i) => al(g, pop(t, .8 + i * .9, .5), () => { rr(g, X + x * sc + 2, Y + y * sc + 2, s * sc - 4, s * sc - 4, 4, col + '55', col, 2.5); txt(g, String(s), X + (x + s / 2) * sc, Y + (y + s / 2) * sc, C.fg, fnt(800, s > 30 ? 32 : 22, 'mono'), 'center'); }));
      const eqs = ['252 = 2 × 105 + 42', '105 = 2 × 42 + 21', ' 42 = 2 × 21 + 0'];
      eqs.forEach((e, i) => al(g, pop(t, 1.6 + i * 1.8, .5), () => txt(g, e, R.x + 760, Y + 50 + i * 80, [C.b, C.g, C.o][i], fnt(800, 40, 'mono'))));
      al(g, pop(t, 7.4, .6), () => { txt(g, '最大公约数 = 21', R.x + 760, Y + 330, C.gold, fnt(800, 48)); txt(g, '用小正方形铺满长方形：铺不满的部分，再用更小的正方形去铺', R.x + 60, Y + H + 70, C.fg3, fnt(500, 24)); });
    } else {
      hdr(g, R, '质数有无穷多个', '《几何原本》第九卷第 20 命题（今天常见的写法）');
      const L = [['2 × 3 + 1 = 7', '质数'], ['2 × 3 × 5 + 1 = 31', '质数'], ['2 × 3 × 5 × 7 + 1 = 211', '质数'], ['2 × 3 × 5 × 7 × 11 × 13 + 1 = 30031', '= 59 × 509，出现了新的质数']];
      L.forEach(([a, b], i) => al(g, pop(st.tk, .4 + i * 1.1, .5), () => { const y = R.y + 200 + i * 110; txt(g, a, R.x + 60, y, C.fg, fnt(800, 40, 'mono')); txt(g, b, R.x + 1050, y, i === 3 ? C.gold : C.fg2, fnt(700, 30)); }));
      al(g, pop(st.tk, 5.4, .6), () => banner(g, R, '把已知的质数全乘起来再加 1：它的质因数一定不在原来的名单里', 1));
    }
  },
  archi: (g, t, R, st) => {
    hdr(g, R, '阿基米德夹逼圆周率', '《圆的度量》· 约前 250 年 · 叙拉古');
    const cx = R.x + 380, cy = R.y + 480, r = 280; const ns = [6, 12, 24, 48, 96]; const D = st.D || 20;
    const idx = Math.min(4, Math.floor(CL((t - .8) / (D * .7)) * 5)), n = ns[idx];
    g.save(); g.strokeStyle = C.fg2; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke();
    const poly = (rad, col) => { g.strokeStyle = col; g.lineWidth = 2.5; g.beginPath(); for (let i = 0; i <= n; i++) { const a = i / n * TAU - Math.PI / 2; const x = cx + rad * Math.cos(a), y = cy + rad * Math.sin(a); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); };
    poly(r, C.b); poly(r / Math.cos(Math.PI / n), C.r); g.restore();
    txt(g, `正 ${n} 边形`, cx, cy + r + 70, C.fg, fnt(800, 34), 'center');
    const X = R.x + 820; txt(g, '边数', X, R.y + 180, C.fg3, fnt(600, 24)); txt(g, '内接（下界）', X + 160, R.y + 180, C.b, fnt(600, 24)); txt(g, '外切（上界）', X + 460, R.y + 180, C.r, fnt(600, 24));
    ns.forEach((m, i) => { if (i > idx) return; const y = R.y + 240 + i * 74; txt(g, String(m), X, y, C.fg, fnt(800, 32, 'mono')); txt(g, (m * Math.sin(Math.PI / m)).toFixed(5), X + 160, y, C.b, fnt(700, 32, 'mono')); txt(g, (m * Math.tan(Math.PI / m)).toFixed(5), X + 460, y, C.r, fnt(700, 32, 'mono')); });
    al(g, idx === 4 ? pop(t, .8 + D * .7, .6) : 0, () => { txt(g, '223/71 < π < 22/7', X, R.y + 650, C.gold, fnt(800, 48, 'serif')); txt(g, '3.1408 < π < 3.1429（他用分数估算，比上表略保守）', X, R.y + 710, C.fg2, fnt(600, 26)); });
  },
  fangcheng: (g, t, R, st) => {
    hdr(g, R, '《九章算术》方程章：消元', '第一题：上禾三秉、中禾二秉、下禾一秉，实三十九斗……');
    const M0 = [[3, 2, 1, 39], [2, 3, 1, 34], [1, 2, 3, 26]];
    const M1 = [[3, 2, 1, 39], [0, 5, 1, 24], [0, 4, 8, 39]];
    const M2 = [[3, 2, 1, 39], [0, 5, 1, 24], [0, 0, 36, 99]];
    const D = st.D || 18, ph = CL((t - 1) / (D * .75)); const M = ph < .33 ? M0 : ph < .66 ? M1 : M2;
    const X = R.x + 80, Y = R.y + 220, cw = 140;
    ['上禾', '中禾', '下禾', '实（斗）'].forEach((h, j) => txt(g, h, X + j * cw + 40, Y - 40, C.fg3, fnt(600, 24), 'center'));
    M.forEach((row, i) => row.forEach((v, j) => { const hot = (ph >= .33 && ph < .66 && i > 0 && j === 0) || (ph >= .66 && i === 2 && j === 1); rr(g, X + j * cw, Y + i * 100, 100, 80, 10, hot ? 'rgba(95,224,160,.15)' : 'rgba(14,20,36,.9)', hot ? C.g : j === 3 ? C.gold : C.line2, 2); txt(g, String(v), X + j * cw + 50, Y + i * 100 + 40, C.fg, fnt(800, 34, 'mono'), 'center'); }));
    txt(g, ph < .33 ? '把系数摆成方阵（原书竖排、自右向左，这里横排示意）' : ph < .66 ? '用第一行“遍乘直除”，消去下面两行的上禾' : '再消去第三行的中禾，就能逐个解出', X, Y + 340, C.fg2, fnt(600, 26));
    al(g, ph > .8 ? 1 : 0, () => { const Xr = R.x + 820; txt(g, '下禾 = 99/36 = 2¾ 斗', Xr, Y + 40, C.gold, fnt(800, 36)); txt(g, '中禾 = 4¼ 斗', Xr, Y + 110, C.gold, fnt(800, 36)); txt(g, '上禾 = 9¼ 斗', Xr, Y + 180, C.gold, fnt(800, 36)); });
    al(g, pop(t, 2, .6), () => txt(g, '今天叫“高斯消元法”；书中还用红黑算筹区分正负数', R.x + 80, Y + 440, C.fg3, fnt(500, 24)));
  },
  liuhui: (g, t, R, st) => {
    if (st.k === 0) {
      hdr(g, R, '刘徽割圆术', '263 年注《九章算术》· 割之弥细，所失弥少');
      const cx = R.x + 380, cy = R.y + 480, r = 290; const ns = [6, 12, 24, 48, 96, 192]; const D = st.bs && st.bs[1] ? st.bs[1] : 18;
      const idx = Math.min(5, Math.floor(CL((t - .6) / (D * .8)) * 6)), n = ns[idx];
      g.save(); g.strokeStyle = C.fg3; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke(); g.fillStyle = 'rgba(255,178,92,.18)'; g.strokeStyle = C.o; g.lineWidth = 2.5; g.beginPath();
      for (let i = 0; i <= n; i++) { const a = i / n * TAU - Math.PI / 2; const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.fill(); g.stroke(); g.restore();
      const X = R.x + 820; txt(g, '边数', X, R.y + 180, C.fg3, fnt(600, 24)); txt(g, '内接多边形面积（半径 1）', X + 160, R.y + 180, C.o, fnt(600, 24));
      ns.forEach((m, i) => { if (i > idx) return; const y = R.y + 240 + i * 70; txt(g, String(m), X, y, C.fg, fnt(800, 32, 'mono')); txt(g, (m / 2 * Math.sin(TAU / m)).toFixed(6), X + 160, y, C.o, fnt(700, 32, 'mono')); });
      al(g, idx === 5 ? 1 : 0, () => txt(g, '刘徽取 π ≈ 3.14，后又算到约 3.1416', X, R.y + 700, C.gold, fnt(800, 34)));
    } else {
      hdr(g, R, '祖冲之的圆周率', '约 480 年 · 建康 · 结果见于《隋书·律历志》');
      const L = [['3.1415926 < π < 3.1415927', C.gold, 54], ['约率 22/7 = 3.142857…', C.fg2, 38], ['密率 355/113 = 3.1415929…', C.gold, 44], ['π = 3.14159265…', C.b, 38]];
      L.forEach(([s_, col, fs], i) => al(g, pop(st.tk, .4 + i * 1, .5), () => txt(g, s_, R.x + 160, R.y + 230 + i * 130, col, fnt(800, fs, 'mono'))));
      al(g, pop(st.tk, 4.6, .6), () => banner(g, R, '这一精度保持了近一千年，直到 1424 年撒马尔罕的卡西', 1));
    }
  },
  crt: (g, t, R, st) => {
    hdr(g, R, '物不知数', '《孙子算经》· 约 3–5 世纪 · 成书年代不确定');
    const rows = [[3, 2], [5, 3], [7, 2]]; const N = 23;
    rows.forEach(([m, rem], i) => { const y = R.y + 230 + i * 190; al(g, pop(t, .5 + i * 1.6, .5), () => {
      txt(g, `${['三三', '五五', '七七'][i]}数之剩 ${rem}`, R.x + 40, y, C.fg, fnt(800, 32));
      for (let j = 0; j < N; j++) { const grpI = Math.floor(j / m), inR = j >= N - rem; const x = R.x + 360 + j * 52 + grpI * 14; dot(g, x, y, 17, inR ? C.gold : [C.b, C.g, C.p][i]); } }); });
    al(g, pop(t, 6, .6), () => { txt(g, '答：二十三', R.x + 40, R.y + 790, C.gold, fnt(800, 44)); txt(g, '后来秦九韶的“大衍求一术”给出了一般解法 → 中国剩余定理', R.x + 400, R.y + 790, C.fg2, fnt(600, 28)); });
  },
  lost: (g, t, R, st) => {
    hdr(g, R, '失传的书', '只知道书名或结果，原文已经不在');
    const B = [['《缀术》', '祖冲之 · 约 5 世纪', '唐代列为算学教材，后失传', C.o], ['丢番图《算术》注', '希帕提娅 · 约 400 年', '注释没有传下来', C.r], ['《圆锥曲线》', '欧几里得 · 约前 300 年', '被阿波罗尼奥斯的著作取代后失传', C.b], ['摩陀婆的原著', '喀拉拉 · 约 1400 年', '只在学生的著作中留下引用', C.g]];
    B.forEach(([a, b, c, col], i) => { const x = R.x + 30 + i * 420, y = R.y + 200, u = pop(t, .4 + i * .5, .6), fade = st.k > 0 ? 1 : pop(t, 3.5 + i * .4, 1.2);
      al(g, u * (1 - .55 * fade), () => book(g, x, y, 360, 400, a, '', col)); al(g, u, () => { txt(g, b, x + 30, y + 460, C.fg2, fnt(600, 24)); wrapTxt(g, c, x + 30, y + 506, 330, 32, C.fg3, fnt(500, 22)); });
      al(g, fade * u, () => { g.save(); g.translate(x + 180, y + 220); g.rotate(-.25); rr(g, -110, -36, 220, 72, 10, 'rgba(255,107,107,.12)', C.bad, 3); txt(g, '失传', 0, 2, C.bad, fnt(900, 40), 'center'); g.restore(); }); });
  },
});
