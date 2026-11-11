// 第三集动画：M 理论与之后的二十多年

AN.open3 = (g, t, R, st) => {
  stars(g, { x: 0, y: 0, w: 1920, h: 1080 }, t, 200);
  const cx = R.x + R.w / 2, cy = R.y + 330;
  glow(g, cx, cy, 260, 'rgba(199,155,255,.25)'); dot(g, cx, cy, 120, '#03050A'); g.strokeStyle = C.p; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, 124, 0, TAU); g.stroke();
  for (let i = 0; i < 3; i++) loop(g, cx, cy, 170 + i * 50, 3 + i, 8, t * (1 + i * .3), [C.gold, C.b, C.r][i], 2);
  const L = st.k === 0 ? ['空间撕裂', '微扰论', 'M 理论', '黑洞', '宇宙学', '展望'] : ['1999 年以后：理论', '1999 年以后：观测', '今天怎么读'];
  let x = R.x + 60; L.forEach((s, i) => { x += chip(g, s, x, R.y + 700, st.k === 0 ? C.b : C.gold, pop(st.k === 0 ? t : st.tk, .5 + i * .5), 26) + 22; });
};

AN.flop = (g, t, R, st) => {
  hdr(g, R, st.k === 0 ? '翻转：一个小球面缩成一点，再从另一边长出' : '弦把撕开的地方包住', st.k === 0 ? '空间的结构被撕开又重新缝合（示意）' : '1993：阿斯宾沃尔、格林、莫里森；威滕独立证明');
  const cx = R.x + R.w / 2, cy = R.y + 450, ph = st.k === 0 ? CL((t - 1) / 8) : 1;
  const s = Math.abs(Math.cos(ph * Math.PI)), vert = ph > .5;
  // 两个圆锥
  const H = 220; [-1, 1].forEach(sg => { g.strokeStyle = 'rgba(92,180,255,.5)'; g.lineWidth = 2; for (let k = 0; k <= 8; k++) { const y = cy + sg * (40 * s + k * H / 8); const r = 40 * s + k * 18 + 30; g.beginPath(); g.ellipse(cx, y, r, r * .25, 0, 0, TAU); g.stroke(); } });
  if (s > .03) { g.save(); g.strokeStyle = vert ? C.gold : C.p; g.lineWidth = 4; g.beginPath(); if (vert) g.ellipse(cx, cy, 70 * s * .6, 70 * s, 0, 0, TAU); else g.ellipse(cx, cy, 70 * s, 70 * s * .6, 0, 0, TAU); g.stroke(); g.restore(); }
  else { glow(g, cx, cy, 40, 'rgba(255,107,107,.7)'); dot(g, cx, cy, 8, C.bad); }
  txt(g, ph < .5 ? '球面缩小' : s < .05 ? '撕裂点' : '从另一个方向长出', cx + 300, cy, C.fg, fnt(700, 28));
  if (st.k === 1) { const a = st.tk * 1.5; g.save(); g.strokeStyle = C.gold; g.lineWidth = 3; g.shadowColor = C.gold; g.shadowBlur = 16; g.beginPath(); g.ellipse(cx, cy, 120 + 10 * Math.sin(a), 60, a * .3, 0, TAU); g.stroke(); g.restore();
    glow(g, cx, cy, 160, 'rgba(255,210,122,.15)'); txt(g, '弦扫过的曲面屏蔽了灾难，物理量保持有限', cx, cy + 330, C.gold, fnt(700, 26), 'center'); }
};

AN.mirror = (g, t, R, st) => {
  hdr(g, R, '镜像对称', '两种形状不同的卡拉比–丘空间，给出一模一样的物理');
  const cxA = R.x + R.w * .25, cxB = R.x + R.w * .75, cy = R.y + 370;
  cyShape(g, cxA, cy, 200, t * .5, C.b, 1); cyShape(g, cxB, cy, 200, -t * .5 + 1.7, C.r, 1);
  g.save(); g.setLineDash([10, 10]); line(g, [[R.x + R.w / 2, R.y + 160], [R.x + R.w / 2, R.y + 640]], C.fg3, 2); g.restore();
  txt(g, '形状 A', cxA, cy + 250, C.b, fnt(800, 28), 'center'); txt(g, '形状 B（镜像）', cxB, cy + 250, C.r, fnt(800, 28), 'center');
  al(g, pop(t, 4), () => { rr(g, R.x + 80, R.y + 660, R.w - 160, 110, 16, 'rgba(14,20,36,.94)', C.gold, 2); txt(g, 'A 侧很难算的几何问题　⟷　B 侧容易算', R.x + R.w / 2, R.y + 700, C.fg, fnt(700, 28), 'center'); txt(g, '1991：用它数出了数学家多年没算出的曲线数目', R.x + R.w / 2, R.y + 742, C.fg2, fnt(600, 22), 'center'); });
};

