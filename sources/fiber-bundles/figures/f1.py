from common import *
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
def ax3(f, rect, el=38, az=-125, lim=1.15):
    ax = f.add_axes(rect, projection='3d'); ax.set_axis_off(); ax.set_facecolor('#070A12'); ax.view_init(el, az)
    ax.set_xlim(-lim, lim); ax.set_ylim(-lim, lim); ax.set_zlim(-lim * .7, lim * .7); ax.set_box_aspect((1, 1, .7)); return ax
def band(ax, twist, col, R=1.2, w=.45, n=200, m=12, rulings=True, alpha=.85):
    u = np.linspace(0, 2 * np.pi, n); v = np.linspace(-w, w, m); U, V = np.meshgrid(u, v)
    a = twist * U / 2
    X = (R + V * np.sin(a)) * np.cos(U); Y = (R + V * np.sin(a)) * np.sin(U); Z = V * np.cos(a)
    ax.plot_surface(X, Y, Z, color=col, alpha=alpha, linewidth=0, shade=True, rstride=1, cstride=2)
    if rulings:
        for k in range(0, n, 10):
            ax.plot(X[:, k], Y[:, k], Z[:, k], color='#E9EEF7', lw=.9, alpha=.7)
    return X, Y, Z
# f01 圆柱 vs 莫比乌斯带
f = fig(); title(f, '同样的“局部”，不同的“整体”', '每一小段都像 一段弧 × 一根线段；绕一圈之后，纤维是否被翻转')
ax = ax3(f, [0, .08, .5, .78]); X, Y, Z = band(ax, 0, BLUE); ax.plot(1.2 * np.cos(np.linspace(0, 7, 200)), 1.2 * np.sin(np.linspace(0, 7, 200)), 0, color=GOLD, lw=3)
ax = ax3(f, [.5, .08, .5, .78]); X, Y, Z = band(ax, 1, RED); ax.plot(1.2 * np.cos(np.linspace(0, 7, 200)), 1.2 * np.sin(np.linspace(0, 7, 200)), 0, color=GOLD, lw=3)
f.text(.25, .1, '圆柱面 = S¹ × [−1, 1]\n平凡丛（乘积）', ha='center', fontsize=20, color=BLUE)
f.text(.75, .1, '莫比乌斯带\n非平凡丛：整体扭了半圈', ha='center', fontsize=20, color=RED)
f.text(.5, .04, '金线：底空间 S¹（零截面）　白线：纤维', ha='center', fontsize=15, color=FG3)
save(f, 'fb01_cylinder_mobius')

# f02 纤维丛的解剖图
f = fig(); title(f, '纤维丛的组成：E —π→ B，纤维 F', '全空间 E 投影到底空间 B；每个点 b 上方的原像 π⁻¹(b) 都同胚于 F')
ax = f.add_axes([.05, .06, .9, .8]); clean(ax); ax.set_xlim(0, 16); ax.set_ylim(0, 9)
xs = np.linspace(2, 14, 400); base = 1.4 + .25 * np.sin(xs * .8)
ax.plot(xs, base, color=GOLD, lw=4); ax.text(14.3, base[-1], '底空间 B', color=GOLD, fontsize=20, va='center')
top = lambda x: 7.4 + .4 * np.sin(x * .6 + 1); bot = lambda x: 3.6 + .3 * np.sin(x * .7)
ax.fill_between(xs, bot(xs), top(xs), color=BLUE, alpha=.13); ax.plot(xs, top(xs), color=BLUE, lw=1.5, alpha=.6); ax.plot(xs, bot(xs), color=BLUE, lw=1.5, alpha=.6)
ax.text(14.3, 5.6, '全空间 E', color=BLUE, fontsize=20, va='center')
for x in np.linspace(2.5, 13.5, 12):
    ax.plot([x + .15 * np.sin(x), x - .15 * np.sin(x)], [bot(x), top(x)], color='#E9EEF7', lw=1.3, alpha=.55)
x0 = 9.3; b0 = 1.4 + .25 * np.sin(x0 * .8)
ax.plot([x0 + .15 * np.sin(x0), x0 - .15 * np.sin(x0)], [bot(x0), top(x0)], color=RED, lw=5)
ax.text(x0 + .35, top(x0) + .25, '纤维 π⁻¹(b) ≅ F', color=RED, fontsize=20)
ax.plot(x0, b0, 'o', color=RED, ms=12); ax.text(x0 + .25, b0 - .55, 'b', color=RED, fontsize=22)
ax.annotate('', xy=(x0, b0 + .3), xytext=(x0, bot(x0) - .2), arrowprops=dict(arrowstyle='->', color=FG2, lw=2.5, linestyle='--'))
ax.text(x0 + .25, (b0 + bot(x0)) / 2, 'π', color=FG2, fontsize=26, style='italic')
# 局部平凡化窗口
ax.add_patch(plt.Rectangle((3.2, 1.0), 2.8, 7.2, fill=False, ec=GREEN, lw=2, ls='--'))
ax.text(3.25, 8.35, 'π⁻¹(U) ≅ U × F', color=GREEN, fontsize=19)
ax.plot([3.2, 6.0], [.75, .75], color=GREEN, lw=4); ax.text(4.6, .25, '开集 U', color=GREEN, fontsize=17, ha='center')
save(f, 'fb02_anatomy')

