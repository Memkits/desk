// 第二集动画：无穷与危机（原书第 4–6 章）

AN.open2 = (g, t, R, st) => {
  for (let i = 0; i < 60; i++) { const a = HSH(i, 1) * TAU, r = (HSH(i, 2) * 900 + t * 30) % 900; txt(g, '∞', 960 + Math.cos(a) * r, 540 + Math.sin(a) * r * .6, `rgba(199,155,255,${.04 + (r / 900) * .12})`, fnt(700, 20 + r / 30, 'serif'), 'center'); }
  if (st.k === 0) { al(g, pop(t, 5), () => { const cx = R.x + R.w / 2; txt(g, '弗雷格的大厦', cx - 380, R.y + 320, C.p, fnt(800, 36), 'center'); txt(g, '罗素悖论', cx - 380, R.y + 380, C.r, fnt(700, 28), 'center'); arrow(g, cx - 200, R.y + 350, cx + 120, R.y + 350, C.fg3, 4); txt(g, '无穷到底有多大？', cx + 350, R.y + 350, C.gold, fnt(800, 44, 'serif'), 'center'); }); return; }
  epCards(g, R, t, 2, i => pop(st.tk, .3 + i * .4));
};

AN.cantorbio = (g, t, R, st) => {
  hdr(g, R, '格奥尔格·康托尔', '集合论的创立者');
  medal(g, R.x + 220, R.y + 380, 120, '康', '康托尔', '1845 – 1918', C.p, pop(t, .3));
  const x = R.x + 520;
  al(g, pop(t, 2), () => { txt(g, '起点：三角级数', x, R.y + 260, C.fg, fnt(800, 32)); const pts = []; for (let i = 0; i <= 300; i++) { const X = i / 300; let y = 0; for (let k = 1; k < 12; k += 2) y += Math.sin(k * X * TAU * 2 + t) / k; pts.push([x + X * 620, R.y + 380 - y * 70]); } line(g, pts, C.b, 3); });
  al(g, pop(t, 6), () => { txt(g, '问题变成：无穷多个点，怎样比大小？', x, R.y + 540, C.gold, fnt(800, 30)); for (let i = 0; i < 40; i++) dot(g, x + 20 + HSH(i, 3) * 600, R.y + 640 + (HSH(i, 4) - .5) * 60, 5, C.p); });
};

AN.pair = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '比多少：不用数，只要配对', '');
    const n = 7, x0 = R.x + 200, w = (R.w - 400) / (n - 1);
    for (let i = 0; i < n; i++) { const x = x0 + i * w, u = pop(st.tk, 1 + i * .5); rr(g, x - 40, R.y + 560, 80, 70, 12, 'rgba(92,180,255,.12)', C.b, 2); al(g, u, () => { const y = LERP(R.y + 260, R.y + 520, u); person(g, x, y, C.gold, 1.4); }); }
    txt(g, '座位', R.x + 80, R.y + 595, C.b, fnt(700, 26)); txt(g, '人', R.x + 80, R.y + 300, C.gold, fnt(700, 26));
    al(g, pop(st.tk, 6), () => txt(g, '没有空座，没有人站着 → 一样多', R.x + R.w / 2, R.y + 740, C.fg, fnt(800, 34), 'center'));
    return;
  }
  hdr(g, R, '自然数 与 偶数 一样多', '每个 n 配 2n');
  const n = 9, x0 = R.x + 130, w = (R.w - 260) / (n - 1), y1 = R.y + 320, y2 = R.y + 560;
  for (let i = 0; i < n; i++) { const x = x0 + i * w, u = pop(st.tk, .5 + i * .45);
    txt(g, String(i + 1), x, y1, C.fg, fnt(800, 44, 'mono'), 'center'); txt(g, String(2 * (i + 1)), x, y2, C.gold, fnt(800, 44, 'mono'), 'center');
    al(g, u, () => { line(g, [[x, y1 + 36], [x, y2 - 36]], C.p, 3); }); }
  txt(g, '…', x0 + n * w - 30, y1, C.fg3, fnt(800, 44), 'center'); txt(g, '…', x0 + n * w - 30, y2, C.fg3, fnt(800, 44), 'center');
  al(g, pop(st.tk, 7), () => { txt(g, '部分 = 整体：这正是无穷的特征', R.x + R.w / 2, R.y + 720, C.p, fnt(800, 34), 'center'); });
};

