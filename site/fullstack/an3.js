// 下集动画：维护
AN.maint = (g, t, R) => {
  hdr(g, R, '上线之后的几个月 · 几年');
  const x0 = R.x + 260, x1 = R.x + R.w - 30, y = R.y + 140; const L = [['一直可用', C.g], ['数据安全', C.b], ['账单可控', C.o], ['不断加功能', C.p]];
  g.save(); g.globalAlpha = pop(t, .2); rr(g, x0 - 10, y - 30, 30, 30 + L.length * 120, 8, 'rgba(255,210,122,.15)', C.gold); txt(g, '上线', x0 + 5, y - 52, C.gold, fnt(800, 24), 'center'); ['1 个月', '6 个月', '1 年', '2 年'].forEach((s, i) => txt(g, s, LERP(x0 + 100, x1, (i + 1) / 4), y - 52, C.fg3, fnt(500, 20), 'center')); g.restore();
  L.forEach(([a, col], i) => { const Y = y + i * 120, u = pop(t, .5 + i * .4); g.save(); g.globalAlpha = u; txt(g, a, R.x + 20, Y + 40, col, fnt(800, 28)); rr(g, x0 + 30, Y + 14, (x1 - x0 - 30) * SS(CL((t - .5 - i * .4) / 2.5)), 52, 12, 'rgba(255,255,255,.03)', col, 2); g.restore(); });
  banner(g, R, '上线只是开始', pop(t, 4));
};
// ---- 可观测性 ----
AN.signals = (g, t, R) => {
  const cx = R.x + R.w / 2, cy = R.y + 400; node(g, cx - 140, cy - 60, 280, 120, '一次报名请求', C.gold, pop(t, .1), 'req_8f3a');
  const S = [['日志', '做了什么', C.b, -1, -1], ['指标', '多少 · 多快 · 多少错', C.g, 1, -1], ['链路追踪', '经过了哪些服务', C.p, -1, 1], ['错误上报', '哪里抛了异常 · 影响多少人', C.r, 1, 1], ['真实用户监控', '用户浏览器里有多快', C.o, 0, -1.6]];
  S.forEach(([a, b, col, dx, dy], i) => { const u = pop(t, .8 + i * 1.6); const w = 400, h = 150, x = cx + dx * 430 - w / 2, y = cy + dy * 210 - h / 2 + (dy === -1.6 ? 20 : 0); g.save(); g.globalAlpha = u; line(g, [[cx, cy], [x + w / 2, y + h / 2]], C.line2, 2); rr(g, x, y, w, h, 16, 'rgba(14,20,36,.95)', col, 2.5); txt(g, a, x + 24, y + 36, col, fnt(800, 28)); txt(g, b, x + 24, y + 76, C.fg2, fnt(500, 21));
    if (i === 0) ['12:03:41 POST /api/register 201', '12:03:41 checkout created'].forEach((l, j) => txt(g, l, x + 24, y + 108 + j * 24, C.fg3, fnt(500, 15, 'mono')));
    if (i === 1) for (let j = 0; j < 14; j++) rr(g, x + 24 + j * 25, y + 132 - (12 + 20 * Math.abs(Math.sin(j * 1.3))), 16, 12 + 20 * Math.abs(Math.sin(j * 1.3)), 3, C.g);
    if (i === 2) [[0, 340], [20, 120], [150, 160], [320, 30]].forEach(([a0, l], j) => rr(g, x + 24 + a0 * .9, y + 98 + j * 11, l * .9, 8, 3, C.p));
    if (i === 3) txt(g, 'TypeError · 37 次 · 12 人', x + 24, y + 116, C.r, fnt(600, 18, 'mono'));
    if (i === 4) txt(g, 'LCP 1.8 s · INP 120 ms（示意）', x + 24, y + 116, C.o, fnt(600, 18, 'mono')); g.restore(); });
};
AN.alerts = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '告警要克制');
    const noisy = Math.min(14, Math.floor(t * 3)); for (let i = 0; i < noisy; i++) { const x = R.x + 20 + (i % 2) * 220, y = R.y + 100 + Math.floor(i / 2) * 70; g.save(); g.globalAlpha = t > 6 ? .25 : 1; rr(g, x, y, 200, 54, 10, 'rgba(255,107,107,.08)', C.bad, 1.5); txt(g, ['CPU 61%', '慢查询 1 次', '404 增加', '内存 70%', '重试 1 次', '磁盘 40%', '延迟抖动'][i % 7], x + 16, y + 27, C.fg2, fnt(500, 19)); g.restore(); }
    if (t > 6) { g.save(); g.globalAlpha = pop(t, 6); txt(g, '→ 很快被习惯性忽略', R.x + 20, R.y + 620, C.fg3, fnt(600, 22)); g.restore(); }
    const X = R.x + 520, w = (R.w - 540 - 20) / 2;
    card(g, X, R.y + 100, w, 280, '用户受影响了', ['报名接口错误率超过阈值', '支付成功但未入账', '页面打不开'], C.r, pop(t, 7), false, 22);
    card(g, X + w + 20, R.y + 100, w, 280, '马上要出事了', ['磁盘快满', '证书快过期', '数据库连接接近上限'], C.o, pop(t, 9), false, 22);
    g.save(); g.globalAlpha = pop(t, 11); rr(g, X, R.y + 410, 2 * w + 20, 120, 16, 'rgba(14,20,36,.92)', C.fg3, 2); txt(g, '其余：放进看板，定期看', X + 24, R.y + 470, C.fg2, fnt(700, 26)); g.restore(); return;
  }
  hdr(g, R, '一个人值班：告警分级');
  const tk = st.tk; const L = [['紧急', '推送到手机 / 打电话', C.r, '用户受影响'], ['一般', '进邮件，第二天处理', C.o, '马上要出事'], ['信息', '看板', C.fg3, '其余']];
  L.forEach(([a, b, col, c], i) => { const y = R.y + 120 + i * 140, u = pop(tk, .4 + i * .6); g.save(); g.globalAlpha = u; rr(g, R.x + 20, y, 300, 110, 16, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, R.x + 50, y + 40, col, fnt(800, 30)); txt(g, c, R.x + 50, y + 80, C.fg3, fnt(500, 20)); arrow(g, R.x + 330, y + 55, R.x + 430, y + 55, C.fg3, 3, 12); txt(g, b, R.x + 450, y + 55, C.fg, fnt(700, 26)); g.restore(); });
  g.save(); g.globalAlpha = pop(tk, 6); rr(g, R.x + R.w - 420, R.y + 120, 380, 400, 16, '#0B1020', C.b, 2); txt(g, 'runbook.md', R.x + R.w - 396, R.y + 156, C.b, fnt(700, 22, 'mono')); ['回滚：…', '关闭功能：…', '支付后台：…', '邮件后台：…', '联系人：…'].forEach((s, i) => txt(g, s, R.x + R.w - 396, R.y + 216 + i * 52, C.fg2, fnt(500, 22))); txt(g, '出远门前交给一个能看懂的人', R.x + R.w - 396, R.y + 490, C.fg3, fnt(500, 18)); g.restore();
};
// ---- 事故 ----
const PH = [['发现', C.r], ['止损', C.o], ['定位', C.b], ['恢复', C.g], ['复盘', C.p]];
function phases(g, R, cur, t) { const w = (R.w - 40 - 4 * 20) / 5; PH.forEach(([a, col], i) => { const x = R.x + 20 + i * (w + 20), on = i === cur; g.save(); g.globalAlpha = pop(t, .1 + i * .1) * (on ? 1 : (i < cur ? .7 : .3)); rr(g, x, R.y + 10, w, 64, 32, on ? col : 'rgba(14,20,36,.9)', col, 2); txt(g, `${i + 1} ${a}`, x + w / 2, R.y + 42, on ? '#0B1020' : C.fg2, fnt(800, 25), 'center'); g.restore(); }); }
AN.incident = (g, t, R, st) => {
  const k = st.k, tk = k ? st.tk : t; phases(g, R, k, t); const Y = R.y + 120;
  if (k === 0) { const x = R.x + 100, w = R.w - 200, h = 420; line(g, [[x, Y + 40], [x, Y + 40 + h], [x + w, Y + 40 + h]], C.fg3, 2); txt(g, '已付款但未入账（笔）', x - 10, Y + 20, C.fg3, fnt(500, 20)); ['21:00', '21:10', '21:20', '21:30'].forEach((s, i) => txt(g, s, x + w * i / 3, Y + 40 + h + 28, C.fg3, fnt(500, 18, 'mono'), 'center'));
    const pts = []; const p = CL(tk / 3); for (let i = 0; i <= 100 * p; i++) { const u = i / 100; pts.push([x + u * w, Y + 40 + h - (u < .55 ? 2 : (u - .55) * 700)]); } line(g, pts, C.r, 3.5); line(g, [[x, Y + 40 + h - 40], [x + w, Y + 40 + h - 40]], C.gold, 2, [8, 8]);
    if (tk > 3) { g.save(); g.globalAlpha = pop(tk, 3); rr(g, x + w - 440, Y + 60, 420, 90, 14, 'rgba(255,122,147,.12)', C.r, 2); txt(g, '● 告警：已付款未入账 > 0', x + w - 420, Y + 92, C.fg, fnt(700, 22)); txt(g, '持续 10 分钟 · 21:23', x + w - 420, Y + 126, C.fg2, fnt(500, 19)); g.restore(); } return; }
  if (k === 1) { [['影响范围', '23 位用户 · 从 20:58 开始（示意）', C.r], ['和刚才的发布有关？', '是 → 先回滚；不确定 → 先挂提示', C.o]].forEach(([a, b, col], i) => { const u = pop(tk, .3 + i * 1.5); g.save(); g.globalAlpha = u; rr(g, R.x + 20, Y + i * 130, R.w - 40, 110, 16, 'rgba(14,20,36,.92)', col, 2); txt(g, a, R.x + 50, Y + i * 130 + 38, col, fnt(800, 26)); txt(g, b, R.x + 50, Y + i * 130 + 80, C.fg, fnt(600, 24)); g.restore(); });
    const u = pop(tk, 5); g.save(); g.globalAlpha = u; rr(g, R.x + 20, Y + 300, R.w - 40, 120, 16, 'rgba(255,178,92,.1)', C.o, 2.5); txt(g, '页面提示', R.x + 50, Y + 336, C.o, fnt(700, 20)); txt(g, '付款已收到，确认邮件会晚一点送达。名额已为你保留。', R.x + 50, Y + 382, C.fg, fnt(700, 27)); g.restore();
    banner(g, R, '先止损，再找原因', pop(tk, 7)); return; }
  if (k === 2) { const x = R.x + 20, w = (R.w - 60) / 2; g.save(); g.globalAlpha = pop(tk, .3); rr(g, x, Y, w, 420, 16, '#0B1020', C.r, 2); txt(g, '错误上报', x + 24, Y + 36, C.r, fnt(800, 24)); ['StripeSignatureVerificationError', 'No signatures found matching the', 'expected signature for payload', 'route: POST /api/webhooks/stripe', 'first seen: 20:58 · events: 41'].forEach((l, i) => txt(g, l, x + 24, Y + 100 + i * 50, i === 0 ? C.fg : C.fg2, fnt(500, 19, 'mono'))); g.restore();
    g.save(); g.globalAlpha = pop(tk, 4); const X = x + w + 20; rr(g, X, Y, w, 420, 16, '#0B1020', C.b, 2); txt(g, '部署记录', X + 24, Y + 36, C.b, fnt(800, 24)); [['20:55', '更新环境变量（生产）'], ['', 'STRIPE_SECRET_KEY = sk_test_…'], ['', 'STRIPE_WEBHOOK_SECRET = 测试端点的值']].forEach(([a, b], i) => { txt(g, a, X + 24, Y + 100 + i * 50, C.fg3, fnt(500, 19, 'mono')); txt(g, b, X + 110, Y + 100 + i * 50, i && tk > 7 ? C.bad : C.fg2, fnt(500, 19, 'mono')); });
    if (tk > 7) { txt(g, '↑ 从测试配置整套复制了过来', X + 24, Y + 280, C.bad, fnt(800, 24)); } g.restore(); return; }
  // k === 3 恢复
  const S = [['改回正确的密钥', C.g], ['支付服务重试失败的回调', C.o], ['幂等处理：状态自动补上', C.ok], ['超过重试期的：对账脚本补齐', C.b]];
  S.forEach(([a, col], i) => { const y = Y + i * 110, u = pop(tk, .4 + i * 2); g.save(); g.globalAlpha = Math.max(.25, u); rr(g, R.x + 20, y, 720, 90, 14, 'rgba(14,20,36,.92)', col, 2); check(g, R.x + 46, y + 45, a, pop(tk, .8 + i * 2), col, 25); g.restore(); });
  const left = Math.max(0, 23 - Math.floor(CL((tk - 3) / 6) * 23)); g.save(); g.globalAlpha = pop(tk, 2.5); rr(g, R.x + 780, Y, R.w - 800, 420, 16, '#0B1020', C.line2); txt(g, '未入账', R.x + 810, Y + 40, C.fg3, fnt(600, 22)); txt(g, String(left), R.x + 810, Y + 140, left ? C.r : C.ok, fnt(800, 90, 'mono')); txt(g, left ? '回调重试陆续到达…' : '全部补齐', R.x + 810, Y + 230, C.fg2, fnt(600, 24)); g.restore();
};
AN.postmortem = (g, t, R) => {
  const x = R.x + 20, y = R.y + 20, w = 760; g.save(); g.globalAlpha = pop(t, .2); rr(g, x, y, w, 680, 16, '#0B1020', C.p, 2.5); txt(g, 'postmortem-2026-11-06.md', x + 24, y + 36, C.p, fnt(700, 21, 'mono'));
  [['发生了什么', '生产填成测试模式的密钥，回调验签失败'], ['影响', '23 笔付款延迟入账约 40 分钟（示意）'], ['为什么没更早发现', '改环境变量不走流水线，没有检查'], ['以后怎么防止', '见右侧']].forEach(([a, b], i) => { const u = pop(t, .6 + i * .6); g.globalAlpha = u; txt(g, '## ' + a, x + 30, y + 110 + i * 140, C.fg, fnt(700, 24)); wrapTxt(g, b, x + 30, y + 154 + i * 140, w - 60, 30, C.fg2, fnt(500, 22)); }); g.restore();
  const X = x + w + 40, W = R.w - w - 80; g.save(); g.globalAlpha = pop(t, 3); rr(g, X, y, W, 330, 16, '#0B1020', C.gold, 2); txt(g, '改进：启动自检', X + 24, y + 36, C.gold, fnt(800, 24));
  ['if (env === "production" &&', '    key.startsWith("sk_test_")) {', '  throw new Error("生产环境使用了', '    测试模式密钥，拒绝启动")', '}'].forEach((l, i) => txt(g, l, X + 24, y + 100 + i * 44, C.fg2, fnt(500, 19, 'mono'))); g.restore();
  g.save(); g.globalAlpha = pop(t, 5); rr(g, X, y + 360, W, 120, 16, 'rgba(199,155,255,.06)', C.p); txt(g, '复盘不追究个人', X + 24, y + 400, C.p, fnt(800, 26)); txt(g, '只改进系统', X + 24, y + 444, C.fg2, fnt(600, 22)); g.restore();
};
// ---- 备份 ----
AN.backup = (g, t, R, st) => {
  if (st.k === 0) { hdr(g, R, '托管数据库有备份，但要确认三件事');
    [['保留多久？', '几天到几周，看套餐', C.b], ['能恢复到某个时间点吗？', '时间点恢复（PITR）', C.g], ['恢复一次要多久？', '不演练就不知道', C.o]].forEach(([a, b, col], i) => { const u = pop(t, .6 + i * 1.2), y = R.y + 120 + i * 170; g.save(); g.globalAlpha = u; txt(g, '?', R.x + 60, y + 60, col, fnt(800, 70), 'center'); rr(g, R.x + 120, y, R.w - 160, 130, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, R.x + 150, y + 46, C.fg, fnt(800, 30)); txt(g, b, R.x + 150, y + 94, C.fg2, fnt(500, 24)); g.restore(); }); return; }
  hdr(g, R, '每个季度：恢复演练', '没有恢复过的备份，等于没有备份');
  const tk = st.tk, N = [['备份', C.g], ['恢复到新数据库', C.b], ['接上预发布', C.o], ['检查数据', C.ok]], W = 280, G = (R.w - 40 - W * 4) / 3;
  N.forEach(([a, col], i) => { const x = R.x + 20 + i * (W + G); node(g, x, R.y + 160, W, 120, a, col, pop(tk, .3 + i * .8)); if (i < 3) arrow(g, x + W + 6, R.y + 220, x + W + G - 6, R.y + 220, C.fg3, 3, 12, pop(tk, .6 + i * .8)); });
  const u = pop(tk, 4); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + 340, R.w - 40, 260, 16, '#0B1020', C.line2); txt(g, '演练记录（示意）', R.x + 50, R.y + 380, C.fg, fnt(800, 24));
  [['行数', 'users 1,204 · registrations 3,876 · payments 3,511', C.ok], ['最新数据时间', '演练前 5 分钟', C.ok], ['总耗时', '47 分钟', C.gold]].forEach(([a, b, col], i) => { txt(g, a, R.x + 50, R.y + 440 + i * 50, C.fg3, fnt(600, 22)); txt(g, b, R.x + 300, R.y + 440 + i * 50, col, fnt(600, 22, i === 2 ? 'sans' : 'mono')); }); g.restore();
};
AN.retention = (g, t, R) => {
  hdr(g, R, '数据的保留与删除：写进规格，做成定时任务');
  const L = [['用户删除账号', '个人信息删除或匿名化；报名记录保留金额用于对账', C.r], ['活动结束 + 90 天（示意）', '删除名单中的联系方式', C.o], ['导出的名单文件', '7 天后过期（示意）', C.b], ['备份', '按保留期自然过期；恢复后要重新执行删除', C.p]];
  L.forEach(([a, b, col], i) => { const y = R.y + 110 + i * 130, u = pop(t, .5 + i * .8); g.save(); g.globalAlpha = u; rr(g, R.x + 20, y, R.w - 40, 108, 16, 'rgba(14,20,36,.92)', col, 2); txt(g, a, R.x + 50, y + 38, col, fnt(800, 26)); txt(g, b, R.x + 50, y + 78, C.fg2, fnt(500, 22)); g.restore(); });
  g.save(); g.globalAlpha = pop(t, 4); txt(g, 'cron：每天 03:00 执行清理任务', R.x + 20, R.y + 670, C.gold, fnt(700, 24, 'mono')); g.restore();
};
// ---- 成本 ----
AN.cost = (g, t, R, st) => {
  const k = st.k, tk = k ? st.tk : t;
  hdr(g, R, '月账单的构成', '金额为示意');
  const I = [['托管平台', 20, 20, C.b], ['数据库', 19, 120, C.g], ['日志', 5, 180, C.p], ['带宽', 3, 90, C.o], ['邮件', 2, 2, C.fg2], ['AI 接口', 4, 300, C.r]];
  const x = R.x + 40, y = R.y + 140, w = R.w - 80, h = 440, bw = w / I.length, max = LERP(28, 320, k >= 1 ? pop(tk, .3, 1.2) : 0);
  line(g, [[x, y + h], [x + w, y + h]], C.fg3, 2);
  I.forEach(([a, v0, v1, col], i) => { const u = pop(t, .2 + i * .2); const surge = k >= 1 ? pop(tk, 1 + i * .5) : 0; const v = LERP(v0, v1, surge); const bh = h * v / max * u, X = x + i * bw + bw * .2;
    rr(g, X, y + h - bh, bw * .6, Math.max(2, bh), 8, col); txt(g, a, X + bw * .3, y + h + 30, C.fg2, fnt(600, 22), 'center'); txt(g, '$' + Math.round(v), X + bw * .3, y + h - bh - 20, C.fg, fnt(700, 22, 'mono'), 'center');
    if (k >= 1 && surge > .9) txt(g, ['', '慢查询满负荷', '调试日志忘了关', '大图 / 盗链', '', '接口没限流'][i], X + bw * .3, y + h - bh - 52, C.bad, fnt(600, 19), 'center'); });
  if (k === 2) { const u = pop(tk, .5); g.save(); g.globalAlpha = u; const by = y + h - h * 100 / max; line(g, [[x, by], [x + w, by]], C.gold, 2.5, [10, 8]); txt(g, '预算告警线 $100', x + 10, by - 20, C.gold, fnt(700, 22)); g.restore(); banner(g, R, '每个付费服务设预算告警 · 每月看一次构成 · 按调用计费的接口加上限', pop(tk, 2)); }
};
// ---- 安全维护 ----
AN.secmaint = (g, t, R, st) => {
  const k = st.k, tk = k ? st.tk : t;
  if (k === 0) { hdr(g, R, '依赖漏洞：从提醒到合并');
    const N = [['安全通告', '某依赖发现严重漏洞', C.r], ['机器人开 PR', '升级到修复版本', C.p], ['流水线', '测试全过', C.g], ['合并 · 部署', '几天之内', C.b]], W = 300, G = (R.w - 40 - W * 4) / 3;
    N.forEach(([a, b, col], i) => { const x = R.x + 20 + i * (W + G); node(g, x, R.y + 200, W, 140, a, col, pop(tk, .4 + i * 1), b); if (i < 3) arrow(g, x + W + 6, R.y + 270, x + W + G - 6, R.y + 270, C.fg3, 3, 12, pop(tk, .8 + i * 1)); });
    const ph = CL((tk - 1) / 5); if (ph > 0 && ph < 1) packet(g, [[R.x + 20 + W / 2, R.y + 370], [R.x + 20 + 3 * (W + G) + W / 2, R.y + 370]], ph, C.gold); return; }
  if (k === 1) { const w = (R.w - 60) / 2; g.save(); g.globalAlpha = pop(tk, .2); rr(g, R.x + 20, R.y + 20, w, 520, 16, 'rgba(14,20,36,.92)', C.o, 2); txt(g, '密钥轮换', R.x + 44, R.y + 56, C.o, fnt(800, 28));
    ['① 生成新密钥', '② 部署：新旧同时有效', '③ 确认新密钥在用', '④ 作废旧密钥'].forEach((s, i) => check(g, R.x + 50, R.y + 130 + i * 80, s, pop(tk, 1 + i * .7), C.o, 25)); txt(g, '怀疑泄露：立刻做一遍', R.x + 50, R.y + 470, C.fg3, fnt(500, 22)); g.restore();
    const X = R.x + 40 + w; g.save(); g.globalAlpha = pop(tk, 4); rr(g, X, R.y + 20, w, 520, 16, 'rgba(14,20,36,.92)', C.b, 2); txt(g, '每季度权限检查', X + 24, R.y + 56, C.b, fnt(800, 28));
    [['合作者 小王（已离开）', 1], ['合作者 小李', 0], ['API 密钥 export-2025', 1], ['API 密钥 webhook-prod', 0], ['只读账号 ai-ops', 0]].forEach(([s, rm], i) => { const Y = R.y + 140 + i * 72; txt(g, s, X + 40, Y, rm ? C.fg3 : C.fg, fnt(600, 23)); if (rm) { g.font = fnt(600, 23); const sw = g.measureText(s).width; line(g, [[X + 34, Y], [X + 34 + (sw + 12) * pop(tk, 6 + i * .4), Y]], C.bad, 3); } }); g.restore(); return; }
  hdr(g, R, '留意异常的使用方式');
  const P = [['同一地址大量注册', C.r], ['反复尝试登录', C.o], ['接口被批量调用', C.p]], w = (R.w - 80) / 3;
  P.forEach(([a, col], i) => { const x = R.x + 20 + i * (w + 20), y = R.y + 110, u = pop(tk, .3 + i * .6); g.save(); g.globalAlpha = u; rr(g, x, y, w, 360, 16, '#0B1020', col, 2); txt(g, a, x + 24, y + 36, col, fnt(800, 25));
    const bx = x + 24, by = y + 300, bwid = w - 48; line(g, [[bx, by], [bx + bwid, by]], C.fg3, 1.5); for (let j = 0; j < 24; j++) { const v = j > 15 && j < 20 ? 150 + 40 * Math.sin(j + i) : 15 + 10 * Math.abs(Math.sin(j * 1.7 + i)); const lim = 60, shown = j > 15 && j < 20 && tk > 4 ? lim : v; rr(g, bx + j * bwid / 24, by - shown, bwid / 24 - 4, shown, 2, shown >= lim && j > 15 && j < 20 ? C.gold : col); }
    if (tk > 4) { line(g, [[bx, by - 60], [bx + bwid, by - 60]], C.gold, 2, [6, 6]); txt(g, '限流', bx + bwid, by - 76, C.gold, fnt(600, 18), 'right'); } g.restore(); });
  banner(g, R, '限流和告警挡住大部分；剩下的定期看一眼日志', pop(tk, 6));
};
// ---- 迭代 ----
AN.iter = (g, t, R, st) => {
  const k = st.k, tk = k ? st.tk : t;
  if (k === 0) { drawStages(g, R, t, [0], R.y + 260);
    ['优惠码', '候补自动转正'].forEach((s, i) => { const u = pop(tk, 1 + i * .8), x = R.x + 20 + i * 220, y = R.y + 80 - (1 - u) * 40; g.save(); g.globalAlpha = u; rr(g, x, y, 200, 70, 14, 'rgba(95,180,255,.12)', C.b, 2); txt(g, s, x + 100, y + 35, C.fg, fnt(700, 24), 'center'); arrow(g, x + 100, y + 74, x + 140, R.y + 252, C.b, 2.5, 10); g.restore(); });
    banner(g, R, '新需求 → 故事 → 验收标准 → 更新规格 → 再交给代理', pop(tk, 4)); return; }
  if (k === 1) { hdr(g, R, '依赖升级：每月一次');
    const M = ['7 月', '8 月', '9 月', '10 月', '11 月'], w = (R.w - 80) / 5; M.forEach((m, i) => { const x = R.x + 20 + i * (w + 10), u = pop(tk, .3 + i * .4); g.save(); g.globalAlpha = u; rr(g, x, R.y + 120, w, 300, 14, 'rgba(14,20,36,.92)', C.line2); txt(g, m, x + 20, R.y + 156, C.fg2, fnt(700, 24)); [0, 1, 2].forEach(j => { if ((i + j) % 4 === 3) return; rr(g, x + 20, R.y + 200 + j * 66, w - 40, 50, 10, C.panel, C.p, 1.5); bot(g, x + 46, R.y + 228 + j * 66, C.p, .5); txt(g, 'bump ' + ['next', 'zod', 'pg'][j], x + 74, R.y + 225 + j * 66, C.fg2, fnt(500, 17, 'mono')); ticks(g, x + w - 60, R.y + 226 + j * 66, pop(tk, 1 + i * .4)); }); g.restore(); });
    g.save(); g.globalAlpha = pop(tk, 4); rr(g, R.x + 20, R.y + 470, R.w - 40, 130, 16, 'rgba(255,107,107,.05)', C.bad); txt(g, '拖一年再升：一次跨很多个大版本', R.x + 50, R.y + 515, C.bad, fnt(800, 26)); txt(g, '变更说明一大堆，测试一片红', R.x + 50, R.y + 565, C.fg2, fnt(500, 22)); g.restore(); return; }
  hdr(g, R, '规格文档和代码要同步');
  const x = R.x + 20; g.save(); g.globalAlpha = pop(tk, .3); rr(g, x, R.y + 120, 520, 360, 16, '#0B1020', C.gold, 2); txt(g, 'docs/spec.md §3.5', x + 24, R.y + 156, C.gold, fnt(700, 22, 'mono')); txt(g, '候补：组织者手动转正', x + 24, R.y + 230, tk > 7.5 ? C.fg3 : C.fg, fnt(600, 24)); if (tk > 7.5) { line(g, [[x + 20, R.y + 230], [x + 280, R.y + 230]], C.bad, 3); txt(g, '候补：有人退款后自动转正', x + 24, R.y + 290, C.ok, fnt(700, 24)); } g.restore();
  g.save(); g.globalAlpha = pop(tk, 1.5); bot(g, x + 700, R.y + 300, C.p, 1.6); arrow(g, x + 540, R.y + 300, x + 650, R.y + 300, C.p, 3, 12); rr(g, x + 780, R.y + 220, R.w - 820, 160, 16, tk > 7.5 ? 'rgba(95,211,154,.06)' : 'rgba(255,107,107,.06)', tk > 7.5 ? C.ok : C.bad, 2); txt(g, tk > 7.5 ? '按新规则写代码 ✓' : '文档过时 → 按旧规则写代码 ✗', x + 810, R.y + 300, tk > 7.5 ? C.ok : C.bad, fnt(800, 26)); g.restore();
  banner(g, R, '写进 AGENTS.md：改功能时同时改文档', pop(tk, 9));
};
// ---- AI 运维 ----
AN.aiops = (g, t, R, st) => {
  const k = st.k, tk = k ? st.tk : t, w = (R.w - 60) / 2, y = R.y + 30, h = 560;
  if (k <= 2) {
    g.save(); g.globalAlpha = pop(t, .2) * (k === 2 ? .45 : 1); rr(g, R.x + 20, y, w, h, 18, 'rgba(199,155,255,.05)', C.p, k === 1 ? 3 : 2); bot(g, R.x + 60, y + 48, C.p, .8); txt(g, '可以交给 AI', R.x + 100, y + 44, C.p, fnt(800, 30));
    ['读告警和日志，总结发生了什么', '写排查用的查询和脚本', '从错误上报定位代码，提修复 PR', '起草复盘文档', '定期检查依赖和配置，列出风险'].forEach((s, i) => { const u = k === 0 ? .25 : (k === 1 ? pop(tk, .5 + i * 1.5) : 1); g.globalAlpha = (k === 2 ? .45 : 1) * Math.max(.25, u); check(g, R.x + 50, y + 130 + i * 84, s, u > .9 ? 1 : 0, C.p, 24); }); g.restore();
    const X = R.x + 40 + w; g.save(); g.globalAlpha = pop(t, .4) * (k === 1 ? .45 : 1); rr(g, X, y, w, h, 18, 'rgba(255,210,122,.05)', C.gold, k === 2 ? 3 : 2); person(g, X + 44, y + 48, C.gold, .9); txt(g, '必须人确认', X + 80, y + 44, C.gold, fnt(800, 30));
    ['直接修改生产数据库', '接触生产密钥和权限', '账单、扩容等花钱的操作', '对用户发出的任何通知'].forEach((s, i) => { const u = k === 2 ? pop(tk, .5 + i * 1.5) : .25; g.globalAlpha = (k === 1 ? .45 : 1) * Math.max(.25, u); rr(g, X + 50, y + 116 + i * 96, 26, 22, 4, C.gold); g.strokeStyle = C.gold; g.lineWidth = 3; g.beginPath(); g.arc(X + 63, y + 116 + i * 96, 9, Math.PI, 0); g.stroke(); txt(g, s, X + 96, y + 128 + i * 96, C.fg, fnt(600, 25)); }); g.restore();
    if (k === 0) banner(g, R, '可以参与运维，但要划清边界', pop(t, 1.5)); return; }
  hdr(g, R, '给代理一个只读的生产账号');
  bot(g, R.x + 120, R.y + 330, C.p, 2); txt(g, 'ai-ops', R.x + 120, R.y + 430, C.p, fnt(700, 22, 'mono'), 'center');
  const A = [['日志 / 指标', '查看', 1], ['数据库只读副本', 'SELECT', 1], ['部署', '—', 0], ['密钥', '—', 0], ['账单', '—', 0]];
  A.forEach(([a, b, ok], i) => { const yy = R.y + 110 + i * 105, u = pop(tk, .4 + i * .5); g.save(); g.globalAlpha = u; line(g, [[R.x + 180, R.y + 330], [R.x + 420, yy + 40]], ok ? C.ok : C.line2, 2, ok ? null : [6, 6]); rr(g, R.x + 420, yy, 440, 80, 14, 'rgba(14,20,36,.92)', ok ? C.ok : C.bad, 2); txt(g, a, R.x + 446, yy + 40, C.fg, fnt(700, 24)); txt(g, b, R.x + 836, yy + 40, ok ? C.ok : C.bad, fnt(600, 22, 'mono'), 'right'); if (!ok) cross(g, R.x + 900, yy + 40, 1, C.bad, 12); g.restore(); });
  g.save(); g.globalAlpha = pop(tk, 4); const X = R.x + 980; rr(g, X, R.y + 180, R.w - 1000, 300, 16, '#0B1020', C.gold); txt(g, '要改东西时', X + 24, R.y + 220, C.gold, fnt(800, 24)); ['代理提 PR', '流水线检查', '你审核合并'].forEach((s, i) => { txt(g, `${i + 1}. ${s}`, X + 30, R.y + 290 + i * 60, C.fg, fnt(600, 24)); }); g.restore();
};
// ---- 总结 ----
AN.final = (g, t, R, st) => {
  const k = st.k, tk = k ? st.tk : t; const cols = ['需求', '开发', '上线', '维护'], ccol = [C.b, C.g, C.o, C.p];
  const rows = [['人', C.gold, ['范围 · 不做清单', '数据模型 · 权限', '上线时机 · 花钱', '事故决策 · 对用户承诺']], ['AI', C.p, ['追问边界', '写代码和测试', '审查 · 写脚本', '排查 · 起草复盘']], ['工具', C.g, ['规格文档', '测试 · 类型检查', '流水线 · 自动部署 · 证书', '监控告警 · 备份']]];
  const x0 = R.x + 160, cw = (R.w - 180) / 4, y0 = R.y + 60, rh = 170;
  cols.forEach((c, i) => { g.save(); g.globalAlpha = pop(t, .2 + i * .2); rr(g, x0 + i * cw + 8, y0, cw - 16, 64, 14, 'rgba(14,20,36,.92)', ccol[i], 2.5); txt(g, c, x0 + i * cw + cw / 2, y0 + 32, ccol[i], fnt(800, 28), 'center'); g.restore(); if (i < 3) arrow(g, x0 + (i + 1) * cw - 10, y0 + 32, x0 + (i + 1) * cw + 10, y0 + 32, C.fg3, 2.5, 8, pop(t, .4 + i * .2)); });
  rows.forEach(([r, col, L], j) => { const on = k !== 1 || true; const hl = k === 1 ? pop(tk, .5 + j * 2.5) : 0; g.save(); g.globalAlpha = pop(t, 1 + j * .4); const Y = y0 + 90 + j * rh; txt(g, r, R.x + 40, Y + rh / 2 - 10, col, fnt(800, 32));
    L.forEach((s, i) => { rr(g, x0 + i * cw + 8, Y, cw - 16, rh - 20, 14, hl > .5 ? 'rgba(255,255,255,.04)' : 'rgba(14,20,36,.85)', hl > .5 ? col : C.line2, hl > .5 ? 2.5 : 1.5); wrapTxt(g, s, x0 + i * cw + 30, Y + 50, cw - 60, 34, C.fg, fnt(600, 24)); }); g.restore(); });
  if (k === 0) banner(g, R, '每一步：人负责什么，AI 负责什么，工具负责什么', pop(t, 3));
  if (k === 1) banner(g, R, '人决定 · AI 加速 · 工具兜底', pop(tk, 8));
  if (k === 2) { const u = pop(tk, .5); g.save(); g.globalAlpha = u; rr(g, R.x + 10, R.y + R.h - 110, R.w - 20, 100, 16, 'rgba(255,210,122,.1)', C.gold, 2.5); txt(g, '把判断留给自己 · 把重复交给代理 · 把底线交给工具', R.x + R.w / 2, R.y + R.h - 60, C.fg, fnt(800, 34), 'center'); g.restore(); }
};
