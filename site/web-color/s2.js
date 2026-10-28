// Web 的颜色 · 下集：HDR、设备与推动者
const CS = '#1F5FA8', CP = '#B5651D', CR = '#5B4A9E', OK = '#2E7D4F';
const grid = (x, y, w, cols, cards, gap = 16) => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;display:grid;grid-template-columns:repeat(${cols},1fr);gap:${gap}px">${cards.map(h => `<div class="gc">${h}</div>`).join('')}</div>`;
const stag = (c, el, t0, gap) => [...el.querySelectorAll('.gc')].forEach((e, i) => c.in(e, t0 + i * gap, { dy: 10 }));
const mc = (col, h, body, s = '') => `<div class="mc" style="--c:${col}">${s ? `<div class="s">${s}</div>` : ''}<h3>${h}</h3>${body}</div>`;

S('x_open', c => {
  const { b, be } = c;
  show(c, at(120, 170, 1000, `<div style="font:600 26px var(--sans);letter-spacing:.3em;color:var(--ink3)">Web 平台专题 · 下集</div><div style="font:900 150px/1.1 var(--serif);margin-top:12px">Web 的颜色</div><div style="font:700 48px var(--serif);color:var(--ink2);margin-top:8px">HDR、设备与推动者</div>`), .1, be(0) + .2);
  // HDR 照片旁的白字（示意）
  const demo = `<div style="display:grid;grid-template-columns:1.3fr 1fr;gap:0;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(30,30,20,.12)"><div style="height:420px;background:radial-gradient(circle at 70% 30%,#fff 0 9%,#ffe9a8 14%,#f29b38 30%,#5a3a6e 62%,#1c1f33 100%);position:relative"><span style="position:absolute;left:18px;bottom:14px;font:600 20px var(--sans);color:#fff">HDR 照片：高光可达 SDR 白的数倍</span></div><div style="background:#f4f4f2;padding:30px;display:flex;flex-direction:column;justify-content:center"><div style="font:700 44px var(--serif);color:#d9d9d6">白色界面</div><div style="font:500 22px var(--sans);color:#9a9a96;margin-top:10px">在 HDR 屏上，相比之下显得发灰</div></div></div>`;
  show(c, at(120, 220, 1680, demo), b(1) + .1);
  show(c, at(120, 680, 1680, `<div class="cap">示意：视频是 SDR，无法真正呈现 HDR 的亮度差</div>`), b(1) + .4);
  show(c, concl(120, 740, 1680, '同一页面里 <b>SDR 与 HDR 并存</b>：亮度怎么分配，是这几年规范在补的课'), F(c, 1, .6));
});

