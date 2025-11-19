'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_PLAYERS } from '@/lib/mock-data/players';
import { useUserStore } from '@/lib/mock-data/user-state';

export default function SelectPlayerPage() {
  const router = useRouter();
  const setSelectedPlayer = useUserStore((state) => state.setSelectedPlayer);
  const userName = useUserStore((state) => state.userName);

  const handlePlayerSelect = (player: typeof MOCK_PLAYERS[0]) => {
    setSelectedPlayer(player);
    router.push('/dashboard');
  };

  // Redirect if no user name
  if (!userName) {
    router.push('/onboarding');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">
            Subscribe to Your Player
          </h1>
          <p className="text-lg text-slate-300">
            Choose one player to receive real-time game notifications and AI-generated summaries
          </p>
          <p className="mt-2 text-sm text-slate-400">
            (Demo uses NHL players • Production version features youth hockey leagues)
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PLAYERS.map((player) => (
            <Card
              key={player.id}
              className="group cursor-pointer border-slate-700 bg-slate-800/50 backdrop-blur-sm transition-all hover:scale-105 hover:border-blue-500 hover:bg-slate-800/80"
              onClick={() => handlePlayerSelect(player)}
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-2xl font-bold text-white">
                    {player.number}
                  </div>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    {player.position}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {player.name}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {player.team}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-700 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {player.seasonStats.goals}
                    </div>
                    <div className="text-xs text-slate-400">Goals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">
                      {player.seasonStats.assists}
                    </div>
                    <div className="text-xs text-slate-400">Assists</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">
                      {player.seasonStats.points}
                    </div>
                    <div className="text-xs text-slate-400">Points</div>
                  </div>
                </div>

                <div className="mt-4 text-center text-sm text-slate-400">
                  {player.seasonStats.pointsPerGame.toFixed(2)} PPG in {player.seasonStats.gamesPlayed} games
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
