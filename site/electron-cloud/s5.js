// 番外 · 为什么是这些形状
const C_POS = new THREE.Color(POS), C_NEG = new THREE.Color(NEG), C_GRID = 0x41507a;
// 氢原子精确径向函数（a₀ 为单位）
function lagN(k, a, x) { if (k === 0) return 1; let L0 = 1, L1 = 1 + a - x; for (let i = 1; i < k; i++) { const L2 = ((2 * i + 1 + a - x) * L1 - (i + a) * L0) / (i + 1); L0 = L1; L1 = L2; } return L1; }
const RH = (n, l) => r => { const rho = 2 * r / n; return Math.pow(rho, l) * Math.exp(-rho / 2) * lagN(n - l - 1, 2 * l + 1, rho); };
const J = (m, x) => { let s = 0, f = 1, g = 1; for (let i = 1; i <= m; i++) g *= i; for (let k = 0; k < 40; k++) { if (k) { f *= k; g *= (k + m); } s += (k % 2 ? -1 : 1) * Math.pow(x / 2, 2 * k + m) / (f * g); } return s; };
const BZ = { 0: [2.4048, 5.5201, 8.6537], 1: [3.8317, 7.0156, 10.1735], 2: [5.1356, 8.4172, 11.6198] };
const lit = (v) => { v.sc.add(new THREE.AmbientLight(0xffffff, .5)); const L = new THREE.DirectionalLight(0xffffff, .75); L.position.set(2, 4, 3); v.sc.add(L); const L2 = new THREE.DirectionalLight(0x8899ff, .25); L2.position.set(-3, -1, 2); v.sc.add(L2); };
const signCol = (arr, i, v, k = 3) => { const c = v >= 0 ? C_POS : C_NEG, a = .28 + .72 * Math.min(1, Math.abs(v) * k); arr[i * 3] = c.r * a; arr[i * 3 + 1] = c.g * a; arr[i * 3 + 2] = c.b * a; };
// 网格曲面：u,v ∈ [0,1]，pos(u,v) → [x,y,z]，val(u,v) → 着色值；update 重新计算
function surface(parent, N, M, fn, o = {}) {
  const g = new THREE.BufferGeometry(), P = new Float32Array((N + 1) * (M + 1) * 3), C = new Float32Array((N + 1) * (M + 1) * 3), I = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) { const a = i * (M + 1) + j, b = a + M + 1; I.push(a, b, a + 1, b, b + 1, a + 1); }
  g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('color', new THREE.BufferAttribute(C, 3)); g.setIndex(I);
  const m = new THREE.Mesh(g, o.mat || new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: !!o.opacity, opacity: o.opacity ?? 1 })); parent.add(m);
  const upd = (...args) => { let k = 0; for (let i = 0; i <= N; i++) for (let j = 0; j <= M; j++, k++) { const r = fn(i / N, j / M, ...args); P[k * 3] = r[0]; P[k * 3 + 1] = r[1]; P[k * 3 + 2] = r[2]; signCol(C, k, r[3], o.ck || 3); }
    g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true; g.computeVertexNormals(); };
  return { m, upd };
}
// 振动的球面：f 为球面花纹（单位向量 → 值），amp(t) 振幅，morph = 0 球面振动 → 1 鼓成波瓣
function vibSphere(parent, f, o = {}) {
  const sg = new THREE.SphereGeometry(1, o.seg || 96, o.seg2 || 64), U = sg.attributes.position.array.slice(), n = U.length / 3;
  let mx = 0; const F = new Float32Array(n); for (let i = 0; i < n; i++) { const x = U[i * 3], y = U[i * 3 + 1], z = U[i * 3 + 2]; F[i] = f(x, z, y); mx = Math.max(mx, Math.abs(F[i])); } for (let i = 0; i < n; i++) F[i] /= mx || 1;
  const C = new Float32Array(n * 3); sg.setAttribute('color', new THREE.BufferAttribute(C, 3));
  const m = new THREE.Mesh(sg, new THREE.MeshLambertMaterial({ vertexColors: true })); parent.add(m);
  const upd = (a, morph = 0) => { const P = sg.attributes.position.array;
    for (let i = 0; i < n; i++) { const v = F[i], s = (1 - morph) * (1 + (o.eps ?? .3) * v * a) + morph * (Math.abs(v) * 1.15 + .02); P[i * 3] = U[i * 3] * s; P[i * 3 + 1] = U[i * 3 + 1] * s; P[i * 3 + 2] = U[i * 3 + 2] * s; signCol(C, i, morph > .5 ? v : v * a, 2.2); }
    sg.attributes.position.needsUpdate = true; sg.attributes.color.needsUpdate = true; sg.computeVertexNormals(); };
  upd(1); return { m, upd };
}
const angF = (l, idx) => EC.orbitals({ n: l + 1, l, key: (l + 1) + 'spdf'[l], e: 2 * (2 * l + 1) })[idx].f;
const ANGLAB = { 1: ['x', 'y', 'z'], 2: ['z²', 'xz', 'yz', 'x²−y²', 'xy'], 3: ['z³', 'xz²', 'yz²', 'z(x²−y²)', 'xyz', 'x(x²−3y²)', 'y(3x²−y²)'] };
// 多视口：一块 canvas 里放多个小场景
function multi(c, x, y, w, h, cells, o = {}) {
  const el = c.el(`<canvas class="gl" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:2"></canvas>`);
  const r = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setPixelRatio(1); r.setSize(w, h, false); r.setScissorTest(true);
  c.cleanup.push(() => { r.dispose(); r.forceContextLoss(); });
  const cols = o.cols || cells.length, rows = Math.ceil(cells.length / cols), cw = w / cols, ch = h / rows;
  const V = cells.map((cl, k) => { const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(o.fov || 30, cw / ch, .01, 500), grp = new THREE.Group(); sc.add(grp); lit({ sc });
    const D = (cl.D || o.D || 6) / Math.min(1, cw / ch); cam.position.set(0, D * (o.elev ?? .3), D); cam.lookAt(0, 0, 0); const v = { sc, cam, grp, k, col: k % cols, row: Math.floor(k / cols) }; cl.init && cl.init(v); return { ...v, cl }; });
  c.tick(t => { r.setScissor(0, 0, w, h); r.clear(); V.forEach(v => { if (v.cl.upd) v.cl.upd(t, v); const xx = v.col * cw, yy = h - (v.row + 1) * ch; r.setViewport(xx, yy, cw, ch); r.setScissor(xx, yy, cw, ch); r.render(v.sc, v.cam); }); });
  cells.forEach((cl, k) => { if (cl.lab) show(c, `<div class="vlab" style="left:${x + (k % cols) * cw}px;top:${y + (Math.floor(k / cols) + 1) * ch + (o.labDy ?? -34)}px;width:${cw}px">${cl.lab}</div>`, o.at ?? 0, o.until, { dy: 0 }); });
  if (o.at != null) c.in(el, o.at, { dy: 0, d: .6 }); if (o.until != null) c.out(el, o.until, { d: .4 });
  return { el, V };
}
const sym = (x, y, t, at, until, size = 72) => `<div class="abs" style="left:${x}px;top:${y}px;font:300 ${size}px var(--sans);color:var(--fg2);z-index:5">${t}</div>`;

