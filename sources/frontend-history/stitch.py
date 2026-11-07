# python3 stitch.py name cols cropW cropH id1 id2 ...（行优先；id 为文件名末尾 6 位）
import sys, glob
from PIL import Image
name, cols, cw, ch, ids = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5:]
d = '/root/.claude/projects/-home-claude/b3cfba63-b7cf-5b19-9b71-4c1c28c4406a/tool-results/'
rows = (len(ids) + cols - 1) // cols; S = Image.new('RGB', (800 * cols, 500 * rows))
for i, k in enumerate(ids): S.paste(Image.open(glob.glob(d + f'*-{k}.png')[0]).convert('RGB'), ((i % cols) * 800, (i // cols) * 500))
S.crop((0, 0, cw, ch)).save(f'/home/claude/fhv/shots/{name}.jpg', quality=90); print(name, cw, ch)
