// 《宇宙的琴弦 · 导读》通用画布工具
const HSH = (a, b = 0) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const al = (g, a, f) => { if (a <= 0) return; g.save(); g.globalAlpha *= Math.min(1, a); f(); g.restore(); };
const TAU = Math.PI * 2;
// 当前 beat 内的出现进度（之前的 beat 已完全显示）
const K = (st, kk, t0 = .3, d = .7) => st.k > kk ? 1 : st.k < kk ? 0 : pop(st.tk, t0, d);
const KT = (st, t, kk) => st.k === kk ? (kk === 0 ? t : st.tk) : st.k > kk ? 99 : -1;

function stars(g, R, t, n = 160, a = 1) {
  al(g, a, () => { for (let i = 0; i < n; i++) { const x = R.x + HSH(i, 1) * R.w, y = R.y - 40 + HSH(i, 2) * (R.h + 60), tw = .4 + .6 * Math.abs(Math.sin(t * (.3 + HSH(i, 3)) + i)); dot(g, x, y, .6 + HSH(i, 4) * 1.6, `rgba(220,230,255,${.25 + .5 * tw * HSH(i, 5)})`); } });
}
function glow(g, x, y, r, col, a = 1) { al(g, a, () => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }); }
// 闭弦：半径 r，振动模式 n，振幅 amp
function loop(g, cx, cy, r, n, amp, ph, col = C.gold, lw = 4, glowR = 0) {
  if (glowR) glow(g, cx, cy, glowR, col.length === 7 ? col + '33' : col);
  g.save(); g.strokeStyle = col; g.lineWidth = lw; g.shadowColor = col; g.shadowBlur = 14; g.beginPath();
  for (let i = 0; i <= 160; i++) { const a = i / 160 * TAU, rr_ = r + amp * Math.sin(n * a + ph) * Math.cos(ph * .7) + amp * .35 * Math.sin((n + 2) * a - ph * 1.3); const x = cx + rr_ * Math.cos(a), y = cy + rr_ * Math.sin(a); i ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.closePath(); g.stroke(); g.restore();
}
// 开弦：两端 (x0,y0)-(x1,y1)，n 个半波
function ostring(g, x0, y0, x1, y1, n, amp, ph, col = C.b, lw = 4) {
  const L = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
  g.save(); g.strokeStyle = col; g.lineWidth = lw; g.shadowColor = col; g.shadowBlur = 12; g.beginPath();
  for (let i = 0; i <= 120; i++) { const u = i / 120, d = amp * Math.sin(n * Math.PI * u) * Math.cos(ph); const x = LERP(x0, x1, u) + nx * d, y = LERP(y0, y1, u) + ny * d; i ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke(); g.restore(); dot(g, x0, y0, 6, col); dot(g, x1, y1, 6, col);
}
// 透视网格（蹦床）：wells = [{x,z,m,w}]，返回投影函数
function sheet(g, R, wells, opt = {}) {
  const cx = opt.cx ?? R.x + R.w / 2, cy = opt.cy ?? R.y + R.h * .55, W = opt.W ?? R.w * .9, D = opt.D ?? 700, N = opt.N ?? 22;
  const depth = (x, z) => wells.reduce((a, w) => a + (w.m || 0) * 140 / (1 + ((x - w.x) ** 2 + (z - w.z) ** 2) / ((w.w || 90) ** 2)), 0) + (opt.wave ? opt.wave(x, z) : 0);
  const P = (x, z, h = 0) => { const s = 1 / (1 + (z + D / 2) / (D * 1.3)); return [cx + x * s, cy - z * .5 * s + (depth(x, z) + h) * s]; };
  g.save(); g.lineWidth = 1.4; g.strokeStyle = opt.col || 'rgba(92,180,255,.45)';
  for (let i = 0; i <= N; i++) { const x = -W / 2 + W * i / N; g.beginPath(); for (let j = 0; j <= 60; j++) { const z = -D / 2 + D * j / 60; const [X, Y] = P(x, z); j ? g.lineTo(X, Y) : g.moveTo(X, Y); } g.stroke(); }
  for (let j = 0; j <= Math.round(N * D / W * 1.2); j++) { const z = -D / 2 + D * j / Math.round(N * D / W * 1.2); g.beginPath(); for (let i = 0; i <= 80; i++) { const x = -W / 2 + W * i / 80; const [X, Y] = P(x, z); i ? g.lineTo(X, Y) : g.moveTo(X, Y); } g.stroke(); }
  g.restore(); return P;
}
function ball(g, x, y, r, col, hi = '#fff') { const gr = g.createRadialGradient(x - r * .35, y - r * .35, r * .1, x, y, r); gr.addColorStop(0, hi); gr.addColorStop(.35, col); gr.addColorStop(1, '#0B1020'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
function clock(g, x, y, r, ang, col = C.fg, lab = '') { rr(g, x - r, y - r, 2 * r, 2 * r, r, 'rgba(14,20,36,.95)', col, 3); for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; line(g, [[x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8], [x + Math.cos(a) * r * .92, y + Math.sin(a) * r * .92]], C.fg3, 2); } line(g, [[x, y], [x + Math.sin(ang) * r * .75, y - Math.cos(ang) * r * .75]], col, 4); dot(g, x, y, 5, col); if (lab) txt(g, lab, x, y + r + 30, C.fg2, fnt(600, 22), 'center'); }
// 多行要点卡（逐条出现）
function points(g, x, y, w, items, u0, col = C.b, fs = 26, gapY = 70) {
  items.forEach((s, i) => { const u = typeof u0 === 'function' ? u0(i) : u0; al(g, u, () => { dot(g, x + 10, y + i * gapY, 7, col); wrapTxt(g, s, x + 34, y + i * gapY, w - 40, fs * 1.35, C.fg, fnt(600, fs)); }); });
}
function bigq(g, s, x, y, col = C.fg, fs = 40, al_ = 'center') { txt(g, s, x, y, col, fnt(800, fs), al_); }
// 时间线：evs = [[年, 标题, 说明, k, 颜色, 画图函数?]]
function timeline(g, R, st, t, evs, A, B, ticksY) {
  const x0 = R.x + 40, x1 = R.x + R.w - 40, X = y => LERP(x0, x1, (y - A) / (B - A)), y0 = R.y + 70;
  line(g, [[x0, y0], [x1, y0]], C.line2, 4);
  ticksY.forEach(y => { line(g, [[X(y), y0 - 8], [X(y), y0 + 8]], C.fg3, 2); txt(g, String(y), X(y), y0 - 30, C.fg3, fnt(600, 20, 'mono'), 'center'); });
  evs.forEach(([y, a, , kk, col]) => { if (kk > st.k) return; const cur = kk === st.k; dot(g, X(y), y0, cur ? 11 : 7, cur ? (col || C.gold) : C.fg3); if (cur) glow(g, X(y), y0, 30, 'rgba(255,210,122,.35)'); });
  const now = evs.filter(e => e[3] === st.k), n = now.length; if (!n) return;
  const gap = 30, w = Math.min(560, (R.w - gap * (n - 1)) / n), tot = n * w + (n - 1) * gap, xs = R.x + (R.w - tot) / 2, cy = R.y + 150, ch = R.h - 180;
  now.forEach(([y, a, b, kk, col, draw], i) => {
    const u = pop(st.k === 0 ? t : st.tk, .3 + i * 1.2, .7), x = xs + i * (w + gap);
    al(g, u, () => {
      line(g, [[X(y), y0 + 12], [x + w / 2, cy]], 'rgba(255,210,122,.35)', 2, [4, 6]);
      rr(g, x, cy, w, ch, 18, 'rgba(14,20,36,.94)', col || C.gold, 2.5);
      txt(g, String(y), x + 28, cy + 44, col || C.gold, fnt(800, 34, 'mono'));
      txt(g, a, x + 28, cy + 96, C.fg, fnt(800, 30));
      if (draw) { g.save(); g.beginPath(); g.rect(x + 10, cy + 130, w - 20, ch - 300); g.clip(); draw(g, x + w / 2, cy + 130 + (ch - 300) / 2, w - 20, ch - 300, st.k === 0 ? t : st.tk); g.restore(); }
      wrapTxt(g, b, x + 28, cy + ch - 140, w - 56, 34, C.fg2, fnt(500, 23));
    });
  });
}

// ---------- 《逻辑的引擎》新增工具 ----------
// 人物徽章：圆形底 + 姓氏首字，下方姓名与生卒年
function medal(g, x, y, r, ch, name, years, col = C.gold, a = 1) {
  al(g, a, () => {
    glow(g, x, y, r * 1.8, col + '22');
    rr(g, x - r, y - r, 2 * r, 2 * r, r, 'rgba(14,20,36,.96)', col, 4);
    g.save(); g.strokeStyle = col + '55'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r - 12, 0, TAU); g.stroke(); g.restore();
    txt(g, ch, x, y + 4, col, fnt(900, r * .9, 'serif'), 'center');
    if (name) txt(g, name, x, y + r + 40, C.fg, fnt(800, 32), 'center');
    if (years) txt(g, years, x, y + r + 80, C.fg3, fnt(600, 24, 'mono'), 'center');
  });
}
// 一本书
function book(g, x, y, w, h, ttl, sub, col = C.b, a = 1) {
  al(g, a, () => {
    rr(g, x + 8, y + 8, w, h, 8, 'rgba(0,0,0,.35)');
    rr(g, x, y, w, h, 8, 'rgba(20,26,44,.98)', col, 2.5);
    rr(g, x, y, 16, h, 6, col);
    wrapTxt(g, ttl, x + 34, y + 50, w - 54, 40, C.fg, fnt(800, 30, 'serif'));
    if (sub) txt(g, sub, x + 34, y + h - 34, col, fnt(700, 24, 'mono'));
  });
}
// 生平时间轴：evs = [[年, 文字]]，u = 进度
function lifeline(g, x0, x1, y, A, B, evs, u, col = C.gold) {
  const X = v => LERP(x0, x1, (v - A) / (B - A));
  line(g, [[x0, y], [x1, y]], C.line2, 4);
  line(g, [[x0, y], [LERP(x0, x1, CL(u)), y]], col, 4);
  evs.forEach(([v, s], i) => { const p = (v - A) / (B - A); if (u < p) return; const xx = X(v), up = i % 2 === 0;
    dot(g, xx, y, 9, col); txt(g, String(v), xx, y + (up ? -34 : 36), col, fnt(700, 24, 'mono'), 'center'); wrapTxt(g, s, xx - 110, y + (up ? -110 : 80), 220, 30, C.fg2, fnt(600, 22)); });
}
// 引用卡
function quote(g, x, y, w, s, who, col = C.gold, a = 1, fs = 34) {
  al(g, a, () => {
    g.font = fnt(700, fs, 'serif'); let n = 0, cur = ''; for (const ch of s) { if (g.measureText(cur + ch).width > w - 120 && cur) { n++; cur = ch; } else cur += ch; } n++;
    const h = n * fs * 1.5 + 70 + (who ? 50 : 0);
    rr(g, x, y, w, h, 18, 'rgba(255,210,122,.07)', col, 2);
    txt(g, '“', x + 30, y + 46, col, fnt(900, 80, 'serif'));
    wrapTxt(g, s, x + 80, y + 40 + fs * .7, w - 120, fs * 1.5, C.fg, fnt(700, fs, 'serif'));
    if (who) txt(g, '—— ' + who, x + w - 40, y + h - 36, C.fg2, fnt(600, 24), 'right');
  });
}
// 四集卡片（片头用）：hot = 当前集序号
function epCards(g, R, t, hot, u0 = 1) {
  const E = [['第一集', '电脑能有心灵吗', '序言 · 第 1–2 章', '图灵测试 · 中文屋 · 图灵机 · 停机问题', C.b], ['第二集', '数学是发现还是发明', '第 3–4 章', '曼德布罗集 · 哥德尔 · 铺砖问题', C.p], ['第三集', '经典世界与量子之谜', '第 5–6 章', '牛顿 · 相对论 · 双缝 · U 与 R', C.gold], ['第四集', '心灵的物理在哪里', '第 7–10 章 · 尾声 · 书后', '时间之箭 · 量子引力 · 大脑 · 意识', C.g]];
  const gap = 30, w = (R.w - gap * 3) / 4;
  E.forEach(([a, b, c, d, col], i) => { const u = typeof u0 === 'function' ? u0(i) : u0, x = R.x + i * (w + gap), y = R.y + 200, on = hot < 0 || hot === i + 1;
    al(g, u * (on ? 1 : .35), () => { rr(g, x, y, w, 400, 20, 'rgba(14,20,36,.94)', col, on && hot > 0 ? 4 : 2);
      txt(g, a, x + w / 2, y + 60, col, fnt(800, 28), 'center'); txt(g, b, x + w / 2, y + 140, C.fg, fnt(800, w < 360 ? 34 : 40, 'serif'), 'center');
      txt(g, c, x + w / 2, y + 220, C.fg2, fnt(600, 22), 'center'); wrapTxt(g, d, x + 30, y + 300, w - 60, 32, C.fg3, fnt(600, 22)); }); });
}
// 纸带：cells 数组，head 位置（可为小数），x0 起点，cw 格宽
function tape(g, x0, y, cells, cw, head, col = C.gold, hiIdx = -1) {
  cells.forEach((s, i) => { const x = x0 + i * cw; rr(g, x, y, cw - 4, cw - 4, 6, i === hiIdx ? 'rgba(255,210,122,.18)' : 'rgba(14,20,36,.95)', i === hiIdx ? col : C.line2, 2); if (s !== '' && s != null) txt(g, String(s), x + cw / 2 - 2, y + cw / 2, C.fg, fnt(800, cw * .5, 'mono'), 'center'); });
  if (head != null) { const hx = x0 + head * cw + cw / 2 - 2; g.save(); g.fillStyle = col; g.beginPath(); g.moveTo(hx, y - 10); g.lineTo(hx - 18, y - 42); g.lineTo(hx + 18, y - 42); g.closePath(); g.fill(); g.restore(); }
}
// 数学式（衬线大字）
function eq(g, s, x, y, col = C.fg, fs = 56, al_ = 'center') { txt(g, s, x, y, col, fnt(700, fs, 'serif'), al_); }
