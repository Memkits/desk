// g3.js —— 方解石专用的小型 3D / 电子云 / 光学绘图库（画布逐帧绘制，确定性）
const SS = (t, a, b) => { const x = Math.max(0, Math.min(1, (t - a) / (b - a))); return x * x * (3 - 2 * x); };
const LERP = (a, b, u) => a + (b - a) * u;
const V3 = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: a => Math.hypot(a[0], a[1], a[2]), lerp: (a, b, u) => [LERP(a[0], b[0], u), LERP(a[1], b[1], u), LERP(a[2], b[2], u)],
};
V3.norm = a => V3.mul(a, 1 / V3.len(a));
const rotZ = (p, th) => { const c = Math.cos(th), s = Math.sin(th); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; };
const inv3 = m => { const [a, b, c] = m[0], [d, e, f] = m[1], [g, h, i] = m[2], A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g, det = a * A + b * B + c * C; return [[A / det, -(b * i - c * h) / det, (b * f - c * e) / det], [B / det, (a * i - c * g) / det, -(a * f - c * d) / det], [C / det, -(a * h - b * g) / det, (a * e - b * d) / det]]; };
const mv = (m, v) => [m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2], m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2], m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2]];

// 相机：z 轴向上；yaw 绕 z 转，pitch 抬头（0 = 侧视，π/2 = 俯视）
function camera(o) {
  const cy = Math.cos(o.yaw || 0), sy = Math.sin(o.yaw || 0), cp = Math.cos(o.pitch || 0), sp = Math.sin(o.pitch || 0), P = o.persp || 0, s = o.scale || 40, c0 = o.center || [0, 0, 0];
  return p => {
    const x = p[0] - c0[0], y = p[1] - c0[1], z = p[2] - c0[2];
    const x1 = x * cy - y * sy, y1 = x * sy + y * cy;
    const X = x1, Y = z * cp - y1 * sp, D = y1 * cp + z * sp;
    const f = P ? P / (P + D) : 1;
    return [o.cx + X * s * f, o.cy - Y * s * f, D, s * f];
  };
}
const ACOL = { Ca: '#7FB3E0', C: '#3D3D42', O: '#E0503F', Na: '#A47BD8', Cl: '#5DBB6A', H: '#F2F2F2', Mn: '#F08A24' };
const ARAD = { Ca: .62, C: .34, O: .5, Na: .55, Cl: .9, H: .28, Mn: .64 };
function shade(hex, k) { const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255; if (k > 0) { r += (255 - r) * k; g += (255 - g) * k; b += (255 - b) * k; } else { r *= 1 + k; g *= 1 + k; b *= 1 + k; } return `rgb(${r | 0},${g | 0},${b | 0})`; }
// items: {k:'ball',p,r,col,a} {k:'bond',a,b,w,col,al} {k:'poly',pts,fill,stroke,al,lw} {k:'line',a,b,col,w,dash,al}
function draw3(g, cam, items) {
  const L = [];
  for (const it of items) {
    if (it.k === 'ball') { const q = cam(it.p); L.push([q[2], it, q]); }
    else if (it.k === 'bond' || it.k === 'line') { const qa = cam(it.a), qb = cam(it.b); L.push([(qa[2] + qb[2]) / 2 + (it.k === 'bond' ? .05 : 0), it, qa, qb]); }
    else if (it.k === 'poly') { const qs = it.pts.map(cam); L.push([qs.reduce((s, q) => s + q[2], 0) / qs.length + (it.bias || 0), it, qs]); }
  }
  L.sort((a, b) => b[0] - a[0]);
  for (const [, it, q, q2] of L) {
    g.globalAlpha = it.al ?? it.a ?? 1;
    if (it.k === 'ball') {
      const r = it.r * q[3]; if (r < .3) continue;
      const gr = g.createRadialGradient(q[0] - r * .35, q[1] - r * .4, r * .08, q[0], q[1], r);
      gr.addColorStop(0, shade(it.col, .65)); gr.addColorStop(.45, it.col); gr.addColorStop(1, shade(it.col, -.45));
      g.fillStyle = gr; g.beginPath(); g.arc(q[0], q[1], r, 0, 7); g.fill();
      if (it.ring) { g.strokeStyle = it.ring; g.lineWidth = 4; g.stroke(); }
    } else if (it.k === 'bond') {
      g.strokeStyle = it.col || '#9AA0A6'; g.lineWidth = (it.w || .14) * (q[3] + q2[3]) / 2; g.lineCap = 'round';
      g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(q2[0], q2[1]); g.stroke();
    } else if (it.k === 'line') {
      g.strokeStyle = it.col || '#555'; g.lineWidth = it.w || 2; g.setLineDash(it.dash || []);
      g.beginPath(); g.moveTo(q[0], q[1]); g.lineTo(q2[0], q2[1]); g.stroke(); g.setLineDash([]);
    } else if (it.k === 'poly') {
      g.beginPath(); q.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath();
      if (it.fill) { g.fillStyle = it.fill; g.fill(); }
      if (it.stroke) { g.globalAlpha = it.sal ?? 1; g.strokeStyle = it.stroke; g.lineWidth = it.lw || 2; g.stroke(); }
    }
  }
  g.globalAlpha = 1;
}

