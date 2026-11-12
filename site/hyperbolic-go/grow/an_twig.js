// 公共：演示对局重放；枝战的画法和各段动画。
const GGm = window.GG, DEMO = {};
['twig', 'coral', 'flow', 'tower'].forEach(k => { const G = GGm[k], s = G.init(), stt = [G.clone(s)], rec = [[]]; GD[k].forEach(m => { const r = []; G.play(s, m, r); stt.push(G.clone(s)); rec.push(r); }); DEMO[k] = { mv: GD[k], st: stt, rec }; });
function score2(g, x, y, a, b, unit) { txt(g, '蓝方', x, y, BL, fnt(700, 26)); txt(g, String(a), x + 76, y, BL, fnt(800, 60, 'mono')); txt(g, '橙方', x + 250, y, OR, fnt(700, 26)); txt(g, String(b), x + 326, y, OR, fnt(800, 60, 'mono')); if (unit) txt(g, unit, x + 480, y + 8, C.fg3, fnt(600, 24)); }
// 回放进度：tk 在 [t0,t1] 内从第 k0 手走到第 k1 手；返回已完成手数 k 和下一手的进度 f
function plyAt(tk, t0, t1, k0, k1) { if (tk <= t0) return { k: k0, f: 0 }; const u = CL((tk - t0) / (t1 - t0)) * (k1 - k0), k = Math.min(k1, k0 + Math.floor(u)); return { k, f: k >= k1 ? 0 : u - Math.floor(u) }; }
function rulePanel(g, R, px, head, lines, at, tk, d, h = 420, fs = 27) { const pw = R.x + R.w - px - 40; panel(g, px, R.y + 50, pw, h, head); lines.forEach((l, i) => { const u = SS((tk - at[i] * d) / .5); if (u > 0) { g.save(); g.globalAlpha = u; txt(g, l, px + 40, R.y + 150 + i * 70, C.fg, fnt(600, fs)); g.restore(); } }); return pw; }
function miniChart(g, gx, gy, gw, gh, series, n, kd, ymax, lab) { rr(g, gx, gy, gw, gh, 8, 'rgba(255,255,255,.03)', C.line, 1.5); txt(g, lab, gx, gy - 20, C.fg3, fnt(500, 18)); txt(g, String(ymax), gx - 10, gy, C.fg3, fnt(500, 17, 'mono'), 'right'); txt(g, '0', gx - 10, gy + gh, C.fg3, fnt(500, 17, 'mono'), 'right'); txt(g, '手数 ' + n, gx + gw, gy + gh + 22, C.fg3, fnt(500, 17), 'right');
  series.forEach(([fn, col]) => { const pts = []; for (let i = 0; i <= kd; i++) pts.push([gx + i / n * gw, gy + gh - Math.min(ymax, fn(i)) / ymax * gh]); if (pts.length > 1) line(g, pts, col, 3.5); const p = pts[pts.length - 1]; dot(g, p[0], p[1], 6, col); }); }

