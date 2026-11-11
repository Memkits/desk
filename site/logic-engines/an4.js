// 第四集动画：梦想之后（原书第 9 章 + 2000 年以后）

AN.open4 = (g, t, R, st) => {
  // 背景：神经网络连线
  const N = 40; for (let i = 0; i < N; i++) { const x = HSH(i, 1) * 1920, y = HSH(i, 2) * 1080; for (let j = i + 1; j < N; j++) { const x2 = HSH(j, 1) * 1920, y2 = HSH(j, 2) * 1080, d = Math.hypot(x - x2, y - y2); if (d < 260) line(g, [[x, y], [x2, y2]], `rgba(95,224,160,${.05 * (1 + Math.sin(t + i + j))})`, 1.5); } dot(g, x, y, 3, 'rgba(95,224,160,.25)'); }
  if (st.k === 0) { al(g, pop(t, 5), () => { const cx = R.x + R.w / 2; book(g, cx - 560, R.y + 180, 320, 400, '第 9 章：超越莱布尼茨之梦', 'Chapter 9', C.g, 1); txt(g, '计算机造出来了……', cx - 100, R.y + 300, C.fg2, fnt(700, 36)); txt(g, '它们会思考吗？', cx - 100, R.y + 400, C.gold, fnt(900, 60, 'serif')); }); return; }
  epCards(g, R, t, 4, i => pop(st.tk, .3 + i * .4));
};

AN.ttest = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '1950 ·《计算机器与智能》', '“机器能思考吗？”');
    book(g, R.x + 120, R.y + 230, 340, 440, 'Computing Machinery and Intelligence', 'Mind · 1950', C.gold, pop(st.tk, .3));
    al(g, pop(st.tk, 3), () => { const x = R.x + 580; txt(g, '“思考”', x, R.y + 340, C.fg2, fnt(800, 48, 'serif')); txt(g, '太模糊', x + 220, R.y + 340, C.fg3, fnt(600, 30)); arrow(g, x, R.y + 420, x + 200, R.y + 420, C.gold, 4); txt(g, '模仿游戏', x + 240, R.y + 420, C.gold, fnt(900, 54, 'serif')); txt(g, '一个可以检验的游戏', x + 240, R.y + 490, C.fg2, fnt(600, 28)); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '模仿游戏（图灵测试）', '');
    const jx = R.x + 220, y = R.y + 470;
    person(g, jx, y, C.gold, 2.2); txt(g, '裁判', jx, y + 100, C.gold, fnt(800, 28), 'center');
    line(g, [[jx + 200, R.y + 230], [jx + 200, R.y + 720]], C.fg3, 4, [12, 10]); txt(g, '屏幕', jx + 200, R.y + 750, C.fg3, fnt(600, 22), 'center');
    const hx = R.x + R.w - 300; person(g, hx, R.y + 330, C.b, 1.8); txt(g, 'A', hx + 80, R.y + 330, C.fg, fnt(800, 32)); bot(g, hx, R.y + 600, C.p, 2); txt(g, 'B', hx + 80, R.y + 600, C.fg, fnt(800, 32));
    const msgs = [['你最喜欢哪首诗？', 0, R.y + 280], ['我更喜欢散文。', 1, R.y + 350], ['3 × 47 等于多少？', 0, R.y + 470], ['让我想想……141。', 1, R.y + 540]];
    msgs.forEach(([s, side, yy], i) => al(g, pop(st.tk, 1 + i * 1.6), () => { const x = side ? hx - 520 : jx + 240; rr(g, x, yy - 28, 380, 56, 16, side ? 'rgba(199,155,255,.1)' : 'rgba(255,210,122,.1)', side ? C.p : C.gold, 2); txt(g, s, x + 20, yy, C.fg, fnt(600, 25)); }));
    al(g, pop(st.tk, 8), () => txt(g, '哪个是机器？', cx, R.y + 700, C.gold, fnt(800, 38), 'center'));
    return;
  }
  hdr(g, R, '1956：人工智能诞生', '');
  al(g, pop(st.tk, .3), () => { rr(g, R.x + 80, R.y + 240, 560, 380, 18, 'rgba(14,20,36,.95)', C.b, 2); txt(g, '达特茅斯会议', R.x + 110, R.y + 300, C.b, fnt(800, 32)); txt(g, '“人工智能”这个名字', R.x + 110, R.y + 370, C.fg, fnt(700, 28)); for (let i = 0; i < 5; i++) person(g, R.x + 160 + i * 100, R.y + 520, C.fg2, 1.3); });
  al(g, pop(st.tk, 3), () => { const x = R.x + 700; rr(g, x, R.y + 240, R.w - 720, 380, 18, 'rgba(14,20,36,.95)', C.gold, 2); txt(g, '逻辑理论家（Logic Theorist）', x + 30, R.y + 300, C.gold, fnt(800, 30)); txt(g, '自动证明《数学原理》第二章的大部分定理', x + 30, R.y + 370, C.fg, fnt(600, 26));
    ['*2.01  (p → ¬p) → ¬p', '*2.02  q → (p → q)', '*2.03  (p → ¬q) → (q → ¬p)'].forEach((s, i) => { txt(g, s, x + 30, R.y + 450 + i * 50, C.fg2, fnt(600, 26, 'serif')); ticks(g, x + R.w - 800, R.y + 450 + i * 50, pop(st.tk, 5 + i * .6)); }); });
};

