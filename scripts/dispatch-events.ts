#!/usr/bin/env tsx
// Event Dispatcher Script
// Dispatches simulated or real events through the notification system

import { eventDispatcher } from '../src/lib/events/dispatcher';
import { simulateGame } from './simulate-game-events';
import type { HockeyEvent } from '../src/lib/events/types';

// Setup event listeners
function setupListeners() {
  console.log('🎧 Setting up event listeners...\n');

  // Listen to all events
  eventDispatcher.on('all', (event: HockeyEvent) => {
    console.log(`[ALL] ${event.type.toUpperCase()} event received`);
    console.log(`  Player: ${event.player.name}`);
    console.log(`  Time: ${new Date(event.timestamp).toLocaleTimeString()}`);
    console.log('');
  });

  // Listen to specific event types
  eventDispatcher.on('goal', (event: HockeyEvent) => {
    console.log('⚽ GOAL EVENT DISPATCHED');
  });

  eventDispatcher.on('milestone', (event: HockeyEvent) => {
    console.log('🎉 MILESTONE EVENT DISPATCHED');
  });

  eventDispatcher.on('hat_trick', (event: HockeyEvent) => {
    console.log('🔥 HAT TRICK EVENT DISPATCHED');
  });

  eventDispatcher.on('game_end', (event: HockeyEvent) => {
    console.log('🏁 GAME END EVENT DISPATCHED');
  });
}

// Dispatch events with delay to simulate real-time
async function dispatchEvents(events: HockeyEvent[], delayMs: number = 2000) {
  console.log(`📤 Dispatching ${events.length} events...\n`);

  for (const event of events) {
    await eventDispatcher.dispatch(event);
    await sleep(delayMs);
  }

  console.log('\n✅ All events dispatched!\n');
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution
async function main() {
  console.log('🏒 GameIQ Event Dispatcher\n');
  console.log('═'.repeat(50));
  console.log('\n');

  // Setup listeners
  setupListeners();

  // Simulate a game and get events
  console.log('🎮 Simulating game events...\n');
  const events = await simulateGame();

  console.log('\n' + '═'.repeat(50));
  console.log('\n');

  // Dispatch events through the notification system
  await dispatchEvents(events, 3000);

  console.log('🎉 Simulation and dispatch complete!');
  console.log('\nNote: In a browser environment with service workers,');
  console.log('you would see push notifications for each event.');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { setupListeners, dispatchEvents };
