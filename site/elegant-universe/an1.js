// 第一集动画：两座大厦的裂缝

AN.open = (g, t, R, st) => {
  stars(g, { x: 0, y: 0, w: 1920, h: 1080 }, t, 220);
  const cx = R.x + R.w / 2, cy = R.y + 330;
  if (st.k === 0) {
    const u = pop(t, .3, 1.2);
    al(g, u, () => { loop(g, cx, cy, 150, 5, 26 * (.6 + .4 * Math.sin(t * 1.3)), t * 3, C.gold, 5, 300); });
    al(g, pop(t, 2.5), () => { txt(g, '1999 · 布赖恩·格林', cx, cy + 260, C.fg2, fnt(600, 30), 'center'); txt(g, 'The Elegant Universe　/　《宇宙的琴弦》', cx, cy + 315, C.fg, fnt(800, 40), 'center'); });
    al(g, pop(t, 7), () => { ['电子', '夸克', '光子', '引力子'].forEach((s, i) => chip(g, s, cx - 420 + i * 220, cy + 420, [C.b, C.r, C.gold, C.p][i])); });
    return;
  }
  const E = [['第一集', '两座大厦的裂缝', '相对论 · 量子力学 · 冲突', C.b], ['第二集', '万物皆是弦', '振动 · 超对称 · 额外维度', C.gold], ['第三集', 'M 理论与之后', '对偶 · 黑洞 · 1999 年以后', C.p]];
  const w = (R.w - 2 * 40) / 3;
  E.forEach(([a, b, c, col], i) => {
    const u = pop(st.k === 1 ? st.tk : 99, .3 + i * .6), x = R.x + i * (w + 40), y = R.y + 160, hot = st.k === 2 ? i === 0 : true;
    al(g, u * (hot ? 1 : .35), () => {
      rr(g, x, y, w, 420, 20, 'rgba(14,20,36,.92)', col, hot && st.k === 2 ? 4 : 2);
      txt(g, a, x + w / 2, y + 60, col, fnt(800, 30), 'center'); txt(g, b, x + w / 2, y + 130, C.fg, fnt(800, 40), 'center');
      if (i === 0) { ostring(g, x + 60, y + 260, x + w / 2 - 20, y + 260, 1, 0, 0, C.b, 4); ostring(g, x + w / 2 + 20, y + 260, x + w - 60, y + 260, 1, 0, 0, C.r, 4); cross(g, x + w / 2, y + 260, 1, C.bad, 14); }
      if (i === 1) loop(g, x + w / 2, y + 255, 60, 4, 14, t * 3, C.gold, 4);
      if (i === 2) { dot(g, x + w / 2, y + 255, 40, '#000'); g.strokeStyle = C.p; g.lineWidth = 3; g.beginPath(); g.arc(x + w / 2, y + 255, 48, 0, TAU); g.stroke(); }
      txt(g, c, x + w / 2, y + 370, C.fg2, fnt(600, 24), 'center');
    });
  });
};

// 光钟：静止 vs 运动
AN.lightclock = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '光速对谁都一样', '不论观察者自己怎么运动');
    const y = R.y + 400, x0 = R.x + 120;
    [['站着的人', 0, C.b], ['以半光速追光的人', .5, C.r]].forEach(([s, v, col], i) => {
      const yy = y + i * 200 - 100, u = pop(t, .5 + i * 1.5);
      al(g, u, () => {
        person(g, x0 + (v ? ((t * 60) % 300) : 0), yy, col, 1.3); txt(g, s, x0 - 20, yy + 60, C.fg2, fnt(600, 22));
        const px = x0 + 120 + ((t * 300) % (R.w - 500));
        line(g, [[x0 + 80, yy], [px, yy]], 'rgba(255,210,122,.4)', 3); dot(g, px, yy, 9, C.gold);
        txt(g, '测得光速 ≈ 30 万 km/s', R.x + R.w - 60, yy, C.gold, fnt(700, 26), 'right');
      });
    });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '光钟：光在两面镜子间来回跳', '运动的钟，光走的是更长的斜线');
    const H = 360, top = R.y + 210;
    const per = 2.2, ph = (st.tk / per) % 1, tri = ph < .5 ? ph * 2 : 2 - ph * 2;
    // 静止钟
    const xa = R.x + R.w * .18;
    rr(g, xa - 50, top - 14, 100, 10, 4, C.fg2); rr(g, xa - 50, top + H + 4, 100, 10, 4, C.fg2);
    dot(g, xa, top + tri * H, 10, C.gold); txt(g, '静止的钟', xa, top + H + 60, C.b, fnt(700, 26), 'center');
    txt(g, `跳了 ${Math.floor(st.tk / per * 2)} 下`, xa, top + H + 100, C.fg, fnt(700, 26, 'mono'), 'center');
    // 运动钟：斜线
    const xb0 = R.x + R.w * .38, span = R.w * .55, per2 = per * 1.6, ph2 = (st.tk / per2) % 1, tri2 = ph2 < .5 ? ph2 * 2 : 2 - ph2 * 2;
    const cyc = Math.floor(st.tk / per2) % 3, xb = xb0 + ((cyc + ph2) / 3) * span;
    for (let c = 0; c <= cyc; c++) { const xs = xb0 + c / 3 * span, xm = xs + span / 6, xe = xs + span / 3; const pts = c < cyc ? [[xs, top], [xm, top + H], [xe, top]] : (ph2 < .5 ? [[xs, top], [LERP(xs, xm, ph2 * 2), top + tri2 * H]] : [[xs, top], [xm, top + H], [LERP(xm, xe, ph2 * 2 - 1), top + tri2 * H]]); line(g, pts, 'rgba(255,210,122,.45)', 3, [8, 8]); }
    rr(g, xb - 50, top - 14, 100, 10, 4, C.fg2); rr(g, xb - 50, top + H + 4, 100, 10, 4, C.fg2);
    dot(g, xb, top + tri2 * H, 10, C.gold); arrow(g, xb + 60, top + H / 2, xb + 140, top + H / 2, C.r, 4);
    txt(g, '运动的钟（从地面看）', xb0 + span / 2, top + H + 60, C.r, fnt(700, 26), 'center');
    txt(g, `跳了 ${Math.floor(st.tk / per2 * 2)} 下`, xb0 + span / 2, top + H + 100, C.fg, fnt(700, 26, 'mono'), 'center');
    return;
  }
  // k=2：变慢因子曲线
  hdr(g, R, '越接近光速，效应越明显', '时间变慢、长度缩短的倍数（洛伦兹因子）');
  const x0 = R.x + 140, x1 = R.x + R.w - 120, y0 = R.y + 760, y1 = R.y + 160, gm = v => 1 / Math.sqrt(1 - v * v), Y = gv => LERP(y0, y1, Math.min(1, (gv - 1) / 6));
  line(g, [[x0, y1 - 20], [x0, y0], [x1 + 20, y0]], C.fg3, 2);
  [0, .5, .8, .9, .99].forEach(v => { const x = LERP(x0, x1, v); txt(g, v === 0 ? '0' : v + 'c', x, y0 + 32, C.fg3, fnt(600, 20, 'mono'), 'center'); });
  [1, 3, 5, 7].forEach(gv => txt(g, gv + '×', x0 - 16, Y(gv), C.fg3, fnt(600, 20, 'mono'), 'right'));
  const u = SS(st.tk / 6), pts = []; for (let i = 0; i <= 200 * u; i++) { const v = i / 200 * .99; pts.push([LERP(x0, x1, v), Y(gm(v))]); }
  if (pts.length > 1) line(g, pts, C.gold, 4);
  [[.5, '半光速：慢 1.15 倍'], [.9, '0.9c：慢 2.3 倍'], [.99, '0.99c：慢 7.1 倍']].forEach(([v, s], i) => { if (u * .99 < v) return; const x = LERP(x0, x1, v), y = Y(gm(v)); dot(g, x, y, 8, C.r); txt(g, s, x - 14, y - 30, C.fg, fnt(700, 24), 'right'); });
};

