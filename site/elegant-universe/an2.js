// 第二集动画：万物皆是弦

AN.open2 = (g, t, R, st) => {
  stars(g, { x: 0, y: 0, w: 1920, h: 1080 }, t, 200);
  const cx = R.x + R.w / 2, cy = R.y + 360;
  al(g, pop(t, .2, 1), () => loop(g, cx, cy, 170, 6, 30 * (.6 + .4 * Math.sin(t * 1.4)), t * 2.6, C.gold, 5, 320));
  if (st.k === 1) { const it = [['来历', C.b], ['振动', C.gold], ['化解冲突', C.g], ['超对称', C.r], ['额外维度', C.p], ['最小尺度', C.o], ['检验', C.fg2]]; let x = R.x + 60; it.forEach(([s, col], i) => { const w = chip(g, s, x, R.y + 720, col, pop(st.tk, .3 + i * .4), 26); x += w + 24; }); }
};

AN.hist = (g, t, R, st) => {
  hdr(g, R, '弦论的来历', '从强力的公式，到包含引力的统一理论');
  const E = [[1968, '韦内齐亚诺', '欧拉的 β 函数恰好描述强力散射', C.b], [1970, '南部 · 尼尔森 · 萨斯坎德', '公式背后：粒子由一根弦连着', C.b], [1974, '谢尔克 · 施瓦茨', '弦里有引力子 → 统一理论', C.gold], [1984, '格林 · 施瓦茨', '反常抵消：第一次超弦革命', C.r]];
  const x0 = R.x + 80, x1 = R.x + R.w - 80, y = R.y + 270, X = i => LERP(x0, x1, i / 3);
  line(g, [[x0, y], [x1, y]], C.line, 2);
  line(g, [[x0, y], [X(Math.min(3, st.k)), y]], C.line2, 4);
  E.forEach(([yr, a, b, col], i) => {
    const u = K(st, i); if (u <= 0) return; const x = X(i), cur = i === st.k;
    al(g, u * (cur ? 1 : .55), () => { dot(g, x, y, cur ? 14 : 9, col); txt(g, String(yr), x, y - 50, col, fnt(800, 34, 'mono'), 'center'); txt(g, a, x, y + 52, C.fg, fnt(700, 24), 'center'); wrapTxt(g, b, x - 160, y + 96, 320, 30, C.fg2, fnt(500, 21)); });
  });
  // 下方插图
  const cx = R.x + R.w / 2, cy = R.y + 640, tk = st.tk;
  al(g, pop(tk, .6), () => {
    if (st.k === 0) { txt(g, 'B(x, y) = Γ(x)Γ(y) / Γ(x+y)', cx, cy, C.b, fnt(700, 44, 'serif'), 'center'); txt(g, '欧拉 β 函数（18 世纪）', cx, cy + 60, C.fg3, fnt(600, 22), 'center'); }
    if (st.k === 1) { ball(g, cx - 200, cy, 30, C.r); ball(g, cx + 200, cy, 30, C.b); ostring(g, cx - 170, cy, cx + 170, cy, 1, 30 * Math.sin(t * 3), 0, C.gold, 4); txt(g, '强子 = 用弦连着的夸克？', cx, cy + 80, C.fg2, fnt(600, 24), 'center'); }
    if (st.k === 2) { loop(g, cx - 160, cy, 60, 2, 10, t * 3, C.gold, 4); txt(g, '自旋 2 · 无质量 → 引力子', cx + 140, cy, C.gold, fnt(700, 28), 'center'); txt(g, '弦长缩到约 10⁻³⁵ 米', cx + 140, cy + 50, C.fg2, fnt(600, 22), 'center'); }
    if (st.k === 3) { txt(g, '反常 → 0', cx, cy - 10, C.ok, fnt(800, 60, 'serif'), 'center'); for (let i = 0; i < 30; i++) person(g, cx - 560 + (i % 15) * 80, cy + 90 + Math.floor(i / 15) * 60, i < Math.min(30, Math.floor(tk * 4)) ? C.r : C.line2, .7); }
  });
};

