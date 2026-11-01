// 驻波专题：通用场景。每个 beat 的画面列表（图片 / 动画）均分 beat 时长，交叉淡入淡出。
window.SCENES = {};
const DET = {
  a_def_3: ['莫比乌斯带的转移函数', 'g₁₂ = +1，g₂₁ = −1', '结构群 {+1, −1}'],
  a_tan_2: ['庞加莱–霍普夫定理', '零点指数之和 = χ(M)', 'χ(球面) = 2，χ(环面) = 0'],
  a_hopf_0: ['三维球面', 'S³ = {(z₁, z₂) : |z₁|² + |z₂|² = 1}', '(z₁, z₂) 与 e^{iθ}(z₁, z₂) 看成同一点 → S²'],
  b_holo_1: ['高斯–博内', '转角 = ∬ K dA', '八分之一球面：4π / 8 = π/2'],
  b_chern_1: ['第一陈数', 'c₁ = (1/2π) ∬ F', '霍普夫丛：|c₁| = 1'],
  b_em_0: ['狄拉克量子化（高斯单位）', 'e · g = n · ħc / 2', 'n 是整数，即陈数'],
  b_em_2: ['AB 效应', 'Δφ = e Φ / ħ', '1959 提出 · 1986 外村彰证实'],
  b_qm_0: ['贝里相位（1984）', '自旋 ½：γ = −Ω / 2', 'Ω：回路张成的立体角'],
  b_qm_1: ['富田章与乔瑞宇（1986）', '螺旋光纤中偏振面转角', '= 光纤切向围出的立体角'],
};
const SS = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const C = { r: '#5CB4FF', l: '#FF7A93', g: '#FFD27A', n: '#5FE0A0', fg: '#E9EEF7', fg2: '#A3AEC3', fg3: '#66728C', line: '#1F2940' };

// 预载本集用到的图片
window.MAPREADY = Promise.all([...new Set(TL.scenes.flatMap(s => s.beats.flatMap(b => b.vis)).filter(v => v.startsWith('img:')).map(v => v.slice(4)))].map(k => new Promise(r => { const im = new Image(); im.onload = im.onerror = r; im.src = `img/${k}.jpg`; })));

function fitBox(w, h, bx, by, bw, bh, cap = 2.2) { const s = Math.min(bw / w, bh / h, cap); const W = w * s, H = h * s; return { x: bx + (bw - W) / 2, y: by + (bh - H) / 2, w: W, h: H }; }

function imgLayer(c, lay, key, det) {
  const m = IMG[key];
  if (!key.startsWith('web')) {
    const b = det ? { x: 100, y: 150, w: 1300, h: 731 } : { x: 192, y: 112, w: 1536, h: 864 };
    const d = c.el(`<div class="ownimg" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px"><img src="img/${key}.jpg"></div>`, lay);
    return { img: d.firstChild, kb: .015 };
  }
  const R = det ? [100, 130, 1300, 740] : [160, 130, 1600, 740];
  const b = fitBox(m.w, m.h, ...R);
  const d = c.el(`<div class="ph" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px"><img src="img/${key}.jpg"></div>`, lay);
  c.el(`<div class="phcap" style="left:${R[0]}px;width:${R[2]}px;top:${b.y + b.h + 14}px"><b>${m.cap}</b><span>图：${m.cr}</span></div>`, lay);
  return { img: d.firstChild, kb: .045 };
}

// ---------------- 动画 ----------------
const AN = {};
function txt(g, s, x, y, col = C.fg2, font = '600 26px "Noto Sans CJK SC",sans-serif', al = 'left') { g.fillStyle = col; g.font = font; g.textAlign = al; g.textBaseline = 'middle'; g.fillText(s, x, y); }
function dot(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
function arrow2(g, x0, y0, x1, y1, col, lw = 4, hs = 16) { const a = Math.atan2(y1 - y0, x1 - x0); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1 - Math.cos(a) * hs * .6, y1 - Math.sin(a) * hs * .6); g.stroke(); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - hs * Math.cos(a - .4), y1 - hs * Math.sin(a - .4)); g.lineTo(x1 - hs * Math.cos(a + .4), y1 - hs * Math.sin(a + .4)); g.fill(); }
// 视图：el 仰角、az 方位角（与 Python 版一致），返回 [x, y, depth]
function view(el, az) { const e = (el - 90) * Math.PI / 180, a = az * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), ce = Math.cos(e), se = Math.sin(e);
  return p => { const x = ca * p[0] - sa * p[1], y = sa * p[0] + ca * p[1], z = p[2]; return [x, ce * y - se * z, se * y + ce * z]; }; }
