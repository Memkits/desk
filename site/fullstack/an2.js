// 中集动画：上线
AN.checklist = (g, t, R) => {
  hdr(g, R, '上线清单', '这一集逐项展开');
  const L = [['持续集成', '每次提交自动检查'], ['部署与回滚', '两条路径 · 迁移先加后删'], ['域名与证书', '解析 · HTTPS 自动续期 · 邮件验证'], ['安全基线', '密钥 · 权限 · 接口 · 依赖 · 数据'], ['性能与容量', '峰值 · 缓存 · 索引 · 连接池'], ['生产准备', '备份 · 告警 · 运行手册 · 法律页面'], ['发布与上线当天', '功能开关 · 灰度 · 上线顺序']];
  const w = (R.w - 60) / 2;
  L.forEach(([a, b], i) => { const col = i % 2, row = Math.floor(i / 2), x = R.x + 20 + col * (w + 20), y = R.y + 130 + row * 165, u = pop(t, .4 + i * .35); g.save(); g.globalAlpha = u; rr(g, x, y, w, 135, 16, 'rgba(14,20,36,.92)', C.line2, 2); check(g, x + 26, y + 42, `${String(i + 1).padStart(2, '0')}  ${a}`, pop(t, 3 + i * .5), C.ok, 28); txt(g, b, x + 72, y + 95, C.fg3, fnt(500, 22)); g.restore(); });
};
// ---- CI ----
const CIS = ['格式', '规范', '类型', '单元测试', '构建', '依赖审计', '端到端'];
AN.ci = (g, t, R, st) => {
  const tk = st.k ? st.tk : t, y = R.y + 230, x0 = R.x + 230, gap = 16, w = (R.w - 250 - gap * 6) / 7;
  if (st.bi === 3) {
    hdr(g, R, '合并之后：自动到预发布，手动到生产');
    const N = [['主分支', C.fg2], ['流水线', C.g], ['预发布', C.o], ['生产', C.g]], W = 300, G = (R.w - 40 - W * 4) / 3;
    N.forEach(([a, col], i) => { const x = R.x + 20 + i * (W + G); node(g, x, R.y + 250, W, 130, a, col, pop(t, .2 + i * .3)); if (i < 3) { arrow(g, x + W + 8, R.y + 315, x + W + G - 8, R.y + 315, i === 2 ? C.gold : C.fg3, 3, 12, pop(t, .4 + i * .3)); txt(g, i === 2 ? '手动按钮' : '自动', x + W + G / 2, R.y + 290, i === 2 ? C.gold : C.fg3, fnt(700, 22), 'center'); } });
    const u = pop(t, 2.5); g.save(); g.globalAlpha = u; const X = R.x + 20 + 2 * (W + G) + W + G / 2; rr(g, X - 90, R.y + 420, 180, 66, 33, C.gold); txt(g, '提升到生产', X, R.y + 453, '#0B1020', fnt(800, 24), 'center'); g.restore();
    banner(g, R, '一个人维护：留一个手动按钮，心里更踏实', pop(t, 4)); return;
  }
  const src = st.k === 0 ? [['人', 1]] : [['人', 1], ['代理', 6]];
  txt(g, '提交', R.x + 20, y - 60, C.fg3, fnt(600, 22));
  const per = st.k === 0 ? 6 : 5;
  const run = st.k === 0 ? Math.min(1, Math.floor(tk / per)) : Math.floor(tk / per), rt = tk - run * per;
  const fail = st.k === 0 ? (run === 0 ? 3 : -1) : (run % 2 === 1 ? 5 : -1);
  // 提交来源
  if (st.k === 0) { person(g, R.x + 80, y + 70, C.b, 1.2); txt(g, run === 0 ? 'commit a1f3' : 'commit b27c（修复）', R.x + 20, y + 150, C.fg2, fnt(500, 19, 'mono')); }
  else { person(g, R.x + 60, y + 30, C.b); for (let i = 0; i < 5; i++) bot(g, R.x + 60 + (i % 3) * 50, y + 110 + Math.floor(i / 3) * 70, C.p, .7); txt(g, '一天很多次提交', R.x + 20, y + 260, C.fg3, fnt(500, 20)); }
  CIS.forEach((s, i) => { const x = x0 + i * (w + gap), done = rt > .5 + i * .6, isF = i === fail && done, after = fail >= 0 && i > fail; const col = isF ? C.bad : (done && !after ? C.ok : C.line2);
    rr(g, x, y, w, 140, 14, 'rgba(14,20,36,.92)', col, 2.5); txt(g, s, x + w / 2, y + 50, after ? C.fg3 : C.fg, fnt(700, 24), 'center');
    if (isF) cross(g, x + w / 2, y + 100, 1); else if (done && !after) ticks(g, x + w / 2 - 14, y + 100, pop(rt, .5 + i * .6, .3)); else if (after) txt(g, '跳过', x + w / 2, y + 100, C.fg3, fnt(500, 18), 'center'); });
  const endT = .5 + (fail >= 0 ? fail : 6) * .6 + .4;
  const X = x0, Y = y + 220; if (rt > endT) { g.save(); g.globalAlpha = pop(rt, endT); rr(g, X, Y, 520, 80, 16, fail >= 0 ? 'rgba(255,107,107,.08)' : 'rgba(95,211,154,.08)', fail >= 0 ? C.bad : C.ok, 2.5); txt(g, fail >= 0 ? '✗ 不能合并' : '✓ 可以合并', X + 30, Y + 40, fail >= 0 ? C.bad : C.ok, fnt(800, 28)); g.restore(); }
  if (st.k === 1) banner(g, R, '不会疲劳的检查：不管代码是谁写的，只看有没有通过', pop(tk, 2));
};
// ---- 部署 ----
AN.deploy = (g, t, R, st) => {
  const k = st.bi === 4 ? 2 : st.k, tk = st.k ? st.tk : t;
  if (k === 0) {
    hdr(g, R, '托管平台：推送即部署');
    node(g, R.x + 20, R.y + 120, 220, 100, 'git push', C.fg2, pop(t, .1)); arrow(g, R.x + 130, R.y + 224, R.x + 130, R.y + 284, C.fg3, 3, 12, pop(t, .3)); node(g, R.x + 20, R.y + 290, 220, 100, '构建', C.g, pop(t, .3)); arrow(g, R.x + 244, R.y + 340, R.x + 290, R.y + 260, C.fg3, 3, 12, pop(t, .5));
    const D = [['#40', 'a1f3', ''], ['#41', 'b27c', ''], ['#42', 'c9e0', 'pr-17']], cw = (R.w - 340 - 60) / 3;
    D.forEach(([n, h, pr], i) => { const x = R.x + 320 + i * (cw + 30), u = pop(tk, .6 + i * .5); g.save(); g.globalAlpha = u; rr(g, x, R.y + 120, cw, 230, 14, '#0B1020', C.line2, 2); txt(g, '部署 ' + n, x + 20, R.y + 154, C.fg, fnt(800, 24)); txt(g, 'commit ' + h, x + 20, R.y + 196, C.fg3, fnt(500, 18, 'mono')); txt(g, `${n.slice(1)}-signup.preview.app`, x + 20, R.y + 236, C.b, fnt(500, 16, 'mono')); txt(g, '预览地址', x + 20, R.y + 266, C.fg3, fnt(500, 18)); g.restore(); });
    const cur = tk < 3 ? 1 : (tk < 7 ? 2 : 1); const px = R.x + 320 + cur * (cw + 30) + cw / 2; g.save(); g.globalAlpha = pop(tk, 1.5); arrow(g, px, R.y + 470, px, R.y + 362, C.gold, 4, 16); rr(g, px - 120, R.y + 470, 240, 64, 14, C.gold); txt(g, '生产 → ' + D[cur][0], px, R.y + 502, '#0B1020', fnt(800, 26), 'center'); g.restore();
    if (tk > 7) { g.save(); g.globalAlpha = pop(tk, 7); txt(g, '回滚 = 指回上一个部署（不重新构建）', R.x + 320, R.y + 600, C.gold, fnt(700, 26)); g.restore(); }
    return;
  }
  if (k === 1) {
    hdr(g, R, '自管服务器 / 容器平台：镜像 + 逐个替换');
    node(g, R.x + 20, R.y + 150, 220, 100, '流水线', C.g, pop(tk, .1), 'docker build'); arrow(g, R.x + 244, R.y + 200, R.x + 330, R.y + 200, C.fg3, 3, 12, pop(tk, .3));
    g.save(); g.globalAlpha = pop(tk, .4); rr(g, R.x + 336, R.y + 120, 300, 300, 14, '#0B1020', C.o, 2); txt(g, '镜像仓库', R.x + 360, R.y + 154, C.o, fnt(800, 24)); ['signup:41', 'signup:42'].forEach((s, i) => { rr(g, R.x + 360, R.y + 200 + i * 80, 252, 56, 10, C.panel, i ? C.gold : C.line2); txt(g, s, R.x + 380, R.y + 228 + i * 80, C.fg, fnt(500, 22, 'mono')); }); g.restore();
    arrow(g, R.x + 640, R.y + 270, R.x + 730, R.y + 270, C.fg3, 3, 12, pop(tk, 1));
    const n = 4; for (let i = 0; i < n; i++) { const x = R.x + 740 + i * 190, sw = tk > 2 + i * 1.5, mid = tk > 1.5 + i * 1.5 && !sw; g.save(); g.globalAlpha = pop(tk, .8); rr(g, x, R.y + 190, 170, 170, 14, 'rgba(14,20,36,.92)', sw ? C.gold : (mid ? C.o : C.line2), 2.5); txt(g, '实例 ' + (i + 1), x + 85, R.y + 230, C.fg2, fnt(600, 20), 'center'); txt(g, sw ? 'v42' : 'v41', x + 85, R.y + 290, sw ? C.gold : C.fg, fnt(800, 32, 'mono'), 'center'); if (mid) txt(g, '替换中', x + 85, R.y + 336, C.o, fnt(600, 18), 'center'); g.restore(); }
    banner(g, R, '回滚 = 换回上一个镜像版本号（signup:41）', pop(tk, 8)); return;
  }
  hdr(g, R, '回滚演练（在预发布）');
  const S = [['部署 v43', C.o], ['回滚到 v42', C.gold], ['数据库正常？', C.ok], ['缓存正常？', C.ok], ['后台任务正常？', C.ok]];
  S.forEach(([a, col], i) => { const y = R.y + 120 + i * 105, u = pop(t, .4 + i * .6); g.save(); g.globalAlpha = u; rr(g, R.x + 20, y, 620, 80, 14, 'rgba(14,20,36,.92)', col, 2); check(g, R.x + 46, y + 40, a, pop(t, .8 + i * .6), col, 26); g.restore(); });
  const u = pop(t, 4); g.save(); g.globalAlpha = u; rr(g, R.x + 720, R.y + 180, R.w - 760, 300, 18, 'rgba(255,210,122,.06)', C.gold, 2); txt(g, '演练时记下：', R.x + 750, R.y + 230, C.gold, fnt(800, 26)); ['回滚命令 / 按钮在哪里', '用了多长时间', '哪一步需要额外处理'].forEach((s, i) => txt(g, '· ' + s, R.x + 760, R.y + 290 + i * 54, C.fg, fnt(600, 24))); txt(g, '写进运行手册', R.x + 760, R.y + 450, C.fg3, fnt(500, 21)); g.restore();
};
AN.migrate = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '部署过程中，新旧版本同时在跑');
    const x0 = R.x + 200, x1 = R.x + R.w - 40, Y = R.y + 160, X = u => LERP(x0, x1, u);
    line(g, [[x0, Y + 380], [x1, Y + 380]], C.fg3, 2); ['T0', '+1 min', '+2 min', '+3 min', '+4 min'].forEach((s, i) => txt(g, s, X(i / 4), Y + 410, C.fg3, fnt(500, 18, 'mono'), 'center'));
    const u = pop(t, .3); g.save(); g.globalAlpha = u; rr(g, X(0), Y, X(.12) - X(0), 70, 10, 'rgba(255,210,122,.15)', C.gold); txt(g, '迁移', X(.06), Y + 35, C.gold, fnt(800, 22), 'center'); txt(g, '数据库', R.x + 20, Y + 35, C.fg2, fnt(600, 22)); g.restore();
    const v = pop(t, 1); g.save(); g.globalAlpha = v; txt(g, '旧版本', R.x + 20, Y + 150, C.fg2, fnt(600, 22)); rr(g, X(0), Y + 120, X(.8) - X(0), 60, 10, 'rgba(163,174,195,.12)', C.fg3); txt(g, '旧代码 · 跑在新结构上', X(.4), Y + 150, C.fg2, fnt(600, 21), 'center');
    txt(g, '新版本', R.x + 20, Y + 250, C.fg2, fnt(600, 22)); rr(g, X(.15), Y + 220, X(1) - X(.15), 60, 10, 'rgba(95,180,255,.12)', C.b); txt(g, '新代码', X(.6), Y + 250, C.b, fnt(700, 21), 'center'); g.restore();
    const w = pop(t, 2.5); g.save(); g.globalAlpha = w; rr(g, X(.15), Y + 100, X(.8) - X(.15), 200, 10, null, C.gold, 2.5); txt(g, '共存几分钟', X(.475), Y + 330, C.gold, fnt(800, 24), 'center'); g.restore();
    banner(g, R, '迁移在新代码启动前执行，且旧代码在新结构上还能跑', pop(t, 4)); return;
  }
  hdr(g, R, '先加后删：一次表结构修改分三次发布', '例：把 name 拆成 display_name');
  const P = [['发布 1 · 加', ['ADD COLUMN display_name', '新旧代码都能工作', '写 name，同时写 display_name'], C.g], ['发布 2 · 用', ['回填历史数据', '代码改为读 display_name', '旧列还在，随时可退'], C.b], ['发布 3 · 删', ['确认没有旧代码在跑', 'DROP COLUMN name', '最后才做'], C.r]];
  const w = (R.w - 80) / 3; P.forEach(([a, L, col], i) => { const u = pop(st.tk, .4 + i * 1.2); card(g, R.x + 20 + i * (w + 20), R.y + 120, w, 380, a, L, col, u, false, 24); g.save(); g.globalAlpha = u; tag(g, '✓ 可单独回滚', R.x + 40 + i * (w + 20), R.y + 460, C.ok); g.restore(); if (i < 2) arrow(g, R.x + 20 + i * (w + 20) + w + 2, R.y + 310, R.x + 20 + (i + 1) * (w + 20) - 2, R.y + 310, C.fg3, 3, 10, u); });
};
// ---- 域名 ----
AN.dns = (g, t, R, st) => {
  const mail = st.bi === 3; hdr(g, R, mail ? '邮件发送域名：配好验证记录' : '域名解析');
  const rows = [['signup.example.com', 'CNAME', '部署平台给出的地址', C.b, 0], ['example.com', 'TXT', 'v=spf1 include:<邮件服务> ~all', C.p, 1], ['<选择器>._domainkey', 'CNAME / TXT', 'DKIM 公钥', C.p, 1], ['_dmarc.example.com', 'TXT', 'v=DMARC1; p=quarantine; …', C.p, 1]];
  const x = R.x + 20, y = R.y + 110, w = R.w - 40; g.save(); g.globalAlpha = pop(t, .2); rr(g, x, y, w, 80 + rows.length * 78, 16, '#0B1020', C.line2, 2); ['名称', '类型', '值'].forEach((s, i) => txt(g, s, x + [30, 380, 560][i], y + 40, C.fg3, fnt(600, 20))); g.restore();
  rows.forEach(([n, ty, v, col, isMail], i) => { const u = pop(t, .5 + i * .4) * (mail ? (isMail ? 1 : .35) : (isMail ? .55 : 1)); g.save(); g.globalAlpha = u; const Y = y + 110 + i * 78; txt(g, n, x + 30, Y, C.fg, fnt(500, 21, 'mono')); txt(g, ty, x + 380, Y, col, fnt(700, 21, 'mono')); txt(g, v, x + 560, Y, C.fg2, fnt(500, 20, 'mono')); g.restore(); });
  const Y = y + 120 + rows.length * 78;
  if (!mail) { const u = pop(t, 3); g.save(); g.globalAlpha = u; node(g, R.x + 20, Y + 20, 220, 90, '用户', C.fg2, 1); node(g, R.x + 360, Y + 20, 320, 90, 'Cloudflare 这类服务', C.o, 1, 'DNS · CDN · 基础防护'); node(g, R.x + 800, Y + 20, 260, 90, '部署平台', C.b, 1); arrow(g, R.x + 244, Y + 65, R.x + 354, Y + 65, C.fg3, 3, 12); arrow(g, R.x + 684, Y + 65, R.x + 794, Y + 65, C.fg3, 3, 12); g.restore(); }
  else { const u = pop(st.tk, 1.5); g.save(); g.globalAlpha = u; [['没配', '垃圾箱', C.bad], ['配好', '收件箱', C.ok]].forEach(([a, b, col], i) => { const X = R.x + 20 + i * 520; rr(g, X, Y + 20, 480, 90, 14, 'rgba(14,20,36,.92)', col, 2); txt(g, a + ' SPF / DKIM / DMARC', X + 24, Y + 50, C.fg, fnt(700, 22)); txt(g, '确认邮件 → ' + b, X + 24, Y + 86, col, fnt(700, 22)); }); g.restore(); }
};
AN.cert = (g, t, R) => {
  hdr(g, R, 'HTTPS 证书：最长有效期在缩短', '公开信任的 TLS 证书（CA/B 论坛规定）');
  const D = [['2026-03 以前', 398], ['2026-03-15', 200], ['2027-03-15', 100], ['2029-03-15', 47]], x = R.x + 260, w = R.w - 440;
  D.forEach(([a, d], i) => { const y = R.y + 140 + i * 100, u = pop(t, .5 + i * .6); g.save(); g.globalAlpha = u; txt(g, a, R.x + 20, y + 30, C.fg2, fnt(600, 22, 'mono')); rr(g, x, y + 6, w * d / 398 * SS(u), 48, 10, i === 0 ? C.fg3 : C.b); txt(g, d + ' 天', x + w * d / 398 * SS(u) + 16, y + 30, C.fg, fnt(800, 26)); g.restore(); });
  const u = pop(t, 3.5); g.save(); g.globalAlpha = u; const cx = R.x + 330, cy = R.y + 640; g.strokeStyle = C.ok; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, 60, -1.2 + t, 4.5 + t); g.stroke(); txt(g, 'ACME', cx, cy, C.ok, fnt(800, 22), 'center');
  txt(g, '自动签发 · 自动续期', cx + 100, cy - 20, C.fg, fnt(800, 28)); txt(g, '托管平台代办；自管服务器用 Let\'s Encrypt + 自动续期任务', cx + 100, cy + 24, C.fg3, fnt(500, 22)); g.restore();
};
AN.slide_policy = (g, t, R) => {
  txt(g, '在国内提供服务（概览）', R.x + 20, R.y + 20, C.fg, fnt(800, 32));
  const u = pop(t, .3); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + 80, R.w - 40, 520, 18, 'rgba(14,20,36,.92)', C.fg3, 2);
  [['需要按要求完成备案等手续', C.fg], ['各地、各家云厂商的具体要求不完全一样', C.fg2], ['办理需要一些时间：上线计划里预留出来', C.fg2], ['提前查清楚，以官方和服务商的指引为准', C.gold]].forEach(([s, col], i) => { const v = pop(t, .8 + i * .6); g.globalAlpha = u * v; dot(g, R.x + 70, R.y + 170 + i * 110, 8, col); txt(g, s, R.x + 100, R.y + 170 + i * 110, col, fnt(700, 32)); }); g.restore();
  g.save(); g.globalAlpha = pop(t, 3.5); txt(g, '本片不展开具体政策', R.x + 20, R.y + 650, C.fg3, fnt(500, 22)); g.restore();
};
// ---- 安全 ----
AN.seclist = (g, t, R, st) => {
  hdr(g, R, '安全基线', '一个人也能做完的最低要求');
  const S = [['密钥', ['不进仓库、不进日志', '每个环境一套', '泄露能马上换'], C.r, 1], ['权限', ['数据库账号最小权限', '后台单独保护', '二次验证'], C.o, 1], ['接口', ['所有输入都校验', '登录 / 报名限流', '错误不暴露内部细节'], C.b, 2], ['依赖', ['锁定版本', '定期审计', '升级看变更说明'], C.p, 2], ['数据', ['备份加密', '只收需要的个人信息', '导出文件设过期'], C.g, 3]];
  const cols = 3, w = (R.w - 40 - 40) / cols, h = 270;
  S.forEach(([a, L, col, kk], i) => { const x = R.x + 20 + (i % cols) * (w + 20), y = R.y + 100 + Math.floor(i / cols) * (h + 20); const on = st.k === 0 || st.k === kk; card(g, x, y, w, h, a, L, col, pop(t, .2 + i * .25) * (on ? 1 : .35), st.k === kk, 23); });
  const x = R.x + 20 + 2 * (w + 20), y = R.y + 100 + h + 20; const on = st.k === 3; g.save(); g.globalAlpha = pop(t, 1.6) * (st.k === 0 || on ? 1 : .35); rr(g, x, y, w, h, 16, 'rgba(199,155,255,.06)', C.p, on ? 3 : 2); bot(g, x + 46, y + 48, C.p, .8); txt(g, 'AI 审查', x + 84, y + 40, C.p, fnt(800, 26));
  ['给它这份清单', '逐条检查代码', '列出可疑位置', '你逐条确认'].forEach((s, i) => { check(g, x + 30, y + 100 + i * 42, s, on ? pop(st.tk, 1 + i * .8) : 0, C.p, 21); }); g.restore();
};
// ---- 性能 ----
AN.spike = (g, t, R) => {
  hdr(g, R, '先估峰值：开放报名的那一分钟', '曲线为示意');
  const x = R.x + 100, y = R.y + 120, w = R.w - 160, h = 520; line(g, [[x, y], [x, y + h], [x + w, y + h]], C.fg3, 2);
  txt(g, '请求 / 分钟', x - 10, y - 20, C.fg3, fnt(500, 18)); ['09:50', '10:00 开放报名', '10:10', '10:20'].forEach((s, i) => txt(g, s, x + w * i / 3, y + h + 30, i === 1 ? C.o : C.fg3, fnt(500, 18), 'center'));
  const f = u => { const z = (u - .36) / .03; return 20 + 600 * Math.exp(-z * z / 2) + 160 * Math.exp(-(((u - .45) / .1) ** 2)); };
  const p = SS(t / 3); const pts = []; for (let i = 0; i <= 200 * p; i++) { const u = i / 200; pts.push([x + u * w, y + h - f(u) / 700 * h]); } if (pts.length > 1) line(g, pts, C.b, 3.5);
  const v = pop(t, 3.5); g.save(); g.globalAlpha = v; const cap = y + h - 2100 / 700 * h * .25; line(g, [[x, y + 40], [x + w, y + 40]], C.gold, 2.5, [10, 8]); txt(g, '准备容量 ≈ 峰值 × 几倍', x + w - 10, y + 20, C.gold, fnt(700, 22), 'right'); txt(g, '峰值几百人', x + w * .36 + 40, y + h - 620 / 700 * h, C.fg, fnt(700, 22)); g.restore();
};
AN.perf = (g, t, R) => {
  const L = [['浏览器', '', C.fg2], ['CDN', '静态资源 · 活动详情页缓存', C.o], ['应用', '接口', C.b], ['数据库', '索引：(event_id, status)', C.g]];
  const y = R.y + 140, W = 280, G = (R.w - 40 - W * 4) / 3;
  L.forEach(([a, b, col], i) => { const x = R.x + 20 + i * (W + G); node(g, x, y, W, 130, a, col, pop(t, .2 + i * .3), b); if (i < 3) arrow(g, x + W + 6, y + 65, x + W + G - 6, y + 65, C.fg3, 3, 12, pop(t, .4 + i * .3)); });
  const ph = (t * .5) % 1; packet(g, [[R.x + 20 + W / 2, y + 160], [R.x + 20 + (W + G) + W / 2, y + 160]], ph, C.ok, 9); txt(g, '大部分请求在 CDN 就返回', R.x + 20 + (W + G) / 2 + W / 2, y + 200, C.ok, fnt(600, 20), 'center');
  const u = pop(t, 3); g.save(); g.globalAlpha = u; const X = R.x + 20, Y = R.y + 420; rr(g, X, Y, R.w - 40, 300, 16, '#0B1020', C.line2, 2); txt(g, '压测结果（示意）', X + 24, Y + 34, C.fg, fnt(800, 24));
  [['报名接口 p95', '180 ms', C.ok], ['错误率', '0.1 %', C.ok], ['DB 连接数', '24 / 30', C.o], ['CPU', '45 %', C.ok]].forEach(([a, b, col], i) => { const x = X + 30 + i * ((R.w - 100) / 4); txt(g, a, x, Y + 110, C.fg3, fnt(600, 21)); txt(g, b, x, Y + 170, col, fnt(800, 40, 'mono')); }); txt(g, '在预发布上模拟峰值；看延迟、错误率和连接数', X + 30, Y + 250, C.fg2, fnt(500, 21)); g.restore();
};
AN.pool = (g, t, R) => {
  hdr(g, R, '数据库连接数：无服务器部署的常见坑');
  const n = 14, dbx = R.x + R.w * .72, dby = R.y + 380, ph = CL((t - 1) / 4), pooled = t > 13;
  const cnt = Math.round(LERP(3, n, ph));
  for (let i = 0; i < cnt; i++) { const x = R.x + 40 + (i % 2) * 130, y = R.y + 120 + Math.floor(i / 2) * 82; rr(g, x, y, 110, 60, 10, 'rgba(14,20,36,.92)', C.b, 1.5); txt(g, 'λ' + (i + 1), x + 55, y + 30, C.fg2, fnt(600, 18), 'center');
    const tx = pooled ? R.x + R.w * .45 : dbx; for (let c = 0; c < (pooled ? 1 : 3); c++) line(g, [[x + 110, y + 20 + c * 10], [tx, dby - 40 + (i * 3 + c) % 9 * 10]], pooled ? C.ok : 'rgba(255,107,107,.4)', 1.5); }
  if (pooled) { const u = pop(t, 13); g.save(); g.globalAlpha = u; node(g, R.x + R.w * .45 - 10, dby - 70, 220, 140, '连接池', C.ok, 1, '少量长连接'); for (let c = 0; c < 4; c++) line(g, [[R.x + R.w * .45 + 210, dby - 30 + c * 20], [dbx, dby - 30 + c * 20]], C.ok, 2.5); g.restore(); }
  node(g, dbx, dby - 90, 260, 180, 'Postgres', C.g, 1);
  const used = pooled ? LERP(cnt * 3, 4, pop(t, 13)) : cnt * 3, lim = 30, X = dbx, Y = dby + 130; rr(g, X, Y, 260, 26, 13, C.panel, C.line2); rr(g, X, Y, 260 * Math.min(1, used / lim), 26, 13, used >= lim ? C.bad : (used > 20 ? C.o : C.ok)); txt(g, `连接 ${Math.round(used)} / ${lim}（示意）`, X, Y + 56, used >= lim ? C.bad : C.fg2, fnt(700, 21));
  if (!pooled && used >= lim) txt(g, 'too many connections', X, Y + 92, C.bad, fnt(700, 20, 'mono'));
};
// ---- 生产准备 ----
AN.ready = (g, t, R, st) => {
  const k = st.k; hdr(g, R, '打开大门之前', '出事那一刻才有用的东西，要先就位');
  const G = [['备份', ['自动备份已打开', '知道怎么恢复'], C.g, 1], ['告警', ['错误上报接入生产', '故意触发一次，手机收到'], C.r, 1], ['运行手册', ['怎么回滚 · 怎么关功能', '各服务后台入口', '账号归谁管'], C.b, 2], ['状态页', ['出事时告诉用户', '发生了什么、何时恢复'], C.o, 2], ['法律页面', ['隐私政策 · 服务条款', '退款规则', 'AI 起草，你来确认'], C.p, 3]];
  const w = (R.w - 40 - 80) / 5;
  G.forEach(([a, L, col, kk], i) => { const on = k === 0 || k === kk; card(g, R.x + 20 + i * (w + 20), R.y + 110, w, 380, a, L, col, pop(t, .2 + i * .2) * (on ? 1 : .3), k === kk, 21); });
  if (k === 1) { const u = pop(st.tk, 1.5); g.save(); g.globalAlpha = u; const x = R.x + 40, y = R.y + 540; rr(g, x, y, 560, 170, 18, '#0B1020', C.line2); txt(g, 'throw new Error("alert test")', x + 24, y + 40, C.fg2, fnt(500, 20, 'mono')); arrow(g, x + 300, y + 80, x + 640, y + 80, C.r, 3, 12, pop(st.tk, 2.5));
    const X = x + 660; rr(g, X, y - 20, 200, 220, 26, '#0B1020', C.fg3, 2); const v = pop(st.tk, 3); g.globalAlpha = u * v; rr(g, X + 14, y + 30, 172, 90, 12, 'rgba(255,122,147,.15)', C.r); txt(g, '● 新错误', X + 30, y + 58, C.fg, fnt(700, 18)); txt(g, 'alert test · prod', X + 30, y + 92, C.fg2, fnt(500, 16)); g.restore(); }
  if (k === 2) banner(g, R, '真正出事的时候，你只需要照着这一页做', pop(st.tk, 2));
  if (k === 3) banner(g, R, '这些页面写的是你对用户的承诺：必要时请专业人士看一遍', pop(st.tk, 2), C.p);
};
// ---- 发布 ----
AN.flags = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '功能开关：上线 ≠ 打开', '新功能：候补自动转正');
    const tk = t, states = [['关闭', C.fg3], ['只对我', C.o], ['所有人', C.ok], ['出问题 → 关闭', C.bad]], s = tk < 3 ? 0 : tk < 6.5 ? 1 : tk < 10 ? 2 : 3;
    states.forEach(([a, col], i) => { const x = R.x + 20 + i * 330, on = i === s; g.save(); g.globalAlpha = pop(tk, .3 + i * .2) * (on ? 1 : .4); rr(g, x, R.y + 140, 300, 140, 16, on ? 'rgba(255,255,255,.04)' : 'rgba(14,20,36,.9)', col, on ? 3 : 2);
      const sx = x + 30, sy = R.y + 190, onv = i === 1 || i === 2; rr(g, sx, sy - 18, 72, 36, 18, onv ? col : C.line2); dot(g, onv ? sx + 54 : sx + 18, sy, 14, C.fg); txt(g, a, sx + 92, sy, C.fg, fnt(700, 24)); txt(g, ['代码已部署', '生产环境自测', '确认后放开', '比回滚快'][i], x + 30, R.y + 250, C.fg3, fnt(500, 20)); g.restore(); });
    const u = pop(tk, 2); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + 340, 900, 200, 16, '#0B1020', C.line2); ['if (flags.enabled("waitlist-auto-promote", user)) {', '  await promoteFromWaitlist(eventId)', '}'].forEach((l, i) => txt(g, l, R.x + 50, R.y + 400 + i * 46, C.fg2, fnt(500, 22, 'mono'))); g.restore(); return;
  }
  hdr(g, R, '灰度发布：新版本先接一小部分流量', '数字为示意');
  const pct = [5, 25, 100], tk = st.tk, s = tk < 5 ? 0 : tk < 9.5 ? 1 : 2, p = pct[s];
  const x = R.x + 20, y = R.y + 140, w = R.w - 40; rr(g, x, y, w, 80, 14, 'rgba(163,174,195,.12)', C.line2); rr(g, x, y, w * p / 100, 80, 14, 'rgba(95,180,255,.35)', C.b, 2); txt(g, `新版本 ${p}%`, x + 20, y + 40, C.fg, fnt(800, 28)); if (p < 100) txt(g, `旧版本 ${100 - p}%`, x + w - 20, y + 40, C.fg2, fnt(700, 26), 'right');
  const X = R.x + 100, Y = R.y + 300, W = R.w - 200, H = 300; line(g, [[X, Y], [X, Y + H], [X + W, Y + H]], C.fg3, 2); txt(g, '错误率', X - 10, Y - 20, C.fg3, fnt(500, 18));
  const pts = []; for (let i = 0; i <= 100 * CL(tk / 13.5); i++) pts.push([X + i / 100 * W, Y + H - 40 - 8 * Math.sin(i * .7) - 4 * Math.sin(i * 1.9)]); if (pts.length > 1) line(g, pts, C.ok, 3); line(g, [[X, Y + H - 180], [X + W, Y + H - 180]], C.bad, 2, [8, 8]); txt(g, '阈值', X + W, Y + H - 200, C.bad, fnt(600, 18), 'right');
  [5, 9.5].forEach((a, i) => { if (tk > a) { const xx = X + a / 13.5 * W; line(g, [[xx, Y], [xx, Y + H]], C.b, 2, [4, 6]); txt(g, `→ ${pct[i + 1]}%`, xx + 8, Y + 20, C.b, fnt(700, 20)); } });
};
AN.launchday = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '上线当天：按顺序来');
    const S = [['确认备份可用', '最近一次备份时间 · 恢复方式'], ['执行迁移', '先加后删'], ['部署新版本', '记下上一个版本号'], ['走一笔最小金额的真实报名', '邮件收到 · 后台可见 · 退款完成'], ['观察 30 分钟', '错误率 · 响应时间 · 支付回调']];
    S.forEach(([a, b], i) => { const y = R.y + 110 + i * 120, u = pop(t, .4 + i * 1.2); g.save(); g.globalAlpha = Math.max(.25, u); txt(g, String(i + 1), R.x + 50, y + 40, C.gold, fnt(800, 40, 'mono'), 'center'); rr(g, R.x + 100, y, R.w - 140, 92, 14, 'rgba(14,20,36,.92)', u > .9 ? C.ok : C.line2, 2); check(g, R.x + 124, y + 32, a, pop(t, 1 + i * 1.2), C.ok, 26); txt(g, b, R.x + 170, y + 70, C.fg3, fnt(500, 20)); if (i < 4) line(g, [[R.x + 50, y + 70], [R.x + 50, y + 110]], C.line2, 2); g.restore(); }); return;
  }
  hdr(g, R, '上线时间：选你有空处理问题的时候');
  const O = [['✗ 周五晚上', '出了问题没人管一整个周末', C.bad], ['✗ 开放报名前一小时', '没有时间观察和回滚', C.bad], ['✓ 工作日上午', '有一整天可以观察', C.ok]];
  const w = (R.w - 80) / 3; O.forEach(([a, b, col], i) => { const u = pop(st.tk, .4 + i * .8); card(g, R.x + 20 + i * (w + 20), R.y + 130, w, 260, a, [b], col, u, false, 24); });
  banner(g, R, '到这里，网站已经上线 · 下集：维护', pop(st.tk, 4));
};
