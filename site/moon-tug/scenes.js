// 《月球拖船》各场景
window.SCENES = {};
const S = (id, build) => SCENES[id] = { build };
const Cc = c => new THREE.Color(c).convertSRGBToLinear();
const bm = (c, op = 1, add = false) => new THREE.MeshBasicMaterial({ color: Cc(c), transparent: op < 1 || add, opacity: op, depthWrite: !(op < 1 || add), blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: false, side: THREE.DoubleSide });
const pm = (c, o = {}) => new THREE.MeshStandardMaterial({ color: Cc(c), metalness: .2, roughness: .7, ...o });
const lineL = (pts, c, op = 1) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: Cc(c), transparent: op < 1, opacity: op, toneMapped: false }));
const ringL = (r, c, op = .6, dash = 0) => { const l = ringLine(r, 0xffffff, op, dash); l.material.color = Cc(c); l.material.toneMapped = false; return l; };
const at = (x, y, w, html, cls = 'card') => `<div class="${cls}" style="left:${x}px;top:${y}px;width:${w}px">${html}</div>`;
const card = (x, y, w, html) => at(x, y, w, html, 'card');
const det = (x, y, w, h, body, small) => at(x, y, w, `<span class="h">${h}</span>${body}${small ? `<small>${small}</small>` : ''}`, 'det');
const show = (c, html, t0, t1, o = {}) => { const e = c.el(html); c.in(e, t0, o); if (t1 != null) c.out(e, t1); return e; };
const fade = (lt, t0, t1, d = .5) => Math.min(ss((lt - t0) / d), t1 == null ? 1 : ss((t1 - lt) / d));
const credit = (c, extra = '') => c.el(`<div class="abs" style="right:100px;bottom:14px;font-size:15px;color:var(--fg3);z-index:21">地球、月球图像：NASA${extra} · 数字为按公式推算的设想</div>`);
const kvt = rows => `<div class="kv">${rows.map(([a, b]) => `<span>${a}</span><b>${b}</b>`).join('')}</div>`;
// 发光点
const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.2, 'rgba(255,255,255,.6)'); g.addColorStop(.5, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
const glow = (col, size) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: Cc(col), blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, transparent: true })); s.scale.setScalar(size); return s; };
// 月球纹理：NASA CGI Moon Kit（LRO 彩色拼图）
let moonReadyRes; const moonReady = new Promise(r => moonReadyRes = r);
const moonTex = new THREE.TextureLoader().load('moon.jpg', () => moonReadyRes(), undefined, () => moonReadyRes()); moonTex.encoding = THREE.sRGBEncoding; moonTex.anisotropy = 4;
W3.ready = Promise.all([W3.ready, moonReady]);
const moon = R => new THREE.Mesh(new THREE.SphereGeometry(R, 64, 48), new THREE.MeshStandardMaterial({ map: moonTex, roughness: .95, metalness: 0 }));
const R0 = RE * KM;   // 地球半径，单位千公里
const D = window.DATA;

