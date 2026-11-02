"""《月球拖船》音乐短片第五版配乐。99 小节，70 BPM，D 小调→D 大调。在第四版的基础上加入中国民族乐器（程序合成）：
笛子（序/升空、壁画、片尾）、古筝（海、潮水、月亮靠近）、二胡（撤离、废城）、编钟（点火、近日点、银河）、大鼓（倒计时、近日点、银河）。
时间线：第四版的 0–9 小节不变；9–11.5 后移 2 小节；11.5 起后移 6 小节。新增：升空长镜头 5–11（原序延长 2 小节）、月亮靠近 13.5–17.5（4 小节）。
第四版的段落（旧小节号）：
画面段落（小节）：序 0–9 ｜ 工地 9–11.5 ｜ 广场倒计时 11.5–14.5 ｜ 航天飞机 14.5–17.5 ｜ 中继站 17.5–20.5 ｜ 点火 20.5–23.5 ｜ 拖船 23.5–27
海 27–30 ｜ 撤离 30–33 ｜ 潮水 33–35.5 ｜ 废城 35.5–38.5 ｜ 11 万公里 38.5–42 ｜ 近日点白天 42–44.5 ｜ 四次近日点 44.5–52.5（近日点在 45/47/49/51）
地下城 52.5–55.5 ｜ 脱离 55.5–59 ｜ 冰封 59–62 ｜ 冻海 62–65 ｜ 冰城 65–68 ｜ 冰原 68–70.5 ｜ 壁画 70.5–73.5 ｜ 熄火 73.5–77 ｜ 两颗星 77–80 ｜ 银河 80–85.5 ｜ 两代人 85.5–88.5 ｜ 片尾 88.5–93"""
from synth import *
BPM = 70; BEAT = 60 / BPM; BAR = 4 * BEAT; NB = 93; NBN = 99; TOTAL = NBN * BAR + 6
M = Mix(TOTAL)
CH = {'Dm': ['D3', 'A3', 'F4'], 'Dm7': ['D3', 'A3', 'C4', 'F4'], 'Bb': ['Bb2', 'F3', 'D4'], 'F': ['F3', 'C4', 'A4'], 'C': ['C3', 'G3', 'E4'], 'Gm': ['G2', 'D3', 'Bb3'], 'A': ['A2', 'E3', 'C#4'],
      'D': ['D3', 'A3', 'F#4'], 'Dm9': ['D3', 'A3', 'E4', 'F4'], 'Bbmaj7': ['Bb2', 'F3', 'A3', 'D4'], 'Gm6': ['G2', 'Bb3', 'D4', 'E4'], 'Asus': ['A2', 'D3', 'E3'], 'Fmaj7': ['F3', 'A3', 'C4', 'E4'], 'G': ['G2', 'D3', 'B3'], 'Bm': ['B2', 'F#3', 'D4']}
RT = {k: v[0][:-1] + str(int(v[0][-1]) - 1) for k, v in CH.items()}
# ---------- 和声进行 ----------
prog = (['Dm9'] * 4 + ['Bbmaj7'] * 3 + ['Asus', 'A'] +                       # 序 0–8：几乎静止
        ['Dm', 'Bb', 'F', 'C', 'Dm', 'Bb', 'Gm', 'A'] +                        # 9–16：工地、倒计时、点火
        ['Dm', 'Bb', 'F', 'C', 'Dm', 'Bb', 'Gm', 'A', 'Dm', 'Dm'] +            # 17–26：中继站、点火、拖船
        ['Bb', 'F', 'Gm', 'Dm', 'Bb', 'F', 'Gm', 'A'] +                        # 27–34：海、撤离、潮水
        ['Dm', 'Dm', 'Bbmaj7', 'Bbmaj7'] +                                     # 35–38：废城（极简）
        ['Gm', 'A', 'Dm', 'C', 'Gm6', 'Asus'] +                                # 39–44：11 万公里、白天
        ['Gm', 'Bb', 'Dm', 'C', 'Gm', 'Bb', 'F', 'A'] +                        # 45–52：四次近日点
        ['F', 'C', 'Dm'] +                                                     # 53–55：地下城（温暖）
        ['Bb', 'Gm', 'A', 'A'] +                                               # 56–59：脱离
        ['Dm9', 'Dm9', 'Bbmaj7', 'Bbmaj7', 'Dm9', 'Dm9', 'Gm6', 'Gm6', 'Dm9'] + # 60–68：冰封
        ['F', 'Fmaj7', 'Bb', 'Gm', 'C', 'C'] +                                 # 69–74：壁画、熄火
        ['Bb', 'C', 'D', 'G', 'D', 'Bm', 'G', 'A', 'D', 'D'] +                 # 75–84：两颗星、银河
        ['Bb', 'C', 'D', 'D', 'D', 'D', 'D', 'D'])                             # 85–92：两代人、片尾
