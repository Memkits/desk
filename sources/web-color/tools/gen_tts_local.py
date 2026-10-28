"""为《类型标注》两集生成配音（只用 Python 标准库，在你自己的电脑上运行）。
用法（在 tts 文件夹里）：
    python3 gen_tts_local.py /path/to/你的.env          # 生成全部段落（每段自动转写核对，读漏的会重读）
    python3 gen_tts_local.py /path/to/你的.env --sample # 用开场第一句试听几种女声，输出到 ./samples/
    python3 gen_tts_local.py /path/to/你的.env --voice Aoede   # 换声音（默认 Kore）
.env 里需要 GEMINI_API_KEY=...（可选 GEMINI_BASE_URL=...）。密钥只在运行时读取，不会打印。
输出：./audio/<段名>_<序号>_<哈希>.pcm（24 kHz 单声道 16 位）。可中断后重跑，已生成的会跳过；
跑完会删掉与当前稿子不对应的旧配音。"""
import os, sys, json, base64, hashlib, glob, time, re, urllib.request
VOICE = 'Kore'
MODEL = 'gemini-3.1-flash-tts-preview'   # 可用 --model 覆盖
# 第一条是上一版验证可用的风格提示；接口返回 finishReason=OTHER（不出声）时依次换更简单的提示再试
STYLES = ['用温和、清晰、知性的女声朗读，像在讲解编程语言和编译器的技术科普：语速平稳自然，句间短暂停顿，不要播音腔。只朗读下面的中文：',
          '用清晰自然的女声，以正常语速朗读下面这段中文：',
          '朗读：']
STYLE = STYLES[0]
VERIFY_MODEL = 'gemini-2.5-flash'   # 用来把配音转写回文字、核对是否逐字读对
SAMPLE_VOICES = ['Kore', 'Aoede', 'Leda', 'Sulafat', 'Erinome']
def load_env(p):
    env = {}
    for line in open(os.path.expanduser(p)):
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1); env[k.strip()] = v.strip().strip('"\'')
    if not env.get('GEMINI_API_KEY'): sys.exit('env 文件里没有找到 GEMINI_API_KEY')
    return env
def endpoint(env):
    base = (env.get('GEMINI_BASE_URL') or 'https://generativelanguage.googleapis.com').rstrip('/')
    if not base.endswith('/v1beta'): base += '/v1beta'
    return f"{base}/models/{MODEL}:generateContent"