AN.zigzag = (g, t, R, st) => {
  hdr(g, R, '分数也是可数的', '把分数排成方表，沿斜线走');
  const N = 6, x0 = R.x + 160, y0 = R.y + 230, d = 100;
  for (let p = 1; p <= N; p++) for (let q = 1; q <= N; q++) txt(g, `${p}/${q}`, x0 + (q - 1) * d, y0 + (p - 1) * d, C.fg2, fnt(700, 30, 'serif'), 'center');
  // 斜线路径
  const path = []; for (let s = 2; s <= N + 1; s++) { const cells = []; for (let p = 1; p < s; p++) cells.push([p, s - p]); if (s % 2) cells.reverse(); path.push(...cells); }
  const u = CL((t - 1.5) / 14), k = Math.floor(u * (path.length - 1));
  const pts = path.slice(0, k + 1).map(([p, q]) => [x0 + (q - 1) * d, y0 + (p - 1) * d]);
  if (pts.length > 1) line(g, pts, 'rgba(255,210,122,.6)', 4);
  pts.forEach(([x, y]) => { g.save(); g.strokeStyle = C.gold; g.lineWidth = 2; g.beginPath(); g.arc(x, y, 34, 0, TAU); g.stroke(); g.restore(); });
  const rx = R.x + R.w - 380; txt(g, '排成一队：', rx, R.y + 240, C.gold, fnt(800, 30));
  path.slice(0, Math.min(k + 1, 12)).forEach(([p, q], i) => txt(g, `${i + 1} ↔ ${p}/${q}`, rx + 20 + (i >= 6 ? 170 : 0), R.y + 310 + (i % 6) * 56, C.fg, fnt(700, 28, 'mono')));
};

AN.diag = (g, t, R, st) => {
  const rows = ['0.5000000…', '0.3333333…', '0.1415926…', '0.7182818…', '0.4142135…', '0.6180339…'];
  const x0 = R.x + 160, y0 = R.y + 260, cw = 46, rh = 80;
  if (st.k === 0) {
    hdr(g, R, '实数比自然数多', '对角线论证（1891）');
    const cx = R.x + R.w / 2;
    al(g, pop(st.tk, .5), () => { txt(g, '自然数 1, 2, 3, …', cx - 330, R.y + 420, C.b, fnt(800, 40), 'center'); txt(g, '可数', cx - 330, R.y + 490, C.fg3, fnt(600, 28), 'center'); });
    al(g, pop(st.tk, 2.5), () => { txt(g, '<', cx, R.y + 440, C.fg, fnt(800, 80, 'serif'), 'center'); line(g, [[cx + 120, R.y + 440], [cx + 560, R.y + 440]], C.gold, 4); for (let i = 0; i < 50; i++) dot(g, cx + 120 + HSH(i, 9) * 440, R.y + 440, 3, C.gold); txt(g, '数轴上所有的点', cx + 340, R.y + 490, C.gold, fnt(700, 28), 'center'); });
    return;
  }
  hdr(g, R, st.k === 1 ? '假设清单已经列全了……' : st.k === 2 ? '新数不在清单上' : '对角线：要记住的技巧', '');
  const showDiag = st.k >= 1 ? CL((st.k === 1 ? st.tk - 4 : 99) / 6) : 0;
  rows.forEach((r, i) => al(g, pop(st.k === 1 ? st.tk : 99, .3 + i * .4), () => { txt(g, `第 ${i + 1} 行`, x0 - 20, y0 + i * rh, C.fg3, fnt(600, 24), 'right');
    [...r].forEach((ch, j) => { const di = j - 2 === i, on = di && showDiag * rows.length > i; if (on) rr(g, x0 + j * cw - 4, y0 + i * rh - 30, cw, 60, 8, 'rgba(255,122,147,.25)', C.r, 2); txt(g, ch, x0 + j * cw + cw / 2 - 4, y0 + i * rh, on ? C.r : C.fg, fnt(700, 36, 'mono'), 'center'); }); }));
  txt(g, '⋮', x0 + 200, y0 + rows.length * rh - 10, C.fg3, fnt(800, 40), 'center');
  // 新数：每位 +1
  const nd = rows.map((r, i) => String((+r[i + 2] + 1) % 10)), shown = Math.floor(showDiag * rows.length + .001);
  const ny = y0 + rows.length * rh + 60;
  if (st.k >= 1) { txt(g, '新数', x0 - 20, ny, C.gold, fnt(800, 26), 'right'); txt(g, '0.', x0 + cw - 4, ny, C.gold, fnt(800, 36, 'mono'), 'center'); nd.slice(0, shown).forEach((c, j) => txt(g, c, x0 + (j + 2) * cw + cw / 2 - 4, ny, C.gold, fnt(800, 36, 'mono'), 'center')); }
  const rx = R.x + R.w * .58;
  if (st.k === 1) al(g, pop(st.tk, 6), () => card(g, rx, R.y + 240, R.w * .4, 260, '造法', ['第 n 位：和第 n 行的第 n 位不同', '（这里：那一位加 1）'], C.r, 1));
  if (st.k === 2) al(g, pop(st.tk, .3), () => card(g, rx, R.y + 240, R.w * .4, 340, '矛盾', ['和第 1 行：第 1 位不同', '和第 2 行：第 2 位不同', '…… 和每一行都不同', '→ 清单漏掉了它'], C.gold, 1));
  if (st.k === 3) al(g, pop(st.tk, .3), () => { const W = R.w * .4; [['康托尔', '实数不可数', C.p], ['哥德尔', '不可证的句子', C.b], ['图灵', '停机问题', C.gold]].forEach(([a, b, col], i) => { rr(g, rx, R.y + 230 + i * 150, W, 120, 16, 'rgba(14,20,36,.95)', col, 2); txt(g, a, rx + 30, R.y + 290 + i * 150, col, fnt(800, 32)); txt(g, b, rx + 200, R.y + 290 + i * 150, C.fg, fnt(700, 28)); }); });
};

