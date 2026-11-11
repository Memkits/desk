// 第一集动画：电脑能有心灵吗（序言、第 1–2 章）
const T0 = (st, t) => st.k === 0 ? t : st.tk; // 当前 beat 内时间
// 超级电脑
function bigpc(g, x, y, s = 1, glowA = 1) {
  glow(g, x, y, 260 * s, 'rgba(92,180,255,.18)', glowA);
  rr(g, x - 170 * s, y - 200 * s, 340 * s, 400 * s, 18 * s, 'rgba(14,22,40,.98)', C.b, 3);
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) dot(g, x - 110 * s + j * 72 * s, y - 140 * s + i * 52 * s, 6 * s, `rgba(92,180,255,${.3 + .5 * HSH(i, j)})`);
  rr(g, x - 120 * s, y + 140 * s, 240 * s, 30 * s, 6 * s, 'rgba(92,180,255,.25)');
}
function crowd(g, x0, x1, y, n, col = 'rgba(163,174,195,.5)', s = 1.1) { for (let i = 0; i < n; i++) person(g, LERP(x0, x1, i / (n - 1)) + (HSH(i, 7) - .5) * 20, y + (i % 2) * 30, col, s); }

AN.open = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  // 王冠 + 空衣架
  al(g, pop(t, .2, 1), () => {
    const x = cx - 420, y = R.y + 420;
    g.save(); g.strokeStyle = C.gold; g.lineWidth = 6; g.shadowColor = C.gold; g.shadowBlur = 20; g.beginPath();
    g.moveTo(x - 110, y - 120); g.lineTo(x - 110, y - 200); g.lineTo(x - 55, y - 150); g.lineTo(x, y - 220); g.lineTo(x + 55, y - 150); g.lineTo(x + 110, y - 200); g.lineTo(x + 110, y - 120); g.closePath(); g.stroke(); g.restore();
    g.save(); g.setLineDash([10, 12]); g.strokeStyle = 'rgba(233,238,247,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 90, y - 80); g.lineTo(x - 160, y + 40); g.lineTo(x - 120, y + 240); g.lineTo(x + 120, y + 240); g.lineTo(x + 160, y + 40); g.lineTo(x + 90, y - 80); g.stroke(); g.restore();
    txt(g, '看不见的新衣？', x, y + 300, C.fg3, fnt(700, 28), 'center');
  });
  al(g, pop(t, 1.2, 1), () => {
    const x = cx + 120; book(g, x, R.y + 200, 420, 520, '皇帝新脑', 'Penrose · 1989', C.gold, 1);
    txt(g, 'The Emperor\'s New Mind', x + 34, R.y + 330, C.fg2, fnt(600, 24, 'serif'));
    txt(g, '有关电脑、人脑及物理定律', x + 34, R.y + 380, C.fg2, fnt(600, 24));
  });
  if (st.k >= 1) {
    const items = [['计算', '图灵机 · 算法', C.b], ['数学', '哥德尔 · 柏拉图', C.p], ['物理', '量子 · 引力', C.g]];
    items.forEach(([a, b, col], i) => al(g, pop(st.tk, .8 + i * 1.2), () => { const y = R.y + 250 + i * 160, x = cx + 620; rr(g, x, y, 300, 120, 16, 'rgba(14,20,36,.95)', col, 2.5); txt(g, a, x + 30, y + 46, col, fnt(800, 36)); txt(g, b, x + 30, y + 92, C.fg2, fnt(600, 22)); }));
  }
};
AN.epcards = (g, t, R, st) => { epCards(g, R, t, -1, i => pop(t, .3 + i * .5)); };

AN.prolog = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  bigpc(g, cx, R.y + 330, 1, .6 + .4 * Math.sin(t * 2) ** 2);
  rr(g, cx - 700, R.y + 600, 1400, 12, 6, 'rgba(163,174,195,.2)');
  crowd(g, cx - 640, cx + 640, R.y + 700, 16);
  if (st.k === 0) {
    al(g, pop(st.tk, 1), () => { txt(g, '揭幕典礼', cx - 560, R.y + 230, C.gold, fnt(800, 40, 'serif')); txt(g, '“比全人类加起来还聪明”', cx - 560, R.y + 290, C.fg2, fnt(600, 26)); });
    al(g, pop(st.tk, 4), () => { txt(g, '有人想提问吗？', cx + 280, R.y + 230, C.fg, fnt(700, 32)); txt(g, '……', cx + 280, R.y + 290, C.fg3, fnt(700, 32)); });
    return;
  }
  const u = pop(st.tk, .3);
  al(g, u, () => { const bx = cx + 200, by = R.y + 660; person(g, bx, by + 50, C.gold, .9); line(g, [[bx + 10, by + 40], [bx + 30, by - 10]], C.gold, 4);
    rr(g, bx + 40, by - 130, 330, 80, 18, 'rgba(255,210,122,.12)', C.gold, 2); txt(g, '你感觉怎么样？', bx + 205, by - 90, C.gold, fnt(800, 34), 'center'); });
  al(g, pop(st.tk, 3), () => { for (let i = 0; i < 6; i++) txt(g, '哈', cx - 600 + i * 90 + HSH(i, 3) * 40, R.y + 560 - HSH(i, 4) * 60 + Math.sin(t * 6 + i) * 6, C.fg3, fnt(800, 30 + HSH(i, 5) * 14), 'center'); });
  al(g, pop(st.tk, 6), () => { txt(g, '？', cx, R.y + 330, C.r, fnt(900, 120, 'serif'), 'center'); });
};