// ===== 方解石结构（Effenberger 1981；六方 R-3c） =====
const CAL = (() => {
  const a = 4.9896, c = 17.061, x = .2568, s3 = Math.sqrt(3);
  const cart = f => [f[0] * a - f[1] * a / 2, f[1] * a * s3 / 2, f[2] * c];
  const R = [[0, 0, 0], [2 / 3, 1 / 3, 1 / 3], [1 / 3, 2 / 3, 2 / 3]];
  const base = [['Ca', 0, 0, 0], ['Ca', 0, 0, .5], ['C', 0, 0, .25], ['C', 0, 0, .75], ['O', x, 0, .25], ['O', 0, x, .25], ['O', -x, -x, .25], ['O', -x, 0, .75], ['O', 0, -x, .75], ['O', x, x, .75]];
  const r1 = [a, a / s3, c / 6], rh = [r1, rotZ(r1, 2 * Math.PI / 3), rotZ(r1, 4 * Math.PI / 3)];
  const M = [[rh[0][0], rh[1][0], rh[2][0]], [rh[0][1], rh[1][1], rh[2][1]], [rh[0][2], rh[1][2], rh[2][2]]], Mi = inv3(M);
  // 生成 hex 胞 (i,j,k) 范围内所有原子
  function atoms(n = 3, kz = 2) {
    const out = [];
    for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) for (let k = -kz; k <= kz; k++) for (const t of R) for (const [el, u, v, w] of base) {
      out.push({ el, p: cart([u + t[0] + i, v + t[1] + j, w + t[2] + k]) });
    }
    return out;
  }
  // 以 C 为单位的碳酸根组 + 钙
  function groups(pred, n = 3, kz = 2) {
    const A = atoms(n, kz), Cs = A.filter(q => q.el === 'C' && pred(q.p)), Os = A.filter(q => q.el === 'O'), Cas = A.filter(q => q.el === 'Ca' && pred(q.p));
    const G = Cs.map(cc => ({ c: cc.p, o: Os.filter(o => V3.len(V3.sub(o.p, cc.p)) < 1.4).map(o => o.p) }));
    return { G, Ca: Cas.map(q => q.p), O: Os };
  }
  const frac = p => mv(Mi, p);   // 解理菱面体坐标
  return { a, c, x, cart, rh, M, Mi, frac, atoms, groups, edge: V3.len(r1) };
})();
// 解理菱面体的基矢（随夹角 α 变化；|r| = 6.425 Å，α=90° 为 NaCl 型立方体）
function rhBasis(alphaDeg, L = CAL.edge) {
  const ca = Math.cos(alphaDeg * Math.PI / 180), rho = Math.sqrt((1 - ca) / 1.5) * L, h = Math.sqrt(L * L - rho * rho);
  const r1 = [rho * Math.cos(Math.PI / 6), rho * Math.sin(Math.PI / 6), h];
  return [r1, rotZ(r1, 2 * Math.PI / 3), rotZ(r1, 4 * Math.PI / 3)];
}
const fromFrac = (B, f) => V3.add(V3.add(V3.mul(B[0], f[0]), V3.mul(B[1], f[1])), V3.mul(B[2], f[2]));

// ===== 电子云（二维密度图） =====
// 色表：深蓝 → 青 → 白
function cmap(v) { v = Math.max(0, Math.min(1, v)); const s = [[8, 12, 30], [20, 50, 120], [30, 120, 190], [90, 200, 230], [210, 245, 255], [255, 255, 255]]; const x = v * (s.length - 1), i = Math.min(s.length - 2, x | 0), u = x - i; return s[i].map((c, k) => c + (s[i + 1][k] - c) * u); }
// gs: [{x,y,s,w}] 高斯；W×H 像素，view = {x0,y0,ppa}（每埃像素）
function densityImage(g, W, H, view, gs, gain = 1, o = {}) {
  const img = g.createImageData(W, H), d = img.data;
  for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
    const X = view.x0 + (i - W / 2) / view.ppa, Y = view.y0 - (j - H / 2) / view.ppa; let v = 0;
    for (const q of gs) { const dx = (X - q.x) / (q.sx || q.s), dy = (Y - q.y) / (q.sy || q.s); v += q.w * Math.exp(-(dx * dx + dy * dy)); }
    const c = cmap(Math.pow(v * gain, o.gamma || .55)), k = (j * W + i) * 4; d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
  }
  return img;
}
// 碳酸根平面内的电子密度（C 在原点，O 在 1.28 Å，朝向 th0），带极化位移 (ex, ey)
function co3Gauss(th0 = Math.PI / 2, ex = 0, ey = 0, k = 1) {
  const gs = [{ x: 0, y: 0, s: .32, w: 1.1 }];
  for (let i = 0; i < 3; i++) {
    const th = th0 + i * 2 * Math.PI / 3, ox = 1.28 * Math.cos(th), oy = 1.28 * Math.sin(th);
    gs.push({ x: ox + ex, y: oy + ey, s: .45, w: 1.5 * k }, { x: ox + ex * .9, y: oy + ey * .9, s: .95, w: .35 * k });
    gs.push({ x: ox * .5 + ex * .5, y: oy * .5 + ey * .5, s: .38, w: .55 });
  }
  return gs;
}

