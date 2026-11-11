// 第三集动画：不能出错的日子（电商大促、金融合规、游戏发服）
AN.open3 = (g, t, R, st) => {
  const P = [['购物节零点', '流量洪峰', C.gold, '00:00'], ['股市开盘', '每一秒都是钱', C.o, '09:30'], ['新游戏开服', '百万玩家涌入', C.r, '20:00']];
  const w = (R.w - 80) / 3;
  P.forEach(([a, b, col, tm], i) => al(g, st.k === 0 ? pop(st.tk, 1 + i * 2.2) : 1, () => { const x = R.x + i * (w + 40), y = R.y + 80; rr(g, x, y, w, 380, 22, 'rgba(14,20,36,.94)', col, 3); txt(g, tm, x + w / 2, y + 120, col, fnt(900, 80, 'mono'), 'center'); txt(g, a, x + w / 2, y + 230, C.fg, fnt(800, 40, 'serif'), 'center'); txt(g, b, x + w / 2, y + 290, C.fg2, fnt(600, 26), 'center');
    if (st.k === 1) txt(g, ['扛住洪峰', '监管与审计', '玩家体验'][i], x + w / 2, y + 450, col, fnt(800, 30), 'center'); }));
  if (st.k === 0) al(g, pop(st.tk, 8), () => txt(g, '出错的代价 ×100', R.x + R.w / 2, R.y + 560, C.bad, fnt(900, 50, 'serif'), 'center'));
};

AN.promo = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 30, W = R.w - 40, H = 300;
  // 流量曲线
  rr(g, x, y, W, H, 16, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, '流量', x + 20, y + 30, C.fg2, fnt(700, 22));
  const u = st.k === 0 ? CL(st.tk / 4) : 1;
  g.save(); g.strokeStyle = C.gold; g.lineWidth = 3.5; g.beginPath(); for (let i = 0; i <= 200 * u; i++) { const k = i / 200, peak = Math.exp(-((k - .78) ** 2) / .0006) * 220, yy = y + H - 40 - 25 - 12 * Math.sin(k * 30) * HSH(i, 1) - peak; const xx = x + 20 + k * (W - 40); i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); g.restore();
  if (u > .9) txt(g, '零点：平时的几十倍', x + .78 * W - 120, y + 50, C.gold, fnt(800, 24), 'right');
  // 封网带
  const fz0 = x + 20 + .55 * (W - 40), fz1 = x + 20 + .86 * (W - 40);
  al(g, pop(t, 3), () => { rr(g, fz0, y + 10, fz1 - fz0, H - 20, 10, 'rgba(92,180,255,.12)', C.b, 2); txt(g, '封网', (fz0 + fz1) / 2, y + H - 26, C.b, fnt(800, 26), 'center'); });
  const by = y + H + 50;
  if (st.k <= 1) { al(g, st.k === 1 ? 1 : 0, () => { txt(g, '平时：小步快跑，提前准备好功能', x, by, C.g, fnt(800, 28)); for (let i = 0; i < 26; i++) dot(g, x + 20 + i * ((fz0 - x - 40) / 26), by + 60, 8, C.g); txt(g, '封网期：保持验证过的稳定状态', fz0 - 40, by + 120, C.b, fnt(800, 28)); }); return; }
  if (st.k === 2) { const S = [['说明理由', C.fg2], ['多人审批', C.o], ['专人盯执行', C.gold]]; S.forEach(([s, col], i) => chip(g, s, x + i * 220, by + 10, col, pop(st.tk, .5 + i * .8), 26)); al(g, pop(st.tk, 5), () => { rr(g, x, by + 70, W, 170, 16, 'rgba(14,20,36,.95)', C.r, 2.5); txt(g, '作战室', x + 30, by + 112, C.r, fnt(800, 30)); for (let i = 0; i < 4; i++) { rr(g, x + 200 + i * ((W - 240) / 4), by + 90, (W - 240) / 4 - 20, 130, 10, '#0B1020', C.line2, 1.5); line(g, Array.from({ length: 20 }, (_, k) => [x + 210 + i * ((W - 240) / 4) + k * ((W - 240) / 4 - 40) / 19, by + 180 - 40 * HSH(k, i + 5)]), [C.g, C.gold, C.b, C.o][i], 2); } }); return; }
  // 解封
  txt(g, '解除封网：积压的改动一起涌上来', x, by, C.o, fnt(800, 28));
  for (let i = 0; i < 40; i++) { const k = i < 12 ? 0 : i < 26 ? 1 : 2, u2 = pop(st.tk, 3 + k * 2 + (i % 14) * .05, .3); al(g, u2, () => dot(g, fz1 + 30 + k * 130 + (i % 4) * 22, by + 60 + Math.floor((i % 14) / 4) * 26, 8, [C.g, C.gold, C.o][k])); }
  al(g, pop(st.tk, 3), () => { ['低风险先放', '再放大改动'].forEach((s, i) => chip(g, s, x + i * 230, by + 70, [C.g, C.o][i], 1, 24)); });
};

