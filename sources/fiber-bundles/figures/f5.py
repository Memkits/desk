from common import *
# fb19 倒车与落猫
f = fig(); title(f, '形状空间里的和乐：汽车横移与落猫翻身', '只能前后走的汽车，靠一串小回路横向平移；角动量为零的猫，靠改变形状翻转身体')
ax = f.add_axes([.03, .1, .5, .74]); clean(ax); ax.set_aspect('equal')
x, y, th = 0., 0., 0.; L = 1.0; dt = .02; path = [(x, y, th)]
for v, st, T in [(1, .5, .8), (1, -.5, .8), (-1, .5, .8), (-1, -.5, .8)] * 2:
    for _ in range(int(T / dt)):
        x += v * np.cos(th) * dt; y += v * np.sin(th) * dt; th += v / L * np.tan(st) * dt; path.append((x, y, th))
P = np.array(path); ax.plot(P[:, 0], P[:, 1], color=GOLD, lw=2.5)
def car(x, y, th, col, a=1):
    c, s = np.cos(th), np.sin(th); pts = np.array([[-.35, -.18], [.75, -.18], [.75, .18], [-.35, .18], [-.35, -.18]]) @ np.array([[c, s], [-s, c]]) + [x, y]
    ax.fill(pts[:, 0], pts[:, 1], color=col, alpha=.25 * a); ax.plot(pts[:, 0], pts[:, 1], color=col, lw=2, alpha=a)
for k in range(40, len(P) - 20, 80): car(*P[k], BLUE, .45)
car(*P[0], GREEN); car(*P[-1], RED)
ax.annotate('', xy=(P[-1, 0], P[-1, 1]), xytext=(P[0, 0], P[0, 1]), arrowprops=dict(arrowstyle='-|>', color=RED, lw=3, mutation_scale=20))
ax.set_xlim(P[:, 0].min() - 1.2, P[:, 0].max() + 1.5); ax.set_ylim(P[:, 1].min() - .9, P[:, 1].max() + .9)
ax.text(P[:, 0].mean(), P[:, 1].min() - .7, '前左 → 前右 → 后左 → 后右，重复两次：车身朝向不变，整体侧移', color=FG2, fontsize=15, ha='center')
ax.text(P[:, 0].min() - 1.1, P[:, 1].max() + .7, '绿：起点　红：终点', color=FG2, fontsize=15)
ax = f.add_axes([.58, .16, .38, .62]); clean(ax); ax.set_xlim(-.2, 2 * np.pi + .4); ax.set_ylim(-.5, 4.2)
ax.add_patch(plt.Rectangle((0, 0), 2 * np.pi, 3.6, color=BLUE, alpha=.08)); ax.plot([0, 2 * np.pi], [0, 0], color=GOLD, lw=4)
ax.text(np.pi, -.4, '底空间：猫的形状（弯腰、扭转……），走一个闭合回路', color=GOLD, fontsize=14, ha='center')
ax.text(-.15, 1.8, '纤维：身体朝向', color=BLUE, fontsize=14, rotation=90, va='center', ha='right')
u = np.linspace(0, 2 * np.pi, 200); ax.plot(u, .3 + 2.8 * (u - np.sin(u)) / (2 * np.pi), color=RED, lw=4)
ax.plot(0, .3, 'o', color=GREEN, ms=12); ax.plot(2 * np.pi, 3.1, 'o', color=RED, ms=12)
ax.annotate('', xy=(2 * np.pi + .25, 3.1), xytext=(2 * np.pi + .25, .3), arrowprops=dict(arrowstyle='<->', color=RED, lw=2.5))
ax.text(2 * np.pi - .1, 3.45, '转了 180°：背朝上 → 四脚朝下', color=RED, fontsize=15, ha='right')
ax.text(.2, 3.85, '角动量始终为零（像落猫、宇航员、卫星的姿态控制）', color=FG2, fontsize=14)
save(f, 'fb19_shape_holonomy')

# fb20 吴–杨对照表
f = fig(); title(f, '吴大峻–杨振宁对照表（1975）', '规范场论里的概念，和纤维丛里的概念一一对应')
ax = f.add_axes([.06, .06, .88, .78]); clean(ax); ax.set_xlim(0, 10); ax.set_ylim(0, 9)
rows = [('规范场论', '纤维丛'), ('规范群 U(1)、SU(2)、SU(3)', '主丛的结构群'), ('规范势 A', '主丛上的联络'), ('场强 F', '曲率'), ('规范变换', '换一组局部平凡化'), ('相因子 exp(i∮A)', '平行移动 / 和乐'), ('电磁学', 'U(1) 丛上的联络'), ('狄拉克磁单极的量子化', 'U(1) 丛按陈数分类'), ('带电的物质场', '伴随向量丛的截面')]
for i, (a, b) in enumerate(rows):
    y = 8.4 - i * .98; h = i == 0
    if not h: ax.plot([.3, 9.7], [y + .49, y + .49], color='#232c42', lw=1)
    ax.text(.5, y, a, color=FG3 if h else '#E9EEF7', fontsize=17 if h else 21, va='center', fontweight='bold' if h else 'normal')
    ax.text(5.4, y, b, color=FG3 if h else GOLD, fontsize=17 if h else 21, va='center', fontweight='bold' if h else 'normal')
    if not h: ax.text(5.0, y, '↔', color=FG3, fontsize=20, va='center', ha='center')
