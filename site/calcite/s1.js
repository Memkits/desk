// 方解石 · 上集：从原子到双像
const mc = (col, h, body, s = '') => `<div class="mc" style="--c:${col}">${s ? `<div class="s">${s}</div>` : ''}<h3>${h}</h3>${body}</div>`;
const panel = (x, y, w, h, st = '') => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:18px;${st}"></div>`;
const DARK = 'background:#0B1020;box-shadow:0 12px 40px rgba(20,20,40,.25)';

// ---------- 双像演示：一块菱面体压在字上 ----------
function doubleImage(g, t, W, H, o = {}) {
  g.fillStyle = '#FBFAF6'; g.beginPath(); g.roundRect(0, 0, W, H, 18); g.fill();
  const lines = o.lines || ['方解石 CaCO₃', 'CALCITE · 冰洲石', '双折射 Δn = 0.172', '1669 · Bartholin'];
  const ink = (dx, dy, a, col) => { g.globalAlpha = a; g.fillStyle = col; g.textAlign = 'left'; g.textBaseline = 'middle'; lines.forEach((s, i) => { g.font = `${i ? 600 : 800} ${i ? 38 : 52}px "Noto Serif CJK SC", serif`; g.fillText(s, 70 + dx, 110 + i * 92 + dy); }); g.globalAlpha = 1; };
  ink(0, 0, 1, '#22262C');
  const rot = o.rot ? o.rot(t) : 0, L = o.L || 270, cx = o.cx || 330, cy = o.cy || H * .5;
  const al = 101.9 * Math.PI / 180, u = [L * Math.cos(rot), L * Math.sin(rot)], v = [L * Math.cos(rot + al), L * Math.sin(rot + al)];
  const P = [[0, 0], u, [u[0] + v[0], u[1] + v[1]], v].map(p => [cx + p[0] - (u[0] + v[0]) / 2, cy + p[1] - (u[1] + v[1]) / 2]);
  // 钝角顶点 P0（夹角 101.9°）与 P2；短对角线 P0→P2 方向
  const sd = [P[2][0] - P[0][0], P[2][1] - P[0][1]], sl = Math.hypot(...sd), dsh = o.shift ?? 30, d = [sd[0] / sl * dsh, sd[1] / sl * dsh];
  const path = () => { g.beginPath(); P.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); };
  g.save(); path(); g.clip();
  g.fillStyle = '#FBFAF6'; g.fillRect(0, 0, W, H);
  const pol = o.pol ? o.pol(t) : null, ao = pol === null ? .62 : .1 + .85 * Math.cos(pol) ** 2, ae = pol === null ? .62 : .1 + .85 * Math.sin(pol) ** 2;
  ink(0, 0, ao, '#1F5FA8'); ink(-d[0], -d[1], ae, '#B5651D');
  const gr = g.createLinearGradient(P[0][0], P[0][1], P[2][0], P[2][1]); gr.addColorStop(0, 'rgba(190,220,240,.28)'); gr.addColorStop(.5, 'rgba(255,255,255,.08)'); gr.addColorStop(1, 'rgba(170,200,225,.3)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore();
  // 厚度：上表面偏移
  const off = [-16, -22], Q = P.map(p => [p[0] + off[0], p[1] + off[1]]);
  g.strokeStyle = 'rgba(70,100,130,.75)'; g.lineWidth = 2.5; path(); g.stroke();
  g.beginPath(); Q.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.strokeStyle = 'rgba(70,100,130,.45)'; g.stroke();
  P.forEach((p, i) => { g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(Q[i][0], Q[i][1]); g.stroke(); });
  if (o.axis) { const a = o.axis(t); if (a > 0) { g.globalAlpha = a; g.setLineDash([8, 7]); g.strokeStyle = '#5B4A9E'; g.lineWidth = 3; g.beginPath(); g.moveTo(P[0][0], P[0][1]); g.lineTo(P[2][0], P[2][1]); g.stroke(); g.setLineDash([]); tag(g, P[0][0] - 10, P[0][1] - 26, '钝角顶点', { col: '#5B4A9E', size: 20, a }); g.globalAlpha = 1; } }
  if (pol !== null) { const px = W - 120, py = 110; g.strokeStyle = '#454B55'; g.lineWidth = 3; g.beginPath(); g.arc(px, py, 62, 0, 7); g.stroke(); g.fillStyle = 'rgba(60,60,70,.12)'; g.fill(); for (let k = -3; k <= 3; k++) { const s = Math.sin(pol), c2 = Math.cos(pol), w = Math.sqrt(62 * 62 - (k * 15) ** 2); g.beginPath(); g.moveTo(px + c2 * k * 15 - s * w, py + s * k * 15 + c2 * w); g.lineTo(px + c2 * k * 15 + s * w, py + s * k * 15 - c2 * w); g.strokeStyle = 'rgba(60,60,70,.35)'; g.lineWidth = 2; g.stroke(); } tag(g, px, py + 92, '偏振片', { size: 20, col: '#454B55' }); }
}