// 缪子
AN.muon = (g, t, R, st) => {
  hdr(g, R, '宇宙射线里的缪子', '寿命约 2.2 微秒，却能从十几公里高空飞到地面');
  const gy = R.y + R.h - 60, ty = R.y + 170;
  const cols = [[R.x + R.w * .3, '如果时间不变慢', false], [R.x + R.w * .7, '实际观测（时间变慢）', true]];
  g.fillStyle = 'rgba(92,180,255,.05)'; g.fillRect(R.x, ty, R.w, gy - ty); rr(g, R.x, gy, R.w, 10, 4, '#2B3A2E');
  txt(g, '约 15 km', R.x + 20, ty + 10, C.fg3, fnt(600, 20)); txt(g, '地面', R.x + 20, gy - 20, C.fg3, fnt(600, 20));
  cols.forEach(([x, lab, ok], ci) => {
    txt(g, lab, x, gy + 50, ok ? C.ok : C.bad, fnt(700, 26), 'center');
    for (let i = 0; i < 26; i++) {
      const t0 = HSH(i, ci + 7) * 6, ph = ((t - t0) / 4) % 1.25; if (t < t0 || ph > 1) continue;
      const y = LERP(ty, gy, ph), life = ok ? 1.6 : .25; const dead = HSH(i, 3) * life < ph;
      const xx = x + (HSH(i, 5) - .5) * 260;
      if (dead) { if (ph < (HSH(i, 3) * life) + .06) dot(g, xx, LERP(ty, gy, HSH(i, 3) * life), 12, 'rgba(255,107,107,.5)'); continue; }
      line(g, [[xx, y - 40], [xx, y]], 'rgba(199,155,255,.4)', 3); dot(g, xx, y, 6, C.p);
    }
  });
};

