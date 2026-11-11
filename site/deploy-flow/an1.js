// 第一集动画：从一台服务器到流水线（初创公司）
const cxR = R => R.x + R.w / 2;
function laptop(g, x, y, s = 1, col = C.b, scr = '') { rr(g, x - 90 * s, y - 70 * s, 180 * s, 115 * s, 10 * s, 'rgba(14,20,36,.96)', col, 3); rr(g, x - 115 * s, y + 45 * s, 230 * s, 16 * s, 6 * s, col); if (scr) txt(g, scr, x, y - 12 * s, C.fg2, fnt(700, 22 * s, 'mono'), 'center'); }
function userIco(g, x, y, col = C.fg2, s = 1) { person(g, x, y, col, s); }

AN.open = (g, t, R, st) => {
  const cx = cxR(R);
  if (st.k === 0) {
    stars(g, R, t, 90, .5);
    al(g, pop(t, .2), () => { txt(g, '02:00', R.x + 40, R.y + 60, C.fg3, fnt(800, 64, 'mono')); });
    laptop(g, R.x + 300, R.y + 420, 1.2, C.b, 'git push');
    const u = pop(st.tk, 1.2, 1.4);
    al(g, pop(st.tk, .8), () => { arrow(g, R.x + 460, R.y + 420, R.x + 460 + 300 * u, R.y + 420, C.gold, 4, 16); });
    server(g, cx - 40, R.y + 300, 170, 240, '线上服务器', u > .99 ? C.bad : C.b, 1, 'v2', u > .99 ? C.bad : C.gold);
    for (let i = 0; i < 6; i++) al(g, pop(st.tk, 3 + i * .6), () => { const x = cx + 320 + (i % 3) * 170, y = R.y + 230 + Math.floor(i / 3) * 220; userIco(g, x, y + 40, C.fg2); rr(g, x - 60, y - 70, 120, 50, 10, 'rgba(255,107,107,.15)', C.bad, 2); txt(g, i % 2 ? '打不开' : '500', x, y - 45, C.bad, fnt(800, 24, 'mono'), 'center'); });
    al(g, pop(st.tk, 7), () => txt(g, '上一个能用的版本在哪？', cx + 20, R.y + 690, C.gold, fnt(800, 36), 'center'));
    return;
  }
  const items = [['代码', '工程师写好的', C.b], ['部署', '变成线上服务', C.gold], ['用户', '正在使用', C.g]];
  const w = 360, gap = 140, x0 = cx - (3 * w + 2 * gap) / 2;
  items.forEach(([a, b, col], i) => al(g, pop(st.tk, .3 + i * .7), () => { const x = x0 + i * (w + gap), y = R.y + 220; rr(g, x, y, w, 200, 20, i === 1 ? 'rgba(255,210,122,.1)' : 'rgba(14,20,36,.94)', col, i === 1 ? 4 : 2.5); txt(g, a, x + w / 2, y + 80, col, fnt(800, 52, 'serif'), 'center'); txt(g, b, x + w / 2, y + 145, C.fg2, fnt(600, 26), 'center'); if (i < 2) arrow(g, x + w + 14, y + 100, x + w + gap - 14, y + 100, C.fg3, 4, 16); }));
  al(g, pop(st.tk, 3.5), () => { const x = x0 + w + gap + w / 2; for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * .32, r = 150 + 10 * Math.sin(t * 3 + i); dot(g, x + Math.cos(a) * r * 1.3, R.y + 320 + 260 + Math.sin(a) * -r * .4, 9, C.bad); } txt(g, '线上故障最集中的环节', x, R.y + 560, C.bad, fnt(800, 34), 'center'); });
  al(g, pop(st.tk, 6), () => { const tags = ['初创公司', '大厂', '电商', '金融', '游戏', '移动端', 'SaaS', '跨国']; let x = cx - 640; tags.forEach((s, i) => { x += chip(g, s, x, R.y + 700, [C.b, C.p, C.gold, C.o, C.r, C.g, C.b, C.p][i], pop(st.tk, 6 + i * .2)) + 18; }); });
};
AN.epcards = (g, t, R, st) => { epCards(g, R, t, -1, i => pop(t, .3 + i * .5)); };

