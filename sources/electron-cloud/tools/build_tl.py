"""由台词和（若已有）配音时长生成 tl_e1.js / tl_e2.js。没有配音时按字数估计（--stub）。"""
import json, os, sys, glob, hashlib
S = json.load(open('script.json'))
A = json.load(open('audio.json')) if os.path.exists('audio.json') else {}
LEAD, TAIL, FIRST, GAP, END = 1.2, 2.5, 1.0, .55, 1.2
for ep in (1, 2, 3, 4):
    t = LEAD; scenes = []
    for s in [x for x in S if x['ep'] == ep]:
        bs = []; lt = FIRST
        for i, txt in enumerate(s['beats']):
            key = f"{s['id']}_{i}"; d = A[key]['d'] if key in A else len(txt) / 4.9
            bs.append({'s': round(lt, 3), 'd': round(d, 3), 'text': txt, 'key': key}); lt += d + GAP
        T = round(lt - GAP + END, 3)
        scenes.append({'id': s['id'], 'ep': ep, 'chapter': s['chapter'], 'title': s['title'], 'start': round(t, 3), 'T': T, 'beats': bs}); t += T
    tl = {'lead': LEAD, 'tail': TAIL, 'total': round(t + TAIL, 3), 'scenes': scenes, 'stub': not A}
    open(f'tl_e{ep}.js', 'w').write('window.TL=' + json.dumps(tl, ensure_ascii=False) + ';')
    json.dump(tl, open(f'tl_e{ep}.json', 'w'), ensure_ascii=False, indent=1)
    print(f'第{ep}集 {len(scenes)} 场 {tl["total"]/60:.1f} 分钟', '（字数估计）' if not A else '')
