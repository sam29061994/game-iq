'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/mock-data/user-state';

export default function Home() {
  const router = useRouter();
  const { selectedPlayer, userName } = useUserStore();

  useEffect(() => {
    // Redirect based on onboarding state
    if (selectedPlayer && userName) {
      router.push('/dashboard');
    } else if (userName) {
      router.push('/onboarding/select-player');
    } else {
      router.push('/onboarding');
    }
  }, [selectedPlayer, userName, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <p className="text-slate-300">Loading GameIQ...</p>
      </div>
    </div>
  );
}
