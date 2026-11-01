// 《如何建造一座太空电梯》各场景。每个场景：build(c) 搭好 DOM 和三维物体，c.tick(lt) 按时间摆放一切。
window.SCENES = {};
const S = (id, build) => SCENES[id] = { build };
const Cc = c => new THREE.Color(c).convertSRGBToLinear();
const bm = (c, op = 1, add = false) => new THREE.MeshBasicMaterial({ color: Cc(c), transparent: op < 1 || add, opacity: op, depthWrite: !(op < 1 || add), blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: false, side: THREE.DoubleSide });
const pm = (c, o = {}) => new THREE.MeshStandardMaterial({ color: Cc(c), metalness: .3, roughness: .5, ...o });
const ringL = (r, c, op = .7, dash = 0, y = 0) => { const l = ringLine(r, 0xffffff, op, dash, y); l.material.color = Cc(c); l.material.toneMapped = false; return l; };
const lineL = (pts, c, op = 1) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: Cc(c), transparent: op < 1, opacity: op, toneMapped: false }));
const at = (x, y, w, html, cls = 'card') => `<div class="${cls}" style="left:${x}px;top:${y}px;width:${w}px">${html}</div>`;
const card = (x, y, w, html) => at(x, y, w, html, 'card');
const det = (x, y, w, h, body, small) => at(x, y, w, `<span class="h">${h}</span>${body}${small ? `<small>${small}</small>` : ''}`, 'det');
const show = (c, html, t0, t1, o = {}) => { const e = c.el(html); c.in(e, t0, o); if (t1 != null) c.out(e, t1); return e; };
const fade = (lt, t0, t1, d = .5) => Math.min(ss((lt - t0) / d), t1 == null ? 1 : ss((t1 - lt) / d));
const credit = c => c.el(`<div class="abs" style="right:100px;bottom:14px;font-size:15px;color:var(--fg3);z-index:21">地球图像：NASA Blue Marble · 三维模型：Tripo AI 生成，作者上色</div>`);
// 一组电梯带子：沿 dir 从半径 r0 到 r1，四条，间距 sp，粗细 rad
function ribbons(parent, dir, r0, r1, sp, rad) {
  const Y = new THREE.Vector3(0, 1, 0), T = new THREE.Vector3(dir.z, 0, -dir.x);
  return RIB.map(([a, b, d]) => { const off = T.clone().multiplyScalar(a * sp).addScaledVector(Y, b * sp);
    const m = tube(dir.clone().multiplyScalar(r0).add(off), dir.clone().multiplyScalar(r1).add(off), rad, bm(d === 'up' ? UP : DOWN)); parent.add(m); return { m, off, d }; });
}
const R0 = RE * KM, RGu = RG * KM, TOPu = (RE + 100000e3) * KM;

// ============ 开场 ============
S('open', c => {
  const g = W3.group(), spin = new THREE.Group(); g.add(spin); spin.add(W3.earth()); const th0 = 1.658;
  // 火箭：白点 + 尾焰轨迹（示意）
  const lp = new THREE.Vector3(.35, .55, .76).normalize().multiplyScalar(R0);
  const path = new THREE.CatmullRomCurve3([lp.clone(), lp.clone().multiplyScalar(1.03).add(new THREE.Vector3(0, .25, 0)), lp.clone().multiplyScalar(1.07).add(new THREE.Vector3(.6, .5, -.2)), lp.clone().multiplyScalar(1.07).add(new THREE.Vector3(1.6, .4, -1.2))]);
  const trailG = new THREE.BufferGeometry(); const trail = new THREE.Line(trailG, new THREE.LineBasicMaterial({ color: Cc(0xffb070), toneMapped: false })); spin.add(trail);
  const rocket = new THREE.Mesh(new THREE.SphereGeometry(.05, 12, 8), bm(0xffffff)); spin.add(rocket);
  const flame = new THREE.Mesh(new THREE.SphereGeometry(.12, 12, 8), bm(0xffa040, .7, true)); rocket.add(flame);
  const rl = W3.label('火箭', rocket, 'l');
  // 电梯
  const rib = ribbons(spin, DIR0, R0, TOPu, .5, .22);
  const climbers = Array.from({ length: 6 }, (_, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.35, .35, .35), pm(0xffc46b, { emissive: Cc(0x553300) })); spin.add(m); return m; });
  const c1 = show(c, det(100, 640, 560, '今天的火箭', '把 1 公斤货物送到近地轨道<br>约 <b>3,000–4,000 美元</b>', '按猎鹰 9 号公开报价和运力粗算'), c.b(0) + 3, c.be(0));
  const ttl = c.el(`<div class="abs" style="left:0;right:0;top:250px;padding:70px 0;text-align:center;z-index:6;background:radial-gradient(ellipse at 50% 50%,rgba(7,10,18,.75),rgba(7,10,18,0) 70%)"><div class="big">如何建造一座太空电梯</div><div style="font:600 40px var(--sans);color:var(--gold);margin-top:22px;text-shadow:0 0 14px #000">设想篇 · 假设材料技术继续进步</div>
    <div style="margin-top:34px"><span class="pill">文稿与画面：AI 生成 · 配音：AI 合成 · 部分画面为示意</span></div></div>`); c.in(ttl, c.b(2) + .2, { d: 1, dy: 20 });
  credit(c);
  c.tick(lt => {
    spin.rotation.y = th0 - .5 + lt * .012;
    const u = cl((lt - c.b(0) - .5) / (c.be(0) - c.b(0) - 1));
    const pts = []; for (let i = 0; i <= 60; i++) pts.push(path.getPoint(i / 60 * u)); trailG.setFromPoints(pts);
    rocket.position.copy(path.getPoint(u)); rocket.visible = trail.visible = lt < c.b(1) + 1; flame.scale.setScalar(.8 + .4 * Math.sin(lt * 40)); rl.a = fade(lt, c.b(0) + .5, c.b(1));
    const g1 = ss((lt - c.b(1) - .3) / 5);
    rib.forEach(({ m, off }) => { setTube(m, DIR0.clone().multiplyScalar(R0).add(off), DIR0.clone().multiplyScalar(R0 + (TOPu - R0) * g1).add(off)); m.visible = g1 > .001; });
    climbers.forEach((m, i) => { const q = ((lt - c.b(1)) * .02 + i / 6) % 1; m.visible = g1 > .3; m.position.copy(DIR0).multiplyScalar(R0 + (RGu - R0) * q * g1).add(rib[i % 2 ? 0 : 2].off); });
    W3.setCam(kv([[0, [3, 7, 15, 0, 3, 0]], [c.b(1), [4, 8, 17, 0, 3.5, 0]], [c.b(1) + 7, [48, 55, 175, 48, 4, 0]], [c.b(2), [48, 55, 175, 48, 4, 0]], [c.T, [40, -30, 160, 48, 26, 0]]], lt));
  });
});

