// 珊瑚、危楼：画法和各段动画。
const CO = GGm.coral, TO = GGm.tower;
function plyEv(tk, d, evs) { let k = evs[0][2], f = 0; evs.forEach(([a, b, k0, k1]) => { if (tk >= a * d) { const r = plyAt(tk, a * d, b * d, k0, k1); k = r.k; f = r.f; } }); return { k, f }; }

// ---------- 珊瑚 ----------
// discs = [[x, y, 颜色号, 缩放, 闪圈透明度]]；o.cands = [[pts, 颜色, 透明度]]；o.R 场地半径（0 不画）
function coralDraw(g, cx, cy, sc, discs, o = {}) { const X = x => cx + x * sc, Y = y => cy + y * sc;
  if (o.R) { g.save(); g.beginPath(); g.arc(cx, cy, o.R * sc, 0, 7); g.fillStyle = 'rgba(10,15,28,.95)'; g.fill(); g.strokeStyle = C.line2; g.lineWidth = 3; g.stroke(); g.restore(); }
  (o.cands || []).forEach(([pts, col, a]) => { if (a <= 0) return; g.save(); g.globalAlpha = CL(a) * .8; g.setLineDash([7, 7]); g.strokeStyle = col; g.lineWidth = 2.5; pts.forEach(p => { g.beginPath(); g.arc(X(p[0]), Y(p[1]), sc * .3, 0, 7); g.stroke(); }); g.restore(); });
  discs.forEach(([x, y, v, s = 1, ring = 0, mix]) => { if (s <= 0) return; g.save(); g.globalAlpha *= .93; dot(g, X(x), Y(y), (sc - 2.5) * s, mix || PC[v]); g.globalAlpha *= .22; dot(g, X(x) - sc * .22 * s, Y(y) - sc * .25 * s, sc * .42 * s, '#fff'); g.restore(); if (ring > 0) { g.save(); g.globalAlpha = CL(ring); g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); g.arc(X(x), Y(y), sc - 2, 0, 7); g.stroke(); g.restore(); } }); }
const mixCol = (a, b, u) => { const h = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)), A = h(a), B = h(b); return `rgb(${A.map((v, i) => Math.round(LERP(v, B[i], u))).join(',')})`; };
function coralPlyDiscs(D, k, f) { const s0 = D.st[k]; if (k >= D.mv.length || f <= 0 || D.mv[k] < 0) return s0.x.map((x, i) => [x, s0.y[i], s0.own[i]]); const s1 = D.st[k + 1], n0 = s0.x.length, out = [];
  for (let i = 0; i < s1.x.length; i++) { if (i >= n0) { out.push([s1.x[i], s1.y[i], s0.tm, SS(f / .35), f < .5 ? 1 - f * 2 : 0]); continue; } const ch = s0.own[i] !== s1.own[i]; if (!ch) out.push([s1.x[i], s1.y[i], s1.own[i]]); else { const u = SS((f - .45) / .4); out.push([s1.x[i], s1.y[i], s1.own[i], 1, f > .4 ? 1 - CL((f - .8) / .2) : 0, mixCol(PC[s0.own[i]], PC[s1.own[i]], u)]); } } return out; }
const coralCnt = s => [CO.result ? s.own.filter(v => v === 1).length : 0, s.own.filter(v => v === 2).length];
// 不吃子的示范生长序列（讲“贴两个圆”用）
const CORAL0 = (() => { const save = CO.TH; CO.TH = 99; const s = CO.init(), st = [CO.clone(s)], cd = [CO.cands(s).slice()]; for (let i = 0; i < 16; i++) { const c = CO.cands(s); CO.play(s, (i * 5 + 1) % c.length); st.push(CO.clone(s)); cd.push(CO.cands(s).slice()); } CO.TH = save; return { st, cd, mv: new Array(16).fill(0) }; })();