AN.pipe = (g, t, R, st) => {
  const L = [['源代码', 'Git 仓库', C.b], ['构建', '编译 · 打包', C.p], ['制品', '可运行的产物', C.gold], ['上线', '放到服务器', C.o], ['观察', '监控是否正常', C.g]];
  const ph = st.k === 0 ? CL((st.tk - .5) / 2.2, 0, 4.99) : 5;
  const X = stages(g, R.x + 20, R.y + 60, R.w - 40, 140, L, ph);
  if (st.k === 0) { const u = CL((st.tk - .5) / 11); packet(g, [[X(0), R.y + 240], [X(4), R.y + 240]], u, C.gold, 12);
    al(g, pop(st.tk, 4), () => { fileIco(g, X(2) - 50, R.y + 300, 100, 120, 'app.tar', C.gold); txt(g, '构建一次，到处使用', X(2), R.y + 460, C.fg2, fnt(600, 24), 'center'); }); return; }
  // 部署 vs 发布
  const y = R.y + 300;
  al(g, pop(st.tk, .3), () => { rr(g, R.x + 40, y, R.w / 2 - 70, 420, 18, 'rgba(14,20,36,.9)', C.o, 2.5); txt(g, '部署 Deploy', R.x + 70, y + 44, C.o, fnt(800, 34)); txt(g, '新版本已经在机器上运行', R.x + 70, y + 92, C.fg2, fnt(600, 24));
    [0, 1, 2].forEach(i => server(g, R.x + 90 + i * 220, y + 150, 150, 170, '', C.o, 1, 'v2', C.gold)); });
  const sw = pop(st.tk, 5, .6);
  al(g, pop(st.tk, 2), () => { const x = R.x + R.w / 2 + 30; rr(g, x, y, R.w / 2 - 70, 420, 18, 'rgba(14,20,36,.9)', C.g, 2.5); txt(g, '发布 Release', x + 30, y + 44, C.g, fnt(800, 34)); txt(g, '用户真正用到新功能', x + 30, y + 92, C.fg2, fnt(600, 24));
    rr(g, x + 40, y + 170, 120, 60, 30, sw > .5 ? C.g : C.line2); dot(g, x + 70 + 60 * sw, y + 200, 24, C.fg); txt(g, sw > .5 ? '开' : '关', x + 100, y + 270, C.fg2, fnt(700, 24), 'center');
    for (let i = 0; i < 8; i++) { const ux = x + 260 + (i % 4) * 110, uy = y + 170 + Math.floor(i / 4) * 130; userIco(g, ux, uy + 20, C.fg2, .9); chip(g, sw > .5 ? '新' : '旧', ux - 24, uy + 76, sw > .5 ? C.g : C.fg3, 1, 18); } });
  al(g, pop(st.tk, 7), () => txt(g, '把两件事拆开：先部署，再决定何时发布', cxR(R), R.y + R.h - 40, C.gold, fnt(800, 32), 'center'));
};

AN.dora = (g, t, R, st) => {
  if (st.k === 0) {
    const M = [['部署频率', '多久部署一次', C.b, '速度'], ['变更前置时间', '从提交到上线', C.b, '速度'], ['变更失败率', '上线引发故障的比例', C.g, '稳定'], ['故障恢复时间', '出事后多久恢复', C.g, '稳定']];
    const w = (R.w - 60) / 2, h = 250;
    M.forEach(([a, b, col, tg], i) => al(g, pop(st.tk, .4 + i * 1.2), () => { const x = R.x + (i % 2) * (w + 60), y = R.y + 40 + Math.floor(i / 2) * (h + 40); rr(g, x, y, w, h, 18, 'rgba(14,20,36,.94)', col, 2.5); tag(g, tg, x + 30, y + 46, col); txt(g, a, x + 30, y + 120, C.fg, fnt(800, 44, 'serif')); txt(g, b, x + 30, y + 185, C.fg2, fnt(600, 26)); }));
    al(g, pop(st.tk, 9), () => txt(g, '优秀的团队：又快又稳', R.x + R.w / 2, R.y + 700, C.gold, fnt(800, 36), 'center'));
    return;
  }
  const rows = [['每月一次大部署', 1, 60, C.bad], ['每天多次小部署', 30, 2, C.ok]];
  rows.forEach(([nm, n, sz, col], r) => al(g, pop(st.tk, .3 + r * 1.5), () => { const y = R.y + 120 + r * 300; txt(g, nm, R.x + 20, y, C.fg, fnt(800, 32));
    const x0 = R.x + 20, W = R.w - 60; line(g, [[x0, y + 140], [x0 + W, y + 140]], C.line2, 2);
    for (let i = 0; i < n; i++) { const x = x0 + (i + .5) * W / n, hh = r ? 30 : 160, u = pop(st.tk, .6 + r * 1.5 + i * .05, .4); rr(g, x - (r ? 10 : 70), y + 140 - hh * u, r ? 20 : 140, hh * u, 6, col + (r ? 'cc' : '88')); }
    txt(g, r ? '每次改动小，出问题好定位、好回退' : '一次几百个改动，出问题很难找', R.x + 20, y + 190, col, fnt(700, 26)); }));
};

AN.ftp = (g, t, R, st) => {
  const lx = R.x + 180, sx = R.x + R.w - 300, y = R.y + 330;
  laptop(g, lx, y, 1.1, C.b, 'FTP');
  server(g, sx - 90, y - 160, 180, 260, '网站服务器', C.o);
  const files = ['index.php', 'cart.php', 'pay.php', 'user.php', 'style.css'];
  if (st.k === 0) { files.forEach((f, i) => { const u = CL((st.tk - 1 - i * 1.4) / 1.2); if (u <= 0) return; const x = LERP(lx + 120, sx - 160, SS(u)), yy = y - 60 - Math.sin(u * Math.PI) * 120; fileIco(g, x - 50, yy - 30, 100, 60, f, C.b, 1); });
    al(g, pop(st.tk, 8.5), () => { chip(g, '或者：ssh 登录，直接在线上改', lx - 120, y + 230, C.r, 1, 26); }); return; }
  // 半新半旧
  files.forEach((f, i) => { const nw = i < 3; const xx = R.x + 520 + i * 150; fileIco(g, xx, R.y + 560, 120, 70, f, nw ? C.g : C.fg3, pop(st.tk, .3 + i * .2)); al(g, pop(st.tk, .3 + i * .2), () => txt(g, nw ? 'v2' : 'v1', xx + 60, R.y + 660, nw ? C.g : C.fg3, fnt(800, 24, 'mono'), 'center')); });
  al(g, pop(st.tk, 2.5), () => { userIco(g, R.x + 320, R.y + 620, C.fg); txt(g, '？', R.x + 380, R.y + 560, C.bad, fnt(900, 60, 'serif')); txt(g, '拼凑出来的版本', R.x + 300, R.y + 720, C.bad, fnt(700, 24), 'center'); });
  al(g, pop(st.tk, 5.5), () => { chip(g, '谁改的？', R.x + 560, R.y + 760, C.o, 1, 24); chip(g, '怎么退回去？', R.x + 760, R.y + 760, C.o, 1, 24); });
};