// ============ 开场：小说里的画面 ============
S('open', c => {
  const g = W3.group(), spin = new THREE.Group(); g.add(spin); spin.add(W3.earth());
  // 大陆上的一片发动机光柱（示意）
  let sd = 5; const r = () => (sd = (sd * 16807) % 2147483647) / 2147483647; const jets = [];
  for (let i = 0; i < 160; i++) { const lon = (60 + r() * 90) * Math.PI / 180 * (r() < .7 ? 1 : -1.3), lat = (20 + r() * 35) * Math.PI / 180;
    const d = new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), -Math.cos(lat) * Math.sin(lon));
    const j = new THREE.Mesh(new THREE.ConeGeometry(.06, 1.6, 6, 1, true), bm(0x7fc8ff, .55, true)); j.position.copy(d).multiplyScalar(R0 + .8); j.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d.clone().negate()); spin.add(j); jets.push(j); }
  show(c, det(100, 700, 600, '小说里的设定', '上万台发动机建在大陆上<br>推着地球离开太阳系，2,000 多年到达最近的恒星'), c.b(0) + 2, c.b(1));
  const ttl = c.el(`<div class="abs" style="left:0;right:0;top:300px;padding:60px 0;text-align:center;z-index:6;background:radial-gradient(ellipse at 50% 50%,rgba(7,10,18,.8),rgba(7,10,18,0) 70%)"><div class="big">月球拖船</div><div style="font:600 40px var(--sans);color:var(--gold);margin-top:22px;text-shadow:0 0 14px #000">把地球推出太阳系的可行性推演</div>
    <div style="margin-top:30px"><span class="pill">灵感来自一部科幻小说 · 文稿与画面：AI 生成 · 配音：AI 合成</span></div></div>`); c.in(ttl, c.b(2) + .2, { d: 1 });
  credit(c);
  c.tick(lt => { spin.rotation.y = -1.9 + lt * .02; jets.forEach((j, i) => j.scale.y = .8 + .3 * Math.sin(lt * 9 + i)); jets.forEach(j => j.material.opacity = .55 * (1 - .8 * ss((lt - c.b(2)) / 2)));
    W3.setCam(kv([[0, [4, 9, 20, 0, 1, 0]], [c.b(1), [10, 6, 19, 0, 0, 0]], [c.b(2), [14, 5, 24, 2, 0, 0]], [c.T, [20, 6, 32, 4, 0, 0]]], lt)); });
});

// ============ 01 三笔账 ============
S('ledger', c => {
  c.head('01', '三笔账');
  const g = W3.group(), e = W3.earth(); g.add(e); e.position.set(-19, -4, -10);
  const L = 3.828e26 * 86400;   // 太阳一天的输出
  const rows = [['停止自转', 2.14e29, '#8fc8ff', '约 0.006 天的太阳输出'], ['逃出太阳系', 2.65e33, '#ffd27a', '约 80 天的太阳输出'], ['两千多年飞到半人马座', 5.2e37, '#ff7a6b', '约 4,300 年的太阳输出']];
  const X = E => (Math.log10(E) - 28) / 10 * 900;
  const box = c.el(`<div class="abs" style="left:620px;top:260px;width:1200px;z-index:5"><div class="cap" style="margin-bottom:14px">所需能量（焦耳，对数刻度：每格 ×10）</div>${rows.map(([n, E, col, s]) => `<div class="row" style="display:flex;align-items:center;height:110px"><div style="width:270px;font-size:29px;font-weight:700">${n}</div><div class="bar" style="width:${X(E)}px;background:${col}"></div><div style="margin-left:16px"><div class="mono" style="font-size:28px;font-weight:700">${sci(E)}</div><div class="cap">${s}</div></div></div>`).join('')}</div>`);
  const R = [...box.querySelectorAll('.row')]; c.in(box.firstElementChild, c.b(0) + .3); R.forEach((r, i) => c.in(r, c.b(i) + .6, { dx: -20, dy: 0 }));
  show(c, det(620, 640, 700, '第三笔的燃料', '岩石聚变最多放出约 0.1% 的质能 → 喷流最快约 13,400 km/s<br>速度增量约 1,400 km/s → 要烧掉地球质量的约 <b>10%</b>'), c.b(2) + 4, c.b(3));
  show(c, `<div class="abs" style="left:620px;top:680px;z-index:6"><span class="mode" style="position:static;font-size:30px;padding:14px 26px">结论：按期抵达做不到 → 只求离开，用几万年漂过去</span></div>`, c.b(3) + .5);
  credit(c);
  c.tick(lt => { const w = 7.292e-5 * 2000 * (1 - ss((lt - c.b(0) - 1) / 6)); e.rotation.y = -1 + lt * .15 * (1 - ss((lt - c.b(0) - 1) / 6) * .95); W3.setCam([0, 2, 30, -2, 0, 0]); });
});

