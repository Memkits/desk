"""《月球拖船》音乐短片第二版配乐：84 小节，70 BPM，D 小调。"""
from synth import *
BPM = 70; BEAT = 60 / BPM; BAR = 4 * BEAT; NB = 84; TOTAL = NB * BAR + 6
M = Mix(TOTAL)
CH = {'Dm': ['D3', 'A3', 'F4'], 'Bb': ['Bb2', 'F3', 'D4'], 'F': ['F3', 'C4', 'A4'], 'C': ['C3', 'G3', 'E4'], 'Gm': ['G2', 'D3', 'Bb3'], 'A': ['A2', 'E3', 'C#4'], 'D': ['D3', 'A3', 'F#4'], 'Dm9': ['D3', 'A3', 'E4', 'F4']}
RT = {'Dm': 'D2', 'Bb': 'Bb1', 'F': 'F2', 'C': 'C2', 'Gm': 'G1', 'A': 'A1', 'D': 'D2', 'Dm9': 'D2'}
L4 = ['Dm', 'Bb', 'F', 'C']
prog = (['Dm9', 'Dm9', 'Bb', 'Bb', 'Gm', 'Gm', 'Bb', 'A', 'A'] +            # 序 0-8
        L4 + L4 + ['A'] +                                                    # 点火 9-17
        L4 * 3 + ['Gm', 'Bb', 'A'] +                                         # 拖船 18-32
        ['Gm', 'Bb', 'Dm', 'C'] * 3 + ['Gm', 'Bb', 'F', 'A', 'A'] +          # 近日点 33-49
        ['Bb', 'F', 'Gm', 'Dm'] * 4 + ['A', 'A'] +                           # 告别 50-67
        ['Bb', 'C', 'Dm', 'F'] * 2 + ['Bb', 'C', 'D', 'D', 'D', 'D', 'D', 'D'])  # 远方 68-83
assert len(prog) == NB, len(prog)
SEC = [(0, 9, 'intro'), (9, 18, 'ign'), (18, 33, 'tug'), (33, 50, 'peri'), (50, 68, 'fare'), (68, 84, 'far')]
sec = lambda b: next(n for a, e, n in SEC if a <= b < e)
def bright(b):
    s = sec(b)
    return {'intro': 260 + 40 * b, 'ign': 700 + 90 * (b - 9), 'tug': 1300, 'peri': 1400 + 80 * (b - 33), 'fare': 700, 'far': 900 + 110 * (b - 68)}[s]
for b, c in enumerate(prog):
    if b >= 79: continue
    s = sec(b); g = {'intro': .7, 'fare': .72}.get(s, .9)
    hold = BAR * (5 + 6) if b == 78 else BAR * 1.6
    M.add(b * BAR, pad(CH[c], hold, bright(b)), g); M.add(b * BAR, sub(RT[c], BAR * (1.3 if b < 78 else 6)), .8 if s != 'intro' else .6)
for b, g in [(9, .9), (12, 1.0), (15, .6), (36, .8), (38, .8), (40, .85), (42, 1.0), (46.5, .7)]: M.add(b * BAR, boom(), g)
n8 = int(BEAT / 2 * SR); tt = np.arange(n8) / SR
for b in range(12, 50):
    if 21 <= b < 33 and b % 2: continue
    for k in range(8):
        y = lp(rng.normal(0, 1, n8), 180) * np.exp(-tt * 18) * (1.0 if k % 2 == 0 else .6); M.add(b * BAR + k * BEAT / 2, y, .2 if b < 33 else .28)
def pluck(nt, dur=1.2):
    n = int(dur * SR); t = np.arange(n) / SR; return lp(saw(n2f(m(nt)), n) * np.exp(-t * 5), 2200) * .35
for b in range(35, 50):
    nt = CH[prog[b]]; seq = [nt[0], nt[1], nt[2], nt[1]] * 2; o = 2 if b >= 42 else 1
    for k, x in enumerate(seq): M.add(b * BAR + k * BEAT / 2, pluck(x[:-1] + str(int(x[-1]) + o)), .5 if b < 42 else .6, .3 + .4 * (k % 2))
A1 = [(0, 0, 'A4'), (0, 1.5, 'D5'), (0, 2.5, 'E5'), (0, 3, 'F5'), (1, 0, 'E5'), (1, 2, 'C5'), (2, 0, 'D5'), (2, 1.5, 'A4'), (2, 3, 'F5'), (3, 0, 'G5'), (3, 2, 'F5'), (3, 3, 'E5')]
A2 = [(0, 0, 'D5'), (0, 2, 'Bb4'), (1, 0, 'F5'), (1, 1.5, 'A5'), (1, 3, 'G5'), (2, 0, 'F5'), (2, 2, 'D5'), (3, 0, 'E5'), (3, 2, 'C5')]
F1 = [(0, 0, 'D5'), (1, 0, 'C5'), (1, 2, 'A4'), (2, 0, 'Bb4'), (2, 2, 'D5'), (3, 0, 'A4')]
up = lambda p, k: [(b, bt, n[:-1] + str(int(n[-1]) + k)) for b, bt, n in p]
mel = [(2, 0, 'A5'), (4, 2, 'F5'), (6, 1, 'E5'), (8, 0, 'D5')]
for b0, p in [(18, A1), (22, A2), (26, A1), (30, [(0, 0, 'D5'), (0, 2, 'F5'), (1, 0, 'E5'), (2, 0, 'C#5'), (2, 2, 'E5')]),
              (42, up(A1, 1)), (46, up(A2, 1)),
              (50, F1), (54, F1), (58, [(0, 0, 'F5'), (0, 2, 'D5'), (1, 0, 'C5'), (1, 2, 'A4'), (2, 0, 'G4'), (2, 2, 'Bb4'), (3, 0, 'A4')]), (62, F1), (66, [(0, 0, 'E5'), (1, 0, 'C#5')]),
              (68, [(0, 0, 'F5'), (1, 0, 'G5'), (2, 0, 'A5'), (2, 2, 'D6'), (3, 0, 'C6'), (3, 2, 'A5')]), (72, [(0, 0, 'Bb5'), (0, 2, 'D6'), (1, 0, 'E6'), (1, 2, 'C6'), (2, 0, 'D6'), (3, 0, 'A5')]),
              (76, [(0, 0, 'F5'), (1, 0, 'G5'), (2, 0, 'F#5'), (2, 1, 'A5'), (2, 2, 'D6'), (3, 0, 'F#6'), (3, 2, 'A6')]), (80, [(0, 0, 'D6'), (1, 0, 'A5'), (2, 0, 'F#5'), (2, 2, 'D5')])]:
    mel += [(b0 + b, bt, n) for b, bt, n in p]
for b, bt, nt in mel: M.add(b * BAR + bt * BEAT, piano(nt, 5), .5 if not (42 <= b < 50) else .58, .58)
for b in list(range(18, 33)) + list(range(50, 68)):
    c = CH[prog[b]]; M.add(b * BAR, piano(c[0], 4, .6), .3, .4); M.add(b * BAR + 2 * BEAT, piano(c[1], 3, .5), .22, .45)
M.write('mv2_music.wav', TOTAL); print('ok', round(TOTAL, 2))