// 时空中的速度
AN.budget = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '每个物体都以光速穿行在时空里', '速度在“穿越空间”和“穿越时间”之间分配');
    const ox = R.x + 260, oy = R.y + 730, L = 500;
    arrow(g, ox, oy, ox + L + 120, oy, C.fg3, 3); arrow(g, ox, oy, ox, oy - L - 100, C.fg3, 3);
    txt(g, '穿越空间', ox + L + 120, oy + 36, C.fg2, fnt(600, 24), 'right'); txt(g, '穿越时间', ox - 20, oy - L - 100, C.fg2, fnt(600, 24), 'right');
    g.strokeStyle = C.line2; g.setLineDash([6, 8]); g.lineWidth = 2; g.beginPath(); g.arc(ox, oy, L, -Math.PI / 2, 0); g.stroke(); g.setLineDash([]);
    const ang = (Math.PI / 2) * SS((st.tk - 2) / 12);
    const ex = ox + L * Math.sin(ang), ey = oy - L * Math.cos(ang);
    arrow(g, ox, oy, ex, ey, C.gold, 6, 18); line(g, [[ex, ey], [ex, oy]], 'rgba(255,210,122,.35)', 2, [4, 6]); line(g, [[ex, ey], [ox, ey]], 'rgba(255,210,122,.35)', 2, [4, 6]);
    const v = Math.sin(ang);
    const lab = v < .05 ? '静止：全部用来穿越时间' : v > .97 ? '光：全部用来穿越空间，时钟停止' : '运动：分走一部分，时间变慢';
    const rx = R.x + R.w - 560;
    rr(g, rx, R.y + 230, 520, 300, 18, 'rgba(14,20,36,.94)', C.gold, 2);
    txt(g, `空间速度 ${(v).toFixed(2)} c`, rx + 30, R.y + 290, C.fg, fnt(700, 28, 'mono'));
    txt(g, `时间流速 ${(Math.cos(ang)).toFixed(2)} ×`, rx + 30, R.y + 350, C.fg, fnt(700, 28, 'mono'));
    wrapTxt(g, lab, rx + 30, R.y + 420, 460, 36, C.gold, fnt(700, 26));
    return;
  }
  hdr(g, R, '质量和能量可以互换', '换算系数是光速的平方');
  const cx = R.x + R.w / 2;
  al(g, pop(st.tk, .3, 1), () => { txt(g, 'E = mc²', cx, R.y + 300, C.gold, fnt(800, 120, 'serif'), 'center'); });
  al(g, pop(st.tk, 2), () => {
    glow(g, cx - 340, R.y + 590, 130, 'rgba(255,178,92,.6)'); dot(g, cx - 340, R.y + 590, 60, C.o); txt(g, '太阳：每秒约 400 万吨质量变成光', cx - 340, R.y + 740, C.fg2, fnt(600, 24), 'center');
    rr(g, cx + 240, R.y + 520, 200, 140, 12, 'rgba(14,20,36,.9)', C.b, 2); txt(g, '核电站', cx + 340, R.y + 590, C.b, fnt(700, 28), 'center'); txt(g, '1 克质量 ≈ 9×10¹³ 焦耳', cx + 340, R.y + 740, C.fg2, fnt(600, 24), 'center');
  });
};

// 电梯
AN.elevator = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '引力是瞬间传过去的吗？', '牛顿：是　·　狭义相对论：什么都快不过光');
    const sx = R.x + 300, sy = R.y + 470, ex = R.x + R.w - 300;
    glow(g, sx, sy, 160, 'rgba(255,178,92,.55)'); dot(g, sx, sy, 70, C.o); ball(g, ex, sy, 34, C.b, '#cfe8ff');
    txt(g, '太阳', sx, sy + 120, C.fg2, fnt(600, 24), 'center'); txt(g, '地球', ex, sy + 80, C.fg2, fnt(600, 24), 'center');
    al(g, pop(t, 2), () => { line(g, [[sx + 90, sy - 20], [ex - 50, sy - 20]], C.r, 3, [10, 8]); txt(g, '牛顿：瞬间作用', (sx + ex) / 2, sy - 60, C.r, fnt(700, 26), 'center'); });
    al(g, pop(t, 6), () => { txt(g, '？', (sx + ex) / 2, sy + 70, C.gold, fnt(800, 80), 'center'); txt(g, '光从太阳到地球要约 8 分钟', (sx + ex) / 2, sy + 160, C.fg2, fnt(600, 24), 'center'); });
    return;
  }
  hdr(g, R, '等效原理', '在封闭的电梯里，分不清引力和加速');
  const W = 300, H = 400, y = R.y + 240, xs = [R.x + R.w * .17, R.x + R.w * .5, R.x + R.w * .83];
  const labs = [['缆绳断了：自由下落', '飘起来，感觉不到重量', C.b], ['太空中加速向上', '被压在地板上', C.r], ['静止在地球上', '同样被压在地板上', C.g]];
  xs.forEach((cx, i) => {
    const u = pop(st.tk, .3 + i * 1.6), dy = i === 0 ? ((st.tk * 30) % 60) : 0;
    al(g, u, () => {
      rr(g, cx - W / 2, y + dy, W, H, 10, 'rgba(14,20,36,.9)', labs[i][2], 3);
      const py = i === 0 ? y + dy + 170 + Math.sin(st.tk * 2) * 20 : y + dy + H - 60;
      g.save(); g.translate(cx, py); if (i === 0) g.rotate(Math.sin(st.tk) * .3); person(g, 0, 0, C.fg, 1.4); g.restore();
      if (i === 1) { arrow(g, cx, y + H + 90, cx, y + H + 20, C.r, 5); txt(g, '加速', cx + 40, y + H + 60, C.r, fnt(600, 22)); }
      if (i === 2) { rr(g, cx - W / 2 - 30, y + H + 10, W + 60, 30, 8, '#1D3A36'); arrow(g, cx + W / 2 + 40, y + 60, cx + W / 2 + 40, y + 180, C.g, 4); txt(g, 'g', cx + W / 2 + 56, y + 120, C.g, fnt(700, 26)); }
      if (i === 0) arrow(g, cx + W / 2 + 40, y + 60, cx + W / 2 + 40, y + 180, C.b, 4);
      txt(g, labs[i][0], cx, y + H + 130, C.fg, fnt(700, 26), 'center'); txt(g, labs[i][1], cx, y + H + 170, C.fg2, fnt(500, 22), 'center');
    });
  });
  al(g, pop(st.tk, 6), () => { txt(g, '＝', (xs[1] + xs[2]) / 2, y + H / 2, C.gold, fnt(800, 70), 'center'); });
};

