// 第三集 · 城
const NEO = '新石器时代晚期';
const LZ = { lon: 119.99, lat: 30.395 };
S('c_open', c => {
  const { b, be, T } = c;
  mapScene(c, { view: [[0, { ...HOME, d: 44, tilt: 22 }], [T, { lon: 114, lat: 33, d: 30, tilt: 36, head: -6 }]], year: [[0, -3500], [T, -2700]], era: NEO, cults: true, links: true });
  opening(c, '第三集 · 城', be(0) - 2); credit(c);
});
S('c_lz', c => {
  const { b, be, T } = c; c.head('01', '良渚：水乡里的王城');
  const near = { ...LZ, lat: LZ.lat - .004, d: .2, tilt: 30, head: 8 };
  mapScene(c, {
    view: [[0, { lon: 114, lat: 33, d: 30, tilt: 36, head: -6 }], [b(0) + 4.5, { lon: 119.95, lat: 30.4, d: 2.4, tilt: 30, head: 0 }], [be(0), { ...near, d: .5 }], [b(1) + 2, { ...near, d: .1 }], [b(1) + 6, { ...near, d: .16 }], [be(1), { ...near, d: .24, head: 14 }], [b(2) + 2, { ...near, d: .22, head: 10 }], [T, { ...near, d: .5, head: 4 }]],
    year: [[0, -2700], [b(0) + 4, -3300], [T, -2900]], era: '良渚文化', focus: 'liangzhu', cults: [[0, true], [b(0) + 4, false]], links: false, dot: [[0, 1.2], [b(0) + 5, .5]], labels: [[0, 1], [b(0) + 5, 0]],
    close: { liangzhu: [[b(0) + 2, 0], [b(0) + 4.5, 1]], kuahuqiao: 0 },
    boxes: [
      { lon: LZ.lon, lat: LZ.lat, w: .63, h: .45, lab: '莫角山（宫殿区）', pos: 'in', a: [[b(1), 0], [b(1) + 1, 1]] },
      { lon: LZ.lon, lat: LZ.lat, w: 1.77, h: 1.7, lab: '内城 约 300 万平方米', a: [[b(1) + 4, 0], [b(1) + 5, 1]], col: '#ff9a6b', fill: 'rgba(255,154,107,.06)' },
      { lon: LZ.lon, lat: LZ.lat, w: 3.2, h: 2.6, lab: '外郭 近 800 万平方米', pos: 'bottom', a: [[b(1) + 8, 0], [b(1) + 9, 1]], col: '#8ff0b4', fill: 'rgba(0,0,0,0)' },
    ],
  });
  siteCard(c, 'liangzhu', b(0) + 5, b(1) - .2, '距今 5300—4300 年。山前平原上的大城，周边已发现 350 多处同时期遗址。');
  show(c, det(1380, 170, 440, '示意', '方框按公布的面积画出，<b>不是</b>真实的城墙走向。', '卫星近景：EOxCloudless 2023，CC BY-NC-SA 4.0'), b(1) + 1, null);
  show(c, card(1380, 400, 440, `<div class="k">粮仓</div><div class="p" style="font-size:22px">莫角山南侧发现大片炭化稻谷，估计可能有<b>二十万斤</b>，很可能是失火的粮仓。</div>`), b(2) + .5, b(3) - .2);
  show(c, card(1380, 400, 440, `<div class="k">玉</div><div class="p" style="font-size:22px">反山、瑶山大墓：玉琮、玉钺、玉璧，许多刻着同一种<b>神人兽面纹</b>。</div>`), b(3) + .5, null);
});
S('c_dam', c => {
  const { b, be, T } = c; c.head('02', '五千年前的水坝');
  const v0 = { ...LZ, lat: LZ.lat - .004, d: .5, tilt: 30, head: 4 }, vd = { lon: 119.89, lat: 30.44, d: .36, tilt: 36, head: -12 };
  mapScene(c, {
    view: [[0, v0], [b(0) + 3, vd], [be(1), { ...vd, head: -4 }], [b(2) + 2, { lon: 119.92, lat: 30.42, d: .55, tilt: 26, head: 0 }], [T, { lon: 119.92, lat: 30.42, d: .65, tilt: 24, head: 0 }]],
    year: [[0, -2900], [b(0), -3150], [T, -2950]], era: '良渚文化', focus: 'liangzhu', cults: false, links: false, labels: 0, dot: .5,
    close: { liangzhu: 1, kuahuqiao: 0 },
    boxes: [{ lon: LZ.lon, lat: LZ.lat, w: 1.77, h: 1.7, lab: '良渚古城', a: 1, col: '#ff9a6b', fill: 'rgba(255,154,107,.06)' }],
    pins: [
      { lon: 119.80, lat: 30.475, lab: '高坝群（谷口）', a: [[b(0) + 3, 0], [b(0) + 4, 1]] },
      { lon: 119.865, lat: 30.425, lab: '低坝群', a: [[b(0) + 5, 0], [b(0) + 6, 1]] },
      { lon: 119.95, lat: 30.445, lab: '塘山长堤', a: [[b(0) + 7, 0], [b(0) + 8, 1]] },
    ],
  });
  show(c, det(1380, 170, 440, '位置示意', '水坝标注为大致位置。主要水坝年代集中在距今 5100—4900 年；已确认三级坝系，北部谷口有 16 条高坝。'), b(0) + 3, null);
  show(c, card(1380, 470, 440, `<div class="k">草裹泥</div><div class="p" style="font-size:22px">泥土装进草编的袋子，一层层垒起。高坝挡洪，低坝与长堤蓄水，可能也用于运输和灌溉。</div>`), b(1) + .5, b(2));
  show(c, card(1380, 470, 440, `<div class="k">2019</div><div class="p" style="font-size:22px">良渚古城遗址列入<b>世界遗产名录</b>。</div>`), b(2) + .5, null);
});

