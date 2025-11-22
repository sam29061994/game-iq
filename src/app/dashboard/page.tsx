'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/mock-data/user-state';
import { StatsCard } from './components/StatsCard';
import { PerformanceChart } from './components/PerformanceChart';
import { RecentGamesTable } from './components/RecentGamesTable';
import { SimulateGameButton } from './components/SimulateGameButton';
import { DashboardHeader } from './components/DashboardHeader';
import { Target, Trophy, TrendingUp, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { selectedPlayer, onboardingComplete, googleAuth, _hasHydrated } = useUserStore();

  useEffect(() => {
    // Only check auth after Zustand has hydrated from localStorage
    if (_hasHydrated && (!googleAuth || !onboardingComplete || !selectedPlayer)) {
      router.push('/onboarding');
    }
  }, [_hasHydrated, googleAuth, onboardingComplete, selectedPlayer, router]);

  // Show loading state while hydrating
  if (!_hasHydrated || !googleAuth || !selectedPlayer) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <DashboardHeader currentPage="dashboard" />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
          {/* Player Info Banner */}
          <div className="mb-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-2xl font-bold text-white">
                {selectedPlayer.number}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{selectedPlayer.name}</h1>
                <p className="text-slate-300">
                  {selectedPlayer.team} • {selectedPlayer.position}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              value={
                selectedPlayer.seasonStats.plusMinus > 0
                  ? `+${selectedPlayer.seasonStats.plusMinus}`
                  : selectedPlayer.seasonStats.plusMinus.toString()
              }
              subtitle={`${selectedPlayer.seasonStats.penaltyMinutes} PIM`}
              trend={selectedPlayer.seasonStats.plusMinus > 0 ? '+5%' : '-2%'}
              icon={BarChart3}
              color="green"
            />
          </div>

          {/* Simulate Game Button */}
          <div className="mb-6">
            <SimulateGameButton player={selectedPlayer} />
          </div>

          {/* Performance Chart */}
          <div className="mb-6">
            <PerformanceChart data={selectedPlayer.performanceData} />
          </div>

          {/* Recent Games */}
          <div>
            <RecentGamesTable games={selectedPlayer.recentGames} playerName={selectedPlayer.name} />
          </div>
        </div>
      </main>
    </div>
  );
}
