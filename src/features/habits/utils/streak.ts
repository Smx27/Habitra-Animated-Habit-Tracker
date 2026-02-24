import type { Habit } from '@/types/habit';

const DAY_MS = 24 * 60 * 60 * 1000;

const normalizeISODate = (date: Date | string) => {
  if (typeof date === 'string') {
    return date;
  }

  return date.toISOString().split('T')[0];
};

const toUtcStartOfDay = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};

export function isCompletedOnDate(habit: Habit, date: Date | string): boolean {
  return habit.completedDates.includes(normalizeISODate(date));
}

export function toggleCompletionForDate(habit: Habit, date: Date | string): Habit {
  const isoDate = normalizeISODate(date);
  const isCompleted = isCompletedOnDate(habit, isoDate);

  return {
    ...habit,
    completedDates: isCompleted
      ? habit.completedDates.filter((completedDate) => completedDate !== isoDate)
      : [...habit.completedDates, isoDate],
  };
}

export function calculateCurrentStreak(completedDates: string[], today: Date | string): number {
  if (completedDates.length === 0) {
    return 0;
  }

  const uniqueDates = new Set(completedDates);
  let streak = 0;
  let cursor = toUtcStartOfDay(normalizeISODate(today));

  while (uniqueDates.has(new Date(cursor).toISOString().split('T')[0])) {
    streak += 1;
    cursor -= DAY_MS;
  }

  return streak;
}
