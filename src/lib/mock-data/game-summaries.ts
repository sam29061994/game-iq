// Detailed Game Summary Data Structure

export interface ShiftData {
  period: number;
  time: string;
  duration: string; // e.g., "0:45"
  event?: 'goal' | 'assist' | 'shot' | 'hit' | 'block' | 'takeaway' | 'giveaway';
  description?: string;
}

export interface PeriodBreakdown {
  period: number;
  timeOnIce: string;
  shifts: number;
  goals: number;
  assists: number;
  shots: number;
  hits: number;
  blocks: number;
  faceoffWins: number;
  faceoffLosses: number;
  plusMinus: number;
  highlights: string[];
}

export interface KeyMoment {
  time: string;
  period: number;
  type: 'goal' | 'assist' | 'save' | 'penalty' | 'hit' | 'defensive_play';
  title: string;
  description: string;
  impact: 'game_changing' | 'important' | 'notable';
}

export interface LineStats {
  linemates: string[];
  timeOnIce: string;
  goalsFor: number;
  goalsAgainst: number;
  shotsFor: number;
  shotsAgainst: number;
  effectiveness: 'excellent' | 'good' | 'average' | 'poor';
}

export interface ComparisonStats {
  metric: string;
  playerValue: number;
  teamAverage: number;
  leagueAverage: number;
  percentile: number; // 0-100
}

export interface DetailedGameSummary {
  gameId: string;
  playerName: string;

  // Overall Summary
  overallSummary: string;
  performanceGrade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';
  impactRating: number; // 1-10

  // Period-by-Period Breakdown
  periodBreakdowns: PeriodBreakdown[];

  // Key Moments
  keyMoments: KeyMoment[];

  // Detailed Stats
  detailedStats: {
    timeOnIce: string;
    shifts: number;
    avgShiftLength: string;
    goals: number;
    assists: number;
    shots: number;
    shotAccuracy: number; // percentage
    hits: number;
    blocks: number;
    takeaways: number;
    giveaways: number;
    faceoffs: {
      wins: number;
      losses: number;
      percentage: number;
    };
    penalties: {
      count: number;
      minutes: number;
    };
    plusMinus: number;
  };

  // Line Performance
  lineStats: LineStats;

  // Comparisons
  comparisons: ComparisonStats[];

  // Coaching Insights
  coachingInsights: {
    strengths: string[];
    areasForImprovement: string[];
    tacticalNotes: string[];
  };

  // Game Context
  gameContext: {
    significance: string;
    playerRole: string;
    matchupNotes: string;
  };
}

