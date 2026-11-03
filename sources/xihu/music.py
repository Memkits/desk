"""《无限西湖》配乐：程序合成，60 BPM，76 小节（304 秒），D 宫调式（D E F# A B）。
段落（秒）：序 0–42 ｜ 分形 42–102 ｜ 庞加莱 102–160 ｜ 时空 160–217 ｜ 交织 217–265 ｜ 尾声 265–304"""
import sys; sys.path.insert(0, '/home/claude/mt')
from synth import *
import numpy as _np
BPM = 60; BEAT = 60 / BPM; BAR = 4 * BEAT; NB = 76; TOTAL = NB * BAR + 4
M = Mix(TOTAL)
CH = {'D': ['D3', 'A3', 'F#4'], 'Dadd9': ['D3', 'A3', 'E4', 'F#4'], 'Bm': ['B2', 'F#3', 'D4'], 'Bm7': ['B2', 'F#3', 'A3', 'D4'], 'G': ['G2', 'D3', 'B3'], 'Gmaj7': ['G2', 'D3', 'F#3', 'B3'], 'A': ['A2', 'E3', 'C#4'], 'Asus': ['A2', 'D3', 'E3'], 'Em': ['E3', 'B3', 'G4'], 'Em7': ['E3', 'B3', 'D4', 'G4'], 'F#m': ['F#3', 'C#4', 'A4']}
RT = {k: v[0][:-1] + str(int(v[0][-1]) - 1) for k, v in CH.items()}
def strings(notes, dur, bright, vib=.3):
    y = pad(notes, dur, bright); n = y.shape[1]; t = np.arange(n) / SR
    return y * (1 + .004 * vib * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / 1.5))
def wind(dur, g=.1):
    n = int(dur * SR); t = np.arange(n) / SR; y = lp(rng.normal(0, 1, n), 600); mod = .5 + .5 * np.sin(2 * np.pi * .07 * t + 1) * np.sin(2 * np.pi * .19 * t)
    return y * mod * g * env(n, 3, 3)
