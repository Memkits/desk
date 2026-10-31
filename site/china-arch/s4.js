// 第四集 · 从西边来的东西
const EL = { lon: 112.689, lat: 34.693 };
const NW = at1(98, 38.5, 22, 32, 0);
S('d_open', c => {
  const { b, be, T } = c;
  mapScene(c, { view: [[0, { ...HOME, d: 44, tilt: 22 }], [T, NW]], year: [[0, -3000], [T, -2700]], era: '新石器时代晚期', cults: true, links: false });
  opening(c, '第四集 · 从西边来的东西', be(0) - 2); credit(c);
});
S('d_wheat', c => {
  const { b, be, T } = c; c.head('01', '小麦和大麦');
  mapScene(c, { view: [[0, NW], [b(0) + 2, at1(90, 39, 30, 30, 0)], [be(0), at1(92, 39, 28, 30, 4)], [b(1) + 3, at1(112, 36.5, 22, 32, 0)], [be(1), at1(114, 36.5, 20, 32, 4)], [T, at1(108, 37, 30, 30, 0)]],
    year: [[0, -2800], [be(0), -2300], [b(1), -2650], [be(1), -2300], [T, -2200]], era: '约公元前 2600 年', cults: false, links: [[0, ['西来']], [b(1), ['西来', '小麦向东']]],
    focus: [[0, null], [b(1) + 2, 'zhaojiazhuang']], labelOnly: [[0, ['xichengyi', 'lajia']], [b(1), ['zhaojiazhuang', 'xichengyi', 'lajia']]],
    pins: [{ lon: 44, lat: 35, lab: '新月沃地 →', a: 0 }] });
  show(c, card(1380, 170, 440, `<div class="k">起点</div><div class="p" style="font-size:22px">小麦、大麦约一万年前在西亚<b>新月沃地</b>被驯化，经中亚、新疆、河西走廊进入甘青。</div>`), b(0) + 1, b(1));
  siteCard(c, 'zhaojiazhuang', b(1) + 3, b(2), '直接测年：约公元前 2600 年，小麦已出现在山东胶州。东边并不比西北晚多少：可能是多条路线、多次传入。');
  show(c, card(1380, 170, 440, `<div class="k">很久以后才成为主粮</div><div class="p" style="font-size:22px">整粒蒸煮口感不好。汉代以后石磨普及、磨成面粉，小麦才逐渐成为北方主粮。</div>`), b(2) + .5, null);
});
S('d_cattle', c => {
  const { b, be, T } = c; c.head('02', '牛、羊和冶铜');
  const xc = dive('xichengyi', 2.2, 34, 0), lj = dive('lajia', .22, 34, 0);
  mapScene(c, { view: [[0, at1(108, 37, 30, 30, 0)], [b(0) + 3, at1(101, 38, 16, 32, 0)], [b(1) + 2, xc], [be(1), { ...xc, head: 8 }], [b(2) + 3, { ...lj, d: .5 }], [b(2) + 6, lj], [T, { ...lj, d: .3, head: 6 }]],
    year: [[0, -2200], [b(1), -2000], [b(2), -1950], [T, -1900]], era: '齐家文化时期', cults: [[0, ['齐家文化', '马家窑文化']], [b(2) + 2, false]], links: [[0, ['西来']], [b(2), false]],
    focus: [[0, null], [b(1), 'xichengyi'], [b(2), 'lajia']], dot: [[0, 1.2], [b(2) + 4, .6]], labelOnly: [[0, ['xichengyi', 'lajia']]],
    close: { lajia: [[b(2) + 2, 0], [b(2) + 4, 1]] } });
  show(c, card(1380, 170, 440, `<div class="k">黄牛 · 绵羊</div><div class="p" style="font-size:22px">提供奶、毛和肉，适合干旱的草原和高原。黄土高原北部和河西走廊，畜牧比重越来越大。</div>`), b(0) + 1, b(1));
  siteCard(c, 'xichengyi', b(1) + 2, b(2), '四千多年前的冶铜遗存：矿石、炉渣、炉壁和铜器。齐家文化已能制作铜刀、铜镜等小件铜器。');
  siteCard(c, 'lajia', b(2) + 4, null, '齐家文化村落，约 4000 年前毁于地震和随后的洪水。房子里留下倒地的人，像瞬间定格的现场。');
});
S('d_dna', c => {
  const { b, be, T } = c; c.head('03', '是人来了，还是东西来了？');
  const mg = dive('mogou', 5, 34, 0);
  mapScene(c, { view: [[0, dive('lajia', .3, 34, 6)], [b(0) + 4, mg], [be(1), { ...mg, head: 10 }], [b(2) + 1, at1(100, 38.5, 22, 32, 0)], [T, at1(102, 37, 22, 32, -4)]],
    year: [[0, -1900], [b(0) + 2, -1600], [b(2), -1600], [T, -1500]], era: '距今 4700—3000 年', cults: false, links: [[0, false], [b(2), ['西来']]], focus: 'mogou', labelOnly: ['mogou', 'xichengyi', 'lajia'] });
  show(c, card(1380, 170, 440, `<div class="k">《细胞》· 2026 年 9 月</div><div class="p" style="font-size:22px">甘肃 <b>11</b> 个遗址、<b>149</b> 个古人类基因组，距今 4700—3000 年；其中 95 例来自磨沟。</div>`), b(0) + 1, null);
  show(c, det(1380, 410, 440, '结果', '基因主体仍是东亚北方人群，<b>没有检测到西方人群成分</b>。驯化动植物与青铜，更可能是一站一站传进来的。'), b(1) + .5, null);
});
S('d_elt', c => {
  const { b, be, T } = c; c.head('04', '二里头：王朝的都城');
  const e = { ...EL, d: .2, tilt: 34, head: 0 };
  mapScene(c, { view: [[0, at1(102, 37, 22, 32, -4)], [b(0) + 5, { ...e, d: .5 }], [be(0), e], [be(1), { ...e, d: .1, head: 10 }], [be(2), { ...e, d: .14, head: 4 }], [T, { ...e, d: .2, head: 0 }]],
    year: [[0, -1500], [b(0) + 3, -1750], [T, -1650]], era: '二里头文化', focus: 'erlitou', cults: false, links: [[0, ['西来', '铜']], [b(0) + 3, false]], dot: [[0, 1.2], [b(0) + 5, .5]], labels: [[0, 1], [b(0) + 6, 0]],
    close: { erlitou: [[b(0) + 3, 0], [b(0) + 5, 1]] },
    boxes: [{ ...EL, w: 2.0, h: 1.5, lab: '遗存范围 约 300 万平方米', pos: 'bottom', a: [[b(1), 0], [b(1) + 1, 1]], col: '#8ff0b4', fill: 'rgba(0,0,0,0)' },
      { ...EL, w: .3, h: .36, lab: '宫城', a: [[b(1) + 3, 0], [b(1) + 4, 1]] }] });
  siteCard(c, 'erlitou', b(0) + 5, b(1));
  show(c, det(1380, 170, 440, '示意', '方框按公布的数据画出，<b>不是</b>实测边界。'), b(1) + 1, b(2));
  // 块范法示意
  const cv = c.el(`<canvas class="abs" width="520" height="360" style="left:1340px;top:170px;z-index:5"></canvas>`), g = cv.getContext('2d'); c.in(cv, b(2) + .5); c.out(cv, b(3));
  c.tick(t => { const u = clamp((t - b(2) - 1) / 6); g.clearRect(0, 0, 520, 360); g.fillStyle = 'rgba(8,12,22,.88)'; g.fillRect(0, 0, 520, 360); g.font = '600 20px Inter,sans-serif'; g.fillStyle = '#ffd27a'; g.fillText('块范法（示意）', 20, 34);
    const cx = 260, cy = 200, sp = 70 * (1 - Math.min(1, u * 2)); g.fillStyle = '#8f6a3c';
    g.fillRect(cx - 120 - sp, cy - 90, 40, 180); g.fillRect(cx + 80 + sp, cy - 90, 40, 180); g.fillStyle = '#6b5a45'; g.fillRect(cx - 50, cy - 70, 100, 150);
    if (u > .5) { const f = clamp((u - .5) * 2); g.fillStyle = '#ffb25c'; g.fillRect(cx - 80, cy + 80 - f * 170, 30, f * 170); g.fillRect(cx + 50, cy + 80 - f * 170, 30, f * 170); }
    g.fillStyle = '#a3aec3'; g.fillText('外范', cx - 150 - sp, cy + 120); g.fillText('外范', cx + 80 + sp, cy + 120); g.fillText('范芯', cx - 20, cy + 110); if (u > .5) { g.fillStyle = '#ffb25c'; g.fillText('浇入铜液', cx - 40, 70); } });
  show(c, card(1380, 170, 440, `<div class="k">权力的象征</div><div class="p" style="font-size:22px">西北传来的铜，在这里铸成祭祀和宴饮用的<b>礼器</b>：爵、鼎。</div>`), b(3) + .2, null);
});
S('d_road', c => {
  const { b, be, T } = c; c.head('05', '宫殿与道路');
  const e = { ...EL, d: .1, tilt: 30, head: 0 };
  mapScene(c, { view: [[0, { ...EL, d: .2, tilt: 34, head: 0 }], [b(0) + 3, e], [T, { ...e, d: .13, head: 8 }]],
    year: [[0, -1650], [T, -1600]], era: '二里头文化', focus: 'erlitou', cults: false, links: false, dot: .5, labels: 0,
    close: { erlitou: 1 },
    boxes: [{ ...EL, w: .3, h: .36, lab: '宫城', pos: 'in', a: 1 },
      { lon: EL.lon - .0005, lat: EL.lat + .0019, w: .74, h: .02, lab: '', a: [[b(0) + 1, 0], [b(0) + 2, 1]], col: '#ff9a6b', dash: '0', fill: 'rgba(255,154,107,.5)' },
      { lon: EL.lon - .0005, lat: EL.lat - .0019, w: .74, h: .02, lab: '', a: [[b(0) + 1.5, 0], [b(0) + 2.5, 1]], col: '#ff9a6b', dash: '0', fill: 'rgba(255,154,107,.5)' },
      { lon: EL.lon + .0018, lat: EL.lat + .001, w: .02, h: .56, lab: '', a: [[b(0) + 2, 0], [b(0) + 3, 1]], col: '#ff9a6b', dash: '0', fill: 'rgba(255,154,107,.5)' },
      { lon: EL.lon - .0018, lat: EL.lat + .0015, w: .02, h: .66, lab: '', a: [[b(0) + 2.5, 0], [b(0) + 3.5, 1]], col: '#ff9a6b', dash: '0', fill: 'rgba(255,154,107,.5)' }] });
  show(c, det(1380, 170, 440, '道路示意', '宫殿区南北两侧道路各向西延伸至少 440 米，超过宫殿区约 295 米的宽度；两侧有平行的夯土墙。位置为示意。'), b(0) + 1, null);
  show(c, card(1380, 460, 440, `<div class="p" style="font-size:22px"><b>宫城居中、显贵拱卫</b>：祭祀区、官营作坊区、贵族居住区和墓地各在其位。中国古代都城规划的源头之一。</div>`), b(1) + .5, null);
});
S('d_xinzhai', c => {
  const { b, be, T } = c; c.head('06', '从新砦到二里头');
  mapScene(c, { view: [[0, { ...EL, d: .13, tilt: 30, head: 8 }], [b(0) + 3, at1(113.1, 34.55, 2.2, 32, 0)], [be(0), at1(113.1, 34.55, 2.4, 32, 6)], [b(1) + 2, at1(112, 35.5, 14, 32, 0)], [T, at1(112, 35.5, 16, 32, -4)]],
    year: [[0, -1600], [b(0) + 1, -1820], [be(0), -1780], [b(1), -2200], [T, -1650]], era: '龙山晚期 → 二里头', cults: false, links: false, close: { erlitou: [[0, 1], [2, 0]] },
    focus: [[0, 'xinzhai'], [b(1), null]], labelOnly: [[0, ['xinzhai', 'erlitou', 'wangchenggang']], [b(1), ['taosi', 'shimao', 'erlitou', 'xinzhai']]] });
  siteCard(c, 'xinzhai', b(0) + 2, b(1));
  show(c, card(1380, 170, 440, `<div class="k">一两百年</div><div class="p" style="font-size:22px">陶寺、石峁衰落之后，中原从满天星斗中的一颗，变成了影响最广的中心。</div>`), b(1) + 1, null);
});
S('d_dragon', c => {
  const { b, be, T } = c; c.head('07', '绿松石龙');
  mapScene(c, { view: [[0, at1(112, 35.5, 16, 32, -4)], [b(0) + 3, { ...EL, d: .3, tilt: 32, head: 0 }], [be(0), { ...EL, d: .25, tilt: 32, head: 8 }], [b(1) + 3, at1(112.5, 32.5, 18, 32, 0)], [T, at1(112.5, 32.5, 20, 32, -4)]],
    year: [[0, -1650], [b(1), -1600], [T, -1550]], era: '二里头文化', focus: 'erlitou', cults: [[0, false], [b(1), ['二里头文化']]], links: false, dot: [[0, 1.2], [b(0) + 3, .6], [b(1), 1.2]], labels: [[0, 1], [b(0) + 2, 0], [b(1) + 2, 1]],
    close: { erlitou: [[b(0) + 1, 0], [b(0) + 3, 1], [be(0), 1], [b(1) + 2, 0]] } });
  // 绿松石龙示意：由小方块拼成的弯曲长条
  const cv = c.el(`<canvas class="abs" width="520" height="300" style="left:1340px;top:170px;z-index:5"></canvas>`), g = cv.getContext('2d'); c.in(cv, b(0) + 1); c.out(cv, b(1) + 1);
  c.tick(t => { const n = Math.floor(clamp((t - b(0) - 1) / 6) * 2000); g.clearRect(0, 0, 520, 300); g.fillStyle = 'rgba(8,12,22,.88)'; g.fillRect(0, 0, 520, 300); g.fillStyle = '#ffd27a'; g.font = '600 20px Inter,sans-serif'; g.fillText(`两千多片绿松石 · 长约 70 厘米（示意）  ${n}`, 20, 32);
    let r = 7; for (let i = 0; i < n; i++) { r = (r * 16807) % 2147483647; const u = (i % 400) / 400, w = Math.floor(i / 400), x = 50 + u * 420, y = 170 + Math.sin(u * 7) * 40 + (w - 2) * 9 * (1 - Math.abs(u - .1) * .6); g.fillStyle = `hsl(${168 + (r % 20)},${45 + (r % 30)}%,${42 + (r % 22)}%)`; g.fillRect(x, y, 3, 3); } });
  show(c, card(1380, 170, 440, `<div class="k">夏？</div><div class="p" style="font-size:22px">许多学者认为二里头是夏王朝晚期都城，但还没有能自证身份的文字，仍是学术推论。<br>二里头风格的铜器、玉器在长江流域甚至更远处都有发现。</div>`), b(1) + 1, null);
});
S('d_end', c => {
  const { b, be, T } = c; c.head('08', '小结');
  mapScene(c, { view: [[0, at1(112.5, 32.5, 20, 32, -4)], [b(0) + 3, { ...HOME, d: 40, tilt: 30 }], [T, { ...HOME, d: 38, tilt: 34, head: -6 }]], year: [[0, -1550], [b(0) + 1, -2800], [be(0), -1550], [T, -1550]], era: '', cults: true, links: true });
  ['小麦、大麦 · 约公元前 2600 年', '黄牛、绵羊', '冶铜：经河西走廊东传', '二里头：宫城、道路网、铸铜作坊'].forEach((s, i) => show(c, card(1380, 170 + i * 104, 440, `<b style="font:700 24px var(--serif)">${s}</b>`), b(0) + 1 + i * 1.4, b(1)));
  show(c, card(1380, 300, 440, `<div class="k">下一集</div><h3>青铜王朝到秦汉</h3><div class="p" style="font-size:22px">商的都城、长江边的铜矿、三星堆，一直到丝绸之路。</div>`), b(1) + .5, null);
});
