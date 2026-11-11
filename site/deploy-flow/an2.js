// 第二集动画：几百个服务一起跑（中大型公司）
AN.open2 = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    // 服务网格点阵逐渐变多
    const n = Math.floor(CL((st.tk - .3) / 5) * 160);
    for (let i = 0; i < n; i++) { const x = R.x + 30 + HSH(i, 1) * (R.w - 60), y = R.y + 40 + HSH(i, 2) * 420; dot(g, x, y, 6, [C.b, C.p, C.g, C.o][i % 4] + 'aa'); if (i > 3 && i % 2) { const j = Math.floor(HSH(i, 3) * i); line(g, [[x, y], [R.x + 30 + HSH(j, 1) * (R.w - 60), R.y + 40 + HSH(j, 2) * 420]], 'rgba(92,180,255,.12)', 1); } }
    al(g, pop(st.tk, 6.5), () => { const x = R.x + 40, y = R.y + 520; txt(g, '线上故障的来源（谷歌 SRE 经验）', x, y, C.fg, fnt(800, 30));
      const u = pop(st.tk, 7.5, 1.5); rr(g, x, y + 40, (R.w - 80) * .7 * u, 70, 10, C.bad); rr(g, x + (R.w - 80) * .7 * u, y + 40, (R.w - 80) * .3 * u, 70, 10, C.line2);
      if (u > .9) { txt(g, '约 70%：变更引起', x + 24, y + 75, '#fff', fnt(800, 30)); txt(g, '其他', x + (R.w - 80) * .7 + 24, y + 75, C.fg2, fnt(700, 26)); } });
    return;
  }
  const L = ['容器编排', '声明式部署', '金丝雀发布', '功能开关', '平台工程', '案例'];
  L.forEach((s, i) => { const u = pop(st.tk, .4 + i * .9), x = R.x + (i % 3) * (R.w / 3) + 20, y = R.y + 120 + Math.floor(i / 3) * 230; al(g, u, () => { rr(g, x, y, R.w / 3 - 40, 180, 18, 'rgba(14,20,36,.94)', [C.b, C.p, C.gold, C.g, C.o, C.r][i], 2.5); txt(g, String(i + 1).padStart(2, '0'), x + 30, y + 50, C.fg3, fnt(800, 28, 'mono')); txt(g, s, x + 30, y + 115, C.fg, fnt(800, 38, 'serif')); }); });
};

AN.mono = (g, t, R, st) => {
  const cx = R.x + R.w / 2, y = R.y + 60;
  rr(g, cx - 330, y, 660, 440, 26, 'rgba(14,20,36,.95)', C.b, 3); txt(g, '单体应用', cx, y + 50, C.b, fnt(800, 34), 'center');
  const M = ['用户', '商品', '购物车', '订单', '支付', '搜索', '推荐', '客服', '后台'];
  M.forEach((m, i) => { const bad = i === 4 && t > 5; rr(g, cx - 290 + (i % 3) * 200, y + 100 + Math.floor(i / 3) * 105, 180, 85, 12, bad ? 'rgba(255,107,107,.2)' : 'rgba(92,180,255,.08)', bad ? C.bad : C.line2, 2); txt(g, m, cx - 200 + (i % 3) * 200, y + 142 + Math.floor(i / 3) * 105, bad ? C.bad : C.fg, fnt(700, 28), 'center'); });
  for (let i = 0; i < 9; i++) al(g, pop(t, 2 + i * .2), () => person(g, cx - 480 + i * 120, y + 560, [C.b, C.p, C.g, C.o][i % 4], .9));
  al(g, pop(t, 5.5), () => txt(g, '一个模块出问题 → 整车人都走不了', cx, y + 680, C.bad, fnt(800, 32), 'center'));
};