AN.stress = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 40;
  const N = ['浏览', '购物车', '下单', '库存', '支付'];
  const X = stages(g, x, y + 20, R.w - 40, 110, N.map((s, i) => [s, '', [C.b, C.g, C.gold, C.o, C.p][i]]), 4.99, { ticks: false, fs: 28, gap: 36 });
  if (st.k === 0) { for (let i = 0; i < 18; i++) packet(g, [[x, y + 75], [X(4), y + 75]], (t * .25 + i / 18) % 1, C.gold, 6);
    al(g, pop(st.tk, 6), () => { dot(g, X(3), y + 190, 18, C.bad); txt(g, '瓶颈常在服务之间', X(3) - 260, y + 260, C.bad, fnt(800, 28)); });
    al(g, pop(st.tk, 2), () => txt(g, '在线上环境里，整条链路一起压', x, y + 360, C.fg, fnt(800, 30))); return; }
  if (st.k === 1) { const mx = x, my = y + 200; rr(g, mx, my, 340, 80, 14, 'rgba(14,20,36,.95)', C.gold, 2.5); txt(g, '请求头：压测=1', mx + 170, my + 40, C.gold, fnt(800, 24, 'mono'), 'center');
    al(g, pop(st.tk, 2), () => { const tx = x + 520; rr(g, tx, my - 20, 380, 120, 14, 'rgba(14,20,36,.95)', C.g, 2); txt(g, '真实订单表', tx + 190, my + 40, C.g, fnt(700, 26), 'center'); rr(g, tx, my + 140, 380, 120, 14, 'rgba(255,210,122,.08)', C.gold, 2.5, ); txt(g, '影子表 shadow_orders', tx + 190, my + 200, C.gold, fnt(700, 24, 'mono'), 'center'); arrow(g, mx + 340, my + 40, tx - 10, my + 200, C.gold, 3); });
    al(g, pop(st.tk, 6), () => txt(g, '不影响真实订单和库存', x, y + 560, C.ok, fnt(800, 28))); return; }
  const bw = (R.w - 40) / 30;
  for (let i = 0; i < 30; i++) { const k = i / 29, m = 4 + Math.round(16 * Math.exp(-((k - .6) ** 2) / .02)); for (let j = 0; j < m; j++) al(g, pop(st.tk, 1 + i * .08, .3), () => rr(g, x + i * bw + 3, y + 560 - j * 18, bw - 6, 14, 3, j > 4 ? C.p : C.b)); }
  al(g, pop(st.tk, 3), () => { txt(g, '大促前扩容', x + .45 * (R.w - 40), y + 200, C.p, fnt(800, 26), 'center'); txt(g, '结束后缩回', x + .85 * (R.w - 40), y + 360, C.b, fnt(800, 26), 'center'); });
  al(g, pop(st.tk, 6), () => txt(g, '提前几个月采购 → 提前几天申请', x, y + 640, C.fg, fnt(800, 28)));
};

