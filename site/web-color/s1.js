// Web 的颜色 · 上集：屏幕与表示
const CS = '#1F5FA8', CP = '#B5651D', CR = '#5B4A9E';
const grid = (x, y, w, cols, cards, gap = 16) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:${gap}px">${cards.map(h => `<div class="gc">${h}</div>`).join('')}</div>`;
const stag = (c, el, t0, gap) => [...el.querySelectorAll('.gc')].forEach((e, i) => c.in(e, t0 + i * gap, { dy: 10 }));
const mc = (col, h, body, s = '') => `<div class="mc" style="--c:${col}">${s ? `<div class="s">${s}</div>` : ''}<h3>${h}</h3>${body}</div>`;

S('w_open', c => {
  const { b, be } = c;
  show(c, at(120, 170, 1000, `<div style="font:600 26px var(--sans);letter-spacing:.3em;color:var(--ink3)">Web 平台专题 · 上集</div><div style="font:900 150px/1.1 var(--serif);margin-top:12px">Web 的颜色</div><div style="font:700 48px var(--serif);color:var(--ink2);margin-top:8px">屏幕与表示</div>`), .1, be(0) + .2);
  show(c, at(1180, 200, 620, mc(CS, '屏幕与表示', '<ul><li>色彩空间、sRGB 的来历</li><li>CSS1–3 到 Color 4</li><li>几种写法的差别、Oklab</li><li>浏览器追平</li></ul>', '上集') + `<div style="height:16px"></div>` + mc(CP, 'HDR、设备与推动者', '<ul><li>色域映射、Color 5</li><li>色彩管理与 HDR</li><li>手机、电视、XR 头显</li><li>谁在推动</li></ul>', '下集')), b(0) + 1.2, be(0) + .2);
  show(c, det(120, 680, 1000, '说明', 'AI 协助整理（稿件与画面：Claude；配音：Gemini TTS，1.25 倍速）。视频本身是 sRGB，超出 sRGB 的颜色只能示意。'), b(0) + 3, be(0) + .2);
  show(c, at(120, 200, 1680, `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:28px">${[['#ff0000', 'color: red;', '1996 · CSS1'], ['rgb(255 0 0)', 'color: #ff0000;', '解释为 sRGB'], ['color(display-p3 1 0 0)', 'color(display-p3 1 0 0)', 'P3 屏上更红（此处只能示意）']].map(([bg, t, s]) => sw(bg, t, s, { h: 260 })).join('')}</div>`), b(1) + .1);
  show(c, concl(120, 640, 1680, '一个颜色值 = <b>三个数字</b> + <b>它们所在的色彩空间</b>'), F(c, 1, .55));
});

S('w_eye', c => {
  const { b } = c;
  c.head('01', '色彩空间是三角形');
  const ch = chroma(120, 220, 700, 720);
  const el = show(c, ch.html, b(0) + .1); chromaPaint(el, ch);
  const ov = el.querySelector('.ov');
  ov.innerHTML = triSvg(ch, 'srgb', CS, 't1') + triSvg(ch, 'p3', CP, 't2') + triSvg(ch, 'rec2020', CR, 't3') + `<circle cx="${ch.X(D65[0])}" cy="${ch.Y(D65[1])}" r="6" fill="#181B20"/><text x="${ch.X(D65[0]) + 10}" y="${ch.Y(D65[1]) - 8}" font-size="17" fill="#181B20">D65</text>`;
  ['t1', 't2', 't3'].forEach((k, i) => c.anim(ov.querySelector('.' + k), [{ opacity: 0 }, { opacity: 1 }], b(1) + .2 + i * 2.2, .5));
  show(c, at(900, 230, 900, mc('var(--ink2)', 'CIE 1931 XYZ', '<ul><li>1920 年代 Wright 与 Guild 的配色实验</li><li>与设备无关的参照；Y 是亮度</li><li>两种光的混合落在连线上 → 三原色的色域是三角形</li><li>xy 图不是感知均匀的（MacAdam 椭圆）</li></ul>')), F(c, 0, .3));
  const t = show(c, at(900, 560, 900, tbl([['色彩空间', '年份', '占 xy 面积'], [`<b style="color:${CS}">sRGB / BT.709</b>`, '1996', '35.9%'], [`<b style="color:${CP}">DCI-P3</b>`, '2015（Display P3）', '53.6%'], [`<b style="color:${CR}">Rec.2020</b>`, '2012', '75.8%']], { st: 'font-size:22px' })), b(1) + .1);
  rowsIn(c, t, [[1, b(1) + .3], [2, b(1) + 2.5], [3, b(1) + 4.7]]);
  show(c, at(900, 830, 900, `<div class="cap">面积来自 Wikipedia · Rec. 2020 条目；面积大小 ≠ 人眼感到的差距</div>`), F(c, 1, .7));
});