AN.works = (g, t, R, st) => {
  const cols = [['我的电脑', [['Python', '3.12'], ['依赖库', '2.1'], ['配置', 'dev.env']], C.ok, true], ['服务器', [['Python', '3.8'], ['依赖库', '1.9'], ['配置', '（缺失）']], C.bad, false]];
  const w = (R.w - 160) / 2;
  cols.forEach(([nm, rows, col, ok], i) => al(g, pop(t, .4 + i * 1.5), () => { const x = R.x + i * (w + 160), y = R.y + 60; rr(g, x, y, w, 560, 20, 'rgba(14,20,36,.94)', col, 2.5); txt(g, nm, x + 40, y + 60, C.fg, fnt(800, 40, 'serif'));
    rows.forEach(([a, b], j) => { const yy = y + 160 + j * 110; txt(g, a, x + 50, yy, C.fg2, fnt(600, 30)); txt(g, b, x + w - 50, yy, i && j < 2 ? C.bad : C.fg, fnt(800, 32, 'mono'), 'right'); line(g, [[x + 40, yy + 45], [x + w - 40, yy + 45]], C.line, 1); });
    const u = pop(t, 2.5 + i * 1.5); if (ok) ticks(g, x + w / 2 - 30, y + 500, u, C.ok); else cross(g, x + w / 2, y + 500, u, C.bad, 22); }));
  al(g, pop(t, 6), () => { txt(g, '“在我电脑上是好的呀”', R.x + R.w / 2, R.y + 720, C.gold, fnt(800, 40, 'serif'), 'center'); });
};

AN.symlink = (g, t, R, st) => {
  const x = R.x + 40, y = R.y + 70;
  txt(g, '/srv/app/', x, y, C.fg2, fnt(700, 30, 'mono')); txt(g, 'releases/', x + 40, y + 70, C.fg2, fnt(700, 30, 'mono'));
  const rel = ['20120730_1405', '20120801_0930', '20120802_1610'];
  rel.forEach((r, i) => al(g, i < 2 ? 1 : pop(t, 2, .8), () => { const yy = y + 150 + i * 90; rr(g, x + 80, yy - 32, 400, 64, 12, 'rgba(14,20,36,.95)', i === 2 ? C.g : C.line2, 2); txt(g, r, x + 110, yy, i === 2 ? C.g : C.fg2, fnt(700, 26, 'mono')); }));
  al(g, pop(t, 2.8), () => txt(g, '← 新版本先放进新目录，装好依赖', x + 500, y + 330, C.fg3, fnt(600, 22)));
  const cyy = y + 520; txt(g, 'current', x + 110, cyy, C.gold, fnt(800, 34, 'mono')); rr(g, x + 80, cyy - 36, 200, 72, 14, null, C.gold, 3);
  // 指向：t<6 指 1；6..11 指 2；之后回滚到 1
  const toT = (k) => y + 150 + k * 90;
  const s1 = pop(t, 6, .5), s2 = pop(t, 12.5, .5);
  const ty = LERP(LERP(toT(1), toT(2), s1), toT(1), s2);
  g.save(); g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 280, cyy); g.bezierCurveTo(x + 620, cyy, x + 620, ty, x + 480 + 10, ty); g.stroke(); g.restore(); arrow(g, x + 520, ty, x + 486, ty, C.gold, 4, 14);
  al(g, s1 * (1 - s2), () => txt(g, '一步切换（原子操作）', x + 680, cyy - 40, C.gold, fnt(800, 32)));
  al(g, s2, () => txt(g, '回滚：指回旧目录', x + 680, cyy - 40, C.o, fnt(800, 32)));
};

AN.tests = (g, t, R, st) => {
  const cx = R.x + 420, by = R.y + 680, L = [['端到端测试', '少 · 慢', C.r, 10], ['集成测试', '中', C.o, 40], ['单元测试', '多 · 快', C.g, 300]];
  L.slice().reverse().forEach(([nm, sub, col], j) => { const i = 2 - j; al(g, pop(t, .4 + j * 1.2), () => { const h = 170, y = by - (j + 1) * h, wb = 760 - j * 230, wt = 760 - (j + 1) * 230; g.save(); g.beginPath(); g.moveTo(cx - wb / 2, y + h); g.lineTo(cx + wb / 2, y + h); g.lineTo(cx + wt / 2, y + 8); g.lineTo(cx - wt / 2, y + 8); g.closePath(); g.fillStyle = col + '30'; g.fill(); g.strokeStyle = col; g.lineWidth = 2.5; g.stroke(); g.restore(); txt(g, nm, cx, y + h / 2 + 4, C.fg, fnt(800, j === 2 ? 22 : 30), 'center'); txt(g, sub, cx + wb / 2 + 30, y + h / 2, col, fnt(700, 26)); }); });
  if (st.k >= 1) { const x = R.x + R.w - 560, y = R.y + 80; al(g, pop(st.tk, .3), () => { rr(g, x, y, 540, 560, 18, 'rgba(14,20,36,.95)', C.b, 2.5); txt(g, '合并请求 #128', x + 30, y + 50, C.fg, fnt(800, 32)); });
    [['单元测试 312 项', 1.2], ['集成测试 41 项', 2.2], ['端到端测试 8 项', 3.2], ['同事审查：已批准', 6]].forEach(([s, d], i) => al(g, pop(st.tk, .5), () => check(g, x + 40, y + 140 + i * 90, s, pop(st.tk, d), C.ok, 26)));
    al(g, pop(st.tk, 7.5), () => { rr(g, x + 40, y + 470, 460, 60, 14, C.ok); txt(g, '可以合并', x + 270, y + 500, '#0B1020', fnt(800, 28), 'center'); }); }
};

