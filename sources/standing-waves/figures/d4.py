from common import *
from scipy.special import sph_harm_y as SH
def Yr(l, m, th, ph):   # 实球谐；th 极角，ph 方位角
    if m == 0: return np.real(SH(l, 0, th, ph))
    return np.sqrt(2) * (-1) ** m * (np.real(SH(l, abs(m), th, ph)) if m > 0 else np.imag(SH(l, abs(m), th, ph)))
th = np.linspace(0, np.pi, 160); ph = np.linspace(0, 2 * np.pi, 320); PH, TH = np.meshgrid(ph, th)
def sphere(ax, Z, amp, cmap='RdBu_r', light=True):
    r = 1 + amp * Z / np.abs(Z).max(); X, Y, W = r * np.sin(TH) * np.cos(PH), r * np.sin(TH) * np.sin(PH), r * np.cos(TH)
    c = plt.get_cmap(cmap)((Z / np.abs(Z).max() + 1) / 2); ax.plot_surface(X, Y, W, facecolors=c, rstride=2, cstride=2, linewidth=0, antialiased=False, shade=light)
    ax.set_box_aspect((1, 1, 1)); ax.set_axis_off(); lim = 1 + amp; ax.set_xlim(-lim, lim); ax.set_ylim(-lim, lim); ax.set_zlim(-lim, lim); ax.set_facecolor('#070A12')
# 19 地球自由振荡
f = fig(); title(f, '大地震后，整个地球像钟一样振动', '球形振荡（示意，振幅极度夸大）；最慢的 ₀S₂ 周期约 54 分钟')
for i, (l, lab) in enumerate([(2, '₀S₂ · 约 54 分钟\n"橄榄球"模式'), (3, '₀S₃ · 约 36 分钟'), (4, '₀S₄ · 约 26 分钟')]):
    ax = f.add_axes([.02 + i * .33, .14, .3, .66], projection='3d'); sphere(ax, Yr(l, 0, TH, PH), .3); ax.view_init(15, 30); f.text(.17 + i * .33, .12, lab, ha='center', fontsize=17, color=GOLD)
save(f, 'own_19_earth_modes')
# 20 太阳 p 模式
f = fig(); title(f, '太阳表面的振荡：无数驻波叠加', '左：单个模式 l = 20, m = 16（示意）；右：许多模式叠加后的"5 分钟振荡"')
ax = f.add_axes([.02, .08, .46, .78], projection='3d'); sphere(ax, Yr(20, 16, TH, PH), .0, 'RdBu_r'); ax.view_init(20, 20)
ax = f.add_axes([.5, .08, .46, .78], projection='3d'); rng = np.random.default_rng(3); Z = sum(rng.normal() * Yr(l, m, TH, PH) for l in range(10, 28, 3) for m in range(-l, l + 1, 5)); sphere(ax, Z, 0, 'inferno'); ax.view_init(20, 20)
save(f, 'own_20_sun_modes')
# 21 球谐函数画廊
f = fig(); title(f, '球面上的驻波：球谐函数', '原子轨道的角度形状、地球和恒星的振荡模式，用的是同一套形状')
k = 0
for l in range(4):
    for j, m in enumerate(range(0, l + 1)):
        ax = f.add_axes([.02 + j * .22, .64 - l * .2, .2, .24], projection='3d'); sphere(ax, Yr(l, m, TH, PH), 0); ax.view_init(25, 35); ax.dist = 6.2
        f.text(.12 + j * .22, .645 - l * .2, f'l={l}, m={m}', ha='center', fontsize=13, color=FG2)