AN.degrade = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 30;
  if (st.k === 0) {
    rr(g, x, y, R.w - 40, 520, 18, '#0B1020', C.line2, 2); txt(g, '预案手册（示意）', x + 24, y + 36, C.fg3, fnt(700, 22));
    const L = [['支付超时 > 2 秒', '切换备用通道', '张工'], ['数据库 CPU > 90%', '开启只读降级', '李工'], ['流量超过 120%', '打开限流开关', '值班'], ['推荐服务故障', '返回默认列表', '王工']];
    L.forEach(([a, b, c], i) => al(g, pop(st.tk, .6 + i * 1.2), () => { const yy = y + 100 + i * 100; txt(g, a, x + 40, yy, C.o, fnt(700, 26)); txt(g, '→ ' + b, x + 400, yy, C.fg, fnt(700, 26)); chip(g, c, x + R.w - 200, yy, C.b, 1, 22); line(g, [[x + 30, yy + 45], [x + R.w - 70, yy + 45]], C.line, 1); }));
    return;
  }
  const cx = x + 220, cy = y + 260;
  txt(g, '限流', x, y + 20, C.o, fnt(800, 32));
  rr(g, cx - 80, cy - 120, 160, 240, 16, 'rgba(14,20,36,.95)', C.g, 3); txt(g, '核心系统', cx, cy, C.g, fnt(800, 26), 'center');
  for (let i = 0; i < 14; i++) { const ph = (t * .5 + i / 14) % 1, ok = i % 3 !== 0, yy = cy - 90 + (i % 7) * 30; if (ok) packet(g, [[x, yy], [cx - 80, yy]], ph, C.gold, 6); else { const px = LERP(x, cx - 160, Math.min(ph * 1.5, 1)); dot(g, px, yy, 6, C.bad); } }
  line(g, [[cx - 120, cy - 130], [cx - 120, cy + 130]], C.o, 4, [10, 8]);
  const dx = x + 520;
  txt(g, '降级', dx, y + 20, C.p, fnt(800, 32));
  const F = [['下单', true], ['支付', true], ['商品评论', false], ['个性化推荐', false], ['历史足迹', false]];
  F.forEach(([s, core], i) => { const off = !core && st.tk > 4 + i * .6; al(g, 1, () => { const yy = y + 80 + i * 90; rr(g, dx, yy, 360, 70, 12, off ? 'rgba(14,20,36,.6)' : 'rgba(14,20,36,.95)', core ? C.g : off ? C.line2 : C.p, 2.5); txt(g, s, dx + 24, yy + 35, off ? C.fg3 : C.fg, fnt(700, 26)); rr(g, dx + 270, yy + 15, 70, 40, 20, off ? C.line2 : core ? C.g : C.p); dot(g, dx + 290 + (off ? 0 : 30), yy + 35, 15, C.fg); }); });
};

