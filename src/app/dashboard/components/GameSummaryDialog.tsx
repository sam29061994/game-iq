'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { GameStats } from '@/lib/mock-data/players';
import { Calendar, Target, Trophy, TrendingUp, Activity } from 'lucide-react';

interface GameSummaryDialogProps {
  game: GameStats | null;
  playerName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameSummaryDialog({ game, playerName, open, onOpenChange }: GameSummaryDialogProps) {
  if (!game) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-700 bg-slate-800 text-white sm:max-w-[525px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Game Summary</DialogTitle>
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
              {game.result === 'W' ? 'Win' : game.result === 'L' ? 'Loss' : 'OT Loss'}
            </Badge>
          </div>
          <DialogDescription className="text-slate-400">
            <div className="mt-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(game.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score */}
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <div className="text-center">
              <p className="mb-2 text-sm text-slate-400">Final Score</p>
              <p className="text-3xl font-bold">
                vs {game.opponent} • {game.score}
              </p>
            </div>
          </div>

          {/* Player Stats */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-300">{playerName}'s Performance</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-center">
                <Target className="mx-auto mb-1 h-5 w-5 text-blue-400" />
                <p className="text-2xl font-bold text-blue-400">{game.goals}</p>
                <p className="text-xs text-slate-400">Goals</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-center">
                <Trophy className="mx-auto mb-1 h-5 w-5 text-cyan-400" />
                <p className="text-2xl font-bold text-cyan-400">{game.assists}</p>
                <p className="text-xs text-slate-400">Assists</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-center">
                <TrendingUp className="mx-auto mb-1 h-5 w-5 text-purple-400" />
                <p className="text-2xl font-bold text-purple-400">{game.points}</p>
                <p className="text-xs text-slate-400">Points</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-center">
                <Activity className="mx-auto mb-1 h-5 w-5 text-green-400" />
                <p className={`text-2xl font-bold ${game.plusMinus >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {game.plusMinus > 0 ? `+${game.plusMinus}` : game.plusMinus}
                </p>
                <p className="text-xs text-slate-400">+/-</p>
              </div>
            </div>
          </div>

          {/* AI-Generated Summary */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-slate-300">AI-Generated Summary</h3>
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-sm leading-relaxed text-slate-300">
                {game.gameSummary}
              </p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/50 p-3 text-sm">
            <span className="text-slate-400">Shots on Goal</span>
            <span className="font-semibold text-white">{game.shots}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
