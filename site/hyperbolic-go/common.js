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
  const E = [['第一集', '从一台服务器到流水线', '初创公司', '手工上传 · 测试 · CI/CD · 环境 · 数据库迁移 · 回滚', C.b], ['第二集', '几百个服务一起跑', '中大型公司', '发布列车 · Kubernetes · GitOps · 金丝雀 · 供应链', C.p], ['第三集', '不能出错的日子', '电商 · 金融 · 游戏', '封网 · 全链路压测 · 预案 · 合规 · 停服维护', C.gold], ['第四集', '发出去就收不回来', '移动端 · SaaS · 跨国', '分阶段发布 · 多租户 · 固件升级 · 多区域 · AI', C.g]];
  const gap = 30, w = (R.w - gap * 3) / 4;
  E.forEach(([a, b, c, d, col], i) => { const u = typeof u0 === 'function' ? u0(i) : u0, x = R.x + i * (w + gap), y = R.y + 200, on = hot < 0 || hot === i + 1;
    al(g, u * (on ? 1 : .35), () => { rr(g, x, y, w, 400, 20, 'rgba(14,20,36,.94)', col, on && hot > 0 ? 4 : 2);
      txt(g, a, x + w / 2, y + 60, col, fnt(800, 28), 'center'); txt(g, b, x + w / 2, y + 140, C.fg, fnt(800, w < 360 ? 30 : 36, 'serif'), 'center');
      txt(g, c, x + w / 2, y + 210, C.fg2, fnt(600, 24), 'center'); wrapTxt(g, d, x + 30, y + 290, w - 60, 34, C.fg3, fnt(600, 22)); }); });
}
// 纸带：cells 数组，head 位置（可为小数），x0 起点，cw 格宽
function tape(g, x0, y, cells, cw, head, col = C.gold, hiIdx = -1) {
  cells.forEach((s, i) => { const x = x0 + i * cw; rr(g, x, y, cw - 4, cw - 4, 6, i === hiIdx ? 'rgba(255,210,122,.18)' : 'rgba(14,20,36,.95)', i === hiIdx ? col : C.line2, 2); if (s !== '' && s != null) txt(g, String(s), x + cw / 2 - 2, y + cw / 2, C.fg, fnt(800, cw * .5, 'mono'), 'center'); });
  if (head != null) { const hx = x0 + head * cw + cw / 2 - 2; g.save(); g.fillStyle = col; g.beginPath(); g.moveTo(hx, y - 10); g.lineTo(hx - 18, y - 42); g.lineTo(hx + 18, y - 42); g.closePath(); g.fill(); g.restore(); }
}
// 数学式（衬线大字）
function eq(g, s, x, y, col = C.fg, fs = 56, al_ = 'center') { txt(g, s, x, y, col, fnt(700, fs, 'serif'), al_); }