S('k_open', c => {
  const { b, be } = c;
  show(c, at(120, 170, 760, `<div style="font:600 26px var(--sans);letter-spacing:.3em;color:var(--ink3)">矿物物理 · 上集</div><div style="font:900 150px/1.1 var(--serif);margin-top:12px">方解石</div><div style="font:700 48px var(--serif);color:var(--ink2);margin-top:8px">从原子到双像</div>`), .1, be(0) + .2);
  show(c, det(120, 650, 760, '说明', 'AI 协助整理（稿件与画面：Claude；配音：Gemini TTS，1.25 倍速）。原子结构按实测坐标绘制；电子云、波前为示意。'), b(0) + 2.5, be(0) + .2);
  canvasLayer(c, 900, 170, 900, 640, (g, t) => doubleImage(g, t, 900, 640, { rot: t => -.35 + .5 * SS(t, 4, 14) + .45 * Math.sin(Math.max(0, t - 14) * .35), axis: t => SS(t, b(1) - 1, b(1)) * (1 - SS(t, b(1) + 6, b(1) + 7)) }), { until: be(0) + .2 });
  show(c, at(120, 210, 1680, `<div style="display:grid;grid-template-columns:1fr 1fr;gap:26px">${mc('var(--edit)', '上集 · 从原子到双像', '<ul><li>钙离子与碳酸根的电子云</li><li>从食盐结构到方解石结构</li><li>电子云的极化 → 双折射</li><li>冰洲石与光学史</li></ul>')}${mc('var(--vis)', '下集 · 力、热与化学', '<ul><li>为什么碎成菱形</li><li>硬度、孪晶与反向热膨胀</li><li>振动光谱、遇酸、热分解、发光</li></ul>')}</div>`), b(1) + .1);
  show(c, concl(120, 600, 1680, '一条线索：<b>平面的碳酸根，整整齐齐地排成了层</b>'), F(c, 1, .55));
});

S('k_ca', c => {
  const { b } = c;
  c.head('01', '钙离子：一个硬球');
  // 径向分布（示意）
  const shells = [[.07, .045, 2, '1s'], [.32, .1, 8, 'n=2'], [.95, .22, 8, 'n=3'], [2.15, .45, 2, '4s']];
  canvasLayer(c, 120, 240, 820, 520, (g, t) => {
    const X = r => 70 + r * 230, Y = v => 450 - v * 1.5, gone = SS(t, F(c, 0, .55), F(c, 0, .85));
    g.fillStyle = '#fff'; g.beginPath(); g.roundRect(0, 0, 820, 520, 16); g.fill();
    g.strokeStyle = '#C8CCC4'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(70, 450); g.lineTo(780, 450); g.moveTo(70, 450); g.lineTo(70, 40); g.stroke();
    for (let r = 0; r <= 3; r += .5) tag(g, X(r), 474, r.toFixed(1), { size: 16, col: '#7D838D', w: 500 });
    tag(g, 430, 500, '离核距离 r（Å）', { size: 18, col: '#7D838D', w: 500 });
    tag(g, 40, 245, '4πr²ρ', { size: 18, col: '#7D838D', w: 500 });
    const f = (r, k4) => shells.reduce((s, [m, w, n], i) => s + (i === 3 ? k4 : 1) * n * Math.exp(-(((r - m) / w) ** 2)) / (w * 1.77) * 5, 0);
    const prog = SS(t, b(0) + .3, F(c, 0, .45));
    g.beginPath(); for (let i = 0; i <= 600; i++) { const r = 3 * i / 600; if (r > 3 * prog) break; const y = Y(Math.min(260, f(r, 1 - gone))); i ? g.lineTo(X(r), y) : g.moveTo(X(r), y); }
    g.strokeStyle = '#1F5FA8'; g.lineWidth = 3.5; g.stroke();
    shells.forEach(([m, , , l], i) => { const a = SS(t, b(0) + .5 + i * .8, b(0) + 1 + i * .8) * (i === 3 ? 1 - gone * .7 : 1); tag(g, X(m) + (i === 0 ? 18 : 0), i === 3 ? Y(f(m, 1 - gone)) - 22 : 60 + i * 0, l, { size: 19, col: i === 3 ? '#C2462E' : '#1F5FA8', a }); });
    if (gone > 0) { for (let k = 0; k < 2; k++) { const x = X(2.15) + gone * 220, y = Y(40) - k * 50 - gone * 60; g.globalAlpha = 1 - SS(t, F(c, 0, .9), F(c, 0, 1)); g.fillStyle = '#C2462E'; g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); tag(g, x + 22, y, 'e⁻', { size: 18, col: '#C2462E' }); g.globalAlpha = 1; } }
    tag(g, 470, 30, '示意：钙的电子按壳层分布（峰位为近似值）', { size: 16, col: '#9AA0A8', w: 500 });
  }, { at: b(0) + .1 });
  // 电子云：中性原子 → 离子；E 场下几乎不动
  canvasLayer(c, 980, 240, 520, 520, (g, t) => {
    g.fillStyle = '#0B1020'; g.beginPath(); g.roundRect(0, 0, 520, 520, 16); g.fill();
    const gone = SS(t, F(c, 0, .55), F(c, 0, .85)), E = SS(t, b(1) + 1, b(1) + 2) * Math.sin((t - b(1)) * 4), dx = .05 * E;
    const W = 130, img = densityImage(g, W, W, { x0: 0, y0: 0, ppa: W / 6.4 }, [{ x: dx, y: 0, s: .35, w: 3 }, { x: dx, y: 0, s: .8, w: .9 }, { x: dx * .9, y: 0, s: 1.25, w: .35 }, { x: 0, y: 0, s: 2.3, w: .12 * (1 - gone) }], 1.1);
    const off = document.createElement('canvas'); off.width = off.height = W; off.getContext('2d').putImageData(img, 0, 0);
    g.imageSmoothingEnabled = true; g.drawImage(off, 20, 20, 480, 480);
    g.fillStyle = '#fff'; g.beginPath(); g.arc(260, 260, 5, 0, 7); g.fill();
    tag(g, 260, 488, gone > .5 ? 'Ca²⁺：[Ar] 闭壳层' : 'Ca 原子：[Ar] 4s²', { size: 20, col: '#E8EEF8' });
    if (t > b(1) + .8) { arrow(g, 260 - 90, 60, 260 - 90 + 180 * (.5 + .5 * E), 60, '#F0B86E', 5, 16, SS(t, b(1) + .8, b(1) + 1.3)); tag(g, 260, 30, '外加电场 E 来回振荡', { size: 18, col: '#F0B86E' }); }
  }, { at: b(0) + .2 });
  show(c, at(1540, 240, 260, `<div class="mc" style="--c:var(--edit);padding:16px 18px"><h3 style="font-size:24px">钙</h3><div style="font-size:19px;line-height:1.6;color:var(--ink2)">Z = 20<br>[Ar] 4s² → Ca²⁺<br>球对称、闭壳层<br>极化率小</div></div>`), F(c, 0, .9));
  show(c, concl(120, 800, 1680, 'Ca²⁺：<b>提供正电荷和离子键</b>，对方向几乎不敏感'), F(c, 1, .55));
});