AN.penbio = (g, t, R, st) => {
  medal(g, R.x + 260, R.y + 360, 120, '彭', '罗杰·彭罗斯', '1931 –', C.gold, pop(t, .3));
  const ev = [['1965', '黑洞奇点定理', C.b], ['1970', '与霍金推广到宇宙起点', C.b], ['1973', '牛津劳斯·鲍尔数学教授', C.fg2], ['1974', '彭罗斯镶嵌', C.p], ['1989', '《皇帝新脑》（加德纳作序）', C.gold]];
  ev.forEach(([y, s, col], i) => al(g, pop(t, 1.5 + i * 1.4), () => { const yy = R.y + 230 + i * 105, x = R.x + 560; dot(g, x, yy, 9, col); if (i) line(g, [[x, yy - 96], [x, yy - 10]], C.line2, 3); txt(g, y, x + 30, yy, col, fnt(800, 30, 'mono')); txt(g, s, x + 140, yy, C.fg, fnt(700, 30)); }));
};
// 简单的五重对称菱形花（示意）
function rhombPatch(g, cx, cy, s, rings) {
  for (let r = 0; r < rings; r++) for (let i = 0; i < 10; i++) {
    const a = i * TAU / 10 + (r % 2) * TAU / 20, d = r * s * 1.6;
    const ox = cx + Math.cos(a) * d, oy = cy + Math.sin(a) * d, a1 = a - TAU / 20, a2 = a + TAU / 20;
    const p1 = [ox + Math.cos(a1) * s, oy + Math.sin(a1) * s], p2 = [ox + Math.cos(a1) * s + Math.cos(a2) * s, oy + Math.sin(a1) * s + Math.sin(a2) * s], p3 = [ox + Math.cos(a2) * s, oy + Math.sin(a2) * s];
    g.beginPath(); g.moveTo(ox, oy); g.lineTo(...p1); g.lineTo(...p2); g.lineTo(...p3); g.closePath(); g.fillStyle = (i + r) % 2 ? 'rgba(199,155,255,.25)' : 'rgba(255,210,122,.22)'; g.fill(); g.strokeStyle = 'rgba(233,238,247,.5)'; g.lineWidth = 1.5; g.stroke();
  }
}

AN.ttest = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  hdr(g, R, '图灵测试（1950）', '隔着屏幕打字聊天：分得出哪个是机器吗？');
  const jx = R.x + 220, y = R.y + 470;
  person(g, jx, y, C.gold, 2.2); txt(g, '裁判', jx, y + 100, C.gold, fnt(800, 28), 'center');
  line(g, [[jx + 200, R.y + 200], [jx + 200, R.y + 760]], C.fg3, 4, [12, 10]); txt(g, '屏幕', jx + 200, R.y + 790, C.fg3, fnt(600, 22), 'center');
  const hx = R.x + R.w - 260; person(g, hx, R.y + 330, C.b, 1.8); txt(g, 'A', hx + 80, R.y + 330, C.fg, fnt(800, 32)); bot(g, hx, R.y + 600, C.p, 2); txt(g, 'B', hx + 80, R.y + 600, C.fg, fnt(800, 32));
  const msgs = [['写一首关于大海的诗？', 0, R.y + 250], ['这个我可不擅长。', 1, R.y + 320], ['34957 加 70764 等于？', 0, R.y + 430], ['（停了一会儿）105721。', 1, R.y + 500]];
  if (st.k === 0) { msgs.forEach(([s, side, yy], i) => al(g, pop(st.tk, 1 + i * 1.8), () => { const x = side ? hx - 560 : jx + 240; rr(g, x, yy - 28, 420, 56, 16, side ? 'rgba(199,155,255,.1)' : 'rgba(255,210,122,.1)', side ? C.p : C.gold, 2); txt(g, s, x + 20, yy, C.fg, fnt(600, 25)); })); return; }
  msgs.forEach(([s, side, yy]) => { const x = side ? hx - 560 : jx + 240; rr(g, x, yy - 28, 420, 56, 16, 'rgba(255,255,255,.03)', C.line2, 2); txt(g, s, x + 20, yy, C.fg3, fnt(600, 25)); });
  al(g, pop(st.tk, .5), () => { rr(g, cx - 330, R.y + 600, 660, 170, 18, 'rgba(14,20,36,.96)', C.gold, 2); txt(g, '外表：言行像不像', cx, R.y + 650, C.fg, fnt(800, 30), 'center'); txt(g, '≠', cx, R.y + 690, C.r, fnt(900, 34), 'center'); txt(g, '内里：有没有理解与感受', cx, R.y + 735, C.gold, fnt(800, 30), 'center'); });
};

AN.chess = (g, t, R, st) => {
  const cx = R.x + R.w / 2, s = 66, x0 = R.x + 120, y0 = R.y + 200;
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) rr(g, x0 + j * s, y0 + i * s, s, s, 0, (i + j) % 2 ? '#2C3854' : '#4A5878');
  const P = [['♚', 0, 4, '#E9EEF7'], ['♛', 7, 3, '#0B1020'], ['♜', 0, 0, '#E9EEF7'], ['♞', 2, 5, '#0B1020'], ['♝', 4, 2, '#E9EEF7'], ['♟', 6, 4, '#0B1020'], ['♟', 1, 6, '#E9EEF7']];
  P.forEach(([c, r, f, col], i) => { let rr_ = r, ff = f; if (i === 3) { const u = SS(CL((t - 2) / 1)); rr_ = LERP(2, 1, u); ff = LERP(5, 3, u); } txt(g, c, x0 + ff * s + s / 2, y0 + rr_ * s + s / 2 + 4, col, `${s * .8}px serif`, 'center'); });
  const x = R.x + 760;
  al(g, pop(t, 1.5), () => { bot(g, x + 60, R.y + 290, C.p, 2.2); txt(g, '下棋程序：每秒评估海量局面', x + 160, R.y + 290, C.fg, fnt(700, 30)); });
  al(g, pop(t, 4), () => { txt(g, '🚗 ＞ 🏃', x + 20, R.y + 440, C.fg, fnt(700, 56)); txt(g, '汽车比人快，不奇怪', x + 300, R.y + 440, C.fg2, fnt(600, 28)); });
  al(g, pop(t, 7.5), () => { rr(g, x, R.y + 540, 900, 130, 18, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '真正的问题：它理解自己在做什么吗？', x + 450, R.y + 605, C.gold, fnt(800, 34), 'center'); });
};

