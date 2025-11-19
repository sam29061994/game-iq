#!/bin/bash

# Quick placeholder icon generator for GameIQ PWA
# Requires ImageMagick: brew install imagemagick

ICON_DIR="public/icons"
LOGO_TEXT="GIQ"
BG_COLOR="#0f172a"
TEXT_COLOR="white"

mkdir -p "$ICON_DIR"

echo "Generating placeholder PWA icons..."

# Generate standard icons
for size in 72 96 128 144 152 192 384 512; do
  echo "Creating ${size}x${size} icon..."
  convert -size ${size}x${size} \
    xc:"$BG_COLOR" \
    -fill "$TEXT_COLOR" \
    -pointsize $((size/3)) \
    -font "Helvetica-Bold" \
    -gravity center \
    -draw "text 0,0 '$LOGO_TEXT'" \
    "$ICON_DIR/icon-${size}x${size}.png"
done

# Create maskable icons (with safe zone)
echo "Creating maskable icons..."
for size in 192 512; do
  convert -size ${size}x${size} \
    xc:"$BG_COLOR" \
    -fill "$TEXT_COLOR" \
    -pointsize $((size/4)) \
    -font "Helvetica-Bold" \
    -gravity center \
    -draw "text 0,0 '$LOGO_TEXT'" \
    "$ICON_DIR/icon-maskable-${size}x${size}.png"
done

echo "✅ Placeholder icons generated in $ICON_DIR"
echo "Replace these with your actual logo when ready!"