const rgb = (h, l) => `hsl(${h},70%,${l}%)`;
// 圆柱面 → 莫比乌斯带
AN.mobius = (g, t, R) => {
  const tw = SS((t - 3) / 3), V = view(30, -120 + t * 9), cx = R.x + R.w * .42, cy = R.y + R.h * .5, S = Math.min(R.w, R.h) * .34, Rr = 1.15, W = .42, NU = 140;
  const P = (u, v) => { const a = tw * u / 2; return [(Rr + v * Math.sin(a)) * Math.cos(u), (Rr + v * Math.sin(a)) * Math.sin(u), v * Math.cos(a)]; };
  const Q = []; const L = [.3, .5, .8], ln = Math.hypot(...L);
  for (let i = 0; i < NU; i++) { const u0 = i / NU * 2 * Math.PI, u1 = (i + 1) / NU * 2 * Math.PI;
    for (const [v0, v1] of [[-W, 0], [0, W]]) { const ps = [P(u0, v0), P(u1, v0), P(u1, v1), P(u0, v1)]; const pr = ps.map(V);
      const e1 = ps[1].map((x, k) => x - ps[0][k]), e2 = ps[3].map((x, k) => x - ps[0][k]); const n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]]; const nl = Math.hypot(...n) || 1;
      const sh = Math.abs(n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / nl / ln; Q.push({ pr, d: pr.reduce((a, p) => a + p[2], 0) / 4, sh, i }); } }
  Q.sort((a, b) => a.d - b.d);
  const hue = 350 * tw + 210 * (1 - tw);
  Q.forEach(q => { g.fillStyle = `hsla(${hue},65%,${30 + 32 * q.sh}%,.92)`; g.strokeStyle = q.i % 10 === 0 ? 'rgba(233,238,247,.55)' : `hsla(${hue},65%,${30 + 32 * q.sh}%,.92)`; g.lineWidth = q.i % 10 === 0 ? 1.4 : .6;
    g.beginPath(); q.pr.forEach((p, k) => { const X = cx + p[0] * S, Y = cy - p[1] * S; k ? g.lineTo(X, Y) : g.moveTo(X, Y); }); g.closePath(); g.fill(); if (q.i % 10 === 0) { g.beginPath(); g.moveTo(cx + q.pr[0][0] * S, cy - q.pr[0][1] * S); g.lineTo(cx + q.pr[3][0] * S, cy - q.pr[3][1] * S); g.stroke(); } });
  // 中线 + 走动的纤维箭头
  g.strokeStyle = C.g; g.lineWidth = 3; g.beginPath(); for (let i = 0; i <= 200; i++) { const p = V(P(i / 200 * 2 * Math.PI, 0)); const X = cx + p[0] * S, Y = cy - p[1] * S; i ? g.lineTo(X, Y) : g.moveTo(X, Y); } g.stroke();
  if (t > 6.5) { const um = ((t - 6.5) / 5 % 1) * 2 * Math.PI, a = V(P(um, 0)), b = V(P(um, W * 1.15)); arrow2(g, cx + a[0] * S, cy - a[1] * S, cx + b[0] * S, cy - b[1] * S, '#fff', 5, 18); dot(g, cx + a[0] * S, cy - a[1] * S, 8, C.l); }
  const tx = R.x + R.w * .8;
  txt(g, tw < .5 ? '圆柱面' : '莫比乌斯带', tx, R.y + R.h * .3, tw < .5 ? C.r : C.l, '800 46px "Noto Serif CJK SC",serif', 'center');
  txt(g, tw < .5 ? '两头直接粘：S¹ × [−1, 1]' : '扭半圈再粘：非平凡丛', tx, R.y + R.h * .3 + 60, C.fg2, '500 26px "Noto Sans CJK SC",sans-serif', 'center');
  if (t > 6.5) txt(g, '白箭头沿中线走一圈，回来时被翻转', tx, R.y + R.h * .3 + 110, C.fg3, '500 22px "Noto Sans CJK SC",sans-serif', 'center');
};
// 霍普夫纤维（立体投影）
let HOPF = null;
function hopfPrep() { if (HOPF) return HOPF; HOPF = []; [[.55, 10], [1.05, 14], [1.5, 18]].forEach(([th, n], li) => { for (let k = 0; k < n; k++) { const ph = k / n * 2 * Math.PI, pts = [];
  for (let i = 0; i <= 160; i++) { const ps = i / 160 * 2 * Math.PI, x1 = Math.cos(th / 2) * Math.cos(ps), x2 = Math.cos(th / 2) * Math.sin(ps), x3 = Math.sin(th / 2) * Math.cos(ps + ph), x4 = Math.sin(th / 2) * Math.sin(ps + ph), d = 1 - x4; pts.push([x1 / d, x2 / d, x3 / d]); }
  HOPF.push({ pts, li, hue: ph / (2 * Math.PI) * 300 }); } }); return HOPF; }
