// 《沙洲战备推演》通用部件：阶段配色、地图、周页、统计卡
const HSH = (a, b = 0) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
const al = (g, a, f) => { if (a <= 0) return; g.save(); g.globalAlpha *= Math.min(1, a); f(); g.restore(); };
const PH = { 1: C.g, 2: C.o, 3: C.p, 4: C.b };
const PHN = { 1: '守住', 2: '强军', 3: '外交分化', 4: '拓土' };
const phaseOf = id => { const n = +id.slice(1); return n <= 10 ? 1 : n <= 24 ? 2 : n <= 38 ? 3 : 4; };
const fmtKg = v => v >= 1000 ? (v / 1000).toFixed(v % 1000 ? (v % 100 ? 2 : 1) : 0).replace(/\.?0+$/, '') + ' t' : v + ' kg';
const fmtY = v => v >= 10000 ? (v / 10000).toFixed(v % 10000 ? (v % 1000 ? 2 : 1) : 0).replace(/\.?0+$/, '') + ' 万元' : Math.round(v) + ' 元';
const cnum = (v, u) => Math.round(v * SS(u));
function lines(g, s, maxW, font) { g.font = font; const out = []; let cur = ''; for (const ch of s) { if (g.measureText(cur + ch).width > maxW && cur) { out.push(cur); cur = ch.trim() ? ch : ''; } else cur += ch; } if (cur) out.push(cur); return out; }
function para(g, s, x, y, maxW, fs, col = C.fg2, w = 500, lh = 1.45) { const L = lines(g, s, maxW, fnt(w, fs)); L.forEach((l, i) => txt(g, l, x, y + i * fs * lh, col, fnt(w, fs))); return L.length * fs * lh; }
function label(g, s, x, y, col = C.gold) { txt(g, s, x, y, col, fnt(700, 19)); }
// 大数字卡
function stat(g, x, y, w, h, val, lab, col, u, sub) {
  if (u <= 0) return; al(g, u, () => { g.translate(0, (1 - u) * 14); rr(g, x, y, w, h, 16, 'rgba(14,20,36,.92)', col, 2.5);
    txt(g, val, x + w / 2, y + h * .42, col, fnt(800, Math.min(60, h * .36), 'serif'), 'center'); txt(g, lab, x + w / 2, y + h * .76, C.fg2, fnt(600, 23), 'center');
    if (sub) txt(g, sub, x + w / 2, y + h + 26, C.fg3, fnt(500, 19), 'center'); });
}
// 一排卡片：items = [head, body, col]
function cards(g, t, R, items, o = {}) {
  const n = items.length, cols = o.cols || n, gap = o.gap ?? 28, w = (R.w - gap * (cols - 1)) / cols, h = o.h || 220;
  items.forEach(([hd, body, col, icon], i) => {
    const u = pop(t, (o.t0 ?? .3) + i * (o.dt ?? .5)), x = R.x + (i % cols) * (w + gap), y = (o.y ?? R.y + 120) + Math.floor(i / cols) * (h + gap);
    al(g, u * (o.dim && o.dim(i) ? .3 : 1), () => { g.translate(0, (1 - u) * 16); rr(g, x, y, w, h, 18, o.hi && o.hi(i) ? 'rgba(255,210,122,.08)' : 'rgba(14,20,36,.92)', o.hi && o.hi(i) ? C.gold : (col || C.b), 2.5);
      let yy = y + 50; if (icon) { txt(g, icon, x + 28, y + 52, col || C.b, fnt(800, 44, 'serif')); yy = y + 118; }
      txt(g, hd, x + 28, icon ? y + 52 : yy, C.fg, fnt(800, o.hs || 30), icon ? 'left' : 'left'); if (icon) { g.font = fnt(800, 44, 'serif'); }
      if (body) para(g, body, x + 28, icon ? y + 108 : yy + 50, w - 56, o.fs || 22, C.fg2); });
  });
}
function iconCards(g, t, R, items, o = {}) { // items: [big, head, body, col]
  const n = items.length, cols = o.cols || n, gap = o.gap ?? 26, w = (R.w - gap * (cols - 1)) / cols, h = o.h || 300;
  items.forEach(([big, hd, body, col], i) => {
    const u = pop(t, (o.t0 ?? .3) + i * (o.dt ?? .5)), x = R.x + (i % cols) * (w + gap), y = (o.y ?? R.y + 120) + Math.floor(i / cols) * (h + gap);
    al(g, u * (o.dim && o.dim(i) ? .3 : 1), () => { g.translate(0, (1 - u) * 16); const hi = o.hi && o.hi(i); rr(g, x, y, w, h, 18, hi ? 'rgba(255,210,122,.08)' : 'rgba(14,20,36,.92)', hi ? C.gold : col, hi ? 3.5 : 2.5);
      txt(g, big, x + w / 2, y + (o.by || 78), col, fnt(800, o.bs || 50, 'serif'), 'center'); txt(g, hd, x + w / 2, y + (o.by || 78) + 66, C.fg, fnt(800, o.hs || 28), 'center');
      if (body) { const L = lines(g, body, w - 48, fnt(500, o.fs || 21)); L.forEach((l, k) => txt(g, l, x + w / 2, y + (o.by || 78) + 112 + k * (o.fs || 21) * 1.45, C.fg2, fnt(500, o.fs || 21), 'center')); } });
  });
}
function hbar(g, x, y, w, h, f, col, bg = 'rgba(255,255,255,.05)') { rr(g, x, y, w, h, h / 2, bg, C.line2, 1.5); if (f > 0) rr(g, x, y, Math.max(h, w * Math.min(1, f)), h, h / 2, col); }
function ttlTxt(g, R, s, sub, col = C.fg, a = 1) { al(g, a, () => { txt(g, s, R.x, R.y + 30, col, fnt(800, 36, 'serif')); if (sub) txt(g, sub, R.x, R.y + 76, C.fg3, fnt(500, 22)); }); }
function bottomNote(g, R, s, u, col = C.gold) { banner(g, { x: R.x - 10, y: R.y, w: R.w + 20, h: R.h }, s, u, col); }

