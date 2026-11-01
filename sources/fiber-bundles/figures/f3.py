from common import *
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
import matplotlib.colors as mc
def ax3(f, rect, el=25, az=-60, lim=1.3, zs=1):
    ax = f.add_axes(rect, projection='3d'); ax.set_axis_off(); ax.set_facecolor('#070A12'); ax.view_init(el, az)
    ax.set_xlim(-lim, lim); ax.set_ylim(-lim, lim); ax.set_zlim(-lim * zs, lim * zs); ax.set_box_aspect((1, 1, zs)); return ax
def hopf_fiber(th, ph, n=300):
    psi = np.linspace(0, 2 * np.pi, n)
    z1 = np.cos(th / 2) * np.exp(1j * psi); z2 = np.sin(th / 2) * np.exp(1j * (psi + ph))
    x1, x2, x3, x4 = z1.real, z1.imag, z2.real, z2.imag
    d = 1 - x4; return x1 / d, x2 / d, x3 / d
# fb09 霍普夫纤维化
f = fig(); title(f, '霍普夫纤维化：S¹ → S³ → S²', '三维球面 S³ 被分成无数个圆（纤维），每个圆对应二维球面上的一个点；立体投影到 ℝ³ 后，任意两个圆都环环相扣')
from orth import Orth, SP, ETH, EPH
ax = ax3(f, [.0, .02, .7, .86], el=30, az=-55, lim=1.9, zs=.8)
cm = plt.get_cmap('turbo'); LAT = [(.55, 10), (1.05, 14), (1.5, 18)]
for i, (th, n) in enumerate(LAT):
    for k, ph in enumerate(np.linspace(0, 2 * np.pi, n, endpoint=False)):
        x, y, z = hopf_fiber(th, ph); ax.plot(x, y, z, color=cm(ph / (2 * np.pi) * .85 + .07), lw=[2.6, 1.9, 1.4][i], alpha=[1, .8, .6][i])
ax2 = f.add_axes([.71, .3, .26, .46]); ax2.set_xlim(-1.2, 1.2); ax2.set_ylim(-1.2, 1.2); O = Orth(ax2, el=25, az=10); O.sphere()
for i, (t, n) in enumerate(LAT):
    for p in np.linspace(0, 2 * np.pi, n, endpoint=False): O.dot(SP(t, p), cm(p / (2 * np.pi) * .85 + .07), ms=[9, 7, 6][i])
f.text(.84, .22, '底空间 S²：同色的点\n对应左边同色的圆', ha='center', fontsize=16, color=FG2)
f.text(.36, .06, '同一纬度上的点 → 纤维铺成一个环面；三个纬度 → 三层嵌套的环面', ha='center', fontsize=16, color=FG2)
save(f, 'fb09_hopf')

# fb10 两根霍普夫纤维相扣
f = fig(); title(f, '任意两根纤维都是相扣的圆', '这就是为什么 S³ 不是 S² × S¹：乘积空间里的两根纤维可以分开，霍普夫丛里不行（陈数 = 1）')
for j, (pairs, lab) in enumerate([([(1.2, 0), (1.2, 2.5)], '两根纤维：一个链环'), ([(1.57, a) for a in np.linspace(0, 2 * np.pi, 7, endpoint=False)], '同一纬度的七根：缠成一个环面')]):
    ax = ax3(f, [.02 + j * .49, .1, .47, .76], el=30, az=-50, lim=1.9, zs=.9)
    for k, (t, p) in enumerate(pairs):
        x, y, z = hopf_fiber(t, p); ax.plot(x, y, z, color=[RED, BLUE, GOLD, GREEN, PURP, '#ff9d5c', '#e9eef7'][k], lw=3.5)
    f.text(.25 + j * .49, .1, lab, ha='center', fontsize=19, color=FG2)
save(f, 'fb10_hopf_linked')

