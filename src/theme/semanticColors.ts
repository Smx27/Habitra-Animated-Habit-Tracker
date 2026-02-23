import { darkPalette, lightPalette, type ThemePalette } from '@/theme/palettes';

export type ColorScheme = 'light' | 'dark';

export const semanticColors = {
  light: {
    backgroundClass: 'bg-slate-50',
    surfaceClass: 'bg-slate-100',
    cardBackgroundClass: 'bg-white/80',
    textPrimaryClass: 'text-slate-900',
    textMutedClass: 'text-slate-600',
    actionPrimaryClass: 'bg-emerald-500',
    actionPrimaryTextClass: 'text-emerald-950',
    statusBarStyle: 'dark' as const,
  },
  dark: {
    backgroundClass: 'bg-slate-950',
    surfaceClass: 'bg-slate-900',
    cardBackgroundClass: 'bg-slate-950/70',
    textPrimaryClass: 'text-slate-50',
    textMutedClass: 'text-slate-300',
    actionPrimaryClass: 'bg-emerald-400',
    actionPrimaryTextClass: 'text-emerald-950',
    statusBarStyle: 'light' as const,
  },
} as const;

export const palettesByScheme: Record<ColorScheme, ThemePalette> = {
  light: lightPalette,
  dark: darkPalette,
};