// ---------- 碳酸根 ----------
function lobe(g, cx, cy, ang, L, col, a = 1, back = .25) {
  g.globalAlpha = a; g.beginPath();
  for (let i = 0; i <= 120; i++) { const th = -Math.PI / 2 + Math.PI * i / 120, r = L * Math.cos(th) ** 2; const x = cx + r * Math.cos(th + ang), y = cy - r * Math.sin(th + ang); i ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.closePath(); const gr = g.createRadialGradient(cx + L * .55 * Math.cos(ang), cy - L * .55 * Math.sin(ang), 4, cx + L * .5 * Math.cos(ang), cy - L * .5 * Math.sin(ang), L * .6); gr.addColorStop(0, shade(col, .55)); gr.addColorStop(1, col); g.fillStyle = gr; g.fill();
  if (back) { g.beginPath(); for (let i = 0; i <= 60; i++) { const th = -Math.PI / 2 + Math.PI * i / 60, r = L * back * Math.cos(th) ** 2; const x = cx - r * Math.cos(th + ang), y = cy + r * Math.sin(th + ang); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); g.fillStyle = shade(col, -.3); g.fill(); }
  g.globalAlpha = 1;
}
S('k_co3', c => {
  const { b } = c;
  c.head('02', '碳酸根：一张扁平的电子云');
  // 左：sp² 杂化 → σ 键 → π 云
  canvasLayer(c, 120, 230, 820, 560, (g, t) => {
    g.fillStyle = '#fff'; g.beginPath(); g.roundRect(0, 0, 820, 560, 16); g.fill();
    const cx = 300, cy = 290, m = SS(t, b(0) + 1.5, F(c, 0, .3)), oin = SS(t, F(c, 0, .32), F(c, 0, .48)), pz = SS(t, F(c, 0, .5), F(c, 0, .62)), pi = SS(t, F(c, 0, .7), F(c, 0, .85));
    // s 与 p 轨道 → 三个 sp² 叶
    if (m < 1) { g.globalAlpha = 1 - m; g.fillStyle = 'rgba(31,95,168,.35)'; g.beginPath(); g.arc(cx, cy, 40, 0, 7); g.fill(); lobe(g, cx, cy, 0, 110, '#1F5FA8', 1 - m, 1); lobe(g, cx, cy, Math.PI / 2, 110, '#1F5FA8', 1 - m, 1); g.globalAlpha = 1; tag(g, cx, 470, '一个 s + 两个 p 轨道', { size: 20, col: '#454B55', a: 1 - m }); }
    for (let i = 0; i < 3; i++) lobe(g, cx, cy, Math.PI / 2 + i * 2 * Math.PI / 3, 130, '#5B8FD0', m * (1 - pi * .55));
    if (m > 0) tag(g, cx, 470, 'sp² 杂化：三个叶片，彼此 120°', { size: 20, col: '#1F5FA8', a: m * (1 - oin) });
    // 三个 O 靠近
    for (let i = 0; i < 3; i++) { const th = Math.PI / 2 + i * 2 * Math.PI / 3, r = LERP(330, 165, oin); const x = cx + r * Math.cos(th), y = cy - r * Math.sin(th); g.globalAlpha = oin; const gr = g.createRadialGradient(x - 10, y - 12, 3, x, y, 34); gr.addColorStop(0, '#FFB3A8'); gr.addColorStop(1, '#C93A2C'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 34, 0, 7); g.fill(); tag(g, x, y, 'O', { size: 22, col: '#fff' }); g.globalAlpha = 1; }
    if (oin > .5) tag(g, cx, 470, '与三个氧形成 σ 键，C–O = 1.28 Å', { size: 20, col: '#C93A2C', a: SS(oin, .5, 1) * (1 - pz) });
    g.fillStyle = '#3D3D42'; g.beginPath(); g.arc(cx, cy, 24, 0, 7); g.fill(); tag(g, cx, cy, 'C', { size: 20, col: '#fff' });
    // 侧视：p 轨道垂直于平面 → π 云
    const sx = 650, sy = 290;
    if (pz > 0) {
      g.globalAlpha = pz; g.strokeStyle = '#7D838D'; g.lineWidth = 3; g.beginPath(); g.moveTo(sx - 120, sy); g.lineTo(sx + 120, sy); g.stroke(); tag(g, sx, 470, '侧视：分子平面', { size: 20, col: '#454B55', a: pz * (1 - pi) }); g.globalAlpha = 1;
      [-110, 0, 110].forEach((dx, k) => { const L = 70; if (pi < 1) { lobe(g, sx + dx * .9, sy, Math.PI / 2, L, '#2E7D4F', pz * (1 - pi), 0); lobe(g, sx + dx * .9, sy, -Math.PI / 2, L, '#9AC9A8', pz * (1 - pi), 0); } });
      if (pi > 0) { g.globalAlpha = pi; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(sx, sy - s * 42, 150, 34, 0, 0, 7); const gr = g.createLinearGradient(sx, sy - s * 76, sx, sy - s * 8); gr.addColorStop(0, s > 0 ? '#BFE3C9' : '#D7EEDD'); gr.addColorStop(1, s > 0 ? '#2E7D4F' : '#6FB383'); g.fillStyle = gr; g.fill(); } g.globalAlpha = 1; tag(g, sx, 470, '离域的 π 电子云：在平面上下各一片', { size: 20, col: '#2E7D4F', a: pi }); }
      [-110, 110].forEach(dx => { g.fillStyle = '#C93A2C'; g.beginPath(); g.arc(sx + dx, sy, 18, 0, 7); g.fill(); }); g.fillStyle = '#3D3D42'; g.beginPath(); g.arc(sx, sy, 15, 0, 7); g.fill();
    }
  }, { at: b(0) + .1 });
  // 右：共振结构 → 平均 → 电子密度
  const res = k => { const pos = [[0, 1], [1, 2], [2, 0]]; return `<svg width="200" height="180" viewBox="-100 -95 200 180">${[0, 1, 2].map(i => { const th = Math.PI / 2 + i * 2 * Math.PI / 3, x = 62 * Math.cos(th), y = -62 * Math.sin(th), dbl = i === k; return `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="#3D3D42" stroke-width="4"/>${dbl ? `<line x1="${-y * .1}" y1="${x * .1}" x2="${x - y * .1}" y2="${y + x * .1}" stroke="#3D3D42" stroke-width="4"/>` : ''}<circle cx="${x}" cy="${y}" r="17" fill="#E0503F"/><text x="${x}" y="${y + 6}" fill="#fff" font-size="16" text-anchor="middle" font-weight="700">O</text>${dbl ? '' : `<text x="${x * 1.42}" y="${y * 1.42 + 6}" fill="#C2462E" font-size="20" text-anchor="middle" font-weight="700">−</text>`}`; }).join('')}<circle r="13" fill="#3D3D42"/></svg>`; };
  const R = show(c, at(980, 240, 820, `<div style="display:flex;align-items:center;gap:6px">${[0, 1, 2].map((k, i) => `${i ? '<span style="font-size:30px;color:var(--ink3)">↔</span>' : ''}<div class="rs">${res(k)}</div>`).join('')}</div><div class="cap" style="text-align:center;margin-top:4px">三个共振结构（化学书上的画法）</div>`), b(1) + .1);
  [...R.querySelectorAll('.rs')].forEach((e, i) => c.in(e, b(1) + .2 + i * .9, { dy: 8 }));
  canvasLayer(c, 980, 520, 400, 300, (g, t) => {
    g.fillStyle = '#0B1020'; g.beginPath(); g.roundRect(0, 0, 400, 300, 14); g.fill();
    const W = 120, H = 90, img = densityImage(g, W, H, { x0: 0, y0: 0, ppa: W / 5.2 }, co3Gauss(Math.PI / 2), .9);
    const off = document.createElement('canvas'); off.width = W; off.height = H; off.getContext('2d').putImageData(img, 0, 0); g.drawImage(off, 0, 0, 400, 300);
    tag(g, 200, 278, '平均后的电子密度（示意）', { size: 17, col: '#E8EEF8' });
  }, { at: F(c, 1, .45) });
  show(c, at(1400, 520, 400, `<div class="mc" style="--c:var(--both);padding:16px 18px"><h3 style="font-size:24px">真实的碳酸根</h3><div style="font-size:19px;line-height:1.65;color:var(--ink2)">三个 C–O 完全等价<br>键长 1.2815 Å<br>键级 1⅓ · 每个 O 带 −⅔<br>O–C–O = 120°</div><div class="cap" style="margin-top:6px">Effenberger 等 1981</div></div>`), F(c, 1, .55));
});

