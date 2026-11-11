// 第三集动画：通用机器（原书第 7–8 章）

AN.open3 = (g, t, R, st) => {
  // 背景：滚动的纸带
  for (let r = 0; r < 6; r++) { const y = 120 + r * 170, off = (t * (30 + r * 8) * (r % 2 ? 1 : -1)) % 90; for (let i = -1; i < 24; i++) { const x = i * 90 + off; rr(g, x, y, 84, 84, 8, null, 'rgba(92,180,255,.07)', 2); txt(g, HSH(i + r * 31, 3) > .5 ? '1' : '0', x + 42, y + 42, 'rgba(92,180,255,.1)', fnt(700, 36, 'mono'), 'center'); } }
  if (st.k === 0) { al(g, pop(t, 5), () => { const cx = R.x + R.w / 2; txt(g, '推理 → 计算？', cx - 380, R.y + 350, C.fg2, fnt(800, 40, 'serif'), 'center'); arrow(g, cx - 160, R.y + 350, cx + 120, R.y + 350, C.gold, 4); txt(g, '说清什么是计算', cx + 360, R.y + 320, C.gold, fnt(800, 40, 'serif'), 'center'); txt(g, '→ 一台什么都能算的机器', cx + 360, R.y + 390, C.fg, fnt(700, 30), 'center'); }); return; }
  epCards(g, R, t, 3, i => pop(st.tk, .3 + i * .4));
};

AN.turingbio = (g, t, R, st) => {
  hdr(g, R, '阿兰·图灵', '剑桥大学国王学院');
  medal(g, R.x + 240, R.y + 380, 120, '图', '图灵', '1912 – 1954', C.gold, pop(t, .3));
  const x = R.x + 560;
  if (st.k === 0) {
    // 跑步的小人
    const px = x + ((t * 90) % (R.w - 700)), py = R.y + 560, ph = Math.sin(t * 9);
    line(g, [[x, py + 60], [R.x + R.w - 60, py + 60]], C.line2, 3);
    al(g, pop(t, 2), () => { dot(g, px, py - 50, 14, C.fg2); line(g, [[px, py - 36], [px + 4, py + 6]], C.fg2, 6); line(g, [[px + 4, py + 6], [px + 4 + ph * 22, py + 56]], C.fg2, 6); line(g, [[px + 4, py + 6], [px + 4 - ph * 22, py + 56]], C.fg2, 6); line(g, [[px + 2, py - 24], [px + 2 - ph * 24, py]], C.fg2, 5); line(g, [[px + 2, py - 24], [px + 2 + ph * 24, py]], C.fg2, 5); });
    ['腼腆、不拘小节', '长跑：马拉松成绩接近奥运水平'].forEach((s, i) => al(g, pop(t, 1 + i * 2.5), () => txt(g, s, x, R.y + 290 + i * 70, i ? C.gold : C.fg, fnt(700, 32))));
    return;
  }
  al(g, pop(st.tk, .3), () => { rr(g, x, R.y + 230, R.w - 620, 170, 18, 'rgba(14,20,36,.95)', C.b, 2); txt(g, '1935 · 纽曼的数学基础课', x + 30, R.y + 285, C.b, fnt(800, 30)); txt(g, '第一次听说希尔伯特的判定问题', x + 30, R.y + 345, C.fg, fnt(600, 28)); });
  al(g, pop(st.tk, 4), () => { txt(g, '“有没有一个', x, R.y + 520, C.fg2, fnt(700, 38, 'serif')); txt(g, '机械的', x + 230, R.y + 520, C.gold, fnt(900, 50, 'serif')); txt(g, '过程？”', x + 400, R.y + 520, C.fg2, fnt(700, 38, 'serif')); });
  al(g, pop(st.tk, 8), () => txt(g, '图灵追问：一台机器到底能做什么？', x, R.y + 640, C.fg, fnt(800, 32)));
};

// 二进制加一：1011 → 1100
const TM_STEPS = (() => { const tp = ['', '1', '0', '1', '1', '']; const S = [{ tp: tp.slice(), h: 4, s: '进位', r: -1 }]; let h = 4, s = '进位', c = tp.slice();
  while (s !== '停') { const v = c[h]; let r; if (v === '1') { c[h] = '0'; h--; r = 0; } else { c[h] = '1'; s = '停'; r = v === '0' ? 1 : 2; } S.push({ tp: c.slice(), h, s, r }); } return S; })();
