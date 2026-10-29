// lib.js —— 电子云视频的公共部件：DOM 小工具、WebGL 视窗、原子点云、等值面 / 截面、反应动画
window.SCENES = {};
const S = (id, build) => (window.SCENES[id] = { build });
const SS = (t, a, b) => { const x = Math.max(0, Math.min(1, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
const F = (c, i, fr) => c.b(i) + (c.be(i) - c.b(i)) * fr;
const LCOL = ['#FF7A93', '#5CB4FF', '#5FE0A0', '#C79BFF'], POS = '#FFB25C', NEG = '#4FA3FF';
function show(c, html, at, until, o = {}) { const e = c.el(html); c.in(e, at, { dy: o.dy ?? 16, d: o.d ?? .55, scale: o.scale }); if (until != null) c.out(e, until, { d: o.dOut ?? .35 }); return e; }
const at = (x, y, w, inner, st = '') => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;${st}">${inner}</div>`;
const card = (x, y, w, inner, st = '') => `<div class="card" style="left:${x}px;top:${y}px;width:${w}px;${st}">${inner}</div>`;
const det = (x, y, w, h, body, src) => `<div class="det" style="left:${x}px;top:${y}px;width:${w}px"><span class="h">${h}</span>${body}${src ? `<small>${src}</small>` : ''}</div>`;
const pill = (col, t) => `<span class="pill" style="--c:${col}"><b></b>${t}</span>`;
const modeTag = (x, y, t) => `<div class="mode" style="left:${x}px;top:${y}px">${t}</div>`;
function canvasLayer(c, x, y, w, h, draw, o = {}) {
  const el = show(c, `<canvas class="abs" width="${w}" height="${h}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${o.z || 3}"></canvas>`, o.at ?? 0, o.until, { dy: o.dy ?? 0 });
  const g = el.getContext('2d'); c.tick(t => { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); draw(g, t, w, h); });
  return el;
}
function tag(g, x, y, s, o = {}) { g.font = `${o.w || 600} ${o.size || 22}px ${o.font || 'Inter, "Noto Sans CJK SC", sans-serif'}`; g.fillStyle = o.col || '#E9EEF7'; g.textAlign = o.align || 'center'; g.textBaseline = 'middle'; g.globalAlpha = o.a ?? 1; g.fillText(s, x, y); g.globalAlpha = 1; }
function arrow(g, x0, y0, x1, y1, col, w = 4, hs = 14, a = 1) {
  const L = Math.hypot(x1 - x0, y1 - y0); if (L < 1) return; const ux = (x1 - x0) / L, uy = (y1 - y0) / L;
  g.globalAlpha = a; g.strokeStyle = col; g.fillStyle = col; g.lineWidth = w; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1 - ux * hs * .8, y1 - uy * hs * .8); g.stroke();
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - ux * hs - uy * hs * .55, y1 - uy * hs + ux * hs * .55); g.lineTo(x1 - ux * hs + uy * hs * .55, y1 - uy * hs - ux * hs * .55); g.closePath(); g.fill(); g.globalAlpha = 1;
}
const hex3 = h => { const c = new THREE.Color(h); return [c.r, c.g, c.b]; };

