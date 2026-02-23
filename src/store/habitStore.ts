import { create } from 'zustand';

import type { HabitStore } from '@/types/habit';

const initialState = {
  completedToday: 0,
};

export const useHabitStore = create<HabitStore>((set) => ({
  ...initialState,
  incrementCompletedToday: () =>
    set((state) => ({
      completedToday: state.completedToday + 1,
    })),
  resetCompletedToday: () => set(initialState),
}));
