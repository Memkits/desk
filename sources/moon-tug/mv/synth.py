"""月球拖船 MV 配乐：纯程序合成（numpy/scipy），无采样。"""
import numpy as np, scipy.signal as sg, wave
SR = 44100
def n2f(n): return 440 * 2 ** ((n - 69) / 12)
NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def m(s):  # 'D4' 'Bb3' 'F#4'
    b = NOTE[s[0]]; i = 1
    while s[i] in '#b': b += 1 if s[i] == '#' else -1; i += 1
    return b + 12 * (int(s[i:]) + 1)
rng = np.random.default_rng(1)
def saw(f, n, ph=0):  # 带限锯齿：加法合成
    t = np.arange(n) / SR; y = np.zeros(n); K = int(min(40, SR / 2 / f))
    for k in range(1, K + 1): y += np.sin(2 * np.pi * k * f * t + ph * k) / k
    return y * .6
def env(n, a, r, s=1.0):
    e = np.ones(n) * s; A = int(a * SR); R = int(r * SR)
    e[:A] = np.linspace(0, s, A) ** 2 if A else e[:A]; 
    if R: e[-R:] *= np.linspace(1, 0, R) ** 1.5
    return e
def lp(x, fc, q=.7):
    b, a = sg.butter(2, min(fc, SR * .45) / (SR / 2)); return sg.lfilter(b, a, x)
def pad(notes, dur, bright=900):
    n = int(dur * SR); L = np.zeros(n); R = np.zeros(n)
    for nt in notes:
        f = n2f(m(nt))
        for d, pan in [(-.09, .2), (-.03, .45), (.03, .55), (.09, .8)]:
            y = saw(f * 2 ** (d / 12), n, rng.uniform(0, 6.28)); L += y * (1 - pan); R += y * pan
    e = env(n, dur * .35, dur * .45); L = lp(L, bright) * e; R = lp(R, bright) * e
    return np.stack([L, R]) / (len(notes) * 4)
def piano(nt, dur, vel=1.):
    n = int(dur * SR); t = np.arange(n) / SR; f = n2f(m(nt)); y = np.zeros(n); B = .0004
    for k in range(1, 14):
        fk = f * k * np.sqrt(1 + B * k * k)
        if fk > SR / 2: break
        y += np.sin(2 * np.pi * fk * t) * np.exp(-t * (1.2 + k * .55)) / k ** 1.1
    y += lp(rng.normal(0, 1, n) * np.exp(-t * 60), 3000) * .08
    y *= np.minimum(1, t / .004) * vel
    return y * .5
def boom(dur=3.5):
    n = int(dur * SR); t = np.arange(n) / SR; f = 38 + 60 * np.exp(-t * 9)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.6)
    y += lp(rng.normal(0, 1, n), 400) * np.exp(-t * 7) * .5
    return np.tanh(y * 1.4)
def sub(nt, dur):
    n = int(dur * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * n2f(m(nt)) * t) * env(n, dur * .3, dur * .3) * .35
def reverb(x, sec=4.5, mixw=.35):
    n = int(sec * SR); t = np.arange(n) / SR; out = []
    for c in range(2):
        ir = rng.normal(0, 1, n) * np.exp(-t * 6.9 / sec); ir = lp(ir, 5000); ir[:int(.02 * SR)] *= np.linspace(0, 1, int(.02 * SR)); ir /= np.sqrt((ir ** 2).sum())
        out.append(sg.fftconvolve(x[c], ir)[:x.shape[1]])
    return x * (1 - mixw) + np.array(out) * mixw * 3
class Mix:
    def __init__(s, sec): s.b = np.zeros((2, int(sec * SR) + SR * 6))
    def add(s, t, y, g=1., pan=.5):
        i = int(t * SR); y = np.atleast_2d(y)
        if y.shape[0] == 1: y = np.vstack([y[0] * (1 - pan) * 2 ** .5, y[0] * pan * 2 ** .5])
        s.b[:, i:i + y.shape[1]] += y[:, :s.b.shape[1] - i] * g
    def write(s, path, sec):
        x = reverb(s.b); x = x[:, :int(sec * SR)]
        fade = int(2.5 * SR); x[:, -fade:] *= np.linspace(1, 0, fade)
        x = np.tanh(x / np.abs(x).max() * 1.15) * .89
        with wave.open(path, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x.T * 32767).astype(np.int16).tobytes())
if __name__ == '__main__':
    BPM = 70; BAR = 4 * 60 / BPM; M = Mix(30)
    prog = [['D3', 'A3', 'F4'], ['Bb2', 'F3', 'D4'], ['F3', 'C4', 'A4'], ['C3', 'G3', 'E4'], ['D3', 'A3', 'F4'], ['Bb2', 'F3', 'D4'], ['G2', 'D3', 'Bb3'], ['A2', 'E3', 'C#4']]
    roots = ['D2', 'Bb1', 'F2', 'C2', 'D2', 'Bb1', 'G1', 'A1']
    for i, (ch, r) in enumerate(zip(prog, roots)):
        t0 = i * BAR * .999; M.add(t0, pad(ch, BAR * 1.6, 600 + 260 * i), .9); M.add(t0, sub(r, BAR * 1.3), .8)
    M.add(2 * BAR, boom(), .9)
    mel = [(2, 0, 'A4'), (2, 1.5, 'D5'), (2, 2.5, 'E5'), (2, 3, 'F5'), (3, 0, 'E5'), (3, 2, 'C5'), (4, 0, 'D5'), (4, 1.5, 'A4'), (4, 3, 'F5'), (5, 0, 'G5'), (5, 2, 'F5'), (5, 3, 'E5'), (6, 0, 'D5'), (6, 2, 'Bb4'), (7, 0, 'C#5'), (7, 2, 'E5')]
    for bar, beat, nt in mel: M.add(bar * BAR + beat * 60 / BPM, piano(nt, 4), .55, .58)
    for bar in range(2, 8):
        for beat in (0, 2): M.add(bar * BAR + beat * 60 / BPM, piano('D3' if bar % 2 == 0 else 'A2', 3, .5), .35, .4)
    M.write('sketch.wav', 8 * BAR + 3); print('ok', 8 * BAR + 3)
