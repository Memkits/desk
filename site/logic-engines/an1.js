// 第一集动画：莱布尼茨的梦（原书第 1–3 章）

AN.open = (g, t, R, st) => {
  // 背景：飘动的 0 和 1
  for (let i = 0; i < 70; i++) { const x = HSH(i, 1) * 1920, y = (HSH(i, 2) * 1200 + t * (20 + HSH(i, 3) * 30)) % 1200 - 60; txt(g, HSH(i, 4) > .5 ? '1' : '0', x, y, `rgba(92,180,255,${.06 + HSH(i, 5) * .1})`, fnt(700, 22 + HSH(i, 6) * 30, 'mono'), 'center'); }
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    const u = pop(t, 5, .8); if (u <= 0) return;
    al(g, u, () => {
      const px = cx - 130, py = R.y + 170; rr(g, px, py, 260, 500, 36, 'rgba(14,20,36,.96)', C.fg2, 4); rr(g, px + 20, py + 50, 220, 400, 12, '#0B1020', C.line2, 2);
      const apps = [['算账', C.g], ['画图', C.r], ['聊天', C.b], ['导航', C.o]], k = Math.floor(t / 1.6) % 4;
      apps.forEach(([s, col], i) => { const on = i === k; rr(g, px + 40, py + 80 + i * 90, 180, 70, 12, on ? col + '33' : 'rgba(255,255,255,.03)', on ? col : C.line2, 2); txt(g, s, px + 130, py + 115 + i * 90, on ? C.fg : C.fg3, fnt(700, 26), 'center'); });
      txt(g, '同一块芯片', cx - 420, R.y + 330, C.fg, fnt(800, 40, 'serif'), 'center'); txt(g, '换一个程序', cx + 420, R.y + 330, C.fg, fnt(800, 40, 'serif'), 'center');
      txt(g, '硬件不变', cx - 420, R.y + 390, C.fg3, fnt(600, 26), 'center'); txt(g, '做完全不同的事', cx + 420, R.y + 390, C.fg3, fnt(600, 26), 'center');
      txt(g, '这样的机器从哪里来？', cx, R.y + 720, C.gold, fnt(800, 38), 'center');
    });
    return;
  }
  if (st.k === 1) {
    const u = pop(st.tk, .3, .8);
    book(g, cx - 560, R.y + 120, 360, 470, 'Engines of Logic', 'Martin Davis · 2000', C.gold, u);
    al(g, u, () => { txt(g, '《逻辑的引擎》', cx - 380, R.y + 650, C.fg, fnt(800, 36, 'serif'), 'center'); txt(g, '第一推动丛书 · 中译本', cx - 380, R.y + 700, C.fg3, fnt(600, 24), 'center'); });
    const N = [['莱布尼茨', C.b], ['布尔', C.b], ['弗雷格', C.b], ['康托尔', C.p], ['希尔伯特', C.p], ['哥德尔', C.p], ['图灵', C.gold], ['计算机', C.g]];
    N.forEach(([s, col], i) => { const v = pop(st.tk, 3 + i * .9, .6), y = R.y + 150 + i * 88, x = cx + 40; al(g, v, () => { chip(g, s, x, y, col, 1, 28); if (i < N.length - 1) arrow(g, x + 60, y + 26, x + 60, y + 62, C.fg3, 2, 9); }); });
    al(g, pop(st.tk, 11), () => txt(g, '三百年：把推理变成计算', cx + 320, R.y + 460, C.gold, fnt(800, 32), 'left'));
    return;
  }
  epCards(g, R, t, -1, i => pop(st.tk, .3 + i * .8));
};

AN.leibbio = (g, t, R, st) => {
  hdr(g, R, '戈特弗里德·莱布尼茨', '律师 · 外交官 · 历史学家 · 哲学家 · 数学家');
  medal(g, R.x + 220, R.y + 380, 120, '莱', '莱布尼茨', '1646 – 1716', C.b, pop(t, .3));
  const E = [['1646', '生于莱比锡'], ['1673', '向英国皇家学会展示计算器模型'], ['1675', '发明微积分（与牛顿各自独立）'], ['1679', '写下二进制算术'], ['1716', '在汉诺威去世']];
  const x = R.x + 520; line(g, [[x, R.y + 230], [x, R.y + 230 + 4 * 120]], C.line2, 4);
  E.forEach(([y, s_], i) => al(g, pop(t, 1.2 + i * 1.6), () => { const yy = R.y + 230 + i * 120; dot(g, x, yy, 10, C.b); txt(g, y, x + 40, yy, C.b, fnt(800, 32, 'mono')); txt(g, s_, x + 160, yy, C.fg, fnt(600, 30)); }));
};

