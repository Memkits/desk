// 第一集动画：装得下
const RND = s => () => (s = (s * 16807) % 2147483647) / 2147483647;
const HSH = (a, b = 0) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const al = (g, a, f) => { if (a <= 0) return; g.save(); g.globalAlpha *= Math.min(1, a); f(); g.restore(); };
function flowBoxes(g, t, R, items, y, opt = {}) {
  const n = items.length, gap = opt.gapX ?? 40, w = (R.w - 40 - gap * (n - 1)) / n;
  items.forEach(([a, b, col], i) => { const u = pop(t, (opt.t0 ?? .3) + i * (opt.gap ?? .8)); const x = R.x + 20 + i * (w + gap); node(g, x, y, w, opt.h ?? 120, a, col, u, b); if (i < n - 1) arrow(g, x + w + 4, y + (opt.h ?? 120) / 2, x + w + gap - 4, y + (opt.h ?? 120) / 2, C.fg3, 3, 10, pop(t, (opt.t0 ?? .3) + i * (opt.gap ?? .8) + .4)); });
}
function events(g, t, R, E, opt = {}) {
  const x0 = R.x + 70, x1 = R.x + R.w - (opt.pad ?? 110), y = R.y + (opt.y ?? 360);
  line(g, [[x0, y], [x0 + (x1 - x0) * SS(t / 2), y]], C.line2, 4);
  E.forEach(([d, a, b, col], i) => { const u = pop(t, .3 + i * (opt.gap ?? .5)); if (u <= 0) return; const x = LERP(x0, x1, i / (E.length - 1)), up = i % 2 === 0;
    al(g, u, () => { dot(g, x, y, 10, col || C.b); line(g, [[x, y], [x, up ? y - 60 : y + 60]], C.line2, 2); const yy = up ? y - 150 : y + 100;
      txt(g, d, x, yy, col || C.b, fnt(800, 26, 'mono'), 'center'); txt(g, a, x, yy + 38, C.fg, fnt(700, 23), 'center'); if (b) txt(g, b, x, yy + 70, C.fg3, fnt(500, 18), 'center'); }); });
}
function lifespans(g, t, R, st, rows, title, sub, A, B, ticksY) {
  hdr(g, R, title, sub);
  const x0 = R.x + 300, x1 = R.x + R.w - 40, X = y => LERP(x0, x1, (y - A) / (B - A)), y0 = R.y + 180;
  ticksY.forEach(y => { line(g, [[X(y), y0 - 10], [X(y), y0 + rows.length * 160]], C.line, 1, [4, 6]); txt(g, String(y), X(y), y0 - 28, C.fg3, fnt(600, 20, 'mono'), 'center'); });
  rows.forEach(([name, a, b, why, kk], i) => {
    if (st.k < kk) return; const u = pop(st.k === kk ? (kk === 0 ? t : st.tk) : 99, .3, .9), y = y0 + 30 + i * 160;
    al(g, Math.min(1, u * 2), () => {
      txt(g, name, x0 - 20, y + 32, st.k === kk ? C.fg : C.fg2, fnt(700, 30), 'right');
      const w = (X(b) - X(a)) * SS(u); rr(g, X(a), y, Math.max(4, w), 64, 10, 'rgba(255,122,147,.3)', C.r, 2.5);
      txt(g, String(a), X(a) + 14, y + 32, C.fg, fnt(700, 22, 'mono')); if (u > .95 && X(b) - X(a) > 170) txt(g, String(b), X(b) - 14, y + 32, C.fg, fnt(700, 22, 'mono'), 'right');
      if (u > .95) txt(g, '† ' + why, X(a), y + 92, C.fg2, fnt(600, 23));
    });
  });
}

// ---------- 片头 ----------
function ridge(x, s, amp, base) { return base - amp * (.55 + .25 * Math.sin(x * .004 + s) + .15 * Math.sin(x * .011 + s * 2.1) + .07 * Math.sin(x * .031 + s * 3.7)); }
function landscape(g, R, t, a = 1) {
  al(g, a, () => {
    const L = [[1.2, 90, R.y + 330, '#1A2440'], [2.7, 130, R.y + 470, '#16213A'], [4.1, 170, R.y + 640, '#121B30'], [5.3, 120, R.y + 800, '#0E1626']];
    L.forEach(([s, amp, base, col], li) => {
      g.beginPath(); g.moveTo(R.x, R.y + R.h); for (let x = R.x; x <= R.x + R.w; x += 8) g.lineTo(x, ridge(x, s, amp, base)); g.lineTo(R.x + R.w, R.y + R.h); g.closePath(); g.fillStyle = col; g.fill();
      if (li === 0) { // 远处的城
        const cx = R.x + R.w * .74; for (let i = 0; i < 14; i++) { const x = cx + (i - 7) * 16, h = 20 + HSH(i, 3) * 50, y = ridge(x, s, amp, base); rr(g, x, y - h, 13, h + 6, 2, '#2E3D63'); if (HSH(i, 9) > .4) dot(g, x + 6, y - h + 10, 2, C.gold); }
      }
      if (li >= 1) for (let i = 0; i < 40; i++) { const x = R.x + HSH(i, li) * R.w, y = ridge(x, s, amp, base) + 6, h = 18 + li * 8; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x - h * .35, y); g.lineTo(x + h * .35, y); g.closePath(); g.fillStyle = ['', '#1D3A36', '#1A3430', '#16302B'][li]; g.fill(); }
    });
    const P = [[R.x + 160, R.y + R.h - 40], [R.x + 520, R.y + 690], [R.x + 820, R.y + 560], [R.x + 1050, R.y + 470], [R.x + R.w * .74, R.y + 300]];
    line(g, P, 'rgba(255,210,122,.45)', 3, [6, 10]);
    packet(g, P, (t * .05) % 1, C.gold, 10);
  });
}
AN.open = (g, t, R, st) => {
  landscape(g, R, t, st.k === 0 ? 1 : 1 - .6 * pop(st.tk, 0, .8));
  if (st.k === 0 && t > 5.5) al(g, pop(t, 5.5), () => { chip(g, '远处的城 · 走过去就能进', R.x + R.w * .74 - 150, R.y + 220, C.gold); chip(g, '一路上没有一次读条', R.x + 120, R.y + R.h - 110, C.b); });
  if (st.k >= 1) {
    const E = [['第一集', '装得下', '流式加载 · 精度 · 剔除 · IO', C.b], ['第二集', '画得出', '地形 · 植被 · 光照 · 天空', C.g], ['第三集', '造得出', '程序化 · 扫描 · 工具 · 协作', C.o], ['第四集', '活起来', 'NPC · 物理 · 多人 · AI', C.p]];
    const w = (R.w - 3 * 30) / 4;
    E.forEach(([a, b, c, col], i) => { const u = pop(st.k === 1 ? st.tk : 99, .3 + i * .5); const x = R.x + i * (w + 30), y = R.y + 120, hot = st.k === 2 ? i === 0 : true;
      al(g, u * (hot ? 1 : .35), () => { rr(g, x, y, w, 230, 18, 'rgba(14,20,36,.92)', col, hot && st.k === 2 ? 4 : 2); txt(g, a, x + 28, y + 44, col, fnt(700, 24)); txt(g, b, x + 28, y + 112, C.fg, fnt(800, 54, 'serif')); txt(g, c, x + 28, y + 182, C.fg2, fnt(500, 21)); }); });
  }
  if (st.k === 2) {
    const P = [['内存', '放不下整个世界', C.b], ['精度', '走远了会抖', C.r], ['绘制', '要画的东西太多', C.g], ['硬盘', '读得不够快', C.o]];
    const w = (R.w - 3 * 30) / 4;
    P.forEach(([a, b, col], i) => { const u = pop(st.tk, .6 + i * .45); const x = R.x + i * (w + 30), y = R.y + 430;
      al(g, u, () => { g.translate(0, (1 - u) * 16); rr(g, x, y, w, 170, 16, 'rgba(14,20,36,.95)', col, 2.5); txt(g, a, x + w / 2, y + 62, col, fnt(800, 44), 'center'); txt(g, b, x + w / 2, y + 122, C.fg2, fnt(600, 24), 'center'); }); });
    al(g, pop(st.tk, 3), () => txt(g, '四个问题，决定开放世界的地基', R.x + R.w / 2, R.y + 700, C.gold, fnt(800, 36), 'center'));
  }
};

