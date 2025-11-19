#!/usr/bin/env tsx
// Mock Scorecard Event Simulator for NHL Hockey
// Simulates real-time game events for testing push notifications

import type {
  HockeyEvent,
  GoalEvent,
  AssistEvent,
  PenaltyEvent,
  MilestoneEvent,
  HatTrickEvent,
  GameStartEvent,
  GameEndEvent,
  Player,
  Team,
  Game,
  SeasonStats,
} from '../src/lib/events/types';

// Sample players
const players: Player[] = [
  { id: 'p1', name: 'Connor McDavid', number: 97, position: 'C', team: 'Edmonton Oilers' },
  { id: 'p2', name: 'Auston Matthews', number: 34, position: 'C', team: 'Toronto Maple Leafs' },
  { id: 'p3', name: 'Nathan MacKinnon', number: 29, position: 'C', team: 'Colorado Avalanche' },
  { id: 'p4', name: 'Cale Makar', number: 8, position: 'D', team: 'Colorado Avalanche' },
];

// Sample teams
const teams: Team[] = [
  { id: 't1', name: 'Edmonton Oilers', abbreviation: 'EDM', score: 0 },
  { id: 't2', name: 'Toronto Maple Leafs', abbreviation: 'TOR', score: 0 },
  { id: 't3', name: 'Colorado Avalanche', abbreviation: 'COL', score: 0 },
  { id: 't4', name: 'Calgary Flames', abbreviation: 'CGY', score: 0 },
];

// Sample season stats
const seasonStats: Record<string, SeasonStats> = {
  p1: { gamesPlayed: 25, goals: 18, assists: 32, points: 50, plusMinus: 12, penaltyMinutes: 8, pointsPerGame: 2.0 },
  p2: { gamesPlayed: 24, goals: 22, assists: 15, points: 37, plusMinus: 8, penaltyMinutes: 10, pointsPerGame: 1.54 },
  p3: { gamesPlayed: 23, goals: 15, assists: 28, points: 43, plusMinus: 15, penaltyMinutes: 6, pointsPerGame: 1.87 },
  p4: { gamesPlayed: 25, goals: 8, assists: 24, points: 32, plusMinus: 18, penaltyMinutes: 12, pointsPerGame: 1.28 },
};

class GameSimulator {
  private game: Game;
  private eventId = 0;
  private currentPeriod = 1;
  private goalCount: Record<string, number> = {};

  constructor(homeTeam: Team, awayTeam: Team) {
    this.game = {
      id: `game-${Date.now()}`,
      homeTeam: { ...homeTeam, score: 0 },
      awayTeam: { ...awayTeam, score: 0 },
      period: 1,
      timeRemaining: '20:00',
      status: 'scheduled',
      date: new Date().toISOString(),
    };
  }

  // Generate unique event ID
  private generateEventId(): string {
    return `event-${this.game.id}-${++this.eventId}`;
  }

