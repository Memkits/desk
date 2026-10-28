// 方解石 · 下集：力、热与化学
const mc = (col, h, body, s = '') => `<div class="mc" style="--c:${col}">${s ? `<div class="s">${s}</div>` : ''}<h3>${h}</h3>${body}</div>`;
const card = (g, W, H, r = 16) => { g.fillStyle = '#fff'; g.beginPath(); g.roundRect(0, 0, W, H, r); g.fill(); };
const tri = (g, x, y, R, th, col = '#E0503F', a = 1) => { g.globalAlpha = a; g.strokeStyle = '#3D3D42'; g.lineWidth = 3; const P = [0, 1, 2].map(i => [x + R * Math.cos(th + i * 2.094), y - R * Math.sin(th + i * 2.094)]); P.forEach(p => { g.beginPath(); g.moveTo(x, y); g.lineTo(p[0], p[1]); g.stroke(); }); P.forEach(p => { g.fillStyle = col; g.beginPath(); g.arc(p[0], p[1], R * .38, 0, 7); g.fill(); }); g.fillStyle = '#3D3D42'; g.beginPath(); g.arc(x, y, R * .26, 0, 7); g.fill(); g.globalAlpha = 1; return P; };
const ball = (g, x, y, r, col, a = 1) => { g.globalAlpha = a; const gr = g.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r); gr.addColorStop(0, shade(col, .6)); gr.addColorStop(1, shade(col, -.3)); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.globalAlpha = 1; };

S('m_open', c => {
  const { b, be } = c;
  show(c, at(120, 170, 760, `<div style="font:600 26px var(--sans);letter-spacing:.3em;color:var(--ink3)">矿物物理 · 下集</div><div style="font:900 150px/1.1 var(--serif);margin-top:12px">方解石</div><div style="font:700 48px var(--serif);color:var(--ink2);margin-top:8px">力、热与化学</div>`), .1, be(0) + .2);
  // 碎成菱形（示意）
  canvasLayer(c, 900, 170, 900, 640, (g, t) => {
    card(g, 900, 640);
    const k = SS(t, 3, 6), al = 101.9 * Math.PI / 180, n = 4, L = 92, u = [L, 0], v = [L * Math.cos(al), -L * Math.sin(al)], ox = 340, oy = 520;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const h = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453, rr = h - Math.floor(h), dx = (i - 1.5) * 26 * k + (rr - .5) * 30 * k, dy = (j - 1.5) * 22 * k - rr * 18 * k, rot = (rr - .5) * .5 * k;
      const x0 = ox + i * u[0] + j * v[0] + dx, y0 = oy + i * u[1] + j * v[1] + dy;
      g.save(); g.translate(x0 + (u[0] + v[0]) / 2, y0 + (u[1] + v[1]) / 2); g.rotate(rot);
      const P = [[0, 0], u, [u[0] + v[0], u[1] + v[1]], v].map(p => [p[0] - (u[0] + v[0]) / 2, p[1] - (u[1] + v[1]) / 2]);
      g.beginPath(); P.forEach((p, q) => q ? g.lineTo(...p) : g.moveTo(...p)); g.closePath();
      g.fillStyle = `rgba(${200 - rr * 30},${222 - rr * 20},${240},.75)`; g.fill(); g.strokeStyle = '#7A97B4'; g.lineWidth = 2; g.stroke();
      g.beginPath(); g.moveTo(P[0][0] - 10, P[0][1] - 13); g.lineTo(P[1][0] - 10, P[1][1] - 13); g.lineTo(P[2][0] - 10, P[2][1] - 13); g.strokeStyle = 'rgba(122,151,180,.5)'; g.stroke(); g.restore();
    }
    tag(g, 450, 600, k > .5 ? '碎片几乎都是小菱面体：面夹角约 75° / 105°' : '一块方解石', { size: 22, col: '#454B55' });
    tag(g, 450, 30, '示意', { size: 16, col: '#9AA0A8', w: 500 });
  }, { until: be(0) + .2 });
  canvasLayer(c, 120, 220, 1680, 420, (g, t) => {
    card(g, 1680, 420);
    const a = SS(t, b(1) + .3, b(1) + 1.3), w = SS(t, F(c, 1, .35), F(c, 1, .55));
    tri(g, 380, 200, 70, Math.PI / 2, '#E0503F', a);
    ball(g, 620, 200, 38, '#7FB3E0', a * w);
    g.globalAlpha = a * w; g.setLineDash([10, 8]); g.strokeStyle = '#7FB3E0'; g.lineWidth = 6; g.beginPath(); g.moveTo(410, 172); g.lineTo(585, 195); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
    tag(g, 380, 330, 'C–O 共价键：1.28 Å，强', { size: 26, col: '#C93A2C', a });
    tag(g, 620, 330, 'Ca–O 离子键：2.36 Å，弱得多', { size: 26, col: '#1F5FA8', a: a * w, align: 'left' });
    tag(g, 1240, 150, '变形和断裂', { size: 40, col: '#181B20', a: w, w: 800 });
    tag(g, 1240, 220, '优先发生在弱的 Ca–O 处', { size: 34, col: '#1F5FA8', a: w, w: 700 });
  }, { at: b(1) + .1 });
});