// ---------- 枝战 ----------
const TW = GGm.twig;
function twigCands(s, v) { const save = s.tm; s.tm = v; const out = []; for (let p = 0; p < s.x.length; p++) if (s.alive[p] && s.own[p] === v) for (let dd = 0; dd < TW.ND; dd++) { const r = TW.check(s, p, dd); if (r) out.push([r.x, r.y]); } s.tm = save; return out; }
(() => { const D = DEMO.twig; D.cand = D.st.map(s => [null, twigCands(s, 1), twigCands(s, 2)]); })();
// o.f 最后一个节点的生长进度；o.cand = [[pts, 颜色, 透明度]]；o.field=false 不画场地
function twigDraw(g, cx, cy, sc, s, o = {}) { const n = s.x.length, X = x => cx + x * sc, Y = y => cy + y * sc, f = o.f === undefined ? 1 : SS(o.f), k = sc / 74;
  if (o.field !== false) { g.save(); g.beginPath(); g.arc(cx, cy, TW.R * sc + 14 * k, 0, 7); g.fillStyle = 'rgba(10,15,28,.95)'; g.fill(); g.strokeStyle = C.line2; g.lineWidth = 3; g.stroke(); g.restore(); }
  (o.cand || []).forEach(([pts, col, a]) => { if (a <= 0) return; g.save(); g.globalAlpha = CL(a) * .55; pts.forEach(p => dot(g, X(p[0]), Y(p[1]), 4.5 * k, col)); g.restore(); });
  const pos = i => { if (i === n - 1 && f < 1 && s.par[i] >= 0) { const p = s.par[i]; return [LERP(s.x[p], s.x[i], f), LERP(s.y[p], s.y[i], f)]; } return [s.x[i], s.y[i]]; };
  for (let i = 0; i < n; i++) if (s.alive[i] && s.par[i] >= 0) { const q = pos(i); line(g, [[X(s.x[s.par[i]]), Y(s.y[s.par[i]])], [X(q[0]), Y(q[1])]], PC[s.own[i]], 7 * k); }
  for (let i = 0; i < n; i++) if (s.alive[i]) { const q = pos(i), root = s.par[i] < 0; dot(g, X(q[0]), Y(q[1]), (root ? 16 : 9.5) * k, PC[s.own[i]]); if (root) { g.strokeStyle = '#fff'; g.lineWidth = 3 * k; g.beginPath(); g.arc(X(q[0]), Y(q[1]), 16 * k, 0, 7); g.stroke(); } }
  if (o.last && n > 2) { const q = pos(n - 1); g.strokeStyle = '#fff'; g.lineWidth = 2.5; g.beginPath(); g.arc(X(q[0]), Y(q[1]), 15 * k, 0, 7); g.stroke(); } }
function twigPly(g, cx, cy, sc, k, f, o = {}) { const D = DEMO.twig, grew = k < D.mv.length && f > 0 && D.mv[k] >= 0; twigDraw(g, cx, cy, sc, grew ? D.st[k + 1] : D.st[k], { ...o, f: grew ? f / .7 : 1, last: true }); }

