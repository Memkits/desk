// 第一集动画：守住
// ---------- 片头（四集通用） ----------
function skyline(g, R, t, a) { // 左：沙洲古城剪影；右：郑州楼群
  al(g, a, () => {
    const gy = R.y + R.h - 40;
    const gr = g.createLinearGradient(0, R.y + 380, 0, gy); gr.addColorStop(0, 'rgba(255,178,92,0)'); gr.addColorStop(1, 'rgba(255,178,92,.12)'); g.fillStyle = gr; g.fillRect(R.x, R.y + 380, 760, gy - R.y - 380);
    const g2 = g.createLinearGradient(0, R.y + 380, 0, gy); g2.addColorStop(0, 'rgba(92,180,255,0)'); g2.addColorStop(1, 'rgba(92,180,255,.12)'); g.fillStyle = g2; g.fillRect(R.x + R.w - 760, R.y + 380, 760, gy - R.y - 380);
    // 古城：城墙 + 城楼 + 沙丘
    g.fillStyle = '#2A2418'; g.beginPath(); g.moveTo(R.x, gy); for (let x = 0; x <= 760; x += 10) g.lineTo(R.x + x, gy - 30 - 18 * Math.sin(x * .012) - 10 * Math.sin(x * .031)); g.lineTo(R.x + 760, gy); g.fill();
    g.fillStyle = '#3A3020'; g.fillRect(R.x + 150, gy - 120, 440, 90); for (let i = 0; i < 22; i++) g.fillRect(R.x + 150 + i * 20, gy - 134, 12, 14);
    g.fillRect(R.x + 320, gy - 200, 100, 80); g.beginPath(); g.moveTo(R.x + 300, gy - 196); g.lineTo(R.x + 370, gy - 236); g.lineTo(R.x + 440, gy - 196); g.fill();
    txt(g, '沙洲', R.x + 370, gy + 22, C.o, fnt(800, 26, 'serif'), 'center');
    // 郑州楼群
    for (let i = 0; i < 18; i++) { const x = R.x + R.w - 740 + i * 40, h = 90 + HSH(i, 7) * 230; g.fillStyle = '#18233A'; g.fillRect(x, gy - h, 34, h); for (let k = 0; k < h / 26 - 1; k++) if (HSH(i * 31 + k, 2) > .55) { g.fillStyle = 'rgba(255,210,122,.5)'; g.fillRect(x + 8 + (k % 2) * 12, gy - h + 12 + k * 26, 6, 9); } }
    txt(g, '郑州', R.x + R.w - 380, gy + 22, C.b, fnt(800, 26, 'serif'), 'center');
    // 通道
    const x0 = R.x + 560, x1 = R.x + R.w - 560, yy = R.y + 470;
    g.strokeStyle = 'rgba(255,210,122,.45)'; g.lineWidth = 3; g.setLineDash([10, 10]); g.beginPath(); g.moveTo(x0, yy + 80); g.quadraticCurveTo((x0 + x1) / 2, yy - 90, x1, yy + 80); g.stroke(); g.setLineDash([]);
    const ph = (t * .18) % 1, bx = (1 - ph) ** 2 * x0 + 2 * (1 - ph) * ph * (x0 + x1) / 2 + ph * ph * x1, byy = (1 - ph) ** 2 * (yy + 80) + 2 * (1 - ph) * ph * (yy - 90) + ph * ph * (yy + 80);
    rr(g, bx - 18, byy - 14, 36, 28, 6, C.gold); txt(g, '每天 ≤ 1 吨', (x0 + x1) / 2, yy + 40, C.gold, fnt(800, 30), 'center');
  });
}
const OPEN = {
  2: [['上一集', '沙洲守住了：不饿死、不病死'], ['这一集', '造弩练兵 · 远袭乌兰城']],
  3: [['上一集', '远袭夺回本钱，卖金引来注意'], ['这一集', '扛住秋季报复 · 结好西帐'], ['转折', '瓶颈从"钱"变成"信任与合规"']],
  4: [['上一集', '扛过秋天，与西帐结盟'], ['这一集', '连起散村 · 收复寿昌']],
};
AN.open = (g, t, R, st) => {
  const stages = [['阶段一', '守住', 'W01–W10', PH[1]], ['阶段二', '强军', 'W11–W24', PH[2]], ['阶段三', '外交分化', 'W25–W38', PH[3]], ['阶段四', '拓土', 'W39–W52', PH[4]]];
  const card4 = (u0, y, hot) => { const w = (R.w - 90) / 4; stages.forEach(([a, b, c, col], i) => { const u = pop(u0, i * .35), x = R.x + i * (w + 30), h = hot === undefined || hot === i;
    al(g, u * (h ? 1 : .4), () => { rr(g, x, y, w, 200, 18, 'rgba(14,20,36,.92)', col, hot === i ? 4 : 2); txt(g, a + ' · ' + c, x + 26, y + 40, col, fnt(700, 22)); txt(g, b, x + 26, y + 112, C.fg, fnt(800, 54, 'serif'));
      if (hot !== undefined && i < hot) { ticks(g, x + w - 60, y + 40, 1, C.ok); } }); }); };
  if (EP === 1) {
    if (st.k === 0) { skyline(g, R, t, 1); return; }
    skyline(g, R, t, .25);
    if (st.k === 1) { card4(st.tk - .2, R.y + 120); const D = [['不饿死、不病死', 0], ['造弩 · 远袭', 1], ['扛住报复 · 结盟', 2], ['连村 · 收复', 3]]; const w = (R.w - 90) / 4;
      D.forEach(([s, i]) => al(g, pop(st.tk, 2 + i * 2.2), () => txt(g, s, R.x + i * (w + 30) + 26, R.y + 280, C.fg2, fnt(600, 24)))); }
    if (st.k === 2) { card4(99, R.y + 120); [['架空故事', '城名、部落、机构都是虚构'], ['粗略估算', '价格和重量只比较量级'], ['AI 生成', '文稿画面 Claude · 配音 Gemini TTS']].forEach(([a, b], i) => { const u = pop(st.tk, .4 + i * .6), x = R.x + i * 590;
      al(g, u, () => { rr(g, x, R.y + 400, 550, 150, 16, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, a, x + 30, R.y + 450, C.gold, fnt(800, 32)); txt(g, b, x + 30, R.y + 505, C.fg2, fnt(500, 23)); }); }); }
    return;
  }
  // 第二到四集
  skyline(g, R, t, st.k === 0 && t < 5 ? .5 : .18);
  if (st.k === 0 && t < 5) return;
  card4(st.k === 0 ? t - 5 : 99, R.y + 110, EP - 1);
  const L = OPEN[EP];
  L.forEach(([a, b], i) => { if (st.n > 1 && i > st.k) return; const u = pop(st.n === 1 ? t - 6 - i * 3 : i === st.k ? (st.k === 0 ? t - 6 : st.tk) : 99, .3), y = R.y + 380 + i * 130;
    al(g, u, () => { g.translate((1 - u) * -20, 0); rr(g, R.x, y, R.w, 104, 16, 'rgba(14,20,36,.92)', (st.n === 1 ? i === L.length - 1 : i === st.k) ? C.gold : C.line2, 2); txt(g, a, R.x + 32, y + 52, (st.n === 1 ? i === L.length - 1 : i === st.k) ? C.gold : C.fg3, fnt(700, 26)); txt(g, b, R.x + 200, y + 52, C.fg, fnt(700, 34, 'serif')); }); });
};

