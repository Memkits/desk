// ======================= 下集 · 搭建 =======================
// 颜色计算
const lab2rgb = (L, a, b) => { let y = (L + 16) / 116, x = a / 500 + y, z = y - b / 200; const f = t => t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787; x = 0.95047 * f(x); y = f(y); z = 1.08883 * f(z);
  const r = x * 3.2406 + y * -1.5372 + z * -0.4986, g = x * -0.9689 + y * 1.8758 + z * 0.0415, bl = x * 0.0557 + y * -0.2040 + z * 1.0570; const gm = c => c > 0.0031308 ? 1.055 * c ** (1 / 2.4) - 0.055 : 12.92 * c; return [gm(r), gm(g), gm(bl)]; };
const tone = (L, h, C) => { for (let c = C; c >= 0; c -= 1) { const r = lab2rgb(L, c * Math.cos(h * Math.PI / 180), c * Math.sin(h * Math.PI / 180)); if (r.every(v => v >= -1e-4 && v <= 1 + 1e-4)) return r.map(v => Math.max(0, Math.min(1, v))); } return [L / 100, L / 100, L / 100]; };
const hex = r => '#' + r.map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const lin = c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4, unlin = c => c > 0.0031308 ? 1.055 * c ** (1 / 2.4) - 0.055 : 12.92 * c;
const lum = r => { const l = r.map(lin); return .2126 * l[0] + .7152 * l[1] + .0722 * l[2]; };
const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
const h2r = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const deut = h => { const l = h2r(h).map(lin); const m = [[0.29031, 0.70969, 0], [0.29031, 0.70969, 0], [-0.02197, 0.02197, 1]]; return hex(m.map(r => Math.max(0, Math.min(1, unlin(r[0] * l[0] + r[1] * l[1] + r[2] * l[2]))))); };
const T = (t, h = 275, c = 60) => hex(tone(t, h, c));
const basis = (c, t) => { const e = c.el(`<div class="abs basis" style="right:120px;top:152px">依据 · ${t}</div>`); c.in(e, .6, { dy: 0 }); return e; };

S('b_hook', c => {
  const L = c.el(`<div class="abs" style="left:120px;top:150px;width:780px">
    <div class="cap" style="margin-bottom:22px">设计规范 · 下集：搭建</div>
    <h1 style="font-size:84px;line-height:1.12;margin:0;font-weight:800">把原则<br>落成一套<br>能执行的规范</h1></div>`);
  c.in(L, .2);
  const ph = c.el(phoneGood(1330, 110)); c.in(ph, .7, { dy: 30 });
  const R = c.el(`<div class="abs" style="left:120px;top:600px;width:1100px"><div class="steps6">${['颜色', '排版与空间', '动效', '装饰与着色器', '组件与治理', '有无规范'].map((x, i) => `<span><i>${i + 1}</i>${x}</span>`).join('')}</div>
    <div class="p" style="margin-top:26px">例子：会议室预约产品 <b>“青松”</b>。每章开头，先指回它依据的原理。</div></div>`);
  c.stagger(R.querySelectorAll('.steps6 span'), c.b(1) + .3, .4); c.in(R.querySelector('.p'), c.b(0) + 2);
});

S('b_color', c => {
  const h = c.head('01', '人眼的明暗，不是线性的'); basis(c, '明度感知 · 视觉搜索');
  // b0 HSL 同为 50%
  const A = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:600px"><div class="ttl">数值上一样亮</div><div class="note" style="margin-top:6px">HSL 明度都是 50%</div>
      <div style="display:flex;gap:20px;margin-top:30px">${['#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF'].map(x => `<div class="sw5" style="background:${x}"></div>`).join('')}</div>
      <div class="gray5" style="display:flex;gap:20px;margin-top:20px">${['#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF'].map(x => { const L = lum(h2r(x)), g = Math.round(unlin(L) * 255); return `<div class="sw5" style="background:rgb(${g},${g},${g})"><span>L* ${Math.round(116 * Math.cbrt(L) - 16)}</span></div>`; }).join('')}</div>
      <div class="note" style="margin-top:12px">下排：去掉颜色后，人眼感到的明度</div></div>
    <div class="card rs" style="min-height:600px">${badge('law', '色度学')}<span class="note" style="margin-left:10px">CIELAB 1976 · OKLab 2020</span>
      <div class="p" style="margin-top:20px">感知均匀的色彩空间：<b>数值差多少，看起来就差多少</b>。</div>
      <div class="p" style="margin-top:14px">专业色板的第一步：在这样的空间里，<b>按明度分档</b>。</div>
      <div style="margin-top:40px;display:flex;gap:8px">${[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(t => `<div style="flex:1;height:60px;border-radius:8px;background:${T(t, 0, 0)}"></div>`).join('')}</div>
      <div style="display:flex;justify-content:space-between;margin-top:8px" class="note"><span>L* 0</span><span>50</span><span>100</span></div></div></div>`);
  c.in(A.children[0], .5); c.in(A.querySelector('.gray5'), c.b(0) + c.sc.beats[0].d * .45); c.in(A.children[1], c.b(0) + c.sc.beats[0].d * .7);
  // b1 色阶
  const H = [['蓝', 275, 60], ['青', 190, 40], ['橙', 45, 60], ['中性', 275, 4]], TT = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const B = c.el(`<div class="abs card" style="left:120px;top:250px;width:1680px;padding:30px 40px">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="ttl">同一档明度，不同色相</span><span class="note">明度 L* 0–100 · 每档等距</span></div>
    <div class="ramp"><span></span>${TT.map(t => `<span class="tn">${t}</span>`).join('')}</div>
    ${H.map(([n, hh, cc]) => `<div class="ramp rr"><span>${n}</span>${TT.map(t => `<i style="background:${T(t, hh, cc)}"></i>`).join('')}</div>`).join('')}
    <div class="ramp"><span></span>${TT.map(t => `<span class="cl${t === 40 ? ' on' : ''}"></span>`).join('')}</div>
    <div class="p" style="margin-top:6px">蓝 40 和橙 40 看起来一样“重”：<b>换色相，层级不乱</b>。</div></div>`);
  c.out(A, c.b(1)); c.in(B, c.b(1) + .1); c.stagger(B.querySelectorAll('.rr'), c.b(1) + .8, .5);
  c.anim(B.querySelector('.cl.on'), [{ opacity: 0 }, { opacity: 1 }], c.b(1) + c.sc.beats[1].d * .6, .4);
  // b2 对比度估算
  const P = [[40, 100, 275, 60], [30, 90, 190, 40], [50, 100, 45, 60], [60, 100, 275, 60]];
  const Cc = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px">
    <div class="card rs"><div style="display:flex;gap:12px;align-items:center">${badge('exp', '经验规则')}<span class="note">Material Color Utilities：色调差 40 → 约 3 : 1，差 50 → 约 4.5 : 1</span></div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:30px">${P.map(([a, b, hh, cc]) => { const A1 = tone(a, hh, cc), B1 = tone(b, hh, cc), k = cr(A1, B1); return `<div class="pair" style="background:${hex(A1)};color:${hex(B1)}">${a} 配 ${b}<small>差 ${b - a} · ${k.toFixed(2)} : 1 ${k >= 4.5 ? '✓' : '✕'}</small></div>`; }).join('')}</div>
    <div class="p" style="margin-top:30px;font-size:25px">先按档位差排除，<b>卡在边界的再实测</b>：50 配 100 只有 4.48，差一点不达标。</div></div></div>`);
  c.out(B, c.b(2)); c.in(Cc, c.b(2) + .1); c.stagger(Cc.querySelectorAll('.pair'), c.b(2) + 1.5, .5); c.anim(Cc.querySelectorAll('.pair')[2], [{ boxShadow: '0 0 0 0 #D1492E' }, { boxShadow: '0 0 0 6px #D1492E' }], c.b(2) + c.sc.beats[2].d * .7, .4);
  // b3 语义角色 + 暗色
  const roles = [['primary', 40, 80], ['on-primary', 100, 20], ['container', 90, 30], ['surface', 98, 6]];
  const mini = (dark) => { const t = i => roles[i][dark ? 2 : 1]; const surf = dark ? T(t(3), 275, 4) : T(t(3), 275, 4), txt = dark ? T(90, 275, 4) : T(10, 275, 4);
    return `<div class="mini2" style="background:${surf};color:${txt}"><b style="font-size:26px">预约会议室</b><div style="opacity:.7;margin:6px 0 18px">10 月 28 日 · 6 人</div>
      <div style="background:${T(t(2))};color:${dark ? T(90) : T(10)};border-radius:12px;padding:14px 16px;margin-bottom:16px">三楼 · 青松厅 · 可坐 8 人</div>
      <div style="background:${T(t(0))};color:${T(t(1), 275, t(1) > 50 ? 4 : 60)};border-radius:12px;height:56px;display:grid;place-items:center;font-weight:600">预约 10:00 – 11:00</div></div>`; };
  const D = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:620px 1fr 1fr;gap:28px">
    <div class="card" style="padding:24px 30px"><div class="rm hd2"><span>角色</span><span>浅色</span><span>深色</span></div>
      ${roles.map(([n, a, b], i) => `<div class="rm"><span class="k">${n}</span><b style="background:${i === 3 ? T(a, 275, 4) : T(a, 275, i === 1 ? 4 : 60)};color:${a > 55 ? '#16181D' : '#fff'}">${a}</b><b style="background:${i === 3 ? T(b, 275, 4) : T(b)};color:${b > 55 ? '#16181D' : '#fff'}">${b}</b></div>`).join('')}
      <div style="margin-top:18px">${badge('conv', '参考 · Material 3 色调映射')}</div></div>
    <div>${mini(false)}<div class="note" style="margin-top:10px;text-align:center">浅色</div></div><div>${mini(true)}<div class="note" style="margin-top:10px;text-align:center">深色：换一组档位，档位差不变</div></div></div>`);
  c.out(Cc, c.b(3)); c.stagger(D.children, c.b(3) + .1, c.sc.beats[3].d * .3);
  // b4 色觉
  const ok = '#1F7A4D', er = '#C4321C';
  const E = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:600px"><div class="ttl">只靠颜色</div><div class="cbx">
      <div><div class="note">正常色觉</div><div class="st" style="border-color:${ok}">会议室 A</div><div class="st" style="border-color:${er}">会议室 B</div></div>
      <div><div class="note">红绿色觉缺陷（模拟）</div><div class="st" style="border-color:${deut(ok)}">会议室 A</div><div class="st" style="border-color:${deut(er)}">会议室 B</div></div></div>
      <div class="note" style="margin-top:20px">哪个可用、哪个冲突？右边几乎分不出来</div></div>
    <div class="card rs" style="min-height:600px"><div class="ttl">颜色 + 图标 + 文字</div><div class="cbx">
      <div><div class="note">正常色觉</div><div class="st" style="border-color:${ok}"><b style="color:${ok}">✓ 可预约</b>会议室 A</div><div class="st" style="border-color:${er}"><b style="color:${er}">⚠ 时间冲突</b>会议室 B</div></div>
      <div><div class="note">红绿色觉缺陷（模拟）</div><div class="st" style="border-color:${deut(ok)}"><b style="color:${deut(ok)}">✓ 可预约</b>会议室 A</div><div class="st" style="border-color:${deut(er)}"><b style="color:${deut(er)}">⚠ 时间冲突</b>会议室 B</div></div></div>
      <div style="margin-top:20px;display:flex;gap:12px;align-items:center">${badge('std', 'WCAG 1.4.1 · 不只用颜色')}<span class="note">北欧血统男性约 8% 有红绿色觉缺陷</span></div></div></div>`);
  c.out(D, c.b(4)); c.in(E.children[0], c.b(4) + .1); c.in(E.children[1], c.b(4) + c.sc.beats[4].d * .45);
  // b5 对比度矩阵
  const fg = [['正文', 10, 275, 4], ['次要文字', 45, 275, 4], ['主色', 40, 275, 60], ['错误', 40, 30, 70]], bg = [['表面', 98, 275, 4], ['容器', 90, 275, 60], ['卡片', 100, 0, 0], ['分隔', 92, 275, 4]];
  const F = c.el(`<div class="abs card rs" style="left:120px;top:250px;width:1680px">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><span class="ttl">对比度矩阵：每一对前景 × 背景</span><span class="note">交给工具跑，不靠眼睛</span></div>
    <div class="cm"><div></div>${bg.map(b => `<div class="ch">${b[0]}</div>`).join('')}
    ${fg.map(f => `<div class="rh2">${f[0]}</div>` + bg.map(b => { const k = cr(tone(f[1], f[2], f[3]), tone(b[1], b[2], b[3])); return `<div class="cc2 ${k >= 4.5 ? 'ok' : k >= 3 ? 'mid' : 'no'}" style="background:${T(b[1], b[2], b[3])};color:${T(f[1], f[2], f[3])}">Aa<small>${k.toFixed(1)}</small></div>`; }).join('')).join('')}</div>
    <div class="note" style="margin-top:10px">绿框 ≥ 4.5 · 黄框 ≥ 3（只适合大字和图形） · 红框不合格</div></div>`);
  c.out(E, c.b(5)); c.in(F, c.b(5) + .1); c.stagger(F.querySelectorAll('.cc2'), c.b(5) + c.sc.beats[5].d * .4, .05, { dy: 0, scale: .85, d: .3 });
  const h2 = c.swapHead(h, '按明度建色阶', c.b(1));
  const h3 = c.swapHead(h, '用色阶差估算对比度', c.b(2)); c.out(h2, c.b(2));
  const h4 = c.swapHead(h, '页面只写角色，暗色换档位', c.b(3)); c.out(h3, c.b(3));
  const h5 = c.swapHead(h, '不能只靠颜色传达信息', c.b(4)); c.out(h4, c.b(4));
  c.swapHead(h, '最后，全部组合跑一遍', c.b(5)); c.out(h5, c.b(5));
});

