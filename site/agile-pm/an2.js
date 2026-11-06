// 中集动画：工具
AN.tooltime = (g, t, R, st) => {
  const T = [['白板 · 便利贴', '—', C.fg3, 0], ['Bugzilla · Trac · Redmine', '2000 前后', C.fg3, 0], ['Jira', '2002', C.b, 0], ['Trello', '2011', C.b, 1], ['Asana · Monday', '工作管理', C.o, 1], ['GitHub Issues / Projects', '贴着代码', C.fg, 1], ['Linear', '2019', C.p, 1], ['Notion · 多维表格', '自己搭', C.g, 1], ['AI 代理', '2025–', C.gold, 1]];
  const x0 = R.x + 20, w = R.w - 40, n = T.length, y = R.y + 120;
  T.forEach(([a, b, col, late], i) => { const show = st.k >= late; if (!show) return; const u = pop(st.k > late || !late ? (late ? 99 : t) : st.tk, .3 + (late ? (i - 3) * 1.1 : i * .5)); const x = x0 + (i % 3) * (w / 3), yy = y + Math.floor(i / 3) * 200; g.save(); g.globalAlpha = u; rr(g, x, yy, w / 3 - 20, 170, 18, i === 8 ? 'rgba(255,210,122,.1)' : 'rgba(14,20,36,.92)', col, i === 8 ? 3 : 2); txt(g, b, x + 24, yy + 40, C.fg3, fnt(600, 20, 'mono')); wrapTxt(g, a, x + 24, yy + 96, w / 3 - 70, 36, i === 8 ? C.gold : C.fg, fnt(800, 30)); if (i < n - 1) txt(g, '→', x + w / 3 - 12, yy + 85, C.fg3, fnt(700, 26), 'center'); g.restore(); });
};
AN.model = (g, t, R, st) => {
  const k = st.k, L = [['目标 / 倡议', C.gold], ['项目 / 史诗', C.o], ['工作项 / Issue', C.b], ['子任务', C.fg3]];
  L.forEach(([a, col], i) => { const u = pop(t, .3 + i * .5), x = R.x + 20 + i * 60, y = R.y + 40 + i * 120; g.save(); g.globalAlpha = u * (k === 1 && i !== 2 ? .45 : 1); rr(g, x, y, 460, 90, 14, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, x + 24, y + 45, col, fnt(800, 28)); if (i) line(g, [[x - 30, y - 30], [x - 30, y + 45], [x, y + 45]], C.line2, 2); g.restore(); });
  if (k >= 1) { const X = R.x + 640, u = pop(st.tk, .3); g.save(); g.globalAlpha = u; rr(g, X, R.y + 40, 460, 480, 16, '#0B1020', C.b, 2); txt(g, 'SHOP-128 报名满员时仍可提交', X + 24, R.y + 80, C.fg, fnt(700, 22));
    [['状态', '进行中', C.b], ['负责人', '陈同学', C.fg], ['优先级', '高', C.o], ['标签', 'bug · 报名', C.fg2], ['预估', '2 天', C.fg2], ['冲刺', '第 14 周期', C.g]].forEach(([a, b, col], i) => { txt(g, a, X + 24, R.y + 150 + i * 56, C.fg3, fnt(600, 21)); txt(g, b, X + 160, R.y + 150 + i * 56, col, fnt(700, 22)); });
    const S = ['待处理', '进行中', '审查', '完成']; S.forEach((s, i) => { const xx = X + 24 + i * 108; rr(g, xx, R.y + 470, 96, 34, 8, i === 1 ? C.b : C.panel, C.line2, 1); txt(g, s, xx + 48, R.y + 487, i === 1 ? '#0B1020' : C.fg2, fnt(700, 17), 'center'); }); g.restore();
    const V = ['列表', '看板', '时间线', '日历', '表格']; V.forEach((v, i) => { const vv = pop(st.tk, 3 + i * .4); g.save(); g.globalAlpha = vv; chip(g, v, R.x + 1160, R.y + 70 + i * 90, [C.b, C.g, C.o, C.p, C.fg2][i], 1, 24); g.restore(); });
    g.save(); g.globalAlpha = pop(st.tk, 3); txt(g, '同一批数据 · 不同视图', R.x + 1160, R.y + 30, C.fg3, fnt(600, 20)); g.restore(); }
};
AN.spectrum = (g, t, R) => {
  hdr(g, R, '真正的差别：多少是固定的，多少可以配置');
  const y = R.y + 300, x0 = R.x + 60, x1 = R.x + R.w - 60; line(g, [[x0, y], [x1, y]], C.fg3, 4); arrow(g, x1 - 40, y, x1, y, C.fg3, 4, 16); arrow(g, x0 + 40, y, x0, y, C.fg3, 4, 16);
  txt(g, '有主见 · 约定多', x0, y + 50, C.p, fnt(800, 26)); txt(g, '可配置 · 自由度高', x1, y + 50, C.o, fnt(800, 26), 'right');
  [['Linear', .08, C.p], ['GitHub', .25, C.fg], ['Asana', .45, C.o], ['飞书项目', .62, C.b], ['Jira', .8, C.b], ['Notion / 多维表格', .95, C.g]].forEach(([s, u, col], i) => { const v = pop(t, .5 + i * .3), x = LERP(x0, x1, u); g.save(); g.globalAlpha = v; dot(g, x, y, 12, col); txt(g, s, x, y - (i % 2 ? 70 : 40), C.fg, fnt(700, 24), 'center'); g.restore(); });
  g.save(); g.globalAlpha = pop(t, 3); txt(g, '位置为示意', R.x + R.w - 30, R.y + 22, C.fg3, fnt(500, 18), 'right'); g.restore();
  banner(g, R, '越可配置，越能适应复杂组织，也越容易被配得一团乱', pop(t, 4));
};
AN.dceol = (g, t, R) => {
  hdr(g, R, 'Jira 自部署：Data Center 停售时间表');
  const D = [['2026-03-30', '停止向新客户销售', 0], ['2028-03-30', '老客户停止新购与扩容', .45], ['2029-03-28', '到期 → 只读', 1]], x0 = R.x + 80, x1 = R.x + R.w - 120, y = R.y + 330;
  line(g, [[x0, y], [x1, y]], C.fg3, 4); const nowU = (2026.85 - 2026.25) / (2029.24 - 2026.25);
  D.forEach(([d, s, u], i) => { const v = pop(t, .5 + i * .7), x = LERP(x0, x1, u); g.save(); g.globalAlpha = v; dot(g, x, y, 14, i === 2 ? C.bad : C.o); txt(g, d, x, y - 60, C.fg, fnt(800, 26, 'mono'), i === 2 ? 'right' : (i ? 'center' : 'left')); txt(g, s, x, y + 50, C.fg2, fnt(600, 22), i === 2 ? 'right' : (i ? 'center' : 'left')); g.restore(); });
  g.save(); g.globalAlpha = pop(t, 2.5); const xn = LERP(x0, x1, nowU); line(g, [[xn, y - 30], [xn, y + 30]], C.gold, 3); txt(g, '现在', xn, y + 90, C.gold, fnt(700, 20), 'center'); g.restore();
  banner(g, R, '产品重心转向云端，以及云端的 AI 能力 Rovo', pop(t, 4));
};
AN.trend = (g, t, R, st) => {
  const k = st.k, w = (R.w - 60) / 2, h = 300;
  const T = [['向云端集中', 'DC 停售 · 新功能（尤其 AI）只在云端', C.b], ['开源 · 可自部署', 'Plane · OpenProject · 禅道', C.g], ['洗牌', 'Height 关闭 · 先确认数据能完整导出', C.bad], ['收费方式在变', '按人头订阅 + AI 按用量计费', C.gold]];
  T.forEach(([a, b, col], i) => { const x = R.x + 20 + (i % 2) * (w + 20), y = R.y + 40 + Math.floor(i / 2) * (h + 30); const on = i === k, u = i <= k ? (i < k ? 1 : pop(st.tk, .3)) : 0; if (u <= 0) return; g.save(); g.globalAlpha = u * (on ? 1 : .45); rr(g, x, y, w, h, 18, on ? 'rgba(255,255,255,.04)' : 'rgba(14,20,36,.92)', col, on ? 3 : 2); txt(g, `${i + 1}`, x + 30, y + 50, col, fnt(900, 44, 'mono')); txt(g, a, x + 80, y + 50, C.fg, fnt(800, 30)); wrapTxt(g, b, x + 30, y + 130, w - 60, 36, C.fg2, fnt(500, 24)); g.restore(); });
};
AN.cn = (g, t, R) => {
  hdr(g, R, '选国内工具时常见的考量');
  const Q = [['私有化部署', '数据放在自己的机房或专属云', C.b], ['与即时通讯打通', '飞书 · 企业微信 · 钉钉：通知、审批、机器人', C.g], ['数据合规', '数据存放位置、审计、等级保护等要求', C.o]];
  Q.forEach(([a, b, col], i) => card(g, R.x + 20, R.y + 110 + i * 190, R.w - 40, 160, a, [b], col, pop(t, .4 + i * .8), false, 24));
};
AN.link = (g, t, R, st) => {
  const k = st.k, S = [['SHOP-128', '待处理', C.fg3], ['分支 shop-128-fix', '进行中', C.b], ['合并请求 #412', '审查中', C.p], ['已合并', '待发布', C.o], ['部署到生产', '完成', C.g]];
  const W = (R.w - 40 - 4 * 30) / 5, y = R.y + 150, tk = k ? st.tk : t, cur = Math.min(4, Math.floor(tk / 2.5));
  S.forEach(([a, b, col], i) => { const x = R.x + 20 + i * (W + 30), on = i <= cur; g.save(); g.globalAlpha = pop(t, .2 + i * .2); rr(g, x, y, W, 120, 14, 'rgba(14,20,36,.92)', on ? col : C.line2, 2.5); wrapTxt(g, a, x + 18, y + 44, W - 36, 28, C.fg, fnt(700, 22)); g.restore(); if (i < 4) arrow(g, x + W + 4, y + 60, x + W + 26, y + 60, C.fg3, 2.5, 10, pop(t, .3 + i * .2)); });
  const X = R.x + 20 + cur * (W + 30); g.save(); rr(g, R.x + 20, y + 200, R.w - 40, 200, 18, '#0B1020', C.line2, 2); txt(g, 'SHOP-128 报名满员时仍可提交', R.x + 50, y + 244, C.fg, fnt(700, 24)); const s = S[cur]; rr(g, R.x + 50, y + 290, 200, 50, 12, s[2]); txt(g, s[1], R.x + 150, y + 315, '#0B1020', fnt(800, 24), 'center');
  txt(g, k ? '状态自动更新，不用手动拖' : '提交、合并请求、检查、部署都关联到任务', R.x + 290, y + 315, C.fg2, fnt(600, 22)); g.restore();
  line(g, [[X + W / 2, y + 124], [X + W / 2, y + 196]], C.gold, 3);
  if (k) banner(g, R, '少了手动更新，数据才可信，报表才有意义', pop(st.tk, 5));
};
AN.choose = (g, t, R) => {
  hdr(g, R, '选工具前先回答这几个问题');
  const Q = ['团队多大，是不是跨部门？', '流程是特殊的还是通用的？', '需不需要私有化部署？', '工程师占多少比例？', '和代码托管、即时通讯怎么集成？'];
  Q.forEach((s, i) => { const u = pop(t, .4 + i * .8), y = R.y + 120 + i * 110; g.save(); g.globalAlpha = u; txt(g, '?', R.x + 50, y + 34, C.gold, fnt(900, 44), 'center'); rr(g, R.x + 100, y, R.w - 140, 80, 14, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, s, R.x + 130, y + 40, C.fg, fnt(700, 28)); g.restore(); });
};
AN.radar = (g, t, R) => {
  const ax = ['可配置', '速度 / 体验', '贴近代码', '跨部门', '私有化', 'AI 能力'], tools = [['Jira', [5, 2, 3, 3, 3, 4], C.b], ['Linear', [2, 5, 4, 2, 1, 4], C.p], ['GitHub', [2, 4, 5, 1, 3, 4], C.fg], ['Asana', [3, 4, 1, 5, 1, 4], C.o], ['飞书项目', [4, 3, 2, 4, 4, 3], C.g]];
  const n = ax.length, w = (R.w - 40) / 5, r = 120;
  tools.forEach(([name, v, col], j) => { const cx = R.x + 20 + j * w + w / 2, cy = R.y + 300, u = pop(t, .3 + j * .5); g.save(); g.globalAlpha = u;
    for (let ring = 1; ring <= 5; ring++) { g.beginPath(); for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + i / n * 2 * Math.PI; const rr2 = r * ring / 5; i ? g.lineTo(cx + rr2 * Math.cos(a), cy + rr2 * Math.sin(a)) : g.moveTo(cx + rr2 * Math.cos(a), cy + rr2 * Math.sin(a)); } g.strokeStyle = C.line; g.lineWidth = 1; g.stroke(); }
    g.beginPath(); v.forEach((x, i) => { const a = -Math.PI / 2 + i / n * 2 * Math.PI, rr2 = r * x / 5 * SS(u); i ? g.lineTo(cx + rr2 * Math.cos(a), cy + rr2 * Math.sin(a)) : g.moveTo(cx + rr2 * Math.cos(a), cy + rr2 * Math.sin(a)); }); g.closePath(); g.fillStyle = col + '44'; g.fill(); g.strokeStyle = col; g.lineWidth = 3; g.stroke();
    if (j === 0) ax.forEach((s, i) => { const a = -Math.PI / 2 + i / n * 2 * Math.PI; txt(g, s, cx + (r + 34) * Math.cos(a), cy + (r + 26) * Math.sin(a), C.fg3, fnt(500, 16), 'center'); });
    txt(g, name, cx, cy + r + 70, col, fnt(800, 28), 'center'); g.restore(); });
  g.save(); g.globalAlpha = pop(t, 2.5); txt(g, '主观示意：维度为 1–5 的粗略印象，不是评测结果', R.x + 20, R.y + 22, C.fg3, fnt(500, 20)); g.restore();
  const S = [['工程师为主的小团队', 'GitHub / Linear', C.p], ['大公司 · 流程复杂 · 合规', 'Jira / 国内同类', C.b], ['跨部门协作多', '工作管理工具', C.o]];
  S.forEach(([a, b, col], i) => { const u = pop(t, 5 + i * .8), x = R.x + 20 + i * ((R.w - 40) / 3); g.save(); g.globalAlpha = u; rr(g, x, R.y + 580, (R.w - 40) / 3 - 20, 120, 16, 'rgba(14,20,36,.92)', col, 2); txt(g, a, x + 24, R.y + 620, C.fg2, fnt(600, 22)); txt(g, b, x + 24, R.y + 666, col, fnt(800, 28)); g.restore(); });
};
