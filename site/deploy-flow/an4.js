// 第四集动画：发出去就收不回来（移动端、SaaS、设备、跨国多区域、AI）
function phone(g, x, y, w, h, col = C.b, ver = '', a = 1) { al(g, a, () => { rr(g, x, y, w, h, w * .18, 'rgba(14,20,36,.97)', col, 3); rr(g, x + w * .35, y + 10, w * .3, 8, 4, col + '88'); if (ver) txt(g, ver, x + w / 2, y + h / 2, col, fnt(800, Math.min(30, w * .26), 'mono'), 'center'); }); }

AN.open4 = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 40, w = (R.w - 100) / 2;
  al(g, pop(t, .3), () => { rr(g, x, y, w, 280, 20, 'rgba(14,20,36,.95)', C.g, 2.5); txt(g, '网站', x + 30, y + 50, C.g, fnt(800, 34)); server(g, x + 60, y + 90, 140, 150, '', C.g, 1, 'v2', C.g); const u = pop(t, 2.5, .8); g.save(); g.strokeStyle = C.ok; g.lineWidth = 4; g.beginPath(); g.arc(x + 330, y + 165, 50, -.5, 4); g.stroke(); g.restore(); txt(g, '几分钟回滚', x + 420, y + 165, C.ok, fnt(800, 28)); });
  al(g, pop(t, 3.5), () => { const xx = x + w + 100; rr(g, xx, y, w, 280, 20, 'rgba(14,20,36,.95)', C.r, 2.5); txt(g, '手机应用', xx + 30, y + 50, C.r, fnt(800, 34)); for (let i = 0; i < 6; i++) phone(g, xx + 40 + i * 80, y + 100, 60, 110, C.r, 'v' + (i % 3 + 1)); txt(g, '装进用户手机就收不回', xx + 30, y + 250, C.fg2, fnt(600, 24)); });
  const L = ['移动应用', '多租户软件', '设备固件', '跨国多区域', 'AI 时代', '角色与技能'];
  let cx = x; L.forEach((s, i) => { cx += chip(g, s, cx, y + 420, [C.r, C.p, C.o, C.b, C.gold, C.g][i], pop(t, 6 + i * .7), 28) + 22; });
};

AN.appstore = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 40;
  if (st.k === 0) {
    const S = [['开发完成', C.b], ['提交审核', C.o], ['上架', C.g], ['用户自己决定更新', C.p]];
    stages(g, x, y + 20, R.w - 40, 120, S.map(s => [s[0], '', s[1]]), CL((st.tk - .5) / 1.8, 0, 3.99), { fs: 28 });
    al(g, pop(st.tk, 5), () => { txt(g, '线上同时存在的版本（示意）', x, y + 240, C.fg, fnt(800, 28)); const V = [['v5.2', .46, C.g], ['v5.1', .28, C.b], ['v5.0', .14, C.p], ['更老', .12, C.fg3]]; let xx = x; V.forEach(([v, p, col], i) => { const ww = (R.w - 40) * p * pop(st.tk, 5.5 + i * .4); rr(g, xx, y + 280, Math.max(0, ww - 6), 70, 10, col); if (ww > 80) txt(g, v + ' ' + Math.round(p * 100) + '%', xx + 16, y + 315, '#0B1020', fnt(800, 24)); xx += ww; }); });
    return;
  }
  const W = R.w - 40, cw = W / 14;
  txt(g, '移动端发布列车：两周一班', x, y + 20, C.fg, fnt(800, 30));
  for (let d = 0; d < 28; d++) { const c = d % 14, row = Math.floor(d / 14), xx = x + c * cw, yy = y + 70 + row * 200; const ph = c < 9 ? ['开发', C.b] : c < 11 ? ['冻结', C.o] : c < 13 ? ['测试', C.p] : ['提审', C.g]; al(g, pop(st.tk, .3 + d * .05, .3), () => { rr(g, xx + 3, yy, cw - 6, 120, 8, ph[1] + '33', ph[1], 1.5); if (c === 0 || c === 9 || c === 11 || c === 13) txt(g, ph[0], xx + 10, yy + 150, ph[1], fnt(700, 22)); }); }
};