AN.hopf = (g, t, R) => {
  const H = hopfPrep(), V = view(28, -55 + t * 12), cx = R.x + R.w / 2, cy = R.y + R.h * .52, S = R.h * .3;
  H.forEach(f => { const a = SS((t - f.li * 1.6) / 1.2); if (a <= 0) return; g.globalAlpha = a * [1, .85, .65][f.li]; g.strokeStyle = `hsl(${f.hue},85%,62%)`; g.lineWidth = [3.2, 2.4, 1.8][f.li];
    g.beginPath(); f.pts.forEach((p, i) => { const q = V(p), X = cx + q[0] * S, Y = cy - q[1] * S; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }); g.stroke(); }); g.globalAlpha = 1;
  txt(g, 'S¹ → S³ → S²', R.x + 40, R.y + 30, C.g, '700 34px "DejaVu Sans Mono",monospace');
  txt(g, '每个圆对应球面 S² 上的一个点；同色 = 同一经度', R.x + 40, R.y + 78, C.fg2, '500 24px "Noto Sans CJK SC",sans-serif');
};
// 联络：水平提升
AN.lift = (g, t, R) => {
  const V = view(16, -60), cx = R.x + R.w * .36, cy = R.y + R.h * .46, S = R.h * .25, k = .17, z0 = -.75, P3 = (u, z) => V([Math.cos(u), Math.sin(u), z]), X = p => cx + p[0] * S, Y = p => cy - p[1] * S;
  g.strokeStyle = 'rgba(108,182,255,.35)'; g.lineWidth = 1.2;
  for (const z of [-1.4, 1.4]) { g.beginPath(); for (let i = 0; i <= 120; i++) { const p = P3(i / 120 * 2 * Math.PI, z); i ? g.lineTo(X(p), Y(p)) : g.moveTo(X(p), Y(p)); } g.stroke(); }
  for (let i = 0; i < 16; i++) { const u = i / 16 * 2 * Math.PI, a = P3(u, -1.4), b = P3(u, 1.4); g.beginPath(); g.moveTo(X(a), Y(a)); g.lineTo(X(b), Y(b)); g.stroke(); }
  g.strokeStyle = 'rgba(163,174,195,.55)'; g.lineWidth = 1.3;
  for (let i = 0; i < 16; i++) for (let j = 0; j < 6; j++) { const u = i / 16 * 2 * Math.PI, z = -1.1 + j * .44, du = .17, a = P3(u - du, z - k * du), b = P3(u + du, z + k * du); if (V([Math.cos(u), Math.sin(u), 0])[2] < -.2) continue; g.beginPath(); g.moveTo(X(a), Y(a)); g.lineTo(X(b), Y(b)); g.stroke(); }
  const base = -1.75; g.strokeStyle = C.fg3; g.setLineDash([8, 6]); g.lineWidth = 2; g.beginPath(); for (let i = 0; i <= 120; i++) { const p = P3(i / 120 * 2 * Math.PI, base); i ? g.lineTo(X(p), Y(p)) : g.moveTo(X(p), Y(p)); } g.stroke(); g.setLineDash([]);
  const um = Math.min(1, Math.max(0, (t - 1.5) / 6)) * 2 * Math.PI;
  g.strokeStyle = C.g; g.lineWidth = 5; g.beginPath(); for (let i = 0; i <= 200; i++) { const u = i / 200 * um, p = P3(u, z0 + k * u); i ? g.lineTo(X(p), Y(p)) : g.moveTo(X(p), Y(p)); } g.stroke();
  const pb = P3(um, base), pt = P3(um, z0 + k * um); dot(g, X(pb), Y(pb), 9, C.g); dot(g, X(pt), Y(pt), 10, '#fff');
  const p0 = P3(0, z0); dot(g, X(p0), Y(p0), 10, C.n);
  if (um >= 2 * Math.PI - 1e-6) { const a = P3(0, z0), b = P3(0, z0 + k * 2 * Math.PI); g.strokeStyle = C.l; g.lineWidth = 5; g.beginPath(); g.moveTo(X(a), Y(a)); g.lineTo(X(b), Y(b)); g.stroke(); dot(g, X(b), Y(b), 10, C.l); txt(g, '和乐', X(b) + 22, (Y(a) + Y(b)) / 2, C.l, '700 30px "Noto Sans CJK SC",sans-serif'); }
  const tx = R.x + R.w * .66;
  txt(g, '底空间：圆（虚线）', tx, R.y + 150, C.fg2, '500 26px "Noto Sans CJK SC",sans-serif');
  txt(g, '纤维：竖直方向', tx, R.y + 200, C.fg2, '500 26px "Noto Sans CJK SC",sans-serif');
  txt(g, '联络：每点的水平方向（短线）', tx, R.y + 250, C.fg2, '500 26px "Noto Sans CJK SC",sans-serif');
  txt(g, '金线：沿水平方向走 = 平行移动', tx, R.y + 320, C.g, '600 26px "Noto Sans CJK SC",sans-serif');
  if (um >= 2 * Math.PI - 1e-6) txt(g, '走一圈，没有回到出发点', tx, R.y + 370, C.l, '600 26px "Noto Sans CJK SC",sans-serif');
};
// 球面上的平行移动
AN.transport = (g, t, R) => {
  const V = view(35, -125), cx = R.x + R.w * .38, cy = R.y + R.h * .52, S = R.h * .42;
  const SP = (th, ph) => [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)], ETH = (th, ph) => [Math.cos(th) * Math.cos(ph), Math.cos(th) * Math.sin(ph), -Math.sin(th)];
  const X = p => cx + p[0] * S, Y = p => cy - p[1] * S;
  g.fillStyle = '#16223a'; g.beginPath(); g.arc(cx, cy, S, 0, 7); g.fill(); g.strokeStyle = '#2C3854'; g.lineWidth = 1.5; g.stroke();
  const curve = (f, n, col, lw) => { g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); let pen = false; for (let i = 0; i <= n; i++) { const q = V(f(i / n)); if (q[2] < 0) { pen = false; continue; } pen ? g.lineTo(X(q), Y(q)) : g.moveTo(X(q), Y(q)); pen = true; } g.stroke(); };
  for (let k = 1; k < 6; k++) curve(u => SP(k * Math.PI / 6, u * 2 * Math.PI), 120, '#25324e', 1);
  for (let k = 0; k < 6; k++) curve(u => SP(u * 2 * Math.PI, k * Math.PI / 6), 160, '#25324e', 1);
  const T = 3.2, s = Math.min(3, Math.max(0, (t - .8) / T)), Hh = Math.PI / 2;
  const leg = (i, u) => i === 0 ? [SP(u * Hh, 0), u === 0 ? [1, 0, 0] : ETH(u * Hh, 0)] : i === 1 ? [SP(Hh, u * Hh), ETH(Hh, u * Hh)] : [SP(Hh - u * Hh, Hh), u >= 1 ? [0, 1, 0] : ETH(Hh - u * Hh, Hh)];
  for (let i = 0; i < 3; i++) { const e = Math.min(1, Math.max(0, s - i)); if (e > 0) curve(u => leg(i, u * e)[0], 60, C.g, 4); }
  const li = Math.min(2, Math.floor(s)), lu = s >= 3 ? 1 : s - li, [p, v] = leg(li, lu);
  const ar = (p, v, col, L = .32) => { const a = V(p), b = V(p.map((x, k) => x + L * v[k])); arrow2(g, X(a), Y(a), X(b), Y(b), col, 5, 18); };
  ar(SP(0, 0), [1, 0, 0], 'rgba(255,138,160,.45)');
  ar(p, v, s >= 3 ? C.r : C.l);
  const q0 = V(SP(0, 0)); txt(g, '北极', X(q0) - 16, Y(q0) - 26, C.fg2, '500 22px "Noto Sans CJK SC",sans-serif', 'right');
  const tx = R.x + R.w * .72;
  txt(g, ['① 沿经线南下到赤道', '② 沿赤道走 90°', '③ 沿经线回北极', '回来时转了 90°'][s >= 3 ? 3 : li], tx, R.y + 200, s >= 3 ? C.r : C.g, '700 32px "Noto Sans CJK SC",sans-serif', 'center');
  txt(g, '箭头一路都不主动转动', tx, R.y + 256, C.fg2, '500 24px "Noto Sans CJK SC",sans-serif', 'center');
  if (s >= 3) { txt(g, '转角 = 面积 × 曲率 = π/2', tx, R.y + 320, C.g, '600 28px "Noto Sans CJK SC",sans-serif', 'center'); txt(g, '淡红：出发时的方向', tx, R.y + 370, C.fg3, '500 22px "Noto Sans CJK SC",sans-serif', 'center'); }
};
// 傅科摆
AN.foucault = (g, t, R) => {
  const cx = R.x + R.w * .33, cy = R.y + R.h * .5, Rf = R.h * .4, hours = Math.min(24, Math.max(0, t - .5) * 2.4), rate = 271 / 24, ang = hours * rate * Math.PI / 180;
  g.fillStyle = '#121a2c'; g.beginPath(); g.arc(cx, cy, Rf, 0, 7); g.fill(); g.strokeStyle = '#2C3854'; g.lineWidth = 2; g.stroke();
  for (let d = 0; d < 360; d += 15) { const a = d * Math.PI / 180; g.strokeStyle = d % 45 ? '#25324e' : '#3a4868'; g.lineWidth = d % 45 ? 1 : 2; g.beginPath(); g.moveTo(cx + Math.cos(a) * Rf * .93, cy + Math.sin(a) * Rf * .93); g.lineTo(cx + Math.cos(a) * Rf, cy + Math.sin(a) * Rf); g.stroke(); }
  for (let h = 0; h <= hours; h += 1) { const a = -h * rate * Math.PI / 180; g.strokeStyle = `rgba(242,196,107,${.08 + .25 * (h / 24)})`; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - Math.cos(a) * Rf * .85, cy - Math.sin(a) * Rf * .85); g.lineTo(cx + Math.cos(a) * Rf * .85, cy + Math.sin(a) * Rf * .85); g.stroke(); }
  const a = -ang, sw = Math.sin(t * 2 * Math.PI / 1.6) * Rf * .85; g.strokeStyle = C.g; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - Math.cos(a) * Rf * .85, cy - Math.sin(a) * Rf * .85); g.lineTo(cx + Math.cos(a) * Rf * .85, cy + Math.sin(a) * Rf * .85); g.stroke();
  dot(g, cx + Math.cos(a) * sw, cy + Math.sin(a) * sw, 16, '#e7ebf4'); dot(g, cx, cy, 5, C.fg3);
  txt(g, '俯视：摆平面', cx, cy + Rf + 40, C.fg2, '500 24px "Noto Sans CJK SC",sans-serif', 'center');
  const tx = R.x + R.w * .7;
  txt(g, '巴黎 · 北纬 48.85°', tx, R.y + 150, C.fg, '700 34px "Noto Sans CJK SC",sans-serif', 'center');
  txt(g, `第 ${hours.toFixed(0)} 小时`, tx, R.y + 230, C.g, '700 52px "DejaVu Sans Mono",monospace', 'center');
  txt(g, `已转过 ${(hours * rate).toFixed(0)}°`, tx, R.y + 310, C.g, '600 34px "Noto Sans CJK SC",sans-serif', 'center');
  txt(g, '每天约 271° · 转满一圈约 31.8 小时', tx, R.y + 380, C.fg2, '500 24px "Noto Sans CJK SC",sans-serif', 'center');
  txt(g, '赤道：不转　北极：每天 360°', tx, R.y + 425, C.fg3, '500 22px "Noto Sans CJK SC",sans-serif', 'center');
};
// 量子霍尔台阶
AN.hall = (g, t, R) => {
  const x0 = R.x + 120, x1 = R.x + R.w * .66, y0 = R.y + R.h - 90, y1 = R.y + 60, Bm = 12, X = B => x0 + (B - .3) / (Bm - .3) * (x1 - x0), Y = r => y0 - r / 1.15 * (y0 - y1);
  const sg = x => 1 / (1 + Math.exp(-x)), Rxy = B => { const nu = 8 / B; let inv = 1; for (let k = 1; k < 12; k++) inv += sg((nu - (k + .5)) * 9); return 1 / inv; };
  g.strokeStyle = '#1a2236'; g.lineWidth = 1; for (let r = 0; r <= 1; r += .2) { g.beginPath(); g.moveTo(x0, Y(r)); g.lineTo(x1, Y(r)); g.stroke(); txt(g, r.toFixed(1), x0 - 14, Y(r), C.fg3, '400 18px "DejaVu Sans Mono",monospace', 'right'); }
  g.strokeStyle = '#3a4868'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y1); g.lineTo(x0, y0); g.lineTo(x1, y0); g.stroke();
  txt(g, '磁场 B →', x1, y0 + 36, C.fg3, '500 22px "Noto Sans CJK SC",sans-serif', 'right'); txt(g, '霍尔电阻 R_xy（单位 h/e²）', x0, y1 - 30, C.fg3, '500 22px "Noto Sans CJK SC",sans-serif');
  g.setLineDash([6, 6]); g.strokeStyle = C.fg3; g.lineWidth = 1.5; g.beginPath(); g.moveTo(X(.3), Y(.3 / 8)); g.lineTo(X(9.2), Y(9.2 / 8)); g.stroke(); g.setLineDash([]);
  const Be = .3 + (Bm - .3) * Math.min(1, Math.max(0, (t - .5) / 6));
  g.strokeStyle = C.g; g.lineWidth = 4.5; g.beginPath(); for (let i = 0; i <= 600; i++) { const B = .3 + (Be - .3) * i / 600, p = [X(B), Y(Rxy(B))]; i ? g.lineTo(...p) : g.moveTo(...p); } g.stroke();
  dot(g, X(Be), Y(Rxy(Be)), 9, '#fff');
  for (let k = 1; k <= 5; k++) if (Be > 8 / k + .3) txt(g, `ν = ${k}`, k === 1 ? X(10.8) : X(8 / k) + 10, Y(1 / k) - 18, C.g, '600 22px "DejaVu Sans Mono",monospace');
  const tx = R.x + R.w * .7;
  txt(g, '平台：R_xy = h / (ν e²)', tx, R.y + 140, C.fg, '700 30px "Noto Sans CJK SC",sans-serif');
  txt(g, 'ν = 1, 2, 3 … 是陈数', tx, R.y + 190, C.g, '600 28px "Noto Sans CJK SC",sans-serif');
  txt(g, 'h/e² = 25 812.807 Ω', tx, R.y + 260, C.g, '700 30px "DejaVu Sans Mono",monospace');
  txt(g, '虚线：经典霍尔效应', tx, R.y + 320, C.fg3, '500 22px "Noto Sans CJK SC",sans-serif');
  txt(g, '曲线为示意', tx, R.y + 356, C.fg3, '500 22px "Noto Sans CJK SC",sans-serif');
};

