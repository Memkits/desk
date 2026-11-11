// 动画（下）：新棋形、模拟数据、怎么开始下
// ---------- 03 新棋形 ----------
AN.eye = (g, t, R, st) => {
  if (st.k === 0) {
    const P = isoP(R.x + R.w * .38, R.y + 500, 7, 64, 270);
    const S = [[2, 3, 1, 1], [4, 3, 1, 1], [3, 2, 1, 1], [3, 4, 1, 1], [2, 2, 1, 1], [4, 4, 1, 1], [2, 4, 1, 1], [4, 2, 1, 1]].map(s => [...s, pop(t, .5 + s[0] * .1 + s[1] * .05)]);
    const q = pop(t, 4), fill = pop(t, 8.5);
    S.push([3, 3, 0, 1, fill]);
    dual(g, P, 7, 64, S, { marks: [[3, 3, 1, fill > .5 ? C.ok : C.gold, pop(t, 2)], [3, 3, 0, fill > .5 ? C.ok : C.bad, q * (1 - fill)]], links: [[3, 3, fill > .5 ? C.ok : C.bad, q]] });
    const x = R.x + R.w * .72, y = R.y + 200;
    al(g, pop(t, 2), () => { txt(g, '普通围棋：四子围一点 = 眼', x, y, C.fg2, fnt(700, 28)); });
    al(g, q, () => { txt(g, '双层：下面还连着一个点', x, y + 70, C.bad, fnt(800, 30)); txt(g, '对方从这里一断，就不是眼', x, y + 116, C.fg3, fnt(600, 24)); });
    al(g, fill, () => { txt(g, '把下层对应点也占住', x, y + 210, C.ok, fnt(800, 30)); txt(g, '才算真眼', x, y + 256, C.ok, fnt(800, 30)); });
    return;
  }
  // 一块跨层的棋：上层一只眼，下层一只眼
  const P = isoP(R.x + R.w * .38, R.y + 500, 7, 64, 270), u = pop(st.tk, .3);
  const up = [[1, 2], [2, 2], [3, 2], [1, 3], [3, 3], [1, 4], [2, 4], [3, 4]], dn = [[3, 2], [4, 2], [5, 2], [3, 3], [5, 3], [3, 4], [4, 4], [5, 4], [2, 3]];
  const S = [...up.map(([i, j]) => [i, j, 1, 1, u]), ...dn.map(([i, j]) => [i, j, 0, 1, u])];
  const e = pop(st.tk, 1.5), pulse = .7 + .3 * Math.sin(t * 4);
  dual(g, P, 7, 64, S, { links: [[3, 3, C.gold, u], [3, 2, C.gold, u], [3, 4, C.gold, u]], marks: [[2, 3, 1, C.ok, e * pulse, '眼'], [4, 3, 0, C.ok, e * pulse, '眼']] });
  const x = R.x + R.w * .72, y = R.y + 240;
  al(g, e, () => { txt(g, '楼上一只眼', x, y, C.ok, fnt(800, 32)); txt(g, '楼下一只眼', x, y + 60, C.ok, fnt(800, 32)); txt(g, '上下连成一块 → 活棋', x, y + 140, C.fg, fnt(800, 32)); });
  al(g, pop(st.tk, 3.5), () => txt(g, '注：下层的眼由下方 4 子 + 上层对应点围住', x, y + 210, C.fg3, fnt(600, 22)));
};

