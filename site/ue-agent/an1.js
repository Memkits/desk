// 动画（上）：片头、一周预览版、MCP 接入
const cxR = R => R.x + R.w / 2;
function editorWin(g, x, y, w, h, ttl = '虚幻编辑器', col = C.b, a = 1) {
  al(g, a, () => {
    rr(g, x, y, w, h, 14, 'rgba(11,16,32,.97)', col, 2.5);
    rr(g, x, y, w, 40, 14, 'rgba(255,255,255,.05)'); [C.bad, C.gold, C.ok].forEach((c, i) => dot(g, x + 22 + i * 20, y + 20, 6, c));
    txt(g, ttl, x + 92, y + 20, C.fg2, fnt(600, 18));
    // 视口里的小场景：地面 + 几个方块
    const vx = x + 14, vy = y + 54, vw = w - 28, vh = h - 68;
    rr(g, vx, vy, vw, vh, 8, 'rgba(92,180,255,.05)', C.line2, 1);
    g.save(); g.beginPath(); g.rect(vx, vy, vw, vh); g.clip();
    for (let i = 0; i <= 8; i++) { const u = i / 8; line(g, [[vx + vw * (.5 + (u - .5) * .4), vy + vh * .45], [vx + vw * (.5 + (u - .5) * 1.6), vy + vh]], 'rgba(92,180,255,.18)', 1); }
    for (let j = 0; j < 5; j++) { const yy = vy + vh * (.45 + .55 * (j / 4) ** 1.6); line(g, [[vx, yy], [vx + vw, yy]], 'rgba(92,180,255,.14)', 1); }
    g.restore();
  });
}
function cube(g, x, y, s, col, a = 1) { al(g, a, () => { g.save(); g.fillStyle = col + '55'; g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y - s * .5); g.lineTo(x + s * .6, y - s * .2); g.lineTo(x + s * .6, y + s * .45); g.lineTo(x, y + s * .75); g.lineTo(x - s * .6, y + s * .45); g.lineTo(x - s * .6, y - s * .2); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x - s * .6, y - s * .2); g.lineTo(x, y + s * .1); g.lineTo(x + s * .6, y - s * .2); g.moveTo(x, y + s * .1); g.lineTo(x, y + s * .75); g.stroke(); g.restore(); }); }
function bulb(g, x, y, on, s = 1) { if (on) glow(g, x, y, 60 * s, 'rgba(255,210,122,.55)'); dot(g, x, y, 13 * s, on ? C.gold : C.fg3); rr(g, x - 7 * s, y + 11 * s, 14 * s, 10 * s, 3, C.fg3); }

AN.open = (g, t, R, st) => {
  const cx = cxR(R);
  stars(g, R, t, 120, .45);
  if (st.k === 0 && t < 5.2) return;
  const t0 = st.k === 0 ? 5.2 : -10, u = pop(t, t0, .8);
  al(g, u, () => {
    // 发布卡
    const x = R.x + 60, y = R.y + 70, w = 620, h = 300;
    rr(g, x, y, w, h, 22, 'rgba(14,20,36,.95)', C.gold, 3);
    txt(g, 'UNREAL ENGINE', x + 40, y + 60, C.fg3, fnt(800, 24, 'mono'));
    txt(g, '5.9 预览版', x + 40, y + 130, C.fg, fnt(900, 64, 'serif'));
    txt(g, '2026-11-09 发布', x + 40, y + 200, C.gold, fnt(700, 30, 'mono'));
    txt(g, '“首个主要由智能体工作流构建的版本”', x + 40, y + 252, C.fg2, fnt(600, 25));
  });
  // 一周日历，每天一格，小机器人在干活
  const days = ['11-03', '11-04', '11-05', '11-06', '11-07', '11-08', '11-09'];
  const gx = R.x + 60, gy = R.y + 470, cw = Math.min(200, (R.w - 120 - 6 * 18) / 7);
  days.forEach((d, i) => {
    const a = pop(t, t0 + .8 + i * .55, .5);
    al(g, a, () => {
      const x = gx + i * (cw + 18);
      rr(g, x, gy, cw, 210, 14, 'rgba(14,20,36,.94)', i === 6 ? C.gold : C.line2, 2);
      txt(g, d, x + cw / 2, gy + 30, C.fg3, fnt(700, 20, 'mono'), 'center');
      for (let j = 0; j < 3; j++) bot(g, x + cw / 2 + (j - 1) * cw * .28, gy + 120 + Math.sin(t * 4 + i + j * 2) * 5, [C.p, C.b, C.g][j], .75);
      if (i === 6) txt(g, '发布', x + cw / 2, gy + 186, C.gold, fnt(800, 22), 'center');
    });
  });
  al(g, pop(t, t0 + 5), () => txt(g, '从决定动手到发布：约一周', gx, gy + 260, C.fg, fnt(800, 32)));
  if (R.w > 1500) al(g, u, () => {
    const x = R.x + 760, y = R.y + 70;
    txt(g, '指挥者', x + 40, y + 40, C.fg3, fnt(700, 22));
    for (let i = 0; i < 3; i++) person(g, x + 60 + i * 70, y + 120, C.fg, 1.1);
    for (let i = 0; i < 9; i++) { const a = pop(t, t0 + 1 + i * .15); al(g, a, () => { arrow(g, x + 260, y + 110, x + 400, y + 40 + (i % 3) * 70, 'rgba(255,210,122,.35)', 2, 8); bot(g, x + 440 + Math.floor(i / 3) * 90, y + 50 + (i % 3) * 70, [C.p, C.b, C.g][i % 3], .9); }); }
    txt(g, '成队的智能体', x + 520, y + 280, C.fg3, fnt(700, 22), 'center');
  });
};