// ===== 光学 =====
const NO = 1.6584, NE = 1.4864;
const neTheta = th => 1 / Math.sqrt(Math.cos(th) ** 2 / NO ** 2 + Math.sin(th) ** 2 / NE ** 2);
const walkoff = th => Math.atan(.5 * neTheta(th) ** 2 * Math.sin(2 * th) * (1 / NE ** 2 - 1 / NO ** 2));

// 方便：在场景里放一块画布，并登记逐帧绘制
function canvasLayer(c, x, y, w, h, draw, o = {}) {
  const el = show(c, `<canvas class="abs" width="${w}" height="${h}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${o.st || ''}"></canvas>`, o.at ?? 0, o.until);
  const g = el.getContext('2d'); c.tick(t => { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); draw(g, t, w, h); });
  return el;
}
// 文本标签
function tag(g, x, y, s, o = {}) { g.font = `${o.w || 600} ${o.size || 22}px ${o.font || 'Inter, "Noto Sans CJK SC", sans-serif'}`; g.fillStyle = o.col || '#181B20'; g.textAlign = o.align || 'center'; g.textBaseline = 'middle'; g.globalAlpha = o.a ?? 1; g.fillText(s, x, y); g.globalAlpha = 1; }
function arrow(g, x0, y0, x1, y1, col, w = 4, hs = 14, a = 1) {
  const L = Math.hypot(x1 - x0, y1 - y0); if (L < 1) return; const ux = (x1 - x0) / L, uy = (y1 - y0) / L;
  g.globalAlpha = a; g.strokeStyle = col; g.fillStyle = col; g.lineWidth = w; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1 - ux * hs * .8, y1 - uy * hs * .8); g.stroke();
  g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - ux * hs - uy * hs * .55, y1 - uy * hs + ux * hs * .55); g.lineTo(x1 - ux * hs + uy * hs * .55, y1 - uy * hs - ux * hs * .55); g.closePath(); g.fill(); g.globalAlpha = 1;
}

// ===== 解理菱面体组成的块（s1/s2 共用） =====
const BLOCK = (() => { // 2×2×2 个解理菱面体内的 Ca 与 CO₃（菱面体分数坐标）
  const A = CAL.atoms(3, 2), inb = f => f.every(v => v > -.01 && v < 2.01);
  const Ca = A.filter(q => q.el === 'Ca').map(q => CAL.frac(q.p)).filter(inb);
  const Os = A.filter(q => q.el === 'O');
  const G = A.filter(q => q.el === 'C').map(q => ({ f: CAL.frac(q.p), p: q.p })).filter(q => inb(q.f)).map(q => ({ f: q.f, o: Os.filter(o => V3.len(V3.sub(o.p, q.p)) < 1.4).map(o => V3.sub(o.p, q.p)) }));
  return { Ca, G };
})();
function blockItems(alpha, mix, o = {}) {   // mix: 0 = NaCl，1 = 方解石
  const B = rhBasis(alpha), its = [], s = o.s || 1, cen = fromFrac(B, [1, 1, 1]);
  const P = f => V3.mul(V3.sub(fromFrac(B, f), cen), s);
  for (const f of BLOCK.Ca) {
    its.push({ k: 'ball', p: P(f), r: LERP(ARAD.Na, ARAD.Ca, mix) * s * (o.rs || 1), col: mix < .5 ? ACOL.Na : ACOL.Ca });
  }
  for (const gq of BLOCK.G) {
    const c0 = P(gq.f);
    if (mix < 1) its.push({ k: 'ball', p: c0, r: ARAD.Cl * s * (1 - mix) * (o.rs || 1), col: ACOL.Cl, a: 1 - mix });
    if (mix > 0) { its.push({ k: 'ball', p: c0, r: ARAD.C * s * .9, col: ACOL.C, a: mix }); gq.o.forEach(d => { const q = V3.add(c0, V3.mul(d, s)); its.push({ k: 'ball', p: q, r: ARAD.O * s * .8, col: ACOL.O, a: mix }); its.push({ k: 'bond', a: c0, b: q, w: .16 * s, col: '#555', al: mix }); }); if (o.tri) its.push({ k: 'poly', pts: gq.o.map(d => V3.add(c0, V3.mul(d, s))), fill: 'rgba(224,80,63,.25)', al: mix * o.tri, bias: .3 }); }
  }
  return { its, B, P };
}
