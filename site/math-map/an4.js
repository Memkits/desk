// 第四集画面（非地图）
Object.assign(AN, {
  hilbert: (g, t, R, st) => {
    hdr(g, R, '希尔伯特的 23 个问题', '1900 年 8 月 · 巴黎国际数学家大会');
    const hot = { 1: '连续统假设', 2: '算术的相容性', 8: '黎曼猜想', 10: '丢番图方程的可解性' };
    for (let i = 1; i <= 23; i++) { const c = (i - 1) % 6, r_ = Math.floor((i - 1) / 6), x = R.x + 40 + c * 150, y = R.y + 170 + r_ * 150, a = pop(t, .4 + i * .08, .4), h = hot[i];
      al(g, a, () => { rr(g, x, y, 130, 130, 16, h ? 'rgba(255,210,122,.12)' : 'rgba(14,20,36,.92)', h ? C.gold : C.line2, h ? 3 : 1.5); txt(g, String(i), x + 65, y + 56, h ? C.gold : C.fg2, fnt(800, 44, 'mono'), 'center'); if (h) txt(g, h.length > 6 ? h.slice(0, 5) + '…' : h, x + 65, y + 104, C.fg, fnt(600, 18), 'center'); }); }
    const X = R.x + 1000; Object.entries(hot).forEach(([n, s], i) => al(g, pop(t, 3 + i * .6, .5), () => { txt(g, `第 ${n} 题`, X, R.y + 210 + i * 70, C.gold, fnt(800, 28)); txt(g, s, X + 130, R.y + 210 + i * 70, C.fg, fnt(700, 28)); }));
    al(g, pop(t, 5.8, .6), () => quote(g, X - 20, R.y + 520, 720, '在数学中，没有不可知。', '希尔伯特，1900', C.gold, 1, 36));
  },
  gaps: (g, t, R, st) => {
    hdr(g, R, '素数间隙：从七千万到 246', '有无穷多对素数，差不超过 N');
    const D = st.D || 14;
    // 数轴上的孪生素数
    const isP = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
    const X0 = R.x + 40, Y = R.y + 200, W = 1640; for (let n = 2; n <= 110; n++) { const x = X0 + (n - 2) / 108 * W; if (!isP(n)) { dot(g, x, Y, 3, C.fg3); continue; } const tw = isP(n + 2) || isP(n - 2); dot(g, x, Y, 8, tw ? C.gold : C.b); if (tw && isP(n + 2)) { const x2 = X0 + n / 108 * W; g.save(); g.strokeStyle = C.gold; g.lineWidth = 2; g.beginPath(); g.moveTo(x, Y - 14); g.quadraticCurveTo((x + x2) / 2, Y - 40, x2, Y - 14); g.stroke(); g.restore(); } }
    txt(g, '金色：孪生素数（差为 2），猜想它们有无穷多对 —— 尚未证明', X0, Y + 50, C.fg2, fnt(600, 24));
    const steps = [['2013 年 5 月', '张益唐', 70000000], ['2013 年夏', 'Polymath 合作项目', 4680], ['2013 年 11 月', '梅纳德（及陶哲轩独立）', 600], ['2014 年', 'Polymath 8b', 246]];
    const lg = v => Math.log10(v) / Math.log10(70000000);
    steps.forEach(([d, who, v], i) => al(g, pop(t, 1 + i * D * .18, .6), () => { const y = R.y + 370 + i * 110; txt(g, d, R.x + 40, y + 20, C.fg3, fnt(600, 24)); txt(g, who, R.x + 230, y + 20, '#fff', fnt(700, 26));
      rr(g, R.x + 600, y, 900 * lg(v) + 10, 40, 8, i === 0 ? C.o : C.gold); txt(g, v.toLocaleString('en-US'), R.x + 620 + 900 * lg(v), y + 21, '#fff', fnt(800, 28, 'mono')); }));
    al(g, pop(t, 1, .6), () => txt(g, '（对数刻度）', R.x + 1520, R.y + 330, C.fg3, fnt(500, 20)));
  },
});
