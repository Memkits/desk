// 分水：水渠网的画法和各段动画。着法 m = 节点号*2 + (0 左下 / 1 右下)，节点号 = l(l+1)/2 + i。
const FL = GGm.flow, WAT = '#7FD8F0';
const fid = (l, i, sd) => FL.id(l, i) * 2 + sd;
function flowMk(list) { const s = FL.init(); list.forEach(([m, v]) => { s.out[m] = v; s.used[v]++; }); return s; }
// 原始水量（不乘杯子的倍数）
function flowRaw(s) { const save = FL.MUL; FL.MUL = [1, 1, 1, 1, 1, 1, 1]; const r = FL.flows(s); FL.MUL = save; return r; }
// o.grow = {m, u} 正在修的一段；o.mul 显示倍数的透明度；o.hi = 高亮的着法；o.note = {节点号: 文字}
function flowDraw(g, cx, y0, sp, s, o = {}) { const LV = FL.LV, P = (l, i) => [cx + (i - l / 2) * sp, y0 + l * sp], { f } = FL.flows(s), k = sp / 100;
  for (let l = 0; l < LV; l++) for (let i = 0; i <= l; i++) for (let sd = 0; sd < 2; sd++) if (!s.out[fid(l, i, sd)]) line(g, [P(l, i), P(l + 1, i + sd)], C.line2, 2, [5, 9]);
  for (let l = 0; l < LV; l++) for (let i = 0; i <= l; i++) { const a = FL.id(l, i), nk = (s.out[a * 2] ? 1 : 0) + (s.out[a * 2 + 1] ? 1 : 0); for (let sd = 0; sd < 2; sd++) { const m = a * 2 + sd, v = s.out[m]; if (!v) continue; const fl = f[a] / nk, p1 = P(l, i), p2 = P(l + 1, i + sd); let u = 1; if (o.grow && o.grow.m === m) u = SS(o.grow.u); const e = [LERP(p1[0], p2[0], u), LERP(p1[1], p2[1], u)];
      line(g, [p1, e], PC[v], (11 + Math.sqrt(fl) * 2.2) * k); if (fl > 0 && u >= 1) line(g, [p1, p2], '#0B1020', 3.5 * k, [3, 9]); if (o.hi === m) line(g, [p1, p2], '#fff', 2.5, [6, 6]); } }
  for (let l = 0; l <= LV; l++) for (let i = 0; i <= l; i++) { const a = FL.id(l, i), [x, y] = P(l, i), v = f[a];
    if (l === LV) { let own = 0; [[l - 1, i - 1, 1], [l - 1, i, 0]].forEach(([pl, pi, sd]) => { if (pi >= 0 && pi <= pl && s.out[fid(pl, pi, sd)] && f[FL.id(pl, pi)] > 0) own |= s.out[fid(pl, pi, sd)]; });
      rr(g, x - 36 * k, y - 4, 72 * k, 50 * k, 9, v ? 'rgba(127,216,240,.14)' : 'rgba(14,20,36,.9)', own === 1 ? BL : own === 2 ? OR : own === 3 ? '#fff' : C.line2, own ? 3 : 2); if (v && k > .5) txt(g, String(v), x, y + 22 * k, C.fg, fnt(800, 24 * k, 'mono'), 'center');
      if (o.mul > 0) { g.save(); g.globalAlpha = CL(o.mul); txt(g, '×' + (i + 1), x, y + 70 * k, C.gold, fnt(800, 24 * k, 'mono'), 'center'); g.restore(); } }
    else { dot(g, x, y, (v ? 23 : 9) * k, v ? '#123848' : '#151d30'); g.strokeStyle = v ? WAT : C.line2; g.lineWidth = 2.5; g.beginPath(); g.arc(x, y, (v ? 23 : 9) * k, 0, 7); g.stroke(); if (v && k > .5) txt(g, String(v), x, y + 1, '#DDF6FF', fnt(700, 19 * k, 'mono'), 'center'); } }
  if (o.note) for (const a in o.note) { let l = 0; while (FL.id(l + 1, 0) <= +a) l++; const [x, y] = P(l, +a - FL.id(l, 0)); g.save(); g.globalAlpha = CL(o.note[a][1]); const lab = o.note[a][0]; g.font = fnt(700, 21); const w = g.measureText(lab).width + 22, lx = o.note[a][2] === 'l' ? x - 20 * k - w : x + 20 * k, ly = y - 46 * k; rr(g, lx, ly - 18, w, 36, 10, 'rgba(14,20,36,.97)', C.gold, 2); txt(g, lab, lx + w / 2, ly, C.gold, fnt(700, 21), 'center'); g.restore(); }
  if (k > .5) txt(g, '泉眼', cx, y0 - 44 * k, C.fg3, fnt(500, 20 * k), 'center'); }
