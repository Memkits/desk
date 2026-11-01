from common import *
from scipy.special import jn, jn_zeros
# 10 共振曲线
f = fig(); title(f, '共振：驱动频率碰上固有频率', '阻尼越小，峰越尖、越高')
ax = f.add_axes([.08, .14, .86, .66]); w = np.linspace(.2, 2, 800)
for z, col in [(.03, RED), (.08, GOLD), (.2, BLUE), (.5, GREEN)]: ax.plot(w, 1 / np.sqrt((1 - w * w) ** 2 + (2 * z * w) ** 2), color=col, lw=3, label=f'阻尼比 {z}')
ax.set_xlabel('驱动频率 ÷ 固有频率'); ax.set_ylabel('振幅（相对静态）'); ax.legend(frameon=False); ax.set_ylim(0, 18); [ax.spines[s].set_visible(False) for s in ['top', 'right']]
save(f, 'own_10_resonance_curve')
# 11 房间模式
f = fig(); title(f, '三维：房间里的低音驻波', '5 m × 4 m 房间的几个模式；亮处低音轰鸣，暗处低音消失')
g = np.linspace(0, 1, 300); X, Y = np.meshgrid(g, g)
for i, (nx, ny) in enumerate([(1, 0), (0, 1), (1, 1), (2, 1)]):
    fr = 343 / 2 * np.sqrt((nx / 5) ** 2 + (ny / 4) ** 2)
    ax = f.add_axes([.04 + i * .24, .25, .21, .5]); clean(ax); ax.imshow(np.abs(np.cos(nx * np.pi * X) * np.cos(ny * np.pi * Y)), cmap='magma', extent=[0, 5, 0, 4], origin='lower'); ax.set_title(f'({nx},{ny},0)  {fr:.0f} Hz', color=GOLD, fontsize=17)
f.text(.5, .12, 'f = (c/2)·√((nx/Lx)² + (ny/Ly)² + (nz/Lz)²)，c = 343 m/s', ha='center', fontsize=18, color=FG2); save(f, 'own_11_room_modes')
# 12 微波炉
f = fig(); title(f, '微波炉里的冷热点', '频率 2.45 GHz → 波长约 12.2 cm → 热点间距约 6.1 cm（半个波长）')
ax = f.add_axes([.06, .3, .88, .45]); clean(ax); x = np.linspace(0, 36, 900)
ax.add_patch(plt.Rectangle((0, -.4), 36, .8, color='#5a3a22')); ax.plot(x, np.sin(2 * np.pi * x / 12.24) ** 2 * 1.4 + .5, color=GOLD, lw=3)
for k in range(6): xc = 3.06 + k * 6.12; ax.add_patch(plt.Circle((xc, 0), .35, color='#c8874a')); ax.text(xc, -.75, '融化', ha='center', fontsize=14, color=GOLD)
ax.annotate('', xy=(3.06, 2.2), xytext=(9.18, 2.2), arrowprops=dict(arrowstyle='<->', color='#fff')); ax.text(6.12, 2.32, '≈ 6.1 cm', ha='center', fontsize=16)
ax.set_xlim(-1, 37); ax.set_ylim(-1.2, 2.6)
f.text(.06, .14, '拿掉转盘，放一块巧克力：量出融化点间距 d，光速 c ≈ 2d × 2.45 GHz ≈ 3 × 10⁸ m/s', fontsize=18, color=FG2); save(f, 'own_12_microwave')
# 13 激光谐振腔
f = fig(); title(f, '激光：谐振腔只放大"装得下"的波长', '腔长 L 的纵模间隔 Δf = c/2L；增益曲线下的那几条才会起振')
ax = f.add_axes([.06, .56, .88, .26]); clean(ax); x = np.linspace(0, 1, 1200)
ax.plot(x, .8 * np.sin(14 * np.pi * x), color=RED, lw=2.5); ax.add_patch(plt.Rectangle((-.03, -1.2), .03, 2.4, color='#9aa6bc')); ax.add_patch(plt.Rectangle((1, -1.2), .03, 2.4, color='#9aa6bc', alpha=.6)); ax.text(.5, -1.15, '腔长 L', ha='center', fontsize=15, color=FG2); ax.set_xlim(-.06, 1.06); ax.set_ylim(-1.3, 1.3)
ax = f.add_axes([.06, .12, .88, .34]); fr = np.linspace(-6, 6, 1000); gain = np.exp(-(fr / 2.6) ** 2)
ax.plot(fr, gain, color=GOLD, lw=2, label='增益曲线'); ax.axhline(.45, color=FG3, ls='--', lw=1); ax.text(5.2, .48, '损耗', color=FG3, fontsize=13)
for k in range(-6, 7): h = np.exp(-(k / 2.6) ** 2); ax.vlines(k, 0, h if h > .45 else .1, color=RED if h > .45 else FG3, lw=3)
ax.set_yticks([]); ax.set_xticks([]); ax.set_xlabel('频率'); ax.legend(frameon=False); [ax.spines[s].set_visible(False) for s in ['top', 'right', 'left']]
save(f, 'own_13_laser_cavity')
# 14 假潮
f = fig(); title(f, '湖泊里的驻波：假潮（seiche）', '整湖的水来回晃；周期 T = 2L / (n·√(gh))（梅里安公式）')
for i, n in enumerate([1, 2]):
    ax = f.add_axes([.06, .5 - i * .34, .88, .28]); clean(ax); x = np.linspace(0, 1, 400)
    ax.fill_between(x, -1.4, -1.1 - .25 * np.sin(np.pi * x), color='#3a2f22')
    for s, al in [(1, .9), (-1, .35)]: ax.plot(x, s * .45 * np.cos(n * np.pi * x), color=BLUE, lw=3, alpha=al)
    ax.fill_between(x, -1.1 - .25 * np.sin(np.pi * x), .45 * np.cos(n * np.pi * x), color=BLUE, alpha=.15); ax.set_ylim(-1.5, .8); ax.text(0, .62, f'n = {n}' + ('：两岸一升一降' if n == 1 else '：中间升，两岸降'), fontsize=17)