assert len(prog) == NB, len(prog)
progN = prog[:7] + ['Bbmaj7', 'Gm6'] + prog[7:12] + ['Dm', 'Bb', 'Gm', 'F'] + prog[12:]      # 新时间线的和声：序延长 2 小节，月亮靠近 4 小节
assert len(progN) == NBN, len(progN)
# 旧时间 → 新时间
def tmap(t):
    b = t / BAR
    return t if b < 9 else t + 2 * BAR if b < 11.5 else t + 6 * BAR
_add = M.add
M.add = lambda t, y, g=1., pan=.5: _add(tmap(t), y, g, pan)      # 第四版写法里的小节号一律按旧时间线，自动换算
N = lambda t, y, g=1., pan=.5: _add(t, y, g, pan)                # 新时间线直接写
# ---------- 每小节的"情绪强度" 0–1（控制铺底音量、亮度、低音）----------
import numpy as _np
E = _np.zeros(NB)
def ramp(a, b, va, vb):
    for k in range(a, b): E[k] = va + (vb - va) * (k - a) / max(1, b - a - 1)
ramp(0, 9, .08, .2); ramp(9, 12, .25, .35); ramp(12, 14, .55, .75); ramp(14, 17, .8, .6); ramp(17, 21, .55, .8); ramp(21, 24, 1.0, .9); ramp(24, 27, .85, .7)
ramp(27, 30, .6, .55); ramp(30, 33, .45, .3); ramp(33, 36, .4, .35); ramp(36, 39, .12, .1); ramp(39, 42, .3, .6); ramp(42, 45, .65, .7)
ramp(45, 53, .75, 1.0); ramp(53, 56, .3, .35); ramp(56, 60, .6, .85); ramp(60, 69, .15, .18); ramp(69, 74, .3, .45); ramp(74, 77, .4, .3)
ramp(77, 80, .45, .7); ramp(80, 86, .75, 1.0); ramp(86, 89, .55, .4); ramp(89, 93, .35, .2)
EN = _np.concatenate([E[:7], [.22, .3], E[7:12], [.4, .46, .52, .58], E[12:]]); assert len(EN) == NBN
# ---------- 乐器 ----------
def strings(notes, dur, bright, vib=.3):
    y = pad(notes, dur, bright); n = y.shape[1]; t = np.arange(n) / SR
    v = 1 + .004 * vib * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / 1.5)
    return y * v
def choir(notes, dur):
    y = pad([n[:-1] + str(int(n[-1]) + 1) for n in notes], dur, 1500); n = y.shape[1]; t = np.arange(n) / SR
    y = lp(y[0], 2200), lp(y[1], 2200); y = np.array(y) * (1 + .02 * np.sin(2 * np.pi * 5.5 * t))
    return y * .9
def brass(nt, dur, g=1.):
    n = int(dur * SR); t = np.arange(n) / SR; f = n2f(m(nt)); y = saw(f, n) + .5 * saw(f * 1.003, n) + .4 * saw(f / 2, n)
    cutoff = 400 + 3200 * np.exp(-t * 4) + 900; y = lp(y, min(cutoff.max(), 4000)) * env(n, .06, dur * .4) * g
    return y * .6
def tick(g=1.):
    n = int(.04 * SR); t = np.arange(n) / SR; return lp(rng.normal(0, 1, n), 3500) * np.exp(-t * 180) * g
def riser(dur):
    n = int(dur * SR); t = np.arange(n) / SR; y = rng.normal(0, 1, n)
    out = np.zeros(n); seg = int(SR * .1)
    for i in range(0, n, seg):
        fc = 150 * (1 + 60 * (i / n) ** 2.2); out[i:i + seg] = lp(y[i:i + seg], fc)
    return out * (t / dur) ** 2.5 * .6
def hit(g=1.):
    n = int(2.2 * SR); t = np.arange(n) / SR; f = 60 + 120 * np.exp(-t * 14)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2) + lp(rng.normal(0, 1, n), 2500) * np.exp(-t * 12) * .9
    return np.tanh(y * 1.6) * g