// ============ 02 目的地在动 ============
S('target', c => {
  c.head('02', '目的地在动');
  const g = W3.group(); W3.stars.visible = true;
  const U = 9.4607e15 * .1 / 1;   // 1 单位 = 0.1 光年（米）
  const P = new THREE.Vector3(...D.ac.P).divideScalar(U), V = new THREE.Vector3(...D.ac.V);   // m/s
  const sp = (yrs) => V.clone().multiplyScalar(yrs * 3.15576e7 / U);
  // 黄道坐标 → three：x→x, y(ecl)→-z, z(ecl)→y
  const tv = v => new THREE.Vector3(v.x, v.z, -v.y);
  const sun = glow(0xfff2c0, 1.6); g.add(sun); W3.label('太阳', new THREE.Vector3(0, -1.2, 0), 'l');
  const acp = tv(P), acv = tv(sp(1));
  const ac = glow(0xffe08a, 1.8); ac.position.copy(acp); g.add(ac); const Lac = W3.label('半人马座 α · 4.37 光年', acp.clone().add(new THREE.Vector3(0, 2, 0)));
  // 未来 7 万年的路径
  const path = []; for (let k = 0; k <= 70; k++) path.push(acp.clone().add(acv.clone().multiplyScalar(k * 1000))); const pl = lineL(path, 0xffd27a, .7); g.add(pl);
  const tc = 27955, cp = acp.clone().add(acv.clone().multiplyScalar(tc)); const cpm = glow(0xffd27a, .8); cpm.position.copy(cp); g.add(cpm); const Lcp = W3.label('2.8 万年后最近：3.15 光年', cp.clone().add(new THREE.Vector3(0, -1.6, 0)), 'l');
  const T = 57000, meet = acp.clone().add(acv.clone().multiplyScalar(T)); const el = lineL([new THREE.Vector3(), meet], 0x7fe0a8); g.add(el); const em = glow(0x7fe0a8, .9); g.add(em);
  const Lm = W3.label('地球：约 5.7 万年后相遇', meet.clone().add(new THREE.Vector3(0, 1.8, 0)), 'l');
  const acm = glow(0xffe08a, 1.2); g.add(acm);
  const yrE = c.el(`<div class="mode" style="left:100px;top:210px"></div>`); c.in(yrE, c.b(1));
  show(c, card(1300, 560, 520, `<div class="k">截击方案（直线近似）</div><div class="kv"><span>航程</span><b>离开后速度 · 方向</b><span>4 万年</span><b>25.6 km/s · 黄纬 −26°</b><span>5 万年</span><b>23.7 km/s · −16°</b><span>6 万年</span><b>23.4 km/s · −9°</b></div><small class="cap">星表：Kervella 等 2016；忽略银河潮汐和其他恒星</small>`), c.b(2) + .5);
  show(c, det(100, 760, 600, '半人马座 α 的运动', '视向速度 −22.4 km/s（靠近）· 切向 23.4 km/s'), c.b(0) + 4, c.b(1) + 1);
  c.tick(lt => { const k = ss((lt - c.b(0) - 3) / 6); pl.geometry.setDrawRange(0, Math.max(2, Math.round(71 * k))); cpm.visible = k > .45; Lcp.a = fade(lt, c.b(0) + 6, null);
    const u = ss((lt - c.b(1) - .5) / 7), yrs = T * u; em.position.lerpVectors(new THREE.Vector3(), meet, u); acm.position.copy(acp).add(acv.clone().multiplyScalar(yrs)); acm.visible = em.visible = el.visible = lt > c.b(1); el.geometry.setDrawRange(0, 2); Lm.a = fade(lt, c.b(1) + 6, null);
    yrE.innerHTML = `第 <b style="color:#fff">${fmt(yrs)}</b> 年`;
    const ctr = acp.clone().add(meet).add(cp).multiplyScalar(1 / 4), Rr = Math.max(acp.distanceTo(ctr), meet.distanceTo(ctr), ctr.length()), ang = .5 + lt * .012;
    const cam = ctr.clone().add(new THREE.Vector3(Math.sin(ang), .55, Math.cos(ang)).normalize().multiplyScalar(Rr * 2.7)); W3.setCam([cam.x, cam.y, cam.z, ctr.x + Rr * .25, ctr.y - Rr * .18, ctr.z]); });
});