// ---------- 晶体：从食盐到方解石 ----------
S('k_nacl', c => {
  const { b } = c;
  c.head('03', '从食盐到方解石');
  canvasLayer(c, 120, 220, 1100, 640, (g, t) => {
    const mix = SS(t, F(c, 0, .38), F(c, 0, .6)), sq = SS(t, F(c, 0, .65), F(c, 0, .95)), alpha = LERP(90, 101.9, sq);
    const cam = camera({ yaw: .55 + t * .06, pitch: .18, scale: 29, cx: 550, cy: 300, persp: 60 });
    const { its, B } = blockItems(alpha, mix, { tri: 1 });
    // 立方体 / 菱面体外框
    const cen = fromFrac(B, [1, 1, 1]), V = f => V3.sub(fromFrac(B, f), cen), E = [[0, 0, 0], [2, 0, 0], [0, 2, 0], [0, 0, 2]];
    const cor = [[0, 0, 0], [2, 0, 0], [0, 2, 0], [0, 0, 2], [2, 2, 0], [2, 0, 2], [0, 2, 2], [2, 2, 2]];
    const ed = [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 4], [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]];
    ed.forEach(([i, j]) => its.push({ k: 'line', a: V(cor[i]), b: V(cor[j]), col: 'rgba(90,100,115,.55)', w: 2 }));
    const ax = SS(t, b(1) + .5, b(1) + 2), od = SS(t, F(c, 1, .35), F(c, 1, .5));
    if (ax > 0) { its.push({ k: 'line', a: V3.mul(V([2, 2, 2]), 1.25), b: V3.mul(V([0, 0, 0]), 1.25), col: `rgba(91,74,158,${ax})`, w: 5 }); }
    if (od > 0) [[[2, 0, 0], [0, 2, 2]], [[0, 2, 0], [2, 0, 2]], [[0, 0, 2], [2, 2, 0]]].forEach(([p, q]) => its.push({ k: 'line', a: V(p), b: V(q), col: `rgba(125,131,141,${od * .8})`, w: 2.5, dash: [8, 7] }));
    draw3(g, cam, its);
    if (ax > 0) { const q = cam(V3.mul(V([2, 2, 2]), 1.3)); tag(g, q[0] + 50, q[1] - 6, 'c 轴（光轴）', { size: 24, col: '#5B4A9E', a: ax }); }
    tag(g, 550, 618, mix < .5 ? 'NaCl：Na⁺（紫）与 Cl⁻（绿）' : `方解石：Ca²⁺（蓝）与 CO₃²⁻ · 菱面体夹角 ${alpha.toFixed(1)}°`, { size: 22, col: '#454B55' });
  }, { at: b(0) + .1 });
  const st = show(c, at(1260, 230, 540, `<div class="steps">${['食盐：立方格子', 'Na → Ca，Cl → 平放的 CO₃', '沿体对角线压扁：90° → 101.9°', '体对角线 → c 轴'].map((s, i) => `<div class="stp"><b>${i + 1}</b>${s}</div>`).join('')}</div>`), b(0) + .1);
  const S4 = [...st.querySelectorAll('.stp')]; [b(0) + .2, F(c, 0, .38), F(c, 0, .65), b(1) + .4].forEach((tt, i) => c.in(S4[i], tt, { dx: -10, dy: 0 }));
  show(c, at(1260, 560, 540, mc('var(--both)', '对称性降低', '<ul><li>立方体有 4 条等价的体对角线</li><li>压扁后只剩 1 条特殊：三次轴</li><li>立方 → 三方；所有 CO₃ 垂直于它</li></ul>')), F(c, 1, .45));
});