// ---------- WebGL 视窗：每个视窗一块 canvas，跟 DOM 一起淡入淡出 ----------
function glv(c, x, y, w, h, o = {}) {
  const el = c.el(`<canvas class="gl" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:${o.z || 2}"></canvas>`);
  const r = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setPixelRatio(1); r.setSize(w, h, false); r.localClippingEnabled = true;
  const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(o.fov || 34, w / h, .01, 900), grp = new THREE.Group(); sc.add(grp);
  const v = { c, el, r, sc, cam, grp, x, y, w, h, upd: [], labels: [], D: 10 };
  v.look = (D, elev = .26, tgt = [0, 0, 0]) => { v.D = D; cam.position.set(tgt[0], tgt[1] + D * elev, tgt[2] + D); cam.lookAt(new THREE.Vector3(...tgt)); };
  v.label = (html, p, o2 = {}) => { const e = c.el(`<div class="lab3 ${o2.cls || ''}">${html}</div>`); const L = { e, p, obj: o2.obj, a: o2.a }; v.labels.push(L); return L; };
  v.psize = k => k * v.D * h / 720;   // 点的大小随相机距离和视窗高度缩放
  c.tick(t => {
    v.upd.forEach(f => f(t)); sc.updateMatrixWorld(true); r.render(sc, cam);
    v.labels.forEach(L => { const p = typeof L.p === 'function' ? L.p(t) : L.p; if (!p) { L.e.style.opacity = 0; return; }
      const q = new THREE.Vector3(...p).applyMatrix4((L.obj || grp).matrixWorld).project(cam); L.e.style.left = x + (q.x + 1) / 2 * w + 'px'; L.e.style.top = y + (1 - q.y) / 2 * h + 'px';
      L.e.style.opacity = L.a ? L.a(t) : (+getComputedStyle(el).opacity); });
  });
  c.cleanup.push(() => { r.dispose(); r.forceContextLoss(); });
  if (o.at != null) c.in(el, o.at, { dy: 0, d: o.d ?? .6 }); if (o.until != null) c.out(el, o.until, { d: .4 });
  return v;
}
function ptsMat(size, a = 1) {
  return new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexColors: true, uniforms: { uSize: { value: size }, uA: { value: a } },
    vertexShader: 'uniform float uSize; varying vec3 vC; varying float vE; void main(){ vC = color; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = uSize / -mv.z; gl_Position = projectionMatrix * mv; vec2 nd = gl_Position.xy / gl_Position.w; vE = smoothstep(1.0, .72, max(abs(nd.x), abs(nd.y))); }',
    fragmentShader: 'uniform float uA; varying vec3 vC; varying float vE; void main(){ vec2 d = gl_PointCoord - .5; float r = dot(d,d); if (r > .25) discard; gl_FragColor = vec4(vC, .32 * uA * vE * (1. - r * 4.)); }',
  });
}
// 采样点（x,y,z,sign）→ Points；显示坐标为 (x, z, y)，z 朝上；map 为径向压缩
function ptsFrom(P4, col, o = {}) {
  const n = P4.length / 4, P = new Float32Array(n * 3), C = new Float32Array(n * 3), map = o.map;
  const cp = hex3(o.pos || POS), cn = hex3(o.neg || NEG), cc = col ? hex3(col) : null, w = o.dim ?? 1;
  for (let i = 0; i < n; i++) {
    let x = P4[i * 4], y = P4[i * 4 + 1], z = P4[i * 4 + 2];
    if (map) { const r = Math.hypot(x, y, z) || 1e-9, s = map(r) / r; x *= s; y *= s; z *= s; }
    P[i * 3] = x; P[i * 3 + 1] = z; P[i * 3 + 2] = y;
    const q = cc || (P4[i * 4 + 3] > 0 ? cp : cn); C[i * 3] = q[0] * w; C[i * 3 + 1] = q[1] * w; C[i * 3 + 2] = q[2] * w;
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('color', new THREE.BufferAttribute(C, 3));
  const m = ptsMat(o.size || 20, o.a ?? 1), p = new THREE.Points(g, m); p.n = n; return p;
}
// 渐显：只画前 frac 的点（点是随机顺序采样的，所以像一张张照片累积起来）
const reveal = (p, frac) => p.geometry.setDrawRange(0, Math.max(0, Math.round(p.n * Math.max(0, Math.min(1, frac)))));

// ---------- 原子 ----------
function valenceKeys(Z) {
  const c = EC.config(Z), nmax = Math.max(...c.map(s => s.n));
  return c.filter(s => !(s.n < nmax && (s.e === 2 * (2 * s.l + 1) || s.l < 2))).map(s => s.key);
}
// 整个原子的点云：每个轨道一个 Points，便于分别淡入；o.keys 指定要画的亚层
function atomCloud(v, Z, o = {}) {
  const a = EC.sampleAtom(Z, o.perE || (Z <= 10 ? 3200 : Z <= 36 ? 1800 : 900), o.max || 90000, o.seed || 7);
  const keys = new Set(o.keys || (o.all ? a.map(q => q.key) : valenceKeys(Z)));
  const vis = a.filter(q => keys.has(q.key));
  const rr = []; vis.forEach(q => { for (let i = 0; i < q.pts.length; i += 16) rr.push(Math.hypot(q.pts[i], q.pts[i + 1], q.pts[i + 2])); }); rr.sort((x, y) => x - y);
  const Rfit = o.Rfit || rr[Math.floor(rr.length * .97)] || 1, map = o.comp === false ? null : (r => Math.sqrt(r * Rfit));
  const nmax = Math.max(...vis.map(q => q.n)), grp = new THREE.Group(); v.grp.add(grp);
  const orbs = vis.map(q => { const p = ptsFrom(q.pts, o.color === 'ph' ? null : (o.col || LCOL[q.l]), { map, dim: o.color === 'ph' || o.col ? 1 : .45 + .55 * q.n / nmax, size: 20 }); grp.add(p); return { ...q, p }; });
  const R = map ? map(Rfit) : Rfit, n = orbs.reduce((s, q) => s + q.p.n, 0);
  const k = o.k || (n > 40000 ? 3 : n > 12000 ? 4 : 5.5);
  const setSize = () => orbs.forEach(q => q.p.material.uniforms.uSize.value = v.psize(k));
  return { Z, a, orbs, grp, Rfit, map, R, n, setSize, alpha: f => orbs.forEach(q => q.p.material.uniforms.uA.value = f) };
}
function orbCloud(v, Z, key, idx, np = 8000, o = {}) {
  const one = EC.sampleOne(Z, key, idx, np, o.seed || 11), p = ptsFrom(one.pts, o.col || null, { map: o.map, size: 20 });
  (o.parent || v.grp).add(p);
  const rr = []; for (let i = 0; i < one.pts.length; i += 4) rr.push(Math.hypot(one.pts[i], one.pts[i + 1], one.pts[i + 2])); rr.sort((a, b) => a - b);
  return { p, one, R95: rr[Math.floor(rr.length * .95)] };
}
// 单个轨道的 ψ 网格（显示坐标）
function orbGrid(Z, key, idx, half, N = 45, o = {}) {
  const s = EC.config(Z).find(q => q.key === key) || { n: +key[0], l: 'spdf'.indexOf(key[1]), key, e: 1 }, tab = EC.radialTable(s.n, s.l, o.zeff || EC.zeff(Z, s)), f = EC.orbitals({ ...s, e: 2 * (2 * s.l + 1) })[idx].f;
  const g = ISO.grid(N, [0, 0, 0], half), psi = ISO.fill(g, (X, Y, Zd) => { const r = Math.hypot(X, Y, Zd) || 1e-6; return tab.R(r) * f(X / r, Zd / r, Y / r); });
  return { g, psi };
}
const SOLID = () => ISO.surfMat(THREE, false), SHELL = (a = .38) => { const m = ISO.surfMat(THREE, true); m.uniforms.uA.value = a; return m; };
// 实体波瓣：金色 = 正，蓝色 = 负
function lobes(parent, G, frac = .85, mat) {
  const m = mat || SOLID(), lv = Math.sqrt(ISO.level(G.psi.map(x => x * x), frac)), neg = G.psi.map(x => -x), grp = new THREE.Group();
  grp.add(ISO.meshFrom(THREE, ISO.march(G.g, G.psi, lv, [{ a: G.psi, c: hex3(POS) }]), m)); grp.add(ISO.meshFrom(THREE, ISO.march(G.g, neg, lv, [{ a: neg, c: hex3(NEG) }]), m));
  parent.add(grp); return grp;
}
// 截面贴图（平面 = 显示坐标的 XY 面）
function slicePlane(parent, G, a, groups, o = {}) {
  const S2 = o.S || 400, cv = document.createElement('canvas'); cv.width = cv.height = S2;
  const pl = { o: [0, 0, 0], u: o.u || [1, 0, 0], v: o.v || [0, 1, 0], ext: G.half * (o.ext || .95) };
  ISO.slice(cv.getContext('2d'), S2, G, a, groups, pl, o);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2 * pl.ext, 2 * pl.ext), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, side: THREE.DoubleSide, depthWrite: false }));
  if (o.u) m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(...pl.u), new THREE.Vector3(...pl.v), new THREE.Vector3().crossVectors(new THREE.Vector3(...pl.u), new THREE.Vector3(...pl.v))));
  parent.add(m); return m;
}
// 整个原子的密度网格（显示坐标，按亚层分组），用于剖开的实体和截面
function atomGrid(A, o = {}) {
  const N = o.N || 60, half = A.R * 1.3, g = ISO.grid(N, [0, 0, 0], half), M = N * N * N, comp = !!A.map, Rf = A.Rfit;
  const Rr = new Float32Array(M), U = new Float32Array(M * 3), J = new Float32Array(M); let i = 0;
  for (let z = 0; z < N; z++) for (let y = 0; y < N; y++) for (let x = 0; x < N; x++, i++) { const X = g.o[0] + x * g.h, Y = g.o[1] + y * g.h, Zd = g.o[2] + z * g.h, d = Math.hypot(X, Y, Zd) || 1e-6, r = comp ? d * d / Rf : d; Rr[i] = r; U[i * 3] = X / d; U[i * 3 + 1] = Zd / d; U[i * 3 + 2] = Y / d; J[i] = comp ? (r * r / (d * d)) * (2 * d / Rf) : 1; }
  const tot = new Float32Array(M), sub = {}, lg = [0, 1, 2, 3].map(() => new Float32Array(M)), tmp = new Float32Array(M), rad = {};
  for (const q of A.orbs) {
    const so = EC.config(A.Z).find(s => s.key === q.key), f = EC.orbitals(so).find(s => s.plain === q.plain).f;
    let Rv = rad[q.key]; if (!Rv) { const tab = EC.radialTable(so.n, so.l, EC.zeff(A.Z, so)); Rv = rad[q.key] = new Float32Array(M); for (let k = 0; k < M; k++) { const vv = tab.R(Rr[k]); Rv[k] = vv * vv * J[k]; } }
    let Sm = 0; for (let k = 0; k < M; k++) { const aa = f(U[k * 3], U[k * 3 + 1], U[k * 3 + 2]); tmp[k] = Rv[k] * aa * aa; Sm += tmp[k]; }
    if (!(Sm > 0)) continue; const w = q.e / Sm, sh = sub[q.key] || (sub[q.key] = new Float32Array(M)), L = lg[q.l];
    for (let k = 0; k < M; k++) { const vv = tmp[k] * w; tot[k] += vv; sh[k] += vv; L[k] += vv; }
  }
  ISO.blur(tot, N); Object.values(sub).forEach(a => ISO.blur(a, N)); lg.forEach(a => ISO.blur(a, N));
  return { g, tot, sub, groups: lg.map((a, l) => ({ a, c: hex3(LCOL[l]) })).filter((q, l) => A.orbs.some(s => s.l === l)) };
}
// 剖开的实体：每个亚层一个 90% 包络面，前方切掉一块
function atomCut(parent, A, AG, o = {}) {
  const m = SOLID(); m.clippingPlanes = [new THREE.Plane(new THREE.Vector3(...(o.n || [-.35, 0, -1])).normalize(), 0)];
  const grp = new THREE.Group(); parent.add(grp);
  Object.keys(AG.sub).forEach(key => { const a = AG.sub[key], l = 'spdf'.indexOf(key[1]); grp.add(ISO.meshFrom(THREE, ISO.march(AG.g, a, ISO.level(a, .9), [{ a, c: hex3(LCOL[l]) }]), m)); });
  grp.add(new THREE.Mesh(new THREE.SphereGeometry(AG.g.half * .015, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })));
  return { grp, mat: m };
}
// 原子信息牌
const atomHud = (x, y, Z, extra = '') => `<div class="atomhud" style="left:${x}px;top:${y}px"><div class="z">Z = ${Z}</div><div class="sym">${EC.SYM[Z - 1]}</div><div class="nm">${EC.NAME[Z - 1]}</div><div class="cf">${EC.configStr(Z)}</div>${extra}</div>`;
// 匀速旋转（确定性）
const spin = (obj, w = .25, x0 = .22, y0 = .5) => t => obj.rotation.set(x0, y0 + t * w, 0);