AN.trunk = (g, t, R, st) => {
  const x0 = R.x + 40, x1 = R.x + R.w - 60, y1 = R.y + 160, y2 = R.y + 520;
  txt(g, '长期功能分支', x0, y1 - 80, C.r, fnt(800, 30)); line(g, [[x0, y1], [x1, y1]], C.fg2, 5);
  const u1 = pop(t, .5, 4); g.save(); g.strokeStyle = C.r; g.lineWidth = 4; g.beginPath(); g.moveTo(x0 + 80, y1); g.bezierCurveTo(x0 + 160, y1 + 100, x0 + 300, y1 + 100, LERP(x0 + 300, x1 - 300, u1), y1 + 100); g.stroke(); g.restore();
  for (let i = 0; i < 8; i++) if (u1 > i / 8) dot(g, x0 + 300 + (x1 - 600 - x0) * i / 8, y1 + 100, 8, C.r);
  al(g, pop(t, 4.6), () => { line(g, [[x1 - 300, y1 + 100], [x1 - 200, y1]], C.r, 4); txt(g, '冲突 ×37', x1 - 200, y1 + 60, C.bad, fnt(800, 30, 'mono')); });
  txt(g, '主干开发', x0, y2 - 80, C.g, fnt(800, 30)); line(g, [[x0, y2], [x1, y2]], C.fg2, 5);
  for (let i = 0; i < 9; i++) al(g, pop(t, 6 + i * .5, .4), () => { const x = x0 + 90 + i * (x1 - x0 - 180) / 9; g.save(); g.strokeStyle = C.g; g.lineWidth = 3.5; g.beginPath(); g.moveTo(x, y2); g.quadraticCurveTo(x + 40, y2 + 70, x + 100, y2); g.stroke(); g.restore(); dot(g, x + 100, y2, 8, C.g); });
  al(g, pop(t, 11), () => { chip(g, '每天合并小改动', x0, y2 + 150, C.g, 1, 26); chip(g, '没做完的功能：先用开关藏起来', x0 + 300, y2 + 150, C.gold, 1, 26); });
};

AN.ci = (g, t, R, st) => {
  const L = [['git push', '工程师', C.b], ['测试', '自动运行', C.p], ['构建', '打包镜像', C.gold], ['部署', '自动上线', C.g]];
  const ph = CL((t - .6) / 2.4, 0, 3.99) + (t > 10.5 ? 1 : 0);
  const X = stages(g, R.x + 10, R.y + 120, R.w - 20, 160, L, ph, { fs: 32 });
  packet(g, [[X(0), R.y + 330], [X(3), R.y + 330]], CL((t - .6) / 9.6), C.gold, 12);
  al(g, pop(t, 3), () => { const x = X(1) - 140, y = R.y + 400; rr(g, x, y, 280, 230, 14, 'rgba(14,20,36,.95)', C.p, 2); ['✓ 单元测试', '✓ 集成测试', '✓ 代码风格'].forEach((s, i) => txt(g, s, x + 30, y + 50 + i * 60, C.ok, fnt(700, 26))); });
  al(g, pop(t, 11), () => txt(g, '整串步骤 = 流水线（Pipeline）', R.x + R.w / 2, R.y + 720, C.gold, fnt(800, 34), 'center'));
};

AN.container = (g, t, R, st) => {
  const x = R.x + 60, y = R.y + 120, w = 420;
  const layers = [['应用代码', C.g], ['依赖库', C.b], ['运行时', C.p], ['系统基础层', C.fg3]];
  layers.forEach(([s, col], i) => al(g, pop(t, .3 + i * .7), () => { rr(g, x + 20, y + 40 + i * 100, w - 40, 84, 12, col + '30', col, 2); txt(g, s, x + w / 2, y + 82 + i * 100, C.fg, fnt(700, 28), 'center'); }));
  al(g, pop(t, 3.2), () => { rr(g, x, y, w, 470, 20, null, C.gold, 4); txt(g, '容器镜像 app:3f9a', x + w / 2, y + 520, C.gold, fnt(800, 28, 'mono'), 'center'); });
  const envs = ['开发机', '测试环境', '生产环境'];
  envs.forEach((e, i) => { const u = pop(t, 5 + i * 1.2, 1), ex = x + w + 160 + i * 260 * (R.w > 1400 ? 1.1 : .9), ey = y + 160;
    al(g, u, () => { rr(g, ex - 10, ey - 40, 220, 300, 16, 'rgba(14,20,36,.9)', C.line2, 2); txt(g, e, ex + 100, ey + 290, C.fg2, fnt(700, 24), 'center'); rr(g, ex + 30, ey, 140, 200, 12, 'rgba(255,210,122,.08)', C.gold, 3); txt(g, '3f9a', ex + 100, ey + 100, C.gold, fnt(800, 30, 'mono'), 'center'); }); });
  al(g, pop(t, 9), () => txt(g, '同一个镜像，到处一样', x + w + 160, y + 600, C.fg, fnt(800, 32)));
};