AN.tm = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '想象一个在纸上计算的人', '每次只看几个符号 · 写或擦 · 换个想法 · 移动注意力');
    const px = R.x + 260, py = R.y + 520; person(g, px, py, C.fg2, 2.6);
    rr(g, px + 120, py - 40, 520, 300, 8, '#E8DFC8', '#B9A77A', 2);
    const lines = ['  4 7 1', '× 2 3', '———', '1 4 1 3', '9 4 2', '———', '1 0 8 3 3'];
    lines.forEach((s, i) => al(g, pop(st.tk, 1 + i * .9), () => txt(g, s, px + 560, py - 10 + i * 40, '#3A2E1A', fnt(700, 32, 'mono'), 'right')));
    al(g, pop(st.tk, 3), () => { rr(g, px - 110, py - 250, 230, 100, 20, 'rgba(14,20,36,.95)', C.p, 2); txt(g, '心里：“进位 1”', px + 5, py - 200, C.p, fnt(700, 26), 'center'); });
    al(g, pop(st.tk, 6), () => { const x = R.x + R.w - 440; card(g, x, R.y + 240, 400, 340, '人的每一步', ['只盯着眼前几个符号', '按当时的“想法”决定', '写下或擦掉一个符号', '移到旁边，换个想法'], C.gold, 1); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '图灵机', '无限长的纸带 · 读写头 · 有限个状态 · 规则表');
    const cells = ['', '1', '0', '1', '1', '', '', ''], x0 = R.x + 100, cw = 110;
    al(g, pop(st.tk, .3), () => { tape(g, x0, R.y + 300, cells, cw, null); txt(g, '… 纸带无限长 …', x0 + cells.length * cw / 2, R.y + 450, C.fg3, fnt(600, 24), 'center'); });
    al(g, pop(st.tk, 2), () => { tape(g, x0, R.y + 300, cells, cw, 4, C.gold, 4); txt(g, '读写头', x0 + 4.5 * cw, R.y + 220, C.gold, fnt(700, 26), 'center'); });
    al(g, pop(st.tk, 4), () => { rr(g, x0 + 3.5 * cw - 90, R.y + 500, 300, 90, 16, 'rgba(199,155,255,.1)', C.p, 2); txt(g, '状态：进位', x0 + 4.5 * cw - 20, R.y + 545, C.p, fnt(800, 30), 'center'); });
    al(g, pop(st.tk, 7), () => { const x = R.x + R.w - 500, y = R.y + 230; rr(g, x, y, 460, 360, 16, 'rgba(14,20,36,.95)', C.b, 2); txt(g, '规则表', x + 24, y + 40, C.b, fnt(800, 28));
      txt(g, '状态  读  写  移动  新状态', x + 24, y + 100, C.fg3, fnt(600, 21, 'mono'));
      [['进位', '1', '0', '左', '进位'], ['进位', '0', '1', '—', '停'], ['进位', '空', '1', '—', '停']].forEach((r, i) => txt(g, r.map((c, j) => c.padEnd([4, 3, 3, 4, 3][j] - (j === 0 || j === 4 ? 0 : 0))).join('  '), x + 24, y + 160 + i * 60, C.fg, fnt(700, 24, 'mono'))); });
    return;
  }
  if (st.k === 2) {
    hdr(g, R, '例子：给二进制数加一', '1011（11） → 1100（12）');
    const x0 = R.x + 100, cw = 110, dt = 2.6, i = Math.min(TM_STEPS.length - 1, Math.floor(Math.max(0, st.tk - 1) / dt)), S = TM_STEPS[i];
    const prev = TM_STEPS[Math.max(0, i - 1)], u = SS((Math.max(0, st.tk - 1) - i * dt) / .8), hh = i ? LERP(prev.h, S.h, u) : S.h;
    tape(g, x0, R.y + 320, S.tp, cw, hh, C.gold, S.h);
    rr(g, x0 + hh * cw + cw / 2 - 150, R.y + 470, 300, 80, 14, 'rgba(199,155,255,.1)', S.s === '停' ? C.ok : C.p, 2); txt(g, '状态：' + S.s, x0 + hh * cw + cw / 2, R.y + 510, S.s === '停' ? C.ok : C.p, fnt(800, 28), 'center');
    const x = R.x + R.w - 500, y = R.y + 230; rr(g, x, y, 460, 300, 16, 'rgba(14,20,36,.95)', C.b, 2); txt(g, '规则', x + 24, y + 40, C.b, fnt(800, 28));
    ['读 1：写 0，左移（进位）', '读 0：写 1，停', '读空：写 1，停'].forEach((s, k) => { const on = S.r === k; if (on) rr(g, x + 14, y + 80 + k * 70, 432, 54, 10, 'rgba(255,210,122,.15)', C.gold, 2); txt(g, s, x + 30, y + 107 + k * 70, on ? C.gold : C.fg2, fnt(700, 25)); });
    txt(g, `第 ${i} 步`, x0, R.y + 640, C.fg3, fnt(700, 28, 'mono'));
    if (S.s === '停') txt(g, '结果：1100 = 12 ✓', x0 + 200, R.y + 640, C.ok, fnt(800, 32));
    return;
  }
  hdr(g, R, '图灵的论证', '人按规则能做的计算 = 图灵机能做的计算');
  al(g, pop(st.tk, .3), () => { person(g, cx - 420, R.y + 450, C.fg2, 2.4); txt(g, '按规则计算的人', cx - 420, R.y + 590, C.fg, fnt(700, 28), 'center'); });
  al(g, pop(st.tk, 1.5), () => { txt(g, '=', cx, R.y + 450, C.gold, fnt(900, 90, 'serif'), 'center'); });
  al(g, pop(st.tk, 2.5), () => { tape(g, cx + 200, R.y + 410, ['1', '0', '1', '1'], 80, 2); txt(g, '图灵机', cx + 360, R.y + 590, C.fg, fnt(700, 28), 'center'); });
  al(g, pop(st.tk, 5), () => txt(g, '简单得可笑，却一点也不弱', cx, R.y + 720, C.gold, fnt(800, 36), 'center'));
};

