// 动画（上）：棋盘工具、片头、规则、为什么是两层
const WOOD = '#C99A5B', WOOD2 = '#B5844A', WLINE = 'rgba(60,36,12,.75)';
// 三维投影：n 路棋盘，cell 格宽，gap 层间距，th 旋转角，tilt 俯视压扁
function isoP(cx, cy, n, cell, gap, th = Math.PI / 4, tilt = .42) {
  const h = (n - 1) / 2, c = Math.cos(th), s = Math.sin(th);
  return (i, j, z) => { const a = i - h, b = j - h; return [cx + (a * c - b * s) * cell, cy + (a * s + b * c) * cell * tilt - z * gap]; };
}
function stone(g, x, y, r, col, a = 1, sq = 1) {
  if (a <= 0) return;
  al(g, a, () => {
    g.save(); g.translate(x, y); g.scale(1, sq);
    g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.arc(r * .12, r * .18, r, 0, TAU); g.fill();
    const gr = g.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
    if (col === 1) { gr.addColorStop(0, '#6a6f7a'); gr.addColorStop(.45, '#24272e'); gr.addColorStop(1, '#0a0b0e'); }
    else { gr.addColorStop(0, '#ffffff'); gr.addColorStop(.6, '#e6e8ee'); gr.addColorStop(1, '#a9aeb9'); }
    g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r, 0, TAU); g.fill(); g.restore();
  });
}
// 一层棋盘（三维视图）
function plate(g, P, n, z, a = 1, fill = WOOD) {
  al(g, a, () => {
    const q = [P(-.6, -.6, z), P(n - .4, -.6, z), P(n - .4, n - .4, z), P(-.6, n - .4, z)];
    g.save(); g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); q.forEach((p, i) => i ? g.lineTo(p[0], p[1] + 14) : g.moveTo(p[0], p[1] + 14)); g.closePath(); g.fill();
    g.fillStyle = fill; g.beginPath(); q.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fill();
    g.strokeStyle = WLINE; g.lineWidth = 1.6;
    for (let i = 0; i < n; i++) { const [a1, b1] = P(i, 0, z), [a2, b2] = P(i, n - 1, z); g.beginPath(); g.moveTo(a1, b1); g.lineTo(a2, b2); g.stroke(); const [c1, d1] = P(0, i, z), [c2, d2] = P(n - 1, i, z); g.beginPath(); g.moveTo(c1, d1); g.lineTo(c2, d2); g.stroke(); }
    g.restore();
  });
}
// 双层棋盘：stones = [[i,j,z,色,透明度]]，opt: {links, mark:[[i,j,z,col,r]], la: 下层透明度}
function dual(g, P, n, cell, stones, opt = {}) {
  const r = cell * .4, sq = .78;
  plate(g, P, n, 0, opt.la ?? 1, WOOD2);
  const draw = z => stones.filter(s => s[2] === z).map(s => [s, P(s[0], s[1], z)]).sort((a, b) => a[1][1] - b[1][1]).forEach(([s, p]) => stone(g, p[0], p[1], r, s[3], s[4] ?? 1, sq));
  (opt.under || []).forEach(f => f(0));
  draw(0);
  (opt.marks || []).filter(m => m[2] === 0).forEach(m => markAt(g, P, m, r));
  if (opt.links) opt.links.forEach(([i, j, col, a]) => { const p0 = P(i, j, 0), p1 = P(i, j, 1); al(g, a ?? 1, () => line(g, [p0, p1], col || C.gold, 3, [6, 6])); });
  plate(g, P, n, 1, opt.ua ?? .93);
  (opt.under || []).forEach(f => f(1));
  draw(1);
  (opt.marks || []).filter(m => m[2] === 1).forEach(m => markAt(g, P, m, r));
}
function markAt(g, P, [i, j, z, col, a = 1, lab], r) {
  const [x, y] = P(i, j, z);
  al(g, a, () => { g.save(); g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); g.ellipse(x, y, r * .75, r * .58, 0, 0, TAU); g.stroke(); g.restore(); if (lab) txt(g, lab, x, y, col, fnt(900, r, 'mono'), 'center'); });
}
// 平面棋盘：state 为 n*n 数组（0 空 1 黑 2 白）或 [[i,j,色,透明度]]
function flat(g, x, y, n, cell, stones, opt = {}) {
  const pad = cell * .7, W = (n - 1) * cell + pad * 2;
  rr(g, x - pad, y - pad, W, W, 10, opt.fill || WOOD, opt.border || null, 3);
  g.save(); g.strokeStyle = WLINE; g.lineWidth = 1.6;
  for (let i = 0; i < n; i++) { g.beginPath(); g.moveTo(x + i * cell, y); g.lineTo(x + i * cell, y + (n - 1) * cell); g.stroke(); g.beginPath(); g.moveTo(x, y + i * cell); g.lineTo(x + (n - 1) * cell, y + i * cell); g.stroke(); }
  g.restore();
  if (opt.label) txt(g, opt.label, x + (n - 1) * cell / 2, y - pad - 30, opt.lcol || C.fg2, fnt(800, 26), 'center');
  (opt.under || []).forEach(f => f());
  stones.forEach(([i, j, c, a]) => stone(g, x + i * cell, y + j * cell, cell * .45, c, a ?? 1));
  (opt.over || []).forEach(f => f());
  return (i, j) => [x + i * cell, y + j * cell];
}

