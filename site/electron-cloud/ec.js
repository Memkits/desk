// ec.js —— 元素电子构型 + 斯莱特屏蔽 + 类氢轨道采样（页面与视频共用）
(function (G) {
  const SYM = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og'.split(' ');
  const NAME = '氢 氦 锂 铍 硼 碳 氮 氧 氟 氖 钠 镁 铝 硅 磷 硫 氯 氩 钾 钙 钪 钛 钒 铬 锰 铁 钴 镍 铜 锌 镓 锗 砷 硒 溴 氪 铷 锶 钇 锆 铌 钼 锝 钌 铑 钯 银 镉 铟 锡 锑 碲 碘 氙 铯 钡 镧 铈 镨 钕 钷 钐 铕 钆 铽 镝 钬 铒 铥 镱 镥 铪 钽 钨 铼 锇 铱 铂 金 汞 铊 铅 铋 钋 砹 氡 钫 镭 锕 钍 镤 铀 镎 钚 镅 锔 锫 锎 锿 镄 钔 锘 铹 𬬻 𬭊 𬭳 𬭛 𬭶 鿏 𫟼 𬬭 鿔 鿭 𫓧 镆 𫟷 鿬 鿫'.split(' ');
  const LL = 'spdf';
  const ORDER = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];
  const cap = l => 2 * (2 * l + 1);
  const parse = s => ({ n: +s[0], l: LL.indexOf(s[1]) });
  // 相对马德隆顺序的例外（NIST 基态构型；Z ≥ 104 为理论预测）
  const EXC = {
    24: { '3d': 5, '4s': 1 }, 29: { '3d': 10, '4s': 1 }, 41: { '4d': 4, '5s': 1 }, 42: { '4d': 5, '5s': 1 }, 44: { '4d': 7, '5s': 1 }, 45: { '4d': 8, '5s': 1 },
    46: { '4d': 10, '5s': 0 }, 47: { '4d': 10, '5s': 1 }, 57: { '4f': 0, '5d': 1 }, 58: { '4f': 1, '5d': 1 }, 64: { '4f': 7, '5d': 1 }, 78: { '5d': 9, '6s': 1 }, 79: { '5d': 10, '6s': 1 },
    89: { '5f': 0, '6d': 1 }, 90: { '5f': 0, '6d': 2 }, 91: { '5f': 2, '6d': 1 }, 92: { '5f': 3, '6d': 1 }, 93: { '5f': 4, '6d': 1 }, 96: { '5f': 7, '6d': 1 }, 103: { '6d': 0, '7p': 1 },
  };
  function config(Z) {
    const occ = {}; let left = Z;
    for (const s of ORDER) { if (left <= 0) break; const k = Math.min(cap(parse(s).l), left); occ[s] = k; left -= k; }
    if (EXC[Z]) Object.assign(occ, EXC[Z]);
    return ORDER.filter(s => occ[s] > 0).map(s => ({ key: s, ...parse(s), e: occ[s] })).sort((a, b) => a.n - b.n || a.l - b.l);
  }
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = k => String(k).split('').map(c => SUP[c]).join('');
  const CORES = [[86, 'Rn'], [54, 'Xe'], [36, 'Kr'], [18, 'Ar'], [10, 'Ne'], [2, 'He']];
  function configStr(Z) {
    const c = config(Z); const core = CORES.find(([z]) => z < Z);
    if (!core) return c.map(s => s.key + sup(s.e)).join(' ');
    const cc = config(core[0]), ck = Object.fromEntries(cc.map(s => [s.key, s.e]));
    return `[${core[1]}] ` + c.filter(s => ck[s.key] !== s.e).map(s => s.key + sup(s.e)).join(' ');
  }
  // 斯莱特规则
  const GRP = s => (s.l <= 1 ? `${s.n}sp` : `${s.n}${LL[s.l]}`);
  const GORD = ['1sp', '2sp', '3sp', '3d', '4sp', '4d', '4f', '5sp', '5d', '5f', '6sp', '6d', '7sp'];
  function zeff(Z, target, c = config(Z)) {
    const tg = GRP(target), ti = GORD.indexOf(tg); let S = 0;
    for (const s of c) {
      const g = GRP(s), gi = GORD.indexOf(g); let k = s.e; if (s.key === target.key) k -= 1; if (k <= 0) continue;
      if (g === tg) S += (target.n === 1 ? .30 : .35) * k;
      else if (gi < ti) {
        if (target.l <= 1) S += (s.n === target.n - 1 ? .85 : s.n < target.n - 1 ? 1 : (s.n === target.n ? 1 : 0)) * k;
        else S += 1 * k;
      }
    }
    return Math.max(1, Z - S);
  }
  // 实球谐函数（未归一化，按笛卡尔方向余弦）
  const ANG = {
    0: [['', () => 1]],
    1: [['x', (x, y, z) => x], ['y', (x, y, z) => y], ['z', (x, y, z) => z]],
    2: [['z²', (x, y, z) => 3 * z * z - 1], ['xz', (x, y, z) => x * z], ['yz', (x, y, z) => y * z], ['xy', (x, y, z) => x * y], ['x²−y²', (x, y, z) => x * x - y * y]],
    3: [['z³', (x, y, z) => z * (5 * z * z - 3)], ['xz²', (x, y, z) => x * (5 * z * z - 1)], ['yz²', (x, y, z) => y * (5 * z * z - 1)], ['z(x²−y²)', (x, y, z) => z * (x * x - y * y)], ['xyz', (x, y, z) => x * y * z], ['x(x²−3y²)', (x, y, z) => x * (x * x - 3 * y * y)], ['y(3x²−y²)', (x, y, z) => y * (3 * x * x - y * y)]],
  };
  // 填充顺序（洪特规则：先单占再成对）
  function orbitals(s) {
    const m = 2 * s.l + 1, occ = new Array(m).fill(0);
    for (let k = 0; k < s.e; k++) occ[k % m] += 1;
    return ANG[s.l].map(([lab, f], i) => ({ lab: s.key + (lab ? '<sub>' + lab + '</sub>' : ''), plain: s.key + lab, f, e: occ[i] })).filter(o => o.e > 0);
  }
  function laguerre(k, a, x) { if (k === 0) return 1; let L0 = 1, L1 = 1 + a - x; for (let i = 1; i < k; i++) { const L2 = ((2 * i + 1 + a - x) * L1 - (i + a) * L0) / (i + 1); L0 = L1; L1 = L2; } return L1; }
  const A0 = .529177, NSTAR = { 1: 1, 2: 2, 3: 3, 4: 3.7, 5: 4.0, 6: 4.2, 7: 4.4 };
  // 径向函数 R(r)，r 以 Å 计
  function radial(n, l, Z) { return r => { const rho = 2 * Z * (r / A0) / n; return Math.pow(rho, l) * Math.exp(-rho / 2) * laguerre(n - l - 1, 2 * l + 1, rho); }; }
  // 径向概率分布 P(r) = r²R²（归一化）表
  function radialTable(n, l, Z, N = 600) {
    let rmax = A0 * (n * (n + 10)) / Z, R = radial(n, l, Z); const rs = [], ps = []; let s = 0;
    for (let i = 0; i <= N; i++) { const r = rmax * i / N, v = r * r * R(r) ** 2; rs.push(r); ps.push(v); s += v; }
    const dr = rmax / N; for (let i = 0; i <= N; i++) ps[i] /= s * dr;
    // 用斯莱特的有效主量子数 n* 校正尺寸：⟨r⟩ = n*(2n*+1)/(2Z_eff) a₀，保留类氢函数的节点结构
    let mr = 0; for (let i = 0; i <= N; i++) mr += rs[i] * ps[i] * dr;
    const ns = NSTAR[n], k = (A0 * ns * (2 * ns + 1) / (2 * Z)) / mr;
    for (let i = 0; i <= N; i++) { rs[i] *= k; ps[i] /= k; }
    const R0 = R; R = r => R0(r / k);
    const cdf = []; let acc = 0; for (let i = 0; i <= N; i++) { acc += ps[i] * dr; cdf.push(acc); }
    return { rs, ps, cdf, rmax: rmax * k, R, k };
  }
  // 可复现的随机数
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  // 采样一个原子的所有轨道点：返回 [{orb, n, l, pts: Float32Array(x,y,z,sign...)}]
  function sampleOrb(o, tab, np, rnd) {
    const arr = new Float32Array(np * 4);
    let fmax = 0; for (let i = 0; i < 3000; i++) { const u = 2 * rnd() - 1, ph = 2 * Math.PI * rnd(), q = Math.sqrt(1 - u * u); fmax = Math.max(fmax, o.f(q * Math.cos(ph), q * Math.sin(ph), u) ** 2); }
    fmax *= 1.05;
    for (let i = 0; i < np; i++) {
      let x, y, z, a;
      do { const u = 2 * rnd() - 1, ph = 2 * Math.PI * rnd(), q = Math.sqrt(1 - u * u); x = q * Math.cos(ph); y = q * Math.sin(ph); z = u; a = o.f(x, y, z); } while (a * a < rnd() * fmax);
      const t = rnd(); let lo = 0, hi = tab.cdf.length - 1; while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (tab.cdf[mid] < t) lo = mid; else hi = mid; }
      const r = tab.rs[lo] + (tab.rs[hi] - tab.rs[lo]) * ((t - tab.cdf[lo]) / Math.max(1e-12, tab.cdf[hi] - tab.cdf[lo]));
      const sg = Math.sign(a * tab.R(r)) || 1;
      arr[i * 4] = x * r; arr[i * 4 + 1] = y * r; arr[i * 4 + 2] = z * r; arr[i * 4 + 3] = sg;
    }
    return arr;
  }
  // 采样一个原子的所有轨道点：返回 [{key, n, l, lab, e, zeff, pts: Float32Array(x,y,z,sign,...)}]
  function sampleAtom(Z, perE = 900, maxPts = 70000, seed = 7) {
    const c = config(Z), rnd = rng(seed * 1000 + Z), tot = Math.min(perE * Z, maxPts), pe = tot / Z, out = [];
    for (const s of c) {
      const Ze = zeff(Z, s), tab = radialTable(s.n, s.l, Ze);
      for (const o of orbitals(s)) {
        const np = Math.max(60, Math.round(pe * o.e));
        out.push({ key: s.key, n: s.n, l: s.l, lab: o.lab, plain: o.plain, e: o.e, zeff: Ze, pts: sampleOrb(o, tab, np, rnd) });
      }
    }
    return out;
  }
  // 单个轨道（用于“拆开看”）
  function sampleOne(Z, key, idx, np = 6000, seed = 11) {
    const s = config(Z).find(q => q.key === key), o = orbitals(s)[idx], tab = radialTable(s.n, s.l, zeff(Z, s));
    return { key, n: s.n, l: s.l, lab: o.lab, plain: o.plain, e: o.e, pts: sampleOrb(o, tab, np, rng(seed * 7919 + Z * 131 + idx)) };
  }
  // 视频用：类氢轨道（任意 n,l）与自定义构型（离子）
  function sampleH(n, l, idx, np = 6000, seed = 5, Z = 1) { const s = { n, l, key: n + 'spdf'[l], e: 2 * (2 * l + 1) }, o = orbitals(s)[idx], tab = radialTable(n, l, Z); return { lab: o.lab, plain: o.plain, f: o.f, tab, pts: sampleOrb(o, tab, np, rng(seed * 31 + n * 7 + l * 3 + idx)) }; }
  function sampleConf(Z, conf, perE = 1500, maxPts = 60000, seed = 7) {
    const rnd = rng(seed * 1000 + Z), ne = conf.reduce((a, s) => a + s.e, 0), pe = Math.min(perE * ne, maxPts) / ne, out = [];
    for (const s of conf) { const Ze = zeff(Z, s, conf), tab = radialTable(s.n, s.l, Ze); for (const o of orbitals(s)) out.push({ key: s.key, n: s.n, l: s.l, lab: o.lab, plain: o.plain, e: o.e, zeff: Ze, pts: sampleOrb(o, tab, Math.max(60, Math.round(pe * o.e)), rnd) }); }
    return out;
  }
  // 周期表位置
  function pos(Z) {
    if (Z === 1) return [1, 1]; if (Z === 2) return [1, 18];
    const rows = [[3, 10, 2], [11, 18, 3]];
    for (const [a, b, p] of rows) if (Z >= a && Z <= b) return [p, Z - a < 2 ? Z - a + 1 : Z - a + 10];
    if (Z <= 36) return [4, Z - 18]; if (Z <= 54) return [5, Z - 36];
    if (Z >= 57 && Z <= 71) return [9, Z - 54]; if (Z >= 89 && Z <= 103) return [10, Z - 86];
    if (Z <= 56) return [6, Z - 54]; if (Z <= 86) return [6, Z - 68];
    if (Z <= 88) return [7, Z - 86]; return [7, Z - 100];
  }
  function block(Z) { if (Z === 2) return 's'; const c = config(Z), last = ORDER.filter(k => c.some(s => s.key === k)).pop(); if ((Z >= 57 && Z <= 71) || (Z >= 89 && Z <= 103)) return 'f'; return LL[parse(last).l]; }
  G.EC = { sampleH, sampleConf, SYM, NAME, config, configStr, zeff, orbitals, radialTable, sampleAtom, sampleOne, pos, block, A0, LL };
})(typeof window !== 'undefined' ? window : globalThis);
