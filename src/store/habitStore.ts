import { create } from 'zustand';

import type { Habit, HabitStore } from '@/types/habit';
import { getCompletedCount, getCompletionPercent, HABIT_CATEGORY_COLORS } from '@/types/habit';

const initialHabits: Habit[] = [
  {
    id: 'morning-stretch',
    title: 'Morning stretch',
    icon: '🧘',
    category: 'mindfulness',
    streak: 6,
    accentColor: HABIT_CATEGORY_COLORS.mindfulness.accent,
    completedToday: true,
  },
  {
    id: 'drink-water',
    title: 'Drink water',
    icon: '💧',
    category: 'wellness',
    streak: 4,
    accentColor: HABIT_CATEGORY_COLORS.wellness.accent,
    completedToday: false,
  },
  {
    id: 'read-10-minutes',
    title: 'Read 10 minutes',
    icon: '📚',
    category: 'learning',
    streak: 12,
    accentColor: HABIT_CATEGORY_COLORS.learning.accent,
    completedToday: false,
  },
  {
    id: 'evening-review',
    title: 'Evening review',
    icon: '🌙',
    category: 'productivity',
    streak: 8,
    accentColor: HABIT_CATEGORY_COLORS.productivity.accent,
    completedToday: true,
  },
];

const initialState = {
  habits: initialHabits,
};

export const useHabitStore = create<HabitStore>((set) => ({
  ...initialState,
  toggleHabitCompletion: (id) =>
    set((state: HabitStore) => ({
      habits: state.habits.map((habit) =>
        habit.id === id ? { ...habit, completedToday: !habit.completedToday } : habit,
      ),
    })),
  addHabit: (payload) =>
    set((state: HabitStore) => ({
      habits: [
        ...state.habits,
        {
          id: `habit-${Date.now()}`,
          title: payload.title,
          icon: payload.icon,
          category: payload.category ?? 'wellness',
          streak: 0,
          accentColor: payload.accentColor,
          completedToday: false,
        },
      ],
    })),
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
}));

export const selectHabits = (state: HabitStore) => state.habits;
export const selectCompletedCount = (state: HabitStore) => getCompletedCount(state.habits);
export const selectCompletionPercent = (state: HabitStore) => getCompletionPercent(state.habits);