// ---------- 化学反应 ----------
const ECOL = { H: '#F2F4F8', B: '#FF9EC4', C: '#A9B4C2', N: '#6FA8FF', O: '#FF6B6B', F: '#9BE15D', Na: '#C49BFF', Cl: '#5FD39A', Br: '#E0894B', Fe: '#FFB25C', Zn: '#9FC3F0', Cu: '#F0A060' };
const KCOL = { 'σ': '#FFD27A', 'π': '#5CE1E6', 'π*': '#FF7AB6', lp: '#C79BFF', ao: '#8FA3C0' }, KNAME = { 'σ': 'σ 键电子', 'π': 'π 键电子', 'π*': '反键 π* 电子', lp: '孤对电子', ao: '未成对电子' };
const ease = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);
function morton(P, n) { const k = new Array(n); let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]; for (let i = 0; i < n; i++) for (let d = 0; d < 3; d++) { mn[d] = Math.min(mn[d], P[i * 4 + d]); mx[d] = Math.max(mx[d], P[i * 4 + d]); }
  const q = (v, d) => Math.min(1023, Math.max(0, ((v - mn[d]) / ((mx[d] - mn[d]) || 1) * 1023) | 0)), sp = x => { x &= 1023; x = (x | (x << 16)) & 0x30000FF; x = (x | (x << 8)) & 0x300F00F; x = (x | (x << 4)) & 0x30C30C3; x = (x | (x << 2)) & 0x9249249; return x; };
  for (let i = 0; i < n; i++) k[i] = [sp(q(P[i * 4], 0)) | (sp(q(P[i * 4 + 1], 1)) << 1) | (sp(q(P[i * 4 + 2], 2)) << 2), i]; k.sort((a, b) => a[0] - b[0]); return k.map(x => x[1]); }