// 征子序列（平面 9 路）：白 (2,2) 被打吃，黑一路追
const LAD0 = [[2, 2, 2], [1, 2, 1], [2, 1, 1], [2, 3, 1], [3, 1, 1]];
const LADS = [[3, 2, 2], [4, 2, 1], [3, 3, 2], [3, 4, 1], [4, 3, 2], [5, 3, 1], [4, 4, 2], [4, 5, 1], [5, 4, 2], [6, 4, 1], [5, 5, 2], [5, 6, 1], [6, 5, 2], [7, 5, 1], [6, 6, 2], [6, 7, 1], [7, 6, 2], [7, 7, 1], [8, 6, 2], [8, 5, 1], [8, 7, 2], [8, 8, 1]];
function libsOf(stones, n, extra) { // 白块的气（平面）+ 楼下的气
  const m = new Map(stones.map(s => [s[0] + ',' + s[1], s[2]])), seen = new Set(), L = new Set(); const st = [[2, 2]]; seen.add('2,2');
  while (st.length) { const [i, j] = st.pop(); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { const p = [i + a, j + b], k = p.join(','); if (p[0] < 0 || p[1] < 0 || p[0] >= n || p[1] >= n) return; const c = m.get(k); if (c === undefined) L.add(k); else if (c === 2 && !seen.has(k)) { seen.add(k); st.push(p); } }); }
  return { lib: L.size, size: seen.size };
}
AN.ladder = (g, t, R, st) => {
  const n = 9, cell = 50, T0 = st.k === 0 ? t : 99;
  const steps = st.k === 0 ? Math.floor(CL((t - 2) / .55, 0, LADS.length)) : LADS.length;
  const nL = st.k === 0 ? Math.min(steps, 22) : 22;
  // 左：普通围棋
  const S1 = [...LAD0, ...LADS.slice(0, nL)];
  const caught = nL >= LADS.length;
  const S1v = S1.map(s => [s[0], s[1], s[2], caught && s[2] === 2 ? 1 - pop(t, 2 + 22 * .55 + .3) : 1]);
  const xA = R.x + 40, yA = R.y + 150;
  flat(g, xA, yA, n, cell, S1v.filter(s => s[3] > 0), { label: '普通围棋：一路被打吃' });
  const la = libsOf(S1.filter(s => s[2] !== 2 || !caught), n);
  // 右：双层（同样的追法，楼下全空）
  const xB = R.x + 700, yB = R.y + 150, kk = Math.min(nL, 4);
  const S2 = [...LAD0, ...LADS.slice(0, kk)];
  const lb = libsOf(S2, n), down = lb.size;
  flat(g, xB, yB, n, cell, S2, { label: '双层：楼下每颗都多一口气', lcol: C.gold, over: [() => S2.filter(s => s[2] === 2).forEach(([i, j]) => { const p = .7 + .3 * Math.sin(t * 5); al(g, p, () => { dot(g, xB + i * cell + 14, yB + j * cell + 14, 9, C.gold); }); })] });
  const yT = yA + (n - 1) * cell + 90;
  txt(g, `白块的气：${caught && st.k === 0 && t > 2 + 22 * .55 ? 0 : la.lib}`, xA, yT, la.lib <= 1 ? C.bad : C.fg, fnt(800, 30));
  txt(g, `白块的气：${lb.lib} + 楼下 ${down} = ${lb.lib + down}`, xB, yT, C.gold, fnt(800, 30));
  al(g, pop(t, 5), () => txt(g, '一手只能堵一口 → 追不上', xB, yT + 50, C.fg2, fnt(700, 26)));
  if (st.k === 1) {
    al(g, pop(st.tk, .5), () => { rr(g, R.x + 40, R.y + 730, R.w - 80, 70, 14, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '除非楼下早已布好棋子，征子基本失效', R.x + 70, R.y + 765, C.fg, fnt(800, 30)); });
  }
};

// ---------- 04 模拟 ----------
AN.simintro = (g, t, R, st) => {
  const names = [['9×9', '普通'], ['11×11', '普通'], ['环面 11×11', '没有边'], ['双曲 {5,4}', '125 点'], ['双曲 {4,5}', '100 点'], ['双层 8×8×2', '128 点'], ['立方 5×5×5', '125 点'], ['立方 + 气阈值 2', '状态扩展'], ['金刚石晶格', '128 点']];
  const cw = 380, ch = 150, gx = 36, gy = 28, x0 = R.x + 20, y0 = R.y + 160;
  al(g, pop(t, .3), () => { bot(g, R.x + 80, R.y + 60, C.p, 1.4); txt(g, '蒙特卡洛树搜索 · 自己和自己下', R.x + 140, R.y + 60, C.fg, fnt(800, 32)); });
  names.forEach(([a, b], i) => al(g, pop(t, 1 + i * .3), () => { const x = x0 + (i % 3) * (cw + gx), y = y0 + Math.floor(i / 3) * (ch + gy), hot = i === 5;
    rr(g, x, y, cw, ch, 16, hot ? 'rgba(95,224,160,.08)' : 'rgba(14,20,36,.94)', hot ? C.g : C.line2, hot ? 3 : 2);
    txt(g, a, x + 28, y + 56, hot ? C.g : C.fg, fnt(800, 30)); txt(g, b, x + 28, y + 106, C.fg3, fnt(600, 22));
    const pl = (Math.floor(t * 3 + i * 7) % 9); for (let q = 0; q < 6; q++) stone(g, x + cw - 150 + (q % 3) * 40, y + 50 + Math.floor(q / 3) * 44, 15, (q + pl) % 2 ? 1 : 2, .9); }));
};
AN.simbars = (g, t, R, st) => {
  const D = [['11×11', .44, 13, C.fg2], ['双曲 {5,4}', .61, 31, C.r], ['金刚石', .51, 38, C.o], ['立方', .22, 3, C.b], ['双层', .35, 6, C.g]];
  const w = (R.w - 80) / 2;
  [['每手平均提子', 1, .7, v => v.toFixed(2)], ['走满步数上限的对局', 2, 45, v => v + '%']].forEach(([ttl, idx, max, fmt], k) => {
    const x = R.x + k * (w + 80), y = R.y + 40;
    al(g, pop(t, .3 + k * 3), () => { txt(g, ttl, x + 10, y, C.fg, fnt(800, 30)); bars(g, x, y + 60, w, 440, D.map(d => [d[0], d[idx], d[3]]), t, { max, t0: .6 + k * 3, gap: .3, fmt }); });
  });
  al(g, pop(t, 9), () => { rr(g, R.x + 10, R.y + 640, R.w - 20, 80, 14, 'rgba(95,224,160,.08)', C.g, 2); txt(g, '双层：提子与普通围棋同量级，几乎都能正常下完', R.x + 40, R.y + 680, C.fg, fnt(800, 28)); });
};
AN.replay = (g, t, R, st) => {
  const G = window.GAME; if (!G) return;
  const D = st.D || 30, mv = Math.min(G.len, Math.floor(CL((t - .8) / (D - 3)) * G.len));
  const S = G.at(mv), n = 9, cell = 50;
  [1, 0].forEach((z, k) => {
    const x = R.x + 60 + k * 640, y = R.y + 120;
    const last = G.mv[mv - 1];
    flat(g, x, y, n, cell, S.filter(s => s[2] === z).map(s => [s[0], s[1], s[3]]), { label: z ? '上层' : '下层', under: [() => { if (last && last[2] === z && mv > 0) { g.save(); g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); g.arc(x + last[0] * cell, y + last[1] * cell, cell * .55, 0, TAU); g.stroke(); g.restore(); } }] });
  });
  const y = R.y + 670;
  txt(g, `第 ${mv} 手`, R.x + 60, y, C.fg, fnt(800, 32, 'mono'));
  txt(g, `累计提子 ${G.caps[mv] || 0}`, R.x + 300, y, C.fg2, fnt(700, 28, 'mono'));
  const cnt = [1, 2].map(c => S.filter(s => s[3] === c).length);
  stone(g, R.x + 640, y, 16, 1); txt(g, String(cnt[0]), R.x + 668, y, C.fg, fnt(800, 30, 'mono'));
  stone(g, R.x + 760, y, 16, 2); txt(g, String(cnt[1]), R.x + 788, y, C.fg, fnt(800, 30, 'mono'));
  txt(g, '电脑自对弈（真实对局）', R.x + 60, R.y + 730, C.gold, fnt(700, 24));
};