// ============ 01 尺度 ============
S('scale', c => {
  c.head('01', '有多长');
  const g = W3.group(), spin = new THREE.Group(); g.add(spin); spin.add(W3.earth()); const th0 = 1.658;
  const geoR = ringL(RGu, 0x6fb8ff, .6, 1.2); g.add(geoR); const issR = ringL((RE + 400e3) * KM, 0xff7a6b, .9); g.add(issR);
  const rib = ribbons(spin, DIR0, R0, TOPu, .35, .09);
  const st = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), pm(0xdfe6f2)); st.position.copy(DIR0).multiplyScalar(RGu); spin.add(st);
  const cw = new THREE.Mesh(new THREE.SphereGeometry(1.8, 24, 16), pm(0x8a94aa)); cw.position.copy(DIR0).multiplyScalar(TOPu); spin.add(cw);
  const Lg = W3.label('地球同步轨道 <b>35,786 km</b><br><span style="font-size:20px;color:var(--fg2)">绕地球一圈 = 一天</span>', st), Lc = W3.label('配重 <b>约 100,000 km</b>', () => cw.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 5, 0))), Li = W3.label('国际空间站 <b>400 km</b>', new THREE.Vector3(-(RE + 400e3) * KM * .72, 0, (RE + 400e3) * KM * .72), 'l');
  show(c, det(1300, 640, 520, '长度', '带子全长约 <b>10 万公里</b><br>地球赤道周长约 4 万公里 → 约 <b>2.5 倍</b>'), c.b(1) + 2, c.b(2));
  show(c, det(1300, 640, 520, '尺度对比', '珠穆朗玛峰 8.8 km：在这个比例下不到一个像素'), c.b(2) + 2, c.b(2) + 9);
  const inset = show(c, card(1340, 560, 480, `<div class="k">四条带子（从上往下看，示意）</div><svg width="420" height="250" viewBox="0 0 420 250">
     <rect x="110" y="25" width="200" height="200" fill="none" stroke="#2C3854" stroke-dasharray="6 6"/>
     ${RIB.map(([a, b, d]) => `<circle cx="${210 + a * 100}" cy="${125 + b * 100}" r="18" fill="${d === 'up' ? '#ffd27a' : '#8fc8ff'}"/><text x="${210 + a * 100}" y="${133 + b * 100}" font-size="22" font-weight="800" text-anchor="middle" fill="#070A12">${d === 'up' ? '↑' : '↓'}</text>`).join('')}
     <text x="10" y="135" fill="#ffd27a" font-size="20">上行 ×2</text><text x="330" y="135" fill="#8fc8ff" font-size="20">下行 ×2</text></svg><div class="cap">间距约几百米，画面里放大了</div>`), c.b(2) + 9);
  c.tick(lt => {
    spin.rotation.y = th0 - .9 + lt * .06;
    const gr = ss((lt - c.b(1)) / 4), top = R0 + (RGu - R0) + (TOPu - RGu) * gr;
    rib.forEach(({ m, off }) => setTube(m, DIR0.clone().multiplyScalar(R0).add(off), DIR0.clone().multiplyScalar(top).add(off)));
    cw.visible = gr > .9; Lc.a = fade(lt, c.b(1) + 3.5, c.b(2)); Lg.a = fade(lt, c.b(0) + 3, c.b(2)); Li.a = fade(lt, c.b(2) + 1.5, null); issR.material.opacity = .9 * ss((lt - c.b(2)) / 1.5);
    W3.setCam(kv([[0, [0, 40, 95, 0, 0, 0]], [c.b(1), [0, 45, 105, 0, 0, 0]], [c.b(1) + 5, [10, 120, 230, 25, 0, 0]], [c.b(2), [10, 120, 230, 25, 0, 0]], [c.b(2) + 4, [6, 7, 15, 0, 0, 0]], [c.T, [9, 6, 14, 0, 0, 0]]], lt));
  });
});

