// 《临高启明》地理工程篇：各场景
window.SCENES = {};
const SC = window.SCENES;
const AMAP = '卫星底图：© 高德地图 GS(2025)5996号';
const WIKI = '资料：临高启明灰机 wiki（CC BY-SA 3.0）· 地点、线路、建筑为示意';

// 两张照片并排
function twoPhotos(c, a, b, at, until) {
  c.photo(a[0], 150, 250, 790, 500, a[1], at, until, { kb: 1.06 });
  c.photo(b[0], 980, 250, 790, 500, b[1], at + .35, until, { kb: 1.06 });
}

// ───────── 片头
SC.s0 = { build(c) {
  const { b, be } = c;
  const W = c.map('lg_m_wide_z6.jpg', { filter: 'saturate(.7) brightness(.6)' });
  const p = W.p, lg = p('临高');
  W.key(0, [1100, 1050], .95).key(b(1), [900, 1250], 1.25, 6).key(b(1) + 8, lg, 2.6, 9);
  c.src(AMAP + ' · ' + WIKI);
  const veil = c.el('<div style="position:absolute;inset:0;background:rgba(6,8,11,.72);z-index:2"></div>'); c.out(veil, be(0) - .2, { d: 1.2 });
  const box = c.el(`<div class="big"><div style="font:700 26px var(--sans);letter-spacing:.3em;color:var(--gold)">观看前说明</div>
    <div style="font:900 64px/1.3 var(--serif);margin-top:26px">本期由 AI 根据书友维基整理</div>
    <div style="font:500 34px/1.6 var(--sans);color:#ddd;margin-top:22px">未逐章核对原文，难免有错漏，欢迎指正<br>地图为卫星影像，地点、线路与建筑均为示意</div></div>`);
  c.in(box, b(0) - .3, { dy: 20, d: .9 }); c.out(box, be(0) - .2, { d: .8 });
  const t = c.el(`<div class="big" style="justify-content:flex-start;padding-top:220px"><div style="font:600 28px var(--sans);letter-spacing:.4em;color:var(--gold)">临高启明 · 地理工程篇</div>
    <div style="font:900 104px/1.2 var(--serif);margin-top:20px;text-shadow:0 4px 30px rgba(0,0,0,.8)">地图上的八年</div>
    <div style="font:700 40px var(--sans);margin-top:16px;letter-spacing:.2em;color:#e9dfc8;text-shadow:0 2px 12px #000">1628 — 1636</div></div>`);
  c.in(t, b(1) + .2, { dy: 24, d: 1.1 }); c.out(t, b(1) + 8.5, { d: 1 });
  W.pin(lg, '临高', b(1) + 9, { sc: 2.2, fs: 40, r: 13, c: '#d0533c', sub: '海南岛西北角' });
  c.chip(130, 740, '崇祯元年 · 1628', '五百余名穿越者带着工业物资抵达', b(1) + 9.5);
} };