const D3 = p => [p[0], p[2], p[1]];
// 反应视图：rxv.set(u, mode, t) 每帧调用；mode = 'pts' | 'shell' | 'solid' | 'slice'
function rxView(v, id, o = {}) {
  const r = MOL.R.find(q => q.id === id), eTot = id === 'fe' ? 8 : r.tracks.reduce((x, t) => x + t.e, 0), PE = o.PE || Math.max(1100, Math.min(6000, Math.round(26000 / eTot))), rnd = MOL.rng(97 + MOL.R.indexOf(r)), cm = o.cm || r.cm || 'src', act = o.act ?? !!r.act;
  const tr = [];
  if (id === 'fe') {
    const Z = 26, d = EC.orbitals(EC.config(Z).find(q => q.key === '3d'));
    d.forEach((q, k) => { const p = EC.sampleOne(Z, '3d', k, PE * q.e).pts; tr.push({ e: q.e, src: 0, k: 'ao', k1: 'ao', p0: p, p1: p, col: '#FFB25C' }); });
    const p4 = EC.sampleOne(Z, '4s', 0, PE * 2).pts, p4b = new Float32Array(p4); for (let j = 0; j < p4b.length; j += 4) { p4b[j] *= 5.5; p4b[j + 1] *= 5.5; p4b[j + 2] *= 5.5; }
    tr.push({ e: 2, src: 0, k: 'lp', k1: 'lp', p0: p4, p1: p4b, fade: true, col: '#5CE1E6' });
  } else r.tracks.forEach(t => { const n = Math.round(PE * t.e); tr.push({ ...t, p0: MOL.moSample(t.from, r.atoms0, n, rnd), p1: MOL.moSample(t.to, r.atoms1, n, rnd) }); });
  tr.forEach(t => { t.spec = !t.fade && !t.cols && t.k === t.k1 && JSON.stringify(t.from) === JSON.stringify(t.to); const n = t.p0.length / 4; t.n = n; t.idx = [morton(t.p0, n), morton(t.p1, n)]; });
  const colA = t => (t.cols && t.cols[0]) || t.col || (cm === 'src' ? ECOL[r.atoms0[t.src].el] : KCOL[t.k]) || '#fff', colB = t => (t.cols && t.cols[1]) || t.col || (cm === 'src' ? ECOL[r.atoms0[t.src].el] : KCOL[t.k1]) || '#fff';
  const N = tr.reduce((a, t) => a + t.n, 0), P = new Float32Array(N * 3), Cl = new Float32Array(N * 3), cA = new Float32Array(N * 3), cB = new Float32Array(N * 3);
  { let k = 0; for (const t of tr) { const a = hex3(colA(t)), b = hex3(colB(t)); for (let j = 0; j < t.n; j++, k++) for (let q = 0; q < 3; q++) { cA[k * 3 + q] = a[q]; cB[k * 3 + q] = b[q]; } } }
  const inner = new THREE.Group(); v.grp.add(inner);
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(P, 3)); g.setAttribute('color', new THREE.BufferAttribute(Cl, 3));
  const pts = new THREE.Points(g, ptsMat(20)); inner.add(pts);
  const nuc = r.atoms0.map(a => { const m = new THREE.Mesh(new THREE.SphereGeometry(.07, 16, 12), new THREE.MeshBasicMaterial({ color: ECOL[a.el] || '#fff' })); inner.add(m); return m; });
  // 网格与视角
  const PP = [...r.atoms0, ...r.atoms1].map(a => D3(a.p)), mn = [0, 1, 2].map(d => Math.min(...PP.map(p => p[d]))), mx = [0, 1, 2].map(d => Math.max(...PP.map(p => p[d])));
  let marg = 2; if (id === 'fe') marg = 6; else for (const a of r.atoms0) { const e = MOL.el(a.el); marg = Math.max(marg, 1.9 * (2 * e.ns + 1) / (2 * e.zeta) * .529); }
  marg = Math.min(marg, 6); const cen = mn.map((x, d) => (x + mx[d]) / 2), ext = Math.max(...mn.map((x, d) => (mx[d] - x) / 2)), G = ISO.grid(o.N || 52, cen, ext + marg);
  inner.position.set(-cen[0], -cen[1], -cen[2]);
  let Rv = 0; PP.forEach(p => Rv = Math.max(Rv, Math.hypot(p[0] - cen[0], p[1] - cen[1], p[2] - cen[2])));
  const exR = { fe: 2.6, zncu: 3.6, na4: 3.0 }[id] || 1.5; Rv = Math.max(Rv, 1.2) + exR + .3;
  v.look(Rv * (o.zoom || 2.5), .3); pts.material.uniforms.uSize.value = v.psize(o.k || 4.6);
  const labs = r.atoms0.map((a, i) => v.label(a.el, () => nuc[i].position.toArray(), { obj: inner, cls: 'sm' }));
  // 等值面关键帧（同步计算）
  let iso = null;
  function buildIso() {
    if (iso) return iso; const M = G.N ** 3, still = r.atoms0.every((a, j) => a.p.every((x, d) => x === r.atoms1[j].p[d])), K = still && id !== 'fe' ? 2 : 7, kf = [];
    const normd = a => { let Sm = 0; for (let q = 0; q < M; q++) Sm += a[q]; if (Sm > 0) for (let q = 0; q < M; q++) a[q] /= Sm; return a; };
    for (let k = 0; k < K; k++) {
      const e = k / (K - 1), atoms = r.atoms0.map((a, j) => ({ el: a.el, p: a.p.map((x, d) => x + (r.atoms1[j].p[d] - x) * e) })), tot = new Float32Array(M), groups = {};
      const add = (col, w, src) => { if (w <= 0) return; const gA = groups[col] || (groups[col] = new Float32Array(M)); for (let q = 0; q < M; q++) { const vv = src[q] * w; gA[q] += vv; tot[q] += vv; } };
      if (id === 'fe') {
        const Z = 26, orb = key => { const s = EC.config(Z).find(q => q.key === key); return [EC.radialTable(s.n, s.l, EC.zeff(Z, s)), EC.orbitals(s)]; };
        const [t3, o3] = orb('3d'), [t4] = orb('4s'), sc2 = 1 + 4.5 * e;
        o3.forEach(q => add('#FFB25C', q.e, normd(ISO.fill(G, (X, Y, Zd) => { const rr = Math.hypot(X, Y, Zd) || 1e-6, vv = t3.R(rr) * q.f(X / rr, Zd / rr, Y / rr); return vv * vv; }))));
        add('#5CE1E6', 2 * (1 - e), normd(ISO.fill(G, (X, Y, Zd) => { const rr = Math.hypot(X, Y, Zd) / sc2 || 1e-6, vv = t4.R(rr); return vv * vv; })));
      } else {
        const cache = new Map(), dens = mo => { if (cache.has(mo)) return cache.get(mo); const f = MOL.moFn(mo, atoms), a = normd(ISO.fill(G, (X, Y, Zd) => { const vv = f(X, Zd, Y); return vv * vv; })); cache.set(mo, a); return a; };
        for (const t of tr) { if (act && t.spec) continue; if (e < 1) add(colA(t), (1 - e) * t.e, dens(t.from)); if (e > 0) add(colB(t), e * t.e, dens(t.to)); }
      }
      kf.push({ e, tot, groups });
    }
    const cols = [...new Set(kf.flatMap(f => Object.keys(f.groups)))];
    iso = { kf, cols, plane: planeOf(), W: { tot: new Float32Array(M), groups: cols.map(cc => ({ a: new Float32Array(M), c: hex3(cc) })) }, last: -1, lastMode: '' };
    const pl = iso.plane, Mb = new THREE.Matrix4().makeBasis(new THREE.Vector3(...pl.u), new THREE.Vector3(...pl.v), new THREE.Vector3(...pl.n));
    iso.planeQ = new THREE.Quaternion().setFromRotationMatrix(Mb); iso.Qb = iso.planeQ.clone().invert();
    return iso;
  }
  const nrm = x => { const l = Math.hypot(...x) || 1; return x.map(y => y / l); }, cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  function planeOf() {
    const Pp = r.atoms1.map(a => D3(a.p)), c0 = [0, 1, 2].map(d => Pp.reduce((s, p) => s + p[d], 0) / Pp.length), C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    Pp.forEach(p => { for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) C[i][j] += (p[i] - c0[i]) * (p[j] - c0[j]); });
    const mul = x => C.map(row => dot(row, x)), pw = (x, n = 60) => { for (let k = 0; k < n; k++) x = nrm(mul(x)); return x; };
    let e1 = pw([1, .3, .2]); const l1 = dot(e1, mul(e1)); C.forEach((row, i) => row.forEach((x, j) => C[i][j] = x - l1 * e1[i] * e1[j]));
    const e2 = pw(nrm(cross(e1, [.3, .7, .2]))), l2 = dot(e2, mul(e2)); let n;
    if (r.plane) n = nrm(D3(r.plane.n)); else if (l1 < 1e-3) n = [0, 0, 1]; else if (l2 < .02 * l1) { n = nrm([0, 0, 1].map((x, i) => x - e1[i] * e1[2])); if (Math.hypot(...n) < .5) n = [1, 0, 0]; } else n = nrm(cross(e1, e2));
    if (dot(n, [0, 0, 1]) < 0) n = n.map(x => -x);
    let uu = l1 < 1e-3 ? [1, 0, 0] : e1; uu = nrm(uu.map((x, i) => x - dot(uu, n) * n[i])); if (Math.hypot(...uu) < .5) uu = nrm(cross([0, 1, 0], n));
    let vv = cross(n, uu); if (vv[1] < 0) { uu = uu.map(x => -x); vv = vv.map(x => -x); }
    const off = r.plane && r.plane.off || 0; return { o: c0.map((x, i) => x + n[i] * off), u: uu, v: vv, n, ext: G.half * .92 };
  }
  const isoG = new THREE.Group(); inner.add(isoG); let solidM = null, shellM = null;
  const clearIso = () => isoG.children.slice().forEach(ch => { isoG.remove(ch); ch.geometry.dispose(); if (ch.material.map) { ch.material.map.dispose(); ch.material.dispose(); } });
  function drawIso(e, mode) {
    const I = buildIso(); if (Math.abs(e - I.last) < 1e-4 && mode === I.lastMode) return; I.last = e; I.lastMode = mode;
    const K = I.kf.length, x = e * (K - 1), k = Math.min(K - 2, Math.floor(x)), w = x - k, A = I.kf[k], B = I.kf[k + 1], W = I.W, M = W.tot.length;
    for (let q = 0; q < M; q++) W.tot[q] = A.tot[q] * (1 - w) + B.tot[q] * w;
    I.cols.forEach((cc, j) => { const a = A.groups[cc], b = B.groups[cc], out = W.groups[j].a; for (let q = 0; q < M; q++) out[q] = (a ? a[q] : 0) * (1 - w) + (b ? b[q] : 0) * w; });
    clearIso(); const lv = ISO.level(W.tot, .9);
    if (mode === 'slice') { const S2 = 512, cv = document.createElement('canvas'); cv.width = cv.height = S2; const pl = I.plane; ISO.slice(cv.getContext('2d'), S2, G, W.tot, W.groups, pl, { iso: lv, decades: 4 });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(2 * pl.ext, 2 * pl.ext), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, side: THREE.DoubleSide, depthWrite: false }));
      m.quaternion.copy(I.planeQ); m.position.set(...pl.o); isoG.add(m); }
    else isoG.add(ISO.meshFrom(THREE, ISO.march(G, W.tot, lv, W.groups), mode === 'shell' ? (shellM || (shellM = SHELL())) : (solidM || (solidM = SOLID()))));
  }
  const qw = new THREE.Quaternion(), qx = new THREE.Quaternion(), Yax = new THREE.Vector3(0, 1, 0), Xax = new THREE.Vector3(1, 0, 0);
  const R = { r, tr, v, inner, pts, nuc, labs, G, cm, act, colA, colB, buildIso, rot: o.rot || (t => [.14, .5 + Math.sin(t / 5) * .45]) };
  R.set = (u, mode, t) => {
    const e = ease(u);
    if (mode === 'slice') { buildIso(); qw.setFromAxisAngle(Yax, Math.sin(t / 4.5) * .28); qx.setFromAxisAngle(Xax, .12); v.grp.quaternion.copy(qx).multiply(qw).multiply(iso.Qb); }
    else { const [rx, ry] = R.rot(t); v.grp.rotation.set(rx, ry, 0); }
    pts.visible = mode === 'pts' || mode === 'shell'; pts.material.uniforms.uA.value = mode === 'shell' ? .35 : 1;
    if (pts.visible) { let k = 0;
      for (const t2 of tr) { const [o0, o1] = t2.idx, fade = (act && t2.spec) ? (o.specA ?? 0) : t2.fade ? 1 - ease((e - .3) / .5) : 1;
        for (let j = 0; j < t2.n; j++, k++) { const a = o0[j] * 4, b = o1[j] * 4; P[k * 3] = t2.p0[a] + (t2.p1[b] - t2.p0[a]) * e; P[k * 3 + 1] = t2.p0[a + 2] + (t2.p1[b + 2] - t2.p0[a + 2]) * e; P[k * 3 + 2] = t2.p0[a + 1] + (t2.p1[b + 1] - t2.p0[a + 1]) * e;
          for (let q = 0; q < 3; q++) Cl[k * 3 + q] = (cA[k * 3 + q] + (cB[k * 3 + q] - cA[k * 3 + q]) * e) * fade; } }
      g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true; }
    if (mode === 'pts') { if (isoG.children.length) clearIso(); if (iso) iso.last = -1; } else drawIso(e, mode);
    r.atoms0.forEach((a, i) => { const b = r.atoms1[i].p; nuc[i].position.set(a.p[0] + (b[0] - a.p[0]) * e, a.p[2] + (b[2] - a.p[2]) * e, a.p[1] + (b[1] - a.p[1]) * e); });
  };
  R.legend = () => { if (r.legend) return r.legend.map(([cc, tt]) => pill(cc, tt)).join('');
    if (cm === 'src') return [...new Set(r.atoms0.map(a => a.el))].map(e => pill(ECOL[e], `来自 ${e} 的电子`)).join('');
    return [...new Set(tr.filter(t => !(act && t.spec)).flatMap(t => [t.k, t.k1]))].map(k => pill(KCOL[k], KNAME[k])).join(''); };
  return R;
}
const MODEN = { pts: '点云', shell: '包络面：装下 90% 的价电子', solid: '实体：装下 90% 价电子的包络面', slice: '截面：亮度表示密度，白线为 90% 包络' };
// 标准的反应场景：左边大视窗，右边说明。segs: [[t0, t1, mode, u0, u1]]，段与段之间保持
function rxScene(c, id, o = {}) {
  const r = MOL.R.find(q => q.id === id), { b, be } = c, nb = c.sc.beats.length;
  const v = glv(c, 40, 120, 1300, 860, { at: .1 }), R = rxView(v, id, o);
  const segs = o.segs || (() => {
    const m0 = F(c, 0, .35), m1 = Math.min(m0 + 7, be(nb > 2 ? 1 : 0) + 2), last = b(nb - 1), alt = o.alt || 'solid';
    return [[0, m0, 'pts', 0, 0], [m0, m1, 'pts', 0, 1], [m1, last + .2, 'pts', 1, 1], [last + .2, last + 2.2, alt, 0, 0], [last + 2.2, Math.min(last + 9, c.T - 2.5), alt, 0, 1], [Math.min(last + 9, c.T - 2.5), c.T, alt, 1, 1]];
  })();
  const state = t => { let s = segs[0]; for (const q of segs) if (t >= q[0]) s = q; const u = s[3] + (s[4] - s[3]) * SS(t, s[0], s[1]); return [u, s[2]]; };
  v.upd.push(t => { const [u, m] = state(t); R.set(u, m, t); });
  const pane = c.el(`<div class="rx"><div class="kind">${r.kind}</div><h2>${r.name}</h2><div class="eq">${r.eq}</div><ol>${r.steps.map((s, k) => `<li><b>${['反应前', '反应中', '反应后'][k]}</b>${s}</li>`).join('')}</ol><div class="legend">${R.legend()}</div></div>`);
  c.in(pane, .3, { dx: 20, dy: 0 });
  const lis = [...pane.querySelectorAll('li')], mt = c.el(modeTag(70, 150, '点云'));
  c.tick(t => { const [u, m] = state(t), k = u <= .001 ? 0 : u >= .999 ? 2 : 1; lis.forEach((li, i) => li.classList.toggle('on', i === k)); const tx = MODEN[m]; if (mt._t !== tx) { mt._t = tx; mt.textContent = tx; } });
  if (r.only || o.note) show(c, `<div class="cap abs" style="left:70px;top:930px;width:1240px;z-index:6">${o.note || r.only}</div>`, 1, null, { dy: 0 });
  return { v, R, pane, state };
}

