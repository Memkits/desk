from common import *
x = np.linspace(0, 2, 800)
# 01 行波叠加 → 驻波
f = fig(); title(f, '两列反向的波叠加，得到驻波', '同样波长、同样振幅，一列向右、一列向左')
for row, (t, lab) in enumerate([(0, 't = 0'), (.125, 't = T/8'), (.25, 't = T/4')]):
    ax = f.add_axes([.06, .64 - row * .27, .88, .2]); clean(ax)
    w = 2 * np.pi; r = np.sin(w * (x - t)); l = np.sin(w * (x + t))
    ax.plot(x, r, color=BLUE, lw=2, alpha=.8, label='向右'); ax.plot(x, l, color=RED, lw=2, alpha=.8, label='向左'); ax.plot(x, r + l, color=GOLD, lw=4, label='叠加')
    ax.axhline(0, color='#2C3854', lw=1); ax.set_ylim(-2.3, 2.3); ax.text(-.04, 1.6, lab, color=FG2, fontsize=16, ha='right')
    for n in np.arange(0, 2.01, .5): ax.plot([n], [0], 'o', color='#fff', ms=7)
    if row == 0: ax.legend(loc='upper right', ncol=3, frameon=False, fontsize=15)
f.text(.5, .05, '白点：波节，永远不动；两节之间的中点：波腹，振幅最大', ha='center', fontsize=17, color=FG2); save(f, 'own_01_superposition')
# 02 一个周期的包络
f = fig(); title(f, '驻波的样子：原地振动，不往前走', '把一个周期里的许多时刻叠在一起')
ax = f.add_axes([.06, .2, .88, .6]); clean(ax)
for t in np.linspace(0, 1, 17): ax.plot(x, 2 * np.sin(2 * np.pi * x) * np.cos(2 * np.pi * t), color=GOLD, alpha=.25 + .6 * abs(np.cos(2 * np.pi * t)) ** 4, lw=2)
for n in np.arange(0, 2.01, .5): ax.plot([n], [0], 'o', color='#fff', ms=9); ax.text(n, -.35, '波节', ha='center', color='#fff', fontsize=14)
for n in np.arange(.25, 2, .5): ax.annotate('', xy=(n, 2.05), xytext=(n, -2.05), arrowprops=dict(arrowstyle='<->', color=GREEN, lw=2)); ax.text(n + .03, 2.1, '波腹', color=GREEN, fontsize=14)
ax.set_ylim(-2.6, 2.6); f.text(.5, .08, 'y(x, t) = 2A · sin(kx) · cos(ωt)　　空间形状 × 时间节奏，两者分开', ha='center', fontsize=20, color=GOLD); save(f, 'own_02_envelope')
# 03 弦的模式
f = fig(); title(f, '两端固定的弦：只能装下整数个半波长', 'L = n · λ/2　→　f_n = n · f_1')
for n in range(1, 6):
    ax = f.add_axes([.12, .74 - (n - 1) * .145, .78, .12]); clean(ax); xs = np.linspace(0, 1, 400)
    for s in [1, .5, -.5, -1]: ax.plot(xs, s * np.sin(n * np.pi * xs), color=GOLD, alpha=.9 if abs(s) == 1 else .35, lw=2.5 if abs(s) == 1 else 1.5)
    ax.plot([0, 1], [0, 0], color='#2C3854'); ax.plot([0, 1], [0, 0], 'o', color='#fff', ms=8); ax.set_ylim(-1.3, 1.3); ax.set_xlim(-.02, 1.02)
    f.text(.04, .79 - (n - 1) * .145, f'n = {n}', fontsize=18, color='#fff'); f.text(.92, .79 - (n - 1) * .145, f'{n} f₁', fontsize=18, color=GOLD)
save(f, 'own_03_string_modes')
# 04 装不下的波
f = fig(); title(f, '为什么频率是离散的', '波长不合适，来回反射的波会互相抵消')
for i, (lam, ok) in enumerate([(2 / 3, True), (.58, False)]):
    ax = f.add_axes([.06, .5 - i * .38, .88, .3]); clean(ax); xs = np.linspace(0, 1, 600); tot = np.zeros_like(xs)
    for k in range(8): ph = k * 2 * 1 / lam * 2 * np.pi; y = np.sin(2 * np.pi * xs / lam + ph) * (.92 ** k); tot += y; ax.plot(xs, y * .5 + 0, color=BLUE, alpha=.18, lw=1)
    ax.plot(xs, tot / 4, color=GOLD if ok else RED, lw=3); ax.set_ylim(-2.2, 2.2)
    ax.text(0, 1.8, f'λ = {lam:.2f} L：' + ('刚好 3 个半波长，每次反射后同相叠加，越叠越强' if ok else '不是整数个半波长，反射回来的波相位错开，互相抵消'), fontsize=17, color=GOLD if ok else RED)
save(f, 'own_04_fit_or_cancel')
