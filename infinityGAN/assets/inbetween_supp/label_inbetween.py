import os
import numpy as np
from glob import glob
import matplotlib.pyplot as plt

inplace = True
ps = [p for p in glob("./*.png") if "composed" not in p]

c = np.array([237/255, 125/255, 49/255]).reshape(1, 1, 3)

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
    im[:, -1:, :] = c
    im[:, -128:-127, :] = c
    im[:1, -128:, :] = c
    im[-1:, -128:, :] = c

    if inplace:
        plt.imsave(p, im)
    else:
        plt.imsave("_"+os.path.basename(p), im)