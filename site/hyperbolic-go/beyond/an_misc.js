// 开场、方法、总结。
function miniIcon(g, kind, x, y, s) { g.save(); g.translate(x, y);
  if (kind === 'net') { const P = [[0, 0], [s * .8, -s * .5], [s * .9, s * .5], [-s * .7, s * .6], [-s * .8, -s * .5], [s * .1, -s]]; [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [4, 5], [1, 2]].forEach(([a, b]) => line(g, [P[a], P[b]], C.line2, 3)); P.forEach((p, i) => dot(g, p[0], p[1], s * .16, [BL, OR, C.fg3, OR, BL, C.fg3][i])); }
  if (kind === 'life') { const cs = s * .42; for (let i = 0; i < 25; i++) { const v = [0, 1, 0, 0, 2, 0, 1, 1, 0, 2, 0, 0, 0, 2, 2, 1, 0, 0, 0, 0, 0, 1, 0, 2, 0][i]; rr(g, -cs * 2.5 + (i % 5) * cs + 2, -cs * 2.5 + Math.floor(i / 5) * cs + 2, cs - 4, cs - 4, 5, v ? PC[v] : 'rgba(255,255,255,.04)'); } }
  if (kind === 'sky') { const bs = s * .42; [[0, 0, 1], [0, 1, 2], [1, 0, 2], [2, 0, 1], [2, 1, 1], [2, 2, 2], [3, 0, 2], [3, 2, 1], [4, 0, 1]].forEach(([cx, cy, v]) => rr(g, -bs * 2.5 + cx * bs + 2, s - (cy + 1) * bs + 2, bs - 4, bs - 4, 5, PC[v])); rr(g, -bs * 2.7, s + 4, bs * 5.4, 6, 3, C.fg3); }
  g.restore(); }
AN.open = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, cx = R.x + R.w / 2;
  if (st.k === 0) { if (tk < 4.6) return; const a = SS((tk - 4.8) / .8), gone = SS((tk - .62 * d) / 1.2);
    g.save(); g.globalAlpha = a * (1 - gone * .88); const cs = 52, x0 = cx - 4 * cs, y0 = R.y + 110; rr(g, x0 - 30, y0 - 30, 8 * cs + 60, 8 * cs + 60, 12, '#C9A46A'); for (let i = 0; i < 9; i++) { line(g, [[x0 + i * cs, y0], [x0 + i * cs, y0 + 8 * cs]], '#3A2A14', 2); line(g, [[x0, y0 + i * cs], [x0 + 8 * cs, y0 + i * cs]], '#3A2A14', 2); }
    [[2, 2, 1], [6, 2, 2], [2, 6, 2], [6, 6, 1], [4, 4, 1], [5, 4, 2], [4, 5, 2], [3, 4, 2], [4, 3, 1], [5, 5, 1]].forEach(([x, y, v]) => { dot(g, x0 + x * cs, y0 + y * cs, 22, v === 1 ? '#15171C' : '#F1F1EC'); }); g.restore();
    fadeIn(g, gone, () => { cross(g, cx, R.y + 110 + 4 * 52, 1, C.bad, 150); });
    fadeIn(g, (tk - .72 * d) / .8, () => { txt(g, '只保留一条：两个人，轮流行动', cx, R.y + 690, C.fg, fnt(800, 44), 'center'); });
  } else { const cols = [['net', '在网络上博弈', ['蔓延', '道岔']], ['life', '在会自己演化的系统里博弈', ['生命对决', '沙堆']], ['sky', '在搭建的过程中博弈', ['天际线', '跷跷板']]];
    cols.forEach(([ic, head, names], i) => { const a = SS((tk - .08 * d - i * .1 * d) / .6); if (a <= 0) return; g.save(); g.globalAlpha = a; const w = 500, x = R.x + 60 + i * (w + 50), y = R.y + 60; panel(g, x, y, w, 560); miniIcon(g, ic, x + w / 2, y + 150, 90); txt(g, head, x + w / 2, y + 310, C.fg, fnt(700, 28), 'center');
      names.forEach((n, j) => { const u = SS((tk - .42 * d - (i * 2 + j) * .25) / .4); if (u > 0) { g.globalAlpha = a * u; rr(g, x + 60, y + 370 + j * 84, w - 120, 64, 14, 'rgba(255,255,255,.05)', C.line2, 2); txt(g, n, x + w / 2, y + 402 + j * 84, C.fg, fnt(700, 30), 'center'); } }); g.restore(); });
    fadeIn(g, (tk - .82 * d) / .6, () => txt(g, '文稿与画面由 AI（Claude）生成 · 配音由 AI 合成 · 对局来自程序自对弈', cx, R.y + 700, C.fg3, fnt(500, 24), 'center')); } };