AN.strongai = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '强人工智能', '心灵 = 正确的算法');
    al(g, pop(st.tk, .3), () => { rr(g, cx - 220, R.y + 300, 440, 200, 18, 'rgba(14,20,36,.96)', C.gold, 3); txt(g, '算法', cx, R.y + 380, C.gold, fnt(900, 56, 'serif'), 'center'); txt(g, '足够复杂、足够正确', cx, R.y + 450, C.fg2, fnt(600, 24), 'center'); });
    ['理解', '感受', '意识'].forEach((s, i) => al(g, pop(st.tk, 2 + i * .8), () => { const x = cx + 400, y = R.y + 290 + i * 100; arrow(g, cx + 230, R.y + 400, x - 20, y, C.fg3, 3); chip(g, s, x, y, C.p, 1, 28); }));
    al(g, pop(st.tk, 5), () => { const y = R.y + 640; drawNeuronIcon(g, cx - 400, y); txt(g, '神经元', cx - 400, y + 90, C.fg2, fnt(700, 26), 'center'); txt(g, '=', cx, y, C.fg, fnt(900, 60), 'center'); rr(g, cx + 330, y - 50, 140, 100, 10, 'rgba(92,180,255,.15)', C.b, 2); for (let i = 0; i < 5; i++) { line(g, [[cx + 330 + 20 + i * 25, y - 50], [cx + 330 + 20 + i * 25, y - 70]], C.b, 3); line(g, [[cx + 330 + 20 + i * 25, y + 50], [cx + 330 + 20 + i * 25, y + 70]], C.b, 3); } txt(g, '硅片', cx + 400, y + 110, C.fg2, fnt(700, 26), 'center'); txt(g, '硬件无关紧要', cx, y + 120, C.fg3, fnt(600, 24), 'center'); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '恒温器也有“信念”？', '麦卡锡的说法');
    const x = cx - 300, y = R.y + 450;
    rr(g, x - 120, y - 160, 240, 320, 30, 'rgba(14,20,36,.96)', C.fg2, 3); g.save(); g.strokeStyle = C.o; g.lineWidth = 10; g.beginPath(); g.arc(x, y, 80, Math.PI * .75, Math.PI * (.75 + 1.5 * (.5 + .3 * Math.sin(t)))); g.stroke(); g.restore(); txt(g, (21 + Math.round(3 * Math.sin(t))) + '°', x, y, C.fg, fnt(800, 48, 'mono'), 'center');
    al(g, pop(st.tk, 2), () => { rr(g, x + 200, y - 180, 420, 90, 40, 'rgba(255,178,92,.1)', C.o, 2); txt(g, '“我相信：屋里太热了”', x + 410, y - 135, C.o, fnt(700, 28), 'center'); });
    al(g, pop(st.tk, 5), () => { const x2 = cx + 160; const L = [['恒温器', .05], ['昆虫', .2], ['狗', .5], ['人', 1]]; line(g, [[x2, y + 160], [x2 + 600, y + 160]], C.line2, 4); L.forEach(([s, v], i) => { dot(g, x2 + v * 600, y + 160, 10, C.p); txt(g, s, x2 + v * 600, y + 205, C.fg2, fnt(600, 24), 'center'); }); txt(g, '心灵只是“程度”问题？', x2 + 300, y + 260, C.fg, fnt(700, 28), 'center'); });
    return;
  }
  hdr(g, R, '心灵 = 软件，大脑 = 硬件', '同一程序，换台机器照样运行');
  al(g, pop(st.tk, .3), () => { drawBrain(g, cx - 450, R.y + 450, 1); txt(g, '大脑', cx - 450, R.y + 640, C.fg2, fnt(700, 28), 'center'); });
  al(g, pop(st.tk, 1.5), () => { rr(g, cx + 300, R.y + 340, 300, 220, 14, 'rgba(14,20,36,.96)', C.b, 3); txt(g, '电脑', cx + 450, R.y + 640, C.fg2, fnt(700, 28), 'center'); });
  const u = CL((st.tk - 2.5) / 3), px = LERP(cx - 450, cx + 450, SS(u)), py = R.y + 450 - Math.sin(u * Math.PI) * 160;
  al(g, pop(st.tk, 2), () => { rr(g, px - 90, py - 40, 180, 80, 14, 'rgba(255,210,122,.2)', C.gold, 2); txt(g, '程序 = 你？', px, py, C.gold, fnt(800, 28), 'center'); });
};
function drawNeuronIcon(g, x, y, col = C.p) { for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + .3; line(g, [[x, y], [x + Math.cos(a) * 60, y + Math.sin(a) * 50]], col, 3); } dot(g, x, y, 22, col); line(g, [[x + 20, y], [x + 120, y + 10]], col, 4); }
function drawBrain(g, x, y, s = 1, col = 'rgba(199,155,255,.85)') {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = 'rgba(199,155,255,.14)'; g.strokeStyle = col; g.lineWidth = 4;
  g.beginPath(); g.ellipse(0, 0, 170, 120, 0, 0, TAU); g.fill(); g.stroke();
  g.lineWidth = 3; for (let i = 0; i < 7; i++) { g.beginPath(); const yy = -90 + i * 30; for (let k = 0; k <= 20; k++) { const xx = -140 + k * 14; const v = yy + Math.sin(k * .9 + i * 1.7) * 9; if (Math.hypot(xx / 165, v / 115) > .95) continue; k ? g.lineTo(xx, v) : g.moveTo(xx, v); } g.stroke(); }
  g.beginPath(); g.moveTo(0, -120); g.lineTo(0, 115); g.setLineDash([6, 6]); g.stroke(); g.restore();
}