// ============ 02 受力 ============
S('force', c => {
  c.head('02', '为什么不会掉下来');
  const g = W3.group(); g.add(W3.earth()); W3.stars.visible = true;
  const H = r => (r - RE) * KM, comp = h => Math.sqrt(h) * 6, axisTop = comp(H(RE + 100000e3));
  const teth = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, axisTop, 8), bm(UP)); teth.position.y = R0 + axisTop / 2; g.add(teth);
  const segs = Array.from({ length: 40 }, (_, i) => { const y0 = R0 + axisTop * i / 40, m = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, axisTop / 40 * .96, 10, 1, true), bm(0xff5a3c, .0, true)); m.position.y = y0 + axisTop / 80; g.add(m); return { m, y: y0 + axisTop / 80 }; });
  const ar = []; for (let i = 1; i <= 12; i++) { const h = (i / 12) ** 2 * 100000e3, r = RE + h, y = R0 + comp(h * KM), gap = comp(h * KM) - comp(((i - 1) / 12) ** 2 * 100000);
    const a1 = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(-1.6, y, 0), 1, Cc(0xff7a6b), 2, 1.4), a2 = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1.6, y, 0), 1, Cc(0x7fe0a8), 2, 1.4);
    [a1, a2].forEach(a => { a.line.material.toneMapped = a.cone.material.toneMapped = false; }); g.add(a1, a2); ar.push({ r, a1, a2, gap, y }); }
  const gm = new THREE.Mesh(new THREE.TorusGeometry(1.6, .09, 8, 48), bm(0x6fb8ff)); gm.rotation.x = Math.PI / 2; g.add(gm);
  const Lgm = W3.label('', gm, ''); Lgm.dx = -110;
  W3.label('<span style="color:#ff7a6b">重力 ↓</span>', new THREE.Vector3(-4, R0 + comp(H(RE + 2000e3)), 0), 'l'); W3.label('<span style="color:#7fe0a8">离心 ↑</span>', new THREE.Vector3(4.2, R0 + comp(H(RE + 70000e3)), 0), 'l');
  W3.label('赤道海面', new THREE.Vector3(3.5, R0, 0), 'l dim'); W3.label('配重端', new THREE.Vector3(3, R0 + axisTop, 0), 'l dim');
  const chW = 680, chH = 470, ch = c.el(`<canvas class="chart" width="${chW}" height="${chH}" style="left:1140px;top:250px;width:${chW}px;height:${chH}px"></canvas>`); c.in(ch, c.b(1));
  const x2 = ch.getContext('2d');
  const Pd = c.el(`<div class="mode" style="left:1140px;top:740px"></div>`); c.in(Pd, c.b(3));
  show(c, det(1140, 740, 680, '注意', '箭头长度按开方压缩；高度也按开方压缩（示意）'), c.b(0) + 4, c.b(1) + 4);
  let key = '';
  const draw = (w, rg, fr, ten) => { const k = [w.toFixed(7), fr.toFixed(2), ten.toFixed(2)].join(); if (k === key) return; key = k; x2.clearRect(0, 0, chW, chH);
    x2.fillStyle = '#A3AEC3'; x2.font = '600 24px "Noto Sans CJK SC"'; x2.fillText('每公斤受到的作用（随高度）', 24, 40);
    const X = h => 60 + h / 100000 * 580, Y = a => 410 - Math.sqrt(a / 9.81) * 330;
    x2.strokeStyle = '#2C3854'; x2.lineWidth = 2; x2.beginPath(); x2.moveTo(60, 70); x2.lineTo(60, 410); x2.lineTo(640, 410); x2.stroke();
    const curve = (f, col, lw = 4) => { x2.strokeStyle = col; x2.lineWidth = lw; x2.beginPath(); const n = Math.round(200 * fr); for (let i = 0; i <= n; i++) { const h = i / 200 * 100000, r = RE + h * 1e3, y = Y(f(r)); i ? x2.lineTo(X(h), y) : x2.moveTo(X(h), y); } x2.stroke(); };
    curve(r => GM / r / r, '#ff7a6b'); curve(r => w * w * r, '#7fe0a8');
    if (ten > 0) { const pm = phi(rg, w); x2.globalAlpha = ten; x2.setLineDash([]); { x2.strokeStyle = '#ffd27a'; x2.lineWidth = 5; x2.beginPath(); for (let i = 0; i <= 200; i++) { const h = i / 200 * 100000, v = Math.max(0, phi(RE + h * 1e3, w) / pm), y = 410 - v * 300; i ? x2.lineTo(X(h), y) : x2.moveTo(X(h), y); } x2.stroke(); } x2.globalAlpha = 1; x2.fillStyle = '#ffd27a'; x2.font = '600 20px "Noto Sans CJK SC"'; x2.globalAlpha = ten; x2.fillText('张力（相对值）', X(62000), 150); x2.globalAlpha = 1; }
    const hx = X((rg - RE) / 1e3); if (fr > .99) { x2.strokeStyle = '#6fb8ff'; x2.setLineDash([8, 6]); x2.lineWidth = 2; x2.beginPath(); x2.moveTo(hx, 70); x2.lineTo(hx, 410); x2.stroke(); x2.setLineDash([]); x2.fillStyle = '#6fb8ff'; x2.font = '600 20px "Noto Sans CJK SC"'; x2.fillText('平衡点', hx + 8, 92); }
    x2.fillStyle = '#66728C'; x2.font = '500 19px "DejaVu Sans Mono"'; x2.fillText('0', 54, 440); x2.fillText('高度 10 万 km', 500, 440);
    x2.fillStyle = '#ff7a6b'; x2.font = '600 21px "Noto Sans CJK SC"'; x2.fillText('重力', 80, 120); x2.fillStyle = '#7fe0a8'; x2.fillText('离心', 560, 300); };
  const len = a => Math.min(9, Math.sqrt(a) * 2.6);
  c.tick(lt => {
    const hrs = kv([[c.b(3) + .5, 23.934], [c.b(3) + 3.5, 18], [c.b(3) + 7, 32], [c.b(3) + 10, 23.934]], lt), w = 2 * Math.PI / (hrs * 3600), rg = Math.cbrt(GM / w / w);
    const ga = ss((lt - c.b(0) - 1) / 3);
    ar.forEach((q, i) => { const s = ss(ga * 1.6 - i / 12 * .6), gg = GM / q.r / q.r, cc = w * w * q.r, mx = Math.max(gg, cc), L = Math.max(4, q.gap * .9); q.a1.visible = q.a2.visible = s > .01; q.a1.setLength(Math.max(2.1, L * gg / mx) * s + .01, 2, 1.4); q.a2.setLength(Math.max(2.1, L * cc / mx) * s + .01, 2, 1.4); });
    gm.position.y = R0 + comp(H(rg)); gm.visible = lt > c.b(1) + 2; Lgm.a = fade(lt, c.b(1) + 2, null); Lgm.d.innerHTML = `平衡点 <b>${fmt((rg - RE) / 1e3)} km</b>`;
    const ten = ss((lt - c.b(2) - 1) / 2), pmx = phi(rg, w); segs.forEach(s => { const r = RE + ((s.y - R0) / 6) ** 2 / KM, v = Math.max(0, phi(r, w) / pmx); s.m.material.opacity = ten * v * .55; });
    draw(w, rg, ss((lt - c.b(1)) / 3), ten); Pd.textContent = `地球自转一圈：${fmt(hrs, 1)} 小时`;
    W3.setCam(kv([[0, [44, 30, 122, 22, 31, 0]], [c.b(1), [42, 32, 124, 23, 32, 0]], [c.T, [38, 33, 126, 23, 33, 0]]], lt));
  });
  credit(c);
});