AN.stepped = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '阶梯圆筒：让机器做乘法', '帕斯卡的机器只能加减；莱布尼茨让齿数随位置变化');
    const cx = R.x + 360, cy = R.y + 470, L = 420, H = 180;
    // 圆筒（侧视）+ 九根长短不同的齿
    rr(g, cx - L / 2, cy - H / 2, L, H, 20, 'rgba(92,180,255,.08)', C.b, 3);
    const rot = t * 2.2;
    for (let i = 0; i < 9; i++) { const len = (i + 1) / 9 * L * .9, ph = (rot + i * .7) % TAU, y = cy + Math.sin(ph) * H * .42, vis = Math.cos(ph) > 0; if (!vis) continue; rr(g, cx + L / 2 - len - 10, y - 6, len, 12, 4, C.gold + 'cc'); }
    // 可滑动的小齿轮：选择数字 n
    const n = 4, gx = cx + L / 2 - (n / 9) * L * .9 - 6;
    g.save(); g.translate(gx, cy - H / 2 - 50); g.rotate(-rot * 1.5); for (let i = 0; i < 10; i++) { g.rotate(TAU / 10); rr(g, -6, -46, 12, 18, 3, C.r); } g.restore(); dot(g, gx, cy - H / 2 - 50, 30, C.r); txt(g, String(n), gx, cy - H / 2 - 50, '#0B1020', fnt(900, 30, 'mono'), 'center');
    txt(g, '小齿轮停在第 4 格：每转一圈，咬合 4 根齿', cx, cy + H / 2 + 60, C.fg2, fnt(600, 24), 'center');
    // 计数器：37 × 4 = 转四圈，每圈加 37
    const rx = R.x + R.w - 520, turns = Math.min(4, Math.floor(CL((t - 3) / 12) * 4.999));
    rr(g, rx, R.y + 240, 460, 420, 18, 'rgba(14,20,36,.94)', C.gold, 2);
    txt(g, '算 37 × 4', rx + 30, R.y + 290, C.gold, fnt(800, 30));
    for (let i = 0; i < 4; i++) { const on = i < turns; txt(g, `第 ${i + 1} 圈  + 37`, rx + 40, R.y + 360 + i * 54, on ? C.fg : C.fg3, fnt(600, 26, 'mono')); if (on) ticks(g, rx + 380, R.y + 360 + i * 54, 1); }
    txt(g, `计数器：${String(37 * turns).padStart(3, '0')}`, rx + 40, R.y + 610, C.fg, fnt(800, 34, 'mono'));
    return;
  }
  hdr(g, R, '把计算交给机器', '');
  quote(g, R.x + 60, R.y + 170, R.w - 120, '让优秀的人像奴隶一样，把时间耗在计算的苦工上，是不值得的。', '莱布尼茨', C.gold, pop(st.tk, .3));
  al(g, pop(st.tk, 3), () => {
    const y = R.y + 620; person(g, R.x + 260, y, C.fg2, 1.6); txt(g, '人：去想真正的问题', R.x + 260, y + 90, C.fg, fnt(700, 26), 'center');
    arrow(g, R.x + 460, y, R.x + R.w / 2 - 80, y, C.fg3, 3);
    rr(g, R.x + R.w / 2 - 60, y - 70, 240, 140, 16, 'rgba(14,20,36,.95)', C.b, 3); txt(g, '机器', R.x + R.w / 2 + 60, y - 18, C.b, fnt(800, 30), 'center'); txt(g, '× ÷ + −', R.x + R.w / 2 + 60, y + 28, C.fg2, fnt(700, 28, 'mono'), 'center');
  });
};

AN.notation = (g, t, R, st) => {
  hdr(g, R, '好的记号会替你思考', '莱布尼茨的微积分记号沿用至今');
  const cx = R.x + R.w / 2;
  al(g, pop(t, .3), () => { eq(g, 'dy', cx - 360, R.y + 300, C.gold, 64); line(g, [[cx - 410, R.y + 340], [cx - 310, R.y + 340]], C.gold, 4); eq(g, 'dx', cx - 360, R.y + 390, C.gold, 64); txt(g, '导数', cx - 360, R.y + 470, C.fg3, fnt(600, 24), 'center'); });
  al(g, pop(t, 1.5), () => { eq(g, '∫ f(x) dx', cx + 280, R.y + 345, C.gold, 72); txt(g, '积分：长长的 S，代表“求和”', cx + 280, R.y + 470, C.fg3, fnt(600, 24), 'center'); });
  // 链式法则：du 像分数一样约掉
  const u = SS((t - 5) / 2), y = R.y + 660;
  al(g, pop(t, 4), () => {
    txt(g, '链式法则：', R.x + 100, y, C.fg2, fnt(700, 30));
    const parts = ['dy/dx', '  =  ', 'dy/', 'du', ' · ', 'du', '/dx']; g.font = fnt(700, 52, 'serif'); const ws = parts.map(p => g.measureText(p).width), tot = ws.reduce((a, b) => a + b, 0); let xx = cx + 40 - tot / 2;
    parts.forEach((p, i) => { txt(g, p, xx, y, (i === 3 || i === 5) && u > 0 ? C.r : C.fg, fnt(700, 52, 'serif')); if ((i === 3 || i === 5) && u > 0) { g.save(); g.globalAlpha = u; line(g, [[xx - 4, y + 20], [xx + ws[i] + 4, y - 20]], C.r, 4); g.restore(); } xx += ws[i]; });
    al(g, pop(t, 7.5), () => txt(g, '像分数一样“约掉” du，结论自己出现', cx + 40, y + 90, C.gold, fnt(700, 28), 'center'));
  });
};

AN.binary = (g, t, R, st) => {
  hdr(g, R, '二进制：只用 0 和 1', '1679 年手稿，1703 年发表');
  const n = Math.floor(CL(t / 10) * 15.99), x0 = R.x + 120, y = R.y + 330;
  for (let b = 0; b < 4; b++) { const on = (n >> (3 - b)) & 1, x = x0 + b * 150; glow(g, x + 50, y, on ? 90 : 0, 'rgba(255,210,122,.5)'); rr(g, x, y - 50, 100, 100, 50, on ? C.gold : 'rgba(14,20,36,.95)', on ? C.gold : C.line2, 3); txt(g, String(on), x + 50, y, on ? '#0B1020' : C.fg3, fnt(900, 46, 'mono'), 'center'); txt(g, String(1 << (3 - b)), x + 50, y + 90, C.fg3, fnt(600, 22, 'mono'), 'center'); }
  txt(g, `= ${n}`, x0 + 230, y + 170, C.fg, fnt(800, 64, 'mono'), 'center');
  // 易经卦象 ↔ 二进制
  al(g, pop(t, 9), () => {
    const gx = R.x + R.w - 460, gy = R.y + 220, v = 0b101101;
    rr(g, gx - 30, gy - 30, 440, 600, 18, 'rgba(14,20,36,.94)', C.r, 2);
    txt(g, '易经卦象（莱布尼茨的类比）', gx + 190, gy + 10, C.r, fnt(700, 24), 'center');
    for (let i = 0; i < 6; i++) { const bit = (v >> (5 - i)) & 1, yy = gy + 70 + i * 62; if (bit) rr(g, gx + 40, yy, 220, 26, 4, C.fg); else { rr(g, gx + 40, yy, 95, 26, 4, C.fg); rr(g, gx + 165, yy, 95, 26, 4, C.fg); } txt(g, String(bit), gx + 320, yy + 13, C.gold, fnt(800, 30, 'mono'), 'center'); }
    txt(g, '阳爻 = 1　阴爻 = 0', gx + 190, gy + 480, C.fg2, fnt(600, 22), 'center');
  });
  al(g, pop(t, 15), () => txt(g, '两百多年后：电子计算机的语言', x0, R.y + 620, C.g, fnt(800, 32)));
};

