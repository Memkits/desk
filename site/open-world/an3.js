// 第三集动画：造得出
// ---------- 侵蚀模拟（与代码卡同一套步骤，示意参数） ----------
const ER = {};
function erodeSim() {
  if (ER.H) return ER;
  const N = 128, H = new Float32Array(N * N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) H[j * N + i] = HM(i / N, j / N) * .9 + .05 * Math.sin(i * .05);
  const flow = new Float32Array(N * N), dep = new Float32Array(N * N), r = RND(11), marks = [4000, 14000, 40000];
  ER.snaps = [H.slice()]; ER.paths = [];
  const hg = (x, y) => { const xi = x | 0, yi = y | 0, u = x - xi, v = y - yi, k = yi * N + xi, a = H[k], b = H[k + 1], c = H[k + N], d = H[k + N + 1];
    return [(b - a) * (1 - v) + (d - c) * v, (c - a) * (1 - u) + (d - b) * u, a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v]; };
  for (let n = 1; n <= 40000; n++) {
    let x = 2 + r() * (N - 5), y = 2 + r() * (N - 5), dx = 0, dy = 0, sp = 1, w = 1, sed = 0; const path = n <= 40 ? [] : null;
    for (let s = 0; s < 48; s++) {
      const xi = x | 0, yi = y | 0, u = x - xi, v = y - yi, [gx, gy, h] = hg(x, y);
      dx = dx * .1 - gx * .9; dy = dy * .1 - gy * .9; const L = Math.hypot(dx, dy); if (L < 1e-7) break; dx /= L; dy /= L;
      const nx = x + dx, ny = y + dy; if (nx < 2 || ny < 2 || nx >= N - 3 || ny >= N - 3) break;
      const dh = hg(nx, ny)[2] - h, k = yi * N + xi; flow[k] += w; if (path) path.push([x / N, y / N]);
      const cap = Math.max(-dh, .002) * sp * w * 6;
      if (sed > cap || dh > 0) { const dr = dh > 0 ? Math.min(dh, sed) : (sed - cap) * .3; sed -= dr; H[k] += dr * (1 - u) * (1 - v); H[k + 1] += dr * u * (1 - v); H[k + N] += dr * (1 - u) * v; H[k + N + 1] += dr * u * v; dep[k] += dr; }
      else { const tk = Math.min((cap - sed) * .3, -dh); for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) H[k + b * N + a] -= tk * ((a || b) ? .1 : .2); sed += tk; }
      sp = Math.sqrt(Math.max(0, sp * sp - dh * 4)); w *= .985; x = nx; y = ny;
    }
    if (path) ER.paths.push(path);
    if (marks.includes(n)) ER.snaps.push(H.slice());
  }
  Object.assign(ER, { N, H, flow, dep, cv: {} }); return ER;
}
function slopeAt(H, N, i, j) { const k = j * N + i; return Math.hypot(H[k + 1] - H[k - 1], H[k + N] - H[k - N]) * N * .5; }
function erCanvas(key, f) { // f(i,j,H,N) -> [r,g,b]
  const E = erodeSim(); if (E.cv[key]) return E.cv[key]; const N = E.N, c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d'), im = x.createImageData(N, N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const [r, gg, b] = f(CL(i, 1, N - 2), CL(j, 1, N - 2), E), k = (j * N + i) * 4; im.data[k] = r; im.data[k + 1] = gg; im.data[k + 2] = b; im.data[k + 3] = 255; }
  x.putImageData(im, 0, 0); return (E.cv[key] = c);
}
function relief(H, N, i, j) { const k = j * N + i, gx = (H[k + 1] - H[k - 1]) * N * .9, gy = (H[k + N] - H[k - N]) * N * .9, l = CL(.55 + (-gx * .6 - gy * .5) / Math.hypot(gx, gy, 1) * .7, .08, 1.15), h = H[k];
  const c = h > .78 ? [215, 220, 228] : h > .55 ? [125, 135, 105] : h > .32 ? [80, 135, 90] : [62, 105, 135]; return c.map(v => CL(v * l, 0, 255)); }
const reliefCanvas = s => erCanvas('rel' + s, (i, j, E) => relief(E.snaps[s], E.N, i, j));
const MASKS = {
  h: (i, j, E) => { const v = E.H[j * E.N + i] * 255; return [v, v, v]; },
  flow: (i, j, E) => { const v = CL(Math.log(1 + E.flow[j * E.N + i]) / 6); return [40 + 60 * v, 80 + 120 * v, 120 + 135 * v]; },
  dep: (i, j, E) => { const v = CL(E.dep[j * E.N + i] * 60); return [30 + 225 * v, 30 + 180 * v, 40 + 60 * v]; },
  slope: (i, j, E) => { const v = CL(slopeAt(E.H, E.N, i, j) / 2.2); return [40 + 215 * v, 50 + 80 * v, 70 + 60 * v]; },
};
function wetMap() { const E = erodeSim(); if (E.wet) return E.wet; const N = E.N; let a = new Float32Array(N * N); for (let k = 0; k < N * N; k++) a[k] = CL(Math.log(1 + E.flow[k]) / 6 - .35, 0, 1) * 2;
  for (let p = 0; p < 3; p++) { const b = new Float32Array(N * N); for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) { let s = 0; for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) s += a[(j + y) * N + i + x]; b[j * N + i] = Math.min(1, s / 9 * 1.6); } a = b; }
  return (E.wet = a); }
function poissonPts(w, h, r, seed, maxN = 4000) { // Bridson
  const R = RND(seed), cs = r / Math.SQRT2, gw = Math.ceil(w / cs), gh = Math.ceil(h / cs), grid = new Int32Array(gw * gh).fill(-1), P = [], act = [];
  const add = p => { P.push(p); act.push(P.length - 1); grid[((p[1] / cs) | 0) * gw + ((p[0] / cs) | 0)] = P.length - 1; };
  add([w * .5, h * .5]);
  while (act.length && P.length < maxN) { const ai = (R() * act.length) | 0, p = P[act[ai]]; let ok = false;
    for (let k = 0; k < 20; k++) { const an = R() * 6.283, d = r * (1 + R()), q = [p[0] + Math.cos(an) * d, p[1] + Math.sin(an) * d]; if (q[0] < 0 || q[1] < 0 || q[0] >= w || q[1] >= h) continue;
      const gx = (q[0] / cs) | 0, gy = (q[1] / cs) | 0; let bad = false;
      for (let y = Math.max(0, gy - 2); y <= Math.min(gh - 1, gy + 2) && !bad; y++) for (let x = Math.max(0, gx - 2); x <= Math.min(gw - 1, gx + 2); x++) { const id = grid[y * gw + x]; if (id >= 0 && Math.hypot(P[id][0] - q[0], P[id][1] - q[1]) < r) { bad = true; break; } }
      if (!bad) { add(q); ok = true; break; } }
    if (!ok) act.splice(ai, 1); }
  return P;
}
const PCACHE = {}; const pcache = (k, f) => PCACHE[k] || (PCACHE[k] = f());
function tree(g, x, y, s, col) { g.beginPath(); g.moveTo(x, y - s); g.lineTo(x - s * .55, y + s * .45); g.lineTo(x + s * .55, y + s * .45); g.closePath(); g.fillStyle = col; g.fill(); }
function img(g, c, x, y, w, h, pix = false) { g.imageSmoothingEnabled = !pix; g.drawImage(c, x, y, w, h); g.imageSmoothingEnabled = true; rr(g, x, y, w, h, 4, null, C.line2, 2); }
function editorWin(g, x, y, w, h, ttl) { rr(g, x, y, w, h, 14, '#0B111F', C.line2, 2); rr(g, x, y, w, 44, 14, '#141C30'); g.fillStyle = '#141C30'; g.fillRect(x, y + 30, w, 14); [C.r, C.gold, C.ok].forEach((c, i) => dot(g, x + 24 + i * 22, y + 22, 7, c)); txt(g, ttl, x + 100, y + 22, C.fg2, fnt(600, 20)); }

// ---------- 片头 ----------
AN.open3 = (g, t, R, st) => {
  landscape(g, R, t, st.k === 0 ? .9 : .35);
  if (st.k === 0) {
    const S = [['几十', '平方公里的山川', C.o], ['几百万', '棵树', C.g], ['成千上万', '房子和任务', C.b]], w = (R.w - 60) / 3;
    S.forEach(([a, b, col], i) => al(g, pop(t, 1 + i * 1.4), () => { const x = R.x + i * (w + 30); rr(g, x, R.y + 110, w, 190, 18, 'rgba(14,20,36,.9)', col, 2); txt(g, a, x + w / 2, R.y + 185, col, fnt(800, 64, 'serif'), 'center'); txt(g, b, x + w / 2, R.y + 258, C.fg2, fnt(600, 28), 'center'); }));
    al(g, pop(t, 6), () => { const x = R.x + 40, y = R.y + 420; rr(g, x - 20, y - 40, 760, 230, 18, 'rgba(14,20,36,.92)', C.line2, 2); person(g, x + 50, y + 70, C.fg2, 1.6);
      const n = Math.floor(CL((t - 6) / 10) * 6); for (let i = 0; i < n; i++) tree(g, x + 140 + i * 70, y + 90, 26, '#3F8F63');
      txt(g, '一棵一棵手摆：' + (n * 1) + ' 棵', x + 120, y + 150, C.fg2, fnt(600, 26)); });
    al(g, pop(t, 8), () => { const x = R.x + 860, y = R.y + 380; rr(g, x, y, R.w - 880, 230, 18, 'rgba(14,20,36,.92)', C.g, 2);
      const P = pcache('op3', () => poissonPts(R.w - 920, 190, 16, 3)), m = Math.floor(P.length * CL((t - 8.5) / 4)); for (let i = 0; i < m; i++) tree(g, x + 20 + P[i][0], y + 20 + P[i][1], 9, i % 3 ? '#3F8F63' : '#5FA36E');
      txt(g, '按规则生成：' + m.toLocaleString() + ' 棵', x + 24, y + 260, C.g, fnt(700, 26)); });
    return;
  }
  hdr(g, R, '内容生产的管线');
  flowBoxes(g, st.tk, R, [['地形生成', '噪声 · 侵蚀', C.o], ['程序化散布', '规则 · 节点图', C.g], ['扫描资产', '摄影测量', C.b], ['工具与协作', '几百人一张图', C.p], ['玩法填充', '让地图好玩', C.r]], R.y + 300, { h: 150 });
};