S('m_cleave', c => {
  const { b } = c;
  c.head('01', '为什么碎成菱形');
  canvasLayer(c, 120, 220, 1040, 640, (g, t) => {
    const B = CAL.rh, cen = fromFrac(B, [1, 1, 1]), P = f => V3.sub(fromFrac(B, f), cen);
    const n3 = V3.norm(V3.cross(B[0], B[1])), hi = SS(t, F(c, 0, .3), F(c, 0, .45)), sep = SS(t, F(c, 0, .55), F(c, 0, .85)), lift = V3.mul(n3, 3.2 * sep * Math.sign(V3.dot(n3, B[2])));
    const cam = camera({ yaw: .35 + t * .04, pitch: .22, scale: 27, cx: 520, cy: 320, persp: 60 }), its = [];
    const up = f => f[2] > 1.25, pos = (f, d = [0, 0, 0]) => V3.add(V3.add(P(f), d), up(f) ? lift : [0, 0, 0]);
    const Os = [];
    for (const gq of BLOCK.G) { const c0 = pos(gq.f); its.push({ k: 'ball', p: c0, r: .32, col: ACOL.C }); gq.o.forEach(d => { const q = V3.add(c0, d); Os.push({ p: P(gq.f).map((v, i) => v + d[i]), up: up(gq.f), q }); its.push({ k: 'ball', p: q, r: .42, col: ACOL.O }); its.push({ k: 'bond', a: c0, b: q, w: .14, col: '#555' }); }); }
    for (const f of BLOCK.Ca) { const p0 = P(f), p = pos(f); its.push({ k: 'ball', p, r: .55, col: ACOL.Ca }); if (hi > 0) for (const o of Os) { const d = V3.len(V3.sub(o.p, p0)); if (Math.abs(d - 2.36) < .05 && o.up !== up(f)) { its.push({ k: 'line', a: p, b: o.q, col: `rgba(194,70,46,${hi * (1 - sep)})`, w: 4 }); } } }
    // 解理面
    const pl = [[0, 0, 1.25], [2, 0, 1.25], [2, 2, 1.25], [0, 2, 1.25]].map(f => P(f));
    its.push({ k: 'poly', pts: pl, fill: `rgba(91,74,158,${.16 * hi * (1 - sep * .6)})`, stroke: `rgba(91,74,158,${.6 * hi})`, lw: 2, bias: 0 });
    draw3(g, cam, its);
    tag(g, 520, 610, sep > .3 ? '分开以后，每个碳酸根都完整；切开的只有红色的 Ca–O 键' : hi > .3 ? '红线：穿过解理面的 Ca–O 离子键' : '解理面 {10-14}：与菱面体的面平行', { size: 22, col: '#454B55' });
  }, { at: b(0) + .1, until: b(1) + .2 });
  // 第二拍：(001) 极性面 vs (104) 中性面（侧视示意）
  canvasLayer(c, 120, 220, 1040, 640, (g, t) => {
    card(g, 1040, 640);
    const a = SS(t, b(1) + .3, b(1) + 1.2), s1 = SS(t, b(1) + 1.5, F(c, 1, .35)), s2 = SS(t, F(c, 1, .45), F(c, 1, .65));
    const draw = (x0, y0, cut, sep, lab, lab2, col) => {
      for (let r = 0; r < 6; r++) for (let k = 0; k < 6; k++) {
        const isCa = cut === 'h' ? r % 2 === 0 : (r + k) % 2 === 0, above = cut === 'h' ? r < 3 : r + k * .0 < 3 - (k % 2 ? 0 : 0) && (r * 2 + (k % 2)) < 6;
        const ab = cut === 'h' ? r < 3 : r < 3;
        const x = x0 + k * 58 + (cut === 'h' ? 0 : 0), y = y0 + r * 56 + (ab ? -sep * 40 : sep * 40);
        if (isCa) ball(g, x, y, 15, '#7FB3E0', a); else { g.globalAlpha = a; g.fillStyle = '#E0503F'; g.beginPath(); g.ellipse(x, y, 22, 8, 0, 0, 7); g.fill(); g.globalAlpha = 1; }
      }
      tag(g, x0 + 145, y0 + 380, lab, { size: 22, col, a });
      tag(g, x0 + 145, y0 + 412, lab2, { size: 19, col: '#454B55', a });
    };
    // 左：垂直 c 轴切（极性）
    draw(70, 70, 'h', s1, '垂直 c 轴切：极性面', '一面全是 Ca²⁺（+），一面全是 CO₃²⁻（−）', '#C2462E');
    if (s1 > .5) { tag(g, 215, 160 + 0 - 40, '+ + + + + +', { size: 26, col: '#C2462E', a: s1 }); }
    // 右：交错排列切（中性）
    draw(590, 70, 'd', s2, '解理面：中性面', '每一面都同时有 Ca²⁺ 和 CO₃²⁻', '#2E7D4F');
    tag(g, 520, 600, '示意：CO₃ 画成侧视的扁椭圆；真实的解理面与 c 轴斜交', { size: 17, col: '#9AA0A8', w: 500, a });
  }, { at: b(1) + .1 });
  const t1 = show(c, at(1200, 230, 600, tbl([['量', '数值'], ['解理', '{10-14}，三组，完全'], ['面夹角', '74°55′ / 105°05′'], ['表面能（DFT）', '约 0.57 J/m²，最低'], ['切断的键', '只有 Ca–O']], { st: 'font-size:21px' })), b(0) + .3);
  rowsIn(c, t1, [[0, b(0) + .3], [1, F(c, 0, .1)], [4, F(c, 0, .35)], [3, F(c, 1, .7)], [2, F(c, 1, .85)]]);
  show(c, at(1200, 560, 600, `<div class="cap">表面能：RSC Adv. 2020（0.57 J/m²）；de Leeuw 文献值 0.59</div>`), F(c, 1, .7));
});