AN.primes = (g, t, R, st) => {
  hdr(g, R, '通用文字：概念 = 质数的乘积', '莱布尼茨 1679 年的设想（示意）');
  const cx = R.x + R.w / 2, y0 = R.y + 300;
  const P = [['动物', 2, C.b, -360], ['理性', 3, C.p, 0], ['植物', 7, C.g, 360]];
  P.forEach(([s, n, col, dx], i) => al(g, pop(t, .3 + i * .8), () => { rr(g, cx + dx - 130, y0 - 60, 260, 120, 18, 'rgba(14,20,36,.95)', col, 3); txt(g, s, cx + dx - 60, y0, C.fg, fnt(800, 34), 'center'); txt(g, String(n), cx + dx + 70, y0, col, fnt(900, 54, 'mono'), 'center'); }));
  const u = pop(t, 4, .8);
  al(g, u, () => { line(g, [[cx - 360, y0 + 60], [cx - 180, y0 + 220]], C.fg3, 3); line(g, [[cx, y0 + 60], [cx - 180, y0 + 220]], C.fg3, 3); rr(g, cx - 380, y0 + 220, 400, 120, 18, 'rgba(255,210,122,.1)', C.gold, 3); txt(g, '人', cx - 320, y0 + 280, C.fg, fnt(800, 40), 'center'); txt(g, '2 × 3 = 6', cx - 130, y0 + 280, C.gold, fnt(800, 34, 'mono'), 'center'); txt(g, '理性的动物', cx - 180, y0 + 370, C.fg3, fnt(600, 22), 'center'); });
  if (st.k >= 1) {
    const x = cx + 120;
    al(g, pop(st.tk, .5), () => { txt(g, '人是动物吗？　6 ÷ 2 = 3', x, y0 + 250, C.fg, fnt(700, 30, 'mono')); ticks(g, x + 470, y0 + 252, pop(st.tk, 1.5)); });
    al(g, pop(st.tk, 3), () => { txt(g, '人是植物吗？　6 ÷ 7 除不尽', x, y0 + 330, C.fg, fnt(700, 30, 'mono')); cross(g, x + 500, y0 + 330, pop(st.tk, 4)); });
    al(g, pop(st.tk, 6), () => txt(g, '推理变成了算术', cx + 120, y0 + 420, C.gold, fnt(800, 40, 'serif')));
  }
};

AN.calculemus = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '推理演算：让我们算一算', 'Calculemus!');
    const y = R.y + 470, sit = SS((st.tk - 6) / 1.5);
    [-1, 1].forEach(s => { const x = cx + s * 300; person(g, x, y, s < 0 ? C.b : C.r, 2); });
    al(g, 1 - sit, () => { [-1, 1].forEach((s, i) => { const x = cx + s * 300; rr(g, x - 90 + s * 40, y - 220, 180, 80, 20, 'rgba(14,20,36,.95)', s < 0 ? C.b : C.r, 2); txt(g, i ? '不对！' : '我对！', x + s * 40, y - 180, C.fg, fnt(800, 30), 'center'); }); });
    al(g, sit, () => { [-1, 1].forEach(s => { const x = cx + s * 300; rr(g, x - 80, y + 70, 160, 100, 8, '#1A2433', C.fg3, 2); txt(g, '2×3 …', x, y + 120, C.fg2, fnt(700, 26, 'mono'), 'center'); });
      txt(g, '“让我们算一算！”', cx, y - 220, C.gold, fnt(800, 46, 'serif'), 'center'); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '他写下的几条逻辑规则', '大多生前未发表');
    const x = R.x + 120, y = R.y + 200;
    rr(g, x, y, 640, 560, 12, '#E8DFC8', '#B9A77A', 2);
    ['A + A = A', 'A + B = B + A', '若 A 包含 B，B 包含 C，', '则 A 包含 C'].forEach((s, i) => al(g, pop(st.tk, .4 + i * .8), () => txt(g, s, x + 60, y + 90 + i * 100, '#3A2E1A', fnt(700, 38, 'serif'))));
    al(g, pop(st.tk, 4), () => { txt(g, '一个概念与自己合并，还是它自己', x + 760, y + 120, C.fg, fnt(700, 30)); txt(g, '→ 一百多年后，布尔写下 x · x = x', x + 760, y + 180, C.gold, fnt(700, 28)); });
    return;
  }
  hdr(g, R, '梦想沉睡了一百多年', '');
  const x0 = R.x + 120, x1 = R.x + R.w - 120, y = R.y + 420, X = v => LERP(x0, x1, (v - 1700) / 160);
  line(g, [[x0, y], [x1, y]], C.line2, 4);
  [1700, 1750, 1800, 1850].forEach(v => txt(g, String(v), X(v), y + 40, C.fg3, fnt(600, 22, 'mono'), 'center'));
  dot(g, X(1716), y, 12, C.b); txt(g, '1716 莱布尼茨去世', X(1716), y - 50, C.b, fnt(700, 26), 'center');
  const u = SS(st.tk / 5); line(g, [[X(1716), y], [LERP(X(1716), X(1847), u), y]], 'rgba(255,210,122,.4)', 6, [8, 10]);
  al(g, pop(st.tk, 2), () => txt(g, 'z z z', X(1780), y - 70, C.fg3, fnt(700, 40, 'serif'), 'center'));
  al(g, pop(st.tk, 5), () => { dot(g, X(1847), y, 12, C.gold); txt(g, '1847 布尔', X(1847), y - 50, C.gold, fnt(700, 26), 'center'); });
};

