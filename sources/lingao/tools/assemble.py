"""合成：python3 assemble.py <ep> → final/设计规范_上集.mp4 + .srt"""
import sys, json, os, glob, subprocess, wave, numpy as np
ep = sys.argv[1]; TL = json.load(open(f'tl_e{ep}.json')); A = json.load(open('audio.json'))
os.makedirs('final', exist_ok=True); name = '临高启明_地图上的八年'
vids = sorted(glob.glob(f'out/e{ep}/*.mp4'))
assert len(vids) == len(TL['scenes']), (len(vids), len(TL['scenes']))
open(f'out/e{ep}/list.txt', 'w').write(''.join(f"file '{os.path.basename(v)}'\n" for v in vids))
SR = 48000; buf = np.zeros(int((TL['total'] + 1) * SR), np.float32)
for sc in TL['scenes']:
    for b in sc['beats']:
        a = A.get(b['key']);
        if not a: continue
        r = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', a['f'], '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
        x = np.frombuffer(r, np.int16).astype(np.float32) / 32768; i0 = int((sc['start'] + b['s']) * SR); buf[i0:i0 + len(x)] += x
buf = buf[:int(TL['total'] * SR)]
with wave.open(f'out/e{ep}/voice.wav', 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(buf, -1, 1) * 32767).astype(np.int16).tobytes())
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', f'out/e{ep}/list.txt', '-i', f'out/e{ep}/voice.wav',
    '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-movflags', '+faststart', '-shortest', f'final/{name}.mp4'], check=True)
cues = json.load(open(f'cues_e{ep}.json'))
ts = lambda t: f"{int(t//3600):02d}:{int(t%3600//60):02d}:{int(t%60):02d},{int(round((t%1)*1000)) % 1000:03d}"
open(f'final/{name}.srt', 'w').write('\n'.join(f"{i+1}\n{ts(c['s'])} --> {ts(c['e'])}\n{c['t']}\n" for i, c in enumerate(cues)))
d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'final/{name}.mp4'], capture_output=True, text=True).stdout)
print(name, f'{d/60:.2f} 分钟', f'{os.path.getsize(f"final/{name}.mp4")/1e6:.1f} MB')