// ---------- 类氢轨道的小视窗 ----------
function hGrid(n, l, idx, half, N = 45, Z = 1) {
  const s = { n, l, key: n + 'spdf'[l], e: 2 * (2 * l + 1) }, tab = EC.radialTable(n, l, Z), f = EC.orbitals(s)[idx].f, g = ISO.grid(N, [0, 0, 0], half);
  return { g, psi: ISO.fill(g, (X, Y, Zd) => { const r = Math.hypot(X, Y, Zd) || 1e-6; return tab.R(r) * f(X / r, Zd / r, Y / r); }) };
}
// 一行轨道：一块 canvas 里用多个视口画多个轨道。item = {n,l,idx, modes:[[t,mode]], lab, Z, zoom, R}
function orbRow(c, x, y, w, h, items, o = {}) {
  const el = c.el(`<canvas class="gl" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:2"></canvas>`);
  const r = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setPixelRatio(1); r.setSize(w, h, false); r.setScissorTest(true);
  c.cleanup.push(() => { r.dispose(); r.forceContextLoss(); });
  const cw = w / items.length;
  const pre = items.map(it => { const hs = EC.sampleH(it.n, it.l, it.idx || 0, it.np || o.np || 8000, it.seed || 5, it.Z || 1), rr = []; for (let i = 0; i < hs.pts.length; i += 4) rr.push(Math.hypot(hs.pts[i], hs.pts[i + 1], hs.pts[i + 2])); rr.sort((a, b) => a - b); return { hs, R90: rr[Math.floor(rr.length * .9)] }; });
  const Rcom = o.sameScale ? Math.max(...pre.map(q => q.R90)) : 0;
  const cells = items.map((it, k) => {
    const sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, cw / h, .01, 900), obj = new THREE.Group(); sc.add(obj);
    const hs = pre[k].hs, p = ptsFrom(hs.pts, it.col || o.col || null, { size: 20 }); obj.add(p);
    const R95 = pre[k].R90, Rv = Rcom || it.R || R95, D = Rv * (it.zoom || o.zoom || 4.4) / Math.min(1, cw / h); cam.position.set(0, D * .28, D); cam.lookAt(0, 0, 0);
    p.material.uniforms.uSize.value = (it.k || o.k || 7) * D * h / 720; const pA = it.pa || o.pa || 1.5;
    let lob = null, sl = null, slQ = null; const modes = it.modes || o.modes || [[0, 'pts']];
    const mk = m => {
      if ((m === 'solid' || m === 'both' || m === 'shell') && !lob) { const G = hGrid(it.n, it.l, it.idx || 0, R95 * 1.25, 45, it.Z || 1); lob = lobes(obj, G, it.frac || .85, m === 'shell' ? SHELL() : null); }
      if (m === 'slice' && !sl) { const N = 61, G = hGrid(it.n, it.l, it.idx || 0, R95 * 1.25, N, it.Z || 1), c0 = 30, sm = [0, 0, 0];
        for (let z = 0; z < N; z++) for (let yy = 0; yy < N; yy++) for (let xx = 0; xx < N; xx++) { const q = G.psi[xx + N * (yy + N * z)] ** 2; if (z === c0) sm[0] += q; if (yy === c0) sm[1] += q; if (xx === c0) sm[2] += q; }
        const B = [[[1, 0, 0], [0, 1, 0]], [[1, 0, 0], [0, 0, -1]], [[0, 0, -1], [0, 1, 0]]][it.plane ?? sm.indexOf(Math.max(...sm))];
        sl = slicePlane(obj, G.g, G.psi, null, { u: B[0], v: B[1], signed: true, pos: hex3(POS), neg: hex3(NEG), iso: Math.sqrt(ISO.level(G.psi.map(q => q * q), it.frac || .85)), decades: 3, S: 360, round: true });
        slQ = sl.quaternion.clone().invert(); }
    };
    modes.forEach(([, m]) => mk(m));
    if (it.lab) show(c, `<div class="vlab" style="left:${x + k * cw}px;top:${y + h + (o.labDy ?? -8)}px;width:${cw}px">${it.lab}</div>`, o.at ?? 0, o.until, { dy: 0 });
    return { sc, cam, obj, p, lob, get sl() { return sl; }, modes, slQ: () => slQ, R95, it, pA };
  });
  const qw = new THREE.Quaternion(), Yax = new THREE.Vector3(0, 1, 0), qx = new THREE.Quaternion(), Xax = new THREE.Vector3(1, 0, 0);
  c.tick(t => {
    r.setScissor(0, 0, w, h); r.clear();
    cells.forEach((cl, k) => {
      let m = cl.modes[0][1]; for (const [t0, mm] of cl.modes) if (t >= t0) m = mm;
      cl.p.visible = m === 'pts' || m === 'both' || m === 'shell'; cl.p.material.uniforms.uA.value = (m === 'both' || m === 'shell' ? .4 : 1) * cl.pA;
      cl.obj.children.forEach(ch => { if (ch !== cl.p) ch.visible = ch.isMesh ? m === 'slice' : (m === 'solid' || m === 'both' || m === 'shell'); });
      if (m === 'slice') { qw.setFromAxisAngle(Yax, Math.sin(t / 4 + k) * .25); qx.setFromAxisAngle(Xax, .1); cl.obj.quaternion.copy(qx).multiply(qw).multiply(cl.slQ()); }
      else cl.obj.rotation.set(o.rx ?? .25, (o.ry ?? .6) + t * (o.w ?? .3) + k * .3, 0);
      r.setViewport(k * cw, 0, cw, h); r.setScissor(k * cw, 0, cw, h); r.render(cl.sc, cl.cam);
    });
  });
  if (o.at != null) c.in(el, o.at, { dy: 0, d: .6 }); if (o.until != null) c.out(el, o.until, { d: .4 });
  return { el, cells };
}
const orbView = (c, x, y, w, h, n, l, idx, o = {}) => orbRow(c, x, y, w, h, [{ n, l, idx, modes: o.modes, lab: o.lab, Z: o.Z, zoom: o.zoom, R: o.R, k: o.k, frac: o.frac, plane: o.plane, col: o.col, np: o.np }], o);
// 电子盒子图：rows = [[标签, [[↑↓数]...]]]
function boxes(g, x, y, rows, o = {}) {
  const bw = o.bw || 58, bh = o.bh || 62, gap = o.gap || 26;
  rows.forEach(([lab, occ, col], i) => { const yy = y + i * (bh + gap); tag(g, x, yy + bh / 2, lab, { align: 'right', size: 28, col: col || '#A3AEC3', font: 'DejaVu Sans Mono, monospace' });
    occ.forEach((e, j) => { const bx = x + 24 + j * (bw + 6); g.strokeStyle = col || '#66728C'; g.lineWidth = 2; g.strokeRect(bx, yy, bw, bh);
      const ar = (cx, up, a) => arrow(g, cx, up ? yy + bh - 10 : yy + 10, cx, up ? yy + 10 : yy + bh - 10, '#FFD27A', 3.5, 12, a);
      const a1 = typeof e === 'number' ? (e >= 1 ? 1 : 0) : e[0], a2 = typeof e === 'number' ? (e >= 2 ? 1 : 0) : e[1];
      if (a1 > 0) ar(bx + bw * .33, true, a1); if (a2 > 0) ar(bx + bw * .67, false, a2); }); });
}