// 弯曲时空：k0 蹦床+弹珠；k1 涟漪；k2 光线偏折+GPS；k3 黑洞/膨胀
AN.sheet = (g, t, R, st0) => {
  const st = { ...st0, k: { 2: 0, 3: 1, 4: 2, 6: 3 }[st0.bi] ?? st0.k }, tk = st.tk;
  if (st.k <= 1) {
    hdr(g, R, st.k === 0 ? '质量让时空弯曲' : '弯曲以光速传开', st.k === 0 ? '物体沿着弯曲时空里“最直”的路线运动' : '太阳突然消失，地球要约 8 分钟后才“知道”');
    const gone = st.k === 1 && tk > 3; const m = gone ? Math.max(0, 1 - (tk - 3) * .6) : 1;
    const rad = st.k === 1 ? (tk - 3) * 180 : -1;
    const P = sheet(g, R, [{ x: 0, z: 0, m: 1.6 * (gone ? 0 : 1), w: 110 }], { wave: rad > 0 ? (x, z) => { const d = Math.hypot(x, z); return Math.abs(d - rad) < 70 ? 120 * (1 - Math.abs(d - rad) / 70) * Math.max(0, 1 - rad / 1400) : (d > rad ? 140 * 1.6 / (1 + d * d / 12100) : 0); } : null });
    const [sx, sy] = P(0, 0, 0); if (!gone || tk < 3.3) { glow(g, sx, sy - 50, 120, 'rgba(255,178,92,.5)'); ball(g, sx, sy - 50, 55, C.o, '#ffe0b0'); }
    const a = t * .8, rO = 300, ex = Math.cos(a) * rO, ez = Math.sin(a) * rO * .8; const [X, Y] = P(ex, ez, -16); ball(g, X, Y, 18, C.b, '#cfe8ff');
    const orb = []; for (let i = 0; i <= 80; i++) { const b = i / 80 * TAU; orb.push(P(Math.cos(b) * rO, Math.sin(b) * rO * .8, -4)); } line(g, orb, 'rgba(255,210,122,.3)', 2, [6, 8]);
    return;
  }
  if (st.k === 2) {
    hdr(g, R, '两次检验', '1919 年日全食的星光偏折　·　卫星定位里的时间修正');
    const cx = R.x + R.w * .3, cy = R.y + 470;
    glow(g, cx, cy, 120, 'rgba(255,178,92,.4)'); dot(g, cx, cy, 70, '#05070D'); g.strokeStyle = C.o; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, 72, 0, TAU); g.stroke();
    const u = SS(tk / 3), ptsR = []; for (let i = 0; i <= 60; i++) { const x = LERP(R.x + 20, R.x + R.w * .58, i / 60); const dx = x - cx; ptsR.push([x, cy - 110 + 40 * Math.exp(-dx * dx / 40000) * (dx > 0 ? 1 : 0) + (dx > 0 ? -dx * .08 : 0)]); }
    line(g, ptsR.slice(0, Math.max(2, Math.round(60 * u))), C.gold, 3);
    dot(g, R.x + 30, cy - 110, 7, C.gold); al(g, u, () => { dot(g, R.x + 30, cy - 190, 7, 'rgba(255,210,122,.4)'); txt(g, '看到的位置', R.x + 50, cy - 190, C.fg3, fnt(600, 20)); txt(g, '真实位置', R.x + 50, cy - 110 - 26, C.fg3, fnt(600, 20)); });
    txt(g, '观测者', R.x + R.w * .58, cy - 160, C.fg2, fnt(600, 22), 'center');
    const gx = R.x + R.w * .78, gy = R.y + 540;
    al(g, pop(tk, 4), () => {
      ball(g, gx, gy + 120, 110, C.b, '#cfe8ff'); g.strokeStyle = C.line2; g.lineWidth = 2; g.beginPath(); g.arc(gx, gy + 120, 260, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
      const a = Math.PI * 1.3 + Math.sin(t * .4) * .2; rr(g, gx + Math.cos(a) * 260 - 20, gy + 120 + Math.sin(a) * 260 - 12, 40, 24, 4, C.fg2);
      txt(g, '卫星钟每天快约 38 微秒', gx, gy - 220, C.fg, fnt(700, 26), 'center'); txt(g, '不修正：每天误差约 10 公里', gx, gy - 180, C.bad, fnt(600, 22), 'center');
    });
    return;
  }
  // k3: 黑洞 + 膨胀
  hdr(g, R, '两个惊人的预言', '黑洞　·　膨胀的宇宙');
  const half = { x: R.x, y: R.y + 60, w: R.w / 2, h: R.h - 60 };
  sheet(g, half, [{ x: 0, z: 0, m: 4.2 * SS(tk / 2), w: 50 }], { W: half.w * .9, D: 600, N: 18, col: 'rgba(199,155,255,.45)' });
  txt(g, '弯到极点：光也逃不出去', half.x + half.w / 2, R.y + R.h - 20, C.p, fnt(700, 26), 'center');
  const cx = R.x + R.w * .75, cy = R.y + 450, sc = 1 + .7 * SS((tk - 1) / 6);
  al(g, pop(tk, 1), () => {
    for (let i = 0; i < 40; i++) { const a = HSH(i, 2) * TAU, r = 30 + HSH(i, 3) * 190; dot(g, cx + Math.cos(a) * r * sc, cy + Math.sin(a) * r * sc * .8, 4, ['#9CC9FF', '#FFD27A', '#C79BFF'][i % 3]); }
    for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; arrow(g, cx + Math.cos(a) * 240 * sc * .9, cy + Math.sin(a) * 200 * sc * .9, cx + Math.cos(a) * 280 * sc, cy + Math.sin(a) * 230 * sc, 'rgba(255,210,122,.4)', 2, 8); }
    txt(g, '星系彼此远离 → 往回推：大爆炸', cx, R.y + R.h - 20, C.gold, fnt(700, 26), 'center');
  });
};

