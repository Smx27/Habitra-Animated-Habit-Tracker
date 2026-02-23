import { create } from 'zustand';

type HabitState = {
  completedToday: number;
  incrementCompletedToday: () => void;
};

export const useHabitStore = create<HabitState>((set) => ({
  completedToday: 0,
  incrementCompletedToday: () =>
    set((state) => ({
      completedToday: state.completedToday + 1,
    })),
}));
