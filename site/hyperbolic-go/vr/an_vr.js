// 各场画面。
const YAW = t => .6 + t * .16;
// 通用格点棋盘：stones = [[x,y,z,pal]]，坐标已居中
function latDraw(g, P, n, stones, o = {}) { const h = (n - 1) / 2, items = [];
  if (o.grid !== false) for (let a = 0; a < n; a++) for (let b2 = 0; b2 < n; b2++) { [[[-h, a - h, b2 - h], [h, a - h, b2 - h]], [[a - h, -h, b2 - h], [a - h, h, b2 - h]], [[a - h, b2 - h, -h], [a - h, b2 - h, h]]].forEach(([p, q]) => { const A = P(p), B = P(q); items.push({ d: (A[2] + B[2]) / 2 - .02, fn: () => line(g, [A, B], 'rgba(150,170,210,.2)', 1.2) }); }); }
  stones.forEach(([x, y, z, pal, r = .36, a = 1]) => { const p = P([x, y, z]); items.push({ d: p[2], fn: () => { ball(g, p[0], p[1], P.s * r * p[3], PAL[pal] || pal, a); if (pal === 'k') { g.strokeStyle = 'rgba(200,210,230,.5)'; g.lineWidth = 1.2; g.beginPath(); g.arc(p[0], p[1], P.s * r * p[3], 0, 7); g.stroke(); } } }); });
  (o.extra || []).forEach(e => items.push(e)); runItems(items); }
const GO3 = (() => { const r = mkRng(7), a = []; for (let x = 0; x < 5; x++) for (let y = 0; y < 5; y++) for (let z = 0; z < 5; z++) { const u = r(); if (u < .52) a.push([x - 2, y - 2, z - 2, u < .26 ? 'k' : 'w']); } return a; })();
function wire(g, P, f, nu, nv, col) { const items = []; for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) { const u0 = i / nu * 2 * Math.PI, u1 = (i + 1) / nu * 2 * Math.PI, v0 = j / nv * 2 * Math.PI, v1 = (j + 1) / nv * 2 * Math.PI; const a = P(f(u0, v0)), b = P(f(u1, v0)), c = P(f(u0, v1)); items.push({ d: (a[2] + b[2]) / 2, fn: () => line(g, [a, b], col((a[2] + b[2]) / 2), 1.6) }, { d: (a[2] + c[2]) / 2, fn: () => line(g, [a, c], col((a[2] + c[2]) / 2), 1.6) }); } return items; }
const torus = (u, v) => [(1.5 + .62 * Math.cos(v)) * Math.cos(u), (1.5 + .62 * Math.cos(v)) * Math.sin(u), .62 * Math.sin(v)];
const sphere = (u, v) => [1.9 * Math.cos(u) * Math.sin(v / 2), 1.9 * Math.sin(u) * Math.sin(v / 2), 1.9 * Math.cos(v / 2)];
function surfDraw(g, cx, cy, s, yaw, f, seed) { const P = mkP(cx, cy, s, yaw, .5, 0), col = d => d > 0 ? 'rgba(170,190,230,.55)' : 'rgba(120,135,170,.16)', items = wire(g, P, f, 20, 10, col), r = mkRng(seed);
  for (let i = 0; i < 46; i++) { const u = (Math.floor(r() * 20)) / 20 * 2 * Math.PI, v = (Math.floor(r() * 10) + (f === sphere ? .0 : 0)) / 10 * 2 * Math.PI, p = P(f(u, v)), k = r() < .5 ? 'k' : 'w'; items.push({ d: p[2] + .01, fn: () => ball(g, p[0], p[1], s * .13, PAL[k], p[2] > 0 ? 1 : .22) }); } runItems(items); }
function hypDraw(g, cx, cy, Rad, seed, zoom = 0) { const r = mkRng(seed); g.save(); g.beginPath(); g.arc(cx, cy, Rad, 0, 7); g.fillStyle = 'rgba(255,255,255,.03)'; g.fill(); g.strokeStyle = 'rgba(170,190,230,.6)'; g.lineWidth = 2; g.stroke(); g.clip();
  for (let k = 0; k <= 6; k++) { const rr0 = Math.tanh(k * .42) * Rad, n = k === 0 ? 1 : Math.round(5 * Math.pow(2.05, k - 1)); if (k) { g.strokeStyle = 'rgba(150,170,210,.22)'; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, rr0, 0, 7); g.stroke(); }
    for (let i = 0; i < n; i++) { const a = i / n * 2 * Math.PI + k * .3, x = cx + rr0 * Math.cos(a), y = cy + rr0 * Math.sin(a), sz = Math.max(1.6, 22 * (1 - Math.tanh(k * .42) ** 2)), u = r(); if (u < .7) ball(g, x, y, sz, PAL[u < .35 ? 'k' : 'w']); else dot(g, x, y, Math.max(.8, sz * .25), 'rgba(170,185,215,.4)'); } } g.restore(); }
