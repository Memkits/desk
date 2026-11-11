// 《数学的地图》：通用场景。每个 beat 的画面（anim:名 / code:名）；相邻 beat 同一动画连成一段，动画函数拿到段内时间与所在 beat 序号。
window.SCENES = {}; window.AN = {}; window.CODE = {};
const SS = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const CL = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), LERP = (a, b, u) => a + (b - a) * u;
const C = { r: '#FF7A93', b: '#5CB4FF', g: '#5FE0A0', p: '#C79BFF', o: '#FFB25C', gold: '#FFD27A', ok: '#5FD39A', bad: '#FF6B6B', fg: '#E9EEF7', fg2: '#A3AEC3', fg3: '#66728C', line: '#1F2940', line2: '#2C3854', panel: '#0E1424', panel2: '#131B2E' };
const F = { sans: '"Noto Sans CJK SC",sans-serif', mono: '"DejaVu Sans Mono",monospace', serif: '"Noto Serif CJK SC",serif' };
const fnt = (w, s, f = 'sans') => `${w} ${s}px ${F[f]}`;

// 细节卡在 det.js
// ---------- 代码卡 ----------
function hl(src) {
  const cm = []; src = src.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/((?<!:)\/\/.*|\/\*.*?\*\/|(?<=\s)# .*)/g, m => { cm.push(m); return `\u0001${'x'.repeat(cm.length)}\u0002`; });
  src = src.replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, '<span class="s">$1</span>')
    .replace(/\b(function|var|let|const|return|if|else|for|while|new|import|export|from|async|await|this|null|true|false|typeof|default|struct|void|auto|static|bool|float|double|int|uint|public|private|class|using|override|foreach|in|out|continue|break)\b/g, '<span class="k">$1</span>')
    .replace(/\b(float2|float3|float4|uint2|uint3|float4x4|Texture2D|SamplerState|RWStructuredBuffer|StructuredBuffer|Vector3|Transform|FVector|FVector3d|FIntPoint|TSet|TArray|TQueue|std|Mathf|SceneManager|EStatus|Node|Agent|ISystem|SystemState|SystemAPI|LocalTransform|IComponentData|RefRW|RefRO|float3|Dictionary|Actor|Player|GameObject)\b/g, '<span class="t">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="n">$1</span>');
  return src.replace(/\u0001(x+)\u0002/g, (_, i) => `<span class="c">${cm[i.length - 1]}</span>`);
}
// 代码卡内容在 code.js

// ---------- 截图 ----------
const SHOT = {
  cern: ['info.cern.ch', 'CERN 复原的第一个网站（info.cern.ch）'],
  todomvc: ['todomvc.com', 'TodoMVC：用同一个待办应用比较各家框架'],
  vite8: ['vite.dev/blog/announcing-vite8', 'Vite 8 发布公告（2026-03-12）'],
};
function shotLayer(c, lay, name, det) {
  const [url, cap] = SHOT[name] || ['', name]; const w = det ? 1280 : 1620;
  const el = c.el(`<div class="shot" style="width:${w}px"><div class="bar"><i></i><i></i><i></i><span>${url}</span></div><div class="win"><img src="shots/${name}.jpg" onerror="this.parentNode.classList.add('miss')"><b>${cap}（截图待补）</b></div><div class="cap">${cap} · 截图来源：${url}</div></div>`, lay);
  const img = el.querySelector('img');
  return { draw: lt => { img.style.transform = `scale(${1 + Math.min(lt, 40) * .0012})`; } };
}

