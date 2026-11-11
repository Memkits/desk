// 第三集画面（非地图）
function galv(g, x, y, v, lab = '电流计') { rr(g, x - 90, y - 70, 180, 120, 14, 'rgba(14,20,36,.95)', C.fg3, 2); g.save(); g.strokeStyle = C.fg3; g.lineWidth = 2; g.beginPath(); g.arc(x, y + 30, 70, Math.PI * 1.2, Math.PI * 1.8); g.stroke(); g.restore(); const a = -Math.PI / 2 + v * .7; line(g, [[x, y + 30], [x + 70 * Math.cos(a), y + 30 + 70 * Math.sin(a)]], C.r, 4); txt(g, lab, x, y + 80, C.fg3, fnt(600, 20), 'center'); }
Object.assign(AN, {
  oersted: (g, t, R, st) => {
    hdr(g, R, '奥斯特：电流的磁效应', '1820 · 哥本哈根 · 一周后安培在巴黎接手');
    const y = R.y + 300, on = t > 1.5 && Math.floor((t - 1.5) / 3) % 2 === 0; line(g, [[R.x + 80, y], [R.x + 1000, y]], on ? C.gold : C.fg3, 8); txt(g, on ? '通电' : '断电', R.x + 80, y - 40, on ? C.gold : C.fg3, fnt(700, 28));
    if (on) for (let i = 0; i < 8; i++) { const px = R.x + 100 + ((t * 200 + i * 115) % 900); dot(g, px, y, 6, '#fff'); }
    const cx = R.x + 540, cy = y + 230, tg = on ? Math.PI / 2 : 0; const ang = tg * SS(((t - 1.5) % 3) / .8) + (on ? 0 : Math.PI / 2 * (1 - SS(((t - 1.5) % 3) / .8))) * (t > 4.5 ? 1 : 0);
    g.save(); g.strokeStyle = C.fg3; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, 120, 0, TAU); g.stroke(); g.translate(cx, cy); g.rotate(ang); g.fillStyle = C.r; g.beginPath(); g.moveTo(0, -100); g.lineTo(12, 0); g.lineTo(-12, 0); g.fill(); g.fillStyle = C.b; g.beginPath(); g.moveTo(0, 100); g.lineTo(12, 0); g.lineTo(-12, 0); g.fill(); g.restore();
    notes(g, R.x + 1120, R.y + 230, [['导线通电，旁边的磁针偏转', 2], ['电流能产生磁', 3.2, C.gold], ['安培：电流与电流之间也有作用力', 5]], t);
  },
  induction: (g, t, R, st) => {
    hdr(g, R, '法拉第：电磁感应', '1831 · 伦敦皇家研究院');
    const cx = R.x + 520, cy = R.y + 430; for (let i = 0; i < 9; i++) { g.save(); g.strokeStyle = C.o; g.lineWidth = 6; g.beginPath(); g.ellipse(cx + i * 30, cy, 30, 110, 0, 0, TAU); g.stroke(); g.restore(); }
    const tt = (st.k === 0 ? t : st.tk + 6) % 6, x = tt < 2 ? LERP(R.x + 300, cx - 80, SS(tt / 2)) : tt < 3 ? cx - 80 : tt < 5 ? LERP(cx - 80, R.x + 300, SS((tt - 3) / 2)) : R.x + 300;
    const v = tt < 2 ? Math.sin(Math.PI * tt / 2) : tt >= 3 && tt < 5 ? -Math.sin(Math.PI * (tt - 3) / 2) : 0;
    rr(g, x - 200, cy - 40, 120, 80, 6, C.r); rr(g, x - 80, cy - 40, 120, 80, 6, C.b); txt(g, 'N', x - 140, cy, '#fff', fnt(800, 30), 'center'); txt(g, 'S', x - 20, cy, '#fff', fnt(800, 30), 'center');
    line(g, [[cx, cy + 110], [cx, cy + 250], [cx + 600, cy + 250], [cx + 240, cy + 110]], C.fg3, 3); galv(g, cx + 450, cy + 230, v);
    txt(g, tt < 2 ? '插入 → 指针一摆' : tt < 3 ? '不动 → 没有电流' : tt < 5 ? '拔出 → 反向一摆' : '', R.x + 80, R.y + 760, C.gold, fnt(800, 32));
    notes(g, R.x + 1200, R.y + 230, [['只有磁场变化时', .5, C.fg], ['线圈里才有电流', 1.5, C.gold], ['今天所有发电机的原理', 3, C.fg2]], st.k ? st.tk + 4 : t);
  },
  fieldlines: (g, t, R, st) => {
    hdr(g, R, '法拉第的力线', '把电和磁想象成空间里的“线”');
    const cx = R.x + 560, cy = R.y + 460; for (let i = 0; i < 400; i++) { const a = HSH(i, 1) * TAU, rr_ = 120 + HSH(i, 2) * 320; let x = cx + rr_ * Math.cos(a) * 1.4, y = cy + rr_ * Math.sin(a);
      const dx1 = x - (cx - 90), dx2 = x - (cx + 90), dy = y - cy, r1 = Math.hypot(dx1, dy) ** 3, r2 = Math.hypot(dx2, dy) ** 3; const bx = dx1 / r1 - dx2 / r2, by = dy / r1 - dy / r2, bm = Math.hypot(bx, by); const a2 = Math.atan2(by, bx);
      al(g, pop(t, .3 + HSH(i, 3) * 2.5, .4), () => { g.save(); g.translate(x, y); g.rotate(a2); g.fillStyle = '#9aa5b8'; g.fillRect(-9, -1.5, 18, 3); g.restore(); }); }
    rr(g, cx - 160, cy - 34, 160, 68, 6, C.r); rr(g, cx, cy - 34, 160, 68, 6, C.b); txt(g, 'N', cx - 80, cy, '#fff', fnt(800, 28), 'center'); txt(g, 'S', cx + 80, cy, '#fff', fnt(800, 28), 'center');
    notes(g, R.x + 1200, R.y + 230, [['铁屑沿看不见的“力线”排列', 1.5], ['法拉第：没上过大学，几乎不用数学', 3], ['麦克斯韦把力线写成了方程', 4.5, C.gold]], t);
  },
  carnot: (g, t, R, st) => {
    hdr(g, R, st.k === 0 ? '卡诺：热机效率的上限' : '卡诺的比喻：热像水，热机像水车', '《论火的动力》· 1824 · 巴黎');
    const hx = R.x + 300; rr(g, hx - 200, R.y + 160, 400, 110, 16, 'rgba(255,122,147,.25)', C.r, 3); txt(g, '高温热源 T₁', hx, R.y + 215, C.r, fnt(800, 30), 'center');
    rr(g, hx - 200, R.y + 640, 400, 110, 16, 'rgba(92,180,255,.25)', C.b, 3); txt(g, '低温热源 T₂', hx, R.y + 695, C.b, fnt(800, 30), 'center');
    if (st.k === 0) { const a = t * 2; g.save(); g.translate(hx, R.y + 455); g.rotate(a); rr(g, -60, -60, 120, 120, 60, 'rgba(14,20,36,.95)', C.fg2, 4); for (let i = 0; i < 6; i++) { g.rotate(TAU / 6); line(g, [[0, 0], [0, -60]], C.fg2, 3); } g.restore(); txt(g, '热机', hx + 90, R.y + 455, C.fg2, fnt(700, 26));
      arrow(g, hx, R.y + 280, hx, R.y + 385, C.r, 6, 16); arrow(g, hx, R.y + 525, hx, R.y + 630, C.b, 6, 16); arrow(g, hx + 70, R.y + 455, hx + 300, R.y + 455, C.gold, 6, 16); txt(g, '做功', hx + 310, R.y + 455, C.gold, fnt(800, 28));
      eq(g, '效率 ≤ 1 − T₂ / T₁', R.x + 1200, R.y + 330, C.gold, 52);
      notes(g, R.x + 900, R.y + 470, [['只由两个温度决定', 1.5], ['与用水蒸气还是空气无关', 2.8], ['例：T₁ = 500 K，T₂ = 300 K → 最多 40%', 4, C.fg2, 28]], t); return; }
    // 水车比喻
    const wx = hx, wy = R.y + 455; g.save(); g.translate(wx, wy); g.rotate(st.tk * 1.5); g.strokeStyle = C.g; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 90, 0, TAU); g.stroke(); for (let i = 0; i < 8; i++) { g.rotate(TAU / 8); line(g, [[0, 0], [0, -90]], C.g, 3); rr(g, -14, -104, 28, 20, 3, C.g); } g.restore();
    for (let i = 0; i < 10; i++) dot(g, wx - 100 + ((st.tk * 60 + i * 30) % 20), R.y + 280 + ((st.tk * 200 + i * 37) % 360), 6, C.b);
    notes(g, R.x + 900, R.y + 240, [['热质从高温“流”到低温，像水从高处落下', .5], ['这个图像是错的（热不是物质）', 2, C.bad], ['但效率上限的结论是对的', 3.2, C.gold], ['卡诺 1832 年死于霍乱，年仅 36 岁', 4.6, C.fg3, 26]], st.tk);
  },
  joule: (g, t, R, st) => {
    hdr(g, R, '焦耳：热功当量', '1843 · 曼彻斯特 · 能量守恒（迈尔 1842 · 亥姆霍兹 1847）');
    const bx = R.x + 380, by = R.y + 400; rr(g, bx - 160, by, 320, 300, 14, 'rgba(92,180,255,.2)', C.b, 3); line(g, [[bx, by - 120], [bx, by + 260]], C.fg2, 5);
    for (let i = 0; i < 4; i++) { const a = t * 3 + i * Math.PI / 2; line(g, [[bx, by + 160], [bx + 120 * Math.cos(a), by + 160 + 20 * Math.sin(a)]], C.fg2, 8); }
    const d = (t * 40) % 300; line(g, [[bx, by - 120], [bx + 400, by - 120], [bx + 400, by - 60 + d]], C.fg3, 2); rr(g, bx + 360, by - 60 + d, 80, 80, 6, '#9aa5b8'); txt(g, '重物下落', bx + 460, by - 20 + d, C.fg2, fnt(600, 24));
    const T0 = 15 + .4 * Math.min(1, t / 8); rr(g, bx - 230, by + 20, 30, 240, 15, 'rgba(255,255,255,.06)', C.fg3, 2); rr(g, bx - 224, by + 250 - 160 * (T0 - 14) / 2, 18, 160 * (T0 - 14) / 2 + 4, 8, C.r); txt(g, '温度升高', bx - 330, by + 290, C.r, fnt(700, 24));
    notes(g, R.x + 1060, R.y + 240, [['叶轮搅水，水温升高', 1], ['功和热可以互相转化', 2.5, C.fg], ['约 4.2 焦耳的功 = 1 卡热量', 4, C.gold], ['总能量守恒：热力学第一定律', 5.5, C.g]], t);
  },
  doubleslit: (g, t, R, st) => {
    const k2 = st.k >= 2;
    hdr(g, R, k2 ? '光是横波' : '托马斯·杨：双缝干涉', k2 ? '马吕斯 1808（偏振）· 菲涅耳与杨：振动垂直于传播方向' : '1801–1803 · 伦敦 · 菲涅耳 1818 · 巴黎');
    if (k2) { const y0 = R.y + 420; for (let i = 0; i <= 120; i++) { const x = R.x + 100 + i * 8, ph = i * .15 - st.tk * 4; dot(g, x, y0 + 120 * Math.sin(ph), 5, C.gold); if (i % 6 === 0) line(g, [[x, y0], [x, y0 + 120 * Math.sin(ph)]], C.gold + '66', 2); }
      arrow(g, R.x + 100, y0, R.x + 1120, y0, C.fg3, 2); txt(g, '传播方向', R.x + 1060, y0 + 40, C.fg3, fnt(600, 22)); arrow(g, R.x + 60, y0 + 140, R.x + 60, y0 - 140, C.r, 3); txt(g, '振动', R.x + 20, y0 - 170, C.r, fnt(700, 24));
      notes(g, R.x + 1240, R.y + 240, [['横波需要介质', 2, C.fg], ['于是设想：以太充满宇宙', 3.2, C.gold], ['（这个“以太”后来被抛弃）', 4.5, C.fg3, 26]], st.tk); return; }
    const sx = R.x + 80, wx = R.x + 420, scx = R.x + 980, cy = R.y + 460, d = 110, lam = 22; rr(g, wx - 8, R.y + 150, 16, cy - d / 2 - 14 - R.y - 150, 2, C.fg3); rr(g, wx - 8, cy - d / 2 + 14, 16, d - 28, 2, C.fg3); rr(g, wx - 8, cy + d / 2 + 14, 16, R.y + 770 - cy - d / 2 - 14, 2, C.fg3);
    for (let r = (t * 60) % lam; r < 360; r += lam) { [cy - d / 2, cy + d / 2].forEach(yy => { g.save(); g.strokeStyle = 'rgba(92,180,255,.35)'; g.lineWidth = 2; g.beginPath(); g.arc(wx, yy, r, -Math.PI / 2.4, Math.PI / 2.4); g.stroke(); g.restore(); }); }
    for (let x = sx; x < wx; x += lam) line(g, [[x + (t * 60) % lam, R.y + 220], [x + (t * 60) % lam, R.y + 700]], 'rgba(92,180,255,.35)', 2);
    const reveal = st.k === 0 ? pop(t, 1.5, 2) : 1; line(g, [[scx, R.y + 150], [scx, R.y + 770]], C.fg3, 3);
    for (let y = R.y + 150; y < R.y + 770; y += 3) { const r1 = Math.hypot(scx - wx, y - (cy - d / 2)), r2 = Math.hypot(scx - wx, y - (cy + d / 2)); const I = Math.cos(Math.PI * (r1 - r2) / lam) ** 2; al(g, reveal, () => { g.fillStyle = `rgba(255,210,122,${(I * .95).toFixed(2)})`; g.fillRect(scx + 10, y, 90 * I + 30, 3); }); }
    notes(g, R.x + 1180, R.y + 230, st.k === 0 ? [['两条缝 → 屏上明暗条纹', 2]] : [['波峰遇波峰：加强（亮）', .5, C.gold], ['波峰遇波谷：抵消（暗）', 1.6, C.fg], ['只有波能这样', 2.8, C.b], ['菲涅耳精确算出衍射图样', 4, C.fg2]], st.k === 0 ? t : st.tk);
  },
  emwave: (g, t, R, st) => {
    hdr(g, R, '麦克斯韦：电磁波', '1865 · 伦敦国王学院');
    const ox = R.x + 120, oy = R.y + 430, L = 1000, P = (x, y, z) => [ox + x + z * .55, oy - y - z * .35];
    line(g, [P(0, 0, 0), P(L, 0, 0)], C.fg3, 2); const u = st.k === 0 ? CL(t / 3) : 1;
    for (let i = 0; i <= 160 * u; i++) { const x = i / 160 * L, ph = x / 120 - (st.k ? st.tk : t) * 3; const e = 150 * Math.sin(ph), b = 150 * Math.sin(ph);
      if (i % 4 === 0) { line(g, [P(x, 0, 0), P(x, e, 0)], 'rgba(255,122,147,.55)', 2); line(g, [P(x, 0, 0), P(x, 0, b)], 'rgba(92,180,255,.55)', 2); } }
    txt(g, '电场 E', P(60, 170, 0)[0], P(60, 170, 0)[1], C.r, fnt(800, 28)); txt(g, '磁场 B', P(60, 0, 190)[0], P(60, 0, 190)[1] + 20, C.b, fnt(800, 28));
    if (st.k === 0) notes(g, R.x + 1240, R.y + 230, [['变化的电场 → 磁场', 1.5, C.r], ['变化的磁场 → 电场', 2.5, C.b], ['互相激发，向外传播', 3.5, C.fg], ['算出的波速 ≈ 3 × 10⁸ 米/秒', 5, C.gold]], t);
    else notes(g, R.x + 1240, R.y + 230, [['= 已测得的光速', .3, C.gold], ['光是电磁波', 1.5, C.fg, 40]], st.tk, 90);
  },
  maxwelld: (g, t, R, st) => {
    hdr(g, R, st.k === 0 ? '分子速度分布' : '玻尔兹曼：熵与微观状态数', st.k === 0 ? '麦克斯韦 1860 · 阿伯丁；玻尔兹曼 · 格拉茨' : 'S = k log W · 1877 · 格拉茨');
    const bx = R.x + 40, by = R.y + 160, bw = 620, bh = 560; rr(g, bx, by, bw, bh, 14, 'rgba(14,20,36,.6)', C.line2, 2);
    for (let i = 0; i < 70; i++) { const sp = 60 + 260 * HSH(i, 9) ** 1.4, a = HSH(i, 1) * TAU; let x = (HSH(i, 2) * (bw - 30) + sp * Math.cos(a) * t) % (2 * (bw - 30)); if (x < 0) x += 2 * (bw - 30); if (x > bw - 30) x = 2 * (bw - 30) - x;
      let y = (HSH(i, 3) * (bh - 30) + sp * Math.sin(a) * t) % (2 * (bh - 30)); if (y < 0) y += 2 * (bh - 30); if (y > bh - 30) y = 2 * (bh - 30) - y; dot(g, bx + 15 + x, by + 15 + y, 7, sp > 220 ? C.r : sp > 130 ? C.o : C.b); }
    if (st.k === 0) { const ox = R.x + 760, oy = R.y + 700, W = 800, H = 420; arrow(g, ox, oy, ox + W, oy, C.fg3, 2); arrow(g, ox, oy, ox, oy - H, C.fg3, 2); txt(g, '速度', ox + W - 40, oy + 34, C.fg3, fnt(600, 22)); txt(g, '分子数', ox - 10, oy - H - 20, C.fg3, fnt(600, 22));
      [[1, C.b, '低温'], [2, C.r, '高温']].forEach(([T, col, nm], j) => { const pts = []; for (let i = 0; i <= 80; i++) { const v = i / 80 * 4; pts.push([ox + i / 80 * W, oy - H * .9 * (v * v * Math.exp(-v * v / T) / (T / Math.E)) * (j ? .7 : 1)]); } al(g, pop(t, 1 + j * 1.5, .6), () => { line(g, pts, col, 4); txt(g, nm, pts[24 + j * 14][0] + 10, pts[24 + j * 14][1] - 20, col, fnt(700, 24)); }); });
      return; }
    const X = R.x + 760; [[2, '有序', 1], [10, '较乱', 0], [252, '最乱', 0]].forEach(([w, nm], i) => al(g, pop(st.tk, .5 + i * .8, .5), () => { const y = R.y + 200 + i * 160; for (let j = 0; j < 10; j++) dot(g, X + j * 34, y + 40, 12, i === 0 ? (j < 5 ? C.r : C.b) : (HSH(j, i) > .5 ? C.r : C.b)); txt(g, nm, X + 380, y + 40, C.fg, fnt(700, 28)); }));
    notes(g, X, R.y + 690, [['可能的排法越多，熵越大', 2.8, C.gold], ['当时很多人不相信原子存在', 4, C.fg2, 26]], st.tk, 56);
  },
  spectrum: (g, t, R, st) => {
    hdr(g, R, '光谱：元素的指纹', '夫琅禾费 1814 · 慕尼黑；基尔霍夫、本生 1859 · 海德堡');
    const x0 = R.x + 80, W = 1500, y0 = R.y + 200, H = 110, nm = l => x0 + (l - 400) / 300 * W;
    const HT = [[400, 275], [440, 245], [470, 225], [495, 185], [520, 130], [560, 75], [580, 55], [600, 35], [630, 12], [700, 0]]; const col = l => { let h = 0; for (let i = 1; i < HT.length; i++) if (l <= HT[i][0]) { const [a, ha] = HT[i - 1], [b, hb] = HT[i]; h = ha + (hb - ha) * (l - a) / (b - a); break; } return `hsl(${h},90%,55%)`; };
    for (let l = 400; l <= 700; l += 1) { g.fillStyle = col(l); g.fillRect(nm(l), y0, W / 300 + 1, H); }
    const D = [[431, 'G'], [486, 'F'], [518, 'b'], [527, 'E'], [589, 'D'], [656, 'C'], [687, 'B']]; D.forEach(([l, n], i) => al(g, pop(t, .8 + i * .2, .3), () => { g.fillStyle = '#000'; g.fillRect(nm(l) - 2, y0, 4, H); txt(g, n, nm(l), y0 - 20, C.fg2, fnt(700, 22), 'center'); }));
    txt(g, '太阳光谱中的暗线（夫琅禾费线）', x0, y0 + H + 40, C.fg2, fnt(600, 26));
    const EL = [['钠', [589, 589.6], C.o], ['氢', [410, 434, 486, 656], C.r], ['汞', [405, 436, 546, 577, 579], C.g]];
    EL.forEach(([n, ls, c], i) => al(g, pop(t, 3 + i * .8, .5), () => { const y = R.y + 440 + i * 110; g.fillStyle = '#05070c'; g.fillRect(x0, y, W, 60); ls.forEach(l => { g.fillStyle = col(l); g.fillRect(nm(l) - 3, y, 6, 60); }); txt(g, n, x0 - 20, y + 30, c, fnt(800, 30), 'right'); }));
    al(g, pop(t, 5.6, .6), () => txt(g, '每种元素有自己的谱线 → 可以分析太阳的成分', x0, R.y + 790, C.gold, fnt(800, 30)));
  },
  clouds: (g, t, R, st) => {
    hdr(g, R, '“两朵乌云”', '开尔文 · 1900 年 4 月 · 伦敦皇家研究院');
    const cl = (x, y, s, a) => al(g, a, () => { g.save(); g.fillStyle = '#4a5468'; [[0, 0, 70], [60, -30, 80], [130, 0, 70], [70, 20, 80]].forEach(([dx, dy, r]) => { g.beginPath(); g.arc(x + dx * s, y + dy * s, r * s, 0, TAU); g.fill(); }); g.restore(); });
    const A = [R.x + 220, R.y + 320], B = [R.x + 920, R.y + 320]; cl(A[0], A[1], 1.3, pop(t, .5, .8)); cl(B[0], B[1], 1.3, pop(t, 1.5, .8));
    al(g, pop(t, 1, .5), () => { txt(g, '以太风的零结果', A[0] + 90, A[1] + 200, C.fg, fnt(700, 30), 'center'); txt(g, '迈克耳孙-莫雷（1887）', A[0] + 90, A[1] + 244, C.fg3, fnt(500, 24), 'center'); });
    al(g, pop(t, 2, .5), () => { txt(g, '能量均分与比热', B[0] + 90, B[1] + 200, C.fg, fnt(700, 30), 'center'); txt(g, '（热辐射也有类似难题）', B[0] + 90, B[1] + 244, C.fg3, fnt(500, 24), 'center'); });
    const a2 = K(st, 1, .5, .8); al(g, a2, () => { arrow(g, A[0] + 90, A[1] + 290, A[0] + 90, A[1] + 380, C.gold, 4, 14); arrow(g, B[0] + 90, B[1] + 290, B[0] + 90, B[1] + 380, C.gold, 4, 14);
      txt(g, '相对论', A[0] + 90, A[1] + 430, C.gold, fnt(800, 44), 'center'); txt(g, '量子论', B[0] + 90, B[1] + 430, C.gold, fnt(800, 44), 'center'); });
  },
});