AN.open = (g, t, R, st) => {
  stars(g, R, t, 90, .35);
  const t0 = 4.6;
  // 左侧：曾经的想法
  const ideas = [['圆筒', 0], ['环面', 1], ['双曲', 2]];
  ideas.forEach(([s, i]) => {
    const u = pop(t, t0 + i * .5), x = R.x + 40, y = R.y + 40 + i * 260, w = 380, h = 220;
    al(g, u * (t > t0 + 9 ? .45 : 1), () => {
      rr(g, x, y, w, h, 18, 'rgba(14,20,36,.94)', C.line2, 2);
      txt(g, s, x + 30, y + 40, C.fg, fnt(800, 30));
      const cx = x + w / 2 + 40, cy = y + 125;
      g.save(); g.strokeStyle = C.b; g.lineWidth = 2.5;
      if (i === 0) { g.beginPath(); g.ellipse(cx, cy - 50, 90, 22, 0, 0, TAU); g.stroke(); g.beginPath(); g.ellipse(cx, cy + 55, 90, 22, 0, 0, Math.PI); g.stroke(); line(g, [[cx - 90, cy - 50], [cx - 90, cy + 55]], C.b, 2.5); line(g, [[cx + 90, cy - 50], [cx + 90, cy + 55]], C.b, 2.5); for (let k = 1; k < 4; k++) { g.beginPath(); g.ellipse(cx, cy - 50 + k * 26, 90, 22, 0, 0, Math.PI); g.stroke(); } }
      if (i === 1) { g.beginPath(); g.ellipse(cx, cy, 120, 60, 0, 0, TAU); g.stroke(); g.beginPath(); g.ellipse(cx, cy - 6, 50, 18, 0, 0, Math.PI); g.stroke(); g.beginPath(); g.ellipse(cx, cy + 6, 40, 12, 0, Math.PI, TAU); g.stroke(); }
      if (i === 2) { g.beginPath(); g.arc(cx, cy, 80, 0, TAU); g.stroke(); const H = window.HYP; g.lineWidth = 1; g.strokeStyle = 'rgba(92,180,255,.6)'; H.e.forEach(([a, b]) => { g.beginPath(); g.moveTo(cx + H.p[a][0] * 80, cy + H.p[a][1] * 80); g.lineTo(cx + H.p[b][0] * 80, cy + H.p[b][1] * 80); g.stroke(); }); }
      g.restore();
    });
  });
  // 右侧：两层棋盘升起
  const u = pop(t, t0 + 2.5, 1.2), lift = SS((t - (t0 + 6)) / 2.2);
  const P = isoP(R.x + R.w * .66, R.y + 560, 7, 62, 20 + 250 * lift, Math.PI / 4 + Math.sin(t * .15) * .08);
  al(g, u, () => {
    const S = [[2, 3, 1, 1], [3, 3, 1, 2], [4, 2, 1, 1], [3, 4, 0, 2], [2, 2, 0, 1], [4, 4, 1, 2]];
    dual(g, P, 7, 62, S, { links: lift > .5 ? [[2, 2, C.gold, (lift - .5) * 2], [3, 3, C.gold, (lift - .5) * 2]] : [], la: lift });
    al(g, pop(t, t0 + 8.5), () => { txt(g, '把两张棋盘叠起来', R.x + R.w * .66, R.y + 40, C.gold, fnt(900, 44, 'serif'), 'center'); });
  });
};

