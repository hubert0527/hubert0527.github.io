from glob import glob
from scipy.misc import imresize
import matplotlib.pyplot as plt

pad = (256-224) // 2

for p in glob("./*.jpg"):
	img = plt.imread(p)
	img = imresize(img, (256, 256))
	img = img[pad:pad+224, pad:pad+224, :]
	plt.imsave(p, img)

