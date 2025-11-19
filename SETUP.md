# GameIQ PWA Setup Complete ✅

## What's Been Configured

### 1. ✅ Tailwind CSS v4
- Already installed and configured
- PostCSS setup complete
- Ready for mobile-first styling

### 2. ✅ shadcn/ui
- Initialized with default configuration
- Components ready to install
- `cn()` utility available at `@/lib/utils`

### 3. ✅ PWA Configuration
- `@ducanh2912/next-pwa` installed and configured
- Service worker auto-generation enabled
- Disabled in development mode

### 4. ✅ PWA Manifest
- Created at `/public/manifest.json`
- Configured for mobile-first experience
- App name: "GameIQ - Hockey Stats That Matter"
- Theme color: Slate 900 (#0f172a)

### 5. ✅ Mobile-First Layout Components
- `MobileLayout` - Main container with safe areas
- `BottomNav` - Mobile navigation bar
- `Header` - Sticky header with back button

### 6. ✅ Metadata & SEO
- PWA metadata in root layout
- Apple Web App support
- Viewport configuration for mobile

---

## Next Steps

### 1. Generate PWA Icons

You need to create icons for the PWA. Options:

**Option A: Use pwa-asset-generator (Recommended)**
```bash
# Create a logo.svg first, then:
npx pwa-asset-generator logo.svg public/icons --manifest public/manifest.json
```

**Option B: Use online tool**
- Go to https://realfavicongenerator.net/
- Upload your logo
- Download and place in `/public/icons/`

**Option C: Create placeholder icons**
```bash
brew install imagemagick
cd public/icons
for size in 72 96 128 144 152 192 384 512; do
  convert -size ${size}x${size} xc:#0f172a -fill white -pointsize $((size/3)) \
    -gravity center -draw "text 0,0 'GIQ'" icon-${size}x${size}.png
done
# Create maskable versions
cp icon-192x192.png icon-maskable-192x192.png
cp icon-512x512.png icon-maskable-512x512.png
```

### 2. Install shadcn/ui Components

As you need them:
```bash
# Examples:
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add badge
pnpm dlx shadcn@latest add avatar
pnpm dlx shadcn@latest add dialog
```

### 3. Test PWA Locally

```bash
# Build the app (PWA only works in production mode)
pnpm build

# Start production server
pnpm start

# Open in browser and check:
# - Chrome DevTools > Application > Manifest
# - Chrome DevTools > Application > Service Workers
# - Try "Add to Home Screen"
```

### 4. Mobile Testing

**Desktop Browser:**
```bash
# Open Chrome DevTools
# Toggle device toolbar (Cmd+Shift+M)
# Select mobile device (iPhone 14 Pro, etc.)
```

**Real Device:**
```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
# or
hostname -I  # Linux

# Access app at:
http://YOUR_IP:3000

# Make sure your phone is on same WiFi
```

**Deploy to Vercel (Best for real mobile testing):**
```bash
vercel --prod
# Test on actual mobile device via HTTPS URL
```

---

## Project Structure

```
game-iq/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ✅ Updated with PWA metadata
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── layout/
│   │       ├── MobileLayout.tsx    ✅ Mobile container
│   │       ├── BottomNav.tsx       ✅ Bottom navigation
│   │       └── Header.tsx          ✅ Mobile header
│   └── lib/
│       └── utils.ts            ✅ shadcn utilities
├── public/
│   ├── manifest.json           ✅ PWA manifest
│   └── icons/                  ⚠️  Need to generate
│       └── README.md
├── next.config.ts              ✅ PWA configured
└── package.json                ✅ Dependencies installed
```

---

## Example Usage

### Using Mobile Layout Components

```typescript
// app/dashboard/page.tsx
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export default function DashboardPage() {
  return (
    <MobileLayout>
      <Header title="Dashboard" />

      <main className="p-4 pb-20">
        {/* Your content here */}
        {/* pb-20 gives space for bottom nav */}
      </main>

      <BottomNav />
    </MobileLayout>
  );
}
```

### Installing and Using shadcn Components

```bash
# Install a component
pnpm dlx shadcn@latest add button

# Use it
import { Button } from "@/components/ui/button";

<Button variant="default" size="lg">
  Enable Notifications
</Button>
```

### Mobile-First Styling

```tsx
// Tailwind is mobile-first by default
<div className="
  p-4          {/* 16px on mobile */}
  md:p-6       {/* 24px on tablet */}
  lg:p-8       {/* 32px on desktop */}
">
  Mobile-first content
</div>
```

---

## PWA Features Enabled

- ✅ **Installable** - Add to home screen
- ✅ **Offline Support** - Service worker caching
- ✅ **Fast Loading** - Workbox precaching
- ✅ **Mobile Optimized** - Viewport & safe areas
- ⏳ **Push Notifications** - To be implemented

---

## Development Commands

```bash
# Development (PWA disabled)
pnpm dev

# Build
pnpm build

# Production server
pnpm start

# Lint
pnpm lint

# Add shadcn component
pnpm dlx shadcn@latest add [component-name]
```

---

## Testing PWA Installation

### Chrome (Desktop)
1. Build and run: `pnpm build && pnpm start`
2. Open http://localhost:3000
3. Look for install icon in address bar
4. Click to install

### Chrome (Android)
1. Deploy to Vercel or use ngrok
2. Open HTTPS URL on Android device
3. Chrome will show "Add to Home Screen" banner
4. Install and test

### Safari (iOS)
1. Deploy to Vercel (requires HTTPS)
2. Open URL in Safari on iPhone
3. Tap Share → Add to Home Screen
4. App will appear on home screen

---

## Troubleshooting

### PWA not showing install prompt
- Make sure you're in **production mode** (`pnpm build && pnpm start`)
- PWA is disabled in development
- Check manifest is loading: DevTools > Application > Manifest
- Ensure HTTPS for real devices (deploy to Vercel)

### Icons not showing
- Generate icons following steps above
- Check manifest.json paths match actual files
- Verify icons exist in /public/icons/

### Bottom nav not visible
- Check component is imported and rendered
- Ensure no z-index conflicts
- Verify `pb-20` or similar padding on main content

---

## Ready to Build! 🚀

Your Next.js PWA foundation is complete. You can now:

1. Generate icons (or use placeholders)
2. Start building features
3. Add shadcn components as needed
4. Test PWA features in production mode

**Quick test:**
```bash
pnpm build && pnpm start
```

Then open http://localhost:3000 in Chrome and check the Application tab!
