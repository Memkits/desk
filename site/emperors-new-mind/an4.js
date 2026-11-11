// 第四集动画：心灵的物理在哪里（第 7–10 章、尾声 + 书后）
function egg(g, x, y, s, broken, a = 1) { al(g, a, () => { g.save(); g.fillStyle = '#F3E6C4'; if (!broken) { g.beginPath(); g.ellipse(x, y, 50 * s, 66 * s, 0, 0, TAU); g.fill(); } else { for (let i = 0; i < 9; i++) { const ang = HSH(i, 4) * TAU, d = 30 + HSH(i, 5) * 60; g.beginPath(); g.moveTo(x + Math.cos(ang) * d * s, y + 40 * s + Math.sin(ang) * d * .3 * s); g.lineTo(x + Math.cos(ang) * d * s + 20 * s, y + 30 * s); g.lineTo(x + Math.cos(ang) * d * s + 6 * s, y + 50 * s); g.fill(); } g.fillStyle = 'rgba(255,200,60,.85)'; g.beginPath(); g.ellipse(x, y + 50 * s, 60 * s, 16 * s, 0, 0, TAU); g.fill(); } g.restore(); }); }

AN.open4 = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    const u = SS(CL((t - 3) / 1.2)); egg(g, cx - 300, R.y + 320 + u * 140, 1.3, u >= 1, 1);
    al(g, pop(t, 5), () => { txt(g, '摔碎的鸡蛋不会复原', cx + 180, R.y + 300, C.fg, fnt(800, 44, 'serif')); txt(g, '基本方程却对时间对称', cx + 180, R.y + 380, C.fg2, fnt(700, 34)); txt(g, '时间的方向从哪里来？', cx + 180, R.y + 500, C.gold, fnt(900, 50, 'serif')); });
    return;
  }
  [['第七章', '宇宙学和时间箭头', C.b], ['第八章', '寻求量子引力', C.p], ['第九章', '真实的脑和模型脑', C.g], ['第十章', '意识的物理在哪里', C.gold]].forEach(([a, b, col], i) => al(g, pop(st.tk, .3 + i * .8), () => { const x = R.x + i * 440; rr(g, x, R.y + 240, 400, 260, 20, 'rgba(14,20,36,.94)', col, 3); txt(g, a, x + 200, R.y + 300, col, fnt(800, 28), 'center'); wrapTxt(g, b, x + 30, R.y + 380, 340, 44, C.fg, fnt(800, 34, 'serif')); }));
  al(g, pop(st.tk, 4), () => { rr(g, R.x, R.y + 560, R.w, 120, 20, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '+ 尾声　+ 书出版后三十多年的实验与争论', cx, R.y + 620, C.gold, fnt(800, 34), 'center'); });
};

AN.entropy = (g, t, R, st) => {
  const ox = R.x + 120, oy = R.y + 220, W = 760, H = 520;
  hdr(g, R, st.k === 0 ? '熵：看起来一样的微观状态有多少' : '相空间被切成大小悬殊的格子', st.k === 0 ? '热力学第二定律：孤立系统的熵总是增加' : '系统随机游走：从小格子跑进大格子');
  if (st.k === 0) {
    egg(g, ox + 160, oy + 220, 1.4, false); txt(g, '完整：状态很少', ox + 160, oy + 380, C.ok, fnt(800, 28), 'center');
    al(g, pop(st.tk, 3), () => { egg(g, ox + 640, oy + 200, 1.4, true); txt(g, '打碎：状态多得多', ox + 640, oy + 380, C.r, fnt(800, 28), 'center'); arrow(g, ox + 300, oy + 220, ox + 500, oy + 220, C.fg3, 4); });
    al(g, pop(st.tk, 6), () => { rr(g, R.x + 1000, R.y + 240, 620, 160, 18, 'rgba(14,20,36,.95)', C.gold, 2); eq(g, 'S = k log V', R.x + 1310, R.y + 320, C.gold, 52); txt(g, 'V：相空间里对应区域的体积（玻尔兹曼）', R.x + 1000, R.y + 450, C.fg2, fnt(600, 24)); });
    return;
  }
  rr(g, ox, oy, W, H, 10, 'rgba(14,20,36,.9)', C.line2, 2);
  // 格子：左上角小，右下大
  const cells = [[0, 0, .08, .1, C.ok], [.08, 0, .14, .18, C.b], [0, .1, .22, .25, C.p], [.22, 0, .78, .45, C.o], [0, .35, 1, .65, C.r]];
  cells.forEach(([x, y, w, h, col]) => rr(g, ox + x * W, oy + y * H, w * W, h * H, 0, col + '22', col, 1.5));
  txt(g, '完整的蛋', ox + 6, oy + 26, C.ok, fnt(700, 18)); txt(g, '热平衡（最大）', ox + W / 2, oy + H * .7, C.r, fnt(800, 30), 'center');
  // 游走的点
  let px = .03, py = .04; const pts = [[px, py]]; const n = Math.floor(CL(st.tk / 10) * 400);
  for (let i = 0; i < n; i++) { px = CL(px + (HSH(i, 31) - .4) * .05, .01, .99); py = CL(py + (HSH(i, 32) - .35) * .05, .01, .99); pts.push([px, py]); }
  line(g, pts.map(([a, b]) => [ox + a * W, oy + b * H]), 'rgba(255,210,122,.6)', 2); dot(g, ox + px * W, oy + py * H, 9, C.gold);
  al(g, pop(st.tk, 6), () => card(g, R.x + 960, R.y + 240, 660, 240, '熵增加', ['不是一条神秘的力', '只是大格子比小格子大得多'], C.gold, 1));
};

AN.sun = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '真正的谜在过去', '为什么过去的熵那么低？');
    const chain = [['鸡蛋', C.fg], ['母鸡', C.o], ['粮食', C.g], ['太阳', C.gold], ['？', C.r]];
    chain.forEach(([s, col], i) => al(g, pop(st.tk, 1 + i * 1.4), () => { const x = R.x + 120 + i * 360; rr(g, x, R.y + 380, 260, 140, 20, 'rgba(14,20,36,.95)', col, 3); txt(g, s, x + 130, R.y + 450, col, fnt(900, 48, 'serif'), 'center'); if (i) arrow(g, x - 90, R.y + 450, x - 10, R.y + 450, C.fg3, 4); }));
    return;
  }
  hdr(g, R, '地球从太阳得到的是低熵', '能量收支平衡：进多少，出多少');
  const sx = R.x + 160, ex = R.x + 820, y = R.y + 470;
  glow(g, sx, y, 200, 'rgba(255,210,122,.5)'); dot(g, sx, y, 80, C.gold); ball(g, ex, y, 90, '#3a7bd5');
  for (let i = 0; i < 6; i++) { const f = ((t * .4 + i / 6) % 1); dot(g, LERP(sx + 90, ex - 100, f), y - 60 + i * 24, 9, C.gold); }
  for (let i = 0; i < 30; i++) { const f = ((t * .4 + HSH(i, 1)) % 1), a = -1 + HSH(i, 2) * 2; dot(g, ex + Math.cos(a) * (100 + f * 500), y + Math.sin(a) * (100 + f * 300), 4, C.r); }
  al(g, pop(st.tk, 3), () => { card(g, R.x + 1100, R.y + 230, 540, 160, '进：少量高能光子', ['可见光 · 约 6000 K'], C.gold, 1); card(g, R.x + 1100, R.y + 420, 540, 160, '出：大量低能光子', ['红外 · 约 255 K · 数量约 20 倍'], C.r, 1); });
  al(g, pop(st.tk, 8), () => txt(g, '能量不变，熵增加：生命靠的是这份“低熵”', R.x + 100, R.y + 760, C.fg, fnt(800, 32)));
};

