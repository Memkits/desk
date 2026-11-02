"""《月球拖船》MV 完整配乐。70 BPM，D 小调，53 小节 + 尾声。所有声音由 synth.py 的函数合成。"""
from synth import *
BPM = 70; BEAT = 60 / BPM; BAR = 4 * BEAT; NB = 53; TOTAL = NB * BAR + 5
M = Mix(TOTAL)
CH = {'Dm': ['D3', 'A3', 'F4'], 'Bb': ['Bb2', 'F3', 'D4'], 'F': ['F3', 'C4', 'A4'], 'C': ['C3', 'G3', 'E4'], 'Gm': ['G2', 'D3', 'Bb3'], 'A': ['A2', 'E3', 'C#4'],
      'D': ['D3', 'A3', 'F#4'], 'Dm9': ['D3', 'A3', 'E4', 'F4']}
RT = {'Dm': 'D2', 'Bb': 'Bb1', 'F': 'F2', 'C': 'C2', 'Gm': 'G1', 'A': 'A1', 'D': 'D2', 'Dm9': 'D2'}
# 每小节和弦与亮度
prog = (['Dm9', 'Dm9', 'Bb', 'Bb', 'Gm', 'A'] +                                  # 序 0-5
        ['Dm', 'Bb', 'F', 'C', 'Dm', 'Bb', 'A'] +                                 # 点火 6-12
        ['Dm', 'Bb', 'F', 'C', 'Dm', 'Bb', 'Gm', 'A', 'Dm', 'Bb'] +               # 拖船 13-22
        ['Gm', 'Bb', 'Dm', 'C', 'Gm', 'Bb', 'F', 'A', 'Dm', 'Bb', 'A'] +          # 近日点 23-33
        ['Bb', 'F', 'Gm', 'Dm', 'Bb', 'F', 'Gm', 'A', 'Dm', 'Dm'] +               # 告别 34-43
        ['Bb', 'C', 'Dm', 'F', 'Bb', 'C', 'D', 'D', 'D'])                         # 远方 44-52
assert len(prog) == NB, len(prog)
def bright(b):
    if b < 6: return 260 + 50 * b
    if b < 13: return 600 + 120 * (b - 6)
    if b < 23: return 1300
    if b < 30: return 1400 + 120 * (b - 23)
    if b < 34: return 2600
    if b < 44: return 700
    return 900 + 160 * (b - 44)
for b, c in enumerate(prog):
    t = b * BAR; L = BAR * (4 if b >= 49 else 1.6)
    if b >= 50: continue
    g = .7 if b < 6 else (.75 if 34 <= b < 44 else .9)
    M.add(t, pad(CH[c], L if b < 49 else BAR * 4 + 4, bright(b)), g)
    M.add(t, sub(RT[c], BAR * (1.3 if b < 49 else 4)), .8 if b >= 6 else .6)
# 爆发：点火与四次近日点
for b, g in [(6, 1.0), (8, .55), (10, .55), (24, .8), (26, .8), (28, .85), (30, 1.0)]: M.add(b * BAR, boom(), g)
# 引擎脉动：点火到近日点结束，八分音符的低频噪声
n8 = int(BEAT / 2 * SR); tt = np.arange(n8) / SR
for b in range(7, 34):
    for k in range(8):
        y = lp(rng.normal(0, 1, n8), 180) * np.exp(-tt * 18) * (1.0 if k % 2 == 0 else .6)
        M.add(b * BAR + k * BEAT / 2, y, .22 if b < 23 else .3)
# 琶音：近日点段落，八分音符上行
def pluck(nt, dur=1.2):
    n = int(dur * SR); t = np.arange(n) / SR; f = n2f(m(nt)); y = saw(f, n) * np.exp(-t * 5)
    return lp(y, 2200) * .35
for b in range(23, 34):
    notes = CH[prog[b]]; seq = [notes[0], notes[1], notes[2], notes[1].replace('3', '4').replace('2', '3')] * 2
    for k, nt in enumerate(seq):
        o = 1 if b >= 30 else 0; nn = nt[:-1] + str(int(nt[-1]) + 1 + o)
        M.add(b * BAR + k * BEAT / 2, pluck(nn), .5 if b < 30 else .6, .3 + .4 * (k % 2))
# 钢琴旋律（小节, 拍, 音）
mel = [(2, 0, 'A5'), (3, 2, 'F5'), (4, 1, 'E5'), (5, 0, 'D5'),
       (13, 0, 'A4'), (13, 1.5, 'D5'), (13, 2.5, 'E5'), (13, 3, 'F5'), (14, 0, 'E5'), (14, 2, 'C5'), (15, 0, 'D5'), (15, 1.5, 'A4'), (15, 3, 'F5'), (16, 0, 'G5'), (16, 2, 'F5'), (16, 3, 'E5'),
       (17, 0, 'D5'), (17, 2, 'Bb4'), (18, 0, 'F5'), (18, 1.5, 'A5'), (18, 3, 'G5'), (19, 0, 'F5'), (19, 2, 'D5'), (20, 0, 'Bb4'), (20, 2, 'D5'), (21, 0, 'C#5'), (21, 2, 'E5'), (22, 0, 'D5'), (22, 2, 'F5'),
       (30, 0, 'A5'), (30, 1.5, 'D6'), (30, 2.5, 'E6'), (30, 3, 'F6'), (31, 0, 'E6'), (31, 2, 'C6'), (32, 0, 'D6'), (32, 2, 'A5'), (33, 0, 'C#6'), (33, 2, 'E6'),
       (34, 0, 'D5'), (35, 0, 'C5'), (35, 2, 'A4'), (36, 0, 'Bb4'), (36, 2, 'D5'), (37, 0, 'A4'), (38, 0, 'F5'), (38, 2, 'D5'), (39, 0, 'C5'), (39, 2, 'A4'), (40, 0, 'G4'), (40, 2, 'Bb4'), (41, 0, 'A4'), (41, 2, 'E5'), (42, 0, 'D5'),
       (44, 0, 'F5'), (45, 0, 'G5'), (46, 0, 'A5'), (46, 2, 'D6'), (47, 0, 'C6'), (47, 2, 'A5'), (48, 0, 'Bb5'), (48, 2, 'D6'), (49, 0, 'E6'), (49, 2, 'C6'), (50, 0, 'F#5'), (50, 1, 'A5'), (50, 2, 'D6'), (51, 0, 'F#6'), (51, 2, 'A6')]
for b, bt, nt in mel: M.add(b * BAR + bt * BEAT, piano(nt, 5), .5 if b < 30 or b >= 34 else .58, .58)
# 低音钢琴：拖船与告别
for b in list(range(13, 23)) + list(range(34, 44)):
    r = CH[prog[b]][0]; M.add(b * BAR, piano(r, 4, .6), .3, .4); M.add(b * BAR + 2 * BEAT, piano(CH[prog[b]][1], 3, .5), .22, .45)
M.write('mv_music.wav', TOTAL); print('ok', round(TOTAL, 2), 'BAR', round(BAR, 4))
