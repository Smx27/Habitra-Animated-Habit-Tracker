import { selectHabits, useHabitStore } from '@/store/habitStore';
import type { HabitStore } from '@/types/habit';
import { triggerSuccessHaptic } from '@/utils/haptics';

export function useHabitActions() {
  const habits = useHabitStore(selectHabits);
  const toggleHabitCompletion = useHabitStore((state: HabitStore) => state.toggleHabitCompletion);

  const handleCompleteHabit = async (id: string) => {
    toggleHabitCompletion(id);
    await triggerSuccessHaptic();
  };

  const handleCompleteNextHabit = async () => {
    const nextIncompleteHabit = habits.find((habit) => !habit.completedToday) ?? habits[0];

    if (!nextIncompleteHabit) {
      return;
    }

    await handleCompleteHabit(nextIncompleteHabit.id);
  };

  return {
    handleCompleteHabit,
    handleCompleteNextHabit,
  };
}
