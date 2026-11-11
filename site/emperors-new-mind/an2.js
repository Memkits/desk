// 第二集动画：数学是发现还是发明（第 3–4 章）
// 曼德布罗集：渲染到离屏画布并缓存
const MCACHE = {};
function mandelImg(cxm, cym, span, W, H, it = 160) {
  const key = [cxm.toFixed(8), cym.toFixed(8), span.toExponential(4), W, H, it].join('|'); if (MCACHE[key]) return MCACHE[key];
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const c = cv.getContext('2d'), im = c.createImageData(W, H);
  for (let py = 0; py < H; py++) for (let px = 0; px < W; px++) {
    const x0 = cxm + (px / W - .5) * span, y0 = cym + (py / H - .5) * span * H / W; let x = 0, y = 0, i = 0;
    while (x * x + y * y < 16 && i < it) { const xt = x * x - y * y + x0; y = 2 * x * y + y0; x = xt; i++; }
    const o = (py * W + px) * 4;
    if (i === it) { im.data[o] = 6; im.data[o + 1] = 8; im.data[o + 2] = 16; }
    else { const sm = i + 1 - Math.log2(Math.log2(x * x + y * y) / 2), q = CL(Math.sqrt(sm / it) * 1.6), v = sm / 18;
      im.data[o] = 8 + q * (40 + 200 * (.5 + .5 * Math.sin(v + 4))); im.data[o + 1] = 10 + q * (50 + 170 * (.5 + .5 * Math.sin(v + 2.5))); im.data[o + 2] = 22 + q * (110 + 120 * (.5 + .5 * Math.sin(v + 1))); }
    im.data[o + 3] = 255;
  }
  c.putImageData(im, 0, 0); const ks = Object.keys(MCACHE); if (ks.length > 40) delete MCACHE[ks[0]]; MCACHE[key] = cv; return cv;
}

AN.open2 = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  const img = mandelImg(-.6, 0, 3.2, 480, 300, 80); g.save(); g.globalAlpha = .35; g.drawImage(img, 0, 60, 1920, 1200); g.restore();
  g.fillStyle = 'rgba(7,10,18,.55)'; g.fillRect(0, 0, 1920, 1080);
  if (st.k === 0) { al(g, pop(t, 5), () => { txt(g, '数学家理解真理的方式，', cx, R.y + 350, C.fg, fnt(800, 52, 'serif'), 'center'); txt(g, '能被算法取代吗？', cx, R.y + 450, C.gold, fnt(900, 64, 'serif'), 'center'); }); return; }
  [['第三章', '数学和实在', '曼德布罗集 · 数 · 柏拉图主义', C.b], ['第四章', '真理、证明和洞察', '形式系统 · 哥德尔 · 铺砖问题', C.p]].forEach(([a, b, c, col], i) => al(g, pop(st.tk, .3 + i * 1.2), () => { const x = cx - 620 + i * 660; rr(g, x, R.y + 250, 580, 300, 20, 'rgba(14,20,36,.94)', col, 3); txt(g, a, x + 290, R.y + 310, col, fnt(800, 30), 'center'); txt(g, b, x + 290, R.y + 400, C.fg, fnt(800, 46, 'serif'), 'center'); txt(g, c, x + 290, R.y + 480, C.fg2, fnt(600, 24), 'center'); }));
};

