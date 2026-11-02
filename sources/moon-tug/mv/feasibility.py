"""月球拖船方案可行性核算。所有常数取自公开测量值（IAU / NASA / CODATA），科幻设定单独标出。
运行：python3 feasibility.py  → 打印并写出 可行性核算.md"""
import json, math
import numpy as np

# ---------- 真实数据 ----------
G = 6.67430e-11                  # CODATA 2018
c = 2.99792458e8
sigma = 5.670374e-8
AU = 1.495978707e11
LY = 9.4607e15
YR = 365.25 * 86400
M_E = 5.9722e24; R_E = 6.371e6; rho_E = 5514        # NASA Earth fact sheet
M_M = 7.342e22; R_M = 1.7374e6; rho_M = 3344; d_M0 = 3.844e8   # NASA Moon fact sheet
L_sun = 3.828e26; S0 = 1361.0    # IAU 2015 标称光度；太阳常数
q_geo = 0.087                    # 地球平均地热流 W/m²（Davies & Davies 2010）
tide_diss_now = 3.7e12           # 今天的潮汐耗散 W（Egbert & Ray 2000）
M_atm = 5.15e18                  # 大气质量 kg
rock = {'O': .45, 'Si': .21, 'Mg': .23, 'Fe': .06, 'Al': .02, 'Ca': .02}   # 月幔大致质量分数（示意）

# ---------- 方案参数（来自推演篇）----------
a = 4.0e-4          # 拖动地球的加速度 m/s²（≈ g/25,000）
dv = 23.1e3         # 轨道积分得到的总速度增量 m/s（traj.json）
cant = math.radians(12.4); plume = math.radians(5.0); N_jet = 12
ve_list = [2.0e6, 4.0e6, 6.0e6]   # 喷流速度：科幻设定（岩石聚变发动机）

rows = []
def add(sec, name, val, note=''): rows.append((sec, name, val, note)); print(f'[{sec}] {name}: {val}  {note}')

# 1 悬停距离与外观
d = math.sqrt(G * M_M / a)
add('悬停', '悬停距离 d = √(GM_月/a)', f'{d/1e3:,.0f} km', '取 a = 4×10⁻⁴ m/s²')
ang = 2 * math.degrees(math.atan(R_M / (d - R_E)))
add('悬停', '月亮视直径（地面上）', f'{ang:.2f}°', f'今天 {2*math.degrees(math.atan(R_M/(d_M0-R_E))):.2f}°')
add('悬停', '潮汐力（相对今天）', f'{(d_M0/d)**3:.1f} 倍', '∝ M/d³')
roche_rigid = R_E * (2 * rho_E / rho_M) ** (1/3); roche_fluid = 2.44 * R_E * (rho_E / rho_M) ** (1/3)
add('悬停', '洛希极限（刚体 / 流体）', f'{roche_rigid/1e3:,.0f} / {roche_fluid/1e3:,.0f} km', '悬停距离远在其外，月球不会被潮汐撕碎')
gE_at_moon = G * M_E / d**2
add('悬停', '月球要抵消的地球引力', f'{gE_at_moon:.4f} m/s²', '加上 a 即为月球需要的推力加速度')
F = M_M * (gE_at_moon + a)
add('悬停', '总推力 F', f'{F:.2e} N', f'= (M_地 + M_月)·a = {(M_E+M_M)*a:.2e} N（自洽检查）')
tid_moon = 2 * G * M_E * R_M / d**3
add('悬停', '地球对月球的潮汐加速度', f'{tid_moon:.1e} m/s²', f'月面重力 1.62 m/s² 的 {tid_moon/1.62:.1e}')
t_ff = math.pi / 2 * math.sqrt(d**3 / (2 * G * M_E))
add('悬停', '发动机一旦停机，月球落向地球的时间', f'{t_ff/3600:.0f} 小时', '所以两次点火之间必须改成绕地球的轨道')
P_orb = 2 * math.pi * math.sqrt(d**3 / (G * M_E))
add('悬停', '在悬停距离上的环绕周期', f'{P_orb/86400:.1f} 天', '点火之间的月相变化周期')

# 2 推进剂、能量、功率
for ve in ve_list:
    ve_eff = ve * math.cos(cant)
    mp = (M_E + M_M) * (1 - math.exp(-dv / ve_eff))
    E = 0.5 * mp * ve**2
    P = F / math.cos(cant) * ve / 2
    add('能量', f'v_e = {ve/1e6:.0f}000 km/s：用掉的月球', f'{mp/M_M*100:.0f}%', f'推力斜 12.4°，有效喷速 ×{math.cos(cant):.3f}')
    add('能量', f'v_e = {ve/1e6:.0f}000 km/s：喷流能量', f'{E:.1e} J = 太阳 {E/L_sun/YR:.0f} 年的输出', '')
    add('能量', f'v_e = {ve/1e6:.0f}000 km/s：喷流功率', f'{P:.1e} W = {P/L_sun:.1f} 倍太阳光度', '')
ve = 4.0e6
E_needed = 0.5 * (M_E + M_M) * (1 - math.exp(-dv / (ve*math.cos(cant)))) * ve**2
for eps, lab in [(1e-3, '岩石聚变的理想上限 0.1%'), (5e-4, '0.05%')]:
    add('能量', f'聚变燃料（质能释放 {lab}）', f'{E_needed/(eps*c**2)/M_M*100:.1f}% 月球质量', '科幻设定：O/Si/Mg 聚变到铁族，且全部能量进入喷流')