AN.train = (g, t, R, st) => {
  if (st.k === 0) {
    const y = R.y + 260, x0 = R.x + 20, x1 = R.x + R.w - 20;
    line(g, [[x0, y + 90], [x1, y + 90]], C.line2, 6);
    const days = ['周二', '周二', '周二']; days.forEach((d, i) => { const x = x0 + 120 + i * (x1 - x0 - 240) / 2; line(g, [[x, y + 70], [x, y + 110]], C.gold, 4); txt(g, d + ' 发车', x, y + 150, C.gold, fnt(700, 24), 'center'); });
    const tx = LERP(x0 - 300, x0 + 120 + (x1 - x0 - 240) / 2 - 150, pop(st.tk, 1, 4));
    for (let c = 0; c < 3; c++) { rr(g, tx + c * 110, y, 100, 80, 10, 'rgba(14,20,36,.95)', C.b, 2.5); for (let k = 0; k < 4; k++) dot(g, tx + c * 110 + 20 + k * 20, y + 40, 6, [C.g, C.o, C.p, C.r][(c + k) % 4]); }
    al(g, pop(st.tk, 5), () => { txt(g, '赶不上：等下一班', x1 - 200, y - 90, C.fg2, fnt(700, 26), 'center'); dot(g, x1 - 200, y - 40, 10, C.o); });
    al(g, pop(st.tk, 7), () => txt(g, '节奏可预期，但每班车上的变更很多', R.x + R.w / 2, R.y + 600, C.fg, fnt(800, 30), 'center'));
    return;
  }
  const w = (R.w - 60) / 2, y = R.y + 60;
  [['大仓 monorepo', C.p], ['多仓 polyrepo', C.o]].forEach(([nm, col], i) => al(g, pop(st.tk, .4 + i * 2.5), () => { const x = R.x + i * (w + 60); rr(g, x, y, w, 500, 20, 'rgba(14,20,36,.94)', col, 2.5); txt(g, nm, x + 30, y + 50, col, fnt(800, 30));
    if (i === 0) { rr(g, x + 40, y + 100, w - 80, 300, 14, null, C.line2, 2); for (let k = 0; k < 12; k++) rr(g, x + 60 + (k % 4) * (w - 120) / 4, y + 120 + Math.floor(k / 4) * 90, (w - 120) / 4 - 14, 70, 8, col + '22', col, 1.5); txt(g, '改一处，看得到会影响谁', x + 30, y + 450, C.fg2, fnt(600, 22)); }
    else { for (let k = 0; k < 6; k++) { const xx = x + 40 + (k % 3) * (w - 80) / 3, yy = y + 110 + Math.floor(k / 3) * 150; rr(g, xx, yy, (w - 80) / 3 - 20, 120, 12, col + '22', col, 1.5); txt(g, 'v' + (1 + k % 3) + '.' + k, xx + ((w - 80) / 3 - 20) / 2, yy + 60, C.fg2, fnt(700, 22, 'mono'), 'center'); } txt(g, '各管各的，要管好版本依赖', x + 30, y + 450, C.fg2, fnt(600, 22)); } }));
};

AN.micro = (g, t, R, st) => {
  const N = [['用户', 300, 220, C.b], ['商品', 700, 140, C.p], ['购物车', 1100, 220, C.g], ['订单', 500, 470, C.o], ['支付', 900, 470, C.r], ['搜索', 1350, 450, C.p]];
  const E = [[0, 3], [1, 2], [2, 3], [3, 4], [1, 5], [0, 2]];
  const sc = Math.min(1, R.w / 1720);
  const P = i => [R.x + N[i][1] * sc, R.y + N[i][2]];
  E.forEach(([a, b]) => line(g, [P(a), P(b)], C.line2, 2));
  N.forEach(([nm, , , col], i) => { const [x, y] = P(i), upd = t > 2 + i * 1.2 && t < 3.2 + i * 1.2; al(g, 1, () => { rr(g, x - 90, y - 50, 180, 100, 16, upd ? 'rgba(255,210,122,.15)' : 'rgba(14,20,36,.95)', upd ? C.gold : col, upd ? 4 : 2.5); txt(g, nm, x, y - 10, C.fg, fnt(800, 28), 'center'); txt(g, 'v' + (t > 2.6 + i * 1.2 ? 2 : 1), x, y + 26, upd ? C.gold : C.fg3, fnt(700, 22, 'mono'), 'center'); }); });
  al(g, pop(t, 9), () => { rr(g, R.x + 20, R.y + 600, R.w - 40, 110, 16, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, '接口要兼容：v2 必须能和 v1 的邻居一起工作', R.x + R.w / 2, R.y + 655, C.fg, fnt(800, 32), 'center'); });
};

AN.k8s = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 60;
  rr(g, x, y, 380, 300, 18, '#0B1020', C.line2, 2); txt(g, '期望', x + 24, y + 36, C.fg3, fnt(700, 22));
  [['镜像', 'cart:1.4'], ['副本', '× 6']].forEach(([a, b], i) => { txt(g, a, x + 30, y + 110 + i * 80, C.fg2, fnt(600, 28)); txt(g, b, x + 350, y + 110 + i * 80, C.gold, fnt(800, 30, 'mono'), 'right'); });
  al(g, pop(t, 2), () => arrow(g, x + 400, y + 150, x + 500, y + 150, C.gold, 4, 14));
  const nx = x + 520; for (let n = 0; n < 3; n++) { const ny = y + n * 210 - 20; al(g, pop(t, 2.5 + n * .3), () => { rr(g, nx, ny, R.w - 560, 180, 16, 'rgba(14,20,36,.9)', C.line2, 2); txt(g, '机器 ' + (n + 1), nx + 24, ny + 30, C.fg3, fnt(700, 22)); }); }
  for (let i = 0; i < 6; i++) { const n = i % 3, k = Math.floor(i / 3), u = pop(t, 4 + i * .5, .5); pod(g, nx + 160 + k * 150, y + n * 210 + 25, 110, '1.4', C.b, u); }
  al(g, pop(t, 9), () => txt(g, '你说要什么，它来安排', nx + 500, y + 650, C.fg, fnt(800, 30)));
};

