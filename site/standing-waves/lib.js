// 驻波专题：通用场景。每个 beat 的画面列表（图片 / 动画）均分 beat 时长，交叉淡入淡出。
window.SCENES = {};
const DET = {
  a_quant_0: ['两端固定的弦', 'L = n · λ/2', 'fₙ = n · f₁ （n = 1, 2, 3 …）'],
  a_quant_2: ['弦的频率', 'f₁, 2f₁, 3f₁, 4f₁ …', '只能取基频的整数倍'],
  a_fourier_3: ['@img:web_23', '石英晶振', '32 768 Hz = 2¹⁵ Hz', '分频 15 次，正好每秒一跳'],
  a_pipe_1: ['管的频率（v 为声速）', '两端开口：fₙ = n · v / 2L', '一端封闭：fₙ = (2k−1) · v / 4L', '长 0.6 m 的开管：f₁ ≈ 286 Hz'],
  a_pipe_3: ['历史', '昆特管：1866 年', '鲁本斯管：1905 年'],
  a_2d_3: ['圆形鼓膜的泛音（相对基频）', '1 : 1.59 : 2.14 : 2.30 : 2.65 : 2.92', '不是整数比'],
  a_3d_0: ['房间驻波（声速 343 m/s）', '5 m 方向：f₁ = 343 / (2×5) ≈ 34 Hz', '4 m 方向：f₁ ≈ 43 Hz'],
  a_3d_1: ['家用微波炉', 'f = 2.45 GHz', 'λ = c / f ≈ 12.2 cm', '热点间距 λ/2 ≈ 6.1 cm'],
  a_3d_2: ['巧克力测光速', 'c = 2 × d × f', '= 2 × 6.1 cm × 2.45 GHz', '≈ 3.0 × 10⁸ m/s'],
  a_3d_4: ['@img:web_36', '圣保罗大教堂回音廊', '直径约 34 m', '声音贴着圆形墙壁传播'],
  b_lake_1: ['假潮周期（梅里安公式）', 'T = 2L / √(g h)', 'L：湖长  h：平均水深', '日内瓦湖实测约 73 分钟'],
  b_lake_3: ['芬迪湾', '海湾固有周期 ≈ 13 小时', '月球潮汐（M₂）12.42 小时', '最大潮差约 16 m'],
  b_earth_1: ['地球自由振荡', '最慢的球型模式 ₀S₂：约 54 分钟', '1960 年智利 9.5 级地震后首次清楚测到'],
  b_earth_2: ['舒曼共振', '7.8 Hz · 14.3 Hz · 20.8 Hz …', '腔体：地面到电离层（约 60–90 km）'],
  b_sun_0: ['太阳 5 分钟振荡', '频率约 3 mHz', '表面起伏速度约每秒几百米'],
  b_bridge_1: ['伦敦千禧桥', '2000 年 6 月 10 日开放', '两天后关闭，2002 年重开', '加装了 37 个阻尼器'],
  b_bridge_2: ['台北 101 阻尼球', '质量约 660 吨', '直径约 5.5 m，悬挂在 87–92 层'],
  b_atom_0: ['德布罗意（1924）', 'λ = h / p', '2πr = n · λ'],
  b_atom_1: ['盒中粒子的能级', 'Eₙ = n² · h² / (8 m L²)', '比例 1 : 4 : 9 : 16 …'],
  b_atom_4: ['量子点', '直径约 2–10 nm', '2023 年诺贝尔化学奖'],
  b_cosmos_1: ['复合时期', '宇宙年龄约 38 万年', '温度约 3000 K'],
  b_cosmos_2: ['声学峰', '第一峰：多极矩 ℓ ≈ 220', '对应天空上约 1°'],
};
const SS = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const C = { r: '#5CB4FF', l: '#FF7A93', g: '#FFD27A', n: '#5FE0A0', fg: '#E9EEF7', fg2: '#A3AEC3', fg3: '#66728C', line: '#1F2940' };

