export type HabitState = {
  completedToday: number;
};

export type HabitActions = {
  incrementCompletedToday: () => void;
  resetCompletedToday: () => void;
};

export type HabitStore = HabitState & HabitActions;