AN.rolling = (g, t, R, st) => {
  const x = R.x + 40, y = R.y + 120, s = 130, gap = 34, n = 4;
  txt(g, st.k === 0 ? '滚动更新：一个一个替换' : '健康检查决定“准备好了没有”', x, y - 60, C.fg, fnt(800, 32));
  // 时间轴：每个副本 i：新副本在 a_i 出现，ready 在 a_i+1，旧的在 a_i+1.2 消失
  const T = st.k === 0 ? st.tk : 99;
  for (let i = 0; i < n; i++) {
    const a = 1.2 + i * 2.2, appear = pop(T, a, .4), ready = T > a + 1.2, gone = pop(T, a + 1.4, .4);
    pod(g, x + i * (s + gap), y + 40, s, 'v1', C.b, 1 - gone);
    al(g, appear, () => { pod(g, x + i * (s + gap), y + 230, s, 'v2', ready ? C.g : C.fg3); if (!ready) { g.save(); g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); g.arc(x + i * (s + gap) + s / 2, y + 230 + s / 2, s * .38, T * 5, T * 5 + 4); g.stroke(); g.restore(); } });
  }
  txt(g, '旧', x - 30, y + 40 + s / 2, C.b, fnt(800, 26), 'right'); txt(g, '新', x - 30, y + 230 + s / 2, C.g, fnt(800, 26), 'right');
  const avail = st.k === 0 ? (() => { let c = 0; for (let i = 0; i < n; i++) { const a = 1.2 + i * 2.2; c += (T < a + 1.6 ? 1 : 0) + (T > a + 1.2 ? 1 : 0); } return Math.min(c, 5); })() : 4;
  txt(g, '可用副本：' + Math.max(4, avail), x, y + 440, C.ok, fnt(800, 30, 'mono'));
  if (st.k === 1) {
    const bx = x + n * (s + gap) + 40, bw = R.x + R.w - bx - 10;
    [['就绪检查', '通过 → 分流量给它', C.g], ['存活检查', '失败 → 重启它', C.o], ['新版起不来', '更新停在半路，旧的还在', C.bad]].forEach(([a, b, col], i) => al(g, pop(st.tk, .5 + i * 2.5), () => { const yy = y + 20 + i * 140; rr(g, bx, yy, bw, 116, 14, 'rgba(14,20,36,.95)', col, 2.5); txt(g, a, bx + 24, yy + 38, col, fnt(800, 28)); txt(g, b, bx + 24, yy + 82, C.fg2, fnt(600, 22)); }));
  }
};

AN.mesh = (g, t, R, st) => {
  const x = R.x + 30, y = R.y + 140;
  rr(g, x, y + 100, 200, 120, 16, 'rgba(14,20,36,.95)', C.fg2, 2.5); txt(g, '请求', x + 100, y + 160, C.fg, fnt(800, 30), 'center');
  const px = x + 380; rr(g, px, y + 90, 200, 140, 16, 'rgba(199,155,255,.1)', C.p, 3); txt(g, '代理', px + 100, y + 140, C.p, fnt(800, 30), 'center'); txt(g, 'sidecar', px + 100, y + 185, C.fg3, fnt(600, 20, 'mono'), 'center');
  arrow(g, x + 200, y + 160, px - 10, y + 160, C.fg3, 3);
  const vx = px + 420, rules = [['v1', '90%', C.b, 0], ['v2', '10%', C.g, 300]];
  rules.forEach(([v, p, col, dy]) => { rr(g, vx, y - 40 + dy, 260, 140, 16, col + '18', col, 3); txt(g, 'cart ' + v, vx + 130, y + 30 + dy, C.fg, fnt(800, 30, 'mono'), 'center'); arrow(g, px + 200, y + 160, vx - 10, y + 30 + dy, col, 3); txt(g, p, (px + 200 + vx) / 2, y + 95 + dy * .9 - 60, col, fnt(800, 28, 'mono'), 'center'); });
  for (let i = 0; i < 10; i++) { const ph = (t * .5 + i / 10) % 1, to = i === 3 ? 1 : 0; packet(g, [[x + 200, y + 160], [px + 100, y + 160], [vx, y + 30 + rules[to][3]]], ph, rules[to][2], 7); }
  al(g, pop(t, 6), () => { ['按百分比', '按用户', '按地区'].forEach((s, i) => chip(g, s, x + i * 190, y + 520, C.gold, pop(t, 6 + i * .5), 26)); });
};