S('k_layer', c => {
  const { b } = c;
  c.head('04', '层、配位和晶胞');
  const grp = CAL.groups(p => Math.hypot(p[0], p[1]) < 7.2 && p[2] > -.1 && p[2] < 17.2, 3, 1);
  canvasLayer(c, 120, 220, 1000, 650, (g, t) => {
    const zoom = SS(t, F(c, 0, .55), F(c, 0, .8)), cell = SS(t, b(1) + .3, F(c, 1, .2)), top = SS(t, F(c, 0, .22), F(c, 0, .3)) * (1 - SS(t, F(c, 0, .48), F(c, 0, .55)));
    const cen = [0, 0, 8.5], cam = camera({ yaw: .35 + t * .03, pitch: LERP(.12, .25, zoom) + top * 1.3, scale: LERP(31, 70, zoom), cx: 500, cy: 330, persp: 80, center: V3.lerp(cen, [0, 0, 8.53], zoom) });
    const its = [], hiCa = [0, 0, 8.5305], near = p => V3.len(V3.sub(p, hiCa)) < 4.2;
    for (const p of grp.Ca) its.push({ k: 'ball', p, r: .55, col: ACOL.Ca, a: zoom > 0 && !near(p) ? 1 - zoom * .85 : 1 });
    for (const q of grp.G) { const al = zoom > 0 && !near(q.c) ? 1 - zoom * .85 : 1; its.push({ k: 'ball', p: q.c, r: .3, col: ACOL.C, a: al }); q.o.forEach(o => { its.push({ k: 'ball', p: o, r: .42, col: ACOL.O, a: al }); its.push({ k: 'bond', a: q.c, b: o, w: .14, col: '#555', al }); }); its.push({ k: 'poly', pts: q.o, fill: 'rgba(224,80,63,.28)', al, bias: .2 }); }
    if (zoom > 0) { const Os = grp.O.map(o => o.p).filter(o => Math.abs(V3.len(V3.sub(o, hiCa)) - 2.36) < .05); Os.forEach(o => its.push({ k: 'bond', a: hiCa, b: o, w: .12, col: '#7FB3E0', al: zoom })); its.push({ k: 'ball', p: hiCa, r: .62, col: ACOL.Ca, ring: '#1F5FA8' }); }
    if (cell > 0) { const a1 = CAL.cart([1, 0, 0]), a2 = CAL.cart([0, 1, 0]), z = [0, 0, CAL.c]; const B0 = [[0, 0, 0], a1, V3.add(a1, a2), a2]; for (let i = 0; i < 4; i++) { const p = B0[i], q = B0[(i + 1) % 4]; its.push({ k: 'line', a: p, b: q, col: `rgba(91,74,158,${cell})`, w: 3 }); its.push({ k: 'line', a: V3.add(p, z), b: V3.add(q, z), col: `rgba(91,74,158,${cell})`, w: 3 }); its.push({ k: 'line', a: p, b: V3.add(p, z), col: `rgba(91,74,158,${cell})`, w: 3 }); } }
    draw3(g, cam, its);
    if (zoom > .5) tag(g, 500, 600, 'Ca 的六个氧来自六个不同的碳酸根：上三、下三；Ca–O = 2.36 Å', { size: 21, col: '#1F5FA8', a: SS(zoom, .5, 1) * (1 - cell) });
    if (top > .3) tag(g, 500, 600, '同一层朝向相同，相邻两层转 60°', { size: 21, col: '#C93A2C', a: top });
    if (cell > 0) tag(g, 500, 600, '六方晶胞：a = 4.99 Å，c = 17.06 Å，含 6 个 CaCO₃', { size: 21, col: '#5B4A9E', a: cell });
  }, { at: b(0) + .1 });
  const t1 = show(c, at(1160, 230, 640, tbl([['量', '数值'], ['空间群', 'R-3c（167 号），三方'], ['六方晶胞', 'a = 4.9896 Å，c = 17.061 Å'], ['每胞', '6 CaCO₃ = 30 个原子'], ['CO₃ 层间距', 'c / 6 ≈ 2.84 Å'], ['Ca 配位', '6 个 O，八面体，2.36 Å'], ['解理菱面体', 'a = 6.43 Å，α = 101.9°'], ['密度', '2.71 g/cm³']], { st: 'font-size:20px' })), b(0) + .3);
  rowsIn(c, t1, [[0, b(0) + .3], [4, F(c, 0, .2)], [5, F(c, 0, .6)], [1, b(1) + .2], [2, F(c, 1, .2)], [3, F(c, 1, .35)], [6, F(c, 1, .7)], [7, F(c, 1, .85)]]);
  show(c, at(1160, 720, 640, `<div class="cap">原子坐标：Effenberger 等 1981（Z. Kristallogr. 156:233）；R-3c 含对称中心</div>`), F(c, 1, .4));
});

