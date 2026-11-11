// 第三集动画：经典世界与量子之谜（第 5–6 章）
AN.open3 = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  // 背景：干涉条纹
  for (let x = 0; x < 1920; x += 6) { const v = Math.cos((x - 960) / 38) ** 2 * Math.exp(-1 * ((x - 960) / 700) ** 2); g.fillStyle = `rgba(92,180,255,${.12 * v})`; g.fillRect(x, 0, 6, 1080); }
  if (st.k === 0) { al(g, pop(t, 5), () => { txt(g, '如果心灵不是算法，', cx, R.y + 330, C.fg, fnt(800, 52, 'serif'), 'center'); txt(g, '物理定律里有非算法的过程吗？', cx, R.y + 430, C.gold, fnt(900, 58, 'serif'), 'center'); }); return; }
  [['第五章', '经典世界', '牛顿 · 混沌 · 麦克斯韦 · 相对论', C.b], ['第六章', '量子魔术和量子神秘', '双缝 · 叠加 · U 与 R · 纠缠', C.p]].forEach(([a, b, c, col], i) => al(g, pop(st.tk, .3 + i * 1.2), () => { const x = cx - 620 + i * 660; rr(g, x, R.y + 250, 580, 300, 20, 'rgba(14,20,36,.94)', col, 3); txt(g, a, x + 290, R.y + 310, col, fnt(800, 30), 'center'); txt(g, b, x + 290, R.y + 400, C.fg, fnt(800, 44, 'serif'), 'center'); txt(g, c, x + 290, R.y + 480, C.fg2, fnt(600, 24), 'center'); }));
};

AN.grades = (g, t, R, st) => {
  const cols = [['超级', C.gold, ['欧几里得几何', '牛顿力学', '麦克斯韦电磁学', '狭义相对论', '广义相对论', '量子力学', '量子电动力学']], ['有用', C.b, ['标准模型', '大爆炸宇宙学', '夸克理论']], ['尝试性', C.fg3, ['超对称', '弦理论', '大统一理论']]];
  hdr(g, R, '彭罗斯给物理理论打分', '超级 · 有用 · 尝试性');
  const w = (R.w - 80) / 3;
  cols.forEach(([h, col, items], i) => { const show = i === 0 || st.k === 2; if (!show) return; const T = i === 0 ? (st.k === 0 ? st.tk : 99) : st.tk;
    al(g, pop(T, .3 + (i ? (i - 1) * 2 : 0)), () => { const x = R.x + i * (w + 40); rr(g, x, R.y + 200, w, 560, 20, 'rgba(14,20,36,.95)', col, i === 0 ? 3 : 2); txt(g, h, x + w / 2, R.y + 250, col, fnt(900, 40, 'serif'), 'center');
      items.forEach((s, j) => al(g, pop(T, (i ? (i - 1) * 2 + .8 : 1) + j * .5), () => txt(g, s, x + w / 2, R.y + 320 + j * 62, C.fg, fnt(700, 28), 'center'))); }); });
  if (st.k === 1) {
    const x = R.x + w + 40, W2 = R.w - w - 40;
    al(g, pop(st.tk, .3), () => card(g, x, R.y + 200, W2, 260, '广义相对论 · 双星脉冲星', ['PSR B1913+16：轨道因引力波而衰减', '预言与几十年的观测高度吻合'], C.gold, 1));
    al(g, pop(st.tk, 4), () => card(g, x, R.y + 500, W2, 260, '量子电动力学 · 电子磁矩', ['理论与实验吻合到十位以上有效数字'], C.gold, 1));
  }
};