f.text(.93, .7, 's', fontsize=26, color=GOLD); f.text(.93, .51, 'p', fontsize=26, color=GOLD); f.text(.93, .32, 'd', fontsize=26, color=GOLD); f.text(.93, .13, 'f', fontsize=26, color=GOLD)
save(f, 'own_21_spherical_harmonics')
# 22 德布罗意圆轨道
f = fig(); title(f, '德布罗意：电子的波要在轨道上首尾相接', '周长 = n × 波长，否则绕一圈后自己抵消')
for i, (n, ok) in enumerate([(3, True), (4, True), (5, True), (3.5, False)]):
    ax = f.add_axes([.02 + i * .245, .2, .22, .6]); clean(ax); t = np.linspace(0, 2 * np.pi, 800); ax.plot(np.cos(t), np.sin(t), color=FG3, lw=1, ls='--')
    r = 1 + .18 * np.sin(n * t); ax.plot(r * np.cos(t), r * np.sin(t), color=GOLD if ok else RED, lw=3); ax.plot([0], [0], 'o', color=BLUE, ms=12)
    ax.set_aspect('equal'); ax.set_xlim(-1.3, 1.3); ax.set_ylim(-1.3, 1.3); ax.set_title(f'n = {n}' + ('' if ok else '：接不上'), color=GOLD if ok else RED, fontsize=19)
save(f, 'own_22_de_broglie')
# 23 盒子里的粒子
f = fig(); title(f, '盒子里的粒子：量子力学里的弦', 'ψ_n = sin(nπx/L)　　能量 E_n ∝ n²')
ax = f.add_axes([.12, .1, .8, .74]); clean(ax); x = np.linspace(0, 1, 400)
for n in range(1, 5):
    E = n * n; ax.axhline(E, color=FG3, lw=1, ls=':'); ax.plot(x, E + 1.1 * np.sin(n * np.pi * x), color=GOLD, lw=2.5); ax.fill_between(x, E, E + 1.1 * np.sin(n * np.pi * x) ** 2, color=BLUE, alpha=.35); ax.text(-.06, E, f'n={n}', ha='right', va='center', fontsize=16)
ax.plot([0, 0], [0, 18], color='#fff', lw=4); ax.plot([1, 1], [0, 18], color='#fff', lw=4); ax.text(1.04, 16, '金：波函数\n蓝：出现概率', fontsize=15, color=FG2); save(f, 'own_23_particle_in_box')
# 24 量子点
f = fig(); title(f, '量子点：盒子越小，颜色越蓝', '能级间隔 ∝ 1/L²：同一种材料，只改变颗粒大小就能改变发光颜色')
ax = f.add_axes([.05, .2, .9, .6]); clean(ax)
for i, (d, col, nm) in enumerate([(2.2, '#3f6bff', 470), (2.8, '#2fd07a', 520), (3.4, '#ffe14a', 570), (4.2, '#ff9a3c', 600), (5.4, '#ff4a3a', 630)]):
    ax.add_patch(plt.Circle((i * 2.2, 0), d / 6, color=col)); ax.text(i * 2.2, -1.25, f'直径约 {d} nm\n发光约 {nm} nm', ha='center', fontsize=15, color=FG2)