// ============ 03 在哪里点火 ============
S('thrust', c => {
  c.head('03', '在哪里点火');
  const g = W3.group();
  const sun = glow(0xfff2c0, 1.2); g.add(sun); g.add(ringL(4, 0x5CB4FF, .35, .2));
  // 一组越来越扁的椭圆（近日点固定在 1 AU = 4 单位）
  const E = [0, .3, .55, .72, .85].map((e, i) => { const q = 4, a = q / (1 - e), b = a * Math.sqrt(1 - e * e), pts = []; for (let k = 0; k <= 200; k++) { const th = k / 200 * Math.PI * 2; pts.push(new THREE.Vector3(q - a + a * Math.cos(th), 0, b * Math.sin(th))); } const l = lineL(pts, 0x8fc8ff, .8); g.add(l); return l; });
  const burn = new THREE.Mesh(new THREE.RingGeometry(3.7, 4.3, 48, 1, -.45, .9), bm(0xff9a4b, .45)); burn.rotation.x = -Math.PI / 2; g.add(burn);
  W3.label('近日点附近点火', new THREE.Vector3(5.6, 0, 0), 'l').dx = 0; W3.label('太阳', new THREE.Vector3(0, -1, 0), 'l dim');
  const ch = c.el(card(1120, 230, 700, `<div class="k">推力大小 → 用时与速度增量（数值积分）</div>${kvt([['地球重力的 1/10,000', '3–6 年 · 20 km/s'], ['1/25,000（基准）', '约 30–40 年 · 21–23 km/s'], ['1/50,000', '50–110 年 · 23–25 km/s'], ['1/100,000', '230 年 · 27 km/s'], ['持续推、不挑位置', '速度增量 32–40 km/s']])}<small class="cap">目标：离开太阳系后 23.7 km/s；平面内计算</small>`)); c.in(ch, c.b(1) + .5); c.out(ch, c.b(2));
  const hot = c.el(card(1120, 300, 700, `<div class="k" style="color:var(--bad)">如果发动机建在地面</div>${kvt([['需要的功率', '太阳的几倍'], ['地球接收的阳光', '1.7 × 10<sup>17</sup> W'], ['废热哪怕只有百万分之一', '≈ 阳光的上万倍']])}`)); c.in(hot, c.b(2) + .5);
  const e2 = W3.earth(); e2.scale.setScalar(.12); g.add(e2);
  c.tick(lt => { E.forEach((l, i) => l.visible = lt > c.b(0) + 1 + i * 1.6); burn.material.opacity = .45 * fade(lt, c.b(0) + 1, null);
    const ang = lt * .9; e2.position.set(4 * Math.cos(ang * .3) , 0, 4 * Math.sin(ang * .3));
    W3.setCam(kv([[0, [-4, 30, 20, -6, 0, 0]], [c.b(1), [-6, 34, 26, -10, 0, 0]], [c.T, [-6, 34, 26, -10, 0, 0]]], lt)); });
});