AN.teleport = (g, t, R, st) => {
  const ex = R.x + 300, mx = R.x + R.w - 300, y = R.y + 420;
  hdr(g, R, '思想实验：远距离传送', '');
  ball(g, ex, y + 200, 90, '#3a7bd5'); txt(g, '地球', ex, y + 330, C.fg2, fnt(700, 26), 'center');
  ball(g, mx, y + 200, 70, '#c1440e'); txt(g, '火星', mx, y + 330, C.fg2, fnt(700, 26), 'center');
  person(g, ex, y - 40, C.gold, 2.4);
  if (st.k === 0) {
    const sc_ = pop(st.tk, 1); al(g, sc_, () => { for (let i = 0; i < 6; i++) { const yy = y - 120 + ((st.tk * 80 + i * 30) % 180); line(g, [[ex - 70, yy], [ex + 70, yy]], 'rgba(92,180,255,.6)', 2); } });
    for (let i = 0; i < 14; i++) { const u = CL((st.tk - 2.5 - i * .15) / 2.5); if (u <= 0 || u >= 1) continue; const xx = LERP(ex + 80, mx - 80, u), yy = y - 100 - Math.sin(u * Math.PI) * 160; txt(g, HSH(i, 9) > .5 ? '1' : '0', xx, yy + HSH(i, 2) * 30, C.b, fnt(800, 26, 'mono'), 'center'); }
    al(g, pop(st.tk, 6), () => person(g, mx, y - 40, C.gold, 2.4));
    al(g, pop(st.tk, 8.5), () => { cross(g, ex, y - 40, 1, C.bad, 60); });
    al(g, pop(st.tk, 10.5), () => { person(g, ex, y - 40, C.gold, 2.4); txt(g, '？', ex, y - 170, C.r, fnt(900, 60), 'center'); txt(g, '？', mx, y - 170, C.r, fnt(900, 60), 'center'); txt(g, '哪一个才是你？', R.x + R.w / 2, R.y + 200, C.fg, fnt(800, 36), 'center'); });
    return;
  }
  person(g, mx, y - 40, C.gold, 2.4); txt(g, '？', ex, y - 170, C.r, fnt(900, 60), 'center'); txt(g, '？', mx, y - 170, C.r, fnt(900, 60), 'center');
  al(g, pop(st.tk, .5), () => { const cx = R.x + R.w / 2; rr(g, cx - 380, R.y + 160, 760, 150, 18, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '意识 = 执行算法？', cx, R.y + 210, C.gold, fnt(800, 34), 'center'); txt(g, '这个假设代价很大，值得仔细检查', cx, R.y + 265, C.fg, fnt(600, 26), 'center'); });
};

AN.room = (g, t, R, st) => {
  const rx = R.x + R.w * .3, ry = R.y + 230, rw = 520, rh = 460;
  const roomDraw = sys => { rr(g, rx, ry, rw, rh, 12, 'rgba(14,20,36,.95)', sys ? C.gold : C.fg2, sys ? 5 : 3); person(g, rx + 160, ry + 300, C.fg2, 2); book(g, rx + 300, ry + 230, 160, 180, '规则书', '', C.b, 1); rr(g, rx - 8, ry + 120, 16, 60, 4, '#070A12'); rr(g, rx + rw - 8, ry + 120, 16, 60, 4, '#070A12'); };
  const slip = (x, s) => { g.font = fnt(700, 20); const w = g.measureText(s).width + 30; rr(g, x, ry + 130, w, 40, 4, '#E8DFC8'); txt(g, s, x + w / 2, ry + 150, '#3A2E1A', fnt(700, 20), 'center'); };
  if (st.k === 0) {
    hdr(g, R, '塞尔的中文屋（1980）', '');
    roomDraw(false); txt(g, '不懂中文的人', rx + 160, ry + 420, C.fg3, fnt(600, 22), 'center');
    al(g, pop(st.tk, 4), () => { rr(g, rx + 60, ry + 40, 300, 80, 16, 'rgba(255,255,255,.05)', C.fg3, 2); txt(g, '“见到 ＃＠＆，', rx + 76, ry + 66, C.fg2, fnt(600, 20)); txt(g, '　就送出 ％＊＄……”', rx + 76, ry + 96, C.fg2, fnt(600, 20)); });
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '屋外：对答如流　屋里：一字不懂', '');
    roomDraw(false);
    const u = CL(st.tk / 3), v = CL((st.tk - 4) / 3);
    if (u > 0 && u < 1) slip(LERP(rx - 300, rx + 120, u), '你好吗？');
    if (v > 0) slip(LERP(rx + rw - 160, rx + rw + 200, v), '我很好，谢谢');
    al(g, pop(st.tk, 6), () => { person(g, rx - 200, ry + 300, C.ok, 1.8); txt(g, '“他懂中文！”', rx - 200, ry + 170, C.ok, fnt(800, 28), 'center'); txt(g, '？？？', rx + 160, ry + 180, C.bad, fnt(800, 36), 'center'); });
    return;
  }
  if (st.k === 2) {
    hdr(g, R, '塞尔针对的程序：读懂故事', '香克等人的“故事理解”程序（示意）');
    const x = R.x + 80, y = R.y + 230;
    al(g, pop(st.tk, .3), () => { rr(g, x, y, 860, 300, 18, 'rgba(14,20,36,.96)', C.b, 2); ['一个人走进餐馆，点了一个汉堡。', '汉堡端上来，烤焦了。', '他气冲冲地走了，没付钱。'].forEach((s, i) => al(g, pop(st.tk, .6 + i * 1.6), () => txt(g, s, x + 40, y + 70 + i * 80, C.fg, fnt(700, 32)))); });
    al(g, pop(st.tk, 6), () => { txt(g, '问：他吃了汉堡吗？', x + 40, y + 380, C.gold, fnt(800, 32)); });
    al(g, pop(st.tk, 8), () => { bot(g, x + 1000, y + 140, C.p, 2.5); rr(g, x + 1080, y + 60, 300, 80, 16, 'rgba(199,155,255,.12)', C.p, 2); txt(g, '“没有吃。”', x + 1230, y + 100, C.p, fnt(800, 30), 'center'); ticks(g, x + 1390, y + 100, pop(st.tk, 9)); });
    al(g, pop(st.tk, 11), () => txt(g, '可它真的懂这个故事吗？', x + 1000, y + 380, C.r, fnt(800, 32)));
    return;
  }
  if (st.k === 3) {
    hdr(g, R, '“系统”回应', '人 + 规则书 = 一个系统，也许系统懂中文');
    roomDraw(true);
    al(g, pop(st.tk, .5), () => { const x = rx + rw + 80; card(g, x, R.y + 240, 440, 200, '塞尔', ['只有符号操作', '没有理解'], C.r, 1); });
    al(g, pop(st.tk, 4), () => { const x = rx + rw + 80; card(g, x, R.y + 470, 440, 200, '支持者', ['不懂的是那个人', '懂的是整个系统'], C.gold, 1); });
    return;
  }
  hdr(g, R, '彭罗斯：换一条路', '');
  const cx = R.x + R.w / 2;
  [['弄清：算法到底是什么', C.b], ['证明：有些事任何算法都做不到', C.gold], ['再问：人脑做的是不是这类事', C.p]].forEach(([s, col], i) => al(g, pop(st.tk, .5 + i * 1.8), () => { const y = R.y + 270 + i * 160; rr(g, cx - 450, y - 50, 900, 100, 18, 'rgba(14,20,36,.96)', col, 2.5); txt(g, `${i + 1}　${s}`, cx - 400, y, C.fg, fnt(800, 34)); if (i < 2) arrow(g, cx, y + 52, cx, y + 108, C.fg3, 3); }));
};