// ---------- 极化 ----------
S('k_pol', c => {
  const { b } = c;
  c.head('05', '电子云怎么回应光');
  const view = (x, side, label, amp) => canvasLayer(c, x, 230, 600, 470, (g, t) => {
    g.fillStyle = '#0B1020'; g.beginPath(); g.roundRect(0, 0, 600, 470, 16); g.fill();
    const on = SS(t, b(0) + 3, b(0) + 4), ph = Math.sin((t - b(0)) * 3.2) * on, d = amp * ph, W = 150, H = 118;
    let gs = co3Gauss(Math.PI / 2, side ? 0 : d, 0);
    if (side) gs = gs.map(q => ({ x: q.x, y: d, sx: q.s, sy: q.s * .45, w: q.w }));
    const img = densityImage(g, W, H, { x0: 0, y0: 0, ppa: W / 5.4 }, gs, .9);
    const off = document.createElement('canvas'); off.width = W; off.height = H; off.getContext('2d').putImageData(img, 0, 0); g.drawImage(off, 0, 0, 600, 470);
    // 原子核位置
    const P = side ? [[0, 0], [1.28 * Math.cos(Math.PI / 2 + 2.094), 0], [1.28 * Math.cos(Math.PI / 2 + 4.189), 0], [0, 0]] : [[0, 0], ...[0, 1, 2].map(i => [1.28 * Math.cos(Math.PI / 2 + i * 2.094), 1.28 * Math.sin(Math.PI / 2 + i * 2.094)])];
    P.forEach(([px, py]) => { g.fillStyle = '#fff'; g.beginPath(); g.arc(300 + px * 600 / 5.4, 235 - py * 600 / 5.4, 4.5, 0, 7); g.fill(); });
    const ex = side ? 0 : 1, ey = side ? 1 : 0, E = ph;
    if (on > 0) { if (side) arrow(g, 520, 235, 520, 235 - 120 * E, '#F0B86E', 5, 16, on); else arrow(g, 300, 40, 300 + 160 * E, 40, '#F0B86E', 5, 16, on); }
    tag(g, 300, 445, label, { size: 20, col: '#E8EEF8' });
  }, { at: b(0) + .1 });
  view(120, 0, '电场在平面内（⊥ c）：电子云晃得多', .42);
  view(760, 1, '侧视，电场沿 c 轴：电子云晃得少', .14);
  show(c, at(1400, 240, 400, mc('var(--vis)', '折射率从哪来', '<ul><li>光的电场推动电子云</li><li>电子云振荡再发出电磁波，与入射光叠加</li><li>越容易被推动 → 光越慢 → n 越大</li></ul>')), F(c, 0, .5));
  // 偶极互相加强 / 削弱（示意）
  canvasLayer(c, 1400, 500, 400, 330, (g, t) => {
    g.fillStyle = '#fff'; g.beginPath(); g.roundRect(0, 0, 400, 330, 14); g.fill();
    const a = SS(t, b(1) + 3, b(1) + 4.5);
    const O = [0, 1, 2].map(i => [100 + 48 * Math.cos(Math.PI / 2 + i * 2.094), 120 - 48 * Math.sin(Math.PI / 2 + i * 2.094)]);
    O.forEach(([x, y]) => { g.fillStyle = '#E0503F'; g.beginPath(); g.arc(x, y, 14, 0, 7); g.fill(); arrow(g, x - 22, y, x + 22 + 10 * a, y, '#1F5FA8', 4, 11, a); });
    tag(g, 100, 210, '平面内：互相加强', { size: 18, col: '#1F5FA8', a });
    const S2 = [[300, 80], [300, 160], [300, 120]]; [[262, 120], [338, 120]].forEach(([x, y]) => { g.fillStyle = '#E0503F'; g.beginPath(); g.arc(x, y, 14, 0, 7); g.fill(); arrow(g, x, y + 26, x, y - 26 + 8 * a, '#B5651D', 4, 11, a); });
    g.strokeStyle = '#7D838D'; g.lineWidth = 2; g.beginPath(); g.moveTo(240, 120); g.lineTo(360, 120); g.stroke();
    tag(g, 300, 210, '垂直平面：互相削弱', { size: 18, col: '#B5651D', a });
    tag(g, 200, 285, '示意：Bragg 1924 的偶极模型', { size: 16, col: '#9AA0A8', w: 500, a });
  }, { at: b(1) + 2.5 });
  const nb = show(c, at(120, 730, 1240, `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px"><div class="nbar" style="--c:var(--edit)"><span>n<sub>o</sub>（E ⊥ c）</span><i style="width:${(1.6584 - 1) / .8 * 100}%"></i><b>1.658</b></div><div class="nbar" style="--c:var(--vis)"><span>n<sub>e</sub>（E ∥ c）</span><i style="width:${(1.4864 - 1) / .8 * 100}%"></i><b>1.486</b></div></div>`), F(c, 1, .7));
});

