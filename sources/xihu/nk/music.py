"""《守夜人》配乐：程序合成，60 BPM，108 小节（432 秒），B 羽调式（B D E F# A）。
段落（秒）：清场 0–48 ｜ 长椅 48–100 ｜ 串门 100–152 ｜ 她 152–196 ｜ 古人 196–244 ｜ 推演 244–286 ｜ 刻痕 286–352 ｜ 回忆层 352–386 ｜ 开层 386–430"""
import sys; sys.path.insert(0, '/home/claude/mt'); sys.path.insert(0, '/home/claude/nk')
from synth import *
from inst import *
import numpy as _np
BPM = 60; BEAT = 60 / BPM; BAR = 4 * BEAT; NB = 108; TOTAL = NB * BAR + 2
M = Mix(TOTAL)
CH.update({'Bm9': ['B2', 'F#3', 'A3', 'C#4'], 'Dsus': ['D3', 'G3', 'A3'], 'Em9': ['E3', 'B3', 'D4', 'F#4'], 'Gadd9': ['G2', 'D3', 'A3', 'B3']})
RT = {k: v[0][:-1] + str(int(v[0][-1]) - 1) for k, v in CH.items()}
def ramp(a, b, va, vb):
    for k in range(a, b): E[k] = va + (vb - va) * (k - a) / max(1, b - a - 1)
# 和声：每小节一个和弦
prog = (['Bm'] * 6 + ['Gmaj7'] * 3 + ['Bm'] * 3 +                                  # 清场 0–12
        ['Em7', 'Em7', 'Bm', 'Bm', 'Gmaj7', 'Gmaj7', 'Bm9', 'Bm9', 'Em7', 'Gmaj7', 'Asus', 'Asus', 'Bm'] +   # 长椅 12–25
        ['D', 'A', 'Bm', 'G', 'D', 'A', 'G', 'A', 'D', 'G', 'Bm', 'A', 'G'] +       # 串门 25–38（明一点）
        ['Bm9', 'Bm9', 'Em9', 'Em9', 'Bm9', 'Bm9', 'Gmaj7', 'Gmaj7', 'Asus', 'Asus', 'Bm'] +   # 她 38–49
        ['Bm', 'Gmaj7', 'D', 'A', 'Bm', 'Gmaj7', 'Em7', 'A', 'Bm', 'Gmaj7', 'D', 'Asus'] +    # 古人 49–61
        ['Em7', 'Em7', 'Gmaj7', 'Gmaj7', 'Bm9', 'Bm9', 'Asus', 'Asus', 'Bm', 'Bm'] +         # 推演 61–71
        ['Bm', 'Gmaj7', 'D', 'A', 'Bm', 'Gmaj7', 'D', 'A', 'Em7', 'Gmaj7', 'D', 'A', 'Bm', 'G', 'D', 'A', 'Gadd9'] +   # 刻痕 71–88
        ['D', 'D', 'Gmaj7', 'Gmaj7', 'Bm7', 'Bm7', 'Em7', 'Asus'] +                 # 回忆层 88–96
        ['Dadd9', 'Dadd9', 'Gmaj7', 'Gmaj7', 'Dadd9', 'Dadd9', 'Dadd9', 'Dadd9', 'Dadd9', 'Dadd9', 'Dadd9', 'Dadd9'])  # 开层 96–108
assert len(prog) == NB, len(prog)
E = _np.zeros(NB)
ramp(0, 4, .05, .15); ramp(4, 12, .18, .3); ramp(12, 25, .25, .4); ramp(25, 38, .4, .5); ramp(38, 49, .3, .5); ramp(49, 61, .45, .6); ramp(61, 71, .5, .7); ramp(71, 84, .6, 1.0); ramp(84, 88, .9, .6); ramp(88, 96, .4, .5); ramp(96, 108, .55, .1)
for b, c in enumerate(prog):
    if b >= 106: continue
    e = E[b]; t0 = b * BAR; hold = BAR * 1.6 if b < 104 else BAR * 5
    M.add(t0, strings(CH[c], hold, 250 + 1800 * e, vib=e), .28 + .6 * e)
    if 12 <= b < 100 and b not in range(61, 68): M.add(t0, sub(RT[c], BAR * 1.3), .2 + .45 * e)
