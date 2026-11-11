// 第四集画面（非地图）
Object.assign(AN, {
  photo: (g, t, R, st) => {
    const k1 = st.k >= 1;
    hdr(g, R, k1 ? '1905：爱因斯坦的奇迹年' : '光电效应与光量子', k1 ? '伯尔尼专利局 · 26 岁' : 'E = hν · 能量只取决于频率');
    if (k1) { const L = [['3 月', '光量子与光电效应', C.gold], ['5 月', '布朗运动：原子存在的可检验预言', C.g], ['6 月', '狭义相对论：光速不变，运动的钟变慢', C.b], ['9 月', 'E = mc²：质量与能量等价', C.r]];
      L.forEach(([m, s, c], i) => al(g, pop(st.tk, .3 + i * .9, .5), () => { const y = R.y + 190 + i * 130; txt(g, m, R.x + 60, y + 44, C.fg3, fnt(800, 32, 'mono')); rr(g, R.x + 200, y, 1200, 92, 14, 'rgba(14,20,36,.92)', c, 2); txt(g, s, R.x + 230, y + 46, C.fg, fnt(700, 32)); }));
      txt(g, '（月份为投稿时间）', R.x + 200, R.y + 740, C.fg3, fnt(500, 22)); return; }
    const mx = R.x + 80, my = R.y + 600; rr(g, mx, my, 900, 60, 6, '#8a94a6'); txt(g, '金属', mx + 20, my + 100, C.fg3, fnt(600, 24));
    [[C.r, '红光（频率低）', 0], [C.p, '紫光（频率高）', 1]].forEach(([col, nm, j]) => { const x0 = mx + 150 + j * 450; txt(g, nm, x0, R.y + 190, col, fnt(700, 26), 'center');
      for (let i = 0; i < 4; i++) { const ph = ((t * .8 + i * .25 + j * .1) % 1); const x = x0 - 120 + ph * 120 + i * 20, y = R.y + 230 + ph * 360; g.save(); g.strokeStyle = col; g.lineWidth = 3; g.beginPath(); for (let q = 0; q < 30; q++) { const s = q / 30; g.lineTo(x - 60 * (1 - s) + 3 * Math.sin(q * (j ? 1.6 : .8)), y - 90 * (1 - s)); } g.stroke(); g.restore();
        if (j && ph > .95) {} }
      if (j) for (let i = 0; i < 4; i++) { const ph = ((t * .8 + i * .25 + .4) % 1); dot(g, x0 + 40 + ph * 140, my - 10 - ph * 260, 8, C.b); } else txt(g, '再亮也打不出电子', x0, my - 60, C.fg3, fnt(600, 22), 'center'); });
    notes(g, R.x + 1060, R.y + 230, [['电子的能量只和频率有关', 1.5, C.fg], ['和光的强弱无关', 2.5], ['光由一份份能量子组成：E = hν', 3.8, C.gold], ['后来叫“光子”', 5, C.fg2]], t);
  },
  spacetime: (g, t, R, st) => {
    hdr(g, R, '广义相对论：弯曲的时空', '1915 年 11 月 · 柏林');
    const P = sheet(g, R, [{ x: 0, z: 0, m: SS(t / 2) * 1.6, w: 120 }], { cy: R.y + 430, W: 1100, D: 700, cx: R.x + 620 });
    const [sx, sy] = P(0, 0); ball(g, sx, sy - 30, 46, C.gold, '#fff');
    const a = t * .9, rx = 280; const [px, py] = P(rx * Math.cos(a), rx * Math.sin(a)); ball(g, px, py - 14, 16, C.b);
    notes(g, R.x + 1280, R.y + 230, [['物质告诉时空怎样弯曲', 1.5, C.gold], ['时空告诉物质怎样运动', 2.8, C.b], ['预言：水星近日点进动', 4.2, C.fg2, 26], ['预言：星光经过太阳会偏折', 5.2, C.fg2, 26]], t);
  },
  rutherford: (g, t, R, st) => {
    hdr(g, R, st.k === 0 ? 'α 粒子散射' : '原子有核模型', st.k === 0 ? '盖革、马斯登 1909 · 曼彻斯特' : '卢瑟福 1911');
    const fx = R.x + 620; for (let i = 0; i < 7; i++) for (let j = 0; j < 9; j++) { const x = fx + i * 18, y = R.y + 200 + j * 70; dot(g, x, y, 4, C.gold); }
    rr(g, fx - 10, R.y + 160, 130, 640, 6, 'rgba(255,210,122,.07)', C.gold + '55', 1); txt(g, '金箔（示意）', fx + 60, R.y + 820, C.gold, fnt(600, 22), 'center');
    for (let i = 0; i < 16; i++) { const y0 = R.y + 200 + (i * 37) % 560, ph = ((t * .5 + HSH(i, 1)) % 1); const back = i === 5 || i === 11, defl = i === 2 ? -.4 : i === 8 ? .35 : 0;
      let x = R.x + 100 + ph * 1100, y = y0; if (back && x > fx + 20) { x = fx + 20 - (x - fx - 20); y = y0 + (x - fx) * .3; } else if (defl && x > fx + 50) { y = y0 + (x - fx - 50) * defl; }
      dot(g, x, y, 7, back ? C.r : C.b); }
    if (st.k === 0) notes(g, R.x + 1280, R.y + 230, [['绝大多数直接穿过', 1, C.b], ['少数大角度偏转', 2, C.fg], ['极少数被弹回！', 3, C.r]], t);
    else { const cx = R.x + 1460, cy = R.y + 480; dot(g, cx, cy, 10, C.r); txt(g, '核', cx, cy + 32, C.r, fnt(700, 22), 'center'); for (let i = 0; i < 3; i++) { g.save(); g.strokeStyle = C.fg3; g.setLineDash([4, 6]); g.beginPath(); g.ellipse(cx, cy, 160, 60, i * Math.PI / 3, 0, TAU); g.stroke(); g.restore(); const a = st.tk * 2 + i * 2; dot(g, cx + 160 * Math.cos(a) * Math.cos(i * Math.PI / 3) - 60 * Math.sin(a) * Math.sin(i * Math.PI / 3), cy + 160 * Math.cos(a) * Math.sin(i * Math.PI / 3) + 60 * Math.sin(a) * Math.cos(i * Math.PI / 3), 7, C.b); }
      al(g, pop(st.tk, 1, .6), () => wrapTxt(g, '“就像用炮弹打一张纸，炮弹却被弹了回来”', R.x + 1250, R.y + 680, 560, 40, C.gold, fnt(700, 28))); }
  },
  bohr: (g, t, R, st) => {
    hdr(g, R, '玻尔的原子模型', '1913 · 哥本哈根');
    const cx = R.x + 460, cy = R.y + 470, rs = [70, 160, 260, 360]; dot(g, cx, cy, 20, C.r); glow(g, cx, cy, 50, 'rgba(255,122,147,.5)');
    rs.forEach((r, i) => { g.save(); g.strokeStyle = C.line2; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke(); g.restore(); txt(g, `n=${i + 1}`, cx + r + 8, cy - 8, C.fg3, fnt(600, 20)); });
    const cyc = 4, ph = (t % cyc) / cyc, jump = ph > .55 && ph < .62; const r = ph < .58 ? rs[2] : rs[1]; const a = t * 2.2; const ex = cx + r * Math.cos(a), ey = cy + r * Math.sin(a); dot(g, ex, ey, 11, C.b);
    if (ph > .58 && ph < .9) { const s = (ph - .58) / .32; g.save(); g.strokeStyle = C.r; g.lineWidth = 3; g.beginPath(); for (let q = 0; q <= 40; q++) { const u = q / 40; g.lineTo(ex + u * 500 * s, ey + 18 * Math.sin(u * 30)); } g.stroke(); g.restore(); txt(g, '放出光子', ex + 120, ey - 40, C.r, fnt(700, 24)); }
    const sx = R.x + 980, sy = R.y + 640; txt(g, '氢原子可见光谱线', sx, sy - 60, C.fg2, fnt(600, 26)); g.fillStyle = '#05070c'; g.fillRect(sx, sy - 30, 760, 70); [[410, C.p], [434, '#8a7dff'], [486, '#4fb6ff'], [656, C.r]].forEach(([l, c]) => { g.fillStyle = c; g.fillRect(sx + (l - 400) / 300 * 760 - 3, sy - 30, 6, 70); });
    notes(g, R.x + 980, R.y + 230, [['电子只能在特定轨道上', 1], ['跳轨时吸收或放出光子', 2.3, C.gold], ['解释了氢原子的谱线', 3.6]], t);
  },
  wavefn: (g, t, R, st) => {
    const k1 = st.bi >= 3;
    hdr(g, R, k1 ? '概率诠释与不确定性原理' : '薛定谔方程：电子是一种波', k1 ? '玻恩 1926 · 哥廷根；海森堡 1927 · 哥本哈根' : '薛定谔 1926 · 苏黎世；狄拉克 1928 · 剑桥');
    const ox = R.x + 80, oy = R.y + 560, W = 1000; line(g, [[ox, oy], [ox + W, oy]], C.fg3, 2); const tt = st.k === 0 ? t : st.tk;
    const wid = k1 ? 80 + 60 * Math.sin(tt * .8) : 120, c0 = ox + W / 2; const pts = [], pp = [];
    for (let i = 0; i <= 300; i++) { const x = ox + i / 300 * W, e = Math.exp(-(((x - c0) / wid) ** 2)); pts.push([x, oy - 220 * e * Math.cos((x - c0) / 14 - tt * 4)]); pp.push([x, oy - 260 * e * e]); }
    if (!k1) { line(g, pts, C.b, 3); eq(g, 'iħ ∂ψ/∂t = Ĥψ', R.x + 1400, R.y + 280, C.gold, 52); notes(g, R.x + 1180, R.y + 400, [['波动力学（薛定谔）', 1], ['矩阵力学（海森堡）', 2], ['狄拉克：两者等价', 3, C.gold], ['1928：相对论性方程，预言反粒子', 4.2, C.fg2, 26]], tt); return; }
    g.save(); g.fillStyle = 'rgba(255,210,122,.3)'; g.beginPath(); g.moveTo(ox, oy); pp.forEach(p => g.lineTo(...p)); g.lineTo(ox + W, oy); g.fill(); g.restore(); line(g, pp, C.gold, 3);
    txt(g, '|ψ|² = 在某处找到粒子的概率', ox, R.y + 180, C.gold, fnt(800, 32));
    const kw = 40000 / wid; txt(g, `位置分布宽 ${wid.toFixed(0)}`, ox, oy + 50, C.fg2, fnt(600, 24)); rr(g, R.x + 1200, R.y + 300, 40, 300, 6, null, C.line2, 2); rr(g, R.x + 1200, R.y + 600 - 300 * Math.min(1, kw / 600), 40, 300 * Math.min(1, kw / 600), 6, C.r); txt(g, '动量的不确定', R.x + 1260, R.y + 460, C.r, fnt(700, 26));
    eq(g, 'Δx · Δp ≥ ħ/2', R.x + 1460, R.y + 700, C.fg, 44);
  },
  hubble: (g, t, R, st) => {
    hdr(g, R, '哈勃定律：宇宙在膨胀', '1929 · 威尔逊山天文台（帕萨迪纳）');
    const ox = R.x + 120, oy = R.y + 720, W = 900, H = 520; arrow(g, ox, oy, ox + W + 40, oy, C.fg3, 2); arrow(g, ox, oy, ox, oy - H - 40, C.fg3, 2); txt(g, '距离', ox + W, oy + 34, C.fg3, fnt(600, 22)); txt(g, '退行速度', ox - 10, oy - H - 60, C.fg3, fnt(600, 22));
    for (let i = 0; i < 24; i++) { const d = HSH(i, 1), v = d + (HSH(i, 2) - .5) * .22; al(g, pop(t, .4 + i * .08, .3), () => dot(g, ox + d * W, oy - CL(v) * H, 8, C.b)); }
    al(g, pop(t, 3, .8), () => line(g, [[ox, oy], [ox + W, oy - H]], C.gold, 3));
    const cx = R.x + 1400, cy = R.y + 450, s = 1 + .35 * ((t * .25) % 1); for (let i = 0; i < 18; i++) { const a = HSH(i, 3) * TAU, r = 40 + HSH(i, 4) * 220; dot(g, cx + r * s * Math.cos(a), cy + r * s * Math.sin(a), 6, C.fg2); }
    txt(g, '像烤面包里的葡萄干：彼此都在远离', cx, cy + 320, C.fg2, fnt(600, 24), 'center');
  },
});
Object.assign(AN, {
  feynman: (g, t, R, st) => {
    const k1 = st.k >= 1;
    hdr(g, R, k1 ? '费曼图' : '重整化：三个人，三座城市', k1 ? '直线 = 电子 · 波浪线 = 光子' : '施温格（哈佛）· 费曼（康奈尔）· 朝永振一郎（东京）');
    if (!k1) { [['施温格', '哈佛', C.b], ['费曼', '康奈尔', C.g], ['朝永振一郎', '东京', C.o]].forEach(([n, p, c], i) => al(g, pop(t, .5 + i * 1.2, .5), () => medal(g, R.x + 260 + i * 420, R.y + 380, 120, n[0], n, p, c)));
      al(g, pop(t, 5, .6), () => txt(g, '把无穷大吸收进可测的质量和电荷 —— 1965 年三人共获诺贝尔奖', R.x + 60, R.y + 720, C.gold, fnt(700, 30))); return; }
    const cx = R.x + 600, cy = R.y + 460; const A = [cx - 300, cy + 220], B = [cx - 300, cy - 220], V1 = [cx - 100, cy + 80], V2 = [cx - 100, cy - 80], C2 = [cx + 100, cy + 220], D2 = [cx + 100, cy - 220];
    const u = CL(st.tk / 2); line(g, [A, V1, C2], C.b, 5); line(g, [B, V2, D2], C.b, 5);
    g.save(); g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); for (let i = 0; i <= 60 * u; i++) { const s = i / 60; g.lineTo(V1[0] + 18 * Math.sin(s * 30), LERP(V1[1], V2[1], s)); } g.stroke(); g.restore();
    dot(g, ...V1, 8, '#fff'); dot(g, ...V2, 8, '#fff'); txt(g, 'e⁻', A[0] - 20, A[1], C.b, fnt(800, 30), 'right'); txt(g, 'e⁻', B[0] - 20, B[1], C.b, fnt(800, 30), 'right'); txt(g, 'γ', V1[0] + 40, cy, C.gold, fnt(800, 34));
    arrow(g, R.x + 80, cy + 300, R.x + 80, cy - 300, C.fg3, 2); txt(g, '时间', R.x + 50, cy - 330, C.fg3, fnt(600, 22));
    notes(g, R.x + 1060, R.y + 260, [['两个电子交换一个光子 → 互相排斥', 1.5], ['每张图 = 一项计算', 2.8, C.gold], ['今天的物理学家仍天天在画', 4, C.fg2]], st.tk);
  },
  mirror: (g, t, R, st) => {
    hdr(g, R, '吴健雄的钴-60 实验', '1956 年底 – 1957 年初 · 华盛顿美国国家标准局');
    const mx = R.x + 860; line(g, [[mx, R.y + 150], [mx, R.y + 780]], C.fg2, 4, [10, 8]); txt(g, '镜子', mx, R.y + 130, C.fg2, fnt(700, 24), 'center');
    const side = (cx, flip, real) => { const cy = R.y + 430; ball(g, cx, cy, 50, C.p); const sp = flip ? -1 : 1; g.save(); g.strokeStyle = C.gold; g.lineWidth = 4; g.beginPath(); g.ellipse(cx, cy, 80, 26, 0, 0, TAU); g.stroke(); g.restore(); arrow(g, cx + 80 * sp, cy - 10, cx + 60 * sp, cy - 24, C.gold, 3, 12);
      arrow(g, cx, cy, cx, cy - 170 * (flip ? -1 : 1), C.g, 5, 16); txt(g, '自旋', cx + 30, cy - 170 * (flip ? -1 : 1), C.g, fnt(700, 22));
      const n = real ? [10, 3] : [3, 10]; for (let i = 0; i < n[0]; i++) { const a = -Math.PI / 2 + (HSH(i, 1) - .5) * 1.4, r = 90 + ((t * 120 + i * 40) % 220); dot(g, cx + r * Math.cos(a), cy + r * Math.sin(a), 6, C.b); }
      for (let i = 0; i < n[1]; i++) { const a = Math.PI / 2 + (HSH(i, 2) - .5) * 1.4, r = 90 + ((t * 120 + i * 40) % 220); dot(g, cx + r * Math.cos(a), cy + r * Math.sin(a), 6, C.b); } };
    side(R.x + 420, false, false); txt(g, '实验：电子更多逆着自旋方向飞出', R.x + 420, R.y + 740, C.fg, fnt(700, 26), 'center');
    al(g, pop(t, 2.5, .6), () => { side(R.x + 1300, true, false); txt(g, '镜像：电子顺着自旋方向飞出', R.x + 1300, R.y + 740, C.fg, fnt(700, 26), 'center'); });
    al(g, pop(t, 5, .6), () => txt(g, '镜像世界和真实世界不一样 → 宇称不守恒', R.x + 860, R.y + 810, C.gold, fnt(800, 32), 'center'));
  },
  smtable: (g, t, R, st) => {
    hdr(g, R, '标准模型', st.k === 0 ? '希格斯机制 1964 · 电弱统一 1967 · 渐近自由 1973' : '第三代夸克 1973 · 中性流 1973 · J/ψ 1974 · W/Z 1983 · 顶夸克 1995');
    const cells = [['u', '上', 'q', 1], ['c', '粲', 'q', 2], ['t', '顶', 'q', 3], ['g', '胶子', 'b', 0], ['d', '下', 'q', 1], ['s', '奇', 'q', 2], ['b', '底', 'q', 3], ['γ', '光子', 'b', 0], ['e', '电子', 'l', 1], ['μ', 'μ子', 'l', 2], ['τ', 'τ子', 'l', 3], ['Z', 'Z', 'b', 0], ['νe', '中微子', 'l', 1], ['νμ', '中微子', 'l', 2], ['ντ', '中微子', 'l', 3], ['W', 'W', 'b', 0]];
    const X0 = R.x + 120, Y0 = R.y + 170, S = 150; const hot = st.k >= 1 ? ['c', 't', 'b', 'Z', 'W'] : [];
    cells.forEach(([s, n, ty, gen], i) => { const c = i % 4, r = Math.floor(i / 4), x = X0 + c * S, y = Y0 + r * S, col = ty === 'q' ? C.g : ty === 'l' ? C.b : C.r, a = pop(t, .3 + i * .12, .4), h = hot.includes(s);
      al(g, a, () => { rr(g, x, y, S - 16, S - 16, 14, h ? col + '33' : 'rgba(14,20,36,.92)', col, h ? 4 : 2); txt(g, s, x + (S - 16) / 2, y + 56, '#fff', fnt(800, 44, 'serif'), 'center'); txt(g, n, x + (S - 16) / 2, y + 104, C.fg2, fnt(600, 20), 'center'); }); });
    al(g, pop(t, 2.5, .5), () => { const x = X0 + 4 * S + 10, y = Y0 + 1.5 * S; rr(g, x, y, S - 16, S - 16, 70, 'rgba(255,210,122,.15)', C.gold, 3); txt(g, 'H', x + 67, y + 56, '#fff', fnt(800, 44, 'serif'), 'center'); txt(g, '希格斯', x + 67, y + 104, C.gold, fnt(600, 20), 'center'); });
    const lx = R.x + 1000; [['夸克', C.g], ['轻子', C.b], ['传递力的玻色子', C.r]].forEach(([n, c], i) => { dot(g, lx, R.y + 230 + i * 50, 10, c); txt(g, n, lx + 22, R.y + 230 + i * 50, C.fg2, fnt(600, 26)); });
    if (st.k >= 1) notes(g, lx, R.y + 420, [['小林、益川：预言第三代（京都）', .5, C.fg, 26], ['丁肇中、里克特：粲夸克（1974）', 1.6, C.fg, 26], ['CERN：中性流、W 与 Z', 2.7, C.fg, 26], ['费米实验室：顶夸克（1995）', 3.8, C.fg, 26]], st.tk, 64);
  },
  cmb: (g, t, R, st) => {
    hdr(g, R, '宇宙微波背景辐射', '彭齐亚斯、威尔逊 · 1965 · 霍姆德尔贝尔实验室');
    const hx = R.x + 340, hy = R.y + 500; g.save(); g.fillStyle = '#9aa5b8'; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx + 260, hy - 160); g.lineTo(hx + 260, hy + 60); g.closePath(); g.fill(); g.restore(); rr(g, hx - 20, hy, 60, 200, 6, '#6b7486'); txt(g, '号角天线（示意）', hx + 60, hy + 240, C.fg3, fnt(600, 22));
    for (let i = 0; i < 20; i++) { const a = HSH(i, 1) * TAU, r = 380 - ((t * 140 + i * 50) % 380); dot(g, hx + 200 + r * Math.cos(a) * 1.3, hy - 40 + r * Math.sin(a), 4, C.r); }
    const ox = R.x + 1000, oy = R.y + 640, W = 680, H = 360; arrow(g, ox, oy, ox + W, oy, C.fg3, 2); arrow(g, ox, oy, ox, oy - H, C.fg3, 2); txt(g, '波长', ox + W - 40, oy + 34, C.fg3, fnt(600, 22));
    const Is = []; for (let i = 1; i <= 100; i++) { const l = i / 100 * 3, I = 1 / l ** 5 / (Math.exp(1 / l) - 1); Is.push(I); } const mI = Math.max(...Is); const pts = Is.map((I, i) => [ox + (i + 1) / 100 * W, oy - I / mI * (H - 40)]); al(g, pop(t, 1.5, .8), () => line(g, pts, C.gold, 4));
    al(g, pop(t, 3, .6), () => txt(g, '2.7 K 的黑体谱：大爆炸的余晖', ox, oy + 80, C.gold, fnt(800, 30)));
    notes(g, R.x + 1000, R.y + 200, [['来自四面八方、去不掉的噪声', .8]], t);
  },
  qhall: (g, t, R, st) => {
    hdr(g, R, '量子霍尔效应', '克利青 1980 · 格勒诺布尔；崔琦、施特默 1982 · 贝尔实验室');
    const ox = R.x + 120, oy = R.y + 720, W = 1000, H = 520; arrow(g, ox, oy, ox + W + 30, oy, C.fg3, 2); arrow(g, ox, oy, ox, oy - H - 30, C.fg3, 2); txt(g, '磁场', ox + W, oy + 34, C.fg3, fnt(600, 22)); txt(g, '霍尔电阻', ox - 10, oy - H - 50, C.fg3, fnt(600, 22));
    const u = CL(t / 4), pts = []; for (let i = 0; i <= 400 * u; i++) { const b = i / 400 * 6, nu = 6 / (b + .4), n = Math.max(1, Math.round(nu)), f = nu - Math.floor(nu), step = 1 / (Math.floor(nu) + 1 / (1 + Math.exp(-(f - .5) * 30))); pts.push([ox + i / 400 * W, oy - step * H * .95]); }
    line(g, [[ox, oy], [ox + W, oy - H * .48]], C.fg3 + '88', 2, [6, 6]); line(g, pts, C.gold, 4);
    [1, 2, 3, 4].forEach(n => al(g, pop(t, 4, .5), () => txt(g, `h/${n}e²`, ox + W + 40, oy - H * .95 / n, C.gold, fnt(700, 22, 'mono'))));
    notes(g, R.x + 1260, R.y + 260, [['不是连续变化，而是一级级平台', 1.5], ['平台精确到十亿分之一', 3, C.gold], ['只由基本常数决定', 4.2, C.fg2]], t);
  },
  chirp: (g, t, R, st) => {
    hdr(g, R, 'GW150914：第一次直接探测到引力波', '2015 年 9 月 14 日 · 利文斯顿与汉福德（2016 年 2 月公布）');
    const cx = R.x + 340, cy = R.y + 400, T = 6, tt = st.k === 0 ? Math.min(t, T) : T, p = tt / T, r = 150 * (1 - p) ** .35 + 10, w = 1 / Math.max(.05, (1 - p)) ** .6;
    if (p < .99) { const a = t * 3 * w; dot(g, cx + r * Math.cos(a), cy + r * Math.sin(a), 22, '#111'); g.strokeStyle = C.p; g.lineWidth = 3; g.beginPath(); g.arc(cx + r * Math.cos(a), cy + r * Math.sin(a), 24, 0, TAU); g.stroke(); dot(g, cx - r * Math.cos(a), cy - r * Math.sin(a), 20, '#111'); g.beginPath(); g.arc(cx - r * Math.cos(a), cy - r * Math.sin(a), 22, 0, TAU); g.stroke(); }
    else { dot(g, cx, cy, 34, '#111'); g.strokeStyle = C.p; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, 36, 0, TAU); g.stroke(); }
    for (let i = 0; i < 5; i++) { const rr_ = ((t * 80 + i * 70) % 350) + 40; g.save(); g.strokeStyle = `rgba(199,155,255,${(.5 - rr_ / 800).toFixed(2)})`; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, rr_, 0, TAU); g.stroke(); g.restore(); }
    const ox = R.x + 760, oy = R.y + 400, W = 900; line(g, [[ox, oy], [ox + W, oy]], C.fg3, 1); const pts = []; let ph = 0; for (let i = 0; i <= 600 * p; i++) { const q = i / 600, f = 1 / Math.max(.03, 1 - q) ** .75; ph += f * .09; const a = q < .98 ? 30 + 140 * q ** 3 : 170 * Math.exp(-(q - .98) * 120); pts.push([ox + q * W, oy - a * Math.sin(ph)]); } line(g, pts, C.gold, 3);
    txt(g, '应变信号（示意）', ox, oy - 220, C.fg3, fnt(600, 22));
    if (st.k >= 1) notes(g, ox, R.y + 620, [['13 亿光年外，两个约 30 倍太阳质量的黑洞并合', .3, C.fg, 28], ['4 公里臂长的变化 < 质子直径的千分之一', 1.6, C.gold, 28], ['2017：双中子星并合，光与引力波同时被看到', 3, C.fg2, 26]], st.tk, 60);
  },
});