AN.clump = (g, t, R, st) => {
  const lx = R.x + 100, rx = R.x + R.w / 2 + 40, w = R.w / 2 - 140, y = R.y + 240, h = 380;
  hdr(g, R, st.k === 0 ? '引力颠倒了熵的直觉' : '黑洞的熵：贝肯斯坦–霍金', st.k === 0 ? '' : 'S ∝ 视界面积');
  if (st.k === 0) {
    rr(g, lx, y, w, h, 16, 'rgba(14,20,36,.9)', C.b, 2); txt(g, '普通气体', lx + w / 2, y - 24, C.b, fnt(800, 28), 'center');
    for (let i = 0; i < 80; i++) { const u = CL(st.tk / 6), x0 = lx + 20 + HSH(i, 1) * 80, y0 = y + 20 + HSH(i, 2) * 80, x1 = lx + 20 + HSH(i, 3) * (w - 40), y1 = y + 20 + HSH(i, 4) * (h - 40); dot(g, LERP(x0, x1, u), LERP(y0, y1, u), 4, C.b); }
    txt(g, '均匀散开 → 熵增加', lx + w / 2, y + h + 40, C.fg, fnt(700, 26), 'center');
    rr(g, rx, y, w, h, 16, 'rgba(14,20,36,.9)', C.gold, 2); txt(g, '有引力', rx + w / 2, y - 24, C.gold, fnt(800, 28), 'center');
    const cl = [[.3, .4], [.7, .3], [.55, .75]];
    for (let i = 0; i < 80; i++) { const u = CL(st.tk / 6), c = cl[i % 3], x0 = rx + 20 + HSH(i, 3) * (w - 40), y0 = y + 20 + HSH(i, 4) * (h - 40), r = 6 + HSH(i, 5) * 30, a = HSH(i, 6) * TAU, x1 = rx + c[0] * w + Math.cos(a) * r, y1 = y + c[1] * h + Math.sin(a) * r; dot(g, LERP(x0, x1, u), LERP(y0, y1, u), 4, C.gold); }
    txt(g, '结团成恒星 → 熵增加', rx + w / 2, y + h + 40, C.fg, fnt(700, 26), 'center');
    al(g, pop(st.tk, 8), () => txt(g, '结团的极致：黑洞', R.x + R.w / 2, y + h + 110, C.r, fnt(800, 34), 'center'));
    return;
  }
  const bx = R.x + 400, by = R.y + 470, r = 150;
  glow(g, bx, by, r * 2, 'rgba(255,178,92,.25)'); g.save(); g.strokeStyle = C.o; g.lineWidth = 8; g.beginPath(); g.ellipse(bx, by, r * 1.7, r * .35, -.15, 0, TAU); g.stroke(); g.restore(); dot(g, bx, by, r, '#000');
  g.save(); g.strokeStyle = 'rgba(255,210,122,.6)'; g.setLineDash([6, 6]); g.lineWidth = 2; g.beginPath(); g.arc(bx, by, r + 4, 0, TAU); g.stroke(); g.restore(); txt(g, '视界', bx, by - r - 30, C.gold, fnt(700, 24), 'center');
  al(g, pop(st.tk, 2), () => { bars(g, R.x + 900, R.y + 260, 700, 380, [['太阳', 58, C.gold, '约 10⁵⁸'], ['同质量黑洞', 77, C.r, '约 10⁷⁷']], st.tk - 2, { max: 80, fmt: v => '10^' + v }); txt(g, '熵（以玻尔兹曼常数为单位，取对数）', R.x + 900, R.y + 230, C.fg3, fnt(600, 22)); });
};

AN.weyl = (g, t, R, st) => {
  hdr(g, R, '外尔曲率假说', '宇宙起点：外尔曲率 = 0　　黑洞奇点：外尔曲率巨大');
  const cx = R.x + R.w / 2, y0 = R.y + 750, y1 = R.y + 220;
  // 时空图：底部平滑起点，上方结团
  g.save(); g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); g.moveTo(cx - 600, y0); g.lineTo(cx + 600, y0); g.stroke(); g.restore();
  txt(g, '大爆炸：极其平滑（W = 0）', cx, y0 + 40, C.gold, fnt(800, 28), 'center');
  for (let i = 0; i < 9; i++) { const x = cx - 560 + i * 140; g.save(); g.strokeStyle = 'rgba(92,180,255,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y0); for (let k = 0; k <= 40; k++) { const yy = LERP(y0, y1, k / 40), cl = Math.round((x - cx) / 400) * 400 + cx; g.lineTo(LERP(x, cl, (k / 40) ** 2 * .7), yy); } g.stroke(); g.restore(); }
  al(g, pop(t, 3), () => { [-400, 0, 400].forEach(d => { glow(g, cx + d, y1 + 40, 70, 'rgba(255,107,107,.35)'); dot(g, cx + d, y1 + 40, 22, '#000'); g.save(); g.strokeStyle = C.r; g.lineWidth = 3; g.beginPath(); g.moveTo(cx + d - 40, y1 + 10); for (let k = 0; k < 8; k++) g.lineTo(cx + d - 40 + k * 11, y1 + 10 + (k % 2 ? 14 : -6)); g.stroke(); g.restore(); }); txt(g, '黑洞奇点：外尔曲率巨大、杂乱', cx, y1 - 30, C.r, fnt(800, 28), 'center'); });
  al(g, pop(t, 7), () => { rr(g, R.x + 20, R.y + 430, 330, 120, 16, 'rgba(14,20,36,.95)', C.fg2, 2); txt(g, '起点 ≠ 终点', R.x + 185, R.y + 470, C.fg, fnt(800, 30), 'center'); txt(g, '完全不对称', R.x + 185, R.y + 515, C.fg2, fnt(600, 24), 'center'); });
};