// 振动模式
AN.modes = (g, t, R, st) => {
  const tk = st.tk;
  if (st.k === 0) {
    hdr(g, R, '放大到极致：一小段弦', '物质 → 原子 → 原子核 → 夸克 → 弦');
    const lv = [['原子', 10], ['原子核', 10], ['夸克', 10], ['弦', 0]], w = (R.w - 3 * 40) / 4, y = R.y + 200;
    lv.forEach(([s], i) => { const u = pop(t, .4 + i * 1.6), x = R.x + i * (w + 40), cx = x + w / 2, cy = y + 230;
      al(g, u, () => { rr(g, x, y, w, 460, 18, 'rgba(14,20,36,.9)', i === 3 ? C.gold : C.line2, 2);
        if (i === 0) { dot(g, cx, cy, 16, C.r); for (let k = 0; k < 3; k++) { g.strokeStyle = 'rgba(92,180,255,.5)'; g.lineWidth = 2; g.beginPath(); g.ellipse(cx, cy, 140, 50, k * 1.05 + t * .2, 0, TAU); g.stroke(); dot(g, cx + 140 * Math.cos(t * 2 + k), cy + 50 * Math.sin(t * 2 + k), 7, C.b); } }
        if (i === 1) for (let k = 0; k < 12; k++) ball(g, cx + Math.cos(k * 2.4) * 40 * Math.sqrt(k / 12) * 1.8, cy + Math.sin(k * 2.4) * 40 * Math.sqrt(k / 12) * 1.8, 22, k % 2 ? C.r : C.b);
        if (i === 2) [[-50, 30, C.r], [50, 30, C.g], [0, -50, C.b]].forEach(([dx, dy, col]) => ball(g, cx + dx, cy + dy, 34, col));
        if (i === 3) loop(g, cx, cy, 100, 3, 18, t * 3, C.gold, 5, 180);
        txt(g, s, cx, y + 420, i === 3 ? C.gold : C.fg, fnt(800, 30), 'center');
        if (i < 3) arrow(g, x + w + 6, cy, x + w + 34, cy, C.fg3, 3, 9); });
    });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '不同的振动方式 = 不同的粒子', '振得越剧烈，能量越高，质量越大');
    for (let n = 1; n <= 4; n++) { const y = R.y + 140 + n * 150, u = pop(tk, .3 + n * .8); al(g, u, () => { ostring(g, R.x + 120, y, R.x + R.w * .62, y, n, 50, tk * (3 + n), [C.b, C.g, C.o, C.r][n - 1], 4); txt(g, `第 ${n} 种振动`, R.x + R.w * .62 + 60, y - 14, C.fg, fnt(700, 26)); txt(g, '能量 ' + '▮'.repeat(n * 2), R.x + R.w * .62 + 60, y + 24, [C.b, C.g, C.o, C.r][n - 1], fnt(600, 22)); }); }
    return;
  }
  if (st.k === 2) {
    hdr(g, R, '同一种弦，奏出不同的音符', '宇宙的交响乐');
    const P = [['电子', 3, C.b], ['夸克', 4, C.r], ['光子', 2, C.gold], ['中微子', 5, C.g], ['引力子', 2, C.p]], w = R.w / 5;
    P.forEach(([s, n, col], i) => { const cx = R.x + w * i + w / 2, cy = R.y + 430, u = pop(tk, .3 + i * .7); al(g, u, () => { loop(g, cx, cy, 90, n, 16, tk * 3 + i, col, 4, 150); txt(g, s, cx, cy + 180, C.fg, fnt(800, 30), 'center'); }); });
    al(g, pop(tk, 5), () => { for (let i = 0; i < 5; i++) line(g, [[R.x + 100, R.y + 720 + i * 18], [R.x + R.w - 100, R.y + 720 + i * 18]], C.line2, 2); ['♪', '♫', '♪', '♬', '♪'].forEach((s, i) => txt(g, s, R.x + 200 + i * (R.w - 400) / 4, R.y + 740 + Math.sin(t * 2 + i) * 20, [C.b, C.r, C.gold, C.g, C.p][i], fnt(800, 50), 'center')); });
    return;
  }
  hdr(g, R, '闭弦与开弦', '引力子来自闭弦：弦论自动包含引力');
  const cx1 = R.x + R.w * .3, cx2 = R.x + R.w * .7, cy = R.y + 420;
  loop(g, cx1, cy, 120, 2, 22, tk * 3, C.p, 5, 200); txt(g, '闭弦', cx1, cy + 200, C.p, fnt(800, 32), 'center'); txt(g, '振动模式包含引力子', cx1, cy + 250, C.fg2, fnt(600, 24), 'center');
  ostring(g, cx2 - 160, cy, cx2 + 160, cy, 2, 50, tk * 3, C.b, 5); txt(g, '开弦', cx2, cy + 200, C.b, fnt(800, 32), 'center'); txt(g, '两端可以闭合成闭弦', cx2, cy + 250, C.fg2, fnt(600, 24), 'center');
};

AN.ladder = (g, t, R, st) => {
  hdr(g, R, '能量阶梯', '大多数模式接近普朗克能量；我们见到的是最低的那几级');
  const x0 = R.x + 200, x1 = R.x + R.w - 200, y0 = R.y + 780;
  line(g, [[x0 - 40, y0], [x0 - 40, R.y + 160]], C.fg3, 2); txt(g, '质量', x0 - 60, R.y + 160, C.fg2, fnt(600, 22), 'right');
  [1, 2, 3, 4].forEach(n => { const y = y0 - n * 145, u = pop(t, .3 + n * .5); al(g, u, () => { line(g, [[x0, y], [x1, y]], C.p, 3); txt(g, `${n} × 普朗克质量`, x1 + 20, y, C.p, fnt(600, 22)); for (let k = 0; k < 6; k++) dot(g, x0 + 60 + k * 120 + (n % 2) * 50, y, 6, C.p); }); });
  al(g, pop(t, 3), () => { line(g, [[x0, y0 - 6], [x1, y0 - 6]], C.gold, 5); txt(g, '≈ 0：电子、夸克、光子……', x0 + 20, y0 - 34, C.gold, fnt(700, 26)); });
  al(g, pop(t, 5), () => { rr(g, R.x + R.w / 2 - 300, R.y + 140, 600, 70, 14, 'rgba(14,20,36,.94)', C.fg3, 2); txt(g, '普朗克质量 ≈ 质子的 10¹⁹ 倍', R.x + R.w / 2, R.y + 175, C.fg, fnt(700, 26), 'center'); });
};

