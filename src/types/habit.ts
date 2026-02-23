export type Habit = {
  id: string;
  title: string;
  icon?: string;
  color?: string;
  completedToday: boolean;
};

export type AddHabitPayload = {
  title: string;
  icon?: string;
  color?: string;
};

export type HabitState = {
  habits: Habit[];
};

export type HabitActions = {
  toggleHabitCompletion: (id: Habit['id']) => void;
  addHabit: (payload: AddHabitPayload) => void;
  reorderHabits: (fromIndex: number, toIndex: number) => void;
  resetHabits: () => void;
};

export type HabitStore = HabitState & HabitActions;

export function getCompletedCount(habits: Habit[]): number {
  return habits.filter((habit) => habit.completedToday).length;
}

export function getCompletionPercent(habits: Habit[]): number {
  if (habits.length === 0) {
    return 0;
  }

  return getCompletedCount(habits) / habits.length;
}