AN.penrose = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '卢卡斯—彭罗斯论证', '借用哥德尔：人心超越机器？');
    const S = [['机器 = 形式系统', C.b], ['系统有证不出的真句子 G', C.p], ['人却能“看出”G 是真的', C.gold], ['所以人超越机器？', C.r]];
    S.forEach(([s, col], i) => al(g, pop(st.tk, .5 + i * 2.5), () => { const y = R.y + 260 + i * 120; rr(g, R.x + 100, y - 45, 700, 90, 16, 'rgba(14,20,36,.95)', col, 2); txt(g, `${i + 1}. ${s}`, R.x + 130, y, C.fg, fnt(700, 30)); if (i < 3) arrow(g, R.x + 450, y + 48, R.x + 450, y + 72, C.fg3, 3, 8); }));
    al(g, pop(st.tk, 2), () => { const x = R.x + R.w - 420; card(g, x, R.y + 240, 380, 260, '提出者', ['卢卡斯（哲学家）1961', '彭罗斯（物理学家）1989、1994'], C.fg2, 1); });
    return;
  }
  hdr(g, R, '戴维斯的反驳', '');
  al(g, pop(st.tk, .3), () => { rr(g, R.x + 100, R.y + 240, 760, 150, 16, 'rgba(14,20,36,.95)', C.gold, 2); txt(g, '“G 是真的”有个前提：', R.x + 130, R.y + 295, C.fg2, fnt(600, 28)); txt(g, '系统不矛盾', R.x + 130, R.y + 350, C.gold, fnt(800, 34)); });
  al(g, pop(st.tk, 4), () => { const x = R.x + 100, y = R.y + 470; // 人脑：一团复杂网络
    for (let i = 0; i < 40; i++) { const a = HSH(i, 1) * TAU, r = HSH(i, 2) * 120, px = x + 180 + Math.cos(a) * r * 1.4, py = y + 120 + Math.sin(a) * r * .8; dot(g, px, py, 5, C.p); if (i) { const b = HSH(i - 1, 1) * TAU, r2 = HSH(i - 1, 2) * 120; line(g, [[px, py], [x + 180 + Math.cos(b) * r2 * 1.4, y + 120 + Math.sin(b) * r2 * .8]], 'rgba(199,155,255,.25)', 1.5); } }
    txt(g, '人脑这么复杂的系统，', x + 420, y + 80, C.fg, fnt(700, 30)); txt(g, '我们无法确知它不矛盾', x + 420, y + 140, C.fg, fnt(700, 30)); txt(g, '人也会犯错、自相矛盾', x + 420, y + 200, C.fg2, fnt(600, 26)); });
  al(g, pop(st.tk, 10), () => { const x = R.x + R.w - 420; card(g, x, R.y + 240, 380, 220, '结论', ['不完备定理限制机器，', '也同样限制我们'], C.ok, 1); });
};

