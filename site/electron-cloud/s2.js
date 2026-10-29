// 第二集 · 走遍周期表
// 第一电离能（eV，NIST），Z = 1..86
const IE1 = [13.598, 24.587, 5.392, 9.323, 8.298, 11.260, 14.534, 13.618, 17.423, 21.565, 5.139, 7.646, 5.986, 8.152, 10.487, 10.360, 12.968, 15.760, 4.341, 6.113, 6.561, 6.828, 6.746, 6.767, 7.434, 7.902, 7.881, 7.640, 7.726, 9.394, 5.999, 7.899, 9.789, 9.752, 11.814, 14.000, 4.177, 5.695, 6.217, 6.634, 6.759, 7.092, 7.28, 7.361, 7.459, 8.337, 7.576, 8.994, 5.786, 7.344, 8.608, 9.010, 10.451, 12.130, 3.894, 5.212, 5.577, 5.539, 5.473, 5.525, 5.582, 5.644, 5.670, 6.150, 5.864, 5.939, 6.022, 6.108, 6.184, 6.254, 5.426, 6.825, 7.550, 7.864, 7.834, 8.438, 8.967, 8.959, 9.226, 10.438, 6.108, 7.417, 7.286, 8.414, 9.318, 10.749];
const NOBLE = [2, 10, 18, 36, 54, 86, 118];
const outer = Z => { const c = EC.config(Z), n = Math.max(...c.map(s => s.n)); return c.filter(s => s.n === n).pop(); };
const NST = { 1: 1, 2: 2, 3: 3, 4: 3.7, 5: 4.0, 6: 4.2, 7: 4.4 };
const modelR = Z => { const s = outer(Z), ns = NST[s.n]; return .529 * ns * (2 * ns + 1) / (2 * EC.zeff(Z, s)); };
// 迷你周期表
function miniPT(g, x0, y0, cw, ch, hl, o = {}) {
  const BC = { s: '#FF7A93', p: '#5CB4FF', d: '#5FE0A0', f: '#C79BFF' };
  for (let Z = 1; Z <= 118; Z++) { const [r, c2] = EC.pos(Z), y = y0 + (r <= 7 ? r - 1 : r - 1 + .4) * ch, x = x0 + (c2 - 1) * cw, on = hl(Z);
    g.globalAlpha = on ? 1 : (o.dim ?? .28); g.fillStyle = BC[EC.block(Z)]; g.fillRect(x + 1, y + 1, cw - 2, ch - 2); g.globalAlpha = 1;
    if (o.sym) tag(g, x + cw / 2, y + ch / 2, EC.SYM[Z - 1], { size: o.sym, col: on ? '#070A12' : '#9AA6BC', w: 700 }); }
}
S('b_open', c => {
  const { b, be } = c;
  const v = glv(c, 640, 120, 1240, 860, { at: .1 }); v.look(10, .25);
  const t0 = b(0) + 3, t1 = be(1) - 1, zAt = t => t < t0 ? 1 : t >= t1 ? 118 : 1 + Math.floor((t - t0) / (t1 - t0) * 118);
  let curZ = 0, A = null;
  const hud = show(c, `<div class="atomhud" style="left:100px;top:180px"><div class="z"></div><div class="sym"></div><div class="nm"></div><div class="cf"></div></div>`, .3, null);
  v.upd.push(t => { const Z = zAt(t);
    if (Z !== curZ) { curZ = Z; if (A) { v.grp.remove(A.grp); A.orbs.forEach(q => { q.p.geometry.dispose(); q.p.material.dispose(); }); }
      A = atomCloud(v, Z, { perE: Z <= 10 ? 3000 : 1500, max: Math.min(Z * 1500, 120000) }); v.look(A.R * 3.1, .25); A.setSize();
      hud.querySelector('.z').textContent = 'Z = ' + Z; hud.querySelector('.sym').textContent = EC.SYM[Z - 1]; hud.querySelector('.nm').textContent = EC.NAME[Z - 1]; hud.querySelector('.cf').textContent = EC.configStr(Z); }
    A.grp.rotation.set(.22, .5 + t * .25, 0); });
  canvasLayer(c, 100, 560, 520, 330, (g, t) => { const Z = zAt(t); miniPT(g, 0, 0, 28, 30, q => q <= Z, { dim: .12 }); }, { at: .5 });
  show(c, `<div class="cap abs" style="left:100px;top:900px;width:520px">只画最外层的价电子 · 半径做了 √r 压缩</div>`, b(1), null, { dy: 0 });
  show(c, `<div class="legend abs" style="left:640px;top:930px;width:1240px;justify-content:center">${pill(LCOL[0], 's')}${pill(LCOL[1], 'p')}${pill(LCOL[2], 'd')}${pill(LCOL[3], 'f')}</div>`, b(1), null, { dy: 0 });
});
S('b_p1', c => {
  const { b, be } = c; c.head('01', '第一、第二周期');
  atomRow(c, 260, 210, 1400, 620, [{ Z: 1, lab: '<b>H</b> 1s¹' }, { Z: 2, lab: '<b>He</b> 1s²' }], { at: .3, until: be(0) + .2, sameScale: true, perE: 9000 });
  show(c, det(660, 860, 600, '计算半径（Clementi 1967）', 'H 0.53 Å · He 0.31 Å'), b(0) + 6, be(0) + .2);
  atomRow(c, 100, 200, 1000, 720, [{ Z: 3, all: true, lab: '<b>Li</b> 1s² 2s¹', colBy: q => q.n === 1 ? '#FF7A93' : '#FFD27A' }], { at: b(1) + .2, until: be(1) + .2, perE: 9000, comp: true, zoom: 3.2 });
  show(c, card(1160, 280, 660, `<div class="k">锂的第 3 个电子</div><h3>去了第二层</h3><div class="p">内层两个 1s 电子挡住了大部分核电荷，2s 电子感受到的有效核电荷只有约 <b>1.3</b>（核电荷是 3）。</div>`), b(1) + 2, be(1) + .2);
  show(c, `<div class="legend abs" style="left:1160px;top:600px">${pill('#FF7A93', '1s · 内层')}${pill('#FFD27A', '2s · 价电子')}</div>`, b(1) + 3, be(1) + .2, { dy: 0 });
  atomRow(c, 60, 230, 1800, 520, [3, 4, 5, 6, 7, 8, 9, 10].map(Z => ({ Z, lab: `<b>${EC.SYM[Z - 1]}</b>` })), { at: b(2) + .2, sameScale: true, perE: 3000, zoom: 3.4 });
  show(c, `<div class="cap abs" style="left:60px;top:790px;width:1800px;text-align:center">同一比例（真实半径）：从左到右，核电荷 +3 → +10，电子云越来越紧</div>`, b(2) + 1, null, { dy: 0 });
  show(c, det(660, 850, 600, '计算半径（Clementi 1967）', 'Li 1.67 Å → F 0.42 Å'), F(c, 2, .6), null);
});
S('b_sphere', c => {
  const { b, be } = c; c.head('02', '填满了就变圆', '半满、全满的亚层是球对称的');
  const N3 = [0, 1, 2].map(i => EC.sampleOne(7, '2p', i, 7000, 3));
  // 三个 p 轨道分别出现，再合在一起
  const v = glv(c, 100, 200, 1720, 640, { at: .2 }); v.look(6, .22);
  const cols = ['#FF7A93', '#5FE0A0', '#5CB4FF'], ps = N3.map((q, i) => { const p = ptsFrom(q.pts, cols[i], { size: 20 }); v.grp.add(p); return p; });
  const tm = F(c, 0, .45);
  v.upd.push(t => { const u = SS(t, tm, tm + 3); ps.forEach((p, i) => { p.position.x = (i - 1) * 3.6 * (1 - u); p.rotation.set(.25, .5 + t * .2, 0); p.material.uniforms.uSize.value = v.psize(5); p.material.uniforms.uA.value = t < .4 + i * 1.5 ? 0 : 1; }); });
  ['2p<sub>x</sub>', '2p<sub>y</sub>', '2p<sub>z</sub>'].forEach((l2, i) => show(c, `<div class="vlab" style="left:${100 + i * 573}px;top:800px;width:573px"><b>${l2}</b></div>`, .4 + i * 1.5, tm, { dy: 0 }));
  show(c, `<div class="vlab" style="left:100px;top:800px;width:1720px">氮的三个 2p 电子叠在一起：<b>一个圆球</b></div>`, tm + 3, be(0) + .2, { dy: 0 });
  c.out(v.el, be(0) + .2);
  atomRow(c, 60, 230, 1800, 560, [{ Z: 5, keys: ['2p'], lab: '<b>B</b> 2p¹：哑铃' }, { Z: 6, keys: ['2p'], lab: '<b>C</b> 2p²：扁圆盘' }, { Z: 7, keys: ['2p'], lab: '<b>N</b> 2p³ 半满：球' }, { Z: 8, keys: ['2p'], lab: '<b>O</b> 2p⁴：不是正圆' }, { Z: 10, keys: ['2p'], lab: '<b>Ne</b> 2p⁶ 全满：球' }], { at: b(1) + .2, perE: 4000, zoom: 4.6, modes: [[0, 'pts'], [F(c, 1, .35), 'solid']] });
  show(c, modeTag(160, 200, '实体：每个 2p 亚层装下 90% 电子的包络面'), F(c, 1, .35), null, { dy: 0 });
  show(c, det(560, 860, 800, '定理（Unsöld 1927）', '同一亚层的所有轨道各放同样多的电子时，电子云加起来是球对称的'), F(c, 1, .5), null);
});
S('b_p3', c => {
  const { b, be } = c; c.head('03', '换行的时候发生了什么');
  atomRow(c, 260, 210, 1400, 620, [{ Z: 3, lab: '<b>Li</b> 2s¹' }, { Z: 11, lab: '<b>Na</b> 3s¹' }], { at: .3, until: be(0) + .2, sameScale: true, perE: 9000, zoom: 3.2 });
  show(c, `<div class="cap abs" style="left:260px;top:860px;width:1400px;text-align:center">同一比例：最外层都是一个 s 电子，钠的大一圈</div>`, 1, be(0) + .2, { dy: 0 });
  atomRow(c, 100, 200, 1720, 330, [9, 17, 35, 53].map(Z => ({ Z, lab: `<b>${EC.SYM[Z - 1]}</b> ${outer(Z).key === 'np' ? '' : ''}${EC.configStr(Z).split(' ').pop()}` })), { at: b(1) + .2, until: be(1) + .2, sameScale: true, perE: 3000, zoom: 3.6 });
  atomRow(c, 100, 560, 1720, 330, [2, 10, 18, 36].map(Z => ({ Z, lab: `<b>${EC.SYM[Z - 1]}</b> 满壳层` })), { at: F(c, 1, .45), until: be(1) + .2, sameScale: true, perE: 3000, zoom: 3.6 });
  show(c, at(100, 196, 300, `<div class="pill">卤素：差一个 p 电子</div>`), b(1) + .5, be(1) + .2, { dy: 0 });
  show(c, at(100, 556, 300, `<div class="pill">惰性气体：满层</div>`), F(c, 1, .45), be(1) + .2, { dy: 0 });
  // 第一电离能
  canvasLayer(c, 100, 200, 1720, 700, (g, t) => {
    const X = Z => 90 + (Z - 1) / 85 * 1580, Y = e => 620 - e / 26 * 560, k = SS(t, b(2) + .3, F(c, 2, .55)) * 86;
    g.strokeStyle = '#2C3854'; g.lineWidth = 2; g.beginPath(); g.moveTo(90, 620); g.lineTo(1680, 620); g.moveTo(90, 620); g.lineTo(90, 40); g.stroke();
    for (let e = 0; e <= 25; e += 5) { tag(g, 70, Y(e), String(e), { size: 18, col: '#66728C', align: 'right' }); }
    tag(g, 100, 24, '第一电离能（eV）', { size: 22, col: '#A3AEC3', align: 'left' }); tag(g, 1680, 660, '原子序数 Z →', { size: 20, col: '#66728C', align: 'right' });
    g.strokeStyle = '#5CB4FF'; g.lineWidth = 3; g.beginPath(); for (let Z = 1; Z <= Math.min(86, k); Z++) Z === 1 ? g.moveTo(X(Z), Y(IE1[Z - 1])) : g.lineTo(X(Z), Y(IE1[Z - 1])); g.stroke();
    for (let Z = 1; Z <= Math.min(86, k); Z++) { const nob = NOBLE.includes(Z), alk = NOBLE.includes(Z - 1); g.fillStyle = nob ? '#FFD27A' : alk ? '#FF7A93' : '#5CB4FF'; g.beginPath(); g.arc(X(Z), Y(IE1[Z - 1]), nob || alk ? 7 : 4, 0, 7); g.fill();
      if (nob || alk || Z === 1) tag(g, X(Z), Y(IE1[Z - 1]) + (nob || Z === 1 ? -20 : 22), EC.SYM[Z - 1], { size: 20, col: nob ? '#FFD27A' : alk ? '#FF7A93' : '#E9EEF7', w: 700 }); }
  }, { at: b(2) + .2 });
  show(c, `<div class="legend abs" style="left:1300px;top:240px">${pill('#FFD27A', '惰性气体：高峰')}${pill('#FF7A93', '碱金属：谷底')}</div>`, F(c, 2, .5), null, { dy: 0 });
  show(c, `<div class="cap abs" style="left:1000px;top:930px;width:820px;text-align:right">数据：NIST 原子光谱数据库</div>`, b(2) + 1, null, { dy: 0 });
});
S('b_ion', c => {
  const { b, be } = c; c.head('04', '得失电子以后', '离子的电子云');
  const conf = Z => EC.config(Z), naP = conf(11).filter(s => s.key !== '3s'), clM = conf(17).map(s => s.key === '3p' ? { ...s, e: 6 } : s), ne = Z => conf(10).map(s => ({ ...s }));
  atomRow(c, 100, 210, 1720, 600, [{ Z: 11, all: true, lab: '<b>Na</b>' }, { Z: 11, conf: naP, all: true, lab: '<b>Na⁺</b>：失去 3s' }, { Z: 17, all: true, lab: '<b>Cl</b>' }, { Z: 17, conf: clM, all: true, lab: '<b>Cl⁻</b>：3p 填满' }], { at: .3, until: be(0) + .2, sameScale: true, perE: 4000, zoom: 3.2 });
  show(c, det(560, 860, 800, '离子半径（Shannon，六配位）', 'Na⁺ 1.02 Å（钠原子金属半径 1.86 Å）· Cl⁻ 1.81 Å（氯共价半径 0.99 Å）'), b(0) + 8, be(0) + .2);
  atomRow(c, 60, 230, 1800, 560, [8, 9, 10, 11, 12].map((Z, i) => ({ Z, conf: ne(Z), all: true, lab: `<b>${['O²⁻', 'F⁻', 'Ne', 'Na⁺', 'Mg²⁺'][i]}</b> · 核电荷 +${Z}` })), { at: b(1) + .2, sameScale: true, perE: 4000, zoom: 3.4 });
  show(c, `<div class="cap abs" style="left:60px;top:830px;width:1800px;text-align:center">都是 10 个电子（1s² 2s² 2p⁶），同一比例</div>`, b(1) + 1, null, { dy: 0 });
  show(c, det(560, 880, 800, '离子半径（Shannon）', 'O²⁻ 1.40 · F⁻ 1.33 · Na⁺ 1.02 · Mg²⁺ 0.72 Å'), F(c, 1, .5), null);
});
S('b_d', c => {
  const { b, be } = c; c.head('05', '第四周期：先 4s 后 3d');
  atomRow(c, 100, 210, 1000, 620, [{ Z: 19, lab: '<b>K</b> [Ar] 4s¹' }, { Z: 20, lab: '<b>Ca</b> [Ar] 4s²' }], { at: .3, until: be(0) + .2, perE: 6000, zoom: 3.3 });
  canvasLayer(c, 1160, 240, 700, 560, (g, t) => {
    tag(g, 20, 20, '能量（示意）', { size: 22, col: '#A3AEC3', align: 'left' });
    const lv = [['3p', 470, '#5CB4FF'], ['4s', 300, '#FF7A93'], ['3d', 250, '#5FE0A0']];
    lv.forEach(([l2, y, col], i) => { const a = SS(t, 1 + i * 1.2, 1.8 + i * 1.2); g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = 5; g.beginPath(); g.moveTo(120, y); g.lineTo(l2 === '3d' ? 620 : 300, y); g.stroke(); tag(g, 90, y, l2, { size: 28, col, align: 'right', font: 'DejaVu Sans Mono, monospace' }); g.globalAlpha = 1; });
    tag(g, 380, 330, '钾、钙：先填 4s', { size: 24, col: '#FF7A93', align: 'left' }); tag(g, 380, 210, '钪开始：再填 3d', { size: 24, col: '#5FE0A0', align: 'left' });
    tag(g, 20, 540, '马德隆规则：按 n + l 从小到大，相同时 n 小的先', { size: 22, col: '#A3AEC3', align: 'left' });
  }, { at: b(0) + 3, until: be(0) + .2 });
  atomRow(c, 100, 190, 1100, 760, [{ Z: 26, keys: ['3d', '4s'], lab: '<b>Fe</b> [Ar] 3d⁶ 4s²', modes: [[0, 'pts'], [F(c, 1, .45), 'cut']] }], { at: b(1) + .2, until: be(1) + .2, perE: 3000, comp: true, zoom: 4.2 });
  show(c, `<div class="legend abs" style="left:1260px;top:300px;flex-direction:column;gap:12px">${pill(LCOL[2], '3d：缩在里面')}${pill(LCOL[0], '4s：包在外面')}</div>`, b(1) + 1, be(1) + .2, { dy: 0 });
  show(c, card(1260, 470, 560, `<div class="p">失去电子时，先走的是<b>外面的 4s</b>，而不是后来填进去的 3d。</div>`), F(c, 1, .65), be(1) + .2);
  atomRow(c, 100, 220, 1720, 580, [{ Z: 24, keys: ['3d'], lab: '<b>Cr</b> 3d⁵ 4s¹：3d 半满' }, { Z: 26, keys: ['3d'], lab: '<b>Fe</b> 3d⁶：不对称' }, { Z: 29, keys: ['3d'], lab: '<b>Cu</b> 3d¹⁰ 4s¹：3d 全满' }], { at: b(2) + .2, perE: 4000, zoom: 4.4, modes: [[0, 'pts'], [F(c, 2, .45), 'solid']] });
  show(c, modeTag(100, 200, '只画 3d 亚层 · 实体：装下 90% 的 3d 电子'), F(c, 2, .45), null, { dy: 0 });
});
S('b_f', c => {
  const { b, be } = c; c.head('06', 'f 区：埋在深处的电子');
  atomRow(c, 100, 190, 1100, 760, [{ Z: 64, keys: ['4f', '5s', '5p', '5d', '6s'], lab: '<b>Gd</b> 钆：[Xe] 4f⁷ 5d¹ 6s²', modes: [[0, 'pts'], [F(c, 0, .5), 'cut']] }], { at: .3, until: be(0) + .2, perE: 1500, comp: true, zoom: 4.2 });
  show(c, `<div class="legend abs" style="left:1260px;top:300px;flex-direction:column;gap:12px">${pill(LCOL[3], '4f：埋在最里面')}${pill(LCOL[1], '5p')}${pill(LCOL[0], '5s、6s')}${pill(LCOL[2], '5d')}</div>`, 1, be(0) + .2, { dy: 0 });
  show(c, card(1260, 560, 560, `<div class="p">镧到镥增加的 14 个电子都填进 4f，外层几乎不变，所以 15 种镧系元素化学性质极其相似。</div>`), b(0) + 6, be(0) + .2);
  atomRow(c, 260, 220, 1400, 580, [{ Z: 40, lab: '<b>Zr</b> 锆 · 第五周期' }, { Z: 72, lab: '<b>Hf</b> 铪 · 第六周期' }], { at: b(1) + .2, sameScale: true, perE: 4000, zoom: 3.3 });
  show(c, det(560, 850, 800, '金属半径', 'Zr 1.60 Å · Hf 1.59 Å：多了 32 个电子，大小几乎不变（镧系收缩）'), F(c, 1, .4), null);
});
S('b_heavy', c => {
  const { b, be } = c; c.head('07', '很重的原子');
  atomRow(c, 100, 190, 1000, 760, [{ Z: 79, keys: ['5d', '6s'], lab: '<b>Au</b> 金：[Xe] 4f¹⁴ 5d¹⁰ 6s¹（画出 5d 与 6s）' }], { at: .3, until: be(0) + .2, perE: 3000, comp: true, zoom: 3.3 });
  show(c, card(1160, 260, 660, `<div class="k">相对论效应</div><div class="p">金的 1s 电子速度超过光速的一半。质量变大 → 轨道收缩 → <b>6s 也收缩</b>，5d 反而膨胀。<br><br>金是黄色、汞在室温下是液体，很大程度上源于此。</div>`), b(0) + 2, be(0) + .2);
  show(c, det(1160, 700, 660, '本模型的局限', '这里的电子云<b>没有</b>计入相对论效应，重元素的尺寸误差更大。'), b(0) + 8, be(0) + .2);
  atomRow(c, 100, 190, 1000, 760, [{ Z: 118, lab: '<b>Og</b> 氮（118）：[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶' }], { at: b(1) + .2, perE: 3000, comp: true, zoom: 3.3 });
  show(c, card(1160, 260, 660, `<div class="k">超重元素</div><div class="p">104 号以后的电子排布都是<b>理论预测</b>。计算表明，强烈的相对论效应可能让 Og 的电子壳层变得模糊，不再像惰性气体。</div>`), b(1) + 3, null);
  show(c, det(1160, 640, 660, '参考', 'Jerabek 等，Phys. Rev. Lett. 120, 053001（2018）'), b(1) + 8, null);
});
S('b_trend', c => {
  const { b, be } = c; c.head('08', '把规律放在一起');
  canvasLayer(c, 100, 210, 1720, 640, (g, t) => {
    const RMX = Math.max(...Array.from({ length: 86 }, (_, i) => modelR(i + 1))) * 1.08, X = Z => 90 + (Z - 1) / 85 * 1560, Yr = r => 560 - r / RMX * 500, Ye = e => 560 - e / 26 * 500, k = SS(t, .5, F(c, 0, .55)) * 86, k2 = SS(t, F(c, 0, .6), be(0)) * 86;
    g.strokeStyle = '#2C3854'; g.lineWidth = 2; g.beginPath(); g.moveTo(90, 560); g.lineTo(1660, 560); g.stroke();
    NOBLE.slice(0, 6).forEach(Z => { g.strokeStyle = 'rgba(255,210,122,.25)'; g.setLineDash([4, 6]); g.beginPath(); g.moveTo(X(Z + .5), 40); g.lineTo(X(Z + .5), 560); g.stroke(); g.setLineDash([]); });
    g.strokeStyle = '#FF7A93'; g.lineWidth = 3.5; g.beginPath(); for (let Z = 1; Z <= Math.min(86, k); Z++) Z === 1 ? g.moveTo(X(Z), Yr(modelR(Z))) : g.lineTo(X(Z), Yr(modelR(Z))); g.stroke();
    g.strokeStyle = '#5CB4FF'; g.lineWidth = 2.5; g.globalAlpha = .9; g.beginPath(); for (let Z = 1; Z <= Math.min(86, k2); Z++) Z === 1 ? g.moveTo(X(Z), Ye(IE1[Z - 1])) : g.lineTo(X(Z), Ye(IE1[Z - 1])); g.stroke(); g.globalAlpha = 1;
    [3, 11, 19, 37, 55].forEach(Z => { if (Z <= k) tag(g, X(Z), Yr(modelR(Z)) - 22, EC.SYM[Z - 1], { size: 20, col: '#FF7A93', w: 700 }); });
    tag(g, 100, 20, '红：最外层电子云的平均半径（本模型，Å）　蓝：第一电离能（NIST，eV）', { size: 22, col: '#A3AEC3', align: 'left' }); tag(g, 1660, 600, '原子序数 Z →', { size: 20, col: '#66728C', align: 'right' });
  }, { at: .3, until: be(0) + .2 });
  canvasLayer(c, 160, 200, 1600, 660, (g, t) => {
    const blk = [['s', 0, 2], ['p', 1, 6], ['d', 2, 10], ['f', 3, 14]], cur = Math.min(3, Math.floor(SS(t, b(1) + 6, be(1) - 2) * 4));
    miniPT(g, 120, 30, 76, 54, Z => 'spdf'.indexOf(EC.block(Z)) <= cur, { sym: 18, dim: .15 });
    blk.forEach(([l2, i, n], j) => { if (j <= cur) tag(g, 120 + [80, 1100, 640, 820][j], 615, `${l2} 区：${n} 列`, { size: 30, col: LCOL[i], w: 700 }); });
  }, { at: b(1) + .2 });
});
S('b_end', c => {
  const { b, be } = c; c.head('09', '小结');
  const pts = [['同一行', '核电荷增加，电子云<b>收紧</b>'], ['换一行', '电子进入更大的一层，电子云<b>膨胀</b>'], ['同一列', '最外层电子云形状相同，<b>性质相似</b>'], ['半满、全满', '亚层球对称，特别稳定'], ['d 与 f', '埋在里面，让过渡金属、镧系各有特点']];
  pts.forEach(([h, s2], i) => show(c, card(100, 210 + i * 132, 780, `<h3 style="font-size:27px;margin:0 0 2px">${h}</h3><div class="p" style="font-size:22px">${s2}</div>`), .3 + i * 1.4, null));
  atomRow(c, 940, 220, 880, 580, [{ Z: 11, lab: 'Na' }, { Z: 17, lab: 'Cl' }], { at: .5, perE: 4000, zoom: 3.3 });
  show(c, card(940, 840, 880, `<div class="p" style="font-size:24px">下一集：让原子靠近、碰撞、重新组合——<b>化学反应</b></div>`), b(1) + 3, null);
});