// ───────── 01 博铺登陆
SC.s1 = { build(c) {
  const { b, be } = c;
  c.src(AMAP + ' · ' + WIKI);
  const H = c.map('lg_m_hainan_z10.jpg', { until: b(0) + 9.5 });
  H.key(0, [1150, 860], .86).key(b(0) + 2.5, [1080, 360], 1.5, 5);
  H.text([1350, 90], '琼 州 海 峡', b(0) + 1, { sc: .7, fs: 30, c: '#bfe3ff' });
  H.text([1380, 30], '↑ 雷州半岛', b(0) + 1.5, { sc: .7, fs: 24, c: '#ddd' });
  H.pin('临高县城', '临高县', b(0) + 1.2, { sc: .7, fs: 30, c: '#d0533c' });
  const L = c.map('lg_m_lingao_z13.jpg', { at: b(0) + 8.5, d: 1.2 });
  const bp = L.p('博铺港'), xc = L.p('临高县城'), br = L.p('百仞滩');
  L.key(0, [1200, 850], .62).key(b(0) + 9, [1220, 880], .75, 6).key(b(1), [1330, 720], 1.5, 3);
  // 文澜江（示意）：县城附近→百仞滩→博铺入海口
  L.route([xc, [1100, 1060], br, [1250, 880], [1310, 780], bp], b(0) + 10, { sc: .75, w: 5, c: '#7fd1ff', smooth: 1, arrow: false, d: 2, until: b(1) + .5 });
  L.text([1150, 870], '文澜江', b(0) + 11, { sc: .75, fs: 26, c: '#bfe3ff', until: b(1) + .5 });
  L.pin(xc, '临高县城', b(0) + 9.6, { sc: 1.1, c: '#9aa3ad', a: 'end', dx: -20, sub: '明 · 临高县治' });
  L.pin('临高角', '临高角', b(0) + 10, { sc: 1.2, c: '#9aa3ad' });
  L.pin(bp, '博铺港', b(0) + 11.2, { sc: 1.3, sub: '文澜江入海口' });
  c.chip(130, 760, '1628 年 9 月 27 日', '博铺上岸 · 书中称 D 日', b(0) + 12.5, be(0) + .3);
  // 上岸当天
  const k = 1 / 1.5;
  L.add(LG.dock(bp[0] + 10, bp[1] - 40, k * 1.1, 9), b(1) + 2.5, { scale: .8 });
  L.add(LG.ship(bp[0] + 190, bp[1] - 160, k * 1.2) + LG.ship(bp[0] + 330, bp[1] - 110, k * .9), b(1) + 1.5);
  L.text([bp[0] + 120, bp[1] - 70], '一号工程 · 浮动码头', b(1) + 3, { sc: 1.5, fs: 26, c: '#ffd27a', a: 'start' });
  L.add(LG.smoke(bp[0] - 150, bp[1] + 10, k), b(1) + 5.5);
  L.text([bp[0] - 170, bp[1] + 70], '巡检司 · 烽燧', b(1) + 5.8, { sc: 1.5, fs: 24, a: 'end' });
  L.route([[bp[0] - 50, bp[1] + 80], [xc[0] + 60, xc[1] - 60]], b(1) + 7, { sc: 1.2, w: 5, c: '#c9ccd2', curve: .12, d: 2, dash: '10 10' });
  L.key(b(1) + 6.5, [1220, 900], 1.1, 3).key(b(1) + 10.5, [bp[0] - 20, bp[1] + 20], 1.7, 3);
  L.add([[-110, 40], [-70, 62], [-30, 40], [-80, 18]].map(([dx, dy]) => LG.tent(bp[0] + dx, bp[1] + dy, k * .8)).join(''), b(1) + 11);
  L.text([bp[0] - 70, bp[1] + 100], '临时营地', b(1) + 11.5, { sc: 1.7, fs: 26, c: '#ffd27a' });
  // 今昔
  c.out(L.el, b(2) - .1, { d: .6 });
  const t2 = b(2) + c.sc.beats[2].d * .42;
  const bg = c.el('<div style="position:absolute;inset:0;background:#0b0d10"></div>'); c.in(bg, b(2) - .3, { dy: 0 });
  c.hd2('今天 · 临高北岸', '', b(2), t2);
  twoPhotos(c, ['hainan1b_05.jpg', '今日 · 博铺渔港'], ['hainan1_06.jpg', '今日 · 临高角'], b(2) + .1, t2);
  const cmp = c.el(`<div style="position:absolute;inset:0"><div style="position:absolute;inset:0;background:url(A/photos/Cape_Lingao.jpg) center/cover"></div>
    <svg width="1920" height="1080" style="position:absolute;inset:0">${CAPE}</svg><div class="vig"></div>
    <div style="position:absolute;left:960px;top:0;bottom:0;width:4px;background:var(--gold);box-shadow:0 0 20px rgba(0,0,0,.6)"></div>
    <div style="position:absolute;left:96px;top:104px;font:700 30px var(--serif);background:rgba(20,16,10,.7);padding:6px 14px;border-radius:6px">今天 · 临高角海岸</div>
    <div style="position:absolute;left:1010px;top:104px;font:700 30px var(--serif);background:rgba(20,16,10,.7);padding:6px 14px;border-radius:6px">1628 · 书中的登陆（AI 示意）</div>
    <div class="cr" style="position:absolute;left:24px;bottom:12px;font-size:15px;color:rgba(255,255,255,.7)">照片：STW932 / Wikimedia Commons，CC BY-SA 4.0 · 右半为叠加示意</div></div>`);
  c.in(cmp, t2, { dy: 0, d: .8 });
  const right = cmp.querySelector('#capeR'); c.anim(right, [{ clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 50%)' }], t2 + .6, 1.6, 'io');
  [...cmp.querySelectorAll('.cpe')].forEach((e, i) => c.in(e, t2 + 2 + i * .5, { dy: 0, d: .6 }));
} };
const CAPE = `<defs><clipPath id="rh"><rect x="962" y="0" width="958" height="1080"/></clipPath></defs>
 <g id="capeR"><image href="A/photos/Cape_Lingao.jpg" x="0" y="0" width="1920" height="1080" preserveAspectRatio="xMidYMid slice" style="filter:sepia(.75) saturate(1.2) brightness(1.02) contrast(.95)"/>
 <rect x="0" y="0" width="1920" height="1080" fill="rgba(240,190,120,.18)"/>
 <g clip-path="url(#rh)">
 <g class="cpe"><g transform="translate(1330,385) scale(.9)"><path d="M0 40 L380 40 L350 74 L26 74Z" fill="#23262c"/><rect x="40" y="12" width="260" height="28" fill="#e9e3d6"/><rect x="80" y="-12" width="100" height="24" fill="#e9e3d6"/><rect x="215" y="-58" width="22" height="70" fill="#a8392a"/><path d="M226 -62 C270 -110 340 -118 420 -150" stroke="rgba(70,70,70,.35)" stroke-width="20" fill="none" stroke-linecap="round"/></g></g>
 <g class="cpe"><path d="M1010 640 L1470 520 L1480 534 L1022 656Z" fill="#6d5a45" stroke="#3e3226" stroke-width="2"/>${Array.from({ length: 15 }, (_, i) => `<rect x="${1026 + i * 30}" y="${636 - i * 7.8}" width="6" height="44" fill="#3e3226"/>`).join('')}</g>
 <g class="cpe">${[[1500, 760], [1620, 790], [1740, 765]].map(([x, y]) => `<path d="M${x} ${y} L${x + 60} ${y - 72} L${x + 120} ${y}Z" fill="#efe8da" stroke="#8c7f68" stroke-width="3"/><path d="M${x + 60} ${y - 72} L${x + 60} ${y}" stroke="#8c7f68" stroke-width="2"/>`).join('')}
 ${[[1180, 800], [1232, 810], [1206, 774], [1300, 820], [1352, 828]].map(([x, y]) => `<rect x="${x}" y="${y}" width="48" height="36" fill="#8a6a45" stroke="#5f4730" stroke-width="3"/>`).join('')}</g>
 <g class="cpe"><g transform="translate(1840,505)"><rect x="0" y="0" width="30" height="80" fill="#8d7c66"/><path d="M15 -6 C30 -60 6 -90 40 -150" stroke="rgba(60,60,60,.45)" stroke-width="22" fill="none" stroke-linecap="round"/><circle cx="15" cy="-4" r="8" fill="#ff9b3d"/></g></g>
 </g></g>`;

// ───────── 02 公路与百仞城
SC.s2 = { build(c) {
  const { b, be } = c;
  c.src(AMAP + ' · ' + WIKI);
  const L = c.map('lg_m_lingao_z13.jpg', { until: b(0) + 10 });
  const bp = L.p('博铺港'), br = L.p('百仞滩'), xc = L.p('临高县城');
  L.key(0, [1265, 840], 1.0).key(b(0) + 6.5, br, 2.4, 3.5);
  L.pin(bp, '博铺港', b(0), { sc: 1 }); L.pin(xc, '临高县城', b(0), { sc: 1, c: '#9aa3ad', a: 'end', dx: -20 });
  L.route([bp, [1328, 735], [1300, 780], [1262, 840], [1225, 905], br], b(0) + 1, { sc: 1, w: 8, c: '#d9a441', smooth: 1, d: 3, arrow: false });
  L.text([1330, 860], '简易公路 约 12 公里', b(0) + 3, { sc: 1, fs: 28, c: '#ffd27a', a: 'start' });
  c.chip(130, 760, '登陆约一周', '博铺—百仞滩公路通车', b(0) + 3.5, b(0) + 9.5);
  const W = c.map('lg_m_wenlan_z14.jpg', { at: b(0) + 9.3, d: 1.2 });
  const r = W.p('百仞滩'), [x, y] = r;
  W.key(0, r, 1.2).key(b(0) + 9.5, [x + 40, y - 20], 1.55, 4);
  W.pin(r, '百仞滩', b(0) + 10.5, { sc: 1.5, sub: '文澜江下游熔岩险滩' });
  W.pin('临高县城', '临高县城', b(0) + 11.5, { sc: 1.5, c: '#9aa3ad', a: 'end', dx: -20, sub: '约 4 公里' });
  c.hd2('百仞城 · 规划复原（示意）', '', b(0) + 12, b(3) + 3);
  // 东岸主城
  const k = 1 / 1.55;
  const Z = (pts, col, name, at, tx, ty, o = {}) => { W.zone(pts.map(([a, bb]) => [x + a, y + bb]), col, at, { sc: 1.55, ...o }); if (name) W.text([x + tx, y + ty], name, at + .3, { sc: 1.55, fs: 24 }); };
  Z([[30, -200], [150, -210], [160, -110], [40, -100]], '#d9a441', '行政区', b(1) + 1, 95, -150);
  Z([[150, -210], [270, -220], [280, -120], [160, -110]], '#e8c39a', '学校 · 医院', b(1) + 2, 215, -160);
  Z([[40, -100], [160, -110], [170, 0], [50, 10]], '#f0d9a8', '住宅', b(1) + 3, 105, -45);
  Z([[160, -110], [280, -120], [290, -10], [170, 0]], '#c9b8ff', '仓库', b(1) + 4, 225, -55);
  let hs = ''; for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) hs += LG.house(x + 70 + i * 26 + j * 13, y - 70 + j * 16 - i * 3, k * .7);
  W.add(hs, b(1) + 3.6);
  W.add(LG.tower(x + 110, y + 90, k * 1.1), b(1) + 9);
  W.text([x + 110, y + 125], '供水站 · 水塔', b(1) + 9.3, { sc: 1.55, fs: 22, c: '#bfe3ff' });
  W.route([[x + 450, y + 70], [x + 450, y - 200]], b(1) + 6, { sc: 1.55, w: 5, c: '#fff', d: 1.2 });
  W.text([x + 465, y - 60], '南高北低 约 4%', b(1) + 6.5, { sc: 1.55, fs: 22, a: 'start' });
  W.text([x + 465, y - 30], '雨水自流排走', b(1) + 7, { sc: 1.55, fs: 20, a: 'start', c: '#ddd' });
  // 西岸工业 + 东门市
  W.key(b(2), [x - 10, y - 40], 1.45, 3);
  Z([[-300, -140], [-40, -170], [-30, 40], [-290, 60]], '#d0533c', '重工业区（西岸）', b(2) + 3, -165, 85);
  W.add([0, 1, 2].map(i => LG.factory(x - 230 + i * 70, y - 80 + i * 26, k * .8)).join(''), b(2) + 4);
  W.add('<text></text>'); W.text([x - 165, y - 190], '钢铁 · 化工 · 造纸', b(2) + 4.5, { sc: 1.45, fs: 22, c: '#ffb3a6' });
  W.route([[x + 330, y - 330], [x + 120, y - 260]], b(2) + 1, { sc: 1.45, w: 6, c: '#fff', d: 1 });
  W.text([x + 340, y - 340], '东北风', b(2) + 1.3, { sc: 1.45, fs: 24, a: 'start' });
  Z([[300, -110], [410, -110], [410, -20], [300, -20]], '#a6e3a1', '东门市', b(2) + 9, 355, -60);
  // 土垒与第一次反围剿
  W.zone([[-320, -250], [310, -260], [320, 140], [-310, 150]].map(([a, bb]) => [x + a, y + bb]), '#a3743d', b(3) + .5, { sc: 1.45, fo: 0, w: 7, dash: '14 8' });
  W.text([x, y - 275], '土垒', b(3) + 1, { sc: 1.45, fs: 26, c: '#e6b980' });
  W.key(b(3) + 3, [1020, 820], .95, 3.5);
  const xc2 = W.p('临高县城'), bp2 = W.p('博铺港');
  W.pin(bp2, '博铺港', b(3) + 5, { sc: .95 });
  W.route([[xc2[0] - 30, xc2[1] + 20], [x - 40, y + 40]], b(3) + 6.5, { sc: .95, w: 7, c: '#ff6b55', curve: .2, d: 1.6 });
  W.route([[xc2[0] - 30, xc2[1] + 20], [bp2[0] - 40, bp2[1] + 40]], b(3) + 7.2, { sc: .95, w: 7, c: '#ff6b55', curve: -.25, d: 2.4 });
  c.chip(130, 700, '农历九月十六', '乡勇两路进攻 · 第一次反围剿', b(3) + 8, be(3));
  W.text([x + 70, y + 210], '土垒守住', b(3) + 13, { sc: .95, fs: 30, c: '#ffd27a', a: 'start' });
  // 无线电与电话
  c.out(W.el, b(4) - .2, { d: 1 });
  const Hn = c.map('lg_m_hainan_z10.jpg', { at: b(4) - .4, d: 1 });
  const hb = Hn.p('百仞滩'); Hn.key(0, [hb[0] + 40, hb[1] + 120], 1.25);
  Hn.pin(hb, '百仞城', b(4), { sc: 1.25, c: '#d0533c' });
  Hn.ring(hb, 278, '#7fd1ff', b(4) + 1, { sc: 1.25, d: 1.8 }); Hn.ring(hb, 243, '#7fd1ff', b(4) + 1.4, { sc: 1.25, d: 1.8, fo: .04 });
  Hn.text([hb[0] + 220, hb[1] + 250], '无线电覆盖 35–40 公里', b(4) + 2.5, { sc: 1.25, fs: 28, c: '#bfe3ff', a: 'start' });
  c.chip(130, 650, '1628 年 11 月', '无线电网建成', b(4) + 2);
  c.chip(130, 760, '1629 年', '有线电话：博铺港 · 大美村 · 盐场村', b(4) + 8);
} };

// ───────── 03 百仞滩水电站
SC.s3 = { build(c) {
  const { b, be } = c;
  c.src(WIKI);
  const W = c.map('lg_m_wenlan_z14.jpg', { filter: 'saturate(.5) brightness(.35) blur(3px)', until: b(1) + 8 });
  W.key(0, W.p('百仞滩'), 1.4);
  c.hd2('03 · 百仞滩水电站', '渠道引水式 · 一期（示意）', b(0) - .4, b(1) + 7.5);
  const sv = c.el(`<svg width="1920" height="1080" style="position:absolute;inset:0;z-index:2"><g transform="translate(0,90)">
   <g id="riv"><path d="M120 380 L880 380" stroke="#3b7bb5" stroke-width="54" stroke-linecap="round"/><path d="M880 380 C930 380 940 640 1000 640 L1800 640" stroke="#3b7bb5" stroke-width="54" fill="none" stroke-linecap="round"/>
     <path d="M900 400 L960 610" stroke="#cfe8ff" stroke-width="10" stroke-dasharray="6 10" opacity=".8"/>
     <text class="lab" x="300" y="452" font-size="26" fill="#bfe3ff" style="stroke-width:5px">文澜河 · 上游</text><text class="lab" x="1500" y="712" font-size="26" fill="#bfe3ff" style="stroke-width:5px">下游</text>
     <text class="lab" x="905" y="530" font-size="26" fill="#fff" text-anchor="end" style="stroke-width:5px">百仞滩</text></g>
   <g id="cnl"><path d="M520 355 L520 300 L1120 300" stroke="#5fb0ff" stroke-width="26" fill="none" stroke-linejoin="round"/><path id="flw1" d="M520 355 L520 300 L1120 300" stroke="#dff1ff" stroke-width="6" fill="none" stroke-dasharray="14 22"/>
     <rect x="500" y="340" width="40" height="30" fill="#9aa0aa" stroke="#fff" stroke-width="2"/><text class="lab" x="520" y="250" font-size="26" fill="#fff" text-anchor="middle" style="stroke-width:5px">进水口</text>
     <text class="lab" x="820" y="280" font-size="26" fill="#fff" text-anchor="middle" style="stroke-width:5px">引水渠</text></g>
   <g id="fb"><rect x="1110" y="262" width="110" height="76" fill="#5fb0ff" stroke="#fff" stroke-width="3"/><text class="lab" x="1165" y="240" font-size="26" fill="#fff" text-anchor="middle" style="stroke-width:5px">压力前池</text></g>
   <g id="pen"><path d="M1200 338 L1330 560" stroke="#8a6a45" stroke-width="22" stroke-linecap="round"/><path id="flw2" d="M1200 338 L1330 560" stroke="#dff1ff" stroke-width="6" stroke-dasharray="14 22"/><text class="lab" x="1290" y="420" font-size="24" fill="#e6c49a" style="stroke-width:5px">木制压力管</text></g>
   <g id="ph"><path d="M1290 560 L1400 560 L1400 620 L1290 620Z" fill="#d8cdb6" stroke="#fff" stroke-width="3"/><path d="M1280 560 L1345 525 L1410 560Z" fill="#c9533c"/><circle cx="1345" cy="595" r="16" fill="none" stroke="#2f5bea" stroke-width="5"/><text class="lab" x="1345" y="780" font-size="26" fill="#fff" text-anchor="middle" style="stroke-width:5px">水轮机房 → 尾水回河</text><path d="M1345 625 L1345 750" stroke="#fff" stroke-width="2" stroke-dasharray="4 4"/></g>
   <g id="hd"><path d="M1520 300 L1520 600" stroke="#ffd27a" stroke-width="4"/><path d="M1505 300 L1535 300 M1505 600 L1535 600" stroke="#ffd27a" stroke-width="4"/><text class="lab" x="1545" y="460" font-size="34" fill="#ffd27a" style="stroke-width:6px">水头 20 米</text></g>
  </g></svg>`);
  c.in(sv.querySelector('#riv'), b(0) + .3, { dy: 0, d: .8 }); c.in(sv.querySelector('#cnl'), b(0) + 4, { dy: 0 }); c.in(sv.querySelector('#fb'), b(0) + 6.5, { dy: 0 });
  c.in(sv.querySelector('#pen'), b(0) + 8.5, { dy: 0 }); c.in(sv.querySelector('#ph'), b(0) + 10.5, { dy: 0 }); c.in(sv.querySelector('#hd'), b(0) + 12.5, { dy: 0 });
  const f1 = sv.querySelector('#flw1'), f2 = sv.querySelector('#flw2'); c.tick(t => { f1.style.strokeDashoffset = -t * 50; f2.style.strokeDashoffset = -t * 70; });
  c.out(sv, b(1) - .1, { d: .6 });
  c.chip(1460, 820, '一期', '流量 2 m³/s · 发电 200 kW', b(0) + 14.5, b(1) - .1);
  // 扩容
  const bars = [['一期', 200, '1 台机组'], ['二期', 600, '3 台机组'], ['规划', 1000, '5 台机组']];
  const bc = c.card(`<h3>装机容量（kW）</h3>${bars.map(([n, v, u]) => `<div style="display:flex;align-items:center;gap:14px;margin:12px 0"><span style="width:60px;font-size:22px">${n}</span><div class="bar" style="height:30px;width:${v * .5}px;background:${v > 600 ? 'rgba(217,164,65,.45)' : 'var(--gold)'};border:2px solid var(--gold);border-radius:4px;transform-origin:0 0"></div><span style="font-size:22px"><b>${v}</b> · ${u}</span></div>`).join('')}`, 'left:530px;top:380px;width:860px', b(1) + .2, b(1) + 7.5);
  [...bc.querySelectorAll('.bar')].forEach((e, i) => c.anim(e, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], b(1) + .3 + i * 1.3, .8));
  const L = c.map('lg_m_lingao_z13.jpg', { at: b(1) + 7.3, until: b(2) - .2 });
  const br = L.p('百仞滩'), bp = L.p('博铺港');
  L.key(0, [1270, 820], 1.15).key(b(1) + 8, [1275, 800], 1.35, 8);
  L.pin(br, '百仞滩电站', b(1) + 7.8, { sc: 1.3, c: '#7fd1ff', a: 'end', dx: -20 }); L.pin(bp, '博铺港', b(1) + 7.8, { sc: 1.3 });
  L.route([br, bp], b(1) + 8.6, { sc: 1.3, w: 5, c: '#c9b8ff', d: 2, arrow: false, dash: '2 12' });
  L.text([(br[0] + bp[0]) / 2 - 30, (br[1] + bp[1]) / 2], '输电线路 110 kV', b(1) + 9, { sc: 1.3, fs: 26, c: '#d9ccff', a: 'end' });
  L.add(`<rect x="${bp[0] - 40}" y="${bp[1] + 50}" width="${36}" height="14" fill="#9aa0aa" stroke="#fff" stroke-width="2"/>`, b(1) + 11);
  L.text([bp[0] - 50, bp[1] + 66], '水闸', b(1) + 11.3, { sc: 1.3, fs: 24, a: 'end' });
  L.route([[br[0] + 20, br[1] - 30], [1262, 840], [1300, 780], [bp[0] - 10, bp[1] + 40]], b(1) + 12.5, { sc: 1.3, w: 10, c: 'rgba(127,209,255,.8)', smooth: 1, d: 2.5, arrow: false });
  c.chip(130, 760, '文澜河整治', '水闸 · 整修河岸 · 疏浚河道', b(1) + 12.5, b(2) - .2);
  c.chip(130, 650, '一条河三种用途', '航运 · 灌溉 · 发电', b(1) + 15, b(2) - .2);
  // 现实
  const bg = c.el('<div style="position:absolute;inset:0;background:#0b0d10"></div>'); c.in(bg, b(2) - .3, { dy: 0 });
  c.hd2('现实中的百仞滩', '', b(2));
  c.photo('hainan1b_01.jpg', 110, 250, 560, 400, '百仞滩 · 熔岩险滩', b(2) + .2, null, { kb: 1.06 });
  c.photo('hainan1_02.jpg', 680, 250, 560, 400, '改造后的闸坝', b(2) + 5.5, null, { kb: 1.06 });
  c.photo('hainan1b_19.jpg', 1250, 250, 560, 400, '文澜江穿过临高县城', b(2) + 9.5, null, { kb: 1.06 });
  c.chip(110, 690, '临高古八景之一', '岸边存历代石刻三十余处', b(2) + 2.5);
  c.chip(680, 690, '上游电站取水致河段断流', '关停后 2024 年完成闸坝改造', b(2) + 7);
} };