AN.towers = (g, t, R, st) => {
  hdr(g, R, '离质量越近，钟走得越慢', '2010 年光钟实验：高度差约 33 厘米也能测出');
  const gy = R.y + R.h - 80; rr(g, R.x, gy, R.w, 40, 8, '#1D3A36'); txt(g, '地球', R.x + 30, gy + 20, C.fg2, fnt(600, 22));
  const xA = R.x + R.w * .33, xB = R.x + R.w * .66;
  rr(g, xA - 90, gy - 120, 180, 120, 10, 'rgba(14,20,36,.9)', C.line2); rr(g, xB - 90, gy - 420, 180, 420, 10, 'rgba(14,20,36,.9)', C.line2);
  const w = t * 1.2;
  clock(g, xA, gy - 220, 80, w, C.b, '低处的钟'); clock(g, xB, gy - 520, 80, w * 1.04, C.gold, '高处的钟');
  al(g, pop(t, 3), () => { arrow(g, xB + 160, gy - 40, xB + 160, gy - 500, C.fg3, 2); txt(g, '抬高', xB + 180, gy - 270, C.fg2, fnt(600, 22)); txt(g, '（差距已放大，真实差异约十亿亿分之几）', R.x + R.w / 2, R.y + 150, C.fg3, fnt(500, 22), 'center'); });
};

// 双缝
AN.slit = (g, t, R, st) => {
  hdr(g, R, st.k === 0 ? '能量一份一份地给出' : st.k === 1 ? '双缝实验：一个一个射出电子' : '概率波：只能算出落在哪里的可能性', st.k === 0 ? '普朗克 1900 · 爱因斯坦光子 1905' : '');
  if (st.k === 0) {
    const x0 = R.x + 120, y0 = R.y + 700;
    line(g, [[x0, R.y + 200], [x0, y0], [R.x + R.w - 120, y0]], C.fg3, 2);
    txt(g, '能量', x0 - 20, R.y + 200, C.fg2, fnt(600, 22), 'right');
    for (let i = 1; i <= 6; i++) { const y = y0 - i * 80; al(g, pop(t, .4 + i * .3), () => { line(g, [[x0 + 40, y], [x0 + 520, y]], C.gold, 4); txt(g, `${i} 份`, x0 + 540, y, C.gold, fnt(600, 22)); }); }
    txt(g, '不能取中间值', x0 + 300, y0 + 40, C.fg2, fnt(600, 22), 'center');
    al(g, pop(t, 4), () => { const cx = R.x + R.w * .72; for (let i = 0; i < 7; i++) { const x = cx - 300 + ((t * 200 + i * 90) % 600); const yy = R.y + 450 + Math.sin(x * .05) * 20; dot(g, x, yy, 10, C.gold); glow(g, x, yy, 30, 'rgba(255,210,122,.4)'); } txt(g, '光子：一颗一颗的光', cx, R.y + 560, C.fg, fnt(700, 28), 'center'); });
    return;
  }
  const gx = R.x + 160, wx = R.x + R.w * .38, sx = R.x + R.w - 200, cy = R.y + 470;
  rr(g, gx - 40, cy - 30, 80, 60, 10, 'rgba(14,20,36,.9)', C.b, 2); txt(g, '电子枪', gx, cy + 60, C.fg2, fnt(600, 20), 'center');
  g.fillStyle = C.fg3; g.fillRect(wx - 8, R.y + 180, 16, cy - 70 - R.y - 180); g.fillRect(wx - 8, cy - 40, 16, 80); g.fillRect(wx - 8, cy + 70, 16, R.y + 780 - cy - 70);
  rr(g, sx, R.y + 180, 20, 600, 4, 'rgba(255,255,255,.08)', C.line2);
  const T = st.k === 1 ? st.tk : st.tk + 30, n = Math.min(1600, Math.floor(T * T * 4 + T * 10));
  const pdf = y => { const d = (y - cy) / 260; return Math.cos(d * 9) ** 2 * Math.exp(-d * d * 2.2); };
  for (let i = 0; i < n; i++) { let y; for (let k = 0; k < 20; k++) { y = R.y + 190 + HSH(i, k + 11) * 580; if (HSH(i, k + 40) < pdf(y)) break; } dot(g, sx + 4 + HSH(i, 9) * 12, y, 2.3, 'rgba(255,210,122,.85)'); }
  if (st.k === 1) { const ph = (st.tk * 1.4) % 1; dot(g, LERP(gx + 40, sx, ph), cy + (ph > .45 ? (HSH(Math.floor(st.tk * 1.4), 2) - .5) * 300 * (ph - .45) : 0), 7, C.gold); }
  if (st.k === 2) { al(g, pop(st.tk, .5), () => { for (let r = 30; r < sx - wx; r += 46) { const ph = (r + st.tk * 80) % 46; [cy - 55, cy + 55].forEach(yy => { g.strokeStyle = 'rgba(92,180,255,.25)'; g.lineWidth = 2; g.beginPath(); g.arc(wx, yy, r + ph, -1.1, 1.1); g.stroke(); }); } const pts = []; for (let y = R.y + 190; y < R.y + 770; y += 4) pts.push([sx + 40 + pdf(y) * 140, y]); line(g, pts, C.b, 3); txt(g, '概率', sx + 60, R.y + 160, C.b, fnt(600, 22)); }); }
  txt(g, `已到达 ${n} 个`, sx - 20, R.y + 820, C.fg2, fnt(600, 22, 'mono'), 'right');
};