AN.utm = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '规则表也能写成符号', '');
    const x = R.x + 120, y = R.y + 260;
    rr(g, x, y, 460, 260, 16, 'rgba(14,20,36,.95)', C.b, 2); ['进位 1 → 0 左 进位', '进位 0 → 1 停', '进位 空 → 1 停'].forEach((s, i) => txt(g, s, x + 30, y + 70 + i * 70, C.fg, fnt(700, 26, 'mono')));
    al(g, pop(st.tk, 2), () => { arrow(g, x + 480, y + 130, x + 600, y + 130, C.gold, 4); const code = 'q1;1;0;L;q1|q1;0;1;H|…'.split(''); tape(g, x + 620, y + 90, code.slice(0, 13), 64, null); txt(g, '一串符号，可以写到纸带上', x + 620, y + 230, C.gold, fnt(700, 26)); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '通用图灵机', '读入“另一台机器的描述 + 输入”，模仿它');
    const y = R.y + 300, x0 = R.x + 100, cw = 62;
    const desc = '描述描述描述描述'.split(''), inp = ['1', '0', '1', '1'];
    al(g, pop(st.tk, .3), () => { desc.forEach((_, i) => { rr(g, x0 + i * cw, y, cw - 4, cw - 4, 6, 'rgba(92,180,255,.15)', C.b, 2); }); txt(g, '机器 M 的规则表（编码）', x0 + desc.length * cw / 2, y - 30, C.b, fnt(700, 24), 'center');
      inp.forEach((s, i) => { const x = x0 + (desc.length + 1 + i) * cw; rr(g, x, y, cw - 4, cw - 4, 6, 'rgba(255,210,122,.12)', C.gold, 2); txt(g, s, x + cw / 2 - 2, y + cw / 2, C.fg, fnt(800, 28, 'mono'), 'center'); }); txt(g, '输入', x0 + (desc.length + 3) * cw, y - 30, C.gold, fnt(700, 24), 'center'); });
    const hp = (st.tk * 1.6) % 13;
    al(g, pop(st.tk, 2), () => { const hx = x0 + hp * cw + cw / 2; g.fillStyle = C.r; g.beginPath(); g.moveTo(hx, y + cw + 6); g.lineTo(hx - 16, y + cw + 36); g.lineTo(hx + 16, y + cw + 36); g.fill(); rr(g, x0 + 200, y + 150, 420, 110, 16, 'rgba(255,122,147,.08)', C.r, 2); txt(g, '通用机 U：来回查表、照做', x0 + 410, y + 205, C.r, fnt(800, 28), 'center'); });
    al(g, pop(st.tk, 6), () => { const x = R.x + R.w - 460; card(g, x, R.y + 240, 420, 320, '一台机器 = 任何机器', ['换一份描述，', '它就变成另一台机器', 'U(M, x) = M(x)'], C.gold, 1); });
    return;
  }
  hdr(g, R, '程序本身也只是数据', '今天的软件思想');
  al(g, pop(st.tk, .3), () => { rr(g, cx - 200, R.y + 470, 400, 200, 20, 'rgba(14,20,36,.95)', C.fg2, 3); txt(g, '一台硬件', cx, R.y + 570, C.fg, fnt(800, 36), 'center'); });
  [['文字处理', C.b], ['游戏', C.r], ['浏览器', C.g], ['计算器', C.o], ['聊天', C.p]].forEach(([s, col], i) => al(g, pop(st.tk, 1.5 + i * .5), () => { const a = Math.PI + i * Math.PI / 4, x = cx + Math.cos(a) * 560, y = R.y + 470 + Math.sin(a) * 240; chip(g, s, x - 60, y, col, 1, 26); arrow(g, x + 30, y + 20, LERP(x, cx, .55), LERP(y, R.y + 470, .55), C.fg3, 2); }));
  al(g, pop(st.tk, 5), () => txt(g, '规则和数据放在同一个地方', cx, R.y + 740, C.gold, fnt(800, 32), 'center'));
};

AN.church = (g, t, R, st) => {
  hdr(g, R, '丘奇-图灵论题', '“算法”的直观概念 = 图灵可计算');
  const cx = R.x + R.w / 2;
  medal(g, R.x + 220, R.y + 340, 90, '丘', '阿朗佐·丘奇', '1903 – 1995', C.p, pop(t, .3));
  const lx = R.x + 380, rx = R.x + R.w - 420, mid = (lx + 400 + rx) / 2;
  al(g, pop(t, 1.5), () => { rr(g, lx, R.y + 230, 400, 220, 18, 'rgba(199,155,255,.07)', C.p, 2); txt(g, 'λ 演算', lx + 200, R.y + 290, C.p, fnt(800, 34), 'center'); eq(g, '(λx. x + 1) 2 → 3', lx + 200, R.y + 380, C.fg, 32); });
  al(g, pop(t, 3), () => { rr(g, rx, R.y + 230, 400, 220, 18, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, '图灵机', rx + 200, R.y + 290, C.gold, fnt(800, 34), 'center'); tape(g, rx + 40, R.y + 362, ['1', '0', '1', '1', ''], 64, null); });
  al(g, pop(t, 6), () => { txt(g, '⇔', mid, R.y + 330, C.fg, fnt(900, 60), 'center'); txt(g, '等价', mid, R.y + 400, C.fg3, fnt(600, 22), 'center'); });
  al(g, pop(t, 10), () => { rr(g, R.x + 60, R.y + 560, R.w - 120, 150, 18, 'rgba(14,20,36,.95)', C.gold, 2); txt(g, '论题：凡是直观上“有算法”的，都能被图灵机计算', cx, R.y + 615, C.fg, fnt(800, 32), 'center'); txt(g, '这是一个信念，不是定理；至今没有反例', cx, R.y + 670, C.fg3, fnt(600, 24), 'center'); });
};

