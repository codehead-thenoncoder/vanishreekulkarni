from PIL import Image, ImageFilter, ImageOps
import rembg
import numpy as np
import io

input_path = 'public/media/photos/gallery/youtube_avatar.jpg'
output_path = 'public/media/photos/homepage/vani_contact_sticker.png'

# Read input image
with open(input_path, 'rb') as f:
    input_bytes = f.read()

# Remove background using full u2net
session = rembg.new_session('u2net')
output_bytes = rembg.remove(input_bytes, session=session)
img = Image.open(io.BytesIO(output_bytes)).convert('RGBA')

# Crop to subject bounding box with small margin
bbox = img.getbbox()
if bbox:
    cropped = img.crop(bbox)
else:
    cropped = img

# Optional: Add subtle white sticker border just like the template sticker
# Create alpha mask dilated
alpha = cropped.split()[-1]
# Dilate alpha by 6 pixels for white border
dilated = alpha.filter(ImageFilter.MaxFilter(11))
white_bg = Image.new('RGBA', cropped.size, (255, 255, 255, 255))
white_bg.putalpha(dilated)
sticker = Image.alpha_composite(white_bg, cropped)

# Save both clean transparent cutout and sticker version
cropped.save('public/media/photos/homepage/vani_contact_clean.png')
sticker.save('public/media/photos/homepage/vani_contact_sticker.png')

print('Generated vani_contact_clean.png and vani_contact_sticker.png')
print('Dimensions:', cropped.size)
