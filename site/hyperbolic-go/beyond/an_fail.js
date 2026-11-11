// 三个不成立的游戏：道岔、沙堆、跷跷板。
// ---- 道岔 ----
const SWG = { n: 16, chord: [5, 9, 7, 12, 10, 14, 2, 3, 15, 6, 1, 8, 4, 0, 11, 13], home: { 4: 1, 11: 1, 6: 2, 13: 2 }, script: [[1, 12], [2, 2], [1, 14], [2, 10], [1, 2]] };
(() => { const S = SWG, sw = new Array(16).fill(0); let pos = 0; const sc = [0, 0, 0]; S.fr = [{ sw: sw.slice(), pos, path: [0], sc: sc.slice() }];
  S.script.forEach(([who, m]) => { sw[m] ^= 1; const path = [pos]; let scored = 0; for (let k = 0; k < 2; k++) { pos = sw[pos] ? S.chord[pos] : (pos + 1) % 16; path.push(pos); if (S.home[pos]) { sc[S.home[pos]]++; scored = S.home[pos]; break; } }
    S.fr.push({ sw: sw.slice(), pos, path, sc: sc.slice(), who, m, scored }); if (scored) pos = 0; }); })();
AN.sw = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, S = SWG, cx = R.x + 520, cy = R.y + 400, rx = 440, ry = 330, P = [];
  for (let i = 0; i < 16; i++) { const a = -Math.PI / 2 + i / 16 * 2 * Math.PI; P.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
  let k = 0, f = 1; if (st.k === 0) { const a0 = .5 * d, slot = (.99 * d - a0) / 5; if (tk >= a0) { const u = Math.min(5 - 1e-6, (tk - a0) / slot); k = Math.floor(u) + 1; f = u - Math.floor(u); } } else { k = 5; f = 1; }
  const fr = S.fr[k], prev = S.fr[Math.max(0, k - 1)], sw = (k > 0 && f < .12) ? prev.sw : fr.sw;
  const edge = (a, b, on, hi) => { const [x0, y0] = P[a], [x1, y1] = P[b], L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L; arrow(g, x0 + ux * 30, y0 + uy * 30, x1 - ux * 34, y1 - uy * 34, hi ? '#fff' : on ? C.fg2 : C.line, on ? 3.5 : 1.5, on ? 13 : 0, 1); };
  for (let i = 0; i < 16; i++) { edge(i, (i + 1) % 16, !sw[i]); edge(i, S.chord[i], !!sw[i]); }
  for (let i = 0; i < 16; i++) { const [x, y] = P[i], h = S.home[i]; dot(g, x, y, 26, h ? PC[h] : '#0B1020'); g.strokeStyle = (k > 0 && fr.m === i && f < .5) ? '#fff' : C.fg3; g.lineWidth = (k > 0 && fr.m === i && f < .5) ? 6 : 2.5; g.beginPath(); g.arc(x, y, 26, 0, 7); g.stroke(); if (h) txt(g, '终', x, y + 1, '#0B1020', fnt(800, 24), 'center'); if (i === 0) txt(g, '起点', x, y - 46, C.fg2, fnt(600, 20), 'center'); }
  // 包裹
  let pp; if (k === 0) pp = P[0]; else if (f < .3) pp = P[fr.path[0]]; else { const u = CL((f - .3) / .55) * (fr.path.length - 1), i = Math.min(fr.path.length - 2, Math.floor(u)), e = SS(u - i); pp = [LERP(P[fr.path[i]][0], P[fr.path[i + 1]][0], e), LERP(P[fr.path[i]][1], P[fr.path[i + 1]][1], e)]; }
  rr(g, pp[0] - 17, pp[1] - 17, 34, 34, 7, C.gold, '#fff', 3);
  const px = R.x + 1080, pw = R.x + R.w - px - 40; panel(g, px, R.y + 40, pw, 720, '道岔');
  if (st.k === 0) { [['包裹自己往前走', .12], ['每个节点两条出路，亮的那条是道岔方向', .3], ['轮到你：扳一个道岔，包裹走两步', .5], ['走进谁的终点，谁得 1 分，回到起点', .78]].forEach(([s, at], i) => fadeIn(g, (tk - at * d) / .5, () => { dot(g, px + 40, R.y + 130 + i * 84, 6, C.gold); wrapTxt(g, s, px + 62, R.y + 130 + i * 84, pw - 90, 34, C.fg, fnt(600, 24)); }));
    if (k > 0) txt(g, `第 ${k} 手 · ${PN[fr.who]}扳 ${fr.m} 号道岔`, px + 40, R.y + 520, PC[fr.who], fnt(700, 26)); }
  else { wbar(g, px + 30, R.y + 150, pw - 60, '多想四倍', 12, 20, (tk - .3 * d) / .8, C.bad); txt(g, '（两档测试都是 12/20）', px + 30, R.y + 200, C.fg3, fnt(500, 20));
    [['胜负主要看线路怎么连', .55], ['每手只能改一个道岔，余地太小', .75]].forEach(([s, at], i) => fadeIn(g, (tk - at * d) / .5, () => { cross(g, px + 44, R.y + 300 + i * 70, 1, C.bad, 9); txt(g, s, px + 70, R.y + 300 + i * 70, C.fg, fnt(600, 25)); })); }
  const sc = (k > 0 && f < .85) ? prev.sc : fr.sc; txt(g, '蓝方', px + 40, R.y + 660, BL, fnt(700, 26)); txt(g, String(sc[1]), px + 120, R.y + 660, BL, fnt(800, 56, 'mono')); txt(g, '橙方', px + 240, R.y + 660, OR, fnt(700, 26)); txt(g, String(sc[2]), px + 320, R.y + 660, OR, fnt(800, 56, 'mono')); txt(g, '分', px + 370, R.y + 668, C.fg3, fnt(600, 22)); };