// ---------- 01 地形生成 ----------
AN.noise = (g, t, R, st) => {
  hdr(g, R, '分形噪声：大起伏 + 越来越小的细节');
  const oc = 1 + Math.min(4, Math.floor(CL((t - 1) / 9) * 5)), x0 = R.x + 20, w0 = 420, x1 = R.x + 520, w1 = R.w - 540;
  const f = (x, o) => n2(x * Math.pow(2.03, o) * 4 + 3, o * 7.1) * Math.pow(.5, o);
  for (let o = 0; o < 5; o++) { const y = R.y + 160 + o * 125, on = o < oc; al(g, on ? 1 : .25, () => {
    txt(g, `第 ${o + 1} 层`, x0, y - 40, on ? C.fg : C.fg3, fnt(700, 22)); txt(g, `频率 ×${2 ** o} · 幅度 ×1/${2 ** o}`, x0 + 100, y - 40, C.fg3, fnt(500, 19));
    const pts = []; for (let i = 0; i <= 140; i++) pts.push([x0 + i / 140 * w0, y + 20 - f(i / 140, o) * 90]); line(g, pts, on ? C.o : C.fg3, 2.5); }); }
  const base = R.y + 720, pts = [], V = []; let mn = 9, mx = -9; for (let i = 0; i <= 300; i++) { let v = 0, full = 0; for (let o = 0; o < 5; o++) { const q = f(i / 300, o); v += q * CL(oc - o, 0, 1); full += q; } V.push(v); mn = Math.min(mn, full); mx = Math.max(mx, full); }
  V.forEach((v, i) => pts.push([x1 + i / 300 * w1, base - 60 - (v - mn) / (mx - mn + 1e-6) * 420]));
  g.beginPath(); g.moveTo(x1, base); pts.forEach(p => g.lineTo(...p)); g.lineTo(x1 + w1, base); g.closePath(); const gr = g.createLinearGradient(0, base - 450, 0, base); gr.addColorStop(0, '#9AA7B8'); gr.addColorStop(.4, '#5B7B5E'); gr.addColorStop(1, '#1E3A33'); g.fillStyle = gr; g.fill();
  line(g, pts, C.fg, 2); txt(g, `叠加 ${oc} 层`, x1 + w1 / 2, R.y + 150, C.gold, fnt(800, 32), 'center');
  arrow(g, R.x + 460, R.y + 420, x1 - 10, R.y + 420, C.fg3, 3, 12);
};
AN.erode = (g, t, R, st) => {
  hdr(g, R, '侵蚀：让雨水把山刻出来', '粒子法：每滴雨顺坡流下，冲走或放下泥沙（示意参数）');
  const E = erodeSim(), s = 420, y = R.y + 140, xa = R.x + 20, xb = R.x + 20 + s + 60;
  img(g, reliefCanvas(0), xa, y, s, s); txt(g, '只有噪声', xa + s / 2, y + s + 34, C.fg2, fnt(700, 24), 'center');
  const st2 = Math.min(3, Math.floor(CL((t - 2) / 9) * 4)); al(g, pop(t, 1.5), () => { img(g, reliefCanvas(st2), xb, y, s, s); txt(g, ['0', '4,000', '14,000', '40,000'][st2] + ' 滴雨之后', xb + s / 2, y + s + 34, C.gold, fnt(700, 24), 'center');
    E.paths.forEach((p, i) => { const ph = ((t * .6 + i * .37) % 3) / 3, n = Math.floor(ph * p.length); if (n < 2) return; line(g, p.slice(Math.max(0, n - 8), n).map(q => [xb + q[0] * s, y + q[1] * s]), 'rgba(140,200,255,.8)', 2); dot(g, xb + p[n - 1][0] * s, y + p[n - 1][1] * s, 3.5, '#BFE2FF'); }); });
  al(g, pop(t, 4), () => { const x = xb + s + 50, ls = [['流得快', '冲走泥沙 → 刻出沟谷', C.b], ['流得慢', '放下泥沙 → 冲积扇', C.gold], ['积少成多', '山谷 · 冲沟自然出现', C.ok]];
    ls.forEach(([a, b, col], i) => al(g, pop(t, 4.5 + i * 1.5), () => { rr(g, x, y + 10 + i * 140, R.x + R.w - x - 10, 116, 14, 'rgba(14,20,36,.92)', col, 2); txt(g, a, x + 22, y + 48 + i * 140, col, fnt(800, 26)); txt(g, b, x + 22, y + 92 + i * 140, C.fg2, fnt(600, 21)); })); });
};
AN.masks = (g, t, R, st) => {
  hdr(g, R, '地形软件：节点连下来，输出一组图');
  const nd = [['噪声', C.o], ['侵蚀', C.b], ['输出', C.g]], y = R.y + 120;
  nd.forEach(([a, col], i) => { const x = R.x + 40 + i * 320; node(g, x, y, 220, 90, a, col, pop(t, .3 + i * .6)); if (i < 2) arrow(g, x + 224, y + 45, x + 316, y + 45, C.fg3, 3, 10, pop(t, .6 + i * .6)); });
  const M = [['h', '高度图', '→ 地形形状'], ['flow', '水流图', '→ 河流 · 湿润'], ['dep', '沉积图', '→ 泥土 · 碎石'], ['slope', '坡度图', '→ 岩石 · 不长树']], s = 260, gap = (R.w - 40 - 4 * s) / 3;
  M.forEach(([k, a, b], i) => al(g, pop(t, 2.5 + i * 1.2), () => { const x = R.x + 20 + i * (s + gap), yy = R.y + 330; img(g, erCanvas('m' + k, MASKS[k]), x, yy, s, s); txt(g, a, x + s / 2, yy + s + 36, C.fg, fnt(800, 26), 'center'); txt(g, b, x + s / 2, yy + s + 76, C.fg2, fnt(600, 21), 'center');
    line(g, [[R.x + 760, y + 92], [x + s / 2, yy - 6]], C.line2, 2, [5, 6]); }));
};
AN.road = (g, t, R, st) => {
  hdr(g, R, '河流与道路：沿着地形自动生成');
  const E = erodeSim(), s = 560, x = R.x + 20, y = R.y + 110, N = E.N; img(g, reliefCanvas(3), x, y, s, s);
  const riv = pcache('riv', () => { let i = 70, j = 6; const P = []; for (let k = 0; k < 260 && j < N - 3; k++) { P.push([i / N, j / N]); let best = null, bh = 9; for (const [a, b] of [[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0]]) { const h = E.H[(j + b) * N + i + a] + (b ? 0 : .002) + (P.some(p => Math.abs(p[0] - (i + a) / N) < 1e-6 && Math.abs(p[1] - (j + b) / N) < 1e-6) ? 9 : 0); if (h < bh) { bh = h; best = [a, b]; } } if (!best) break; i = CL(i + best[0], 2, N - 3); j += best[1]; } return P; });
  const nr = Math.floor(riv.length * SS((t - .5) / 4)); if (nr > 1) line(g, riv.slice(0, nr).map(p => [x + p[0] * s, y + p[1] * s]), '#5CB4FF', 7);
  al(g, pop(t, 1), () => txt(g, '河：沿最低路径往下走', x + 20, y + s + 34, C.b, fnt(700, 22)));
  const cp = [[.05, .8], [.3, .62], [.55, .7], [.8, .45], [.97, .3]], sp = [];
  for (let i = 0; i < cp.length - 1; i++) for (let u = 0; u < 1; u += .05) { const p0 = cp[Math.max(0, i - 1)], p1 = cp[i], p2 = cp[i + 1], p3 = cp[Math.min(cp.length - 1, i + 2)], q = k => .5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u * u + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * u ** 3); sp.push([x + q(0) * s, y + q(1) * s]); }
  const ur = SS((t - 5) / 3), nsp = Math.floor(sp.length * ur); if (nsp > 1) { line(g, sp.slice(0, nsp), '#3B3226', 16); line(g, sp.slice(0, nsp), '#C9B48A', 9); }
  if (t > 5) cp.forEach(p => { rr(g, x + p[0] * s - 9, y + p[1] * s - 9, 18, 18, 3, C.gold); });
  al(g, pop(t, 5), () => txt(g, '路：样条线 + 控制点', x + 320, y + s + 34, C.gold, fnt(700, 22)));
  if (t > 12) for (let i = 2; i < sp.length; i += 6) if (i / sp.length < SS((t - 12) / 3)) { dot(g, sp[i][0] + 12, sp[i][1] - 12, 5, '#FFE2A8'); }
  // 剖面
  const px = R.x + 640, pw = R.w - 660, py = R.y + 250; al(g, pop(t, 8), () => {
    txt(g, '横截面：压平路面，修出路肩和护坡', px, R.y + 140, C.fg, fnt(700, 24)); const u = SS((t - 9) / 3), prof = i => py + 220 - 160 * (.5 + .35 * Math.sin(i * 1.2) + .15 * Math.sin(i * 3.7)) + 110 * i / 1;
    const P0 = [], P1 = []; for (let k = 0; k <= 100; k++) { const i = k / 100, gH = prof(i), d = Math.abs(i - .5), road = py + 230; let h = gH; if (d < .12) h = road; else if (d < .3) { const w = (d - .12) / .18; h = LERP(road, gH, SS(w)); } P0.push([px + i * pw, gH]); P1.push([px + i * pw, LERP(gH, h, u)]); }
    g.beginPath(); g.moveTo(px, py + 460); P1.forEach(p => g.lineTo(...p)); g.lineTo(px + pw, py + 460); g.closePath(); g.fillStyle = '#25352E'; g.fill(); line(g, P0, C.fg3, 2, [6, 6]); line(g, P1, '#7FBF8A', 3);
    al(g, u, () => { rr(g, px + pw * .38, py + 222, pw * .24, 12, 3, '#C9B48A'); txt(g, '路面', px + pw * .5, py + 270, C.fg, fnt(700, 21), 'center'); txt(g, '护坡', px + pw * .22, py + 320, C.fg2, fnt(600, 20), 'center'); txt(g, '护坡', px + pw * .78, py + 320, C.fg2, fnt(600, 20), 'center'); [.4, .6].forEach(f => { line(g, [[px + pw * f, py + 222], [px + pw * f, py + 192]], C.fg2, 3); }); txt(g, '护栏', px + pw * .66, py + 190, C.fg2, fnt(600, 19)); });
    txt(g, '虚线：原地形', px, py + 500, C.fg3, fnt(600, 20)); });
};
AN.dem = (g, t, R, st) => {
  hdr(g, R, '直接用真实世界的数据');
  const cx = R.x + 220, cy = R.y + 380, r = 180; g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fillStyle = '#123150'; g.fill(); g.clip();
  for (let i = 0; i < 12; i++) { const a = (i / 12 * 6.283 + t * .15) % 6.283, x = cx + Math.cos(a) * r; if (Math.sin(a) > 0) { g.beginPath(); g.ellipse(cx, cy, Math.abs(Math.cos(a)) * r, r, 0, 0, 7); g.strokeStyle = 'rgba(92,180,255,.3)'; g.lineWidth = 1.5; g.stroke(); } }
  for (let k = -3; k <= 3; k++) { g.beginPath(); g.ellipse(cx, cy + k * r / 4, Math.sqrt(1 - (k / 4) ** 2) * r, 8, 0, 0, 7); g.strokeStyle = 'rgba(92,180,255,.3)'; g.stroke(); }
  for (let i = 0; i < 60; i++) { const a = HSH(i, 1) * 6.283 + t * .15, b = HSH(i, 2) * 2 - 1, x = cx + Math.sin(a) * Math.sqrt(1 - b * b) * r * .95, y = cy + b * r * .95; if (Math.cos(a) > 0) dot(g, x, y, 7 + HSH(i, 3) * 10, 'rgba(95,224,160,.35)'); }
  g.restore(); g.beginPath(); g.arc(cx, cy, r, 0, 7); g.strokeStyle = C.b; g.lineWidth = 2; g.stroke(); txt(g, '整个地球', cx, cy + r + 40, C.fg2, fnt(700, 24), 'center');
  const S = [['卫星高程', '地形高度', C.o], ['航拍影像', '地表贴图', C.g], ['地图数据', '建筑轮廓', C.b]];
  S.forEach(([a, b, col], i) => al(g, pop(t, 1.5 + i * 1.2), () => { const x = R.x + 470, y = R.y + 150 + i * 150; node(g, x, y, 240, 110, a, col, 1, b); arrow(g, cx + r + 10, cy - 60 + i * 60, x - 8, y + 55, C.line2, 2, 8); }));
  al(g, pop(t, 6), () => { const x = R.x + 800, y = R.y + 230; arrow(g, R.x + 720, R.y + 505, x - 10, y + 160, C.p, 3, 10); node(g, x, y + 110, 120, 100, 'AI', C.p, 1, '推测');
    const bx = x + 170, by = y + 60, u = SS((t - 7) / 4); for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) { const X = bx + i * 62 + j * 22, Y = by + 60 + j * 80, h = (16 + HSH(i, j) * 50) * u, w = 30;
      g.fillStyle = '#3B4A6E'; g.fillRect(X, Y - h, w, h + 20); g.fillStyle = '#56679A'; g.beginPath(); g.moveTo(X, Y - h); g.lineTo(X + 12, Y - h - 8); g.lineTo(X + w + 12, Y - h - 8); g.lineTo(X + w, Y - h); g.fill(); rr(g, X, Y + 6, w, 14, 2, null, C.b, 1.5); }
    txt(g, '轮廓 → 有高度的建筑', bx + 150, by + 300, C.fg2, fnt(600, 22), 'center'); });
  al(g, pop(t, 11), () => banner(g, R, '数据从云端流式下载：飞到哪里，下载到哪里', 1));
};