// ---------- 画布工具 ----------
function txt(g, s, x, y, col = C.fg2, font = fnt(600, 26), al = 'left', bl = 'middle') { g.fillStyle = col; g.font = font; g.textAlign = al; g.textBaseline = bl; g.fillText(s, x, y); }
function rr(g, x, y, w, h, r, fill, stroke, lw = 2) { g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); } }
function node(g, x, y, w, h, label, col = C.b, a = 1, sub = '') { if (a <= 0) return; g.save(); g.globalAlpha *= a; rr(g, x, y, w, h, 14, 'rgba(14,20,36,.92)', col, 2.5); txt(g, label, x + w / 2, y + h / 2 - (sub ? 12 : 0), C.fg, fnt(700, sub ? 26 : 27), 'center'); if (sub) txt(g, sub, x + w / 2, y + h / 2 + 20, C.fg3, fnt(500, 19), 'center'); g.restore(); }
function arrow(g, x0, y0, x1, y1, col = C.fg3, lw = 3, head = 12, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.strokeStyle = col; g.fillStyle = col; g.lineWidth = lw; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); const an = Math.atan2(y1 - y0, x1 - x0); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 - head * Math.cos(an - .45), y1 - head * Math.sin(an - .45)); g.lineTo(x1 - head * Math.cos(an + .45), y1 - head * Math.sin(an + .45)); g.fill(); g.restore(); }
function line(g, pts, col = C.fg3, lw = 2, dash = null) { g.save(); g.strokeStyle = col; g.lineWidth = lw; if (dash) g.setLineDash(dash); g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); g.restore(); }
function dot(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
function pop(t, t0, d = .5) { return SS((t - t0) / d); }
function bars(g, x, y, w, h, items, t, opts = {}) { // items: [label, value, col]
  const max = opts.max || Math.max(...items.map(i => i[1])); const bw = w / items.length;
  items.forEach(([lab, v, col, sub], i) => { const u = pop(t, (opts.t0 || 0) + i * (opts.gap ?? .25), .6); const bh = h * v / max * u; const X = x + i * bw + bw * .18; g.fillStyle = col || C.b; rr(g, X, y + h - bh, bw * .64, bh, 8, col || C.b); txt(g, lab, X + bw * .32, y + h + 26, C.fg2, fnt(600, 22), 'center'); if (u > .9) txt(g, opts.fmt ? opts.fmt(v) : v, X + bw * .32, y + h - bh - 20, C.fg, fnt(700, 24, 'mono'), 'center'); if (sub) txt(g, sub, X + bw * .32, y + h + 54, C.fg3, fnt(500, 18), 'center'); });
}
function wrapTxt(g, s, x, y, maxW, lh, col, font) { g.font = font; const out = []; let cur = ''; for (const ch of s) { if (g.measureText(cur + ch).width > maxW && cur) { out.push(cur); cur = ch.trim() ? ch : ''; } else cur += ch; } if (cur) out.push(cur); out.forEach((l, i) => txt(g, l, x, y + i * lh, col, font)); return out.length; }
function title(g, s, R, sub) { txt(g, s, R.x + 20, R.y + 26, C.fg, fnt(700, 30)); if (sub) txt(g, sub, R.x + 20, R.y + 66, C.fg3, fnt(500, 22)); }
function tag(g, s, x, y, col = C.b, a = 1) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.font = fnt(600, 20); const w = g.measureText(s).width + 28; rr(g, x, y - 18, w, 36, 18, 'rgba(255,255,255,.06)', col, 1.5); txt(g, s, x + w / 2, y, col, fnt(600, 20), 'center'); g.restore(); return w; }