S('m_hard', c => {
  const { b } = c;
  c.head('02', '软，而且软得不均匀');
  // 莫氏硬度条
  const M = ['滑石', '石膏', '方解石', '萤石', '磷灰石', '正长石', '石英', '黄玉', '刚玉', '金刚石'];
  const mh = show(c, at(120, 240, 1680, `<div class="mohs">${M.map((m, i) => `<div class="${i === 2 ? 'on' : ''}"><b>${i + 1}</b>${m}</div>`).join('')}</div>`), b(0) + .1);
  [...mh.querySelectorAll('.mohs div')].forEach((e, i) => c.in(e, b(0) + .2 + i * .12, { dy: 8, d: .3 }));
  // 弹簧模型
  canvasLayer(c, 120, 400, 1000, 460, (g, t) => {
    card(g, 1000, 460);
    const a = SS(t, b(1) + .2, b(1) + 1), ph = Math.sin((t - b(1)) * 2.2) * SS(t, b(1) + 1.5, b(1) + 2.5);
    const kx = 1 / 149.4, kz = 1 / 85.2, A = 3200;
    for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) {
      const sx = 1 - ph * A * kx * .012, sz = 1 + ph * A * kz * .012;
      const x = 90 + k * 70 * (r < 0 ? 1 : sx), y = 80 + r * 80;
      if (k < 5) { g.globalAlpha = a; g.strokeStyle = '#C93A2C'; g.lineWidth = 7; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 70 * sx, y); g.stroke(); }
      tri(g, x, y, 18, Math.PI / 2 + (r % 2) * Math.PI / 3, '#E0503F', a);
    }
    for (let r = 0; r < 3; r++) for (let k = 0; k < 6; k++) { const x = 90 + k * 70 * (1 - ph * A * kx * .012) + 35, y = 120 + r * 80; ball(g, x, y, 13, '#7FB3E0', a); }
    tag(g, 290, 420, '层内：CO₃ 骨架顶着（粗红线）', { size: 19, col: '#C93A2C', a });
    // 柱状
    const bars = [['C₁₁ 层内', 149.4, '#C93A2C'], ['C₃₃ 沿 c', 85.2, '#1F5FA8'], ['C₄₄ 剪切', 34.1, '#5B4A9E']];
    bars.forEach(([n, v, col], i) => { const h = v * 2, x = 640 + i * 110, gg = SS(t, F(c, 1, .3) + i * .4, F(c, 1, .3) + i * .4 + .6); g.fillStyle = col; g.globalAlpha = gg; g.fillRect(x, 380 - h * gg, 70, h * gg); tag(g, x + 35, 360 - h, `${v}`, { size: 20, col, a: gg }); tag(g, x + 35, 405, n, { size: 16, col: '#454B55', a: gg }); g.globalAlpha = 1; });
    tag(g, 805, 40, '弹性常数（GPa，Chen 等 2001）', { size: 17, col: '#7D838D', w: 500 });
  }, { at: b(1) + .1 });
  show(c, at(1160, 400, 640, mc('var(--edit)', '维氏硬度也各向异性', '<ul><li>垂直光轴的面：105</li><li>平行光轴的面：145</li><li>解理面：136（易碎，读数偏散）</li></ul><div class="cap" style="margin-top:8px">Taylor 1949，50 g 载荷，kg/mm²</div>')), F(c, 1, .65));
  show(c, at(1160, 680, 640, `<div class="cap">体模量 76 GPa · 剪切模量 33 GPa（VRH 平均）</div>`), F(c, 1, .75));
});