// ---------- 01 流式加载 ----------
AN.loading = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '早期：切成关卡，中间读条');
    const S = [['关卡 A', 6, C.b], ['读条', 2.2, null], ['关卡 B', 6, C.g], ['读条', 2.2, null], ['关卡 C', 5, C.o]], tot = S.reduce((a, s) => a + s[1], 0);
    const x0 = R.x + 20, W = R.w - 40, y = R.y + 160; let x = x0; const cur = (t * 1.6) % (tot + 2);
    let acc = 0; S.forEach(([s, d, col], i) => { const w = W * d / tot; al(g, pop(t, .2 + i * .25), () => { rr(g, x + 3, y, w - 6, 90, 12, col ? col + '30' : 'rgba(255,255,255,.04)', col || C.line2, 2); txt(g, s, x + w / 2, y + 45, col ? C.fg : C.fg3, fnt(700, 26), 'center');
        if (!col && cur > acc && cur < acc + d) { const a0 = t * 6; g.strokeStyle = C.fg2; g.lineWidth = 5; g.beginPath(); g.arc(x + w / 2, y + 130, 20, a0, a0 + 4.2); g.stroke(); } }); x += w; acc += d; });
    const cx = x0 + W * Math.min(cur, tot) / tot; line(g, [[cx, y - 20], [cx, y + 110]], C.gold, 3); dot(g, cx, y - 24, 8, C.gold);
    // 容量对比
    const y2 = R.y + 400, sc = (W - 300) / 130;
    al(g, pop(t, 2), () => { txt(g, '世界的全部资源', x0, y2, C.fg2, fnt(600, 26)); rr(g, x0 + 260, y2 - 26, 120 * sc * SS((t - 2) / 1.5), 52, 10, 'rgba(255,122,147,.3)', C.r, 2); txt(g, '≈ 100 GB 以上', x0 + 280, y2, C.fg, fnt(700, 24)); });
    al(g, pop(t, 3.2), () => { txt(g, '主机内存', x0, y2 + 90, C.fg2, fnt(600, 26)); rr(g, x0 + 260, y2 + 64, 16 * sc, 52, 10, 'rgba(92,180,255,.3)', C.b, 2); txt(g, '十几 GB', x0 + 280 + 16 * sc, y2 + 90, C.fg, fnt(700, 24)); });
    al(g, pop(t, 4.5), () => txt(g, '数字为示意量级', x0 + 260, y2 + 160, C.fg3, fnt(500, 20)));
    return;
  }
  // k=1：把读条藏起来
  hdr(g, R, '把读条藏进关卡设计', '玩家在“过渡区”里时，后台加载下一片区域');
  const W = R.w, y = R.y + 420, A = [R.x + 40, y - 150, 300, 300], B = [R.x + W - 340, y - 150, 300, 300];
  rr(g, ...A, 16, 'rgba(92,180,255,.12)', C.b, 2); txt(g, '区域 A', A[0] + 150, A[1] + 40, C.b, fnt(800, 28), 'center');
  const loaded = SS((st.tk - 3) / 9);
  rr(g, ...B, 16, `rgba(95,224,160,${.04 + .14 * loaded})`, loaded > .99 ? C.g : C.line2, 2, ); txt(g, '区域 B', B[0] + 150, B[1] + 40, loaded > .99 ? C.g : C.fg3, fnt(800, 28), 'center');
  const P = [[A[0] + 300, y], [R.x + 470, y], [R.x + 470, y - 120], [R.x + 700, y - 120], [R.x + 700, y + 110], [R.x + 930, y + 110], [R.x + 930, y - 60], [R.x + 1160, y - 60], [R.x + 1160, y], [B[0], y]].map(([x, yy]) => [Math.min(x, B[0]), yy]);
  line(g, P, 'rgba(255,255,255,.12)', 46); line(g, P, C.line2, 2, [6, 8]);
  const lab = [['窄缝', 1, C.o], ['长廊', 4, C.p], ['电梯', 7, C.r]]; lab.forEach(([s, i, col], k) => al(g, pop(st.tk, 1 + k * .6), () => chip(g, s, (P[i][0] + P[i + 1][0]) / 2 - 36, (P[i][1] + P[i + 1][1]) / 2 - 50, col)));
  const ph = CL((st.tk - 2.5) / 11); packet(g, P, ph, C.fg, 12);
  const bx = R.x + 420, by = R.y + R.h - 110, bw = 820;
  rr(g, bx, by, bw, 34, 17, 'rgba(255,255,255,.04)', C.line2, 2); rr(g, bx + 3, by + 3, (bw - 6) * loaded, 28, 14, 'rgba(255,210,122,.6)');
  txt(g, loaded > .99 ? '区域 B 已就绪' : '后台加载区域 B …', bx + bw / 2, by - 24, C.gold, fnt(700, 24), 'center');
};
// 网格流式加载的确定性模拟
function gridSim(t, R, bi) {
  const cs = 66, cols = Math.floor((R.w - 40) / cs), rows = 10, gx = R.x + (R.w - cols * cs) / 2, gy = R.y + 110;
  const T1 = bi === 4 ? 13 : 1e9, ph = u => u < T1 ? u : T1 + 2.4 * (u - T1);
  const pos = u => { const p = ph(u) * .9; return [gx + cols * cs * (.5 + .4 * Math.sin(p * .13 - 1.2)), gy + rows * cs * (.5 + .36 * Math.sin(p * .23 + .3))]; };
  const rad = u => (u < T1 ? 2.1 : 3.3) * cs, hyst = bi === 4 ? 1.1 * cs : .02 * cs;
  const N = cols * rows, st = new Int8Array(N), req = new Float32Array(N), prog = new Float32Array(N);
  const dist = (i, p) => { const cx = gx + (i % cols + .5) * cs, cy = gy + (Math.floor(i / cols) + .5) * cs; return Math.hypot(cx - p[0], cy - p[1]); };
  const dt = .05, SLOTS = 3, LT = .45;
  for (let u = 0; u <= t; u += dt) {
    const p = pos(u), r = rad(u);
    for (let i = 0; i < N; i++) { const d = dist(i, p); if (st[i] === 0 && d < r) { st[i] = 1; req[i] = u; prog[i] = 0; } else if (st[i] > 0 && d > r + hyst) st[i] = 0; }
    let used = 0; for (let i = 0; i < N; i++) if (st[i] === 2) { prog[i] += dt / LT; used++; if (prog[i] >= 1) st[i] = 3; }
    if (used < SLOTS) { const q = []; for (let i = 0; i < N; i++) if (st[i] === 1) q.push(i); q.sort((a, b) => dist(a, p) - dist(b, p)); q.slice(0, SLOTS - used).forEach(i => st[i] = 2); }
  }
  return { cs, cols, rows, gx, gy, st, prog, p: pos(t), r: rad(t), hyst, veh: t >= T1 };
}
AN.grid = (g, t, R, st) => {
  const S = gridSim(t, R, st.bi);
  hdr(g, R, st.bi === 4 ? '缓冲带与高速移动' : '以玩家为圆心：进圈加载，出圈卸载');
  let nL = 0, nQ = 0;
  for (let i = 0; i < S.cols * S.rows; i++) {
    const x = S.gx + (i % S.cols) * S.cs, y = S.gy + Math.floor(i / S.cols) * S.cs, s = S.st[i];
    if (s === 3) { nL++; rr(g, x + 3, y + 3, S.cs - 6, S.cs - 6, 8, 'rgba(92,180,255,.22)', C.b, 1.5); for (let k = 0; k < 3; k++) { const tx = x + 12 + HSH(i, k) * (S.cs - 24), ty = y + 18 + HSH(k, i) * (S.cs - 30); g.beginPath(); g.moveTo(tx, ty - 12); g.lineTo(tx - 7, ty + 6); g.lineTo(tx + 7, ty + 6); g.closePath(); g.fillStyle = '#3FAE84'; g.fill(); } }
    else if (s === 2) { nQ++; rr(g, x + 3, y + 3, S.cs - 6, S.cs - 6, 8, 'rgba(255,210,122,.08)', C.gold, 2.5); rr(g, x + 10, y + S.cs - 18, (S.cs - 20) * CL(S.prog[i]), 7, 3, C.gold); }
    else if (s === 1) { nQ++; g.save(); g.setLineDash([5, 5]); rr(g, x + 3, y + 3, S.cs - 6, S.cs - 6, 8, null, 'rgba(255,210,122,.6)', 1.5); g.restore(); }
    else rr(g, x + 3, y + 3, S.cs - 6, S.cs - 6, 8, 'rgba(255,255,255,.015)', C.line, 1);
  }
  g.save(); g.setLineDash([10, 8]); g.strokeStyle = C.gold; g.lineWidth = 2.5; g.beginPath(); g.arc(S.p[0], S.p[1], S.r, 0, 7); g.stroke();
  if (st.bi === 4) { g.strokeStyle = C.r; g.beginPath(); g.arc(S.p[0], S.p[1], S.r + S.hyst, 0, 7); g.stroke(); }
  g.restore();
  dot(g, S.p[0], S.p[1], 13, C.fg); dot(g, S.p[0], S.p[1], 6, '#0B1020');
  if (S.veh) { const lx = CL(S.p[0], R.x + 200, R.x + R.w - 200), ly2 = S.p[1] < S.gy + 120 ? S.p[1] + 50 : S.p[1] - 40; rr(g, lx - 170, ly2 - 22, 340, 44, 10, 'rgba(11,16,32,.92)', C.o, 2); txt(g, '载具：速度 ×2.4，半径放大', lx, ly2, C.o, fnt(700, 22), 'center'); }
  const ly = S.gy + S.rows * S.cs + 40; let x = R.x + 20;
  [['已加载', 'rgba(92,180,255,.4)', C.b], ['加载中', 'rgba(255,210,122,.3)', C.gold], ['排队', null, 'rgba(255,210,122,.6)']].forEach(([s, f, c]) => { rr(g, x, ly - 14, 28, 28, 6, f, c, 2); txt(g, s, x + 40, ly, C.fg2, fnt(600, 22)); x += 150; });
  if (st.bi === 4) { g.save(); g.setLineDash([8, 6]); line(g, [[x + 20, ly], [x + 70, ly]], C.gold, 3); line(g, [[x + 230, ly], [x + 280, ly]], C.r, 3); g.restore(); txt(g, '加载半径', x + 80, ly, C.fg2, fnt(600, 22)); txt(g, '卸载半径（更大）', x + 290, ly, C.fg2, fnt(600, 22)); }
  txt(g, `已加载 ${nL} 格 · 加载中 / 排队 ${nQ} 格 · 同时最多加载 3 格`, R.x + R.w - 20, ly, C.fg3, fnt(600, 21, 'mono'), 'right');
};
// 纹理流送与内存预算
let MIPC = null;
function mipCanvas(n) {
  MIPC = MIPC || {}; if (MIPC[n]) return MIPC[n];
  const c = document.createElement('canvas'); c.width = c.height = n; const x = c.getContext('2d'), im = x.createImageData(n, n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const u = i / n, v = j / n; let h = 0, a = 1, f = 3; for (let o = 0; o < 5; o++) { h += a * Math.sin(u * f * 6.28 + o * 1.7) * Math.sin(v * f * 6.28 + o * 2.3); a *= .55; f *= 2.1; }
    const brick = ((Math.floor(v * 8) % 2 ? Math.floor(u * 6 + .5) : Math.floor(u * 6)) + Math.floor(v * 8)) % 2, edge = (v * 8 % 1 < .06) || ((u * 6 + (Math.floor(v * 8) % 2 ? .5 : 0)) % 1 < .05);
    const k = (j * n + i) * 4, b = edge ? 40 : 120 + 50 * h + brick * 25; im.data[k] = b * 1.05; im.data[k + 1] = b * .82; im.data[k + 2] = b * .66; im.data[k + 3] = 255; }
  x.putImageData(im, 0, 0); return MIPC[n] = c;
}
AN.budget = (g, t, R, st) => {
  hdr(g, R, '加载有先后：先能站稳，再变清晰');
  const steps = [['碰撞', C.r, 1], ['低精度模型', C.o, 1.5], ['贴图 · 小 mip', C.p, 1], ['贴图 · 中 mip', C.p, 2.2], ['贴图 · 高 mip', C.p, 5]];
  const x0 = R.x + 20, y0 = R.y + 130;
  const D = st.D || 20, f = t / D;
  steps.forEach(([s, col], i) => { const u = pop(f, .04 + i * .08, .05); check(g, x0, y0 + i * 62, `${i + 1}. ${s}`, u, col, 26); });
  const lvl = Math.min(5, Math.floor(CL((f - .2) / .07, 0, 5))), n = 8 << lvl;
  const ix = R.x + 470, iy = R.y + 110, sz = 420; g.imageSmoothingEnabled = false; g.drawImage(mipCanvas(n), ix, iy, sz, sz); g.imageSmoothingEnabled = true; rr(g, ix, iy, sz, sz, 4, null, C.line2, 2);
  txt(g, `当前分辨率 ${n}×${n}`, ix + sz / 2, iy + sz + 34, C.fg, fnt(700, 24, 'mono'), 'center'); txt(g, '玩家走近 → 逐级换成更清晰的版本', ix + sz / 2, iy + sz + 70, C.fg3, fnt(500, 21), 'center');
  // 内存池
  const px = R.x + 1000, pw = R.w - 1020, py = R.y + 130, ph = 520, lim = .78;
  txt(g, '流式内存池', px, py - 30, C.fg2, fnt(700, 24)); rr(g, px, py, pw, ph, 12, 'rgba(255,255,255,.03)', C.line2, 2);
  const over = SS((f - .62) / .05) * (1 - SS((f - .9) / .05)), fill = Math.min(.92, .15 + 1.3 * Math.max(0, f - .05)) - .2 * SS((f - .8) / .08);
  const segs = [[.12, C.r], [.18, C.o], [Math.max(0, fill - .3), C.p]]; let yy = py + ph;
  segs.forEach(([f, col]) => { const h = ph * Math.min(f, 1); yy -= h; rr(g, px + 6, yy, pw - 12, h - 2, 6, col + '55', col, 1.5); });
  line(g, [[px - 10, py + ph * (1 - lim)], [px + pw + 10, py + ph * (1 - lim)]], C.gold, 3, [10, 6]); txt(g, '预算上限', px + pw, py + ph * (1 - lim) - 20, C.gold, fnt(700, 21), 'right');
  if (over > 0) al(g, over, () => { rr(g, px - 20, py + ph + 20, pw + 40, 90, 12, 'rgba(255,107,107,.12)', C.bad, 2); txt(g, '超出预算：', px, py + ph + 48, C.bad, fnt(700, 22)); txt(g, '丢掉最远区域的高 mip', px, py + ph + 82, C.fg, fnt(600, 21)); });
};
AN.engines = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '虚幻引擎五 · 世界分区');
    const gx = R.x + 20, gy = R.y + 110, cs = 72, cols = 8, rows = 7; const sp = [gx + cs * (2.5 + 3 * SS(((t * .08) % 2 < 1 ? (t * .08) % 1 : 2 - (t * .08) % 2))), gy + cs * 3.5];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const x = gx + i * cs, y = gy + j * cs, d = Math.hypot(x + cs / 2 - sp[0], y + cs / 2 - sp[1]); rr(g, x + 2, y + 2, cs - 4, cs - 4, 6, d < cs * 2.2 ? 'rgba(92,180,255,.25)' : 'rgba(255,255,255,.02)', d < cs * 2.2 ? C.b : C.line, 1.5); }
    dot(g, sp[0], sp[1], 12, C.gold); txt(g, '流送源', sp[0], sp[1] - 26, C.gold, fnt(700, 20), 'center');
    txt(g, '一张大地图 = 一个关卡，编辑器自动切格', gx, gy + rows * cs + 36, C.fg2, fnt(600, 22));
    const px = R.x + 680;
    al(g, pop(t, 2.5), () => { txt(g, '每个物体单独一个文件', px, R.y + 130, C.fg, fnt(700, 26));
      for (let i = 0; i < 8; i++) { const x = px + (i % 4) * 140, y = R.y + 170 + Math.floor(i / 4) * 96; rr(g, x, y, 112, 76, 8, 'rgba(14,20,36,.95)', i === 2 ? C.o : i === 5 ? C.g : C.line2, 2); txt(g, ['树', '岩石', '房屋', '路灯', '围栏', '水井', '马车', '旗帜'][i], x + 56, y + 38, C.fg2, fnt(600, 21), 'center'); }
      person(g, px + 210, R.y + 390, C.o, .9); person(g, px + 360, R.y + 390, C.g, .9); txt(g, '两个人同时改，互不冲突', px + 285, R.y + 440, C.fg3, fnt(500, 20), 'center'); });
    al(g, pop(t, 5), () => { txt(g, '数据层：整组切换内容', px, R.y + 510, C.fg, fnt(700, 26));
      [['基础', 1], ['节日装饰', Math.floor(t / 2) % 2], ['战后废墟', 1 - Math.floor(t / 2) % 2]].forEach(([s, on], i) => { const x = px + i * 190, y = R.y + 570; rr(g, x, y, 170, 56, 28, on ? 'rgba(95,211,154,.18)' : 'rgba(255,255,255,.03)', on ? C.ok : C.line2, 2); txt(g, s, x + 85, y + 28, on ? C.fg : C.fg3, fnt(700, 22), 'center'); }); });
    return;
  }
  hdr(g, R, 'Unity 与 Godot：提供积木，分块自己搭');
  const col = (x, head, items, c0, t0) => { txt(g, head, x, R.y + 130, c0, fnt(800, 32)); items.forEach(([a, b, c], i) => { const u = pop(st.tk, t0 + i * .8), y = R.y + 180 + i * 170; node(g, x, y, 560, 120, a, c, u, b); if (i < items.length - 1) arrow(g, x + 280, y + 124, x + 280, y + 164, C.fg3, 3, 10, u); }); };
  col(R.x + 20, 'Unity', [['资源管理系统', '按地址异步加载资源', C.b], ['叠加式异步加载场景', '一块地图一个场景', C.b], ['自己写', '分块规则与调度', C.gold]], C.b, .3);
  col(R.x + 680, 'Godot', [['后台线程加载资源', '线程化请求，轮询状态', C.g], ['实例化并加入场景树', '主线程挂上节点', C.g], ['自己写或用插件', '网格与调度', C.gold]], C.g, 1.2);
};