S('b_type', c => {
  const h = c.head('02', '字号用阶梯，不随手取值'); basis(c, '阅读 · 格式塔分组');
  const gen = [39.1, 31.3, 25, 20, 16, 12.8], tun = [40, 32, 24, 20, 16, 13];
  const A = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:620px"><div class="ttl">按比例生成 · 每级 × 1.25</div>${gen.map(s => `<div class="tsl"><span class="k">${s}</span><span style="font-size:${s}px">预约会议室</span></div>`).join('')}<div class="note" style="margin-top:10px">小数、太密的级差</div></div>
    <div class="card rs" style="min-height:620px"><div class="ttl">生成后再手调</div>${tun.map((s, i) => `<div class="tsl"><span class="k">${s}</span><span style="font-size:${s}px;font-weight:${i < 2 ? 700 : i < 4 ? 600 : 400}">${['大标题', '页面标题', '区块标题', '小标题', '正文 · 预约会议室', '注释 · 超过 4 小时需审批'][i]}</span></div>`).join('')}<div class="note" style="margin-top:10px">整数、对齐 4 的网格，常用的正文和小标题落在合适位置</div></div></div>`);
  c.in(A.children[0], .5); c.in(A.children[1], c.b(0) + c.sc.beats[0].d * .55);
  const B = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px">
    ${[[16, 1.75, '0', '正文', '中文正文行高 1.5–1.8：会议室预约需要提前一天提交，超过四小时的会议需要部门负责人审批。'], [32, 1.3, '0', '标题', '下午还有三间会议室可以预约'], [64, 1.1, '-0.02em', '大字', '三间空着']].map(([s, l, ls, n, t]) => `<div class="card rs" style="min-height:440px"><div class="note">${n} · ${s} / 行高 ${l}${ls !== '0' ? ' / 字距 −2%' : ''}</div><div style="margin-top:20px;font-size:${s}px;line-height:${l};letter-spacing:${ls};font-weight:${s > 20 ? 700 : 400}">${t}</div></div>`).join('')}</div>`);
  const B2 = c.el(`<div class="abs card rs" style="left:120px;top:720px;width:1680px;display:flex;gap:60px;align-items:center"><b style="font-size:24px">数字用等宽字形</b>
    <div class="nums" style="font-feature-settings:'tnum' 0">¥ 1,118.00<br>¥ 880.50</div><span class="note">比例数字 · 对不齐</span><div class="nums" style="font-feature-settings:'tnum' 1">¥ 1,118.00<br>¥ 880.50</div><span class="note">等宽数字 · 对齐</span></div>`);
  c.out(A, c.b(1)); c.stagger(B.children, c.b(1) + .1, .6); c.in(B2, c.b(1) + c.sc.beats[1].d * .7);
  const Cj = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:620px"><div class="ttl">中西文间距</div>
      <div class="tx"><b style="color:#D1492E">✕</b><span>在iOS 26和Android 16上，按钮高度为48dp。</span></div>
      <div class="tx"><b style="color:#1F7A4D">✓</b><span>在 iOS 26 和 Android 16 上，按钮高度为 48 dp。</span></div>
      <div class="note" style="margin-top:14px">CSS：<span class="k" style="font-size:19px">text-autospace</span> 可由浏览器自动加</div></div>
    <div class="card rs" style="min-height:620px"><div class="ttl">标点挤压与行首禁则</div>
      <div class="tx"><b style="color:#D1492E">✕</b><span style="width:330px;display:inline-block">会议室预约成功<br>，请准时参加。</span></div>
      <div class="tx"><b style="color:#1F7A4D">✓</b><span style="width:330px;display:inline-block">会议室预约成功，<br>请准时参加。</span></div>
      <div class="note" style="margin-top:14px">句号逗号不能出现在行首；连续标点要挤压半个字宽</div>
      <div style="margin-top:20px">${badge('conv', 'W3C · 中文排版需求（clreq）')}</div></div></div>`);
  c.out(B, c.b(2)); c.out(B2, c.b(2)); c.in(Cj.children[0], c.b(2) + .1); c.in(Cj.children[1], c.b(2) + c.sc.beats[2].d * .45);
  // b3 间距与栅格
  const D = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:600px 1fr;gap:40px">
    <div class="card rs" style="min-height:620px"><div class="ttl">间距令牌 · 4 的倍数</div>${[4, 8, 12, 16, 24, 32, 48].map(v => `<div class="spr"><span class="k">space.${v / 4}</span><i style="width:${v * 5}px"></i><em>${v}</em></div>`).join('')}<div class="note" style="margin-top:12px">组内用小档，组间用大档</div></div>
    <div class="card" style="min-height:620px;position:relative;overflow:hidden;padding:30px"><div class="ttl" style="margin-bottom:14px">栅格：栏 · 槽 · 页边距</div>
      <div class="gridv">${Array.from({ length: 12 }, () => '<i></i>').join('')}</div>
      <div class="gcont"><div style="grid-column:1/9;height:90px" class="gb"></div><div style="grid-column:9/13;height:90px" class="gb"></div><div style="grid-column:1/5;height:220px" class="gb"></div><div style="grid-column:5/9;height:220px" class="gb"></div><div style="grid-column:9/13;height:220px" class="gb"></div></div>
      <div class="note" style="position:absolute;left:30px;bottom:22px">断点按内容在哪里开始别扭来定，而不是按某款手机的宽度</div></div></div>`);
  c.out(Cj, c.b(3)); c.in(D.children[0], c.b(3) + .1); c.stagger(D.querySelectorAll('.spr'), c.b(3) + .6, .2); c.in(D.children[1], c.b(3) + c.sc.beats[3].d * .45);
  // b4 密度、流式字号、容器查询
  const row = (h) => `<div style="height:${h}px;border-bottom:1px solid #E6E3DC;display:flex;align-items:center;justify-content:space-between;padding:0 6px;font-size:${h > 50 ? 20 : 16}px"><span>三楼 · 青松厅</span><span style="color:var(--ink3)">10:00</span></div>`;
  const E = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px">
    <div class="card rs" style="min-height:620px"><div class="ttl">同一套令牌，两档密度</div><div style="display:flex;gap:16px;margin-top:20px"><div style="flex:1"><div class="note">紧凑 · 后台</div>${row(40).repeat(7)}</div><div style="flex:1"><div class="note">宽松 · 移动端</div>${row(64).repeat(5)}</div></div></div>
    <div class="card rs" style="min-height:620px"><div class="ttl">字号随宽度连续变化</div><div class="k" style="font-size:19px;margin:20px 0;background:#F6F5F1;padding:14px;border-radius:10px">font-size:<br>clamp(28px, 2vw + 16px, 40px)</div>
      <svg width="440" height="240" font-family="Inter,Noto Sans CJK SC"><line x1="30" y1="210" x2="430" y2="210" stroke="#CBC6BB"/><path d="M30 180 L110 180 L330 60 L430 60" stroke="#2F5BEA" stroke-width="4" fill="none"/><path d="M30 180 L200 180 L200 120 L330 120 L330 60 L430 60" stroke="#B3AEA3" stroke-width="3" stroke-dasharray="6 6" fill="none"/><text x="230" y="234" font-size="16" fill="#7C818C" text-anchor="middle">屏幕宽度 →</text><text x="430" y="50" font-size="16" fill="#2F5BEA" text-anchor="end">连续</text><text x="250" y="112" font-size="16" fill="#7C818C">按断点跳级</text></svg></div>
    <div class="card rs" style="min-height:620px"><div class="ttl">按容器宽度排版</div><div class="cq"><div class="cqn"><i></i><div><b>青松厅</b><span>8 人 · 投影</span></div></div><div class="cqw"><i></i><div><b>青松厅</b><span>8 人 · 投影 · 白板 · 视频会议</span></div><em>预约</em></div></div><div class="note" style="margin-top:14px">同一张卡片：放在窄栏里竖排，宽栏里横排</div></div></div>`);
  c.out(D, c.b(4)); c.stagger(E.children, c.b(4) + .1, c.sc.beats[4].d * .3);
  // b5 光学修正
  const F = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:28px">
    <div class="card op"><span class="tech">同心圆角</span><div class="dm"><div class="cc bad"><div></div></div><div class="cc good"><div></div></div></div><div class="lr"><span>内外同为 36</span><span>外 = 内 + 内边距<br><b class="k">16 + 20 = 36</b></span></div></div>
    <div class="card op"><span class="tech">光学居中</span><div class="dm">
      <svg width="130" height="130" viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="#16181D"/><path d="M38 34 L38 86 L82 60Z" fill="#fff"/><line x1="60" y1="8" x2="60" y2="112" stroke="#9AA0AA" stroke-width="1.5" stroke-dasharray="4 4"/><circle cx="52.7" cy="60" r="4" fill="#D1492E"/></svg>
      <svg width="130" height="130" viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="#16181D"/><path d="M45 34 L45 86 L89 60Z" fill="#fff"/><line x1="60" y1="8" x2="60" y2="112" stroke="#9AA0AA" stroke-width="1.5" stroke-dasharray="4 4"/><circle cx="59.7" cy="60" r="4" fill="#1F7A4D"/></svg></div>
      <div class="lr"><span>按外框居中<br>重心偏左</span><span>按重心居中<br>重心落在圆心</span></div></div>
    <div class="card op"><span class="tech">形状的视觉大小</span><div class="dm"><div style="display:flex;gap:30px;align-items:center"><i style="width:110px;height:110px;background:#16181D;border-radius:6px"></i><i style="width:110px;height:110px;background:#16181D;border-radius:50%"></i></div><div style="display:flex;gap:30px;align-items:center"><i style="width:110px;height:110px;background:#16181D;border-radius:6px"></i><i style="width:122px;height:122px;background:#16181D;border-radius:50%"></i></div></div>
      <div class="lr"><span>同为 110<br>圆显得小</span><span>圆放大约 10%<br>看起来一样大</span></div></div></div>`);
  const F2 = c.el(`<div class="abs p" style="left:120px;top:800px;width:1680px;font-size:24px">设计师最后一遍检查的，常常是这些 <b>“数值正确、看着不对”</b> 的地方。</div>`);
  c.out(E, c.b(5)); c.stagger(F.children, c.b(5) + .1, c.sc.beats[5].d * .25); c.in(F2, c.b(5) + c.sc.beats[5].d * .8);
  const h2 = c.swapHead(h, '字越大，行高越紧', c.b(1));
  const h3 = c.swapHead(h, '中文排版的细节', c.b(2)); c.out(h2, c.b(2));
  const h4 = c.swapHead(h, '组内小、组间大：间距与栅格', c.b(3)); c.out(h3, c.b(3));
  const h5 = c.swapHead(h, '密度、流式字号、容器查询', c.b(4)); c.out(h4, c.b(4));
  c.swapHead(h, '数值对齐之后，还要视觉对齐', c.b(5)); c.out(h5, c.b(5));
});