// ============ 03 材料 ============
const MATS = [['高强钢', 5e9, 7900, '#9aa6bc'], ['凯夫拉', 3.6e9, 1440, '#c9a0ff'], ['Zylon', 5.8e9, 1560, '#7fe0a8'], ['碳纳米管（理论）', 100e9, 1300, '#6fb8ff']];
const taper = (s, rho) => Math.exp(phi(RG) * rho / s);
S('material', c => {
  c.head('03', '用什么做带子');
  const g = W3.group();
  show(c, `<div class="abs" style="left:0;right:0;top:300px;text-align:center;z-index:5"><div style="font:800 64px var(--serif)">比强度 = 抗拉强度 ÷ 密度</div><div class="p" style="margin-top:22px;font-size:30px">带子每一处都要撑住它下面的全部重量 → 必须越往上越粗</div></div>`, c.b(0) + .6, c.b(1));
  const rows = [...MATS.map(m => ({ n: m[0], T: taper(m[1], m[2]), sp: m[1] / m[2] / 1e6, col: m[3] })), { n: '本期设定（安全系数 2）', T: taper(65e9 / 2, 1300), sp: 65e9 / 1300 / 1e6, col: '#ffd27a', set: true }];
  const X0 = 360, WB = 1060, Lx = T => Math.max(6, Math.log10(T) / 34 * WB);
  const box = c.el(`<div class="abs" style="left:100px;top:230px;width:1720px;z-index:5"><div class="cap" style="margin:0 0 18px 260px">锥度比：同步轨道处截面 ÷ 地面截面（对数刻度，每格 ×10<sup>5</sup>）</div>
    ${rows.map((r, i) => `<div class="row" style="display:flex;align-items:center;height:92px;gap:0"><div style="width:260px;font-size:28px;font-weight:700;color:${r.set ? 'var(--gold)' : 'var(--fg)'}">${r.n}<div style="font:500 18px var(--mono);color:var(--fg3);font-weight:500">比强度 ${fmt(r.sp, 1)} GPa/(g/cm³)</div></div>
      <div class="bar" style="width:${Lx(r.T)}px;background:${r.col};transform-origin:0 50%"></div><div style="margin-left:18px;font:700 30px var(--mono);color:${r.set ? 'var(--gold)' : 'var(--fg)'}">${sci(r.T)}</div></div>`).join('')}</div>`);
  const R = [...box.querySelectorAll('.row')];
  [0, 1, 2].forEach(i => c.in(R[i], c.b(1) + .4 + i * 2.2, { dx: -20, dy: 0 })); c.in(R[3], c.b(2) + .5, { dx: -20, dy: 0 }); c.in(R[4], c.b(3) + 1, { dx: -20, dy: 0 }); c.in(box.firstElementChild, c.b(1) + .2);
  c.out(box, c.b(3) + 9);
  show(c, det(100, 760, 760, '本期设定', '量产碳纳米管带：抗拉强度 65 GPa，密度 1.3 g/cm³<br>比强度 50 GPa/(g/cm³)，约为理论值的 65%', '今天实验室里的碳纳米管束已有接近的比强度，但长度只有厘米级'), c.b(3) + 3, c.b(3) + 9);
  // 设定下的锥形带子（三维）
  const N = 200, comp = h => Math.sqrt(h * KM) * 6, lnT = Math.log(rows[4].T), P = [], I = [], Co = [];
  for (let i = 0; i <= N; i++) { const h = (i / N) ** 2 * 100000e3, k = Math.exp(phi(RE + h) * 1300 / 32.5e9 - lnT), wv = Math.max(7 * k, .05), y = comp(h);
    P.push(-wv / 2, y, 0, wv / 2, y, 0); const cc = Cc(new THREE.Color().setHSL(.12 - .08 * (1 - k), .85, .4 + .2 * k).getHex()); Co.push(cc.r, cc.g, cc.b, cc.r, cc.g, cc.b); if (i < N) { const a = i * 2; I.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); geo.setAttribute('color', new THREE.Float32BufferAttribute(Co, 3)); geo.setIndex(I);
  const tap = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, toneMapped: false, transparent: true })); g.add(tap);
  const gl = new THREE.Mesh(new THREE.PlaneGeometry(12, .15), bm(0x6fb8ff)); gl.position.y = comp(RG - RE); g.add(gl);
  const L1 = W3.label('地球同步轨道 · 最宽处 ≈ 地面的 <b>7 倍</b>', new THREE.Vector3(6.5, comp(RG - RE), 0), 'l'), L2 = W3.label('地面', new THREE.Vector3(4, 0, 0), 'l dim'), L3 = W3.label('配重端', new THREE.Vector3(4, comp(1e8), 0), 'l dim'); [L1, L2, L3].forEach(L => L.dx = 0);
  c.tick(lt => { const a = ss((lt - c.b(3) - 9) / 1); tap.material.opacity = a; gl.visible = a > .01; [L1, L2, L3].forEach(L => L.a = a);
    W3.setCam([-8, 30, 100, -8, 30, 0]); });
});