S('w_srgb', c => {
  const { b } = c;
  c.head('02', '1996 年的 sRGB');
  show(c, at(120, 245, 820, mc(CS, '“互联网的默认色彩空间”', '<ul><li>1996-11：Stokes、Motta（HP）与 Anderson、Chandrasekar（Microsoft）</li><li>BT.709 原色 · D65 白点</li><li>曲线 ≈ gamma 2.2（近零处一段直线）</li><li>参考亮度 80 cd/m² · 办公室 200 lux</li><li>1999：IEC 61966-2-1</li></ul>', 'w3.org/Graphics/Color/sRGB')), b(0) + .1);
  // 传递曲线
  const W = 760, H = 460, P = 50, X = v => P + v * (W - P * 1.5), Y = v => H - P - v * (H - P * 1.5);
  const lin = v => v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4);
  let d = ''; for (let i = 0; i <= 100; i++) { const v = i / 100; d += `${i ? 'L' : 'M'}${X(v).toFixed(1)} ${Y(lin(v)).toFixed(1)}`; }
  const svg = `<svg width="${W}" height="${H}"><rect x="${P}" y="${P / 2}" width="${W - P * 1.5}" height="${H - P * 1.5}" fill="#fff" stroke="#DDE0DA"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(1)}" y2="${Y(1)}" stroke="#C8CCC4" stroke-dasharray="6 5" stroke-width="2"/><path class="cv" d="${d}" fill="none" stroke="${CS}" stroke-width="4"/><line class="m1" x1="${X(.5)}" y1="${Y(0)}" x2="${X(.5)}" y2="${Y(lin(.5))}" stroke="${CP}" stroke-width="2.5" stroke-dasharray="5 4"/><line class="m1" x1="${X(0)}" y1="${Y(lin(.5))}" x2="${X(.5)}" y2="${Y(lin(.5))}" stroke="${CP}" stroke-width="2.5" stroke-dasharray="5 4"/><circle class="m1" cx="${X(.5)}" cy="${Y(lin(.5))}" r="7" fill="${CP}"/><text class="m1" x="${X(.5) + 14}" y="${Y(lin(.5)) - 10}" font-size="22" fill="${CP}" font-weight="700">128 → 21% 的光</text><text x="${X(.5)}" y="${H - 8}" font-size="18" fill="#7D838D" text-anchor="middle">编码值（CSS 里写的数字）</text><text x="16" y="${Y(.5)}" font-size="18" fill="#7D838D" transform="rotate(-90 16 ${Y(.5)})" text-anchor="middle">发出的光（线性）</text></svg>`;
  const g = show(c, at(1000, 235, W, svg), b(0) + .4);
  c.anim(g.querySelector('.cv'), [{ strokeDasharray: '0 2000' }, { strokeDasharray: '2000 0' }], b(0) + .6, 2);
  g.querySelectorAll('.m1').forEach(e => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], b(1) + .3, .5));
  show(c, at(120, 640, 820, `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">${sw('rgb(0 0 0)', '0', '黑', { h: 70 })}${sw('rgb(128 128 128)', '128', '看起来接近中灰', { h: 70 })}${sw('rgb(255 255 255)', '255', '白', { h: 70 })}</div>`), b(1) + .1);
  show(c, concl(120, 820, 1680, '没有标注的颜色值 = sRGB；数字是<b>编码值</b>，不是光强'), F(c, 1, .55));
});