AN.room = (g, t, R, st) => {
  const rx = R.x + R.w * .3, ry = R.y + 230, rw = 520, rh = 460;
  const roomDraw = (sys) => {
    rr(g, rx, ry, rw, rh, 12, 'rgba(14,20,36,.95)', sys ? C.gold : C.fg2, sys ? 5 : 3);
    person(g, rx + 160, ry + 300, C.fg2, 2); book(g, rx + 300, ry + 230, 160, 180, '规则书', '', C.b, 1);
    rr(g, rx - 8, ry + 120, 16, 60, 4, '#070A12'); rr(g, rx + rw - 8, ry + 120, 16, 60, 4, '#070A12');
  };
  if (st.k === 0) {
    hdr(g, R, '塞尔的中文屋（1980）', '');
    roomDraw(false);
    const u = CL(st.tk / 6), v = CL((st.tk - 7) / 4);
    if (u > 0 && u < 1) { const x = LERP(rx - 280, rx + 140, u); rr(g, x, ry + 130, 120, 40, 4, '#E8DFC8'); txt(g, '你好吗？', x + 60, ry + 150, '#3A2E1A', fnt(700, 20), 'center'); }
    if (v > 0) { const x = LERP(rx + rw - 140, rx + rw + 200, v); rr(g, x, ry + 130, 140, 40, 4, '#E8DFC8'); txt(g, '我很好，谢谢', x + 70, ry + 150, '#3A2E1A', fnt(700, 18), 'center'); }
    al(g, pop(st.tk, 3), () => { rr(g, rx + 60, ry + 60, 260, 70, 16, 'rgba(255,255,255,.05)', C.fg3, 2); txt(g, '“如果见到 你好吗，', rx + 76, ry + 85, C.fg2, fnt(600, 18)); txt(g, '就抄写 我很好……”', rx + 76, ry + 110, C.fg2, fnt(600, 18)); });
    txt(g, '不懂中文的人', rx + 160, ry + 420, C.fg3, fnt(600, 22), 'center');
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '屋外：他懂中文　屋里：一个字也不懂', '');
    roomDraw(false);
    al(g, pop(st.tk, .5), () => { person(g, rx - 200, ry + 300, C.ok, 1.8); txt(g, '“对答如流！”', rx - 200, ry + 170, C.ok, fnt(800, 28), 'center'); });
    al(g, pop(st.tk, 2), () => { txt(g, '？？？', rx + 160, ry + 160, C.bad, fnt(800, 36), 'center'); });
    al(g, pop(st.tk, 5), () => { const x = R.x + R.w - 400; card(g, x, R.y + 240, 380, 260, '塞尔', ['计算机只是在摆弄符号', '没有真正的理解'], C.r, 1); });
    return;
  }
  hdr(g, R, '“系统”回应', '人 + 规则书 + 屋子 = 一个系统');
  roomDraw(true);
  al(g, pop(st.tk, .5), () => { txt(g, '系统也许是懂的', rx + rw / 2, ry - 30, C.gold, fnt(800, 32), 'center'); });
  al(g, pop(st.tk, 4), () => { const x = rx + rw + 60; for (let i = 0; i < 7; i++) { dot(g, x + 40 + i * 30, R.y + 300 + Math.sin(i) * 20, 10, C.p); if (i) line(g, [[x + 10 + i * 30, R.y + 300 + Math.sin(i - 1) * 20], [x + 40 + i * 30, R.y + 300 + Math.sin(i) * 20]], C.p, 2); } txt(g, '单个神经元也不懂中文', x, R.y + 370, C.fg2, fnt(600, 24)); });
  al(g, pop(st.tk, 9), () => { const x = rx + rw + 60; txt(g, '戴维斯：规则书大到不可想象时，', x, R.y + 470, C.fg, fnt(700, 26)); txt(g, '直觉不再可靠', x, R.y + 515, C.fg, fnt(700, 26)); txt(g, '争论至今没有结论', x, R.y + 600, C.gold, fnt(800, 30)); });
};

AN.davis = (g, t, R, st) => {
  if (st.bi === 0) {
    hdr(g, R, '马丁·戴维斯', '本书作者 · 丘奇的学生');
    medal(g, R.x + 240, R.y + 380, 120, '戴', '戴维斯', '1928 – 2023', C.g, pop(t, .3));
    const x = R.x + 560; [['逻辑', C.p], ['可计算性', C.gold], ['计算机', C.b]].forEach(([s, col], i) => al(g, pop(t, 1.5 + i * 1), () => { g.save(); g.globalAlpha *= .8; g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); g.arc(x + 200 + i * 170, R.y + 420 + (i === 1 ? -100 : 0), 170, 0, TAU); g.stroke(); g.restore(); txt(g, s, x + 200 + i * 170 + (i - 1) * 90, R.y + 420 + (i === 1 ? -170 : 60), col, fnt(800, 30), 'center'); }));
    al(g, pop(t, 5), () => { dot(g, x + 370, R.y + 380, 14, C.gold); txt(g, '戴维斯', x + 370, R.y + 420, C.fg, fnt(800, 26), 'center'); });
    return;
  }
  hdr(g, R, '书的结尾', '');
  al(g, pop(t, .3), () => { const x = R.x + 100, y = R.y + 250; rr(g, x, y, 520, 300, 18, 'rgba(14,20,36,.95)', C.b, 2); txt(g, '1997 · 深蓝', x + 30, y + 50, C.b, fnt(800, 32)); txt(g, '战胜卡斯帕罗夫', x + 30, y + 110, C.fg, fnt(700, 28)); for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) rr(g, x + 30 + i * 56, y + 150 + j * 32, 56, 32, 0, (i + j) % 2 ? '#2C3854' : '#131B2E'); });
  quote(g, R.x + 680, R.y + 250, R.w - 700, '计算机是逻辑的引擎，而它们的潜力，我们才刚刚开始了解。', '戴维斯，2000（大意）', C.gold, pop(t, 3), 30);
  al(g, pop(t, 9), () => txt(g, '2023 年 1 月 1 日，戴维斯夫妇在车祸中去世，享年 94 岁', R.x + R.w / 2, R.y + 720, C.fg2, fnt(600, 28), 'center'));
};

