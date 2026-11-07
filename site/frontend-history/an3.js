// 下集动画：钟摆、新平台与 AI 浪潮
AN.pendulum = (g, t, R, st) => {
  const cx = R.x + R.w / 2, py = R.y + 110, L = 480;
  const pos = [['服务端模板', 'PHP · JSP · ASP · Rails', -1, C.o], ['客户端 SPA', 'Backbone → React · Vue', 1, C.b], ['混合', 'SSR · 岛屿 · 服务端组件', 0, C.g]];
  const late = st.bi >= 4, a = !late ? Math.sin(t * 1.1) * .55 : .55 * Math.cos(Math.min(t, 6) * 1.2) * Math.exp(-t * .45);
  const off = Math.min(560, R.w / 2 - 200); pos.forEach(([n, d, s, col], i) => { const x = cx + s * off, y = s ? py + 330 : py + 540; g.save(); g.globalAlpha = pop(t, .3 + i * .4) * (i === 2 && !late ? .35 : 1); rr(g, x - 190, y - 10, 380, 110, 16, 'rgba(14,20,36,.92)', col, 2.5); txt(g, n, x, y + 30, col, fnt(800, 28), 'center'); txt(g, d, x, y + 72, C.fg2, fnt(600, 19), 'center'); g.restore(); });
  const bx = cx + Math.sin(a) * L, by = py + Math.cos(a) * L; line(g, [[cx, py], [bx, by]], C.fg2, 3); dot(g, cx, py, 8, C.fg2); dot(g, bx, by, 30, C.gold);
  if (!late) { g.save(); g.globalAlpha = pop(t, 3); ['首屏白屏', '搜索引擎只看到空壳'].forEach((s, i) => chip(g, s, R.x + 20, R.y + 100 + i * 60, C.bad, 1, 22)); g.restore(); }
  else { const u = pop(t, 1); g.save(); g.globalAlpha = u; ['htmx', 'Hotwire / Turbo', 'Phoenix LiveView', 'Livewire'].forEach((s, i) => chip(g, s, R.x + 20, R.y + 100 + i * 60, C.o, 1, 22)); txt(g, '“回到 HTML”', R.x + 20, R.y + 360, C.fg3, fnt(600, 20)); g.restore(); }
};
AN.hydrate = (g, t, R, st) => {
  if (st.k === 1) { wall(g, t, R, { k: 0, tk: st.tk }, [['静态生成', C.g, ['Jekyll（2008）', 'Hugo', 'Gatsby', 'VitePress', 'Eleventy']], ['托管平台', C.b, ['Netlify', 'Vercel', 'Cloudflare Pages', 'GitHub Pages']], ['理念', C.gold, ['Jamstack：JS + API + 预渲染的标记']]], { top: 130, rowH: 190, fs: 25 }); return; }
  hdr(g, R, 'SSR + 水合', '服务器先给 HTML，浏览器再补上交互');
  const steps = [['服务器渲染', 'HTML 已有内容', C.o], ['浏览器显示', '首屏可见', C.b], ['下载 JS', '整页的组件代码', C.p], ['水合', '绑定事件 · 可交互', C.g]];
  flowBoxes(g, t, R, steps, R.y + 160, { gap: .9, h: 130 });
  g.save(); g.globalAlpha = pop(t, 4.5); rr(g, R.x + 20, R.y + 380, R.w - 40, 120, 16, 'rgba(14,20,36,.92)', C.line2); txt(g, '全栈框架', R.x + 50, R.y + 440, C.fg3, fnt(700, 24)); ['Next.js（2016）', 'Nuxt（2016）', 'SvelteKit', 'SolidStart', 'Analog'].forEach((s, i) => chip(g, s, R.x + 200 + i * 220, R.y + 440, C.b, 1, 21)); g.restore();
};
AN.islands = (g, t, R) => {
  hdr(g, R, '岛屿架构与可恢复性', '页面中需要 JS 的部分（示意）');
  const D = [['SPA', 1, C.r, '整页都是 JS'], ['SSR + 水合', .85, C.o, '内容先到，JS 照样全下'], ['岛屿（Astro）', .2, C.g, '只有交互部分'], ['可恢复（Qwik）', .05, C.gold, '用到才加载']];
  const w = (R.w - 80) / 4; D.forEach(([a, f, col, d], i) => { const u = pop(t, .4 + i * .9), x = R.x + 20 + i * (w + 13), y = R.y + 130; g.save(); g.globalAlpha = u; rr(g, x, y, w, 430, 16, '#0B1020', C.line2); for (let r = 0; r < 6; r++) for (let c = 0; c < 2; c++) { const hit = i === 0 || (i === 1) || (i === 2 && ((r === 1 && c === 1) || r === 4)) || (i === 3 && r === 1 && c === 1); rr(g, x + 16 + c * ((w - 40) / 2 + 8), y + 16 + r * 68, (w - 40) / 2, 56, 6, hit ? (i === 1 ? col + '66' : col + 'aa') : 'rgba(255,255,255,.06)'); }
    txt(g, a, x + w / 2, y + 470, col, fnt(800, 24), 'center'); txt(g, d, x + w / 2, y + 508, C.fg3, fnt(500, 19), 'center'); g.restore(); });
};
AN.signals = (g, t, R, st) => {
  const k = st.k;
  if (k === 2) { wall(g, t, R, { k: 0, tk: st.tk }, [['React Compiler 1.0', C.b, ['2025-10', '编译期自动记忆化', '告别手写 useMemo']], ['Web Components', C.p, ['Custom Elements', 'Shadow DOM', 'Lit', 'Stencil']]], { top: 160, rowH: 240, fs: 26, labelW: 330 }); return; }
  hdr(g, R, k ? 'Signals：只通知依赖它的地方' : 'Svelte：编译时生成 DOM 操作', k ? 'SolidJS · Preact · Angular · Vue · Svelte 5 runes · TC39 提案' : '2016 · Rich Harris');
  const x = R.x + 40, y = R.y + 150;
  if (k === 0) { g.save(); g.globalAlpha = pop(t, .3); rr(g, x, y, 520, 220, 14, '#0B1020', C.line2); ['<script>', '  let count = 0', '</script>', '<button on:click={…}>{count}</button>'].forEach((s, i) => txt(g, s, x + 20, y + 40 + i * 44, C.fg2, fnt(600, 21, 'mono'))); g.restore();
    arrow(g, x + 540, y + 110, x + 640, y + 110, C.o, 4, 14, pop(t, 1.5)); g.save(); g.globalAlpha = pop(t, 1.5); txt(g, '编译', x + 590, y + 80, C.o, fnt(800, 22), 'center'); rr(g, x + 660, y, 560, 220, 14, '#0B1020', C.o, 2.5); ['button.textContent = count', '// 精确到这一个文本节点', '// 运行时没有虚拟 DOM'].forEach((s, i) => txt(g, s, x + 680, y + 60 + i * 50, i ? C.fg3 : C.fg, fnt(600, 22, 'mono'))); g.restore(); }
  else { const sx = x + 80, sy = y + 160; g.save(); g.globalAlpha = pop(st.tk, .2); dot(g, sx, sy, 50, 'rgba(255,210,122,.2)'); txt(g, 'count', sx, sy, C.gold, fnt(800, 26, 'mono'), 'center'); g.restore();
    const T = [['<span>{count}</span>', 0], ['标题', -1], ['总价 = count × 价格', 1], ['列表', -1], ['侧栏', -1], ['页脚', -1]];
    T.forEach(([s, dep], i) => { const X = x + 500 + (i % 2) * 380, Y = y + 20 + Math.floor(i / 2) * 140, hit = dep >= 0, ph = (st.tk % 2.5) / 2.5; node(g, X, Y, 340, 90, s, hit ? C.g : C.line2, pop(st.tk, .4 + i * .15)); if (hit) { line(g, [[sx + 50, sy], [X, Y + 45]], C.g, 2, [6, 6]); packet(g, [[sx + 50, sy], [X, Y + 45]], ph, C.gold, 8); } }); }
};
AN.speed = (g, t, R, st) => {
  if (st.bi === 0) { hdr(g, R, '用 Go 和 Rust 重写工具链', '冷启动耗时（示意）');
    const D = [['webpack（JS）', 1, C.fg3], ['esbuild（Go）', .05, C.g], ['swc（Rust）', .08, C.o], ['Rspack（Rust）', .12, C.o], ['Turbopack（Rust）', .1, C.o]];
    D.forEach(([a, v, col], i) => { const Y = R.y + 140 + i * 110, u = pop(t, .4 + i * .5); g.save(); g.globalAlpha = u; txt(g, a, R.x + 20, Y + 25, C.fg, fnt(700, 25, 'mono')); rr(g, R.x + 380, Y, (R.w - 440) * v * SS(u), 50, 10, col); g.restore(); });
    g.save(); g.globalAlpha = pop(t, 4); ['Biome', 'Oxc / oxlint', 'Lightning CSS', 'Rolldown'].forEach((s, i) => chip(g, s, R.x + 20 + i * 260, R.y + R.h - 50, C.p, 1, 22)); g.restore(); return; }
  wall(g, t, R, { k: 0, tk: t }, [['运行时', C.g, ['Node.js', 'Deno（2018）· Deno 2', 'Bun（2022）']], ['Node 新能力', C.b, ['直接运行 .ts（去掉类型）', '内置测试 · watch']], ['语言', C.gold, ['Temporal：日期时间新标准', 'Chrome 144 · Firefox 139']]], { top: 140, rowH: 190, fs: 25, labelW: 250 });
};
AN.wasm = (g, t, R, st) => {
  if (st.k === 0) { hdr(g, R, '把其他语言编进浏览器');
    flowBoxes(g, t, R, [['C / C++ / Rust', '源代码', C.fg2], ['Emscripten 等', '编译工具链', C.o], ['asm.js（2013）', 'JS 子集', C.p], ['Wasm（2017）', 'WebAssembly 二进制', C.g]], R.y + 150, { gap: .8, h: 130 });
    g.save(); g.globalAlpha = pop(t, 4); ['Figma', '网页版 Photoshop', 'AutoCAD Web', 'Google Earth', 'Wasm GC → Kotlin / Flutter'].forEach((s, i) => chip(g, s, R.x + 20 + (i % 3) * 400, R.y + 400 + Math.floor(i / 3) * 80, C.g, 1, 23)); g.restore(); return; }
  hdr(g, R, '三维与 GPU');
  events(g, st.tk, R, [['2010', 'Three.js', '', C.b], ['2011', 'WebGL 1.0', '基于 OpenGL ES', C.b], ['2013', 'Babylon.js', '', C.b], ['2017', 'WebGL 2', '', C.b], ['2023', 'WebGPU', 'Chrome 113', C.g], ['2025', 'WebGPU', 'Firefox 141 · Safari 26', C.g]], { y: 380 });
};
AN.absorb = (g, t, R) => {
  hdr(g, R, '平台继续吸收库的能力');
  const P = [['页面切换动画库', 'View Transitions'], ['弹层 / 模态框组件', 'Popover · <dialog>'], ['音视频处理库', 'WebCodecs'], ['日期库 Moment.js', 'Temporal'], ['Sass 嵌套与变量', 'CSS 嵌套 · 自定义属性'], ['jQuery 选择器', 'querySelector']];
  P.forEach(([a, b], i) => { const u = pop(t, .4 + i * .6), Y = R.y + 110 + i * 105; g.save(); g.globalAlpha = u; chip(g, a, R.x + 20, Y + 30, C.fg3, 1, 23); arrow(g, R.x + R.w / 2 - 60, Y + 30, R.x + R.w / 2 + 20, Y + 30, C.g, 3, 10); chip(g, b, R.x + R.w / 2 + 40, Y + 30, C.g, 1, 23); g.restore(); });
};
AN.aitimeline = (g, t, R, st) => {
  if (st.k === 0) { hdr(g, R, 'AI 写代码');
    events(g, t, R, [['2021', 'GitHub Copilot', '编辑器里补全', C.b], ['2022-11', 'ChatGPT', '对话式编程', C.g], ['2023', 'AI 编辑器', 'Cursor 等', C.p], ['2025', '编程代理', '读仓库 · 改文件 · 跑测试', C.gold]], { y: 380 }); return; }
  wall(g, t, R, { k: 0, tk: st.tk }, [['AI 编辑器', C.p, ['Cursor', 'Windsurf', 'VS Code + Copilot']], ['编程代理', C.gold, ['Claude Code', 'Codex', 'Copilot Agent']], ['国内', C.r, ['通义灵码', 'Trae']], ['一句话生成应用', C.g, ['v0', 'bolt.new', 'Lovable', 'Figma Make']]], { top: 120, rowH: 150, fs: 25, labelW: 280 });
};
AN.aiflow = (g, t, R, st) => {
  hdr(g, R, st.k ? '工作流在变' : 'vibe coding（2025）', st.k ? '' : '“不看代码，只描述想要什么”');
  const y1 = R.y + 160, y2 = R.y + 440;
  g.save(); g.globalAlpha = pop(t, .3); txt(g, '过去', R.x + 20, y1 - 20, C.fg3, fnt(700, 22)); g.restore();
  flowBoxes(g, t, { ...R, w: R.w }, [['看设计稿', '', C.fg3], ['手写组件', '大部分时间', C.fg3], ['调样式', '', C.fg3], ['测试上线', '', C.fg3]], y1, { gap: .4, h: 100 });
  if (st.k >= 1 || t > 3) { const tt = st.k ? st.tk : t - 3; g.save(); g.globalAlpha = pop(tt, .2); txt(g, '现在', R.x + 20, y2 - 20, C.gold, fnt(700, 22)); g.restore(); flowBoxes(g, tt, R, [['描述需求', '约束 · 验收标准', C.gold], ['AI 生成', '代码 · 界面', C.p], ['人审查', '大部分时间', C.g], ['测试上线', '', C.g]], y2, { gap: .5, h: 100 }); }
};
AN.genui = (g, t, R, st) => {
  if (st.k === 1) { wall(g, t, R, { k: 0, tk: st.tk }, [['浏览器里推理', C.p, ['Transformers.js', 'WebLLM', 'ONNX Runtime Web', '借助 WebGPU']], ['Chrome 内置 AI', C.g, ['Translator', 'Language Detector', 'Summarizer', 'Prompt API（试验）']]], { top: 160, rowH: 240, fs: 25, labelW: 260 }); return; }
  hdr(g, R, 'AI 界面成了新常态');
  const x = R.x + 30, y = R.y + 120, w = 640; rr(g, x, y, w, 520, 16, '#0B1020', C.line2);
  const msg = '下周去杭州出差，帮我订酒店', ans = '找到 3 家西湖附近的酒店：'; txt(g, msg, x + w - 30, y + 50, C.fg, fnt(600, 22), 'right');
  const n = Math.floor(CL((t - .8) / 2) * ans.length); txt(g, ans.slice(0, n) + (n < ans.length ? '▍' : ''), x + 30, y + 110, C.fg2, fnt(600, 22));
  for (let i = 0; i < 3; i++) { const u = pop(t, 3 + i * .4); g.save(); g.globalAlpha = u; rr(g, x + 30, y + 150 + i * 110, w - 60, 95, 12, 'rgba(92,180,255,.08)', C.b, 2); rr(g, x + 46, y + 166 + i * 110, 90, 63, 8, C.line2); txt(g, ['湖滨酒店', '西溪酒店', '运河酒店'][i], x + 160, y + 185 + i * 110, C.fg, fnt(700, 22)); txt(g, '★ 4.' + (7 - i) + ' · 示意', x + 160, y + 218 + i * 110, C.fg3, fnt(500, 18)); chip(g, '预订', x + w - 150, y + 198 + i * 110, C.g, 1, 18); g.restore(); }
  g.save(); g.globalAlpha = pop(t, 2); txt(g, '流式文字 + 模型选择的组件（生成式 UI）', x + w + 40, y + 60, C.gold, fnt(700, 24)); ['Vercel AI SDK', 'LangChain.js', 'CopilotKit', 'assistant-ui'].forEach((s, i) => chip(g, s, x + w + 40, y + 140 + i * 70, C.p, 1, 22)); g.restore();
};
AN.agents = (g, t, R) => {
  hdr(g, R, '网页的新读者：AI 代理');
  const cx = R.x + R.w / 2, y = R.y + 140;
  g.save(); g.globalAlpha = pop(t, .3); rr(g, cx - 220, y + 120, 440, 300, 18, '#0B1020', C.b, 3); txt(g, '网站', cx, y + 160, C.b, fnt(800, 28), 'center'); ['<button>预订</button>', '<form> 搜索', 'aria-label …'].forEach((s, i) => txt(g, s, cx - 190, y + 220 + i * 50, C.fg2, fnt(600, 20, 'mono'))); g.restore();
  person(g, R.x + 140, y + 270, C.fg2, 1.6); g.save(); g.globalAlpha = pop(t, .5); txt(g, '人：看界面、点按钮', R.x + 140, y + 360, C.fg2, fnt(600, 22), 'center'); g.restore(); arrow(g, R.x + 220, y + 270, cx - 230, y + 270, C.fg3, 3, 10, pop(t, .8));
  bot(g, R.x + R.w - 160, y + 260, C.gold, 1.8); g.save(); g.globalAlpha = pop(t, 1.5); txt(g, 'AI 代理', R.x + R.w - 160, y + 360, C.gold, fnt(700, 22), 'center'); ['ChatGPT Atlas', 'Comet', 'Claude in Chrome'].forEach((s, i) => txt(g, s, R.x + R.w - 160, y + 400 + i * 32, C.fg3, fnt(500, 18), 'center')); g.restore(); arrow(g, R.x + R.w - 240, y + 270, cx + 230, y + 270, C.gold, 3, 10, pop(t, 1.8));
  g.save(); g.globalAlpha = pop(t, 3.5); rr(g, cx - 380, y + 480, 760, 150, 16, 'rgba(255,210,122,.07)', C.gold, 2.5); txt(g, 'WebMCP（Google · Microsoft）', cx, y + 520, C.gold, fnt(800, 26), 'center'); txt(g, '网站把可执行的操作结构化地开放给代理', cx, y + 565, C.fg, fnt(600, 22), 'center'); txt(g, '语义化 HTML / 可访问性 → 也是给 AI 看的接口', cx, y + 605, C.fg2, fnt(600, 20), 'center'); g.restore();
};
AN.newprob = (g, t, R, st) => {
  const P = [['主流更强势', 'AI 默认组合：React + Tailwind + shadcn/ui', C.o, 0], ['看起来能跑 ≠ 正确', '测试 · 代码审查 · 设计系统更重要', C.b, 1], ['提示注入', '网页文字可能操纵代理', C.bad, 1], ['角色转变', '写界面 → 定义需求、约束与验收', C.gold, 2]];
  hdr(g, R, 'AI 带来的新问题', '趋势判断，不作定论');
  P.forEach(([a, b, col, kk], i) => { if (st.k < kk) return; const u = pop(st.k === kk ? (kk ? st.tk : t) : 99, .3 + (i === 2 ? .8 : 0)), Y = R.y + 110 + i * 160; g.save(); g.globalAlpha = u; g.translate((1 - u) * 30, 0); rr(g, R.x + 20, Y, R.w - 40, 136, 18, 'rgba(14,20,36,.92)', col, 2.5); rr(g, R.x + 20, Y, 10, 136, 4, col); txt(g, a, R.x + 60, Y + 48, col, fnt(800, 30)); txt(g, b, R.x + 60, Y + 98, C.fg, fnt(600, 24)); g.restore(); });
};
AN.graves3 = (g, t, R, st) => lifespans(g, t, R, st, [
  ['Gatsby', 2015, 2023, '热潮退去', 0], ['Snowpack', 2020, 2022, '停止维护 → Vite', 0], ['Remix', 2021, 2024, '并入 React Router', 0],
  ['styled-components', 2016, 2025, '维护模式', 1], ['Rome', 2020, 2023, '社区接手 → Biome', 1]], '昙花一现（三）', '红条：从流行到退场或转型（年份为约数）', 2012, 2027, [2015, 2020, 2025]);