S('m_twin', c => {
  const { b } = c;
  c.head('03', '一推就翻的晶格');
  canvasLayer(c, 120, 230, 1040, 620, (g, t) => {
    card(g, 1040, 620);
    const u = SS(t, F(c, 0, .2), F(c, 0, .65));
    g.strokeStyle = '#5B4A9E'; g.setLineDash([10, 8]); g.lineWidth = 3; g.beginPath(); g.moveTo(40, 330); g.lineTo(1000, 330); g.stroke(); g.setLineDash([]);
    tag(g, 900, 350, '孪晶面', { size: 20, col: '#5B4A9E' });
    for (let r = -4; r <= 3; r++) for (let k = 0; k < 12; k++) {
      const yy = 330 - (r + .5) * 66, tw = r >= 0, shear = tw ? u * (r + .5) * 66 * .55 : 0, x0 = 90 + k * 76 + (r % 2 ? 38 : 0);
      const x = x0 + shear, th = Math.PI / 2 + (r % 2 ? Math.PI / 3 : 0) + (tw ? u * Math.PI / 3 * (r % 2 ? -1 : 1) : 0);
      if (x > 30 && x < 1010) tri(g, x, yy, 18, th, tw ? '#E0503F' : '#E58A7F');
      if ((r + 8) % 2 === 0 && k < 11) ball(g, x + 38, yy - 33 + (tw ? 0 : 0), 10, '#7FB3E0', .85);
    }
    if (u > 0) { arrow(g, 300, 40, 300 + 260 * u, 40, '#C2462E', 5, 16); arrow(g, 740, 600, 740 - 200 * u, 600, '#C2462E', 5, 16, u); tag(g, 520, 40, '剪切', { size: 22, col: '#C2462E', a: u }); }
    tag(g, 520, 595, '示意：上半部分的 CO₃ 协同转动，晶格翻成镜像；没有化学键断开', { size: 19, col: '#454B55', a: SS(t, F(c, 0, .5), F(c, 0, .7)) });
  }, { at: b(0) + .1 });
  show(c, at(1200, 240, 600, mc('var(--both)', 'e 孪晶 {01-18}', '<ul><li>临界分切应力约 10 MPa</li><li>远低于破裂所需应力</li><li>机制：Ca 微移 + CO₃ 协同转动（分子动力学）</li></ul>', 'PCCP 2015；JpGU 2016')), F(c, 0, .55));
  show(c, at(1200, 520, 600, mc('var(--vis)', '方解石孪晶古应力计', '<ul><li>岩石里的孪晶纹记录了当年的挤压</li><li>孪晶方向 → 应力方向（Etchecopar 1984 反演）</li><li>孪晶密度 → 差应力大小</li></ul>')), b(1) + .1);
});

S('m_therm', c => {
  const { b } = c;
  c.head('04', '越热越窄的方向');
  const Tt = t => LERP(20, 900, SS(t, b(1) + .5, F(c, 1, .8)));
  canvasLayer(c, 120, 230, 1000, 560, (g, t) => {
    card(g, 1000, 560);
    const T = Tt(t), amp = .05 + .3 * (T - 20) / 880, ph = Math.sin(t * 7) * amp;
    tag(g, 250, 36, '俯视：CO₃ 绕 c 轴扭摆', { size: 20, col: '#454B55' });
    const P = tri(g, 250, 280, 120, Math.PI / 2 + ph, '#E0503F');
    // 平均投影宽度（示意）
    const w = 120 * Math.cos(Math.PI / 6) * (1 - amp * amp * .5) * 2;
    g.strokeStyle = '#1F5FA8'; g.lineWidth = 3; g.setLineDash([6, 6]); g.beginPath(); g.moveTo(250 - w / 2, 470); g.lineTo(250 - w / 2, 430); g.moveTo(250 + w / 2, 470); g.lineTo(250 + w / 2, 430); g.stroke(); g.setLineDash([]);
    arrow(g, 250 - w / 2 - 50, 450, 250 - w / 2 - 4, 450, '#1F5FA8', 3, 10); arrow(g, 250 + w / 2 + 50, 450, 250 + w / 2 + 4, 450, '#1F5FA8', 3, 10);
    tag(g, 250, 505, '层内平均尺寸：收缩', { size: 20, col: '#1F5FA8' });
    // 侧视：层间距
    tag(g, 730, 36, '侧视：层间距', { size: 20, col: '#454B55' });
    const dz = 62 * (1 + (T - 20) * 25.6e-6 * 4), dx = 64 * (1 - (T - 20) * 3.7e-6 * 4);
    for (let r = 0; r < 6; r++) for (let k = 0; k < 5; k++) { const x = 600 + k * dx + (r % 2) * dx / 2, y = 110 + r * dz; if (r % 2) ball(g, x, y, 12, '#7FB3E0'); else { g.fillStyle = '#E0503F'; g.beginPath(); g.ellipse(x, y, 22, 7, 0, 0, 7); g.fill(); } }
    arrow(g, 900, 110, 900, 110 + 5 * dz, '#B5651D', 3, 12); tag(g, 930, 110 + 2.5 * dz, '膨胀', { size: 20, col: '#B5651D', align: 'left' });
    tag(g, 500, 540, `T = ${T.toFixed(0)} °C　（画面放大了 4 倍形变，示意）`, { size: 20, col: '#181B20' });
  }, { at: b(0) + .1 });
  canvasLayer(c, 1160, 230, 640, 560, (g, t) => {
    card(g, 640, 560);
    const X = T => 70 + (T - 20) / 880 * 520, Y = e => 300 - e * 1e4 * 9.5, T = Tt(t);
    g.strokeStyle = '#C8CCC4'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(70, 80); g.lineTo(70, 500); g.moveTo(70, 300); g.lineTo(600, 300); g.stroke();
    [0, 300, 600, 900].forEach(v => tag(g, X(Math.max(20, v)), 320, `${v}`, { size: 15, col: '#7D838D', w: 500 }));
    [-.005, 0, .01, .02].forEach(e => tag(g, 40, Y(e), `${(e * 100).toFixed(1)}%`, { size: 15, col: '#7D838D', w: 500 }));
    const line = (k, col) => { g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); g.moveTo(X(20), Y(0)); g.lineTo(X(T), Y(k * (T - 20))); g.stroke(); };
    line(25.6e-6, '#B5651D'); line(-3.7e-6, '#1F5FA8');
    tag(g, 470, Y(25.6e-6 * 700) - 22, '∥ c：+25.6×10⁻⁶ /°C', { size: 18, col: '#B5651D' }); tag(g, 470, Y(-3.7e-6 * 700) + 28, '⊥ c：−3.7×10⁻⁶ /°C', { size: 18, col: '#1F5FA8' });
    tag(g, 330, 40, '线性外推（示意），系数为室温值', { size: 16, col: '#9AA0A8', w: 500 }); tag(g, 330, 530, '温度（°C）', { size: 16, col: '#7D838D', w: 500 });
  }, { at: b(0) + .3 });
  show(c, at(120, 820, 1680, `<div class="cap">Rao 等 1968；Markgraf & Reeder 1985（Am. Mineral. 70:590）：a 方向直到 900 °C 都为负；CaO₆ 八面体的 Ca–O 平均膨胀约 15.9×10⁻⁶ /°C</div>`), F(c, 1, .5));
});