AN.halt = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  const box = (x, y, w, h, s, col, sub) => { rr(g, x, y, w, h, 18, 'rgba(14,20,36,.96)', col, 3); txt(g, s, x + w / 2, y + h / 2 - (sub ? 16 : 0), col, fnt(800, 36), 'center'); if (sub) txt(g, sub, x + w / 2, y + h / 2 + 26, C.fg3, fnt(600, 22), 'center'); };
  if (st.k === 0) {
    hdr(g, R, '停机问题', '给我任何程序和输入：它会停，还是永远算下去？');
    al(g, pop(st.tk, .3), () => { chip(g, '程序 P', cx - 600, R.y + 340, C.b, 1, 28); chip(g, '输入 x', cx - 600, R.y + 460, C.gold, 1, 28); arrow(g, cx - 430, R.y + 340, cx - 200, R.y + 380, C.fg3, 3); arrow(g, cx - 430, R.y + 460, cx - 200, R.y + 420, C.fg3, 3); });
    al(g, pop(st.tk, 2), () => { box(cx - 180, R.y + 300, 360, 200, 'H', C.r, '判定程序（假设存在）'); });
    al(g, pop(st.tk, 4), () => { arrow(g, cx + 190, R.y + 360, cx + 360, R.y + 330, C.fg3, 3); arrow(g, cx + 190, R.y + 440, cx + 360, R.y + 470, C.fg3, 3); txt(g, '“会停”', cx + 380, R.y + 330, C.ok, fnt(800, 32)); txt(g, '“不停”', cx + 380, R.y + 470, C.bad, fnt(800, 32)); });
    al(g, pop(st.tk, 7), () => { txt(g, '例：while (true) {}　← 显然不停', R.x + 120, R.y + 640, C.fg2, fnt(600, 28, 'mono')); txt(g, '但一般情况呢？', R.x + 120, R.y + 700, C.gold, fnt(700, 30)); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '造一个捣乱的程序 D', 'D 读入程序 P，问 H：P 用自己的描述作输入会停吗？');
    al(g, pop(st.tk, .3), () => { rr(g, cx - 520, R.y + 230, 1040, 480, 24, 'rgba(255,122,147,.04)', C.r, 2); txt(g, 'D', cx - 480, R.y + 280, C.r, fnt(900, 48, 'serif')); });
    al(g, pop(st.tk, 1.5), () => { box(cx - 180, R.y + 300, 360, 150, 'H(P, P)', C.r); });
    al(g, pop(st.tk, 4), () => { arrow(g, cx - 100, R.y + 455, cx - 300, R.y + 560, C.fg3, 3); txt(g, '说“会停”', cx - 370, R.y + 520, C.ok, fnt(700, 26), 'center'); rr(g, cx - 480, R.y + 570, 340, 100, 14, 'rgba(14,20,36,.95)', C.bad, 2); txt(g, '故意死循环 ∞', cx - 310, R.y + 620, C.bad, fnt(800, 30), 'center'); });
    al(g, pop(st.tk, 7), () => { arrow(g, cx + 100, R.y + 455, cx + 300, R.y + 560, C.fg3, 3); txt(g, '说“不停”', cx + 370, R.y + 520, C.bad, fnt(700, 26), 'center'); rr(g, cx + 140, R.y + 570, 340, 100, 14, 'rgba(14,20,36,.95)', C.ok, 2); txt(g, '立刻停下 ■', cx + 310, R.y + 620, C.ok, fnt(800, 30), 'center'); });
    return;
  }
  if (st.k === 2) {
    hdr(g, R, '把 D 喂给 D 自己', 'D(D) 会停吗？');
    const f = Math.floor(Math.max(0, st.tk - 2) / 1.6) % 2;
    al(g, pop(st.tk, .3), () => { rr(g, cx - 200, R.y + 280, 400, 180, 20, 'rgba(14,20,36,.95)', C.r, 3); txt(g, 'D( D )', cx, R.y + 370, C.r, fnt(900, 54, 'serif'), 'center'); g.save(); g.strokeStyle = C.r; g.lineWidth = 3; g.setLineDash([8, 8]); g.beginPath(); g.arc(cx, R.y + 370, 260, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); g.restore(); });
    if (st.tk > 2) { txt(g, f ? 'H 说：D(D) 不停' : 'H 说：D(D) 会停', cx - 420, R.y + 580, f ? C.bad : C.ok, fnt(800, 34), 'center'); txt(g, '→', cx, R.y + 580, C.fg3, fnt(800, 40), 'center'); txt(g, f ? '于是 D 立刻停了' : '于是 D 死循环了', cx + 420, R.y + 580, f ? C.ok : C.bad, fnt(800, 34), 'center'); }
    al(g, pop(st.tk, 8), () => txt(g, 'H 怎么回答都错 → H 不存在', cx, R.y + 720, C.gold, fnt(800, 38), 'center'));
    return;
  }
  if (st.k === 3) {
    hdr(g, R, '判定问题：没有解', '图灵，《论可计算数及其在判定问题上的应用》，1936');
    book(g, R.x + 120, R.y + 230, 360, 470, 'On Computable Numbers, with an Application to the Entscheidungsproblem', '1936', C.gold, pop(st.tk, .3));
    al(g, pop(st.tk, 3), () => { const x = R.x + 600; txt(g, '“让我们算一算”', x, R.y + 320, C.fg, fnt(800, 44, 'serif')); line(g, [[x, R.y + 420], [x + 700, R.y + 420]], C.bad, 6); txt(g, '一条无法越过的边界', x, R.y + 500, C.bad, fnt(800, 36)); txt(g, '不存在判定所有逻辑命题的机械方法', x, R.y + 580, C.fg2, fnt(600, 28)); });
    return;
  }
  hdr(g, R, '“停机问题”这个名字', '');
  medal(g, R.x + 260, R.y + 400, 120, '戴', '马丁·戴维斯', '本书作者', C.g, pop(st.tk, .3));
  al(g, pop(st.tk, 2), () => { const x = R.x + 560; txt(g, '图灵 1936：用的是“无循环机器”等说法', x, R.y + 300, C.fg2, fnt(600, 30)); txt(g, '1950 年代：“halting problem” 出现', x, R.y + 380, C.fg, fnt(700, 32)); txt(g, '据说命名者正是戴维斯', x, R.y + 460, C.gold, fnt(800, 34)); });
};