AN.method = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk;
  if (st.k === 0) { bot(g, R.x + 220, R.y + 330, BL, 3); bot(g, R.x + R.w - 220, R.y + 330, OR, 3); txt(g, '同一个搜索程序', R.x + R.w / 2, R.y + 50, C.fg, fnt(700, 30), 'center'); txt(g, '自己和自己下', R.x + R.w / 2, R.y + 96, C.fg3, fnt(500, 24), 'center');
    // 候选着法 + 随机试下的胜率
    const rnd = mkRng(7), cand = [.41, .47, .63, .52, .38], bx = R.x + 520, bw = 680, n = Math.floor(CL((tk - .4 * d) / (.4 * d)) * 400);
    fadeIn(g, (tk - .3 * d) / .5, () => { txt(g, '每个候选着法：随机下到终局，统计胜率', bx, R.y + 200, C.fg2, fnt(600, 24)); cand.forEach((p, i) => { const y = R.y + 270 + i * 70, noise = (rnd() - .5) * .5 / Math.sqrt(1 + n / 5), v = CL(p + noise, .05, .95), best = i === 2 && tk > .84 * d; txt(g, '着法 ' + 'ABCDE'[i], bx, y, best ? C.gold : C.fg2, fnt(600, 24)); rr(g, bx + 130, y - 14, bw - 260, 28, 14, 'rgba(255,255,255,.06)'); if (n > 0) rr(g, bx + 130, y - 14, (bw - 260) * v, 28, 14, best ? C.gold : C.fg3); txt(g, n > 0 ? Math.round(v * 100) + '%' : '', bx + bw - 110, y, best ? C.gold : C.fg, fnt(700, 24, 'mono')); });
      txt(g, `已试下 ${n} 次`, bx, R.y + 640, C.fg3, fnt(500, 22, 'sans')); if (tk > .84 * d) txt(g, '→ 选胜率最高的一步', bx + 250, R.y + 640, C.gold, fnt(700, 24)); });
  } else { const w = 800, y = R.y + 60;
    fadeIn(g, (tk - .05 * d) / .6, () => { const x = R.x + 40; panel(g, x, y, w, 620, '指标一：多想有没有用'); bot(g, x + 150, y + 190, BL, 2); txt(g, '每步试 400 次', x + 150, y + 270, C.fg, fnt(600, 24), 'center'); txt(g, '对', x + w / 2, y + 190, C.fg3, fnt(600, 28), 'center'); bot(g, x + w - 150, y + 190, C.fg3, 2); txt(g, '每步试 100 次', x + w - 150, y + 270, C.fg, fnt(600, 24), 'center');
      wbar(g, x + 40, y + 370, w - 80, '有技巧的游戏', 18, 20, (tk - .22 * d) / .8, C.g); wbar(g, x + 40, y + 450, w - 80, '接近掷骰子', 11, 20, (tk - .42 * d) / .8, C.bad); txt(g, '多想的一方 20 局里赢几局（示意）', x + 40, y + 540, C.fg3, fnt(500, 21)); });
    fadeIn(g, (tk - .68 * d) / .6, () => { const x = R.x + R.w - 40 - w; panel(g, x, y, w, 620, '指标二：先后手公不公平'); bot(g, x + 150, y + 190, BL, 2); txt(g, '先手', x + 150, y + 270, C.fg, fnt(600, 24), 'center'); txt(g, '一样强', x + w / 2, y + 190, C.fg3, fnt(600, 28), 'center'); bot(g, x + w - 150, y + 190, OR, 2); txt(g, '后手', x + w - 150, y + 270, C.fg, fnt(600, 24), 'center');
      wbar(g, x + 40, y + 370, w - 80, '公平', 10, 20, (tk - .76 * d) / .8, C.g); wbar(g, x + 40, y + 450, w - 80, '先手必胜', 19, 20, (tk - .84 * d) / .8, C.bad); txt(g, '先手 20 局里赢几局（示意）', x + 40, y + 540, C.fg3, fnt(500, 21)); }); } };

