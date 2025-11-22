'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useUserStore, type RelationshipType } from '@/lib/mock-data/user-state';
import { cn } from '@/lib/utils';
import { Users, UserPlus, Search, User } from 'lucide-react';

const relationshipOptions = [
  {
    type: 'family' as RelationshipType,
    icon: Users,
    title: 'Family',
    description: 'Parent, sibling, or relative',
  },
  {
    type: 'friends' as RelationshipType,
    icon: UserPlus,
    title: 'Friends',
    description: 'Friend or supporter',
  },
  {
    type: 'scout' as RelationshipType,
    icon: Search,
    title: 'Scout',
    description: 'Recruiter or talent scout',
  },
  {
    type: 'player' as RelationshipType,
    icon: User,
    title: 'I am the player',
    description: 'Tracking my own performance',
  },
];

export default function UserInfoPage() {
  const router = useRouter();
  const { googleAuth, setUserName, setRelationshipType } = useUserStore();
  const [name, setName] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState<RelationshipType | null>(null);

  useEffect(() => {
    // Redirect if no auth data
    if (!googleAuth) {
      router.push('/onboarding');
    } else if (googleAuth.name) {
      setName(googleAuth.name);
    }
  }, [googleAuth, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim() && selectedRelationship) {
      setUserName(name.trim());
      setRelationshipType(selectedRelationship);
      router.push('/onboarding/select-player');
    }
  };

  if (!googleAuth) {
    return null;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-2xl">
        <div className="flex flex-col gap-6">
          {/* GameIQ Branding Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500">
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
            <h1 className="text-2xl md:text-3xl font-bold text-white">GameIQ</h1>
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center text-xs font-medium">
                  1
                </div>
                <span className="font-medium text-white">Your Info</span>
              </div>
              <div className="h-px w-8 md:w-12 bg-slate-600"></div>
              <div className="flex items-center gap-2 opacity-50">
                <div className="h-8 w-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-xs font-medium text-slate-400">
                  2
                </div>
                <span className="text-slate-400 hidden sm:inline">Select Player</span>
                <span className="text-slate-400 sm:hidden">Player</span>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden p-0 border-2 border-slate-700 bg-slate-900/80 backdrop-blur-sm relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-lg opacity-15 blur group-hover:opacity-25 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95">
            <CardContent className="p-6 md:p-8 bg-slate-900/40">
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <div className="text-center space-y-2 mb-6">
                    <h1 className="text-2xl font-bold text-white">Tell us about yourself</h1>
                    <p className="text-slate-300 text-sm">
                      Help us personalize your experience
                    </p>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="name" className="text-slate-200">Your Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-400"
                      required
                    />
                    <FieldDescription className="text-slate-400">
                      This is how we'll address you in the app
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel className="text-slate-200">Your Relationship</FieldLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {relationshipOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.type}
                            type="button"
                            onClick={() => setSelectedRelationship(option.type)}
                            className={cn(
                              'relative flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all',
                              selectedRelationship === option.type
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-600 hover:bg-slate-700/50'
                            )}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center transition-all",
                                selectedRelationship === option.type
                                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                  : 'bg-slate-700'
                              )}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-white">{option.title}</div>
                                <div className="text-xs text-slate-400">
                                  {option.description}
                                </div>
                              </div>
                              {selectedRelationship === option.type && (
                                <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                                  <svg
                                    className="h-3 w-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <FieldDescription className="text-slate-400">
                      Select your relationship to the player you'll be tracking
                    </FieldDescription>
                  </Field>

                  <Field>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600"
                      disabled={!name.trim() || !selectedRelationship}
                    >
                      Continue to Player Selection
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