AN.enigma = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '1936–1938 · 普林斯顿', '跟丘奇读博士');
    medal(g, R.x + 380, R.y + 400, 110, '图', '图灵', '', C.gold, pop(st.tk, .3));
    medal(g, R.x + R.w - 380, R.y + 400, 110, '冯', '冯·诺依曼', '1903 – 1957', C.b, pop(st.tk, 2));
    al(g, pop(st.tk, 4), () => { line(g, [[R.x + 520, R.y + 400], [R.x + R.w - 520, R.y + 400]], C.fg3, 3, [8, 8]); txt(g, '想留他做助手', R.x + R.w / 2, R.y + 370, C.fg2, fnt(600, 26), 'center'); });
    al(g, pop(st.tk, 7), () => txt(g, '1938 年，图灵回到英国', R.x + R.w / 2, R.y + 680, C.fg, fnt(700, 30), 'center'));
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '布莱奇利园：破译恩尼格玛', '');
    const x = R.x + 120, y = R.y + 240;
    rr(g, x, y, 520, 420, 18, '#1B1A14', '#6B5523', 3);
    for (let i = 0; i < 3; i++) { const rx = x + 90 + i * 140, ry = y + 90, ch = String.fromCharCode(65 + (Math.floor(t * (i + 1) * .9) + i * 7) % 26); rr(g, rx, ry, 80, 110, 10, '#2B2A20', C.gold, 2); txt(g, ch, rx + 40, ry + 55, C.gold, fnt(800, 44, 'mono'), 'center'); }
    'QWERTZUIO'.split('').forEach((c, i) => { dot(g, x + 70 + i * 48, y + 300, 18, '#2B2A20'); txt(g, c, x + 70 + i * 48, y + 300, C.fg2, fnt(700, 18, 'mono'), 'center'); });
    txt(g, '恩尼格玛：转子让每个字母不断变换', x + 260, y + 470, C.fg2, fnt(600, 24), 'center');
    al(g, pop(st.tk, 3), () => { const bx = R.x + R.w - 600; rr(g, bx, y, 560, 420, 18, 'rgba(14,20,36,.95)', C.b, 2); txt(g, '炸弹机（Bombe）', bx + 30, y + 50, C.b, fnt(800, 30)); for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { const cx_ = bx + 70 + c * 80, cy_ = y + 130 + r * 80; g.save(); g.translate(cx_, cy_); g.rotate(t * (1 + (r + c) % 3)); g.strokeStyle = [C.r, C.gold, C.b][r]; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 28, 0, 5); g.stroke(); g.restore(); } txt(g, '成批排除不可能的设置', bx + 30, y + 390, C.fg2, fnt(600, 24)); });
    return;
  }
  hdr(g, R, '巨人（Colossus）', '上千个真空管的电子破译机');
  for (let i = 0; i < 12; i++) for (let j = 0; j < 5; j++) { const x = R.x + 140 + i * 70, y = R.y + 260 + j * 80, on = HSH(i + Math.floor(t * 4), j) > .5; glow(g, x, y, on ? 30 : 0, 'rgba(255,178,92,.5)'); rr(g, x - 14, y - 26, 28, 52, 12, on ? C.o : '#3A2E20', null); }
  al(g, pop(st.tk, 3), () => { const x = R.x + R.w - 500; card(g, x, R.y + 240, 460, 320, '图灵看到的', ['电子器件足够快', '也足够可靠', '→ 可以造通用机'], C.gold, 1); });
};

