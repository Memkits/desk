// 第二集动画：强军
function crossbow(g, x, y, s, col, u = 1) { // 钢臂弩示意（俯视）
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -14, -10, 28, 260, 8, '#5A4630', '#8A6E48', 2); // 弩臂（木）
  const bend = 70 * u; g.strokeStyle = col; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(-170, 30 + bend * .2); g.quadraticCurveTo(0, -30, 170, 30 + bend * .2); g.stroke(); // 钢臂
  g.strokeStyle = C.fg2; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-170, 30 + bend * .2); g.lineTo(0, 120 + bend * .4); g.lineTo(170, 30 + bend * .2); g.stroke(); // 弦
  rr(g, -10, 110, 20, 40, 4, C.gold); // 弩机
  g.restore();
}
AN.bow = (g, t, R, st) => {
  if (st.k === 0) {
    const S = [['废钢板弹簧', '报废车拆下 · 约 3 元/kg', C.fg2], ['鲁三锻打', '在沙洲加工', C.o], ['钢臂弩', '第一张试制成功', C.gold]];
    const w = 460; S.forEach(([a, b, col], i) => { const u = pop(t, .5 + i * 1.5), x = R.x + i * (w + 170); al(g, u, () => { rr(g, x, R.y + 60, w, 330, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, x + w / 2, R.y + 300, C.fg, fnt(800, 34, 'serif'), 'center'); txt(g, b, x + w / 2, R.y + 350, C.fg2, fnt(500, 22), 'center');
        if (i === 0) for (let k = 0; k < 4; k++) rr(g, x + 80 + k * 6, R.y + 120 + k * 22, 300 - k * 40, 14, 7, '#7C8698');
        if (i === 1) { rr(g, x + 150, R.y + 200, 160, 40, 6, '#4A5262'); rr(g, x + 200, R.y + 110, 18, 90, 4, '#8A6E48'); rr(g, x + 175, R.y + 100, 70, 30, 6, '#7C8698'); dot(g, x + 260, R.y + 190, 4 + 3 * Math.sin(t * 9), C.gold); }
        if (i === 2) crossbow(g, x + w / 2, R.y + 100, .55, C.gold, 1); }); if (i < 2) arrow(g, x + w + 20, R.y + 225, x + w + 150, R.y + 225, C.gold, 4, 14, pop(t, 1.2 + i * 1.5)); });
    al(g, pop(t, 5.5), () => { rr(g, R.x, R.y + 450, R.w, 110, 16, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, '核心原则：现代侧只买材料和工具，组装发生在沙洲', R.x + 30, R.y + 505, C.gold, fnt(800, 30)); });
    al(g, pop(t, 9), () => { [0, 1, 2, 3, 4].forEach(i => person(g, R.x + 60 + i * 70, R.y + 680, i % 2 ? C.r : C.o, 1.1)); txt(g, '妇女和半大少年 · 练三天就能上城射击', R.x + 420, R.y + 680, C.fg, fnt(700, 30)); });
    return;
  }
  ttlTxt(g, R, '为什么是弩，不是弓？');
  const rows = [['上弦', '靠臂力拉开', '借腰腿或脚蹬'], ['瞄准', '边拉边瞄', '望山瞄准，扣机发射'], ['练成要', '好几年', '几天'], ['射速', '快', '慢 → 分排轮射']];
  const X = R.x, cw = [260, 640, 640], y0 = R.y + 130;
  al(g, pop(st.tk, .3), () => { txt(g, '弓', X + cw[0] + 30, y0, C.fg2, fnt(800, 34, 'serif')); txt(g, '弩', X + cw[0] + cw[1] + 30, y0, C.gold, fnt(800, 34, 'serif')); });
  rows.forEach(([a, b, c], i) => { const u = pop(st.tk, 1 + i * 2.3), y = y0 + 60 + i * 120; al(g, u, () => { rr(g, X, y, cw[0] + cw[1] + cw[2], 100, 14, 'rgba(14,20,36,.92)', i === 3 ? C.r : C.line2, 2); txt(g, a, X + 30, y + 50, C.fg3, fnt(700, 26)); txt(g, b, X + cw[0] + 30, y + 50, C.fg2, fnt(600, 28)); txt(g, c, X + cw[0] + cw[1] + 30, y + 50, C.fg, fnt(800, 28)); }); });
};
AN.militia = (g, t, R) => {
  ttlTxt(g, R, '民壮弩手制度');
  const rules = ['14 岁以上', '能上弦', '轮班上城', '以工代饷']; rules.forEach((s, i) => { const u = pop(t, 3 + i * .8); al(g, u, () => chip(g, s, R.x + i * 240, R.y + 140, C.o, 1, 26)); });
  // 人力对比
  const y = R.y + 260; al(g, pop(t, .8), () => { txt(g, '甲士', R.x, y + 20, C.fg2, fnt(700, 24)); for (let i = 0; i < 120; i++) dot(g, R.x + 120 + (i % 60) * 15, y + 6 + Math.floor(i / 60) * 16, 5.5, C.o); txt(g, '≈ 120', R.x + 1050, y + 20, C.o, fnt(800, 28, 'mono')); });
  const y2 = y + 90; al(g, pop(t, 6), () => { txt(g, '民壮弩手', R.x, y2 + 50, C.fg2, fnt(700, 24)); for (let k = 0; k < 3; k++) { const u = pop(t, 6.5 + k * .6); for (let i = 0; i < 50; i++) al(g, u, () => dot(g, R.x + 120 + (i % 50) * 15 + k * 0, y2 + 10 + k * 40, 5.5, ['#FFD27A', '#FFB25C', '#FF7A93'][k])); al(g, u, () => txt(g, '第' + '一二三'[k] + '班', R.x + 900, y2 + 10 + k * 40, C.fg3, fnt(600, 20))); } txt(g, '≈ 150', R.x + 1050, y2 + 50, C.gold, fnt(800, 28, 'mono')); });
  al(g, pop(t, 11), () => { rr(g, R.x, R.y + 560, R.w, 110, 16, 'rgba(255,178,92,.07)', C.o, 2); txt(g, '弩：以弱抗强、以少守多 —— 正适合人少的守城方', R.x + 30, R.y + 615, C.fg, fnt(800, 30, 'serif')); });
};
AN.cash2 = (g, t, R) => {
  ttlTxt(g, R, '现代账本 · W11–W16', '装卸队 10 人，他每周可支配约 4500 元');
  const ids = ['W11', 'W12', 'W13', 'W14', 'W15', 'W16'], X = R.x + 80, Y = R.y + 160, H = 480, W = R.w - 160, bw = W / ids.length, mx = 22000;
  const yi = Y + H - H * 4500 / mx; line(g, [[X, yi], [X + W, yi]], C.ok, 3, [10, 8]); txt(g, '每周可支配 ≈ 4500 元', X + 10, yi + 24, C.ok, fnt(700, 22));
  ids.forEach((id, i) => { const w = WEEKS[id], u = pop(t, .5 + i * .4, .7), gr = w.items.filter(x => /粮|麦|米/.test(x[0])).reduce((a, x) => a + x[2], 0), tot = w.total[1], x = X + i * bw + bw * .2;
    const ht = H * tot / mx * SS(u), hg = H * gr / mx * SS(u); rr(g, x, Y + H - ht, bw * .6, ht, 6, 'rgba(255,178,92,.55)'); rr(g, x, Y + H - hg, bw * .6, hg, 6, 'rgba(255,210,122,.9)');
    txt(g, id, x + bw * .3, Y + H + 26, C.fg3, fnt(600, 20, 'mono'), 'center'); if (u > .9) txt(g, fmtY(tot), x + bw * .3, Y + H - ht - 20, C.fg, fnt(700, 20, 'mono'), 'center'); });
  txt(g, '■ 口粮', X, Y - 30, C.gold, fnt(700, 21)); txt(g, '■ 其他', X + 110, Y - 30, C.o, fnt(700, 21));
  al(g, pop(t, 4), () => chip(g, 'W13 车床：压缩口粮，配给临时降回六成饷', X + bw * 2 - 60, Y + 40, C.bad, 1, 22));
};
AN.barrier = (g, t, R) => {
  const gy = R.y + 560, wx = R.x + 1500;
  rr(g, R.x, gy, R.w, 8, 2, '#3A3020'); rr(g, wx, gy - 260, 220, 260, 4, '#2E2A22', C.o, 3); for (let i = 0; i < 7; i++) rr(g, wx + i * 32, gy - 285, 20, 25, 2, '#2E2A22', C.o, 2); txt(g, '子城城墙', wx + 110, gy + 40, C.o, fnt(700, 22), 'center');
  const bx = wx - 520; al(g, pop(t, .5), () => { for (let i = 0; i < 3; i++) { line(g, [[bx + i * 26, gy], [bx + i * 26, gy - 70]], C.fg2, 3); } g.strokeStyle = C.fg2; g.lineWidth = 2; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(bx - 10, gy - 14 - k * 16); for (let x = 0; x < 70; x += 8) g.lineTo(bx + x, gy - 14 - k * 16 + (x % 16 ? 4 : -4)); g.stroke(); } txt(g, '刺绳', bx + 26, gy + 40, C.fg, fnt(700, 22), 'center'); });
  al(g, pop(t, 1.3), () => { rr(g, bx + 120, gy, 140, 50, 6, '#05070C', C.line2, 2); txt(g, '壕沟', bx + 190, gy + 80, C.fg, fnt(700, 22), 'center'); for (let i = 0; i < 12; i++) { const x = bx - 200 + i * 15; g.save(); g.translate(x, gy - 6); g.rotate(i); line(g, [[-6, 0], [6, 0]], C.fg3, 3); line(g, [[0, -6], [0, 6]], C.fg3, 3); g.restore(); } txt(g, '蒺藜', bx - 120, gy + 40, C.fg, fnt(700, 22), 'center'); });
  al(g, pop(t, 2), () => { line(g, [[bx + 26, gy + 100], [wx, gy + 100]], C.gold, 2); txt(g, '约一百步', (bx + wx) / 2, gy + 130, C.gold, fnt(700, 22), 'center'); });
  // 骑兵
  for (let i = 0; i < 14; i++) { const sp = 120 + HSH(i, 1) * 60, x0 = R.x + 20 + HSH(i, 2) * 200, x = Math.min(x0 + Math.max(0, t - 3) * sp, bx - 210 + HSH(i, 3) * 120), y = gy - 20 - HSH(i, 4) * 120; al(g, pop(t, 2.5), () => { g.fillStyle = C.bad; g.beginPath(); g.ellipse(x, y, 20, 9, 0, 0, 7); g.fill(); dot(g, x + 6, y - 14, 6, C.bad); }); }
  // 弩箭
  if (t > 6) for (let i = 0; i < 10; i++) { const ph = ((t - 6) * .9 + HSH(i, 5)) % 1, x0 = wx + 20, y0 = gy - 290, x1 = bx - 170 + HSH(i, 6) * 150, y1 = gy - 40 - HSH(i, 7) * 100, x = LERP(x0, x1, ph), y = LERP(y0, y1, ph) - Math.sin(ph * 3.14) * 80; line(g, [[x, y], [x + 20, y - 6]], C.gold, 3); }
  al(g, pop(t, 6), () => txt(g, '骑兵被障碍带拖慢 · 弩手在后面齐射', R.x + 20, R.y + 60, C.fg, fnt(800, 36, 'serif')));
};
AN.scout = (g, t, R, st) => {
  const V = mapView({ x: R.x, y: R.y, w: 1000, h: R.h }, -140, 150, 1.6); drawMap(g, V, { road: true, steppe: true });
  site(g, V, 'sz', '沙洲', 'city', C.o, 1); site(g, V, 'wl', '乌兰城', 'big', C.bad, pop(t, .5), '约 400 km');
  const ph = st.k === 0 ? (t * .08) % 1 : 1; route(g, V, ROAD.slice().reverse(), st.k === 0 ? SS(t / 4) : 1, C.gold, 3);
  if (st.k === 0) { const p = ph < .5 ? ph * 2 : 2 - ph * 2; const pts = ROAD.slice().reverse().map(V.P); packet(g, pts, p, C.gold, 9); }
  else { const pts = ROAD.slice().reverse().map(V.P); for (let i = 0; i < 6; i++) packet(g, pts, CL((st.tk * .1 - i * .02)), C.o, 7); }
  const X = R.x + 1050, W = R.w - 1050;
  if (st.k === 0) {
    al(g, pop(t, 1), () => { txt(g, '侦察', X, R.y + 40, C.fg, fnt(800, 38, 'serif')); para(g, '两名会说胡语的老兵扮成商人，带白糖和镜子去乌兰城', X, R.y + 110, W, 26, C.fg2, 600); });
    al(g, pop(t, 4), () => stat(g, X, R.y + 220, 300, 150, '≈20 天', '往返', C.gold, 1));
    al(g, pop(t, 5), () => stat(g, X + 340, R.y + 220, 300, 150, '3 人', '知道计划', C.r, 1));
    ['压缩饼干', '葡萄糖', '水袋', '防风镜'].forEach((s, i) => al(g, pop(t, 9 + i * .5), () => chip(g, s, X + (i % 2) * 260, R.y + 480 + Math.floor(i / 2) * 70, C.b, 1, 24)));
    al(g, pop(t, 9), () => txt(g, '现代侧采购：让骑兵少驮粮草', X, R.y + 430, C.fg2, fnt(700, 24)));
  } else {
    al(g, pop(st.tk, .3), () => { txt(g, '长途行军', X, R.y + 40, C.fg, fnt(800, 38, 'serif')); stat(g, X, R.y + 110, 300, 150, '8–10 天', '400 km 骑行', C.gold, 1); });
    al(g, pop(st.tk, 4), () => { stat(g, X, R.y + 330, 300, 150, '60', '骑兵', C.o, 1); stat(g, X + 340, R.y + 330, 300, 150, '30', '骑马弩手', C.r, 1); });
    al(g, pop(st.tk, 7), () => para(g, '压缩饼干、葡萄糖热量高、轻便，大幅减少马队要驮的粮草', X, R.y + 560, W, 24, C.fg2, 600));
  }
};
AN.intel = (g, t, R, st) => {
  ttlTxt(g, R, '乌兰城 · 侦察结果', '东帐部的仓城和商城【假设】', C.bad);
  const S = [['≈6000', '人口', C.fg2], ['< 500', '留守守军', C.ok], ['金银玉器', '仓库 · 商队货物', C.gold], ['≈100', '被掳汉人', C.r]];
  const w = (R.w - 90) / 4; S.forEach(([a, b, col], i) => stat(g, R.x + i * (w + 30), R.y + 130, w, 190, a, b, col, pop(st.k === 0 ? t : 99, .5 + i * 2.5)));
  al(g, pop(st.k === 0 ? t : 99, 3), () => { const x = R.x + w + 30; txt(g, '原 2000 → 抽走大半去争位', x + w / 2, R.y + 350, C.fg3, fnt(600, 20), 'center'); });
  if (st.k < 1) return;
  const v = st.tk; al(g, pop(v, .3), () => { rr(g, R.x, R.y + 400, R.w, 120, 16, 'rgba(255,210,122,.08)', C.gold, 3); txt(g, '不攻城 · 只夜袭仓库区和奴隶营 · 得手就走', R.x + 36, R.y + 460, C.gold, fnt(800, 38, 'serif')); });
  al(g, pop(v, 4), () => { txt(g, '成败只看两点', R.x, R.y + 580, C.fg2, fnt(700, 24)); check(g, R.x, R.y + 630, '守军是不是真的空虚', 0, C.ok, 28); check(g, R.x + 600, R.y + 630, '能不能在天亮前撤出城外', 0, C.ok, 28); });
  al(g, pop(v, 1.5), () => txt(g, '对方人口是沙洲的六倍多：正面攻城必败', R.x + R.w, R.y + 580, C.bad, fnt(700, 24), 'right'));
};
AN.rain = (g, t, R) => {
  for (let i = 0; i < 160; i++) { const x = R.x + HSH(i, 1) * R.w, y = R.y + ((HSH(i, 2) * R.h + t * (500 + HSH(i, 3) * 300)) % R.h); line(g, [[x, y], [x - 4, y + 22]], 'rgba(92,180,255,.35)', 2); }
  const wl = R.y + R.h - 120 - 60 * SS(t / 6); g.fillStyle = 'rgba(92,180,255,.12)'; g.beginPath(); g.moveTo(R.x, wl); for (let x = 0; x <= R.w; x += 20) g.lineTo(R.x + x, wl + 6 * Math.sin(x * .02 + t * 2)); g.lineTo(R.x + R.w, R.y + R.h); g.lineTo(R.x, R.y + R.h); g.fill();
  txt(g, '郑州暴雨内涝 · 约七月中旬（W20）', R.x, R.y + 40, C.fg, fnt(800, 38, 'serif'));
  const T = [['一组', '城中村救人'], ['二组', '物流园转移物资'], ['三组', '轮换休整']];
  T.forEach(([a, b], i) => { const u = pop(t, 2 + i * 1.2), x = R.x + 60 + i * 560; al(g, u, () => { rr(g, x, R.y + 150, 500, 280, 18, 'rgba(14,20,36,.9)', C.b, 2.5); txt(g, a, x + 30, R.y + 200, C.b, fnt(800, 30)); txt(g, b, x + 30, R.y + 245, C.fg2, fnt(600, 23)); for (let k = 0; k < 4; k++) person(g, x + 70 + k * 100, R.y + 340, C.fg2, 1.1); }); });
  ['分组', '点名', '轮换'].forEach((s, i) => al(g, pop(t, 6 + i * .6), () => chip(g, s, R.x + 60 + i * 200, R.y + 520, C.gold, 1, 30)));
  al(g, pop(t, 8), () => txt(g, '用的是带兵的办法 · 12 人连续两天', R.x + 700, R.y + 520, C.fg, fnt(700, 28)));
};
// ---------- 远袭 ----------
AN.raid = (g, t, R, st) => {
  const k = st.k, v = st.tk;
  const cx = R.x + 520, cy = R.y + 400; // 乌兰城平面（示意）
  const city = () => {
    rr(g, cx - 330, cy - 270, 660, 520, 12, 'rgba(255,107,107,.04)', C.bad, 4); txt(g, '乌兰城（示意）', cx - 320, cy - 295, C.bad, fnt(700, 22));
    rr(g, cx - 40, cy - 282, 80, 24, 4, '#2A1418', C.bad, 2); txt(g, '北门', cx, cy - 310, C.fg2, fnt(600, 20), 'center');
    for (let i = 0; i < 30; i++) rr(g, cx - 300 + (i % 6) * 100 + HSH(i, 1) * 20, cy - 230 + Math.floor(i / 6) * 90 + HSH(i, 2) * 20, 50 + HSH(i, 3) * 30, 34, 4, 'rgba(163,174,195,.08)');
    rr(g, cx + 120, cy + 40, 190, 120, 8, 'rgba(255,210,122,.1)', C.gold, 2.5); txt(g, '仓库区', cx + 215, cy + 100, C.gold, fnt(700, 22), 'center');
    rr(g, cx - 300, cy + 110, 170, 110, 8, 'rgba(255,122,147,.1)', C.r, 2.5); txt(g, '奴隶营', cx - 215, cy + 165, C.r, fnt(700, 22), 'center');
    txt(g, '商队区', cx + 340, cy + 210, C.fg3, fnt(600, 20), 'left');
  };
  const X = R.x + 1120, W = R.w - 1120;
  if (k <= 1) {
    city();
    const night = 'rgba(5,8,20,.35)'; g.fillStyle = night; g.fillRect(R.x, R.y, 1060, R.h);
    // 韩烈佯攻北门
    const f1 = SS((k === 0 ? t - 2 : 99) / 3); for (let i = 0; i < 6; i++) { const x = cx - 200 + i * 70, y = LERP(R.y - 10, cy - 330, f1) + Math.sin(t * 3 + i) * 6; dot(g, x, y, 7, C.o); }
    al(g, f1, () => chip(g, '韩烈 30 骑 · 佯攻北门', cx - 410, cy - 360, C.o, 1, 20));
    // 主队翻墙
    const f2 = SS((k === 0 ? t - 5 : 99) / 3); const p0 = [cx + 470, cy + 240], p1 = [cx + 330, cy + 180], p2 = [cx + 215, cy + 100];
    for (let i = 0; i < 8; i++) { const ff = CL(f2 * 1.3 - i * .04), p = ff < .5 ? [LERP(p0[0], p1[0], ff * 2), LERP(p0[1], p1[1], ff * 2)] : [LERP(p1[0], p2[0], ff * 2 - 1), LERP(p1[1], p2[1], ff * 2 - 1)]; dot(g, p[0] + (i % 3) * 10, p[1] + Math.floor(i / 3) * 10, 6, C.gold); }
    al(g, f2, () => chip(g, '萧镇北 60 人 · 商队区翻墙', cx + 120, cy + 300, C.gold, 1, 20));
    if (k === 1) {
      al(g, pop(v, .5), () => { line(g, [[cx + 215, cy + 100], [cx - 215, cy + 165]], C.gold, 3, [8, 8]); txt(g, '液压剪：锁链 · 栅栏', cx, cy + 60, C.gold, fnt(700, 22), 'center'); });
      const f3 = SS((v - 3) / 3); for (let i = 0; i < 12; i++) { const x = LERP(cx - 215, cx + 560, f3) + (i % 4) * 12, y = LERP(cy + 165, cy + 260, f3) + Math.floor(i / 4) * 12; dot(g, x, y, 5.5, i < 6 ? C.gold : C.r); }
      al(g, pop(v, 6), () => { rr(g, X, R.y + 340, W, 200, 16, 'rgba(255,178,92,.07)', C.o, 2); txt(g, '追出三十里', X + 26, R.y + 395, C.fg, fnt(800, 30)); txt(g, '被埋伏的骑马弩手射退', X + 26, R.y + 445, C.fg2, fnt(600, 24)); });
    }
    al(g, pop(k === 0 ? t : 99, .5), () => { txt(g, '第九天夜里', X, R.y + 40, C.fg, fnt(800, 40, 'serif')); para(g, '九十骑、骆驼二十峰，向西北走了九天', X, R.y + 110, W, 24, C.fg2, 600); });
    al(g, pop(k === 0 ? t : 99, 1), () => { txt(g, '对讲机协调两队', X, R.y + 220, C.b, fnt(700, 26)); txt(g, '天亮前撤出城外', X, R.y + 270, C.gold, fnt(700, 26)); });
    return;
  }
  if (k >= 2 && k <= 4) {
    const S = [['≈4 kg', '金', C.gold], ['≈60 kg', '银', C.fg2], ['一批', '玉器', C.ok], ['86 人', '解救汉人', C.r]], w = (R.w - 90) / 4; const tt = k === 2 ? v : 99;
    al(g, k === 2 ? 1 : .45, () => { S.forEach(([a, b, col], i) => stat(g, R.x + i * (w + 30), R.y + 110, w, 200, a, b, col, pop(tt, .4 + i * 1.2), i === 3 ? '其中青壮 30 人' : ''));
      al(g, pop(tt, 6), () => { rr(g, R.x, R.y + 380, R.w, 90, 16, 'rgba(255,107,107,.06)', C.bad, 2); txt(g, '代价：阵亡 7 人，伤 15 人', R.x + 30, R.y + 425, C.bad, fnt(800, 30)); }); });
    const y0 = R.y + 560;
    if (k === 3) al(g, pop(v, .4), () => { rr(g, R.x, y0 - 50, R.w, 200, 16, 'rgba(255,210,122,.07)', C.gold, 2.5); txt(g, '能成立的前提', R.x + 30, y0, C.gold, fnt(700, 24)); txt(g, '守军空虚 + 只夺仓库、不攻城', R.x + 30, y0 + 60, C.fg, fnt(800, 38, 'serif')); txt(g, '90 骑 对 6000 人的城：任何一次恋战都可能全军覆没', R.x + 30, y0 + 115, C.fg2, fnt(600, 24)); });
    if (k === 4) al(g, pop(v, .5), () => { txt(g, '不留旗号', R.x, y0, C.fg, fnt(800, 36, 'serif')); chip(g, '东帐部', R.x + 400, y0, C.bad, 1, 26); arrow(g, R.x + 560, y0, R.x + 800, y0, C.fg3, 3); chip(g, '西帐部？', R.x + 820, y0, C.p, 1, 26); txt(g, '怀疑：西帐趁乱下手', R.x + 1060, y0, C.fg2, fnt(600, 26)); });
    return;
  }
  if (k === 5) { stat(g, R.x, R.y + 140, 520, 240, '≈13 t', '额度累积（随军两周）', C.ok, pop(v, .3)); stat(g, R.x + 600, R.y + 140, 520, 240, '≈980', '沙洲人口', C.o, pop(v, 2));
    al(g, pop(v, 4), () => txt(g, '全城第一次看到："能打回去"', R.x, R.y + 520, C.gold, fnt(800, 44, 'serif'))); }
};
AN.goldshops = (g, t, R, st) => {
  const C3 = [['郑州', R.x + 520, R.y + 420], ['开封', R.x + 860, R.y + 360], ['洛阳', R.x + 150, R.y + 380]];
  const k = st.k, tt = k === 0 ? t : 99;
  C3.forEach(([n, x, y], i) => al(g, pop(tt, .3 + i * .4), () => { g.beginPath(); g.arc(x, y, 100, 0, 7); g.fillStyle = 'rgba(92,180,255,.06)'; g.fill(); g.strokeStyle = C.line2; g.lineWidth = 2; g.stroke(); txt(g, n, x, y + 130, C.fg, fnt(800, 28, 'serif'), 'center'); }));
  let lit = 0; for (let i = 0; i < 36; i++) { const c = C3[i % 3], a = HSH(i, 1) * 6.28, r = 20 + HSH(i, 2) * 75, x = c[1] + r * Math.cos(a), y = c[2] + r * Math.sin(a), on = SS((tt - 2 - i * .12) / .3); if (on > .5) lit++; dot(g, x, y, 6, on > .5 ? C.gold : 'rgba(163,174,195,.3)'); }
  const X = R.x + 1100;
  if (k === 0) { al(g, pop(t, 1.5), () => { txt(g, '几十家小回收店 + 两个中间人', X, R.y + 120, C.fg2, fnt(700, 24)); txt(g, '每次 20–50 g · 约六折', X, R.y + 170, C.fg, fnt(800, 30)); });
    al(g, pop(t, 6), () => { stat(g, X, R.y + 240, 300, 170, cnum(400, (t - 6) / 2) + ' g', '一周卖出', C.gold, 1); stat(g, X + 330, R.y + 240, 300, 170, '≈21 万', '到手', C.ok, 1); }); }
  if (k === 1) { const v = st.tk; al(g, pop(v, .3), () => chip(g, '玉器：形制像古物，先不卖', X, R.y + 140, C.ok, 1, 24));
    ['那个卖金条的大个子…', '他是哪儿来的？', '又来了'].forEach((s, i) => al(g, pop(v, 3 + i * 1.2), () => { const x = C3[i][1] - 120, y = C3[i][2] - 150; rr(g, x, y - 26, 260, 52, 26, 'rgba(255,107,107,.12)', C.bad, 2); txt(g, s, x + 130, y, C.fg, fnt(600, 20), 'center'); }));
    al(g, pop(v, 6), () => { rr(g, X, R.y + 260, 620, 140, 16, 'rgba(255,107,107,.06)', C.bad, 2); para(g, '回收店之间是有圈子的：有人开始打听他', X + 26, R.y + 310, 570, 27, C.fg, 700); }); }
  if (k === 2) { const v = st.tk; al(g, pop(v, .3), () => { txt(g, '900 元/g × 60% =', X, R.y + 140, C.fg2, fnt(800, 36, 'mono')); txt(g, '540 元/g', X, R.y + 210, C.gold, fnt(800, 54, 'mono')); });
    al(g, pop(v, 4), () => { rr(g, X, R.y + 300, 640, 220, 16, 'rgba(255,210,122,.07)', C.gold, 2.5); txt(g, '结论三', X + 26, R.y + 345, C.gold, fnt(700, 24)); para(g, '金子卖不出去，才是常态', X + 26, R.y + 410, 590, 40, C.fg, 800); para(g, '零散 · 压价 · 冒险 · 量大必被注意', X + 26, R.y + 475, 590, 22, C.fg2, 600); }); }
};
AN.sum2 = (g, t, R, st) => {
  ttlTxt(g, R, '阶段二小结 · W11–W24', '', PH[2]);
  if (st.bi < 2) { const S = [['≈39 t', '运入沙洲', '口粮仍占一半以上', C.gold], ['≈18 万', '现代花费', '装卸队 + 卖金', C.r], ['120', '甲士', '冷轧钢板札甲', C.o], ['180', '民壮弩手', '三班上城', C.gold], ['70', '骑兵', '白糖茶砖换马', C.b]];
    const w = (R.w - 120) / 5; S.forEach(([a, b, c, col], i) => stat(g, R.x + i * (w + 30), R.y + 150, w, 220, a, b, col, pop(t, .4 + i * 1.3), c));
    al(g, pop(t, 7), () => chip(g, '子城外两道障碍带 · 城门钢骨 · 钢管拒马', R.x, R.y + 480, C.o, 1, 26)); return; }
  al(g, pop(t, .3), () => { rr(g, R.x, R.y + 180, R.w, 300, 18, 'rgba(255,210,122,.06)', C.gold, 2.5); txt(g, '关键认识', R.x + 40, R.y + 235, C.gold, fnt(700, 26)); txt(g, '只靠现代打工，沙洲只能活着；', R.x + 40, R.y + 320, C.fg, fnt(800, 46, 'serif')); txt(g, '能翻身的本钱，最后还是要靠打。', R.x + 40, R.y + 400, C.gold, fnt(800, 46, 'serif')); });
};
// 现金曲线（示意，单位万元）：按物资表花费与推演中的收入粗算
const CASH = (() => { const inc = { 4: 5.4, 23: 21, 24: 16, 39: 45, 43: 20, 47: 90 }; const out = []; let c = 0.5; for (let w = 1; w <= 52; w++) { const id = 'W' + String(w).padStart(2, '0'); const wk = WEEKS[id]; let cost = 0; if (wk) cost = wk.total[1] / 10000; else { const p = 'W' + String(w - 1).padStart(2, '0'); cost = 0; }
  const earn = w <= 4 ? .4 : w <= 8 ? .25 : w <= 24 ? .45 : w <= 42 ? .45 : 0; c = Math.max(0.3, c + earn + (inc[w] || 0) - cost + (w <= 10 ? (w <= 3 ? .6 : 0) : 0)); out.push(c); } return out; })();
