import os
from glob import glob
import matplotlib.pyplot as plt

inplace = True
ps = [p for p in glob("./*.png") if "composed" not in p]

for p in ps:
    im = plt.imread(p)[:, :, :3]

    # Left Bbox
    im[:, :1, :] = 0
    im[:, :1, 0] = 1
    im[:, 127:128, :] = 0
    im[:, 127:128, 0] = 1
    im[:1, :128, :] = 0
    im[:1, :128, 0] = 1
    im[-1:, :128, :] = 0
    im[-1:, :128, 0] = 1

    # Right Bbox
    im[:, -1:, :] = 0
    im[:, -1:, 0] = 1
    im[:, -128:-127, :] = 0
    im[:, -128:-127, 0] = 1
    im[:1, -128:, :] = 0
    im[:1, -128:, 0] = 1
    im[-1:, -128:, :] = 0
    im[-1:, -128:, 0] = 1

    if inplace:
        plt.imsave(p, im)
    else:
        plt.imsave("_"+os.path.basename(p), im)