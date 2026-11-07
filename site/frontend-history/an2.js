// 中集动画：框架与工程化
AN.modules = (g, t, R, st) => {
  const k = st.k;
  if (k === 0) { hdr(g, R, '模块规范');
    const M = [['CommonJS', 'require() · 同步', 'Node（2009）', C.g], ['AMD', 'define() · 异步', 'RequireJS', C.b], ['CMD', '按需加载', 'SeaJS（玉伯）', C.o], ['UMD', '两边都能用', '包装层', C.p]];
    M.forEach(([a, b, c, col], i) => { const u = pop(t, .4 + i * .7), x = R.x + 20 + i * ((R.w - 40) / 4), w = (R.w - 40) / 4 - 24; g.save(); g.globalAlpha = u; rr(g, x, R.y + 140, w, 260, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, x + 26, R.y + 190, col, fnt(800, 32, 'mono')); txt(g, b, x + 26, R.y + 260, C.fg, fnt(600, 22)); txt(g, c, x + 26, R.y + 310, C.fg3, fnt(600, 20)); g.restore(); });
    g.save(); g.globalAlpha = pop(t, 4); rr(g, R.x + 20, R.y + 470, R.w - 40, 200, 16, '#0B1020', C.line2); txt(g, "const _ = require('lodash')          // CommonJS", R.x + 50, R.y + 530, C.fg, fnt(600, 26, 'mono')); txt(g, "define(['jquery'], function ($) { … })  // AMD", R.x + 50, R.y + 590, C.fg, fnt(600, 26, 'mono')); g.restore(); }
  else { wall(g, t, R, { k: 0, tk: st.tk }, [['包管理', C.b, ['Bower', 'npm', 'Yarn（2016）', 'pnpm']], ['任务运行器', C.o, ['Grunt（2012）', 'Gulp（2013）', 'npm scripts']], ['CDN 与引入', C.fg2, ['<script src>', 'cdnjs', 'unpkg', 'import maps']]], { top: 140, rowH: 170, fs: 26 }); }
};
AN.bundle = (g, t, R) => {
  hdr(g, R, '打包器：从依赖图到产物');
  const nodes = [[.12, .3, 'main.js'], [.32, .15, 'cart.js'], [.32, .45, 'ui.js'], [.52, .1, 'lodash'], [.52, .32, 'api.js'], [.52, .55, 'style.css'], [.52, .75, 'logo.png']], E = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [2, 6]];
  const X = u => R.x + 40 + u * (R.w - 80), Y = v => R.y + 120 + v * 560;
  E.forEach(([a, b], i) => { const u = pop(t, .8 + i * .2); g.save(); g.globalAlpha = u * (1 - SS((t - 4) / 1)); line(g, [[X(nodes[a][0]) + 80, Y(nodes[a][1])], [X(nodes[b][0]) - 80, Y(nodes[b][1])]], C.line2, 2); g.restore(); });
  const m = SS((t - 4) / 1.5);
  nodes.forEach(([x, y, s], i) => { const u = pop(t, .3 + i * .2), tx = LERP(X(x), X(.85), m), ty = LERP(Y(y), Y(.42), m); g.save(); g.globalAlpha = u * (1 - m); chip(g, s, tx - 80, ty, i >= 5 ? C.o : C.b, 1, 22); g.restore(); });
  g.save(); g.globalAlpha = m; rr(g, X(.85) - 130, Y(.42) - 70, 260, 140, 18, 'rgba(95,224,160,.12)', C.g, 3); txt(g, 'bundle.js', X(.85), Y(.42) - 10, C.g, fnt(800, 30, 'mono'), 'center'); txt(g, '+ 资源文件', X(.85), Y(.42) + 34, C.fg3, fnt(600, 20), 'center'); g.restore();
  g.save(); g.globalAlpha = pop(t, 6); ['Browserify', 'webpack', 'Rollup', 'Parcel', '→ ES Modules（2015）'].forEach((s, i) => chip(g, s, R.x + 20 + i * 250, R.y + R.h - 30, i === 4 ? C.gold : C.fg2, 1, 22)); g.restore();
};
AN.spaghetti = (g, t, R) => {
  hdr(g, R, '数据在变量里，界面在 DOM 里');
  const dx = R.x + 60, ux = R.x + R.w - 420;
  ['cart', 'user', 'count', 'filter', 'items'].forEach((s, i) => { const u = pop(t, .2 + i * .15); g.save(); g.globalAlpha = u; chip(g, s, dx, R.y + 160 + i * 110, C.b, 1, 24); g.restore(); });
  ['#badge', '#list', '#total', '#header', '#empty', '#btn'].forEach((s, i) => { const u = pop(t, .4 + i * .15); g.save(); g.globalAlpha = u; chip(g, s, ux, R.y + 150 + i * 95, C.o, 1, 24); g.restore(); });
  for (let i = 0; i < 16; i++) { const u = pop(t, 1.5 + i * .18); if (u <= 0) continue; const a = i % 5, b = (i * 5 + 1) % 6, x0 = dx + 130, y0 = R.y + 160 + a * 110, x1 = ux - 10, y1 = R.y + 150 + b * 95; g.save(); g.globalAlpha = u * .7; g.strokeStyle = i % 3 ? C.r : C.fg3; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y0); g.bezierCurveTo(x0 + 300, y0 + (i % 2 ? 200 : -200), x1 - 300, y1 + (i % 2 ? -150 : 150), x1, y1); g.stroke(); g.restore(); }
  g.save(); g.globalAlpha = pop(t, 5); txt(g, '“意大利面”代码：改一处，要记得改好几处', R.x + R.w / 2, R.y + R.h - 30, C.bad, fnt(800, 28), 'center'); g.restore();
};
AN.twoway = (g, t, R) => {
  hdr(g, R, 'AngularJS：双向绑定', '2010 · Google');
  const x = R.x + 60, y = R.y + 160;
  g.save(); g.globalAlpha = pop(t, .3); rr(g, x, y, 520, 90, 12, '#0B1020', C.b, 2); const s = 'Hello'.slice(0, Math.min(5, Math.floor(t * 2))); txt(g, '<input ng-model="name">', x + 20, y - 24, C.fg3, fnt(600, 20, 'mono')); txt(g, s + (t % 1 < .5 ? '|' : ''), x + 24, y + 45, C.fg, fnt(700, 32, 'mono'));
  rr(g, x + 760, y, 420, 90, 12, '#0B1020', C.g, 2); txt(g, '{{ name }}', x + 760, y - 24, C.fg3, fnt(600, 20, 'mono')); txt(g, s, x + 784, y + 45, C.g, fnt(700, 32, 'mono'));
  arrow(g, x + 530, y + 30, x + 750, y + 30, C.g, 3, 12); arrow(g, x + 750, y + 60, x + 530, y + 60, C.g, 3, 12); txt(g, '$scope.name', x + 640, y + 110, C.fg2, fnt(700, 22, 'mono'), 'center'); g.restore();
  g.save(); g.globalAlpha = pop(t, 3); rr(g, R.x + 20, R.y + 400, R.w - 40, 250, 18, 'rgba(255,107,107,.06)', C.bad, 2); txt(g, '代价', R.x + 50, R.y + 445, C.bad, fnt(800, 28));
  txt(g, '· 数据是在哪里被改的？很难追踪', R.x + 50, R.y + 510, C.fg, fnt(600, 26)); txt(g, '· 脏检查：每次变化都遍历所有 watcher，绑定一多就慢', R.x + 50, R.y + 570, C.fg, fnt(600, 26)); g.restore();
};
AN.vdom = (g, t, R) => {
  hdr(g, R, 'React：UI = f(state)', '2013 · Facebook');
  const st0 = R.x + 40, y = R.y + 160;
  const n = t < 3 ? 2 : 3; g.save(); g.globalAlpha = pop(t, .3); rr(g, st0, y, 220, 120, 14, 'rgba(14,20,36,.95)', C.gold, 2.5); txt(g, 'state', st0 + 20, y + 40, C.gold, fnt(800, 24, 'mono')); txt(g, `items: ${n}`, st0 + 20, y + 85, C.fg, fnt(700, 26, 'mono')); g.restore();
  const tree = (ox, oy, cnt, hi, a) => { g.save(); g.globalAlpha = a; const P = [[ox + 130, oy]]; node(g, ox + 70, oy, 120, 50, 'ul', C.b, 1); for (let i = 0; i < cnt; i++) { const cx = ox + i * 90 + 15; line(g, [[ox + 130, oy + 50], [cx + 40, oy + 110]], C.line2, 2); node(g, cx, oy + 110, 80, 46, 'li', hi && i === cnt - 1 ? C.g : C.b, 1); } g.restore(); };
  arrow(g, st0 + 230, y + 60, st0 + 300, y + 60, C.fg3, 3, 10, pop(t, .8));
  txt(g, '旧的虚拟 DOM', st0 + 320, y - 20, C.fg3, fnt(600, 20)); tree(st0 + 310, y + 20, 2, false, pop(t, 1));
  txt(g, '新的虚拟 DOM', st0 + 680, y - 20, C.fg3, fnt(600, 20)); tree(st0 + 670, y + 20, n, true, pop(t, 3.2));
  g.save(); g.globalAlpha = pop(t, 4.5); txt(g, 'diff：只多了一个 <li>', st0 + 520, y + 260, C.g, fnt(800, 26), 'center'); arrow(g, st0 + 820, y + 250, st0 + 820, y + 330, C.g, 3, 12); rr(g, st0 + 620, y + 340, 420, 180, 14, '#0B1020', C.g, 2.5); txt(g, '真实 DOM', st0 + 640, y + 375, C.fg3, fnt(600, 20)); for (let i = 0; i < 3; i++) rr(g, st0 + 650, y + 400 + i * 36, 300, 26, 6, i === 2 ? 'rgba(95,224,160,.5)' : C.line2); txt(g, 'appendChild', st0 + 960, y + 485, C.g, fnt(700, 20, 'mono'), 'right'); g.restore();
};
AN.state = (g, t, R, st) => wall(g, t, R, st, [
  ['Flux 一脉', C.b, ['Flux（2014）', 'Redux（2015）', 'redux-saga', 'Redux Toolkit'], 0], ['响应式', C.g, ['MobX', 'Vuex', 'Pinia'], 0], ['原子 / 轻量', C.p, ['Recoil', 'Jotai', 'Zustand', 'XState'], 0],
  ['数据获取', C.o, ['GraphQL', 'Apollo', 'Relay', 'TanStack Query', 'SWR'], 0], ['API 演进', C.gold, ['React Hooks（2019）', 'Vue 3 组合式 API（2020）'], 1]], { top: 90, rowH: 140, fs: 23 });