// 点粒子 vs 弦的相互作用
AN.pants = (g, t, R, st) => {
  hdr(g, R, st.k === 0 ? '点粒子：在一个点上相撞' : '弦：扫出一条“裤子”', st.k === 0 ? '所有能量挤在一点 → 无穷大' : '相互作用被抹开，不同观察者看到的“交点”不同');
  const cx1 = R.x + R.w * .27, cx2 = R.x + R.w * .73, top = R.y + 170, bot = R.y + 760, my = R.y + 480;
  const u = SS((st.k === 0 ? t : 99) / 3);
  line(g, [[cx1 - 200, bot], [LERP(cx1 - 200, cx1, Math.min(1, u * 2)), LERP(bot, my, Math.min(1, u * 2))]], C.b, 5);
  line(g, [[cx1 + 200, bot], [LERP(cx1 + 200, cx1, Math.min(1, u * 2)), LERP(bot, my, Math.min(1, u * 2))]], C.r, 5);
  if (u > .5) line(g, [[cx1, my], [cx1, LERP(my, top, (u - .5) * 2)]], C.p, 5);
  if (u > .5) { glow(g, cx1, my, 60, 'rgba(255,107,107,.6)'); txt(g, '∞', cx1 + 40, my, C.bad, fnt(800, 54, 'serif')); }
  txt(g, '点粒子', cx1, bot + 50, C.fg, fnt(800, 28), 'center');
  if (st.k >= 1) al(g, pop(st.tk, .3, 1), () => {
    // 裤子曲面：两个管子合成一个
    const tube = (y, w) => { g.strokeStyle = 'rgba(255,210,122,.75)'; g.lineWidth = 2; g.beginPath(); g.ellipse(cx2, y, w, w * .22, 0, 0, TAU); g.stroke(); };
    const L = [], Rr = [];
    for (let i = 0; i <= 40; i++) { const s = i / 40, y = LERP(bot, top, s), sep = s < .45 ? 150 * (1 - SS(s / .45)) : 0, w = s < .45 ? 55 + 20 * SS(s / .45) : 75;
      if (sep > 4) { [-1, 1].forEach(sg => { g.strokeStyle = 'rgba(255,210,122,.35)'; g.lineWidth = 1.5; g.beginPath(); g.ellipse(cx2 + sg * sep, y, w * (1 - SS(s / .45) * .3), w * .2, 0, 0, TAU); g.stroke(); }); }
      else { g.strokeStyle = 'rgba(255,210,122,.35)'; g.lineWidth = 1.5; g.beginPath(); g.ellipse(cx2, y, w, w * .2, 0, 0, TAU); g.stroke(); } }
    tube(top, 75);
    // 观察者切片
    const ang = Math.sin(st.tk * .8) * .25;
    g.save(); g.translate(cx2, R.y + 420); g.rotate(ang); line(g, [[-280, 0], [280, 0]], C.b, 3, [10, 8]); g.restore();
    g.save(); g.translate(cx2, R.y + 440); g.rotate(-ang - .15); line(g, [[-280, 0], [280, 0]], C.g, 3, [10, 8]); g.restore();
    txt(g, '观察者 A', cx2 + 290, R.y + 400, C.b, fnt(600, 20)); txt(g, '观察者 B', cx2 + 290, R.y + 470, C.g, fnt(600, 20));
    txt(g, '闭弦', cx2, bot + 50, C.gold, fnt(800, 28), 'center');
  });
  txt(g, '时间 ↑', R.x + 20, top, C.fg3, fnt(600, 20));
};

AN.probe = (g, t, R, st) => {
  hdr(g, R, '探针不能比自己更小', '比普朗克长度更细的涨落，弦“看不见”');
  const cx = R.x + R.w * .5, cy = R.y + 450;
  for (let j = 0; j < 9; j++) { const pts = []; for (let i = 0; i <= 140; i++) { const x = R.x + 80 + i / 140 * (R.w - 160); pts.push([x, cy - 200 + j * 50 + 18 * Math.sin(i * 1.1 + j + t * 3) * Math.sin(i * .37 - t)]); } line(g, pts, 'rgba(199,155,255,.35)', 1.5); }
  const r = 160 - 60 * SS(t / 4);
  g.save(); g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fillStyle = 'rgba(11,16,32,.85)'; g.fill(); g.clip();
  for (let j = 0; j < 9; j++) line(g, [[cx - r, cy - 200 + j * 50], [cx + r, cy - 200 + j * 50]], 'rgba(92,180,255,.6)', 2);
  g.restore(); g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke();
  loop(g, cx, cy, r * .4, 3, 6, t * 3, C.gold, 3);
  txt(g, '弦作探针：看到的是平均后的平滑时空', cx, cy + 260, C.fg, fnt(700, 26), 'center');
};