// 量子涨落：放大镜头
AN.jitter = (g, t, R, st) => {
  hdr(g, R, '越往小处看，涨落越猛', '不确定性原理：在极短时间里，能量可以剧烈起伏');
  const lv = ['1 米', '原子 10⁻¹⁰ 米', '原子核 10⁻¹⁵ 米', '更小……'];
  const w = (R.w - 3 * 30) / 4, y = R.y + 200, h = 480;
  lv.forEach((s, i) => {
    const u = pop(t, .4 + i * 1.6); const x = R.x + i * (w + 30), amp = [2, 10, 30, 70][i];
    al(g, u, () => {
      rr(g, x, y, w, h, 16, 'rgba(14,20,36,.9)', C.line2, 2);
      g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
      const pts = []; for (let k = 0; k <= 80; k++) { const xx = x + k / 80 * w; pts.push([xx, y + h / 2 + amp * (Math.sin(k * .7 + t * 3 * (i + 1)) * .6 + Math.sin(k * 1.9 - t * 5) * .4) * (.5 + HSH(k, i) * .5)]); }
      line(g, pts, C.b, 3);
      if (i >= 1) for (let p = 0; p < i * 4; p++) { const ph = (t * .6 + HSH(p, i)) % 1, px = x + 30 + HSH(p, i + 9) * (w - 60), py = y + 60 + HSH(p, i + 4) * (h - 120), sep = Math.sin(ph * Math.PI) * 26; al(g, Math.sin(ph * Math.PI), () => { dot(g, px - sep, py, 6, C.r); dot(g, px + sep, py, 6, C.b); }); }
      g.restore();
      txt(g, s, x + w / 2, y + h + 40, C.fg, fnt(700, 24), 'center');
      if (i < 3) arrow(g, x + w + 4, y + h / 2, x + w + 26, y + h / 2, C.fg3, 3, 9);
    });
  });
  al(g, pop(t, 7), () => { dot(g, R.x + 30, y + h + 100, 6, C.r); dot(g, R.x + 50, y + h + 100, 6, C.b); txt(g, '虚粒子对：凭空出现又湮灭', R.x + 70, y + h + 100, C.fg2, fnt(600, 22)); });
};

// 费曼路径
AN.paths = (g, t, R, st) => {
  if (st.k === 0) {
    hdr(g, R, '费曼：粒子同时走遍所有路径', '把每条路径的贡献加起来，得到概率');
    const ax = R.x + 200, bx = R.x + R.w - 200, y = R.y + 470;
    for (let i = 0; i < 26; i++) { const u = pop(t, .3 + i * .18, .6); if (u <= 0) continue; const pts = []; const a1 = (HSH(i, 1) - .5) * 520, a2 = (HSH(i, 2) - .5) * 300, f = 2 + Math.floor(HSH(i, 3) * 4); for (let k = 0; k <= 80 * u; k++) { const s = k / 80; pts.push([LERP(ax, bx, s), y + Math.sin(s * Math.PI) * a1 + Math.sin(s * Math.PI * f) * a2 * .3]); } if (pts.length > 1) line(g, pts, `hsla(${200 + i * 6},80%,70%,.35)`, 2); }
    al(g, pop(t, 6), () => { line(g, [[ax, y], [bx, y]], C.gold, 5); txt(g, '贡献最大的：经典路径', (ax + bx) / 2, y - 26, C.gold, fnt(700, 24), 'center'); });
    dot(g, ax, y, 12, C.fg); dot(g, bx, y, 12, C.fg); txt(g, 'A', ax - 30, y, C.fg, fnt(800, 30), 'right'); txt(g, 'B', bx + 30, y, C.fg, fnt(800, 30));
    return;
  }
  hdr(g, R, '古怪，却是现代技术的地基', '');
  const it = [['晶体管', '芯片里的开关', C.b], ['激光', '光子齐步走', C.r], ['核磁共振', '原子核的自旋', C.g]];
  const w = (R.w - 2 * 40) / 3;
  it.forEach(([a, b, col], i) => { const x = R.x + i * (w + 40), y = R.y + 220, u = pop(st.tk, .3 + i * .8);
    al(g, u, () => { rr(g, x, y, w, 420, 20, 'rgba(14,20,36,.92)', col, 2); txt(g, a, x + w / 2, y + 300, C.fg, fnt(800, 38), 'center'); txt(g, b, x + w / 2, y + 360, C.fg2, fnt(500, 24), 'center');
      const cx = x + w / 2, cy = y + 140;
      if (i === 0) { rr(g, cx - 70, cy - 70, 140, 140, 10, '#1A2440', col, 2); for (let k = 0; k < 6; k++) { line(g, [[cx - 70 - 24, cy - 55 + k * 22], [cx - 70, cy - 55 + k * 22]], col, 3); line(g, [[cx + 70, cy - 55 + k * 22], [cx + 94, cy - 55 + k * 22]], col, 3); } }
      if (i === 1) { line(g, [[cx - 140, cy], [cx + 140, cy]], col, 8); glow(g, cx + 140, cy, 50, 'rgba(255,122,147,.6)'); }
      if (i === 2) { for (let k = 0; k < 5; k++) arrow(g, cx - 100 + k * 50, cy + 40, cx - 100 + k * 50 + Math.sin(t * 2 + k) * 14, cy - 40, col, 3, 10); }
    }); });
};