AN.mandel = (g, t, R, st) => {
  const W = 560, H = 420, ix = R.x + R.w - W * 1.4 - 40, iy = R.y + 200;
  if (st.k === 0) {
    hdr(g, R, '曼德布罗集', '一条规则：z → z² + c');
    al(g, pop(st.tk, .3), () => { eq(g, 'z  →  z² + c', R.x + 380, R.y + 320, C.gold, 72); txt(g, '从 z = 0 开始，反复计算', R.x + 380, R.y + 410, C.fg2, fnt(600, 28), 'center'); });
    // 两个例子
    const ex = (c, y, lab, col) => { let z = [0, 0]; const vals = []; for (let i = 0; i < 6; i++) { vals.push(Math.hypot(...z)); z = [z[0] * z[0] - z[1] * z[1] + c, 2 * z[0] * z[1]]; } txt(g, lab, R.x + 120, y, col, fnt(800, 28)); vals.forEach((v, i) => al(g, pop(st.tk, 3 + i * .5), () => txt(g, v > 1e4 ? '∞' : v.toFixed(v > 100 ? 0 : 2), R.x + 330 + i * 110, y, C.fg, fnt(700, 26, 'mono')))); };
    ex(-1, R.y + 540, 'c = −1', C.ok); ex(1, R.y + 620, 'c = 1', C.r);
    al(g, pop(st.tk, 7), () => { txt(g, '有界 → 黑', R.x + 1040, R.y + 540, C.ok, fnt(800, 28)); txt(g, '跑向无穷 → 上色', R.x + 1040, R.y + 620, C.r, fnt(800, 28)); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '把平面上每个点都试一遍', '');
    const img = mandelImg(-.6, 0, 3.2, 420, 315, 120), u = CL(st.tk / 6);
    g.save(); g.beginPath(); g.rect(ix, iy, W * 1.4 * u, H * 1.4); g.clip(); g.drawImage(img, ix, iy, W * 1.4, H * 1.4); g.restore();
    rr(g, ix, iy, W * 1.4, H * 1.4, 4, null, C.line2, 2); if (u < 1) line(g, [[ix + W * 1.4 * u, iy], [ix + W * 1.4 * u, iy + H * 1.4]], C.gold, 3);
    txt(g, '实轴', ix + W * 1.4 + 10, iy + H * .7, C.fg3, fnt(600, 20)); txt(g, '虚轴', ix + W * 1.4 * .59, iy - 18, C.fg3, fnt(600, 20), 'center');
    card(g, R.x + 40, R.y + 260, 420, 300, '规则', ['c 让 z 一直有界：黑色', 'c 让 z 趋向无穷：', '按逃逸快慢上色'], C.gold, pop(st.tk, .5));
    return;
  }
  hdr(g, R, '曼德布罗集是“可计算”的吗？', '');
  const img = mandelImg(-.6, 0, 3.2, 420, 315, 120); g.save(); g.globalAlpha = .7; g.drawImage(img, R.x + 760, R.y + 260, 520, 390); g.restore();
  al(g, pop(st.tk, .5), () => card(g, R.x + 40, R.y + 240, 680, 170, '彭罗斯的问题（1989）', ['能否用算法精确判定一个点属不属于它？'], C.gold, 1));
  al(g, pop(st.tk, 4), () => card(g, R.x + 40, R.y + 440, 680, 150, '实数计算模型（BSS）', ['已证明：不可判定（1990 年代）'], C.r, 1));
  al(g, pop(st.tk, 8), () => card(g, R.x + 40, R.y + 620, 680, 150, '通常的图灵意义', ['仍取决于一个未解的猜想'], C.p, 1));
};

AN.mandelzoom = (g, t, R, st) => {
  // 朝“海马谷”放大，12 帧/秒量化
  const tq = Math.floor(t * 12) / 12, z = Math.pow(1.35, Math.min(tq, 14)), span = 3 / z;
  const tx = -.743643887, ty = .131825904, cx0 = -.6, cy0 = 0, u = 1 - 1 / z;
  const img = mandelImg(LERP(cx0, tx, u), LERP(cy0, ty, u), span, 480, 270, Math.round(120 + 30 * Math.log2(z)));
  g.drawImage(img, 0, 0, 1920, 1080); g.fillStyle = 'rgba(7,10,18,.25)'; g.fillRect(0, 0, 1920, 1080);
  g.fillStyle = 'rgba(7,10,18,.65)'; g.fillRect(0, 980, 1920, 100);
  rr(g, R.x, R.y + 30, 520, 70, 14, 'rgba(7,10,18,.75)'); txt(g, `放大约 ${Math.round(z)} 倍（示意）`, R.x + 24, R.y + 65, C.fg, fnt(700, 28));
  if (st.k === 1) al(g, pop(st.tk, .5), () => { rr(g, 960 - 520, R.y + 620, 1040, 130, 20, 'rgba(7,10,18,.82)', C.gold, 2); txt(g, '“就像珠穆朗玛峰，它本来就在那里”', 960, R.y + 685, C.gold, fnt(800, 40, 'serif'), 'center'); });
};

AN.numline = (g, t, R, st) => {
  const x0 = R.x + 100, x1 = R.x + R.w - 100, y = R.y + 420, X = v => LERP(x0, x1, (v + 3) / 6);
  hdr(g, R, st.k === 0 ? '数的扩张' : '绝大多数实数不可计算', st.k === 0 ? '自然数 → 整数 → 分数 → 实数' : '算法只有可数个，实数却不可数');
  line(g, [[x0, y], [x1, y]], C.fg3, 3);
  const T = st.k === 0 ? st.tk : 99;
  for (let n = -3; n <= 3; n++) al(g, pop(T, n >= 0 ? .3 : 1.5), () => { line(g, [[X(n), y - 12], [X(n), y + 12]], C.fg, 3); txt(g, String(n), X(n), y + 40, n >= 0 ? C.b : C.p, fnt(800, 30, 'mono'), 'center'); });
  al(g, pop(T, 3), () => { for (let q = 1; q < 60; q++) { const v = -3 + 6 * HSH(q, 3); dot(g, X(v), y - 30, 3, C.ok); } txt(g, '分数：密密麻麻', X(-2.5), y - 70, C.ok, fnt(700, 24)); });
  al(g, pop(T, 6), () => { const v = Math.SQRT2; dot(g, X(v), y, 9, C.gold); txt(g, '√2 = 1.41421356…', X(v), y - 80, C.gold, fnt(800, 30, 'mono'), 'center'); txt(g, '不是任何分数', X(v), y + 90, C.fg2, fnt(600, 24), 'center'); });
  al(g, pop(T, 9), () => { g.save(); g.shadowColor = C.gold; g.shadowBlur = 12; line(g, [[x0, y], [x1, y]], 'rgba(255,210,122,.7)', 4); g.restore(); txt(g, '实数：填满整条直线（无限小数）', R.x + R.w / 2, y + 160, C.fg, fnt(700, 28), 'center'); });
  if (st.k === 1) {
    al(g, pop(st.tk, .3), () => { const pts = [Math.PI - 3, Math.E - 3, Math.SQRT2, -1.732, .5]; pts.forEach((v, i) => { dot(g, X(v), y, 8, C.ok); txt(g, ['π−3', 'e−3', '√2', '−√3', '½'][i], X(v), y - 40, C.ok, fnt(700, 22), 'center'); }); txt(g, '可计算的数：有算法逐位写出（可数个）', x0, R.y + 640, C.ok, fnt(700, 28)); });
    al(g, pop(st.tk, 4), () => { for (let i = 0; i < 400; i++) dot(g, X(-3 + 6 * HSH(i, 11)), y + 20 + HSH(i, 12) * 50, 1.6, 'rgba(255,107,107,.7)'); txt(g, '其余几乎所有实数：没有任何算法能写出', x0, R.y + 700, C.bad, fnt(700, 28)); });
  }
};

AN.complex = (g, t, R, st) => {
  const ox = R.x + 500, oy = R.y + 470, s = 110;
  hdr(g, R, '复数：平面上的点', 'i² = −1　　乘以 i = 逆时针转 90°');
  line(g, [[ox - 3.2 * s, oy], [ox + 3.2 * s, oy]], C.fg3, 2); line(g, [[ox, oy + 3 * s], [ox, oy - 3 * s]], C.fg3, 2);
  txt(g, '实部', ox + 3.2 * s + 10, oy, C.fg3, fnt(600, 22)); txt(g, '虚部 i', ox + 10, oy - 3 * s - 10, C.fg3, fnt(600, 22));
  const z = [2, 1], ang = Math.atan2(z[1], z[0]), r = Math.hypot(...z);
  const tt = Math.max(0, (t - 2.5) / 2.2), k = Math.min(4, Math.floor(tt)), f = k < 4 ? SS(CL((tt - k) / .5)) : 0, a = ang + (k + f) * Math.PI / 2;
  for (let j = 0; j <= Math.min(k, 3); j++) { const aj = ang + j * Math.PI / 2; dot(g, ox + Math.cos(aj) * r * s, oy - Math.sin(aj) * r * s, 6, 'rgba(255,210,122,.4)'); }
  arrow(g, ox, oy, ox + Math.cos(a) * r * s, oy - Math.sin(a) * r * s, C.gold, 4, 16); dot(g, ox + Math.cos(a) * r * s, oy - Math.sin(a) * r * s, 9, C.gold);
  txt(g, '2 + i', ox + 2 * s + 16, oy - s - 20, C.gold, fnt(800, 28));
  al(g, pop(t, 2), () => { const x = R.x + 1000; ['× i → −1 + 2i', '× i → −2 − i', '× i → 1 − 2i', '× i → 2 + i'].forEach((q, i) => al(g, pop(t, 2.5 + i * 2.2), () => txt(g, q, x, R.y + 260 + i * 70, C.fg, fnt(700, 32, 'mono')))); });
  al(g, pop(t, 11), () => { rr(g, R.x + 960, R.y + 580, 680, 140, 18, 'rgba(92,180,255,.08)', C.b, 2); txt(g, '曾被当作“虚构的数”', R.x + 1000, R.y + 625, C.fg2, fnt(600, 26)); txt(g, '→ 量子力学的基本语言', R.x + 1000, R.y + 680, C.b, fnt(800, 32)); });
};

AN.plato = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  hdr(g, R, '数学柏拉图主义', '数学真理独立于人而存在');
  al(g, pop(t, .3), () => { g.save(); g.shadowColor = C.gold; g.shadowBlur = 30; rr(g, cx - 260, R.y + 210, 520, 220, 110, 'rgba(255,210,122,.08)', C.gold, 3); g.restore(); txt(g, '柏拉图世界', cx, R.y + 290, C.gold, fnt(900, 44, 'serif'), 'center'); txt(g, '√2 · π · 曼德布罗集 · 定理…', cx, R.y + 360, C.fg2, fnt(600, 24), 'center'); });
  al(g, pop(t, 2.5), () => { person(g, cx - 380, R.y + 650, C.b, 2); txt(g, '发现', cx - 240, R.y + 560, C.ok, fnt(800, 36)); arrow(g, cx - 320, R.y + 580, cx - 160, R.y + 440, C.ok, 4); });
  al(g, pop(t, 5), () => { person(g, cx + 380, R.y + 650, C.fg3, 2); txt(g, '发明？', cx + 200, R.y + 560, C.fg3, fnt(800, 36)); cross(g, cx + 300, R.y + 470, 1, C.bad, 20); });
  al(g, pop(t, 8), () => txt(g, '彭罗斯：数学家是去“发现”', cx, R.y + 780, C.fg, fnt(800, 34), 'center'));
};