AN.sum = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, x = R.x + 40, y = R.y + 20, w = R.w - 80, rh = 104;
  const rows = [['生命对决', '自行演化', 19, 20, '10/20', '最好', C.g, .1], ['蔓延', '网络', 18, 20, '2/20，8 平', '有技巧，公平性待调', C.gold, .3], ['天际线', '搭建', 16, 20, '6/20', '有技巧，公平性待调', C.gold, .36], ['道岔', '网络', 12, 20, '12/20', '运气主导', C.bad, .55], ['沙堆', '自行演化', 12, 20, '5/20', '过于混乱', C.bad, .64], ['跷跷板', '搭建', 13, 20, '0/20', '照镜子必胜', C.bad, .76]];
  const cx = [x + 30, x + 250, x + 440, x + 1010, x + 1250]; ['游戏', '方向', '多想四倍（1600 对 400）', '先手胜', '结论'].forEach((h, i) => txt(g, h, cx[i], y + 30, C.fg3, fnt(600, 21))); line(g, [[x, y + 60], [x + w, y + 60]], C.line2, 2);
  rows.forEach(([n, dir, win, tot, first, verdict, col, at], i) => { const a = SS((tk - at * d) / .5); if (a <= 0) return; g.save(); g.globalAlpha = a; const yy = y + 60 + i * rh + rh / 2; if (i % 2 === 0) rr(g, x, yy - rh / 2 + 4, w, rh - 8, 12, 'rgba(255,255,255,.025)');
    txt(g, n, cx[0], yy, C.fg, fnt(800, 30)); txt(g, dir, cx[1], yy, C.fg2, fnt(500, 23)); rr(g, cx[2], yy - 13, 420, 26, 13, 'rgba(255,255,255,.06)'); line(g, [[cx[2] + 210, yy - 20], [cx[2] + 210, yy + 20]], C.fg3, 2, [4, 4]); rr(g, cx[2], yy - 13, 420 * win / tot * SS((tk - at * d - .2) / .7), 26, 13, col); txt(g, `${win}/${tot}`, cx[2] + 440, yy, C.fg, fnt(700, 23, 'mono')); txt(g, first, cx[3], yy, C.fg2, fnt(600, 23, 'sans')); txt(g, verdict, cx[4], yy, col, fnt(700, 25)); g.restore(); }); };

AN.sum2 = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk;
  if (st.k === 0) { const w = 800, y = R.y + 80;
    fadeIn(g, (tk - .1 * d) / .6, () => { const x = R.x + 40; panel(g, x, y, w, 520); txt(g, '混乱 ≠ 没有技巧', x + w / 2, y + 80, C.g, fnt(800, 44), 'center'); miniIcon(g, 'life', x + w / 2, y + 250, 100); wrapTxt(g, '生命游戏很难预测，但程序仍然能下出稳定的强弱之分', x + 60, y + 420, w - 120, 38, C.fg2, fnt(500, 26)); });
    fadeIn(g, (tk - .55 * d) / .6, () => { const x = R.x + R.w - 40 - w; panel(g, x, y, w, 520); txt(g, '复杂的网络 ≠ 更有深度', x + w / 2, y + 80, C.gold, fnt(800, 44), 'center'); miniIcon(g, 'net', x + w / 2, y + 250, 100); wrapTxt(g, '蔓延在随机网络上，反而不如在整齐的方格上耐玩', x + 60, y + 420, w - 120, 38, C.fg2, fnt(500, 26)); });
  } else { const w = 800, y = R.y + 40, x1 = R.x + 40, x2 = R.x + R.w - 40 - w;
    card(g, x1, y, w, 330, '证据有限', ['每组只测了 12 到 20 局', '对手是不带任何知识的搜索程序', '没有人真正下过'], C.r, SS((tk - .02 * d) / .6), false, 26);
    card(g, x2, y, w, 330, '还没尝试的方向', ['每一手都修改规则的游戏', '在连续平面上划分地盘的游戏', '数与逻辑上的博弈'], C.b, SS((tk - .42 * d) / .6), false, 26);
    fadeIn(g, (tk - .72 * d) / .6, () => { rr(g, x1, y + 380, R.w - 80, 240, 16, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, '规则都很短：一张纸一支笔，或者几行代码，就能试一试', R.x + R.w / 2, y + 460, C.fg, fnt(700, 32), 'center'); txt(g, '模拟代码和各游戏的完整规则见简介', R.x + R.w / 2, y + 540, C.fg2, fnt(500, 26), 'center'); }); } };