AN.boolebio = (g, t, R, st) => {
  hdr(g, R, '乔治·布尔', '自学成才的数学家');
  medal(g, R.x + 220, R.y + 380, 120, '布', '布尔', '1815 – 1864', C.g, pop(t, .3));
  if (st.k === 0) {
    const S = [['林肯郡', '鞋匠的儿子'], ['自学', '拉丁语 · 希腊语 · 高等数学'], ['十几岁', '教书养家，后来自办学校']];
    S.forEach(([a, b], i) => al(g, pop(t, 1.5 + i * 2.2), () => { const x = R.x + 500 + i * ((R.w - 560) / 3); rr(g, x, R.y + 300, (R.w - 620) / 3, 200, 16, 'rgba(14,20,36,.94)', C.g, 2); txt(g, a, x + 24, R.y + 350, C.g, fnt(800, 30)); wrapTxt(g, b, x + 24, R.y + 410, (R.w - 620) / 3 - 48, 34, C.fg2, fnt(600, 24)); if (i < 2) arrow(g, x + (R.w - 620) / 3 + 4, R.y + 400, x + (R.w - 560) / 3 - 4, R.y + 400, C.fg3, 3); }));
    return;
  }
  const W = (R.w - 560) / 3;
  [['1847', '《逻辑的数学分析》', C.g], ['1849', '科克女王学院 教授', C.b], ['1854', '《思维规律》', C.gold]].forEach(([y, s, col], i) => { const x = R.x + 500 + i * W;
    if (i === 1) al(g, pop(st.tk, .3 + i * 2), () => { rr(g, x, R.y + 250, W - 40, 300, 16, 'rgba(14,20,36,.94)', col, 2); txt(g, y, x + 24, R.y + 300, col, fnt(800, 32, 'mono')); wrapTxt(g, s, x + 24, R.y + 370, W - 90, 36, C.fg, fnt(700, 28)); txt(g, '没有大学学位', x + 24, R.y + 500, C.fg3, fnt(600, 22)); });
    else book(g, x, R.y + 250, W - 40, 300, s, y, col, pop(st.tk, .3 + i * 2)); });
};

AN.venn = (g, t, R, st) => {
  hdr(g, R, '用字母代表一类东西', 'x · y = 两类的公共部分');
  const cx = R.x + R.w * .38, cy = R.y + 480;
  rr(g, cx - 460, cy - 300, 920, 580, 16, 'rgba(255,255,255,.02)', C.fg3, 2); txt(g, '1 = 全体', cx - 440, cy - 270, C.fg3, fnt(600, 22));
  const ux = pop(t, .5), uy = pop(t, 3), ui = pop(t, 7);
  al(g, ux, () => { g.fillStyle = 'rgba(233,238,247,.08)'; g.beginPath(); g.arc(cx - 120, cy, 210, 0, TAU); g.fill(); g.strokeStyle = C.fg; g.lineWidth = 3; g.stroke(); txt(g, 'x　白色的东西', cx - 220, cy - 230, C.fg, fnt(700, 28), 'center'); });
  al(g, uy, () => { g.fillStyle = 'rgba(95,224,160,.08)'; g.beginPath(); g.arc(cx + 120, cy, 210, 0, TAU); g.fill(); g.strokeStyle = C.g; g.lineWidth = 3; g.stroke(); txt(g, 'y　羊', cx + 220, cy - 230, C.g, fnt(700, 28), 'center'); });
  al(g, ui, () => { g.save(); g.beginPath(); g.arc(cx - 120, cy, 210, 0, TAU); g.clip(); g.fillStyle = 'rgba(255,210,122,.35)'; g.beginPath(); g.arc(cx + 120, cy, 210, 0, TAU); g.fill(); g.restore(); txt(g, 'x y', cx, cy, C.gold, fnt(900, 44, 'serif'), 'center'); });
  // 点：白色的东西 / 羊
  for (let i = 0; i < 24; i++) { const a = HSH(i, 1) * TAU, r = Math.sqrt(HSH(i, 2)) * 180, k = i % 3, ox = k === 0 ? -200 : k === 1 ? 200 : 0, x = cx + ox + Math.cos(a) * (k === 2 ? 50 : r * .5), y = cy + Math.sin(a) * (k === 2 ? 120 : r * .9); al(g, k === 0 ? ux : k === 1 ? uy : ui, () => { if (k === 1) dot(g, x, y, 9, '#5a5a5a'); else dot(g, x, y, 9, '#F5F5F5'); if (k !== 0) dot(g, x + 9, y - 5, 5, k === 1 ? '#5a5a5a' : '#F5F5F5'); }); }
  al(g, pop(t, 9), () => { const x = R.x + R.w - 420; card(g, x, R.y + 260, 380, 300, '白色的羊', ['x：白色的东西（雪、云、白羊…）', 'y：所有的羊（黑羊、白羊…）', 'x y：两者都是'], C.gold, 1); });
};

AN.xx = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '奇怪的规律：x · x = x', '白色的东西里再挑白色的，还是那些东西');
    al(g, pop(st.tk, .3), () => eq(g, 'x · x = x', cx - 300, R.y + 330, C.gold, 84));
    const N = [0, 1, 2, 3];
    N.forEach((n, i) => al(g, pop(st.tk, 4 + i * .9), () => { const y = R.y + 470 + i * 72, ok = n * n === n; txt(g, `${n} × ${n} = ${n * n}`, cx - 450, y, C.fg, fnt(700, 34, 'mono')); txt(g, ok ? '满足' : '不满足', cx - 160, y, ok ? C.ok : C.bad, fnt(700, 30)); }));
    al(g, pop(st.tk, 9), () => { rr(g, cx + 120, R.y + 460, 520, 260, 18, 'rgba(14,20,36,.95)', C.gold, 2); txt(g, '1 = 全体', cx + 160, R.y + 540, C.fg, fnt(800, 40, 'serif')); txt(g, '0 = 空无一物', cx + 160, R.y + 630, C.fg, fnt(800, 40, 'serif')); });
    return;
  }
  hdr(g, R, '矛盾律变成一行代数', '没有任何东西既是 x 又不是 x');
  const L = ['x · x = x', 'x − x · x = 0', 'x · (1 − x) = 0'];
  L.forEach((s, i) => al(g, pop(st.tk, .3 + i * 1.6), () => eq(g, s, R.x + 360, R.y + 290 + i * 120, i === 2 ? C.gold : C.fg, 60)));
  const vx = R.x + R.w - 380, vy = R.y + 470;
  al(g, pop(st.tk, 5), () => { rr(g, vx - 260, vy - 220, 520, 440, 16, 'rgba(92,180,255,.06)', C.b, 2); txt(g, '1 − x：不是 x 的', vx + 120, vy - 180, C.b, fnt(700, 24), 'center'); g.fillStyle = '#070A12'; g.beginPath(); g.arc(vx - 60, vy + 10, 150, 0, TAU); g.fill(); g.strokeStyle = C.fg; g.lineWidth = 3; g.stroke(); txt(g, 'x', vx - 60, vy + 10, C.fg, fnt(900, 50, 'serif'), 'center'); txt(g, '交集 = 0', vx, vy + 190, C.gold, fnt(800, 30), 'center'); });
};