AN.pin = (g, t, R, st) => {
  const cx = R.x + R.w / 2, bx = R.x + 160, by = R.y + 220, bw = 760, bh = 520;
  hdr(g, R, '造物主的针尖', '');
  rr(g, bx, by, bw, bh, 12, 'rgba(14,20,36,.9)', C.line2, 2); for (let i = 0; i < 2000; i++) dot(g, bx + 6 + HSH(i, 1) * (bw - 12), by + 6 + HSH(i, 2) * (bh - 12), 1, 'rgba(163,174,195,.35)');
  txt(g, '所有可能的宇宙初态', bx + bw / 2, by + bh + 34, C.fg3, fnt(600, 24), 'center');
  const tx = bx + 120, ty = by + 90; dot(g, tx, ty, 2, C.gold); glow(g, tx, ty, 20, 'rgba(255,210,122,.6)');
  const u = SS(CL((t - 1) / 2)); g.save(); g.strokeStyle = '#ccc'; g.lineWidth = 4; line(g, [[tx + 200 - 200 * u, ty - 160 + 160 * u], [tx + 380 - 200 * u, ty - 320 + 160 * u]], '#ddd', 4); g.restore();
  txt(g, '我们这样的低熵宇宙', tx + 30, ty + 40, C.gold, fnt(700, 22));
  al(g, pop(t, 4), () => { rr(g, R.x + 1000, R.y + 240, 640, 220, 20, 'rgba(255,210,122,.08)', C.gold, 3); txt(g, '扎中的机会 ≈', R.x + 1040, R.y + 300, C.fg2, fnt(700, 28)); txt(g, '1 / 10^(10^123)', R.x + 1320, R.y + 400, C.gold, fnt(900, 58, 'serif'), 'center'); });
  al(g, pop(t, 9), () => card(g, R.x + 1000, R.y + 500, 640, 220, '大到写不出', ['宇宙里约 10⁸⁰ 个粒子', '每个上写一个 0，也只够 10⁸⁰ 个 0'], C.fg2, 1));
};

AN.beam = (g, t, R, st) => {
  const lx = R.x + 160, sx = R.x + 560, sy = R.y + 470, dx = R.x + 960, wy = R.y + 230;
  hdr(g, R, st.k === 0 ? 'R 的时间方向：往未来推' : '倒过来往过去推：算错了', st.k === 0 ? '灯 → 半透镜 → 探测器 or 墙' : '已知探测器响了，光子来自灯的概率？');
  rr(g, lx - 50, sy - 40, 100, 80, 14, 'rgba(255,210,122,.15)', C.gold, 2); txt(g, '灯', lx, sy + 70, C.gold, fnt(700, 24), 'center');
  line(g, [[sx - 50, sy + 50], [sx + 50, sy - 50]], C.b, 6); txt(g, '半透镜', sx + 60, sy + 70, C.b, fnt(700, 22));
  rr(g, dx, sy - 50, 40, 100, 8, 'rgba(95,211,154,.2)', C.ok, 2); txt(g, '探测器', dx + 20, sy + 80, C.ok, fnt(700, 22), 'center');
  rr(g, sx - 120, wy - 20, 240, 26, 4, 'rgba(163,174,195,.3)', C.fg3, 2); txt(g, '墙（不发光）', sx, wy - 44, C.fg3, fnt(700, 22), 'center');
  line(g, [[lx + 50, sy], [sx, sy]], 'rgba(255,210,122,.5)', 3); line(g, [[sx, sy], [dx, sy]], 'rgba(255,210,122,.5)', 3, [10, 8]); line(g, [[sx, sy], [sx, wy + 10]], 'rgba(255,210,122,.5)', 3, [10, 8]);
  const f = (t * .5) % 1; if (st.k === 0) dot(g, f < .5 ? LERP(lx + 50, sx, f * 2) : LERP(sx, dx, (f - .5) * 2), sy, 9, C.gold); else dot(g, f < .5 ? LERP(dx, sx, f * 2) : sx, f < .5 ? sy : LERP(sy, wy + 10, (f - .5) * 2), 9, C.p);
  const x = R.x + 1150;
  if (st.k === 0) { al(g, pop(st.tk, 4), () => { card(g, x, R.y + 240, 500, 200, '往未来', ['探测器响的概率 = 1/2'], C.ok, 1); ticks(g, x + 420, R.y + 320, pop(st.tk, 5)); }); return; }
  al(g, pop(st.tk, 1), () => card(g, x, R.y + 230, 500, 180, '用同样规则往过去推', ['来自灯：1/2　来自墙：1/2'], C.p, 1));
  al(g, pop(st.tk, 5), () => { card(g, x, R.y + 440, 500, 160, '实际', ['来自灯：1（墙不会发光）'], C.r, 1); cross(g, x + 440, R.y + 290, 1, C.bad, 16); });
  al(g, pop(st.tk, 9), () => card(g, R.x + 100, R.y + 650, 1550, 120, '两样时间不对称的东西 → 同一个源头？', ['起点的外尔曲率 = 0　＋　量子测量 R'], C.gold, 1));
};

AN.hbox = (g, t, R, st) => {
  hdr(g, R, '霍金箱思想实验', '封闭的巨大盒子：黑洞与热辐射长期共存');
  const bx = R.x + 100, by = R.y + 220, bw = 700, bh = 520;
  rr(g, bx, by, bw, bh, 12, 'rgba(14,20,36,.9)', C.fg2, 4);
  const bhx = bx + bw / 2, bhy = by + bh / 2; glow(g, bhx, bhy, 120, 'rgba(255,178,92,.25)'); dot(g, bhx, bhy, 60, '#000');
  for (let i = 0; i < 60; i++) { const a = HSH(i, 1) * TAU + t * (.2 + HSH(i, 2) * .3), r = 80 + ((HSH(i, 3) * 300 + t * 40) % 240); dot(g, bhx + Math.cos(a) * r * 1.3, bhy + Math.sin(a) * r * .9, 3, C.o); }
  const x = R.x + 900, y = R.y + 270;
  al(g, pop(t, 3), () => { txt(g, '相空间的流动', x, y, C.fg, fnt(800, 30)); // 收缩 + 扩张
    const u = .5 + .5 * Math.sin(t * 1.5); g.save(); g.strokeStyle = C.r; g.lineWidth = 3; g.beginPath(); g.ellipse(x + 160, y + 160, 120 * (1 - .4 * u), 80 * (1 - .4 * u), 0, 0, TAU); g.stroke(); g.restore(); txt(g, '黑洞吞掉信息：收缩', x + 160, y + 290, C.r, fnt(700, 24), 'center');
    g.save(); g.strokeStyle = C.ok; g.lineWidth = 3; g.beginPath(); g.ellipse(x + 520, y + 160, 80 * (1 + .4 * u), 60 * (1 + .4 * u), 0, 0, TAU); g.stroke(); g.restore(); txt(g, 'R：一分为多：扩张', x + 520, y + 290, C.ok, fnt(700, 24), 'center'); });
  al(g, pop(t, 9), () => { rr(g, x, R.y + 620, 760, 120, 18, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '彭罗斯：信息丢失与 R 是一枚硬币的两面', x + 380, R.y + 680, C.fg, fnt(800, 28), 'center'); });
};