AN.cells = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 30;
  if (st.k === 0) {
    const cities = ['杭州', '上海', '深圳', '北京'], w = (R.w - 100) / 4;
    cities.forEach((c, i) => { const bad = st.tk > 5 && i === 1; al(g, pop(st.tk, .5 + i * .6), () => { const xx = x + i * (w + 20); rr(g, xx, y + 60, w, 340, 18, bad ? 'rgba(255,107,107,.1)' : 'rgba(14,20,36,.95)', bad ? C.bad : C.g, 2.5); txt(g, '单元 · ' + c, xx + w / 2, y + 100, bad ? C.bad : C.g, fnt(800, 26), 'center'); ['下单', '支付', '库存'].forEach((s, k) => { rr(g, xx + 30, y + 140 + k * 76, w - 60, 60, 10, bad ? 'rgba(255,107,107,.1)' : 'rgba(95,224,160,.08)', bad ? C.bad : C.line2, 1.5); txt(g, s, xx + w / 2, y + 170 + k * 76, C.fg2, fnt(600, 22), 'center'); }); }); });
    al(g, pop(st.tk, 6.5), () => { const xx = x + w + 20 + w / 2; arrow(g, xx, y + 420, xx - 160, y + 520, C.gold, 3); arrow(g, xx, y + 420, xx + 160, y + 520, C.gold, 3); txt(g, '这部分用户切到其他单元', xx, y + 570, C.gold, fnt(800, 28), 'center'); });
    return;
  }
  const cx = x + (R.w - 40) / 2, cy = y + 280;
  for (let i = 0; i < 8; i++) { const a = i / 8 * TAU, sx = cx + Math.cos(a) * 260, sy = cy + Math.sin(a) * 200, kill = st.tk > 2 + i * 1.1 && st.tk < 3.2 + i * 1.1 && i % 3 === 0; server(g, sx - 50, sy - 55, 100, 110, '', kill ? C.bad : C.g); if (kill) cross(g, sx, sy, 1, C.bad, 30); }
  al(g, pop(st.tk, 1.5), () => { g.save(); g.translate(cx, cy); g.rotate(Math.sin(t * 2) * .2); rr(g, -90, -40, 180, 80, 40, 'rgba(255,107,107,.15)', C.bad, 3); txt(g, '混沌猴', 0, 0, C.bad, fnt(900, 34), 'center'); g.restore(); });
  al(g, pop(st.tk, 5), () => txt(g, '主动制造故障：真出事时，大家已经练过很多遍', x, y + 600, C.fg, fnt(800, 28)));
};

AN.sod = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 60, w = (R.w - 120) / 3;
  const P = [['开发', '写代码', C.b], ['审批人', '审查 · 批准', C.gold], ['运维 / 发布', '执行上线', C.g]];
  P.forEach(([a, b, col], i) => al(g, pop(t, 1 + i * 1.2), () => { const xx = x + i * (w + 60); rr(g, xx, y, w, 300, 20, 'rgba(14,20,36,.95)', col, 2.5); person(g, xx + w / 2, y + 110, col, 1.6); txt(g, a, xx + w / 2, y + 210, C.fg, fnt(800, 30), 'center'); txt(g, b, xx + w / 2, y + 255, C.fg2, fnt(600, 22), 'center'); if (i < 2) arrow(g, xx + w + 8, y + 150, xx + w + 52, y + 150, C.fg3, 3); }));
  al(g, pop(t, 6), () => { const yy = y + 380; g.save(); g.setLineDash([10, 8]); g.strokeStyle = C.bad; g.lineWidth = 3; g.beginPath(); g.moveTo(x + w / 2, y + 300); g.quadraticCurveTo(x + R.w / 2, yy + 120, x + 2 * (w + 60) + w / 2, y + 300); g.stroke(); g.restore(); cross(g, x + (R.w - 40) / 2, yy + 58, 1, C.bad, 24); txt(g, '写代码的人不能自己推上生产', x + (R.w - 40) / 2, yy + 140, C.bad, fnt(800, 30), 'center'); });
  al(g, pop(t, 3), () => { ['可追溯', '经审批', '职责分离'].forEach((s, i) => chip(g, s, x + i * 190, y + 640, C.gold, 1, 26)); });
};

