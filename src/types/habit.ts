export type Habit = {
  id: string;
  title: string;
  color: string;
  completedDates: string[];
  createdAt: Date;
};

export type AddHabitPayload = {
  title: string;
  color: string;
};

export type HabitState = {
  habits: Habit[];
};

export type HabitActions = {
  toggleHabitCompletion: (id: Habit['id']) => HabitCompletionTransition | null;
  addHabit: (payload: AddHabitPayload) => void;
  getDailyProgress: (date?: string) => { completed: number; total: number; percent: number };
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
  const today = new Date().toISOString().split('T')[0];
  return habits.filter((habit) => habit.completedDates.includes(today)).length;
}

export function getCompletionPercent(habits: Habit[]): number {
  if (habits.length === 0) {
    return 0;
  }

  return getCompletedCount(habits) / habits.length;
}

export function getDailyProgress(habits: Habit[], date = new Date().toISOString().split('T')[0]): {
  completed: number;
  total: number;
  percent: number;
} {
  const total = habits.length;
  const completed = habits.filter((habit) => habit.completedDates.includes(date)).length;

  return {
    completed,
    total,
    percent: total === 0 ? 0 : completed / total,
  };
}
