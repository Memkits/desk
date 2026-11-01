from common import *
import importlib.util, sys
def ax3(f, rect, el, az, lim, zs=1):
    ax = f.add_axes(rect, projection='3d'); ax.set_axis_off(); ax.set_facecolor('#070A12'); ax.view_init(el, az)
    ax.set_xlim(-lim, lim); ax.set_ylim(-lim, lim); ax.set_zlim(-lim * zs, lim * zs); ax.set_box_aspect((1, 1, zs)); return ax
# 莫比乌斯背景
f = plt.figure(figsize=(16, 9), dpi=120); ax = ax3(f, [.3, -.1, .8, 1.2], 30, -125, 1.05, .7)
u = np.linspace(0, 2 * np.pi, 300); v = np.linspace(-.45, .45, 16); U, V = np.meshgrid(u, v); a = U / 2
X = (1.2 + V * np.sin(a)) * np.cos(U); Y = (1.2 + V * np.sin(a)) * np.sin(U); Z = V * np.cos(a)
ax.plot_surface(X, Y, Z, color=RED, alpha=.9, linewidth=0, shade=True, rstride=1, cstride=2)
for k in range(0, 300, 12): ax.plot(X[:, k], Y[:, k], Z[:, k], color='#E9EEF7', lw=1, alpha=.7)
ax.plot(1.2 * np.cos(u), 1.2 * np.sin(u), 0, color=GOLD, lw=3)
f.savefig('/home/claude/fbv/cover/bg1.png'); plt.close(f)
# 霍普夫背景
f = plt.figure(figsize=(16, 9), dpi=120); ax = ax3(f, [.25, -.15, .85, 1.3], 28, -55, 1.7, .8)
cm = plt.get_cmap('turbo')
for i, (th, n) in enumerate([(.55, 12), (1.05, 16), (1.5, 22)]):
    for ph in np.linspace(0, 2 * np.pi, n, endpoint=False):
        ps = np.linspace(0, 2 * np.pi, 300); x1, x2 = np.cos(th / 2) * np.cos(ps), np.cos(th / 2) * np.sin(ps); x3, x4 = np.sin(th / 2) * np.cos(ps + ph), np.sin(th / 2) * np.sin(ps + ph); d = 1 - x4
        ax.plot(x1 / d, x2 / d, x3 / d, color=cm(ph / (2 * np.pi) * .85 + .07), lw=[2.8, 2.0, 1.4][i], alpha=[1, .85, .65][i])
f.savefig('/home/claude/fbv/cover/bg2.png'); plt.close(f)