// ---------- 《软件部署流程》工具 ----------
// 服务器：版本标签 ver，状态色 col
function server(g, x, y, w, h, label, col = C.b, a = 1, ver = '', vcol) {
  al(g, a, () => {
    rr(g, x, y, w, h, 10, 'rgba(14,20,36,.96)', col, 2.5);
    const n = Math.max(1, Math.floor((h - 20) / 26));
    for (let i = 0; i < Math.min(n, 3); i++) { rr(g, x + 10, y + 10 + i * 24, w - 20, 18, 4, 'rgba(255,255,255,.04)', C.line2, 1); dot(g, x + 22, y + 19 + i * 24, 4, col); }
    if (label) txt(g, label, x + w / 2, y + h + 24, C.fg2, fnt(600, 20), 'center');
    if (ver) { g.font = fnt(800, 22, 'mono'); const tw = g.measureText(ver).width + 20; rr(g, x + w / 2 - tw / 2, y + h - 38, tw, 30, 8, vcol || col); txt(g, ver, x + w / 2, y + h - 23, '#0B1020', fnt(800, 22, 'mono'), 'center'); }
  });
}
// 容器/实例小方块
function pod(g, x, y, s, ver, col, a = 1, ok = true) {
  al(g, a, () => { rr(g, x, y, s, s, 12, col + '22', col, 3); txt(g, ver, x + s / 2, y + s / 2, C.fg, fnt(800, s * .3, 'mono'), 'center'); if (!ok) { g.save(); g.globalAlpha *= .9; cross(g, x + s - 12, y + 12, 1, C.bad, 8); g.restore(); } });
}
// 流水线阶段：stages=[[名, 子标题, 色]]，进度 ph（0..n）
function stages(g, x, y, w, h, list, ph, opt = {}) {
  const n = list.length, gap = opt.gap ?? 46, bw = (w - gap * (n - 1)) / n;
  list.forEach(([a, b, col], i) => { const X = x + i * (bw + gap), on = ph >= i, cur = ph >= i && ph < i + 1;
    rr(g, X, y, bw, h, 16, cur ? 'rgba(255,210,122,.10)' : 'rgba(14,20,36,.94)', on ? (col || C.b) : C.line2, cur ? 3.5 : 2);
    txt(g, a, X + bw / 2, y + h / 2 - (b ? 16 : 0), on ? C.fg : C.fg3, fnt(800, opt.fs || 30), 'center');
    if (b) txt(g, b, X + bw / 2, y + h / 2 + 24, C.fg3, fnt(500, 20), 'center');
    if (i < n - 1) arrow(g, X + bw + 6, y + h / 2, X + bw + gap - 6, y + h / 2, ph > i + .9 ? C.gold : C.fg3, 3, 12);
    if (on && ph >= i + 1 && opt.ticks !== false) ticks(g, X + bw - 44, y + 26, 1); });
  return i => x + i * (bw + gap) + bw / 2;
}
// 寿命图（昙花一现）：items=[[名, 起, 止(null=至今), 色, 注]]
function lifeChart(g, R, t, items, A, B, ticksY, opt = {}) {
  const x0 = R.x + 330, x1 = R.x + R.w - 190, X = v => LERP(x0, x1, (v - A) / (B - A)), y0 = R.y + 90, rh = Math.min(84, (R.h - 170) / items.length);
  line(g, [[x0, y0], [x1, y0]], C.line2, 2);
  ticksY.forEach(v => { line(g, [[X(v), y0 - 6], [X(v), y0 + items.length * rh + 10]], 'rgba(44,56,84,.5)', 1, [4, 6]); txt(g, String(v), X(v), y0 - 24, C.fg3, fnt(600, 20, 'mono'), 'center'); });
  items.forEach(([nm, a, b, col, note], i) => { const u = typeof t === 'function' ? t(i) : pop(t, .3 + i * .45, 1.2), y = y0 + 22 + i * rh, e = b ?? B, ee = LERP(a, e, u);
    al(g, Math.min(1, u * 3), () => { txt(g, nm, x0 - 20, y + rh * .32, C.fg, fnt(700, 24), 'right');
      const gr = g.createLinearGradient(X(a), 0, X(e), 0); gr.addColorStop(0, col + '33'); gr.addColorStop(.5, col); gr.addColorStop(1, b ? col + '55' : col);
      rr(g, X(a), y + 4, Math.max(4, X(ee) - X(a)), rh * .5, 8, gr);
      if (u > .95 && note) txt(g, note, X(e) + (b ? 22 : 14), y + rh * .32, b ? C.fg2 : C.ok, fnt(600, 20), 'left');
      if (u > .95 && b) cross(g, X(e), y + rh * .32, 1, C.bad, 8); }); });
  txt(g, opt.note || '条形长度为大致流行期（示意）', R.x + R.w - 40, R.y + R.h - 20, C.fg3, fnt(500, 18), 'right');
}
// 百分比条
function pctBar(g, x, y, w, h, p, col, lab) { rr(g, x, y, w, h, h / 2, 'rgba(255,255,255,.05)', C.line2, 1.5); if (p > 0) rr(g, x, y, Math.max(h, w * p), h, h / 2, col); if (lab) txt(g, lab, x + w + 18, y + h / 2, C.fg, fnt(800, 26, 'mono')); }
// 用户人群（点阵）：n 个，前 k 个高亮
function crowdDots(g, x, y, cols, rows, gap, k, col, base = 'rgba(163,174,195,.35)') { let i = 0; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++, i++) dot(g, x + c * gap, y + r * gap, gap * .32, i < k ? col : base); }
// 文件图标
function fileIco(g, x, y, w, h, lab, col = C.fg2, a = 1) { al(g, a, () => { g.save(); g.beginPath(); g.moveTo(x, y); g.lineTo(x + w - 16, y); g.lineTo(x + w, y + 16); g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.closePath(); g.fillStyle = 'rgba(14,20,36,.95)'; g.fill(); g.strokeStyle = col; g.lineWidth = 2; g.stroke(); g.restore(); if (lab) txt(g, lab, x + w / 2, y + h / 2, col, fnt(700, Math.min(20, w * .22), 'mono'), 'center'); }); }
// 锁
function lock(g, x, y, s, col = C.gold) { g.save(); g.strokeStyle = col; g.lineWidth = s * .12; g.beginPath(); g.arc(x, y - s * .2, s * .32, Math.PI, 0); g.stroke(); g.restore(); rr(g, x - s * .5, y - s * .2, s, s * .75, s * .12, col); dot(g, x, y + s * .12, s * .1, '#0B1020'); }
// 地球上的区域：点 + 名字
function regionDot(g, x, y, nm, col, state, a = 1) { al(g, a, () => { glow(g, x, y, 50, col + '44'); dot(g, x, y, 14, col); txt(g, nm, x, y + 38, C.fg, fnt(700, 22), 'center'); if (state) txt(g, state, x, y - 34, col, fnt(800, 20, 'mono'), 'center'); }); }
