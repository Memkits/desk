// 第二集画面（非地图）
Object.assign(AN, {
  kepler: (g, t, R, st) => {
    hdr(g, R, st.k === 0 ? '开普勒第一定律：椭圆轨道' : '第二、第三定律', st.k === 0 ? '《新天文学》· 1609 · 布拉格' : '等面积（1609）· 周期² ∝ 半长轴³（1619 · 林茨）');
    const cx = R.x + 480, cy = R.y + 450, a = 360, b = 260, c = Math.sqrt(a * a - b * b), F = [cx + c, cy];
    g.save(); g.strokeStyle = C.fg3; g.lineWidth = 2.5; g.beginPath(); g.ellipse(cx, cy, a, b, 0, 0, TAU); g.stroke(); g.restore();
    glow(g, F[0], F[1], 70, 'rgba(255,210,122,.6)'); dot(g, F[0], F[1], 24, C.gold); dot(g, cx - c, cy, 6, C.fg3); txt(g, '焦点', cx - c, cy + 30, C.fg3, fnt(600, 22), 'center');
    // 用开普勒方程推进：M = E - e sinE
    const e = c / a, T = 8, pos = tt => { const M = TAU * tt / T; let E = M; for (let i = 0; i < 8; i++) E = M + e * Math.sin(E); return [cx + a * Math.cos(E), cy + b * Math.sin(E)]; };
    const tt = st.k === 0 ? t : st.tk; const P = pos(tt);
    if (st.k >= 1) { [0, 4].forEach((t0, j) => { const s0 = t0 + Math.floor(tt / T) * T; if (tt < t0) return; g.save(); g.fillStyle = j ? 'rgba(95,224,160,.35)' : 'rgba(92,180,255,.35)'; g.beginPath(); g.moveTo(...F); for (let q = 0; q <= 20; q++) g.lineTo(...pos(s0 + Math.min(1, (tt - t0) / 1) * q / 20)); g.closePath(); g.fill(); g.restore(); });
      notes(g, R.x + 1000, R.y + 240, [['相等时间扫过相等面积', .5, C.gold], ['近日点快，远日点慢', 1.6], ['T² ∝ a³（第三定律）', 3, C.fg], ['地球 1 年 · 火星 1.88 年 · 木星 11.9 年', 4.2, C.fg2, 26]], st.tk); }
    else notes(g, R.x + 1000, R.y + 240, [['行星沿椭圆运动', .8], ['太阳在一个焦点上', 2, C.gold], ['基于第谷多年的火星观测', 3.4, C.fg2]], t);
    ball(g, P[0], P[1], 18, C.b); line(g, [F, P], C.fg2, 1.5, [5, 5]);
  },
  incline: (g, t, R, st) => {
    const late = st.bi >= 4;
    hdr(g, R, late ? '抛体：水平匀速 + 竖直加速 = 抛物线' : '伽利略的斜面实验', late ? '《关于两门新科学的对话》· 1638 · 阿切特里' : '约 1604 · 帕多瓦 · 距离 ∝ 时间²');
    if (late) { const ox = R.x + 120, oy = R.y + 220; rr(g, ox - 80, oy, 80, 520, 4, C.fg3 + '66'); const u = CL(st.tk / 3.5) * 1.15;
      for (let i = 0; i <= 8; i++) { const tt = i * .16; if (tt > u) break; const x = ox + tt * 560, y = oy + tt * tt * 330; dot(g, x, y, 12, C.b); line(g, [[x, oy - 30], [x, oy - 10]], C.g, 3); line(g, [[ox - 40, y], [ox - 20, y]], C.r, 3); }
      notes(g, R.x + 1040, R.y + 240, [['水平方向：每段间隔相等（匀速）', 1, C.g], ['竖直方向：1 : 3 : 5 : 7 …（匀加速）', 2.2, C.r], ['合起来：抛物线', 3.4, C.gold]], st.tk); return; }
    const x0 = R.x + 80, y0 = R.y + 200, x1 = R.x + 1000, y1 = R.y + 640, L = Math.hypot(x1 - x0, y1 - y0);
    g.save(); g.fillStyle = 'rgba(255,178,92,.18)'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.lineTo(x0, y1); g.fill(); g.restore(); line(g, [[x0, y0], [x1, y1]], C.o, 5);
    const T = 4, tt = Math.min(T, Math.max(0, t - .8)), d = (tt / T) ** 2;
    [1, 2, 3, 4].forEach(i => { const f = (i / T) ** 2, px = LERP(x0, x1, f), py = LERP(y0, y1, f); line(g, [[px, py - 16], [px, py + 16]], C.fg2, 3); txt(g, `${i} 秒`, px + 10, py - 36, C.fg2, fnt(600, 22)); txt(g, `${i * i}`, px - 30, py + 40, C.gold, fnt(800, 26, 'mono')); });
    const bx = LERP(x0, x1, d), by = LERP(y0, y1, d); ball(g, bx + 14, by - 22, 22, '#c98b4a', '#ffe0b0');
    // 水钟
    const wx = R.x + 1200, wy = R.y + 200; rr(g, wx, wy, 160, 200, 10, 'rgba(92,180,255,.15)', C.b, 2); rr(g, wx + 5, wy + 5 + 190 * (tt / T) * .5, 150, 190 - 190 * (tt / T) * .5, 8, 'rgba(92,180,255,.45)');
    rr(g, wx + 30, wy + 300, 100, 120, 6, null, C.b, 2); rr(g, wx + 34, wy + 416 - 112 * tt / T, 92, 112 * tt / T, 4, 'rgba(92,180,255,.5)'); if (tt > 0 && tt < T) line(g, [[wx + 80, wy + 205], [wx + 80, wy + 410 - 112 * tt / T]], C.b, 3);
    txt(g, '水钟：称流出的水来计时', wx - 20, wy + 470, C.fg2, fnt(600, 24));
    al(g, pop(t, 5.5, .6), () => txt(g, '1 : 4 : 9 : 16 —— 距离与时间的平方成正比', R.x + 80, R.y + 760, C.gold, fnt(800, 32)));
  },
  barometer: (g, t, R, st) => {
    const k1 = st.k >= 1;
    hdr(g, R, k1 ? '多姆山实验：越高，水银柱越低' : '托里拆利的水银管', k1 ? '1648 · 帕斯卡设计、佩里耶执行 · 克莱蒙' : '1644 · 佛罗伦萨');
    const bx = R.x + 260, by = R.y + 680; rr(g, bx - 120, by - 40, 240, 90, 10, 'rgba(160,170,190,.5)', C.fg3, 2);
    const u = k1 ? 1 : SS((t - 1) / 2), h = LERP(560, 380, u) - (k1 ? 60 * SS((st.tk - 1) / 2) : 0);
    rr(g, bx - 22, by - 600, 44, 620, 20, 'rgba(255,255,255,.06)', C.fg2, 2); rr(g, bx - 18, by - h, 36, h + 20, 16, '#b8c0cc');
    al(g, u, () => { txt(g, '真空', bx + 50, by - 560 + (560 - h) / 2 - 20, C.fg3, fnt(600, 24)); line(g, [[bx + 40, by - h], [bx + 160, by - h]], C.gold, 2, [6, 4]); txt(g, k1 ? '变低' : '约 76 厘米', bx + 170, by - h, C.gold, fnt(800, 28)); });
    for (let i = 0; i < 5; i++) al(g, u * .8, () => arrow(g, bx - 230 + i * 26, by - 220, bx - 150 + i * 6, by - 60, C.g, 2, 10)); al(g, u, () => txt(g, '空气的重量', bx - 300, by - 250, C.g, fnt(700, 26)));
    if (k1) { const mx = R.x + 800, my = R.y + 700; g.save(); g.fillStyle = 'rgba(95,224,160,.18)'; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx + 360, my - 420); g.lineTo(mx + 720, my); g.fill(); g.restore();
      const p = SS((st.tk - .5) / 2.5); person(g, LERP(mx + 60, mx + 340, p), LERP(my - 10, my - 410, p), C.o, 1.6);
      txt(g, '山脚', mx + 20, my + 34, C.fg2, fnt(600, 24)); txt(g, '山顶（约高 1000 米）', mx + 380, my - 440, C.fg2, fnt(600, 24));
      al(g, pop(st.tk, 3.2, .6), () => txt(g, '水银柱短了约 8 厘米', mx + 140, my - 200, C.gold, fnt(800, 30))); }
    else notes(g, R.x + 800, R.y + 240, [['倒插进水银槽，水银降到约 76 厘米', 1.5], ['上方留下真空', 2.8, C.fg], ['托住水银柱的是空气的重量（推测）', 4, C.gold]], t);
  },
  romer: (g, t, R, st) => {
    hdr(g, R, '罗默：光速有限', '1676 · 巴黎天文台 · 木卫一的掩食');
    const S = [R.x + 520, R.y + 450], rE = 180, J = [R.x + 1080, R.y + 450];
    glow(g, ...S, 80, 'rgba(255,210,122,.6)'); dot(g, ...S, 30, C.gold); g.save(); g.strokeStyle = C.line2; g.setLineDash([6, 6]); g.beginPath(); g.arc(...S, rE, 0, TAU); g.stroke(); g.restore();
    ball(g, ...J, 40, '#d9a066'); const io = [J[0] + 80 * Math.cos(t * 2), J[1] + 80 * Math.sin(t * 2)]; dot(g, ...io, 8, C.fg);
    g.save(); g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(J[0], J[1] - 40, 500, 80); g.restore(); txt(g, '木星的影子', J[0] + 130, J[1] + 70, C.fg3, fnt(600, 20));
    const k1 = st.k >= 1, ang = k1 ? Math.PI * SS(st.tk / 3) : Math.PI * .1 + t * .15; const E = [S[0] + rE * Math.cos(Math.PI - ang + Math.PI), S[1] + rE * Math.sin(Math.PI - ang + Math.PI)];
    ball(g, ...E, 16, C.b); line(g, [E, io], C.gold + '88', 2, [4, 6]);
    if (k1) { const near = [S[0] + rE, S[1]], far = [S[0] - rE, S[1]]; al(g, pop(st.tk, 3, .6), () => { line(g, [far, near], C.r, 5); txt(g, '多走地球轨道直径', S[0], S[1] + 60, C.r, fnt(800, 28), 'center'); txt(g, '约 22 分钟（罗默估计）', S[0], S[1] + 100, C.gold, fnt(800, 28), 'center'); });
      notes(g, R.x + 80, R.y + 700, [['惠更斯据此算出：光速约每秒 22 万公里（今测约 30 万）', 4.5, C.fg2, 26]], st.tk, 50); }
    else notes(g, R.x + 80, R.y + 680, [['地球远离木星时，木卫一出影的时刻比预报越来越晚', 1.5, C.fg, 28]], t, 50);
  },
  cannon: (g, t, R, st) => {
    hdr(g, R, '牛顿的大炮', '《原理》中的思想实验 · 月亮是一颗一直在下落的炮弹');
    const cx = R.x + 560, cy = R.y + 520, r = 250; g.save(); g.fillStyle = '#1d3b5c'; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill(); g.restore(); txt(g, '地球', cx, cy, C.fg2, fnt(700, 30), 'center');
    const top = [cx, cy - r - 60]; rr(g, cx - 10, cy - r - 60, 20, 60, 3, C.fg3);
    const vs = [.45, .6, .75, 1.0], cols = [C.r, C.o, C.g, C.gold];
    vs.forEach((v, i) => { const t0 = .6 + i * 1.6; if (t < t0) return; const u = CL((t - t0) / 1.5); // 简单数值积分
      let x = 0, y = -(r + 60), vx = v * Math.sqrt(1 / (r + 60)) * 100, vy = 0; const GM = 10000, pts = [[cx + x, cy + y]]; const N = Math.floor(800 * u);
      for (let s = 0; s < N; s++) { const d = Math.hypot(x, y); if (d < r) break; const ax = -GM * x / d ** 3, ay = -GM * y / d ** 3; vx += ax * .25; vy += ay * .25; x += vx * .25; y += vy * .25; pts.push([cx + x, cy + y]); }
      line(g, pts, cols[i], 3); dot(g, ...pts[pts.length - 1], 8, cols[i]); });
    const mo = [cx + 430 * Math.cos(t * .4 - 1), cy + 430 * Math.sin(t * .4 - 1)]; al(g, pop(t, 6, .6), () => { g.save(); g.strokeStyle = C.line2; g.setLineDash([5, 7]); g.beginPath(); g.arc(cx, cy, 430, 0, TAU); g.stroke(); g.restore(); ball(g, ...mo, 20, '#ccc'); txt(g, '月亮', mo[0] + 28, mo[1], C.fg2, fnt(700, 24)); });
    notes(g, R.x + 1120, R.y + 240, [['速度越快，落得越远', 1.5], ['快到一定程度，就绕地球一圈', 5.5, C.gold], ['苹果和月亮服从同一种力', 7, C.fg]], t);
  },
  newton3: (g, t, R, st) => {
    hdr(g, R, '《自然哲学的数学原理》', '1687 · 剑桥');
    const L = [['第一定律', '不受力的物体保持静止或匀速直线运动', C.b], ['第二定律', 'F = ma：力等于质量乘加速度', C.g], ['第三定律', '作用力与反作用力大小相等、方向相反', C.o], ['万有引力', 'F = G m₁m₂ / r²', C.gold]];
    L.forEach(([a, b, col], i) => al(g, pop(t, .5 + i * 1.2, .5), () => { const y = R.y + 170 + i * 120; rr(g, R.x + 40, y, 1060, 96, 14, 'rgba(14,20,36,.92)', col, 2); txt(g, a, R.x + 70, y + 48, col, fnt(800, 32)); txt(g, b, R.x + 270, y + 48, C.fg, fnt(600, 30)); }));
    al(g, pop(t, 6, .6), () => { const x = R.x + 1180; rr(g, x, R.y + 200, 480, 340, 16, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '推出', x + 30, R.y + 250, C.fg3, fnt(600, 26));
      ['苹果下落', '月球绕地', '开普勒三定律', '潮汐 · 岁差'].forEach((s, i) => txt(g, '✓ ' + s, x + 40, R.y + 310 + i * 56, C.fg, fnt(700, 30))); });
    al(g, pop(t, 8, .6), () => txt(g, '天上和地上，第一次服从同一套规律', R.x + 40, R.y + 760, C.gold, fnt(800, 34)));
  },
  lagrange: (g, t, R, st) => {
    hdr(g, R, '把力学写成方程', '欧拉 · 达朗贝尔 · 莫佩尔蒂 · 拉格朗日《分析力学》1788');
    const L = [['1736', '欧拉《力学》', '用微积分系统地写质点力学', C.b], ['1738', '丹尼尔·伯努利', '流速快的地方压强小', C.g], ['1743', '达朗贝尔原理', '动力学化为静力学', C.o], ['1744', '莫佩尔蒂', '最小作用量原理', C.p], ['1788', '拉格朗日', '《分析力学》：全书没有一张图', C.gold]];
    L.forEach(([y, a, b, col], i) => al(g, pop(t, .4 + i * .9, .5), () => { const yy = R.y + 170 + i * 108; txt(g, y, R.x + 60, yy + 40, C.fg3, fnt(700, 30, 'mono')); rr(g, R.x + 200, yy, 1200, 84, 12, 'rgba(14,20,36,.9)', col, 2); txt(g, a, R.x + 230, yy + 42, col, fnt(800, 30)); txt(g, b, R.x + 600, yy + 42, C.fg, fnt(600, 28)); }));
    al(g, pop(t, 5.5, .6), () => eq(g, 'd/dt (∂L/∂q̇) − ∂L/∂q = 0', R.x + 860, R.y + 760, C.gold, 44));
  },
  coulomb: (g, t, R, st) => {
    hdr(g, R, '库仑定律', '1785 · 巴黎 · 扭秤');
    const cx = R.x + 420, top = R.y + 160; line(g, [[cx, top], [cx, R.y + 420]], C.fg3, 2); const ang = .5 * Math.sin(t * 1.2) * Math.exp(-t * .15) + .2;
    const arm = 240, A = [cx + arm * Math.cos(ang), R.y + 420 + 50 * Math.sin(ang)], B = [cx - arm * Math.cos(ang), R.y + 420 - 50 * Math.sin(ang)]; line(g, [A, B], C.o, 4); ball(g, ...A, 18, C.r); ball(g, ...B, 14, '#888');
    ball(g, cx + 250, R.y + 470, 18, C.r); txt(g, '+', A[0], A[1], '#fff', fnt(800, 22), 'center'); txt(g, '+', cx + 250, R.y + 470, '#fff', fnt(800, 22), 'center');
    rr(g, cx - 330, R.y + 300, 660, 300, 20, null, C.line2, 2); txt(g, '玻璃罩中的扭秤（示意）', cx, R.y + 640, C.fg3, fnt(600, 22), 'center');
    eq(g, 'F = k q₁q₂ / r²', R.x + 1250, R.y + 280, C.gold, 54);
    al(g, pop(t, 2, .6), () => { const x0 = R.x + 930, y0 = R.y + 720; line(g, [[x0, y0], [x0 + 660, y0]], C.fg3, 2); line(g, [[x0, y0], [x0, y0 - 300]], C.fg3, 2); const pts = []; for (let i = 0; i <= 60; i++) { const r = .5 + i / 60 * 3; pts.push([x0 + (r - .5) / 3 * 640, y0 - Math.min(300, 75 / (r * r))]); } line(g, pts, C.b, 4); txt(g, '距离加倍，力变为四分之一', x0 + 140, y0 - 220, C.fg2, fnt(600, 26)); });
    al(g, pop(t, 4, .6), () => txt(g, '和万有引力形式相同', R.x + 1250, R.y + 360, C.fg, fnt(700, 30), 'center'));
  },
});