S('w_css3', c => {
  const { b } = c;
  c.head('03', '从 216 色到 CSS3');
  const lv = ['00', '33', '66', '99', 'cc', 'ff'];
  let cells = ''; for (const r of lv) for (const g of lv) for (const bb of lv) cells += `<i style="background:#${r}${g}${bb}"></i>`;
  show(c, at(120, 245, 820, `<div class="cap" style="margin-bottom:8px">网页安全色：红绿蓝各取 6 级 · 6×6×6 = 216</div><div class="safe">${cells}</div>`), b(0) + .1);
  show(c, at(120, 640, 820, cc('CSS1（1996）', 'color: red;          «16 个关键词»\ncolor: #f00;\ncolor: rgb(255, 0, 0);', '全部是 sRGB', { fs: 21 })), F(c, 0, .65));
  show(c, at(980, 245, 820, cc('CSS Color 3（2011 REC）', 'color: rgba(255, 0, 0, .5);\ncolor: hsl(0, 100%, 50%);\nborder-color: currentColor;\nbackground: transparent;\ncolor: rebeccapurple;  «2014，#663399»', '仍然是 sRGB 的不同拼法', { fs: 21 })), b(1) + .1);
  show(c, at(980, 520, 820, `<div class="cap" style="margin-bottom:8px">X11 继承来的 147 个颜色名里的怪事</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px">${sw('gray', 'gray', '#808080', { h: 80 })}${sw('darkgray', 'darkgray', '#a9a9a9 · 反而更浅', { h: 80 })}${sw('rebeccapurple', 'rebeccapurple', '纪念 Rebecca Meyer', { h: 80 })}</div>`), F(c, 1, .4));
});

S('w_screen', c => {
  const { b } = c;
  c.head('04', '屏幕先变了');
  const L = show(c, lin(120, 250, 900, 380, {
    imac: [130, 40, '2015 iMac 5K', 'Display P3', CP], ipad: [130, 140, '2016 iPad Pro · iPhone 7', 'P3', CP], hdr10: [130, 240, '2015 HDR10 · 量子点电视', 'PQ · Rec.2020', CR], oled: [130, 340, 'OLED 手机', '', CR],
    os: [470, 190, '系统色彩管理', 'OS X 10.11.3 · iOS 9.3', 'var(--ink2)'], wk: [760, 190, 'WebKit 2016', '图片色彩匹配 · color-gamut', CS],
  }, [['imac', 'os'], ['ipad', 'os'], ['hdr10', 'os', 1], ['oled', 'os', 1], ['os', 'wk']]), b(0) + .1);
  linIn(c, L, [['imac', b(0) + .3], ['ipad', F(c, 0, .35)], ['hdr10', F(c, 0, .65)], ['oled', F(c, 0, .8)], ['os', b(1) + .2], ['wk', F(c, 1, .3)]]);
  show(c, at(1080, 250, 720, det(0, 0, 720, 'WebKit 博客 · 2016-07', '“HTML 和 CSS 目前只定义在 sRGB 里”：网页内容用不上 P3 屏更饱和的颜色。', 'webkit.org/blog/6682', ), 'position:absolute'), b(1) + .1);
  show(c, at(1080, 470, 720, cc('WebKit 先做的两件事', '/* 1. 所有图片按 ICC 配置文件匹配，未标注 = sRGB */\n\n/* 2. 问屏幕能显示多大的色域 */\n@media (color-gamut: p3) {\n  .hero { background: url(hero-p3.jpg); }\n}', '', { fs: 19 })), F(c, 1, .5));
});

S('w_c4', c => {
  const { b } = c;
  c.head('05', 'CSS Color 4：色彩空间 + 坐标');
  show(c, at(120, 245, 840, cc('color()：指明 RGB 空间', 'color: color(srgb 1 0 0);         «= red»\ncolor: color(display-p3 1 0 0);   «P3 的最红»\n  «换回 sRGB = (1.093, -0.227, -0.150)：越界»\ncolor: color(rec2020 1 0 0);\n«还有 srgb-linear、a98-rgb、prophoto-rgb、xyz»', '', { fs: 20 })), b(0) + .1);
  const ch = chroma(1000, 210, 540, 520);
  const el = show(c, ch.html, F(c, 0, .3)); chromaPaint(el, ch);
  el.querySelector('.ov').innerHTML = triSvg(ch, 'srgb', CS) + triSvg(ch, 'p3', CP) + `<circle cx="${ch.X(.64)}" cy="${ch.Y(.33)}" r="8" fill="${CS}"/><circle class="pr" cx="${ch.X(.68)}" cy="${ch.Y(.32)}" r="9" fill="${CP}" stroke="#fff" stroke-width="2"/><text class="pr" x="${ch.X(.68) - 4}" y="${ch.Y(.32) - 18}" font-size="17" font-weight="700" fill="${CP}" text-anchor="middle">P3 红</text>`;
  el.querySelectorAll('.pr').forEach(e => c.anim(e, [{ opacity: 0 }, { opacity: 1 }], F(c, 0, .45), .5));
  show(c, at(1560, 260, 260, `<div class="lg2" style="flex-direction:column"><span style="--c:${CS}">sRGB</span><span style="--c:${CP}">Display P3</span></div>`), F(c, 0, .3));
  show(c, at(120, 520, 840, cc('与设备无关的感知空间', 'color: lab(54.29% 80.80 69.89);   «CIELAB 1976，D50»\ncolor: lch(54.29% 106.8 40.9);\ncolor: oklab(62.8% 0.225 0.126);  «Oklab 2020，D65»\ncolor: oklch(62.8% 0.258 29.2);   «同一个 red»', '', { fs: 20 })), b(1) + .1);
  show(c, det(1000, 760, 800, '规范', '编辑：Tab Atkins（Google）、Chris Lilley（W3C）、Lea Verou；2022 年候选推荐（CR）。', 'w3.org/TR/css-color-4'), F(c, 1, .55));
});