// 台球
function billiardSim(n, T, seed, eps = 0) {
  const B = Array.from({ length: n }, (_, i) => ({ x: .15 + .7 * HSH(i, seed), y: .2 + .6 * HSH(i, seed + 1), vx: (HSH(i, seed + 2) - .5) * .5, vy: (HSH(i, seed + 3) - .5) * .5 }));
  B[0].vx += eps; const dt = .01, r = .035;
  for (let s = 0; s < T / dt; s++) { B.forEach(b => { b.x += b.vx * dt; b.y += b.vy * dt; if (b.x < r || b.x > 1 - r) b.vx *= -1; if (b.y < r || b.y > 1 - r) b.vy *= -1; });
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const a = B[i], c = B[j], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy); if (d < 2 * r && d > 0) { const nx = dx / d, ny = dy / d, p = (a.vx - c.vx) * nx + (a.vy - c.vy) * ny; if (p > 0) { a.vx -= p * nx; a.vy -= p * ny; c.vx += p * nx; c.vy += p * ny; } } } }
  return B;
}
const BCACHE = {};
function billiardAt(n, T, seed, eps) { const k = [n, Math.round(T * 12), seed, eps].join(); if (!BCACHE[k]) BCACHE[k] = billiardSim(n, Math.round(T * 12) / 12, seed, eps); return BCACHE[k]; }
function table(g, x, y, w, h, B, col = C.gold, alpha = 1) { rr(g, x - 12, y - 12, w + 24, h + 24, 16, 'rgba(20,70,50,.35)', 'rgba(95,224,160,.5)', 3); B.forEach((b, i) => al(g, alpha, () => ball(g, x + b.x * w, y + b.y * h, w * .035, i === 0 ? '#ddd' : col))); }
AN.billiard = (g, t, R, st) => {
  const x = R.x + 60, y = R.y + 220, w = 760, h = 470;
  if (st.k === 0) {
    hdr(g, R, '牛顿的世界：一张台球桌', '此刻的位置 + 速度 + 力 → 未来与过去完全确定');
    table(g, x, y, w, h, billiardAt(8, Math.min(st.tk, 14), 5, 0), C.o);
    al(g, pop(st.tk, 4), () => card(g, R.x + 920, R.y + 240, 700, 240, '决定论', ['方程对时间对称：', '往前、往后都能算'], C.gold, 1));
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '拉普拉斯妖', '知道此刻一切，又算得足够快的“智者”');
    table(g, x, y, w, h, billiardAt(8, 14, 5, 0), C.o, .5);
    al(g, pop(st.tk, .5), () => { const ex = R.x + 1180, ey = R.y + 450; glow(g, ex, ey, 200, 'rgba(199,155,255,.25)'); g.save(); g.fillStyle = C.p; g.beginPath(); g.ellipse(ex, ey, 70, 40, 0, 0, TAU); g.fill(); g.fillStyle = '#0B1020'; g.beginPath(); g.arc(ex, ey, 26, 0, TAU); g.fill(); g.fillStyle = C.gold; g.beginPath(); g.arc(ex + Math.sin(t) * 8, ey, 12, 0, TAU); g.fill(); g.restore(); txt(g, '过去 ← 一清二楚 → 未来', ex, ey + 140, C.fg, fnt(800, 30), 'center'); });
    return;
  }
  hdr(g, R, '混沌：决定论 ≠ 可预测', '开局只差一点点，几次碰撞后面目全非');
  const T = Math.min(st.tk, 9);
  const A = billiardAt(6, T, 9, 0), B2 = billiardAt(6, T, 9, .01);
  table(g, x, y, w, h, A, C.b);
  B2.forEach((b, i) => { g.save(); g.globalAlpha = .9; g.strokeStyle = C.r; g.lineWidth = 3; g.beginPath(); g.arc(x + b.x * w, y + b.y * h, w * .035, 0, TAU); g.stroke(); g.restore(); });
  const d = A.reduce((s, b, i) => s + Math.hypot(b.x - B2[i].x, b.y - B2[i].y), 0);
  txt(g, '蓝：原来的开局　红圈：母球速度改动百分之一', R.x + 920, R.y + 280, C.fg2, fnt(600, 26));
  txt(g, `两局的总偏差：${d.toFixed(3)}`, R.x + 920, R.y + 360, d > .5 ? C.r : C.fg, fnt(800, 36, 'mono'));
};

AN.phase = (g, t, R, st) => {
  const ox = R.x + 120, oy = R.y + 200, W = 760, H = 520;
  hdr(g, R, st.k === 0 ? '相空间与刘维尔定理' : '经典物理可计算吗？', st.k === 0 ? '一团状态流动时：体积不变，形状被拉长、扭曲' : '');
  rr(g, ox, oy, W, H, 14, 'rgba(14,20,36,.9)', C.line2, 2); txt(g, '位置', ox + W - 10, oy + H + 30, C.fg3, fnt(600, 22), 'right'); txt(g, '动量', ox - 10, oy + 16, C.fg3, fnt(600, 22), 'right');
  const tt = st.k === 0 ? Math.min(st.tk, 12) : 12, N = 900;
  for (let i = 0; i < N; i++) { let a = HSH(i, 1) * TAU, r = Math.sqrt(HSH(i, 2)) * .1; let px = .3 + r * Math.cos(a), py = .5 + r * Math.sin(a);
    // 剪切 + 旋转流（保面积）
    const steps = Math.floor(tt * 4); for (let s = 0; s < steps; s++) { px = (px + .06 * Math.sin(TAU * py)) % 1; if (px < 0) px += 1; py = (py + .05 * Math.sin(TAU * px)) % 1; if (py < 0) py += 1; }
    dot(g, ox + px * W, oy + (1 - py) * H, 2.2, `hsla(${200 + 80 * HSH(i, 3)},80%,65%,.8)`); }
  if (st.k === 0) { al(g, pop(st.tk, 4), () => card(g, R.x + 960, R.y + 240, 660, 260, '像一滴墨水搅进水里', ['总体积（面积）不变', '却被拉成细丝，铺满各处'], C.b, 1)); return; }
  al(g, pop(st.tk, .3), () => card(g, R.x + 960, R.y + 220, 660, 250, '波动方程的一个结果（1981）', ['初始状态可计算，', '后来的状态却不可计算'], C.p, 1));
  al(g, pop(st.tk, 5), () => card(g, R.x + 960, R.y + 500, 660, 230, '彭罗斯的评价', ['依赖极不光滑的初始条件', '太人为，不像真实物理'], C.gold, 1));
};

