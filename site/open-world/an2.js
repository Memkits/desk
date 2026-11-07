// 第二集动画：画得出
const n2 = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, s = v => v * v * (3 - 2 * v), h = (a, b) => HSH(a, b) * 2 - 1;
  const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1); return LERP(LERP(a, b, s(xf)), LERP(c, d, s(xf)), s(yf)); };
const fbm2 = (x, y, o = 5) => { let v = 0, a = .5; for (let i = 0; i < o; i++) { v += a * n2(x, y); x *= 2.03; y *= 2.03; a *= .5; } return v; };
const HM = (u, v) => CL(.5 + 1.1 * fbm2(u * 3 + 11, v * 3 + 7) + .25 * Math.sin(u * 4), 0, 1);
let HMC = null;
function hmCanvas() { if (HMC) return HMC; const n = 160, c = document.createElement('canvas'); c.width = c.height = n; const x = c.getContext('2d'), im = x.createImageData(n, n);
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const v = HM(i / n, j / n) * 255, k = (j * n + i) * 4; im.data[k] = im.data[k + 1] = im.data[k + 2] = v; im.data[k + 3] = 255; } x.putImageData(im, 0, 0); return HMC = c; }
function engTable(g, t, R, st, title, rows, D, banner2) {
  hdr(g, R, title, '内置 = 引擎自带完整方案 · 部分 = 有积木或靠插件 · 自写 = 团队自己实现');
  const cols = ['虚幻引擎五', 'Unity', 'Godot'], x0 = R.x + 20, cw0 = 200, cw = (R.w - 40 - cw0) / 3, y0 = R.y + 140, rh = Math.min(104, 560 / rows.length), K = [[C.bad, '自写'], [C.gold, '部分'], [C.ok, '内置']];
  cols.forEach((c, j) => al(g, pop(t, .2 + j * .3), () => txt(g, c, x0 + cw0 + j * cw + cw / 2, y0, C.fg, fnt(800, 30), 'center')));
  rows.forEach((r, i) => { const y = y0 + 40 + i * rh; txt(g, r, x0, y + rh / 2, C.fg2, fnt(700, 26)); line(g, [[x0, y], [R.x + R.w - 20, y]], C.line, 1);
    D[i].forEach(([s, lv], j) => { const hot = st.k === 0 ? j === 0 : j > 0; const u = pop(t, .6 + i * .3 + j * .15);
      al(g, u * (hot ? 1 : .45), () => { const x = x0 + cw0 + j * cw + 10; rr(g, x, y + 12, cw - 20, rh - 24, 12, K[lv][0] + '18', K[lv][0], 2); txt(g, s, x + 18, y + rh / 2, C.fg, fnt(600, 21)); txt(g, K[lv][1], x + cw - 36, y + rh / 2, K[lv][0], fnt(800, 19), 'right'); }); }); });
  if (banner2 && st.k === st.n - 1) al(g, pop(st.tk, 3), () => banner(g, R, banner2, 1));
}

// ---------- 片头 ----------
AN.open2 = (g, t, R, st) => {
  landscape(g, R, t, st.k === 0 ? 1 : .45);
  const sx = R.x + R.w * .2 + t * 6, sy = R.y + 150; const gr = g.createRadialGradient(sx, sy, 0, sx, sy, 160); gr.addColorStop(0, 'rgba(255,210,122,.55)'); gr.addColorStop(1, 'rgba(255,210,122,0)'); g.fillStyle = gr; g.fillRect(sx - 160, sy - 160, 320, 320); dot(g, sx, sy, 26, '#FFE2A8');
  if (st.k >= 1) { const E = [['地形', C.o], ['植被', C.g], ['光照', C.gold], ['天空 · 云 · 水', C.b], ['帧预算', C.r]]; let x = R.x + 40;
    E.forEach(([s, col], i) => { x += chip(g, s, x, R.y + 380, col, pop(st.tk, .5 + i * .8), 34) + 26; });
    al(g, pop(st.tk, 6), () => { const cx = R.x + R.w / 2, cy = R.y + 600; g.strokeStyle = C.line2; g.lineWidth = 14; g.beginPath(); g.arc(cx, cy, 90, 0, 7); g.stroke(); g.strokeStyle = C.r; g.beginPath(); g.arc(cx, cy, 90, -1.57, -1.57 + 6.28 * CL((st.tk - 6) / 3)); g.stroke(); txt(g, '16.6 ms', cx, cy, C.fg, fnt(800, 34, 'mono'), 'center'); txt(g, '一帧', cx, cy + 130, C.fg2, fnt(600, 24), 'center'); }); }
};

// ---------- 01 地形 ----------
AN.hmap = (g, t, R, st) => {
  hdr(g, R, '高度图：每个格点只存一个高度');
  const ix = R.x + 20, iy = R.y + 120, sz = 400; g.imageSmoothingEnabled = false; g.drawImage(hmCanvas(), ix, iy, sz, sz); g.imageSmoothingEnabled = true; rr(g, ix, iy, sz, sz, 4, null, C.line2, 2);
  txt(g, '灰度：越亮越高', ix + sz / 2, iy + sz + 34, C.fg2, fnt(600, 22), 'center');
  const N = 34, u = SS((t - 1) / 3), ox = R.x + 900, oy = R.y + 300, cs = 15;
  const P = (i, j) => { const h = HM(i / N, j / N); return [ox + (i - j) * cs * .9, oy + (i + j) * cs * .45 - h * 170 * u]; };
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const h = HM(i / N, j / N); const c = h > .72 ? '#D9DDE6' : h > .5 ? '#7F8C6A' : h > .3 ? '#4F8A5B' : '#3E6E8E';
    const a = P(i, j), b = P(i + 1, j), c2 = P(i + 1, j + 1), d = P(i, j + 1); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.lineTo(...c2); g.lineTo(...d); g.closePath(); g.fillStyle = c; g.globalAlpha = .9; g.fill(); g.globalAlpha = 1; g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 1; g.stroke(); }
  al(g, pop(t, 5), () => { const pi = 20, pj = 12, px = ix + pi / N * sz, py = iy + pj / N * sz; rr(g, px - 6, py - 6, 12, 12, 2, null, C.gold, 3); const q = P(pi, pj); dot(g, q[0], q[1], 8, C.gold); line(g, [[px + 8, py], [q[0] - 10, q[1]]], C.gold, 2, [6, 6]); txt(g, '一个像素 = 一个高度', (px + q[0]) / 2, (py + q[1]) / 2 - 24, C.gold, fnt(700, 22), 'center'); });
};
function quadCut(cam, x, y, s, d, out, thr, md) { const cx = x + s / 2, cy = y + s / 2, dist = Math.max(20, Math.hypot(cx - cam[0], cy - cam[1]) - s * .5); if (d < md && s / dist > thr) { const h = s / 2; quadCut(cam, x, y, h, d + 1, out, thr, md); quadCut(cam, x + h, y, h, d + 1, out, thr, md); quadCut(cam, x, y + h, h, d + 1, out, thr, md); quadCut(cam, x + h, y + h, h, d + 1, out, thr, md); } else out.push([x, y, s, d]); }
AN.clipmap = (g, t, R, st) => {
  hdr(g, R, '地形 LOD：近处细，远处粗');
  const S = 560, x0 = R.x + 20, y0 = R.y + 130, cam = [x0 + S * (.5 + .3 * Math.sin(t * .3)), y0 + S * (.55 + .25 * Math.cos(t * .23))];
  txt(g, '四叉树', x0, y0 - 20, C.o, fnt(800, 26));
  const out = []; quadCut(cam, x0, y0, S, 0, out, .9, 6); out.forEach(([x, y, s, d]) => rr(g, x + 1, y + 1, s - 2, s - 2, 2, `rgba(255,178,92,${.05 + d * .04})`, C.o, 1));
  dot(g, cam[0], cam[1], 10, C.fg);
  const cx0 = R.x + 680; txt(g, 'clipmap：以摄像机为中心套几圈', cx0, y0 - 20, C.b, fnt(800, 26));
  const cc = [cx0 + S / 2 + (cam[0] - x0 - S / 2) * .3, y0 + S / 2 + (cam[1] - y0 - S / 2) * .3];
  for (let L = 3; L >= 0; L--) { const cs = 10 * 2 ** L, half = cs * 6, sx = Math.round(cc[0] / cs) * cs - half, sy = Math.round(cc[1] / cs) * cs - half;
    g.save(); g.beginPath(); g.rect(cx0, y0, S, S); g.clip(); for (let i = 0; i <= 12; i++) { line(g, [[sx + i * cs, sy], [sx + i * cs, sy + 12 * cs]], [C.b, C.g, C.p, C.fg3][L] + '99', 1); line(g, [[sx, sy + i * cs], [sx + 12 * cs, sy + i * cs]], [C.b, C.g, C.p, C.fg3][L] + '99', 1); }
    rr(g, sx, sy, 12 * cs, 12 * cs, 0, L ? null : 'rgba(92,180,255,.08)', [C.b, C.g, C.p, C.fg3][L], 2); g.restore(); }
  dot(g, cc[0], cc[1], 10, C.fg); rr(g, cx0, y0, S, S, 6, null, C.line2, 2);
  al(g, pop(t, 4), () => txt(g, '每往外一圈，格子大一倍 · 接缝处要处理，否则会裂开', R.x + 20, y0 + S + 50, C.fg2, fnt(600, 23)));
};
let LAYC = null;
function layerCanvas() { if (LAYC) return LAYC; const n = 120, mk = f => { const c = document.createElement('canvas'); c.width = c.height = n; const x = c.getContext('2d'), im = x.createImageData(n, n); for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const [r, gg, b] = f(i / n, j / n), k = (j * n + i) * 4; im.data[k] = r; im.data[k + 1] = gg; im.data[k + 2] = b; im.data[k + 3] = 255; } x.putImageData(im, 0, 0); return c; };
  const grass = (u, v) => { const q = fbm2(u * 20, v * 20, 3); return [60 + 40 * q, 120 + 50 * q, 50 + 20 * q]; }, rock = (u, v) => { const q = fbm2(u * 6, v * 9, 5); return [120 + 70 * q, 118 + 70 * q, 115 + 70 * q]; }, mud = (u, v) => { const q = fbm2(u * 10, v * 10, 4); return [110 + 40 * q, 80 + 30 * q, 55 + 20 * q]; };
  const w = (u, v) => { const h = HM(u, v); const r = CL((h - .55) * 5), m = CL((.38 - h) * 5) * (1 - r); return [1 - r - m, r, m]; };
  const L = [mk(grass), mk(rock), mk(mud)];
  const wm = mk((u, v) => { const [a, b, c] = w(u, v); return [b * 255, a * 255, c * 255]; });
  const out = mk((u, v) => { const [a, b, c] = w(u, v), A = grass(u, v), B = rock(u, v), M = mud(u, v); return [0, 1, 2].map(k => a * A[k] + b * B[k] + c * M[k]); });
  return LAYC = { L, wm, out }; }