// ---- 沙堆 ----
const SND = (() => { const S = 6, gr = new Array(36).fill(0), ow = new Array(36).fill(0), set = (x, y, n, v) => { gr[y * S + x] = n; ow[y * S + x] = v; };
  [[2, 2, 3, 2], [3, 2, 3, 2], [2, 3, 3, 2], [3, 3, 3, 2], [4, 3, 2, 2], [2, 1, 2, 2], [3, 1, 1, 2], [4, 2, 2, 2], [3, 4, 2, 2], [1, 2, 3, 1], [0, 2, 1, 1], [1, 1, 2, 1], [1, 3, 1, 1], [0, 4, 2, 1], [5, 5, 1, 1], [4, 0, 1, 2]].forEach(a => set(...a));
  const fr = [{ gr: gr.slice(), ow: ow.slice() }]; const add = (i, v) => { gr[i]++; ow[i] = v; fr.push({ gr: gr.slice(), ow: ow.slice(), add: i, who: v }); };
  add(5 * 6 + 4, 1); add(0 * 6 + 5, 2); add(2 * 6 + 1, 1);
  for (let guard = 0; guard < 30; guard++) { const tp = []; for (let i = 0; i < 36; i++) if (gr[i] >= 4) tp.push(i); if (!tp.length) break;
    tp.forEach(i => { const own = ow[i]; gr[i] -= 4; if (!gr[i]) ow[i] = 0; const x = i % S, y = Math.floor(i / S); [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].forEach(([u, v]) => { if (u < 0 || v < 0 || u >= S || v >= S) return; gr[v * S + u]++; ow[v * S + u] = own; }); });
    fr.push({ gr: gr.slice(), ow: ow.slice(), top: tp }); }
  return { fr }; })();
