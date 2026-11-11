"""从推演文档生成 weeks.js：每周目标、行动、物资表、风险、沙洲侧变化。"""
import re, json
src = open('/mnt/project-files/shazhou/沙洲战备逐周推演.md').read()
clean = lambda s: re.sub(r'\*\*', '', s).strip()
W = {}
for m in re.finditer(r'^### (W\d\d)(?:–(W\d\d))? · (.+?)\n(.*?)(?=^### |^## )', src, re.S | re.M):
    a, b, title, body = m.groups()
    d = {'id': a, 'to': b or '', 'title': title.strip(), 'goal': '', 'acts': [], 'items': [], 'total': None, 'risk': '', 'change': ''}
    g = re.search(r'\*\*本周目标：\*\*(.+)', body); d['goal'] = clean(g.group(1)) if g else ''
    act = re.search(r'\*\*行动：\*\*(.*?)\n\*\*带回物资', body, re.S)
    if act:
        t = act.group(1).strip()
        d['acts'] = [clean(x[2:]) for x in t.split('\n') if x.startswith('- ')] or [clean(t)]
    for r in re.findall(r'^\| (.+?) \| (.+?) \| (.+?) \|$', body, re.M):
        if r[0] in ('物资', '---') or r[0].startswith('---'): continue
        kg = re.search(r'([\d.]+)\s*kg', r[1]); yuan = re.search(r'([\d.]+)\s*元', r[2])
        row = [clean(r[0]), float(kg.group(1)) if kg else 0, float(yuan.group(1)) if yuan else 0, clean(r[1])]
        if '合计' in r[0]: d['total'] = row[1:3]
        else: d['items'].append(row)
    rk = re.search(r'\*\*风险与合理性：\*\*(.+)', body); d['risk'] = clean(rk.group(1)) if rk else ''
    ch = re.search(r'\*\*沙洲侧变化：\*\*(.+)', body); d['change'] = clean(ch.group(1)) if ch else ''
    W[a] = d
open('weeks.js', 'w').write('window.WEEKS=' + json.dumps(W, ensure_ascii=False) + ';')
print(len(W), list(W)[:5]); print(json.dumps(W['W05'], ensure_ascii=False, indent=0)[:900])