AN.dpll = (g, t, R, st) => {
  hdr(g, R, 'DPLL：判定公式能否被满足', '戴维斯–普特南 1960 · 戴维斯–洛吉曼–洛夫兰 1962');
  const x = R.x + 100, y = R.y + 260;
  al(g, pop(t, .3), () => { eq(g, '(a ∨ b) ∧ (¬a ∨ c) ∧ (¬b ∨ ¬c)', x, y, C.fg, 40, 'left'); });
  // 搜索树
  const T = [[0, 0, '', C.fg3], [-1, 1, 'a = 1', C.b], [1, 1, 'a = 0', C.b], [-1.5, 2, 'c = 1', C.g], [-.5, 2, '', C.fg3], [1, 2, 'b = 1', C.g], [-1.5, 3, 'b = 0 ✓', C.ok]];
  const tx = x + 360, ty = y + 100, P = ([dx, dy]) => [tx + dx * 220, ty + dy * 120];
  [[0, 1], [0, 2], [1, 3], [2, 5], [3, 6]].forEach(([a, b], i) => al(g, pop(t, 2 + i * 1.2), () => { const A = P(T[a]), B = P(T[b]); line(g, [A, B], C.fg3, 3); dot(g, B[0], B[1], 10, T[b][3]); txt(g, T[b][2], B[0] + 18, B[1], T[b][3], fnt(700, 24, 'mono')); }));
  dot(g, ...P(T[0]), 10, C.fg3);
  al(g, pop(t, 9), () => { const bx = R.x + R.w - 440; card(g, bx, R.y + 240, 400, 360, '今天的 SAT 求解器', ['芯片设计验证', '软件检查', '排班与规划', '核心思想仍来自 DPLL'], C.gold, 1); });
};

AN.h10 = (g, t, R, st) => {
  hdr(g, R, '希尔伯特第十问题', '整数方程有没有整数解？有通用判定方法吗？');
  const x0 = R.x + 100, x1 = R.x + R.w - 100, y = R.y + 330, XI = { 1900: 0, 1950: 1, 1961: 2, 1970: 3 }, X = v => LERP(x0 + 120, x1 - 120, XI[v] / 3);
  line(g, [[x0, y], [x1, y]], C.line2, 4);
  [[1900, '希尔伯特提出', C.b], [1950, '戴维斯的猜想', C.g], [1961, '戴维斯–普特南–罗宾逊', C.g], [1970, '马季亚谢维奇：最后一环', C.gold]].forEach(([v, s, col], i) => al(g, pop(t, .3 + i * 1.8), () => { dot(g, X(v), y, 11, col); txt(g, String(v), X(v), y + (i % 2 ? 44 : -44), col, fnt(800, 28, 'mono'), 'center'); wrapTxt(g, s, X(v) - 120, y + (i % 2 ? 100 : -120), 240, 30, C.fg, fnt(600, 24)); }));
  al(g, pop(t, 9), () => { rr(g, R.x + 100, R.y + 540, R.w - 200, 200, 18, 'rgba(255,107,107,.06)', C.bad, 2); txt(g, '答案：不存在这样的方法', R.x + 140, R.y + 600, C.bad, fnt(800, 34)); txt(g, '任何图灵机都能“伪装”成一个整数方程 → 判定方程 = 判定停机', R.x + 140, R.y + 670, C.fg, fnt(600, 28)); });
};

