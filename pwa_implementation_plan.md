# GameIQ PWA Implementation Plan

## Strategy: Next.js PWA Demo

**Goal:** Build a working demo to prove the concept to Gamesheet, not a production app

**Why PWA:**
- ✅ Single codebase (web) instead of iOS + Android
- ✅ Push notifications work on Android & desktop browsers
- ✅ Faster to build and iterate
- ✅ No app store approval needed
- ✅ Instant updates, no app distribution
- ✅ Perfect for demo/proof-of-concept
- ✅ Can be "installed" on home screen like native app

**Limitations to Accept:**
- ⚠️ iOS Safari has limited push notification support (only since iOS 16.4)
- ⚠️ Requires HTTPS (fine for demo with Vercel)
- ⚠️ Not as polished as native app

---

## Technical Stack

### Core Framework
- **Next.js 14+** (App Router)
- **React 18+**
- **TypeScript**

### PWA & Notifications
- **next-pwa** - Service worker & PWA manifest
- **Firebase Cloud Messaging (FCM)** - Push notification delivery
- **Web Push API** - Browser notification interface

### UI/Styling
- **Tailwind CSS** - Rapid UI development
- **shadcn/ui** - Pre-built components
- **Framer Motion** - Animations (optional)

### Data & Backend
- **Next.js API Routes** - Backend endpoints
- **Vercel Postgres** or **Supabase** - Database
- **OpenAI API** - AI game summaries

### Real-time Updates
- **Polling** (simple for demo) - Check Gamesheet API every 30s during games
- **Server-Sent Events** (better UX) - Real-time push from server
- **Vercel Cron Jobs** - Scheduled game checks

---

## Project Structure

```
game-iq/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── player/[id]/          # Player profile
│   │   ├── game/[id]/            # Game summary
│   │   └── settings/             # Notification preferences
│   ├── api/
│   │   ├── notifications/
│   │   │   ├── subscribe/        # Save FCM token
│   │   │   └── send/             # Send notification
│   │   ├── gamesheet/
│   │   │   ├── events/           # Poll game events
│   │   │   └── games/            # Get game data
│   │   ├── ai/
│   │   │   └── summary/          # Generate game summary
│   │   └── milestones/
│   │       └── check/            # Check for milestones
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/
│   ├── notifications/
│   │   ├── NotificationPrompt.tsx
│   │   └── NotificationSettings.tsx
│   ├── player/
│   │   ├── PlayerCard.tsx
│   │   ├── StatsDisplay.tsx
│   │   └── MilestoneProgress.tsx
│   └── game/
│       ├── GameSummary.tsx
│       └── ShareButton.tsx
├── lib/
│   ├── gamesheet-api.ts          # Gamesheet integration
│   ├── notifications.ts          # Push notification logic
│   ├── milestones.ts             # Milestone detection
│   └── ai.ts                     # OpenAI integration
├── public/
│   ├── manifest.json             # PWA manifest
│   ├── icons/                    # App icons
│   └── firebase-messaging-sw.js  # Service worker
└── next.config.js                # PWA config
```

---

## Implementation Phases

### Phase 1: PWA Setup (Week 1)

#### Install Dependencies
```bash
npm install next-pwa
npm install firebase
npm install @vercel/postgres  # or supabase if preferred
```