// ============ 04 月球拖船 ============
S('tug', c => {
  c.head('04', '月球拖船');
  const g = W3.group(), e = W3.earth(); g.add(e);
  const d0 = 110, mR = 1.737, mn = moon(mR); mn.position.set(d0, 0, 0); g.add(mn);
  const old = ringL(384.4, 0x8a94aa, .35, 4); g.add(old); const Lold = W3.label('今天的月球轨道 · 38.4 万公里', new THREE.Vector3(-384.4 * .7, 0, 384.4 * .7), 'l dim');
  // 引力箭头
  const arw = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(R0 + 1, 0, 0), 30, Cc(0x7fe0a8), 6, 3); [arw.line.material, arw.cone.material].forEach(m => m.toneMapped = false); g.add(arw);
  const La = W3.label('月球的引力拉着地球', new THREE.Vector3(40, 6, 0), 'l');
  // 喷流：从月球朝地球一侧斜着喷出，擦过地球
  const jets = [-1, 1].map(s => { const m = new THREE.Mesh(new THREE.ConeGeometry(2.6, 130, 24, 1, true), bm(0x8fe8ff, .12, true)); g.add(m); return { m, s }; });
  const Ld = W3.label('11 万公里', new THREE.Vector3(55, -6, 0)); const Lj = W3.label('喷流斜着擦过地球', new THREE.Vector3(30, 24, 0), 'l');
  show(c, card(1300, 560, 520, `<div class="k">基准拖船</div>${kvt([['悬停距离', '约 110,000 km'], ['拉动地球的加速度', '4 × 10<sup>−4</sup> m/s²'], ['月亮看上去', '1.8°（今天 0.5°）'], ['潮汐', '今天的约 43 倍']])}`), c.b(1) + 1, c.b(3));
  const shr = c.el(`<div class="mode" style="left:100px;top:210px"></div>`); c.in(shr, c.b(3) + .3);
  credit(c);
  c.tick(lt => {
    e.rotation.y = lt * .05;
    const k = ss((lt - c.b(3) - .5) / 8), mass = 1 - .6 * k, d = d0 * Math.sqrt(mass) ;   // a ∝ m/d² 保持不变
    mn.scale.setScalar(Math.cbrt(mass)); mn.position.x = d; shr.innerHTML = `月球剩余 <b style="color:#fff">${fmt(mass * 100)}%</b> · 距离 <b style="color:#fff">${fmt(d * 1000)} km</b>`;
    jets.forEach(({ m, s }) => { const tip = new THREE.Vector3(d - mR, 0, s * mR * .9), dir = new THREE.Vector3(-1, 0, s * .22).normalize(); m.position.copy(tip).addScaledVector(dir, 65); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir); m.visible = lt > c.b(2); m.material.opacity = .12 * fade(lt, c.b(2), null) * (1 + .1 * Math.sin(lt * 11 + s)); });
    arw.visible = lt > c.b(0) + 2; La.a = fade(lt, c.b(0) + 2, c.b(2)); Lold.a = fade(lt, c.b(1), c.b(2)); Ld.a = fade(lt, c.b(1), null); Lj.a = fade(lt, c.b(2) + 1, c.b(3)); old.material.opacity = .35 * fade(lt, c.b(1) - .5, null);
    W3.setCam(kv([[0, [-22, 7, 20, 45, 0, 0]], [c.b(1) - .5, [-26, 9, 24, 45, 0, 0]], [c.b(1) + 2.5, [-100, 220, 420, -40, 0, 60]], [c.b(1) + 6, [-100, 220, 420, -40, 0, 60]], [c.b(2), [70, 30, 90, 50, 0, 0]], [c.b(3), [80, 25, 95, 50, 0, 0]], [c.T, [70, 22, 85, 40, 0, 0]]], lt));
  });
});