AN.langs = (g, t, R, st) => {
  if (st.bi === 0) { wall(g, t, R, st, [['加糖派', C.o, ['CoffeeScript（2009）', 'LiveScript', 'Dart（2011）']], ['函数式', C.p, ['Elm', 'ClojureScript', 'PureScript', 'ReasonML / ReScript']], ['类型', C.b, ['TypeScript（2012）', 'Flow（2014）', 'Closure Compiler']]], { top: 140, rowH: 180, fs: 26 }); return; }
  hdr(g, R, 'TypeScript 成了事实标准', 'State of JS：只写 TypeScript 的比例');
  const D = [['2022', 28], ['2024', 34], ['2025', 40]], x = R.x + 120, y0 = R.y + 640;
  D.forEach(([y, v], i) => { const u = pop(t, .5 + i * .6), h = 440 * v / 45 * SS(u), X = x + i * 300; rr(g, X, y0 - h, 180, h, 10, C.b); txt(g, y, X + 90, y0 + 30, C.fg2, fnt(700, 24, 'mono'), 'center'); if (u > .9) txt(g, v + '%', X + 90, y0 - h - 30, C.b, fnt(800, 32, 'mono'), 'center'); });
};
AN.cssscale = (g, t, R, st) => {
  const S = [['命名约定', 'OOCSS · BEM · SMACSS', '.card__title--big', C.fg2], ['预处理', 'Sass · Less · Stylus · PostCSS', '$primary: #3af;', C.b], ['作用域', 'CSS Modules', '.title_x7f3a', C.g], ['CSS-in-JS', 'styled-components · Emotion', 'styled.h1`…`', C.p], ['原子化', 'Tailwind · UnoCSS', 'class="p-4 text-lg"', C.o]];
  const show = [1, 3, 5][st.k] || 5, first = [0, 1, 3][st.k] || 0; hdr(g, R, '样式规模化：五批答案');
  S.slice(0, show).forEach(([a, b, c, col], i) => { const u = i >= first ? pop(st.k === 0 ? t : st.tk, .3 + (i - first) * .9) : 1, Y = R.y + 100 + i * 140; g.save(); g.globalAlpha = u; rr(g, R.x + 20, Y, R.w - 40, 120, 16, 'rgba(14,20,36,.92)', col, 2.5); txt(g, String(i + 1), R.x + 50, Y + 60, col, fnt(900, 40, 'mono')); txt(g, a, R.x + 110, Y + 42, col, fnt(800, 28)); txt(g, b, R.x + 110, Y + 88, C.fg2, fnt(600, 21)); txt(g, c, R.x + R.w - 50, Y + 60, C.fg, fnt(600, 24, 'mono'), 'right'); g.restore(); });
};
AN.uilibs = (g, t, R, st) => wall(g, t, R, st, [
  ['组件库', C.b, ['Bootstrap（2011）', 'Foundation', 'Material UI', 'Ant Design', 'Element', 'Chakra UI']], ['无样式 / 复制即用', C.p, ['Radix', 'Headless UI', 'shadcn/ui（2023）']], ['原生 CSS 补课', C.g, ['自定义属性（变量）', '嵌套', ':has()', '容器查询', '@layer']]], { top: 130, rowH: 200, fs: 25, labelW: 280 });
