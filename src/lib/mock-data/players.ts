// Mock NHL Player Data
export interface PlayerProfile {
  id: string;
  name: string;
  number: number;
  team: string;
  teamAbbr: string;
  position: 'C' | 'LW' | 'RW' | 'D' | 'G';
  avatar: string;
  seasonStats: {
    gamesPlayed: number;
    goals: number;
    assists: number;
    points: number;
    plusMinus: number;
    penaltyMinutes: number;
    pointsPerGame: number;
    shotsOnGoal: number;
    shootingPercentage: number;
  };
  recentGames: GameStats[];
  performanceData: PerformanceDataPoint[];
}

export interface GameStats {
  id: string;
  date: string;
  opponent: string;
  result: 'W' | 'L' | 'OT';
  score: string;
  goals: number;
  assists: number;
  points: number;
  shots: number;
  plusMinus: number;
  gameSummary: string;
}

export interface PerformanceDataPoint {
  date: string;
  points: number;
  goals: number;
  assists: number;
}

export const MOCK_PLAYERS: PlayerProfile[] = [
  {
    id: 'mcdavid-97',
    name: 'Connor McDavid',
    number: 97,
    team: 'Edmonton Oilers',
    teamAbbr: 'EDM',
    position: 'C',
    avatar: '/players/mcdavid.jpg',
    seasonStats: {
      gamesPlayed: 28,
      goals: 18,
      assists: 35,
      points: 53,
      plusMinus: 14,
      penaltyMinutes: 8,
      pointsPerGame: 1.89,
      shotsOnGoal: 98,
      shootingPercentage: 18.4,
    },
    recentGames: [
      { id: 'g1', date: '2024-12-15', opponent: 'CGY', result: 'W', score: '4-2', goals: 2, assists: 1, points: 3, shots: 6, plusMinus: 2, gameSummary: "McDavid's dominant 3-point performance led the Oilers to a convincing 4-2 victory over Calgary. His two goals, including the game-winner in the third period, showcased his elite playmaking ability. McDavid continues to lead the Pacific Division in scoring." },
      { id: 'g2', date: '2024-12-13', opponent: 'VAN', result: 'L', score: '2-3', goals: 0, assists: 2, points: 2, shots: 4, plusMinus: -1, gameSummary: "Despite McDavid's two assists, the Oilers fell short in a tight 3-2 loss to Vancouver. He created multiple scoring chances but couldn't find the back of the net. The team struggled on special teams, going 0-for-3 on the power play." },
      { id: 'g3', date: '2024-12-11', opponent: 'SEA', result: 'W', score: '5-2', goals: 1, assists: 3, points: 4, shots: 5, plusMinus: 3, gameSummary: "McDavid put on a clinic with a 4-point night (1G, 3A) in a dominant 5-2 win over Seattle. His vision and passing were on full display, setting up three beautiful goals. He's now on a 6-game point streak and averaging 2.1 points per game over that span." },
      { id: 'g4', date: '2024-12-09', opponent: 'LAK', result: 'W', score: '3-1', goals: 1, assists: 1, points: 2, shots: 7, plusMinus: 1, gameSummary: "McDavid's steady 2-point performance helped Edmonton secure a 3-1 road victory in Los Angeles. His goal late in the second period provided crucial insurance. Solid two-way play with strong defensive positioning throughout the game." },
      { id: 'g5', date: '2024-12-07', opponent: 'ANA', result: 'W', score: '6-3', goals: 2, assists: 2, points: 4, shots: 8, plusMinus: 2, gameSummary: "McDavid exploded for 4 points (2G, 2A) in a high-scoring 6-3 triumph over Anaheim. His speed and skill were too much for the Ducks to handle. He matched his season-high with 8 shots on goal, showing his aggressive mindset." },
    ],
    performanceData: [
      { date: '2024-11-20', points: 1, goals: 0, assists: 1 },
      { date: '2024-11-22', points: 2, goals: 1, assists: 1 },
      { date: '2024-11-25', points: 3, goals: 2, assists: 1 },
      { date: '2024-11-27', points: 1, goals: 0, assists: 1 },
      { date: '2024-11-30', points: 2, goals: 1, assists: 1 },
      { date: '2024-12-02', points: 4, goals: 2, assists: 2 },
      { date: '2024-12-05', points: 2, goals: 1, assists: 1 },
      { date: '2024-12-07', points: 4, goals: 2, assists: 2 },
      { date: '2024-12-09', points: 2, goals: 1, assists: 1 },
      { date: '2024-12-11', points: 4, goals: 1, assists: 3 },
      { date: '2024-12-13', points: 2, goals: 0, assists: 2 },
      { date: '2024-12-15', points: 3, goals: 2, assists: 1 },
    ],
  },
  {
    id: 'matthews-34',
    name: 'Auston Matthews',
    number: 34,
    team: 'Toronto Maple Leafs',
    teamAbbr: 'TOR',
    position: 'C',
    avatar: '/players/matthews.jpg',
    seasonStats: {
      gamesPlayed: 26,
      goals: 24,
      assists: 16,
      points: 40,
      plusMinus: 8,
      penaltyMinutes: 12,
      pointsPerGame: 1.54,
      shotsOnGoal: 102,
      shootingPercentage: 23.5,
    },
    recentGames: [
      { id: 'g1', date: '2024-12-16', opponent: 'BOS', result: 'W', score: '4-3', goals: 2, assists: 0, points: 2, shots: 7, plusMinus: 1 },
      { id: 'g2', date: '2024-12-14', opponent: 'MTL', result: 'W', score: '5-1', goals: 3, assists: 1, points: 4, shots: 8, plusMinus: 3 },
      { id: 'g3', date: '2024-12-12', opponent: 'OTT', result: 'L', score: '2-4', goals: 1, assists: 0, points: 1, shots: 5, plusMinus: -2 },
      { id: 'g4', date: '2024-12-10', opponent: 'FLA', result: 'W', score: '3-2', goals: 1, assists: 1, points: 2, shots: 6, plusMinus: 1 },
      { id: 'g5', date: '2024-12-08', opponent: 'TBL', result: 'L', score: '1-2', goals: 0, assists: 1, points: 1, shots: 4, plusMinus: 0 },
    ],
    performanceData: [
      { date: '2024-11-21', points: 2, goals: 1, assists: 1 },
      { date: '2024-11-23', points: 1, goals: 1, assists: 0 },
      { date: '2024-11-26', points: 3, goals: 2, assists: 1 },
      { date: '2024-11-28', points: 1, goals: 0, assists: 1 },
      { date: '2024-12-01', points: 2, goals: 2, assists: 0 },
      { date: '2024-12-03', points: 1, goals: 1, assists: 0 },
      { date: '2024-12-06', points: 2, goals: 1, assists: 1 },
      { date: '2024-12-08', points: 1, goals: 0, assists: 1 },
      { date: '2024-12-10', points: 2, goals: 1, assists: 1 },
      { date: '2024-12-12', points: 1, goals: 1, assists: 0 },
      { date: '2024-12-14', points: 4, goals: 3, assists: 1 },
      { date: '2024-12-16', points: 2, goals: 2, assists: 0 },
    ],
  },
  {
    id: 'mackinnon-29',
    name: 'Nathan MacKinnon',
    number: 29,
    team: 'Colorado Avalanche',
    teamAbbr: 'COL',
    position: 'C',
    avatar: '/players/mackinnon.jpg',
    seasonStats: {
      gamesPlayed: 27,
      goals: 16,
      assists: 32,
      points: 48,
      plusMinus: 16,
      penaltyMinutes: 10,
      pointsPerGame: 1.78,
      shotsOnGoal: 89,
      shootingPercentage: 18.0,
    },
    recentGames: [
      { id: 'g1', date: '2024-12-15', opponent: 'DAL', result: 'W', score: '5-3', goals: 1, assists: 3, points: 4, shots: 5, plusMinus: 2 },
      { id: 'g2', date: '2024-12-13', opponent: 'MIN', result: 'W', score: '4-2', goals: 0, assists: 2, points: 2, shots: 3, plusMinus: 1 },
      { id: 'g3', date: '2024-12-11', opponent: 'WPG', result: 'L', score: '2-3', goals: 1, assists: 1, points: 2, shots: 6, plusMinus: 0 },
      { id: 'g4', date: '2024-12-09', opponent: 'NSH', result: 'W', score: '6-2', goals: 2, assists: 2, points: 4, shots: 7, plusMinus: 3 },
      { id: 'g5', date: '2024-12-07', opponent: 'STL', result: 'W', score: '3-1', goals: 0, assists: 2, points: 2, shots: 4, plusMinus: 1 },
    ],
    performanceData: [
      { date: '2024-11-20', points: 2, goals: 1, assists: 1 },
      { date: '2024-11-22', points: 3, goals: 1, assists: 2 },
      { date: '2024-11-25', points: 1, goals: 0, assists: 1 },
      { date: '2024-11-27', points: 2, goals: 1, assists: 1 },
      { date: '2024-11-30', points: 3, goals: 2, assists: 1 },
      { date: '2024-12-02', points: 2, goals: 0, assists: 2 },
      { date: '2024-12-05', points: 1, goals: 1, assists: 0 },
      { date: '2024-12-07', points: 2, goals: 0, assists: 2 },
      { date: '2024-12-09', points: 4, goals: 2, assists: 2 },
      { date: '2024-12-11', points: 2, goals: 1, assists: 1 },
      { date: '2024-12-13', points: 2, goals: 0, assists: 2 },
      { date: '2024-12-15', points: 4, goals: 1, assists: 3 },
    ],
  },
  {
    id: 'makar-8',
    name: 'Cale Makar',
    number: 8,
    team: 'Colorado Avalanche',
    teamAbbr: 'COL',
    position: 'D',
    avatar: '/players/makar.jpg',
    seasonStats: {
      gamesPlayed: 27,
      goals: 9,
      assists: 26,
      points: 35,
      plusMinus: 18,
      penaltyMinutes: 14,
      pointsPerGame: 1.30,
      shotsOnGoal: 72,
      shootingPercentage: 12.5,
    },
    recentGames: [
      { id: 'g1', date: '2024-12-15', opponent: 'DAL', result: 'W', score: '5-3', goals: 1, assists: 2, points: 3, shots: 4, plusMinus: 2 },
      { id: 'g2', date: '2024-12-13', opponent: 'MIN', result: 'W', score: '4-2', goals: 0, assists: 1, points: 1, shots: 3, plusMinus: 1 },
      { id: 'g3', date: '2024-12-11', opponent: 'WPG', result: 'L', score: '2-3', goals: 0, assists: 2, points: 2, shots: 5, plusMinus: 0 },
      { id: 'g4', date: '2024-12-09', opponent: 'NSH', result: 'W', score: '6-2', goals: 1, assists: 1, points: 2, shots: 6, plusMinus: 3 },
      { id: 'g5', date: '2024-12-07', opponent: 'STL', result: 'W', score: '3-1', goals: 0, assists: 1, points: 1, shots: 2, plusMinus: 1 },
    ],
    performanceData: [
      { date: '2024-11-20', points: 1, goals: 0, assists: 1 },
      { date: '2024-11-22', points: 2, goals: 1, assists: 1 },
      { date: '2024-11-25', points: 1, goals: 0, assists: 1 },
      { date: '2024-11-27', points: 3, goals: 1, assists: 2 },
      { date: '2024-11-30', points: 2, goals: 1, assists: 1 },
      { date: '2024-12-02', points: 1, goals: 0, assists: 1 },
      { date: '2024-12-05', points: 2, goals: 0, assists: 2 },
      { date: '2024-12-07', points: 1, goals: 0, assists: 1 },
      { date: '2024-12-09', points: 2, goals: 1, assists: 1 },
      { date: '2024-12-11', points: 2, goals: 0, assists: 2 },
      { date: '2024-12-13', points: 1, goals: 0, assists: 1 },
      { date: '2024-12-15', points: 3, goals: 1, assists: 2 },
    ],
  },
  {
    id: 'pastrnak-88',
    name: 'David Pastrňák',
    number: 88,
    team: 'Boston Bruins',
    teamAbbr: 'BOS',
    position: 'RW',
    avatar: '/players/pastrnak.jpg',
    seasonStats: {
      gamesPlayed: 29,
      goals: 20,
      assists: 19,
      points: 39,
      plusMinus: 6,
      penaltyMinutes: 16,
      pointsPerGame: 1.34,
      shotsOnGoal: 105,
      shootingPercentage: 19.0,
    },
    recentGames: [
      { id: 'g1', date: '2024-12-16', opponent: 'TOR', result: 'L', score: '3-4', goals: 1, assists: 1, points: 2, shots: 6, plusMinus: 0 },
      { id: 'g2', date: '2024-12-14', opponent: 'NYR', result: 'W', score: '4-1', goals: 2, assists: 0, points: 2, shots: 7, plusMinus: 2 },
      { id: 'g3', date: '2024-12-12', opponent: 'PHI', result: 'W', score: '3-2', goals: 1, assists: 1, points: 2, shots: 5, plusMinus: 1 },
      { id: 'g4', date: '2024-12-10', opponent: 'BUF', result: 'W', score: '5-2', goals: 2, assists: 1, points: 3, shots: 8, plusMinus: 2 },
      { id: 'g5', date: '2024-12-08', opponent: 'DET', result: 'L', score: '2-3', goals: 0, assists: 2, points: 2, shots: 4, plusMinus: -1 },
    ],
    performanceData: [
      { date: '2024-11-21', points: 1, goals: 1, assists: 0 },
      { date: '2024-11-23', points: 2, goals: 1, assists: 1 },
      { date: '2024-11-26', points: 1, goals: 0, assists: 1 },
      { date: '2024-11-28', points: 3, goals: 2, assists: 1 },
      { date: '2024-12-01', points: 1, goals: 1, assists: 0 },
      { date: '2024-12-03', points: 2, goals: 1, assists: 1 },
      { date: '2024-12-06', points: 1, goals: 0, assists: 1 },
      { date: '2024-12-08', points: 2, goals: 0, assists: 2 },
      { date: '2024-12-10', points: 3, goals: 2, assists: 1 },
      { date: '2024-12-12', points: 2, goals: 1, assists: 1 },
      { date: '2024-12-14', points: 2, goals: 2, assists: 0 },
      { date: '2024-12-16', points: 2, goals: 1, assists: 1 },
    ],
  },
  {
    id: 'panarin-10',
    name: 'Artemi Panarin',
    number: 10,
    team: 'New York Rangers',
    teamAbbr: 'NYR',
    position: 'LW',
    avatar: '/players/panarin.jpg',
    seasonStats: {
      gamesPlayed: 30,
      goals: 14,
      assists: 28,
      points: 42,
      plusMinus: 12,
      penaltyMinutes: 8,
      pointsPerGame: 1.40,
      shotsOnGoal: 82,
      shootingPercentage: 17.1,
    },
    recentGames: [
      { id: 'g1', date: '2024-12-17', opponent: 'NYI', result: 'W', score: '4-2', goals: 0, assists: 3, points: 3, shots: 4, plusMinus: 2 },
      { id: 'g2', date: '2024-12-15', opponent: 'NJD', result: 'W', score: '3-1', goals: 1, assists: 1, points: 2, shots: 5, plusMinus: 1 },
      { id: 'g3', date: '2024-12-13', opponent: 'PIT', result: 'L', score: '2-3', goals: 1, assists: 0, points: 1, shots: 3, plusMinus: -1 },
      { id: 'g4', date: '2024-12-11', opponent: 'WSH', result: 'W', score: '5-3', goals: 0, assists: 2, points: 2, shots: 4, plusMinus: 1 },
      { id: 'g5', date: '2024-12-09', opponent: 'CAR', result: 'W', score: '4-1', goals: 2, assists: 1, points: 3, shots: 6, plusMinus: 2 },
    ],
    performanceData: [
      { date: '2024-11-22', points: 2, goals: 1, assists: 1 },
      { date: '2024-11-24', points: 1, goals: 0, assists: 1 },
      { date: '2024-11-27', points: 2, goals: 0, assists: 2 },
      { date: '2024-11-29', points: 3, goals: 1, assists: 2 },
      { date: '2024-12-02', points: 1, goals: 1, assists: 0 },
      { date: '2024-12-04', points: 2, goals: 0, assists: 2 },
      { date: '2024-12-07', points: 1, goals: 0, assists: 1 },
      { date: '2024-12-09', points: 3, goals: 2, assists: 1 },
      { date: '2024-12-11', points: 2, goals: 0, assists: 2 },
      { date: '2024-12-13', points: 1, goals: 1, assists: 0 },
      { date: '2024-12-15', points: 2, goals: 1, assists: 1 },
      { date: '2024-12-17', points: 3, goals: 0, assists: 3 },
    ],
  },
];

export function getPlayerById(id: string): PlayerProfile | undefined {
  return MOCK_PLAYERS.find(p => p.id === id);
}

export function getPlayerByName(name: string): PlayerProfile | undefined {
  return MOCK_PLAYERS.find(p => p.name.toLowerCase() === name.toLowerCase());
}
