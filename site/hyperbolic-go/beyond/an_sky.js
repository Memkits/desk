// 天际线：带支撑规则的搭积木。cells[x][y]，y=0 是地面那一层。
const SKW = 7, SKH = 6;
const skyMk = list => { const c = Array.from({ length: SKW }, () => new Array(SKH).fill(0)); list.forEach(([x, y, v]) => c[x][y] = v); return c; };
const skyTops = c => c.map(col => { for (let y = SKH - 1; y >= 0; y--) if (col[y]) return col[y]; return 0; });
function skyBlock(g, x, y, bs, v, a = 1, hang = false) { g.save(); g.globalAlpha *= a; rr(g, x + 4, y + 4, bs - 8, bs - 8, 12, PC[v]); g.globalAlpha *= .3; rr(g, x + 10, y + 10, bs - 20, (bs - 20) * .35, 8, '#fff'); g.restore(); if (hang) { g.save(); g.globalAlpha *= a; txt(g, '悬', x + bs / 2, y + bs / 2 + 8, 'rgba(11,16,32,.75)', fnt(800, bs * .34), 'center'); g.restore(); } }
// o.pop = {x,y,v,u,side}；o.ghost = [{x,y,ok,a}]；o.tops 显示每列归属；o.hang = Set('x,y')；o.hiTop 高亮楼顶
function drawWall(g, x0, y0, bs, c, o = {}) { const W = SKW * bs, H = SKH * bs, cy = y => y0 + (SKH - 1 - y) * bs;
  rr(g, x0 - 12, y0 - 12, W + 24, H + 24, 14, 'rgba(10,15,28,.9)', C.line2, 2);
  for (let i = 1; i < SKW; i++) line(g, [[x0 + i * bs, y0], [x0 + i * bs, y0 + H]], C.line, 1.5, [3, 7]); for (let j = 1; j < SKH; j++) line(g, [[x0, y0 + j * bs], [x0 + W, y0 + j * bs]], C.line, 1.5, [3, 7]);
  rr(g, x0 - 30, y0 + H + 12, W + 60, 12, 6, C.fg3);
  for (let j = 0; j < SKH; j++) txt(g, String(j + 1), x0 - 34, cy(j) + bs / 2, C.fg3, fnt(500, 18, 'mono'), 'right');
  for (let x = 0; x < SKW; x++) for (let y = 0; y < SKH; y++) if (c[x][y] && !(o.pop && o.pop.x === x && o.pop.y === y)) skyBlock(g, x0 + x * bs, cy(y), bs, c[x][y], 1, o.hang && o.hang.has(x + ',' + y));
  if (o.pop) { const p = o.pop, e = SS(p.u), dx = p.side ? p.side * bs * .9 * (1 - e) : 0, dy = p.side ? 0 : -(1 - e) * (cy(p.y) - y0 + bs); skyBlock(g, x0 + p.x * bs + dx, cy(p.y) + dy, bs, p.v, CL(p.u * 3), !!p.side); if (p.u > .8 && p.u < 2) { g.save(); g.globalAlpha = CL(2 - p.u); g.strokeStyle = '#fff'; g.lineWidth = 4; g.strokeRect(x0 + p.x * bs + 2, cy(p.y) + 2, bs - 4, bs - 4); g.restore(); } }
  (o.ghost || []).forEach(q => { if (q.a <= 0) return; g.save(); g.globalAlpha = CL(q.a); const gx = x0 + q.x * bs, gy = cy(q.y); g.setLineDash([9, 7]); g.strokeStyle = q.ok ? C.ok : C.bad; g.lineWidth = 4; g.beginPath(); g.roundRect(gx + 6, gy + 6, bs - 12, bs - 12, 12); g.stroke(); g.setLineDash([]); if (q.ok) ticks(g, gx + bs / 2 - 15, gy + bs / 2, 1, C.ok); else cross(g, gx + bs / 2, gy + bs / 2, 1, C.bad, 14); if (q.lab) txt(g, q.lab, gx + bs / 2, gy - 18, q.ok ? C.ok : C.bad, fnt(700, 21), 'center'); g.restore(); });
  const tops = skyTops(c);
  for (let x = 0; x < SKW; x++) { if (!o.noLab) txt(g, `第${x + 1}列`, x0 + x * bs + bs / 2, y0 + H + 50, C.fg3, fnt(500, 19), 'center');
    if (o.tops > 0 && tops[x]) { g.save(); g.globalAlpha = CL(o.tops); rr(g, x0 + x * bs + 14, y0 + H + 72, bs - 28, 30, 15, PC[tops[x]]); g.restore(); }
    if (o.hiTop > 0 && tops[x]) { let y = SKH - 1; while (!c[x][y]) y--; g.save(); g.globalAlpha = CL(o.hiTop); g.strokeStyle = '#fff'; g.lineWidth = 5; g.strokeRect(x0 + x * bs + 3, cy(y) + 3, bs - 6, bs - 6); g.restore(); } } }