AN.ladder = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '无穷之上还有更大的无穷', '子集组成的集合，总比原集合大');
    const cx = R.x + R.w * .3, by = R.y + 760;
    [['自然数', 'ℵ₀', C.b], ['实数 = 自然数的子集', '2^ℵ₀', C.gold], ['实数的子集', '2^(2^ℵ₀)', C.r], ['……', '', C.fg3]].forEach(([a, b, col], i) => al(g, pop(st.tk, .3 + i * 1.5), () => { const y = by - i * 150, w = 260 + i * 140; rr(g, cx - w / 2, y - 100, w, 100, 14, 'rgba(14,20,36,.95)', col, 3); txt(g, b, cx, y - 50, col, fnt(800, 40, 'serif'), 'center'); txt(g, a, cx + w / 2 + 30, y - 50, C.fg2, fnt(600, 26)); }));
    al(g, pop(st.tk, 1), () => { const x = R.x + R.w - 420, y = R.y + 260; rr(g, x, y, 380, 280, 16, 'rgba(14,20,36,.95)', C.p, 2); txt(g, '{a, b} 的子集', x + 30, y + 46, C.p, fnt(800, 28)); ['∅', '{a}', '{b}', '{a, b}'].forEach((s, i) => txt(g, s, x + 40 + (i % 2) * 160, y + 120 + Math.floor(i / 2) * 70, C.fg, fnt(700, 32, 'serif'))); txt(g, '2 个元素 → 4 个子集', x + 30, y + 250, C.fg3, fnt(600, 22)); });
    return;
  }
  hdr(g, R, '连续统假设', '自然数和实数之间，有没有中间大小的无穷？');
  const y = R.y + 420, x0 = R.x + 160, x1 = R.x + R.w - 160;
  line(g, [[x0, y], [x1, y]], C.line2, 4);
  dot(g, x0 + 100, y, 16, C.b); txt(g, 'ℵ₀ 自然数', x0 + 100, y + 60, C.b, fnt(800, 30), 'center');
  dot(g, x1 - 100, y, 16, C.gold); txt(g, '实数', x1 - 100, y + 60, C.gold, fnt(800, 30), 'center');
  const m = (x0 + x1) / 2; al(g, pop(st.tk, 1.5), () => { txt(g, '?', m, y - 10, C.r, fnt(900, 90, 'serif'), 'center'); txt(g, '康托尔猜：没有', m, y + 120, C.fg, fnt(700, 30), 'center'); });
  al(g, pop(st.tk, 5), () => txt(g, '结局见本集最后', m, y + 220, C.fg3, fnt(600, 26), 'center'));
};