// ---------- 01 背景与规则 ----------
AN.world = (g, t, R) => {
  const V = mapView({ x: R.x, y: R.y, w: 1060, h: R.h }, -100, 150, 1.55); drawMap(g, V, { steppe: true });
  site(g, V, 'sz', '沙洲', 'city', C.o, pop(t, .3), '不到千人');
  const [sx, sy] = V.P([0, 0]); for (let i = 0; i < 10; i++) { const an = i / 10 * 6.28 + t * .08, r = 70 + 8 * Math.sin(t + i); al(g, pop(t, 1 + i * .1) * .8, () => { g.translate(sx + r * Math.cos(an), sy + r * Math.sin(an)); g.rotate(an + 1.57); g.beginPath(); g.moveTo(0, -9); g.lineTo(7, 7); g.lineTo(-7, 7); g.closePath(); g.fillStyle = C.bad; g.fill(); }); }
  const E = V.P([-220, 360]), Wt = V.P([60, 330]);
  al(g, pop(t, 4), () => { chip(g, '东帐部（强）', E[0] - 90, E[1], C.bad); chip(g, '西帐部（弱）', Wt[0] - 80, Wt[1], C.p); arrow(g, E[0] + 100, E[1] + 30, Wt[0] - 90, Wt[1] + 30, C.fg3, 3); arrow(g, Wt[0] - 90, Wt[1] + 46, E[0] + 100, E[1] + 46, C.fg3, 3); txt(g, '内斗', (E[0] + Wt[0]) / 2 + 10, E[1] + 76, C.fg2, fnt(700, 22), 'center'); });
  const X = R.x + 1110, W = R.w - 1110;
  const ev = [['西域都护府丢失', '沙洲被围多年，人口凋零', C.fg3], ['可汗死', '部落分裂为东帐、西帐', C.bad], ['喘息期', '约半年到一年', C.gold]];
  ev.forEach(([a, b, col], i) => { const u = pop(t, .8 + i * 2.6), y = R.y + 40 + i * 180; al(g, u, () => { dot(g, X + 14, y + 30, 10, col); if (i < 2) line(g, [[X + 14, y + 50], [X + 14, y + 170]], C.line2, 2); txt(g, a, X + 46, y + 30, C.fg, fnt(800, 32, 'serif')); txt(g, b, X + 46, y + 74, C.fg2, fnt(500, 23)); }); });
  al(g, pop(t, 8), () => { hbar(g, X, R.y + 620, W, 26, SS((t - 8) / 2), C.gold); txt(g, '窗口期', X, R.y + 590, C.gold, fnt(700, 22)); txt(g, '0', X, R.y + 676, C.fg3, fnt(600, 18, 'mono')); txt(g, '6–12 个月', X + W, R.y + 676, C.fg3, fnt(600, 18, 'mono'), 'right'); });
};
AN.rules = (g, t, R) => {
  ttlTxt(g, R, '穿越规则', '已确认的设定');
  iconCards(g, t, { x: R.x, y: R.y, w: R.w }, [['≤1 t', '每天额度', '含他自己的体重', C.gold], ['累积', '可以攒', '未用额度可累积', C.o], ['≤两层楼', '体积上限', '单次携带总体积', C.b], ['回程', '也占额度', '往返共用一个额度池', C.p], ['✕ 人', '不能带人', '活物最大是猪仔', C.bad]], { y: R.y + 140, h: 300, t0: .8, dt: 1.6, bs: 52 });
  al(g, pop(t, 10), () => { rr(g, R.x, R.y + 500, R.w, 120, 16, 'rgba(255,210,122,.06)', C.line2, 1.5); txt(g, '两层楼按约 10 m × 9 m × 6 m ≈ 500 m³ 理解【假设】；只有光伏板、机床等大件才需要算体积', R.x + 30, R.y + 560, C.fg2, fnt(600, 24)); });
};
AN.quota = (g, t, R) => {
  ttlTxt(g, R, '每周能运多少？', '他本人单程按 80 kg 计【假设】');
  const x0 = R.x + 40, y0 = R.y + 160, bw = 200;
  for (let i = 0; i < 7; i++) { const u = pop(t, .5 + i * .25); al(g, u, () => { rr(g, x0 + i * (bw + 16), y0, bw, 120, 12, 'rgba(255,210,122,.12)', C.gold, 2); txt(g, '第' + '一二三四五六日'[i] + '天', x0 + i * (bw + 16) + bw / 2, y0 + 40, C.fg3, fnt(600, 20), 'center'); txt(g, '1 t', x0 + i * (bw + 16) + bw / 2, y0 + 82, C.fg, fnt(800, 32, 'mono'), 'center'); }); }
  const y1 = y0 + 200;
  al(g, pop(t, 3), () => { txt(g, '7 t', x0, y1 + 30, C.gold, fnt(800, 54, 'mono')); txt(g, '−', x0 + 150, y1 + 30, C.fg2, fnt(700, 54)); txt(g, '80 kg × 2', x0 + 210, y1 + 30, C.r, fnt(800, 54, 'mono')); txt(g, '=', x0 + 560, y1 + 30, C.fg2, fnt(700, 54)); txt(g, '≈ 6.8 t / 周', x0 + 630, y1 + 30, C.ok, fnt(800, 64, 'mono')); txt(g, '往返一次', x0 + 210, y1 + 90, C.fg3, fnt(500, 22)); });
  // 钱 vs 额度
  const X = R.x + 40, Y = R.y + 500, W = R.w - 80, H = 250;
  al(g, pop(t, 7), () => {
    line(g, [[X, Y + H], [X + W, Y + H]], C.line2, 2); txt(g, 'W01', X, Y + H + 26, C.fg3, fnt(600, 18, 'mono')); txt(g, 'W52', X + W, Y + H + 26, C.fg3, fnt(600, 18, 'mono'), 'right');
    const qy = Y + 40; line(g, [[X, qy], [X + W, qy]], C.ok, 3, [10, 8]); txt(g, '额度上限 6.8 t/周', X + W, qy - 20, C.ok, fnt(700, 21), 'right');
    const u = SS((t - 7.5) / 3), pts = []; for (let i = 0; i <= 60; i++) { const f = i / 60; if (f > u) break; const y = f < .45 ? Y + H - 60 - f * 120 : Math.max(qy, Y + H - 115 - (f - .45) * 900); pts.push([X + f * W, y]); }
    if (pts.length > 1) line(g, pts, C.gold, 5);
    al(g, pop(t, 9), () => { txt(g, '前半年：钱不够，额度用不满', X + W * .2, Y + H - 140, C.gold, fnt(700, 24), 'center'); });
    al(g, pop(t, 11), () => { txt(g, '后半年：钱够了，额度不够用', X + W * .78, qy + 50, C.ok, fnt(700, 24), 'center'); });
  });
};
AN.anchor = (g, t, R) => {
  ttlTxt(g, R, '锚点', '发起穿越：本人在锚点，货物在身边【假设】');
  const P = [[R.x, '现代侧', '中牟县 · 荒废苗圃', C.b], [R.x + R.w - 640, '沙洲侧', '都督府后院', C.o]];
  P.forEach(([x, a, b, col], i) => al(g, pop(t, .6 + i * .8), () => { rr(g, x, R.y + 130, 640, 200, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, x + 30, R.y + 180, col, fnt(700, 24)); txt(g, b, x + 30, R.y + 250, C.fg, fnt(800, 40, 'serif')); }));
  al(g, pop(t, 2), () => { const cx = R.x + R.w / 2; line(g, [[R.x + 660, R.y + 230], [R.x + R.w - 660, R.y + 230]], C.gold, 3, [10, 8]); packet(g, [[R.x + 660, R.y + 230], [R.x + R.w - 660, R.y + 230]], (t * .3) % 1, C.gold, 12); txt(g, '往返', cx, R.y + 200, C.gold, fnt(700, 24), 'center'); });
  // 一周作息
  const y = R.y + 420; al(g, pop(t, 4), () => txt(g, '一周作息（通常）', R.x, y, C.fg2, fnt(700, 24)));
  const days = '一二三四五六日'; for (let i = 0; i < 7; i++) { const u = pop(t, 4.5 + i * .2), m = i < 5, w = (R.w - 60) / 7; al(g, u, () => { rr(g, R.x + i * (w + 10), y + 30, w, 90, 12, m ? 'rgba(92,180,255,.15)' : 'rgba(255,178,92,.15)', m ? C.b : C.o, 2); txt(g, '周' + days[i], R.x + i * (w + 10) + w / 2, y + 58, C.fg3, fnt(600, 19), 'center'); txt(g, m ? '郑州' : '沙洲', R.x + i * (w + 10) + w / 2, y + 94, C.fg, fnt(800, 26), 'center'); }); }
  // 货怎么到荒地
  al(g, pop(t, 9), () => { const y2 = R.y + 640; rr(g, R.x, y2, R.w, 120, 16, 'rgba(255,210,122,.06)', C.gold, 2); txt(g, '实际问题：一吨多的货，怎么从城里运到荒地上？', R.x + 30, y2 + 60, C.gold, fnt(800, 30)); });
};
AN.city = (g, t, R) => {
  ttlTxt(g, R, '沙洲的家底', '推演采用的假设（A6–A8）');
  const x0 = R.x + 10, y0 = R.y + 140, cs = 17;
  for (let i = 0; i < 900; i++) { const c = i % 45, r = Math.floor(i / 45); const u = pop(t, .4 + r * .06, .4); if (u <= 0) continue; const sold = i < 120, young = i < 150;
    al(g, u, () => dot(g, x0 + c * cs + 8, y0 + r * cs + 8, 6, sold ? C.o : young ? 'rgba(255,178,92,.5)' : 'rgba(163,174,195,.45)')); }
  al(g, pop(t, 2.5), () => { const X = x0 + 45 * cs + 30; txt(g, '≈ 900 人', X, y0 + 20, C.fg, fnt(800, 44, 'serif')); dot(g, X + 8, y0 + 80, 7, C.o); txt(g, '能披甲作战 ≈ 120', X + 26, y0 + 80, C.fg, fnt(600, 24)); dot(g, X + 8, y0 + 120, 7, 'rgba(255,178,92,.5)'); txt(g, '青壮男子 ≈ 150', X + 26, y0 + 120, C.fg2, fnt(600, 24)); dot(g, X + 8, y0 + 160, 7, 'rgba(163,174,195,.6)'); txt(g, '其余多为妇孺老弱', X + 26, y0 + 160, C.fg2, fnt(600, 24)); txt(g, '马 ≈ 50 · 骆驼 ≈ 30 · 羊 ≈ 300', X, y0 + 210, C.fg3, fnt(500, 21)); });
  const y1 = R.y + 560;
  al(g, pop(t, 5), () => { txt(g, '存粮（半饷：每人每天 0.4 kg）', R.x, y1, C.fg2, fnt(700, 24)); for (let i = 0; i < 6; i++) { rr(g, R.x + i * 128, y1 + 30, 116, 70, 10, 'rgba(255,210,122,.15)', C.gold, 2); txt(g, '第' + (i + 1) + '周', R.x + i * 128 + 58, y1 + 65, C.fg, fnt(700, 21), 'center'); } txt(g, '→ 断粮', R.x + 6 * 128 + 10, y1 + 65, C.bad, fnt(800, 26)); });
  al(g, pop(t, 8), () => { const X = R.x + 1100; txt(g, '全城凑出的钱', X, y1, C.fg2, fnt(700, 24)); stat(g, X, y1 + 30, 290, 150, '5 kg', '碎银', C.fg2, 1); stat(g, X + 320, y1 + 30, 290, 150, '100 g', '金器', C.gold, 1); });
};
AN.zz = (g, t, R) => {
  ttlTxt(g, R, '现代侧：黑户起步', '前期完全不走官方渠道');
  [['身份证', '没有'], ['钱', '没有'], ['熟人', '一个都没有']].forEach(([a, b], i) => al(g, pop(t, .5 + i * .7), () => { const x = R.x + i * 380; rr(g, x, R.y + 120, 350, 130, 16, 'rgba(14,20,36,.92)', C.bad, 2); cross(g, x + 50, R.y + 185, 1); txt(g, a, x + 90, R.y + 170, C.fg, fnt(800, 30)); txt(g, b, x + 90, R.y + 212, C.fg3, fnt(500, 22)); }));
  const S = [['城中村', '月租 300 元 · 现金'], ['劳务市场', '装卸 · 清运'], ['日结', '一天约 200 元'], ['人脉', '靠力气和带兵的本事']];
  const w = (R.w - 3 * 60) / 4; S.forEach(([a, b], i) => { const u = pop(t, 4 + i * 1.3), x = R.x + i * (w + 60), y = R.y + 380; node(g, x, y, w, 140, a, [C.b, C.fg2, C.gold, C.ok][i], u, b); if (i < 3) arrow(g, x + w + 6, y + 70, x + w + 54, y + 70, C.fg3, 3, 12, pop(t, 4.6 + i * 1.3)); });
  al(g, pop(t, 10), () => txt(g, '直到很后期，他才因为和治安机关「安平署」的关系，得到第一次机会', R.x, R.y + 640, C.fg2, fnt(600, 25)));
};
AN.cast = (g, t, R) => {
  ttlTxt(g, R, '人物表');
  const A = [['萧镇北', '沙洲守将', '唯一能穿越的人', C.gold], ['韩烈', '副将', '留守主军', C.o], ['裴敬', '长史', '主政 · 配给 · 户籍', C.o], ['鲁三', '工匠头', '锻造 · 木工', C.o]];
  const B = [['老周', '二房东', '第一个收留他', C.b], ['大刘', '工地工友', '装卸队副手', C.b]];
  txt(g, '沙洲', R.x, R.y + 110, C.o, fnt(700, 24)); txt(g, '郑州', R.x + 1180, R.y + 110, C.b, fnt(700, 24));
  const card1 = ([n, r, d, col], x, y, u) => al(g, u, () => { g.translate(0, (1 - u) * 14); rr(g, x, y, 260, 300, 18, 'rgba(14,20,36,.92)', col, 2.5); person(g, x + 130, y + 80, col, 1.6); txt(g, n, x + 130, y + 170, C.fg, fnt(800, 34, 'serif'), 'center'); txt(g, r, x + 130, y + 215, col, fnt(700, 22), 'center'); txt(g, d, x + 130, y + 255, C.fg2, fnt(500, 20), 'center'); });
  A.forEach((c, i) => card1(c, R.x + i * 285, R.y + 140, pop(t, .4 + (i === 0 ? 0 : 1.5 + i * .9))));
  B.forEach((c, i) => card1(c, R.x + 1180 + i * 285, R.y + 140, pop(t, 7 + i * 1.6)));
  al(g, pop(t, 3), () => { rr(g, R.x + 285, R.y + 470, 3 * 285 - 25, 70, 14, 'rgba(255,178,92,.07)', C.o, 1.5); txt(g, '他不在时，由这三人留守', R.x + 285 + (3 * 285 - 25) / 2, R.y + 505, C.fg2, fnt(600, 23), 'center'); });
  al(g, pop(t, 11), () => txt(g, '另有虚构治安机关「安平署」；东帐部 / 西帐部为架空部落', R.x, R.y + 620, C.fg3, fnt(500, 22)));
};
AN.rule3 = (g, t, R) => {
  ttlTxt(g, R, '物资原则', '重量轻、价值高，不碰枪械和爆炸物');
  const no = ['枪械 · 弹药 · 炸药', '火药原料（硝酸铵、硫磺等）', '管制刀具 · 成品弩', '散装汽油（需实名）', '剧毒化学品'];
  rr(g, R.x, R.y + 120, 620, 520, 18, 'rgba(255,107,107,.05)', C.bad, 2); txt(g, '坚决不带', R.x + 30, R.y + 168, C.bad, fnt(800, 30));
  no.forEach((s, i) => al(g, pop(t, .5 + i * .5), () => { cross(g, R.x + 50, R.y + 240 + i * 76, 1, C.bad, 10); txt(g, s, R.x + 86, R.y + 240 + i * 76, C.fg, fnt(600, 25)); }));
  const S = [['现代侧买', '废钢板弹簧 · 绳 · 钢筋\n车床 · 手工具', C.b], ['沙洲工匠造', '弩臂 · 弩弦 · 箭头\n蒺藜 · 甲片', C.o]];
  S.forEach(([a, b, col], i) => { const x = R.x + 720 + i * 520, u = pop(t, 5 + i * 1.4); al(g, u, () => { rr(g, x, R.y + 200, 440, 300, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, x + 30, R.y + 255, col, fnt(800, 32)); b.split('\n').forEach((l, k) => txt(g, l, x + 30, R.y + 330 + k * 50, C.fg, fnt(600, 26))); }); if (i === 0) arrow(g, x + 450, R.y + 350, x + 510, R.y + 350, C.gold, 4, 14, pop(t, 6)); });
  al(g, pop(t, 9), () => { rr(g, R.x + 720, R.y + 550, 960, 90, 14, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, '现代人看到的：一个干搬运的人在囤五金', R.x + 750, R.y + 595, C.gold, fnt(700, 27)); });
};
AN.prio = (g, t, R) => {
  ttlTxt(g, R, '带什么：先后顺序');
  const T = [['1', '粮食 · 种子 · 盐 · 药 · 书', C.gold], ['2', '漂白粉 · 肥皂 · 补液盐（水与卫生）', C.ok], ['3', '钢丝网 · 刺绳 · 钢料', C.fg2], ['4', '机床 · 光伏 · 焊机（造东西的东西）', C.b], ['5', '白糖 · 茶砖 · 镜子 · 铁锅（贸易与外交）', C.p], ['6', '仔猪 · 鸡苗（小型活物）', C.r]];
  T.forEach(([n, s, col], i) => { const u = pop(t, .5 + i * 1.6), y = R.y + 110 + i * 112, w = R.w - i * 120; al(g, u, () => { g.translate((1 - u) * -24, 0); rr(g, R.x, y, w, 92, 14, 'rgba(14,20,36,.92)', col, 2.5); txt(g, n, R.x + 44, y + 46, col, fnt(800, 40, 'mono'), 'center'); txt(g, s, R.x + 96, y + 46, C.fg, fnt(700, 28)); }); });
};
AN.silver = (g, t, R) => {
  ttlTxt(g, R, '算一笔账', '银价约 10 元/g，黑市六折；粮食约 2.6 元/kg');
  const row = (y, parts, t0) => { let x = R.x; parts.forEach(([s, col, f], i) => al(g, pop(t, t0 + i * .4), () => { txt(g, s, x, y, col, fnt(800, f || 46, 'mono')); })); };
  const eq = (y, a, t0) => { let x = R.x; a.forEach(([s, col], i) => { g.font = fnt(800, 44, 'mono'); const w = g.measureText(s).width; const xx = x; al(g, pop(t, t0 + i * .35), () => txt(g, s, xx, y, col, fnt(800, 44, 'mono'))); x += w + 26; }); };
  eq(R.y + 170, [['1 kg 碎银', C.fg2], ['×', C.fg3], ['10 元/g', C.fg2], ['× 60%', C.r], ['≈', C.fg3], ['6000 元', C.gold]], .5);
  eq(R.y + 280, [['1 t 粮', C.fg2], ['≈', C.fg3], ['2600 元', C.gold]], 3.5);
  eq(R.y + 390, [['每周 2 t 多粮', C.fg2], ['≈', C.fg3], ['近 1 kg 碎银', C.bad]], 6.5);
  const y = R.y + 520; al(g, pop(t, 9.5), () => { txt(g, '全城碎银 5 kg', R.x, y, C.fg, fnt(700, 26)); });
  for (let i = 0; i < 5; i++) { const u = pop(t, 10 + i * .3), x = R.x + 260 + i * 200; al(g, u, () => { const used = SS((t - 12 - i * .45) / .5); rr(g, x, y - 34, 180, 68, 10, used > .5 ? 'rgba(255,107,107,.08)' : 'rgba(163,174,195,.2)', used > .5 ? C.bad : C.fg2, 2); txt(g, used > .5 ? '第 ' + (i + 1) + ' 周' : '1 kg', x + 90, y, used > .5 ? C.bad : C.fg, fnt(700, 24), 'center'); }); }
  al(g, pop(t, 14.5), () => txt(g, '撑不过一个春天', R.x + 1300, y, C.bad, fnt(800, 34, 'serif')));
};
// ---------- 03 收缩 ----------
AN.shrink = (g, t, R, st) => {
  const cx = R.x + 520, cy = R.y + 430, u = SS((t - 3) / 3);
  // 外郭
  al(g, 1 - .6 * u, () => { rr(g, cx - 420, cy - 330, 840, 660, 10, 'rgba(255,255,255,.02)', C.fg3, 4); txt(g, '外郭', cx - 400, cy - 300, C.fg3, fnt(700, 24)); });
  rr(g, cx - 170, cy - 140, 340, 280, 8, 'rgba(255,178,92,.06)', C.o, 5); txt(g, '子城 · 周长约 1.2 km', cx, cy - 165, C.o, fnt(700, 24), 'center');
  for (let i = 0; i < 90; i++) { const a = HSH(i, 1) * 6.28, r0 = 210 + HSH(i, 2) * 180, r1 = HSH(i, 3) * 110, r = LERP(r0, r1, SS((t - 3.5 - HSH(i, 4) * 1.5) / 2)); dot(g, cx + r * Math.cos(a) * 1.1, cy + r * Math.sin(a) * .85, 4.5, 'rgba(233,238,247,.7)'); }
  [[-420, -330], [420, -330], [-420, 330], [420, 330]].forEach(([dx, dy], i) => al(g, pop(t, 6.5 + i * .2), () => { dot(g, cx + dx, cy + dy, 10, C.gold); txt(g, '烽哨', cx + dx + (dx < 0 ? 18 : -18), cy + dy + (dy < 0 ? 28 : -24), C.gold, fnt(600, 18), dx < 0 ? 'left' : 'right'); }));
  const X = R.x + 1060;
  al(g, pop(t, 1), () => { txt(g, '九百人守不住整座外城', X, R.y + 60, C.fg, fnt(800, 34, 'serif')); });
  al(g, pop(t, 7.5), () => { txt(g, '每段城墙需要的守军', X, R.y + 160, C.fg2, fnt(700, 24)); hbar(g, X, R.y + 190, 640, 36, 1, 'rgba(163,174,195,.5)'); txt(g, '外郭', X + 652, R.y + 208, C.fg3, fnt(600, 20)); hbar(g, X, R.y + 250, 640, 36, LERP(1, 1 / 3, SS((t - 8) / 1.5)), C.o); txt(g, '子城 ≈ 1/3', X + 652, R.y + 268, C.o, fnt(700, 20)); });
  if (st.k >= 1) { const v = st.tk; [['水井', C.b, -110, -60], ['仓库', C.gold, 60, -70], ['菜地', C.ok, -60, 60], ['菜地', C.ok, 90, 70]].forEach(([s, col, dx, dy], i) => al(g, pop(v, .5 + i * .5), () => chip(g, s, cx + dx - 30, cy + dy, col, 1, 20)));
    al(g, pop(v, 2.5), () => { rr(g, X, R.y + 380, 640, 170, 16, 'rgba(95,211,154,.07)', C.ok, 2); para(g, '就算被围：喝得上干净水，自己能种一点菜', X + 26, R.y + 440, 590, 27, C.fg, 700); }); }
};
// ---------- 06 小结 ----------
function weekBars(g, t, R, ids, o = {}) {
  const X = R.x + 60, Y = R.y, W = R.w - 80, H = R.h, n = ids.length, bw = W / n, mx = o.max || 14000;
  const yq = Y + H - H * 6800 / mx; line(g, [[X, yq], [X + W, yq]], C.ok, 2.5, [10, 8]); txt(g, '6.8 t/周', X + W, yq - 18, C.ok, fnt(700, 20), 'right');
  ids.forEach((id, i) => { const w = WEEKS[id], u = pop(t, (o.t0 || 0) + i * .12, .6), tot = (w.total || [0])[0], grain = w.items.filter(x => /粮|麦|米/.test(x[0])).reduce((a, x) => a + x[1], 0), x = X + i * bw + bw * .18, hh = H * tot / mx * SS(u), hg = H * grain / mx * SS(u);
    rr(g, x, Y + H - hh, bw * .64, Math.max(1, hh), 5, PH[phaseOf(id)] + '99'); if (hg > 0) rr(g, x, Y + H - hg, bw * .64, hg, 5, 'rgba(255,210,122,.85)');
    txt(g, id.slice(1) + (w.to ? '+' : ''), x + bw * .32, Y + H + 22, C.fg3, fnt(600, n > 14 ? 15 : 18, 'mono'), 'center'); });
  txt(g, '■ 粮食', X, Y - 24, C.gold, fnt(700, 20)); txt(g, '■ 其他', X + 110, Y - 24, C.fg2, fnt(700, 20));
}
AN.sum1 = (g, t, R, st) => {
  ttlTxt(g, R, '阶段一小结 · W01–W10', '', PH[1]);
  if (st.k === 0) { const S = [['≈24 t', '运入沙洲', '其中粮食约 21 t'], ['≈8.7 万', '现代花费', '碎银、金器全部用完'], ['七成饷', '配给', '从半饷提上来'], ['600 亩', '春播', '防线收缩到子城']];
    const w = (R.w - 90) / 4; S.forEach(([a, b, c], i) => stat(g, R.x + i * (w + 30), R.y + 150, w, 220, a, b, [C.gold, C.r, C.ok, C.g][i], pop(t, .4 + i * 1.8), c)); return; }
  weekBars(g, st.tk, { x: R.x, y: R.y + 160, w: R.w, h: 560 }, ['W01', 'W02', 'W03', 'W04', 'W05', 'W06', 'W07', 'W08', 'W09', 'W10'], { max: 7500 });
  al(g, pop(st.tk, 5), () => chip(g, '每周花 7000 – 1.35 万元 · 额度只用了约三分之一', R.x + 380, R.y + 180, C.gold, 1, 24));
};
AN.ration = (g, t, R) => {
  ttlTxt(g, R, '口粮吃掉了几乎所有的钱');
  let tot = 0, gr = 0; ['W01', 'W02', 'W03', 'W04', 'W05', 'W06', 'W07', 'W08', 'W09', 'W10'].forEach(id => WEEKS[id].items.forEach(x => { tot += x[2]; if (/粮|麦|米/.test(x[0])) gr += x[2]; }));
  const f = gr / tot, cx = R.x + 380, cy = R.y + 400, r = 230, u = SS((t - .5) / 2.5);
  g.lineWidth = 60; g.strokeStyle = 'rgba(163,174,195,.2)'; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke();
  g.strokeStyle = C.gold; g.beginPath(); g.arc(cx, cy, r, -1.5708, -1.5708 + 6.2832 * f * u); g.stroke();
  txt(g, Math.round(f * 100 * u) + '%', cx, cy - 10, C.gold, fnt(800, 80, 'mono'), 'center'); txt(g, '花在粮食上', cx, cy + 60, C.fg2, fnt(600, 26), 'center');
  txt(g, '按 W01–W10 物资表统计', cx, cy + r + 70, C.fg3, fnt(500, 20), 'center');
  const X = R.x + 800;
  al(g, pop(t, 3), () => { txt(g, '900 人 × 七成饷', X, R.y + 190, C.fg, fnt(800, 40, 'serif')); txt(g, '≈ 每周 2.5 t 外来粮', X, R.y + 260, C.gold, fnt(800, 44, 'mono')); txt(g, '（另有羊、菜地、党河渔获补充）', X, R.y + 320, C.fg3, fnt(500, 22)); });
  al(g, pop(t, 6), () => { rr(g, X, R.y + 420, 900, 140, 16, 'rgba(255,107,107,.06)', C.bad, 2); txt(g, '只靠打工，沙洲永远只能"不饿死"', X + 30, R.y + 490, C.fg, fnt(800, 34, 'serif')); });
};
AN.risk1 = (g, t, R) => {
  ttlTxt(g, R, '埋下的风险');
  iconCards(g, t, { x: R.x, y: R.y, w: R.w }, [['金', '卖金', '黑户卖金像销赃', C.gold], ['证', '借用身份', '大刘被牵扯进来', C.b], ['仓', '集中囤货', '固定地点迟早被注意', C.r]], { y: R.y + 120, h: 260, t0: .5, dt: 1.4 });
  al(g, pop(t, 7), () => { rr(g, R.x, R.y + 440, R.w, 200, 18, 'rgba(255,178,92,.07)', C.o, 2.5); txt(g, '下一集 · 强军', R.x + 36, R.y + 495, C.o, fnt(700, 26)); txt(g, '废钢板弹簧造弩 · 民壮上城 · 远袭 400 km 外的乌兰城', R.x + 36, R.y + 570, C.fg, fnt(800, 38, 'serif')); });
};