function bigDraw(g, cx, cy, w, seed) { const n = 37, c = w / (n - 1), r = mkRng(seed), x0 = cx - w / 2, y0 = cy - w / 2; g.strokeStyle = 'rgba(150,170,210,.2)'; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < n; i++) { g.moveTo(x0, y0 + i * c); g.lineTo(x0 + w, y0 + i * c); g.moveTo(x0 + i * c, y0); g.lineTo(x0 + i * c, y0 + w); } g.stroke();
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const u = r(); if (u < .4) dot(g, x0 + i * c, y0 + j * c, c * .42, u < .2 ? '#343D55' : '#D5DBE8'); } }

AN.open = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, cx = R.x + R.w / 2;
  if (st.k === 0) { if (tk < 4.6) return; const a = SS((tk - 4.8) / .8), k = Math.round(54 * CL((tk - .3 * d) / (.65 * d)));
    g.save(); g.globalAlpha = a; lmPly(g, R.x + 430, R.y + 400, 74, YAW(t), 'B', k, { last: -1 }); g.restore(); const x = R.x + 900;
    fadeIn(g, Math.min(a, 1 - SS((tk - .28 * d) / .6) * .65), () => { txt(g, '前两期', x, R.y + 150, C.fg3, fnt(600, 26)); txt(g, '在平面上找新游戏', x, R.y + 210, C.fg, fnt(800, 48)); });
    fadeIn(g, (tk - .28 * d) / .6, () => { txt(g, '这一期', x, R.y + 330, C.fg3, fnt(600, 26)); txt(g, '戴上 VR，走进棋盘里面', x, R.y + 390, C.fg, fnt(800, 48)); });
    fadeIn(g, (tk - .6 * d) / .6, () => { txt(g, '哪些纯靠脑子的博弈', x, R.y + 510, C.gold, fnt(700, 36)); txt(g, '屏幕上下不了，现在可以下？', x, R.y + 566, C.gold, fnt(700, 36)); });
  } else { const cards = [['范围', C.b, ['VR 只当眼睛和腿用', '不比手快，不比体力', '双方看到的信息完全一样']], ['做了什么', C.g, ['查已有的先例', '设计一个新游戏：线与膜', '让搜索程序自己和自己下']], ['没做什么', C.r, ['没有在 VR 设备里试过', '没有人真正下过', '“看得清”是推断']]];
    cards.forEach(([h, col, ls], i) => card(g, R.x + 40 + i * 560, R.y + 110, 520, 330, h, ls, col, SS((tk - [.03, .3, .55][i] * d) / .6), false, 27));
    fadeIn(g, (tk - .8 * d) / .6, () => txt(g, '文稿与画面由 AI（Claude）生成 · 配音由 AI 合成 · 对局来自程序自对弈', cx, R.y + 600, C.fg3, fnt(500, 24), 'center')); } };

AN.see = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, yaw = YAW(t);
  if (st.k === 0) { const P = mkP(R.x + 520, R.y + 400, 96, yaw); latDraw(g, P, 5, GO3); const x = R.x + 1080;
    txt(g, '第一类：三维格点', x, R.y + 150, C.fg, fnt(800, 44)); fadeIn(g, (tk - .35 * d) / .6, () => txt(g, '把围棋从一张纸换成一个立方体', x, R.y + 240, C.fg2, fnt(600, 30)));
    fadeIn(g, (tk - .55 * d) / .6, () => txt(g, '前面的子挡住后面的', x, R.y + 330, C.gold, fnt(700, 36))); fadeIn(g, (tk - .75 * d) / .6, () => txt(g, '这块棋还剩几口气？数不清', x, R.y + 400, C.gold, fnt(700, 36)));
  } else { const ps = [['第二类：闭合曲面', '环面、球面', '永远只看得到一半', '绕着它转一圈'], ['', '', '', ''], ['第三类：双曲棋盘', '越靠边格子越密', '边缘挤成一条线', '站上去，走到哪里哪里不变形'], ['第四类：超大棋盘', '37×37 以上', '缩小丢细节，放大丢全局', '远看全局，走近看局部']];
    const at = st.k === 1 ? [.02, .02, .36, .68] : [0, 0, 0, 0], w = 540, xs = [R.x + 20, R.x + 20, R.x + 590, R.x + 1160];
    [0, 2, 3].forEach(i => { const a = SS((tk - at[i] * d) / .6); if (a <= 0) return; g.save(); g.globalAlpha = a; const x = xs[i], y = R.y + 20; panel(g, x, y, w, 660); txt(g, ps[i][0], x + w / 2, y + 46, C.fg, fnt(800, 30), 'center');
      if (i === 0) { surfDraw(g, x + 150, y + 290, 62, yaw, torus, 3); surfDraw(g, x + 400, y + 290, 60, yaw, sphere, 5); } if (i === 2) hypDraw(g, x + w / 2, y + 290, 190, 11); if (i === 3) bigDraw(g, x + w / 2, y + 290, 380, 13);
      txt(g, ps[i][1], x + w / 2, y + 530, C.fg2, fnt(500, 24), 'center');
      if (st.k === 1) txt(g, ps[i][2], x + w / 2, y + 590, C.gold, fnt(700, 28), 'center'); else { const u = SS((tk - [.12, 0, .3, .45][i] * d) / .5); txt(g, ps[i][2], x + w / 2, y + 590, C.gold, fnt(700, 28), 'center'); if (u > 0) { g.globalAlpha = a * u; rr(g, x + 20, y + 556, w - 40, 76, 12, 'rgba(14,20,36,.98)', C.g, 2); txt(g, 'VR：' + ps[i][3], x + w / 2, y + 594, C.g, fnt(700, 27), 'center'); } } g.restore(); });
    if (st.k === 2) fadeIn(g, (tk - .72 * d) / .6, () => { rr(g, R.x + 20, R.y + 700, R.w - 40, 70, 14, 'rgba(255,210,122,.08)', C.gold, 2); txt(g, '看得清，只解决了一半的问题', R.x + R.w / 2, R.y + 735, C.fg, fnt(800, 32), 'center'); }); } };

