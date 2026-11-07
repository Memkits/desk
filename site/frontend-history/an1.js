// 公共画法 + 上集动画：从文档到应用
const YR0 = 1989, YR1 = 2027;
// 名字墙：groups = [[标题, 颜色, [名字...], 出现于第几个 beat]]
function wall(g, t, R, st, groups, opt = {}) {
  const top = R.y + (opt.top ?? 110), rowH = opt.rowH ?? 118, fs = opt.fs ?? 22;
  groups.forEach(([h, col, items, kk = 0], gi) => {
    if (st.k < kk) return; const base = st.k === kk ? st.tk : 99, y = top + gi * rowH;
    const u = pop(kk === 0 && st.k === 0 ? t : base, .2);
    g.save(); g.globalAlpha = u; txt(g, h, R.x + 20, y, col, fnt(800, 26)); g.restore();
    let x = R.x + (opt.labelW ?? 230), yy = y; g.font = fnt(700, fs);
    items.forEach((s, i) => { const w = g.measureText(s).width + 32; if (x + w > R.x + R.w - 10) { x = R.x + (opt.labelW ?? 230); yy += fs * 2.1; } const v = pop(kk === 0 && st.k === 0 ? t : base, .4 + i * .18); g.save(); g.globalAlpha = v; g.translate(0, (1 - v) * 10); chip(g, s, x, yy, col, 1, fs); g.restore(); x += w + 14; });
  });
}
// 存活时间条：rows = [名字, 起, 止, 原因, beat]
function lifespans(g, t, R, st, rows, title, sub, A = YR0, B = YR1, ticks = [1990, 2000, 2010, 2020]) {
  hdr(g, R, title, sub);
  const x0 = R.x + 330, x1 = R.x + R.w - 30, X = y => LERP(x0, x1, (y - A) / (B - A)), y0 = R.y + 120;
  ticks.forEach(y => { line(g, [[X(y), y0 - 10], [X(y), R.y + R.h - 20]], C.line, 1, [4, 6]); txt(g, String(y), X(y), y0 - 26, C.fg3, fnt(600, 18, 'mono'), 'center'); });
  const n = rows.length, rh = Math.min(64, (R.h - 150) / n);
  rows.forEach(([name, a, b, why, kk = 0], i) => {
    if (st.k < kk) return; const u = pop(st.k === kk ? (kk === 0 ? t : st.tk) : 99, .3 + (i - rows.findIndex(r => (r[4] || 0) === kk)) * .3, .7), y = y0 + 10 + i * rh;
    g.save(); g.globalAlpha = Math.min(1, u * 2); txt(g, name, x0 - 16, y + rh * .35, C.fg, fnt(700, Math.min(22, rh * .42)), 'right');
    const w = (X(b) - X(a)) * SS(u); rr(g, X(a), y + rh * .12, Math.max(4, w), rh * .46, 6, 'rgba(255,122,147,.35)', C.r, 1.5);
    if (u > .95) { const right = X(b) > x1 - 260; txt(g, why, right ? X(a) - 12 : X(b) + 10, y + rh * .35, C.fg3, fnt(500, Math.min(19, rh * .36)), right ? 'right' : 'left', 'middle'); }
    g.restore(); });
}
// 横向时间轴
function events(g, t, R, E, opt = {}) {
  const x0 = R.x + 50, x1 = R.x + R.w - (opt.pad ?? 90), y = R.y + (opt.y ?? 360);
  line(g, [[x0, y], [x0 + (x1 - x0) * SS(t / 2), y]], C.line2, 4);
  E.forEach(([d, a, b, col], i) => { const u = pop(t, .3 + i * (opt.gap ?? .5)); if (u <= 0) return; const x = LERP(x0, x1, i / (E.length - 1)), up = i % 2 === 0;
    g.save(); g.globalAlpha = u; dot(g, x, y, 10, col || C.b); line(g, [[x, y], [x, up ? y - 60 : y + 60]], C.line2, 2); const yy = up ? y - 150 : y + 100;
    txt(g, d, x, yy, col || C.b, fnt(800, 26, 'mono'), 'center'); txt(g, a, x, yy + 38, C.fg, fnt(700, 23), 'center'); if (b) txt(g, b, x, yy + 70, C.fg3, fnt(500, 18), 'center'); g.restore(); });
}
function flowBoxes(g, t, R, items, y, opt = {}) {
  const n = items.length, gap = 40, w = (R.w - 40 - gap * (n - 1)) / n;
  items.forEach(([a, b, col], i) => { const u = pop(t, (opt.t0 ?? .3) + i * (opt.gap ?? .8)); const x = R.x + 20 + i * (w + gap); node(g, x, y, w, opt.h ?? 120, a, col, u, b); if (i < n - 1) arrow(g, x + w + 4, y + (opt.h ?? 120) / 2, x + w + gap - 4, y + (opt.h ?? 120) / 2, C.fg3, 3, 10, pop(t, (opt.t0 ?? .3) + i * (opt.gap ?? .8) + .4)); });
}

