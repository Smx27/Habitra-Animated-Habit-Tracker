import { useHabitStore } from '@/store/habitStore';
import { triggerSuccessHaptic } from '@/utils/haptics';

export function useHabitActions() {
  const incrementCompletedToday = useHabitStore((state) => state.incrementCompletedToday);

  const handleCompleteHabit = async () => {
    incrementCompletedToday();
    await triggerSuccessHaptic();
  };

  return {
    handleCompleteHabit,
  };
}