# 3 废热与对地球的影响
P = F / math.cos(cant) * ve / 2
f_sun = R_E**2 / (4 * AU**2)
add('热', '地球截获的太阳输出份额', f'{f_sun:.2e}', '')
f_allow = 0.1 * f_sun * L_sun / P
add('热', '额外受热 ≤ 阳光 10% 时，允许打到地球的发动机功率份额', f'{f_allow:.1e}', '推演篇写的“十亿分之一”宽松了约 300 倍，应为几万亿分之一')
geo = R_E**2 / (4 * d**2)
add('热', '喷流各向同性辐射中落到地球的份额', f'{geo:.1e}', '')
add('热', '喷流可以辐射掉的功率份额上限', f'{f_allow/geo:.1e}', '')
T_moon = 400
P_waste_max = sigma * T_moon**4 * 4 * math.pi * R_M**2
add('热', '月面保持 400 K 时能散掉的废热', f'{P_waste_max:.1e} W = 发动机功率的 {P_waste_max/P:.0e}', '科幻设定：发动机几乎没有废热，能量都进喷流')
diss = tide_diss_now * ((d_M0 / d)**3)**2
add('热', '潮汐耗散（∝ 潮汐振幅²）', f'{diss:.1e} W = 地表 {diss/(4*math.pi*R_E**2):.1f} W/m²', f'约为吸收阳光的 {diss/(4*math.pi*R_E**2)/240*100:.0f}%，并伴随频繁地震')

# 4 喷流几何与外观
lat_axis = d * math.tan(cant); edge = lat_axis - d * math.tan(plume)
add('喷流', '喷流边缘离地心', f'{edge/1e3:,.0f} km = {edge/R_E:.2f} R_E', '偏角 12.4°、扩散半角 5°')
md_jet = F / math.cos(cant) / ve / N_jet; r_j = d * math.tan(plume); rho_j = md_jet / (ve * math.pi * r_j**2)
add('喷流', '地球附近单道喷流的密度 / 动压', f'{rho_j:.1e} kg/m³ / {rho_j*ve**2/1e5:.1f} bar', f'是太阳风动压的 {rho_j*ve**2/1.5e-9:.0e} 倍，会压扁这一侧的磁层')
add('喷流', '每核子动能', f'{0.5*1.6605e-27*ve**2/1.602e-16:.0f} keV', '完全电离的岩石等离子体')
for Lk in [5e6, 2e7]:
    th = math.degrees(math.atan(Lk * math.sin(cant) / (d - Lk * math.cos(cant))))
    add('喷流', f'离喷口 {Lk/1e6:.0f} 千公里处在地面上的视角', f'{th:.1f}° ≈ {th/math.degrees(math.atan(R_M/d)):.1f} 个月亮半径', '发光 ∝ 密度² ∝ 距离⁻⁴，可见部分只在这一段')

# 5 月相（来自轨道积分）
tr = json.load(open(__import__('os').path.join(__import__('os').path.dirname(__file__), '..', 'calc', 'traj.json')))
t = np.array(tr['t']); P3 = np.array([tr['x'], tr['y'], tr['z']]).T; dvv = np.array(tr['dv'])
V = np.gradient(P3, t, axis=0); on = np.gradient(dvv, t) > 1e-3
r = np.linalg.norm(P3, axis=1); vh = V / np.linalg.norm(V, axis=1)[:, None]; sun = -P3 / r[:, None]
el = np.degrees(np.arccos(np.clip((vh * sun).sum(1), -1, 1)))
w, st = [], None
for i in range(len(t)):
    if on[i] and st is None: st = i
    if (not on[i] or i == len(t) - 1) and st is not None: w.append((st, i)); st = None
for k, (s_, e_) in enumerate(w):
    lit = lambda e: (1 + math.cos(math.radians(180 - e))) / 2
    add('月相', f'点火窗口 {k+1}（第 {t[s_]:.1f}–{t[e_]:.1f} 年，{(t[e_]-t[s_])*365:.0f} 天）', f'距角 {el[s_]:.0f}°→{el[e_]:.0f}°，亮 {lit(el[s_])*100:.0f}%→{lit(el[e_])*100:.0f}%', '')

# 6 旅途
T_surf = (q_geo / sigma) ** .25
add('旅途', '只靠地热时的地表平衡温度', f'{T_surf:.0f} K = {T_surf-273.15:.0f} °C', '氮的凝固点 63 K，空气会冻结落地')
add('旅途', '冻结后的大气层厚度', f'{M_atm/(4*math.pi*R_E**2)/1000:.0f} m', '固氮/固氧密度约 1000 kg/m³')
for d_au in [5, 50, 1000]:
    add('旅途', f'{d_au} AU 处的阳光', f'{S0/d_au**2:.3g} W/m² = 今天的 1/{d_au**2:,}', '月亮也按同样比例变暗')

with open('可行性核算.md', 'w') as f:
    f.write('# 月球拖船 · 可行性核算\n\n由 `feasibility.py` 生成。常数取自 NASA 行星数据、IAU 2015 标称值和 CODATA 2018；轨道数据来自推演篇的数值积分 `traj.json`。标注“科幻设定”的条目是方案保留的假设，其余都按已知物理计算。\n\n')
    sec = None
    for s, n, v, note in rows:
        if s != sec: f.write(f'\n## {s}\n\n| 项目 | 结果 | 说明 |\n|---|---|---|\n'); sec = s
        f.write(f'| {n} | {v} | {note} |\n')
print('written')
