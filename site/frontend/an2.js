// 中集动画
function cycle(g, t, R, steps, hot = -1, cx = R.x + 420, cy = R.y + R.h / 2, r = 230) {
  const n = steps.length; g.strokeStyle = C.line2; g.lineWidth = 3; g.setLineDash([10, 10]); g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke(); g.setLineDash([]);
  steps.forEach((s, i) => { const a = -Math.PI / 2 + i / n * Math.PI * 2, x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r, u = pop(t, .2 + i * .35); if (u <= 0) return; const on = hot === i; g.save(); g.globalAlpha = u; rr(g, x - 110, y - 36, 220, 72, 36, on ? 'rgba(255,210,122,.15)' : 'rgba(14,20,36,.95)', on ? C.gold : C.g, on ? 3 : 2); txt(g, s, x, y, C.fg, fnt(700, 26), 'center'); g.restore();
    const a2 = a + Math.PI * 2 / n * .5, ax = cx + Math.cos(a2) * r, ay = cy + Math.sin(a2) * r; arrow(g, ax - Math.sin(a2) * 8, ay + Math.cos(a2) * 8, ax + Math.sin(a2) * 8, ay - Math.cos(a2) * 8, C.g, 3, 12, u); });
}
AN.ocycle = (g, t, R, st) => { cycle(g, t, R, ['度量', '找最慢的一层', '改', '再度量']); const k = st.k; if (k >= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; txt(g, '这一集的顺序', R.x + 900, R.y + 90, C.fg, fnt(700, 28)); ['度量', '加载', '包体', '渲染', '长列表', '交互', '内存', '图形', '数据', '流水线'].forEach((s, i) => { const uu = pop(st.tk, .5 + i * .25); g.globalAlpha = uu; tag(g, `${String(i + 1).padStart(2, '0')} ${s}`, R.x + 900 + (i % 2) * 300, R.y + 160 + Math.floor(i / 2) * 70, i === 9 ? C.gold : C.g); }); g.restore(); } };
AN.ocycle2 = (g, t, R, st) => { cycle(g, t, R, ['度量', '找最慢的一层', '改', '再度量']); const k = st.k; const items = [['性能预算', '首屏脚本 ≤ 300 KB · INP ≤ 200 ms，写进配置'], ['CI 里跑', '每次提交测包体与核心指标，超了挡住合并'], ['线上监控', '真实用户数据每天看；回归 → 告警 → 定位到那次发布']]; if (k >= 1) items.forEach(([n, d], i) => { const u = pop(st.tk, .3 + i * 1.2); if (u <= 0) return; const y = R.y + 140 + i * 170; g.save(); g.globalAlpha = u; rr(g, R.x + 880, y, 760, 130, 16, 'rgba(14,20,36,.9)', C.gold); txt(g, n, R.x + 910, y + 42, C.gold, fnt(700, 28)); txt(g, d, R.x + 910, y + 90, C.fg2, fnt(500, 22)); g.restore(); }); if (k >= 2) { g.save(); g.globalAlpha = pop(st.tk, .3); txt(g, '从一个人的责任 → 系统的约束', R.x + 880, R.y + 700, C.fg, fnt(700, 30)); g.restore(); } };
// 三个指标
AN.cwv = (g, t, R, st) => {
  const k = st.k; const M = [['LCP', '最大内容绘制', '主要内容多久出现', '≤ 2.5 s', C.b], ['CLS', '累计布局偏移', '加载时内容跳了多少', '≤ 0.1', C.o], ['INP', '交互到下一次绘制', '每次点击多久看到反馈', '≤ 200 ms', C.g]];
  const cw = (R.w - 80) / 3; M.forEach(([a, b, c2, th, col], i) => { const x = R.x + 40 + i * cw, y = R.y + 60, u = pop(t, .3 + i * .5); if (u <= 0) return; g.save(); g.globalAlpha = u; rr(g, x, y, cw - 40, 300, 18, 'rgba(14,20,36,.9)', col); txt(g, a, x + 30, y + 70, col, fnt(900, 56, 'mono')); txt(g, b, x + 30, y + 130, C.fg, fnt(700, 26)); txt(g, c2, x + 30, y + 175, C.fg2, fnt(500, 22)); if (k >= 1) { g.globalAlpha = u * pop(st.tk, .2 + i * .3); txt(g, '好：' + th, x + 30, y + 245, C.gold, fnt(700, 28)); } g.restore(); });
  // 小动画：LCP 图片出现 / CLS 跳动 / INP 点击
  const ph = (t * .5) % 1; const y2 = R.y + 420;
  [0, 1, 2].forEach(i => { const x = R.x + 40 + i * cw; rr(g, x, y2, cw - 40, 300, 14, 'rgba(255,255,255,.03)', C.line2);
    if (i === 0) { g.fillStyle = C.line2; g.fillRect(x + 30, y2 + 30, 300, 14); g.fillRect(x + 30, y2 + 60, 220, 14); const a = pop(ph, .4, .2); g.save(); g.globalAlpha = a; rr(g, x + 30, y2 + 100, 460, 170, 10, C.b); txt(g, '主要内容（大图）', x + 260, y2 + 185, '#000', fnt(700, 22), 'center'); g.restore(); txt(g, `t = ${(ph * 3).toFixed(1)} s`, x + 400, y2 + 40, C.fg3, fnt(500, 20, 'mono')); }
    if (i === 1) { const shift = ph > .5 ? 60 : 0; g.fillStyle = C.line2; if (shift) { rr(g, x + 30, y2 + 30, 460, 50, 8, C.o); txt(g, '迟到的横幅', x + 260, y2 + 55, '#000', fnt(600, 20), 'center'); } for (let j = 0; j < 4; j++) g.fillRect(x + 30, y2 + 40 + shift + j * 40, 380 - j * 40, 14); if (shift) txt(g, '内容被挤下去了', x + 30, y2 + 260, C.o, fnt(600, 22)); }
    if (i === 2) { const cl = ph > .3; dot(g, x + 120, y2 + 150, cl ? 30 : 36, cl ? C.g : C.line2); txt(g, '点击', x + 120, y2 + 150, '#000', fnt(700, 20), 'center'); const wait = CL((ph - .3) / .4); g.fillStyle = C.line2; g.fillRect(x + 190, y2 + 140, 280, 20); g.fillStyle = C.g; g.fillRect(x + 190, y2 + 140, 280 * wait, 20); if (ph > .7) txt(g, '画面更新 ✓', x + 190, y2 + 200, C.g, fnt(600, 22)); else if (cl) txt(g, '等待中…', x + 190, y2 + 200, C.fg3, fnt(600, 22)); }
  });
  if (k >= 1) txt(g, '统计真实用户的第 75 百分位：四分之三的用户都要达到', R.x + 40, R.y + R.h - 20, C.gold, fnt(600, 24));
};
AN.inp = (g, t, R, st) => {
  const k = st.k; title(g, 'INP：一次交互的延迟分三段', R);
  const x0 = R.x + 60, W = R.w - 120, y = R.y + 160; const segs = [[.3, C.o, '输入延迟', '主线程在忙别的，点击排队'], [.45, C.b, '处理时间', '事件处理函数在跑'], [.25, C.g, '呈现延迟', '改完状态 → 画面更新']];
  let off = 0; segs.forEach(([w, col, s, d], i) => { const u = pop(t, .3 + i * .6); g.save(); g.globalAlpha = u; g.fillStyle = col; g.fillRect(x0 + off * W, y, w * W - 4, 70); txt(g, s, x0 + (off + w / 2) * W, y + 35, '#000', fnt(700, 24), 'center'); txt(g, d, x0 + (off + w / 2) * W, y + 110, C.fg2, fnt(500, 21), 'center'); g.restore(); off += w; });
  txt(g, '点击', x0, y - 24, C.fg, fnt(600, 20), 'center'); txt(g, '下一帧画出来', x0 + W, y - 24, C.fg, fnt(600, 20), 'right');
  if (k === 0 || t < 1) { const u = pop(t, 2); g.save(); g.globalAlpha = u; txt(g, '整个会话里所有交互 → 取接近最差的那一次', R.x + 60, R.y + 330, C.fg, fnt(700, 26)); const ys = R.y + 400; const vals = [40, 60, 30, 520, 50, 45, 80, 35, 60, 410, 50, 40, 70, 55]; vals.forEach((v, i) => { const h = v / 600 * 220; g.fillStyle = v > 200 ? C.r : C.g; g.fillRect(R.x + 80 + i * 110, ys + 240 - h, 70, h); if (v > 200) txt(g, v + ' ms', R.x + 115 + i * 110, ys + 220 - h, C.r, fnt(700, 20, 'mono'), 'center'); }); line(g, [[R.x + 60, ys + 240 - 200 / 600 * 220], [R.x + 60 + 14 * 110, ys + 240 - 200 / 600 * 220]], C.gold, 2, [8, 8]); txt(g, '200 ms', R.x + 60 + 14 * 110 + 10, ys + 240 - 200 / 600 * 220, C.gold, fnt(600, 20, 'mono')); txt(g, '两小时里几次卡住 → INP 就不好看', R.x + 60, ys + 300, C.fg3, fnt(500, 22)); g.restore(); }
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; rr(g, R.x + 60, R.y + 330, R.w - 120, 160, 16, 'rgba(255,178,92,.08)', C.o); txt(g, '最容易被忽视的是第一段', R.x + 90, R.y + 380, C.o, fnt(700, 28)); txt(g, '它和你的点击处理函数无关：是别的任务占着线程 —— 上一次渲染、一个定时器、第三方脚本', R.x + 90, R.y + 440, C.fg2, fnt(500, 23)); g.restore(); }
};
AN.labfield = (g, t, R, st) => {
  const k = st.k; const two = [['实验室', '你的机器上跑，可重复', '找问题的原因', C.b, ['Lighthouse', 'DevTools 性能面板', 'Vitest benchmark']], ['真实用户', '收集每个人的真实数据', '发现问题的存在', C.g, ['web-vitals 库上报', 'CrUX / RUM 平台', 'Long Animation Frames']]];
  const cw = (R.w - 120) / 2; two.forEach(([n, d, use, col, tools], i) => { const x = R.x + 60 + i * cw, y = R.y + 60, u = pop(t, .3 + i * .5); if (u <= 0) return; g.save(); g.globalAlpha = u; rr(g, x, y, cw - 40, 380, 18, 'rgba(14,20,36,.9)', col); txt(g, n, x + 30, y + 60, col, fnt(800, 40)); txt(g, d, x + 30, y + 120, C.fg, fnt(500, 25)); txt(g, use, x + 30, y + 165, C.fg2, fnt(600, 24)); tools.forEach((s, j) => tag(g, s, x + 30, y + 240 + j * 46, col)); g.restore(); });
  if (k === 0 && t > 1.5) { const u = pop(t, 1.5); g.save(); g.globalAlpha = u; txt(g, '两者经常不一致：开发机是最快的机器，用户的不是', R.x + 60, R.y + 520, C.gold, fnt(700, 28)); bars(g, R.x + 100, R.y + 560, 900, 200, [['开发机', 60, C.b], ['用户 p50', 180, C.g], ['用户 p75', 320, C.o], ['用户 p95', 900, C.r]], t - 1.5, { fmt: v => v + ' ms', gap: .2 }); g.restore(); }
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; rr(g, R.x + 60, R.y + 480, R.w - 120, 300, 16, '#0B1020', C.g); txt(g, 'PerformanceObserver · long-animation-frame', R.x + 90, R.y + 520, C.g, fnt(600, 20, 'mono')); ['{ duration: 184, blockingDuration: 134,', '  scripts: [{ sourceURL: "/assets/grid-3f1a.js",', '              sourceFunctionName: "applyFilter",', '              duration: 171 }] }'].forEach((s, i) => txt(g, s, R.x + 90, R.y + 570 + i * 36, C.fg2, fnt(500, 22, 'mono'))); txt(g, '线上数据直接指到函数', R.x + 1000, R.y + 640, C.gold, fnt(700, 26)); g.restore(); }
};
// 瀑布图
AN.waterfall = (g, t, R, st) => {
  const k = st.k; const x0 = R.x + 300, W = R.w - 360, y0 = R.y + 70; const T = 1000; const X = ms => x0 + ms / T * W;
  for (let ms = 0; ms <= T; ms += 200) { line(g, [[X(ms), y0 - 10], [X(ms), y0 + 560]], C.line, 1); txt(g, ms + ' ms', X(ms), y0 - 28, C.fg3, fnt(500, 18, 'mono'), 'center'); }
  const base = [['HTML', 0, 120, C.fg2], ['app.js（1.2 MB）', 120, 420, C.b], ['执行脚本', 540, 160, C.p], ['/api/orders', 700, 180, C.o], ['渲染', 880, 90, C.g]];
  const opt = { 1: [['HTML', 0, 120, C.fg2], ['首屏代码（300 KB）', 120, 160, C.b], ['执行', 280, 60, C.p], ['/api/orders', 340, 180, C.o], ['渲染', 520, 90, C.g], ['其他路由 · 空闲时', 620, 200, C.line2]],
    2: [['HTML（含 preload）', 0, 120, C.fg2], ['首屏代码', 120, 160, C.b], ['/api/orders（并行）', 120, 180, C.o], ['执行', 280, 60, C.p], ['渲染', 340, 90, C.g]],
    3: [['HTML', 0, 120, C.fg2], ['首屏代码 · 高优先级', 120, 140, C.b], ['/api/orders', 120, 180, C.o], ['大图 fetchpriority=high', 120, 200, C.g], ['字体 · 先显示系统字体', 120, 260, C.fg3], ['渲染', 320, 90, C.g]],
    4: [['HTTP/3 · 连接更快', 0, 70, C.fg2], ['首屏代码', 70, 140, C.b], ['/api/orders', 70, 180, C.o], ['渲染', 260, 90, C.g]] };
  const rows = opt[k] || base; const done = Math.max(...rows.filter(r => r[3] !== C.line2).map(r => r[1] + r[2]));
  rows.forEach(([n, s, d, col], i) => { const u = pop(t, i * .25 + (k ? 0 : 0)); if (u <= 0) return; const y = y0 + 20 + i * 76; g.save(); g.globalAlpha = u; txt(g, n, x0 - 16, y + 24, C.fg, fnt(600, 21), 'right'); g.fillStyle = col; rr(g, X(s), y, (X(s + d) - X(s)) * CL(u * 1.5), 48, 8, col); g.restore(); });
  line(g, [[X(done), y0 - 10], [X(done), y0 + 560]], C.gold, 3); txt(g, `可交互：${done} ms`, X(done) + 10, y0 + 540, C.gold, fnt(700, 24));
  const cap = ['关键路径：每一步等上一步', '代码分割：首屏只要首屏的代码', '预加载：HTML 里先声明 → 脚本与数据并行', '优先级、字体、图片：告诉浏览器什么先来', '网络层：HTTP/3，丢包不阻塞其他请求'][k] || ''; txt(g, cap, R.x + 40, R.y + R.h - 30, C.gold, fnt(600, 26));
};
AN.speculate = (g, t, R, st) => {
  title(g, '推测规则：浏览器提前渲染下一页', R);
  ['<script type="speculationrules">', '{ "prerender": [{', '    "where": { "href_matches": "/orders/*" },', '    "eagerness": "moderate" }] }', '</script>'].forEach((s, i) => txt(g, s, R.x + 40, R.y + 130 + i * 38, i === 1 || i === 2 ? C.gold : C.fg2, fnt(500, 22, 'mono')));
  const ph = (t * .4) % 1; const x = R.x + 900, y = R.y + 120; rr(g, x, y, 700, 400, 14, 'rgba(14,20,36,.9)', C.line2); txt(g, '当前页：订单列表', x + 20, y + 30, C.fg, fnt(600, 22));
  for (let i = 0; i < 5; i++) { const hov = ph > .3 && i === 1; rr(g, x + 20, y + 60 + i * 56, 660, 46, 8, hov ? 'rgba(255,210,122,.15)' : 'rgba(255,255,255,.03)', hov ? C.gold : C.line2); txt(g, `订单 #10${i + 1}`, x + 40, y + 83 + i * 56, C.fg2, fnt(500, 20)); }
  if (ph > .3) { g.save(); g.globalAlpha = CL((ph - .3) / .2); rr(g, x + 420, y + 330, 260, 50, 10, 'rgba(95,224,160,.15)', C.g); txt(g, '空闲时已预渲染 /orders/102', x + 550, y + 355, C.g, fnt(600, 17), 'center'); g.restore(); }
  if (ph > .75) { g.save(); g.globalAlpha = CL((ph - .75) / .1); rr(g, x, y, 700, 400, 14, 'rgba(14,20,36,.97)', C.g); txt(g, '订单 #102 详情', x + 20, y + 30, C.fg, fnt(700, 24)); txt(g, '点击 → 瞬间切换（0 ms 加载）', x + 20, y + 80, C.g, fnt(600, 22)); g.restore(); }
  txt(g, '真实用户数据：启用的站点，交互指标明显更好', R.x + 40, R.y + 400, C.fg2, fnt(500, 23)); txt(g, '代价：预渲染要消耗资源，只对高概率的下一页用', R.x + 40, R.y + 445, C.fg3, fnt(500, 21));
};
// 摇树
AN.treeshake = (g, t, R, st) => {
  const k = st.k; const cx = R.x + 400, cy = R.y + 120; txt(g, 'app.js', cx, cy - 40, C.fg, fnt(700, 24), 'center');
  const mods = ['Button', 'Table', 'Chart', 'Editor', 'Dialog', 'Tabs', 'Upload', 'Tree']; const used = [0, 1]; const shake = k === 0 ? CL((t - 1.5) / 1.5) : 1;
  node(g, cx - 100, cy, 200, 60, 'import { Button }', C.fg2); node(g, cx - 100, cy + 110, 200, 60, 'ui/index.ts', k >= 1 ? C.r : C.fg3, 1, k >= 1 ? '桶文件' : '');
  mods.forEach((m, i) => { const x = cx - 460 + i * 130, y = cy + 260; const keep = used.includes(i) || k >= 1; const a = keep ? 1 : 1 - .75 * shake; line(g, [[cx, cy + 170], [x + 50, y]], keep ? C.line2 : `rgba(44,56,84,${a})`, 2); g.save(); g.globalAlpha = a; node(g, x, y, 100, 56, m, keep ? (i < 2 ? C.g : C.r) : C.fg3); g.restore(); });
  if (k === 0) txt(g, shake > .9 ? '没被用到的模块不打进去（摇树）' : '打包工具分析引用关系…', R.x + 40, R.y + 480, C.fg2, fnt(600, 24));
  if (k >= 1) { txt(g, '引用一个 → 全部带上', R.x + 40, R.y + 480, C.r, fnt(700, 26)); const why = [['桶文件', 'index.ts 把几十个模块 re-export', '直接引用 ui/Button'], ['副作用', '模块顶层有执行语句，工具不敢删', 'package.json: "sideEffects": false'], ['动态引用', 'import(`./charts/${name}`)', '显式列出可能的模块']]; why.forEach(([n, d, fix], i) => { const u = pop(st.tk, .3 + i * .5); if (u <= 0) return; const x = R.x + 1000, y = R.y + 80 + i * 200; g.save(); g.globalAlpha = u; rr(g, x, y, 640, 170, 16, 'rgba(14,20,36,.9)', k >= 2 ? C.g : C.r); txt(g, n, x + 26, y + 40, C.fg, fnt(700, 26)); txt(g, d, x + 26, y + 85, C.fg2, fnt(500, 21, 'mono')); if (k >= 2) txt(g, '→ ' + fix, x + 26, y + 135, C.g, fnt(600, 21, 'mono')); g.restore(); }); }
};
AN.bundlemap = (g, t, R, st) => {
  const k = st.k; title(g, '包体构成（压缩后，示意）', R);
  const parts = [['图表库', 520, C.r], ['富文本编辑器', 380, C.o], ['框架 + 路由', 160, C.b], ['业务代码', 240, C.p], ['工具库 ×2 版本', 90, C.gold], ['其他', 110, C.fg3]]; const tot = parts.reduce((a, p) => a + p[1], 0);
  let x = R.x + 40, y = R.y + 110, W = R.w - 80; parts.forEach(([n, v, col], i) => { const w = v / tot * W, u = pop(t, i * .15); g.save(); g.globalAlpha = u; rr(g, x, y, w - 4, 140, 10, col); txt(g, n, x + w / 2, y + 55, '#000', fnt(700, w > 150 ? 22 : 17), 'center'); txt(g, v + ' KB', x + w / 2, y + 90, '#000', fnt(600, 19, 'mono'), 'center'); g.restore(); x += w; });
  txt(g, `合计 ${tot} KB（gzip）`, R.x + 40, y + 180, C.fg2, fnt(600, 24));
  const notes = { 0: ['图表库 + 编辑器 = 60%，却只在一个页面用到 → 懒加载', '同一个工具库被不同依赖引用了两个版本 → 对齐版本'], 1: ['属性名压缩：{ orderNumber } → { a }，再省 5–10%', '前提：代码里没有 obj["orderNumber"] 这种字符串访问'], 2: ['下载 1 MB 可能只要 1 s', '解析 + 执行在普通机器上要 2–3 s —— 这段时间主线程是满的'] };
  (notes[k] || []).forEach((s, i) => { const u = pop(st.tk, .3 + i * .6); g.save(); g.globalAlpha = u; txt(g, s, R.x + 40, y + 260 + i * 60, i ? C.fg2 : C.gold, fnt(600, 25)); g.restore(); });
  if (k === 2) { const u = pop(st.tk, 1.5); g.save(); g.globalAlpha = u; const yy = y + 420; txt(g, '1 MB JavaScript 在不同机器上', R.x + 40, yy - 30, C.fg, fnt(700, 24)); [['高端笔记本', .3, .6], ['普通办公机', .6, 1.6], ['低端机', 1.0, 3.2]].forEach(([n, dl, ex], i) => { const Y = yy + i * 60; txt(g, n, R.x + 240, Y + 20, C.fg2, fnt(500, 21), 'right'); g.fillStyle = C.b; g.fillRect(R.x + 260, Y, dl * 220, 36); g.fillStyle = C.p; g.fillRect(R.x + 260 + dl * 220, Y, ex * 220, 36); txt(g, `下载 ${dl}s · 解析执行 ${ex}s`, R.x + 270 + (dl + ex) * 220, Y + 18, C.fg3, fnt(500, 20)); }); g.restore(); }
};
// 布局抖动
AN.thrash = (g, t, R, st) => {
  const k = st.k; const ph = (t * .5) % 1;
  rr(g, R.x + 40, R.y + 60, 760, 380, 14, '#0B1020', C.line2); const bad = ['for (const row of rows) {', '  row.style.width = base + "px"   // 写', '  total += row.offsetHeight         // 读 → 强制布局', '}'], good = ['const hs = rows.map(r => r.offsetHeight)  // 先全部读', 'rows.forEach((r, i) => {', '  r.style.width = base + hs[i] + "px"      // 再全部写', '})'];
  (k >= 1 ? good : bad).forEach((s, i) => txt(g, s, R.x + 60, R.y + 110 + i * 42, /读|写/.test(s) ? C.gold : C.fg2, fnt(500, 21, 'mono')));
  txt(g, k >= 1 ? '读写分离：布局只做一次' : '布局抖动：每次读位置都强制算一次布局', R.x + 60, R.y + 300, k >= 1 ? C.g : C.r, fnt(700, 26));
  // 时间线
  const x0 = R.x + 860, W = R.w - 900, y = R.y + 100; txt(g, '主线程时间线', x0, y - 30, C.fg2, fnt(600, 22));
  const n = 24; for (let i = 0; i < n; i++) { const X = x0 + i * W / n; if (k >= 1) { g.fillStyle = i < 12 ? C.b : C.g; g.fillRect(X, y, W / n - 3, 50); } else { g.fillStyle = i % 2 ? C.p : C.b; g.fillRect(X, y, W / n - 3, 50); } }
  if (k >= 1) { g.fillStyle = C.p; g.fillRect(x0 + W + 10, y, 30, 50); txt(g, '布局 ×1', x0 + W + 50, y + 25, C.p, fnt(600, 20)); txt(g, '读 ×N', x0 + W * .25, y + 80, C.b, fnt(600, 20), 'center'); txt(g, '写 ×N', x0 + W * .75, y + 80, C.g, fnt(600, 20), 'center'); }
  else { txt(g, '写 · 布局 · 写 · 布局 · 写 · 布局 …', x0, y + 80, C.p, fnt(600, 20)); }
  txt(g, k >= 1 ? '100 行：约 1 ms' : '100 行：约 100 次布局，几十毫秒', x0, y + 130, k >= 1 ? C.g : C.r, fnt(700, 26));
  const fr = ['getBoundingClientRect', 'offsetWidth / offsetHeight', 'scrollTop', 'getComputedStyle(...).width']; txt(g, '这些读操作会强制布局：', x0, y + 220, C.fg, fnt(600, 22)); fr.forEach((s, i) => txt(g, s, x0, y + 260 + i * 36, C.fg3, fnt(500, 20, 'mono')));
};
AN.layers3d = (g, t, R, st) => {
  title(g, '合成层：动画元素有自己的图层', R);
  const cx = R.x + 500, cy = R.y + 520; const layers = [['页面内容', C.fg3], ['侧栏', C.b], ['拖动中的面板（will-change: transform）', C.o]];
  layers.forEach(([n, col], i) => { const u = pop(t, .3 + i * .5); if (u <= 0) return; const dy = -i * 110; g.save(); g.globalAlpha = u; g.setTransform(1, -.3, 1, .3, cx - 400 + i * 40, cy + dy + 200); rr(g, 0, 0, 520, 320, 12, i === 2 ? 'rgba(255,178,92,.25)' : 'rgba(92,180,255,.12)', col, 2.5); g.setTransform(1, 0, 0, 1, 0, 0); txt(g, n, cx + 520, cy + dy + 60, col, fnt(600, 24)); g.restore(); });
  const ph = (t * .6) % 1; g.save(); g.globalAlpha = pop(t, 1.5); g.setTransform(1, -.3, 1, .3, cx - 400 + 80 + 80 * Math.sin(ph * 6.28) + 80, cy - 220 + 200); rr(g, 60, 60, 200, 160, 10, 'rgba(255,178,92,.6)', C.o); g.restore();
  txt(g, '只是 GPU 换个位置贴图，不动其他层', R.x + 1000, R.y + 120, C.fg, fnt(700, 26)); txt(g, '每一层是一张位图，占显存', R.x + 1000, R.y + 170, C.fg2, fnt(500, 22)); txt(g, '几百个元素都加 will-change → 显存爆、合成反而更慢', R.x + 1000, R.y + 215, C.r, fnt(600, 22));
};
AN.cv = (g, t, R, st) => {
  const k = st.k; title(g, k >= 1 ? 'DOM 总量' : 'content-visibility：视口外的先不算', R);
  if (k === 0) { const px = R.x + 40, py = R.y + 100, pw = 600, ph2 = 640; rr(g, px, py, pw, ph2, 12, 'rgba(14,20,36,.9)', C.line2); rr(g, px, py, pw, 200, 12, 'rgba(92,180,255,.1)', C.b, 2); txt(g, '视口', px + 16, py + 24, C.b, fnt(600, 20));
    for (let i = 0; i < 12; i++) { const y = py + 20 + i * 52; const vis = y < py + 200; const u = pop(t, vis ? i * .1 : 1.2 + i * .05); g.save(); g.globalAlpha = u; rr(g, px + 20, y, pw - 40, 42, 8, vis ? 'rgba(95,224,160,.2)' : 'rgba(255,255,255,.03)', vis ? C.g : C.line2); txt(g, vis ? `区块 ${i + 1} · 布局 + 绘制` : `区块 ${i + 1} · 跳过（contain-intrinsic-size 占位）`, px + 36, y + 21, vis ? C.fg : C.fg3, fnt(500, 19)); g.restore(); }
    ['.section {', '  content-visibility: auto;', '  contain-intrinsic-size: auto 400px;', '}'].forEach((s, i) => txt(g, s, R.x + 720, R.y + 140 + i * 40, i === 1 ? C.gold : C.fg2, fnt(500, 23, 'mono'))); txt(g, '很长的页面：首次渲染快好几倍', R.x + 720, R.y + 340, C.fg, fnt(700, 26)); txt(g, 'contain: layout paint —— 这块里的变化不波及外面', R.x + 720, R.y + 400, C.fg2, fnt(500, 22)); }
  else { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; bars(g, R.x + 120, R.y + 140, 800, 360, [['2 千节点', 3, C.g], ['1 万节点', 18, C.o], ['5 万节点', 110, C.r]], st.tk, { fmt: v => v + ' ms' }); txt(g, '一次样式重算的耗时（示意）', R.x + 120, R.y + 110, C.fg2, fnt(600, 22));
    [['能用 CSS 画的，不用元素堆', '边框、角标、分隔线用伪元素'], ['能复用的，不重复渲染', '列表项用同一组节点换数据（虚拟化）'], ['看不见的，先不渲染', '折叠面板、未激活的标签页']].forEach(([a, b], i) => { const Y = R.y + 150 + i * 150; rr(g, R.x + 1000, Y, 640, 120, 14, 'rgba(14,20,36,.9)', C.g); txt(g, a, R.x + 1026, Y + 44, C.fg, fnt(700, 24)); txt(g, b, R.x + 1026, Y + 86, C.fg3, fnt(500, 20)); }); g.restore(); }
};
// 虚拟化
AN.virt = (g, t, R, st) => {
  const k = st.k; const px = R.x + 40, py = R.y + 60, pw = 820, ph2 = 700;
  rr(g, px, py, pw, ph2, 12, 'rgba(14,20,36,.9)', C.line2); const rowH = 44, total = 100000; const scroll = k === 0 ? 0 : ((t * 120) % 3000); const first = Math.floor(scroll / rowH);
  g.save(); g.beginPath(); g.rect(px, py, pw, ph2); g.clip(); const n = k === 0 ? Math.min(400, Math.floor(t * 60)) : 18; for (let i = 0; i < (k === 0 ? n : 18); i++) { const idx = first + i, y = py + (k === 0 ? i * rowH : i * rowH - (scroll % rowH)); if (y > py + ph2) break; rr(g, px + 10, y + 4, pw - 40, rowH - 8, 6, i % 2 ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.06)', null); txt(g, `#${String(idx + 1).padStart(6, '0')}`, px + 24, y + rowH / 2, C.fg3, fnt(500, 19, 'mono')); for (let c = 0; c < 6; c++) { g.fillStyle = C.line2; g.fillRect(px + 160 + c * 105, y + 16, 80 - (idx * 7 + c * 13) % 30, 12); } } g.restore();
  g.fillStyle = C.line2; g.fillRect(px + pw - 14, py + 10, 8, ph2 - 20); g.fillStyle = C.fg2; g.fillRect(px + pw - 14, py + 10 + (ph2 - 60) * (scroll / 3000), 8, 40);
  if (k === 0) { txt(g, `已渲染 ${Math.min(n, 400) * 20} / 2,000,000 个单元格…`, R.x + 900, R.y + 120, C.r, fnt(700, 28)); txt(g, '十万行 × 二十列，全部变成 DOM', R.x + 900, R.y + 170, C.fg2, fnt(500, 23)); txt(g, '→ 内存几 GB，浏览器卡死', R.x + 900, R.y + 215, C.r, fnt(600, 23)); }
  else { txt(g, `DOM 里只有 18 行 · 第 ${first + 1}–${first + 18} 行`, R.x + 900, R.y + 120, C.g, fnt(700, 28)); const tips = { 1: ['占位元素撑出 100000 × 44 px 的高度', '滚动时复用这 18 行，换上新数据'], 2: ['固定行高：序号 = scrollTop / 行高', '动态行高：边渲染边测量，用平均值估计没测过的，再修正'], 3: ['Canvas 直绘：没有 DOM，滚动只是重画一张图', '代价：文字选择、无障碍、输入法要自己做'] }; (tips[k] || []).forEach((s, i) => { g.save(); g.globalAlpha = pop(st.tk, .3 + i * .5); txt(g, s, R.x + 900, R.y + 190 + i * 50, i ? C.fg3 : C.fg2, fnt(500, 22)); g.restore(); });
    if (k === 3) { g.save(); g.globalAlpha = pop(st.tk, 1.2); rr(g, R.x + 900, R.y + 330, 700, 300, 12, '#000', C.gold); txt(g, '<canvas>', R.x + 920, R.y + 355, C.gold, fnt(600, 18, 'mono')); for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) { g.strokeStyle = C.line2; g.strokeRect(R.x + 920 + c * 132, R.y + 375 + r * 40, 132, 40); txt(g, (r * 5 + c) * 137 % 9999, R.x + 930 + c * 132, R.y + 395 + r * 40, C.fg2, fnt(400, 17, 'mono')); } g.restore(); } }
};
AN.virtbar = (g, t, R, st) => { title(g, '十万行表格（量级示意）', R); bars(g, R.x + 100, R.y + 160, 1000, 440, [['全部渲染', 12000, C.r, '滚动掉帧 · 内存几 GB'], ['虚拟化 DOM', 40, C.g, '60 fps'], ['Canvas 直绘', 30, C.b, '60 fps · 自做选择/无障碍']], t, { fmt: v => v >= 1000 ? (v / 1000) + ' s' : v + ' ms' }); txt(g, '首次渲染耗时（对数感受：12 s ↔ 40 ms，三百倍）', R.x + 100, R.y + 700, C.fg3, fnt(500, 22)); };
// 切片
AN.slice = (g, t, R, st) => {
  const k = st.k; const x0 = R.x + 60, W = R.w - 120; const y1 = R.y + 90, y2 = R.y + 330;
  txt(g, '一块 300 ms 的同步工作', x0, y1 - 30, C.fg, fnt(700, 24)); g.fillStyle = C.r; g.fillRect(x0, y1, W * .6, 60); txt(g, 'filterRows(100000)', x0 + W * .3, y1 + 30, '#fff', fnt(700, 22), 'center'); for (let i = 1; i < 18; i++) { const X = x0 + i * W * .6 / 18; txt(g, '✕', X, y1 + 95, C.r, fnt(700, 22), 'center'); } txt(g, '18 帧没画出来 · 悬停高亮不动 · 第二次点击排队', x0, y1 + 140, C.r, fnt(600, 22));
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; txt(g, '切片：每 10 ms 让出一次', x0, y2 - 30, C.fg, fnt(700, 24)); for (let i = 0; i < 30; i++) { const X = x0 + i * W * .6 / 30 * 1.5; if (X > x0 + W) break; g.fillStyle = C.g; g.fillRect(X, y2, W * .6 / 30 * 1.5 * .55, 60); g.fillStyle = C.b; g.fillRect(X + W * .6 / 30 * 1.5 * .55, y2, W * .6 / 30 * 1.5 * .35, 60); } txt(g, '绿：计算 10 ms  蓝：让出 → 画一帧、处理输入', x0, y2 + 95, C.fg2, fnt(500, 22));
    ['for (const chunk of chunks(rows, 5000)) {', '  process(chunk)', '  await scheduler.yield()   // 让出，但继续排在前面', '}'].forEach((s, i) => txt(g, s, x0, y2 + 160 + i * 38, /yield/.test(s) ? C.gold : C.fg2, fnt(500, 22, 'mono'))); txt(g, '总时间没少，但每一帧都有机会响应', x0, y2 + 340, C.gold, fnt(700, 26)); g.restore(); }
};
AN.transition = (g, t, R, st) => {
  title(g, 'startTransition：输入框先响应，列表可以等', R);
  const ph = (t * .7) % 3; const typed = 'inv'.slice(0, Math.min(3, Math.floor(ph * 2))); const x = R.x + 60, y = R.y + 120;
  rr(g, x, y, 700, 64, 12, '#0B1020', C.b, 2.5); txt(g, typed + (Math.floor(t * 2) % 2 ? '|' : ''), x + 20, y + 32, C.fg, fnt(600, 28, 'mono')); txt(g, '搜索 10 万行', x + 680, y + 32, C.fg3, fnt(500, 20), 'right');
  txt(g, '紧急更新：输入框 —— 立刻', x, y + 100, C.b, fnt(600, 22));
  const lag = CL((ph % 1) / .6); rr(g, x, y + 150, 700, 400, 12, 'rgba(14,20,36,.9)', C.line2); g.save(); g.globalAlpha = .4 + .6 * lag; for (let i = 0; i < 8; i++) { rr(g, x + 16, y + 166 + i * 46, 668, 38, 6, 'rgba(255,255,255,.04)', null); txt(g, `invoice-${1000 + i * 37 + typed.length * 11}`, x + 32, y + 185 + i * 46, C.fg2, fnt(500, 20, 'mono')); } g.restore(); if (lag < 1) txt(g, '（结果稍后更新，可被新的输入打断）', x + 350, y + 580, C.fg3, fnt(500, 20), 'center');
  txt(g, '过渡更新：筛选结果 —— 可打断、可延后', x, y + 610, C.p, fnt(600, 22));
  ['const [q, setQ] = useState("")', 'const [shown, setShown] = useState(rows)', '', 'onChange = e => {', '  setQ(e.target.value)                // 紧急', '  startTransition(() =>', '    setShown(filter(rows, e.target.value)))  // 可打断', '}'].forEach((s, i) => txt(g, s, R.x + 860, R.y + 140 + i * 40, /紧急|打断/.test(s) ? C.gold : C.fg2, fnt(500, 21, 'mono')));
  txt(g, '用户感受到的是"跟手"', R.x + 860, R.y + 520, C.fg, fnt(700, 26));
};
AN.worker = (g, t, R, st) => {
  const k = st.k; const y = R.y + 120; node(g, R.x + 60, y, 360, 110, '主线程', C.b, 1, '界面 · 事件 · 画'); node(g, R.x + 60, y + 300, 360, 110, 'Web Worker', C.g, 1, '另一条线程 · 没有 DOM');
  const ph = (t * .5) % 1; arrow(g, R.x + 240 - 40, y + 115, R.x + 240 - 40, y + 295, C.fg3, 2.5); arrow(g, R.x + 240 + 40, y + 295, R.x + 240 + 40, y + 115, C.fg3, 2.5); dot(g, R.x + 200, LERP(y + 120, y + 290, ph), 7, C.b); dot(g, R.x + 280, LERP(y + 290, y + 120, ph), 7, C.g); txt(g, 'postMessage', R.x + 450, y + 205, C.fg3, fnt(500, 20, 'mono'));
  const jobs = ['解析大文件', '建索引', '全文搜索', '压缩 / 解压', '图像处理', '语法高亮']; jobs.forEach((s, i) => { const u = pop(t, .5 + i * .2); g.save(); g.globalAlpha = u; tag(g, s, R.x + 700 + (i % 3) * 240, y + 30 + Math.floor(i / 3) * 56, C.g); g.restore(); }); txt(g, '搬到 Worker：', R.x + 700, y - 20, C.fg, fnt(700, 24));
  txt(g, '留在主线程：任何碰 DOM 的事', R.x + 700, y + 180, C.fg2, fnt(600, 22));
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; node(g, R.x + 700, y + 300, 400, 110, 'OffscreenCanvas', C.o, 1, 'Worker 直接往画布上画'); arrow(g, R.x + 430, y + 355, R.x + 690, y + 355, C.o, 3); txt(g, 'canvas.transferControlToOffscreen()', R.x + 1130, y + 335, C.fg3, fnt(500, 20, 'mono')); txt(g, '主线程再忙，图表也不卡', R.x + 1130, y + 375, C.fg, fnt(600, 22)); g.restore(); }
};
AN.slicebar = (g, t, R, st) => { title(g, '同样 300 ms 的工作', R); bars(g, R.x + 150, R.y + 150, 900, 420, [['同步做完', 300, C.r, '18 帧冻住'], ['切片 · 让出', 32, C.g, '每帧都能响应'], ['搬到 Worker', 16, C.b, '主线程几乎空闲']], t, { fmt: v => v + ' ms' }); txt(g, 'INP（交互到下一次绘制）', R.x + 150, R.y + 120, C.fg2, fnt(600, 22)); txt(g, '总工作量没变，用户感觉完全不同', R.x + 1150, R.y + 350, C.gold, fnt(700, 28)); };
// 内存
AN.leak = (g, t, R, st) => {
  const k = st.k; const x0 = R.x + 80, y0 = R.y + 520, W = 800, H = 400; line(g, [[x0, y0], [x0 + W, y0]], C.line2, 2); line(g, [[x0, y0], [x0, y0 - H]], C.line2, 2); txt(g, '内存', x0 - 10, y0 - H, C.fg3, fnt(500, 20), 'right'); txt(g, '时间（小时）', x0 + W, y0 + 30, C.fg3, fnt(500, 20), 'right');
  const n = Math.floor(CL(t / 5) * 200); g.strokeStyle = C.r; g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= n; i++) { const u = i / 200; const y = y0 - (40 + u * 320 + Math.sin(u * 60) * 12 * (1 - u * .5) - (Math.floor(u * 8) % 2) * 0); const X = x0 + u * W; i ? g.lineTo(X, y) : g.moveTo(X, y); } g.stroke(); [0, 2, 4, 6, 8].forEach(h => txt(g, h, x0 + h / 8 * W, y0 + 26, C.fg3, fnt(500, 18, 'mono'), 'center'));
  if (n >= 200) { txt(g, '✕ 标签页崩溃', x0 + W - 10, y0 - H + 10, C.r, fnt(700, 24), 'right'); }
  g.strokeStyle = C.g; g.setLineDash([8, 8]); g.beginPath(); for (let i = 0; i <= 200; i++) { const u = i / 200; const y = y0 - (40 + Math.sin(u * 60) * 14 + 30 * (1 - Math.exp(-u * 6))); i ? g.lineTo(x0 + u * W, y) : g.moveTo(x0 + u * W, y); } g.stroke(); g.setLineDash([]); txt(g, '健康：涨了会回落', x0 + W + 10, y0 - 70, C.g, fnt(600, 20)); txt(g, '泄漏：只涨不降', x0 + 420, y0 - 260, C.r, fnt(600, 22));
  if (k >= 1) { const L = [['事件监听器', '加了没删'], ['定时器', '设了没清'], ['闭包', '抓住了大对象'], ['Map 缓存', '只放不拿'], ['分离的 DOM', '节点移除了，变量还指着它']]; L.forEach(([n2, d], i) => { const u = pop(st.tk, .2 + i * .35); if (u <= 0) return; const y = R.y + 70 + i * 100; g.save(); g.globalAlpha = u; rr(g, R.x + 1000, y, 640, 84, 14, 'rgba(14,20,36,.9)', C.r); txt(g, n2, R.x + 1026, y + 30, C.fg, fnt(700, 24)); txt(g, d, R.x + 1026, y + 62, C.fg3, fnt(500, 20)); g.restore(); }); }
};
AN.snapshot = (g, t, R, st) => {
  const k = st.k; title(g, '三次快照', R);
  const steps = ['快照 1', '做一组操作', '快照 2', '再做一组', '快照 3']; steps.forEach((s, i) => { const u = pop(t, .3 + i * .4); const x = R.x + 60 + i * 320; node(g, x, R.y + 100, 260, 70, s, i % 2 ? C.fg3 : C.b, u); if (i) arrow(g, x - 60 + 6, R.y + 135, x - 8, R.y + 135, C.fg3, 2.5, 10, u); });
  const u2 = pop(t, 2.4); g.save(); g.globalAlpha = u2; const tx = R.x + 60, ty = R.y + 230; rr(g, tx, ty, 1000, 300, 14, '#0B1020', C.line2); const hdr = ['构造函数', '快照1', '快照2', '快照3', '只增不减']; hdr.forEach((h, j) => txt(g, h, tx + 30 + j * 200, ty + 36, C.fg3, fnt(600, 20), j ? 'center' : 'left'));
  const rows = [['RowView', 120, 980, 1840, true], ['Array', 3100, 3120, 3090, false], ['(closure)', 880, 1720, 2560, true], ['HTMLDivElement（分离）', 0, 860, 1720, true], ['Object', 9000, 9100, 9050, false]];
  rows.forEach(([n, a, b, c2, bad], i) => { const y = ty + 80 + i * 42; txt(g, n, tx + 30, y, bad ? C.r : C.fg2, fnt(500, 21, 'mono')); [a, b, c2].forEach((v, j) => txt(g, v, tx + 230 + j * 200, y, bad ? C.fg : C.fg3, fnt(500, 21, 'mono'), 'center')); txt(g, bad ? '↑↑ 泄漏点' : '—', tx + 830, y, bad ? C.r : C.fg3, fnt(600, 20), 'center'); }); g.restore();
  txt(g, '开发者工具可以直接看到是谁引用着它（Retainers）', R.x + 60, R.y + 580, C.fg2, fnt(500, 22));
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const D = [['卸载时清理所有订阅', 'const ac = new AbortController(); el.addEventListener(..., { signal: ac.signal }); ac.abort()'], ['缓存用 WeakMap 或带上限的 LRU', '键被回收，值跟着走'], ['大对象用完置空 · 线上定期采样内存曲线', '']]; D.forEach(([a, b], i) => { const y = R.y + 640 + i * 60; txt(g, '· ' + a, R.x + 60, y, C.g, fnt(600, 23)); if (b) txt(g, b, R.x + 560, y, C.fg3, fnt(500, 18, 'mono')); }); g.restore(); }
};
// 图形
AN.gfx = (g, t, R, st) => {
  const k = st.k; const cols = [['Canvas 2D', '几千个图形', 'API 简单，每帧重画', C.b, 2000], ['WebGL', '几十万个点', '交给 GPU，要写着色器', C.g, 300000], ['WebGPU', '几十万 + 通用计算', '物理模拟 · 矩阵运算', C.p, 1000000]];
  const cw = (R.w - 80) / 3; cols.forEach(([n, cap, d, col, N], i) => { const x = R.x + 40 + i * cw, y = R.y + 60, u = pop(t, .3 + i * .4); if (u <= 0) return; g.save(); g.globalAlpha = u; rr(g, x, y, cw - 40, 420, 18, 'rgba(14,20,36,.9)', col); txt(g, n, x + 30, y + 50, col, fnt(800, 34)); txt(g, cap, x + 30, y + 100, C.fg, fnt(600, 25)); txt(g, d, x + 30, y + 140, C.fg3, fnt(500, 21));
    // 点云示意
    g.beginPath(); g.rect(x + 20, y + 180, cw - 80, 220); g.clip(); let s = 11 + i; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; const cnt = [60, 900, 2500][i]; for (let j = 0; j < cnt; j++) { const a = rnd() * 6.28, r = rnd() ** .5 * 100; g.fillStyle = col; g.globalAlpha = u * (i ? .5 : 1); g.fillRect(x + cw / 2 - 20 + Math.cos(a + t * .3) * r * 1.8, y + 290 + Math.sin(a + t * .3) * r, i ? 2 : 6, i ? 2 : 6); } g.restore(); });
  const notes = { 2: '需要点选、拖动 → 自己做拾取（DOM 免费给的，画布没有）', 3: 'Canvas 里的文字：每次 measureText 都贵 → Pretext：缓存字宽直接算换行，不碰 DOM，快两个数量级' }; if (notes[k]) txt(g, notes[k], R.x + 40, R.y + 560, C.gold, fnt(600, 24));
  if (k === 3) { const u = pop(st.tk, .5); g.save(); g.globalAlpha = u; bars(g, R.x + 200, R.y + 600, 700, 160, [['DOM 排版 + 读取', 100, C.fg3], ['Pretext', 1, C.g]], st.tk, { fmt: v => v + '×' }); g.restore(); }
};
AN.cache3 = (g, t, R, st) => {
  const k = st.k; const L = [['内存', '关掉就没 · 微秒', C.g], ['本地存储', 'IndexedDB / OPFS · 关掉还在 · 毫秒', C.b], ['网络', '几十到几百毫秒 · 可能离线', C.o]];
  L.forEach(([n, d, col], i) => { const u = pop(t, .3 + i * .4), y = R.y + 80 + i * 150; g.save(); g.globalAlpha = u; rr(g, R.x + 60, y, 700, 110, 16, 'rgba(14,20,36,.9)', col); txt(g, n, R.x + 90, y + 42, col, fnt(800, 30)); txt(g, d, R.x + 90, y + 84, C.fg3, fnt(500, 21)); g.restore(); });
  const ph = (t * .4) % 1; const rd = k !== 1 || ph < .5; const yy = i => R.y + 135 + i * 150; const col = rd ? C.g : C.o; txt(g, rd ? '读：从近到远' : '写：先本地，再同步', R.x + 820, R.y + 60, col, fnt(700, 26));
  if (rd) { const p = (ph * 2) % 1; arrow(g, R.x + 790, yy(0), R.x + 790, yy(2) - 20, C.g, 3); dot(g, R.x + 790, LERP(yy(0), yy(2) - 20, p), 8, C.g); ['有 → 用', '没有 → 查', '再没有 → 请求'].forEach((s, i) => txt(g, s, R.x + 820, yy(i), C.fg2, fnt(500, 22))); }
  else { const p = ((ph - .5) * 2) % 1; arrow(g, R.x + 790, yy(2), R.x + 790, yy(0) + 20, C.o, 3); dot(g, R.x + 790, LERP(yy(1), yy(2), p), 8, C.o); ['立刻显示', '先写这里', '再同步到服务器'].forEach((s, i) => txt(g, s, R.x + 820, yy(i), C.fg2, fnt(500, 22))); }
  const notes = { 1: ['切换页面是瞬间的，离线也能看'], 2: ['合并同一时刻的多个请求', '取消已离开页面的请求', '列表用分页 / 游标，不一次全拿', '返回越少 → 解析越快、内存越省'], 3: ['Service Worker：拦截所有请求，更彻底的离线', '坑：缓存策略写错 → 用户永远拿不到新版本', '桌面应用通常只用它缓存静态资源，数据层自己管'] };
  (notes[k] || []).forEach((s, i) => { g.save(); g.globalAlpha = pop(st.tk, .3 + i * .4); txt(g, '· ' + s, R.x + 1100, R.y + 110 + i * 60, i === 1 && k === 3 ? C.r : C.fg2, fnt(500, 23)); g.restore(); });
};
