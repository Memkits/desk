// 上集动画：方法论的现状
AN.three = (g, t, R) => {
  const Q = [['要做什么', 'What', C.b], ['谁在做', 'Who', C.g], ['做到哪了', 'Where', C.o]], w = (R.w - 80) / 3;
  Q.forEach(([a, b, col], i) => { const u = pop(t, .4 + i * .9), x = R.x + 20 + i * (w + 20), y = R.y + 160 + (1 - u) * 30; g.save(); g.globalAlpha = u; rr(g, x, y, w, 300, 24, 'rgba(14,20,36,.92)', col, 3); txt(g, b, x + w / 2, y + 90, col, fnt(800, 40, 'mono'), 'center'); txt(g, a, x + w / 2, y + 180, C.fg, fnt(900, 56), 'center'); g.restore(); });
  const v = pop(t, 4); g.save(); g.globalAlpha = v; txt(g, '方法和工具：回答这三个问题的不同方式', R.x + R.w / 2, R.y + 580, C.fg2, fnt(600, 30), 'center'); g.restore();
};
AN.timeline = (g, t, R, st) => {
  const E = [['1970s', '瀑布 · 甘特图', C.fg3, 0], ['2001', '敏捷宣言', C.b, 0], ['2000s', 'Scrum · XP · 看板', C.b, 0], ['2010s', '规模化：SAFe · LeSS', C.o, 1], ['2019', 'Shape Up', C.g, 1], ['2020s', '远程 · OKR · 流动指标', C.p, 1], ['2025–', 'AI 代理成为执行者', C.gold, 1]];
  const x0 = R.x + 30, x1 = R.x + R.w - 30, y = R.y + 360, X = i => LERP(x0, x1, i / (E.length - 1));
  // 早期压缩：前三个点挤在左边
  const pos = [0, .1, .2, .42, .6, .78, 1].map(u => LERP(x0, x1, u));
  line(g, [[x0, y], [x1, y]], C.line2, 4);
  E.forEach(([d, s, col, late], i) => { const show = st.k >= late ? 1 : 0, u = show * pop(st.k > late ? 99 : (late ? st.tk : t), .3 + (late ? i - 3 : i) * .7); if (u <= 0) return; g.save(); g.globalAlpha = u; const x = pos[i], up = i % 2 === 0; dot(g, x, y, i === 6 ? 14 : 10, col); line(g, [[x, y], [x, up ? y - 90 : y + 90]], col, 2);
    const al = i === 6 ? 'right' : (i === 0 ? 'left' : 'center'), xx = i === 6 ? x + 14 : (i === 0 ? x - 14 : x); txt(g, d, xx, up ? y - 150 : y + 130, col, fnt(800, i === 6 ? 32 : 26, 'mono'), al); txt(g, s, xx, up ? y - 110 : y + 170, i === 6 ? C.fg : C.fg2, fnt(600, i === 6 ? 26 : 22), al); g.restore(); });
  g.save(); g.globalAlpha = pop(t, 1) * .8; rr(g, pos[0] - 20, y + 220, pos[2] - pos[0] + 40, 40, 10, 'rgba(255,255,255,.03)', C.line2, 1); txt(g, '早期：快速带过', (pos[0] + pos[2]) / 2, y + 240, C.fg3, fnt(500, 18), 'center'); rr(g, pos[3] - 20, y + 220, pos[6] - pos[3] + 40, 40, 10, 'rgba(255,210,122,.06)', C.gold, 1.5); txt(g, '本系列重点', (pos[3] + pos[6]) / 2, y + 240, C.gold, fnt(700, 18), 'center'); g.restore();
  if (st.k >= 2) { const u = pop(st.tk, .3); [['上集', '方法', C.b], ['中集', '工具', C.g], ['下集', 'AI 时代', C.gold]].forEach(([a, b, col], i) => { g.save(); g.globalAlpha = u * pop(st.tk, .3 + i * .5); chip(g, `${a} · ${b}`, R.x + 20 + i * 300, R.y + 60, col, 1, 26); g.restore(); }); }
};
// ---- 现状 ----
AN.survey = (g, t, R, st) => {
  const k = st.k; hdr(g, R, '第 18 期敏捷现状报告（2025-10）', '受访者以大企业的敏捷教练和顾问为主');
  const B = [['混合 / 自定义方法', 74, C.b, 0], ['使用 AI（上年 68%）', 84, C.p, 1], ['业务价值受到更多审视', 76, C.o, 1], ['已有 AI 治理护栏', 49, C.g, 1], ['尝试 AI 代理', 26, C.gold, 1]];
  const x = R.x + 340, w = R.w - 460;
  B.forEach(([a, v, col, kk], i) => { if (k < kk) return; const y = R.y + 140 + i * 110, u = pop(kk ? (k > kk ? 99 : st.tk) : t, .4 + (kk ? i - 1 : 0) * .5, .9); g.save(); g.globalAlpha = Math.min(1, u * 2); txt(g, a, R.x + 20, y + 30, C.fg, fnt(700, 24)); rr(g, x, y + 8, w, 44, 10, C.panel, C.line2, 1); rr(g, x, y + 8, w * v / 100 * SS(u), 44, 10, col); txt(g, (i === 4 ? '> ' : '') + Math.round(v * SS(u)) + '%', x + w * v / 100 * SS(u) + 14, y + 30, C.fg, fnt(800, 26, 'mono')); g.restore(); });
  if (k === 1) { g.save(); g.globalAlpha = pop(st.tk, 1); const x0 = x + w * .68, y0 = R.y + 250 + 30; line(g, [[x0, y0 - 40], [x0, y0 + 20]], C.fg3, 2, [4, 4]); txt(g, '68%', x0, y0 - 54, C.fg3, fnt(600, 18, 'mono'), 'center'); g.restore(); }
  if (k === 2) banner(g, R, '问题不是选哪个标准答案，而是理解每种方法解决什么问题', pop(st.tk, .5));
};
// ---- Scrum ----
AN.sprint = (g, t, R, st) => {
  const cx = R.x + R.w * .5, cy = R.y + 380, rx = 560, ry = 250;
  g.save(); g.strokeStyle = C.b; g.lineWidth = 6; g.globalAlpha = .35; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 7); g.stroke(); g.restore();
  const ph = (t * .08) % 1; g.save(); g.strokeStyle = C.b; g.lineWidth = 8; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, -Math.PI / 2, -Math.PI / 2 + ph * 2 * Math.PI); g.stroke(); g.restore();
  const E = [['冲刺计划', -Math.PI / 2, C.b], ['每日站会', 0, C.g], ['冲刺评审', Math.PI / 2, C.o], ['回顾', Math.PI, C.p]];
  E.forEach(([a, an, col], i) => { const u = pop(t, .3 + i * .4); node(g, cx + rx * Math.cos(an) - 120, cy + ry * Math.sin(an) - 40, 240, 80, a, col, u); });
  for (let d = 0; d < 10; d++) { const an = -Math.PI / 2 + (d + .5) / 10 * 2 * Math.PI; if (Math.abs(Math.sin(an)) > .9 || Math.abs(Math.cos(an)) > .95) continue; dot(g, cx + (rx - 34) * Math.cos(an), cy + (ry - 34) * Math.sin(an), 5, ph > (d + .5) / 10 ? C.g : C.line2); }
  txt(g, '冲刺', cx, cy - 30, C.fg, fnt(900, 48), 'center'); txt(g, '1–4 周 · 固定长度', cx, cy + 26, C.fg3, fnt(600, 24), 'center');
  if (st.bi >= 3) { const u = pop(st.tk, .5); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + R.h - 120, R.w - 40, 106, 16, 'rgba(255,107,107,.06)', C.bad, 2); txt(g, '常见失败：只剩仪式', R.x + 46, R.y + R.h - 84, C.bad, fnt(800, 26)); txt(g, '会都开了 · 冲刺目标形同虚设 · 回顾里的问题从来没改', R.x + 46, R.y + R.h - 42, C.fg2, fnt(500, 22)); g.restore(); }
};
AN.scrum2020 = (g, t, R, st) => {
  const k = st.k, w = (R.w - 60) / 3;
  const cols = [['角色', ['产品负责人', 'Scrum Master', '开发者'], C.b], ['事件', ['冲刺', '冲刺计划', '每日站会', '冲刺评审', '冲刺回顾'], C.g], ['工件 → 承诺', ['产品待办 → 产品目标', '冲刺待办 → 冲刺目标', '增量 → 完成的定义'], C.o]];
  cols.forEach(([h, L, col], i) => { const x = R.x + 20 + i * (w + 10), u = pop(t, .3 + i * .5); g.save(); g.globalAlpha = u; rr(g, x, R.y + 20, w, 440, 16, 'rgba(14,20,36,.92)', col, 2); txt(g, h, x + 22, R.y + 56, col, fnt(800, 26)); L.forEach((s, j) => txt(g, s, x + 26, R.y + 120 + j * 64, C.fg, fnt(600, 23))); g.restore(); });
  g.save(); g.globalAlpha = pop(t, .2); txt(g, 'Scrum 指南 2020', R.x + 20, R.y - 10, C.fg3, fnt(600, 20)); g.restore();
  if (k >= 1) { const u = pop(st.tk, .4), Y = R.y + 500; g.save(); g.globalAlpha = u; rr(g, R.x + 20, Y, R.w - 40, 280, 16, 'rgba(255,210,122,.06)', C.gold, 2.5); txt(g, '2025 扩展包（补充，不替代官方指南）', R.x + 46, Y + 36, C.gold, fnt(800, 25));
    [['干系人', C.fg2], ['支持者', C.fg2], ['AI：辅助角色', C.p]].forEach(([s, col], i) => { const v = pop(st.tk, 1.5 + i * .8); g.globalAlpha = u * v; chip(g, s, R.x + 46 + i * 220, Y + 104, col, 1, 22); });
    g.globalAlpha = u * pop(st.tk, 5); txt(g, '人负责判断与责任', R.x + 720, Y + 104, C.fg3, fnt(500, 21)); g.globalAlpha = u * pop(st.tk, 8); txt(g, '成果完成的定义：交付的东西有没有真的产生效果', R.x + 46, Y + 190, C.fg, fnt(700, 25)); g.restore(); }
};
// ---- 看板 ----
const KC = [['待办', C.fg3, 0], ['开发中', C.b, 3], ['审查', C.p, 2], ['测试', C.o, 2], ['完成', C.g, 0]];
AN.board = (g, t, R, st) => {
  const n = KC.length, w = (R.w - 40 - (n - 1) * 16) / n, y = R.y + 70;
  // 卡片状态随时间流动
  const cards = [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [3, 0], [4, 0], [4, 1]];
  KC.forEach(([a, col, lim], i) => { const x = R.x + 20 + i * (w + 16); rr(g, x, y, w, 600, 16, 'rgba(14,20,36,.7)', col, 2); txt(g, a, x + 20, y + 34, col, fnt(800, 26)); if (lim) txt(g, `上限 ${lim}`, x + w - 20, y + 34, C.gold, fnt(700, 20), 'right'); });
  const step = Math.floor(t / 2.2), f = SS((t % 2.2) / .8);
  const counts = KC.map(() => 0); const pos = cards.map(([c]) => c);
  // 每一步：最靠右的可移动卡片前进一列（尊重上限）
  for (let s = 0; s <= step; s++) for (let c = n - 2; c >= 0; c--) { const idx = pos.findIndex(p => p === c); if (idx < 0) continue; const lim = KC[c + 1][2]; if (lim && pos.filter(p => p === c + 1).length >= lim) continue; if (s === step) { pos.moving = idx; pos.to = c + 1; break; } pos[idx] = c + 1; break; }
  const slot = KC.map(() => 0);
  pos.forEach((c, i) => { let cc = c, frac = 0; if (pos.moving === i) { frac = f; } const j = slot[cc]++; const x0 = R.x + 20 + cc * (w + 16) + 14, y0 = y + 66 + j * 86; let x = x0, yy = y0; if (pos.moving === i) { const j2 = slot[pos.to]; x = LERP(x0, R.x + 20 + pos.to * (w + 16) + 14, frac); yy = LERP(y0, y + 66 + j2 * 86, frac); }
    rr(g, x, yy, w - 28, 70, 10, '#131B2E', pos.moving === i ? C.gold : C.line2, 1.5); txt(g, ['登录页文案', '导出 CSV', '修复时区', '支付重试', '候补功能', '后台搜索', '邮件模板', '活动列表', '限流', '权限检查', '首页改版', '日志字段'][i], x + 16, yy + 26, C.fg, fnt(600, 19)); rr(g, x + 16, yy + 44, 60, 10, 5, KC[cc][1]); });
  if (st.bi === 3) banner(g, R, '冲刺做规划 + 看板管执行：Scrumban', pop(st.tk, 1));
  else banner(g, R, '一列满了：先把手头的做完，再从上游拉新的', pop(t, 4));
};
AN.cfd = (g, t, R) => {
  hdr(g, R, '累积流图', '数据为示意');
  const x = R.x + 100, y = R.y + 110, w = R.w - 180, h = 520, N = 30, p = SS(CL(t / 4));
  const series = i => { const d = i; return [d * 2.0, d * 1.65 + (d > 15 ? (d - 15) * .1 : 0), d * 1.35 - (d > 15 ? (d - 15) * .35 : 0), d * 1.15 - (d > 15 ? (d - 15) * .4 : 0), d * 1.0 - (d > 15 ? (d - 15) * .42 : 0)]; };
  const maxv = 62, cols = KC.map(c => c[1]).reverse(), names = ['完成', '测试', '审查', '开发中', '待办'];
  for (let band = 0; band < 5; band++) { const top = 4 - band; g.beginPath(); for (let i = 0; i <= N * p; i++) { const v = series(i)[top]; const X = x + i / N * w, Y = y + h - v / maxv * h; i ? g.lineTo(X, Y) : g.moveTo(X, Y); } for (let i = Math.floor(N * p); i >= 0; i--) { const v = top < 4 ? series(i)[top + 1] : 0; g.lineTo(x + i / N * w, y + h - v / maxv * h); } g.closePath(); g.fillStyle = cols[band] + '99'; g.fill(); }
  line(g, [[x, y], [x, y + h], [x + w, y + h]], C.fg3, 2); txt(g, '数量', x - 10, y - 16, C.fg3, fnt(500, 18)); txt(g, '时间 →', x + w, y + h + 28, C.fg3, fnt(500, 18), 'right');
  if (p > .9) { names.forEach((s, i) => { const v = (series(N)[4 - i] + (i ? series(N)[5 - i] : 0)) / 2; }); const u = pop(t, 4.5); g.save(); g.globalAlpha = u; const X = x + w * .8, Y1 = y + h - series(24)[0] / maxv * h, Y2 = y + h - series(24)[1] / maxv * h; line(g, [[X, Y1], [X, Y2]], C.gold, 3); txt(g, '待办这条带子越来越宽 → 上游在堵', X - 10, Y1 - 24, C.gold, fnt(700, 22), 'right'); g.restore(); }
  ['待办', '开发中', '审查', '测试', '完成'].forEach((s, i) => { rr(g, x + w - 560 + i * 112, y - 40, 20, 20, 4, KC[i][1]); txt(g, s, x + w - 532 + i * 112, y - 30, C.fg2, fnt(500, 18)); });
};
AN.scatter = (g, t, R) => {
  hdr(g, R, '周期时间散点图', '每个点是一件完成的事，数据为示意');
  const x = R.x + 90, y = R.y + 110, w = R.w - 140, h = 520, maxd = 12; line(g, [[x, y], [x, y + h], [x + w, y + h]], C.fg3, 2); txt(g, '天', x - 14, y - 16, C.fg3, fnt(500, 18));
  for (let d = 0; d <= maxd; d += 3) txt(g, d, x - 14, y + h - d / maxd * h, C.fg3, fnt(500, 16, 'mono'), 'right');
  const n = Math.floor(80 * CL(t / 3)); let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 80; i++) { const r = rnd(), r2 = rnd(); if (i >= n) continue; const d = Math.min(maxd - .3, -Math.log(1 - r * .97) * 2.6 + .5); dot(g, x + 10 + r2 * (w - 20), y + h - d / maxd * h, 6, d > 6 ? C.o : C.b); }
  [[3, '50%', C.fg2], [6, '85%', C.gold], [9, '95%', C.fg3]].forEach(([d, p, col], i) => { const u = pop(t, 3.5 + i * .8); g.save(); g.globalAlpha = u; const Y = y + h - d / maxd * h; line(g, [[x, Y], [x + w, Y]], col, 2.5, [10, 8]); txt(g, `${p} · ${d} 天`, x + w - 10, Y - 16, col, fnt(800, 22), 'right'); g.restore(); });
  banner(g, R, '“这件事有 85% 的可能在 6 天内完成”', pop(t, 6.5));
};
// ---- Shape Up ----
AN.shapeup = (g, t, R) => {
  const x0 = R.x + 20, w = R.w - 40, y = R.y + 160, unit = w / 17;
  [['开发周期 · 6 周', 6, C.b], ['冷却', 2, C.fg3], ['开发周期 · 6 周', 6, C.b], ['冷却', 2, C.fg3]].reduce((acc, [s, n, col], i) => { const u = pop(t, .3 + i * .4); g.save(); g.globalAlpha = u; rr(g, x0 + acc * unit, y, n * unit - 8, 100, 14, col === C.b ? 'rgba(92,180,255,.18)' : 'rgba(163,174,195,.08)', col, 2); txt(g, s, x0 + acc * unit + 20, y + 50, col === C.b ? C.fg : C.fg3, fnt(700, 24)); g.restore(); return acc + n; }, 0);
  const S = [['塑形', '少数人把方案打磨到“刚好够清楚”', C.o], ['定胃口', '最多值得投入多少，而不是要多久', C.gold], ['下注会', '决定下个周期做哪几件', C.g]];
  S.forEach(([a, b, col], i) => { const u = pop(t, 2 + i * .8), X = x0 + i * (w / 3); g.save(); g.globalAlpha = u; rr(g, X, y + 180, w / 3 - 20, 200, 16, 'rgba(14,20,36,.92)', col, 2); txt(g, a, X + 24, y + 222, col, fnt(800, 30)); wrapTxt(g, b, X + 24, y + 280, w / 3 - 70, 34, C.fg2, fnt(500, 23)); g.restore(); });
};
AN.hill = (g, t, R) => {
  hdr(g, R, '山形图：进度不是百分比', '上坡：还在摸索 · 下坡：只剩执行');
  const x = R.x + 120, w = R.w - 240, base = R.y + 560, hgt = 360, H = u => base - hgt * Math.sin(Math.PI * u);
  g.save(); g.strokeStyle = C.fg2; g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= 100; i++) { const u = i / 100; i ? g.lineTo(x + u * w, H(u)) : g.moveTo(x, H(0)); } g.stroke(); g.restore();
  line(g, [[x + w / 2, base - hgt - 30], [x + w / 2, base + 20]], C.line2, 2, [6, 6]); txt(g, '想清楚了', x + w / 2, base + 46, C.fg3, fnt(600, 20), 'center'); txt(g, '摸索', x + w * .22, base + 46, C.o, fnt(700, 22), 'center'); txt(g, '执行', x + w * .78, base + 46, C.g, fnt(700, 22), 'center');
  const P = [['支付重试', .15, .8, C.b], ['候补功能', .05, .45, C.p], ['后台导出', .55, .95, C.o]];
  P.forEach(([s, a, b, col], i) => { const u = LERP(a, b, SS(CL((t - 1 - i * .5) / 8))); const X = x + u * w, Y = H(u); dot(g, X, Y, 14, col); txt(g, s, X, Y - 32, C.fg, fnt(700, 22), 'center'); });
};
// ---- 目标 ----
AN.okr = (g, t, R) => {
  hdr(g, R, 'OKR：目标 + 可衡量的关键结果', '按季度复盘');
  const x = R.x + 20, y = R.y + 110; g.save(); g.globalAlpha = pop(t, .3); rr(g, x, y, R.w - 40, 120, 18, 'rgba(255,210,122,.08)', C.gold, 2.5); txt(g, 'O', x + 40, y + 60, C.gold, fnt(900, 54, 'serif'), 'center'); txt(g, '让第一次办活动的组织者也能轻松上手', x + 90, y + 60, C.fg, fnt(800, 32)); g.restore();
  const K = [['KR1', '新组织者首个活动的创建时间', '25 分钟 → 10 分钟', .62], ['KR2', '首个活动的报名转化率', '18% → 25%', .4], ['KR3', '活动创建相关的客服工单', '-40%', .75]];
  K.forEach(([a, b, c, p], i) => { const Y = y + 170 + i * 140, u = pop(t, 1 + i * .6); g.save(); g.globalAlpha = u; rr(g, x + 60, Y, R.w - 160, 110, 16, 'rgba(14,20,36,.92)', C.b, 2); txt(g, a, x + 90, Y + 38, C.b, fnt(800, 24, 'mono')); txt(g, b, x + 190, Y + 38, C.fg, fnt(700, 24)); txt(g, c, x + 190, Y + 78, C.fg3, fnt(500, 21)); const bw = 300, bx = x + R.w - 160 - bw; rr(g, bx, Y + 60, bw, 18, 9, C.panel); rr(g, bx, Y + 60, bw * p * SS(CL((t - 2) / 2)), 18, 9, C.g); g.restore(); });
  g.save(); g.globalAlpha = pop(t, .5); txt(g, '数字为示意', R.x + R.w - 30, R.y + 22, C.fg3, fnt(500, 18), 'right'); g.restore();
};
AN.nnl = (g, t, R) => {
  const w = (R.w - 220) / 2; g.save(); g.globalAlpha = pop(t, .2) * (t > 4 ? .3 : 1); txt(g, '按日期排满的路线图', R.x + 20, R.y + 20, C.fg3, fnt(700, 22));
  ['1 月', '2 月', '3 月', '4 月', '5 月', '6 月'].forEach((m, i) => txt(g, m, R.x + 20 + i * 120, R.y + 60, C.fg3, fnt(500, 18)));
  [[0, 2], [1, 3], [2, 5], [3, 6], [0, 4], [4, 6]].forEach(([a, b], i) => rr(g, R.x + 20 + a * 120, R.y + 84 + i * 36, (b - a) * 120 - 8, 26, 6, C.line2)); g.restore();
  const cols = [['现在', '在做 · 有明确范围', ['候补报名', '导出 CSV', '支付重试']], ['接下来', '方向确定 · 细节未定', ['组织者模板', '多场次活动']], ['以后', '想法 · 不承诺', ['会员体系', '国际化']]];
  const cw = (R.w - 80) / 3; cols.forEach(([a, b, L], i) => { const u = pop(t, 4 + i * .6), x = R.x + 20 + i * (cw + 20), y = R.y + 340; g.save(); g.globalAlpha = u; rr(g, x, y, cw, 400, 18, 'rgba(14,20,36,.92)', [C.g, C.b, C.fg3][i], 2.5); txt(g, a, x + 24, y + 40, [C.g, C.b, C.fg3][i], fnt(800, 32)); txt(g, b, x + 24, y + 84, C.fg3, fnt(500, 20));
    L.forEach((s, j) => { const hh = [70, 56, 44][i]; rr(g, x + 24, y + 120 + j * (hh + 16), cw - 48, hh, 10, C.panel, C.line2); txt(g, s, x + 44, y + 120 + j * (hh + 16) + hh / 2, C.fg, fnt(600, [24, 22, 20][i])); }); g.restore(); });
};
AN.ost = (g, t, R) => {
  hdr(g, R, '持续探索：机会—方案树', '探索与交付并行');
  const root = [R.x + R.w / 2, R.y + 140]; node(g, root[0] - 200, root[1] - 40, 400, 80, '目标：首个活动转化率提升', C.gold, pop(t, .2));
  const O = [['机会：不知道怎么定价', R.x + R.w * .22], ['机会：报名表太长', R.x + R.w * .5], ['机会：分享出去没人点', R.x + R.w * .78]];
  O.forEach(([s, x], i) => { const u = pop(t, 1 + i * .5); g.save(); g.globalAlpha = u; line(g, [[root[0], root[1] + 40], [x, R.y + 280]], C.line2, 2); g.restore(); node(g, x - 170, R.y + 280, 340, 76, s, C.b, u); });
  const Sl = [[1, '方案：只保留 3 个字段', C.g], [1, '方案：自动填充', C.g], [0, '方案：定价建议', C.g]];
  Sl.forEach(([oi, s, col], i) => { const ox = O[oi][1], x = ox + (i === 1 ? 170 : i === 0 ? -130 : -60), u = pop(t, 3 + i * .5); g.save(); g.globalAlpha = u; line(g, [[ox, R.y + 356], [x, R.y + 440]], C.line2, 2); g.restore(); node(g, x - 135, R.y + 440, 270, 70, s, col, u); });
  const v = pop(t, 5); g.save(); g.globalAlpha = v; const x = O[1][1] - 150; rr(g, x - 150, R.y + 560, 300, 70, 12, 'rgba(255,210,122,.1)', C.gold, 2); txt(g, '实验：5 位用户试用', x, R.y + 595, C.fg, fnt(700, 22), 'center'); line(g, [[x, R.y + 510], [x, R.y + 560]], C.gold, 2); g.restore();
};
// ---- 规模化 ----
AN.scale = (g, t, R, st) => {
  const k = st.k, w = (R.w - 40) / 3;
  if (k === 0) {
    const F = [['SAFe', '大规模联合规划', 'PI：8–12 周', 5, C.o], ['LeSS', '多个团队共用一个产品待办', '更轻', 3, C.b], ['Spotify 模型', '小队 · 部落 · 分会', '2012 年的描述', 4, C.p]];
    F.forEach(([a, b, c, lv, col], i) => { const x = R.x + 20 + i * w, u = pop(t, .3 + i * .7); g.save(); g.globalAlpha = u; rr(g, x, R.y + 60, w - 20, 560, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, x + 24, R.y + 104, col, fnt(800, 32)); wrapTxt(g, b, x + 24, R.y + 160, w - 70, 32, C.fg2, fnt(500, 22)); txt(g, c, x + 24, R.y + 240, C.fg3, fnt(600, 20));
      txt(g, '流程分量', x + 24, R.y + 540, C.fg3, fnt(500, 18)); for (let j = 0; j < 5; j++) rr(g, x + 24 + j * 40, R.y + 562, 30, 30, 6, j < lv ? col : C.panel); g.restore(); });
    return; }
  hdr(g, R, 'Spotify：“这不是一个框架”');
  const u = pop(st.tk, .3); g.save(); g.globalAlpha = u; const sq = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]; sq.forEach(([a, b], i) => { const x = R.x + 60 + a * 220, y = R.y + 130 + b * 200; rr(g, x, y, 190, 160, 14, 'rgba(199,155,255,.08)', C.p, 2); txt(g, '小队 ' + (i + 1), x + 95, y + 40, C.fg, fnt(700, 22), 'center'); for (let p = 0; p < 4; p++) person(g, x + 40 + p * 38, y + 100, C.fg3, .55); });
  rr(g, R.x + 40, R.y + 110, 680, 400, 20, null, C.p, 2.5); txt(g, '部落', R.x + 60, R.y + 92, C.p, fnt(800, 24)); g.restore();
  g.save(); g.globalAlpha = pop(st.tk, 3); rr(g, R.x + 780, R.y + 180, R.w - 800, 240, 18, 'rgba(255,107,107,.06)', C.bad, 2); wrapTxt(g, '一次对自己组织的描述，后来多次说明不建议照搬', R.x + 806, R.y + 240, R.w - 860, 40, C.fg, fnt(700, 28)); g.restore();
};
AN.topo = (g, t, R) => {
  hdr(g, R, '团队拓扑：按交互方式设计团队', '减少等待和交接');
  const S = [['报名团队', R.y + 140], ['支付团队', R.y + 290], ['组织者后台团队', R.y + 440]];
  S.forEach(([s, y], i) => { const u = pop(t, .3 + i * .4); g.save(); g.globalAlpha = u; rr(g, R.x + 20, y, 820, 110, 16, 'rgba(92,180,255,.1)', C.b, 2.5); txt(g, s, R.x + 50, y + 40, C.fg, fnt(800, 26)); txt(g, '流程对齐：端到端负责一块业务', R.x + 50, y + 80, C.fg3, fnt(500, 20)); arrow(g, R.x + 600, y + 55, R.x + 820, y + 55, C.b, 3, 14); g.restore(); });
  const u = pop(t, 2); g.save(); g.globalAlpha = u; rr(g, R.x + 20, R.y + 600, R.w - 40, 110, 16, 'rgba(95,211,154,.1)', C.g, 2.5); txt(g, '平台团队', R.x + 50, R.y + 640, C.g, fnt(800, 26)); txt(g, '部署 · 监控 · 数据：以自助服务的方式提供', R.x + 50, R.y + 680, C.fg2, fnt(500, 21)); g.restore();
  g.save(); g.globalAlpha = pop(t, 3); rr(g, R.x + 900, R.y + 140, R.w - 920, 410, 16, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, '另外两类', R.x + 926, R.y + 180, C.fg2, fnt(700, 24)); txt(g, '赋能团队：帮别人补能力', R.x + 926, R.y + 250, C.fg, fnt(600, 23)); txt(g, '复杂子系统团队：专门的难题', R.x + 926, R.y + 310, C.fg, fnt(600, 23)); txt(g, '《Team Topologies》，2019', R.x + 926, R.y + 500, C.fg3, fnt(500, 19)); g.restore();
};
// ---- 估算 ----
AN.poker = (g, t, R) => {
  hdr(g, R, '故事点与计划扑克');
  const V = ['1', '2', '3', '5', '8', '13', '?'], w = 150;
  V.forEach((v, i) => { const u = pop(t, .2 + i * .15), x = R.x + 40 + i * (w + 30), y = R.y + 120; g.save(); g.globalAlpha = u; rr(g, x, y, w, 200, 16, '#131B2E', C.b, 2.5); txt(g, v, x + w / 2, y + 100, C.fg, fnt(900, 64, 'mono'), 'center'); g.restore(); });
  const sp = [18, 22, 31, 42, 55], u = pop(t, 3); g.save(); g.globalAlpha = u; txt(g, '每个冲刺完成的点数（示意）', R.x + 40, R.y + 400, C.fg3, fnt(600, 22));
  sp.forEach((v, i) => { const h = v * 5 * SS(CL((t - 3 - i * .3) / .6)); rr(g, R.x + 60 + i * 120, R.y + 720 - h, 80, h, 8, i > 2 ? C.o : C.b); txt(g, v, R.x + 100 + i * 120, R.y + 700 - h, C.fg, fnt(700, 22, 'mono'), 'center'); });
  txt(g, '点数一旦被考核 → 通货膨胀', R.x + 720, R.y + 620, C.bad, fnt(800, 30)); g.restore();
};
AN.montecarlo = (g, t, R) => {
  hdr(g, R, '蒙特卡洛：用历史吞吐量预测', '还剩 40 件，数据为示意');
  const hist = [6, 4, 7, 5, 8, 3, 6, 5]; g.save(); g.globalAlpha = pop(t, .2); txt(g, '过去 8 周每周完成', R.x + 20, R.y + 120, C.fg2, fnt(600, 22)); hist.forEach((v, i) => { rr(g, R.x + 20 + i * 48, R.y + 260 - v * 14, 36, v * 14, 6, C.b); txt(g, v, R.x + 38 + i * 48, R.y + 280, C.fg3, fnt(500, 16, 'mono'), 'center'); }); g.restore();
  let seed = 3; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const sims = Math.floor(2000 * CL((t - 1) / 6)), bins = {}; for (let s = 0; s < 2000; s++) { let left = 40, w = 0; while (left > 0) { left -= hist[Math.floor(rnd() * 8)]; w++; } if (s < sims) bins[w] = (bins[w] || 0) + 1; }
  const x = R.x + 460, y = R.y + 140, W = R.w - 500, H = 480; line(g, [[x, y + H], [x + W, y + H]], C.fg3, 2); const ks = []; for (let w = 5; w <= 13; w++) ks.push(w); const mx = Math.max(60, ...Object.values(bins)) * 1.1;
  let cum = 0, p85 = null; ks.forEach((w, i) => { const v = bins[w] || 0; cum += v; if (!p85 && sims && cum / sims >= .85) p85 = w; const bw = W / ks.length; rr(g, x + i * bw + 8, y + H - v / mx * H, bw - 16, v / mx * H, 6, p85 === w ? C.gold : C.p); txt(g, `${w} 周`, x + i * bw + bw / 2, y + H + 26, C.fg3, fnt(500, 18), 'center'); });
  txt(g, `模拟 ${sims} 次`, x + W, y - 10, C.fg2, fnt(600, 20, 'mono'), 'right');
  if (t > 7 && p85) banner(g, R, `85% 的可能在第 ${p85} 周之前做完`, pop(t, 7));
};
// ---- 度量 ----
AN.metrics = (g, t, R, st) => {
  if (st.bi === 0) { hdr(g, R, '速度：只适合团队自己做计划');
    const T = [['A 组', 42, C.b], ['B 组', 18, C.g], ['C 组', 65, C.o]]; T.forEach(([a, v, col], i) => { const u = pop(t, .4 + i * .3); g.save(); g.globalAlpha = u; rr(g, R.x + 60, R.y + 150 + i * 120, v * 10 * SS(u), 80, 10, col); txt(g, a, R.x + 30, R.y + 190 + i * 120, C.fg, fnt(700, 22), 'right'); txt(g, v + ' 点', R.x + 80 + v * 10 * SS(u), R.y + 190 + i * 120, C.fg, fnt(700, 22, 'mono')); g.restore(); });
    const u = pop(t, 3); g.save(); g.globalAlpha = u; cross(g, R.x + 900, R.y + 290, 1, C.bad, 40); txt(g, '各组的“点”不是同一个单位，不能比较', R.x + 960, R.y + 290, C.bad, fnt(800, 28)); g.restore(); return; }
  hdr(g, R, '开发者体验：SPACE 与 DevEx');
  const L = [['满意度与幸福感', C.g], ['表现', C.b], ['活动', C.fg3], ['沟通与协作', C.o], ['效率与心流', C.p]];
  L.forEach(([s, col], i) => { const u = pop(st.tk, .3 + i * .4), x = R.x + 20 + (i % 3) * ((R.w - 40) / 3), y = R.y + 110 + Math.floor(i / 3) * 140; g.save(); g.globalAlpha = u; rr(g, x, y, (R.w - 40) / 3 - 20, 110, 16, 'rgba(14,20,36,.92)', col, 2); txt(g, ['S', 'P', 'A', 'C', 'E'][i], x + 30, y + 55, col, fnt(900, 48, 'mono')); txt(g, s, x + 90, y + 55, C.fg, fnt(700, 25)); g.restore(); });
  g.save(); g.globalAlpha = pop(st.tk, 2.5); txt(g, 'DevEx（2023）：反馈循环 · 认知负担 · 心流', R.x + 20, R.y + 450, C.fg2, fnt(600, 24)); g.restore();
  banner(g, R, '任何单一指标一旦成为考核目标，就会被优化到失真', pop(st.tk, 5));
};
AN.dora = (g, t, R) => {
  hdr(g, R, 'DORA 五项交付指标');
  const A = [['变更前置时间', '提交到上线'], ['部署频率', '多久部署一次'], ['失败部署恢复时间', '出问题后多快恢复']], B = [['变更失败率', '部署后需要补救的比例'], ['部署返工率', '2024 新增：计划外的修复部署']];
  const w = (R.w - 60) / 2; g.save(); g.globalAlpha = pop(t, .2); txt(g, '吞吐', R.x + 20, R.y + 100, C.g, fnt(800, 30)); txt(g, '不稳定', R.x + 40 + w, R.y + 100, C.o, fnt(800, 30)); g.restore();
  A.forEach(([a, b], i) => card(g, R.x + 20, R.y + 140 + i * 160, w, 140, a, [b], C.g, pop(t, .5 + i * .5), false, 22));
  B.forEach(([a, b], i) => card(g, R.x + 40 + w, R.y + 140 + i * 160, w, 140, a, [b], C.o, pop(t, 2 + i * .5), i === 1, 22));
};
// ---- 对比 ----
AN.cmp1 = (g, t, R, st) => {
  const H = ['', '节奏', '靠什么管', '适合', '常见风险'], rows = [['Scrum', '固定冲刺', '角色 · 事件 · 目标', '需要节奏的产品团队', '流于形式', C.b], ['看板', '持续流动', '进行中上限 · 流动指标', '需求随时进来的团队', '没有节奏，目标模糊', C.g], ['Shape Up', '6 周 + 2 周', '胃口 · 下注', '小而自主的团队', '接不住临时需求', C.o], ['规模化框架', '计划周期', '联合规划', '多团队同一产品', '流程过重', C.p], ['混合', '按需组合', '取各家所长', '大多数团队', '各取一点、都不到位', C.gold]];
  const cw = [220, 220, 340, 420, 400], x0 = R.x + 20, y0 = R.y + 30, rh = 110; let x = x0;
  H.forEach((h, i) => { txt(g, h, x + 20, y0 + 30, C.fg3, fnt(700, 22)); x += cw[i]; }); line(g, [[x0, y0 + 60], [x0 + cw.reduce((a, b) => a + b), y0 + 60]], C.line2, 2);
  rows.forEach((r, j) => { const show = j < 2 || st.k >= 1; if (!show) return; const u = pop(j < 2 ? t : st.tk, .3 + (j < 2 ? j : j - 2) * .6); g.save(); g.globalAlpha = u; const y = y0 + 80 + j * rh; rr(g, x0, y, cw.reduce((a, b) => a + b), rh - 14, 12, 'rgba(14,20,36,.8)', r[5], 1.5); let xx = x0; r.slice(0, 5).forEach((s, i) => { wrapTxt(g, s, xx + 20, y + 34, cw[i] - 36, 30, i === 0 ? r[5] : (i === 4 ? C.bad : C.fg), fnt(i === 0 ? 800 : 600, i === 0 ? 26 : 22)); xx += cw[i]; }); g.restore(); });
};
