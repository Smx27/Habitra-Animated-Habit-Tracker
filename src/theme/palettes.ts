export type ThemePalette = {
  primary: string;
  accent: string;
  background: string;
  card: string;
  textPrimary: string;
  textMuted: string;
  actionPrimary: string;
  actionPrimaryText: string;
  orbCore: string;
  ringTrack: string;
  ringProgress: string;
};

export const lightPalette: ThemePalette = {
  primary: '#6366F1',
  accent: '#22D3EE',
  background: '#EEF2FF',
  card: '#FFFFFFCC',
  textPrimary: '#0F172A',
  textMuted: '#475569',
  actionPrimary: '#6366F1',
  actionPrimaryText: '#EEF2FF',
  orbCore: '#6366F1',
  ringTrack: '#CBD5E1',
  ringProgress: '#4F46E5',
};

export const darkPalette: ThemePalette = {
  primary: '#818CF8',
  accent: '#67E8F9',
  background: '#020617',
  card: '#0F172AB3',
  textPrimary: '#F8FAFC',
  textMuted: '#94A3B8',
  actionPrimary: '#818CF8',
  actionPrimaryText: '#0B1120',
  orbCore: '#818CF8',
  ringTrack: '#334155',
  ringProgress: '#A5B4FC',
};