AN.window = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 40, W = R.w - 40;
  if (st.bi === 1) {
    rr(g, x, y, 460, 380, 18, 'rgba(14,20,36,.95)', C.gold, 2.5); txt(g, '变更评审会', x + 30, y + 44, C.gold, fnt(800, 30));
    ['#231 支付限额调整', '#232 核心账务补丁', '#233 报表新字段'].forEach((s, i) => check(g, x + 30, y + 120 + i * 80, s, pop(st.tk, 1 + i), C.ok, 24));
    al(g, pop(st.tk, 4), () => { const tx = x + 520, tw = W - 520; txt(g, '维护窗口', tx, y + 20, C.b, fnt(800, 28)); for (let h = 0; h < 24; h++) { const win = h >= 1 && h < 5; rr(g, tx + h * tw / 24, y + 60, tw / 24 - 4, 100, 4, win ? 'rgba(92,180,255,.4)' : 'rgba(14,20,36,.9)', win ? C.b : C.line, 1); if (h % 6 === 0) txt(g, h + ':00', tx + h * tw / 24, y + 190, C.fg3, fnt(600, 18, 'mono')); }
      ['回退方案', '业务验证'].forEach((s, i) => check(g, tx, y + 270 + i * 70, s, pop(st.tk, 6 + i), C.ok, 26)); });
    return;
  }
  if (st.bi === 2) {
    txt(g, '流水线自动留痕', x, y + 20, C.g, fnt(800, 32));
    rr(g, x, y + 60, W, 420, 16, '#0B1020', C.line2, 2);
    const L = ['2026-11-10 01:12  审批通过   by 王审批（工单 #232）', '2026-11-10 01:14  测试报告   1,284 项通过', '2026-11-10 01:20  部署 v8.3.1  by 发布机器人', '2026-11-10 01:31  业务验证   by 李业务', '2026-11-10 01:32  变更关闭'];
    L.forEach((s, i) => al(g, pop(st.tk, .5 + i * 1), () => txt(g, s, x + 30, y + 120 + i * 72, i === 2 ? C.gold : C.fg, fnt(600, Math.min(24, W / 46), 'mono'))));
    al(g, pop(st.tk, 7), () => txt(g, '审计看证据，不看会议纪要', x, y + 560, C.gold, fnt(800, 30)));
    return;
  }
  if (st.bi === 3) {
    const cw = (W - 80) / 3;
    [['同城机房 A', '运行', C.g], ['同城机房 B', '运行', C.g], ['异地灾备中心', '备份', C.b]].forEach(([a, b, col], i) => al(g, pop(st.tk, .5 + i * 1), () => { const xx = x + i * (cw + 40), yy = y + (i === 2 ? 60 : 60); rr(g, xx, yy, cw, 230, 18, 'rgba(14,20,36,.95)', col, 2.5); txt(g, a, xx + cw / 2, yy + 44, col, fnt(800, 28), 'center'); [0, 1].forEach(k => server(g, xx + cw / 2 - 110 + k * 120, yy + 80, 100, 110, '', col)); txt(g, b, xx + cw / 2, yy + 260, C.fg2, fnt(600, 22), 'center'); }));
    al(g, pop(st.tk, 4), () => { txt(g, '定期真的切过去演练', x, y + 420, C.gold, fnt(800, 28)); });
    al(g, pop(st.tk, 8), () => { rr(g, x, y + 480, W, 110, 14, 'rgba(255,107,107,.08)', C.bad, 2); txt(g, '迁移准备不足：上百万用户数天无法正常使用网银', x + 30, y + 535, C.bad, fnt(700, 26)); });
    return;
  }
  // 证券
  const tw = W, ty = y + 80;
  txt(g, '交易日', x, y + 20, C.fg, fnt(800, 30));
  rr(g, x, ty, tw, 90, 10, 'rgba(14,20,36,.9)', C.line2, 2);
  rr(g, x + tw * .2, ty, tw * .45, 90, 10, 'rgba(255,178,92,.25)', C.o, 2); txt(g, '交易时段：不部署', x + tw * .425, ty + 45, C.o, fnt(800, 26), 'center');
  rr(g, x + tw * .72, ty, tw * .2, 90, 10, 'rgba(95,211,154,.25)', C.ok, 2); txt(g, '收盘后部署', x + tw * .82, ty + 45, C.ok, fnt(800, 24), 'center');
  rr(g, x + tw * .1, ty, tw * .09, 90, 10, 'rgba(92,180,255,.25)', C.b, 2); txt(g, '开盘前验证', x + tw * .145, ty + 130, C.b, fnt(700, 20), 'center');
  al(g, pop(st.tk, 4), () => { const bx = x + 40, by = y + 340; rr(g, bx, by, 220, 220, 110, '#3A0F14', C.bad, 6); txt(g, '总开关', bx + 110, by + 95, '#fff', fnt(900, 36), 'center'); txt(g, 'STOP', bx + 110, by + 145, C.bad, fnt(900, 30, 'mono'), 'center'); txt(g, '能立刻停止所有交易', bx + 280, by + 110, C.fg, fnt(800, 30)); });
};

