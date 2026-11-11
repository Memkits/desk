// 动画（下）：实测、瓶颈、虚幻引擎 6、行业未来
function stopwatch(g, x, y, r, frac, col = C.gold) { rr(g, x - r, y - r, 2 * r, 2 * r, r, 'rgba(14,20,36,.95)', C.line2, 3); g.save(); g.strokeStyle = col; g.lineWidth = 10; g.beginPath(); g.arc(x, y, r - 14, -Math.PI / 2, -Math.PI / 2 + TAU * CL(frac)); g.stroke(); g.restore(); rr(g, x - 12, y - r - 22, 24, 16, 4, C.fg3); }

// 四个任务的小图
const TASKS = [
  ['灰盒走廊', '六个房间，各有灯和窗', (g, x, y, w, h, t) => { const rw = (w - 70) / 3; for (let i = 0; i < 6; i++) { const xx = x + 20 + (i % 3) * (rw + 15), yy = y + 10 + Math.floor(i / 3) * (h / 2 + 4); rr(g, xx, yy, rw, h / 2 - 20, 6, 'rgba(92,180,255,.08)', C.b, 2); bulb(g, xx + rw / 2, yy + 26, true, .55); rr(g, xx + rw - 26, yy + 10, 16, 26, 3, 'rgba(92,180,255,.3)'); } }],
  ['蓝图开灯', '进门开灯，离开关灯', (g, x, y, w, h, t) => { const on = (t % 4) < 2; rr(g, x + 20, y + 10, w * .55, h - 30, 8, on ? 'rgba(255,210,122,.08)' : 'rgba(255,255,255,.02)', C.line2, 2); bulb(g, x + 20 + w * .275, y + 50, on, .9); person(g, x + 20 + (on ? w * .3 : w * .62), y + h - 60, C.fg, .9); rr(g, x + w * .64, y + 20, w * .3, 50, 8, 'rgba(92,180,255,.12)', C.b, 2); txt(g, '进入 → 开灯', x + w * .79, y + 45, C.fg2, fnt(600, 16), 'center'); rr(g, x + w * .64, y + 90, w * .3, 50, 8, 'rgba(92,180,255,.12)', C.b, 2); txt(g, '离开 → 关灯', x + w * .79, y + 115, C.fg2, fnt(600, 16), 'center'); }],
  ['角色移动', '飞行镜头改成地面行走', (g, x, y, w, h, t) => { line(g, [[x + 20, y + h - 30], [x + w - 20, y + h - 30]], C.fg3, 3); person(g, x + w / 2, y + h - 78, C.fg2, 1.1); ['W', 'A', 'S', 'D'].forEach((k, i) => { const kx = x + 40 + i * 52, ky = y + 30; rr(g, kx, ky, 44, 44, 8, 'rgba(255,107,107,.1)', C.bad, 2); txt(g, k, kx + 22, ky + 22, C.bad, fnt(800, 20, 'mono'), 'center'); }); txt(g, '按键无反应', x + w - 30, y + 52, C.bad, fnt(700, 18), 'right'); }],
  ['程序化城市', '用 PCG 生成街道和楼房', (g, x, y, w, h, t) => { for (let i = 0; i < 9; i++) { const bx = x + 30 + i * (w - 60) / 9, bh = 30 + HSH(i, 7) * (h - 70); rr(g, bx, y + h - 20 - bh, (w - 60) / 9 - 8, bh, 3, 'rgba(163,174,195,.15)', C.fg3, 1.5); } txt(g, '手工摆放 ≠ PCG', x + w / 2, y + 26, C.bad, fnt(800, 20), 'center'); }],
];
AN.test = (g, t, R, st) => {
  const gap = 28, w = (R.w - 40 - gap) / 2, h = 330;
  TASKS.forEach(([a, b, draw], i) => {
    const x = R.x + 20 + (i % 2) * (w + gap), y = R.y + 30 + Math.floor(i / 2) * (h + 30);
    const appear = st.k === 0 ? pop(t, 1 + i * .8) : 1;
    const res = i < 2 ? (st.k >= 1 ? (st.k === 1 ? pop(st.tk, 1 + i * 4) : 1) : 0) : (st.k >= 2 ? (st.k === 2 ? pop(st.tk, 1 + (i - 2) * 6) : 1) : 0);
    const ok = i < 2, col = res > 0 ? (ok ? C.ok : C.bad) : C.line2;
    al(g, appear, () => {
      rr(g, x, y, w, h, 18, 'rgba(14,20,36,.95)', col, res > 0 ? 3 : 2);
      txt(g, `任务 ${i + 1}`, x + 26, y + 36, C.fg3, fnt(700, 20, 'mono')); txt(g, a, x + 120, y + 36, C.fg, fnt(800, 28)); txt(g, b, x + 26, y + 80, C.fg2, fnt(600, 21));
      g.save(); g.globalAlpha *= res > 0 ? 1 : .35; draw(g, x + 20, y + 110, w - 40, h - 130, t); g.restore();
      if (res > 0) { const cx = x + w - 50, cy = y + 40; dot(g, cx, cy, 24 * res, col); if (ok) ticks(g, cx - 18, cy + 1, res, '#0B1020'); else cross(g, cx, cy, res, '#0B1020', 10); }
    });
  });
  if (st.k === 2) al(g, pop(st.tk, 4), () => { const y = R.y + 30 + h + 30 + h - 20; rr(g, R.x + 20, y - 30, 560, 40, 10, 'rgba(255,107,107,.12)'); txt(g, '“已修好” ×2 —— 其实没有', R.x + 40, y - 10, C.bad, fnt(700, 22)); });
};