S('b_motion', c => {
  const h = c.head('03', '运动会被看成分组，也会抢注意力'); basis(c, '共同命运 · 物体恒常 · 注意力');
  // b0 知觉依据：共同命运 + 物体恒常
  const A = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:600px">${badge('exp', '格式塔 · 共同命运')}<div class="cf" style="position:relative;height:400px;margin-top:20px;background:#F6F5F1;border-radius:14px">${Array.from({ length: 24 }, (_, i) => `<i class="d${i % 4 === 1 ? ' mv' : ''}" style="left:${40 + (i % 6) * 110}px;top:${40 + Math.floor(i / 6) * 90}px"></i>`).join('')}</div><div class="note" style="margin-top:12px">一起运动的点，立刻被看成一组</div></div>
    <div class="card rs" style="min-height:600px">${badge('law', '物体恒常 · 连续运动')}<div style="position:relative;height:400px;margin-top:20px;background:#F6F5F1;border-radius:14px;overflow:hidden">
      <div class="oc" style="position:absolute;left:40px;top:40px;width:200px;height:120px;border-radius:14px;background:#fff;box-shadow:0 6px 16px rgba(0,0,0,.08);padding:16px;font-size:20px"><b>青松厅</b><div class="note">10:00</div></div></div>
      <div class="note" style="margin-top:12px">有过渡，人才认得出“还是同一个东西”；直接跳过去，要重新找</div></div></div>`);
  c.in(A, .4);
  A.querySelectorAll('.cf .mv').forEach(e => c.anim(e, [{ transform: 'none' }, { transform: 'translate(60px,-30px)' }, { transform: 'none' }], c.b(0) + 1.5, 2.4, 'io', 'none'));
  c.anim(A.querySelector('.cf'), [{ opacity: 1 }, { opacity: 1 }], 0, .01);
  c.anim(A.querySelector('.oc'), [{ transform: 'none' }, { transform: 'translate(420px,220px)' }], c.b(0) + c.sc.beats[0].d * .55, .6, 'std');
  // b1 为什么动
  const B = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:repeat(4,1fr);gap:22px">
    ${[['反馈', '按下、提交、成功：告诉人“收到了”', '#7445D6'], ['关系', '面板从按钮里展开：说明它从哪里来', '#2F5BEA'], ['引导', '新出现的内容轻轻提示一下', '#0E8A7E'], ['品牌', '少量、克制，只在关键时刻', '#B7791F']].map(([t, d, col]) => `<div class="card rs pp" style="min-height:380px;border-top:6px solid ${col}"><div style="font-size:34px;font-weight:800;color:${col}">${t}</div><div class="p" style="margin-top:18px">${d}</div></div>`).join('')}</div>`);
  const B2 = c.el(`<div class="abs card rs" style="left:120px;top:680px;width:1680px;border-left:6px solid var(--ink)"><span class="note">上集原则 03</span><div style="font-size:30px;font-weight:700;margin-top:6px">没有状态变化，就不加动效。</div></div>`);
  c.out(A, c.b(1)); c.stagger(B.children, c.b(1) + .2, .5); c.in(B2, c.b(1) + c.sc.beats[1].d * .7);
  // b2 时长
  const C = c.el(`<div class="abs card" style="left:120px;top:250px;width:1680px;padding:32px 40px">
    <div style="display:flex;justify-content:space-between;align-items:baseline"><div style="display:flex;gap:12px;align-items:center">${badge('exp', '经验建议')}<span class="note">Nielsen Norman Group：多数界面动效 100–500 ms</span></div><span class="note">令牌取值为本片示例</span></div>
    ${[['motion.fast', 100, '开关、勾选、按下'], ['motion.base', 200, '菜单、提示；弹窗退出'], ['motion.slow', 300, '弹窗、底部面板进入'], ['motion.page', 450, '整页转场、长距离移动']].map(([n, v, d]) => `<div class="du"><span class="k">${n}</span><i style="--w:${v}"></i><em>${v} ms</em><small>${d}</small></div>`).join('')}
    <div class="p" style="margin-top:22px">移动距离越远、面积越大，时长越长；<b>出现比消失略慢一点</b>（例：进入 300，退出 200）。</div></div>`);
  c.out(B, c.b(2)); c.out(B2, c.b(2)); c.in(C, c.b(2) + .1); c.stagger(C.querySelectorAll('.du'), c.b(2) + 1.2, .5);
  // b3 缓动与弹簧
  const D = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:600px"><div class="ttl">缓动令牌</div>
      <svg width="740" height="440" viewBox="0 0 740 440" style="margin-top:10px" font-family="Inter,Noto Sans CJK SC"><g transform="translate(50,30)">
        <rect width="340" height="340" fill="none" stroke="#E0DCD3"/><line x1="0" y1="340" x2="340" y2="0" stroke="#E0DCD3" stroke-dasharray="4 6"/>
        <path class="e0" d="M0,340 C68,340 0,0 340,0" fill="none" stroke="#16181D" stroke-width="4"/><path class="e1" d="M0,340 C0,340 68,0 340,0" fill="none" stroke="#2F5BEA" stroke-width="4"/><path class="e2" d="M0,340 C136,340 340,0 340,0" fill="none" stroke="#D1492E" stroke-width="4"/>
        <text x="170" y="378" text-anchor="middle" font-size="18" fill="#7C818C">时间 →</text></g>
        <g font-size="22"><rect x="430" y="80" width="22" height="5" fill="#16181D"/><text x="462" y="90">motion.standard</text><text x="462" y="118" font-size="18" fill="#7C818C">屏幕内移动</text>
        <rect x="430" y="180" width="22" height="5" fill="#2F5BEA"/><text x="462" y="190">motion.enter</text><text x="462" y="218" font-size="18" fill="#7C818C">减速：快到、慢停</text>
        <rect x="430" y="280" width="22" height="5" fill="#D1492E"/><text x="462" y="290">motion.exit</text><text x="462" y="318" font-size="18" fill="#7C818C">加速：慢起、快走</text></g></svg></div>
    <div class="card rs" style="min-height:600px"><div class="ttl">或者用弹簧描述</div>
      <svg width="740" height="320" style="margin-top:20px"><line x1="30" y1="200" x2="720" y2="200" stroke="#E0DCD3" stroke-dasharray="4 6"/><path class="spg" d="${Array.from({ length: 120 }, (_, i) => { const t = i / 119 * 1.2; const y = 1 - Math.exp(-6 * t) * Math.cos(16 * t); return `${i ? 'L' : 'M'}${30 + i * 5.8} ${290 - y * 90}`; }).join(' ')}" stroke="#7445D6" stroke-width="4" fill="none"/></svg>
      <div class="p">参数：<b>刚度 · 阻尼</b>，或 <b>时长 · 回弹</b>。<br>弹簧没有固定的“结束时间”，被打断时也更自然。</div></div></div>`);
  c.out(C, c.b(3)); c.in(D.children[0], c.b(3) + .1); ['.e0', '.e1', '.e2'].forEach((s, i) => c.in(D.querySelector(s), c.b(3) + .5 + i * 1.2, { dy: 0 }));
  c.in(D.children[1], c.b(3) + c.sc.beats[3].d * .6);
  // b4 可打断 + 编排
  const E = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:600px"><div class="ttl">中途打断</div>
      <svg width="740" height="360" style="margin-top:14px" font-family="Inter,Noto Sans CJK SC"><line x1="40" y1="320" x2="720" y2="320" stroke="#CBC6BB"/><line x1="40" y1="20" x2="40" y2="320" stroke="#CBC6BB"/>
        <path d="M40 300 C120 300, 160 160, 260 120" stroke="#16181D" stroke-width="4" fill="none"/>
        <line x1="260" y1="20" x2="260" y2="320" stroke="#B7791F" stroke-dasharray="5 6"/><text x="266" y="40" font-size="18" fill="#B7791F">又点了一下</text>
        <path class="ib" d="M260 300 C340 300, 380 220, 520 210" stroke="#D1492E" stroke-width="4" fill="none" stroke-dasharray="10 8"/>
        <path class="ig" d="M260 120 C300 96, 340 130, 420 190 S 560 220, 700 212" stroke="#1F7A4D" stroke-width="4" fill="none"/>
        <text x="530" y="290" font-size="19" fill="#D1492E" class="ib">✕ 跳回起点重来</text><text x="520" y="170" font-size="19" fill="#1F7A4D" class="ig">✓ 从当前位置、带着速度接着走</text>
        <text x="380" y="348" font-size="16" fill="#7C818C" text-anchor="middle">时间 →</text></svg></div>
    <div class="card rs" style="min-height:600px"><div class="ttl">编排：主元素先动，其余依次跟上</div>
      <div class="chor">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<div class="ci${i === 0 ? ' lead' : ''}"></div>`).join('')}</div>
      <div class="p" style="margin-top:20px">间隔几十毫秒；<b>依次出现的数量要有上限</b>，超出的一起出现。</div></div></div>`);
  c.out(D, c.b(4)); c.in(E.children[0], c.b(4) + .1); c.in(E.querySelectorAll('.ib')[0], c.b(4) + 2, { dy: 0 }); c.in(E.querySelectorAll('.ib')[1], c.b(4) + 2, { dy: 0 });
  c.in(E.querySelectorAll('.ig')[0], c.b(4) + 3.5, { dy: 0 }); c.in(E.querySelectorAll('.ig')[1], c.b(4) + 3.5, { dy: 0 });
  c.in(E.children[1], c.b(4) + c.sc.beats[4].d * .5);
  const cis = E.querySelectorAll('.ci'); cis.forEach((e, i) => c.in(e, c.b(4) + c.sc.beats[4].d * .6 + (i === 0 ? 0 : .25 + Math.min(i, 5) * .06), { dy: 20, d: .4 }));
  // b5 性能
  const F = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:600px"><div class="ttl">每一帧的时间预算</div>
      <div class="fb"><span>60 Hz</span><div><i style="width:100%"></i></div><em>16.7 ms</em></div><div class="fb"><span>120 Hz</span><div><i style="width:50%"></i></div><em>8.3 ms</em></div>
      <div class="pipe">${['样式', '布局', '绘制', '合成'].map((x, i) => `<span class="pp${i}">${x}</span>`).join('<b>→</b>')}</div>
      <div class="note" style="margin-top:10px">改宽高、位置：从“布局”开始重算；改位移、透明度：只需“合成”</div></div>
    <div class="card rs" style="min-height:600px"><div class="ttl">动画只动这些属性</div>
      <div class="okp">${['transform · 位移、缩放、旋转', 'opacity · 透明度'].map(x => `<div><b>✓</b>${x}</div>`).join('')}</div>
      <div class="nop">${['width / height', 'top / left / margin', 'box-shadow 大面积变化'].map(x => `<div><b>✕</b>${x}</div>`).join('')}</div></div></div>`);
  c.out(E, c.b(5)); c.in(F.children[0], c.b(5) + .1); c.in(F.children[1], c.b(5) + c.sc.beats[5].d * .5);
  c.anim(F.querySelector('.pipe .pp3'), [{ background: '#F2F3F5', color: '#454A55' }, { background: '#1F7A4D', color: '#fff' }], c.b(5) + c.sc.beats[5].d * .6, .4);
  // b6 对比演示（来自动效样片）
  c.out(F, c.b(6));
  const demo = (A0, showIn, hideAt) => {
  const G = c.el(`<div class="abs" style="left:120px;top:236px;width:1680px;height:700px"></div>`);
  const phone = id => `<div class="phone pm" style="background:#101114"><div class="scr" style="width:100%;height:100%;border-radius:42px;background:#fff;overflow:hidden;position:relative">
    <div style="position:absolute;left:50%;top:10px;width:100px;height:28px;margin-left:-50px;border-radius:16px;background:#101114;z-index:5"></div>
    <div class="phc"><h3>预约会议室</h3><div class="m">10 月 28 日 周二 · 6 人</div><div class="lab">时间</div><div class="fld">10:00 – 11:00<small>›</small></div>
    <div class="lab">会议室</div><div class="fld" id="${id}f"><span style="position:relative;flex:1;height:24px"><span id="${id}ph" style="position:absolute;left:0;top:0;color:#9A9FA8">请选择</span><span id="${id}v" style="position:absolute;left:0;top:0;opacity:0">三楼 · 青松厅</span></span><small>›</small></div></div>
    <div class="pbtn" id="${id}b"><span id="${id}bt">预约</span><i class="spin" id="${id}s"></i><span class="ok" id="${id}o">✓ 已预约</span></div>
    <div class="scrim" id="${id}scrim"></div>
    <div class="sheet" id="${id}sh"><div class="grab"></div><h4>选择会议室</h4>${[['三楼 · 青松厅', '8 人'], ['三楼 · 竹影厅', '6 人'], ['五楼 · 观澜厅', '12 人'], ['五楼 · 听雨厅', '4 人']].map((r, i) => `<div class="it" id="${id}i${i}">${r[0]}<small>${r[1]}</small></div>`).join('')}</div></div></div>`;
  G.innerHTML = `<div class="col" style="left:0"><div class="lb">${badge('conv', '各写各的')}<span class="note">匀速 600 ms，一起出现</span></div>${phone('a')}</div>
    <div class="col" style="left:420px"><div class="lb">${badge('law', '按动效令牌')}<span class="note">进入减速 · 依次出现</span></div>${phone('b')}</div>
    <div class="tl2"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px"><b style="font-size:24px">右边用到的令牌</b><span class="note clock">0.00 s</span></div><div class="tracks" style="position:relative"></div>
      <div class="rmo card" style="margin-top:26px;padding:18px 22px">${badge('std', '减少动态效果')}<div class="p" style="margin-top:10px;font-size:21px">系统开启时：位移和缩放 → 淡入淡出，或直接跳到结果。</div></div></div>`;
  if (showIn > c.b(6) + 1) c.in(G, showIn, { dy: 0, d: .4 }); else c.in(G, showIn);
  if (hideAt) c.out(G, hideAt, { d: .3 });
  const $ = id => G.querySelector('#' + id);
  const tap = (p, x, y, t) => { const el = document.createElement('div'); el.className = 'tap'; el.style.left = x + 'px'; el.style.top = y + 'px'; $(p + 'sh').parentNode.appendChild(el); c.anim(el, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'scale(1)', offset: .3 }, { opacity: 0, transform: 'scale(1.3)' }], t, .45, 'ease-out', 'forwards'); };
  const T1 = A0, T2 = A0 + 2.4, T3 = A0 + 4.2, EN = 7.2;
  tap('a', 170, 300, T1); c.anim($('ascrim'), [{ opacity: 0 }, { opacity: 1 }], T1 + .15, .01); c.anim($('ash'), [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], T1 + .15, .6, 'lin');
  tap('a', 150, 360, T2); c.anim($('ash'), [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }], T2 + .15, .6, 'lin', 'forwards'); c.anim($('ascrim'), [{ opacity: 1 }, { opacity: 0 }], T2 + .75, .01, 'lin', 'forwards');
  c.anim($('av'), [{ opacity: 0 }, { opacity: 1 }], T2 + .75, .01); c.anim($('aph'), [{ opacity: 1 }, { opacity: 0 }], T2 + .75, .01);
  tap('a', 170, 578, T3); c.anim($('abt'), [{ opacity: 1 }, { opacity: 0 }], T3 + 1.2, .01); c.anim($('ao'), [{ opacity: 0 }, { opacity: 1 }], T3 + 1.2, .01);
  const tr = []; tap('b', 170, 300, T1); const s0 = T1 + .12;
  c.anim($('bscrim'), [{ opacity: 0 }, { opacity: 1 }], s0, .2, 'std'); tr.push(['motion.base · 遮罩', s0, .2]);
  c.anim($('bsh'), [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], s0 + .04, .3, 'in'); tr.push(['motion.slow · 面板', s0 + .04, .3]);
  for (let i = 0; i < 4; i++) c.anim($('bi' + i), [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], s0 + .16 + i * .03, .2, 'in'); tr.push(['stagger 30 ms · 选项', s0 + .16, .29]);
  tap('b', 150, 360, T2); c.anim($('bi0'), [{ background: '#fff', borderColor: '#E8E9EC' }, { background: '#EEF2FE', borderColor: '#2F5BEA' }], T2 + .05, .1);
  const s1 = T2 + .2; c.anim($('bsh'), [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }], s1, .2, 'out', 'forwards'); tr.push(['motion.base · 收起', s1, .2, 1]);
  c.anim($('bscrim'), [{ opacity: 1 }, { opacity: 0 }], s1, .2, 'out', 'forwards');
  c.anim($('bv'), [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], s1 + .12, .2, 'in'); c.anim($('bph'), [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-8px)' }], s1 + .06, .12, 'out');
  c.anim($('bf'), [{ background: '#F2F3F5' }, { background: '#E4EBFD' }, { background: '#F2F3F5' }], s1 + .12, .6);
  tap('b', 170, 578, T3); c.anim($('bb'), [{ transform: 'scale(1)' }, { transform: 'scale(.96)' }, { transform: 'scale(1)' }], T3 + .05, .22); tr.push(['motion.fast · 按下', T3 + .05, .22]);
  c.anim($('bbt'), [{ opacity: 1 }, { opacity: 0 }], T3 + .15, .1, 'out'); c.anim($('bs'), [{ opacity: 0 }, { opacity: 1 }], T3 + .2, .1);
  c.anim($('bs'), [{ transform: 'rotate(0)' }, { transform: 'rotate(720deg)' }], T3 + .2, 1, 'lin'); c.anim($('bs'), [{ opacity: 1 }, { opacity: 0 }], T3 + 1.2, .1, 'out', 'forwards'); tr.push(['加载 · 提交中', T3 + .2, 1]);
  c.anim($('bo'), [{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'scale(1)' }], T3 + 1.25, .2, 'in'); tr.push(['motion.base · 成功', T3 + 1.25, .2]);
  const W = 520, sx = t => (t - A0) / EN * W;
  G.querySelector('.tracks').innerHTML = tr.map(([n, s, d, x]) => `<div class="tr"><span class="n">${n}</span><div class="lane"><i class="bar${x ? ' x' : ''}" style="left:${sx(s)}px;width:${Math.max(4, sx(s + d) - sx(s))}px"></i></div></div>`).join('') + `<i class="ph"></i>`;
  const ph = G.querySelector('.ph'), clk = G.querySelector('.clock');
  c.tick(t => { const u = Math.max(0, Math.min(EN, t - A0)); ph.style.left = (230 + u / EN * W) + 'px'; clk.textContent = u.toFixed(2) + ' s'; });
  c.in(G.querySelector('.rmo'), c.b(6) + c.sc.beats[6].d * .8);
  };
  demo(c.b(6) + 1.6, c.b(6) + .1, c.b(6) + 11.2);
  demo(c.b(6) + 12, c.b(6) + 11.3, 0);
  const h2 = c.swapHead(h, '先回答：为什么动', c.b(1));
  const h3 = c.swapHead(h, '时长：面积越大、距离越远，越长', c.b(2)); c.out(h2, c.b(2));
  const h4 = c.swapHead(h, '缓动和弹簧，也写成令牌', c.b(3)); c.out(h3, c.b(3));
  const h5 = c.swapHead(h, '能被打断，编排有主次', c.b(4)); c.out(h4, c.b(4));
  const h6 = c.swapHead(h, '性能预算：只动合成层属性', c.b(5)); c.out(h5, c.b(5));
  c.swapHead(h, '同一个面板，两种动法', c.b(6)); c.out(h6, c.b(6));
});