function animLayer(c, lay, name, det) {
  const cv = c.el(`<canvas class="an" width="1920" height="1080"></canvas>`, lay), g = cv.getContext('2d');
  const R = det ? { x: 100, y: 140, w: 1300, h: 800 } : { x: 100, y: 140, w: 1720, h: 800 };
  return { draw: lt => { g.clearRect(0, 0, 1920, 1080); AN[name](g, lt, R); } };
}

function build(c) {
  const sc = c.sc, n = sc.beats.length, segs = [];
  sc.beats.forEach((b, i) => {
    const st = i === 0 ? 0 : b.s - .35, en = i < n - 1 ? sc.beats[i + 1].s - .35 : sc.T, k = b.vis.length;
    b.vis.forEach((v, j) => segs.push({ v, a: st + (en - st) * j / k, b: st + (en - st) * (j + 1) / k, key: b.key, bi: i }));
  });
  // 同一动画在相邻段连续时合并成一段，避免重启
  const dets = {};
  const detOf = s => { const d = DET[s.key]; if (!d) return null; if (d[0][0] === '@') return d[0].slice(1) === s.v ? d.slice(1) : null; return d; };
  segs.forEach(s => {
    const det = detOf(s);
    s.lay = c.el(`<div class="lay"></div>`);
    const [kind, name] = s.v.split(':');
    s.obj = kind === 'img' ? imgLayer(c, s.lay, name, det) : animLayer(c, s.lay, name, det);
  });
  sc.beats.forEach((b, i) => {
    const ss = segs.filter(x => x.bi === i && detOf(x)); if (!ss.length) return;
    const d = detOf(ss[0]);
    const el = c.el(`<div class="det" style="left:1440px;top:200px"><span class="h">${d[0]}</span>${d.slice(1).map(x => `<span class="ln">${x}</span>`).join('')}</div>`);
    dets[i] = { el, a: Math.max(ss[0].a, b.s - .2), e: ss[ss.length - 1].b }; el.style.opacity = 0;
  });
  let ttl = null;
  if (!sc.chapter) {
    const [k, rest] = sc.title.split('：');
    ttl = c.el(`<div class="ttl"><div class="k">${k.replace(' · ', ' · ')}</div><h1>${rest}</h1><div class="s">${sc.ep === 1 ? '莫比乌斯带 · 截面 · 切丛 · 霍普夫纤维化' : '平行移动 · 和乐 · 陈数 · 规范场'}</div></div>`);
  }
  c.tick(t => {
    segs.forEach((s, i) => {
      const nx = segs[i + 1], fi = i === 0 ? 1 : SS((t - s.a) / .6), fo = nx ? 1 - SS((t - nx.a) / .6) : 1;
      const op = t < s.a ? 0 : Math.min(fi, fo);
      if (op <= 0) { if (s.lay.style.display !== 'none') s.lay.style.display = 'none'; return; }
      s.lay.style.display = 'block'; s.lay.style.opacity = op;
      const lt = t - s.a;
      if (s.obj.draw) s.obj.draw(lt); else s.obj.img.style.transform = `scale(${1 + s.obj.kb * Math.min(1, lt / Math.max(4, s.b - s.a + .6))})`;
    });
    Object.values(dets).forEach(({ el, a, e }) => { const u = SS((t - a - .3) / .5); el.style.opacity = Math.min(u, SS((e - t) / .4)); el.style.transform = `translateY(${(1 - u) * 14}px)`; });
    if (ttl) ttl.style.opacity = t < 4.2 ? 1 : 1 - SS((t - 4.2) / .8);
  });
}
TL.scenes.forEach(s => SCENES[s.id] = { build });