AN.babbage = (g, t, R, st) => {
  hdr(g, R, '先驱：巴贝奇的分析机', '设计于 1830 年代，从未造成');
  const x = R.x + 120, y = R.y + 230;
  al(g, pop(t, .3), () => { for (let c = 0; c < 6; c++) for (let r = 0; r < 5; r++) { const gx = x + 60 + c * 80, gy = y + 60 + r * 80; g.save(); g.translate(gx, gy); g.rotate(t * .8 * (c % 2 ? 1 : -1)); for (let k = 0; k < 10; k++) { g.rotate(TAU / 10); rr(g, -4, -32, 8, 10, 2, '#B9A77A'); } g.restore(); dot(g, gx, gy, 24, '#3A3226'); txt(g, String((c * 3 + r) % 10), gx, gy, '#E8DFC8', fnt(700, 22, 'mono'), 'center'); } });
  al(g, pop(t, 3), () => { const bx = x + 560; [['存储（Store）', C.b], ['运算（Mill）', C.r], ['穿孔卡片编程', C.gold]].forEach(([s, col], i) => chip(g, s, bx, y + 60 + i * 90, col, 1, 26)); });
  al(g, pop(t, 7), () => { medal(g, R.x + R.w - 220, R.y + 380, 90, '阿', '阿达·洛芙莱斯', '1815 – 1852', C.p, 1); });
};

AN.precursors = (g, t, R, st) => {
  hdr(g, R, '二十世纪四十年代：几乎同时出现', '各有本事，但都不是完整意义上的通用机');
  const M = [['楚泽 Z3', '1941 · 德国', '继电器，程序在穿孔胶片上', C.b], ['阿塔纳索夫机', '1942 · 美国', '电子管，只解线性方程组', C.g], ['巨人', '1944 · 英国', '电子管，专门破译密码', C.o], ['马克一号', '1944 · 哈佛/IBM', '机电式，纸带编程', C.p]];
  const w = (R.w - 90) / 4;
  M.forEach(([a, b, c, col], i) => al(g, pop(t, .3 + i * 1.5), () => { const x = R.x + i * (w + 30), y = R.y + 250; rr(g, x, y, w, 420, 18, 'rgba(14,20,36,.95)', col, 2); txt(g, a, x + 24, y + 50, col, fnt(800, 30)); txt(g, b, x + 24, y + 100, C.fg2, fnt(600, 22, 'mono'));
    for (let k = 0; k < 4; k++) rr(g, x + 24 + k * (w - 48) / 4, y + 150, (w - 48) / 4 - 8, 120, 6, 'rgba(255,255,255,.04)', col + '88', 1.5);
    wrapTxt(g, c, x + 24, y + 320, w - 48, 32, C.fg, fnt(600, 24)); }));
};

AN.eniac = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, 'ENIAC', '宾夕法尼亚大学摩尔学院 · 1945 年底建成');
    const x0 = R.x + 80, y0 = R.y + 240;
    for (let p = 0; p < 9; p++) { const x = x0 + p * 100; rr(g, x, y0, 88, 380, 6, '#141B2B', C.line2, 2); for (let k = 0; k < 18; k++) { const on = HSH(p * 31 + k, Math.floor(t * 5)) > .55; dot(g, x + 20 + (k % 3) * 24, y0 + 30 + Math.floor(k / 3) * 56, 7, on ? C.o : '#3A2E20'); } }
    const st_ = [['17,000+', '真空管'], ['≈ 30 吨', '重量'], ['5,000 次/秒', '加法'], ['弹道计算', '最初用途']];
    st_.forEach(([a, b], i) => al(g, pop(st.tk, 1.5 + i * 1.5), () => { const x = R.x + R.w - 420, y = R.y + 250 + i * 110; txt(g, a, x, y, C.gold, fnt(800, 40, 'mono')); txt(g, b, x + 260, y, C.fg2, fnt(600, 26)); }));
    return;
  }
  hdr(g, R, '换一个问题 = 重新接线', '程序靠插线和开关，常常要花几天');
  const x0 = R.x + 80, y0 = R.y + 230;
  for (let i = 0; i < 12; i++) for (let j = 0; j < 6; j++) dot(g, x0 + 40 + i * 70, y0 + 40 + j * 70, 9, '#2C3854');
  for (let k = 0; k < 9; k++) { const a = [x0 + 40 + HSH(k, 1) * 11 * 70 | 0, y0 + 40 + (HSH(k, 2) * 5 | 0) * 70], b = [x0 + 40 + (HSH(k, 3) * 11 | 0) * 70, y0 + 40 + (HSH(k, 4) * 5 | 0) * 70], u = SS((st.tk - k * .5) / 1.2); if (u <= 0) continue; g.save(); g.strokeStyle = [C.r, C.gold, C.b, C.g][k % 4]; g.lineWidth = 5; g.beginPath(); g.moveTo(...a); g.quadraticCurveTo((a[0] + b[0]) / 2, Math.max(a[1], b[1]) + 120, LERP(a[0], b[0], u), LERP(a[1], b[1], u)); g.stroke(); g.restore(); }
  al(g, pop(st.tk, 5), () => { const x = R.x + R.w - 440; rr(g, x, R.y + 230, 400, 420, 18, 'rgba(14,20,36,.95)', C.p, 2); txt(g, '六位女性程序员', x + 24, R.y + 280, C.p, fnt(800, 30)); for (let i = 0; i < 6; i++) person(g, x + 70 + (i % 3) * 130, R.y + 400 + Math.floor(i / 3) * 140, C.p, 1.3); txt(g, '贡献长期被忽视', x + 24, R.y + 620, C.fg3, fnt(600, 22)); });
};

