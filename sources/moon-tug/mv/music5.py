"""《月球拖船》音乐短片第四版配乐（情绪起伏加强版）。93 小节，70 BPM，D 小调→D 大调。
画面段落（小节）：序 0–9 ｜ 工地 9–11.5 ｜ 广场倒计时 11.5–14.5 ｜ 航天飞机 14.5–17.5 ｜ 中继站 17.5–20.5 ｜ 点火 20.5–23.5 ｜ 拖船 23.5–27
海 27–30 ｜ 撤离 30–33 ｜ 潮水 33–35.5 ｜ 废城 35.5–38.5 ｜ 11 万公里 38.5–42 ｜ 近日点白天 42–44.5 ｜ 四次近日点 44.5–52.5（近日点在 45/47/49/51）
地下城 52.5–55.5 ｜ 脱离 55.5–59 ｜ 冰封 59–62 ｜ 冻海 62–65 ｜ 冰城 65–68 ｜ 冰原 68–70.5 ｜ 壁画 70.5–73.5 ｜ 熄火 73.5–77 ｜ 两颗星 77–80 ｜ 银河 80–85.5 ｜ 两代人 85.5–88.5 ｜ 片尾 88.5–93"""
from synth import *
BPM = 70; BEAT = 60 / BPM; BAR = 4 * BEAT; NB = 93; TOTAL = NB * BAR + 6
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
# ---------- 每小节的"情绪强度" 0–1（控制铺底音量、亮度、低音）----------
import numpy as _np
E = _np.zeros(NB)
def ramp(a, b, va, vb):
    for k in range(a, b): E[k] = va + (vb - va) * (k - a) / max(1, b - a - 1)
ramp(0, 9, .08, .2); ramp(9, 12, .25, .35); ramp(12, 14, .55, .75); ramp(14, 17, .8, .6); ramp(17, 21, .55, .8); ramp(21, 24, 1.0, .9); ramp(24, 27, .85, .7)
ramp(27, 30, .6, .55); ramp(30, 33, .45, .3); ramp(33, 36, .4, .35); ramp(36, 39, .12, .1); ramp(39, 42, .3, .6); ramp(42, 45, .65, .7)
ramp(45, 53, .75, 1.0); ramp(53, 56, .3, .35); ramp(56, 60, .6, .85); ramp(60, 69, .15, .18); ramp(69, 74, .3, .45); ramp(74, 77, .4, .3)
ramp(77, 80, .45, .7); ramp(80, 86, .75, 1.0); ramp(86, 89, .55, .4); ramp(89, 93, .35, .2)
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
for b, c in enumerate(prog):
    if b >= 90: continue
    e = E[b]; t0 = b * BAR; hold = BAR * 1.6 if b < 88 else BAR * 6
    bright = 300 + 2200 * e
    g = .35 + .75 * e
    y = strings(CH[c], hold, bright, vib=e)
    M.add(t0, y, g)
    if e > .55: M.add(t0, choir(CH[c], hold), (e - .55) * 1.4)
    if not (36 <= b < 39 or 60 <= b < 69): M.add(t0, sub(RT[c], BAR * 1.3), .35 + .6 * e)
# ---------- 序：空旷，一个音 + 低频心跳 ----------
for b, bt, nt in [(1, 0, 'A5'), (3, 2, 'F5'), (5, 1, 'E5'), (7, 0, 'D5'), (8, 2, 'C#5')]: M.add(b * BAR + bt * BEAT, piano(nt, 6), .4, .58)
M.add(0, wind(9 * BAR, .08), 1)
# ---------- 工地（9–11.5）：钢琴动机，带一点期待 ----------
for b, bt, nt in [(9, 0, 'D4'), (9, 2, 'F4'), (10, 0, 'A4'), (10, 1.5, 'C5'), (10, 3, 'A4'), (11, 0, 'Bb4'), (11, 2, 'D5')]: M.add(b * BAR + bt * BEAT, piano(nt, 4), .45, .55)
# ---------- 倒计时（11.5–12.5）：滴答、上升噪声，12.5 点火：重击 + 全奏 ----------
IGN = 12.5 * BAR
for k in range(16): M.add(11.5 * BAR + k * BEAT / 2, tick(.5 + .5 * k / 16), 1, .5 + .2 * (k % 2 - .5))
M.add(10.5 * BAR, riser(2 * BAR), 1)
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
M.write('mv5_music.wav', TOTAL); print('ok', round(TOTAL, 2))
