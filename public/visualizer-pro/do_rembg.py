import os
import glob
from rembg import remove

# Overwrite all living room items with a proper rembg background removal
images = glob.glob('assets/living_room/*.png')
for img_path in images:
    if "base" in img_path.lower():
        continue # skip base image
    print(f"Removing background from {img_path} with rembg...")
    with open(img_path, 'rb') as f:
        input_data = f.read()
    output_data = remove(input_data)
    with open(img_path, 'wb') as f:
        f.write(output_data)

print("Finished rembg!")
