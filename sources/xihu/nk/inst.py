import sys; sys.path.insert(0, '/home/claude/mt')
from synth import *
import numpy as _np
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