// 预载本集用到的图片
window.MAPREADY = Promise.all([...new Set(TL.scenes.flatMap(s => s.beats.flatMap(b => b.vis)).filter(v => v.startsWith('img:')).map(v => v.slice(4)))].map(k => new Promise(r => { const im = new Image(); im.onload = im.onerror = r; im.src = `i/${k}.jpg`; })));

function fitBox(w, h, bx, by, bw, bh, cap = 2.2) { const s = Math.min(bw / w, bh / h, cap); const W = w * s, H = h * s; return { x: bx + (bw - W) / 2, y: by + (bh - H) / 2, w: W, h: H }; }

function imgLayer(c, lay, key, det) {
  const m = IMG[key];
  if (key.startsWith('own')) {
    const b = det ? { x: 100, y: 150, w: 1300, h: 731 } : { x: 192, y: 112, w: 1536, h: 864 };
    const d = c.el(`<div class="ownimg" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px"><img src="i/${key}.jpg"></div>`, lay);
    return { img: d.firstChild, kb: .015 };
  }
  const R = det ? [100, 130, 1300, 740] : [160, 130, 1600, 740];
  const b = fitBox(m.w, m.h, ...R);
  const d = c.el(`<div class="ph" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px"><img src="i/${key}.jpg"></div>`, lay);
  c.el(`<div class="phcap" style="left:${R[0]}px;width:${R[2]}px;top:${b.y + b.h + 14}px"><b>${m.cap}</b><span>图：${m.cr}</span></div>`, lay);
  return { img: d.firstChild, kb: .045 };
}