S('x_gamut', c => {
  const { b } = c;
  c.head('01', '超出屏幕的颜色');
  const ch = chroma(120, 220, 640, 660);
  const el = show(c, ch.html, b(0) + .1); chromaPaint(el, ch);
  const P = [.56, .43], W = D65, s0 = GAMUT.srgb;
  // 降色度：沿着到白点的直线与三角形 R-G 边相交
  const inter = (p, q, a, bb) => { const d1 = [q[0] - p[0], q[1] - p[1]], d2 = [bb[0] - a[0], bb[1] - a[1]], den = d1[0] * d2[1] - d1[1] * d2[0], t = ((a[0] - p[0]) * d2[1] - (a[1] - p[1]) * d2[0]) / den; return [p[0] + t * d1[0], p[1] + t * d1[1]]; };
  const Q = inter(P, W, s0[0], s0[1]), Cl = [.555, .40];
  const X = ch.X, Y = ch.Y;
  el.querySelector('.ov').innerHTML = triSvg(ch, 'srgb', CS) + `<line x1="${X(P[0])}" y1="${Y(P[1])}" x2="${X(W[0])}" y2="${Y(W[1])}" stroke="#9AA0A8" stroke-dasharray="5 5" stroke-width="2"/><circle cx="${X(W[0])}" cy="${Y(W[1])}" r="5" fill="#181B20"/><circle cx="${X(P[0])}" cy="${Y(P[1])}" r="10" fill="none" stroke="#181B20" stroke-width="3"/><text x="${X(P[0]) + 14}" y="${Y(P[1]) - 12}" font-size="19" font-weight="700" fill="#181B20">oklch(70% 0.25 70)</text><g class="cl"><line x1="${X(P[0])}" y1="${Y(P[1])}" x2="${X(Cl[0])}" y2="${Y(Cl[1])}" stroke="#C2462E" stroke-width="3"/><circle cx="${X(Cl[0])}" cy="${Y(Cl[1])}" r="8" fill="#C2462E"/><text x="${X(Cl[0]) + 12}" y="${Y(Cl[1]) + 24}" font-size="18" fill="#C2462E" font-weight="700">裁剪：色相偏了</text></g><g class="cr"><circle cx="${X(Q[0])}" cy="${Y(Q[1])}" r="8" fill="${OK}"/><text x="${X(Q[0]) - 14}" y="${Y(Q[1]) - 16}" font-size="18" fill="${OK}" font-weight="700" text-anchor="end">降色度：色相不变</text></g>`;
  c.anim(el.querySelector('.cl'), [{ opacity: 0 }, { opacity: 1 }], F(c, 0, .5), .5);
  c.anim(el.querySelector('.cr'), [{ opacity: 0 }, { opacity: 1 }], F(c, 0, .75), .5);
  show(c, at(840, 230, 960, cc('超出 sRGB 的 oklch', '.warn {\n  color: oklch(70% 0.25 70);   «色度太高，sRGB 屏显示不了»\n}\n«逐通道裁剪：rgb 各自截到 0–1，色相和亮度都会变»\n«在 OKLCH 里降色度：保持 L 和 H，减小 C 直到落进色域»', '', { fs: 20 })), F(c, 0, .3));
  const t = show(c, at(840, 520, 960, tbl([['时间', '事件'], ['2022', 'Color 4 规范描述裁剪、降色度等做法'], ['2023-10', 'issue #9449：浏览器都在裁剪，“破坏了 oklch 的意义”'], ['2024-07', 'Christopher Cameron（Chrome）开 #10579，比较更快的静态映射'], ['现在', '最终算法仍在讨论']], { st: 'font-size:21px' })), b(1) + .1);
  rowsIn(c, t, [[0, b(1) + .1], [1, b(1) + .3], [2, F(c, 1, .2)], [3, F(c, 1, .5)], [4, F(c, 1, .8)]]);
});

S('x_c5', c => {
  const { b } = c;
  c.head('02', 'CSS Color 5：颜色运算');
  const g = show(c, grid(120, 240, 1680, 2, [
    cc('color-mix()', 'background: color-mix(in oklab, var(--brand) 60%, white);\n«不写空间时默认 Oklab»', 'Chrome 111 · Firefox 113 · Safari 16.2', { fs: 19 }),
    cc('相对颜色语法', '--hover: oklch(from var(--brand) calc(l + .1) c h);\n--muted: oklch(from var(--brand) l calc(c * .4) h);', 'Chrome 119 · Firefox 128 · Safari 18', { fs: 19 }),
    cc('light-dark()', ':root { color-scheme: light dark; }\nbody { color: light-dark(#222, #eee); }', 'Baseline 2024-05', { fs: 19 }),
    cc('contrast-color()', 'button {\n  background: var(--bg);\n  color: contrast-color(var(--bg));   «黑或白»\n}', 'Baseline 2026-04 · 目前用 WCAG 2 公式', { fs: 19 }),
  ], 16), b(0) + .1);
  stag(c, g, b(0) + .2, 3);
  // 由一个品牌色生成色阶
  const steps = [.95, .85, .75, .65, .55, .45, .35, .25];
  show(c, at(120, 620, 1000, `<div class="cap" style="margin-bottom:8px">oklch(from var(--brand) L c h)：只改亮度，色相不跑</div><div style="display:grid;grid-template-columns:repeat(8,1fr);gap:8px">${steps.map(l => sw(`oklch(${l} ${Math.min(.16, .4 * l * (1 - l) + .02).toFixed(3)} 262)`, String(l), '', { h: 70 })).join('')}</div>`), F(c, 0, .9));
  show(c, det(1160, 620, 640, 'WCAG', 'WCAG 2 的对比度建立在 sRGB 相对亮度上；APCA 2023 年移出 WCAG 3 草案，新算法“尚未确定”（2026-04）。', 'adrianroselli.com 2026-04'), b(1) + .1);
});

