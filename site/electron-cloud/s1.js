// 第一集 · 电子云是什么
S('a_open', c => {
  const { b, be } = c;
  const v = glv(c, 760, 110, 1100, 880, { at: .1 }), A = atomCloud(v, 6, { all: true, perE: 5000 });
  v.look(A.R * 3.0, .25); A.setSize(); v.upd.push(spin(A.grp, .22));
  show(c, at(100, 250, 700, `<div style="font:600 24px var(--sans);letter-spacing:.3em;color:var(--fg3)">电子云 · 第一集</div><div style="font:900 130px/1.1 var(--serif);margin-top:10px">电子云<br>是什么</div>`), .2, be(0) + .3);
  show(c, at(100, 640, 640, `<div class="p" style="font-size:30px">一团雾？<br>还是一个高速转圈的小球留下的轨迹？</div>`), b(0) + 6, be(0) + .3);
  const eps = [['第一集', '电子云是什么', '读懂一个原子的电子云'], ['第二集', '走遍周期表', '118 种元素，一个一个看'], ['第三集', '化学反应（上）', '成键、电子转移、孤对电子'], ['第四集', '化学反应（下）', '断键、有机反应、特殊电子云']];
  eps.forEach(([e, h, s2], i) => show(c, card(100, 210 + i * 170, 620, `<div class="k">${e}</div><h3 style="margin:0">${h}</h3><div class="p" style="font-size:22px">${s2}</div>`), b(1) + .3 + i * 2.2, be(1) + .3));
  show(c, det(100, 300, 620, '关于画面', '电子云按量子力学近似公式计算后采样成点：类氢波函数的形状，斯莱特规则估算有效核电荷。形状和层次可信，半径误差可达三成。'), b(2) + .3, null);
  show(c, det(100, 520, 620, 'AI 生成', '稿件与画面：Claude · 配音：Gemini TTS（1.25 倍速）'), b(2) + 5, null);
  show(c, `<div class="vlab" style="left:760px;top:930px;width:1100px">碳原子的全部 6 个电子</div>`, .8, null, { dy: 0 });
});
S('a_dots', c => {
  const { b, be } = c; c.head('01', '一个点是一次测量', '氢原子 · 1s');
  const v = glv(c, 520, 180, 1000, 780, { at: .1 }), hs = EC.sampleH(1, 0, 0, 30000, 3), p = ptsFrom(hs.pts, '#9CC8FF', { size: 20 }); v.grp.add(p);
  v.look(1.5 * 3.2, .2); p.material.uniforms.uSize.value = v.psize(4);
  const nucl = new THREE.Mesh(new THREE.SphereGeometry(.03, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff })); v.grp.add(nucl);
  const fg = new THREE.BufferGeometry(); fg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3)); fg.setAttribute('color', new THREE.BufferAttribute(new Float32Array([1, .82, .48]), 3));
  const flash = new THREE.Points(fg, ptsMat(v.psize(60), 3)); v.grp.add(flash);
  const t0 = F(c, 0, .5), t1 = b(1), t2 = F(c, 1, .32), t3 = F(c, 1, .85);
  const count = t => t < t0 ? 0 : t < t1 ? Math.min(3, 1 + Math.floor((t - t0) / ((be(0) - t0) / 3))) : t < t2 ? 3 + Math.floor(37 * (t - t1) / (t2 - t1)) : t < t3 ? Math.round(40 * Math.pow(30000 / 40, (t - t2) / (t3 - t2))) : 30000;
  const ctr = show(c, at(100, 420, 380, `<div class="k" style="font:600 18px var(--sans);letter-spacing:.12em;color:var(--fg3)">拍了几张照片</div><div class="mono" style="font:700 72px var(--mono);color:var(--gold)">0</div>`), t0 - .5, null).querySelector('.mono');
  v.upd.push(t => { const n = count(t); reveal(p, n / 30000); v.grp.rotation.set(.15, .4 + t * .08, 0);
    flash.visible = n > 0 && t < t2 + 1; if (n > 0) { const k = n - 1; fg.attributes.position.array.set([hs.pts[k * 4], hs.pts[k * 4 + 2], hs.pts[k * 4 + 1]]); fg.attributes.position.needsUpdate = true; }
    p.material.uniforms.uA.value = n < 200 ? 3 : n < 3000 ? 1.6 : 1;
    const s = n.toLocaleString('en'); if (ctr._s !== s) { ctr._s = s; ctr.textContent = s; } });
  show(c, card(100, 230, 380, `<div class="p" style="font-size:24px">想象一台相机：每拍一张，就记下电子<b>此刻</b>的位置，点一个点。</div>`), b(0) + 2, null);
  show(c, card(1500, 300, 340, `<div class="k">每个点</div><div class="p" style="font-size:24px">不是很多个电子，而是<b>同一个电子</b>在不同时刻被找到的位置</div>`), b(2) + .3, null);
  show(c, card(1500, 560, 340, `<div class="k">点的疏密</div><div class="p" style="font-size:24px">越密 → 越容易在那里找到电子。电子云是一张<b>概率地图</b></div>`), F(c, 2, .5), null);
});
S('a_radial', c => {
  const { b, be } = c; c.head('02', '最可能的距离', '径向分布');
  const ov = orbView(c, 80, 190, 820, 760, 1, 0, 0, { col: '#9CC8FF', np: 14000, k: 5, R: 1.6, zoom: 3.8, pa: 1, modes: [[0, 'pts'], [F(c, 2, .45), 'shell']], frac: .9, w: .12 });
  // 径向分布：样本直方图 + 理论曲线
  const hs = ov.cells[0].it && EC.sampleH(1, 0, 0, 14000, 5), NB = 48, RM = 3, H = new Float32Array(NB);
  for (let i = 0; i < hs.pts.length; i += 4) { const r = Math.hypot(hs.pts[i], hs.pts[i + 1], hs.pts[i + 2]), k = Math.floor(r / RM * NB); if (k < NB) H[k]++; }
  const mx = Math.max(...H), a0 = .529;
  canvasLayer(c, 960, 230, 880, 640, (g, t) => {
    const X = r => 70 + r / RM * 760, Y = q => 560 - q * 470;
    g.strokeStyle = '#2C3854'; g.lineWidth = 2; g.beginPath(); g.moveTo(70, 560); g.lineTo(850, 560); g.moveTo(70, 560); g.lineTo(70, 70); g.stroke();
    for (let r = 0; r <= 3; r += .5) tag(g, X(r), 590, r.toFixed(1), { size: 20, col: '#66728C', font: 'DejaVu Sans Mono, monospace' }); tag(g, 850, 620, '离核距离 r（Å）', { size: 20, col: '#66728C', align: 'right' });
    tag(g, 80, 50, '每层薄球壳里的点数', { size: 22, col: '#A3AEC3', align: 'left' });
    const grow = SS(t, b(0) + 2, F(c, 0, .9));
    for (let k = 0; k < NB; k++) { const hgt = H[k] / mx * grow; g.fillStyle = '#5CB4FF'; g.globalAlpha = .75; g.fillRect(X(k * RM / NB) + 1, Y(hgt), 760 / NB - 2, 560 - Y(hgt)); } g.globalAlpha = 1;
    const ca = SS(t, b(1), b(1) + 1.5); if (ca > 0) { g.globalAlpha = ca; g.strokeStyle = '#FFD27A'; g.lineWidth = 3; g.beginPath(); for (let i = 0; i <= 300; i++) { const r = RM * i / 300, q = (r / a0) ** 2 * Math.exp(2 - 2 * r / a0); i ? g.lineTo(X(r), Y(q * .98)) : g.moveTo(X(r), Y(0)); } g.stroke();
      g.setLineDash([8, 7]); g.beginPath(); g.moveTo(X(a0), 560); g.lineTo(X(a0), 80); g.stroke(); g.setLineDash([]); tag(g, X(a0) + 14, 100, '峰值 0.53 Å = 玻尔半径 a₀', { size: 24, col: '#FFD27A', align: 'left' }); g.globalAlpha = 1; }
    const cb = SS(t, b(2) + 6, b(2) + 7.5); if (cb > 0) { g.globalAlpha = cb; g.strokeStyle = '#E9EEF7'; g.setLineDash([4, 6]); g.lineWidth = 2.5; g.beginPath(); g.moveTo(X(1.41), 560); g.lineTo(X(1.41), 200); g.stroke(); g.setLineDash([]); tag(g, X(1.41) + 12, 220, '90% 的点在 1.41 Å 以内', { size: 22, col: '#E9EEF7', align: 'left' }); g.globalAlpha = 1; }
  }, { at: .4 });
  show(c, det(990, 880, 840, '公式', '径向分布 P(r) = 4πr²|ψ|² ：越往外密度越小，但球壳面积越大，乘起来在 a₀ 处最大'), b(1) + 8, null);
  show(c, `<div class="vlab" style="left:80px;top:${190 + 700}px;width:820px">${'氢原子 1s'}</div>`, .3, F(c, 2, .45), { dy: 0 });
  show(c, `<div class="vlab" style="left:80px;top:890px;width:820px"><b>包络面</b>：装下 90% 的点</div>`, F(c, 2, .45), null, { dy: 0 });
});
S('a_bohr', c => {
  const { b, be } = c; c.head('03', '为什么不是小球绕圈');
  canvasLayer(c, 100, 200, 820, 720, (g, t) => {
    const cx = 410, cy = 360, R0 = 230;
    if (t < b(2) + .2) {
      const sp = SS(t, b(1) + 2, b(1) + 9), th = t * 3.2 + sp * 18, R = R0 * (1 - sp * .97);
      g.strokeStyle = '#2C3854'; g.lineWidth = 2; g.setLineDash([6, 8]); g.beginPath(); g.arc(cx, cy, R0, 0, 7); g.stroke(); g.setLineDash([]);
      if (sp > 0) { g.strokeStyle = 'rgba(255,107,107,.7)'; g.lineWidth = 2.5; g.beginPath(); for (let k = 0; k <= 200; k++) { const s2 = sp * k / 200, rr = R0 * (1 - s2 * .97), a = (t * 3.2 + s2 * 18) - (sp - s2) * 0; k ? g.lineTo(cx + rr * Math.cos(t * 3.2 + s2 * 18), cy + rr * Math.sin(t * 3.2 + s2 * 18)) : g.moveTo(cx + rr * Math.cos(t * 3.2), cy + rr * Math.sin(t * 3.2)); } g.stroke(); }
      g.fillStyle = '#FF7A93'; g.beginPath(); g.arc(cx, cy, 22, 0, 7); g.fill(); tag(g, cx, cy, '+', { size: 30, col: '#070A12', w: 900 });
      g.fillStyle = '#5CB4FF'; g.beginPath(); g.arc(cx + R * Math.cos(th), cy + R * Math.sin(th), 13, 0, 7); g.fill();
      tag(g, cx, 680, sp > .05 ? '经典电磁学：边转边辐射，螺旋坠入原子核' : '玻尔模型（1913）：电子沿圆轨道绕核', { size: 26, col: sp > .05 ? '#FF6B6B' : '#A3AEC3' });
    } else {
      // 琴弦上的驻波
      for (let m = 1; m <= 3; m++) { const y0 = 120 + (m - 1) * 200, A = 60 * Math.cos(t * 4 * m * .5);
        g.strokeStyle = '#5CB4FF'; g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= 200; i++) { const x = 60 + i * 3.5; g.lineTo(x, y0 + A * Math.sin(m * Math.PI * i / 200)); } g.stroke();
        g.fillStyle = '#E9EEF7'; [0, 200].forEach(i => { g.beginPath(); g.arc(60 + i * 3.5, y0, 7, 0, 7); g.fill(); });
        for (let k = 1; k < m; k++) { g.fillStyle = '#FFD27A'; g.beginPath(); g.arc(60 + 700 * k / m, y0, 9, 0, 7); g.fill(); }
        tag(g, 60, y0 - 80, ['基音', '二倍频：1 个节点', '三倍频：2 个节点'][m - 1], { size: 24, col: '#A3AEC3', align: 'left' }); }
    }
  }, { at: .3 });
  show(c, card(1000, 260, 820, `<div class="k">问题一</div><h3>会坠毁</h3><div class="p">按经典电磁学，绕圈的电荷不断辐射能量，不到一百亿分之一秒就会坠入原子核。真实的原子却是稳定的。</div>`), b(1) + 2, b(2));
  show(c, card(1000, 560, 820, `<div class="k">问题二</div><h3>没有轨迹</h3><div class="p">不确定性原理：位置和动量不能同时精确确定，Δx · Δp ≥ ħ/2。</div>`), F(c, 1, .6), b(2));
  const ov = orbView(c, 1000, 220, 820, 640, 2, 0, 0, { modes: [[0, 'slice']], at: F(c, 2, .5), lab: '原子里的“驻波”：2s 轨道的截面（金 = 正，蓝 = 负，白线 = 节点）' });
});
S('a_qn', c => {
  const { b, be } = c; const h = c.head('04', '量子数决定形状');
  show(c, card(100, 230, 560, `<div class="p" style="font-size:26px;line-height:1.9"><b class="mono" style="color:var(--gold)">n</b>　主量子数：大小、能量<br><b class="mono" style="color:var(--gold)">l</b>　角量子数：形状<br>　　0 = s · 1 = p · 2 = d · 3 = f<br><b class="mono" style="color:var(--gold)">m</b>　磁量子数：朝哪个方向</div>`), .5, be(0) + .2);
  orbRow(c, 700, 230, 1140, 560, [{ n: 1, l: 0, lab: '<b>1s</b>' }, { n: 2, l: 0, lab: '<b>2s</b>' }, { n: 3, l: 0, lab: '<b>3s</b>' }], { at: b(0) + 1, until: be(0) + .2, sameScale: true, np: 12000, k: 4, zoom: 3.0, labDy: 0 }).cells.forEach(cl => 0);
  show(c, `<div class="cap abs" style="left:700px;top:850px;width:1140px;text-align:center">同样的比例：n 越大，电子云越大</div>`, b(0) + 2, be(0) + .2, { dy: 0 });
  // s 与三个 p
  orbRow(c, 100, 220, 1720, 600, [{ n: 2, l: 0, lab: '<b>2s</b> · 球形' }, { n: 2, l: 1, idx: 0, lab: '<b>2p<sub>x</sub></b>' }, { n: 2, l: 1, idx: 1, lab: '<b>2p<sub>y</sub></b>' }, { n: 2, l: 1, idx: 2, lab: '<b>2p<sub>z</sub></b>' }], { at: b(1) + .2, until: be(1) + .2, np: 9000, k: 5, ry: .5, w: .18 });
  show(c, `<div class="cap abs" style="left:100px;top:870px;width:1720px;text-align:center">颜色：金色 = 波函数为正，蓝色 = 为负（第 06 节细讲）</div>`, b(1) + 2, be(1) + .2, { dy: 0 });
  // d 和 f：先点云，后实体
  const tSw = F(c, 2, .84), dl = ['xy', 'xz', 'yz', 'x²−y²', 'z²'];
  orbRow(c, 100, 200, 1720, 330, [0, 1, 2, 3, 4].map(i => ({ n: 3, l: 2, idx: i, lab: `<b>3d</b><sub>${['z²', 'xz', 'yz', 'x²−y²', 'xy'][i]}</sub>`, modes: [[0, 'pts'], [tSw, 'solid']] })), { at: b(2) + .2, until: be(2) + .2, np: 7000, k: 5, labDy: -4 });
  orbRow(c, 100, 560, 1720, 300, [0, 1, 2, 3, 4, 5, 6].map(i => ({ n: 4, l: 3, idx: i, modes: [[0, 'pts'], [tSw, 'solid']] })), { at: F(c, 2, .3), until: be(2) + .2, np: 6000, k: 5 });
  show(c, `<div class="vlab" style="left:100px;top:860px;width:1720px">七个 <b>4f</b> 轨道</div>`, F(c, 2, .3), be(2) + .2, { dy: 0 });
  show(c, modeTag(100, 200, '点云 → 实体（装下 85% 概率的包络面）'), tSw, be(2) + .2, { dy: 0 });
  // 节面数
  orbRow(c, 100, 230, 1720, 560, [{ n: 1, l: 0, lab: '<b>s</b>：0 个节面' }, { n: 2, l: 1, idx: 2, lab: '<b>p</b>：1 个', plane: 0 }, { n: 3, l: 2, idx: 1, lab: '<b>d</b>：2 个', plane: 0 }, { n: 4, l: 3, idx: 5, lab: '<b>f</b>：3 个', plane: 1 }], { at: b(3) + .2, modes: [[0, 'solid'], [F(c, 3, .45), 'slice']], np: 6000 });
  show(c, `<div class="cap abs" style="left:100px;top:860px;width:1720px;text-align:center">穿过原子核的节面数 = l　·　截面里白线就是节面</div>`, F(c, 3, .45), null, { dy: 0 });
});
S('a_node', c => {
  const { b, be } = c; c.head('05', '一层套一层：径向节点');
  orbView(c, 380, 190, 1160, 760, 2, 0, 0, { np: 20000, k: 4, zoom: 2.6, at: .2, until: be(0) + .2, w: .15, lab: '<b>2s</b>：中心一小团，隔一圈空隙，外面一大层' });
  orbRow(c, 100, 220, 1720, 600, [{ n: 2, l: 0, lab: '<b>2s</b>：1 圈节点' }, { n: 3, l: 0, lab: '<b>3s</b>：2 圈' }, { n: 4, l: 0, lab: '<b>4s</b>：3 圈' }], { at: b(1) + .2, until: be(1) + .2, np: 16000, k: 4, zoom: 2.8, modes: [[0, 'pts'], [F(c, 1, .5), 'slice']] });
  show(c, det(660, 850, 600, '规律', '球形节面数 = n − l − 1'), b(1) + 4, be(1) + .2);
  // 波函数沿半径
  const s3 = EC.radialTable(3, 0, 1), R0 = s3.R; s3.R = r => r * R0(r); { let last = 0, prev = s3.R(1e-4); for (let i = 1; i < 4000; i++) { const r = i * .005, q = s3.R(r); if (q * prev < 0) last = r; prev = q; } s3.rm = last * 3.2; let m2 = 0; for (let i = 0; i <= 400; i++) m2 = Math.max(m2, Math.abs(s3.R(s3.rm * i / 400))); s3.mx = m2; }
  canvasLayer(c, 160, 230, 1600, 640, (g, t) => {
    const rm = s3.rm, X = r => 80 + r / rm * 1440, Y = q => 320 - q * 260, mx = s3.mx;
    g.strokeStyle = '#2C3854'; g.lineWidth = 2; g.beginPath(); g.moveTo(80, 320); g.lineTo(1540, 320); g.stroke();
    const k = SS(t, b(2) + .5, b(2) + 4), ph = Math.cos(t * 3);
    g.lineWidth = 4; for (let i = 0; i < 400 * k; i++) { const r0 = rm * i / 400, r1 = rm * (i + 1) / 400, q0 = s3.R(r0) / mx * ph, q1 = s3.R(r1) / mx * ph; g.strokeStyle = s3.R(r0) >= 0 ? '#FFB25C' : '#4FA3FF'; g.beginPath(); g.moveTo(X(r0), Y(q0)); g.lineTo(X(r1), Y(q1)); g.stroke(); }
    let prev = s3.R(1e-4), cnt = 0; for (let i = 1; i <= 400; i++) { const r = rm * i / 400, q = s3.R(r); if (q * prev < 0 && i / 400 < k) { cnt++; g.fillStyle = '#E9EEF7'; g.beginPath(); g.arc(X(r), 320, 10, 0, 7); g.fill(); tag(g, X(r), 380, '节点：振幅为零', { size: 22, col: '#E9EEF7' }); } prev = q; }
    tag(g, 80, 40, '3s 轨道沿半径方向的波：r · R(r)（上下振荡表示波）', { size: 24, col: '#A3AEC3', align: 'left' }); tag(g, 1540, 620, '离核距离 →', { size: 20, col: '#66728C', align: 'right' });
  }, { at: b(2) + .2 });
});
S('a_phase', c => {
  const { b, be } = c; c.head('06', '正和负：波的相位');
  orbView(c, 100, 200, 900, 720, 2, 1, 2, { np: 16000, k: 4, at: .2, modes: [[0, 'pts'], [F(c, 0, .45), 'both']], lab: '<b>2p<sub>z</sub></b>　金色 = 正　蓝色 = 负' });
  show(c, card(1060, 240, 760, `<div class="k">注意</div><h3>正负不是电荷</h3><div class="p">电子云的密度是 |ψ|²，正负两边一样密。正负号是波的<b>相位</b>，像水波的波峰和波谷。</div>`), F(c, 0, .55), null);
  // 成键与反键：两个 1s 叠加的截面
  const draw = (sgn) => { const S2 = 380, cv = document.createElement('canvas'); cv.width = cv.height = S2; const g = cv.getContext('2d'), im = g.createImageData(S2, S2), a0 = .529, d = .37, ext = 2.2;
    const f = (x, y) => { const r1 = Math.hypot(x + d, y), r2 = Math.hypot(x - d, y); return Math.exp(-r1 / a0) + sgn * Math.exp(-r2 / a0); };
    let mx = 0; for (let j = 0; j < S2; j++) for (let i = 0; i < S2; i++) mx = Math.max(mx, Math.abs(f((i / S2 * 2 - 1) * ext, (j / S2 * 2 - 1) * ext)));
    for (let j = 0; j < S2; j++) for (let i = 0; i < S2; i++) { const q = f((i / S2 * 2 - 1) * ext, (1 - j / S2 * 2) * ext) / mx, a = Math.min(1, Math.abs(q) ** .6), c0 = q >= 0 ? [255, 178, 92] : [79, 163, 255], k = (j * S2 + i) * 4; im.data[k] = c0[0] * a; im.data[k + 1] = c0[1] * a; im.data[k + 2] = c0[2] * a; im.data[k + 3] = 255; }
    g.putImageData(im, 0, 0); return cv; };
  const A1 = draw(1), A2 = draw(-1);
  canvasLayer(c, 1060, 520, 760, 400, (g, t) => {
    g.drawImage(A1, 0, 0, 360, 360); g.drawImage(A2, 400, 0, 360, 360);
    tag(g, 180, 385, '同号相加：电子聚在中间 → 成键', { size: 21, col: '#5FD39A' }); tag(g, 580, 385, '异号相加：中间是节面 → 不成键', { size: 21, col: '#FF6B6B' });
    [[0, 1], [400, -1]].forEach(([x0]) => { g.fillStyle = '#fff'; [-1, 1].forEach(s2 => { g.beginPath(); g.arc(x0 + 180 + s2 * .37 / 2.2 * 180, 180, 5, 0, 7); g.fill(); }); });
  }, { at: b(1) + 1 });
  show(c, `<div class="cap abs" style="left:1060px;top:470px;width:760px">两个氢原子的 1s 波相遇（截面）</div>`, b(1) + 1, null, { dy: 0 });
});
S('a_multi', c => {
  const { b, be } = c; c.head('07', '多个电子怎么排');
  const rules = [['规则一', '先填能量低的轨道', '1s → 2s → 2p → 3s → 3p → 4s → 3d …'], ['规则二 · 泡利', '一个轨道最多两个电子，自旋相反', '↑↓'], ['规则三 · 洪特', '能量相同的轨道，先分开住、自旋相同', '↑　↑　　而不是　↑↓　　']];
  rules.forEach(([k, h, s2], i) => show(c, card(100, 220 + i * 190, 720, `<div class="k">${k}</div><h3 style="font-size:28px">${h}</h3><div class="p mono" style="font-size:22px">${s2}</div>`), i < 2 ? .4 + i * 4 : b(1) + .2, be(1) + .2));
  canvasLayer(c, 920, 230, 900, 600, (g, t) => {
    const k = n => SS(t, .8 + n * 1.2, 1.3 + n * 1.2), h2 = SS(t, b(1) + 3, b(1) + 4.5);
    boxes(g, 120, 40, [['1s', [[k(0), k(1)]]], ['2s', [[k(2), k(3)]]], ['2p', [[k(4), 0], [k(5) * Math.max(h2, 1), 0], [0, 0]], '#5CB4FF']], { bw: 70, bh: 74, gap: 40 });
    tag(g, 520, 80, '碳 C：6 个电子', { size: 30, col: '#E9EEF7', align: 'left', w: 700 }); tag(g, 520, 130, '1s² 2s² 2p²', { size: 28, col: '#FFD27A', align: 'left', font: 'DejaVu Sans Mono, monospace' });
    const w2 = SS(t, b(1) + 6, b(1) + 7); if (w2 > 0) { g.globalAlpha = w2; boxes(g, 120, 420, [['✗', [[1, 1], [0, 0], [0, 0]], '#FF6B6B']], { bw: 70, bh: 74 }); tag(g, 400, 457, '挤在同一个轨道：排斥更大', { size: 22, col: '#FF6B6B', align: 'left' }); g.globalAlpha = 1; }
  }, { at: .4, until: be(1) + .2 });
  // 碳原子：全部电子 → 剖开
  const v = glv(c, 260, 170, 1400, 800, { at: b(2) + .1 }), A = atomCloud(v, 6, { all: true, perE: 6000 });
  v.look(A.R * 3.7, .25); A.setSize(); const AG = atomGrid(A), cut = atomCut(v.grp, A, AG);
  const tc = F(c, 2, .55), tv = b(3) + 3;
  v.upd.push(t => { spin(v.grp, .2)(t); A.grp.visible = t < tc || t >= tv; cut.grp.visible = t >= tc && t < tv;
    A.orbs.forEach(q => q.p.material.uniforms.uA.value = q.n === 1 ? 1 - .92 * SS(t, tv, tv + 1.5) : 1); });
  show(c, modeTag(280, 190, '点云：内外两层重叠在一起'), b(2) + .3, tc, { dy: 0 });
  show(c, modeTag(280, 190, '剖开：一层套一层（每层是装下 90% 电子的包络面）'), tc, tv, { dy: 0 });
  show(c, at(1480, 380, 360, `<div style="display:flex;flex-direction:column;gap:12px">${pill(LCOL[0], '1s · 内层 2 个')}${pill(LCOL[0], '2s · 外层 2 个')}${pill(LCOL[1], '2p · 外层 2 个')}</div>`), b(2) + 1, null);
  show(c, modeTag(280, 190, '内层 1s 淡出：剩下的是价电子'), tv, null, { dy: 0 });
});
S('a_end', c => {
  const { b, be } = c; c.head('08', '小结');
  const pts = [['电子云', '同一个电子的<b>概率地图</b>'], ['轨道', '被束缚的波允许的<b>振动模式</b>，n、l、m 决定大小、形状、方向'], ['节点', '波的振幅为零的地方'], ['相位', '正负号决定原子之间<b>能不能成键</b>']];
  pts.forEach(([h, s2], i) => show(c, card(100, 220 + i * 150, 760, `<h3 style="font-size:28px;margin:0 0 4px">${h}</h3><div class="p" style="font-size:23px">${s2}</div>`), .3 + i * 1.6, null));
  orbRow(c, 920, 230, 920, 560, [{ n: 1, l: 0, lab: '1s' }, { n: 2, l: 1, idx: 2, lab: '2p' }, { n: 3, l: 2, idx: 0, lab: '3d' }, { n: 4, l: 3, idx: 0, lab: '4f' }], { at: .5, modes: [[0, 'pts'], [b(1), 'solid']], np: 6000, k: 5 });
  show(c, card(920, 840, 920, `<div class="p" style="font-size:24px">下一集：从 1 号到 118 号，<b>走遍周期表</b></div>`), b(1) + 4, null);
});