AN.formal = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k <= 1) {
    hdr(g, R, '形式系统', '公理 + 机械的推理规则 → 定理');
    const T = st.k === 0 ? st.tk : 99;
    al(g, pop(T, .3), () => { ['A1', 'A2', 'A3'].forEach((s, i) => { rr(g, R.x + 100, R.y + 230 + i * 110, 200, 80, 14, 'rgba(92,180,255,.1)', C.b, 2); txt(g, '公理 ' + s, R.x + 200, R.y + 270 + i * 110, C.b, fnt(800, 28), 'center'); }); });
    al(g, pop(T, 2), () => { rr(g, R.x + 400, R.y + 300, 300, 160, 18, 'rgba(14,20,36,.96)', C.gold, 2); txt(g, '推理规则', R.x + 550, R.y + 350, C.gold, fnt(800, 30), 'center'); txt(g, 'A, A→B ⊢ B', R.x + 550, R.y + 410, C.fg, fnt(700, 28, 'serif'), 'center'); [0, 1, 2].forEach(i => arrow(g, R.x + 305, R.y + 270 + i * 110, R.x + 395, R.y + 380, C.fg3, 2)); });
    const chain = ['∀x (x+0 = x)', '0+0 = 0', '…', '定理 T'];
    chain.forEach((s, i) => al(g, pop(T, 4 + i * 1), () => { const x = R.x + 800 + i * 230; chip(g, s, x, R.y + 380, i === 3 ? C.gold : C.fg2, 1, 24); if (i) arrow(g, x - 30, R.y + 380, x - 6, R.y + 380, C.fg3, 2, 8); }));
    if (st.k === 1) {
      al(g, pop(st.tk, .5), () => { bot(g, R.x + 300, R.y + 640, C.p, 2.2); txt(g, '检查证明：机械地逐步核对 ✓', R.x + 380, R.y + 640, C.fg, fnt(700, 30)); });
      al(g, pop(st.tk, 4), () => { rr(g, R.x + 960, R.y + 560, 700, 170, 18, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '不矛盾 + 完备', R.x + 1310, R.y + 615, C.gold, fnt(800, 32), 'center'); txt(g, '⇒ 数学真理 = 机械推导？', R.x + 1310, R.y + 680, C.fg, fnt(800, 32), 'center'); });
    }
    return;
  }
  hdr(g, R, '另一种声音：直觉主义', '布劳威尔（1881–1966）');
  medal(g, R.x + 240, R.y + 380, 100, '布', '布劳威尔', '荷兰', C.p, pop(st.tk, .3));
  al(g, pop(st.tk, 2), () => card(g, R.x + 500, R.y + 240, 560, 260, '直觉主义', ['数学对象由人心一步步构造', '对无穷集合，不能随便用', '“要么真、要么假”（排中律）'], C.p, 1));
  al(g, pop(st.tk, 7), () => card(g, R.x + 1100, R.y + 240, 560, 260, '彭罗斯', ['不接受这种限制', '也不认为数学只是符号游戏', '→ 柏拉图主义'], C.gold, 1));
};