AN.splat = (g, t, R, st) => {
  const D = st.D || 20, f = t / D, LC = layerCanvas();
  hdr(g, R, f < .5 ? '材质分层：用权重图混合' : '虚拟纹理：只把看得见的页放进显存');
  if (f < .5) {
    const names = ['草地', '岩石', '泥土'];
    LC.L.forEach((c, i) => al(g, pop(t, .3 + i * .4), () => { g.drawImage(c, R.x + 20, R.y + 120 + i * 200, 170, 170); txt(g, names[i], R.x + 210, R.y + 205 + i * 200, C.fg, fnt(700, 26)); }));
    al(g, pop(t, 2), () => { g.drawImage(LC.wm, R.x + 420, R.y + 200, 360, 360); txt(g, '权重图（每个像素：各层占多少）', R.x + 600, R.y + 590, C.fg2, fnt(600, 21), 'center'); arrow(g, R.x + 330, R.y + 380, R.x + 410, R.y + 380, C.fg3, 3, 10); });
    al(g, pop(t, 4), () => { arrow(g, R.x + 800, R.y + 380, R.x + 880, R.y + 380, C.fg3, 3, 10); g.drawImage(LC.out, R.x + 900, R.y + 200, 360, 360); txt(g, '混合结果', R.x + 1080, R.y + 590, C.fg2, fnt(600, 21), 'center'); txt(g, '每个像素要采样很多张贴图', R.x + 900, R.y + 650, C.bad, fnt(700, 22)); });
    return;
  }
  const t2 = t - D * .5, gx = R.x + 20, gy = R.y + 130, cols = 16, rows = 12, cs = 42, cam = [gx + cs * 8 + Math.sin(t2 * .4) * cs * 4, gy + rows * cs + 10];
  g.drawImage(LC.out, gx, gy, cols * cs, rows * cs); g.fillStyle = 'rgba(7,10,18,.55)'; g.fillRect(gx, gy, cols * cs, rows * cs);
  const vis = []; for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const cx = gx + (i + .5) * cs, cy = gy + (j + .5) * cs, a = Math.atan2(cy - cam[1], cx - cam[0]) + 1.5708, d = Math.hypot(cx - cam[0], cy - cam[1]); if (Math.abs(a) < .5 && d < 420) vis.push([i, j, d]); }
  vis.forEach(([i, j, d]) => { g.save(); g.beginPath(); g.rect(gx + i * cs, gy + j * cs, cs, cs); g.clip(); g.drawImage(LC.out, gx, gy, cols * cs, rows * cs); g.restore(); rr(g, gx + i * cs + 1, gy + j * cs + 1, cs - 2, cs - 2, 2, null, d < 200 ? C.gold : 'rgba(255,210,122,.5)', 1.5); });
  for (let i = 0; i <= cols; i++) line(g, [[gx + i * cs, gy], [gx + i * cs, gy + rows * cs]], 'rgba(255,255,255,.08)', 1); for (let j = 0; j <= rows; j++) line(g, [[gx, gy + j * cs], [gx + cols * cs, gy + j * cs]], 'rgba(255,255,255,.08)', 1);
  g.fillStyle = C.fg; g.beginPath(); g.moveTo(cam[0], cam[1] - 18); g.lineTo(cam[0] - 12, cam[1] + 8); g.lineTo(cam[0] + 12, cam[1] + 8); g.closePath(); g.fill();
  txt(g, '虚拟纹理：整张地形一张巨图，切成小页', gx, gy - 20, C.fg2, fnt(600, 22));
  const px = R.x + 760, py = gy; txt(g, '物理缓存（显存）', px, py - 20, C.fg2, fnt(600, 22)); const pc = 8, ps = 56;
  for (let k = 0; k < pc * pc; k++) { const i = k % pc, j = Math.floor(k / pc), x = px + i * (ps + 4), y = py + j * (ps + 4); const it = vis[k]; if (it && k < Math.floor(CL(t2 / 4) * vis.length)) { g.save(); g.beginPath(); g.rect(x, y, ps, ps); g.clip(); g.drawImage(LC.out, x - it[0] * ps, y - it[1] * ps, cols * ps, rows * ps); g.restore(); rr(g, x, y, ps, ps, 3, null, C.gold, 1.5); } else rr(g, x, y, ps, ps, 3, 'rgba(255,255,255,.03)', C.line2, 1); }
  txt(g, `看得见 ${vis.length} 页 / 全部 ${cols * rows} 页`, px, py + pc * (ps + 4) + 30, C.gold, fnt(700, 22, 'mono'));
};
AN.terr_eng = (g, t, R, st) => {
  hdr(g, R, '三大引擎的地形');
  const D = [['虚幻引擎', ['地形组件 + 自动 LOD', '运行时虚拟纹理', '5.8：网格地形（实验）'], C.b], ['Unity', ['Terrain 组件', '按像素误差调整精度', '树木与细节层'], C.g], ['Godot', ['引擎本身没有地形', '社区插件 Terrain3D', 'clipmap 方案，开源'], C.o]];
  const w = (R.w - 40) / 3; D.forEach(([h, ls, col], i) => { const u = pop(t, .3 + i * .9); g.save(); g.translate(0, (1 - u) * 20); card(g, R.x + i * (w + 20), R.y + 140, w, 330, h, ls, col, u, false, 26); g.restore(); });
};
AN.overhang = (g, t, R, st) => {
  hdr(g, R, '高度图做不出悬垂和洞穴');
  const x0 = R.x + 20, w = 600, base = R.y + 620; const prof = x => base - 120 - 80 * Math.sin(x * .012) - 40 * Math.sin(x * .031);
  txt(g, '剖面：高度图', x0, R.y + 130, C.o, fnt(800, 26));
  g.beginPath(); g.moveTo(x0, base + 60); for (let x = 0; x <= w; x += 6) g.lineTo(x0 + x, prof(x)); g.lineTo(x0 + w, base + 60); g.closePath(); g.fillStyle = 'rgba(255,178,92,.25)'; g.fill();
  for (let x = 20; x < w; x += 40) { const u = pop(t, .5 + x / 300); al(g, u, () => { line(g, [[x0 + x, R.y + 170], [x0 + x, prof(x)]], C.fg3, 1.5, [4, 5]); dot(g, x0 + x, prof(x), 5, C.o); }); }
  al(g, pop(t, 3), () => { g.beginPath(); g.moveTo(x0 + 330, prof(330)); g.quadraticCurveTo(x0 + 470, prof(330) - 10, x0 + 450, prof(330) + 90); g.quadraticCurveTo(x0 + 380, prof(330) + 40, x0 + 330, prof(330) + 30); g.closePath(); g.fillStyle = 'rgba(255,107,107,.2)'; g.fill(); g.strokeStyle = C.bad; g.setLineDash([6, 6]); g.stroke(); g.setLineDash([]); txt(g, '悬崖下凹：同一位置有两个高度', x0 + 300, prof(330) - 60, C.bad, fnt(700, 22)); });
  const mx = R.x + 700; txt(g, '网格地形：直接用三维网格', mx, R.y + 130, C.b, fnt(800, 26));
  al(g, pop(t, 5), () => { g.beginPath(); g.moveTo(mx, base + 60); g.lineTo(mx, base - 160); g.quadraticCurveTo(mx + 120, base - 330, mx + 260, base - 300); g.quadraticCurveTo(mx + 420, base - 280, mx + 560, base - 150); g.lineTo(mx + 560, base + 60); g.lineTo(mx + 420, base + 60); g.quadraticCurveTo(mx + 420, base - 120, mx + 290, base - 130); g.quadraticCurveTo(mx + 150, base - 130, mx + 150, base + 60); g.closePath(); g.fillStyle = 'rgba(92,180,255,.25)'; g.fill(); g.strokeStyle = C.b; g.lineWidth = 2.5; g.stroke();
    txt(g, '拱门', mx + 285, base - 40, C.fg, fnt(700, 24), 'center'); });
};