// ---------- 地图（架空示意）：km 坐标，x 向东，y 向北 ----------
const PL = { sz: [0, 0], sc: [-85, -85], wl: [-283, 283], v1: [62, -52], v2: [118, 14], v3: [-26, -108], v4: [48, 128], v5: [128, -62] };
const RIVER = [[-60, -150], [-35, -95], [-10, -40], [0, -5], [20, 30], [55, 60], [100, 85], [150, 95], [200, 100]];
const ROAD = [[-283, 283], [-230, 220], [-170, 160], [-110, 95], [-50, 40], [0, 0]];
function mapView(R, cx, cy, s) { return { R, P: ([x, y]) => [R.x + R.w / 2 + (x - cx) * s, R.y + R.h / 2 - (y - cy) * s], s }; }
function drawMap(g, V, o = {}) {
  const { R, P } = V; g.save(); g.beginPath(); g.roundRect(R.x, R.y, R.w, R.h, 18); g.clip();
  rr(g, R.x, R.y, R.w, R.h, 18, '#0D1220'); // 沙地纹理
  for (let i = 0; i < 260; i++) { const x = R.x + HSH(i, 1) * R.w, y = R.y + HSH(i, 2) * R.h; g.fillStyle = `rgba(255,210,122,${.03 + HSH(i, 3) * .05})`; g.beginPath(); g.ellipse(x, y, 30 + HSH(i, 4) * 90, 6 + HSH(i, 5) * 10, -.3, 0, 7); g.fill(); }
  if (o.steppe) { const [sx, sy] = P([-120, 330]); g.fillStyle = 'rgba(95,224,160,.05)'; g.beginPath(); g.ellipse(sx, sy, 520 * V.s, 150 * V.s, 0, 0, 7); g.fill(); }
  line(g, RIVER.map(P), 'rgba(92,180,255,.55)', 4); const rp = P([150, 95]); txt(g, '党河（示意）', rp[0] - 10, rp[1] - 22, 'rgba(92,180,255,.8)', fnt(600, 19), 'right');
  if (o.road) line(g, ROAD.map(P), 'rgba(255,210,122,.35)', 2.5, [8, 10]);
  g.restore();
  rr(g, R.x, R.y, R.w, R.h, 18, null, C.line2, 1.5);
  txt(g, '地图为架空示意，距离按推演假设', R.x + R.w - 20, R.y + R.h - 22, C.fg3, fnt(500, 17), 'right');
}
function site(g, V, key, name, kind, col, a = 1, sub = '') {
  if (a <= 0) return; const [x, y] = V.P(PL[key] || key); al(g, a, () => {
    if (kind === 'city') { rr(g, x - 22, y - 22, 44, 44, 6, 'rgba(14,20,36,.95)', col, 3.5); rr(g, x - 9, y - 9, 18, 18, 3, col); }
    else if (kind === 'big') { rr(g, x - 30, y - 30, 60, 60, 8, 'rgba(14,20,36,.95)', col, 3.5); for (let i = 0; i < 4; i++) dot(g, x - 12 + (i % 2) * 24, y - 12 + Math.floor(i / 2) * 24, 6, col); }
    else if (kind === 'fort') { g.beginPath(); g.moveTo(x, y - 22); g.lineTo(x + 20, y + 14); g.lineTo(x - 20, y + 14); g.closePath(); g.fillStyle = 'rgba(14,20,36,.95)'; g.fill(); g.strokeStyle = col; g.lineWidth = 3; g.stroke(); }
    else { g.beginPath(); g.arc(x, y, 13, 0, 7); g.fillStyle = 'rgba(14,20,36,.95)'; g.fill(); g.strokeStyle = col; g.lineWidth = 3; g.stroke(); dot(g, x, y, 5, col); }
    txt(g, name, x, y + (kind === 'big' ? 56 : 42), C.fg, fnt(700, kind === 'v' ? 20 : 24), 'center');
    if (sub) txt(g, sub, x, y + (kind === 'big' ? 86 : 70), C.fg3, fnt(500, 18), 'center');
  });
}
function route(g, V, pts, u, col = C.gold, lw = 4, dash = [10, 8]) {
  if (u <= 0) return; const P = pts.map(V.P); const L = []; let tot = 0; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); L.push(d); tot += d; }
  let rem = tot * CL(u); const out = [P[0]]; for (let i = 0; i < L.length && rem > 0; i++) { const f = Math.min(1, rem / L[i]); out.push([LERP(P[i][0], P[i + 1][0], f), LERP(P[i][1], P[i + 1][1], f)]); rem -= L[i]; }
  line(g, out, col, lw, dash); return out[out.length - 1];
}