AN.paas = (g, t, R, st) => {
  const x = R.x + 30, y = R.y + 80;
  laptop(g, x + 130, y + 180, 1, C.b, 'git push');
  al(g, pop(t, .8), () => arrow(g, x + 260, y + 180, x + 400, y + 180, C.gold, 4, 14));
  al(g, pop(t, 1), () => { rr(g, x + 420, y + 40, 520, 340, 24, 'rgba(92,180,255,.06)', C.b, 2.5); txt(g, '托管平台', x + 680, y + 90, C.b, fnt(800, 32), 'center');
    ['构建', '上线', '域名', 'HTTPS 证书'].forEach((s, i) => check(g, x + 470 + (i % 2) * 240, y + 180 + Math.floor(i / 2) * 90, s, pop(t, 2 + i * .8), C.ok, 26)); });
  al(g, pop(t, 6.5), () => { txt(g, '每个合并请求一个预览网址', x, y + 470, C.fg, fnt(800, 30));
    ['pr-41', 'pr-42', 'pr-43'].forEach((p, i) => al(g, pop(t, 7 + i * .6), () => { const yy = y + 530 + i * 70; rr(g, x, yy, 560, 54, 12, 'rgba(14,20,36,.95)', C.g, 2); txt(g, `https://${p}.preview.myapp.dev`, x + 24, yy + 27, C.g, fnt(600, 22, 'mono')); })); });
  al(g, pop(t, 10), () => { userIco(g, x + 700, y + 620, C.gold, 1.1); txt(g, '产品经理点开就能看', x + 760, y + 610, C.fg2, fnt(600, 24)); });
};

AN.freq = (g, t, R, st) => {
  if (st.k === 0) {
    const x0 = R.x + 30, W = R.w - 60;
    [['以前', 1, C.bad, '挑日子 · 全员待命'], ['现在', 60, C.ok, '每天好几次 · 谁都能做']].forEach(([nm, n, col, sub], r) => al(g, pop(st.tk, .4 + r * 2), () => {
      const y = R.y + 100 + r * 320; txt(g, nm, x0, y, col, fnt(800, 34)); txt(g, sub, x0 + 120, y, C.fg2, fnt(600, 26));
      for (let d = 0; d < 20; d++) rr(g, x0 + d * W / 20 + 4, y + 50, W / 20 - 8, 120, 8, 'rgba(14,20,36,.9)', C.line, 1);
      if (r === 0) { rr(g, x0 + 14 * W / 20 + 4, y + 50, W / 20 - 8, 120, 8, col + '66', col, 2); txt(g, '大版本', x0 + 14.5 * W / 20, y + 200, col, fnt(700, 22), 'center'); }
      else for (let i = 0; i < n; i++) { const d = Math.floor(HSH(i, 3) * 20), k = HSH(i, 4); al(g, pop(st.tk, 2.5 + i * .05, .3), () => dot(g, x0 + d * W / 20 + 14 + HSH(i, 5) * (W / 20 - 28), y + 70 + k * 90, 7, col)); }
    }));
    return;
  }
  const x = R.x + 40, y = R.y + 100;
  fileIco(g, x, y, 260, 320, '', C.b); txt(g, 'package-lock.json', x + 10, y - 26, C.fg2, fnt(600, 22, 'mono'));
  ['react  18.3.1', 'axios  1.7.2', 'lodash 4.17.21'].forEach((s, i) => txt(g, s, x + 22, y + 60 + i * 50, C.fg, fnt(600, 20, 'mono')));
  [['今天构建', .5], ['下个月构建', 2.5]].forEach(([s, d], i) => al(g, pop(st.tk, d), () => { const yy = y + 40 + i * 230, xx = x + 420; arrow(g, x + 280, y + 160, xx - 10, yy + 70, C.fg3, 3); rr(g, xx, yy, 520, 140, 16, 'rgba(14,20,36,.95)', C.gold, 2.5); txt(g, s, xx + 30, yy + 44, C.fg2, fnt(600, 24)); txt(g, 'sha256:3f9a…c21e', xx + 30, yy + 98, C.gold, fnt(800, 30, 'mono')); }));
  al(g, pop(st.tk, 5), () => { txt(g, '=', x + 1000, y + 250, C.ok, fnt(900, 80), 'center'); txt(g, '同一个结果', x + 960, y + 340, C.ok, fnt(700, 26)); });
};

