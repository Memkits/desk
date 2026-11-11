// 地图动画引擎：底图（Natural Earth 1:110m，预投影）、成果圆点、热力、镜头、足迹、迁移线、右侧滚动卡片。
// 配置：mapAnim({ b: { 0: {...}, 2: {...} } })，键是场景内的绝对 beat 序号；每个 beat 继承之前的设置。
// 设置项：y:[起,止] 或 年份（本 beat 内年份推进）；cam:'eu' 或 [lon1,lat1,lon2,lat2]；hi:[地点key]（标名字、脉冲）；
//   trail:'人物'（按时间连线）；flows:[[from,to,col?],…]；feed:'auto'|false|['人物',…]；rank:true（右侧按当时政权排行）；
//   win:年数（只显示最近若干年的成果，其余淡化）；cap:'说明文字'（左下小字）；only:[地点key]（其余点淡化）
PLACES.brynmawr = [40.02, -75.31, '布林莫尔', 'USA', '美国']; PLACES.berkeley = [37.87, -122.26, '伯克利', 'USA', '美国'];
const MPROJ = (lat, lon) => { const l = lon * Math.PI / 180, p = lat * Math.PI / 180, p2 = p * p, p4 = p2 * p2;
  return [l * (0.8707 - 0.131979 * p2 + p4 * (-0.013791 + p4 * (0.003971 * p2 - 0.001529 * p4))) * 180,
    -p * (1.007226 + p2 * (0.015085 + p4 * (-0.044475 + 0.028874 * p2 - 0.005916 * p4))) * 180]; };
const ERA_COL = [C.o, C.g, C.b, C.p, C.r], ERA_N = ['古代', '中世纪', '近代早期', '19 世纪', '20 世纪以后'];
const eraOf = y => y < 500 ? 0 : y < 1450 ? 1 : y < 1800 ? 2 : y < 1900 ? 3 : 4;
const MREC = RECORDS.map((r, i) => { const P = PLACES[r[5]]; return { i, y: r[0], yl: r[1], who: r[2], en: r[3], what: r[4], pk: r[5], reg: r[6], note: r[7], unc: !!r[8], pl: P[2], iso: P[3], cn: P[4], xy: MPROJ(P[0], P[1]), era: eraOf(r[0]) }; }).sort((a, b) => a.y - b.y || a.i - b.i);
const MPATH = MAP.map(c => ({ id: c.id, p: new Path2D(c.d) }));
const CAMS = { world: [-125, -38, 150, 62], eu: [-11, 36, 33, 61], weu: [-6, 41, 22, 58], med: [-6, 26, 48, 46], greece: [9, 28, 37, 44],
  meso: [22, 22, 58, 40], egypt: [20, 20, 50, 37], china: [96, 20, 128, 42], eastasia: [95, 15, 145, 45], india: [60, 5, 97, 38],
  mideast: [24, 20, 75, 44], silk: [25, 18, 125, 48], italy: [5, 36, 20, 47], na: [-125, 24, -66, 50], natl: [-95, 20, 40, 62],
  oldworld: [-12, 2, 130, 58], asia: [60, 0, 145, 50], eurasia: [-12, 8, 125, 62], usaeast: [-92, 30, -68, 46], americas: [-125, -35, -35, 55] };
const VIEW = { x: 80, y: 150, w: 1320, h: 800 };
function camOf(c) { const b = typeof c === 'string' ? CAMS[c] : c; const P = [MPROJ(b[3], b[0]), MPROJ(b[1], b[2]), MPROJ(b[3], b[2]), MPROJ(b[1], b[0])];
  const x1 = Math.min(P[0][0], P[3][0]), x2 = Math.max(P[1][0], P[2][0]), y1 = Math.min(P[0][1], P[2][1]), y2 = Math.max(P[1][1], P[3][1]);
  const s = Math.min(VIEW.w / (x2 - x1), VIEW.h / (y2 - y1)); return { cx: (x1 + x2) / 2, cy: (y1 + y2) / 2, s }; }