AN.phased = (g, t, R, st) => {
  const x = R.x + 30, y = R.y + 40;
  const P = [1, 2, 5, 10, 20, 50, 100], bw = (R.w - 80) / 7, H = 380;
  const day = st.k === 0 ? Math.min(7, Math.floor(CL((st.tk - 1) / 1.2) * 1 + (st.tk > 1 ? 1 : 0)) + Math.floor(Math.max(0, st.tk - 2.2) / 1.2)) : 7;
  txt(g, '苹果分阶段发布：7 天', x, y, C.fg, fnt(800, 30));
  P.forEach((p, i) => { const on = i < day, h = H * Math.sqrt(p / 100); al(g, on ? 1 : .25, () => { rr(g, x + i * bw + 12, y + 60 + H - h, bw - 24, h, 10, on ? C.g : C.line2); txt(g, p + '%', x + i * bw + bw / 2, y + 40 + H - h, on ? C.fg : C.fg3, fnt(800, 26, 'mono'), 'center'); txt(g, '第 ' + (i + 1) + ' 天', x + i * bw + bw / 2, y + 100 + H, C.fg2, fnt(600, 22), 'center'); }); });
  txt(g, '（高度按平方根缩放）', x + R.w - 80, y, C.fg3, fnt(500, 18), 'right');
  if (st.k === 0) al(g, pop(st.tk, 11), () => { rr(g, x + 3 * bw, y + 520, 3 * bw, 70, 14, 'rgba(255,178,92,.12)', C.o, 2.5); txt(g, '崩溃率升高 → 暂停', x + 4.5 * bw, y + 555, C.o, fnt(800, 26), 'center'); });
  if (st.k === 1) { const S = [['内部员工', C.gold], ['测试用户', C.o], ['分阶段发布', C.g]]; S.forEach(([s, col], i) => chip(g, s, x + i * 220, y + 560, col, pop(st.tk, .5 + i * .8), 26)); al(g, pop(st.tk, 4), () => txt(g, '崩溃率不达标就不往下推', x + 700, y + 560, C.bad, fnt(800, 28))); }
};

AN.force = (g, t, R, st) => {
  const x = R.x + 30, y = R.y + 40;
  rr(g, x, y + 40, 360, 140, 16, 'rgba(14,20,36,.95)', C.b, 2.5); txt(g, '服务器下发', x + 30, y + 84, C.fg2, fnt(600, 24)); txt(g, 'min_version = 5.0', x + 30, y + 136, C.gold, fnt(800, 28, 'mono'));
  const V = [['5.2', true], ['5.1', true], ['5.0', true], ['4.8', false], ['4.3', false]];
  V.forEach(([v, ok], i) => al(g, pop(t, 1.5 + i * .4), () => { const px = x + 480 + i * 210, py = y; phone(g, px, py, 130, 230, ok ? C.g : C.bad, v); if (!ok && t > 4) { rr(g, px - 30, py + 250, 190, 60, 12, 'rgba(255,107,107,.15)', C.bad, 2); txt(g, '请升级', px + 65, py + 280, C.bad, fnt(800, 24), 'center'); } }));
  al(g, pop(t, 7), () => { rr(g, x, y + 400, R.w - 60, 160, 16, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, '服务端接口要长期兼容老版本', x + 30, y + 450, C.gold, fnt(800, 32)); txt(g, '/api/v1 · /api/v2 · /api/v3 同时在线，有时要兼容好几年', x + 30, y + 510, C.fg2, fnt(600, 24, 'mono')); });
};