AN.maxwell = (g, t, R, st) => {
  hdr(g, R, '麦克斯韦：电与磁统一成场', '光 = 电磁波');
  const y0 = R.y + 450, x0 = R.x + 100, x1 = R.x + R.w - 600;
  for (let x = x0; x < x1; x += 4) { const ph = (x - x0) / 60 - t * 3; const e = Math.sin(ph) * 120, b = Math.cos(ph + Math.PI / 2) * 80;
    line(g, [[x, y0], [x, y0 - e]], 'rgba(255,122,147,.5)', 2); line(g, [[x, y0], [x + b * .6, y0 + b * .35]], 'rgba(92,180,255,.4)', 2); }
  line(g, [[x0, y0], [x1 + 40, y0]], C.fg3, 2); txt(g, '电场 E', x0, y0 - 160, C.r, fnt(800, 28)); txt(g, '磁场 B', x0 + 200, y0 + 120, C.b, fnt(800, 28));
  if (st.k === 0) { al(g, pop(st.tk, 3), () => card(g, R.x + R.w - 520, R.y + 240, 500, 220, '场', ['不是一颗颗粒子', '而是遍布空间的东西'], C.gold, 1)); return; }
  al(g, pop(st.tk, .3), () => { for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) { const x = R.x + R.w - 500 + i * 40, y = R.y + 250 + j * 50; const a = Math.sin(i * .6 + j - t * 2); arrow(g, x, y, x + a * 18, y - Math.cos(i * .6 + j - t * 2) * 18, C.gold, 2, 6); } txt(g, '每一点都有数值 → 无穷多的信息', R.x + R.w - 500, R.y + 500, C.fg, fnt(700, 26)); });
  al(g, pop(st.tk, 4), () => card(g, R.x + R.w - 520, R.y + 560, 500, 180, '仍是决定论的', ['知道此刻的场 → 算出将来的场'], C.ok, 1));
};

function cone(g, x, y, h, tilt = 0, col = C.gold, a = 1, lab = true) {
  al(g, a, () => { const w = h * .62; g.save(); g.translate(x, y); g.rotate(tilt);
    g.fillStyle = col + '22'; g.strokeStyle = col; g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(-w, -h); g.lineTo(w, -h); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.ellipse(0, -h, w, w * .22, 0, 0, TAU); g.stroke();
    g.beginPath(); g.moveTo(0, 0); g.lineTo(-w, h); g.lineTo(w, h); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.ellipse(0, h, w, w * .22, 0, 0, TAU); g.stroke();
    dot(g, 0, 0, 7, C.fg); if (lab) { txt(g, '未来', 0, -h - 40, col, fnt(700, 22), 'center'); txt(g, '过去', 0, h + 40, col, fnt(700, 22), 'center'); } g.restore(); });
}
AN.lightcone = (g, t, R, st) => {
  hdr(g, R, '狭义相对论：光锥', '因果影响只能在光锥之内传播');
  const cx = R.x + 500, cy = R.y + 470;
  line(g, [[cx, cy + 300], [cx, cy - 300]], C.fg3, 2); line(g, [[cx - 400, cy], [cx + 400, cy]], C.fg3, 2); txt(g, '时间', cx + 12, cy - 290, C.fg3, fnt(600, 22)); txt(g, '空间', cx + 400, cy + 30, C.fg3, fnt(600, 22), 'right');
  cone(g, cx, cy, 220, 0, C.gold, pop(t, 1));
  al(g, pop(t, 4), () => { dot(g, cx + 60, cy - 150, 9, C.ok); txt(g, 'A：可以影响', cx + 80, cy - 150, C.ok, fnt(700, 24)); dot(g, cx + 330, cy - 60, 9, C.bad); txt(g, 'B：影响不到', cx + 350, cy - 60, C.bad, fnt(700, 24)); });
  al(g, pop(t, 2), () => card(g, R.x + 1000, R.y + 240, 620, 260, '1905 · 爱因斯坦', ['时间和空间合成“时空”', '光速对所有观察者都一样', '没有任何影响能超过光速'], C.b, 1));
};
AN.lightcone2 = (g, t, R, st) => {
  hdr(g, R, '弯曲时空里，光锥会倾斜', '坍缩的恒星 → 视界内所有光锥指向中心');
  const cx = R.x + 220, cy = R.y + 470, sx = R.x + 1000;
  g.save(); g.fillStyle = 'rgba(0,0,0,.9)'; g.beginPath(); g.arc(sx, cy, 70, 0, TAU); g.fill(); g.strokeStyle = C.r; g.setLineDash([8, 8]); g.lineWidth = 3; g.beginPath(); g.arc(sx, cy, 70, 0, TAU); g.stroke(); g.restore(); txt(g, '视界', sx, cy + 110, C.r, fnt(700, 24), 'center');
  [0, 1, 2, 3, 4, 5].forEach(i => { const x = cx + i * 140, d = (sx - x) / 780, tilt = SS(1 - d) * 1.1 * pop(t, 1 + i * .5, 1); cone(g, x, cy, 70, tilt * (x < sx ? 1 : -1), i > 4 ? C.r : C.gold, pop(t, .5 + i * .3), false); });
  al(g, pop(t, 6), () => card(g, R.x + 1180, R.y + 240, 480, 240, '1965 · 彭罗斯', ['奇点定理：引力坍缩', '必然形成奇点'], C.gold, 1));
};