function drawSand(g, x0, y0, cs, a, b, u, o = {}) { const S = 6; rr(g, x0 - 10, y0 - 10, S * cs + 20, S * cs + 20, 14, 'rgba(10,15,28,.95)', C.line2, 2); const F = u >= .5 ? b : a;
  for (let i = 0; i < 36; i++) { const x = x0 + (i % S) * cs, y = y0 + Math.floor(i / S) * cs, n = F.gr[i], v = F.ow[i];
    rr(g, x + 3, y + 3, cs - 6, cs - 6, 10, v ? (v === 1 ? 'rgba(92,180,255,.2)' : 'rgba(255,178,92,.2)') : 'rgba(255,255,255,.02)', v ? PC[v] : C.line, v ? 2.5 : 1.5);
    const pos = [[.5, .5], [.3, .5, .7, .5], [.3, .35, .7, .35, .5, .68], [.3, .3, .7, .3, .3, .7, .7, .7]][Math.min(4, n) - 1] || []; for (let q = 0; q < pos.length; q += 2) dot(g, x + pos[q] * cs, y + pos[q + 1] * cs, cs * .1, v ? PC[v] : C.fg2);
    if (n > 4) txt(g, String(n), x + cs / 2, y + cs / 2, '#fff', fnt(800, 26, 'mono'), 'center');
    if (b.top && b.top.includes(i) && u < .5) { g.save(); g.globalAlpha = .4 + .6 * Math.abs(Math.sin(u * 12)); g.strokeStyle = '#fff'; g.lineWidth = 5; g.strokeRect(x + 3, y + 3, cs - 6, cs - 6); g.restore(); }
    if (b.add === i && u < 1) { g.save(); g.globalAlpha = 1 - CL(u); g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.arc(x + cs / 2, y + cs / 2, cs * (.3 + .4 * CL(u)), 0, 7); g.stroke(); g.restore(); } } }
AN.sand = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, F = SND.fr, cs = 108, x0 = R.x + 150, y0 = R.y + 60, nW = F.length - 4;
  let k = 0, f = 1; if (st.k === 0) { const times = [.14, .24, .5]; for (let i = 0; i < 3; i++) if (tk >= times[i] * d) { k = i + 1; f = (tk - times[i] * d) / .6; } const w0 = .6 * d, ws = (.99 * d - w0) / nW; if (tk >= w0) { const u = Math.min(nW - 1e-6, (tk - w0) / ws); k = 4 + Math.floor(u); f = u - Math.floor(u); } } else { k = F.length - 1; f = 1; }
  drawSand(g, x0, y0, cs, F[Math.max(0, k - 1)], F[k], CL(f));
  const cur = f >= .5 ? F[k] : F[Math.max(0, k - 1)], ca = cur.ow.filter(v => v === 1).length, cb = cur.ow.filter(v => v === 2).length;
  const px = R.x + 950, pw = R.x + R.w - px - 40; panel(g, px, R.y + 50, pw, 700, '沙堆');
  if (st.k === 0) [['每手加一粒沙：空格或自己的格子', .1], ['满 4 粒就崩塌：分给上下左右', .45], ['并把这四格染成自己的颜色', .58], ['邻居也满 4 粒，接着崩：连锁', .78]].forEach(([s, at], i) => fadeIn(g, (tk - at * d) / .5, () => { dot(g, px + 40, R.y + 140 + i * 78, 6, C.gold); txt(g, s, px + 62, R.y + 140 + i * 78, C.fg, fnt(600, 25)); }));
  else { txt(g, '一粒沙之后：蓝方 7 格 → 17 格，橙方 11 格 → 2 格', px + 40, R.y + 130, C.fg, fnt(600, 25)); wbar(g, px + 30, R.y + 230, pw - 60, '多想四倍', 12, 20, (tk - .45 * d) / .8, C.bad);
    [['领先的一方平均每局换手 20 次', .35], ['老游戏“连锁反应”（Chain Reaction）的近亲', .1], ['算得再深，也算不过下一次雪崩', .8]].forEach(([s, at], i) => fadeIn(g, (tk - at * d) / .5, () => { dot(g, px + 40, R.y + 330 + i * 70, 6, C.bad); txt(g, s, px + 62, R.y + 330 + i * 70, C.fg, fnt(600, 24)); })); }
  txt(g, '占格数', px + 40, R.y + 590, C.fg3, fnt(500, 20)); score2(g, px + 40, R.y + 660, ca, cb); };