S('w_repr', c => {
  const { b } = c;
  c.head('06', '几种写法的差别');
  const t = show(c, at(120, 240, 1000, tbl([['写法', '三个坐标', '范围', '均匀'], ['<span class="k">#hex · rgb()</span>', '编码后的 R G B', 'sRGB', '否'], ['<span class="k">hsl() · hwb()</span>', '色相 + 饱和/亮度，或白/黑', 'sRGB', '否'], ['<span class="k">lab() · lch()</span>', 'L 0–100 · a/b 或 C/H · D50', '全部可见色', '大体'], ['<span class="k">oklab() · oklch()</span>', 'L 0–1 · C ≈0–0.37 · H · D65', '全部可见色', '更好'], ['<span class="k">color(空间 r g b)</span>', '指定空间里的 R G B，0–1', '该空间', '否']], { st: 'font-size:21px' })), b(0) + .1);
  rowsIn(c, t, [[0, b(0) + .1], [1, F(c, 0, .2)], [2, F(c, 0, .3)], [3, F(c, 0, .48)], [4, F(c, 0, .6)], [5, F(c, 0, .75)]]);
  show(c, at(1160, 240, 640, cc('同一个 rebeccapurple', '#663399\nrgb(102 51 153)\nhsl(270 50% 40%)\nhwb(270 20% 40%)\nlab(32.39% 38.42 -47.69)\noklch(44.0% 0.160 303.4)\ncolor(display-p3 0.374 0.210 0.579)', '由 sRGB 换算', { fs: 19 })), F(c, 0, .35));
  show(c, at(120, 640, 820, `<div class="cap" style="margin-bottom:8px">HSL 亮度都是 50%</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">${sw('hsl(60 100% 50%)', 'hsl(60 100% 50%)', 'OKLCH 亮度 0.97', { h: 70 })}${sw('hsl(240 100% 50%)', 'hsl(240 100% 50%)', 'OKLCH 亮度 0.45', { h: 70 })}</div>`), b(1) + .1);
  show(c, at(980, 600, 820, `<div class="cap" style="margin-bottom:6px">从红到蓝：在哪个空间里插值</div>${['srgb', 'oklab', 'oklch'].map(s => grad(`linear-gradient(to right in ${s}, red, blue)`, `in ${s}`, 46)).join('<div style="height:8px"></div>')}<div style="height:8px"></div>${grad('linear-gradient(to right in oklch longer hue, red, blue)', 'in oklch longer hue', 46)}`), F(c, 1, .35));
});

