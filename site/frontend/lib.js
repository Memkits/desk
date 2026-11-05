// 《现代前端》专题：通用场景。每个 beat 的画面（anim:名 / code:名）；相邻 beat 同一动画连成一段，动画函数拿到段内时间与所在 beat 序号。
window.SCENES = {}; window.AN = {}; window.CODE = {};
const SS = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const CL = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), LERP = (a, b, u) => a + (b - a) * u;
const C = { r: '#FF7A93', b: '#5CB4FF', g: '#5FE0A0', p: '#C79BFF', o: '#FFB25C', gold: '#FFD27A', ok: '#5FD39A', bad: '#FF6B6B', fg: '#E9EEF7', fg2: '#A3AEC3', fg3: '#66728C', line: '#1F2940', line2: '#2C3854', panel: '#0E1424', panel2: '#131B2E' };
const F = { sans: '"Noto Sans CJK SC",sans-serif', mono: '"DejaVu Sans Mono",monospace', serif: '"Noto Serif CJK SC",serif' };
const fnt = (w, s, f = 'sans') => `${w} ${s}px ${F[f]}`;

// ---------- 细节卡（金色）：按 beat 键 ----------
const DET = {
  a_loop_3: ['一帧的预算', '60 Hz → 16.7 ms', '120 Hz → 8.3 ms', '长任务：> 50 ms'],
  a_pipe_3: ['触发的流水线阶段', 'width / top / font-size → 布局 + 绘制 + 合成', 'color / background → 绘制 + 合成', 'transform / opacity → 仅合成'],
  a_ts_4: ['TypeScript 7（Go 原生编译器）', '2026-04-21 发布 Beta', '官方：常见项目约 10× 于 TS 6.0', '安装：@typescript/native-preview，命令 tsgo'],
  a_css_6: ['Interop 2026 重点（节选）', '锚点定位 · 容器样式查询', '对话框与弹层 · 滚动驱动动画', '视图过渡 · attr() · contrast-color()'],
  a_css_7: ['Baseline', '新可用：三大引擎都已支持', '广泛可用：都支持满 30 个月'],
  a_react_6: ['React Compiler', '2026-03 Rust 移植 PR #36173，6 月合入', 'Babel 插件路径约 3×，原始变换约 10×', 'Vite 8 经 Oxc 接入：约 12–15× 于 Babel'],
  a_render_3: ['React2Shell · CVE-2025-55182', '2025-12 披露，CVSS 10.0', '服务端组件反序列化 → 未认证 RCE', '2026-05：Next.js 协调安全发布'],
  a_tool_2: ['Vite 8 / Rolldown 1.0', 'Rolldown 同时替代 esbuild（开发）与 Rollup（生产）', '官方发布说明：构建最快 10–30×', 'Rolldown 1.0：打包器 API 稳定'],
  a_tool_4: ['Vitest 5（2026-08 RC）', '周下载量过亿', '覆盖率引擎：fork 并重写 IstanbulJS'],
  a_supply_1: ['TanStack npm 事件', '2026-05-11', '42 个 @tanstack/* 包，84 个恶意版本', '约 6 分钟内发布 · CI 缓存投毒 + OIDC 令牌'],
  b_measure_1: ['Core Web Vitals 阈值（p75）', 'LCP ≤ 2.5 s', 'CLS ≤ 0.1', 'INP ≤ 200 ms'],
  b_measure_5: ['Long Animation Frames API', '报告每个 > 50 ms 的帧', '含脚本来源、函数名、阻塞时长'],
  b_load_5: ['Speculation Rules', '<script type="speculationrules">', 'prerender / prefetch 下一页', '真实用户数据：启用站点 INP 分布更好'],
  b_bundle_4: ['属性名压缩（Rolldown）', '对象属性也参与缩短', '前提：不用字符串动态访问属性'],
  b_list_4: ['十万行表格（示意量级）', '全部渲染：首屏 10+ s，滚动掉帧', '虚拟化：首屏几十 ms，60 fps', 'Canvas 直绘：首屏几十 ms，需自做选择/无障碍'],
  b_interact_1: ['scheduler.yield()', 'await scheduler.yield()', '让出后继续排在队列前部', 'Chrome 129+ 可用'],
  b_graphics_3: ['Pretext（2026-03-27）', 'Cheng Lou · 零依赖 TypeScript', 'canvas.measureText + 字宽缓存', '不触发 DOM 回流'],
  c_thread_1: ['三种传递方式', 'postMessage：结构化克隆（拷贝）', 'Transferable：转移所有权（零拷贝）', 'SharedArrayBuffer：共享内存，需跨域隔离'],
  c_storage_1: ['OPFS + SQLite', 'OPFS：源私有文件系统，Worker 内同步读写', 'SQLite Wasm：官方发行版，VFS 落在 OPFS 上'],
  c_shell_2: ['典型量级（示意）', 'Electron 安装包 ≈ 150–250 MB', 'Tauri 安装包 ≈ 3–10 MB', 'PWA：无额外体积'],
  c_shell_4: ['Electron 安全清单', 'contextIsolation: true', 'nodeIntegration: false', 'preload 只暴露白名单方法 · 设置 CSP'],
  c_eng_2: ['测试分层', '单元：Vitest（领域层）', '组件：Vitest Browser Mode', '端到端：Playwright'],
  c_ai_0: ['理解债（comprehension debt）', 'Addy Osmani 提出', 'GitClear：重复代码比例上升'],
  c_ai_3: ['Vite+（vp）', 'vp run 支持 Codex CLI / Claude Code 沙盒', 'vp toolchain · vp hooks · vp migrate'],
};

