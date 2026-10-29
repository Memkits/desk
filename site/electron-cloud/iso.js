// iso.js —— 把电子密度画成“物体”：等值面（行进四面体）和截面热图 + 等高线
(function (G) {
  // 立方网格：中心 c，半边长 half，每边 N 个点；下标 i = x + N*(y + N*z)
  function grid(N, c, half) { const h = 2 * half / (N - 1); return { N, c, half, h, o: [c[0] - half, c[1] - half, c[2] - half] }; }
  function fill(g, f, out) {
    const N = g.N, a = out || new Float32Array(N * N * N); let i = 0;
    for (let z = 0; z < N; z++) { const Z = g.o[2] + z * g.h; for (let y = 0; y < N; y++) { const Y = g.o[1] + y * g.h; for (let x = 0; x < N; x++, i++) a[i] = f(g.o[0] + x * g.h, Y, Z); } }
    return a;
  }
  // 找一个阈值，使 ρ > 阈值 的区域装下 frac 的电子（对数直方图）
  function level(a, frac) {
    let mx = 0, S = 0; for (let i = 0; i < a.length; i++) { const v = a[i]; if (v > mx) mx = v; if (v > 0) S += v; }
    if (mx <= 0) return 1e9;
    const B = 600, lo = Math.log(mx) - 18, k = B / 18, H = new Float64Array(B);
    for (let i = 0; i < a.length; i++) { const v = a[i]; if (v <= 0) continue; let b = Math.floor((Math.log(v) - lo) * k); if (b < 0) continue; if (b >= B) b = B - 1; H[b] += v; }
    let acc = 0; for (let b = B - 1; b >= 0; b--) { acc += H[b]; if (acc >= frac * S) return Math.exp(lo + b / k); }
    return Math.exp(lo);
  }
  const CO = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
  const TETS = [[0, 5, 1, 6], [0, 1, 2, 6], [0, 2, 3, 6], [0, 3, 7, 6], [0, 7, 4, 6], [0, 4, 5, 6]];
  // 行进四面体。groups: [{a: Float32Array, c: [r,g,b]}] 用来给顶点上色；cut(x,y,z) 为真的格子跳过（剖开）
  function march(g, a, iso, groups, cut) {
    const N = g.N, NN = N * N, h = g.h, o = g.o;
    let cap = 1 << 16, P = new Float32Array(cap * 3), Nr = new Float32Array(cap * 3), Cl = new Float32Array(cap * 3), n = 0;
    const grow = () => { cap *= 2; const p2 = new Float32Array(cap * 3), n2 = new Float32Array(cap * 3), c2 = new Float32Array(cap * 3); p2.set(P); n2.set(Nr); c2.set(Cl); P = p2; Nr = n2; Cl = c2; };
    const idx = new Int32Array(8), val = new Float32Array(8), cx = new Int32Array(8), cy = new Int32Array(8), cz = new Int32Array(8);
    const gr = (x, y, z, d) => { const i = x + N * (y + N * z); if (d === 0) { const a1 = x < N - 1 ? a[i + 1] : a[i], a0 = x > 0 ? a[i - 1] : a[i]; return a1 - a0; } if (d === 1) { const a1 = y < N - 1 ? a[i + N] : a[i], a0 = y > 0 ? a[i - N] : a[i]; return a1 - a0; } const a1 = z < N - 1 ? a[i + NN] : a[i], a0 = z > 0 ? a[i - NN] : a[i]; return a1 - a0; };
    const G = groups || [];
    function vert(p, q) {
      if (n >= cap) grow();
      const t = (iso - val[p]) / ((val[q] - val[p]) || 1e-30);
      P[n * 3] = o[0] + (cx[p] + (cx[q] - cx[p]) * t) * h; P[n * 3 + 1] = o[1] + (cy[p] + (cy[q] - cy[p]) * t) * h; P[n * 3 + 2] = o[2] + (cz[p] + (cz[q] - cz[p]) * t) * h;
      for (let d = 0; d < 3; d++) Nr[n * 3 + d] = -(gr(cx[p], cy[p], cz[p], d) * (1 - t) + gr(cx[q], cy[q], cz[q], d) * t);
      if (G.length) { let r = 0, gg = 0, b = 0, w = 0; for (const gp of G) { const v = Math.max(0, gp.a[idx[p]] * (1 - t) + gp.a[idx[q]] * t); r += gp.c[0] * v; gg += gp.c[1] * v; b += gp.c[2] * v; w += v; } w = w || 1; Cl[n * 3] = r / w; Cl[n * 3 + 1] = gg / w; Cl[n * 3 + 2] = b / w; }
      else { Cl[n * 3] = Cl[n * 3 + 1] = Cl[n * 3 + 2] = 1; }
      n++;
    }
    for (let z = 0; z < N - 1; z++) for (let y = 0; y < N - 1; y++) for (let x = 0; x < N - 1; x++) {
      let inside = 0;
      for (let k = 0; k < 8; k++) { const X = x + CO[k][0], Y = y + CO[k][1], Z = z + CO[k][2], i = X + N * (Y + N * Z); idx[k] = i; val[k] = a[i]; cx[k] = X; cy[k] = Y; cz[k] = Z; if (val[k] > iso) inside++; }
      if (inside === 0 || inside === 8) continue;
      if (cut && cut(o[0] + (x + .5) * h, o[1] + (y + .5) * h, o[2] + (z + .5) * h)) continue;
      for (const T of TETS) {
        const ins = [], out = []; for (const k of T) (val[k] > iso ? ins : out).push(k);
        if (ins.length === 0 || ins.length === 4) continue;
        if (ins.length === 1) { vert(ins[0], out[0]); vert(ins[0], out[1]); vert(ins[0], out[2]); }
        else if (ins.length === 3) { vert(out[0], ins[0]); vert(out[0], ins[1]); vert(out[0], ins[2]); }
        else { vert(ins[0], out[0]); vert(ins[0], out[1]); vert(ins[1], out[1]); vert(ins[0], out[0]); vert(ins[1], out[1]); vert(ins[1], out[0]); }
      }
    }
    return { pos: P.subarray(0, n * 3), nor: Nr.subarray(0, n * 3), col: Cl.subarray(0, n * 3), n };
  }
  // 3D 平滑：每个方向 [1,2,1]/4，去掉网格锯齿
  function blur(a, N, pass = 1) {
    const t = new Float32Array(a.length), st = [1, N, N * N];
    for (let p = 0; p < pass; p++) for (const d of [0, 1, 2]) {
      const s = st[d];
      for (let i = 0; i < a.length; i++) { const c = d === 0 ? i % N : d === 1 ? ((i / N) | 0) % N : (i / (N * N)) | 0; const l = c > 0 ? a[i - s] : a[i], r = c < N - 1 ? a[i + s] : a[i]; t[i] = (l + 2 * a[i] + r) / 4; }
      a.set(t);
    }
    return a;
  }
  // 三线性取值
  function sample(g, a, x, y, z) {
    const N = g.N, fx = (x - g.o[0]) / g.h, fy = (y - g.o[1]) / g.h, fz = (z - g.o[2]) / g.h;
    if (fx < 0 || fy < 0 || fz < 0 || fx > N - 1 || fy > N - 1 || fz > N - 1) return 0;
    const X = Math.min(N - 2, fx | 0), Y = Math.min(N - 2, fy | 0), Z = Math.min(N - 2, fz | 0), u = fx - X, v = fy - Y, w = fz - Z, i = X + N * (Y + N * Z), NN = N * N;
    const c00 = a[i] * (1 - u) + a[i + 1] * u, c10 = a[i + N] * (1 - u) + a[i + N + 1] * u, c01 = a[i + NN] * (1 - u) + a[i + NN + 1] * u, c11 = a[i + NN + N] * (1 - u) + a[i + NN + N + 1] * u;
    return (c00 * (1 - v) + c10 * v) * (1 - w) + (c01 * (1 - v) + c11 * v) * w;
  }
  // 截面：平面 (o, u, v)，边长 2*ext；画对数密度热图 + 每半个数量级一条等高线；iso 那条线加粗
  // signed=true 时 a 为带符号的 ψ，颜色按正负
  function slice(ctx, S, g, a, groups, pl, opts = {}) {
    const img = ctx.createImageData(S, S), D = img.data, L = new Int16Array(S * S), V = new Float32Array(S * S), Cc = new Float32Array(S * S * 3);
    let mx = 0;
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
      const s = (i / (S - 1) * 2 - 1) * pl.ext, t = (1 - j / (S - 1) * 2) * pl.ext, x = pl.o[0] + pl.u[0] * s + pl.v[0] * t, y = pl.o[1] + pl.u[1] * s + pl.v[1] * t, z = pl.o[2] + pl.u[2] * s + pl.v[2] * t;
      const v = sample(g, a, x, y, z), k = j * S + i; V[k] = v; const av = opts.signed ? v * v : v; if (av > mx) mx = av;
      if (opts.signed) { const c = v >= 0 ? opts.pos : opts.neg; Cc[k * 3] = c[0]; Cc[k * 3 + 1] = c[1]; Cc[k * 3 + 2] = c[2]; }
      else if (groups && groups.length) { let r = 0, gg = 0, b = 0, w = 0; for (const gp of groups) { const q = Math.max(0, sample(g, gp.a, x, y, z)); r += gp.c[0] * q; gg += gp.c[1] * q; b += gp.c[2] * q; w += q; } w = w || 1; Cc[k * 3] = r / w; Cc[k * 3 + 1] = gg / w; Cc[k * 3 + 2] = b / w; }
      else { Cc[k * 3] = Cc[k * 3 + 1] = Cc[k * 3 + 2] = 1; }
    }
    mx = mx || 1; const dec = opts.decades || 4, isoL = opts.iso ? Math.log10((opts.signed ? opts.iso * opts.iso : opts.iso) / mx) : null;
    const lv = new Float32Array(S * S);
    for (let k = 0; k < S * S; k++) { const av = opts.signed ? V[k] * V[k] : V[k]; const l = av > 0 ? Math.log10(av / mx) : -99; lv[k] = l; L[k] = Math.max(-dec - 1, Math.floor(l)); }
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
      const k = j * S + i, l = lv[k], b = Math.max(0, Math.min(1, 1 + l / dec)), bb = Math.pow(b, 1.5);
      let r = Cc[k * 3] * bb, gg = Cc[k * 3 + 1] * bb, bl = Cc[k * 3 + 2] * bb, al = .25 + .75 * b;
      const kr = i < S - 1 ? k + 1 : k, kd = j < S - 1 ? k + S : k;
      if (L[k] > -dec - 1 && (L[k] !== L[kr] || L[k] !== L[kd])) { r = r * .45 + .5; gg = gg * .45 + .5; bl = bl * .45 + .5; al = Math.max(al, .8); }
      if (isoL !== null && ((l > isoL) !== (lv[kr] > isoL) || (l > isoL) !== (lv[kd] > isoL))) { r = 1; gg = 1; bl = 1; al = 1; }
      if (opts.signed && ((V[k] > 0) !== (V[kr] > 0) || (V[k] > 0) !== (V[kd] > 0)) && b > .05) { r = .9; gg = .9; bl = .95; al = 1; }
      const ex = Math.min(i, S - 1 - i, j, S - 1 - j) / (S * .06), rr = opts.round ? Math.hypot(i / (S - 1) * 2 - 1, j / (S - 1) * 2 - 1) : 0;
      al *= Math.min(1, ex) * (opts.round ? Math.max(0, Math.min(1, (1 - rr) / .12)) : 1);
      D[k * 4] = r * 255; D[k * 4 + 1] = gg * 255; D[k * 4 + 2] = bl * 255; D[k * 4 + 3] = al * 235;
    }
    ctx.putImageData(img, 0, 0);
  }
  // 表面着色器：实体（不透明，带高光）或外壳（菲涅耳半透明）
  function surfMat(THREE, shell) {
    return new THREE.ShaderMaterial({
      transparent: !!shell, depthWrite: !shell, clipping: true, side: THREE.DoubleSide, vertexColors: true,
      uniforms: { uA: { value: shell ? .55 : 1 }, uShell: { value: shell ? 1 : 0 } },
      vertexShader: '#include <clipping_planes_pars_vertex>\nvarying vec3 vN; varying vec3 vV; varying vec3 vC; void main(){ vC = color; vN = normalize(normalMatrix * normal); vec4 mvPosition = modelViewMatrix * vec4(position,1.0); vV = mvPosition.xyz; gl_Position = projectionMatrix * mvPosition;\n#include <clipping_planes_vertex>\n}',
      fragmentShader: `#include <clipping_planes_pars_fragment>
        uniform float uA; uniform float uShell; varying vec3 vN; varying vec3 vV; varying vec3 vC;
        void main(){
#include <clipping_planes_fragment>
          vec3 N = normalize(vN), V = normalize(-vV); float back = 1.0; if (dot(N, V) < 0.0) { N = -N; back = 0.55; }
          vec3 L1 = normalize(vec3(.5,.8,.6)), L2 = normalize(vec3(-.7,-.2,.4));
          float d = max(dot(N,L1),0.0)*.75 + max(dot(N,L2),0.0)*.25; float sp = pow(max(dot(reflect(-L1,N),V),0.0), 36.0);
          float rim = pow(1.0 - abs(dot(N,V)), 2.2);
          if (uShell > .5) { gl_FragColor = vec4(vC*(.55+.6*d) + sp*.35 + rim*.25*vC, uA*(.10 + .9*rim)); }
          else { vec3 c = vC*(.22 + .9*d)*back + sp*.45*back + rim*.18*vC; gl_FragColor = vec4(c, 1.0); } }`,
    });
  }
  function meshFrom(THREE, m, mat) {
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(m.pos.slice(), 3)); g.setAttribute('normal', new THREE.BufferAttribute(m.nor.slice(), 3)); g.setAttribute('color', new THREE.BufferAttribute(m.col.slice(), 3));
    return new THREE.Mesh(g, mat);
  }
  G.ISO = { grid, fill, level, march, sample, slice, surfMat, meshFrom, blur };
})(typeof window !== 'undefined' ? window : globalThis);