// ---------------- 场景 ----------------
S('e_open', c => {
  const { b, be } = c;
  multi(c, 80, 170, 1760, 560, [0, 1, 2, 3, 4].map(i => ({ lab: `3d<sub>${ANGLAB[2][i]}</sub>`, init: v => { v.s = vibSphere(v.grp, angF(2, i)); v.s.upd(0, 1); }, upd: (t, v) => v.grp.rotation.set(.3, .5 + t * .3, 0) })), { at: .2, until: be(0) + .2, D: 5.2 });
  show(c, at(80, 800, 1760, `<div class="bigq" style="font-size:48px">为什么是这些形状？为什么 d 有 5 个、f 有 7 个？</div>`), b(0) + 3, be(0) + .2);
  const steps = ['电子是波', '被关住', '只有首尾相接的花纹能留下', '数节点', '得到形状和能量'];
  show(c, at(100, 230, 1720, `<div style="font:800 64px var(--serif);text-align:center">不背形状，把它推出来</div>`), b(1) + .2, null);
  steps.forEach((s2, i) => show(c, `<div class="abs" style="left:${140 + i * 340}px;top:470px;width:300px;text-align:center"><div style="font:700 30px var(--serif);padding:22px 10px;border:1px solid var(--line2);border-radius:16px;background:rgba(14,20,36,.85)">${s2}</div>${i < 4 ? '<div style="position:absolute;right:-34px;top:26px;font-size:40px;color:var(--gold)">→</div>' : ''}</div>`, b(1) + 1.5 + i * 1.6, null));
});
S('e_slit', c => {
  const { b, be } = c; c.head('01', '先看证据：电子会干涉');
  const v = glv(c, 60, 170, 1300, 780, { at: .2 }); lit(v); v.look(11.5, .32, [0, -.2, 0]); v.grp.rotation.set(0, .62, 0);
  // 源、双缝、屏
  const src = new THREE.Mesh(new THREE.CylinderGeometry(.25, .35, .9, 24), new THREE.MeshLambertMaterial({ color: 0x5a6a8a })); src.rotation.z = Math.PI / 2; src.position.set(-5, 0, 0); v.grp.add(src);
  const wallM = new THREE.MeshLambertMaterial({ color: 0x8a96b0 }), d = .5, sw = .12;
  [[-3, (d - sw) / 2 - 1.5], [0, d - sw], [3, (d - sw) / 2 - 1.5]].forEach(([k]) => 0);
  const seg = (z0, z1) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.08, 2.4, z1 - z0), wallM); m.position.set(-1.5, 0, (z0 + z1) / 2); v.grp.add(m); };
  seg(-3, -d / 2 - sw / 2); seg(-d / 2 + sw / 2, d / 2 - sw / 2); seg(d / 2 + sw / 2, 3);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(6, 2.4), new THREE.MeshLambertMaterial({ color: 0x141b2c, side: THREE.DoubleSide })); scr.rotation.y = Math.PI / 2; scr.position.x = 3.5; v.grp.add(scr);
  // 命中点：按双缝强度分布抽样
  const L = 5, lam = .16, I = z => { const ph = Math.PI * d * z / (lam * Math.hypot(L, z)), be2 = Math.PI * sw * z / (lam * Math.hypot(L, z)) * 3; const sinc = be2 ? Math.sin(be2) / be2 : 1; return Math.cos(ph) ** 2 * sinc ** 2; };
  const rnd = MOL.rng(5), NH = 9000, H = new Float32Array(NH * 3); let k = 0;
  while (k < NH) { const z = (rnd() * 2 - 1) * 2.9; if (rnd() < I(z)) { H[k * 3] = 3.48; H[k * 3 + 1] = (rnd() * 2 - 1) * 1.05; H[k * 3 + 2] = z; k++; } }
  const hg = new THREE.BufferGeometry(); hg.setAttribute('position', new THREE.BufferAttribute(H, 3)); hg.setAttribute('color', new THREE.BufferAttribute(new Float32Array(NH * 3).fill(1).map((x, i) => [.6, .82, 1][i % 3]), 3));
  const hits = new THREE.Points(hg, ptsMat(1)); v.grp.add(hits); hits.n = NH;
  const t0 = b(0) + 3, t1 = F(c, 0, .55), t2 = be(0) + 4;
  const cnt = t => t < t0 ? 0 : t < t1 ? Math.floor(1 + 14 * (t - t0) / (t1 - t0)) : t < t2 ? Math.round(15 * Math.pow(NH / 15, (t - t1) / (t2 - t1))) : NH;
  // 飞行中的电子
  const fg = new THREE.BufferGeometry(), FP = new Float32Array(6 * 3); fg.setAttribute('position', new THREE.BufferAttribute(FP, 3)); fg.setAttribute('color', new THREE.BufferAttribute(new Float32Array(18).fill(1).map((x, i) => [1, .85, .5][i % 3]), 3));
  const fly = new THREE.Points(fg, ptsMat(1, 3)); v.grp.add(fly);
  // 波：在地面上画干涉图样
  const S2 = 256, cv = document.createElement('canvas'); cv.width = S2 * 2; cv.height = S2; const g2 = cv.getContext('2d'), tex = new THREE.CanvasTexture(cv);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(5, 6), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide })); floor.rotation.x = -Math.PI / 2; floor.rotation.z = -Math.PI / 2; floor.position.set(1, -1.25, 0); v.grp.add(floor);
  const im = g2.createImageData(S2 * 2, S2);
  v.upd.push(t => {
    const n = cnt(t); hits.geometry.setDrawRange(0, n); hits.material.uniforms.uSize.value = v.psize(n < 300 ? 12 : 6); hits.material.uniforms.uA.value = n < 300 ? 3.5 : 2;
    fly.visible = t > t0 - 1 && t < t2; fly.material.uniforms.uSize.value = v.psize(12);
    for (let i = 0; i < 6; i++) { const ph = ((t * .8 + i / 6) % 1), j = (Math.floor(t * .8 + i / 6) * 7 + i * 13) % NH; const zt = H[j * 3 + 2], slit = (j % 2 ? 1 : -1) * d / 2;
      const x = -4.5 + ph * 8, z = x < -1.5 ? 0 + (slit) * ((x + 4.5) / 3) : slit + (zt - slit) * ((x + 1.5) / 5); FP[i * 3] = x; FP[i * 3 + 1] = 0; FP[i * 3 + 2] = z; }
    fg.attributes.position.needsUpdate = true;
    const wa = SS(t, b(1) + 3, b(1) + 5); floor.visible = wa > 0;
    if (wa > 0 && (Math.floor(t * 12) !== v._wf)) { v._wf = Math.floor(t * 12);
      for (let j = 0; j < S2; j++) for (let i = 0; i < S2 * 2; i++) { const X = i / (S2 * 2) * 5, Z = (j / S2 * 2 - 1) * 3, r1 = Math.hypot(X, Z - d / 2), r2 = Math.hypot(X, Z + d / 2), kk = 2 * Math.PI / lam * .55;
        const re = Math.cos(kk * r1 - t * 6) / Math.sqrt(r1 + .3) + Math.cos(kk * r2 - t * 6) / Math.sqrt(r2 + .3), a = Math.max(0, Math.min(1, Math.abs(re) * .45)) * wa, q = (j * S2 * 2 + i) * 4, col = re >= 0 ? [255, 178, 92] : [79, 163, 255];
        im.data[q] = col[0]; im.data[q + 1] = col[1]; im.data[q + 2] = col[2]; im.data[q + 3] = a * 200; }
      g2.putImageData(im, 0, 0); tex.needsUpdate = true; }
  });
  const ctr = show(c, at(1400, 240, 420, `<div class="k" style="font:600 18px var(--sans);letter-spacing:.12em;color:var(--fg3)">打到屏上的电子</div><div style="font:700 72px var(--mono);color:var(--gold)">0</div>`), t0 - .5, null).lastElementChild;
  c.tick(t => { const s2 = cnt(t).toLocaleString('en'); if (ctr._s !== s2) { ctr._s = s2; ctr.textContent = s2; } });
  canvasLayer(c, 1400, 420, 420, 300, (g, t) => { const n = cnt(t), B = 60, hst = new Float32Array(B); for (let i = 0; i < n; i++) { const q = Math.floor((H[i * 3 + 2] + 2.9) / 5.8 * B); if (q >= 0 && q < B) hst[q]++; }
    const mx = Math.max(1, ...hst); for (let q = 0; q < B; q++) { const hh = hst[q] / mx * 240; g.fillStyle = '#5CB4FF'; g.fillRect(q * 7, 270 - hh, 6, hh); } tag(g, 210, 290, '屏上各处的点数', { size: 18, col: '#66728C' }); }, { at: t0 });
  show(c, card(1400, 760, 420, `<div class="p" style="font-size:22px">每个电子是一个点，<br>点落在哪里，<b>服从波的规律</b>。</div>`), b(1) + 2, null);
  show(c, `<div class="cap abs" style="left:80px;top:930px;width:1240px">示意：缝宽、缝距与波长不按比例；实验见 Tonomura 等，Am. J. Phys. 57, 117（1989）</div>`, b(1), null, { dy: 0 });
});
S('e_string', c => {
  const { b, be } = c; c.head('02', '关在一维里：琴弦');
  // 第一拍：反射叠加成驻波
  canvasLayer(c, 100, 200, 1720, 700, (g, t) => {
    const X0 = 140, W = 1440, mode = 3, k = mode * Math.PI / W, w = 3;
    const row = (y0, f, col, lw = 4, dash) => { g.strokeStyle = col; g.lineWidth = lw; g.setLineDash(dash || []); g.beginPath(); for (let i = 0; i <= 300; i++) { const x = i / 300 * W, yy = y0 - f(x) * 70; i ? g.lineTo(X0 + x, yy) : g.moveTo(X0 + x, yy); } g.stroke(); g.setLineDash([]); };
    [150, 470].forEach(y0 => { g.fillStyle = '#A3AEC3'; g.fillRect(X0 - 14, y0 - 90, 10, 180); g.fillRect(X0 + W + 4, y0 - 90, 10, 180); });
    row(150, x => Math.sin(k * x - w * t), '#FFB25C', 3, [10, 8]); row(150, x => -Math.sin(-k * x - w * t), '#4FA3FF', 3, [10, 8]);
    tag(g, X0, 40, '向右跑的波（金）与反射回来的波（蓝）', { size: 26, col: '#A3AEC3', align: 'left' });
    row(470, x => 2 * Math.sin(k * x) * Math.cos(w * t) * .8, '#E9EEF7', 5);
    for (let q = 1; q < mode; q++) { g.fillStyle = '#FFD27A'; g.beginPath(); g.arc(X0 + W * q / mode, 470, 11, 0, 7); g.fill(); }
    tag(g, X0, 360, '叠加：驻波。黄点是节点，永远不动', { size: 26, col: '#A3AEC3', align: 'left' });
  }, { at: .3, until: be(0) + .2 });
  // 第二、三拍：盒子里的电子 —— 3D 的盒子，波在里面
  const v = glv(c, 60, 180, 1200, 760, { at: b(1) + .1 }); lit(v); v.look(12, .32, [0, 1.2, 0]); v.grp.rotation.set(0, -.35, 0);
  const box = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(8, 5.6, 1.2)), new THREE.LineBasicMaterial({ color: 0x7f8db0 })); box.position.y = 1.4; v.grp.add(box);
  const lines = [1, 2, 3, 4].map(n => { const y = -1.2 + (n - 1) * 1.35, o = { n, y, a: 0, t: 0 };
    o.s = surface(v.grp, 1, 200, (u, w) => { const val = Math.sin(n * Math.PI * w) * Math.cos(n * n * .55 * o.t); return [-4 + 8 * w, y + .5 * val * o.a + (u - .5) * .05, (u - .5) * .35, val * o.a]; }, { ck: 4 });
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(.015, .015, 8, 6), new THREE.MeshBasicMaterial({ color: 0x2c3854 })); tube.rotation.z = Math.PI / 2; tube.position.y = y; v.grp.add(tube); return o; });
  const nodes = new THREE.Group(); v.grp.add(nodes);
  lines.forEach(L2 => { for (let q = 1; q < L2.n; q++) { const s2 = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffd27a })); s2.position.set(-4 + 8 * q / L2.n, L2.y, 0); nodes.add(s2); } });
  v.upd.push(t => { lines.forEach(L2 => { L2.a = SS(t, b(1) + .5 + (L2.n - 1) * 1.6, b(1) + 1.5 + (L2.n - 1) * 1.6); L2.t = t; L2.s.m.visible = L2.a > 0; if (L2.a > 0) L2.s.upd(); });
    v.grp.rotation.y = -.35 + Math.sin(t / 5) * .12; });
  // 能级梯子
  canvasLayer(c, 1300, 200, 540, 720, (g, t) => {
    tag(g, 20, 20, '能量（∝ 节点数 + 1 的平方）', { size: 22, col: '#A3AEC3', align: 'left' });
    const hi = Math.min(4, 1 + Math.floor(SS(t, b(2) + .5, F(c, 2, .8)) * 4));
    for (let n = 1; n <= 4; n++) { const y = 660 - n * n * 38, a = SS(t, b(1) + .5 + (n - 1) * 1.6, b(1) + 1.5 + (n - 1) * 1.6); g.globalAlpha = a; g.strokeStyle = n <= hi && t > b(2) ? '#FFD27A' : '#5CB4FF'; g.lineWidth = 5; g.beginPath(); g.moveTo(60, y); g.lineTo(300, y); g.stroke();
      tag(g, 320, y, `${n - 1} 个节点`, { size: 24, col: '#E9EEF7', align: 'left' }); g.globalAlpha = 1; }
    if (t > b(2)) { const k2 = SS(t, b(2) + .5, F(c, 2, .8)); g.strokeStyle = '#FFD27A'; g.lineWidth = 3; arrow(g, 30, 640, 30, 640 - k2 * 560, '#FFD27A', 4, 16); tag(g, 46, 330, '弯得越厉害，能量越高', { size: 22, col: '#FFD27A', align: 'left' }); }
  }, { at: b(1) + .3 });
  show(c, `<div class="cap abs" style="left:80px;top:940px;width:1180px">盒子里的电子：波在两壁必须为零，只能装下 1、2、3、4…… 个半波长</div>`, b(1) + 1, null, { dy: 0 });
});
S('e_ring', c => {
  const { b, be } = c; c.head('03', '绕一圈：必须首尾相接');
  const v = glv(c, 60, 170, 1300, 800, { at: .2, until: be(0) + .2 }); lit(v); v.look(9, .55);
  const R = 2.4, NP = 6, ring = new THREE.Mesh(new THREE.TorusGeometry(R, .025, 8, 160), new THREE.MeshBasicMaterial({ color: 0x41507a })); ring.rotation.x = Math.PI / 2; v.grp.add(ring);
  const passes = Array.from({ length: NP }, (_, p) => { const g = new THREE.BufferGeometry(), P = new Float32Array(361 * 3); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); const L2 = new THREE.Line(g, new THREE.LineBasicMaterial({ color: 0xff8f6b, transparent: true, opacity: .55 })); v.grp.add(L2); return { g, P, L2 }; });
  const sg = new THREE.BufferGeometry(), SP = new Float32Array(361 * 3), SC = new Float32Array(361 * 3); sg.setAttribute('position', new THREE.BufferAttribute(SP, 3)); sg.setAttribute('color', new THREE.BufferAttribute(SC, 3)); const sum = new THREE.Line(sg, new THREE.LineBasicMaterial({ vertexColors: true })); v.grp.add(sum);
  // k(t)：先 3，再慢慢变成 3.4，再回到 3
  const kOf = t => t < F(c, 0, .35) ? 3 : t < F(c, 0, .65) ? 3 + .4 * SS(t, F(c, 0, .35), F(c, 0, .5)) : 3.4 - .4 * SS(t, F(c, 0, .78), be(0));
  let amp = 1;
  v.upd.push(t => { const k = kOf(t), sumv = new Float32Array(361), np = t < F(c, 0, .2) ? 1 : NP;
    passes.forEach((ps, p) => { ps.L2.visible = p < np && t < be(0) + .2; for (let i = 0; i <= 360; i++) { const th = i / 360 * 2 * Math.PI, val = Math.cos(k * (th + 2 * Math.PI * p) - t * 2); if (p < np) sumv[i] += val / np; ps.P[i * 3] = R * Math.cos(th); ps.P[i * 3 + 1] = .6 * val; ps.P[i * 3 + 2] = R * Math.sin(th); } ps.g.attributes.position.needsUpdate = true; });
    amp = Math.max(...sumv.map(Math.abs)); sum.visible = t < be(0) + .2;
    for (let i = 0; i <= 360; i++) { const th = i / 360 * 2 * Math.PI; SP[i * 3] = R * Math.cos(th) * 1.0; SP[i * 3 + 1] = 1.2 * sumv[i] - 0; SP[i * 3 + 2] = R * Math.sin(th); signCol(SC, i, sumv[i], 3); }
    sg.attributes.position.needsUpdate = true; sg.attributes.color.needsUpdate = true; v.grp.rotation.y = t * .12; });
  const kt = show(c, at(1400, 230, 440, `<div class="k" style="font:600 18px var(--sans);letter-spacing:.1em;color:var(--fg3)">一圈放几个波长</div><div style="font:700 80px var(--mono);color:var(--gold)">3.00</div><div class="p" style="font-size:22px;margin-top:6px"></div>`), .5, be(0) + .2);
  c.tick(t => { const k = kOf(t), s2 = k.toFixed(2), ok = Math.abs(k - Math.round(k)) < .02, el = kt.children[1], ps = kt.children[2]; if (el.textContent !== s2) el.textContent = s2; const tx = ok ? '每转一圈都和自己对齐：留下来' : `每圈错开一点：转 6 圈后只剩 ${Math.round(amp * 100)}%`; if (ps.textContent !== tx) { ps.textContent = tx; ps.style.color = ok ? 'var(--ok)' : 'var(--bad)'; } });
  show(c, `<div class="cap abs" style="left:80px;top:930px;width:1240px">细线：波绕的每一圈　粗线：叠加的结果（金 = 正，蓝 = 负）</div>`, 1, be(0) + .2, { dy: 0 });
  // 第二拍：1、2、3 个波长
  multi(c, 60, 230, 1800, 560, [1, 2, 3].map(k => ({ lab: `一圈 ${k} 个波长`, init: v2 => { const g = new THREE.BufferGeometry(), P = new Float32Array(361 * 3), Cc = new Float32Array(361 * 3); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('color', new THREE.BufferAttribute(Cc, 3)); v2.L = { g, P, Cc }; v2.grp.add(new THREE.Line(g, new THREE.LineBasicMaterial({ vertexColors: true })));
    const rr = new THREE.Mesh(new THREE.TorusGeometry(2, .02, 8, 120), new THREE.MeshBasicMaterial({ color: 0x41507a })); rr.rotation.x = Math.PI / 2; v2.grp.add(rr); for (let q = 0; q < 2 * k; q++) { const th = (q + .5) / (2 * k) * 2 * Math.PI, s2 = new THREE.Mesh(new THREE.SphereGeometry(.08, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffd27a })); s2.position.set(2 * Math.cos(th), 0, 2 * Math.sin(th)); v2.grp.add(s2); } },
    upd: (t, v2) => { for (let i = 0; i <= 360; i++) { const th = i / 360 * 2 * Math.PI, val = Math.cos(k * th) * Math.cos(t * (1 + k * .6)); v2.L.P[i * 3] = 2 * Math.cos(th); v2.L.P[i * 3 + 1] = .7 * val; v2.L.P[i * 3 + 2] = 2 * Math.sin(th); signCol(v2.L.Cc, i, val, 4); } v2.L.g.attributes.position.needsUpdate = true; v2.L.g.attributes.color.needsUpdate = true; v2.grp.rotation.y = t * .1; } })), { at: b(1) + .2, D: 10, elev: .55 });
  show(c, `<div class="cap abs" style="left:60px;top:860px;width:1800px;text-align:center">只有整数个波长能留下来：一串分立的状态，这就是量子化　·　黄点是节点</div>`, b(1) + 2, null, { dy: 0 });
});
S('e_drum', c => {
  const { b, be } = c; c.head('04', '关在二维里：鼓面');
  const drum = (parent, m, j, Rr = 1.6) => { const kz = BZ[m][j - 1]; const s2 = surface(parent, 60, 120, (u, w, t) => { const r = u, th = w * 2 * Math.PI, h = J(m, kz * r) * Math.cos(m * th) / (m ? .58 : 1) * .85 * Math.cos(t * kz * .55); return [r * Math.cos(th) * Rr, h, r * Math.sin(th) * Rr, h * 2]; }, { ck: 2.5 });
    const rim = new THREE.Mesh(new THREE.TorusGeometry(Rr, .025, 8, 120), new THREE.MeshBasicMaterial({ color: 0x8a96b0 })); rim.rotation.x = Math.PI / 2; parent.add(rim); return s2; };
  // 大鼓：(0,1) → (0,2) → (1,2)
  const v = glv(c, 160, 170, 1600, 760, { at: .2, until: be(0) + .2 }); lit(v); v.look(5.8, .42);
  const modes = [[0, 1], [0, 2], [1, 2]].map(([m, j]) => { const gg = new THREE.Group(); v.grp.add(gg); return { gg, s: drum(gg, m, j) }; });
  const mAt = t => t < F(c, 0, .35) ? 0 : t < F(c, 0, .7) ? 1 : 2;
  v.upd.push(t => { const k = mAt(t); modes.forEach((q, i) => { q.gg.visible = i === k; if (i === k) q.s.upd(t); }); v.grp.rotation.y = .4 + t * .08; });
  const lbs = ['最简单：整面一起起伏', '中间多了一圈不动的圆：圆形节点', '再多一条穿过圆心的直线：节线'];
  lbs.forEach((s2, i) => show(c, `<div class="vlab" style="left:160px;top:880px;width:1600px">${s2}</div>`, i === 0 ? .4 : F(c, 0, [0, .35, .7][i]), i < 2 ? F(c, 0, [.35, .7][i]) : be(0) + .2, { dy: 0 }));
  // 2×3 模式表
  const grid = [[0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
  multi(c, 160, 180, 1600, 700, grid.map(([m, j]) => ({ lab: `${j - 1} 圈圆节点 · ${m} 条节线`, init: v2 => { v2.s = drum(v2.grp, m, j, 1.5); }, upd: (t, v2) => { v2.s.upd(t); v2.grp.rotation.y = .4 + t * .08; } })), { cols: 3, at: b(1) + .2, until: be(1) + .2, D: 5.6, elev: .5 });
  // 第三拍：鼓面 ↔ 原子
  const v3 = glv(c, 100, 190, 900, 700, { at: b(2) + .2 }); lit(v3); v3.look(5.2, .55); const s3 = drum(v3.grp, 1, 2); v3.upd.push(t => { s3.upd(t); v3.grp.rotation.y = .4 + t * .08; });
  show(c, card(1060, 260, 760, `<div class="p" style="font-size:26px;line-height:1.9">圆形节点 ← 沿<b>半径</b>方向的驻波<br>穿过圆心的节线 ← 绕<b>圆心</b>方向的驻波<br><span style="color:var(--fg3)">绕圆心一圈必须首尾相接，所以节线是整数条</span></div>`), b(2) + .6, null);
  show(c, card(1060, 600, 760, `<div class="p" style="font-size:26px">原子是三维的：<br>“绕方向”的部分不在圆上，而在<b>球面</b>上</div>`), F(c, 2, .55), null);
});
S('e_sphere', c => {
  const { b, be } = c; c.head('05', '球面上的振动：s、p、d、f');
  const amp = (t, w = 2.2) => Math.cos(t * w);
  multi(c, 160, 190, 1600, 640, [{ lab: '<b>l = 0</b>　整体胀缩：s', f: () => 1 }, { lab: '<b>l = 1</b>　一边鼓一边瘪：p', f: angF(1, 2) }].map(q => ({ lab: q.lab, init: v => { v.s = vibSphere(v.grp, q.f, { eps: .22 }); }, upd: (t, v) => { v.s.upd(amp(t)); v.grp.rotation.set(.25, .5 + t * .15, 0); } })), { at: .2, until: be(0) + .2, D: 6 });
  multi(c, 160, 190, 1600, 640, [{ lab: '<b>l = 2</b>　两个节面（锥）：d', f: angF(2, 0) }, { lab: '<b>l = 3</b>　三个节面：f', f: angF(3, 5) }].map(q => ({ lab: q.lab, init: v => { v.s = vibSphere(v.grp, q.f, { eps: .22 }); }, upd: (t, v) => { v.s.upd(amp(t)); v.grp.rotation.set(.25, .5 + t * .15, 0); } })), { at: b(1) + .2, until: F(c, 1, .62), D: 6 });
  show(c, card(560, 850, 800, `<div class="p" style="text-align:center">球面花纹在两个方向上都要首尾相接 → 节面数是整数 = <b>l</b></div>`), F(c, 1, .35), F(c, 1, .62));
  // 数一数：l = 1, 2, 3 的所有花纹，然后鼓成波瓣
  const tm = F(c, 2, .62);
  const mk = (l, i) => ({ init: v => { v.s = vibSphere(v.grp, angF(l, i), { eps: .22, seg: 64, seg2: 48 }); }, upd: (t, v) => { v.s.upd(amp(t + i * .3), SS(t, tm, tm + 2.5)); v.grp.rotation.set(.3, .5 + t * .15, 0); } });
  multi(c, 520, 230, 840, 170, [0, 1, 2].map(i => mk(1, i)), { at: F(c, 1, .62), D: 4.4 });
  multi(c, 380, 420, 1300, 180, [0, 1, 2, 3, 4].map(i => mk(2, i)), { at: F(c, 1, .7), D: 4.4 });
  multi(c, 260, 620, 1600, 190, [0, 1, 2, 3, 4, 5, 6].map(i => mk(3, i)), { at: F(c, 1, .8), D: 4.4 });
  [['l = 1：3 种', 260], ['l = 2：5 种', 455], ['l = 3：7 种', 660]].forEach(([s2, y], i) => show(c, `<div class="abs" style="left:100px;top:${y}px;font:700 26px var(--mono);color:var(--gold);z-index:5">${s2}</div>`, F(c, 1, [.62, .7, .8][i]) + .4, null, { dy: 0 }));
  show(c, `<div class="cap abs" style="left:100px;top:880px;width:1720px;text-align:center">个数 = 2l + 1</div>`, b(2) + 2, tm, { dy: 0 });
  show(c, `<div class="cap abs" style="left:100px;top:880px;width:1720px;text-align:center">把花纹按振幅“鼓起来”：p、d、f 的波瓣</div>`, tm, null, { dy: 0 });
});
S('e_funnel', c => {
  const { b, be } = c; c.head('06', '加上深度：原子核挖的漏斗');
  const v = glv(c, 40, 170, 1400, 800, { at: .2 }); lit(v); v.look(11, .3, [0, -.9, 0]);
  const RM = 3.2, VY = r => Math.max(-4.2, -1.1 / Math.max(r, .05));   // 显示用：r 以“显示单位”
  const fun = surface(v.grp, 70, 140, (u, w) => { const r = .02 + u * RM, th = w * 2 * Math.PI; return [r * Math.cos(th), VY(r), r * Math.sin(th), -.0001]; }, { mat: new THREE.MeshBasicMaterial({ color: C_GRID, wireframe: true, transparent: true, opacity: .32 }) }); fun.upd();
  // 波：浮在能量高度上；ns = 1..3（s 轨道），按显示单位缩放半径
  const waves = [1, 2, 3].map(n => { const Rn = RH(n, 0), rmax = 2.2 * n * n + 6, sc = RM / rmax, E = VY(2 * n * n * sc) * 1, gg = new THREE.Group(); v.grp.add(gg);
    let mx = 0; for (let i = 1; i < 400; i++) { const r = i / 400 * rmax; mx = Math.max(mx, Math.abs(Rn(r) * Math.pow(r, .5))); }
    const s2 = surface(gg, 80, 140, (u, w, t) => { const r = u * rmax, th = w * 2 * Math.PI, val = Rn(r) * Math.pow(r, .5) / mx * Math.cos(t * 2); return [r * sc * Math.cos(th), E + 1.0 * val, r * sc * Math.sin(th), val]; }, { ck: 2 });
    const turn = new THREE.Mesh(new THREE.TorusGeometry(2 * n * n * sc, .03, 8, 120), new THREE.MeshBasicMaterial({ color: 0xffd27a })); turn.rotation.x = Math.PI / 2; turn.position.y = E; gg.add(turn);
    const plane = new THREE.Mesh(new THREE.RingGeometry(0, RM, 64), new THREE.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: .06, side: THREE.DoubleSide, depthWrite: false })); plane.rotation.x = -Math.PI / 2; plane.position.y = E; gg.add(plane);
    return { n, gg, s2, E }; });
  const nAt = t => t < b(2) + 1 ? 3 : t < F(c, 2, .4) ? 1 : t < F(c, 2, .65) ? 2 : 3;
  const ball = new THREE.Mesh(new THREE.SphereGeometry(.12, 16, 12), new THREE.MeshLambertMaterial({ color: 0xE9EEF7 })); v.grp.add(ball);
  v.upd.push(t => { const k = nAt(t), wv = SS(t, F(c, 0, .5), F(c, 0, .6)); waves.forEach(q => { q.gg.visible = q.n === k && wv > 0; if (q.gg.visible) q.s2.upd(t); });
    const bt = t < F(c, 0, .5) ? 1 : 0; ball.visible = bt > 0; const ph = Math.sin(t * 1.6), rb = 1.6 * Math.abs(ph) + .1; ball.position.set(rb, VY(rb) + .12, 0); v.grp.rotation.y = .3 + t * .06; });
  show(c, card(1460, 220, 400, `<div class="k">漏斗</div><div class="p" style="font-size:22px">高度 = 电子的势能（示意，不按比例）。越靠近原子核，越深。</div>`), .6, null);
  show(c, card(1460, 430, 400, `<div class="k">波</div><div class="p" style="font-size:22px">浮在电子的能量高度上。底部动能大 → 波长短；往外动能小 → 波长长。</div>`), F(c, 0, .6), null);
  show(c, card(1460, 640, 400, `<div class="k" style="color:var(--gold)">黄圈</div><div class="p" style="font-size:22px">能量用完的地方。圈外波不再振荡，迅速衰减：电子云没有硬边界。</div>`), b(1) + .5, null);
  const labs = ['1s：沿半径 0 个节点', '2s：1 个节点', '3s：2 个节点'];
  show(c, `<div class="vlab" style="left:40px;top:920px;width:1400px">3s 的波（金 = 正，蓝 = 负）</div>`, F(c, 0, .6), b(2) + 1, { dy: 0 });
  labs.forEach((s2, i) => show(c, `<div class="vlab" style="left:40px;top:920px;width:1400px"><b>${s2}</b>　·　n = 沿半径的节点 + 球面上的节面 + 1</div>`, [b(2) + 1, F(c, 2, .4), F(c, 2, .65)][i], i < 2 ? [F(c, 2, .4), F(c, 2, .65)][i] : null, { dy: 0 }));
});
S('e_mult', c => {
  const { b, be } = c; c.head('07', '相乘：径向乘角向');
  const panel = (y, n, at0, until) => {
    multi(c, 60, y, 420, 340, [{ lab: '球面花纹（l = 2）', init: v => { v.s = vibSphere(v.grp, angF(2, 4), { eps: .22, seg: 64, seg2: 48 }); }, upd: (t, v) => { v.s.upd(Math.cos(t * 2)); v.grp.rotation.set(.35, .5 + t * .15, 0); } }], { at: at0, until, D: 4.6 });
    const Rn = RH(n, 2), rmax = n * n * 2.2 + 4; let mx = 0; for (let i = 1; i < 300; i++) mx = Math.max(mx, Math.abs(i / 300 * rmax * Rn(i / 300 * rmax)));
    canvasLayer(c, 560, y + 20, 520, 280, (g, t) => { g.strokeStyle = '#2C3854'; g.lineWidth = 2; g.beginPath(); g.moveTo(10, 150); g.lineTo(510, 150); g.stroke(); let p0 = null;
      for (let i = 1; i <= 300; i++) { const r = i / 300 * rmax, q = r * Rn(r) / mx * Math.cos(t * 2), x = 10 + i / 300 * 500, yy = 150 - q * 110; if (p0) { g.strokeStyle = q >= 0 ? '#FFB25C' : '#4FA3FF'; g.lineWidth = 4; g.beginPath(); g.moveTo(p0[0], p0[1]); g.lineTo(x, yy); g.stroke(); } p0 = [x, yy]; }
      let pv = Rn(1e-3); for (let i = 2; i <= 300; i++) { const r = i / 300 * rmax, q = Rn(r); if (q * pv < 0) { g.fillStyle = '#E9EEF7'; g.beginPath(); g.arc(10 + i / 300 * 500, 150, 9, 0, 7); g.fill(); } pv = q; }
      tag(g, 260, 270, `沿半径（${n}d）：${n - 3} 个节点`, { size: 22, col: '#A3AEC3' }); }, { at: at0, until });
    orbRow(c, 1180, y, 680, 340, [{ n, l: 2, idx: 4, lab: `<b>${n}d<sub>xy</sub></b>`, plane: 1, modes: [[0, 'solid'], [at0 + 4, 'slice']] }], { at: at0, until, np: 6000 });
    show(c, sym(500, y + 120, '×'), at0, until); show(c, sym(1100, y + 120, '='), at0, until);
  };
  panel(200, 3, .3, null); panel(600, 4, b(1) + .2, F(c, 1, .55));
  canvasLayer(c, 100, 600, 1720, 330, (g, t) => {
    const r1 = RH(4, 0), r2 = RH(3, 2), RMx = 40, X = r => 60 + r / RMx * 1600; let m1 = 0, m2 = 0; const A = [], B = [];
    for (let i = 1; i <= 400; i++) { const r = i / 400 * RMx, p1 = r * r * r1(r) ** 2, p2 = r * r * r2(r) ** 2; A.push(p1); B.push(p2); m1 = Math.max(m1, p1); m2 = Math.max(m2, p2); }
    const draw = (arr, mx, col) => { g.strokeStyle = col; g.lineWidth = 3.5; g.beginPath(); arr.forEach((q, i) => { const x = X((i + 1) / 400 * RMx), y = 280 - q / mx * 220; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); };
    g.strokeStyle = '#2C3854'; g.beginPath(); g.moveTo(60, 280); g.lineTo(1660, 280); g.stroke(); draw(A, m1, '#FF7A93'); draw(B, m2, '#5FE0A0');
    tag(g, 60, 20, '径向分布：4s（粉）有一小部分钻到很靠近原子核的地方，3d（绿）没有', { size: 24, col: '#A3AEC3', align: 'left' }); tag(g, 70, 310, '原子核', { size: 20, col: '#66728C', align: 'left' });
  }, { at: F(c, 1, .58) });
});
S('e_cloud', c => {
  const { b, be } = c; c.head('08', '从振幅到点云');
  const Rn = RH(2, 1), half = 12, N = 70;
  const fx = (u, w) => { const x = (u * 2 - 1) * half, z = (w * 2 - 1) * half, r = Math.hypot(x, z) || 1e-6; return Rn(r) * (z / r); };
  let mx = 0; for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) mx = Math.max(mx, Math.abs(fx(i / N, j / N)));
  multi(c, 40, 190, 1240, 520, [
    { lab: '波 ψ（截面，高度 = 振幅）', init: v => { v.s = surface(v.grp, N, N, (u, w) => { const q = fx(u, w) / mx; return [(u * 2 - 1) * 2, q * 1.1, (w * 2 - 1) * 2, q]; }); v.s.upd(); } , upd: (t, v) => v.grp.rotation.set(0, .5 + Math.sin(t / 3) * .3, 0) },
    { lab: '平方 ψ²：两边一样高', init: v => { v.s = surface(v.grp, N, N, (u, w) => { const q = (fx(u, w) / mx) ** 2; return [(u * 2 - 1) * 2, q * 1.6, (w * 2 - 1) * 2, q + .001]; }); v.s.upd(); }, upd: (t, v) => v.grp.rotation.set(0, .5 + Math.sin(t / 3) * .3, 0) },
  ], { at: .2, until: be(0) + .2, D: 7, elev: .55 });
  orbRow(c, 1300, 190, 580, 520, [{ n: 2, l: 1, idx: 2, lab: '按 ψ² 撒点' }], { at: F(c, 0, .55), until: be(0) + .2, np: 12000 });
  show(c, sym(615, 400, '→'), F(c, 0, .3), be(0) + .2); show(c, sym(1240, 400, '→'), F(c, 0, .55), be(0) + .2);
  show(c, card(300, 780, 1320, `<div class="p" style="text-align:center">在某处找到电子的概率 ∝ ψ²　·　节点上 ψ = 0，概率也是 0</div>`), F(c, 0, .2), be(0) + .2);
  // 第二拍：三个哑铃叠成球
  const v = glv(c, 160, 190, 1600, 650, { at: b(1) + .2 }); v.look(30, .25);
  const cols = ['#FF7A93', '#5FE0A0', '#5CB4FF'], ps = [0, 1, 2].map(i => { const h = EC.sampleH(2, 1, i, 9000, 3 + i), p = ptsFrom(h.pts, cols[i], { size: 20 }); v.grp.add(p); return p; });
  const tm = F(c, 1, .45);
  v.upd.push(t => { const u = SS(t, tm, tm + 3); ps.forEach((p, i) => { p.position.x = (i - 1) * 13 * (1 - u); p.rotation.set(.25, .5 + t * .2, 0); p.material.uniforms.uSize.value = v.psize(4.5); p.material.uniforms.uA.value = 1.6; }); });
  ['p<sub>x</sub> ∝ x', 'p<sub>y</sub> ∝ y', 'p<sub>z</sub> ∝ z'].forEach((s2, i) => show(c, `<div class="vlab" style="left:${160 + i * 533}px;top:820px;width:533px"><b>${s2}</b></div>`, b(1) + .5, tm, { dy: 0 }));
  show(c, card(560, 830, 800, `<div class="p" style="text-align:center;font-size:30px">x² + y² + z² = r²：每个方向一样 → 圆球</div>`), tm + 2, null);
});
S('e_m', c => {
  const { b, be } = c; c.head('09', '波也可以转圈：m 的意思');
  const A = EC.sampleH(2, 1, 0, 14000, 3), B = EC.sampleH(2, 1, 1, 14000, 4), n = 28000, PP = new Float32Array(n * 4); PP.set(A.pts, 0); PP.set(B.pts, A.pts.length);
  const ringCloud = (parent, sgn) => { const P = new Float32Array(n * 3), Cc = new Float32Array(n * 3), PH = new Float32Array(n); for (let i = 0; i < n; i++) { const x = PP[i * 4], y = PP[i * 4 + 1], z = PP[i * 4 + 2]; P[i * 3] = x; P[i * 3 + 1] = z; P[i * 3 + 2] = y; PH[i] = Math.atan2(y, x); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('color', new THREE.BufferAttribute(Cc, 3)); const p = new THREE.Points(g, ptsMat(20)); parent.add(p); const col = new THREE.Color();
    return { p, upd: (t, mode) => { for (let i = 0; i < n; i++) { if (mode === 'sum') { const v2 = Math.cos(PH[i]) * Math.cos(t * 2); signCol(Cc, i, v2, 2); } else { col.setHSL((((sgn * PH[i] - t * 2) / (2 * Math.PI)) % 1 + 1) % 1, .85, .55); Cc[i * 3] = col.r; Cc[i * 3 + 1] = col.g; Cc[i * 3 + 2] = col.b; } } g.attributes.color.needsUpdate = true; } }; };
  const v = glv(c, 200, 170, 1100, 800, { at: .2, until: be(0) + .2 }); v.look(20, .97); v.cam.position.set(0, 22, 4); v.cam.lookAt(0, 0, 0); const R1 = ringCloud(v.grp, 1); R1.p.material.uniforms.uSize.value = v.psize(4.5); R1.p.material.uniforms.uA.value = 1.5;
  v.upd.push(t => { R1.upd(t); v.grp.rotation.set(0, 0, 0); });
  canvasLayer(c, 1320, 260, 520, 520, (g, t) => { const cx = 260, cy = 220; for (let i = 0; i < 360; i++) { g.strokeStyle = `hsl(${(i - t * 2 * 180 / Math.PI) % 360 + 360},85%,55%)`; g.lineWidth = 26; g.beginPath(); g.arc(cx, cy, 150, i / 180 * Math.PI, (i + 1.5) / 180 * Math.PI); g.stroke(); }
    const a = -t * 2; arrow(g, cx + 190 * Math.cos(a + .5), cy + 190 * Math.sin(a + .5), cx + 190 * Math.cos(a), cy + 190 * Math.sin(a), '#E9EEF7', 4, 16);
    tag(g, cx, 440, '颜色 = 相位；相位绕 z 轴转圈', { size: 22, col: '#A3AEC3' }); }, { at: .8, until: be(0) + .2 });
  show(c, `<div class="vlab" style="left:200px;top:930px;width:1100px">2p，<b>m = +1</b>：一个圆环（从上方看）</div>`, .5, be(0) + .2, { dy: 0 });
  // 第二拍：+1 与 −1 → px
  multi(c, 60, 210, 1800, 560, [{ lab: '<b>m = +1</b>：逆时针转', s: 1 }, { lab: '<b>m = −1</b>：顺时针转', s: -1 }, { lab: '相加：<b>p<sub>x</sub></b>，原地起伏', s: 0 }].map(q => ({ lab: q.lab, D: 6, init: v2 => { v2.R = ringCloud(v2.grp, q.s || 1); v2.R.p.material.uniforms.uSize.value = 4.5 * 25 * 560 / 720; v2.R.p.material.uniforms.uA.value = 1.5; }, upd: (t, v2) => v2.R.upd(t, q.s ? 'rot' : 'sum') })), { at: b(1) + .2, elev: 4 });
  show(c, sym(625, 430, '+'), b(1) + .6, null); show(c, sym(1225, 430, '='), b(1) + 1, null);
  show(c, card(360, 820, 1200, `<div class="p" style="text-align:center">就像琴弦上：向右跑的波 + 向左跑的波 = 驻波</div>`), F(c, 1, .4), null);
});
S('e_super', c => {
  const { b, be } = c; c.head('10', '叠加生出新形状');
  const half = 10, N = 45, Gs = hGrid(2, 0, 0, half, N), Gp = hGrid(2, 1, 0, half, N);
  const nrm = a => { let s2 = 0; for (const x of a) s2 += x * x; const k = 1 / Math.sqrt(s2); return a.map(x => x * k); };
  const s0 = nrm(Gs.psi), p0 = nrm(Gp.psi);
  const tm = F(c, 0, .35);
  multi(c, 60, 200, 1800, 560, [
    { lab: '2s', init: v => lobes(v.grp, { g: Gs.g, psi: s0 }, .85), upd: (t, v) => v.grp.rotation.set(.3, .4 + t * .15, 0) },
    { lab: '2p', init: v => lobes(v.grp, { g: Gp.g, psi: p0 }, .85), upd: (t, v) => v.grp.rotation.set(.3, .4 + t * .15, 0) },
    { lab: '相加：sp 杂化', init: v => { v.cur = null; }, upd: (t, v) => { const u = SS(t, tm, tm + 4), key = Math.round(u * 20); if (key !== v.key) { v.key = key; if (v.cur) { v.grp.remove(v.cur); v.cur.children.forEach(m => m.geometry.dispose()); } const a = Math.sin(u * Math.PI / 4), cc = Math.cos(u * Math.PI / 4) * (u > 0 ? 1 : 1); const psi = p0.map((x, i) => cc * x + a * s0[i]); v.cur = lobes(v.grp, { g: Gp.g, psi }, .85); } v.grp.rotation.set(.3, .4 + t * .15, 0); } },
  ], { at: .2, until: be(0) + .2, D: 26 });
  show(c, sym(620, 400, '+'), .5, be(0) + .2); show(c, sym(1220, 400, '='), .5, be(0) + .2);
  show(c, card(360, 800, 1200, `<div class="p" style="text-align:center">同号的一侧加强 → 大瓣　·　异号的一侧抵消 → 小瓣</div>`), F(c, 0, .4), be(0) + .2);
  // 第二拍：成键与反键（H₂）
  const atoms = [{ el: 'H', p: [-.37, 0, 0] }, { el: 'H', p: [.37, 0, 0] }], S0 = a => ({ a, s: 1, p: [0, 0, 0] });
  const mk = sg => { const f = MOL.moFn([{ c: 1, ao: S0(0) }, { c: sg, ao: S0(1) }], atoms), G = ISO.grid(45, [0, 0, 0], 2.2); return { g: G, psi: ISO.fill(G, (X, Y, Zd) => f(X, Zd, Y)) }; };
  const Bd = mk(1), Ab = mk(-1);
  multi(c, 60, 200, 1800, 560, [
    { lab: '同号相加：电子聚在中间 → <b>成键</b>', init: v => { lobes(v.grp, Bd, .85); [-.37, .37].forEach(x => { const m = new THREE.Mesh(new THREE.SphereGeometry(.05, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); m.position.x = x; v.grp.add(m); }); }, upd: (t, v) => v.grp.rotation.set(.25, .3 + t * .12, 0) },
    { lab: '异号相加：中间是节面 → <b>反键</b>', init: v => { lobes(v.grp, Ab, .85); }, upd: (t, v) => v.grp.rotation.set(.25, .3 + t * .12, 0) },
  ], { at: b(1) + .2, D: 8.5 });
  show(c, card(360, 800, 1200, `<div class="p" style="text-align:center">两个氢原子的 1s 波相遇（实体：装下 85% 概率的包络面，金 = 正，蓝 = 负）</div>`), b(1) + 1, null);
});
S('e_end', c => {
  const { b, be } = c; c.head('11', '小结');
  const steps = ['电子是波', '被关住', '只有首尾相接的花纹能留下', '球面上数节面 → l、2l+1 个', '沿半径数节点 → n − l − 1', 'ψ² → 点云'];
  steps.forEach((s2, i) => show(c, card(100, 200 + i * 110, 700, `<div style="font:700 28px var(--serif)"><span style="color:var(--gold);font-family:var(--mono);margin-right:14px">${i + 1}</span>${s2}</div>`), .3 + i * 1.5, null));
  orbRow(c, 860, 200, 1000, 300, [{ n: 1, l: 0, lab: '1s' }, { n: 2, l: 1, idx: 2, lab: '2p' }, { n: 3, l: 2, idx: 0, lab: '3d' }, { n: 4, l: 3, idx: 0, lab: '4f' }], { at: .5, modes: [[0, 'pts'], [b(0) + 6, 'solid']], np: 6000 });
  orbRow(c, 860, 520, 1000, 300, [{ n: 2, l: 0, lab: '2s' }, { n: 3, l: 1, idx: 2, lab: '3p', plane: 0 }, { n: 4, l: 2, idx: 1, lab: '4d', plane: 0 }, { n: 5, l: 3, idx: 5, lab: '5f', plane: 1 }], { at: b(0) + 4, modes: [[0, 'slice']], np: 5000 });
  show(c, card(860, 840, 1000, `<div class="p" style="text-align:center;font-size:26px">看到一个轨道，先数：<b>球面上几个节面</b>，<b>沿半径几圈节点</b></div>`), b(1) + .5, null);
});
