from common import *
def ax3(f, rect, el=25, az=-60, lim=1.3, zs=1):
    ax = f.add_axes(rect, projection='3d'); ax.set_axis_off(); ax.set_facecolor('#070A12'); ax.view_init(el, az)
    ax.set_xlim(-lim, lim); ax.set_ylim(-lim, lim); ax.set_zlim(-lim * zs, lim * zs); ax.set_box_aspect((1, 1, zs)); return ax
# fb05 圆的切丛
f = fig(); title(f, '切丛 TM：把所有切空间收集起来', '圆上每点的切线是一条直线；把它们“竖起来”排好，得到圆柱面 S¹ × ℝ —— 圆的切丛是平凡的')
ax = f.add_axes([.03, .1, .42, .72]); clean(ax); ax.set_aspect('equal'); ax.set_xlim(-2.2, 2.2); ax.set_ylim(-2, 2)
t = np.linspace(0, 2 * np.pi, 300); ax.plot(np.cos(t), np.sin(t), color=GOLD, lw=4)
for k in range(12):
    a = k * np.pi / 6; p = np.array([np.cos(a), np.sin(a)]); d = np.array([-np.sin(a), np.cos(a)])
    ax.plot(*np.array([p - .8 * d, p + .8 * d]).T, color=BLUE, lw=1.6, alpha=.75); ax.annotate('', xy=p + .5 * d, xytext=p, arrowprops=dict(arrowstyle='->', color='#fff', lw=2))
ax.text(0, 0, 'S¹', color=GOLD, fontsize=28, ha='center', va='center')
f.text(.48, .47, '⟶', fontsize=60, color=FG2, ha='center')
ax = ax3(f, [.5, .06, .48, .8], el=18, lim=1.25, zs=1.1)
u = np.linspace(0, 2 * np.pi, 120); v = np.linspace(-1.2, 1.2, 10); U, V = np.meshgrid(u, v)
ax.plot_surface(np.cos(U), np.sin(U), V, color=BLUE, alpha=.25, linewidth=0)
for k in range(12):
    a = k * np.pi / 6; ax.plot([np.cos(a)] * 2, [np.sin(a)] * 2, [-1.2, 1.2], color=BLUE, lw=1.6)
    ax.plot([np.cos(a)] * 2, [np.sin(a)] * 2, [0, .6], color='#fff', lw=2.5)
ax.plot(np.cos(u), np.sin(u), 0, color=GOLD, lw=4)
f.text(.74, .1, '每根竖线 = 一个切空间 T_pS¹ ≅ ℝ；白色箭头组成一个处处非零的截面', ha='center', fontsize=16, color=FG2)
save(f, 'fb05_tangent_circle')

# fb06 毛球定理
from orth import Orth, SP, ETH, EPH
f = fig(); title(f, '毛球定理：球面的切丛不平凡', '在球面上“梳头”，总会留下至少一个旋（向量为零的点）；环面则可以梳得处处平顺')
ax = f.add_axes([.04, .14, .42, .7]); ax.set_xlim(-1.35, 1.35); ax.set_ylim(-1.25, 1.35); O = Orth(ax, el=28, az=20); O.sphere()
for t_ in np.linspace(.18, np.pi - .18, 11):
    for p_ in np.linspace(0, 2 * np.pi, int(5 + 20 * np.sin(t_)), endpoint=False):
        O.arrow(SP(t_, p_) * 1.0, ETH(t_, p_), GOLD, L=.17 * np.sin(t_) + .03, lw=2)
O.dot(SP(0, 0), RED, ms=12); O.text(SP(0, 0), '旋（零点）  ', color=RED, fontsize=17, va='bottom', ha='right', bbox=dict(fc='#070A12', ec='none', pad=2))
# 环面：用正方形 + 对边粘合表示
ax = f.add_axes([.56, .2, .36, .6]); clean(ax); ax.set_aspect('equal'); ax.set_xlim(-.15, 1.15); ax.set_ylim(-.15, 1.15)
ax.add_patch(plt.Rectangle((0, 0), 1, 1, color='#16223a'))
for (a, b), c, st in [(((0, 0), (1, 0)), BLUE, '>'), (((0, 1), (1, 1)), BLUE, '>'), (((0, 0), (0, 1)), RED, '>>'), (((1, 0), (1, 1)), RED, '>>')]:
    ax.plot(*np.array([a, b]).T, color=c, lw=4)
