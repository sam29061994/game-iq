'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { PerformanceDataPoint } from '@/lib/mock-data/players';

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
}

const chartConfig = {
  points: {
    label: 'Points',
    color: 'hsl(var(--chart-1))',
  },
  goals: {
    label: 'Goals',
    color: 'hsl(var(--chart-2))',
  },
  assists: {
    label: 'Assists',
    color: 'hsl(var(--chart-3))',
  },
};

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Performance Trend</CardTitle>
        <CardDescription className="text-slate-400">
          Points, goals, and assists over the last 12 games
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillPoints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillGoals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(6, 182, 212)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="rgb(6, 182, 212)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillAssists" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(168, 85, 247)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="rgb(168, 85, 247)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ stroke: '#475569', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="assists"
              stroke="rgb(168, 85, 247)"
              fill="url(#fillAssists)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="goals"
              stroke="rgb(6, 182, 212)"
              fill="url(#fillGoals)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="points"
              stroke="rgb(59, 130, 246)"
              fill="url(#fillPoints)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