// 着色器背景：参数来自令牌
function shaderCanvas(c, el, opts = {}) {
  const cv = el.querySelector('canvas'), gl = cv.getContext('webgl', { preserveDrawingBuffer: true });
  const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs = `precision highp float;uniform vec2 R;uniform float T,I,G;
  vec3 c1=vec3(.62,.72,.98),c2=vec3(.18,.36,.92),c3=vec3(.98,.62,.45);
  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
  float fb(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}
  void main(){vec2 uv=gl_FragCoord.xy/R;vec2 p=uv*vec2(R.x/R.y,1.)*1.6;
   vec2 q=vec2(fb(p+T),fb(p+vec2(5.2,1.3)-T));float v=fb(p+2.*q);
   vec3 col=mix(c1,c2,smoothstep(.25,.75,v));col=mix(col,c3,smoothstep(.55,.9,q.x)*.6*I);
   col+= (h(gl_FragCoord.xy+T)-.5)/255.*G;
   gl_FragColor=vec4(col,1.);}`;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr); gl.useProgram(pr);
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const l = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
  gl.uniform2f(gl.getUniformLocation(pr, 'R'), cv.width, cv.height); gl.uniform1f(gl.getUniformLocation(pr, 'I'), 1); gl.uniform1f(gl.getUniformLocation(pr, 'G'), 1.5);
  let last = -1; const speed = opts.speed ?? .04;
  c.tick(t => { const q = Math.round(t * 15) / 15; if (q === last) return; last = q; const tt = opts.frozen && opts.frozen(t) ? opts.frozen(t) : q; gl.uniform1f(gl.getUniformLocation(pr, 'T'), 3 + tt * speed); gl.drawArrays(gl.TRIANGLES, 0, 3); });
}