AN.vonneumann = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  const arch = (x, y, s, u0) => { const B = [['控制器', 0, 0, C.p], ['运算器', 1, 0, C.r], ['存储器（程序 + 数据）', .5, 1, C.gold], ['输入', -.6, 1, C.b], ['输出', 1.6, 1, C.g]];
    B.forEach(([n, i, j, col], k) => al(g, typeof u0 === 'function' ? u0(k) : u0, () => { const w = k === 2 ? 380 * s : 230 * s; const bx = x + i * 300 * s - (k === 2 ? 75 * s : 0), by = y + j * 220 * s; rr(g, bx, by, w, 120 * s, 14, 'rgba(14,20,36,.96)', col, 3); txt(g, n, bx + w / 2, by + 60 * s, col, fnt(800, 28 * s), 'center'); }));
  };
  if (st.k === 0) {
    hdr(g, R, '1944 · 冯·诺依曼加入', '关键想法：把程序也存进存储器');
    medal(g, R.x + 220, R.y + 380, 110, '冯', '冯·诺依曼', '1903 – 1957', C.b, pop(st.tk, .3));
    al(g, pop(st.tk, 3), () => { const x = R.x + 520, y = R.y + 300; rr(g, x, y, 340, 260, 16, 'rgba(14,20,36,.95)', C.fg3, 2); txt(g, 'ENIAC', x + 170, y + 50, C.fg3, fnt(800, 30), 'center'); txt(g, '程序 = 插线', x + 170, y + 150, C.fg2, fnt(700, 30), 'center'); arrow(g, x + 360, y + 130, x + 480, y + 130, C.gold, 4); rr(g, x + 500, y, 340, 260, 16, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, 'EDVAC', x + 670, y + 50, C.gold, fnt(800, 30), 'center'); txt(g, '程序 = 存储器里的数', x + 670, y + 150, C.fg, fnt(700, 30), 'center'); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '《关于 EDVAC 的报告初稿》', '1945 年 6 月 · 冯·诺依曼结构');
    arch(R.x + 300, R.y + 240, 1, k => pop(st.tk, .5 + k * .8));
    al(g, pop(st.tk, 5), () => { const x0 = R.x + 300, y0 = R.y + 240; arrow(g, x0 + 115, y0 + 124, x0 + 260, y0 + 216, C.fg3, 3); arrow(g, x0 + 415, y0 + 124, x0 + 360, y0 + 216, C.fg3, 3); arrow(g, x0 + 230, y0 + 60, x0 + 300, y0 + 60, C.fg3, 3); });
    al(g, pop(st.tk, 8), () => txt(g, '今天几乎所有计算机都还遵循它', cx, R.y + 720, C.gold, fnt(800, 32), 'center'));
    return;
  }
  if (st.k === 2) {
    hdr(g, R, '谁先想到的？', '');
    al(g, pop(st.tk, .3), () => { rr(g, cx - 220, R.y + 230, 440, 200, 10, '#E8DFC8', '#B9A77A', 2); txt(g, 'First Draft of a Report', cx, R.y + 290, '#3A2E1A', fnt(700, 26, 'serif'), 'center'); txt(g, 'on the EDVAC', cx, R.y + 330, '#3A2E1A', fnt(700, 26, 'serif'), 'center'); txt(g, 'by John von Neumann', cx, R.y + 390, '#3A2E1A', fnt(600, 22, 'serif'), 'center'); });
    al(g, pop(st.tk, 2.5), () => { person(g, cx - 420, R.y + 620, C.r, 1.6); person(g, cx - 280, R.y + 620, C.r, 1.6); txt(g, '埃克特　莫奇利', cx - 350, R.y + 700, C.r, fnt(700, 26), 'center'); txt(g, '不满，团队分裂', cx - 350, R.y + 750, C.fg3, fnt(600, 22), 'center'); person(g, cx + 350, R.y + 620, C.b, 1.6); txt(g, '冯·诺依曼', cx + 350, R.y + 700, C.b, fnt(700, 26), 'center'); txt(g, '?', cx, R.y + 620, C.gold, fnt(900, 70, 'serif'), 'center'); });
    return;
  }
  hdr(g, R, '戴维斯的论点：计算机源自逻辑', '');
  const S = [['通用图灵机', '程序就是纸带上的数据', C.gold], ['冯·诺依曼', '逻辑学家 · 熟悉哥德尔 · 读过图灵', C.b], ['存储程序计算机', '程序就是存储器里的数据', C.g]];
  S.forEach(([a, b, col], i) => al(g, pop(st.tk, .3 + i * 2), () => { const x = R.x + 60 + i * (R.w - 120) / 3, w = (R.w - 120) / 3 - 60; rr(g, x, R.y + 280, w, 240, 18, 'rgba(14,20,36,.95)', col, 3); txt(g, a, x + w / 2, R.y + 350, col, fnt(800, 32), 'center'); wrapTxt(g, b, x + 24, R.y + 430, w - 48, 34, C.fg2, fnt(600, 24)); if (i < 2) arrow(g, x + w + 6, R.y + 400, x + w + 54, R.y + 400, C.fg3, 4); }));
  al(g, pop(st.tk, 8), () => txt(g, '这本书的核心：计算机的思想来自逻辑', cx, R.y + 680, C.gold, fnt(800, 36), 'center'));
};