AN.gitops = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 60, w = 420;
  rr(g, x, y, w, 330, 18, '#0B1020', C.p, 2.5); txt(g, 'Git 仓库（期望状态）', x + 24, y + 36, C.p, fnt(800, 24));
  const bump = st.k === 0 ? pop(st.tk, 5, .5) : 1;
  txt(g, 'image: cart:', x + 30, y + 120, C.fg2, fnt(600, 28, 'mono')); txt(g, bump > .5 ? '1.5' : '1.4', x + 250, y + 120, bump > .5 ? C.gold : C.fg, fnt(800, 30, 'mono'));
  txt(g, 'replicas: 4', x + 30, y + 180, C.fg2, fnt(600, 28, 'mono'));
  if (st.k === 2) { const rv = pop(st.tk, 3); al(g, rv, () => { rr(g, x + 20, y + 230, w - 40, 70, 12, 'rgba(255,178,92,.1)', C.o, 2); txt(g, 'git revert → 回到 1.4', x + 40, y + 265, C.o, fnt(700, 24, 'mono')); }); }
  const cx = x + w + 360, cw = R.x + R.w - cx;
  rr(g, cx, y, cw, 330, 18, 'rgba(14,20,36,.9)', C.b, 2.5); txt(g, '集群（实际状态）', cx + 24, y + 36, C.b, fnt(800, 24));
  // 控制器
  const ox = x + w + 180, oy = y + 165;
  g.save(); g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); g.arc(ox, oy, 70, t * 2, t * 2 + 5); g.stroke(); g.restore();
  txt(g, '控制器', ox, oy, C.gold, fnt(800, 24), 'center'); txt(g, '不停比较', ox, oy + 110, C.fg3, fnt(600, 20), 'center');
  arrow(g, x + w + 10, oy, ox - 80, oy, C.fg3, 3); arrow(g, ox + 80, oy, cx - 10, oy, C.fg3, 3);
  // 实际副本
  let actual = bump > .5 ? (st.k === 0 ? CL((st.tk - 6.5) / 3) : 1) : 0;
  let drift = st.k === 1 ? pop(st.tk, 4, .3) * (1 - pop(st.tk, 7, .5)) : 0;
  if (st.k === 2) actual = 1 - pop(st.tk, 4, 2);
  for (let i = 0; i < 4; i++) { const nw = actual * 4 > i + .5; const odd = i === 3 && drift > .5; pod(g, cx + 30 + i * (cw - 60) / 4, y + 110, Math.min(120, (cw - 60) / 4 - 20), odd ? '手改' : nw ? '1.5' : '1.4', odd ? C.bad : nw ? C.g : C.b); }
  if (st.k === 1) { al(g, drift, () => txt(g, '有人手动改了线上', cx + 30, y + 290, C.bad, fnt(700, 24))); al(g, pop(st.tk, 7.2), () => txt(g, '已自动拉回', cx + 30, y + 290, C.ok, fnt(700, 24))); }
  al(g, pop(t, 1.5), () => { const yy = y + 420; ['提交记录 = 变更记录', '合并请求 = 审查', '撤销提交 = 回滚'].forEach((s, i) => chip(g, s, x + i * 420, yy + 60, [C.p, C.b, C.o][i], st.k === 2 ? pop(st.tk, .5 + i * .8) : 0, 26)); });
};