#### Configure PWA
**next.config.js:**
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
  // Your Next.js config
})
```

#### Create Manifest
**public/manifest.json:**
```json
{
  "name": "GameIQ - Hockey Stats That Matter",
  "short_name": "GameIQ",
  "description": "Real-time notifications and AI summaries for your player",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### Update Layout
**app/layout.tsx:**
```typescript
export const metadata = {
  manifest: '/manifest.json',
  themeColor: '#000000',
}
```

---

### Phase 2: Push Notifications (Week 2)

#### Firebase Setup
1. Create Firebase project
2. Enable Cloud Messaging
3. Get FCM credentials

#### Service Worker
**public/firebase-messaging-sw.js:**
```javascript
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "...",
  projectId: "...",
  messagingSenderId: "...",
  appId: "..."
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: payload.data
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})
```

#### Notification Permission Component
**components/notifications/NotificationPrompt.tsx:**
```typescript
'use client'

import { useState, useEffect } from 'react'
import { getMessaging, getToken } from 'firebase/messaging'
import { initializeApp } from 'firebase/app'

export function NotificationPrompt() {
  const [permission, setPermission] = useState<NotificationPermission>('default')

  const requestPermission = async () => {
    const permission = await Notification.requestPermission()
    setPermission(permission)

    if (permission === 'granted') {
      const app = initializeApp({ /* config */ })
      const messaging = getMessaging(app)

      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY'
      })

      // Save token to database
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        body: JSON.stringify({ token })
      })
    }
  }

  return (
    <div>
      {permission !== 'granted' && (
        <button onClick={requestPermission}>
          Enable Notifications
        </button>
      )}
    </div>
  )
}
```

#### Send Notification API
**app/api/notifications/send/route.ts:**
```typescript
import admin from 'firebase-admin'

export async function POST(request: Request) {
  const { userId, title, body, data } = await request.json()

  // Get user's FCM token from database
  const token = await getUserFCMToken(userId)

  await admin.messaging().send({
    token,
    notification: { title, body },
    data,
    webpush: {
      fcmOptions: {
        link: data.url // Where to navigate when clicked
      }
    }
  })

  return Response.json({ success: true })
}
```

---

### Phase 3: Gamesheet Integration (Week 3)

#### Gamesheet API Client
**lib/gamesheet-api.ts:**
```typescript
export class GamesheetAPI {
  private baseUrl = 'https://api.gamesheet.com' // Placeholder
  private apiKey = process.env.GAMESHEET_API_KEY

  async getGameEvents(gameId: string) {
    const response = await fetch(`${this.baseUrl}/games/${gameId}/events`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    })
    return response.json()
  }

  async getPlayerStats(playerId: string) {
    const response = await fetch(`${this.baseUrl}/players/${playerId}/stats`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    })
    return response.json()
  }

  async getGameSchedule(teamId: string) {
    const response = await fetch(`${this.baseUrl}/teams/${teamId}/schedule`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` }
    })
    return response.json()
  }
}
```

#### Event Polling System
**app/api/gamesheet/poll/route.ts:**
```typescript
export async function POST(request: Request) {
  const { gameId, lastEventId } = await request.json()

  const gamesheet = new GamesheetAPI()
  const events = await gamesheet.getGameEvents(gameId)

  // Filter to new events only
  const newEvents = events.filter(e => e.id > lastEventId)

  // Process each event
  for (const event of newEvents) {
    await processGameEvent(event)
  }

  return Response.json({
    events: newEvents,
    lastEventId: newEvents[newEvents.length - 1]?.id
  })
}

async function processGameEvent(event: GameEvent) {
  if (event.type === 'GOAL') {
    // Check if it's a tracked player
    const player = await getTrackedPlayer(event.playerId)
    if (!player) return

    // Check for milestones
    const milestone = await checkMilestone(event)

    // Send notification to parents
    await sendNotification({
      userId: player.parentId,
      title: milestone
        ? `🎉 ${player.name} - MILESTONE GOAL!`
        : `⚽ ${player.name} scores!`,
      body: milestone
        ? `${player.name}'s ${milestone.count}${getOrdinal(milestone.count)} goal of the season!`
        : `That's goal #${player.seasonGoals + 1}`,
      data: {
        playerId: player.id,
        gameId: event.gameId,
        type: 'goal'
      }
    })
  }
}
```

#### Client-side Polling
**components/game/LiveGameMonitor.tsx:**
```typescript
'use client'

import { useEffect, useState } from 'react'

