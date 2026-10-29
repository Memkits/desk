// mol.js —— 分子与化学反应的电子云（斯莱特型轨道 + 杂化 + 定域键的 LCAO 近似）
(function (G) {
  const A0 = .529177, NST = { 1: 1, 2: 2, 3: 3, 4: 3.7, 5: 4.0 };
  const EL = {};
  // 价层斯莱特指数 ζ = Z_eff / n*（单位 bohr⁻¹）
  function el(sym) {
    if (EL[sym]) return EL[sym];
    const Z = G.EC.SYM.indexOf(sym) + 1, c = G.EC.config(Z), v = c.filter(s => s.l <= 1).pop(), n = v.n, ze = sym === 'H' ? 1 : G.EC.zeff(Z, v);
    return (EL[sym] = { sym, Z, n, ns: NST[n], zeta: ze / NST[n] });
  }
  // Γ 函数（Lanczos）与伽马分布采样（Marsaglia–Tsang）
  function lgamma(x) { const g = 7, p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; if (x < .5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x); x -= 1; let a = p[0]; const t = x + g + .5; for (let i = 1; i < 9; i++) a += p[i] / (x + i); return .5 * Math.log(2 * Math.PI) + (x + .5) * Math.log(t) - t + Math.log(a); }
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function normal(rnd) { const u = Math.max(1e-12, rnd()), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function gamma(k, rnd) { const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d); for (;;) { let x, v; do { x = normal(rnd); v = 1 + c * x; } while (v <= 0); v = v * v * v; const u = rnd(); if (u < 1 - .0331 * x ** 4 || Math.log(u) < .5 * x * x + d * (1 - v + Math.log(v))) return d * v; } }
  const C4 = 1 / Math.sqrt(4 * Math.PI), C3 = Math.sqrt(3 / (4 * Math.PI));
  // 原子轨道（杂化）：{a: 原子序号, s: s 系数, p: [x,y,z]（长度为 p 系数）}；R(r) 为斯莱特型
  function aoVal(ao, atoms, x, y, z) {
    const A = atoms[ao.a], e = el(A.el), dx = (x - A.p[0]) / A0, dy = (y - A.p[1]) / A0, dz = (z - A.p[2]) / A0, r = Math.hypot(dx, dy, dz) || 1e-9;
    const N = Math.exp((e.ns + .5) * Math.log(2 * e.zeta) - .5 * lgamma(2 * e.ns + 1));
    const R = N * Math.pow(r, e.ns - 1) * Math.exp(-e.zeta * r);
    return R * (ao.s * C4 + C3 * (ao.p[0] * dx + ao.p[1] * dy + ao.p[2] * dz) / r);
  }
  function aoSample(ao, atoms, rnd) {
    const A = atoms[ao.a], e = el(A.el), r = gamma(2 * e.ns + 1, rnd) / (2 * e.zeta) * A0;
    const pl = Math.hypot(...ao.p), mx = (Math.abs(ao.s) * C4 + C3 * pl) ** 2;
    for (;;) { const u = 2 * rnd() - 1, ph = 2 * Math.PI * rnd(), q = Math.sqrt(1 - u * u), x = q * Math.cos(ph), y = q * Math.sin(ph), z = u; const f = (ao.s * C4 + C3 * (ao.p[0] * x + ao.p[1] * y + ao.p[2] * z)) ** 2; if (f >= rnd() * mx) return [A.p[0] + x * r, A.p[1] + y * r, A.p[2] + z * r]; }
  }
  // 分子轨道 ψ = Σ cᵢ χᵢ 的精确拒绝采样（提议分布为 Σ cᵢ²|χᵢ|²，界为项数 K）
  function moSample(mo, atoms, n, rnd) {
    const out = new Float32Array(n * 4), K = mo.length, w = mo.map(t => t.c * t.c), W = w.reduce((a, b) => a + b, 0);
    let k = 0, guard = 0;
    while (k < n && guard++ < n * 400) {
      let u = rnd() * W, i = 0; while (u > w[i] && i < K - 1) { u -= w[i]; i++; }
      const p = aoSample(mo[i].ao, atoms, rnd);
      if (K > 1) { let psi = 0, q = 0; for (const t of mo) { const v = aoVal(t.ao, atoms, p[0], p[1], p[2]); psi += t.c * v; q += t.c * t.c * v * v; } if (psi * psi < rnd() * K * q) continue; out[k * 4 + 3] = psi >= 0 ? 1 : -1; }
      else out[k * 4 + 3] = aoVal(mo[0].ao, atoms, p[0], p[1], p[2]) >= 0 ? 1 : -1;
      out[k * 4] = p[0]; out[k * 4 + 1] = p[1]; out[k * 4 + 2] = p[2]; k++;
    }
    return out;
  }
  // 编译 MO 为快速求值函数 ψ(x,y,z)
  function moFn(mo, atoms) {
    const T = mo.map(t => { const A = atoms[t.ao.a], e = el(A.el); return { c: t.c, x: A.p[0], y: A.p[1], z: A.p[2], ze: e.zeta / A0, nm1: e.ns - 1, N: Math.exp((e.ns + .5) * Math.log(2 * e.zeta) - .5 * lgamma(2 * e.ns + 1)) * Math.pow(1 / A0, e.ns - 1), s: t.ao.s * C4, px: C3 * t.ao.p[0], py: C3 * t.ao.p[1], pz: C3 * t.ao.p[2] }; });
    return (x, y, z) => { let v = 0; for (const t of T) { const dx = x - t.x, dy = y - t.y, dz = z - t.z, r = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-9; v += t.c * t.N * Math.pow(r, t.nm1) * Math.exp(-t.ze * r) * (t.s + (t.px * dx + t.py * dy + t.pz * dz) / r); } return v; };
  }
  // ---------- 构造轨道的小工具 ----------
  const nrm = v => { const l = Math.hypot(...v) || 1; return v.map(x => x / l); };
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const hyb = (a, dir, sf) => ({ a, s: Math.sqrt(sf), p: nrm(dir).map(x => x * Math.sqrt(1 - sf)) });
  const S = a => ({ a, s: 1, p: [0, 0, 0] }), P = (a, dir) => hyb(a, dir, 0);
  const one = ao => [{ c: 1, ao }];
  // σ 键：两侧杂化轨道指向对方；pol = 第二个原子的系数（>1 表示电子偏向它）
  function sigma(atoms, i, j, sfi, sfj, pol = 1) { const d = sub(atoms[j].p, atoms[i].p); return [{ c: 1, ao: sfi === null ? S(i) : hyb(i, d, sfi) }, { c: pol, ao: sfj === null ? S(j) : hyb(j, d.map(x => -x), sfj) }]; }
  const pi = (i, j, dir, pol = 1) => [{ c: 1, ao: P(i, dir) }, { c: pol, ao: P(j, dir) }];
  const TET = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(nrm);
  const at = (el, p) => ({ el, p });
  const sh = (p, d) => [p[0] + d[0], p[1] + d[1], p[2] + d[2]];
  const scl = (v, s) => v.map(x => x * s);
  // 水分子：O 在 o，两个 H 在 xy 平面内，孤对电子朝 −x 并向 ±z 张开
  function waterGeo(o, rOH = .96, ang = 104.5, rot = 0) {
    const h = ang / 2 * Math.PI / 180, c = Math.cos(rot), s = Math.sin(rot), R = v => [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]];
    return { h1: sh(o, R([rOH * Math.cos(h), rOH * Math.sin(h), 0])), h2: sh(o, R([rOH * Math.cos(h), -rOH * Math.sin(h), 0])), l1: nrm(R([-.55, 0, .83])), l2: nrm(R([-.55, 0, -.83])) };
  }
  // 三角锥（NH₃ / H₃O⁺）：中心 c，三个 H 在下方，孤对朝 +x
  function pyramid(c, r = 1.01, tilt = 112) { const t = tilt * Math.PI / 180; return [0, 1, 2].map(k => { const ph = k * 2 * Math.PI / 3; return sh(c, [r * Math.cos(t), r * Math.sin(t) * Math.cos(ph), r * Math.sin(t) * Math.sin(ph)]); }); }

  // ---------- 反应库 ----------
  // 每个反应：atoms0 / atoms1（同样顺序的原子，起止坐标），tracks：电子从哪个轨道到哪个轨道
  // track = {e: 电子数, from: MO, to: MO, src: 电子来源原子, k: 类型}；MO 在各自状态的原子坐标下定义
  const R = [];
  // 1 氢分子
  (() => { const a0 = [at('H', [-2.6, 0, 0]), at('H', [2.6, 0, 0])], a1 = [at('H', [-.37, 0, 0]), at('H', [.37, 0, 0])];
    R.push({ id: 'h2', name: '氢原子结合成氢分子', eq: 'H· + ·H → H–H', kind: '共价键', atoms0: a0, atoms1: a1,
      tracks: [{ e: 1, src: 0, k: 'ao', from: one(S(0)), to: sigma(a1, 0, 1, null, null), k1: 'σ' }, { e: 1, src: 1, k: 'ao', from: one(S(1)), to: sigma(a1, 0, 1, null, null), k1: 'σ' }],
      steps: ['两个氢原子各带一个 1s 电子，自旋相反', '靠近后两团电子云重叠', '电子集中到两个原子核之间：σ 键，键长 0.74 Å'] }); })();
  // 2 氟化氢（极性键）
  (() => { const a0 = [at('H', [-2.8, 0, 0]), at('F', [1.2, 0, 0])], a1 = [at('H', [-.46, 0, 0]), at('F', [.46, 0, 0])];
    R.push({ id: 'hf', name: '氢与氟：极性共价键', eq: 'H· + ·F → H–F', kind: '极性键', atoms0: a0, atoms1: a1,
      tracks: [{ e: 1, src: 0, k: 'ao', from: one(S(0)), to: sigma(a1, 0, 1, null, .15, 1.6), k1: 'σ' }, { e: 1, src: 1, k: 'ao', from: one(P(1, [-1, 0, 0])), to: sigma(a1, 0, 1, null, .15, 1.6), k1: 'σ' },
        { e: 2, src: 1, k: 'lp', from: one(S(1)), to: one(hyb(1, [1, 0, 0], .85)), k1: 'lp' }, { e: 2, src: 1, k: 'lp', from: one(P(1, [0, 1, 0])), to: one(P(1, [0, 1, 0])), k1: 'lp' }, { e: 2, src: 1, k: 'lp', from: one(P(1, [0, 0, 1])), to: one(P(1, [0, 0, 1])), k1: 'lp' }],
      steps: ['氟有 7 个价电子，其中一个 2p 轨道只有一个电子', '氢的 1s 与氟的 2p 重叠成键', '氟的电负性大，成键电子偏向氟：一端带部分负电，一端带部分正电'] }); })();
  // 3 氯化钠（电子转移）
  (() => { const a0 = [at('Na', [-3.2, 0, 0]), at('Cl', [3.0, 0, 0])], a1 = [at('Na', [-1.18, 0, 0]), at('Cl', [1.18, 0, 0])];
    R.push({ id: 'nacl', name: '钠与氯：电子转移', eq: 'Na· + ·Cl → Na⁺ Cl⁻', kind: '离子键', atoms0: a0, atoms1: a1,
      tracks: [{ e: 1, src: 0, k: 'ao', from: one(S(0)), to: one(P(1, [-1, 0, 0])), k1: 'lp' }, { e: 1, src: 1, k: 'ao', from: one(P(1, [-1, 0, 0])), to: one(P(1, [-1, 0, 0])), k1: 'lp' },
        { e: 2, src: 1, k: 'lp', from: one(S(1)), to: one(S(1)), k1: 'lp' }, { e: 2, src: 1, k: 'lp', from: one(P(1, [0, 1, 0])), to: one(P(1, [0, 1, 0])), k1: 'lp' }, { e: 2, src: 1, k: 'lp', from: one(P(1, [0, 0, 1])), to: one(P(1, [0, 0, 1])), k1: 'lp' }],
      steps: ['钠的 3s 电子离核远、束缚松（电离能 5.1 eV）', '这个电子转移到氯的 3p 空位上（氯的电子亲和能 3.6 eV）', 'Na⁺ 与 Cl⁻ 靠静电吸引：离子键，电子云没有共享'] }); })();
  // 4 水（两个 O–H 键 + 两对孤对电子）
  (() => { const o = [0, 0, 0], w = waterGeo(o), a0 = [at('O', o), at('H', [3.0, 2.2, 0]), at('H', [3.0, -2.2, 0])], a1 = [at('O', o), at('H', w.h1), at('H', w.h2)];
    R.push({ id: 'h2o', name: '氧与两个氢：水', eq: '2H· + ·Ö· → H₂O', kind: '共价键 · 孤对电子', atoms0: a0, atoms1: a1,
      tracks: [{ e: 1, src: 1, k: 'ao', from: one(S(1)), to: sigma(a1, 1, 0, null, .2, 1.35), k1: 'σ' }, { e: 1, src: 0, k: 'ao', from: one(P(0, [1, 1, 0])), to: sigma(a1, 1, 0, null, .2, 1.35), k1: 'σ' },
        { e: 1, src: 2, k: 'ao', from: one(S(2)), to: sigma(a1, 2, 0, null, .2, 1.35), k1: 'σ' }, { e: 1, src: 0, k: 'ao', from: one(P(0, [1, -1, 0])), to: sigma(a1, 2, 0, null, .2, 1.35), k1: 'σ' },
        { e: 2, src: 0, k: 'lp', from: one(S(0)), to: one(hyb(0, w.l1, .3)), k1: 'lp' }, { e: 2, src: 0, k: 'lp', from: one(P(0, [0, 0, 1])), to: one(hyb(0, w.l2, .3)), k1: 'lp' }],
      steps: ['氧有 6 个价电子：两个半满的 2p 轨道可以成键', '两个 O–H 键，键角 104.5°', '另外 4 个电子成为两对孤对电子，让水分子是弯的、有极性'] }); })();
  // 5 甲烷（sp³ 杂化）
  (() => { const c = [0, 0, 0], hs = TET.map(d => scl(d, 1.09)), far = TET.map(d => scl(d, 3.2)), a0 = [at('C', c), ...far.map(p => at('H', p))], a1 = [at('C', c), ...hs.map(p => at('H', p))];
    const tr = []; TET.forEach((d, k) => { tr.push({ e: 1, src: k + 1, k: 'ao', from: one(S(k + 1)), to: sigma(a1, 0, k + 1, .25, null, 1), k1: 'σ' }); tr.push({ e: 1, src: 0, k: 'ao', from: one(k === 0 ? S(0) : P(0, [[1, 0, 0], [0, 1, 0], [0, 0, 1]][k - 1])), to: sigma(a1, 0, k + 1, .25, null, 1), k1: 'σ' }); });
    R.push({ id: 'ch4', name: '碳与四个氢：甲烷', eq: 'C + 4H· → CH₄', kind: 'sp³ 杂化', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['碳的 2s 与三个 2p 混合成四个等价的 sp³ 杂化轨道', '四个杂化轨道指向正四面体的四个顶点', '各与一个氢的 1s 成键：四个 C–H 键，夹角 109.5°'] }); })();
  // 6 氮分子（三键：σ + 2π）
  (() => { const a0 = [at('N', [-2.6, 0, 0]), at('N', [2.6, 0, 0])], a1 = [at('N', [-.55, 0, 0]), at('N', [.55, 0, 0])];
    const tr = [{ e: 1, src: 0, k: 'ao', from: one(P(0, [1, 0, 0])), to: sigma(a1, 0, 1, .3, .3), k1: 'σ' }, { e: 1, src: 1, k: 'ao', from: one(P(1, [-1, 0, 0])), to: sigma(a1, 0, 1, .3, .3), k1: 'σ' },
      { e: 1, src: 0, k: 'ao', from: one(P(0, [0, 1, 0])), to: pi(0, 1, [0, 1, 0]), k1: 'π' }, { e: 1, src: 1, k: 'ao', from: one(P(1, [0, 1, 0])), to: pi(0, 1, [0, 1, 0]), k1: 'π' },
      { e: 1, src: 0, k: 'ao', from: one(P(0, [0, 0, 1])), to: pi(0, 1, [0, 0, 1]), k1: 'π' }, { e: 1, src: 1, k: 'ao', from: one(P(1, [0, 0, 1])), to: pi(0, 1, [0, 0, 1]), k1: 'π' },
      { e: 2, src: 0, k: 'lp', from: one(S(0)), to: one(hyb(0, [-1, 0, 0], .7)), k1: 'lp' }, { e: 2, src: 1, k: 'lp', from: one(S(1)), to: one(hyb(1, [1, 0, 0], .7)), k1: 'lp' }];
    R.push({ id: 'n2', name: '两个氮原子：三键', eq: '·N̈· + ·N̈· → N≡N', kind: 'σ 键 + 两个 π 键', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['每个氮有三个半满的 2p 轨道', '头对头重叠成一个 σ 键，肩并肩重叠成两个互相垂直的 π 键', '三键让 N₂ 非常稳定：键能约 945 kJ/mol'] }); })();
  // 7 二氧化碳（两个双键，π 在互相垂直的平面）
  (() => { const a0 = [at('C', [0, 0, 0]), at('O', [-3, 0, 0]), at('O', [3, 0, 0])], a1 = [at('C', [0, 0, 0]), at('O', [-1.16, 0, 0]), at('O', [1.16, 0, 0])];
    const tr = [];
    [[1, -1, [0, 1, 0]], [2, 1, [0, 0, 1]]].forEach(([o, sx, pd]) => {
      tr.push({ e: 1, src: 0, k: 'ao', from: one(o === 1 ? S(0) : P(0, [1, 0, 0])), to: sigma(a1, 0, o, .5, .3, 1.3), k1: 'σ' }, { e: 1, src: o, k: 'ao', from: one(P(o, [-sx, 0, 0])), to: sigma(a1, 0, o, .5, .3, 1.3), k1: 'σ' });
      tr.push({ e: 1, src: 0, k: 'ao', from: one(P(0, pd)), to: pi(0, o, pd, 1.3), k1: 'π' }, { e: 1, src: o, k: 'ao', from: one(P(o, pd)), to: pi(0, o, pd, 1.3), k1: 'π' });
      tr.push({ e: 2, src: o, k: 'lp', from: one(S(o)), to: one(hyb(o, [sx, 0, 0], .7)), k1: 'lp' }, { e: 2, src: o, k: 'lp', from: one(P(o, pd[1] ? [0, 0, 1] : [0, 1, 0])), to: one(P(o, pd[1] ? [0, 0, 1] : [0, 1, 0])), k1: 'lp' });
    });
    R.push({ id: 'co2', name: '碳与氧：二氧化碳', eq: 'C + O₂ → O=C=O', kind: '双键', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['碳用两个 sp 杂化轨道与两个氧形成 σ 键', '碳剩下的两个 p 轨道分别与两个氧形成 π 键', '两个 π 键所在平面互相垂直；分子是直线形'] }); })();
  // 8 氨 + 质子 → 铵离子（配位键）
  (() => { const n = [0, 0, 0], hs = pyramid(n, 1.01, 112), a0 = [at('N', n), ...hs.map(p => at('H', p)), at('H', [3.2, 0, 0])];
    const hs1 = TET.map(d => { const R2 = [[0.5774, 0.5774, 0.5774], [0.5774, -0.5774, -0.5774]]; return d; });
    const T2 = [[1, 0, 0], ...[0, 1, 2].map(k => { const t = 109.47 * Math.PI / 180, ph = k * 2 * Math.PI / 3; return [Math.cos(t), Math.sin(t) * Math.cos(ph), Math.sin(t) * Math.sin(ph)]; })];
    const a1 = [at('N', n), ...T2.slice(1).map(d => at('H', scl(d, 1.03))), at('H', scl(T2[0], 1.03))];
    const tr = []; [1, 2, 3].forEach(k => { const mo0 = sigma(a0, 0, k, .25, null, 1), mo1 = sigma(a1, 0, k, .25, null, 1); tr.push({ e: 2, src: 0, k: 'σ', from: mo0, to: mo1, k1: 'σ', mix: [0, k] }); });
    tr.push({ e: 2, src: 0, k: 'lp', from: one(hyb(0, [1, 0, 0], .3)), to: sigma(a1, 0, 4, .25, null, 1), k1: 'σ' });
    R.push({ id: 'nh4', name: '氨接住一个质子：铵离子', eq: 'NH₃ + H⁺ → NH₄⁺', kind: '配位键', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['氨分子的氮上有一对孤对电子，H⁺ 没有电子', 'H⁺ 落在孤对电子上，这对电子变成新的 N–H 键', '两个电子都来自氮，这叫配位键；成键后四个 N–H 键完全等价'] }); })();
  // 9 水 + 质子 → 水合氢离子（酸）
  (() => { const o = [0, 0, 0], w = waterGeo(o), a0 = [at('O', o), at('H', w.h1), at('H', w.h2), at('H', [-3.2, 0, 1.6])];
    const hs = pyramid(o, .98, 112).map(p => [p[0], p[1], p[2]]), a1 = [at('O', o), at('H', hs[0]), at('H', hs[1]), at('H', hs[2])];
    const tr = [{ e: 2, src: 0, k: 'σ', from: sigma(a0, 0, 1, .2, null, .75), to: sigma(a1, 0, 1, .25, null, .75), k1: 'σ' }, { e: 2, src: 0, k: 'σ', from: sigma(a0, 0, 2, .2, null, .75), to: sigma(a1, 0, 2, .25, null, .75), k1: 'σ' },
      { e: 2, src: 0, k: 'lp', from: one(hyb(0, w.l1, .3)), to: sigma(a1, 0, 3, .25, null, .75), k1: 'σ' }, { e: 2, src: 0, k: 'lp', from: one(hyb(0, w.l2, .3)), to: one(hyb(0, [-1, 0, 0], .3)), k1: 'lp' }];
    R.push({ id: 'h3o', name: '水接住质子：水合氢离子', eq: 'H₂O + H⁺ → H₃O⁺', kind: '酸 · 配位键', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['酸性溶液里的 H⁺ 不会单独存在', '它落在水分子的一对孤对电子上', '形成三角锥形的 H₃O⁺，剩下一对孤对电子'] }); })();
  // 10 中和：H₃O⁺ + OH⁻ → 2 H₂O（质子转移）
  (() => { const oa = [-1.5, 0, 0], ob = [1.5, 0, 0], hs = pyramid(oa, .98, 112).map(p => [2 * oa[0] - p[0], p[1], p[2]]);
    // H₃O⁺ 的一个 H（hs[0]）朝向 OH⁻
    const a0 = [at('O', [-2.6, 0, 0]), at('H', sh([-2.6, 0, 0], [.98, 0, 0])), at('H', sh([-2.6, 0, 0], [-.35, .91, 0])), at('H', sh([-2.6, 0, 0], [-.35, -.46, .79])), at('O', [1.6, 0, 0]), at('H', [2.55, 0, .2])];
    const wa = waterGeo([-1.8, 0, 0], .96, 104.5, Math.PI), a1 = [at('O', [-1.8, 0, 0]), at('H', [-.1, 0, 0]), at('H', sh([-1.8, 0, 0], [-.35, .91, 0])), at('H', sh([-1.8, 0, 0], [-.35, -.46, .79])), at('O', [.85, 0, 0]), at('H', [1.6, 0, .55])];
    const tr = [{ e: 2, src: 0, k: 'σ', from: sigma(a0, 0, 1, .25, null, .75), to: one(hyb(0, [1, 0, 0], .3)), k1: 'lp' },
      { e: 2, src: 0, k: 'σ', from: sigma(a0, 0, 2, .25, null, .75), to: sigma(a1, 0, 2, .25, null, .75), k1: 'σ' }, { e: 2, src: 0, k: 'σ', from: sigma(a0, 0, 3, .25, null, .75), to: sigma(a1, 0, 3, .25, null, .75), k1: 'σ' },
      { e: 2, src: 4, k: 'lp', from: one(hyb(4, [-1, 0, 0], .3)), to: sigma(a1, 4, 1, .25, null, .75), k1: 'σ' }, { e: 2, src: 4, k: 'σ', from: sigma(a0, 4, 5, .25, null, .75), to: sigma(a1, 4, 5, .25, null, .75), k1: 'σ' },
      { e: 2, src: 4, k: 'lp', from: one(hyb(4, [.2, 1, -.3], .3)), to: one(hyb(4, [.2, 1, -.3], .3)), k1: 'lp' }, { e: 2, src: 4, k: 'lp', from: one(hyb(4, [.2, -1, -.3], .3)), to: one(hyb(4, [.2, -.6, -1], .3)), k1: 'lp' },
      { e: 2, src: 0, k: 'lp', from: one(hyb(0, [-.6, -.2, -.8], .3)), to: one(hyb(0, [-.6, -.2, -.8], .3)), k1: 'lp' }];
    R.push({ id: 'neut', name: '酸碱中和：质子转移', eq: 'H₃O⁺ + OH⁻ → 2H₂O', kind: '质子转移', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['OH⁻ 的孤对电子伸向 H₃O⁺ 的一个氢', '氢原子核（质子）跳到 OH⁻ 上，带不走电子', '原来那根 O–H 键的两个电子留在左边的氧上，成为孤对电子'] }); })();
  // 11 氯气均裂（光照）
  (() => { const a0 = [at('Cl', [-1.0, 0, 0]), at('Cl', [1.0, 0, 0])], a1 = [at('Cl', [-2.8, 0, 0]), at('Cl', [2.8, 0, 0])];
    const tr = [{ e: 1, src: 0, k: 'σ', from: sigma(a0, 0, 1, .15, .15), to: one(P(0, [1, 0, 0])), k1: 'ao' }, { e: 1, src: 1, k: 'σ', from: sigma(a0, 0, 1, .15, .15), to: one(P(1, [-1, 0, 0])), k1: 'ao' }];
    [0, 1].forEach(a => { [[0, 1, 0], [0, 0, 1]].forEach(d => tr.push({ e: 2, src: a, k: 'lp', from: one(P(a, d)), to: one(P(a, d)), k1: 'lp' })); tr.push({ e: 2, src: a, k: 'lp', from: one(S(a)), to: one(S(a)), k1: 'lp' }); });
    R.push({ id: 'cl2', name: '氯气在光照下均裂', eq: 'Cl–Cl → Cl· + ·Cl', kind: '均裂 · 自由基', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['紫外光把 Cl–Cl 键的能量（约 243 kJ/mol）补足', '成键的两个电子一边一个', '得到两个各带一个未成对电子的氯原子：自由基'] }); })();
  // 12 氯化氢在水中电离（异裂）
  (() => { const a0 = [at('Cl', [-1.27, 0, 0]), at('H', [0, 0, 0]), at('O', [2.4, 0, 0]), at('H', [2.9, .8, 0]), at('H', [2.9, -.8, 0])];
    const a1 = [at('Cl', [-2.6, 0, 0]), at('H', [.95, 0, 0]), at('O', [1.9, 0, 0]), at('H', [2.3, .8, .35]), at('H', [2.3, -.8, .35])];
    const tr = [{ e: 2, src: 0, k: 'σ', from: sigma(a0, 1, 0, null, .15, 1.4), to: one(P(0, [1, 0, 0])), k1: 'lp' },
      { e: 2, src: 2, k: 'lp', from: one(hyb(2, [-1, 0, 0], .3)), to: sigma(a1, 1, 2, null, .25, 1.35), k1: 'σ' },
      { e: 2, src: 2, k: 'σ', from: sigma(a0, 2, 3, .25, null, .75), to: sigma(a1, 2, 3, .25, null, .75), k1: 'σ' }, { e: 2, src: 2, k: 'σ', from: sigma(a0, 2, 4, .25, null, .75), to: sigma(a1, 2, 4, .25, null, .75), k1: 'σ' }];
    [[0, 1, 0], [0, 0, 1]].forEach(d => tr.push({ e: 2, src: 0, k: 'lp', from: one(P(0, d)), to: one(P(0, d)), k1: 'lp' }));
    tr.push({ e: 2, src: 0, k: 'lp', from: one(S(0)), to: one(S(0)), k1: 'lp' }, { e: 2, src: 2, k: 'lp', from: one(hyb(2, [-.3, 0, -1], .3)), to: one(hyb(2, [-.3, 0, -1], .3)), k1: 'lp' });
    R.push({ id: 'hcl', name: '氯化氢溶于水', eq: 'HCl + H₂O → Cl⁻ + H₃O⁺', kind: '异裂 · 电离', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['H–Cl 键的电子本来就偏向氯', '水分子的孤对电子接住氢', '成键的两个电子全部留给氯，得到 Cl⁻：这叫异裂'] }); })();
  // 13 乙烯与溴加成（π 键打开）
  (() => { const c1 = [-.67, 0, 0], c2 = [.67, 0, 0], hp = (c, sx, sy) => sh(c, [sx * .55, sy * .93, 0]);
    const a0 = [at('C', c1), at('C', c2), at('H', hp(c1, -1, 1)), at('H', hp(c1, -1, -1)), at('H', hp(c2, 1, 1)), at('H', hp(c2, 1, -1)), at('Br', [-1.2, 0, 3.2]), at('Br', [1.2, 0, 3.2])];
    const d1 = [-.77, 0, 0], d2 = [.77, 0, 0], h3 = (c, sx, sy) => sh(c, [sx * .4, sy * .9, -.35]);
    const a1 = [at('C', d1), at('C', d2), at('H', h3(d1, -1, 1)), at('H', h3(d1, -1, -1)), at('H', h3(d2, 1, 1)), at('H', h3(d2, 1, -1)), at('Br', sh(d1, [-.45, 0, 1.88])), at('Br', sh(d2, [.45, 0, 1.88]))];
    const tr = [{ e: 2, src: 0, k: 'π', from: pi(0, 1, [0, 0, 1]), to: sigma(a1, 0, 6, .25, .15, 1.2), k1: 'σ', note: 'π' },
      { e: 2, src: 6, k: 'σ', from: sigma(a0, 6, 7, .15, .15), to: sigma(a1, 1, 7, .25, .15, 1.2), k1: 'σ' },
      { e: 2, src: 0, k: 'σ', from: sigma(a0, 0, 1, .33, .33), to: sigma(a1, 0, 1, .25, .25), k1: 'σ' }];
    [[0, 2], [0, 3], [1, 4], [1, 5]].forEach(([c, h]) => tr.push({ e: 2, src: c, k: 'σ', from: sigma(a0, c, h, .33, null), to: sigma(a1, c, h, .25, null), k1: 'σ' }));
    [6, 7].forEach(b => { tr.push({ e: 2, src: b, k: 'lp', from: one(S(b)), to: one(S(b)), k1: 'lp' }, { e: 2, src: b, k: 'lp', from: one(P(b, [0, 1, 0])), to: one(P(b, [0, 1, 0])), k1: 'lp' }, { e: 2, src: b, k: 'lp', from: one(P(b, [0, 0, 1])), to: one(P(b, [b === 6 ? -1 : 1, 0, .3])), k1: 'lp' }); });
    R.push({ id: 'c2h4br2', name: '乙烯与溴加成', eq: 'CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br', kind: 'π 键打开', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['C=C 双键里有一个 π 键，电子云在分子平面上下', 'π 电子比 σ 电子更外露，容易被进攻', 'π 键打开，两个碳各接上一个溴：双键变单键（真实机理经过溴鎓离子，这里只画始末）'] }); })();
  // 14 甲烷与氯自由基（夺氢）
  (() => { const c = [0, 0, 0], hs = TET.map(d => scl(d, 1.09)), cl0 = scl(TET[0], 3.4);
    const a0 = [at('C', c), ...hs.map(p => at('H', p)), at('Cl', cl0)];
    const a1 = [at('C', c), at('H', scl(TET[0], 2.3)), ...[1, 2, 3].map(k => { const d = TET[k], t = nrm(sh(d, scl(TET[0], .34))); return at('H', scl(t, 1.08)); }), at('Cl', scl(TET[0], 3.57))];
    const tr = [{ e: 1, src: 0, k: 'σ', from: sigma(a0, 0, 1, .25, null), to: one(P(0, TET[0])), k1: 'ao' }, { e: 1, src: 1, k: 'σ', from: sigma(a0, 0, 1, .25, null), to: sigma(a1, 1, 5, null, .15, 1.3), k1: 'σ' },
      { e: 1, src: 5, k: 'ao', from: one(P(5, scl(TET[0], -1))), to: sigma(a1, 1, 5, null, .15, 1.3), k1: 'σ' }];
    [2, 3, 4].forEach(k => tr.push({ e: 2, src: 0, k: 'σ', from: sigma(a0, 0, k, .25, null), to: sigma(a1, 0, k, .33, null), k1: 'σ' }));
    const pa = nrm([1, -1, 0]), pb = nrm([1, 1, -2]); tr.push({ e: 2, src: 5, k: 'lp', from: one(S(5)), to: one(S(5)), k1: 'lp' }, { e: 2, src: 5, k: 'lp', from: one(P(5, pa)), to: one(P(5, pa)), k1: 'lp' }, { e: 2, src: 5, k: 'lp', from: one(P(5, pb)), to: one(P(5, pb)), k1: 'lp' });
    R.push({ id: 'ch4cl', name: '氯自由基夺走甲烷的氢', eq: 'CH₄ + Cl· → ·CH₃ + HCl', kind: '自由基反应', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['氯自由基有一个未成对电子', '它从甲烷上拉走一个氢原子（连同一个电子）', '碳上留下一个未成对电子：甲基自由基，链式反应继续'] }); })();
  // 16 苯：三个定域 π 键 → 离域 π 环
  (() => { const ring = k => { const t = k * Math.PI / 3; return [Math.cos(t), Math.sin(t)]; };
    const a = []; for (let k = 0; k < 6; k++) { const [c, s] = ring(k); a.push(at('C', [1.39 * c, 1.39 * s, 0])); } for (let k = 0; k < 6; k++) { const [c, s] = ring(k); a.push(at('H', [2.47 * c, 2.47 * s, 0])); }
    const z = [0, 0, 1], pk = (k, c) => ({ c, ao: P(k, z) });
    const mo = [[0, 1, 2, 3, 4, 5].map(k => pk(k, 1)), [0, 1, 2, 3, 4, 5].map(k => pk(k, Math.cos(k * Math.PI / 3))), [1, 2, 4, 5].map(k => pk(k, Math.sin(k * Math.PI / 3)))];
    const tr = []; [[0, 1], [2, 3], [4, 5]].forEach(([i, j], m) => { tr.push({ e: 1, src: i, k: 'π', from: pi(i, j, z), to: mo[m], k1: 'π' }, { e: 1, src: j, k: 'π', from: pi(i, j, z), to: mo[m], k1: 'π' }); });
    R.push({ id: 'benz', name: '苯：π 电子绕成一个环', eq: '凯库勒式 C₆H₆ → 离域 π 体系', kind: '离域 · 共轭', atoms0: a, atoms1: a, tracks: tr,
      steps: ['如果只看凯库勒式，6 个 π 电子被关在三个双键里', '实际上 6 个 p 轨道肩并肩连成一圈，π 电子分布在整个环的上下两面', '离域让苯格外稳定，六个 C–C 键长完全相等（1.39 Å）'] }); })();
  // 17 金属钠：价电子变成电子海
  (() => { const d = 3.7, sq = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, y]) => [x * d / 2, y * d / 2, 0]);
    const a0 = sq.map(p => at('Na', p.map(v => v * 1.9))), a1 = sq.map(p => at('Na', p));
    const mo1 = [0, 1, 2, 3].map(k => ({ c: 1, ao: S(k) })), mo2 = [0, 1, 2, 3].map(k => ({ c: k < 2 ? 1 : -1, ao: S(k) }));
    const tr = [0, 1, 2, 3].map(k => ({ e: 1, src: k, k: 'ao', from: one(S(k)), to: k < 2 ? mo1 : mo2, k1: 'σ' }));
    R.push({ id: 'na4', name: '钠原子聚成金属：电子海', eq: '4 Na· → Na₄（金属键示意）', kind: '金属键', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['每个钠原子只有一个松散的 3s 电子', '原子靠近后，3s 轨道互相重叠，电子不再属于某一个原子', '大量原子时这些电子形成“电子海”，所以金属导电、有光泽、能延展'] }); })();
  // ===== 更多有代表性的反应 =====
  const rotYp = (c, ang) => p => { const x = p[0] - c[0], z = p[2] - c[2], C = Math.cos(ang), S2 = Math.sin(ang); return [c[0] + x * C + z * S2, p[1], c[2] - x * S2 + z * C]; };
  const two = (src1, src2, from, to, k, k1) => [{ e: 1, src: src1, k, from, to, k1 }, { e: 1, src: src2, k, from, to, k1 }];
  // 18 SN2：氢氧根从背面进攻，溴离子离开，构型翻转（瓦尔登翻转）
  (() => { const tet = (sx, ph) => { const t = 109.47 * Math.PI / 180; return [sx * Math.cos(Math.PI - t) * -1 * -1, 0, 0].map((_, i) => i === 0 ? -sx * .334 * 1.09 : i === 1 ? .943 * 1.09 * Math.cos(ph) : .943 * 1.09 * Math.sin(ph)); };
    const phs = [0, 2 * Math.PI / 3, 4 * Math.PI / 3];
    // 0 C, 1-3 H, 4 Br, 5 O, 6 H(O)
    const a0 = [at('C', [0, 0, 0]), ...phs.map(p => at('H', tet(1, p))), at('Br', [1.94, 0, 0]), at('O', [-3.3, 0, 0]), at('H', [-4.2, .35, 0])];
    const a1 = [at('C', [0, 0, 0]), ...phs.map(p => at('H', tet(-1, p))), at('Br', [3.6, 0, 0]), at('O', [-1.43, 0, 0]), at('H', [-1.75, .9, 0])];
    const tr = [];
    [1, 2, 3].forEach(h => tr.push(...two(0, h, sigma(a0, 0, h, .25, null), sigma(a1, 0, h, .25, null), 'σ', 'σ')));
    tr.push(...two(0, 4, sigma(a0, 0, 4, .25, .15, 1.2), one(hyb(4, [-1, 0, 0], .15)), 'σ', 'lp'));
    tr.push({ e: 2, src: 4, k: 'lp', from: one(hyb(4, [1, 0, 0], .6)), to: one(hyb(4, [1, 0, 0], .6)), k1: 'lp' }, { e: 2, src: 4, k: 'lp', from: one(P(4, [0, 1, 0])), to: one(P(4, [0, 1, 0])), k1: 'lp' }, { e: 2, src: 4, k: 'lp', from: one(P(4, [0, 0, 1])), to: one(P(4, [0, 0, 1])), k1: 'lp' });
    tr.push({ e: 2, src: 5, k: 'lp', from: one(hyb(5, [1, 0, 0], .3)), to: sigma(a1, 5, 0, .3, .25, .8), k1: 'σ' });
    tr.push({ e: 2, src: 5, k: 'lp', from: one(P(5, [0, 0, 1])), to: one(hyb(5, [-.3, -.55, .78], .3)), k1: 'lp' }, { e: 2, src: 5, k: 'lp', from: one(P(5, [.2, -1, 0])), to: one(hyb(5, [-.3, -.55, -.78], .3)), k1: 'lp' });
    tr.push(...two(5, 6, sigma(a0, 5, 6, .2, null, .75), sigma(a1, 5, 6, .25, null, .75), 'σ', 'σ'));
    R.push({ id: 'sn2', name: '亲核取代 SN2：背面进攻', eq: 'HO⁻ + CH₃Br → HOCH₃ + Br⁻', kind: '有机机理 · 构型翻转', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['OH⁻ 带一对“多余”的孤对电子，从溴的正对面接近碳', '孤对电子变成新的 C–O 键，同时 C–Br 键的电子整对退到溴上', '三个氢像被风吹翻的伞一样翻到另一边；溴带着两个电子成为 Br⁻ 离开'] }); })();
  // 19 狄尔斯–阿尔德：6 个 π 电子同时重排成两个新 σ 键和一个新 π 键
  (() => { const z0 = 1.75;
    const a0 = [at('C', [-1.4, -.75, z0]), at('C', [-.68, .45, z0]), at('C', [.68, .45, z0]), at('C', [1.4, -.75, z0]), at('C', [.67, -1.05, -z0]), at('C', [-.67, -1.05, -z0])];
    const a1 = [at('C', [-1.35, -.75, .45]), at('C', [-.68, .5, .15]), at('C', [.68, .5, .15]), at('C', [1.35, -.75, .45]), at('C', [.77, -1.4, -.85]), at('C', [-.77, -1.4, -.85])];
    const z = [0, 0, 1], pn = nrm([0, -.35, 1]);
    const p12 = pi(0, 1, z), p34 = pi(2, 3, z), p56 = pi(4, 5, z), s16 = sigma(a1, 0, 5, .25, .25), s45 = sigma(a1, 3, 4, .25, .25), p23 = pi(1, 2, pn);
    const tr = [{ e: 1, src: 0, k: 'π', from: p12, to: s16, k1: 'σ' }, { e: 1, src: 1, k: 'π', from: p12, to: p23, k1: 'π' }, { e: 1, src: 2, k: 'π', from: p34, to: p23, k1: 'π' },
      { e: 1, src: 3, k: 'π', from: p34, to: s45, k1: 'σ' }, { e: 1, src: 4, k: 'π', from: p56, to: s45, k1: 'σ' }, { e: 1, src: 5, k: 'π', from: p56, to: s16, k1: 'σ' }];
    R.push({ id: 'da', name: '狄尔斯–阿尔德：六个 π 电子一起转圈', eq: '丁二烯 + 乙烯 → 环己烯', kind: '周环反应 · 协同', atoms0: a0, atoms1: a1, tracks: tr, only: '只画参与反应的 6 个 π 电子，氢原子和 σ 骨架省略',
      steps: ['上面是丁二烯（两个 π 键），下面是乙烯（一个 π 键），p 轨道上下相对', '三对 π 电子同时移动，不经过离子或自由基：协同反应', '结果是两个新的 C–C σ 键和中间一个新的 π 键，闭合成六元环'] }); })();
  // 20 路易斯酸碱：BF₃ 的空 p 轨道接住 NH₃ 的孤对电子
  (() => { const F3 = k => { const f = Math.PI / 2 + k * 2 * Math.PI / 3; return [Math.cos(f), Math.sin(f)]; };
    const n0 = [-3.4, 0, 0], n1 = [-1.65, 0, 0];
    // 0 B, 1-3 F, 4 N, 5-7 H
    const a0 = [at('B', [0, 0, 0]), ...[0, 1, 2].map(k => at('F', [0, 1.31 * F3(k)[0], 1.31 * F3(k)[1]])), at('N', n0), ...pyramid(n0).map(p => at('H', p))];
    const a1 = [at('B', [0, 0, 0]), ...[0, 1, 2].map(k => at('F', [.44, 1.23 * F3(k)[0], 1.23 * F3(k)[1]])), at('N', n1), ...pyramid(n1).map(p => at('H', p))];
    const tr = [{ e: 2, src: 4, k: 'lp', from: one(hyb(4, [1, 0, 0], .3)), to: sigma(a1, 4, 0, .3, .3, .55), k1: 'σ' }];
    [1, 2, 3].forEach(f => { tr.push(...two(0, f, sigma(a0, 0, f, .33, .3, 1.6), sigma(a1, 0, f, .25, .3, 1.6), 'σ', 'σ'));
      const d0 = nrm(a0[f].p), d1 = nrm(sub(a1[f].p, [0, 0, 0])), t = nrm([0, -a0[f].p[2], a0[f].p[1]]);
      tr.push({ e: 2, src: f, k: 'lp', from: one(hyb(f, d0, .7)), to: one(hyb(f, d1, .7)), k1: 'lp' }, { e: 2, src: f, k: 'lp', from: one(P(f, [1, 0, 0])), to: one(P(f, [1, 0, 0])), k1: 'lp' }, { e: 2, src: f, k: 'lp', from: one(P(f, t)), to: one(P(f, t)), k1: 'lp' }); });
    [5, 6, 7].forEach(h => tr.push(...two(4, h, sigma(a0, 4, h, .25, null), sigma(a1, 4, h, .25, null), 'σ', 'σ')));
    R.push({ id: 'bf3', name: '路易斯酸碱：空轨道接住孤对电子', eq: 'BF₃ + :NH₃ → F₃B–NH₃', kind: '配位键 · 路易斯酸碱', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['硼只有 6 个价电子，垂直于 BF₃ 平面有一个空的 2p 轨道', '氨的孤对电子正对着这个空轨道靠近', '一对电子被共享，形成 B–N 配位键；BF₃ 从平面变成三角锥'] }); })();
  // 21 负氢进攻羰基：π 键的电子退到氧上
  (() => { // 0 C, 1 O, 2 H, 3 H, 4 H⁻
    const a0 = [at('C', [0, 0, 0]), at('O', [1.21, 0, 0]), at('H', [-.55, .94, 0]), at('H', [-.55, -.94, 0]), at('H', [-.7, 0, 3.0])];
    const a1 = [at('C', [0, 0, 0]), at('O', [1.36, 0, 0]), at('H', [-.36, .89, -.5]), at('H', [-.36, -.89, -.5]), at('H', [-.36, 0, 1.03])];
    const tr = [{ e: 2, src: 4, k: 'lp', from: one(S(4)), to: sigma(a1, 0, 4, .25, null), k1: 'σ' }];
    tr.push(...two(0, 1, pi(0, 1, [0, 0, 1], 1.4), one(P(1, [0, 0, 1])), 'π', 'lp'));
    tr.push(...two(0, 1, sigma(a0, 0, 1, .33, .3, 1.3), sigma(a1, 0, 1, .25, .3, 1.3), 'σ', 'σ'));
    [2, 3].forEach(h => tr.push(...two(0, h, sigma(a0, 0, h, .33, null), sigma(a1, 0, h, .25, null), 'σ', 'σ')));
    tr.push({ e: 2, src: 1, k: 'lp', from: one(hyb(1, [.5, .87, 0], .4)), to: one(hyb(1, [.5, .87, 0], .4)), k1: 'lp' }, { e: 2, src: 1, k: 'lp', from: one(hyb(1, [.5, -.87, 0], .4)), to: one(hyb(1, [.5, -.87, 0], .4)), k1: 'lp' });
    R.push({ id: 'hco', name: '负氢加到羰基上：π 键被推开', eq: 'H⁻ + H₂C=O → H₃C–O⁻', kind: '有机机理 · 亲核加成', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['C=O 的 π 电子偏向氧，碳一侧电子稀薄，从上方看是个“缺口”', 'H⁻ 的一对电子从上方进攻碳，形成新的 C–H 键', '原来 π 键的两个电子被整对推到氧上，氧带上负电荷；碳从平面变成四面体'] }); })();
  // 22 氢键：两个水分子之间
  (() => { const o1 = [0, 0, 0], h1 = [.96, 0, 0], h2 = [-.24, .93, 0];
    const mk = d => { const o2 = [d, 0, 0], w = waterGeo(o2), r = rotYp(o2, -.98), rd = rotYp([0, 0, 0], -.98); return { o2, H: [r(w.h1), r(w.h2)], l1: rd(w.l1), l2: rd(w.l2) }; };
    const A = mk(5.2), B = mk(2.9);
    const a0 = [at('O', o1), at('H', h1), at('H', h2), at('O', A.o2), at('H', A.H[0]), at('H', A.H[1])], a1 = [at('O', o1), at('H', h1), at('H', h2), at('O', B.o2), at('H', B.H[0]), at('H', B.H[1])];
    const tr = [];
    tr.push(...two(0, 1, sigma(a0, 0, 1, .25, null, .75), sigma(a1, 0, 1, .25, null, .68), 'σ', 'σ'));
    tr.push(...two(0, 2, sigma(a0, 0, 2, .25, null, .75), sigma(a1, 0, 2, .25, null, .75), 'σ', 'σ'));
    tr.push({ e: 2, src: 0, k: 'lp', from: one(hyb(0, [-.6, -.3, .74], .3)), to: one(hyb(0, [-.6, -.3, .74], .3)), k1: 'lp' }, { e: 2, src: 0, k: 'lp', from: one(hyb(0, [-.6, -.3, -.74], .3)), to: one(hyb(0, [-.6, -.3, -.74], .3)), k1: 'lp' });
    [4, 5].forEach(h => tr.push(...two(3, h, sigma(a0, 3, h, .25, null, .75), sigma(a1, 3, h, .25, null, .75), 'σ', 'σ')));
    tr.push({ e: 2, src: 3, k: 'lp', from: one(hyb(3, A.l1, .3)), to: [{ c: 1, ao: hyb(3, B.l1, .3) }, { c: .14, ao: S(1) }], k1: 'lp' }, { e: 2, src: 3, k: 'lp', from: one(hyb(3, A.l2, .3)), to: one(hyb(3, B.l2, .3)), k1: 'lp' });
    R.push({ id: 'hb', name: '氢键：两个水分子互相拉住', eq: 'H₂O + H₂O → H₂O···H–OH', kind: '分子间作用', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['左边水分子的 H 带部分正电，右边水分子的氧有孤对电子', '孤对电子朝着这个 H 靠近，距离约 1.9 Å', '电子云只轻微偏移：氢键主要是静电吸引，强度只有共价键的十分之一左右'] }); })();
  // 23 锌置换铜：两个电子从锌跑到铜离子上
  (() => { const a0 = [at('Zn', [-2.4, 0, 0]), at('Cu', [2.4, 0, 0])], a1 = a0;
    const tr = [{ e: 1, src: 0, k: 'ao', from: one(S(0)), to: one(S(1)), k1: 'ao' }, { e: 1, src: 0, k: 'ao', from: one(S(0)), to: one(S(1)), k1: 'ao' }];
    R.push({ id: 'zncu', name: '锌置换铜：电子从一种金属跑到另一种', eq: 'Zn + Cu²⁺ → Zn²⁺ + Cu', kind: '氧化还原', atoms0: a0, atoms1: a1, tracks: tr, only: '只画转移的两个 4s 电子，3d 电子和溶液中的水分子省略',
      steps: ['锌原子外层有两个 4s 电子，束缚比较松', 'Cu²⁺ 对电子的吸引更强（标准电极电势 +0.34 V，锌是 −0.76 V）', '两个电子从锌转移到铜：锌被氧化成 Zn²⁺，铜离子被还原成铜原子'] }); })();
  // 24 乙烯吸收紫外光：一个 π 电子跳到 π*
  (() => { const a = [at('C', [-.67, 0, 0]), at('C', [.67, 0, 0]), at('H', [-1.23, .92, 0]), at('H', [-1.23, -.92, 0]), at('H', [1.23, .92, 0]), at('H', [1.23, -.92, 0])];
    const z = [0, 0, 1], piB = pi(0, 1, z), piA = [{ c: 1, ao: P(0, z) }, { c: -1, ao: P(1, z) }];
    const tr = [{ e: 1, src: 0, k: 'π', from: piB, to: piB, k1: 'π', col: '#5CE1E6' }, { e: 1, src: 1, k: 'π', from: piB, to: piA, k1: 'π*', cols: ['#5CE1E6', '#FF7AB6'] }];
    tr.push(...two(0, 1, sigma(a, 0, 1, .33, .33), sigma(a, 0, 1, .33, .33), 'σ', 'σ'));
    [[0, 2], [0, 3], [1, 4], [1, 5]].forEach(([c, h]) => tr.push(...two(c, h, sigma(a, c, h, .33, null), sigma(a, c, h, .33, null), 'σ', 'σ')));
    R.push({ id: 'uv', name: '吸收紫外光：电子跳到反键轨道', eq: 'C₂H₄ + hν → C₂H₄*（π → π*）', kind: '光激发', atoms0: a, atoms1: a, tracks: tr,
      steps: ['基态时两个 π 电子都在成键 π 轨道里，集中在两个碳之间的上下方', '吸收约 165 nm 的紫外光，一个电子跳到反键 π* 轨道', 'π* 在两个碳正中间有一个节面：电子不再把两个碳拉在一起，C=C 变弱、可以扭转'] }); })();
  // 25 酮–烯醇互变：氢从碳搬到氧，π 键跟着换位置
  (() => { // 0 C1(甲基) 1 C2 2 O 3 H1(迁移) 4 H2 5 H3 6 H4
    const a0 = [at('C', [-1.25, -.7, 0]), at('C', [0, .1, 0]), at('O', [1.05, -.5, 0]), at('H', [-.9, -1.73, 0]), at('H', [-2.15, -.35, .5]), at('H', [-1.4, -.2, -.95]), at('H', [.05, 1.2, 0])];
    const a1 = [at('C', [-1.15, -.65, 0]), at('C', [0, .05, 0]), at('O', [1.2, -.55, 0]), at('H', [1.25, -1.5, 0]), at('H', [-2.08, -.1, 0]), at('H', [-1.2, -1.74, 0]), at('H', [.05, 1.15, 0])];
    const z = [0, 0, 1], tr = [];
    tr.push(...two(0, 3, sigma(a0, 0, 3, .25, null), pi(0, 1, z), 'σ', 'π'));
    tr.push(...two(1, 2, pi(1, 2, z, 1.4), sigma(a1, 2, 3, .25, null, .75), 'π', 'σ'));
    tr.push(...two(0, 1, sigma(a0, 0, 1, .25, .33), sigma(a1, 0, 1, .33, .33), 'σ', 'σ'));
    tr.push(...two(1, 2, sigma(a0, 1, 2, .33, .3, 1.3), sigma(a1, 1, 2, .33, .3, 1.3), 'σ', 'σ'));
    tr.push(...two(1, 6, sigma(a0, 1, 6, .33, null), sigma(a1, 1, 6, .33, null), 'σ', 'σ'));
    [4, 5].forEach(h => tr.push(...two(0, h, sigma(a0, 0, h, .25, null), sigma(a1, 0, h, .33, null), 'σ', 'σ')));
    tr.push({ e: 2, src: 2, k: 'lp', from: one(hyb(2, [.4, .92, 0], .4)), to: one(hyb(2, [.6, .8, 0], .4)), k1: 'lp' }, { e: 2, src: 2, k: 'lp', from: one(hyb(2, [.7, -.7, 0], .4)), to: one(P(2, z)), k1: 'lp' });
    R.push({ id: 'keto', name: '酮–烯醇互变：氢搬家，双键换位', eq: 'CH₃–CHO ⇌ CH₂=CH–OH', kind: '有机机理 · 互变异构', atoms0: a0, atoms1: a1, tracks: tr,
      steps: ['乙醛：C=O 双键，甲基上有三个 C–H', '一个 H⁺ 从碳上离开、跑到氧上（实际需要酸或碱帮忙搬运）', '原来 C–H 键的电子变成 C=C 的 π 键，原来 C=O 的 π 电子用来连接新的 O–H'] }); })();
  // 15 铁的氧化（失电子）
  (() => { const a0 = [at('Fe', [0, 0, 0])], a1 = [at('Fe', [0, 0, 0])];
    R.push({ id: 'fe', name: '铁失去电子：氧化', eq: 'Fe → Fe²⁺ + 2e⁻', kind: '氧化', atoms0: a0, atoms1: a1, atomOnly: true,
      steps: ['铁的最外层是 4s²，3d 上有 6 个电子', '氧化时先失去的是外层的 4s 电子，不是 3d', '离子变小了：电子云收缩，Fe²⁺ 的价层是 3d⁶'], tracks: [] }); })();
  const GRP = { h2: 0, hf: 0, h2o: 0, ch4: 0, n2: 0, co2: 0, nacl: 1, fe: 1, zncu: 1, nh4: 2, h3o: 2, neut: 2, bf3: 2, cl2: 3, hcl: 3, ch4cl: 3, c2h4br2: 4, sn2: 4, hco: 4, keto: 4, da: 4, benz: 5, na4: 5, uv: 5, hb: 5 };
  const GN = ['共用电子：共价键是怎么形成的', '交出电子：离子与氧化还原', '借出孤对电子：配位与酸碱', '键的断裂：均裂与异裂', '有机反应：电子推着电子走', '特殊的电子云：离域、金属、激发、分子间'];
  const EXTRA = {
    benz: { legend: [['#FF6B6B', '原来第 1 个双键的 π 电子'], ['#FFD27A', '原来第 2 个双键的 π 电子'], ['#5CE1E6', '原来第 3 个双键的 π 电子']], col: j => ['#FF6B6B', '#FFD27A', '#5CE1E6'][j >> 1] },
    da: { legend: [['#FF6B6B', '丁二烯左边 π 键的电子'], ['#FFD27A', '丁二烯右边 π 键的电子'], ['#5CE1E6', '乙烯 π 键的电子']], col: j => ['#FF6B6B', '#FFD27A', '#5CE1E6'][j >> 1] },
    uv: { act: true, legend: [['#8FA3C0', 'σ 骨架电子'], ['#5CE1E6', 'π 电子'], ['#FF7AB6', '被激发到 π* 的电子']], col: (j, t) => t.col || t.cols ? null : '#8FA3C0' },
    sn2: { cm: 'k', act: true }, hco: { cm: 'k', act: true }, keto: { cm: 'k', act: true }, bf3: { cm: 'k', act: true }, c2h4br2: { cm: 'k', act: true }, nh4: { cm: 'k' }, h3o: { cm: 'k' },
  };
  R.forEach(r => { const x = EXTRA[r.id]; if (!x) return; if (x.legend) r.legend = x.legend; if (x.cm) r.cm = x.cm; if (x.act) r.act = true; if (x.col) r.tracks.forEach((t, j) => { const c = x.col(j, t); if (c) t.col = c; }); });
  const PL = { benz: { n: [0, 0, 1], off: .75 }, uv: { n: [0, 0, 1], off: .7 }, keto: { n: [0, 0, 1], off: .7 }, hco: { n: [0, 1, 0] }, da: { n: [1, 0, 0] }, co2: { n: [0, 0, 1] } };
  R.forEach(r => { r.grp = GRP[r.id]; if (PL[r.id]) r.plane = PL[r.id]; }); R.sort((a, b) => a.grp - b.grp);
  G.MOL = { R, GN, el, moSample, moFn, aoVal, rng };
})(typeof window !== 'undefined' ? window : globalThis);