AN.kronecker = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '激烈的反对', '');
    medal(g, R.x + 240, R.y + 380, 110, '克', '克罗内克', '1823 – 1891', C.r, pop(st.tk, .3));
    quote(g, R.x + 520, R.y + 270, R.w - 560, '上帝创造了整数，其余都是人造的。', '据传为克罗内克所说', C.r, pop(st.tk, 2.5), 38);
    al(g, pop(st.tk, 6), () => txt(g, '只承认能一步步构造出来的东西', R.x + 560, R.y + 560, C.fg2, fnt(600, 28)));
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '康托尔的晚年', '');
    medal(g, R.x + 240, R.y + 380, 110, '康', '康托尔', '1845 – 1918', C.p, 1);
    const x = R.x + 540; [['始终未能进入顶尖大学', C.fg2], ['反复抑郁，多次住进疗养院', C.fg2], ['1918 年在哈雷的疗养院去世', C.fg]].forEach(([s, col], i) => al(g, pop(st.tk, .5 + i * 1.8), () => { dot(g, x, R.y + 290 + i * 100, 8, C.p); txt(g, s, x + 30, R.y + 290 + i * 100, col, fnt(700, 32)); }));
    return;
  }
  hdr(g, R, '数学本身会自相矛盾吗？', '');
  const P = [['布拉利-福尔蒂悖论', '1897', C.p], ['康托尔自己的悖论', '1899', C.b], ['罗素悖论', '1901–1902', C.r]];
  P.forEach(([a, b, col], i) => al(g, pop(st.tk, .3 + i * 1.2), () => { const x = R.x + 80 + i * (R.w - 160) / 3; rr(g, x, R.y + 260, (R.w - 160) / 3 - 30, 200, 16, 'rgba(14,20,36,.95)', col, 2); txt(g, a, x + 24, R.y + 330, C.fg, fnt(800, 28)); txt(g, b, x + 24, R.y + 400, col, fnt(700, 26, 'mono')); }));
  al(g, pop(st.tk, 5), () => txt(g, '危机：数学的根基可靠吗？', R.x + R.w / 2, R.y + 620, C.gold, fnt(800, 44, 'serif'), 'center'));
};

AN.problems = (g, t, R, st) => {
  hdr(g, R, '1900 · 巴黎：二十三个问题', '大卫·希尔伯特（1862–1943），哥廷根大学');
  const x0 = R.x + 520, cs = 96;
  if (st.k === 0) medal(g, R.x + 220, R.y + 400, 120, '希', '希尔伯特', '1862 – 1943', C.b, pop(t, .3));
  else al(g, 1, () => medal(g, R.x + 220, R.y + 400, 120, '希', '希尔伯特', '1862 – 1943', C.b, 1));
  for (let i = 0; i < 23; i++) { const r = Math.floor(i / 6), c = i % 6, x = x0 + c * (cs + 12), y = R.y + 230 + r * (cs + 12), u = pop(st.k === 0 ? t : 99, 2 + i * .12, .4), hot = st.k === 1 && [0, 1, 9].includes(i);
    al(g, u * (st.k === 1 && !hot ? .3 : 1), () => { rr(g, x, y, cs, cs, 12, hot ? 'rgba(255,210,122,.15)' : 'rgba(14,20,36,.95)', hot ? C.gold : C.line2, hot ? 3 : 2); txt(g, String(i + 1), x + cs / 2, y + cs / 2, hot ? C.gold : C.fg2, fnt(800, 32, 'mono'), 'center'); }); }
  if (st.k === 1) { const x = x0 + 6 * (cs + 12) + 20; [['1', '连续统假设'], ['2', '算术不矛盾'], ['10', '整数方程的判定']].forEach(([n, s], i) => al(g, pop(st.tk, .5 + i * 2.5), () => { txt(g, `第 ${n} 题`, x, R.y + 270 + i * 130, C.gold, fnt(800, 30)); txt(g, s, x, R.y + 320 + i * 130, C.fg, fnt(700, 28)); })); }
};

AN.brouwer = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '布劳威尔的直觉主义', '只承认能构造出来的数学');
    medal(g, R.x + 240, R.y + 380, 110, '布', '布劳威尔', '1881 – 1966', C.o, pop(st.tk, .3));
    const x = R.x + 540, y = R.y + 300;
    al(g, pop(st.tk, 2), () => { txt(g, '排中律：命题 P 要么真，要么假', x, y, C.fg, fnt(800, 32)); eq(g, 'P  或  非 P', x + 300, y + 100, C.gold, 52); });
    al(g, pop(st.tk, 5), () => { cross(g, x + 620, y + 100, 1, C.bad, 30); txt(g, '布劳威尔：不接受（对无穷集合）', x, y + 210, C.o, fnt(700, 28)); txt(g, '→ 大量现代数学要被丢掉', x, y + 270, C.fg2, fnt(600, 28)); });
    return;
  }
  hdr(g, R, '希尔伯特的回应', '');
  quote(g, R.x + 60, R.y + 220, R.w - 120, '谁也不能把我们从康托尔为我们创造的乐园中赶出去。', '希尔伯特，1926', C.gold, pop(st.tk, .3), 40);
  al(g, pop(st.tk, 6), () => { const y = R.y + 600; chip(g, '希尔伯特', R.x + 200, y, C.b, 1, 30); txt(g, '⚡', R.x + R.w / 2, y, C.gold, fnt(800, 50), 'center'); chip(g, '布劳威尔', R.x + R.w - 400, y, C.o, 1, 30); txt(g, '1928：布劳威尔被逐出《数学年刊》编委会', R.x + R.w / 2, y + 100, C.fg2, fnt(600, 26), 'center'); });
};

