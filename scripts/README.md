# GameIQ Event Simulation Scripts

Scripts for simulating NHL hockey game events and testing the push notification system.

## Overview

This directory contains scripts to:
- Simulate realistic NHL game events (goals, assists, penalties, milestones)
- Dispatch events through the notification system
- Test push notification payloads and delivery

## Scripts

### `simulate-game-events.ts`
Generates a realistic sequence of NHL hockey events for testing.

**Features:**
- Game start notifications
- Goal events with assists
- Penalty events
- Milestone detection (10th goal, 20th point, etc.)
- Hat trick celebrations
- Game end with AI summaries

**Usage:**
```bash
cd scripts
npm run simulate
```

**Output:**
- Console log of all events
- `simulated-events.json` file with event data

### `dispatch-events.ts`
Dispatches events through the EventDispatcher for notification testing.

**Features:**
- Event listener setup
- Real-time event dispatching with delays
- Notification payload creation
- Console logging of all activities

**Usage:**
```bash
cd scripts
npm run dispatch
```

## Event Types

The system supports the following NHL hockey events:

### Core Events
- **Goal** - Player scores a goal
  - Tracks goal type (even strength, power play, short-handed, empty net)
  - Updates season totals
  - Checks for milestones

- **Assist** - Player assists on a goal
  - Primary or secondary assists
  - Updates season point totals

- **Penalty** - Player receives a penalty
  - Common infractions: Tripping, Hooking, Slashing, High-sticking
  - Penalty duration tracking

### Special Events
- **Milestone** - Player reaches significant achievement
  - Goal milestones: 5, 10, 15, 20, 25, 30, 40, 50
  - Point milestones: 10, 25, 50, 75, 100
  - Career highs
  - Division rankings

- **Hat Trick** - Player scores 3+ goals in one game
  - Tracks career hat tricks
  - Special celebration notification

- **Game Start** - Pre-game reminder
  - 30-minute advance notice
  - Opponent information

- **Game End** - Post-game summary
  - Player stats from the game
  - AI-generated game recap
  - Shareable content

## Notification Examples

### Goal Notification
```
Title: ⚽ GOAL! Connor McDavid scores!
Body: That's 19th goal of the season vs Toronto Maple Leafs
Actions: [View Stats, Share]
```

### Milestone Notification
```
Title: 🎉 MILESTONE! Connor McDavid
Body: 20th goal! Connor McDavid reaches 20 goals this season! - CAREER HIGH!
       #3 in the division
Actions: [View Progress, Share Achievement]
```

### Hat Trick Notification
```
Title: 🔥 HAT TRICK! 🔥
Body: Connor McDavid completes the hat trick!
      2nd of their career
Actions: [Share This!, View Game]
```

## Integration with PWA

To use these events in your PWA:

1. **Import the dispatcher:**
```typescript
import { eventDispatcher } from '@/lib/events/dispatcher';
```

2. **Setup listeners in your app:**
```typescript
eventDispatcher.on('goal', (event) => {
  // Handle goal event
});

eventDispatcher.on('all', (event) => {
  // Handle all events
});
```

3. **Dispatch events from your data source:**
```typescript
await eventDispatcher.dispatch(goalEvent);
```

4. **Service Worker Integration:**
The dispatcher automatically sends notifications via the service worker when events are dispatched.

## Sample Data

The simulator includes sample players:
- Connor McDavid (Edmonton Oilers)
- Auston Matthews (Toronto Maple Leafs)
- Nathan MacKinnon (Colorado Avalanche)
- Cale Makar (Colorado Avalanche)

Each player has realistic season statistics that update as events occur.

## Testing Push Notifications

To test push notifications in a browser:

1. Run your Next.js app: `npm run dev`
2. Open DevTools → Application → Service Workers
3. Verify service worker is registered
4. Run the dispatch script in a separate terminal
5. Check for notifications appearing in the browser

**Note:** Push notifications require:
- HTTPS or localhost
- Service worker registration
- User permission for notifications
- Browser support for Push API

## Customization

### Adding New Event Types
1. Add type to `src/lib/events/types.ts`
2. Create notification payload method in `src/lib/events/dispatcher.ts`
3. Add simulation logic to `simulate-game-events.ts`

### Modifying Players/Teams
Edit the `players` and `teams` arrays in `simulate-game-events.ts`

### Adjusting Timing
Modify the `delayMs` parameter in `dispatch-events.ts` to change the delay between events.

## Real-World Integration

For production use with actual game data:

1. **Connect to Data Source** (e.g., NHL API, Gamesheet API)
2. **Event Mapping** - Map API responses to HockeyEvent types
3. **Real-time Streaming** - Use WebSockets or polling for live updates
4. **Event Detection** - Implement logic to detect milestones and special events
5. **User Preferences** - Filter events based on user's selected players/teams

## License

Part of the GameIQ MVP project.