AN.open2 = (g, t, R, st) => {
  const cx = cxR(R), y = R.y + 40;
  // 左：给人用；右：给 AI 用
  const w = 640, x1 = cx - w - 60, x2 = cx + 60;
  al(g, pop(t, .2), () => {
    editorWin(g, x1, y + 50, w, 330, '给人用：鼠标、菜单、拖拽', C.b);
    person(g, x1 + w / 2, y + 470, C.fg, 1.4);
    const mx = x1 + 200 + Math.sin(t * 1.3) * 140, my = y + 250 + Math.cos(t * 1.1) * 50; g.save(); g.fillStyle = '#fff'; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx + 16, my + 34); g.lineTo(mx + 22, my + 20); g.lineTo(mx + 36, my + 18); g.closePath(); g.fill(); g.restore();
  });
  al(g, pop(t, 2), () => {
    editorWin(g, x2, y + 50, w, 330, '给 AI 用：一组可调用的工具', C.p);
    const tools = ['放置物体', '修改材质', '运行游戏', '性能分析', '截图'];
    tools.forEach((s, i) => chip(g, s, x2 + 40 + (i % 3) * 190, y + 200 + Math.floor(i / 3) * 70, C.p, pop(t, 2.5 + i * .25), 22));
    bot(g, x2 + w / 2, y + 480, C.p, 1.6);
    packet(g, [[x2 + w / 2, y + 430], [x2 + w / 2, y + 380]], (t * .8) % 1, C.gold, 7);
  });
  // 本期六章
  const ch = ['一周预览版', '接入方式', '实测表现', '三个瓶颈', '引擎 6 的豪赌', '行业的未来'];
  let xx = R.x + (R.w - 6 * 230) / 2;
  ch.forEach((s, i) => { const a = pop(t, 7 + i * .3); al(g, a, () => { rr(g, xx + i * 230, y + 620, 210, 90, 14, 'rgba(14,20,36,.95)', C.line2, 2); txt(g, String(i + 1).padStart(2, '0'), xx + i * 230 + 24, y + 665, C.gold, fnt(800, 24, 'mono')); txt(g, s, xx + i * 230 + 70, y + 665, C.fg, fnt(700, 22)); }); });
};