S('m_vib', c => {
  const { b } = c;
  c.head('05', '碳酸根怎么振动');
  const modes = [['ν₁ 对称伸缩', '1086', 0], ['ν₂ 面外弯曲', '876', 1], ['ν₃ 反对称伸缩', '~1430', 2], ['ν₄ 面内弯曲', '712', 3]];
  modes.forEach(([n, w, m], i) => canvasLayer(c, 120 + i * 425, 230, 405, 330, (g, t) => {
    card(g, 405, 330); const s = Math.sin(t * 6) * SS(t, b(0) + .5 + i * 2, b(0) + 1.2 + i * 2), cx = 202, cy = 150, R = 70;
    if (m === 1) { // 侧视
      g.strokeStyle = '#C8CCC4'; g.lineWidth = 2; g.beginPath(); g.moveTo(60, cy); g.lineTo(345, cy); g.stroke();
      [-1, 1].forEach(d => { g.strokeStyle = '#3D3D42'; g.lineWidth = 4; g.beginPath(); g.moveTo(cx, cy - 30 * s); g.lineTo(cx + d * R, cy + 10 * s); g.stroke(); ball(g, cx + d * R, cy + 10 * s, 22, '#E0503F'); });
      ball(g, cx, cy - 30 * s, 16, '#3D3D42');
    } else {
      const P = [0, 1, 2].map(k => { const th = Math.PI / 2 + k * 2.094; let r = R, dth = 0; if (m === 0) r = R * (1 + .18 * s); if (m === 2) r = R * (1 + .18 * s * [1, -.5, -.5][k]); if (m === 3) dth = .22 * s * [0, 1, -1][k]; return [cx + r * Math.cos(th + dth), cy - r * Math.sin(th + dth)]; });
      const cxx = m === 2 ? cx - 8 * s * Math.cos(Math.PI / 2) : cx, cyy = m === 2 ? cy + 8 * s : cy;
      P.forEach(p => { g.strokeStyle = '#3D3D42'; g.lineWidth = 4; g.beginPath(); g.moveTo(cxx, cyy); g.lineTo(p[0], p[1]); g.stroke(); }); P.forEach(p => ball(g, p[0], p[1], 22, '#E0503F')); ball(g, cxx, cyy, 16, '#3D3D42');
    }
    tag(g, 202, 270, n, { size: 22, col: '#181B20' }); tag(g, 202, 302, `${w} cm⁻¹`, { size: 19, col: '#5B4A9E', font: 'DejaVu Sans Mono, monospace' });
  }, { at: b(0) + .1 + i * 2 }));
  // 光谱
  canvasLayer(c, 120, 590, 1100, 280, (g, t) => {
    card(g, 1100, 280); const a = SS(t, b(1) + .2, b(1) + 1.2), X = w => 80 + (w - 600) / 1000 * 940;
    const R = [[712, .25], [1086.5, 1], [1436, .08]], I = [[713, .35], [875, .8], [1427, 1]];
    [[R, 120, '拉曼', '#1F5FA8'], [I, 240, '红外', '#B5651D']].forEach(([L, y0, n, col], j) => { const aa = SS(t, b(1) + .2 + j * 1.2, b(1) + 1.2 + j * 1.2); g.strokeStyle = '#C8CCC4'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(80, y0); g.lineTo(1020, y0); g.stroke(); tag(g, 40, y0 - 30, n, { size: 20, col, a: aa }); L.forEach(([w, h]) => { g.globalAlpha = aa; g.fillStyle = col; g.fillRect(X(w) - 4, y0 - h * 90, 8, h * 90); g.globalAlpha = 1; }); });
    [600, 800, 1000, 1200, 1400, 1600].forEach(w => tag(g, X(w), 262, `${w}`, { size: 14, col: '#9AA0A8', w: 500 }));
    const hi = SS(t, F(c, 1, .3), F(c, 1, .45)); if (hi > 0) { g.globalAlpha = hi * .25; g.fillStyle = '#5B4A9E'; g.fillRect(X(1086) - 18, 20, 36, 225); g.fillRect(X(876) - 18, 20, 36, 225); g.globalAlpha = 1; tag(g, X(1086), 22, 'ν₁ 只在拉曼', { size: 16, col: '#5B4A9E', a: hi }); tag(g, X(876), 140, 'ν₂ 只在红外', { size: 16, col: '#5B4A9E', a: hi }); }
  }, { at: b(1) + .1 });
  show(c, at(1260, 590, 540, mc('var(--both)', '对称中心的两个后果', '<ul><li>拉曼与红外选律互斥</li><li>没有压电效应（石英有）</li></ul><div class="cap" style="margin-top:8px">R-3c 含反演；谱带：SSHADE</div>')), F(c, 1, .55));
});