AN.mstar = (g, t, R, st) => {
  const tk = st.tk, cx = R.x + R.w * .5, cy = R.y + 470;
  hdr(g, R, ['五种弦论', '对偶：它们是同一理论的不同侧面', 'M 理论：十一维', '相互作用变强，第十一维显现', '对偶之网'][st.k], ['', '强耦合的 A ＝ 弱耦合的 B', '1995 · 威滕 · 第二次超弦革命', 'IIA 型：弦其实是卷在圆圈上的膜', '实线：强弱对偶（S）· 虚线：T 对偶 · 金线：长出第十一维'][st.k]);
  if (st.k === 4) { dualNet(g, R, tk); return; }
  const N = ['I 型', 'IIA 型', 'IIB 型', '杂化 O', '杂化 E', '11 维超引力'], cols = [C.b, C.r, C.o, C.g, C.p, C.gold];
  if (st.k === 3) {
    const lx = R.x + 120, rx = R.x + R.w - 120, y0 = R.y + 520, gc = SS(tk / 6);
    txt(g, '弱相互作用', lx, R.y + 200, C.fg2, fnt(700, 24)); txt(g, '强相互作用', rx, R.y + 200, C.fg2, fnt(700, 24), 'right');
    rr(g, lx, R.y + 230, rx - lx, 14, 7, C.line2); dot(g, LERP(lx, rx, gc), R.y + 237, 14, C.gold);
    const w = 700, r = LERP(4, 140, gc), x0 = cx - w / 2;
    rr(g, x0, y0 - r, w, 2 * r, r, 'rgba(255,122,147,.12)', C.r, 3);
    if (r > 30) for (let i = 0; i < 10; i++) { g.strokeStyle = 'rgba(255,122,147,.35)'; g.lineWidth = 2; g.beginPath(); g.ellipse(x0 + 40 + i * (w - 80) / 9, y0, r * .25, r, 0, 0, TAU); g.stroke(); }
    txt(g, r < 30 ? '看起来是一根弦' : '其实是一张卷起来的膜（第十一维 = 圆圈）', cx, y0 + 200, C.fg, fnt(700, 28), 'center');
    return;
  }
  const pos = i => { const a = -Math.PI / 2 + i / 6 * TAU; return [cx + Math.cos(a) * 330, cy + Math.sin(a) * 290]; };
  const show = st.k === 0 ? 5 : 6;
  if (st.k >= 1) { const u = st.k === 1 ? pop(tk, 1) : 1; for (let i = 0; i < show; i++) { const [a, b] = pos(i), [c, d] = pos((i + 1) % show); al(g, u, () => line(g, [[a, b], [c, d]], 'rgba(255,210,122,.4)', 3, [8, 8])); } }
  if (st.k === 2) { const u = pop(tk, .3, 1); al(g, u, () => { glow(g, cx, cy, 200, 'rgba(255,210,122,.3)'); txt(g, 'M', cx, cy, C.gold, fnt(800, 130, 'serif'), 'center'); for (let i = 0; i < 6; i++) { const [a, b] = pos(i); line(g, [[cx + (a - cx) * .25, cy + (b - cy) * .25], [cx + (a - cx) * .7, cy + (b - cy) * .7]], 'rgba(255,210,122,.4)', 2); } txt(g, '10 维空间 + 1 维时间', cx, cy + 110, C.fg, fnt(700, 24), 'center'); }); }
  for (let i = 0; i < show; i++) { const [x, y] = pos(i), u = st.k === 0 ? pop(tk, .3 + i * .6) : i === 5 && st.k === 1 ? pop(tk, 6) : 1; al(g, u, () => { rr(g, x - 110, y - 44, 220, 88, 16, 'rgba(14,20,36,.95)', cols[i], 2.5); txt(g, N[i], x, y, C.fg, fnt(800, i === 5 ? 22 : 28), 'center'); }); }
  if (st.k === 0) al(g, pop(tk, 4), () => txt(g, '？', cx, cy, C.gold, fnt(800, 100), 'center'));
};

AN.branes = (g, t, R, st) => {
  hdr(g, R, '不只有弦：膜的家族', '0 维点 · 1 维弦 · 2 维膜 · 更高维的膜');
  const w = (R.w - 3 * 40) / 4, y = R.y + 220;
  [['点', 0], ['弦', 1], ['二维膜', 2], ['三维膜……', 3]].forEach(([s, d], i) => { const x = R.x + i * (w + 40), cx = x + w / 2, cy = y + 200, u = pop(t, .4 + i * 1.2);
    al(g, u, () => { rr(g, x, y, w, 440, 18, 'rgba(14,20,36,.9)', C.line2, 2);
      if (d === 0) dot(g, cx, cy, 10, C.fg);
      if (d === 1) ostring(g, cx - 120, cy, cx + 120, cy, 2, 30, t * 3, C.gold, 4);
      if (d === 2) { const pts = []; for (let k = 0; k <= 10; k++) { const yy = cy - 90 + k * 18; const row = []; for (let j = 0; j <= 20; j++) { const xx = cx - 130 + j * 13; row.push([xx + (k - 5) * 6, yy + 10 * Math.sin(j * .5 + t * 2 + k * .4)]); } line(g, row, 'rgba(92,180,255,.6)', 1.5); } }
      if (d === 3) { for (let k = 0; k < 3; k++) rr(g, cx - 100 + k * 20, cy - 90 + k * 20, 180, 140, 6, 'rgba(199,155,255,.08)', C.p, 2); }
      txt(g, s, cx, y + 400, C.fg, fnt(800, 30), 'center'); });
  });
  al(g, pop(t, 7), () => txt(g, '完整的 M 理论方程：至今没人写出来', R.x + R.w / 2, R.y + 760, C.gold, fnt(700, 28), 'center'));
};

AN.bh = (g, t, R, st) => {
  const tk = st.tk, cx = R.x + R.w * .3, cy = R.y + 450;
  hdr(g, R, ['黑洞有温度，也有熵', '1996：弦论数出黑洞的微观状态', '黑洞 ⟷ 无质量粒子', '膜包住缩小的三维球面'][st.k], ['贝肯斯坦、霍金（1970 年代）', '施特罗明格、瓦法', '卡拉比–丘形状转变（1995，格林、莫里森、施特罗明格）', '球面缩到零 → “黑洞”质量也降到零'][st.k]);
  if (st.k === 3) { const u = SS((tk - 1) / 6), r = LERP(150, 6, u), x = R.x + R.w * .3; g.strokeStyle = C.p; g.lineWidth = 3; for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(x, cy, r, r * (.3 + k * .35), 0, 0, TAU); g.stroke(); } g.save(); g.strokeStyle = C.o; g.lineWidth = 6; g.shadowColor = C.o; g.shadowBlur = 20; g.beginPath(); g.arc(x, cy, r + 12, 0, TAU); g.stroke(); g.restore(); txt(g, '三维膜', x, cy - r - 50, C.o, fnt(700, 24), 'center'); const mx = R.x + R.w * .62, my = R.y + 640; line(g, [[mx, my], [mx + 500, my]], C.fg3, 2); line(g, [[mx, my], [mx, my - 340]], C.fg3, 2); txt(g, '质量', mx - 14, my - 340, C.fg2, fnt(600, 22), 'right'); txt(g, '球面大小 →', mx + 500, my + 34, C.fg2, fnt(600, 22), 'right'); line(g, [[mx, my], [mx + 450, my - 300]], C.o, 3); dot(g, mx + 450 * (1 - u), my - 300 * (1 - u), 10, C.gold); if (u > .95) txt(g, '无质量粒子', mx + 20, my - 40, C.b, fnt(700, 26)); return; }
  if (st.k <= 1) {
    glow(g, cx, cy, 300, 'rgba(255,178,92,.2)');
    g.save(); g.translate(cx, cy); g.scale(1, .3); for (let i = 0; i < 3; i++) { g.strokeStyle = `rgba(255,178,92,${.6 - i * .15})`; g.lineWidth = 14 - i * 4; g.beginPath(); g.arc(0, 0, 220 + i * 26, 0, TAU); g.stroke(); } g.restore();
    dot(g, cx, cy, 130, '#02030A'); g.strokeStyle = C.o; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, 132, 0, TAU); g.stroke();
    for (let i = 0; i < 14; i++) { const ph = (t * .4 + HSH(i, 1)) % 1, a = HSH(i, 2) * TAU, r = 140 + ph * 260; al(g, 1 - ph, () => dot(g, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, C.gold)); }
    txt(g, '霍金辐射', cx, cy + 330, C.gold, fnt(600, 22), 'center');
  }
  const rx = R.x + R.w * .6;
  if (st.k === 0) al(g, pop(tk, 2), () => { txt(g, 'S = A / 4', rx + 200, R.y + 330, C.gold, fnt(800, 80, 'serif'), 'center'); txt(g, '熵 = 视界面积 / 4（普朗克单位）', rx + 200, R.y + 420, C.fg2, fnt(600, 24), 'center'); txt(g, '微观状态是什么？', rx + 200, R.y + 560, C.fg, fnt(800, 34), 'center'); });
  if (st.k === 1) {
    const n = Math.min(64, Math.floor(tk * 8)); for (let i = 0; i < 64; i++) { const x = rx + (i % 8) * 50, y = R.y + 200 + Math.floor(i / 8) * 50; rr(g, x, y, 40, 40, 6, i < n ? 'rgba(92,180,255,.5)' : 'rgba(255,255,255,.04)', C.line2, 1); }
    al(g, pop(tk, 8), () => { txt(g, '弦论计数 ＝ 贝肯斯坦–霍金', rx + 200, R.y + 660, C.ok, fnt(800, 30), 'center'); check(g, rx + 60, R.y + 720, '连系数 1/4 都对上', 1); });
  }
  if (st.k === 2) {
    const u = SS((tk - 1) / 5), x0 = R.x + R.w * .2, x1 = R.x + R.w * .8;
    const x = LERP(x0, x1, u); dot(g, x0, cy, 100 * (1 - u) + 4, '#02030A'); g.strokeStyle = C.o; g.lineWidth = 2; g.beginPath(); g.arc(x0, cy, 100 * (1 - u) + 6, 0, TAU); g.stroke();
    al(g, u, () => { loop(g, x1, cy, 50, 3, 10, t * 3, C.b, 4, 100); txt(g, '无质量粒子', x1, cy + 120, C.b, fnt(700, 26), 'center'); });
    txt(g, '黑洞', x0, cy + 160, C.o, fnt(700, 26), 'center'); arrow(g, x0 + 160, cy, x1 - 120, cy, C.fg3, 3, 12);
    txt(g, '形状平滑转变', (x0 + x1) / 2, cy - 40, C.fg2, fnt(600, 24), 'center');
  }
};

