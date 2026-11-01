from common import *
import matplotlib.patches
from orth import Orth, SP, ETH, EPH
# fb13 粘合函数与陈数
f = fig(); title(f, '粘合函数：球面上的复线丛由一个整数决定', '北、南半球上各是平凡丛 D × ℂ；沿赤道用 g(φ) = e^{inφ} 粘起来。g 绕单位圆的圈数 n 就是第一陈数 c₁')
ax = f.add_axes([.02, .12, .4, .7]); ax.set_xlim(-1.3, 1.3); ax.set_ylim(-1.3, 1.3); O = Orth(ax, el=22, az=20)
t = np.linspace(0, 2 * np.pi, 200); ax.add_patch(plt.Circle((0, 0), 1, color='#16223a'))
# 上下半球着色：用投影后的赤道分割
eq = np.array([SP(np.pi / 2, p) for p in t]); x, y, d = O.P(eq)
O.curve(eq, GOLD, 4); ax.plot(np.cos(t), np.sin(t), color='#2C3854', lw=1.5)
ax.text(0, .55, 'U_N：北半球\nD × ℂ', color=BLUE, fontsize=18, ha='center'); ax.text(0, -.7, 'U_S：南半球\nD × ℂ', color=PURP, fontsize=18, ha='center')
ax.text(1.05, .05, '赤道', color=GOLD, fontsize=16)
for j, n in enumerate([0, 1, 2]):
    ax = f.add_axes([.44 + j * .18, .25, .17, .5]); clean(ax); ax.set_aspect('equal'); ax.set_xlim(-1.5, 1.5); ax.set_ylim(-1.8, 1.5)
    ax.plot(np.cos(t), np.sin(t), color=GOLD, lw=2.5)
    for p in np.linspace(0, 2 * np.pi, 16, endpoint=False):
        c = np.array([np.cos(p), np.sin(p)]); a = n * p; dv = .32 * np.array([np.cos(a), np.sin(a)])
        ax.annotate('', xy=c + dv, xytext=c, arrowprops=dict(arrowstyle='-|>', color=[FG2, RED, GREEN][j], lw=2, mutation_scale=12))
    ax.text(0, -1.65, f'n = {n}', color=[FG2, RED, GREEN][j], fontsize=22, ha='center')
f.text(.71, .2, '赤道上每点画出 g(φ) 的相位：箭头转了 n 圈', color=FG2, fontsize=16, ha='center')
f.text(.71, .12, 'n = 0：平凡丛 S² × ℂ　　|n| = 1：霍普夫丛对应的线丛　　|n| = 2：S² 的切丛（看成复线丛）', color=FG3, fontsize=14, ha='center')
save(f, 'fb13_clutching')

