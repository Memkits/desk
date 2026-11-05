// 上集动画
const LAYERS = [['网络', C.fg3], ['解析 DOM / CSSOM', C.fg3], ['样式计算', C.fg3], ['布局', C.fg3], ['绘制', C.fg3], ['合成', C.fg3], ['TypeScript', C.b], ['CSS', C.b], ['反应式模型', C.p], ['状态', C.p], ['渲染位置', C.p], ['工具链', C.o], ['供应链', C.o]];
const GROUPS = [[0, 6, '平台', C.fg2], [6, 8, '语言', C.b], [8, 11, '框架', C.p], [11, 13, '工程', C.o]];
function stack(g, t, R, lit, labels = true) {
  const n = LAYERS.length, h = Math.min(52, (R.h - 40) / n), x = R.x + 360, w = 560, y0 = R.y + R.h - 20;
  LAYERS.forEach(([name, col], i) => { const u = typeof lit === 'function' ? lit(i) : pop(t, i * .18, .5); if (u <= 0) return; const y = y0 - (i + 1) * (h + 4); g.save(); g.globalAlpha = u; rr(g, x + (1 - u) * 40, y, w, h, 10, 'rgba(14,20,36,.9)', col, 2); txt(g, name, x + w / 2, y + h / 2, C.fg, fnt(600, 24), 'center'); g.restore(); });
  if (labels) GROUPS.forEach(([a, b, name, col]) => { const u = pop(t, b * .18, .5); if (u <= 0) return; const y1 = y0 - (b) * (h + 4), y2 = y0 - a * (h + 4) - 4; g.save(); g.globalAlpha = u; line(g, [[x - 30, y1 + 6], [x - 30, y2 - 6]], col, 4); txt(g, name, x - 50, (y1 + y2) / 2, col, fnt(700, 28), 'right'); g.restore(); });
  return { x, w, h, y0 };
}
AN.layers = (g, t, R, st) => {
  const S = stack(g, t, R);
  const k = st.k;
  if (k >= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; txt(g, '桌面浏览器里的前端', R.x + 1060, R.y + 80, C.fg, fnt(700, 34));
    [['长时间打开', '一天，不是十秒'], ['数据量大', '十万行表格、几千个节点'], ['交互密集', '快捷键、拖拽、多面板']].forEach(([a, b], i) => { const uu = pop(st.tk, .5 + i * .35); g.globalAlpha = uu; rr(g, R.x + 1060, R.y + 130 + i * 110, 560, 86, 14, 'rgba(14,20,36,.9)', C.line2); txt(g, a, R.x + 1084, R.y + 130 + i * 110 + 30, C.fg, fnt(700, 26)); txt(g, b, R.x + 1084, R.y + 130 + i * 110 + 62, C.fg3, fnt(500, 20)); });
    g.globalAlpha = pop(st.tk, 2.5); [['上集', '地图'], ['中集', '优化'], ['下集', '架构 · 客户端']].forEach(([a, b], i) => { tag(g, `${a} · ${b}`, R.x + 1060 + i * 185, R.y + 520, [C.b, C.g, C.o][i]); }); g.restore(); }
  if (k >= 2) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; txt(g, '问题发生在哪一层，就去哪一层解决', R.x + 1060, R.y + 640, C.gold, fnt(700, 30)); g.restore(); }
};
AN.layers2 = (g, t, R, st) => {
  const S = stack(g, t, R, i => pop(t, i * .1, .4));
  const k = st.k; const ex = [['页面卡顿', 0, 5, '平台：主线程被占'], ['重复请求', 9, 9, '状态：缺少去重与缓存'], ['包太大', 11, 11, '工程：打包与依赖']];
  if (k >= 1) ex.forEach(([q, a, b, ans], i) => { const u = pop(st.tk, .4 + i * 1.2); if (u <= 0) return; const y = R.y + 120 + i * 150; g.save(); g.globalAlpha = u; rr(g, R.x + 1060, y, 540, 110, 14, 'rgba(14,20,36,.9)', C.gold); txt(g, q, R.x + 1084, y + 34, C.fg, fnt(700, 28)); txt(g, ans, R.x + 1084, y + 76, C.fg3, fnt(500, 21)); const ly = S.y0 - (b + .5) * (S.h + 4); arrow(g, R.x + 1050, y + 55, S.x + S.w + 10, ly, C.gold, 2.5, 10, u); g.restore(); });
  if (k >= 2) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; txt(g, '中集：度量 → 加载 → 包体 → 渲染 → 交互 → 内存', R.x + 1060, R.y + 640, C.g, fnt(700, 28)); g.restore(); }
};
// 事件循环
AN.loop = (g, t, R, st) => {
  const cx = R.x + 420, cy = R.y + R.h / 2 + 10, r = 150, k = st.k;
  g.strokeStyle = C.line2; g.lineWidth = 16; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke();
  const an = t * 1.2; dot(g, cx + r * Math.cos(an), cy + r * Math.sin(an), 16, C.gold);
  txt(g, '主线程', cx, cy - 20, C.fg, fnt(700, 34), 'center'); txt(g, '事件循环', cx, cy + 24, C.fg3, fnt(500, 22), 'center');
  // 宏任务队列
  const qx = R.x + 760, qy = cy - 160; txt(g, '宏任务队列', qx, qy - 36, C.fg2, fnt(600, 24));
  const macro = ['点击', '定时器', '网络回调', '点击', '定时器']; const sh = (t * .8) % 1;
  macro.forEach((s, i) => { const X = qx + i * 150 - sh * 150; if (X < qx - 100) return; const u = CL((X - qx + 150) / 150); g.save(); g.globalAlpha = u; rr(g, X, qy, 130, 56, 12, 'rgba(14,20,36,.9)', C.b); txt(g, s, X + 65, qy + 28, C.fg, fnt(600, 22), 'center'); g.restore(); });
  arrow(g, qx - 20, qy + 28, cx + r + 30, cy - 60, C.b, 3);
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const my = cy + 80; txt(g, '微任务队列（Promise 回调）', qx, my - 36, C.fg2, fnt(600, 24));
    for (let i = 0; i < 4; i++) { const X = qx + i * 110; rr(g, X, my, 92, 48, 12, 'rgba(14,20,36,.9)', C.p); txt(g, 'then', X + 46, my + 24, C.fg, fnt(600, 20), 'center'); }
    arrow(g, qx - 20, my + 24, cx + r + 30, cy + 60, C.p, 3);
    txt(g, '当前任务一结束，微任务全部清空，再取下一个宏任务', qx, my + 100, C.gold, fnt(600, 23)); g.restore(); }
  if (k >= 2) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const y = R.y + R.h - 120; rr(g, R.x + 20, y - 40, R.w - 40, 120, 14, 'rgba(255,122,147,.08)', C.r);
    txt(g, 'await 死循环：每个 Promise 回调又排一个微任务 → 微任务队列永远不空 → 定时器、点击永远排不上', R.x + 44, y, C.fg, fnt(600, 24));
    txt(g, 'setTimeout 循环：每轮是一个宏任务 → 中间有机会处理输入、画一帧', R.x + 44, y + 44, C.fg2, fnt(500, 22)); g.restore(); }
};
// 帧预算
AN.frame = (g, t, R, st) => {
  const k = st.k, x0 = R.x + 40, y = R.y + 200, W = R.w - 80, fw = W / 14; // 14 帧
  txt(g, '时间 →   每格一帧（16.7 ms）', x0, y - 50, C.fg2, fnt(600, 24));
  for (let i = 0; i < 14; i++) { rr(g, x0 + i * fw, y, fw - 4, 70, 6, 'rgba(14,20,36,.9)', C.line2); }
  // 每帧内部：输入 / rAF / 样式布局绘制
  const prog = CL(t / 6) * 14;
  for (let i = 0; i < 14; i++) { if (i > prog) break; const X = x0 + i * fw + 6; const seg = [[.12, C.o, '输入'], [.18, C.p, 'rAF'], [.4, C.b, '样式·布局·绘制']]; let off = 0; seg.forEach(([w, col]) => { g.fillStyle = col; g.fillRect(X + off * (fw - 16), y + 10, w * (fw - 16), 50); off += w; }); }
  [['输入', C.o], ['动画帧回调', C.p], ['样式 · 布局 · 绘制 · 合成', C.b]].forEach(([s, col], i) => { dot(g, x0 + i * 300 + 10, y + 110, 8, col); txt(g, s, x0 + i * 300 + 30, y + 110, C.fg2, fnt(500, 22)); });
  if (k >= 1 || t > 5) { const u = pop(t, 5.5); g.save(); g.globalAlpha = u; const y2 = y + 220; txt(g, '一个长任务占住主线程', x0, y2 - 50, C.fg, fnt(700, 26));
    for (let i = 0; i < 14; i++) rr(g, x0 + i * fw, y2, fw - 4, 70, 6, 'rgba(14,20,36,.9)', C.line2);
    const L = Math.min(5.2, (t - 5.5) * 3); g.fillStyle = C.r; rr(g, x0 + 2 * fw + 6, y2 + 10, Math.max(0, L) * fw - 12, 50, 6, C.r); txt(g, '同步循环处理 10 万条数据：87 ms', x0 + 2 * fw + 20, y2 + 35, '#fff', fnt(700, 22));
    for (let i = 3; i < 2 + Math.floor(L); i++) { txt(g, '✕', x0 + i * fw + fw / 2, y2 + 100, C.r, fnt(700, 26), 'center'); }
    if (L > 4) txt(g, '这几帧没有画出来 → 画面冻住、点击没反应', x0 + 2 * fw, y2 + 140, C.r, fnt(600, 24)); g.restore(); }
  if (k >= 2) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + R.h - 170, R.w - 40, 130, 14, 'rgba(255,210,122,.08)', C.gold);
    txt(g, '第一条规则：不要让任何一件事在主线程上连续待太久', R.x + 44, R.y + R.h - 125, C.gold, fnt(700, 30)); txt(g, '切短（让出主线程）  ·  搬走（Worker）  ·  少做（虚拟化、跳过看不见的）', R.x + 44, R.y + R.h - 75, C.fg2, fnt(500, 24)); g.restore(); }
};
// 渲染流水线
const STAGES = [['DOM', C.fg2], ['样式', C.b], ['布局', C.p], ['绘制', C.g], ['合成', C.o]];
function pipe(g, t, R, y, lit = () => 1, labels = true) { const w = 220, gap = 50, x0 = R.x + (R.w - (w * 5 + gap * 4)) / 2; const pos = []; STAGES.forEach(([s, col], i) => { const x = x0 + i * (w + gap); const u = lit(i); node(g, x, y, w, 80, s, col, .35 + .65 * u); pos.push(x); if (i) arrow(g, x - gap + 6, y + 40, x - 8, y + 40, C.fg3, 3, 10); }); return { pos, w, y }; }
AN.pipeline = (g, t, R, st) => {
  const k = st.k; const P = pipe(g, t, R, R.y + 120, i => pop(t, .3 + i * .5, .5));
  const labels = ['HTML → 树\nCSS → 规则', '每个元素的\n最终样式', '位置与大小', '文字、颜色、\n边框 → 指令', '图层在 GPU\n上叠起来'];
  P.pos.forEach((x, i) => { const u = pop(t, .5 + i * .5); g.save(); g.globalAlpha = u; labels[i].split('\n').forEach((s, j) => txt(g, s, x + P.w / 2, P.y + 120 + j * 28, C.fg3, fnt(500, 21), 'center')); g.restore(); });
  if (k >= 2) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const bx = R.x + 200, by = R.y + 360; txt(g, '布局的连锁反应', bx, by - 20, C.fg, fnt(700, 26));
    const grow = 80 * SS(Math.sin(st.tk * 1.5) * .5 + .5); const boxes = [[0, 0, 220 + grow, 90, C.p], [240 + grow, 0, 200, 90, C.fg3], [460 + grow, 0, 200, 90, C.fg3], [0, 110, 200, 90, C.fg3], [220, 110, 200, 90, C.fg3]];
    rr(g, bx - 20, by, 920, 330, 14, 'rgba(14,20,36,.6)', C.line2);
    boxes.forEach(([x, y, w, h, col], i) => { rr(g, bx + x, by + 20 + y, w, h, 10, i === 0 ? 'rgba(199,155,255,.25)' : 'rgba(255,255,255,.04)', col, 2); if (i) txt(g, '挪', bx + x + w / 2, by + 20 + y + h / 2, C.fg3, fnt(600, 22), 'center'); else txt(g, '变宽', bx + x + w / 2, by + 20 + y + h / 2, C.fg, fnt(700, 22), 'center'); });
    txt(g, '一个元素变宽 → 兄弟挪位 → 父元素变高 → 父的兄弟挪位 …', bx, by + 290, C.fg2, fnt(500, 22)); g.restore(); }
};
AN.pipeline2 = (g, t, R, st) => {
  const k = st.k; const rows = [['width / top', 1, C.p], ['color / background', 3, C.g], ['transform / opacity', 4, C.o]];
  rows.forEach(([lab, from, col], j) => { const y = R.y + 60 + j * 120, u = pop(t, .3 + j * .9); if (u <= 0) return; g.save(); g.globalAlpha = u; txt(g, '改 ' + lab, R.x + 20, y + 40, C.fg, fnt(700, 26)); const w = 170, gap = 36, x0 = R.x + 420; STAGES.forEach(([s, c2], i) => { const x = x0 + i * (w + gap); const on = i >= from; node(g, x, y, w, 80, s, on ? c2 : C.line2, on ? 1 : .35); if (i) arrow(g, x - gap + 6, y + 40, x - 8, y + 40, on && i > from ? c2 : C.line2, 3, 10); }); txt(g, ['全部重走', '跳过布局', '只合成'][j], x0 + 5 * (w + gap) + 10, y + 40, col, fnt(700, 24)); g.restore(); });
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const y = R.y + 400; txt(g, '同样的位移动画', R.x + 20, y, C.fg, fnt(700, 26));
    const ph = (st.tk * .8) % 2, dx = 300 * SS(ph < 1 ? ph : 2 - ph);
    [['left: 0 → 300px', C.p, '主线程重新布局 · 绘制 · 合成'], ['transform: translateX(300px)', C.o, 'GPU 换个位置贴图']].forEach(([lab, col, note], j) => { const Y = y + 50 + j * 120; rr(g, R.x + 20, Y, 800, 90, 12, 'rgba(14,20,36,.6)', C.line2); rr(g, R.x + 40 + dx, Y + 15, 120, 60, 10, col); txt(g, lab, R.x + 850, Y + 28, C.fg, fnt(600, 22, 'mono')); txt(g, note, R.x + 850, Y + 64, C.fg3, fnt(500, 21)); const ms = j ? '< 1 ms' : '12–40 ms'; txt(g, ms, R.x + 1500, Y + 45, col, fnt(700, 28, 'mono'), 'right'); });
    g.restore(); }
  if (k >= 2) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const y = R.y + R.h - 90; txt(g, '性能面板里的一帧：', R.x + 20, y - 40, C.fg, fnt(700, 24)); const segs = [[.12, C.o, '脚本'], [.08, C.b, '样式'], [.42, C.p, '布局'], [.3, C.g, '绘制'], [.08, C.fg3, '合成']]; let off = 0; segs.forEach(([w, col, s]) => { g.fillStyle = col; g.fillRect(R.x + 20 + off * 1200, y, w * 1200 - 3, 44); txt(g, s, R.x + 20 + (off + w / 2) * 1200, y + 22, '#000', fnt(700, 20), 'center'); off += w; }); txt(g, '紫色长 → 结构问题；绿色长 → 画得太多', R.x + 1240, y + 22, C.fg2, fnt(500, 22)); g.restore(); }
};
AN.tsbar = (g, t, R, st) => {
  title(g, 'TypeScript 7：编译器用 Go 重写', R, '同一项目类型检查耗时（示意，官方称常见项目约 10×）');
  bars(g, R.x + 300, R.y + 160, 700, 420, [['TS 6（JavaScript 实现）', 32, C.fg3], ['TS 7（Go 原生）', 3.2, C.g]], t, { fmt: v => v + ' s', t0: .3 });
  const u = pop(t, 1.6); g.save(); g.globalAlpha = u; [['提交前跑一次', '→', '每次保存都跑'], ['等几十秒', '→', '三秒内'], ['错误在集成时发现', '→', '错误在写的时候发现']].forEach(([a, ar, b], i) => { const y = R.y + 220 + i * 90; txt(g, a, R.x + 1100, y, C.fg3, fnt(500, 24)); txt(g, ar, R.x + 1350, y, C.gold, fnt(700, 28)); txt(g, b, R.x + 1400, y, C.fg, fnt(600, 24)); }); g.restore();
};
// CSS 新特性地图
const CSSF = [['容器查询', '@container (width > 600px)', C.b], ['锚点定位', 'position-anchor / position-try', C.p], ['滚动驱动动画', 'animation-timeline: scroll()', C.g], [':has()', 'label:has(input:invalid)', C.o], ['popover / dialog', '焦点管理 · Esc 关闭 · 顶层', C.r], ['视图过渡', 'document.startViewTransition()', C.gold]];
AN.cssmap = (g, t, R, st) => {
  const k = st.bi; const on = { 0: [], 5: [3], 6: [4, 5], 7: [] }[k] || []; const cw = 520, ch = 170;
  CSSF.forEach(([name, ex, col], i) => { const x = R.x + 40 + (i % 3) * (cw + 40), y = R.y + 60 + Math.floor(i / 3) * (ch + 40); const u = pop(t, i * .15); const hot = on.includes(i); g.save(); g.globalAlpha = u; rr(g, x, y, cw, ch, 16, hot ? 'rgba(255,210,122,.1)' : 'rgba(14,20,36,.9)', hot ? C.gold : col, hot ? 3 : 2); txt(g, name, x + 28, y + 50, C.fg, fnt(700, 30)); txt(g, ex, x + 28, y + 105, hot ? C.gold : C.fg3, fnt(500, 21, 'mono')); g.restore(); });
  const notes = { 0: '原来要 JavaScript 做的布局与行为 → 声明式', 5: '父元素根据子元素状态变样式：表单项整行变红', 6: '焦点、关闭、层级由浏览器处理；两个状态之间自动生成过渡动画', 7: '' };
  if (notes[k]) txt(g, notes[k], R.x + 40, R.y + R.h - 60, C.gold, fnt(600, 26));
};
AN.container = (g, t, R, st) => {
  title(g, '容器查询：组件按所在面板的宽度排版', R);
  const ph = (t * .5) % 2, w = LERP(900, 420, SS(ph < 1 ? ph : 2 - ph)), x = R.x + 60, y = R.y + 140;
  rr(g, x, y, w, 520, 16, 'rgba(14,20,36,.9)', C.b, 2.5); txt(g, `面板宽度 ${Math.round(w)} px`, x + 20, y - 24, C.b, fnt(600, 22, 'mono'));
  const cols = w > 760 ? 3 : w > 560 ? 2 : 1, cw = (w - 40 - (cols - 1) * 20) / cols;
  for (let i = 0; i < 6; i++) { const cx = x + 20 + (i % cols) * (cw + 20), cy = y + 20 + Math.floor(i / cols) * 150; if (cy + 130 > y + 520) continue; rr(g, cx, cy, cw, 130, 12, 'rgba(255,255,255,.05)', C.line2); rr(g, cx + 16, cy + 16, 40, 40, 8, C.b); txt(g, '卡片 ' + (i + 1), cx + 70, cy + 36, C.fg, fnt(600, 22)); g.fillStyle = C.line2; g.fillRect(cx + 16, cy + 76, cw - 32, 8); g.fillRect(cx + 16, cy + 96, (cw - 32) * .6, 8); }
  txt(g, `@container (width > 760px) { 三列 }`, R.x + 1050, R.y + 200, cols === 3 ? C.gold : C.fg3, fnt(600, 24, 'mono')); txt(g, `@container (width > 560px) { 两列 }`, R.x + 1050, R.y + 250, cols === 2 ? C.gold : C.fg3, fnt(600, 24, 'mono')); txt(g, `默认 { 一列 }`, R.x + 1050, R.y + 300, cols === 1 ? C.gold : C.fg3, fnt(600, 24, 'mono'));
  txt(g, '不看窗口宽度，看容器宽度', R.x + 1050, R.y + 400, C.fg, fnt(700, 28)); txt(g, '同一个组件放在侧栏和主区，自己适应', R.x + 1050, R.y + 445, C.fg3, fnt(500, 22));
};
AN.anchor = (g, t, R, st) => {
  title(g, '锚点定位：提示框跟着按钮走，靠边自动翻转', R);
  const vx = R.x + 60, vy = R.y + 120, vw = 1000, vh = 560; rr(g, vx, vy, vw, vh, 12, 'rgba(14,20,36,.9)', C.line2); txt(g, '视口', vx + 16, vy + 24, C.fg3, fnt(500, 20));
  const ph = (t * .35) % 2, u = SS(ph < 1 ? ph : 2 - ph), bx = vx + 120 + u * 700, by = vy + 300 + Math.sin(t * .7) * 120;
  rr(g, bx, by, 160, 54, 12, C.b); txt(g, '按钮（锚点）', bx + 80, by + 27, '#000', fnt(700, 20), 'center');
  const tw = 300, th = 90, flip = bx + 160 + 20 + tw > vx + vw; const tx = flip ? bx - 20 - tw : bx + 180; rr(g, tx, by - 18, tw, th, 12, 'rgba(255,210,122,.15)', C.gold, 2); txt(g, flip ? '放不下 → 翻到左侧' : '提示框在右侧', tx + 16, by + 12, C.fg, fnt(600, 22)); txt(g, flip ? 'position-try: flip-inline' : 'position-area: right', tx + 16, by + 46, C.gold, fnt(500, 19, 'mono'));
  line(g, [[bx + 80, by], [bx + 80, vy + 40]], C.line2, 1, [6, 6]);
  const code = ['.tip {', '  position: absolute;', '  position-anchor: --btn;', '  position-area: right;', '  position-try: flip-inline;', '}']; code.forEach((s, i) => txt(g, s, R.x + 1120, R.y + 180 + i * 40, i === 2 || i === 4 ? C.gold : C.fg2, fnt(500, 23, 'mono')));
  txt(g, '以前：监听 scroll、resize，算坐标，慢一帧会抖', R.x + 1120, R.y + 480, C.fg3, fnt(500, 21)); txt(g, '现在：浏览器在布局阶段算，和滚动同步', R.x + 1120, R.y + 520, C.fg, fnt(600, 22));
};
AN.scrolldrive = (g, t, R, st) => {
  title(g, '滚动驱动动画：时间轴绑在滚动位置上', R);
  const ph = (t * .3) % 2, u = SS(ph < 1 ? ph : 2 - ph), px = R.x + 60, py = R.y + 120, pw = 900, ph2 = 560;
  rr(g, px, py, pw, ph2, 12, 'rgba(14,20,36,.9)', C.line2); g.fillStyle = C.g; g.fillRect(px, py, pw * u, 8); txt(g, '阅读进度', px + pw * u + 10, py + 4, C.g, fnt(600, 18));
  g.save(); g.beginPath(); g.rect(px, py + 12, pw, ph2 - 12); g.clip(); const off = u * 900; for (let i = 0; i < 12; i++) { const y = py + 40 + i * 140 - off; const vis = CL((py + ph2 - 60 - y) / 120); rr(g, px + 40 + (1 - vis) * 60, y, 400, 100, 10, `rgba(92,180,255,${.1 + .5 * vis})`, C.line2); g.fillStyle = C.line2; g.fillRect(px + 470, y + 20, 380, 10); g.fillRect(px + 470, y + 44, 300, 10); g.fillRect(px + 470, y + 68, 340, 10); } g.restore();
  g.fillStyle = C.line2; g.fillRect(px + pw - 14, py + 20, 8, ph2 - 40); g.fillStyle = C.fg2; g.fillRect(px + pw - 14, py + 20 + (ph2 - 160) * u, 8, 120);
  ['.bar {', '  animation: grow linear;', '  animation-timeline: scroll();', '}', '', '.card {', '  animation: reveal linear both;', '  animation-timeline: view();', '  animation-range: entry 0% entry 60%;', '}'].forEach((s, i) => txt(g, s, R.x + 1050, R.y + 160 + i * 38, /timeline|range/.test(s) ? C.gold : C.fg2, fnt(500, 22, 'mono')));
  txt(g, '不经过主线程，合成器直接驱动', R.x + 1050, R.y + 600, C.fg, fnt(600, 24));
};
AN.baseline = (g, t, R, st) => {
  title(g, 'Baseline：一个特性在三大引擎都支持了多久', R);
  const x0 = R.x + 300, x1 = R.x + R.w - 80, y0 = R.y + 160, years = [2022, 2023, 2024, 2025, 2026]; const X = y => x0 + (y - 2022) / 4.9 * (x1 - x0);
  years.forEach(y => { line(g, [[X(y), y0], [X(y), y0 + 460]], C.line, 1); txt(g, y, X(y), y0 - 20, C.fg3, fnt(500, 20, 'mono'), 'center'); });
  const rows = [['容器查询', 2023.1, C.b], [':has()', 2023.9, C.o], ['popover', 2024.3, C.r], ['滚动驱动动画', 2025.6, C.g], ['锚点定位', 2026.5, C.p], ['视图过渡（跨文档）', 2026.7, C.gold]];
  rows.forEach(([n, y, col], i) => { const u = pop(t, .3 + i * .25); if (u <= 0) return; const Y = y0 + 40 + i * 70; g.save(); g.globalAlpha = u; txt(g, n, x0 - 20, Y, C.fg, fnt(600, 22), 'right'); const wide = y + 2.5 <= 2026.85; rr(g, X(y), Y - 14, Math.max(8, X(Math.min(2026.85, y + 2.5)) - X(y)), 28, 8, wide ? C.g : col); txt(g, wide ? '广泛可用' : '新可用', X(Math.min(2026.85, y + 2.5)) + 12, Y, wide ? C.g : col, fnt(600, 20)); g.restore(); });
  txt(g, '新可用：三大引擎都已支持 ｜ 广泛可用：再过 30 个月（示意时间，非精确）', x0, y0 + 520, C.fg3, fnt(500, 21));
};
// 三种反应式模型
function tree(g, x, y, hot, col, t, label) { // 15 节点的树，hot: 高亮节点集合
  const pos = [[0, 0]]; for (let i = 1; i < 15; i++) pos.push([((i - 1) % 2 ? 1 : -1) * 0, 0]);
  const lv = [[0], [1, 2], [3, 4, 5, 6], [7, 8, 9, 10, 11, 12, 13, 14]]; const P = {};
  lv.forEach((row, d) => row.forEach((n, j) => { P[n] = [x + (j + .5) * 420 / row.length, y + d * 95]; }));
  for (let i = 1; i < 15; i++) { const p = Math.floor((i - 1) / 2); line(g, [P[p], P[i]], C.line2, 2); }
  Object.entries(P).forEach(([n, [X, Y]]) => { const h = hot.includes(+n); dot(g, X, Y, h ? 15 : 11, h ? col : C.panel2); if (!h) { g.strokeStyle = C.line2; g.lineWidth = 2; g.beginPath(); g.arc(X, Y, 11, 0, 7); g.stroke(); } });
  txt(g, label, x + 210, y - 50, C.fg, fnt(700, 26), 'center');
  return P;
}
AN.reactive = (g, t, R, st) => {
  const k = st.bi, cols = [['虚拟 DOM 比对', 'React', C.b], ['编译期分析', 'Svelte · Solid', C.g], ['信号 Signals', 'Vue · Angular · Preact', C.p]];
  const pulse = (t % 2.4) / 2.4; const hitA = [1, 3, 4, 7, 8, 9, 10], hitB = [8];
  cols.forEach(([name, fw, col], i) => { const x = R.x + 60 + i * 560, y = R.y + 120; const dim = (k === 1 || k === 2) ? i !== 0 : k === 3 ? i !== 1 : k === 4 ? i !== 2 : false; g.save(); g.globalAlpha = dim ? .3 : 1;
    const hot = pulse > .3 ? (i === 0 ? hitA : hitB) : []; tree(g, x, y + 40, hot, col, t, name); txt(g, fw, x + 210, y + 400, C.fg3, fnt(500, 22), 'center');
    const desc = [['状态变 → 重新执行子树', '生成新树 → 比对 → 应用差异'], ['编译时已知变量 → DOM', '直接改那一处'], ['读过的人被记录', '变化只通知订阅者']][i]; desc.forEach((s, j) => txt(g, s, x + 210, y + 450 + j * 32, j ? C.fg3 : C.fg2, fnt(500, 21), 'center')); g.restore(); });
  dot(g, R.x + 60 + 210 - 105, R.y + 160 + 40 + 95 * 1 - 60, 0, C.fg);
  txt(g, '● 这次状态变化真正影响的只有一个叶子节点', R.x + 60, R.y + R.h - 110, C.fg2, fnt(500, 22));
  const notes = { 1: '界面是状态的函数：不用关心什么变了', 2: '代价：父组件更新，子组件默认全部重新执行 → 手动 memo', 3: '没有比对，也没有重新执行', 4: '正在成为 TC39 的语言提案', 5: '左：整棵子树重新执行再比对 ｜ 中、右：只碰真正依赖的节点' };
  if (notes[k]) txt(g, notes[k], R.x + 60, R.y + R.h - 60, C.gold, fnt(600, 26));
};
AN.compiler = (g, t, R, st) => {
  title(g, 'React Compiler：自动插入缓存', R);
  const L = ['function List({ items, filter }) {', '  const shown = items.filter(filter)', '  return shown.map(i => <Row key={i.id} item={i} />)', '}'];
  const Rr = ['function List({ items, filter }) {', '  const $ = useMemoCache(2)', '  let shown', '  if ($[0] !== items || $[1] !== filter) {', '    shown = items.filter(filter); $[0] = items …', '  } else shown = $[2]', '  …', '}'];
  rr(g, R.x + 20, R.y + 90, 620, 360, 14, '#0B1020', C.line2); txt(g, '你写的', R.x + 40, R.y + 115, C.fg3, fnt(600, 18, 'mono')); L.forEach((s, i) => txt(g, s, R.x + 40, R.y + 160 + i * 40, C.fg2, fnt(500, 19, 'mono')));
  const u = pop(t, .8); g.save(); g.globalAlpha = u; arrow(g, R.x + 650, R.y + 270, R.x + 700, R.y + 270, C.gold, 4, 14); rr(g, R.x + 710, R.y + 90, R.w - 730, 360, 14, '#0B1020', C.gold); txt(g, '编译器输出（示意）', R.x + 730, R.y + 115, C.gold, fnt(600, 18, 'mono')); Rr.forEach((s, i) => txt(g, s, R.x + 730, R.y + 160 + i * 36, /\$/.test(s) ? C.gold : C.fg2, fnt(500, 19, 'mono'))); g.restore();
  if (st.k >= 0) { const u2 = pop(t, 2); g.save(); g.globalAlpha = u2; txt(g, '变换速度（相对 Babel 插件，示意）', R.x + 20, R.y + 500, C.fg, fnt(700, 24)); bars(g, R.x + 60, R.y + 540, 900, 180, [['Babel 插件（TS 实现）', 1, C.fg3], ['Rust 移植 · Babel 路径', 3, C.b], ['Rust · Oxc 路径', 13, C.g]], t - 2, { fmt: v => v + '×' }); g.restore(); }
  if (st.k >= 1) { const u3 = pop(st.tk, .3); g.save(); g.globalAlpha = u3; txt(g, '选框架的维度：模型 · 生态 · 团队 · 招聘', R.x + 1050, R.y + 560, C.fg, fnt(700, 26)); txt(g, 'React：模型不是最优，生态最大 → 仍是默认', R.x + 1050, R.y + 610, C.fg3, fnt(500, 22)); g.restore(); }
};
AN.state4 = (g, t, R, st) => {
  const k = st.k, Q = [['本地状态', '输入框内容 · 面板展开', '留在组件里，不要往上提', C.b], ['服务端状态', '接口返回的快照', '缓存 · 过期 · 重新请求', C.g], ['URL 状态', '当前页 · 筛选 · 选中对象', '能复制、能刷新、能后退', C.o], ['持久状态', '偏好 · 面板布局 · 最近文件', '本地存储，关掉再开还在', C.p]];
  const cw = 760, ch = 330; Q.forEach(([n, ex, rule, col], i) => { const x = R.x + 60 + (i % 2) * (cw + 60), y = R.y + 60 + Math.floor(i / 2) * (ch + 50); const on = k === 0 || k === i + 1 || k > 4; const u = pop(t, .2 + i * .2); g.save(); g.globalAlpha = u * (on ? 1 : .35); rr(g, x, y, cw, ch, 18, on && k ? 'rgba(255,255,255,.04)' : 'rgba(14,20,36,.9)', on && k ? col : C.line2, on && k ? 3 : 2); txt(g, n, x + 32, y + 60, col, fnt(700, 36)); txt(g, ex, x + 32, y + 130, C.fg, fnt(500, 25)); txt(g, rule, x + 32, y + 200, C.fg2, fnt(600, 24)); g.restore(); });
  if (k === 0) txt(g, '混乱的根源：把四种来源塞进一个仓库', R.x + 60, R.y + R.h - 20, C.gold, fnt(600, 26));
};
AN.query = (g, t, R, st) => {
  const k = st.k; title(g, '服务端状态的通用问题', R);
  const y = R.y + 120; ['组件 A', '组件 B'].forEach((n, i) => node(g, R.x + 60, y + i * 110, 200, 70, n, C.fg3)); node(g, R.x + 520, y + 50, 260, 80, '查询缓存', C.g, 1, 'key: /api/orders'); node(g, R.x + 1050, y + 50, 240, 80, '服务器', C.fg2);
  const ph = (t * .6) % 1; [0, 1].forEach(i => { arrow(g, R.x + 270, y + 35 + i * 110, R.x + 510, y + 85, C.fg3, 2); dot(g, LERP(R.x + 270, R.x + 510, ph), LERP(y + 35 + i * 110, y + 85, ph), 6, C.b); });
  arrow(g, R.x + 790, y + 90, R.x + 1040, y + 90, C.g, 3); dot(g, LERP(R.x + 790, R.x + 1040, (ph + .3) % 1), y + 90, 7, C.g); txt(g, '只发一次', R.x + 915, y + 60, C.g, fnt(600, 20), 'center');
  const items = [['去重', '同一时刻的相同请求合并成一个'], ['失效', '数据改了 → 相关缓存标记过期 → 重新拉'], ['乐观更新', '先按成功显示，失败再回滚'], ['后台刷新', '先给缓存，再悄悄更新']];
  items.forEach(([n, d], i) => { const u = pop(t, 1 + i * .5); if (u <= 0) return; const Y = R.y + 360 + i * 80; g.save(); g.globalAlpha = u; tag(g, n, R.x + 60, Y, C.g); txt(g, d, R.x + 240, Y, C.fg2, fnt(500, 24)); g.restore(); });
  if (k >= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 1000, R.y + 340, 620, 300, 16, 'rgba(14,20,36,.9)', C.gold); txt(g, '真正需要全局共享的客户端状态', R.x + 1030, R.y + 390, C.fg, fnt(700, 26)); ['当前用户', '主题', '通知', '…很少'].forEach((s, i) => txt(g, '· ' + s, R.x + 1030, R.y + 440 + i * 42, C.fg2, fnt(500, 24))); txt(g, '一个小状态库就够', R.x + 1030, R.y + 610, C.gold, fnt(600, 24)); g.restore(); }
};
AN.ssr = (g, t, R, st) => {
  const k = st.k; const rows = [['客户端渲染 CSR', [[.2, C.fg3, 'HTML'], [.3, C.b, '下载脚本'], [.2, C.p, '执行'], [.2, C.o, '请求数据'], [.1, C.g, '渲染']]], ['服务端渲染 SSR', [[.35, C.fg3, '服务器算好 HTML'], [.15, C.g, '显示'], [.3, C.b, '下载脚本'], [.2, C.p, '激活']]], ['服务端组件 RSC', [[.3, C.fg3, '服务器运行组件'], [.2, C.g, '流式显示'], [.15, C.b, '少量脚本']]]];
  const x0 = R.x + 320, W = 1200; rows.forEach(([n, segs], j) => { const y = R.y + 90 + j * 120, u = pop(t, .3 + j * .5); if (u <= 0) return; g.save(); g.globalAlpha = u; txt(g, n, x0 - 20, y + 28, C.fg, fnt(700, 24), 'right'); let off = 0; segs.forEach(([w, col, s]) => { g.fillStyle = col; g.fillRect(x0 + off * W, y, w * W - 3, 56); txt(g, s, x0 + (off + w / 2) * W, y + 28, '#000', fnt(600, 19), 'center'); off += w; }); g.restore(); });
  txt(g, '时间 →', x0, R.y + 60, C.fg3, fnt(500, 20));
  if (k >= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 40, R.y + 470, 780, 240, 16, 'rgba(14,20,36,.9)', C.b); txt(g, '内容网站', R.x + 70, R.y + 515, C.b, fnt(700, 26)); txt(g, '关心首屏：SSR / SSG / 流式', R.x + 70, R.y + 560, C.fg2, fnt(500, 23)); txt(g, '用户几秒钟就走', R.x + 70, R.y + 600, C.fg3, fnt(500, 21));
    rr(g, R.x + 860, R.y + 470, 780, 240, 16, 'rgba(255,210,122,.08)', C.gold); txt(g, '桌面级应用', R.x + 890, R.y + 515, C.gold, fnt(700, 26)); txt(g, '关心每一次操作的响应：CSR + 骨架屏就够', R.x + 890, R.y + 560, C.fg, fnt(500, 23)); txt(g, '用户登录后待几个小时，复杂度留给交互', R.x + 890, R.y + 600, C.fg3, fnt(500, 21)); g.restore(); }
  if (k >= 3) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 40, R.y + 730, 1600, 70, 14, 'rgba(255,107,107,.1)', C.bad); txt(g, 'React2Shell：服务端组件的反序列化缺陷 → 未认证远程执行代码。新能力 = 新边界', R.x + 70, R.y + 765, C.fg, fnt(600, 24)); g.restore(); }
};
AN.toolchain = (g, t, R, st) => {
  const k = st.k; const old = [['Babel', '转换'], ['ESLint', '检查'], ['Prettier', '格式'], ['Rollup', '打包'], ['webpack', '打包'], ['esbuild', '开发']], nw = [['Oxc', '转换 · 检查 · 格式'], ['Rolldown', '开发 + 生产打包'], ['Vite 8', '统一入口']];
  txt(g, 'JavaScript 写的工具', R.x + 60, R.y + 50, C.fg3, fnt(700, 24)); old.forEach(([n, d], i) => { const u = pop(t, .2 + i * .12); node(g, R.x + 60 + (i % 3) * 230, R.y + 90 + Math.floor(i / 3) * 110, 200, 84, n, C.fg3, u * (k >= 1 ? .5 : 1), d); });
  if (k >= 1) { const u = pop(st.tk, .2); arrow(g, R.x + 780, R.y + 200, R.x + 880, R.y + 200, C.gold, 4, 14, u); txt(g, 'Rust 重写', R.x + 830, R.y + 165, C.gold, fnt(600, 20), 'center'); g.save(); g.globalAlpha = u; txt(g, 'Rust 写的工具', R.x + 920, R.y + 50, C.gold, fnt(700, 24)); g.restore(); nw.forEach(([n, d], i) => node(g, R.x + 920 + i * 250, R.y + 150, 230, 100, n, C.gold, pop(st.tk, .3 + i * .2), d)); }
  if (k >= 2) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; txt(g, '构建一次（示意）', R.x + 60, R.y + 360, C.fg, fnt(700, 24)); bars(g, R.x + 100, R.y + 400, 760, 220, [['Rollup', 30, C.fg3], ['Rolldown', 1.5, C.g]], st.tk, { fmt: v => v + ' s' }); txt(g, 'React Compiler 变换', R.x + 960, R.y + 360, C.fg, fnt(700, 24)); bars(g, R.x + 1000, R.y + 400, 600, 220, [['Babel', 14, C.fg3], ['Oxc', 1, C.g]], st.tk, { fmt: v => v + '×' }); g.restore(); }
  if (k >= 3) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 40, R.y + 700, 1600, 90, 14, 'rgba(255,210,122,.08)', C.gold); txt(g, k >= 4 ? 'Vitest 5：与 Vite 共用配置 · 浏览器模式跑组件测试 · 覆盖率引擎重写 —— 从写到测一条链' : '一秒内完成 → 每次保存自动跑 → 错误在写的时候被抓住 → 反馈回路缩短', R.x + 70, R.y + 745, C.fg, fnt(600, 24)); g.restore(); }
};
AN.supply = (g, t, R, st) => {
  const k = st.k; const cx = R.x + 500, cy = R.y + 110; txt(g, '你的应用', cx, cy - 40, C.fg, fnt(700, 24), 'center'); dot(g, cx, cy, 16, C.fg);
  let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647; const nodes = []; for (let d = 1; d <= 4; d++) { const n = [6, 14, 26, 40][d - 1]; for (let i = 0; i < n; i++) nodes.push([cx - 440 + (i + .5) / n * 880, cy + d * 140 + rnd() * 40 - 20, d]); }
  nodes.forEach(([x, y, d], i) => { const u = pop(t, .2 + d * .3); if (u <= 0) return; const par = d === 1 ? [cx, cy] : nodes[Math.floor(i * .4)] || [cx, cy]; g.save(); g.globalAlpha = u * .7; line(g, [[par[0], par[1]], [x, y]], C.line2, 1); g.restore(); });
  const bad = k >= 1 ? CL((st.tk - .5) / 2) : 0;
  nodes.forEach(([x, y, d], i) => { const u = pop(t, .2 + d * .3); if (u <= 0) return; const isBad = k >= 1 && (i % 7 === 3) && bad > (i % 40) / 40; g.save(); g.globalAlpha = u; dot(g, x, y, isBad ? 9 : 5, isBad ? C.bad : C.fg3); g.restore(); });
  txt(g, '依赖树：一两千个包，绝大多数不是你写的', R.x + 40, R.y + R.h - 30, C.fg2, fnt(500, 22));
  if (k >= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 1020, R.y + 60, 620, 200, 16, 'rgba(255,107,107,.1)', C.bad); txt(g, '2026-05 · TanStack', R.x + 1050, R.y + 105, C.bad, fnt(700, 26)); txt(g, '42 个包 · 84 个恶意版本 · 6 分钟', R.x + 1050, R.y + 150, C.fg, fnt(600, 23)); txt(g, 'CI 缓存投毒 → 拿到自动发布的临时令牌', R.x + 1050, R.y + 195, C.fg3, fnt(500, 21)); g.restore(); }
  if (k >= 2) { const L = [['锁文件', '每次装的是同一个版本'], ['来源证明', '包 ↔ 构建它的提交'], ['最小权限 CI', '发布要人工确认'], ['安装时审计', '扫描已知问题'], ['延迟升级', '新版本放几天再用']]; L.forEach(([n, d], i) => { if (k < 3 && i === 4) return; const u = pop(st.tk, .3 + i * .4); if (u <= 0) return; const y = R.y + 300 + i * 92; g.save(); g.globalAlpha = u; rr(g, R.x + 1020, y, 620, 76, 14, 'rgba(14,20,36,.9)', C.ok); txt(g, n, R.x + 1050, y + 26, C.ok, fnt(700, 24)); txt(g, d, R.x + 1050, y + 56, C.fg3, fnt(500, 20)); g.restore(); }); }
};