AN.open2 = (g, t, R, st) => {
  const P = isoP(R.x + R.w / 2, R.y + 340, 9, 44, 270, Math.PI / 4 + t * .03);
  const G = window.GAME ? window.GAME.at(110) : [];
  dual(g, P, 9, 44, G.map(s => [...s, .9]));
  const ch = ['规则', '为什么是两层', '新棋形', '模拟数据', '怎么开始下'];
  const w = 300, gap = 30, x0 = R.x + (R.w - (5 * w + 4 * gap)) / 2;
  ch.forEach((s, i) => al(g, pop(t, 1 + i * .35), () => { const x = x0 + i * (w + gap), y = R.y + 680; rr(g, x, y, w, 96, 16, 'rgba(14,20,36,.95)', C.line2, 2); txt(g, String(i + 1).padStart(2, '0'), x + 26, y + 48, C.gold, fnt(800, 28, 'mono')); txt(g, s, x + 78, y + 48, C.fg, fnt(700, 28)); }));
};

// ---------- 01 规则 ----------
AN.layers = (g, t, R, st) => {
  const P = isoP(R.x + R.w * .42, R.y + 520, 7, 66, 280);
  const pu = pop(t, 1), nu = pop(t, 2.2), vu = pop(t, 4.2);
  const pulse = .6 + .4 * Math.sin(t * 4);
  dual(g, P, 7, 66, [[3, 3, 1, 1, pu]], {
    links: [[3, 3, C.gold, vu]],
    marks: [[2, 3, 1, C.b, nu * pulse], [4, 3, 1, C.b, nu * pulse], [3, 2, 1, C.b, nu * pulse], [3, 4, 1, C.b, nu * pulse], [3, 3, 0, C.gold, vu * pulse]],
  });
  const x = R.x + R.w * .78, y = R.y + 200;
  al(g, nu, () => { dot(g, x, y, 10, C.b); txt(g, '同层：前后左右 4 个', x + 26, y, C.fg, fnt(700, 30)); });
  al(g, vu, () => { dot(g, x, y + 80, 10, C.gold); txt(g, '另一层：正对着的 1 个', x + 26, y + 80, C.fg, fnt(700, 30)); });
  al(g, pop(t, 6.5), () => { txt(g, '上层', P(-1.5, 0, 1)[0], P(-1.5, 0, 1)[1], C.fg2, fnt(800, 28), 'center'); txt(g, '下层', P(-1.5, 0, 0)[0], P(-1.5, 0, 0)[1], C.fg2, fnt(800, 28), 'center'); });
};