// ---------- 02 植被 ----------
function blade(g, x, y, h, bend, col) { g.beginPath(); g.moveTo(x - 3, y); g.quadraticCurveTo(x + bend * .5, y - h * .6, x + bend, y - h); g.quadraticCurveTo(x + bend * .5 + 2, y - h * .6, x + 3, y); g.closePath(); g.fillStyle = col; g.fill(); }
AN.inst = (g, t, R, st) => {
  hdr(g, R, '实例化：同一个模型，一次画很多份');
  const gx = R.x + 20, gy = R.y + 560, n = Math.floor(600 * SS((t - .3) / 3));
  for (let i = 0; i < n; i++) { const x = gx + HSH(i, 1) * 760, y = gy - 300 + HSH(i, 2) * 320, s = .6 + (y - gy + 300) / 320 * .8; blade(g, x, y, 30 * s, Math.sin(t * 2 + x * .02) * 6 * s, `hsl(${100 + HSH(i, 3) * 40},45%,${35 + HSH(i, 4) * 20}%)`); }
  txt(g, `草：${Math.floor(n * 83)} 丛（示意）`, gx, gy + 60, C.fg2, fnt(700, 22, 'mono'));
  const px = R.x + 860;
  al(g, pop(t, 2), () => { txt(g, '逐个提交', px, R.y + 150, C.fg2, fnt(700, 24)); rr(g, px, R.y + 170, 420 * SS((t - 2) / 2), 40, 8, 'rgba(255,107,107,.3)', C.bad, 2); txt(g, '50 000 次绘制调用', px + 12, R.y + 190, C.fg, fnt(700, 21));
    txt(g, '实例化', px, R.y + 260, C.fg2, fnt(700, 24)); rr(g, px, R.y + 280, 14, 40, 6, 'rgba(95,211,154,.4)', C.ok, 2); txt(g, '1 次', px + 30, R.y + 300, C.fg, fnt(700, 21)); });
  al(g, pop(t, 4), () => { txt(g, '实例表（每行一份）', px, R.y + 390, C.fg2, fnt(700, 22)); const H = ['#', '位置', '朝向', '缩放']; H.forEach((h, i) => txt(g, h, px + [0, 70, 300, 420][i], R.y + 430, C.fg3, fnt(700, 20)));
    for (let r = 0; r < 6; r++) { const k = (Math.floor(t * 3) + r) % 50000, y = R.y + 470 + r * 40; rr(g, px - 8, y - 18, 520, 36, 6, 'rgba(255,255,255,.03)'); txt(g, String(k), px, y, C.fg2, fnt(600, 19, 'mono')); txt(g, `(${(HSH(k, 1) * 900).toFixed(1)}, ${(HSH(k, 2) * 900).toFixed(1)})`, px + 70, y, C.fg, fnt(600, 19, 'mono')); txt(g, `${Math.floor(HSH(k, 3) * 360)}°`, px + 300, y, C.fg, fnt(600, 19, 'mono')); txt(g, (.7 + HSH(k, 4) * .6).toFixed(2), px + 420, y, C.fg, fnt(600, 19, 'mono')); } });
};
function treeDraw(g, x, y, len, ang, depth, u, wind, leaves) { if (depth === 0 || u <= 0) { leaves.push([x, y, ang]); return; } const k = Math.min(1, u * 4), sw = wind * (6 - depth) * .02;
  const x2 = x + Math.cos(ang + sw) * len * k, y2 = y + Math.sin(ang + sw) * len * k; line(g, [[x, y], [x2, y2]], '#8A6B4E', depth * 2.2); if (k < 1) return;
  treeDraw(g, x2, y2, len * .72, ang - .45, depth - 1, u * 1.25 - .25, wind, leaves); treeDraw(g, x2, y2, len * .72, ang + .4, depth - 1, u * 1.25 - .25, wind, leaves); }