// ---------- 05 怎么开始下 ----------
AN.howto = (g, t, R, st) => {
  const n = 9, cell = 50, G = window.GAME, S = G ? G.at(60) : [];
  const path = [[2, 2], [4, 3], [6, 6], [3, 6], [5, 5]], seg = 1.6, k = Math.floor(t / seg) % path.length, u = SS((t % seg) / .8);
  const a = path[k], b = path[(k + 1) % path.length], hi = u > .95 ? b : a, ci = LERP(a[0], b[0], u), cj = LERP(a[1], b[1], u);
  const xs = [R.x + 60, R.x + 700], y = R.y + 120;
  [1, 0].forEach((z, q) => flat(g, xs[q], y, n, cell, S.filter(s => s[2] === z).map(s => [s[0], s[1], s[3]]), { label: z ? '上层' : '下层', under: [() => { g.save(); g.fillStyle = 'rgba(255,210,122,.45)'; g.beginPath(); g.arc(xs[q] + hi[0] * cell, y + hi[1] * cell, cell * .5, 0, TAU); g.fill(); g.restore(); }] }));
  line(g, [[xs[0] + hi[0] * cell, y + hi[1] * cell], [xs[1] + hi[0] * cell, y + hi[1] * cell]], 'rgba(255,210,122,.6)', 2, [6, 8]);
  const mx = xs[0] + ci * cell + 6, my = y + cj * cell + 6; g.save(); g.fillStyle = '#fff'; g.strokeStyle = '#000'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx + 16, my + 36); g.lineTo(mx + 22, my + 22); g.lineTo(mx + 38, my + 20); g.closePath(); g.fill(); g.stroke(); g.restore();
  txt(g, '鼠标停在上层，下层对应点同时亮起', R.x + 60, R.y + 690, C.fg, fnt(800, 30));
};
AN.openq = (g, t, R, st) => {
  const Q = [['贴目该贴多少？', '先手优势还没测准', C.gold], ['开局先占什么？', '角，还是上下相连的要点', C.b], ['三层会更好吗？', '中间层每颗子 6 口气', C.p]];
  const w = (R.w - 60) / 3;
  Q.forEach(([a, b, col], i) => al(g, pop(t, .4 + i * 1.6), () => { const x = R.x + i * (w + 30), y = R.y + 140; rr(g, x, y, w, 420, 22, 'rgba(14,20,36,.94)', col, 2.5);
    txt(g, '?', x + w / 2, y + 140, col, fnt(900, 120, 'serif'), 'center'); txt(g, a, x + w / 2, y + 280, C.fg, fnt(800, 34), 'center'); txt(g, b, x + w / 2, y + 340, C.fg3, fnt(600, 24), 'center'); }));
};
AN.end = (g, t, R, st) => {
  stars(g, R, t, 80, .3);
  const G = window.GAME, S = G ? G.at(120) : [];
  const P = isoP(R.x + R.w / 2, R.y + 560, 9, 46, 280, Math.PI / 4 + t * .06);
  dual(g, P, 9, 46, S.map(s => [...s, .95]));
  al(g, pop(t, 1), () => txt(g, '极简的规则 · 极深的变化', R.x + R.w / 2, R.y + 20, C.fg2, fnt(700, 30), 'center'));
  al(g, pop(t, 5), () => txt(g, '相邻，多了一个方向', R.x + R.w / 2, R.y + 80, C.gold, fnt(900, 50, 'serif'), 'center'));
};