def musicbox(nt, dur=2.5):
    n = int(dur * SR); t = np.arange(n) / SR; f = n2f(m(nt)); y = np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 9) + .15 * np.sin(2 * np.pi * f * 7.1 * t) * np.exp(-t * 14)
    return y * np.exp(-t * 2.4) * np.minimum(1, t / .002) * .35
def wind(dur, g=.1):
    n = int(dur * SR); t = np.arange(n) / SR; y = lp(rng.normal(0, 1, n), 600); mod = .5 + .5 * np.sin(2 * np.pi * .07 * t + 1) * np.sin(2 * np.pi * .19 * t)
    return y * mod * g * env(n, 3, 3)
def heartbeat(g=.5):
    n = int(.5 * SR); t = np.arange(n) / SR; b = lambda d: np.sin(2 * np.pi * 50 * (t - d)) * np.exp(-np.maximum(0, t - d) * 22) * (t >= d)
    return (b(0) + .6 * b(.17)) * g
def shimmer(notes, dur):
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for k, nt in enumerate(notes):
        f = n2f(m(nt)) * 4; y += np.sin(2 * np.pi * f * t + .4 * np.sin(2 * np.pi * (.3 + .17 * k) * t)) * (.5 + .5 * np.sin(2 * np.pi * (.11 + .07 * k) * t + k))
    return y * env(n, dur * .3, dur * .3) * .12 / len(notes)
# ---------- 铺底：按情绪强度 ----------
for b, c in enumerate(progN):
    if b >= 96: continue
    e = EN[b]; t0 = b * BAR; hold = BAR * 1.6 if b < 94 else BAR * 6
    bright = 300 + 2200 * e
    g = .35 + .75 * e
    y = strings(CH[c], hold, bright, vib=e)
    N(t0, y, g)
    if e > .55: N(t0, choir(CH[c], hold), (e - .55) * 1.4)
    if not (42 <= b < 45 or 66 <= b < 75): N(t0, sub(RT[c], BAR * 1.3), .35 + .6 * e)
# ---------- 序：空旷，一个音 + 低频心跳 ----------
for b, bt, nt in [(1, 0, 'A5'), (3, 2, 'F5'), (5, 1, 'E5'), (7, 0, 'D5'), (8, 2, 'C#5')]: M.add(b * BAR + bt * BEAT, piano(nt, 6), .4, .58)
N(0, wind(11 * BAR, .08), 1)
# ---------- 工地（9–11.5）：钢琴动机，带一点期待 ----------
for b, bt, nt in [(9, 0, 'D4'), (9, 2, 'F4'), (10, 0, 'A4'), (10, 1.5, 'C5'), (10, 3, 'A4'), (11, 0, 'Bb4'), (11, 2, 'D5')]: M.add(b * BAR + bt * BEAT, piano(nt, 4), .45, .55)
# ---------- 倒计时（11.5–12.5）：滴答、上升噪声，12.5 点火：重击 + 全奏 ----------
IGN = 12.5 * BAR
for k in range(16): M.add(11.5 * BAR + k * BEAT / 2, tick(.5 + .5 * k / 16), 1, .5 + .2 * (k % 2 - .5))
N(16.5 * BAR, riser(2 * BAR), 1)        # 上升噪声改到月亮靠近的末尾，推向倒计时
M.add(IGN, hit(1.2), 1); M.add(IGN, boom(), 1.0)
for nt in ['D2', 'A2', 'D3', 'F3', 'A3', 'D4']: M.add(IGN, brass(nt, 3.5, .5), .5, .5)
M.add(IGN, choir(['D3', 'A3', 'F4'], BAR * 2.5), .9)
# 点火后到航天飞机（12.5–17.5）：宽广的旋律
for b, bt, nt in [(13, 0, 'A4'), (13, 1.5, 'D5'), (13, 2.5, 'E5'), (13, 3, 'F5'), (14, 0, 'E5'), (14, 2, 'C5'), (15, 0, 'D5'), (15, 1.5, 'A4'), (15, 3, 'F5'), (16, 0, 'G5'), (16, 2, 'F5'), (16, 3, 'E5'), (17, 0, 'D5')]:
    M.add(b * BAR + bt * BEAT, piano(nt, 5), .6, .58); M.add(b * BAR + bt * BEAT, brass(nt[:-1] + str(int(nt[-1]) - 1), 1.6, .25), .3, .45)