S('m_acid', c => {
  const { b } = c;
  c.head('06', '遇酸冒泡与溶洞');
  canvasLayer(c, 120, 230, 1000, 600, (g, t) => {
    card(g, 1000, 600);
    const t0 = b(0) + .5, h = SS(t, t0, t0 + 3), split = SS(t, t0 + 3.5, t0 + 6), up = SS(t, t0 + 6, t0 + 9.5);
    const cx = 420, cy = 330;
    // CO3 + 2H+
    const P = tri(g, cx, cy, 70, Math.PI / 2, '#E0503F', 1 - split);
    [1, 2].forEach((k, i) => { const p = P[k], x = LERP(p[0] + (i ? 180 : -180), p[0] + (i ? 28 : -28), h), y = LERP(p[1] + 120, p[1] + 20, h); ball(g, x, y, 12, '#CFCFD6', 1 - split); tag(g, x, y - 26, 'H⁺', { size: 18, col: '#454B55', a: 1 - split }); });
    if (split > 0) {
      // H2O
      const wx = LERP(cx, 220, split), wy = LERP(cy + 60, 480, split); ball(g, wx, wy, 22, '#E0503F', split); ball(g, wx - 24, wy + 16, 11, '#CFCFD6', split); ball(g, wx + 24, wy + 16, 11, '#CFCFD6', split); tag(g, wx, wy + 52, 'H₂O', { size: 20, col: '#454B55', a: split });
      // CO2 气泡
      const bx = LERP(cx + 20, 660, split), by = LERP(cy, 160, up) + Math.sin(t * 3) * 6 * up;
      g.globalAlpha = split * .8; g.strokeStyle = 'rgba(31,95,168,.6)'; g.lineWidth = 3; g.beginPath(); g.arc(bx, by, 80, 0, 7); g.stroke(); g.fillStyle = 'rgba(190,220,245,.25)'; g.fill(); g.globalAlpha = 1;
      ball(g, bx - 42, by, 20, '#E0503F', split); ball(g, bx + 42, by, 20, '#E0503F', split); ball(g, bx, by, 15, '#3D3D42', split);
      g.globalAlpha = split; g.strokeStyle = '#3D3D42'; g.lineWidth = 4; [-1, 1].forEach(d => { g.beginPath(); g.moveTo(bx + d * 14, by - 4); g.lineTo(bx + d * 26, by - 4); g.moveTo(bx + d * 14, by + 4); g.lineTo(bx + d * 26, by + 4); g.stroke(); }); g.globalAlpha = 1;
      tag(g, bx, by + 110, 'CO₂ 气泡', { size: 20, col: '#1F5FA8', a: split });
    }
    tag(g, 500, 560, 'CaCO₃ + 2H⁺ → Ca²⁺ + H₂O + CO₂↑', { size: 26, col: '#181B20', font: 'DejaVu Sans Mono, monospace', w: 600 });
  }, { at: b(0) + .1, until: b(1) + .2 });
  const L = show(c, lin(120, 250, 1000, 560, {
    rain: [180, 60, '雨水 + CO₂', 'H₂O + CO₂ → H₂CO₃', 'var(--edit)'], dis: [500, 200, '溶解石灰岩', 'CaCO₃ + H₂CO₃ → Ca²⁺ + 2HCO₃⁻', 'var(--edit)'], cave: [820, 340, '溶洞', '', 'var(--ink2)'],
    drip: [500, 470, '滴到洞顶，CO₂ 逸出', 'Ca²⁺ + 2HCO₃⁻ → CaCO₃ + H₂O + CO₂', 'var(--vis)'], sta: [180, 340, '钟乳石、石笋', '', 'var(--vis)'],
  }, [['rain', 'dis'], ['dis', 'cave'], ['cave', 'drip'], ['drip', 'sta']]), b(1) + .1);
  linIn(c, L, [['rain', b(1) + .3], ['dis', F(c, 1, .35)], ['cave', F(c, 1, .5)], ['drip', F(c, 1, .7)], ['sta', F(c, 1, .85)]]);
  show(c, at(1160, 240, 640, mc('var(--both)', '溶解度', '<ul><li>25 °C：log Ksp = −8.48，Ksp ≈ 3.3×10⁻⁹</li><li>纯水中约 0.0014 g / 100 g</li><li>温度越高越难溶（逆溶解度）</li></ul><div class="cap" style="margin-top:8px">Plummer & Busenberg 1982</div>')), b(0) + 2);
  show(c, at(1160, 560, 640, mc('var(--edit)', '野外的稀盐酸测试', '<ul><li>方解石：块体就明显起泡</li><li>白云石：磨成粉才起泡</li></ul>')), F(c, 0, .6));
});