AN.cost = (g, t, R, st) => {
  const x0 = R.x + 40, y0 = R.y + 40, half = R.w / 2;
  // 等待
  al(g, pop(t, .3), () => {
    txt(g, '每次请求的等待', x0, y0 + 10, C.fg3, fnt(700, 24));
    stopwatch(g, x0 + 130, y0 + 200, 110, (t / 8) % 1);
    txt(g, '5～10', x0 + 300, y0 + 180, C.gold, fnt(900, 72, 'mono')); txt(g, '分钟', x0 + 300 + 240, y0 + 190, C.fg2, fnt(700, 30));
    txt(g, '有时超过 15 分钟', x0 + 300, y0 + 250, C.fg2, fnt(600, 26));
  });
  // 额度
  al(g, pop(t, 4), () => {
    const x = x0 + half - 20, w = R.w - half - 60;
    txt(g, '几小时测试 · 一周额度', x, y0 + 10, C.fg3, fnt(700, 24));
    const p = .15 * pop(t, 4.5, 2.5);
    rr(g, x, y0 + 120, w, 70, 16, 'rgba(255,255,255,.04)', C.line2, 2); rr(g, x, y0 + 120, Math.max(16, w * p), 70, 16, C.o);
    txt(g, Math.round(p * 100) + '%', x + w * p + 20, y0 + 155, C.fg, fnt(900, 40, 'mono'));
    txt(g, '会话额度不到中午就用完', x, y0 + 250, C.fg2, fnt(600, 24));
  });
  // 结论
  al(g, pop(t, 10), () => quote(g, R.x + 60, R.y + 420, R.w - 120, '用它加速你已经懂的工作，而不是填补你不懂的空白。', '实测作者的结论', C.gold, 1, 36));
};