# ---------- 中继站与三维点火（17.5–23.5）：引擎脉动 + 铜管动机，23.5 前推到最响 ----------
n8 = int(BEAT / 2 * SR); tt = np.arange(n8) / SR
for b in range(17, 27):
    for k in range(8):
        y = lp(rng.normal(0, 1, n8), 160) * np.exp(-tt * 16) * (1.0 if k % 2 == 0 else .55); M.add(b * BAR + k * BEAT / 2, y, .18 + .2 * E[b])
for b, bt, nt, g in [(18, 0, 'D3', .6), (18, 2, 'F3', .5), (19, 0, 'A3', .7), (20, 0, 'C4', .6), (20, 2, 'Bb3', .5), (21, 0, 'D4', .9), (22, 0, 'A3', .7), (22, 2, 'G3', .6), (23, 0, 'F3', .7), (23, 2, 'A3', 1.0)]:
    M.add(b * BAR + bt * BEAT, brass(nt, 1.8, g), .5, .5)
M.add(20.5 * BAR, hit(.9), 1); M.add(23.5 * BAR, hit(.8), 1); M.add(23.5 * BAR, boom(), .8)
# 拖船（23.5–27）：主题完整陈述
A1 = [(0, 0, 'A4'), (0, 1.5, 'D5'), (0, 2.5, 'E5'), (0, 3, 'F5'), (1, 0, 'E5'), (1, 2, 'C5'), (2, 0, 'D5'), (2, 1.5, 'A4'), (2, 3, 'F5'), (3, 0, 'G5'), (3, 2, 'F5'), (3, 3, 'E5')]
A2 = [(0, 0, 'D5'), (0, 2, 'Bb4'), (1, 0, 'F5'), (1, 1.5, 'A5'), (1, 3, 'G5'), (2, 0, 'F5'), (2, 2, 'D5'), (3, 0, 'E5'), (3, 2, 'C5')]
up = lambda p, k: [(b, bt, n[:-1] + str(int(n[-1]) + k)) for b, bt, n in p]
for b, bt, nt in A1: M.add((23 + b) * BAR + bt * BEAT, piano(nt, 5), .65, .58)
# ---------- 海与撤离（27–35.5）：转为忧伤，钢琴独白，越来越轻 ----------
F1 = [(0, 0, 'D5'), (1, 0, 'C5'), (1, 2, 'A4'), (2, 0, 'Bb4'), (2, 2, 'D5'), (3, 0, 'A4')]
for b0, p, g in [(27, A2, .55), (31, F1, .45), (33, [(0, 0, 'F5'), (0, 2, 'D5'), (1, 0, 'C5'), (1, 2, 'A4'), (2, 0, 'G4')], .4)]:
    for b, bt, nt in p: M.add((b0 + b) * BAR + bt * BEAT, piano(nt, 5), g, .58)
for b in range(27, 35): M.add(b * BAR, piano(CH[prog[b]][0], 4, .55), .25, .4)
# ---------- 废城（35.5–38.5）：几乎无声，风 + 心跳 + 两个音 ----------
M.add(35 * BAR, wind(4.5 * BAR, .14), 1)
for k in range(10): M.add(35.5 * BAR + k * 1.0, heartbeat(.45), 1)
M.add(36 * BAR, piano('D4', 6), .35, .5); M.add(37.5 * BAR, piano('F4', 6), .3, .6)
# ---------- 11 万公里 → 近日点白天（38.5–44.5）：重新积聚，闪烁的高音 ----------
M.add(38.5 * BAR, riser(3.5 * BAR), .7)
for b in range(39, 45): M.add(b * BAR, shimmer(CH[prog[b]], BAR * 1.3), .8 + .3 * (b - 39) / 5)
for b, bt, nt in [(39, 0, 'D5'), (40, 0, 'E5'), (41, 0, 'F5'), (41, 2, 'G5'), (42, 0, 'A5'), (43, 0, 'Bb5'), (44, 0, 'C#6')]: M.add(b * BAR + bt * BEAT, piano(nt, 4), .5, .58)
for b in range(42, 45):
    for k in range(4): M.add(b * BAR + k * BEAT, tick(.6), 1, .5)
# ---------- 四次近日点（44.5–52.5）：高潮，琶音 + 打击 + 铜管，一次比一次响 ----------
def pluck(nt, dur=1.2):
    n = int(dur * SR); t = np.arange(n) / SR; return lp(saw(n2f(m(nt)), n) * np.exp(-t * 5), 2600) * .35