AN.euclid = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  const steps = [[3654, 1365, 2, 924], [1365, 924, 1, 441], [924, 441, 2, 42], [441, 42, 10, 21], [42, 21, 2, 0]];
  if (st.k <= 1) {
    hdr(g, R, '欧几里得算法', '求 3654 和 1365 的最大公约数');
    const tt = st.k === 0 ? st.tk : 99;
    steps.forEach(([a, b, q, r], i) => al(g, pop(tt, 2 + i * 1.8), () => { const y = R.y + 250 + i * 95; txt(g, `${a} ÷ ${b}`, R.x + 200, y, C.fg, fnt(700, 40, 'mono')); txt(g, `= ${q} 余`, R.x + 640, y, C.fg2, fnt(600, 36, 'mono')); txt(g, String(r), R.x + 880, y, r ? C.b : C.fg3, fnt(800, 40, 'mono')); if (i < 4) { line(g, [[R.x + 900, y + 20], [R.x + 620, y + 75]], 'rgba(92,180,255,.3)', 2, [5, 6]); } }));
    // 矩形切割可视化
    const W = 3654, H = 1365, sc_ = 560 / W, x0 = R.x + 1060, y0 = R.y + 240;
    al(g, pop(tt, 1), () => { rr(g, x0, y0, W * sc_, H * sc_, 0, null, C.fg2, 2);
      let x = x0, y = y0, w = W, h = H, cnt = 0; const tot = Math.floor(CL((tt - 2) / 9) * 9);
      for (const [a, b, q] of steps) { for (let k = 0; k < q; k++) { if (cnt++ >= tot * 2 + 2) break; const s = Math.min(w, h); const col = `hsla(${200 + cnt * 15},80%,65%,.35)`; if (w >= h) { rr(g, x, y, s * sc_, s * sc_, 0, col, 'rgba(233,238,247,.6)', 1); x += s * sc_; w -= s; } else { rr(g, x, y, s * sc_, s * sc_, 0, col, 'rgba(233,238,247,.6)', 1); y += s * sc_; h -= s; } } }
      txt(g, '每次切掉最大的正方形', x0, y0 + H * sc_ + 40, C.fg3, fnt(600, 22)); });
    if (st.k === 1) al(g, pop(st.tk, .3), () => { rr(g, R.x + 160, R.y + 730, 900, 80, 16, 'rgba(95,211,154,.08)', C.ok, 2); txt(g, '最大公约数 = 21　　机械 · 明确 · 必然停下', R.x + 200, R.y + 770, C.ok, fnt(800, 32)); });
    return;
  }
  hdr(g, R, '希尔伯特的问题', '有没有一种通用的机械方法，判定任何数学命题？');
  al(g, pop(st.tk, .3), () => { medal(g, R.x + 260, R.y + 380, 110, '希', '大卫·希尔伯特', '1862 – 1943', C.b, 1); });
  al(g, pop(st.tk, 3), () => { const x = R.x + 560, y = R.y + 300; ['命题', '→', '？机械方法？', '→', '真 / 假'].forEach((s, i) => txt(g, s, x + [0, 140, 230, 560, 640][i], y, i === 2 ? C.gold : C.fg, fnt(800, 38))); });
  al(g, pop(st.tk, 7), () => { rr(g, R.x + 560, R.y + 420, 1000, 120, 18, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '先要回答：什么叫“机械方法”？', R.x + 600, R.y + 480, C.fg, fnt(800, 34)); });
};

const TM_STEPS = (() => { const tp = ['', '1', '0', '1', '1', '']; const S = [{ tp: tp.slice(), h: 4, s: '进位', r: -1 }]; let h = 4, s = '进位', c = tp.slice();
  while (s !== '停') { const v = c[h]; let r; if (v === '1') { c[h] = '0'; h--; r = 0; } else { c[h] = '1'; s = '停'; r = v === '0' ? 1 : 2; } S.push({ tp: c.slice(), h, s, r }); } return S; })();