// ---------------- 动画 ----------------
const AN = {};
function axisLine(g, x0, x1, y) { g.strokeStyle = C.line; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); }
function curve(g, x0, x1, f, col, lw, n = 400) { g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n, y = f(x); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
function txt(g, s, x, y, col = C.fg2, font = '600 26px "Noto Sans CJK SC",sans-serif', al = 'left') { g.fillStyle = col; g.font = font; g.textAlign = al; g.textBaseline = 'middle'; g.fillText(s, x, y); }
function dot(g, x, y, r, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
function legend(g, items, x, y) { items.forEach(([s, col], i) => { const X = x + i * 230; g.strokeStyle = col; g.lineWidth = 5; g.beginPath(); g.moveTo(X, y); g.lineTo(X + 40, y); g.stroke(); txt(g, s, X + 52, y, C.fg2, '500 24px "Noto Sans CJK SC",sans-serif'); }); }

// 行波撞墙反射 → 驻波
AN.travel = (g, t, R) => {
  const x0 = R.x + 40, x1 = R.x + R.w - 60, L = x1 - x0, lam = L / 3.5, k = 2 * Math.PI / lam, w = 2 * Math.PI / 1.4, v = w / k, A = 110, yc = R.y + R.h * .52;
  const f = x0 + v * t;
  axisLine(g, x0, x1, yc);
  g.fillStyle = '#3a4560'; g.fillRect(x1, yc - 220, 16, 440); txt(g, '墙（固定端）', x1 + 8, yc - 250, C.fg3, '500 22px "Noto Sans CJK SC",sans-serif', 'center');
  const y1 = x => (x <= f ? A * Math.sin(k * (x - x0) - w * t) * SS((f - x) / 30) : 0);
  const y2 = x => { const xm = 2 * x1 - x; return xm <= f ? -A * Math.sin(k * (xm - x0) - w * t) * SS((f - xm) / 30) : 0; };
  curve(g, x0, x1, x => yc - y1(x), C.r, 3);
  if (f > x1) curve(g, x0, x1, x => yc - y2(x), C.l, 3);
  if (f > x1) curve(g, x0, x1, x => yc - y1(x) - y2(x), C.g, 6);
  legend(g, [['向右的波', C.r], ['反射回来的波', C.l], ['两者叠加', C.g]], R.x + 40, R.y + 30);
  const arr = Math.min(f, x1 - 40); g.fillStyle = C.r; g.beginPath(); g.moveTo(arr + 30, yc - 170); g.lineTo(arr, yc - 185); g.lineTo(arr, yc - 155); g.fill(); g.fillRect(arr - 60, yc - 172, 60, 4);
  if (f > x1) { const a2 = Math.max(x0 + 40, 2 * x1 - f); g.fillStyle = C.l; g.beginPath(); g.moveTo(a2 - 30, yc + 170); g.lineTo(a2, yc + 155); g.lineTo(a2, yc + 185); g.fill(); g.fillRect(a2, yc + 168, 60, 4); }
};
// 驻波：标出波节、波腹，留下包络
AN.standing = (g, t, R) => {
  const x0 = R.x + 60, x1 = R.x + R.w - 60, L = x1 - x0, n = 4, k = n * Math.PI / L, w = 2 * Math.PI / 1.6, A = 150, yc = R.y + R.h * .5;
  axisLine(g, x0, x1, yc);
  const tr = SS((t - 1) / 2) * .45;
  if (tr > 0) for (let j = 0; j < 12; j++) curve(g, x0, x1, x => yc - A * Math.sin(k * (x - x0)) * Math.cos(j * Math.PI / 12), `rgba(255,210,122,${tr * .35})`, 2, 200);
  const fa = 1 - SS((t - 3) / 1.5) * .6;
  curve(g, x0, x1, x => yc - A / 2 * Math.sin(k * (x - x0) - w * t), `rgba(92,180,255,${fa * .7})`, 2.5);
  curve(g, x0, x1, x => yc - A / 2 * Math.sin(k * (x - x0) + w * t), `rgba(255,122,147,${fa * .7})`, 2.5);
  curve(g, x0, x1, x => yc - A * Math.sin(k * (x - x0)) * Math.cos(w * t), C.g, 6);
  for (let i = 0; i <= n; i++) { const x = x0 + i * L / n; dot(g, x, yc, 10, C.fg); txt(g, '波节', x, yc + 44, C.fg, '600 24px "Noto Sans CJK SC",sans-serif', 'center'); }
  for (let i = 0; i < n; i++) { const x = x0 + (i + .5) * L / n; g.strokeStyle = 'rgba(95,224,160,.6)'; g.setLineDash([8, 8]); g.lineWidth = 2; g.beginPath(); g.moveTo(x, yc - A - 10); g.lineTo(x, yc + A + 10); g.stroke(); g.setLineDash([]); txt(g, '波腹', x, yc - A - 34, C.n, '600 24px "Noto Sans CJK SC",sans-serif', 'center'); }
  legend(g, [['向右', C.r], ['向左', C.l], ['叠加：驻波', C.g]], R.x + 40, R.y + 20);
};
// 弦的前四个模式
AN.modes = (g, t, R) => {
  const x0 = R.x + 230, x1 = R.x + R.w - 200, L = x1 - x0, H = R.h / 4.3, A = H * .36, w1 = 2 * Math.PI * .55;
  for (let n = 1; n <= 4; n++) {
    const a = SS((t - (n - 1) * 1.1) / .6); if (a <= 0) continue;
    const yc = R.y + H * (n - .35); g.globalAlpha = a;
    axisLine(g, x0, x1, yc);
    curve(g, x0, x1, x => yc - A * Math.sin(n * Math.PI * (x - x0) / L), 'rgba(255,210,122,.18)', 2, 200);
    curve(g, x0, x1, x => yc + A * Math.sin(n * Math.PI * (x - x0) / L), 'rgba(255,210,122,.18)', 2, 200);
    curve(g, x0, x1, x => yc - A * Math.sin(n * Math.PI * (x - x0) / L) * Math.cos(n * w1 * t), C.g, 5);
    for (let i = 0; i <= n; i++) dot(g, x0 + i * L / n, yc, i === 0 || i === n ? 9 : 7, C.fg);
    txt(g, `n = ${n}`, R.x + 40, yc, C.fg, '700 30px "DejaVu Sans Mono",monospace');
    txt(g, `${n === 1 ? '' : n}f₁`, x1 + 40, yc, C.g, '700 32px "DejaVu Sans Mono",monospace');
    txt(g, ['半个波长', '两个半波长', '三个半波长', '四个半波长'][n - 1], R.x + 40, yc + 36, C.fg3, '500 21px "Noto Sans CJK SC",sans-serif');
    g.globalAlpha = 1;
  }
};
// 拨弦 = 模式叠加
AN.fourier = (g, t, R) => {
  const x0 = R.x + 40, x1 = R.x + R.w * .58, L = x1 - x0, p = .3, h = 190, yc = R.y + R.h * .45, NM = 12;
  const b = n => 2 * h / (n * n * Math.PI * Math.PI * p * (1 - p)) * Math.sin(n * Math.PI * p);
  const N = Math.min(NM, 1 + Math.floor(t / .5)), vib = Math.max(0, t - NM * .5 - .8), w = 2 * Math.PI * .45;
  axisLine(g, x0, x1, yc);
  g.setLineDash([10, 8]); g.strokeStyle = 'rgba(233,238,247,.45)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(x0, yc); g.lineTo(x0 + p * L, yc - h); g.lineTo(x1, yc); g.stroke(); g.setLineDash([]);
  const col = n => `hsla(${200 + n * 13},80%,68%,.75)`;
  const u = x => (x - x0) / L;
  if (!vib) for (let n = 1; n <= N; n++) curve(g, x0, x1, x => yc - b(n) * Math.sin(n * Math.PI * u(x)), col(n), 2, 200);
  curve(g, x0, x1, x => { let s = 0; for (let n = 1; n <= N; n++) s += b(n) * Math.sin(n * Math.PI * u(x)) * Math.cos(n * w * vib); return yc - s; }, '#fff', 5);
  txt(g, vib ? '每个模式按自己的频率振动，叠加成弦的运动' : `叠加前 ${N} 个模式`, x0, R.y + 30, C.fg, '600 28px "Noto Sans CJK SC",sans-serif');
  txt(g, '虚线：手指拨出的三角形', x0, R.y + 72, C.fg3, '500 22px "Noto Sans CJK SC",sans-serif');
  // 右：各模式强度
  const bx = R.x + R.w * .66, bw = R.w * .32, by = R.y + R.h * .78, bh = R.h * .55, M = Math.max(...Array.from({ length: NM }, (_, i) => Math.abs(b(i + 1))));
  txt(g, '各模式的强度', bx, by - bh - 40, C.fg2, '600 24px "Noto Sans CJK SC",sans-serif');
  axisLine(g, bx, bx + bw, by);
  for (let n = 1; n <= NM; n++) { const X = bx + (n - .5) * bw / NM, hh = Math.abs(b(n)) / M * bh * (n <= N ? 1 : 0); g.fillStyle = col(n); g.fillRect(X - bw / NM * .32, by - hh, bw / NM * .64, hh); txt(g, String(n), X, by + 22, C.fg3, '500 18px "DejaVu Sans Mono",monospace', 'center'); }
};
// 管内空气：开-开 与 闭-开
AN.pipe = (g, t, R) => {
  const w = 2 * Math.PI * .7, rows = [['两端开口（长笛）：两端是位移的波腹', 0], ['一端封闭（单簧管）：封闭端空气不能动', 1]];
  rows.forEach(([lab, cl], r) => {
    const x0 = R.x + 120, x1 = R.x + R.w - 120, L = x1 - x0, ph = 150, y0 = R.y + 90 + r * (R.h / 2), yc = y0 + ph / 2;
    txt(g, lab, x0, y0 - 34, C.fg, '600 27px "Noto Sans CJK SC",sans-serif');
    g.strokeStyle = '#6c7a98'; g.lineWidth = 4; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y0); g.moveTo(x0, y0 + ph); g.lineTo(x1, y0 + ph); g.stroke();
    if (cl) { g.fillStyle = '#c7d0e0'; g.fillRect(x0 - 14, y0 - 2, 14, ph + 4); }
    const s = u => cl ? Math.sin(Math.PI * u / 2) : Math.cos(Math.PI * u);
    const amp = 22;
    for (let i = 0; i < 46; i++) for (let j = 0; j < 7; j++) {
      const u = (i + .5 + (j % 2) * .5) / 46.5, x = x0 + u * L + amp * s(u) * Math.cos(w * t), y = y0 + 14 + j * (ph - 28) / 6;
      dot(g, Math.max(x0 + 4, Math.min(x1 + 10, x)), y, 4.2, 'rgba(160,200,255,.85)');
    }
    curve(g, x0, x1, x => yc - 60 * s((x - x0) / L), 'rgba(255,210,122,.8)', 3, 200);
    curve(g, x0, x1, x => yc + 60 * s((x - x0) / L), 'rgba(255,210,122,.8)', 3, 200);
    txt(g, cl ? '基频 f₁，泛音只有 3f₁、5f₁ …' : '基频 f₁，泛音 2f₁、3f₁ … 都有', x0, y0 + ph + 38, C.g, '500 24px "Noto Sans CJK SC",sans-serif');
  });
};
// 克拉尼：沙子跑到节线
const CHM = [[1, 2, -1, '(1,2)'], [2, 3, 1, '(2,3)'], [1, 4, 1, '(1,4)'], [3, 5, -1, '(3,5)']];
let CHP = null;
function chPrep() {
  if (CHP) return CHP; let sd = 12345; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const N = 6000, st = Array.from({ length: N }, () => [rnd(), rnd(), rnd() * 6.28, rnd()]);
  const fin = CHM.map(([m, n, sg]) => st.map(([x, y]) => {
    for (let it = 0; it < 60; it++) {
      const P = Math.PI, f = Math.cos(m * P * x) * Math.cos(n * P * y) + sg * Math.cos(n * P * x) * Math.cos(m * P * y);
      const fx = -m * P * Math.sin(m * P * x) * Math.cos(n * P * y) - sg * n * P * Math.sin(n * P * x) * Math.cos(m * P * y);
      const fy = -n * P * Math.cos(m * P * x) * Math.sin(n * P * y) - sg * m * P * Math.cos(n * P * x) * Math.sin(m * P * y);
      const gg = fx * fx + fy * fy + 1e-6; let dx = -f * fx / gg, dy = -f * fy / gg; const l = Math.hypot(dx, dy); if (l > .02) { dx *= .02 / l; dy *= .02 / l; }
      x = Math.min(1, Math.max(0, x + dx)); y = Math.min(1, Math.max(0, y + dy));
    }
    return [x, y];
  }));
  return CHP = { st, fin };
}
AN.chladni = (g, t, R) => {
  const P = chPrep(), S = Math.min(R.h - 60, 700), X0 = R.x + (R.w - S) / 2, Y0 = R.y + 40, per = 4.2, k = Math.min(CHM.length - 1, Math.floor(t / per)), lt = t - k * per;
  const gr = g.createLinearGradient(X0, Y0, X0 + S, Y0 + S); gr.addColorStop(0, '#2b3242'); gr.addColorStop(1, '#1a1f2b'); g.fillStyle = gr; g.fillRect(X0, Y0, S, S);
  g.strokeStyle = '#4a5674'; g.lineWidth = 3; g.strokeRect(X0, Y0, S, S);
  const u = SS((lt - .3) / 2.2), sh = Math.max(0, 1 - u) * (lt < 3.6 ? 1 : 0);
  g.fillStyle = '#efe6cf';
  P.st.forEach((s, i) => { const f = P.fin[k][i], j = sh * .012 * s[3]; const x = s[0] + (f[0] - s[0]) * u + j * Math.sin(lt * 40 + s[2]), y = s[1] + (f[1] - s[1]) * u + j * Math.cos(lt * 37 + s[2]); g.fillRect(X0 + x * S - 1.4, Y0 + y * S - 1.4, 2.8, 2.8); });
  const m = CHM[k]; txt(g, `模式 ${m[3]}`, X0 + S + 50, Y0 + 40, C.g, '700 34px "DejaVu Sans Mono",monospace');
  txt(g, '沙子离开振动的地方', X0 + S + 50, Y0 + 100, C.fg2, '500 24px "Noto Sans CJK SC",sans-serif');
  txt(g, '聚到不动的节线上', X0 + S + 50, Y0 + 136, C.fg2, '500 24px "Noto Sans CJK SC",sans-serif');
  txt(g, '频率越高，节线越密', X0 + S + 50, Y0 + 200, C.fg3, '500 22px "Noto Sans CJK SC",sans-serif');
  CHM.forEach((q, i) => { txt(g, q[3], X0 - 60, Y0 + 40 + i * 50, i === k ? C.g : C.fg3, '600 24px "DejaVu Sans Mono",monospace', 'right'); });
};
// 圆形鼓膜
function J(m, x) { let s = 0, t = Math.pow(x / 2, m); for (let k = 1; k <= m; k++) t /= k; for (let k = 0; k < 40; k++) { s += t; t *= -(x * x / 4) / ((k + 1) * (k + 1 + m)); } return s; }
const DM = [[0, 2.4048, '(0,1)', 1], [1, 3.8317, '(1,1)', 1.59], [2, 5.1356, '(2,1)', 2.14], [0, 5.5201, '(0,2)', 2.30]];
let DMP = null;
function dmPrep() { if (DMP) return DMP; const N = 180; DMP = DM.map(([m, j]) => { const a = new Float32Array(N * N); for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const dx = (x + .5) / N * 2 - 1, dy = (y + .5) / N * 2 - 1, r = Math.hypot(dx, dy); a[y * N + x] = r > 1 ? NaN : J(m, j * r) * Math.cos(m * Math.atan2(dy, dx)); } let M = 0; a.forEach(v => { if (v === v) M = Math.max(M, Math.abs(v)); }); return a.map(v => v / M); }); DMP.N = N; DMP.cv = document.createElement('canvas'); DMP.cv.width = DMP.cv.height = N; return DMP; }
AN.drum = (g, t, R) => {
  const P = dmPrep(), N = P.N, cx = P.cv.getContext('2d'), D = Math.min(360, (R.w - 120) / 4 - 40), gap = (R.w - 4 * D) / 5;
  DM.forEach(([m, j, lab, rat], i) => {
    const a = SS((t - i * .8) / .6); if (a <= 0) return;
    const im = cx.createImageData(N, N), ph = Math.cos(2 * Math.PI * .45 * rat * t);
    for (let p = 0; p < N * N; p++) { const v = P[i][p]; if (v !== v) { im.data[p * 4 + 3] = 0; continue; } const s0 = v * ph, s = Math.sign(s0) * Math.pow(Math.abs(s0), .6); const c = s > 0 ? [255 - 70 * s, 255 - 190 * s, 255 - 200 * s] : [255 + 210 * s, 255 + 120 * s, 255 + 20 * s]; im.data[p * 4] = c[0]; im.data[p * 4 + 1] = c[1]; im.data[p * 4 + 2] = c[2]; im.data[p * 4 + 3] = 255; }
    cx.putImageData(im, 0, 0);
    const X = R.x + gap + i * (D + gap), Y = R.y + (R.h - D) / 2 - 20;
    g.globalAlpha = a; g.imageSmoothingEnabled = true; g.drawImage(P.cv, X, Y, D, D);
    txt(g, lab, X + D / 2, Y - 34, C.fg, '700 30px "DejaVu Sans Mono",monospace', 'center');
    txt(g, `${rat.toFixed(2)} × 基频`, X + D / 2, Y + D + 40, C.g, '600 28px "Noto Sans CJK SC",sans-serif', 'center');
    g.globalAlpha = 1;
  });
  txt(g, '红、蓝：同一时刻向上和向下；交界处是节线（圆圈和直径）', R.x + R.w / 2, R.y + R.h - 10, C.fg3, '500 22px "Noto Sans CJK SC",sans-serif', 'center');
};

