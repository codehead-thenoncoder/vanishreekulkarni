from PIL import Image, ImageFilter
import numpy as np

img = Image.open('public/media/photos/homepage/vani_contact_clean.png')
arr = np.array(img)

# Threshold alpha: values below 128 become 0, values above 180 become 255, smooth transition in between
alpha = arr[:, :, 3].astype(float)
new_alpha = np.clip((alpha - 100) / (200 - 100) * 255, 0, 255).astype(np.uint8)

arr[:, :, 3] = new_alpha
clean = Image.fromarray(arr)

# Crop to non-transparent bounding box
bbox = clean.getbbox()
clean = clean.crop(bbox)

# Add classic white sticker contour border matching Peach-Portfolio aesthetic
alpha_chan = clean.split()[-1]
dilated = alpha_chan.filter(ImageFilter.MaxFilter(9))
white_base = Image.new('RGBA', clean.size, (255, 255, 255, 255))
white_base.putalpha(dilated)
sticker = Image.alpha_composite(white_base, clean)

clean.save('public/media/photos/homepage/vani_contact_clean.png')
sticker.save('public/media/photos/homepage/vani_contact_sticker.png')
print('Saved crisp contact cutout. Dimensions:', clean.size)