AN.cosmo = (g, t, R, st) => {
  const tk = st.tk;
  if (st.k === 0) {
    hdr(g, R, '宇宙不缩到无穷小？', '依据 T 对偶的推测：开端是普朗克尺度的状态，而不是奇点');
    const x0 = R.x + 120, x1 = R.x + R.w - 80, y0 = R.y + 740, y1 = R.y + 180, xm = (x0 + x1) / 2;
    line(g, [[x0, y1], [x0, y0], [x1, y0]], C.fg3, 2); txt(g, '时间 →', x1, y0 + 36, C.fg3, fnt(600, 20), 'right'); txt(g, '宇宙大小', x0 - 14, y1, C.fg2, fnt(600, 22), 'right');
    const u = SS(tk / 4), pa = [], pb = [];
    for (let i = 0; i <= 100 * u; i++) { const s = i / 100, x = LERP(xm - 40, x1, s); pa.push([x, y0 - Math.pow(s, .6) * (y0 - y1 - 40)]); pb.push([x, y0 - 50 - Math.pow(s, .6) * (y0 - y1 - 90)]); }
    if (pa.length > 1) line(g, pa, C.fg3, 3, [8, 8]);
    al(g, pop(tk, 3), () => { const pts = []; for (let i = -100; i <= 100; i++) { const s = i / 100, x = LERP(xm - 40, x1, Math.max(0, s)) + (s < 0 ? s * (xm - 40 - x0) : 0); pts.push([x, y0 - 50 - Math.pow(Math.abs(s), .6) * (y0 - y1 - 90) * (s < 0 ? .5 : 1)]); } line(g, pts, C.gold, 4); txt(g, '经典图景：缩到一点（奇点）', xm + 40, y0 - 20, C.fg3, fnt(600, 22)); txt(g, '弦论推测：最小尺寸，可能有“之前”', xm - 30, y0 - 110, C.gold, fnt(700, 24), 'right'); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '为什么恰好三个维度展开？', '布兰登伯格–瓦法的设想（推测）');
    const w = (R.w - 8 * 20) / 9, y = R.y + 300;
    for (let i = 0; i < 9; i++) { const free = i < 3 && tk > 4, sz = free ? 40 + SS((tk - 4) / 4) * 34 : 40, x = R.x + i * (w + 20) + w / 2;
      g.strokeStyle = free ? C.gold : C.p; g.lineWidth = 3; g.beginPath(); g.arc(x, y + 120, sz, 0, TAU); g.stroke();
      if (!free) { g.strokeStyle = 'rgba(255,122,147,.8)'; g.lineWidth = 3; g.beginPath(); g.arc(x, y + 120, sz + 8, 0, TAU); g.stroke(); }
      txt(g, `${i + 1}`, x, y + 300, free ? C.gold : C.fg3, fnt(700, 24, 'mono'), 'center'); }
    txt(g, '红圈：缠绕的弦把维度箍住', R.x + 40, R.y + 700, C.r, fnt(600, 24));
    al(g, pop(tk, 4), () => txt(g, '三个维度里缠绕弦相遇、抵消 → 松开膨胀', R.x + 40, R.y + 750, C.gold, fnt(700, 24)));
    return;
  }
  if (st.k === 3) { hdr(g, R, '视界问题', '相距极远的两个方向，温度几乎一样'); const cx = R.x + R.w / 2, cy = R.y + 460; for (let i = 0; i < 900; i++) { const a = HSH(i, 1) * TAU, r = Math.sqrt(HSH(i, 2)) * 300; dot(g, cx + Math.cos(a) * r * 1.6, cy + Math.sin(a) * r * .9, 3, `rgba(255,${170 + HSH(i, 3) * 30 | 0},120,.5)`); } person(g, cx, cy, C.fg, 1.2); [[-1, C.b], [1, C.r]].forEach(([sg, col]) => { arrow(g, cx + sg * 40, cy, cx + sg * 440, cy, col, 3); dot(g, cx + sg * 470, cy, 14, col); txt(g, '2.725 K', cx + sg * 470, cy - 40, C.fg, fnt(700, 24, 'mono'), 'center'); }); al(g, pop(tk, 6), () => { txt(g, '暴胀：它们原本挨得很近', cx, R.y + 790, C.gold, fnt(700, 28), 'center'); }); return; }
  if (st.k === 4) { hdr(g, R, '平坦性问题', '暴胀把初始的弯曲拉平'); const cx = R.x + R.w / 2, cy = R.y + 460, s2 = LERP(120, 1600, SS((tk - 1) / 6)); g.save(); g.beginPath(); g.rect(R.x, R.y + 120, R.w, 640); g.clip(); g.strokeStyle = C.b; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy + s2 - 120, s2, 0, TAU); g.stroke(); g.restore(); person(g, cx, cy - 140, C.gold, 1); txt(g, s2 < 400 ? '小气球：弯曲明显' : '吹到极大：表面看起来是平的', cx, R.y + 820, C.fg, fnt(700, 28), 'center'); return; }
  if (st.k === 5) { hdr(g, R, '前大爆炸设想', '大爆炸是转折点，而不是开端（推测）'); const x0 = R.x + 120, x1 = R.x + R.w - 80, y0 = R.y + 740, y1 = R.y + 200, xm = (x0 + x1) / 2; line(g, [[x0, y0], [x1, y0]], C.fg3, 2); txt(g, '时间 →', x1, y0 + 36, C.fg3, fnt(600, 20), 'right'); const u = SS(tk / 5), pts = []; for (let i = 0; i <= 200 * u; i++) { const s = i / 200, d = Math.abs(s - .5); pts.push([LERP(x0, x1, s), y0 - (1 - Math.exp(-d * d * 30)) * (y0 - y1) * .9 - 30]); } if (pts.length > 1) line(g, pts, C.gold, 4); txt(g, '冷、空旷 → 变热变密', LERP(x0, xm, .3), y1, C.p, fnt(700, 24), 'center'); txt(g, '大爆炸：转折点', xm, y0 - 60, C.gold, fnt(800, 26), 'center'); txt(g, '我们熟悉的膨胀', LERP(xm, x1, .6), y1, C.b, fnt(700, 24), 'center'); txt(g, '纵轴：温度与密度（示意）', x0, y1 - 40, C.fg3, fnt(600, 20)); return; }
  hdr(g, R, '暴胀：极短时间内的指数膨胀', '普朗克卫星（2013、2018）数据与最简单的暴胀预言相符');
  const x0 = R.x + 120, x1 = R.x + R.w - 80, y0 = R.y + 740, y1 = R.y + 180;
  line(g, [[x0, y1], [x0, y0], [x1, y0]], C.fg3, 2); txt(g, '时间（对数）→', x1, y0 + 36, C.fg3, fnt(600, 20), 'right'); txt(g, '大小（对数）', x0 - 14, y1, C.fg2, fnt(600, 22), 'right');
  const u = SS(tk / 4), pts = []; for (let i = 0; i <= 200 * u; i++) { const s = i / 200, x = LERP(x0, x1, s); const yv = s < .2 ? s * .3 : s < .35 ? .06 + (s - .2) / .15 * .6 : .66 + (s - .35) * .45; pts.push([x, y0 - yv * (y0 - y1)]); }
  if (pts.length > 1) line(g, pts, C.gold, 4);
  if (u > .3) { rr(g, LERP(x0, x1, .2), y1, LERP(x0, x1, .35) - LERP(x0, x1, .2), y0 - y1, 8, 'rgba(255,210,122,.07)'); txt(g, '暴胀', LERP(x0, x1, .275), y1 + 30, C.gold, fnt(800, 28), 'center'); }
};