for x in np.linspace(.1, .9, 6):
    for y in np.linspace(.1, .9, 6): ax.annotate('', xy=(x + .1, y), xytext=(x - .03, y), arrowprops=dict(arrowstyle='-|>', color=GREEN, lw=2.2, mutation_scale=14))
ax.text(.5, -.1, '蓝边与蓝边粘、红边与红边粘 = 环面', color=FG2, fontsize=15, ha='center')
f.text(.25, .1, '球面 S²：任何连续切向量场都有零点\n（欧拉示性数 χ = 2 ≠ 0）', ha='center', fontsize=18, color=GOLD)
f.text(.74, .1, '环面 T²：全部指向同一方向，处处非零\n（χ = 0，切丛平凡）', ha='center', fontsize=18, color=GREEN)
save(f, 'fb06_hairy_ball')

# fb07 二重覆叠
f = fig(); title(f, '纤维是离散点：覆叠空间也是纤维丛', '上方的闭曲线绕两圈才回到起点，投影到下方的圆；每个点上方的纤维是两个点')
ax = ax3(f, [.05, .02, .9, .86], el=20, az=-70, lim=1.4, zs=.9)
t = np.linspace(0, 4 * np.pi, 800); z = .55 + .28 * np.cos(t / 2)
ax.plot(np.cos(t), np.sin(t), z, color=BLUE, lw=3.5)
ax.plot(np.cos(t), np.sin(t), -0.7 + 0 * t, color=GOLD, lw=4)
for a in [0.6, 2.4, 4.3]:
    z1, z2 = .55 + .28 * np.cos(a / 2), .55 + .28 * np.cos((a + 2 * np.pi) / 2)
    ax.plot([np.cos(a)] * 2, [np.sin(a)] * 2, [-.7, max(z1, z2)], color=FG3, lw=1.2, ls='--')
    ax.scatter([np.cos(a)] * 2, [np.sin(a)] * 2, [z1, z2], color=RED, s=70, depthshade=False)
    ax.scatter([np.cos(a)], [np.sin(a)], [-.7], color=GOLD, s=60, depthshade=False)
ax.text(1.35, 0, .95, 'E：绕两圈的圆', color=BLUE, fontsize=18); ax.text(1.35, 0, -.75, 'B = S¹', color=GOLD, fontsize=18)
f.text(.5, .07, '红点：纤维 = {两个点}。z ↦ z² 的二重覆叠 S¹ → S¹；它和莫比乌斯带的“边”是同一个东西', ha='center', fontsize=17, color=FG2)
save(f, 'fb07_double_cover')

# fb08 圆上的 ℝ² 丛
f = fig(); title(f, '向量丛：纤维是向量空间', '沿着圆，每点挂一个平面 ℝ²（这里是圆在空间中的法平面）。金色箭头是一个截面：沿圆走一圈，它在平面里转了一整圈')
ax = ax3(f, [.05, .02, .9, .86], el=24, az=-60, lim=1.9, zs=.6)
t = np.linspace(0, 2 * np.pi, 300); ax.plot(1.6 * np.cos(t), 1.6 * np.sin(t), 0, color=GOLD, lw=3, alpha=.6)
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
for tt in np.linspace(0, 2 * np.pi, 16, endpoint=False):
    p = np.array([1.6 * np.cos(tt), 1.6 * np.sin(tt), 0]); a = np.array([np.cos(tt), np.sin(tt), 0]); b = np.array([0, 0, 1.])
    s_ = .45; C4 = [p + s_ * (i * a + j * b) for i, j in [(-1, -1), (1, -1), (1, 1), (-1, 1)]]
    ax.add_collection3d(Poly3DCollection([C4], facecolor=(.36, .7, 1, .16), edgecolor=(.36, .7, 1, .7), lw=1))
    v = .4 * (np.cos(tt) * a + np.sin(tt) * b); ax.plot(*np.array([p, p + v]).T, color=GOLD, lw=3.2); ax.scatter(*(p + v), color=GOLD, s=22, depthshade=False)
f.text(.5, .07, '每块蓝色方块代表一个纤维 ≅ ℝ²；结构群 GL(2, ℝ)（保持长度时为 O(2)）', ha='center', fontsize=17, color=FG2)
save(f, 'fb08_plane_bundle')