// ============ 05 推演出的轨道 ============
S('orbit', c => {
  c.head('05', '推演出的轨道');
  const g = W3.group(), Ksc = 6;   // 1 AU = 6 单位
  const tv = p => new THREE.Vector3(p[0] * Ksc, p[2] * Ksc, -p[1] * Ksc);
  g.add(glow(0xfff2c0, 2.2));
  [[.387, 0x8a94aa], [.723, 0xd9c38a], [1, 0x5CB4FF], [1.524, 0xc86a4a], [5.2, 0xd9b38a]].forEach(([a, col]) => g.add(ringL(a * Ksc, col, .35)));
  const jup = glow(0xe8c890, 1.2); g.add(jup); const Lj = W3.label('木星', jup, 'l');
  const P = D.p.map(tv), N = P.length;
  const trG = new THREE.BufferGeometry().setFromPoints(P); const tr = new THREE.Line(trG, new THREE.LineBasicMaterial({ color: Cc(0x8fc8ff), toneMapped: false })); g.add(tr);
  // 点火段（橙色）
  const burnPts = []; for (let i = 0; i < N - 1; i++) if (D.on[i]) burnPts.push(P[i], P[i + 1]);
  const bl = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(burnPts), new THREE.LineBasicMaterial({ color: Cc(0xff9a4b), toneMapped: false })); g.add(bl);
  const earth = glow(0x9fd0ff, .9); g.add(earth); const Le = W3.label('地球', earth, 'l');
  const CP = D.coast.p.map(tv); const cl2 = lineL(CP, 0x8fc8ff, .8); g.add(cl2); const Lfar = W3.label('400 年后 · 约 2,000 AU', CP[CP.length - 1], 'l'); Lfar.dx = -110; const Lsun = W3.label('太阳系（行星轨道在这一点里）', new THREE.Vector3(0, 0, 0), 'l dim'); Lsun.dx = 6;
  const hud = c.el(`<div class="mode" style="left:100px;top:210px"></div>`); c.in(hud, c.b(0) + .3);
  show(c, card(1300, 230, 520, `<div class="k">基准轨道（数值积分）</div>${kvt([['近日点点火', '4 次 · 27 年'], ['第 28 年', '轨道变为双曲线'], ['发动机速度增量', '约 23 km/s'], ['离开后速度', '23.7 km/s'], ['出射方向', '黄纬约 −11°'], ['400 年后', '约 2,000 AU']])}<small class="cap">橙色：发动机开机的弧段</small>`), c.b(1) + 1, c.b(3));
  show(c, det(1300, 640, 520, '木星', '到达时相对速度 15–25 km/s → 借力只改变几 km/s<br>300 万公里外掠过 → 潮汐约今天月潮的 50 倍'), c.b(3) + 1.5);
  const TT = D.t[N - 1];
  c.tick(lt => {
    const u = cl((lt - c.b(0) - .5) / (c.be(1) - c.b(0) - .5)), tn = u * TT; let i = 0; while (i < N - 1 && D.t[i] < tn) i++;
    trG.setDrawRange(0, Math.max(2, i)); bl.geometry.setDrawRange(0, burnPts.findIndex(p => p === P[i]) >= 0 ? burnPts.indexOf(P[i]) : (D.on.slice(0, i).reduce((a, b) => a + b, 0)) * 2);
    earth.position.copy(P[i]);
    const ct = lt > c.be(1) ? cl((lt - c.be(1)) / 8) : 0; Lfar.a = ct > .97 && lt < c.b(3) ? 1 : 0; Lsun.a = fade(lt, c.b(2) + 5, c.b(3) - .3); cl2.visible = ct > 0; cl2.geometry.setDrawRange(0, Math.max(2, Math.round(CP.length * ct))); if (ct > 0) earth.position.copy(CP[Math.min(CP.length - 1, Math.round((CP.length - 1) * ct))]);
    const yrs = ct > 0 ? TT + ct * 400 : tn; hud.innerHTML = `第 <b style="color:#fff">${fmt(yrs, 1)}</b> 年 · 已用速度增量 <b style="color:#fff">${fmt(ct > 0 ? D.dv[N - 1] : D.dv[i], 1)}</b> km/s`;
    const ja = 2 * Math.PI * yrs / 11.86 + 1.2; jup.position.set(5.2 * Ksc * Math.cos(ja), 0, -5.2 * Ksc * Math.sin(ja)); Lj.a = fade(lt, c.b(3), null);
    W3.setCam(kv([[0, [0, 70, 40, 0, 0, 0]], [c.b(1), [10, 90, 70, 0, 0, 0]], [c.b(2), [30, 160, 200, 10, -20, 0]], [c.b(2) + 8, [500, 2600, 4200, 200, -1000, -2000]], [c.b(3), [40, 110, 110, 0, 0, 0]], [c.T, [40, 110, 110, 0, 0, 0]]], lt));
  });
});