function skyScore(g, x, y, c) { const t = skyTops(c); txt(g, '蓝方', x, y, BL, fnt(700, 26)); txt(g, String(t.filter(v => v === 1).length), x + 80, y, BL, fnt(800, 64, 'mono')); txt(g, '橙方', x + 200, y, OR, fnt(700, 26)); txt(g, String(t.filter(v => v === 2).length), x + 280, y, OR, fnt(800, 64, 'mono')); txt(g, '列', x + 340, y + 8, C.fg3, fnt(600, 24)); }

AN.sky_rule = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, bs = 96, x0 = R.x + 130, y0 = R.y + 60, px = R.x + 950, pw = R.x + R.w - px - 40; let head, lines, at;
  if (st.k === 0) { const c = skyMk([[0, 0, 1], [0, 1, 2], [1, 0, 2], [1, 1, 1], [2, 0, 1], [2, 1, 1], [2, 2, 2], [3, 0, 2], [3, 1, 1], [4, 0, 1], [6, 0, 2], [6, 1, 2], [6, 2, 1]]);
    head = '天际线 · 玩法'; lines = ['一面墙：7 列，最高 6 层', '轮流放一块自己颜色的积木', '终局：每列最上面一块是谁的，', '这一列就归谁；列多者胜']; at = [.2, .38, .58, .7];
    drawWall(g, x0, y0, bs, c, { hiTop: (tk - .58 * d) / .5, tops: (tk - .7 * d) / .5 }); if (tk > .8 * d) fadeIn(g, (tk - .8 * d) / .5, () => skyScore(g, px + 40, R.y + 560, c));
  } else if (st.k === 1) { const c = skyMk([[1, 0, 1], [2, 0, 2], [2, 1, 1], [4, 0, 2]]);
    head = '放法一：有支撑'; lines = ['放在地面上', '或者任何一块积木的正上方', '（不管那一块是谁的）', '不能悬空']; at = [.3, .5, .72, .1];
    drawWall(g, x0, y0, bs, c, { ghost: [{ x: 5, y: 0, ok: 1, a: (tk - .3 * d) / .4 }, { x: 0, y: 0, ok: 1, a: (tk - .34 * d) / .4 }, { x: 2, y: 2, ok: 1, a: (tk - .5 * d) / .4 }, { x: 4, y: 1, ok: 1, a: (tk - .56 * d) / .4, lab: '压在对方上面也行' }, { x: 5, y: 3, ok: 0, a: (tk - .1 * d) / .4, lab: '悬空' }] });
  } else { const c = skyMk([[1, 0, 2], [2, 0, 1], [2, 1, 2], [2, 2, 1], [4, 0, 2], [5, 0, 1]]); const tp = .26 * d, t2 = .86 * d, o = { ghost: [], hang: new Set() };
    head = '放法二：悬挑'; lines = ['紧贴自己一块积木的侧面，悬在半空', '条件：那块积木的正下方是实的', '一步跳到旁边一列的高处', '别人可以在它上面继续盖']; at = [.08, .36, .58, .8];
    if (tk < tp) o.ghost.push({ x: 3, y: 2, ok: 1, a: (tk - .08 * d) / .4, lab: '悬挑' }); else { c[3][2] = 1; o.hang.add('3,2'); if (tk < tp + 1) o.pop = { x: 3, y: 2, v: 1, u: (tk - tp) / .5, side: -1 }; }
    if (tk > .38 * d && tk < .58 * d) o.ghost.push({ x: 4, y: 2, ok: 0, a: Math.min((tk - .38 * d) / .4, (.58 * d - tk) / .3), lab: '旁边那块下面是空的' });
    if (tk >= t2) { c[3][3] = 2; if (tk < t2 + 1) o.pop = { x: 3, y: 3, v: 2, u: (tk - t2) / .5 }; }
    o.hiTop = tk > .6 * d && tk < .8 * d ? Math.min((tk - .6 * d) / .4, (.8 * d - tk) / .3) : 0; drawWall(g, x0, y0, bs, c, o); }
  panel(g, px, R.y + 50, pw, 420, head);
  lines.forEach((l, i) => { const u = SS((tk - at[i] * d) / .5); if (u > 0) { g.save(); g.globalAlpha = u; txt(g, l, px + 40, R.y + 150 + i * 76, C.fg, fnt(600, 27)); g.restore(); } }); };