PERI = [45, 47, 49, 51]
for b in range(44, 53):
    nt = CH[prog[b]]; seq = [nt[0], nt[1], nt[2], nt[1]] * 2; o = 1 + (b - 44) // 4
    for k, x in enumerate(seq): M.add(b * BAR + k * BEAT / 2, pluck(x[:-1] + str(int(x[-1]) + o)), .45 + .1 * (b - 44) / 8, .3 + .4 * (k % 2))
    for k in range(8): y = lp(rng.normal(0, 1, n8), 220) * np.exp(-tt * 14) * (1.0 if k % 2 == 0 else .55); M.add(b * BAR + k * BEAT / 2, y, .3)
for i, P in enumerate(PERI):
    g = .7 + .1 * i; M.add(P * BAR, hit(g), 1); M.add(P * BAR, boom(), g)
    for nt in ['D2', 'A2', 'D3', 'F3', 'A3']: M.add(P * BAR, brass(nt, 2.4, .35 + .15 * i), .5, .5)
for b, bt, nt in up(A1, 1): M.add((48 + b) * BAR + bt * BEAT, piano(nt, 5), .62, .58)
for b, bt, nt in [(0, 0, 'A5'), (0, 1.5, 'D6'), (0, 2.5, 'E6'), (0, 3, 'F6'), (1, 0, 'E6'), (1, 2, 'C6'), (2, 0, 'D6'), (2, 2, 'A5'), (3, 0, 'C#6'), (3, 2, 'E6')]: M.add((44 + b) * BAR + bt * BEAT, piano(nt, 5), .55, .58)
M.add(52.3 * BAR, riser(.7 * BAR), .6); M.add(52.5 * BAR, hit(1.0), 1)
# ---------- 地下城（52.5–55.5）：骤然安静，八音盒 ----------
for b in range(53, 56):
    c = CH[prog[b]]; seq = [c[0], c[2], c[1], c[2]] * 2
    for k, x in enumerate(seq): M.add(b * BAR + k * BEAT / 2, musicbox(x[:-1] + str(int(x[-1]) + 2)), .7, .4 + .2 * (k % 2))
# ---------- 脱离太阳（55.5–59）：庄严的铜管长音 ----------
for b, nt, g in [(56, 'Bb2', .5), (56, 'F3', .4), (57, 'G2', .5), (57, 'D3', .4), (58, 'A2', .6), (58, 'E3', .5), (58, 'C#4', .4)]: M.add(b * BAR, brass(nt, BAR * 1.2, g), .5, .5)
M.add(55.5 * BAR, hit(.7), 1)
# ---------- 冰封（59–70.5）：寒冷、稀疏，高音泛音像冰晶 ----------
M.add(59 * BAR, wind(12 * BAR, .12), 1)
for b in range(60, 70):
    if b % 2 == 0: M.add(b * BAR, shimmer(CH[prog[b]], BAR * 2.2), .7)
for b, bt, nt in [(60, 0, 'A5'), (62, 2, 'F5'), (64, 0, 'D5'), (65, 2, 'E5'), (67, 0, 'A4'), (68, 2, 'Bb4')]: M.add(b * BAR + bt * BEAT, musicbox(nt, 4), .6, .55)
for b in range(60, 69): M.add(b * BAR, sub(RT[prog[b]], BAR * 1.3), .25)
# ---------- 壁画（70.5–73.5）：转向明亮，F 大调钢琴 ----------
for b, bt, nt in [(70, 2, 'C5'), (71, 0, 'F5'), (71, 2, 'A5'), (72, 0, 'G5'), (72, 2, 'F5'), (73, 0, 'D5'), (73, 2, 'C5')]: M.add(b * BAR + bt * BEAT, piano(nt, 5), .55, .58)
for b in range(70, 74): M.add(b * BAR, piano(CH[prog[b]][0], 4, .55), .25, .4); M.add(b * BAR + 2 * BEAT, piano(CH[prog[b]][1], 3, .5), .2, .45)
# ---------- 熄火（73.5–77）：长音，几乎静止 ----------
M.add(74 * BAR, piano('E5', 8), .4, .58); M.add(75.5 * BAR, piano('G5', 8), .35, .6)
# ---------- 两颗星 → 银河（77–85.5）：D 大调，逐步到全片最响 ----------
mel = [(77, 0, 'F#5'), (77, 2, 'G5'), (78, 0, 'A5'), (78, 2, 'D6'), (79, 0, 'C#6'), (79, 2, 'A5'), (80, 0, 'B5'), (80, 2, 'D6'), (81, 0, 'E6'), (81, 2, 'C#6'), (82, 0, 'D6'), (82, 2, 'F#6'), (83, 0, 'E6'), (83, 2, 'D6'), (84, 0, 'A5'), (84, 2, 'F#6'), (85, 0, 'D6')]
for b, bt, nt in mel: M.add(b * BAR + bt * BEAT, piano(nt, 5), .62, .58); M.add(b * BAR + bt * BEAT, brass(nt[:-1] + str(int(nt[-1]) - 2), 1.6, .2 + .15 * (b - 77) / 8), .3, .45)
for b in range(80, 86):
    for k in range(8): y = lp(rng.normal(0, 1, n8), 200) * np.exp(-tt * 14) * (1.0 if k % 2 == 0 else .55); M.add(b * BAR + k * BEAT / 2, y, .28)
    c = CH[prog[b]]; seq = [c[0], c[1], c[2], c[1]] * 2
    for k, x in enumerate(seq): M.add(b * BAR + k * BEAT / 2, pluck(x[:-1] + str(int(x[-1]) + 2)), .5, .3 + .4 * (k % 2))