AN.coral_rule = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, px = R.x + 900;
  if (st.k === 0) { const cx = R.x + 430, cy = R.y + 380, sc = 46, { k, f } = plyEv(tk, d, [[.46, .54, 0, 1], [.58, .66, 1, 2], [.82, .99, 2, 16]]);
    coralDraw(g, cx, cy, sc, coralPlyDiscs(CORAL0, k, f), { R: 7.4, cands: [[CORAL0.cd[k], PC[CORAL0.st[k].tm], f > 0 ? 0 : (tk - .36 * d) / .4]] });
    rulePanel(g, R, px, '珊瑚 · 玩法', ['场地中央：一蓝一橙两个圆', '轮流往群落上贴一个新的圆', '新圆必须同时贴住两个已有的圆', '（卡在它们之间的凹处）', '不能和别的圆重叠'], [.14, .3, .44, .6, .74], tk, d, 460);
    fadeIn(g, (tk - .38 * d) / .5, () => txt(g, '虚线小圈 = 现在可以贴的位置', px + 40, R.y + 570, C.fg3, fnt(500, 22)));
  } else { const cx = R.x + 430, cy = R.y + 380, sc = 78, h = 1.732, flip = SS((tk - .7 * d) / .6), placed = SS((tk - .12 * d) / .5);
    const discs = [[-2, 0, 1], [-1, -h, 1], [1, h, 2], [2, 0, 2], [0, 0, 2, 1, tk > .28 * d ? Math.min(1, (tk - .28 * d) / .4) : 0, flip > 0 ? mixCol(OR, BL, flip) : null]];
    if (placed > 0) discs.push([1, -h, 1, placed, tk < .28 * d ? 1 : 0]);
    coralDraw(g, cx, cy, sc, discs, { cands: [[[[1, -h]], BL, placed > 0 ? 0 : (tk - .02 * d) / .3]] });
    const X = x => cx + x * sc, Y = y => cy + y * sc, link = (p, col, a) => { if (a <= 0) return; g.save(); g.globalAlpha = CL(a); line(g, [[X(0), Y(0)], [X(p[0]), Y(p[1])]], col, 6); dot(g, X(p[0]), Y(p[1]), 9, col); g.restore(); };
    [[-2, 0], [-1, -h], [1, -h]].forEach((p, i) => link(p, '#0B1020', (tk - .4 * d - i * .15) / .3)); [[1, h], [2, 0]].forEach((p, i) => link(p, '#fff', (tk - .52 * d - i * .15) / .3));
    rulePanel(g, R, px, '珊瑚 · 吃子与胜负', ['新圆贴着的每一个对方的圆：', '它贴着你方的圆 ≥ 2 个', '并且比贴着的它自己一方的多', '→ 它变成你的颜色', '场地贴满后，圆多者胜'], [.2, .4, .52, .7, .84], tk, d, 460);
    fadeIn(g, (tk - .44 * d) / .4, () => { txt(g, '贴着蓝圆 3 个', px + 40, R.y + 570, BL, fnt(700, 28)); if (tk > .54 * d) txt(g, '贴着橙圆 2 个', px + 300, R.y + 570, OR, fnt(700, 28)); if (tk > .66 * d) txt(g, '3 > 2', px + 560, R.y + 570, C.fg, fnt(800, 30, 'mono')); }); } };

AN.coral_game = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, cx = R.x + 430, cy = R.y + 380, sc = 46, D = DEMO.coral, N = D.mv.length;
  const { k, f } = plyEv(tk, d, [[.12, .24, 0, 1], [.36, .5, 1, 2], [.6, .93, 2, N]]), kd = f > .7 ? k + 1 : k, sd = D.st[Math.min(N, kd)];
  coralDraw(g, cx, cy, sc, coralPlyDiscs(D, k, f), { R: 7.4 });
  const px = R.x + 900, pw = R.x + R.w - px - 40; panel(g, px, R.y + 30, pw, 720, '对局回放 · 程序自对弈');
  const cnt = (s, v) => s.own.filter(o => o === v).length;
  txt(g, kd ? `第 ${kd} 手 · ${PN[kd % 2 ? 1 : 2]}${D.mv[kd - 1] < 0 ? '无处可贴' : ''}` : '开局', px + 40, R.y + 116, C.fg2, fnt(600, 28)); score2(g, px + 40, R.y + 190, cnt(sd, 1), cnt(sd, 2), '个圆');
  miniChart(g, px + 70, R.y + 330, pw - 130, 300, [[i => cnt(D.st[i], 1), BL], [i => cnt(D.st[i], 2), OR]], N, Math.min(N, kd), 24, '圆的个数');
  if (kd === 2 || kd === 1) chip(g, kd === 1 ? '蓝方的圆夹在两个种子中间' : '橙方贴上一个，把它吃掉：1 比 3', px + 40, R.y + 700, C.gold); if (kd >= N) chip(g, '终局 11 : 23，橙方获胜', px + 40, R.y + 700, C.gold); };

