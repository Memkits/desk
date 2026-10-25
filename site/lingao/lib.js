// 地图、标注、照片等通用部件
(() => {
  const LG = window.LG = {};
  LG.gcj = function (lat, lon) {
    const a = 6378245, ee = 0.00669342162296594323, PI = Math.PI;
    const tl = (x, y) => -100 + 2 * x + 3 * y + .2 * y * y + .1 * x * y + .2 * Math.sqrt(Math.abs(x)) + (20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2 / 3 + (20 * Math.sin(y * PI) + 40 * Math.sin(y / 3 * PI)) * 2 / 3 + (160 * Math.sin(y / 12 * PI) + 320 * Math.sin(y * PI / 30)) * 2 / 3;
    const tn = (x, y) => 300 + x + 2 * y + .1 * x * x + .1 * x * y + .1 * Math.sqrt(Math.abs(x)) + (20 * Math.sin(6 * x * PI) + 20 * Math.sin(2 * x * PI)) * 2 / 3 + (20 * Math.sin(x * PI) + 40 * Math.sin(x / 3 * PI)) * 2 / 3 + (150 * Math.sin(x / 12 * PI) + 300 * Math.sin(x / 30 * PI)) * 2 / 3;
    let dl = tl(lon - 105, lat - 35), dn = tn(lon - 105, lat - 35); const r = lat / 180 * PI; let m = Math.sin(r); m = 1 - ee * m * m; const s = Math.sqrt(m);
    dl = dl * 180 / ((a * (1 - ee)) / (m * s) * PI); dn = dn * 180 / (a / s * Math.cos(r) * PI); return [lat + dl, lon + dn];
  };
  // 地点（g=1 表示已是高德 GCJ 坐标）
  LG.L = {
    临高县城: [19.912616, 109.691469, 1], 博铺港: [19.986161, 109.742501, 1], 百仞滩: [19.938336, 109.715256, 1], 马袅: [19.926872, 109.846306, 1],
    红牌港: [19.959102, 109.813029, 1], 马袅半岛: [19.955, 109.832, 1], 临高角: [20.007669, 109.714876, 1],
    儋州: [19.79, 109.35], 昌化: [19.33, 108.68], 三亚湾: [18.27, 109.45], 榆林港: [18.203524, 109.549779, 1], 田独: [18.29, 109.61],
    琼州府城: [20.00, 110.35], 澄迈县城: [19.95, 110.11],
    澳门: [22.19, 113.54], 香港: [22.277, 114.173], 虎门: [22.79, 113.63], 广州: [23.12, 113.27], 白鹅潭: [23.11, 113.24], 佛山: [23.03, 113.11], 三水: [23.16, 112.87], 肇庆: [23.05, 112.47], 梧州: [23.48, 111.28], 长洲岛: [23.45, 111.243],
    打狗: [22.6157, 120.27], 澎湖: [23.565, 119.564], 料罗湾: [24.413, 118.383], 厦门: [24.48, 118.09], 鼓浪屿: [24.447, 118.062], 金门: [24.44, 118.33], 安平: [24.71, 118.46],
    济州: [33.51, 126.52], 城山: [33.458, 126.941], 登州: [37.81, 120.75], 屺㟂岛: [37.686, 120.227], 招远: [37.36, 120.40], 庙岛群岛: [37.94, 120.68],
    沂州: [35.10, 118.35], 杭州: [30.25, 120.17], 旅顺: [38.81, 121.25], 镇江堡: [40.12, 124.39], 沈阳: [41.80, 123.43], 吕宋: [14.59, 120.98], 鸿基: [20.95, 107.08], 临高: [19.99, 109.74],
  };
  LG.proj = file => { const m = META[file]; return (lat, lon, g) => { if (Array.isArray(lat)) [lat, lon, g] = lat; if (typeof lat === 'string') [lat, lon, g] = LG.L[lat]; if (!g) [lat, lon] = LG.gcj(lat, lon); const n = 2 ** m.z, s = Math.sin(lat * Math.PI / 180); return [((lon + 180) / 360 * n - m.x0) * 256, ((0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI)) * n - m.y0) * 256]; }; };

  const sm = x => { x = Math.max(0, Math.min(1, x)); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const NS = 'http://www.w3.org/2000/svg';

  // 等轴小建筑（单位：地图像素，原点在底面中心附近）
  LG.house = (x, y, s = 1, c = '#e8dcc4', roof = '#c9533c') => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-22 0 L0 -11 L22 0 L0 11Z" fill="${roof}"/><path d="M-22 0 L0 11 L0 31 L-22 20Z" fill="${c}"/><path d="M22 0 L0 11 L0 31 L22 20Z" fill="#b9ab90"/></g>`;
  LG.block = (x, y, s = 1, w = 2, c = '#e8dcc4', roof = '#8a8f99') => `<g transform="translate(${x},${y}) scale(${s})"><path d="M${-22 * w} 0 L0 ${-11 * w} L${22 * w} 0 L0 ${11 * w}Z" fill="${roof}"/><path d="M${-22 * w} 0 L0 ${11 * w} L0 ${11 * w + 26} L${-22 * w} 26Z" fill="${c}"/><path d="M${22 * w} 0 L0 ${11 * w} L0 ${11 * w + 26} L${22 * w} 26Z" fill="#a99c84"/></g>`;
  LG.factory = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-40 0 L0 -20 L40 0 L0 20Z" fill="#6b6f78"/><path d="M-40 0 L0 20 L0 50 L-40 30Z" fill="#9aa0aa"/><path d="M40 0 L0 20 L0 50 L40 30Z" fill="#7d838e"/><rect x="18" y="-60" width="10" height="62" fill="#5a5e66"/><circle cx="23" cy="-74" r="12" fill="rgba(220,220,220,.55)"/><circle cx="34" cy="-92" r="16" fill="rgba(220,220,220,.35)"/></g>`;
  LG.tower = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-8 0 L-4 -60 L4 -60 L8 0" fill="#c9c2b4" stroke="#6b6458" stroke-width="2"/><ellipse cx="0" cy="-66" rx="18" ry="8" fill="#7fd1ff" stroke="#fff" stroke-width="2"/><rect x="-18" y="-66" width="36" height="14" fill="#5aa6d6"/><ellipse cx="0" cy="-52" rx="18" ry="8" fill="#4a8fbf"/></g>`;
  LG.tent = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-30 0 L0 -36 L30 0Z" fill="#efe8da" stroke="#8c7f68" stroke-width="3"/><path d="M0 -36 L0 0" stroke="#8c7f68" stroke-width="2"/></g>`;
  LG.ship = (x, y, s = 1, c = '#23262c') => `<g transform="translate(${x},${y}) scale(${s})"><path d="M-60 0 L60 0 L48 16 L-50 16Z" fill="${c}"/><rect x="-40" y="-12" width="70" height="12" fill="#e9e3d6"/><rect x="-6" y="-30" width="10" height="20" fill="#a8392a"/></g>`;
  LG.furnace = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M-26 0 L-18 -130 L18 -130 L26 0Z" fill="#7a5a4a" stroke="#3a2a22" stroke-width="3"/><path d="M-18 -130 L-12 -160 L12 -160 L18 -130Z" fill="#5a4038"/><rect x="-4" y="-200" width="8" height="42" fill="#5a4038"/>
    <ellipse cx="0" cy="-30" rx="26" ry="8" fill="none" stroke="#e08a3a" stroke-width="3"/><rect x="-8" y="-14" width="16" height="14" fill="#ffb347"/>
    <path d="M-60 0 L-46 -150 M60 0 L46 -150 M-46 -150 L46 -150 M-60 0 L46 -150 M60 0 L-46 -150" stroke="#b8c2cc" stroke-width="3" fill="none"/>
    <path d="M-46 -150 L-110 10 M46 -150 L110 10" stroke="#e6dccb" stroke-width="2" stroke-dasharray="6 4"/></g>`;
  LG.stove = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-14" y="-128" width="28" height="128" rx="14" fill="#8d8a86" stroke="#45423f" stroke-width="3"/></g>`;
  LG.dock = (x, y, s = 1, n = 10) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M0 0 L${n * 30} ${-n * 8} L${n * 30 + 10} ${-n * 8 + 14} L12 16Z" fill="#8a6f50" stroke="#3e3226" stroke-width="2"/>${Array.from({ length: n }, (_, i) => `<rect x="${12 + i * 30}" y="${-i * 8 + 4}" width="6" height="22" fill="#3e3226"/>`).join('')}</g>`;
  LG.smoke = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="-10" y="0" width="20" height="50" fill="#8d7c66"/><path d="M0 -4 C14 -40 -8 -60 20 -110" stroke="rgba(70,70,70,.55)" stroke-width="18" fill="none" stroke-linecap="round"/><circle cx="0" cy="-2" r="7" fill="#ff9b3d"/></g>`;
  LG.boom = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M0 -30 L8 -10 L28 -14 L14 2 L26 20 L4 12 L-6 30 L-8 10 L-28 14 L-14 -2 L-24 -20 L-4 -10Z" fill="#ff8a3a" stroke="#ffd27a" stroke-width="3"/></g>`;

  LG.ext = function (ctx) {
    const { root, anim } = ctx;
    ctx.src = t => { document.getElementById('src').textContent = t; };
    // 地图层
    ctx.map = (file, o = {}) => {
      const m = META[file], L = ctx.el(`<div class="layer"><div class="cam"><img src="A/maps/${file}" style="width:${m.W}px;height:${m.H}px;filter:${o.filter || 'saturate(.8) brightness(.82)'}"><svg width="${m.W}" height="${m.H}"></svg></div>${o.vig === false ? '' : '<div class="vig"></div>'}</div>`);
      const cam = L.querySelector('.cam'), svg = L.querySelector('svg'), keys = [];
      const lay = { el: L, svg, p: LG.proj(file), keys, sc: () => lay.cur[2] };
      // 镜头：key(t, [x,y], sc, d) —— 在 t 开始，用 d 秒移动到目标
      lay.key = (t, pt, sc, d = 2.4) => { keys.push([t, pt[0], pt[1], sc, d]); keys.sort((a, b) => a[0] - b[0]); return lay; };
      lay.cur = [0, 0, 1];
      ctx.tick(lt => {
        if (!keys.length) return; let [_, x, y, s] = keys[0];
        for (let i = 1; i < keys.length; i++) { const k = keys[i]; if (lt <= k[0]) break; const u = sm((lt - k[0]) / k[4]); x += (k[1] - x) * u; y += (k[2] - y) * u; s = Math.exp(Math.log(s) + (Math.log(k[3]) - Math.log(s)) * u); }
        lay.cur = [x, y, s]; cam.style.transform = `translate(${960 - x * s}px,${540 - y * s}px) scale(${s})`;
      });
      lay.add = (html, at, o2 = {}) => { const g = document.createElementNS(NS, 'g'); g.innerHTML = html; svg.appendChild(g); if (at != null) ctx.in(g, at, { dy: 0, d: o2.d ?? .6, ...o2 }); if (o2.until != null) ctx.out(g, o2.until); return g; };
      // 标注：位置 + 名称（fs 为屏幕像素，按该时刻镜头缩放换算）
      lay.pin = (pt, name, at, o2 = {}) => {
        if (typeof pt === 'string') pt = lay.p(pt); const k = 1 / (o2.sc || 1), fs = (o2.fs || 30) * k, r = (o2.r || 11) * k;
        const a = o2.a || 'start', dx = (o2.dx ?? 18) * k, dy = (o2.dy ?? 10) * k;
        const g = document.createElementNS(NS, 'g'); g.setAttribute('transform', `translate(${pt[0]},${pt[1]})`);
        g.innerHTML = `<g><circle r="${r * 2.2}" fill="${o2.c || '#d9a441'}" opacity=".25"/><circle r="${r}" fill="${o2.c || '#d9a441'}" stroke="#fff" stroke-width="${3 * k}"/>${name ? `<text class="lab" x="${dx}" y="${dy}" font-size="${fs}" fill="#fff" text-anchor="${a}" style="stroke-width:${5 * k}px">${name}</text>` : ''}${o2.sub ? `<text class="lab" x="${dx}" y="${dy + fs * 1.15}" font-size="${fs * .72}" fill="#f0e2c4" text-anchor="${a}" style="stroke-width:${4 * k}px;font-weight:500">${o2.sub}</text>` : ''}</g>`;
        svg.appendChild(g); if (at != null) ctx.in(g.firstChild, at, { dy: 0, scale: .4, d: .5 }); if (o2.until != null) ctx.out(g, o2.until); return g;
      };
      lay.text = (pt, t, at, o2 = {}) => { const k = 1 / (o2.sc || 1); return lay.add(`<text class="lab" x="${pt[0]}" y="${pt[1]}" font-size="${(o2.fs || 26) * k}" fill="${o2.c || '#fff'}" text-anchor="${o2.a || 'middle'}" style="stroke-width:${5 * k}px;${o2.st || ''}">${t}</text>`, at, o2); };
      // 线路：逐渐画出
      lay.route = (pts, at, o2 = {}) => {
        pts = pts.map(q => typeof q === 'string' ? lay.p(q) : q); const k = 1 / (o2.sc || 1);
        let d = `M${pts[0][0]} ${pts[0][1]}`;
        if (o2.curve != null && pts.length === 2) { const [[x1, y1], [x2, y2]] = pts, c = o2.curve; d += ` Q${(x1 + x2) / 2 - (y2 - y1) * c} ${(y1 + y2) / 2 + (x2 - x1) * c} ${x2} ${y2}`; }
        else if (o2.smooth && pts.length > 2) { for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; d += ` Q${pts[i][0]} ${pts[i][1]} ${mx} ${my}`; } d += ` L${pts.at(-1)[0]} ${pts.at(-1)[1]}`; }
        else d += pts.slice(1).map(q => ` L${q[0]} ${q[1]}`).join('');
        const w = (o2.w || 6) * k, c = o2.c || '#ffd27a';
        const g = document.createElementNS(NS, 'g');
        g.innerHTML = `<path d="${d}" fill="none" stroke="rgba(0,0,0,.55)" stroke-width="${w + 5 * k}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${o2.marker ? '' : ''}/>`;
        if (o2.arrow !== false) { const [a, b] = [pts.at(-2), pts.at(-1)]; let ang; if (o2.curve != null && pts.length === 2) { const c = o2.curve, cx = (a[0] + b[0]) / 2 - (b[1] - a[1]) * c, cy = (a[1] + b[1]) / 2 + (b[0] - a[0]) * c; ang = Math.atan2(b[1] - cy, b[0] - cx); } else ang = Math.atan2(b[1] - a[1], b[0] - a[0]); const s = w * 2.6; g.innerHTML += `<path transform="translate(${b[0]},${b[1]}) rotate(${ang * 180 / Math.PI})" d="M${s * .6} 0 L${-s} ${-s * .8} L${-s * .5} 0 L${-s} ${s * .8}Z" fill="${c}" stroke="rgba(0,0,0,.6)" stroke-width="${2 * k}"/>`; }
        svg.appendChild(g);
        const paths = [...g.querySelectorAll('path')].slice(0, 2), len = paths[0].getTotalLength();
        paths.forEach(p => { p.style.strokeDasharray = `${len} ${len}`; anim(p, [{ strokeDashoffset: len }, { strokeDashoffset: 0 }], at, o2.d || 1.6, 'io'); });
        const ah = g.querySelector('path:nth-child(3)'); if (ah) ctx.in(ah, at + (o2.d || 1.6) - .2, { dy: 0, d: .3 });
        if (o2.dash) paths[1].setAttribute('stroke-dasharray', o2.dash);
        if (o2.until != null) ctx.out(g, o2.until);
        return g;
      };
      // 区域
      lay.zone = (pts, c, at, o2 = {}) => { pts = pts.map(q => typeof q === 'string' ? lay.p(q) : q); const k = 1 / (o2.sc || 1); return lay.add(`<polygon points="${pts.map(q => q.join(',')).join(' ')}" fill="${c}" fill-opacity="${o2.fo ?? .3}" stroke="${c}" stroke-width="${(o2.w || 4) * k}" ${o2.dash ? `stroke-dasharray="${o2.dash}"` : ''} stroke-linejoin="round"/>`, at, o2); };
      lay.ring = (pt, r, c, at, o2 = {}) => { if (typeof pt === 'string') pt = lay.p(pt); const k = 1 / (o2.sc || 1); const g = lay.add(`<circle cx="${pt[0]}" cy="${pt[1]}" r="${r}" fill="${c}" fill-opacity="${o2.fo ?? .06}" stroke="${c}" stroke-width="${(o2.w || 4) * k}" stroke-dasharray="${o2.dash || `${14 * k} ${12 * k}`}"/>`, null); const ci = g.firstChild; ci.style.transformOrigin = `${pt[0]}px ${pt[1]}px`; anim(ci, [{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], at, o2.d || 1.4, 'std'); if (o2.until != null) ctx.out(g, o2.until); return g; };
      if (o.at != null) ctx.in(L, o.at, { dy: 0, d: o.d || 1 }); if (o.until != null) ctx.out(L, o.until, { d: o.dOut || 1 });
      return lay;
    };
    ctx.hd2 = (k, h, at, until) => { const e = ctx.el(`<div class="hd"><div class="k">${k}</div>${h ? `<h1>${h}</h1>` : ''}</div>`); ctx.in(e, at, { dy: 14 }); if (until != null) ctx.out(e, until); return e; };
    ctx.chip = (x, y, b, s, at, until) => { const e = ctx.el(`<div class="chip" style="left:${x}px;top:${y}px"><b>${b}</b><span>${s}</span></div>`); ctx.in(e, at, { dy: 12 }); if (until != null) ctx.out(e, until); return e; };
    ctx.card = (html, style, at, until) => { const e = ctx.el(`<div class="card" style="${style}">${html}</div>`); ctx.in(e, at, { dy: 16 }); if (until != null) ctx.out(e, until); return e; };
    // 新闻照片：自动带来源
    ctx.photo = (f, x, y, w, h, cap, at, until, o = {}) => {
      const P = PHOTOS[f] || {}; const e = ctx.el(`<div class="ph" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><img src="A/news/${f}" style="object-position:${o.pos || 'center'}">${cap ? `<div class="cap">${cap}</div>` : ''}<div class="cr">图：${P.o || ''}${P.h ? ' · ' + P.h : ''}</div></div>`);
      ctx.in(e, at, { dy: 0, scale: .94, d: .7 }); if (o.kb) ctx.anim(e.querySelector('img'), [{ transform: 'scale(1)' }, { transform: `scale(${o.kb})` }], at, (until ?? at + 8) - at + 1, 'lin');
      if (until != null) ctx.out(e, until, { d: .5 }); return e;
    };
  };
})();