// ---------- 02 程序化散布 ----------
AN.rules = (g, t, R, st) => {
  hdr(g, R, '写规则：把条件叠起来，得到密度图');
  const E = erodeSim(), N = E.N, wet = wetMap(), s = 300, y = R.y + 150;
  const slopeM = erCanvas('rs', (i, j, E) => { const v = 1 - SS((slopeAt(E.H, N, i, j) - .8) / .9); return [v * 230, v * 230, v * 230]; });
  const hM = erCanvas('rh', (i, j, E) => { const v = 1 - SS((E.H[j * N + i] - .62) / .14); return [v * 230, v * 230, v * 230]; });
  const wM = erCanvas('rw', (i, j) => { const v = .55 + .45 * wet[j * N + i]; return [v * 230, v * 230, v * 230]; });
  const den = erCanvas('rd', (i, j, E) => { const v = (1 - SS((slopeAt(E.H, N, i, j) - .8) / .9)) * (1 - SS((E.H[j * N + i] - .62) / .14)) * (.55 + .45 * wet[j * N + i]); return [40 + 55 * v, 50 + 200 * v, 60 + 110 * v]; });
  const L = [[slopeM, '坡不太陡', '× '], [hM, '海拔不太高', '× '], [wM, '离水近更密', '= '], [den, '树的密度', '']], gap = (R.w - 40 - 4 * s) / 3;
  L.forEach(([c, a, op], i) => al(g, pop(t, .5 + i * 1.6), () => { const x = R.x + 20 + i * (s + gap); img(g, c, x, y, s, s); txt(g, a, x + s / 2, y + s + 36, i === 3 ? C.g : C.fg, fnt(800, 26), 'center'); if (op) txt(g, op.trim(), x + s + gap / 2, y + s / 2, C.gold, fnt(800, 48), 'center'); }));
  al(g, pop(t, 8), () => { const yy = R.y + 600, T = [['树', '密度图', '#3F8F63'], ['草', '高处也长', '#8FCB6A'], ['芦苇', '只在河边', '#C9B48A'], ['岩石', '陡坡露出', '#9AA3B5']]; let x = R.x + 20;
    txt(g, '每种东西一张密度图', x, yy, C.fg2, fnt(700, 24)); x += 260; T.forEach(([a, b, col], i) => { x += chip(g, a + ' · ' + b, x, yy, col, pop(t, 8.5 + i * .6), 24) + 20; }); });
};
AN.poisson = (g, t, R, st) => {
  hdr(g, R, '怎么撒点：随机、网格、泊松盘');
  const s = 380, gap = (R.w - 40 - 3 * s) / 2, y = R.y + 140, u = CL((t - .5) / 5);
  const rnd = pcache('rnd', () => { const r = RND(5), P = []; for (let i = 0; i < 160; i++) P.push([r() * s, r() * s]); return P; });
  const grd = pcache('grd', () => { const P = []; for (let j = 0; j < 13; j++) for (let i = 0; i < 13; i++) P.push([14 + i * 29, 14 + j * 29]); return P; });
  const poi = pcache('poi', () => poissonPts(s, s, 27, 9));
  [[rnd, '完全随机', '扎堆 · 空洞', C.bad], [grd, '网格', '太整齐', C.gold], [poi, '泊松盘', '随机又均匀', C.ok]].forEach(([P, a, b, col], k) => al(g, pop(t, .3 + k * 1.5), () => {
    const x = R.x + 20 + k * (s + gap); rr(g, x, y, s, s, 10, '#13241C', col, 2); const n = Math.floor(P.length * CL((t - .3 - k * 1.5) / 3));
    for (let i = 0; i < n; i++) { const p = P[i], jit = k === 1 ? 0 : 0; tree(g, x + p[0], y + p[1] + 5, 9, '#4FA06E'); }
    txt(g, a, x + s / 2, y + s + 40, col, fnt(800, 28), 'center'); txt(g, b, x + s / 2, y + s + 80, C.fg2, fnt(600, 22), 'center');
    if (k === 2 && t > 6) { const p = P[Math.floor(P.length * .4)], rr2 = 27 * SS((t - 6) / 1.5); g.beginPath(); g.arc(x + p[0], y + p[1], rr2, 0, 7); g.strokeStyle = C.gold; g.lineWidth = 3; g.stroke(); dot(g, x + p[0], y + p[1], 5, C.gold); al(g, pop(t, 7), () => txt(g, '这个圈里没有别的点', x + s / 2, y - 24, C.gold, fnt(700, 22), 'center')); }
    if (k === 0 && t > 6) { al(g, pop(t, 6), () => { g.beginPath(); g.arc(x + 90, y + 120, 46, 0, 7); g.strokeStyle = C.bad; g.setLineDash([6, 6]); g.lineWidth = 2.5; g.stroke(); g.setLineDash([]); }); }
  }));
};
AN.pcg = (g, t, R, st) => {
  if (st.bi === 3) {
    hdr(g, R, '节点图：带属性的点一路流过去');
    const N = [['表面采样', '在地形上撒点', C.o], ['密度过滤', '按遮罩删点', C.g], ['自我裁剪', '去掉太近的', C.b], ['变换', '旋转 · 缩放', C.p], ['生成网格', '点 → 树', C.gold]], w = 210, y = R.y + 140, gap = (R.w - 40 - 5 * w) / 4;
    const P = pcache('pcgp', () => { const r = RND(21), A = []; for (let i = 0; i < 90; i++) A.push([r(), r(), r(), r()]); return A; });
    N.forEach(([a, b, col], i) => { const x = R.x + 20 + i * (w + gap), u = pop(t, .3 + i * .8); node(g, x, y, w, 100, a, col, u, b); if (i < 4) { arrow(g, x + w + 4, y + 50, x + w + gap - 4, y + 50, C.fg3, 3, 10, u); if (t > 5) packet(g, [[x + w, y + 50], [x + w + gap, y + 50]], ((t - 5) * .7 + i * .2) % 1, col, 7); }
      al(g, pop(t, 4 + i * .7), () => { const px = x, py = y + 150, ps = w; rr(g, px, py, ps, ps, 8, '#101A16', C.line2, 2);
        P.forEach(([a1, b1, c1, d1], k) => { const keep = i < 1 || (c1 > .35 && (i < 2 || k % 4 !== 0)); if (!keep) return; const X = px + 12 + a1 * (ps - 24), Y = py + 12 + b1 * (ps - 24); if (i < 4) { dot(g, X, Y, 4, col); if (i === 3) line(g, [[X, Y], [X + Math.cos(d1 * 6.28) * 10, Y + Math.sin(d1 * 6.28) * 10]], col, 2); } else tree(g, X, Y, 6 + d1 * 6, '#4FA06E'); }); }); });
    al(g, pop(t, 9), () => { const y2 = R.y + 560; rr(g, R.x + 20, y2, 560, 140, 14, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, '一个点带着的属性', R.x + 44, y2 + 34, C.fg3, fnt(700, 21));
      ['位置 · 朝向 · 缩放', '密度 · 随机种子 · 自定义属性'].forEach((s, i) => txt(g, s, R.x + 44, y2 + 72 + i * 38, C.fg, fnt(600, 23)));
      txt(g, 'Houdini Engine：把 Houdini 做的程序化资产放进各家引擎', R.x + 620, y2 + 70, C.fg2, fnt(600, 23)); });
    return;
  }
  hdr(g, R, '程序化之后，美术还要手工调整');
  const x = R.x + 20, y = R.y + 110, W = R.w - 40, H = 600, P = pcache('pcgm', () => poissonPts(W, H, 26, 14));
  rr(g, x, y, W, H, 14, '#12221A', C.line2, 2);
  const cast = [x + W * .8, y + 110], clear = [x + W * .35, y + H * .62, 130], reseed = t > 11 ? Math.floor((t - 11) * 1.2) : 0;
  g.fillStyle = '#2E3D63'; for (let i = 0; i < 6; i++) g.fillRect(cast[0] - 60 + i * 22, cast[1] - 40 - HSH(i, 4) * 40, 18, 60 + HSH(i, 4) * 40); txt(g, '远处的城堡', cast[0], cast[1] + 50, C.fg2, fnt(600, 20), 'center');
  P.forEach((p, i) => { const X = x + p[0], Y = y + p[1]; if (Y < y + 170 && Math.abs(X - cast[0]) < 120) return; const inClear = Math.hypot(X - clear[0], Y - clear[1]) < clear[2]; const fadeC = inClear ? 1 - pop(t, 3, 1.5) : 1; if (fadeC <= 0) return;
    const sh = reseed ? (HSH(i, reseed) - .5) * 8 : 0; al(g, fadeC, () => tree(g, X + sh, Y, 10, HSH(i, 7) > .5 ? '#3F8F63' : '#4FA06E')); });
  al(g, pop(t, 3), () => { g.beginPath(); g.arc(clear[0], clear[1], clear[2], 0, 7); g.strokeStyle = C.r; g.setLineDash([8, 8]); g.lineWidth = 3; g.stroke(); g.setLineDash([]); txt(g, '战斗区域：清空', clear[0], clear[1], C.r, fnt(700, 24), 'center'); });
  al(g, pop(t, 6), () => { const a = [x + W * .58, y + 250], b = [x + W * .7, y + 270]; tree(g, a[0], a[1], 42, '#5FB07A'); tree(g, b[0], b[1], 38, '#5FB07A'); rr(g, a[0] - 40, a[1] - 60, b[0] - a[0] + 80, 110, 10, null, C.gold, 3); txt(g, '手放：框住城堡', (a[0] + b[0]) / 2, a[1] + 80, C.gold, fnt(700, 22), 'center'); });
  al(g, pop(t, 11), () => { rr(g, x + 20, y + H - 70, 520, 50, 12, 'rgba(14,20,36,.92)', C.ok, 2); txt(g, '规则重新运行：手工修改保留', x + 40, y + H - 45, C.ok, fnt(700, 23)); });
};
AN.hzd = (g, t, R, st) => {
  hdr(g, R, '运行时生成：显卡在玩家周围现场计算', '同一个位置，每次算出来都一样');
  const x = R.x + 20, y = R.y + 120, W = 760, H = 620; rr(g, x, y, W, H, 14, '#12221A', C.line2, 2);
  const pth = u => [x + 80 + u * (W - 160), y + H / 2 + Math.sin(u * 5) * 180], u = CL(t / (st.D || 18)), pl = pth(u), rad = 170;
  const cs = 22; g.save(); g.beginPath(); g.roundRect(x, y, W, H, 14); g.clip();
  for (let j = 0; j < H / cs; j++) for (let i = 0; i < W / cs; i++) { const X = x + i * cs + HSH(i, j) * cs, Y = y + j * cs + HSH(j, i + 99) * cs, d = Math.hypot(X - pl[0], Y - pl[1]); const dens = .5 + .5 * Math.sin(i * .25) * Math.cos(j * .3); if (HSH(i * 7, j * 3) > dens) continue;
    if (d < rad) al(g, CL((rad - d) / 30), () => tree(g, X, Y, 9, '#4FA06E')); else dot(g, X, Y, 1.5, 'rgba(95,224,160,.18)'); }
  g.restore();
  g.beginPath(); g.arc(pl[0], pl[1], rad, 0, 7); g.strokeStyle = C.gold; g.lineWidth = 2.5; g.setLineDash([8, 8]); g.stroke(); g.setLineDash([]); person(g, pl[0], pl[1], C.gold, 1);
  const px = x + W + 50, pw = R.x + R.w - px; al(g, pop(t, 2), () => { rr(g, px, y, pw, 250, 14, 'rgba(14,20,36,.92)', C.o, 2); txt(g, '美术画的', px + 22, y + 36, C.o, fnt(800, 26)); ['密度图', '规则', '随机种子'].forEach((s, i) => check(g, px + 24, y + 96 + i * 52, s, 1, C.o, 24)); });
  al(g, pop(t, 5), () => { rr(g, px, y + 290, pw, 250, 14, 'rgba(14,20,36,.92)', C.g, 2); txt(g, '显卡现场算的', px + 22, y + 326, C.g, fnt(800, 26)); ['每棵树的位置', '朝向和大小', '离开就丢掉'].forEach((s, i) => check(g, px + 24, y + 386 + i * 52, s, 1, C.g, 24)); });
  al(g, pop(t, 9), () => txt(g, '硬盘上不存几百万棵树', px, y + 590, C.fg, fnt(700, 24)));
};