// ---------- 两束光 ----------
function huygens(g, t, W, H, t0) {
  g.fillStyle = '#fff'; g.beginPath(); g.roundRect(0, 0, W, H, 16); g.fill();
  const y0 = 150, y1 = 560, th = 44.6 * Math.PI / 180, ax = [Math.sin(th), Math.cos(th)], bx = [Math.cos(th), -Math.sin(th)];
  g.fillStyle = 'rgba(127,179,224,.13)'; g.fillRect(40, y0, W - 80, y1 - y0); g.strokeStyle = '#9AB8D6'; g.lineWidth = 2; g.strokeRect(40, y0, W - 80, y1 - y0);
  // 光轴
  g.setLineDash([9, 7]); g.strokeStyle = '#5B4A9E'; g.lineWidth = 2.5; for (let k = 0; k < 3; k++) { const x = 120 + k * 230; g.beginPath(); g.moveTo(x, y0 + 20); g.lineTo(x + ax[0] * 120, y0 + 20 + ax[1] * 120); g.stroke(); } g.setLineDash([]);
  tag(g, 205, y0 + 165, '光轴方向', { size: 18, col: '#5B4A9E' });
  const tau = Math.max(0, Math.min(1, (t - t0) / 6)), R = 240 * tau, Rp = R * NO / NE;
  // 支撑点（能流方向）
  const an = ax[1], bn = bx[1], h = Math.sqrt((R * an) ** 2 + (Rp * bn) ** 2) || 1e-6, px = (R * R * an * ax[0] + Rp * Rp * bn * bx[0]) / h, py = (R * R * an * ax[1] + Rp * Rp * bn * bx[1]) / h;
  // 入射光
  arrow(g, W / 2, 20, W / 2, y0 - 6, '#181B20', 4, 14);
  tag(g, W / 2 + 90, 60, '垂直入射', { size: 18, col: '#454B55' });
  g.save(); g.beginPath(); g.rect(40, y0, W - 80, y1 - y0); g.clip();
  for (let k = -3; k <= 3; k++) { const x = W / 2 + k * 70; g.strokeStyle = 'rgba(31,95,168,.45)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y0, R / NO * 1.0, 0, Math.PI); g.stroke(); g.save(); g.translate(x, y0); g.rotate(Math.atan2(ax[1], ax[0])); g.beginPath(); g.ellipse(0, 0, R / NO, Rp / NO, 0, 0, 7); g.restore(); g.strokeStyle = 'rgba(181,101,29,.5)'; g.stroke(); }
  g.restore();
  if (tau > 0) {
    g.strokeStyle = '#1F5FA8'; g.lineWidth = 4; g.beginPath(); g.moveTo(60, y0 + R / NO); g.lineTo(W - 60, y0 + R / NO); g.stroke();
    g.strokeStyle = '#B5651D'; g.lineWidth = 4; g.beginPath(); g.moveTo(60, y0 + h / NO); g.lineTo(W - 60, y0 + h / NO); g.stroke();
    tag(g, W - 150, y0 + R / NO + 20, 'o 波前', { size: 18, col: '#1F5FA8' }); tag(g, W - 150, y0 + h / NO - 18, 'e 波前', { size: 18, col: '#B5651D' });
  }
  // 光线
  const ray = SS(t, t0 + 4, t0 + 6), wo = Math.atan2(px, py), L = (y1 - y0);
  if (ray > 0) {
    g.globalAlpha = ray; g.strokeStyle = '#1F5FA8'; g.lineWidth = 5; g.beginPath(); g.moveTo(W / 2, y0); g.lineTo(W / 2, y1); g.lineTo(W / 2, H - 20); g.stroke();
    const ex = W / 2 + Math.tan(wo) * L; g.strokeStyle = '#B5651D'; g.beginPath(); g.moveTo(W / 2, y0); g.lineTo(ex, y1); g.lineTo(ex, H - 20); g.stroke(); g.globalAlpha = 1;
    tag(g, W / 2 + 40, H - 40, 'o 光', { size: 20, col: '#1F5FA8', a: ray }); tag(g, ex - 40, H - 40, 'e 光', { size: 20, col: '#B5651D', a: ray });
    tag(g, W / 2 - 150, (y0 + y1) / 2, `走离 ${(-wo * 180 / Math.PI).toFixed(1)}°`, { size: 20, col: '#B5651D', a: ray });
  }
}
S('k_two', c => {
  const { b } = c;
  c.head('06', '一束光为什么变两束');
  // 折射率椭球（剖面）
  canvasLayer(c, 120, 230, 560, 560, (g, t) => {
    g.fillStyle = '#fff'; g.beginPath(); g.roundRect(0, 0, 560, 560, 16); g.fill();
    const k = 160, cx = 280, cy = 270, a = SS(t, b(0) + .3, b(0) + 1.5);
    g.globalAlpha = a; g.strokeStyle = '#1F5FA8'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, NO / 1.6584 * k, 0, 7); g.stroke();
    g.strokeStyle = '#B5651D'; g.beginPath(); g.ellipse(cx, cy, NO * k / 1.6584, NE * k / 1.6584, 0, 0, 7); g.stroke();
    g.setLineDash([8, 6]); g.strokeStyle = '#5B4A9E'; g.beginPath(); g.moveTo(cx, cy - 220); g.lineTo(cx, cy + 220); g.stroke(); g.setLineDash([]);
    tag(g, cx + 70, cy - 230, 'c（光轴）', { size: 19, col: '#5B4A9E' });
    tag(g, cx + k + 10, cy - 18, 'n_o = 1.658', { size: 18, col: '#1F5FA8', align: 'left' }); tag(g, cx + 10, cy - NE * k / 1.6584 - 14, 'n_e = 1.486', { size: 18, col: '#B5651D', align: 'left' });
    // 一个方向 θ
    const th = .5 + .35 * Math.sin((t - b(0)) * .5), n = neTheta(th), sx = Math.sin(th), cz = Math.cos(th);
    if (t > F(c, 0, .3)) { const A2 = SS(t, F(c, 0, .3), F(c, 0, .4)); arrow(g, cx, cy, cx + sx * 200, cy - cz * 200, '#454B55', 3, 12, A2); const r = n * k / 1.6584 * 0 + 0; const ee = 1 / Math.sqrt((Math.cos(th) / 1) ** 2 + 0); tag(g, cx, 520, `传播方向与光轴成 θ 时：o 光 1.658，e 光 ${n.toFixed(3)}`, { size: 18, col: '#454B55', a: A2 }); }
    g.globalAlpha = 1;
    tag(g, 280, 30, '折射率椭球（过光轴的剖面）', { size: 18, col: '#7D838D', w: 500 });
  }, { at: b(0) + .1, until: b(1) + .2 });
  canvasLayer(c, 720, 230, 1080, 600, (g, t) => huygens(g, t, 1080, 600, F(c, 0, .45)), { at: F(c, 0, .4), until: b(1) + .2 });
  // 第二拍：双像 + 偏振片
  canvasLayer(c, 120, 230, 1000, 600, (g, t) => doubleImage(g, t, 1000, 600, { rot: t => .25 * Math.sin((t - b(1)) * .45), pol: t => t < F(c, 1, .55) ? null : (t - F(c, 1, .55)) * .9, shift: 34, cx: 360 }), { at: b(1) + .1 });
  show(c, at(1160, 240, 640, mc('var(--edit)', '寻常光 o', '<ul><li>电场 ⊥ 主截面</li><li>任何方向都是 n = 1.658</li><li>惠更斯子波：球面</li></ul>')), b(1) + .3);
  show(c, at(1160, 480, 640, mc('var(--vis)', '非常光 e', '<ul><li>电场在主截面内</li><li>n 在 1.486–1.658 之间随方向变</li><li>子波：扁球；垂直入射解理面时走离约 6.2°</li><li>两束平行射出，间距约为厚度的 0.11 倍</li></ul>')), F(c, 1, .2));
});