// ---------- 02 精度 ----------
AN.ulp = (g, t, R, st) => {
  hdr(g, R, '离原点越远，float 越稀疏');
  const x0 = R.x + 110, x1 = R.x + 800, y0 = R.y + 640, y1 = R.y + 130;
  const X = d => LERP(x0, x1, (Math.log10(d)) / 6), Y = u => LERP(y0, y1, (Math.log10(u) + 7.5) / 7);
  line(g, [[x0, y0], [x1, y0]], C.line2, 2); line(g, [[x0, y0], [x0, y1]], C.line2, 2);
  [[1, '1 米'], [1e3, '1 公里'], [1e4, '10 公里'], [1e5, '100 公里'], [1e6, '1000 公里']].forEach(([d, s]) => { line(g, [[X(d), y0], [X(d), y0 + 8]], C.fg3, 2); txt(g, s, X(d), y0 + 32, C.fg3, fnt(600, 19), 'center'); });
  [[1e-6, '1 微米'], [1e-3, '1 毫米'], [1e-2, '1 厘米']].forEach(([u, s]) => { line(g, [[x0, Y(u)], [x1, Y(u)]], C.line, 1, [4, 6]); txt(g, s, x0 - 12, Y(u), C.fg3, fnt(600, 19), 'right'); });
  const prog = SS((t - .5) / 4), pts = []; for (let e = 0; e <= 20 * prog; e++) { const a = 2 ** e, u = 2 ** (e - 23); pts.push([X(a), Y(u)], [X(Math.min(2 * a, 1e6)), Y(u)]); }
  if (pts.length) line(g, pts, C.r, 3.5);
  txt(g, '相邻两个 float 的间距', x0 + 10, y1 - 10, C.r, fnt(700, 22));
  [[1e3, 6.1e-5, '约 0.06 毫米'], [1e5, 7.8e-3, '约 8 毫米']].forEach(([d, u, s], i) => al(g, pop(t, 3 + i * 1.2), () => { dot(g, X(d), Y(u), 8, C.gold); txt(g, s, X(d) + 14, Y(u) - 22, C.gold, fnt(700, 22)); }));
  // 抖动演示
  const bx = R.x + 880, bw = 400; txt(g, '同一个动作，在不同距离上（示意放大）', bx, R.y + 120, C.fg2, fnt(600, 20));
  [['1 公里', 0], ['10 公里', 9], ['100 公里', 26]].forEach(([s, q], i) => { const y = R.y + 150 + i * 165, u = pop(t, 1 + i * .5); al(g, u, () => {
    rr(g, bx, y, bw, 145, 12, 'rgba(14,20,36,.9)', C.line2, 2); txt(g, s, bx + 20, y + 30, C.fg, fnt(700, 22));
    const a = t * 1.7, cx = bx + 230 + Math.cos(a) * 70, cy = y + 85 + Math.sin(a * 2) * 26, Q = v => q ? Math.round(v / q) * q : v;
    for (let k = 1; k < 14; k++) { const b = a - k * .09; dot(g, bx + 230 + Q(Math.cos(b) * 70), y + 85 + Q(Math.sin(b * 2) * 26), 3, `rgba(92,180,255,${.4 - k * .025})`); }
    dot(g, bx + 230 + Q(cx - bx - 230), y + 85 + Q(cy - y - 85), 9, q > 20 ? C.bad : q ? C.o : C.ok); }); });
};
AN.lwc = (g, t, R, st) => {
  hdr(g, R, '大世界坐标：CPU 用双精度，GPU 用相对坐标');
  const u1 = pop(t, .5), u2 = pop(t, 2), u3 = pop(t, 4), u4 = pop(t, 6);
  al(g, u1, () => { rr(g, R.x + 20, R.y + 120, 600, 300, 16, 'rgba(14,20,36,.92)', C.b, 2.5); txt(g, 'CPU · double（约 16 位有效数字）', R.x + 44, R.y + 160, C.b, fnt(800, 24));
    txt(g, '物体    123 456.789 012 米', R.x + 44, R.y + 230, C.fg, fnt(600, 26, 'mono')); txt(g, '摄像机  123 450.000 000 米', R.x + 44, R.y + 290, C.fg, fnt(600, 26, 'mono')); });
  al(g, u2, () => { line(g, [[R.x + 44, R.y + 330], [R.x + 560, R.y + 330]], C.fg3, 2); txt(g, '相减    6.789 012 米', R.x + 44, R.y + 380, C.gold, fnt(800, 28, 'mono')); });
  al(g, u3, () => { arrow(g, R.x + 640, R.y + 270, R.x + 760, R.y + 270, C.gold, 4, 14); rr(g, R.x + 780, R.y + 120, 500, 300, 16, 'rgba(14,20,36,.92)', C.g, 2.5); txt(g, 'GPU · float', R.x + 804, R.y + 160, C.g, fnt(800, 24));
    txt(g, '6.789012 米', R.x + 804, R.y + 240, C.fg, fnt(700, 34, 'mono')); txt(g, '离摄像机近 → 精度足够', R.x + 804, R.y + 300, C.fg2, fnt(600, 23)); if (u3 > .9) packet(g, [[R.x + 640, R.y + 270], [R.x + 760, R.y + 270]], (t * .7) % 1, C.gold, 8); });
  al(g, u4, () => { const E = [['虚幻引擎五', '引擎里的向量全部改为 double', C.b], ['Godot', '可编译出双精度版本', C.g], ['Unity', '仍是 float，常配合浮动原点', C.o]];
    E.forEach(([a, b, col], i) => { const x = R.x + 20 + i * 430; rr(g, x, R.y + 500, 400, 140, 14, 'rgba(14,20,36,.9)', col, 2); txt(g, a, x + 24, R.y + 545, col, fnt(800, 28)); txt(g, b, x + 24, R.y + 600, C.fg2, fnt(600, 22)); }); });
};
AN.revz = (g, t, R, st) => {
  hdr(g, R, '深度缓冲：能表示的深度值落在哪里');
  const x0 = R.x + 200, x1 = R.x + R.w - 40, X = d => LERP(x0, x1, (Math.log10(d) + 1) / 6), n = .1, f = 1e5;
  [[.1, '0.1 米'], [1, '1 米'], [10, '10 米'], [100, '100 米'], [1e3, '1 公里'], [1e4, '10 公里'], [1e5, '100 公里']].forEach(([d, s]) => txt(g, s, X(d), R.y + 140, C.fg3, fnt(600, 18), 'center'));
  const row = (y, label, col, ds, u) => { txt(g, label, x0 - 20, y, col, fnt(700, 24), 'right'); line(g, [[x0, y], [x1, y]], C.line2, 2); ds.forEach((d, i) => { if (i / ds.length > u || d < n || d > f) return; line(g, [[X(d), y - 22], [X(d), y + 22]], col, 2); }); };
  const std = [], rev = []; for (let i = 0; i < 48; i++) { const z = i / 48; std.push(n * f / (f - z * (f - n))); } for (let k = 0; k < 48; k++) rev.push(n * 2 ** (k * 20 / 48));
  row(R.y + 240, '标准 Z', C.r, std, SS((t - .5) / 2)); row(R.y + 380, '反向 Z + 浮点', C.g, rev, SS((t - 2.5) / 2));
  al(g, pop(t, 1.8), () => txt(g, '几乎所有精度都挤在眼前一米内', X(.4), R.y + 290, C.r, fnt(600, 21)));
  al(g, pop(t, 4), () => txt(g, '在对数尺度上大致均匀', X(10), R.y + 430, C.g, fnt(600, 21)));
  // 穿插演示
  const dz = (y, bad, s) => { txt(g, s, R.x + 20, y - 30, bad ? C.r : C.g, fnt(700, 22)); for (let i = 0; i < 60; i++) for (let j = 0; j < 6; j++) { const x = R.x + 20 + i * 9, yy = y + j * 9, red = bad ? HSH(i + Math.floor(t * 8) * 7, j) > .5 : j < 3; g.fillStyle = red ? '#C9506A' : '#3F7FC9'; g.fillRect(x, yy, 9, 9); } };
  al(g, pop(t, 5.5), () => { dz(R.y + 560, true, '远处两个靠得很近的面：互相穿插、闪烁'); dz(R.y + 680, false, '换成反向 Z 后：前后关系稳定'); });
};