AN.program = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '希尔伯特纲领', '把数学形式化，再证明它不矛盾');
    const S = [['公理', '写清楚的起点', C.b], ['规则', '符号怎样变形', C.p], ['定理', '按规则推出的符号串', C.gold]];
    S.forEach(([a, b, col], i) => al(g, pop(st.tk, .3 + i * 1.2), () => { const x = R.x + 80 + i * 380; rr(g, x, R.y + 250, 320, 160, 16, 'rgba(14,20,36,.95)', col, 2); txt(g, a, x + 160, R.y + 310, col, fnt(800, 34), 'center'); txt(g, b, x + 160, R.y + 365, C.fg2, fnt(600, 24), 'center'); if (i < 2) arrow(g, x + 324, R.y + 330, x + 376, R.y + 330, C.fg3, 3); }));
    al(g, pop(st.tk, 6), () => { rr(g, R.x + 80, R.y + 480, R.w - 160, 220, 18, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, '目标：用最朴素的有限步推理证明', R.x + 120, R.y + 550, C.fg, fnt(700, 32)); eq(g, '这个系统永远推不出  0 = 1', R.x + R.w / 2, R.y + 630, C.gold, 48); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '判定问题（Entscheidungsproblem）', '1928 年，希尔伯特与阿克曼正式提出');
    const bx = cx - 200, by = R.y + 330;
    al(g, pop(st.tk, .3), () => { rr(g, bx, by, 400, 220, 20, 'rgba(14,20,36,.95)', C.gold, 3); txt(g, '判定机器', cx, by + 80, C.gold, fnt(800, 38), 'center'); txt(g, '？', cx, by + 150, C.fg3, fnt(800, 50), 'center'); });
    const ins = ['∀x (x + 0 = x)', '∃x (x · x = 2)', '……任意命题'];
    ins.forEach((s, i) => al(g, pop(st.tk, 1.5 + i * 1.2), () => { txt(g, s, bx - 60, by + 50 + i * 70, C.fg, fnt(700, 30, 'serif'), 'right'); arrow(g, bx - 50, by + 50 + i * 70, bx - 6, by + 110, C.fg3, 2); }));
    al(g, pop(st.tk, 5), () => { arrow(g, bx + 406, by + 110, bx + 520, by + 110, C.fg3, 3); txt(g, '能证明 / 不能', bx + 540, by + 110, C.ok, fnt(800, 32)); });
    al(g, pop(st.tk, 7), () => txt(g, '如果存在：“让我们算一算”就实现了', cx, R.y + 700, C.gold, fnt(800, 34), 'center'));
    return;
  }
  hdr(g, R, '1930 · 柯尼斯堡', '');
  al(g, pop(st.tk, .3), () => { rr(g, cx - 420, R.y + 220, 840, 460, 20, 'rgba(255,255,255,.03)', C.fg3, 2); txt(g, 'Wir müssen wissen.', cx, R.y + 370, C.fg, fnt(800, 64, 'serif'), 'center'); txt(g, 'Wir werden wissen.', cx, R.y + 470, C.fg, fnt(800, 64, 'serif'), 'center'); txt(g, '我们必须知道，我们必将知道。', cx, R.y + 590, C.gold, fnt(800, 38), 'center'); });
  al(g, pop(st.tk, 5), () => txt(g, '—— 后来刻在希尔伯特的墓碑上', cx, R.y + 740, C.fg3, fnt(600, 26), 'center'));
};