AN.weylricci = (g, t, R, st) => {
  const second = st.bi > 3;
  hdr(g, R, second ? '经典物理：决定论，大体可计算' : '两种曲率', second ? '要找非算法的东西，得去别处' : '广义相对论：引力 = 时空弯曲');
  const y = R.y + 470, N = 24, r0 = 120;
  const ring = (cx, kind, u, col, lab, sub) => { txt(g, lab, cx, R.y + 230, col, fnt(900, 40, 'serif'), 'center'); txt(g, sub, cx, R.y + 280, C.fg2, fnt(600, 24), 'center');
    for (let i = 0; i < N; i++) { const a = i / N * TAU; let x = Math.cos(a), yy = Math.sin(a); if (kind === 'R') { x *= 1 - .45 * u; yy *= 1 - .45 * u; } else { x *= 1 - .4 * u; yy *= 1 + .5 * u; } dot(g, cx + x * r0, y + yy * r0, 8, col); }
    g.save(); g.strokeStyle = col + '55'; g.setLineDash([6, 6]); g.beginPath(); g.arc(cx, y, r0, 0, TAU); g.stroke(); g.restore(); };
  const u = second ? 1 : .5 - .5 * Math.cos(Math.min(t, 99) * 1.3);
  const cx1 = R.x + R.w * .25, cx2 = R.x + R.w * .62;
  ring(cx1, 'R', u, C.b, '里奇曲率', '物质直接引起 · 整体收缩');
  ring(cx2, 'W', u, C.p, '外尔曲率', '潮汐 · 圆球拉成椭球');
  if (!second) { al(g, pop(t, 6), () => txt(g, '第四集的关键：宇宙起点的外尔曲率', R.x + R.w / 2, R.y + 720, C.gold, fnt(800, 32), 'center')); return; }
  al(g, pop(t, .3), () => { rr(g, R.x + 100, R.y + 660, R.w - 200, 110, 18, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '牛顿 → 麦克斯韦 → 爱因斯坦：决定论、大体可计算', R.x + R.w / 2, R.y + 715, C.fg, fnt(800, 32), 'center'); });
};

AN.planck = (g, t, R, st) => {
  hdr(g, R, '量子的出现', '');
  const x0 = R.x + 120, y0 = R.y + 640, W = 700, H = 380;
  line(g, [[x0, y0], [x0 + W, y0]], C.fg3, 2); line(g, [[x0, y0], [x0, y0 - H]], C.fg3, 2); txt(g, '频率', x0 + W, y0 + 30, C.fg3, fnt(600, 22), 'right'); txt(g, '强度', x0 - 10, y0 - H, C.fg3, fnt(600, 22), 'right');
  const pts = [], cl = [], u = CL(t / 4); for (let i = 1; i <= 100; i++) { const f = i / 100 * 8, p = f ** 3 / (Math.exp(f) - 1), c = f * f; pts.push([x0 + i / 100 * W, y0 - p / 1.5 * H]); if (c / 10 < 1) cl.push([x0 + i / 100 * W, y0 - c / 10 * H]); }
  al(g, pop(t, 1), () => { line(g, cl, C.r, 3, [8, 6]); txt(g, '经典预言：发散', x0 + 280, y0 - H + 20, C.r, fnt(700, 22)); });
  line(g, pts.slice(0, Math.floor(pts.length * u)), C.gold, 4); al(g, pop(t, 4), () => txt(g, '普朗克公式：吻合', x0 + 400, y0 - 200, C.gold, fnt(700, 24)));
  al(g, pop(t, 2), () => card(g, R.x + 960, R.y + 240, 660, 200, '1900 · 普朗克', ['能量一份一份交换：E = hν'], C.gold, 1));
  al(g, pop(t, 6), () => { card(g, R.x + 960, R.y + 480, 660, 200, '1905 · 爱因斯坦', ['光本身由光子组成'], C.b, 1); for (let i = 0; i < 5; i++) { const x = R.x + 1300 + ((t * 120 + i * 70) % 300), y = R.y + 620; dot(g, x, y, 7, C.gold); } });
};

AN.twoslit = (g, t, R, st) => {
  const sx = R.x + 160, wx = R.x + 520, scx = R.x + 1050, cy = R.y + 470;
  hdr(g, R, st.k === 2 ? '薛定谔方程（1926）' : '双缝实验：光子一个一个地来', st.k === 1 ? '只开一条缝：条纹消失' : st.k === 2 ? '波函数：像波一样传播和叠加，却看不见' : '');
  rr(g, sx - 40, cy - 30, 80, 60, 10, 'rgba(255,210,122,.15)', C.gold, 2); txt(g, '光源', sx, cy + 60, C.fg3, fnt(600, 22), 'center');
  const one = st.k === 1;
  rr(g, wx - 8, R.y + 210, 16, 520, 2, C.fg2); g.fillStyle = '#070A12'; g.fillRect(wx - 10, cy - 70, 20, 30); if (!one) g.fillRect(wx - 10, cy + 40, 20, 30);
  rr(g, scx - 6, R.y + 210, 12, 520, 2, 'rgba(163,174,195,.4)');
  const P = y => { const d = (y - cy) / 260; return one ? Math.exp(-1 * (((y - cy + 55) / 140) ** 2)) : Math.cos(d * 9) ** 2 * Math.exp(-d * d * 1.2); };
  if (st.k === 2) {
    g.save(); g.beginPath(); g.rect(wx, R.y + 200, scx - wx, 540); g.clip();
    for (let r = 20; r < 560; r += 26) { const ph = (((r - t * 80) % 52) + 52) % 52; const rr_ = Math.max(1, r + ph - 26); [cy - 55, cy + 55].forEach(yy => { g.save(); g.strokeStyle = `rgba(92,180,255,${.35 * (1 - rr_ / 600)})`; g.lineWidth = 2; g.beginPath(); g.arc(wx, yy, rr_, -1.1, 1.1); g.stroke(); g.restore(); }); }
    g.restore();
    al(g, pop(st.tk, .5), () => { rr(g, R.x + 1180, R.y + 240, 440, 140, 16, 'rgba(14,20,36,.95)', C.b, 2); eq(g, 'iħ ∂ψ/∂t = Ĥψ', R.x + 1400, R.y + 310, C.b, 40); });
  } else {
    const n = Math.floor((st.k === 0 ? st.tk : st.tk) * 60);
    for (let i = 0; i < n; i++) { let y; for (let k = 0; k < 20; k++) { y = R.y + 220 + HSH(i, k + 50) * 500; if (HSH(i, k + 90) < P(y)) break; } dot(g, scx + 30 + HSH(i, 7) * 160, y, 2.4, one ? C.p : C.gold); }
    const fx = (st.tk * 2) % 1; dot(g, LERP(sx, scx, fx), cy + (fx > .45 ? (HSH(Math.floor(st.tk * 2), 3) - .5) * 200 * (fx - .45) : 0), 7, '#fff');
    if (st.k === 0) al(g, pop(st.tk, 6), () => txt(g, '点越积越多 → 干涉条纹', R.x + 1300, R.y + 260, C.gold, fnt(800, 30)));
    if (st.k === 1) al(g, pop(st.tk, 4), () => card(g, R.x + 1290, R.y + 240, 380, 300, '奇怪之处', ['开两条缝，有些地方', '反而更少光子', '→ 光子同时走了两条路？'], C.r, 1));
  }
};