AN.godel = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '哥德尔不完备定理（1931）', '');
    medal(g, R.x + 240, R.y + 380, 110, '哥', '库尔特·哥德尔', '1906 – 1978', C.p, pop(st.tk, .3));
    al(g, pop(st.tk, 2.5), () => { const x = R.x + 520; [['足够强（能表达算术）', C.b], ['不矛盾', C.ok], ['⇒ 存在句子 G：', C.fg], ['　既证不出 G，也证不出“非 G”', C.gold]].forEach(([s, col], i) => al(g, pop(st.tk, 2.5 + i * 1.6), () => txt(g, s, x, R.y + 290 + i * 90, col, fnt(800, 38)))); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '给公式编号：关于证明的话 → 关于数的话', '编码方式示意');
    const f = ['0', '=', '0'], codes = [1, 5, 1];
    f.forEach((s, i) => al(g, pop(st.tk, .3 + i * .4), () => { const x = R.x + 120 + i * 140; rr(g, x, R.y + 240, 110, 140, 12, 'rgba(14,20,36,.95)', C.b, 2); txt(g, s, x + 55, R.y + 290, C.fg, fnt(800, 44, 'serif'), 'center'); txt(g, String(codes[i]), x + 55, R.y + 350, C.gold, fnt(800, 30, 'mono'), 'center'); }));
    al(g, pop(st.tk, 2.5), () => eq(g, '→ 2¹ × 3⁵ × 5¹ = 2430', R.x + 560, R.y + 310, C.gold, 46, 'left'));
    al(g, pop(st.tk, 5), () => { rr(g, R.x + 120, R.y + 460, 1500, 260, 20, 'rgba(255,210,122,.07)', C.gold, 3); txt(g, 'G：“本句子在这个系统里不可证”', cx, R.y + 560, C.fg, fnt(800, 52, 'serif'), 'center'); txt(g, '（说谎者悖论的“假”换成了“不可证”）', cx, R.y + 650, C.fg3, fnt(600, 26), 'center'); });
    return;
  }
  if (st.k === 2) {
    hdr(g, R, 'G 能被证明吗？', '');
    const y = R.y + 250;
    rr(g, cx - 300, y - 50, 600, 100, 18, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, 'G：“我不可证”', cx, y, C.gold, fnt(800, 36), 'center');
    al(g, pop(st.tk, .5), () => { line(g, [[cx - 100, y + 50], [cx - 320, y + 150]], C.fg3, 3); rr(g, cx - 600, y + 150, 560, 200, 16, 'rgba(255,107,107,.06)', C.bad, 2); txt(g, '若能证明', cx - 320, y + 200, C.bad, fnt(800, 32), 'center'); wrapTxt(g, '证明了一句假话 → 系统矛盾', cx - 570, y + 270, 500, 38, C.fg, fnt(600, 30)); });
    al(g, pop(st.tk, 4), () => { line(g, [[cx + 100, y + 50], [cx + 320, y + 150]], C.fg3, 3); rr(g, cx + 40, y + 150, 560, 200, 16, 'rgba(95,211,154,.06)', C.ok, 2); txt(g, '所以证不出来', cx + 320, y + 200, C.ok, fnt(800, 32), 'center'); wrapTxt(g, '而这正是 G 所说的 → G 是真的', cx + 70, y + 270, 500, 38, C.fg, fnt(600, 30)); });
    al(g, pop(st.tk, 8), () => { rr(g, R.x + 60, R.y + 650, R.w - 120, 90, 16, 'rgba(255,210,122,.1)', C.gold, 2); txt(g, '真，但在系统内不可证', cx, R.y + 695, C.fg, fnt(800, 34), 'center'); });
    return;
  }
  if (st.k === 3) {
    hdr(g, R, '第二不完备定理', '系统不能在自身内部证明自己不矛盾');
    al(g, pop(st.tk, .3), () => { rr(g, cx - 260, R.y + 250, 520, 300, 30, 'rgba(14,20,36,.95)', C.b, 3); txt(g, '系统 F', cx, R.y + 320, C.b, fnt(800, 36), 'center'); txt(g, '⊬ “F 不矛盾”', cx, R.y + 430, C.fg, fnt(800, 44, 'serif'), 'center'); });
    al(g, pop(st.tk, 4), () => { medal(g, cx + 600, R.y + 380, 90, '希', '希尔伯特计划', '有限方法保证可靠', C.fg3, 1); cross(g, cx + 600, R.y + 380, 1, C.bad, 50); });
    return;
  }
  hdr(g, R, '彭罗斯抓住的一步', '');
  al(g, pop(st.tk, .3), () => { rr(g, cx - 560, R.y + 260, 560, 360, 30, 'rgba(14,20,36,.95)', C.b, 3); txt(g, '系统内部', cx - 280, R.y + 310, C.b, fnt(800, 30), 'center'); txt(g, 'G ?', cx - 280, R.y + 450, C.fg3, fnt(900, 80, 'serif'), 'center'); txt(g, '证不出', cx - 280, R.y + 560, C.bad, fnt(700, 28), 'center'); });
  al(g, pop(st.tk, 2.5), () => { person(g, cx + 300, R.y + 470, C.gold, 2.6); g.save(); g.setLineDash([10, 8]); line(g, [[cx + 250, R.y + 420], [cx - 200, R.y + 450]], C.gold, 3); g.restore(); txt(g, '“G 是真的”', cx + 300, R.y + 320, C.gold, fnt(900, 44, 'serif'), 'center'); txt(g, '站在系统外面的我们', cx + 300, R.y + 600, C.fg2, fnt(600, 26), 'center'); });
};

