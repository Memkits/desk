// 地图场景工具：一张常驻的卫星地图（#mapc），每个场景用关键帧驱动相机、年份和图层。
window.SCENES = {};
const S = (id, build) => SCENES[id] = { build };
let MAP = null;
const { ss, clamp, yearStr } = GEO;
const HOME = { lon: 108, lat: 34.5, d: 40, tilt: 30, head: 0 };
async function MAPINIT() {
  MAP = GEO.create(THREE, document.getElementById('mapc'), { preserve: true, base: '', aa: false, aniso: 4, dpr: Math.min(1, devicePixelRatio || 1) });
  MAP.resize(1920, 1080); await MAP.load(); MAP.setView(HOME); MAP.update({ year: 2000 });
  // 预热：每张近景贴图先上传一次
  Object.values(MAP.close).forEach(c => { c.m.visible = true; c.mat.uniforms.uA.value = .001; }); MAP.r.render(MAP.sc, MAP.cam); Object.values(MAP.close).forEach(c => c.m.visible = false);
}
// 分段平滑插值：keys = [[t, v], ...]
function kv(keys, t) {
  if (!Array.isArray(keys)) return keys;
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) { const [t0, a] = keys[i - 1], [t1, b] = keys[i], u = ss((t - t0) / (t1 - t0)); return typeof a === 'number' ? a + (b - a) * u : a; }
  return keys[keys.length - 1][1];
}
// 年份插值：在“距今年数”的对数空间里插
function ky(keys, t) {
  if (!Array.isArray(keys)) return keys;
  const L = y => Math.log(GEO.AGE(y)), E = l => 2030 - Math.exp(l);
  return E(kv(keys.map(([tt, y]) => [tt, L(y)]), t));
}
function kview(keys, t) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) { const [t0, a] = keys[i - 1], [t1, b] = keys[i], u = ss((t - t0) / (t1 - t0)), o = {};
    for (const k of ['lon', 'lat', 'tilt', 'head']) o[k] = a[k] + (b[k] - a[k]) * u;
    // 远—近—远：距离在对数空间插值；跨度大时中途先拉远一点，像飞过去
    const la = Math.log(a.d), lb = Math.log(b.d), far = Math.hypot(b.lon - a.lon, b.lat - a.lat) / Math.max(a.d, b.d);
    o.d = Math.exp(la + (lb - la) * u + Math.sin(u * Math.PI) * Math.min(1.2, far * .8)); return o; }
  return keys[keys.length - 1][1];
}
const toSet = v => v === true || v === false || v === 'auto' ? v : new Set(v);
// 年份时间轴（底部）
const ERAS = [[-2200000, -10000, '#ff9fb2'], [-10000, -2000, '#8ff0b4'], [-2000, -221, '#ffd27a'], [-221, 220, '#ffe9a8']];
function timeline(c) {
  const x0 = 100, w = 1720, X = y => x0 + (1 - GEO.tPos(y)) * w;
  const el = c.el(`<div class="tlb"><div class="bar">${ERAS.map(([a, b, col]) => `<i style="left:${X(a) - x0}px;width:${X(b) - X(a)}px;background:${col}"></i>`).join('')}</div>
    ${[[-2000000, '200万年前'], [-500000, '50万'], [-100000, '10万'], [-20000, '2万'], [-8000, '1万'], [-3000, '前3000'], [-1000, '前1000'], [0, '公元']].map(([y, t]) => `<span class="tk" style="left:${X(y) - x0}px">${t}</span>`).join('')}
    <b class="mk"></b></div>`);
  const yr = c.el(`<div class="yrbig"><div class="y"></div><div class="e"></div></div>`);
  return { el, yr, set(y, era) { el.querySelector('.mk').style.left = (X(y) - x0) + 'px'; const t = yearStr(y), q = yr.firstChild; if (q.textContent !== t) q.textContent = t; const e = yr.lastChild; if (e.textContent !== (era || '')) e.textContent = era || ''; } };
}
// 地图场景：cfg 里的每一项都可以是常量或关键帧
function mapScene(c, cfg) {
  const ov = c.el(`<div class="mov"></div>`), svg = c.el(`<svg class="msvg" width="1920" height="1080" viewBox="0 0 1920 1080"></svg>`);
  const tl = cfg.timeline === false ? null : timeline(c);
  const labs = new Map(), clabs = [];
  MAP.sites.forEach(s => { const d = document.createElement('div'); d.className = 'mlab ' + s.k; d.textContent = s.n; d.style.display = 'none'; ov.appendChild(d); labs.set(s.id, d); });
  MAP.cults.forEach(q => { const d = document.createElement('div'); d.className = 'clab'; d.textContent = q.n; d.style.display = 'none'; ov.appendChild(d); clabs.push(d); });
  const boxes = (cfg.boxes || []).map(b => { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.innerHTML = `<polygon fill="${b.fill || 'rgba(255,210,122,.10)'}" stroke="${b.col || '#ffd27a'}" stroke-width="3" stroke-dasharray="${b.dash || '10 7'}"/><text font-size="24" font-weight="700" fill="#fff" stroke="#000" stroke-width="5" paint-order="stroke" text-anchor="middle">${b.lab || ''}</text>`; svg.appendChild(g); return { ...b, g }; });
  const pins = (cfg.pins || []).map(p => { const d = c.el(`<div class="mpin"><b></b><span>${p.lab}</span></div>`, ov); return { ...p, d }; });
  c.tick(t => {
    const year = ky(cfg.year, t), view = kview(cfg.view, t);
    MAP.setView(view);
    const close = {}; Object.entries(cfg.close || {}).forEach(([k, v]) => close[k] = kv(v, t));
    const st = { year, t, sites: cfg.sites === undefined ? 'auto' : toSet(kv(cfg.sites, t)), cults: toSet(kv(cfg.cults ?? true, t)), links: toSet(kv(cfg.links ?? true, t)), lgm: kv(cfg.lgm || 0, t), dim: kv(cfg.dim || 0, t), close, focus: kv(cfg.focus || null, t), dot: kv(cfg.dot || 1.2, t), force: cfg.force ? new Set(cfg.force) : null, forceA: cfg.forceA ? kv(cfg.forceA, t) : 1 };
    MAP.update(st);
    if (tl) tl.set(year, cfg.era ? kv(cfg.era, t) : '');
    const showLab = kv(cfg.labels ?? 1, t), only = cfg.labelOnly ? new Set(kv(cfg.labelOnly, t)) : null;
    MAP.sites.forEach(s => { const d = labs.get(s.id), [x, y, vis] = MAP.project(s.lon, s.lat); const on = vis && s.a > .3 && showLab > .02 && (!only || only.has(s.id)) && x > 60 && x < 1860 && y > 120 && y < 900;
      d.style.display = on ? '' : 'none'; if (on) { d.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`; d.style.opacity = Math.min(1, s.a * 1.2) * showLab; d.classList.toggle('on', st.focus === s.id); } });
    const cl = kv(cfg.cultLabels ?? 1, t);
    MAP.cults.forEach((q, i) => { const d = clabs[i], [x, y, vis] = MAP.project(q.lon, q.lat - q.ry * .1); const on = vis && q.a > .25 && cl > .02 && view.d > 7; d.style.display = on ? '' : 'none'; if (on) { d.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`; d.style.opacity = q.a * cl; } });
    boxes.forEach(b => { const a = kv(b.a, t); b.g.style.display = a > .01 ? '' : 'none'; if (a <= .01) return; b.g.style.opacity = a;
      const dl = b.w / 2 / (111.32 * Math.cos(b.lat * Math.PI / 180)), dh = b.h / 2 / 110.57;
      const P = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, j]) => MAP.project(b.lon + i * dl, b.lat + j * dh, .004));
      b.g.firstChild.setAttribute('points', P.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' '));
      const cx = P.reduce((s, p) => s + p[0], 0) / 4, cy = P.reduce((s, p) => s + p[1], 0) / 4, ys = P.map(p => p[1]); b.g.lastChild.setAttribute('x', cx); b.g.lastChild.setAttribute('y', b.pos === 'in' ? cy + 9 : b.pos === 'bottom' ? Math.max(...ys) + 32 : Math.min(...ys) - 12); });
    pins.forEach(p => { const a = kv(p.a, t), [x, y] = MAP.project(p.lon, p.lat, .004); p.d.style.display = a > .01 ? '' : 'none'; p.d.style.opacity = a; p.d.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`; });
  });
  return { ov, svg };
}
const at = (x, y, w, html, cls = 'card') => `<div class="${cls}" style="left:${x}px;top:${y}px;width:${w}px">${html}</div>`;
const card = (x, y, w, html) => at(x, y, w, html, 'card');
const det = (x, y, w, h, body, small) => at(x, y, w, `<span class="h">${h}</span>${body}${small ? `<small>${small}</small>` : ''}`, 'det');
const show = (c, html, t0, t1, o = {}) => { const e = c.el(html); c.in(e, t0, o); if (t1 != null) c.out(e, t1); return e; };
// 遗址信息卡（右侧）
const siteCard = (c, id, t0, t1, extra = '') => { const s = ARCH.S.find(q => q.id === id); const span = s.t0 === s.t1 ? yearStr(s.t0) : `${yearStr(s.t0)} — ${yearStr(s.t1).replace(/^公元前 /, '前 ')}`;
  return show(c, card(1380, 170, 440, `<div class="k">${s.p}</div><h3>${s.n}</h3><div class="mono" style="color:var(--gold);font-size:20px;margin-bottom:8px">${span}</div><div class="p" style="font-size:22px">${extra || s.f}</div>`), t0, t1); };
const credit = c => c.el(`<div class="credit">底图：NASA Blue Marble · 近景：Sentinel-2 cloudless by EOX（含修改后的 Copernicus Sentinel 数据）</div>`);
const at1 = (lon, lat, d, tilt = 32, head = 0) => ({ lon, lat, d, tilt, head });
const dive = (id, d = .2, tilt = 34, head = 0) => { const s = ARCH.S.find(q => q.id === id); return at1(s.lon, s.lat, d, tilt, head); };
const opening = (c, sub, until) => show(c, `<div class="abs" style="left:100px;top:140px;z-index:5"><div style="font:900 96px/1.1 var(--serif);text-shadow:0 4px 30px #000">卫星上的中国考古</div><div style="font:600 36px var(--sans);color:var(--gold);margin-top:14px;text-shadow:0 0 12px #000">${sub}</div></div>`, .4, until);