AN.canary = (g, t, R, st) => {
  const x = R.x + 30, y = R.y + 40;
  const steps = [.01, .05, .25, 1], T = st.k === 0 ? st.tk : 99, si = T < 4 ? 0 : T < 7 ? 1 : T < 10 ? 2 : 3;
  const p = st.k === 0 ? steps[si] : .05;
  txt(g, '进入新版本的流量', x, y + 20, C.fg, fnt(800, 30));
  pctBar(g, x, y + 60, R.w - 240, 46, p, C.g, Math.round(p * 100) + '%');
  steps.forEach((s, i) => { const xx = x + (R.w - 240) * s; line(g, [[xx, y + 116], [xx, y + 134]], C.fg3, 2); txt(g, Math.round(s * 100) + '%', xx, y + 152, si >= i ? C.fg : C.fg3, fnt(600, 20, 'mono'), 'center'); });
  crowdDots(g, x + 10, y + 220, 25, 4, 34, Math.round(100 * p), C.g);
  // 指标对比
  const mx = x, my = y + 400, mw = R.w - 80;
  rr(g, mx, my, mw, 300, 16, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, '错误率', mx + 24, my + 34, C.fg2, fnt(700, 22));
  const bad = st.k === 1 && st.tk > 4;
  for (const [col, off, amp] of [[C.b, 0, 1], [C.g, 1, bad ? 4 : 1.1]]) { g.save(); g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); for (let i = 0; i <= 100; i++) { const xx = mx + 30 + i * (mw - 60) / 100, k = i / 100, spike = col === C.g && bad && k > .6 ? (k - .6) * 300 : 0, yy = my + 240 - 30 * amp * (.5 + .5 * Math.sin(i * .7 + off * 2) * HSH(i, off + 3)) - spike; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); g.restore(); }
  txt(g, '旧版', mx + mw - 160, my + 34, C.b, fnt(700, 22)); txt(g, '新版', mx + mw - 80, my + 34, C.g, fnt(700, 22));
  if (st.k === 1) { line(g, [[mx + 30, my + 150], [mx + mw - 30, my + 150]], C.bad, 2, [8, 8]); txt(g, '阈值', mx + 40, my + 135, C.bad, fnt(600, 20)); al(g, pop(st.tk, 6), () => { rr(g, mx + mw / 2 - 260, my + 60, 520, 70, 14, 'rgba(255,107,107,.15)', C.bad, 2.5); txt(g, '超过阈值：自动停止 · 自动回滚', mx + mw / 2, my + 95, C.bad, fnt(800, 26), 'center'); }); }
};

AN.flags = (g, t, R, st) => {
  const x = R.x + 30, y = R.y + 60;
  if (st.k === 0) {
    server(g, x, y + 40, 200, 230, '已部署 v2（含新功能）', C.g, 1, 'v2', C.g);
    rr(g, x + 300, y, 520, 330, 18, 'rgba(14,20,36,.95)', C.gold, 2.5); txt(g, '功能开关：新版结账', x + 330, y + 44, C.gold, fnt(800, 28));
    const ph = [[1, '员工', 2], [2, '杭州用户', 5], [3, '全部用户', 8]];
    ph.forEach(([i, nm, d]) => { const on = st.tk > d && !(i === 3 && st.tk > 11.5), yy = y + 60 + i * 75; txt(g, nm, x + 340, yy, C.fg, fnt(700, 26)); rr(g, x + 680, yy - 22, 90, 44, 22, on ? C.g : C.line2); dot(g, x + 702 + (on ? 46 : 0), yy, 18, C.fg); });
    al(g, pop(st.tk, 11.5), () => { txt(g, '出问题：一秒关掉，不用重新部署', x + 300, y + 400, C.bad, fnt(800, 28)); });
    return;
  }
  rr(g, x, y, R.w - 80, 480, 16, '#0B1020', C.line2, 2);
  const L = ['if (flag("new_checkout")) {', '  if (flag("checkout_v3")) {', '    if (flag("promo_2019")) { … }', '    else if (flag("old_ui")) { … }', '  } else { … }', '} else if (flag("legacy_pay")) { … }'];
  L.forEach((s, i) => al(g, pop(st.tk, .3 + i * .5), () => txt(g, s, x + 30, y + 60 + i * 60, i > 1 ? C.fg3 : C.fg, fnt(600, 26, 'mono'))));
  al(g, pop(st.tk, 4), () => txt(g, '用完不删 → 分支越堆越多', x + 30, y + 440, C.o, fnt(800, 28)));
  al(g, pop(st.tk, 7), () => { rr(g, x + R.w - 560, y + 330, 460, 120, 14, 'rgba(255,107,107,.12)', C.bad, 2.5); txt(g, '复用旧开关：45 分钟', x + R.w - 330, y + 372, C.bad, fnt(800, 28), 'center'); txt(g, '亏损 4 亿多美元（第三集）', x + R.w - 330, y + 414, C.fg2, fnt(600, 22), 'center'); });
};