AN.prior = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, x = R.x + 40;
  if (st.k === 0) { panel(g, x, R.y + 30, R.w - 80, 700); txt(g, 'Freed Go', x + 40, R.y + 90, C.b, fnt(800, 44)); txt(g, 'Lewey Geselowitz · 在各种曲面和三维图上下围棋的程序', x + 290, R.y + 94, C.fg3, fnt(500, 24));
    const bs = ['球面', '柱面', '环面', '莫比乌斯带', '立方体', '双层', '金刚石晶格', '平面', '3 邻居平面', '5 邻居平面', '6 邻居平面']; let cx2 = x + 40, cy2 = R.y + 190;
    bs.forEach((b, i) => { const a = SS((tk - (.22 + i * .028) * d) / .4); if (a <= 0) return; g.font = fnt(700, 28); const w = g.measureText(b).width + 32; if (cx2 + w > x + R.w - 120) { cx2 = x + 40; cy2 += 78; } chip(g, b, cx2, cy2, i < 7 ? C.b : C.fg3, a, 28); cx2 += w + 18; });
    fadeIn(g, (tk - .5 * d) / .5, () => txt(g, '共 11 种棋盘，还可以自定义任意的图', x + 40, R.y + 370, C.fg2, fnt(500, 26)));
    fadeIn(g, (tk - .68 * d) / .6, () => { rr(g, x + 40, R.y + 440, R.w - 160, 220, 16, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, '作者自己写道（大意）', x + 76, R.y + 490, C.fg3, fnt(500, 24)); txt(g, '“一张截图很难看懂，', x + 76, R.y + 556, C.fg, fnt(700, 38)); txt(g, '　你必须在三维里下，才能理解。”', x + 76, R.y + 616, C.fg, fnt(700, 38)); });
  } else { card(g, x, R.y + 30, 800, 300, '金刚石围棋（Diamond Go）', ['棋盘是金刚石的晶格', '每个点正好 4 个邻居，和平面围棋一样', '论坛里称它是较常见的三维变体'], C.b, SS((tk - .02 * d) / .6), false, 27);
    card(g, x + 840, R.y + 30, 800, 300, 'Margo（2006，Cameron Browne）', ['弹珠可以叠在四颗弹珠上面', '只有棋盘那一层的空点算气', '叠上去的子不提供气'], C.p, SS((tk - .3 * d) / .6), false, 27);
    fadeIn(g, (tk - .58 * d) / .6, () => txt(g, '这些游戏都没有流行起来', R.x + R.w / 2, R.y + 420, C.fg, fnt(800, 40), 'center'));
    fadeIn(g, (tk - .72 * d) / .6, () => { rr(g, x + 100, R.y + 490, 640, 130, 16, 'rgba(14,20,36,.9)', C.g, 2); txt(g, '一半是看不清', x + 420, R.y + 530, C.g, fnt(800, 34), 'center'); txt(g, 'VR 可以补上', x + 420, R.y + 584, C.fg2, fnt(500, 25), 'center'); });
    fadeIn(g, (tk - .84 * d) / .6, () => { rr(g, x + 900, R.y + 490, 640, 130, 16, 'rgba(14,20,36,.9)', C.bad, 2); txt(g, '另一半出在规则上', x + 1220, R.y + 530, C.bad, fnt(800, 34), 'center'); txt(g, '要靠改规则', x + 1220, R.y + 584, C.fg2, fnt(500, 25), 'center'); }); } };

