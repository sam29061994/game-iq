'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MOCK_PLAYERS } from '@/lib/mock-data/players';
import { useUserStore } from '@/lib/mock-data/user-state';

export default function SelectPlayerPage() {
  const router = useRouter();
  const { setSelectedPlayer, setOnboardingComplete, userName } = useUserStore();

  const handlePlayerSelect = (player: typeof MOCK_PLAYERS[0]) => {
    setSelectedPlayer(player);
    setOnboardingComplete(true);
    router.push('/dashboard');
  };

  // Redirect if no user name
  if (!userName) {
    router.push('/onboarding');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-10 py-8">
      <div className="mx-auto max-w-6xl">
        {/* GameSheet IQ Branding Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">GameSheet IQ</h1>
          <div className="flex items-center justify-center gap-2 text-sm">
            <div className="flex items-center gap-2 opacity-50">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center text-xs font-medium">
                ✓
              </div>
              <span className="text-slate-400 hidden sm:inline">Your Info</span>
              <span className="text-slate-400 sm:hidden">Info</span>
            </div>
            <div className="h-px w-8 md:w-12 bg-slate-600"></div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center text-xs font-medium">
                2
              </div>
              <span className="font-medium text-white hidden sm:inline">Select Player</span>
              <span className="font-medium text-white sm:hidden">Player</span>
            </div>
          </div>
        </div>

        <div className="mb-8 text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Subscribe to Your Player
          </h2>
          <p className="text-base md:text-lg text-slate-300">
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
              className="overflow-hidden p-0 border-2 border-slate-700 bg-slate-900/80 backdrop-blur-sm relative group cursor-pointer transition-all hover:scale-105"
              onClick={() => handlePlayerSelect(player)}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-lg opacity-0 blur group-hover:opacity-25 transition duration-500"></div>
              <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95">
              <CardContent className="p-6 bg-slate-900/40">
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
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