AN.week = (g, t, R, st) => {
  const x0 = R.x + 30, y0 = R.y + 60;
  // 少数工程师 → 成队智能体
  al(g, 1, () => { for (let i = 0; i < 3; i++) person(g, x0 + 50, y0 + 120 + i * 130, C.fg, 1.2); txt(g, '少数工程师', x0 + 50, y0 + 480, C.fg2, fnt(700, 22), 'center'); });
  for (let i = 0; i < 12; i++) { const a = pop(t, .6 + i * .12, .4); al(g, a, () => bot(g, x0 + 230 + (i % 3) * 80, y0 + 100 + Math.floor(i / 3) * 105 + Math.sin(t * 3 + i) * 4, [C.p, C.b, C.g][i % 3], .95)); }
  al(g, pop(t, .5), () => { arrow(g, x0 + 110, y0 + 250, x0 + 180, y0 + 250, C.gold, 3, 12); txt(g, '指挥 · 审查', x0 + 145, y0 + 215, C.gold, fnt(600, 18), 'center'); });
  const bx = x0 + 520, bw = R.w - 560;
  const A = st.k === 0 ? pop(t, 3) : 1, B = st.k === 0 ? pop(t, 6.5) : 1;
  const hot = st.k === 1;
  al(g, A * (hot ? .45 : 1), () => {
    arrow(g, x0 + 470, y0 + 200, bx - 10, y0 + 130, C.fg3, 3, 12);
    rr(g, bx, y0 + 40, bw, 200, 18, 'rgba(14,20,36,.95)', C.p, 2.5);
    txt(g, '① 移植 AI 工具', bx + 30, y0 + 86, C.p, fnt(800, 30));
    const w = Math.min(230, (bw - 160) / 2);
    chip(g, '虚幻引擎 6 开发分支', bx + 30, y0 + 170, C.fg3, 1, 22); arrow(g, bx + 300, y0 + 170, bx + 360, y0 + 170, C.gold, 3, 12); chip(g, '5.9', bx + 380, y0 + 170, C.gold, 1, 26);
  });
  al(g, B, () => {
    arrow(g, x0 + 470, y0 + 300, bx - 10, y0 + 390, C.fg3, 3, 12);
    rr(g, bx, y0 + 290, bw, hot ? 420 : 200, 18, hot ? 'rgba(255,210,122,.07)' : 'rgba(14,20,36,.95)', hot ? C.gold : C.b, hot ? 3 : 2.5);
    txt(g, '② 浏览器里运行游戏', bx + 30, y0 + 336, hot ? C.gold : C.b, fnt(800, 30));
    txt(g, '新增目标平台：Web', bx + 30, y0 + 390, C.fg2, fnt(600, 24));
  });
  if (hot) {
    const u = pop(st.tk, .5, 1), v = pop(st.tk, 2.5, 1.5);
    al(g, u, () => { fileIco(g, bx + 40, y0 + 440, 120, 150, 'HTML5', C.fg3); txt(g, '旧网页平台（已淘汰）', bx + 100, y0 + 620, C.fg3, fnt(600, 20), 'center'); });
    al(g, v, () => { arrow(g, bx + 190, y0 + 515, bx + 300, y0 + 515, C.gold, 4, 14); bot(g, bx + 245, y0 + 470, C.p, .8);
      fileIco(g, bx + 330, y0 + 440, 120, 150, 'Web', C.gold); txt(g, 'Wasm + WebGPU', bx + 390, y0 + 620, C.gold, fnt(700, 20), 'center'); });
    al(g, pop(st.tk, 5), () => {
      const rx = bx + 490;
      txt(g, '分工', rx, y0 + 450, C.fg3, fnt(700, 22));
      chip(g, '人：定方向 · 审代码 · 测试', rx, y0 + 500, C.fg, 1, 20);
      chip(g, '智能体：大部分编写', rx, y0 + 570, C.p, 1, 20);
    });
  }
};

AN.caveat = (g, t, R, st) => {
  const L = [['测试周期更短', '比平常的质量测试少', C.o], ['代码还在清理', '部分智能体代码要返工', C.r], ['渲染器是原型', '网页渲染器部分要重构', C.bad]];
  const n = 3, gap = 30, w = (R.w - 40 - gap * 2) / 3;
  L.forEach(([a, b, col], i) => al(g, pop(t, .4 + i * 1.2), () => {
    const x = R.x + 20 + i * (w + gap), y = R.y + 60;
    rr(g, x, y, w, 230, 18, 'rgba(14,20,36,.95)', col, 2.5);
    g.save(); g.fillStyle = col; g.beginPath(); g.moveTo(x + 50, y + 40); g.lineTo(x + 78, y + 90); g.lineTo(x + 22, y + 90); g.closePath(); g.fill(); g.restore(); txt(g, '!', x + 50, y + 74, '#0B1020', fnt(900, 30), 'center');
    txt(g, a, x + 100, y + 68, C.fg, fnt(800, 32)); wrapTxt(g, b, x + 30, y + 150, w - 60, 34, C.fg2, fnt(600, 24));
  }));
  // 论坛反应：两种声音
  const by = R.y + 360;
  al(g, pop(t, 5.5), () => txt(g, '论坛上的两种声音', R.x + 20, by, C.fg3, fnt(700, 24)));
  const V = [['终于能在编辑器里直接用编程智能体了', C.g, 0], ['文档也是 AI 写的，还有错', C.r, 1], ['老问题没修，实验功能越堆越多', C.r, 1], ['先在项目副本上试试', C.b, 0]];
  V.forEach(([s, col, side], i) => al(g, pop(t, 6.2 + i * .8), () => {
    const w2 = Math.min(720, R.w / 2 - 40), x = side ? R.x + R.w - w2 - 20 : R.x + 20, y = by + 50 + i * 100;
    rr(g, x, y, w2, 76, 38, col + '18', col, 2); person(g, side ? x + w2 - 46 : x + 46, y + 42, col, .8);
    txt(g, s, side ? x + w2 - 90 : x + 90, y + 38, C.fg, fnt(600, 24), side ? 'right' : 'left');
  }));
};