function grid2(g, x0, y0, n, c) { g.strokeStyle = 'rgba(150,170,210,.25)'; g.lineWidth = 1.5; g.beginPath(); for (let i = 0; i < n; i++) { g.moveTo(x0, y0 + i * c); g.lineTo(x0 + (n - 1) * c, y0 + i * c); g.moveTo(x0 + i * c, y0); g.lineTo(x0 + i * c, y0 + (n - 1) * c); } g.stroke(); }
AN.flaw = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, yaw = YAW(t), lx = R.x + 420, rx = R.x + 1280, cy = R.y + 370, heads = ['第一条：气太多', '第二条：围不住', '第三条：线挡不住人'];
  txt(g, heads[st.k], R.x + 20, R.y + 26, C.fg, fnt(800, 36)); txt(g, '平面', lx, R.y + 100, C.fg3, fnt(700, 28), 'center'); txt(g, '三维', rx, R.y + 100, C.fg3, fnt(700, 28), 'center'); line(g, [[R.x + R.w / 2, R.y + 90], [R.x + R.w / 2, R.y + 700]], C.line2, 2);
  const c = 84, x0 = lx - 3 * c, y0 = cy - 3 * c + 10;
  if (st.k === 0) { grid2(g, x0 + c, y0 + c, 5, c); ball(g, lx, cy + 10, 34, PAL.w); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy], i) => { const a = SS((tk - (.3 + i * .04) * d) / .4); g.save(); g.globalAlpha = a; dot(g, lx + dx * c, cy + 10 + dy * c, 15, C.g); g.restore(); });
    const P = mkP(rx, cy + 10, 110, yaw), lib = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map((p, i) => [...p, 'g', .2, SS((tk - (.5 + i * .04) * d) / .4)]); latDraw(g, P, 3, [[0, 0, 0, 'w', .4], ...lib]);
    fadeIn(g, (tk - .34 * d) / .5, () => txt(g, '4 口气', lx, R.y + 690, C.g, fnt(800, 40), 'center')); fadeIn(g, (tk - .56 * d) / .5, () => txt(g, '6 口气', rx, R.y + 690, C.g, fnt(800, 40), 'center'));
    fadeIn(g, (tk - .8 * d) / .5, () => txt(g, '吃一个子多花一半的手数，战斗变少', R.x + R.w / 2, R.y + 760, C.gold, fnt(700, 30), 'center'));
  } else if (st.k === 1) { const c2 = 70, gx = lx - 3 * c2, gy = cy - 3 * c2 + 10; grid2(g, gx, gy, 7, c2); g.fillStyle = 'rgba(92,180,255,.12)'; g.fillRect(gx + 1.5 * c2, gy + 1.5 * c2, 3 * c2, 3 * c2);
    const ring = []; for (let i = 2; i <= 4; i++) ring.push([i, 1], [i, 5], [1, i], [5, i]); const nr = Math.round(12 * CL((tk - .22 * d) / (.2 * d))); ring.slice(0, nr).forEach(([i, j]) => ball(g, gx + i * c2, gy + j * c2, 26, PAL[1]));
    const shell = []; for (let a = -1; a <= 1; a++) for (let b2 = -1; b2 <= 1; b2++) shell.push([a, b2, -2], [a, -2, b2], [-2, a, b2], [2, a, b2], [a, 2, b2], [a, b2, 2]); const ns = Math.round(54 * CL((tk - .5 * d) / (.3 * d)));
    const P = mkP(rx, cy + 10, 72, yaw), items = []; for (let a = -1; a <= 1; a++) for (let b2 = -1; b2 <= 1; b2++) for (let e = -1; e <= 1; e++) { const p = P([a, b2, e]); items.push({ d: p[2], fn: () => dot(g, p[0], p[1], 5, 'rgba(92,180,255,.55)') }); }
    shell.slice(0, ns).forEach(w => { const p = P(w); items.push({ d: p[2], fn: () => ball(g, p[0], p[1], 72 * .3 * p[3], PAL[1], .92) }); }); runItems(items);
    fadeIn(g, (tk - .24 * d) / .5, () => txt(g, `围 3×3：${nr} 子`, lx, R.y + 690, C.b, fnt(800, 40), 'center')); fadeIn(g, (tk - .52 * d) / .5, () => txt(g, `围 3×3×3：${ns} 子`, rx, R.y + 690, C.b, fnt(800, 40), 'center'));
    fadeIn(g, (tk - .86 * d) / .5, () => txt(g, '围地的手数按面积涨', R.x + R.w / 2, R.y + 760, C.gold, fnt(700, 30), 'center'));
  } else { const c2 = 70, gx = lx - 3 * c2, gy = cy - 3 * c2 + 10; grid2(g, gx, gy, 7, c2); for (let j = 0; j < 7; j++) { if (j) line(g, [[gx + 3 * c2, gy + (j - 1) * c2], [gx + 3 * c2, gy + j * c2]], '#3F8FD6', 10); } for (let j = 0; j < 7; j++) ball(g, gx + 3 * c2, gy + j * c2, 24, PAL[1]);
    const u = CL((tk - .2 * d) / (.14 * d)); [0, 1, 2].slice(0, Math.round(u * 3)).forEach(i => ball(g, gx + i * c2, gy + 3 * c2, 24, PAL[2])); if (tk > .36 * d) cross(g, gx + 3 * c2 - 36, gy + 3 * c2 - 44, SS((tk - .36 * d) / .4), C.bad, 16);
    const P = mkP(rx, cy + 10, 80, yaw), st2 = [], ex = []; for (let x = -2; x <= 2; x++) st2.push([x, 0, 0, 1, .3]); for (let x = -2; x < 2; x++) { const a = P([x, 0, 0]), b2 = P([x + 1, 0, 0]); ex.push({ d: (a[2] + b2[2]) / 2 - .01, fn: () => line(g, [a, b2], '#3F8FD6', 11) }); }
    const pth = [[0, -2, 0], [0, -1, 0], [0, -1, 1], [0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 2, 0]], np = Math.round(7 * CL((tk - .66 * d) / (.2 * d))); pth.slice(0, np).forEach(p => st2.push([...p, 2, .3])); for (let i = 0; i + 1 < np; i++) { const a = P(pth[i]), b2 = P(pth[i + 1]); ex.push({ d: (a[2] + b2[2]) / 2 - .01, fn: () => line(g, [a, b2], '#D98A30', 11) }); }
    latDraw(g, P, 5, st2, { extra: ex });
    fadeIn(g, (tk - .38 * d) / .5, () => txt(g, '一条线把棋盘分成两边', lx, R.y + 690, C.b, fnt(800, 36), 'center')); fadeIn(g, (tk - .7 * d) / .5, () => txt(g, '从旁边绕过去', rx, R.y + 690, C.o, fnt(800, 36), 'center'));
    fadeIn(g, (tk - .9 * d) / .5, () => txt(g, '墙的作用消失了', R.x + R.w / 2, R.y + 760, C.gold, fnt(700, 30), 'center')); } };