AN.knight = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 40;
  const sw = (R.w - 40 - 7 * 20) / 8;
  for (let i = 0; i < 8; i++) { const done = st.k > 0 || st.tk > 2 + i * .8, miss = i === 7; const bad = miss && (st.k >= 1 && st.tk > 4 || st.k === 2);
    server(g, x + i * (sw + 20), y + 80, sw, 200, '', bad ? C.bad : miss && done ? C.fg3 : done ? C.g : C.fg3, 1, miss ? 'v旧' : done ? 'v新' : 'v旧', bad ? C.bad : miss ? C.fg3 : done ? C.g : C.fg3); }
  if (st.k === 0) { txt(g, '8 台服务器 · 人工逐台拷贝', x, y + 20, C.fg, fnt(800, 30)); al(g, pop(st.tk, 8.5), () => { txt(g, '漏了这一台', x + 7 * (sw + 20) + sw / 2, y + 340, C.bad, fnt(800, 28), 'center'); txt(g, '没有人复核', x + 7 * (sw + 20) + sw / 2, y + 384, C.fg2, fnt(600, 22), 'center'); }); return; }
  if (st.k === 1) {
    txt(g, '复用的旧开关 → 唤醒停用多年的老代码', x, y + 20, C.bad, fnt(800, 30));
    const gy = y + 360, gw = R.w - 40, gh = 300; rr(g, x, gy, gw, gh, 16, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, '累计亏损（美元）', x + 20, gy + 30, C.fg2, fnt(700, 22));
    const u = CL((st.tk - 3) / 8); g.save(); g.strokeStyle = C.bad; g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= 100 * u; i++) { const k = i / 100, xx = x + 30 + k * (gw - 60), yy = gy + 60 + (gh - 90) * (k ** 1.2) + 6 * Math.sin(i * 1.7); i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); g.restore();
    txt(g, Math.round(45 * u) + ' 分钟', x + gw - 30, gy + 34, C.fg, fnt(800, 26, 'mono'), 'right');
    al(g, pop(st.tk, 11), () => txt(g, '≈ 4.4 亿美元', x + 40, gy + gh - 44, C.bad, fnt(900, 44, 'mono')));
    return;
  }
  const L = [['人工部署', '自动化部署'], ['没有复核', '审查与校验'], ['旧代码没删', '及时清理'], ['开关被复用', '开关用完即删'], ['无法一键停止', '总开关 / 回滚']];
  L.forEach(([a, b], i) => al(g, pop(st.tk, .5 + i * 1.2), () => { const yy = y + 340 + i * 72; cross(g, x + 20, yy, 1, C.bad, 12); txt(g, a, x + 50, yy, C.fg, fnt(700, 28)); txt(g, '→', x + 330, yy, C.fg3, fnt(700, 28)); txt(g, b, x + 380, yy, C.ok, fnt(700, 28)); }));
};