AN.tree = (g, t, R, st) => {
  hdr(g, R, '一棵树：规则生成 + 叶片面片');
  const leaves = [], cx = R.x + 330, by = R.y + 780; treeDraw(g, cx, by, 150, -1.5708, 6, CL((t - .3) / 3), 0, leaves);
  const lu = pop(t, 3.5), heat = SS((t - 6) / 1);
  leaves.forEach(([x, y, a], i) => al(g, lu, () => { g.save(); g.translate(x, y); g.rotate(a + HSH(i, 1)); rr(g, -18, -18, 36, 36, 3, heat > 0 ? `rgba(255,107,107,${.18 * heat})` : 'rgba(80,160,100,.55)', heat > 0 ? null : 'rgba(255,255,255,.25)', 1); if (heat <= 0) { g.beginPath(); g.ellipse(0, 0, 14, 7, .6, 0, 7); g.fillStyle = '#3FAE6A'; g.fill(); } g.restore(); }));
  al(g, pop(t, 4), () => txt(g, heat > .5 ? '红色越深：同一像素被画了越多次' : '每片叶子：一个方形面片 + 透明贴图', cx, R.y + 140, heat > .5 ? C.bad : C.fg2, fnt(700, 23), 'center'));
  const lx = R.x + 720; al(g, pop(t, 7.5), () => { txt(g, '自动生成的 LOD', lx, R.y + 200, C.fg, fnt(700, 26));
    [[6, 'LOD0'], [4, 'LOD1'], [2, 'LOD2']].forEach(([d, s], i) => { const L = []; treeDraw(g, lx + 60 + i * 170, R.y + 560, 80, -1.5708, d, 1, 0, L); L.forEach(([x, y]) => dot(g, x, y, 10 - i * 2, '#3FAE6A')); txt(g, s, lx + 60 + i * 170, R.y + 600, C.fg2, fnt(700, 20, 'mono'), 'center'); });
    rr(g, lx + 520 - 40, R.y + 380, 80, 180, 4, 'rgba(63,174,106,.3)', C.gold, 2); txt(g, '公告板', lx + 520, R.y + 600, C.gold, fnt(700, 20), 'center'); });
};
AN.wind = (g, t, R, st) => {
  hdr(g, R, '风：树干慢、树枝快、树叶最快');
  const cx = R.x + 380, by = R.y + 780, w = Math.sin(t * .9) * 1.2 + Math.sin(t * 2.3) * .3;
  const leaves = []; treeDraw(g, cx, by, 150, -1.5708 + w * .03, 6, 1, w, leaves);
  leaves.forEach(([x, y, a], i) => { const f = Math.sin(t * 7 + i) * .4; g.save(); g.translate(x, y); g.rotate(a + f); g.beginPath(); g.ellipse(0, 0, 14, 7, 0, 0, 7); g.fillStyle = '#3FAE6A'; g.fill(); g.restore(); });
  al(g, pop(t, 2), () => { dot(g, cx, by, 9, C.gold); txt(g, '树干：绕根部慢慢晃', cx + 20, by - 10, C.gold, fnt(700, 21)); const L = leaves[9] || leaves[0]; dot(g, L[0], L[1], 7, C.p); txt(g, '树叶：绕叶柄快速抖动', L[0] + 18, L[1] - 20, C.p, fnt(700, 21)); });
  const gx = R.x + 800; al(g, pop(t, 4), () => { txt(g, '草：越靠上摆得越多', gx, R.y + 200, C.fg, fnt(700, 26));
    for (let i = 0; i < 50; i++) { const x = gx + i * 10, h = 90 + HSH(i, 5) * 80, b = (Math.sin(t * 2 - x * .015) * .7 + .3) * h * .3; blade(g, x, R.y + 520, h, b, `hsl(${100 + HSH(i, 3) * 30},50%,42%)`); }
    txt(g, '模型里记录：每个部分绕哪个点转、离根部多远', gx, R.y + 600, C.fg2, fnt(600, 21)); });
};
AN.nfol = (g, t, R, st) => {
  hdr(g, R, '植被的新做法与密度控制');
  const cx = R.x + 360, cy = R.y + 740, rad = 340;
  for (let i = 0; i < 1600; i++) { const a = -1.5708 + (HSH(i, 1) - .5) * 2.2, d = Math.sqrt(HSH(i, 2)) * rad, keep = HSH(i, 3) < 1 - d / rad * 1.05; if (!keep) continue; const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * .9, s = 1.2 - d / rad * .7; blade(g, x, y, 22 * s, Math.sin(t * 2 + x * .03) * 4, `hsl(${105 + HSH(i, 4) * 30},45%,${30 + HSH(i, 5) * 18}%)`); }
  g.save(); g.setLineDash([8, 8]); g.strokeStyle = C.o; g.lineWidth = 2; g.beginPath(); g.ellipse(cx, cy, rad, rad * .9, 0, Math.PI, 2 * Math.PI); g.stroke(); g.restore(); txt(g, '超过这条线：不生成草', cx, cy - rad * .9 - 24, C.o, fnt(700, 22), 'center');
  person(g, cx, cy - 10, C.fg, 1); txt(g, '玩家', cx, cy + 30, C.fg2, fnt(600, 20), 'center');
  ['Nanite Foliage（5.7，实验）', '程序化植被编辑器（实验）', '草：按距离调整密度'].forEach((s, i) => chip(g, s, R.x + 760, R.y + 260 + i * 90, [C.g, C.b, C.o][i], pop(t, 1 + i * 1.2), 26));
};

// ---------- 03 全局光照 ----------
function room(g, R, ox, oy, s, gi, t) { const W = 360 * s, H = 260 * s; rr(g, ox, oy, W, H, 4, '#0A0F1C', C.line2, 2);
  g.fillStyle = '#B5444F'; g.fillRect(ox + W - 26 * s, oy, 26 * s, H); // 红墙
  const sun = [ox - 40, oy - 60]; line(g, [sun, [ox + W * .62, oy + H]], 'rgba(255,226,168,.9)', 4); g.fillStyle = 'rgba(255,226,168,.5)'; g.fillRect(ox + W * .45, oy + H - 8, W * .3, 8);
  if (gi) { const gr = g.createLinearGradient(ox + W, 0, ox, 0); gr.addColorStop(0, 'rgba(181,68,79,.45)'); gr.addColorStop(1, 'rgba(255,226,168,.05)'); g.fillStyle = gr; g.fillRect(ox, oy + H * .55, W - 26 * s, H * .45 - 8);
    for (let k = 0; k < 6; k++) { const ph = (t * .4 + k / 6) % 1, a = [ox + W * .62, oy + H], b = [ox + W - 26 * s, oy + H * (.3 + k * .08)], c = [ox + W * (.1 + k * .12), oy + H]; packet(g, [a, b, c], ph, k % 2 ? '#FF9AA6' : C.gold, 5); } } }
