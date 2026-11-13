// 《Rust 这两年》画布动画：片头、发布节奏、版次、分配器、被收编的库、总览、片尾
const RV = [['1.85', '2025-02-20'], ['1.86', '2025-04-03'], ['1.87', '2025-05-15'], ['1.88', '2025-06-26'], ['1.89', '2025-08-07'], ['1.90', '2025-09-18'], ['1.91', '2025-10-30'], ['1.92', '2025-12-11'],
  ['1.93', '2026-01-22'], ['1.94', '2026-03-05'], ['1.95', '2026-04-16'], ['1.96', '2026-05-28'], ['1.97', '2026-07-09'], ['1.98', '2026-08-20'], ['1.99', '2026-10-01'], ['1.100', '2026-11-12']];
const RUST = '#F4845F';
function gear(g, x, y, r, rot, col = RUST, a = 1) {
  al(g, a, () => { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col; g.beginPath();
    const n = 16; for (let i = 0; i < n * 2; i++) { const an = i / (n * 2) * TAU, rr_ = i % 2 ? r : r * 1.16; g.lineTo(Math.cos(an) * rr_, Math.sin(an) * rr_); } g.closePath(); g.fill();
    g.fillStyle = '#0B1020'; g.beginPath(); g.arc(0, 0, r * .72, 0, TAU); g.fill(); g.restore();
    txt(g, 'R', x, y + r * .04, col, fnt(900, r * .95, 'serif'), 'center'); });
}
// 一排版本站点：u(i) = 第 i 站点亮进度
function stations(g, x0, x1, y, u, hot = []) {
  const n = RV.length, X = i => LERP(x0, x1, i / (n - 1));
  line(g, [[x0, y], [x1, y]], C.line2, 6);
  const lit = RV.reduce((a, _, i) => a + CL(u(i)), 0);
  line(g, [[x0, y], [LERP(x0, x1, CL((lit - 1) / (n - 1))), y]], RUST, 6);
  RV.forEach(([v, d], i) => { const a = u(i), x = X(i), h = hot.includes(i);
    dot(g, x, y, h ? 15 : 10, a > .5 ? (h ? C.gold : RUST) : C.line2);
    if (h && a > .5) glow(g, x, y, 46, 'rgba(255,210,122,.35)');
    al(g, .25 + .75 * a, () => { txt(g, v, x, y - 40, h ? C.gold : C.fg, fnt(800, h ? 30 : 24, 'mono'), 'center');
      g.save(); g.translate(x, y + 28); g.rotate(.62); txt(g, d.slice(2), 0, 0, C.fg3, fnt(500, 17, 'mono'), 'left'); g.restore(); }); });
  return X;
}
AN.open = (g, t, R, st) => {
  const cx = R.x + R.w / 2;
  if (t < 4.6) return;
  gear(g, cx, R.y + 200, 80, t * .15, RUST, .3 * pop(t, 4.6, 1));
  const t0 = 4.8, y = R.y + 420;
  const X = stations(g, R.x + 70, R.x + R.w - 70, y, i => pop(t, t0 + i * .32, .4), [0, 15]);
  al(g, pop(t, t0 + 1.2), () => { txt(g, '2024 版次', X(0), y - 92, C.gold, fnt(800, 26), 'center'); });
  al(g, pop(t, t0 + 5.6), () => { txt(g, '最新', X(15), y - 92, C.gold, fnt(800, 26), 'center'); });
  al(g, pop(t, t0 + 6.2, .8), () => {
    txt(g, '16', cx - 150, R.y + 690, RUST, fnt(900, 120, 'mono'), 'center');
    txt(g, '个稳定版', cx - 150, R.y + 780, C.fg2, fnt(700, 28), 'center');
    txt(g, '21', cx + 150, R.y + 690, C.b, fnt(900, 120, 'mono'), 'center');
    txt(g, '个月', cx + 150, R.y + 780, C.fg2, fnt(700, 28), 'center');
  });
};
AN.open2 = (g, t, R) => {
  const cx = R.x + R.w / 2;
  const Q = [['语法', C.p, ['异步闭包', 'let 链', 'if let 守卫', 'unsafe extern']], ['类型系统', C.b, ['向上转换', '推断常量参数', '从未类型 !']],
    ['标准库', C.g, ['get_disjoint_mut', 'extract_if', 'as_chunks', 'push_mut', 'cfg_select!', '文件锁', '分配器']], ['Cargo', C.o, ['警告配置', '未用依赖', '依赖冷却期', '工作区特性']]];
  const gap = 28, w = (R.w - gap * 3) / 4;
  Q.forEach(([h, col, items], i) => { const x = R.x + i * (w + gap), y = R.y + 40, u = pop(t, .4 + i * .9, .7);
    al(g, u, () => { rr(g, x, y, w, 430, 20, 'rgba(14,20,36,.94)', col, 2.5); txt(g, h, x + w / 2, y + 52, col, fnt(800, 34), 'center');
      items.forEach((s, k) => { const v = pop(t, 1 + i * .9 + k * .25, .4); al(g, v, () => { g.font = fnt(700, 22, 'mono'); const tw = g.measureText(s).width + 30; rr(g, x + w / 2 - tw / 2, y + 100 + k * 46, tw, 36, 10, col + '1A', col + '88', 1.5); txt(g, s, x + w / 2, y + 118 + k * 46, C.fg, fnt(700, 22, 'mono'), 'center'); }); }); }); });
  // 旧 → 新 的示意
  al(g, pop(t, 6.5, .8), () => {
    const y = R.y + 560, bw = 420, bh = 150;
    rr(g, cx - bw - 120, y, bw, bh, 16, 'rgba(255,107,107,.08)', 'rgba(255,107,107,.6)', 2);
    txt(g, '旧写法', cx - bw / 2 - 120, y + 40, '#FF9DA9', fnt(800, 26), 'center');
    [0, 1, 2, 3].forEach(k => rr(g, cx - bw - 90 + k * 14, y + 70 + k * 16, bw - 80 - k * 30, 10, 5, 'rgba(255,157,169,.35)'));
    arrow(g, cx - 100, y + bh / 2, cx + 100, y + bh / 2, C.gold, 5, 18);
    rr(g, cx + 120, y, bw, bh, 16, 'rgba(95,211,154,.08)', 'rgba(95,211,154,.6)', 2);
    txt(g, '新写法', cx + bw / 2 + 120, y + 40, '#7FF0B4', fnt(800, 26), 'center');
    [0, 1].forEach(k => rr(g, cx + 150, y + 76 + k * 22, bw - 120 - k * 80, 10, 5, 'rgba(127,240,180,.4)'));
  });
  al(g, pop(t, 13), () => { rr(g, R.x + 200, R.y + 760, R.w - 400, 56, 14, 'rgba(255,210,122,.07)', C.gold + '88', 1.5);
    txt(g, '旧写法：rustc 1.84.0 实测编译　·　新写法：rustc 1.100.0 实测编译', cx, R.y + 788, C.fg, fnt(600, 24), 'center'); });
};
AN.train = (g, t, R, st) => {
  const lanes = [['每日构建 nightly', C.p], ['测试版 beta', C.b], ['稳定版 stable', C.g]];
  const x0 = R.x + 300, x1 = R.x + R.w - 40, y0 = R.y + 120, dy = 170;
  lanes.forEach(([n, col], i) => { const y = y0 + i * dy; txt(g, n, x0 - 30, y, col, fnt(800, 28), 'right'); line(g, [[x0, y], [x1, y]], C.line2, 4); for (let x = x0; x < x1; x += 40) line(g, [[x, y - 8], [x, y + 8]], C.line, 3); });
  // 时间轴：每 6 周一格，格线上是版本号
  const per = 6, W = (x1 - x0) / 4.6, sp = W / per;   // sp = 每周像素
  const shift = Math.min(t, 22) * sp * .55;   // 慢慢向左移动
  g.save(); g.beginPath(); g.rect(x0, R.y, x1 - x0, R.h); g.clip();
  for (let k = 0; k < 8; k++) { const x = x0 + 60 + k * W - shift; line(g, [[x, y0 - 50], [x, y0 + 2 * dy + 50]], 'rgba(255,210,122,.18)', 2, [6, 8]);
    txt(g, `第 ${k * 6} 周`, x, y0 + 2 * dy + 80, C.fg3, fnt(600, 20), 'center'); }
  // 车厢：每 6 周一列，从 nightly 进入 beta 再到 stable
  for (let k = 0; k < 6; k++) { const xs = x0 + 60 + k * W - shift;
    [[0, '1.' + (95 + k + 2)], [1, '1.' + (95 + k + 1)], [2, '1.' + (95 + k)]].forEach(([ln, v]) => { const y = y0 + ln * dy; const col = lanes[ln][1];
      rr(g, xs + 10, y - 34, W - 40, 56, 12, col + '22', col, 2); txt(g, v, xs + W / 2 - 10, y - 6, C.fg, fnt(800, 24, 'mono'), 'center'); }); }
  g.restore();
  // 一个功能赶车：先落在 nightly，再上 beta，最后进 stable
  const u = pop(t, 3, 1.5), u2 = pop(t, 7, 1.5);
  al(g, pop(t, 2), () => { const x = x0 + 60 + 1.5 * W - shift * .2, y = LERP(LERP(y0, y0 + dy, u), y0 + 2 * dy, u2) - 74;
    chip(g, '新功能', x, y, C.gold, 1, 22); });
  if (st.k === 0) al(g, pop(t, 11), () => txt(g, '赶上就发布，赶不上就等下一班：六周之后还有一班', R.x + R.w / 2, R.y + R.h - 40, C.fg2, fnt(600, 26), 'center'));
};
AN.edition = (g, t, R) => {
  const E = [['2015', '1.0', C.fg3], ['2018', '1.31', C.b], ['2021', '1.56', C.p], ['2024', '1.85', RUST]];
  const gap = 34, w = (R.w - 120 - gap * 3) / 4, y = R.y + 40;
  E.forEach(([e, v, col], i) => { const x = R.x + 60 + i * (w + gap), u = pop(t, .5 + i * .6, .6), last = i === 3;
    al(g, u, () => { rr(g, x, y, w, 150, 18, last ? 'rgba(244,132,95,.12)' : 'rgba(14,20,36,.94)', col, last ? 4 : 2);
      txt(g, e + ' 版次', x + w / 2, y + 60, last ? C.gold : C.fg, fnt(900, 40, 'mono'), 'center'); txt(g, '随 ' + v + ' 发布', x + w / 2, y + 112, C.fg3, fnt(600, 22), 'center'); });
    if (i < 3) arrow(g, x + w + 4, y + 75, x + w + gap - 4, y + 75, C.fg3, 3, 10, u); });
  // 依赖图：不同版次的 crate 混在一起
  const N = [['你的项目', '2024', 0, 0, RUST], ['serde', '2021', -1, 1, C.p], ['tokio', '2021', 1, 1, C.p], ['itoa', '2018', -1.6, 2, C.b], ['bytes', '2021', .4, 2, C.p], ['libc', '2021', 1.6, 2, C.p]];
  const cx = R.x + R.w / 2, by = R.y + 330, P = n => [cx + n[2] * 320, by + n[3] * 150];
  const a = pop(t, 4, .8);
  al(g, a, () => {
    [[0, 1], [0, 2], [1, 3], [2, 4], [2, 5]].forEach(([i, j]) => { const [x0, y0] = P(N[i]), [x1, y1] = P(N[j]); line(g, [[x0, y0 + 30], [x1, y1 - 30]], C.line2, 3); });
    N.forEach(n => { const [x, y] = P(n); rr(g, x - 110, y - 32, 220, 64, 14, 'rgba(14,20,36,.96)', n[4], 2.5); txt(g, n[0], x, y - 8, C.fg, fnt(800, 22, 'mono'), 'center'); txt(g, n[1] + ' 版次', x, y + 18, n[4], fnt(700, 17), 'center'); });
  });
  al(g, pop(t, 7), () => txt(g, '版次由每个项目自己选，不同版次的库可以一起编译', cx, R.y + R.h - 30, C.fg2, fnt(600, 26), 'center'));
};
AN.arena = (g, t, R) => {
  const gap = 30, w = (R.w - gap * 2) / 3, y = R.y + 40, h = 600;
  const P = [['帧内存池', C.o, '一帧结束，整块释放'], ['按模块统计', C.b, '谁用了多少，一目了然'], ['内存上限', C.r, '超出额度就分配失败']];
  P.forEach(([n, col, s], i) => { const x = R.x + i * (w + gap), u = pop(t, .4 + i * 1.6, .6);
    al(g, u, () => { rr(g, x, y, w, h, 20, 'rgba(14,20,36,.94)', col, 2.5); txt(g, n, x + w / 2, y + 50, col, fnt(800, 32), 'center'); txt(g, s, x + w / 2, y + h - 40, C.fg2, fnt(600, 23), 'center'); }); });
  // 1 帧内存池：块逐个堆上去，到顶后一下清空
  { const x = R.x + 40, bx = x, bw = w - 80, top = y + 110, bh = 360; const ph = (t * .8) % 4; const nfill = Math.floor(ph * 3);
    rr(g, bx, top, bw, bh, 12, null, C.line2, 2);
    for (let k = 0; k < nfill && k < 11; k++) { const H = 30; rr(g, bx + 8 + (k % 2) * (bw / 2 - 4), top + bh - 8 - (Math.floor(k / 2) + 1) * (H + 6), bw / 2 - 12, H, 6, C.o + '99'); }
    txt(g, `第 ${Math.floor(t * .8 / 4) + 1} 帧`, bx + bw / 2, top + bh + 40, C.fg3, fnt(700, 22, 'mono'), 'center'); }
  // 2 按模块统计
  { const x = R.x + w + gap + 40, bw = w - 80; const M = [['渲染', .72, C.b], ['物理', .44, C.g], ['音频', .2, C.p], ['网络', .33, C.o]];
    al(g, pop(t, 2), () => M.forEach(([n, p, col], k) => { const yy = y + 140 + k * 90; txt(g, n, x, yy, C.fg, fnt(700, 24)); pctBar(g, x + 80, yy - 14, bw - 200, 28, p * pop(t, 2.3 + k * .3, 1), col); })); }
  // 3 上限
  { const x = R.x + 2 * (w + gap) + 40, bw = w - 80, top = y + 120; const p = CL((t - 4) / 6) * 1.15;
    al(g, pop(t, 3.6), () => { pctBar(g, x, top + 60, bw - 90, 40, Math.min(1, p), p > 1 ? C.bad : C.r); line(g, [[x + bw - 90, top + 30], [x + bw - 90, top + 130]], C.gold, 3, [5, 5]); txt(g, '上限', x + bw - 90, top + 10, C.gold, fnt(700, 20), 'center');
      if (p > 1) { txt(g, 'Err(AllocError)', x + (bw - 90) / 2, top + 210, C.bad, fnt(800, 26, 'mono'), 'center'); txt(g, '而不是拖垮整个进程', x + (bw - 90) / 2, top + 260, C.fg2, fnt(600, 22), 'center'); } }); }
};
AN.absorb = (g, t, R, st) => {
  // [第三方库, 创建年, 官方方案, 官方年份, 色, 总下载量]
  const L = [['lazy_static / once_cell', 2014.9, 'LazyLock · 1.80', 2024.56, C.fg3, '11.7 亿 / 15.2 亿', true], ['async-trait', 2019.56, 'trait 里的 async fn · 1.75', 2023.99, C.fg3, '8.1 亿', true],
    ['cfg-if', 2015.52, 'cfg_select! · 1.95', 2026.29, C.p, '17.5 亿'], ['fs2', 2015.67, 'File::lock · 1.89', 2025.6, C.b, '1.0 亿'],
    ['cargo-cache', 2018.79, '自动清理缓存 · 1.88', 2025.48, C.o, '310 万'], ['cargo-machete / udeps', 2019.66, 'unused_dependencies · 1.100', 2026.86, C.g, '330 万 / 150 万']];
  const x0 = R.x + 330, x1 = R.x + R.w - 360, A = 2014, B = 2027, X = v => LERP(x0, x1, (v - A) / (B - A)), y0 = R.y + 70, rh = 100;
  [2014, 2016, 2018, 2020, 2022, 2024, 2026].forEach(v => { line(g, [[X(v), y0 - 10], [X(v), y0 + L.length * rh]], 'rgba(44,56,84,.5)', 1, [4, 6]); txt(g, String(v), X(v), y0 - 30, C.fg3, fnt(600, 20, 'mono'), 'center'); });
  txt(g, '总下载量', x1 + 200, y0 - 30, C.fg3, fnt(600, 20), 'center');
  L.forEach(([n, a, o, b, col, dl, early], i) => { const u = pop(st.k === 0 ? t : 99, .4 + i * .7, 1.2), y = y0 + 30 + i * rh;
    al(g, Math.min(1, u * 3), () => {
      txt(g, n, x0 - 20, y, early ? C.fg2 : C.fg, fnt(700, 23, 'mono'), 'right');
      const e = LERP(a, 2026.87, u);
      rr(g, X(a), y - 13, Math.max(4, X(Math.min(e, b)) - X(a)), 26, 8, col + (early ? '66' : 'CC'));
      if (e > b) rr(g, X(b), y - 13, X(e) - X(b), 26, 8, col + '33');
      if (u > .7) { g.save(); g.translate(X(b), y); g.rotate(Math.PI / 4); g.fillStyle = C.gold; g.fillRect(-9, -9, 18, 18); g.restore(); txt(g, o, X(b) - 12, y - 32, early ? C.fg3 : C.gold, fnt(700, 19), b > 2025.9 ? 'right' : 'center'); }
      if (u > .95) txt(g, dl, x1 + 200, y, C.fg2, fnt(700, 22, 'mono'), 'center');
    }); });
  txt(g, '◆ 官方方案稳定的版本　· 灰色两行早于本片范围　· 下载量来自 crates.io，2026-11-13', R.x + R.w / 2, R.y + R.h - 24, C.fg3, fnt(500, 19), 'center');
  if (st.k === 1) al(g, pop(st.tk, .5), () => { rr(g, R.x + 300, R.y + R.h - 140, R.w - 600, 64, 14, 'rgba(95,211,154,.08)', C.g + '99', 1.5); txt(g, '老项目照常使用 · 新项目可以少一个依赖、少一个供应链环节', R.x + R.w / 2, R.y + R.h - 108, C.fg, fnt(600, 25), 'center'); });
};
AN.map = (g, t, R, st) => {
  // 每个版本下挂本片讲到的功能
  const F = { 0: ['2024 版次', '异步闭包'], 1: ['向上转换', 'get_disjoint_mut'], 2: ['extract_if'], 3: ['let 链', 'as_chunks'], 4: ['推断常量', '文件锁'], 9: ['array_windows'], 10: ['if let 守卫', 'cfg_select!', 'push_mut', '原子 update'], 11: ['assert_matches!'], 12: ['build.warnings'], 13: ['bool::ok_or'], 14: ['工作区特性'], 15: ['! 类型', '分配器', 'trim_prefix', '冷却期'] };
  const x0 = R.x + 60, x1 = R.x + R.w - 60, y = R.y + 70;
  const X = stations(g, x0, x1, y, i => pop(t, .2 + i * .12, .3), [0, 15]);
  Object.entries(F).forEach(([i, fs], j) => fs.forEach((s, k) => { const u = pop(t, .8 + j * .2 + k * .08, .4); al(g, u, () => { g.font = fnt(700, 17); const w = g.measureText(s).width + 18, x = X(+i) - w / 2, yy = y + 110 + (+i % 2 ? 4 : 0) * 38 + k * 38; rr(g, x, yy - 15, w, 30, 8, 'rgba(244,132,95,.12)', RUST + '99', 1.2); txt(g, s, X(+i), yy, C.fg, fnt(700, 17), 'center'); }); }));
  const S = [['1', 'rustup update', '更新工具链'], ['2', 'cargo fix --edition', '切换到 2024 版次'], ['3', 'rust-version = "1.85"', '写明支持的最低版本']];
  S.forEach(([n, cmd, s], i) => { const u = pop(st.k === 0 ? t : 99, 8 + i * 3.2, .6), x = R.x + 60 + i * ((R.w - 120) / 3), w = (R.w - 120) / 3 - 30, yy = R.y + 560;
    al(g, u, () => { rr(g, x, yy, w, 190, 18, 'rgba(14,20,36,.95)', C.gold, 2.5); txt(g, n, x + 40, yy + 50, C.gold, fnt(900, 44, 'mono'), 'center'); txt(g, s, x + 80, yy + 50, C.fg, fnt(800, 28)); rr(g, x + 30, yy + 100, w - 60, 56, 10, '#0B1020', C.line2, 1.5); txt(g, cmd, x + 50, yy + 128, '#7FF0B4', fnt(700, 24, 'mono')); }); });
};
AN.end = (g, t, R) => {
  const cx = R.x + R.w / 2;
  gear(g, cx, R.y + 230, 110, t * .2, RUST, pop(t, .3));
  al(g, pop(t, 1.5), () => { txt(g, '下一班：1.101', cx, R.y + 450, C.fg, fnt(900, 64, 'mono'), 'center'); txt(g, '六周之后', cx, R.y + 520, C.fg2, fnt(700, 30), 'center'); });
  al(g, pop(t, 4), () => { const y = R.y + 640; rr(g, cx - 520, y, 1040, 66, 14, 'rgba(255,107,107,.07)', 'rgba(255,107,107,.45)', 1.5); txt(g, '− 删掉一段旧代码', cx - 260, y + 33, '#FF9DA9', fnt(700, 26, 'mono'), 'center'); txt(g, '+ 换上更短的新写法', cx + 260, y + 33, '#7FF0B4', fnt(700, 26, 'mono'), 'center'); });
  al(g, pop(t, 8), () => txt(g, '本片由 AI 生成 · 版本信息截至 2026-11-13（Rust 1.100.0）', cx, R.y + R.h - 30, C.fg3, fnt(600, 22), 'center'));
};