// ---------- 03 扫描资产 ----------
function rockPts() { return pcache('rock', () => { const P = []; for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283; P.push([Math.cos(a) * (120 + 30 * Math.sin(a * 3) + 15 * HSH(i, 2)), Math.sin(a) * (80 + 18 * Math.cos(a * 2)) - 10]); } return P; }); }
function rock(g, cx, cy, s, fill, a = 1) { al(g, a, () => { const P = rockPts(); g.beginPath(); P.forEach((p, i) => i ? g.lineTo(cx + p[0] * s, cy + p[1] * s) : g.moveTo(cx + p[0] * s, cy + p[1] * s)); g.closePath(); g.fillStyle = fill; g.fill(); g.strokeStyle = '#8A93A6'; g.lineWidth = 2; g.stroke(); }); }
AN.photo = (g, t, R, st) => {
  hdr(g, R, '摄影测量：几百张照片 → 三维模型');
  const cx = R.x + 360, cy = R.y + 430, rc = 290, n = 16;
  const stg = t < 4 ? 0 : t < 8 ? 1 : t < 12 ? 2 : 3;
  if (stg < 2) rock(g, cx, cy, 1, '#4A5060');
  for (let i = 0; i < n; i++) { const a = i / n * 6.283 - 1.57, u = pop(t, .3 + i * .15, .3); if (u <= 0) continue; const X = cx + Math.cos(a) * rc, Y = cy + Math.sin(a) * rc * .82;
    al(g, u * (stg >= 2 ? .4 : 1), () => { g.save(); g.translate(X, Y); g.rotate(a + 1.57); rr(g, -18, -12, 36, 24, 4, '#1D2742', C.b, 2); dot(g, 0, 0, 6, C.b); g.restore(); });
    if (stg === 1) { const pts = [[-.5, -.3], [.3, -.5], [.6, .2], [-.2, .4]]; pts.forEach((p, k) => { if ((i + k) % 3) return; line(g, [[X, Y], [cx + p[0] * 120, cy + p[1] * 80]], 'rgba(255,210,122,.35)', 1.2); }); } }
  if (stg === 1) [[-.5, -.3], [.3, -.5], [.6, .2], [-.2, .4]].forEach(p => dot(g, cx + p[0] * 120, cy + p[1] * 80, 7, C.gold));
  if (stg >= 2) { const pc = pcache('rockpc', () => { const r = RND(4), A = []; while (A.length < 500) { const x = (r() * 2 - 1) * 150, y = (r() * 2 - 1) * 110; let inside = false; const P = rockPts(); for (let i = 0, j = P.length - 1; i < P.length; j = i++) if ((P[i][1] > y) !== (P[j][1] > y) && x < (P[j][0] - P[i][0]) * (y - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) inside = !inside; if (inside) A.push([x, y]); } return A; });
    if (stg === 2) pc.forEach((p, i) => { if (i / pc.length < CL((t - 8) / 2.5)) dot(g, cx + p[0], cy + p[1], 2.4, `hsl(${30 + HSH(i, 1) * 30},${20 + HSH(i, 2) * 20}%,${45 + HSH(i, 3) * 25}%)`); });
    else { rock(g, cx, cy, 1, '#6E6A60'); g.save(); const P = rockPts(); g.beginPath(); P.forEach((p, i) => i ? g.lineTo(cx + p[0], cy + p[1]) : g.moveTo(cx + p[0], cy + p[1])); g.closePath(); g.clip(); for (let i = 0; i < 60; i++) { const a = pc[i * 7], b = pc[i * 7 + 3], c = pc[i * 7 + 5]; g.beginPath(); g.moveTo(cx + a[0], cy + a[1]); g.lineTo(cx + b[0], cy + b[1]); g.lineTo(cx + c[0], cy + c[1]); g.closePath(); g.fillStyle = `rgba(${120 + HSH(i, 5) * 60},${110 + HSH(i, 6) * 50},${90 + HSH(i, 7) * 40},.5)`; g.fill(); g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 1; g.stroke(); } g.restore(); } }
  const S = ['拍照：从各个角度', '找出相同的点', '反推出点云', '生成网格和贴图'], x = R.x + 760;
  S.forEach((s, i) => { const on = stg >= i; al(g, on ? 1 : .35, () => { rr(g, x, R.y + 160 + i * 130, R.x + R.w - x - 10, 100, 14, stg === i ? 'rgba(255,210,122,.08)' : 'rgba(14,20,36,.92)', stg === i ? C.gold : C.line2, stg === i ? 3 : 2); txt(g, String(i + 1), x + 34, R.y + 210 + i * 130, stg === i ? C.gold : C.fg3, fnt(800, 34, 'mono'), 'center'); txt(g, s, x + 70, R.y + 210 + i * 130, on ? C.fg : C.fg3, fnt(700, 27)); }); });
};
AN.photo2 = (g, t, R, st) => {
  if (st.bi === 1) {
    hdr(g, R, '扫描之后：去光影、减面、入库');
    const y = R.y + 170, cx1 = R.x + 180, cx2 = R.x + 520;
    rock(g, cx1, y + 100, .9, '#5A5650'); g.save(); g.beginPath(); g.ellipse(cx1 + 50, y + 120, 90, 50, 0, 0, 7); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill(); g.restore(); txt(g, '照片里自带阴影', cx1, y + 230, C.fg2, fnt(600, 22), 'center');
    al(g, pop(t, 1.5), () => { arrow(g, cx1 + 160, y + 100, cx2 - 160, y + 100, C.gold, 3, 12); txt(g, '去光影', (cx1 + cx2) / 2, y + 70, C.gold, fnt(700, 22), 'center'); rock(g, cx2, y + 100, .9, '#8C8578'); txt(g, '干净的颜色：可以重新打光', cx2, y + 230, C.fg2, fnt(600, 22), 'center'); });
    al(g, pop(t, 4), () => { const yy = R.y + 560; txt(g, '面数', R.x + 20, yy, C.fg, fnt(700, 26)); bars(g, R.x + 120, yy - 60, 560, 200, [['原始扫描', 300, C.r, '几百万面'], ['简化后', 6, C.g, '几万面'], ['Nanite', 300, C.b, '原样使用']], t - 4.3, { max: 300, gap: .6 }); });
    al(g, pop(t, 8), () => { const x0 = R.x + 780, y0 = R.y + 160, cs = 92; txt(g, '扫描资产库', x0, y0 - 10, C.fg, fnt(700, 26)); for (let j = 0; j < 5; j++) for (let i = 0; i < 5; i++) al(g, pop(t, 8.3 + (i + j) * .15), () => { rr(g, x0 + i * (cs + 10), y0 + 20 + j * (cs + 10), cs, cs, 8, `hsl(${25 + HSH(i, j) * 70},${15 + HSH(j, i) * 25}%,${22 + HSH(i + 5, j) * 18}%)`, C.line2, 1.5); const s = .22 + HSH(i, j + 3) * .1; rock(g, x0 + i * (cs + 10) + cs / 2, y0 + 20 + j * (cs + 10) + cs / 2 + 6, s, `hsl(${30 + HSH(j, i + 2) * 30},10%,${40 + HSH(i, j + 9) * 25}%)`); }); });
    return;
  }
  hdr(g, R, '更大规模：整片街区、整个人');
  const x = R.x + 20, y = R.y + 130, W = 620, H = 420; rr(g, x, y, W, H, 14, '#0F1A24', C.line2, 2);
  for (let i = 0; i < 9; i++) { const bx = x + 40 + i * 64, h = 60 + HSH(i, 2) * 140; g.fillStyle = '#2A3A5A'; g.fillRect(bx, y + H - 40 - h, 48, h); }
  line(g, [[x, y + H - 40], [x + W, y + H - 40]], C.fg3, 2);
  const dx = x + 60 + ((t * 60) % (W - 120)), dy = y + 80; rr(g, dx - 30, dy - 8, 60, 16, 6, C.fg2); [-34, 34].forEach(o => line(g, [[dx + o - 14, dy - 12], [dx + o + 14, dy - 12]], C.fg2, 3));
  g.beginPath(); g.moveTo(dx, dy + 8); g.lineTo(dx - 80, y + H - 40); g.lineTo(dx + 80, y + H - 40); g.closePath(); g.fillStyle = 'rgba(95,224,160,.12)'; g.fill(); line(g, [[dx - 80, y + H - 40], [dx + 80, y + H - 40]], C.g, 4);
  for (let i = 0; i < 40; i++) { const px = x + 20 + i * 15; if (px < dx) dot(g, px, y + H - 40 - (HSH(Math.floor((px - x - 40) / 64), 2) * 140 + 60) * (((px - x - 40) % 64) < 48 ? 1 : 0), 3, C.g); }
  txt(g, '无人机 + 激光雷达', x + W / 2, y + H + 36, C.g, fnt(700, 24), 'center');
  al(g, pop(t, 4), () => { const fx = R.x + 760, fy = R.y + 220; const J = [[0, 0], [0, 70], [0, 150], [-50, 90], [50, 90 + 20 * Math.sin(t * 3)], [-30, 240], [30, 240], [0, -40]];
    [[7, 0], [0, 1], [1, 2], [1, 3], [1, 4], [2, 5], [2, 6]].forEach(([a, b]) => line(g, [[fx + J[a][0], fy + J[a][1]], [fx + J[b][0], fy + J[b][1]]], C.b, 4)); J.forEach(p => dot(g, fx + p[0], fy + p[1], 8, C.gold)); txt(g, '动作捕捉', fx, fy + 330, C.b, fnt(700, 24), 'center'); });
  al(g, pop(t, 8), () => { const fx = R.x + 1060, fy = R.y + 330; g.beginPath(); g.ellipse(fx, fy, 90, 120, 0, 0, 7); g.strokeStyle = C.p; g.lineWidth = 2.5; g.stroke();
    for (let i = 0; i < 40; i++) { const a = HSH(i, 1) * 6.283, r = Math.sqrt(HSH(i, 2)); dot(g, fx + Math.cos(a) * r * 80, fy + Math.sin(a) * r * 108, 3, C.p); }
    for (let i = 0; i < 40; i++) for (let j = i + 1; j < 40; j++) { const a = HSH(i, 1) * 6.283, r = Math.sqrt(HSH(i, 2)), b = HSH(j, 1) * 6.283, s = Math.sqrt(HSH(j, 2)); const p = [fx + Math.cos(a) * r * 80, fy + Math.sin(a) * r * 108], q = [fx + Math.cos(b) * s * 80, fy + Math.sin(b) * s * 108]; if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 34) line(g, [p, q], 'rgba(199,155,255,.3)', 1); }
    txt(g, '面部扫描 → 数字人', fx, fy + 220, C.p, fnt(700, 24), 'center'); });
};
AN.pipe = (g, t, R, st) => {
  hdr(g, R, '资产进引擎的管线');
  flowBoxes(g, t, R, [['导入', '模型 · 贴图', C.b], ['规范检查', '自动', C.gold], ['生成', '碰撞 · LOD', C.g], ['烘焙', '打包时', C.o], ['平台包', 'PC · 主机 · 手机', C.p]], R.y + 130, { h: 130, gap: .9 });
  al(g, pop(t, 5), () => { const x = R.x + 40, y = R.y + 380; rr(g, x - 20, y - 40, 820, 360, 16, 'rgba(14,20,36,.92)', C.gold, 2); txt(g, 'SM_Rock_Cliff_07.fbx', x, y, C.fg, fnt(700, 26, 'mono'));
    [['命名：SM_ 前缀 · 驼峰', 1], ['尺寸：单位是厘米', 1], ['面数：低于上限', 0], ['贴图：2 的幂次', 1]].forEach(([s, ok], i) => { const u = pop(t, 6 + i * 1.2), yy = y + 60 + i * 64; if (ok) check(g, x, yy, s, u, C.ok, 25); else { rr(g, x, yy - 15, 30, 30, 7, 'rgba(14,20,36,.9)', u > 0 ? C.bad : C.line2, 2); cross(g, x + 15, yy, u, C.bad, 8); txt(g, s, x + 46, yy, u > 0 ? C.bad : C.fg2, fnt(600, 25)); al(g, u, () => txt(g, '← 退回给美术', x + 360, yy, C.bad, fnt(700, 23))); } }); });
  al(g, pop(t, 11), () => { const x = R.x + 940, y = R.y + 380; rr(g, x, y - 40, R.x + R.w - x - 20, 360, 16, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, '规范靠工具检查', x + 30, y + 30, C.fg, fnt(800, 32)); txt(g, '不能靠人记', x + 30, y + 90, C.fg2, fnt(700, 30)); txt(g, '提交前自动跑 · 不合规进不了库', x + 30, y + 170, C.fg3, fnt(600, 23)); });
};