M.add(0, water(50, .07), 1); M.add(0, wind(50, .05), 1); M.add(260, wind(30, .07), 1); M.add(380, water(52, .06), 1)
# ---- 清场（0–48）：钟一声，古筝泛音稀疏，钢琴单音像锚点灯一盏盏亮 ----
M.add(1 * BAR, bianzhong('B2', 8, .5), .5, .5)
for b, bt, nt in [(3, 0, 'B4'), (4, 2, 'D5'), (6, 1, 'F#5'), (7, 3, 'E5'), (9, 0, 'D5'), (10, 2, 'B4')]: M.add(b * BAR + bt * BEAT, piano(nt, 3.5), .4, .45 + .1 * (b % 2))
for b in range(2, 11):
    for k in range(4):
        if (b * 4 + k) % 3 == 0: M.add(b * BAR + k * BEAT, guzheng(['B5', 'F#5', 'D6', 'A5'][(b + k) % 4], 2.5, .5), .25, .6)
# ---- 长椅（48–100）：钢琴主题（阿宁的主题），二胡远远应一句 ----
NING = [(0, 0, 'F#4', 1.5), (0, 1.5, 'A4', .8), (0, 2.5, 'B4', 1.5), (1, 0, 'A4', 1.0), (1, 1, 'F#4', 1.0), (1, 2, 'E4', 2.0), (2, 0, 'D4', 1.5), (2, 2, 'E4', 1.0), (2, 3, 'F#4', 3.0)]
def play(t0, seq, inst, g, pan, oct=0):
    for b, bt, nt, d in seq: M.add(t0 + b * BAR + bt * BEAT, inst(nt[:-1] + str(int(nt[-1]) + oct), d), g, pan)
play(13 * BAR, NING, lambda n, d: piano(n, d + 1.5), .5, .5)
play(17 * BAR, NING, lambda n, d: piano(n, d + 1.5), .5, .5)
play(20 * BAR, NING, lambda n, d: erhu(n, d, .7), .4, .42, 0)
for b in range(13, 24):
    c = CH[prog[b]]
    for k in (0, 2): M.add(b * BAR + k * BEAT + BEAT / 2, piano(c[1][:-1] + str(int(c[1][-1]) + 1), 1.4), .18, .55)
# ---- 串门（100–152）：古筝分解 + 笛子，每换一个时代换一个乐器 ----
for b in range(25, 38):
    c = CH[prog[b]]; seq = [c[0], c[1], c[2], c[1]] * 2
    for k, x in enumerate(seq): M.add(b * BAR + k * BEAT / 2, guzheng(x[:-1] + str(int(x[-1]) + 1), 1.6, .75), .26, .35 + .3 * (k % 2))
SU = [(0, 0, 'D5', 1.0), (0, 1, 'E5', 1.0), (0, 2, 'F#5', 1.5), (1, 0, 'A5', 1.0), (1, 1, 'F#5', 2.5)]
play(26 * BAR, SU, lambda n, d: dizi(n, d, .75), .45, .6)
for b, nt in [(29, 'B2'), (31, 'G3')]: M.add(b * BAR, bianzhong(nt, 6, .5), .45, .5)   # 1632 雪夜：钟
play(30 * BAR, SU, lambda n, d: erhu(n, d, .7), .4, .42, -1)
play(33 * BAR, SU, lambda n, d: dizi(n, d, .7), .45, .6)
play(35 * BAR, SU, lambda n, d: guzheng(n, d * 1.5, .9), .4, .4)
# ---- 她（152–196）：声音抽掉，只剩长音、水，钢琴单音反问 ----
for b, bt, nt in [(39, 0, 'B4'), (40, 2, 'D5'), (42, 0, 'C#5'), (43, 1, 'B4'), (45, 0, 'F#4'), (46, 2, 'A4'), (48, 0, 'B4')]: M.add(b * BAR + bt * BEAT, piano(nt, 4), .42, .5)
M.add(41 * BAR, shimmer(CH['Em9'], BAR * 3), .5); M.add(45 * BAR, shimmer(CH['Gmaj7'], BAR * 3), .5)
M.add(47 * BAR, bianzhong('B2', 7, .5), .45, .5)
# ---- 古人（196–244）：两人的主题交错：阿宁主题（钢琴）与她的主题（笛）----
TA = [(0, 0, 'B4', 1.0), (0, 1, 'D5', 1.0), (0, 2, 'F#5', 2.0), (1, 0, 'E5', 1.0), (1, 1, 'D5', 1.0), (1, 2, 'B4', 2.0)]
play(50 * BAR, TA, lambda n, d: dizi(n, d, .7), .42, .6)
play(53 * BAR, NING, lambda n, d: piano(n, d + 1.5), .45, .45)
play(56 * BAR, TA, lambda n, d: erhu(n, d, .75), .42, .42, 0)
for b in range(49, 61):
    c = CH[prog[b]]
    for k in range(4): M.add(b * BAR + k * BEAT, guzheng(c[k % 3][:-1] + str(int(c[k % 3][-1]) + 1), 2, .6), .2, .4 + .2 * (k % 2))
