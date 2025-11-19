'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/mock-data/user-state';
import { StatsCard } from './components/StatsCard';
import { PerformanceChart } from './components/PerformanceChart';
import { RecentGamesTable } from './components/RecentGamesTable';
import { SimulateGameButton } from './components/SimulateGameButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Target, Trophy, TrendingUp, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { selectedPlayer, userName, clearUser } = useUserStore();

  useEffect(() => {
    if (!selectedPlayer || !userName) {
      router.push('/onboarding');
    }
  }, [selectedPlayer, userName, router]);

  const handleLogout = () => {
    clearUser();
    router.push('/onboarding');
  };

  if (!selectedPlayer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-lg font-bold text-white">
                {selectedPlayer.number}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  {selectedPlayer.name}
                </h1>
                <p className="text-sm text-slate-400">
                  {selectedPlayer.team} • {selectedPlayer.position}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm text-slate-400">Welcome back,</p>
                <p className="font-medium text-white">{userName}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="border border-slate-600 bg-transparent text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Goals"
            value={selectedPlayer.seasonStats.goals}
            subtitle={`${selectedPlayer.seasonStats.shotsOnGoal} SOG`}
            trend="+12%"
            icon={Target}
            color="blue"
          />
          <StatsCard
            title="Assists"
            value={selectedPlayer.seasonStats.assists}
            subtitle={`In ${selectedPlayer.seasonStats.gamesPlayed} games`}
            trend="+8%"
            icon={Trophy}
            color="cyan"
          />
          <StatsCard
            title="Points"
            value={selectedPlayer.seasonStats.points}
            subtitle={`${selectedPlayer.seasonStats.pointsPerGame.toFixed(2)} per game`}
            trend="+15%"
            icon={TrendingUp}
            color="purple"
          />
          <StatsCard
            title="Plus/Minus"
            value={selectedPlayer.seasonStats.plusMinus > 0 ? `+${selectedPlayer.seasonStats.plusMinus}` : selectedPlayer.seasonStats.plusMinus.toString()}
            subtitle={`${selectedPlayer.seasonStats.penaltyMinutes} PIM`}
            trend={selectedPlayer.seasonStats.plusMinus > 0 ? '+5%' : '-2%'}
            icon={BarChart3}
            color="green"
          />
        </div>

        {/* Simulate Game Button */}
        <div className="mb-8">
          <SimulateGameButton player={selectedPlayer} />
        </div>

        {/* Performance Chart */}
        <div className="mb-8">
          <PerformanceChart data={selectedPlayer.performanceData} />
        </div>

        {/* Recent Games */}
        <div>
          <RecentGamesTable games={selectedPlayer.recentGames} playerName={selectedPlayer.name} />
        </div>
      </main>
    </div>
  );
}
