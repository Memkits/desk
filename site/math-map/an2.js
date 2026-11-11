// 第二集画面（非地图）
Object.assign(AN, {
  zerorule: (g, t, R, st) => {
    hdr(g, R, '婆罗摩笈多的零与负数规则', '《婆罗摩历算书》· 628 年 · 比尔马拉');
    const L = [['a + 0 = a', '一个数加零，还是它自己'], ['a − a = 0', '一个数减去它自己，得零'], ['(−a) × (−b) = ab', '债务乘债务，得财产'], ['(+a) × (−b) = −ab', '财产乘债务，得债务']];
    L.forEach(([e, s], i) => al(g, pop(t, .5 + i * .9, .5), () => { const y = R.y + 200 + i * 110; rr(g, R.x + 40, y - 40, 820, 84, 14, 'rgba(14,20,36,.9)', C.b, 2); txt(g, e, R.x + 70, y, C.gold, fnt(800, 38, 'mono')); txt(g, s, R.x + 440, y, C.fg2, fnt(600, 26)); }));
    // 财产 / 债务
    al(g, K(st, 1, .3, .6), () => {
      const X = R.x + 980, Y = R.y + 220; txt(g, '正数 = 财产', X, Y, C.g, fnt(800, 36)); txt(g, '负数 = 债务', X, Y + 70, C.r, fnt(800, 36));
      for (let i = 0; i < 5; i++) { dot(g, X + 280 + i * 40, Y, 15, C.g); dot(g, X + 280 + i * 40, Y + 70, 15, 'rgba(255,122,147,.25)'); g.strokeStyle = C.r; g.lineWidth = 2.5; g.beginPath(); g.arc(X + 280 + i * 40, Y + 70, 15, 0, TAU); g.stroke(); }
      rr(g, X - 20, Y + 200, 700, 170, 16, 'rgba(255,107,107,.08)', C.bad, 2); txt(g, '0 ÷ 0 = 0', X + 10, Y + 250, C.fg, fnt(800, 42, 'mono')); cross(g, X + 300, Y + 250, pop(st.tk, 2.5, .5), C.bad, 22);
      txt(g, '这一条后来被证明是错的：0 ÷ 0 没有确定的值', X + 10, Y + 320, C.fg2, fnt(600, 25));
    });
  },
  square: (g, t, R, st) => {
    hdr(g, R, '花拉子米的配方法', 'x² + 10x = 39 · 只用文字和图形，不用符号');
    const ox = R.x + 380, oy = R.y + 460, u = 34, x = 3, h = 2.5; // x 的图上长度 3u
    const S = v => v * u * 2.2;
    const st1 = pop(t, .6, .6), st2 = pop(t, 2.2, .8), st3 = pop(t, 5, .8);
    al(g, st1, () => { rr(g, ox - S(x) / 2, oy - S(x) / 2, S(x), S(x), 0, 'rgba(92,180,255,.25)', C.b, 3); txt(g, 'x²', ox, oy, C.fg, fnt(800, 40, 'serif'), 'center'); });
    al(g, st2, () => { const P = [[0, -1], [0, 1], [-1, 0], [1, 0]]; P.forEach(([dx, dy]) => { const w = dx ? S(h) : S(x), hh = dx ? S(x) : S(h); const cx = ox + dx * (S(x) / 2 + S(h) / 2), cy = oy + dy * (S(x) / 2 + S(h) / 2); rr(g, cx - w / 2, cy - hh / 2, w, hh, 0, 'rgba(95,224,160,.22)', C.g, 3); txt(g, '2.5x', cx, cy, C.fg, fnt(700, 26, 'serif'), 'center'); }); });
    al(g, st3, () => { [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy]) => { const cx = ox + dx * (S(x) / 2 + S(h) / 2), cy = oy + dy * (S(x) / 2 + S(h) / 2); rr(g, cx - S(h) / 2, cy - S(h) / 2, S(h), S(h), 0, 'rgba(255,210,122,.3)', C.gold, 3); txt(g, '6¼', cx, cy, C.fg, fnt(700, 24, 'serif'), 'center'); }); });
    const X = R.x + 900; const L = [['正方形 x² 加上四块长条 4 × 2.5x = 10x', st2, C.g], ['面积合计 = 39', st2, C.fg], ['补上四个角：4 × 6¼ = 25', st3, C.gold], ['大正方形面积 = 39 + 25 = 64', pop(t, 6.5, .6), C.fg], ['边长 = 8，所以 x = 8 − 2.5 − 2.5 = 3', pop(t, 8, .6), C.gold]];
    L.forEach(([s_, a, col], i) => al(g, a, () => txt(g, s_, X, R.y + 220 + i * 90, col, fnt(700, 30))));
  },
  khayyam: (g, t, R, st) => {
    hdr(g, R, '海亚姆：用两条曲线解三次方程', '约 1070 年 · 撒马尔罕 · 例：x³ + x = 10');
    const ox = R.x + 160, oy = R.y + 700, s = 56; const P = (x, y) => [ox + x * s, oy - y * s];
    line(g, [P(-1, 0), P(11, 0)], C.line2, 2); line(g, [P(0, -1), P(0, 9.5)], C.line2, 2);
    const u1 = pop(t, .6, 1.4), u2 = pop(t, 2.4, 1.4);
    g.save(); g.strokeStyle = C.b; g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= 60 * u1; i++) { const x = i / 60 * 3.05; const p = P(x, x * x); i ? g.lineTo(...p) : g.moveTo(...p); } g.stroke();
    g.strokeStyle = C.g; g.beginPath(); for (let i = 0; i <= 100 * u2; i++) { const a = Math.PI - i / 100 * Math.PI; const p = P(5 + 5 * Math.cos(a), 5 * Math.sin(a)); i ? g.lineTo(...p) : g.moveTo(...p); } g.stroke(); g.restore();
    al(g, u1, () => txt(g, '抛物线 y = x²', P(3, 9)[0] + 16, P(3, 9)[1], C.b, fnt(700, 26)));
    al(g, u2, () => txt(g, '圆：直径 0 到 10', P(8.4, 4.6)[0], P(8.4, 4.6)[1] - 20, C.g, fnt(700, 26)));
    const a3 = pop(t, 4.4, .6); al(g, a3, () => { const p = P(2, 4); glow(g, ...p, 40, C.gold + '66'); dot(g, ...p, 10, C.gold); line(g, [p, P(2, 0)], C.gold, 2, [8, 6]); txt(g, 'x = 2', P(2, 0)[0], P(2, 0)[1] + 34, C.gold, fnt(800, 30, 'mono'), 'center'); });
    const X = R.x + 1000; [['交点的横坐标，就是方程的根', a3, C.fg], ['验算：2³ + 2 = 10', pop(t, 5.6, .5), C.gold], ['海亚姆把三次方程分成十几类', pop(t, 7, .5), C.fg2], ['每一类都找到了对应的两条圆锥曲线', pop(t, 7.6, .5), C.fg2], ['代数解法：要等到 1545 年的《大术》', pop(t, 9, .5), C.fg3]].forEach(([s_, a, col], i) => al(g, a, () => txt(g, s_, X, R.y + 220 + i * 80, col, fnt(700, 28))));
  },
  sine: (g, t, R, st) => {
    hdr(g, R, st.k === 0 ? '从弦到半弦' : '“正弦”名字的旅程', st.k === 0 ? '希腊：弦表 → 印度：半弦（正弦）表' : '一串误译，变成了今天的 sine');
    const cx = R.x + 340, cy = R.y + 460, r = 270, th = .9;
    g.save(); g.strokeStyle = C.fg3; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke(); g.restore();
    const A = [cx + r * Math.cos(th), cy - r * Math.sin(th)], B = [cx + r * Math.cos(th), cy + r * Math.sin(th)], M = [cx + r * Math.cos(th), cy];
    line(g, [[cx, cy], A], C.fg2, 2); line(g, [[cx, cy], B], C.fg2, 2);
    line(g, [A, B], C.b, 5); txt(g, '弦（希腊）', B[0] + 16, B[1] + 10, C.b, fnt(700, 26));
    al(g, pop(t, 1.6, .6), () => { line(g, [A, M], C.gold, 8); txt(g, '半弦 = 正弦（印度）', A[0] + 18, (A[1] + M[1]) / 2, C.gold, fnt(800, 28)); });
    if (st.k === 0) { al(g, pop(t, 3, .6), () => { const X = R.x + 860; txt(g, '喜帕恰斯、托勒密：弦长表', X, R.y + 260, C.b, fnt(700, 32)); txt(g, '阿耶波多（499 年）：半弦表', X, R.y + 340, C.gold, fnt(700, 32)); txt(g, '半弦更好用：直角三角形里直接可用', X, R.y + 420, C.fg2, fnt(600, 26)); }); return; }
    const chain = [['梵文', 'jyā', '弓弦、半弦'], ['阿拉伯文', 'jība', '音译'], ['误读', 'jayb', '胸口、衣襟'], ['拉丁文', 'sinus', '意译“胸口、弯曲”'], ['英文', 'sine', '今天的正弦']];
    chain.forEach(([a, b, c], i) => al(g, pop(st.tk, .4 + i * 1.2, .5), () => { const x = R.x + 760, y = R.y + 190 + i * 128; rr(g, x, y, 820, 100, 14, 'rgba(14,20,36,.92)', i === 4 ? C.gold : C.line2, 2); txt(g, a, x + 24, y + 50, C.fg3, fnt(600, 24)); txt(g, b, x + 200, y + 50, '#fff', fnt(800, 40, 'serif')); txt(g, c, x + 430, y + 50, C.fg2, fnt(600, 26)); if (i) arrow(g, x + 60, y - 26, x + 60, y - 4, C.fg3, 2, 8); }));
  },
  jiaxian: (g, t, R, st) => {
    hdr(g, R, '贾宪三角（杨辉三角）', '贾宪约 1050 年 · 杨辉 1261 年转录 · 欧洲称帕斯卡三角（1654）');
    const N = 7, cx = R.x + 560, y0 = R.y + 170, dx = 76, dy = 84; const row = [[1]]; for (let i = 1; i < N; i++) { const p = row[i - 1]; row.push([1, ...p.slice(1).map((v, j) => v + p[j]), 1]); }
    row.forEach((r, i) => r.forEach((v, j) => { const a = pop(t, .4 + i * .7 + j * .05, .4); const x = cx + (j - i / 2) * dx, y = y0 + i * dy;
      al(g, a, () => { dot(g, x, y, 30, i === N - 1 ? 'rgba(255,210,122,.18)' : 'rgba(14,20,36,.95)'); g.strokeStyle = i === N - 1 ? C.gold : C.line2; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 30, 0, TAU); g.stroke(); txt(g, String(v), x, y + 1, '#fff', fnt(800, 26, 'mono'), 'center');
        if (i > 1 && j > 0 && j < i) { line(g, [[x - dx / 2 + 14, y - dy + 26], [x - 10, y - 24]], C.fg3 + '88', 1.5); line(g, [[x + dx / 2 - 14, y - dy + 26], [x + 10, y - 24]], C.fg3 + '88', 1.5); } }); }));
    const X = R.x + 1150; [['每个数 = 上方两数之和', 2, C.fg], ['第 n 行 = (a + b)ⁿ 展开的系数', 3.2, C.fg], ['(a + b)⁶ = a⁶ + 6a⁵b + 15a⁴b² + …', 4.4, C.gold], ['贾宪用它来开高次方（增乘开方法）', 5.6, C.fg2]].forEach(([s_, d, col], i) => al(g, pop(t, d, .5), () => wrapTxt(g, s_, X, R.y + 220 + i * 110, 560, 36, col, fnt(700, 28))));
  },
  madhava: (g, t, R, st) => {
    hdr(g, R, '摩陀婆的 π 级数', '约 1400 年 · 喀拉拉 · 欧洲称莱布尼茨级数（1670 年代）');
    eq(g, 'π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − …', R.x + 860, R.y + 170, C.gold, 48);
    const X0 = R.x + 120, Y0 = R.y + 520, W = 1500, Hs = 900; const yv = v => Y0 - (v - Math.PI) * Hs;
    line(g, [[X0, yv(Math.PI)], [X0 + W, yv(Math.PI)]], C.b, 2, [8, 6]); txt(g, 'π = 3.14159…', X0 + W + 10, yv(Math.PI), C.b, fnt(700, 24));
    const n = Math.floor(CL((t - .8) / 8) * 40); let s = 0; const pts = [];
    for (let i = 0; i <= 40; i++) { s += (i % 2 ? -1 : 1) * 4 / (2 * i + 1); pts.push([X0 + i * W / 40, yv(s), s]); }
    g.save(); g.strokeStyle = C.o; g.lineWidth = 2.5; g.beginPath(); pts.slice(0, n + 1).forEach((p, i) => { const yy = CL(p[1], R.y + 220, R.y + 800); i ? g.lineTo(p[0], yy) : g.moveTo(p[0], yy); }); g.stroke(); g.restore();
    pts.slice(0, n + 1).forEach((p, i) => dot(g, p[0], CL(p[1], R.y + 220, R.y + 800), 5, C.o));
    if (n >= 0) txt(g, `前 ${n + 1} 项 × 4 = ${pts[n][2].toFixed(5)}`, R.x + 1000, R.y + 260, C.fg, fnt(700, 30, 'mono'));
    al(g, K(st, 1, .5, .6), () => { rr(g, R.x + 820, R.y + 700, 880, 130, 14, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '收敛很慢：学派加了修正项，用较少的项', R.x + 850, R.y + 745, C.fg, fnt(700, 28)); txt(g, '就把 π 算到小数点后十位左右', R.x + 850, R.y + 790, C.fg, fnt(700, 28)); });
  },
  cubic: (g, t, R, st) => {
    hdr(g, R, '三次方程之争', '博洛尼亚 · 威尼斯 · 米兰（1515 – 1572）');
    const ev = [[1515, '费罗', '找到解法，秘而不宣', C.fg2], [1535, '塔尔塔利亚', '解题比赛中独立求得', C.b], [1539, '卡尔达诺', '得到写成诗的解法，承诺不发表', C.o], [1545, '《大术》', '公开解法，并收入费拉里的四次方程解法', C.gold], [1572, '邦贝利', '《代数》写下复数的运算规则', C.p]];
    const X0 = R.x + 80, X1 = R.x + 1640, Y = R.y + 230, Xv = v => LERP(X0, X1, (v - 1510) / 66);
    const show = st.k === 0 ? 3 : st.k === 1 ? 4 : 5;
    line(g, [[X0, Y], [X1, Y]], C.line2, 4);
    ev.forEach(([y, who, s_, col], i) => { if (i >= show) return; const a = st.k === 0 ? pop(t, .3 + i * .9, .5) : i < show - 1 ? 1 : pop(st.tk, .3, .5); const x = Xv(y), up = i % 2 === 0;
      al(g, a, () => { dot(g, x, Y, 11, col); txt(g, String(y), x, Y + (up ? -30 : 34), col, fnt(800, 26, 'mono'), 'center'); txt(g, who, x, Y + (up ? -72 : 76), '#fff', fnt(800, 28), 'center'); txt(g, s_, x, Y + (up ? -108 : 112), C.fg2, fnt(500, 21), 'center'); }); });
    const by = R.y + 450;
    if (st.k <= 1) al(g, pop(st.k === 0 ? t : 99, 3, .6), () => { txt(g, '缺项三次方程 x³ + px = q 的解：', R.x + 80, by, C.fg2, fnt(700, 30));
      eq(g, 'x = ∛(q/2 + √(q²/4 + p³/27)) + ∛(q/2 − √(q²/4 + p³/27))', R.x + 860, by + 100, C.gold, 40); txt(g, '（今天的写法；当时全用文字叙述）', R.x + 80, by + 180, C.fg3, fnt(500, 24)); });
    if (st.k === 1) al(g, pop(st.tk, 1.5, .6), () => { txt(g, '有时根号里出现负数：√(−121)……卡尔达诺称它“既巧妙又无用”', R.x + 80, by + 260, C.r, fnt(700, 28)); });
    if (st.k === 2) al(g, pop(st.tk, .4, .6), () => { txt(g, '邦贝利的例子：x³ = 15x + 4', R.x + 80, by, C.fg, fnt(800, 34));
      eq(g, 'x = ∛(2 + √−121) + ∛(2 − √−121)', R.x + 760, by + 90, C.gold, 44);
      al(g, pop(st.tk, 2.4, .6), () => { eq(g, '= (2 + √−1) + (2 − √−1) = 4', R.x + 760, by + 180, C.g, 44); txt(g, '验算：4³ = 64 = 15 × 4 + 4 ✓   经过“虚”的数，得到了实的答案', R.x + 80, by + 270, C.fg2, fnt(600, 28)); }); });
  },
  log: (g, t, R, st) => {
    hdr(g, R, '对数：把乘法变成加法', '纳皮尔 · 1614 年 · 爱丁堡（下表用以 2 为底示意）');
    const X = R.x + 80, Y = R.y + 230, cw = 140;
    txt(g, '指数', X, Y, C.b, fnt(700, 26)); txt(g, '数', X, Y + 90, C.fg2, fnt(700, 26));
    for (let i = 0; i <= 10; i++) { const x = X + 110 + i * cw, a = pop(t, .4 + i * .1, .4), hot = i === 3 || i === 5 || i === 8;
      al(g, a, () => { rr(g, x, Y - 32, cw - 14, 64, 10, hot && pop(t, 2.5, .4) > 0 ? 'rgba(92,180,255,.2)' : 'rgba(14,20,36,.9)', C.line2, 1.5); txt(g, String(i), x + (cw - 14) / 2, Y, C.b, fnt(800, 30, 'mono'), 'center');
        rr(g, x, Y + 58, cw - 14, 64, 10, hot && pop(t, 2.5, .4) > 0 ? 'rgba(255,210,122,.15)' : 'rgba(14,20,36,.9)', C.line2, 1.5); txt(g, String(2 ** i), x + (cw - 14) / 2, Y + 90, C.fg, fnt(800, 28, 'mono'), 'center'); }); }
    const L = [['想算 8 × 32', 2.4, C.fg], ['查表：8 → 3，32 → 5', 3.6, C.b], ['3 + 5 = 8（只做加法）', 4.8, C.b], ['再查回去：8 → 256', 6, C.gold], ['所以 8 × 32 = 256', 7.2, C.gold]];
    L.forEach(([s_, d, col], i) => al(g, pop(t, d, .5), () => txt(g, s_, X + 40, Y + 250 + i * 76, col, fnt(800, 34))));
    al(g, pop(t, 8.4, .6), () => { rr(g, R.x + 900, Y + 260, 720, 220, 14, 'rgba(14,20,36,.9)', C.line2, 2); txt(g, '真实的对数表很密：', R.x + 930, Y + 310, C.fg2, fnt(600, 26)); txt(g, '1624 年布里格斯的常用对数表', R.x + 930, Y + 360, C.fg, fnt(700, 28)); txt(g, '以 10 为底，精确到 14 位', R.x + 930, Y + 410, C.fg, fnt(700, 28)); });
  },
});