S('b_deco', c => {
  const h = c.head('04', '着色器装饰：成本降了，更要有边界'); basis(c, '注意力抢占 · 加工流畅性');
  const hero = (w, hh) => `<div class="hero" style="width:${w}px;height:${hh}px"><canvas width="${w}" height="${hh}"></canvas><div class="scr2"></div>
    <div class="htx"><div style="font-size:20px;opacity:.85;margin-bottom:8px">青松 · 会议室</div><div style="font-size:48px;font-weight:700;line-height:1.2;margin-bottom:24px">今天下午，<br>还有 3 间空着</div><span>立即预约</span></div></div>`;
  const H = c.el(`<div class="abs" style="left:120px;top:250px">${hero(860, 640)}</div>`); shaderCanvas(c, H);
  c.in(H, .4);
  const code = c.el(`<div class="abs card rs" style="left:1030px;top:250px;width:770px"><div style="display:flex;gap:12px;align-items:center">${badge('conv', 'AI 生成 · 几分钟')}</div>
    <pre class="code">float v = fbm(p + 2.0 * q);
vec3 col = mix(c1, c2, smoothstep(.25, .75, v));
col = mix(col, c3, smoothstep(.55, .9, q.x) * .6);</pre>
    <div class="p" style="margin-top:16px">规范不管“要不要用”，管的是：<b>出现在哪、占多少</b>。</div></div>`);
  c.in(code, c.b(0) + c.sc.beats[0].d * .3);
  // b1 位置 + 参数
  const R1 = c.el(`<div class="abs" style="left:1030px;top:250px;width:770px">
    <div class="rl"><b style="--c:var(--see)">一 · 位置</b><span>只用在背景层：首屏、空状态、品牌时刻；不放在密集文字和表单后面</span></div>
    <div class="card" style="padding:22px 30px;margin-top:16px"><b style="font-size:24px">二 · 参数来自令牌</b>
      <div class="pp2"><span class="k">palette</span><span class="k v">brand.300 · brand.600 · accent.400</span></div>
      <div class="pp2"><span class="k">speed</span><span class="k v">motion.ambient = 0.04</span></div>
      <div class="pp2"><span class="k">intensity</span><span class="k v">≤ 0.6</span></div></div></div>`);
  c.out(code, c.b(1)); c.stagger(R1.children, c.b(1) + .2, c.sc.beats[1].d * .4);
  // b2 可读 + 渐变质量
  const R2 = c.el(`<div class="abs" style="left:1030px;top:250px;width:770px">
    <div class="rl"><b style="--c:var(--read)">三 · 可读</b><span>文字下方加渐变遮罩，正文对比度照样 ≥ 4.5 : 1</span></div>
    <div class="card rs" style="margin-top:16px"><b style="font-size:24px">四 · 渐变的质量</b>
      <div class="gq"><span>sRGB 插值</span><i style="background:linear-gradient(90deg,#2F5BEA,#F2A33C)"></i></div>
      <div class="gq"><span>OKLab 插值</span><i style="background:linear-gradient(in oklab 90deg,#2F5BEA,#F2A33C)"></i></div>
      <div class="note" style="margin:4px 0 14px">中间不发灰</div>
      <div class="gq"><span>8 位直出</span><i class="band"></i></div>
      <div class="gq"><span>加抖动</span><i class="dith"></i></div>
      <div class="note" style="margin-top:4px">大面积暗色渐变的色带被打散（示意放大）</div></div></div>`);
  c.out(R1, c.b(2)); c.in(R2.children[0], c.b(2) + .1); c.in(R2.children[1], c.b(2) + c.sc.beats[2].d * .4);
  c.anim(H.querySelector('.scr2'), [{ opacity: 0 }, { opacity: 1 }], c.b(2) + 1.5, .6);
  // b3 预算 + 克制
  const R3 = c.el(`<div class="abs" style="left:1030px;top:250px;width:770px">
    <div class="rl"><b style="--c:var(--act)">五 · 预算</b><span>帧率设上限（例：30 帧/秒）；滚出视口就暂停；省电模式、低端设备 → 静态图</span></div>
    <div class="rl"><b style="--c:var(--confirm)">六 · 克制</b><span>开启“减少动态效果”时直接静止；不得快速闪烁</span></div>
    <div class="card rs" style="margin-top:16px;display:flex;gap:14px;align-items:center">${badge('std', 'WCAG 2.3.1')}<span class="p" style="font-size:21px">每秒闪光不超过三次</span></div>
    <div class="rmx card" style="margin-top:16px;padding:16px 22px;display:flex;justify-content:space-between;align-items:center"><span style="font-size:22px;font-weight:600">减少动态效果</span><span class="tg2"><i></i></span></div></div>`);
  c.out(R2, c.b(3)); c.stagger(R3.children, c.b(3) + .1, c.sc.beats[3].d * .2);
  c.anim(R3.querySelector('.tg2'), [{ background: '#CBC6BB' }, { background: '#1F7A4D' }], c.b(3) + c.sc.beats[3].d * .75, .2);
  c.anim(R3.querySelector('.tg2 i'), [{ transform: 'none' }, { transform: 'translateX(24px)' }], c.b(3) + c.sc.beats[3].d * .75, .2);
  // b4 装饰组件规格
  const R4 = c.el(`<div class="abs card rs" style="left:1030px;top:250px;width:770px;min-height:640px"><div class="note">组件规格</div><div style="font-size:34px;font-weight:800;margin:6px 0 20px">AmbientBackground</div>
    ${[['位置', '首屏 · 空状态 · 品牌时刻'], ['参数', 'palette · speed · intensity（取自令牌）'], ['遮罩', '文字区自动加，保证 4.5 : 1'], ['预算', '≤ 30 fps · 离屏暂停'], ['降级', '省电 / 低端 / 减少动态 → 静态图']].map(([a, b]) => `<div class="spec"><span>${a}</span><b>${b}</b></div>`).join('')}</div>`);
  c.out(R3, c.b(4)); c.in(R4, c.b(4) + .1);
  const h2 = c.swapHead(h, '一 · 位置　二 · 参数', c.b(1));
  const h3 = c.swapHead(h, '三 · 可读　四 · 渐变质量', c.b(2)); c.out(h2, c.b(2));
  const h4 = c.swapHead(h, '五 · 预算　六 · 克制', c.b(3)); c.out(h3, c.b(3));
  c.swapHead(h, '装饰，也是一个有规格的组件', c.b(4)); c.out(h4, c.b(4));
});

