'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, FileText, ArrowLeft } from 'lucide-react';

interface DashboardHeaderProps {
  currentPage?: 'dashboard' | 'summary';
  onBack?: () => void;
}

export function DashboardHeader({ currentPage = 'dashboard', onBack }: DashboardHeaderProps) {
  const router = useRouter();

  return (
    <header className="flex-shrink-0 border-b border-slate-700/50 bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-slate-900/50">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Left side - Logo and title */}
          <div className="flex items-center gap-4">
            {currentPage === 'summary' && onBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-slate-400 hover:text-white hover:bg-slate-800 h-10 w-10 p-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => router.push('/dashboard')}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 relative transition-transform group-hover:scale-105">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-30 blur-md animate-pulse"></div>
                <svg
                  className="h-6 w-6 text-white relative z-10"
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
              <div>
                <h1 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">GameIQ</h1>
                <p className="text-xs text-slate-400">Real-time Player Insights</p>
              </div>
            </div>
          </div>

          {/* Right side - Navigation */}
          <div className="flex items-center gap-3">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute h-2 w-2 rounded-full bg-blue-500 animate-ping opacity-75"></div>
              <div className="relative h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
            </div>
            <Badge
              variant="outline"
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                currentPage === 'dashboard'
                  ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                  : 'border-slate-600 bg-slate-800/50 text-slate-300'
              }`}
            >
              {currentPage === 'dashboard' ? (
                <>
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Game Summary
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>
    </header>
  );
}