// ---- 跷跷板 ----
function drawSeesaw(g, cx, cy, items, tq, fall, o = {}) { const L = 760, ang = fall ? Math.sign(tq) * LERP(.06, .42, fall) : CL(tq / 8, -1, 1) * .06;
  g.save(); g.translate(cx, cy); g.fillStyle = C.fg3; g.beginPath(); g.moveTo(0, 8); g.lineTo(-60, 120); g.lineTo(60, 120); g.fill(); rr(g, -L - 60, 120, 2 * L + 120, 10, 5, C.line2);
  g.rotate(ang); rr(g, -L, -10, 2 * L, 20, 8, '#8FA0C0');
  for (let p = -5; p <= 5; p++) { if (!p) continue; const x = p * 140; line(g, [[x, -10], [x, 10]], '#0B1020', 2); txt(g, (p > 0 ? '+' : '') + p, x, 34, C.fg2, fnt(600, 20, 'mono'), 'center'); }
  items.forEach(it => { if (it.a <= 0) return; const x = it.p * 140, s = 50 + it.w * 9, e = SS(it.a); g.save(); g.globalAlpha = CL(it.a * 3); rr(g, x - s / 2, -10 - s - (1 - e) * 160, s, s, 10, PC[it.v]); txt(g, String(it.w), x, -10 - s / 2 - (1 - e) * 160, '#0B1020', fnt(800, 30, 'mono'), 'center'); g.restore(); });
  g.restore(); }
AN.seesaw = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, cx = R.x + R.w / 2, cy = R.y + 400;
  const mv = st.k === 0 ? [[1, 3, 2, .34], [2, 2, -4, .5], [1, 4, 3, .82]] : [[1, 3, 2, .1], [2, 3, -2, .17], [1, 5, 1, .26], [2, 5, -1, .33], [1, 1, 5, .42], [2, 1, -5, .49], [1, 4, 3, .56], [2, 4, -3, .63], [1, 2, 4, .7], [2, 2, -4, .77]];
  let tq = 0, tqShow = 0; const items = mv.map(([v, w, p, at]) => { const a = (tk - at * d) / .5; if (a > .8) tq += w * p; return { v, w, p, a }; });
  const fall = st.k === 0 && Math.abs(tq) > 8 ? SS((tk - .82 * d - .5) / .8) : 0;
  drawSeesaw(g, cx, cy, items, tq, fall);
  txt(g, '跷跷板', R.x + 60, R.y + 40, C.fg, fnt(800, 30)); txt(g, st.k === 0 ? '每人有重量 1 到 5 的砝码各一个；力矩 = 重量 × 位置' : '后手的必胜法：在对称的位置放同样重的砝码', R.x + 200, R.y + 42, C.fg2, fnt(500, 24));
  const col = Math.abs(tq) > 8 ? C.bad : C.ok; rr(g, cx - 250, R.y + 600, 500, 90, 16, 'rgba(14,20,36,.9)', col, 2.5); txt(g, '力矩合计', cx - 220, R.y + 645, C.fg2, fnt(600, 26)); txt(g, (tq > 0 ? '+' : '') + tq, cx + 20, R.y + 645, col, fnt(800, 52, 'mono'), 'center'); txt(g, '限度 ±8', cx + 110, R.y + 645, C.fg3, fnt(500, 22));
  if (st.k === 0) { [['蓝方：3 放在 +2，力矩 +6', .34, BL], ['橙方：2 放在 −4，合计 −2', .5, OR], ['蓝方：4 放在 +3，合计 +10，翻倒，蓝方输', .82, C.bad]].forEach(([s, at, c], i) => fadeIn(g, (tk - at * d - .4) / .5, () => txt(g, s, R.x + 80 + i * 520, R.y + 740, c, fnt(600, 25)))); }
  else { fadeIn(g, (tk - .84 * d) / .5, () => { chip(g, '十个位置放满，蓝方无处可放，橙方胜', R.x + 80, R.y + 740, OR, 1, 26); }); fadeIn(g, (tk - .88 * d) / .5, () => wbar(g, R.x + 900, R.y + 740, 760, '程序对下：后手赢', 20, 20, (tk - .88 * d) / .8, C.bad)); } };