AN.bounce = (g, t, R, st) => {
  hdr(g, R, '全局光照：光会反弹');
  txt(g, '只算直射光', R.x + 20, R.y + 140, C.fg2, fnt(700, 26)); room(g, R, R.x + 40, R.y + 220, 1.5, false, t);
  al(g, pop(t, 2), () => { txt(g, '加上反弹：地面映出红色', R.x + 840, R.y + 140, C.gold, fnt(700, 26)); room(g, R, R.x + 860, R.y + 220, 1.5, true, t); });
};
AN.bake = (g, t, R, st) => {
  const D = st.D || 18, f = t / D;
  hdr(g, R, '烘焙：离线算好，存起来');
  const bx = R.x + 20, by = R.y + 160; txt(g, '离线烘焙', bx, by, C.fg2, fnt(700, 24)); rr(g, bx, by + 24, 600, 34, 17, 'rgba(255,255,255,.04)', C.line2, 2); rr(g, bx + 3, by + 27, 594 * CL(f / .3), 28, 14, 'rgba(255,210,122,.6)'); txt(g, '数小时（示意）', bx + 620, by + 41, C.fg3, fnt(600, 20));
  al(g, pop(f, .25, .05), () => { txt(g, '光照贴图', bx, by + 120, C.fg, fnt(700, 24)); for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { const v = 40 + 160 * Math.max(0, n2(i * .7 + 3, j * .7)); rr(g, bx + i * 64, by + 140 + j * 64, 60, 60, 3, `rgb(${v},${v * .9},${v * .7})`); } });
  al(g, pop(f, .35, .05), () => { txt(g, '光照探针（给动态物体用）', bx + 460, by + 120, C.fg, fnt(700, 24)); for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) dot(g, bx + 480 + i * 60, by + 170 + j * 60, 9, `hsl(${40 + i * 8},70%,${50 + j * 6}%)`); });
  const sx = R.x + 1150, sy = R.y + 560, ang = Math.PI * (1 - CL((f - .55) / .4));
  al(g, pop(f, .55, .05), () => { g.strokeStyle = C.line2; g.lineWidth = 2; g.beginPath(); g.arc(sx, sy, 230, Math.PI, 0); g.stroke(); const p = [sx + Math.cos(ang) * 230, sy - Math.sin(ang) * 230]; dot(g, p[0], p[1], 22, '#FFE2A8'); txt(g, '太阳在动：昼夜交替', sx, sy + 40, C.gold, fnt(700, 24), 'center'); txt(g, '烘焙结果很快就过时了', sx, sy + 80, C.bad, fnt(700, 24), 'center'); });
};
AN.ddgi = (g, t, R, st) => {
  hdr(g, R, '探针网格：每帧更新一部分');
  const x0 = R.x + 40, y0 = R.y + 160, nx = 12, ny = 6, sp = 92;
  rr(g, x0 + 260, y0 + 230, 220, 230, 6, 'rgba(163,174,195,.25)', C.fg2, 2); rr(g, x0 + 700, y0 + 330, 300, 130, 6, 'rgba(163,174,195,.25)', C.fg2, 2); line(g, [[x0 - 20, y0 + 470], [x0 + nx * sp, y0 + 470]], C.fg3, 3);
  const fr = Math.floor(t * 3);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const x = x0 + i * sp, y = y0 + j * sp * .8, upd = (i + j * nx + fr) % 9 === 0; const u = pop(t, .2 + (i + j) * .05);
    al(g, u, () => { if (upd && t > 2) for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283 + fr; line(g, [[x, y], [x + Math.cos(a) * 40, y + Math.sin(a) * 40]], 'rgba(255,210,122,.6)', 1.5); } dot(g, x, y, upd && t > 2 ? 10 : 7, upd && t > 2 ? C.gold : `hsl(${30 + j * 25},55%,${45 + i * 2}%)`); }); }
  al(g, pop(t, 4), () => { const ox = x0 + 600 + Math.sin(t * .5) * 120, oy = y0 + 240; dot(g, ox, oy, 18, C.b); [[Math.floor((ox - x0) / sp), 2], [Math.floor((ox - x0) / sp) + 1, 2], [Math.floor((ox - x0) / sp), 3], [Math.floor((ox - x0) / sp) + 1, 3]].forEach(([i, j]) => line(g, [[ox, oy], [x0 + i * sp, y0 + j * sp * .8]], C.b, 2, [5, 5])); txt(g, '物体：从最近的 8 个探针插值（图中画 4 个）', ox, oy - 40, C.b, fnt(700, 21), 'center'); });
};
const SDF2 = [[0, 380, 520, 120], [1, 900, 470, 80, 160], [0, 640, 300, 70], [1, 1150, 320, 120, 60]];
const sdf2 = (x, y) => Math.min(...SDF2.map(o => o[0] === 0 ? Math.hypot(x - o[1], y - o[2]) - o[3] : (() => { const dx = Math.abs(x - o[1]) - o[3], dy = Math.abs(y - o[2]) - o[4]; return Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0); })()));
AN.lumen = (g, t, R, st) => {
  hdr(g, R, 'Lumen：距离场追踪 + 表面缓存');
  const ox = R.x - 100, oy = R.y + 60;
  for (let lv = 1; lv <= 5; lv++) { const iso = lv * 34; for (let x = R.x + 20; x < R.x + 1280; x += 8) for (let y = R.y + 120; y < R.y + 800; y += 8) { const d = sdf2(x - ox, y - oy); if (Math.abs(d - iso) < 2.5) { g.fillStyle = `rgba(92,180,255,${.22 - lv * .03})`; g.fillRect(x, y, 3, 3); } } }
  SDF2.forEach(o => { if (o[0] === 0) { g.beginPath(); g.arc(o[1] + ox, o[2] + oy, o[3], 0, 7); g.fillStyle = 'rgba(163,174,195,.35)'; g.fill(); g.strokeStyle = C.fg2; g.lineWidth = 2; g.stroke(); } else rr(g, o[1] + ox - o[3], o[2] + oy - o[4], o[3] * 2, o[4] * 2, 4, 'rgba(163,174,195,.35)', C.fg2, 2); });
  const cam = [R.x + 40, R.y + 780], ang = -.18 + .02 * Math.sin(t * .3), rd = [Math.cos(ang), Math.sin(ang)]; dot(g, cam[0], cam[1], 12, C.fg);
  g.save(); g.beginPath(); g.rect(R.x, R.y + 100, 1300, R.h - 100); g.clip(); let tt = 0, steps = Math.floor(CL((t - 1) / 5) * 30); for (let i = 0; i < steps; i++) { const p = [cam[0] + rd[0] * tt, cam[1] + rd[1] * tt], d = sdf2(p[0] - ox, p[1] - oy);
    g.strokeStyle = 'rgba(255,210,122,.6)'; g.lineWidth = 1.5; g.beginPath(); g.arc(p[0], p[1], Math.max(2, d), 0, 7); g.stroke(); dot(g, p[0], p[1], 5, C.gold); if (d < 3) { al(g, pop(t, 6.5), () => { rr(g, p[0] - 30, p[1] - 70, 60, 40, 6, 'rgba(255,178,92,.6)', C.o, 2); txt(g, '表面缓存：读出这里的光照', p[0], p[1] - 92, C.o, fnt(700, 21), 'center'); }); break; } tt += d; }
  line(g, [cam, [cam[0] + rd[0] * tt, cam[1] + rd[1] * tt]], C.gold, 2); g.restore();
  al(g, pop(t, 2), () => txt(g, '蓝色等高线：离最近表面的距离', R.x + 900, R.y + 760, C.b, fnt(600, 21)));
};
AN.shadow = (g, t, R, st) => {
  const D = st.D || 18, f = t / D;
  hdr(g, R, f < .5 ? '级联阴影：近处精细，远处粗糙' : '虚拟阴影贴图：只渲染需要的页');
  const c = [R.x + 80, R.y + 500];
  if (f < .5) { const splits = [0, 140, 360, 800], cols = [C.g, C.o, C.p];
    for (let k = 2; k >= 0; k--) { al(g, pop(t, .4 + k * .5), () => { g.beginPath(); g.moveTo(c[0] + splits[k], c[1] - splits[k] * .38); g.lineTo(c[0] + splits[k + 1], c[1] - splits[k + 1] * .38); g.lineTo(c[0] + splits[k + 1], c[1] + splits[k + 1] * .38); g.lineTo(c[0] + splits[k], c[1] + splits[k] * .38); g.closePath(); g.fillStyle = cols[k] + '30'; g.fill(); g.strokeStyle = cols[k]; g.lineWidth = 2; g.stroke(); txt(g, ['第 1 段', '第 2 段', '第 3 段'][k], c[0] + (splits[k] + splits[k + 1]) / 2, c[1], C.fg, fnt(700, 22), 'center'); }); }
    dot(g, c[0], c[1], 12, C.fg);
    al(g, pop(t, 2.5), () => { [0, 1, 2].forEach(k => { const x = R.x + 980, y = R.y + 160 + k * 200, n = [16, 8, 4][k]; txt(g, `第 ${k + 1} 段：同样 2048²${k ? "，范围更大" : ""}`, x, y - 16, cols[k], fnt(700, 20)); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if ((i + j) % 2) g.fillStyle = cols[k] + '55', g.fillRect(x + i * 128 / n, y + j * 128 / n, 128 / n, 128 / n); rr(g, x, y, 128, 128, 2, null, cols[k], 2); }); });
    return; }
  const gx = R.x + 40, gy = R.y + 140, n = 20, cs = 34; const ft = t - D * .5; const need = (i, j) => { const dx = i - 4 - Math.sin(ft * .4) * 2, dy = j - 10; return Math.abs(Math.atan2(dy, dx)) < .5 && Math.hypot(dx, dy) < 15; };
  let k = 0; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const nd = need(i, j); if (nd) k++; rr(g, gx + i * cs, gy + j * cs, cs - 3, cs - 3, 3, nd ? 'rgba(95,211,154,.45)' : 'rgba(255,255,255,.03)', nd ? C.ok : C.line, 1); }
  txt(g, `一张 16384² 的阴影贴图，切成 ${n * n} 页（示意）`, R.x + 760, R.y + 200, C.fg, fnt(700, 24)); txt(g, `这一帧只渲染并缓存 ${k} 页`, R.x + 760, R.y + 250, C.ok, fnt(700, 24)); txt(g, '没变化的页下一帧直接复用', R.x + 760, R.y + 300, C.fg2, fnt(600, 22));
};
AN.gi_eng = (g, t, R, st) => {
  hdr(g, R, '全局光照的演进');
  events(g, t, R, [['早期', '光照贴图', '离线烘焙', C.fg3], ['', '探针', '给动态物体', C.fg3], ['2011', '体素', '锥追踪', C.p], ['2019', '探针 + 光追', 'DDGI', C.b], ['2022', 'Lumen', 'UE 5.0', C.g], ['2023', '路径追踪', '高端 PC', C.o], ['2024', 'MegaLights', '5.5 实验', C.gold], ['2026', 'Lumen Lite', '5.8', C.gold]], { gap: .6, y: 330, pad: 80 });
  al(g, pop(t, 6), () => { chip(g, 'Unity 6：自适应探针体积', R.x + 40, R.y + 680, C.g, 1, 24); chip(g, 'Godot：距离场 GI · 体素 GI', R.x + 520, R.y + 680, C.o, 1, 24); });
};