S('m_heat', c => {
  const { b } = c;
  c.head('07', '加热分解');
  canvasLayer(c, 120, 230, 820, 600, (g, t) => {
    card(g, 820, 600);
    const s = SS(t, b(0) + 2, F(c, 0, .7));
    // CaCO3 → CaO + CO2
    ball(g, 230, 330, 36, '#7FB3E0'); tag(g, 230, 330, 'Ca', { size: 20, col: '#fff' });
    const P = [[380, 260], [380 + LERP(0, 210, s), 400 - LERP(0, 240, s)], [380 + LERP(0, 280, s), 330 - LERP(0, 240, s)]];
    // 留下的 O
    ball(g, LERP(330, 300, s), 330, 26, '#E0503F'); tag(g, LERP(330, 300, s), 330, 'O', { size: 18, col: '#fff' });
    const cxx = LERP(420, 600, s), cyy = LERP(330, 90 + 40, s);
    g.strokeStyle = '#3D3D42'; g.lineWidth = 4; g.globalAlpha = 1 - s; g.beginPath(); g.moveTo(cxx, cyy); g.lineTo(LERP(330, 300, s), 330); g.stroke(); g.globalAlpha = 1;
    [-1, 1].forEach(d => { const x = cxx + d * LERP(60, 50, s) * (s > .5 ? 1 : .8), y = cyy + (s > .5 ? 0 : d * 50); g.strokeStyle = '#3D3D42'; g.beginPath(); g.moveTo(cxx, cyy); g.lineTo(x, y); g.stroke(); ball(g, x, y, 24, '#E0503F'); });
    ball(g, cxx, cyy, 17, '#3D3D42');
    tag(g, 600, 200, 'CO₂', { size: 24, col: '#454B55', a: s });
    tag(g, 265, 420, 'CaO（生石灰）', { size: 22, col: '#1F5FA8', a: s });
    tag(g, 410, 540, 'CaCO₃ → CaO + CO₂　ΔH° = +177.8 kJ/mol', { size: 24, col: '#181B20', w: 600 });
  }, { at: b(0) + .1 });
  canvasLayer(c, 980, 230, 820, 600, (g, t) => {
    card(g, 820, 600);
    const Pe = T => 4.083e7 * Math.exp(-20474 / (T + 273.15)), X = T => 90 + (T - 600) / 450 * 680, Y = p => 500 - Math.log10(p) * 120 - 360;
    g.strokeStyle = '#C8CCC4'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(90, 60); g.lineTo(90, 520); g.lineTo(780, 520); g.stroke();
    [600, 700, 800, 900, 1000].forEach(T => tag(g, X(T), 545, `${T}`, { size: 15, col: '#7D838D', w: 500 }));
    [.001, .01, .1, 1, 10].forEach(p => tag(g, 55, Y(p), `${p}`, { size: 15, col: '#7D838D', w: 500 }));
    const pr = SS(t, b(1) + .3, F(c, 1, .5)); g.strokeStyle = '#B5651D'; g.lineWidth = 4; g.beginPath(); for (let T = 600; T <= 600 + 450 * pr; T += 3) { const y = Math.max(50, Y(Pe(T))); T === 600 ? g.moveTo(X(T), y) : g.lineTo(X(T), y); } g.stroke();
    const m = SS(t, F(c, 1, .5), F(c, 1, .6)); g.globalAlpha = m; g.setLineDash([6, 6]); g.strokeStyle = '#5B4A9E'; g.beginPath(); g.moveTo(90, Y(1)); g.lineTo(X(895), Y(1)); g.lineTo(X(895), 520); g.stroke(); g.setLineDash([]); g.globalAlpha = 1;
    ball(g, X(895), Y(1), 9 * m + .1, '#5B4A9E'); tag(g, X(895) - 10, Y(1) - 28, '约 895 °C 达 1 atm', { size: 19, col: '#5B4A9E', a: m });
    tag(g, 430, 30, '平衡 CO₂ 压力（atm，对数）', { size: 17, col: '#7D838D', w: 500 }); tag(g, 430, 575, '温度（°C）', { size: 16, col: '#7D838D', w: 500 });
  }, { at: b(1) + .1 });
  show(c, at(120, 850, 1680, `<div class="cap">P(atm) ≈ 4.083×10⁷·exp(−20474/T)（Universidad de Sevilla 石灰石煅烧研究）；1 atm 对应温度为推算值；工业煅烧 900–950 °C</div>`), F(c, 1, .4));
});