AN.blind = (g, t, R, st) => {
  const y0 = R.y + 40, w = (R.w - 80) / 2, x1 = R.x + 20, x2 = x1 + w + 40;
  // 左：C++ 文本
  al(g, pop(t, .3), () => {
    rr(g, x1, y0, w, 470, 18, '#0B1020', C.ok, 2.5); txt(g, 'LightSwitch.cpp · 文本', x1 + 24, y0 + 34, C.ok, fnt(700, 22, 'mono'));
    const L = ['void ALightSwitch::OnEnter()', '{', '  Light->SetVisibility(true);', '  bIsOn = true;', '}'];
    L.forEach((s, i) => txt(g, s, x1 + 30, y0 + 100 + i * 44, i === 2 && st.tk > 13 ? C.gold : '#D6DEEE', fnt(500, 24, 'mono')));
    txt(g, '智能体：读得懂 ✓', x1 + 24, y0 + 430, C.ok, fnt(800, 26));
  });
  // 右：蓝图二进制
  al(g, pop(t, 3), () => {
    rr(g, x2, y0, w, 470, 18, '#0B1020', C.bad, 2.5); txt(g, 'BP_Door.uasset · 二进制', x2 + 24, y0 + 34, C.bad, fnt(700, 22, 'mono'));
    g.save(); g.beginPath(); g.rect(x2 + 10, y0 + 60, w - 20, 340); g.clip();
    const N = [[.12, .25, '进入触发'], [.45, .2, '获取灯'], [.45, .6, '分支'], [.78, .4, '设为可见']];
    const nx = (u) => x2 + 20 + u * (w - 200), ny = v => y0 + 70 + v * 300;
    [[0, 1], [1, 3], [0, 2], [2, 3]].forEach(([a, b]) => { const broke = st.tk > 15 && a === 1 && b === 3 && st.k === 0; line(g, [[nx(N[a][0]) + 160, ny(N[a][1]) + 25], [nx(N[b][0]), ny(N[b][1]) + 25]], broke ? C.bad : 'rgba(92,180,255,.6)', 3, broke ? [8, 8] : null); });
    N.forEach(([u, v, s]) => { rr(g, nx(u), ny(v), 160, 50, 8, 'rgba(92,180,255,.12)', C.b, 2); txt(g, s, nx(u) + 80, ny(v) + 25, C.fg, fnt(700, 20), 'center'); });
    // 雾：十六进制
    const fog = CL((t - 5) / 2) * (st.k === 0 ? 1 : 1);
    g.globalAlpha = fog * .92; g.fillStyle = '#0B1020'; g.fillRect(x2 + 10, y0 + 60, w - 20, 340); g.globalAlpha = fog;
    for (let r = 0; r < 9; r++) { let s = ''; for (let c = 0; c < 16; c++) s += Math.floor(HSH(r * 31 + c, Math.floor(t * 2)) * 256).toString(16).padStart(2, '0').toUpperCase() + ' '; txt(g, s, x2 + 24, y0 + 84 + r * 36, 'rgba(255,107,107,.45)', fnt(500, 18, 'mono')); }
    g.restore();
    txt(g, '智能体：看不见（除非插件翻译节点图）', x2 + 24, y0 + 430, C.bad, fnt(800, 24));
  });
  al(g, pop(t, 15), () => { rr(g, R.x + 20, R.y + 560, R.w - 40, 90, 16, 'rgba(255,107,107,.08)', C.bad, 2); txt(g, '改了一行 C++ → 一张没读过的蓝图悄悄坏掉', cxR(R), R.y + 605, C.fg, fnt(800, 30), 'center'); });
};
const cxR2 = R => R.x + R.w / 2;
function cxR_(R) { return R.x + R.w / 2; }

AN.memory = (g, t, R, st) => {
  const y0 = R.y + 40;
  // 三次会话，每次从零摸索
  const S = 3, sw = (R.w - 40 - 2 * 24) / 3;
  for (let s = 0; s < S; s++) {
    const t0 = .5 + s * 4.5, x = R.x + 20 + s * (sw + 24);
    al(g, pop(t, t0), () => {
      rr(g, x, y0, sw, 400, 18, 'rgba(14,20,36,.95)', C.line2, 2); txt(g, `会话 ${s + 1}`, x + 24, y0 + 34, C.fg2, fnt(800, 24));
      const u = CL((t - t0 - .5) / 3.5);
      const nodes = 12; for (let i = 0; i < nodes; i++) { const nx = x + 40 + HSH(i, 3) * (sw - 80), ny = y0 + 90 + HSH(i, 4) * 260, seen = i / nodes < u; if (i > 0) line(g, [[nx, ny], [x + 40 + HSH(i - 1, 3) * (sw - 80), y0 + 90 + HSH(i - 1, 4) * 260]], seen ? 'rgba(92,180,255,.45)' : 'rgba(44,56,84,.5)', 2); dot(g, nx, ny, 9, seen ? [C.b, C.g, C.o][i % 3] : C.line2); }
      txt(g, `查询 ${Math.round(u * 40)} 次`, x + sw - 24, y0 + 34, C.gold, fnt(700, 22, 'mono'), 'right');
      if (s > 0) txt(g, '又从零开始', x + sw / 2, y0 + 380, C.bad, fnt(700, 20), 'center');
    });
  }
  // 上下文窗口
  al(g, pop(t, 12), () => {
    const x = R.x + 20, y = y0 + 470, w = R.w - 40;
    txt(g, '模型的上下文', x, y, C.fg3, fnt(700, 24));
    rr(g, x, y + 30, w, 64, 12, 'rgba(255,255,255,.04)', C.line2, 2);
    const a = .42 * pop(t, 12.5, 1.5), b = .3 * pop(t, 14, 1.5);
    rr(g, x, y + 30, w * a, 64, 12, 'rgba(255,178,92,.5)'); if (a > .2) txt(g, '工具清单', x + w * a / 2, y + 62, C.fg, fnt(800, 24), 'center');
    rr(g, x + w * a, y + 30, w * b, 64, 0, 'rgba(92,180,255,.4)'); if (b > .15) txt(g, '项目信息', x + w * a + w * b / 2, y + 62, C.fg, fnt(800, 24), 'center');
    if (b > .25) txt(g, '留给思考的空间', x + w * (a + b) + (w * (1 - a - b)) / 2, y + 62, C.fg2, fnt(700, 22), 'center');
    txt(g, '比例为示意', x + w, y + 130, C.fg3, fnt(500, 18), 'right');
  });
};