const EXB = (() => { const b = new Uint8Array(125); [[2, 2, 0], [2, 2, 1], [3, 2, 1], [3, 2, 2], [3, 2, 3], [3, 3, 3], [3, 3, 4]].forEach(p => b[cid(...p)] = 1); [[2, 2, 2], [1, 3, 1], [4, 1, 3], [0, 0, 2]].forEach(p => b[cid(...p)] = 2); return b; })();
const EXORD = [[2, 2, 0], [2, 2, 1], [2, 2, 2], [3, 2, 1], [3, 2, 2], [1, 3, 1], [3, 2, 3], [4, 1, 3], [3, 3, 3], [0, 0, 2], [3, 3, 4]].map(p => cid(...p));
const MEMB = (() => { const b = new Uint8Array(125); for (let x = 0; x < 5; x++) for (let y = 0; y < 5; y++) b[cid(x, y, x < 2 ? 3 : (x >= 3 && y >= 3) ? 1 : 2)] = 2; [[1, 1, 0], [1, 1, 1], [1, 1, 2], [3, 3, 0], [4, 0, 0], [4, 0, 1], [0, 4, 4], [2, 2, 4], [2, 2, 3]].forEach(p => b[cid(...p)] = 1); return b; })();
AN.rule = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, yaw = YAW(t);
  if (st.k === 0) { const lx = R.x + 400, rx = R.x + 1240, cy = R.y + 400; txt(g, '平面：线 对 线', lx, R.y + 60, C.fg, fnt(800, 38), 'center'); const c2 = 70, gx = lx - 3 * c2, gy = cy - 3 * c2; grid2(g, gx, gy, 7, c2);
    for (let j = 0; j < 7; j++) { if (j) line(g, [[gx + 3 * c2, gy + (j - 1) * c2], [gx + 3 * c2, gy + j * c2]], '#3F8FD6', 10); } for (let j = 0; j < 7; j++) ball(g, gx + 3 * c2, gy + j * c2, 24, PAL[1]); [0, 1, 2, 4, 5, 6].forEach(i => ball(g, gx + i * c2, gy + 3 * c2, 24, PAL[2], .55));
    fadeIn(g, (tk - .1 * d) / .5, () => txt(g, '蓝线连通了，橙线就一定断', lx, R.y + 700, C.fg2, fnt(600, 26), 'center'));
    fadeIn(g, (tk - .3 * d) / .6, () => { txt(g, '三维：线 对 膜', rx, R.y + 60, C.fg, fnt(800, 38), 'center'); const b = new Uint8Array(125), nl = Math.round(2 * CL((tk - .34 * d) / (.1 * d))), nm = Math.round(25 * CL((tk - .5 * d) / (.25 * d))); for (let z = 0; z < nl; z++) b[cid(2, 2, z)] = 1; for (let i = 0; i < nm; i++) b[50 + i] = 2; lmDraw(g, rx, cy + 10, 62, yaw, b, { dots: true }); });
    fadeIn(g, (tk - .55 * d) / .5, () => txt(g, '能把空间隔开的不是线，而是面', rx, R.y + 700, C.gold, fnt(700, 28), 'center'));
    fadeIn(g, (tk - .86 * d) / .5, () => txt(g, '线与膜', R.x + R.w / 2, R.y + 770, C.gold, fnt(900, 44), 'center'));
  } else if (st.k === 1) { const b = new Uint8Array(125), n = Math.round(EXORD.length * CL((tk - .3 * d) / (.5 * d))); EXORD.slice(0, n).forEach(c => b[c] = EXB[c]); const pth = lmPath(b); lmDraw(g, R.x + 480, R.y + 400, 80, yaw, b, { labels: true, path: pth ? new Set(pth) : null }); const x = R.x + 1000;
    txt(g, '5 × 5 × 5 = 125 个小格', x, R.y + 110, C.fg, fnt(800, 40));
    fadeIn(g, (tk - .28 * d) / .5, () => { ball(g, x + 22, R.y + 230, 20, PAL[1]); txt(g, '蓝方 = 线方', x + 60, R.y + 230, C.b, fnt(800, 34)); txt(g, '用面对面相邻的蓝格', x + 60, R.y + 290, C.fg2, fnt(500, 27)); txt(g, '从底面一路连到顶面', x + 60, R.y + 334, C.fg2, fnt(500, 27)); });
    fadeIn(g, (tk - .7 * d) / .5, () => { g.fillStyle = '#EB963C'; g.fillRect(x + 4, R.y + 442, 36, 36); txt(g, '橙方 = 膜方', x + 60, R.y + 460, C.o, fnt(800, 34)); txt(g, '让蓝方永远连不上', x + 60, R.y + 520, C.fg2, fnt(500, 27)); });
  } else { const lx = R.x + 360, rx = R.x + 1360, cy = R.y + 330; const pth = new Set(lmPath(EXB)); lmDraw(g, lx, cy, 56, yaw, EXB, { path: pth }); txt(g, '蓝方连通', lx, R.y + 620, C.b, fnt(800, 32), 'center');
    const fl = lmFlood(MEMB, v => v !== 2), fs = new Set(fl.q), mem = new Set(); fl.q.forEach(c => NB6[c].forEach(n => { if (MEMB[n] === 2) mem.add(n); })); lmDraw(g, rx, cy, 56, yaw, MEMB, { mem, flood: fs, fa: SS((tk - .1 * d) / 1) }); txt(g, '橙方的膜把上下隔开', rx, R.y + 620, C.o, fnt(800, 32), 'center');
    fadeIn(g, (tk - .2 * d) / .6, () => { txt(g, '填满时', R.x + R.w / 2, cy - 60, C.fg3, fnt(600, 26), 'center'); txt(g, '两者必居其一', R.x + R.w / 2, cy, C.gold, fnt(800, 40), 'center'); txt(g, '没有和棋', R.x + R.w / 2, cy + 60, C.gold, fnt(800, 40), 'center'); });
    fadeIn(g, (tk - .6 * d) / .6, () => { rr(g, R.x + 240, R.y + 680, 560, 90, 14, 'rgba(14,20,36,.92)', C.b, 2); txt(g, '线按长度算：每回合 1 子', R.x + 520, R.y + 725, C.fg, fnt(700, 28), 'center'); });
    fadeIn(g, (tk - .78 * d) / .6, () => { rr(g, R.x + 920, R.y + 680, 560, 90, 14, 'rgba(14,20,36,.92)', C.o, 2); txt(g, '膜按面积算：每回合 2 子', R.x + 1200, R.y + 725, C.fg, fnt(700, 28), 'center'); }); } };