// ---------- 04 天空、云、水 ----------
AN.atmo = (g, t, R, st) => {
  hdr(g, R, '大气散射：天空为什么是蓝的');
  const cx = R.x + 330, cy = R.y + 980, re = 520, ra = 600; const el = .9 * Math.cos(t * .25); // 太阳高度
  g.save(); g.beginPath(); g.rect(R.x, R.y + 100, 700, R.h - 100); g.clip();
  g.beginPath(); g.arc(cx, cy, ra, Math.PI * 1.15, Math.PI * 1.85); g.strokeStyle = 'rgba(92,180,255,.35)'; g.lineWidth = 80; g.stroke(); g.beginPath(); g.arc(cx, cy, re, Math.PI * 1.1, Math.PI * 1.9); g.fillStyle = '#16213A'; g.fill(); g.strokeStyle = C.fg3; g.lineWidth = 2; g.stroke();
  const ob = [cx, cy - re]; person(g, ob[0], ob[1] - 18, C.fg, .8);
  const sa = -Math.PI / 2 + (1 - el) * 1.3, dir = [Math.cos(sa), Math.sin(sa)]; let L = 0; for (let s = 0; s < 400; s += 2) { const p = [ob[0] + dir[0] * s, ob[1] + dir[1] * s]; if (Math.hypot(p[0] - cx, p[1] - cy) > ra + 40) break; L = s; }
  line(g, [ob, [ob[0] + dir[0] * 420, ob[1] + dir[1] * 420]], 'rgba(255,226,168,.4)', 2, [6, 6]); line(g, [ob, [ob[0] + dir[0] * L, ob[1] + dir[1] * L]], C.gold, 4);
  g.restore(); txt(g, `光在大气里走过的路程：${L > 200 ? '很长（傍晚）' : '很短（正午）'}`, R.x + 20, R.y + 140, C.gold, fnt(700, 24));
  const sx = R.x + 760, sw = 520, sh = 520; const k = CL(1 - el), top = [LERP(70, 40, k), LERP(130, 60, k), LERP(230, 120, k)], hor = [LERP(170, 250, k), LERP(210, 120, k), LERP(240, 70, k)];
  const gr = g.createLinearGradient(0, R.y + 150, 0, R.y + 150 + sh); gr.addColorStop(0, `rgb(${top})`); gr.addColorStop(1, `rgb(${hor})`); g.fillStyle = gr; g.beginPath(); g.roundRect(sx, R.y + 150, sw, sh, 14); g.fill();
  const sunY = R.y + 150 + sh * (1 - CL(el * .9 + .1)); if (sunY < R.y + 150 + sh - 70) dot(g, sx + sw * .6, sunY, 26, '#FFF1D0'); g.fillStyle = '#0E1626'; g.fillRect(sx, R.y + 150 + sh - 70, sw, 70);
  txt(g, '瑞利散射：蓝光散得多 → 天空蓝', sx, R.y + 720, C.b, fnt(600, 21)); txt(g, '路程长：蓝光散光了 → 夕阳红', sx, R.y + 756, C.o, fnt(600, 21));
};
let CLD = { k: -1, c: null };
function cloudCanvas(tq, cov) { if (CLD.k === tq + cov) return CLD.c; const W = 260, H = 110, c = CLD.c || document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'), im = x.createImageData(W, H);
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) { const h = j / H, prof = SS(h / .25) * SS((1 - h) / .5), d = CL((fbm2(i * .025 + tq * .08, j * .05) + .5 - (1 - cov)) * 2.5) * prof, k = (j * W + i) * 4, b = 160 + 95 * (1 - h);
    im.data[k] = b; im.data[k + 1] = b; im.data[k + 2] = b + 10; im.data[k + 3] = d * 255; } x.putImageData(im, 0, 0); CLD = { k: tq + cov, c }; return c; }