S('b_comp', c => {
  const h = c.head('05', '先把令牌分层'); basis(c, '一致性 · 认出比回想容易');
  const A = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 64px 1fr 64px 1fr">
    <div class="card lay"><div class="lh"><span>原始令牌</span><small>有哪些值</small></div>
      <div class="tk"><i style="background:#2F5BEA"></i><span class="k">blue.600</span><em>#2F5BEA</em></div><div class="tk"><i style="background:#16181D"></i><span class="k">gray.900</span><em>#16181D</em></div>
      <div class="tk"><i class="bx2"></i><span class="k">space.4</span><em>16 px</em></div><div class="tk"><i class="bx2 r"></i><span class="k">radius.3</span><em>12 px</em></div></div>
    <div class="arr">→</div>
    <div class="card lay"><div class="lh"><span>语义令牌</span><small>用在什么意图</small></div>
      <div class="tk"><span class="k">color.action.primary</span><em>blue.600</em></div><div class="tk"><span class="k">color.text.default</span><em>gray.900</em></div>
      <div class="tk"><span class="k">space.inset.md</span><em>space.4</em></div><div class="tk"><span class="k">radius.control</span><em>radius.3</em></div></div>
    <div class="arr">→</div>
    <div class="card lay"><div class="lh"><span>组件令牌</span><small>具体到部件</small></div>
      <div class="tk"><span class="k">button.primary.bg</span><em>action.primary</em></div><div class="tk"><span class="k">button.padding.x</span><em>inset.md</em></div>
      <div class="tk"><span class="k">button.radius</span><em>radius.control</em></div><div class="btnd">预约 10:00 – 11:00</div></div></div>`);
  const A2 = c.el(`<div class="abs p" style="left:120px;top:800px;width:1680px;font-size:24px">页面和组件<b>只引用语义层</b>：把 blue.600 改成青色，整套界面跟着变。</div>`);
  [0, 2, 4].forEach((k, i) => c.in(A.children[k], .5 + i * c.sc.beats[0].d * .25)); [1, 3].forEach((k, i) => c.in(A.children[k], .8 + (i + 1) * c.sc.beats[0].d * .25, { dy: 0 }));
  c.in(A2, c.b(0) + c.sc.beats[0].d * .8);
  // b1 状态矩阵  b2 极端内容 + API
  const st = ['默认', '悬停', '按下', '键盘焦点', '不可用', '加载'];
  const V = { '主要': { bg: '#2F5BEA', c: '#fff' }, '次要': { bg: '#fff', c: '#2F5BEA', bd: '1.5px solid #C8D3FA' }, '危险': { bg: '#C4321C', c: '#fff' } };
  const mod = (v, s) => { let bg = v.bg, cc = v.c, ex = ''; if (s === '悬停') bg = v.bg === '#fff' ? '#F1F4FE' : (v.bg === '#2F5BEA' ? '#2449C4' : '#A82A17'); if (s === '按下') { bg = v.bg === '#fff' ? '#E4EAFD' : (v.bg === '#2F5BEA' ? '#1D3BA3' : '#8E2313'); ex = 'transform:scale(.97);'; }
    if (s === '键盘焦点') ex = 'box-shadow:0 0 0 3px #fff,0 0 0 6px #16181D;'; if (s === '不可用') { bg = '#ECEDEF'; cc = '#9A9FA8'; ex = 'border:0;'; }
    return `<div class="b3" style="background:${bg};color:${cc};border:${v.bd || '0'};${ex}">${s === '加载' ? `<i style="width:18px;height:18px;border-radius:50%;border:3px solid ${cc}55;border-top-color:${cc}"></i>提交中` : '预约'}</div>`; };
  const M = c.el(`<div class="abs card" style="left:120px;top:250px;width:1100px;padding:30px 36px"><div class="sm"><div></div>${st.map(s => `<div class="h">${s}</div>`).join('')}${Object.entries(V).map(([n, v]) => `<div class="r">${n}</div>${st.map(s => mod(v, s)).join('')}`).join('')}
    <div class="r ex" style="margin-top:20px">尺寸</div><div class="ex" style="grid-column:span 6;display:flex;gap:14px;align-items:center;margin-top:20px"><div class="b3" style="background:#2F5BEA;color:#fff;height:36px;padding:0 14px;font-size:15px;box-shadow:0 0 0 4px rgba(209,73,46,.0)">小 36</div><div class="b3" style="background:#2F5BEA;color:#fff;height:44px;padding:0 18px;font-size:16px">中 44</div><div class="b3" style="background:#2F5BEA;color:#fff;height:52px;padding:0 22px">大 52</div><span class="note" style="margin-left:10px">小号也要把可点区域补到 44</span></div>
    <div class="r ex" style="margin-top:8px">内容</div><div class="ex" style="grid-column:span 6;display:flex;gap:14px;align-items:center;margin-top:8px"><div class="b3" style="background:#2F5BEA;color:#fff;padding:0 18px">预约</div><div class="b3" style="background:#2F5BEA;color:#fff;padding:0 18px">预约三楼青松厅 10:00 – 11:00 并通知参会人</div><span class="note">截断还是换行？</span></div></div></div>`);
  const API = c.el(`<div class="abs" style="left:1260px;top:250px;width:540px"><div class="cap" style="margin-bottom:12px">组件的属性 = 设计上的决定</div>
    <div class="card" style="padding:24px 28px;font:400 21px/1.8 var(--mono)">&lt;Button<br>&nbsp;&nbsp;<span style="color:#2F5BEA">variant</span>=<span style="color:#1F7A4D">"primary"</span> <span class="cm2">强调层级</span><br>&nbsp;&nbsp;<span style="color:#2F5BEA">size</span>=<span style="color:#1F7A4D">"md"</span> <span class="cm2">尺寸令牌</span><br>&nbsp;&nbsp;<span style="color:#2F5BEA">tone</span>=<span style="color:#1F7A4D">"danger"</span> <span class="cm2">语义色</span><br>&nbsp;&nbsp;<span style="color:#2F5BEA">loading</span> <span class="cm2">状态</span><br>/&gt;
      <div class="noapi" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--line);color:#D1492E">✕ color="#3478F6"<br>✕ radius={7}</div></div>
    <div class="p" style="margin-top:18px;font-size:22px"><b>能填任意值的属性，就是规范的漏洞。</b></div></div>`);
  c.out(A, c.b(1)); c.out(A2, c.b(1)); c.in(M, c.b(1) + .1);
  M.querySelectorAll('.sm > .b3').forEach((e, i) => c.in(e, c.b(1) + .8 + (i % 6) * .25 + Math.floor(i / 6) * .1, { dy: 6, d: .35 }));
  M.querySelectorAll('.ex').forEach(e => c.in(e, c.b(2) + .5));
  c.in(API, c.b(2) + c.sc.beats[2].d * .45);
  // b3 文档
  const D = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px">
    <div class="card rs" style="min-height:600px"><div class="ttl">解剖图</div><div class="anat"><div class="btna"><span class="ic">✓</span>预约 10:00</div>
      <div class="an a1">图标 · 20</div><div class="an a2">标签 · 正文 16 / 600</div><div class="an a3">内边距 · space.4</div><div class="an a4">圆角 · radius.control</div></div></div>
    <div class="card rs" style="min-height:600px"><div class="ttl">何时用 · 何时不用</div>
      <div class="dd do"><b>✓ 用</b><div class="mini3"><span class="b3" style="background:#2F5BEA;color:#fff;width:100%">预约</span></div><small>每屏一个主操作</small></div>
      <div class="dd dont"><b>✕ 不用</b><div class="mini3"><span class="b3" style="background:#2F5BEA;color:#fff">预约</span><span class="b3" style="background:#2F5BEA;color:#fff">分享</span><span class="b3" style="background:#2F5BEA;color:#fff">收藏</span></div><small>多个主按钮并列</small></div></div>
    <div class="card rs" style="min-height:600px"><div class="ttl">无障碍说明</div>${[['角色', 'button'], ['焦点顺序', '在表单最后一个字段之后'], ['读屏文案', '“预约，10 点到 11 点，按钮”'], ['加载中', '播报“正在提交”']].map(([a, b]) => `<div class="spec"><span>${a}</span><b>${b}</b></div>`).join('')}</div></div>`);
  c.out(M, c.b(3)); c.out(API, c.b(3)); c.stagger(D.children, c.b(3) + .1, c.sc.beats[3].d * .28);
  c.stagger(D.querySelectorAll('.an'), c.b(3) + 1.2, .3, { dy: 0 });
  // b4 治理
  const G = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:600px"><div class="ttl">两种维护模式</div><div class="note" style="margin-top:4px">Nathan Curtis, 2015</div>
      <div class="gm"><div><svg width="300" height="240"><circle cx="150" cy="70" r="44" fill="#16181D"/><text x="150" y="78" text-anchor="middle" fill="#fff" font-size="20" font-family="Inter,Noto Sans CJK SC">核心团队</text>${[40, 110, 190, 260].map(x => `<line x1="150" y1="114" x2="${x}" y2="190" stroke="#CBC6BB" stroke-width="2"/><circle cx="${x}" cy="200" r="22" fill="#E4EAFD"/>`).join('')}</svg><b>集中式</b><span>核心团队统一维护</span></div>
        <div><svg width="300" height="240"><circle cx="150" cy="120" r="44" fill="#16181D"/><text x="150" y="128" text-anchor="middle" fill="#fff" font-size="20" font-family="Inter,Noto Sans CJK SC">审核</text>${[[40, 40], [260, 40], [40, 200], [260, 200]].map(([x, y]) => `<line x1="${x}" y1="${y}" x2="150" y2="120" stroke="#2F5BEA" stroke-width="2"/><circle cx="${x}" cy="${y}" r="26" fill="#2F5BEA"/>`).join('')}</svg><b>联邦式</b><span>业务团队贡献，核心审核</span></div></div></div>
    <div class="card rs" style="min-height:600px"><div class="ttl">变更与检查</div>
      <div class="ver">${[['1.4.0', '新增 tone="danger"'], ['1.5.0', 'radius.sm 标记为废弃，保留两个版本'], ['2.0.0', '移除 radius.sm']].map(([v, d]) => `<div><b class="k">${v}</b><span>${d}</span></div>`).join('')}</div>
      <div class="lint"><span class="k" style="font-size:19px">booking.css:42</span><span>⚠ #3478F6 不在令牌中 → 建议 color.action.primary</span></div>
      <div class="vr"><div><i></i>上一版截图</div><div><i class="df"></i>本次截图 · 差异 3 处</div></div></div></div>`);
  c.out(D, c.b(4)); c.in(G.children[0], c.b(4) + .1); c.in(G.children[1], c.b(4) + c.sc.beats[4].d * .45);
  c.stagger(G.querySelectorAll('.ver > div, .lint, .vr'), c.b(4) + c.sc.beats[4].d * .5, .7);
  // b5 AI
  const I = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 80px 1fr;align-items:center">
    <div class="card rs"><div style="display:flex;gap:12px;align-items:center">${badge('conv', '行业约定 · 设计令牌格式 2025.10')}</div>
      <pre class="code" style="font-size:18px">{
  "color": {
    "action": {
      "primary": {
        "$type": "color",
        "$value": "{blue.600}"
      }
    }
  }
}</pre><div class="note" style="margin-top:10px">W3C 设计令牌社区组 · 第一个稳定版</div></div>
    <div class="arr" style="font-size:48px">→</div>
    <div class="card rs"><div class="ttl">交给生成界面的模型</div><div class="ctx">${['令牌（JSON）', '组件清单与属性', '原则与“何时不用”', '无障碍要求'].map(x => `<div>${x}</div>`).join('')}</div>
      <div class="p" style="margin-top:20px">生成的界面落在<b>同一套约定</b>里，再由检查工具兜底。</div></div></div>`);
  c.out(G, c.b(5)); c.in(I.children[0], c.b(5) + c.sc.beats[5].d * .3); c.in(I.children[1], c.b(5) + c.sc.beats[5].d * .45, { dy: 0 }); c.in(I.children[2], c.b(5) + .2);
  const h2 = c.swapHead(h, '组件是一张状态矩阵', c.b(1));
  const h3 = c.swapHead(h, '压测极端内容，收紧组件属性', c.b(2)); c.out(h2, c.b(2));
  const h4 = c.swapHead(h, '组件文档写三件事', c.b(3)); c.out(h3, c.b(3));
  const h5 = c.swapHead(h, '规范需要治理', c.b(4)); c.out(h4, c.b(4));
  c.swapHead(h, '规范多了一个读者：模型', c.b(5)); c.out(h5, c.b(5));
});

