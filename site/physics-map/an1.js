// 第一集画面（非地图）
// 右侧逐条说明：items = [[文字, 出现时刻(段内秒), 颜色?, 字号?]]
function notes(g, x, y, items, t, gap = 78) { items.forEach(([s, t0, col, fs], i) => al(g, pop(t, t0, .5), () => wrapTxt(g, s, x, y + i * gap, 700, (fs || 30) * 1.35, col || C.fg, fnt(700, fs || 30)))); }
const BT = (st, t, kk, t0 = 0) => st.k > kk ? 99 : st.k < kk ? -1 : (kk === 0 ? t : st.tk) - t0; // 第 kk 个 beat 内的时间
Object.assign(AN, {
  strings: (g, t, R, st) => {
    hdr(g, R, '弦长与和谐音程', '毕达哥拉斯学派（传说）· 约公元前 530 年 · 克罗顿');
    const X0 = R.x + 80, W = 900, rows = [[1, '1', '基音'], [1 / 2, '1/2', '高八度'], [2 / 3, '2/3', '五度'], [3 / 4, '3/4', '四度']];
    rows.forEach(([f, lab, nm], i) => { const y = R.y + 200 + i * 150, a = pop(t, .5 + i * 1.3, .5); if (a <= 0) return;
      al(g, a, () => { line(g, [[X0, y + 40], [X0 + W, y + 40]], C.line2, 2); rr(g, X0 - 14, y - 30, 14, 90, 3, C.fg3); rr(g, X0 + W * f, y - 30, 14, 90, 3, C.gold);
        const amp = 26 * Math.exp(-((t - .5 - i * 1.3) % 6) * .5), ph = t * 30 / f; g.save(); g.strokeStyle = C.b; g.lineWidth = 4; g.beginPath();
        for (let j = 0; j <= 80; j++) { const u = j / 80; const xx = X0 + W * f * u, yy = y + 15 + amp * Math.sin(Math.PI * u) * Math.sin(ph); j ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); g.restore();
        txt(g, lab, X0 + W + 60, y + 15, C.gold, fnt(800, 40, 'mono')); txt(g, nm, X0 + W + 180, y + 15, C.fg, fnt(700, 30)); }); });
    al(g, pop(t, 6.5, .6), () => txt(g, '弦长成简单整数比 → 声音和谐', R.x + 80, R.y + 800, C.fg2, fnt(700, 30)));
  },
  atoms: (g, t, R, st) => {
    hdr(g, R, '原子论', '留基伯、德谟克利特 · 约公元前 430 年 · 阿布德拉');
    const bx = R.x + 60, by = R.y + 140, bw = 900, bh = 620; rr(g, bx, by, bw, bh, 20, 'rgba(14,20,36,.6)', C.line2, 2);
    for (let i = 0; i < 46; i++) { const sh = i % 3, vx = (HSH(i, 1) - .5) * 160, vy = (HSH(i, 2) - .5) * 160; let x = (HSH(i, 3) * (bw - 60) + vx * t) % (2 * (bw - 60)); if (x < 0) x += 2 * (bw - 60); if (x > bw - 60) x = 2 * (bw - 60) - x;
      let y = (HSH(i, 4) * (bh - 60) + vy * t) % (2 * (bh - 60)); if (y < 0) y += 2 * (bh - 60); if (y > bh - 60) y = 2 * (bh - 60) - y; const px = bx + 30 + x, py = by + 30 + y, col = [C.b, C.o, C.g][sh];
      if (sh === 0) dot(g, px, py, 14, col); else if (sh === 1) rr(g, px - 13, py - 13, 26, 26, 4, col); else { g.fillStyle = col; g.beginPath(); g.moveTo(px, py - 16); g.lineTo(px + 15, py + 12); g.lineTo(px - 15, py + 12); g.fill(); } }
    notes(g, R.x + 1020, R.y + 220, [['万物由不可再分的“原子”组成', 1], ['原子形状、大小不同，在虚空中不停运动', 2.5], ['物质的差别 = 原子排列的差别', 4], ['只是哲学猜想，没有实验', 5.5, C.gold], ['两千多年后才被证实（见第四集）', 6.5, C.fg3, 26]], t);
  },
  aristfall: (g, t, R, st) => {
    hdr(g, R, st.k === 0 ? '亚里士多德：天然位置' : '抛出去的石头为什么还在飞？', '《物理学》· 约公元前 335 年 · 雅典');
    const gx = R.x + 120, gy = R.y + 720;
    line(g, [[R.x + 40, gy], [R.x + 1000, gy]], C.fg3, 3); txt(g, '大地', R.x + 60, gy + 34, C.fg3, fnt(600, 24));
    if (st.k === 0) {
      const tt = Math.max(0, t - 1) % 4; const yH = R.y + 160 + Math.min(1, tt / 1.0) ** 2 * 540, yL = R.y + 160 + Math.min(1, tt / 2.0) ** 2 * 540;
      ball(g, gx + 160, yH, 38, '#9aa5b8'); txt(g, '重', gx + 160, R.y + 120, C.fg, fnt(800, 30), 'center'); ball(g, gx + 420, yL, 22, '#c9b98f'); txt(g, '轻', gx + 420, R.y + 120, C.fg, fnt(800, 30), 'center');
      const fy = R.y + 600 - ((t * 140) % 400); g.save(); g.fillStyle = C.o; g.globalAlpha = .8; g.beginPath(); g.moveTo(gx + 680, fy); g.quadraticCurveTo(gx + 720, fy + 50, gx + 680, fy + 90); g.quadraticCurveTo(gx + 640, fy + 50, gx + 680, fy); g.fill(); g.restore(); txt(g, '火', gx + 680, R.y + 120, C.fg, fnt(800, 30), 'center');
      notes(g, R.x + 1060, R.y + 230, [['石头属于大地 → 向下', 1.5], ['火属于天上 → 向上', 2.5], ['越重的东西落得越快', 3.5, C.gold], ['（这一条是错的）', 5, C.bad, 26]], t);
    } else {
      const u = CL(st.tk / 3); const pts = []; for (let i = 0; i <= 40; i++) { const v = i / 40; pts.push([gx + v * 800, gy - 60 - 420 * v * (1 - v) * 2.2 + v * 0]); }
      const n = Math.max(2, Math.round(u * 40)); line(g, pts.slice(0, n), C.b, 3, [8, 6]); ball(g, ...pts[n - 1], 20, '#9aa5b8'); person(g, gx - 30, gy - 10, C.fg2, 2.2);
      for (let i = 0; i < 6; i++) al(g, .6, () => arrow(g, pts[n - 1][0] - 120 + i * 0 - 30, pts[n - 1][1] - 40 + i * 16, pts[n - 1][0] - 40, pts[n - 1][1] - 30 + i * 12, C.g, 2, 8));
      notes(g, R.x + 1060, R.y + 230, [['亚里士多德：空气绕到后面推着它', .8, C.g], ['这个解释统治了近两千年', 2, C.fg], ['后来的“冲力”说，就从这里开始质疑', 3.5, C.gold]], st.tk);
    }
  },
  lever: (g, t, R, st) => {
    hdr(g, R, '阿基米德：杠杆与浮力', '约公元前 250 年 · 叙拉古');
    const px = R.x + 420, py = R.y + 450, ang = -.08 * Math.cos(Math.min(1, t / 3) * Math.PI) * (1 - SS(t / 3));
    g.save(); g.fillStyle = C.fg3; g.beginPath(); g.moveTo(px, py); g.lineTo(px - 40, py + 70); g.lineTo(px + 40, py + 70); g.fill(); g.restore();
    const L = 340, c = Math.cos(ang), s = Math.sin(ang); line(g, [[px - L * c, py - L * s], [px + L * c, py + L * s]], C.o, 10);
    const wA = [px - 300 * c, py - 300 * s], wB = [px + 150 * c, py + 150 * s];
    rr(g, wA[0] - 30, wA[1] - 66, 60, 60, 8, C.b); txt(g, '1', wA[0], wA[1] - 36, '#fff', fnt(800, 28), 'center'); rr(g, wB[0] - 42, wB[1] - 90, 84, 84, 8, C.r); txt(g, '2', wB[0], wB[1] - 48, '#fff', fnt(800, 30), 'center');
    txt(g, '力臂 2', px - 150, py + 60, C.b, fnt(700, 24), 'center'); txt(g, '力臂 1', px + 75, py + 60, C.r, fnt(700, 24), 'center');
    eq(g, '1 × 2 = 2 × 1  → 平衡', px, py + 160, C.gold, 40);
    // 浮力
    const bx = R.x + 1020, by = R.y + 300, a = pop(t, 4, .6); al(g, a, () => { rr(g, bx, by, 320, 380, 10, 'rgba(92,180,255,.18)', C.b, 3); const sink = SS((t - 4.5) / 2) * 120; rr(g, bx + 110, by - 60 + sink, 100, 100, 6, '#9aa5b8');
      rr(g, bx + 340, by + 260, 120, 120 - sink * .2, 6, 'rgba(92,180,255,.5)'); arrow(g, bx + 160, by + 120 + sink, bx + 160, by + 20 + sink, C.g, 5, 14); txt(g, '浮力', bx + 180, by + 70 + sink, C.g, fnt(700, 26));
      wrapTxt(g, '浮力 = 排开的水的重量', bx - 10, by + 450, 620, 40, C.gold, fnt(800, 32)); });
  },
  erato: (g, t, R, st) => {
    hdr(g, R, '埃拉托色尼测量地球', '约公元前 240 年 · 亚历山大港 · 夏至正午');
    const cx = R.x + 460, cy = R.y + 560, r = 250, A = -Math.PI / 2, B = A - 7.2 * Math.PI / 180 * 2.2;
    g.save(); g.strokeStyle = C.b; g.lineWidth = 3; g.fillStyle = 'rgba(92,180,255,.08)'; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill(); g.stroke(); g.restore();
    const S = [cx + r * Math.cos(A), cy + r * Math.sin(A)], X = [cx + r * Math.cos(B), cy + r * Math.sin(B)];
    // 两根杆
    const pole = (P, a, col, lab) => { const e = [P[0] + 70 * Math.cos(a), P[1] + 70 * Math.sin(a)]; line(g, [P, e], col, 6); txt(g, lab, e[0] + (lab === '赛伊尼' ? 20 : -20), e[1] - 10, col, fnt(700, 26), lab === '赛伊尼' ? 'left' : 'right'); return e; };
    pole(S, A, C.fg, '赛伊尼'); const e = pole(X, B, C.fg, '亚历山大港');
    al(g, pop(t, 1.5, .6), () => { for (let i = -4; i <= 4; i++) line(g, [[S[0] + i * 70, R.y + 150], [S[0] + i * 70, R.y + 230]], C.gold + '88', 2); line(g, [[e[0], R.y + 150], e], C.gold, 3); line(g, [[S[0], R.y + 150], S], C.gold, 3); txt(g, '平行的阳光', S[0] + 300, R.y + 170, C.gold, fnt(700, 22)); });
    al(g, pop(t, 3, .6), () => { line(g, [[cx, cy], S], C.fg3, 2, [6, 6]); line(g, [[cx, cy], X], C.fg3, 2, [6, 6]); g.save(); g.strokeStyle = C.r; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, 70, B, A); g.stroke(); g.restore(); txt(g, '7.2°', cx - 30, cy - 100, C.r, fnt(800, 28), 'right'); });
    notes(g, R.x + 960, R.y + 230, [['赛伊尼：阳光直射井底，影子为零', 2], ['亚历山大港：日影偏约 7.2°', 3, C.r], ['7.2° = 一圈的 1/50', 4.5], ['地球周长 = 两城距离 × 50', 5.5, C.gold], ['结果约 25 万斯塔德（折合多少米有争议）', 7, C.fg3, 26]], t);
  },
  pinhole: (g, t, R, st) => {
    hdr(g, R, st.k === 0 ? '《墨经》：小孔成像' : '《墨经》里的力与镜', '战国墨家 · 约公元前 4 世纪 · 成书地点不详');
    const sx = R.x + 160, wx = R.x + 560, scx = R.x + 920, cy = R.y + 440;
    const py0 = cy - 40, hy = py0 - 70, fy = py0 + 90; person(g, sx, py0, C.o, 5); rr(g, wx - 10, R.y + 150, 20, cy - 4 - R.y - 150, 4, C.fg3); rr(g, wx - 10, cy + 24, 20, R.y + 760 - cy - 24, 4, C.fg3); line(g, [[scx, R.y + 150], [scx, R.y + 760]], C.fg2, 6);
    const u = CL((st.k ? 99 : t - .6) / 2), hole = [wx, cy + 10], k = (scx - wx) / (wx - sx), img = y => hole[1] + (hole[1] - y) * k;
    [[[sx, hy], C.gold], [[sx, fy], C.b]].forEach(([p, col]) => { const m = hole, q = [scx, img(p[1])]; const L1 = Math.hypot(m[0] - p[0], m[1] - p[1]), L2 = Math.hypot(q[0] - m[0], q[1] - m[1]); const d = u * (L1 + L2);
      g.save(); g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); g.moveTo(...p); if (d < L1) g.lineTo(LERP(p[0], m[0], d / L1), LERP(p[1], m[1], d / L1)); else { g.lineTo(...m); g.lineTo(LERP(m[0], q[0], (d - L1) / L2), LERP(m[1], q[1], (d - L1) / L2)); } g.stroke(); g.restore(); });
    al(g, CL(u * 3 - 2), () => { const H = img(hy), Fo = img(fy), s = (H - Fo) / 32, y = H - 14 * s; g.save(); g.translate(scx + 50, y); g.scale(1, -1); person(g, 0, 0, C.o + 'bb', s); g.restore(); txt(g, '倒像', scx + 110, (H + Fo) / 2, C.o, fnt(700, 26)); });
    if (st.k === 0) notes(g, R.x + 1120, R.y + 230, [['光像箭一样走直线', 2.5], ['“下者之人也高，高者之人也下”', 3.6, C.gold], ['所以像是倒立的', 5]], t);
    else notes(g, R.x + 1120, R.y + 230, [['“力，形之所以奋也”', .6, C.gold], ['力 = 使物体运动起来的原因', 1.8], ['还讨论了杠杆、平面镜、凹面镜、凸面镜', 3.2], ['作者与成书年代存疑', 4.8, C.fg3, 26]], st.tk);
  },
  refract: (g, t, R, st) => {
    hdr(g, R, '折射定律', '伊本·萨赫勒约 984 年（巴格达）· 斯涅耳约 1621 年（莱顿）重新发现');
    const cx = R.x + 480, cy = R.y + 450; rr(g, R.x + 40, cy, 880, 340, 0, 'rgba(92,180,255,.16)'); line(g, [[R.x + 40, cy], [R.x + 920, cy]], C.b, 3); line(g, [[cx, R.y + 120], [cx, R.y + 790]], C.fg3, 2, [6, 6]);
    txt(g, '空气', R.x + 60, cy - 30, C.fg3, fnt(600, 26)); txt(g, '玻璃', R.x + 60, cy + 40, C.b, fnt(600, 26));
    const th1 = (25 + 30 * (.5 - .5 * Math.cos(t * .7))) * Math.PI / 180, n = 1.5, th2 = Math.asin(Math.sin(th1) / n);
    const A = [cx - 300 * Math.sin(th1), cy - 300 * Math.cos(th1)], B = [cx + 320 * Math.sin(th2), cy + 320 * Math.cos(th2)];
    line(g, [A, [cx, cy]], C.gold, 5); line(g, [[cx, cy], B], C.gold, 5);
    g.save(); g.strokeStyle = C.r; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, 80, -Math.PI / 2 - th1, -Math.PI / 2); g.stroke(); g.strokeStyle = C.g; g.beginPath(); g.arc(cx, cy, 90, Math.PI / 2 - th2, Math.PI / 2); g.stroke(); g.restore();
    txt(g, 'i', cx - 40, cy - 110, C.r, fnt(800, 30, 'serif'), 'center'); txt(g, 'r', cx + 24, cy + 120, C.g, fnt(800, 30, 'serif'), 'center');
    const X = R.x + 1040; eq(g, 'sin i ÷ sin r = 常数', X + 300, R.y + 260, C.gold, 46);
    txt(g, `i = ${(th1 * 180 / Math.PI).toFixed(1)}°`, X, R.y + 380, C.r, fnt(700, 32, 'mono')); txt(g, `r = ${(th2 * 180 / Math.PI).toFixed(1)}°`, X, R.y + 440, C.g, fnt(700, 32, 'mono'));
    txt(g, `比值 = ${(Math.sin(th1) / Math.sin(th2)).toFixed(3)}`, X, R.y + 500, C.fg, fnt(800, 32, 'mono'));
    al(g, pop(t, 3, .6), () => wrapTxt(g, '角度在变，比值不变（玻璃约 1.5）', X, R.y + 600, 680, 42, C.fg2, fnt(600, 28)));
  },
  camera: (g, t, R, st) => {
    hdr(g, R, '伊本·海赛姆：暗室实验', '《光学之书》· 约 1011–1021 年 · 开罗');
    const bx = R.x + 420, by = R.y + 200, bw = 560, bh = 460; rr(g, bx, by, bw, bh, 8, 'rgba(5,8,14,.95)', C.fg3, 3); g.fillStyle = '#05080e'; g.fillRect(bx - 3, by + bh / 2 - 6, 6, 12);
    const cand = [[R.x + 120, R.y + 300, C.o], [R.x + 160, R.y + 430, C.gold], [R.x + 110, R.y + 560, C.r]]; const hole = [bx, by + bh / 2];
    cand.forEach(([x, y, col], i) => { rr(g, x - 10, y, 20, 70, 3, '#ddd'); const fl = 1 + .1 * Math.sin(t * 9 + i); g.save(); g.fillStyle = col; g.beginPath(); g.ellipse(x, y - 16, 9 * fl, 18 * fl, 0, 0, TAU); g.fill(); g.restore(); glow(g, x, y - 16, 50, col + '55');
      const on = st.k === 0 || !(i === 1 && Math.floor(st.tk / 2) % 2 === 1); if (!on) { txt(g, '遮住', x + 30, y - 16, C.fg3, fnt(600, 22)); return; }
      const q = [bx + bw, hole[1] + (hole[1] - (y - 16)) * bw / (bx - x)]; al(g, pop(t, .6 + i * .4, .6), () => { line(g, [[x, y - 16], hole, q], col, 2.5); dot(g, q[0] - 6, q[1], 12, col); glow(g, q[0] - 6, q[1], 30, col + '88'); }); });
    notes(g, R.x + 1100, R.y + 230, [['三支蜡烛 → 墙上三个倒置的光斑', 2], ['遮住一支，对应的光斑消失', 3.4, C.gold], ['光从物体进入，沿直线传播', 4.8], ['控制条件 · 反复实验 · 用几何解释', 6.2, C.g]], t);
  },
  compass: (g, t, R, st) => {
    const k1 = st.k >= 1;
    hdr(g, R, k1 ? '佩雷格里纳斯：磁体的两极' : '沈括：磁偏角', k1 ? '《磁石书信》· 1269 年 · 卢切拉' : '《梦溪笔谈》· 约 1088 年 · 润州');
    const cx = R.x + 380, cy = R.y + 450, r = 250;
    g.save(); g.strokeStyle = C.fg3; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke(); g.restore();
    ['北', '东', '南', '西'].forEach((s, i) => txt(g, s, cx + Math.sin(i * Math.PI / 2) * (r + 34), cy - Math.cos(i * Math.PI / 2) * (r + 34), C.fg2, fnt(700, 28), 'center'));
    line(g, [[cx, cy - r], [cx, cy + r]], C.fg3, 2, [6, 6]);
    const dec = (k1 ? 1 : SS((t - 1.5) / 2)) * 10 * Math.PI / 180; g.save(); g.translate(cx, cy); g.rotate(Math.PI - dec);
    g.fillStyle = C.r; g.beginPath(); g.moveTo(0, -r * .85); g.lineTo(14, 0); g.lineTo(-14, 0); g.fill(); g.fillStyle = C.b; g.beginPath(); g.moveTo(0, r * .85); g.lineTo(14, 0); g.lineTo(-14, 0); g.fill(); g.restore(); dot(g, cx, cy, 10, C.fg);
    if (!k1) { al(g, pop(t, 3, .6), () => txt(g, '“常微偏东，不全南也”', cx, cy + r + 90, C.gold, fnt(800, 34, 'serif'), 'center'));
      notes(g, R.x + 800, R.y + 240, [['磁针指南，但略偏东（示意角度）', 2], ['地磁南北极 ≠ 地理南北极', 3.5, C.gold], ['最早明确记载磁偏角的文献之一', 5]], t); return; }
    // 两极与切开
    const X = R.x + 860, Y = R.y + 300, sp = SS((st.tk - 1.5) / 1.2) * 60;
    const bar = (x, y, w) => { rr(g, x, y, w / 2, 70, 6, C.r); rr(g, x + w / 2, y, w / 2, 70, 6, C.b); txt(g, 'N', x + 24, y + 36, '#fff', fnt(800, 30)); txt(g, 'S', x + w - 44, y + 36, '#fff', fnt(800, 30)); };
    if (st.tk < 1.5) bar(X, Y, 600); else { bar(X - sp, Y, 300); bar(X + 300 + sp, Y, 300); }
    al(g, pop(st.tk, 3, .5), () => txt(g, '切成两半，每一半仍有南北两极', X, Y + 130, C.gold, fnt(700, 30)));
    al(g, pop(st.tk, 4.2, .5), () => { txt(g, '同极相斥，异极相吸', X, Y + 210, C.fg, fnt(700, 30)); });
  },
  merton: (g, t, R, st) => {
    hdr(g, R, '平均速度定理', '默顿学派（牛津）约 1335 年 · 奥雷姆的图示（巴黎）约 1360 年');
    const ox = R.x + 120, oy = R.y + 720, W = 760, H = 480;
    arrow(g, ox, oy, ox + W + 60, oy, C.fg3, 3); arrow(g, ox, oy, ox, oy - H - 60, C.fg3, 3); txt(g, '时间', ox + W + 40, oy + 36, C.fg3, fnt(600, 24)); txt(g, '速度', ox - 20, oy - H - 80, C.fg3, fnt(600, 24));
    const u = st.k === 0 ? CL((t - .5) / 3) : 1; g.save(); g.fillStyle = 'rgba(95,224,160,.28)'; g.strokeStyle = C.g; g.lineWidth = 4; g.beginPath(); g.moveTo(ox, oy); g.lineTo(ox + W * u, oy - H * u); g.lineTo(ox + W * u, oy); g.closePath(); g.fill(); g.stroke(); g.restore();
    if (st.k === 0) { notes(g, R.x + 1000, R.y + 240, [['均匀加速：速度随时间直线上升', 1], ['匀加速走过的距离', 3], ['= 以“中间时刻速度”匀速走过的距离', 4.2, C.gold]], t); return; }
    const a = pop(st.tk, .5, .8); al(g, a, () => { rr(g, ox, oy - H / 2, W, H / 2, 0, 'rgba(255,210,122,.22)', C.gold, 3); line(g, [[ox + W / 2, oy], [ox + W / 2, oy - H / 2]], C.gold, 2, [6, 6]); txt(g, '中间时刻速度', ox + W / 2, oy - H / 2 - 24, C.gold, fnt(700, 24), 'center'); });
    notes(g, R.x + 1000, R.y + 240, [['距离 = 图形的面积', .5, C.fg], ['三角形面积 = 同底、半高的长方形', 1.6, C.gold], ['两百多年后伽利略用到了它', 3, C.fg2]], st.tk);
  },
});