// ============ 04 建造 ============
S('build', c => {
  c.head('04', '怎么挂上去');
  const g = W3.group(); g.add(W3.earth());
  const comp = h => Math.sqrt(h * KM) * 2.2, yG = R0 + comp(RG - RE), yTop = R0 + comp(100000e3);
  const mk = col => new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 8), bm(col)); const lower = mk(UP), upper = mk(UP); g.add(lower, upper);
  const others = [[1.2, 0, DOWN], [1.2, 1.2, UP], [0, 1.2, DOWN]].map(([x, z, col]) => { const m = mk(col); m.position.set(x, 0, z); g.add(m); return m; });
  const craft = new THREE.Mesh(new THREE.BoxGeometry(.9, .55, .55), pm(0xdfe6f2)); g.add(craft);
  const rocket = new THREE.Mesh(new THREE.ConeGeometry(.25, .9, 12), pm(0xffffff)); g.add(rocket); const fl = new THREE.Mesh(new THREE.SphereGeometry(.22, 10, 8), bm(0xffa040, .7, true)); fl.position.y = -.55; rocket.add(fl);
  const plat = new THREE.Mesh(new THREE.BoxGeometry(2.4, .2, 2.4), pm(0xb8c2d4)); plat.position.set(.6, R0 + .05, .6); g.add(plat);
  const climbers = Array.from({ length: 5 }, () => { const m = new THREE.Mesh(new THREE.BoxGeometry(.4, .3, .4), pm(0xffc46b, { emissive: Cc(0x553300) })); g.add(m); return m; });
  const Lc = W3.label('', craft, 'l'); Lc.dx = -120; W3.label('地球同步轨道', new THREE.Vector3(-2.2, yG, 0), 'l dim'); const Lp = W3.label('赤道海上平台', plat, 'l');
  const ST = ['发射种子带', '一边放带一边外退', '下端锚定在海上平台', '爬升器逐层加厚', '再建另外三条'];
  const steps = c.el(`<div class="steps" style="left:1360px;top:250px">${ST.map((s, i) => `<div><b>${i + 1}</b>${s}</div>`).join('')}</div>`); c.in(steps, c.b(0) + .3);
  show(c, det(1360, 640, 460, '早期研究方案（爱德华兹）', '种子带约 <b>19,800 kg</b><br>加厚用的爬升器约 <b>200 台</b>'), c.b(2) + 6, c.b(3) + 1);
  show(c, det(100, 760, 560, '画面说明', '高度按开方压缩，带子间距放大（示意）'), c.b(0) + 3, c.b(1) + 2);
  const U = [[c.b(0) + .5, 0], [c.be(0), .19], [c.b(1) + .3, .2], [c.be(1), .56], [c.b(2) + .3, .57], [c.b(2) + 4, .6], [c.be(2), .79], [c.b(3) + .3, .8], [c.be(3), 1]];
  c.tick(lt => { const u = kv(U, lt), a = ss(u / .18), b = ss((u - .2) / .36), d = ss((u - .6) / .2), e = ss((u - .8) / .18), stage = Math.min(4, Math.floor(u * 5 + .02));
    [...steps.children].forEach((el, i) => el.classList.toggle('on', i === stage));
    rocket.visible = u < .2; rocket.position.y = R0 + 1 + (yG - R0 - 1) * a;
    const lowEnd = yG - (yG - R0) * b, upEnd = yG + (yTop - yG) * b, th = .06 + .14 * d;
    lower.visible = upper.visible = b > 0; lower.scale.set(th, Math.max(.001, yG - lowEnd), th); lower.position.y = (yG + lowEnd) / 2; upper.scale.set(th, Math.max(.001, upEnd - yG), th); upper.position.y = (yG + upEnd) / 2;
    others.forEach((m, i) => { const q = ss((e - i * .25) / .5); m.visible = q > 0; const lo = R0 + (yG - R0) * (1 - q), hi = yG + (yTop - yG) * q; m.scale.set(.2, Math.max(.001, hi - lo), .2); m.position.y = (lo + hi) / 2; });
    craft.visible = u >= .17; craft.position.y = u < .2 ? yG : upEnd;
    climbers.forEach((m, i) => { const q = ((u * 30 + i / 5) % 1); m.visible = u > .6 && u < .8; m.position.y = R0 + (yG - R0) * q; });
    Lc.d.innerHTML = u < .2 ? '' : u < .56 ? `下端距海面 <b>${fmt((lowEnd - R0) / (yG - R0) * 35786)}</b> km` : ''; Lc.a = u > .2 && u < .56 ? 1 : 0; Lp.a = fade(lt, c.b(2), null);
    W3.setCam(kv([[0, [20, yG * .75, 40, 0, yG * .78, 0]], [c.b(1), [26, 18, 54, 0, 17.5, 0]], [c.b(2), [14, R0 + 5, 24, 0, R0 + 4, 0]], [c.b(3), [26, 18, 54, 0, 17.5, 0]], [c.T, [28, 18, 58, 0, 17.5, 0]]], lt)); });
  credit(c);
});

// ============ 05 爬升器 ============
S('climber', c => {
  c.head('05', '电梯厢');
  const gA = W3.group(), gB = W3.group();
  // 近景：带子 + 爬升器
  const tc = document.createElement('canvas'); tc.width = 64; tc.height = 512; const x = tc.getContext('2d'); x.fillStyle = '#4a3f2c'; x.fillRect(0, 0, 64, 512);
  let sd = 3; const rr = () => (sd = (sd * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 50; i++) { x.fillStyle = `rgba(255,214,140,${.12 + rr() * .3})`; x.fillRect(rr() * 64, rr() * 512, 1 + rr() * 2, 20 + rr() * 80); }
  const rt = new THREE.CanvasTexture(tc); rt.wrapS = rt.wrapT = THREE.RepeatWrapping; rt.repeat.set(1, 10); rt.encoding = THREE.sRGBEncoding;
  const rib = new THREE.Mesh(new THREE.BoxGeometry(1.1, 90, .02), new THREE.MeshStandardMaterial({ map: rt, metalness: .4, roughness: .45 })); rib.position.z = 0; gA.add(rib);
  const cm = W3.model('climber', { h: 4.6, y: -2.6 }); gA.add(cm);
  const beam = new THREE.Group(); [[.25, .7], [.6, .28], [1.1, .1]].forEach(([r, o]) => beam.add(new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.3, 44, 24, 1, true), bm(0x66ff99, o, true)))); beam.position.y = -24.8; gA.add(beam);
  const Lr = W3.label('成对的滚轮夹住带子', new THREE.Vector3(0, 1.95, .2)); Lr.dx = -110; const Lk = W3.label('载荷舱 · 20 吨', new THREE.Vector3(-1.3, 1.2, 0)); Lk.dx = 10;
  const Lp = W3.label('光伏板：接收地面激光', new THREE.Vector3(0, -2.1, 1.2)); Lp.dx = 10; const Lb = W3.label('激光束（示意）', new THREE.Vector3(0, -12, 1.5), 'l');
  const hudE = c.el(`<div class="mode" style="left:100px;top:210px"></div>`); c.in(hudE, c.b(0) + .5); c.out(hudE, c.b(3) - .4);
  show(c, card(1360, 300, 460, `<div class="k">本期设定</div><div class="kv"><span>每台载重</span><b>20 吨</b><span>速度</span><b>300 km/h</b><span>到同步轨道</span><b>约 5 天</b><span>燃料</span><b>不需要</b></div>`), c.b(2) + .5, c.b(3) - .4);
  // 远景：范艾伦辐射带
  gB.add(W3.earth()); const ribB = ribbons(gB, DIR0, R0, RGu, .3, .08);
  const belt = (rm, tr, sy, col, op) => { const m = new THREE.Mesh(new THREE.TorusGeometry(rm, tr, 24, 96), bm(col, op, true)); m.rotation.x = Math.PI / 2; m.scale.z = sy; gB.add(m); return m; };
  const b1 = belt(R0 + 3.5, 2.5, .7, 0xff8a5c, .16), b2 = belt(R0 + 30, 15, .55, 0xc070ff, .06);
  const cb = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), pm(0xffc46b, { emissive: Cc(0x664400) })); gB.add(cb);
  const L1 = W3.label('内辐射带 · 约 1,000–6,000 km', new THREE.Vector3(-R0 - 3.5, 4.5, 0), 'l'), L2 = W3.label('外辐射带 · 约 13,000–60,000 km', new THREE.Vector3(-R0 - 30, 11, 0), 'l');
  show(c, det(1300, 700, 520, '辐射', '货物不怕；载人舱需要额外屏蔽<br>穿过辐射带要一天左右'), c.b(3) + 3);
  c.tick(lt => {
    const B = lt > c.b(3) - .3; gA.visible = !B; gB.visible = B;
    rt.offset.y = -lt * .9; const h = (lt - c.b(0)) * 100; hudE.innerHTML = `高度 <b style="color:#fff">${fmt(Math.max(0, h))} km</b> · 示意：1 秒 ≈ 20 分钟`;
    beam.visible = lt > c.b(1) + .5; const bo = ss((lt - c.b(1) - .5) / 1) * (1 + .08 * Math.sin(lt * 13)); beam.children.forEach((m, i) => m.material.opacity = [.7, .28, .1][i] * bo);
    Lr.a = fade(lt, c.b(0) + 2, c.b(1) + 1); Lk.a = fade(lt, c.b(0) + 4, c.b(1) + 1); Lp.a = fade(lt, c.b(1) + 2, c.b(2) + 1); Lb.a = fade(lt, c.b(1) + 2.5, c.b(2) + 1);
    const ang = .7 + lt * .035;
    if (!B) W3.setCam(kv([[0, [Math.sin(ang) * 11, 1.5, Math.cos(ang) * 11, 0, .3, 0]], [c.b(1), [Math.sin(ang) * 11, 1, Math.cos(ang) * 11, 0, 0, 0]], [c.b(1) + 2, [7, -14, 9, 0, -2, 0]], [c.b(2), [7, -12, 10, 0, -1.5, 0]], [c.b(2) + 2.5, [-9, 2.5, 9, -1.8, .2, 0]], [c.b(3), [-10, 2.5, 8, -1.8, .2, 0]]], lt));
    else { const q = ((lt - c.b(3)) * .05) % 1; cb.position.copy(DIR0).multiplyScalar(R0 + (RGu - R0) * q).add(ribB[0].off); W3.setCam(kv([[c.b(3), [-14, 22, 105, 4, 0, 0]], [c.T, [-24, 26, 108, 4, 0, 0]]], lt)); }
    L1.a = L2.a = B ? fade(lt, c.b(3) + 1, null) : 0;
  });
  credit(c);
});