// ---------- 片头总时间轴（三集共用）----------
AN.axis = (g, t, R, st) => {
  const x0 = R.x + 40, x1 = R.x + R.w - 40, y = R.y + 380, X = v => LERP(x0, x1, (v - 1990) / 36);
  const segs = [[1990, 2010, '上集 · 从文档到应用', C.b], [2010, 2020, '中集 · 框架与工程化', C.g], [2016, 2026, '下集 · 钟摆、新平台与 AI', C.gold]];
  line(g, [[x0, y], [x0 + (x1 - x0) * SS(t / 2), y]], C.line2, 5);
  for (let v = 1990; v <= 2026; v += 1) { const u = pop(t, .2 + (v - 1990) * .04); if (u <= 0) continue; const big = v % 5 === 0; line(g, [[X(v), y - (big ? 14 : 6)], [X(v), y + (big ? 14 : 6)]], C.fg3, big ? 2 : 1); if (big) { g.save(); g.globalAlpha = u; txt(g, String(v), X(v), y + 40, C.fg3, fnt(600, 20, 'mono'), 'center'); g.restore(); } }
  const M = [[1990, '第一个浏览器'], [1995, 'JavaScript'], [2006, 'jQuery'], [2009, 'Node.js'], [2013, 'React'], [2016, 'Next.js'], [2020, 'Vite'], [2022, 'ChatGPT']];
  M.forEach(([v, s], i) => { const u = pop(t, 1.5 + i * .3); g.save(); g.globalAlpha = u; dot(g, X(v), y, 8, C.fg); txt(g, s, X(v), y - 46 - (i % 2) * 34, C.fg2, fnt(600, 20), 'center'); g.restore(); });
  segs.forEach(([a, b, s, col], i) => { const hot = typeof EP !== 'undefined' ? EP === i + 1 : true, show = st.k >= 1 || EP > 1, u = show ? pop(st.k >= 1 ? st.tk : t, .3 + i * .5) : 0; if (u <= 0) return;
    g.save(); g.globalAlpha = u * (hot ? 1 : .35); const yy = y + 90 + i * 70; rr(g, X(a), yy, X(b) - X(a), 44, 10, hot ? col + '33' : 'rgba(255,255,255,.03)', col, hot ? 3 : 1.5); txt(g, s, X(a) + 16, yy + 22, hot ? C.fg : C.fg2, fnt(700, 22)); g.restore(); });
  if (st.k >= 2 || (EP > 1 && t > 3)) { const u = pop(st.k >= 2 ? st.tk : t - 3, .3); g.save(); g.globalAlpha = u; txt(g, '在一个为“文档”设计的平台上，造出“应用”', R.x + R.w / 2, R.y + 120, C.gold, fnt(800, 38), 'center'); g.restore(); }
};
// ---------- 01 文档与链接 ----------
AN.web = (g, t, R) => {
  const P = [[R.x + 200, R.y + 200], [R.x + 640, R.y + 140], [R.x + 1080, R.y + 260], [R.x + 380, R.y + 520], [R.x + 860, R.y + 560], [R.x + 1300, R.y + 480]].map(([x, y]) => [Math.min(x, R.x + R.w - 150), y]);
  const L = [[0, 1], [1, 2], [0, 3], [3, 4], [4, 2], [2, 5], [4, 5]];
  L.forEach(([a, b], i) => { const u = pop(t, 1.5 + i * .35); if (u <= 0) return; g.save(); g.globalAlpha = u; line(g, [P[a], P[b]], C.b, 2, [8, 6]); g.restore(); const ph = ((t * .3 + i * .17) % 1); if (u > .9) packet(g, [P[a], P[b]], ph, C.gold, 6); });
  P.forEach(([x, y], i) => { const u = pop(t, .3 + i * .2); g.save(); g.globalAlpha = u; rr(g, x - 70, y - 50, 140, 100, 10, 'rgba(14,20,36,.95)', C.fg2, 2); for (let k = 0; k < 4; k++) rr(g, x - 50, y - 30 + k * 18, k === 1 ? 60 : 100, 6, 3, k === 1 ? C.b : C.line2); txt(g, ['CERN', '日内瓦', '斯坦福', '东京', '剑桥', '……'][i], x, y + 72, C.fg3, fnt(600, 18), 'center'); g.restore(); });
  g.save(); g.globalAlpha = pop(t, 4); txt(g, '文档在不同电脑上 · 格式各异 · 需要互相跳转', R.x + R.w / 2, R.y + R.h - 40, C.fg2, fnt(700, 26), 'center'); g.restore();
};
AN.browsers = (g, t, R, st) => {
  hdr(g, R, '早期浏览器');
  const B = [['1990', 'WorldWideWeb', 'NeXT · 可编辑', C.fg2], ['1991', 'Line Mode', '命令行', C.fg3], ['1992', 'Lynx / Viola', '文本 / 图形', C.fg3], ['1993', 'NCSA Mosaic', '图片进入正文', C.b], ['1994', 'Netscape', 'Navigator 1.0', C.g]];
  const w = (R.w - 40 - 4 * 20) / 5;
  B.forEach(([y, a, b, col], i) => { const u = pop(t, .3 + i * .6), x = R.x + 20 + i * (w + 20), Y = R.y + 130; g.save(); g.globalAlpha = u; rr(g, x, Y, w, 300, 16, 'rgba(14,20,36,.92)', col, i === 3 ? 3 : 2);
    rr(g, x + 14, Y + 14, w - 28, 160, 8, '#0B1020', C.line2); if (i >= 3) { rr(g, x + 26, Y + 30, w * .4, 70, 6, i === 3 ? 'rgba(92,180,255,.4)' : 'rgba(95,224,160,.35)'); } for (let k = 0; k < 4; k++) rr(g, x + 26 + (i >= 3 && k < 2 ? w * .45 : 0), Y + 34 + k * 28 + (i >= 3 && k >= 2 ? 40 : 0), (i >= 3 && k < 2 ? w * .35 : w - 60), 8, 3, k === 2 ? C.b : C.line2);
    txt(g, y, x + 20, Y + 210, col, fnt(800, 24, 'mono')); txt(g, a, x + 20, Y + 248, C.fg, fnt(800, 23)); txt(g, b, x + 20, Y + 280, C.fg3, fnt(500, 19)); g.restore(); });
  if (st.k >= 1) { const u = pop(st.tk, .5); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + 500, R.w - 40, 150, 18, 'rgba(14,20,36,.92)', C.line2); txt(g, '这时的网页：可以互相链接的文档', R.x + 50, R.y + 550, C.fg, fnt(800, 30)); txt(g, '标题 · 段落 · 列表 · 链接 · 图片 —— 没有脚本，没有样式表', R.x + 50, R.y + 605, C.fg2, fnt(600, 23)); g.restore(); }
};
// ---------- 02 交互 ----------
AN.formtrip = (g, t, R) => {
  const bx = R.x + 60, sx = R.x + R.w - 360, y = R.y + 180;
  node(g, bx, y, 300, 400, '', C.b, pop(t, .2)); node(g, sx, y, 300, 400, '', C.o, pop(t, .4));
  g.save(); g.globalAlpha = pop(t, .3); txt(g, '浏览器', bx + 150, y + 40, C.b, fnt(800, 28), 'center'); txt(g, '服务器', sx + 150, y + 40, C.o, fnt(800, 28), 'center');
  ['姓名', '邮箱', '电话'].forEach((s, i) => { txt(g, s, bx + 30, y + 110 + i * 70, C.fg2, fnt(600, 22)); rr(g, bx + 100, y + 90 + i * 70, 170, 40, 6, '#0B1020', i === 1 ? C.bad : C.line2); }); rr(g, bx + 100, y + 310, 120, 44, 8, C.b); txt(g, '提交', bx + 160, y + 332, '#0B1020', fnt(800, 22), 'center'); g.restore();
  const cyc = 5, ph = ((t - 1) % cyc) / cyc; if (t > 1) { const go = ph < .45, u = go ? ph / .45 : (ph - .5) / .45; if (ph < .45) packet(g, [[bx + 310, y + 150], [sx - 10, y + 150]], u, C.gold, 12); else if (ph > .5 && ph < .95) packet(g, [[sx - 10, y + 250], [bx + 310, y + 250]], u, C.bad, 12);
    if (ph > .8 || ph < .05) { g.save(); g.globalAlpha = .9; txt(g, '“邮箱没填”—— 整页重新加载', R.x + R.w / 2, y + 470, C.bad, fnt(800, 28), 'center'); g.restore(); } }
  g.save(); g.globalAlpha = pop(t, 1.2); txt(g, '一来一回：几秒钟', R.x + R.w / 2, y + 120, C.fg3, fnt(600, 22), 'center'); g.restore();
};
AN.jsname = (g, t, R, st) => {
  const N = [['Mocha', '1995-05'], ['LiveScript', '1995-09'], ['JavaScript', '1995-12']], cx = R.x + R.w / 2;
  N.forEach(([a, d], i) => { const u = pop(t, .4 + i * 1.2), x = R.x + 60 + i * ((R.w - 120) / 3); g.save(); g.globalAlpha = u * (i === 2 ? 1 : .6); rr(g, x, R.y + 140, (R.w - 120) / 3 - 40, 150, 18, 'rgba(14,20,36,.92)', i === 2 ? C.gold : C.fg3, i === 2 ? 3 : 2); txt(g, a, x + ((R.w - 120) / 3 - 40) / 2, R.y + 200, i === 2 ? C.gold : C.fg2, fnt(800, 38, 'mono'), 'center'); txt(g, d, x + ((R.w - 120) / 3 - 40) / 2, R.y + 254, C.fg3, fnt(600, 20, 'mono'), 'center'); g.restore(); if (i < 2) arrow(g, x + (R.w - 120) / 3 - 34, R.y + 215, x + (R.w - 120) / 3 - 4, R.y + 215, C.fg3, 3, 10, u); });
  g.save(); g.globalAlpha = pop(t, 3); txt(g, 'Brendan Eich · 网景 · 原型约 10 天', cx, R.y + 350, C.fg2, fnt(600, 24), 'center'); g.restore();
  if (st.k >= 1) { const u = pop(st.tk, .3); const Y = R.y + 430; [['JScript', '微软 · IE3', C.b], ['VBScript', '微软', C.p], ['ECMAScript', 'ECMA-262 · 1997', C.g]].forEach(([a, b, col], i) => { g.save(); g.globalAlpha = u * pop(st.tk, .3 + i * .8); const x = R.x + 60 + i * ((R.w - 120) / 3); rr(g, x, Y, (R.w - 120) / 3 - 40, 130, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, x + 30, Y + 50, col, fnt(800, 30, 'mono')); txt(g, b, x + 30, Y + 96, C.fg2, fnt(600, 21)); g.restore(); }); }
};
// ---------- 03 样式 ----------
AN.zen = (g, t, R) => {
  hdr(g, R, 'CSS Zen Garden：同一份 HTML，不同的样式表', '示意');
  const th = [['#1d2b3a', '#FFD27A', C.fg], ['#f2e8d5', '#7a3b2e', '#333'], ['#0d0d0d', '#5FE0A0', '#ccc']];
  const k = Math.floor(t / 2.2) % 3, u = SS((t % 2.2) / .5);
  const x = R.x + R.w / 2 - 380, y = R.y + 130, w = 760, h = 520;
  g.save(); g.globalAlpha = pop(t, .3); rr(g, x - 300, y + 120, 240, 280, 12, 'rgba(14,20,36,.95)', C.line2); txt(g, 'index.html', x - 280, y + 150, C.fg3, fnt(600, 18, 'mono')); ['<h1>', '<p>…', '<ul>', '<li>…', '</ul>'].forEach((s, i) => txt(g, s, x - 280, y + 200 + i * 38, C.fg2, fnt(600, 20, 'mono'))); arrow(g, x - 50, y + 260, x - 10, y + 260, C.fg3, 3, 10); g.restore();
  const [bg, ac, fg] = th[k]; g.save(); g.globalAlpha = pop(t, .6); rr(g, x, y, w, h, 14, bg, C.line2, 2);
  if (k === 0) { rr(g, x + 40, y + 40, w - 80, 90, 10, ac); for (let i = 0; i < 6; i++) rr(g, x + 40, y + 170 + i * 44, w - 300, 14, 5, fg + '88'); rr(g, x + w - 220, y + 170, 180, 280, 10, ac + '55'); }
  else if (k === 1) { txt(g, 'Zen', x + w / 2, y + 110, ac, fnt(900, 80, 'serif'), 'center'); for (let i = 0; i < 6; i++) rr(g, x + 120, y + 200 + i * 44, w - 240, 12, 5, '#33333388'); }
  else { rr(g, x, y, 200, h, 14, ac + '33'); for (let i = 0; i < 6; i++) rr(g, x + 240, y + 60 + i * 60, w - 300, 16, 5, ac + (i ? '66' : 'ff')); }
  g.globalAlpha = 1 - u; rr(g, x, y, w, h, 14, '#070A12'); g.restore();
  txt(g, ['style-1.css', 'style-2.css', 'style-3.css'][k], x + w / 2, y + h + 40, C.gold, fnt(700, 24, 'mono'), 'center');
};
AN.layouts = (g, t, R, st) => {
  hdr(g, R, '同一个三栏页面', '代码量示意');
  const C3 = [['表格 + spacer.gif', C.r, 34, ['<table>', ' <tr><td>…', ' <td><img spacer>', ' <td>…'], 0], ['float + clearfix', C.o, 26, ['.a{float:left}', '.c{margin:0 220px}', '.clearfix:after{…}', '负外边距 …'], 0], ['Flexbox / Grid', C.g, 8, ['display: grid;', 'grid-template-columns:', '  200px 1fr 200px;'], 1]];
  const w = (R.w - 80) / 3;
  C3.forEach(([h, col, lines, code, kk], i) => { if (st.k < kk) return; const u = pop(kk ? st.tk : t, .4 + (kk ? 0 : i * 1.2)), x = R.x + 20 + i * (w + 20), y = R.y + 120; g.save(); g.globalAlpha = u; rr(g, x, y, w, 620, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, h, x + 24, y + 38, col, fnt(800, 26));
    rr(g, x + 24, y + 70, w - 48, 120, 8, '#0B1020', C.line2); rr(g, x + 34, y + 80, w - 68, 22, 4, col + '55'); rr(g, x + 34, y + 110, (w - 68) * .22, 70, 4, col + '33'); rr(g, x + 34 + (w - 68) * .25, y + 110, (w - 68) * .5, 70, 4, col + '22'); rr(g, x + 34 + (w - 68) * .78, y + 110, (w - 68) * .22, 70, 4, col + '33');
    code.forEach((c, j) => txt(g, c, x + 24, y + 230 + j * 34, C.fg2, fnt(600, 19, 'mono'))); txt(g, '代码量', x + 24, y + 420, C.fg3, fnt(600, 20)); rr(g, x + 24, y + 440, (w - 48) * lines / 34 * SS(u), 30, 8, col); txt(g, `约 ${lines} 行（示意）`, x + 24, y + 500, C.fg2, fnt(700, 22)); g.restore(); });
};
// ---------- 04 兼容性 ----------
AN.ie6 = (g, t, R, st) => {
  hdr(g, R, st.k ? '打破垄断' : 'IE6 时代的坑');
  if (st.k === 0) {
    const x = R.x + 40, y = R.y + 140; ['标准盒模型', 'IE 盒模型（怪异模式）'].forEach((h, i) => { const X = x + i * 560, u = pop(t, .4 + i * 1.2); g.save(); g.globalAlpha = u; txt(g, h, X, y, i ? C.bad : C.g, fnt(800, 26));
      const W = i ? 300 : 300 + 2 * 30 + 2 * 6; rr(g, X, y + 40, W, 220, 4, 'rgba(255,178,92,.15)', C.o, 2); rr(g, X + 6, y + 46, W - 12, 208, 4, 'rgba(92,180,255,.12)', C.b, 1); rr(g, X + 36, y + 76, W - 72, 148, 4, 'rgba(95,224,160,.18)', C.g, 1);
      txt(g, i ? 'width: 300px = 全部' : 'width: 300px = 内容', X, y + 300, C.fg2, fnt(600, 22, 'mono')); g.restore(); });
    const L = ['怪异模式 / 标准模式（DOCTYPE 决定）', 'hasLayout', 'PNG 透明不支持', '条件注释 <!--[if IE 6]>'];
    L.forEach((s, i) => { const u = pop(t, 3 + i * .5); g.save(); g.globalAlpha = u; chip(g, s, R.x + 40 + (i % 2) * 560, R.y + 540 + Math.floor(i / 2) * 70, C.bad, 1, 22); g.restore(); });
  } else {
    const yrs = [2002, 2004, 2006, 2008, 2010, 2012, 2014, 2016], ie = [93, 92, 85, 70, 55, 35, 20, 8], ff = [0, 5, 12, 20, 25, 22, 15, 10], ch = [0, 0, 0, 1, 10, 30, 45, 60];
    const x0 = R.x + 80, x1 = R.x + R.w - 220, y0 = R.y + 640, H = 460, X = i => LERP(x0, x1, i / (yrs.length - 1)), Y = v => y0 - v / 100 * H, P = SS(st.tk / 3);
    line(g, [[x0, y0], [x1, y0]], C.line2, 2); yrs.forEach((y, i) => txt(g, String(y), X(i), y0 + 26, C.fg3, fnt(600, 18, 'mono'), 'center'));
    [[ie, C.b, 'IE'], [ff, C.o, 'Firefox'], [ch, C.g, 'Chrome']].forEach(([d, col, n]) => { const pts = d.map((v, i) => [X(i), Y(v)]).slice(0, Math.max(2, Math.ceil(P * d.length))); line(g, pts, col, 4); const l = pts[pts.length - 1]; txt(g, n, l[0] + 14, l[1], col, fnt(800, 24)); });
    txt(g, '浏览器份额（示意，仅表示趋势）', x0, R.y + 130, C.fg3, fnt(500, 20));
  }
};
AN.libs = (g, t, R) => {
  hdr(g, R, '抹平差异的库');
  const L = [['Prototype', 2005, C.fg3], ['Dojo', 2005, C.fg3], ['YUI', 2006, C.fg3], ['MooTools', 2006, C.fg3], ['Ext JS', 2007, C.fg3], ['jQuery', 2006, C.b]];
  L.forEach(([a, y, col], i) => { const u = pop(t, .3 + i * .5), x = R.x + 30 + (i % 3) * ((R.w - 60) / 3), Y = R.y + 140 + Math.floor(i / 3) * 170; g.save(); g.globalAlpha = u * (i === 5 ? 1 : .75); rr(g, x, Y, (R.w - 60) / 3 - 30, 140, 18, i === 5 ? 'rgba(92,180,255,.12)' : 'rgba(14,20,36,.92)', col, i === 5 ? 3.5 : 2); txt(g, a, x + 30, Y + 60, i === 5 ? C.b : C.fg, fnt(800, i === 5 ? 40 : 32, 'mono')); txt(g, String(y), x + 30, Y + 108, C.fg3, fnt(600, 20, 'mono')); g.restore(); });
  g.save(); g.globalAlpha = pop(t, 3.6); rr(g, R.x + 20, R.y + 520, R.w - 40, 130, 18, '#0B1020', C.b, 2); txt(g, "$('#menu li').addClass('on').fadeIn()", R.x + 50, R.y + 570, C.fg, fnt(700, 32, 'mono')); txt(g, 'write less, do more · 选择器 + 链式调用 + 兼容层', R.x + 50, R.y + 620, C.fg3, fnt(600, 22)); g.restore();
};
// ---------- 05 Ajax ----------
AN.ajax = (g, t, R, st) => {
  const k = st.k, x = R.x + 40, w = R.w - 80;
  [['整页刷新', C.r, 0], ['Ajax：局部更新', C.g, 1]].forEach(([h, col, j]) => { const Y = R.y + 120 + j * 300, show = j === 0 || k >= 1, u = show ? pop(j && k === 1 ? st.tk : t, .3) : 0; if (u <= 0) return;
    g.save(); g.globalAlpha = u; txt(g, h, x, Y, col, fnt(800, 26)); rr(g, x, Y + 30, 420, 220, 12, '#0B1020', C.line2); rr(g, x + 20, Y + 50, 380, 30, 6, C.line2); rr(g, x + 20, Y + 96, 120, 134, 6, C.line2);
    const cyc = 3, ph = (t % cyc) / cyc; if (j === 0) { const blank = ph > .4 && ph < .7; rr(g, x + 160, Y + 96, 240, 134, 6, blank ? '#fff' : 'rgba(255,122,147,.2)'); if (blank) rr(g, x, Y + 30, 420, 220, 12, 'rgba(255,255,255,.85)'); }
    else { rr(g, x + 160, Y + 96, 240, 134, 6, ph > .5 ? 'rgba(95,224,160,.35)' : 'rgba(95,224,160,.12)'); packet(g, [[x + 430, Y + 160], [x + 700, Y + 160]], ph < .5 ? ph * 2 : 2 - ph * 2, C.gold, 9); node(g, x + 710, Y + 110, 260, 100, '服务器', C.o, 1, 'XMLHttpRequest'); }
    g.restore(); });
  if (k === 1) { const u = pop(st.tk, 1.5); g.save(); g.globalAlpha = u; ['Gmail 2004', 'Google Maps 2005', '“Ajax” 2005-02'].forEach((s, i) => chip(g, s, x + 720 + 0, R.y + 120 + i * 60, C.gold, 1, 22)); g.restore(); }
  if (k === 2) { wall(g, t, { x: R.x + 600, y: R.y - 20, w: R.w - 600, h: 400 }, { k: 0, tk: st.tk }, [['数据', C.b, ['XML', 'JSON']], ['跨域', C.p, ['JSONP', 'CORS']], ['推送', C.o, ['长轮询', 'Comet', 'WebSocket', 'SSE']]], { labelW: 100, top: 160, rowH: 90 }); }
};
// ---------- 06 插件 ----------
AN.plugins = (g, t, R, st) => {
  const k = st.k; hdr(g, R, k === 2 ? 'HTML5：能力收进标准' : '插件时代');
  const P = [['Flash', 1996, 2020, C.r], ['Java Applet', 1995, 2017, C.o], ['ActiveX', 1996, 2015, C.b], ['Silverlight', 2007, 2021, C.p]];
  P.forEach(([a, b, c, col], i) => { const u = pop(t, .3 + i * .5), x = R.x + 20 + i * ((R.w - 40) / 4), w = (R.w - 40) / 4 - 24, Y = R.y + 120; const dead = k >= 1 ? SS((st.k === 1 ? st.tk : 9) - i * .4) : 0;
    g.save(); g.globalAlpha = u * (1 - dead * .55); rr(g, x, Y, w, 170, 16, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, x + w / 2, Y + 60, col, fnt(800, 30), 'center'); txt(g, `${b} – ${c}`, x + w / 2, Y + 115, C.fg3, fnt(600, 20, 'mono'), 'center'); g.restore(); cross(g, x + w - 26, Y + 26, dead); });
  if (k === 1) { const u = pop(st.tk, 1.5); g.save(); g.globalAlpha = u; ['封闭', '耗电', '安全漏洞', '搜索引擎读不懂', 'iPhone（2007）不支持', '《Thoughts on Flash》（2010）'].forEach((s, i) => chip(g, s, R.x + 20 + (i % 3) * 420, R.y + 380 + Math.floor(i / 3) * 80, C.bad, 1, 22)); g.restore(); }
  if (k === 2) { const L = [['<video>', C.g], ['<canvas>', C.g], ['localStorage', C.b], ['Web Workers', C.b], ['Geolocation', C.p], ['WebSocket', C.p]]; L.forEach(([s, col], i) => { const u = pop(st.tk, .4 + i * .4); g.save(); g.globalAlpha = u; chip(g, s, R.x + 20 + (i % 3) * 420, R.y + 380 + Math.floor(i / 3) * 80, col, 1, 26); g.restore(); }); banner(g, R, 'Flash 停止支持：2020-12-31', pop(st.tk, 4)); }
};
// ---------- 07 引擎 ----------
AN.v8 = (g, t, R, st) => {
  const k = st.k;
  if (k === 0) { hdr(g, R, 'JIT 竞赛（2008–）', '性能曲线为示意');
    const E = [['V8', 'Chrome', C.g], ['TraceMonkey', 'Firefox', C.o], ['Nitro', 'Safari', C.b], ['Chakra', 'IE9', C.p]]; E.forEach(([a, b, col], i) => { const u = pop(t, .4 + i * .4); g.save(); g.globalAlpha = u; chip(g, `${a} · ${b}`, R.x + 20 + i * 300, R.y + 140, col, 1, 22); g.restore(); });
    const x0 = R.x + 60, x1 = R.x + R.w - 60, y0 = R.y + 700, P = SS(t / 6), pts = []; for (let i = 0; i <= 60 * P; i++) { const u = i / 60; pts.push([LERP(x0, x1, u), y0 - 460 * (u < .25 ? u * .2 : .05 + (u - .25) ** 1.6 * 1.4)]); } line(g, [[x0, y0], [x1, y0]], C.line2, 2); if (pts.length > 1) line(g, pts, C.g, 5);
    [['2006', 0], ['2008', .25], ['2010', .5], ['2012', .75]].forEach(([s, u]) => txt(g, s, LERP(x0, x1, u), y0 + 26, C.fg3, fnt(600, 18, 'mono'), 'center')); txt(g, 'JS 执行速度', x0, R.y + 230, C.fg3, fnt(600, 20)); }
  else { hdr(g, R, 'JavaScript 走出浏览器');
    const cx = R.x + R.w / 2, cy = R.y + 430; node(g, cx - 130, cy - 60, 260, 120, 'V8', C.g, pop(st.tk, .2), '引擎');
    [['浏览器', 'Chrome', -1, -1], ['服务器', 'Node.js（2009）', 1, -1], ['包管理', 'npm（2010）', 1, 1], ['工具链', '构建 · 测试 · 脚手架', -1, 1]].forEach(([a, b, sx, sy], i) => { const u = pop(st.tk, .8 + i * .6), X = cx + sx * 420, Y = cy + sy * 200; arrow(g, cx + sx * 130, cy + sy * 40, X - sx * 160, Y - sy * 10, C.fg3, 3, 10, u); node(g, X - 170, Y - 55, 340, 110, a, i ? C.b : C.g, u, b); }); }
};
// ---------- 08 昙花一现（一）----------
AN.graves1 = (g, t, R, st) => lifespans(g, t, R, st, [
  ['VRML', 1994, 2002, '三维网页，没等到硬件', 0], ['frameset', 1996, 2014, 'HTML5 废弃', 0], ['<marquee> / <blink>', 1995, 2013, '标准不收', 0],
  ['ECMAScript 4', 1999, 2008, '野心太大，放弃', 1], ['XHTML 2.0', 2002, 2009, '不兼容旧网页', 1], ['Google Gears', 2007, 2011, '被 HTML5 取代', 1],
  ['Chrome Frame', 2009, 2014, 'IE 用户迁移', 2], ['Web SQL', 2009, 2023, '标准未通过 → 移除', 2], ['AppCache', 2008, 2021, 'Service Worker 取代', 2]], '昙花一现（一）', '红条：从出现到被淘汰（年份为约数）');
AN.sum1 = (g, t, R) => {
  hdr(g, R, '上集小结：网页成了应用');
  flowBoxes(g, t, R, [['文档', '1990 · HTML 链接', C.fg2], ['交互', 'JavaScript · DOM', C.b], ['兼容', 'jQuery · 标准', C.b], ['异步', 'Ajax · JSON', C.g], ['性能', 'V8 · Node', C.g]], R.y + 180, { gap: .6 });
  const u = pop(t, 4.5); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + 420, R.w - 40, 220, 20, 'rgba(255,210,122,.07)', C.gold, 2.5); txt(g, '新问题', R.x + 60, R.y + 470, C.gold, fnt(800, 30));
  txt(g, '· 代码越来越多：怎么组织？', R.x + 60, R.y + 530, C.fg, fnt(700, 28)); txt(g, '· 界面越来越复杂：数据和界面怎么保持一致？', R.x + 60, R.y + 590, C.fg, fnt(700, 28)); g.restore();
};
