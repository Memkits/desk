from common import *
def rot(el, az):
    e, a = np.radians(el), np.radians(az)
    Rz = np.array([[np.cos(a), -np.sin(a), 0], [np.sin(a), np.cos(a), 0], [0, 0, 1]])
    Rx = np.array([[1, 0, 0], [0, np.cos(e), -np.sin(e)], [0, np.sin(e), np.cos(e)]])
    return Rx @ Rz   # 之后：x 向右，y 向上? 我们用 (x, z) 投影，深度 y
class Orth:
    def __init__(s, ax, el=25, az=30, R=1):
        s.ax = ax; s.M = rot(-90 + el, az); ax.set_aspect('equal'); clean(ax)
    def P(s, p):
        q = s.M @ np.asarray(p).T; return q[0], q[1], q[2]   # x, y, depth(z>0 朝向观众)
    def sphere(s, col='#16223a', edge='#2C3854'):
        t = np.linspace(0, 2 * np.pi, 200)
        from matplotlib.patches import Circle
        g = plt.Circle((0, 0), 1, color=col, zorder=1); s.ax.add_patch(g); s.ax.plot(np.cos(t), np.sin(t), color=edge, lw=1.5, zorder=2)
        # 经纬线
        for th in np.linspace(np.pi / 6, 5 * np.pi / 6, 5): s.curve(np.array([[np.sin(th) * np.cos(p), np.sin(th) * np.sin(p), np.cos(th)] for p in np.linspace(0, 2 * np.pi, 120)]), '#25324e', 1, back=False)
        for ph in np.linspace(0, np.pi, 6, endpoint=False): s.curve(np.array([[np.sin(t_) * np.cos(ph), np.sin(t_) * np.sin(ph), np.cos(t_)] for t_ in np.linspace(0, 2 * np.pi, 160)]), '#25324e', 1, back=False)
    def curve(s, pts, col, lw, back=True, z=5, **kw):
        x, y, d = s.P(pts); vis = d >= -1e-3
        xf = np.where(vis, x, np.nan); yf = np.where(vis, y, np.nan); s.ax.plot(xf, yf, color=col, lw=lw, zorder=z, solid_capstyle='round', **kw)
        if back: s.ax.plot(np.where(~vis, x, np.nan), np.where(~vis, y, np.nan), color=col, lw=lw * .6, alpha=.25, zorder=1.5, ls='--')
    def arrow(s, p, v, col, L=.25, lw=2.5, z=6):
        x0, y0, d0 = s.P(p); x1, y1, d1 = s.P(np.asarray(p) + L * np.asarray(v))
        if d0 < 0.02: return
        s.ax.annotate('', xy=(x1, y1), xytext=(x0, y0), arrowprops=dict(arrowstyle='-|>', color=col, lw=lw, mutation_scale=14), zorder=z)
    def dot(s, p, col, ms=9, z=7):
        x, y, d = s.P(p)
        if d >= 0: s.ax.plot(x, y, 'o', color=col, ms=ms, zorder=z)
    def text(s, p, t, **kw):
        x, y, d = s.P(p); s.ax.text(x, y, t, **kw)
SP = lambda t, p: np.array([np.sin(t) * np.cos(p), np.sin(t) * np.sin(p), np.cos(t)])
ETH = lambda t, p: np.array([np.cos(t) * np.cos(p), np.cos(t) * np.sin(p), -np.sin(t)])
EPH = lambda t, p: np.array([-np.sin(p), np.cos(p), 0])