// 按时间表逐段修：steps = [[出现时刻, 着法, 谁]]
function flowScript(tk, steps) { const s = FL.init(); let grow = null; steps.forEach(([at, m, v]) => { if (tk >= at) { s.out[m] = v; s.used[v]++; if (tk < at + .6) grow = { m, u: (tk - at) / .5 }; } }); return { s, grow }; }

AN.flow_rule = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, cx = R.x + 430, y0 = R.y + 70, sp = 100, px = R.x + 900;
  if (st.k === 0) { const { s, grow } = flowScript(tk, [[.5 * d, fid(0, 0, 0), 1], [.62 * d, fid(1, 0, 1), 2], [.74 * d, fid(2, 1, 0), 1], [.84 * d, fid(0, 0, 1), 2]]);
    flowDraw(g, cx, y0, sp, s, { grow, note: { 0: ['64 份水', (tk - .06 * d) / .4, 'r'] } });
    fadeIn(g, Math.min((tk - .2 * d) / .5, (.5 * d - tk) / .4 + 1), () => txt(g, '七个杯子', cx, y0 + 6 * sp + 80, C.fg2, fnt(600, 22), 'center'));
    rulePanel(g, R, px, '分水 · 玩法', ['顶上的泉眼：64 份水', '下面是一层层节点，最底下 7 个杯子', '轮流修一段水渠', '从任何有水的节点，向左下或右下', '每人只有 12 段'], [.1, .24, .42, .56, .86], tk, d, 460);
  } else { const { s, grow } = flowScript(tk, [[-9, fid(0, 0, 0), 1], [.28 * d, fid(0, 0, 1), 2], [.62 * d, fid(1, 0, 0), 1], [.66 * d, fid(2, 0, 0), 2], [.7 * d, fid(3, 0, 1), 1], [.74 * d, fid(4, 1, 0), 2], [.8 * d, fid(5, 1, 0), 1]]);
    const note = {}; if (tk > .08 * d && tk < .27 * d) note[0] = ['一条出路：全走这条', (tk - .08 * d) / .4, 'r']; if (tk > .3 * d && tk < .43 * d) note[0] = ['两条出路：对半分', (tk - .3 * d) / .4, 'r']; if (tk > .44 * d && tk < .62 * d) note[FL.id(1, 1)] = ['没有出路：积在原地', (tk - .44 * d) / .4, 'r'];
    flowDraw(g, cx, y0, sp, s, { grow, note, hi: tk > .82 * d && tk < .97 * d ? fid(5, 1, 0) : -1 });
    const r = flowRaw(s); rulePanel(g, R, px, '分水 · 水怎么流、归谁', ['一条出路：水全走这一条', '两条出路：对半分', '没有出路：积在原地，谁也得不到', '流进杯子时，最后一段是谁修的，', '这些水就归谁'], [.08, .28, .44, .64, .68], tk, d, 460);
    fadeIn(g, (tk - .86 * d) / .5, () => { score2(g, px + 40, R.y + 590, r.got[1], r.got[2], '份'); txt(g, '最后一段是蓝方修的：这 32 份归蓝方', px + 40, R.y + 660, C.fg2, fnt(500, 22)); }); } };

AN.flow_trick = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, cx = R.x + 430, y0 = R.y + 70, sp = 100, px = R.x + 900;
  const base = [[0, 0, 0], [1, 0, 1], [2, 1, 0], [3, 1, 1], [4, 2, 0], [5, 2, 1]].map(([l, i, sd]) => [-9, fid(l, i, sd), 1]);
  const { s, grow } = flowScript(tk, base.concat([[.4 * d, fid(2, 1, 1), 2], [.62 * d, fid(3, 2, 1), 2], [.68 * d, fid(4, 3, 1), 2], [.82 * d, fid(5, 4, 0), 1]]));
  const note = {}; if (tk > .06 * d && tk < .32 * d) note[FL.id(4, 2)] = ['蓝方独占的一条水路', (tk - .06 * d) / .4, 'l']; if (tk > .42 * d && tk < .6 * d) note[FL.id(2, 1)] = ['橙方接一条岔路', (tk - .42 * d) / .4, 'r']; if (tk > .84 * d) note[FL.id(5, 4)] = ['蓝方抢最后一段', (tk - .84 * d) / .4, 'r'];
  flowDraw(g, cx, y0, sp, s, { grow, note });
  const r = flowRaw(s), pw = R.x + R.w - px - 40;
  card(g, px, R.y + 50, pw, 210, '手段一：分流', ['在对方水路的上游接一条岔路', '对方的水立刻少一半'], C.o, SS((tk - .1 * d) / .6), false, 25);
  card(g, px, R.y + 290, pw, 210, '手段二：抢最后一段', ['前面是谁修的都不重要', '只看流进杯子的那一段'], C.b, SS((tk - .56 * d) / .6), false, 25);
  score2(g, px + 40, R.y + 590, r.got[1], r.got[2], '份'); txt(g, `积在半路 ${r.pool} 份`, px + 40, R.y + 660, C.fg3, fnt(500, 22)); };

