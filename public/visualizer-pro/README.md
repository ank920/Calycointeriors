# Calyco AI 2.5D Visualizer Pro

This is the advanced fixed-angle 2.5D room visualizer using the real rendered assets from this chat.

## Included assets

- Base room: `assets/base-room.png`
- Beds:
  - Tufted Cream Bed
  - Walnut LED Bed
  - Olive Soft Bed
- Side tables:
  - Rounded Wood Table
  - Stacked Drawer Table
  - mirrored left/right versions
- Wardrobes:
  - Industrial Mesh Wardrobe
  - Olive Brass Wardrobe
- Thumbnails for all options
- Default preview image: `preview-default.jpg`

## Features

- Change bed, side table, wardrobe
- Canvas-based high-quality composition
- Calibrated placement for the supplied base room
- Contact shadows
- Brightness/contrast matching
- Manual layer adjustment
- Drag objects directly in the room
- Show/hide placement boxes
- One-side-table toggle
- Download final room PNG
- Export layout JSON

## How to run

Recommended:

```bash
cd calyco-ai-25d-visualizer-pro
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

Directly opening `index.html` may work in Chrome, but using the local server is safer because the app loads `catalog.json`.

## Production rule

For best realism, every future bed, side table and wardrobe cutout must be rendered from the same camera angle, same lighting direction, same transparent background, and same scale reference.
