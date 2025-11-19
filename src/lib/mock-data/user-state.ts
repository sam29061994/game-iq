'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlayerProfile } from './players';

interface UserState {
  userName: string | null;
  selectedPlayer: PlayerProfile | null;
  isGameSimulating: boolean;
  notificationsEnabled: boolean;
  setUserName: (name: string) => void;
  setSelectedPlayer: (player: PlayerProfile) => void;
  setGameSimulating: (simulating: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: null,
      selectedPlayer: null,
      isGameSimulating: false,
      notificationsEnabled: false,
      setUserName: (name) => set({ userName: name }),
      setSelectedPlayer: (player) => set({ selectedPlayer: player }),
      setGameSimulating: (simulating) => set({ isGameSimulating: simulating }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      clearUser: () => set({ userName: null, selectedPlayer: null, isGameSimulating: false }),
    }),
    {
      name: 'gameiq-user-storage',
    }
  )
);