AN.godelbio = (g, t, R, st) => {
  hdr(g, R, '库尔特·哥德尔', '');
  medal(g, R.x + 240, R.y + 380, 120, '哥', '哥德尔', '1906 – 1978', C.b, pop(t, .3));
  const x = R.x + 560;
  if (st.k === 0) {
    const X = v => LERP(x, R.x + R.w - 60, (v - 6.3) / 2.4); line(g, [[x, R.y + 420], [R.x + R.w - 60, R.y + 420]], C.line2, 4);
    [[7, '9 月 7 日', '哥德尔在小型讨论会上宣布结果', C.b], [8, '9 月 8 日', '希尔伯特退休演讲', C.fg3]].forEach(([d, a, b, col], i) => al(g, pop(t, 1.5 + i * 2), () => { dot(g, X(d), R.y + 420, 12, col); txt(g, a, X(d), R.y + 370, col, fnt(800, 30), 'center'); wrapTxt(g, b, X(d) - 130, R.y + 480 + i * 100, 260, 32, C.fg2, fnt(600, 23)); }));
    al(g, pop(t, 6), () => txt(g, '1930 · 柯尼斯堡 · 24 岁', x, R.y + 260, C.gold, fnt(800, 34)));
    return;
  }
  const W = (R.w - 580) / 2;
  al(g, pop(st.tk, .3), () => { rr(g, x, R.y + 250, W, 360, 18, 'rgba(95,211,154,.07)', C.ok, 2); txt(g, '1929 好消息', x + 30, R.y + 310, C.ok, fnt(800, 32)); wrapTxt(g, '完备性定理：一阶逻辑里，所有情况下都成立的命题，都能被证明', x + 30, R.y + 390, W - 60, 40, C.fg, fnt(600, 28)); });
  al(g, pop(st.tk, 4), () => { rr(g, x + W + 30, R.y + 250, W, 360, 18, 'rgba(255,107,107,.07)', C.bad, 2); txt(g, '1930 坏消息', x + W + 60, R.y + 310, C.bad, fnt(800, 32)); wrapTxt(g, '不完备性定理', x + W + 60, R.y + 390, W - 60, 40, C.fg, fnt(600, 28)); });
};

AN.gnum = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '哥德尔编码：符号 → 数', '一串符号 = 一个大数（示意）');
    const sym = [['0', 1], ['=', 5], ['S', 3], ['+', 7], ['(', 9], [')', 11]];
    sym.forEach(([s, n], i) => al(g, pop(st.tk, .3 + i * .3), () => { const x = R.x + 100 + i * 140; rr(g, x, R.y + 220, 110, 140, 12, 'rgba(14,20,36,.95)', C.b, 2); txt(g, s, x + 55, R.y + 270, C.fg, fnt(800, 44, 'serif'), 'center'); txt(g, String(n), x + 55, R.y + 330, C.gold, fnt(800, 30, 'mono'), 'center'); }));
    const f = ['0', '=', '0'], codes = [1, 5, 1], P = [2, 3, 5];
    al(g, pop(st.tk, 3), () => { txt(g, '公式  0 = 0', R.x + 100, R.y + 470, C.fg, fnt(800, 38, 'serif')); });
    al(g, pop(st.tk, 5), () => { eq(g, '2¹ × 3⁵ × 5¹ = 2430', R.x + 600, R.y + 470, C.gold, 46, 'left'); txt(g, '用质数的幂依次装进每个符号的编号', R.x + 100, R.y + 560, C.fg2, fnt(600, 26)); txt(g, '反过来分解质因数，就能还原公式', R.x + 100, R.y + 610, C.fg2, fnt(600, 26)); });
    al(g, pop(st.tk, 8), () => txt(g, '关于公式的话 → 关于数的话', R.x + 100, R.y + 720, C.gold, fnt(800, 34)));
    return;
  }
  hdr(g, R, '系统开始谈论它自己', '');
  const cx = R.x + R.w / 2, y = R.y + 420;
  al(g, pop(st.tk, .3), () => { rr(g, cx - 640, y - 120, 520, 240, 18, 'rgba(14,20,36,.95)', C.b, 2); txt(g, '“数 p 编码的是', cx - 380, y - 30, C.fg, fnt(700, 30), 'center'); txt(g, '公式 q 的一个证明”', cx - 380, y + 30, C.fg, fnt(700, 30), 'center'); });
  al(g, pop(st.tk, 2), () => { arrow(g, cx - 100, y, cx + 100, y, C.gold, 4); txt(g, '写成', cx, y - 40, C.gold, fnt(700, 24), 'center'); });
  al(g, pop(st.tk, 3), () => { rr(g, cx + 120, y - 120, 520, 240, 18, 'rgba(255,210,122,.07)', C.gold, 2); eq(g, 'Proof(p, q)', cx + 380, y - 10, C.gold, 52); txt(g, '一个算术命题', cx + 380, y + 60, C.fg2, fnt(600, 26), 'center'); });
  al(g, pop(st.tk, 6), () => txt(g, '像一面镜子：系统照见了自己', cx, R.y + 720, C.fg, fnt(800, 34), 'center'));
};