// ============ 06 运力 ============
S('capacity', c => {
  c.head('06', '慢，但是多');
  const g = W3.group(); g.add(W3.earth());
  const comp = h => Math.sqrt(h * KM) * 2.4, yG = R0 + comp(RG - RE), sp = .75;
  RIB.forEach(([a, b, d]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, yG - R0 + 1.5, 6), bm(d === 'up' ? UP : DOWN)); m.position.set(a * sp, (yG + R0) / 2 + .75, b * sp); g.add(m); });
  g.add(W3.model('geo_station', { h: 3.6, y: yG - 2 }));
  const box = new THREE.BoxGeometry(.2, .1, .2), mU = pm(0xffc46b, { emissive: Cc(0x553300) }), mD = pm(0x9fd0ff, { emissive: Cc(0x112244) });
  const pool = []; RIB.forEach(([a, b, d]) => { for (let i = 0; i < 60; i++) { const m = new THREE.Mesh(box, d === 'up' ? mU : mD); g.add(m); pool.push({ m, a, b, d, i }); } });
  W3.label('同步轨道站', new THREE.Vector3(2.4, yG, 0), 'l').dx = 0; W3.label('上行（金）· 下行（蓝）', new THREE.Vector3(1.6, R0 + 5, 0), 'l').dx = 0;
  const hudE = c.el(`<div class="mode" style="left:100px;top:210px"></div>`); c.in(hudE, c.b(0) + .5);
  const k1 = show(c, card(1260, 230, 560, `<div class="k">四条带子 · 本期设定</div><div class="kv"><span>每条上行带子</span><b>每 2 小时一台</b><span>单程</span><b>约 5 天</b><span>同时在途</span><b class="n1">约 240 台</b><span>每年送上同步轨道</span><b class="n2">约 175,200 吨</b></div>`), c.b(0) + 3, c.b(2));
  const cmpE = show(c, card(1260, 560, 560, `<div class="k">年运量对比</div><div style="font-size:21px;color:var(--fg2);margin:10px 0 4px">今天全世界一年送入轨道（约，2025）</div><div class="bar" style="width:${Math.max(4, 2700 / 175200 * 480)}px;background:#9aa6bc"></div><div class="mono" style="font-size:20px;margin-top:4px">约 2,700 吨</div>
    <div style="font-size:21px;color:var(--fg2);margin:14px 0 4px">太空电梯（设定）</div><div class="bar" style="width:480px;background:var(--gold)"></div><div class="mono" style="font-size:20px;margin-top:4px;color:var(--gold)">约 175,200 吨 · 几十倍</div><small class="cap">2025 年数字按 BryceTech 季度报告推算</small>`), c.b(1) + 4, c.b(2));
  show(c, card(1260, 230, 560, `<div class="k">能耗</div><div class="kv"><span>物理下限</span><b>13.5 kWh/kg</b><span>激光传输效率按</span><b>10%</b><span>实际用电</span><b>约 135 kWh/kg</b><span>电价 0.1 美元/kWh</span><b>约 13.5 美元/kg</b></div>`), c.b(2) + .5, c.b(3));
  show(c, card(1260, 230, 560, `<div class="k">每公斤运输成本（数量级，示意）</div>
    <div style="font-size:21px;color:var(--fg2);margin:12px 0 4px">火箭 · 近地轨道</div><div class="bar" style="width:440px;background:#ff7a6b"></div><div class="mono" style="font-size:20px;margin-top:4px">数千美元</div>
    <div style="font-size:21px;color:var(--fg2);margin:14px 0 4px">太空电梯 · 同步轨道（各方案估算）</div><div class="bar" style="width:120px;background:var(--gold)"></div><div class="mono" style="font-size:20px;margin-top:4px;color:var(--gold)">几十到几百美元</div><small class="cap">不含建造、维护的分摊在内的估算差异很大</small>`), c.b(3) + .5);
  c.tick(lt => {
    const days = Math.max(0, lt - c.b(0)) / 4; hudE.innerHTML = `第 <b style="color:#fff">${fmt(days, 1)}</b> 天 · 示意：1 秒 ≈ 6 小时`;
    const ph = Math.max(0, lt - c.b(0)) / 20;   // 单程 20 秒
    const on = ss((lt - c.b(0) - .5) / 3);
    pool.forEach(p => { const q = (ph + p.i / 60) % 1, fill = p.i / 60 < on; p.m.visible = fill; const y = p.d === 'up' ? R0 + (yG - R0) * q : yG - (yG - R0) * q; p.m.position.set(p.a * sp, y, p.b * sp); });
    W3.setCam(kv([[0, [17, 15, 32, 7, 14.2, 0]], [c.b(1), [15, 16, 30, 6.5, 15, 0]], [c.b(2), [5, yG + 2, 9, 2.5, yG - .5, 0]], [c.b(3), [8, yG + 1, 12, 3.5, yG - .5, 0]], [c.T, [18, 13, 32, 7.5, 12, 0]]], lt));
  });
  credit(c);
});

