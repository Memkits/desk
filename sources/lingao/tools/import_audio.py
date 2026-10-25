"""把本机生成的 pcm 配音转成 1.25 倍速、去首尾静音的 wav，并记录时长到 audio.json。用法：python3 import_audio.py <pcm 目录>"""
import sys, os, json, glob, subprocess, re
src = sys.argv[1]; os.makedirs('audio', exist_ok=True)
S = json.load(open(os.environ.get('SCRIPT', '../../sources/lingao/script.json'))); A = {}
import hashlib
for s in S:
    for i, t in enumerate(s['beats']):
        key = f"{s['id']}_{i}"; h = hashlib.md5(('Charon|' + t).encode()).hexdigest()[:10]
        p = os.path.join(src, f"{key}_{h}.pcm")
        if not os.path.exists(p): continue
        out = f'audio/{key}.wav'
        if not (os.path.exists(out) and os.path.getmtime(out) > os.path.getmtime(p)):
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', p,
                '-af', 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.1,areverse,atempo=1.25',
                '-ar', '48000', out], check=True)
        d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out], capture_output=True, text=True).stdout)
        A[key] = {'d': round(d, 3), 'f': out}
json.dump(A, open('audio.json', 'w'), indent=1)
n = sum(len(s['beats']) for s in S); print(f'{len(A)}/{n} 段；总时长 {sum(a["d"] for a in A.values())/60:.1f} 分钟')