AN.laws = (g, t, R, st) => {
  hdr(g, R, '三十年的规律');
  const L = [['1', '社区先试，平台再吸收', 'jQuery · 插件 · 预处理器 · 打包器', 0], ['2', '渲染位置像钟摆', '服务端 → 客户端 → 混合', 0], ['3', '运行时 → 编译期', 'Svelte · React Compiler · TypeScript', 1], ['4', '复杂度守恒', '解决一处，挪到另一层', 1], ['5', '文档平台上造应用', '前端难题的根源', 1], ['+', 'AI：谁来写，写给谁看', '人 + 代理', 2]];
  L.forEach(([n, a, b, kk], i) => { if (st.k < kk) return; const u = pop(st.k === kk ? (kk ? st.tk : t) : 99, .3 + (i - L.findIndex(l => l[3] === kk)) * .7), c = i % 2, r = Math.floor(i / 2), X = R.x + 20 + c * (R.w / 2), Y = R.y + 100 + r * 190, col = n === '+' ? C.gold : C.b; g.save(); g.globalAlpha = u; rr(g, X, Y, R.w / 2 - 40, 160, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, n, X + 40, Y + 80, col, fnt(900, 54, 'mono'), 'center'); txt(g, a, X + 90, Y + 60, C.fg, fnt(800, 28)); txt(g, b, X + 90, Y + 112, C.fg3, fnt(600, 21)); g.restore(); });
};
