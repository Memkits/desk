// 公共部件
window.SCENES = {};
const S = (id, build) => (window.SCENES[id] = { build });
const COL = { edit: 'var(--edit)', vis: 'var(--vis)', both: 'var(--both)' };

// 一个元素：在 at 时刻淡入，until 时刻淡出（可省略）
function show(c, html, at, until, o = {}) {
  const e = c.el(html);
  c.in(e, at, { dy: o.dy ?? 16, d: o.d ?? .55, scale: o.scale });
  if (until != null) c.out(e, until, { d: o.dOut ?? .35 });
  return e;
}
// 跟随某一拍：b(i) 出现，be(i) 之后消失；keep 表示保持到场景结束
const beat = (c, i, html, o = {}) => show(c, html, c.b(i) + (o.at ?? .15), o.keep ? null : (o.until ?? c.be(i) + .3), o);
// 图片卡：key 来自 figs.js，自动带来源
function fig(key, x, y, w, h, cap, o = {}) {
  const f = FIGS[key];
  return `<div class="fig ${o.dark ? 'dark' : ''}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div class="im" style="background-image:url(${f.src});${o.cover ? 'background-size:cover;background-position:' + (o.pos || 'center') : ''}"></div><div class="fc">${cap}<small>${f.cr}</small></div></div>`;
}
const box = (x, y, w, inner, cls = 'card pad', st = '') => `<div class="abs ${cls}" style="left:${x}px;top:${y}px;width:${w}px;${st}">${inner}</div>`;
const src = (c, t, at = .3) => show(c, `<div class="src">${t}</div>`, at, null, { dy: 0 });
const tlrow = (y, name, desc, t = 'edit') => `<div class="r" style="--c:${COL[t]}"><div class="y">${y}</div><div><b>${name}</b><span>${desc}</span></div></div>`;
// 条形：数据驱动宽度，逐条长出
function bars(c, el, at, gap = .35) { [...el.querySelectorAll('.tr i')].forEach((b, k) => c.anim(b, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], at + k * gap, .9)); }
const barRow = (lab, v, max, txt, color) => `<div class="bar"><span>${lab}</span><div class="tr"><i style="width:${v / max * 100}%;--c:${color || 'var(--edit)'};background:${color || 'var(--edit)'}"></i></div><b>${txt}</b></div>`;
// 得 / 失 / 留下
const gainLoss = (g, l, k) => `<div class="gl"><div style="--c:var(--ok)"><h4>得</h4><p>${g}</p></div><div style="--c:var(--bad)"><h4>失</h4><p>${l}</p></div><div style="--c:var(--both)"><h4>留下</h4><p>${k}</p></div></div>`;
const conf = (n, label) => { const c = n === 3 ? 'var(--ok)' : n === 2 ? '#B08A1E' : 'var(--bad)'; return `<span class="conf" style="--c:${c}">${[1, 2, 3].map(i => `<i class="${i <= n ? 'on' : ''}"></i>`).join('')}可信度 ${label}</span>`; };
// 简单的打字效果：逐字显示
function typeIn(c, el, text, at, cps = 14) {
  c.tick(t => { const n = Math.max(0, Math.min(text.length, Math.floor((t - at) * cps))); if (el._n !== n) { el._n = n; el.textContent = text.slice(0, n); } });
}

// ===== JIT 与 AOT 部件 =====
const F = (c, i, fr) => c.b(i) + (c.be(i) - c.b(i)) * fr;
// 表格：rows[0] 为表头；数字列用 nums 指定下标
function tbl(rows, o = {}) {
  const nums = new Set(o.nums || []);
  const th = `<tr>${rows[0].map((h, j) => `<th class="${nums.has(j) ? 'n' : ''}">${h}</th>`).join('')}</tr>`;
  const tr = rows.slice(1).map((r, i) => `<tr class="rw ${(o.hl || []).includes(i) ? 'on' : ''}">${r.map((v, j) => `<td class="${nums.has(j) ? 'n' : ''}">${v}</td>`).join('')}</tr>`).join('');
  return `<table class="tb2" style="${o.st || ''}">${th}${tr}</table>`;
}
// 对数条形：items = [[标签, 值, 颜色, 文本]]，lo..hi 为对数刻度范围
function logBars(items, lo = .1, hi = 300, o = {}) {
  const L = v => (Math.log10(v) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo)) * 100;
  const one = o.one == null ? '' : `<span class="tk" style="left:${L(o.one)}%"></span>`;
  return items.map(([l, v, col, t]) => `<div class="lb" style="--lw:${o.lw || 200}px"><span>${l}</span><div class="tr"><i style="width:${Math.max(1.5, L(v))}%;--c:${col}"></i>${one}</div><b>${t ?? v + '×'}</b></div>`).join('');
}
function growBars(c, el, at, gap = .25) { [...el.querySelectorAll('.tr i')].forEach((b, k) => c.anim(b, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], at + k * gap, .7)); }
const det = (x, y, w, h, body, src) => `<div class="det" style="left:${x}px;top:${y}px;width:${w}px"><span class="h">${h}</span>${body}${src ? `<small>${src}</small>` : ''}</div>`;
const concl = (x, y, w, t) => `<div class="concl" style="left:${x}px;top:${y}px;width:${w}px">${t}</div>`;
const at = (x, y, w, inner, st = '') => `<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;${st}">${inner}</div>`;
const C = { jit: 'var(--jit)', aot: 'var(--aot)', itp: 'var(--itp)', mix: 'var(--mix)', ok: 'var(--ok)', bad: 'var(--bad)' };
// 逐行出现：表格的 .rw
function rowsIn(c, el, list) { const R = [...el.querySelectorAll('.rw')]; list.forEach(([k, t]) => R[k] && c.in(R[k], t, { dy: 8, d: .4 })); }
