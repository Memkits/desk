// 对局回放：左边 3D 棋盘，右边信息面板。每个 beat 的镜头和进度写在 beats.js 的 BEATS['场景_序号'] 里。
(() => {
  const DEF = { yaw: 0, tilt: 30, zoom: 1.1, fx: 4, fy: 4, morph: 1, gap: 0.5 }, KEYS = Object.keys(DEF);
  let inited = false; const END = {};   // 每个 beat 结束时的镜头
  function prep() { if (inited) return; inited = true; B3.setGame(GAME);
    let prev = { ...DEF, k: 0 };
    TL.scenes.forEach(sc => sc.beats.forEach((b, i) => { const sp = BEATS[b.key]; if (!sp) return; const e = { ...prev }; KEYS.forEach(q => { if (sp[q] !== undefined) e[q] = sp[q]; }); e.k = sp.k ? sp.k[1] : (sp.at ?? prev.k); sp._from = prev; sp._to = e; sp._k0 = sp.k ? sp.k[0] : e.k; prev = e; })); }
  const nm = i => GAME.names[i - 1] || '';
  AN.game = (g, t, R, st) => {
    prep(); const sc = TL.scenes.find(s => s.id === st.sid), bt = sc.beats[st.bi], sp = BEATS[bt.key]; if (!sp) return AN._missing(g, t, R);
    const tk = Math.max(0, st.tk), d = bt.d, tr = sp.tr ?? 1.5, FQ = 15, u = SS(Math.min(1, Math.floor(tk * FQ) / FQ / tr)), cam = {};
    KEYS.forEach(q => cam[q] = LERP(sp._from[q], sp._to[q], u));
    let moving = u > 0 && u < 1 && KEYS.some(q => sp._from[q] !== sp._to[q]);
    // 进度：k0 → k1 在 [m0, m1]·d 之间匀速走；每手的落子动画最长 0.6 秒，按 15 帧/秒取样，其余时间画面静止
    let k = sp._to.k; if (sp.k) { const a = (sp.m0 ?? 0.06) * d, b2 = (sp.m1 ?? 0.92) * d, nmv = sp.k[1] - sp.k[0], slot = (b2 - a) / nmv, kf = LERP(sp.k[0], sp.k[1], CL((tk - a) / Math.max(.01, b2 - a)));
      if (slot < 0.34) k = Math.round(kf); else { const i = Math.min(sp.k[1] - 1, Math.floor(kf)), f = kf - i, A = Math.min(slot, 0.6), fr = Math.min(1, Math.floor(f * slot * FQ) / FQ / A); k = kf >= sp.k[1] ? sp.k[1] : i + fr; if (fr > 0 && fr < 1) moving = true; } }
    const drift = 0;
    const hiA = sp.hi ? SS((tk - (sp.hiAt ?? 0.5) * d) / .5) * (sp.hiEnd ? 1 - SS((tk - sp.hiEnd * d) / .4) : 1) : 0;
    const terrA = sp.terr ? SS((tk - (sp.terrAt ?? 0.15) * d) / .8) : 0;
    const B = { x: 100, y: 132, w: sp.wide ? 1720 : 1170, h: 828 };
    g.save(); g.beginPath(); g.roundRect(B.x, B.y, B.w, B.h, 18); g.clip();
    B3.draw(g, B, { k: +k.toFixed(3), morph: +cam.morph.toFixed(3), yaw: +(cam.yaw + drift).toFixed(2), tilt: +cam.tilt.toFixed(2), zoom: +cam.zoom.toFixed(3), fx: +cam.fx.toFixed(2), fy: +cam.fy.toFixed(2), gap: cam.gap, q: moving ? 0.7 : 1, hi: hiA > 0 ? sp.hi : null, hiA: +hiA.toFixed(2), badges: sp.badges !== false, terr: terrA > 0 ? GAME.terr : null, terrA: +terrA.toFixed(2) });
    g.restore(); g.strokeStyle = C.line2; g.lineWidth = 2; g.beginPath(); g.roundRect(B.x, B.y, B.w, B.h, 18); g.stroke();
    if (sp.cap) { g.save(); g.globalAlpha = SS(tk / .5); g.font = fnt(700, 26); const w = g.measureText(sp.cap).width + 44; rr(g, B.x + 22, B.y + 22, w, 52, 12, 'rgba(8,12,22,.82)', C.gold, 2); txt(g, sp.cap, B.x + 44, B.y + 49, C.fg, fnt(700, 26)); g.restore(); }
    if (sp.wide) return;
    // ---- 右侧面板 ----
    const X = 1300, W = 520, ki = Math.floor(k + 0.5), sn = B3.snap(ki); let y = B.y;
    rr(g, X, y, W, 96, 16, C.panel, C.line2);
    if (ki > 0) { const c = sn.c; dot(g, X + 46, y + 48, 22, c === 1 ? '#0c0d10' : '#f4f1e6'); g.strokeStyle = c === 1 ? 'rgba(255,255,255,.5)' : 'rgba(0,0,0,.4)'; g.lineWidth = 2; g.beginPath(); g.arc(X + 46, y + 48, 22, 0, 7); g.stroke();
      txt(g, `第 ${ki} 手`, X + 86, y + 34, C.fg3, fnt(600, 22)); txt(g, `${c === 1 ? '黑' : '白'}  ${nm(ki).replace(/^(.)/, '$1层 ')}`, X + 86, y + 66, C.fg, fnt(800, 30)); }
    else txt(g, '开局 · 黑先', X + 30, y + 48, C.fg, fnt(800, 30));
    txt(g, `共 ${B3.len} 手`, X + W - 24, y + 34, C.fg3, fnt(500, 20), 'right');
    txt(g, `提子  黑 ${sn.caps[1]} · 白 ${sn.caps[2]}`, X + W - 24, y + 66, C.fg2, fnt(600, 22), 'right');
    y += 112;
    // 胜率曲线
    rr(g, X, y, W, 150, 16, C.panel, C.line2); txt(g, '程序估计的黑方胜率', X + 22, y + 26, C.fg3, fnt(600, 20));
    const cx = X + 22, cy = y + 46, cw = W - 44, ch = 88, n = B3.len; line(g, [[cx, cy + ch / 2], [cx + cw, cy + ch / 2]], C.line2, 1.5, [6, 6]);
    g.strokeStyle = C.gold; g.lineWidth = 3; g.lineJoin = 'round'; g.beginPath(); for (let i = 0; i <= ki; i++) { const px = cx + cw * i / n, py = cy + ch * (1 - GAME.wr[i]); i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
    dot(g, cx + cw * ki / n, cy + ch * (1 - GAME.wr[ki]), 6, C.gold); txt(g, Math.round(GAME.wr[ki] * 100) + '%', X + W - 22, y + 26, C.gold, fnt(700, 22, 'mono'), 'right');
    y += 166;
    // 两层小图
    const ms = 250, hs = new Set(), ls = new Set(); let lc = '#2fae6b';
    if (sp.hi && hiA > 0.5) for (const h of sp.hi) { if (!sn.b[h]) continue; const gr = B3.group(ki, h); gr.stones.forEach(s => hs.add(s)); gr.libs.forEach(s => ls.add(s)); if (gr.libs.size === 1) lc = '#ff5a4d'; }
    rr(g, X, y, W, ms + 62, 16, C.panel, C.line2);
    [['上层 · 小子', 0], ['下层 · 大子', 1]].forEach(([lab, l], i) => { const mx = X + 8 + i * (ms + 4); txt(g, lab, mx + ms / 2, y + 24, C.fg2, fnt(600, 20), 'center'); B3.mini(g, mx, y + 46, ms, l, ki, { hi: hs, lib: ls, libCol: lc, terr: terrA > 0.5 ? GAME.terr : null }); });
    y += ms + 78;
    // 说明 / 结果
    const hgt = B.y + B.h - y; rr(g, X, y, W, hgt, 16, sp.note ? 'rgba(255,210,122,.07)' : C.panel, sp.note ? C.gold : C.line2);
    if (sp.score) { const [bs, ws] = GAME.score, uu = SS((tk - .3 * d) / 1); txt(g, '数子结果', X + 22, y + 28, C.gold, fnt(700, 22));
      [['黑', bs, '#0c0d10', C.fg], ['白', ws, '#f4f1e6', '#111']].forEach(([lab, v, col, tc], i) => { const yy = y + 56 + i * 44, bw = (W - 150) * v / 100 * uu; rr(g, X + 60, yy, bw, 32, 6, col, C.fg3, 1.5); txt(g, lab, X + 22, yy + 16, C.fg, fnt(700, 24)); txt(g, Math.round(v * uu), X + 70 + bw, yy + 16, C.fg, fnt(700, 24, 'mono')); });
      if (hgt > 170) txt(g, sp.note || '', X + 22, y + hgt - 26, C.fg2, fnt(500, 20)); }
    else if (sp.note) { txt(g, sp.noteH || '看点', X + 22, y + 28, C.gold, fnt(700, 22)); wrapTxt(g, sp.note, X + 22, y + 64, W - 44, 32, C.fg, fnt(500, 23)); if (sp.hi) { const yy = y + hgt - 24; dot(g, X + 32, yy, 9, '#2fae6b'); txt(g, '上层的气', X + 50, yy, C.fg2, fnt(500, 19)); g.strokeStyle = '#2fae6b'; g.lineWidth = 3; g.beginPath(); g.arc(X + 172, yy, 10, 0, 7); g.stroke(); txt(g, '下层的气（圈住整个点）', X + 192, yy, C.fg2, fnt(500, 19)); } }
    else { const L = [['大子', '下层棋子'], ['小子', '上层棋子，叠在同一点上'], ['数字', '这块棋还剩几口气'], ['红圈', '只剩一口气，下一手可被提']]; L.forEach(([a, b2], i) => { const yy = y + 28 + i * 34; if (yy > y + hgt - 16) return; txt(g, a, X + 22, yy, i === 3 ? '#ff7a6e' : C.b, fnt(700, 21)); txt(g, b2, X + 92, yy, C.fg2, fnt(500, 21)); }); }
  };
})();