AN.insight = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k <= 1) {
    hdr(g, R, '彭罗斯的论证（大意）', '');
    const S = [['假设：数学家的判断 = 某个算法（形式系统 F）', C.b], ['我们相信 F 可靠 → 看出 F 的哥德尔句 G(F) 为真', C.gold], ['但 F 证不出 G(F)：我们的理解超出了 F', C.p], ['矛盾 → 数学理解不是算法', C.r]];
    S.forEach(([s, col], i) => al(g, pop(st.k === 0 ? st.tk : (i < 2 ? 99 : st.tk), st.k === 0 ? .5 + i * 3 : (i - 2) * 3 + .5), () => { if (st.k === 0 && i > 1) return; const y = R.y + 250 + i * 130; rr(g, R.x + 100, y - 45, 1100, 90, 16, 'rgba(14,20,36,.95)', col, 2); txt(g, `${i + 1}. ${s}`, R.x + 130, y, C.fg, fnt(700, 30)); if (i < 3) arrow(g, R.x + 650, y + 48, R.x + 650, y + 82, C.fg3, 3, 8); }));
    if (st.k === 1) al(g, pop(st.tk, 7), () => { g.save(); g.shadowColor = C.gold; g.shadowBlur = 30; rr(g, R.x + 1280, R.y + 260, 380, 300, 150, 'rgba(255,210,122,.08)', C.gold, 3); g.restore(); txt(g, '柏拉图世界', R.x + 1470, R.y + 380, C.gold, fnt(800, 34, 'serif'), 'center'); txt(g, '直接接触？', R.x + 1470, R.y + 440, C.fg2, fnt(600, 26), 'center'); });
    return;
  }
  if (st.k === 2) {
    hdr(g, R, '争议', '');
    al(g, pop(st.tk, .3), () => card(g, R.x + 100, R.y + 240, 520, 220, '卢卡斯（1961）', ['《心灵、机器与哥德尔》', '更早提出类似论证'], C.fg2, 1));
    al(g, pop(st.tk, 3), () => card(g, R.x + 680, R.y + 240, 940, 220, '批评者', ['我们怎么知道自己的“系统”不矛盾？', '人会犯错，也会自相矛盾'], C.r, 1));
    al(g, pop(st.tk, 7), () => txt(g, '→ 第四集：书出版后的争论', R.x + 100, R.y + 580, C.gold, fnt(800, 32)));
    return;
  }
  hdr(g, R, '彭罗斯的回应', '');
  al(g, pop(st.tk, .3), () => { rr(g, cx - 640, R.y + 230, 1280, 140, 18, 'rgba(14,20,36,.95)', C.fg2, 2); txt(g, '不是说数学家从不犯错', cx, R.y + 300, C.fg2, fnt(700, 34), 'center'); });
  al(g, pop(st.tk, 3), () => { rr(g, cx - 640, R.y + 410, 1280, 140, 18, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '真正理解时，根据不在于遵守某套规则', cx, R.y + 480, C.gold, fnt(800, 34), 'center'); });
  al(g, pop(st.tk, 7), () => { for (let i = 0; i < 4; i++) { const r = 40 + i * 35; g.save(); g.strokeStyle = `rgba(92,180,255,${.7 - i * .15})`; g.lineWidth = 3; g.beginPath(); g.arc(cx - 300, R.y + 790, r, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); g.restore(); } txt(g, 'F → F′ → F″ → …　总能再跳出去一层', cx - 120, R.y + 720, C.fg, fnt(700, 28)); });
};