// 超对称
AN.susy = (g, t, R, st) => {
  hdr(g, R, st.k === 0 ? '自旋：费米子与玻色子' : '超对称：每个粒子都有一个伙伴', st.k === 0 ? '半整数自旋 · 整数自旋' : '伙伴的自旋差 1/2');
  const L = [['电子', '1/2', C.b], ['夸克', '1/2', C.r], ['中微子', '1/2', C.g]], Rt = [['光子', '1', C.gold], ['胶子', '1', C.p], ['W / Z', '1', C.o]];
  const P = [['标量电子', '0'], ['标量夸克', '0'], ['标量中微子', '0']], Q = [['光微子', '1/2'], ['胶微子', '1/2'], ['W/Z 微子', '1/2']];
  const cw = Math.min(250, R.w / 6), xs = [R.x + 40, R.x + 40 + cw + 30, R.x + R.w - 2 * cw - 70, R.x + R.w - cw - 40], y0 = R.y + 220;
  txt(g, '费米子', xs[0] + cw / 2, y0 - 30, C.fg2, fnt(700, 24), 'center'); txt(g, '玻色子', xs[2] + cw / 2, y0 - 30, C.fg2, fnt(700, 24), 'center');
  const box = (x, y, a, b, col, dash, u) => al(g, u, () => { g.save(); if (dash) g.setLineDash([8, 6]); rr(g, x, y, cw, 120, 14, 'rgba(14,20,36,.92)', col, 2.5); g.restore(); txt(g, a, x + cw / 2, y + 46, C.fg, fnt(800, 26), 'center'); txt(g, '自旋 ' + b, x + cw / 2, y + 86, C.fg3, fnt(600, 20), 'center'); });
  L.forEach(([a, b, col], i) => box(xs[0], y0 + i * 160, a, b, col, false, st.k === 0 ? pop(t, .3 + i * .3) : 1));
  Rt.forEach(([a, b, col], i) => box(xs[2], y0 + i * 160, a, b, col, false, st.k === 0 ? pop(t, 2 + i * .3) : 1));
  if (st.k === 0) { const a = t * 3; [[xs[0] + cw + 40, C.b], [xs[2] + cw + 40, C.gold]].forEach(([x, col]) => { g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.ellipse(x, y0 + 520, 22, 10, 0, a, a + 5); g.stroke(); }); }
  if (st.k >= 1) {
    P.forEach(([a, b], i) => { box(xs[1], y0 + i * 160, a, b, L[i][2], true, pop(st.tk, .5 + i * .5)); arrow(g, xs[0] + cw + 2, y0 + i * 160 + 60, xs[1] - 2, y0 + i * 160 + 60, C.fg3, 2, 8, pop(st.tk, .5 + i * .5)); });
    Q.forEach(([a, b], i) => { box(xs[3], y0 + i * 160, a, b, Rt[i][2], true, pop(st.tk, 2.5 + i * .5)); arrow(g, xs[2] + cw + 2, y0 + i * 160 + 60, xs[3] - 2, y0 + i * 160 + 60, C.fg3, 2, 8, pop(st.tk, 2.5 + i * .5)); });
    al(g, pop(st.tk, 5), () => txt(g, '虚线：超对称伙伴（至今未发现）', R.x + R.w / 2, y0 + 520, C.fg2, fnt(600, 24), 'center'));
  }
};

AN.unify = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '三种力的强度：加上超对称后交于一点', '横轴：能量（对数），纵轴：力的“弱度”（示意）');
    const x0 = R.x + 120, x1 = R.x + R.w - 80, y0 = R.y + 760, y1 = R.y + 160;
    line(g, [[x0, y1], [x0, y0], [x1, y0]], C.fg3, 2); txt(g, '能量 →', x1, y0 + 36, C.fg3, fnt(600, 20), 'right');
    const X = e => LERP(x0, x1, (e - 2) / 17), Y = v => LERP(y0, y1, v / 65);
    const lines = () => [[59, -2.3], [30, -.55], [8.5, 1.25]].map(([a, k]) => e => a + k * (e - 2));
    const draw = (fs, cols, dash, u) => fs.forEach((f, i) => { const pts = []; for (let e = 2; e <= 2 + 17 * u; e += .2) pts.push([X(e), Y(f(e))]); if (pts.length > 1) line(g, pts, cols[i], 4, dash); });
    const u1 = SS((t - .5) / 3), u2 = SS((t - 5) / 3);
    draw(lines(false), ['rgba(92,180,255,.35)', 'rgba(255,178,92,.35)', 'rgba(199,155,255,.35)'], [8, 8], u1);
    if (u1 > .9) txt(g, '虚线：没有超对称，三条线两两相交在不同位置', x1, R.y + 120, C.fg3, fnt(600, 22), 'right');
    // 超对称：在 e=16 交于 ~24
    const fS = [e => 59 + (24 - 59) * (e - 2) / 14, e => 30 + (24 - 30) * (e - 2) / 14, e => 8.5 + (24 - 8.5) * (e - 2) / 14];
    draw(fS, [C.b, C.o, C.p], null, u2 * 14 / 17 + 0.0001);
    if (u2 > .95) { glow(g, X(16), Y(24), 40, 'rgba(255,210,122,.6)'); txt(g, '约 10¹⁶ GeV 交于一点', X(16) - 20, Y(24) - 50, C.gold, fnt(700, 24), 'right'); }
    [['电磁', C.b, 59], ['弱力', C.o, 30], ['强力', C.p, 8.5]].forEach(([s, col, v]) => txt(g, s, x0 - 14, Y(v), col, fnt(700, 22), 'right'));
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '超弦：没有超对称，弦论不自洽', '');
    const cx1 = R.x + R.w * .28, cx2 = R.x + R.w * .72, cy = R.y + 420;
    rr(g, cx1 - 300, cy - 200, 600, 420, 20, 'rgba(14,20,36,.92)', C.bad, 2); txt(g, '玻色弦', cx1, cy - 150, C.bad, fnt(800, 32), 'center');
    ['只有玻色子（没有电子、夸克）', '出现“快子”：比光还快的怪粒子', '需要 26 维'].forEach((s, i) => { cross(g, cx1 - 240, cy - 60 + i * 80, pop(st.tk, .5 + i * .6), C.bad, 10); txt(g, s, cx1 - 210, cy - 60 + i * 80, C.fg, fnt(600, 24)); });
    al(g, pop(st.tk, 3), () => { rr(g, cx2 - 300, cy - 200, 600, 420, 20, 'rgba(14,20,36,.92)', C.ok, 2); txt(g, '超弦', cx2, cy - 150, C.ok, fnt(800, 32), 'center'); ['费米子和玻色子都有', '快子消失', '需要 10 维'].forEach((s, i) => check(g, cx2 - 250, cy - 60 + i * 80, s, pop(st.tk, 3.5 + i * .5))); });
    return;
  }
  hdr(g, R, '最轻的超对称伙伴：暗物质候选', '稳定、不带电、几乎不与普通物质作用');
  const cx = R.x + R.w / 2, cy = R.y + 470;
  glow(g, cx, cy, 340, 'rgba(199,155,255,.18)');
  for (let i = 0; i < 400; i++) { const a = HSH(i, 1) * TAU, r = Math.pow(HSH(i, 2), .6) * 220, arm = a + r * .02 + t * .1; dot(g, cx + Math.cos(arm) * r * 1.4, cy + Math.sin(arm) * r * .5, 1.8, 'rgba(255,230,180,.8)'); }
  for (let i = 0; i < 60; i++) { const a = HSH(i, 5) * TAU + t * .05, r = 200 + HSH(i, 6) * 160; dot(g, cx + Math.cos(a) * r * 1.3, cy + Math.sin(a) * r * .8, 4, 'rgba(199,155,255,.7)'); }
  txt(g, '紫点：暗物质晕（示意）', cx, cy + 340, C.p, fnt(600, 24), 'center');
  al(g, pop(st.tk, 3), () => { let x = R.x + 40; ['消除精细调节', '力的统一', '暗物质'].forEach((s, i) => { x += chip(g, '① ② ③'.split(' ')[i] + ' ' + s, x, R.y + 160, C.gold, 1, 24) + 20; }); });
};