// ---------- 03 LOD ----------
function poly(g, x, y, r, n, col, a = 1) { al(g, a, () => { g.beginPath(); for (let i = 0; i <= n; i++) { const an = i / n * 6.283 - 1.57, rr2 = r * (1 + .12 * Math.sin(an * 3)); i ? g.lineTo(x + Math.cos(an) * rr2, y + Math.sin(an) * rr2) : g.moveTo(x + Math.cos(an) * rr2, y + Math.sin(an) * rr2); } g.fillStyle = col + '33'; g.fill(); g.strokeStyle = col; g.lineWidth = 2; g.stroke(); for (let i = 0; i < n; i++) { const an = i / n * 6.283 - 1.57, rr2 = r * (1 + .12 * Math.sin(an * 3)); line(g, [[x, y], [x + Math.cos(an) * rr2, y + Math.sin(an) * rr2]], col + '66', 1); } }); }
AN.lod = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '细节层次：同一个模型，几个精度版本');
    const y = R.y + 380, cx = R.x + 60; // 摄像机
    g.fillStyle = C.fg2; g.beginPath(); g.moveTo(cx, y - 30); g.lineTo(cx + 50, y); g.lineTo(cx, y + 30); g.closePath(); g.fill(); txt(g, '摄像机', cx + 20, y + 60, C.fg3, fnt(600, 20), 'center');
    const th = [[R.x + 520, 'LOD1'], [R.x + 880, 'LOD2']]; th.forEach(([x, s]) => { line(g, [[x, R.y + 150], [x, R.y + 620]], C.line2, 2, [6, 8]); txt(g, '切到 ' + s, x, R.y + 140, C.fg3, fnt(600, 20), 'center'); });
    const ph = (t * .09) % 1, ox = R.x + 200 + ph * 1000, lvl = ox < th[0][0] ? 0 : ox < th[1][0] ? 1 : 2, N = [48, 16, 7][lvl], r = 150 * 200 / (ox - R.x + 60);
    poly(g, ox, y, r, N, [C.g, C.o, C.r][lvl]);
    const tri = [12000, 1500, 200][lvl]; txt(g, `LOD${lvl} · 约 ${tri} 个三角形（示意）`, ox, y + r + 50, C.fg, fnt(700, 22, 'mono'), 'center');
    [th[0][0], th[1][0]].forEach(x => { const d = Math.abs(ox - x); if (d < 30) al(g, 1 - d / 30, () => txt(g, '跳！', x, y - 200, C.bad, fnt(900, 44), 'center')); });
    al(g, pop(t, 3), () => { [0, 1, 2].forEach(i => { const x = R.x + 120 + i * 220; poly(g, x, R.y + 720, 50, [48, 16, 7][i], [C.g, C.o, C.r][i]); txt(g, 'LOD' + i, x, R.y + 800, C.fg2, fnt(700, 20, 'mono'), 'center'); }); });
    return;
  }
  hdr(g, R, '远处的替身：公告板与层级 LOD');
  // 公告板
  const x0 = R.x + 20, y0 = R.y + 160; txt(g, '公告板（impostor）', x0, y0 - 10, C.g, fnt(800, 26));
  for (let i = 0; i < 9; i++) { const s = 1 - i * .085, x = x0 + 40 + i * 64, y = y0 + 300 - i * 10, h = 150 * s, u = pop(st.tk, .3 + i * .15);
    al(g, u, () => { if (i < 3) { for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(x, y - h + k * h * .25); g.lineTo(x - h * .3, y - h * .35 + k * h * .25); g.lineTo(x + h * .3, y - h * .35 + k * h * .25); g.closePath(); g.fillStyle = '#2E8B6A'; g.fill(); } }
      else { rr(g, x - h * .3, y - h, h * .6, h, 4, 'rgba(46,139,106,.35)', C.gold, 1.5); g.beginPath(); g.moveTo(x, y - h * .92); g.lineTo(x - h * .24, y - h * .1); g.lineTo(x + h * .24, y - h * .1); g.closePath(); g.fillStyle = '#2E8B6A'; g.fill(); } }); }
  al(g, pop(st.tk, 2), () => { txt(g, '近处：真模型', x0 + 40, y0 + 360, C.fg2, fnt(600, 21)); txt(g, '远处：一张始终朝向镜头的图片', x0 + 240, y0 + 400, C.gold, fnt(600, 21)); });
  // HLOD
  const hx = R.x + 720; txt(g, '层级 LOD（HLOD）', hx, y0 - 10, C.o, fnt(800, 26));
  const m = SS((st.tk - 4) / 1.5);
  for (let i = 0; i < 6; i++) { const bx = hx + 30 + (i % 3) * 110, by = y0 + 80 + Math.floor(i / 3) * 120, w = 90, h = 70 + (i * 17) % 30;
    al(g, 1 - m, () => { rr(g, bx, by + 90 - h, w, h, 4, 'rgba(255,178,92,.25)', C.o, 2); g.beginPath(); g.moveTo(bx - 6, by + 90 - h); g.lineTo(bx + w / 2, by + 60 - h); g.lineTo(bx + w + 6, by + 90 - h); g.closePath(); g.fillStyle = 'rgba(255,178,92,.4)'; g.fill(); }); }
  al(g, m, () => { rr(g, hx + 30, y0 + 60, 310, 250, 10, 'rgba(255,178,92,.22)', C.gold, 3); txt(g, '合并成一个低模', hx + 185, y0 + 185, C.fg, fnt(700, 26), 'center'); });
  txt(g, m > .5 ? '绘制调用：6 → 1' : '绘制调用：6', hx + 185, y0 + 360, m > .5 ? C.gold : C.fg2, fnt(800, 28, 'mono'), 'center');
};
function naniteCut(cam, x, y, s, d, out, thr) { const cx = x + s / 2, cy = y + s / 2, dist = Math.max(40, Math.hypot(cx - cam[0], cy - cam[1])); if (d < 6 && s / dist > thr) { const h = s / 2; naniteCut(cam, x, y, h, d + 1, out, thr); naniteCut(cam, x + h, y, h, d + 1, out, thr); naniteCut(cam, x, y + h, h, d + 1, out, thr); naniteCut(cam, x + h, y + h, h, d + 1, out, thr); } else out.push([x, y, s, d]); }
AN.nanite = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, 'Nanite：簇 → 层层简化 → 运行时按误差挑选');
    const S = 600, x0 = R.x + 30, y0 = R.y + 110, cam = [x0 + S * (.5 + .45 * Math.sin(t * .35)), y0 + S + 30];
    const out = []; naniteCut(cam, x0, y0, S, 0, out, .26);
    out.forEach(([x, y, s, d], i) => { const hue = Math.floor(HSH(Math.floor(x * 7 + y * 13), d) * 360); g.fillStyle = `hsla(${hue},55%,55%,.30)`; g.strokeStyle = `hsla(${hue},70%,70%,.8)`; g.lineWidth = 1;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + s, y); g.lineTo(x, y + s); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x + s, y); g.lineTo(x + s, y + s); g.lineTo(x, y + s); g.closePath(); g.fill(); g.stroke(); });
    g.fillStyle = C.gold; g.beginPath(); g.moveTo(cam[0], cam[1] - 26); g.lineTo(cam[0] - 18, cam[1] + 8); g.lineTo(cam[0] + 18, cam[1] + 8); g.closePath(); g.fill(); txt(g, '摄像机', cam[0], cam[1] + 30, C.gold, fnt(700, 20), 'center');
    // DAG
    const dx = R.x + 720, dw = 560, cnt = [0, 0, 0, 0, 0, 0, 0]; out.forEach(o => cnt[o[3]]++);
    txt(g, '簇的层级（有向无环图）', dx, R.y + 130, C.fg, fnt(700, 24));
    for (let L = 0; L <= 6; L++) { const n = Math.min(2 ** L, 32), y = R.y + 190 + L * 88, u = pop(t, .3 + L * .25);
      al(g, u, () => { txt(g, L === 0 ? '最粗' : L === 6 ? '最细' : '', dx - 10, y, C.fg3, fnt(600, 18), 'right');
        const sel = Math.min(n, Math.round(cnt[L] * n / (4 ** L || 1) * 1.0 + (cnt[L] > 0 ? 1 : 0)));
        for (let i = 0; i < n; i++) { const x = dx + 20 + (i + .5) * (dw - 40) / n; if (L < 6) { const m = Math.min(2 ** (L + 1), 32); [Math.floor(i * m / n), Math.min(m - 1, Math.floor(i * m / n) + 1)].forEach(j => line(g, [[x, y + 8], [dx + 20 + (j + .5) * (dw - 40) / m, y + 80]], 'rgba(255,255,255,.08)', 1)); }
          dot(g, x, y, Math.max(3, 9 - L), i < sel ? C.gold : C.line2); } }); }
    txt(g, '金色：这一帧被选中的簇组', dx, R.y + 800, C.gold, fnt(600, 21));
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '三角形只有一个像素大时');
    const px = 54, x0 = R.x + 20, y0 = R.y + 130, nx = 11, ny = 9;
    const panel = (ox, title, hw) => { txt(g, title, ox, y0 - 16, hw ? C.r : C.g, fnt(800, 26));
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) rr(g, ox + i * px, y0 + j * px, px - 2, px - 2, 3, 'rgba(255,255,255,.03)', C.line, 1);
      const PP = [[1, 1], [4, 2], [8, 1], [2, 5], [6, 6], [9, 4], [5, 4]]; for (let k = 0; k < 7; k++) { const [i, j] = PP[k], u = pop(st.tk, .5 + k * .4);
        al(g, u, () => { if (hw) { const qi = i - i % 2, qj = j - j % 2; for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) rr(g, ox + (qi + a) * px, y0 + (qj + b) * px, px - 2, px - 2, 3, (qi + a === i && qj + b === j) ? 'rgba(255,122,147,.7)' : 'rgba(255,122,147,.18)'); }
          else rr(g, ox + i * px, y0 + j * px, px - 2, px - 2, 3, 'rgba(95,224,160,.7)');
          const cx = ox + (i + .5) * px, cy = y0 + (j + .5) * px; g.beginPath(); g.moveTo(cx - 14, cy + 12); g.lineTo(cx + 16, cy + 6); g.lineTo(cx - 2, cy - 15); g.closePath(); g.strokeStyle = '#fff'; g.lineWidth = 2; g.stroke(); }); } };
    panel(x0, '硬件光栅化：按 2×2 像素一组着色', true); panel(x0 + 640, '软件光栅化：计算着色器逐个写像素', false);
    al(g, pop(st.tk, 4), () => { txt(g, '一个像素的三角形，要算四个像素：浪费约四分之三', x0, y0 + ny * px + 40, C.r, fnt(600, 22)); txt(g, '每个线程负责一个小三角形', x0 + 640, y0 + ny * px + 40, C.g, fnt(600, 22)); });
    return;
  }
  hdr(g, R, 'Nanite 一步步长大');
  events(g, st.tk, R, [['2020', 'PS5 首次演示', '只支持静态网格', C.b], ['2022', 'UE 5.0 正式', '', C.b], ['5.3', '置换细分', '', C.g], ['5.5', '骨骼网格', '实验', C.o], ['5.7', '植被', '实验', C.gold]], { gap: .7, y: 380 });
  al(g, pop(st.tk, 5), () => banner(g, R, '树叶又薄又碎、还会随风摆动：对簇结构最大的考验', 1));
};

