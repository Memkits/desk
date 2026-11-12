// 三维画法与“线与膜”规则。格点坐标 (x,y,z)，z 向上。
const N5 = 5, V5 = 125, cid = (x, y, z) => x + 5 * (y + 5 * z), cxyz = i => [i % 5, (i / 5 | 0) % 5, i / 25 | 0];
const NB6 = []; for (let i = 0; i < V5; i++) { const [x, y, z] = cxyz(i), a = []; [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].forEach(([dx, dy, dz]) => { const X = x + dx, Y = y + dy, Z = z + dz; if (X >= 0 && Y >= 0 && Z >= 0 && X < 5 && Y < 5 && Z < 5) a.push(cid(X, Y, Z)); }); NB6[i] = a; }
// 从底面出发、经过 ok(i) 的格子能到达的集合；prev 用来回溯路径
function lmFlood(b, ok) { const seen = new Int16Array(V5).fill(-2), q = []; for (let i = 0; i < 25; i++) if (ok(b[i])) { seen[i] = -1; q.push(i); } for (let h = 0; h < q.length; h++) { const c = q[h]; for (const n of NB6[c]) if (seen[n] === -2 && ok(b[n])) { seen[n] = c; q.push(n); } } return { seen, q }; }
function lmPath(b) { const { seen, q } = lmFlood(b, v => v === 1); const top = q.find(c => c >= 100); if (top === undefined) return null; const p = []; for (let c = top; c >= 0; c = seen[c]) p.push(c); return p; }
function lmStates(mv) { const b = new Uint8Array(V5), st = [b.slice()]; mv.forEach(([m, p]) => { b[m] = p; st.push(b.slice()); }); return st; }
const LM = { A: lmStates(GD.A), B: lmStates(GD.B) };
// 投影：绕 z 轴转 yaw，俯角 pit
function mkP(cx, cy, s, yaw, pit = .42, persp = .03) { const c = Math.cos(yaw), sn = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit);
  const P = p => { const X = p[0] * c - p[1] * sn, Y = p[0] * sn + p[1] * c, d = Y * cp + p[2] * sp, k = 1 + d * persp; return [cx + X * s * k, cy + (-p[2] * cp + Y * sp) * s * k, d, k]; };
  P.vis = n => (n[0] * sn + n[1] * c) * cp + n[2] * sp; P.s = s; return P; }