S('x_cm', c => {
  const { b } = c;
  c.head('03', '未标注的颜色怎么办');
  const flow = (title, col, steps, note) => `<div class="mc" style="--c:${col}"><h3>${title}</h3><div style="display:flex;align-items:center;gap:10px;margin:14px 0;flex-wrap:wrap">${steps.map((s, i) => `${i ? '<span style="font-size:26px;color:var(--ink3)">→</span>' : ''}<span class="pill" style="font-size:20px">${s}</span>`).join('')}</div><div style="font-size:21px;color:var(--ink2)">${note}</div></div>`;
  show(c, at(120, 245, 820, flow('当作 sRGB 换算', OK, ['#ff0000', '按 sRGB 解释', '换算到屏幕色域', '屏幕'], 'WebKit 2016 起；后来公认的做法')), b(0) + .1);
  show(c, at(120, 470, 820, flow('数值直接送给屏幕', '#C2462E', ['#ff0000', '屏幕'], '在 P3 屏上，sRGB 的红被当成 P3 的红：过饱和')), F(c, 0, .45));
  show(c, at(980, 245, 820, `<div class="cap" style="margin-bottom:8px">示意：同一个 rgb(220 80 60)，被直接当作 P3 数值时更艳</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">${sw('rgb(220 80 60)', '换算后', '颜色正确', { h: 120 })}${sw('color(display-p3 0.86 0.31 0.24)', '未换算（在 P3 屏上）', '过饱和', { h: 120 })}</div>`), F(c, 0, .6));
  const t = show(c, at(980, 540, 820, tbl([['平台', '做法'], ['Firefox 3.5（2009）', '只校正带配置文件的图片；CSS 与未标注图片直接送屏幕。默认值至今未变（bug 1488619）'], ['Chrome（macOS，2017）', '未标注内容按显示器配置渲染，修复先放在实验开关后'], ['Windows 11 22H2', '自动色彩管理：桌面合成改为 FP16，sRGB 应用映射到屏幕色域']], { st: 'font-size:20px' })), b(1) + .1);
  rowsIn(c, t, [[0, b(1) + .1], [1, b(1) + .3], [2, F(c, 1, .5)], [3, F(c, 1, .75)]]);
});

S('x_hdr', c => {
  const { b } = c;
  c.head('04', 'HDR 是亮度问题');
  show(c, at(120, 245, 820, mc(CR, 'BT.2100（2016）的两种曲线', '<ul><li><b>PQ</b>（SMPTE ST 2084，Dolby）：按绝对亮度编码，最高 10000 nits</li><li><b>HLG</b>（BBC 与 NHK）：相对亮度，兼容 SDR 电视</li><li>原色同 Rec.2020；10 或 12 位</li><li>BT.2408：HDR 参考白 = 203 cd/m²</li></ul>')), b(0) + .1);
  // EDR 余量柱
  const items = [['普通 Mac / iPad', 2], ['外接 HDR10 显示器', 5], ['iPhone XDR', 8], ['iPad Pro XDR', 16], ['Pro Display XDR（低亮度）', 400]];
  const H = 460, base = 720, lg = v => Math.log10(v) / Math.log10(400);
  const bars = items.map(([n, v], i) => { const x = 1070 + i * 160, h = 30 + lg(v) * (H - 60); return `<div class="abs hb" style="left:${x}px;top:${base - h}px;width:96px;height:${h}px;background:linear-gradient(to top,#c8ccc4 0 ${30 / h * 100}%, ${CP} ${30 / h * 100}% 100%);border-radius:8px 8px 0 0"></div><div class="abs" style="left:${x - 20}px;top:${base - h - 40}px;width:136px;text-align:center;font:700 26px var(--mono)">${v}×</div><div class="abs" style="left:${x - 30}px;top:${base + 12}px;width:156px;text-align:center;font:500 17px var(--sans);color:var(--ink2)">${n}</div>`; }).join('');
  const el = show(c, `<div class="abs" style="left:0;top:0">${bars}<div class="abs" style="left:980px;top:${base - 30}px;width:820px;border-top:2px dashed #7D838D"></div><div class="abs" style="left:975px;top:${base - 84}px;width:80px;font:600 18px/1.3 var(--sans);color:var(--ink3)">SDR 白<br>= 1.0</div><div class="abs" style="left:1000px;top:225px;width:800px;font:600 20px var(--sans)">Apple EDR 余量（对数刻度）· WWDC21</div></div>`, b(1) + .1);
  el.querySelectorAll('.hb').forEach((e, i) => c.anim(e, [{ transform: 'scaleY(0)', transformOrigin: 'bottom' }, { transform: 'scaleY(1)', transformOrigin: 'bottom' }], b(1) + .3 + i * .6, .7));
  show(c, concl(120, 780, 820, '余量随<b>环境光和亮度设置</b>变化：同一张照片能亮多少，每时每刻都不同'), F(c, 1, .6));
});