export function LiveGameMonitor({ gameId }: { gameId: string }) {
  const [lastEventId, setLastEventId] = useState(0)

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch('/api/gamesheet/poll', {
        method: 'POST',
        body: JSON.stringify({ gameId, lastEventId })
      })

      const { events, lastEventId: newLastId } = await response.json()

      if (events.length > 0) {
        setLastEventId(newLastId)
        // Update UI with new events
      }
    }, 30000) // Poll every 30 seconds

    return () => clearInterval(interval)
  }, [gameId, lastEventId])

  return <div>Monitoring game...</div>
}
```

---

### Phase 4: AI Summaries (Week 4)

#### OpenAI Integration
**lib/ai.ts:**
```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateGameSummary(gameData: GameData) {
  const prompt = `
You are writing a brief, engaging game summary for a parent about their child's hockey game.

Player: ${gameData.playerName}
Game Result: ${gameData.result}
Player Stats: ${gameData.goals}G, ${gameData.assists}A
Season Stats: ${gameData.seasonGoals}G, ${gameData.seasonAssists}A in ${gameData.gamesPlayed} games
League Ranking: ${gameData.leagueRank} in ${gameData.division}

Write a 3-4 sentence summary that:
1. Highlights the player's key contributions
2. Provides season context
3. Uses an enthusiastic but authentic tone
4. Includes relevant stats

Keep it concise and shareable.
`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 200
  })

  return completion.choices[0].message.content
}
```

#### Summary Generation API
**app/api/ai/summary/route.ts:**
```typescript
export async function POST(request: Request) {
  const { gameId, playerId } = await request.json()

  // Fetch game and player data
  const gameData = await getGameData(gameId, playerId)

  // Generate summary
  const summary = await generateGameSummary(gameData)

  // Save summary to database
  await saveGameSummary({
    gameId,
    playerId,
    summary,
    generatedAt: new Date()
  })

  // Send notification
  await sendNotification({
    userId: gameData.parentId,
    title: 'Game Summary Ready',
    body: summary.substring(0, 100) + '...',
    data: { gameId, playerId }
  })

  return Response.json({ summary })
}
```

---

### Phase 5: Milestone Detection (Week 5)

#### Milestone Logic
**lib/milestones.ts:**
```typescript
export interface Milestone {
  type: 'goal' | 'assist' | 'point' | 'streak' | 'game_performance'
  count: number
  description: string
  emoji: string
}

export async function checkMilestone(
  playerId: string,
  eventType: 'goal' | 'assist',
  currentStats: PlayerStats
): Promise<Milestone | null> {

  if (eventType === 'goal') {
    const goalCount = currentStats.seasonGoals

    // Check goal milestones
    if ([5, 10, 15, 20, 25, 30].includes(goalCount)) {
      return {
        type: 'goal',
        count: goalCount,
        description: `${goalCount}${getOrdinal(goalCount)} goal of the season!`,
        emoji: '🎉'
      }
    }

    // Check career high
    if (goalCount > currentStats.careerHighGoals) {
      return {
        type: 'goal',
        count: goalCount,
        description: 'New career high in goals!',
        emoji: '🔥'
      }
    }

    // Check hat trick
    const gameGoals = await getGameGoals(playerId, currentStats.currentGameId)
    if (gameGoals === 3) {
      return {
        type: 'game_performance',
        count: 3,
        description: 'HAT TRICK!',
        emoji: '🎩'
      }
    }
  }

  return null
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
```

---

### Phase 6: UI/UX (Week 6-7)

#### Dashboard
**app/(dashboard)/page.tsx:**
```typescript
export default async function Dashboard() {
  const session = await getServerSession()
  const players = await getTrackedPlayers(session.userId)

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Your Players</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {players.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      <UpcomingGames players={players} />
      <RecentSummaries players={players} />
    </div>
  )
}
```

#### Player Profile
**app/(dashboard)/player/[id]/page.tsx:**
```typescript
export default async function PlayerProfile({ params }: { params: { id: string } }) {
  const player = await getPlayer(params.id)
  const stats = await getPlayerStats(params.id)
  const milestones = await getPlayerMilestones(params.id)
  const nextMilestones = calculateNextMilestones(stats)

  return (
    <div className="container mx-auto p-6">
      <PlayerHeader player={player} />

      <div className="grid gap-6 lg:grid-cols-3 mt-8">
        <div className="lg:col-span-2">
          <SeasonStats stats={stats} />
          <RecentGames playerId={params.id} />
        </div>

        <div>
          <MilestoneProgress milestones={nextMilestones} />
          <AchievementHistory milestones={milestones} />
        </div>
      </div>
    </div>
  )
}
```

#### Game Summary View
**app/(dashboard)/game/[id]/page.tsx:**
```typescript
export default async function GameSummary({ params }: { params: { id: string } }) {
  const summary = await getGameSummary(params.id)

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Game Recap</h1>

        <div className="prose prose-lg">
          <p>{summary.aiSummary}</p>
        </div>

        <GameStats stats={summary.stats} />

        <ShareButton
          title={`${summary.playerName}'s Game Summary`}
          text={summary.aiSummary}
        />
      </div>
    </div>
  )
}
```

---

## Database Schema

```sql
-- Users (Parents)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  fcm_token TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Players
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gamesheet_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  team_id VARCHAR(255),
  parent_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Player Stats