// ───────── 04 农田与马袅
SC.s4 = { build(c) {
  const { b, be } = c;
  c.src(AMAP + ' · ' + WIKI);
  const W = c.map('lg_m_wenlan_z14.jpg', { filter: 'saturate(.6) brightness(.4) blur(2px)', until: b(1) + .3 });
  W.key(0, W.p('临高县城'), 1.3);
  c.hd2('美台洋 · 方格田（示意）', '', b(0) - .3, b(1));
  const X0 = 700, Y0 = 250, CW = 120, CH = 92, NX = 8, NY = 6;
  let g = ''; for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) g += `<rect class="pl" x="${X0 + i * CW + 6}" y="${Y0 + j * CH + 6}" width="${CW - 12}" height="${CH - 12}" fill="${(i + j) % 3 ? '#6e9a4a' : '#86ad57'}" stroke="#a9c98a" stroke-width="1"/>`;
  let dr = ''; for (let i = 0; i <= NX; i += 2) dr += `<path d="M${X0 + i * CW} ${Y0} L${X0 + i * CW} ${Y0 + NY * CH}" stroke="#2f7fc8" stroke-width="8"/>`;
  let ir = ''; for (let j = 0; j <= NY; j++) ir += `<path d="M${X0} ${Y0 + j * CH} L${X0 + NX * CW} ${Y0 + j * CH}" stroke="#a8dcff" stroke-width="3"/>`;
  let tr = ''; for (let i = 0; i <= 24; i++) tr += `<circle cx="${X0 - 18 + i * (NX * CW + 36) / 24}" cy="${Y0 - 20}" r="11" fill="#2f6b34"/><circle cx="${X0 - 18 + i * (NX * CW + 36) / 24}" cy="${Y0 + NY * CH + 20}" r="11" fill="#2f6b34"/>`;
  const sv = c.el(`<svg width="1920" height="1080" style="position:absolute;inset:0;z-index:2"><rect x="${X0}" y="${Y0}" width="${NX * CW}" height="${NY * CH}" fill="#5b5236" opacity=".7"/><g id="pl">${g}</g><g id="dr">${dr}</g><g id="ir">${ir}</g><g id="tr">${tr}</g>
   <g id="lg" font-size="24"><rect x="${X0 + NX * CW + 50}" y="300" width="30" height="8" fill="#2f7fc8"/><text class="lab" x="${X0 + NX * CW + 92}" y="312" fill="#fff" style="stroke-width:4px">排水渠</text>
   <rect x="${X0 + NX * CW + 50}" y="350" width="30" height="4" fill="#a8dcff"/><text class="lab" x="${X0 + NX * CW + 92}" y="360" fill="#fff" style="stroke-width:4px">灌溉渠</text>
   <circle cx="${X0 + NX * CW + 65}" cy="398" r="10" fill="#2f6b34"/><text class="lab" x="${X0 + NX * CW + 92}" y="406" fill="#fff" style="stroke-width:4px">防风林</text></g></svg>`);
  c.stagger(sv.querySelectorAll('.pl'), b(0) + 3, .05, { dy: 0, d: .4 });
  c.in(sv.querySelector('#dr'), b(0) + 8, { dy: 0 }); c.in(sv.querySelector('#ir'), b(0) + 9, { dy: 0 }); c.in(sv.querySelector('#tr'), b(0) + 10.5, { dy: 0 }); c.in(sv.querySelector('#lg'), b(0) + 9, { dy: 0 });
  c.out(sv, b(1) - .2, { d: .6 });
  c.card('<h3>美台洋</h3><p>文澜河畔高地</p><p>五六千亩，长期内涝抛荒</p><p>一期目标：<b>1,500 亩</b></p><p>高产稳产方格田</p>', 'left:110px;top:250px;width:380px', b(0) + 1, b(1) - .2);
  c.chip(110, 720, '县城西门外', '学田也改成方格田', b(0) + 15, b(1) - .2);
  // 工业东迁
  const L = c.map('lg_m_lingao_z13.jpg', { at: b(1) - .4, until: b(1) + 9.5 });
  const br = L.p('百仞滩'), mn = L.p('马袅');
  L.key(0, [1560, 980], .95).key(b(1) + 6, [1760, 880], 1.6, 3.5);
  L.pin(br, '百仞城', b(1), { sc: .95, c: '#d0533c' });
  L.route([[br[0] + 30, br[1]], [1720, 900]], b(1) + 1.5, { sc: .95, w: 8, c: '#ff8a5a', curve: -.15, d: 2 });
  L.text([1450, 840], '1630 年起 · 重工业东迁', b(1) + 2.5, { sc: .95, fs: 28, c: '#ffc2a6' });
  L.pin(mn, '马袅', b(1) + 3, { sc: 1, sub: '三面临海的半岛' });
  const M = c.map('lg_m_maniao_z15.jpg', { at: b(1) + 9, d: 1.2 });
  M.key(0, [1520, 1050], .85).key(b(1) + 9, [1520, 1080], .9, 8);
  M.zone([[1240, 530], [1560, 540], [1790, 720], [1820, 1000], [1860, 1200], [1830, 1400], [1500, 1560], [1380, 1500], [1340, 1100], [1240, 800]], '#ffd27a', b(1) + 10, { sc: .9, fo: .12, w: 5, dash: '16 10' });
  M.text([1560, 660], '规划 20.5 平方公里', b(1) + 11, { sc: .9, fs: 30, c: '#ffd27a' });
  M.pin('红牌港', '红牌港', b(1) + 12, { sc: .9, a: 'end', dx: -22, sub: '天然港口' });
  // 高炉
  const k = 1 / .9;
  M.key(b(2), [1560, 1000], 1.1, 3);
  M.add(LG.stove(1500, 1080, k * .9) + LG.stove(1535, 1095, k * .9) + LG.furnace(1590, 1090, k * .8) + LG.furnace(1700, 1120, k * .8), b(2) + 1, { scale: .9 });
  c.card('<h3>临高钢铁公司</h3><p>高炉 2 座 · 各 <b>125 m³</b></p><p>高约 10 米，旁边是同样高的热风炉</p><p>外加一圈<b>抗台风</b>梁柱与锚索</p>', 'left:110px;top:230px;width:520px', b(2) + 2, b(2) + 10);
  const t2 = b(2) + c.sc.beats[2].d * .62;
  const bg = c.el('<div style="position:absolute;inset:0;background:#0b0d10"></div>'); c.in(bg, t2 - .3, { dy: 0 });
  c.hd2('今天 · 金牌港经济开发区', '', t2);
  twoPhotos(c, ['hainan1_13.jpg', '今日 · 金牌港'], ['hainan1b_15.jpg', '今日 · 开发区厂房'], t2 + .1);
} };

