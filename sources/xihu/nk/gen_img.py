"""《守夜人》人物图层与场景生成（只用 Python 标准库，在你自己的电脑上运行）。
用法（在 gen 文件夹里）：
    python3 gen_img.py /path/to/.env               # 生成 prompts.json 里的全部图片，已有的跳过
    python3 gen_img.py /path/to/.env --only k01    # 只生成某几张
    python3 gen_img.py /path/to/.env --limit 12    # 本次最多生成 12 张（分批跑）
.env 里需要 GEMINI_API_KEY=...（可选 GEMINI_BASE_URL=...）。密钥只在运行时读取，不会打印。
输出：./img/<编号>.png"""
import os, sys, json, base64, time, urllib.request
MODEL = 'gemini-2.5-flash-image'
STYLE = {'char': '', 'old': '', 'sil': '', 'scene': '', 'ui': '', 'photo': ''}
def load_env(p):
    env = {}
    for line in open(os.path.expanduser(p)):
        line = line.strip()
        if '=' in line and not line.startswith('#'):
            k, v = line.split('=', 1); env[k.strip()] = v.strip().strip('"\'')
    if not env.get('GEMINI_API_KEY'): sys.exit('env 文件里没有找到 GEMINI_API_KEY')
    return env
def endpoint(env, model):
    base = (env.get('GEMINI_BASE_URL') or 'https://generativelanguage.googleapis.com').rstrip('/')
    if not base.endswith('/v1beta'): base += '/v1beta'
    return f"{base}/models/{model}:generateContent"
def gen(key, url, prompt, out, aspect):
    body = {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": aspect}}}
    for k in range(5):
        req = urllib.request.Request(url, data=json.dumps(body).encode(), headers={"Content-Type": "application/json", "x-goog-api-key": key})
        try:
            with urllib.request.urlopen(req, timeout=240) as r: d = json.load(r)
            cand = (d.get('candidates') or [{}])[0]; parts = (cand.get('content') or {}).get('parts') or []
            img = next((p['inlineData'] for p in parts if 'inlineData' in p), None)
            if not img: raise RuntimeError(f"没有返回图片 finishReason={cand.get('finishReason')} {str(d)[:160]}")
            ext = 'png' if 'png' in img.get('mimeType', 'image/png') else 'jpg'
            open(out + '.' + ext, 'wb').write(base64.b64decode(img['data'])); return out + '.' + ext
        except Exception as e:
            msg = str(e); print('  重试', k + 1, type(e).__name__, msg[:160]); time.sleep(5 * (k + 1))
            if k == 1 and 'responseModalities' in msg: body["generationConfig"]["responseModalities"] = ["TEXT", "IMAGE"]
    return None
if __name__ == '__main__':
    a = sys.argv[1:]; env = load_env(a[0]); key = env['GEMINI_API_KEY']
    only = set(a[a.index('--only') + 1].split(',')) if '--only' in a else None
    limit = int(a[a.index('--limit') + 1]) if '--limit' in a else 10 ** 6
    model = a[a.index('--model') + 1] if '--model' in a else MODEL
    P = json.load(open('prompts.json')); os.makedirs('img', exist_ok=True); n = 0
    for it in P:
        k = it['id']
        if only and k not in only: continue
        if any(os.path.exists(f"img/{k}.{e}") for e in ('png', 'jpg')): continue
        if n >= limit: break
        prompt = it['prompt'] + ' ' + STYLE[it.get('style', 'photo')]
        t = time.time(); r = gen(key, endpoint(env, model), prompt, f"img/{k}", it.get('aspect', '16:9'))
        print(k, '✓' if r else '✗', f"{time.time() - t:.0f}s"); n += 1
    print('done', n)