// ---------- 周页 ----------
AN.week = (g, t, R, st, id) => {
  const w = WEEKS[id]; if (!w) return AN._missing(g, t, R); const ph = phaseOf(id), col = PH[ph], D = st.D || 20, two = !!w.to;
  const wk = two ? `${w.id}–${w.to.slice(1)}` : w.id;
  // 页眉
  al(g, pop(t, .1), () => { g.font = fnt(800, 40, 'mono'); const ww = g.measureText(wk).width; txt(g, wk, R.x, R.y + 34, col, fnt(800, 40, 'mono'));
    txt(g, w.title, R.x + ww + 28, R.y + 34, C.fg, fnt(800, 44, 'serif')); tag(g, '阶段' + '一二三四'[ph - 1] + ' · ' + PHN[ph], R.x + R.w - 210, R.y + 32, col, 1); });
  const LX = R.x, LW = 800, RX = R.x + 860, RW = R.w - 860;
  const cfs = w.change.length > 130 ? 21 : 23, cl = lines(g, w.change, R.w - 44, fnt(600, cfs)).length, sh = 58 + cl * cfs * 1.4 + 6, by = R.y + 822 - sh;
  // 左栏：目标 + 行动
  let y = R.y + 100;
  al(g, pop(t, .4), () => { label(g, '本周目标', LX, y); });
  const gh = lines(g, w.goal, LW, fnt(700, 27)).length; al(g, pop(t, .5), () => para(g, w.goal, LX, y + 38, LW, 27, C.fg, 700, 1.35)); y += 38 + gh * 27 * 1.35 + 18;
  al(g, pop(t, .8), () => label(g, '行动', LX, y)); y += 34;
  let fs = 23; const room = by - 16 - y; const cnt = f => w.acts.reduce((a, s) => a + lines(g, s, LW - 30, fnt(500, f)).length * f * 1.42 + 10, 0);
  while (fs > 18 && cnt(fs) > room) fs--;
  w.acts.forEach((s, i) => { const u = pop(t, 1 + i * .45), yy = y; al(g, u, () => { dot(g, LX + 7, yy + fs * .05, 4.5, col); para(g, s, LX + 26, yy, LW - 30, fs, C.fg2, 500, 1.42); }); y += lines(g, s, LW - 30, fnt(500, fs)).length * fs * 1.42 + 10; });
  // 右栏：物资表
  const t1 = Math.min(Math.max(2, D * .22), 7), its = w.items, mx = Math.max(...its.map(x => x[1]));
  const rh = Math.min(46, 250 / Math.max(1, its.length)); let ry = R.y + 100;
  al(g, pop(t, t1 - .3), () => { label(g, two ? '这两周带回' : '本周带回', RX, ry); txt(g, '重量', RX + 560, ry, C.fg3, fnt(600, 18), 'left'); txt(g, '花费', RX + RW, ry, C.fg3, fnt(600, 18), 'right'); });
  ry += 40;
  its.forEach(([nm, kg, yuan, raw], i) => { const u = pop(t, t1 + i * .3, .6), yy = ry + i * rh; al(g, Math.min(1, u * 1.6), () => {
    let n = nm; g.font = fnt(600, 21); while (g.measureText(n).width > 330 && n.length > 4) n = n.slice(0, -2) + '…';
    txt(g, n.replace(/……$/, '…'), RX, yy + rh / 2 - 6, C.fg, fnt(600, 21)); const bw = 200 * Math.sqrt(kg / mx) * SS(u);
    rr(g, RX + 345, yy + rh / 2 - 17, Math.max(4, bw), 22, 6, /粮|麦|米/.test(nm) ? 'rgba(255,210,122,.75)' : col + 'AA');
    txt(g, raw.replace('≈', ''), RX + 560, yy + rh / 2 - 6, C.fg2, fnt(600, 20, 'mono')); txt(g, yuan ? fmtY(yuan) : '—', RX + RW, yy + rh / 2 - 6, C.fg2, fnt(600, 20, 'mono'), 'right'); }); });
  ry += its.length * rh + 6;
  const t2 = t1 + its.length * .3 + .3, [tk, ty] = w.total || [0, 0];
  al(g, pop(t, t2), () => { line(g, [[RX, ry], [RX + RW, ry]], C.line2, 1.5); txt(g, '合计', RX, ry + 30, C.fg, fnt(800, 23)); txt(g, '≈ ' + fmtKg(tk), RX + 560, ry + 30, C.fg, fnt(800, 22, 'mono')); txt(g, '≈ ' + fmtY(ty), RX + RW, ry + 30, C.gold, fnt(800, 22, 'mono'), 'right'); });
  // 额度条
  const net = two ? 13600 : 6800, f = tk / net, u3 = pop(t, t2 + .4, 1); ry += 64;
  al(g, u3, () => { txt(g, `${two ? '两周' : '本周'}净额度 ${net / 1000} t`, RX, ry, C.fg3, fnt(600, 19)); txt(g, tk ? (f > 1 ? '超出部分用累积额度' : `用了 ${Math.round(f * 100)}%`) : '随军未运货，额度累积', RX + RW, ry, f > 1 ? C.gold : C.fg2, fnt(700, 19), 'right');
    hbar(g, RX, ry + 18, RW, 20, Math.min(1, f) * SS(u3), f > 1 ? C.gold : col); if (f > 1) txt(g, '+' + fmtKg(Math.round((tk - net) / 10) * 10), RX + RW - 10, ry + 29, '#1a1408', fnt(800, 15, 'mono'), 'right'); });
  // 风险与合理性（右栏下方）
  const t4 = Math.min(Math.max(t2 + 1.4, D * .42), D - 3); ry += 66; let rf = 20; while (rf > 16 && ry + 30 + lines(g, w.risk, RW, fnt(500, rf)).length * rf * 1.4 > by - 10) rf--;
  al(g, pop(t, t4), () => { label(g, '风险与合理性', RX, ry, C.fg3); para(g, w.risk, RX, ry + 30, RW, rf, C.fg2, 500, 1.4); });
  // 沙洲侧变化（底栏）
  const t5 = Math.min(Math.max(t4 + 1.2, D * .58), D - 2), u5 = pop(t, t5, .7);
  al(g, u5, () => { g.translate(0, (1 - u5) * 12); rr(g, R.x - 4, by, R.w + 8, sh, 16, 'rgba(95,211,154,.07)', C.ok, 2); label(g, '沙洲侧变化', R.x + 22, by + 30, C.ok); para(g, w.change, R.x + 22, by + 64, R.w - 44, cfs, C.fg, 600, 1.4); });
};
