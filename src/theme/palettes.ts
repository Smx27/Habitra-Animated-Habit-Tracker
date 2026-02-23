export type ThemePalette = {
  surface: string;
  surfaceMuted: string;
  card: string;
  textPrimary: string;
  textMuted: string;
  actionPrimary: string;
  actionPrimaryText: string;
  orbCore: string;
};

export const lightPalette: ThemePalette = {
  surface: '#f8fafc',
  surfaceMuted: '#e2e8f0',
  card: '#ffffff',
  textPrimary: '#0f172a',
  textMuted: '#475569',
  actionPrimary: '#10b981',
  actionPrimaryText: '#052e16',
  orbCore: '#10b981',
};

export const darkPalette: ThemePalette = {
  surface: '#020617',
  surfaceMuted: '#0f172a',
  card: '#020617',
  textPrimary: '#f8fafc',
  textMuted: '#cbd5e1',
  actionPrimary: '#34d399',
  actionPrimaryText: '#022c22',
  orbCore: '#34d399',
};
