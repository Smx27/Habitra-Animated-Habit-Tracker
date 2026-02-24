import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { calculateCurrentStreak, isCompletedOnDate, toggleCompletionForDate } from '@/features/habits/utils/streak';
import type { Habit, HabitCompletionTransition, HabitStore } from '@/types/habit';
import { getDailyProgress as computeDailyProgress } from '@/features/habits/utils/progress';

const HABIT_STORE_VERSION = 1;
const HABIT_STORE_KEY = 'habitra-habits-v1';

const getTodayISODate = () => new Date().toISOString().split('T')[0];

const getDateOffsetISO = (daysOffset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

const initialHabits: Habit[] = [
  {
    id: 'morning-stretch',
    title: 'Morning stretch',
    color: '#8b5cf6',
    completedDates: [getDateOffsetISO(-5), getDateOffsetISO(-4), getDateOffsetISO(-3), getDateOffsetISO(-2), getDateOffsetISO(-1), getDateOffsetISO(0)],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'drink-water',
    title: 'Drink water',
    color: '#06b6d4',
    completedDates: [getDateOffsetISO(-3), getDateOffsetISO(-2), getDateOffsetISO(-1)],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'read-10-minutes',
    title: 'Read 10 minutes',
    color: '#f59e0b',
    completedDates: [getDateOffsetISO(-8), getDateOffsetISO(-7), getDateOffsetISO(-6), getDateOffsetISO(-5), getDateOffsetISO(-4)],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'evening-review',
    title: 'Evening review',
    color: '#3b82f6',
    completedDates: [getDateOffsetISO(-6), getDateOffsetISO(-5), getDateOffsetISO(-4), getDateOffsetISO(-3), getDateOffsetISO(-2), getDateOffsetISO(-1), getDateOffsetISO(0)],
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },
];

const initialState = {
  habits: initialHabits,
};

type PersistedHabitState = {
  habits: Array<Omit<Habit, 'createdAt'> & { createdAt: string }>;
};

const reviveHabitDates = (state: PersistedHabitState | undefined): Pick<HabitStore, 'habits'> => ({
  habits:
    state?.habits.map((habit) => ({
      ...habit,
      createdAt: new Date(habit.createdAt),
    })) ?? initialState.habits,
});

export const useHabitStore = create<HabitStore>()(
  persist(
    (set) => ({
      ...initialState,
      toggleHabitCompletion: (id) => {
        const currentHabits = useHabitStore.getState().habits;
        const targetHabit = currentHabits.find((habit) => habit.id === id);

        if (!targetHabit) {
          return null;
        }

        const today = getTodayISODate();
        const wasCompletedToday = isCompletedOnDate(targetHabit, today);
        const previousStreak = calculateCurrentStreak(targetHabit.completedDates, today);
        const updatedHabit = toggleCompletionForDate(targetHabit, today);
        const isCompletedToday = isCompletedOnDate(updatedHabit, today);
        const newStreak = calculateCurrentStreak(updatedHabit.completedDates, today);

        const transition: HabitCompletionTransition = {
          habitId: id,
          wasCompletedToday,
          isCompletedToday,
          previousStreak,
          newStreak,
        };

        set((state: HabitStore) => ({
          habits: state.habits.map((habit) => (habit.id === id ? { ...habit, completedDates: updatedHabit.completedDates } : habit)),
        }));

        return transition;
      },
      addHabit: (payload) =>
        set((state: HabitStore) => ({
          habits: [
            ...state.habits,
            {
              id: `habit-${Date.now()}`,
              title: payload.title,
              color: payload.color,
              completedDates: [],
              createdAt: new Date(),
            },
          ],
        })),
      getDailyProgress: (date?: string): { completed: number; total: number; percent: number } =>
        computeDailyProgress(useHabitStore.getState().habits, date),
      reorderHabits: (fromIndex, toIndex) =>
        set((state: HabitStore) => {
          if (
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= state.habits.length ||
            toIndex >= state.habits.length ||
            fromIndex === toIndex
          ) {
            return state;
          }

          const nextHabits = [...state.habits];
          const [moved] = nextHabits.splice(fromIndex, 1);
          nextHabits.splice(toIndex, 0, moved);

          return { habits: nextHabits };
        }),
      resetHabits: () => set(initialState),
    }),
    {
      name: HABIT_STORE_KEY,
      version: HABIT_STORE_VERSION,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ habits: state.habits }),
      migrate: (persistedState) => reviveHabitDates(persistedState as PersistedHabitState | undefined),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...reviveHabitDates(persistedState as PersistedHabitState | undefined),
      }),
    }
  )
);

export const selectHabits = (state: HabitStore) => state.habits;
export const selectDailyProgress = (state: HabitStore) => state.getDailyProgress();
export const selectCompletedCount = (state: HabitStore) => selectDailyProgress(state).completed;
export const selectCompletionPercent = (state: HabitStore) => selectDailyProgress(state).percent;