// ---------- 04 工具与协作 ----------
AN.tools = (g, t, R, st) => {
  hdr(g, R, '写工具的程序员：给编辑器加按钮');
  const x = R.x + 20, y = R.y + 110, W = R.w - 40, H = 620; editorWin(g, x, y, W, H, '编辑器 · 自定义工具面板');
  const B = [['放一条路', 1], ['森林换季', 6], ['批量检查', 11]]; B.forEach(([s, t0], i) => { const on = t > t0 && t < t0 + 1; rr(g, x + 24, y + 70 + i * 70, 220, 52, 10, on ? 'rgba(255,210,122,.25)' : '#18223A', on ? C.gold : C.line2, 2); txt(g, s, x + 134, y + 96 + i * 70, on ? C.gold : C.fg, fnt(700, 23), 'center'); });
  const vx = x + 280, vy = y + 70, vw = W - 300, vh = 360; rr(g, vx, vy, vw, vh, 8, '#13241C', C.line2, 1.5);
  const ss = SS((t - 6.3) / 2), col = i => { const a = [79, 160, 110], b = [215, 140, 60]; const k = HSH(i, 3) * .4 + .6; return `rgb(${LERP(a[0], b[0], ss) * k | 0},${LERP(a[1], b[1], ss) * k | 0},${LERP(a[2], b[2], ss) * k | 0})`; };
  for (let i = 0; i < 70; i++) { const X = vx + 30 + HSH(i, 1) * (vw - 60), Y = vy + 30 + HSH(i, 2) * (vh - 60); if (Math.abs(Y - (vy + vh * .62 + Math.sin((X - vx) / 120) * 40)) < 34) continue; tree(g, X, Y, 14, col(i)); }
  const ur = SS((t - 1.3) / 1.6); if (ur > 0) { const P = []; for (let k = 0; k <= 60 * ur; k++) { const X = vx + k / 60 * vw; P.push([X, vy + vh * .62 + Math.sin((X - vx) / 120) * 40]); } line(g, P, '#3B3226', 18); line(g, P, '#C9B48A', 10); P.forEach((p, k) => { if (k % 5 === 0) { line(g, [[p[0], p[1] - 16], [p[0], p[1] - 28]], C.fg2, 3); } }); line(g, P.map(p => [p[0], p[1] - 26]), C.fg2, 2); }
  if (ur > 0) al(g, pop(t, 2.5), () => txt(g, '路面 + 路肩 + 护栏，一次生成', vx + 20, vy + vh - 24, C.gold, fnt(700, 22)));
  al(g, pop(t, 11), () => { const n = Math.floor(CL((t - 11.3) / 4) * 42318), py = y + 470; txt(g, `检查资产 ${n.toLocaleString()} / 42,318`, vx, py, C.fg, fnt(700, 24, 'mono')); rr(g, vx, py + 30, vw, 22, 8, '#18223A'); rr(g, vx, py + 30, vw * n / 42318, 22, 8, C.ok); if (n > 20000) txt(g, '发现 37 个问题 → 生成报告', vx, py + 90, C.bad, fnt(700, 23)); });
};
AN.ofpa = (g, t, R, st) => {
  hdr(g, R, '几百人改一张图：拆成很多小文件');
  const x = R.x + 20, y = R.y + 140; rr(g, x, y, 420, 300, 14, 'rgba(255,107,107,.08)', C.bad, 2); txt(g, 'Map（一个文件）', x + 210, y + 40, C.bad, fnt(800, 26), 'center');
  rr(g, x + 175, y + 110, 70, 56, 8, null, C.bad, 4); g.beginPath(); g.arc(x + 210, y + 110, 24, Math.PI, 0); g.strokeStyle = C.bad; g.lineWidth = 4; g.stroke(); person(g, x + 210, y + 230, C.gold, 1.1); txt(g, '正在改', x + 210, y + 284, C.gold, fnt(600, 20), 'center');
  for (let i = 0; i < 4; i++) al(g, pop(t, 1 + i * .4), () => person(g, x + 70 + i * 90, y + 380, C.fg3, 1)); al(g, pop(t, 2.5), () => txt(g, '其他人：排队等', x + 210, y + 440, C.fg3, fnt(600, 22), 'center'));
  al(g, pop(t, 5), () => { const x2 = R.x + 520, w = R.x + R.w - x2 - 10; rr(g, x2, y, w, 560, 14, 'rgba(95,211,154,.06)', C.ok, 2); txt(g, '每个物体一个文件', x2 + w / 2, y + 40, C.ok, fnt(800, 26), 'center');
    const cs = 46, cols = Math.floor((w - 40) / (cs + 8)); for (let j = 0; j < 7; j++) for (let i = 0; i < cols; i++) { const fx = x2 + 20 + i * (cs + 8), fy = y + 80 + j * (cs + 14); rr(g, fx, fy, cs, cs, 6, '#18223A', C.line2, 1.5); g.beginPath(); g.moveTo(fx + cs - 12, fy); g.lineTo(fx + cs, fy + 12); g.strokeStyle = C.line2; g.stroke(); }
    const ed = [[2, 1, C.gold], [7, 3, C.b], [4, 5, C.p], [10, 2, C.r], [12, 6, C.o]]; ed.forEach(([i, j, col], k) => al(g, pop(t, 6 + k * .6), () => { const fx = x2 + 20 + i * (cs + 8), fy = y + 80 + j * (cs + 14); rr(g, fx, fy, cs, cs, 6, col + '44', col, 3); person(g, fx + cs / 2, fy + cs + 2, col, .6); }));
    al(g, pop(t, 10), () => txt(g, '多人在线：同一个场景同时编辑', x2 + w / 2, y + 530, C.fg2, fnt(700, 23), 'center')); });
};
AN.vcs = (g, t, R, st) => {
  hdr(g, R, '版本控制：代码能合并，二进制只能加锁');
  const x = R.x + 20, y = R.y + 130, w = (R.w - 80) / 2;
  rr(g, x, y, w, 300, 14, 'rgba(14,20,36,.92)', C.ok, 2); txt(g, '代码：文本', x + 24, y + 36, C.ok, fnt(800, 26));
  const L = ['speed = 5;', 'jump = 2;', 'hp = 100;']; L.forEach((s, i) => txt(g, s, x + 40, y + 100 + i * 50, C.fg2, fnt(600, 24, 'mono')));
  al(g, pop(t, 1.5), () => { txt(g, '甲：speed = 6;', x + 300, y + 100, C.gold, fnt(600, 22, 'mono')); txt(g, '乙：hp = 120;', x + 300, y + 200, C.b, fnt(600, 22, 'mono')); });
  al(g, pop(t, 3), () => { check(g, x + 40, y + 260, '两人的修改自动合并', 1, C.ok, 24); });
  const x2 = x + w + 40; rr(g, x2, y, w, 300, 14, 'rgba(14,20,36,.92)', C.bad, 2); txt(g, '贴图 · 模型：二进制', x2 + 24, y + 36, C.bad, fnt(800, 26));
  for (let j = 0; j < 6; j++) for (let i = 0; i < 6; i++) { g.fillStyle = `hsl(${100 + HSH(i, j) * 40},30%,${25 + HSH(j, i) * 20}%)`; g.fillRect(x2 + 40 + i * 26, y + 80 + j * 26, 24, 24); }
  al(g, pop(t, 4.5), () => { rr(g, x2 + 280, y + 110, 70, 56, 8, null, C.gold, 4); g.beginPath(); g.arc(x2 + 315, y + 110, 24, Math.PI, 0); g.strokeStyle = C.gold; g.lineWidth = 4; g.stroke(); txt(g, '甲 锁住', x2 + 380, y + 140, C.gold, fnt(700, 23)); txt(g, '乙：等甲提交', x2 + 280, y + 220, C.fg3, fnt(600, 22)); });
  al(g, pop(t, 8), () => { const yy = R.y + 520; txt(g, '游戏行业常用', x, yy, C.fg3, fnt(700, 24)); let xx = x + 180; [['Perforce', C.b], ['Git LFS', C.fg2], ['Unity Version Control', C.p]].forEach(([s, col], i) => { xx += chip(g, s, xx, yy, col, pop(t, 8.3 + i * .4), 24) + 18; }); });
  al(g, pop(t, 12), () => { const yy = R.y + 630; rr(g, x, yy - 40, R.w - 40, 90, 14, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '2026', x + 30, yy + 5, C.gold, fnt(800, 32, 'mono')); txt(g, 'Epic 开源 Lore：专为游戏设计的版本控制', x + 140, yy + 5, C.fg, fnt(700, 27)); });
};
AN.ddc = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '派生数据缓存：一个人算过，全团队都能用');
    const sx = R.x + R.w / 2, sy = R.y + 200; rr(g, sx - 160, sy - 50, 320, 100, 16, 'rgba(14,20,36,.95)', C.gold, 3); txt(g, '共享缓存服务器', sx, sy, C.gold, fnt(800, 26), 'center');
    const P = [0, 1, 2, 3, 4, 5].map(i => [R.x + 80 + i * (R.w - 160) / 5, R.y + 520]);
    P.forEach(([x, y], i) => { rr(g, x - 60, y - 40, 120, 80, 10, '#18223A', C.line2, 2); person(g, x, y + 100, C.fg2, 1); line(g, [[x, y - 40], [sx, sy + 50]], C.line, 1.5, [5, 6]); });
    const p0 = P[0], u = CL((t - 1) / 4); rr(g, p0[0] - 50, p0[1] + 10, 100 * u, 14, 4, C.o); txt(g, u < 1 ? '编译着色器…' : '算完，上传', p0[0], p0[1] - 70, C.o, fnt(700, 21), 'center');
    if (t > 5) packet(g, [[p0[0], p0[1] - 40], [sx, sy + 50]], CL((t - 5) / 1), C.o, 9);
    if (t > 6.5) P.slice(1).forEach(([x, y], i) => { const ph = CL((t - 6.5 - i * .3) / .8); if (ph < 1) packet(g, [[sx, sy + 50], [x, y - 40]], ph, C.ok, 8); else { check(g, x - 40, y, '秒取', 1, C.ok, 22); } });
    al(g, pop(t, 10), () => banner(g, R, '着色器编译 · 贴图压缩 · 网格处理：结果按内容哈希存起来', 1));
    return;
  }
  hdr(g, R, '构建：只做改动的部分，分给很多机器');
  const x = R.x + 20, y = R.y + 120, cs = 28, cols = 22, rows = 8;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const ch = HSH(i, j * 3) > .9; const col = ch ? C.o : '#1E2A44'; rr(g, x + i * (cs + 6), y + j * (cs + 6), cs, cs, 4, col, null); }
  txt(g, '橙色：这次改动的资产', x, y + rows * (cs + 6) + 26, C.o, fnt(700, 22));
  const mx = x + cols * (cs + 6) + 40, mw = R.x + R.w - mx - 10; al(g, pop(st.tk, 2), () => { txt(g, '分到 6 台机器', mx, y + 10, C.fg, fnt(700, 24)); for (let k = 0; k < 6; k++) { const yy = y + 50 + k * 42, u = CL((st.tk - 2.5 - k * .1) / 2.5); rr(g, mx, yy, mw, 26, 6, '#18223A'); rr(g, mx, yy, mw * u * (.7 + HSH(k, 1) * .3), 26, 6, C.b); } });
  al(g, pop(st.tk, 6), () => { const yy = R.y + 510; txt(g, '一次构建的时间（示意）', x, yy, C.fg2, fnt(700, 24));
    [['完整构建 · 一台机器', 1, C.bad, '好几个小时'], ['增量 · 一台机器', .32, C.gold, ''], ['增量 + 分布式', .08, C.ok, '几十分钟']].forEach(([s, v, col, b], i) => { const w = (R.w - 360) * v * SS((st.tk - 6.3 - i * .6) / 1); txt(g, s, x, yy + 60 + i * 64, C.fg, fnt(600, 22)); rr(g, x + 280, yy + 46 + i * 64, Math.max(4, w), 30, 6, col); if (b && w > 4) txt(g, b, x + 290 + w, yy + 61 + i * 64, col, fnt(700, 21)); }); });
};
AN.ci = (g, t, R, st) => {
  hdr(g, R, '持续集成：每次提交自动检查');
  flowBoxes(g, t, R, [['提交', '', C.b], ['编译', '', C.g], ['打包', '', C.o], ['测试', '', C.p]], R.y + 110, { h: 90, gap: .6 });
  const x = R.x + 20, y = R.y + 270, W = 560, H = 400; al(g, pop(t, 4), () => { rr(g, x, y, W, H, 14, '#0E1A24', C.line2, 2); txt(g, '夜里：机器人跑图', x + 20, y + 30, C.fg, fnt(700, 22));
    const P = []; for (let k = 0; k <= 60; k++) { const u = k / 60; P.push([x + 40 + u * (W - 80), y + H / 2 + 20 + Math.sin(u * 7) * 120]); } line(g, P, 'rgba(255,210,122,.5)', 2.5, [6, 8]); bot(g, ...P[Math.floor(CL((t - 4.5) / 8) * 60)], C.p, .8); });
  const gx = x + W + 50, gw = R.x + R.w - gx - 10, gh = 300; al(g, pop(t, 6), () => { rr(g, gx, y, gw, gh, 12, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, '沿路线的帧率', gx + 20, y + 30, C.fg2, fnt(700, 22)); const u = CL((t - 4.5) / 8), P = [];
    for (let k = 0; k <= 60 * u; k++) { const f = 60 - 4 * HSH(k, 1) - (Math.abs(k - 41) < 3 ? 26 : 0); P.push([gx + 20 + k / 60 * (gw - 40), y + gh - 30 - (f - 20) / 45 * (gh - 80)]); }
    line(g, [[gx + 20, y + gh - 30 - (60 - 20) / 45 * (gh - 80)], [gx + gw - 20, y + gh - 30 - (60 - 20) / 45 * (gh - 80)]], C.line2, 1, [4, 6]); line(g, P, C.ok, 3);
    if (u > .72) { const px = gx + 20 + 41 / 60 * (gw - 40); dot(g, px, y + gh - 30 - (34 - 20) / 45 * (gh - 80), 9, C.bad); txt(g, '突然变慢', px + 16, y + gh - 60, C.bad, fnt(700, 21)); } });
  al(g, pop(t, 13), () => { rr(g, gx, y + gh + 30, gw, 70, 12, 'rgba(255,107,107,.08)', C.bad, 2); txt(g, '第二天一早：定位到 提交 #48213 · 新加的雾效', gx + 20, y + gh + 65, C.fg, fnt(700, 23)); });
};

