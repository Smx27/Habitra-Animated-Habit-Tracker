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
