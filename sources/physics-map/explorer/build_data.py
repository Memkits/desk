# 由 records.txt + 地点表生成 data.js（复用数学版的 PLACES，追加物理版新地点，只保留用到的）
import os,re,json
d=os.path.dirname(os.path.abspath(__file__))
src=open(f'{d}/../../math-map/src/data.js',encoding='utf-8').read() if os.path.exists(f'{d}/../../math-map/src/data.js') else ''
P={}
for m in re.finditer(r'^\s*([a-z0-9]+):(\[.*?\]),?$',src,re.M): P[m.group(1)]=json.loads(m.group(2))
P.update(json.load(open(f'{d}/places_extra.json',encoding='utf-8')))
recs=[]
for ln in open(f'{d}/records.txt',encoding='utf-8'):
  ln=ln.rstrip('\n')
  if not ln or ln.startswith('#'):continue
  f=ln.split('|');assert len(f)==9,ln
  assert f[5] in P,('missing place',f[5])
  recs.append([int(f[0]),f[1],f[2],f[3],f[4],f[5],f[6],f[7],int(f[8])])
used=sorted({r[5] for r in recs},key=lambda k:list(P).index(k))
o=['// 物理成果数据（由 build_data.py 生成，请改 records.txt / places_extra.json）',
'// PLACES: key -> [纬度, 经度, 地名, 今国家 ADM0_A3 代码, 今国家中文名]',
'// RECORDS: [年份(负数=公元前), 年份显示, 人物, 英文名, 成果, 地点key, 当时地域/政权, 备注, 不确定(1=年份/地点/归属存疑)]',
'const PLACES = {']+[f'  {k}:{json.dumps(P[k],ensure_ascii=False)},' for k in used]+['};','const RECORDS = [']+[json.dumps(r,ensure_ascii=False)+',' for r in recs]+['];']
open(f'{d}/data.js','w',encoding='utf-8').write('\n'.join(o)+'\n')
print(len(recs),'records',len({r[2] for r in recs}),'people',len(used),'places')