// ---------- 05 玩法填充 ----------
AN.checklist = (g, t, R, st) => {
  hdr(g, R, '清单式填充：把待办事项撒满地图');
  const x = R.x + 20, y = R.y + 110, W = 780, H = 620; img(g, reliefCanvas(3), x, y, W, H); g.fillStyle = 'rgba(8,12,22,.35)'; g.fillRect(x, y, W, H);
  const K = [['?', C.gold], ['◆', C.r], ['●', C.b], ['▲', C.g]], n = Math.floor(CL((t - .5) / 8) * 110);
  for (let i = 0; i < n; i++) { const [s, col] = K[i % 4], X = x + 20 + HSH(i, 1) * (W - 40), Y = y + 20 + HSH(i, 2) * (H - 40); dot(g, X, Y, 13, 'rgba(10,14,26,.85)'); txt(g, s, X, Y + 1, col, fnt(800, 18), 'center'); }
  const px = x + W + 40, L = [['?', '支线任务', 34, C.gold], ['◆', '据点', 28, C.r], ['●', '收集品', 27, C.b], ['▲', '挑战', 21, C.g]];
  L.forEach(([s, a, m, col], i) => { const c = Math.floor(n / 4 + (i < n % 4 ? 1 : 0)); al(g, pop(t, 1 + i * .8), () => { const yy = y + 40 + i * 90; txt(g, s, px + 20, yy, col, fnt(800, 30), 'center'); txt(g, a, px + 60, yy, C.fg, fnt(700, 26)); txt(g, `0 / ${c * 3}`, R.x + R.w - 20, yy, C.fg2, fnt(700, 26, 'mono'), 'right'); }); });
  al(g, pop(t, 10), () => { txt(g, '内容够多 ≠ 好玩', px, y + 470, C.fg, fnt(800, 32)); txt(g, '玩家看到的是一长串待办', px, y + 520, C.fg2, fnt(600, 24)); });
};
AN.heat = (g, t, R, st) => {
  hdr(g, R, '内容分布：按走路的时间安排间距，再看热力图');
  const x = R.x + 20, y = R.y + 110, W = 800, H = 620; img(g, reliefCanvas(3), x, y, W, H); g.fillStyle = 'rgba(8,12,22,.35)'; g.fillRect(x, y, W, H);
  const P = pcache('poi3', () => poissonPts(W - 80, H - 80, 120, 31).map(p => [x + 40 + p[0], y + 40 + p[1]]));
  P.forEach((p, i) => al(g, pop(t, .3 + i * .1), () => { dot(g, p[0], p[1], 10, C.gold); }));
  al(g, pop(t, 3), () => { const p = P.reduce((a, b) => Math.hypot(b[0] - x - W * .55, b[1] - y - H * .5) < Math.hypot(a[0] - x - W * .55, a[1] - y - H * .5) ? b : a); [[60, '步行 1 分钟', C.fg2], [120, '步行 2 分钟', C.fg3]].forEach(([r, s, col]) => { g.beginPath(); g.arc(p[0], p[1], r, 0, 7); g.strokeStyle = col; g.setLineDash([6, 6]); g.lineWidth = 2; g.stroke(); g.setLineDash([]); txt(g, s, p[0] + (r > 80 ? 0 : 0), p[1] + (r > 80 ? -r - 14 : r + 18), col, fnt(600, 19), 'center'); }); });
  const hu = SS((t - 7) / 2); if (hu > 0) { g.save(); g.globalCompositeOperation = 'lighter'; [[.25, .35, 1], [.3, .4, .8], [.7, .6, .9], [.5, .8, .4]].forEach(([u, v, a]) => { const gx = x + u * W, gy = y + v * H, gr = g.createRadialGradient(gx, gy, 0, gx, gy, 160); gr.addColorStop(0, `rgba(255,90,60,${.55 * a * hu})`); gr.addColorStop(1, 'rgba(255,90,60,0)'); g.fillStyle = gr; g.fillRect(gx - 160, gy - 160, 320, 320); }); g.restore(); }
  const px = x + W + 50; al(g, pop(t, 2), () => { rr(g, px, y, R.x + R.w - px, 230, 14, 'rgba(14,20,36,.92)', C.gold, 2); txt(g, '兴趣点间距', px + 24, y + 40, C.gold, fnt(800, 26)); txt(g, '每走一段，就有新东西进入视野', px + 24, y + 100, C.fg2, fnt(600, 23)); txt(g, '骑马时间距可以更大', px + 24, y + 150, C.fg2, fnt(600, 23)); });
  al(g, pop(t, 7), () => { rr(g, px, y + 270, R.x + R.w - px, 230, 14, 'rgba(14,20,36,.92)', C.r, 2); txt(g, '测试热力图', px + 24, y + 310, C.r, fnt(800, 26)); txt(g, '红：玩家扎堆的地方', px + 24, y + 370, C.fg2, fnt(600, 23)); txt(g, '空白：根本没人去 → 调整', px + 24, y + 420, C.fg2, fnt(600, 23)); });
};
AN.quest = (g, t, R, st) => {
  hdr(g, R, '数据驱动：任务是表格里的一行行数据');
  const x = R.x + 20, y = R.y + 130, cols = [['任务', 200], ['触发条件', 300], ['目标', 300], ['奖励', 220]], rows = [['寻找失踪的猎人', '进入北部森林', '找到营地 · 击败狼群', '金币 200'], ['修复灯塔', '和守塔人对话', '收集零件 ×3', '地图标记'], ['护送商队', '等级 ≥ 5', '护送到河港', '马鞍'], ['夜里的歌声', '夜晚 · 湖边', '找到歌者', '一首曲子']];
  let cx = x; cols.forEach(([h, w]) => { rr(g, cx, y, w - 6, 56, 8, '#18223A'); txt(g, h, cx + 16, y + 28, C.gold, fnt(800, 23)); cx += w; });
  rows.forEach((r, i) => al(g, pop(t, 1 + i * .8), () => { let cx2 = x; r.forEach((s, j) => { rr(g, cx2, y + 66 + i * 66, cols[j][1] - 6, 56, 8, 'rgba(14,20,36,.92)', C.line2, 1.5); txt(g, s, cx2 + 16, y + 94 + i * 66, C.fg, fnt(600, 22)); cx2 += cols[j][1]; }); }));
  al(g, pop(t, 5), () => { person(g, x + 40, y + 420, C.o, 1.2); txt(g, '设计师直接编辑表格', x + 80, y + 420, C.o, fnt(700, 24)); });
  al(g, pop(t, 8), () => { const bx = x + 560, by = y + 380; arrow(g, bx - 40, by + 40, bx - 4, by + 40, C.fg3, 3, 10); rr(g, bx, by, 440, 90, 14, 'rgba(14,20,36,.95)', C.b, 3); txt(g, '程序：一套通用执行逻辑', bx + 220, by + 45, C.b, fnt(800, 26), 'center'); });
};
AN.systemic = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '系统化：几条会相互作用的规则');
    const x = R.x + 20, y = R.y + 110, cs = 30, nx = 22, ny = 16, T = st.tk, wind = 1;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const d = (i - 3) * .8 - Math.abs(j - 8) * .5 * (1 + .3 * HSH(i, j)), burnT = 1.5 + Math.max(0, d) * .55 + HSH(i, j) * .5, rained = i > 15 && burnT > 8; let col = '#2F6B45';
      if (T > burnT && !rained) col = T - burnT < 3 && !(i > 15 && T > 8) ? (HSH(i + Math.floor(T * 8), j) > .5 ? '#FF8A3D' : '#FFC24D') : '#3A2F2A';
      rr(g, x + i * cs, y + j * cs, cs - 3, cs - 3, 4, col); }
    al(g, pop(T, 1.5), () => { for (let k = 0; k < 4; k++) arrow(g, x + 20 + ((T * 80 + k * 160) % 560), y + 100 + k * 100, x + 90 + ((T * 80 + k * 160) % 560), y + 100 + k * 100, 'rgba(233,238,247,.6)', 3, 10); txt(g, '风 →', x + 10, y - 20 + 0, C.fg2, fnt(700, 22)); });
    if (T > 8) { g.save(); g.beginPath(); g.rect(x + 16 * cs, y, 6 * cs, ny * cs); g.clip(); for (let k = 0; k < 60; k++) { const rx = x + 16 * cs + HSH(k, 1) * 6 * cs, ry = y + ((HSH(k, 2) * ny * cs + T * 400) % (ny * cs)); line(g, [[rx, ry], [rx - 4, ry + 16]], 'rgba(140,200,255,.7)', 2); } g.restore(); txt(g, '下雨：火灭了', x + 16 * cs + 90, y + ny * cs + 30, C.b, fnt(700, 22), 'center'); }
    const px = x + nx * cs + 40; const RL = [['火会蔓延', C.o, 0], ['风吹动火', C.fg, 1.5], ['金属导电', C.gold, 4], ['雨浇灭火', C.b, 8]];
    RL.forEach(([s, col, t0], i) => al(g, pop(T, t0), () => { rr(g, px, y + i * 110, R.x + R.w - px - 10, 90, 14, 'rgba(14,20,36,.92)', col, 2); txt(g, s, px + 24, y + 45 + i * 110, col, fnt(800, 27)); }));
    al(g, pop(T, 10), () => txt(g, '组合起来：玩家想出设计者没预料的玩法', px, y + 470, C.fg, fnt(700, 22)));
    return;
  }
  hdr(g, R, '模板任务：能无限生成，但很快重复');
  const x = R.x + 20, y = R.y + 120, W1 = [['取回', '讨伐', '护送'], ['古剑', '狼王', '商人', '药草'], ['北部洞穴', '废弃矿坑', '湖边营地', '山顶神殿']];
  for (let k = 0; k < 4; k++) al(g, pop(st.tk, .5 + k * 1), () => { const yy = y + k * 84, s = (i, j) => W1[i][Math.floor(HSH(k * 7 + i, 13 + j) * W1[i].length)]; rr(g, x + k * 14, yy, 560, 66, 12, 'rgba(14,20,36,.95)', k === 3 ? C.gold : C.line2, 2); txt(g, `${s(0, 1)}【${s(1, 2)}】，地点：${s(2, 3)}`, x + 24 + k * 14, yy + 33, C.fg, fnt(600, 24)); });
  al(g, pop(st.tk, 5), () => txt(g, '同样的句式，换几个词', x, y + 380, C.fg3, fnt(600, 23)));
  al(g, pop(st.tk, 8), () => { const cx = R.x + 960, cy = R.y + 380, r = 180, S = [['手工主线', .4, C.r], ['系统化的世界', .4, C.g], ['适量模板内容', .2, C.gold]]; let a = -1.57;
    S.forEach(([s, v, col], i) => { const u = SS((st.tk - 8.3 - i * .5) / .8), b = a + v * 6.283 * u; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, r, a, b); g.closePath(); g.fillStyle = col + '55'; g.fill(); g.strokeStyle = col; g.lineWidth = 2; g.stroke(); const m = (a + b) / 2; if (u > .9) txt(g, s, cx + Math.cos(m) * (r + 30), cy + Math.sin(m) * (r + 30), col, fnt(700, 24), Math.cos(m) > 0 ? 'left' : 'right'); a = b; });
    txt(g, '现在的主流（示意比例）', cx, cy + r + 50, C.fg2, fnt(600, 22), 'center'); });
};