L, h = 70e3, 100; f.text(.06, .08, f'例：长 70 km、平均深 100 m 的湖，n = 1 的周期约 {2 * L / np.sqrt(9.8 * h) / 3600:.1f} 小时', fontsize=17, color=FG2); save(f, 'own_14_seiche')
# 15 芬迪湾
f = fig(); title(f, '芬迪湾：固有周期接近潮汐周期', '海湾的固有周期约 13 小时，月球潮汐的周期 12.42 小时 → 共振放大，潮差可达 16 米')
ax = f.add_axes([.08, .14, .86, .66]); T = np.linspace(6, 24, 800); w = 13.0 / T
amp = 1 / np.sqrt((1 - w * w) ** 2 + (2 * .12 * w) ** 2); ax.plot(T, amp, color=GOLD, lw=3)
ax.axvline(12.42, color=BLUE, lw=2); ax.text(12.6, 4.2, '半日潮 12.42 h', color=BLUE, fontsize=16); ax.axvline(13, color=FG3, ls='--'); ax.text(13.2, 3.6, '海湾固有周期 ≈ 13 h（示意）', color=FG2, fontsize=15)
ax.set_xlabel('驱动周期（小时）'); ax.set_ylabel('放大倍数（示意）'); [ax.spines[s].set_visible(False) for s in ['top', 'right']]; save(f, 'own_15_fundy')
# 16 舒曼共振
f = fig(); title(f, '地球与电离层之间的空腔：舒曼共振', '雷电激发，基频约 7.8 Hz；对应一个波长约绕地球一圈')
ax = f.add_axes([.03, .1, .45, .72]); clean(ax); th = np.linspace(0, 2 * np.pi, 400)
ax.fill(np.cos(th), np.sin(th), color='#1d3b6a'); ax.plot(1.25 * np.cos(th), 1.25 * np.sin(th), color=PURP, lw=3); ax.text(0, 1.33, '电离层（约 80 km 高，示意放大）', ha='center', color=PURP, fontsize=14)
ax.plot(1.12 * np.cos(th) + .04 * np.cos(th * 2) * np.cos(th), 1.12 * np.sin(th) + .04 * np.cos(th * 2) * np.sin(th), color=GOLD, lw=2.5); ax.set_aspect('equal'); ax.set_xlim(-1.5, 1.5); ax.set_ylim(-1.5, 1.5); ax.text(0, 0, '地球', ha='center', fontsize=18)
ax = f.add_axes([.55, .2, .4, .55]); n = np.arange(1, 6); fr = [7.8, 14.3, 20.8, 27.3, 33.8]
ax.bar(n, [1, .7, .5, .35, .25], color=GOLD, width=.5); ax.set_xticks(n); ax.set_xticklabels([f'{v} Hz' for v in fr], fontsize=13); ax.set_yticks([]); ax.set_title('观测到的共振峰（典型值）', color=FG2, loc='left'); [ax.spines[s].set_visible(False) for s in ['top', 'right', 'left']]
save(f, 'own_16_schumann')
# 17 调谐质量阻尼器
f = fig(); title(f, '调谐质量阻尼器：用一个小摆抵消大楼的摆动', '台北 101 的阻尼球约 660 吨；示意响应曲线')
ax = f.add_axes([.08, .14, .86, .66]); w = np.linspace(.6, 1.4, 800); mu, z1, z2 = .02, .01, .1
s = 1j * w; wa = 1 / (1 + mu); H = (-(w * w) + 2j * z2 * w * wa + wa * wa) / ((1 - w * w + 2j * z1 * w) * (-(w * w) + 2j * z2 * w * wa + wa * wa) - mu * w * w * (2j * z2 * w * wa + wa * wa))
ax.plot(w, 1 / np.abs(1 - w * w + 2j * z1 * w), color=RED, lw=3, label='没有阻尼器'); ax.plot(w, np.abs(H), color=GOLD, lw=3, label='加上调谐质量阻尼器')
ax.set_xlabel('风或地震的频率 ÷ 大楼固有频率'); ax.set_ylabel('楼顶摆幅（相对）'); ax.legend(frameon=False); [ax.spines[s].set_visible(False) for s in ['top', 'right']]; save(f, 'own_17_tmd')
# 18 回音壁
f = fig(); title(f, '回音壁：沿着圆形墙壁传播的驻波', '圣保罗大教堂穹顶的回音廊；光学微腔里的"回音壁模式"也是同一回事')
ax = f.add_axes([.03, .08, .45, .76]); clean(ax); th = np.linspace(0, 2 * np.pi, 400); ax.plot(np.cos(th), np.sin(th), color=FG2, lw=3)
pts = [np.array([np.cos(a), np.sin(a)]) for a in np.arange(0, 2 * np.pi + .01, 2 * np.pi / 13)]
for p, q in zip(pts[:-1], pts[1:]): ax.plot([p[0], q[0]], [p[1], q[1]], color=GOLD, lw=2)
ax.set_aspect('equal'); ax.set_xlim(-1.2, 1.2); ax.set_ylim(-1.2, 1.2); ax.text(0, 0, '声线贴着墙走', ha='center', color=GOLD, fontsize=16)
ax = f.add_axes([.5, .12, .46, .7], projection='polar'); ax.set_facecolor('#070A12'); m = 24; k = jn_zeros(m, 1)[0]; r = np.linspace(0, 1, 300); t = np.linspace(0, 2 * np.pi, 800); R, TT = np.meshgrid(r, t)
Z = jn(m, k * R) * np.cos(m * TT); ax.pcolormesh(TT, R, Z, cmap='RdBu_r', shading='auto'); ax.set_xticks([]); ax.set_yticks([]); ax.spines['polar'].set_color(FG3); ax.set_title('高阶模式：能量集中在边缘一圈', color=FG2, fontsize=15)
save(f, 'own_18_whispering_gallery')
