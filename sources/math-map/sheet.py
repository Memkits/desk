# python3 sheet.py out.jpg pv/a.jpg pv/b.jpg ...  （每行 2 张，960×540）
import sys
from PIL import Image, ImageDraw
out, fs = sys.argv[1], sys.argv[2:]
W, H = 960, 540; S = Image.new('RGB', (W * 2, H * ((len(fs) + 1) // 2)), 'black'); d = ImageDraw.Draw(S)
for i, f in enumerate(fs):
    im = Image.open(f).resize((W, H)); S.paste(im, ((i % 2) * W, (i // 2) * H)); d.text(((i % 2) * W + 8, (i // 2) * H + 4), f.split('/')[-1], fill='yellow')
S.save(out, quality=80)
