# GameIQ PWA - Quick Start

## ✅ Setup Complete!

Your Next.js PWA with Tailwind CSS and shadcn/ui is ready to go.

---

## 🚀 Run the App

### Development Mode (PWA disabled for faster iteration)
```bash
pnpm dev
```
Open http://localhost:3000

### Production Mode (Test PWA features)
```bash
pnpm build && pnpm start
```
Open http://localhost:3000 and check for "Install" prompt

---

## 📱 Generate Icons (Required for PWA)

### Option 1: Auto-generate placeholders (Quick)
```bash
# Requires ImageMagick
brew install imagemagick

# Generate placeholder icons
./scripts/generate-placeholder-icons.sh
```

### Option 2: Use your logo
```bash
# Place your logo.svg in the root, then:
npx pwa-asset-generator logo.svg public/icons
```

### Option 3: Online tool
Visit https://realfavicongenerator.net/

---

## 🎨 Add UI Components (shadcn)

```bash
# Button
pnpm dlx shadcn@latest add button

# Card
pnpm dlx shadcn@latest add card

# Badge
pnpm dlx shadcn@latest add badge

# Avatar
pnpm dlx shadcn@latest add avatar

# Dialog (Modal)
pnpm dlx shadcn@latest add dialog

# Input
pnpm dlx shadcn@latest add input

# See all: https://ui.shadcn.com/docs/components
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with PWA metadata
│   └── page.tsx                # Home page
├── components/
│   ├── layout/
│   │   ├── MobileLayout.tsx    # Mobile-first container
│   │   ├── BottomNav.tsx       # Bottom navigation
│   │   └── Header.tsx          # Mobile header
│   └── ui/                     # shadcn components go here
└── lib/
    └── utils.ts                # Utility functions (cn, etc.)
```

---

## 💡 Example: Create a Mobile Page

```typescript
// src/app/dashboard/page.tsx
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export default function DashboardPage() {
  return (
    <MobileLayout>
      <Header title="Dashboard" />

      <main className="p-4 pb-20">
        <h2 className="text-2xl font-bold">Welcome to GameIQ</h2>
        {/* Your content */}
      </main>

      <BottomNav />
    </MobileLayout>
  );
}
```

---

## 🧪 Test PWA Features

### Desktop (Chrome)
1. `pnpm build && pnpm start`
2. Open Chrome DevTools → Application tab
3. Check Manifest, Service Worker
4. Click install icon in address bar

### Mobile Device (Real testing)
1. Deploy to Vercel: `vercel --prod`
2. Open HTTPS URL on phone
3. Install to home screen
4. Test offline, notifications, etc.

---

## 📱 Mobile-First Styling (Tailwind)

```tsx
{/* Mobile first - styles apply to mobile by default */}
<div className="
  p-4          {/* 16px padding on mobile */}
  md:p-6       {/* 24px on tablet (768px+) */}
  lg:p-8       {/* 32px on desktop (1024px+) */}
">
  Content
</div>

{/* Hide on mobile, show on desktop */}
<div className="hidden lg:block">
  Desktop only
</div>

{/* Show on mobile, hide on desktop */}
<div className="block lg:hidden">
  Mobile only
</div>
```

---

## 🎯 Next Steps (Based on Implementation Plan)

### Week 1: Backend Event System
1. Create `/src/app/api/events/ingest/route.ts`
2. Set up database (Vercel Postgres or Supabase)
3. Create event types in `/src/types/game.ts`

### Week 2: Simulation Script
1. Create `/scripts/simulate-game.ts`
2. Test event dispatch
3. Create demo scenarios

### Week 3: Push Notifications
1. Set up Firebase Cloud Messaging
2. Add notification permission UI
3. Test on mobile device

See [simulation_implementation_plan.md](./simulation_implementation_plan.md) for full details.

---

## 📚 Documentation

- [Full Setup Guide](./SETUP.md)
- [PWA Implementation Plan](./pwa_implementation_plan.md)
- [Simulation Plan](./simulation_implementation_plan.md)
- [MVP Breakdown](./mvp_implementation_plan.md)

---

## 🛠 Helpful Commands

```bash
# Development
pnpm dev

# Production build
pnpm build

# Production server
pnpm start

# Type checking
pnpm tsc --noEmit

# Lint
pnpm lint

# Add shadcn component
pnpm dlx shadcn@latest add [component]

# Generate placeholder icons
./scripts/generate-placeholder-icons.sh
```

---

## 🔥 You're Ready!

Everything is configured for mobile-first PWA development:
- ✅ Next.js 16 with App Router
- ✅ Tailwind CSS v4
- ✅ shadcn/ui components
- ✅ PWA with service workers
- ✅ Mobile-first layouts

Start building! 🚀