AN.coral_res = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, x = R.x + 60, y = R.y + 30, w = 900;
  panel(g, x, y, w, 700, '珊瑚 · 测量结果'); txt(g, '双方一样强，各下 20 局：先手赢了多少局（虚线 = 一半）', x + 24, y + 86, C.fg3, fnt(500, 21));
  [['默认开局', 0, '后手 20 局全胜'], ['开局二', 20, ''], ['开局三', 0, ''], ['开局四', 20, ''], ['开局五', 3, '另有 4 局平局']].forEach(([lab, wn, note], i) => wbar(g, x + 24, y + 140 + i * 70, w - 48, lab, wn, 20, (tk - (i ? .22 : .08) * d - i * .25) / .8, wn > 10 ? BL : OR, note));
  txt(g, '多想四倍的一方赢了多少局', x + 24, y + 520, C.fg3, fnt(500, 21)); wbar(g, x + 24, y + 572, w - 48, '两种吃子门槛', 12, 20, (tk - .5 * d) / .8, C.bad, '另一种是 10/20：和没多想差不多');
  const nx = x + w + 50, nw = R.x + R.w - nx - 60;
  card(g, nx, y, nw, 250, '不成立', ['胜负在开局摆好的时候就定了', '和下得好不好关系不大'], C.bad, SS((tk - .66 * d) / .6), false, 24);
  card(g, nx, y + 280, nw, 250, '更早的版本更糟', ['全场同时变色：', '六手之内，一方被吃光'], C.r, SS((tk - .8 * d) / .6), false, 24); };

// ---------- 危楼 ----------
// b: Int8Array(7*17)；o.pop={i,u}；o.brk=[idx]（打红叉）；o.fade={list, a}；o.loads=false 不写数字；o.ring=idx
function towerDraw(g, x0, gy, hw, bh, b, o = {}) { const ld = TO.loads(b), XY = i => [x0 + (i % 17) * hw, gy - (Math.floor(i / 17) + 1) * bh];
  rr(g, x0 - 16, gy, 16 * hw + 32, 12, 6, C.fg3);
  const brick = (i, v, a = 1, dy = 0) => { const [X, Y] = XY(i); g.save(); g.globalAlpha *= a; rr(g, X + 3, Y + 3 + dy, 2 * hw - 6, bh - 6, 11, PC[v]); g.globalAlpha *= .25; rr(g, X + 9, Y + 9 + dy, 2 * hw - 18, (bh - 18) * .32, 7, '#fff'); g.restore(); };
  if (o.fade) o.fade.list.forEach(([i, v]) => brick(i, v, CL(o.fade.a), (1 - CL(o.fade.a)) * bh * 1.2));
  for (let i = 0; i < b.length; i++) if (b[i]) { const [X, Y] = XY(i), isPop = o.pop && o.pop.i === i, e = isPop ? SS(o.pop.u) : 1; brick(i, b[i], isPop ? CL(o.pop.u * 3) : 1, isPop ? -(1 - e) * bh * 1.5 : 0);
    if (o.loads !== false && ld[i] > 0 && e >= 1) { const v = ld[i], hot = v > TO.K + 1e-9, warm = v >= 2.5; txt(g, String(Math.round(v * 100) / 100), X + hw, Y + bh / 2 + 6, hot ? '#8B0000' : warm ? '#5A2A00' : 'rgba(11,16,32,.72)', fnt(800, warm ? 27 : 23, 'mono'), 'center'); }
    if (o.brk && o.brk.includes(i)) { g.save(); g.strokeStyle = C.bad; g.lineWidth = 5; g.strokeRect(X + 2, Y + 2, 2 * hw - 4, bh - 4); g.restore(); cross(g, X + hw, Y + bh / 2, 1, '#B00020', 22); }
    if (o.ring === i) { g.save(); g.globalAlpha = CL(o.ringA ?? 1); g.strokeStyle = '#fff'; g.lineWidth = 4; g.strokeRect(X + 1, Y + 1, 2 * hw - 2, bh - 2); g.restore(); } } }
