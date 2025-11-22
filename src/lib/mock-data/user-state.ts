'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayerProfile } from './players';

export type RelationshipType = 'family' | 'friends' | 'scout' | 'player';

interface GoogleAuth {
  email?: string;
  photoUrl?: string;
  name?: string;
}

interface UserState {
  userName: string | null;
  selectedPlayer: PlayerProfile | null;
  relationshipType: RelationshipType | null;
  onboardingComplete: boolean;
  googleAuth: GoogleAuth | null;
  isGameSimulating: boolean;
  notificationsEnabled: boolean;
  _hasHydrated: boolean;
  setUserName: (name: string) => void;
  setSelectedPlayer: (player: PlayerProfile) => void;
  setRelationshipType: (type: RelationshipType) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setGoogleAuth: (auth: GoogleAuth | null) => void;
  setGameSimulating: (simulating: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: null,
      selectedPlayer: null,
      relationshipType: null,
      onboardingComplete: false,
      googleAuth: null,
      isGameSimulating: false,
      notificationsEnabled: false,
      _hasHydrated: false,
      setUserName: (name) => set({ userName: name }),
      setSelectedPlayer: (player) => set({ selectedPlayer: player }),
      setRelationshipType: (type) => set({ relationshipType: type }),
      setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),
      setGoogleAuth: (auth) => set({ googleAuth: auth }),
      setGameSimulating: (simulating) => set({ isGameSimulating: simulating }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setHasHydrated: (hasHydrated) => set({ _hasHydrated: hasHydrated }),
      clearUser: () => set({
        userName: null,
        selectedPlayer: null,
        relationshipType: null,
        onboardingComplete: false,
        googleAuth: null,
        isGameSimulating: false
      }),
    }),
    {
      name: 'gameiq-user-storage',
      partialize: (state) => ({
        userName: state.userName,
        selectedPlayer: state.selectedPlayer,
        relationshipType: state.relationshipType,
        onboardingComplete: state.onboardingComplete,
        googleAuth: state.googleAuth,
        notificationsEnabled: state.notificationsEnabled,
        // isGameSimulating is excluded - will not persist across refreshes
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      skipHydration: typeof window === 'undefined',
    }
  )
);
