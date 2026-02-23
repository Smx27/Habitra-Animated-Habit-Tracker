export const theme = {
  color: {
    background: 'bg-slate-900',
    cardBackground: 'bg-slate-950/70',
    textPrimary: 'text-slate-50',
    textMuted: 'text-slate-300',
    actionPrimary: 'bg-emerald-500',
    actionPrimaryText: 'text-slate-950',
  },
  radius: {
    card: 'rounded-2xl',
    button: 'rounded-xl',
  },
  spacing: {
    screenX: 'px-6',
  },
} as const;

export type Theme = typeof theme;
