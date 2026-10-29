// 第四集 · 化学反应（下）
S('d_open', c => {
  const { b, be } = c;
  const v = glv(c, 560, 150, 1300, 820, { at: .1 }), R = rxView(v, 'sn2', { zoom: 2.3 });
  const T0 = 2, per = 13; v.upd.push(t => { const k = ((t - T0) % per + per) % per, u = t < T0 ? 0 : SS(k, 2, 8) * (1 - SS(k, 11, 12.6)); R.set(u, 'pts', t); });
  show(c, at(100, 230, 640, `<div style="font:600 24px var(--sans);letter-spacing:.3em;color:var(--fg3)">电子云 · 第四集</div><div style="font:900 120px/1.1 var(--serif);margin-top:10px">化学反应</div><div style="font:700 44px var(--serif);color:var(--fg2);margin-top:6px">电子云怎么流动（下）</div>`), .2, be(0));
  show(c, card(100, 600, 560, `<div class="k">这一集的例子</div><ul class="pl"><li><b>键的断裂</b>：Cl₂、HCl、Cl· + CH₄</li><li><b>有机反应</b>：加溴、SN2、负氢加成、互变异构、狄尔斯–阿尔德</li><li><b>特殊情况</b>：苯、金属钠、光激发、氢键</li></ul>`), b(0) + 4, be(0));
  show(c, card(100, 220, 600, `<div class="k">画法同上一集</div><ul class="pl"><li>只画<b>价电子</b></li><li>颜色：电子<b>原来属于哪个原子</b>，或<b>属于哪类电子对</b></li><li>过程是<b>示意</b>，不是真实路径</li></ul><div class="legend" style="margin-top:14px">${R.legend()}</div>`), b(1) + .2, null);
});
S('c_cl2', c => { rxScene(c, 'cl2', { alt: 'slice' }); show(c, det(70, 820, 560, '数据', 'Cl–Cl 键能约 243 kJ/mol'), c.b(1) + 1, null); });
S('c_hcl', c => { rxScene(c, 'hcl', { cm: 'k', alt: 'solid' }); });
S('c_ch4cl', c => { rxScene(c, 'ch4cl', { alt: 'solid' }); });
S('c_br2', c => { rxScene(c, 'c2h4br2', { alt: 'solid', note: '简化：真实反应先形成三元环溴鎓离子，分两步完成；这里画成一步。只画参与反应的电子。' }); });
S('c_sn2', c => { rxScene(c, 'sn2', { alt: 'solid', note: '只画参与反应的电子：C–H、C–Br、O 的孤对电子和 O–H；溴的其余孤对电子隐藏' }); });
S('c_hco', c => { rxScene(c, 'hco', { alt: 'slice', note: '只画参与反应的电子；截面取在过 C、O 和进攻氢的竖直平面' }); });
S('c_keto', c => { rxScene(c, 'keto', { alt: 'slice', note: '只画参与反应的电子；截面取在分子平面上方 0.7 Å，π 电子在这里最密' }); });
S('c_da', c => { rxScene(c, 'da', { alt: 'solid' }); });
S('c_benz', c => { rxScene(c, 'benz', { alt: 'slice', note: '只画 6 个 π 电子；截面取在环平面上方 0.75 Å' }); show(c, det(70, 820, 560, '数据', 'C–C 键长均为 1.39 Å · 离域稳定化约 150 kJ/mol'), c.b(0) + 8, null); });
S('c_na4', c => { rxScene(c, 'na4', { alt: 'shell' }); });
S('c_uv', c => { rxScene(c, 'uv', { alt: 'slice', note: '只画 π 电子；截面取在分子平面上方 0.7 Å' }); });
S('c_hb', c => { rxScene(c, 'hb', { cm: 'k', alt: 'slice' }); show(c, det(70, 820, 600, '数据', 'O···O 约 2.9 Å · 氢键约 20 kJ/mol · O–H 共价键约 460 kJ/mol'), c.b(1) + 1, null); });
S('c_end', c => {
  const { b, be } = c; c.head('13', '总结');
  const R1 = [['给出电子', '孤对电子 · π 键 · 金属的外层电子', 'var(--f)'], ['接受电子', '质子 · 空轨道 · 带部分正电的原子', 'var(--gold)'], ['断键方式', '均裂：一人一个 · 异裂：整对给一方', 'var(--p)']];
  R1.forEach(([h, s, col], i) => show(c, card(100 + i * 580, 230, 540, `<div class="k" style="color:${col}">${['规律一', '规律一', '规律二'][i]}</div><h3>${h}</h3><div class="p">${s}</div>`), .4 + i * .5, be(0) + .3));
  const v = glv(c, 100, 200, 1000, 720, { at: b(1) }), R = rxView(v, 'sn2', { zoom: 2.3 });
  v.upd.push(t => { const k = ((t - b(1)) % 11 + 11) % 11, u = SS(k, 1.5, 6.5) * (1 - SS(k, 9, 10.5)); R.set(u, 'pts', t); });
  show(c, card(1160, 260, 660, `<div class="k">规律三</div><h3>原子核跟着电子云走</h3><div class="p">电子重新排好，原子核才挪到新位置，分子的形状随之改变。<br><br>弯箭头、共振式、杂化，都是描述电子云流动的简写。</div>`), b(1) + .5, be(1) + .3);
  show(c, at(100, 300, 1720, `<div class="bigq">谢谢观看</div><div class="p" style="text-align:center;margin-top:30px">配套互动网页：任选元素和反应，切换点云、包络面和截面，自己转着看</div>`), b(2) + .5, null);
  c.out(v.el, b(2) + .2);
});
