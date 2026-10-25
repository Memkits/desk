import json,base64,sys,os,io
from PIL import Image, ImageDraw, ImageFont
F=ImageFont.truetype('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',18) if os.path.exists('/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc') else None
cred=json.load(open('news/credits.json')) if os.path.exists('news/credits.json') else {}
for src in sys.argv[1:]:
    tag=os.path.basename(src)[6:-5]; d=json.load(open(src))
    items=d if isinstance(d,list) else d.get('items',list(d.values()))
    names=[]
    for i,v in enumerate(items):
        raw=base64.b64decode(v['data'].split(',')[-1])
        try: im=Image.open(io.BytesIO(raw)).convert('RGB')
        except Exception as e: print('bad',tag,i,e); continue
        fn=f'{tag}_{i:02d}.jpg'; im.save('news/'+fn,quality=92)
        cred[fn]={k:v.get(k) for k in ('q','host','page','src','title','osz','via')}; cred[fn]['size']=im.size; names.append(fn)
    W,H=400,270;c=5;sh=Image.new('RGB',(W*c,H*((len(names)+c-1)//c)),'white'); dr=ImageDraw.Draw(sh)
    for i,n in enumerate(names):
        p=Image.open('news/'+n); p.thumbnail((W-4,H-30)); sh.paste(p,((i%c)*W,(i//c)*H+28))
        dr.text(((i%c)*W+4,(i//c)*H+2),f"{i} {cred[n]['q']} {cred[n]['host']}",fill='red',font=F)
    sh.save(f'news/sheet_{tag}.jpg',quality=80); print(tag,len(names))
json.dump(cred,open('news/credits.json','w'),ensure_ascii=False,indent=1)