AN.gsent = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '哥德尔句', '');
    al(g, pop(st.tk, .3), () => { rr(g, cx - 560, R.y + 280, 1120, 200, 24, 'rgba(255,210,122,.08)', C.gold, 3); txt(g, 'G：“本句在这个系统中不可证明”', cx, R.y + 380, C.fg, fnt(800, 48, 'serif'), 'center'); });
    al(g, pop(st.tk, 3), () => { txt(g, '对比说谎者悖论：“本句是假的”', cx, R.y + 600, C.fg3, fnt(600, 28), 'center'); txt(g, '哥德尔把“假”换成“不可证”，矛盾就变成了定理', cx, R.y + 660, C.fg2, fnt(600, 28), 'center'); });
    return;
  }
  hdr(g, R, '第一不完备定理', '');
  const y = R.y + 270;
  rr(g, cx - 300, y - 50, 600, 100, 18, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, 'G 能被证明吗？', cx, y, C.gold, fnt(800, 36), 'center');
  al(g, pop(st.tk, .5), () => { line(g, [[cx - 100, y + 50], [cx - 400, y + 150]], C.fg3, 3); rr(g, cx - 720, y + 150, 640, 220, 16, 'rgba(255,107,107,.06)', C.bad, 2); txt(g, '能证明', cx - 400, y + 200, C.bad, fnt(800, 32), 'center'); wrapTxt(g, '系统证明了一句假话 → 系统是矛盾的', cx - 690, y + 270, 580, 38, C.fg, fnt(600, 28)); });
  al(g, pop(st.tk, 4), () => { line(g, [[cx + 100, y + 50], [cx + 400, y + 150]], C.fg3, 3); rr(g, cx + 80, y + 150, 640, 220, 16, 'rgba(95,211,154,.06)', C.ok, 2); txt(g, '不能证明', cx + 400, y + 200, C.ok, fnt(800, 32), 'center'); wrapTxt(g, '那 G 说的恰恰是真的：一个真却证不出的命题', cx + 110, y + 270, 580, 38, C.fg, fnt(600, 28)); });
  al(g, pop(st.tk, 9), () => { rr(g, R.x + 60, R.y + 680, R.w - 120, 90, 16, 'rgba(255,210,122,.1)', C.gold, 2); txt(g, '足够强、又不矛盾的形式系统，必有真而不可证的命题', cx, R.y + 725, C.fg, fnt(800, 32), 'center'); });
};

AN.second = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '第二不完备定理', '系统无法在内部证明自己不矛盾');
    al(g, pop(st.tk, .3), () => { rr(g, cx - 520, R.y + 240, 1040, 180, 20, 'rgba(14,20,36,.95)', C.b, 3); eq(g, 'Con(系统) = “推不出 0 = 1”', cx, R.y + 330, C.fg, 48); });
    al(g, pop(st.tk, 3), () => { txt(g, '在系统内部：证明不了', cx, R.y + 500, C.bad, fnt(800, 38), 'center'); });
    al(g, pop(st.tk, 7), () => { medal(g, R.x + 260, R.y + 660, 70, '冯', '', '', C.gold, 1); txt(g, '冯·诺依曼：听完报告也想到了，但哥德尔已经抢先一步', R.x + 360, R.y + 660, C.fg2, fnt(600, 28)); });
    return;
  }
  hdr(g, R, '希尔伯特纲领的裂缝', '');
  const S = [['公理', C.b], ['规则', C.p], ['定理', C.gold]];
  S.forEach(([a, col], i) => { const x = R.x + 120 + i * 300; rr(g, x, R.y + 260, 240, 120, 14, 'rgba(14,20,36,.95)', col, 2); txt(g, a, x + 120, R.y + 320, col, fnt(800, 32), 'center'); });
  al(g, pop(st.tk, .5), () => { rr(g, R.x + 120, R.y + 440, 840, 140, 16, 'rgba(255,107,107,.06)', C.bad, 2); txt(g, '用内部朴素推理证明不矛盾', R.x + 160, R.y + 510, C.fg, fnt(700, 32)); cross(g, R.x + 900, R.y + 510, pop(st.tk, 1.5), C.bad, 22); });
  al(g, pop(st.tk, 5), () => { const x = R.x + R.w - 560; card(g, x, R.y + 260, 520, 330, '但数学照常', ['日常研究不受影响', '不完备 ≠ 数学崩溃', '“完美、自足”的梦想有了裂缝'], C.ok, 1); });
};