AN.atomic = (g, t, R, st) => {
  const y0 = R.y + 60, x0 = R.x + 20;
  txt(g, '把灯换成可开关的灯：五步', x0, y0, C.fg3, fnt(700, 24));
  const steps = ['删除旧灯', '放置新灯', '建蓝图', '连线事件', '编译保存'];
  const sw = Math.min(250, (R.w - 40 - 4 * 20) / 5);
  steps.forEach((s, i) => al(g, pop(t, .6 + i * .6), () => {
    const x = x0 + i * (sw + 20), y = y0 + 50;
    rr(g, x, y, sw, 100, 14, 'rgba(14,20,36,.95)', i === 3 ? C.bad : C.b, 2); txt(g, s, x + sw / 2, y + 50, C.fg, fnt(700, 24), 'center');
    rr(g, x + 20, y + 130, sw - 40, 44, 10, 'rgba(255,255,255,.04)', C.line2, 1.5); txt(g, `撤销 #${i + 1}`, x + sw / 2, y + 152, C.fg3, fnt(600, 18, 'mono'), 'center');
    if (i === 3) cross(g, x + sw - 24, y + 24, pop(t, 4), C.bad, 9);
  }));
  // 事务框（缺失）
  al(g, pop(t, 5), () => {
    const w = 5 * (sw + 20) - 20; g.save(); g.setLineDash([10, 10]); rr(g, x0 - 10, y0 + 36, w + 20, 204, 18, null, C.gold, 2.5); g.restore();
    txt(g, '没有“一次事务、一键撤销”', x0 + w / 2, y0 + 280, C.gold, fnt(800, 26), 'center');
  });
  // 说做完 vs 实际
  al(g, pop(t, 9), () => {
    const y = y0 + 360, w = (R.w - 80) / 2;
    rr(g, x0, y, w, 180, 18, 'rgba(95,211,154,.08)', C.ok, 2.5); bot(g, x0 + 70, y + 95, C.p, 1.3); txt(g, '“完成了 ✓”', x0 + 140, y + 90, C.ok, fnt(800, 36));
    al(g, pop(t, 10.5), () => { rr(g, x0 + w + 40, y, w, 180, 18, 'rgba(255,107,107,.08)', C.bad, 2.5); txt(g, '读回验证：第 4 步没连上', x0 + w + 80, y + 70, C.bad, fnt(800, 28)); txt(g, '能读回来检查的工具不多', x0 + w + 80, y + 125, C.fg2, fnt(600, 22)); });
  });
};