# f03 局部平凡化 + 转移函数：把莫比乌斯带切成两片
f = fig(); title(f, '局部平凡化与转移函数', '底空间 S¹ 用两片弧 U₁、U₂ 覆盖；两片在两段重叠区上粘回去')
ax = f.add_axes([.04, .08, .92, .76]); clean(ax); ax.set_xlim(0, 16); ax.set_ylim(0, 9); ax.set_aspect('equal')
def strip(x0, y0, w, col, lab):
    ax.add_patch(plt.Rectangle((x0, y0), w, 2, color=col, alpha=.35)); ax.add_patch(plt.Rectangle((x0, y0), w, 2, fill=False, ec=col, lw=2))
    for k in np.linspace(x0 + .3, x0 + w - .3, 9): ax.plot([k, k], [y0, y0 + 2], color='#E9EEF7', lw=.8, alpha=.5)
    ax.annotate('', xy=(x0 + .4, y0 + 1.8), xytext=(x0 + .4, y0 + .2), arrowprops=dict(arrowstyle='->', color='#fff', lw=2))
    ax.annotate('', xy=(x0 + w - .4, y0 + 1.8), xytext=(x0 + w - .4, y0 + .2), arrowprops=dict(arrowstyle='->', color='#fff', lw=2))
    ax.text(x0 + w / 2, y0 + 2.4, lab, color=col, fontsize=19, ha='center')
strip(1, 5.2, 5.5, BLUE, 'U₁ × [−1, 1]'); strip(9.5, 5.2, 5.5, PURP, 'U₂ × [−1, 1]')
# 粘合说明
ax.annotate('', xy=(9.4, 6.2), xytext=(6.6, 6.2), arrowprops=dict(arrowstyle='<->', color=GREEN, lw=3))
ax.text(8, 6.65, 'g₁₂ = +1', color=GREEN, fontsize=20, ha='center'); ax.text(8, 5.6, '这一端：原样粘', color=GREEN, fontsize=14, ha='center')
ax.annotate('', xy=(1.3, 5.0), xytext=(14.7, 5.0), arrowprops=dict(arrowstyle='<->', color=RED, lw=3, connectionstyle='arc3,rad=-.12'))
ax.text(8, 2.55, 'g₂₁ = −1', color=RED, fontsize=22, ha='center'); ax.text(8, 1.95, '另一端重叠：翻过来粘 → 莫比乌斯带', color=RED, fontsize=15, ha='center')
ax.text(8, .9, '两个都取 +1 → 圆柱面。　丛的“扭”全部记在转移函数里：gᵢⱼ : Uᵢ ∩ Uⱼ → G（结构群），满足 gᵢⱼ gⱼₖ = gᵢₖ', color=FG2, fontsize=16, ha='center')
save(f, 'fb03_transition')

# f04 截面
f = fig(); title(f, '截面：给每个点挑一根纤维上的点', '圆柱面有处处不为零的截面；莫比乌斯带上任何连续截面都必须穿过零')
ax = ax3(f, [0, .1, .5, .76]); band(ax, 0, BLUE, alpha=.45); u = np.linspace(0, 2 * np.pi, 300)
ax.plot(1.2 * np.cos(u), 1.2 * np.sin(u), 0, color=FG3, lw=1.5, ls='--'); ax.plot(1.2 * np.cos(u), 1.2 * np.sin(u), .3 + 0 * u, color=GOLD, lw=4)
ax = ax3(f, [.5, .1, .5, .76]); band(ax, 1, RED, alpha=.45)
ax.plot(1.2 * np.cos(u), 1.2 * np.sin(u), 0, color=FG3, lw=1.5, ls='--')
s = .3 * np.cos(u / 2); a = u / 2; ax.plot((1.2 + s * np.sin(a)) * np.cos(u), (1.2 + s * np.sin(a)) * np.sin(u), s * np.cos(a), color=GOLD, lw=4)
ax.scatter([1.2 * np.cos(np.pi)], [1.2 * np.sin(np.pi)], [0], color='#fff', s=90, depthshade=False)
f.text(.25, .1, '平凡丛：s(b) = 0.3，处处非零', ha='center', fontsize=19, color=BLUE)
f.text(.75, .1, '绕一圈纤维翻转，s 从 +0.3 变到 −0.3\n中间必有零点（白点）', ha='center', fontsize=19, color=RED)
save(f, 'fb04_sections')