// ============ 06 唯一的奇迹 ============
S('energy', c => {
  c.head('06', '唯一的奇迹');
  const g = W3.group(), mn = moon(5); g.add(mn); mn.position.set(-9, 0, 0);
  show(c, card(820, 250, 1000, `<div class="k">工质取自月球（速度增量按 22 km/s）</div><div class="kv" style="grid-template-columns:auto auto auto auto;font-size:23px"><span>用掉月球</span><b>喷流速度</b><b>总能量</b><b>≈ 太阳全部输出</b>
    <span>30%</span><b>6,000 km/s</b><b>4.0 × 10<sup>35</sup> J</b><b>33 年</b><span>60%</span><b>3,000 km/s</b><b>2.0 × 10<sup>35</sup> J</b><b>17 年</b><span>90%</span><b>2,000 km/s</b><b>1.3 × 10<sup>35</sup> J</b><b>11 年</b></div><small class="cap">点火总时长约 2 年，期间功率是太阳的 3–19 倍；原方案约 5 × 10<sup>37</sup> J</small>`), c.b(0) + .5);
  show(c, `<div class="abs" style="left:820px;top:640px;width:1000px;z-index:6"><div class="mode" style="position:static;display:inline-block;font-size:28px;padding:12px 24px">唯一的奇迹：把岩石变成聚变燃料、功率超过太阳的发动机</div><div class="p" style="margin-top:16px">而且射向地球的废热要低于 <b>十亿分之一</b>，其余都遵守已知物理</div></div>`, c.b(2) + .5);
  c.tick(lt => { const f = .3 + .6 * ss((lt - c.b(0) - 2) / 6); mn.rotation.y = lt * .1; mn.scale.setScalar(Math.cbrt(1 - f * .9 + .1)); W3.setCam([0, 3, 34, 0, 0, 0]); });
});

// ============ 07 漫长的路 ============
S('road', c => {
  c.head('07', '漫长的路');
  const g = W3.group(), e = W3.earth(); g.add(e);
  const ice = new THREE.Mesh(new THREE.SphereGeometry(R0 * 1.004, 96, 64), new THREE.MeshStandardMaterial({ color: Cc(0xdfe8f2), roughness: .6, transparent: true, opacity: 0 })); g.add(ice);
  const sun = glow(0xfff2c0, 60); g.add(sun); sun.position.set(400, 60, -300);
  const hud = c.el(`<div class="mode" style="left:100px;top:210px"></div>`); c.in(hud, c.b(0) + .3);
  show(c, card(1300, 300, 520, `<div class="k">离开太阳之后</div>${kvt([['地热流', '约 0.09 W/m²'], ['地表最终温度', '约 36 K（−237 °C）'], ['氮气凝结', '63 K 以下'], ['大气冻成的冰层', '约 10 米厚'], ['航程', '约 5.7 万年']])}`), c.b(1) + .5);
  c.tick(lt => { const k = ss((lt - c.b(0)) / (c.be(1) - c.b(0))); sun.scale.setScalar(60 * (1 - k) + 3); W3.sun.intensity = 2 * (1 - .85 * k); ice.material.opacity = .55 * ss((lt - c.b(1)) / 6);
    const T = 288 - (288 - 36) * k; hud.innerHTML = `地表温度约 <b style="color:#fff">${fmt(T)} K</b>（${fmt(T - 273)} °C）`; e.rotation.y = lt * .05;
    W3.setCam(kv([[0, [8, 6, 22, 0, 0, 0]], [c.T, [14, 8, 26, 0, 0, 0]]], lt)); });
  c.cleanup.push(() => { W3.sun.intensity = 2; });
  credit(c);
});

