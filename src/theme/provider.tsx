import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import { useColorScheme } from 'react-native';

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
};

const ThemeContext = createContext<ThemeTokens | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const scheme: ColorScheme = colorScheme === 'light' ? 'light' : 'dark';

  const value = useMemo<ThemeTokens>(
    () => ({
      scheme,
      color: semanticColors[scheme],
      palette: palettesByScheme[scheme],
      spacing,
      radius,
      typography,
      shadows,
    }),
    [scheme],
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
