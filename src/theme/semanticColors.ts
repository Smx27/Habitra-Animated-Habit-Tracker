import { darkPalette, lightPalette, type ThemePalette } from '@/theme/palettes';

export type ColorScheme = 'light' | 'dark';

export const semanticColors = {
  light: {
    backgroundClass: 'bg-indigo-50',
    surfaceClass: 'bg-white/70',
    cardBackgroundClass: 'bg-white/70',
    textPrimaryClass: 'text-slate-900',
    textMutedClass: 'text-slate-600',
    actionPrimaryClass: 'bg-indigo-500',
    actionPrimaryTextClass: 'text-indigo-50',
    accentClass: 'bg-cyan-400',
    statusBarStyle: 'dark' as const,
  },
  dark: {
    backgroundClass: 'bg-slate-950',
    surfaceClass: 'bg-slate-900/70',
    cardBackgroundClass: 'bg-slate-900/70',
    textPrimaryClass: 'text-slate-50',
    textMutedClass: 'text-slate-400',
    actionPrimaryClass: 'bg-indigo-400',
    actionPrimaryTextClass: 'text-slate-950',
    accentClass: 'bg-cyan-300',
    statusBarStyle: 'light' as const,
  },
} as const;

export const palettesByScheme: Record<ColorScheme, ThemePalette> = {
  light: lightPalette,
  dark: darkPalette,
};