AN.game = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, yaw = YAW(t), cx = R.x + 560, cy = R.y + 400, x = R.x + 1120;
  if (st.k === 0) { const k = Math.round(25 * CL((tk - .1 * d) / (.62 * d))), pth = k >= 25 ? new Set(lmPath(LM.A[25])) : null; lmPly(g, cx, cy, 84, yaw, 'A', k, { path: pth, labels: true }); lmSide(g, x, R.y + 60, 'A', k, ['程序强度：每步 2000 次模拟（浅）']);
    fadeIn(g, (tk - .5 * d) / .5, () => txt(g, '橙方的子东一个、西一个', x, R.y + 430, C.fg2, fnt(600, 28))); if (k >= 25) fadeIn(g, (tk - .74 * d) / .5, () => { rr(g, x, R.y + 490, 560, 120, 16, 'rgba(92,180,255,.1)', C.b, 2.5); txt(g, '第 25 手：蓝方连到顶面', x + 280, R.y + 528, C.fg, fnt(800, 30), 'center'); txt(g, '线方获胜', x + 280, R.y + 578, C.b, fnt(800, 30), 'center'); });
  } else if (st.k === 1) { const k = tk < .32 * d ? Math.round(13 * CL((tk - .08 * d) / (.2 * d))) : 13 + Math.round(29 * CL((tk - .4 * d) / (.56 * d))); lmPly(g, cx, cy, 84, yaw, 'B', k, { labels: true }); lmSide(g, x, R.y + 60, 'B', k, ['程序强度：每步 8000 次模拟（深）']);
    fadeIn(g, (tk - .2 * d) / .5, () => txt(g, '蓝方：第 3 层连到顶面，只差两格', x, R.y + 430, C.b, fnt(700, 27))); fadeIn(g, (tk - .42 * d) / .5, () => txt(g, '橙方：在正下方垫一子', x, R.y + 490, C.o, fnt(700, 27))); fadeIn(g, (tk - .6 * d) / .5, () => txt(g, '然后在中间几层一块一块地铺', x, R.y + 550, C.o, fnt(700, 27)));
  } else { const k = 42 + Math.round(12 * CL((tk - .02 * d) / (.16 * d))), fin = k >= 54 && tk > .22 * d; let o = { labels: true }; if (fin) { const b = LM.B[54], fl = lmFlood(b, v => v !== 2), mem = new Set(); const nf = Math.round(fl.q.length * CL((tk - .24 * d) / (.2 * d))), sub = fl.q.slice(0, nf); sub.forEach(c => NB6[c].forEach(n => { if (b[n] === 2) mem.add(n); })); o = { labels: true, flood: new Set(sub), mem, last: -1 }; }
    lmPly(g, cx, cy, 84, yaw, 'B', k, o); lmSide(g, x, R.y + 60, 'B', k, ['程序强度：每步 8000 次模拟（深）']);
    fadeIn(g, (tk - .26 * d) / .5, () => txt(g, '浅蓝：从底面出发能到的格子', x, R.y + 430, C.b, fnt(700, 27))); fadeIn(g, (tk - .4 * d) / .5, () => txt(g, '亮橙：挡住它们的那张膜', x, R.y + 490, C.o, fnt(700, 27)));
    fadeIn(g, (tk - .5 * d) / .5, () => { rr(g, x, R.y + 540, 560, 120, 16, 'rgba(255,178,92,.1)', C.o, 2.5); txt(g, '第 54 手：膜合拢', x + 280, R.y + 578, C.fg, fnt(800, 30), 'center'); txt(g, '膜方获胜', x + 280, R.y + 628, C.o, fnt(800, 30), 'center'); });
    fadeIn(g, (tk - .76 * d) / .5, () => txt(g, '这张膜有没有洞？屏幕上很难看清', x, R.y + 720, C.gold, fnt(700, 27))); } };

