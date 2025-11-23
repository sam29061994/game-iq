'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserStore } from '@/lib/mock-data/user-state';
import { eventDispatcher } from '@/lib/events/dispatcher';
import type { PlayerProfile } from '@/lib/mock-data/players';
import type {
  GoalEvent,
  AssistEvent,
  PenaltyEvent,
  MilestoneEvent,
  HatTrickEvent,
  GameStartEvent,
  GameEndEvent,
  Team,
  Game,
  Player,
} from '@/lib/events/types';
import {
  Play,
  Trophy,
  Target,
  AlertTriangle,
  Star,
  Clock,
  CheckCircle2,
  Zap
} from 'lucide-react';

interface SimulateGameButtonProps {
  player: PlayerProfile;
}

interface LogEntry {
  message: string;
  type: 'game_start' | 'period' | 'goal' | 'assist' | 'penalty' | 'milestone' | 'hat_trick' | 'game_end' | 'info';
}

export function SimulateGameButton({ player }: SimulateGameButtonProps) {
  const { isGameSimulating, setGameSimulating, notificationsEnabled } = useUserStore();
  const [eventLog, setEventLog] = useState<LogEntry[]>([]);
  const [eventCount, setEventCount] = useState(0);
  const simulationInProgressRef = useRef(false);

  // Reset simulation state on mount and unmount
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Reset on mount if stuck
    if (isGameSimulating && !simulationInProgressRef.current) {
      setGameSimulating(false);
      if (typeof eventDispatcher?.reset === 'function') {
        eventDispatcher.reset();
      }
    }

    // Cleanup on unmount
    return () => {
      if (typeof window !== 'undefined' && simulationInProgressRef.current) {
        simulationInProgressRef.current = false;
        setGameSimulating(false);
        if (typeof eventDispatcher?.reset === 'function') {
          eventDispatcher.reset();
        }
      }
    };
  }, [isGameSimulating, setGameSimulating]);

  const simulateGame = async () => {
    // Only run in browser
    if (typeof window === 'undefined') {
      return;
    }

    simulationInProgressRef.current = true;
    setGameSimulating(true);
    setEventLog([]);
    setEventCount(0);
    if (typeof eventDispatcher?.reset === 'function') {
      eventDispatcher.reset();
    }

    const homeTeam: Team = {
      id: 't1',
      name: player.team,
      abbreviation: player.teamAbbr,
      score: 0,
    };

    const awayTeam: Team = {
      id: 't2',
      name: 'Calgary Flames',
      abbreviation: 'CGY',
      score: 0,
    };

    const game: Game = {
      id: `game-${Date.now()}`,
      homeTeam,
      awayTeam,
      period: 1,
      timeRemaining: '20:00',
      status: 'live',
      date: new Date().toISOString(),
    };

    const mappedPlayer: Player = {
      id: player.id,
      name: player.name,
      number: player.number,
      position: player.position,
      team: player.team,
    };

    const goals: GoalEvent[] = [];
    let eventId = 1;

    const addLog = (message: string, type: LogEntry['type']) => {
      setEventLog((prev) => [...prev, { message, type }]);
      setEventCount((prev) => prev + 1);
    };

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Random delay between events to make it feel more realistic
    const randomDelay = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    try {
      // Game start notification
      addLog('Game starting soon...', 'game_start');
      const gameStartEvent: GameStartEvent = {
        id: `event-${eventId++}`,
        type: 'game_start',
        timestamp: new Date().toISOString(),
        game: { ...game },
        player: mappedPlayer,
        seasonStats: player.seasonStats,
        minutesUntilStart: 30,
      };
      await eventDispatcher.dispatch(gameStartEvent);
      await sleep(randomDelay(4000, 6000));

      // Period 1
      game.status = 'live';
      game.period = 1;
      addLog('Period 1 underway', 'period');
      await sleep(randomDelay(3000, 5000));

      // Goal 1 - Player scores first
      homeTeam.score++;
      const assistPlayer: Player = { id: 'p2', name: 'Leon Draisaitl', number: 29, position: 'C', team: player.team };
      const newGoalStats = player.seasonStats.goals + 1;
      const newPointStats = player.seasonStats.points + 1;
      const goal1: GoalEvent = {
        id: `event-${eventId++}`,
        type: 'goal',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, goals: newGoalStats, points: newPointStats },
        leagueRanking: {
          category: 'goals',
          rank: 8,
          previousRank: 11,
          totalPlayers: 800,
        },
        assistedBy: [assistPlayer],
        goalType: 'even_strength',
        periodTime: '8:45',
      };
      addLog(`GOAL! ${player.name} scores (${homeTeam.score}-${awayTeam.score}) - ${newGoalStats} goals this season, now #8 in NHL`, 'goal');
      goals.push(goal1);
      await eventDispatcher.dispatch(goal1);
      await sleep(randomDelay(5000, 7000));

      // Check for milestone (20th goal)
      if (player.seasonStats.goals === 19) {
        addLog(`MILESTONE: ${player.name} reaches 20 goals this season!`, 'milestone');
        const milestone: MilestoneEvent = {
          id: `event-${eventId++}`,
          type: 'milestone',
          timestamp: new Date().toISOString(),
          game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
          player: mappedPlayer,
          seasonStats: { ...player.seasonStats, goals: 20, points: player.seasonStats.points + 1 },
          milestoneType: 'goal',
          milestone: '20th goal',
          value: 20,
          description: `${player.name} reaches 20 goals this season!`,
          isCareerHigh: false,
          divisionRank: 3,
        };
        await eventDispatcher.dispatch(milestone);
        await sleep(randomDelay(4000, 6000));
      }

      // Opponent scores
      addLog(`${awayTeam.name} scores - Now ${homeTeam.score}-${++awayTeam.score}`, 'info');
      await sleep(randomDelay(4000, 6000));

      // Assist - Player sets up Hyman
      homeTeam.score++;
      const newAssistStats = player.seasonStats.assists + 1;
      const newPointsAfterAssist = player.seasonStats.points + 2;
      const assist: AssistEvent = {
        id: `event-${eventId++}`,
        type: 'assist',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, assists: newAssistStats, points: newPointsAfterAssist },
        leagueRanking: {
          category: 'assists',
          rank: 5,
          previousRank: 6,
          totalPlayers: 800,
        },
        goalScoredBy: { id: 'p2', name: 'Zach Hyman', number: 18, position: 'LW' as const, team: player.team },
        assistType: 'primary',
        periodTime: '14:22',
      };
      addLog(`ASSIST! ${player.name} sets up Hyman (${homeTeam.score}-${awayTeam.score}) - ${newAssistStats}A, #5 in NHL assists`, 'assist');
      await eventDispatcher.dispatch(assist);
      await sleep(randomDelay(6000, 9000));

      // Late period penalty
      addLog(`${player.name} called for hooking - 2 minutes`, 'penalty');
      const penalty: PenaltyEvent = {
        id: `event-${eventId++}`,
        type: 'penalty',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: player.seasonStats,
        infraction: 'Hooking',
        duration: 2,
        periodTime: '18:30',
      };
      await eventDispatcher.dispatch(penalty);
      await sleep(randomDelay(4000, 6000));

      addLog('End of Period 1', 'period');
      await sleep(randomDelay(3000, 4000));

      // Period 2
      game.period = 2;
      addLog('Period 2 begins', 'period');
      await sleep(randomDelay(4000, 6000));

      // Second assist - building momentum
      homeTeam.score++;
      const newAssistStats2 = player.seasonStats.assists + 2;
      const newPointsAfterAssist2 = player.seasonStats.points + 3;
      const secondAssist: AssistEvent = {
        id: `event-${eventId++}`,
        type: 'assist',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, assists: newAssistStats2, points: newPointsAfterAssist2 },
        leagueRanking: {
          category: 'points',
          rank: 3,
          previousRank: 5,
          totalPlayers: 800,
        },
        goalScoredBy: { id: 'p3', name: 'Ryan Nugent-Hopkins', number: 93, position: 'C' as const, team: player.team },
        assistType: 'secondary',
        periodTime: '3:12',
      };
      addLog(`ASSIST! ${player.name} to RNH (${homeTeam.score}-${awayTeam.score}) - ${newPointsAfterAssist2} points, jumps to #3 in NHL!`, 'assist');
      await eventDispatcher.dispatch(secondAssist);
      await sleep(randomDelay(5000, 8000));

      // Goal 2 - Power play goal!
      homeTeam.score++;
      const assistPlayer2: Player = { id: 'p4', name: 'Evan Bouchard', number: 2, position: 'D', team: player.team };
      const newGoalStats2 = player.seasonStats.goals + 2;
      const newPointStats2 = player.seasonStats.points + 4;
      const goal2: GoalEvent = {
        id: `event-${eventId++}`,
        type: 'goal',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, goals: newGoalStats2, points: newPointStats2 },
        leagueRanking: {
          category: 'goals',
          rank: 6,
          previousRank: 8,
          totalPlayers: 800,
        },
        assistedBy: [assistPlayer2],
        goalType: 'power_play',
        periodTime: '6:15',
      };
      addLog(`POWER PLAY GOAL! ${player.name} rips it (${homeTeam.score}-${awayTeam.score}) - ${newGoalStats2}G, now #6 in NHL`, 'goal');
      goals.push(goal2);
      await eventDispatcher.dispatch(goal2);
      await sleep(randomDelay(6000, 9000));

      addLog('End of Period 2', 'period');
      await sleep(randomDelay(3000, 4000));

      // Period 3
      game.period = 3;
      addLog('Final period underway', 'period');
      await sleep(randomDelay(4000, 6000));

      // Opponent scores - game gets tight
      awayTeam.score++;
      addLog(`${awayTeam.name} answers back - Tied ${homeTeam.score}-${awayTeam.score}`, 'info');
      await sleep(randomDelay(6000, 9000));

      // Goal 3 - Hat Trick goal breaks the tie!
      homeTeam.score++;
      const assistPlayer3: Player = { id: 'p2', name: 'Leon Draisaitl', number: 29, position: 'C', team: player.team };
      const assistPlayer4: Player = { id: 'p4', name: 'Evan Bouchard', number: 2, position: 'D', team: player.team };
      const newGoalStats3 = player.seasonStats.goals + 3;
      const newPointStats3 = player.seasonStats.points + 5;
      const newPPG = newPointStats3 / (player.seasonStats.gamesPlayed + 1);
      const goal3: GoalEvent = {
        id: `event-${eventId++}`,
        type: 'goal',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, goals: newGoalStats3, points: newPointStats3, pointsPerGame: newPPG },
        leagueRanking: {
          category: 'ppg',
          rank: 2,
          previousRank: 3,
          totalPlayers: 800,
        },
        assistedBy: [assistPlayer3, assistPlayer4],
        goalType: 'even_strength',
        periodTime: '12:08',
      };
      addLog(`CLUTCH GOAL! ${player.name} breaks the tie (${homeTeam.score}-${awayTeam.score}) - ${newGoalStats3}G, ${newPPG.toFixed(2)} PPG (#2 in NHL)`, 'goal');
      goals.push(goal3);
      await eventDispatcher.dispatch(goal3);
      await sleep(randomDelay(5000, 7000));

      // Hat Trick celebration!
      const finalGoalStats = player.seasonStats.goals + 3;
      const finalPointStats = player.seasonStats.points + 5;
      const hatTrick: HatTrickEvent = {
        id: `event-${eventId++}`,
        type: 'hat_trick',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, goals: finalGoalStats, points: finalPointStats },
        leagueRanking: {
          category: 'points',
          rank: 1,
          previousRank: 3,
          totalPlayers: 800,
        },
        goals: [goal1, goal2, goal3],
        careerHatTricks: 3,
      };
      addLog(`🎩 HAT TRICK ALERT! ${player.name} (${finalPointStats} PTS) takes over #1 in NHL scoring!`, 'hat_trick');
      await eventDispatcher.dispatch(hatTrick);
      await sleep(randomDelay(6000, 9000));

      addLog('Final minutes of regulation', 'period');
      await sleep(randomDelay(3000, 5000));

      // Game End
      game.status = 'final';
      addLog('Final horn sounds - Game Over', 'game_end');
      await sleep(randomDelay(2000, 3000));

      const gameStats = {
        goals: 3,
        assists: 2,
        points: 5,
        shots: 9,
        plusMinus: 4,
      };

      const won = homeTeam.score > awayTeam.score;
      const aiSummary = won
        ? `${player.name} put on an absolute clinic with a natural hat trick and 2 assists in a commanding ${homeTeam.score}-${awayTeam.score} victory over ${awayTeam.name}! The superstar center dominated all three zones, showcasing elite playmaking and finishing ability. With ${player.seasonStats.points + 5} points in ${player.seasonStats.gamesPlayed + 1} games (${((player.seasonStats.points + 5) / (player.seasonStats.gamesPlayed + 1)).toFixed(2)} PPG), they're cementing their case as a Hart Trophy candidate.`
        : `Despite ${player.name}'s heroic hat trick effort and 5-point performance, ${homeTeam.name} fell short ${homeTeam.score}-${awayTeam.score} to ${awayTeam.name}. The star forward showed incredible resilience and offensive prowess with 3 goals and 2 assists, but it wasn't enough. Now at ${player.seasonStats.points + 5} points through ${player.seasonStats.gamesPlayed + 1} games (${((player.seasonStats.points + 5) / (player.seasonStats.gamesPlayed + 1)).toFixed(2)} PPG), they continue to be one of the league's elite performers.`;

      const gameEnd: GameEndEvent = {
        id: `event-${eventId++}`,
        type: 'game_end',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: {
          ...player.seasonStats,
          goals: player.seasonStats.goals + 3,
          assists: player.seasonStats.assists + 2,
          points: player.seasonStats.points + 5,
          gamesPlayed: player.seasonStats.gamesPlayed + 1,
          pointsPerGame: (player.seasonStats.points + 5) / (player.seasonStats.gamesPlayed + 1)
        },
        gameStats,
        aiSummary,
      };
      await eventDispatcher.dispatch(gameEnd);
      await sleep(randomDelay(3000, 4000));

      addLog('Simulation complete', 'info');
    } catch (error) {
      console.error('Simulation error:', error);
      addLog('Simulation error occurred', 'info');
      if (typeof eventDispatcher?.reset === 'function') {
        eventDispatcher.reset();
      }
    } finally {
      simulationInProgressRef.current = false;
      setGameSimulating(false);
    }
  };

  return (
    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Game Simulator</CardTitle>
            <CardDescription className="text-slate-400">
              Simulate a live game with real-time events
            </CardDescription>
          </div>
          {isGameSimulating && (
            <Badge variant="outline" className="border-green-500 bg-green-500/20 text-green-400">
              <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-green-400"></span>
              Live
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={simulateGame}
          disabled={isGameSimulating}
          className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 py-6 text-lg font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:shadow-none"
          size="lg"
        >
          {isGameSimulating ? (
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              <span>Game in Progress...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Start Game Simulation</span>
              <div className="ml-1 flex gap-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-white"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-white delay-75"></div>
                <div className="h-2 w-2 animate-pulse rounded-full bg-white delay-150"></div>
              </div>
            </div>
          )}
        </Button>

        {eventLog.length > 0 && (
          <div className="mt-4 max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/50 p-4"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#475569 #1e293b'
            }}>
            <div className="mb-3 flex items-center justify-between border-b border-slate-700 pb-2">
              <p className="text-sm font-semibold text-white">Game Events</p>
              <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400 text-xs">
                {eventCount} events
              </Badge>
            </div>
            {eventLog.map((entry, index) => {
              const getEventIcon = (type: LogEntry['type']) => {
                switch (type) {
                  case 'game_start':
                    return <Play className="h-4 w-4 text-blue-400" />;
                  case 'period':
                    return <Clock className="h-4 w-4 text-cyan-400" />;
                  case 'goal':
                    return <Target className="h-4 w-4 text-green-400" />;
                  case 'assist':
                    return <Zap className="h-4 w-4 text-yellow-400" />;
                  case 'penalty':
                    return <AlertTriangle className="h-4 w-4 text-orange-400" />;
                  case 'milestone':
                    return <Star className="h-4 w-4 text-purple-400" />;
                  case 'hat_trick':
                    return <Trophy className="h-4 w-4 text-yellow-400" />;
                  case 'game_end':
                    return <CheckCircle2 className="h-4 w-4 text-green-400" />;
                  default:
                    return <Play className="h-4 w-4 text-slate-400" />;
                }
              };

              return (
                <div
                  key={index}
                  className="animate-in fade-in slide-in-from-left-2 flex items-start gap-2 rounded-md border border-slate-700/50 bg-slate-800/30 p-2.5"
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {getEventIcon(entry.type)}
                  </div>
                  <span className="text-sm text-slate-200 leading-relaxed">{entry.message}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-start gap-2 rounded-md border border-blue-500/20 bg-blue-500/5 p-3">
          <Star className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Watch real-time events unfold as the game is simulated
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
