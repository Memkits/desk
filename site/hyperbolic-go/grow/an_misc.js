// 开场与总结。
function miniGame(g, kind, cx, cy) {
  if (kind === 'twig') twigDraw(g, cx, cy, 24, DEMO.twig.st[DEMO.twig.st.length - 1]);
  if (kind === 'flow') flowDraw(g, cx, cy - 100, 34, DEMO.flow.st[24]);
  if (kind === 'coral') { const s = DEMO.coral.st[DEMO.coral.st.length - 1]; coralDraw(g, cx, cy, 14.5, s.x.map((x, i) => [x, s.y[i], s.own[i]]), { R: 7.4 }); }
  if (kind === 'tower') towerDraw(g, cx - 8 * 14, cy + 80, 14, 24, DEMO.tower.st[24].b, { loads: false }); }
AN.open = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, cx = R.x + R.w / 2;
  if (st.k === 0) { if (tk < 4.6) return; const a = SS((tk - 4.8) / .8), D = DEMO.twig, { k, f } = plyAt(tk, .32 * d, .98 * d, 0, 46);
    g.save(); g.globalAlpha = a; twigPly(g, R.x + 430, R.y + 380, 74, k, f); g.restore();
    const x = R.x + 900; fadeIn(g, Math.min(a, 1 - SS((tk - .3 * d) / .6) * .65), () => { txt(g, '上一期', x, R.y + 150, C.fg3, fnt(600, 26)); txt(g, '把棋盘拿掉', x, R.y + 210, C.fg, fnt(800, 48)); });
    fadeIn(g, (tk - .3 * d) / .6, () => { txt(g, '这一期', x, R.y + 330, C.fg3, fnt(600, 26)); txt(g, '连棋子也不是摆上去的', x, R.y + 390, C.fg, fnt(800, 48)); });
    fadeIn(g, (tk - .55 * d) / .6, () => { txt(g, '场上只有一个结构', x, R.y + 500, C.gold, fnt(700, 36)); txt(g, '两个人轮流让它长出来', x, R.y + 556, C.gold, fnt(700, 36)); });
    fadeIn(g, (tk - .8 * d) / .6, () => txt(g, '长出来的部分，又反过来限制对方', x, R.y + 650, C.fg2, fnt(600, 30)));
  } else { const cols = [['twig', '枝战', '在平面上长树枝', '成立', C.g], ['flow', '分水', '共修一张水渠网', '基本成立', C.gold], ['coral', '珊瑚', '往同一个群落上贴圆', '不成立', C.bad], ['tower', '危楼', '合砌一面会垮的墙', '不成立', C.bad]];
    cols.forEach(([kind, name, sub, verdict, col], i) => { const a = SS((tk - (.05 + i * .09) * d) / .6); if (a <= 0) return; g.save(); g.globalAlpha = a; const w = 400, x = R.x + 24 + i * (w + 24), y = R.y + 40; panel(g, x, y, w, 590); miniGame(g, kind, x + w / 2, y + 190);
      txt(g, name, x + w / 2, y + 410, C.fg, fnt(800, 38), 'center'); txt(g, sub, x + w / 2, y + 462, C.fg2, fnt(500, 24), 'center');
      const u = SS((tk - .58 * d - i * .04 * d) / .5); if (u > 0) { g.globalAlpha = a * u; rr(g, x + 90, y + 500, w - 180, 56, 14, 'rgba(255,255,255,.05)', col, 2.5); txt(g, verdict, x + w / 2, y + 529, col, fnt(800, 28), 'center'); } g.restore(); });
    fadeIn(g, (tk - .8 * d) / .6, () => txt(g, '文稿与画面由 AI（Claude）生成 · 配音由 AI 合成 · 对局来自程序自对弈', cx, R.y + 700, C.fg3, fnt(500, 24), 'center')); } };