// 标准模型表
AN.sm = (g, t, R, st) => {
  const tk = st.tk, x0 = R.x + 30, y0 = R.y + 160, cw = Math.min(190, (R.w - 420) / 4), chh = 120;
  hdr(g, R, ['物质：三代粒子', '四种力和传递它们的粒子', '1999 年还缺一块：希格斯', '引力：量子化就出现无穷大', '重整化救不了引力'][st.k], '');
  const M = [['上夸克', '粲夸克', '顶夸克'], ['下夸克', '奇夸克', '底夸克'], ['电子', '缪子', 'τ 子'], ['电子中微子', '缪子中微子', 'τ 中微子']], cols = [C.r, C.r, C.b, C.g];
  ['第一代', '第二代', '第三代'].forEach((s, j) => txt(g, s, x0 + j * (cw + 12) + cw / 2, y0 - 20, C.fg3, fnt(600, 20), 'center'));
  M.forEach((row, i) => row.forEach((s, j) => { const u = st.k === 0 ? pop(tk, .3 + (j * 4 + i) * .15, .5) : 1; al(g, u * (st.k >= 3 ? .45 : 1), () => { rr(g, x0 + j * (cw + 12), y0 + i * (chh + 12), cw, chh, 12, 'rgba(14,20,36,.92)', cols[i], 2); txt(g, s, x0 + j * (cw + 12) + cw / 2, y0 + i * (chh + 12) + chh / 2, C.fg, fnt(700, 22), 'center'); }); }));
  const fx = x0 + 3 * (cw + 12) + 30;
  const F = [['光子', '电磁力', C.gold], ['W、Z', '弱力', C.o], ['胶子', '强力', C.p]];
  F.forEach(([a, b, col], i) => { const u = st.k >= 1 ? (st.k === 1 ? pop(tk, .5 + i * .6) : 1) : 0; al(g, u * (st.k >= 3 ? .45 : 1), () => { rr(g, fx, y0 + i * (chh + 12), cw + 40, chh, 12, 'rgba(14,20,36,.92)', col, 2); txt(g, a, fx + (cw + 40) / 2, y0 + i * (chh + 12) + chh / 2 - 14, C.fg, fnt(800, 26), 'center'); txt(g, b, fx + (cw + 40) / 2, y0 + i * (chh + 12) + chh / 2 + 22, C.fg2, fnt(500, 20), 'center'); }); });
  // 引力子
  const gyy = y0 + 3 * (chh + 12);
  if (st.k >= 1) al(g, st.k === 1 ? pop(tk, 3) : 1, () => { g.save(); g.setLineDash([8, 8]); rr(g, fx, gyy, cw + 40, chh, 12, 'rgba(14,20,36,.6)', st.k >= 3 ? C.bad : C.fg3, 2.5); g.restore(); txt(g, '引力子？', fx + (cw + 40) / 2, gyy + chh / 2 - 14, st.k >= 3 ? C.bad : C.fg2, fnt(800, 26), 'center'); txt(g, '引力', fx + (cw + 40) / 2, gyy + chh / 2 + 22, C.fg3, fnt(500, 20), 'center'); });
  // 希格斯
  const hx = fx + cw + 70;
  if (st.k >= 2) al(g, st.k === 2 ? pop(tk, .5) : .45, () => { glow(g, hx + 90, y0 + 200, 120, 'rgba(255,210,122,.35)'); rr(g, hx, y0 + 140, 180, chh, 12, 'rgba(14,20,36,.92)', C.gold, 3); txt(g, '希格斯', hx + 90, y0 + 140 + chh / 2, C.gold, fnt(800, 28), 'center'); txt(g, '1999：未发现', hx + 90, y0 + 300, C.fg2, fnt(600, 22), 'center'); txt(g, '2012：发现 ✓', hx + 90, y0 + 336, C.ok, fnt(700, 22), 'center'); });
  const rx = R.x + R.w - 420;
  if (st.k === 3) al(g, pop(tk, .6), () => { txt(g, '∞', rx + 200, R.y + 470, C.bad, fnt(800, 200, 'serif'), 'center'); txt(g, '计算结果发散', rx + 200, R.y + 640, C.fg2, fnt(600, 26), 'center'); });
  if (st.k === 4) {
    const bx = rx - 20, by = R.y + 200;
    [['电磁 · 弱 · 强', '有限几个无穷大，可吸收', C.ok, 3], ['引力', '越算越多，没有尽头', C.bad, 12]].forEach(([a, b, col, n], i) => { const yy = by + i * 300, u = pop(tk, .4 + i * 2);
      al(g, u, () => { txt(g, a, bx, yy, col, fnt(800, 28)); for (let k = 0; k < Math.min(n, Math.floor(1 + (tk - .4 - i * 2) * 3)); k++) txt(g, '∞', bx + 10 + (k % 6) * 66, yy + 60 + Math.floor(k / 6) * 64, col, fnt(800, 48, 'serif')); txt(g, b, bx, yy + 210, C.fg2, fnt(600, 22)); if (i === 0) txt(g, '→ 重整化 ✓', bx + 220, yy + 60, C.ok, fnt(700, 26)); }); });
  }
};