// ───────── 05 海南全岛
SC.s5 = { build(c) {
  const { b, be } = c;
  c.src(AMAP + ' · ' + WIKI);
  const H = c.map('lg_m_hainan_z10.jpg', { until: b(0) + 11 });
  H.key(0, [1100, 880], .86).key(b(0) + 7, [900, 1300], 1.2, 4);
  const bp = H.p('博铺港');
  H.pin(bp, '临高', b(0), { sc: .86, c: '#d0533c' });
  H.route([bp, [860, 230], [700, 360], [420, 560], [230, 760], [190, 1050], [330, 1400], [600, 1560], [840, 1640], H.p('榆林港')], b(0) + .8, { sc: .9, w: 6, c: '#7fd1ff', smooth: 1, d: 6.5 });
  H.pin('儋州', '儋州', b(0) + 2, { sc: .9, c: '#9aa3ad' }); H.pin('昌化', '昌化', b(0) + 3, { sc: .9, c: '#9aa3ad' });
  H.pin('三亚湾', '三亚湾', b(0) + 5.5, { sc: .9, c: '#9aa3ad', a: 'end', dx: -20 });
  H.pin('榆林港', '崖州 · 榆林港', b(0) + 7, { sc: 1.1, sub: '修筑榆林堡' });
  c.chip(130, 760, '1629 年 4 月', '环岛航行', b(0) + .8, b(0) + 11);
  const S = c.map('lg_m_sanya_z13.jpg', { at: b(0) + 10.5, d: 1.2 });
  const yl = S.p('榆林港'), td = S.p('田独');
  S.key(0, [860, 980], 1.15).key(b(1) + 1, [930, 900], 1.25, 8);
  S.pin(yl, '榆林港', b(0) + 11, { sc: 1.2, sub: '后升格为三亚特区' });
  S.route([[yl[0] + 20, yl[1] - 30], [840, 1000], [900, 850], [1000, 740], td], b(1), { sc: 1.25, w: 6, c: '#7fd1ff', smooth: 1, d: 3 });
  S.text([890, 820], '沿田独河逆流而上', b(1) + 1.5, { sc: 1.25, fs: 24, c: '#bfe3ff', a: 'end' });
  S.pin(td, '田独', b(1) + 3, { sc: 1.25, c: '#d0533c', sub: '铁矿 · 品位高' });
  S.route([[yl[0] + 40, yl[1] - 20], [880, 1060], [980, 900], [1060, 760], [td[0] - 10, td[1] + 20]], b(1) + 8, { sc: 1.25, w: 7, c: '#f2f2f2', smooth: 1, d: 2.5, arrow: false, dash: '18 10' });
  S.text([1010, 980], '榆林—田独铁路', b(1) + 9, { sc: 1.25, fs: 26, c: '#fff', a: 'start' });
  c.chip(1400, 760, '矿石装船', '运往马袅高炉', b(1) + 11, b(2) - .2);
  c.photo('hainan2_15.jpg', 1390, 250, 420, 280, '今日 · 三亚湾', b(1) + 4, b(2) - .2);
  // 土堤之战
  const C = c.map('lg_m_chengmai_z12.jpg', { at: b(2) - .4, until: b(2) + 11.5 });
  const fc = C.p('琼州府城'), cm = C.p('澄迈县城');
  C.key(0, [1800, 620], 1.0).key(b(2) + 2, [1650, 640], 1.1, 6);
  C.pin(fc, '琼州府城', b(2), { sc: 1, c: '#9aa3ad', a: 'end', dx: -20 });
  C.pin(cm, '澄迈县城', b(2) + 1, { sc: 1, c: '#9aa3ad', a: 'end', dx: -20, dy: -14 });
  C.route([[fc[0] - 20, fc[1] + 20], [1900, 600], [cm[0] + 50, cm[1] + 5]], b(2) + 1.5, { sc: 1.05, w: 8, c: '#ff6b55', smooth: 1, d: 3 });
  C.text([1880, 660], '明军沿驿道西进', b(2) + 2.5, { sc: 1.05, fs: 26, c: '#ffb3a6' });
  C.add(LG.boom(cm[0] + 60, cm[1] + 10, 1), b(2) + 5.5, { scale: .4 });
  C.text([cm[0] + 60, cm[1] + 80], '土堤之战', b(2) + 5.8, { sc: 1.1, fs: 30, c: '#ffd27a' });
  c.chip(130, 760, '1630 年 7 月', '土堤之战', b(2) + 5.5, b(2) + 11.5);
  const H2 = c.map('lg_m_hainan_z10.jpg', { at: b(2) + 11 });
  H2.key(0, [1100, 880], .86);
  H2.zone([[1000, 240], [1400, 190], [1760, 130], [1950, 200], [2000, 500], [1720, 800], [1640, 1100], [1500, 1300], [1260, 1440], [1000, 1610], [700, 1560], [400, 1460], [250, 1360], [220, 1100], [260, 800], [400, 520], [650, 380], [900, 260]], '#d9a441', b(2) + 11.8, { sc: .86, fo: .22, w: 5, d: 1.2 });
  H2.text([1100, 900], '控制范围扩展到全岛', b(2) + 12.5, { sc: .86, fs: 40, c: '#ffd27a' });
} };

