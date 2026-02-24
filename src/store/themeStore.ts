import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ColorScheme } from '@/theme/semanticColors';

export type ThemeMode = ColorScheme | 'system';

type ThemeStore = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: (systemScheme: ColorScheme) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      themeMode: 'system',
      setThemeMode: (themeMode) => set({ themeMode }),
      toggleTheme: (systemScheme) => {
        const currentMode = get().themeMode;
        const resolvedMode = currentMode === 'system' ? systemScheme : currentMode;

        set({ themeMode: resolvedMode === 'dark' ? 'light' : 'dark' });
      },
    }),
    {
      name: 'habitra-theme-mode',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ themeMode: state.themeMode }),
    },
  ),
);