// ---------- 04 剔除 ----------
function camWedge(R, t, wide) { const c = [R.x + 120, R.y + R.h / 2 + 20], a = .35 * Math.sin(t * .25), fov = .55, far = wide ? 1180 : 900; return { c, a, fov, far }; }
function objs(R, n = 130) { const r = RND(7), o = []; for (let i = 0; i < n; i++) o.push([R.x + 200 + r() * (R.w - 230), R.y + 110 + r() * (R.h - 150), 6 + r() * 18]); return o; }
AN.frustum = (g, t, R, st) => {
  const cheap = st.bi === 4; hdr(g, R, cheap ? '还有一些便宜的剔除' : '视锥剔除：视野之外的不画');
  const W = camWedge(R, t, !cheap), O = objs(R), dn = 470;
  g.save(); g.beginPath(); g.rect(R.x, R.y + 80, R.w, R.h - 80); g.clip();
  al(g, 1, () => { g.beginPath(); g.moveTo(...W.c); g.arc(W.c[0], W.c[1], W.far, W.a - W.fov, W.a + W.fov); g.closePath(); g.fillStyle = 'rgba(92,180,255,.07)'; g.fill(); g.strokeStyle = C.b; g.lineWidth = 2; g.stroke(); });
  if (cheap) { g.save(); g.setLineDash([8, 8]); g.strokeStyle = C.o; g.lineWidth = 2; g.beginPath(); g.arc(W.c[0], W.c[1], dn, W.a - W.fov, W.a + W.fov); g.stroke(); g.restore(); txt(g, '小物体只画到这里', W.c[0] + Math.cos(W.a) * dn, W.c[1] + Math.sin(W.a) * dn - 30, C.o, fnt(700, 20), 'center'); }
  let nd = 0;
  O.forEach(([x, y, r]) => { const dx = x - W.c[0], dy = y - W.c[1], d = Math.hypot(dx, dy), an = Math.atan2(dy, dx) - W.a, perp = Math.abs(Math.sin(an)) * d;
    const inside = d < W.far + r && Math.cos(an) > 0 && (Math.abs(an) < W.fov || perp < r * 1.2); const small = cheap && r < 12 && d > dn;
    const vis = inside && !small; if (vis) nd++;
    rr(g, x - r, y - r, 2 * r, 2 * r, 4, vis ? 'rgba(95,211,154,.35)' : small && inside ? 'rgba(255,178,92,.15)' : 'rgba(255,255,255,.04)', vis ? C.ok : small && inside ? C.o : C.line2, 1.5); });
  g.restore();
  g.fillStyle = C.fg; g.beginPath(); g.arc(W.c[0], W.c[1], 16, 0, 7); g.fill(); txt(g, '摄像机', W.c[0], W.c[1] + 40, C.fg2, fnt(600, 20), 'center');
  txt(g, `这一帧要画 ${nd} / ${O.length} 个物体`, R.x + R.w - 20, R.y + 60, C.fg, fnt(700, 24, 'mono'), 'right');
  if (cheap) al(g, pop(st.tk, 6), () => { // 阴影投射者
    const ox = W.c[0] + Math.cos(W.a + W.fov + .3) * 520, oy = Math.min(R.y + R.h - 60, W.c[1] + Math.sin(W.a + W.fov + .3) * 520), L = [Math.cos(W.a - .9), Math.sin(W.a - .9)];
    g.beginPath(); g.moveTo(ox - 22, oy); g.lineTo(ox + 22, oy); g.lineTo(ox + 22 + L[0] * 300, oy + L[1] * 300); g.lineTo(ox - 22 + L[0] * 300, oy + L[1] * 300); g.closePath(); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill(); g.strokeStyle = C.gold; g.setLineDash([6, 6]); g.stroke(); g.setLineDash([]);
    rr(g, ox - 22, oy - 22, 44, 44, 4, 'rgba(255,210,122,.3)', C.gold, 2.5); rr(g, ox + 34, oy + 6, 420, 40, 8, 'rgba(11,16,32,.9)'); txt(g, '视野外，但影子投进画面：阴影要画它', ox + 44, oy + 26, C.gold, fnt(700, 21)); });
};
AN.occl = (g, t, R, st) => {
  hdr(g, R, '遮挡剔除：被挡住的不画');
  const c = [R.x + 120, R.y + R.h / 2 + 20], B = [[R.x + 420, R.y + 230, 120, 190], [R.x + 520, R.y + 560, 160, 110]], O = objs({ x: R.x, y: R.y, w: 1000, h: R.h }, 90);
  const blocked = (x, y) => B.some(([bx, by, bw, bh]) => { const cs = [[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]].map(([px, py]) => Math.atan2(py - c[1], px - c[0])); const a = Math.atan2(y - c[1], x - c[0]); const lo = Math.min(...cs), hi = Math.max(...cs); const dB = Math.hypot(bx + bw / 2 - c[0], by + bh / 2 - c[1]); return a > lo && a < hi && Math.hypot(x - c[0], y - c[1]) > dB + 40; });
  const u = pop(t, 1.2);
  g.save(); g.beginPath(); g.rect(R.x, R.y + 80, 1000, R.h - 80); g.clip();
  B.forEach(([bx, by, bw, bh]) => { const cs = [[bx, by], [bx + bw, by], [bx, by + bh], [bx + bw, by + bh]].map(([px, py]) => Math.atan2(py - c[1], px - c[0])); const lo = Math.min(...cs), hi = Math.max(...cs);
    al(g, u, () => { g.beginPath(); g.moveTo(c[0] + Math.cos(lo) * 300, c[1] + Math.sin(lo) * 300); g.arc(c[0], c[1], 1100, lo, hi); g.lineTo(c[0] + Math.cos(hi) * 300, c[1] + Math.sin(hi) * 300); g.closePath(); g.fillStyle = 'rgba(255,107,107,.07)'; g.fill(); });
    rr(g, bx, by, bw, bh, 6, 'rgba(163,174,195,.35)', C.fg2, 2.5); });
  g.restore();
  let nh = 0; O.forEach(([x, y, r]) => { if (B.some(([bx, by, bw, bh]) => x > bx - r && x < bx + bw + r && y > by - r && y < by + bh + r) || x > R.x + 1000) return; const h = u > .5 && blocked(x, y); if (h) nh++;
    rr(g, x - r * .7, y - r * .7, r * 1.4, r * 1.4, 4, h ? 'rgba(255,255,255,.03)' : 'rgba(95,211,154,.3)', h ? C.bad : C.ok, 1.5); if (h) cross(g, x, y, 1, C.bad, 5); });
  g.fillStyle = C.fg; g.beginPath(); g.arc(c[0], c[1], 16, 0, 7); g.fill();
  al(g, pop(t, 2.5), () => txt(g, `被挡住：${nh} 个`, R.x + 700, R.y + 120, C.bad, fnt(700, 24, 'mono')));
  // PVS 小图
  const px = R.x + 1040, py = R.y + 160; al(g, pop(t, 4), () => { txt(g, '室内：潜在可见集（离线算好）', px, py - 20, C.fg2, fnt(700, 21));
    const rooms = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], on = Math.floor(t / 2.5) % 6, vis = { 0: [1, 3], 1: [0, 2, 4], 2: [1, 5], 3: [0, 4], 4: [1, 3, 5], 5: [2, 4] }[on];
    rooms.forEach(([i, j], k) => rr(g, px + i * 80, py + j * 80, 72, 72, 6, k === on ? 'rgba(255,210,122,.4)' : vis.includes(k) ? 'rgba(95,211,154,.25)' : 'rgba(255,255,255,.03)', k === on ? C.gold : vis.includes(k) ? C.ok : C.line2, 2));
    txt(g, '金：所在房间 · 绿：能看见的房间', px, py + 190, C.fg3, fnt(500, 18)); });
};
// 合成一张深度图（越近越小）
let DEP = null;
function depthMap() { if (DEP) return DEP; const W = 64, H = 32, d = new Float32Array(W * H); for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { let z = 1; const ground = j > 22 ? .3 + (31 - j) * .05 : 1; z = Math.min(z, ground); [[6, 18, 12, .35], [20, 34, 10, .55], [38, 50, 8, .25], [52, 62, 14, .6]].forEach(([a, b, h, zz]) => { if (i >= a && i < b && j >= h && j <= 23) z = Math.min(z, zz); }); d[j * W + i] = z; }
  const L = [{ W, H, d }]; while (L[L.length - 1].W > 4) { const p = L[L.length - 1], w = p.W / 2, h = p.H / 2, q = new Float32Array(w * h); for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) q[j * w + i] = Math.max(p.d[2 * j * p.W + 2 * i], p.d[2 * j * p.W + 2 * i + 1], p.d[(2 * j + 1) * p.W + 2 * i], p.d[(2 * j + 1) * p.W + 2 * i + 1]); L.push({ W: w, H: h, d: q }); } return DEP = L; }