AN.dyn = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 40;
  if (st.k === 0) {
    rr(g, x, y + 40, 460, 300, 16, '#0B1020', C.p, 2); txt(g, '服务器下发的界面描述', x + 20, y + 74, C.p, fnt(700, 22));
    ['{ "type": "banner",', '  "text": "双 11 来了" },', '{ "type": "list",', '  "source": "/hot" }'].forEach((s, i) => txt(g, s, x + 30, y + 130 + i * 48, C.fg, fnt(600, 22, 'mono')));
    al(g, pop(st.tk, 3), () => arrow(g, x + 480, y + 190, x + 580, y + 190, C.gold, 4, 14));
    al(g, pop(st.tk, 3.5), () => { phone(g, x + 620, y, 260, 460, C.b); rr(g, x + 645, y + 50, 210, 90, 10, C.gold + '55', C.gold, 2); txt(g, '双 11 来了', x + 750, y + 95, C.fg, fnt(800, 24), 'center'); for (let i = 0; i < 4; i++) rr(g, x + 645, y + 160 + i * 66, 210, 52, 8, 'rgba(255,255,255,.05)', C.line2, 1.5); });
    return;
  }
  if (st.k === 1) {
    const w = (R.w - 60) / 2;
    [['可以动态更新', ['图片、文案、活动页', '配置和开关', '界面描述（服务端驱动）'], C.ok], ['仍要走审核', ['改变主要功能的代码', '新的原生能力', '大的功能改动'], C.o]].forEach(([h, L, col], i) => al(g, pop(st.tk, .5 + i * 2.5), () => card(g, x + i * (w + 60), y, w, 330, h, L, col, 1, false, 26)));
    al(g, pop(st.tk, 8), () => { txt(g, '安卓（国内）：分别上架多家应用商店', x, y + 420, C.fg, fnt(800, 28)); ['商店 A', '商店 B', '商店 C', '商店 D', '商店 E'].forEach((s, i) => chip(g, s, x + i * 150, y + 490, C.b, pop(st.tk, 8.5 + i * .3), 22)); });
    return;
  }
  const S = [['上传新版本', C.b], ['平台审核', C.o], ['发布', C.g], ['后台下载', C.p], ['下次打开生效', C.gold]];
  stages(g, x, y + 40, R.w - 40, 120, S.map(s => [s[0], '', s[1]]), CL((st.tk - .5) / 1.8, 0, 4.99), { fs: 24, gap: 32 });
  al(g, pop(st.tk, 9), () => { phone(g, x + 40, y + 260, 180, 320, C.gold); rr(g, x + 50, y + 380, 160, 90, 12, 'rgba(14,20,36,.98)', C.gold, 2); txt(g, '新版本已就绪', x + 130, y + 410, C.fg, fnt(700, 18), 'center'); txt(g, '重启', x + 130, y + 445, C.gold, fnt(800, 20), 'center'); txt(g, '必须马上更新：提示用户重启', x + 260, y + 420, C.fg2, fnt(700, 26)); });
};

AN.tenants = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 40, cx = R.x + R.w / 2;
  server(g, cx - 110, y + 20, 220, 220, '一套系统', C.p, 1, st.tk > 6 ? 'v2' : 'v1', st.tk > 9 ? C.bad : C.p);
  const N = 60; for (let i = 0; i < N; i++) { const a = Math.PI * (i / (N - 1)), r = 380 + (i % 3) * 60, tx = cx + Math.cos(a) * r * 1.6, ty = y + 330 + Math.sin(a) * r * .55; const bad = st.tk > 9; al(g, pop(t, .5 + i * .03, .3), () => { line(g, [[cx, y + 240], [tx, ty]], bad ? 'rgba(255,107,107,.15)' : 'rgba(199,155,255,.1)', 1); rr(g, tx - 22, ty - 16, 44, 32, 6, bad ? 'rgba(255,107,107,.3)' : 'rgba(14,20,36,.95)', bad ? C.bad : C.p, 1.5); }); }
  al(g, pop(t, 6), () => txt(g, '部署一次，所有客户同时升级', x, y + 640, C.ok, fnt(800, 28)));
  al(g, pop(t, 9.5), () => txt(g, '一次坏的部署，所有客户同时出问题', R.x + R.w - 20, y + 640, C.bad, fnt(800, 28), 'right'));
};