const PAL = { 1: ['#D6EEFF', '#5CB4FF', '#174B80'], 2: ['#FFE6C2', '#FFB25C', '#9A5510'], w: ['#FFFFFF', '#D5DBE8', '#7A8498'], k: ['#7B859C', '#343D55', '#0C101C'], g: ['#E6FFF2', '#5FE0A0', '#1C7A4C'], r: ['#FFD9D9', '#FF6B6B', '#8E2222'] };
function ball(g, x, y, r, pal, a = 1) { const gr = g.createRadialGradient(x - r * .35, y - r * .4, r * .08, x, y, r); gr.addColorStop(0, pal[0]); gr.addColorStop(.45, pal[1]); gr.addColorStop(1, pal[2]); g.save(); g.globalAlpha *= a; g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.restore(); }
function poly(g, pts, fill, stroke, lw = 1.5) { g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
const FACES = [[[0, 0, 1], [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]]], [[0, 0, -1], [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]]], [[1, 0, 0], [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]]], [[-1, 0, 0], [[-1, -1, -1], [-1, 1, -1], [-1, 1, 1], [-1, -1, 1]]], [[0, 1, 0], [[-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]]], [[0, -1, 0], [[-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]]]];
// 小方块（膜的一格）：只画朝向镜头的面
function cubelet(g, P, c, h, rgb, a = .82, edge = 'rgba(40,20,0,.55)') { FACES.forEach(([n, vs]) => { const v = P.vis(n); if (v <= 0) return; const sh = n[2] > 0 ? 1 : .55 + .35 * v; poly(g, vs.map(q => P([c[0] + q[0] * h, c[1] + q[1] * h, c[2] + q[2] * h])), `rgba(${rgb.map(x => x * sh | 0).join(',')},${a})`, edge, 1.2); }); }
function boxFrame(g, P, h, col = 'rgba(160,180,220,.35)', lw = 1.5, hz = h) { const cs = []; for (const x of [-h, h]) for (const y of [-h, h]) for (const z of [-hz, hz]) cs.push([x, y, z]); for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) { let d = 0; for (let k = 0; k < 3; k++) if (cs[i][k] !== cs[j][k]) d++; if (d === 1) { const a = P(cs[i]), b = P(cs[j]); line(g, [a, b], col, lw); } } }
function runItems(items) { items.sort((a, b) => a.d - b.d).forEach(it => it.fn()); }
// 画一个“线与膜”局面。o: {last, path:Set, mem:Set, flood:Set, fa, dots, labels}
function lmDraw(g, cx, cy, s, yaw, b, o = {}) { const P = mkP(cx, cy, s, yaw), items = [], W = c => { const [x, y, z] = cxyz(c); return [x - 2, y - 2, z - 2]; };
  const bot = [[-2.5, -2.5, -2.5], [2.5, -2.5, -2.5], [2.5, 2.5, -2.5], [-2.5, 2.5, -2.5]].map(P), top = [[-2.5, -2.5, 2.5], [2.5, -2.5, 2.5], [2.5, 2.5, 2.5], [-2.5, 2.5, 2.5]].map(P);
  poly(g, bot, 'rgba(92,180,255,.13)', 'rgba(92,180,255,.5)', 2);
  for (let c = 0; c < V5; c++) { const w = W(c), p = P(w), v = b[c];
    if (!v) { if (o.flood && o.flood.has(c)) items.push({ d: p[2], fn: () => ball(g, p[0], p[1], s * .2 * p[3], PAL[1], .4 * (o.fa ?? 1)) }); else if (o.dots !== false) items.push({ d: p[2], fn: () => dot(g, p[0], p[1], 2.2, 'rgba(170,185,215,.28)') }); continue; }
    if (v === 1) { const hi = o.path && o.path.has(c); items.push({ d: p[2], fn: () => { if (hi) { g.save(); g.shadowColor = '#9FD6FF'; g.shadowBlur = 26; ball(g, p[0], p[1], s * .34 * p[3], PAL[1]); g.restore(); } else ball(g, p[0], p[1], s * .3 * p[3], PAL[1]); if (o.last === c) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(p[0], p[1], s * .42 * p[3], 0, 7); g.stroke(); } } });
      for (const n of NB6[c]) if (n > c && b[n] === 1) { const q = P(W(n)), both = o.path && o.path.has(c) && o.path.has(n); items.push({ d: (p[2] + q[2]) / 2 - .01, fn: () => line(g, [p, q], both ? '#BFE3FF' : '#3F8FD6', s * (both ? .22 : .15)) }); } }
    else { const hi = o.mem && o.mem.has(c); items.push({ d: p[2], fn: () => { cubelet(g, P, w, .4, hi ? [255, 196, 110] : [235, 150, 60], o.mem ? (hi ? .95 : .35) : .82); if (o.last === c) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(p[0], p[1], s * .5 * p[3], 0, 7); g.stroke(); } } }); } }
  runItems(items); poly(g, top, 'rgba(92,180,255,.08)', 'rgba(92,180,255,.5)', 2); boxFrame(g, P, 2.5, 'rgba(160,180,220,.3)');
  if (o.labels) { const a = P([0, 0, -2.5]), t = P([0, 0, 2.5]); txt(g, '底面', a[0], a[1] + s * 1.35, C.b, fnt(700, 24), 'center'); txt(g, '顶面', t[0], t[1] - s * 1.35, C.b, fnt(700, 24), 'center'); } return P; }
// 第 k 手之后的局面，带最后一手
function lmPly(g, cx, cy, s, yaw, key, k, o = {}) { const st = LM[key], mv = GD[key]; k = Math.max(0, Math.min(k, mv.length)); return lmDraw(g, cx, cy, s, yaw, st[k], Object.assign({ last: k > 0 ? mv[k - 1][0] : -1 }, o)); }
function lmSide(g, x, y, key, k, lines, col) { const mv = GD[key]; k = Math.max(0, Math.min(k, mv.length)); const nb = mv.slice(0, k).filter(m => m[1] === 1).length, no = k - nb; panel(g, x, y, 560, 300);
  txt(g, '第', x + 30, y + 60, C.fg3, fnt(600, 26)); txt(g, String(k), x + 110, y + 58, C.fg, fnt(800, 56, 'mono'), 'center'); txt(g, '手', x + 170, y + 60, C.fg3, fnt(600, 26));
  ball(g, x + 50, y + 140, 16, PAL[1]); txt(g, `线方（蓝） ${nb} 子`, x + 84, y + 140, C.fg, fnt(700, 28)); g.fillStyle = '#EB963C'; g.fillRect(x + 36, y + 186, 28, 28); txt(g, `膜方（橙） ${no} 子`, x + 84, y + 200, C.fg, fnt(700, 28));
  txt(g, lines[0], x + 30, y + 256, col || C.fg3, fnt(600, 23)); }