def tts(key, url, voice, text, out):
    for k in range(9):
        style = STYLES[min(k // 3, len(STYLES) - 1)]   # 每种提示试三次，不出声就换更简单的提示
        body = {"contents": [{"parts": [{"text": style + "\n" + text}]}],
                "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
        req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": key})
        try:
            with urllib.request.urlopen(req, timeout=240) as r: d = json.load(r)
            cand = (d.get('candidates') or [{}])[0]
            parts = (cand.get('content') or {}).get('parts') or []
            audio = next((p['inlineData']['data'] for p in parts if 'inlineData' in p), None)
            if not audio: raise RuntimeError(f"没有返回音频 finishReason={cand.get('finishReason')}")
            open(out, 'wb').write(base64.b64decode(audio)); return
        except Exception as e:
            print('  重试', k + 1, type(e).__name__, str(e)[:80]); time.sleep(min(30, 4 * (k + 1)))
    sys.exit('多次失败，稍后重跑即可（已完成的会跳过）')
def wav_bytes(pcm):
    import io, wave
    b = io.BytesIO()
    with wave.open(b, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(open(pcm, 'rb').read())
    return b.getvalue()
def transcribe(key, base, pcm):
    url = f"{base}/models/{VERIFY_MODEL}:generateContent"
    body = {"contents": [{"parts": [{"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(wav_bytes(pcm)).decode()}},
                                    {"text": "把这段中文语音逐字转写成简体中文汉字，只输出转写文字，不要加任何说明。"}]}]}
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": key})
    for k in range(5):
        try:
            with urllib.request.urlopen(req, timeout=120) as r: d = json.load(r)
            return ''.join(p.get('text', '') for p in d['candidates'][0]['content']['parts'])
        except Exception as e:
            print('  转写重试', k + 1, type(e).__name__, str(e)[:80]); time.sleep(6 * (k + 1))
    return ''
def similar(a, b):
    # 转写常把古文写成同音字（「砂聚」听成「杀锯」），同音替换不算读错；只把漏读、多读的字算进去
    import difflib
    keep = lambda s: re.sub(r'[^\u4e00-\u9fff0-9]', '', s.split('The transcription')[0])
    x, y = keep(a), keep(b)
    if not x: return 1.0
    miss = 0
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, x, y).get_opcodes():
        if op == 'delete': miss += i2 - i1
        elif op == 'insert': miss += j2 - j1
        elif op == 'replace': miss += abs((i2 - i1) - (j2 - j1))
    return max(0.0, 1 - miss / len(x))
def wav(pcm, out):
    import wave
    with wave.open(out, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(open(pcm, 'rb').read())
if __name__ == '__main__':
    a = sys.argv[1:]
    if not a: sys.exit(__doc__)
    env = load_env(a[0]); key = env['GEMINI_API_KEY']; url = endpoint(env)
    voice = a[a.index('--voice') + 1] if '--voice' in a else VOICE
    if '--model' in a: MODEL = a[a.index('--model') + 1]; url = endpoint(env)
    S = json.load(open('script.json'))
    if '--sample' in a:
        os.makedirs('samples', exist_ok=True); text = S[0]['beats'][0].split('。')[0] + '。' + S[0]['beats'][0].split('。')[1] + '。'
        for v in SAMPLE_VOICES:
            p = f'samples/{v}.pcm'; tts(key, url, v, text, p); wav(p, f'samples/{v}.wav'); os.remove(p); print('试听：', f'samples/{v}.wav')
        sys.exit(0)
    os.makedirs('audio', exist_ok=True); print('声音：', voice, ' 模型：', MODEL, ' 接口：', url.split('/models/')[0])
    n = sum(len(s['beats']) for s in S); done = 0; keep = set(); low = []
    for s in S:
        for i, t in enumerate(s['beats']):
            done += 1; h = hashlib.md5((voice + '|' + t).encode()).hexdigest()[:10]
            out = f"audio/{s['id']}_{i}_{h}.pcm"; txt = out[:-4] + '.txt'; keep |= {os.path.basename(out), os.path.basename(txt)}
            if os.path.exists(out) and os.path.exists(txt):
                r = float(open(txt).read().split()[0]); low += [(f"{s['id']}_{i}", r)] if r < 0.95 else []; continue
            best = None
            for attempt in range(4):   # 逐字核对：转写与原文相差太多就重读，最多四次，留最好的一版
                tts(key, url, voice, t, out + '.tmp')
                heard = transcribe(key, url.split('/models/')[0], out + '.tmp'); r = similar(t, heard)
                if best is None or r > best[0]:
                    best = (r, heard); os.replace(out + '.tmp', out)
                else: os.remove(out + '.tmp')
                if r >= 0.95: break
                print(f'  第 {attempt + 1} 次读得不准（相似度 {r:.2f}），重读', flush=True)
            open(txt, 'w').write(f'{best[0]:.3f}\n{best[1]}\n')
            if best[0] < 0.95: low.append((f"{s['id']}_{i}", best[0]))
            print(f'[{done}/{n}] {s["id"]}_{i}  {os.path.getsize(out)/48000:.1f}s  逐字相似度 {best[0]:.2f}', flush=True)
    old = [f for f in os.listdir('audio') if (f.endswith('.pcm') or f.endswith('.txt')) and f not in keep]
    for f in old: os.remove(os.path.join('audio', f))
    if low: print('相似度仍低于 0.95 的段：', ' '.join(f'{a}({b:.2f})' for a, b in low))
    print('全部完成，共', n, '段；已删除旧配音', len(old), '个')