AN.rings = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 30;
  if (st.bi <= 2) {
    const cx = x + 360, cy = y + 330, L = [['员工', C.gold, 70], ['尝鲜客户', C.o, 150], ['普通客户', C.g, 230], ['大客户 / 政府', C.b, 310]];
    const T = st.bi === 1 ? st.tk : 99;
    L.slice().reverse().forEach(([s, col, r], j) => { const i = 3 - j, on = T > 1.5 + i * 2.5; g.save(); g.strokeStyle = on ? col : C.line2; g.lineWidth = on ? 30 : 20; g.globalAlpha = on ? .55 : .3; g.beginPath(); g.arc(cx, cy, r - 25, 0, TAU); g.stroke(); g.restore(); });
    L.forEach(([s, col, r], i) => { const on = T > 1.5 + i * 2.5; al(g, on ? 1 : .4, () => { txt(g, (i + 1) + ' · ' + s, cx + 360, y + 130 + i * 90, on ? col : C.fg3, fnt(800, 30)); line(g, [[cx + r - 25, cy - (i * 10)], [cx + 340, y + 130 + i * 90]], on ? col + '88' : C.line2, 1.5); }); });
    txt(g, '新版本', cx, cy, C.gold, fnt(800, 20), 'center');
    if (st.bi === 2) { const S = ['提前通知', '自己的维护窗口', '按租户开关功能', '逐个租户迁移数据（可暂停）']; al(g, pop(st.tk, .5), () => { const bx = cx + 330; rr(g, bx, y + 470, R.x + R.w - 20 - bx, 250, 14, 'rgba(14,20,36,.95)', C.b, 2); S.forEach((s, i) => check(g, bx + 24, y + 515 + i * 56, s, pop(st.tk, 1 + i * 1.5), C.ok, 24)); }); }
    return;
  }
  const w = (R.w - 80) / 3;
  [['共享库 + 租户列', '升级一次完成', C.g, 1], ['每租户一个 schema', '折中', C.o, 6], ['每租户一个独立库', '隔离最好，迁移要跑上千次', C.b, 24]].forEach(([a, b, col, n], i) => al(g, pop(st.tk, .5 + i * 2.5), () => { const xx = x + i * (w + 40); rr(g, xx, y + 20, w, 480, 18, 'rgba(14,20,36,.95)', col, 2.5); txt(g, a, xx + w / 2, y + 66, col, fnt(800, 26), 'center'); const cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols), s = Math.min(90, (w - 80) / cols - 10, 280 / rows - 10); for (let k = 0; k < n; k++) { const cx = xx + w / 2 - cols * (s + 10) / 2 + (k % cols) * (s + 10), cy = y + 120 + Math.floor(k / cols) * (s + 10); g.save(); g.fillStyle = col + '33'; g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); g.ellipse(cx + s / 2, cy + s * .15, s / 2, s * .15, 0, 0, TAU); g.fill(); g.stroke(); g.strokeRect(cx, cy + s * .15, s, s * .7); g.restore(); } wrapTxt(g, b, xx + 30, y + 430, w - 60, 30, C.fg2, fnt(600, 22)); }));
};