AN.gamemaint = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 40;
  if (st.k === 0) {
    const S = [['公告', '提前通知'], ['踢下线', '到点停服'], ['更新', '程序 + 数据'], ['开服', '重新开放'], ['补偿', '发放奖励']];
    const ph = CL((st.tk - .5) / 2, 0, 4.99);
    const X = stages(g, x, y + 40, R.w - 40, 140, S.map((s, i) => [s[0], s[1], [C.gold, C.o, C.b, C.g, C.p][i]]), ph, { fs: 32 });
    const n = st.tk < 4 ? 60 : st.tk < 7.5 ? 0 : 60;
    for (let i = 0; i < 60; i++) al(g, i < n ? 1 : .15, () => person(g, x + 40 + (i % 20) * ((R.w - 120) / 19), y + 300 + Math.floor(i / 20) * 70, i < n ? C.fg2 : C.line2, .6));
    al(g, pop(st.tk, 4), () => txt(g, '每周四 06:00–10:00 维护（示意）', x, y + 560, C.fg, fnt(700, 28)));
    return;
  }
  const w = (R.w - 80) / 2;
  [['v1 服务器内存', [['玩家位置', '(102, 33)'], ['战斗', '第 3 回合'], ['背包', '12 件']]], ['v2 数据结构', [['玩家位置', '(x, y, 层)'], ['战斗', '新技能系统'], ['背包', '分页 + 堆叠']]]].forEach(([nm, rows], i) => al(g, pop(st.tk, .5 + i * 2), () => { const xx = x + i * (w + 40); rr(g, xx, y + 20, w, 380, 18, 'rgba(14,20,36,.95)', i ? C.g : C.b, 2.5); txt(g, nm, xx + 30, y + 64, i ? C.g : C.b, fnt(800, 28)); rows.forEach(([a, b], j) => { txt(g, a, xx + 40, y + 150 + j * 80, C.fg2, fnt(600, 26)); txt(g, b, xx + w - 40, y + 150 + j * 80, C.fg, fnt(700, 26, 'mono'), 'right'); }); }));
  al(g, pop(st.tk, 5), () => { cross(g, x + w + 20, y + 210, 1, C.bad, 22); txt(g, '边玩边换：结构对不上', x + w + 20, y + 470, C.bad, fnt(800, 30), 'center'); });
  al(g, pop(st.tk, 9), () => txt(g, '不停服更新也能做，但代价很高', x + w + 20, y + 540, C.fg2, fnt(700, 26), 'center'));
};

AN.hotfix = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 30;
  if (st.k === 0) {
    const sx = x + R.w / 2 - 120; server(g, sx + 20, y + 20, 200, 220, '游戏服务器', C.b, 1, 'v3.2', C.gold);
    [['v3.2', C.g], ['v3.1', C.o], ['v3.0', C.o], ['v2.9', C.bad]].forEach(([v, col], i) => { const px = x + 60 + i * (R.w - 160) / 3, py = y + 360; rr(g, px - 50, py, 100, 170, 16, 'rgba(14,20,36,.95)', col, 3); txt(g, v, px, py + 85, col, fnt(800, 28, 'mono'), 'center'); line(g, [[px, py], [sx + 120, y + 240]], col + '88', 2, [6, 6]); if (i === 3) al(g, pop(st.tk, 4), () => txt(g, '强制更新', px, py + 210, C.bad, fnt(800, 24), 'center')); });
    al(g, pop(st.tk, 7), () => { chip(g, '资源热更：地图 · 角色（CDN 下载）', x, y + 640, C.g, 1, 24); chip(g, '脚本热更：玩法逻辑', x + 500 * Math.min(1, R.w / 1300), y + 640, C.p, 1, 24); });
    return;
  }
  if (st.k === 1) {
    [['测试服 / 体验服', '少量愿意尝鲜的玩家', C.o, 12], ['正式服', '全部玩家', C.g, 60]].forEach(([a, b, col, n], i) => al(g, pop(st.tk, .5 + i * 3), () => { const xx = x + i * (R.w / 2), w = R.w / 2 - 60; rr(g, xx, y + 40, w, 400, 18, 'rgba(14,20,36,.95)', col, 2.5); txt(g, a, xx + 30, y + 86, col, fnt(800, 30)); txt(g, b, xx + 30, y + 130, C.fg2, fnt(600, 24)); crowdDots(g, xx + 40, y + 200, 10, 6, Math.min(36, (w - 60) / 10), n, col); if (!i) arrow(g, xx + w + 6, y + 240, xx + w + 54, y + 240, C.gold, 4, 14); }));
    return;
  }
  const S = [['提交补丁', C.b], ['平台认证测试', C.o], ['通过', C.ok], ['推送', C.g]];
  stages(g, x, y + 100, R.w - 40, 120, S.map(s => [s[0], '', s[1]]), CL(st.tk / 2, 0, 3.99), { fs: 26 });
  al(g, pop(st.tk, 3), () => txt(g, '往往要好几天', x + (R.w - 40) * .37, y + 280, C.o, fnt(800, 28), 'center'));
  al(g, pop(st.tk, 6), () => { [['手机 / 电脑', 1, C.g], ['主机', 4, C.o]].forEach(([a, d, col], i) => { const yy = y + 380 + i * 90; txt(g, a, x, yy, C.fg, fnt(700, 26)); rr(g, x + 220, yy - 20, (R.w - 300) * d / 5, 40, 10, col); txt(g, d + ' 天（示意）', x + 240 + (R.w - 300) * d / 5, yy, col, fnt(700, 22)); }); });
};