// ---------- 06 昙花一现 / 07 对照 / 08 角色 ----------
AN.graves3 = (g, t, R, st) => {
  lifespans(g, t, R, st, [['体素大世界', 2013, 2016, '项目取消，体素退回建造类', 0], ['全程序化宇宙', 2013, 2016, '上线后口碑跌到谷底', 1], ['爬塔解锁地图', 2007, 2018, '被批评为公式化', 2]], '昙花一现', '条形为大致的流行时段（示意）', 2005, 2027, [2005, 2010, 2015, 2020, 2025]);
};
AN.table3 = (g, t, R, st) => engTable(g, t, R, st, '三大引擎对照：造得出', ['地形生成', '程序化散布', '资产库', '版本控制', '协作编辑', '构建与 CI'],
  [[['Landscape 工具', 2], ['Terrain Tools', 2], ['Terrain3D（插件）', 1]], [['PCG 框架', 2], ['Houdini Engine · 自研', 1], ['ProtonScatter（插件）', 1]],
   [['Fab（含 Megascans）', 2], ['Asset Store', 2], ['Asset Library', 1]], [['Perforce · Git 集成', 1], ['Unity Version Control', 2], ['Git：文本场景好合并', 1]],
   [['One File Per Actor · 多人编辑', 2], ['Prefab 拆分 · Smart Merge', 1], ['.tscn 文本合并', 1]], [['Horde · BuildGraph', 2], ['Build Automation', 2], ['社区方案 · 自己搭', 0]]], '大团队往往在任何引擎之上，再造一层自己的工具');