AN.supply = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 60;
  const L = [['源代码', '', C.b], ['构建系统', '', C.p], ['发布包', '', C.gold], ['客户', '', C.g]];
  const X = stages(g, x, y, R.w - 40, 120, L, 3.99, { ticks: false, fs: 28 });
  if (st.k === 0) { al(g, pop(st.tk, 2), () => { const bx = X(1); dot(g, bx, y + 180, 22, C.bad); txt(g, '后门', bx, y + 230, C.bad, fnt(800, 26), 'center'); arrow(g, bx, y + 160, bx, y + 128, C.bad, 3); });
    for (let i = 0; i < 40; i++) al(g, pop(st.tk, 6 + i * .08, .3), () => person(g, X(3) - 140 + (i % 10) * 30, y + 220 + Math.floor(i / 10) * 60, C.bad + 'aa', .55));
    al(g, pop(st.tk, 9), () => txt(g, '签了名的“官方更新”，被成千上万客户自动安装', x, y + 520, C.fg, fnt(800, 28))); return; }
  if (st.k === 1) { al(g, pop(st.tk, .5), () => { const bx = X(0); dot(g, bx, y + 180, 22, C.bad); txt(g, '被植入的维护者', bx, y + 230, C.bad, fnt(700, 24), 'center'); });
    al(g, pop(st.tk, 3), () => { rr(g, x, y + 300, 600, 120, 14, 'rgba(14,20,36,.95)', C.gold, 2); txt(g, 'ssh 登录：0.1 秒 → 0.6 秒', x + 30, y + 345, C.gold, fnt(800, 28, 'mono')); txt(g, '一位工程师觉得不对劲', x + 30, y + 392, C.fg2, fnt(600, 22)); });
    al(g, pop(st.tk, 7), () => { chip(g, '拦截', X(2) - 40, y + 180, C.ok, 1, 28); txt(g, '在进入主流稳定版前被拦下', X(2) - 100, y + 520, C.ok, fnt(800, 28)); }); return; }
  const D = [['隔离构建', C.p], ['数字签名', C.gold], ['依赖清单 SBOM', C.b], ['部署前验签', C.g], ['流水线最小权限', C.o]];
  D.forEach(([s, col], i) => al(g, pop(st.tk, .5 + i * 1.6), () => { const yy = y + 200 + i * 90; check(g, x + 40, yy, s, 1, col, 28); }));
  al(g, pop(st.tk, 3), () => { lock(g, X(2), y + 220, 60, C.gold); });
};

AN.budget = (g, t, R, st) => {
  const x = R.x + 30, y = R.y + 50;
  if (st.k === 0) {
    txt(g, '目标：每月可用性 99.9%', x, y, C.fg, fnt(800, 32));
    txt(g, '错误预算 ≈ 43 分钟 / 月', x, y + 54, C.gold, fnt(800, 30, 'mono'));
    const used = CL((st.tk - 4) / 10) * .85, bw = R.w - 80;
    rr(g, x, y + 110, bw, 60, 12, 'rgba(255,255,255,.05)', C.line2, 2); rr(g, x, y + 110, bw * (1 - used), 60, 12, used > .7 ? C.o : C.ok);
    txt(g, '剩余 ' + Math.round(43 * (1 - used)) + ' 分钟', x + 20, y + 140, '#0B1020', fnt(800, 26));
    const w = (bw - 40) / 2;
    al(g, pop(st.tk, 5), () => { rr(g, x, y + 230, w, 200, 18, 'rgba(95,211,154,.08)', C.ok, 2.5); txt(g, '预算充足', x + 30, y + 280, C.ok, fnt(800, 30)); txt(g, '放心发布新功能', x + 30, y + 340, C.fg2, fnt(600, 26)); });
    al(g, pop(st.tk, 9), () => { rr(g, x + w + 40, y + 230, w, 200, 18, 'rgba(255,178,92,.08)', C.o, 2.5); txt(g, '预算快用完', x + w + 70, y + 280, C.o, fnt(800, 30)); txt(g, '暂停新功能，先修稳定性', x + w + 70, y + 340, C.fg2, fnt(600, 26)); });
    return;
  }
  if (st.k === 1) {
    const gw = R.w - 60, gh = 360; rr(g, x, y, gw, gh, 16, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, '错误率', x + 24, y + 34, C.fg2, fnt(700, 22));
    const deps = [.25, .55, .8]; deps.forEach((d, i) => { const dx = x + 30 + d * (gw - 60); line(g, [[dx, y + 60], [dx, y + gh - 20]], i === 1 ? C.bad : C.fg3, 2, [6, 6]); chip(g, ['v41', 'v42', 'v43'][i], dx - 30, y + 80, i === 1 ? C.bad : C.fg3, 1, 20); });
    const u = CL(st.tk / 6); g.save(); g.strokeStyle = C.g; g.lineWidth = 3.5; g.beginPath(); for (let i = 0; i <= 200 * u; i++) { const k = i / 200, xx = x + 30 + k * (gw - 60), sp = k > .55 && k < .68 ? 160 * Math.sin((k - .55) / .13 * Math.PI) : 0, yy = y + gh - 50 - 20 * HSH(i, 2) - sp; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); g.restore();
    al(g, pop(st.tk, 6.5), () => txt(g, '部署标记叠在监控图上：一眼看出是 v42', x, y + gh + 60, C.gold, fnt(800, 30)));
    return;
  }
  const S = [['值班', '轮流值守，告警找到人', C.b], ['恢复', '先止血，再查原因', C.o], ['复盘', '不追究个人：流程为什么允许出错？', C.p], ['改进', '把教训写进工具', C.g]];
  const X = stages(g, x, y + 120, R.w - 60, 170, S.map(s => [s[0], '', s[2]]), CL(st.tk / 2.5, 0, 3.99), { fs: 34 });
  S.forEach(([, b, col], i) => al(g, pop(st.tk, .5 + i * 2.5), () => wrapTxt(g, b, X(i) - 120, y + 360, 240, 34, C.fg2, fnt(600, 24))));
};