AN.res = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, x = R.x + 60, w = 1000;
  if (st.k === 0) { panel(g, x, R.y + 40, w, 420, '有没有技巧：每步多想四倍的一方赢了多少局'); txt(g, '5×5×5，线 1 子对膜 2 子，每组 30 局（虚线 = 一半）', x + 24, R.y + 126, C.fg3, fnt(500, 21));
    wbar(g, x + 24, R.y + 220, w - 48, '执线（8000 对 2000）', 29, 30, (tk - .35 * d) / .8, C.b); wbar(g, x + 24, R.y + 330, w - 48, '执膜（8000 对 2000）', 30, 30, (tk - .55 * d) / .8, C.o);
    card(g, x + w + 50, R.y + 40, 560, 200, '有技巧', ['多想的一方几乎全胜', '执哪一方都一样'], C.g, SS((tk - .72 * d) / .6), false, 26); card(g, x + w + 50, R.y + 262, 560, 198, '没有和棋', ['规则决定了必有一方达成目标'], C.g, SS((tk - .84 * d) / .6), false, 26);
  } else if (st.k === 1) { panel(g, x, R.y + 40, w, 600, '公不公平：双方一样强时，线方赢了多少局'); txt(g, '线 1 子对膜 2 子，每组 30 局。从上到下，程序越来越强', x + 24, R.y + 126, C.fg3, fnt(500, 21));
    [['每步 500 次模拟', 30, .22], ['每步 2000 次', 22, .42], ['每步 8000 次', 2, .52], ['每步 32000 次', 0, .62]].forEach(([l, n, at], i) => wbar(g, x + 24, R.y + 220 + i * 100, w - 48, l, n, 30, (tk - at * d) / .8, C.b));
    card(g, x + w + 50, R.y + 40, 560, 250, '程序越强，膜方越占优', ['弱的程序不会织膜', '强的程序才会'], C.gold, SS((tk - .8 * d) / .6), false, 26); card(g, x + w + 50, R.y + 314, 560, 200, '对照', ['线 1 子对膜 1 子：', '线方 30 局赢 29 局'], C.fg3, SS((tk - .3 * d) / .6), false, 24);
  } else { panel(g, x, R.y + 40, w, 600, '让线方开局先白摆几个子（线方胜局 / 30）');
    [['先摆 3 子 · 8000 次', 15, .12, ''], ['先摆 3 子 · 32000 次', 0, .3, ''], ['先摆 4 子 · 8000 次', 23, .4, ''], ['先摆 4 子 · 32000 次', 15, .4, '重测一次是 19/30']].forEach(([l, n, at, note], i) => wbar(g, x + 24, R.y + 160 + i * 110, w - 48, l, n, 30, (tk - at * d) / .8, C.b, note));
    card(g, x + w + 50, R.y + 40, 560, 230, '公平点随水平移动', ['中等强度：3 子正好一半', '最强一档：要 4 子'], C.gold, SS((tk - .5 * d) / .6), false, 26); card(g, x + w + 50, R.y + 294, 560, 346, '切蛋糕规则（还没测）', ['一方决定线方先摆几子', '另一方选执线还是执膜', '定得不公平，吃亏的是自己'], C.p, SS((tk - .72 * d) / .6), false, 26); } };