AN.chind = (g, t, R, st) => {
  hdr(g, R, '连续统假设的结局', '既证不出，也否定不了');
  const cx = R.x + R.w / 2, y = R.y + 400;
  al(g, pop(t, .5), () => { rr(g, cx - 160, y - 90, 320, 180, 20, 'rgba(14,20,36,.95)', C.fg2, 3); txt(g, 'ZFC 公理', cx, y, C.fg, fnt(800, 38), 'center'); });
  al(g, pop(t, 2.5), () => { arrow(g, cx - 170, y, cx - 380, y, C.b, 4); rr(g, cx - 760, y - 90, 380, 180, 20, 'rgba(92,180,255,.08)', C.b, 3); txt(g, '+ CH', cx - 570, y - 20, C.b, fnt(800, 38), 'center'); txt(g, '不矛盾 · 哥德尔 1938', cx - 570, y + 40, C.fg2, fnt(600, 24), 'center'); });
  al(g, pop(t, 7), () => { arrow(g, cx + 170, y, cx + 380, y, C.r, 4); rr(g, cx + 380, y - 90, 380, 180, 20, 'rgba(255,122,147,.08)', C.r, 3); txt(g, '+ 非 CH', cx + 570, y - 20, C.r, fnt(800, 38), 'center'); txt(g, '也不矛盾 · 科恩 1963', cx + 570, y + 40, C.fg2, fnt(600, 24), 'center'); });
  al(g, pop(t, 12), () => txt(g, '在现有公理下，CH 是“独立”的', cx, R.y + 680, C.gold, fnt(800, 38), 'center'));
};

AN.godellate = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '哥德尔在普林斯顿', '');
    const y = R.y + 560, u = (st.tk * .04) % 1;
    line(g, [[R.x + 80, y + 70], [R.x + R.w - 80, y + 70]], C.line2, 3);
    const x = R.x + 200 + u * (R.w - 500);
    al(g, pop(st.tk, .3), () => { person(g, x, y, C.b, 1.8); person(g, x + 110, y, C.fg2, 1.8); txt(g, '哥德尔', x, y + 110, C.b, fnt(700, 24), 'center'); txt(g, '爱因斯坦', x + 110, y + 110, C.fg2, fnt(700, 24), 'center'); });
    al(g, pop(st.tk, 1.5), () => { txt(g, '1940　移居普林斯顿高等研究院', R.x + 120, R.y + 270, C.fg, fnt(700, 30)); txt(g, '每天和爱因斯坦一起散步回家', R.x + 120, R.y + 330, C.fg2, fnt(600, 28)); });
    al(g, pop(st.tk, 6), () => txt(g, '1978　晚年多疑，因营养不良去世', R.x + 120, R.y + 400, C.fg3, fnt(600, 28)));
    return;
  }
  hdr(g, R, '还剩下一个问题', '');
  const cx = R.x + R.w / 2;
  al(g, pop(st.tk, .3), () => { check(g, R.x + 160, R.y + 280, '第二问题：算术不矛盾 → 内部证不了（哥德尔）', 1, C.ok, 30); });
  al(g, pop(st.tk, 2), () => { check(g, R.x + 160, R.y + 370, '判定问题：有没有机械方法？', 0, C.ok, 30); });
  al(g, pop(st.tk, 5), () => { rr(g, cx - 460, R.y + 470, 920, 150, 18, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '先要回答：什么叫“机械的方法”？', cx, R.y + 545, C.gold, fnt(800, 38), 'center'); });
};

AN.recap2 = (g, t, R, st) => {
  hdr(g, R, st.k === 0 ? '第二集回顾' : '下一集：通用机器', '');
  const it = [['康托尔', '无穷也有大小', C.p], ['悖论', '根基可疑', C.r], ['希尔伯特', '形式化 + 证明不矛盾', C.b], ['哥德尔', '真而不可证', C.gold]];
  const w = (R.w - 3 * 30) / 4;
  it.forEach(([a, b, col], i) => { const u = pop(st.k === 0 ? t : 99, .5 + i * 1.5), x = R.x + i * (w + 30), y = R.y + 200; al(g, u * (st.k === 1 ? .4 : 1), () => { rr(g, x, y, w, 260, 18, 'rgba(14,20,36,.92)', col, 2); txt(g, a, x + w / 2, y + 90, col, fnt(800, 34), 'center'); txt(g, b, x + w / 2, y + 160, C.fg, fnt(600, 25), 'center'); }); });
  if (st.k === 1) al(g, pop(st.tk, .4, 1), () => { tape(g, R.x + R.w / 2 - 330, R.y + 560, ['1', '0', '1', '1', '', '', '', ''], 84, 3 + Math.sin(t) * .2); txt(g, '图灵机', R.x + R.w / 2, R.y + 720, C.gold, fnt(800, 32), 'center'); });
};