AN.newsrv = (g, t, R, st) => {
  const x = R.x + 20, y = R.y + 30;
  if (st.k === 0) {
    const S = [['1 服', 900, 3], ['2 服', 700, 2], ['3 服', 300, 1], ['新 4 服', 0, 0]];
    S.forEach(([nm, , o], i) => { const cnt = i === 3 ? Math.floor(CL((st.tk - 2) / 4) * 40) : [14, 10, 4][i] * (st.tk > 9 && i > 0 ? 0 : 1) + (st.tk > 9 && i === 0 ? 14 : 0); const xx = x + i * ((R.w - 40) / 4); al(g, i === 3 ? pop(st.tk, 1) : 1, () => { rr(g, xx, y + 40, (R.w - 40) / 4 - 30, 440, 18, 'rgba(14,20,36,.95)', i === 3 ? C.gold : C.b, i === 3 ? 3.5 : 2); txt(g, nm, xx + 30, y + 86, i === 3 ? C.gold : C.fg, fnt(800, 30)); crowdDots(g, xx + 40, y + 150, 6, 7, 40, cnt, i === 3 ? C.gold : C.b, 'rgba(163,174,195,.08)'); }); });
    al(g, pop(st.tk, 9), () => txt(g, '人少的老服：合服', x + (R.w - 40) * .25, y + 540, C.b, fnt(800, 28), 'center'));
    al(g, pop(st.tk, 3), () => txt(g, '开服 = 带着高峰流量的上线', x + (R.w - 40) * .78, y + 540, C.gold, fnt(800, 28), 'center'));
    return;
  }
  const cx = x + (R.w - 40) / 2, cy = y + 260;
  glow(g, cx, cy, 260, 'rgba(92,180,255,.15)'); g.save(); g.strokeStyle = C.b; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, 200, 0, TAU); g.stroke(); g.restore();
  for (let i = 0; i < 120; i++) { const a = HSH(i, 1) * TAU, r = Math.sqrt(HSH(i, 2)) * 190; dot(g, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, C.fg2); }
  txt(g, '全球同服', cx, cy - 240, C.b, fnt(800, 34), 'center');
  al(g, pop(st.tk, 5), () => { g.save(); g.globalAlpha *= .3 + .3 * Math.sin(t * 6); g.fillStyle = C.gold; g.beginPath(); g.arc(cx, cy, 200, 0, TAU); g.fill(); g.restore(); txt(g, '每次更新影响全部玩家', cx, cy + 270, C.gold, fnt(800, 30), 'center'); });
};

AN.life3 = (g, t, R, st) => {
  const items = [['熔断库 Hystrix', 2012, 2018, C.o, '维护模式'], ['iOS 热修复 JSPatch', 2015, 2017, C.r, '2017 被警告'], ['Lua 脚本热更', 2012, null, C.p, '仍常见'], ['限流 Sentinel', 2018, null, C.g, '至今'], ['全链路压测', 2013, null, C.gold, '大促标配']];
  const RR = { x: R.x, y: R.y, w: R.w, h: st.k === 1 ? R.h - 160 : R.h };
  lifeChart(g, RR, i => st.k > 0 ? 1 : pop(t, .3 + i * .8, 1.2), items, 2010, 2026, [2010, 2015, 2020, 2025]);
  if (st.k === 1) al(g, pop(st.tk, 1), () => txt(g, '部署方式，要和出错的代价相匹配', R.x + 40, R.y + R.h - 80, C.gold, fnt(800, 34)));
};