AN.responsive = (g, t, R) => {
  hdr(g, R, '响应式设计（2010）', '同一个页面，随屏幕宽度重排');
  const w = LERP(1100, 300, (Math.sin(t * .7) + 1) / 2), x = R.x + 60, y = R.y + 140, cols = w > 800 ? 3 : w > 520 ? 2 : 1;
  rr(g, x, y, w, 560, 18, '#0B1020', C.b, 3); rr(g, x + 20, y + 20, w - 40, 60, 8, 'rgba(92,180,255,.35)');
  const cw = (w - 40 - (cols - 1) * 16) / cols; for (let i = 0; i < 6; i++) { const r = Math.floor(i / cols), c = i % cols, yy = y + 100 + r * 130; if (yy > y + 500) continue; rr(g, x + 20 + c * (cw + 16), yy, cw, 110, 8, C.line2); }
  txt(g, `${Math.round(w)}px`, x + w / 2, y + 600, C.fg3, fnt(700, 22, 'mono'), 'center');
  g.save(); g.globalAlpha = pop(t, 2); rr(g, R.x + R.w - 440, y, 420, 200, 14, '#0B1020', C.line2); txt(g, '@media (max-width: 600px) {', R.x + R.w - 420, y + 50, C.fg2, fnt(600, 20, 'mono')); txt(g, '  .grid { columns: 1 }', R.x + R.w - 420, y + 90, C.fg, fnt(600, 20, 'mono')); txt(g, '}', R.x + R.w - 420, y + 130, C.fg2, fnt(600, 20, 'mono')); g.restore();
};
AN.multi = (g, t, R, st) => wall(g, t, R, st, [
  ['像 App 的网页', C.fg2, ['jQuery Mobile', 'Sencha Touch'], 0], ['网页套壳', C.o, ['PhoneGap / Cordova', 'Ionic'], 0], ['JS 驱动原生', C.b, ['React Native（2015）', 'Weex', 'NativeScript'], 0],
  ['桌面', C.p, ['Electron', 'NW.js', 'Tauri'], 1], ['Web 应用化', C.g, ['PWA', 'Service Worker', 'Web App Manifest'], 1], ['小程序', C.gold, ['微信小程序（2017）', '支付宝 · 百度 · 字节', 'Taro', 'uni-app'], 2]], { top: 90, rowH: 125, fs: 23, labelW: 250 });