// Mock detailed game summary for McDavid vs Calgary
export const MOCK_GAME_SUMMARIES: Record<string, DetailedGameSummary> = {
  'mcdavid-97-g1': {
    gameId: 'g1',
    playerName: 'Connor McDavid',

    overallSummary: "McDavid delivered a masterclass performance with 2 goals and 1 assist, dominating the game from start to finish. His speed and vision were on full display, particularly in the third period where he sealed the victory with a highlight-reel goal. This was one of his most complete games of the season, excelling in both offensive creation and defensive responsibility.",

    performanceGrade: 'A+',
    impactRating: 9.5,

    periodBreakdowns: [
      {
        period: 1,
        timeOnIce: '6:45',
        shifts: 9,
        goals: 0,
        assists: 1,
        shots: 2,
        hits: 1,
        blocks: 0,
        faceoffWins: 3,
        faceoffLosses: 2,
        plusMinus: 1,
        highlights: [
          "Set up the opening goal with a beautiful cross-ice pass to Draisaitl",
          "Won key defensive zone faceoff leading to a breakout",
          "Generated two quality scoring chances with zone entries"
        ]
      },
      {
        period: 2,
        timeOnIce: '6:30',
        shifts: 8,
        goals: 1,
        assists: 0,
        shots: 3,
        hits: 0,
        blocks: 1,
        faceoffWins: 2,
        faceoffLosses: 3,
        plusMinus: 0,
        highlights: [
          "Scored on a blistering wrist shot from the slot",
          "Created multiple odd-man rushes with exceptional speed",
          "Blocked a clearing attempt that led to sustained pressure"
        ]
      },
      {
        period: 3,
        timeOnIce: '7:15',
        shifts: 10,
        goals: 1,
        assists: 0,
        shots: 1,
        hits: 2,
        blocks: 0,
        faceoffWins: 4,
        faceoffLosses: 1,
        plusMinus: 1,
        highlights: [
          "Game-winning goal - deked two defenders and roofed it backhand",
          "Dominated in the faceoff circle (80% in the period)",
          "Strong backchecking prevented a Calgary breakaway",
          "Protected the lead with smart puck possession play"
        ]
      }
    ],

    keyMoments: [
      {
        time: '8:24',
        period: 1,
        type: 'assist',
        title: 'Opening Goal Setup',
        description: "McDavid carried the puck through the neutral zone with speed, drew two defenders, then threaded a perfect pass to Draisaitl for the opening goal. This set the tone for Edmonton's offensive dominance.",
        impact: 'important'
      },
      {
        time: '12:15',
        period: 2,
        type: 'goal',
        title: 'Power Move Goal',
        description: "After receiving a pass at the blue line, McDavid used his blazing speed to blow past the defender, cut to the slot, and fired a wrist shot top corner. The goalie had no chance.",
        impact: 'important'
      },
      {
        time: '14:32',
        period: 3,
        type: 'goal',
        title: 'Game-Winning Highlight Reel Goal',
        description: "With the game tied 2-2, McDavid took over. He picked up the puck in his own zone, skated end-to-end, deked around two defenders with incredible hands, and went backhand top shelf. This is the goal that will be on highlight reels all season.",
        impact: 'game_changing'
      },
      {
        time: '17:45',
        period: 3,
        type: 'defensive_play',
        title: 'Crucial Backcheck',
        description: "With Calgary pressing for the tying goal, McDavid backchecked hard and broke up a 2-on-1, showing his commitment to defensive responsibility in crucial moments.",
        impact: 'important'
      }
    ],

    detailedStats: {
      timeOnIce: '20:30',
      shifts: 27,
      avgShiftLength: '0:45',
      goals: 2,
      assists: 1,
      shots: 6,
      shotAccuracy: 33.3,
      hits: 3,
      blocks: 1,
      takeaways: 2,
      giveaways: 1,
      faceoffs: {
        wins: 9,
        losses: 6,
        percentage: 60.0
      },
      penalties: {
        count: 0,
        minutes: 0
      },
      plusMinus: 2
    },

    lineStats: {
      linemates: ['Leon Draisaitl', 'Zach Hyman'],
      timeOnIce: '15:20',
      goalsFor: 3,
      goalsAgainst: 0,
      shotsFor: 12,
      shotsAgainst: 4,
      effectiveness: 'excellent'
    },

    comparisons: [
      { metric: 'Points per Game', playerValue: 1.89, teamAverage: 0.72, leagueAverage: 0.58, percentile: 99 },
      { metric: 'Shots per Game', playerValue: 3.5, teamAverage: 2.1, leagueAverage: 2.3, percentile: 94 },
      { metric: 'Time on Ice', playerValue: 20.5, teamAverage: 16.2, leagueAverage: 15.8, percentile: 88 },
      { metric: 'Faceoff %', playerValue: 60.0, teamAverage: 52.3, leagueAverage: 50.0, percentile: 78 },
      { metric: 'Takeaways', playerValue: 2.0, teamAverage: 1.2, leagueAverage: 1.0, percentile: 85 }
    ],

    coachingInsights: {
      strengths: [
        "Exceptional speed through neutral zone - creating odd-man rushes",
        "Elite playmaking vision - finding open teammates in traffic",
        "Clutch performance - best when the game is on the line",
        "Improved defensive awareness - strong backchecking",
        "Faceoff dominance - 60% win rate this game"
      ],
      areasForImprovement: [
        "Could shoot more - sometimes passing up quality shooting opportunities",
        "Slightly lower second period intensity - maintain first period energy",
        "One giveaway in defensive zone - tighten up puck protection"
      ],
      tacticalNotes: [
        "Most effective when entering the zone with speed down the left wing",
        "Chemistry with Draisaitl continues to be elite - look for more 2-on-1 opportunities",
        "Opponent tried to shadow him with their top defensive pair - still dominated",
        "Power play quarterback role was excellent - great puck movement"
      ]
    },

    gameContext: {
      significance: "Critical divisional matchup against Calgary. Win moves Oilers into 2nd place in Pacific Division.",
      playerRole: "Primary offensive catalyst and team leader. Expected to drive play and create scoring chances.",
      matchupNotes: "Faced off against Calgary's shutdown pairing of Tanev-Andersson. Despite heavy coverage, still managed to dominate possession and create offense."
    }
  }
};