AN.sky_fix = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, bs = 70, x0 = R.x + 130, y0 = R.y + 120;
  txt(g, '下到填满：一共 42 格', x0 + 3.5 * bs, R.y + 50, C.fg, fnt(700, 30), 'center');
  for (let i = 0; i < 42; i++) { const u = SS((tk - .08 * d - i * .09) / .2); if (u <= 0) continue; const x = i % 7, y = Math.floor(i / 7), v = i % 2 + 1; g.save(); g.globalAlpha = u; rr(g, x0 + x * bs + 3, y0 + (5 - y) * bs + 3, bs - 6, bs - 6, 10, PC[v]); txt(g, String(i + 1), x0 + x * bs + bs / 2, y0 + (5 - y) * bs + bs / 2, '#0B1020', fnt(700, 22, 'mono'), 'center'); g.restore(); }
  if (tk > .3 * d) fadeIn(g, (tk - .3 * d) / .5, () => { g.strokeStyle = '#fff'; g.lineWidth = 5; g.strokeRect(x0 + 6 * bs, y0, bs, bs); txt(g, '第 42 块永远是后手的', x0 + 3.5 * bs, y0 + 6 * bs + 44, OR, fnt(700, 26), 'center'); });
  const px = R.x + 760, pw = R.x + R.w - px - 60; panel(g, px, R.y + 40, pw, 250, '填满为止：两个一样强的程序');
  wbar(g, px + 30, R.y + 150, pw - 60, '后手赢', 18, 20, (tk - .42 * d) / .8, C.bad); txt(g, '多想四倍也没用：6400 次 对 1600 次只赢 7/12', px + 30, R.y + 230, C.fg3, fnt(500, 21));
  const u = SS((tk - .66 * d) / .6); if (u <= 0) return; g.save(); g.globalAlpha = u; panel(g, px, R.y + 330, pw, 330, '改成：每人只有 15 块，放完即止');
  [1, 2].forEach((v, r) => { for (let i = 0; i < 15; i++) { const a = SS((tk - .7 * d - i * .05) / .2); g.globalAlpha = u * a; rr(g, px + 40 + i * 54, R.y + 420 + r * 70, 46, 46, 9, PC[v]); } });
  g.globalAlpha = u; txt(g, '30 块填不满 42 格，奇偶不再决定一切', px + 40, R.y + 610, C.fg2, fnt(500, 24)); g.restore(); };

// ---- 对局回放 ----
AN.sky_game = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, G = GD.sky, bs = 96, x0 = R.x + 130, y0 = R.y + 60;
  if (!G._c) { G._c = [skyMk([])]; G._hang = []; G.mv.forEach(([v, x, y], i) => { const p = G._c[i], c = p.map(col => col.slice()); const hang = y > 0 && !p[x][y - 1]; let side = 0; if (hang) side = (x > 0 && p[x - 1][y] === v && (y === 0 || p[x - 1][y - 1])) ? -1 : 1; c[x][y] = v; G._c.push(c); G._hang.push(side); }); }
  const rng = [[0, 8], [8, 19], [19, 30]][st.k], n = rng[1] - rng[0], a0 = .1 * d, slot = (.96 * d - a0) / n;
  let k = rng[0], f = 1; if (tk >= a0) { const u = Math.min(n - 1e-6, (tk - a0) / slot); k = rng[0] + Math.floor(u) + 1; f = u - Math.floor(u); if (tk >= .96 * d) { k = rng[1]; f = 1; } }
  const hang = new Set(); for (let i = 0; i < k; i++) if (G._hang[i]) hang.add(G.mv[i][1] + ',' + G.mv[i][2]);
  const o = { tops: 1, hang }; if (k > 0 && f < 1) { const [v, x, y] = G.mv[k - 1]; o.pop = { x, y, v, u: f * slot / .45, side: G._hang[k - 1] }; }
  drawWall(g, x0, y0, bs, G._c[k], o);
  const px = R.x + 950, pw = R.x + R.w - px - 40; panel(g, px, R.y + 50, pw, 700, '对局回放 · 程序自对弈');
  txt(g, k ? `第 ${k} 手 · ${PN[G.mv[k - 1][0]]}${G._hang[k - 1] ? ' · 悬挑' : ''}` : '开局', px + 40, R.y + 150, G._hang[k - 1] && k ? C.gold : C.fg2, fnt(600, 28)); skyScore(g, px + 40, R.y + 230, G._c[k]);
  txt(g, '剩余积木', px + 40, R.y + 330, C.fg3, fnt(500, 20)); [1, 2].forEach((v, r) => { const used = G.mv.slice(0, k).filter(m => m[0] === v).length; for (let i = 0; i < 15; i++) rr(g, px + 40 + i * 44, R.y + 356 + r * 46, 38, 38, 8, i < 15 - used ? PC[v] : 'rgba(255,255,255,.05)'); });
  const notes = [['蓝方在第 7 列连叠三块', '橙方在上面压一块，抢走这一列'], ['蓝方从第 3 列悬挑，拿下第 4 列', '橙方悬挑，蓝方压上去，再向左悬挑'], ['橙方压第 5 层，蓝方在第 6 层封顶', '终局 蓝方 4 列 : 橙方 3 列']][st.k];
  notes.forEach((s, i) => fadeIn(g, (tk - [.5, .78][i] * d) / .5, () => { dot(g, px + 50, R.y + 520 + i * 70, 6, C.gold); txt(g, s, px + 72, R.y + 520 + i * 70, C.fg, fnt(600, 25)); })); };

AN.sky_res = (g, t, R, st) => { const d = BTOF(st).d; resPanel(g, t, R, { name: '天际线（每人 15 块）', tiers: [['每步试 400 次 对 100 次', 17, 20], ['1600 次 对 400 次', 16, 20]], first: [6, 20, '后手略占优', C.bad],
  at: [.35 * d, .7 * d], notes: [['有明显的技巧', C.g, ['悬挑抢列、封顶的时机']], ['公平性待调', C.r, ['先手 20 局只赢 6 局']]] }); };
