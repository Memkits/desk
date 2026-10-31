// 第一集 · 远古的人
const PAL = '旧石器时代';
S('a_open', c => {
  const { b, be, T } = c;
  // 从地球全景俯冲到中国
  mapScene(c, {
    view: [[0, { lon: 104, lat: 30, d: 120, tilt: 0, head: 0 }], [b(0) + 6, { ...HOME, d: 44, tilt: 22 }], [b(1), HOME], [b(2) + 2, { ...HOME, d: 40, tilt: 34, head: -6 }], [T, { ...HOME, d: 38, tilt: 34, head: -8 }]],
    year: [[0, 2000], [b(1), 2000], [b(1) + 1, -2200000], [be(1) - 1, 200], [b(2), -2200000], [T, -2200000]],
    sites: [[0, []], [b(1) + 1, 'auto']], cults: [[0, false], [b(1) + 1, true]], links: [[0, false], [b(1) + 1, true]], labels: [[0, 0], [b(1) + 1, 1], [be(1) - .5, 0]], cultLabels: 0, timeline: true,
  });
  credit(c);
  const ttl = show(c, `<div class="abs" style="left:100px;top:140px;z-index:5"><div style="font:900 96px/1.1 var(--serif);text-shadow:0 4px 30px #000">卫星上的中国考古</div><div style="font:600 36px var(--sans);color:var(--gold);margin-top:14px;text-shadow:0 0 12px #000">第一集 · 远古的人</div></div>`, .6, b(1) - .3);
  show(c, det(1380, 170, 440, '时间轴', '越往左越古老。刻度按“距今多少年”取对数：左边一格是几十万年，右边一格只有几百年。'), b(1) + .6, be(1));
  show(c, det(1380, 170, 440, '关于本片', '文稿与画面由 AI 生成，配音为 AI 合成。年代取考古报告与近年测年研究常用数值；文化范围、交流路线为示意。'), b(2) + 4, null);
});
S('a_date', c => {
  const { b, be, T } = c; c.head('00', '年代怎么来的');
  mapScene(c, { view: [[0, { ...HOME, d: 38, tilt: 34, head: -8 }], [T, { ...HOME, d: 40, tilt: 30, head: 0 }]], year: [[0, -2200000], [b(0), -3000], [be(0), -3000], [b(1), -40000], [be(1), -2120000], [b(2), -2120000], [T, -1000]], dim: .55, labels: 0, cults: false, links: false });
  // 碳十四衰减曲线
  const cv = c.el(`<canvas class="abs" width="900" height="460" style="left:120px;top:250px;z-index:5"></canvas>`), g = cv.getContext('2d');
  c.in(cv, b(0) + .5);
  c.tick(t => { const u = clamp((t - b(0) - 1) / 8); g.clearRect(0, 0, 900, 460); g.fillStyle = 'rgba(8,12,22,.82)'; g.fillRect(0, 0, 900, 460);
    g.strokeStyle = '#2c3854'; g.lineWidth = 2; g.beginPath(); g.moveTo(80, 60); g.lineTo(80, 380); g.lineTo(860, 380); g.stroke();
    g.font = '600 22px Inter, sans-serif'; g.fillStyle = '#a3aec3'; g.fillText('剩余的碳十四', 90, 50); g.fillText('死后经过的年数', 650, 420);
    g.strokeStyle = '#ffd27a'; g.lineWidth = 5; g.beginPath(); const N = 300, M = Math.round(N * u);
    for (let i = 0; i <= M; i++) { const yrs = i / N * 50000, f = Math.pow(.5, yrs / 5730), x = 80 + i / N * 780, y = 380 - f * 300; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    [[5730, '5730 年：剩一半'], [11460, '一万一千多年：剩四分之一']].forEach(([yr, s], k) => { if (u * 50000 < yr) return; const x = 80 + yr / 50000 * 780, y = 380 - Math.pow(.5, yr / 5730) * 300; g.fillStyle = '#ffd27a'; g.beginPath(); g.arc(x, y, 8, 0, 7); g.fill(); g.fillStyle = '#fff'; g.fillText(s, x + 16, y - 8 + k * 6); });
    if (t > b(1)) { g.fillStyle = 'rgba(255,107,107,' + clamp((t - b(1)) / 1) + ')'; g.fillText('五万年后：剩不到 0.3%，几乎测不出来', 300, 340); } });
  show(c, det(1100, 300, 700, '更古老的时钟', '古地磁：地球磁场方向在历史上多次翻转，岩层把它记了下来。<br>埋藏测年：石英颗粒被埋进地下后，宇宙射线产生的铝-26 和铍-10 开始衰减。'), b(1) + 1, null);
  show(c, card(1100, 560, 700, `<div class="p"><b>误差</b>：旧石器时代常常是“约多少万年前”，误差可达数万年；新石器以后，碳十四配合树轮校正，误差缩小到几十到一两百年。</div>`), b(2) + .5, null);
});
S('a_shangchen', c => {
  const { b, be, T } = c; c.head('01', '二百万年前的石器');
  mapScene(c, { view: [[0, { ...HOME, d: 40, tilt: 30, head: 0 }], [b(0) + 3, { lon: 109.45, lat: 34.2, d: 4.2, tilt: 40, head: 10 }], [be(1), { lon: 109.45, lat: 34.2, d: 5, tilt: 40, head: 16 }], [b(2) + 3, { lon: 104.5, lat: 29.5, d: 22, tilt: 30, head: 4 }], [T, { lon: 104.5, lat: 29.5, d: 22, tilt: 30, head: 0 }]],
    year: [[0, -2200000], [b(0) + 3, -2120000], [b(2) + 2, -1700000], [T, -1600000]], era: PAL, focus: [[0, 'shangchen'], [b(2) + 2, 'yuanmou']], cults: false, links: false });
  siteCard(c, 'shangchen', b(0) + 3, b(2) + 1);
  // 地层示意：黄土一层层
  const cv = c.el(`<canvas class="abs" width="300" height="480" style="left:120px;top:260px;z-index:5"></canvas>`), g = cv.getContext('2d'); c.in(cv, b(0) + 4); c.out(cv, b(2) + .6);
  for (let i = 0; i < 17; i++) { g.fillStyle = i % 2 ? '#b9965e' : '#8f6a3c'; g.fillRect(40, 40 + i * 24, 220, 24); }
  g.font = '600 18px Inter,sans-serif'; g.fillStyle = '#fff'; g.fillText('地表', 120, 30); g.fillStyle = '#ffd27a'; g.beginPath(); g.arc(150, 430, 9, 0, 7); g.fill(); g.fillText('最深的石器 ≈ 212 万年', 46, 470);
  show(c, card(1380, 170, 440, `<div class="k">非洲以外</div><div class="p" style="font-size:23px">过去认为人类祖先约 <b>180 万年前</b>才走出非洲。上陈说明，<b>200 万年前</b>东亚已经有人。</div>`), b(1) + 1, b(2) + 1);
  siteCard(c, 'yuanmou', b(2) + 2.5, null, '两颗门齿，古地磁测年约 170 万年前。最早的人类通常归为<b>直立人</b>：会打制石器、会用火，脑容量比现代人小得多。');
});

S('a_zkd', c => {
  const { b, be, T } = c; c.head('02', '周口店：一个洞穴用了几十万年');
  const z = at1(115.925, 39.689, .16, 34, 6);
  mapScene(c, { view: [[0, at1(104.5, 29.5, 22, 30, 0)], [b(0) + 4, { ...z, d: .5 }], [be(0), z], [be(1), { ...z, head: 14 }], [b(2) + 2, { ...z, d: .24, head: 10 }], [T, at1(115.9, 39.7, .6, 30, 0)]],
    year: [[0, -1600000], [b(0) + 3, -780000], [be(1), -420000], [b(2) + 1, -36000], [T, -35000]], era: PAL, focus: 'zhoukoudian', cults: false, links: false, dot: [[0, 1.2], [b(0) + 4, .6]],
    close: { zhoukoudian: [[b(0) + 2, 0], [b(0) + 4, 1]] } });
  siteCard(c, 'zhoukoudian', b(0) + 4, b(1) - .2, '1929 年，裴文中在这里发现第一个完整的北京猿人头盖骨。');
  show(c, det(1380, 170, 440, '铝铍埋藏测年', '石英颗粒在地表时，宇宙射线在其中产生铝-26 和铍-10；被埋进洞里后，两者以不同速度衰减。比值就是“埋了多久”的钟。<br><b>约 77 万年前</b>（2009 年《自然》）', '洞穴随后被反复使用几十万年'), b(1) + .5, b(2) - .2);
  show(c, card(1380, 170, 440, `<div class="k">山顶洞 · 约 3.7 万—3.5 万年前</div><div class="p" style="font-size:22px">现代人：给贝壳、兽牙钻孔，用赤铁矿染红，串起来佩戴。</div>`), b(2) + 1, null);
});
S('a_deni', c => {
  const { b, be, T } = c; c.head('03', '丹尼索瓦人：从一根指骨到一张脸');
  const dc = at1(84.68, 51.40, 14, 30, 0), bs = at1(102.57, 35.45, 5, 36, -8), hb = at1(126.62, 45.75, 6, 34, 4);
  mapScene(c, { view: [[0, at1(115.9, 39.7, .6, 30, 0)], [b(0) + 4, dc], [be(0), { ...dc, head: 6 }], [b(1) + 3, bs], [be(1), { ...bs, head: -2 }], [b(2) + 3, hb], [be(2), { ...hb, head: 8 }], [b(3) + 3, at1(112.5, 36, 22, 32, 0)], [b(4) + 3, at1(113, 36, 24, 32, -4)], [T, at1(112, 36, 26, 30, 0)]],
    year: [[0, -35000], [b(0) + 2, -50000], [b(1) + 2, -160000], [b(2) + 2, -146000], [b(3) + 1, -125000], [b(4) + 1, -260000], [b(4) + 4, -1000000], [T, -150000]], era: PAL, cults: false, links: false,
    focus: [[0, null], [b(1) + 2, 'baishiya'], [b(2) + 2, 'harbin'], [b(3) + 1, 'lingjing'], [b(4), null]],
    pins: [{ lon: 84.68, lat: 51.40, lab: '丹尼索瓦洞（西伯利亚阿尔泰山）', a: [[b(0) + 2, 0], [b(0) + 3, 1], [be(0), 1], [b(1) + 1, 0]] }] });
  show(c, card(1380, 170, 440, `<div class="k">2010</div><div class="p" style="font-size:22px">一小块<b>指骨</b>里测出一种未知古人类的基因组，命名为丹尼索瓦人。<br>只有基因，没有长相。</div>`), b(0) + 3, b(1) + .5);
  siteCard(c, 'baishiya', b(1) + 3, b(2) + .5);
  siteCard(c, 'harbin', b(2) + 3, b(3) - .2);
  show(c, det(1380, 560, 440, '两条独立证据', '头骨里的蛋白质（《科学》）+ 牙结石里的线粒体 DNA（《细胞》），都指向丹尼索瓦人。'), b(2) + 6, b(3) - .2);
  siteCard(c, 'lingjing', b(3) + 2, b(4) - .2);
  show(c, card(1380, 170, 440, `<div class="k">重新审视</div><div class="p" style="font-size:22px">大荔、金牛山：形态与哈尔滨头骨相似。<br>郧县 2 号头骨（约 100 万年前）：数字复原后被认为可能属于相近的一支。</div>`), b(4) + 1, null);
  show(c, det(1380, 450, 440, '仍有争论', '郧县的结论只基于一件被压扁的化石。'), b(4) + 6, null);
});
S('a_modern', c => {
  const { b, be, T } = c; c.head('04', '现代人来了');
  const sd = at1(106.507, 38.288, .2, 36, 0);
  mapScene(c, { view: [[0, at1(112, 36, 26, 30, 0)], [b(0) + 4, { ...sd, d: .45 }], [be(0), sd], [b(1) + 3, at1(115.88, 39.66, 2.4, 32, 6)], [be(1), at1(115.88, 39.66, 2.8, 32, 10)], [b(2) + 3, at1(100, 33, 24, 30, 0)], [T, at1(102, 33, 26, 30, -4)]],
    year: [[0, -60000], [b(0) + 3, -41000], [b(1) + 2, -40000], [b(2), -40000], [T, -30000]], era: PAL, cults: false, links: false,
    focus: [[0, 'shuidonggou'], [b(1) + 2, 'tianyuan'], [b(2), 'baishiya']], dot: [[0, 1.2], [b(0) + 3, .6], [b(1) + 2, 1.2]],
    close: { shuidonggou: [[b(0) + 2, 0], [b(0) + 4, 1], [be(0), 1], [b(1) + 1.5, 0]] } });
  siteCard(c, 'shuidonggou', b(0) + 4, b(1) - .2, '约 4 万年前出现勒瓦娄哇式石叶技术：先修整石核，再剥下规整的长石叶。约 3.7 万年前有鸵鸟蛋皮串珠。');
  siteCard(c, 'tianyuan', b(1) + 3, b(2) - .2);
  show(c, det(1380, 170, 440, '基因里的相遇', '今天许多东亚人和大洋洲人的基因组里，保留着少量丹尼索瓦人的片段。<br>藏族人适应高原低氧的 <b>EPAS1</b> 基因版本，很可能来自丹尼索瓦人。'), b(2) + 1, null);
});
S('a_lgm', c => {
  const { b, be, T } = c; c.head('05', '冰期：黄海是一片平原');
  const sea = at1(123, 32, 20, 30, 0), tw = at1(120.5, 25.5, 9, 36, -10);
  mapScene(c, { view: [[0, at1(102, 33, 26, 30, -4)], [b(0) + 4, sea], [be(0), { ...sea, head: 4 }], [b(1) + 4, tw], [be(1), { ...tw, head: -4 }], [b(2) + 2, at1(122, 31, 22, 30, 0)], [T, at1(122, 31, 22, 30, 0)]],
    year: [[0, -30000], [b(0) + 2, -20000], [T, -19000]], era: '末次冰期最盛期', cults: false, links: false, labels: 0,
    lgm: [[b(0) + 2, 0], [b(0) + 5, 1], [be(2) - 1, 1], [T, .6]] });
  show(c, det(1380, 170, 440, '示意', '浅色陆地按今天的海底地形画出：今天水深较浅的大陆架，在海平面低约 <b>120 米</b>时露出水面。'), b(0) + 5, null);
  const lb = c.el(`<div class="mov"></div>`), L = [['今渤海', 120.2, 38.8], ['今黄海', 123.4, 35.3], ['今东海', 124.6, 30.2], ['今台湾海峡', 119.6, 24.4]].map(([n, lo, la]) => ({ lo, la, d: c.el(`<div class="clab" style="font-size:30px;color:#ffe9a8">${n}</div>`, lb) }));
  c.tick(t => { const a = clamp((t - b(0) - 5) / 1.2); L.forEach(q => { const [x, y, v] = MAP.project(q.lo, q.la); q.d.style.display = v ? '' : 'none'; q.d.style.transform = `translate(${x}px,${y}px)`; q.d.style.opacity = a; }); });
  show(c, card(1380, 470, 440, `<div class="k">沉在水下的证据</div><div class="p" style="font-size:22px">冰期海边的人类遗址，今天大多在海底。地图上的空白，不一定是当时没有人。</div>`), b(2) + .5, null);
});
S('a_pottery', c => {
  const { b, be, T } = c; c.head('06', '最早的陶器');
  const x = at1(117.17, 28.73, .22, 34, 0);
  mapScene(c, { view: [[0, at1(122, 31, 22, 30, 0)], [b(0) + 4, { ...x, d: .5 }], [be(0), x], [T, { ...x, d: .45, head: 10 }]],
    year: [[0, -19000], [b(0) + 2, -18000], [T, -16000]], era: PAL, focus: 'xianrendong', cults: false, links: false, dot: [[0, 1.2], [b(0) + 4, .6]], lgm: [[0, .6], [3, 0]],
    close: { xianrendong: [[b(0) + 2, 0], [b(0) + 4, 1]] } });
  siteCard(c, 'xianrendong', b(0) + 4, null);
  show(c, det(1380, 470, 440, '煮', '坚硬的种子、贝类、骨头里的油脂，都能在陶罐里煮软、煮出来。<br>此时还没有农业。'), b(1) + .5, null);
});
S('a_end', c => {
  const { b, be, T } = c; c.head('07', '小结');
  mapScene(c, { view: [[0, at1(117.17, 28.73, .45, 34, 10)], [b(0) + 4, HOME], [be(0), { ...HOME, head: -4 }], [T, { ...HOME, d: 36, tilt: 34, head: -6 }]],
    year: [[0, -16000], [b(0) + 1, -2200000], [be(0), -40000], [b(1) + 2, -9000], [T, -8000]], era: [[0, PAL], [b(1) + 1, '冰期结束']], cults: false, links: false });
  const pts = [['上陈', '212 万年前'], ['周口店', '77 万年前'], ['白石崖 · 哈尔滨', '十几万年前'], ['水洞沟 · 田园洞', '4 万年前'], ['仙人洞', '2 万年前']];
  pts.forEach(([n, y], i) => show(c, card(1380, 170 + i * 104, 440, `<div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font:700 26px var(--serif)">${n}</b><span class="mono" style="color:var(--gold);font-size:20px">${y}</span></div>`), b(0) + 1 + i * 1.6, b(1) + 1));
  show(c, card(1380, 300, 440, `<div class="k">下一集</div><h3>稻与粟</h3><div class="p" style="font-size:22px">长江下游和华北，人们开始种植。</div>`), b(1) + 2, null);
});