// ---------- 代码卡 ----------
function hl(src) {
  const cm = []; src = src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/(\/\/.*|\/\*.*?\*\/)/g, m => { cm.push(m); return `\u0001${'x'.repeat(cm.length)}\u0002`; });
  src = src.replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="s">$1</span>')
    .replace(/\b(const|let|type|interface|function|return|await|async|import|from|export|new|if|else|for|of|as|extends|keyof|typeof|in)\b/g, '<span class="k">$1</span>')
    .replace(/\b(string|number|boolean|Promise|void|never|unknown|Worker|Map)\b/g, '<span class="t">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="n">$1</span>');
  return src.replace(/\u0001(x+)\u0002/g, (_, i) => `<span class="c">${cm[i.length - 1]}</span>`);
}
CODE.ts1 = { fn: 'order.ts', src: `interface Order {
  id: string
  status: 'draft' | 'paid' | 'shipped'   // 字面量联合：只能是这三个
  items: { sku: string; qty: number }[]
}

function total(o: Order): number {
  return o.items.reduce((s, it) => s + it.qty, 0)
}

total({ id: 'a1', status: 'pending', items: [] })
// ✗ 类型 "pending" 不能赋给 'draft' | 'paid' | 'shipped'`, note: '类型只在编辑和构建时存在：运行的仍是去掉类型后的 JavaScript。' };
CODE.ts2 = { fn: 'api.ts', src: `type Result<T> = { ok: true; value: T } | { ok: false; error: string }

async function get<T>(url: string): Promise<Result<T>> { /* … */ }

const r = await get<Order[]>('/api/orders')
if (r.ok) r.value[0].items        // 这里 r.value 是 Order[]
else     r.error                  // 这里只有 error

// 原则：类型描述数据的形状，不要用类型做计算`, note: '联合类型 + 收窄：每个分支里编译器知道你手上是什么。' };
CODE.comlink = { fn: 'search.worker.ts  ·  main.ts', src: `// —— Worker 里 ——
import { expose } from 'comlink'
const index = new Map<string, number[]>()
expose({
  build(docs: string[]) { /* 建倒排索引，几百毫秒 */ },
  query(q: string): number[] { return index.get(q) ?? [] },
})

// —— 主线程里 ——
import { wrap } from 'comlink'
const search = wrap<Search>(new Worker('./search.worker.ts'))
await search.build(docs)            // 像本地函数，实际跨线程
const hits = await search.query('invoice')`, note: '消息传递被包装成 await 调用；主线程在等待期间照常画画面。' };