function ringItems(g, P, f, col, n = 40, lw = 9) { const it = []; for (let i = 0; i < n; i++) { const a = P(f(i / n * 2 * Math.PI)), b = P(f((i + 1) / n * 2 * Math.PI)); it.push({ d: (a[2] + b[2]) / 2, fn: () => line(g, [a, b], col, lw) }); } return it; }
AN.other = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, yaw = YAW(t), w = 400, y = R.y + 30;
  const cs = [['立体亚马逊', ['沿 26 个方向走直线', '再射出一个障碍', '无路可走者负'], '不要求围死，受三维影响小', C.b], ['两气围棋', ['三维格点上的围棋', '少于 2 口气就提掉'], '对付“气太多”', C.g], ['套环棋', ['用线段围成闭合的环', '去套住对方的环'], '只有三维才有，把握最小', C.p], ['双曲围棋步行版', ['规则不变', '人站到棋盘里去下'], '只改观察，不改规则', C.o]];
  const at = st.k === 0 ? [.04, .62, 9, 9] : [-1, -1, .02, .62];
  cs.forEach(([h, ls, note, col], i) => { const a = SS((tk - at[i] * d) / .6); if (a <= 0) return; g.save(); g.globalAlpha = a * (st.k === 1 && i < 2 ? .45 : 1); const x = R.x + 24 + i * (w + 24); panel(g, x, y, w, 680, null, col); txt(g, h, x + w / 2, y + 46, col, fnt(800, 32), 'center'); const cx = x + w / 2, cy = y + 240;
    if (i === 0) { const P = mkP(cx, cy, 44, yaw), ex = [], dirs = [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1, 1, 0], [1, 0, 1], [0, 1, 1], [1, 1, 1], [1, -1, 0], [1, 0, -1], [0, 1, -1], [1, -1, 1], [1, 1, -1], [-1, 1, 1]]; dirs.forEach(v => [1, -1].forEach(sg => { const a2 = P([0, 0, 0]), b2 = P(v.map(q => q * sg * 2)); ex.push({ d: (a2[2] + b2[2]) / 2, fn: () => line(g, [a2, b2], 'rgba(92,180,255,.5)', 2.5) }); })); latDraw(g, P, 5, [[0, 0, 0, 1, .42], [2, 2, 0, 'r', .3], [-1, 0, 2, 'r', .3], [0, -2, -2, 'r', .3]], { grid: false, extra: ex }); boxFrame(g, P, 2.5); }
    if (i === 1) { const P = mkP(cx, cy, 62, yaw); latDraw(g, P, 3, [[0, 0, 0, 'w', .38], [0, 0, 1, 'w', .38], [1, 0, 0, 'k', .38], [-1, 0, 0, 'k', .38], [0, 1, 0, 'k', .38], [0, 0, -1, 'k', .38], [1, 0, 1, 'k', .38], [-1, 0, 1, 'k', .38], [0, 1, 1, 'k', .38], [0, -1, 0, 'r', .2], [0, -1, 1, 'g', .2]]); }
    if (i === 2) { const P = mkP(cx, cy, 70, yaw, .5, 0); runItems([...ringItems(g, P, a2 => [Math.cos(a2) * 1.3 - .65, Math.sin(a2) * 1.3, 0], '#5CB4FF'), ...ringItems(g, P, a2 => [Math.cos(a2) * 1.3 + .65, 0, Math.sin(a2) * 1.3], '#FFB25C')]); }
    if (i === 3) { hypDraw(g, cx, cy, 150, 21); person(g, cx, cy, C.g, 1.3); }
    let yy = y + 470; ls.forEach(l => { txt(g, l, x + w / 2, yy, C.fg, fnt(600, 25), 'center'); yy += 42; }); rr(g, x + 20, y + 600, w - 40, 56, 12, 'rgba(255,255,255,.04)', col, 1.5); txt(g, note, x + w / 2, y + 628, C.fg2, fnt(600, 21), 'center'); g.restore(); });
  txt(g, '这四个在这一期都没有测；两气围棋此前只做过小规模模拟', R.x + R.w / 2, R.y + 760, C.fg3, fnt(600, 26), 'center'); };

AN.end = (g, t, R, st) => { const d = BTOF(st).d, tk = st.tk, yaw = YAW(t), x = R.x + 40;
  if (st.k === 0) { card(g, x, R.y + 40, 800, 250, 'VR 能做的', ['让三维、曲面、超大的棋盘', '第一次被人看懂'], C.g, SS((tk - .04 * d) / .6), false, 28); card(g, x, R.y + 320, 800, 250, 'VR 做不到的', ['修好这些棋盘上规则本身的毛病', '那要靠改规则'], C.bad, SS((tk - .34 * d) / .6), false, 28);
    fadeIn(g, (tk - .6 * d) / .6, () => { lmPly(g, R.x + 1270, R.y + 310, 56, yaw, 'B', 54, { last: -1 }); txt(g, '线与膜：把线的对手从线换成面', R.x + 1270, R.y + 620, C.gold, fnt(800, 30), 'center'); txt(g, '三维里的连接游戏就重新成立了', R.x + 1270, R.y + 668, C.gold, fnt(800, 30), 'center'); });
  } else { card(g, x, R.y + 40, 800, 420, '证据有限', ['每组只测了 30 局，主要是 5×5×5 一种棋盘', '对手是不带任何知识的搜索程序', '它也许不擅长织膜，也许正相反', '没有人真正下过'], C.r, SS((tk - .03 * d) / .6), false, 27);
    card(g, x + 840, R.y + 40, 800, 420, '没有在 VR 里看过', ['“走进去就看得清”本身是推断', '另外四个想法都没有测', '公平的设置还没有找到'], C.gold, SS((tk - .5 * d) / .6), false, 27);
    fadeIn(g, (tk - .84 * d) / .6, () => { rr(g, x, R.y + 510, R.w - 80, 130, 16, 'rgba(255,210,122,.07)', C.gold, 2); txt(g, '测试程序和数据见简介', R.x + R.w / 2, R.y + 575, C.fg, fnt(700, 34), 'center'); }); } };
