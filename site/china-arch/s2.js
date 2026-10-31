// 第二集 · 稻与粟
const NEO = '新石器时代';
S('b_open', c => {
  const { b, be, T } = c;
  mapScene(c, { view: [[0, { ...HOME, d: 44, tilt: 22 }], [T, { ...HOME, d: 36, tilt: 34, head: -6 }]], year: [[0, -12000], [T, -9000]], era: NEO, cults: false, links: false });
  opening(c, '第二集 · 稻与粟', be(0) - 2); credit(c);
});
S('b_rice', c => {
  const { b, be, T } = c; c.head('01', '长江下游：稻的故乡');
  const ss_ = dive('shangshan', .22), kh = dive('kuahuqiao', .22, 34, 8), hm = dive('hemudu', .22, 34, -6);
  mapScene(c, { view: [[0, { ...HOME, d: 36, tilt: 34, head: -6 }], [b(0) + 4, { ...ss_, d: .5 }], [be(0), ss_], [be(1), { ...ss_, head: 8 }], [b(2) + 3, kh], [b(2) + 8, { ...kh, d: .5 }], [b(2) + 12, hm], [T, { ...hm, d: .4, head: 4 }]],
    year: [[0, -9000], [b(0) + 3, -8500], [be(1), -7000], [b(2) + 3, -6000], [b(2) + 11, -5000], [T, -4800]], era: NEO, cults: false, links: false,
    focus: [[0, 'shangshan'], [b(2) + 2, 'kuahuqiao'], [b(2) + 10, 'hemudu']], dot: [[0, 1.2], [b(0) + 4, .6]],
    close: { shangshan: [[b(0) + 2, 0], [b(0) + 4, 1]], kuahuqiao: [[b(2), 0], [b(2) + 2, 1]], hemudu: [[b(2) + 9, 0], [b(2) + 11, 1]] } });
  siteCard(c, 'shangshan', b(0) + 4, b(2));
  show(c, det(1380, 520, 440, '夹炭陶', '陶胎里掺碾碎的稻壳和稻叶：更轻，烧制时不易开裂。密集的稻壳说明收获已不少。'), b(0) + 6, b(1) + 1);
  siteCard(c, 'kuahuqiao', b(2) + 2.5, b(2) + 10);
  siteCard(c, 'hemudu', b(2) + 10.5, null);
});
S('b_millet', c => {
  const { b, be, T } = c; c.head('02', '华北：粟和黍');
  const cs = dive('cishan', .22, 34, 4), jh = dive('jiahu', .22, 34, -6);
  mapScene(c, { view: [[0, dive('hemudu', .4, 34, 4)], [b(0) + 4, { ...cs, d: .5 }], [be(0), cs], [be(1), { ...cs, head: 10 }], [b(2) + 2, at1(116, 33, 18, 32, 0)], [be(2), at1(116, 33, 18, 32, -4)], [b(3) + 3, jh], [T, { ...jh, d: .4 }]],
    year: [[0, -4800], [b(0) + 2, -8000], [b(2), -7500], [b(2) + 3, -7000], [T, -6500]], era: NEO, links: [[0, false], [b(2), ['稻']]], cults: [[0, false], [b(2), ['磁山文化', '裴李岗文化', '上山文化']], [b(3), false]],
    focus: [[0, 'cishan'], [b(3) + 2, 'jiahu']], dot: [[0, 1.2], [b(0) + 4, .6], [b(2), 1.2], [b(3) + 3, .6]],
    close: { cishan: [[b(0) + 2, 0], [b(0) + 4, 1], [be(1), 1], [b(2) + 1, 0]], jiahu: [[b(3) + 1, 0], [b(3) + 3, 1]] } });
  siteCard(c, 'cishan', b(0) + 4, b(2));
  show(c, card(1380, 470, 440, `<div class="k">定居</div><div class="p" style="font-size:22px">半地穴式房子、石磨盘与石磨棒，养猪和狗。</div>`), b(1) + .5, b(2));
  show(c, card(1380, 170, 440, `<div class="k">两个中心</div><div class="p" style="font-size:22px"><b style="color:#8ff0b4">稻</b>：长江流域，水田<br><b style="color:#ffcf7a">粟、黍</b>：黄河流域，旱地，耐旱</div>`), b(2) + .5, b(3));
  siteCard(c, 'jiahu', b(3) + 3, null, '约 9000 年前：既有稻，也有<b>骨笛</b>（丹顶鹤翅骨钻孔，能吹出音阶）；陶器残留物显示用稻米、蜂蜜和水果酿造发酵饮料。');
});
S('b_yangshao', c => {
  const { b, be, T } = c; c.head('03', '仰韶：黄土高原上的村落');
  const bp = dive('banpo', .2, 34, 0);
  mapScene(c, { view: [[0, dive('jiahu', .4, 34, -6)], [b(0) + 4, { ...bp, d: .5 }], [be(0), bp], [be(1), { ...bp, head: 10 }], [b(2) + 3, at1(111, 36.5, 26, 32, 0)], [T, at1(111, 36.5, 28, 32, -4)]],
    year: [[0, -6500], [b(0) + 2, -4600], [b(2), -4200], [b(2) + 3, -4000], [T, -3400]], era: '仰韶文化', links: [[0, false], [b(2), ['彩陶']]], cults: [[0, false], [b(2), true]],
    focus: [[0, 'banpo'], [b(2), 'miaodigou']], dot: [[0, 1.2], [b(0) + 4, .6], [b(2), 1.2]],
    close: { banpo: [[b(0) + 2, 0], [b(0) + 4, 1], [be(1), 1], [b(2) + 1, 0]] } });
  siteCard(c, 'banpo', b(0) + 4, b(2));
  show(c, det(1380, 470, 440, '村落的秩序', '居住区居中，外围深沟；沟外东边是窑场，北边是墓地。'), b(1) + .5, b(2));
  show(c, det(1380, 170, 440, '弧线的含义', '不是某个人走过的路，而是这些地方发现了相似的<b>花瓣纹彩陶</b>，说明彼此有交流。'), b(2) + 3, null);
});
S('b_jade', c => {
  const { b, be, T } = c; c.head('04', '玉：从辽西到长江');
  const nh = dive('niuheliang', .22, 34, 0), lj = dive('lingjiatan', .22, 34, 0);
  mapScene(c, { view: [[0, at1(111, 36.5, 28, 32, -4)], [b(0) + 4, { ...nh, d: .5 }], [be(0), nh], [b(1) + 3, at1(118.5, 36.5, 18, 30, 0)], [b(1) + 7, lj], [be(1), { ...lj, d: .3 }], [b(2) + 3, at1(120.4, 42.4, 3, 32, 0)], [be(2), at1(120.4, 42.4, 3.4, 32, 6)], [b(3) + 2, at1(118.5, 36.5, 20, 30, 0)], [T, at1(118.5, 36.5, 20, 30, -4)]],
    year: [[0, -3400], [b(0) + 2, -3400], [b(1) + 3, -3300], [b(2) + 1, -6000], [be(2), -5800], [b(3) + 1, -3300], [T, -3200]], era: NEO, links: [[0, false], [b(1), ['玉']], [b(2), false], [b(3), ['玉']]], cults: [[0, false], [b(1), ['红山文化', '崧泽—良渚文化']], [b(2), ['兴隆洼文化']], [b(3), false]],
    focus: [[0, 'niuheliang'], [b(1) + 6, 'lingjiatan'], [b(2) + 1, 'xinglongwa'], [b(3), null]], dot: [[0, 1.2], [b(0) + 4, .6], [b(1), 1.2], [b(1) + 7, .6], [b(2), 1.2]],
    close: { niuheliang: [[b(0) + 2, 0], [b(0) + 4, 1], [be(0), 1], [b(1) + 1, 0]], lingjiatan: [[b(1) + 5, 0], [b(1) + 7, 1], [be(1), 1], [b(2) + 1, 0]] } });
  siteCard(c, 'niuheliang', b(0) + 4, b(1));
  siteCard(c, 'lingjiatan', b(1) + 7, b(2));
  siteCard(c, 'xinglongwa', b(2) + 2, b(3));
  show(c, card(1380, 170, 440, `<div class="k">等级</div><div class="p" style="font-size:22px">玉料来自远方，切磨要花很长时间。玉器集中在少数大墓里：社会开始分出等级。</div>`), b(3) + .5, null);
});
S('b_stars', c => {
  const { b, be, T } = c; c.head('05', '满天星斗');
  const dk = dive('dawenkou', 2.2, 32, 0), sh = dive('shuanghuaishu', .22, 34, 4), nz = dive('nanzuo', .22, 34, 0);
  mapScene(c, { view: [[0, at1(118.5, 36.5, 20, 30, -4)], [b(0) + 3, { ...HOME, d: 36, tilt: 32 }], [be(0), { ...HOME, d: 36, tilt: 32, head: -4 }], [b(1) + 3, dk], [be(1), { ...dk, head: 6 }], [b(2) + 2, { ...HOME, d: 34, tilt: 32 }], [be(2), { ...HOME, d: 34, tilt: 32, head: 4 }], [b(3) + 3, sh], [b(3) + 8, { ...sh, d: .5 }], [b(3) + 12, nz], [T, { ...nz, d: .4, head: 6 }]],
    year: [[0, -3200], [b(0) + 2, -3300], [T, -3000]], era: '约 5300 年前', cults: [[0, true], [b(3) + 2, false]], links: [[0, false], [b(3) + 12, ['资源']]], cultLabels: [[0, 1], [b(3), 0]],
    focus: [[0, null], [b(1) + 2, 'dawenkou'], [b(2), null], [b(3) + 2, 'shuanghuaishu'], [b(3) + 10, 'nanzuo']], dot: [[0, 1.2], [b(3) + 3, .6], [b(3) + 8, 1], [b(3) + 12, .6]],
    close: { shuanghuaishu: [[b(3) + 1, 0], [b(3) + 3, 1], [b(3) + 9, 1], [b(3) + 10, 0]], nanzuo: [[b(3) + 10, 0], [b(3) + 12, 1]] } });
  siteCard(c, 'dawenkou', b(1) + 3, b(2));
  show(c, card(1380, 170, 440, `<div class="k">苏秉琦</div><h3>满天星斗</h3><div class="p" style="font-size:22px">许多地区各自发展、不断交流，最后才汇聚在一起。</div>`), b(2) + .5, b(3) + 1);
  siteCard(c, 'shuanghuaishu', b(3) + 3, b(3) + 9);
  siteCard(c, 'nanzuo', b(3) + 12, null);
});
S('b_end', c => {
  const { b, be, T } = c; c.head('06', '小结');
  mapScene(c, { view: [[0, dive('nanzuo', .4, 34, 6)], [b(0) + 4, HOME], [T, { ...HOME, d: 36, tilt: 34, head: -6 }]], year: [[0, -3000], [b(0) + 1, -9000], [be(0), -3000], [T, -2900]], era: NEO, cults: true, links: true });
  ['稻（长江下游）· 粟黍（华北）', '村落变大、环壕与广场', '彩陶与玉器在各地流动', '大墓出现：社会分出等级'].forEach((s, i) => show(c, card(1380, 170 + i * 104, 440, `<b style="font:700 24px var(--serif)">${s}</b>`), b(0) + 1 + i * 1.4, b(1)));
  show(c, card(1380, 300, 440, `<div class="k">下一集</div><h3>城</h3><div class="p" style="font-size:22px">良渚的水坝、石峁的石城、陶寺的“观象台”。</div>`), b(1) + .5, null);
});
