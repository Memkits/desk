// 每个 beat 的棋谱进度和镜头。k:[从,到] 手数；at: 停在第几手；fx/fy: 镜头对准的列/行（A=0，9 路=0）；hi: 要逐口数气的棋块。
window.DET = {};
const P = s => (s[0] === '上' ? 0 : 81) + (9 - +s[2]) * 9 + 'ABCDEFGHJ'.indexOf(s[1]);
window.BEATS = {
  a_open_0: { k: [0, 182], wide: true, yaw: 26, tilt: 40, zoom: 1.12, tr: .01, m0: .1, m1: .97, badges: false },
  a_open_1: { at: 182, wide: true, yaw: -26, tilt: 33, tr: 15, badges: false, still: true },
  b_tool_0: { at: 20, morph: 0, yaw: -18, tilt: 50, zoom: 1.25, tr: .01, cap: '棋具一：两层玻璃板' },
  b_tool_1: { at: 20, morph: 1, yaw: 0, tilt: 30, zoom: 1.1, tr: 7, cap: '棋具二：一张棋盘，大子是下层，小子是上层' },
  b_tool_2: { at: 20, zoom: 1.8, fx: 5, fy: 5.6, yaw: 10, tilt: 34, hi: [P('下F3')], hiAt: .3, noteH: '数气', note: '这块黑棋三颗子：上层两颗，下层一颗。五口气：上层三口，下层两口。' },
  c_start_0: { k: [0, 11], zoom: 1.25, fx: 5.5, fy: 4.5, yaw: 0, tilt: 30, tr: .01 },
  c_start_1: { k: [11, 20], zoom: 1.6, fx: 6, fy: 4.4, yaw: -8, tilt: 33 },
  c_start_2: { k: [20, 38], zoom: 1.45, fx: 6.3, fy: 6, yaw: 6, tilt: 32 },
  d_cap_0: { k: [38, 39], m0: .8, m1: .9, zoom: 1.9, fx: 6.2, fy: 6.2, yaw: -10, tilt: 36, tr: .01, hi: [P('下G2')], hiAt: .1, noteH: '白棋四子', note: '上层 G4、G3，下层 G3、G2，上下相连成一块。' },
  d_cap_1: { k: [39, 41], m0: .1, m1: .62, hi: [P('下G2')], hiAt: .7, noteH: '白棋四子', note: '白提一子多出一口气，黑再打吃，又只剩一口。' },
  d_cap_2: { k: [41, 43], m0: .34, m1: .7, hi: [P('下G2')], hiAt: 0, hiEnd: .4, noteH: '第 43 手', note: '黑提四子：上层两颗，下层两颗。' },
  e_mid_0: { k: [43, 50], m1: .62, zoom: 1.65, fx: 6.6, fy: 3, yaw: 8, tilt: 34, hi: [P('下G6')], hiAt: .7, noteH: '黑棋四子', note: '上层三颗，下层一颗，只剩一口气。' },
  e_mid_1: { k: [50, 51], m0: .34, m1: .46, hi: [P('下G6')], hiAt: 0, hiEnd: .3, zoom: 1.3, fx: 6, fy: 4.5, tr: 7, noteH: '第 51 手', note: '落在提子留下的空点上，连成十八子、十二口气的大块。' },
  e_mid_2: { k: [51, 81], zoom: 1.1, fx: 4, fy: 4, yaw: 0, tilt: 30 },
  e_mid_3: { k: [81, 113], yaw: -6 },
  f_race_0: { k: [113, 114], m0: .08, m1: .2, zoom: 1.75, fx: 4.3, fy: 4.7, yaw: 8, tilt: 36, tr: .01, hi: [P('下D6'), P('下E3')], hiAt: .38, noteH: '对杀', note: '黑八子剩一口气，白三子也剩一口气。轮到黑棋。' },
  f_race_1: { k: [114, 115], m0: .5, m1: .6, hi: [P('下E3'), P('下D6')], hiAt: 0, noteH: '对杀', note: '白三子全在下层，最后一口气在上层 E3。黑提掉之后，八子变成三口气。' },
  g_left_0: { k: [115, 133], m1: .68, zoom: 1.6, fx: 1.2, fy: 2.4, yaw: -10, tilt: 34, tr: .01, hi: [P('下A8'), P('下B9')], hiAt: .76, noteH: '一手打吃两块', note: '四子和两子两块白棋，共用最后一口气：上层 A9。' },
  g_left_1: { k: [133, 137], m0: .12, m1: .8, zoom: 1.5, fx: 1, fy: 3 },
  h_end_0: { k: [137, 182], zoom: 1.1, fx: 4, fy: 4, yaw: 0, tilt: 30, tr: .01 },
  h_end_1: { at: 182, badges: false, terr: true, score: true, tilt: 24, note: '89 − 73 = 16，贴 7.5，黑胜 8.5' },
  h_end_2: { at: 182, badges: false, terr: true, terrAt: -1, score: true, yaw: 14, tilt: 30, tr: 12, note: '89 − 73 = 16，贴 7.5，黑胜 8.5' },
  h_end_3: { at: 182, wide: true, morph: 0, yaw: -20, tilt: 46, zoom: 1.2, tr: 9, badges: false },
};