ax.set_xlim(-1.2, 10); ax.set_ylim(-1.8, 1.2); ax.set_aspect('equal'); f.text(.05, .1, '数值为 CdSe 量子点的典型量级，示意', fontsize=14, color=FG3); save(f, 'own_24_quantum_dots')
# 25 宇宙声学峰的原理
f = fig(); title(f, '宇宙最早的声音：被"冻结"的驻波', '早期宇宙里光子与物质组成的等离子体中有声波；38 万年时光子脱耦，各种波长的振荡停在不同相位')
ax = f.add_axes([.08, .5, .86, .32]); t = np.linspace(0, 1, 500)
for i, (k, col) in enumerate([(1, GOLD), (2, BLUE), (3, RED)]): ax.plot(t, np.cos(np.pi * k * t), color=col, lw=3, label=f'第 {k} 个峰对应的波长')
ax.axvline(1, color='#fff', lw=2); ax.text(1.01, .8, '脱耦\n（约 38 万年）', fontsize=14); ax.set_xticks([]); ax.set_yticks([0]); ax.set_ylabel('压缩 ↔ 稀疏'); ax.legend(frameon=False, loc='lower left', fontsize=13); [ax.spines[s].set_visible(False) for s in ['top', 'right']]
ax = f.add_axes([.08, .1, .86, .3]); l = np.linspace(2, 2500, 1500); D = 900 * (1 - np.exp(-l / 60)) + sum(a * np.exp(-((l - c) / w) ** 2) for a, c, w in [(4800, 220, 110), (1700, 540, 110), (1700, 810, 120), (700, 1120, 130), (450, 1430, 140)]); D *= np.exp(-(l / 2600) ** 2)
ax.plot(l, D, color=GOLD, lw=2.5); ax.set_xlabel('角尺度（多极矩 l）→ 越往右越小'); ax.set_yticks([]); [ax.text(c, D[np.argmin(abs(l - c))] + 250, str(c), ha='center', fontsize=12, color=FG2) for c in (220, 540, 810)]; ax.set_title('示意功率谱：峰的位置对应"刚好在脱耦时达到最大压缩或稀疏"的波长', fontsize=14, color=FG2, loc='left'); [ax.spines[s].set_visible(False) for s in ['top', 'right']]
save(f, 'own_25_cmb_acoustic')
# 26 桥梁振型
f = fig(); title(f, '桥梁的振型', '弯曲模式与扭转模式；塔科马海峡大桥最终毁于扭转方向的气动颤振（不是简单的共振）')
x = np.linspace(0, 1, 300)
for i, (lab, fn) in enumerate([('第一弯曲模式', lambda x: np.sin(np.pi * x)), ('第二弯曲模式', lambda x: np.sin(2 * np.pi * x))]):
    ax = f.add_axes([.06, .58 - i * .25, .4, .18]); clean(ax)
    for s, al in [(1, .9), (-1, .3)]: ax.plot(x, s * .6 * fn(x), color=GOLD, lw=4, alpha=al)
    ax.plot([0, 1], [0, 0], color=FG3, ls='--'); ax.set_ylim(-1, 1); ax.set_title(lab, color=FG2, loc='left', fontsize=15)
ax = f.add_axes([.5, .12, .46, .72], projection='3d'); X = np.linspace(0, 10, 60); Wd = np.linspace(-.6, .6, 6); XX, WW = np.meshgrid(X, Wd); ang = .5 * np.sin(np.pi * XX / 5)
ax.plot_surface(XX, WW * np.cos(ang), WW * np.sin(ang), color='#ffd27a', alpha=.9, linewidth=0); ax.set_box_aspect((5, 1, .8)); ax.set_axis_off(); ax.view_init(25, -60); ax.set_title('扭转模式（中间节线不动）', color=FG2, fontsize=15)
save(f, 'own_26_bridge_modes')
# 27 吉他泛音
f = fig(); title(f, '吉他的"泛音"技巧：轻触波节', '手指轻放在弦长一半处：所有在这里不是波节的模式都被压制，只剩偶次谐波 → 高八度')
x = np.linspace(0, 1, 500)
for i, n in enumerate([1, 2, 3, 4]):
    ax = f.add_axes([.08, .7 - i * .17, .84, .13]); clean(ax); ok = n % 2 == 0
    ax.plot(x, .8 * np.sin(n * np.pi * x), color=GOLD if ok else FG3, lw=3, alpha=1 if ok else .5); ax.plot(x, -.8 * np.sin(n * np.pi * x), color=GOLD if ok else FG3, lw=1.5, alpha=.4)
    ax.axvline(.5, color=RED, lw=2); ax.set_ylim(-1, 1); ax.text(1.02, 0, f'{n} f₁ ' + ('保留' if ok else '被压制'), color=GOLD if ok else FG3, fontsize=16, va='center')
f.text(.5, .07, '红线：手指轻触的位置（弦长的一半，也就是第 12 品）', ha='center', fontsize=16, color=RED); save(f, 'own_27_guitar_harmonic')