AN.amp = (g, t, R, st) => {
  hdr(g, R, '振幅：每条路径一个复数', '先把振幅相加，再取模的平方 = 概率');
  const ox = R.x + 380, oy = R.y + 470, s = 160;
  line(g, [[ox - 260, oy], [ox + 260, oy]], C.fg3, 2); line(g, [[ox, oy + 240], [ox, oy - 240]], C.fg3, 2);
  const ph = t * .5, a1 = [Math.cos(.3) * s, Math.sin(.3) * s], a2 = [Math.cos(.3 + ph) * s, Math.sin(.3 + ph) * s];
  arrow(g, ox, oy, ox + a1[0], oy - a1[1], C.b, 4, 14); arrow(g, ox + a1[0], oy - a1[1], ox + a1[0] + a2[0], oy - a1[1] - a2[1], C.p, 4, 14);
  arrow(g, ox, oy, ox + a1[0] + a2[0], oy - a1[1] - a2[1], C.gold, 5, 16);
  txt(g, '缝 1', ox + a1[0] / 2 + 10, oy - a1[1] / 2 + 30, C.b, fnt(700, 22)); txt(g, '缝 2', ox + a1[0] + a2[0] / 2 + 14, oy - a1[1] - a2[1] / 2, C.p, fnt(700, 22));
  const P = ((a1[0] + a2[0]) ** 2 + (a1[1] + a2[1]) ** 2) / (s * s);
  rr(g, R.x + 900, R.y + 250, 720, 120, 16, 'rgba(14,20,36,.95)', C.line2, 2); txt(g, '概率 ∝ |ψ₁ + ψ₂|²', R.x + 940, R.y + 310, C.fg, fnt(800, 34, 'serif'));
  rr(g, R.x + 900, R.y + 420, 600 * P / 4, 50, 8, C.gold); txt(g, P.toFixed(2), R.x + 920 + 600 * P / 4, R.y + 445, C.gold, fnt(800, 28, 'mono'));
  txt(g, '相位相同：加强　相位相反：抵消', R.x + 900, R.y + 540, C.fg2, fnt(600, 28));
  txt(g, '|ψ₁|² + |ψ₂|² = 2.00（经典的“简单相加”）', R.x + 900, R.y + 610, C.fg3, fnt(600, 26));
};