AN.or = (g, t, R, st) => {
  hdr(g, R, '引力引起的客观约化（OR）', '物体处在两个位置的叠加 = 两种时空弯曲的叠加');
  const y = R.y + 470, x1 = R.x + 400, x2 = R.x + 900;
  const well = (cx, a) => { g.save(); g.globalAlpha *= a; g.strokeStyle = 'rgba(92,180,255,.6)'; g.lineWidth = 1.6; for (let j = 0; j < 7; j++) { g.beginPath(); for (let i = 0; i <= 60; i++) { const xx = R.x + 100 + i * 18, d = 110 / (1 + ((xx - cx) / 90) ** 2); const yy = y - 120 + j * 40 + d * (1 - Math.abs(j - 3) / 4); i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } g.restore(); };
  const s = .5 + .5 * Math.sin(t * 2);
  well(x1, .3 + .7 * s); well(x2, .3 + .7 * (1 - s));
  ball(g, x1, y - 40, 30, C.gold); g.save(); g.globalAlpha = .5; ball(g, x2, y - 40, 30, C.gold); g.restore();
  txt(g, '位置 A', x1, y + 200, C.fg2, fnt(700, 26), 'center'); txt(g, '位置 B', x2, y + 200, C.fg2, fnt(700, 26), 'center'); txt(g, '+', (x1 + x2) / 2, y - 40, C.fg, fnt(900, 50), 'center');
  al(g, pop(t, 4), () => card(g, R.x + 1180, R.y + 240, 480, 280, '彭罗斯的猜想', ['约化不是观测者引起的', '而是真实的物理过程', '由引力触发'], C.gold, 1));
};

AN.orscale = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '叠加能维持多久？', '差别累积到约“一个引力子”→ 自动坍缩（书中：单引力子判据）');
    const x0 = R.x + 120, x1 = R.x + R.w - 120, y = R.y + 470;
    line(g, [[x0, y], [x1, y]], C.line2, 6);
    const items = [[0, '电子', '几乎永远', C.b], [.3, '原子', '极长', C.b], [.56, '普朗克质量 ≈ 10⁻⁵ 克', '分界附近', C.gold], [.8, '尘埃 / 细胞', '很快', C.o], [1, '猫', '几乎瞬间', C.r]];
    items.forEach(([p, a, b, col], i) => al(g, pop(st.tk, .5 + i * 1.3), () => { const x = LERP(x0, x1, p); dot(g, x, y, 12, col); txt(g, a, x, y - 50, col, fnt(800, 28), i === 0 ? 'left' : i === 4 ? 'right' : 'center'); txt(g, b, x, y + 50, C.fg2, fnt(600, 24), i === 0 ? 'left' : i === 4 ? 'right' : 'center'); }));
    txt(g, '质量 →', x1, y + 110, C.fg3, fnt(600, 22), 'right');
    return;
  }
  hdr(g, R, '迪欧西–彭罗斯模型', '彭罗斯 1996；迪欧西 1980 年代后期');
  al(g, pop(st.tk, .5), () => { rr(g, R.x + 300, R.y + 240, 1100, 200, 20, 'rgba(255,210,122,.08)', C.gold, 3); eq(g, 'τ  ≈  ħ / E_G', R.x + 850, R.y + 340, C.gold, 76); });
  al(g, pop(st.tk, 3), () => { txt(g, 'τ：坍缩时间　　ħ：约化普朗克常数　　E_G：两种质量分布之间的引力自能', R.x + 850, R.y + 500, C.fg2, fnt(600, 26), 'center'); });
  al(g, pop(st.tk, 9), () => { rr(g, R.x + 300, R.y + 580, 1100, 120, 18, 'rgba(14,20,36,.95)', C.p, 2); txt(g, '彭罗斯还猜测：这种坍缩是非算法的', R.x + 850, R.y + 640, C.p, fnt(800, 32), 'center'); });
};

AN.brain = (g, t, R, st) => {
  const bx = R.x + 420, by = R.y + 470;
  if (st.k === 0) {
    hdr(g, R, '真实的大脑', '近千亿个神经元');
    drawBrain(g, bx, by, 1.6);
    const areas = [[-150, 40, '视觉（后部）', C.b], [20, -150, '运动 / 体感带', C.o], [170, 20, '语言（多在左半球）', C.g]];
    areas.forEach(([dx, dy, s, col], i) => al(g, pop(st.tk, 1 + i * 1.5), () => { glow(g, bx + dx, by + dy, 70, col + '66'); dot(g, bx + dx, by + dy, 10, col); txt(g, s, bx + dx * (dy < 0 ? 1 : 2.4), by + dy + (dy < 0 ? -110 : 150), col, fnt(800, 26), 'center'); line(g, [[bx + dx, by + dy], [bx + dx * (dy < 0 ? 1 : 2.4), by + dy + (dy < 0 ? -90 : 125)]], col, 2); }));
    return;
  }
  hdr(g, R, '小脑：神经元最多，却无意识', '');
  drawBrain(g, bx, by - 30, 1.4, 'rgba(199,155,255,.5)'); g.save(); g.fillStyle = 'rgba(95,224,160,.25)'; g.strokeStyle = C.g; g.lineWidth = 4; g.beginPath(); g.ellipse(bx + 150, by + 170, 120, 70, 0, 0, TAU); g.fill(); g.stroke(); g.restore(); txt(g, '小脑', bx + 150, by + 175, C.g, fnt(800, 28), 'center');
  al(g, pop(st.tk, 1), () => bars(g, R.x + 900, R.y + 250, 700, 360, [['大脑皮层', 16, C.p, '约 160 亿'], ['小脑', 69, C.g, '约 690 亿']], st.tk - 1, { max: 75, fmt: v => v + '0 亿' }));
  al(g, pop(st.tk, 6), () => txt(g, '弹琴、骑车：精细，却几乎完全无意识', R.x + 900, R.y + 740, C.fg, fnt(700, 28)));
};

