import numpy as np, subprocess, glob, time
T0=time.time(); P=lambda s: print(s, round(time.time()-T0,1), flush=True)
SR = 44100
def mavg(x, k):
    c = np.cumsum(np.concatenate([[0.], x])); k = max(1, k); h = k // 2
    idx_hi = np.minimum(np.arange(len(x)) + h + 1, len(x)); idx_lo = np.maximum(np.arange(len(x)) - h, 0)
    return (c[idx_hi] - c[idx_lo]) / (idx_hi - idx_lo)
def load(p):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
music = load('music.wav'); N = len(music); P('music')
CUE = [('ke_0', 8), ('ke_1', 52), ('ke_2', 104), ('ta_0', 188), ('ke_3', 191), ('ta_1', 213), ('ke_4', 229), ('ke_5', 248), ('ta_2', 306), ('ke_6', 320.5), ('ke_7', 364), ('ke_8', 398)]
vo = np.zeros_like(music); duck = np.zeros(N, np.float32)
for name, t0 in CUE:
    y = load(glob.glob(f'vo/{name}_*.wav')[0]); g = 1.0 if name.startswith('ke') else .9
    i = int(t0 * SR); n = min(len(y), N - i); vo[i:i + n] += y[:n] * g
    env = mavg(np.abs(y[:n]).mean(1), int(.05 * SR)); duck[i:i + n] = np.maximum(duck[i:i + n], (env > .01).astype(np.float32))
P('vo')
k_in = int(.4 * SR); k_out = int(1.2 * SR)
d = np.maximum(duck, (mavg(duck, k_out) > 0).astype(np.float32)); P('d1')
d = mavg(d, k_in).astype(np.float32); P('d2')
gain = (1 - .62 * d).astype(np.float32); del d, duck; P('gain')
peak = float(np.abs(vo).max()); vo *= np.float32(.85 / max(peak, 1e-6)); P('norm')
music *= gain[:, None]; music *= np.float32(.9); music += vo; del vo; P('sum')
np.tanh(music * np.float32(1.1), out=music); music /= np.float32(1.1); P('tanh')
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'pcm_s16le', 'mix.wav'], input=music.tobytes()); P('written')