// ============ 07 对比 ============
S('compare', c => {
  c.head('07', '其他通往太空的路');
  const g = W3.group(); const R = R0, arcA = .8;
  const earth = new THREE.Mesh(new THREE.CircleGeometry(R, 512, Math.PI / 2 - arcA / 2, arcA), bm(0x1d3b2a)); g.add(earth);
  const sea = new THREE.Mesh(new THREE.RingGeometry(R - .03, R, 512, 1, Math.PI / 2 - arcA / 2, arcA), bm(0x2a6fb0)); sea.position.z = .001; g.add(sea);
  const atm = new THREE.Mesh(new THREE.RingGeometry(R, R + .1, 512, 1, Math.PI / 2 - arcA / 2, arcA), bm(0x5aa0ff, .22)); atm.position.z = .002; g.add(atm);
  const P = (ang, h) => new THREE.Vector3(-(R + h) * Math.sin(ang), (R + h) * Math.cos(ang), .01);
  const tb = (pts, col, w = .006) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 200, w, 6, false), bm(col));
  const arc = (h, col, w) => { const p = []; for (let i = 0; i <= 160; i++) p.push(P(-arcA / 2 + arcA * i / 160, h)); return tb(p, col, w); };
  const items = [];
  const add = (obj, lab, pos, t0, cls = 'l') => { g.add(obj); const L = W3.label(lab, pos, cls); items.push({ obj, L, t0 }); return obj; };
  add(arc(.1, 0x5a6680, .002), '卡门线 100 km', P(-.36, .12), c.b(0) + 1, 'l dim'); add(arc(.4, 0x8a94aa, .002), '国际空间站 400 km', P(-.36, .42), c.b(0) + 1, 'l dim');
  const el = add(tb([P(.02, 0), P(.02, 2.2)], UP, .009), '太空电梯 ↑ 一直到 35,786 km 以上', P(.02, 1.0), c.b(0) + 2.5); items[items.length - 1].L.dx = -104;
  const L1 = 2000e3 / RE, lp = []; for (let i = 0; i <= 80; i++) { const u = i / 80, ang = -.37 + L1 * u, h = .08 * Math.sin(Math.min(1, u / .1, (1 - u) / .1) * Math.PI / 2); lp.push(P(ang, h)); }
  add(tb(lp, 0xff9a6b), '发射环 · 80 km 高 · 2,000 km 长', P(-.21, .13), c.b(0) + 7);
  const L2 = 1500e3 / RE, sp2 = []; for (let i = 0; i <= 50; i++) { const u = i / 50; sp2.push(P(.07 + L2 * u, .02 * u * u)); }
  add(tb(sp2, 0x7fe0a8), 'StarTram · 出口 20 km', P(.26, .07), c.b(1) + .5);
  const sk = new THREE.Group(); sk.position.copy(P(-.08, .65)); sk.add(tb([new THREE.Vector3(0, -.3, 0), new THREE.Vector3(0, .3, 0)], 0xc9a0ff, .007)); add(sk, '旋转天钩 · 约 600 km 长', P(-.1, .98), c.b(1) + 4); items[items.length - 1].L.dx = 4;
  add(arc(.3, 0x6fb8ff, .004), '轨道环 · 约 300 km', P(.36, .33), c.b(1) + 7.5);
  show(c, card(1180, 150, 640, `<div class="k">各有长短</div><div class="kv" style="grid-template-columns:auto 1fr;font-size:22px"><span style="color:var(--gold)">太空电梯</span><b style="text-align:left;font-family:var(--sans);font-weight:500">建成后不耗能维持 · 无过载 · 需超强材料</b><span style="color:#ff9a6b">发射环</span><b style="text-align:left;font-family:var(--sans);font-weight:500">材料要求低 · 要一直通电维持</b><span style="color:#7fe0a8">StarTram</span><b style="text-align:left;font-family:var(--sans);font-weight:500">加速度大，第一代只能运货</b><span style="color:#c9a0ff">旋转天钩</span><b style="text-align:left;font-family:var(--sans);font-weight:500">要配合高速飞行器</b><span style="color:#6fb8ff">轨道环</span><b style="text-align:left;font-family:var(--sans);font-weight:500">规模最大</b></div>`), c.b(2) + .5);
  W3.label('真实比例 · 地表一段约 5,000 km 的弧', new THREE.Vector3(0, R - .35, .01), 'l dim');
  c.tick(lt => { items.forEach(it => { const a = ss((lt - it.t0) / .8); it.obj.visible = a > .01; it.L.a = a * (1 - .85 * ss((lt - c.b(2)) / .6)); }); sk.rotation.z = lt * .4;
    W3.setCam(kv([[0, [0, R + .5, 4.6, 0, R + .5, 0]], [c.b(2), [0, R + .5, 4.6, 0, R + .5, 0]], [c.b(2) + 2, [.75, R + .45, 4.9, .75, R + .45, 0]], [c.T, [.75, R + .45, 4.9, .75, R + .45, 0]]], lt)); });
});