AN.jam = (g, t, R, st) => {
  const x0 = R.x + 20, y0 = R.y + 50;
  txt(g, 'Epic AI MegaJam 2026', x0, y0 + 10, C.gold, fnt(800, 34));
  ['11-12', '11-13', '11-14', '11-15'].forEach((d, i) => al(g, pop(t, .4 + i * .3), () => {
    const x = x0 + i * 170, y = y0 + 60; rr(g, x, y, 150, 150, 16, 'rgba(255,210,122,.08)', C.gold, 2.5);
    rr(g, x, y, 150, 40, 16, C.gold); txt(g, '十一月', x + 75, y + 20, '#0B1020', fnt(800, 18), 'center'); txt(g, d.slice(3), x + 75, y + 98, C.fg, fnt(900, 54, 'mono'), 'center');
  }));
  // 队伍：≤5 人 + 不限智能体
  al(g, pop(t, 2.5), () => {
    const y = y0 + 330; txt(g, '每队', x0, y - 50, C.fg3, fnt(700, 24));
    for (let i = 0; i < 5; i++) person(g, x0 + 30 + i * 62, y + 20, C.fg, 1.1); txt(g, '≤ 5 人', x0 + 160, y + 90, C.fg, fnt(800, 28), 'center');
    txt(g, '+', x0 + 350, y + 20, C.fg2, fnt(800, 48), 'center');
    for (let i = 0; i < 14; i++) { const a = pop(t, 3 + i * .12, .3); al(g, a, () => bot(g, x0 + 410 + (i % 7) * 58, y + (i < 7 ? -10 : 60), [C.p, C.b, C.g][i % 3], .7)); }
    al(g, pop(t, 4.6), () => txt(g, '智能体 ∞ 不限数量', x0 + 580, y + 125, C.p, fnt(800, 28), 'center'));
  });
  // 申报
  const rx = Math.min(x0 + 900, R.x + R.w - 420), rw = R.x + R.w - rx - 20;
  if (rw > 260) al(g, pop(t, 6.5), () => {
    rr(g, rx, y0 + 60, rw, 470, 18, 'rgba(14,20,36,.95)', C.b, 2.5); txt(g, '必须申报', rx + 30, y0 + 110, C.b, fnt(800, 30));
    ['赛前准备的提示词', '赛前写好的脚本', '赛前做好的素材', '非自己制作的素材及授权'].forEach((s, i) => check(g, rx + 30, y0 + 180 + i * 80, s, pop(t, 7 + i * .5, .5), C.b, 24));
  });
};

