import type { Habit } from '@/types/habit';

const getISODateToday = () => new Date().toISOString().split('T')[0];

export function getCompletedCount(habits: Habit[], date = getISODateToday()): number {
  return habits.filter((habit) => habit.completedDates.includes(date)).length;
}

export function getCompletionPercent(habits: Habit[], date = getISODateToday()): number {
  if (habits.length === 0) {
    return 0;
  }

  return getCompletedCount(habits, date) / habits.length;
}

export function getDailyProgress(
  habits: Habit[],
  date = getISODateToday(),
): {
  completed: number;
  total: number;
  percent: number;
} {
  const total = habits.length;
  const completed = getCompletedCount(habits, date);

  return {
    completed,
    total,
    percent: total === 0 ? 0 : completed / total,
  };
}
