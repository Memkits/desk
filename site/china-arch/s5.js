// 第五集 · 青铜王朝到秦汉
const BR = '青铜时代';
S('e_open', c => {
  const { b, be, T } = c;
  mapScene(c, { view: [[0, { ...HOME, d: 44, tilt: 22 }], [T, at1(113.5, 33, 20, 34, -4)]], year: [[0, -1700], [T, -1600]], era: BR, cults: true, links: false });
  opening(c, '第五集 · 青铜王朝到秦汉', be(0) - 2); credit(c);
});
S('e_zz', c => {
  const { b, be, T } = c; c.head('01', '郑州商城和南方的铜');
  const zz = dive('zhengzhou', .22, 34, 0), ZC = { lon: 113.6903, lat: 34.7522 };
  mapScene(c, { view: [[0, at1(113.5, 33, 20, 34, -4)], [b(0) + 4, { ...zz, d: .5 }], [b(0) + 7, zz], [be(0), { ...zz, head: 8 }], [b(1) + 4, at1(114.5, 32.5, 9, 32, 0)], [T, at1(114.5, 32.5, 10, 32, 6)]],
    year: [[0, -1600], [b(0) + 3, -1550], [b(1), -1500], [T, -1350]], era: '商代早期', cults: false, links: [[0, false], [b(1) + 2, ['铜']]],
    focus: [[0, 'zhengzhou'], [b(1) + 2, 'panlongcheng']], dot: [[0, 1.2], [b(0) + 5, .5], [b(1), 1.2]], labelOnly: [[0, ['zhengzhou']], [b(1), ['zhengzhou', 'panlongcheng', 'tonglushan']]], labels: [[0, 1], [b(0) + 6, 0], [b(1), 1]],
    close: { zhengzhou: [[b(0) + 2, 0], [b(0) + 4, 1], [be(0), 1], [b(1) + 2, 0]] },
    boxes: [{ ...ZC, w: 1.7, h: 1.8, lab: '内城 约 300 万平方米（示意）', a: [[b(0) + 6, 0], [b(0) + 7, 1], [be(0), 1], [b(1) + 1, 0]] }] });
  siteCard(c, 'zhengzhou', b(0) + 5, b(1), '约公元前 1600 年开始营建，商代早期都城。内城周长近 7 公里；近年发现大型仓储建筑、早商最大的水系遗存和铸铜作坊。');
  show(c, card(1380, 170, 440, `<div class="k">铜、锡、铅</div><div class="p" style="font-size:22px">中原铜矿不多。<b>铜绿山</b>：商周到汉代的大型铜矿。<b>盘龙城</b>：商在长江边的据点，扼守铜料北运之路。</div>`), b(1) + 1, null);
});
S('e_yx', c => {
  const { b, be, T } = c; c.head('02', '殷墟：文字和马车');
  const yx = dive('yinxu', .2, 34, 0);
  mapScene(c, { view: [[0, at1(114.5, 32.5, 10, 32, 6)], [b(0) + 4, { ...yx, d: .5 }], [be(0), yx], [be(2), { ...yx, d: .16, head: 12 }], [b(3) + 3, at1(108, 41, 20, 32, 0)], [T, at1(110, 40, 20, 32, -4)]],
    year: [[0, -1350], [b(0) + 2, -1250], [be(2), -1200], [b(3), -1200], [T, -1150]], era: '商代晚期', cults: false, links: [[0, ['铜']], [b(0) + 2, false], [b(3) + 1, ['车']]],
    focus: 'yinxu', dot: [[0, 1.2], [b(0) + 4, .5], [b(3), 1.2]], labels: [[0, 1], [b(0) + 5, 0], [b(3) + 2, 1]],
    close: { yinxu: [[b(0) + 2, 0], [b(0) + 4, 1], [be(2), 1], [b(3) + 2, 0]] } });
  siteCard(c, 'yinxu', b(0) + 4, b(1), '约公元前 1300 年迁都于此，统治约 255 年，到公元前 1046 年被周灭亡。');
  show(c, card(1380, 170, 440, `<div class="k">甲骨文</div><div class="p" style="font-size:22px">龟甲、牛肩胛骨上钻孔、烧灼，看裂纹判断吉凶，再把问题和结果刻上去。中国已知最早的成体系文字。</div>`), b(1) + .5, b(2));
  show(c, card(1380, 170, 440, `<div class="k">妇好墓</div><div class="p" style="font-size:22px">唯一保存完整的商代王室成员墓。妇好是商王武丁的妻子，在甲骨文里领兵作战。</div>`), b(2) + .5, b(3));
  show(c, det(1380, 170, 440, '车马坑', '两马一车，轮有几十根辐条。殷墟晚期突然出现，此前中原没有发展过程：很可能从北方草原传入。'), b(3) + .5, null);
});
S('e_sxd', c => {
  const { b, be, T } = c; c.head('03', '三星堆：另一种青铜文明');
  const sx = dive('sanxingdui', .2, 34, 0);
  mapScene(c, { view: [[0, at1(110, 40, 20, 32, -4)], [b(0) + 4, { ...sx, d: .5 }], [be(0), sx], [be(2), { ...sx, head: 10 }], [b(3) + 3, at1(109, 33.5, 16, 32, 0)], [b(3) + 10, at1(109, 33.5, 16, 32, 6)], [T, dive('jinsha', .5, 32, 0)]],
    year: [[0, -1150], [b(0) + 2, -1200], [b(2), -1150], [b(3) + 8, -1100], [T, -900]], era: '商代晚期', cults: false, links: [[0, false], [b(3) + 2, ['铜']]],
    focus: [[0, 'sanxingdui'], [b(3) + 10, 'jinsha']], dot: [[0, 1.2], [b(0) + 4, .5], [b(3), 1.2]], labels: [[0, 1], [b(0) + 5, 0], [b(3), 1]], labelOnly: [[0, ['sanxingdui']], [b(3), ['sanxingdui', 'yinxu', 'jinsha', 'tonglushan']]],
    close: { sanxingdui: [[b(0) + 2, 0], [b(0) + 4, 1], [be(2), 1], [b(3) + 2, 0]], jinsha: [[b(3) + 10, 0], [T - 1, 1]] } });
  siteCard(c, 'sanxingdui', b(0) + 4, b(1), '广汉，鸭子河南岸。城址约公元前 1600 年建立，面积约 3.6 平方公里。');
  show(c, card(1380, 170, 440, `<div class="k">1986 · 2019—2022</div><div class="p" style="font-size:22px">青铜面具、立人、神树；新发现六座坑：金面具、龟背形网格器、顶尊跪坐人像等上万件文物。</div>`), b(1) + .5, b(2));
  show(c, det(1380, 170, 440, '碳十四 · 2025 年发布', '三、四、六、八号坑的埋藏年代：<b>公元前 1201—前 1012 年</b>（95.4% 概率），与殷墟同时。'), b(2) + .5, b(3));
  show(c, card(1380, 170, 440, `<div class="k">与商的联系</div><div class="p" style="font-size:22px">中原式的尊和罍；铅同位素显示，三星堆与殷墟部分青铜器用了特征相同的一类铅料。之后，成都<b>金沙</b>延续了这一文明。</div>`), b(3) + 1, null);
});
S('e_zhou', c => {
  const { b, be, T } = c; c.head('04', '周到战国');
  const zy = dive('zhouyuan', .22, 34, 0);
  mapScene(c, { view: [[0, dive('jinsha', .5, 32, 0)], [b(0) + 4, { ...zy, d: .5 }], [be(0), zy], [b(1) + 3, dive('zenghouyi', .6, 32, 0)], [b(1) + 9, at1(112, 35, 22, 32, 0)], [T, at1(112, 35, 24, 32, -4)]],
    year: [[0, -900], [b(0) + 1, -1046], [be(0), -900], [b(1) + 2, -433], [b(1) + 9, -350], [T, -300]], era: [[0, '西周'], [b(1), '东周']], cults: [[0, false], [b(1) + 8, ['周']]], links: false,
    focus: [[0, 'zhouyuan'], [b(1) + 2, 'zenghouyi'], [b(1) + 8, null]], dot: [[0, 1.2], [b(0) + 4, .6], [b(1), 1]],
    close: { jinsha: [[0, 1], [2, 0]], zhouyuan: [[b(0) + 2, 0], [b(0) + 4, 1], [be(0), 1], [b(1) + 1, 0]], zenghouyi: [[b(1) + 2, 0], [b(1) + 3, 1], [b(1) + 8, 1], [b(1) + 9, 0]] } });
  siteCard(c, 'zhouyuan', b(0) + 4, b(1), '周人的发祥地。大量青铜器窖藏，许多铜器铸有长篇铭文：赏赐、战争、诉讼。');
  siteCard(c, 'zenghouyi', b(1) + 3, b(1) + 9);
  show(c, card(1380, 170, 440, `<div class="k">战国</div><div class="p" style="font-size:22px">铁器普及，各国修筑长城，互相兼并。</div>`), b(1) + 9.5, null);
});
S('e_qin', c => {
  const { b, be, T } = c; c.head('05', '秦始皇陵');
  const q = { lon: 109.2539, lat: 34.3817, d: .1, tilt: 30, head: 0 };
  mapScene(c, { view: [[0, at1(112, 35, 24, 32, -4)], [b(0) + 4, { ...q, d: .5 }], [be(0), q], [b(1) + 2, { ...q, lon: q.lon + .008, d: .08, head: 8 }], [T, { ...q, lon: q.lon + .008, d: .12, head: 4 }]],
    year: [[0, -300], [b(0) + 2, -221], [T, -208]], era: '秦', focus: 'qinling', cults: false, links: false, dot: [[0, 1.2], [b(0) + 4, .4]], labels: [[0, 1], [b(0) + 5, 0]],
    close: { qinling: [[b(0) + 2, 0], [b(0) + 4, 1]] },
    pins: [{ lon: 109.2539, lat: 34.3817, lab: '封土', a: [[b(0) + 5, 0], [b(0) + 6, 1]] }, { lon: 109.273, lat: 34.385, lab: '兵马俑坑（东约 1.5 公里）', a: [[b(1), 0], [b(1) + 1, 1]] }] });
  siteCard(c, 'qinling', b(0) + 5, b(1), '公元前 221 年秦统一六国。陵墓从公元前 246 年嬴政即位开始修建，封土高 76 米。');
  show(c, card(1380, 170, 440, `<div class="k">兵马俑</div><div class="p" style="font-size:22px">数千件真人大小的陶俑和陶马，面容各不相同；原本有鲜艳彩绘，出土后大多褪色。<br>地宫至今没有发掘。</div>`), b(1) + .5, null);
});
S('e_silk', c => {
  const { b, be, T } = c; c.head('06', '丝绸之路');
  const xq = dive('xuanquanzhi', .22, 34, 0);
  mapScene(c, { view: [[0, { lon: 109.262, lat: 34.3817, d: .12, tilt: 30, head: 4 }], [b(0) + 4, at1(100, 38.5, 22, 32, 0)], [be(0), at1(100, 38.5, 22, 32, -4)], [b(1) + 3, { ...xq, d: .5 }], [b(1) + 6, xq], [b(2), { ...xq, d: .4 }], [b(2) + 4, at1(92, 39, 34, 30, 0)], [T, at1(92, 39, 36, 30, -4)]],
    year: [[0, -208], [b(0) + 2, -138], [b(1), -111], [b(2) + 2, 0], [T, 150]], era: '汉', cults: false, links: [[0, false], [b(0) + 2, ['丝路']], [b(2) + 3, ['丝路', '西来']]],
    focus: [[0, null], [b(1) + 2, 'xuanquanzhi'], [b(2) + 3, null]], dot: [[0, 1.2], [b(1) + 5, .5], [b(2) + 3, 1.2]], labelOnly: [[0, ['xichengyi', 'xuanquanzhi']]], force: ['西来'], forceA: [[b(2) + 3, 0], [b(2) + 4.5, 1]],
    close: { qinling: [[0, 1], [2, 0]], xuanquanzhi: [[b(1) + 3, 0], [b(1) + 5, 1], [b(2) + 1, 1], [b(2) + 3, 0]] },
    pins: [{ lon: 102.6, lat: 37.9, lab: '武威', a: [[b(0) + 3, 0], [b(0) + 4, 1], [b(1) + 2, 1], [b(1) + 3, 0]] }, { lon: 100.45, lat: 38.93, lab: '张掖', a: [[b(0) + 3.4, 0], [b(0) + 4.4, 1], [b(1) + 2, 1], [b(1) + 3, 0]] }, { lon: 98.5, lat: 39.73, lab: '酒泉', a: [[b(0) + 3.8, 0], [b(0) + 4.8, 1], [b(1) + 2, 1], [b(1) + 3, 0]] }, { lon: 94.66, lat: 40.14, lab: '敦煌', a: [[b(0) + 4.2, 0], [b(0) + 5.2, 1], [b(1) + 2, 1], [b(1) + 3, 0]] }] });
  show(c, card(1380, 170, 440, `<div class="k">河西四郡</div><div class="p" style="font-size:22px">张骞两次出使西域之后，汉朝在河西走廊设武威、张掖、酒泉、敦煌四郡。</div>`), b(0) + 1, b(1));
  siteCard(c, 'xuanquanzhi', b(1) + 5, b(2), '敦煌以东的汉代驿站，出土数万枚简牍：往来的使者、商人和官员，有的来自遥远的中亚。');
  show(c, det(1380, 170, 440, '同一条走廊', '四千多年前：小麦、牛羊、冶金（金色）<br>两千年前：丝绸、使者、商队（浅金）'), b(2) + 3, null);
});
S('e_end', c => {
  const { b, be, T } = c; c.head('07', '尾声');
  mapScene(c, { view: [[0, at1(92, 39, 36, 30, -4)], [b(0) + 3, { ...HOME, d: 40, tilt: 30 }], [be(0), { ...HOME, d: 38, tilt: 34, head: -6 }], [T, { lon: 104, lat: 30, d: 70, tilt: 10, head: 0 }]],
    year: [[0, 150], [b(0) + 1, -2200000], [be(0), 200], [T, 200]], era: '', cults: true, links: true });
  show(c, card(1380, 170, 440, `<div class="k">还在更新</div><div class="p" style="font-size:22px">丹尼索瓦人有了脸；三星堆的年代更精确了；古基因揭示了谁和谁有亲缘。几年以后，这张地图上的某些点和线也许要重画。</div>`), b(1) + .5, b(2));
  show(c, card(1380, 170, 440, `<div class="k">互动地图</div><div class="p" style="font-size:22px">在简介里打开互动地图，自己拖动时间轴，点开每一个遗址。</div><div class="p" style="margin-top:14px;font-size:24px"><b>谢谢观看</b></div>`), b(2) + .5, null);
});