AN.cloud = (g, t, R, st) => {
  hdr(g, R, '体积云：沿视线一步步累加');
  const gr = g.createLinearGradient(0, R.y + 120, 0, R.y + 560); gr.addColorStop(0, '#2B5C9A'); gr.addColorStop(1, '#8DB4DA'); g.fillStyle = gr; g.beginPath(); g.roundRect(R.x + 20, R.y + 120, 760, 440, 12); g.fill();
  const cov = .45 + .2 * Math.sin(t * .15); g.drawImage(cloudCanvas(Math.floor(t * 12) / 12 * 1, Math.round(cov * 20) / 20), R.x + 20, R.y + 200, 760, 300);
  txt(g, `云量 ${(cov * 100).toFixed(0)}%`, R.x + 40, R.y + 150, '#fff', fnt(700, 22, 'mono'));
  const px = R.x + 840, py = R.y + 160; txt(g, '剖面：视线穿过云层', px, py, C.fg2, fnt(700, 22));
  rr(g, px, py + 60, 420, 200, 8, 'rgba(255,255,255,.05)', C.line2, 1.5); txt(g, '云层', px + 430, py + 160, C.fg3, fnt(600, 20));
  const cam = [px - 10, py + 380]; dot(g, cam[0], cam[1], 10, C.fg); const end = [px + 420, py + 60]; line(g, [cam, end], C.gold, 2);
  let acc = 0; for (let i = 1; i <= 12; i++) { const u = i / 13, p = [LERP(cam[0], end[0], u), LERP(cam[1], end[1], u)]; if (p[1] > py + 260 || p[1] < py + 60) continue; const d = CL(fbm2(i * .7 + Math.floor(t), 2) + .5); const v = pop(t, 1 + i * .3);
    al(g, v, () => { dot(g, p[0], p[1], 6, C.gold); rr(g, p[0] - 8, py + 420 - d * 90, 16, d * 90, 3, 'rgba(255,255,255,.6)'); }); if (v > .5) acc += d; }
  txt(g, '每一步的云密度', px, py + 450, C.fg2, fnt(600, 20)); txt(g, `累积：${acc.toFixed(1)}`, px + 260, py + 450, C.gold, fnt(700, 22, 'mono'));
};
AN.ocean = (g, t, R, st) => {
  hdr(g, R, '海面：很多波浪的叠加');
  const x0 = R.x + 20, w = 600, W = [[40, .018, 1.1, C.b], [18, .045, 1.9, C.g], [8, .11, 3.2, C.o]];
  W.forEach(([A, k, s, col], i) => { const y = R.y + 160 + i * 110, u = pop(t, .3 + i * .5); al(g, u, () => { const P = []; for (let x = 0; x <= w; x += 4) P.push([x0 + x, y + A * Math.sin(x * k - t * s)]); line(g, P, col, 2.5); }); });
  al(g, pop(t, 2.2), () => { const y = R.y + 560, P = []; for (let x = 0; x <= w; x += 3) P.push([x0 + x, y + W.reduce((a, [A, k, s]) => a + A * Math.sin(x * k - t * s), 0)]); line(g, P, '#fff', 3); txt(g, '相加 = 海浪', x0, y + 90, C.fg, fnt(700, 24)); });
  al(g, pop(t, 4), () => { const ox = R.x + 700, oy = R.y + 140, n = 64, cs = 9; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { let h = 0; for (let k = 0; k < 14; k++) { const a = HSH(k, 1) * 6.28, f = .08 + HSH(k, 2) * .35, sp = Math.sqrt(f) * 2.2; h += Math.sin((i * Math.cos(a) + j * Math.sin(a)) * f - t * sp) / (1 + f * 6); } const v = CL(.5 + h * .35); g.fillStyle = `rgb(${20 + v * 90},${60 + v * 120},${110 + v * 120})`; g.fillRect(ox + i * cs, oy + j * cs, cs, cs); }
    txt(g, '几千个波：一次 FFT 算出整片（示意 14 个）', ox, oy + n * cs + 34, C.fg2, fnt(600, 21)); });
};
AN.tod = (g, t, R, st) => {
  hdr(g, R, '昼夜与天气');
  const x0 = R.x + 20, w = R.w - 40, y0 = R.y + 150, hrs = (t * 1.2) % 24;
  for (let h = 0; h < 24; h += .25) { const e = Math.sin((h - 6) / 12 * Math.PI), k = CL(e), r = LERP(20, 90, k) + (e > -.1 && e < .25 ? 120 : 0), gg = LERP(28, 150, k) + (e > -.1 && e < .25 ? 40 : 0), b = LERP(55, 230, k); g.fillStyle = `rgb(${r},${gg},${b})`; g.fillRect(x0 + h / 24 * w, y0, w / 96 + 1, 120); }
  line(g, [[x0 + hrs / 24 * w, y0 - 10], [x0 + hrs / 24 * w, y0 + 130]], '#fff', 3); [0, 6, 12, 18].forEach(h => txt(g, `${h}:00`, x0 + h / 24 * w, y0 + 150, C.fg3, fnt(600, 18, 'mono'), 'center'));
  const rain = (Math.floor(t / 6) % 2) === 1; const P = [['云量', rain ? .9 : .3], ['风速', rain ? .7 : .25], ['湿度', rain ? .95 : .35]];
  P.forEach(([s, v], i) => { const y = R.y + 400 + i * 70; txt(g, s, x0, y, C.fg2, fnt(700, 24)); rr(g, x0 + 90, y - 14, 380, 28, 14, 'rgba(255,255,255,.04)', C.line2, 1.5); rr(g, x0 + 92, y - 12, 376 * v, 24, 12, rain ? C.b : C.gold); });
  txt(g, rain ? '天气：下雨' : '天气：晴', x0 + 520, R.y + 400, rain ? C.b : C.gold, fnt(800, 28));
  const gx = R.x + 820, gy = R.y + 380; rr(g, gx, gy, 440, 260, 12, rain ? '#2A2F3A' : '#5A4A3A', C.line2, 2);
  if (rain) { for (let i = 0; i < 6; i++) { const x = gx + 60 + HSH(i, 1) * 320, y = gy + 60 + HSH(i, 2) * 150, r = ((t * 30 + i * 13) % 40); g.strokeStyle = `rgba(200,220,255,${1 - r / 40})`; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y, r, r * .4, 0, 0, 7); g.stroke(); } const gr = g.createLinearGradient(gx, gy, gx + 440, gy + 260); gr.addColorStop(0, 'rgba(255,255,255,.18)'); gr.addColorStop(.5, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(gx, gy, 440, 260); }
  txt(g, rain ? '湿地面：变暗、反光、涟漪' : '干地面', gx + 220, gy + 300, C.fg2, fnt(700, 22), 'center');
};
AN.sky_eng = (g, t, R, st) => {
  hdr(g, R, '三大引擎的天空、云与水');
  const D = [['虚幻引擎', ['天空大气', '体积云', '水体系统（插件）'], C.b], ['Unity（HDRP）', ['物理天空', '体积云', '水面系统'], C.g], ['Godot', ['物理天空材质', '体积雾', '云与海洋：社区实现'], C.o]];
  const w = (R.w - 40) / 3; D.forEach(([h, ls, col], i) => { const u = pop(t, .3 + i * .9); g.save(); g.translate(0, (1 - u) * 20); card(g, R.x + i * (w + 20), R.y + 140, w, 300, h, ls, col, u, false, 27); g.restore(); });
};