AN.holo = (g, t, R, st) => {
  hdr(g, R, st.k === 0 ? '1997：马尔达西那对偶' : '全息原理的应用', st.k === 0 ? '五维有引力的弦论 ＝ 四维边界上无引力的量子场论' : '弦论最大的“副产品”');
  const cx = R.x + R.w * .32, cy = R.y + 430, rw = 230, rh = 250;
  g.strokeStyle = C.b; g.lineWidth = 3; g.beginPath(); g.ellipse(cx, cy - rh, rw, rw * .3, 0, 0, TAU); g.stroke();
  line(g, [[cx - rw, cy - rh], [cx - rw, cy + rh]], C.b, 3); line(g, [[cx + rw, cy - rh], [cx + rw, cy + rh]], C.b, 3);
  g.beginPath(); g.ellipse(cx, cy + rh, rw, rw * .3, 0, 0, Math.PI); g.stroke();
  for (let i = 0; i < 18; i++) { const a = HSH(i, 1) * TAU, r = HSH(i, 2) * 180, y = cy - 200 + HSH(i, 3) * 400; loop(g, cx + Math.cos(a + t * .2) * r * .9, y, 10, 2, 3, t * 3 + i, 'rgba(255,210,122,.8)', 2); }
  for (let i = 0; i < 40; i++) { const a = i / 40 * TAU + t * .1, y = cy - rh + 20 + (i % 10) * 56; const side = Math.cos(a) > 0; if (!side) continue; dot(g, cx + Math.sin(a) * rw, y, 4, C.b); }
  txt(g, '内部：有引力的弦论', cx, cy, C.gold, fnt(700, 24), 'center'); txt(g, '边界：无引力的量子场论', cx, cy + rh + 75, C.b, fnt(700, 24), 'center');
  const rx = R.x + R.w * .62;
  if (st.k === 0) al(g, pop(t, 3), () => { rr(g, rx, R.y + 260, R.w * .36, 300, 18, 'rgba(14,20,36,.94)', C.gold, 2); wrapTxt(g, '一个有引力的世界，可以完全编码在低一维的边界上', rx + 30, R.y + 320, R.w * .36 - 60, 42, C.fg, fnt(700, 30)); });
  else { [['夸克–胶子等离子体', C.r], ['凝聚态物理', C.g], ['量子信息与纠缠', C.p], ['黑洞信息问题', C.o]].forEach(([s, col], i) => chip(g, s, rx, R.y + 240 + i * 110, col, pop(st.tk, .5 + i * .8), 28)); }
};