// ───────── 06 珠江与西江
SC.s6 = { build(c) {
  const { b, be } = c;
  c.src(AMAP + ' · ' + WIKI);
  const P = c.map('lg_m_prd_z10.jpg', { until: b(2) - .1 });
  const mc = P.p('澳门'), hk = P.p('香港'), hm = P.p('虎门'), gz = P.p('白鹅潭');
  P.key(0, [990, 1200], 1.2).key(b(0) + 6, [990, 980], 1.2, 6);
  P.route([[300, 1792], [800, 1560], [1180, 1470], [1380, 1380], [hk[0] - 10, hk[1] + 10]], b(0) + .3, { sc: 1.2, w: 7, c: '#7fd1ff', smooth: 1, d: 4 });
  P.pin(mc, '澳门', b(0) + 2, { sc: 1.2, c: '#9aa3ad', a: 'end', dx: -20 });
  P.pin(hk, '香港岛 · 湾仔', b(0) + 4, { sc: 1.2, sub: '登陆建据点' });
  P.route([[hk[0] - 20, hk[1] - 20], [1300, 1100], [1150, 1000], [hm[0] + 10, hm[1] + 10]], b(0) + 6, { sc: 1.2, w: 7, c: '#ff8a7a', smooth: 1, d: 2.5 });
  P.pin(hm, '虎门炮台', b(0) + 8.2, { sc: 1.2, c: '#d0533c', sub: '9 月 20 日攻下' });
  P.route([[hm[0] - 10, hm[1] - 10], [1000, 760], [900, 680], [gz[0] + 10, gz[1] + 5]], b(0) + 11, { sc: 1.2, w: 7, c: '#ff8a7a', smooth: 1, d: 2.5 });
  P.pin(gz, '广州府 · 白鹅潭', b(0) + 13.3, { sc: 1.2, a: 'end', dx: -20, sub: '城下议和' });
  c.chip(130, 650, '1630 年 9 月', '湾仔登陆 · 攻下虎门', b(0) + 4.5, b(2));
  c.chip(130, 760, '1630 年 11 月', '舰队进入白鹅潭，城下议和', b(0) + 14, b(2));
  P.ring(hk, 70, '#7fd1ff', b(1) + .3, { sc: 1.2, fo: .15, w: 5, dash: '0' });
  P.text([hk[0], hk[1] + 110], '舰队总基地', b(1) + 1, { sc: 1.2, fs: 30, c: '#bfe3ff' });
  P.ring(gz, 90, '#d9a441', b(1) + 4, { sc: 1.2, fo: .2, w: 5, dash: '0' });
  c.chip(1420, 130, '1635 年 3 月 1 日', '接收广州城 · 设广州特别市', b(1) + 4.5, b(2));
  // 西江
  const X = c.map('lg_m_xijiang_z9.jpg', { at: b(2) - .4 });
  X.key(0, [900, 520], 1.3).key(b(2) + 1, [620, 500], 1.4, 9);
  const xs = ['广州', '佛山', '三水', '肇庆', '梧州'].map(n => X.p(n));
  X.route([xs[0], xs[1], xs[2], [830, 570], xs[3], [640, 545], [520, 480], [420, 440], [xs[4][0] + 10, xs[4][1] + 5]], b(2) + .3, { sc: 1.3, w: 7, c: '#a6e3a1', smooth: 1, d: 7 });
  X.pin(xs[0], '广州', b(2), { sc: 1.3, c: '#9aa3ad' });
  X.pin(xs[1], '佛山镇', b(2) + 1.2, { sc: 1.3, c: '#9aa3ad', dy: 34 });
  X.pin(xs[2], '三水', b(2) + 2.2, { sc: 1.3, c: '#9aa3ad', dy: -14 });
  X.pin(xs[3], '肇庆府', b(2) + 3.5, { sc: 1.35, c: '#9aa3ad', dy: 34 });
  X.pin(xs[4], '梧州府', b(2) + 6.5, { sc: 1.4, a: 'end', dx: -20, dy: -16 });
  X.text([xs[4][0] + 30, xs[4][1] + 60], '江中长洲岛 · 陆军登陆', b(2) + 9, { sc: 1.4, fs: 24, c: '#ffb3a6', a: 'start' });
  c.chip(130, 760, '1635 年 4 月 12 日', '舰队停泊梧州城南江面', b(2) + 8, b(3) - .2);
  c.photo('prd_03.jpg', 1330, 230, 480, 330, '今日 · 梧州长洲岛', b(2) + 10, b(3) + .5);
  X.key(b(3), [880, 560], 1.6, 3);
  X.text([800, 640], '西江航运 · 撤销护航', b(3) + 1, { sc: 1.6, fs: 28, c: '#c8f0c4' });
  X.ring(xs[1], 40, '#ffd27a', b(3) + 3, { sc: 1.6, fo: .25, w: 4, dash: '0' });
  X.text([xs[1][0] + 30, xs[1][1] + 70], '佛山经济开发区（试点）', b(3) + 3.5, { sc: 1.6, fs: 26, c: '#ffd27a', a: 'start' });
  c.chip(130, 760, '1636 年', '广州—梧州航运撤销护航', b(3) + .5);
} };