// 浇花水管
AN.hose = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '1919：卡鲁扎的第四个空间维度', '多一维，广义相对论就能把电磁力也装进来');
    const cx = R.x + R.w / 2, cy = R.y + 450;
    rr(g, cx - 520, cy - 150, 400, 300, 18, 'rgba(14,20,36,.92)', C.b, 2); txt(g, '引力（4 维时空）', cx - 320, cy - 60, C.b, fnt(800, 28), 'center'); txt(g, 'G_μν', cx - 320, cy + 20, C.fg, fnt(700, 40, 'serif'), 'center');
    al(g, pop(t, 2), () => { txt(g, '+ 1 维', cx, cy, C.gold, fnt(800, 40), 'center'); });
    al(g, pop(t, 3.5), () => { rr(g, cx + 120, cy - 150, 400, 300, 18, 'rgba(14,20,36,.92)', C.gold, 2.5); txt(g, '引力 + 电磁力', cx + 320, cy - 60, C.gold, fnt(800, 28), 'center'); txt(g, '5 维广义相对论', cx + 320, cy + 20, C.fg, fnt(700, 28), 'center'); });
    return;
  }
  hdr(g, R, '1926：克莱因——这个维度卷成了小圈', '远看水管是一条线，走近才看到绕圈的方向');
  const zoom = SS((st.tk - 2) / 4), cy = R.y + 450, x0 = R.x + 60, x1 = R.x + R.w - 60;
  const r = LERP(4, 120, zoom);
  rr(g, x0, cy - r, x1 - x0, 2 * r, r, 'rgba(92,180,255,.12)', C.b, 3);
  if (zoom > .3) { for (let i = 0; i < 12; i++) { const x = x0 + 100 + i * (x1 - x0 - 200) / 11; g.strokeStyle = 'rgba(92,180,255,.4)'; g.lineWidth = 2; g.beginPath(); g.ellipse(x, cy, r * .3, r, 0, 0, TAU); g.stroke(); }
    const a = st.tk * 2, ax = R.x + R.w / 2 + Math.sin(st.tk * .5) * 200; const ay = cy + Math.sin(a) * r, vis = Math.cos(a) > 0;
    al(g, (zoom - .3) / .7 * (vis ? 1 : .35), () => { dot(g, ax, ay, 10, C.gold); dot(g, ax + 12, ay, 8, C.gold); dot(g, ax - 10, ay, 7, C.gold); });
    txt(g, '蚂蚁可以绕圈走', R.x + R.w / 2, cy + r + 60, C.gold, fnt(700, 26), 'center'); }
  else txt(g, '远看：一条线（一维）', R.x + R.w / 2, cy + 60, C.fg2, fnt(700, 26), 'center');
};