AN.twig_rule = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, sc = 74, cx = R.x + 420, cy = R.y + 380, px = R.x + 880, D = DEMO.twig, X = x => cx + x * sc, Y = y => cy + y * sc;
  if (st.k === 0) { const { k, f } = plyAt(tk, .66 * d, .97 * d, 0, 4); twigPly(g, cx, cy, sc, k, f);
    // 十个方向
    const a = Math.min(SS((tk - .42 * d) / .5), 1 - SS((tk - .66 * d) / .4)); if (a > 0) { g.save(); g.globalAlpha = a; for (let i = 0; i < 10; i++) { const an = i * Math.PI / 5, x1 = X(-2.6 + Math.cos(an)), y1 = Y(Math.sin(an)); line(g, [[X(-2.6), Y(0)], [x1, y1]], BL, 3, [7, 7]); dot(g, x1, y1, 7, BL); } g.restore(); }
    fadeIn(g, Math.min((tk - .2 * d) / .5, (.66 * d - tk) / .4 + 1), () => { txt(g, '蓝方的根', X(-2.6), Y(0) + 52, BL, fnt(600, 22), 'center'); txt(g, '橙方的根', X(2.6), Y(0) + 52, OR, fnt(600, 22), 'center'); });
    rulePanel(g, R, px, '枝战 · 玩法', ['圆形场地，没有格子', '双方各有一个根', '每一手：从自己任意一个节点出发', '朝 10 个方向之一，长出一段新枝', '枝的末端是一个新节点'], [.08, .2, .36, .52, .86], tk, d, 460);
  } else { const K = 24, s = D.st[K]; twigDraw(g, cx, cy, sc, s, { cand: [[D.cand[K][1], BL, (tk - .5 * d) / .5], [D.cand[K][2], OR, (tk - .56 * d) / .5]] });
    // 找两个不合法的例子：太近、穿过
    if (!D.bad) { D.bad = {}; for (let p = 0; p < s.x.length; p++) if (s.own[p] === 1) for (let dd = 0; dd < 10; dd++) { const an = dd * Math.PI / 5, qx = s.x[p] + Math.cos(an), qy = s.y[p] + Math.sin(an); if (qx * qx + qy * qy > TW.R * TW.R || TW.check(s, p, dd)) continue; let crossI = -1; for (let c = 0; c < s.x.length; c++) { const b = s.par[c]; if (b < 0 || b === p || c === p) continue; const ax = s.x[b], ay = s.y[b], bx = s.x[c] - ax, by = s.y[c] - ay, rx = qx - s.x[p], ry = qy - s.y[p], den = rx * by - ry * bx; if (Math.abs(den) < 1e-9) continue; const tt = ((ax - s.x[p]) * by - (ay - s.y[p]) * bx) / den, uu = ((ax - s.x[p]) * ry - (ay - s.y[p]) * rx) / den; if (tt > .05 && tt < .95 && uu > .05 && uu < .95) crossI = c; }
        if (crossI >= 0 && (s.own[crossI] === 2 || !D.bad.cross)) D.bad.cross = [p, qx, qy]; else if (crossI < 0 && !D.bad.near) D.bad.near = [p, qx, qy]; } }
    if (!D.bad.cross2) { let best = 9; for (let p = 0; p < s.x.length; p++) if (s.own[p] === 1) for (let c = 0; c < s.x.length; c++) if (s.own[c] === 2 && s.par[c] >= 0) { const mx = (s.x[c] + s.x[s.par[c]]) / 2, my = (s.y[c] + s.y[s.par[c]]) / 2, dd = Math.hypot(mx - s.x[p], my - s.y[p]); if (dd < best) { best = dd; const L = Math.max(1, dd + .3); D.bad.cross2 = [p, s.x[p] + (mx - s.x[p]) / dd * L, s.y[p] + (my - s.y[p]) / dd * L, dd]; } } D.bad.cross = D.bad.cross2; }
    const ghost = (b, a, lab) => { if (!b || a <= 0) return; g.save(); g.globalAlpha = CL(a); line(g, [[X(s.x[b[0]]), Y(s.y[b[0]])], [X(b[1]), Y(b[2])]], '#fff', 4, [8, 7]); g.strokeStyle = C.bad; g.lineWidth = 3; g.beginPath(); g.arc(X(b[1]), Y(b[2]), 12, 0, 7); g.stroke(); cross(g, X(b[1]), Y(b[2]), 1, C.bad, 20); g.font = fnt(700, 22); const w = g.measureText(lab).width + 24; rr(g, X(b[1]) - w / 2, Y(b[2]) - 62, w, 36, 10, 'rgba(14,20,36,.95)', C.bad, 2); txt(g, lab, X(b[1]), Y(b[2]) - 44, C.bad, fnt(700, 22), 'center'); g.restore(); };
    ghost(D.bad.near, Math.min((tk - .06 * d) / .4, (.24 * d - tk) / .3), '离已有节点太近'); ghost(D.bad.cross, Math.min((tk - .2 * d) / .4, (.44 * d - tk) / .3), '不能穿过已有的枝');
    const pw = rulePanel(g, R, px, '枝战 · 限制与胜负', ['新节点不能离已有节点太近', '新枝不能穿过已有的枝', '长出来的枝就是墙', '无处可长：停手', '都无处可长时，节点多者胜'], [.06, .2, .36, .56, .78], tk, d, 460);
    fadeIn(g, (tk - .5 * d) / .5, () => { txt(g, '小点 = 现在可以长到的位置', px + 40, R.y + 560, C.fg3, fnt(500, 22)); dot(g, px + 60, R.y + 610, 6, BL); txt(g, `蓝方 ${D.cand[K][1].length} 个`, px + 80, R.y + 610, BL, fnt(600, 24)); dot(g, px + 260, R.y + 610, 6, OR); txt(g, `橙方 ${D.cand[K][2].length} 个`, px + 280, R.y + 610, OR, fnt(600, 24)); }); } };