// ---------- 一行原子：一块 canvas 多个视口 ----------
// item = {Z, conf?, keys?, all?, lab, modes:[[t,'pts'|'solid'|'cut']], solidKeys?}
function atomRow(c, x, y, w, h, items, o = {}) {
  const el = c.el(`<canvas class="gl" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;z-index:2"></canvas>`);
  const r = new THREE.WebGLRenderer({ canvas: el, antialias: true, alpha: true, preserveDrawingBuffer: true }); r.setPixelRatio(1); r.setSize(w, h, false); r.setScissorTest(true); r.localClippingEnabled = true;
  c.cleanup.push(() => { r.dispose(); r.forceContextLoss(); });
  const cw = w / items.length, asp = cw / h;
  const cells = items.map(it => {
    const pe = it.perE || o.perE || 2500, mx = it.max || o.max || Math.min(pe * it.Z, 250000), a = it.conf ? EC.sampleConf(it.Z, it.conf, pe, mx, 7) : EC.sampleAtom(it.Z, pe, mx, 7);
    const keys = new Set(it.keys || (it.all || o.all ? a.map(q => q.key) : valenceKeys(it.Z))), vis = a.filter(q => keys.has(q.key));
    const rr = []; vis.forEach(q => { for (let i = 0; i < q.pts.length; i += 8) rr.push(Math.hypot(q.pts[i], q.pts[i + 1], q.pts[i + 2])); }); rr.sort((p, q) => p - q);
    return { it, a, vis, R: rr[Math.floor(rr.length * (o.pct || .95))] || 1 };
  });
  const Rc = o.sameScale ? (o.R || Math.max(...cells.map(q => q.R))) : 0;
  cells.forEach((cl, k) => {
    const it = cl.it, sc = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, asp, .01, 900), obj = new THREE.Group(); sc.add(obj);
    const Rf = o.comp ? cl.R : 0, map = o.comp ? (q => Math.sqrt(q * Rf)) : null, Rv = Rc || (map ? map(cl.R) : cl.R), D = Rv * (it.zoom || o.zoom || 3.6) / Math.min(1, asp);
    cam.position.set(0, D * .25, D); cam.lookAt(0, 0, 0);
    const nmax = Math.max(...cl.vis.map(q => q.n)), n = cl.vis.reduce((s, q) => s + q.pts.length / 4, 0), kk = o.k || (n > 30000 ? 3.5 : n > 10000 ? 4.5 : 6);
    const ptsG = new THREE.Group(); obj.add(ptsG);
    cl.vis.forEach(q => { const p = ptsFrom(q.pts, it.col || (it.colBy ? it.colBy(q) : LCOL[q.l]), { map, dim: it.col ? 1 : .45 + .55 * q.n / nmax }); p.material.uniforms.uSize.value = kk * D * h / 720; p.q = q; ptsG.add(p); });
    Object.assign(cl, { sc, cam, obj, ptsG, map, Rv, D });
    cl.modes = it.modes || o.modes || [[0, 'pts']];
    if (cl.modes.some(([, m]) => m !== 'pts')) {
      const A = { Z: it.Z, orbs: cl.vis, R: map ? map(cl.R) : cl.R, Rfit: cl.R, map }, AG = atomGrid(A, { N: 52 }); cl.AG = AG;
      const solidG = new THREE.Group(), cutG = new THREE.Group(); obj.add(solidG); obj.add(cutG);
      const ks = it.solidKeys || Object.keys(AG.sub);
      if (cl.modes.some(([, m]) => m === 'solid')) { const m = SOLID(); ks.forEach(key => { const aa = AG.sub[key]; if (aa) solidG.add(ISO.meshFrom(THREE, ISO.march(AG.g, aa, ISO.level(aa, .9), [{ a: aa, c: hex3(LCOL['spdf'.indexOf(key[1])]) }]), m)); }); }
      if (cl.modes.some(([, m]) => m === 'cut')) { const cg = atomCut(cutG, A, AG); cl.cutM = cg.mat; }
      Object.assign(cl, { solidG, cutG });
    }
    if (it.lab) show(c, `<div class="vlab" style="left:${x + k * cw}px;top:${y + h + (o.labDy ?? -6)}px;width:${cw}px">${it.lab}</div>`, o.at ?? 0, o.until, { dy: 0 });
  });
  c.tick(t => {
    r.setScissor(0, 0, w, h); r.clear();
    cells.forEach((cl, k) => {
      let m = cl.modes[0][1]; for (const [t0, mm] of cl.modes) if (t >= t0) m = mm;
      cl.ptsG.visible = m === 'pts'; if (cl.solidG) { cl.solidG.visible = m === 'solid'; cl.cutG.visible = m === 'cut'; }
      if (o.fade) o.fade(t, cl);
      cl.obj.rotation.set(o.rx ?? .2, (o.ry ?? .5) + t * (o.w ?? .22) + k * .4, 0);
      if (cl.cutM) { cl.obj.updateMatrixWorld(true); }
      r.setViewport(k * cw, 0, cw, h); r.setScissor(k * cw, 0, cw, h); r.render(cl.sc, cl.cam);
    });
  });
  if (o.at != null) c.in(el, o.at, { dy: 0, d: .6 }); if (o.until != null) c.out(el, o.until, { d: .4 });
  return { el, cells };
}
const cfg = Z => EC.configStr(Z);