def shimmer(notes, dur):
    n = int(dur * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for k, nt in enumerate(notes):
        f = n2f(m(nt)) * 4; y += np.sin(2 * np.pi * f * t + .4 * np.sin(2 * np.pi * (.3 + .17 * k) * t)) * (.5 + .5 * np.sin(2 * np.pi * (.11 + .07 * k) * t + k))
    return y * env(n, dur * .3, dur * .3) * .12 / len(notes)
def water(dur, g=.08):
    """水声：带通噪声的细碎起伏。"""
    n = int(dur * SR); t = np.arange(n) / SR; y = lp(rng.normal(0, 1, n), 2400) - lp(rng.normal(0, 1, n), 500)
    mod = .4 + .6 * np.abs(np.sin(2 * np.pi * .23 * t) * np.sin(2 * np.pi * .61 * t + 2)); return y * mod * g * env(n, 2, 2)
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

# ---------- 和声（每小节）----------
prog = (['Dadd9'] * 4 + ['Gmaj7'] * 3 + ['Asus'] * 3 +                                   # 序 0–10
        ['D', 'Bm7', 'G', 'A', 'D', 'Bm7', 'Em7', 'A', 'D', 'G', 'Bm', 'A', 'D', 'G', 'A'] +   # 分形 10–25
        ['Bm', 'Bm', 'Gmaj7', 'Gmaj7', 'Em7', 'Em7', 'F#m', 'F#m', 'Bm', 'G', 'A', 'A', 'Bm', 'Gmaj7'] +   # 庞加莱 25–39
        ['D', 'A', 'Bm', 'G', 'Em7', 'A', 'D', 'G', 'D', 'Bm', 'G', 'A', 'D', 'D'] +      # 时空 40–53
        ['G', 'A', 'Bm', 'G', 'D', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A'] +                   # 交织 54–65
        ['Dadd9', 'Dadd9', 'Gmaj7', 'Gmaj7', 'Dadd9', 'Dadd9', 'Dadd9', 'Dadd9', 'Dadd9', 'Dadd9', 'Dadd9'])   # 尾声 65–75
assert len(prog) == NB, len(prog)
E = _np.zeros(NB)
def ramp(a, b, va, vb):
    for k in range(a, b): E[k] = va + (vb - va) * (k - a) / max(1, b - a - 1)
ramp(0, 3, .05, .12); ramp(3, 10, .15, .3); ramp(10, 25, .35, .55); ramp(25, 40, .45, .6); ramp(40, 54, .5, .7); ramp(54, 62, .75, 1.0); ramp(62, 66, .9, .5); ramp(66, 76, .35, .1)
for b, c in enumerate(prog):
    if b >= 74: continue
    e = E[b]; t0 = b * BAR; hold = BAR * 1.6 if b < 72 else BAR * 5
    M.add(t0, strings(CH[c], hold, 300 + 2000 * e, vib=e), .3 + .7 * e)
    if b < 10 or b >= 66: continue
    M.add(t0, sub(RT[c], BAR * 1.3), .25 + .5 * e)
M.add(0, water(42, .07), 1); M.add(0, wind(44, .06), 1); M.add(262, water(44, .05), 1)
# ---------- 序：古筝泛音点缀，钟一声 ----------
for b, bt, nt in [(1, 0, 'A5'), (2, 2, 'F#5'), (4, 1, 'D5'), (5, 3, 'E5'), (7, 0, 'B4'), (8, 2, 'A4')]: M.add(b * BAR + bt * BEAT, guzheng(nt, 3.0, .7), .45, .55)
M.add(3 * BAR, bianzhong('D3', 7, .5), .5, .5)
M.add(10 * BAR + 2 * BEAT, dagu(.5, 70), 1, .5)
# ---------- 分形（42–102）：笛子主题；同一动机以两倍速与半速同时出现（自相似）----------
MOT = [(0, 0, 'F#5', 1.5), (0, 1.5, 'A5', .8), (0, 2.5, 'B5', 1.4), (1, 0, 'A5', .8), (1, 1, 'F#5', 2.2), (2, 0, 'E5', 1.2), (2, 1.5, 'D5', 2.4)]
def motif(t0, scale, inst, g, oct=0, pan=.5):
    for b, bt, nt, d in MOT:
        n2 = nt[:-1] + str(int(nt[-1]) + oct); M.add(t0 + (b * BAR + bt * BEAT) * scale, inst(n2, d * scale, g), 1, pan)
motif(11 * BAR, 1.0, lambda n, d, g: dizi(n, d, g), .55, 0, .58)
motif(15 * BAR, 1.0, lambda n, d, g: dizi(n, d, g), .55, 0, .58)
motif(15 * BAR, .5, lambda n, d, g: guzheng(n, d * 1.4, g), .42, 1, .4)       # 两倍速的古筝
motif(15 * BAR, .5 * .5, lambda n, d, g: guzheng(n, d * 1.4, g * .7), .32, 2, .35)   # 四倍速
motif(19 * BAR, 2.0, lambda n, d, g: erhu(n, d, g), .5, -1, .45)                  # 半速的二胡
motif(19 * BAR, 1.0, lambda n, d, g: dizi(n, d, g), .5, 0, .6)
for b in range(11, 25):
    c = CH[prog[b]]; seq = [c[0], c[1], c[2], c[1]] * 2
    for k, x in enumerate(seq):
        if k % 2 == 0 or b >= 17: M.add(b * BAR + k * BEAT / 2, guzheng(x[:-1] + str(int(x[-1]) + 1), 1.6, .8), .28, .35 + .3 * (k % 2))
# ---------- 庞加莱（102–160）：二胡长音 + 编钟，和声在 Bm 周围游走 ----------
prev = None
for b, bt, nt, d in [(26, 0, 'F#5', 3.5), (27, 0, 'D5', 2.5), (27, 3, 'E5', 1.5), (28, 1, 'F#5', 3.0), (29, 1, 'B4', 4.0), (31, 0, 'A4', 2.5), (31, 3, 'B4', 1.2), (32, 1, 'D5', 3.5), (33, 2, 'C#5', 2.0), (34, 0, 'B4', 4.0)]:
    M.add(b * BAR + bt * BEAT, erhu(nt, d, .85, prev), .5, .45); prev = nt
for b, nt in [(25, 'B2'), (29, 'G3'), (33, 'E3'), (37, 'B2')]: M.add(b * BAR, bianzhong(nt, 7, .7), .5, .5)
for b in range(25, 39):
    if b % 2 == 0: M.add(b * BAR, shimmer(CH[prog[b]], BAR * 2.2), .6)
for b in range(35, 39):
    c = CH[prog[b]]; seq = [c[2], c[1], c[0], c[1]] * 2
    for k, x in enumerate(seq): M.add(b * BAR + k * BEAT / 2, guzheng(x[:-1] + str(int(x[-1]) + 1), 1.4, .7), .25, .35 + .3 * (k % 2))
# ---------- 时空（160–217）：四个时代的动机轮流出现，再叠在一起 ----------
TANG = [(0, 0, 'A5', 1.2), (0, 1, 'B5', .8), (0, 2, 'D6', 1.6), (1, 0, 'B5', 1.0), (1, 1.5, 'A5', 2.0)]
SONG = [(0, 0, 'F#5', .8), (0, 1, 'E5', .8), (0, 2, 'D5', 1.2), (1, 0, 'B4', 1.0), (1, 2, 'D5', 1.8)]
MING = [(0, 0, 'D4', 3.0), (1, 2, 'A3', 3.0)]
NOW  = [(0, 0, 'F#4', 1.0), (0, 1, 'A4', 1.0), (0, 2, 'D5', 1.0), (0, 3, 'E5', 1.0), (1, 0, 'F#5', 2.0)]
def play(t0, seq, inst, g, pan): 
    for b, bt, nt, d in seq: M.add(t0 + b * BAR + bt * BEAT, inst(nt, d), g, pan)
play(40 * BAR, TANG, lambda n, d: dizi(n, d, .8), .5, .6)
play(42 * BAR, SONG, lambda n, d: guzheng(n, d * 1.6, .9), .5, .4)
play(44 * BAR, MING, lambda n, d: bianzhong(n, d + 2, .6), .5, .5)
play(46 * BAR, NOW, lambda n, d: piano(n, d + 2), .5, .55)
for t0 in (48 * BAR, 50 * BAR):
    play(t0, TANG, lambda n, d: dizi(n, d, .7), .4, .62); play(t0, SONG, lambda n, d: guzheng(n, d * 1.6, .8), .4, .38); play(t0, MING, lambda n, d: bianzhong(n, d + 2, .5), .4, .5); play(t0, NOW, lambda n, d: piano(n, d + 2), .4, .55)
for b in range(48, 54):
    for k in (0, 2): M.add(b * BAR + k * BEAT, dagu(.35, 80), 1, .5)
# ---------- 交织（217–265）：全奏，大鼓推进，主题回到笛子 ----------
for b in range(54, 64):
    c = CH[prog[b]]; seq = [c[0], c[1], c[2], c[1]] * 2
    for k, x in enumerate(seq): M.add(b * BAR + k * BEAT / 2, guzheng(x[:-1] + str(int(x[-1]) + 1), 1.4, .9), .32, .35 + .3 * (k % 2))
    for k in range(4): M.add(b * BAR + k * BEAT, dagu(.45 if k % 2 == 0 else .3, 75), 1, .5)
    M.add(b * BAR, choir(CH[c], BAR * 1.6), .35 + .35 * E[b]) if False else None
motif(55 * BAR, 1.0, lambda n, d, g: dizi(n, d, g), .6, 0, .6); motif(55 * BAR, .5, lambda n, d, g: guzheng(n, d * 1.4, g), .4, 1, .4)
motif(59 * BAR, 1.0, lambda n, d, g: erhu(n, d, g), .5, -1, .42); motif(59 * BAR, 1.0, lambda n, d, g: dizi(n, d, g), .55, 0, .6)
M.add(62 * BAR, bianzhong('D3', 8, 1.0), .7, .5); M.add(62 * BAR, dagu(1.0, 62), 1, .5); M.add(62 * BAR + .05, bianzhong('A3', 7, .6), .5, .6)
M.add(61.5 * BAR, riser(2 * BAR), .5) if 'riser' in dir() else None
# ---------- 尾声（265–304）：笛子独奏收尾 ----------
for b, bt, nt, d in [(67, 0, 'A5', 2.4), (68, 0, 'F#5', 1.6), (68, 2, 'E5', 1.6), (69, 0, 'D5', 3.5), (70, 2, 'B4', 2.0), (71, 1, 'A4', 3.5), (73, 0, 'D5', 5.0)]: M.add(b * BAR + bt * BEAT, dizi(nt, d, .7), .5, .58)
for b, bt, nt in [(66, 0, 'D5'), (67, 2, 'A5'), (69, 0, 'F#5'), (71, 0, 'D5'), (72, 2, 'A4')]: M.add(b * BAR + bt * BEAT, guzheng(nt, 3.0, .6), .3, .4)
M.add(74 * BAR, bianzhong('D3', 8, .5), .45, .5)
M.write('music.wav', TOTAL); print('ok', round(TOTAL, 2))
