// 第三集 · 化学反应（上）
S('c_open', c => {
  const { b, be } = c;
  const v = glv(c, 560, 150, 1300, 820, { at: .1 }), R = rxView(v, 'h2o', { zoom: 2.3 });
  const T0 = 2, per = 12; v.upd.push(t => { const k = ((t - T0) % per + per) % per, u = t < T0 ? 0 : SS(k, 2, 7) * (1 - SS(k, 10, 11.6)); R.set(u, 'pts', t); });
  show(c, at(100, 230, 640, `<div style="font:600 24px var(--sans);letter-spacing:.3em;color:var(--fg3)">电子云 · 第三集</div><div style="font:900 120px/1.1 var(--serif);margin-top:10px">化学反应</div><div style="font:700 44px var(--serif);color:var(--fg2);margin-top:6px">电子云怎么流动（上）</div>`), .2, be(0));
  show(c, card(100, 600, 560, `<div class="k">这一集的例子</div><ul class="pl"><li><b>共用电子</b>：H₂、HF、H₂O、CH₄、N₂、CO₂</li><li><b>交出电子</b>：NaCl、Fe、Zn 与 Cu²⁺</li><li><b>借出孤对电子</b>：NH₄⁺、H₃O⁺、中和、BF₃</li></ul>`), b(0) + 6, be(0));
  show(c, card(100, 200, 600, `<div class="k">画法</div><ul class="pl"><li>只画<b>价电子</b>，内层电子省略</li><li>每对电子画成一个轨道：<b>键</b>或<b>孤对电子</b></li><li>颜色：电子<b>原来属于哪个原子</b>，或<b>属于哪类电子对</b></li><li>过程是从反应前到反应后的<b>平滑过渡</b>，是示意，不是真实路径</li></ul><div class="legend" style="margin-top:14px">${R.legend()}</div>`), b(1) + .2, null);
  show(c, det(100, 760, 600, '近似方法', '斯莱特型原子轨道 + 杂化 + 定域键的线性组合，按 |ψ|² 采样成点。形状和趋势可信，键长取实验值，过渡过程为插值。'), b(1) + 9, null);
});
S('c_h2', c => {
  const { b, be } = c;
  rxScene(c, 'h2', { zoom: 2.2, segs: [[0, F(c, 0, .3), 'pts', 0, 0], [F(c, 0, .3), F(c, 0, .9), 'pts', 0, 1], [F(c, 0, .9), b(1) + 4, 'pts', 1, 1], [b(1) + 4, b(1) + 5, 'shell', 1, 1], [F(c, 1, .55), c.T, 'slice', 1, 1]] });
  show(c, det(70, 820, 560, '数据', 'H–H 键长 0.74 Å，键能 436 kJ/mol'), b(1) + .5, null);
});
S('c_hf', c => { rxScene(c, 'hf', { alt: 'slice' }); show(c, det(70, 820, 560, '电负性（鲍林）', 'F 3.98 · H 2.20 · 键长 0.92 Å'), c.b(0) + 8, null); });
S('c_h2o', c => { rxScene(c, 'h2o', { cm: 'k', alt: 'solid' }); show(c, det(70, 820, 560, '数据', 'O–H 0.96 Å · 键角 104.5°'), c.b(1) + 1, null); });
S('c_ch4', c => { rxScene(c, 'ch4', { alt: 'shell' }); show(c, det(70, 820, 560, '数据', 'C–H 1.09 Å · 夹角 109.5°'), c.b(1) + 1, null); });
S('c_n2', c => { rxScene(c, 'n2', { cm: 'k', alt: 'slice' }); show(c, det(70, 820, 560, '数据', 'N≡N 1.10 Å · 键能约 945 kJ/mol'), c.b(1) + 1, null); });
S('c_co2', c => { rxScene(c, 'co2', { cm: 'k', alt: 'solid' }); show(c, det(70, 820, 560, '数据', 'C=O 1.16 Å · 直线形，无极性'), c.b(1) + 1, null); });
S('c_nacl', c => { rxScene(c, 'nacl', { alt: 'solid' }); show(c, det(70, 820, 600, '能量（气态原子）', 'Na 电离能 5.14 eV · Cl 电子亲和能 3.61 eV · NaCl 晶格能约 787 kJ/mol'), c.b(2) + .5, null); });
S('c_fe', c => { rxScene(c, 'fe', { alt: 'slice', zoom: 2.2 }); show(c, det(70, 820, 560, '构型', 'Fe [Ar]3d⁶4s² → Fe²⁺ [Ar]3d⁶ → Fe³⁺ [Ar]3d⁵'), c.b(1) + .5, null); });
S('c_zncu', c => { rxScene(c, 'zncu', { alt: 'shell' }); show(c, det(70, 820, 600, '标准电极电势', 'Cu²⁺/Cu +0.34 V · Zn²⁺/Zn −0.76 V'), c.b(1) + 3, null); });
S('c_nh4', c => { rxScene(c, 'nh4', { cm: 'k', alt: 'solid' }); });
S('c_h3o', c => { rxScene(c, 'h3o', { cm: 'k', alt: 'solid' }); });
S('c_neut', c => { rxScene(c, 'neut', { cm: 'k', alt: 'solid' }); show(c, det(70, 820, 560, '数据', '中和热约 −57 kJ/mol'), c.b(1) + 4, null); });
S('c_bf3', c => { rxScene(c, 'bf3', { alt: 'solid', note: '只画参与反应的电子：N 的孤对电子和 B–F 键；F 的孤对电子与 N–H 键隐藏' }); });
S('c_mid', c => {
  const { b, be } = c; c.head('14', '上半场小结');
  const items = [['h2', '共价键', '电子聚在两核之间'], ['hf', '极性键', '电子偏向电负性大的一方'], ['nacl', '离子键', '电子整个转移'], ['nh4', '配位键', '孤对电子接住质子']];
  items.forEach(([id, h, s], i) => {
    const x = 100 + i * 435, v = glv(c, x, 240, 410, 410, { at: .3 + i * .4 }), R = rxView(v, id, { zoom: 2.4, k: 5.5, PE: 700 });
    v.labels.forEach(L => L.e.style.display = 'none');
    v.upd.push(t => { const k = (t + i * 1.5) % 9, u = SS(k, 1.5, 5) * (1 - SS(k, 7.5, 8.8)); R.set(u, 'pts', t); });
    show(c, at(x, 670, 410, `<div style="text-align:center"><div style="font:800 34px var(--serif)">${h}</div><div class="p" style="font-size:22px">${s}</div></div>`), .5 + i * .4, null);
  });
  show(c, card(100, 790, 1720, `<div class="p" style="font-size:24px">下一集：<b>键怎么断开</b>（均裂、异裂、自由基）· <b>有机反应</b>（加成、SN2、羰基、互变异构、狄尔斯–阿尔德）· <b>特殊的电子云</b>（苯、金属、光激发、氢键）</div>`), b(1) + .3, null);
});