AN.secure = (g, t, R, st) => {
  const y0 = R.y + 60, x0 = R.x + 40, cx = R.x + R.w / 2;
  // 工作室
  al(g, pop(t, .3), () => {
    rr(g, x0, y0, 520, 520, 22, 'rgba(14,20,36,.95)', C.b, 2.5); txt(g, '工作室', x0 + 30, y0 + 40, C.b, fnt(800, 28));
    editorWin(g, x0 + 30, y0 + 80, 460, 240, '编辑器', C.b);
    rr(g, x0 + 30, y0 + 360, 460, 120, 14, 'rgba(255,107,107,.08)', C.bad, 2);
    txt(g, '127.0.0.1:8000/mcp', x0 + 60, y0 + 400, C.fg, fnt(700, 24, 'mono'));
    // 打开的锁
    g.save(); g.strokeStyle = C.bad; g.lineWidth = 5; g.beginPath(); g.arc(x0 + 430, y0 + 405, 16, Math.PI, 0); g.stroke(); g.restore(); rr(g, x0 + 405, y0 + 410, 50, 40, 6, C.bad);
    txt(g, '默认没有身份验证', x0 + 60, y0 + 445, C.bad, fnt(700, 22));
  });
  // 云端模型
  const cxx = R.x + R.w - 300, cyy = y0 + 200;
  al(g, pop(t, 4), () => {
    g.save(); g.fillStyle = 'rgba(199,155,255,.12)'; g.strokeStyle = C.p; g.lineWidth = 3; g.beginPath(); g.arc(cxx - 70, cyy + 10, 60, 0, TAU); g.arc(cxx + 10, cyy - 30, 80, 0, TAU); g.arc(cxx + 90, cyy + 15, 60, 0, TAU); g.fill(); g.restore();
    txt(g, '云端模型', cxx + 10, cyy + 10, C.p, fnt(800, 30), 'center');
    for (let i = 0; i < 4; i++) { const p = ((t - 4.5) * .35 + i * .25) % 1; if (t > 4.5) { const x = LERP(x0 + 500, cxx - 120, p), y = LERP(y0 + 200, cyy, p) - Math.sin(p * Math.PI) * 80; rr(g, x - 30, y - 20, 60, 40, 5, 'rgba(92,180,255,.25)', C.b, 2); } }
    txt(g, '关卡截图', LERP(x0 + 520, cxx - 120, .5), y0 + 70, C.fg2, fnt(600, 22), 'center');
  });
  al(g, pop(t, 10), () => { txt(g, '哪些项目数据可以离开公司？', cxx, y0 + 470, C.gold, fnt(800, 32), 'center'); });
};