const boxNote = (c, t0) => show(c, det(1380, 170, 440, '示意', '方框按公布的面积画出，<b>不是</b>真实城墙走向。'), t0, null);
S('c_ts', c => {
  const { b, be, T } = c; c.head('03', '陶寺：观测日出的地方');
  const ts = dive('taosi', .2, 32, 0);
  mapScene(c, { view: [[0, at1(119.92, 30.42, .65, 24, 0)], [b(0) + 5, { ...ts, d: .5 }], [be(0), ts], [be(1), { ...ts, head: 12 }], [T, { ...ts, d: .3, head: 6 }]],
    year: [[0, -2950], [b(0) + 3, -2300], [T, -2000]], era: '龙山时代', focus: 'taosi', cults: false, links: false, dot: [[0, 1], [b(0) + 5, .5]], labels: [[0, 1], [b(0) + 6, 0]],
    close: { liangzhu: [[0, 1], [3, 0]], taosi: [[b(0) + 3, 0], [b(0) + 5, 1]] },
    boxes: [{ lon: 111.4972, lat: 35.8906, w: 1.8, h: 1.56, lab: '中期大城 约 280 万平方米', a: [[b(0) + 6, 0], [b(0) + 7, 1]] }] });
  siteCard(c, 'taosi', b(0) + 5, b(1));
  boxNote(c, b(0) + 7);
  // 观象台示意：半圆夯土柱与缝
  const cv = c.el(`<canvas class="abs" width="520" height="380" style="left:1340px;top:400px;z-index:5"></canvas>`), g = cv.getContext('2d'); c.in(cv, b(1) + 1);
  c.tick(t => { g.clearRect(0, 0, 520, 380); g.fillStyle = 'rgba(8,12,22,.85)'; g.fillRect(0, 0, 520, 380); const cx = 260, cy = 330, R = 220;
    g.fillStyle = '#ffd27a'; g.font = '600 20px Inter,sans-serif'; g.fillText('观象台示意（不按比例）', 20, 32);
    for (let i = 0; i < 12; i++) { const a = Math.PI * (.12 + i * .066); g.save(); g.translate(cx + R * Math.cos(Math.PI + a), cy + R * Math.sin(Math.PI + a)); g.rotate(a); g.fillStyle = '#b9965e'; g.fillRect(-10, -16, 20, 32); g.restore(); }
    const k = Math.floor(((t - b(1) - 2) / 1.6) % 11 + 11) % 11, a = Math.PI * (.12 + k * .066 + .033); g.strokeStyle = 'rgba(255,210,122,.9)'; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + (R + 60) * Math.cos(Math.PI + a), cy + (R + 60) * Math.sin(Math.PI + a)); g.stroke();
    g.fillStyle = '#ffb25c'; g.beginPath(); g.arc(cx + (R + 70) * Math.cos(Math.PI + a), cy + (R + 70) * Math.sin(Math.PI + a), 14, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(cx, cy, 7, 0, 7); g.fill(); g.fillText('观测点', cx - 30, cy + 34 > 375 ? 370 : cy + 30); });
  c.out(cv, b(2));
  show(c, card(1380, 400, 440, `<div class="p" style="font-size:22px">彩绘龙纹陶盘、鼍鼓、石磬、铜铃。<br>有学者把陶寺与古书中的<b>尧都</b>联系起来，但还没有文字证据确认。</div>`), b(2) + .5, null);
});
S('c_sm', c => {
  const { b, be, T } = c; c.head('04', '石峁：黄土高原上的石城');
  const sm = dive('shimao', .22, 34, 0), C0 = { lon: 110.3252, lat: 38.5657 };
  mapScene(c, { view: [[0, dive('taosi', .3, 32, 6)], [b(0) + 5, { ...sm, d: .5 }], [be(0), sm], [be(1), { ...sm, d: .2, head: 12 }], [T, { ...sm, d: .3, head: 4 }]],
    year: [[0, -2000], [b(0) + 3, -2300], [T, -1900]], era: '石峁文化', focus: 'shimao', cults: false, links: false, dot: [[0, .5], [b(0) + 2, 1], [b(0) + 5, .5]], labels: [[0, 0], [b(0) + 2, 1], [b(0) + 6, 0]],
    close: { taosi: [[0, 1], [3, 0]], shimao: [[b(0) + 3, 0], [b(0) + 5, 1]] },
    boxes: [{ ...C0, w: .28, h: .28, lab: '皇城台 台顶约 8 万平方米', pos: 'in', a: [[b(1), 0], [b(1) + 1, 1]] },
      { ...C0, w: 1.5, h: 1.4, lab: '内城 约 210 万平方米', a: [[b(1) + 4, 0], [b(1) + 5, 1]], col: '#ff9a6b', fill: 'rgba(255,154,107,.06)' },
      { ...C0, w: 2.1, h: 1.9, lab: '加上外城 共 400 万平方米以上', pos: 'bottom', a: [[b(1) + 8, 0], [b(1) + 9, 1]], col: '#8ff0b4', fill: 'rgba(0,0,0,0)' }] });
  siteCard(c, 'shimao', b(0) + 5, b(1));
  boxNote(c, b(1) + 1);
  show(c, card(1380, 400, 440, `<div class="k">古 DNA · 2025</div><div class="p" style="font-size:22px">144 例人骨：石峁人群主体是陕北当地仰韶晚期人群的后代；重建出跨越四代的家族谱系。</div>`), b(2) + 4, null);
});
S('c_yz', c => {
  const { b, be, T } = c; c.head('05', '城遍布各地');
  const sj = dive('shijiahe', .5, 32, 0), bd = dive('baodun', .5, 32, 0);
  mapScene(c, { view: [[0, dive('shimao', .3, 34, 4)], [b(0) + 3, sj], [b(0) + 7, { ...sj, d: .7 }], [b(0) + 10, bd], [be(0), { ...bd, d: .7 }], [b(1) + 3, at1(115.5, 35.5, 9, 32, 0)], [be(1), at1(115.5, 35.5, 10, 32, 6)], [b(2) + 3, { ...HOME, d: 38, tilt: 32 }], [T, { ...HOME, d: 38, tilt: 32, head: -4 }]],
    year: [[0, -1900], [b(0) + 2, -2400], [b(1) + 2, -2200], [b(2) + 1, -2300], [T, -2300]], era: '龙山时代', cults: [[0, false], [b(2), true]], links: false,
    focus: [[0, 'shijiahe'], [b(0) + 9, 'baodun'], [b(1), null]], dot: [[0, .6], [b(1), 1.2]], labelOnly: [[0, ['shijiahe', 'baodun']], [b(1), ['chengziya', 'wangchenggang', 'taosi']], [b(2), ARCH.S.map(s => s.id)]],
    close: { shimao: [[0, 1], [2, 0]], shijiahe: [[b(0) + 1, 0], [b(0) + 3, 1], [b(0) + 8, 1], [b(0) + 9, 0]], baodun: [[b(0) + 9, 0], [b(0) + 10, 1], [be(0), 1], [b(1) + 1, 0]] } });
  siteCard(c, 'shijiahe', b(0) + 3, b(0) + 9, '长江中游最大的史前城址：小型玉雕人像，成千上万的红陶小动物。');
  siteCard(c, 'baodun', b(0) + 10, b(1));
  show(c, card(1380, 170, 440, `<div class="k">黄河下游</div><div class="p" style="font-size:22px"><b>城子崖</b>：龙山文化最早被发现的城址，蛋壳黑陶。<br><b>王城岗、新砦</b>：后来夏商王朝的核心地区。</div>`), b(1) + 2, b(2));
});
S('c_42', c => {
  const { b, be, T } = c; c.head('06', '四千二百年前：转折');
  mapScene(c, { view: [[0, { ...HOME, d: 38, tilt: 32, head: -4 }], [T, { ...HOME, lon: 109, d: 36, tilt: 34, head: -8 }]],
    year: [[0, -2300], [be(0), -1800], [b(1), -2250], [be(1), -2150], [b(2), -1800], [T, -1750]], era: [[0, '龙山时代'], [b(1), '约 4200 年前'], [b(2), '']], cults: true, links: [[0, false], [b(2) + 2, ['西来']]] });
  [['良渚', '约 4300 年前废弃'], ['石家河', '随后衰落'], ['陶寺', '宫城、大墓遭破坏'], ['石峁', '约 3800 年前废弃']].forEach(([n, s], i) => show(c, card(1380, 170 + i * 104, 440, `<div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font:700 26px var(--serif)">${n}</b><span style="color:var(--fg2);font-size:20px">${s}</span></div>`), b(0) + 1 + i * 1.5, b(1)));
  show(c, card(1380, 170, 440, `<div class="k">可能的原因</div><div class="p" style="font-size:22px"><b>气候</b>：约 4200 年前许多地方变得干冷或洪水异常（“4.2 千年事件”）<br><b>社会</b>：内部冲突、中心之间的竞争<br>很可能多种因素叠加，各地不同。</div>`), b(1) + .5, b(2));
  show(c, card(1380, 170, 440, `<div class="k">下一集</div><h3>从西边来的东西</h3><div class="p" style="font-size:22px">小麦、牛羊、青铜，以及二里头。</div>`), b(2) + 2, null);
});