// ---------- 2000 年后时间线 ----------
const DRAW = {
  map: (g, x, y, w, h) => { const cols = [C.r, C.b, C.g, C.gold]; for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; g.fillStyle = cols[i % 4] + 'aa'; g.beginPath(); g.moveTo(x, y); g.arc(x, y, Math.min(w, h) * .4, a, a + TAU / 9); g.fill(); } g.fillStyle = cols[3]; g.beginPath(); g.arc(x, y, Math.min(w, h) * .14, 0, TAU); g.fill(); },
  group: (g, x, y, w, h, t) => { for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .3; dot(g, x + Math.cos(a) * 90, y + Math.sin(a) * 90, 10, C.p); } eq(g, '|G| 奇数', x, y, C.fg, 30); },
  oranges: (g, x, y) => { for (let r = 0; r < 4; r++) for (let c = 0; c <= r; c++) ball(g, x - r * 26 + c * 52, y - 80 + r * 46, 24, C.o, '#FFE0B0'); },
  lean: (g, x, y) => { ['theorem two_add :', '  2 + 2 = 4 := by', '  norm_num ✓'].forEach((s, i) => txt(g, s, x - 170, y - 40 + i * 40, i === 2 ? C.ok : C.fg, fnt(600, 24, 'mono'))); },
  tensor: (g, x, y, w, h, t) => { for (let i = 0; i < 6; i++) { g.save(); g.translate(x, y); g.rotate(t * .2 + i * .5); g.strokeStyle = `rgba(92,180,255,${.2 + i * .12})`; g.lineWidth = 2; g.strokeRect(-20 - i * 12, -20 - i * 12, 40 + i * 24, 40 + i * 24); g.restore(); } },
  net: (g, x, y, w, h, t) => { const L = [3, 5, 5, 2]; L.forEach((n, i) => { for (let j = 0; j < n; j++) { const px = x - 120 + i * 80, py = y + (j - (n - 1) / 2) * 34; if (i < 3) for (let k = 0; k < L[i + 1]; k++) line(g, [[px, py], [px + 80, y + (k - (L[i + 1] - 1) / 2) * 34]], 'rgba(95,224,160,.2)', 1); dot(g, px, py, 8, C.g); } }); },
  go: (g, x, y) => { for (let i = 0; i < 7; i++) { line(g, [[x - 90, y - 90 + i * 30], [x + 90, y - 90 + i * 30]], '#8a7a50', 1.5); line(g, [[x - 90 + i * 30, y - 90], [x - 90 + i * 30, y + 90]], '#8a7a50', 1.5); } for (let i = 0; i < 12; i++) dot(g, x - 90 + (HSH(i, 1) * 7 | 0) * 30, y - 90 + (HSH(i, 2) * 7 | 0) * 30, 12, i % 2 ? '#111' : '#eee'); },
  attn: (g, x, y, w, h, t) => { const n = 6; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) rr(g, x - 90 + i * 30, y - 90 + j * 30, 28, 28, 3, `rgba(255,210,122,${.08 + .7 * HSH(i, j + Math.floor(t))})`); },
  chat: (g, x, y) => { rr(g, x - 150, y - 70, 220, 44, 14, 'rgba(255,210,122,.12)', C.gold, 1.5); rr(g, x - 70, y, 220, 44, 14, 'rgba(199,155,255,.12)', C.p, 1.5); txt(g, '……？', x - 40, y - 48, C.fg, fnt(600, 20), 'center'); txt(g, '……。', x + 40, y + 22, C.fg, fnt(600, 20), 'center'); },
  medalG: (g, x, y) => { glow(g, x, y, 90, 'rgba(255,210,122,.4)'); dot(g, x, y, 56, C.gold); txt(g, 'IMO', x, y, '#0B1020', fnt(900, 30), 'center'); },
  medalS: (g, x, y) => { glow(g, x, y, 90, 'rgba(200,210,230,.3)'); dot(g, x, y, 56, '#C9D2E3'); txt(g, 'IMO', x, y, '#0B1020', fnt(900, 30), 'center'); },
  dots: (g, x, y, w, h, t) => { const P = []; for (let i = 0; i < 9; i++) P.push([x + Math.cos(i / 9 * TAU) * 80, y + Math.sin(i / 9 * TAU) * 80]); P.forEach((p, i) => P.forEach((q, j) => { if (j > i && Math.abs(Math.hypot(p[0] - q[0], p[1] - q[1]) - 80 * 2 * Math.sin(TAU / 18 * 3)) < 2) line(g, [p, q], 'rgba(255,210,122,.5)', 2); })); P.forEach(p => dot(g, p[0], p[1], 8, C.gold)); },
  erdos: (g, x, y) => { txt(g, '#728', x - 60, y - 30, C.gold, fnt(800, 40, 'mono'), 'center'); txt(g, '#1196', x + 70, y + 30, C.b, fnt(800, 34, 'mono'), 'center'); txt(g, '#90', x - 40, y + 70, C.r, fnt(800, 30, 'mono'), 'center'); },
};