// 黎曼球面
function riemann(g, cx, cy, r, th, phi, t) {
  glow(g, cx, cy, r * 1.4, 'rgba(92,180,255,.12)');
  g.save(); g.strokeStyle = 'rgba(92,180,255,.5)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke();
  for (let k = -2; k <= 2; k++) { const yy = cy + r * k / 3, w = Math.sqrt(1 - (k / 3) ** 2) * r; g.beginPath(); g.ellipse(cx, yy, w, w * .25, 0, 0, TAU); g.stroke(); }
  for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(cx, cy, r * Math.abs(Math.cos(t * .3 + k * Math.PI / 3)), r, 0, 0, TAU); g.stroke(); } g.restore();
  const x = cx + r * Math.sin(th) * Math.cos(phi), y = cy - r * Math.cos(th) + r * Math.sin(th) * Math.sin(phi) * .25;
  arrow(g, cx, cy, x, y, C.gold, 5, 18); dot(g, x, y, 9, C.gold);
  txt(g, '↑', cx, cy - r - 30, C.ok, fnt(800, 34), 'center'); txt(g, '↓', cx, cy + r + 34, C.r, fnt(800, 34), 'center');
}
AN.spin = (g, t, R, st) => {
  const second = st.bi === 2, cx = R.x + 420, cy = R.y + 470;
  hdr(g, R, second ? '黎曼球面' : '叠加与自旋', second ? '每个复数叠加 ↔ 球面上一个点 ↔ 空间中一个方向' : '|ψ⟩ = w |↑⟩ + z |↓⟩　（w、z 是复数）');
  const th = second ? 1.2 + .8 * Math.sin(t * .6) : CL(t / 6) * 1.6, phi = second ? t * .7 : .4;
  riemann(g, cx, cy, 220, th, phi, t);
  const w = Math.cos(th / 2), z = Math.sin(th / 2);
  rr(g, R.x + 860, R.y + 240, 760, 150, 16, 'rgba(14,20,36,.95)', C.gold, 2);
  txt(g, `w = ${w.toFixed(2)}　　z = ${z.toFixed(2)} · e^(${(phi % TAU).toFixed(1)} i)`, R.x + 900, R.y + 315, C.fg, fnt(700, 32, 'mono'));
  if (!second) { al(g, pop(t, 4), () => card(g, R.x + 860, R.y + 430, 760, 230, '测量结果只有两种', ['沿某方向测：要么 ↑，要么 ↓', '但叠加态本身对应一个“方向”'], C.b, 1)); return; }
  al(g, pop(t, 2), () => card(g, R.x + 860, R.y + 430, 760, 230, '复数有了几何意义', ['w : z 的比值 = 复平面上一点', '投到球面上 = 自旋指向的方向'], C.gold, 1));
};
AN.sg = (g, t, R, st) => {
  hdr(g, R, '施特恩–格拉赫实验（1922）', '银原子穿过不均匀磁场：干脆地分成上下两束');
  const x0 = R.x + 100, cy = R.y + 470, mx = R.x + 620, scx = R.x + 1300;
  rr(g, x0 - 20, cy - 30, 80, 60, 10, 'rgba(163,174,195,.2)', C.fg2, 2); txt(g, '银原子炉', x0 + 20, cy + 60, C.fg3, fnt(600, 22), 'center');
  g.save(); g.fillStyle = 'rgba(255,107,107,.5)'; g.beginPath(); g.moveTo(mx - 120, cy - 200); g.lineTo(mx + 120, cy - 200); g.lineTo(mx + 120, cy - 80); g.lineTo(mx, cy - 40); g.lineTo(mx - 120, cy - 80); g.fill(); g.fillStyle = 'rgba(92,180,255,.5)'; g.fillRect(mx - 120, cy + 60, 240, 140); g.restore(); txt(g, 'N', mx, cy - 140, C.fg, fnt(800, 34), 'center'); txt(g, 'S', mx, cy + 130, C.fg, fnt(800, 34), 'center');
  rr(g, scx, R.y + 220, 14, 500, 2, 'rgba(163,174,195,.4)');
  for (let i = 0; i < 40; i++) { const f = ((t * .5 + HSH(i, 1)) % 1), up = HSH(i, 2) > .5 ? -1 : 1, x = LERP(x0 + 60, scx, f), dy = x > mx ? up * (x - mx) / (scx - mx) * 150 : 0; dot(g, x, cy + dy + (HSH(i, 3) - .5) * 10, 4, up < 0 ? C.ok : C.r); }
  al(g, pop(t, 3), () => { txt(g, '↑ 一束', scx + 40, cy - 150, C.ok, fnt(800, 30)); txt(g, '↓ 一束', scx + 40, cy + 150, C.r, fnt(800, 30)); txt(g, '经典预期：连续一片', scx + 40, cy, C.fg3, fnt(600, 24)); cross(g, scx + 300, cy, 1, C.bad, 14); });
};

AN.ur = (g, t, R, st) => {
  const lx = R.x + 80, rx = R.x + R.w / 2 + 40, w = R.w / 2 - 120;
  hdr(g, R, '量子力学的两种过程', '');
  al(g, pop(st.k === 0 ? st.tk : 99, .3), () => { rr(g, lx, R.y + 200, w, 560, 20, 'rgba(14,20,36,.95)', C.b, 3); txt(g, 'U　幺正演化', lx + 30, R.y + 250, C.b, fnt(900, 40)); txt(g, '薛定谔方程 · 决定论 · 可计算', lx + 30, R.y + 310, C.fg2, fnt(600, 24));
    for (let x = 0; x < w - 60; x += 3) { const y1 = Math.sin(x / 30 - t * 2) * Math.exp(-1 * ((x - (t * 40) % (w - 60)) / 120) ** 2) * 70, y2 = Math.sin(x / 22 - t * 2.4) * Math.exp(-1 * ((x - (t * 30 + 200) % (w - 60)) / 120) ** 2) * 60; dot(g, lx + 30 + x, R.y + 470 + y1, 1.8, C.b); dot(g, lx + 30 + x, R.y + 620 + y2, 1.8, C.p); }
    txt(g, '叠加始终保持叠加', lx + 30, R.y + 720, C.fg, fnt(700, 26)); });
  if (st.k >= 1) al(g, pop(st.tk, .3), () => { rr(g, rx, R.y + 200, w, 560, 20, 'rgba(14,20,36,.95)', C.r, 3); txt(g, 'R　态矢量约化', rx + 30, R.y + 250, C.r, fnt(900, 40)); txt(g, '测量 · 随机 · 概率 = |振幅|²', rx + 30, R.y + 310, C.fg2, fnt(600, 24));
    const jump = st.tk > 3, res = HSH(Math.floor(st.tk / 6), 4) > .5;
    if (!jump) { txt(g, '0.6 |↑⟩ + 0.8 |↓⟩', rx + w / 2, R.y + 480, C.fg, fnt(800, 40, 'mono'), 'center'); }
    else { txt(g, res ? '|↑⟩' : '|↓⟩', rx + w / 2, R.y + 480, res ? C.ok : C.r, fnt(900, 70, 'mono'), 'center'); txt(g, '36% / 64%', rx + w / 2, R.y + 570, C.fg3, fnt(600, 26), 'center'); }
    txt(g, '和 U 根本不相容', rx + 30, R.y + 720, C.gold, fnt(800, 28)); });
};

