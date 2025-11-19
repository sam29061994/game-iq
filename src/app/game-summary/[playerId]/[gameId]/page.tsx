'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPlayerById } from '@/lib/mock-data/players';
import { MOCK_GAME_SUMMARIES } from '@/lib/mock-data/game-summaries';
import {
  ArrowLeft,
  Trophy,
  Target,
  TrendingUp,
  Clock,
  Activity,
  Zap,
  Shield,
  BarChart3,
  Lightbulb,
  Star,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface PageProps {
  params: Promise<{
    playerId: string;
    gameId: string;
  }>;
}

export default function GameSummaryPage({ params }: PageProps) {
  const router = useRouter();
  const { playerId, gameId } = use(params);

  const player = getPlayerById(playerId);
  const summaryKey = `${playerId}-${gameId}`;
  const gameSummary = MOCK_GAME_SUMMARIES[summaryKey];
  const game = player?.recentGames.find(g => g.id === gameId);

  if (!player || !gameSummary || !game) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center text-white">
          <p>Game summary not found</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const gradeColors = {
    'A+': 'text-green-400 bg-green-500/20',
    'A': 'text-green-400 bg-green-500/20',
    'A-': 'text-green-400 bg-green-500/20',
    'B+': 'text-blue-400 bg-blue-500/20',
    'B': 'text-blue-400 bg-blue-500/20',
    'B-': 'text-blue-400 bg-blue-500/20',
    'C+': 'text-yellow-400 bg-yellow-500/20',
    'C': 'text-yellow-400 bg-yellow-500/20',
    'C-': 'text-yellow-400 bg-yellow-500/20',
    'D': 'text-orange-400 bg-orange-500/20',
    'F': 'text-red-400 bg-red-500/20',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="border border-slate-600 bg-transparent text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`border-slate-600 ${
                  game.result === 'W'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {game.result === 'W' ? 'Win' : 'Loss'} {game.score}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-4 md:py-8">
        {/* Game Title */}
        <div className="mb-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xl font-bold text-white md:h-16 md:w-16 md:text-2xl">
              {player.number}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white md:text-3xl">{player.name}</h1>
              <p className="text-sm text-slate-400 md:text-base">
                vs {game.opponent} • {new Date(game.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 md:text-sm">Performance Grade</p>
                    <p className={`text-2xl font-bold md:text-3xl ${gradeColors[gameSummary.performanceGrade]}`}>
                      {gameSummary.performanceGrade}
                    </p>
                  </div>
                  <Star className="h-6 w-6 text-yellow-400 md:h-8 md:w-8" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 md:text-sm">Impact Rating</p>
                    <p className="text-2xl font-bold text-blue-400 md:text-3xl">{gameSummary.impactRating}/10</p>
                  </div>
                  <Zap className="h-6 w-6 text-blue-400 md:h-8 md:w-8" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 md:text-sm">Time on Ice</p>
                    <p className="text-2xl font-bold text-cyan-400 md:text-3xl">{gameSummary.detailedStats.timeOnIce}</p>
                  </div>
                  <Clock className="h-6 w-6 text-cyan-400 md:h-8 md:w-8" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 md:text-sm">Points</p>
                    <p className="text-2xl font-bold text-purple-400 md:text-3xl">{game.points}</p>
                  </div>
                  <Trophy className="h-6 w-6 text-purple-400 md:h-8 md:w-8" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI-Generated Summary */}
        <Card className="mb-6 border-slate-700 bg-slate-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-white md:text-lg">
              <Lightbulb className="h-4 w-4 text-yellow-400 md:h-5 md:w-5" />
              AI-Generated Game Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-300 md:text-base">
              {gameSummary.overallSummary}
            </p>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="periods" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            <TabsList className="!w-auto min-w-max gap-2 bg-transparent p-0 lg:!w-full lg:grid lg:grid-cols-5 lg:gap-0 lg:bg-slate-800/50 lg:border lg:border-slate-700 lg:p-1">
              <TabsTrigger
                value="periods"
                className="!flex-none snap-start whitespace-nowrap rounded-lg border-2 bg-slate-800 px-3 py-1.5 text-xs font-medium md:text-sm md:py-2 data-[state=active]:border-blue-400 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=inactive]:border-slate-600 data-[state=inactive]:text-slate-100 data-[state=inactive]:hover:border-slate-500 data-[state=inactive]:hover:bg-slate-700 lg:!flex-1 lg:rounded-md lg:border-0"
              >
                Period Breakdown
              </TabsTrigger>
              <TabsTrigger
                value="moments"
                className="!flex-none snap-start whitespace-nowrap rounded-lg border-2 bg-slate-800 px-3 py-1.5 text-xs font-medium md:text-sm md:py-2 data-[state=active]:border-blue-400 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=inactive]:border-slate-600 data-[state=inactive]:text-slate-100 data-[state=inactive]:hover:border-slate-500 data-[state=inactive]:hover:bg-slate-700 lg:!flex-1 lg:rounded-md lg:border-0"
              >
                Key Moments
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="!flex-none snap-start whitespace-nowrap rounded-lg border-2 bg-slate-800 px-3 py-1.5 text-xs font-medium md:text-sm md:py-2 data-[state=active]:border-blue-400 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=inactive]:border-slate-600 data-[state=inactive]:text-slate-100 data-[state=inactive]:hover:border-slate-500 data-[state=inactive]:hover:bg-slate-700 lg:!flex-1 lg:rounded-md lg:border-0"
              >
                Detailed Stats
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="!flex-none snap-start whitespace-nowrap rounded-lg border-2 bg-slate-800 px-3 py-1.5 text-xs font-medium md:text-sm md:py-2 data-[state=active]:border-blue-400 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=inactive]:border-slate-600 data-[state=inactive]:text-slate-100 data-[state=inactive]:hover:border-slate-500 data-[state=inactive]:hover:bg-slate-700 lg:!flex-1 lg:rounded-md lg:border-0"
              >
                Coaching Insights
              </TabsTrigger>
              <TabsTrigger
                value="comparison"
                className="!flex-none snap-start whitespace-nowrap rounded-lg border-2 bg-slate-800 px-3 py-1.5 text-xs font-medium md:text-sm md:py-2 data-[state=active]:border-blue-400 data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 data-[state=inactive]:border-slate-600 data-[state=inactive]:text-slate-100 data-[state=inactive]:hover:border-slate-500 data-[state=inactive]:hover:bg-slate-700 lg:!flex-1 lg:rounded-md lg:border-0"
              >
                Comparisons
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Period Breakdown Tab */}
          <TabsContent value="periods" className="space-y-3">
            {gameSummary.periodBreakdowns.map((period) => (
              <Card key={period.period} className="border-slate-700 bg-slate-800/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-white md:text-lg">Period {period.period}</CardTitle>
                  <CardDescription className="text-xs text-slate-400 md:text-sm">
                    {period.timeOnIce} TOI • {period.shifts} shifts • {period.plusMinus >= 0 ? '+' : ''}{period.plusMinus}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-8">
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-400 md:text-2xl">{period.goals}</p>
                      <p className="text-[11px] text-slate-400 sm:text-xs">G</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-cyan-400 md:text-2xl">{period.assists}</p>
                      <p className="text-[11px] text-slate-400 sm:text-xs">A</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-purple-400 md:text-2xl">{period.shots}</p>
                      <p className="text-[11px] text-slate-400 sm:text-xs">SOG</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-400 md:text-2xl">{period.hits}</p>
                      <p className="text-[11px] text-slate-400 sm:text-xs">Hits</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-yellow-400 md:text-2xl">{period.blocks}</p>
                      <p className="text-[11px] text-slate-400 sm:text-xs">Blocks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-orange-400 md:text-2xl">{period.faceoffWins}</p>
                      <p className="text-[11px] text-slate-400 sm:text-xs">FO W</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-red-400 md:text-2xl">{period.faceoffLosses}</p>
                      <p className="text-[11px] text-slate-400 sm:text-xs">FO L</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-xl font-bold md:text-2xl ${period.plusMinus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {period.plusMinus >= 0 ? '+' : ''}{period.plusMinus}
                      </p>
                      <p className="text-[11px] text-slate-400 sm:text-xs">+/-</p>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
                    <h4 className="mb-2 text-xs font-semibold text-white md:text-sm">Period Highlights:</h4>
                    <ul className="space-y-1.5">
                      {period.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-200 md:text-sm">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400 md:h-4 md:w-4" />
                          <span className="leading-relaxed">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Key Moments Tab */}
          <TabsContent value="moments" className="space-y-3">
            {gameSummary.keyMoments.map((moment, idx) => {
              const impactColors = {
                game_changing: 'border-yellow-500 bg-yellow-500/10',
                important: 'border-blue-500 bg-blue-500/10',
                notable: 'border-slate-600 bg-slate-700/10',
              };

              const impactIcons = {
                game_changing: <Star className="h-4 w-4 text-yellow-400 md:h-5 md:w-5" />,
                important: <Zap className="h-4 w-4 text-blue-400 md:h-5 md:w-5" />,
                notable: <Activity className="h-4 w-4 text-slate-400 md:h-5 md:w-5" />,
              };

              return (
                <Card key={idx} className={`border ${impactColors[moment.impact]}`}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <CardTitle className="flex items-center gap-2 text-base text-white md:text-lg">
                        {impactIcons[moment.impact]}
                        {moment.title}
                      </CardTitle>
                      <Badge variant="outline" className="w-fit border-slate-600 bg-slate-800/50 text-xs text-slate-200">
                        Period {moment.period} • {moment.time}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-slate-200 md:text-base">{moment.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Detailed Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            {/* Core Stats */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white md:text-lg">Core Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
                    <p className="mb-1 text-xs text-slate-400 md:text-sm">Goals / Assists / Points</p>
                    <p className="text-xl font-bold text-white md:text-2xl">
                      {gameSummary.detailedStats.goals} / {gameSummary.detailedStats.assists} / {gameSummary.detailedStats.goals + gameSummary.detailedStats.assists}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
                    <p className="mb-1 text-xs text-slate-400 md:text-sm">Shots / Accuracy</p>
                    <p className="text-xl font-bold text-white md:text-2xl">
                      {gameSummary.detailedStats.shots} / {gameSummary.detailedStats.shotAccuracy.toFixed(1)}%
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
                    <p className="mb-1 text-xs text-slate-400 md:text-sm">Shifts / Avg Length</p>
                    <p className="text-xl font-bold text-white md:text-2xl">
                      {gameSummary.detailedStats.shifts} / {gameSummary.detailedStats.avgShiftLength}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
                    <p className="mb-1 text-xs text-slate-400 md:text-sm">Hits / Blocks</p>
                    <p className="text-xl font-bold text-white md:text-2xl">
                      {gameSummary.detailedStats.hits} / {gameSummary.detailedStats.blocks}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
                    <p className="mb-1 text-xs text-slate-400 md:text-sm">Takeaways / Giveaways</p>
                    <p className="text-xl font-bold text-white md:text-2xl">
                      {gameSummary.detailedStats.takeaways} / {gameSummary.detailedStats.giveaways}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3">
                    <p className="mb-1 text-xs text-slate-400 md:text-sm">Faceoff Win %</p>
                    <p className="text-xl font-bold text-white md:text-2xl">
                      {gameSummary.detailedStats.faceoffs.percentage.toFixed(1)}%
                    </p>
                    <p className="text-[11px] text-slate-400">
                      ({gameSummary.detailedStats.faceoffs.wins}W-{gameSummary.detailedStats.faceoffs.losses}L)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Line Stats */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white md:text-lg">Line Performance</CardTitle>
                <CardDescription className="text-xs text-slate-400 md:text-sm">
                  with {gameSummary.lineStats.linemates.join(' & ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400 md:text-3xl">{gameSummary.lineStats.goalsFor}</p>
                    <p className="text-xs text-slate-400 md:text-sm">Goals For</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400 md:text-3xl">{gameSummary.lineStats.goalsAgainst}</p>
                    <p className="text-xs text-slate-400 md:text-sm">Goals Against</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400 md:text-3xl">{gameSummary.lineStats.shotsFor}</p>
                    <p className="text-xs text-slate-400 md:text-sm">Shots For</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-cyan-400 md:text-3xl">{gameSummary.lineStats.timeOnIce}</p>
                    <p className="text-xs text-slate-400 md:text-sm">TOI Together</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Badge variant="outline" className="border-green-500 bg-green-500/20 text-xs text-green-400">
                    Line Effectiveness: {gameSummary.lineStats.effectiveness.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coaching Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white md:text-lg">Coaching Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Strengths */}
                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white md:text-base">
                    <CheckCircle2 className="h-4 w-4 text-green-400 md:h-5 md:w-5" />
                    Strengths
                  </h3>
                  <ul className="space-y-1.5">
                    {gameSummary.coachingInsights.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 md:text-sm">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-400"></span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="border-t border-slate-700 pt-4">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white md:text-base">
                    <AlertCircle className="h-4 w-4 text-yellow-400 md:h-5 md:w-5" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-1.5">
                    {gameSummary.coachingInsights.areasForImprovement.map((area, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 md:text-sm">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400"></span>
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tactical Notes */}
                <div className="border-t border-slate-700 pt-4">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white md:text-base">
                    <Shield className="h-4 w-4 text-blue-400 md:h-5 md:w-5" />
                    Tactical Notes
                  </h3>
                  <ul className="space-y-1.5">
                    {gameSummary.coachingInsights.tacticalNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 md:text-sm">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"></span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Game Context */}
                <div className="border-t border-slate-700 pt-4">
                  <h3 className="mb-3 text-sm font-semibold text-white md:text-base">Game Context</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="mb-0.5 text-xs font-semibold text-slate-400">Significance:</p>
                      <p className="text-xs text-slate-300 md:text-sm">{gameSummary.gameContext.significance}</p>
                    </div>
                    <div>
                      <p className="mb-0.5 text-xs font-semibold text-slate-400">Player Role:</p>
                      <p className="text-xs text-slate-300 md:text-sm">{gameSummary.gameContext.playerRole}</p>
                    </div>
                    <div>
                      <p className="mb-0.5 text-xs font-semibold text-slate-400">Matchup Notes:</p>
                      <p className="text-xs text-slate-300 md:text-sm">{gameSummary.gameContext.matchupNotes}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-4">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white md:text-lg">Performance Comparisons</CardTitle>
                <CardDescription className="text-xs text-slate-400 md:text-sm">
                  How this game stacks up against team and league averages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {gameSummary.comparisons.map((comp, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white md:text-base">{comp.metric}</span>
                      <Badge variant="outline" className="border-slate-600 text-[11px] text-slate-300 md:text-xs">
                        {comp.percentile}th percentile
                      </Badge>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-2.5 text-center md:p-3">
                        <p className="text-[11px] text-slate-400">Player</p>
                        <p className="text-lg font-bold text-blue-400 md:text-xl">{comp.playerValue.toFixed(2)}</p>
                      </div>
                      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-2.5 text-center md:p-3">
                        <p className="text-[11px] text-slate-400">Team Avg</p>
                        <p className="text-lg font-bold text-slate-300 md:text-xl">{comp.teamAverage.toFixed(2)}</p>
                      </div>
                      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-2.5 text-center md:p-3">
                        <p className="text-[11px] text-slate-400">League Avg</p>
                        <p className="text-lg font-bold text-slate-300 md:text-xl">{comp.leagueAverage.toFixed(2)}</p>
                      </div>
                    </div>
                    <Progress value={comp.percentile} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