AN.envs = (g, t, R, st) => {
  const E = [['开发环境', '自己调试', C.b], ['预发布环境', '尽量模仿线上', C.o], ['生产环境', '真实用户', C.g]];
  const w = (R.w - 2 * 100) / 3, y = R.y + 120;
  E.forEach(([a, b, col], i) => al(g, pop(t, .3 + i * .8), () => { const x = R.x + i * (w + 100); rr(g, x, y, w, 300, 20, 'rgba(14,20,36,.94)', col, 2.5); txt(g, a, x + w / 2, y + 50, col, fnt(800, 32), 'center'); txt(g, b, x + w / 2, y + 95, C.fg2, fnt(600, 22), 'center'); if (i < 2) arrow(g, x + w + 14, y + 150, x + w + 86, y + 150, C.fg3, 3, 12); }));
  const ph = CL((t - 4) / 5, 0, 2); const ax = R.x + w / 2 + ph * (w + 100);
  al(g, pop(t, 3.5), () => { rr(g, ax - 80, y + 160, 160, 90, 14, 'rgba(255,210,122,.12)', C.gold, 3); txt(g, 'app:3f9a', ax, y + 205, C.gold, fnt(800, 26, 'mono'), 'center'); });
  if (st.k >= 1) {
    const cf = [['DB=dev-db', 'PAY=沙箱'], ['DB=stage-db', 'PAY=沙箱'], ['DB=prod-db', 'PAY=正式']];
    cf.forEach((c, i) => al(g, pop(st.tk, 1 + i * .8), () => { const x = R.x + i * (w + 100) + 20, yy = y + 360; rr(g, x, yy, w - 40, 150, 14, 'rgba(14,20,36,.95)', C.p, 2); txt(g, '配置', x + 20, yy + 30, C.p, fnt(700, 20)); c.forEach((s, j) => txt(g, s, x + 20, yy + 75 + j * 42, C.fg, fnt(600, 22, 'mono'))); }));
    al(g, pop(st.tk, 4.5), () => txt(g, '制品只构建一次 · 不同的只有配置', R.x + R.w / 2, y + 620, C.gold, fnt(800, 32), 'center'));
  }
};

AN.secret = (g, t, R, st) => {
  const x = R.x + 30, y = R.y + 80;
  rr(g, x, y, 560, 300, 16, '#0B1020', C.line2, 2); txt(g, 'config.py', x + 20, y + 30, C.fg3, fnt(600, 20, 'mono'));
  txt(g, 'DB_HOST = "db.internal"', x + 30, y + 100, C.fg2, fnt(600, 24, 'mono'));
  txt(g, 'DB_PASS = "hunter2!"', x + 30, y + 160, C.bad, fnt(700, 24, 'mono'));
  al(g, pop(t, 2), () => { rr(g, x + 20, y + 135, 520, 50, 8, null, C.bad, 3); cross(g, x + 590, y + 160, 1, C.bad, 24); txt(g, '提交进仓库 = 所有人都能看到，历史里永远删不干净', x, y + 350, C.bad, fnt(700, 24)); });
  const vx = R.x + R.w - 430, vy = y + 40;
  al(g, pop(t, 6), () => { rr(g, vx, vy, 380, 260, 20, 'rgba(255,210,122,.07)', C.gold, 3); lock(g, vx + 190, vy + 110, 70); txt(g, '密钥管理服务', vx + 190, vy + 215, C.gold, fnt(800, 28), 'center'); });
  al(g, pop(t, 8), () => { const ay = y + 560; server(g, vx + 110, ay - 60, 160, 170, '运行中的应用', C.g); arrow(g, vx + 190, vy + 270, vx + 190, ay - 70, C.gold, 3, 12); txt(g, '部署时注入', vx - 20, (vy + ay) / 2 + 70, C.gold, fnt(700, 24), 'right'); txt(g, '定期更换', vx + 300, ay + 60, C.fg2, fnt(600, 22)); });
};

AN.iac = (g, t, R, st) => {
  const x = R.x + 30, y = R.y + 70;
  rr(g, x, y, 560, 520, 16, '#0B1020', C.line2, 2); txt(g, 'main.tf（示意）', x + 20, y + 30, C.fg3, fnt(600, 20, 'mono'));
  const L = ['resource "server" "web" {', '  count = 3', '}', 'resource "database" "main" {', '  size = "large"', '}', 'resource "firewall" "web" {', '  ports = [443]', '}'];
  L.forEach((s, i) => al(g, pop(t, .3 + i * .25, .3), () => txt(g, s, x + 24, y + 80 + i * 46, C.fg, fnt(600, 22, 'mono'))));
  const ix = x + 720;
  al(g, pop(t, 4), () => arrow(g, x + 580, y + 260, ix - 30, y + 260, C.gold, 4, 14));
  [0, 1, 2].forEach(i => server(g, ix + i * 150, y + 40, 120, 150, i === 1 ? '3 台服务器' : '', C.b, pop(t, 4.5 + i * .3)));
  al(g, pop(t, 5.6), () => { rr(g, ix, y + 280, 420, 110, 16, 'rgba(14,20,36,.95)', C.p, 2.5); txt(g, '数据库 · large', ix + 210, y + 335, C.p, fnt(700, 26), 'center'); });
  al(g, pop(t, 6.4), () => { rr(g, ix, y + 430, 420, 90, 16, 'rgba(14,20,36,.95)', C.o, 2.5); txt(g, '防火墙 · 443', ix + 210, y + 475, C.o, fnt(700, 26), 'center'); });
  al(g, pop(t, 9), () => txt(g, '新建一套环境 = 运行一遍', x, y + 600, C.gold, fnt(800, 30)));
};