// ---------- 通用版式 ----------
function card(g, x, y, w, h, head, lines, col = C.b, a = 1, hi = false, fs = 22) {
  if (a <= 0) return; g.save(); g.globalAlpha = a;
  rr(g, x, y, w, h, 16, hi ? 'rgba(255,210,122,.09)' : 'rgba(14,20,36,.92)', hi ? C.gold : col, hi ? 3 : 2);
  txt(g, head, x + 22, y + 34, hi ? C.gold : col, fnt(800, 26));
  let yy = y + 78; const lh = Math.round(fs * 1.4);
  (lines || []).forEach(l => { dot(g, x + 28, yy, 4, col); const n = wrapTxt(g, l, x + 44, yy, w - 66, lh, C.fg2, fnt(500, fs)); yy += n * lh + 8; });
  g.restore();
}
function ticks(g, x, y, u, col = C.ok) { if (u <= 0) return; const P = [[x + 6, y + 1], [x + 12, y + 8], [x + 24, y - 9]]; const L1 = 9.2, L2 = 20.8, d = u * (L1 + L2); const pts = [P[0]]; if (d <= L1) pts.push([LERP(P[0][0], P[1][0], d / L1), LERP(P[0][1], P[1][1], d / L1)]); else { pts.push(P[1]); const v = (d - L1) / L2; pts.push([LERP(P[1][0], P[2][0], v), LERP(P[1][1], P[2][1], v)]); } line(g, pts, col, 4); }
function cross(g, x, y, u, col = C.bad, s = 11) { if (u <= 0) return; g.save(); g.globalAlpha = u; line(g, [[x - s, y - s], [x + s, y + s]], col, 4); line(g, [[x + s, y - s], [x - s, y + s]], col, 4); g.restore(); }
function check(g, x, y, s, u, col = C.ok, fs = 24, sub = '') { rr(g, x, y - 15, 30, 30, 7, 'rgba(14,20,36,.9)', u > 0 ? col : C.line2, 2); ticks(g, x + 1, y + 1, u, col); txt(g, s, x + 46, y, u > 0 ? C.fg : C.fg2, fnt(600, fs)); if (sub) { g.font = fnt(600, fs); const w = g.measureText(s).width; txt(g, sub, x + 66 + w, y, C.fg3, fnt(500, fs - 4)); } }
function banner(g, R, s, u, col = C.gold) { if (u <= 0) return; g.save(); g.globalAlpha = u; rr(g, R.x + 10, R.y + R.h - 76, R.w - 20, 66, 14, 'rgba(255,210,122,.08)', col); txt(g, s, R.x + 36, R.y + R.h - 43, C.fg, fnt(600, 25)); g.restore(); }
function packet(g, pts, ph, col = C.gold, r = 9) { // 沿折线移动，ph ∈ [0,1]
  const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let d = CL(ph) * tot; for (let i = 0; i < L.length; i++) { if (d <= L[i] || i === L.length - 1) { const u = L[i] ? CL(d / L[i]) : 0; dot(g, LERP(pts[i][0], pts[i + 1][0], u), LERP(pts[i][1], pts[i + 1][1], u), r, col); return; } d -= L[i]; }
}
function person(g, x, y, col = C.fg2, s = 1) { g.save(); g.fillStyle = col; g.beginPath(); g.arc(x, y - 14 * s, 11 * s, 0, 7); g.fill(); g.beginPath(); g.arc(x, y + 18 * s, 18 * s, Math.PI, 0); g.fill(); g.restore(); }
function bot(g, x, y, col = C.p, s = 1) { g.save(); rr(g, x - 18 * s, y - 22 * s, 36 * s, 30 * s, 8 * s, col); dot(g, x - 7 * s, y - 8 * s, 4 * s, '#0B1020'); dot(g, x + 7 * s, y - 8 * s, 4 * s, '#0B1020'); line(g, [[x, y - 22 * s], [x, y - 30 * s]], col, 3); dot(g, x, y - 32 * s, 4 * s, col); rr(g, x - 14 * s, y + 12 * s, 28 * s, 16 * s, 5 * s, col); g.restore(); }
function hdr(g, R, s, sub, col = C.fg) { txt(g, s, R.x + 20, R.y + 22, col, fnt(800, 32)); if (sub) txt(g, sub, R.x + 20, R.y + 64, C.fg3, fnt(500, 22)); }
function chip(g, s, x, y, col = C.b, a = 1, fs = 22) { if (a <= 0) return 0; g.save(); g.globalAlpha *= a; g.font = fnt(700, fs); const w = g.measureText(s).width + 32; rr(g, x, y - fs * .9, w, fs * 1.8, 10, 'rgba(14,20,36,.95)', col, 2); txt(g, s, x + w / 2, y, C.fg, fnt(700, fs), 'center'); g.restore(); return w; }

// ---------- 场景组装 ----------
function hlx(src) { return src.split('\n').map(l => l.startsWith('!!') ? `<span class="hl">${hl(l.slice(2))}</span>` : hl(l)).join('\n'); }
function codeLayer(c, lay, name, det) {
  const d = CODE[name]; const w = det ? 1300 : 1600;
  const body = d.cols ? `<div class="cols">${d.cols.map(([h, src, col]) => `<div class="col"><div class="ch" style="color:${col || '#A3AEC3'}">${h}</div><pre style="${d.fs ? `font-size:${d.fs}px` : ''}">${hlx(src)}</pre></div>`).join('')}</div>` : `<pre style="${d.fs ? `font-size:${d.fs}px` : ''}">${hlx(d.src)}</pre>`;
  c.el(`<div class="codecard" style="width:${w}px"><div class="fn"><i></i><i></i><i></i>${d.fn}</div>${body}${d.note ? `<div class="note">${d.note}</div>` : ''}</div>`, lay);
  return {};
}
function animLayer(c, lay, name, det) {
  const cv = c.el(`<canvas class="an" width="1920" height="1080"></canvas>`, lay), g = cv.getContext('2d');
  const R = det ? { x: 100, y: 140, w: 1300, h: 820 } : { x: 100, y: 140, w: 1720, h: 820 };
  return { draw: (lt, st) => { g.clearRect(0, 0, 1920, 1080); (AN[name] || AN._missing)(g, lt, R, st); } };
}
AN._missing = (g, t, R) => txt(g, '（画面待做）', R.x + R.w / 2, R.y + R.h / 2, C.fg3, fnt(600, 40), 'center');