// 铺砖
function sqTile(g, x, y, s, cols) { // 王浩砖：四边颜色
  const P = [[x, y], [x + s, y], [x + s, y + s], [x, y + s]], c = [x + s / 2, y + s / 2];
  for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(...c); g.lineTo(...P[i]); g.lineTo(...P[(i + 1) % 4]); g.closePath(); g.fillStyle = cols[i]; g.fill(); }
  g.strokeStyle = 'rgba(7,10,18,.8)'; g.lineWidth = 2; g.strokeRect(x, y, s, s);
}
AN.tiles = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '铺砖问题', '有限几种瓷砖，能否铺满无限平面（不留空隙、不重叠）？');
    const s = 70; const shapes = [[0, 0], [1, 0], [0, 1], [1, 1]];
    for (let i = 0; i < 10; i++) for (let j = 0; j < 6; j++) { const u = pop(st.tk, 1 + (i + j) * .25); if (u <= 0) continue; al(g, u, () => { const x = R.x + 120 + i * s * 1.05, y = R.y + 240 + j * s * 1.05; const k = (i + 2 * j) % 3; rr(g, x, y, s, s, 6, ['rgba(92,180,255,.3)', 'rgba(199,155,255,.3)', 'rgba(255,210,122,.3)'][k], C.fg2, 1.5); }); }
    al(g, pop(st.tk, 6), () => card(g, R.x + 1000, R.y + 260, 620, 220, '难点', ['平面是无限的', '“试下去”永远试不完'], C.gold, 1));
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '王浩砖（1961）', '相邻边颜色必须相同；不许旋转');
    const PAL = [C.b, C.r, C.gold, C.ok], s = 90;
    const T = [[0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2]];
    T.forEach((c, i) => al(g, pop(st.tk, .5 + i * .6), () => sqTile(g, R.x + 140 + i * 130, R.y + 260, s, c.map(k => PAL[k] + 'cc'))));
    medal(g, R.x + 300, R.y + 560, 80, '王', '王浩', '1921 – 1995', C.gold, pop(st.tk, 2));
    al(g, pop(st.tk, 4), () => { card(g, R.x + 620, R.y + 240, 1000, 300, '王浩的猜想', ['凡能铺满平面的砖组，都能铺成周期重复的图案', '若成立：一边找“周期”，一边找“铺不下去”，', '必有一个会结束 → 有判定算法'], C.gold, 1); });
    return;
  }
  hdr(g, R, '伯格（1966）：猜想不成立', '存在只能非周期铺满的砖组 → 铺砖问题没有算法');
  al(g, pop(st.tk, .3), () => card(g, R.x + 100, R.y + 240, 700, 260, '伯格的证明', ['用砖组模拟图灵机的运行', '“能铺满” ⇔ “机器永不停”', '停机问题不可判定 ⇒ 铺砖也不可判定'], C.r, 1));
  al(g, pop(st.tk, 4), () => { card(g, R.x + 860, R.y + 240, 760, 260, '只能非周期地铺', ['图案永不重复', '找不到可以确认的“重复单元”'], C.p, 1); });
  al(g, pop(st.tk, 6), () => { g.save(); g.globalAlpha *= .9; rhombPatch(g, R.x + 1240, R.y + 680, 34, 3); g.restore(); });
};

// 彭罗斯菱形镶嵌：用 de Bruijn 五重网格法
const PTILES = (() => {
  const out = [], N = 5, K = 7, gam = [.2, .21, .17, .23, .19];
  const e = Array.from({ length: N }, (_, i) => [Math.cos(TAU * i / N), Math.sin(TAU * i / N)]);
  for (let r = 0; r < N; r++) for (let s = r + 1; s < N; s++) for (let a = -K; a <= K; a++) for (let b = -K; b <= K; b++) {
    const det = e[r][0] * e[s][1] - e[r][1] * e[s][0]; const ar = a - gam[r], bs = b - gam[s];
    const p = [(ar * e[s][1] - bs * e[r][1]) / det, (bs * e[r][0] - ar * e[s][0]) / det];
    const k = e.map((ej, j) => j === r ? a : j === s ? b : Math.ceil(p[0] * ej[0] + p[1] * ej[1] + gam[j]));
    const v = kk => [kk.reduce((A, x, j) => A + x * e[j][0], 0), kk.reduce((A, x, j) => A + x * e[j][1], 0)];
    const k1 = k.slice(), k2 = k.slice(), k3 = k.slice(); k1[r]--; k3[s]--; k2[r]--; k2[s]--;
    const P = [v(k2), v(k1), v(k), v(k3)]; const c = P.reduce((A, q) => [A[0] + q[0] / 4, A[1] + q[1] / 4], [0, 0]);
    if (Math.hypot(...c) < 9) out.push({ P, thin: (s - r) % 5 === 2 || (s - r) % 5 === 3, d: Math.hypot(...c) });
  }
  return out.sort((A, B) => A.d - B.d);
})();
function penroseDraw(g, cx, cy, sc, u, a = 1) {
  const n = Math.floor(PTILES.length * u);
  for (let i = 0; i < n; i++) { const { P, thin } = PTILES[i]; g.beginPath(); P.forEach((q, j) => j ? g.lineTo(cx + q[0] * sc, cy + q[1] * sc) : g.moveTo(cx + q[0] * sc, cy + q[1] * sc)); g.closePath(); g.fillStyle = thin ? `rgba(199,155,255,${.55 * a})` : `rgba(255,210,122,${.45 * a})`; g.fill(); g.strokeStyle = `rgba(233,238,247,${.7 * a})`; g.lineWidth = 1.4; g.stroke(); }
}
AN.penrose = (g, t, R, st) => {
  hdr(g, R, '彭罗斯镶嵌（1974 年前后）', '两种菱形 · 铺满平面 · 永不重复 · 五重对称');
  g.save(); g.beginPath(); g.rect(R.x + 560, R.y + 90, R.w - 560, R.h - 140); g.clip(); penroseDraw(g, R.x + 560 + (R.w - 560) / 2, R.y + 440, 44, CL(t / 9)); g.restore();
  const rh = (x, y, ang, col, lab) => { const s = 90, a = ang * Math.PI / 180; const P = [[0, 0], [s, 0], [s + s * Math.cos(a), -s * Math.sin(a)], [s * Math.cos(a), -s * Math.sin(a)]]; g.beginPath(); P.forEach((q, j) => j ? g.lineTo(x + q[0], y + q[1]) : g.moveTo(x + q[0], y + q[1])); g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = C.fg; g.lineWidth = 2; g.stroke(); txt(g, lab, x + 90, y + 40, C.fg2, fnt(700, 24), 'center'); };
  al(g, pop(t, .5), () => { rh(R.x + 80, R.y + 360, 72, 'rgba(255,210,122,.55)', '胖菱形 72°'); rh(R.x + 80, R.y + 560, 36, 'rgba(199,155,255,.65)', '瘦菱形 36°'); });
  al(g, pop(t, 10), () => txt(g, '中心附近的五重对称', R.x + 200, R.y + 720, C.gold, fnt(700, 26), 'center'));
};