// ---------- 05 帧预算 ----------
AN.frame = (g, t, R, st) => {
  const dyn = st.bi === 4; hdr(g, R, dyn ? '动态分辨率：画面复杂时自动降分辨率' : '一帧的时间都花在哪里（示意）');
  if (dyn) { const x0 = R.x + 60, y0 = R.y + 160, w = R.w - 120, h = 220; txt(g, '场景复杂度', x0, y0 - 16, C.fg2, fnt(700, 22)); txt(g, '渲染分辨率', x0, y0 + h + 90, C.fg2, fnt(700, 22)); txt(g, '帧时间', x0, y0 + 2 * h + 190, C.fg2, fnt(700, 22));
    const cx = x => .5 + .35 * Math.sin(x * .012 + 1) + .15 * Math.sin(x * .05); const P1 = [], P2 = [], P3 = []; const n = Math.floor(w * CL(t / 6));
    for (let x = 0; x <= n; x += 4) { const c = cx(x); P1.push([x0 + x, y0 + h - c * h * .9]); P2.push([x0 + x, y0 + h + 110 + (c * .5) * h * .8]); P3.push([x0 + x, y0 + 2 * h + 230 + Math.sin(x * .3) * 4]); }
    if (P1.length > 1) { line(g, P1, C.r, 3); line(g, P2, C.b, 3); line(g, P3, C.ok, 3); } txt(g, '16.6 ms 保持平稳', x0 + w, y0 + 2 * h + 200, C.ok, fnt(700, 21), 'right'); return; }
  const x0 = R.x + 180, w = R.w - 220, ms = w / 20, y1 = R.y + 200, y2 = R.y + 400;
  const CPU = [['逻辑', 3, C.b], ['物理', 2.5, C.g], ['动画', 2.5, C.p], ['提交绘制', 4, C.o]], GPU = [['阴影', 2.5, C.fg3], ['地形', 2, C.o], ['植被', 3, C.g], ['光照', 4, C.gold], ['天空云', 1.5, C.b], ['后处理', 2, C.p]];
  txt(g, 'CPU', R.x + 20, y1 + 30, C.fg, fnt(800, 26)); txt(g, 'GPU', R.x + 20, y2 + 30, C.fg, fnt(800, 26));
  const bar = (L, y, off, frame, a) => { let x = x0 + off * ms; L.forEach(([s, d, col], i) => { const u = pop(t, .3 + i * .3 + (frame ? 2 : 0)); al(g, u * a, () => { rr(g, x, y, d * ms - 3, 60, 6, col + '44', col, 2); if (d * ms > 70) txt(g, s, x + d * ms / 2, y + 30, C.fg, fnt(700, 20), 'center'); }); x += d * ms; }); };
  g.save(); g.beginPath(); g.rect(R.x, R.y, R.w, R.h); g.clip(); bar(CPU, y1, 0, 0, 1); bar(GPU, y2, 4, 0, 1); bar(CPU, y1 + 80, 12, 1, .5); g.restore(); txt(g, '下一帧', x0 + 12 * ms, y1 + 158, C.fg3, fnt(600, 18));
  const lim = x0 + 16.6 * ms; line(g, [[lim, y1 - 40], [lim, y2 + 100]], C.bad, 3, [8, 6]); txt(g, '16.6 ms', lim, y1 - 56, C.bad, fnt(700, 22, 'mono'), 'center');
  for (let m = 0; m <= 20; m += 5) txt(g, m + ' ms', x0 + m * ms, y2 + 130, C.fg3, fnt(600, 18, 'mono'), 'center');
  if (st.k === 1) al(g, pop(st.tk, 2), () => { const gx = x0 + 19 * ms; rr(g, lim, y2 - 6, gx - lim, 72, 6, 'rgba(255,107,107,.25)', C.bad, 2); txt(g, 'GPU 超时 → 掉帧：找出最慢的一段', x0, y2 + 200, C.bad, fnt(700, 26)); });
};
AN.upscale = (g, t, R, st) => {
  hdr(g, R, '低分辨率渲染，再重建到高分辨率');
  const draw = (x, y, s, px) => { const c = document.createElement('canvas'); c.width = c.height = px; const q = c.getContext('2d'); q.fillStyle = '#0E2038'; q.fillRect(0, 0, px, px); q.fillStyle = '#FFD27A'; q.beginPath(); q.arc(px * .5, px * .45, px * .28, 0, 7); q.fill(); q.strokeStyle = '#5FE0A0'; q.lineWidth = px * .02; for (let k = 0; k < 6; k++) { q.beginPath(); q.moveTo(px * .1, px * (.7 + k * .04)); q.lineTo(px * .9, px * (.6 + k * .06)); q.stroke(); }
    g.imageSmoothingEnabled = px > 200; g.drawImage(c, x, y, s, s); g.imageSmoothingEnabled = true; };
  draw(R.x + 20, R.y + 150, 440, 40); txt(g, '内部渲染：低分辨率', R.x + 240, R.y + 630, C.fg2, fnt(700, 22), 'center');
  al(g, pop(t, 2), () => { for (let k = 0; k < 5; k++) { const y = R.y + 250 + k * 60; arrow(g, R.x + 520, y, R.x + 600 + Math.sin(t + k) * 10, y - 10, C.gold, 2, 8); } txt(g, '+ 前几帧 + 运动方向', R.x + 560, R.y + 600, C.gold, fnt(700, 21), 'center'); });
  al(g, pop(t, 3.5), () => { draw(R.x + 680, R.y + 150, 440, 440); txt(g, '输出：接近原生分辨率', R.x + 900, R.y + 630, C.fg2, fnt(700, 22), 'center'); });
};
AN.fgen = (g, t, R, st) => {
  hdr(g, R, '插帧：在两帧之间生成画面');
  const x0 = R.x + 40, y0 = R.y + 200, n = 8, w = (R.w - 80) / n;
  for (let i = 0; i < n; i++) { const real = i % 2 === 0, u = pop(t, .3 + i * .3); al(g, u, () => { rr(g, x0 + i * w + 6, y0, w - 12, 120, 10, real ? 'rgba(92,180,255,.25)' : 'rgba(255,210,122,.2)', real ? C.b : C.gold, 2); txt(g, real ? '渲染' : '生成', x0 + i * w + w / 2, y0 + 60, real ? C.b : C.gold, fnt(800, 26), 'center'); }); }
  al(g, pop(t, 3.5), () => { txt(g, '看起来：帧率翻倍（多帧生成可以更多）', x0, y0 + 190, C.fg, fnt(700, 26)); txt(g, '操作延迟：仍由真实渲染的帧决定', x0, y0 + 250, C.bad, fnt(700, 26)); txt(g, '适合：60 → 120 以上；不适合：30 → 60', x0, y0 + 310, C.fg2, fnt(600, 24)); });
};

// ---------- 06 昙花一现 / 07 对照 / 08 角色 ----------
AN.graves2 = (g, t, R, st) => {
  lifespans(g, t, R, st, [['光照传播体积', 2009, 2022, 'UE5 移除', 0], ['UE4 体素 GI', 2012, 2014, '正式版前移除', 1], ['GPU 物理粒子', 2008, 2025, '新显卡一度不支持', 2]], '昙花一现', '条形为大致的流行时段（示意）', 2006, 2027, [2010, 2015, 2020, 2025]);
};
AN.table2 = (g, t, R, st) => engTable(g, t, R, st, '三大引擎对照：画得出', ['地形', '植被', '全局光照', '天空与云', '水', '超分辨率'],
  [[['Landscape · RVT', 2], ['Terrain', 2], ['Terrain3D（插件）', 1]], [['Foliage · Nanite Foliage', 2], ['Terrain 细节 · SpeedTree', 2], ['MultiMesh（自己摆）', 1]],
   [['Lumen · MegaLights', 2], ['APV · SSGI（HDRP）', 1], ['SDFGI · VoxelGI', 1]], [['Sky Atmosphere · 体积云', 2], ['HDRP 物理天空 · 体积云', 2], ['物理天空 · 云靠插件', 1]],
   [['Water（插件）', 1], ['HDRP Water System', 2], ['社区实现', 0]], [['TSR', 2], ['STP', 2], ['FSR 2.2', 2]]], '选哪个，取决于画面目标和硬件目标');
AN.roles2 = (g, t, R, st) => {
  if (st.k <= 1) { hdr(g, R, '谁来做这些事');
    const D = [['渲染程序', ['负责：地形 · 植被 · 光照 · 天空', '技能：图形学 · 着色器 · 数学', '能读论文，落地到主机'], C.b, 0], ['技术美术（TA）', ['负责：材质 · 着色器 · 风动画', '写工具，提高美术效率', '守住性能预算'], C.g, 1], ['性能优化', ['负责：找瓶颈、定预算', '技能：显卡架构 · 分析工具', '熟悉各平台特点'], C.o, 1]];
    const w = (R.w - 60) / 3; D.forEach(([h, ls, col, kk], i) => { if (st.k < kk) return; const u = pop(st.k === kk ? (kk ? st.tk : t) : 99, .3 + (kk ? (i - 1) * 2.5 : 0)); g.save(); g.translate(0, (1 - u) * 20); card(g, R.x + i * (w + 30), R.y + 130, w, 330, h, ls, col, u, st.k === kk, 27); g.restore(); });
    al(g, pop(t, 2), () => { const tools = ['RenderDoc', 'PIX', 'Nsight', 'Houdini', 'Substance', 'SpeedTree']; let x = R.x; txt(g, '常用工具', x, R.y + 560, C.fg3, fnt(700, 26)); x += 140; tools.forEach((s, i) => { x += chip(g, s, x, R.y + 560, C.p, pop(t, 2.3 + i * .2), 24) + 16; }); });
    return; }
  hdr(g, R, '入门练习与下一集');
  ['用高度图生成一块地形', '写一个实例化的草地', '写一个光线步进的体积云'].forEach((s, i) => check(g, R.x + 40, R.y + 180 + i * 100, s, pop(st.tk, .5 + i * 1.5), C.ok, 32));
  al(g, pop(st.tk, 6), () => { rr(g, R.x + 900, R.y + 150, 760, 360, 22, 'rgba(14,20,36,.92)', C.o, 3); txt(g, '第三集', R.x + 1280, R.y + 210, C.o, fnt(700, 30), 'center'); txt(g, '造得出', R.x + 1280, R.y + 310, C.fg, fnt(800, 80, 'serif'), 'center'); txt(g, '地形生成 · 程序化 · 扫描 · 工具与协作', R.x + 1280, R.y + 420, C.fg2, fnt(600, 28), 'center'); });
};