AN.toolwall = (g, t, R, st) => wall(g, t, R, st, [
  ['调试', C.fg2, ['Firebug', 'Chrome DevTools'], 0], ['检查 / 格式化', C.b, ['JSLint', 'JSHint', 'ESLint', 'Prettier'], 0],
  ['单元测试', C.g, ['QUnit', 'Jasmine', 'Mocha', 'Karma', 'Jest', 'Vitest'], 1], ['端到端', C.o, ['PhantomJS', 'Selenium', 'Puppeteer', 'Cypress', 'Playwright'], 1], ['组件开发', C.p, ['Storybook'], 1],
  ['大型项目', C.gold, ['Lerna', 'Nx', 'Turborepo', 'single-spa', 'qiankun', 'Module Federation'], 2]], { top: 90, rowH: 120, fs: 23, labelW: 230 });
AN.graves2 = (g, t, R, st) => lifespans(g, t, R, st, [
  ['Bower', 2012, 2017, 'npm / Yarn 取代', 0], ['Grunt / Gulp', 2012, 2018, '打包器 + npm scripts', 0], ['RequireJS / SeaJS', 2010, 2017, '原生模块', 0], ['CoffeeScript', 2009, 2017, '被 ES2015 吸收', 0],
  ['AngularJS', 2010, 2021, '2021 年底停止维护', 1], ['Backbone / Knockout', 2010, 2016, '组件化框架', 1], ['Polymer / HTML Imports', 2013, 2019, '→ Lit · 提案撤回', 1],
  ['PhantomJS', 2011, 2018, '无头 Chrome', 2], ['TSLint', 2015, 2019, '→ ESLint', 2], ['Karma', 2012, 2023, '弃用', 2], ['Create React App', 2016, 2025, '官方弃用', 2], ['Recoil', 2020, 2025, '归档', 2], ['AMP', 2015, 2021, '失去搜索特权', 2]], '昙花一现（二）', '红条：从流行到退场（年份为约数）', 2007, 2027, [2010, 2015, 2020, 2025]);
