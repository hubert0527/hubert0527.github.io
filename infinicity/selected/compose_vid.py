import imageio
import numpy as np
from tqdm import tqdm

CFG = [
	# ["7-0-0000-clip_0001", "00:01:00-00:06:00"],
	["8-5-9487-clip_0000", "00:56:00-01:01:00"],
	["8-4-9487-clip_0004", "00:09:00-00:14:00"],
	# ["8-4-0000-clip_0001", "00:04:00-00:09:00"],
	["8-5-9487-clip_0000", "01:06:00-01:11:00"],
	["8-3-0000-clip_0000", "00:00:00-00:05:00"],
]
IN_FPS = 30
OUT_FPS = 15
OUT_NCOL = 4
OUT_NAME = "out.mp4"
padding = 4
padding_color = 16 * 2 + 2 # Hex code of #222222

def parse_time(s, fps):
	minu, sec, frame = s.split(":")
	minu, sec, frame = int(minu), int(sec), int(frame)
	return int((minu * 60 + sec) * fps + fps)

def parse_cfg(s, fps):
	st, ed = s.split("-")
	return parse_time(st, fps), parse_time(ed, fps)

def comp_frames(frames):
	assert len(frames) % OUT_NCOL == 0, \
		"Got {} % {} != 0".format(len(frames), OUT_NCOL)
	NROW = len(frames) // OUT_NCOL
	h, w, _ = frames[0].shape
	H = NROW * h + padding * (NROW - 1)
	W = OUT_NCOL * w + padding * (OUT_NCOL - 1)
	meta = np.ones((H, W, 3), dtype=np.uint8)
	for i in range(NROW):
		for j in range(OUT_NCOL):
			idx = i * OUT_NCOL + j
			xst = i * h
			yst = j * w
			if i > 0: xst += i * padding
			if j > 0: yst += j * padding
			# import pdb; pdb.set_trace()
			meta[xst:xst+h, yst:yst+w, :] = frames[idx]
	return meta

if __name__ == "__main__":

	global_buffer = []
	for k,v in tqdm(CFG):
		pix_vid_path = k + "_img.mp4"
		vox_vid_path = k + "_vox.mp4"

		pix_vid = imageio.get_reader(pix_vid_path,  'ffmpeg')
		vox_vid = imageio.get_reader(vox_vid_path,  'ffmpeg')

		vid_meta = pix_vid.get_meta_data()
		st, ed = parse_cfg(v, vid_meta["fps"])
		assert vid_meta["fps"] % IN_FPS == 0, \
			"Got {} % {} != 0".format(vid_meta["fps"], IN_FPS)
		down_sample_rate = vid_meta["fps"] // IN_FPS

		pix_buffer = []
		vox_buffer = []
		for i in range(st, ed, int(down_sample_rate)):
			pix_buffer.append(pix_vid.get_data(i))
			vox_buffer.append(vox_vid.get_data(i))
		global_buffer.append(pix_buffer)
		global_buffer.append(vox_buffer)

	fout = imageio.get_writer(OUT_NAME, fps=OUT_FPS, format='FFMPEG', quality=6)
	for i in tqdm(range(len(global_buffer[0]))):
		frames = [b[i] for b in global_buffer]
		comp = comp_frames(frames)
		fout.append_data(comp)
	fout.close()

