// 第四集动画：拓土
AN.quota2 = (g, t, R, st) => {
  ttlTxt(g, R, '额度第一次成为瓶颈 · W39–W52', '', PH[4]);
  const X = R.x, W = R.w, y = R.y + 160, u = SS((t - .8) / 2.5), tot = 95;
  al(g, pop(t, .5), () => { txt(g, '14 周净可用 ≈ 95 t', X, y, C.fg, fnt(800, 32)); hbar(g, X, y + 30, W, 60, 1, 'rgba(163,174,195,.25)'); rr(g, X, y + 30, W * 76 / tot * u, 60, 30, C.b); if (u > .9) { txt(g, '本阶段用掉 ≈ 76 t', X + 30, y + 60, '#06101e', fnt(800, 26)); txt(g, '留到明年 ≈ 19 t', X + W - 30, y + 60, C.fg, fnt(800, 26), 'right'); } });
  if (st.k >= 1) { const v = st.tk, A = [['粮食', '仍是最重的东西', C.gold, '≈ 64 t'], ['药品 · 设备', '越来越多', C.b, '机床 · 光伏 · 药'], ['冬衣 · 煤', '过冬物资都是大块头', C.fg2, '≈ 20 t']];
    A.forEach(([a, b, col, c], i) => { const x = X + i * 580, u2 = pop(v, .5 + i * 1.8); al(g, u2, () => { rr(g, x, R.y + 330, 540, 220, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, x + 30, R.y + 390, col, fnt(800, 34)); txt(g, b, x + 30, R.y + 445, C.fg2, fnt(600, 24)); txt(g, c, x + 30, R.y + 500, C.fg3, fnt(600, 21, 'mono')); }); });
    al(g, pop(v, 7), () => txt(g, '每一批货，都要先排优先级', X, R.y + 640, C.gold, fnt(800, 36, 'serif'))); }
};
AN.refinery = (g, t, R, st) => {
  const k = st.k, v = st.tk;
  if (k === 0) { ttlTxt(g, R, '第一次样品交接 · W39', '', PH[4]);
    const S = ['古代小麦', '粟', '苜蓿种子', '羊毛 · 毡', '土壤', '纸张'];
    S.forEach((s, i) => { const u = pop(t, .6 + i * .6), x = R.x + (i % 3) * 300, y = R.y + 150 + Math.floor(i / 3) * 170; al(g, u, () => { rr(g, x, y, 270, 140, 14, 'rgba(14,20,36,.92)', C.p, 2); rr(g, x + 20, y + 25, 50, 64, 6, 'rgba(199,155,255,.25)'); txt(g, s, x + 90, y + 58, C.fg, fnt(700, 26)); txt(g, '样品', x + 90, y + 98, C.fg3, fnt(500, 19)); }); });
    al(g, pop(t, 5), () => { const X = R.x + 1000; arrow(g, X - 60, R.y + 300, X + 40, R.y + 300, C.fg3, 4); rr(g, X + 60, R.y + 200, 300, 200, 18, 'rgba(255,107,107,.1)', C.bad, 3); txt(g, '先检疫', X + 210, R.y + 300, C.bad, fnt(800, 40, 'serif'), 'center'); arrow(g, X + 370, R.y + 300, X + 450, R.y + 300, C.fg3, 4); txt(g, '交给安平署', X + 470, R.y + 300, C.fg, fnt(700, 26)); }); return; }
  if (k === 1) { ttlTxt(g, R, '封存的 500 g 金子', '', C.gold);
    const S = [['封存金子', '500 g', C.gold], ['正规精炼厂', '科研合作情况说明', C.b], ['合法回收', '按市价', C.ok], ['大刘名下账户', '≈ 45 万元', C.ok]];
    const w = (R.w - 3 * 60) / 4; S.forEach(([a, b, col], i) => { const x = R.x + i * (w + 60); node(g, x, R.y + 130, w, 140, a, col, pop(v, .5 + i * 1.6), b); if (i < 3) arrow(g, x + w + 6, R.y + 200, x + w + 54, R.y + 200, C.fg3, 3, 12, pop(v, 1.2 + i * 1.6)); });
    const y = R.y + 380, mx = 50; al(g, pop(v, 8), () => { txt(g, '同样 500 g', R.x, y, C.fg2, fnt(700, 24)); [['黑市六折', 27, C.bad], ['合法回收', 45, C.ok]].forEach(([a, val, col], i) => { const yy = y + 50 + i * 80; txt(g, a, R.x, yy + 24, C.fg, fnt(700, 26)); rr(g, R.x + 180, yy, (R.w - 400) * val / mx * SS((v - 8.5 - i * .5) / 1), 48, 10, col + 'AA'); txt(g, '≈ ' + val + ' 万', R.x + 200 + (R.w - 400) * val / mx, yy + 24, col, fnt(800, 26, 'mono')); }); });
    al(g, pop(v, 11), () => txt(g, '高出近一半：第一次意识到"走正路"的价值', R.x, R.y + 650, C.gold, fnt(800, 32, 'serif'))); return; }
  ttlTxt(g, R, '把来源讲清楚', '', C.gold);
  al(g, pop(v, .4), () => { rr(g, R.x + 300, R.y + 140, 520, 420, 12, '#F3E6C4'); txt(g, '情况说明', R.x + 560, R.y + 210, '#3A2E14', fnt(800, 40, 'serif'), 'center'); for (let i = 0; i < 6; i++) rr(g, R.x + 360, R.y + 270 + i * 40, 400 - (i === 5 ? 160 : 0), 12, 6, 'rgba(58,46,20,.3)'); g.beginPath(); g.arc(R.x + 720, R.y + 500, 40, 0, 7); g.strokeStyle = C.bad; g.lineWidth = 4; g.stroke(); txt(g, '机构', R.x + 720, R.y + 500, C.bad, fnt(800, 20), 'center'); });
  al(g, pop(v, 2.5), () => { txt(g, '来路不明的金子', R.x + 980, R.y + 260, C.fg3, fnt(700, 32)); arrow(g, R.x + 1060, R.y + 300, R.x + 1060, R.y + 380, C.gold, 4); txt(g, '第一次有了合法身份', R.x + 980, R.y + 430, C.ok, fnt(800, 36, 'serif')); });
  al(g, pop(v, 6), () => chip(g, '代价：他的金子从此都要经过官方', R.x + 980, R.y + 540, C.bad, 1, 24));
};
AN.beacon = (g, t, R, st) => {
  const k = st.k, v = st.tk, V = mapView({ x: R.x, y: R.y, w: 1100, h: R.h }, 15, 10, 2.55); drawMap(g, V, {});
  const vil = [['v1', '村堡一', 1], ['v2', '村堡二', 1], ['v3', '村堡三', 1], ['v4', '村堡四', 0], ['v5', '村堡五', 0]];
  site(g, V, 'sz', '沙洲', 'city', C.o, 1);
  vil.forEach(([key, n, join], i) => { const on = k >= 2 && join; site(g, V, key, n, 'v', on ? C.ok : C.fg2, pop(k === 0 ? t : 99, .8 + i * .5), k >= 2 ? (join ? '受沙洲节制' : '观望') : ''); });
  if (k === 0) vil.forEach(([key], i) => route(g, V, [[0, 0], PL[key]], SS((t - 4 - i * 1.2) / 1.2), C.gold, 2.5));
  if (k >= 1) vil.forEach(([key], i) => { const [x, y] = PL[key], d = Math.hypot(x, y), n = Math.floor(d / 23); route(g, V, [[0, 0], PL[key]], 1, 'rgba(255,210,122,.25)', 2); for (let j = 1; j <= n; j++) { const f = j / (n + .6), p = V.P([x * f, y * f]), u = pop(k === 1 ? v : 99, .5 + i * .5 + j * .25); al(g, u, () => { rr(g, p[0] - 7, p[1] - 14, 14, 20, 3, C.bad); if (k === 1) { const fl = .5 + .5 * Math.sin(v * 8 + j + i); dot(g, p[0], p[1] - 20, 5 + 3 * fl, 'rgba(255,178,92,.85)'); } }); } });
  const X = R.x + 1150, W = R.w - 1150;
  if (k === 0) { al(g, pop(t, .4), () => { txt(g, '5 个汉人村堡', X, R.y + 40, C.fg, fnt(800, 38, 'serif')); txt(g, '距沙洲 80–150 km · 共约 800 人', X, R.y + 95, C.fg2, fnt(600, 24)); txt(g, '自耕自守，多年少有往来【假设】', X, R.y + 135, C.fg3, fnt(500, 21)); });
    al(g, pop(t, 4), () => { txt(g, '韩烈带 40 骑走访', X, R.y + 240, C.gold, fnt(700, 26)); ['盐', '药', '种子', '铁农具'].forEach((s, i) => chip(g, s, X + (i % 2) * 200, R.y + 310 + Math.floor(i / 2) * 70, C.gold, 1, 24)); txt(g, '见面礼', X, R.y + 470, C.fg3, fnt(500, 21)); }); }
  if (k === 1) { al(g, pop(v, .3), () => { txt(g, '烽燧链', X, R.y + 40, C.fg, fnt(800, 38, 'serif')); txt(g, '每 20–25 km 一座', X, R.y + 100, C.fg2, fnt(600, 26)); });
    [['望远镜 + 旗语', C.gold], ['太阳能对讲机（远处村堡）', C.b], ['烽火一起 · 一天内得知', C.bad]].forEach(([s, col], i) => al(g, pop(v, 2 + i * 1.6), () => chip(g, s, X, R.y + 200 + i * 80, col, 1, 24))); }
  if (k === 2) al(g, pop(v, .3), () => { txt(g, '先送东西、不要东西', X, R.y + 40, C.fg, fnt(800, 34, 'serif')); stat(g, X, R.y + 120, 300, 170, '3 个', '同意受节制', C.ok, 1); stat(g, X + 330, R.y + 120, 300, 170, '≈500', '纳入户籍', C.ok, 1); txt(g, '另 2 个村观望', X, R.y + 360, C.fg2, fnt(700, 26)); });
  if (k === 3) { al(g, pop(v, .3), () => txt(g, '"节制"的意思', X, R.y + 40, C.fg, fnt(800, 34, 'serif')));
    [['村堡', '出人守烽燧、报敌情', C.ok], ['沙洲', '给盐、药、种子、农具', C.o], ['遇到游骑', '烽火为号 · 沙洲出兵救援', C.bad]].forEach(([a, b, col], i) => al(g, pop(v, .8 + i * 1.6), () => { const y = R.y + 110 + i * 140; rr(g, X, y, W, 120, 14, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, X + 24, y + 40, col, fnt(800, 26)); txt(g, b, X + 24, y + 84, C.fg, fnt(600, 23)); })); }
};
AN.idcard = (g, t, R, st) => {
  const v = st.bi === 3 ? t : st.tk, k = st.bi === 3 ? 2 : st.k;
  if (k === 0) { ttlTxt(g, R, '办证 · W43', '经安平署出具情况说明，按无户籍人员补录流程', PH[4]);
    al(g, pop(t, .8), () => { g.save(); g.translate(R.x + 80, R.y + 160); rr(g, 0, 0, 640, 400, 24, '#1C2A44', C.b, 3); rr(g, 40, 60, 180, 230, 12, 'rgba(92,180,255,.25)'); person(g, 130, 170, C.fg2, 2.2); txt(g, '居民身份证（示意）', 260, 70, C.fg3, fnt(600, 22)); txt(g, '姓名  萧镇北', 260, 140, C.fg, fnt(800, 32)); for (let i = 0; i < 3; i++) rr(g, 260, 190 + i * 44, 320 - i * 60, 14, 7, 'rgba(233,238,247,.15)'); rr(g, 40, 330, 560, 30, 8, 'rgba(233,238,247,.1)'); g.restore(); });
    al(g, pop(t, 5), () => { const X = R.x + 860; rr(g, X, R.y + 160, 820, 170, 18, 'rgba(14,20,36,.92)', C.gold, 2.5); txt(g, '注册公司', X + 30, R.y + 210, C.gold, fnt(700, 24)); txt(g, '西陲农资与科研样品贸易公司', X + 30, R.y + 280, C.fg, fnt(800, 36, 'serif')); });
    al(g, pop(t, 9), () => { const X = R.x + 860; rr(g, X, R.y + 380, 820, 170, 18, 'rgba(14,20,36,.92)', C.b, 2.5); txt(g, '装卸队', X + 30, R.y + 430, C.b, fnt(700, 24)); txt(g, '正式交给大刘 · 他保留少量股份', X + 30, R.y + 500, C.fg, fnt(800, 32, 'serif')); }); return; }
  if (k === 1) { ttlTxt(g, R, '对大刘的保护', '', C.b);
    const A = [['之前', '替一个黑户接单、收货', C.bad], ['之后', '一个正常经营的老板', C.ok]]; A.forEach(([a, b, col], i) => al(g, pop(v, .5 + i * 2.5), () => { const x = R.x + i * 880; rr(g, x, R.y + 160, 820, 260, 18, 'rgba(14,20,36,.92)', col, 2.5); person(g, x + 110, R.y + 300, col, 2); txt(g, a, x + 220, R.y + 240, col, fnt(700, 26)); txt(g, b, x + 220, R.y + 320, C.fg, fnt(800, 32, 'serif')); }));
    al(g, pop(v, 3), () => arrow(g, R.x + 830, R.y + 290, R.x + 870, R.y + 290, C.gold, 4)); return; }
  ttlTxt(g, R, '有了身份之后', '', PH[4]);
  [['银行', C.ok], ['网购', C.ok], ['开票', C.ok]].forEach(([s, col], i) => al(g, pop(v, .4 + i * .4), () => check(g, R.x + i * 260, R.y + 160, s, 1, col, 30)));
  al(g, pop(v, 3), () => { rr(g, R.x, R.y + 240, R.w, 140, 16, 'rgba(255,107,107,.06)', C.bad, 2); txt(g, '代价：在现代的一举一动，从此都可以追溯', R.x + 30, R.y + 310, C.fg, fnt(800, 34, 'serif')); });
  al(g, pop(v, 6), () => { rr(g, R.x, R.y + 430, R.w, 140, 16, 'rgba(255,210,122,.06)', C.gold, 2); txt(g, '禁带清单写进协议 · 每批采购都要报备', R.x + 30, R.y + 500, C.gold, fnt(800, 32, 'serif')); });
};
AN.shou = (g, t, R, st) => {
  const k = st.k, v = st.tk, V = mapView({ x: R.x, y: R.y, w: 1060, h: R.h }, -50, -40, 3.2); drawMap(g, V, {});
  site(g, V, 'sz', '沙洲', 'city', C.o, 1); site(g, V, 'sc', '寿昌', 'fort', C.bad, 1, '约 120 km'); site(g, V, 'v3', '村堡三', 'v', C.ok, .6);
  const S = V.P(PL.sc);
  if (k === 0) al(g, pop(t, 2), () => { chip(g, '东帐驻军 ≈300', S[0] - 100, S[1] - 90, C.bad, 1, 22); chip(g, '被役使汉人 ≈300', S[0] - 110, S[1] + 120, C.r, 1, 22); });
  if (k >= 1) { const f = k === 1 ? SS((v - 1) / 3) : 1; for (let i = 0; i < 24; i++) { const a = i / 24 * 6.28, r = LERP(200, 75, f), p0 = V.P([0, 0]); const x = LERP(p0[0], S[0] + r * Math.cos(a), f), y = LERP(p0[1], S[1] + r * Math.sin(a) * .8, f); dot(g, x, y, 5.5, i % 3 ? C.o : C.gold); }
    const ww = V.P([-200, -10]); al(g, pop(k === 1 ? v : 99, 4), () => { for (let i = 0; i < 8; i++) dot(g, ww[0] + (i % 4) * 14, ww[1] + Math.floor(i / 4) * 14, 6, C.p); chip(g, '西帐 200 骑 · 截断援兵', ww[0] - 20, ww[1] - 40, C.p, 1, 20); }); }
  if (k === 2 && v > 1) { for (let i = 0; i < 8; i++) { const f = SS((v - 2) / 3), x = S[0] - f * 180 - (i % 4) * 12, y = S[1] + 40 + f * 120 + Math.floor(i / 4) * 12; dot(g, x, y, 5, C.bad); } }
  const X = R.x + 1110, W = R.w - 1110;
  if (k === 0) al(g, pop(t, .5), () => { txt(g, '收复寿昌 · W45–46', X, R.y + 40, C.fg, fnt(800, 38, 'serif')); para(g, '城西南约 120 km 的旧汉人城堡【假设】', X, R.y + 100, W, 24, C.fg2, 600); stat(g, X, R.y + 200, 300, 160, '冬天', '补给困难', C.b, pop(t, 6)); });
  if (k === 1) { al(g, pop(v, .3), () => txt(g, '出击', X, R.y + 40, C.fg, fnt(800, 38, 'serif'))); [['80', '甲士', C.o], ['60', '骑马弩手', C.gold], ['60', '骑兵', C.b]].forEach(([a, b, col], i) => stat(g, X + i * 230, R.y + 100, 210, 150, a, b, col, pop(v, .6 + i * .6)));
    al(g, pop(v, 6), () => { rr(g, X, R.y + 320, W, 230, 16, 'rgba(255,210,122,.07)', C.gold, 2.5); txt(g, '先围后谈', X + 26, R.y + 370, C.gold, fnt(800, 32)); para(g, '射书入堡：投降的人放归草原。守军半数趁夜出走，其余开门。', X + 26, R.y + 430, W - 52, 24, C.fg, 600); }); }
  if (k === 2) { al(g, pop(v, .3), () => { txt(g, '为什么围而不攻', X, R.y + 40, C.fg, fnt(800, 36, 'serif')); });
    [['兵太少', '承受不起攻坚伤亡', C.bad], ['冬天', '堡里缺粮缺柴', C.b], ['时间', '站在围城一方', C.ok]].forEach(([a, b, col], i) => al(g, pop(v, 1 + i * 1.5), () => { const y = R.y + 110 + i * 140; rr(g, X, y, W, 120, 14, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, X + 24, y + 40, col, fnt(800, 26)); txt(g, b, X + 24, y + 84, C.fg, fnt(600, 23)); })); }
};
AN.pop = (g, t, R, st) => {
  ttlTxt(g, R, '治下人口', '', PH[4]);
  const P = [['W01', 900], ['W21', 980], ['W33', 1020], ['W42', 1520], ['W46', 2300]], X = R.x + 80, Y = R.y + 140, W = R.w - 160, H = 420, mx = 2500;
  const px = i => X + i / (P.length - 1) * W, py = v => Y + H - H * v / mx;
  line(g, [[X, py(2000)], [X + W, py(2000)]], C.gold, 2, [8, 8]); txt(g, '2000', X - 14, py(2000), C.gold, fnt(700, 20, 'mono'), 'right');
  const u = SS((t - .3) / 3), n = u * (P.length - 1); const pts = []; for (let i = 0; i <= Math.floor(n); i++) pts.push([px(i), py(P[i][1])]); const fi = Math.floor(n); if (fi < P.length - 1) pts.push([LERP(px(fi), px(fi + 1), n - fi), LERP(py(P[fi][1]), py(P[fi + 1][1]), n - fi)]);
  if (pts.length > 1) line(g, pts, C.b, 5);
  P.forEach(([w, v], i) => { if (i > n + .01) return; dot(g, px(i), py(v), 9, C.b); txt(g, '≈' + v, px(i), py(v) - 30, C.fg, fnt(800, 24, 'mono'), 'center'); txt(g, w, px(i), Y + H + 30, C.fg3, fnt(600, 19, 'mono'), 'center'); });
  const L = ['救回 86', '西帐赎回 40+', '3 个村堡 ≈500', '寿昌 ≈300 · 另 2 村来附']; L.forEach((s, i) => { if (i + 1 > n + .01) return; txt(g, s, (px(i) + px(i + 1)) / 2, Y + H + 64, C.fg2, fnt(600, 19), 'center'); });
  if (st.k >= 1) { const v = st.tk; ['口粮', '医药', '教书', '户籍'].forEach((s, i) => al(g, pop(v, 2 + i * .7), () => chip(g, s + '：按两千多人算', R.x + i * 420, R.y + 680, C.gold, 1, 24))); al(g, pop(v, .3), () => txt(g, '要打的仗少了，要管的事多了', R.x + R.w, R.y + 40, C.fg, fnt(800, 32, 'serif'), 'right')); }
};
AN.popsrc = (g, t, R) => {
  ttlTxt(g, R, '≈2300 人从哪里来', '', PH[4]);
  const S = [['原城内', 900, C.o], ['乌兰城救回', 86, C.r], ['西帐赎回', 40, C.p], ['5 个村堡', 800, C.ok], ['寿昌', 300, C.b], ['回迁流民', 174, C.fg3]];
  let x = R.x; const W = R.w, tot = 2300, y = R.y + 200;
  S.forEach(([a, v, col], i) => { const w = W * v / tot, u = pop(t, .4 + i * 1.2); al(g, u, () => { rr(g, x + 2, y, Math.max(6, w - 4) * SS(u), 110, 10, col + 'CC'); if (w > 120) { txt(g, a, x + 16, y + 40, '#071018', fnt(800, 22)); txt(g, '≈' + v, x + 16, y + 80, '#071018', fnt(800, 26, 'mono')); } else { const yy = y + 160 + (i % 2) * 70; line(g, [[x + w / 2, y + 112], [x + w / 2, yy - 20]], col, 2); txt(g, a + ' ≈' + v + (i === 5 ? '（估）' : ''), x + w / 2, yy, col, fnt(700, 22), 'center'); } }); x += w; });
  al(g, pop(t, 8), () => txt(g, '流民一项为总数减去其余各项的粗估', R.x, R.y + 440, C.fg3, fnt(500, 20)));
};
AN.volume = (g, t, R) => {
  ttlTxt(g, R, '第一次认真算体积', '两层楼 ≈ 500 m³【假设】', PH[4]);
  const cx = R.x + 420, by = R.y + 650, s = 9; // 500 m³ 框：10 × 9 × 6（等距示意）
  const iso = (x, y, z) => [cx + (x - y) * s * 2.2, by - (x + y) * s * 1.1 - z * s * 3.4];
  const box = (x0, y0, z0, dx, dy, dz, col, fill, a = 1) => al(g, a, () => { const P = [[0, 0, 0], [dx, 0, 0], [dx, dy, 0], [0, dy, 0], [0, 0, dz], [dx, 0, dz], [dx, dy, dz], [0, dy, dz]].map(([x, y, z]) => iso(x0 + x, y0 + y, z0 + z));
    if (fill) { [[4, 5, 6, 7], [1, 2, 6, 5], [0, 1, 5, 4]].forEach((f, i) => { g.beginPath(); f.forEach((k, j) => j ? g.lineTo(...P[k]) : g.moveTo(...P[k])); g.closePath(); g.fillStyle = fill[i]; g.fill(); }); }
    g.strokeStyle = col; g.lineWidth = 2; [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].forEach(([a2, b]) => line(g, [P[a2], P[b]], col, 2)); });
  box(0, 0, 0, 10, 9, 6, 'rgba(163,174,195,.45)', null, pop(t, .4));
  const u = SS((t - 2) / 2); box(0, 0, 0, 5, 4, 3 * u, C.b, ['rgba(92,180,255,.45)', 'rgba(92,180,255,.3)', 'rgba(92,180,255,.2)'], pop(t, 2));
  const X = R.x + 1000; al(g, pop(t, 3), () => { stat(g, X, R.y + 150, 340, 170, '≈60 m³', '这一批（W47–48）', C.b, 1); stat(g, X + 380, R.y + 150, 340, 170, '500 m³', '体积上限', C.fg2, 1); });
  al(g, pop(t, 6), () => { txt(g, '光伏组件 30 kW 最占地方', X, R.y + 400, C.fg, fnt(700, 26)); txt(g, '车床 · 铣床 · 水泵 · 6 t 粮', X, R.y + 450, C.fg2, fnt(600, 24)); });
  al(g, pop(t, 9), () => { rr(g, X, R.y + 520, 720, 120, 16, 'rgba(95,211,154,.07)', C.ok, 2); txt(g, '开春屯田可扩到 2000 亩', X + 26, R.y + 580, C.ok, fnt(800, 30)); });
};
AN.compare = (g, t, R) => {
  ttlTxt(g, R, '一年前后对照', '', PH[4]);
  const rows = [['治下人口', '≈900', '≈2300'], ['能战者', '≈120', '≈400'], ['耕地', '城内菜地', '屯田 ≈1400 亩'], ['电力', '无', '≈45 kW 光伏'], ['医疗', '无药', '3 座医馆 · 有抗生素'], ['教育', '—', '2 座学堂 · 学徒 ≈60'], ['他在现代', '黑户日结工', '合法身份 · 受审核的公司']];
  const X = R.x, y0 = R.y + 110, rh = 84, c1 = 300, c2 = 520;
  al(g, pop(t, .2), () => { txt(g, 'W01', X + c1 + 20, y0, C.fg3, fnt(800, 26, 'mono')); txt(g, 'W52', X + c1 + c2 + 20, y0, PH[4], fnt(800, 26, 'mono')); });
  rows.forEach(([a, b, c], i) => { const u = pop(t, .6 + i * 1.6), y = y0 + 30 + i * rh; al(g, u, () => { rr(g, X, y, R.w, rh - 12, 12, 'rgba(14,20,36,.9)', C.line2, 1.5); txt(g, a, X + 24, y + (rh - 12) / 2, C.fg2, fnt(700, 25)); txt(g, b, X + c1 + 20, y + (rh - 12) / 2, C.fg3, fnt(600, 27)); arrow(g, X + c1 + c2 - 90, y + (rh - 12) / 2, X + c1 + c2 - 20, y + (rh - 12) / 2, C.fg3, 3, 10); txt(g, c, X + c1 + c2 + 20, y + (rh - 12) / 2, C.fg, fnt(800, 29)); }); });
};
AN.yearbar = (g, t, R, st) => {
  if (st.k === 0) { ttlTxt(g, R, '全年总账', '', PH[4]);
    const T = [24, 39, 57, 76], M = [8.7, 18, 25, 72], B = ['钱', '钱和兵力', '信任与合规', '额度'];
    const X = R.x + 60, Y = R.y + 140, H = 360, bw = (R.w - 120) / 4;
    T.forEach((v, i) => { const u = pop(t, .5 + i * .8, .8), x = X + i * bw, h = H * v / 80 * SS(u), h2 = H * M[i] / 80 * SS(u); rr(g, x + 30, Y + H - h, bw * .3, h, 8, PH[i + 1] + 'CC'); rr(g, x + 40 + bw * .3, Y + H - h2, bw * .3, h2, 8, 'rgba(255,122,147,.6)');
      if (u > .9) { txt(g, '≈' + v + ' t', x + 30 + bw * .15, Y + H - h - 20, C.fg, fnt(800, 22, 'mono'), 'center'); txt(g, '≈' + M[i] + ' 万', x + 40 + bw * .45, Y + H - h2 - 20, C.r, fnt(800, 22, 'mono'), 'center'); }
      txt(g, '阶段' + '一二三四'[i] + ' · ' + PHN[i + 1], x + 30 + bw * .3, Y + H + 30, C.fg2, fnt(700, 22), 'center');
      al(g, pop(t, 6 + i * 1.2), () => chip(g, '瓶颈：' + B[i], x + 30, Y + H + 90, i === 3 ? C.gold : C.fg2, 1, 22)); });
    txt(g, '■ 运入（吨）', X, Y - 20, C.fg2, fnt(700, 20)); txt(g, '■ 花费（万元）', X + 160, Y - 20, C.r, fnt(700, 20));
    al(g, pop(t, 3.5), () => { txt(g, '全年 ≈196 t · ≈124 万元', R.x + R.w, R.y + 30, C.gold, fnt(800, 34, 'mono'), 'right'); }); return; }
  const v = st.tk; ttlTxt(g, R, '全年的三个结论', '', C.gold);
  [['口粮是最重的东西', '900 人吃七成饷，每周约 2.5 t'], ['本钱只能靠打', 'W21 远袭乌兰城'], ['金子卖不出去才是常态', '直到借安平署关系才第一次合法变现']].forEach(([a, b], i) => al(g, pop(v, .4 + i * 2.4), () => { const y = R.y + 120 + i * 180; rr(g, R.x, y, R.w, 150, 18, 'rgba(255,210,122,.06)', C.gold, 2.5); txt(g, String(i + 1), R.x + 60, y + 75, C.gold, fnt(800, 64, 'mono'), 'center'); txt(g, a, R.x + 130, y + 58, C.fg, fnt(800, 38, 'serif')); txt(g, b, R.x + 130, y + 112, C.fg2, fnt(600, 23)); }));
};
AN.risks = (g, t, R) => {
  ttlTxt(g, R, '风险并没有消失', '', C.bad);
  al(g, pop(t, .5), () => { rr(g, R.x, R.y + 110, R.w, 170, 18, 'rgba(255,107,107,.07)', C.bad, 3); txt(g, '最大的风险：对官方的依赖', R.x + 30, R.y + 165, C.bad, fnt(800, 32)); txt(g, '合作一旦叫停 → 药品与变现渠道同时断', R.x + 30, R.y + 230, C.fg, fnt(700, 28)); });
  iconCards(g, t, { x: R.x, y: R.y, w: R.w }, [['队', '保留独立收入', '装卸队仍在大刘手里', C.b], ['坊', '工坊逐步自给', '沙洲自己造', C.o], ['铁', '铁器只给盟友', '而且限量', C.fg2], ['技', '技术不外传', '防止盟友坐大', C.p]], { y: R.y + 330, h: 250, t0: 5, dt: 1.6 });
};
AN.year2 = (g, t, R) => {
  ttlTxt(g, R, '第二年：从"输血"到"种技术"', '', PH[4]);
  const A = [['多带', ['成品', '口粮'], C.fg3], ['带能在沙洲生产的东西', ['种畜', '工艺', '教材'], C.ok]];
  A.forEach(([h, ls, col], i) => al(g, pop(t, .5 + i * 2), () => { const x = R.x + i * 900; rr(g, x, R.y + 120, 820, 280, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, (i ? '' : '少') + h, x + 30, R.y + 175, col, fnt(800, 32, 'serif')); ls.forEach((s, k) => chip(g, s, x + 30 + k * 200, R.y + 280, col, 1, 28)); }));
  al(g, pop(t, 2), () => arrow(g, R.x + 830, R.y + 260, R.x + 890, R.y + 260, C.gold, 5, 16));
  const y = R.y + 470, W = R.w, u = SS((t - 7) / 2.5);
  al(g, pop(t, 6), () => { txt(g, '每周 6.8 t', R.x, y, C.fg2, fnt(700, 24)); const f = LERP(1 / 3, 0, u); rr(g, R.x, y + 30, W * f, 70, 12, 'rgba(255,210,122,.7)'); rr(g, R.x + W * f, y + 30, W * (1 - f), 70, 12, 'rgba(92,180,255,.45)'); if (f > .08) txt(g, '口粮', R.x + 20, y + 65, '#1a1408', fnt(800, 24)); txt(g, u > .5 ? '设备 · 药品 · 种畜 · 教材' : '其他', R.x + W * f + 24, y + 65, C.fg, fnt(800, 24)); });
  al(g, pop(t, 10), () => txt(g, '粮食自给以后，那三分之一额度就能腾出来', R.x, y + 160, C.ok, fnt(700, 28)));
};
AN.end = (g, t, R) => {
  skyline(g, R, t, .35);
  al(g, pop(t, .5), () => txt(g, '一吨的通道，一年的窗口', R.x + R.w / 2, R.y + 90, C.fg, fnt(800, 60, 'serif'), 'center'));
  const w = (R.w - 90) / 4; [['守住', PH[1]], ['强军', PH[2]], ['分化', PH[3]], ['拓土', PH[4]]].forEach(([s, col], i) => al(g, pop(t, 2 + i * .6), () => { rr(g, R.x + i * (w + 30), R.y + 170, w, 110, 16, 'rgba(14,20,36,.92)', col, 3); txt(g, s, R.x + i * (w + 30) + w / 2, R.y + 225, col, fnt(800, 44, 'serif'), 'center'); }));
  al(g, pop(t, 5), () => txt(g, '同一组约束：钱 · 额度 · 人 · 信任', R.x + R.w / 2, R.y + 350, C.gold, fnt(800, 36), 'center'));
  al(g, pop(t, 8), () => txt(g, '本片由 AI 生成 · 文稿与画面 Claude · 配音 Gemini TTS · 感谢观看', R.x + R.w / 2, R.y + 420, C.fg3, fnt(600, 24), 'center'));
};