AN.syllog = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '三段论变成解方程', '');
    const x = R.x + 80, y = R.y + 250;
    [['所有的人都会死', 'h = h · m'], ['苏格拉底是人', 's = s · h'], ['所以苏格拉底会死', 's = s · h · m = s · m']].forEach(([a, b], i) => al(g, pop(st.tk, .3 + i * 2.2), () => { txt(g, a, x, y + i * 120, i === 2 ? C.gold : C.fg, fnt(700, 34)); txt(g, b, x + 380, y + i * 120, i === 2 ? C.gold : C.fg2, fnt(700, 34, 'serif')); }));
    al(g, pop(st.tk, 1), () => { txt(g, 'm：会死的　h：人　s：苏格拉底', x, y + 400, C.fg3, fnt(600, 24)); });
    const cx = R.x + R.w - 300, cy = R.y + 470;
    al(g, pop(st.tk, .5), () => { g.strokeStyle = C.r; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, 230, 0, TAU); g.stroke(); txt(g, '会死的', cx, cy - 200, C.r, fnt(700, 24), 'center'); });
    al(g, pop(st.tk, 2.5), () => { g.strokeStyle = C.b; g.beginPath(); g.arc(cx, cy + 40, 140, 0, TAU); g.stroke(); txt(g, '人', cx, cy - 70, C.b, fnt(700, 24), 'center'); });
    al(g, pop(st.tk, 4.5), () => { dot(g, cx, cy + 70, 14, C.gold); txt(g, '苏格拉底', cx, cy + 110, C.gold, fnt(700, 24), 'center'); });
    return;
  }
  hdr(g, R, '布尔代数说不清的话', '“每个人都有一位母亲”');
  const P = [[R.x + 200, R.y + 640], [R.x + 420, R.y + 460], [R.x + 640, R.y + 640], [R.x + 860, R.y + 460], [R.x + 1080, R.y + 640]];
  P.forEach(([x, y], i) => al(g, pop(st.tk, .3 + i * .4), () => { person(g, x, y, i % 2 ? C.r : C.b, 1.5); }));
  for (let i = 0; i < 4; i++) al(g, pop(st.tk, 2.5 + i * .5), () => { const [a, b] = [P[i + 1], P[i]]; arrow(g, a[0] - 20, a[1] + 20, b[0] + 30, b[1] - 40, C.gold, 3); txt(g, '母亲', (a[0] + b[0]) / 2 + 30, (a[1] + b[1]) / 2 - 20, C.gold, fnt(600, 20), 'center'); });
  const x = R.x + R.w - 420;
  al(g, pop(st.tk, 6), () => { card(g, x, R.y + 240, 380, 340, '缺了什么', ['关系：“y 是 x 的母亲”', '量词：“每一个”“存在一个”', '→ 这要等弗雷格'], C.r, 1); });
};

AN.relay = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '1937：香农的硕士论文', '《继电器与开关电路的符号分析》');
    medal(g, R.x + 220, R.y + 380, 110, '香', '克劳德·香农', '1916 – 2001', C.o, pop(st.tk, .3));
    al(g, pop(st.tk, 2), () => { const x = R.x + 420, y = R.y + 260; rr(g, x, y, 300, 260, 14, 'rgba(14,20,36,.95)', C.o, 2); // 继电器
      g.strokeStyle = C.o; g.lineWidth = 3; for (let i = 0; i < 8; i++) { g.beginPath(); g.ellipse(x + 90, y + 60 + i * 18, 40, 9, 0, 0, TAU); g.stroke(); }
      const op = Math.sin(st.tk * 3) > 0; line(g, [[x + 170, y + 210], [x + 270, op ? y + 170 : y + 205]], C.fg, 5); dot(g, x + 170, y + 210, 7, C.fg); txt(g, '继电器', x + 150, y + 300, C.fg2, fnt(600, 24), 'center'); });
    al(g, pop(st.tk, 4), () => { eq(g, '开关电路 = 布尔代数', R.x + R.w - 290, R.y + 400, C.gold, 42); txt(g, '闭合 = 1　断开 = 0', R.x + R.w - 290, R.y + 480, C.fg2, fnt(600, 28), 'center'); });
    return;
  }
  hdr(g, R, '与 · 或 · 非', '串联、并联和反向开关');
  const ph = Math.floor(st.tk / 2.2) % 4, A = ph >> 1 & 1, B = ph & 1, y = R.y + 330;
  const sw = (x, y, on, lab) => { dot(g, x, y, 7, C.fg); dot(g, x + 70, y, 7, C.fg); line(g, [[x, y], on ? [x + 70, y] : [x + 60, y - 36]], on ? C.ok : C.fg2, 5); txt(g, lab + '=' + (on ? 1 : 0), x + 35, y + 36, on ? C.ok : C.fg3, fnt(700, 22, 'mono'), 'center'); };
  const lamp = (x, y, on) => { if (on) glow(g, x, y, 80, 'rgba(255,210,122,.7)'); dot(g, x, y, 28, on ? C.gold : '#2A3040'); };
  // 串联：与
  const x0 = R.x + 80; txt(g, '串联 = 与（A · B）', x0, y - 90, C.fg, fnt(800, 30));
  line(g, [[x0, y], [x0 + 60, y]], C.fg3, 3); sw(x0 + 60, y, A, 'A'); line(g, [[x0 + 130, y], [x0 + 190, y]], C.fg3, 3); sw(x0 + 190, y, B, 'B'); line(g, [[x0 + 260, y], [x0 + 330, y]], C.fg3, 3); lamp(x0 + 360, y, A && B);
  // 并联：或
  const x1 = R.x + R.w / 2 - 60; txt(g, '并联 = 或（A + B）', x1, y - 90, C.fg, fnt(800, 30));
  line(g, [[x1, y + 40], [x1 + 60, y + 40]], C.fg3, 3); line(g, [[x1 + 60, y], [x1 + 60, y + 80]], C.fg3, 3); sw(x1 + 60, y, A, 'A'); sw(x1 + 60, y + 80, B, 'B'); line(g, [[x1 + 130, y], [x1 + 130, y + 80]], C.fg3, 3); line(g, [[x1 + 130, y + 40], [x1 + 200, y + 40]], C.fg3, 3); lamp(x1 + 230, y + 40, A || B);
  // 非
  const x2 = R.x + R.w - 300; txt(g, '非（1 − A）', x2, y - 90, C.fg, fnt(800, 30)); sw(x2, y, A, 'A'); lamp(x2 + 160, y, !A); txt(g, '常闭开关：A 合上，灯反而灭', x2 - 60, y + 100, C.fg3, fnt(600, 20));
  // 真值表
  const tx = R.x + 160, ty = R.y + 560;
  txt(g, 'A　B　|　与　或', tx, ty, C.fg2, fnt(700, 28, 'mono'));
  for (let i = 0; i < 4; i++) { const a = i >> 1 & 1, b = i & 1, on = i === ph; txt(g, `${a}　${b}　|　${a & b}　 ${a | b}`, tx, ty + 50 + i * 44, on ? C.gold : C.fg3, fnt(700, 28, 'mono')); }
};