  // Get random time in period
  private getRandomTime(): string {
    const minutes = Math.floor(Math.random() * 20);
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // Create game start event
  createGameStartEvent(player: Player, minutesUntilStart: number): GameStartEvent {
    return {
      id: this.generateEventId(),
      type: 'game_start',
      timestamp: new Date().toISOString(),
      game: this.game,
      player,
      seasonStats: seasonStats[player.id],
      minutesUntilStart,
    };
  }

  // Create goal event
  createGoalEvent(scorer: Player, assists: Player[] = []): GoalEvent {
    this.goalCount[scorer.id] = (this.goalCount[scorer.id] || 0) + 1;

    // Update game score
    if (scorer.team === this.game.homeTeam.name) {
      this.game.homeTeam.score++;
    } else {
      this.game.awayTeam.score++;
    }

    // Update season stats
    seasonStats[scorer.id].goals++;
    seasonStats[scorer.id].points++;

    return {
      id: this.generateEventId(),
      type: 'goal',
      timestamp: new Date().toISOString(),
      game: { ...this.game },
      player: scorer,
      seasonStats: { ...seasonStats[scorer.id] },
      assistedBy: assists,
      goalType: Math.random() > 0.8 ? 'power_play' : 'even_strength',
      periodTime: this.getRandomTime(),
    };
  }

  // Create assist event
  createAssistEvent(assister: Player, goalScorer: Player, assistType: 'primary' | 'secondary' = 'primary'): AssistEvent {
    seasonStats[assister.id].assists++;
    seasonStats[assister.id].points++;

    return {
      id: this.generateEventId(),
      type: 'assist',
      timestamp: new Date().toISOString(),
      game: { ...this.game },
      player: assister,
      seasonStats: { ...seasonStats[assister.id] },
      goalScoredBy: goalScorer,
      assistType,
      periodTime: this.getRandomTime(),
    };
  }

  // Create penalty event
  createPenaltyEvent(player: Player): PenaltyEvent {
    const infractions = ['Tripping', 'Hooking', 'Slashing', 'High-sticking', 'Interference'];
    const infraction = infractions[Math.floor(Math.random() * infractions.length)];

    seasonStats[player.id].penaltyMinutes += 2;

    return {
      id: this.generateEventId(),
      type: 'penalty',
      timestamp: new Date().toISOString(),
      game: { ...this.game },
      player,
      seasonStats: { ...seasonStats[player.id] },
      infraction,
      duration: 2,
      periodTime: this.getRandomTime(),
    };
  }

  // Create milestone event
  createMilestoneEvent(player: Player, milestoneType: 'goal' | 'point'): MilestoneEvent {
    const stats = seasonStats[player.id];
    const value = milestoneType === 'goal' ? stats.goals : stats.points;
    const milestones = [5, 10, 15, 20, 25, 30, 40, 50];
    const milestone = milestones.find(m => m === value);

    if (!milestone) {
      return null as any; // No milestone hit
    }

    return {
      id: this.generateEventId(),
      type: 'milestone',
      timestamp: new Date().toISOString(),
      game: { ...this.game },
      player,
      seasonStats: { ...stats },
      milestoneType,
      milestone: `${milestone}${this.ordinal(milestone)} ${milestoneType}`,
      value: milestone,
      description: `${player.name} reaches ${milestone} ${milestoneType}s this season!`,
      isCareerHigh: milestone >= 20,
      divisionRank: Math.floor(Math.random() * 10) + 1,
    };
  }

  // Create hat trick event
  createHatTrickEvent(player: Player, goals: GoalEvent[]): HatTrickEvent {
    return {
      id: this.generateEventId(),
      type: 'hat_trick',
      timestamp: new Date().toISOString(),
      game: { ...this.game },
      player,
      seasonStats: { ...seasonStats[player.id] },
      goals,
      careerHatTricks: Math.floor(Math.random() * 5) + 1,
    };
  }

  // Create game end event
  createGameEndEvent(player: Player): GameEndEvent {
    this.game.status = 'final';

    return {
      id: this.generateEventId(),
      type: 'game_end',
      timestamp: new Date().toISOString(),
      game: { ...this.game },
      player,
      seasonStats: { ...seasonStats[player.id] },
      gameStats: {
        goals: this.goalCount[player.id] || 0,
        assists: Math.floor(Math.random() * 3),
        points: (this.goalCount[player.id] || 0) + Math.floor(Math.random() * 3),
        shots: Math.floor(Math.random() * 8) + 2,
        plusMinus: Math.floor(Math.random() * 5) - 2,
      },
      aiSummary: this.generateAISummary(player),
    };
  }

  private generateAISummary(player: Player): string {
    const goals = this.goalCount[player.id] || 0;
    const assists = Math.floor(Math.random() * 3);
    const won = this.game.homeTeam.score !== this.game.awayTeam.score;
    const score = `${this.game.homeTeam.score}-${this.game.awayTeam.score}`;

    return `${player.name}'s ${goals > 0 ? `${goals}-goal` : 'solid'} ${assists > 0 ? `and ${assists}-assist` : ''} performance ${won ? 'powered' : 'wasn\'t enough in'} a ${score} ${won ? 'victory' : 'loss'}. They're averaging ${seasonStats[player.id].pointsPerGame.toFixed(2)} points per game this season.`;
  }

  private ordinal(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return (s[(v - 20) % 10] || s[v] || s[0]);
  }

  startGame() {
    this.game.status = 'live';
  }

  advancePeriod() {
    this.currentPeriod++;
    this.game.period = this.currentPeriod;
  }
}

// Simulation runner
async function simulateGame() {
  const simulator = new GameSimulator(teams[0], teams[1]);
  const player = players[0];
  const events: HockeyEvent[] = [];

  console.log('🏒 Starting NHL Game Simulation...\n');

  // Game start notification (30 mins before)
  console.log('📢 30 minutes before game...');
  events.push(simulator.createGameStartEvent(player, 30));
  await sleep(2000);

  // Start the game
  console.log('🏒 Game starting!\n');
  simulator.startGame();
  await sleep(1000);

  // Period 1 events
  console.log('⏱️  PERIOD 1');

  // Goal
  console.log('⚽ Goal scored!');
  const goal1 = simulator.createGoalEvent(player, [players[3]]);
  events.push(goal1);
  events.push(simulator.createAssistEvent(players[3], player));
  await sleep(3000);

  // Check for milestone
  const milestone1 = simulator.createMilestoneEvent(player, 'goal');
  if (milestone1) {
    console.log('🎉 Milestone reached!');
    events.push(milestone1);
    await sleep(2000);
  }

  // Penalty
  console.log('⚠️  Penalty called');
  events.push(simulator.createPenaltyEvent(players[1]));
  await sleep(3000);

  // Period 2 events
  simulator.advancePeriod();
  console.log('\n⏱️  PERIOD 2');

  // Another goal
  console.log('⚽ Another goal!');
  const goal2 = simulator.createGoalEvent(player, [players[3]]);
  events.push(goal2);
  await sleep(3000);

  // Period 3 events
  simulator.advancePeriod();
  console.log('\n⏱️  PERIOD 3');

  // Hat trick goal!
  console.log('⚽ GOAL! Hat trick potential...');
  const goal3 = simulator.createGoalEvent(player);
  events.push(goal3);
  await sleep(2000);

  // Hat trick notification
  console.log('🔥 HAT TRICK!!!');
  events.push(simulator.createHatTrickEvent(player, [goal1, goal2, goal3]));
  await sleep(3000);

  // Game end
  console.log('\n🏁 Game Over!');
  events.push(simulator.createGameEndEvent(player));
  await sleep(1000);

  console.log('\n✅ Simulation Complete!\n');
  console.log(`Generated ${events.length} events:`);
  events.forEach((e, i) => {
    console.log(`${i + 1}. ${e.type.toUpperCase()} - ${e.timestamp}`);
  });

  // Save events to JSON file
  const fs = require('fs');
  const path = require('path');
  const outputPath = path.join(__dirname, 'simulated-events.json');
  fs.writeFileSync(outputPath, JSON.stringify(events, null, 2));
  console.log(`\n💾 Events saved to: ${outputPath}`);

  return events;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run simulation if called directly
if (require.main === module) {
  simulateGame().catch(console.error);
}

export { GameSimulator, simulateGame };