# ---- 推演（244–286）：旋钮往后拨——古筝越来越快，再突然停；只剩风 ----
for b in range(61, 67):
    c = CH[prog[b]]; div = [2, 2, 3, 4, 6, 8][b - 61]
    for k in range(4 * div): M.add(b * BAR + k * BEAT / div, guzheng(c[k % len(c)][:-1] + str(int(c[k % len(c)][-1]) + 1 + (k % 2)), 1.2, .7), .22, .3 + .4 * (k % 2))
M.add(67 * BAR, bianzhong('E3', 9, .8), .6, .5); M.add(67 * BAR, dagu(.6, 60), 1, .5)
for b, bt, nt in [(68, 0, 'B4'), (69, 0, 'A4'), (70, 0, 'F#4')]: M.add(b * BAR + bt * BEAT, piano(nt, 4), .4, .5)
# ---- 刻痕（286–352）：高潮——大鼓慢敲，二胡与笛子齐奏阿宁主题，古筝全奏 ----
for b in range(71, 86):
    c = CH[prog[b]]; seq = [c[0], c[1], c[2], c[1]] * 2
    for k, x in enumerate(seq): M.add(b * BAR + k * BEAT / 2, guzheng(x[:-1] + str(int(x[-1]) + 1), 1.4, .9 * E[b]), .3, .35 + .3 * (k % 2))
    if b >= 75:
        for k in (0, 2): M.add(b * BAR + k * BEAT, dagu(.4 * E[b], 72), 1, .5)
for b in (71, 75):
    play(b * BAR, TA, lambda n, d: dizi(n, d, .75), .42, .6)
play(79 * BAR, NING, lambda n, d: erhu(n, d, .85), .5, .42, 0); play(79 * BAR, NING, lambda n, d: dizi(n, d, .7), .4, .6, 1); play(79 * BAR, NING, lambda n, d: piano(n, d + 1.5), .4, .5)
play(83 * BAR, NING, lambda n, d: erhu(n, d, .85), .5, .42, 0); play(83 * BAR, TA, lambda n, d: dizi(n, d, .75), .45, .6, 0)
M.add(86 * BAR, bianzhong('D3', 9, 1.0), .7, .5); M.add(86 * BAR, dagu(.9, 60), 1, .5); M.add(86 * BAR + .06, bianzhong('A3', 7, .6), .5, .6)
# ---- 回忆层（352–386）：钢琴独奏阿宁主题，慢，二胡在远处 ----
play(89 * BAR, NING, lambda n, d: piano(n, d * 1.4 + 2), .5, .5)
play(93 * BAR, NING, lambda n, d: erhu(n, d * 1.2, .6), .35, .42, 0)
for b in range(89, 96):
    c = CH[prog[b]]
    for k in (1, 3): M.add(b * BAR + k * BEAT, piano(c[2][:-1] + str(int(c[2][-1]) + 1), 1.4), .15, .55)
# ---- 开层（386–430）：笛子收尾，古筝轻刮，钟 ----
M.add(96.5 * BAR, dagu(.5, 70), 1, .5)
for t, y in gz_gliss('D4', 'A5', 1.6, .5): M.add(97 * BAR + t, y, .35, .4)
for b, bt, nt, d in [(98, 0, 'A5', 2.4), (99, 0, 'F#5', 1.6), (99, 2, 'E5', 1.6), (100, 0, 'D5', 3.5), (101, 2, 'B4', 2.0), (102, 1, 'A4', 3.5), (104, 0, 'D5', 6.0)]: M.add(b * BAR + bt * BEAT, dizi(nt, d, .7), .5, .58)
for b, bt, nt in [(98, 2, 'D5'), (100, 0, 'A5'), (101, 0, 'F#5'), (103, 0, 'D5'), (104, 2, 'A4')]: M.add(b * BAR + bt * BEAT, guzheng(nt, 3.0, .6), .3, .4)
M.add(105 * BAR, bianzhong('D3', 8, .5), .45, .5)
M.write('music.wav', TOTAL); print('ok', round(TOTAL, 2))
