'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/lib/mock-data/user-state';
import type { GameStats } from '@/lib/mock-data/players';
import { ArrowRight } from 'lucide-react';

interface RecentGamesTableProps {
  games: GameStats[];
  playerName: string;
}

export function RecentGamesTable({ games, playerName }: RecentGamesTableProps) {
  const router = useRouter();
  const selectedPlayer = useUserStore((state) => state.selectedPlayer);

  const handleViewSummary = (gameId: string) => {
    if (selectedPlayer) {
      router.push(`/game-summary/${selectedPlayer.id}/${gameId}`);
    }
  };

  return (
    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Recent Games</CardTitle>
        <CardDescription className="text-slate-400">
          Game history - click any row to view detailed AI summary
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-[500px] overflow-y-auto overflow-x-auto"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#475569 #1e293b'
          }}
        >
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-700/50">
                <TableHead className="text-slate-300">Date</TableHead>
                <TableHead className="text-slate-300">Opponent</TableHead>
                <TableHead className="text-slate-300">Result</TableHead>
                <TableHead className="text-center text-slate-300">G</TableHead>
                <TableHead className="text-center text-slate-300">A</TableHead>
                <TableHead className="text-center text-slate-300">Pts</TableHead>
                <TableHead className="text-center text-slate-300">SOG</TableHead>
                <TableHead className="text-center text-slate-300">+/-</TableHead>
                <TableHead className="text-center text-slate-300">Summary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow
                  key={game.id}
                  className="border-slate-700 hover:bg-slate-700/50"
                >
                  <TableCell className="font-medium text-white">
                    {new Date(game.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    vs {game.opponent}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`border-slate-600 ${
                          game.result === 'W'
                            ? 'bg-green-500/20 text-green-400'
                            : game.result === 'L'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {game.result}
                      </Badge>
                      <span className="text-sm text-slate-400">{game.score}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-semibold text-blue-400">
                    {game.goals}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-cyan-400">
                    {game.assists}
                  </TableCell>
                  <TableCell className="text-center font-bold text-purple-400">
                    {game.points}
                  </TableCell>
                  <TableCell className="text-center text-slate-300">
                    {game.shots}
                  </TableCell>
                  <TableCell
                    className={`text-center font-semibold ${
                      game.plusMinus > 0
                        ? 'text-green-400'
                        : game.plusMinus < 0
                        ? 'text-red-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {game.plusMinus > 0 ? `+${game.plusMinus}` : game.plusMinus}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSummary(game.id)}
                      className="group border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:border-blue-400 hover:text-blue-300 transition-all"
                    >
                      <span className="hidden sm:inline font-medium">View Summary</span>
                      <span className="sm:hidden font-medium">View</span>
                      <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