S('b_compare', c => {
  const h = c.head('06', '同一个需求，做三次');
  const mk = (o) => `<div class="mini" style="font-family:var(--sans)"><h5 style="font-size:${o.h}px;font-weight:${o.hw}">预约会议室</h5><div class="m" style="font-size:${o.m}px">10 月 28 日 · 6 人</div>
    <div class="row">${['09:00', '10:00', '14:00'].map((t, i) => `<i style="padding:${o.cp}px 12px;border-radius:${o.cr}px;font-size:${o.cf}px;${i == 1 ? `background:${o.c};color:#fff` : `border:1px solid ${o.cb};color:#555`}">${t}</i>`).join('')}</div>
    <div style="height:${o.fh}px;border-radius:${o.fr}px;background:${o.fb};border:${o.fbd};display:flex;align-items:center;padding:0 12px;font-size:${o.cf}px;color:#333;margin-bottom:14px">三楼 · 青松厅</div>
    <div class="btnx" style="height:${o.bh}px;border-radius:${o.br}px;background:${o.c};color:#fff;font-size:${o.bf}px;${o.bx || ''}">${o.bt}</div></div>`;
  const N = [{ h: 22, hw: 700, m: 14, cp: 6, cr: 4, cf: 14, c: '#1890FF', cb: '#ddd', fh: 40, fr: 4, fb: '#fff', fbd: '1px solid #ddd', bh: 40, br: 4, bf: 15, bt: '提交' },
    { h: 26, hw: 500, m: 15, cp: 10, cr: 20, cf: 15, c: '#7B61FF', cb: '#eee', fh: 48, fr: 24, fb: '#F4F2FF', fbd: '0', bh: 48, br: 24, bf: 16, bt: '确认预约', bx: 'left:40px;right:40px' },
    { h: 19, hw: 800, m: 13, cp: 4, cr: 0, cf: 13, c: '#0A66C2', cb: '#bbb', fh: 36, fr: 0, fb: '#fafafa', fbd: '1px solid #bbb', bh: 36, br: 0, bf: 14, bt: '下一步 →', bx: 'left:auto;width:120px' }];
  const Sx = { h: 24, hw: 700, m: 15, cp: 9, cr: 10, cf: 15, c: '#2F5BEA', cb: '#E3E5E9', fh: 46, fr: 10, fb: '#F2F3F5', fbd: '0', bh: 50, br: 12, bf: 16, bt: '预约 10:00' };
  const A = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div><div class="cl">${badge('conv', '没有规范')}<span class="note">每次都在重新决定</span></div><div class="trio">${N.map(mk).join('')}</div></div>
    <div><div class="cl">${badge('law', '有规范')}<span class="note">只从令牌和组件里取</span></div><div class="trio">${[Sx, Sx, Sx].map(mk).join('')}</div></div></div>`);
  c.in(A.children[0], .5); c.stagger(A.children[0].querySelectorAll('.mini'), 1, .5); c.in(A.children[1], c.b(0) + c.sc.beats[0].d * .7);
  // b1 换主题
  const th = (bg, surf, txt, pri, chip, name) => `<div class="mini" style="background:${surf};color:${txt}"><h5 style="font-size:24px">预约会议室</h5><div class="m" style="font-size:15px;opacity:.7">10 月 28 日 · 6 人</div>
    <div class="row">${['09:00', '10:00', '14:00'].map((t, i) => `<i style="padding:9px 12px;border-radius:10px;font-size:15px;${i == 1 ? `background:${pri};color:${bg}` : `border:1px solid ${chip};opacity:.8`}">${t}</i>`).join('')}</div>
    <div style="height:46px;border-radius:10px;background:${chip};display:flex;align-items:center;padding:0 12px;font-size:15px;margin-bottom:14px">三楼 · 青松厅</div>
    <div class="btnx" style="height:50px;border-radius:12px;background:${pri};color:${bg};font-size:16px">预约 10:00</div><div class="thn">${name}</div></div>`;
  const B = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:40px;padding:0 120px">
    ${th('#fff', '#fff', '#16181D', '#2F5BEA', '#F2F3F5', '默认')}${th('#fff', '#fff', '#16181D', T(40, 190, 40), '#EEF4F2', '换品牌色：只改 brand.*')}${th(T(20), T(6, 275, 4), T(90, 275, 4), T(80), T(25, 275, 8), '暗色：换一组档位')}</div>`);
  c.out(A, c.b(1)); c.stagger(B.children, c.b(1) + .2, c.sc.beats[1].d * .25);
  // b2 无障碍映射
  const W = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:repeat(5,1fr);gap:20px">
    ${[['看见', '低视力 · 色弱 · 强光下', [['1.4.3', '文字对比度 ≥ 4.5 : 1'], ['1.4.11', '控件边界 ≥ 3 : 1']]], ['读懂', '读屏用户 · 认知差异', [['3.3.2', '输入有标签或说明'], ['1.3.1', '结构可被程序读出']]], ['决定', '第一次来 · 注意力分散', [['3.2.4', '同一功能，同一名称'], ['2.4.6', '标题与标签说清用途']]], ['动手', '手抖 · 只用键盘 · 单手', [['2.5.8', '目标 ≥ 24 × 24 px'], ['2.1.1', '全部操作可用键盘']]], ['确认', '看不到屏幕变化的人', [['4.1.3', '状态消息能被读出'], ['3.3.1', '错误被指明并描述']]]].map(([s, w, cs]) => `<div class="wc" style="--c:${C5[s]}"><h4>${s}</h4><p class="who">${w}</p>${cs.map(([k, d]) => `<div class="cr"><span class="k">${k}</span>${d}</div>`).join('')}</div>`).join('')}</div>`);
  const W2 = c.el(`<div class="abs" style="left:120px;top:790px;width:1680px;display:flex;gap:14px;align-items:center">${badge('std', '现行标准 · WCAG 2.2')}<span class="p">不是附加题：五个环节里，每一步都有对应的检查项。</span></div>`);
  c.out(B, c.b(2)); c.stagger(W.children, c.b(2) + c.sc.beats[2].d * .18, c.sc.beats[2].d * .15); c.in(W2, c.b(2) + .3);
  // b3 动效条款
  const Mo = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
    ${[['2.2.2', 'A', '暂停、停止、隐藏', '自动播放、持续超过 5 秒的运动内容，要能暂停'], ['2.3.1', 'A', '三次闪光', '每秒闪光不超过三次'], ['2.3.3', 'AAA', '交互触发的动画', '由交互触发的动效，要能被关掉（除非必不可少）']].map(([k, l, t, d]) => `<div class="card rs" style="min-height:440px"><div style="display:flex;justify-content:space-between;align-items:center"><span class="k" style="font-size:30px;font-weight:700">${k}</span><span class="tag">级别 ${l}</span></div><div class="ttl" style="margin:24px 0 14px">${t}</div><div class="p">${d}</div></div>`).join('')}</div>`);
  const Mo2 = c.el(`<div class="abs card rs" style="left:120px;top:730px;width:1680px;border-left:6px solid var(--ink)"><span style="font-size:28px;font-weight:700">每一列多照顾一类人，规范才算完整。</span></div>`);
  c.out(W, c.b(3)); c.out(W2, c.b(3)); c.stagger(Mo.children, c.b(3) + .2, c.sc.beats[3].d * .25); c.in(Mo2, c.b(3) + c.sc.beats[3].d * .8);
  const h2 = c.swapHead(h, '大改动变便宜', c.b(1));
  const h3 = c.swapHead(h, '无障碍：按五个环节归类', c.b(2)); c.out(h2, c.b(2));
  c.swapHead(h, '动效与装饰的条款', c.b(3)); c.out(h3, c.b(3));
});