// ───────── 07 台湾海峡
SC.s7 = { build(c) {
  const { b, be } = c;
  c.src(AMAP + ' · ' + WIKI);
  const T = c.map('lg_m_strait_z8.jpg', { until: b(1) + 8 });
  const dg = T.p('打狗'), ph = T.p('澎湖'), lr = T.p('料罗湾');
  T.key(0, [650, 500], 1.6).key(b(1), [640, 420], 1.75, 4);
  T.route([[60, 900], [500, 820], [dg[0] - 15, dg[1] + 5]], b(0) + .2, { sc: 1.55, w: 6, c: '#7fd1ff', curve: .05, d: 2.5 });
  T.text([150, 860], '← 自香港', b(0) + .5, { sc: 1.55, fs: 24, c: '#bfe3ff', a: 'start' });
  T.pin(dg, '打狗（今高雄）', b(0) + 2.5, { sc: 1.55, sub: '1631 年 10 月登陆' });
  T.ring([dg[0] + 25, dg[1] - 15], 40, '#a6e3a1', b(0) + 6, { sc: 1.55, fo: .3, w: 3, dash: '0' });
  c.chip(130, 760, '1633 年初', '完成开垦十万亩 · 后续安置福建、山东移民', b(0) + 6.5, be(0) + .2);
  T.pin(ph, '澎湖 · 马公', b(1) + 1, { sc: 1.75, a: 'end', dx: -20, sub: '集结 · 前进基地' });
  T.route([[ph[0] - 10, ph[1] - 10], [lr[0] + 10, lr[1] + 10]], b(1) + 4, { sc: 1.75, w: 7, c: '#ff6b55', curve: -.15, d: 2 });
  c.chip(130, 760, '1632 年 9 月', '霸王行动', b(1) + 1, b(2));
  const J = c.map('lg_m_jinxia_z12.jpg', { at: b(1) + 7.5, d: 1.2 });
  J.key(0, [1024, 960], .95).key(b(1) + 8, [1024, 960], .96, 6);
  const tg = { 料罗湾: [1500, 1700], 金门: [1250, 1650], 厦门: [700, 1700], 鼓浪屿: [500, 1750], 安平: [1900, 700] };
  Object.entries(tg).forEach(([n, from], i) => { const q = J.p(n); J.route([from, [q[0] + (from[0] > q[0] ? 20 : -20), q[1] + 20]], b(1) + 8.5 + i * .7, { sc: 1, w: 7, c: '#ff6b55', curve: .1, d: 1.4 }); J.pin(q, n === '厦门' ? '厦门（中左所）' : n === '安平' ? '安平镇' : n, b(1) + 9 + i * .7, { sc: 1, c: '#d9a441', a: n === '鼓浪屿' ? 'end' : 'start', dx: n === '鼓浪屿' ? -20 : 18, dy: n === '鼓浪屿' ? 30 : n === '料罗湾' ? -14 : n === '安平' ? 34 : 10 }); });
  c.chip(1420, 760, '9 月 20 日凌晨', '突入料罗湾 · 四地同时登陆', b(1) + 9, b(2) + .5);
  const ap = J.p('安平');
  J.key(b(2), [ap[0] - 200, ap[1] + 200], 1.4, 3);
  [[-60, -40], [40, 30], [-20, 90], [90, -60], [-110, 60]].forEach(([dx, dy], i) => J.add(LG.boom(ap[0] + dx, ap[1] + dy, .75), b(2) + 4 + i * .35, { scale: .3 }));
  J.route([[ap[0] - 40, ap[1] + 140], [1450, 1300], [1600, 1650]], b(2) + 2, { sc: 1.4, w: 6, c: '#c9ccd2', smooth: 1, d: 2, dash: '10 10' });
  c.chip(130, 760, '一个月后', '撤出安平 · 爆破摧毁村镇营寨', b(2) + 2);
  c.photo('strait_07.jpg', 110, 230, 500, 330, '今日 · 安平桥（宋代石桥）', b(2) + 6.5);
} };