AN.abpart = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 40;
  if (st.k === 0) {
    const ic = [['汽车', C.b], ['路由器', C.g], ['智能家电', C.o]];
    ic.forEach(([s, col], i) => al(g, pop(st.tk, .5 + i * .7), () => { const xx = x + 60 + i * 300; rr(g, xx, y + 40, 220, 160, 20, 'rgba(14,20,36,.95)', col, 3); txt(g, s, xx + 110, y + 120, col, fnt(800, 30), 'center'); for (let k = 0; k < 3; k++) { g.save(); g.strokeStyle = col; g.globalAlpha = .3 + .7 * ((Math.sin(t * 3 - k) + 1) / 2); g.lineWidth = 3; g.beginPath(); g.arc(xx + 110, y + 20, 20 + k * 18, -2.4, -.7); g.stroke(); g.restore(); } }));
    al(g, pop(st.tk, 5), () => { const px = x + 60, py = y + 300; txt(g, '升级到一半断电……', px, py, C.fg, fnt(800, 28)); pctBar(g, px, py + 40, 600, 40, .48, C.o, '48%'); txt(g, '断电', px + 300, py + 160, C.gold, fnt(900, 40)); arrow(g, px + 360, py + 160, px + 410, py + 160, C.gold, 4, 14); rr(g, px + 420, py + 100, 240, 120, 14, '#222', C.fg3, 3); txt(g, '变砖', px + 540, py + 160, C.fg3, fnt(900, 40), 'center'); });
    return;
  }
  if (st.k === 1) {
    const T = st.tk, w = (R.w - 100) / 2;
    const run = T < 6 ? 'A' : T < 9 ? 'B' : 'A', fail = T > 7.5;
    [['A 分区', 'v1', C.b], ['B 分区', T > 2 ? 'v2' : '（空）', C.g]].forEach(([s, v, col], i) => { const xx = x + i * (w + 60), on = run === s[0], bad = i === 1 && fail; rr(g, xx, y + 40, w, 280, 20, on ? col + '18' : 'rgba(14,20,36,.9)', bad ? C.bad : on ? col : C.line2, on ? 4 : 2); txt(g, s, xx + 30, y + 86, bad ? C.bad : col, fnt(800, 32)); txt(g, v, xx + w / 2, y + 190, C.fg, fnt(800, 48, 'mono'), 'center'); if (on) chip(g, '正在运行', xx + 30, y + 280, col, 1, 22); if (bad) txt(g, '启动失败', xx + w - 30, y + 86, C.bad, fnt(800, 26), 'right'); if (i === 1 && T > 2 && T < 6) { const u = CL((T - 2) / 3); pctBar(g, xx + 30, y + 240, w - 180, 24, u, col); } });
    al(g, pop(T, 6), () => txt(g, '重启切到 B', x, y + 400, C.g, fnt(800, 28)));
    al(g, pop(T, 9), () => txt(g, '→ 失败，自动退回 A', x + 260, y + 400, C.ok, fnt(800, 28)));
    return;
  }
  crowdDots(g, x + 20, y + 80, 30, 8, Math.min(44, (R.w - 80) / 30), Math.floor(CL(st.tk / 6) * 240 * (st.tk < 3 ? .05 : 1)), C.g);
  al(g, pop(st.tk, 6), () => { ['网络差', '电量低', '用户正在使用'].forEach((s, i) => chip(g, s, x + 20 + i * 230, y + 500, C.o, 1, 26)); });
};

// 简化世界地图：几块大陆的轮廓（示意）
function miniWorld(g, R) { const sx = R.w / 1720, X = v => R.x + v * sx, Y = v => R.y + v; g.save(); g.fillStyle = 'rgba(92,180,255,.07)'; g.strokeStyle = 'rgba(92,180,255,.25)'; g.lineWidth = 1.5;
  [[[150, 120], [520, 90], [600, 220], [450, 330], [330, 360], [200, 260]], [[420, 400], [560, 420], [520, 640], [440, 700], [400, 520]], [[780, 120], [960, 90], [1000, 220], [880, 280], [800, 240]], [[820, 300], [1000, 300], [960, 560], [860, 560]], [[1000, 100], [1500, 80], [1600, 250], [1400, 380], [1150, 330], [1020, 230]], [[1380, 470], [1560, 470], [1580, 600], [1420, 600]]].forEach(P => { g.beginPath(); P.forEach(([a, b], i) => i ? g.lineTo(X(a), Y(b)) : g.moveTo(X(a), Y(b))); g.closePath(); g.fill(); g.stroke(); }); g.restore(); return [X, Y]; }