AN.roles3 = (g, t, R, st) => {
  if (st.k <= 1) { hdr(g, R, '谁来做这些事');
    const D = [['工具程序', ['负责：编辑器扩展 · 自动化流程', '技能：引擎编辑器接口 · 脚本', '懂一点用户体验'], C.b, 0], ['地编与环境美术', ['负责：地形 · 植被 · 场景', '技能：审美 · 地理常识', '会用程序化工具'], C.g, 0], ['关卡与玩法设计', ['负责：放什么 · 怎么走', '技能：节奏 · 动线', '数据配置'], C.o, 1], ['构建工程', ['负责：版本控制 · CI · 打包', '技能：服务器 · 脚本', '各平台构建流程'], C.p, 1]];
    const w = (R.w - 90) / 4; D.forEach(([h, ls, col, kk], i) => { if (st.k < kk) return; const u = pop(st.k === kk ? (kk ? st.tk : t) : 99, .3 + (i % 2) * 2.5); g.save(); g.translate(0, (1 - u) * 20); card(g, R.x + i * (w + 30), R.y + 130, w, 330, h, ls, col, u, st.k === kk, 25); g.restore(); });
    al(g, pop(t, 2), () => { const tools = ['Houdini', 'Gaea', 'World Machine', 'RealityScan', 'Perforce', 'Jenkins']; let x = R.x; txt(g, '常用工具', x, R.y + 560, C.fg3, fnt(700, 26)); x += 140; tools.forEach((s, i) => { x += chip(g, s, x, R.y + 560, C.p, pop(t, 2.3 + i * .2), 24) + 16; }); });
    return; }
  hdr(g, R, '入门练习与下一集');
  ['用噪声 + 侵蚀生成一块地形', '写一条按坡度散布树木的规则'].forEach((s, i) => check(g, R.x + 40, R.y + 180 + i * 100, s, pop(st.tk, .5 + i * 1.8), C.ok, 32));
  al(g, pop(st.tk, 6), () => { rr(g, R.x + 900, R.y + 150, 760, 360, 22, 'rgba(14,20,36,.92)', C.r, 3); txt(g, '第四集 · 最后一集', R.x + 1280, R.y + 210, C.r, fnt(700, 30), 'center'); txt(g, '活起来', R.x + 1280, R.y + 310, C.fg, fnt(800, 80, 'serif'), 'center'); txt(g, 'NPC · 物理 · 存档 · 多人 · AI', R.x + 1280, R.y + 420, C.fg2, fnt(600, 28), 'center'); });
};
