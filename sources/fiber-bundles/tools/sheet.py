import sys
from PIL import Image
fs=sys.argv[2:]; out=sys.argv[1]; W=640; H=360; cols=2
S=Image.new('RGB',(W*cols,H*((len(fs)+cols-1)//cols)))
for i,f in enumerate(fs): S.paste(Image.open(f).resize((W,H)),((i%cols)*W,(i//cols)*H))
S.save(out,quality=85)