AN.hzb = (g, t, R, st) => {
  hdr(g, R, 'GPU 驱动：深度金字塔 + 计算着色器');
  const L = depthMap(), x0 = R.x + 20, box = [22, 13, 25, 16], nearZ = .82; // 层 0 上的矩形（在楼后面）
  for (let k = 0; k < 4; k++) { const lv = L[k], s = 360 / lv.W, ox = x0 + (k % 2) * 400, oy = R.y + 110 + Math.floor(k / 2) * 250, u = pop(t, .3 + k * .5);
    al(g, u, () => { for (let j = 0; j < lv.H; j++) for (let i = 0; i < lv.W; i++) { const v = lv.d[j * lv.W + i], b = Math.round(230 - v * 190); g.fillStyle = v >= 1 ? '#0E1424' : `rgb(${b * .6},${b * .75},${b})`; g.fillRect(ox + i * s, oy + j * s, s - (s > 8 ? 1 : 0), s - (s > 8 ? 1 : 0)); }
      txt(g, `第 ${k} 层 ${lv.W}×${lv.H}` + (k ? '（2×2 取最远）' : '（上一帧深度）'), ox, oy + lv.H * s + 24, k === 2 && t > 4 ? C.gold : C.fg3, fnt(600, 19, 'mono'));
      const bs = 2 ** k; if (t > 3) { const bx0 = Math.floor(box[0] / bs), by0 = Math.floor(box[1] / bs), bx1 = Math.floor(box[2] / bs), by1 = Math.floor(box[3] / bs); rr(g, ox + bx0 * s, oy + by0 * s, (bx1 - bx0 + 1) * s, (by1 - by0 + 1) * s, 2, null, k === 2 ? C.gold : 'rgba(255,210,122,.6)', k === 2 ? 3.5 : 1.5); } }); }
  const lv2 = L[2], cells = []; for (let j = box[1] >> 2; j <= box[3] >> 2; j++) for (let i = box[0] >> 2; i <= box[2] >> 2; i++) cells.push(lv2.d[j * lv2.W + i]); const far = Math.max(...cells);
  al(g, pop(t, 5), () => { txt(g, `盒子最近深度 ${nearZ.toFixed(2)} > 金框区域最远深度 ${far.toFixed(2)}`, x0, R.y + R.h - 40, C.fg, fnt(700, 22, 'mono')); txt(g, '→ 被挡住，剔除', x0 + 610, R.y + R.h - 40, C.bad, fnt(800, 24)); });
  // 流程
  const fx = R.x + 930, it = [['物体列表', '常驻显存', C.b], ['剔除计算着色器', '每个物体一个线程', C.g], ['间接绘制参数', '留下来的物体', C.o], ['一条 DrawIndirect', 'CPU 只发一次', C.gold]];
  it.forEach(([a, b, col], i) => { const u = pop(t, 6 + i * .8), yy = R.y + 120 + i * 165; node(g, fx, yy, 350, 115, a, col, u, b); if (i < 3) arrow(g, fx + 175, yy + 118, fx + 175, yy + 160, C.fg3, 3, 10, u); });
};