// ───────── 08 黄海与渤海
SC.s8 = { build(c) {
  const { b, be } = c;
  c.src(AMAP + ' · ' + WIKI);
  const Wd = c.map('lg_m_wide_z6.jpg', { until: b(1) + .3 });
  const hk = Wd.p('香港'), jj = Wd.p('济州');
  Wd.key(0, [1050, 1000], 1.05).key(b(0) + 3, [1080, 960], 1.15, 10);
  Wd.pin(hk, '香港 · 总基地', b(0) + .3, { sc: 1.05, a: 'end', dx: -20 });
  Wd.route([[hk[0] + 10, hk[1] - 10], [1150, 1080], jj], b(0) + 1.5, { sc: 1.05, w: 6, c: '#ffd27a', smooth: 1, d: 4 });
  Wd.add(LG.ship(1120, 1060, .9, '#1d1f24'), b(0) + 4);
  c.card('<h3>发动机行动</h3><p>目的：把北方流民运往海南</p><p>旗舰 <b>立春号</b> · 1500 吨</p><p>集结 <b>68 艘</b>舰船和大量小艇</p>', 'left:110px;top:240px;width:470px', b(0) + 2.5, b(1));
  const Y = c.map('lg_m_wide_z6.jpg', { at: b(1) - .3 });
  Y.key(0, [1336, 628], 2.3).key(b(1) + 1, [1376, 653], 2.8, 6);
  const jz = Y.p('济州'), cs = Y.p('城山');
  Y.pin(jz, '济州（朝鲜）', b(1) + .3, { sc: 2.6, a: 'end', dx: -20, sub: '中转站' });
  Y.route([[cs[0] + 35, cs[1] + 35], [cs[0] + 4, cs[1] + 3]], b(1) + 2.5, { sc: 2.8, w: 6, c: '#ff6b55', d: 1 });
  Y.pin(cs, '城山', b(1) + 3, { sc: 2.8, c: '#d0533c', dy: -16 });
  c.chip(130, 540, '1631 年底', '城山登陆', b(1) + 3, b(2));
  c.chip(130, 650, '1632 年 1 月 12 日', '济州城陷落 · 4 月控制全岛', b(1) + 6, b(2));
  c.chip(130, 760, '此后', '安置约五万山东移民', b(1) + 9, b(2));
  c.photo('north_01.jpg', 1330, 240, 480, 300, '今日 · 济州', b(1) + 7, b(2));
  // 登州
  const D = c.map('lg_m_dengzhou_z11.jpg', { at: b(2) - .4, until: b(3) + .3 });
  D.key(0, [950, 860], 1.12).key(b(2) + 1, [950, 900], 1.2, 9);
  const qm = D.p('屺㟂岛'), dz = D.p('登州'), md = D.p('庙岛群岛');
  D.pin(qm, '屺㟂岛', b(2) + .5, { sc: 1.12, a: 'end', dx: -20, sub: '收集点' });
  D.route([[720, 1500], [qm[0] + 30, qm[1] + 30]], b(2) + 2, { sc: 1.12, w: 6, c: '#ffd27a', curve: .1, d: 1.5 });
  D.text([730, 1440], '招远一带 ↓', b(2) + 2, { sc: 1.12, fs: 26, c: '#ffd27a', a: 'start' });
  D.text([qm[0] + 40, qm[1] + 120], '约 28 万人', b(2) + 4, { sc: 1.12, fs: 40, c: '#fff', a: 'start' });
  D.pin(dz, '登州府', b(2) + 6.5, { sc: 1.2, c: '#9aa3ad', dy: 34 });
  D.pin(md, '庙岛群岛', b(2) + 7, { sc: 1.2, a: 'end', dx: -20 });
  D.route([[1500, 300], [md[0] + 20, md[1] - 10]], b(2) + 8, { sc: 1.2, w: 7, c: '#ff6b55', curve: .15, d: 1.5 });
  c.chip(1420, 760, '1633 年 1 月', '庙岛两栖作战 · 登州收复', b(2) + 8.5, b(3));
  c.photo('north_06.jpg', 1330, 230, 480, 300, '今日 · 长岛（庙岛群岛）', b(2) + 10.5, b(3));
  // 移民流向
  const Y2 = c.map('lg_m_wide_z6.jpg', { at: b(3) - .3, until: b(4) + .3 });
  Y2.key(0, [1240, 650], 1.75);
  const yz = Y2.p('沂州'), hz = Y2.p('杭州'), dz2 = Y2.p('登州'), jz2 = Y2.p('济州');
  Y2.pin(dz2, '登州 · 屺㟂岛', b(3), { sc: 1.75, sub: '约 28 万' });
  Y2.pin(yz, '沂州', b(3) + 1, { sc: 1.75, a: 'end', dx: -20, sub: '约 5.1 万' });
  Y2.pin(hz, '杭州', b(3) + 4, { sc: 1.75, a: 'end', dx: -20, sub: '约 1.4 万' });
  Y2.pin(jz2, '济州', b(3) + 6, { sc: 1.75 });
  Y2.route([[dz2[0] + 20, dz2[1] + 10], [jz2[0] - 20, jz2[1] - 10]], b(3) + 6.5, { sc: 1.75, w: 6, c: '#ffd27a', curve: -.15, d: 1.5 });
  Y2.route([[yz[0] + 10, yz[1] + 15], [1060, 720], [1010, 860]], b(3) + 7.3, { sc: 1.75, w: 6, c: '#ffd27a', smooth: 1, d: 1.6 });
  Y2.text([1020, 760], '→ 台湾、海南各县', b(3) + 8.5, { sc: 1.75, fs: 28, c: '#ffd27a', a: 'start' });
  // 辽东
  const A = c.map('lg_m_yalu_z10.jpg', { at: b(4) - .3 });
  A.key(0, [768, 760], 1.27).key(b(4) + 1, [768, 720], 1.27, 8);
  const ls = A.p('旅顺'), zj = A.p('镇江堡');
  A.route([[0, 1270], [ls[0] + 10, ls[1] + 20], [200, 800], [330, 520], [480, 330]], b(4) + .3, { sc: 1.3, w: 6, c: '#7fd1ff', smooth: 1, d: 3.5, dash: '14 8' });
  A.text([220, 560], '海天号测绘渤海北岸', b(4) + 2.5, { sc: 1.3, fs: 26, c: '#bfe3ff', a: 'start' });
  A.pin(ls, '旅顺', b(4) + 1.5, { sc: 1.3, sub: '侦察' });
  A.route([[ls[0] + 60, ls[1] + 30], [800, 900], [zj[0] - 20, zj[1] + 30]], b(4) + 4.5, { sc: 1.3, w: 6, c: '#7fd1ff', smooth: 1, d: 2.5 });
  A.pin(zj, '镇江堡', b(4) + 6.5, { sc: 1.3, a: 'end', dx: -20, dy: 30, sub: '鸭绿江口 · 互市' });
  A.route([[zj[0] - 60, zj[1] - 40], [920, 40]], b(4) + 9, { sc: 1.3, w: 6, c: '#ffd27a', curve: .1, d: 1.4 });
  A.text([940, 110], '沈阳 · 商馆 ↑', b(4) + 9.5, { sc: 1.3, fs: 28, c: '#ffd27a', a: 'start' });
  c.photo('north_12.jpg', 1330, 520, 480, 300, '今日 · 旅顺口', b(4) + 2, b(4) + 9);
} };