S('b_review', c => {
  const h = c.head('07', '评审：先对齐目标，再看方案');
  const A = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:40px">
    <div class="card rs" style="min-height:560px"><div class="ttl">结构化评审</div><div class="flow">${['目标：这一屏要帮用户完成什么', '原则：逐条对照，引用编号', '方案：哪里违背、怎么改', '记录：写进决策记录'].map((x, i) => `<div><i>${i + 1}</i>${x}</div>`).join('')}</div><div class="note" style="margin-top:14px">不是比谁更喜欢</div></div>
    <div class="card rs" style="min-height:560px"><div class="ttl">启发式评估</div><div class="he">${[0, 1, 2, 3].map(i => `<div class="ev"><b>评审 ${i + 1}</b>${Array.from({ length: 3 + i % 2 }, () => '<i></i>').join('')}</div>`).join('')}<div class="mg">合并 → 去重 → 按严重程度排序</div></div><div class="note" style="margin-top:14px">几位评审按同一份清单独立检查</div></div></div>`);
  c.in(A.children[0], .5); c.stagger(A.querySelectorAll('.flow div'), 1.2, .5); c.in(A.children[1], c.b(0) + c.sc.beats[0].d * .55);
  // b1 五个用户
  const L = .31, pts = Array.from({ length: 16 }, (_, n) => 1 - (1 - L) ** n);
  const B = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px;display:grid;grid-template-columns:1040px 1fr;gap:40px">
    <div class="card rs" style="min-height:600px">${badge('exp', '模型 · Nielsen & Landauer, 1993')}
      <svg width="960" height="440" style="margin-top:16px" font-family="Inter,Noto Sans CJK SC"><line x1="60" y1="380" x2="940" y2="380" stroke="#CBC6BB"/><line x1="60" y1="20" x2="60" y2="380" stroke="#CBC6BB"/>
        <path class="cv" d="${pts.map((p, n) => `${n ? 'L' : 'M'}${60 + n * 58} ${380 - p * 340}`).join(' ')}" stroke="#1F7A4D" stroke-width="4" fill="none"/>
        <line x1="${60 + 5 * 58}" y1="${380 - pts[5] * 340}" x2="${60 + 5 * 58}" y2="380" stroke="#B7791F" stroke-dasharray="5 6"/><circle cx="${60 + 5 * 58}" cy="${380 - pts[5] * 340}" r="9" fill="#B7791F"/>
        <text x="${70 + 5 * 58}" y="${370 - pts[5] * 340}" font-size="22" fill="#B7791F">5 人 ≈ ${Math.round(pts[5] * 100)}%</text>
        <text x="500" y="414" text-anchor="middle" font-size="18" fill="#7C818C">测试用户数 →</text><text x="30" y="200" font-size="18" fill="#7C818C" transform="rotate(-90 30 200)" text-anchor="middle">发现的问题比例</text></svg>
      <div class="note">假设每位用户平均发现 31% 的问题</div></div>
    <div><div class="lk">前提</div>${rule('var(--ink)', '用户群相近', '不同人群要分开各测几位。')}${rule('var(--ink)', '多轮迭代', '三轮各五人，胜过一次测十五人：改完再测，才能发现被掩盖的问题。')}</div></div>`);
  c.out(A, c.b(1)); c.in(B.children[0], c.b(1) + .1); c.in(B.querySelector('.cv'), c.b(1) + .8, { dy: 0, d: 1 }); c.stagger(B.children[1].children, c.b(1) + c.sc.beats[1].d * .5, .6);
  // b2 度量
  const Cm = c.el(`<div class="abs" style="left:120px;top:250px;width:1680px">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px">${[['任务成功率', '94%', '+6'], ['完成时间', '38 秒', '−12 秒'], ['错误率', '3.1%', '−2.4']].map(([a, b, d]) => `<div class="card rs kp"><span class="note">用户用得好不好</span><b>${a}</b><div class="big">${b}</div><em>${d}</em></div>`).join('')}</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:20px">${[['令牌采用率', '87%', '+15'], ['组件覆盖率', '72%', '+9'], ['绕开规范', '41 处', '−23']].map(([a, b, d]) => `<div class="card rs kp k2"><span class="note">规范用得好不好</span><b>${a}</b><div class="big">${b}</div><em>${d}</em></div>`).join('')}</div>
    <div class="note" style="margin-top:12px">数字为示意</div></div>`);
  c.out(B, c.b(2)); c.in(Cm, c.b(2) + .1, { dy: 0 }); c.stagger(Cm.querySelectorAll('.kp'), c.b(2) + .3, c.sc.beats[2].d * .1);
  // b3 完整矩阵
  const mx = c.el(matrix(120, 250, 1680, 4));
  c.out(Cm, c.b(3)); c.stagger(mx.querySelectorAll('.mh,.rh'), c.b(3) + .2, .04);
  for (let r = 0; r < 4; r++) c.stagger(mx.querySelectorAll('.mc.r' + r), c.b(3) + .8 + r * c.sc.beats[3].d * .14, .1, { scale: .9, dy: 0 });
  // b4 收尾
  const E = c.el(`<div class="abs" style="left:120px;top:790px;width:1680px;display:flex;gap:16px;align-items:center">
    ${badge('conv', '约定：可以换')}<span class="ar2">·</span>${badge('exp', '经验原则：看场景')}<span class="ar2">·</span>${badge('law', '实验证据：别对抗')}</div>`);
  c.stagger(E.children, c.b(4) + 1, .5);
  c.anim(mx, [{ opacity: 1 }, { opacity: .12 }], c.b(4) + .2, .6);
  const end = c.el(`<div class="abs" style="left:120px;top:420px;width:1680px;text-align:center"><div style="font-size:64px;font-weight:800">每一条规则，都知道自己从哪里来</div></div>`);
  c.in(end, c.b(4) + .4);
  const h2 = c.swapHead(h, '五个用户，多轮迭代', c.b(1));
  const h3 = c.swapHead(h, '规范本身也要被度量', c.b(2)); c.out(h2, c.b(2));
  const h4 = c.swapHead(h, '矩阵填满了', c.b(3)); c.out(h3, c.b(3));
  c.swapHead(h, '谢谢观看', c.b(4)); c.out(h4, c.b(4));
});
