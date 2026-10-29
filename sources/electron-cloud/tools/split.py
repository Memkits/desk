import sys, json, os, glob, subprocess
ep = sys.argv[1]; TL = json.load(open(f'tl_e{ep}.json'))
name = {'1': '电子云_第1集_电子云是什么', '2': '电子云_第2集_走遍周期表', '3': '电子云_第3集_化学反应上', '4': '电子云_第4集_化学反应下'}[ep]
out = f'final/{name}.mp4'; starts = [s['start'] for s in TL['scenes']]
# 分段
LIM = float(sys.argv[2]) * 1e6 if len(sys.argv) > 2 else 22e6
pk = []
for l in subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'packet=pts_time,size', '-of', 'csv=p=0', out]).decode().split():
    p = [x for x in l.split(',') if x]
    try: pk.append((float(p[0]), int(p[1])))
    except Exception: pass
size = lambda a, b: sum(sz for t, sz in pk if a <= t < b)
S2 = starts + [1e9]; cuts, seg = [], 0
for i in range(1, len(S2)):
    if size(seg, S2[i]) > LIM:
        cut = S2[i - 1] if S2[i - 1] > seg else S2[i]
        if size(seg, cut) > LIM: print('WARNING scene too big near', cut)
        cuts.append(cut); seg = cut
os.makedirs('final/dl', exist_ok=True)
for f in glob.glob(f'final/dl/{name}_part*.mp4'): os.remove(f)
args = ['-f', 'segment', '-segment_times', ','.join('%.3f' % c for c in cuts)] if cuts else ['-f', 'segment', '-segment_time', '99999']
subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-i', out, '-c', 'copy', '-map', '0', *args, '-reset_timestamps', '1', '-segment_start_number', '1', f'final/dl/{name}_part%d.mp4'], check=True)
for p in sorted(glob.glob(f'final/dl/{name}_part*.mp4')): print(os.path.basename(p), '%.1fMB' % (os.path.getsize(p) / 1e6))
