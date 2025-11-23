'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/lib/mock-data/user-state';

export default function Home() {
  const router = useRouter();
  const { onboardingComplete } = useUserStore();

  useEffect(() => {
    // Redirect based on onboarding completion flag
    if (onboardingComplete) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  }, [onboardingComplete, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <p className="text-slate-300">Loading GameSheet IQ...</p>
      </div>
    </div>
  );
}