// 年份 ↔ 时间轴位置（分段，与网页一致）
const MBP = [[0, -20000], [40, -2000], [330, 500], [540, 1450], [1000, 2025]];
const y2pos = y => { for (let k = 1; k < MBP.length; k++) if (y <= MBP[k][1]) { const [a, ya] = MBP[k - 1], [b, yb] = MBP[k]; return a + (b - a) * (y - ya) / (yb - ya); } return 1000; };
const pos2y = p => { for (let k = 1; k < MBP.length; k++) if (p <= MBP[k][0]) { const [a, ya] = MBP[k - 1], [b, yb] = MBP[k]; return ya + (yb - ya) * (p - a) / (b - a); } return 2025; };
const fmtY = y => { y = Math.round(y); return y < 0 ? `公元前 ${-y} 年` : `${y} 年`; };
const short = (s, n = 26) => { s = s.replace(/：.*/, m => m.length > 4 ? m : m); return s.length > n ? s.slice(0, n - 1) + '…' : s; };

function mapAnim(cfg) {
  const B = cfg.b || { 0: {} };
  const setAt = bi => { const o = {}; Object.keys(B).map(Number).sort((a, b) => a - b).forEach(k => { if (k <= bi) Object.assign(o, B[k]); }); return o; };
  return (g, t, R, st) => {
    const k = st.k, bs = st.bs || [0], D = st.D || 10;
    const b0 = bs[k], b1 = k + 1 < bs.length ? bs[k + 1] : D, u = CL((t - b0) / Math.max(.1, (b1 - b0) * .82));
    const S = setAt(st.bis ? st.bis[k] : st.bi), P = k > 0 ? setAt(st.bis[k - 1]) : S;
    // 年份
    const yr = Array.isArray(S.y) ? S.y : [S.y ?? 2025, S.y ?? 2025];
    const year = pos2y(LERP(y2pos(yr[0]), y2pos(yr[1]), SS(u) * .3 + u * .7));
    // 镜头（beat 开始 1.6 秒内从上一个镜头过渡）
    const c1 = camOf(S.cam || 'world'), c0 = camOf((k > 0 ? P.cam : S.cam0) || S.cam || 'world'), cu = SS((t - b0) / 1.6);
    const ls = LERP(Math.log(c0.s), Math.log(c1.s), cu), sc = Math.exp(ls), cx = LERP(c0.cx, c1.cx, cu), cy = LERP(c0.cy, c1.cy, cu);
    const OX = VIEW.x + VIEW.w / 2, OY = VIEW.y + VIEW.h / 2, X = p => [OX + (p[0] - cx) * sc, OY + (p[1] - cy) * sc];
    const zoomK = Math.min(1.5, Math.pow(sc / 1.3, .45));
    // 可见成果
    const vis = MREC.filter(r => r.y <= year + 1e-6);
    const win = S.win, live = r => !win || r.y >= year - win;
    // 热力（按今国家，人数去重）
    const cnt = {}; vis.filter(live).forEach(r => (cnt[r.iso] = cnt[r.iso] || new Set()).add(r.who));
    const mx = Math.max(3, ...Object.values(cnt).map(s => s.size));
    g.save(); g.fillStyle = '#0A1426'; g.fillRect(0, 0, 1920, 1080);
    g.setTransform(sc, 0, 0, sc, OX - cx * sc, OY - cy * sc);
    MPATH.forEach(m => { const s = cnt[m.id]; g.fillStyle = s ? `rgba(255,178,92,${(.16 + .5 * Math.sqrt(s.size / mx)).toFixed(3)})` : '#172238'; g.fill(m.p); });
    g.lineWidth = .9 / sc; g.strokeStyle = '#33415f'; MPATH.forEach(m => g.stroke(m.p));
    g.setTransform(1, 0, 0, 1, 0, 0);
    // 迁移线
    (S.flows || []).forEach((f, i) => { const a = X(MREC.find(r => r.pk === f[0])?.xy || MPROJ(...PLACES[f[0]].slice(0, 2))), z = X(MPROJ(...PLACES[f[1]].slice(0, 2)));
      const ph = CL((t - b0 - .6 - i * (S.fgap ?? .35)) / 1.6); if (ph <= 0) return; const mxp = (a[0] + z[0]) / 2, myp = (a[1] + z[1]) / 2 - Math.hypot(z[0] - a[0], z[1] - a[1]) * .22;
      g.save(); g.strokeStyle = f[2] || C.gold; g.lineWidth = 3; g.globalAlpha = .85; g.setLineDash([10, 7]); g.beginPath(); g.moveTo(...a);
      const N = 40; for (let j = 1; j <= N * ph; j++) { const v = j / N; g.lineTo((1 - v) ** 2 * a[0] + 2 * (1 - v) * v * mxp + v * v * z[0], (1 - v) ** 2 * a[1] + 2 * (1 - v) * v * myp + v * v * z[1]); } g.stroke();
      if (ph >= 1) { g.setLineDash([]); const an = Math.atan2(z[1] - myp, z[0] - mxp); g.fillStyle = f[2] || C.gold; g.beginPath(); g.moveTo(...z); g.lineTo(z[0] - 16 * Math.cos(an - .4), z[1] - 16 * Math.sin(an - .4)); g.lineTo(z[0] - 16 * Math.cos(an + .4), z[1] - 16 * Math.sin(an + .4)); g.fill(); }
      g.restore(); if (f[3] && ph > .6) txt(g, f[3], mxp, myp - 6, C.gold, fnt(700, 22), 'center'); });
    // 成果圆点（按地点合并）
    const grp = {}; vis.forEach(r => (grp[r.pk] = grp[r.pk] || []).push(r));
    const only = S.only ? new Set(S.only) : null, trailSet = S.trail ? new Set(MREC.filter(r => r.who === S.trail).map(r => r.pk)) : null;
    Object.values(grp).sort((a, b) => b.length - a.length).forEach(gp => {
      const last = gp[gp.length - 1], [x, y] = X(last.xy); if (x < -40 || x > 1960 || y < -40 || y > 1120) return;
      const liveN = gp.filter(live).length; const age = year - last.y;
      const pos = y2pos(year) - y2pos(last.y), popU = CL(pos / 6); // 新出现时弹出
      let a = (only && !only.has(last.pk)) || (trailSet && !trailSet.has(last.pk)) ? .25 : 1; if (win && !liveN) a *= .3;
      const r0 = (5 + Math.sqrt(gp.length) * 3.2) * zoomK * (popU < 1 ? .4 + .9 * SS(popU) - .3 * SS((popU - .6) / .4) : 1);
      al(g, a, () => { glow(g, x, y, r0 * 2.6, ERA_COL[last.era] + '55'); dot(g, x, y, r0, ERA_COL[last.era]); g.strokeStyle = 'rgba(7,10,18,.9)'; g.lineWidth = 2; g.beginPath(); g.arc(x, y, r0, 0, TAU); g.stroke(); });
      if (pos < 14 && pos >= 0 && y2pos(year) < 999.5) al(g, (1 - pos / 14) * a, () => { g.strokeStyle = ERA_COL[last.era]; g.lineWidth = 3; g.beginPath(); g.arc(x, y, r0 + 6 + pos * 3 * zoomK, 0, TAU); g.stroke(); });
    });
    // 足迹
    if (S.trail) { const rs = MREC.filter(r => r.who === S.trail), pts = []; rs.forEach(r => { if (!pts.length || pts[pts.length - 1].pk !== r.pk) pts.push(r); });
      const ph = CL((t - b0 - .5) / 2.4) * (pts.length - 1);
      g.save(); g.strokeStyle = '#fff'; g.lineWidth = 3; g.setLineDash([9, 7]); g.beginPath();
      pts.forEach((r, i) => { if (i > Math.ceil(ph)) return; const p = X(r.xy); if (!i) g.moveTo(...p); else { const q = X(pts[i - 1].xy), v = CL(ph - (i - 1)); g.lineTo(LERP(q[0], p[0], v), LERP(q[1], p[1], v)); } }); g.stroke(); g.restore();
      pts.forEach((r, i) => { if (i > ph + .01) return; const [x, y] = X(r.xy); rr(g, x + 12, y - 44, 0, 0, 0); g.save(); g.font = fnt(700, 22); const s = `${i + 1}  ${r.pl.replace(/（.*）/, '').split('/')[0]} ${r.y}`; const w = g.measureText(s).width + 24; const lx = i % 2 ? x - 14 - w : x + 14, ly = i % 2 ? y + 12 : y - 46; rr(g, lx, ly, w, 34, 8, 'rgba(7,10,18,.88)', '#fff', 1.5); txt(g, s, lx + 12, ly + 17, '#fff', fnt(700, 22)); g.restore(); });
    }
    // 高亮地点
    (S.hi || []).forEach((pk, i) => { const P0 = PLACES[pk]; if (!P0) return; const [x, y] = X(MPROJ(P0[0], P0[1])); const a = pop(t, b0 + .3 + i * .25, .5); if (a <= 0) return;
      al(g, a, () => { const pr = (t * 1.1 + i * .3) % 1; g.strokeStyle = C.gold; g.lineWidth = 2.5; g.globalAlpha *= (1 - pr); g.beginPath(); g.arc(x, y, 10 + pr * 34, 0, TAU); g.stroke(); });
      const lab = (S.lab && S.lab[pk]) || P0[2].replace(/（.*）/, ''); const side = (S.left || []).includes(pk) ? -1 : 1;
      al(g, a, () => { g.font = fnt(800, 26); const w = g.measureText(lab).width; const lx = side > 0 ? x + 18 : x - 18 - w; txt(g, lab, lx, y - 22, '#fff', fnt(800, 26)); g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 1.5; line(g, [[x, y], [side > 0 ? x + 14 : x - 14, y - 18]], 'rgba(255,255,255,.6)', 1.5); }); });
    { const gt = g.createLinearGradient(0, 0, 0, 230); gt.addColorStop(0, 'rgba(7,10,18,.92)'); gt.addColorStop(.6, 'rgba(7,10,18,.6)'); gt.addColorStop(1, 'rgba(7,10,18,0)'); g.fillStyle = gt; g.fillRect(0, 0, 1920, 230);
      const gb = g.createLinearGradient(0, 820, 0, 1080); gb.addColorStop(0, 'rgba(7,10,18,0)'); gb.addColorStop(1, 'rgba(7,10,18,.85)'); g.fillStyle = gb; g.fillRect(0, 820, 1920, 260); }
    // 顶部全史时间条
    const TX = 100, TW = 1720, TY = 116;
    g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(TX, TY, TW, 6);
    [[-20000, 500, 0], [500, 1450, 1], [1450, 1800, 2], [1800, 1900, 3], [1900, 2025, 4]].forEach(([a, b, e]) => { const x0 = TX + TW * y2pos(a) / 1000, x1 = TX + TW * Math.min(y2pos(b), y2pos(year)) / 1000; if (x1 > x0) { g.fillStyle = ERA_COL[e]; g.fillRect(x0, TY, x1 - x0, 6); } });
    [-2000, 0, 500, 1000, 1450, 1600, 1700, 1800, 1900, 2000].forEach(y => txt(g, y < 0 ? `前${-y}` : String(y), TX + TW * y2pos(y) / 1000, TY + 20, C.fg3, fnt(500, 15), 'center'));
    dot(g, TX + TW * y2pos(year) / 1000, TY + 3, 7, '#fff');
    // 年份大字 + 统计
    const ppl = new Set(vis.filter(live).map(r => r.who)).size;
    g.save(); g.shadowColor = '#000'; g.shadowBlur = 18; txt(g, fmtY(year), 100, 880, '#fff', fnt(800, 64, 'serif'));
    txt(g, `${win ? `最近 ${win} 年` : '累计'} ${ppl} 位数学家 · ${vis.filter(live).length} 项成果`, 104, 930, C.fg2, fnt(600, 24)); g.restore();
    // 图例
    let lx = 104; ERA_N.forEach((n, i) => { dot(g, lx + 7, 166, 7, ERA_COL[i]); txt(g, n, lx + 20, 166, C.fg2, fnt(500, 18)); g.font = fnt(500, 18); lx += g.measureText(n).width + 44; });
    if (S.cap) { g.save(); g.shadowColor = '#000'; g.shadowBlur = 10; txt(g, S.cap, 104, 202, C.gold, fnt(600, 22)); g.restore(); }
    // 右侧：排行或卡片
    const PX = 1440, PW = 400;
    if (S.rank) {
      const key = S.rank === 'cn' ? (r => r.cn) : (r => r.reg); const gg = {}; vis.filter(live).filter(r => r.y >= (S.since ?? -1e9)).forEach(r => { const kk = key(r); (gg[kk] = gg[kk] || new Set()).add(r.who); });
      const rows = Object.entries(gg).sort((a, b) => b[1].size - a[1].size).slice(0, 9); const m = rows.length ? rows[0][1].size : 1;
      rr(g, PX, 230, PW, 70 + rows.length * 62, 16, 'rgba(10,15,28,.86)', C.line2, 1.5);
      txt(g, (S.rank === 'cn' ? '按今日国家（人数）' : '按成果当时的政权（人数）') + (S.since != null ? `  ${S.since} 年起` : ''), PX + 20, 262, C.fg3, fnt(600, 19));
      rows.forEach(([n, s], i) => { const y = 300 + i * 62; g.save(); g.font = fnt(600, 21); let nm = n; while (g.measureText(nm).width > 300 && nm.length > 2) nm = nm.slice(0, -1); if (nm !== n) nm += '…'; g.restore();
        txt(g, nm, PX + 20, y + 4, C.fg, fnt(600, 21)); rr(g, PX + 20, y + 20, (PW - 90) * s.size / m, 12, 6, C.o); txt(g, String(s.size), PX + PW - 20, y + 26, C.fg, fnt(700, 22, 'mono'), 'right'); });
    } else if (S.feed !== false) {
      const fpk = S.feedPk || (yr[0] === yr[1] && S.hi); let list; if (fpk) list = vis.filter(r => fpk.includes(r.pk)); else if (Array.isArray(S.feed)) list = MREC.filter(r => S.feed.includes(r.who) && r.y <= year + 1e-6);
      else { const ya = Math.min(yr[0], yr[1]) - (yr[0] === yr[1] ? (S.back ?? 0) : 0); list = vis.filter(r => r.y >= ya - 1e-6 && (!only || only.has(r.pk))); }
      list = list.slice(-5);
      list.forEach((r, i) => { const n = list.length, y = 236 + (n - 1 - i) * 132; const fresh = CL((y2pos(year) - y2pos(r.y)) / 2.5 + .25); const a = yr[0] === yr[1] ? pop(t, b0 + .2 + i * .15, .5) : SS(fresh);
        al(g, Math.max(.0, Math.min(1, a)), () => { rr(g, PX, y, PW, 118, 14, 'rgba(10,15,28,.9)', ERA_COL[r.era], 2);
          txt(g, r.who.length > 12 ? r.who.slice(0, 11) + '…' : r.who, PX + 18, y + 26, '#fff', fnt(800, 24)); txt(g, r.yl, PX + PW - 16, y + 26, C.fg3, fnt(600, 18), 'right');
          wrapTxt(g, short(r.what, 38), PX + 18, y + 56, PW - 36, 25, C.fg2, fnt(500, 19));
          txt(g, '📍 ' + r.pl.replace(/（.*?）/g, '') + ' · ' + (r.unc ? '存疑' : r.reg.replace(/（.*?）/g, '')), PX + 18, y + 104, r.unc ? C.gold : C.fg3, fnt(500, 16)); }); });
    }
    g.restore();
  };
}
