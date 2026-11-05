// 下集动画
AN.desk = (g, t, R, st) => {
  const k = st.k; const two = [['内容网站', ['开十秒', '滚动、读、走', '每次都是新的', '首屏最重要'], C.fg3], ['桌面级应用', ['开一天', '拖拽 · 快捷键 · 多面板 · 撤销重做', '记住你上次的一切', '每次操作的响应最重要'], C.gold]];
  two.forEach(([n, L, col], i) => { const x = R.x + 60 + i * 840, y = R.y + 60, u = pop(t, .3 + i * .6); if (u <= 0) return; g.save(); g.globalAlpha = u; rr(g, x, y, 760, 420, 18, 'rgba(14,20,36,.9)', col, i ? 3 : 2); txt(g, n, x + 30, y + 60, col, fnt(800, 40)); L.forEach((s, j) => { g.globalAlpha = u * pop(t, .6 + i * .6 + j * .3); txt(g, '· ' + s, x + 30, y + 140 + j * 60, C.fg, fnt(500, 26)); }); g.restore(); });
  if (k >= 1) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; txt(g, '这一集', R.x + 60, R.y + 560, C.fg, fnt(700, 28)); ['分层', '布局', '键盘', '多线程', '本地数据', '多窗口', '客户端壳', '工程', 'AI'].forEach((s, i) => { g.globalAlpha = u * pop(st.tk, .5 + i * .2); tag(g, `${String(i + 1).padStart(2, '0')} ${s}`, R.x + 60 + i * 180, R.y + 620, i === 6 ? C.gold : C.o); }); g.restore(); }
};
AN.arch = (g, t, R, st) => {
  const cx = R.x + 500, cy = R.y + R.h / 2; const rings = [['领域层', '纯数据和规则 · 不知道界面存在', 150, C.gold], ['应用层', '把操作翻译成领域的命令', 260, C.p], ['界面层', '组件 · 事件 · 画', 370, C.b]];
  [...rings].reverse().forEach(([n, d, r, col], j) => { const i = 2 - j; const u = pop(t, .3 + i * .5); if (u <= 0) return; g.save(); g.globalAlpha = u; g.strokeStyle = col; g.lineWidth = 3; g.fillStyle = `rgba(14,20,36,.6)`; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill(); g.stroke(); txt(g, n, cx, cy - r + 36, col, fnt(700, 26), 'center'); g.restore(); });
  rings.forEach(([n, d, r, col], i) => { const u = pop(t, .5 + i * .5); g.save(); g.globalAlpha = u; const y = R.y + 120 + i * 150; rr(g, R.x + 960, y, 680, 110, 16, 'rgba(14,20,36,.9)', col); txt(g, n, R.x + 990, y + 40, col, fnt(700, 28)); txt(g, d, R.x + 990, y + 82, C.fg2, fnt(500, 22)); g.restore(); });
  const ph = (t * .5) % 1; const ang = -Math.PI / 2 + .6; dot(g, cx + Math.cos(ang) * LERP(370, 60, ph), cy + Math.sin(ang) * LERP(370, 60, ph), 9, C.fg); txt(g, '点击 → 命令 → 规则', cx + 200, cy + 300, C.fg3, fnt(500, 21));
  txt(g, '依赖只能朝里：外层知道内层，内层不知道外层', R.x + 960, R.y + 620, C.gold, fnt(600, 24));
};
AN.undo = (g, t, R, st) => {
  const k = st.k; title(g, '命令对象 + 栈 = 撤销重做', R);
  ['interface Command {', '  execute(): void', '  undo(): void', '}', '', 'class MoveNode implements Command {', '  constructor(id, from, to) {}', '  execute() { graph.move(this.id, this.to) }', '  undo()    { graph.move(this.id, this.from) }', '}'].forEach((s, i) => txt(g, s, R.x + 40, R.y + 110 + i * 36, /execute|undo/.test(s) ? C.gold : C.fg2, fnt(500, 21, 'mono')));
  const ph = (t * .4) % 1; const n = ph < .6 ? Math.min(5, Math.floor(ph / .12) + 1) : Math.max(2, 5 - Math.floor((ph - .6) / .13)); const sx = R.x + 760, sy = R.y + 520; txt(g, ph < .6 ? '执行 → 压栈' : '撤销 → 弹出栈顶，调用 undo()', sx, R.y + 110, ph < .6 ? C.g : C.o, fnt(700, 26));
  const names = ['MoveNode', 'Rename', 'AddEdge', 'MoveNode', 'Delete']; for (let i = 0; i < 5; i++) { const on = i < n; g.save(); g.globalAlpha = on ? 1 : .15; rr(g, sx, sy - i * 66, 320, 56, 10, on ? 'rgba(255,210,122,.12)' : 'rgba(255,255,255,.03)', on ? C.gold : C.line2); txt(g, names[i], sx + 20, sy - i * 66 + 28, on ? C.fg : C.fg3, fnt(600, 22, 'mono')); g.restore(); } txt(g, '撤销栈', sx, sy + 90, C.fg3, fnt(500, 20));
  const notes = { 1: ['界面不需要知道任何细节'], 2: ['可以记录下来回放', '可以合并成一个批次', '快捷键和菜单项共用同一个入口', '编辑器的每一个功能 = 一条命令'], 3: ['领域层没有 DOM → 普通单元测试', '界面层只测：命令有没有发对', '换界面框架，领域层一行不改'] };
  (notes[k] || []).forEach((s, i) => { g.save(); g.globalAlpha = pop(st.tk, .3 + i * .4); txt(g, '· ' + s, R.x + 1150, R.y + 130 + i * 56, C.fg2, fnt(500, 23)); g.restore(); });
};
AN.panels = (g, t, R, st) => {
  const k = st.k; const px = R.x + 40, py = R.y + 60, pw = 1000, ph = 640; const ph1 = (t * .3) % 2, u = SS(ph1 < 1 ? ph1 : 2 - ph1); const sideW = LERP(220, 380, u), botH = LERP(160, 240, SS(Math.sin(t * .4) * .5 + .5));
  rr(g, px, py, pw, ph, 12, 'rgba(14,20,36,.9)', C.line2);
  const areas = [[px, py, sideW, ph, '资源', C.b], [px + sideW + 6, py, pw - sideW - 6, ph - botH - 6, '编辑器', C.fg3], [px + sideW + 6, py + ph - botH, pw - sideW - 6, botH, '终端 / 问题', C.o]];
  areas.forEach(([x, y, w, h, n, col]) => { rr(g, x + 4, y + 4, w - 8, h - 8, 8, 'rgba(255,255,255,.03)', col, 1.5); txt(g, n, x + 20, y + 30, col, fnt(600, 20)); });
  // 侧栏内容：容器查询
  const narrow = sideW < 300; for (let i = 0; i < 6; i++) { const y = py + 60 + i * 44; rr(g, px + 16, y, narrow ? 36 : sideW - 32, 34, 6, 'rgba(92,180,255,.12)', null); rr(g, px + 24, y + 9, 16, 16, 4, C.b); if (!narrow) txt(g, ['src', 'components', 'domain', 'workers', 'tests', 'package.json'][i], px + 52, y + 17, C.fg2, fnt(500, 18)); }
  g.fillStyle = C.gold; g.fillRect(px + sideW, py, 6, ph); g.fillRect(px + sideW + 6, py + ph - botH - 6, pw - sideW - 6, 6);
  txt(g, `--side: ${Math.round(sideW)}px`, px + sideW + 20, py + ph - botH - 30, C.gold, fnt(500, 18, 'mono'));
  const code = ['.app {', '  display: grid;', '  grid-template-columns: var(--side) 1fr;', '  grid-template-rows: 1fr var(--bottom);', '}', '.side { container-type: inline-size }', '@container (width < 300px) {', '  .label { display: none }   /* 只剩图标 */', '}']; code.forEach((s, i) => txt(g, s, R.x + 1080, R.y + 100 + i * 36, /var\(|@container/.test(s) ? C.gold : C.fg2, fnt(500, 20, 'mono')));
  const notes = { 1: '拖分割线只改一个变量；面板里的组件看自己的宽度', 2: '拖动用指针事件；拖的过程只改 transform，松手才改布局', 3: '布局持久化到本地存储，带版本号，结构改了能迁移' }; if (notes[k]) txt(g, notes[k], R.x + 40, R.y + R.h - 30, C.gold, fnt(600, 25));
};
AN.kbd = (g, t, R, st) => {
  const k = st.k; const px = R.x + 40, py = R.y + 60; rr(g, px, py, 1000, 600, 12, 'rgba(14,20,36,.9)', C.line2);
  const focus = Math.floor(t / 2.2) % 3; const areas = [['编辑器', px + 10, py + 10, 640, 580, 'Ctrl+D 选中下一个相同词'], ['文件树', px + 660, py + 10, 330, 290, '↑↓ 移动 · → 展开 · ← 折叠'], ['面板', px + 660, py + 310, 330, 280, 'Ctrl+D 删除条目']];
  areas.forEach(([n, x, y, w, h, hint], i) => { const on = focus === i; rr(g, x, y, w, h, 8, on ? 'rgba(255,210,122,.07)' : 'rgba(255,255,255,.02)', on ? C.gold : C.line2, on ? 3 : 1.5); txt(g, n, x + 16, y + 26, on ? C.gold : C.fg3, fnt(600, 20)); if (on) txt(g, hint, x + 16, y + h - 24, C.fg2, fnt(500, 18)); });
  txt(g, '焦点所在 → 这一组快捷键生效（作用域）', px, py + 640, C.fg, fnt(600, 24));
  const notes = { 0: ['同一个 Ctrl+D：编辑器里是"选中"，面板里是"删除"', '避开浏览器自己的：Ctrl+T、Ctrl+W、Ctrl+L …'], 1: ['对话框：焦点移进去，关闭回到原来的按钮', '树：方向键上下左右', '表格：方向键移动单元格', '菜单：Esc 关闭'], 2: ['ARIA Authoring Practices 里都有定义', '<dialog> 与 popover 已内置焦点管理与关闭', '优先用原生元素'], 3: ['键盘能完整操作 → 自动化测试有确定入口', '给读屏软件的标签 = 给 AI 代理操作界面的标签'] };
  (notes[k] || []).forEach((s, i) => { g.save(); g.globalAlpha = pop(st.tk, .3 + i * .4); txt(g, '· ' + s, R.x + 1080, R.y + 110 + i * 60, C.fg2, fnt(500, 22)); g.restore(); });
};
AN.pool = (g, t, R, st) => {
  const k = st.k; node(g, R.x + 60, R.y + 80, 320, 100, '主线程', C.b, 1, '只跑界面');
  const W = 4; for (let i = 0; i < W; i++) { const x = R.x + 60 + i * 180, y = R.y + 360; const busy = Math.sin(t * 1.3 + i * 1.9) > 0; node(g, x, y, 170, 90, `Worker ${i + 1}`, busy ? C.g : C.fg3, 1, busy ? '处理中' : '空闲'); }
  txt(g, '任务队列', R.x + 500, R.y + 130, C.fg2, fnt(600, 22)); const jobs = ['解析 CSV', '建索引', 'Diff', '高亮', '压缩']; jobs.forEach((s, i) => { const X = R.x + 500 + i * 130 - ((t * 60) % 130); if (X < R.x + 440) return; tag(g, s, X, R.y + 170, C.g, CL((X - R.x - 440) / 60)); });
  arrow(g, R.x + 220, R.y + 185, R.x + 220, R.y + 350, C.fg3, 3); txt(g, '哪个空了接下一个', R.x + 240, R.y + 270, C.fg3, fnt(500, 20));
  const notes = { 1: [['postMessage', '结构化克隆：复制一份', C.fg2], ['Transferable', '所有权移过去：零拷贝，原来那边不能再用', C.g], ['SharedArrayBuffer', '两边读写同一块内存；要原子操作 + 跨域隔离', C.o]], 3: [['该搬走', '解析大文件 · 建索引 · 检索 · 压缩 · 图像 · 高亮 · Diff', C.g], ['不能搬', '任何碰 DOM 的事', C.r], ['经验法则', '超过 50 ms 的纯计算 → Worker', C.gold]] };
  (notes[k] || []).forEach(([n, d, col], i) => { g.save(); g.globalAlpha = pop(st.tk, .3 + i * .5); const y = R.y + 80 + i * 160, bx = R.x + R.w - 560; rr(g, bx, y, 540, 120, 16, 'rgba(14,20,36,.9)', col); txt(g, n, bx + 24, y + 42, col, fnt(700, 26, n.includes(' ') ? 'sans' : 'mono')); txt(g, d, bx + 24, y + 86, C.fg2, fnt(500, 18)); g.restore(); });
};
AN.storage = (g, t, R, st) => {
  const k = st.k; const L = [['IndexedDB', '键值数据库 · 到处可用 · 结构化记录', C.b], ['OPFS + SQLite Wasm', '站点私有的文件区 · Worker 内同步读写 · 完整关系数据库', C.g], ['File System Access API', '用户授权后直接读写电脑上的文件夹', C.o]];
  L.forEach(([n, d, col], i) => { const u = pop(t, .3 + i * .5); if (u <= 0) return; const y = R.y + 60 + i * 160, on = k === 0 ? i === 0 : k === 1 ? i === 1 : k === 2 ? i === 2 : true; g.save(); g.globalAlpha = u * (on ? 1 : .4); rr(g, R.x + 60, y, 900, 120, 16, 'rgba(14,20,36,.9)', col, on ? 3 : 2); txt(g, n, R.x + 90, y + 44, col, fnt(800, 30)); txt(g, d, R.x + 90, y + 88, C.fg2, fnt(500, 21)); g.restore(); });
  const codes = { 1: ['const root = await navigator.storage.getDirectory()', 'const fh = await root.getFileHandle("app.db", { create: true })', 'const h = await fh.createSyncAccessHandle()   // Worker 内', 'h.write(buf, { at: 0 }); h.flush()', '', 'const db = new sqlite3.oo1.OpfsDb("/app.db")', 'db.exec("SELECT * FROM orders WHERE status = ?", …)'], 2: ['const dir = await window.showDirectoryPicker()', 'for await (const [name, h] of dir) { … }', 'const w = await fileHandle.createWritable()', 'await w.write(text); await w.close()', '', '// 授权可持久化，下次打开不用再问'] };
  (codes[k] || []).forEach((s, i) => txt(g, s, R.x + 60, R.y + 560 + i * 34, /Sync|OpfsDb|Picker|Writable/.test(s) ? C.gold : C.fg2, fnt(500, 20, 'mono')));
  if (k === 0) txt(g, '选项按能力分三个层次', R.x + 60, R.y + 580, C.fg2, fnt(600, 24));
  const right = ['速度接近原生', '在线编辑器打开本地项目，保存回去，不经过服务器'][k - 1]; if (right) txt(g, right, R.x + 1000, R.y + 120 + (k - 1) * 160 + 60, C.gold, fnt(600, 22));
};
AN.crdt = (g, t, R, st) => {
  title(g, '两台设备各改一份，合并时谁赢？', R);
  const y = R.y + 120; ['设备 A', '设备 B'].forEach((n, i) => { const x = R.x + 60 + i * 520; node(g, x, y, 420, 80, n, C.b); txt(g, ['把"草稿"改成"已付款"', '加了一行备注'][i], x + 210, y + 120, C.fg2, fnt(500, 22), 'center'); });
  arrow(g, R.x + 270, y + 150, R.x + 500, y + 300, C.fg3, 3); arrow(g, R.x + 790, y + 150, R.x + 560, y + 300, C.fg3, 3); node(g, R.x + 330, y + 310, 400, 80, '合并', C.gold);
  const two = [['最后写入赢', '简单；后写的覆盖先写的，可能丢改动', C.o], ['CRDT', '无论什么顺序合并都得到同一结果；协同编辑器用它', C.g]];
  two.forEach(([n, d, col], i) => { const u = pop(t, 1 + i * .8); g.save(); g.globalAlpha = u; const yy = R.y + 110 + i * 180; rr(g, R.x + 1050, yy, 600, 140, 16, 'rgba(14,20,36,.9)', col); txt(g, n, R.x + 1080, yy + 48, col, fnt(800, 30)); txt(g, d, R.x + 1080, yy + 100, C.fg2, fnt(500, 20)); g.restore(); });
  const u = pop(t, 2.5); g.save(); g.globalAlpha = u; txt(g, 'A ⊕ B = B ⊕ A，(A ⊕ B) ⊕ C = A ⊕ (B ⊕ C)', R.x + 1050, R.y + 520, C.g, fnt(600, 24, 'mono')); txt(g, '交换、结合、幂等 → 不需要中心裁判', R.x + 1050, R.y + 565, C.fg3, fnt(500, 21)); g.restore();
};
AN.windows = (g, t, R, st) => {
  const k = st.k; const wins = [['窗口 1 · 列表', R.x + 60, R.y + 80], ['窗口 2 · 详情', R.x + 560, R.y + 80], ['窗口 3 · 第二块显示器', R.x + 1060, R.y + 80]];
  wins.forEach(([n, x, y], i) => { const u = pop(t, .3 + i * .4); g.save(); g.globalAlpha = u; rr(g, x, y, 460, 280, 12, 'rgba(14,20,36,.9)', C.line2); rr(g, x, y, 460, 36, [12, 12, 0, 0], 'rgba(255,255,255,.05)'); txt(g, n, x + 16, y + 18, C.fg2, fnt(600, 19)); for (let j = 0; j < 4; j++) { g.fillStyle = C.line2; g.fillRect(x + 20, y + 70 + j * 44, 300 - j * 40, 14); } g.restore(); });
  if (k >= 1) { const u = pop(st.tk, .2); const ph = (st.tk * .6) % 1; g.save(); g.globalAlpha = u; const by = R.y + 430; node(g, R.x + 460, by, 600, 80, 'BroadcastChannel("app")', C.g); wins.forEach(([n, x], i) => { arrow(g, x + 230, R.y + 365, R.x + 760 + (i - 1) * 180, by - 4, C.g, 2); }); dot(g, LERP(R.x + 290, R.x + 580, ph), LERP(R.y + 365, by, ph), 7, C.g); txt(g, '一个窗口改了数据 → 其他窗口立刻刷新', R.x + 460, by + 110, C.fg2, fnt(500, 22));
    node(g, R.x + 460, by + 160, 600, 80, 'SharedWorker', C.o, pop(st.tk, 2), '网络连接 · 缓存 · 本地数据库只有一份'); g.restore(); }
  if (k >= 2) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; rr(g, R.x + 60, R.y + 700, R.w - 120, 90, 14, 'rgba(255,178,92,.08)', C.o); txt(g, '后台标签页：定时器被节流到每秒一次，甚至冻结 → 回到前台时主动校准状态，别假设时间一直在走', R.x + 90, R.y + 745, C.fg, fnt(600, 23)); g.restore(); }
};
AN.shells = (g, t, R, st) => {
  const k = st.bi; const S = [['PWA', '浏览器安装', ['图标 · 独立窗口 · 离线 · 通知', '更新 = 刷新', '✗ 任意文件 · 全局快捷键 · 托盘'], C.g, 0], ['Tauri', 'Rust 后端 + 系统 WebView', ['包体几 MB · 内存小 · 启动快', '✗ 各系统 WebView 不一致', '要做兼容测试'], C.o, 8], ['Electron', 'Chromium + Node.js 打包', ['什么都能做 · 所有系统一致', '包体 150–250 MB · 内存几百 MB', '每个应用带一份浏览器'], C.r, 200]];
  const cw = (R.w - 80) / 3; S.forEach(([n, d, L, col, mb], i) => { const u = pop(t, .3 + i * .5); if (u <= 0) return; const x = R.x + 40 + i * cw, y = R.y + 60; const on = k === 1 ? i === 0 : k === 3 ? i === 1 : k === 6 ? true : k === 0 || k === 5; g.save(); g.globalAlpha = u * (on ? 1 : .4); rr(g, x, y, cw - 40, 440, 18, 'rgba(14,20,36,.9)', col, on ? 3 : 2); txt(g, n, x + 30, y + 56, col, fnt(900, 40)); txt(g, d, x + 30, y + 104, C.fg, fnt(600, 23)); L.forEach((s, j) => txt(g, s, x + 30, y + 170 + j * 48, s.startsWith('✗') ? C.r : C.fg2, fnt(500, 21))); txt(g, mb ? `≈ ${mb} MB` : '0 MB', x + 30, y + 380, col, fnt(700, 30, 'mono')); g.restore(); });
  const notes = { 0: '能力依次增强，代价依次增大', 5: '分发与更新：签名 · 公证 · 自动更新 · 增量下载 —— PWA 里浏览器替你做，壳里自己搭', 6: '先问 PWA 够不够 → 再问 Tauri 够不够 → 最后才是 Electron' }; if (notes[k]) txt(g, notes[k], R.x + 40, R.y + 580, C.gold, fnt(600, 26));
  if (k === 6) { const u = pop(st.tk, 1); g.save(); g.globalAlpha = u; txt(g, '能力越强 → 包体越大 → 攻击面越大', R.x + 40, R.y + 640, C.fg2, fnt(600, 24)); g.restore(); }
};
AN.electron = (g, t, R, st) => {
  const k = st.bi >= 4 ? 1 : 0; const rx = R.x + R.w - 560, mid = (R.x + 560 + rx) / 2; node(g, R.x + 60, R.y + 100, 500, 240, '渲染进程', C.b, 1, '跑网页 · Chromium'); node(g, rx, R.y + 100, 500, 240, '主进程', C.o, 1, 'Node.js · 系统能力 · 窗口');
  const ph = (t * .5) % 1; arrow(g, R.x + 570, R.y + 200, rx - 10, R.y + 200, C.fg3, 3); arrow(g, rx - 10, R.y + 250, R.x + 570, R.y + 250, C.fg3, 3); dot(g, LERP(R.x + 580, rx - 20, ph), R.y + 200, 7, C.b); dot(g, LERP(rx - 20, R.x + 580, ph), R.y + 250, 7, C.o); txt(g, 'IPC', mid, R.y + 170, C.fg2, fnt(600, 22), 'center');
  if (k >= 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; node(g, mid - 200, R.y + 300, 400, 90, 'preload.js', C.gold, 1, '只暴露白名单方法'); arrow(g, mid, R.y + 395, mid, R.y + 460, C.gold, 3);
    ['// preload.js', 'contextBridge.exposeInMainWorld("api", {', '  openFile: () => ipcRenderer.invoke("open-file"),', '  save: (p, data) => ipcRenderer.invoke("save", p, data),', '})', '// 网页里只能用 window.api.openFile()，碰不到 Node'].forEach((s, i) => txt(g, s, R.x + 60, R.y + 500 + i * 34, /contextBridge|碰不到/.test(s) ? C.gold : C.fg2, fnt(500, 19, 'mono')));
    [['contextIsolation: true', '网页和预加载脚本的世界隔开'], ['nodeIntegration: false', '渲染进程里没有 require'], ['Content-Security-Policy', '不执行来路不明的脚本']].forEach(([a, b], i) => { const y = R.y + 500 + i * 80, bx = R.x + R.w - 600; rr(g, bx, y, 580, 66, 12, 'rgba(14,20,36,.9)', C.g); txt(g, a, bx + 24, y + 24, C.g, fnt(600, 20, 'mono')); txt(g, b, bx + 24, y + 50, C.fg3, fnt(500, 18)); }); g.restore(); }
  else { txt(g, '渲染进程里跑的是网页 —— 网页能被注入', R.x + 60, R.y + 420, C.fg2, fnt(600, 24)); txt(g, '所以渲染进程不能直接碰 Node 和系统', R.x + 60, R.y + 465, C.fg3, fnt(500, 22)); }
};
AN.mono = (g, t, R, st) => {
  const k = st.k; if (k === 0) { title(g, '单一仓库（pnpm workspace）', R); const tree = [['apps/', 0], ['  admin/', 1], ['  editor/', 1], ['packages/', 0], ['  ui/          ← 改这里', 1], ['  domain/', 1], ['  workers/', 1], ['pnpm-workspace.yaml', 0]]; tree.forEach(([s, d], i) => txt(g, s, R.x + 60, R.y + 120 + i * 40, /ui\//.test(s) ? C.gold : d ? C.fg2 : C.fg, fnt(500, 23, 'mono')));
    const ph = (t * .4) % 1; ['admin', 'editor'].forEach((a, i) => { const x = R.x + 800 + i * 400, y = R.y + 160; node(g, x, y, 320, 90, 'apps/' + a, C.b); arrow(g, R.x + 420, R.y + 280, x + 160, y + 95, C.gold, 2.5); const ok = ph > .5 + i * .2; txt(g, ok ? '✓ 测试通过' : '跑测试…', x + 160, y + 130, ok ? C.g : C.fg3, fnt(600, 22), 'center'); }); txt(g, '改一个公共包 → 所有用到它的应用同时跑测试', R.x + 800, R.y + 360, C.fg2, fnt(600, 23)); txt(g, '不会出现"改了库忘了升级应用"', R.x + 800, R.y + 405, C.fg3, fnt(500, 21)); }
  if (k === 1) { title(g, '设计令牌', R); const dark = Math.floor(st.tk / 2.5) % 2; const tok = [['--color-bg', dark ? '#0E1424' : '#FFFFFF'], ['--color-fg', dark ? '#E9EEF7' : '#111827'], ['--color-accent', '#5CB4FF'], ['--space-3', '12px'], ['--font-size-body', '15px']]; tok.forEach(([n, v], i) => { txt(g, n, R.x + 60, R.y + 120 + i * 44, C.gold, fnt(500, 22, 'mono')); txt(g, v, R.x + 460, R.y + 120 + i * 44, C.fg2, fnt(500, 22, 'mono')); if (v.startsWith('#')) rr(g, R.x + 660, R.y + 106 + i * 44, 28, 28, 6, v, C.line2); });
    const x = R.x + 900, y = R.y + 110; rr(g, x, y, 700, 320, 14, dark ? '#0E1424' : '#FFFFFF', C.line2); txt(g, dark ? '深色模式' : '浅色模式', x + 24, y + 36, dark ? '#E9EEF7' : '#111827', fnt(700, 24)); rr(g, x + 24, y + 70, 200, 48, 10, '#5CB4FF'); txt(g, '主按钮', x + 124, y + 94, '#000', fnt(600, 20), 'center'); for (let j = 0; j < 3; j++) { g.fillStyle = dark ? '#2C3854' : '#E5E7EB'; g.fillRect(x + 24, y + 150 + j * 40, 500 - j * 80, 14); }
    txt(g, '换主题 = 换一组变量；设计工具与代码共用同一份令牌', R.x + 60, R.y + 400, C.fg2, fnt(600, 23)); }
  if (k === 2) { title(g, '测试分层与可观测性', R); const L = [['单元测试', '领域层 · Vitest', '快，几千个，每次保存跑', C.g], ['组件测试', 'Vitest Browser Mode', '真实浏览器里渲染组件', C.b], ['端到端', 'Playwright', '真的点一遍关键路径，少而准', C.o]]; L.forEach(([n, tool, d, col], i) => { const u = pop(st.tk, .3 + i * .4); g.save(); g.globalAlpha = u; const w = 900 - i * 220, x = R.x + 60 + i * 110, y = R.y + 110 + i * 120; rr(g, x, y, w, 100, 14, 'rgba(14,20,36,.9)', col); txt(g, n, x + 26, y + 38, col, fnt(700, 26)); txt(g, tool, x + 26, y + 74, C.fg3, fnt(500, 19, 'mono')); txt(g, d, x + 300, y + 52, C.fg2, fnt(500, 21)); g.restore(); });
    const u = pop(st.tk, 1.6); g.save(); g.globalAlpha = u; rr(g, R.x + 1060, R.y + 110, 580, 340, 16, 'rgba(14,20,36,.9)', C.p); txt(g, '可观测性', R.x + 1090, R.y + 160, C.p, fnt(700, 28)); ['错误上报（带版本、用户环境）', '性能数据（INP / 长帧 / 内存）', '用户行为（会话回放）', '线上发生的事要能回放'].forEach((s, i) => txt(g, '· ' + s, R.x + 1090, R.y + 215 + i * 48, i === 3 ? C.gold : C.fg2, fnt(500, 22))); g.restore(); }
};
AN.aiflow = (g, t, R, st) => {
  const k = st.k; const steps = [['AI 代理写代码', C.p], ['类型检查', C.b], ['Oxlint', C.g], ['测试', C.o], ['人审差异', C.gold]];
  steps.forEach(([n, col], i) => { const x = R.x + 40 + i * 330, y = R.y + 100; const on = k === 0 ? i === 0 : k === 1 ? i >= 1 && i <= 3 : true; node(g, x, y, 290, 90, n, col, pop(t, .3 + i * .3) * (on ? 1 : .35)); if (i) arrow(g, x - 40 + 4, y + 45, x - 6, y + 45, C.fg3, 3, 10); });
  const ph = (t * .5) % 1; const ok = ph > .5; if (k >= 1) { dot(g, R.x + 40 + Math.min(4, Math.floor(ph * 6)) * 330 + 145, R.y + 215, 10, ok ? C.g : C.r); }
  if (k === 0) { const u = pop(t, 1.5); g.save(); g.globalAlpha = u; txt(g, '瓶颈换了位置：写得快了，审得慢了', R.x + 40, R.y + 280, C.gold, fnt(700, 30)); txt(g, '理解债：团队产出代码的速度超过理解它的速度', R.x + 40, R.y + 335, C.fg2, fnt(500, 24));
    const x0 = R.x + 40, y0 = R.y + 640, W = 700; line(g, [[x0, y0], [x0 + W, y0]], C.line2, 2); [['写代码', [20, 25, 30, 60, 110, 170]], ['审查代码', [20, 24, 28, 33, 38, 42]]].forEach(([n, v], j) => { g.strokeStyle = j ? C.o : C.p; g.lineWidth = 4; g.beginPath(); v.forEach((y, i) => { const X = x0 + i * W / 5, Y = y0 - y * 1.3; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }); g.stroke(); txt(g, n + '的速度', x0 + W + 14, y0 - v[5] * 1.3, j ? C.o : C.p, fnt(600, 20)); }); txt(g, '2023 → 2026（示意）', x0, y0 + 26, C.fg3, fnt(500, 18)); g.restore(); }
  if (k === 1) { [['类型', '必须通过类型检查，接口形状由契约定'], ['代码检查', 'Oxlint：22 条配合 React Compiler 的规则'], ['测试', '没有测试覆盖的改动不合并']].forEach(([n, d], i) => { g.save(); g.globalAlpha = pop(st.tk, .3 + i * .5); const y = R.y + 280 + i * 120; rr(g, R.x + 40, y, 1000, 96, 14, 'rgba(14,20,36,.9)', [C.b, C.g, C.o][i]); txt(g, `第 ${i + 1} 道 · ${n}`, R.x + 66, y + 36, C.fg, fnt(700, 24)); txt(g, d, R.x + 66, y + 72, C.fg3, fnt(500, 20)); g.restore(); }); txt(g, '护栏做成自动的，人只看最后的差异', R.x + 40, R.y + 680, C.gold, fnt(700, 26)); }
  if (k === 2) { ['分层清楚 → AI 写的界面代码不容易把业务逻辑写错位置', '命令模式 → 每个功能有确定的入口，改一个不碰别的', '类型 + 测试 → 改错了立刻知道'].forEach((s, i) => { g.save(); g.globalAlpha = pop(st.tk, .3 + i * .5); txt(g, '· ' + s, R.x + 40, R.y + 300 + i * 64, C.fg2, fnt(500, 24)); g.restore(); }); }
  if (k === 3) { ['$ vp run --sandbox codex  "pnpm test"', '', '代理自己：装依赖 → 跑测试 → 看结果', '人：只看最终的差异'].forEach((s, i) => txt(g, s, R.x + 40, R.y + 300 + i * 50, i === 0 ? C.gold : C.fg2, fnt(500, 23, i === 0 ? 'mono' : 'sans'))); }
};
AN.final = (g, t, R, st) => {
  const k = st.k; const cw = (R.w - 80) / 3;
  [['上集 · 地图', C.b], ['中集 · 闭环', C.g], ['下集 · 架构', C.o]].forEach(([n, col], i) => { const x = R.x + 40 + i * cw, y = R.y + 40, on = k >= i; g.save(); g.globalAlpha = on ? 1 : .25; rr(g, x, y, cw - 40, 720, 20, 'rgba(14,20,36,.9)', col, on ? 3 : 2); txt(g, n, x + 30, y + 50, col, fnt(800, 32));
    if (i === 0) { ['工程', '框架', '语言', '平台'].forEach((s, j) => { rr(g, x + 40, y + 110 + j * 130, cw - 120, 110, 14, 'rgba(255,255,255,.04)', [C.o, C.p, C.b, C.fg3][j]); txt(g, s, x + 70, y + 150 + j * 130, C.fg, fnt(700, 26)); txt(g, ['工具链 · 供应链', '反应式 · 状态 · 渲染位置', 'TypeScript · CSS', '事件循环 · 渲染流水线'][j], x + 70, y + 190 + j * 130, C.fg3, fnt(500, 19)); }); }
    if (i === 1) { cycle(g, on ? t : 0, R, ['度量', '找最慢的一层', '改', '再度量'], -1, x + (cw - 40) / 2, y + 330, 170); txt(g, '放进流水线，不靠突击', x + (cw - 40) / 2, y + 620, C.fg2, fnt(600, 22), 'center'); }
    if (i === 2) { const cx = x + (cw - 40) / 2, cy = y + 330; [['界面', 230, C.b], ['应用', 160, C.p], ['领域', 90, C.gold]].forEach(([s, r, c2]) => { g.strokeStyle = c2; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke(); txt(g, s, cx, cy - r + 24, c2, fnt(700, 22), 'center'); }); txt(g, '重活在 Worker · 数据在本地', cx, y + 600, C.fg2, fnt(600, 21), 'center'); txt(g, '壳只做壳该做的事', cx, y + 640, C.fg2, fnt(600, 21), 'center'); }
    g.restore(); });
};