AN.cat = (g, t, R, st) => {
  const bx = R.x + 160, by = R.y + 250, bw = 620, bh = 440;
  hdr(g, R, st.k === 2 ? '彭罗斯：R 是真实的物理过程' : '薛定谔的猫', st.k === 1 ? '哥本哈根？多世界？' : '');
  rr(g, bx, by, bw, bh, 16, 'rgba(14,20,36,.95)', C.fg2, 3);
  // 原子与毒瓶
  dot(g, bx + 90, by + 100, 16, C.g); txt(g, '原子', bx + 90, by + 145, C.fg3, fnt(600, 20), 'center'); rr(g, bx + 70, by + 260, 40, 80, 8, 'rgba(95,224,160,.25)', C.g, 2); txt(g, '毒气', bx + 90, by + 370, C.fg3, fnt(600, 20), 'center');
  const catDraw = (x, y, alive, a) => al(g, a, () => { g.save(); g.fillStyle = alive ? C.o : 'rgba(163,174,195,.8)'; g.beginPath(); g.ellipse(x, y + 40, 90, 50, 0, 0, TAU); g.fill(); g.beginPath(); g.arc(x + (alive ? 80 : 95), y + (alive ? -10 : 40), 40, 0, TAU); g.fill(); g.beginPath(); g.moveTo(x + 50 + (alive ? 0 : 15), y - 30 + (alive ? 0 : 50)); g.lineTo(x + 62 + (alive ? 0 : 15), y - 70 + (alive ? 0 : 50)); g.lineTo(x + 78 + (alive ? 0 : 15), y - 40 + (alive ? 0 : 50)); g.fill(); g.restore(); txt(g, alive ? '活' : '死', x, y + 130, alive ? C.ok : C.fg3, fnt(800, 30), 'center'); });
  const sup = .5 + .5 * Math.sin(t * 2.5);
  catDraw(bx + 380, by + 180, true, st.k === 0 ? .25 + .75 * sup : .55); catDraw(bx + 380, by + 180, false, st.k === 0 ? .25 + .75 * (1 - sup) : .45);
  if (st.k === 0) { al(g, pop(st.tk, 4), () => { txt(g, '|活⟩ + |死⟩ ？', bx + bw + 80, by + 180, C.gold, fnt(900, 54, 'serif')); txt(g, '谁也没见过半死半活的猫', bx + bw + 80, by + 280, C.fg2, fnt(700, 28)); }); return; }
  if (st.k === 1) { al(g, pop(st.tk, .3), () => card(g, bx + bw + 60, R.y + 230, 700, 200, '哥本哈根诠释', ['只管计算结果，回避“何时塌缩”'], C.b, 1)); al(g, pop(st.tk, 4), () => card(g, bx + bw + 60, R.y + 470, 700, 200, '多世界诠释', ['所有结果都发生，分到不同世界'], C.p, 1)); al(g, pop(st.tk, 8), () => txt(g, '彭罗斯：都不满意', bx + bw + 60, R.y + 730, C.gold, fnt(800, 32))); return; }
  al(g, pop(st.tk, .3), () => card(g, bx + bw + 60, R.y + 230, 700, 240, 'R 不是', ['理论的近似', '观察者的心理作用'], C.fg3, 1));
  al(g, pop(st.tk, 4), () => { const x0 = bx + bw + 60, y = R.y + 600; line(g, [[x0, y], [x0 + 700, y]], C.line2, 6); txt(g, '微观', x0, y + 40, C.b, fnt(700, 26)); txt(g, '宏观', x0 + 700, y + 40, C.o, fnt(700, 26), 'right'); dot(g, x0 + 350, y, 14, C.gold); txt(g, '界线在哪？', x0 + 350, y - 40, C.gold, fnt(800, 30), 'center'); });
};

AN.epr = (g, t, R, st) => {
  hdr(g, R, 'EPR（1935）', '爱因斯坦、波多尔斯基、罗森：纠缠的两个粒子');
  const cx = R.x + R.w / 2, cy = R.y + 450, d = Math.min(1, t / 4) * 620;
  dot(g, cx, cy, 10, C.fg3); g.save(); g.strokeStyle = 'rgba(199,155,255,.5)'; g.setLineDash([6, 8]); g.lineWidth = 2; g.beginPath(); g.moveTo(cx - d, cy); for (let x = -d; x <= d; x += 10) g.lineTo(cx + x, cy + Math.sin(x / 30 + t * 3) * 12); g.stroke(); g.restore();
  ball(g, cx - d, cy, 26, C.p); ball(g, cx + d, cy, 26, C.p);
  al(g, pop(t, 5), () => { rr(g, cx - d - 90, cy - 170, 180, 90, 14, 'rgba(14,20,36,.95)', C.ok, 2); txt(g, '测得 ↑', cx - d, cy - 125, C.ok, fnt(800, 30), 'center'); });
  al(g, pop(t, 6.5), () => { rr(g, cx + d - 90, cy - 170, 180, 90, 14, 'rgba(14,20,36,.95)', C.r, 2); txt(g, '必是 ↓', cx + d, cy - 125, C.r, fnt(800, 30), 'center'); txt(g, '无论相隔多远', cx, cy + 160, C.fg, fnt(800, 32), 'center'); });
  al(g, pop(t, 9), () => txt(g, '一种经典方式无法解释的关联', cx, cy + 230, C.gold, fnt(800, 32), 'center'));
};