AN.ue6 = (g, t, R, st) => {
  const y0 = R.y + 30, w = (R.w - 140) / 2, x1 = R.x + 20, x2 = x1 + w + 100;
  const layer = (x, y, s, col, a, gone, sub) => al(g, a, () => { rr(g, x, y, w, 86, 14, gone ? 'rgba(255,107,107,.06)' : col + '1c', gone ? C.bad : col, 2.5); txt(g, s, x + 28, y + 43 - (sub ? 10 : 0), gone ? C.fg3 : C.fg, fnt(800, 28)); if (sub) txt(g, sub, x + 28, y + 64, C.fg3, fnt(500, 18)); if (gone) { line(g, [[x + 20, y + 43], [x + 20 + (w - 40) * gone, y + 43]], C.bad, 4); if (gone > .9) chip(g, '移除', x + w - 110, y + 43, C.bad, 1, 20); } });
  txt(g, '虚幻引擎 5', x1, y0 + 20, C.fg2, fnt(800, 30)); txt(g, '虚幻引擎 6', x2, y0 + 20, C.gold, fnt(800, 30));
  const G = st.k === 0 ? pop(t, 6, 1.2) : 1;
  layer(x1, y0 + 60, '蓝图', C.b, pop(t, .5), G, '可视化脚本');
  layer(x1, y0 + 160, 'Actor', C.b, pop(t, .8), st.k === 0 ? pop(t, 6.8, 1.2) : 1, '场景里的对象');
  layer(x1, y0 + 260, 'C++ 玩法框架', C.b, pop(t, 1.1), st.k === 0 ? pop(t, 7.6, 1.2) : 1);
  const N = st.k === 0 ? pop(t, 10) : 1;
  layer(x2, y0 + 60, 'Verse 语言', C.gold, N, 0, '玩法逻辑 · 文本代码');
  layer(x2, y0 + 160, '场景图', C.gold, st.k === 0 ? pop(t, 11) : 1, 0, '实体 + 组件');
  layer(x2, y0 + 260, 'MCP / Python', C.gold, st.k === 0 ? pop(t, 12) : 1, 0, '智能体可直接构建');
  al(g, pop(t, 9), () => arrow(g, x1 + w + 14, y0 + 200, x2 - 14, y0 + 200, C.gold, 5, 18));
  // 底层不变
  al(g, pop(t, 3), () => { rr(g, x1, y0 + 380, x2 + w - x1, 70, 14, 'rgba(255,255,255,.04)', C.line2, 2); txt(g, 'C++ 继续负责底层：渲染 · 物理', (x1 + x2 + w) / 2, y0 + 415, C.fg2, fnt(700, 26), 'center'); });
  if (st.k >= 1) {
    // 节点 vs 文本：给 AI 看
    const u = pop(st.tk, .5), yb = y0 + 490;
    al(g, u, () => {
      const bw = w * .9;
      rr(g, x1, yb, bw, 210, 16, '#0B1020', C.line2, 2);
      [[.08, .2], [.4, .1], [.4, .55], [.72, .35]].forEach(([a, b], i) => { rr(g, x1 + 20 + a * (bw - 160), yb + 20 + b * 160, 130, 40, 8, 'rgba(92,180,255,.12)', C.b, 2); });
      txt(g, '节点图：AI 难读', x1 + bw - 20, yb + 185, C.bad, fnt(700, 20), 'right');
      rr(g, x2, yb, bw, 210, 16, '#0B1020', C.line2, 2);
      ['OnEnter():void =', '    Light.Show()', '    set IsOn = true'].forEach((s, i) => txt(g, s, x2 + 24, yb + 50 + i * 40, i ? '#D6DEEE' : C.p, fnt(500, 24, 'mono')));
      txt(g, '文本：AI 擅长', x2 + bw - 20, yb + 185, C.ok, fnt(700, 20), 'right');
      const p = pop(st.tk, 3, 2); if (p > 0) { packet(g, [[x1 + bw + 10, yb + 105], [x2 - 10, yb + 105]], p, C.gold, 10); txt(g, 'AI 辅助迁移', (x1 + bw + x2) / 2, yb + 70, C.gold, fnt(700, 20), 'center'); }
    });
  }
};

AN.ue6b = (g, t, R, st) => {
  const x0 = R.x + 40, y0 = R.y + 50, half = R.w * .55;
  txt(g, 'Epic 内部的效率提升（据报道）', x0, y0, C.fg3, fnt(700, 24));
  ['编程', '调试', '关卡设计'].forEach((s, i) => al(g, pop(t, .5 + i * .5), () => {
    const y = y0 + 70 + i * 110, w = half - 200, u = pop(t, 1 + i * .5, 1.5);
    txt(g, s, x0, y + 30, C.fg, fnt(800, 28));
    rr(g, x0 + 150, y, w, 60, 12, 'rgba(255,255,255,.04)', C.line2, 1.5);
    const a = w / 4 * 1.5, b = w / 4 * 4;
    rr(g, x0 + 150, y, a * u, 60, 12, 'rgba(255,210,122,.6)'); rr(g, x0 + 150 + a, y, (b - a) * u, 60, 0, 'rgba(255,210,122,.22)');
    txt(g, '1.5×', x0 + 150 + a, y - 16, C.fg2, fnt(700, 18, 'mono'), 'center'); txt(g, '4×', x0 + 150 + b - 16, y - 16, C.fg2, fnt(700, 18, 'mono'), 'center');
  }));
  al(g, pop(t, 3), () => txt(g, '区间来自翻译报道，非独立测量', x0, y0 + 420, C.fg3, fnt(500, 20)));
  // 训练数据里的语言
  const rx = R.x + half + 40, rw = R.w - half - 80;
  al(g, pop(t, 7), () => {
    txt(g, '模型见过多少（示意）', rx, y0, C.fg3, fnt(700, 24));
    [['C++', 1, C.b], ['Python', .9, C.g], ['Verse', .03, C.gold]].forEach(([s, v, col], i) => { const y = y0 + 70 + i * 110, u = pop(t, 7.5 + i * .5, 1.2); txt(g, s, rx, y + 30, C.fg, fnt(800, 26, 'mono')); rr(g, rx + 130, y, Math.max(8, (rw - 140) * v * u), 60, 10, col); if (i === 2 && u > .9) txt(g, '很少', rx + 160, y + 30, C.gold, fnt(800, 24)); });
  });
  al(g, pop(t, 12), () => quote(g, R.x + 40, R.y + 520, R.w - 80, '押注一门新语言，就得等模型补课。', '', C.gold, 1, 32));
};