// ---------- 05 IO ----------
AN.io = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '机械硬盘：读得慢，找得更慢');
    const cx = R.x + 330, cy = R.y + 450, r = 260;
    g.save(); g.translate(cx, cy); g.rotate(t * 2.2); for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(0, 0, r - k * 42, 0, 7); g.strokeStyle = C.line2; g.lineWidth = 1.5; g.stroke(); }
    for (let k = 0; k < 14; k++) { const tr = k % 4, a = k * .9; g.beginPath(); g.arc(0, 0, r - 21 - tr * 42, a, a + .32); g.strokeStyle = [C.b, C.g, C.o, C.b][tr]; g.lineWidth = 16; g.stroke(); }
    g.restore(); dot(g, cx, cy, 30, '#1B2540');
    const trk = [0, 3, 1, 2, 0][Math.floor(t / 1.6) % 5], ang = -2.3 + trk * .16 + .05 * Math.sin(t * 9) * (t % 1.6 < .5 ? 1 : 0);
    const ax = cx + 330, ay = cy - 200; g.save(); g.translate(ax, ay); g.rotate(ang); rr(g, -6, -6, 12, 380, 6, C.fg3); g.restore(); dot(g, ax, ay, 16, C.fg2);
    txt(g, '磁头来回寻道', ax, ay - 40, C.fg2, fnt(600, 22), 'center');
    al(g, pop(t, 2), () => { const x = R.x + 760; txt(g, '同一片区域的数据', x, R.y + 160, C.fg, fnt(700, 26)); txt(g, '按顺序排，甚至复制好几份', x, R.y + 200, C.fg2, fnt(600, 23));
      for (let i = 0; i < 12; i++) rr(g, x + i * 42, R.y + 240, 38, 40, 4, ['rgba(92,180,255,.5)', 'rgba(95,224,160,.5)', 'rgba(92,180,255,.5)'][i % 3], null); });
    al(g, pop(t, 4), () => { const x = R.x + 760, y = R.y + 400; txt(g, '玩家骑马的速度', x, y, C.fg2, fnt(600, 24)); rr(g, x, y + 24, 500, 40, 8, 'rgba(255,178,92,.35)', C.o, 2); txt(g, '需要的读取速度', x + 512, y + 44, C.fg3, fnt(500, 20));
      txt(g, '硬盘能提供的', x, y + 120, C.fg2, fnt(600, 24)); rr(g, x, y + 144, 280, 40, 8, 'rgba(92,180,255,.35)', C.b, 2); txt(g, '跟不上 → 放慢速度、用地形挡住视线', x, y + 230, C.bad, fnt(700, 24)); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '每秒能读多少数据（原始速度）', '机械硬盘与 SATA 固态为典型值，主机为官方规格');
    bars(g, R.x + 40, R.y + 150, R.w - 80, 520, [['机械硬盘', .1, C.fg3], ['SATA 固态', .55, C.b], ['Xbox Series X', 2.4, C.g], ['PS5', 5.5, C.gold]], st.tk, { gap: .5, fmt: v => v + ' GB/s' });
    return;
  }
  hdr(g, R, '压缩存放，硬件解压');
  const it = [['硬盘', '压缩后的数据', C.b], ['解压单元', '主机专用硬件 / 显卡', C.gold], ['内存', '可直接使用的数据', C.g]];
  flowBoxes(g, st.tk, R, it, R.y + 160, { h: 130, gap: .8 });
  const w = (R.w - 120) / 3; for (let k = 0; k < 6; k++) { const ph = ((st.tk * .35 + k / 6) % 1); if (st.tk < 2.5) continue; const x = R.x + 20 + LERP(w / 2, 2 * (w + 40) + w / 2, ph), sz = ph < .5 ? 26 : 26 + 30 * SS((ph - .5) * 4); rr(g, x - sz / 2, R.y + 380 - sz / 2, sz, sz, 5, ph < .5 ? C.b : C.g); }
  al(g, pop(st.tk, 3.5), () => { txt(g, '小方块 = 一块数据：读进来的是压缩后的小块，解压后变大', R.x + 20, R.y + 470, C.fg2, fnt(600, 23)); txt(g, '解压不占处理器：处理器留给游戏逻辑', R.x + 20, R.y + 520, C.gold, fnt(700, 25)); });
};
AN.cook = (g, t, R, st) => {
  hdr(g, R, '烘焙与打包：转格式，按加载顺序排好');
  const src = [['hero.fbx', '模型'], ['rock_4k.png', '贴图'], ['wind.wav', '声音'], ['Tree.uasset', '编辑器资产']];
  src.forEach(([a, b], i) => { const u = pop(t, .3 + i * .3), y = R.y + 130 + i * 120; node(g, R.x + 20, y, 300, 90, a, C.fg2, u, b); arrow(g, R.x + 330, y + 45, R.x + 420, R.y + 370, C.fg3, 2, 9, u); });
  const u1 = pop(t, 1.8); al(g, u1, () => { g.save(); g.translate(R.x + 520, R.y + 370); g.rotate(t * .8); for (let k = 0; k < 8; k++) { g.rotate(Math.PI / 4); rr(g, -14, -84, 28, 30, 4, C.gold); } g.restore(); dot(g, R.x + 520, R.y + 370, 64, '#2A2412'); txt(g, '烘焙', R.x + 520, R.y + 370, C.gold, fnt(800, 30), 'center'); txt(g, '转成目标平台格式', R.x + 520, R.y + 490, C.fg2, fnt(600, 22), 'center'); });
  const cx = R.x + 680, cw = R.w - 700, cy = R.y + 330;
  al(g, pop(t, 3), () => { arrow(g, R.x + 600, cy + 40, cx - 10, cy + 40, C.fg3, 3, 10); txt(g, '容器文件（按加载顺序）', cx, cy - 30, C.fg, fnt(700, 24));
    const cols = [C.b, C.b, C.b, C.g, C.g, C.o, C.o, C.o, C.p, C.p]; const n = 22, bw = cw / n; for (let i = 0; i < n; i++) rr(g, cx + i * bw, cy, bw - 3, 80, 4, cols[Math.floor(i / n * cols.length)] + '66', cols[Math.floor(i / n * cols.length)], 1.5);
    const ph = CL((t - 4.5) / 6); line(g, [[cx, cy + 100], [cx + cw * ph, cy + 100]], C.gold, 5); dot(g, cx + cw * ph, cy + 100, 9, C.gold);
    txt(g, '区域 A → 区域 B → 区域 C … 一次顺序读完', cx, cy + 150, C.fg2, fnt(600, 22)); });
};
AN.w4 = (g, t, R, st) => {
  hdr(g, R, '《巫师 4》技术演示（2025）', '画面为示意，并非演示截图');
  const y0 = R.y + 560;
  for (let i = 0; i < 150; i++) { const x = R.x + HSH(i, 1) * R.w, d = HSH(i, 2), y = y0 - 260 + d * 300, h = 40 + d * 90, sw = Math.sin(t * 1.5 + i) * 3 * d; g.beginPath(); g.moveTo(x + sw, y - h); g.lineTo(x - h * .3, y); g.lineTo(x + h * .3, y); g.closePath(); g.fillStyle = `rgba(${40 + d * 20},${110 + d * 50},${80 + d * 30},${.35 + d * .5})`; g.fill(); }
  for (let i = 0; i < 9; i++) { const x = R.x + 640 + i * 70, h = 60 + HSH(i, 5) * 60; rr(g, x, y0 + 40 - h, 60, h, 3, '#3A3450', '#5A4F78', 1.5); g.beginPath(); g.moveTo(x - 6, y0 + 40 - h); g.lineTo(x + 30, y0 + 10 - h); g.lineTo(x + 66, y0 + 40 - h); g.closePath(); g.fillStyle = '#4A3F66'; g.fill(); }
  for (let i = 0; i < 60; i++) { const x = R.x + 600 + ((HSH(i, 7) * 700 + t * (HSH(i, 8) - .5) * 40) % 700 + 700) % 700, y = y0 + 70 + HSH(i, 9) * 70; dot(g, x, y, 5, ['#E9C8A0', '#C9A0E9', '#A0C9E9'][i % 3]); }
  ['PS5', '60 fps', '茂密森林', '拥挤城镇'].forEach((s, i) => al(g, pop(t, .5 + i * .4), () => chip(g, s, R.x + 20 + i * 180, R.y + 130, [C.b, C.gold, C.g, C.p][i])));
  // 帧时间
  const gx = R.x + 20, gy = R.y + R.h - 150, gw = 620, gh = 110; rr(g, gx, gy, gw, gh, 10, 'rgba(14,20,36,.85)', C.line2, 1.5);
  const pts = []; for (let i = 0; i <= 60; i++) pts.push([gx + i * gw / 60, gy + gh * .55 + 6 * Math.sin(i * 1.3 + t * 4) * HSH(i, Math.floor(t))]); line(g, pts, C.ok, 2.5);
  txt(g, '16.6 ms', gx + gw + 14, gy + gh * .55, C.ok, fnt(700, 20, 'mono')); txt(g, '帧时间：流送时也保持平稳', gx + 14, gy + 22, C.fg2, fnt(600, 19));
};

