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

        {/* Game Summary */}
        <Card className="mb-6 border-slate-700 bg-slate-800/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-white md:text-lg">
              <Lightbulb className="h-4 w-4 text-yellow-400 md:h-5 md:w-5" />
              Game Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-slate-300 md:text-base">
              {gameSummary.overallSummary}
            </p>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs defaultValue="periods" className="space-y-5">
          <div className="overflow-x-auto rounded-md border border-slate-700/50 bg-slate-800/30 p-1.5"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#475569 #1e293b'
            }}>
            <TabsList className="w-full inline-flex gap-1.5 bg-transparent p-0 min-w-max">
                <TabsTrigger
                  value="periods"
                  className="rounded px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-800/50 data-[state=inactive]:hover:text-white"
                >
                  Periods
                </TabsTrigger>
                <TabsTrigger
                  value="moments"
                  className="rounded px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-800/50 data-[state=inactive]:hover:text-white"
                >
                  Moments
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="rounded px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-800/50 data-[state=inactive]:hover:text-white"
                >
                  Stats
                </TabsTrigger>
                <TabsTrigger
                  value="insights"
                  className="rounded px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-800/50 data-[state=inactive]:hover:text-white"
                >
                  Insights
                </TabsTrigger>
                <TabsTrigger
                  value="comparison"
                  className="rounded px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:bg-slate-800/50 data-[state=inactive]:hover:text-white whitespace-nowrap"
                >
                  Comparisons
                </TabsTrigger>
              </TabsList>
          </div>

          {/* Period Breakdown Tab */}
          <TabsContent value="periods" className="space-y-4">
            {gameSummary.periodBreakdowns.map((period) => (
              <Card key={period.period} className="border-slate-700 bg-slate-800/50">
                <CardHeader className="pb-4 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xl font-bold text-white">
                        {period.period}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">Period {period.period}</CardTitle>
                        <CardDescription className="text-sm text-slate-400">
                          {period.timeOnIce} TOI • {period.shifts} shifts
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-sm font-semibold ${period.plusMinus >= 0 ? 'border-green-500/50 bg-green-500/10 text-green-400' : 'border-red-500/50 bg-red-500/10 text-red-400'}`}
                    >
                      {period.plusMinus >= 0 ? '+' : ''}{period.plusMinus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
                    <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-center hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors">
                      <p className="text-2xl font-bold text-blue-400">{period.goals}</p>
                      <p className="text-xs text-slate-400 mt-1">Goals</p>
                    </div>
                    <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-center hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-colors">
                      <p className="text-2xl font-bold text-cyan-400">{period.assists}</p>
                      <p className="text-xs text-slate-400 mt-1">Assists</p>
                    </div>
                    <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-center hover:border-purple-500/50 hover:bg-purple-500/5 transition-colors">
                      <p className="text-2xl font-bold text-purple-400">{period.shots}</p>
                      <p className="text-xs text-slate-400 mt-1">Shots</p>
                    </div>
                    <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-center hover:border-green-500/50 hover:bg-green-500/5 transition-colors">
                      <p className="text-2xl font-bold text-green-400">{period.hits}</p>
                      <p className="text-xs text-slate-400 mt-1">Hits</p>
                    </div>
                    <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-center hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-colors">
                      <p className="text-2xl font-bold text-yellow-400">{period.blocks}</p>
                      <p className="text-xs text-slate-400 mt-1">Blocks</p>
                    </div>
                    <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-center hover:border-orange-500/50 hover:bg-orange-500/5 transition-colors">
                      <p className="text-2xl font-bold text-orange-400">{period.faceoffWins}</p>
                      <p className="text-xs text-slate-400 mt-1">FO W</p>
                    </div>
                    <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-center hover:border-slate-500/50 hover:bg-slate-700/10 transition-colors">
                      <p className="text-2xl font-bold text-slate-300">{period.faceoffLosses}</p>
                      <p className="text-xs text-slate-400 mt-1">FO L</p>
                    </div>
                  </div>

                  {/* Highlights */}
                  {period.highlights.length > 0 && (
                    <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <h4 className="text-sm font-semibold text-white">Highlights</h4>
                      </div>
                      <ul className="space-y-2">
                        {period.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
            {/* Strengths */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-3 border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                  </div>
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {gameSummary.coachingInsights.strengths.map((strength, idx) => (
                    <li key={idx} className="flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/5 p-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-200 leading-relaxed">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-3 border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                  </div>
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {gameSummary.coachingInsights.areasForImprovement.map((area, idx) => (
                    <li key={idx} className="flex items-start gap-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3">
                      <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-200 leading-relaxed">{area}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Tactical Notes */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-3 border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                    <Shield className="h-4 w-4 text-blue-400" />
                  </div>
                  Tactical Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-3">
                  {gameSummary.coachingInsights.tacticalNotes.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                      <Shield className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-200 leading-relaxed">{note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Game Context */}
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-3 border-b border-slate-700/50">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20">
                    <Lightbulb className="h-4 w-4 text-purple-400" />
                  </div>
                  Game Context
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                    <p className="mb-2 text-xs font-semibold text-slate-400">Significance</p>
                    <p className="text-sm text-slate-200 leading-relaxed">{gameSummary.gameContext.significance}</p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                    <p className="mb-2 text-xs font-semibold text-slate-400">Player Role</p>
                    <p className="text-sm text-slate-200 leading-relaxed">{gameSummary.gameContext.playerRole}</p>
                  </div>
                  <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4 sm:col-span-3 lg:col-span-1">
                    <p className="mb-2 text-xs font-semibold text-slate-400">Matchup Notes</p>
                    <p className="text-sm text-slate-200 leading-relaxed">{gameSummary.gameContext.matchupNotes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-4">
            {gameSummary.comparisons.map((comp, idx) => {
              const getGradientColor = (percentile: number) => {
                if (percentile >= 75) return 'from-green-500 to-emerald-500';
                if (percentile >= 50) return 'from-blue-500 to-cyan-500';
                if (percentile >= 25) return 'from-yellow-500 to-orange-500';
                return 'from-red-500 to-rose-500';
              };

              return (
                <Card key={idx} className="border-slate-700 bg-slate-800/50">
                  <CardHeader className="pb-3 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base text-white md:text-lg">{comp.metric}</CardTitle>
                      <Badge variant="outline" className="border-blue-500/50 bg-blue-500/10 text-blue-400 text-xs font-semibold">
                        {comp.percentile}th percentile
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="grid gap-3 grid-cols-3">
                      <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-4 text-center">
                        <p className="text-xs text-slate-400 mb-1">Player</p>
                        <p className="text-2xl font-bold text-blue-400">{comp.playerValue.toFixed(2)}</p>
                      </div>
                      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4 text-center">
                        <p className="text-xs text-slate-400 mb-1">Team Avg</p>
                        <p className="text-2xl font-bold text-slate-300">{comp.teamAverage.toFixed(2)}</p>
                      </div>
                      <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4 text-center">
                        <p className="text-xs text-slate-400 mb-1">League Avg</p>
                        <p className="text-2xl font-bold text-slate-300">{comp.leagueAverage.toFixed(2)}</p>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                        <span>Below Average</span>
                        <span>Above Average</span>
                      </div>
                      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-700/50">
                        <div
                          className={`h-full bg-gradient-to-r ${getGradientColor(comp.percentile)} transition-all`}
                          style={{ width: `${comp.percentile}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