AN.ace = (g, t, R, st) => {
  hdr(g, R, '图灵的 ACE', '英国国家物理实验室 · 1945–1946 年设计');
  book(g, R.x + 120, R.y + 230, 340, 440, 'Proposed Electronic Calculator', '1946', C.gold, pop(t, .3));
  al(g, pop(t, 2), () => { const x = R.x + 560; [['非常超前', '高速存储、微编程思想'], ['子程序库', '常用程序存起来反复调用'], ['进展缓慢', '图灵失望离开（1948）']].forEach(([a, b], i) => { check(g, x, R.y + 290 + i * 120, a, i < 2 ? 1 : 0, i < 2 ? C.ok : C.bad, 32, b); }); });
  al(g, pop(t, 7), () => txt(g, 'Pilot ACE 直到 1950 年才运行', R.x + 560, R.y + 690, C.fg3, fnt(600, 26)));
};

AN.baby = (g, t, R, st) => {
  hdr(g, R, '1948 年 6 月 21 日 · 曼彻斯特“宝宝”', '世界上第一台运行存储程序的电子计算机');
  const x = R.x + 100, y = R.y + 230;
  rr(g, x, y, 600, 440, 20, '#0B140E', '#2B5A3A', 3);
  for (let r = 0; r < 32; r++) for (let c = 0; c < 32; c++) { const on = HSH(r * 33 + c, Math.floor(t * 2) + (r < 8 ? 0 : 1)) > .5; if (on) dot(g, x + 40 + c * 16.5, y + 30 + r * 12.5, 4, '#7CFFB0'); }
  txt(g, '威廉姆斯管：屏幕上的亮点就是存储的位', x + 300, y + 480, C.fg2, fnt(600, 22), 'center');
  al(g, pop(t, 3), () => { const bx = R.x + R.w - 560; [['1948', '宝宝（SSEM）', '曼彻斯特 · 求最大因数的程序', C.g], ['1949', 'EDSAC', '剑桥 · 为科学家提供日常计算', C.b]].forEach(([a, b, c, col], i) => { const yy = R.y + 240 + i * 220; rr(g, bx, yy, 520, 180, 16, 'rgba(14,20,36,.95)', col, 2); txt(g, a, bx + 24, yy + 50, col, fnt(800, 34, 'mono')); txt(g, b, bx + 150, yy + 50, C.fg, fnt(800, 32)); txt(g, c, bx + 24, yy + 120, C.fg2, fnt(600, 24)); }); });
};

AN.turinglate = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '图灵在曼彻斯特', '为计算机写程序、写手册');
    medal(g, R.x + 240, R.y + 380, 110, '图', '图灵', '', C.gold, pop(st.tk, .3));
    al(g, pop(st.tk, 2), () => { const x = R.x + 540; txt(g, '下一个问题：', x, R.y + 320, C.fg2, fnt(600, 32)); txt(g, '机器能思考吗？', x, R.y + 420, C.gold, fnt(900, 60, 'serif')); });
    return;
  }
  hdr(g, R, '令人心痛的结局', '');
  const x0 = R.x + 120, x1 = R.x + R.w - 120, y = R.y + 400, XI = { 1952: 0, 1954: 1, 2013: 2, 2021: 3 }, X = v => LERP(x0 + 120, x1 - 120, XI[v] / 3);
  line(g, [[x0, y], [x1, y]], C.line2, 4);
  [[1952, '因同性恋被定罪', C.bad], [1954, '死于氰化物中毒，41 岁', C.fg2], [2013, '获英国女王赦免', C.b], [2021, '印上 50 英镑钞票', C.gold]].forEach(([v, s, col], i) => al(g, pop(st.tk, .3 + i * 2.2), () => { dot(g, X(v), y, 11, col); txt(g, String(v), X(v), y + (i % 2 ? 50 : -50), col, fnt(800, 30, 'mono'), 'center'); wrapTxt(g, s, X(v) - 120, y + (i % 2 ? 110 : -150), 240, 32, C.fg, fnt(600, 25)); }));
};

AN.recap3 = (g, t, R, st) => {
  hdr(g, R, st.k === 0 ? '第三集回顾' : '下一集：梦想之后', '');
  const it = [['图灵机', '计算 = 纸带 + 规则', C.gold], ['通用机', '一台机器模拟所有机器', C.b], ['停机问题', '有些问题算不出', C.r], ['存储程序', '通用机变成现实', C.g]];
  const w = (R.w - 3 * 30) / 4;
  it.forEach(([a, b, col], i) => { const u = pop(st.k === 0 ? t : 99, .5 + i * 1.5), x = R.x + i * (w + 30), y = R.y + 200; al(g, u * (st.k === 1 ? .4 : 1), () => { rr(g, x, y, w, 260, 18, 'rgba(14,20,36,.92)', col, 2); txt(g, a, x + w / 2, y + 90, col, fnt(800, 34), 'center'); txt(g, b, x + w / 2, y + 160, C.fg, fnt(600, 25), 'center'); }); });
  if (st.k === 1) al(g, pop(st.tk, .4, 1), () => { const cx = R.x + R.w / 2; bot(g, cx - 120, R.y + 640, C.p, 2.2); txt(g, '?', cx + 40, R.y + 630, C.gold, fnt(900, 90, 'serif'), 'center'); txt(g, '机器能像人一样思考吗？', cx + 120, R.y + 640, C.fg, fnt(800, 34)); });
};