AN.twig_cut = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk;
  if (st.k === 0) { // 设想中的切断（示意图，不按比例）
    const x0 = R.x + 90, y0 = R.y + 90, u = 120, P = (x, y) => [x0 + x * u, y0 + y * u];
    panel(g, R.x + 40, R.y + 30, 900, 700, '设想中的切断（示意）');
    const O = [[6.3, 2.6], [5.3, 2.6], [4.3, 2.6], [3.3, 2.6], [2.3, 2.6], [1.5, 2.0], [1.5, 3.3]], OP = [-1, 0, 1, 2, 3, 4, 4];   // 橙方一条长枝
    const B = [[3.2, 4.9], [3.0, 3.9], [3.9, 3.7], [2.2, 4.2]], BP = [-1, 0, 0, 0], tc = .55 * d, cut = tk > tc, dead = SS((tk - tc - .4) / 1.2);
    O.forEach((p, i) => { if (OP[i] < 0) return; const isDead = cut && i >= 4; g.save(); if (isDead) g.globalAlpha = 1 - dead * .85; line(g, [P(...O[OP[i]]), P(...p)], isDead ? LERPC(dead) : OR, 8); g.restore(); });
    O.forEach((p, i) => { const isDead = cut && i >= 4; g.save(); if (isDead) g.globalAlpha = 1 - dead * .85; dot(g, ...P(...p), i ? 12 : 18, isDead ? LERPC(dead) : OR); g.restore(); });
    B.forEach((p, i) => { if (BP[i] >= 0) line(g, [P(...B[BP[i]]), P(...p)], BL, 8); }); B.forEach((p, i) => dot(g, ...P(...p), i ? 12 : 18, BL));
    const X = [2.85, 2.6], a = SS((tk - .28 * d) / .5); if (a > 0) { g.save(); g.globalAlpha = a * (cut ? 1 - SS((tk - tc - 1) / .8) : 1); g.setLineDash([8, 8]); g.strokeStyle = '#fff'; g.lineWidth = 2.5; g.beginPath(); g.arc(...P(...X), 1.75 * u, 0, 7); g.stroke(); g.setLineDash([]); txt(g, '交叉点附近：蓝 3 个节点，橙 2 个', P(...X)[0] + 60, P(...X)[1] - 1.75 * u - 26, C.fg, fnt(600, 23), 'center'); g.restore(); }
    const Q = [2.7, 1.6], gu = SS((tk - tc) / .6); if (tk > .4 * d && !cut) fadeIn(g, (tk - .4 * d) / .4, () => { line(g, [P(...B[1]), P(...Q)], BL, 4, [9, 8]); g.strokeStyle = BL; g.lineWidth = 3; g.beginPath(); g.arc(...P(...Q), 13, 0, 7); g.stroke(); });
    if (cut) { const e = [LERP(B[1][0], Q[0], gu), LERP(B[1][1], Q[1], gu)]; line(g, [P(...B[1]), P(...e)], BL, 8); dot(g, ...P(...e), 12, BL); }
    if (cut) fadeIn(g, (tk - tc - .5) / .5, () => txt(g, '被切断的一截枯死', P(1.3, 0)[0], P(0, 1.35)[1], C.bad, fnt(700, 24), 'center'));
    card(g, R.x + 990, R.y + 30, R.w - 1030, 330, '切断规则（最初的设计）', ['交叉点附近，你的节点比对方多', '→ 新枝可以穿过对方的枝', '→ 连不回根的那一截全部枯死'], C.gold, SS((tk - .1 * d) / .6), false, 25);
    fadeIn(g, (tk - .82 * d) / .5, () => txt(g, '听起来应该是重头戏……', R.x + 990, R.y + 440, C.fg2, fnt(600, 30)));
  } else { // 为什么用不上：两头总有一头太近
    const cx = R.x + 480, cy = R.y + 330, u = 300, A = [cx - u / 2, cy], B = [cx + u / 2, cy], rad = .8 * u;
    panel(g, R.x + 40, R.y + 30, 900, 700, '为什么穿不过去');
    g.save(); g.beginPath(); g.rect(R.x + 42, R.y + 80, 896, 648); g.clip();
    [A, B].forEach(p => { g.save(); g.globalAlpha = SS((tk - .08 * d) / .5) * .9; g.fillStyle = 'rgba(255,107,107,.10)'; g.beginPath(); g.arc(p[0], p[1], rad, 0, 7); g.fill(); g.setLineDash([8, 8]); g.strokeStyle = C.bad; g.lineWidth = 2.5; g.stroke(); g.restore(); });
    line(g, [A, B], OR, 9); dot(g, ...A, 14, OR); dot(g, ...B, 14, OR);
    // 一段想穿过去的蓝枝，绕着中点转
    const an = -Math.PI / 2 + Math.sin(tk * .9) * .9, off = Math.sin(tk * .6) * .12 * u, mx = cx + off, my = cy, p1 = [mx - Math.cos(an) * u * .5, my - Math.sin(an) * u * .5], p2 = [mx + Math.cos(an) * u * .5, my + Math.sin(an) * u * .5];
    fadeIn(g, (tk - .16 * d) / .5, () => { line(g, [p1, p2], BL, 7, [10, 8]); [p1, p2].forEach(p => { const near = Math.min(Math.hypot(p[0] - A[0], p[1] - A[1]), Math.hypot(p[0] - B[0], p[1] - B[1])) < rad; dot(g, p[0], p[1], 12, BL); if (near) cross(g, p[0], p[1], 1, C.bad, 18); }); });
    g.restore();
    fadeIn(g, (tk - .08 * d) / .5, () => { txt(g, '红圈：对方节点周围，不许落新节点的范围', cx, R.y + 650, C.fg2, fnt(500, 22), 'center'); txt(g, '枝长 1，间距至少 0.8：两个端点总有一个落在红圈里', cx, R.y + 690, C.fg, fnt(600, 23), 'center'); });
    const x = R.x + 990, w = R.w - 1030; panel(g, x, R.y + 30, w, 700, '实测');
    const rows = [['间距 0.6 的早期版本', '36 局，切断 1 次', C.gold, .36], ['现在的间距 0.8', '切断 0 次（几何上不可能）', C.bad, .52], ['有切断规则', '多想四倍 20/20，先手 9/20', C.fg, .66], ['去掉切断规则', '多想四倍 20/20，先手 11/20', C.fg, .72]];
    rows.forEach(([a, b, col, at], i) => fadeIn(g, (tk - at * d) / .5, () => { txt(g, a, x + 36, R.y + 130 + i * 110, C.fg2, fnt(600, 24)); txt(g, b, x + 36, R.y + 172 + i * 110, col, fnt(700, 27)); }));
    fadeIn(g, (tk - .86 * d) / .5, () => { rr(g, x + 24, R.y + 590, w - 48, 110, 14, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '切断是多余的', x + w / 2, R.y + 628, C.gold, fnt(800, 30), 'center'); txt(g, '真正的内容：抢空间', x + w / 2, R.y + 672, C.fg, fnt(700, 27), 'center'); }); } };