# fb11 球面上的平行移动
f = fig(); title(f, '平行移动与和乐：绕一圈回来，向量转了', '沿球面三角形（北极 → 赤道 → 沿赤道走 90° → 回北极）平行移动一个切向量，回来时转了 90°，正好等于三角形面积 ÷ R²')
ax = f.add_axes([.04, .06, .55, .8]); ax.set_xlim(-1.3, 1.3); ax.set_ylim(-1.2, 1.3); O = Orth(ax, el=35, az=-125); O.sphere()
oc = np.linspace(0, np.pi / 2, 60)
tri = np.array([SP(t, 0) for t in oc] + [SP(np.pi / 2, p) for p in oc] + [SP(t, np.pi / 2) for t in oc[::-1]])
x, y, d = O.P(tri); ax.fill(x, y, color=GOLD, alpha=.12, zorder=3); O.curve(tri, GOLD, 4)
for t in [0.0, .45, .9, 1.3]: O.arrow(SP(t, 0), ETH(t, 0) if t > 0 else np.array([1., 0, 0]), RED, L=.3, lw=3)
for p in [.45, .9, 1.25]: O.arrow(SP(np.pi / 2, p), ETH(np.pi / 2, p), RED, L=.3, lw=3)
for t in [1.3, .9, .45]: O.arrow(SP(t, np.pi / 2), ETH(t, np.pi / 2), RED, L=.3, lw=3)
O.arrow(SP(0, 0), np.array([0, 1., 0]), BLUE, L=.38, lw=3.5)
O.text(SP(0, 0) * 1.12, '北极', color=FG2, fontsize=16, ha='right')
O.text(SP(np.pi / 2, np.pi / 4) * 1.08, '赤道', color=FG2, fontsize=15, ha='center', va='top')
ax = f.add_axes([.63, .2, .33, .55]); clean(ax); ax.set_aspect('equal'); ax.set_xlim(-1.4, 1.4); ax.set_ylim(-1.4, 1.4)
ax.annotate('', xy=(1, 0), xytext=(0, 0), arrowprops=dict(arrowstyle='-|>', color=RED, lw=4, mutation_scale=30))
ax.annotate('', xy=(0, 1), xytext=(0, 0), arrowprops=dict(arrowstyle='-|>', color=BLUE, lw=4, mutation_scale=30))
a = np.linspace(0, np.pi / 2, 50); ax.plot(.55 * np.cos(a), .55 * np.sin(a), color=GOLD, lw=2.5); ax.text(.55, .55, '90°', color=GOLD, fontsize=22)
ax.text(1.05, -.25, '出发时', color=RED, fontsize=17); ax.text(.08, 1.12, '回来时', color=BLUE, fontsize=17)
ax.text(0, -1.15, '转角 = ∬ K dA = (4π/8) = π/2', color=FG2, fontsize=17, ha='center')
save(f, 'fb11_holonomy_sphere')

# fb12 联络：水平提升
f = fig(); title(f, '联络：规定“水平方向”，就能把底空间的路径提升上去', '丛 = 圆柱面（底空间 S¹，纤维 ℝ）。联络规定每点的水平方向（短线）；沿底圆走一圈，提升后的路径不一定闭合')
ax = ax3(f, [.02, .02, .62, .86], el=16, az=-60, lim=1.25, zs=1.2)
u = np.linspace(0, 2 * np.pi, 120); v = np.linspace(-1.4, 1.4, 10); U, V = np.meshgrid(u, v)
ax.plot_surface(np.cos(U), np.sin(U), V, color=BLUE, alpha=.14, linewidth=0)
k = .17
for uu in np.linspace(0, 2 * np.pi, 16, endpoint=False):
    for zz in np.linspace(-1.1, 1.1, 6):
        du = .18; ax.plot([np.cos(uu - du), np.cos(uu + du)], [np.sin(uu - du), np.sin(uu + du)], [zz - k * du, zz + k * du], color=FG2, lw=1.2, alpha=.6)
z0 = -.75; uu = np.linspace(0, 2 * np.pi, 300); ax.plot(np.cos(uu), np.sin(uu), z0 + k * uu, color=GOLD, lw=4)
ax.plot(np.cos(uu), np.sin(uu), -1.4 + 0 * uu, color=FG3, lw=2, ls='--')
ax.scatter([1], [0], [z0], color=GREEN, s=90, depthshade=False); ax.scatter([1], [0], [z0 + k * 2 * np.pi], color=RED, s=90, depthshade=False)
ax.plot([1, 1], [0, 0], [z0, z0 + k * 2 * np.pi], color=RED, lw=3)
f.text(.66, .7, '绿点：出发', color=GREEN, fontsize=20); f.text(.66, .63, '红点：走一圈后回到同一根纤维', color=RED, fontsize=20)
f.text(.66, .56, '红色竖线 = 和乐（holonomy）', color=RED, fontsize=20)
f.text(.66, .3, '水平方向的“扭曲程度”\n就是曲率；\n曲率为零且底空间单连通时，\n提升总能闭合。', color=FG2, fontsize=18, linespacing=1.5)
save(f, 'fb12_horizontal_lift')
