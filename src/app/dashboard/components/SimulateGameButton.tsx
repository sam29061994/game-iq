'use client';

import { useState } from 'react';
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

interface SimulateGameButtonProps {
  player: PlayerProfile;
}

export function SimulateGameButton({ player }: SimulateGameButtonProps) {
  const { isGameSimulating, setGameSimulating, notificationsEnabled } = useUserStore();
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [eventCount, setEventCount] = useState(0);

  const simulateGame = async () => {
    // Only run in browser
    if (typeof window === 'undefined') {
      return;
    }

    // Check notification permission
    if ('Notification' in window && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Please enable notifications to receive game updates!');
        return;
      }
    }

    setGameSimulating(true);
    setEventLog([]);
    setEventCount(0);

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

    const addLog = (message: string) => {
      setEventLog((prev) => [...prev, message]);
      setEventCount((prev) => prev + 1);
    };

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Random delay between events to make it feel more realistic
    const randomDelay = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    try {
      // Game start notification
      addLog('📢 Game starting soon...');
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
      addLog('🏒 Period 1 underway...');
      await sleep(randomDelay(3000, 5000));

      // Early period action - Opponent scores first
      addLog('⚽ Opponent scores first...');
      awayTeam.score++;
      await sleep(randomDelay(5000, 8000));

      // Goal 1 - Response goal
      addLog(`⚽ GOAL! ${player.name} answers back with an even-strength goal!`);
      homeTeam.score++;
      const assistPlayer: Player = { id: 'p2', name: 'Leon Draisaitl', number: 29, position: 'C', team: player.team };
      const goal1: GoalEvent = {
        id: `event-${eventId++}`,
        type: 'goal',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, goals: player.seasonStats.goals + 1, points: player.seasonStats.points + 1 },
        assistedBy: [assistPlayer],
        goalType: 'even_strength',
        periodTime: '8:45',
      };
      goals.push(goal1);
      await eventDispatcher.dispatch(goal1);
      await sleep(randomDelay(5000, 7000));

      // Check for milestone (20th goal)
      if (player.seasonStats.goals === 19) {
        addLog('🎉 MILESTONE! 20th goal of the season!');
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

      // Assist
      addLog(`🎯 Primary assist for ${player.name} on a beautiful setup!`);
      homeTeam.score++;
      const assist: AssistEvent = {
        id: `event-${eventId++}`,
        type: 'assist',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, assists: player.seasonStats.assists + 1, points: player.seasonStats.points + 2 },
        goalScoredBy: { id: 'p2', name: 'Zach Hyman', number: 18, position: 'LW' as const, team: player.team },
        assistType: 'primary',
        periodTime: '14:22',
      };
      await eventDispatcher.dispatch(assist);
      await sleep(randomDelay(6000, 9000));

      // Late period penalty
      addLog(`⚠️ Penalty: ${player.name} gets called for hooking in a close game`);
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

      addLog('⏱️ End of Period 1');
      await sleep(randomDelay(3000, 4000));

      // Period 2
      game.period = 2;
      addLog('🏒 Period 2 begins!');
      await sleep(randomDelay(4000, 6000));

      // Second assist - building momentum
      addLog(`🎯 Secondary assist for ${player.name}!`);
      homeTeam.score++;
      const secondAssist: AssistEvent = {
        id: `event-${eventId++}`,
        type: 'assist',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, assists: player.seasonStats.assists + 2, points: player.seasonStats.points + 3 },
        goalScoredBy: { id: 'p3', name: 'Ryan Nugent-Hopkins', number: 93, position: 'C' as const, team: player.team },
        assistType: 'secondary',
        periodTime: '3:12',
      };
      await eventDispatcher.dispatch(secondAssist);
      await sleep(randomDelay(5000, 8000));

      // Goal 2 - Power play goal!
      addLog(`⚡ POWER PLAY GOAL! ${player.name} capitalizes on the man advantage!`);
      homeTeam.score++;
      const assistPlayer2: Player = { id: 'p4', name: 'Evan Bouchard', number: 2, position: 'D', team: player.team };
      const goal2: GoalEvent = {
        id: `event-${eventId++}`,
        type: 'goal',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, goals: player.seasonStats.goals + 2, points: player.seasonStats.points + 4 },
        assistedBy: [assistPlayer2],
        goalType: 'power_play',
        periodTime: '6:15',
      };
      goals.push(goal2);
      await eventDispatcher.dispatch(goal2);
      await sleep(randomDelay(6000, 9000));

      addLog('⏱️ End of Period 2 - momentum building!');
      await sleep(randomDelay(3000, 4000));

      // Period 3
      game.period = 3;
      addLog('🏒 Final period! Closing time...');
      await sleep(randomDelay(4000, 6000));

      // Opponent scores - game gets tight
      addLog('⚽ Opponent scores - game tightening up!');
      awayTeam.score++;
      await sleep(randomDelay(6000, 9000));

      // Goal 3 - Hat Trick goal!
      addLog(`⚽ GOAL! ${player.name} with a clutch goal - HAT TRICK ALERT! 🎩`);
      homeTeam.score++;
      const assistPlayer3: Player = { id: 'p2', name: 'Leon Draisaitl', number: 29, position: 'C', team: player.team };
      const assistPlayer4: Player = { id: 'p4', name: 'Evan Bouchard', number: 2, position: 'D', team: player.team };
      const goal3: GoalEvent = {
        id: `event-${eventId++}`,
        type: 'goal',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, goals: player.seasonStats.goals + 3, points: player.seasonStats.points + 5 },
        assistedBy: [assistPlayer3, assistPlayer4],
        goalType: 'even_strength',
        periodTime: '12:08',
      };
      goals.push(goal3);
      await eventDispatcher.dispatch(goal3);
      await sleep(randomDelay(5000, 7000));

      // Hat Trick celebration!
      addLog(`🔥🎩 HAT TRICK! ${player.name} completes the natural hat trick! Hats rain down!`);
      const hatTrick: HatTrickEvent = {
        id: `event-${eventId++}`,
        type: 'hat_trick',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, goals: player.seasonStats.goals + 3, points: player.seasonStats.points + 5 },
        goals: [goal1, goal2, goal3],
        careerHatTricks: 3,
      };
      await eventDispatcher.dispatch(hatTrick);
      await sleep(randomDelay(6000, 9000));

      addLog('⏱️ Final minutes of regulation...');
      await sleep(randomDelay(3000, 5000));

      // Game End
      game.status = 'final';
      addLog('🏁 Final horn sounds! What a performance!');
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

      addLog('✅ Simulation complete! Check your notifications!');
    } catch (error) {
      console.error('Simulation error:', error);
      addLog('❌ Simulation error occurred');
    } finally {
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
              Simulate a live game with real-time push notifications
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
          <div className="mt-4 max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <div className="mb-2 flex items-center justify-between border-b border-slate-700 pb-2">
              <p className="text-sm font-semibold text-white">Event Log</p>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                {eventCount} events
              </Badge>
            </div>
            {eventLog.map((log, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-left-2 text-sm text-slate-300"
              >
                {log}
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-slate-500">
          💡 Tip: Enable browser notifications to see push notifications during the simulation
        </p>
      </CardContent>
    </Card>
  );
}