const drawRS = (g, x, y, w, h, t) => { const a = x - w * .35, b = x + w * .35; [a, b].forEach((xx, i) => { rr(g, xx - 8, y - h * .4, 16, h * .8, 4, i ? C.b : C.r); }); for (let k = 0; k < 6; k++) { const pts = []; for (let j = 0; j <= 30; j++) { const s = j / 30; pts.push([LERP(a, b, s), y - h * .35 + k * h * .14 * Math.exp(-s * 1.4) + (1 - Math.exp(-s * 1.4)) * h * .35]); } line(g, pts, 'rgba(255,210,122,.4)', 1.5); } txt(g, '引力膜', a, y + h * .45, C.r, fnt(600, 18), 'center'); txt(g, '我们的膜', b, y + h * .45, C.b, fnt(600, 18), 'center'); };
const drawLand = (g, x, y, w, h, t) => { const pts = []; for (let i = 0; i <= 120; i++) { const s = i / 120; pts.push([x - w / 2 + s * w, y + Math.sin(s * 23) * h * .15 + Math.sin(s * 7 + 1) * h * .2]); } line(g, pts, C.g, 3); for (let i = 0; i < 6; i++) { const s = (i + .5) / 6 + .02; } const s = .69; dot(g, x - w / 2 + s * w, y + Math.sin(s * 23) * h * .15 + Math.sin(s * 7 + 1) * h * .2 - 12, 10, C.gold); txt(g, '10⁵⁰⁰ 个山谷？', x, y - h * .38, C.g, fnt(700, 22), 'center'); };
const drawSwamp = (g, x, y, w, h, t) => { rr(g, x - w * .4, y - h * .35, w * .8, h * .7, 12, 'rgba(95,224,160,.08)', C.g, 2); g.beginPath(); g.ellipse(x - w * .12, y, w * .2, h * .22, 0, 0, TAU); g.fillStyle = 'rgba(255,210,122,.15)'; g.fill(); g.strokeStyle = C.gold; g.stroke(); txt(g, '景观', x - w * .12, y, C.gold, fnt(700, 20), 'center'); txt(g, '沼泽地', x + w * .22, y + h * .2, C.g, fnt(700, 20), 'center'); };
const drawBooks = (g, x, y, w, h, t) => { [[-1, C.r], [1, C.b]].forEach(([s, col]) => { rr(g, x + s * w * .18 - 60, y - h * .38, 120, h * .76, 6, 'rgba(14,20,36,.9)', col, 3); line(g, [[x + s * w * .18 - 40, y - h * .2], [x + s * w * .18 + 40, y - h * .2]], col, 3); }); };
const drawFire = (g, x, y, w, h, t) => { dot(g, x, y, h * .25, '#02030A'); for (let i = 0; i < 40; i++) { const a = i / 40 * TAU, r = h * .27 + Math.abs(Math.sin(t * 5 + i)) * 14; dot(g, x + Math.cos(a) * r, y + Math.sin(a) * r, 5, i % 2 ? C.o : C.bad); } };
const drawER = (g, x, y, w, h, t) => { [-1, 1].forEach(s => { dot(g, x + s * w * .3, y - h * .15, h * .14, '#02030A'); g.strokeStyle = C.p; g.lineWidth = 2; g.beginPath(); g.arc(x + s * w * .3, y - h * .15, h * .14, 0, TAU); g.stroke(); }); g.strokeStyle = 'rgba(199,155,255,.6)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - w * .3, y); g.quadraticCurveTo(x, y + h * .45, x + w * .3, y); g.stroke(); txt(g, '纠缠', x, y - h * .15, C.p, fnt(700, 20), 'center'); };
const drawPage = (g, x, y, w, h, t) => { const x0 = x - w * .4, x1 = x + w * .4, y0 = y + h * .35, y1 = y - h * .35; line(g, [[x0, y1], [x0, y0], [x1, y0]], C.fg3, 2); const u = SS(t / 3), pts = [], hw = []; for (let i = 0; i <= 50 * u; i++) { const s = i / 50, X = LERP(x0, x1, s); pts.push([X, y0 - (s < .5 ? s * 2 : 2 - s * 2) * (y0 - y1) * .9]); hw.push([X, y0 - s * (y0 - y1) * .95]); } if (pts.length > 1) { line(g, hw, C.fg3, 2, [6, 6]); line(g, pts, C.gold, 4); } txt(g, '佩奇曲线：先升后降', x, y1 - 6, C.gold, fnt(700, 20), 'center'); };

AN.tl_theory = (g, t, R, st) => timeline(g, R, st, t, [
  [1997, '马尔达西那对偶', '', -1, C.b],
  [1999, '兰德尔–桑德拉姆', '我们的宇宙可能是一张膜，引力漏进弯曲的额外维度，所以显得很弱', 0, C.b, drawRS],
  [2003, 'KKLT · 弦景观', '额外维度可以稳定下来，卷法多得惊人；常引用的数字是 10 的 500 次方种', 1, C.g, drawLand],
  [2003, '人择论证', '萨斯坎德等：我们的宇宙也许只是其中适合生命的一个', 1, C.g],
  [2005, '沼泽地纲领', '瓦法：看似合理的低能理论，未必能从弦论中得到', 2, C.g, drawSwamp],
  [2006, '公开的批评', '斯莫林《物理学的困惑》、沃伊特《Not Even Wrong》：批评弦论脱离实验', 2, C.r, drawBooks],
  [2012, '火墙悖论', 'AMPS 四人：落入黑洞的观察者，在视界处也许会撞上一道“火墙”', 3, C.o, drawFire],
  [2013, 'ER = EPR', '马尔达西那、萨斯坎德：量子纠缠和虫洞也许是一回事', 3, C.p, drawER],
  [2019, '岛屿与佩奇曲线', '多组学者用全息方法算出：黑洞蒸发时，信息如何流出', 3, C.gold, drawPage],
], 1996, 2027, [2000, 2005, 2010, 2015, 2020, 2025]);

const drawAccel = (g, x, y, w, h, t) => { const x0 = x - w * .4, x1 = x + w * .4, y0 = y + h * .35, y1 = y - h * .35; line(g, [[x0, y1], [x0, y0], [x1, y0]], C.fg3, 2); const pts = []; for (let i = 0; i <= 50; i++) { const s = i / 50; pts.push([LERP(x0, x1, s), y0 - (Math.pow(s, .7) * .55 + Math.pow(s, 4) * .45) * (y0 - y1)]); } line(g, pts, C.gold, 4); txt(g, '膨胀先减速、后加速', x, y1 - 6, C.gold, fnt(700, 20), 'center'); };
const drawLHC = (g, x, y, w, h, t) => { g.strokeStyle = C.b; g.lineWidth = 12; g.beginPath(); g.arc(x, y, h * .33, 0, TAU); g.stroke(); const a = t * 2; dot(g, x + Math.cos(a) * h * .33, y + Math.sin(a) * h * .33, 8, C.gold); dot(g, x + Math.cos(-a) * h * .33, y + Math.sin(-a) * h * .33, 8, C.r); };
const drawHiggs = (g, x, y, w, h, t) => { const x0 = x - w * .4, x1 = x + w * .4, y0 = y + h * .35; const pts = []; for (let i = 0; i <= 80; i++) { const s = i / 80; pts.push([LERP(x0, x1, s), y0 - (h * .5 * Math.exp(-s * 2.2) + h * .22 * Math.exp(-((s - .5) ** 2) / .002))]); } line(g, pts, C.g, 3); txt(g, '125 GeV', LERP(x0, x1, .5), y0 - h * .62, C.g, fnt(700, 20), 'center'); };
const drawNoSusy = (g, x, y, w, h, t) => { for (let i = 0; i < 4; i++) { g.save(); g.setLineDash([6, 6]); rr(g, x - w * .38 + i * w * .2, y - 40, w * .15, 80, 10, 'rgba(14,20,36,.6)', C.fg3, 2); g.restore(); txt(g, '？', x - w * .38 + i * w * .2 + w * .075, y, C.fg3, fnt(800, 30), 'center'); } cross(g, x, y + h * .32, 1, C.bad, 16); };
const drawDust = (g, x, y, w, h, t) => { for (let i = 0; i < 160; i++) dot(g, x + (HSH(i, 1) - .5) * w * .8, y + (HSH(i, 2) - .5) * h * .7, 2 + HSH(i, 3) * 3, `rgba(255,178,92,${.2 + HSH(i, 4) * .5})`); };
const drawSwirl = (g, x, y, w, h, t) => { for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + t; line(g, [[x + Math.cos(a) * 20, y + Math.sin(a) * 20], [x + Math.cos(a + .6) * h * .32, y + Math.sin(a + .6) * h * .32]], 'rgba(92,180,255,.7)', 2); } };
const drawGW = (g, x, y, w, h, t) => { const pts = []; for (let i = 0; i <= 200; i++) { const s = i / 200, f = 4 + Math.pow(s, 4) * 60, A = s < .85 ? .1 + s * .9 : Math.max(0, 1 - (s - .85) * 8); pts.push([x - w * .42 + s * w * .84, y + Math.sin(s * f) * A * h * .3]); } line(g, pts, C.b, 3); };
const drawEHT = (g, x, y, w, h, t) => { glow(g, x, y, h * .4, 'rgba(255,140,60,.8)'); dot(g, x, y, h * .15, '#02030A'); };
const drawPTA = (g, x, y, w, h, t) => { for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; dot(g, x + Math.cos(a) * w * .32, y + Math.sin(a) * h * .32, 6, C.p); if (Math.sin(t * 6 + i) > .7) glow(g, x + Math.cos(a) * w * .32, y + Math.sin(a) * h * .32, 20, 'rgba(199,155,255,.8)'); } ball(g, x, y, 22, C.b); };
const drawDESI = (g, x, y, w, h, t) => { const x0 = x - w * .4, x1 = x + w * .4; line(g, [[x0, y], [x1, y]], C.fg3, 2, [6, 6]); txt(g, '宇宙学常数', x1, y - 16, C.fg3, fnt(600, 18), 'right'); const pts = []; for (let i = 0; i <= 50; i++) { const s = i / 50; pts.push([LERP(x0, x1, s), y + (s < .6 ? -h * .2 * (1 - s / .6) : h * .12 * (s - .6) / .4)]); } line(g, pts, C.gold, 3); };
const drawG2 = (g, x, y, w, h, t) => { const x0 = x - w * .38, x1 = x + w * .38; line(g, [[x0, y + h * .3], [x1, y + h * .3]], C.fg3, 2); [[.62, '实验', C.b], [.6, '2025 理论', C.g], [.25, '2020 理论', C.fg3]].forEach(([s, l, col], i) => { const X = LERP(x0, x1, s), Y = y - h * .2 + i * h * .18; line(g, [[X - w * .06, Y], [X + w * .06, Y]], col, 3); dot(g, X, Y, 7, col); txt(g, l, x0, Y, col, fnt(600, 18)); }); };
const drawLS3 = (g, x, y, w, h, t) => { g.strokeStyle = C.fg3; g.lineWidth = 12; g.beginPath(); g.arc(x, y, h * .3, 0, TAU); g.stroke(); txt(g, '→ HL-LHC', x, y, C.gold, fnt(800, 26), 'center'); };