function LERPC(u) { const a = [255, 178, 92], b = [102, 114, 140]; return `rgb(${a.map((v, i) => Math.round(LERP(v, b[i], u))).join(',')})`; }

AN.twig_game = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, sc = 74, cx = R.x + 420, cy = R.y + 380, D = DEMO.twig, N = D.mv.length;
  const seg = [[0, 10, .12, .9], [10, 30, .04, .5], [30, N, .04, .86]][st.k], { k, f } = plyAt(tk, seg[2] * d, seg[3] * d, seg[0], seg[1]);
  const kd = f >= .7 ? Math.min(N, k + 1) : k;
  twigPly(g, cx, cy, sc, k, f, { cand: [[D.cand[kd][1], BL, 1], [D.cand[kd][2], OR, 1]] });
  const px = R.x + 880, pw = R.x + R.w - px - 40; panel(g, px, R.y + 30, pw, 720, '对局回放 · 程序自对弈');
  const s = D.st[kd], pass = kd > 0 && D.mv[kd - 1] < 0;
  txt(g, kd ? `第 ${kd} 手 · ${PN[kd % 2 ? 1 : 2]}${pass ? '停手' : ''}` : '开局', px + 40, R.y + 116, C.fg2, fnt(600, 28)); score2(g, px + 40, R.y + 190, TW.count(s, 1), TW.count(s, 2), '个节点');
  // 还能长的位置
  txt(g, '还能长的位置（小点）', px + 40, R.y + 270, C.fg3, fnt(500, 21));
  [1, 2].forEach(v => { const n = D.cand[kd][v].length, y = R.y + 320 + (v - 1) * 54; txt(g, PN[v], px + 40, y, PC[v], fnt(600, 24)); rr(g, px + 130, y - 13, 520, 26, 13, 'rgba(255,255,255,.06)'); if (n) rr(g, px + 130, y - 13, Math.max(26, 520 * Math.min(1, n / 32)), 26, 13, PC[v]); txt(g, String(n), px + 670, y, C.fg, fnt(700, 26, 'mono')); });
  miniChart(g, px + 70, R.y + 460, pw - 130, 230, [[i => D.cand[i][1].length, BL], [i => D.cand[i][2].length, OR]], N, kd, 32, '还能长的位置数');
  if (st.k === 2 && kd >= N) fadeIn(g, (tk - .88 * d) / .5, () => chip(g, '终局 26 : 35，橙方获胜', px + 40, R.y + 712, C.gold));
  if (st.k === 1 && tk > .5 * d) fadeIn(g, Math.min((tk - .5 * d) / .5, (.8 * d - tk) / .5), () => { const s2 = D.st[30]; g.save(); g.strokeStyle = '#fff'; g.lineWidth = 3; g.setLineDash([10, 8]); const idx = []; for (let i = 0; i < s2.x.length; i++) if (s2.own[i] === 2 && s2.y[i] < -.8 && s2.x[i] < .5) idx.push(i); if (idx.length) { const xs = idx.map(i => s2.x[i]), ys = idx.map(i => s2.y[i]); g.beginPath(); g.ellipse(cx + (Math.min(...xs) + Math.max(...xs)) / 2 * sc, cy + (Math.min(...ys) + Math.max(...ys)) / 2 * sc, (Math.max(...xs) - Math.min(...xs)) / 2 * sc + 40, (Math.max(...ys) - Math.min(...ys)) / 2 * sc + 36, 0, 0, 7); g.stroke(); } g.restore(); }); };

AN.twig_res = (g, t, R, st) => resPanel(g, st.tk, R, { name: '枝战', tiers: [['每步 400 对 100 次', 20, 20, '多想四倍的一方 20 局全胜'], ['每步 1600 对 400 次', 11, 12, '']], first: [9, 20, '另有 1 局平局'],
  notes: [['成立', C.g, ['四个里唯一明确成立的', '强弱分明，先后手基本公平']], ['它像什么', C.b, ['画在连续平面上的圈地游戏', '枝就是墙，围出来的空地才是分数']], ['局限', C.r, ['切断规则是多余的', '没有人真正下过']]], at: [3, 5.5, 8] });
