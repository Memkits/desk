from common import *
from scipy.special import jn, jn_zeros
xs = np.linspace(0, 1, 600)
# 05 拨弦的傅里叶分解
def pluck(a): return np.where(xs < a, xs / a, (1 - xs) / (1 - a))
def coef(a, n): return 2 * np.sin(n * np.pi * a) / (n * n * np.pi * np.pi * a * (1 - a))
f = fig(); title(f, '任何振动都是驻波的叠加', '拨弦的初始形状 = 一串模式按不同比例相加（傅里叶分解）')
ax = f.add_axes([.06, .45, .5, .38]); clean(ax); a = .5
ax.plot(xs, pluck(a), color='#fff', lw=3, label='拨弦形状')
acc = np.zeros_like(xs)
for n, col in zip(range(1, 8), [GOLD, BLUE, RED, GREEN, PURP, GOLD, BLUE]):
    c = coef(a, n); acc += c * np.sin(n * np.pi * xs)
    if abs(c) > 1e-6 and n <= 5: ax.plot(xs, c * np.sin(n * np.pi * xs) - .02, color=col, lw=1.5, alpha=.7)
ax.plot(xs, acc, '--', color=GOLD, lw=2, label='前 7 项相加'); ax.legend(frameon=False, loc='upper right', fontsize=14); ax.set_ylim(-.3, 1.15)
for i, (a, lab) in enumerate([(.5, '在中点拨'), (.12, '靠近琴码拨')]):
    ax = f.add_axes([.62, .52 - i * .4, .34, .3]); n = np.arange(1, 16); c = np.abs([coef(a, k) for k in n]); c /= c.max()
    ax.bar(n, c, color=GOLD if i == 0 else BLUE, width=.6); ax.set_title(lab + '：各次谐波的强度', color=FG2, fontsize=15, loc='left'); ax.set_xticks([1, 3, 5, 7, 9, 11, 13, 15]); ax.set_yticks([]); ax.set_ylim(0, 1.1)
    for s in ['top', 'right', 'left']: ax.spines[s].set_visible(False)
f.text(.06, .3, '在中点拨：偶次谐波正好在波节上，完全缺失\n靠近琴码拨：高次谐波更多，声音更"亮"', fontsize=17, color=FG2, linespacing=1.7)
save(f, 'own_05_fourier_pluck')
# 06 管乐器
f = fig(); title(f, '管子里的空气：开口端是位移的波腹', '两端开口：全部谐波　　一端封闭：只有奇次谐波')
for col, (kind, lab, ns) in enumerate([('oo', '两端开口（长笛）', [1, 2, 3]), ('co', '一端封闭（单簧管）', [1, 3, 5])]):
    for r, n in enumerate(ns):
        ax = f.add_axes([.05 + col * .48, .65 - r * .22, .42, .16]); clean(ax)
        ax.add_patch(plt.Rectangle((0, -1), 1, 2, fill=False, ec=FG3, lw=2))
        if kind == 'co': ax.plot([0, 0], [-1, 1], color='#fff', lw=6)
        k = n * np.pi if kind == 'oo' else n * np.pi / 2; d = np.cos(k * xs) if kind == 'oo' else np.sin(k * xs)
        for s in [1, -1]: ax.plot(xs, s * .85 * d, color=GOLD, lw=2.5)
        ax.set_xlim(-.05, 1.05); ax.set_ylim(-1.2, 1.2); ax.text(1.03, 0, f'{n} f₁', color=GOLD, fontsize=17, va='center')
    f.text(.05 + col * .48, .84, lab, fontsize=20, color='#fff')
f.text(.5, .06, '金线：空气分子来回位移的幅度（开口端最大，封闭端为零）', ha='center', fontsize=16, color=FG2); save(f, 'own_06_pipes')
# 07 方板克拉尼图形
f = fig(); title(f, '二维：方板上的节线（克拉尼图形示意）', '沙子会聚到不振动的节线上；图样按 cos(nπx)cos(mπy) ± cos(mπx)cos(nπy) 近似')
g = np.linspace(-1, 1, 500); X, Y = np.meshgrid(g, g)
for i, (n, m, s) in enumerate([(1, 2, 1), (1, 3, -1), (2, 3, 1), (1, 4, 1), (2, 4, -1), (3, 5, 1), (1, 5, -1), (2, 5, 1)]):
    ax = f.add_axes([.04 + (i % 4) * .24, .45 - (i // 4) * .4, .2, .36]); clean(ax)
    Z = np.cos(n * np.pi * X / 2) * np.cos(m * np.pi * Y / 2) + s * np.cos(m * np.pi * X / 2) * np.cos(n * np.pi * Y / 2)
    ax.imshow(np.exp(-(Z / .08) ** 2), cmap='gray', vmin=0, vmax=1, extent=[-1, 1, -1, 1]); ax.set_aspect('equal'); ax.set_title(f'({n},{m}) {"+" if s > 0 else "−"}', color=FG3, fontsize=13)
save(f, 'own_07_chladni_square')
# 08 圆膜
f = fig(); title(f, '圆形鼓膜的模式', '贝塞尔函数 J_m(kr)·cos(mθ)；下方数字是相对于基频的频率')
z1 = jn_zeros(0, 1)[0]; r = np.linspace(0, 1, 300); th = np.linspace(0, 2 * np.pi, 400); R, TH = np.meshgrid(r, th)
modes = [(0, 1), (1, 1), (2, 1), (0, 2), (3, 1), (1, 2), (4, 1), (2, 2)]
for i, (m, n) in enumerate(modes):
    k = jn_zeros(m, n)[-1]; Z = jn(m, k * R) * np.cos(m * TH)
    ax = f.add_axes([.04 + (i % 4) * .24, .45 - (i // 4) * .4, .2, .36], projection='polar'); ax.set_facecolor('#070A12')
    ax.pcolormesh(TH, R, Z, cmap='RdBu_r', shading='auto', vmin=-abs(Z).max(), vmax=abs(Z).max()); ax.set_xticks([]); ax.set_yticks([]); ax.spines['polar'].set_color(FG3)
    ax.set_title(f'({m},{n})  {k / z1:.2f}', color=GOLD, fontsize=16, pad=8)
f.text(.5, .04, '红蓝表示同一时刻向上和向下；交界处是节线（圆和直径）', ha='center', fontsize=16, color=FG2); save(f, 'own_08_drum_modes')
# 09 泛音比较
f = fig(); title(f, '为什么吉他有音高，而鼓"听不出音"', '弦的泛音是整数倍；圆膜的泛音不是')
ax = f.add_axes([.08, .2, .86, .6]); ax.set_yticks([.3, .7]); ax.set_yticklabels(['圆鼓膜', '弦'], fontsize=18)
ax.vlines(np.arange(1, 7), .58, .82, color=GOLD, lw=4)
dr = sorted([jn_zeros(m, n)[-1] / z1 for m in range(6) for n in range(1, 4)])[:12]
ax.vlines(dr, .18, .42, color=BLUE, lw=4); [ax.text(d, .12, f'{d:.2f}', ha='center', fontsize=12, color=BLUE) for d in dr[:9]]
ax.set_xlim(.5, 6.5); ax.set_ylim(0, 1); ax.set_xlabel('频率 ÷ 基频'); [ax.spines[s].set_visible(False) for s in ['top', 'right']]
save(f, 'own_09_overtone_ratios')