AN.engines = (g, t, R, st) => {
  const cx = R.x + R.w / 2, y0 = R.y + 60;
  const E = [['Unreal', ['Unreal MCP', '编辑器内智能体面板', '资源商店工具'], C.b, cx - 560], ['Unity', ['Unity AI（5 月公测）', 'MCP 服务器', '多模型网关'], C.g, cx + 160]];
  E.forEach(([n, ls, col, x], i) => al(g, pop(t, .5 + i * 1.5), () => {
    rr(g, x, y0, 400, 330, 20, 'rgba(14,20,36,.95)', col, 3); txt(g, n, x + 200, y0 + 50, col, fnt(900, 40, 'serif'), 'center');
    ls.forEach((s, j) => chip(g, s, x + 40, y0 + 130 + j * 66, col, 1, 22));
  }));
  al(g, pop(t, 4), () => {
    const by = y0 + 520; bot(g, cx, by, C.p, 2); txt(g, '智能体', cx, by + 80, C.p, fnt(800, 28), 'center');
    E.forEach(([, , col, x]) => { arrow(g, cx + (x < cx ? -40 : 40), by - 50, x + 200, y0 + 340, col, 3, 14); packet(g, [[cx, by - 50], [x + 200, y0 + 340]], (t * .5) % 1, C.gold, 7); });
  });
  al(g, pop(t, 6), () => txt(g, '引擎 = 给智能体调用的工具箱', cx, R.y + R.h - 30, C.fg, fnt(800, 32), 'center'));
};

AN.future = (g, t, R, st) => {
  const y0 = R.y + 30;
  if (st.k === 0) {
    const L = [['原型更快', '一个下午搭出可玩的灰盒关卡', C.gold], ['摆放素材', '按描述铺场景、放道具', C.b], ['批量改设置', '材质、光照、参数一次改完', C.p], ['自动测试', '跑关卡、找卡死和穿模', C.g], ['整理错误报告', '分类、去重、找到复现步骤', C.o]];
    const w = (R.w - 40 - 2 * 24) / 3;
    L.forEach(([a, b, col], i) => al(g, pop(t, .5 + (i === 0 ? 0 : 6 + i * 1.2)), () => {
      const big = i === 0, x = big ? R.x + 20 : R.x + 20 + ((i - 1) % 2 + 1) * (w + 24) - (i > 2 ? 0 : 0), y = big ? y0 + 20 : y0 + 20 + Math.floor((i - 1) / 2) * 310;
      const ww = w, hh = big ? 590 : 290;
      rr(g, x, y, ww, hh, 18, big ? 'rgba(255,210,122,.07)' : 'rgba(14,20,36,.95)', col, big ? 3 : 2.5);
      txt(g, a, x + 30, y + 50, col, fnt(800, 32)); wrapTxt(g, b, x + 30, y + 110, ww - 60, 34, C.fg2, fnt(600, 24));
      if (big) { for (let k = 0; k < 6; k++) cube(g, x + 80 + (k % 3) * 120, y + 300 + Math.floor(k / 3) * 140, 70, [C.b, C.g, C.o][k % 3], pop(t, 1 + k * .3)); al(g, pop(t, 3.5), () => txt(g, '这个点子好玩吗？早点知道', x + 30, y + hh - 40, C.gold, fnt(700, 24))); }
      else bot(g, x + ww - 60, y + hh - 60, col, 1);
    }));
    return;
  }
  // 分工变化
  const x0 = R.x + 20, w = R.w - 40;
  const before = [['写代码', .35, C.b], ['摆场景', .25, C.g], ['测试', .2, C.o], ['设计判断', .2, C.gold]];
  const after = [['描述意图', .3, C.p], ['审查结果', .3, C.b], ['做取舍', .25, C.gold], ['亲手写', .15, C.fg3]];
  const bar = (y, L, lab, a) => al(g, a, () => { txt(g, lab, x0, y - 26, C.fg3, fnt(700, 24)); let xx = x0; L.forEach(([s, v, col]) => { rr(g, xx, y, w * v - 6, 80, 12, col + '33', col, 2); txt(g, s, xx + w * v / 2, y + 40, C.fg, fnt(800, 26), 'center'); xx += w * v; }); });
  bar(y0 + 60, before, '过去：开发者的时间（示意）', pop(st.tk, .3));
  bar(y0 + 230, after, '以后：开发者的时间（示意）', pop(st.tk, 2));
  al(g, pop(st.tk, 6), () => { rr(g, x0, y0 + 380, w * .48, 200, 18, 'rgba(255,210,122,.07)', C.gold, 2.5); txt(g, '更值钱的人', x0 + 30, y0 + 430, C.gold, fnt(800, 30)); wrapTxt(g, '看得懂引擎底层，能识破 AI 在哪里糊弄', x0 + 30, y0 + 490, w * .48 - 60, 34, C.fg2, fnt(600, 25)); });
  al(g, pop(st.tk, 10), () => { const x = x0 + w * .52; rr(g, x, y0 + 380, w * .48, 200, 18, 'rgba(14,20,36,.95)', C.g, 2.5); txt(g, '小团队，大规模', x + 30, y0 + 430, C.g, fnt(800, 30)); for (let i = 0; i < 4; i++) person(g, x + 50 + i * 55, y0 + 520, C.fg, 1); for (let i = 0; i < 8; i++) bot(g, x + 300 + (i % 4) * 60, y0 + 490 + Math.floor(i / 4) * 60, [C.p, C.b][i % 2], .7); });
};