AN.tlproof = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '2000 年后 ①：证明交给机器检查', '');
    const cx = R.x + R.w / 2;
    al(g, pop(st.tk, .3), () => { medal(g, R.x + 240, R.y + 400, 100, '弗', '弗雷格', '1879', C.p, 1); });
    al(g, pop(st.tk, 2), () => { txt(g, '“证明应该能机械地检查”', R.x + 440, R.y + 330, C.fg, fnt(800, 38, 'serif')); arrow(g, R.x + 440, R.y + 420, R.x + 760, R.y + 420, C.gold, 4); });
    al(g, pop(st.tk, 4), () => { rr(g, R.x + 800, R.y + 360, Math.min(560, R.w - 820), 260, 18, 'rgba(14,20,36,.95)', C.ok, 2); txt(g, '证明助手', R.x + 830, R.y + 410, C.ok, fnt(800, 32)); DRAW.lean(g, R.x + 1010, R.y + 530); });
    return;
  }
  timeline(g, R, { k: st.k - 1, tk: st.tk }, t, [
    [1976, '四色定理', '阿佩尔与哈肯：计算机穷举，数学家不放心', 0, C.fg3, DRAW.map],
    [2005, '四色定理 · Coq 验证', '冈蒂埃：用证明助手逐步检查整个证明', 0, C.gold, DRAW.map],
    [2012, '奇阶定理 · Coq', '群论中原文两百多页的定理，团队六年完成', 0, C.p, DRAW.group],
    [2014, '开普勒猜想 · Flyspeck', '黑尔斯团队：最密的堆球方式，机器检查完毕', 1, C.o, DRAW.oranges],
    [2013, 'Lean 诞生', '微软研究院开始开发；志愿者建立 mathlib', 2, C.b, DRAW.lean],
    [2022, '液态张量实验', '舒尔策的前沿定理在 Lean 中检查完毕', 2, C.b, DRAW.tensor],
  ], 1970, 2026, [1980, 1990, 2000, 2010, 2020]);
};

AN.bb5 = (g, t, R, st) => {
  hdr(g, R, '忙碌海狸 BB(5) = 47,176,870', '2024 年 7 月 · bbchallenge 社区 · 用 Coq 验证');
  const x = R.x + 100, y = R.y + 250;
  const V = [['BB(1)', '1'], ['BB(2)', '6'], ['BB(3)', '21'], ['BB(4)', '107'], ['BB(5)', '47,176,870'], ['BB(6)', '大得无法写出']];
  V.forEach(([a, b], i) => al(g, pop(t, .5 + i * 1.2), () => { const yy = y + i * 80, hot = i === 4; if (hot) rr(g, x - 20, yy - 34, 640, 68, 12, 'rgba(255,210,122,.12)', C.gold, 2); txt(g, a, x, yy, hot ? C.gold : C.fg2, fnt(800, 32, 'mono')); txt(g, b, x + 200, yy, hot ? C.gold : i === 5 ? C.r : C.fg, fnt(800, 32, 'mono')); }));
  const n = Math.floor(47176870 * Math.pow(SS((t - 7) / 6), 3));
  al(g, pop(t, 6), () => { const bx = R.x + R.w - 560; rr(g, bx, y - 20, 520, 280, 18, 'rgba(14,20,36,.95)', C.b, 2); txt(g, '五状态冠军机器运行中……', bx + 30, y + 30, C.b, fnt(700, 26)); txt(g, n.toLocaleString('en-US'), bx + 260, y + 130, C.fg, fnt(800, 54, 'mono'), 'center'); txt(g, '步', bx + 260, y + 200, C.fg3, fnt(600, 24), 'center'); });
  al(g, pop(t, 14), () => { const bx = R.x + R.w - 560; rr(g, bx, y + 300, 520, 140, 18, 'rgba(255,107,107,.06)', C.bad, 2); txt(g, '再多一个状态：', bx + 30, y + 350, C.fg2, fnt(600, 26)); txt(g, '撞上停机问题的墙', bx + 30, y + 400, C.bad, fnt(800, 30)); });
};

AN.routes = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  const left = (a) => al(g, a, () => { rr(g, R.x + 80, R.y + 240, R.w / 2 - 140, 420, 20, 'rgba(199,155,255,.06)', C.p, 2); txt(g, '符号路线', R.x + 120, R.y + 300, C.p, fnt(800, 34)); txt(g, '莱布尼茨 · 弗雷格 · 专家系统', R.x + 120, R.y + 350, C.fg3, fnt(600, 22)); ['如果 有羽毛 那么 是鸟', '如果 是鸟 且 不会飞 …', '……'].forEach((s, i) => txt(g, s, R.x + 120, R.y + 440 + i * 60, C.fg, fnt(600, 26, 'mono'))); });
  const right = (a) => al(g, a, () => { const x = cx + 60; rr(g, x, R.y + 240, R.w / 2 - 140, 420, 20, 'rgba(95,224,160,.06)', C.g, 2); txt(g, '学习路线', x + 40, R.y + 300, C.g, fnt(800, 34)); txt(g, '神经网络 · 海量数据', x + 40, R.y + 350, C.fg3, fnt(600, 22)); DRAW.net(g, x + (R.w / 2 - 140) / 2, R.y + 520, 0, 0, t); });
  if (st.bi === 0) {
    hdr(g, R, '人工智能的两条路', '');
    left(pop(t, .5)); right(pop(t, 3));
    al(g, pop(t, 6), () => txt(g, '这二十年：学习路线大获成功', cx, R.y + 730, C.gold, fnt(800, 32), 'center'));
    return;
  }
  hdr(g, R, '两个梦想重新会合', '神经网络提出想法 · 证明助手严格检查');
  const y = R.y + 440;
  al(g, pop(t, .3), () => { rr(g, R.x + 80, y - 110, 400, 220, 20, 'rgba(95,224,160,.08)', C.g, 3); txt(g, '大模型', R.x + 280, y - 40, C.g, fnt(800, 36), 'center'); txt(g, '直觉 · 猜测 · 提出证明', R.x + 280, y + 30, C.fg2, fnt(600, 24), 'center'); });
  al(g, pop(t, 2), () => { packet(g, [[R.x + 490, y], [cx - 210, y]], (t * .5) % 1, C.gold); arrow(g, R.x + 490, y, cx - 210, y, C.fg3, 3); txt(g, '候选证明', (R.x + 490 + cx - 210) / 2, y - 40, C.gold, fnt(700, 24), 'center'); });
  al(g, pop(t, 3), () => { rr(g, cx - 200, y - 110, 400, 220, 20, 'rgba(14,20,36,.95)', C.b, 3); txt(g, 'Lean', cx, y - 40, C.b, fnt(800, 40), 'center'); txt(g, '一步不差地检查', cx, y + 30, C.fg2, fnt(600, 24), 'center'); });
  al(g, pop(t, 5), () => { arrow(g, cx + 210, y, R.x + R.w - 420, y, C.fg3, 3); rr(g, R.x + R.w - 400, y - 110, 320, 220, 20, 'rgba(95,211,154,.1)', C.ok, 3); txt(g, '✓ 定理', R.x + R.w - 240, y, C.ok, fnt(800, 44), 'center'); });
  al(g, pop(t, 8), () => txt(g, '莱布尼茨的“通用文字”与“推理演算”', cx, R.y + 720, C.gold, fnt(800, 32), 'center'));
};

