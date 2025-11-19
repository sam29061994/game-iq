import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  trend: string;
  icon: LucideIcon;
  color: 'blue' | 'cyan' | 'purple' | 'green';
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  cyan: 'from-cyan-500 to-cyan-600',
  purple: 'from-purple-500 to-purple-600',
  green: 'from-green-500 to-green-600',
};

export function StatsCard({ title, value, subtitle, trend, icon: Icon, color }: StatsCardProps) {
  const isPositiveTrend = trend.startsWith('+');

  return (
    <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">
          {title}
        </CardTitle>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs text-slate-400">{subtitle}</p>
          <Badge
            variant="outline"
            className={`border-slate-600 text-xs ${
              isPositiveTrend ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