AN.why = (g, t, R) => {
  hdr(g, R, '为什么会被淘汰？');
  const W = [['标准吸收了它', 'CoffeeScript → ES2015\nRequireJS → ES Modules', C.g], ['更好的方案出现', 'Grunt → webpack\nTSLint → ESLint', C.b], ['问题本身消失', 'Chrome Frame（IE 退场）\nAMP（网页变快）', C.o]];
  const w = (R.w - 80) / 3; W.forEach(([a, b, col], i) => { const u = pop(t, .4 + i * 1.2), x = R.x + 20 + i * (w + 20); g.save(); g.globalAlpha = u; rr(g, x, R.y + 140, w, 380, 20, 'rgba(14,20,36,.92)', col, 3); txt(g, a, x + w / 2, R.y + 210, col, fnt(800, 32), 'center'); b.split('\n').forEach((l, j) => txt(g, l, x + w / 2, R.y + 310 + j * 56, C.fg2, fnt(600, 23), 'center')); g.restore(); });
  banner(g, R, '但每一个都在当时推着前端往前走', pop(t, 5));
};
AN.sum2 = (g, t, R) => {
  hdr(g, R, '中集小结：2020 年前后的主流');
  flowBoxes(g, t, R, [['组件化', 'React · Vue · Angular', C.b], ['TypeScript', '类型成为标配', C.b], ['npm', '包生态', C.g], ['打包器', 'webpack 等', C.g]], R.y + 170, { gap: .6 });
  const u = pop(t, 3.5); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + 400, R.w - 40, 220, 20, 'rgba(255,210,122,.07)', C.gold, 2.5); txt(g, '新问题', R.x + 60, R.y + 450, C.gold, fnt(800, 30));
  txt(g, '· 单页应用：首屏白屏，搜索引擎看不到内容', R.x + 60, R.y + 510, C.fg, fnt(700, 28)); txt(g, '· 工具链越来越重：启动和构建越来越慢', R.x + 60, R.y + 570, C.fg, fnt(700, 28)); g.restore();
};