AN.bell = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '贝尔不等式（1964）与阿斯佩实验（1982）', '');
    const x0 = R.x + 120, y0 = R.y + 640, W = 760, H = 380;
    line(g, [[x0, y0], [x0 + W, y0]], C.fg3, 2); line(g, [[x0, y0], [x0, y0 - H]], C.fg3, 2); txt(g, '两侧测量方向的夹角', x0 + W, y0 + 34, C.fg3, fnt(600, 22), 'right'); txt(g, '关联', x0 - 10, y0 - H, C.fg3, fnt(600, 22), 'right');
    const qm = [], lhv = []; for (let i = 0; i <= 90; i++) { const a = i / 90 * Math.PI; qm.push([x0 + i / 90 * W, y0 - H / 2 - Math.cos(a) * H / 2]); lhv.push([x0 + i / 90 * W, y0 - H / 2 - (1 - 2 * i / 90) * H / 2]); }
    al(g, pop(st.tk, 1), () => { line(g, lhv, C.fg2, 3, [8, 6]); txt(g, '定域隐变量：最多到这里', x0 + 420, y0 - 300, C.fg2, fnt(700, 22)); });
    al(g, pop(st.tk, 3), () => { line(g, qm.slice(0, Math.floor(qm.length * CL((st.tk - 3) / 2))), C.gold, 4); txt(g, '量子力学', x0 + 120, y0 - H - 10, C.gold, fnt(800, 26)); });
    al(g, pop(st.tk, 6), () => { for (let i = 0; i < 9; i++) { const a = (i + .5) / 9 * Math.PI; dot(g, x0 + (i + .5) / 9 * W, y0 - H / 2 - Math.cos(a) * H / 2 + (HSH(i, 1) - .5) * 10, 8, C.ok); } card(g, R.x + 960, R.y + 240, 660, 220, '阿斯佩等人 · 巴黎 1982', ['实验点落在量子力学一边'], C.ok, 1); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '不能用来超光速通信', '每一边单独看：完全随机');
    const row = (y, lab, seed, col) => { txt(g, lab, R.x + 100, y, col, fnt(800, 28)); for (let i = 0; i < 20; i++) al(g, pop(st.tk, .3 + i * .15), () => txt(g, HSH(i, seed) > .5 ? '↑' : '↓', R.x + 300 + i * 56, y, C.fg, fnt(800, 34), 'center')); };
    row(R.y + 300, 'A 的记录', 3, C.b); row(R.y + 400, 'B 的记录', 3.5, C.p);
    al(g, pop(st.tk, 5), () => { rr(g, R.x + 260, R.y + 480, 1140, 160, 18, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '只有把两边的记录放在一起比较，', R.x + 830, R.y + 535, C.fg, fnt(700, 30), 'center'); txt(g, '才看得出那种奇特的关联', R.x + 830, R.y + 590, C.gold, fnt(800, 30), 'center'); });
    return;
  }
  if (st.k === 2) {
    hdr(g, R, '书出版之后', '');
    const ev = [['2015', '无漏洞贝尔实验', '代尔夫特、维也纳、NIST 等团队', C.b], ['2022', '诺贝尔物理学奖', '阿斯佩 · 克劳泽 · 塞林格', C.gold]];
    ev.forEach(([y, a, b, col], i) => al(g, pop(st.tk, .3 + i * 3), () => { const x = R.x + 100 + i * 820; rr(g, x, R.y + 240, 760, 360, 20, 'rgba(14,20,36,.95)', col, 3); txt(g, y, x + 40, R.y + 310, col, fnt(900, 54, 'mono')); txt(g, a, x + 40, R.y + 420, C.fg, fnt(800, 40)); txt(g, b, x + 40, R.y + 500, C.fg2, fnt(600, 28)); }));
    return;
  }
  hdr(g, R, '彭罗斯的判断', '');
  al(g, pop(st.tk, .3), () => card(g, R.x + 100, R.y + 240, 740, 240, 'U 部分', ['精确无比'], C.b, 1));
  al(g, pop(st.tk, 2.5), () => card(g, R.x + 900, R.y + 240, 740, 240, 'R 部分', ['说明理论还不完整'], C.r, 1));
  al(g, pop(st.tk, 5), () => { rr(g, R.x + 100, R.y + 540, 1540, 150, 20, 'rgba(255,210,122,.08)', C.gold, 3); txt(g, '缺的那一块：和引力有关，可能是非算法的', cx, R.y + 615, C.gold, fnt(800, 38), 'center'); });
};

AN.recap3 = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  hdr(g, R, '第三集小结', '');
  const items = [['决定论与混沌', '台球桌 · 相空间', C.o], ['相对论', '光锥 · 弯曲时空', C.b], ['量子叠加', '双缝 · 黎曼球面', C.p], ['U 与 R', '测量之谜', C.r]];
  items.forEach(([a, b, col], i) => al(g, pop(st.k === 0 ? t : 99, .3 + i * 1.2), () => { const x = R.x + 40 + i * 425; rr(g, x, R.y + 230, 390, 260, 20, 'rgba(14,20,36,.95)', col, 2.5); txt(g, a, x + 195, R.y + 320, col, fnt(800, 36, 'serif'), 'center'); txt(g, b, x + 195, R.y + 400, C.fg2, fnt(600, 26), 'center'); }));
  if (st.k === 1) al(g, pop(st.tk, .5), () => { rr(g, cx - 520, R.y + 580, 1040, 150, 20, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '最后一集：时间之箭 · 量子引力 · 大脑与意识', cx, R.y + 640, C.fg, fnt(800, 34), 'center'); txt(g, '从宇宙的起点，走到心灵', cx, R.y + 695, C.gold, fnt(700, 28), 'center'); });
};