S('w_oklab', c => {
  const { b } = c;
  c.head('07', '为什么是 Oklab');
  show(c, at(120, 240, 820, `<div class="cap" style="margin-bottom:6px">蓝到白的渐变</div>${grad('linear-gradient(to right in srgb, blue, white)', 'in srgb（发紫）', 56)}<div style="height:10px"></div>${grad('linear-gradient(to right in lab, blue, white)', 'in lab（CIELAB，偏紫）', 56)}<div style="height:10px"></div>${grad('linear-gradient(to right in oklab, blue, white)', 'in oklab', 56)}`), b(0) + .1);
  show(c, at(120, 560, 820, mc(CS, 'Björn Ottosson · 2020-12-23', '<ul><li>游戏开发者：只想让颜色变亮变暗时色相不跑</li><li>CAM16 的亮度 + IPT 的色相均匀性</li><li>只要两次矩阵乘法和一次立方根</li></ul>', 'bottosson.github.io/posts/oklab')), F(c, 0, .5));
  const L = show(c, lin(980, 250, 820, 520, {
    blog: [160, 40, 'Oklab 博客', '2020-12', CS], lil: [160, 150, 'Chris Lilley 联系作者', 'W3C', 'var(--ink2)'], iss: [160, 260, 'CSSWG issue #6642', '2021-09', 'var(--ink2)'], res: [160, 370, '工作组决议', '2021-10-13', CP],
    f1: [560, 260, 'oklab() · oklch()', '', CP], f2: [560, 370, '默认插值空间', '新写法', CP], f3: [560, 480, 'OKLCH 色域映射', '', CP], ps: [160, 480, 'Photoshop 渐变 · Tailwind v4', '', CR],
  }, [['blog', 'lil'], ['lil', 'iss'], ['iss', 'res'], ['res', 'f1'], ['res', 'f2'], ['res', 'f3'], ['res', 'ps', 1]]), b(1) + .1);
  linIn(c, L, [['blog', b(1) + .2], ['lil', F(c, 1, .1)], ['iss', F(c, 1, .25)], ['res', F(c, 1, .38)], ['f1', F(c, 1, .5)], ['f2', F(c, 1, .58)], ['f3', F(c, 1, .66)], ['ps', F(c, 1, .82)]]);
});

S('w_browser', c => {
  const { b } = c;
  c.head('08', '浏览器追平');
  const t = show(c, at(120, 240, 1100, tbl([['特性', 'Safari', 'Chrome', 'Firefox', 'Baseline'], ['<span class="k">color-gamut</span> 媒体查询', '10', '58', '110', '2023'], ['<span class="k">lab() lch() color()</span>', '15（2021）', '111（2023-03）', '113（2023-05）', '2023-05'], ['<span class="k">oklab() oklch()</span>', '15.4', '111', '113', '2023-05'], ['<span class="k">color-mix()</span>', '16.2', '111', '113', '2023-05'], ['<span class="k">dynamic-range</span> 媒体查询', '13.1', '98', '100', '2022']], { st: 'font-size:21px' })), b(0) + .1);
  rowsIn(c, t, [[0, b(0) + .1], [1, F(c, 0, .15)], [2, F(c, 0, .3)], [3, F(c, 0, .5)], [4, F(c, 0, .62)], [5, F(c, 0, .9)]]);
  show(c, at(1260, 240, 540, mc(CP, 'Interop 2022 · 2023', '<ul><li>Apple、Bocoup、Google、Igalia、Microsoft、Mozilla</li><li>“色彩空间与颜色函数”列为重点</li><li>2023-05：三大引擎互通</li></ul>', 'web.dev')), F(c, 0, .78));
  show(c, at(120, 640, 1100, cc('渐进增强', '.brand {\n  color: #e0306a;                    «所有浏览器»\n  color: oklch(62% 0.24 0);          «支持就覆盖»\n}\n@media (color-gamut: p3) {\n  .brand { color: color(display-p3 0.95 0.1 0.4); }\n}', '看不懂的声明被忽略，保留前一个值', { fs: 20 })), b(1) + .1);
});

S('w_end', c => {
  const { b } = c;
  c.head('09', '上集小结');
  const L = show(c, lin(120, 250, 1680, 300, {
    a: [130, 120, 'sRGB 1996', 'CRT 的平均', CS], b2: [460, 120, 'CSS1–3', 'sRGB 的不同拼法', CS], c2: [790, 120, 'P3 屏幕 2015', '硬件先变', CP], d: [1120, 120, 'Color 4', '空间 + 坐标 · Oklab', CP], e: [1460, 120, '2023-05 互通', 'Baseline', CR],
  }, [['a', 'b2'], ['b2', 'c2'], ['c2', 'd'], ['d', 'e']]), b(0) + .1);
  linIn(c, L, [['a', b(0) + .2], ['b2', F(c, 0, .3)], ['c2', F(c, 0, .55)], ['d', F(c, 0, .7)], ['e', F(c, 0, .88)]]);
  show(c, at(120, 560, 1680, mc(CR, '下集', '<ul><li>超出屏幕的颜色怎么映射 · Color 5 的颜色运算</li><li>色彩管理 · HDR 怎么进入网页</li><li>手机、电视、XR 头显 · 推动者</li></ul>')), b(1) + .1);
});