// ============ 08 到达 ============
S('arrive', c => {
  c.head('08', '到达');
  const g = W3.group(), K = 6;   // 1 AU = 6
  const A = glow(0xfff0c8, 7); g.add(A); const B = glow(0xffc070, 6); B.position.set(-23 * K, 0, -6 * K); g.add(B);
  W3.label('α Cen A', new THREE.Vector3(-2.5, 2.5, 0), 'l').dx = -100; W3.label('α Cen B · 约 23 AU 外', B.position.clone().add(new THREE.Vector3(0, -3, 0)), 'l');
  const hz = ringL(1.25 * K, 0x7fe0a8, .6, .3); g.add(hz); const Lhz = W3.label('宜居带 · 约 1.25 AU', new THREE.Vector3(0, 0, 1.25 * K + 1), 'l');
  // 双曲线来，近星点 0.5 AU 点火，变成大椭圆
  const rp = .5 * K, hyp = [], ell = []; const e1 = 1.7, p1 = rp * (1 + e1); for (let k = -110; k <= 0; k++) { const th = k / 110 * Math.acos(-1 / e1) * .97; const r = p1 / (1 + e1 * Math.cos(th)); hyp.push(new THREE.Vector3(r * Math.cos(th), 0, r * Math.sin(th))); }
  const ra = 20 * K, a2 = (rp + ra) / 2, e2 = (ra - rp) / (ra + rp); for (let k = 0; k <= 300; k++) { const th = k / 300 * Math.PI * 2; const r = a2 * (1 - e2 * e2) / (1 + e2 * Math.cos(th)); ell.push(new THREE.Vector3(r * Math.cos(th), 0, r * Math.sin(th))); }
  const hl = lineL(hyp, 0x8fc8ff); g.add(hl); const el = lineL(ell, 0xffd27a, .8); g.add(el);
  const earth = glow(0x9fd0ff, 1); g.add(earth); const burn = glow(0xff9a4b, 2.5); burn.position.set(rp, 0, 0); g.add(burn); const Lb = W3.label('近星点 0.5 AU 点火 · 约 5 km/s', new THREE.Vector3(rp + 1, 0, 1), 'l'); Lb.dx = 0;
  show(c, card(100, 640, 520, `<div class="k">刹车</div>${kvt([['到达相对速度', '约 22 km/s'], ['近星点', '0.5 AU'], ['捕获所需', '约 5 km/s'], ['调进宜居带', '再用几百年']])}`), c.b(1) + 1);
  c.tick(lt => { const u = cl((lt - c.b(1)) / 4); hl.geometry.setDrawRange(0, Math.max(2, Math.round(111 * u))); earth.position.copy(hyp[Math.round(110 * u)]);
    const w = cl((lt - c.b(1) - 4) / 6); el.visible = w > 0; el.geometry.setDrawRange(0, Math.max(2, Math.round(301 * w))); if (w > 0) earth.position.copy(ell[Math.min(300, Math.round(300 * w))]);
    burn.visible = lt > c.b(1) + 3.6 && lt < c.b(1) + 5; Lb.a = fade(lt, c.b(1) + 3.6, null); hz.visible = lt > c.b(1) + 9; Lhz.a = hz.visible ? 1 : 0;
    W3.setCam(kv([[0, [-40, 50, 120, -40, 0, -10]], [c.b(1), [6, 22, 26, 2, 0, 0]], [c.b(1) + 4.5, [6, 22, 26, 2, 0, 0]], [c.b(1) + 7.5, [30, 120, 110, -50, 0, 0]], [c.T, [30, 120, 110, -50, 0, 0]]], lt)); });
});

// ============ 09 给小说的参数 ============
S('end', c => {
  c.head('09', '给小说的参数');
  const g = W3.group(), e = W3.earth(); g.add(e); const mn = moon(1.737); mn.position.set(30, 4, -20); g.add(mn);
  show(c, card(1180, 220, 640, `<div class="k">可调参数范围</div>${kvt([['航程', '4–6 万年'], ['目的地', '半人马座 α（正在靠近）'], ['月球拖船距离', '7–16 万 km'], ['点火阶段', '几年到上百年'], ['速度增量', '20–26 km/s'], ['用掉月球', '30–90%'], ['总能量', '约 10<sup>35</sup> J'], ['到达刹车', '约 5 km/s']])}`), c.b(0) + .5);
  show(c, `<div class="abs" style="left:100px;top:880px;font:700 34px var(--serif);color:var(--gold);z-index:6;text-shadow:0 0 12px #000">借一颗卫星的引力，轻轻推它上路</div>`, c.b(1) + 2);
  credit(c);
  c.tick(lt => { e.rotation.y = lt * .04; W3.setCam(kv([[0, [-8, 8, 40, 8, 0, 0]], [c.T, [-14, 10, 46, 10, 0, 0]]], lt)); });
});
