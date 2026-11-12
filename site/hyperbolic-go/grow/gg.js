// 四个游戏的规则代码，取自 games.html（draw/hit 在视频里不用）
window.GG = (() => { const G = {}, sgn = Math.sign, cnt = (a, v) => { let n = 0; for (let i = 0; i < a.length; i++) if (a[i] === v) n++; return n; }, rnd = n => Math.floor(Math.random() * n);
G.twig = { name: '枝战', grow: 1, R: 4.4, ND: 10, RHO: 1.5, MAXM: 100, D2: .64,
  verdict: '成立，这一轮最好的一个：多想四倍的一方 20 局全胜，再高一档 12 局赢 11 局；同等水平下先后手各半（先手 20 局赢 9 局）。切断大多只剪掉枝梢，胜负主要靠抢地盘和围堵。', rules: ['圆形场地里，双方各有一个根。没有格子：每一手从自己任意一个节点出发，朝 10 个方向之一长出一段等长的新枝。', '新节点不能离任何已有节点太近，新枝不能穿过自己的枝。', '<b>切断</b>：新枝可以穿过对方的枝，条件是在交叉点附近（虚线圆内），你的节点比对方多。被切断后连不回根的那一截全部枯死。', '可以长的位置用小点标出，会切断对方的用红圈标出。一方无处可长就停手，双方都无处可长时结束，活着的节点多者胜。'],
  init() { return { x: [-2.6, 2.6], y: [0, 0], own: [1, 2], par: [-1, -1], alive: [1, 1], tm: 1, moves: 0, passes: 0 }; },
  clone: s => ({ x: s.x.slice(), y: s.y.slice(), own: s.own.slice(), par: s.par.slice(), alive: s.alive.slice(), tm: s.tm, moves: s.moves, passes: s.passes }),
  // 从节点 p 朝方向 d 生长是否合法；合法返回 {x,y,cuts:[被切断的子节点]}
  check(s, p, d) { const a = d * Math.PI * 2 / this.ND, px = s.x[p], py = s.y[p], qx = px + Math.cos(a), qy = py + Math.sin(a), n = s.x.length, me = s.own[p];
    if (qx * qx + qy * qy > this.R * this.R) return null;
    for (let i = 0; i < n; i++) if (s.alive[i]) { const dx = s.x[i] - qx, dy = s.y[i] - qy; if (dx * dx + dy * dy < this.D2) return null; }
    let cuts = null;
    for (let c = 0; c < n; c++) { if (!s.alive[c]) continue; const b = s.par[c]; if (b < 0 || b === p || c === p) continue;
      const ax = s.x[b], ay = s.y[b], bx = s.x[c] - ax, by = s.y[c] - ay, rx = qx - px, ry = qy - py, den = rx * by - ry * bx; if (Math.abs(den) < 1e-9) continue;
      const t = ((ax - px) * by - (ay - py) * bx) / den, u = ((ax - px) * ry - (ay - py) * rx) / den; if (t <= 1e-6 || t >= 1 + 1e-6 || u <= 1e-6 || u >= 1 - 1e-6) continue;
      if (s.own[c] === me) return null;
      const ix = px + rx * t, iy = py + ry * t; let mine = 0, his = 0, r2 = this.RHO * this.RHO; for (let i = 0; i < n; i++) if (s.alive[i]) { const dx = s.x[i] - ix, dy = s.y[i] - iy; if (dx * dx + dy * dy <= r2) { if (s.own[i] === me) mine++; else his++; } }
      if (mine <= his) return null; (cuts = cuts || []).push(c, ix, iy); }
    return { x: qx, y: qy, cuts }; },
  legal(s) { const m = [], n = s.x.length; for (let p = 0; p < n; p++) if (s.alive[p] && s.own[p] === s.tm) for (let d = 0; d < this.ND; d++) if (this.check(s, p, d)) m.push(p * this.ND + d); return m.length ? m : [-1]; },
  apply(s, p, r) { const k = s.x.length; s.x.push(r.x); s.y.push(r.y); s.own.push(s.tm); s.par.push(p); s.alive.push(1);
    if (r.cuts) { for (let i = 0; i < r.cuts.length; i += 3) s.alive[r.cuts[i]] = 0; let ch = true; while (ch) { ch = false; for (let i = 0; i < k; i++) if (s.alive[i] && s.par[i] >= 0 && !s.alive[s.par[i]]) { s.alive[i] = 0; ch = true; } } }
    s.passes = 0; s.tm = 3 - s.tm; s.moves++; },
  play(s, m) { if (m < 0) { s.passes++; s.tm = 3 - s.tm; s.moves++; return; } const p = Math.floor(m / this.ND), r = this.check(s, p, m % this.ND); this.apply(s, p, r); },
  rand(s) { const mine = []; for (let i = 0; i < s.x.length; i++) if (s.alive[i] && s.own[i] === s.tm) mine.push(i); for (let k = 0; k < 30; k++) { const p = mine[rnd(mine.length)], r = this.check(s, p, rnd(this.ND)); if (r) return this.apply(s, p, r); } const mv = this.legal(s); this.play(s, mv[rnd(mv.length)]); },
  over(s) { return s.moves >= this.MAXM || s.passes >= 2; },
  count(s, v) { let n = 0; for (let i = 0; i < s.x.length; i++) if (s.alive[i] && s.own[i] === v) n++; return n; },
  result(s) { return sgn(this.count(s, 1) - this.count(s, 2)); },
  score(s) { return [this.count(s, 1), this.count(s, 2), '个节点', `第 ${s.moves + 1} 手`]; },
  sc: 74, X(x) { return 360 + x * 74; }, Y(y) { return 360 + y * 74; },
  draw(s, ui) { bg(); dot(360, 360, this.R * 74 + 12, null, COL.grid, 3); const n = s.x.length;
    for (let i = 0; i < n; i++) if (s.alive[i] && s.par[i] >= 0) ln(this.X(s.x[s.par[i]]), this.Y(s.y[s.par[i]]), this.X(s.x[i]), this.Y(s.y[i]), COL.p[s.own[i]], 7);
    for (let i = 0; i < n; i++) if (s.alive[i]) { dot(this.X(s.x[i]), this.Y(s.y[i]), s.par[i] < 0 ? 16 : 10, COL.p[s.own[i]], s.par[i] < 0 ? COL.ink : null, 3); if (i === n - 1 && s.moves) dot(this.X(s.x[i]), this.Y(s.y[i]), 15, null, COL.ink, 2.5); }
    if (!ui.human) return; const mv = this.legal(s); ui.cand = [];
    mv.forEach(m => { if (m < 0) return; const p = Math.floor(m / this.ND), r = this.check(s, p, m % this.ND), X = this.X(r.x), Y = this.Y(r.y); ui.cand.push([X, Y, m]); dot(X, Y, 4, COL.ink2); if (r.cuts) dot(X, Y, 9, null, COL.bad, 2.5);
      if (ui.hover === m) { ln(this.X(s.x[p]), this.Y(s.y[p]), X, Y, COL.p[s.tm], 5, [8, 6]); dot(X, Y, 10, null, COL.p[s.tm], 3); if (r.cuts) for (let i = 0; i < r.cuts.length; i += 3) { g.save(); g.setLineDash([6, 6]); dot(this.X(r.cuts[i + 1]), this.Y(r.cuts[i + 2]), this.RHO * 74, null, COL.bad, 2); g.restore(); } } }); },
  hit(x, y, s, ui) { let best = null, bd = 26; (ui.cand || this.legal(s).filter(m => m >= 0).map(m => { const r = this.check(s, Math.floor(m / this.ND), m % this.ND); return [this.X(r.x), this.Y(r.y), m]; })).forEach(([X, Y, m]) => { const d = Math.hypot(X - x, Y - y); if (d < bd) { bd = d; best = m; } }); return best; } };

// 珊瑚：双方往同一个群落上贴圆
G.coral = { name: '珊瑚', grow: 1, R: 7.4, MAXM: 60, S: 46, TH: 2, LOCAL: 1,
  verdict: '不成立：比分一直咬得很紧，胜负基本由谁下最后一手决定。换了五种开局，四种都是某一方 20 局全胜；多想四倍只赢 10 到 12 局。最初的“全场同时变色”规则更糟，六手之内一方被吃光。', rules: ['场地中央有两个圆，双方共同往这个群落上贴新的圆。没有格子：新圆必须同时贴住两个已有的圆（卡在它们之间的凹处），不能和别的圆重叠，不能出界。', '<b>吃子</b>：落子后看新圆贴着的每一个对方圆：如果它贴着的你方圆至少 2 个，并且比贴着的它自己一方的圆多，它就变成你的颜色。', '可以放的位置用虚线圆标出。各下 30 手或无处可放时结束，圆多者胜。'],
  SEED: [[-1.3, 0, 1], [1.3, 0, 2]],
  init() { return { x: this.SEED.map(q => q[0]), y: this.SEED.map(q => q[1]), own: this.SEED.map(q => q[2]), tm: 1, moves: 0, passes: 0 }; },
  clone: s => ({ x: s.x.slice(), y: s.y.slice(), own: s.own.slice(), tm: s.tm, moves: s.moves, passes: s.passes }),
  cands(s) { if (s._c) return s._c; const n = s.x.length, out = [], seen = new Set(), R2 = (this.R - 1) * (this.R - 1);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const dx = s.x[j] - s.x[i], dy = s.y[j] - s.y[i], d2 = dx * dx + dy * dy; if (d2 > 16 - 1e-9) continue; const d = Math.sqrt(d2), h = Math.sqrt(Math.max(0, 4 - d2 / 4)), mx = (s.x[i] + s.x[j]) / 2, my = (s.y[i] + s.y[j]) / 2;
      for (let sg = -1; sg <= 1; sg += 2) { const cx = mx - sg * dy / d * h, cy = my + sg * dx / d * h; if (cx * cx + cy * cy > R2) continue; let ok = true; for (let k = 0; k < n; k++) { const ex = s.x[k] - cx, ey = s.y[k] - cy; if (ex * ex + ey * ey < 4 - 1e-6) { ok = false; break; } } if (!ok) continue; const key = Math.round(cx * 200) + ',' + Math.round(cy * 200); if (seen.has(key)) continue; seen.add(key); out.push([cx, cy]); } }
    return s._c = out; },
  legal(s) { const c = this.cands(s); if (!c.length) return [-1]; const m = []; for (let i = 0; i < c.length; i++) m.push(i); return m; },
  play(s, m, rec) { if (m < 0) { s.passes++; s.tm = 3 - s.tm; s.moves++; return; } const [cx, cy] = this.cands(s)[m]; s._c = null; s.x.push(cx); s.y.push(cy); s.own.push(s.tm); if (rec) rec.push({ ...this.clone(s), lastI: s.x.length - 1 });
    const n = s.x.length, d = s.own.slice(); for (let i = 0; i < n; i++) { let a = 0, b = 0; for (let k = 0; k < n; k++) if (k !== i) { const ex = s.x[k] - s.x[i], ey = s.y[k] - s.y[i]; if (ex * ex + ey * ey < 4.02) { if (s.own[k] === s.own[i]) a++; else b++; } } if (b >= this.TH && b > a && (!this.LOCAL || (s.own[i] !== s.tm && (s.x[i] - cx) ** 2 + (s.y[i] - cy) ** 2 < 4.02 && i !== n - 1))) d[i] = 3 - s.own[i]; }
    s.own = d; s.lastI = n - 1; s.passes = 0; s.tm = 3 - s.tm; s.moves++; },
  over(s) { return s.moves >= this.MAXM || s.passes >= 1; },
  result: s => sgn(cnt(s.own, 1) - cnt(s.own, 2)),
  score(s) { return [cnt(s.own, 1), cnt(s.own, 2), '个圆', `第 ${Math.min(this.MAXM, s.moves + 1)} / ${this.MAXM} 手`]; },
  X(x) { return 360 + x * this.S; }, Y(y) { return 360 + y * this.S; },
  draw(s, ui) { bg(); dot(360, 360, this.R * this.S, null, COL.grid, 3); const n = s.x.length;
    for (let i = 0; i < n; i++) for (let k = i + 1; k < n; k++) { const ex = s.x[k] - s.x[i], ey = s.y[k] - s.y[i]; if (ex * ex + ey * ey < 4.02) ln(this.X(s.x[i]), this.Y(s.y[i]), this.X(s.x[k]), this.Y(s.y[k]), s.own[i] === s.own[k] ? COL.p[s.own[i]] : COL.ink2, 3); }
    for (let i = 0; i < n; i++) { g.save(); g.globalAlpha = .88; dot(this.X(s.x[i]), this.Y(s.y[i]), this.S - 4, COL.p[s.own[i]]); g.restore(); if (i === s.lastI) dot(this.X(s.x[i]), this.Y(s.y[i]), 12, '#111'); }
    if (!ui.human) return; this.cands(s).forEach(([cx, cy], i) => { g.save(); g.setLineDash([7, 7]); dot(this.X(cx), this.Y(cy), ui.hover === i ? this.S - 4 : 16, ui.hover === i ? null : null, COL.p[s.tm], ui.hover === i ? 4 : 2.5); g.restore(); }); },
  hit(x, y, s) { let best = null, bd = 40; this.cands(s).forEach(([cx, cy], i) => { const d = Math.hypot(this.X(cx) - x, this.Y(cy) - y); if (d < bd) { bd = d; best = i; } }); return best; } };

// 分水：共建水渠
G.flow = { name: '分水', grow: 1, LV: 6, BUD: 12, MUL: [1, 2, 3, 4, 5, 6, 7], HC: 0, bud(v) { return this.BUD - (v === 2 ? this.HC : 0); },
  verdict: '基本成立：多想四倍的一方 20 局赢 15 到 18 局，没有平局。但盘面小，电脑想得足够久时后手几乎必胜（30 局赢 29 局），最后一段水渠总是后手修。最初各杯等值的规则不成立，同等水平 30 局平 27 局，所以改成越靠右越值钱。', rules: ['顶上的泉眼有 64 份水。双方轮流修一段水渠：从任何一个已经有水的节点，向左下或右下接一段。每人 12 段。', '水自己往下流：一个节点有两条出路就对半分，只有一条就全走那条，没有出路就积在原地，谁也得不到。', '水流到最底一排的杯子时，最后那一段水渠是谁修的，这些水就归谁。杯子越靠右越值钱：从左到右每份水算 1 到 7 分。', '所以可以在上游给对方的水分流，也可以抢在对方前面修最后一段。水渠用完后，得分高者胜。虚线是现在可以修的位置。'],
  id: (l, i) => l * (l + 1) / 2 + i,
  init() { return { out: new Int8Array(120), used: [0, 0, 0], tm: 1, moves: 0, passes: 0 }; },
  clone: s => ({ out: s.out.slice(), used: s.used.slice(), tm: s.tm, moves: s.moves, passes: s.passes }),
  flows(s) { const f = new Float64Array(60), got = [0, 0, 0], LV = this.LV; f[0] = 64; let pool = 0; for (let l = 0; l < LV; l++) for (let i = 0; i <= l; i++) { const a = this.id(l, i), v = f[a]; if (!v) continue; const oL = s.out[a * 2], oR = s.out[a * 2 + 1], k = (oL ? 1 : 0) + (oR ? 1 : 0); if (!k) { pool += v; continue; } const sh = v / k; if (oL) { f[this.id(l + 1, i)] += sh; if (l + 1 === LV) got[oL] += sh * this.MUL[i]; } if (oR) { f[this.id(l + 1, i + 1)] += sh; if (l + 1 === LV) got[oR] += sh * this.MUL[i + 1]; } } return { f, got, pool }; },
  legal(s) { if (s.used[s.tm] >= this.bud(s.tm)) return [-1]; const { f } = this.flows(s), m = []; for (let l = 0; l < this.LV; l++) for (let i = 0; i <= l; i++) { const a = this.id(l, i); if (!f[a]) continue; if (!s.out[a * 2]) m.push(a * 2); if (!s.out[a * 2 + 1]) m.push(a * 2 + 1); } return m.length ? m : [-1]; },
  play(s, m) { if (m < 0) s.passes++; else { s.out[m] = s.tm; s.used[s.tm]++; s.passes = 0; s.last = m; } s.tm = 3 - s.tm; s.moves++; },
  over(s) { return s.passes >= 2 || (s.used[1] >= this.bud(1) && s.used[2] >= this.bud(2)); },
  result(s) { const { got } = this.flows(s); return sgn(got[1] - got[2]); },
  score(s) { const { got, pool } = this.flows(s); return [got[1], got[2], '分', `剩余水渠 蓝 ${this.bud(1) - s.used[1]} · 橙 ${this.bud(2) - s.used[2]}　积在半路 ${pool}`]; },
  P(l, i) { const sp = 588 / this.LV; return [360 + (i - l / 2) * sp, 70 + l * sp]; },
  draw(s, ui) { bg(); const { f } = this.flows(s), LV = this.LV, leg = ui.human ? this.legal(s) : [];
    for (let l = 0; l < LV; l++) for (let i = 0; i <= l; i++) { const a = this.id(l, i), [x, y] = this.P(l, i); for (let sd = 0; sd < 2; sd++) { const [x2, y2] = this.P(l + 1, i + sd), o = s.out[a * 2 + sd], k = (s.out[a * 2] ? 1 : 0) + (s.out[a * 2 + 1] ? 1 : 0);
      if (o) { const fl = f[a] / k; ln(x, y, x2, y2, COL.p[o], 4 + Math.sqrt(fl) * 2.2); if (s.last === a * 2 + sd) ln(x, y, x2, y2, COL.ink, 2, [5, 5]); } else if (leg.includes(a * 2 + sd)) ln(x, y, x2, y2, ui.hover === a * 2 + sd ? COL.p[s.tm] : COL.ink2, ui.hover === a * 2 + sd ? 6 : 2, [6, 7]); } }
    for (let l = 0; l <= LV; l++) for (let i = 0; i <= l; i++) { const a = this.id(l, i), [x, y] = this.P(l, i), v = f[a]; if (l === LV) { rr(x - 34, y - 6, 68, 44, 8, COL.card, COL.grid, 2); if (v) tx(String(v), x, y + 17, COL.ink, 20, 'center', 800); tx('×' + this.MUL[i], x, y + 52, COL.ink2, 15); } else { dot(x, y, v ? 21 : 9, v ? '#7fd0e8' : COL.board, COL.ink2, 2); if (v) tx(String(v), x, y + 1, '#0b2a36', 17, 'center', 800); } }
    tx('泉眼 64', 360, 30, COL.ink2, 16); },
  hit(x, y, s) { let best = null, bd = 34; this.legal(s).forEach(m => { if (m < 0) return; const a = m >> 1, sd = m & 1; let l = 0; while (this.id(l + 1, 0) <= a) l++; const i = a - this.id(l, 0), [x1, y1] = this.P(l, i), [x2, y2] = this.P(l + 1, i + sd), d = Math.hypot((x1 + x2) / 2 - x, (y1 + y2) / 2 - y); if (d < bd) { bd = d; best = m; } }); return best; } };

// 危楼：共同砌一面错缝的墙，承重超限会垮
G.tower = { name: '危楼', grow: 1, ROWS: 7, K: 3, BUD: 16, HC: 0, bud(v) { return this.BUD - (v === 2 ? this.HC : 0); },
  verdict: '不成立：一次垮塌能毁掉大半面墙，所以最后一块砖决定胜负。同等水平下后手 30 局赢 17 局、平 12 局；让后手少一块砖，就变成先手 30 局赢 24 局。', rules: ['双方往同一面墙上砌砖，砖一层一层错缝叠放：每块砖压在下面一层的一块或两块砖上。新砖必须放在地面，或至少压住一块砖。', '<b>承重</b>：每块砖重 1，它把自己的重量和身上的压力平分给下面托着它的砖。砖上的数字是它承受的压力。', '<b>垮塌</b>：压力超过 3 的砖会碎掉；失去全部支撑的砖跟着掉下去，连锁结算。', '所以可以往对方的砖上面加码，把它压碎。每人 16 块砖，放完后墙上剩下的砖多者胜。'],
  ok(r, x) { return r >= 0 && r < this.ROWS && x >= (r & 1) && x <= 14 && ((x - r) & 1) === 0; },
  init() { return { b: new Int8Array(7 * 17), used: [0, 0, 0], tm: 1, moves: 0, passes: 0 }; },
  clone: s => ({ b: s.b.slice(), used: s.used.slice(), tm: s.tm, moves: s.moves, passes: s.passes }),
  nsup(b, r, x) { if (r === 0) return 2; let k = 0; if (x > 0 && b[(r - 1) * 17 + x - 1]) k++; if (x < 14 && b[(r - 1) * 17 + x + 1]) k++; return k; },
  loads(b) { const ld = new Float64Array(7 * 17); for (let r = this.ROWS - 1; r >= 1; r--) for (let x = 0; x <= 14; x++) { const i = r * 17 + x; if (!b[i]) continue; const k = this.nsup(b, r, x); if (!k) continue; const sh = (1 + ld[i]) / k; if (x > 0 && b[i - 17 - 1]) ld[i - 17 - 1] += sh; if (x < 14 && b[i - 17 + 1]) ld[i - 17 + 1] += sh; } return ld; },
  legal(s) { if (s.used[s.tm] >= this.bud(s.tm)) return [-1]; const m = []; for (let r = 0; r < this.ROWS; r++) for (let x = r & 1; x <= 14; x += 2) { const i = r * 17 + x; if (!s.b[i] && (r === 0 || this.nsup(s.b, r, x) > 0)) m.push(i); } return m.length ? m : [-1]; },
  play(s, m, rec) { if (m < 0) s.passes++; else { const b = s.b; b[m] = s.tm; s.used[s.tm]++; s.passes = 0; s.last = m;
      for (let guard = 0; guard < 60; guard++) { const ld = this.loads(b); let any = false; for (let i = 0; i < b.length; i++) if (b[i] && ld[i] > this.K + 1e-9) { if (!any && rec) rec.push({ ...this.clone(s), last: m, brk: [] }); any = true; if (rec) rec[rec.length - 1].brk.push(i); } if (!any) break; for (let i = 0; i < b.length; i++) if (b[i] && ld[i] > this.K + 1e-9) b[i] = 0;
        let ch = true; while (ch) { ch = false; for (let r = 1; r < this.ROWS; r++) for (let x = r & 1; x <= 14; x += 2) if (b[r * 17 + x] && !this.nsup(b, r, x)) { b[r * 17 + x] = 0; ch = true; } } } }
    s.tm = 3 - s.tm; s.moves++; },
  over(s) { return s.passes >= 2 || (s.used[1] >= this.bud(1) && s.used[2] >= this.bud(2)); },
  result: s => sgn(cnt(s.b, 1) - cnt(s.b, 2)),
  score(s) { return [cnt(s.b, 1), cnt(s.b, 2), '块砖', `剩余 蓝 ${this.bud(1) - s.used[1]} · 橙 ${this.bud(2) - s.used[2]}`]; },
  draw(s, ui) { bg(); const hw = 42, bh = 76, ox = 24, gy = 640, ld = this.loads(s.b), leg = ui.human ? this.legal(s) : []; rr(ox - 10, gy, 16 * hw + 20, 10, 5, COL.ink2);
    for (let r = 0; r < this.ROWS; r++) for (let x = r & 1; x <= 14; x += 2) { const i = r * 17 + x, X = ox + x * hw, Y = gy - (r + 1) * bh; if (s.b[i]) { rr(X + 3, Y + 3, 2 * hw - 6, bh - 6, 10, COL.p[s.b[i]]); const v = ld[i], hot = v > this.K - 1 + 1e-9; if (v > 0) tx(String(Math.round(v * 100) / 100), X + hw, Y + bh / 2, hot ? '#7a0000' : 'rgba(0,0,0,.6)', hot ? 24 : 20, 'center', 800); if (s.last === i) rr(X + 1, Y + 1, 2 * hw - 2, bh - 2, 11, null, COL.ink, 3); if (s.brk && s.brk.includes(i)) { ln(X + 10, Y + 10, X + 2 * hw - 10, Y + bh - 10, COL.bad, 6); ln(X + 2 * hw - 10, Y + 10, X + 10, Y + bh - 10, COL.bad, 6); } }
      else if (leg.includes(i)) { g.save(); g.setLineDash([7, 6]); rr(X + 7, Y + 7, 2 * hw - 14, bh - 14, 8, ui.hover === i ? COL.p[s.tm] : null, COL.p[s.tm], 2); g.restore(); } } },
  hit(x, y, s) { const hw = 42, bh = 76, r = Math.floor((640 - y) / bh); if (r < 0 || r >= this.ROWS) return null; const xx = Math.floor((x - 24 - (r & 1) * hw) / (2 * hw)) * 2 + (r & 1), i = r * 17 + xx; return this.legal(s).includes(i) ? i : null; } };

// 固定模拟次数的同步搜索（测量用）
function bestN(game, root, iters) { const mv0 = game.legal(root); if (!iters) return mv0[rnd(mv0.length)]; const rootN = { m: null, v: 0, w: 0, kids: null };
  for (let it = 0; it < iters; it++) { const s = game.clone(root); let cur = rootN; const path = [cur], who = [];
    while (!game.over(s)) { if (!cur.kids) cur.kids = game.legal(s).map(m => ({ m, v: 0, w: 0, kids: null })); let best = null, bv = -1e18; const lg = Math.log(cur.v + 1); for (const k of cur.kids) { const val = k.v === 0 ? 1e9 + Math.random() : k.w / k.v + .7 * Math.sqrt(lg / k.v); if (val > bv) { bv = val; best = k; } } who.push(s.tm); game.play(s, best.m); const fresh = best.v === 0; cur = best; path.push(cur); if (fresh) break; }
    while (!game.over(s)) { if (game.rand) game.rand(s); else { const mv = game.legal(s); game.play(s, mv[rnd(mv.length)]); } }
    const r = game.result(s); for (let i = 1; i < path.length; i++) { path[i].v++; path[i].w += r === 0 ? .5 : ((r > 0) === (who[i - 1] === 1) ? 1 : 0); } rootN.v++; }
  let best = rootN.kids[0]; for (const k of rootN.kids) if (k.v > best.v) best = k; return best.m; }
function matchN(key, a, b, games, opt) { const game = G[key]; let aw = 0, dr = 0, fw = 0, len = 0; for (let gi = 0; gi < games; gi++) { const s = game.init(opt), aFirst = gi % 2 === 0; let n = 0; while (!game.over(s)) { game.play(s, bestN(game, s, (s.tm === 1) === aFirst ? a : b)); n++; } const r = game.result(s); len += n; if (r === 0) dr++; else { if ((r > 0) === aFirst) aw++; if (r > 0) fw++; } } return { key, a, b, games, aw, dr, fw, len: len / games }; }


return G; })();