AN.tl_obs = (g, t, R, st) => timeline(g, R, st, t, [
  [1998, '宇宙加速膨胀', '超新星观测发现；背后是暗能量。2011 年诺贝尔物理学奖', 0, C.gold, drawAccel],
  [2008, 'LHC 启动', '周长 27 公里，至今世界最大的对撞机', 1, C.b, drawLHC],
  [2012, '发现希格斯粒子', '标准模型的最后一块拼图；2013 年诺贝尔物理学奖', 1, C.g, drawHiggs],
  [2026, '没有超对称', '到第三轮运行结束：没有超对称伙伴、额外维度或微型黑洞', 1, C.bad, drawNoSusy],
  [2014, 'BICEP2 宣布', '南极望远镜：早期宇宙引力波的偏振印记？一度轰动', 2, C.o, drawSwirl],
  [2015, '其实是尘埃', '与普朗克卫星联合分析：信号主要来自银河系尘埃', 2, C.o, drawDust],
  [2015, '引力波', '两个黑洞合并（2016 年公布）；2017 年诺贝尔物理学奖', 3, C.b, drawGW],
  [2019, '第一张黑洞照片', '事件视界望远镜：M87 星系中心的黑洞', 3, C.o, drawEHT],
  [2025, 'GW250114', '一次格外清晰的合并信号，验证霍金视界面积定理', 3, C.b, drawGW],
  [2023, '纳赫兹引力波背景', '脉冲星计时阵列；超大质量黑洞双星更常见，宇宙弦是候选之一', 4, C.p, drawPTA],
  [2025, 'DESI：暗能量在变？', '第二批数据：偏好随时间变化的暗能量，2.8–4.2σ，未达 5σ 发现标准', 4, C.gold, drawDESI],
  [2025, '缪子 g−2 终局', '最终测量与改进后的理论计算基本吻合，悬念大体解除', 5, C.g, drawG2],
  [2026, 'LHC 停机升级', '6 月底进入第三次长停机，改造为高亮度 LHC，几年后重启', 5, C.fg2, drawLS3],
], 1996, 2027, [2000, 2005, 2010, 2015, 2020, 2025]);