function animLayer(c, lay, name, det) {
  const cv = c.el(`<canvas class="an" width="1920" height="1080"></canvas>`, lay), g = cv.getContext('2d');
  const R = det ? { x: 100, y: 140, w: 1300, h: 800 } : { x: 100, y: 140, w: 1720, h: 800 };
  return { draw: lt => { g.clearRect(0, 0, 1920, 1080); AN[name](g, lt, R); } };
}

function build(c) {
  const sc = c.sc, n = sc.beats.length, segs = [];
  sc.beats.forEach((b, i) => {
    const st = i === 0 ? 0 : b.s - .35, en = i < n - 1 ? sc.beats[i + 1].s - .35 : sc.T, k = b.vis.length;
    b.vis.forEach((v, j) => segs.push({ v, a: st + (en - st) * j / k, b: st + (en - st) * (j + 1) / k, key: b.key, bi: i }));
  });
  // 同一动画在相邻段连续时合并成一段，避免重启
  const dets = {};
  const detOf = s => { const d = DET[s.key]; if (!d) return null; if (d[0][0] === '@') return d[0].slice(1) === s.v ? d.slice(1) : null; return d; };
  segs.forEach(s => {
    const det = detOf(s);
    s.lay = c.el(`<div class="lay"></div>`);
    const [kind, name] = s.v.split(':');
    s.obj = kind === 'img' ? imgLayer(c, s.lay, name, det) : animLayer(c, s.lay, name, det);
  });
  sc.beats.forEach((b, i) => {
    const ss = segs.filter(x => x.bi === i && detOf(x)); if (!ss.length) return;
    const d = detOf(ss[0]);
    const el = c.el(`<div class="det" style="left:1440px;top:200px"><span class="h">${d[0]}</span>${d.slice(1).map(x => `<span class="ln">${x}</span>`).join('')}</div>`);
    dets[i] = { el, a: Math.max(ss[0].a, b.s - .2), e: ss[ss.length - 1].b }; el.style.opacity = 0;
  });
  let ttl = null;
  if (!sc.chapter) {
    const [k, rest] = sc.title.split('：');
    ttl = c.el(`<div class="ttl"><div class="k">${k.replace(' · ', ' · ')}</div><h1>${rest}</h1><div class="s">${sc.ep === 1 ? '弦 · 管 · 平板 · 房间' : '湖泊 · 地球 · 太阳 · 原子 · 宇宙'}</div></div>`);
  }
  c.tick(t => {
    segs.forEach((s, i) => {
      const nx = segs[i + 1], fi = i === 0 ? 1 : SS((t - s.a) / .6), fo = nx ? 1 - SS((t - nx.a) / .6) : 1;
      const op = t < s.a ? 0 : Math.min(fi, fo);
      if (op <= 0) { if (s.lay.style.display !== 'none') s.lay.style.display = 'none'; return; }
      s.lay.style.display = 'block'; s.lay.style.opacity = op;
      const lt = t - s.a;
      if (s.obj.draw) s.obj.draw(lt); else s.obj.img.style.transform = `scale(${1 + s.obj.kb * Math.min(1, lt / Math.max(4, s.b - s.a + .6))})`;
    });
    Object.values(dets).forEach(({ el, a, e }) => { const u = SS((t - a - .3) / .5); el.style.opacity = Math.min(u, SS((e - t) / .4)); el.style.transform = `translateY(${(1 - u) * 14}px)`; });
    if (ttl) ttl.style.opacity = t < 4.2 ? 1 : 1 - SS((t - 4.2) / .8);
  });
}
TL.scenes.forEach(s => SCENES[s.id] = { build });
