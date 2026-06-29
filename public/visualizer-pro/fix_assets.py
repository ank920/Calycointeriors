import json
import os
from PIL import Image

def make_transparent(img_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    new_data = []
    # threshold for white background
    for item in data:
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    img.putdata(new_data)
    img.save(img_path, "PNG")

catalog_path = "catalog-living.json"
with open(catalog_path, "r") as f:
    catalog = json.load(f)

for layer_key in ["layer1", "layer2", "layer3"]:
    for item in catalog.get(layer_key, []):
        src = item["src"]
        img_path = os.path.join(os.getcwd(), src)
        if os.path.exists(img_path):
            make_transparent(img_path)
            img = Image.open(img_path)
            w, h = img.size
            # Keep original aspect ratio
            # we will scale it to fit roughly the desired target width
            target_width = item["placement"]["w"]
            scale = target_width / w
            item["placement"]["w"] = target_width
            item["placement"]["h"] = int(h * scale)
            print(f"Updated {src}: {target_width}x{int(h * scale)}")

with open(catalog_path, "w") as f:
    json.dump(catalog, f, indent=2)

print("Done updating aspect ratios and removing backgrounds.")