AN.regions = (g, t, R, st) => {
  const [X, Y] = miniWorld(g, R);
  const RG = [['美西', 230, 230, 2], ['美东', 480, 210, 3], ['巴西', 480, 520, 1], ['欧洲', 880, 180, 2], ['新加坡', 1300, 330, 1], ['东京', 1480, 200, 3], ['悉尼', 1480, 540, 2]];
  const T = st.k === 0 ? -1 : st.tk;
  // 批次：0 金丝雀（巴西），1 试点（新加坡），2 第二批，3 最后
  const wave = i => i === 2 ? 0 : i === 4 ? 1 : (i === 0 || i === 3 || i === 6) ? 2 : 3;
  RG.forEach(([nm, a, b], i) => { const w = wave(i), on = T > 1.5 + w * 3.2, cur = on && T < 1.5 + (w + 1) * 3.2; regionDot(g, X(a), Y(b), nm, on ? (cur ? C.gold : C.g) : C.b, on ? (cur ? '更新中' : 'v2') : 'v1'); });
  if (st.k === 0) al(g, pop(st.tk, 4), () => { rr(g, R.x + 20, R.y + R.h - 150, R.w - 40, 80, 14, 'rgba(255,107,107,.08)', C.bad, 2); txt(g, '纪律：永远不要同时更新所有区域', R.x + R.w / 2, R.y + R.h - 110, C.bad, fnt(800, 30), 'center'); });
  else { const L = ['① 金丝雀区域', '② 试点区域', '③ 分批扩大', '④ 其余区域']; L.forEach((s, i) => chip(g, s, R.x + 20 + i * 240, R.y + R.h - 110, T > 1.5 + i * 3.2 ? C.gold : C.fg3, 1, 24)); al(g, pop(st.tk, 15), () => txt(g, '选当地流量低谷 · 有人醒着值班', R.x + R.w - 20, R.y + R.h - 40, C.fg2, fnt(700, 24), 'right')); }
};

AN.cellarch = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 30;
  if (st.k === 0) {
    rr(g, x, y + 20, R.w - 40, 460, 20, 'rgba(14,20,36,.6)', C.b, 2); txt(g, '一个区域', x + 24, y + 56, C.b, fnt(800, 26));
    const n = 12, cw = (R.w - 120) / 6;
    for (let i = 0; i < n; i++) { const xx = x + 40 + (i % 6) * cw, yy = y + 100 + Math.floor(i / 6) * 180, bad = i === 4 && st.tk > 5; al(g, pop(st.tk, .5 + i * .15), () => { rr(g, xx, yy, cw - 20, 150, 14, bad ? 'rgba(255,107,107,.18)' : 'rgba(95,224,160,.07)', bad ? C.bad : C.g, 2); txt(g, '单元 ' + (i + 1), xx + (cw - 20) / 2, yy + 40, bad ? C.bad : C.g, fnt(700, 22), 'center'); crowdDots(g, xx + 20, yy + 80, 5, 2, (cw - 60) / 5, 10, bad ? C.bad : C.fg2); }); }
    al(g, pop(st.tk, 6), () => txt(g, '坏的部署最多影响一个单元：控制爆炸半径', x, y + 560, C.gold, fnt(800, 30)));
    return;
  }
  const L = [['欧盟', '欧盟数据保护条例', C.b, '配置 A'], ['中国', '个人信息保护 · 数据出境', C.r, '配置 B'], ['美国', '各州法规', C.g, '配置 C']];
  const w = (R.w - 80) / 3;
  L.forEach(([a, b, col, c], i) => al(g, pop(st.tk, .5 + i * 1.5), () => { const xx = x + i * (w + 40); rr(g, xx, y + 40, w, 380, 18, 'rgba(14,20,36,.95)', col, 2.5); txt(g, a, xx + w / 2, y + 100, col, fnt(800, 36), 'center'); wrapTxt(g, b, xx + 30, y + 160, w - 60, 32, C.fg2, fnt(600, 22)); lock(g, xx + w / 2, y + 270, 50, col); chip(g, c, xx + w / 2 - 60, y + 380, col, 1, 22); }));
  al(g, pop(st.tk, 7), () => txt(g, '数据留在当地 → 同一产品，不同部署', x, y + 520, C.gold, fnt(800, 30)));
};