CREATE TABLE player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id),
  season VARCHAR(20),
  games_played INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Games
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gamesheet_id VARCHAR(255) UNIQUE NOT NULL,
  team_id VARCHAR(255),
  opponent VARCHAR(255),
  date TIMESTAMP,
  status VARCHAR(50), -- 'scheduled', 'live', 'completed'
  home_score INTEGER,
  away_score INTEGER
);

-- Game Summaries
CREATE TABLE game_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES games(id),
  player_id UUID REFERENCES players(id),
  summary TEXT,
  generated_at TIMESTAMP DEFAULT NOW()
);

-- Milestones
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES players(id),
  type VARCHAR(50),
  count INTEGER,
  description TEXT,
  achieved_at TIMESTAMP DEFAULT NOW(),
  game_id UUID REFERENCES games(id)
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255),
  body TEXT,
  data JSONB,
  sent_at TIMESTAMP DEFAULT NOW(),
  clicked BOOLEAN DEFAULT FALSE
);
```

---

## Demo Flow (For Gamesheet Presentation)

### Setup
1. Deploy to Vercel (HTTPS required for notifications)
2. Create demo accounts for 2-3 "parents"
3. Link to actual Gamesheet player data
4. Have demo ready on tablet/phone

### Live Demo Script

**Scene 1: Onboarding (30 seconds)**
```
"Parent downloads the PWA, searches for their child 'Sarah Thompson',
enables notifications, and they're done."
```

**Scene 2: Live Game (2 minutes)**
```
[Show phone/tablet]
"Now Sarah's game starts. Parent is sitting in the stands..."

[Trigger test notification]
📱 "⚽ GOAL! Sarah scores her 8th of the season"

"Real-time notification. Parent taps it..."

[Opens to player view showing updated stats]

[Trigger milestone notification]
📱 "🎉 MILESTONE! Sarah's 10th goal - now top 5 in the division!"

"The system automatically detected this milestone."
```

**Scene 3: Post-Game Summary (1 minute)**
```
[Show summary screen]
"Game ends. AI generates this summary in 30 seconds..."

[Show AI-generated recap]
"Sarah's 2-goal performance led a 4-3 comeback win.
She's averaging 1.2 points per game - up 15% from last month..."

[Tap share button]
"Parent shares to social media with one tap."
```

**Scene 4: Value Prop (30 seconds)**
```
"All of this data comes from Gamesheet. We're just adding the
storytelling layer that makes it meaningful and shareable.

