import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import rembg

# 1. Load original high-res image
input_path = 'public/media/photos/gallery/youtube_avatar.jpg'
img_bgr = cv2.imread(input_path)
img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)

# 2. Extract accurate alpha mask using u2net
session = rembg.new_session('u2net')
with open(input_path, 'rb') as f:
    raw_bytes = f.read()

mask_bytes = rembg.remove(raw_bytes, session=session, only_mask=True)
mask = cv2.imdecode(np.frombuffer(mask_bytes, np.uint8), cv2.IMREAD_GRAYSCALE)

# Clean alpha mask: keep only largest connected component to eliminate any stray background specks
num_labels, labels, stats, centroids = cv2.connectedComponentsWithStats((mask > 20).astype(np.uint8), connectivity=8)
if num_labels > 1:
    # label 0 is background; find largest component among 1..num_labels-1
    largest_label = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
    mask[labels != largest_label] = 0

# Threshold low noise in background
mask[mask < 15] = 0
mask_float = mask.astype(np.float32) / 255.0

# 3. Enhance image quality:
# - Subtle bilateral filter to reduce JPEG noise in skin tones while preserving sharp edges
denoised = cv2.bilateralFilter(img_rgb, d=5, sigmaColor=35, sigmaSpace=35)

# - Unsharp masking to enhance clarity of jewelry, eyes, and texture
gaussian = cv2.GaussianBlur(denoised, (0, 0), sigmaX=1.5)
sharpened = cv2.addWeighted(denoised, 1.35, gaussian, -0.35, 0)
sharpened = np.clip(sharpened, 0, 255).astype(np.uint8)

# - Subtle contrast and color vibrance enhancement via PIL
pil_img = Image.fromarray(sharpened)
enhancer = ImageEnhance.Color(pil_img)
pil_enhanced = enhancer.enhance(1.08)
enhancer = ImageEnhance.Contrast(pil_enhanced)
pil_enhanced = enhancer.enhance(1.05)
enhanced_np = np.array(pil_enhanced)

# 4. Generate smooth, antialiased sticker border using Euclidean distance transform
# (Eliminating the jagged, blocky stair-stepping from MaxFilter)
border_radius = 8.0 # Smooth border radius
# Binary mask for distance transform
bin_mask = (mask > 128).astype(np.uint8)
dist = cv2.distanceTransform(1 - bin_mask, cv2.DIST_L2, 5)

# Smooth border falloff
border_alpha = np.clip((border_radius + 1.0 - dist) / 1.5, 0.0, 1.0)
combined_alpha = np.maximum(mask_float, border_alpha)

# Create sticker with smooth white border
h, w = img_rgb.shape[:2]
sticker_rgba = np.zeros((h, w, 4), dtype=np.uint8)

# Where border exists, blend between white and subject
white_bg = np.full((h, w, 3), 255, dtype=np.uint8)

# Subject overlay
subject_alpha = mask_float[:, :, np.newaxis]
blended_rgb = (enhanced_np * subject_alpha + white_bg * (1.0 - subject_alpha)).astype(np.uint8)

sticker_rgba[:, :, :3] = blended_rgb
sticker_rgba[:, :, 3] = (combined_alpha * 255).astype(np.uint8)

# Also create clean cutout version without white border for comparison
clean_rgba = np.zeros((h, w, 4), dtype=np.uint8)
clean_rgba[:, :, :3] = enhanced_np
clean_rgba[:, :, 3] = (mask_float * 255).astype(np.uint8)

# Save high-res, compressed WebP and PNG
out_sticker = Image.fromarray(sticker_rgba)
out_clean = Image.fromarray(clean_rgba)

# Save PNG (optimized)
out_sticker.save('public/media/photos/homepage/vani_contact_sticker.png', optimize=True)
out_clean.save('public/media/photos/homepage/vani_contact_clean.png', optimize=True)

# Also save high-quality WebP version (lossless/lossy with alpha 95%)
out_sticker.save('public/media/photos/homepage/vani_contact_sticker.webp', 'WEBP', quality=95, method=6)
out_clean.save('public/media/photos/homepage/vani_contact_clean.webp', 'WEBP', quality=95, method=6)

import os
png_size = os.path.getsize('public/media/photos/homepage/vani_contact_sticker.png')
webp_size = os.path.getsize('public/media/photos/homepage/vani_contact_sticker.webp')
print(f'Done! PNG size: {png_size // 1024} KB, WebP size: {webp_size // 1024} KB')
print(f'Dimensions: {out_sticker.size}')