AN.tm = (g, t, R, st) => {
  const x0 = R.x + 100, cw = 110;
  if (st.k === 0) {
    hdr(g, R, '图灵机（1936）', '无限长的纸带 · 读写头 · 有限个状态');
    const cells = ['', '1', '0', '1', '1', '', '', ''];
    al(g, pop(st.tk, .5), () => { tape(g, x0, R.y + 320, cells, cw, null); txt(g, '… 纸带向两边无限延伸 …', x0 + cells.length * cw / 2, R.y + 470, C.fg3, fnt(600, 24), 'center'); });
    al(g, pop(st.tk, 3), () => { tape(g, x0, R.y + 320, cells, cw, 4, C.gold, 4); txt(g, '读写头：一次只看一格', x0 + 4.5 * cw, R.y + 240, C.gold, fnt(700, 26), 'center'); });
    al(g, pop(st.tk, 6), () => { rr(g, x0 + 4.5 * cw - 220, R.y + 540, 440, 90, 16, 'rgba(199,155,255,.1)', C.p, 2); txt(g, '内部状态：q₁, q₂, … 有限个', x0 + 4.5 * cw, R.y + 585, C.p, fnt(800, 26), 'center'); });
    medal(g, R.x + R.w - 200, R.y + 420, 100, '图', '阿兰·图灵', '1912 – 1954', C.gold, pop(st.tk, 1.5));
    return;
  }
  if (st.k === 1) {
    hdr(g, R, '每一步：查规则表', '（当前状态，读到的符号）→（写什么，往哪移，新状态）');
    const cells = ['', '1', '0', '1', '1', '', '', ''];
    tape(g, x0, R.y + 320, cells, cw, 4, C.gold, 4);
    const x = R.x + 960, y = R.y + 230; rr(g, x, y, 720, 380, 16, 'rgba(14,20,36,.95)', C.b, 2); txt(g, '规则表', x + 24, y + 40, C.b, fnt(800, 28));
    txt(g, '状态   读   写   移动   新状态', x + 24, y + 100, C.fg3, fnt(600, 24, 'mono'));
    [['进位', '1', '0', '左', '进位'], ['进位', '0', '1', '—', '停'], ['进位', '空', '1', '—', '停']].forEach((r, i) => al(g, pop(st.tk, 1 + i * 1.2), () => txt(g, r.join('   '), x + 24, y + 170 + i * 66, C.fg, fnt(700, 28, 'mono'))));
    al(g, pop(st.tk, 6), () => txt(g, '规则简单，却能完成任何算法', R.x + 100, R.y + 700, C.gold, fnt(800, 34)));
    return;
  }
  hdr(g, R, '例子：给二进制数加一', '1011（11） → 1100（12）');
  const dt = 2.2, i = Math.min(TM_STEPS.length - 1, Math.floor(Math.max(0, st.tk - 1) / dt)), S = TM_STEPS[i];
  const prev = TM_STEPS[Math.max(0, i - 1)], u = SS((Math.max(0, st.tk - 1) - i * dt) / .8), hh = i ? LERP(prev.h, S.h, u) : S.h;
  tape(g, x0, R.y + 320, S.tp, cw, hh, C.gold, S.h);
  rr(g, x0 + hh * cw + cw / 2 - 150, R.y + 470, 300, 80, 14, 'rgba(199,155,255,.1)', S.s === '停' ? C.ok : C.p, 2); txt(g, '状态：' + S.s, x0 + hh * cw + cw / 2, R.y + 510, S.s === '停' ? C.ok : C.p, fnt(800, 28), 'center');
  const x = R.x + R.w - 500, y = R.y + 230; rr(g, x, y, 460, 300, 16, 'rgba(14,20,36,.95)', C.b, 2); txt(g, '规则', x + 24, y + 40, C.b, fnt(800, 28));
  ['读 1：写 0，左移（进位）', '读 0：写 1，停', '读空：写 1，停'].forEach((s, k) => { const on = S.r === k; if (on) rr(g, x + 14, y + 80 + k * 70, 432, 54, 10, 'rgba(255,210,122,.15)', C.gold, 2); txt(g, s, x + 30, y + 107 + k * 70, on ? C.gold : C.fg2, fnt(700, 25)); });
  txt(g, `第 ${i} 步`, x0, R.y + 640, C.fg3, fnt(700, 28, 'mono'));
  if (S.s === '停') txt(g, '结果：1100 = 12 ✓', x0 + 200, R.y + 640, C.ok, fnt(800, 32));
};

AN.tmnum = (g, t, R, st) => {
  hdr(g, R, '每台图灵机 = 一个自然数', '规则表 → 二进制串 → 编号 n（编码方式示意）');
  const x = R.x + 100, y = R.y + 250;
  rr(g, x, y, 480, 230, 16, 'rgba(14,20,36,.95)', C.b, 2); ['进位 1 → 0 左 进位', '进位 0 → 1 停', '进位 空 → 1 停'].forEach((s, i) => txt(g, s, x + 30, y + 60 + i * 66, C.fg, fnt(700, 28, 'mono')));
  const bits = '1101011010010111011010110100101101110101101011'; const n = Math.floor(CL((t - 1.5) / 4) * bits.length);
  al(g, pop(t, 1.2), () => { arrow(g, x + 500, y + 115, x + 600, y + 115, C.gold, 4); const s = bits.slice(0, n); for (let k = 0; k < 2; k++) txt(g, s.slice(k * 23, k * 23 + 23), x + 630, y + 80 + k * 60, C.gold, fnt(700, 38, 'mono')); });
  al(g, pop(t, 6), () => { const xs = R.x + 100, yy = R.y + 600; ['T₀', 'T₁', 'T₂', 'T₃', '…', 'Tₙ', '…'].forEach((s, i) => { rr(g, xs + i * 220, yy - 50, 180, 100, 14, 'rgba(14,20,36,.95)', i === 5 ? C.gold : C.line2, 2); txt(g, s, xs + i * 220 + 90, yy, i === 5 ? C.gold : C.fg2, fnt(800, 36, 'serif'), 'center'); }); txt(g, '机器本身也成了数据', xs, yy + 110, C.fg, fnt(800, 32)); });
};