AN.aiq = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 30;
  if (st.k === 0) {
    txt(g, 'AI 使用增加后（DORA 2024 估计）', x, y + 20, C.fg, fnt(800, 30));
    const B = [['文档质量', 7.5], ['代码质量', 3.4], ['审查速度', 3.1], ['交付吞吐', -1.5], ['交付稳定性', -7.2]];
    const sc = (R.w - 520) / 17, zx = x + 250 + 8.5 * sc + 20;
    line(g, [[zx, y + 70], [zx, y + 70 + B.length * 90]], C.fg3, 2);
    B.forEach(([s, v], i) => al(g, pop(st.tk, 1 + i * 1.3), () => { const yy = y + 90 + i * 90, u = pop(st.tk, 1 + i * 1.3, .8), col = v > 0 ? C.ok : C.bad; txt(g, s, x + 200, yy + 25, C.fg, fnt(700, 26), 'right'); const w = v * sc * u; rr(g, Math.min(zx, zx + w), yy, Math.abs(w), 50, 8, col); txt(g, (v > 0 ? '+' : '') + v + '%', zx + w + (v > 0 ? 14 : -14), yy + 25, col, fnt(800, 24, 'mono'), v > 0 ? 'left' : 'right'); }));
    return;
  }
  const w = (R.w - 60) / 2;
  al(g, 1, () => { rr(g, x, y + 20, w, 300, 18, 'rgba(255,107,107,.06)', C.bad, 2.5); txt(g, '变更变大、变多', x + 30, y + 66, C.bad, fnt(800, 30)); for (let i = 0; i < 30; i++) rr(g, x + 30 + (i % 10) * ((w - 60) / 10), y + 110 + Math.floor(i / 10) * 60, (w - 60) / 10 - 10, 40, 6, C.bad + '55'); txt(g, '测试和审查没跟上', x + 30, y + 300, C.fg2, fnt(600, 22)); });
  al(g, pop(st.tk, 4), () => { const xx = x + w + 60; rr(g, xx, y + 20, w, 300, 18, 'rgba(95,211,154,.06)', C.ok, 2.5); txt(g, '老原则更重要', xx + 30, y + 66, C.ok, fnt(800, 30)); ['小批量', '自动化测试', '渐进式发布', '随时能回滚'].forEach((s, i) => check(g, xx + 30, y + 130 + i * 50, s, pop(st.tk, 5 + i * .7), C.ok, 24)); });
};

AN.aiops = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 30;
  if (st.k === 0) {
    const L = [['审查合并请求', C.b], ['判断金丝雀是否健康', C.g], ['找出出问题的变更', C.o]];
    bot(g, x + 80, y + 120, C.p, 2);
    L.forEach(([s, col], i) => al(g, pop(st.tk, 1 + i * 2), () => { const yy = y + 30 + i * 110; arrow(g, x + 150, y + 120, x + 230, yy + 40, C.fg3, 2); rr(g, x + 240, yy, R.w - 300, 80, 14, 'rgba(14,20,36,.95)', col, 2.5); txt(g, s, x + 270, yy + 40, C.fg, fnt(700, 28)); }));
    al(g, pop(st.tk, 8), () => { rr(g, x, y + 400, R.w - 40, 150, 16, 'rgba(255,210,122,.07)', C.gold, 2.5); txt(g, 'AI 智能体直接操作环境时', x + 30, y + 440, C.gold, fnt(800, 28)); ['最小权限', '人工审批', '审计记录'].forEach((s, i) => check(g, x + 30 + i * 260, y + 505, s, pop(st.tk, 9 + i * .6), C.ok, 26)); });
    return;
  }
  const S = [['模型 / 提示词改动', C.p], ['离线评测', C.b], ['灰度', C.g], ['全量', C.ok]];
  stages(g, x, y + 60, R.w - 40, 130, S.map(s => [s[0], '', s[1]]), CL((st.tk - .5) / 2, 0, 3.99), { fs: 24 });
  al(g, pop(st.tk, 7), () => { g.save(); g.strokeStyle = C.o; g.lineWidth = 3; g.setLineDash([8, 6]); g.beginPath(); g.moveTo(x + (R.w - 40) * .65, y + 200); g.quadraticCurveTo(x + (R.w - 40) * .4, y + 330, x + (R.w - 40) * .15, y + 200); g.stroke(); g.restore(); txt(g, '指标变差 → 回滚到上一个模型版本', x + (R.w - 40) * .4, y + 340, C.o, fnt(800, 26), 'center'); });
};

