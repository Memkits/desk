import json, os
S = json.load(open(os.environ.get('SCRIPT', '../../sources/lingao/script.json'))); A = json.load(open('audio.json')) if os.path.exists('audio.json') else {}
LEAD, TAIL, FIRST, GAP, END = 1.2, 2.5, 1.2, .6, 1.2
t = LEAD; scenes = []
for s in S:
    bs = []; lt = FIRST
    for i, txt in enumerate(s['beats']):
        key = f"{s['id']}_{i}"; d = A[key]['d'] if key in A else len(txt) / 5.0
        bs.append({'s': round(lt, 3), 'd': round(d, 3), 'text': txt, 'key': key}); lt += d + GAP
    T = round(lt - GAP + END, 3)
    scenes.append({'id': s['id'], 'ep': 1, 'chapter': s['chapter'], 'title': s['title'], 'start': round(t, 3), 'T': T, 'beats': bs}); t += T
tl = {'lead': LEAD, 'tail': TAIL, 'total': round(t + TAIL, 3), 'scenes': scenes}
open('tl_e1.js', 'w').write('window.TL=' + json.dumps(tl, ensure_ascii=False) + ';'); json.dump(tl, open('tl_e1.json', 'w'), ensure_ascii=False, indent=1)
print(f'{len(scenes)} 场 {tl["total"]/60:.2f} 分钟'); [print(s['id'], round(s['start']), round(s['T'],1)) for s in scenes]
