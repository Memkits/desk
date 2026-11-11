import os
d=os.path.dirname(os.path.abspath(__file__))
t=open(f'{d}/template.html',encoding='utf-8').read()
t=t.replace('/*DATA*/',open(f'{d}/data.js',encoding='utf-8').read()).replace('/*MAP*/',open(f'{d}/map.json',encoding='utf-8').read())
open(f'{d}/../index.html','w',encoding='utf-8').write(t)
print('ok',len(t))