# fb14 磁单极与狄拉克弦
f = fig(); title(f, '磁单极：电磁势只能分片写，拼起来是一个非平凡 U(1) 丛', '如果硬要用一个矢势 A 覆盖全空间，必然出现一条奇异的“狄拉克弦”；分两片写就没有弦，代价是转移函数非平凡')
for j in range(2):
    ax = f.add_axes([.03 + j * .48, .1, .44, .74]); clean(ax); ax.set_aspect('equal'); ax.set_xlim(-2.2, 2.2); ax.set_ylim(-2.2, 2.2)
    for a in np.linspace(0, 2 * np.pi, 24, endpoint=False):
        ax.annotate('', xy=(2 * np.cos(a), 2 * np.sin(a)), xytext=(.25 * np.cos(a), .25 * np.sin(a)), arrowprops=dict(arrowstyle='-|>', color=BLUE, lw=1.3, alpha=.7, mutation_scale=12))
    ax.plot(0, 0, 'o', color=GOLD, ms=18); ax.text(.15, .2, 'g', color=GOLD, fontsize=22)
    if j == 0:
        ax.plot([0, 0], [0, -2.2], color=RED, lw=5, ls=(0, (4, 2))); ax.text(.12, -1.9, '狄拉克弦\n（A 在这里发散）', color=RED, fontsize=16, bbox=dict(fc='#070A12', ec='none', pad=3, alpha=.85))
        ax.text(0, 2.05, '一个矢势：A = g(1 − cos θ)/(r sin θ) · φ̂', color=FG2, fontsize=15, ha='center', bbox=dict(fc='#070A12', ec='none', pad=3, alpha=.85))
    else:
        ax.add_patch(matplotlib.patches.Wedge((0, 0), 2.1, -20, 200, color=BLUE, alpha=.08)); ax.add_patch(matplotlib.patches.Wedge((0, 0), 2.1, 160, 380, color=PURP, alpha=.08))
        ax.text(0, 1.6, 'U_N：A_N = g(1 − cos θ)/(r sin θ) φ̂', color=BLUE, fontsize=14, ha='center', bbox=dict(fc='#070A12', ec='none', pad=3, alpha=.85))
        ax.text(0, -1.75, 'U_S：A_S = −g(1 + cos θ)/(r sin θ) φ̂', color=PURP, fontsize=14, ha='center', bbox=dict(fc='#070A12', ec='none', pad=3, alpha=.85))
        ax.plot([-2.1, 2.1], [0, 0], color=GOLD, lw=1.5, ls='--'); ax.text(.55, .12, '重叠区：A_N − A_S = ∇(2gφ)', color=GOLD, fontsize=13, bbox=dict(fc='#070A12', ec='none', pad=3, alpha=.85))
f.text(.5, .05, '转移函数 e^{i(2eg/ħ)φ} 在赤道上必须单值 → 2eg/ħ 是整数：狄拉克量子化条件 = 陈数是整数', ha='center', fontsize=17, color=FG2)
save(f, 'fb14_monopole')

# fb15 贝里相位
f = fig(); title(f, '贝里相位：参数空间里的和乐', '自旋 ½ 跟着磁场方向缓慢绕一个闭合回路，回来时多出相位 γ = −Ω/2（Ω 是回路张成的立体角）')
ax = f.add_axes([.04, .08, .5, .78]); ax.set_xlim(-1.35, 1.35); ax.set_ylim(-1.2, 1.4); O = Orth(ax, el=25, az=30); O.sphere()
th0 = .75; loop = np.array([SP(th0, p) for p in np.linspace(0, 2 * np.pi, 200)])
cap = [SP(t, p) for t in np.linspace(0, th0, 12) for p in np.linspace(0, 2 * np.pi, 60)]
x, y, d = O.P(loop); ax.fill(x, y, color=GOLD, alpha=.2, zorder=3); O.curve(loop, GOLD, 4)
for p in np.linspace(0, 2 * np.pi, 8, endpoint=False):
    q = SP(th0, p); x0, y0, _ = O.P(np.zeros(3)); x1, y1, d1 = O.P(q)
    ax.plot([x0, x1], [y0, y1], color=RED, lw=1.4, alpha=.5 if d1 < 0 else .9, zorder=4)
O.arrow(np.zeros(3) + 1e-6, SP(th0, 0.5), RED, L=1.0, lw=3.5)
ax.text(-.05, .3, 'Ω', color=GOLD, fontsize=30, ha='center')
f.text(.58, .7, '底空间：磁场方向组成的球面 S²', color=FG2, fontsize=19)
f.text(.58, .62, '纤维：量子态的相位 U(1)', color=FG2, fontsize=19)
f.text(.58, .54, '联络：贝里联络 A = i⟨ψ|∇ψ⟩', color=FG2, fontsize=19)
f.text(.58, .46, '曲率：贝里曲率（像单极子的磁场）', color=FG2, fontsize=19)
f.text(.58, .34, 'γ = ∮ A = ∬ F = −Ω / 2', color=GOLD, fontsize=28)
f.text(.58, .24, '整个球面积分：∬ F / 2π = 1 → 陈数 1，\n就是霍普夫丛', color=FG3, fontsize=17)
save(f, 'fb15_berry')

