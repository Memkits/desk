(async () => {
  const $ = id => document.getElementById(id), { S, LK } = ARCH, { tPos, yearStr, ss } = GEO;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const M = GEO.create(THREE, $('cv'), { dpr: Math.min(2, devicePixelRatio || 1) });
  // 时间轴：滑块 0..1000 ↔ 年份（对数刻度，左古右今）
  const Y0 = -2200000, Y1 = 220;
  const s2y = s => { const u = 1 - s / 1000, a0 = Math.log10(GEO.AGE(Y1)), a1 = Math.log10(GEO.AGE(Y0)); return 2030 - 10 ** (a0 + (a1 - a0) * u); };
  const y2s = y => (1 - tPos(y)) * 1000;
  const st = { year: -3300, sel: 'liangzhu', cult: true, link: true, lgm: false, play: false };
  try { const h = location.hash.match(/^#y=(-?\d+)(?:&s=(\w+))?/); if (h) { st.year = +h[1]; if (h[2]) st.sel = h[2]; } } catch (e) {}
  const ERAS = [[-2200000, -10000, '旧石器时代', '#ff9fb2'], [-10000, -2000, '新石器时代', '#8ff0b4'], [-2000, -221, '青铜时代至东周', '#ffd27a'], [-221, 220, '秦汉', '#ffe9a8']];
  const eraOf = y => (ERAS.find(e => y >= e[0] && y < e[1]) || ERAS[3])[2];
  $('eras').innerHTML = ERAS.map(([a, b, n, c]) => `<span title="${n}" style="left:${y2s(a) / 10}%;width:${(y2s(b) - y2s(a)) / 10}%;background:${c}"></span>`).join('');
  $('ticks').innerHTML = [[-2000000, '200万年前'], [-500000, '50万'], [-100000, '10万'], [-20000, '2万'], [-8000, '1万'], [-3000, '前3000'], [-1000, '前1000'], [0, '公元']].map(([y, t]) => `<span class="tick" style="left:${y2s(y) / 10}%">${t}</span>`).join('');
  const CH = [['远古的人', -800000], ['冰期海岸', -20000], ['稻与粟', -7000], ['满天星斗', -3500], ['城', -2400], ['西来的东西', -2000], ['二里头', -1650], ['商', -1200], ['秦汉', -150]];
  $('chap').innerHTML = CH.map(([n, y], i) => `<button data-i="${i}">${n}</button>`).join('');
  $('legend').innerHTML = [['pal', '旧石器'], ['neo', '新石器'], ['city', '城址与都邑']].map(([k, n]) => `<span style="--c:var(--${k})"><b></b>${n}</span>`).join('') + Object.entries(LK).map(([k, c]) => `<span style="--c:${c}"><b class="ln"></b>${k}</span>`).join('');
  // 视图
  const HOME = { lon: 110, lat: 33.5, d: 38, tilt: 30, head: 0 };
  let view = { ...HOME }, goal = null;
  function resize() { const b = $('cv').getBoundingClientRect(); M.resize(b.width, b.height); }
  new ResizeObserver(resize).observe($('cv'));
  await M.load();
  resize();
  // 拖动平移、滚轮/双指缩放
  const cv = $('cv'), ptrs = new Map(); let pinch0 = 0;
  cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); goal = null; });
  cv.addEventListener('pointermove', e => { if (!ptrs.has(e.pointerId)) return; const p = ptrs.get(e.pointerId), dx = e.clientX - p[0], dy = e.clientY - p[1]; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch0) view.d = Math.max(.25, Math.min(60, view.d * pinch0 / d)); pinch0 = d; return; }
    const k = view.d / (M.H || 500) * .9; view.lon -= dx * k; view.lat += dy * k / GEO.KY / Math.cos(view.tilt * Math.PI / 180) ; });
  const up = e => { ptrs.delete(e.pointerId); pinch0 = 0; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('wheel', e => { e.preventDefault(); goal = null; view.d = Math.max(.25, Math.min(60, view.d * Math.exp(e.deltaY * .0012))); }, { passive: false });
  // 标签
  const labs = new Map(); S.forEach(s => { const b = document.createElement('button'); b.className = 'lab'; b.textContent = s.n; b.onclick = () => select(s.id, true); $('labels').appendChild(b); labs.set(s.id, b); });
  const clabs = M.cults.map(c => { const d = document.createElement('div'); d.className = 'cl'; d.textContent = c.n; $('labels').appendChild(d); return d; });
  function select(id, fly) {
    st.sel = id; const s = S.find(q => q.id === id); if (!s) return;
    const img = s.cl ? `<img src="sites/${(ARCH.IMG[s.cl] || s.cl)}${SMALL}.jpg" alt="${s.n}一带的卫星图像（约 26 公里见方）" loading="lazy">` : '';
    const span = s.t0 === s.t1 ? yearStr(s.t0) : `${yearStr(s.t0)} — ${yearStr(s.t1).replace(/^公元前 /, '前 ')}`;
    $('card').innerHTML = `<h3>${s.n}</h3><div class="meta">${s.p} · ${span}</div><p>${s.f}</p>${img}${s.cl ? `<div class="src">卫星近景：${ARCH.IMG[s.cl] ? 'EOxCloudless 2023（CC BY-NC-SA 4.0）' : 'Sentinel-2 cloudless 2016（CC BY 4.0）'} · EOX</div>` : ''}`;
    if (fly) { goal = { lon: s.lon, lat: s.lat, d: s.cl ? 1.1 : 4, tilt: 25, head: view.head }; if (st.year < s.t0 - 50 || st.year > s.t1 + 300) setYear(s.t0 === s.t1 ? s.t0 : (s.t0 + s.t1) / 2); }
    try { history.replaceState(null, '', `#y=${Math.round(st.year)}&s=${id}`); } catch (e) {}
  }
  const SMALL = '';
  function setYear(y) { st.year = y; $('tl').value = y2s(y); }
  $('tl').oninput = () => { st.year = s2y(+$('tl').value); stopPlay(); };
  $('chap').onclick = e => { const b = e.target.closest('button'); if (!b) return; const [n, y] = CH[+b.dataset.i]; setYear(y); stopPlay(); if (n === '冰期海岸') { st.lgm = true; $('b-lgm').setAttribute('aria-pressed', true); goal = { lon: 122, lat: 31, d: 22, tilt: 30, head: 0 }; } else goal = { ...HOME }; };
  const tog = (id, k) => $(id).onclick = () => { st[k] = !st[k]; $(id).setAttribute('aria-pressed', st[k]); };
  tog('b-cult', 'cult'); tog('b-link', 'link'); tog('b-lgm', 'lgm'); $('b-home').onclick = () => goal = { ...HOME };
  const stopPlay = () => { st.play = false; $('play').setAttribute('aria-pressed', false); $('play').textContent = '播放'; };
  $('play').onclick = () => { st.play = !st.play; $('play').setAttribute('aria-pressed', st.play); $('play').textContent = st.play ? '暂停' : '播放'; if (st.play && st.year > 100) setYear(-2200000); };
  setYear(st.year); select(st.sel, false);
  let last = performance.now(), lgmA = 0, listKey = '';
  function frame(now) {
    requestAnimationFrame(frame); const dt = Math.min(.1, (now - last) / 1000); last = now;
    if (st.play) { const s = +$('tl').value + dt * 22; if (s >= 1000) { setYear(Y1); stopPlay(); } else { $('tl').value = s; st.year = s2y(s); } }
    if (goal) { const k = 1 - Math.exp(-dt * (reduce ? 30 : 3)); for (const q of ['lon', 'lat', 'tilt', 'head']) view[q] += (goal[q] - view[q]) * k; view.d = Math.exp(Math.log(view.d) + (Math.log(goal.d) - Math.log(view.d)) * k); if (Math.abs(goal.d - view.d) / goal.d < .002 && Math.abs(goal.lon - view.lon) < .001) goal = null; }
    lgmA += ((st.lgm ? 1 : 0) - lgmA) * Math.min(1, dt * 4);
    M.setView(view);
    const y = st.year, close = {};
    // 近景：缩放到一定程度后显示选中/附近的卫星近景
    Object.entries(M.close).forEach(([nm, c]) => { const s = S.find(q => q.cl === nm); const near = Math.hypot(c.lon - view.lon, c.lat - view.lat) < c.w * 1.5; close[nm] = (near || st.sel === s.id) ? ss((2.2 - view.d) / 1.4) : 0; });
    M.update({ year: y, t: now / 1000, sites: 'auto', cults: st.cult, links: st.link, lgm: lgmA, close, focus: st.sel, dot: 1 });
    $('ybig').textContent = yearStr(y); $('yera').textContent = eraOf(y) + (lgmA > .5 ? ' · 浅色陆地：海平面比今天低约 120 米时露出的大陆架（示意）' : '');
    M.sites.forEach(s => { const b = labs.get(s.id), [x, yy, vis] = M.project(s.lon, s.lat); const on = vis && s.a > .25; b.style.display = on ? '' : 'none'; if (on) { b.style.left = x + 'px'; b.style.top = yy + 'px'; b.style.opacity = Math.min(1, s.a * 1.3); b.classList.toggle('on', s.id === st.sel); } });
    M.cults.forEach((c, i) => { const d = clabs[i], [x, yy, vis] = M.project(c.lon, c.lat + c.ry * .55); const on = vis && c.a > .3 && view.d > 6; d.style.display = on ? '' : 'none'; if (on) { d.style.left = x + 'px'; d.style.top = yy + 'px'; d.style.opacity = c.a; } });
    const vis = M.sites.filter(s => s.a > .4), key = vis.map(s => s.id).join() + st.sel;
    if (key !== listKey) { listKey = key; $('list').innerHTML = vis.length ? vis.map(s => `<button data-id="${s.id}" style="--c:${M.KC[s.k]}" aria-current="${s.id === st.sel}"><i></i><span>${s.n}</span><small>${s.p}</small></button>`).join('') : '<p class="note">这个时段地图上还没有标注的遗址。</p>'; }
  }
  $('list').onclick = e => { const b = e.target.closest('button'); if (b) select(b.dataset.id, true); };
  window.__map = { M, st, setYear, select, view: v => goal = v };
  requestAnimationFrame(frame);
})();