AN.scorecard = (g, t, R, st) => {
  hdr(g, R, st.k === 0 ? '这本书过时了吗？' : st.k === 1 ? '二十多年后的成绩单' : '今天怎么读', '');
  if (st.k === 0) {
    const it = [['相对论与量子力学', 1], ['弦的基本图像', 1], ['对偶与 M 理论', 1], ['黑洞熵', 1], ['“很快就能验证”的乐观', 0]];
    it.forEach(([s, ok], i) => { const y = R.y + 220 + i * 110, u = pop(t, .5 + i * 1.2); al(g, u, () => { rr(g, R.x + 100, y - 40, R.w - 200, 80, 14, 'rgba(14,20,36,.92)', ok ? C.ok : C.o, 2); txt(g, s, R.x + 140, y, C.fg, fnt(700, 28)); txt(g, ok ? '仍是标准内容' : '明显降温', R.x + R.w - 140, y, ok ? C.ok : C.o, fnt(700, 26), 'right'); }); });
    return;
  }
  const L = ['研究量子引力最成熟的工具', '全息对偶改变了对时空与信息的理解', '镜像对称等成果在数学中开花'], Rr = ['没有任何实验证据', '低能超对称没有出现', '弦景观让预言变得困难'];
  const w = (R.w - 60) / 2, y = R.y + 180;
  const a1 = st.k === 1 ? 1 : .5;
  al(g, a1, () => { rr(g, R.x, y, w, 520, 20, 'rgba(14,20,36,.92)', C.ok, 2); txt(g, '站住的部分', R.x + 40, y + 50, C.ok, fnt(800, 32)); L.forEach((s, i) => check(g, R.x + 40, y + 140 + i * 110, s, st.k === 1 ? pop(st.tk, .5 + i * 1) : 1, C.ok, 26));
    rr(g, R.x + w + 60, y, w, 520, 20, 'rgba(14,20,36,.92)', C.bad, 2); txt(g, '还没有的部分', R.x + w + 100, y + 50, C.bad, fnt(800, 32)); Rr.forEach((s, i) => { const u = st.k === 1 ? pop(st.tk, 5 + i) : 1; cross(g, R.x + w + 115, y + 140 + i * 110, u, C.bad, 11); al(g, u, () => txt(g, s, R.x + w + 150, y + 140 + i * 110, C.fg, fnt(600, 26))); }); });
  if (st.k === 2) al(g, pop(st.tk, .5), () => { rr(g, R.x + 100, y + 560, R.w - 200, 90, 16, 'rgba(255,210,122,.1)', C.gold, 2.5); txt(g, '把它当作清晰的导游 ＋ 带着之后的时间线去读', R.x + R.w / 2, y + 605, C.gold, fnt(800, 30), 'center'); });
};

AN.books = (g, t, R, st) => {
  hdr(g, R, '延伸阅读', '格林的后续著作（英文原版年份）');
  const B = [['The Elegant Universe', '宇宙的琴弦', 1999, C.gold], ['The Fabric of the Cosmos', '宇宙的结构', 2004, C.b], ['The Hidden Reality', '隐藏的现实', 2011, C.p], ['Until the End of Time', '直到时间的尽头', 2020, C.r]];
  const w = (R.w - 3 * 40) / 4;
  B.forEach(([en, zh, y, col], i) => { const x = R.x + i * (w + 40), yy = R.y + 200, u = pop(t, .4 + i * .6); al(g, u, () => { rr(g, x + 30, yy, w - 60, 420, 10, 'rgba(14,20,36,.95)', col, 3); rr(g, x + 30, yy, 18, 420, 4, col); txt(g, zh, x + w / 2 + 9, yy + 160, C.fg, fnt(800, 30), 'center'); wrapTxt(g, en, x + 70, yy + 230, w - 120, 30, C.fg2, fnt(600, 22)); txt(g, String(y), x + w / 2 + 9, yy + 370, col, fnt(800, 28, 'mono'), 'center'); }); });
  al(g, pop(t, 4), () => txt(g, '另有 2003 年 PBS 纪录片《The Elegant Universe》（三集）　·　谢谢观看', R.x + R.w / 2, R.y + 720, C.fg2, fnt(600, 24), 'center'));
};

function dualNet(g, R, tk) {
  const P = { M: [R.x + R.w * .5, R.y + 260], IIA: [R.x + R.w * .28, R.y + 420], HE: [R.x + R.w * .72, R.y + 420], IIB: [R.x + R.w * .14, R.y + 660], HO: [R.x + R.w * .6, R.y + 680], I: [R.x + R.w * .86, R.y + 680] };
  const NM = { M: '11 维 M 理论', IIA: 'IIA 型', HE: '杂化 E', IIB: 'IIB 型', HO: '杂化 O', I: 'I 型' }, CO = { M: C.gold, IIA: C.r, HE: C.p, IIB: C.o, HO: C.g, I: C.b };
  const E = [['I', 'HO', 'S', 0], ['IIB', 'IIB', 'S', 1], ['IIA', 'M', 'M', 2], ['HE', 'M', 'M', 2.4], ['IIA', 'IIB', 'T', 3.6], ['HO', 'HE', 'T', 4]];
  E.forEach(([a, b, k, t0]) => { const u = pop(tk, .5 + t0 * 1.6, .8); if (u <= 0) return; const [x0, y0] = P[a], [x1, y1] = P[b];
    al(g, u, () => { if (a === b) { g.strokeStyle = C.o; g.lineWidth = 4; g.beginPath(); g.arc(x0 - 110, y0 - 50, 50, 0, TAU); g.stroke(); txt(g, '自对偶', x0 - 110, y0 - 120, C.o, fnt(700, 22), 'center'); return; }
      line(g, [[x0, y0], [LERP(x0, x1, u), LERP(y0, y1, u)]], k === 'M' ? C.gold : k === 'S' ? C.fg : C.fg3, k === 'T' ? 3 : 4, k === 'T' ? [10, 8] : null);
      if (u > .95) txt(g, k === 'S' ? '强 ⟷ 弱' : k === 'T' ? 'R ⟷ 1/R' : '强耦合 → 第 11 维', (x0 + x1) / 2 + 12, (y0 + y1) / 2 - 22, k === 'M' ? C.gold : C.fg2, fnt(700, 20)); }); });
  Object.keys(P).forEach(k => { const [x, y] = P[k]; rr(g, x - 110, y - 40, 220, 80, 16, 'rgba(14,20,36,.96)', CO[k], 2.5); txt(g, NM[k], x, y, C.fg, fnt(800, k === 'M' ? 24 : 28), 'center'); });
}