AN.sum = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, x = R.x + 40, y = R.y + 40, w = R.w - 80, rh = 140;
  const rows = [['枝战', '平面上的树', 20, 20, '先手 9/20', '成立', C.g, .04], ['分水', '水渠网', 18, 20, '强手之间后手 29/30', '基本成立', C.gold, .3], ['珊瑚', '贴圆的群落', 12, 20, '由开局决定', '不成立', C.bad, .62], ['危楼', '错缝的墙', 10, 20, '后手 17、平 12（30 局）', '不成立', C.bad, .7]];
  const cx = [x + 30, x + 220, x + 460, x + 1000, x + 1400]; ['游戏', '结构', '多想四倍的一方', '先后手', '结论'].forEach((h, i) => txt(g, h, cx[i], y + 30, C.fg3, fnt(600, 21))); line(g, [[x, y + 60], [x + w, y + 60]], C.line2, 2);
  rows.forEach(([n, dir, win, tot, first, verdict, col, at], i) => { const a = SS((tk - at * d) / .5); if (a <= 0) return; g.save(); g.globalAlpha = a; const yy = y + 60 + i * rh + rh / 2; if (i % 2 === 0) rr(g, x, yy - rh / 2 + 4, w, rh - 8, 12, 'rgba(255,255,255,.025)');
    txt(g, n, cx[0], yy, C.fg, fnt(800, 34)); txt(g, dir, cx[1], yy, C.fg2, fnt(500, 24)); rr(g, cx[2], yy - 13, 400, 26, 13, 'rgba(255,255,255,.06)'); line(g, [[cx[2] + 200, yy - 20], [cx[2] + 200, yy + 20]], C.fg3, 2, [4, 4]); rr(g, cx[2], yy - 13, 400 * win / tot * SS((tk - at * d - .2) / .7), 26, 13, col); txt(g, `${win}/${tot}`, cx[2] + 420, yy, C.fg, fnt(700, 23, 'mono')); txt(g, first, cx[3], yy, C.fg2, fnt(600, 23)); txt(g, verdict, cx[4], yy, col, fnt(800, 28)); g.restore(); }); };

AN.sum2 = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, w = 800, y = R.y + 30, x1 = R.x + 40, x2 = R.x + R.w - 40 - w;
  if (st.k === 0) {
    fadeIn(g, (tk - .08 * d) / .6, () => { panel(g, x1, y, w, 540); txt(g, '影响是局部的，而且留得下来', x1 + w / 2, y + 70, C.g, fnt(800, 36), 'center'); g.save(); g.beginPath(); g.rect(x1 + 20, y + 110, w - 40, 300); g.clip(); twigDraw(g, x1 + 210, y + 260, 30, DEMO.twig.st[40]); flowDraw(g, x1 + 590, y + 150, 38, DEMO.flow.st[24]); g.restore();
      fadeIn(g, (tk - .2 * d) / .5, () => txt(g, '枝战：一段枝挡住一小块空间', x1 + 50, y + 440, C.fg, fnt(600, 26))); fadeIn(g, (tk - .28 * d) / .5, () => txt(g, '分水：一条岔路分走一半的水', x1 + 50, y + 490, C.fg, fnt(600, 26))); });
    fadeIn(g, (tk - .38 * d) / .6, () => { panel(g, x2, y, w, 540); txt(g, '影响可以连锁放大', x2 + w / 2, y + 70, C.bad, fnt(800, 36), 'center'); miniGame(g, 'coral', x2 + 210, y + 250); towerDraw(g, x2 + 440, y + 350, 18, 30, DEMO.tower.rec[25][0].b, { loads: false, brk: DEMO.tower.rec[25][0].brk });
      fadeIn(g, (tk - .48 * d) / .5, () => txt(g, '珊瑚：一个圆翻转一圈', x2 + 50, y + 410, C.fg, fnt(600, 26))); fadeIn(g, (tk - .56 * d) / .5, () => txt(g, '危楼：一块砖压垮半面墙', x2 + 50, y + 455, C.fg, fnt(600, 26))); fadeIn(g, (tk - .66 * d) / .5, () => txt(g, '沙堆（上一期）：一粒沙引发雪崩', x2 + 50, y + 500, C.fg2, fnt(600, 26))); });
    fadeIn(g, (tk - .82 * d) / .6, () => { rr(g, x1, y + 580, R.w - 80, 110, 16, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, '能连锁，前面的积累就不算数了', R.x + R.w / 2, y + 635, C.fg, fnt(800, 36), 'center'); });
  } else {
    card(g, x1, y, w, 330, '教训：新规则要测过才知道', ['枝战里以为最精彩的切断规则', '其实是多余的'], C.gold, SS((tk - .02 * d) / .6), false, 26);
    card(g, x2, y, w, 330, '证据有限', ['每组只测了 12 到 30 局', '对手是不带任何知识的搜索程序', '没有人真正下过'], C.r, SS((tk - .36 * d) / .6), false, 26);
    fadeIn(g, (tk - .76 * d) / .6, () => { rr(g, x1, y + 380, R.w - 80, 240, 16, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, '四个游戏都做成了可以直接玩的网页', R.x + R.w / 2, y + 460, C.fg, fnt(700, 34), 'center'); txt(g, '链接和完整规则见简介', R.x + R.w / 2, y + 540, C.fg2, fnt(500, 26), 'center'); }); } };