S('k_hist', c => {
  const { b } = c;
  c.head('07', '冰洲石与光学史');
  const t = show(c, at(120, 240, 1000, tbl([['年份', '人物', '事件'], ['1669', 'Rasmus Bartholin', '描述冰岛方解石（冰洲石）里的双像'], ['1690', 'Christiaan Huygens', '《光论》：球面与扁球子波'], ['1808', 'Étienne-Louis Malus', '透过方解石看窗户反光，发现反射光的偏振'], ['1828', 'William Nicol', '尼科尔棱镜：得到纯净的偏振光'], ['1924', 'W. L. Bragg', '用偶极模型定量解释两个折射率'], ['2011–13', 'Ropars 等', '维京“太阳石”实验；仍是假说']], { st: 'font-size:21px' })), b(0) + .1);
  rowsIn(c, t, [[0, b(0) + .1], [1, F(c, 0, .1)], [2, F(c, 0, .45)], [3, F(c, 0, .6)], [4, b(1) + .2], [5, F(c, 1, .55)], [6, F(c, 1, .75)]]);
  canvasLayer(c, 1160, 240, 640, 460, (g, tt) => {
    g.fillStyle = '#fff'; g.beginPath(); g.roundRect(0, 0, 640, 460, 16); g.fill();
    const a = SS(tt, b(1) + .5, b(1) + 1.5), r = SS(tt, b(1) + 2, F(c, 1, .45));
    const P = [[110, 330], [470, 330], [560, 130], [200, 130]];
    g.globalAlpha = a; g.fillStyle = 'rgba(127,179,224,.2)'; g.beginPath(); P.forEach((p, i) => i ? g.lineTo(...p) : g.moveTo(...p)); g.closePath(); g.fill(); g.strokeStyle = '#6E8FB0'; g.lineWidth = 2.5; g.stroke();
    g.strokeStyle = '#C9A44A'; g.lineWidth = 6; g.beginPath(); g.moveTo(200, 130); g.lineTo(470, 330); g.stroke();
    tag(g, 380, 205, '加拿大树胶', { size: 18, col: '#9A7A22' });
    g.globalAlpha = 1;
    if (r > 0) {
      const e = [[20, 240], [150, 240], [300, 225], [520, 225], [630, 225]];
      g.globalAlpha = r; g.strokeStyle = '#181B20'; g.lineWidth = 4; g.beginPath(); g.moveTo(20, 240); g.lineTo(150, 240); g.stroke();
      g.strokeStyle = '#1F5FA8'; g.beginPath(); g.moveTo(150, 240); g.lineTo(312, 250); g.lineTo(330, 400); g.stroke(); tag(g, 365, 395, 'o 光：全反射，导出', { size: 18, col: '#1F5FA8', align: 'left' });
      g.strokeStyle = '#B5651D'; g.beginPath(); g.moveTo(150, 240); g.lineTo(510, 225); g.lineTo(630, 225); g.stroke(); tag(g, 560, 200, 'e 光：偏振光', { size: 18, col: '#B5651D' });
      g.globalAlpha = 1;
    }
    tag(g, 320, 30, '尼科尔棱镜（示意）', { size: 18, col: '#7D838D', w: 500 });
    tag(g, 320, 440, 'n_o 1.658 > 树胶 ≈ 1.53 > n_e 1.486', { size: 18, col: '#454B55', a: r });
  }, { at: b(1) + .3 });
  show(c, det(120, 690, 1000, '维京太阳石', '2011 年 Ropars 等用方解石在阴天定位太阳，误差几度；2013 年在 1592 年的奥尔德尼沉船里找到一块方解石。作者也说：“可能的用途不等于用过的证据。”', 'Proc. R. Soc. A 2011、2013'), F(c, 1, .8));
});

S('k_end', c => {
  const { b } = c;
  c.head('08', '上集小结');
  const L = show(c, lin(120, 250, 1680, 300, {
    ca: [150, 70, 'Ca²⁺', '硬的球 · 离子键', 'var(--edit)'], co: [150, 210, 'CO₃²⁻', '扁平的电子云', 'var(--both)'],
    st: [620, 140, '平行成层', 'R-3c · 所有 CO₃ ⊥ c', 'var(--ink2)'], an: [1070, 140, '极化各向异性', '平面内易、沿 c 难', 'var(--vis)'], bi: [1500, 140, '强双折射', 'n_o 1.658 · n_e 1.486', 'var(--vis)'],
  }, [['ca', 'st'], ['co', 'st'], ['st', 'an'], ['an', 'bi']]), b(0) + .1);
  linIn(c, L, [['ca', b(0) + .2], ['co', F(c, 0, .2)], ['st', F(c, 0, .45)], ['an', F(c, 0, .65)], ['bi', F(c, 0, .82)]]);
  show(c, at(120, 600, 1680, mc('var(--vis)', '下集', '<ul><li>为什么碎成菱形、为什么硬度只有 3</li><li>机械孪晶与反向热膨胀</li><li>振动光谱、遇酸冒泡、加热分解、杂质发光</li></ul>')), b(1) + .1);
});