AN.adder = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '用门做加法：半加器', '和 = A 异或 B　进位 = A 与 B');
    const ph = Math.floor(st.tk / 2) % 4, A = ph >> 1 & 1, B = ph & 1, x = R.x + 140, y = R.y + 300;
    txt(g, 'A = ' + A, x, y, A ? C.gold : C.fg3, fnt(800, 34, 'mono')); txt(g, 'B = ' + B, x, y + 200, B ? C.gold : C.fg3, fnt(800, 34, 'mono'));
    node(g, x + 300, y - 50, 200, 100, '异或', C.b); node(g, x + 300, y + 150, 200, 100, '与', C.r);
    [[y, y], [y + 200, y], [y, y + 200], [y + 200, y + 200]].forEach(([a, b]) => line(g, [[x + 150, a], [x + 300, b]], C.fg3, 3));
    arrow(g, x + 500, y, x + 640, y, C.fg3, 3); arrow(g, x + 500, y + 200, x + 640, y + 200, C.fg3, 3);
    txt(g, '和 S = ' + (A ^ B), x + 660, y, A ^ B ? C.gold : C.fg3, fnt(800, 34, 'mono')); txt(g, '进位 C = ' + (A & B), x + 660, y + 200, A & B ? C.gold : C.fg3, fnt(800, 34, 'mono'));
    txt(g, `${A} + ${B} = ${A & B}${A ^ B}（二进制）`, x + 300, y + 360, C.fg, fnt(700, 32, 'mono'));
    // 四位加法
    al(g, pop(st.tk, 9), () => { const bx = R.x + R.w - 420, by = R.y + 260; rr(g, bx, by, 380, 330, 16, 'rgba(14,20,36,.94)', C.gold, 2); txt(g, '串起来：多位加法', bx + 24, by + 44, C.gold, fnt(700, 26)); txt(g, '  0110   (6)', bx + 40, by + 120, C.fg, fnt(700, 32, 'mono')); txt(g, '+ 0011   (3)', bx + 40, by + 175, C.fg, fnt(700, 32, 'mono')); line(g, [[bx + 40, by + 205], [bx + 240, by + 205]], C.fg3, 2); txt(g, '  1001   (9)', bx + 40, by + 245, C.gold, fnt(800, 32, 'mono')); });
    return;
  }
  hdr(g, R, '芯片里的布尔', '上百亿个晶体管 = 布尔代数的门');
  const cx = R.x + R.w * .42, cy = R.y + 480, z = 1 + SS(st.tk / 8) * 3;
  g.save(); g.beginPath(); g.rect(R.x + 40, R.y + 150, R.w * .64, 680); g.clip();
  rr(g, cx - 240 * z, cy - 240 * z, 480 * z, 480 * z, 20, '#10182A', C.b, 3);
  for (let i = 0; i < 24; i++) for (let j = 0; j < 24; j++) { const x = cx - 220 * z + i * 19 * z, y = cy - 220 * z + j * 19 * z; if (HSH(i, j) > .3) rr(g, x, y, 15 * z, 15 * z, 2, `rgba(92,180,255,${.15 + HSH(j, i) * .35})`); }
  g.restore();
  medal(g, R.x + R.w - 240, R.y + 380, 100, '布', '布尔', '1815 – 1864', C.g, pop(st.tk, 4));
  al(g, pop(st.tk, 6), () => txt(g, '他对此一无所知', R.x + R.w - 240, R.y + 600, C.fg3, fnt(600, 24), 'center'));
};

AN.quant = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '戈特洛布·弗雷格', '耶拿大学 · 1879 年《概念文字》');
    medal(g, R.x + 220, R.y + 380, 120, '弗', '弗雷格', '1848 – 1925', C.p, pop(st.tk, .3));
    book(g, R.x + 520, R.y + 230, 330, 440, 'Begriffsschrift（概念文字）', '1879', C.p, pop(st.tk, 2));
    al(g, pop(st.tk, 4), () => { txt(g, '亚里士多德之后', R.x + 1000, R.y + 380, C.fg2, fnt(600, 30)); txt(g, '逻辑学最重要的一本书', R.x + 1000, R.y + 440, C.gold, fnt(800, 36)); });
    return;
  }
  hdr(g, R, '量词：对所有的 ∀，存在某个 ∃', '加上关系，几乎所有数学说法都写得出来');
  const x = R.x + 80;
  [['∀x ∃y  母亲(y, x)', '每个人 x，都存在某个 y，y 是 x 的母亲'], ['∀n ∃m  (m > n)', '每个自然数后面都还有一个更大的数'], ['∃x ∀y  (x ≤ y)', '存在一个数，不大于所有数（最小的自然数 0）']].forEach(([a, b], i) => al(g, pop(st.tk, .5 + i * 3), () => { const y = R.y + 280 + i * 190; rr(g, x, y - 60, R.w - 160, 150, 16, 'rgba(14,20,36,.94)', C.p, 2); txt(g, a, x + 40, y, C.gold, fnt(700, 44, 'serif')); txt(g, b, x + 40, y + 55, C.fg2, fnt(600, 26)); }));
};