AN.tlai = (g, t, R, st) => {
  if (st.k === 1) {
    hdr(g, R, '图灵测试，然后呢？', '');
    const cx = R.x + R.w / 2;
    const M = [['帮我解释一下哥德尔定理？', 0], ['当然。简单说，任何足够强的形式系统……', 1], ['你真的理解它吗？', 0], ['这正是哲学家们争论的问题。', 1]];
    M.forEach(([s, side], i) => al(g, pop(st.tk, .3 + i * 1.5), () => { g.font = fnt(600, 28); const w = g.measureText(s).width + 50, x = side ? R.x + R.w - 120 - w : R.x + 120, y = R.y + 260 + i * 95; rr(g, x, y - 34, w, 68, 20, side ? 'rgba(199,155,255,.1)' : 'rgba(255,210,122,.1)', side ? C.p : C.gold, 2); txt(g, s, x + 25, y, C.fg, fnt(600, 28)); }));
    al(g, pop(st.tk, 7), () => txt(g, '短对话里已很难分辨 → 争论转向：这个测试到底测了什么？', cx, R.y + 700, C.fg2, fnt(700, 28), 'center'));
    return;
  }
  const k = st.k === 0 ? 0 : st.k === 2 ? 1 : 2;
  timeline(g, R, { k, tk: st.tk }, t, [
    [2012, 'AlexNet', '深度神经网络在图像识别比赛中大幅领先', 0, C.g, DRAW.net],
    [2016, 'AlphaGo', '战胜围棋世界冠军李世石', 0, C.fg2, DRAW.go],
    [2017, 'Transformer', '谷歌研究者提出的新网络结构', 0, C.gold, DRAW.attn],
    [2022, 'ChatGPT', '大语言模型进入公众生活', 0, C.p, DRAW.chat],
    [2024, 'AlphaProof', 'IMO 银牌水平，证明用 Lean 写成并检查', 1, C.b, DRAW.medalS],
    [2025, 'IMO 金牌水平', '多家模型直接用自然语言写证明', 1, C.gold, DRAW.medalG],
    [2026, '埃尔德什问题', 'AI 参与解决一批开放问题，部分由 Lean 检查', 2, C.g, DRAW.erdos],
    [2026, '单位距离猜想', 'OpenAI 模型找到埃尔德什 1946 年猜想的反例', 2, C.gold, DRAW.dots],
  ], 2010, 2027, [2010, 2015, 2020, 2025]);
};