// 量子泡沫：缩放
AN.foam = (g, t, R, st) => {
  const T = st.k === 0 ? t : st.tk + 12, z = CL(T / 10);
  hdr(g, R, st.k === 0 ? '放大到普朗克长度' : '量子泡沫：平滑的几何不再成立', '');
  const labs = ['10⁻¹⁰ 米', '10⁻²⁰ 米', '10⁻³⁰ 米', '10⁻³⁵ 米（普朗克长度）'], li = Math.min(3, Math.floor(z * 4));
  const cx = R.x + R.w / 2, cy = R.y + 470, A = 6 + z * z * 140;
  g.save(); g.beginPath(); g.rect(R.x, R.y + 110, R.w, 620); g.clip();
  for (let j = 0; j < 15; j++) { const pts = []; for (let i = 0; i <= 120; i++) { const x = R.x + i / 120 * R.w, y = R.y + 160 + j * 42; const n = Math.sin(i * .21 + j * .8 + t * (1 + z * 3)) * .5 + Math.sin(i * .53 - j * 1.3 - t * 2 * (1 + z)) * .3 + Math.sin(i * 1.3 + j * 2.1 + t * 4 * z) * .2; pts.push([x, y + n * A * (z > .5 ? 1 : .4)]); } line(g, pts, `rgba(92,180,255,${.5 - z * .2})`, 1.6); }
  if (z > .6) for (let i = 0; i < 40; i++) { const ph = (t * .5 + HSH(i, 3)) % 1, x = R.x + HSH(i, 1) * R.w, y = R.y + 160 + HSH(i, 2) * 560, r = Math.sin(ph * Math.PI) * (20 + HSH(i, 4) * 60) * (z - .6) * 2.5; g.strokeStyle = 'rgba(199,155,255,.55)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, Math.max(0, r), 0, TAU); g.stroke(); }
  g.restore();
  rr(g, cx - 260, R.y + 750, 520, 56, 14, 'rgba(14,20,36,.94)', z > .9 ? C.p : C.b, 2); txt(g, '尺度 ' + labs[li], cx, R.y + 778, C.fg, fnt(700, 26), 'center');
  if (st.k === 1) al(g, pop(st.tk, 4), () => { rr(g, R.x + 40, R.y + 140, 520, 120, 14, 'rgba(14,20,36,.94)', C.bad, 2); txt(g, '广义相对论：需要平滑时空', R.x + 70, R.y + 180, C.fg, fnt(700, 24)); txt(g, '这里，方程失去意义 ✗', R.x + 70, R.y + 225, C.bad, fnt(700, 24)); });
};

// 尺度轴
AN.scales = (g, t, R, st) => {
  hdr(g, R, st.k === 0 ? '各管一摊：大用相对论，小用量子力学' : st.k === 1 ? '两大支柱，互不相容' : '量子引力的候选', '');
  const x0 = R.x + 60, x1 = R.x + R.w - 60, X = e => LERP(x0, x1, (e + 35) / 61), y = R.y + 430;
  line(g, [[x0, y], [x1, y]], C.fg3, 3);
  [-35, -20, -10, 0, 10, 20, 26].forEach(e => { line(g, [[X(e), y - 8], [X(e), y + 8]], C.fg3, 2); txt(g, `10^${e}`, X(e), y + 34, C.fg3, fnt(600, 18, 'mono'), 'center'); });
  txt(g, '米', x1, y + 64, C.fg3, fnt(600, 18), 'right');
  const tk = st.k === 0 ? t : 99;
  al(g, pop(tk, .5), () => { rr(g, X(-18), y - 160, X(-6) - X(-18), 110, 14, 'rgba(255,122,147,.12)', C.r, 2); txt(g, '量子力学', (X(-18) + X(-6)) / 2, y - 120, C.r, fnt(800, 28), 'center'); txt(g, '原子 · 原子核 · 夸克', (X(-18) + X(-6)) / 2, y - 80, C.fg2, fnt(500, 20), 'center'); });
  al(g, pop(tk, 1.5), () => { rr(g, X(3), y - 160, X(26) - X(3), 110, 14, 'rgba(92,180,255,.12)', C.b, 2); txt(g, '广义相对论', (X(3) + X(26)) / 2, y - 120, C.b, fnt(800, 28), 'center'); txt(g, '行星 · 恒星 · 星系 · 宇宙', (X(3) + X(26)) / 2, y - 80, C.fg2, fnt(500, 20), 'center'); });
  if (st.k >= 1 || t > 7) al(g, st.k === 0 ? pop(t, 7) : 1, () => {
    glow(g, X(-35), y, 70, 'rgba(199,155,255,.6)'); txt(g, '普朗克长度', X(-35) + 10, y - 60, C.p, fnt(700, 22));
    const by = y + 140;
    [['黑洞中心', '巨大质量压进极小空间'], ['宇宙诞生', '整个宇宙压成一点']].forEach(([a, b], i) => { const xx = R.x + 80 + i * 520; rr(g, xx, by, 480, 130, 14, 'rgba(14,20,36,.94)', C.p, 2.5); txt(g, a, xx + 24, by + 40, C.fg, fnt(800, 28)); txt(g, b + ' → 两个理论必须同时用', xx + 24, by + 90, C.fg2, fnt(500, 20)); });
  });
  if (st.k >= 2) al(g, pop(st.tk, .5), () => { const by = y + 320; chip(g, '弦论：基本单元是一维的弦', R.x + 80, by, C.gold, 1, 26); chip(g, '圈量子引力：直接量子化时空', R.x + 620, by, C.g, 1, 26); txt(g, '都还没有实验证据', R.x + 80, by + 60, C.fg3, fnt(600, 22)); });
};

AN.recap1 = (g, t, R, st) => {
  hdr(g, R, st.k === 0 ? '第一集回顾' : '下一集：如果基本单元是一根弦', '');
  const it = [['狭义相对论', '时间和空间随运动变化', C.b], ['广义相对论', '引力 = 时空弯曲', C.g], ['量子力学', '概率与涨落', C.r], ['冲突', '普朗克尺度上不相容', C.p]];
  const w = (R.w - 3 * 30) / 4;
  it.forEach(([a, b, col], i) => { const u = pop(st.k === 0 ? t : 99, .5 + i * 1.5), x = R.x + i * (w + 30), y = R.y + 200; al(g, u * (st.k === 1 ? .4 : 1), () => { rr(g, x, y, w, 260, 18, 'rgba(14,20,36,.92)', col, 2); txt(g, a, x + w / 2, y + 90, col, fnt(800, 32), 'center'); txt(g, b, x + w / 2, y + 160, C.fg, fnt(600, 24), 'center'); }); });
  if (st.k === 1) { const cx = R.x + R.w / 2, cy = R.y + 640; al(g, pop(st.tk, .4, 1), () => { dot(g, cx - 260, cy, 10, C.fg); txt(g, '点', cx - 260, cy + 60, C.fg2, fnt(600, 24), 'center'); arrow(g, cx - 200, cy, cx - 90, cy, C.fg3, 4); loop(g, cx + 60, cy, 70, 4, 14 * Math.sin(t * 2), t * 3, C.gold, 4); txt(g, '弦', cx + 60, cy + 110, C.gold, fnt(700, 24), 'center'); }); }
};