AN.split = (g, t, R, st) => {
  const lx = R.x + 100, w = R.w / 2 - 140, rx = R.x + R.w / 2 + 40;
  hdr(g, R, '裂脑与盲视', '');
  rr(g, lx, R.y + 210, w, 560, 20, 'rgba(14,20,36,.95)', C.p, 2); txt(g, '裂脑', lx + 30, R.y + 260, C.p, fnt(900, 36));
  const bx = lx + w / 2, by = R.y + 450, gap = 30 * pop(t, 1);
  g.save(); g.translate(-gap, 0); g.beginPath(); g.rect(0, 0, bx, 1080); g.clip(); drawBrain(g, bx, by, 1.1); g.restore(); g.save(); g.translate(gap, 0); g.beginPath(); g.rect(bx, 0, 1920, 1080); g.clip(); drawBrain(g, bx, by, 1.1); g.restore();
  al(g, pop(t, 1.5), () => { txt(g, '切断胼胝体', bx, by + 170, C.r, fnt(700, 24), 'center'); txt(g, '两个半球像各有意识', bx, by + 230, C.fg, fnt(700, 26), 'center'); });
  al(g, pop(t, 5), () => { rr(g, rx, R.y + 210, w, 560, 20, 'rgba(14,20,36,.95)', C.b, 2); txt(g, '盲视', rx + 30, R.y + 260, C.b, fnt(900, 36));
    person(g, rx + 160, R.y + 470, C.fg2, 2.2); txt(g, '“我什么也看不见”', rx + 160, R.y + 600, C.fg2, fnt(700, 24), 'center');
    for (let i = 0; i < 3; i++) { const lit = Math.floor(t) % 3 === i; dot(g, rx + 420 + i * 110, R.y + 400, 22, lit ? C.gold : 'rgba(163,174,195,.2)'); }
    txt(g, '猜光点位置：远超随机', rx + 530, R.y + 480, C.ok, fnt(800, 26), 'center'); txt(g, '看见 ≠ 意识到看见', rx + w / 2, R.y + 700, C.gold, fnt(800, 30), 'center'); });
};

AN.neuron = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '神经元：加总、超过阈值就发放', '但大脑一直在改写自己（可塑性）');
    const nx = R.x + 520, ny = R.y + 470;
    for (let i = 0; i < 9; i++) { const a = Math.PI * (.6 + i * .1), x0 = nx + Math.cos(a) * 340, y0 = ny + Math.sin(a) * 300; const wgt = .5 + .5 * Math.sin(t * .8 + i); line(g, [[x0, y0], [nx, ny]], `rgba(199,155,255,${.25 + .6 * wgt})`, 2 + 5 * wgt); const f = ((t * .7 + HSH(i, 1)) % 1); dot(g, LERP(x0, nx, f), LERP(y0, ny, f), 5, C.gold); }
    dot(g, nx, ny, 50, C.p); txt(g, 'Σ', nx, ny, '#0B1020', fnt(900, 50, 'serif'), 'center');
    const fire = (t % 2) < .3; line(g, [[nx + 50, ny], [nx + 520, ny]], fire ? C.gold : C.p, fire ? 8 : 4); if (fire) glow(g, nx + 50 + ((t % 2) / .3) * 470, ny, 40, 'rgba(255,210,122,.6)');
    al(g, pop(st.tk, 6), () => card(g, R.x + 1180, R.y + 230, 480, 280, '可塑性', ['突触时强时弱（线的粗细）', '连接不断生长和消失', '不是线路固定的机器'], C.gold, 1));
    return;
  }
  hdr(g, R, '量子效应能进入大脑吗？', '');
  const ex = R.x + 300, ey = R.y + 460;
  g.save(); g.fillStyle = 'rgba(233,238,247,.08)'; g.strokeStyle = C.fg2; g.lineWidth = 3; g.beginPath(); g.arc(ex, ey, 160, 0, TAU); g.fill(); g.stroke(); g.fillStyle = '#000'; g.beginPath(); g.arc(ex + 100, ey, 40, 0, TAU); g.fill(); g.restore(); txt(g, '视网膜', ex - 60, ey + 200, C.fg2, fnt(700, 24), 'center');
  const f = (st.tk * .5) % 1; dot(g, LERP(ex + 600, ex + 120, f), ey, 8, C.gold); txt(g, '单个光子', ex + 500, ey - 40, C.gold, fnt(700, 24), 'center');
  al(g, pop(st.tk, 3), () => { for (let i = 0; i < 3; i++) arrow(g, ex - 100, ey + i * 20 - 20, ex - 260, ey + i * 50 - 60, C.ok, 3); txt(g, '放大成神经信号', ex - 180, ey - 120, C.ok, fnt(800, 26), 'center'); });
  al(g, pop(st.tk, 7), () => card(g, R.x + 960, R.y + 230, 700, 300, '量子计算机（多伊奇 1985）', ['利用叠加并行计算', '能算的：图灵机原则上也能算', '带来的是速度，不是超越算法'], C.b, 1));
};

AN.judge = (g, t, R, st) => {
  hdr(g, R, '意识有什么用？', '彭罗斯：判断 —— 看出什么是对的、什么有意义');
  const cx = R.x + R.w / 2, cy = R.y + 470;
  for (let i = 0; i < 120; i++) { const a = HSH(i, 1) * TAU, r = 120 + HSH(i, 2) * 300; const hit = i === 37; dot(g, cx + Math.cos(a) * r * 1.4, cy + Math.sin(a) * r * .8, hit ? 12 : 4, hit ? C.gold : 'rgba(163,174,195,.35)'); }
  al(g, pop(t, 3), () => { const a = HSH(37, 1) * TAU, r = 120 + HSH(37, 2) * 300, x = cx + Math.cos(a) * r * 1.4, y = cy + Math.sin(a) * r * .8; glow(g, x, y, 60, 'rgba(255,210,122,.6)'); arrow(g, cx, cy, x, y, C.gold, 4); });
  drawBrain(g, cx, cy, .5);
  al(g, pop(t, 8), () => { rr(g, cx - 450, R.y + 720, 900, 80, 16, 'rgba(14,20,36,.95)', C.gold, 2); txt(g, '彭罗斯认为：这正是算法做不到的', cx, R.y + 760, C.gold, fnt(800, 30), 'center'); });
};