AN.begriff = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '推理规则：证明可以机械地检查', '肯定前件：由 A 和“若 A 则 B”，得到 B');
    const x = R.x + 120, y = R.y + 250;
    const L = [['1', 'A', '前提'], ['2', 'A → B', '前提'], ['3', 'B', '由 1、2，肯定前件'], ['4', 'B → C', '前提'], ['5', 'C', '由 3、4，肯定前件']];
    L.forEach(([n, f, why], i) => al(g, pop(st.tk, .3 + i * 1.2), () => { const yy = y + i * 90; txt(g, n, x, yy, C.fg3, fnt(700, 30, 'mono')); txt(g, f, x + 70, yy, C.fg, fnt(700, 40, 'serif')); txt(g, why, x + 420, yy, C.fg2, fnt(600, 26)); ticks(g, x + 780, yy, pop(st.tk, 7 + i * .5)); }));
    al(g, pop(st.tk, 7), () => { rr(g, R.x + R.w - 400, R.y + 300, 360, 220, 16, 'rgba(14,20,36,.95)', C.ok, 2); txt(g, '检查者', R.x + R.w - 220, R.y + 350, C.ok, fnt(800, 30), 'center'); wrapTxt(g, '只看符号形状，不需要直觉', R.x + R.w - 370, R.y + 420, 300, 34, C.fg2, fnt(600, 24)); });
    return;
  }
  hdr(g, R, '画在纸上的二维记号', '弗雷格的“若 A 则 B”（示意）');
  const x = R.x + 200, y = R.y + 320, u = SS(st.tk / 3);
  g.save(); g.strokeStyle = C.fg; g.lineWidth = 4;
  g.beginPath(); g.moveTo(x, y - 30); g.lineTo(x, y + 30); g.stroke();
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + 400 * u, y); g.stroke();
  if (u > .4) { g.beginPath(); g.moveTo(x + 150, y); g.lineTo(x + 150, y + 140); g.lineTo(x + 400, y + 140); g.stroke(); }
  g.restore();
  al(g, pop(st.tk, 2), () => { txt(g, 'B', x + 430, y, C.gold, fnt(800, 48, 'serif')); txt(g, 'A', x + 430, y + 140, C.gold, fnt(800, 48, 'serif')); txt(g, '= 若 A 则 B', x + 560, y + 70, C.fg2, fnt(700, 34)); });
  al(g, pop(st.tk, 5), () => { const yy = R.y + 640; ['弗雷格的逻辑', '一阶逻辑', '证明助手', '编程语言'].forEach((s, i) => { chip(g, s, R.x + 120 + i * 300, yy, [C.p, C.b, C.g, C.gold][i], 1, 26); if (i < 3) arrow(g, R.x + 120 + i * 300 + 220, yy, R.x + 120 + (i + 1) * 300 - 20, yy, C.fg3, 3); }); txt(g, '当时几乎没人读，却成了它们的祖先', R.x + 120, yy + 80, C.fg3, fnt(600, 24)); });
};

AN.logicism = (g, t, R, st) => {
  hdr(g, R, '雄心：算术 = 纯逻辑', '');
  const cx = R.x + R.w * .33, by = R.y + 760;
  const L = [['逻辑', C.p], ['自然数', C.b], ['分数', C.b], ['实数', C.g], ['微积分', C.gold]];
  L.forEach(([s, col], i) => al(g, pop(t, .5 + i * .9), () => { const w = 520 - i * 80, y = by - i * 110; rr(g, cx - w / 2, y - 90, w, 90, 10, 'rgba(14,20,36,.95)', col, 3); txt(g, s, cx, y - 45, C.fg, fnt(800, 32), 'center'); }));
  const bx = R.x + R.w * .62, W = (R.w * .38 - 40) / 3;
  [['算术基础', '1884'], ['算术的基本规律 I', '1893'], ['算术的基本规律 II', '1903 付印中']].forEach(([a, b], i) => book(g, bx + i * W, R.y + 280, W - 20, 340, a, b, i === 2 ? C.r : C.p, pop(t, 6 + i * 1.5)));
};

AN.russell = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '1902 年 6 月：一封信', '罗素 → 弗雷格');
    const cx = R.x + R.w / 2, cy = R.y + 470, u = SS(st.tk / 2.5);
    rr(g, cx - 380, cy - 220, 760, 440, 10, '#E8DFC8', '#B9A77A', 2);
    g.save(); g.beginPath(); g.rect(cx - 380, cy - 220, 760, 440 * u); g.clip();
    ['亲爱的同事：', '我在您的著作中发现了一个困难……', '设 w 为所有不以自身为元素的', '谓词（集合）……', '—— 伯特兰·罗素'].forEach((s, i) => txt(g, s, cx - 330, cy - 150 + i * 72, '#3A2E1A', fnt(600, 32, 'serif')));
    g.restore();
    return;
  }
  hdr(g, R, '罗素悖论', 'R = 所有不包含自己的集合');
  const x0 = R.x + 80, y0 = R.y + 300;
  const S = ['{1, 2}', '所有猫', '偶数集'];
  S.forEach((s, i) => al(g, pop(st.tk, .3 + i * .6), () => { const x = x0 + 40 + i * 190; g.strokeStyle = C.b; g.lineWidth = 3; g.beginPath(); g.arc(x + 70, y0 + 80, 70, 0, TAU); g.stroke(); txt(g, s, x + 70, y0 + 80, C.fg, fnt(700, 22), 'center'); }));
  al(g, pop(st.tk, 2), () => { txt(g, '它们都不包含自己 → 都放进 R', x0 + 40, y0 + 280, C.fg2, fnt(600, 24)); g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); g.ellipse(x0 + 320, y0 + 80, 330, 140, 0, 0, TAU); g.stroke(); txt(g, 'R', x0 + 640, y0 - 40, C.gold, fnt(900, 44, 'serif')); });
  // 来回翻转
  const fx = R.x + R.w - 440, fy = R.y + 560;
  al(g, pop(st.tk, 5), () => { rr(g, fx, fy - 260, 400, 420, 18, 'rgba(14,20,36,.95)', C.r, 2); txt(g, 'R 包含 R 吗？', fx + 200, fy - 210, C.fg, fnt(800, 32), 'center');
    const f = Math.floor((st.tk - 6) / 1.3) % 2; if (st.tk > 6) { txt(g, f ? '不包含' : '包含', fx + 200, fy - 100, f ? C.b : C.gold, fnt(800, 44), 'center'); txt(g, '⇒', fx + 200, fy - 30, C.fg3, fnt(800, 40), 'center'); txt(g, f ? '那它就该包含' : '那它就不该包含', fx + 200, fy + 40, C.r, fnt(700, 30), 'center'); }
    txt(g, '怎么回答都矛盾', fx + 200, fy + 120, C.bad, fnt(700, 26), 'center'); });
};

