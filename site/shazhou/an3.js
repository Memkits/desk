// 第三集动画：外交分化
AN.check = (g, t, R, st) => {
  const k = st.k, v = st.tk;
  ttlTxt(g, R, '安平署盘查 · W25', '虚构治安机关', C.p);
  const rep = ['无身份人员大量出售来源不明的金条', '仓库只进不出', '荒地里夜夜有三轮车往来'];
  al(g, k === 0 ? 1 : .35, () => { rr(g, R.x, R.y + 120, 820, 330, 18, 'rgba(255,107,107,.05)', C.bad, 2); txt(g, '回收店举报', R.x + 30, R.y + 168, C.bad, fnt(800, 28));
    rep.forEach((s, i) => al(g, pop(k === 0 ? t : 99, 1.5 + i * 1.4), () => { dot(g, R.x + 42, R.y + 240 + i * 70, 6, C.bad); txt(g, s, R.x + 66, R.y + 240 + i * 70, C.fg, fnt(600, 27)); })); });
  if (k >= 1) { const X = R.x + 880, W = R.w - 880, tt = k === 1 ? v : 99;
    al(g, pop(tt, .3), () => { rr(g, X, R.y + 120, W, 110, 16, 'rgba(14,20,36,.92)', C.line2, 2); txt(g, '"西北山里来的，没上过户口；金子是家里祖传的。"', X + 26, R.y + 175, C.fg, fnt(600, 25)); });
    [['按身份不明人员登记', 1], ['采集指纹和照片', 1], ['随叫随到', 1], ['约 500 g 金子暂扣待查', 1], ['被拘留', 0], ['任何合作', 0]].forEach(([s, ok], i) => al(g, pop(tt, 3 + i * .9), () => { const y = R.y + 280 + i * 62; if (ok) check(g, X, y, s, 1, C.gold, 26); else { cross(g, X + 15, y, 1, C.fg3, 11); txt(g, '没有' + s, X + 46, y, C.fg2, fnt(600, 26)); } })); }
  if (k >= 2) { const tt = k === 2 ? v : 99, y = R.y + 520;
    if (k === 99) { al(g, pop(tt, .3), () => { rr(g, R.x, y, 820, 150, 16, 'rgba(199,155,255,.07)', C.p, 2); para(g, '查遍全国盗窃案也对不上 → 事情悬在半空', R.x + 26, y + 50, 770, 26, C.fg, 700); txt(g, '从此不再卖金，靠分藏的现金运转', R.x + 26, y + 110, C.fg2, fnt(600, 23)); }); }
    else { al(g, pop(tt, .3), () => { const A = [['跑', '仓库和货被查封 · 牵连大刘', C.bad], ['留', '用真话换时间', C.ok]]; A.forEach(([a, b, col], i) => { rr(g, R.x + i * 420, y, 400, 150, 16, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, R.x + i * 420 + 30, y + 55, col, fnt(800, 40, 'serif')); para(g, b, R.x + i * 420 + 100, y + 55, 280, 22, C.fg2, 600); }); }); }
  }
};
AN.siege = (g, t, R, st) => {
  const k = st.k, v = st.tk, cx = R.x + 470, cy = R.y + 420;
  // 俯视：子城 + 刺绳环 + 敌骑
  const ring = (r, col, w, dash) => { g.save(); g.strokeStyle = col; g.lineWidth = w; if (dash) g.setLineDash(dash); g.beginPath(); g.ellipse(cx, cy, r, r * .8, 0, 0, 7); g.stroke(); g.restore(); };
  const hi = n => k === 1 ? SS((v - 1 - n * 2.2) / .6) : 0;
  ring(340, `rgba(255,210,122,${.25 + .6 * hi(0)})`, 2, [4, 10]); ring(230, `rgba(163,174,195,${.5 + .5 * hi(1)})`, 4, [3, 5]); ring(200, `rgba(80,90,110,${.6 + .4 * hi(2)})`, 3, [2, 6]);
  rr(g, cx - 120, cy - 96, 240, 192, 8, 'rgba(255,178,92,.08)', C.o, 4 + 3 * hi(3)); txt(g, '子城', cx, cy, C.o, fnt(800, 30, 'serif'), 'center');
  const N = 60, adv = k === 0 ? SS((t - 1) / 4) : k >= 2 ? 1 - SS((k === 2 ? v - 2 : 99) / 3) * .6 : 1;
  for (let i = 0; i < N; i++) { const a = i / N * 6.28 + HSH(i, 1) * .1, r = LERP(460, 250 + HSH(i, 2) * 20, adv); al(g, k >= 2 && HSH(i, 3) < .15 ? .2 : .9, () => dot(g, cx + r * Math.cos(a), cy + r * Math.sin(a) * .8, 6, C.bad)); }
  if (k <= 1 && t > 3) for (let i = 0; i < 14; i++) { const ph = ((k === 0 ? t : v + 5) * .8 + HSH(i, 5)) % 1, a = HSH(i, 6) * 6.28, x = cx + LERP(110, 240, ph) * Math.cos(a), y = cy + LERP(90, 195, ph) * Math.sin(a); dot(g, x, y, 3, C.gold); }
  const X = R.x + 960, W = R.w - 960;
  if (k === 0) { al(g, pop(t, .5), () => txt(g, '秋季报复 · W29–30', X, R.y + 40, C.fg, fnt(800, 38, 'serif'))); stat(g, X, R.y + 110, 360, 180, '≈1500', '东帐骑兵', C.bad, pop(t, 1.5)); stat(g, X + 400, R.y + 110, 360, 180, '≈120', '能战者（另有民壮弩手）', C.o, pop(t, 2.5));
    al(g, pop(t, 5), () => { check(g, X, R.y + 380, '望远镜提前一天预警', 1, C.gold, 26); check(g, X, R.y + 440, '刺绳带前被拖住', 1, C.gold, 26); check(g, X, R.y + 500, '甲士守门 · 民壮弩手轮番齐射', 1, C.gold, 26); }); }
  if (k === 1) { al(g, pop(v, .2), () => txt(g, '分层防守', X, R.y + 40, C.fg, fnt(800, 38, 'serif')));
    [['望远镜 · 烽哨', '提前一天预警', C.gold], ['刺绳 · 壕沟（一百步外）', '拖慢冲锋的马', C.fg2], ['蒺藜 · 拒马', '让骑兵难以靠近', C.fg3], ['城头弩手三排轮射', '每段城墙都在交叉射界里', C.o]].forEach(([a, b, col], i) => al(g, pop(v, 1 + i * 2.2), () => { const y = R.y + 120 + i * 140; rr(g, X, y, W, 120, 14, 'rgba(14,20,36,.92)', col, 2.5); txt(g, a, X + 26, y + 42, C.fg, fnt(800, 28)); txt(g, b, X + 26, y + 86, C.fg2, fnt(500, 22)); })); }
  if (k === 2) { const S = [['3 天', '攻城', C.fg2], ['200+', '敌伤亡', C.bad], ['11', '沙洲阵亡', C.o]]; S.forEach(([a, b, col], i) => stat(g, X + i * 260, R.y + 110, 230, 180, a, b, col, pop(v, .4 + i * 1.2)));
    al(g, pop(v, 4.5), () => para(g, '大半伤者被医坊救回。城小、人少，反而让刺绳和弩阵覆盖每一段城墙。', X, R.y + 400, W, 27, C.fg, 700)); }
  if (k >= 3) { al(g, k === 3 ? 1 : .5, () => { rr(g, X, R.y + 100, W, 210, 16, 'rgba(92,180,255,.06)', C.b, 2); txt(g, '与此同时 · 郑州', X + 26, R.y + 150, C.b, fnt(700, 24)); txt(g, '安平署记录："这个人又不见了。"', X + 26, R.y + 230, C.fg, fnt(800, 32, 'serif')); }); }
  if (k === 4) { const yb = R.y + 520, xm = X + W / 2, tilt = Math.sin(v * 1.2) * .08; al(g, pop(v, .3), () => { g.save(); g.translate(xm, yb); g.rotate(tilt); line(g, [[-360, 0], [360, 0]], C.fg2, 6); chip(g, '沙洲越危险 → 越要待在沙洲', -380, -36, C.o, 1, 22); chip(g, '消失越久 → 越像有秘密', 40, -36, C.b, 1, 22); g.restore(); g.beginPath(); g.moveTo(xm, yb); g.lineTo(xm - 26, yb + 50); g.lineTo(xm + 26, yb + 50); g.closePath(); g.fillStyle = C.fg3; g.fill(); txt(g, '两条线互相牵制', xm, yb + 100, C.gold, fnt(800, 30), 'center'); }); }
};
AN.vanish = (g, t, R) => {
  // 夜景：仓库、蹲守的车、三轮车在锚点消失
  g.fillStyle = 'rgba(3,5,12,.5)'; g.fillRect(R.x, R.y, R.w, R.h); for (let i = 0; i < 60; i++) dot(g, R.x + HSH(i, 1) * R.w, R.y + HSH(i, 2) * 300, 1.5, 'rgba(233,238,247,.5)');
  const gy = R.y + 600; rr(g, R.x, gy, R.w, 4, 2, C.line2);
  rr(g, R.x + 80, gy - 200, 360, 200, 6, '#141B2C', C.line2, 2); txt(g, '仓库棚', R.x + 260, gy + 36, C.fg3, fnt(600, 22), 'center');
  rr(g, R.x + 560, gy - 70, 170, 70, 14, '#1B2438', C.fg3, 2); dot(g, R.x + 590, gy, 14, '#0B0F18'); dot(g, R.x + 700, gy, 14, '#0B0F18'); al(g, pop(t, 1), () => chip(g, '同一辆车，夜里蹲守', R.x + 520, gy - 110, C.b, 1, 20));
  const ax = R.x + 1300; g.save(); g.strokeStyle = 'rgba(255,210,122,.35)'; g.setLineDash([6, 8]); g.beginPath(); g.ellipse(ax, gy, 160, 26, 0, 0, 7); g.stroke(); g.restore(); txt(g, '锚点 · 荒地', ax, gy + 60, C.gold, fnt(700, 22), 'center');
  const mv = SS((t - 3) / 3), x = LERP(R.x + 460, ax - 60, mv), fade = t < 7 ? 1 : 1 - SS((t - 7) / 1.2), back = SS((t - 11) / 1);
  al(g, Math.max(fade, 0), () => { rr(g, x, gy - 80, 120, 60, 6, '#5A4630', C.gold, 2); dot(g, x + 20, gy - 10, 12, C.fg3); dot(g, x + 100, gy - 10, 12, C.fg3); person(g, x + 150, gy - 40, C.fg2, 1.2); });
  if (t > 7 && t < 9) { const u = SS((t - 7) / 1) * (1 - SS((t - 8) / 1)); al(g, u, () => { const gr = g.createRadialGradient(ax, gy - 60, 0, ax, gy - 60, 220); gr.addColorStop(0, 'rgba(255,210,122,.6)'); gr.addColorStop(1, 'rgba(255,210,122,0)'); g.fillStyle = gr; g.fillRect(ax - 240, gy - 280, 480, 300); }); }
  al(g, pop(t, 9), () => txt(g, '两天后……', ax, R.y + 140, C.fg2, fnt(700, 34, 'serif'), 'center'));
  al(g, back, () => { person(g, ax, gy - 40, C.fg2, 1.2); });
  al(g, pop(t, 13), () => { person(g, ax - 200, gy - 40, C.p, 1.2); person(g, ax - 250, gy - 40, C.p, 1.2); chip(g, '安平署的人在等他', ax - 380, gy - 130, C.p, 1, 22); });
  al(g, pop(t, 6.5), () => txt(g, '一车货连同人一起消失', R.x, R.y + 60, C.fg, fnt(800, 38, 'serif')));
};
AN.talk = (g, t, R, st) => {
  const k = st.k, v = st.tk;
  ttlTxt(g, R, '第一次面谈 · W33', '此时没有任何官方渠道', C.p);
  const L = [R.x, '萧镇北', C.gold, ['能把东西"带到别处"', '那边是缺粮缺药的孤城', '带去的是粮、药、五金、种子', '金子是从敌人城里夺来的'], ['锚点的规则', '额度多少', '那边是什么年代']];
  const Rr = [R.x + 900, '安平署', C.p, ['继续观察', '暂扣金子继续封存'], ['观察了多久', '掌握了多少']];
  [L, Rr].forEach(([x, who, col, say, hide], j) => {
    al(g, pop(k === 0 ? t : 99, .3 + j * (k === 0 ? 8 : 0)), () => { rr(g, x, R.y + 110, 820, 470, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, who, x + 30, R.y + 160, col, fnt(800, 32, 'serif')); });
    say.forEach((s, i) => { if (j === 1 && k < 1) return; al(g, pop(k === 0 ? t : (j === 1 && k === 1 ? v - 6 : 99), 1 + i * 1.2), () => { check(g, x + 30, R.y + 230 + i * 56, (j ? '' : '说：') + s, 1, col, 24); }); });
    if (k >= 1) hide.forEach((s, i) => al(g, pop(k === 1 ? v - j * 3 : 99, .5 + i * .8), () => { const y = R.y + 470 + (i % 2) * 50, xx = x + 30 + Math.floor(i / 2) * 380; rr(g, xx, y - 20, 350, 40, 8, 'rgba(255,255,255,.04)', C.line2, 1.5); txt(g, '不说：' + s, xx + 14, y, C.fg3, fnt(600, 21)); }));
  });
  if (k === 1) al(g, pop(v, 9), () => chip(g, '约定：他不跑 · 对方不扣人 · 金子继续封存', R.x + 380, R.y + 640, C.gold, 1, 26));
  if (k === 2) { g.fillStyle = 'rgba(7,10,18,.82)'; g.fillRect(R.x - 10, R.y + 100, R.w + 20, 600);
    const A = [['他手里有的', ['能力只在他身上', '强迫不了，也复制不了'], C.gold], ['对方手里有的', ['身份', '合法变现', '药'], C.p]];
    A.forEach(([h, ls, col], i) => al(g, pop(v, .4 + i * 3), () => { const x = R.x + i * 900; rr(g, x, R.y + 140, 820, 400, 18, 'rgba(14,20,36,.95)', col, 3); txt(g, h, x + 30, R.y + 195, col, fnt(800, 32, 'serif')); ls.forEach((s, k2) => txt(g, s, x + 30, R.y + 280 + k2 * 70, C.fg, fnt(700, 34))); }));
    al(g, pop(v, 6), () => { arrow(g, R.x + 830, R.y + 300, R.x + 890, R.y + 300, C.fg2, 3); arrow(g, R.x + 890, R.y + 360, R.x + 830, R.y + 360, C.fg2, 3); txt(g, '互相需要', R.x + R.w / 2, R.y + 610, C.gold, fnt(800, 34), 'center'); }); }
};
AN.tents = (g, t, R, st) => {
  const k = st.k, v = st.tk, E = [R.x + 260, R.y + 230], Wt = [R.x + 1460, R.y + 230], S = [R.x + 860, R.y + 600];
  const nd = ([x, y], name, sub, col, r = 110) => { g.beginPath(); g.arc(x, y, r, 0, 7); g.fillStyle = 'rgba(14,20,36,.95)'; g.fill(); g.strokeStyle = col; g.lineWidth = 3.5; g.stroke(); txt(g, name, x, y - 10, C.fg, fnt(800, 34, 'serif'), 'center'); txt(g, sub, x, y + 34, col, fnt(600, 20), 'center'); };
  if (k === 0) { nd(S, '沙洲', '守住', C.o, 120); al(g, pop(t, .5), () => nd(E, '东帐部', '第二次来攻', C.bad, 130));
    const f = SS((t - 1) / 2.5), b = SS((t - 4) / 2); for (let i = 0; i < 18; i++) { const x = LERP(E[0] + 80, S[0] - 140, f) - b * 380 + (i % 6) * 14, y = LERP(E[1] + 80, S[1] - 80, f) - b * 240 + Math.floor(i / 6) * 14; dot(g, x, y, 5, C.bad); }
    for (let i = 0; i < 8; i++) { const x = S[0] - 140 - b * 260 + (i % 4) * 14, y = S[1] - 90 - b * 160 + Math.floor(i / 4) * 14; al(g, b, () => dot(g, x, y, 5, C.o)); }
    al(g, pop(t, 5), () => chip(g, '骑兵第一次出城追击', S[0] + 150, S[1] - 80, C.o, 1, 24)); al(g, pop(t, 1.5), () => chip(g, '规模更小 · 士气低落', E[0] - 130, E[1] + 170, C.bad, 1, 22)); return; }
  nd(E, '东帐部', '强', C.bad, 130); nd(Wt, '西帐部', '弱 · 急需盟友', C.p, 110); nd(S, '沙洲', '夹在中间', C.o, 120);
  if (k === 1) { al(g, pop(v, 1), () => { arrow(g, E[0] + 140, E[1] - 10, Wt[0] - 120, Wt[1] - 10, C.bad, 4); txt(g, '怀疑西帐袭了乌兰城 · 两帐开战', (E[0] + Wt[0]) / 2, E[1] - 50, C.fg2, fnt(700, 24), 'center'); });
    al(g, pop(v, 5), () => { line(g, [[S[0] + 90, S[1] - 80], [Wt[0] - 80, Wt[1] + 80]], C.gold, 4, [10, 8]); txt(g, '让西帐离不开自己', (S[0] + Wt[0]) / 2 + 80, (S[1] + Wt[1]) / 2 + 30, C.gold, fnt(700, 24), 'left'); });
    al(g, pop(v, 7.5), () => { chip(g, '东帐：两线作战', E[0] - 100, E[1] + 190, C.bad, 1, 24); }); return; }
  // k === 2：互市之约
  al(g, pop(v, .5), () => { arrow(g, S[0] + 100, S[1] - 100, Wt[0] - 100, Wt[1] + 90, C.gold, 4); txt(g, '情报 + 按月供应：白糖 · 茶砖 · 铁锅 · 药', (S[0] + Wt[0]) / 2 + 60, (S[1] + Wt[1]) / 2 + 40, C.gold, fnt(700, 22), 'left'); });
  al(g, pop(v, 6), () => { chip(g, '互市之约', Wt[0] - 80, Wt[1] + 160, C.ok, 1, 26); chip(g, '腹背受敌 · 撤兵', E[0] - 110, E[1] + 190, C.bad, 1, 24); });
  al(g, pop(v, 10), () => chip(g, '秋季风险期 · 平安度过', S[0] - 170, S[1] + 160, C.ok, 1, 26));
};
AN.exchange = (g, t, R, st) => {
  const k = st.k, v = st.tk;
  ttlTxt(g, R, '共同利益 · W37', '安平署带来一位科研顾问', C.p);
  const A = [['顾问想要', ['古代作物种子', '羊毛', '土壤', '纸张文书'], C.p, R.x], ['他想要', ['抗生素', '正规医疗设备', '技术书籍', '封存金子合法变现'], C.gold, R.x + 1060]];
  A.forEach(([h, ls, col, x], i) => al(g, pop(k === 0 ? t - i * 6 : 99, .3), () => { rr(g, x, R.y + 110, 660, 420, 18, 'rgba(14,20,36,.92)', col, 2.5); txt(g, h, x + 30, R.y + 160, col, fnt(800, 32, 'serif')); ls.forEach((s, j) => al(g, pop(k === 0 ? t - i * 6 : 99, 1 + j * .7), () => txt(g, '· ' + s, x + 30, R.y + 240 + j * 64, C.fg, fnt(700, 30)))); }));
  const mx = R.x + 860; al(g, pop(k === 0 ? t : 99, 3), () => { arrow(g, R.x + 680, R.y + 260, R.x + 1040, R.y + 260, C.p, 4); arrow(g, R.x + 1040, R.y + 380, R.x + 680, R.y + 380, C.gold, 4); txt(g, '沙洲 → 现代', mx, R.y + 230, C.p, fnt(600, 20), 'center'); txt(g, '现代 → 沙洲', mx, R.y + 420, C.gold, fnt(600, 20), 'center'); });
  if (k >= 1) al(g, pop(k === 1 ? v : 99, .4), () => { rr(g, mx - 90, R.y + 200, 180, 120, 14, 'rgba(255,107,107,.15)', C.bad, 3); txt(g, '检疫', mx, R.y + 262, C.bad, fnt(800, 36, 'serif'), 'center'); });
  if (k === 1) al(g, pop(v, 5), () => { rr(g, R.x, R.y + 580, R.w, 100, 16, 'rgba(199,155,255,.07)', C.p, 2); txt(g, '先试一次样品交接，看彼此是否守信 · 合作仍没有开始', R.x + 30, R.y + 630, C.fg, fnt(700, 28)); });
  if (k === 2) al(g, pop(v, .4), () => { rr(g, R.x, R.y + 580, R.w, 100, 16, 'rgba(255,107,107,.06)', C.bad, 2); txt(g, '通道是双向的：当初带去的仔猪、鸡苗也绕开了检疫 → 合作阶段补上', R.x + 30, R.y + 630, C.fg, fnt(700, 28)); });
};
AN.trust = (g, t, R, st) => {
  ttlTxt(g, R, '信任是怎么一步步建立的', '', C.p);
  const S = ['盘查登记', '帮小忙', '长期观察', '面谈', '共同利益', '试点交接', '办证 · 合作'];
  const n = S.length, w = (R.w - 40) / n, h = 70;
  S.forEach((s, i) => { const done = i < 5, u = pop(st.k === 0 ? t : 99, .5 + i * 1), x = R.x + i * w, y = R.y + 560 - i * 66;
    al(g, u * (done ? 1 : .35), () => { rr(g, x, y, w - 12, h, 12, done ? 'rgba(199,155,255,.14)' : 'rgba(255,255,255,.03)', done ? C.p : C.line2, 2); txt(g, s, x + (w - 12) / 2, y + h / 2, done ? C.fg : C.fg3, fnt(700, 24), 'center'); if (!done) txt(g, '下一集', x + (w - 12) / 2, y - 18, C.fg3, fnt(500, 18), 'center'); }); });
  al(g, pop(st.k === 0 ? t : 99, 7), () => { txt(g, '身份不明人员 → 被长期观察的特殊人员', R.x, R.y + 150, C.fg, fnt(800, 34, 'serif')); txt(g, '仍无证件 · 仍无官方渠道', R.x, R.y + 205, C.fg2, fnt(600, 24)); });
  if (st.k === 1) { g.fillStyle = 'rgba(7,10,18,.8)'; g.fillRect(R.x - 10, R.y + 110, R.w + 20, 620);
    const A = [['他的底牌', ['锚点的规则', '额度的大小', '那边的年代'], C.gold], ['安平署的底牌', ['观察记录', '封存的金子', '随时叫停的权利'], C.p]];
    A.forEach(([h, ls, col], i) => al(g, pop(st.tk, .4 + i * 2.5), () => { const x = R.x + i * 900; rr(g, x, R.y + 160, 820, 400, 18, 'rgba(14,20,36,.95)', col, 3); txt(g, h, x + 30, R.y + 215, col, fnt(800, 32, 'serif')); ls.forEach((s, k) => { rr(g, x + 30, R.y + 270 + k * 86, 760, 66, 10, 'rgba(255,255,255,.04)', C.line2, 1.5); txt(g, s, x + 56, R.y + 303 + k * 86, C.fg, fnt(700, 28)); }); })); }
};
AN.sum3 = (g, t, R, st) => {
  ttlTxt(g, R, '阶段三小结 · W25–W38', '', PH[3]);
  if (st.bi < 3) { const S = [['≈57 t', '运入沙洲', '开始用上累积额度', C.gold], ['≈25 万', '现代花费', '来自之前卖金', C.r], ['2 次', '秋季进攻', '都守住了', C.o], ['互市', '西帐部', '赎回 40 余人', C.p]];
    const w = (R.w - 90) / 4; S.forEach(([a, b, c, col], i) => stat(g, R.x + i * (w + 30), R.y + 150, w, 220, a, b, col, pop(t, .4 + i * 1.6), c)); return; }
  al(g, pop(t, .3), () => { rr(g, R.x, R.y + 130, R.w, 260, 18, 'rgba(255,210,122,.06)', C.gold, 2.5); txt(g, '关键认识', R.x + 40, R.y + 185, C.gold, fnt(700, 26)); txt(g, '合作的基础不是信任，而是互相需要；', R.x + 40, R.y + 265, C.fg, fnt(800, 44, 'serif')); txt(g, '双方都留了底牌。', R.x + 40, R.y + 335, C.gold, fnt(800, 44, 'serif')); });
  al(g, pop(t, 6), () => { rr(g, R.x, R.y + 450, R.w, 200, 18, 'rgba(92,180,255,.07)', C.b, 2.5); txt(g, '下一集 · 拓土', R.x + 36, R.y + 505, C.b, fnt(700, 26)); txt(g, '正规渠道拿到钱和身份 · 连起散村 · 收复寿昌', R.x + 36, R.y + 580, C.fg, fnt(800, 38, 'serif')); });
};