S('x_hdrweb', c => {
  const { b } = c;
  c.head('05', 'HDR 进入网页');
  const flow = `<div style="display:flex;align-items:center;gap:14px">${[['SDR JPEG', '所有软件都能看', 'var(--ink2)'], ['+ 增益图', '每个像素能亮多少倍', CP], ['HDR 屏', '按当前余量放大', CR]].map(([a, s, col], i) => `${i ? '<span style="font-size:34px;color:var(--ink3)">→</span>' : ''}<div class="mode" style="--c:${col};flex:1"><h4>${a}</h4><p>${s}</p></div>`).join('')}</div>`;
  show(c, at(120, 240, 1000, flow), b(0) + .1);
  const t = show(c, at(120, 420, 1000, tbl([['时间', '增益图'], ['2023', 'Android 14 Ultra HDR；Adobe gain map 1.0'], ['2024-10', 'Lightroom 导出 JPEG 增益图'], ['2025-07', 'ISO 21496-1 发布，两套格式合流'], ['2025 秋', 'Safari 26 显示 HDR 图片；Chromium 支持 ISO 与旧格式']], { st: 'font-size:20px' })), F(c, 0, .35));
  rowsIn(c, t, [[0, F(c, 0, .35)], [1, F(c, 0, .45)], [2, F(c, 0, .6)], [3, F(c, 0, .72)], [4, F(c, 0, .88)]]);
  const g = show(c, grid(1160, 240, 640, 1, [
    cc('CSS · Chrome 136（2025-04）· Safari 26', '.thumb img { dynamic-range-limit: standard; }\n.viewer img { dynamic-range-limit: no-limit; }', '', { fs: 17 }),
    cc('WebGPU · Chrome 129', "ctx.configure({ device, format: 'rgba16float',\n  toneMapping: { mode: 'extended' } });  «允许 > 1.0»", '', { fs: 17 }),
    cc('视频 · MediaCapabilities', "decodingInfo({ video: { …,\n  transferFunction: 'pq', colorGamut: 'rec2020',\n  hdrMetadataType: 'smpteSt2086' } })", 'Safari、Chrome 支持', { fs: 17 }),
  ], 14), b(1) + .1);
  stag(c, g, b(1) + .2, 3.5);
});

S('x_dev', c => {
  const { b } = c;
  c.head('06', '手机、电视与墨水屏');
  const t = show(c, at(120, 240, 1680, tbl([['设备', '显示', '色域 / 亮度', '与 Web 的关系'], ['iPhone · iPad', 'OLED · mini-LED（XDR）', 'P3（2016 起）；余量约 8–16×', 'Safari 最早支持 P3；Safari 26 HDR 图片'], ['Android 手机', 'OLED 为主', '8.0 起可申请广色域；14 起 Ultra HDR 拍照', 'Chrome 显示 Ultra HDR / ISO 增益图'], ['HDR 电视', 'OLED · QD-OLED · mini-LED', 'HDR10（2015）· Dolby Vision · HLG', '主要靠流媒体 App；网页 HDR 视频靠 MediaCapabilities'], ['彩色墨水屏', 'E Ink Kaleido 3（2022）', '4096 色 · 16 级灰 · 彩色 150 ppi', '浏览器仍按 sRGB 渲染，屏幕自己近似'], ['打印', 'CMYK', '形状与 sRGB 不同', 'device-cmyk()、@color-profile 被标为“有风险”']], { st: 'font-size:21px' })), b(0) + .1);
  rowsIn(c, t, [[0, b(0) + .1], [1, F(c, 0, .15)], [2, F(c, 0, .45)], [3, F(c, 0, .75)], [4, b(1) + .1], [5, F(c, 1, .6)]]);
  show(c, at(120, 700, 1680, `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">${sw('rgb(255 0 0)', 'sRGB 红', '普通屏', { h: 70 })}${sw('rgb(196 92 84)', '墨水屏上的红（示意）', '饱和度低得多', { h: 70 })}${sw('#808080', '16 级灰', '', { h: 70 })}${sw('linear-gradient(90deg,#000,#fff)', '256 级灰', '', { h: 70 })}</div>`), F(c, 1, .3));
});