// “帽子”：13 边形（坐标取自 Smith 等 2023 的 hat 多边形，以 kite 网格为单位）
const HAT = (() => { const s3 = Math.sqrt(3); const P = [[0, 0], [-1, -s3], [1, -s3], [2, 0], [4, 0], [5, s3], [4, 2 * s3], [2, 2 * s3], [1, 3 * s3], [-1, 3 * s3], [-2, 2 * s3], [-4, 2 * s3], [-5, s3]]; return P.map(([x, y]) => [x / 2, y / 2]); })();
function hatDraw(g, x, y, sc, rot, flip, fill, stroke = C.fg) { g.save(); g.translate(x, y); g.rotate(rot); if (flip) g.scale(-1, 1); g.beginPath(); HAT.forEach((q, j) => j ? g.lineTo(q[0] * sc, q[1] * sc) : g.moveTo(q[0] * sc, q[1] * sc)); g.closePath(); g.fillStyle = fill; g.fill(); g.strokeStyle = stroke; g.lineWidth = 2; g.stroke(); g.restore(); }
AN.hat = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '“帽子”：一种形状就够了（2023）', '史密斯、迈尔斯、卡普兰、古德曼-施特劳斯');
    al(g, pop(st.tk, .5), () => { hatDraw(g, R.x + 330, R.y + 430, 70, 0, false, 'rgba(95,224,160,.35)', C.g); txt(g, '13 条边', R.x + 330, R.y + 640, C.g, fnt(800, 30), 'center'); });
    [[0, 0], [1.1, .5], [2.2, 1.6], [3.3, 2.6], [4.4, 3.4]].forEach(([r, f], i) => al(g, pop(st.tk, 2 + i * .7), () => hatDraw(g, R.x + 700 + i * 130, R.y + 300 + (i % 2) * 220, 34, r, i === 3, i === 3 ? 'rgba(92,180,255,.45)' : 'rgba(95,224,160,.3)', C.fg2)));
    al(g, pop(st.tk, 6), () => { txt(g, '同一种形状，不同朝向（蓝色为镜像）', R.x + 960, R.y + 700, C.fg2, fnt(700, 26), 'center'); txt(g, '能非周期地铺满整个平面', R.x + 960, R.y + 750, C.gold, fnt(800, 30), 'center'); });
    return;
  }
  hdr(g, R, '“幽灵”：连镜像都不需要', '同一团队，2023 年 5 月');
  al(g, pop(st.tk, .3), () => { hatDraw(g, cx - 560, R.y + 420, 60, 0, false, 'rgba(95,224,160,.35)', C.g); hatDraw(g, cx - 200, R.y + 420, 60, 0, true, 'rgba(92,180,255,.45)', C.b); txt(g, '帽子：需要正反两面', cx - 390, R.y + 620, C.fg2, fnt(700, 28), 'center'); });
  al(g, pop(st.tk, 3), () => { // 幽灵：用曲边近似
    g.save(); g.translate(cx + 380, R.y + 420); g.beginPath(); HAT.forEach((q, j) => { const x = q[0] * 60, y = q[1] * 60; j ? g.quadraticCurveTo(x + 8, y - 8, x, y) : g.moveTo(x, y); }); g.closePath(); g.fillStyle = 'rgba(255,210,122,.35)'; g.fill(); g.strokeStyle = C.gold; g.lineWidth = 3; g.stroke(); g.restore(); txt(g, '幽灵（形状示意）', cx + 380, R.y + 620, C.gold, fnt(700, 28), 'center'); });
  al(g, pop(st.tk, 7), () => txt(g, '1970 年代彭罗斯留下的问题，有了圆满答案', cx, R.y + 740, C.fg, fnt(800, 32), 'center'));
};

AN.h10 = (g, t, R, st) => {
  hdr(g, R, '希尔伯特第十问题', '整系数多项式方程有没有整数解？');
  const X = f => R.x + R.w * f;
  al(g, pop(t, .3), () => { eq(g, 'x² + y² = z²', X(.17), R.y + 300, C.ok, 40); txt(g, '有：3, 4, 5', X(.17), R.y + 360, C.ok, fnt(700, 24), 'center'); eq(g, 'x² − 2y² = 0', X(.5), R.y + 300, C.r, 40); txt(g, '除 0 外没有', X(.5), R.y + 360, C.r, fnt(700, 24), 'center'); eq(g, 'x³+y³+z³ = 42', X(.83), R.y + 300, C.gold, 38); txt(g, '2019 年才找到', X(.83), R.y + 360, C.gold, fnt(700, 24), 'center'); });
  [['1900', '希尔伯特在巴黎提出', C.b], ['1961', '戴维斯、普特南、罗宾逊：关键一步', C.g], ['1970', '马季亚谢维奇：最后一步', C.gold]].forEach(([y, s, col], i) => al(g, pop(t, 3 + i * 1.6), () => { const yy = R.y + 460 + i * 60; dot(g, R.x + 120, yy, 10, col); txt(g, y, R.x + 150, yy, col, fnt(800, 28, 'mono')); txt(g, s, R.x + 260, yy, C.fg, fnt(700, 28)); }));
  al(g, pop(t, 8), () => { rr(g, R.x + 100, R.y + 680, R.w - 200, 100, 18, 'rgba(255,107,107,.06)', C.bad, 2); txt(g, '结论：不存在通用的判定算法', R.x + R.w / 2, R.y + 730, C.bad, fnt(800, 34), 'center'); });
};