function build(c) {
  const sc = c.sc, n = sc.beats.length, segs = [];
  sc.beats.forEach((b, i) => {
    const st = i === 0 ? 0 : b.s - .35, en = i < n - 1 ? sc.beats[i + 1].s - .35 : sc.T;
    const v = b.vis[0], last = segs[segs.length - 1];
    if (last && last.v === v) { last.b = en; last.beats.push({ i, s: b.s }); return; }
    segs.push({ v, a: st, b: en, key: b.key, bi: i, beats: [{ i, s: b.s }] });
  });
  const detOf = i => DET[sc.beats[i].key] || null;
  segs.forEach(s => { s.lay = c.el(`<div class="lay"></div>`); const [kind, name] = s.v.split(':'); const det = s.beats.some(b => detOf(b.i)); s.obj = kind === 'code' ? codeLayer(c, s.lay, name, det) : kind === 'shot' ? shotLayer(c, s.lay, name, det) : animLayer(c, s.lay, name, det); });
  const dets = [];
  sc.beats.forEach((b, i) => { const d = detOf(i); if (!d) return; const e = i < n - 1 ? sc.beats[i + 1].s - .3 : sc.T - .3;
    const el = c.el(`<div class="det" style="left:1440px;top:200px"><span class="h">${d[0]}</span>${d.slice(1).map(x => `<span class="ln">${x}</span>`).join('')}</div>`); el.style.opacity = 0; dets.push({ el, a: b.s + .4, e }); });
  let ttl = null;
  if (!sc.chapter) { const [k, rest] = sc.title.split('：'); const subs = { 1: '约前 2 万年 – 公元 500 年 · 两河 · 尼罗河 · 希腊 · 汉魏南朝 · 印度', 2: '500 – 1650 · 零 · 巴格达 · 三角学 · 宋元 · 喀拉拉 · 意大利', 3: '1650 – 1900 · 微积分 · 欧拉 · 巴黎与哥廷根 · 和算 · 非欧几何', 4: '1900 – 今 · 希尔伯特 · 大迁徙 · 东亚 · 世纪难题 · AI 与证明' }; ttl = c.el(`<div class="ttl"><div class="k">${k}</div><h1>${rest}</h1><div class="s">${subs[sc.ep]}</div></div>`); }
  c.tick(t => {
    segs.forEach((s, i) => {
      const nx = segs[i + 1], fi = i === 0 ? 1 : SS((t - s.a) / .6), fo = nx ? 1 - SS((t - nx.a) / .6) : 1;
      const op = t < s.a ? 0 : Math.min(fi, fo);
      if (op <= 0) { if (s.lay.style.display !== 'none') s.lay.style.display = 'none'; return; }
      s.lay.style.display = 'block'; s.lay.style.opacity = op;
      if (s.obj.draw) { let k = 0; for (let j = 1; j < s.beats.length; j++) if (t >= s.beats[j].s) k = j; s.obj.draw(t - s.a, { k, tk: t - (k ? s.beats[k].s : s.a), n: s.beats.length, bi: s.beats[k].i, D: s.b - s.a, bs: s.beats.map((x, j) => j ? x.s - s.a : 0), bis: s.beats.map(x => x.i), sid: sc.id }); }
    });
    dets.forEach(({ el, a, e }) => { const u = SS((t - a) / .5); el.style.opacity = Math.min(u, SS((e - t) / .4)); el.style.transform = `translateY(${(1 - u) * 14}px)`; });
    if (ttl) ttl.style.opacity = t < 4.5 ? 1 : 1 - SS((t - 4.5) / .8);
  });
}
TL.scenes.forEach(s => SCENES[s.id] = { build });
