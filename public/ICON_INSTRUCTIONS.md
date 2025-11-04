# Creating PWA Icons

To fix the PWA icon errors, you need to create icon files. Here are two options:

## Option 1: Quick Fix (Current)
I've removed the icon references from manifest.json temporarily. The app will work without icons, but PWA installation might not show icons.

## Option 2: Create Icons (Recommended)

You need to create two PNG files:
- `public/icon-192.png` (192x192 pixels)
- `public/icon-512.png` (512x512 pixels)

### Quick Way to Create Icons:

1. **Using an online tool:**
   - Go to https://realfavicongenerator.net/ or https://www.favicon-generator.org/
   - Upload a simple logo or use text "U" or "UNI"
   - Download the icons
   - Place `icon-192.png` and `icon-512.png` in the `public/` folder

2. **Using Image Editor:**
   - Create a 192x192px image with your logo/brand
   - Export as PNG
   - Copy and resize to 512x512px for the larger icon
   - Save both in `public/` folder

3. **Using a simple design:**
   - Blue background (#0066cc)
   - White "U" letter in center
   - Rounded corners

Once you have the icons, uncomment the icons section in `public/manifest.json`.

