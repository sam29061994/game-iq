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
      await sleep(3000);

      // Period 1
      game.status = 'live';
      game.period = 1;

      // Goal 1
      addLog('⚽ GOAL! ' + player.name + ' scores!');
      homeTeam.score++;
      const goal1: GoalEvent = {
        id: `event-${eventId++}`,
        type: 'goal',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, goals: player.seasonStats.goals + 1, points: player.seasonStats.points + 1 },
        goalType: 'even_strength',
        periodTime: '8:45',
      };
      goals.push(goal1);
      await eventDispatcher.dispatch(goal1);
      await sleep(4000);

      // Check for milestone (19th goal)
      if (player.seasonStats.goals === 18) {
        addLog('🎉 MILESTONE! 19th goal of the season!');
        const milestone: MilestoneEvent = {
          id: `event-${eventId++}`,
          type: 'milestone',
          timestamp: new Date().toISOString(),
          game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
          player: mappedPlayer,
          seasonStats: { ...player.seasonStats, goals: 19, points: player.seasonStats.points + 1 },
          milestoneType: 'goal',
          milestone: '19th goal',
          value: 19,
          description: `${player.name} reaches 19 goals this season!`,
          isCareerHigh: false,
          divisionRank: 3,
        };
        await eventDispatcher.dispatch(milestone);
        await sleep(3000);
      }

      // Assist
      addLog('🎯 Assist for ' + player.name + '!');
      const assist: AssistEvent = {
        id: `event-${eventId++}`,
        type: 'assist',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, assists: player.seasonStats.assists + 1, points: player.seasonStats.points + 2 },
        goalScoredBy: { id: 'p2', name: 'Teammate', number: 21, position: 'LW', team: player.team },
        assistType: 'primary',
        periodTime: '14:22',
      };
      await eventDispatcher.dispatch(assist);
      await sleep(4000);

      // Penalty
      addLog('⚠️ Penalty: ' + player.name);
      const penalty: PenaltyEvent = {
        id: `event-${eventId++}`,
        type: 'penalty',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: player.seasonStats,
        infraction: 'Tripping',
        duration: 2,
        periodTime: '18:30',
      };
      await eventDispatcher.dispatch(penalty);
      await sleep(3000);

      // Period 2
      game.period = 2;

      // Goal 2
      addLog('⚽ Another GOAL! ' + player.name + '!');
      homeTeam.score++;
      const goal2: GoalEvent = {
        id: `event-${eventId++}`,
        type: 'goal',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, goals: player.seasonStats.goals + 2, points: player.seasonStats.points + 3 },
        goalType: 'power_play',
        periodTime: '6:15',
      };
      goals.push(goal2);
      await eventDispatcher.dispatch(goal2);
      await sleep(4000);

      // Period 3
      game.period = 3;

      // Goal 3 - Hat Trick!
      addLog('⚽ GOAL! Hat trick incoming...');
      homeTeam.score++;
      const goal3: GoalEvent = {
        id: `event-${eventId++}`,
        type: 'goal',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, goals: player.seasonStats.goals + 3, points: player.seasonStats.points + 4 },
        goalType: 'even_strength',
        periodTime: '12:08',
      };
      goals.push(goal3);
      await eventDispatcher.dispatch(goal3);
      await sleep(3000);

      // Hat Trick celebration!
      addLog('🔥 HAT TRICK! ' + player.name + ' completes the hat trick!');
      const hatTrick: HatTrickEvent = {
        id: `event-${eventId++}`,
        type: 'hat_trick',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, goals: player.seasonStats.goals + 3, points: player.seasonStats.points + 4 },
        goals: [goal1, goal2, goal3],
        careerHatTricks: 2,
      };
      await eventDispatcher.dispatch(hatTrick);
      await sleep(4000);

      // Game End
      game.status = 'final';
      addLog('🏁 Game Over! Check the AI summary!');
      const gameEnd: GameEndEvent = {
        id: `event-${eventId++}`,
        type: 'game_end',
        timestamp: new Date().toISOString(),
        game: { ...game, homeTeam: { ...homeTeam }, awayTeam: { ...awayTeam } },
        player: mappedPlayer,
        seasonStats: { ...player.seasonStats, goals: player.seasonStats.goals + 3, points: player.seasonStats.points + 5 },
        gameStats: {
          goals: 3,
          assists: 1,
          points: 4,
          shots: 8,
          plusMinus: 3,
        },
        aiSummary: `${player.name}'s incredible hat trick performance powered a dominant ${homeTeam.score}-${awayTeam.score} victory! They're averaging ${player.seasonStats.pointsPerGame.toFixed(2)} points per game this season.`,
      };
      await eventDispatcher.dispatch(gameEnd);
      await sleep(2000);

      addLog('✅ Simulation complete!');
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
