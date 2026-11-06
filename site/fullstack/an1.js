// 上集动画：从需求到能跑起来
// ---- 案例 ----
AN.case = (g, t, R) => {
  const x = R.x + 30, y = R.y + 60, w = 820, h = 680;
  rr(g, x, y, w, h, 18, '#0B1020', C.line2, 2); rr(g, x, y, w, 52, 18, C.panel2); [C.bad, C.gold, C.ok].forEach((c, i) => dot(g, x + 28 + i * 24, y + 26, 7, c));
  rr(g, x + 110, y + 12, 560, 30, 15, '#0B1020'); txt(g, 'signup.example.com/events/42', x + 130, y + 27, C.fg3, fnt(500, 18, 'mono'));
  const u0 = pop(t, .3); g.save(); g.globalAlpha = u0;
  txt(g, '前端工作坊 · 11 月 20 日', x + 50, y + 110, C.fg, fnt(800, 34)); txt(g, '名额 40 · 已报 37 · 费用 ¥99（示意）', x + 50, y + 156, C.fg3, fnt(500, 22));
  [['姓名', '陈同学'], ['邮箱', 'chen@example.com'], ['公司', '（选填）']].forEach(([a, b], i) => { const yy = y + 210 + i * 96; txt(g, a, x + 50, yy, C.fg2, fnt(600, 20)); rr(g, x + 50, yy + 18, 720, 52, 10, C.panel, C.line2); txt(g, b, x + 70, yy + 44, i === 2 ? C.fg3 : C.fg, fnt(500, 22)); });
  rr(g, x + 50, y + 520, 300, 64, 14, C.b); txt(g, '报名并付款', x + 200, y + 552, '#0B1020', fnt(800, 26), 'center');
  txt(g, '名额只剩 3 个', x + 380, y + 552, C.o, fnt(600, 22)); g.restore();
  const F = [['登录', '邮箱魔法链接', C.b], ['报名表单', '校验 · 名额 · 截止', C.g], ['在线付费', '支付服务 + 回调', C.o], ['确认邮件', '后台任务发送', C.p], ['后台管理', '名单 · 导出 · 退款', C.r]];
  F.forEach(([a, b, col], i) => { const u = pop(t, 1 + i * .5); g.save(); g.globalAlpha = u; const X = x + w + 80, Y = y + 20 + i * 128 + (1 - u) * 20; rr(g, X, Y, 600, 100, 16, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, X + 30, Y + 36, col, fnt(800, 30)); txt(g, b, X + 30, Y + 72, C.fg2, fnt(500, 22)); g.restore(); });
  const u = pop(t, 4); g.save(); g.globalAlpha = u; chip(g, '一个人 · 几周（示意）', x + w + 80, y + h + 40, C.gold); g.restore();
};
// ---- 全流程 ----
const STG = [['需求', ['用户故事', '验收标准', '规格文档'], C.b], ['开发', ['选型 · 数据', '后端 · 集成', '环境'], C.g], ['上线', ['流水线 · 部署', '域名 · 安全', '发布'], C.o], ['维护', ['监控 · 事故', '备份 · 成本', '迭代'], C.p]];
function drawStages(g, R, t, lit = null, y = R.y + 200) {
  const n = 4, gap = 70, w = (R.w - 40 - gap * 3) / n;
  STG.forEach(([a, sub, col], i) => { const x = R.x + 20 + i * (w + gap), u = pop(t, .2 + i * .25); const dim = lit && !lit.includes(i); g.save(); g.globalAlpha = u * (dim ? .3 : 1); rr(g, x, y, w, 250, 20, 'rgba(14,20,36,.92)', col, 3); txt(g, a, x + w / 2, y + 56, col, fnt(800, 40), 'center'); sub.forEach((s, j) => txt(g, s, x + w / 2, y + 120 + j * 40, C.fg2, fnt(500, 23), 'center')); g.restore(); if (i < n - 1) arrow(g, x + w + 10, y + 125, x + w + gap - 10, y + 125, C.fg3, 3, 12, u); });
  const u = pop(t, 1.3); g.save(); g.globalAlpha = u * .9; const x0 = R.x + 20 + 3 * (w + gap) + w / 2, x1 = R.x + 20 + w / 2; line(g, [[x0, y + 252], [x0, y + 320], [x1, y + 320], [x1, y + 262]], C.fg3, 2.5, [8, 8]); arrow(g, x1, y + 300, x1, y + 258, C.fg3, 2.5, 12); txt(g, '新需求回到第一步', (x0 + x1) / 2, y + 344, C.fg3, fnt(500, 21), 'center'); g.restore();
  return { w, gap, y };
}
AN.flow = (g, t, R, st) => {
  const L = drawStages(g, R, t, null);
  if (st.k === 0) { const u = pop(t, 2); g.save(); g.globalAlpha = u; const x = R.x + 20 + L.w + L.gap; chip(g, 'AI：写代码快了很多', x, L.y - 50, C.p); chip(g, '其余每一步：一件没少', R.x + 20 + 2 * (L.w + L.gap), L.y - 50, C.gold); g.restore(); }
  if (st.k >= 1) { const u = pop(st.tk, .3); [['上集', 0, 2, C.b], ['中集', 2, 3, C.o], ['下集', 3, 4, C.p]].forEach(([s, a, b, col], i) => { const v = u * pop(st.tk, .3 + i * .5); g.save(); g.globalAlpha = v; const x0 = R.x + 20 + a * (L.w + L.gap), x1 = R.x + 20 + b * (L.w + L.gap) - L.gap; const yy = L.y + 420; line(g, [[x0, yy - 14], [x0, yy], [x1, yy], [x1, yy - 14]], col, 3); txt(g, s, (x0 + x1) / 2, yy + 34, col, fnt(800, 28), 'center'); g.restore(); });
    const v = pop(st.tk, 2.5); g.save(); g.globalAlpha = v; chip(g, '设计与前端：快速带过', R.x + 20 + L.w + L.gap, L.y - 50, C.fg3); g.restore(); }
};
// ---- 需求 ----
AN.stories = (g, t, R) => {
  const u0 = pop(t, .2); g.save(); g.globalAlpha = u0; rr(g, R.x + R.w / 2 - 330, R.y + 30, 660, 90, 18, C.panel2, C.fg3); txt(g, '“做个活动报名网站”', R.x + R.w / 2, R.y + 75, C.fg, fnt(800, 36), 'center'); g.restore();
  const S = [['参与者', '用邮箱登录', '不用记密码'], ['参与者', '填表报名并付款', '确认拿到名额'], ['参与者', '收到确认邮件', '有凭证、能加日历'], ['组织者', '导出名单、处理退款', '会前核对和售后']];
  const w = (R.w - 40 - 3 * 30) / 4;
  S.forEach(([who, want, why], i) => { const u = pop(t, 1.2 + i * .45), x = R.x + 20 + i * (w + 30), y = R.y + 250; arrow(g, R.x + R.w / 2, R.y + 124, x + w / 2, y - 8, C.line2, 2, 10, u); g.save(); g.globalAlpha = u; rr(g, x, y, w, 330, 16, 'rgba(14,20,36,.92)', i === 3 ? C.o : C.b, 2.5);
    [['作为', who], ['我想', want], ['以便', why]].forEach(([k, v], j) => { txt(g, k, x + 24, y + 50 + j * 96, C.fg3, fnt(600, 20)); wrapTxt(g, v, x + 24, y + 84 + j * 96, w - 44, 30, C.fg, fnt(700, 24)); }); g.restore(); });
  banner(g, R, '用户故事：谁 · 想做什么 · 为什么', pop(t, 3.5));
};
AN.accept = (g, t, R) => {
  hdr(g, R, '验收标准：写成可以检查的句子');
  const x = R.x + 20, y = R.y + 110, w = 840; rr(g, x, y, w, 420, 18, '#0B1020', C.b, 2);
  [['给定', '活动已满员（40 / 40）', C.fg3], ['当', '用户点击“报名”', C.fg3], ['应该', '看到“加入候补”选项', C.g], ['并且', '不创建支付会话，不扣款', C.g]].forEach(([k, v, col], i) => { const u = pop(t, .4 + i * .5); g.save(); g.globalAlpha = u; txt(g, k, x + 40, y + 70 + i * 92, col === C.g ? C.g : C.b, fnt(800, 30)); txt(g, v, x + 160, y + 70 + i * 92, C.fg, fnt(600, 28)); g.restore(); });
  const u = pop(t, 3); arrow(g, x + w + 20, y + 210, x + w + 120, y + 210, C.gold, 4, 16, u); g.save(); g.globalAlpha = u; const X = x + w + 140; rr(g, X, y, R.w - w - 160, 420, 18, '#0B1020', C.gold, 2);
  ['test("满员时显示候补且不扣款", async () => {', '  await seedEvent({ capacity: 40, taken: 40 })', '  await page.click("text=报名")', '  await expect(page.getByText("加入候补"))', '    .toBeVisible()', '  expect(stripe.sessions).toHaveLength(0)', '})'].forEach((l, i) => txt(g, l, X + 24, y + 50 + i * 50, i === 0 || i === 6 ? C.p : C.fg2, fnt(500, 19, 'mono'))); g.restore();
  banner(g, R, '每一条验收标准 → 以后的一条测试', pop(t, 4.5));
};
AN.nogo = (g, t, R) => {
  const w = (R.w - 60) / 2, y = R.y + 30;
  card(g, R.x + 20, y, w, 520, '第一版做', ['邮箱登录', '活动详情 + 报名表单', '单币种在线付费', '确认邮件', '后台：名单 / 导出 / 退款'], C.g, pop(t, .2), false, 26);
  const N = ['多语言', '优惠券', '移动端应用', '多币种', '会员积分'];
  g.save(); g.globalAlpha = pop(t, .8); const X = R.x + 40 + w; rr(g, X, y, w, 520, 16, 'rgba(14,20,36,.92)', C.bad, 2); txt(g, '第一版不做', X + 22, y + 34, C.bad, fnt(800, 26));
  N.forEach((s, i) => { const yy = y + 100 + i * 80; txt(g, s, X + 40, yy, C.fg2, fnt(600, 28)); g.font = fnt(600, 28); const sw = g.measureText(s).width; const v = pop(t, 1.5 + i * .4, .4); if (v > 0) line(g, [[X + 34, yy], [X + 34 + (sw + 14) * v, yy]], C.bad, 3); }); g.restore();
  const u = pop(t, 4.5); g.save(); g.globalAlpha = u; bot(g, R.x + 70, R.y + 650, C.p, 1.2); txt(g, '代理很容易“顺手多做”：不做清单就是它的边界', R.x + 120, R.y + 650, C.fg, fnt(700, 28)); g.restore();
};
AN.edge = (g, t, R) => {
  hdr(g, R, '让 AI 追问边界情况，你来决定答案');
  const Q = [['重复报名？', '数据库唯一约束 + 提示“你已报名”'], ['付款成功但页面关了？', '以支付回调为准，照常发邮件'], ['组织者取消活动？', '自动对已付款的全部退款'], ['付款中途名额被占？', '名额先锁 15 分钟（示意），超时释放']];
  Q.forEach(([q, a], i) => { const y = R.y + 120 + i * 150, u = pop(t, .5 + i * .8), v = pop(t, 1 + i * .8); g.save(); g.globalAlpha = u; bot(g, R.x + 50, y + 30, C.p); rr(g, R.x + 90, y, 560, 64, 14, 'rgba(199,155,255,.1)', C.p); txt(g, q, R.x + 112, y + 32, C.fg, fnt(700, 26)); g.restore();
    g.save(); g.globalAlpha = v; arrow(g, R.x + 662, y + 32, R.x + 730, y + 32, C.fg3, 2.5, 10); rr(g, R.x + 740, y, R.w - 820, 64, 14, 'rgba(95,211,154,.08)', C.ok); txt(g, a, R.x + 764, y + 32, C.fg, fnt(600, 25)); person(g, R.x + R.w - 40, y + 34, C.ok, .9); g.restore(); });
};
AN.spec = (g, t, R) => {
  const x = R.x + 340, y = R.y + 40, w = 460, h = 640; const u = pop(t, .2); g.save(); g.globalAlpha = u;
  rr(g, x, y, w, h, 16, '#0B1020', C.gold, 2.5); txt(g, 'docs/spec.md', x + 24, y + 36, C.gold, fnt(700, 22, 'mono'));
  ['§1 目标与不做清单', '§2 用户故事', '§3 验收标准', '§4 数据模型', '§5 外部服务与费用', '§6 开放问题'].forEach((s, i) => { txt(g, s, x + 30, y + 100 + i * 82, C.fg, fnt(600, 26)); rr(g, x + 30, y + 124 + i * 82, w * (.5 + .3 * ((i * 7) % 3) / 2), 8, 4, C.line2); }); g.restore();
  const v = pop(t, 1.5); g.save(); g.globalAlpha = v; person(g, R.x + 120, R.y + 250, C.b, 1.6); txt(g, '人：对齐范围', R.x + 120, R.y + 330, C.fg2, fnt(600, 22), 'center'); arrow(g, R.x + 190, R.y + 260, x - 16, R.y + 260, C.b, 3, 12);
  bot(g, R.x + 120, R.y + 520, C.p, 1.6); txt(g, '代理：按小节工作', R.x + 120, R.y + 590, C.fg2, fnt(600, 22), 'center'); arrow(g, R.x + 190, R.y + 520, x - 16, R.y + 520, C.p, 3, 12); g.restore();
  ['任务：实现候补报名（见 §2.3、§3.5）', '任务：退款回调（见 §3.8、§5.1）', '任务：导出名单（见 §2.4）'].forEach((s, i) => { const a = pop(t, 2.5 + i * .5); g.save(); g.globalAlpha = a; rr(g, x + w + 40, R.y + 140 + i * 130, R.w - (x - R.x) - w - 60, 80, 14, 'rgba(14,20,36,.92)', C.line2); txt(g, s, x + w + 64, R.y + 180 + i * 130, C.fg2, fnt(600, 21)); g.restore(); });
};
// ---- 选型 ----
AN.stack = (g, t, R, st) => {
  const k = st.k, y = R.y + 120, x0 = R.x + 30, x1 = R.x + R.w - 30;
  hdr(g, R, '先问：我维护得了吗？');
  line(g, [[x0, y], [x1, y]], C.fg3, 3); arrow(g, x1 - 40, y, x1, y, C.fg3, 3, 14); txt(g, '全托管', x0, y + 34, C.b, fnt(800, 26)); txt(g, '自己管', x1, y + 34, C.o, fnt(800, 26), 'right');
  txt(g, '运维少 · 起步快', x0, y + 70, C.fg3, fnt(500, 20)); txt(g, '更便宜 · 更自由 · 事更多', x1, y + 70, C.fg3, fnt(500, 20), 'right');
  const w = (R.w - 80) / 2, Y = y + 120;
  const A = [['前端 / 函数', '托管平台'], ['数据库', '托管 Postgres'], ['登录 · 邮件 · 支付', '现成服务']];
  const B = [['应用', '云服务器或容器平台'], ['数据库', '自己跑（或托管）'], ['备份 · 升级 · 补丁', '自己负责']];
  [[A, R.x + 20, C.b, 1, ['✓ 几乎不碰服务器', '✗ 月费随用量上涨', '✗ 被平台绑住的程度']], [B, R.x + 60 + w, C.o, 2, ['✓ 成本可控、可迁移', '✗ 运维全是你的事', '✗ 出事没人兜底']]].forEach(([L, X, col, kk, pros]) => {
    const u = k === 0 ? .35 : (k === kk ? pop(st.tk, .2) : (k > kk || k === 3 ? .5 : .2)); g.save(); g.globalAlpha = Math.max(u, .2);
    L.forEach(([a, b], i) => { rr(g, X, Y + i * 96, w, 80, 14, 'rgba(14,20,36,.92)', col, 2); txt(g, a, X + 24, Y + i * 96 + 40, C.fg, fnt(700, 25)); txt(g, b, X + w - 24, Y + i * 96 + 40, C.fg2, fnt(500, 22), 'right'); });
    pros.forEach((s, i) => txt(g, s, X + 10, Y + 330 + i * 40, s[0] === '✓' ? C.ok : C.bad, fnt(600, 22))); g.restore(); });
  if (k === 3) { const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + R.h - 110, R.w - 40, 96, 14, 'rgba(14,20,36,.95)', C.fg3); txt(g, '用户在国内：国内云厂商也有这两类产品，思路一样', R.x + 46, R.y + R.h - 76, C.fg, fnt(700, 25)); txt(g, '差别在网络、合规和可选服务范围，按实际情况选', R.x + 46, R.y + R.h - 38, C.fg3, fnt(500, 21)); g.restore(); }
};
AN.pick = (g, t, R) => {
  hdr(g, R, '案例的选择：每一块都能替换');
  const cx = R.x + R.w * .38, cy = R.y + 380;
  node(g, R.x + 20, cy - 55, 220, 110, '浏览器', C.fg2, pop(t, .2), '参与者 / 组织者');
  node(g, cx - 160, cy - 70, 320, 140, '全栈框架', C.b, pop(t, .5), '托管平台 · 前后端一起');
  node(g, cx - 140, cy + 200, 280, 100, '托管 Postgres', C.g, pop(t, .8), '数据');
  arrow(g, R.x + 244, cy, cx - 166, cy, C.fg3, 3, 12, pop(t, .5)); arrow(g, cx, cy + 74, cx, cy + 194, C.fg3, 3, 12, pop(t, .8));
  const S = [['Stripe', '支付', C.o], ['事务邮件服务', '确认邮件', C.p], ['对象存储', '海报上传', C.fg2], ['Sentry 类工具', '错误上报', C.r]];
  const bx = R.x + R.w - 380; g.save(); g.globalAlpha = pop(t, 1.2); line(g, [[bx - 40, R.y + 110], [bx - 40, R.y + 690]], C.gold, 2, [8, 8]); txt(g, '适配层', bx - 50, R.y + 110, C.gold, fnt(700, 20), 'right'); g.restore();
  S.forEach(([a, b, col], i) => { const y = R.y + 120 + i * 150, u = pop(t, 1.4 + i * .4); node(g, bx, y, 340, 110, a, col, u, b); g.save(); g.globalAlpha = u; line(g, [[cx + 160, cy], [bx - 40, y + 55]], C.line2, 2); txt(g, '⇄', bx + 312, y + 22, C.gold, fnt(700, 22)); g.restore(); });
};
// ---- AI 协作 ----
AN.loop = (g, t, R) => {
  const cx = R.x + R.w / 2, cy = R.y + 400, rx = 520, ry = 270;
  const P = [['一条故事', '规格 §2.3', C.b], ['代理写测试', '', C.p], ['测试失败', '红', C.bad], ['代理实现', '', C.p], ['测试通过', '绿', C.ok], ['人看差异', '只改了该改的？', C.gold], ['提交', '小步', C.g]];
  const pos = P.map((_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / P.length; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
  g.save(); g.strokeStyle = C.line2; g.lineWidth = 3; g.setLineDash([10, 10]); g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 7); g.stroke(); g.restore();
  P.forEach(([a, b, col], i) => { const u = pop(t, .2 + i * .3); node(g, pos[i][0] - 130, pos[i][1] - 48, 260, 96, a, col, u, b); });
  const ph = (t * .12) % 1, a = -Math.PI / 2 + ph * 2 * Math.PI; dot(g, cx + rx * Math.cos(a), cy + ry * Math.sin(a), 11, C.gold);
  const u = pop(t, 2.5); g.save(); g.globalAlpha = u; txt(g, '一次只做一件小事', cx, cy - 20, C.fg, fnt(800, 34), 'center'); txt(g, '先测试，后实现，人审差异', cx, cy + 26, C.fg3, fnt(500, 24), 'center'); g.restore();
};
AN.human = (g, t, R, st) => {
  const w = (R.w - 60) / 2, y = R.y + 20, h = st.k >= 1 ? 470 : 600;
  const L = [['数据模型', '改起来最贵'], ['权限', '谁能看到谁的数据'], ['花钱', '付费服务 · 机器规格'], ['对用户的承诺', '退款规则 · 隐私']];
  g.save(); g.globalAlpha = pop(t, .2); rr(g, R.x + 20, y, w, h, 18, 'rgba(255,210,122,.06)', C.gold, 2.5); person(g, R.x + 60, y + 44, C.gold, .9); txt(g, '人拍板', R.x + 96, y + 44, C.gold, fnt(800, 30));
  L.forEach(([a, b], i) => { const u = pop(t, .6 + i * .4); g.globalAlpha = u; txt(g, a, R.x + 60, y + 120 + i * (h > 500 ? 110 : 84), C.fg, fnt(700, 28)); txt(g, b, R.x + 60 + 220, y + 120 + i * (h > 500 ? 110 : 84), C.fg3, fnt(500, 22)); }); g.restore();
  g.save(); g.globalAlpha = pop(t, 2.2); const X = R.x + 40 + w; rr(g, X, y, w, h, 18, 'rgba(199,155,255,.05)', C.p, 2); bot(g, X + 44, y + 48, C.p, .8); txt(g, '代理可以', X + 80, y + 44, C.p, fnt(800, 30));
  ['给出方案和取舍', '写代码、写测试', '审查、找漏洞', '整理文档'].forEach((s, i) => txt(g, s, X + 44, y + 120 + i * (h > 500 ? 110 : 84), C.fg2, fnt(600, 26))); g.restore();
  if (st.k >= 1) { const u = pop(st.tk, .3), Y = R.y + 540; g.save(); g.globalAlpha = u; person(g, R.x + 120, Y + 40, C.b); bot(g, R.x + 120, Y + 150, C.p); txt(g, '人写的', R.x + 160, Y + 44, C.fg2, fnt(600, 20)); txt(g, '代理写的', R.x + 160, Y + 150, C.fg2, fnt(600, 20));
    arrow(g, R.x + 260, Y + 44, R.x + 360, Y + 90, C.fg3, 3, 12); arrow(g, R.x + 260, Y + 150, R.x + 360, Y + 104, C.fg3, 3, 12);
    const S = ['格式', '规范', '类型', '测试', '构建', '依赖审计']; S.forEach((s, i) => { const x = R.x + 380 + i * ((R.w - 420) / 6); const v = pop(st.tk, .8 + i * .25); rr(g, x, Y + 60, (R.w - 420) / 6 - 16, 74, 12, 'rgba(14,20,36,.92)', C.g, 2); txt(g, s, x + ((R.w - 420) / 6 - 16) / 2, Y + 97, C.fg, fnt(700, 24), 'center'); ticks(g, x + ((R.w - 420) / 6 - 16) - 38, Y + 76, v); });
    txt(g, '同一条流水线', R.x + 380, Y + 30, C.g, fnt(800, 24)); g.restore(); }
};
// ---- 设计与前端（幻灯片） ----
AN.slide_ui = (g, t, R, st) => {
  txt(g, '设计与前端 · 清单', R.x + 20, R.y + 20, C.fg, fnt(800, 32)); txt(g, '详见前两个系列', R.x + 340, R.y + 22, C.fg3, fnt(500, 22));
  const w = (R.w - 80) / 3, y = R.y + 70, h = 560;
  card(g, R.x + 20, y, w, h, '设计', ['页面清单：首页 · 活动详情 · 报名 · 我的报名 · 后台', '关键流程：报名 → 付款 → 成功 / 失败 / 候补', '设计系统与组件库：颜色 · 字号 · 间距 · 按钮 · 表单', '空状态 · 错误状态 · 加载状态', '移动端宽度下的版式'], C.r, pop(t, .2), false, 21);
  card(g, R.x + 40 + w, y, w, h, '前端', ['表单校验：前端提示 + 服务端为准', '提交中禁用按钮，防重复提交', '失败可重试，输入不丢', '可访问性：标签 · 焦点 · 对比度 · 键盘', '性能预算：首屏 JS 体积 · LCP · INP', '图片压缩与懒加载'], C.b, pop(t, .5), false, 21);
  const X = R.x + 60 + 2 * w, hi = st.k >= 1; g.save(); g.globalAlpha = pop(t, .8); rr(g, X, y, w, h, 16, hi ? 'rgba(255,210,122,.06)' : 'rgba(14,20,36,.92)', hi ? C.gold : C.line2, 2); txt(g, '报名表单的错误', X + 22, y + 34, hi ? C.gold : C.fg2, fnt(800, 26));
  [['邮箱', 'chen@exa', '邮箱格式不完整', C.bad], ['人数', '3', '每人最多报 2 位', C.bad], ['', '', '名额已满，可加入候补', C.o], ['', '', '付款未完成，名额保留 15 分钟（示意）', C.o]].forEach(([a, b, e, col], i) => { const yy = y + 90 + i * 110; if (a) { txt(g, a, X + 24, yy, C.fg2, fnt(600, 19)); rr(g, X + 24, yy + 14, w - 48, 44, 8, C.panel, col); txt(g, b, X + 40, yy + 36, C.fg, fnt(500, 20)); txt(g, e, X + 24, yy + 78, col, fnt(600, 19)); } else { rr(g, X + 24, yy + 10, w - 48, 70, 10, 'rgba(255,178,92,.08)', col); wrapTxt(g, e, X + 40, yy + 46, w - 80, 26, C.fg, fnt(600, 20)); } }); g.restore();
};
// ---- 后端：一次报名请求 ----
const REQ = [['提交表单', '', C.fg2], ['登录校验', '你是谁', C.b], ['权限检查', '能报这个活动吗', C.b], ['输入校验', '名额 · 截止 · 必填', C.b], ['事务', '写报名 + 锁名额', C.g], ['支付会话', '跳转支付页', C.o]];
AN.request = (g, t, R, st) => {
  const k = st.k, n = REQ.length, gap = 34, w = (R.w - 40 - gap * (n - 1)) / n, y = R.y + 110;
  const lit = [n, 4, 6][k];
  REQ.forEach(([a, b, col], i) => { const x = R.x + 20 + i * (w + gap), on = i < lit; node(g, x, y, w, 120, a, col, pop(t, .1 + i * .15) * (k === 0 || on ? 1 : .3), b); if (i < n - 1) arrow(g, x + w + 4, y + 60, x + w + gap - 4, y + 60, C.fg3, 2.5, 10, pop(t, .2 + i * .15)); });
  const lo = k === 1 ? 0 : (k === 2 ? 3 : 0), hiN = k === 1 ? 4 : (k === 2 ? 6 : 6);
  const ph = ((k === 0 ? t : st.tk) * .25) % 1; const pts = []; for (let i = lo; i < hiN; i++) pts.push([R.x + 20 + i * (w + gap) + w / 2, y + 140]); if (pts.length > 1) packet(g, pts, ph, C.gold, 10);
  if (k === 1) { const u = pop(st.tk, .5); g.save(); g.globalAlpha = u; [['未登录', '→ 401，跳转登录'], ['不是本人 / 活动未公开', '→ 403'], ['名额满 / 已截止 / 缺字段', '→ 422 + 明确提示']].forEach(([a, b], i) => { const Y = y + 220 + i * 100; rr(g, R.x + 20, Y, R.w - 40, 78, 14, 'rgba(14,20,36,.92)', C.line2); txt(g, a, R.x + 50, Y + 39, C.fg, fnt(700, 25)); txt(g, b, R.x + 520, Y + 39, C.bad, fnt(600, 24)); }); g.restore(); }
  if (k === 2) { const Y = y + 220, u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 20, Y, R.w - 40, 380, 16, '#0B1020', C.g, 2); txt(g, '两个人同时抢最后一个名额', R.x + 46, Y + 36, C.g, fnt(800, 26));
    ['BEGIN;', 'SELECT taken, capacity FROM events WHERE id = 42 FOR UPDATE;  -- 锁住这一行', 'INSERT INTO registrations (…) VALUES (…);', 'UPDATE events SET taken = taken + 1 WHERE id = 42;', 'COMMIT;'].forEach((l, i) => txt(g, l, R.x + 50, Y + 90 + i * 40, i === 1 ? C.gold : C.fg2, fnt(500, 21, 'mono')));
    const v = pop(st.tk, 2.5); g.globalAlpha = u * v; person(g, R.x + R.w - 420, Y + 300, C.ok); txt(g, 'A：拿到名额 → 去付款', R.x + R.w - 390, Y + 300, C.ok, fnt(700, 23)); person(g, R.x + R.w - 420, Y + 352, C.bad, .8); txt(g, 'B：等锁释放 → 已满，加入候补', R.x + R.w - 390, Y + 352, C.o, fnt(700, 23)); g.restore(); }
};
AN.webhook = (g, t, R, st) => {
  const k = st.k, y = R.y + 80;
  node(g, R.x + 10, y + 120, 200, 110, 'Stripe', C.o, pop(t, .1), '付款完成');
  const X = R.x + 330; g.save(); g.globalAlpha = pop(t, .3); rr(g, X, y, 400, 380, 18, '#0B1020', C.b, 2.5); txt(g, 'POST /api/webhooks/stripe', X + 20, y + 32, C.b, fnt(700, 20, 'mono'));
  const S = [['验证签名', '不是 Stripe 发的 → 400'], ['事件 ID 处理过？', '是 → 直接返回 200'], ['更新报名为 paid', '同一事务记下事件 ID'], ['放入任务队列', '发确认邮件'], ['快速返回 200', '']];
  S.forEach(([a, b], i) => { const u = pop(t, .6 + i * .35); g.globalAlpha = u; check(g, X + 24, y + 86 + i * 62, a, k === 0 ? pop(t, 1.2 + i * .35) : 1, C.ok, 22); if (b) txt(g, b, X + 70, y + 110 + i * 62, C.fg3, fnt(500, 17)); }); g.restore();
  if (k === 0) { [0, 1, 2].forEach(j => { const u = pop(t, 2.5 + j * .8); const ph = CL((t - 2.5 - j * .8) / .8); g.save(); g.globalAlpha = u; if (ph < 1) packet(g, [[R.x + 210, y + 175 + (j - 1) * 30], [X, y + 175 + (j - 1) * 30]], ph, j === 0 ? C.gold : C.fg3, 8); tag(g, `evt_8f2… 第 ${j + 1} 次`, R.x + 10, y + 300 + j * 50, j ? C.fg3 : C.gold); g.restore(); });
    const u = pop(t, 5.5); g.save(); g.globalAlpha = u; rr(g, X + 440, y + 60, R.w - (X - R.x) - 460, 260, 16, 'rgba(95,211,154,.06)', C.ok); txt(g, '幂等：处理一次和十次结果一样', X + 466, y + 100, C.ok, fnt(800, 24)); ['重复到达：按事件 ID 去重', '顺序错乱：只允许状态往前走', '  pending → paid → refunded', '验签要用原始请求体'].forEach((s, i) => txt(g, s, X + 466, y + 154 + i * 42, C.fg2, fnt(500, 21))); g.restore(); }
  if (k === 1) { const u = pop(st.tk, .2); g.save(); g.globalAlpha = u; const Y = y + 440; arrow(g, X + 200, y + 384, X + 200, Y - 6, C.fg3, 3, 12);
    rr(g, X + 60, Y, 300, 90, 14, 'rgba(14,20,36,.92)', C.p, 2); txt(g, '任务队列', X + 210, Y + 32, C.p, fnt(800, 24), 'center'); [0, 1, 2, 3].forEach(i => rr(g, X + 90 + i * 60, Y + 54, 46, 22, 5, i ? C.line2 : C.p));
    node(g, X + 480, Y - 5, 230, 100, 'Worker', C.g, 1, '后台进程'); node(g, X + 820, Y - 5, 240, 100, '邮件服务', C.p, 1, '发送确认邮件'); arrow(g, X + 364, Y + 45, X + 474, Y + 45, C.fg3, 3, 12); arrow(g, X + 714, Y + 45, X + 814, Y + 45, C.fg3, 3, 12);
    const v = pop(st.tk, 2); g.globalAlpha = u * v; cross(g, X + 765, Y + 20, 1); txt(g, '失败 → 30 s / 2 min / 10 min 后重试（示意）', X + 480, Y + 140, C.o, fnt(600, 21)); txt(g, '回调已经返回 200，不受影响', X + 480, Y + 176, C.fg3, fnt(500, 20)); g.restore(); }
};
// ---- 上传与后台 ----
AN.upload = (g, t, R) => {
  const B = [R.x + 20, R.y + 330], S = [R.x + R.w / 2 - 130, R.y + 80], O = [R.x + R.w / 2 - 130, R.y + 560];
  node(g, B[0], B[1], 240, 120, '浏览器', C.fg2, pop(t, .1), '组织者上传海报'); node(g, S[0], S[1], 260, 110, '应用服务器', C.b, pop(t, .2)); node(g, O[0], O[1], 260, 110, '对象存储', C.o, pop(t, .3), 'S3 / R2');
  const steps = [[[B[0] + 240, B[1] + 30], [S[0], S[1] + 70], '① 我要传 poster.jpg（2.1 MB）', C.fg2], [[S[0], S[1] + 95], [B[0] + 240, B[1] + 55], '② 给你一个 5 分钟有效的上传地址', C.b], [[B[0] + 240, B[1] + 90], [O[0], O[1] + 40], '③ 文件直接 PUT 到存储', C.o], [[B[0] + 240, B[1] + 110], [S[0], S[1] + 105], '④ 告诉服务器：传完了', C.fg2]];
  steps.forEach(([a, b, s, col], i) => { const u = pop(t, 1 + i * 1.1); if (u <= 0) return; arrow(g, a[0], a[1], b[0], b[1], col, 2.5, 12, u); g.save(); g.globalAlpha = u; txt(g, s, R.x + R.w / 2 + 170, R.y + 160 + i * 110, col === C.fg2 ? C.fg : col, fnt(600, 24)); g.restore(); });
  const u = pop(t, 5.5); g.save(); g.globalAlpha = u; rr(g, R.x + R.w / 2 + 160, R.y + 560, R.w / 2 - 180, 140, 14, 'rgba(14,20,36,.92)', C.g); txt(g, '服务器只做：', R.x + R.w / 2 + 186, R.y + 596, C.g, fnt(700, 22)); txt(g, '签发地址 · 限类型和大小 · 记下文件地址', R.x + R.w / 2 + 186, R.y + 640, C.fg2, fnt(500, 21)); txt(g, '大文件不经过应用服务器', R.x + R.w / 2 + 186, R.y + 676, C.fg3, fnt(500, 20)); g.restore();
};
AN.admin = (g, t, R, st) => {
  const k = st.k, x = R.x + 20, y = R.y + 20, w = 940;
  rr(g, x, y, w, 470, 16, '#0B1020', C.line2, 2); txt(g, '后台 · 前端工作坊 · 报名名单', x + 24, y + 34, C.fg, fnt(700, 24));
  chip(g, '导出 CSV', x + w - 330, y + 34, C.b, 1, 18); chip(g, '发起退款', x + w - 180, y + 34, C.r, 1, 18);
  const rows = [['1040', '王同学', 'paid'], ['1041', '李同学', 'paid'], ['1042', '陈同学', k === 1 ? (st.tk > 4 ? 'refunded' : (st.tk > 1 ? 'refund_pending' : 'paid')) : 'paid'], ['1043', '赵同学', 'pending'], ['1044', '周同学', 'cancelled']];
  const colOf = s => ({ paid: C.ok, pending: C.o, cancelled: C.fg3, refunded: C.p, refund_pending: C.gold }[s]);
  rows.forEach(([id, n, s], i) => { const Y = y + 90 + i * 72; rr(g, x + 16, Y - 28, w - 32, 60, 8, i === 2 && k === 1 ? 'rgba(255,210,122,.08)' : (i % 2 ? 'rgba(255,255,255,.02)' : null)); txt(g, '#' + id, x + 40, Y, C.fg3, fnt(500, 21, 'mono')); txt(g, n, x + 170, Y, C.fg, fnt(600, 23)); txt(g, '¥99.00', x + 400, Y, C.fg2, fnt(500, 21, 'mono')); tag(g, s, x + 600, Y, colOf(s)); });
  if (k === 0) { const X = x + w + 40; g.save(); g.globalAlpha = pop(t, 1); rr(g, X, y, R.w - w - 60, 690, 16, '#0B1020', C.gold, 2); txt(g, '审计记录', X + 22, y + 34, C.gold, fnt(800, 24));
    [['10:02', 'admin@…', '导出名单（37 行）'], ['10:15', 'admin@…', '取消 #1044'], ['10:31', 'admin@…', '退款 #1042 ¥99'], ['11:05', 'ops@…', '修改活动名额 40→45']].forEach(([a, b, c], i) => { const u = pop(t, 1.5 + i * .7); g.globalAlpha = u; const Y = y + 96 + i * 140; txt(g, a, X + 24, Y, C.fg3, fnt(500, 20, 'mono')); txt(g, b, X + 110, Y, C.fg2, fnt(500, 20)); txt(g, c, X + 24, Y + 40, C.fg, fnt(600, 22)); line(g, [[X + 24, Y + 80], [X + R.w - w - 84, Y + 80]], C.line); }); g.restore();
    banner(g, R, '谁 · 什么时候 · 对哪条数据 · 做了什么', pop(t, 4.5)); }
  if (k === 1) { const Y = y + 520, u = pop(st.tk, .2); g.save(); g.globalAlpha = u; node(g, x, Y, 220, 100, '后台', C.r, 1, '点“退款”'); node(g, x + 460, Y, 240, 100, 'Stripe', C.o, 1, '处理退款'); node(g, x + 940, Y, 300, 100, '回调', C.b, 1, 'charge.refunded');
    arrow(g, x + 224, Y + 50, x + 454, Y + 50, C.fg3, 3, 12, pop(st.tk, .5)); arrow(g, x + 704, Y + 50, x + 934, Y + 50, C.fg3, 3, 12, pop(st.tk, 3));
    txt(g, '状态：refund_pending', x + 230, Y + 130, C.gold, fnt(600, 21)); g.globalAlpha = u * pop(st.tk, 4); txt(g, '回调到达 → refunded', x + 940, Y + 130, C.p, fnt(700, 21)); g.restore(); }
};
// ---- 数据模型 ----
AN.er = (g, t, R, st) => {
  const T = { users: [R.x + 20, R.y + 40, ['id', 'email', 'name', 'created_at'], C.b], events: [R.x + 20, R.y + 400, ['id', 'title', 'starts_at', 'capacity', 'taken', 'price_cents', 'currency'], C.g], registrations: [R.x + 470, R.y + 200, ['id', 'event_id', 'user_id', 'status', 'amount_cents', 'created_at'], C.gold], payments: [R.x + 920, R.y + 40, ['id', 'registration_id', 'stripe_payment_intent_id', 'amount_cents', 'status'], C.o], emails: [R.x + 920, R.y + 420, ['id', 'registration_id', 'kind', 'sent_at', 'error'], C.p] };
  const hi = st.k >= 1 ? { 'registrations.amount_cents': '整数，单位分', 'registrations.created_at': 'timestamptz · UTC', 'registrations.user_id': 'UNIQUE(event_id, user_id)', 'payments.stripe_payment_intent_id': '对账用，唯一' } : {};
  const W = 360, rows = {};
  Object.entries(T).forEach(([n, [x, y, f, col]], i) => { const u = pop(t, .2 + i * .25); g.save(); g.globalAlpha = u; const h = 56 + f.length * 40; rr(g, x, y, W, h, 14, 'rgba(14,20,36,.95)', col, 2.5); txt(g, n, x + 18, y + 28, col, fnt(800, 23, 'mono'));
    f.forEach((s, j) => { const Y = y + 74 + j * 40, key = n + '.' + s; rows[key] = [x, Y]; if (hi[key]) rr(g, x + 6, Y - 18, W - 12, 36, 6, 'rgba(255,210,122,.16)'); txt(g, s, x + 22, Y, hi[key] ? C.gold : C.fg2, fnt(500, 20, 'mono')); }); g.restore(); });
  const rel = [['registrations.user_id', 'users.id'], ['registrations.event_id', 'events.id'], ['payments.registration_id', 'registrations.id'], ['emails.registration_id', 'registrations.id']];
  rel.forEach(([a, b], i) => { const u = pop(t, 1.6 + i * .2); const A = rows[a], B = rows[b]; if (!A || !B) return; const ax = A[0] > B[0] ? A[0] : A[0] + W, bx = A[0] > B[0] ? B[0] + W : B[0]; g.save(); g.globalAlpha = u; line(g, [[ax, A[1]], [(ax + bx) / 2, A[1]], [(ax + bx) / 2, B[1]], [bx, B[1]]], C.fg3, 2); dot(g, bx, B[1], 5, C.fg3); g.restore(); });
};
// ---- 认证与权限 ----
AN.auth = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '登录：用现成的方案');
    const O = [['邮箱魔法链接', '发一封带一次性链接的邮件', C.b], ['第三方登录', 'Google · GitHub 等', C.b], ['托管认证服务', '会话、找回、二次验证都有', C.b]];
    const w = (R.w - 80) / 3; O.forEach(([a, b, col], i) => { const u = pop(t, .4 + i * .4); card(g, R.x + 20 + i * (w + 20), R.y + 110, w, 200, '✓ ' + a, [b], C.ok, u, false, 23); });
    const u = pop(t, 2.2); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + 380, R.w - 40, 260, 16, 'rgba(255,107,107,.05)', C.bad, 2); txt(g, '✗ 自己从零写', R.x + 46, R.y + 420, C.bad, fnt(800, 28));
    ['密码哈希算法与参数', '会话过期与注销', '找回密码的令牌', '暴力破解防护'].forEach((s, i) => txt(g, s, R.x + 60 + (i % 2) * 560, R.y + 490 + Math.floor(i / 2) * 60, C.fg2, fnt(600, 24))); txt(g, '每一项都是常见的漏洞来源', R.x + 60, R.y + 610, C.fg3, fnt(500, 21)); g.restore(); return;
  }
  const tk = st.tk; hdr(g, R, '权限：每个接口都在服务端检查');
  const x = R.x + 20, y = R.y + 100, w = 580; rr(g, x, y, w, 50, 25, '#0B1020', C.line2); const lk = tk > 9, id = lk ? '1043' : '1042'; txt(g, 'signup.example.com/api/registrations/' + id, x + 22, y + 26, C.fg, fnt(500, 19, 'mono'));
  rr(g, x, y + 80, w, 300, 16, '#0B1020', lk ? C.bad : C.line2, 2);
  if (!lk) { txt(g, '我的报名 #1042', x + 30, y + 130, C.fg, fnt(700, 26)); txt(g, '陈同学 · chen@example.com · paid', x + 30, y + 180, C.fg2, fnt(500, 22)); }
  else { txt(g, '报名 #1043', x + 30, y + 130, C.bad, fnt(700, 26)); txt(g, '赵同学 · zhao@example.com', x + 30, y + 180, C.fg2, fnt(500, 22)); txt(g, '✗ 看到了别人的报名信息', x + 30, y + 250, C.bad, fnt(800, 28)); }
  const X = x + w + 40; g.save(); g.globalAlpha = pop(tk, 3); rr(g, X, y, R.w - w - 60, 380, 16, '#0B1020', C.line2, 2);
  txt(g, '有漏洞的写法', X + 24, y + 34, C.bad, fnt(800, 22));
  (['if (!session) return unauthorized()', 'const reg = await db.registrations', '  .find({ id })   // 没有检查归属', 'return json(reg)']).forEach((l, i) => txt(g, l, X + 24, y + 100 + i * 46, C.fg2, fnt(500, 20, 'mono'))); g.restore();
  banner(g, R, '只隐藏前端按钮不算权限：接口本身谁都能调', pop(tk, 5), C.bad);
};
AN.adapter = (g, t, R) => {
  node(g, R.x + 20, R.y + 300, 260, 140, '业务代码', C.b, pop(t, .1), '报名 · 退款 · 通知');
  const I = ['payments.createCheckout()', 'payments.refund()', 'mailer.send()', 'storage.presignUpload()'];
  const X = R.x + 380; g.save(); g.globalAlpha = pop(t, .4); rr(g, X, R.y + 160, 460, 420, 16, '#0B1020', C.gold, 2.5); txt(g, '你自己的接口', X + 24, R.y + 196, C.gold, fnt(800, 24)); I.forEach((s, i) => txt(g, s, X + 30, R.y + 260 + i * 76, C.fg, fnt(500, 22, 'mono'))); g.restore();
  arrow(g, R.x + 284, R.y + 370, X - 6, R.y + 370, C.fg3, 3, 12, pop(t, .4));
  const imp = [['Stripe 实现', '生产 / 预发布', C.o], ['假实现', '单元测试：记录调用', C.ok], ['另一家服务商', '以后要换时', C.fg3]];
  const sel = Math.floor(t / 2.2) % 3;
  imp.forEach(([a, b, col], i) => { const Y = R.y + 120 + i * 190, u = pop(t, .8 + i * .3); node(g, X + 600, Y, 340, 120, a, col, u * (sel === i ? 1 : .45), b); g.save(); g.globalAlpha = u * (sel === i ? 1 : .3); line(g, [[X + 464, R.y + 370], [X + 600, Y + 60]], sel === i ? C.gold : C.line2, sel === i ? 3 : 2); g.restore(); });
  banner(g, R, '换服务商只改这一层；测试时换成假的', pop(t, 3));
};
// ---- 环境 ----
AN.envs = (g, t, R, st) => {
  const E = [['本地开发', C.b, ['同一份代码', '.env.local', '种子数据', '测试模式']], ['预发布', C.o, ['同一份代码', '平台密钥（预发布）', '假数据', '测试模式']], ['生产', C.g, ['同一份代码', '平台密钥（生产）', '真实数据', '正式模式']]];
  const rows = ['代码', '配置 / 密钥', '数据', '支付 · 邮件'], w = (R.w - 260) / 3, focus = st.bi >= 2;
  rows.forEach((s, j) => { g.save(); g.globalAlpha = pop(t, .2); txt(g, s, R.x + 20, R.y + 190 + j * 110, C.fg3, fnt(600, 24)); g.restore(); });
  E.forEach(([a, col, v], i) => { const x = R.x + 220 + i * (w + 20), u = pop(t, .3 + i * .3), dim = focus && i !== 1; g.save(); g.globalAlpha = u * (dim ? .35 : 1); rr(g, x, R.y + 40, w, 520, 18, 'rgba(14,20,36,.92)', col, focus && i === 1 ? 3.5 : 2.5); txt(g, a, x + w / 2, R.y + 90, col, fnt(800, 32), 'center');
    v.forEach((s, j) => { const Y = R.y + 190 + j * 110; rr(g, x + 20, Y - 34, w - 40, 68, 12, j === 0 ? 'rgba(95,180,255,.08)' : C.panel, j === 0 ? C.b : C.line2, 1.5); txt(g, s, x + w / 2, Y, C.fg, fnt(600, 23), 'center'); }); g.restore(); });
  if (focus) { const u = pop(st.tk, .5); g.save(); g.globalAlpha = u; const x = R.x + 220 + (w + 20); rr(g, R.x + 20, R.y + 590, R.w - 40, 120, 16, 'rgba(255,178,92,.07)', C.o, 2); txt(g, '彩排：每次上线前在预发布完整走一遍', R.x + 46, R.y + 624, C.o, fnt(800, 25));
    ['登录', '报名', '测试卡付款', '收到邮件', '后台退款'].forEach((s, i) => check(g, R.x + 46 + i * ((R.w - 100) / 5), R.y + 676, s, pop(st.tk, 1 + i * .5), C.ok, 22)); g.restore(); }
  else banner(g, R, '同样的代码 · 不同的配置 · 不同的数据', pop(t, 2));
};
