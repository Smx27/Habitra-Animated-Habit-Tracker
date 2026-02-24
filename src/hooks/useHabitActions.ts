import { selectHabits, useHabitStore } from '@/store/habitStore';
import type { HabitStore } from '@/types/habit';
import { triggerMilestoneHaptic, triggerSuccessHaptic } from '@/utils/haptics';

export function useHabitActions() {
  const habits = useHabitStore(selectHabits);
  const toggleHabitCompletion = useHabitStore((state: HabitStore) => state.toggleHabitCompletion);

  const handleCompleteHabit = async (id: string) => {
    const transition = toggleHabitCompletion(id);

    if (!transition) {
      return null;
    }

    if (transition.isCompletedToday) {
      await triggerSuccessHaptic();

      if (transition.newStreak > 0 && transition.newStreak % 7 === 0) {
        await triggerMilestoneHaptic();
      }
    }

    return transition;
  };

  const handleCompleteNextHabit = async () => {
    const today = new Date().toISOString().split('T')[0];
    const nextIncompleteHabit = habits.find((habit) => !habit.completedDates.includes(today)) ?? habits[0];

    if (!nextIncompleteHabit) {
      return null;
    }

    return handleCompleteHabit(nextIncompleteHabit.id);
  };

  return {
    handleCompleteHabit,
    handleCompleteNextHabit,
  };
}