AN.barber = (g, t, R, st) => {
  hdr(g, R, '理发师悖论', '他只给所有“不给自己刮脸”的人刮脸');
  const cx = R.x + R.w * .4, cy = R.y + 500;
  const vill = 7; for (let i = 0; i < vill; i++) { const a = -Math.PI / 2 + (i - 3) * .42, x = cx + Math.cos(a) * 360 + 0, y = cy + 260 + Math.sin(a) * 300; al(g, pop(t, .3 + i * .2), () => { person(g, x, y, C.fg2, 1.2); arrow(g, cx, cy, LERP(cx, x, .78), LERP(cy, y - 20, .78), C.b, 2, 10, .7); }); }
  al(g, pop(t, 1), () => { person(g, cx, cy, C.gold, 1.8); txt(g, '理发师', cx, cy + 70, C.gold, fnt(800, 28), 'center'); });
  al(g, pop(t, 4), () => { const f = Math.floor(t / 1.2) % 2; g.save(); g.strokeStyle = f ? C.r : C.gold; g.lineWidth = 4; g.setLineDash([8, 8]); g.beginPath(); g.arc(cx, cy - 90, 50, Math.PI * .1, Math.PI * 1.9); g.stroke(); g.restore(); txt(g, '给自己刮？', cx, cy - 170, f ? C.r : C.gold, fnt(800, 30), 'center'); });
  al(g, pop(t, 5), () => { const x = R.x + R.w - 440; card(g, x, R.y + 260, 400, 340, '两头都不行', ['刮：他就成了“给自己刮脸的人”，不该刮', '不刮：他属于“不给自己刮的人”，就该刮'], C.r, 1); });
};

AN.aftermath = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '矛盾能推出一切', '弗雷格匆忙加写的附录');
    const x = R.x + 120, y = R.y + 230, crack = SS((st.tk - 1) / 3);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 6 - r; c++) { const bx = x + r * 40 + c * 80, by = y + 360 - r * 66, off = crack * (c >= 3 - r / 2 ? 1 : -1) * (6 + r * 3); rr(g, bx + off, by + crack * r * 4, 76, 60, 4, 'rgba(199,155,255,.12)', C.p, 2); }
    if (crack > 0) line(g, [[x + 250, y + 430], [x + 240, y + 330], [x + 270, y + 260], [x + 250, y + 140]], C.bad, 4);
    quote(g, R.x + R.w * .42, R.y + 240, R.w * .56, '一位科学家最不幸的事，莫过于在工作完成之际，发现大厦的根基动摇了。', '弗雷格，1903', C.gold, pop(st.tk, 3), 30);
    return;
  }
  hdr(g, R, '修补根基', '');
  const W = (R.w - 60) / 3;
  [['1908', '策梅洛的集合论公理', ['不再允许任意性质都构成集合', '后来发展成 ZF 公理系统'], C.b], ['1910–1913', '罗素与怀特海《数学原理》', ['三大卷，用类型论避开悖论', '证明 1 + 1 = 2 要几百页铺垫'], C.gold], ['1925', '弗雷格去世', ['晚年愤懑偏激', '去世时几乎无人知晓，后来才被尊为现代逻辑之父'], C.p]].forEach(([y, h, ls, col], i) => al(g, pop(st.tk, .3 + i * 2), () => { const x = R.x + i * (W + 30); rr(g, x, R.y + 230, W, 480, 18, 'rgba(14,20,36,.94)', col, 2); txt(g, y, x + 28, R.y + 290, col, fnt(800, 34, 'mono')); wrapTxt(g, h, x + 28, R.y + 360, W - 56, 38, C.fg, fnt(800, 28)); ls.forEach((l, j) => wrapTxt(g, '· ' + l, x + 28, R.y + 470 + j * 100, W - 56, 32, C.fg2, fnt(600, 23))); }));
};

AN.recap1 = (g, t, R, st) => {
  hdr(g, R, st.k === 0 ? '第一集回顾' : '下一集：无穷与危机', '');
  const it = [['莱布尼茨', '能计算的语言', C.b], ['布尔', '逻辑 = 代数 → 电路', C.g], ['弗雷格', '完整的逻辑语言', C.p], ['罗素悖论', '根基出现裂缝', C.r]];
  const w = (R.w - 3 * 30) / 4;
  it.forEach(([a, b, col], i) => { const u = pop(st.k === 0 ? t : 99, .5 + i * 1.5), x = R.x + i * (w + 30), y = R.y + 200; al(g, u * (st.k === 1 ? .4 : 1), () => { rr(g, x, y, w, 260, 18, 'rgba(14,20,36,.92)', col, 2); txt(g, a, x + w / 2, y + 90, col, fnt(800, 34), 'center'); txt(g, b, x + w / 2, y + 160, C.fg, fnt(600, 25), 'center'); }); });
  if (st.k === 1) al(g, pop(st.tk, .4, 1), () => { const cx = R.x + R.w / 2; txt(g, '∞', cx, R.y + 640, C.gold, fnt(900, 150, 'serif'), 'center'); txt(g, '康托尔 · 希尔伯特 · 哥德尔', cx, R.y + 770, C.fg2, fnt(700, 30), 'center'); });
};