function tableCols(g, x, y, cols, rows, a = 1) { al(g, a, () => { const cw = 210; cols.forEach(([nm, col, st_], i) => { const cx = x + i * cw; rr(g, cx, y, cw - 8, 56, 8, col + '33', col, 2); txt(g, nm, cx + (cw - 8) / 2, y + 28, st_ === 'del' ? C.fg3 : C.fg, fnt(700, 22, 'mono'), 'center'); if (st_ === 'del') line(g, [[cx + 20, y + 28], [cx + cw - 28, y + 28]], C.bad, 3); for (let r = 0; r < rows; r++) rr(g, cx, y + 64 + r * 46, cw - 8, 40, 6, 'rgba(14,20,36,.9)', C.line, 1); }); }); }
AN.migrate = (g, t, R, st) => {
  const x = R.x + 40, y = R.y + 80;
  txt(g, 'users 表', x, y, C.fg2, fnt(700, 26));
  const ren = pop(t, 2.5);
  tableCols(g, x, y + 30, [['id', C.fg3], [ren > .5 ? 'full_name' : 'name', ren > .5 ? C.g : C.b], ['email', C.fg3]], 4);
  al(g, ren, () => txt(g, 'name → full_name', x + 680, y + 60, C.g, fnt(800, 28, 'mono')));
  al(g, pop(t, 4.5), () => { const yy = y + 360; txt(g, '部署过程中，新旧代码同时在跑', x, yy, C.fg, fnt(800, 30));
    [['v1 代码', '读 name', C.b, false], ['v2 代码', '读 full_name', C.g, true]].forEach(([a, b, col, ok], i) => { const xx = x + i * 480, y2 = yy + 60; rr(g, xx, y2, 420, 150, 16, 'rgba(14,20,36,.95)', col, 2.5); txt(g, a, xx + 30, y2 + 45, col, fnt(800, 28)); txt(g, b, xx + 30, y2 + 100, C.fg2, fnt(600, 24, 'mono')); if (ok) ticks(g, xx + 350, y2 + 75, pop(t, 6.5), C.ok); else cross(g, xx + 370, y2 + 75, pop(t, 6.5), C.bad, 20); }); });
  al(g, pop(t, 9), () => txt(g, '数据库没有“退回旧版本”按钮', x, y + 650, C.bad, fnt(800, 30)));
};
AN.expand = (g, t, R, st) => {
  const S = [['① 加新列', [['name', C.b], ['full_name', C.g]], '新旧代码都能用'], ['② 双写 + 搬数据', [['name', C.b], ['full_name', C.g]], '老数据复制过去'], ['③ 只读新列', [['name', C.fg3], ['full_name', C.g]], '旧列不再读取'], ['④ 删旧列', [['name', C.fg3, 'del'], ['full_name', C.g]], '确认稳定后才删']];
  const n = 4, gw = (R.w - 30) / 2, gh = 300;
  S.forEach(([nm, cols, sub], i) => { const u = st.k === 0 ? pop(st.tk, .5 + i * 2.6) : 1, x = R.x + (i % 2) * (gw + 30), y = R.y + 30 + Math.floor(i / 2) * (gh + 30);
    al(g, u, () => { rr(g, x, y, gw, gh, 18, 'rgba(14,20,36,.94)', C.line2, 2); txt(g, nm, x + 30, y + 44, C.gold, fnt(800, 30)); txt(g, sub, x + 30, y + 88, C.fg2, fnt(600, 22)); tableCols(g, x + 30, y + 120, cols, 2);
      if (i === 1) for (let r = 0; r < 2; r++) { const ph = (t * .6 + r * .5) % 1; packet(g, [[x + 135, y + 205 + r * 46], [x + 345, y + 205 + r * 46]], ph, C.gold, 6); }
      if (st.k >= 1) { const v = pop(st.tk, .5 + i * .6); al(g, v, () => { g.save(); g.strokeStyle = C.ok; g.lineWidth = 3; g.beginPath(); g.arc(x + gw - 60, y + 50, 26, -.3, 4.2); g.stroke(); g.restore(); arrow(g, x + gw - 60 + 26 * Math.cos(4.2), y + 50 + 26 * Math.sin(4.2), x + gw - 60 + 26 * Math.cos(4.2) + 2, y + 50 + 26 * Math.sin(4.2) + 8, C.ok, 3, 10); txt(g, '可单独回滚', x + gw - 100, y + 100, C.ok, fnt(700, 20), 'center'); }); } }); });
};

AN.immut = (g, t, R, st) => {
  const x = R.x + 30, y = R.y + 40;
  if (st.k === 0) {
    txt(g, '制品仓库：每个版本都保留', x, y + 20, C.fg, fnt(800, 30));
    ['v1.0', 'v1.1', 'v1.2', 'v1.3', 'v1.4'].forEach((v, i) => al(g, pop(st.tk, .5 + i * .3), () => { rr(g, x + i * 200, y + 80, 170, 120, 14, 'rgba(14,20,36,.95)', i === 4 ? C.bad : i === 3 ? C.ok : C.line2, 2.5); txt(g, v, x + i * 200 + 85, y + 140, C.fg, fnt(800, 30, 'mono'), 'center'); }));
    al(g, pop(st.tk, 3), () => { txt(g, '线上 v1.4 出错', x + 800 + 85, y + 240, C.bad, fnt(700, 24), 'center'); });
    al(g, pop(st.tk, 4.5), () => { g.save(); g.strokeStyle = C.ok; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 885, y + 280); g.quadraticCurveTo(x + 800, y + 360, x + 685, y + 210); g.stroke(); g.restore(); arrow(g, x + 700, y + 236, x + 686, y + 212, C.ok, 4, 14); txt(g, '直接换回 v1.3', x + 640, y + 380, C.ok, fnt(800, 30)); });
    return;
  }
  const n = 4, sw = 180, gx = x + 60;
  for (let i = 0; i < n; i++) { const u = pop(st.tk, 1 + i * 1.2, .8), d = pop(st.tk, 1.5 + i * 1.2, .8);
    server(g, gx + i * 230, y + 60, sw, 200, '', C.fg3, 1 - d, 'v1', C.fg3);
    server(g, gx + i * 230, y + 320, sw, 200, '', C.g, u, 'v2', C.g); }
  al(g, pop(st.tk, .3), () => { txt(g, '旧实例：下掉', gx + 4 * 230 + 20, y + 160, C.fg3, fnt(700, 26)); txt(g, '新镜像：整批新建', gx + 4 * 230 + 20, y + 420, C.g, fnt(700, 26)); });
  al(g, pop(st.tk, 7), () => { txt(g, '不在旧机器上打补丁', x + 60, y + 640, C.gold, fnt(800, 32)); txt(g, '服务器是一次性餐具，不是宠物', x + 60, y + 700, C.fg2, fnt(600, 26)); });
};

