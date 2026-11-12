// 公共工具：颜色、节拍时间、分段、测量结果面板。
window.DET = {};
const BL = '#5CB4FF', OR = '#FFB25C', PC = [null, BL, OR], PN = [null, '蓝方', '橙方'];
const BTOF = st => TL.scenes.find(s => s.id === st.sid).beats[st.bi];
// 把 [0,d] 分成若干段：seq(tk, [2,1,3]) → {i, f}（第 i 段，段内进度 f）；超出停在最后一段末尾
function seq(t, ds) { let i = 0; while (i < ds.length - 1 && t >= ds[i]) { t -= ds[i]; i++; } return { i, f: CL(t / ds[i]), t }; }
function fadeIn(g, u, fn) { if (u <= 0) return; g.save(); g.globalAlpha *= CL(u); fn(); g.restore(); }
function label(g, s, x, y, col = C.fg2, fs = 24, al = 'center', w = 600) { txt(g, s, x, y, col, fnt(w, fs), al); }
function panel(g, x, y, w, h, head, col = C.line2) { rr(g, x, y, w, h, 16, 'rgba(14,20,36,.9)', col, 2); if (head) txt(g, head, x + 24, y + 36, C.fg, fnt(800, 27)); }
// 横向胜率条：n 局里赢 w 局
function wbar(g, x, y, w, lab, win, n, u, col = C.g, note = '') {
  txt(g, lab, x, y, C.fg2, fnt(600, 23)); const bx = x + 250, bw = w - 250 - 110;
  rr(g, bx, y - 13, bw, 26, 13, 'rgba(255,255,255,.06)'); line(g, [[bx + bw / 2, y - 20], [bx + bw / 2, y + 20]], C.fg3, 2, [4, 4]);
  if (u > 0) { rr(g, bx, y - 13, Math.max(26, bw * win / n * SS(u)), 26, 13, col); txt(g, `${win}/${n}`, bx + bw + 16, y, C.fg, fnt(700, 24, 'mono')); }
  if (note) txt(g, note, bx, y + 34, C.fg3, fnt(500, 19));
}
// 测量结果面板。o = {name, tiers:[[lab,win,n,note]], first:[win,n,note], good:[...], bad:[...]}
function resPanel(g, t, R, o) {
  const x = R.x + 60, y = R.y + 30, w = 900;
  panel(g, x, y, w, 660, o.name + ' · 测量结果');
  txt(g, '多想四倍的一方赢了多少局（虚线 = 一半）', x + 24, y + 86, C.fg3, fnt(500, 21));
  o.tiers.forEach((r, i) => wbar(g, x + 24, y + 140 + i * 78, w - 48, r[0], r[1], r[2], (t - 1 - i * .7) / .8, r[4] || C.g, r[3] || ''));
  const fy = y + 140 + o.tiers.length * 78 + 50;
  txt(g, '双方一样强时，先手赢了多少局', x + 24, fy, C.fg3, fnt(500, 21));
  wbar(g, x + 24, fy + 54, w - 48, '先手', o.first[0], o.first[1], (t - 1.4 - o.tiers.length * .7) / .8, o.first[3] || BL, o.first[2] || '');
  const nx = x + w + 50, nw = R.x + R.w - nx - 60; let yy = y;
  (o.notes || []).forEach(([head, col, lines], i) => { const a = SS((t - o.at[i]) / .6); if (a <= 0) return; const h = 84 + lines.reduce((s, l) => s + Math.ceil(l.length * 23 / (nw - 70)) * 32 + 8, 0); card(g, nx, yy, nw, h, head, lines, col, a, false, 23); yy += h + 22; });
}
// 简单可复现的随机数
function mkRng(s) { return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