S('m_glow', c => {
  const { b } = c;
  c.head('08', '杂质让它发光');
  canvasLayer(c, 120, 230, 800, 600, (g, t) => {
    g.fillStyle = '#0B1020'; g.beginPath(); g.roundRect(0, 0, 800, 600, 16); g.fill();
    const on = SS(t, b(0) + 3, b(0) + 4.5), pulse = .75 + .25 * Math.sin(t * 3);
    for (let r = 0; r < 7; r++) for (let k = 0; k < 9; k++) {
      const x = 70 + k * 82 + (r % 2) * 41, y = 70 + r * 76, mn = (r === 2 && k === 3) || (r === 4 && k === 6);
      if (mn) { const gr = g.createRadialGradient(x, y, 4, x, y, 80); gr.addColorStop(0, `rgba(255,150,60,${.8 * on * pulse})`); gr.addColorStop(1, 'rgba(255,120,40,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 80, 0, 7); g.fill(); }
      ball(g, x, y, 16, mn ? '#F08A24' : '#7FB3E0', mn ? 1 : .85);
      if (k < 8) tri(g, x + 41, y + 38, 12, Math.PI / 2 + (r % 2) * Math.PI / 3, '#E0503F', .6);
    }
    tag(g, 400, 570, 'Mn²⁺（橙）替换 Ca²⁺，受激发后发出约 610 nm 的光（示意）', { size: 19, col: '#F2C18D' });
  }, { at: b(0) + .1 });
  // 发射谱 + 环带
  canvasLayer(c, 960, 230, 840, 600, (g, t) => {
    card(g, 840, 600);
    const a = SS(t, F(c, 0, .5), F(c, 0, .7)), X = l => 60 + (l - 450) / 300 * 720;
    for (let l = 450; l <= 750; l += 2) { const h = Math.exp(-(((l - 612) / 28) ** 2)) * 200 * a; g.fillStyle = `hsl(${Math.max(0, 260 - (l - 450) * .9)},80%,55%)`; g.fillRect(X(l), 260 - h, 5, h); }
    [450, 550, 650, 750].forEach(l => tag(g, X(l), 280, `${l}`, { size: 14, col: '#9AA0A8', w: 500 })); tag(g, 420, 30, '阴极发光谱：峰 580–640 nm（多在 605–620）', { size: 17, col: '#7D838D', w: 500 });
    // 环带（示意）
    const z = SS(t, b(1) + .3, b(1) + 2);
    for (let i = 9; i >= 0; i--) { const s = 20 + i * 22, br = [.9, .3, .7, .2, .85, .4, .6, .15, .5, .3][i]; g.globalAlpha = z; g.fillStyle = `rgba(${200 + 55 * br},${90 + 80 * br},${30},${.25 + .7 * br})`; g.save(); g.translate(420, 450); g.rotate(-.2); g.beginPath(); g.moveTo(-s * 1.4, 0); g.lineTo(0, -s * .6); g.lineTo(s * 1.4, 0); g.lineTo(0, s * .6); g.closePath(); g.fill(); g.restore(); g.globalAlpha = 1; }
    tag(g, 420, 580, '生长环带：每一圈的亮暗记录当时的 Mn / Fe（示意）', { size: 17, col: '#454B55', a: z });
  }, { at: b(0) + .3 });
  show(c, at(120, 850, 1680, `<div class="cap">Mn²⁺ 与三价稀土为主要激活剂，低于 1 ppm 可检出，Fe²⁺ 猝灭（Mineral. Mag. 71:493）</div>`), F(c, 0, .6));
});

S('m_end', c => {
  const { b } = c;
  c.head('09', '总结');
  const L = show(c, lin(120, 240, 1680, 560, {
    s: [200, 270, '扁平 CO₃ 平行成层', '层间：Ca²⁺ 离子键 · R-3c 含对称中心', 'var(--both)'],
    p1: [900, 40, '电子云极化各向异性', '', 'var(--ink2)'], p2: [900, 170, '弱 Ca–O · 中性解理面', '', 'var(--ink2)'], p3: [900, 300, 'CO₃ 扭摆 · 八面体膨胀', '', 'var(--ink2)'], p4: [900, 430, '对称中心', '', 'var(--ink2)'], p5: [900, 540, '弱酸根 CO₃²⁻', '', 'var(--ink2)'],
    q1: [1450, 40, '强双折射', '1.658 / 1.486', 'var(--vis)'], q2: [1450, 170, '菱形解理 · 莫氏 3', '74°55′', 'var(--vis)'], q3: [1450, 300, '反向热膨胀', '∥c + / ⊥c −', 'var(--vis)'], q4: [1450, 430, '光谱互斥 · 无压电', '', 'var(--vis)'], q5: [1450, 540, '遇酸起泡 · 热分解', '', 'var(--vis)'],
  }, [['s', 'p1'], ['s', 'p2'], ['s', 'p3'], ['s', 'p4'], ['s', 'p5'], ['p1', 'q1'], ['p2', 'q2'], ['p3', 'q3'], ['p4', 'q4'], ['p5', 'q5']]), b(0) + .1);
  linIn(c, L, [['s', b(0) + .2], ['p1', F(c, 0, .35)], ['q1', F(c, 0, .4)], ['p2', F(c, 0, .5)], ['q2', F(c, 0, .55)], ['p3', F(c, 0, .65)], ['q3', F(c, 0, .7)], ['p4', F(c, 0, .8)], ['q4', F(c, 0, .85)], ['p5', F(c, 0, .9)], ['q5', F(c, 0, .95)]]);
  show(c, at(120, 840, 1680, `<div class="det" style="position:static;font-size:20px"><span class="h">资料</span>调研文档《方解石：从原子到宏观性质》与参考资料 · github.com/Memkits/desk · sources/calcite</div>`), b(1) + .3);
});