// ---------- 06 昙花一现 ----------
AN.graves = (g, t, R, st) => {
  lifespans(g, t, R, st, [['超大纹理', 2011, 2020, 'id Tech 7 不再使用', 0], ['硬件曲面细分', 2009, 2022, 'UE5 移除', 1], ['“无限细节”点云', 2011, 2017, '未被游戏采用', 2]], '昙花一现', '条形为大致的流行时段（示意）', 2007, 2027, [2010, 2015, 2020, 2025]);
  if (st.k === 2) al(g, pop(st.tk, 6), () => banner(g, R, '押中了方向：按需提供细节；没押中实现方式', 1));
};

// ---------- 07 对照 ----------
AN.table = (g, t, R, st) => {
  hdr(g, R, '三大引擎对照：装得下', '内置 = 引擎自带完整方案 · 部分 = 有积木 · 自写 = 团队自己实现');
  const rows = ['流式加载', '大坐标', '几何细节', '剔除', '打包与 IO'], cols = ['虚幻引擎五', 'Unity', 'Godot'];
  const D = [[['World Partition', 2], ['Addressables + 自写分块', 1], ['ResourceLoader + 自写', 1]],
    [['LWC 双精度', 2], ['浮动原点（自写）', 0], ['precision=double 编译', 1]],
    [['Nanite', 2], ['LOD Group · GPU 常驻绘制', 1], ['自动 LOD · Visibility Range', 1]],
    [['HZB · GPU 剔除', 2], ['Umbra 烘焙 · GPU 遮挡剔除', 2], ['Occluder（Embree 烘焙）', 1]],
    [['IoStore · Oodle', 2], ['AssetBundle · LZ4', 1], ['.pck 资源包', 1]]];
  const x0 = R.x + 20, cw0 = 220, cw = (R.w - 40 - cw0) / 3, y0 = R.y + 140, rh = 104, K = [[C.bad, '自写'], [C.gold, '部分'], [C.ok, '内置']];
  cols.forEach((c, j) => { const vis = j === 0 || st.k >= 1; al(g, vis ? pop(st.k === (j ? 1 : 0) ? (j ? st.tk : t) : 99, .2 + j * .3) : 0, () => txt(g, c, x0 + cw0 + j * cw + cw / 2, y0, C.fg, fnt(800, 30), 'center')); });
  rows.forEach((r, i) => { const y = y0 + 40 + i * rh; txt(g, r, x0, y + rh / 2, C.fg2, fnt(700, 26)); line(g, [[x0, y], [R.x + R.w - 20, y]], C.line, 1);
    D[i].forEach(([s, lv], j) => { const vis = j === 0 || st.k >= 1; if (!vis) return; const u = pop(j === 0 ? (st.k === 0 ? t : 99) : (st.k === 1 ? st.tk : 99), .6 + i * .35 + (j - 1) * .2);
      al(g, u * (st.k === 0 || j > 0 || st.k === 2 ? 1 : 1), () => { const x = x0 + cw0 + j * cw + 10; rr(g, x, y + 14, cw - 20, rh - 28, 12, K[lv][0] + '18', K[lv][0], 2); txt(g, s, x + 20, y + rh / 2, C.fg, fnt(600, 22)); txt(g, K[lv][1], x + cw - 40, y + rh / 2, K[lv][0], fnt(800, 20), 'right'); }); }); });
  if (st.k === 2) al(g, pop(st.tk, .5), () => banner(g, R, '虚幻：买现成的方案 · Unity / Godot：自己补上这一层，换来控制权和更轻的引擎', 1));
};

// ---------- 08 角色 ----------
AN.roles = (g, t, R, st) => {
  if (st.k <= 1) {
    hdr(g, R, '谁来做这些事');
    const D = [['引擎程序', ['负责：流式加载 · 内存 · 线程调度 · 坐标系统', '技能：C++ · 并发与异步 · 内存管理', '数据结构 · 性能分析'], C.b, 0],
      ['渲染程序', ['负责：LOD · 剔除 · GPU 驱动渲染', '技能：图形接口 · 着色器语言', '线性代数 · GPU 性能分析工具'], C.g, 1],
      ['平台与 IO', ['负责：打包 · 压缩 · 存储 · 主机适配', '技能：文件系统 · 压缩算法', '各平台的认证规范'], C.o, 1]];
    const w = (R.w - 60) / 3;
    D.forEach(([h, ls, col, kk], i) => { if (st.k < kk) return; const u = pop(st.k === kk ? (kk ? st.tk : t) : 99, .3 + (kk ? (i - 1) * 2.5 : 0)); g.save(); g.translate(0, (1 - u) * 20); card(g, R.x + i * (w + 30), R.y + 130, w, 330, h, ls, col, u, st.k === kk, 27); g.restore(); });
    al(g, pop(t, 2), () => { const tools = ['Unreal Insights', 'Unity Profiler', 'RenderDoc', 'PIX', 'Nsight', 'Razor（PS）']; let x = R.x; txt(g, '常用工具', x, R.y + 560, C.fg3, fnt(700, 26)); x += 140; tools.forEach((s, i) => { x += chip(g, s, x, R.y + 560, C.p, pop(t, 2.3 + i * .2), 24) + 16; }); });
    return;
  }
  if (st.k === 2) {
    hdr(g, R, '一个入门练习');
    ['做一张按网格流式加载的地图', '给物体加上 LOD', '加上视锥剔除', '用性能分析工具看每一帧的时间花在哪里'].forEach((s, i) => check(g, R.x + 40, R.y + 170 + i * 100, s, pop(st.tk, 1 + i * 1.6), C.ok, 32));
    return;
  }
  hdr(g, R, '下一集');
  al(g, pop(st.tk, .3), () => { rr(g, R.x + 260, R.y + 150, R.w - 520, 420, 22, 'rgba(14,20,36,.92)', C.g, 3); txt(g, '第二集', R.x + R.w / 2, R.y + 220, C.g, fnt(700, 30), 'center'); txt(g, '画得出', R.x + R.w / 2, R.y + 320, C.fg, fnt(800, 80, 'serif'), 'center');
    txt(g, '地形 · 植被 · 全局光照 · 天空、云与水 · 帧预算', R.x + R.w / 2, R.y + 440, C.fg2, fnt(600, 30), 'center'); });
};
