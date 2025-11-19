# GameIQ Simulation Demo - Implementation Plan

## Strategy: Fully Simulated Game Events

**Approach:** Build a script that simulates a live hockey game in "fast-forward" mode, dispatching events that the PWA consumes and displays in real-time.

**Why This Works Better:**
- ✅ No dependency on Gamesheet API access
- ✅ Perfect control over demo timing
- ✅ Repeatable and reliable demo
- ✅ Can showcase edge cases (milestones, hat tricks, etc.)
- ✅ Adjustable speed (compress 60-min game into 5-min demo)
- ✅ No live game scheduling issues

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     SIMULATION SCRIPT                        │
│  (Node.js script that simulates a hockey game)              │
│                                                              │
│  - Generates realistic game events (goals, assists, etc.)   │
│  - Dispatches events to backend API                         │
│  - Runs in "fast-forward" mode (60 min → 5 min)            │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP POST
                     │ /api/events/ingest
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND API (Next.js)                    │
│                                                              │
│  - Receives events from simulation                          │
│  - Processes events (milestone detection)                   │
│  - Triggers push notifications                              │
│  - Generates AI summaries post-game                         │
│  - Stores event history in database                         │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────────┐
│  Push Notification│    │   Frontend PWA       │
│  (FCM)            │    │                      │
│                   │    │  - Live event feed   │
│  - Goal alerts    │    │  - Player stats      │
│  - Milestones     │    │  - Game summary      │
│  - Summaries      │    │  - Share buttons     │
└──────────────────┘    └──────────────────────┘
```

---

## Simulation Script Design

### Game Event Types

```typescript
type GameEvent =
  | { type: 'GAME_START', timestamp: number, gameId: string }
  | { type: 'GOAL', timestamp: number, playerId: string, assistIds: string[], period: number }
  | { type: 'ASSIST', timestamp: number, playerId: string, goalPlayerId: string }
  | { type: 'PENALTY', timestamp: number, playerId: string, minutes: number, infraction: string }
  | { type: 'PERIOD_END', timestamp: number, period: number }
  | { type: 'GAME_END', timestamp: number, homeScore: number, awayScore: number }
```

### Simulation Script Structure

**scripts/simulate-game.ts:**
```typescript
import { GameSimulator } from './lib/game-simulator'

interface SimulationConfig {
  gameId: string
  speedMultiplier: number // 12x = 60 min game in 5 min
  targetPlayerId: string // The player we're showcasing
  guaranteedMilestone?: boolean // Force a milestone for demo
  apiEndpoint: string
}

class GameSimulator {
  private config: SimulationConfig
  private currentTime: number = 0
  private events: GameEvent[] = []

  constructor(config: SimulationConfig) {
    this.config = config
    this.generateGameScript()
  }

  // Generate a realistic game flow
  private generateGameScript() {
    // Period 1
    this.addEvent(0, { type: 'GAME_START', gameId: this.config.gameId })
    this.addEvent(180, this.createGoal('opponent-player-1')) // Opponent scores first
    this.addEvent(420, this.createGoal(this.config.targetPlayerId)) // Our player ties it
    this.addEvent(1200, { type: 'PERIOD_END', period: 1 })

    // Period 2
    this.addEvent(1320, this.createGoal(this.config.targetPlayerId, ['teammate-1'])) // Our player's 2nd goal
    this.addEvent(1560, this.createGoal('opponent-player-2'))
    this.addEvent(2400, { type: 'PERIOD_END', period: 2 })

    // Period 3 - Dramatic finish
    this.addEvent(2520, this.createGoal('teammate-2', [this.config.targetPlayerId])) // Our player gets assist
    this.addEvent(3000, this.createPenalty('opponent-player-3', 2, 'Tripping'))
    this.addEvent(3120, this.createGoal(this.config.targetPlayerId, ['teammate-1', 'teammate-2'])) // Hat trick!
    this.addEvent(3600, { type: 'GAME_END', homeScore: 4, awayScore: 2 })
  }

  private createGoal(playerId: string, assistIds: string[] = []): GameEvent {
    return {
      type: 'GOAL',
      timestamp: this.currentTime,
      playerId,
      assistIds,
      period: Math.ceil(this.currentTime / 1200)
    }
  }

  private createPenalty(playerId: string, minutes: number, infraction: string): GameEvent {
    return {
      type: 'PENALTY',
      timestamp: this.currentTime,
      playerId,
      minutes,
      infraction
    }
  }