AN.sentiment = (g, t, R, st) => {
  const x0 = R.x + 40, y0 = R.y + 40, w = Math.min(760, R.w * .55);
  txt(g, '认为生成式 AI 对行业有害的比例', x0, y0, C.fg3, fnt(700, 24));
  bars(g, x0, y0 + 60, w, 420, [['2024', 18, C.o], ['2025', 30, C.r], ['2026', 52, C.bad]], t, { max: 60, t0: .8, gap: .7, fmt: v => v + '%' });
  txt(g, 'GDC《游戏产业现状》调查', x0, y0 + 560, C.fg3, fnt(500, 20));
  const rx = x0 + w + 60, rw = R.x + R.w - rx - 20;
  if (rw > 260) ['质量', '版权', '岗位', '成本'].forEach((s, i) => al(g, pop(t, 9 + i * .7), () => {
    const y = y0 + 40 + i * 130; rr(g, rx, y, rw, 100, 16, 'rgba(14,20,36,.95)', C.line2, 2); txt(g, s, rx + 30, y + 50, C.fg, fnt(800, 32)); txt(g, '？', rx + rw - 40, y + 50, C.gold, fnt(900, 44), 'center');
  }));
};

AN.end = (g, t, R, st) => {
  stars(g, R, t, 100, .4);
  const cx = R.x + R.w / 2;
  al(g, pop(t, .5), () => quote(g, R.x + 120, R.y + 60, R.w - 240, '创造一个东西，和理解一个东西，不是同一种能力。', '实测作者', C.gold, 1, 40));
  al(g, pop(t, 6), () => {
    const y = R.y + 420;
    bot(g, cx - 260, y + 60, C.p, 2); txt(g, '智能体：替你写', cx - 260, y + 160, C.p, fnt(800, 28), 'center');
    txt(g, '+', cx, y + 60, C.fg2, fnt(800, 60), 'center');
    person(g, cx + 260, y + 60, C.gold, 2.2); txt(g, '人：判断好不好玩、哪里会坏', cx + 260, y + 160, C.gold, fnt(800, 28), 'center');
  });
  al(g, pop(t, 11), () => txt(g, '本片由 AI 生成 · 新闻截至 2026-11-10', cx, R.y + R.h - 30, C.fg3, fnt(600, 22), 'center'));
};