AN.libs = (g, t, R, st) => {
  const P = isoP(R.x + R.w * .36, R.y + 500, 7, 60, 270);
  const items = [[0, 0, '角', 3, C.r], [0, 3, '边', 4, C.o], [3, 3, '中间', 5, C.g]];
  const nb = (i, j) => [[i + 1, j], [i - 1, j], [i, j + 1], [i, j - 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < 7 && b < 7);
  const S = [], M = [], L = [];
  items.forEach(([i, j, , , col], k) => { const u = pop(t, .8 + k * 1.6); S.push([i, j, 1, 1, u]); nb(i, j).forEach(([a, b]) => M.push([a, b, 1, col, u * .9])); M.push([i, j, 0, col, u * .9]); L.push([i, j, col, u]); });
  dual(g, P, 7, 60, S, { marks: M, links: L });
  // 右侧表格
  const x = R.x + R.w * .66, y = R.y + 120, w = Math.min(560, R.x + R.w - x - 10);
  al(g, pop(t, .5), () => {
    txt(g, '一颗子的气', x, y, C.fg, fnt(800, 32));
    txt(g, '普通', x + w * .5, y + 60, C.fg3, fnt(700, 24), 'center'); txt(g, '双层', x + w * .82, y + 60, C.gold, fnt(700, 24), 'center');
  });
  items.forEach(([, , s, n, col], k) => al(g, pop(t, 1 + k * 1.6), () => { const yy = y + 120 + k * 76; dot(g, x + 10, yy, 9, col); txt(g, s, x + 32, yy, C.fg, fnt(700, 30)); txt(g, String(n - 1), x + w * .5, yy, C.fg2, fnt(800, 36, 'mono'), 'center'); arrow(g, x + w * .58, yy, x + w * .72, yy, C.fg3, 3, 10); txt(g, String(n), x + w * .82, yy, C.gold, fnt(900, 40, 'mono'), 'center'); }));
  al(g, pop(t, 6.5), () => {
    const yy = y + 400; rr(g, x - 10, yy, w + 10, 210, 16, 'rgba(14,20,36,.94)', C.line2, 2);
    txt(g, '照搬普通围棋', x + 14, yy + 40, C.fg, fnt(800, 26));
    ['气、提子、禁止自杀、打劫', '只改一条：“相邻”多一个方向'].forEach((s, i) => { dot(g, x + 20, yy + 100 + i * 56, 6, i ? C.gold : C.b); txt(g, s, x + 40, yy + 100 + i * 56, i ? C.gold : C.fg2, fnt(600, 25)); });
  });
};

AN.cross = (g, t, R, st) => {
  const P = isoP(R.x + R.w * .4, R.y + 500, 7, 64, 270);
  const S = [[3, 3, 1, 1], [3, 3, 0, 1]];
  const libs = [[2, 3, 1], [4, 3, 1], [3, 2, 1], [3, 4, 1], [2, 3, 0], [4, 3, 0], [3, 2, 0], [3, 4, 0]];
  const tf = 4.5, step = .55;
  let n = 0; libs.forEach((l, k) => { const u = pop(t, tf + k * step, .35); if (u > 0) { S.push([l[0], l[1], l[2], 2, u]); if (u > .5) n++; } });
  const cap = pop(t, tf + libs.length * step + .6, .6);
  S[0][4] = 1 - cap; S[1][4] = 1 - cap;
  const mk = libs.filter((l, k) => t < tf + k * step).map(l => [l[0], l[1], l[2], C.b, .8]);
  dual(g, P, 7, 64, S, { links: [[3, 3, C.gold, pop(t, 1) * (1 - cap)]], marks: mk });
  const x = R.x + R.w * .74, y = R.y + 220;
  al(g, pop(t, 1.5), () => { txt(g, '同一块棋', x, y, C.gold, fnt(800, 34)); txt(g, '上下两颗子共享气', x, y + 54, C.fg2, fnt(600, 26)); });
  al(g, pop(t, 2.5), () => { txt(g, '气', x, y + 170, C.fg2, fnt(700, 28)); txt(g, String(8 - n), x + 60, y + 170, 8 - n <= 1 ? C.bad : C.fg, fnt(900, 72, 'mono')); });
  al(g, cap, () => txt(g, '两层的气都堵上，才能提掉', x - 40, y + 300, C.bad, fnt(800, 28)));
};

AN.score = (g, t, R, st) => {
  // 构造终局：黑占左侧，白占右侧（示意）
  const n = 7, cell = 50, A = [], B = [];
  const own = (i, j, z) => (z ? i + (j > 3 ? 1 : 0) : i - (j < 2 ? 1 : 0)) <= 3 ? 1 : 2;
  const wall = (i, j, z) => { const o = own(i, j, z); return [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => { const q = [i + a, j + b]; return q[0] >= 0 && q[1] >= 0 && q[0] < n && q[1] < n && own(q[0], q[1], z) !== o; }); };
  const lays = [0, 1].map(z => { const s = [], terr = []; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { if (wall(i, j, z)) s.push([i, j, own(i, j, z)]); else terr.push([i, j, own(i, j, z)]); } return { s, terr }; });
  let bk = 0, wh = 0; lays.forEach(L => { L.s.forEach(s => s[2] === 1 ? bk++ : wh++); L.terr.forEach(s => s[2] === 1 ? bk++ : wh++); });
  const ux = pop(t, .5), tu = pop(t, 3);
  [1, 0].forEach((z, k) => {
    const x = R.x + 60 + k * 470, y = R.y + 140;
    al(g, ux, () => flat(g, x, y, n, cell, lays[z].s, { label: z ? '上层' : '下层', under: [() => lays[z].terr.forEach(([i, j, c]) => al(g, tu, () => rr(g, x + i * cell - 14, y + j * cell - 14, 28, 28, 4, c === 1 ? '#1b1d22' : '#f2f3f6')))] }));
  });
  const x = R.x + 1000, y = R.y + 200;
  al(g, pop(t, 4.5), () => {
    txt(g, '数子法', x, y, C.fg, fnt(800, 34));
    txt(g, '子 + 围住的空', x, y + 50, C.fg3, fnt(600, 24));
    stone(g, x + 20, y + 140, 22, 1); txt(g, String(bk), x + 60, y + 140, C.fg, fnt(900, 56, 'mono'));
    stone(g, x + 20, y + 230, 22, 2); txt(g, String(wh), x + 60, y + 230, C.fg, fnt(900, 56, 'mono'));
  });
  al(g, pop(t, 6.5), () => { rr(g, R.x + 20, R.y + 680, 1100, 90, 16, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '打劫：任何一手都不许让全盘回到出现过的局面', R.x + 50, R.y + 725, C.fg, fnt(700, 28)); });
};

// ---------- 02 为什么是两层 ----------
AN.why = (g, t, R, st) => {
  const w = (R.w - 60) / 3, y = R.y + 30, h = 560;
  const P3 = [[0, '立方格子', '6 口气', '太难吃', '每手提子 0.22', C.b], [1, '双曲平面', '边比面积还多', '太难活', '三分之一下不完', C.r], [2, '双层棋盘', '只多 1 口气', '刚刚好', '每手提子 0.35', C.g]];
  P3.forEach(([k, name, a, verdict, num, col]) => {
    const u = K(st, k, .2, .7), x = R.x + k * (w + 30);
    al(g, u, () => {
      rr(g, x, y, w, h, 20, 'rgba(14,20,36,.94)', st.k === k ? col : C.line2, st.k === k ? 3 : 2);
      txt(g, name, x + 28, y + 46, C.fg, fnt(800, 32)); txt(g, a, x + 28, y + 92, C.fg3, fnt(600, 23));
      const cx = x + w / 2, cy = y + 300;
      if (k === 0) { // 立方格子 3×3×3
        const s = 70, Q = (i, j, z) => [cx + (i - j) * s * .87, cy + (i + j - 2) * s * .5 - (z - 1) * s];
        for (let z = 0; z < 3; z++) for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach(([a, b, c]) => { if (i + a < 3 && j + b < 3 && z + c < 3) line(g, [Q(i, j, z), Q(i + a, j + b, z + c)], 'rgba(92,180,255,.35)', 2); }); }
        const c0 = Q(1, 1, 1); [[0, 1, 1], [2, 1, 1], [1, 0, 1], [1, 2, 1], [1, 1, 0], [1, 1, 2]].forEach(([i, j, z], q) => { const p = Q(i, j, z); al(g, pop(t, .8 + q * .15), () => { line(g, [c0, p], C.gold, 4); markDot(g, p, C.gold); }); });
        stone(g, c0[0], c0[1], 24, 1);
      }
      if (k === 1) { const H = window.HYP, r = 150; g.save(); g.strokeStyle = 'rgba(255,122,147,.5)'; g.lineWidth = 1.5; const cy2 = cy - 25; H.e.forEach(([a, b]) => { g.beginPath(); g.moveTo(cx + H.p[a][0] * r, cy2 + H.p[a][1] * r); g.lineTo(cx + H.p[b][0] * r, cy2 + H.p[b][1] * r); g.stroke(); }); g.restore(); H.p.forEach((p, i) => dot(g, cx + p[0] * r, cy2 + p[1] * r, H.d[i] < 4 ? 4.5 : 6, H.d[i] < 4 ? C.r : C.fg)); line(g, [[cx - r - 4, cy], [cx - r - 4, cy]], C.r); g.save(); g.strokeStyle = C.line2; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy2, r + 8, 0, TAU); g.stroke(); g.restore(); }
      if (k === 2) { const P = isoP(cx, cy + 50, 5, 46, 150); dual(g, P, 5, 46, [[2, 2, 1, 1], [2, 2, 0, 2], [1, 2, 1, 2], [3, 1, 0, 1]], { links: [[2, 2, C.gold, 1]] }); }
      rr(g, x + 28, y + h - 120, w - 56, 46, 12, col + '22', col, 2); txt(g, verdict, x + w / 2, y + h - 97, col, fnt(800, 26), 'center');
      txt(g, num, x + w / 2, y + h - 40, C.fg2, fnt(700, 24, 'mono'), 'center');
    });
  });
  al(g, K(st, 2, 2.5), () => txt(g, '在熟悉的地图下面，多开一层地下室', R.x + R.w / 2, R.y + 690, C.gold, fnt(800, 34, 'serif'), 'center'));
};
function markDot(g, p, col) { dot(g, p[0], p[1], 9, col); }
