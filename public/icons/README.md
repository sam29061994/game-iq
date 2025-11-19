# PWA Icons

## Required Sizes

Generate the following icon sizes and place them in this directory:

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png
- icon-maskable-192x192.png (with safe zone)
- icon-maskable-512x512.png (with safe zone)

## Quick Generation

You can use one of these tools:

1. **PWA Asset Generator** (CLI):
   ```bash
   npx pwa-asset-generator logo.svg public/icons
   ```

2. **Favicon.io**: https://favicon.io/
3. **RealFaviconGenerator**: https://realfavicongenerator.net/

## Temporary Placeholder

For now, you can create a simple placeholder:

```bash
# Install ImageMagick
brew install imagemagick

# Generate placeholder icons
for size in 72 96 128 144 152 192 384 512; do
  convert -size ${size}x${size} xc:#0f172a -fill white -pointsize $((size/3)) \
    -gravity center -draw "text 0,0 'GIQ'" icon-${size}x${size}.png
done
```