# fb16 AB 效应
f = fig(); title(f, '阿哈罗诺夫–玻姆效应：没有磁场的地方，和乐依然存在', '电子绕过一根细长螺线管的两侧，路径上 B = 0，但干涉条纹移动 Δφ = eΦ/ħ')
ax = f.add_axes([.04, .08, .92, .78]); clean(ax); ax.set_aspect('equal'); ax.set_xlim(0, 16); ax.set_ylim(0, 8)
ax.plot(1.5, 4, 'o', color=GOLD, ms=16); ax.text(1.5, 3.2, '电子源', color=GOLD, fontsize=17, ha='center')
ax.add_patch(plt.Circle((7, 4), .55, color=PURP, alpha=.35)); ax.add_patch(plt.Circle((7, 4), .55, fill=False, ec=PURP, lw=2))
for a in np.linspace(0, 2 * np.pi, 8, endpoint=False): ax.plot(7 + .25 * np.cos(a), 4 + .25 * np.sin(a), 'x', color=PURP, ms=6)
ax.text(7, 4.9, '螺线管（磁通 Φ）', color=PURP, fontsize=16, ha='center')
xs = np.linspace(1.5, 13, 200)
for s, c, lab in [(1, BLUE, '路径 1'), (-1, RED, '路径 2')]:
    ys = 4 + s * 2.2 * np.sin(np.pi * (xs - 1.5) / 11.5); ax.plot(xs, ys, color=c, lw=3.5); ax.text(7, 4 + s * 2.6, lab, color=c, fontsize=17, ha='center')
ax.plot([13, 13], [1, 7], color=FG2, lw=5); ax.text(13.3, 7.1, '屏幕', color=FG2, fontsize=16)
yy = np.linspace(1, 7, 300); ax.fill_betweenx(yy, 13.2, 13.2 + .9 * np.cos(3 * (yy - 4) + 1.2) ** 2, color=GREEN, alpha=.7)
ax.text(8, .5, '两条路径的相位差 = e/ħ ∮ A·dl = eΦ/ħ　——　平坦联络（F = 0）在不单连通区域上的非平凡和乐', color=FG2, fontsize=16, ha='center')
save(f, 'fb16_aharonov_bohm')

# fb17 标架丛
f = fig(); title(f, '主丛：纤维是一个群', '在曲面上每点放一个正交标架（两根垂直箭头）。同一点上所有标架互相差一个旋转 → 纤维 ≅ SO(2) ≅ S¹：这就是标架丛')
ax = f.add_axes([.03, .1, .56, .76]); clean(ax); ax.set_aspect('equal'); ax.set_xlim(-.3, 6.3); ax.set_ylim(-.3, 4.3)
for k in np.linspace(0, 6, 9): ax.plot(k + .25 * np.sin(np.linspace(0, 4, 50)), np.linspace(0, 4, 50), color='#25324e', lw=1)
for k in np.linspace(0, 4, 7): ax.plot(np.linspace(0, 6, 50), k + .2 * np.sin(np.linspace(0, 6, 50)), color='#25324e', lw=1)
rng = np.random.default_rng(2)
for x in np.linspace(.6, 5.4, 5):
    for y in np.linspace(.6, 3.4, 4):
        if abs(x - 3) < .5 and abs(y - 2.47) < .5: continue
        a = .4 * np.sin(x * .8 + y); e1 = .38 * np.array([np.cos(a), np.sin(a)]); e2 = .38 * np.array([-np.sin(a), np.cos(a)])
        ax.annotate('', xy=(x, y) + e1, xytext=(x, y), arrowprops=dict(arrowstyle='-|>', color=RED, lw=2, mutation_scale=12))
        ax.annotate('', xy=(x, y) + e2, xytext=(x, y), arrowprops=dict(arrowstyle='-|>', color=BLUE, lw=2, mutation_scale=12))
x, y = 3.0, 2.47; ax.add_patch(plt.Circle((x, y), .62, fill=False, ec=GOLD, lw=2, ls='--'))
for a in np.linspace(0, 2 * np.pi, 10, endpoint=False):
    ax.annotate('', xy=(x + .55 * np.cos(a), y + .55 * np.sin(a)), xytext=(x, y), arrowprops=dict(arrowstyle='-|>', color=GOLD, lw=1.4, alpha=.8, mutation_scale=10))