save(f, 'fb20_wu_yang')

# fb21 量子霍尔效应
f = fig(); title(f, '整数量子霍尔效应：电阻台阶就是陈数', '霍尔电阻 R_xy 在平台上精确等于 h / (ν e²)，ν = 1, 2, 3 …是一个陈数（TKNN 1982）；纵向电阻 R_xx 在平台上降到零（示意曲线）')
ax = f.add_axes([.08, .14, .62, .68]); B = np.linspace(.3, 12, 3000); nu_c = 8 / B
s = lambda x: 1 / (1 + np.exp(-x))
inv = sum(s((nu_c - (k + .5)) * 9) for k in range(1, 12)) + 1
Rxy = 1 / inv; Rxx = sum(np.exp(-((nu_c - (k + .5)) * 3.2) ** 2) / (k + .5) for k in range(1, 12)) * .5
ax.plot(B, Rxy, color=GOLD, lw=3.5, label='霍尔电阻 R_xy（单位 h/e²）'); ax.plot(B, Rxx * .6, color=BLUE, lw=2.2, label='纵向电阻 R_xx（任意单位）')
ax.plot(B, B / 8, color=FG3, lw=1.2, ls='--', label='经典霍尔效应：直线')
for k in range(1, 7): ax.text(11.6 if k == 1 else 8 / k + .15, 1 / k + .025, f'ν = {k}', color=GOLD, fontsize=14)
ax.set_xlabel('磁场 B（任意单位）'); ax.set_ylabel('R_xy / (h/e²)'); ax.set_ylim(0, 1.15); ax.legend(loc='upper left', frameon=False, fontsize=14)
ax.grid(color='#1a2236', lw=.8)
f.text(.74, .7, 'h / e² = 25 812.807 … Ω', color=GOLD, fontsize=24)
f.text(.74, .62, '冯·克利青常数 R_K', color=FG2, fontsize=17)
f.text(.74, .5, '平台的精度不受杂质影响，\n可达十亿分之一以下，\n用作国际电阻标准。', color=FG2, fontsize=17, linespacing=1.6)
f.text(.74, .32, '1980 发现（1985 诺贝尔奖）\n1982 证明 ν 是陈数\n2016 诺贝尔奖：拓扑物态', color=FG3, fontsize=15, linespacing=1.6)
save(f, 'fb21_quantum_hall')

# fb22 傅科摆
f = fig(); title(f, '傅科摆：纬度越高，摆平面转得越快', '每个恒星日摆平面转过 360° × sin(纬度)；这是摆平面沿纬线被平行移动后的和乐')
ax = f.add_axes([.08, .14, .55, .68]); lat = np.linspace(0, 90, 300)
ax.plot(lat, 360 * np.sin(np.radians(lat)), color=GOLD, lw=3.5)
for nm, la in [('赤道', 0), ('新加坡', 1.35), ('广州', 23.1), ('北京', 39.9), ('巴黎', 48.85), ('北极', 90)]:
    v = 360 * np.sin(np.radians(la)); ax.plot(la, v, 'o', color=RED, ms=9); ax.text(la + 1.2, v - 18, f'{nm} {v:.0f}°', color='#E9EEF7', fontsize=14)
ax.set_xlabel('纬度（°）'); ax.set_ylabel('每天转过的角度（°）'); ax.set_xlim(0, 95); ax.set_ylim(-10, 380); ax.grid(color='#1a2236', lw=.8)
f.text(.68, .7, '巴黎先贤祠，1851 年', color=FG2, fontsize=19)
f.text(.68, .62, '摆长 67 m，摆锤 28 kg', color=FG2, fontsize=17)
f.text(.68, .52, '转满一圈：23.93 h ÷ sin 48.85°\n≈ 31.8 小时', color=GOLD, fontsize=20, linespacing=1.5)
f.text(.68, .36, '和乐 = 纬线圈以北的球冠\n所张的立体角', color=FG3, fontsize=16, linespacing=1.5)
save(f, 'fb22_foucault')
