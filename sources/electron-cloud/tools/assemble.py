"""合成：python3 assemble.py <ep> [crf] → final/<名>.mp4 + .srt + final/dl/<名>_partN.mp4（每段 ≤ 28MB，只在场景边界切）"""
import sys, json, os, glob, subprocess, wave, numpy as np
ep = sys.argv[1]; CRF = sys.argv[2] if len(sys.argv) > 2 else '26'
TL = json.load(open(f'tl_e{ep}.json')); A = json.load(open('audio.json'))
name = {'1': '电子云_第1集_电子云是什么', '2': '电子云_第2集_走遍周期表', '3': '电子云_第3集_化学反应上', '4': '电子云_第4集_化学反应下'}[ep]
vids = sorted(glob.glob(f'out/e{ep}/*.mp4')); assert len(vids) == len(TL['scenes']), (len(vids), len(TL['scenes']))
os.makedirs('work', exist_ok=True)
open(f'work/list{ep}.txt', 'w').write(''.join(f"file '{os.path.abspath(v)}'\n" for v in vids))
SR = 48000; buf = np.zeros(int((TL['total'] + 1) * SR), np.float32)
for sc in TL['scenes']:
    for b in sc['beats']:
        a = A.get(b['key'])
        if not a: continue
        r = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', a['f'], '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
        x = np.frombuffer(r, np.int16).astype(np.float32) / 32768; i0 = int((sc['start'] + b['s']) * SR); buf[i0:i0 + len(x)] += x
buf = buf[:int(TL['total'] * SR)]
with wave.open(f'work/voice{ep}.wav', 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
starts = [s['start'] for s in TL['scenes']]
kf = ','.join('%.3f' % s for s in starts[1:])
out = f'final/{name}.mp4'
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', f'work/list{ep}.txt', '-i', f'work/voice{ep}.wav', '-map', '0:v', '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', CRF, '-maxrate', '1800k', '-bufsize', '3600k', '-pix_fmt', 'yuv420p', '-force_key_frames', kf, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '128k', '-ar', '48000',
    '-movflags', '+faststart', '-shortest', out], check=True)
cues = json.load(open(f'cues_e{ep}.json'))
ts = lambda t: f"{int(t//3600):02d}:{int(t%3600//60):02d}:{int(t%60):02d},{int(round((t%1)*1000)) % 1000:03d}"
open(f'final/{name}.srt', 'w').write('\n'.join(f"{i+1}\n{ts(c['s'])} --> {ts(c['e'])}\n{c['t']}\n" for i, c in enumerate(cues)))
d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out], capture_output=True, text=True).stdout)
print(name, f'{d/60:.2f} 分钟', f'{os.path.getsize(out)/1e6:.1f} MB')
# 分段
LIM = 22e6
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