AN.tsp = (g, t, R, st) => {
  const N = 9, pts = Array.from({ length: N }, (_, i) => [R.x + 120 + HSH(i, 21) * 620, R.y + 230 + HSH(i, 22) * 480]);
  pts.forEach(p => dot(g, p[0], p[1], 10, C.b));
  if (st.k === 0) {
    hdr(g, R, '旅行商问题', '走遍所有城市，找最短路线');
    const k = Math.floor(st.tk * 3); const perm = Array.from({ length: N }, (_, i) => i).sort((a, b) => HSH(a, k) - HSH(b, k));
    line(g, [...perm.map(i => pts[i]), pts[perm[0]]], 'rgba(255,210,122,.6)', 2.5);
    const rows = [[5, '12'], [10, '181,440'], [15, '4.4 × 10¹⁰'], [20, '6.1 × 10¹⁶'], [30, '4.4 × 10³⁰']];
    rr(g, R.x + 900, R.y + 230, 700, 460, 18, 'rgba(14,20,36,.95)', C.line2, 2); txt(g, '城市数', R.x + 940, R.y + 280, C.fg3, fnt(700, 26)); txt(g, '不同的环路数', R.x + 1200, R.y + 280, C.fg3, fnt(700, 26));
    rows.forEach(([n, v], i) => al(g, pop(st.tk, 2 + i * 1.2), () => { txt(g, String(n), R.x + 960, R.y + 350 + i * 70, C.fg, fnt(800, 32, 'mono')); txt(g, v, R.x + 1200, R.y + 350 + i * 70, i > 2 ? C.r : C.gold, fnt(800, 32, 'mono')); }));
    return;
  }
  // 一条较好的路线（按角度排序）
  const c0 = pts.reduce((A, p) => [A[0] + p[0] / N, A[1] + p[1] / N], [0, 0]); const ord = pts.map((p, i) => i).sort((a, b) => Math.atan2(pts[a][1] - c0[1], pts[a][0] - c0[0]) - Math.atan2(pts[b][1] - c0[1], pts[b][0] - c0[0]));
  line(g, [...ord.map(i => pts[i]), pts[ord[0]]], C.gold, 3);
  if (st.k === 1) {
    hdr(g, R, 'P 与 NP', '至今未解的大问题');
    al(g, pop(st.tk, .5), () => { const x = R.x + 1000, y = R.y + 470; g.save(); g.strokeStyle = C.p; g.lineWidth = 3; g.beginPath(); g.ellipse(x + 200, y, 360, 250, 0, 0, TAU); g.stroke(); g.strokeStyle = C.ok; g.beginPath(); g.ellipse(x + 80, y + 40, 180, 140, 0, 0, TAU); g.stroke(); g.restore(); txt(g, 'NP：答案容易验证', x + 330, y - 180, C.p, fnt(800, 28), 'center'); txt(g, 'P：容易求解', x + 80, y + 40, C.ok, fnt(800, 28), 'center'); txt(g, 'P = NP ?', x + 420, y + 120, C.gold, fnt(900, 40), 'center'); });
    al(g, pop(st.tk, 6), () => txt(g, '彭罗斯：可计算 ≠ 容易计算；他只关心前者', R.x + 100, R.y + 790, C.fg, fnt(700, 28)));
    return;
  }
  hdr(g, R, '问题不在于“不够快”', '');
  al(g, pop(st.tk, .5), () => card(g, R.x + 900, R.y + 240, 720, 200, '给电脑无限的时间和内存', ['有些事情它仍然做不到'], C.r, 1));
  al(g, pop(st.tk, 4), () => card(g, R.x + 900, R.y + 480, 720, 200, '彭罗斯认为', ['人对数学真理的理解，恰恰属于这一类'], C.gold, 1));
};

AN.recap2 = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  hdr(g, R, '第二集小结', '');
  const items = [['曼德布罗集', '数学被“发现”', C.b], ['柏拉图主义', '数学真理独立存在', C.gold], ['哥德尔定理', '真 ≠ 可证', C.p], ['非算法问题', '铺砖 · 第十问题', C.r]];
  items.forEach(([a, b, col], i) => al(g, pop(st.k === 0 ? t : 99, .3 + i * 1.2), () => { const x = R.x + 40 + i * 425; rr(g, x, R.y + 230, 390, 260, 20, 'rgba(14,20,36,.95)', col, 2.5); txt(g, a, x + 195, R.y + 320, col, fnt(800, 38, 'serif'), 'center'); txt(g, b, x + 195, R.y + 400, C.fg2, fnt(600, 26), 'center'); }));
  if (st.k === 1) al(g, pop(st.tk, .5), () => { rr(g, cx - 520, R.y + 580, 1040, 150, 20, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '下一集：经典世界是可计算的吗？', cx, R.y + 640, C.fg, fnt(800, 34), 'center'); txt(g, '从牛顿到量子力学', cx, R.y + 695, C.gold, fnt(700, 28), 'center'); });
};