M.add(80 * BAR, hit(.9), 1); M.add(83 * BAR, hit(1.0), 1); M.add(83 * BAR, boom(), .9)
for nt in ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4']: M.add(83 * BAR, brass(nt, BAR * 2.5, .5), .5, .5)
M.add(83 * BAR, choir(['D3', 'A3', 'F#4'], BAR * 3), 1.0)
# ---------- 两代人、片尾（85.5–93）：回落，钢琴独奏到 D 大三和弦 ----------
for b, bt, nt in [(86, 0, 'A5'), (86, 2, 'F#5'), (87, 0, 'D5'), (88, 0, 'E5'), (88, 2, 'F#5'), (89, 0, 'A5'), (90, 0, 'F#5'), (91, 0, 'D5'), (92, 0, 'A4')]: M.add(b * BAR + bt * BEAT, piano(nt, 6), .5, .58)
for b in range(86, 92): M.add(b * BAR, piano(CH[prog[b]][0], 5, .55), .25, .4)
M.add(92 * BAR, musicbox('D6', 6), .5, .55); M.add(92 * BAR, musicbox('F#6', 6), .4, .6); M.add(92 * BAR, musicbox('A6', 6), .35, .5)


# ---------- 中国民族乐器（全部程序合成）----------
def guzheng(nt, dur=2.0, g=1.):
    """古筝：Karplus–Strong 弦 + 明亮的拨弦起音。"""
    f = n2f(m(nt)); P = int(SR / f); n = int(dur * SR); buf = rng.uniform(-1, 1, P) * np.hanning(P) ** .3
    damp = .996 if f < 400 else .993; blocks = []
    for _ in range(n // P + 1): blocks.append(buf); buf = damp * .5 * (buf + np.roll(buf, -1))
    out = np.concatenate(blocks)[:n]
    t = np.arange(n) / SR; out = lp(out, 5000) + .25 * saw(f, n) * np.exp(-t * 40)
    return out * np.minimum(1, t / .002) * .55 * g
def gz_gliss(n0, n1, dur=1.2, g=.6):
    """古筝刮奏：沿五声音阶从 n0 扫到 n1。"""
    pent = ['D', 'F', 'G', 'A', 'C']; a, b = m(n0), m(n1); notes = [k for k in range(min(a, b), max(a, b) + 1) if any(m(p + str(k // 12 - 1)) == k for p in pent)]
    if b < a: notes = notes[::-1]
    return [(i * dur / len(notes), guzheng(nn, 1.2, g * (.7 + .3 * i / len(notes)))) for i, nn in enumerate([f"{['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'][k % 12]}{k // 12 - 1}" for k in notes])]
def dizi(nt, dur, g=1., scoop=1):
    """笛子：几个泛音 + 气声 + 延迟出现的颤音，起音略带滑音。"""
    n = int(dur * SR); t = np.arange(n) / SR; f0 = n2f(m(nt))
    vib = 1 + .006 * np.sin(2 * np.pi * 5.3 * t) * np.clip((t - .35) / .5, 0, 1)
    sc = 2 ** (-.3 / 12 * np.exp(-t * 25) * scoop); f = f0 * vib * sc; ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) + .45 * np.sin(2 * ph) + .22 * np.sin(3 * ph) + .1 * np.sin(4 * ph) + .05 * np.sin(5 * ph)
    breath = lp(rng.normal(0, 1, n), 4000) - lp(rng.normal(0, 1, n), 1500); y += breath * .06 * (1 + np.exp(-t * 12))
    e = env(n, .09, min(.6, dur * .35)); return y * e * .3 * g
def erhu(nt, dur, g=1., frm=None):
    """二胡：弓弦锯齿 + 鼻音共振 + 较宽的颤音；frm 给出上一个音名时做滑音。"""
    n = int(dur * SR); t = np.arange(n) / SR; f1 = n2f(m(nt)); f0 = n2f(m(frm)) if frm else f1 * 2 ** (-.5 / 12)
    f = f0 + (f1 - f0) * np.clip(t / .14, 0, 1) ** .7; f = f * (1 + .011 * np.sin(2 * np.pi * 6.2 * t) * np.clip((t - .25) / .4, 0, 1))
    ph = 2 * np.pi * np.cumsum(f) / SR; y = np.zeros(n)
    for k in range(1, 18): y += np.sin(k * ph) / k ** .9
    b, a = sg.butter(2, [900 / (SR / 2), 1900 / (SR / 2)], 'band'); y = lp(y, 2800) + .9 * sg.lfilter(b, a, y)
    bow = lp(rng.normal(0, 1, n), 3000) * .03; e = env(n, .16, min(.7, dur * .4)); return (y * .32 + bow) * e * g
def bianzhong(nt, dur=5., g=1.):
    """编钟：非谐波分音，两组略失谐产生钟的拍音，高分音衰减快。"""
    n = int(dur * SR); t = np.arange(n) / SR; f = n2f(m(nt)); y = np.zeros(n)
    for r, a, d in [(1, 1, 1.1), (1.52, .55, 1.8), (2.43, .35, 2.6), (3.1, .22, 3.4), (4.05, .12, 4.5), (5.4, .06, 6)]:
        y += a * (np.sin(2 * np.pi * f * r * t) + .6 * np.sin(2 * np.pi * f * r * 1.004 * t)) * np.exp(-t * d)
    y += lp(rng.normal(0, 1, n), 6000) * np.exp(-t * 90) * .6
    return np.tanh(y * .8) * np.minimum(1, t / .003) * .5 * g
def dagu(g=1., f0=85):
    """大鼓：下扫的正弦 + 鼓皮噪声 + 木腔共振。"""
    n = int(1.4 * SR); t = np.arange(n) / SR; f = f0 * .55 + f0 * .45 * np.exp(-t * 18)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 4.5) + lp(rng.normal(0, 1, n), 900) * np.exp(-t * 25) * .8 + np.sin(2 * np.pi * 210 * t) * np.exp(-t * 30) * .3
    return np.tanh(y * 1.5) * g
# ---------- 升空长镜头（新 5–11）：笛子独奏，越飞越高 ----------
for b, nt, d in [(5.5, 'A5', 2.4), (6.5, 'C6', 1.6), (7.25, 'D6', 2.6), (8.5, 'A5', 1.6), (9.25, 'G5', 1.2), (9.75, 'F5', 2.0), (10.5, 'D5', 2.4)]: N(b * BAR, dizi(nt, d, .9), .6, .6)
# ---------- 月亮靠近（新 13.5–17.5）：古筝琶音一层层加密，大鼓每小节一记，越来越急 ----------
for b in range(13, 17):
    c = CH[progN[b + 1]]; seq = [c[0], c[1], c[2], c[1], c[0], c[2], c[1], c[2]]
    for k, x in enumerate(seq):
        if k % (3 - min(2, b - 13)) == 0 or b >= 15: N((b + .5) * BAR + k * BEAT / 2, guzheng(x[:-1] + str(int(x[-1]) + 1), 1.4), .5, .35 + .3 * (k % 2))
    N((b + .5) * BAR, dagu(.5 + .15 * (b - 13)), 1, .5)
    if b >= 15: N((b + .5) * BAR + 2 * BEAT, dagu(.4, 110), 1, .45)
for i, (nt, d) in enumerate([('D5', 1.6), ('F5', 1.6), ('A5', 2.2), ('C6', 2.6)]): N((13.5 + i) * BAR + 1 * BEAT, dizi(nt, d, .7), .45, .62)
for t0, y in gz_gliss('D4', 'D6', 1.0, .55): N(17.0 * BAR + t0, y, .6, .4)
# ---------- 倒计时与点火（旧 11.5–12.5 → 新 17.5–18.5）：大鼓代替部分滴答，点火时编钟 ----------
for k in range(8): N(17.5 * BAR + k * BEAT / 2, dagu(.35 + .06 * k, 95), 1, .5)
N(18.5 * BAR, bianzhong('D3', 7, 1.0), .7, .5); N(18.5 * BAR + .03, bianzhong('A3', 6, .6), .5, .6)
N(29.5 * BAR, bianzhong('D3', 6, .8), .6, .5)        # 拖船主题起始
# ---------- 海与潮水（旧 27–30、33–35.5 → 新 33–36、39–41.5）：古筝 ----------
for t0, y in gz_gliss('D4', 'A5', 1.4, .5): N(33.1 * BAR + t0, y, .55, .55)
for b, bt, nt in [(34, 0, 'D5'), (34, 2, 'Bb4'), (35, 0, 'F5'), (35, 1.5, 'A5'), (35, 3, 'G5'), (39.5, 0, 'F5'), (39.5, 2, 'D5'), (40.5, 0, 'C5'), (40.5, 2, 'A4'), (41.5, 0, 'G4')]: N(b * BAR + bt * BEAT, guzheng(nt, 2.4), .5, .55)
for b in range(39, 42):
    c = CH[progN[b]]
    for k, x in enumerate([c[0], c[2], c[1], c[2]]): N(b * BAR + k * BEAT, guzheng(x, 1.8), .3, .4 + .2 * (k % 2))
# ---------- 撤离与废城（旧 30–33、35.5–38.5 → 新 36–39、41.5–44.5）：二胡独白 ----------
prev = None
for b, bt, nt, d in [(36, 0, 'D5', 1.6), (36, 2, 'F5', 1.0), (36.75, 0, 'E5', 2.2), (37.5, 2, 'C5', 1.2), (38, 0, 'A4', 2.6), (38.75, 2, 'Bb4', .9), (39, 0, 'A4', 3.0)]:
    N(b * BAR + bt * BEAT, erhu(nt, d, .9, prev), .55, .45); prev = nt
prev = None
for b, bt, nt, d in [(42, 0, 'A4', 3.0), (43, 0, 'F4', 2.0), (43.5, 2, 'G4', 1.2), (44, 0, 'D4', 4.0)]:
    N(b * BAR + bt * BEAT, erhu(nt, d, .8, prev), .5, .45); prev = nt
# ---------- 四次近日点（旧 45/47/49/51 → 新 51/53/55/57）：编钟 + 大鼓 ----------
for i, P in enumerate([51, 53, 55, 57]):
    N(P * BAR, bianzhong(['D3', 'F3', 'A3', 'D4'][i], 5, .8 + .1 * i), .6, .5); N(P * BAR, dagu(.9, 70), 1, .5)
    for k in range(1, 8): N(P * BAR + k * BEAT / 2, dagu(.25 + .15 * (k % 2 == 0), 95), 1, .4 + .2 * (k % 2))
N(58.5 * BAR, bianzhong('A3', 6, .9), .6, .5)
# ---------- 壁画（旧 70.5–73.5 → 新 76.5–79.5）：F 大调笛子 ----------
for b, nt, d in [(76.75, 'C6', 1.6), (77.5, 'A5', 1.2), (78, 'G5', 1.4), (78.75, 'F5', 2.4), (79.5, 'D5', 2.0)]: N(b * BAR, dizi(nt, d, .7), .45, .6)
# ---------- 银河（旧 83 → 新 89）：编钟 + 大鼓，全片最响处 ----------
N(89 * BAR, bianzhong('D3', 8, 1.0), .7, .5); N(89 * BAR + .04, bianzhong('A3', 7, .7), .5, .6); N(89 * BAR, dagu(1.0, 65), 1, .5)
for b in range(86, 92):
    for k in (0, 2): N(b * BAR + k * BEAT, dagu(.45, 80), 1, .5)
# ---------- 片尾（旧 89–92 → 新 95–98）：笛子收尾，落在 D 大调的 A 上 ----------
for b, nt, d in [(95.5, 'F#5', 2.0), (96.5, 'E5', 1.6), (97.25, 'D5', 3.2), (98.25, 'A5', 5.0)]: N(b * BAR, dizi(nt, d, .6, 1), .45, .6)
M.add = _add
M.write('mv6_music.wav', TOTAL); print('ok', round(TOTAL, 2))