// ───────── 09 八年
SC.s9 = { build(c) {
  const { b, be } = c;
  c.src(AMAP + ' · ' + WIKI);
  const Wd = c.map('lg_m_wide_z6.jpg', { until: b(1) + .3 });
  Wd.key(0, [1024, 1250], .94).key(b(0) + 6, [1024, 650], .94, 7);
  const q = n => Wd.p(n), K = 1;
  const arcs = [['临高', '香港', '#7fd1ff', -.2], ['香港', '打狗', '#7fd1ff', -.2], ['香港', '澎湖', '#ff8a7a', -.15], ['香港', '济州', '#ffd27a', -.12], ['济州', '登州', '#ffd27a', -.2], ['济州', '镇江堡', '#ffd27a', .2], ['香港', '吕宋', '#c9b8ff', .1], ['临高', '鸿基', '#c9b8ff', .3], ['广州', '梧州', '#a6e3a1', .1]];
  arcs.forEach(([a, bb, col, cv], i) => Wd.route([q(a), q(bb)], b(0) + .5 + i * .45, { sc: 1, w: 5, c: col, curve: cv, d: 1.4 }));
  ['临高', '香港', '广州', '打狗', '济州', '登州', '镇江堡', '沈阳', '吕宋', '鸿基', '梧州'].forEach((n, i) => Wd.pin(q(n), n === '鸿基' ? '安南 · 鸿基' : n, b(0) + .6 + i * .3, { sc: 1, r: n === '临高' ? 14 : 9, c: n === '临高' ? '#d0533c' : '#d9a441', fs: n === '临高' ? 36 : 26, a: ['鸿基', '梧州', '广州'].includes(n) ? 'end' : 'start', dx: ['鸿基', '梧州', '广州'].includes(n) ? -18 : 16 }));
  c.chip(130, 760, '到 1636 年', '两广主要城市已在其控制之下', b(0) + 11, be(0) + .3);
  const L = c.map('lg_m_lingao_z13.jpg', { at: b(1) - .3, until: b(2) - .2 });
  L.key(0, [1500, 900], .9).key(b(1) + 1, [1500, 880], 1.0, 12);
  const bp = L.p('博铺港'), br = L.p('百仞滩'), mn = L.p('马袅'), xc = L.p('临高县城');
  const items = [
    () => L.pin(bp, '渡口', b(1) + .8, { sc: 1 }),
    () => L.route([bp, [1328, 735], [1300, 780], [1262, 840], [1225, 905], br], b(1) + 2, { sc: 1, w: 7, c: '#d9a441', smooth: 1, d: 1.5, arrow: false }),
    () => L.zone([[br[0] - 80, br[1] - 60], [br[0] + 80, br[1] - 70], [br[0] + 85, br[1] + 40], [br[0] - 75, br[1] + 50]], '#d0533c', b(1) + 4, { sc: 1, fo: .35 }),
    () => L.add(`<rect x="${br[0] - 10}" y="${br[1] - 22}" width="20" height="44" fill="#2f5bea" stroke="#fff" stroke-width="3"/>`, b(1) + 6),
    () => L.add(Array.from({ length: 12 }, (_, i) => `<rect x="${xc[0] - 300 + (i % 4) * 46}" y="${xc[1] - 40 + Math.floor(i / 4) * 36}" width="40" height="30" fill="#86ad57" stroke="#a9c98a"/>`).join(''), b(1) + 7.5),
    () => L.add(LG.furnace(mn[0] - 140, mn[1] - 120, .45) + LG.furnace(mn[0] - 100, mn[1] - 105, .45), b(1) + 9.5),
  ];
  items.forEach(f => f());
  [['一个渡口', bp, -10, -50], ['十二公里公路', [1290, 810], 40, 0], ['两岸分区的城', br, -110, 90], ['水电站', br, 30, -40], ['方格田', [xc[0] - 210, xc[1] - 60], 0, -10], ['滨海钢铁基地', [mn[0] - 120, mn[1] - 230], 0, 0]].forEach(([t, p, dx, dy], i) =>
    L.text([p[0] + dx, p[1] + dy], t, b(1) + [1, 2.5, 4.5, 6.3, 8, 10][i], { sc: 1, fs: 28, c: '#ffd27a' }));
  // 片尾
  const end = c.el(`<div class="big" style="background:#0b0d10"><div style="font:900 72px/1.3 var(--serif)">这一期，停在 1636 年</div>
    <div style="font:500 30px/1.6 var(--sans);color:#ccc;margin-top:20px">地点、数字如有出入，以原著为准</div>
    <div style="font:400 20px/1.9 var(--sans);color:#999;margin-top:56px;max-width:1300px">
    资料：临高启明灰机 wiki（CC BY-SA 3.0）· 卫星底图：© 高德地图 GS(2025)5996号<br>
    照片：海南日报、央广网、国际在线、海口网、人民网、新华网、中国新闻网、南方网、中国日报网、中国台湾网、福建省文化和旅游厅、中国网、央广网大连等（画面中逐张标注）<br>
    STW932 / Wikimedia Commons（CC BY-SA 4.0）· 脚本与画面：Claude · 配音：Gemini TTS · 1.25 倍速</div></div>`);
  c.in(end, b(2) - .2, { dy: 0, d: .8 });
} };