// 一手的各个阶段：返回 {b, pop, brk, fade}
function towerPhase(D, k, f) { if (k >= D.mv.length || f <= 0) return { b: D.st[k].b }; const m = D.mv[k], rec = D.rec[k + 1], fin = D.st[k + 1].b; if (m < 0) return { b: fin };
  if (!rec.length) return { b: fin, pop: { i: m, u: f / .6 } };
  const t0 = .1; if (f < t0) return { b: rec[0].b, pop: { i: m, u: f / t0 * 1.2 } };
  const nw = rec.length, u = (f - t0) / (1 - t0) * nw, wi = Math.min(nw - 1, Math.floor(u)), wf = u - wi, cur = rec[wi].b, nxt = wi + 1 < nw ? rec[wi + 1].b : fin;
  if (wf < .55) return { b: cur, brk: rec[wi].brk }; const list = []; for (let i = 0; i < cur.length; i++) if (cur[i] && !nxt[i]) list.push([i, cur[i]]); return { b: nxt, fade: { list, a: 1 - (wf - .55) / .45 } }; }
const towerCnt = (b, v) => { let n = 0; for (let i = 0; i < b.length; i++) if (b[i] === v) n++; return n; };

AN.tower_rule = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, hw = 50, bh = 84, x0 = R.x + 50, gy = R.y + 680, px = R.x + 940, D = DEMO.tower;
  if (st.k === 0) { const { k, f } = plyEv(tk, d, [[.12, .66, 0, 14]]); towerDraw(g, x0, gy, hw, bh, towerPhase(D, k, f).b, { ...towerPhase(D, k, f), loads: false });
    rulePanel(g, R, px, '危楼 · 玩法', ['双方往同一面墙上砌砖', '砖一层一层错缝叠放', '每块砖压在下面的一块或两块砖上', '每人 16 块砖', '放完后，墙上剩下的砖多者胜'], [.1, .22, .4, .64, .76], tk, d, 460);
  } else { const I = (r, x) => r * 17 + x, b = new Int8Array(7 * 17), steps = [[-9, I(0, 0), 1], [-9, I(0, 2), 2], [.08, I(1, 1), 1], [.2, I(2, 2), 2], [-9, I(0, 10), 2], [.3, I(1, 11), 1], [.37, I(2, 10), 2], [.44, I(3, 11), 1], [.58, I(4, 10), 2]];
    let pop = null; const tb = .68 * d, tf = .8 * d; steps.forEach(([at, i, v]) => { if (tk >= at * d) { b[i] = v; if (tk < at * d + .5) pop = { i, u: (tk - at * d) / .4 }; } });
    const o = { pop }; if (tk >= tb && tk < tf) o.brk = [I(0, 10)]; if (tk >= tf) { const list = [[I(0, 10), 2], [I(1, 11), 1], [I(2, 10), 2], [I(3, 11), 1], [I(4, 10), 2]]; list.forEach(([i]) => b[i] = 0); o.fade = { list, a: 1 - (tk - tf) / 1 }; }
    towerDraw(g, x0, gy, hw, bh, b, o);
    fadeIn(g, Math.min((tk - .12 * d) / .4, (.3 * d - tk) / .3 + 1), () => txt(g, '压在两块砖上：平分', x0 + 2 * hw, gy - 3 * bh - 30, C.fg2, fnt(600, 22), 'center'));
    fadeIn(g, Math.min((tk - .32 * d) / .4, (.66 * d - tk) / .3 + 1), () => txt(g, '只压在一块砖上：全给它', x0 + 12 * hw + 20, gy - 5 * bh - 30, C.fg2, fnt(600, 22), 'center'));
    rulePanel(g, R, px, '危楼 · 承重', ['每块砖重 1 份', '自己的重量 + 身上的压力，', '平分给下面托着它的砖', '压力超过 3：碎掉', '失去全部支撑的砖跟着掉，再重算'], [.06, .2, .26, .64, .8], tk, d, 460); } };

