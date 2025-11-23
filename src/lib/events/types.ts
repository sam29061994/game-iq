// NHL Hockey Event Types for Push Notifications

export type PlayerPosition = 'C' | 'LW' | 'RW' | 'D' | 'G';

export interface Player {
  id: string;
  name: string;
  number: number;
  position: PlayerPosition;
  team: string;
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  score: number;
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  period: number;
  timeRemaining: string;
  status: 'scheduled' | 'live' | 'final';
  date: string;
}

export interface SeasonStats {
  gamesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  plusMinus: number;
  penaltyMinutes: number;
  pointsPerGame: number;
}

export interface LeagueRanking {
  category: 'goals' | 'assists' | 'points' | 'ppg';
  rank: number;
  previousRank?: number;
  totalPlayers: number;
}

// Event Types
export type HockeyEventType =
  | 'goal'
  | 'assist'
  | 'penalty'
  | 'milestone'
  | 'game_start'
  | 'game_end'
  | 'hat_trick'
  | 'career_high';

export interface BaseHockeyEvent {
  id: string;
  type: HockeyEventType;
  timestamp: string;
  game: Game;
  player: Player;
  seasonStats: SeasonStats;
  leagueRanking?: LeagueRanking;
}

export interface GoalEvent extends BaseHockeyEvent {
  type: 'goal';
  assistedBy?: Player[];
  goalType: 'even_strength' | 'power_play' | 'short_handed' | 'empty_net';
  periodTime: string;
}

export interface AssistEvent extends BaseHockeyEvent {
  type: 'assist';
  goalScoredBy: Player;
  assistType: 'primary' | 'secondary';
  periodTime: string;
}

export interface PenaltyEvent extends BaseHockeyEvent {
  type: 'penalty';
  infraction: string;
  duration: number; // minutes
  periodTime: string;
}

export interface MilestoneEvent extends BaseHockeyEvent {
  type: 'milestone';
  milestoneType: 'goal' | 'assist' | 'point' | 'game' | 'streak';
  milestone: string; // e.g., "10th goal", "25th point"
  value: number;
  description: string;
  isCareerHigh: boolean;
  divisionRank?: number;
}

export interface HatTrickEvent extends BaseHockeyEvent {
  type: 'hat_trick';
  goals: GoalEvent[];
  careerHatTricks: number;
}

export interface GameStartEvent extends BaseHockeyEvent {
  type: 'game_start';
  minutesUntilStart: number;
}

export interface GameEndEvent extends BaseHockeyEvent {
  type: 'game_end';
  gameStats: {
    goals: number;
    assists: number;
    points: number;
    shots: number;
    plusMinus: number;
  };
  aiSummary?: string;
}

export type HockeyEvent =
  | GoalEvent
  | AssistEvent
  | PenaltyEvent
  | MilestoneEvent
  | HatTrickEvent
  | GameStartEvent
  | GameEndEvent;

// Notification Payload
export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data: HockeyEvent;
  actions?: NotificationAction[];
  tag?: string;
  requireInteraction?: boolean;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}
