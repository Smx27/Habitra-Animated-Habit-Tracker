import { createContext, useContext, useEffect, useMemo, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';
import { useSharedValue, withTiming, type SharedValue } from 'react-native-reanimated';

import { useThemeStore } from '@/store/themeStore';
import { radius } from '@/theme/radius';
import { semanticColors, palettesByScheme, type ColorScheme } from '@/theme/semanticColors';
import { shadows } from '@/theme/shadows';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

type ThemeTokens = {
  scheme: ColorScheme;
  color: (typeof semanticColors)[ColorScheme];
  palette: (typeof palettesByScheme)[ColorScheme];
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadows: typeof shadows;
  themeMode: 'system' | ColorScheme;
  toggleTheme: () => void;
  themeProgress: SharedValue<number>;
};

const ThemeContext = createContext<ThemeTokens | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const systemScheme: ColorScheme = colorScheme === 'light' ? 'light' : 'dark';
  const themeMode = useThemeStore((state) => state.themeMode);
  const toggleThemeInStore = useThemeStore((state) => state.toggleTheme);
  const themeProgress = useSharedValue(systemScheme === 'dark' ? 1 : 0);

  const scheme: ColorScheme = themeMode === 'system' ? systemScheme : themeMode;

  useEffect(() => {
    themeProgress.value = withTiming(scheme === 'dark' ? 1 : 0, {
      duration: 420,
    });
  }, [scheme, themeProgress]);

  const value = useMemo<ThemeTokens>(
    () => ({
      scheme,
      color: semanticColors[scheme],
      palette: palettesByScheme[scheme],
      spacing,
      radius,
      typography,
      shadows,
      themeMode,
      toggleTheme: () => toggleThemeInStore(systemScheme),
      themeProgress,
    }),
    [scheme, themeMode, toggleThemeInStore, systemScheme, themeProgress],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeTokens() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeTokens must be used within ThemeProvider.');
  }

  return context;
}
