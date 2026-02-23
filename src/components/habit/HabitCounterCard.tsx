import { HABIT_LABELS } from '@/constants/habits';
import { useHabitActions } from '@/hooks/useHabitActions';
import { Button, Card, Text } from '@/components/ui';

type Props = {
  completedToday: number;
};

export function HabitCounterCard({ completedToday }: Props) {
  const { handleCompleteHabit } = useHabitActions();

  return (
    <Card className="items-center">
      <Text className="text-3xl font-bold">{HABIT_LABELS.appName}</Text>
      <Text muted>Completed today: {completedToday}</Text>
      <Button className="mt-2" label={HABIT_LABELS.completeAction} onPress={handleCompleteHabit} />
    </Card>
  );
}