AN.mcp = (g, t, R, st) => {
  const y0 = R.y + 40, ex = R.x + R.w - 700, ew = 680;
  // 编辑器 + MCP 服务器
  editorWin(g, ex, y0 + 20, ew, 560, '虚幻编辑器', C.b);
  al(g, pop(t, .5), () => { rr(g, ex + 40, y0 + 100, ew - 80, 70, 14, 'rgba(255,210,122,.1)', C.gold, 2.5); txt(g, 'MCP 服务器 · 本机', ex + ew / 2, y0 + 135, C.gold, fnt(800, 28), 'center'); });
  const tools = ['放置物体', '修改材质', '运行游戏', '性能分析', '截图', '版本控制', '调试', '关卡制作'];
  tools.forEach((s, i) => chip(g, s, ex + 50 + (i % 3) * 200, y0 + 230 + Math.floor(i / 3) * 80, C.b, pop(t, 1.5 + i * .4, .5), 22));
  al(g, pop(t, 5), () => txt(g, '每个操作 = 一个“工具”', ex + ew / 2, y0 + 520, C.fg2, fnt(700, 24), 'center'));
  // 外部智能体
  const u = st.k >= 1 ? 1 : 0, ax = R.x + 20, aw = Math.max(320, ex - ax - 200);
  if (st.k >= 1) {
    const a = pop(st.tk, .3);
    al(g, a, () => {
      rr(g, ax, y0 + 40, aw, 220, 18, 'rgba(14,20,36,.95)', C.p, 2.5); txt(g, '编程智能体', ax + 30, y0 + 86, C.p, fnt(800, 30));
      bot(g, ax + aw - 70, y0 + 100, C.p, 1.3);
      let cx_ = ax + 24; ['Claude Code', 'Codex', 'Cursor'].forEach((s, i) => { cx_ += chip(g, s, cx_, y0 + 190, C.fg3, 1, 17) + 8; });
      const p = (st.tk * .45) % 1; packet(g, [[ax + aw + 10, y0 + 130], [ex - 10, y0 + 135]], p, C.gold, 9);
      packet(g, [[ex - 10, y0 + 175], [ax + aw + 10, y0 + 210]], (p + .5) % 1, C.g, 7);
      arrow(g, ax + aw + 10, y0 + 130, ex - 10, y0 + 135, C.fg3, 2, 10); arrow(g, ex - 10, y0 + 175, ax + aw + 10, y0 + 210, C.fg3, 2, 10);
    });
    // 循环：查看 → 修改 → 检查
    al(g, pop(st.tk, 2.5), () => {
      const cx = ax + aw / 2 + 30, cy = y0 + 500, r = 115;
      g.save(); g.strokeStyle = C.line2; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke(); g.restore();
      const S = [['查看场景', -Math.PI / 2, C.b], ['动手修改', Math.PI / 6, C.gold], ['截图检查', Math.PI * 5 / 6, C.g]];
      const ph = (st.tk * .5) % 3, cur = Math.floor(ph);
      S.forEach(([s, an, col], i) => { const x = cx + Math.cos(an) * r, y = cy + Math.sin(an) * r; dot(g, x, y, i === cur ? 16 : 10, i === cur ? col : C.fg3); txt(g, s, x + (Math.cos(an) > .1 ? 26 : Math.cos(an) < -.1 ? -26 : 0), y + (Math.sin(an) < -.5 ? -34 : 0), i === cur ? C.fg : C.fg2, fnt(700, 24), Math.cos(an) > .1 ? 'left' : Math.cos(an) < -.1 ? 'right' : 'center'); });
      const a0 = -Math.PI / 2 + ph / 3 * TAU; dot(g, cx + Math.cos(a0) * r, cy + Math.sin(a0) * r, 8, '#fff');
    });
  }
};

AN.road = (g, t, R, st) => {
  const x0 = R.x + 60, x1 = R.x + R.w - 60, y = R.y + 110;
  line(g, [[x0, y], [x1, y]], C.line2, 4);
  const M = [['5.7', '2025-11', 'AI 助手', ['编辑器内问答', '查文档、解释报错'], C.b], ['5.8', '2026-06-17', 'MCP 插件（实验）', ['外部智能体可驱动编辑器', '蓝图、资源、关卡、材质'], C.p], ['5.9 预览', '2026-11-09', '工具全面扩展', ['渲染 · 版本控制 · 性能分析', '调试 · 游戏测试 · 关卡', '资源商店搜索与安装', '编辑器内智能体面板'], C.gold]];
  const w = (x1 - x0 - 60) / 3;
  M.forEach(([v, d, h, ls, col], i) => {
    const a = pop(t, .5 + i * 3.2, .8), x = x0 + i * (w + 30);
    al(g, a, () => {
      dot(g, x + 30, y, 14, col); glow(g, x + 30, y, 40, col + '44');
      txt(g, v, x + 60, y - 4, col, fnt(900, 44, 'mono')); txt(g, d, x + 30, y + 46, C.fg3, fnt(600, 22, 'mono'));
      rr(g, x, y + 90, w, 480, 18, i === 2 ? 'rgba(255,210,122,.07)' : 'rgba(14,20,36,.95)', col, i === 2 ? 3 : 2);
      txt(g, h, x + 30, y + 140, C.fg, fnt(800, 30));
      ls.forEach((s, j) => al(g, pop(t, 1.2 + i * 3.2 + j * .5), () => { dot(g, x + 38, y + 210 + j * 62, 6, col); wrapTxt(g, s, x + 58, y + 210 + j * 62, w - 80, 30, C.fg2, fnt(600, 24)); }));
    });
  });
  al(g, pop(t, 11), () => txt(g, '从“回答问题”到“动手干活”', cxR(R), R.y + R.h - 40, C.fg, fnt(800, 30), 'center'));
};