AN.aha = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '庞加莱的灵感', '踏上公共马车的一刻');
    const x = R.x + 200, y = R.y + 520; rr(g, x, y - 120, 360, 160, 20, 'rgba(255,178,92,.15)', C.o, 3); dot(g, x + 80, y + 60, 36, '#333'); dot(g, x + 280, y + 60, 36, '#333'); txt(g, '公共马车', x + 180, y - 40, C.o, fnt(800, 28), 'center');
    const px = LERP(x - 120, x + 20, SS(CL((st.tk - 2) / 2))); person(g, px, y - 20, C.gold, 2);
    al(g, pop(st.tk, 4.5), () => { glow(g, px, y - 160, 90, 'rgba(255,210,122,.6)'); txt(g, '!', px, y - 160, C.gold, fnt(900, 80, 'serif'), 'center'); card(g, R.x + 820, R.y + 250, 800, 240, '突然出现，而且立刻确信', ['苦思不得 → 去旅行 → 答案自己冒出来', '事后验证，果然是对的'], C.gold, 1); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '彭罗斯的经历（1964 年秋）', '过马路时闪过的念头 → 俘获面');
    const y = R.y + 470; rr(g, R.x + 100, y - 60, 700, 120, 0, 'rgba(163,174,195,.1)'); for (let i = 0; i < 6; i++) rr(g, R.x + 120 + i * 120, y - 8, 70, 16, 2, 'rgba(233,238,247,.6)');
    const px = LERP(R.x + 200, R.x + 600, CL(st.tk / 4)); person(g, px, y - 100, C.gold, 1.8); person(g, px + 70, y - 100, C.fg2, 1.8);
    al(g, pop(st.tk, 2), () => { glow(g, px, y - 220, 50, 'rgba(255,210,122,.5)'); txt(g, '💡', px, y - 220, C.gold, fnt(700, 44), 'center'); });
    al(g, pop(st.tk, 6), () => { const sx = R.x + 1240, sy = R.y + 420; for (let i = 0; i < 4; i++) { g.save(); g.strokeStyle = `rgba(255,107,107,${.9 - i * .2})`; g.lineWidth = 3; g.beginPath(); g.ellipse(sx, sy, 160 - i * 30, 60 - i * 10, 0, 0, TAU); g.stroke(); g.restore(); } for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; arrow(g, sx + Math.cos(a) * 170, sy + Math.sin(a) * 66, sx + Math.cos(a) * 120, sy + Math.sin(a) * 46, C.r, 2, 8); } txt(g, '俘获面：向外的光也在收缩', sx, sy + 130, C.r, fnt(800, 28), 'center'); txt(g, '→ 1965 年奇点定理', sx, sy + 180, C.gold, fnt(800, 28), 'center'); });
    return;
  }
  hdr(g, R, '不靠语言的思维', '图像 · 直觉 · 几何');
  al(g, pop(st.tk, .3), () => quote(g, R.x + 100, R.y + 230, 900, '语言……在我的思维机制中似乎不起任何作用。', '爱因斯坦（致阿达马的信）', C.gold, 1, 34));
  al(g, pop(st.tk, 4), () => { const x = R.x + 1250, y = R.y + 470; cone(g, x, y, 120, .3, C.p, 1, false); g.save(); g.strokeStyle = C.b; g.lineWidth = 3; g.beginPath(); g.arc(x, y, 180, 0, TAU); g.stroke(); g.restore(); txt(g, '彭罗斯：用几何图形思考', x, y + 240, C.fg, fnt(800, 28), 'center'); });
};

AN.libet = (g, t, R, st) => {
  const x0 = R.x + 120, x1 = R.x + R.w - 120, y = R.y + 420, X = s => LERP(x0, x1, (s + 1.5) / 2.5);
  hdr(g, R, '意识慢了半拍', st.k === 0 ? '科恩休伯（1965）· 李贝特（1980 年代）' : '可我们并不觉得自己慢');
  line(g, [[x0, y], [x1, y]], C.fg3, 3); [-1.5, -1, -.5, 0, .5, 1].forEach(s => { line(g, [[X(s), y - 10], [X(s), y + 10]], C.fg3, 2); txt(g, (s > 0 ? '+' : '') + s + ' 秒', X(s), y + 40, C.fg3, fnt(600, 22, 'mono'), 'center'); });
  // 准备电位曲线
  const pts = []; for (let s = -1.5; s <= 0; s += .02) pts.push([X(s), y - 60 - 140 * Math.max(0, (s + 1.1) / 1.1) ** 2]);
  const T = st.k === 0 ? st.tk : 99;
  al(g, pop(T, .5), () => { line(g, pts, C.p, 4); txt(g, '准备电位', X(-.9), y - 120, C.p, fnt(800, 26), 'center'); dot(g, X(0), y, 12, C.gold); txt(g, '手指动', X(0), y - 230, C.gold, fnt(800, 26), 'center'); });
  al(g, pop(T, 6), () => { rr(g, X(0), y + 90, X(.5) - X(0), 40, 6, 'rgba(92,180,255,.35)', C.b, 2); txt(g, '刺激持续约半秒，才会意识到', X(.25), y + 160, C.b, fnt(800, 26), 'center'); });
  if (st.k === 1) al(g, pop(st.tk, .5), () => { arrow(g, X(.5), y + 220, X(0), y + 220, C.gold, 4); txt(g, '感觉上：刺激一来就知道了', X(.25), y + 262, C.gold, fnt(800, 26), 'center'); card(g, R.x + 100, R.y + 680, 900, 130, '彭罗斯的推测', ['意识也许不是在某个确定时刻发生的经典事件'], C.fg2, 1); });
};

AN.quasi = (g, t, R, st) => {
  g.save(); g.beginPath(); g.rect(R.x + 860, R.y + 160, R.w - 860, R.h - 200); g.clip(); penroseDraw(g, R.x + 860 + (R.w - 860) / 2, R.y + 460, 36, st.k === 0 ? CL(t / 10) : 1, .9); g.restore();
  if (st.k === 0) {
    hdr(g, R, '准晶体', '谢赫特曼 1984 年报告：五重对称的合金');
    al(g, pop(st.tk, 1), () => { const cx = R.x + 360, cy = R.y + 470; for (let i = 0; i < 10; i++) { const a = i / 10 * TAU; dot(g, cx + Math.cos(a) * 200, cy + Math.sin(a) * 200, 12, C.gold); dot(g, cx + Math.cos(a + .31) * 110, cy + Math.sin(a + .31) * 110, 9, C.b); } dot(g, cx, cy, 14, C.fg); txt(g, '十个亮点的衍射图（示意）', cx, cy + 270, C.fg2, fnt(700, 24), 'center'); });
    al(g, pop(st.tk, 8), () => card(g, R.x + 100, R.y + 100, 700, 150, '普通晶体不可能有五重对称', ['彭罗斯镶嵌却恰好有'], C.gold, 1));
    return;
  }
  hdr(g, R, '彭罗斯的设想', '在叠加中同时试探多种可能，再由引力约化选出一种');
  const steps = [['局部拼接容易拼错', C.r], ['得“看到远处”才能放对', C.o], ['量子叠加：同时试探', C.p], ['引力约化：选出一种', C.gold], ['突触生长也许同理？', C.g]];
  steps.forEach(([s, col], i) => al(g, pop(st.tk, .3 + i * 2), () => { const y = R.y + 250 + i * 105; rr(g, R.x + 100, y - 38, 680, 76, 14, 'rgba(14,20,36,.95)', col, 2); txt(g, s, R.x + 130, y, C.fg, fnt(700, 28)); }));
};

