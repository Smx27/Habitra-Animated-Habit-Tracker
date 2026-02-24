import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ColorScheme } from '@/theme/semanticColors';

export type ThemeMode = ColorScheme | 'system';

type ThemeStore = {
  themeMode: ThemeMode;
  hasSeenOnboarding: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: (systemScheme: ColorScheme) => void;
  completeOnboarding: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themeMode: 'dark',
      hasSeenOnboarding: false,
      setThemeMode: (themeMode) => set({ themeMode }),
      toggleTheme: (systemScheme) => {
        const currentMode = get().themeMode;

        if (currentMode === 'dark') {
          set({ themeMode: 'light' });
          return;
        }

        if (currentMode === 'light') {
          set({ themeMode: 'dark' });
          return;
        }

        set({ themeMode: systemScheme === 'dark' ? 'light' : 'dark' });
      },
      completeOnboarding: () => set({ hasSeenOnboarding: true }),
    }),
    {
      name: 'habitra-theme-mode',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ themeMode: state.themeMode, hasSeenOnboarding: state.hasSeenOnboarding }),
    },
  ),
);