AN.bluegreen = (g, t, R, st) => {
  const cx = R.x + R.w / 2, y = R.y + (st.k === 0 ? 90 : 40);
  if (st.k === 0) {
    rr(g, cx - 150, y, 300, 90, 16, 'rgba(14,20,36,.95)', C.fg2, 2.5); txt(g, '负载均衡', cx, y + 45, C.fg, fnt(800, 30), 'center');
    for (let i = 0; i < 5; i++) userIco(g, cx - 260 + i * 130, y - 30, C.fg3, .6);
    const sw = pop(st.tk, 6, .8), back = 0;
    const envs = [['蓝色环境', 'v1', C.b, -1], ['绿色环境', 'v2', C.g, 1]];
    envs.forEach(([nm, v, col, sd], i) => { const ex = cx + sd * 380 - 230, ey = y + 280; al(g, i === 0 ? 1 : pop(st.tk, 2), () => { rr(g, ex, ey, 460, 330, 20, col + '14', col, 3); txt(g, nm, ex + 230, ey + 44, col, fnt(800, 30), 'center'); [0, 1, 2].forEach(k => server(g, ex + 40 + k * 135, ey + 100, 110, 150, '', col, 1, v, col)); }); });
    const tx = LERP(cx - 380, cx + 380, sw);
    g.save(); g.strokeStyle = C.gold; g.lineWidth = 6; g.shadowColor = C.gold; g.shadowBlur = 16; g.beginPath(); g.moveTo(cx, y + 90); g.lineTo(tx, y + 270); g.stroke(); g.restore();
    for (let i = 0; i < 4; i++) packet(g, [[cx, y + 90], [tx, y + 270]], (t * .8 + i / 4) % 1, C.gold, 7);
    al(g, pop(st.tk, 3.5), () => check(g, cx + 160, y + 650, '绿色测试通过', 1, C.ok, 24));
    al(g, sw, () => txt(g, '一次切换全部流量；出问题再切回蓝色', cx, y + 710, C.gold, fnt(800, 30), 'center'));
    return;
  }
  const x = R.x + 40;
  rr(g, x, y + 40, 360, 120, 16, 'rgba(255,107,107,.1)', C.bad, 2.5); txt(g, '新版本出了问题', x + 180, y + 100, C.bad, fnt(800, 30), 'center');
  arrow(g, x + 360, y + 100, x + 480, y + 0 + 20, C.fg3, 3); arrow(g, x + 360, y + 100, x + 480, y + 220, C.fg3, 3);
  al(g, pop(st.tk, .5), () => { rr(g, x + 500, y - 40, 700, 150, 16, 'rgba(14,20,36,.95)', C.b, 2.5); txt(g, '回滚', x + 530, y + 4, C.b, fnt(800, 32)); txt(g, '代码问题、还没写入新格式数据', x + 530, y + 60, C.fg2, fnt(600, 24)); });
  al(g, pop(st.tk, 2.5), () => { rr(g, x + 500, y + 160, 700, 150, 16, 'rgba(14,20,36,.95)', C.o, 2.5); txt(g, '向前修复', x + 530, y + 204, C.o, fnt(800, 32)); txt(g, '新数据已经写入：退回去反而更糟', x + 530, y + 260, C.fg2, fnt(600, 24)); });
  al(g, pop(st.tk, 9), () => txt(g, '上线计划里，提前写好用哪条路', x, y + 440, C.gold, fnt(800, 32)));
};

AN.life1 = (g, t, R, st) => {
  const items = [['手工 FTP 上传', 1995, 2012, C.fg3, '过时'], ['部署脚本（Capistrano 等）', 2006, 2018, C.r, '少见'], ['配置管理（Puppet / Chef）', 2005, 2019, C.o, '退居二线'], ['托管平台免费套餐', 2007, 2022, C.p, '2022 取消'], ['开源 CI 首选（Travis CI）', 2011, 2021, C.b, '让位'], ['容器镜像', 2013, null, C.g, '至今主流'], ['平台自带流水线', 2019, null, C.ok, '至今主流']];
  const RR = { x: R.x, y: R.y, w: R.w, h: st.k === 2 ? R.h - 160 : R.h };
  lifeChart(g, RR, i => st.k > 0 ? 1 : pop(t, .3 + i * .6, 1.2), items, 1995, 2026, [2000, 2010, 2020]);
  if (st.k === 2) { const s = ['自动化', '版本化', '小步快跑', '随时能退']; let x = R.x + 40; s.forEach((w, i) => { x += chip(g, w, x, R.y + R.h - 70, [C.b, C.p, C.g, C.gold][i], pop(st.tk, 1 + i * .8), 30) + 24; }); }
};
