'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/lib/mock-data/user-state';
import { Activity } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { setGoogleAuth } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (email.trim() && password.trim() && password === confirmPassword) {
      // Mimic authentication
      setGoogleAuth({
        email: email.trim(),
        name: email.split('@')[0],
      });
      router.push('/onboarding/user-info');
    }
  };

  const handleGoogleSignIn = () => {
    // Mimic Google sign-in
    const mockGoogleUser = {
      email: 'demo@gameiq.com',
      name: 'Demo User',
      photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    };
    setGoogleAuth(mockGoogleUser);
    router.push('/onboarding/user-info');
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-sm md:max-w-4xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden p-0 border-2 border-slate-700 bg-slate-900/80 backdrop-blur-sm relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-lg opacity-15 blur group-hover:opacity-25 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form onSubmit={handleSubmit} className="p-6 md:p-8 bg-slate-900/40">
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-2">
                      <svg
                        className="h-8 w-8 text-white"
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
                    <h1 className="text-2xl font-bold text-white">Welcome to GameIQ</h1>
                    <p className="text-slate-300 text-sm text-balance">
                      Track your favorite player's performance in real-time
                    </p>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="email" className="text-slate-200">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-400"
                      required
                    />
                    <FieldDescription className="text-slate-400">
                      We'll use this to identify your account
                    </FieldDescription>
                  </Field>
                  <Field>
                    <Field className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="password" className="text-slate-200">Password</FieldLabel>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-400"
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="confirm-password" className="text-slate-200">
                          Confirm Password
                        </FieldLabel>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-400"
                          required
                        />
                      </Field>
                    </Field>
                    <FieldDescription className="text-slate-400">
                      Must be at least 8 characters long
                    </FieldDescription>
                  </Field>
                  <Field>
                    <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600">
                      Create Account
                    </Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-slate-800 text-slate-400">
                    Or continue with
                  </FieldSeparator>
                  <Field className="grid gap-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="w-full border-slate-600 bg-transparent text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="ml-2">Sign in with Google</span>
                    </Button>
                  </Field>
                  <FieldDescription className="text-center text-slate-400">
                    This is a demo app with mock authentication
                  </FieldDescription>
                </FieldGroup>
              </form>
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative hidden md:flex flex-col items-center justify-center p-8">
                <div className="space-y-6 max-w-md">
                  <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-white leading-tight">
                      Every Goal. Every Moment. Every Story.
                    </h2>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Built on Gamesheet's 1.2M games across 1,000+ leagues. AI-powered insights for parents, players, and scouts.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-700">
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-3">What You Get</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="relative inline-flex items-center justify-center mt-2 flex-shrink-0">
                            <div className="absolute h-2.5 w-2.5 rounded-full bg-blue-500 animate-ping opacity-75"></div>
                            <div className="relative h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            <span className="text-slate-300 font-medium">Live notifications:</span> Know the instant they score—even from miles away
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="relative inline-flex items-center justify-center mt-2 flex-shrink-0">
                            <div className="absolute h-2.5 w-2.5 rounded-full bg-blue-500 animate-ping opacity-75"></div>
                            <div className="relative h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            <span className="text-slate-300 font-medium">Smart context:</span> "Career-high 2 goals, now #3 in division"—not just stats, stories
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="relative inline-flex items-center justify-center mt-2 flex-shrink-0">
                            <div className="absolute h-2.5 w-2.5 rounded-full bg-blue-500 animate-ping opacity-75"></div>
                            <div className="relative h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            <span className="text-slate-300 font-medium">Share-worthy summaries:</span> Beautiful game recaps made for celebrating
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="relative inline-flex items-center justify-center mt-2 flex-shrink-0">
                            <div className="absolute h-2.5 w-2.5 rounded-full bg-blue-500 animate-ping opacity-75"></div>
                            <div className="relative h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            <span className="text-slate-300 font-medium">Scout-ready profiles:</span> Help recruiters discover tomorrow's talent today
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-500 italic">
                      "Like Instagram Stories for hockey stats"—turning numbers into moments worth sharing
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            </div>
          </Card>
          <FieldDescription className="px-6 text-center text-slate-400">
            By clicking continue, you agree to our Terms of Service and Privacy Policy.
          </FieldDescription>
        </div>
      </div>
    </div>
  );
}