Parents love their kids' stats - we make them matter."
```

---

## Development Checklist

### Week 1: PWA Foundation
- [ ] Configure next-pwa
- [ ] Create manifest.json
- [ ] Design app icons
- [ ] Set up Tailwind CSS
- [ ] Install shadcn/ui components
- [ ] Deploy to Vercel
- [ ] Test PWA installation on Android/iOS

### Week 2: Push Notifications
- [ ] Set up Firebase project
- [ ] Create service worker
- [ ] Build notification permission UI
- [ ] Implement FCM token storage
- [ ] Create send notification API
- [ ] Test notifications on multiple devices

### Week 3: Gamesheet Integration
- [ ] Get Gamesheet API credentials
- [ ] Build API client
- [ ] Create polling system
- [ ] Test event detection
- [ ] Handle edge cases (game delays, etc.)

### Week 4: AI Integration
- [ ] Set up OpenAI account
- [ ] Write prompt templates
- [ ] Build summary generation
- [ ] Test summary quality
- [ ] Implement caching

### Week 5: Milestone Detection
- [ ] Define milestone rules
- [ ] Implement detection logic
- [ ] Create special notifications
- [ ] Test accuracy
- [ ] Build milestone history view

### Week 6-7: UI/UX Polish
- [ ] Build dashboard
- [ ] Create player profiles
- [ ] Design game summary view
- [ ] Add share functionality
- [ ] Implement settings
- [ ] Add loading states
- [ ] Mobile responsive design

### Week 8: Demo Prep
- [ ] Create demo accounts
- [ ] Link real player data
- [ ] Write demo script
- [ ] Practice presentation
- [ ] Prepare backup plan (pre-recorded video)

---

## Testing Strategy

### Manual Testing
1. Install PWA on Android phone
2. Install PWA on iOS device (test limitations)
3. Enable notifications
4. Trigger test events
5. Verify notification delivery
6. Test offline functionality
7. Test share functionality

### Automated Testing (Optional for demo)
```bash
npm install -D @playwright/test

# Test notification permission flow
# Test API endpoints
# Test PWA installation
```

---

## Deployment

### Vercel Setup
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Environment Variables
```env
GAMESHEET_API_KEY=xxx
OPENAI_API_KEY=xxx
FIREBASE_API_KEY=xxx
FIREBASE_PROJECT_ID=xxx
FIREBASE_MESSAGING_SENDER_ID=xxx
FIREBASE_APP_ID=xxx
FIREBASE_VAPID_KEY=xxx
POSTGRES_URL=xxx
```

### Custom Domain (Optional)
```
gameiq-demo.vercel.app
or
demo.gameiq.com
```

---

## Cost Estimate (Demo Phase)

- **Vercel Hosting:** Free (Hobby tier)
- **Vercel Postgres:** Free tier (256MB)
- **Firebase Cloud Messaging:** Free (unlimited)
- **OpenAI API:** ~$20-50/month (GPT-4 for summaries)
- **Domain (optional):** $12/year

**Total:** ~$20-50/month

---

## Success Metrics for Demo

### Technical Metrics
- [ ] PWA installs successfully on Android/iOS
- [ ] Notifications delivered within 30 seconds
- [ ] AI summaries generate in <60 seconds
- [ ] App loads in <2 seconds
- [ ] Zero critical bugs during demo

### Business Metrics
- [ ] Gamesheet executives understand the value
- [ ] Positive feedback on UI/UX
- [ ] Interest in partnership/next steps
- [ ] Request for pilot program

---

## Next Steps After Gamesheet Demo

### If Positive Response:
1. Negotiate Gamesheet API partnership
2. Plan pilot with 1-2 teams
3. Gather parent feedback
4. Iterate on features
5. Consider native app if iOS is critical

### If Negative Response:
1. Gather specific feedback
2. Identify deal-breakers
3. Pivot approach or features
4. Consider alternative data sources

---

## Key Advantages of PWA Approach

1. **Speed to Market:** 8 weeks vs 16+ for native apps
2. **Single Codebase:** No iOS/Android duplication
3. **Instant Updates:** No app store approval
4. **Lower Cost:** One development team
5. **Easy Distribution:** Just share a URL
6. **Perfect for Demo:** Can show working product immediately

## Key Disadvantages

1. **iOS Limitations:** Push notifications less reliable on iOS
2. **Not in App Store:** Less discoverable
3. **Performance:** Slightly slower than native
4. **Limited Device APIs:** Can't access all phone features

**For a demo to Gamesheet, PWA is the right choice.**

---

## Timeline Summary

- **Week 1:** PWA setup and foundation
- **Week 2:** Push notifications working
- **Week 3:** Gamesheet integration
- **Week 4:** AI summaries
- **Week 5:** Milestone detection
- **Week 6-7:** UI/UX polish
- **Week 8:** Demo preparation

**Total: 8 weeks to demo-ready product**

**First milestone: Week 2 - Get notifications working (proves core concept)**