AN.pert = (g, t, R, st) => {
  const tk = st.k === 0 ? t : st.tk;
  hdr(g, R, ['微扰论：一层一层加修正', '弦耦合常数决定近似灵不灵', '我们只看到了弱耦合下的样子'][st.k], ['近似 = 最简单的情形 + 第一层修正 + 第二层修正 + ……', '每多一个“洞”，就多乘一次 g', '九十年代以前的结论，几乎都假设 g 很小'][st.k]);
  // 弦的世界面：0、1、2 个洞
  const W = (R.w - 2 * 60) / 3, y = R.y + 200, H = 260;
  const g_ = st.k === 0 ? .3 : st.k === 1 ? LERP(.3, 1.6, SS((st.tk - 3) / 5)) : .3;
  for (let n = 0; n < 3; n++) {
    const x = R.x + n * (W + 60), cx = x + W / 2, cy = y + H / 2, u = st.k === 0 ? pop(tk, .4 + n * 1.5) : 1;
    al(g, u, () => {
      rr(g, x, y, W, H, 18, 'rgba(14,20,36,.9)', C.line2, 2);
      g.strokeStyle = C.gold; g.lineWidth = 3; g.beginPath(); g.ellipse(cx, cy, W * .36, H * .3, 0, 0, TAU); g.stroke();
      for (let h = 0; h < n; h++) { const hx = cx + (h - (n - 1) / 2) * 90; g.beginPath(); g.ellipse(hx, cy, 30, 14, 0, 0, TAU); g.stroke(); }
      txt(g, ['最简单的情形', '第一层修正', '第二层修正'][n], cx, y + H + 36, C.fg, fnt(700, 26), 'center');
      if (n) txt(g, `× g${n === 2 ? '²' : ''}`, x + W - 20, y + 30, C.gold, fnt(800, 30, 'serif'), 'right');
      if (n < 2) txt(g, '＋', x + W + 30, cy, C.fg3, fnt(800, 40), 'center');
    });
  }
  if (st.k === 1) {
    const bx = R.x + 80, by = R.y + 760, bw = R.w - 160;
    txt(g, `弦耦合常数 g = ${g_.toFixed(2)}`, bx, R.y + 560, g_ < 1 ? C.ok : C.bad, fnt(800, 30, 'mono'));
    [1, g_, g_ * g_, g_ ** 3].forEach((v, i) => { const h = Math.min(170, v * 110); rr(g, bx + 420 + i * 120, by - h, 70, h, 6, g_ < 1 ? 'rgba(95,211,154,.6)' : 'rgba(255,107,107,.6)'); txt(g, ['0', '1', '2', '3'][i] + ' 洞', bx + 455 + i * 120, by + 26, C.fg3, fnt(600, 20), 'center'); });
    txt(g, g_ < 1 ? '修正越来越小 → 前几项就够 ✓' : '修正越来越大 → 近似失效 ✗', bx + 960, by - 60, g_ < 1 ? C.ok : C.bad, fnt(700, 26));
  }
  if (st.k === 2) al(g, pop(st.tk, 4), () => { rr(g, R.x + 80, R.y + 620, R.w - 160, 80, 14, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '我们宇宙的 g 是多少？——不知道', R.x + R.w / 2, R.y + 660, C.gold, fnt(800, 28), 'center'); });
};

AN.future = (g, t, R, st) => {
  const tk = st.k === 0 ? t : st.tk;
  hdr(g, R, '原书第 15 章：还没回答的问题', ['① 根本原理是什么？', '② 能算出粒子表吗？', '③ 时空是基本的吗？'][st.k]);
  const cx = R.x + R.w / 2, cy = R.y + 440;
  if (st.k === 0) {
    rr(g, R.x + 60, R.y + 200, R.w * .4, 420, 18, 'rgba(14,20,36,.92)', C.ok, 2); txt(g, '广义相对论', R.x + 60 + R.w * .2, R.y + 250, C.ok, fnt(800, 30), 'center');
    txt(g, '等效原理', R.x + 60 + R.w * .2, R.y + 360, C.fg, fnt(800, 40), 'center'); arrow(g, R.x + 60 + R.w * .2, R.y + 400, R.x + 60 + R.w * .2, R.y + 480, C.ok, 4); txt(g, '方程', R.x + 60 + R.w * .2, R.y + 530, C.fg2, fnt(700, 30), 'center');
    al(g, pop(tk, 4), () => { const x = R.x + R.w * .54; rr(g, x, R.y + 200, R.w * .4, 420, 18, 'rgba(14,20,36,.92)', C.gold, 2); txt(g, '弦论', x + R.w * .2, R.y + 250, C.gold, fnt(800, 30), 'center'); txt(g, '？', x + R.w * .2, R.y + 360, C.gold, fnt(800, 60), 'center'); arrow(g, x + R.w * .2, R.y + 400, x + R.w * .2, R.y + 480, C.fg3, 4); txt(g, '方程（先找到了）', x + R.w * .2, R.y + 530, C.fg2, fnt(700, 30), 'center'); });
    return;
  }
  if (st.k === 1) {
    cyShape(g, R.x + R.w * .2, cy, 170, t * .5, C.p, 1); txt(g, '哪一种形状？', R.x + R.w * .2, cy + 220, C.p, fnt(700, 26), 'center');
    al(g, pop(tk, 2), () => { txt(g, '＋　g = ?', R.x + R.w * .42, cy, C.gold, fnt(800, 40), 'center'); arrow(g, R.x + R.w * .5, cy, R.x + R.w * .6, cy, C.fg3, 4); });
    const rows = [['电子质量', '0.511 MeV'], ['粒子代数', '3'], ['力的强度', '1/137 …']];
    rows.forEach(([a, b], i) => al(g, pop(tk, 4 + i * .6), () => { const y = R.y + 290 + i * 110; rr(g, R.x + R.w * .62, y - 40, R.w * .36, 80, 12, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, a, R.x + R.w * .64, y, C.fg, fnt(700, 26)); txt(g, b + '　?', R.x + R.w * .96, y, C.gold, fnt(700, 26, 'mono'), 'right'); }));
    return;
  }
  // k2：时空涌现
  const n = 22, u = SS((tk - 1) / 6);
  for (let i = 0; i <= n; i++) for (let j = 0; j <= 10; j++) { const x = R.x + 120 + i * (R.w - 240) / n, y = R.y + 200 + j * 46; const jit = (1 - u) * 18; dot(g, x + Math.sin(i * 3.1 + j + t * 2) * jit, y + Math.cos(j * 2.3 + i - t * 2) * jit, 3, `rgba(199,155,255,${.3 + .5 * (1 - u)})`); }
  al(g, u, () => { for (let i = 0; i <= n; i++) line(g, [[R.x + 120 + i * (R.w - 240) / n, R.y + 200], [R.x + 120 + i * (R.w - 240) / n, R.y + 660]], 'rgba(92,180,255,.35)', 1.5); for (let j = 0; j <= 10; j++) line(g, [[R.x + 120, R.y + 200 + j * 46], [R.x + R.w - 120, R.y + 200 + j * 46]], 'rgba(92,180,255,.35)', 1.5); });
  txt(g, u < .5 ? '更基本的东西……' : '……涌现出我们熟悉的时空（推测）', cx, R.y + 730, u < .5 ? C.p : C.b, fnt(700, 28), 'center');
};
