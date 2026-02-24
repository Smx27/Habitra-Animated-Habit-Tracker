export type HabitCategory = 'health' | 'mindfulness' | 'learning' | 'productivity' | 'wellness';

export const HABIT_CATEGORY_COLORS: Record<HabitCategory, { background: string; text: string; accent: string }> = {
  health: { background: '#dcfce7', text: '#166534', accent: '#22c55e' },
  mindfulness: { background: '#ede9fe', text: '#5b21b6', accent: '#8b5cf6' },
  learning: { background: '#fef3c7', text: '#92400e', accent: '#f59e0b' },
  productivity: { background: '#dbeafe', text: '#1d4ed8', accent: '#3b82f6' },
  wellness: { background: '#cffafe', text: '#155e75', accent: '#06b6d4' },
};

export type Habit = {
  id: string;
  title: string;
  icon?: string;
  category: HabitCategory;
  streak: number;
  accentColor?: string;
  completedToday: boolean;
};

export type AddHabitPayload = {
  title: string;
  icon: string;
  accentColor: string;
  category?: HabitCategory;
};

export type HabitState = {
  habits: Habit[];
};

export type HabitActions = {
  toggleHabitCompletion: (id: Habit['id']) => HabitCompletionTransition | null;
  addHabit: (payload: AddHabitPayload) => void;
  reorderHabits: (fromIndex: number, toIndex: number) => void;
  resetHabits: () => void;
};

export type HabitStore = HabitState & HabitActions;

export type HabitCompletionTransition = {
  habitId: Habit['id'];
  wasCompletedToday: boolean;
  isCompletedToday: boolean;
  previousStreak: number;
  newStreak: number;
};

export function getCompletedCount(habits: Habit[]): number {
  return habits.filter((habit) => habit.completedToday).length;
}

export function getCompletionPercent(habits: Habit[]): number {
  if (habits.length === 0) {
    return 0;
  }

  return getCompletedCount(habits) / habits.length;
}
