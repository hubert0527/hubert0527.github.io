from glob import glob
from PIL import Image
import os
pad = (256-224)//2
P = "./demo-samples/"
names = []
for p in glob(P + "*.jpg"):
	im = Image.open(p)
	im.resize((256, 256))
	im.crop((pad, pad, pad+224, pad+224))
	im.save(p[:-4]+".png")
	os.remove(p)
	names.append(os.path.basename(p[:-4]))

print(", ".join(names))