ax.text(x, y - .95, '这一点上的全部标架\n= 一个圆 S¹', color=GOLD, fontsize=15, ha='center', bbox=dict(fc='#070A12', ec='none', pad=3, alpha=.85))
f.text(.62, .72, '向量丛 E', color=BLUE, fontsize=22); f.text(.62, .66, '纤维：向量空间 ℝⁿ、ℂⁿ', color=FG2, fontsize=17)
f.text(.62, .56, '主 G 丛 P', color=RED, fontsize=22); f.text(.62, .5, '纤维：群 G 本身，G 从右边作用', color=FG2, fontsize=17)
f.text(.62, .38, '两者可以互相构造：', color=FG2, fontsize=18)
f.text(.62, .31, '· 向量丛 → 它的标架丛（主 GL(n) 丛）', color=FG2, fontsize=17)
f.text(.62, .25, '· 主丛 P + 表示 V → 伴随丛 P ×_G V', color=FG2, fontsize=17)
f.text(.62, .1, '规范理论里：主丛上的联络 = 规范场；\n伴随丛的截面 = 物质场', color=GOLD, fontsize=17, linespacing=1.5)
save(f, 'fb17_frame_bundle')

# fb18 概念地图
f = fig(); title(f, '概念地图', '从定义出发，几条主要的路')
ax = f.add_axes([.03, .04, .94, .82]); clean(ax); ax.set_xlim(0, 16); ax.set_ylim(0, 9)
def box(x, y, t, c, w=2.8, h=.9, fs=16):
    ax.add_patch(plt.Rectangle((x - w / 2, y - h / 2), w, h, fc='#0E1424', ec=c, lw=2)); ax.text(x, y, t, color=c, fontsize=fs, ha='center', va='center')
def ar(a, b, c=FG3): ax.annotate('', xy=b, xytext=a, arrowprops=dict(arrowstyle='-|>', color=c, lw=1.6, mutation_scale=14))
box(8, 8, '纤维丛  F → E → B\n局部 ≅ U × F', GOLD, w=4.2, h=1.1, fs=18)
box(2.2, 6.1, '覆叠空间\n纤维：离散点', FG2); box(6, 6.1, '向量丛\n纤维：ℝⁿ / ℂⁿ', BLUE); box(10, 6.1, '主 G 丛\n纤维：群 G', RED); box(13.8, 6.1, '转移函数 gᵢⱼ\n结构群 G', GREEN)
for x in (2.2, 6, 10, 13.8): ar((8, 7.4), (x, 6.6))
box(4.4, 4.1, '切丛 · 法丛\n线丛 · 莫比乌斯带', BLUE, w=3.2); box(7.8, 4.1, '截面\n（场）', BLUE, w=2.2); box(11.4, 4.1, '标架丛 · 霍普夫丛\nU(1)、SU(2) 丛', RED, w=3.4)
ar((6, 5.6), (4.4, 4.6)); ar((6, 5.6), (7.8, 4.6)); ar((10, 5.6), (11.4, 4.6)); ar((10, 5.6), (7.8, 4.6), FG3)
box(4, 2.1, '联络\n平行移动', PURP, w=2.6); box(8, 2.1, '曲率\n和乐', PURP, w=2.6); box(12, 2.1, '示性类\n陈数 · 欧拉数', PURP, w=3)
ar((5.3, 2.1), (6.7, 2.1), PURP); ar((9.3, 2.1), (10.5, 2.1), PURP); ar((4.4, 3.6), (4, 2.6)); ar((11.4, 3.6), (4.4, 2.6), FG3)
ax.text(8, .7, '物理对应：联络 = 规范势 A　曲率 = 场强 F　陈数 = 磁荷 / 拓扑量子数　和乐 = AB 相位、贝里相位', color=GOLD, fontsize=16, ha='center')
save(f, 'fb18_concept_map')