AN.utm = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (st.k === 0) {
    hdr(g, R, '通用图灵机 U', '纸带上：机器 n 的编号 + 输入 m → U 模仿机器 n');
    const y = R.y + 300, x0 = R.x + 100, cw = 62, desc = Array(9).fill(0), inp = ['1', '0', '1', '1'];
    al(g, pop(st.tk, .3), () => { desc.forEach((_, i) => { rr(g, x0 + i * cw, y, cw - 4, cw - 4, 6, 'rgba(92,180,255,.15)', C.b, 2); txt(g, '1101011010'[i], x0 + i * cw + cw / 2 - 2, y + cw / 2, C.b, fnt(700, 24, 'mono'), 'center'); }); txt(g, '机器 n 的编号', x0 + desc.length * cw / 2, y - 30, C.b, fnt(700, 24), 'center');
      inp.forEach((s, i) => { const x = x0 + (desc.length + 1 + i) * cw; rr(g, x, y, cw - 4, cw - 4, 6, 'rgba(255,210,122,.12)', C.gold, 2); txt(g, s, x + cw / 2 - 2, y + cw / 2, C.fg, fnt(800, 28, 'mono'), 'center'); }); txt(g, '输入 m', x0 + (desc.length + 3) * cw, y - 30, C.gold, fnt(700, 24), 'center'); });
    const hp = (st.tk * 1.6) % 14;
    al(g, pop(st.tk, 2), () => { const hx = x0 + hp * cw + cw / 2; g.fillStyle = C.r; g.beginPath(); g.moveTo(hx, y + cw + 6); g.lineTo(hx - 16, y + cw + 36); g.lineTo(hx + 16, y + cw + 36); g.fill(); rr(g, x0 + 160, y + 150, 460, 110, 16, 'rgba(255,122,147,.08)', C.r, 2); txt(g, 'U：来回查表、照着做', x0 + 390, y + 205, C.r, fnt(800, 30), 'center'); });
    al(g, pop(st.tk, 5), () => { const x = R.x + R.w - 460; card(g, x, R.y + 240, 420, 260, '一台机器 = 任何机器', ['换一个编号，', '它就变成另一台机器', 'U(n, m) = Tₙ(m)'], C.gold, 1); });
    return;
  }
  hdr(g, R, '今天的电脑就是通用机', '');
  al(g, pop(st.tk, .3), () => { rr(g, cx - 200, R.y + 420, 400, 180, 20, 'rgba(14,20,36,.95)', C.fg2, 3); txt(g, '一块芯片', cx, R.y + 510, C.fg, fnt(800, 36), 'center'); });
  [['文字处理', C.b], ['游戏', C.r], ['浏览器', C.g], ['计算器', C.o], ['聊天', C.p]].forEach(([s, col], i) => al(g, pop(st.tk, 1 + i * .5), () => { const a = Math.PI + i * Math.PI / 4, x = cx + Math.cos(a) * 560, y = R.y + 470 + Math.sin(a) * 240; chip(g, s, x - 60, y, col, 1, 26); arrow(g, x + 30, y + 20, LERP(x, cx, .55), LERP(y, R.y + 470, .55), C.fg3, 2); }));
  al(g, pop(st.tk, 5), () => { const bits = Array.from({ length: 5 }, (_, r) => Array.from({ length: 52 }, (_, c) => HSH(r, c) > .5 ? '1' : '0').join('')); rr(g, R.x + 60, R.y + 660, R.w - 120, 150, 14, 'rgba(232,223,200,.06)', C.gold, 1.5); bits.forEach((s, r) => txt(g, s, R.x + 90, R.y + 690 + r * 24, 'rgba(255,210,122,.7)', fnt(600, 20, 'mono'))); txt(g, '书中印出的通用机编号（示意）', R.x + R.w - 90, R.y + 830, C.fg3, fnt(600, 20), 'right'); });
};

AN.church = (g, t, R, st) => {
  hdr(g, R, '丘奇–图灵论题', '直观的“机械计算” = 图灵可计算');
  const cx = R.x + R.w / 2;
  medal(g, R.x + 220, R.y + 340, 90, '丘', '阿朗佐·丘奇', '1903 – 1995', C.p, pop(t, .3));
  const lx = R.x + 420, rx = R.x + R.w - 440, mid = (lx + 400 + rx) / 2;
  al(g, pop(t, 1.5), () => { rr(g, lx, R.y + 230, 400, 220, 18, 'rgba(199,155,255,.07)', C.p, 2); txt(g, 'λ 演算', lx + 200, R.y + 290, C.p, fnt(800, 34), 'center'); eq(g, '(λx. x + 1) 2 → 3', lx + 200, R.y + 380, C.fg, 32); });
  al(g, pop(t, 3), () => { rr(g, rx, R.y + 230, 400, 220, 18, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, '图灵机', rx + 200, R.y + 290, C.gold, fnt(800, 34), 'center'); tape(g, rx + 40, R.y + 362, ['1', '0', '1', '1', ''], 64, null); });
  al(g, pop(t, 6), () => { txt(g, '⇔', mid, R.y + 330, C.fg, fnt(900, 60), 'center'); txt(g, '等价', mid, R.y + 400, C.fg3, fnt(600, 22), 'center'); });
  al(g, pop(t, 9), () => { rr(g, R.x + 60, R.y + 560, R.w - 120, 150, 18, 'rgba(14,20,36,.95)', C.gold, 2); txt(g, '凡是直观上能机械计算的，图灵机都能算', cx, R.y + 615, C.fg, fnt(800, 32), 'center'); txt(g, '这是一个论题，不是定理；至今没有反例', cx, R.y + 670, C.fg3, fnt(600, 24), 'center'); });
};