AN.tower_game = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, hw = 50, bh = 84, x0 = R.x + 50, gy = R.y + 680, D = DEMO.tower;
  const { k, f } = plyEv(tk, d, [[.03, .24, 0, 24], [.5, .92, 24, 25]]), ph = towerPhase(D, k, f), kd = f > (k === 24 ? .97 : .5) ? k + 1 : k, sd = D.st[kd].b;
  if (k === 24 && f <= 0 && tk > .3 * d && tk < .5 * d) { const ld = TO.loads(ph.b); let bi = 0; for (let i = 0; i < 17; i++) if (ld[i] > ld[bi]) bi = i; ph.ring = bi; ph.ringA = (tk - .3 * d) / .4; }
  towerDraw(g, x0, gy, hw, bh, ph.b, ph);
  const px = R.x + 940, pw = R.x + R.w - px - 40; panel(g, px, R.y + 30, pw, 720, '对局回放 · 程序自对弈');
  txt(g, kd ? `第 ${kd} 手 · ${PN[kd % 2 ? 1 : 2]}` : '开局', px + 40, R.y + 116, C.fg2, fnt(600, 28)); score2(g, px + 40, R.y + 190, towerCnt(sd, 1), towerCnt(sd, 2), '块砖');
  miniChart(g, px + 70, R.y + 330, pw - 130, 280, [[i => towerCnt(D.st[i].b, 1), BL], [i => towerCnt(D.st[i].b, 2), OR]], D.mv.length, kd, 14, '墙上的砖数');
  if (k === 24 && f > .1 && f < .97) { const rec = D.rec[25], wi = Math.min(rec.length - 1, Math.floor((f - .1) / .9 * rec.length)); chip(g, `第 ${wi + 1} 轮垮塌`, px + 40, R.y + 690, C.bad); }
  if (kd >= 25) chip(g, '12 : 12 → 4 : 6', px + 40, R.y + 690, C.gold);
  if (ph.ring !== undefined) fadeIn(g, ph.ringA, () => chip(g, '底层这块砖的压力：2.75', px + 40, R.y + 690, C.gold)); };

AN.tower_res = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, x = R.x + 60, y = R.y + 30, w = 900;
  panel(g, x, y, w, 700, '危楼 · 测量结果'); txt(g, '双方一样强，各下 30 局', x + 24, y + 86, C.fg3, fnt(500, 21));
  wbar(g, x + 24, y + 140, w - 48, '后手赢', 17, 30, (tk - .34 * d) / .8, OR); wbar(g, x + 24, y + 210, w - 48, '平局', 12, 30, (tk - .4 * d) / .8, C.fg3); wbar(g, x + 24, y + 280, w - 48, '先手赢', 1, 30, (tk - .46 * d) / .8, BL);
  txt(g, '让后手少拿一块砖（先手放最后一块）', x + 24, y + 380, C.fg3, fnt(500, 21)); wbar(g, x + 24, y + 432, w - 48, '先手赢', 24, 30, (tk - .62 * d) / .8, BL);
  txt(g, '多想四倍的一方赢了多少局', x + 24, y + 530, C.fg3, fnt(500, 21)); wbar(g, x + 24, y + 582, w - 48, '每步 400 对 100', 10, 20, (tk - .2 * d) / .8, C.bad, '另有 5 局平局');
  const nx = x + w + 50, nw = R.x + R.w - nx - 60;
  card(g, nx, y, nw, 250, '麻烦在哪', ['一次垮塌能毁掉大半面墙', '前面砌得好不好都不算数'], C.r, SS((tk - .04 * d) / .6), false, 24);
  card(g, nx, y + 280, nw, 250, '不成立', ['最后谁动手，谁说了算', '胜负跟着“谁放最后一块”走'], C.bad, SS((tk - .84 * d) / .6), false, 24); };