AN.limits = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '不会改变的边界', '');
    const wx = cx + 140; for (let j = 0; j < 8; j++) for (let i = 0; i < 3; i++) rr(g, wx + i * 60 + (j % 2) * 30, R.y + 220 + j * 64, 56, 58, 4, 'rgba(255,107,107,.1)', C.bad, 2);
    al(g, pop(st.tk, .5), () => { for (let i = 0; i < 4; i++) { const x = R.x + 120 + ((st.tk * 80 + i * 150) % (wx - R.x - 200)); bot(g, x, R.y + 300 + i * 120, [C.p, C.g, C.b, C.gold][i], 1.4); } txt(g, '更快的机器 · 更大的模型', R.x + 120, R.y + 760, C.fg2, fnt(600, 26)); });
    al(g, pop(st.tk, 3), () => { const x = wx + 260; txt(g, '停机问题：依然无解', x, R.y + 360, C.fg, fnt(800, 32)); txt(g, '不完备定理：依然成立', x, R.y + 440, C.fg, fnt(800, 32)); txt(g, '图灵 · 哥德尔', x, R.y + 520, C.fg3, fnt(600, 26)); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '量子计算机也一样', '改变的是速度，不是可计算的边界');
    const ox = cx - 200, oy = R.y + 480;
    g.save(); g.fillStyle = 'rgba(92,180,255,.06)'; g.strokeStyle = C.b; g.lineWidth = 3; g.beginPath(); g.ellipse(ox, oy, 420, 260, 0, 0, TAU); g.fill(); g.stroke(); g.restore();
    txt(g, '图灵机能算的问题', ox, oy - 200, C.b, fnt(800, 28), 'center');
    al(g, pop(st.tk, 2), () => { g.save(); g.fillStyle = 'rgba(199,155,255,.15)'; g.strokeStyle = C.p; g.lineWidth = 3; g.beginPath(); g.ellipse(ox + 120, oy + 50, 160, 100, 0, 0, TAU); g.fill(); g.stroke(); g.restore(); txt(g, '量子可能快得多', ox + 120, oy + 50, C.p, fnt(700, 24), 'center'); });
    al(g, pop(st.tk, 5), () => { txt(g, '停机问题 ✗', ox + 560, oy - 80, C.bad, fnt(800, 30)); txt(g, '（在边界外，谁也算不了）', ox + 560, oy - 30, C.fg3, fnt(600, 22)); });
    return;
  }
  hdr(g, R, '今天的问题', '');
  const W = [['计算？', C.fg3, true], ['推理？', C.fg3, true], ['理解？', C.gold, false], ['意识？', C.gold, false]];
  W.forEach(([s, col, done], i) => al(g, pop(st.tk, .3 + i * 1.2), () => { const x = R.x + 120 + i * (R.w - 240) / 4; txt(g, s, x + 100, R.y + 420, col, fnt(900, 56, 'serif'), 'center'); if (done) ticks(g, x + 70, R.y + 520, 1, C.ok); else txt(g, '?', x + 100, R.y + 530, C.gold, fnt(900, 50, 'serif'), 'center'); }));
};

AN.recap4 = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '全系列回顾：三百年的接力', '');
    const P = [['莱', '莱布尼茨', '1646', C.b], ['布', '布尔', '1815', C.g], ['弗', '弗雷格', '1848', C.p], ['康', '康托尔', '1845', C.p], ['希', '希尔伯特', '1862', C.b], ['哥', '哥德尔', '1906', C.b], ['图', '图灵', '1912', C.gold], ['💻', '计算机', '1948', C.g]];
    const w = R.w / P.length;
    P.forEach(([c, n, y, col], i) => al(g, pop(t, .5 + i * 1.8), () => { const x = R.x + w * (i + .5), yy = R.y + 380 + (i % 2) * 120; if (i === 7) { rr(g, x - 60, yy - 50, 120, 90, 10, 'rgba(14,20,36,.95)', col, 3); rr(g, x - 30, yy + 44, 60, 10, 3, col); } else medal(g, x, yy, 56, c, '', '', col, 1); txt(g, n, x, yy + 90, C.fg, fnt(800, 26), 'center'); txt(g, y, x, yy + 124, C.fg3, fnt(600, 20, 'mono'), 'center'); if (i) line(g, [[x - w + 60, R.y + 380 + ((i - 1) % 2) * 120], [x - 60, yy]], C.line2, 2); }));
    return;
  }
  const cx = R.x + R.w / 2;
  al(g, pop(st.tk, .3, 1.2), () => { glow(g, cx, R.y + 380, 300, 'rgba(255,210,122,.15)'); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU + t * .2; g.save(); g.translate(cx + Math.cos(a) * 200, R.y + 380 + Math.sin(a) * 200); g.rotate(a); rr(g, -12, -24, 24, 48, 4, C.gold + '88'); g.restore(); } g.strokeStyle = C.gold; g.lineWidth = 6; g.beginPath(); g.arc(cx, R.y + 380, 170, 0, TAU); g.stroke(); txt(g, '∀∃', cx, R.y + 380, C.gold, fnt(900, 100, 'serif'), 'center'); });
  al(g, pop(st.tk, 3), () => { txt(g, '逻辑的引擎', cx, R.y + 660, C.fg, fnt(900, 64, 'serif'), 'center'); txt(g, '感谢观看', cx, R.y + 740, C.fg2, fnt(700, 30), 'center'); });
};