AN.halt = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  hdr(g, R, '停机问题', '任给机器 Tₙ 和输入 m：它最终会停下吗？');
  al(g, pop(t, .3), () => { chip(g, '机器 Tₙ', cx - 640, R.y + 340, C.b, 1, 28); chip(g, '输入 m', cx - 640, R.y + 460, C.gold, 1, 28); arrow(g, cx - 450, R.y + 340, cx - 200, R.y + 380, C.fg3, 3); arrow(g, cx - 450, R.y + 460, cx - 200, R.y + 420, C.fg3, 3); });
  al(g, pop(t, 2), () => { rr(g, cx - 180, R.y + 300, 360, 200, 18, 'rgba(14,20,36,.96)', C.r, 3); txt(g, 'H ?', cx, R.y + 385, C.r, fnt(800, 44), 'center'); txt(g, '万能判定机（假设）', cx, R.y + 445, C.fg3, fnt(600, 22), 'center'); });
  al(g, pop(t, 4), () => { arrow(g, cx + 190, R.y + 360, cx + 360, R.y + 330, C.fg3, 3); arrow(g, cx + 190, R.y + 440, cx + 360, R.y + 470, C.fg3, 3); txt(g, '“会停”', cx + 380, R.y + 330, C.ok, fnt(800, 32)); txt(g, '“永不停”', cx + 380, R.y + 470, C.bad, fnt(800, 32)); });
  al(g, pop(t, 6.5), () => { txt(g, '有的一眼看出：while (true) {} 永不停', R.x + 120, R.y + 640, C.fg2, fnt(600, 28, 'mono')); txt(g, '但能不能对所有情况都判断？', R.x + 120, R.y + 700, C.gold, fnt(700, 30)); });
};

AN.haltdiag = (g, t, R, st) => {
  const N = 7, cw = 104, ch = 64, x0 = R.x + 180, y0 = R.y + 230;
  const val = (n, m) => { const h = HSH(n * 13 + 1, m * 7 + 3); return h < .28 ? '□' : String(Math.floor(h * 9)); };
  hdr(g, R, st.k === 0 ? '一张无穷大的表' : st.k === 1 ? '沿对角线造一台新机器 D' : '所以 H 不存在', st.k === 0 ? '第 n 行：机器 Tₙ；第 m 列：输入 m；□ = 永不停机' : st.k === 1 ? 'D(n) = Tₙ(n) + 1（若停）；= 0（若不停）' : '希尔伯特的通用判定方法也不存在');
  for (let m = 0; m < N; m++) txt(g, String(m), x0 + m * cw + cw / 2, y0 - 26, C.fg3, fnt(700, 24, 'mono'), 'center');
  for (let n = 0; n < N; n++) {
    const ur = st.k === 0 ? pop(st.tk, .5 + n * .4) : 1;
    al(g, ur, () => { txt(g, 'T' + n, x0 - 30, y0 + n * ch + ch / 2, C.fg2, fnt(700, 26, 'serif'), 'right');
      for (let m = 0; m < N; m++) { const diag = n === m && st.k >= 1; rr(g, x0 + m * cw, y0 + n * ch, cw - 6, ch - 6, 6, diag ? 'rgba(255,210,122,.18)' : 'rgba(14,20,36,.9)', diag ? C.gold : C.line2, diag ? 2.5 : 1.5); txt(g, val(n, m), x0 + m * cw + cw / 2 - 3, y0 + n * ch + ch / 2 - 2, C.fg, fnt(700, 26, 'mono'), 'center'); } });
  }
  txt(g, '…', x0 + N * cw + 20, y0 + 3 * ch, C.fg3, fnt(800, 40), 'left');
  if (st.k >= 1) {
    const yD = y0 + N * ch + 40, kk = st.k === 1 ? Math.floor(CL((st.tk - 3) / 8) * N + .999) : N;
    txt(g, 'D', x0 - 30, yD + ch / 2, C.r, fnt(800, 30, 'serif'), 'right');
    for (let m = 0; m < kk; m++) { const v = val(m, m), d = v === '□' ? '0' : String(+v + 1); rr(g, x0 + m * cw, yD, cw - 6, ch - 6, 6, 'rgba(255,122,147,.15)', C.r, 2.5); txt(g, d, x0 + m * cw + cw / 2 - 3, yD + ch / 2 - 2, C.r, fnt(800, 28, 'mono'), 'center'); }
    const px = R.x + 1150;
    al(g, pop(st.k === 1 ? st.tk : 99, 9), () => { card(g, px, R.y + 230, 520, 260, 'D 在表里吗？', ['D 和第 n 行在第 n 格必不相同', '所以 D 不是任何一行', '可 D 是一台图灵机，必在表中'], C.r, 1); txt(g, '矛盾！', px + 260, R.y + 560, C.r, fnt(900, 56, 'serif'), 'center'); });
  }
  if (st.k === 2) al(g, pop(st.tk, .5), () => { rr(g, R.x + 1150, R.y + 640, 520, 110, 16, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '下一集：哥德尔的对角线', R.x + 1410, R.y + 695, C.gold, fnt(800, 32), 'center'); });
};

AN.recap1 = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  hdr(g, R, '第一集小结', '');
  const items = [['强人工智能', '心灵 = 算法', C.p], ['中文屋', '符号操作 ≠ 理解？', C.r], ['图灵机', '“算法”的精确定义', C.b], ['停机问题', '算法做不到的事', C.gold]];
  items.forEach(([a, b, col], i) => al(g, pop(st.k === 0 ? t : 99, .3 + i * 1.2), () => { const x = R.x + 40 + i * 425; rr(g, x, R.y + 230, 390, 260, 20, 'rgba(14,20,36,.95)', col, 2.5); txt(g, a, x + 195, R.y + 320, col, fnt(800, 38, 'serif'), 'center'); txt(g, b, x + 195, R.y + 400, C.fg2, fnt(600, 26), 'center'); }));
  if (st.k === 1) al(g, pop(st.tk, .5), () => { rr(g, cx - 520, R.y + 580, 1040, 150, 20, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '下一集：数学家判断真理，也是在执行算法吗？', cx, R.y + 640, C.fg, fnt(800, 34), 'center'); txt(g, '从曼德布罗集开始', cx, R.y + 695, C.gold, fnt(700, 28), 'center'); });
};