AN.after = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '书出版之后：争论', '');
    book(g, R.x + 100, R.y + 230, 340, 440, '心灵的影子', 'Shadows of the Mind · 1994', C.p, pop(st.tk, .3));
    al(g, pop(st.tk, 3), () => card(g, R.x + 520, R.y + 230, 1100, 200, '彭罗斯', ['把哥德尔论证写得更严格，逐条回应批评'], C.p, 1));
    al(g, pop(st.tk, 7), () => card(g, R.x + 520, R.y + 470, 1100, 200, '费弗曼等逻辑学家', ['论证的关键一步并不成立（如“我们知道自己可靠”）'], C.r, 1));
    return;
  }
  hdr(g, R, '共形循环宇宙学（2010）', '一个宇宙的遥远未来 → 下一个宇宙的大爆炸');
  const cy = R.y + 470; for (let i = 0; i < 3; i++) { const x = R.x + 300 + i * 520; g.save(); g.strokeStyle = [C.b, C.gold, C.p][i]; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 200, cy + 160); g.quadraticCurveTo(x, cy - 260, x + 200, cy + 160); g.stroke(); g.restore(); txt(g, ['上一个宇宙', '我们的宇宙', '下一个宇宙'][i], x, cy + 210, C.fg2, fnt(700, 26), 'center'); if (i < 2) { glow(g, x + 260, cy + 160, 40, 'rgba(255,210,122,.5)'); } }
  al(g, pop(st.tk, 7), () => { rr(g, R.x + 100, R.y + 700, R.w - 200, 80, 14, 'rgba(14,20,36,.95)', C.fg3, 2); txt(g, '声称在微波背景里找到痕迹（“霍金点”等）—— 多数宇宙学家不认同', R.x + R.w / 2, R.y + 740, C.fg2, fnt(700, 26), 'center'); });
};

AN.orch = (g, t, R, st) => {
  const mx = R.x + 420, my = R.y + 470;
  // 微管：13 列管蛋白
  for (let j = 0; j < 14; j++) for (let i = 0; i < 6; i++) { const x = mx - 260 + j * 40, y = my - 150 + i * 60 + (j % 2) * 20, s = .5 + .5 * Math.sin(t * 2 + i + j * .7); rr(g, x, y, 34, 26, 10, `rgba(${Math.round(LERP(92, 255, s))},${Math.round(LERP(180, 210, s))},${Math.round(LERP(255, 122, s))},.7)`); }
  txt(g, '微管（示意）', mx, my + 250, C.fg2, fnt(700, 26), 'center');
  if (st.k === 0) {
    hdr(g, R, 'Orch-OR：协调客观约化', '哈梅罗夫 + 彭罗斯 · 1990 年代中期');
    al(g, pop(st.tk, 2), () => card(g, R.x + 900, R.y + 230, 720, 220, '哈梅罗夫（麻醉学家）', ['读了《皇帝新脑》后给彭罗斯写信', '候选地点：神经元里的微管'], C.g, 1));
    al(g, pop(st.tk, 7), () => card(g, R.x + 900, R.y + 490, 720, 200, '设想', ['微管中的量子叠加 → 引力约化 → 意识的瞬间'], C.gold, 1));
    return;
  }
  hdr(g, R, '泰格马克（2000）：退相干太快', '大脑温暖潮湿');
  al(g, pop(st.tk, .5), () => { const x0 = R.x + 900, y = R.y + 420, X = e => LERP(x0, x0 + 720, (e + 20) / 20); line(g, [[x0, y], [x0 + 720, y]], C.fg3, 3); [-20, -13, -3, 0].forEach(e => { line(g, [[X(e), y - 10], [X(e), y + 10]], C.fg3, 2); txt(g, '10^' + e + ' 秒', X(e), y + 40, C.fg3, fnt(600, 20, 'mono'), 'center'); });
    rr(g, X(-20), y - 70, X(-13) - X(-20), 40, 6, 'rgba(255,107,107,.4)', C.r, 2); txt(g, '退相干', X(-16.5), y - 100, C.r, fnt(800, 26), 'center');
    rr(g, X(-3), y - 70, X(0) - X(-3), 40, 6, 'rgba(95,211,154,.4)', C.ok, 2); txt(g, '神经活动', X(-1.5), y - 100, C.ok, fnt(800, 26), 'center'); });
  al(g, pop(st.tk, 6), () => card(g, R.x + 900, R.y + 560, 720, 170, '哈梅罗夫等人反驳', ['认为估算模型不对；争论至今未平息'], C.fg2, 1));
};

AN.gs = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '格兰萨索地下实验（2020）', '寻找迪欧西–彭罗斯模型预言的微弱辐射');
    const cx = R.x + 420, cy = R.y + 470;
    g.save(); g.fillStyle = 'rgba(120,100,80,.35)'; g.beginPath(); g.moveTo(cx - 380, cy + 260); g.lineTo(cx - 60, cy - 240); g.lineTo(cx + 120, cy - 120); g.lineTo(cx + 380, cy + 260); g.fill(); g.restore(); txt(g, '约 1400 米岩层', cx, cy - 60, C.fg2, fnt(700, 24), 'center');
    rr(g, cx - 60, cy + 150, 120, 80, 10, 'rgba(92,180,255,.3)', C.b, 2); txt(g, '锗探测器', cx, cy + 260, C.b, fnt(700, 22), 'center');
    for (let i = 0; i < 8; i++) { const f = ((t * .5 + HSH(i, 1)) % 1); if (f < .6) dot(g, cx - 300 + HSH(i, 2) * 600, LERP(R.y + 200, cy - 200 + HSH(i, 3) * 60, f / .6), 4, C.r); }
    al(g, pop(st.tk, 3), () => { const x0 = R.x + 900, y0 = R.y + 640; line(g, [[x0, y0], [x0 + 700, y0]], C.fg3, 2); line(g, [[x0, y0], [x0, y0 - 340]], C.fg3, 2); txt(g, '能量', x0 + 700, y0 + 30, C.fg3, fnt(600, 20), 'right'); txt(g, '计数', x0 - 10, y0 - 330, C.fg3, fnt(600, 20), 'right');
      const pr = [], ob = []; for (let i = 0; i <= 50; i++) { pr.push([x0 + i * 14, y0 - 300 * Math.exp(-i / 18)]); ob.push([x0 + i * 14, y0 - 60 - 20 * HSH(i, 9)]); } line(g, pr, C.r, 3, [8, 6]); line(g, ob, C.ok, 3); txt(g, '无参数 DP 模型预言', x0 + 140, y0 - 280, C.r, fnt(700, 22)); txt(g, '实测', x0 + 600, y0 - 110, C.ok, fnt(700, 22)); });
    al(g, pop(st.tk, 8), () => card(g, R.x + 900, R.y + 680, 700, 120, '结论', ['排除最简单（无参数）版本；其他版本仍存活'], C.gold, 1));
    return;
  }
  hdr(g, R, '韦尔斯利学院大鼠实验（2024）', '微管稳定剂 → 麻醉后失去意识的时间推迟');
  al(g, pop(st.tk, .5), () => bars(g, R.x + 100, R.y + 260, 700, 380, [['对照组', 60, C.fg2], ['用药组', 75, C.g]], st.tk - .5, { max: 80, fmt: () => '' }));
  txt(g, '失去翻正反射所需时间（示意，非实测数值）', R.x + 100, R.y + 230, C.fg3, fnt(600, 22));
  al(g, pop(st.tk, 4), () => card(g, R.x + 900, R.y + 230, 720, 200, '作者的解读', ['支持：麻醉作用于微管'], C.g, 1));
  al(g, pop(st.tk, 8), () => card(g, R.x + 900, R.y + 470, 720, 200, '但是', ['离“意识来自量子过程”还有很长的路', '多数研究者仍偏向经典解释'], C.r, 1));
};