// ============ 08 风险 ============
S('risk', c => {
  c.head('08', '风险与冗余');
  const g = W3.group(); W3.stars.visible = true;
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(500, 500, 110, 110), new THREE.MeshPhongMaterial({ color: Cc(0x0b3a66), shininess: 90, specular: Cc(0x6fb8ff), flatShading: true })); sea.rotation.x = -Math.PI / 2; g.add(sea);
  const base = sea.geometry.attributes.position.array.slice();
  const plat = new THREE.Group(); g.add(plat); plat.add(W3.model('sea_platform', { w: 26, y: -4 }));
  g.add(W3.model('laser_station', { w: 9, x: -34, y: 0, z: 10 }));
  const N = 90, teth = RIB.map(([a, b, d]) => ({ a, b, d, pts: Array.from({ length: N + 1 }, () => new THREE.Vector3()), m: null }));
  const debris = new THREE.Mesh(new THREE.SphereGeometry(1.4, 14, 10), pm(0xff7a6b, { emissive: Cc(0x401010) })); g.add(debris);
  g.add(lineL([new THREE.Vector3(-220, 95, -60), new THREE.Vector3(220, 95, 60)], 0xff7a6b, .5));
  const Lp = W3.label('移动式海上平台', new THREE.Vector3(14, 8, 0), 'l'); Lp.dx = 0; const Ll = W3.label('激光供能站', new THREE.Vector3(-34, 12, 10), 'l'); const Ld = W3.label('轨道碎片', debris, 'l'); Ld.dx = 20;
  const mode = c.el(`<div class="mode" style="left:100px;top:210px"></div>`); c.in(mode, c.b(1) + .3);
  show(c, card(1300, 560, 520, `<div class="k">还要解决的问题</div><ul class="pl"><li>带子的摆动与振荡</li><li>高层大气中原子氧的腐蚀</li><li>雷击</li><li>带子万一中途断裂</li></ul>`), c.b(3) + .5);
  show(c, det(100, 760, 560, '画面说明', '尺度不按比例；横波和碎片轨道为示意'), c.b(1) + 2, c.b(2));
  const mats = { up: bm(UP), down: bm(DOWN), cut: bm(UP, .45) };
  c.tick(lt => {
    const Pp = sea.geometry.attributes.position.array; for (let i = 0; i < Pp.length; i += 3) Pp[i + 2] = base[i + 2] + Math.sin(base[i] * .07 + lt * 1.1) * .7 + Math.cos(base[i + 1] * .06 + lt * .9) * .6; sea.geometry.attributes.position.needsUpdate = true; sea.geometry.computeVertexNormals();
    const T1 = cl((lt - c.b(1)) / (c.be(1) - c.b(1) + 1)), avoid = lt >= c.b(1) && lt < c.b(2), cut = lt >= c.b(2);
    const sh = TT => avoid ? 18 * Math.sin(Math.min(1, TT / .35) * Math.PI / 2) * (TT < .8 ? 1 : Math.max(0, 1 - (TT - .8) / .2)) : 0;
    plat.position.x = sh(T1);
    teth.forEach((q, j) => { for (let i = 0; i <= N; i++) { const y = 10 + i * 2.6, TT = Math.max(0, T1 - i * .005); q.pts[i].set(q.a * 5.6 + sh(TT) * Math.exp(-i / 70), y, q.b * 5.6); }
      const broken = cut && j === 0; if (broken) { const k = 26, dt = Math.min(1, (lt - c.b(2)) / 3); for (let i = k; i <= N; i++) q.pts[i].copy(q.pts[k - 1]).add(new THREE.Vector3(Math.sin(i * .2) * dt * 2, -(i - k) * .03 * dt, dt * (i - k) * .05)); }
      if (q.m) { g.remove(q.m); q.m.geometry.dispose(); } q.m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(q.pts), 90, .28, 5, false), broken ? mats.cut : mats[q.d]); g.add(q.m); });
    const dk = avoid ? cl((lt - c.b(1) - 1) / 10) : -1; debris.visible = dk >= 0 && dk <= 1; debris.position.set(-220 + 440 * dk, 95, -60 + 120 * dk); Ld.a = debris.visible ? 1 : 0;
    Lp.a = fade(lt, c.b(0) + 1, c.b(1) + 2); Ll.a = fade(lt, c.b(0) + 2.5, c.b(1) + 2);
    mode.textContent = cut ? '冗余：一条断了，另外三条仍在受力' : avoid ? '平台提前移动，横波沿带子上传，让开碎片（示意）' : '';
    W3.setCam(kv([[0, [52, 20, 66, -8, 10, 0]], [c.b(1), [90, 42, 150, 0, 40, 0]], [c.b(2), [95, 50, 160, 0, 48, 0]], [c.b(3), [80, 40, 110, 0, 35, 0]], [c.T, [70, 30, 95, -5, 22, 0]]], lt));
  });
  credit(c);
});

// ============ 09 尾声 ============
S('end', c => {
  c.head('09', '门槛只有一个');
  const g = W3.group(), spin = new THREE.Group(); g.add(spin); spin.add(W3.earth()); const th0 = 1.658;
  ribbons(spin, DIR0, R0, TOPu, .35, .09); const st = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 1.4), pm(0xdfe6f2)); st.position.copy(DIR0).multiplyScalar(RGu); spin.add(st);
  const cw = new THREE.Mesh(new THREE.SphereGeometry(1.8, 24, 16), pm(0x8a94aa)); cw.position.copy(DIR0).multiplyScalar(TOPu); spin.add(cw);
  show(c, card(1240, 470, 580, `<div class="k">这一期的设想</div><div class="kv"><span>带子</span><b>4 条 · 约 10 万 km</b><span>材料（设定）</span><b>量产碳纳米管带</b><span>最宽 / 最窄</span><b>约 7 倍</b><span>爬升器</span><b>20 吨 · 300 km/h</b><span>到同步轨道</span><b>约 5 天</b><span>年运量</span><b>约 17.5 万吨</b><span>能耗下限</span><b>13.5 kWh/kg</b></div>`), c.b(0) + 3);
  show(c, `<div class="abs" style="left:100px;top:880px;font:700 34px var(--serif);color:var(--gold);z-index:6;text-shadow:0 0 12px #000">物理上成立 · 门槛在材料</div>`, c.b(0) + 8);
  c.tick(lt => { spin.rotation.y = th0 - .6 + lt * .03; W3.setCam(kv([[0, [60, 45, 175, 45, -14, 0]], [c.T, [55, 35, 150, 42, -12, 0]]], lt)); });
  credit(c);
});