AN.flow_fix = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, cx = R.x + 430, y0 = R.y + 70, sp = 100, px = R.x + 900, pw = R.x + R.w - px - 40;
  const steps = []; for (let l = 0; l < 6; l++) { steps.push([(.36 + l * .04) * d, fid(l, 0, 0), 1]); steps.push([(.38 + l * .04) * d, fid(l, l, 1), 2]); }
  const { s, grow } = flowScript(tk, steps), mul = (tk - .74 * d) / .6, r = flowRaw(s), r2 = FL.flows(s);
  flowDraw(g, cx, y0, sp, s, { grow, mul });
  card(g, px, R.y + 50, pw, 250, '各杯等值：坏的', ['水渠网左右对称', '你修左边，我就修右边', '同档 30 局：平局 27 局'], C.bad, SS((tk - .04 * d) / .6), false, 25);
  card(g, px, R.y + 330, pw, 200, '改成不对称', ['杯子从左到右：每份水算 1 到 7 分', '右边更值钱，照镜子不再管用'], C.g, SS((tk - .68 * d) / .6), false, 25);
  if (mul > 0) { score2(g, px + 40, R.y + 610, r2.got[1], r2.got[2], '分'); txt(g, '同样各得 32 份水：32×1 对 32×7', px + 40, R.y + 680, C.fg3, fnt(500, 22)); } else if (tk > .6 * d) fadeIn(g, (tk - .6 * d) / .5, () => { score2(g, px + 40, R.y + 610, r.got[1], r.got[2], '份'); txt(g, '谁也多不出一份', px + 40, R.y + 680, C.fg3, fnt(500, 22)); }); };

AN.flow_game = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, cx = R.x + 430, y0 = R.y + 70, sp = 100, D = DEMO.flow, N = D.mv.length;
  const evs = st.k === 0 ? [[.02, .2, 0, 10], [.22, .32, 10, 11], [.36, .46, 11, 12], [.68, .78, 12, 13]] : [[.02, .2, 13, 20], [.22, .3, 20, 21], [.36, .44, 21, 22], [.78, .88, 22, 24]];
  let k = evs[0][2], f = 0; evs.forEach(([a, b, k0, k1]) => { if (tk >= a * d) { const r = plyAt(tk, a * d, b * d, k0, k1); k = r.k; f = r.f; } });
  const growing = k < N && f > 0, s = growing ? D.st[k + 1] : D.st[k], kd = growing && f > .6 ? k + 1 : k, sd = D.st[kd];
  flowDraw(g, cx, y0, sp, s, { grow: growing ? { m: D.mv[k], u: f / .6 } : null, mul: 1, hi: kd > 0 && !growing ? D.mv[kd - 1] : -1 });
  const px = R.x + 900, pw = R.x + R.w - px - 40, r = FL.flows(sd); panel(g, px, R.y + 30, pw, 720, '对局回放 · 程序自对弈');
  txt(g, kd ? `第 ${kd} 手 · ${PN[kd % 2 ? 1 : 2]}` : '开局', px + 40, R.y + 116, C.fg2, fnt(600, 28)); score2(g, px + 40, R.y + 190, r.got[1], r.got[2], '分');
  txt(g, `剩余水渠：蓝方 ${12 - sd.used[1]} 段，橙方 ${12 - sd.used[2]} 段`, px + 40, R.y + 270, C.fg2, fnt(500, 23)); txt(g, `积在半路：${r.pool} 份`, px + 40, R.y + 312, C.fg3, fnt(500, 23));
  miniChart(g, px + 70, R.y + 420, pw - 130, 250, [[i => FL.flows(D.st[i]).got[1], BL], [i => FL.flows(D.st[i]).got[2], OR]], N, kd, 120, '得分');
  if (st.k === 0) { if (kd === 12) chip(g, '24 份 × 4 = 96 分', px + 40, R.y + 712, OR); if (kd >= 13) chip(g, '各 12 份：12×3 对 12×4', px + 40, R.y + 712, C.gold); }
  else { if (kd === 22) chip(g, '又被橙方抢到：12 份 × 5', px + 40, R.y + 712, OR); if (kd >= 24) chip(g, '终局 42 : 116，橙方获胜', px + 40, R.y + 712, C.gold); } };

AN.flow_res = (g, t, R, st) => resPanel(g, st.tk, R, { name: '分水', tiers: [['每步 400 对 100 次', 15, 20, ''], ['每步 1600 对 400 次', 18, 20, '没有平局']], first: [1, 30, '每步 3000 次时：先手只赢 1 局，后手 29 局', C.bad],
  notes: [['基本成立', C.gold, ['多想确实有用，没有平局', '分流和抢最后一段都用得上']], ['问题：盘面太小', C.r, ['一共 24 手，程序算得够深时', '后手 30 局赢 29 局']], ['下一步', C.b, ['更大的盘面', '或者别的平衡办法']]], at: [3, 7, 12] });