AN.nobel = (g, t, R, st) => {
  hdr(g, R, '2020 年诺贝尔物理学奖', '');
  medal(g, R.x + 300, R.y + 400, 140, '彭', '罗杰·彭罗斯', '获奖时 89 岁', C.gold, pop(t, .3));
  al(g, pop(t, 2), () => quote(g, R.x + 620, R.y + 240, 1000, '发现黑洞的形成是广义相对论的可靠预言', '诺贝尔委员会', C.gold, 1, 34));
  al(g, pop(t, 6), () => card(g, R.x + 620, R.y + 520, 1000, 200, '获奖工作', ['1965 年《引力坍缩与时空奇点》：用到俘获面', '另一半奖给根策尔与盖兹（银河系中心黑洞）'], C.b, 1));
};

AN.aitl = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '电脑的巨变', '');
    const x0 = R.x + 80, x1 = R.x + R.w - 80, y = R.y + 360, X = v => LERP(x0, x1, (v - 1989) / 37);
    line(g, [[x0, y], [x1, y]], C.line2, 4); txt(g, '1989 本书出版', x0, y - 40, C.gold, fnt(700, 22));
    const ev = [[1997, '深蓝胜卡斯帕罗夫', C.b], [2016, '阿尔法狗胜李世石', C.g], [2022, '大语言模型进入公众生活', C.p], [2025, 'IMO 金牌水平', C.gold]];
    ev.forEach(([v, s, col], i) => al(g, pop(st.tk, 1 + i * 2.5), () => { dot(g, X(v), y, 12, col); txt(g, String(v), X(v), y + 44, col, fnt(800, 28, 'mono'), 'center'); const byy = y + 80 + i * 95; line(g, [[X(v), y + 60], [X(v), byy]], col, 2, [4, 5]); }));
    ev.forEach(([v, s, col], i) => al(g, pop(st.tk, 1 + i * 2.5), () => { const bx = Math.min(X(v) - 180, R.x + R.w - 380), byy = y + 80 + i * 95; rr(g, bx, byy, 360, 76, 14, 'rgb(14,20,36)', col, 2); txt(g, s, bx + 180, byy + 38, C.fg, fnt(700, 24), 'center'); }));
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '彭罗斯的立场没有变', '');
    al(g, pop(st.tk, .3), () => { bot(g, R.x + 300, R.y + 420, C.p, 4); rr(g, R.x + 420, R.y + 260, 420, 90, 18, 'rgba(199,155,255,.1)', C.p, 2); txt(g, '对答如流 · 写程序 · 解题', R.x + 630, R.y + 305, C.p, fnt(700, 26), 'center'); });
    al(g, pop(st.tk, 3), () => quote(g, R.x + 100, R.y + 560, 1500, '这些设备没有意识，也不会有意识。', '彭罗斯，2025（大意）', C.gold, 1, 32));
    al(g, pop(st.tk, 7), () => card(g, R.x + 960, R.y + 230, 680, 180, '理由', ['哥德尔定理：理解不是算法'], C.gold, 1));
    return;
  }
  hdr(g, R, '量子计算机：从设想到芯片', '');
  al(g, pop(st.tk, .3), () => { const cx = R.x + 400, cy = R.y + 470; rr(g, cx - 200, cy - 200, 400, 400, 20, 'rgba(14,20,36,.95)', C.b, 3); for (let i = 0; i < 11; i++) for (let j = 0; j < 10; j++) if (i * 10 + j < 105) dot(g, cx - 170 + i * 34, cy - 160 + j * 34, 7, `rgba(92,180,255,${.4 + .6 * (.5 + .5 * Math.sin(t * 2 + i + j))})`); txt(g, '谷歌“柳树”2024 · 105 个量子比特', cx, cy + 250, C.b, fnt(800, 26), 'center'); });
  al(g, pop(st.tk, 4), () => card(g, R.x + 900, R.y + 240, 720, 260, '但是', ['能算的问题，图灵机原则上也能算', '它改变速度，不改变可计算的边界', '不是彭罗斯要找的非算法过程'], C.r, 1));
};

AN.final = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '全书的路线', '');
    const P = [['孩子的提问', C.gold], ['图灵机', C.b], ['哥德尔', C.p], ['牛顿 · 爱因斯坦', C.o], ['量子力学', C.p], ['宇宙的起点', C.b], ['大脑与意识', C.g]];
    P.forEach(([s, col], i) => al(g, pop(st.tk, .5 + i * 1.1), () => { const a = Math.PI * (1 - i / 6), x = cx + Math.cos(a) * 700, y = R.y + 640 - Math.sin(a) * 380; dot(g, x, y, 14, col); txt(g, s, x, y + (i === 0 || i === 6 ? 50 : -40), col, fnt(800, 30), 'center'); if (i) { const a0 = Math.PI * (1 - (i - 1) / 6); line(g, [[cx + Math.cos(a0) * 700, R.y + 640 - Math.sin(a0) * 380], [x, y]], 'rgba(233,238,247,.3)', 3, [6, 8]); } }));
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '结论与问题', '');
    al(g, pop(st.tk, .3), () => card(g, R.x + 100, R.y + 230, 760, 320, '彭罗斯的结论（少数派）', ['心灵超越算法', '意识与量子引力有关', '多处有争议，部分已被实验约束'], C.fg2, 1));
    al(g, pop(st.tk, 5), () => card(g, R.x + 920, R.y + 230, 720, 320, '绕不开的问题', ['理解和感受到底是什么？', '物理定律里有没有它们的位置？'], C.gold, 1, true));
    return;
  }
  bigpc(g, cx + 300, R.y + 400, .8, .5);
  al(g, pop(st.tk, .5), () => { person(g, cx - 300, R.y + 560, C.gold, 2); rr(g, cx - 260, R.y + 330, 400, 90, 20, 'rgba(255,210,122,.12)', C.gold, 2); txt(g, '你感觉怎么样？', cx - 60, R.y + 375, C.gold, fnt(800, 38), 'center'); });
  al(g, pop(st.tk, 5), () => txt(g, '感谢观看', cx, R.y + 760, C.fg, fnt(900, 48, 'serif'), 'center'));
};

AN.recap4 = AN.final;
