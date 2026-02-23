import { useHabitStore } from '@/store/habitStore';
import type { HabitStore } from '@/types/habit';
import { triggerSuccessHaptic } from '@/utils/haptics';

export function useHabitActions() {
  const incrementCompletedToday = useHabitStore((state: HabitStore) => state.incrementCompletedToday);

  const handleCompleteHabit = async () => {
    incrementCompletedToday();
    await triggerSuccessHaptic();
  };

  return {
    handleCompleteHabit,
  };
}