// 卡拉比–丘
function cyShape(g, cx, cy, s, t, col = C.p, a = 1) {
  al(g, a, () => { g.strokeStyle = col; g.lineWidth = 1.2; for (let k = 0; k < 5; k++) { g.beginPath(); for (let i = 0; i <= 120; i++) { const u = i / 120 * TAU; const r = s * (.55 + .3 * Math.cos(3 * u + k * 1.3 + t) + .15 * Math.sin(5 * u - t * .7)); const x = cx + r * Math.cos(u + k * .6) * (1 + .3 * Math.sin(k + t * .5)), y = cy + r * Math.sin(u + k * .6) * .8; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } });
}
AN.cy = (g, t, R, st) => {
  const tk = st.tk;
  if (st.k === 0) {
    hdr(g, R, '弦论需要 9 维空间 + 1 维时间', '多出的 6 维卷缩在每一个点上');
    const N = 7, M = 4, gx = R.x + 120, gy = R.y + 200, sx = (R.w - 240) / (N - 1), sy = 130;
    for (let i = 0; i < N; i++) line(g, [[gx + i * sx, gy], [gx + i * sx, gy + (M - 1) * sy]], C.line2, 2);
    for (let j = 0; j < M; j++) line(g, [[gx, gy + j * sy], [gx + (N - 1) * sx, gy + j * sy]], C.line2, 2);
    const z = SS((tk - 2) / 2);
    for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) { dot(g, gx + i * sx, gy + j * sy, 4, C.fg3); cyShape(g, gx + i * sx, gy + j * sy, 26 * z, t + i + j, C.p, z); }
    al(g, pop(tk, 5), () => { let x = R.x + 120; [['3 维：我们看到的空间', C.b], ['6 维：卷起来的', C.p], ['1 维：时间', C.gold]].forEach(([s, col]) => { x += chip(g, s, x, R.y + 760, col, 1, 26) + 30; }); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '为什么是 10 维', '负概率只有在 9 个空间方向上才恰好抵消（示意）');
    const x0 = R.x + 120, y0 = R.y + 520, bw = (R.w - 240) / 12;
    for (let d = 1; d <= 12; d++) { const v = d === 9 ? 0 : (d - 9) * 30, u = pop(tk, .3 + d * .25, .4), x = x0 + (d - 1) * bw;
      al(g, u, () => { if (v) rr(g, x + 10, v > 0 ? y0 - v : y0, bw - 20, Math.abs(v), 6, v < 0 ? 'rgba(255,107,107,.5)' : 'rgba(255,178,92,.5)'); else { glow(g, x + bw / 2, y0, 40, 'rgba(95,211,154,.7)'); check(g, x + bw / 2 - 15, y0 - 60, '', 1); } txt(g, String(d), x + bw / 2, y0 + 300, d === 9 ? C.ok : C.fg3, fnt(700, 24, 'mono'), 'center'); }); }
    line(g, [[x0, y0], [x0 + 12 * bw, y0]], C.fg3, 2); txt(g, '弦可振动的空间方向数', x0 + 6 * bw, y0 + 345, C.fg2, fnt(600, 22), 'center');
    txt(g, '“负概率”', x0, y0 - 260, C.bad, fnt(700, 24));
    return;
  }
  if (st.k === 2) {
    hdr(g, R, '卡拉比–丘空间', '六维卷缩空间的一类特殊形状（此为二维投影示意）');
    const cx = R.x + R.w / 2, cy = R.y + 470;
    cyShape(g, cx, cy, 300, t * .6, C.p, 1); cyShape(g, cx, cy, 220, -t * .5 + 2, C.b, .6);
    al(g, pop(tk, 3), () => { [[-180, -60], [120, 90], [40, -170]].forEach(([dx, dy], i) => { g.strokeStyle = C.gold; g.lineWidth = 3; g.beginPath(); g.arc(cx + dx, cy + dy, 34, 0, TAU); g.stroke(); txt(g, '洞', cx + dx, cy + dy, C.gold, fnt(700, 22), 'center'); }); });
    return;
  }
  hdr(g, R, '形状决定粒子性质', '某种洞的数目 ↔ 粒子的代数（三代）');
  const cx = R.x + R.w * .3, cy = R.y + 430;
  cyShape(g, cx, cy, 220, t * .6, C.p, 1);
  [[-110, -40], [80, 60], [20, -120]].forEach(([dx, dy], i) => { g.strokeStyle = C.gold; g.lineWidth = 3; g.beginPath(); g.arc(cx + dx, cy + dy, 28, 0, TAU); g.stroke(); arrow(g, cx + dx + 34, cy + dy, R.x + R.w * .58, R.y + 240 + i * 120, 'rgba(255,210,122,.5)', 2, 10, pop(tk, 1 + i * .6)); al(g, pop(tk, 1 + i * .6), () => txt(g, `第 ${'一二三'[i]} 代`, R.x + R.w * .6, R.y + 240 + i * 120, C.fg, fnt(800, 28))); });
  al(g, pop(tk, 6), () => { const bx = R.x + R.w * .56, by = R.y + 560; for (let i = 0; i < 40; i++) cyShape(g, bx + (i % 10) * 60, by + Math.floor(i / 10) * 50, 18, t + i, i === 17 ? C.gold : C.line2, 1); txt(g, '满足条件的形状成千上万：是哪一个？', bx, by + 210, C.fg2, fnt(700, 24)); });
};

// T 对偶
AN.tdual = (g, t, R, st) => {
  const tk = st.tk;
  if (st.k === 0) {
    hdr(g, R, '弦在圆圈维度上的两种运动', '沿圈运动（振动模式）　·　缠在圈上（缠绕模式）');
    const cx1 = R.x + R.w * .28, cx2 = R.x + R.w * .72, cy = R.y + 450, r = 180;
    [cx1, cx2].forEach(cx => { g.strokeStyle = C.line2; g.lineWidth = 30; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke(); });
    const a = tk * 1.2; loop(g, cx1 + r * Math.cos(a), cy + r * Math.sin(a), 22, 3, 5, t * 4, C.b, 3); txt(g, '沿圈运动：圈越小，能量越大', cx1, cy + r + 80, C.b, fnt(700, 24), 'center');
    al(g, pop(tk, 3), () => { g.save(); g.strokeStyle = C.gold; g.lineWidth = 4; g.shadowColor = C.gold; g.shadowBlur = 12; g.beginPath(); for (let i = 0; i <= 300; i++) { const u = i / 300 * TAU * 2, rr_ = r + 10 * Math.sin(u * 3.5 + t * 3) + (i / 300 - .5) * 16; const x = cx2 + rr_ * Math.cos(u), y = cy + rr_ * Math.sin(u); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.restore(); txt(g, '缠绕 2 圈：圈越大，能量越大', cx2, cy + r + 80, C.gold, fnt(700, 24), 'center'); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, 'T 对偶：半径 R 与 1/R 物理相同', '以弦的长度为单位（示意）');
    const x0 = R.x + 140, x1 = R.x + R.w * .6, y0 = R.y + 720, y1 = R.y + 180, lx = v => Math.log(v) / Math.log(10);
    const X = v => LERP(x0, x1, (lx(v) + 1.2) / 2.4), Y = e => LERP(y0, y1, e / 12);
    line(g, [[x0, y1], [x0, y0], [x1, y0]], C.fg3, 2); txt(g, '半径 R', x1, y0 + 36, C.fg2, fnt(600, 22), 'right'); txt(g, '能量', x0 - 16, y1, C.fg2, fnt(600, 22), 'right');
    [.1, 1, 10].forEach(v => txt(g, String(v), X(v), y0 + 30, C.fg3, fnt(600, 20, 'mono'), 'center'));
    const u = SS(tk / 3); const pm = [], pw = [];
    for (let i = 0; i <= 100 * u; i++) { const v = Math.pow(10, -1.2 + 2.4 * i / 100); pm.push([X(v), Y(Math.min(12, 1 / v))]); pw.push([X(v), Y(Math.min(12, v))]); }
    if (pm.length > 1) { line(g, pm, C.b, 4); line(g, pw, C.gold, 4); }
    txt(g, '振动能量 ∝ 1/R', X(.13), Y(10.5), C.b, fnt(700, 22)); txt(g, '缠绕能量 ∝ R', X(4), Y(10.5), C.gold, fnt(700, 22), 'right');
    al(g, pop(tk, 4), () => { line(g, [[X(1), y0], [X(1), y1]], C.ok, 2, [6, 6]); txt(g, '对称轴 R = 1', X(1), y1 - 20, C.ok, fnt(700, 22), 'center'); });
    const rx = R.x + R.w * .66, ry = R.y + 300;
    al(g, pop(tk, 5), () => { g.strokeStyle = C.p; g.lineWidth = 3; g.beginPath(); g.arc(rx + 60, ry + 80, 30, 0, TAU); g.stroke(); txt(g, 'R = 0.1', rx + 60, ry + 150, C.fg, fnt(700, 24, 'mono'), 'center'); txt(g, '＝', rx + 200, ry + 80, C.gold, fnt(800, 50), 'center'); g.beginPath(); g.arc(rx + 380, ry + 80, 120, 0, TAU); g.stroke(); txt(g, 'R = 10', rx + 380, ry + 240, C.fg, fnt(700, 24, 'mono'), 'center'); txt(g, '能谱完全一样', rx + 220, ry + 320, C.fg2, fnt(600, 24), 'center'); });
    return;
  }
  hdr(g, R, '存在最小的有意义尺寸', '缩小到弦的尺度以下，等于把它放大');
  const cx = R.x + R.w / 2, cy = R.y + 400, ph = (tk * .25) % 1, s = ph < .5 ? 1 - ph * 1.6 : .2 + (ph - .5) * 1.6;
  g.strokeStyle = C.p; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, 260 * Math.max(s, .2), 0, TAU); g.stroke();
  g.save(); g.setLineDash([6, 8]); g.strokeStyle = C.ok; g.beginPath(); g.arc(cx, cy, 52, 0, TAU); g.stroke(); g.restore();
  txt(g, '弦的尺度', cx, cy + 80, C.ok, fnt(600, 20), 'center');
  txt(g, ph < .5 ? '缩小……' : '再往下缩 = 等价于放大', cx, cy + 300, C.fg, fnt(700, 28), 'center');
  al(g, pop(tk, 4), () => txt(g, '→ 宇宙也许从未缩成无穷小的点', cx, cy + 350, C.gold, fnt(700, 26), 'center'));
};

AN.energy = (g, t, R, st) => {
  hdr(g, R, '能量差距：一千万亿倍', '对数刻度：每一格是 10 倍');
  const x0 = R.x + 80, x1 = R.x + R.w - 80, X = e => LERP(x0, x1, e / 20), y = R.y + 470;
  line(g, [[x0, y], [x1, y]], C.fg3, 3); for (let e = 0; e <= 20; e += 2) { line(g, [[X(e), y - 8], [X(e), y + 8]], C.fg3, 2); txt(g, `10^${e}`, X(e), y + 34, C.fg3, fnt(600, 18, 'mono'), 'center'); }
  txt(g, 'GeV（吉电子伏）', x1, y + 70, C.fg3, fnt(600, 18), 'right');
  const pts = [[0, '质子质量 ≈ 1', C.fg2], [2.1, '希格斯 ≈ 125', C.g], [4.13, 'LHC 对撞 ≈ 13,600', C.b], [19.1, '普朗克能量 ≈ 1.2×10¹⁹', C.p]];
  pts.forEach(([e, s, col], i) => { const u = pop(t, .5 + i * 1.2); al(g, u, () => { dot(g, X(e), y, 12, col); const up = i % 2 === 0; line(g, [[X(e), y], [X(e), up ? y - 90 : y + 110]], col, 2); txt(g, s, X(e), up ? y - 120 : y + 140, col, fnt(700, 26), i === 3 ? 'right' : 'center'); }); });
  al(g, pop(t, 6), () => { const a = X(4.13), b = X(19.1); rr(g, a, y - 260, b - a, 50, 12, 'rgba(199,155,255,.12)', C.p, 2); txt(g, '差约 15 个数量级', (a + b) / 2, y - 235, C.p, fnt(700, 24), 'center'); });
};

AN.signals = (g, t, R, st) => {
  hdr(g, R, st.k === 2 ? '这些信号后来怎样了？' : '书里设想的间接信号', st.k === 1 ? '1998 年：大额外维度设想 · 扭秤实验' : '');
  const it = ['对撞机里的超对称伙伴', '带分数电荷的奇怪粒子', '短距离上引力偏离平方反比', '早期宇宙留下的弦的痕迹'];
  if (st.k !== 1) {
    it.forEach((s, i) => { const u = st.k === 0 ? pop(st.tk, .4 + i * .9) : 1, y = R.y + 220 + i * 120; al(g, u, () => { rr(g, R.x + 60, y - 45, R.w * .62, 90, 14, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, s, R.x + 100, y, C.fg, fnt(700, 28)); txt(g, '？', R.x + 60 + R.w * .62 - 50, y, C.gold, fnt(800, 40), 'center'); }); });
    if (st.k === 0) al(g, pop(st.tk, 5), () => { const cx = R.x + R.w * .84, cy = R.y + 420; g.strokeStyle = C.b; g.lineWidth = 14; g.beginPath(); g.arc(cx, cy, 140, 0, TAU); g.stroke(); dot(g, cx + 140 * Math.cos(t * 2), cy + 140 * Math.sin(t * 2), 10, C.gold); txt(g, '大型强子对撞机', cx, cy + 200, C.b, fnt(700, 26), 'center'); txt(g, '（1999 年在建）', cx, cy + 240, C.fg3, fnt(600, 22), 'center'); });
    if (st.k === 2) al(g, pop(st.tk, .5), () => { rr(g, R.x + R.w * .7, R.y + 300, R.w * .28, 200, 18, 'rgba(255,210,122,.08)', C.gold, 2.5); txt(g, '答案见第三集', R.x + R.w * .84, R.y + 400, C.gold, fnt(800, 32), 'center'); });
    return;
  }
  const cx = R.x + R.w * .35, cy = R.y + 420, a = Math.sin(st.tk * 1.2) * .15;
  line(g, [[cx, R.y + 170], [cx, cy]], C.fg2, 2);
  g.save(); g.translate(cx, cy); g.rotate(a); line(g, [[-260, 0], [260, 0]], C.fg, 4); ball(g, -260, 0, 22, C.o); ball(g, 260, 0, 22, C.o); g.restore();
  ball(g, cx - 260 * Math.cos(a), cy + 90, 40, C.b); ball(g, cx + 260 * Math.cos(a), cy - 90, 40, C.b);
  txt(g, '扭秤：测量厘米到微米间的引力', cx, cy + 260, C.fg, fnt(700, 26), 'center');
  const bx = R.x + R.w * .66, by = R.y + 220;
  rr(g, bx, by, R.w * .32, 380, 18, 'rgba(14,20,36,.94)', C.gold, 2);
  ['1998：额外维度可能接近毫米', '→ 短距离上引力应变强', '实验追查到几十微米', '至今未见偏离'].forEach((s, i) => txt(g, s, bx + 30, by + 60 + i * 80, i === 3 ? C.gold : C.fg, fnt(700, 26)));
};

AN.recap2 = (g, t, R, st) => {
  hdr(g, R, st.k === 0 ? '第二集回顾' : '一个尴尬：五个版本', '');
  if (st.k === 0) { points(g, R.x + 80, R.y + 200, R.w - 160, ['粒子 = 弦的不同振动', '弦把相互作用抹开，避开无穷大', '需要超对称', '需要卷起来的 6 个额外维度，形状决定粒子性质', '存在最小的有意义尺寸（T 对偶）'], i => pop(t, .4 + i * 2), C.gold, 30, 100); return; }
  const n = ['I 型', 'IIA 型', 'IIB 型', '杂化 O', '杂化 E'], w = (R.w - 4 * 30) / 5;
  n.forEach((s, i) => { const x = R.x + i * (w + 30), y = R.y + 300; al(g, pop(st.tk, .3 + i * .4), () => { rr(g, x, y, w, 200, 18, 'rgba(14,20,36,.92)', [C.b, C.r, C.o, C.g, C.p][i], 2); txt(g, s, x + w / 2, y + 100, C.fg, fnt(800, 32), 'center'); }); });
  al(g, pop(st.tk, 3), () => txt(g, '终极理论为什么有五种？', R.x + R.w / 2, R.y + 640, C.gold, fnt(800, 36), 'center'));
};