AN.platform = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 40;
  if (st.k === 0) {
    rr(g, x, y + 380, R.w - 40, 140, 18, 'rgba(199,155,255,.08)', C.p, 3); txt(g, '内部开发者平台', x + 30, y + 420, C.p, fnt(800, 30));
    ['构建', '部署', '监控', '密钥', '数据库'].forEach((s, i) => chip(g, s, x + 30 + i * 180, y + 480, C.p, pop(t, 1 + i * .3), 24));
    for (let i = 0; i < 5; i++) al(g, pop(t, 4 + i * .4), () => { const tx = x + 20 + i * (R.w - 80) / 5; rr(g, tx, y + 60, (R.w - 80) / 5 - 30, 160, 16, 'rgba(14,20,36,.95)', C.b, 2); txt(g, '业务团队 ' + 'ABCDE'[i], tx + ((R.w - 80) / 5 - 30) / 2, y + 110, C.fg, fnt(700, 24), 'center'); txt(g, '点几下 → 流水线', tx + ((R.w - 80) / 5 - 30) / 2, y + 170, C.g, fnt(600, 20), 'center'); arrow(g, tx + ((R.w - 80) / 5 - 30) / 2, y + 230, tx + ((R.w - 80) / 5 - 30) / 2, y + 370, C.fg3, 2); });
    return;
  }
  const days = 31, cw = (R.w - 60) / 7, ch = 90;
  txt(g, '变更日历（示意）', x, y + 10, C.fg, fnt(800, 30));
  for (let d = 0; d < 28; d++) { const cx = x + (d % 7) * cw, cy = y + 60 + Math.floor(d / 7) * (ch + 12), frz = d >= 17 && d <= 20; al(g, pop(st.tk, .3 + d * .03, .3), () => { rr(g, cx, cy, cw - 12, ch, 10, frz ? 'rgba(92,180,255,.18)' : 'rgba(14,20,36,.9)', frz ? C.b : C.line, frz ? 2.5 : 1); txt(g, String(d + 1), cx + 14, cy + 22, C.fg3, fnt(600, 18, 'mono')); if (!frz && HSH(d, 7) > .3) for (let k = 0; k < 1 + HSH(d, 8) * 4; k++) dot(g, cx + 24 + k * 22, cy + 60, 7, C.g); if (frz) txt(g, '封网', cx + (cw - 12) / 2, cy + 56, C.b, fnt(800, 24), 'center'); }); }
  al(g, pop(st.tk, 6), () => txt(g, '规则写进流水线：封网期间，普通变更自动拦下', x, y + 520, C.gold, fnt(800, 28)));
};