AN.roles = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 30;
  const P = [['开发工程师', '兼容 · 开关 · 可观测', C.b], ['运维 / SRE', '目标 · 监控 · 故障', C.g], ['平台工程师', '流水线做成产品', C.p], ['发布经理', '版本节奏', C.gold], ['测试工程师', '守住质量', C.o], ['安全与合规', '过程可审计', C.r]];
  const w = (R.w - 100) / 3;
  P.forEach(([a, b, col], i) => { const show = st.k > 0 || i === 0; const u = st.k === 0 ? pop(st.tk, .5) : st.k === 1 ? (i === 0 ? 1 : pop(st.tk, .5 + (i - 1) * 1.6)) : 1; al(g, show ? u : 0, () => { const xx = x + (i % 3) * (w + 50), yy = y + 20 + Math.floor(i / 3) * 210; rr(g, xx, yy, w, 180, 18, 'rgba(14,20,36,.95)', col, 2.5); person(g, xx + 60, yy + 90, col, 1.2); txt(g, a, xx + 110, yy + 70, C.fg, fnt(800, 28)); txt(g, b, xx + 110, yy + 120, C.fg2, fnt(600, 22)); }); });
  if (st.k === 2) { const S = ['版本控制与 CI', '容器与编排', '基础设施即代码', '监控与告警']; let xx = x; S.forEach((s, i) => { xx += chip(g, s, xx, y + 490, C.b, pop(st.tk, .5 + i * .8), 24) + 16; }); al(g, pop(st.tk, 6), () => txt(g, '对线上保持敬畏，永远留好退路', x, y + 580, C.gold, fnt(800, 32))); }
};

AN.life4 = (g, t, R, st) => {
  const items = [['JSPatch 热修复', 2015, 2017, C.r, '被警告'], ['CodePush', 2015, 2025, C.o, '2025 退役'], ['Terraform 开源许可', 2014, 2023, C.p, '改商业许可'], ['OpenTofu', 2023, null, C.g, '社区分叉'], ['分阶段发布', 2017, null, C.ok, '标配']];
  lifeChart(g, R, i => st.k > 0 ? 1 : pop(t, .3 + i * .8, 1.2), items, 2012, 2026, [2015, 2020, 2025]);
  if (st.k === 1) { const L = ['好不好用', '背后公司和社区', '迁移成本']; let xx = R.x + 40; L.forEach((s, i) => { xx += chip(g, s, xx, R.y + R.h - 110, C.gold, pop(st.tk, .5 + i * 1.2), 26) + 20; }); }
};

AN.final = (g, t, R, st) => {
  const cx = R.x + R.w / 2, y = R.y + 40;
  if (st.k === 0) {
    const S = [['一个人 · FTP', C.fg3], ['流水线', C.b], ['Kubernetes · GitOps', C.p], ['多区域 · 单元化', C.g], ['AI 时代', C.gold]];
    S.forEach(([s, col], i) => al(g, pop(st.tk, .5 + i * 1), () => { const xx = R.x + 40 + i * (R.w - 80) / 5; rr(g, xx, y + 100, (R.w - 80) / 5 - 30, 140, 16, 'rgba(14,20,36,.95)', col, 2.5); txt(g, s, xx + ((R.w - 80) / 5 - 30) / 2, y + 170, col, fnt(800, 26), 'center'); if (i < 4) arrow(g, xx + (R.w - 80) / 5 - 26, y + 170, xx + (R.w - 80) / 5 - 4, y + 170, C.fg3, 3, 10); }));
    al(g, pop(st.tk, 7), () => txt(g, '怎样让改变发生得又快又安全？', cx, y + 420, C.fg, fnt(800, 48, 'serif'), 'center'));
    return;
  }
  const P = [['把变更拆小', C.b], ['把过程自动化', C.p], ['让每一步看得见', C.g], ['永远准备好退路', C.gold]];
  const w = (R.w - 120) / 4;
  P.forEach(([s, col], i) => al(g, pop(st.tk, .5 + i * 1.3), () => { const xx = R.x + 20 + i * (w + 26); rr(g, xx, y + 120, w, 260, 20, 'rgba(14,20,36,.95)', col, 3); txt(g, String(i + 1), xx + w / 2, y + 200, col, fnt(900, 70, 'serif'), 'center'); txt(g, s, xx + w / 2, y + 310, C.fg, fnt(800, 30), 'center'); }));
  al(g, pop(st.tk, 7), () => txt(g, '感谢观看', cx, y + 520, C.gold, fnt(900, 56, 'serif'), 'center'));
};