  private addEvent(gameTimeSeconds: number, event: GameEvent) {
    this.events.push({ ...event, timestamp: gameTimeSeconds })
  }

  // Run the simulation
  async run() {
    console.log(`🏒 Starting game simulation (${this.config.speedMultiplier}x speed)`)

    const startTime = Date.now()

    for (const event of this.events) {
      // Calculate real-world delay
      const delay = (event.timestamp * 1000) / this.config.speedMultiplier
      const waitTime = delay - (Date.now() - startTime)

      if (waitTime > 0) {
        await this.sleep(waitTime)
      }

      // Dispatch event to backend
      await this.dispatchEvent(event)
      this.logEvent(event)
    }

    console.log('✅ Game simulation complete')
  }

  private async dispatchEvent(event: GameEvent) {
    try {
      const response = await fetch(`${this.config.apiEndpoint}/api/events/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })

      if (!response.ok) {
        console.error(`Failed to dispatch event: ${event.type}`)
      }
    } catch (error) {
      console.error('Dispatch error:', error)
    }
  }

  private logEvent(event: GameEvent) {
    const timeStr = this.formatGameTime(event.timestamp)

    switch (event.type) {
      case 'GOAL':
        console.log(`⚽ ${timeStr} - GOAL by ${event.playerId}`)
        break
      case 'PENALTY':
        console.log(`⚠️  ${timeStr} - PENALTY: ${event.playerId} (${event.minutes} min)`)
        break
      case 'PERIOD_END':
        console.log(`🔔 ${timeStr} - End of Period ${event.period}`)
        break
      case 'GAME_END':
        console.log(`🏁 ${timeStr} - GAME OVER: ${event.homeScore}-${event.awayScore}`)
        break
    }
  }

  private formatGameTime(seconds: number): string {
    const period = Math.ceil(seconds / 1200)
    const periodTime = seconds % 1200
    const min = Math.floor(periodTime / 60)
    const sec = periodTime % 60
    return `P${period} ${min}:${sec.toString().padStart(2, '0')}`
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Run simulation
const simulator = new GameSimulator({
  gameId: 'demo-game-001',
  speedMultiplier: 12, // 60-min game in 5 minutes
  targetPlayerId: 'sarah-thompson',
  guaranteedMilestone: true,
  apiEndpoint: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
})

simulator.run()
```

---

## Backend Event Processing

### Event Ingestion API

**app/api/events/ingest/route.ts:**
```typescript
import { checkMilestone } from '@/lib/milestones'
import { sendNotification } from '@/lib/notifications'
import { updatePlayerStats } from '@/lib/database'
import { generateGameSummary } from '@/lib/ai'

export async function POST(request: Request) {
  const event: GameEvent = await request.json()

  console.log('📥 Received event:', event.type)

  try {
    switch (event.type) {
      case 'GAME_START':
        await handleGameStart(event)
        break

      case 'GOAL':
        await handleGoal(event)
        break

      case 'ASSIST':
        await handleAssist(event)
        break

      case 'PENALTY':
        await handlePenalty(event)
        break

      case 'GAME_END':
        await handleGameEnd(event)
        break
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Event processing error:', error)
    return Response.json({ error: 'Processing failed' }, { status: 500 })
  }
}

async function handleGameStart(event: GameStartEvent) {
  // Send pre-game notification
  const player = await getPlayer(event.gameId)

  await sendNotification({
    userId: player.parentId,
    title: `🏒 ${player.name}'s game is starting!`,
    body: `Good luck out there!`,
    data: { gameId: event.gameId, type: 'game_start' }
  })
}

async function handleGoal(event: GoalEvent) {
  const player = await getPlayer(event.playerId)

  // Update stats
  const updatedStats = await updatePlayerStats(event.playerId, {
    goals: { increment: 1 },
    points: { increment: 1 }
  })

  // Check for milestone
  const milestone = await checkMilestone({
    playerId: event.playerId,
    type: 'goal',
    newStats: updatedStats
  })

  // Send notification
  if (milestone) {
    await sendNotification({
      userId: player.parentId,
      title: `🎉 MILESTONE GOAL!`,
      body: `${player.name}'s ${milestone.count}${getOrdinal(milestone.count)} goal of the season!`,
      data: {
        playerId: event.playerId,
        gameId: event.gameId,
        type: 'milestone',
        milestoneType: milestone.type
      }
    })

    // Store milestone
    await createMilestone({
      playerId: event.playerId,
      type: milestone.type,
      count: milestone.count,
      description: milestone.description
    })
  } else {
    // Regular goal notification
    await sendNotification({
      userId: player.parentId,
      title: `⚽ GOAL! ${player.name} scores!`,
      body: `That's ${updatedStats.goals} goals in ${updatedStats.gamesPlayed} games this season`,
      data: {
        playerId: event.playerId,
        gameId: event.gameId,
        type: 'goal'
      }
    })
  }

  // Check for hat trick
  const gameGoals = await getGameGoals(event.playerId, event.gameId)
  if (gameGoals === 3) {
    await sendNotification({
      userId: player.parentId,
      title: `🎩 HAT TRICK!`,
      body: `${player.name} completes the hat trick with 3 goals!`,
      data: {
        playerId: event.playerId,
        gameId: event.gameId,
        type: 'hat_trick'
      }
    })
  }
}

async function handleAssist(event: AssistEvent) {
  const player = await getPlayer(event.playerId)

  const updatedStats = await updatePlayerStats(event.playerId, {
    assists: { increment: 1 },
    points: { increment: 1 }
  })

  await sendNotification({
    userId: player.parentId,
    title: `🎯 Assist for ${player.name}!`,
    body: `Now has ${updatedStats.points} points (${updatedStats.goals}G, ${updatedStats.assists}A)`,
    data: {
      playerId: event.playerId,
      gameId: event.gameId,
      type: 'assist'
    }
  })
}

async function handlePenalty(event: PenaltyEvent) {
  const player = await getPlayer(event.playerId)

  await sendNotification({
    userId: player.parentId,
    title: `⚠️ Penalty - ${player.name}`,
    body: `${event.minutes} minutes for ${event.infraction}`,
    data: {
      playerId: event.playerId,
      gameId: event.gameId,
      type: 'penalty'
    }
  })
}

async function handleGameEnd(event: GameEndEvent) {
  // Trigger AI summary generation
  const summary = await generateGameSummary(event.gameId)

  const players = await getGamePlayers(event.gameId)

  for (const player of players) {
    await sendNotification({
      userId: player.parentId,
      title: `📊 Game Summary Ready`,
      body: summary.substring(0, 100) + '...',
      data: {
        gameId: event.gameId,
        playerId: player.id,
        type: 'game_summary',
        url: `/game/${event.gameId}`
      }
    })
  }
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
```

---

## Milestone Detection Logic

**lib/milestones.ts:**
```typescript
export interface MilestoneCheck {
  playerId: string
  type: 'goal' | 'assist' | 'point'
  newStats: PlayerStats
}

export interface Milestone {
  type: string
  count: number
  description: string
  emoji: string
}

const GOAL_MILESTONES = [5, 10, 15, 20, 25, 30, 40, 50]
const POINT_MILESTONES = [10, 25, 50, 75, 100]

export async function checkMilestone(check: MilestoneCheck): Promise<Milestone | null> {
  const { type, newStats } = check

  if (type === 'goal') {
    // Check goal milestones
    if (GOAL_MILESTONES.includes(newStats.goals)) {
      return {
        type: 'goal_milestone',
        count: newStats.goals,
        description: `${newStats.goals}${getOrdinal(newStats.goals)} goal of the season!`,
        emoji: '🎉'
      }
    }

    // Check career high
    const careerHigh = await getCareerHigh(check.playerId, 'goals')
    if (newStats.goals > careerHigh) {
      return {
        type: 'career_high',
        count: newStats.goals,
        description: 'New career high in goals!',
        emoji: '🔥'
      }
    }
  }

  if (type === 'point' || type === 'goal' || type === 'assist') {
    // Check point milestones
    if (POINT_MILESTONES.includes(newStats.points)) {
      return {
        type: 'point_milestone',
        count: newStats.points,
        description: `${newStats.points}${getOrdinal(newStats.points)} point of the season!`,
        emoji: '⭐'
      }
    }

    // Check PPG thresholds
    const ppg = newStats.points / newStats.gamesPlayed
    if (ppg >= 2.0 && (newStats.points - 1) / newStats.gamesPlayed < 2.0) {
      return {
        type: 'ppg_threshold',
        count: 2,
        description: 'Now averaging 2+ points per game!',
        emoji: '🚀'
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

## AI Game Summary Generation

**lib/ai.ts:**
```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateGameSummary(gameId: string): Promise<string> {
  // Gather game data
  const game = await getGame(gameId)
  const playerStats = await getGamePlayerStats(gameId)
  const seasonStats = await getPlayerSeasonStats(playerStats.playerId)
  const leagueRank = await getLeagueRanking(playerStats.playerId)

  const prompt = `
You are writing a brief, engaging game summary for a parent about their child's hockey game.

Game Result: ${game.result} (${game.finalScore})
Player: ${playerStats.playerName}
Player's Game Stats: ${playerStats.goals}G, ${playerStats.assists}A, ${playerStats.penalties} PIM
Season Stats: ${seasonStats.goals}G, ${seasonStats.assists}A in ${seasonStats.gamesPlayed} games
Points Per Game: ${(seasonStats.points / seasonStats.gamesPlayed).toFixed(2)}
League Ranking: ${leagueRank.position} of ${leagueRank.total} in ${leagueRank.division}

Write a 3-4 sentence game recap that:
1. Highlights the player's performance and impact on the game
2. Provides season context and trends
3. Uses an enthusiastic but authentic parent-friendly tone
4. Includes a "so what" - why these stats matter

Keep it concise, shareable, and emotionally resonant.
`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a sports writer who specializes in youth hockey recaps for parents.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 200
  })

  return completion.choices[0].message.content || ''
}
```

---

## Frontend Real-Time Event Display

**components/game/LiveGameFeed.tsx:**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface GameEvent {
  id: string
  type: string
  timestamp: number
  description: string
  emoji: string
}

export function LiveGameFeed({ gameId }: { gameId: string }) {
  const [events, setEvents] = useState<GameEvent[]>([])
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    // Poll for new events every 2 seconds
    const interval = setInterval(async () => {
      const response = await fetch(`/api/games/${gameId}/events`)
      const data = await response.json()

      setEvents(data.events)
      setIsLive(data.status === 'live')
    }, 2000)

    return () => clearInterval(interval)
  }, [gameId])

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {isLive && (
          <>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">LIVE</span>
          </>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-lg p-4 shadow-md border-l-4 border-blue-500"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{event.emoji}</span>
              <div className="flex-1">
                <p className="font-medium">{event.description}</p>
                <p className="text-sm text-gray-500">
                  {formatTimestamp(event.timestamp)}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString()
}
```

---

## Demo Scenarios

### Scenario 1: The Perfect Demo (5 minutes)

**Pre-game:**
- Show PWA on phone/tablet
- Parent is "sitting in stands" waiting for game to start

**Run simulation:**
```bash
npm run simulate:demo
```

**Timeline:**
```
0:00 - Game starts
      📱 "🏒 Sarah's game is starting!"

0:30 - Opponent scores
      📱 Shows on live feed

1:00 - Sarah scores!
      📱 "⚽ GOAL! Sarah scores her 9th of the season"
      [User taps notification, sees updated stats]

2:30 - Sarah scores again!
      📱 "🎉 MILESTONE! Sarah's 10th goal - now top 5 in division!"

3:30 - Sarah completes hat trick!
      📱 "🎩 HAT TRICK! Sarah scores 3 goals!"

5:00 - Game ends
      📱 "📊 Game Summary Ready"
      [Shows AI-generated recap]
      [User taps "Share" button]
```

### Scenario 2: The Comeback Win

**Script emphasizes:**
- Team down 2-0
- Sarah scores to make it 2-1
- Sarah assists on tying goal
- Sarah scores game-winner

### Scenario 3: The Milestone Chase

**Script emphasizes:**
- Sarah enters with 48 career points
- Gets assist (49 points)
- Scores goal (50 POINTS - BIG MILESTONE!)
- Celebration and social share

---

## Script Variations

**scripts/scenarios/perfect-demo.json:**
```json
{
  "name": "Perfect Demo",
  "duration": 300,
  "speedMultiplier": 12,
  "targetPlayer": "sarah-thompson",
  "events": [
    {
      "gameTime": 0,
      "type": "GAME_START"
    },
    {
      "gameTime": 180,
      "type": "GOAL",
      "team": "opponent"
    },
    {
      "gameTime": 420,
      "type": "GOAL",
      "playerId": "sarah-thompson",
      "assistIds": ["teammate-1"]
    },
    {
      "gameTime": 900,
      "type": "GOAL",
      "playerId": "sarah-thompson",
      "assistIds": ["teammate-2"],
      "milestone": true,
      "milestoneCount": 10
    },
    {
      "gameTime": 1800,
      "type": "GOAL",
      "playerId": "sarah-thompson",
      "assistIds": ["teammate-1", "teammate-2"],
      "hatTrick": true
    },
    {
      "gameTime": 2400,
      "type": "GAME_END",
      "homeScore": 4,
      "awayScore": 2
    }
  ]
}
```

**Run specific scenario:**
```bash
npm run simulate -- --scenario perfect-demo
npm run simulate -- --scenario comeback-win
npm run simulate -- --scenario milestone-chase
```

---

## Project Structure

```
game-iq/
├── app/                          # Next.js app
│   ├── api/
│   │   ├── events/
│   │   │   └── ingest/          # Receives simulation events
│   │   ├── games/
│   │   │   └── [id]/
│   │   │       └── events/      # Returns events for frontend
│   │   └── notifications/
│   │       └── send/            # FCM notification sender
│   └── (dashboard)/
│       └── game/[id]/           # Live game view
├── scripts/
│   ├── simulate-game.ts         # Main simulation script
│   ├── scenarios/
│   │   ├── perfect-demo.json
│   │   ├── comeback-win.json
│   │   └── milestone-chase.json
│   └── lib/
│       └── game-simulator.ts    # Simulator class
├── lib/
│   ├── milestones.ts
│   ├── notifications.ts
│   └── ai.ts
└── package.json
```

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "simulate": "tsx scripts/simulate-game.ts",
    "simulate:demo": "tsx scripts/simulate-game.ts --scenario perfect-demo",
    "simulate:fast": "tsx scripts/simulate-game.ts --speed 24",
    "demo": "concurrently \"npm run dev\" \"npm run simulate:demo\""
  }
}
```

---

## Implementation Timeline

### Week 1: Backend Event System
- [ ] Create event ingestion API
- [ ] Build event storage
- [ ] Implement notification triggers
- [ ] Test event flow

### Week 2: Simulation Script
- [ ] Build game simulator
- [ ] Create event generator
- [ ] Write demo scenarios
- [ ] Test event dispatch

### Week 3: Frontend Integration
- [ ] Build live game feed
- [ ] Implement push notifications
- [ ] Create game summary view
- [ ] Add share functionality

### Week 4: AI & Milestones
- [ ] Integrate OpenAI
- [ ] Build milestone detection
- [ ] Generate summaries
- [ ] Polish notifications

### Week 5: Demo Prep
- [ ] Create demo accounts
- [ ] Generate realistic player data
- [ ] Practice demo flow
- [ ] Record backup video

---

## Demo Execution Guide

### Setup (Before Presentation)

1. **Deploy app to Vercel**
   ```bash
   vercel --prod
   ```

2. **Create demo data**
   ```bash
   npm run seed:demo
   ```

3. **Test simulation**
   ```bash
   npm run simulate:demo
   ```

4. **Install PWA on demo device**
   - Open app URL on phone/tablet
   - Add to home screen
   - Enable notifications

### During Demo

**Opening (30 seconds):**
"This is GameIQ - we turn hockey stats into stories that matter to parents."

**Onboarding (30 seconds):**
[Show PWA on device]
"Parent downloads the app, finds their child, enables notifications. Done."

**Live Demo (5 minutes):**
[Start simulation in background]
```bash
npm run simulate:demo
```

[Show device as notifications arrive]
- Goal notification → tap → see stats
- Milestone notification → celebrate
- Hat trick notification → excitement
- Game summary → share button

**Closing (1 minute):**
"All powered by Gamesheet data. We're just adding the emotional layer that makes parents share."

---

## Advantages of Simulation Approach

1. **No API Dependencies** - Works without Gamesheet access
2. **Perfect Demo Control** - Know exactly what will happen and when
3. **Repeatable** - Run same demo 10 times, same result
4. **Fast** - 60-minute game in 5 minutes
5. **Showcase Edge Cases** - Force milestones, hat tricks, etc.
6. **No Scheduling** - Don't need to wait for real game
7. **Bulletproof** - No "live demo gods" to worry about

---

## Testing Checklist

- [ ] Simulation dispatches events correctly
- [ ] Backend receives and processes events
- [ ] Notifications deliver within 5 seconds
- [ ] Frontend updates in real-time
- [ ] AI summaries generate post-game
- [ ] Share functionality works
- [ ] PWA installs on Android/iOS
- [ ] Demo runs smoothly 3 times in a row

---

## Next Steps

1. Set up Next.js project with PWA
2. Create event ingestion API
3. Build basic simulation script
4. Test end-to-end flow
5. Add push notifications
6. Implement milestone detection
7. Integrate OpenAI for summaries
8. Polish demo flow
9. Practice presentation

**First milestone: Get one simulated goal to trigger one push notification (Week 1)**

This proves the entire system works end-to-end.