AN.crowd = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 40;
  if (st.k === 0) {
    fileIco(g, x, y + 20, 200, 240, '', C.gold); txt(g, '内容更新', x + 100, y + 290, C.gold, fnt(700, 24), 'center');
    for (let i = 0; i < 20; i++) rr(g, x + 24 + (i % 5) * 32, y + 60 + Math.floor(i / 5) * 40, 24, 24, 4, C.b + '88');
    al(g, pop(st.tk, 3), () => { rr(g, x + 24 + 0 * 32, y + 60 + 4 * 40, 24, 24, 4, C.bad); txt(g, '第 21 项', x + 230, y + 230, C.bad, fnt(800, 24)); txt(g, '程序只认 20 项', x + 230, y + 270, C.fg2, fnt(600, 22)); });
    const gx = x + 460, gw = R.x + R.w - gx - 10;
    for (let i = 0; i < 120; i++) { const cx = gx + (i % 15) * gw / 15, cy = y + 20 + Math.floor(i / 15) * 62, u = st.tk > 6 + HSH(i, 3) * 3; rr(g, cx, cy, gw / 15 - 10, 46, 6, u ? '#1050C8' : 'rgba(14,20,36,.9)', u ? '#4D8BFF' : C.line2, 1.5); if (u) txt(g, ':(', cx + (gw / 15 - 10) / 2, cy + 23, '#fff', fnt(800, 18, 'mono'), 'center'); }
    al(g, pop(st.tk, 9), () => txt(g, '约 850 万台 Windows 蓝屏', gx, y + 560, C.fg, fnt(800, 34)));
    al(g, pop(st.tk, 11), () => { ['航班', '医院', '银行'].forEach((s, i) => chip(g, s, gx + 480 + i * 120, y + 560, C.bad, 1, 24)); });
    return;
  }
  if (st.k === 1) {
    const cx = R.x + R.w / 2;
    const half = (R.w - 80) / 2;
    al(g, 1, () => { txt(g, '实际：几乎同时推给全部', x, y + 20, C.bad, fnt(800, 28)); rr(g, x, y + 50, half, 70, 12, C.bad); txt(g, '100%', x + half / 2, y + 85, '#fff', fnt(800, 30, 'mono'), 'center'); });
    al(g, pop(st.tk, 4), () => { const xx = x + half + 80; txt(g, '承诺：一圈一圈的部署环', xx, y + 20, C.ok, fnt(800, 28)); const cy = y + 330, ccx = xx + half / 2; [220, 160, 100, 45].forEach((r, i) => { g.save(); g.strokeStyle = [C.ok, C.g, C.b, C.gold][i]; g.globalAlpha = pop(st.tk, 4.5 + (3 - i) * .7); g.lineWidth = 6; g.beginPath(); g.arc(ccx, cy, r, 0, TAU); g.stroke(); g.restore(); }); txt(g, '内部', ccx, cy, C.gold, fnt(800, 22), 'center'); });
    al(g, pop(st.tk, 8), () => check(g, x, y + 400, '客户可以自己选择何时接收', 1, C.ok, 26));
    return;
  }
  const P = ['分批', '可观察', '能回退'];
  txt(g, '配置也是代码', x, y + 30, C.gold, fnt(900, 54, 'serif'));
  P.forEach((s, i) => chip(g, s, x + i * 170, y + 130, C.gold, pop(st.tk, 2 + i * .6), 30));
  al(g, pop(st.tk, 6), () => { const yy = y + 260; rr(g, x, yy, R.w - 40, 260, 18, 'rgba(14,20,36,.95)', C.o, 2.5); txt(g, '2025 年 11 月：自动生成的配置文件', x + 30, yy + 44, C.o, fnt(800, 28));
    const u = pop(st.tk, 8, 1.5); rr(g, x + 30, yy + 90, 200, 50, 8, C.b); txt(g, '约 60 项', x + 130, yy + 115, '#fff', fnt(800, 22), 'center'); rr(g, x + 30, yy + 160, 200 + 500 * u, 50, 8, C.bad); txt(g, '200 多项 → 超过上限', x + 60 + 200 + 500 * u, yy + 185, C.bad, fnt(800, 22)); txt(g, '全球大面积报错约 3 小时', x + 30, yy + 240, C.fg2, fnt(600, 22)); });
};

AN.life2 = (g, t, R, st) => {
  const items = [['Apache Mesos', 2010, 2025, C.o, '2025 退休'], ['Docker Swarm', 2015, null, C.b, '小众，仍在维护'], ['CoreOS Fleet', 2014, 2018, C.p, '停止'], ['Rancher Cattle', 2015, 2018, C.r, '转向 K8s'], ['Weaveworks', 2014, 2024, C.gold, '2024 关闭'], ['Kubernetes', 2014, null, C.g, '至今主流'], ['Argo CD / Flux', 2017, null, C.ok, '至今']];
  const RR = { x: R.x, y: R.y, w: R.w, h: st.k === 2 ? R.h - 140 : R.h };
  lifeChart(g, RR, i => st.k > 0 ? 1 : pop(t, .3 + i * .7, 1.2), items, 2009, 2026, [2010, 2015, 2020, 2025]);
  if (st.k === 2) al(g, pop(st.tk, .5), () => { let x = R.x + 40; ['下一集：', '电商大促', '金融系统', '游戏开服'].forEach((s, i) => { x += (i ? chip(g, s, x, R.y + R.h - 60, [C.fg2, C.gold, C.o, C.r][i], pop(st.tk, .5 + i * .6), 28) : (txt(g, s, x, R.y + R.h - 60, C.fg2, fnt(700, 28)), 130)) + 20; }); });
};