AN.cash = (g, t, R) => {
  const last = EP === 2 ? 24 : 38; ttlTxt(g, R, '手里的现金 · W01–W' + last, '按物资表花费与收入粗算，示意');
  const X = R.x + 80, Y = R.y + 140, W = R.w - 160, H = 520, mx = 40, P = i => [X + i / (last - 1) * W, Y + H - H * Math.min(CASH[i], mx) / mx];
  line(g, [[X, Y + H], [X + W, Y + H]], C.line2, 2); [10, 20, 30].forEach(v => { const y = Y + H - H * v / mx; line(g, [[X, y], [X + W, y]], C.line, 1, [4, 6]); txt(g, v + ' 万', X - 14, y, C.fg3, fnt(600, 18, 'mono'), 'right'); });
  const n = Math.floor(SS((t - .5) / 4) * (last - 1)); const pts = []; for (let i = 0; i <= n; i++) pts.push(P(i)); if (pts.length > 1) line(g, pts, C.gold, 5);
  [1, 10, 20, last].forEach(w => txt(g, 'W' + String(w).padStart(2, '0'), P(w - 1)[0], Y + H + 26, C.fg3, fnt(600, 18, 'mono'), 'center'));
  al(g, pop(t, 3.5), () => { const p = P(22); chip(g, 'W23–24 卖金 ≈37 万', p[0] - 300, p[1] - 30, C.gold, 1, 22); });
  if (EP === 3) al(g, pop(t, 5), () => { const p = P(37); chip(g, '只剩十来万', p[0] - 190, p[1] - 50, C.bad, 1, 22); txt(g, '不再卖金 · 只出不进', p[0] - 520, Y + 40, C.fg2, fnt(700, 24)); });
  if (EP === 2) al(g, pop(t, 6), () => txt(g, '来得越快，越容易被人看见', X, Y + 40, C.bad, fnt(700, 26)));
};
AN.risk2 = (g, t, R) => {
  ttlTxt(g, R, '累积的风险');
  iconCards(g, t, { x: R.x, y: R.y, w: R.w }, [['金', '卖金太快', '回收店圈子里有人打听', C.gold], ['帐', '东帐部报复', '秋高马肥时一定会来', C.bad]], { y: R.y + 120, h: 260, t0: .5, dt: 1.6 });
  al(g, pop(t, 5), () => { rr(g, R.x, R.y + 440, R.w, 200, 18, 'rgba(199,155,255,.07)', C.p, 2.5); txt(g, '下一集 · 外交分化', R.x + 36, R.y + 495, C.p, fnt(700, 26)); txt(g, '安平署盘查 · 扛住秋季报复 · 在东西两帐之间找到盟友', R.x + 36, R.y + 570, C.fg, fnt(800, 38, 'serif')); });
};