// ---------- 画布工具 ----------
function txt(g, s, x, y, col = C.fg2, font = fnt(600, 26), al = 'left', bl = 'middle') { g.fillStyle = col; g.font = font; g.textAlign = al; g.textBaseline = bl; g.fillText(s, x, y); }
function rr(g, x, y, w, h, r, fill, stroke, lw = 2) { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
function node(g, x, y, w, h, label, col = C.b, a = 1, sub = '') { if (a <= 0) return; g.save(); g.globalAlpha = a; rr(g, x, y, w, h, 14, 'rgba(14,20,36,.92)', col, 2.5); txt(g, label, x + w / 2, y + h / 2 - (sub ? 12 : 0), C.fg, fnt(700, sub ? 26 : 27), 'center'); if (sub) txt(g, sub, x + w / 2, y + h / 2 + 20, C.fg3, fnt(500, 19), 'center'); g.restore(); }
function arrow(g, x0, y0, x1, y1, col = C.fg3, lw = 3, head = 12, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.strokeStyle = col; g.fillStyle = col; g.lineWidth = lw; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); const an = Math.atan2(y1 - y0, x1 - x0); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - head * Math.cos(an - .45), y1 - head * Math.sin(an - .45)); g.lineTo(x1 - head * Math.cos(an + .45), y1 - head * Math.sin(an + .45)); g.fill(); g.restore(); }
function line(g, pts, col = C.fg3, lw = 2, dash = null) { g.save(); g.strokeStyle = col; g.lineWidth = lw; if (dash) g.setLineDash(dash); g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); g.restore(); }
function dot(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
function pop(t, t0, d = .5) { return SS((t - t0) / d); }
function bars(g, x, y, w, h, items, t, opts = {}) { // items: [label, value, col]
  const max = opts.max || Math.max(...items.map(i => i[1])); const bw = w / items.length;
  items.forEach(([lab, v, col, sub], i) => { const u = pop(t, (opts.t0 || 0) + i * (opts.gap ?? .25), .6); const bh = h * v / max * u; const X = x + i * bw + bw * .18; g.fillStyle = col || C.b; rr(g, X, y + h - bh, bw * .64, bh, 8, col || C.b); txt(g, lab, X + bw * .32, y + h + 26, C.fg2, fnt(600, 22), 'center'); if (u > .9) txt(g, opts.fmt ? opts.fmt(v) : v, X + bw * .32, y + h - bh - 20, C.fg, fnt(700, 24, 'mono'), 'center'); if (sub) txt(g, sub, X + bw * .32, y + h + 54, C.fg3, fnt(500, 18), 'center'); });
}
function title(g, s, R, sub) { txt(g, s, R.x + 20, R.y + 26, C.fg, fnt(700, 30)); if (sub) txt(g, sub, R.x + 20, R.y + 66, C.fg3, fnt(500, 22)); }
function tag(g, s, x, y, col = C.b, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = fnt(600, 20); const w = g.measureText(s).width + 28; rr(g, x, y - 18, w, 36, 18, 'rgba(255,255,255,.06)', col, 1.5); txt(g, s, x + w / 2, y, col, fnt(600, 20), 'center'); g.restore(); return w; }

// ---------- 场景组装 ----------
function codeLayer(c, lay, name, det) {
  const d = CODE[name]; const w = det ? 1300 : 1600;
  c.el(`<div class="codecard" style="width:${w}px"><div class="fn"><i></i><i></i><i></i>${d.fn}</div><pre>${hl(d.src)}</pre>${d.note ? `<div class="note">${d.note}</div>` : ''}</div>`, lay);
  return {};
}
function animLayer(c, lay, name, det) {
  const cv = c.el(`<canvas class="an" width="1920" height="1080"></canvas>`, lay), g = cv.getContext('2d');
  const R = det ? { x: 100, y: 140, w: 1300, h: 820 } : { x: 100, y: 140, w: 1720, h: 820 };
  return { draw: (lt, st) => { g.clearRect(0, 0, 1920, 1080); (AN[name] || AN._missing)(g, lt, R, st); } };
}
AN._missing = (g, t, R) => txt(g, '（画面待做）', R.x + R.w / 2, R.y + R.h / 2, C.fg3, fnt(600, 40), 'center');

function build(c) {
  const sc = c.sc, n = sc.beats.length, segs = [];
  sc.beats.forEach((b, i) => {
    const st = i === 0 ? 0 : b.s - .35, en = i < n - 1 ? sc.beats[i + 1].s - .35 : sc.T;
    const v = b.vis[0], last = segs[segs.length - 1];
    if (last && last.v === v) { last.b = en; last.beats.push({ i, s: b.s }); return; }
    segs.push({ v, a: st, b: en, key: b.key, bi: i, beats: [{ i, s: b.s }] });
  });
  const detOf = i => DET[sc.beats[i].key] || null;
  segs.forEach(s => { s.lay = c.el(`<div class="lay"></div>`); const [kind, name] = s.v.split(':'); const det = s.beats.some(b => detOf(b.i)); s.obj = kind === 'code' ? codeLayer(c, s.lay, name, det) : animLayer(c, s.lay, name, det); });
  const dets = [];
  sc.beats.forEach((b, i) => { const d = detOf(i); if (!d) return; const e = i < n - 1 ? sc.beats[i + 1].s - .3 : sc.T - .3;
    const el = c.el(`<div class="det" style="left:1440px;top:200px"><span class="h">${d[0]}</span>${d.slice(1).map(x => `<span class="ln">${x}</span>`).join('')}</div>`); el.style.opacity = 0; dets.push({ el, a: b.s + .4, e }); });
  let ttl = null;
  if (!sc.chapter) { const [k, rest] = sc.title.split('：'); const subs = { 1: '运行时 · 渲染 · 语言 · 框架 · 工具链', 2: '度量 · 加载 · 包体 · 渲染 · 交互 · 内存', 3: '分层 · 面板 · 键盘 · Worker · 本地数据 · 客户端' }; ttl = c.el(`<div class="ttl"><div class="k">${k}</div><h1>${rest}</h1><div class="s">${subs[sc.ep]}</div></div>`); }
  c.tick(t => {
    segs.forEach((s, i) => {
      const nx = segs[i + 1], fi = i === 0 ? 1 : SS((t - s.a) / .6), fo = nx ? 1 - SS((t - nx.a) / .6) : 1;
      const op = t < s.a ? 0 : Math.min(fi, fo);
      if (op <= 0) { if (s.lay.style.display !== 'none') s.lay.style.display = 'none'; return; }
      s.lay.style.display = 'block'; s.lay.style.opacity = op;
      if (s.obj.draw) { let k = 0; for (let j = 1; j < s.beats.length; j++) if (t >= s.beats[j].s) k = j; s.obj.draw(t - s.a, { k, tk: t - (k ? s.beats[k].s : s.a), n: s.beats.length, bi: s.beats[k].i }); }
    });
    dets.forEach(({ el, a, e }) => { const u = SS((t - a) / .5); el.style.opacity = Math.min(u, SS((e - t) / .4)); el.style.transform = `translateY(${(1 - u) * 14}px)`; });
    if (ttl) ttl.style.opacity = t < 4.5 ? 1 : 1 - SS((t - 4.5) / .8);
  });
}
TL.scenes.forEach(s => SCENES[s.id] = { build });
