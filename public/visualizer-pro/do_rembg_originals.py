import os
import glob
from rembg import remove

src_dir = r'C:\Users\av074\Downloads\calyco-ai-25d-visualizer-pro'
dest_dir = r'C:\Users\av074\Downloads\calyco-ai-25d-visualizer-pro\calyco-ai-25d-visualizer-pro\assets\living_room'

images = glob.glob(os.path.join(src_dir, '*.png'))
for img_path in images:
    if "base" in img_path.lower():
        continue
    filename = os.path.basename(img_path)
    out_path = os.path.join(dest_dir, filename)
    print(f"Removing background from {filename} with rembg...")
    with open(img_path, 'rb') as f:
        input_data = f.read()
    output_data = remove(input_data)
    with open(out_path, 'wb') as f:
        f.write(output_data)

print("Finished rembg on original images!")