S('x_xr', c => {
  const { b } = c;
  c.head('07', '头显里的颜色');
  const t = show(c, at(120, 240, 1680, tbl([['平台', '显示', '浏览器里的颜色', 'WebXR'], ['visionOS 26 · Vision Pro', 'micro-OLED · 92% DCI-P3 · Dolby Vision / HDR10 / HLG', 'Safari 26：HDR 图片、dynamic-range-limit、WebGPU、&lt;model&gt;（.exr / .hdr 环境光）', '只有 immersive-vr；不能叠加透视画面'], ['Android XR · Galaxy XR', 'micro-OLED · 约 90% DCI-P3', 'Chrome', 'immersive-ar、深度、光照估计'], ['Horizon OS · Quest 3', 'LCD · 4MP 彩色透视', 'Quest Browser；原生应用默认 P3（较新文档）', 'immersive-ar：透明像素处显示现实']], { st: 'font-size:20px' })), b(0) + .1);
  rowsIn(c, t, [[0, b(0) + .1], [1, F(c, 0, .15)], [2, F(c, 0, .5)], [3, F(c, 0, .65)]]);
  show(c, at(120, 580, 820, cc('WebXR Layers（2026-08 草案）', "xrGLFactory.createProjectionLayer({\n  colorFormat: gl.SRGB8_ALPHA8,   «只有 RGBA / sRGB»\n});\n«没有浮点、P3 或 HDR 格式；合成器按 sRGB 处理»", '平面 Canvas 已能输出 P3 与 HDR', { fs: 19 })), b(1) + .1);
  show(c, at(980, 580, 820, mc(CR, 'visionOS 的“玻璃”', '<ul><li>窗口材质随房间明暗变化，限制背景颜色的范围</li><li>没有深色模式开关；系统色用深色取值</li><li>HIG：少用颜色，多用半透明；全沉浸时避免暗背景上的高亮闪烁</li><li>同一个颜色在不同房间看起来不同</li></ul>', 'Apple HIG · Color / Materials')), F(c, 1, .5));
});

S('x_who', c => {
  const { b } = c;
  c.head('08', '谁在推动');
  const L = show(c, lin(120, 240, 1680, 560, {
    hw: [180, 60, '硬件与系统', 'HP+微软 · Apple · Google · 微软', CP], img: [180, 260, '影像与广播', 'BBC · NHK · Dolby · Netflix · Adobe', CR], sci: [180, 460, '色彩科学', 'Ottosson · Oklab', OK],
    w3c: [760, 160, 'W3C / CSSWG', 'Chris Lilley · Tab Atkins · Lea Verou', CS], cg: [760, 360, 'Color on the Web CG', '2017 · 2021 研讨会', CS],
    br: [1300, 160, '浏览器工程师', 'WebKit · Chrome（Cameron）· Igalia · Mozilla', CS], tool: [1300, 360, '设计工具与框架', 'Sketch 2017 · Figma 2024 · Tailwind v4', 'var(--ink2)'], a11y: [1300, 520, '无障碍', 'WCAG · APCA', 'var(--bad)'],
  }, [['hw', 'w3c'], ['img', 'cg'], ['sci', 'w3c'], ['cg', 'w3c'], ['w3c', 'br'], ['br', 'tool'], ['a11y', 'w3c', 1], ['hw', 'br', 1]]), b(0) + .1);
  linIn(c, L, [['hw', b(0) + .2], ['w3c', F(c, 0, .3)], ['cg', F(c, 0, .55)], ['br', F(c, 0, .78)], ['img', b(1) + .1], ['sci', F(c, 1, .2)], ['tool', F(c, 1, .65)], ['a11y', F(c, 1, .9)]]);
});

S('x_end', c => {
  const { b } = c;
  c.head('09', '结尾');
  show(c, at(120, 240, 1680, `<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px">${mc(OK, '已经走完的', '<ul><li>sRGB → 色彩空间 + 坐标</li><li>感知均匀的 Oklab 成为默认</li><li>2023 年广色域 Baseline</li><li>HDR 图片与 dynamic-range-limit</li></ul>')}${mc('var(--bad)', '还没解决的', '<ul><li>色域映射算法</li><li>WCAG 3 对比度</li><li>Firefox 默认色彩管理</li><li>WebXR 的广色域与 HDR</li></ul>')}</div>`), b(0) + .1);
  show(c, at(120, 560, 1680, cc('给开发者', ':root { --brand: oklch(62% 0.19 262); }          «用 oklch 写调色板»\n.btn { color: #2f6fe0; color: var(--brand); }      «先给 sRGB 后备»\n@media (color-gamut: p3) { … }                    «渐进增强»\nimg { dynamic-range-limit: standard; }              «控制 HDR»', '', { fs: 20 })), b(1) + .1);
  show(c, at(120, 860, 1680, `<div class="det" style="position:static;font-size:20px"><span class="h">资料</span>调研文档《Web 平台的颜色：屏幕、规范与设备》与参考资料 · github.com/Memkits/desk · sources/web-color</div>`), F(c, 1, .6));
});
