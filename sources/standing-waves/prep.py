"""把图库整理成视频用图：i/<键>.jpg（最长边不超过 1920，透明处垫白）+ img.js（尺寸、中文说明、署名）。"""
import json, glob, os, re, html
from PIL import Image
CAP = {1:'绳上的驻波（频闪照片）',2:'弦的前几个泛音',3:'吉他面板的克拉尼图形',4:'长笛与单簧管',5:'鲁本斯管：火焰画出管内驻波',6:'昆特管：粉末堆在波节处',
7:'台北 101 的调谐质量阻尼器',8:'塔科马海峡大桥扭转振动（1940）',9:'管风琴内部的音管',10:'伦敦千禧桥',11:'用琴弓拉克拉尼板（19 世纪插图）',12:'梅尔德实验：振动器驱动的绳',
13:'塔科马海峡大桥倒塌时奔跑的人（1940）',14:'克拉尼肖像（1809）',15:'方板克拉尼图形',16:'方板克拉尼图形',17:'火焰管共振',18:'定音鼓',19:'液面上的法拉第波',20:'方板克拉尼图形',
21:'芬迪湾 · 涨潮',22:'芬迪湾 · 退潮',23:'石英音叉（手表晶振）',24:'WMAP 测得的宇宙微波背景功率谱',25:'法布里-珀罗标准具的干涉环',26:'氢原子电子云密度图',
27:'微波炉内部',28:'不同尺寸量子点的发光颜色',29:'钴原子椭圆围栏中的电子驻波（扫描隧道显微镜）',30:'日内瓦湖的纵向与横向假潮（19 世纪图）',31:'萨吉诺湾的假潮',
32:'太阳的一个声学振动模式（模型计算）',33:'太阳振荡功率谱',34:'声悬浮装置 TinyLev 托起的小物体',35:'拨弦的吉他',36:'圣保罗大教堂回音廊',37:'普朗克卫星的宇宙微波背景图',
38:'太阳振动模式示意',40:'不同频率的音叉'}
cr = {int(c['file'][4:6]): c for c in json.load(open('/home/claude/sw/web/web_images_credits.json'))}
def clean(a):
    a = html.unescape(re.sub('<[^>]+>', '', a)).replace('Unknown authorUnknown author', '佚名')
    a = re.sub(r'\s*\(https?://[^)]*\)', '', a).strip()
    a = {'PoorLeno (talk)':'PoorLeno','António Miguel de Campos - en:User:Tó campos':'António Miguel de Campos'}.get(a, a)
    if a.startswith('Joseph A. Stroscio'): a = 'J. A. Stroscio 等（NIST）'
    return a if len(a) < 70 else a[:66] + '…'
M = {}
for f in sorted(glob.glob('/home/claude/sw/img/own_*.png')) + sorted(glob.glob('/home/claude/sw/web/web_[0-9]*')):
    b = os.path.basename(f); key = b[:6]
    if key.startswith('web_') and int(key[4:]) == 39: continue
    im = Image.open(f)
    if im.mode in ('RGBA', 'LA', 'P'):
        im = im.convert('RGBA'); bg = Image.new('RGB', im.size, 'white'); bg.paste(im, mask=im.split()[3]); im = bg
    im = im.convert('RGB'); im.thumbnail((1920, 1080) if key.startswith('own') else (1920, 1440), Image.LANCZOS)
    im.save(f'i/{key}.jpg', quality=90)
    m = {'w': im.size[0], 'h': im.size[1]}
    if key.startswith('web'):
        n = int(key[4:]); c = cr[n]; m['cap'] = CAP[n]; m['cr'] = f"{clean(c['artist'])} · {c['lic']} · Wikimedia Commons"
    M[key] = m
open('img.js', 'w').write('window.IMG=' + json.dumps(M, ensure_ascii=False) + ';')
json.dump(M, open('img.json', 'w'), ensure_ascii=False, indent=0); print(len(M))
