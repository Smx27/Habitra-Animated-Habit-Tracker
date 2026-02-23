import { Button, Card, Text } from '@/components/ui';
import { HABIT_LABELS } from '@/constants/habits';
import { useHabitActions } from '@/hooks/useHabitActions';
import { useThemeTokens } from '@/theme';

type Props = {
  completedToday: number;
};

export function HabitCounterCard({ completedToday }: Props) {
  const { handleCompleteHabit } = useHabitActions();
  const { typography } = useThemeTokens();

  return (
    <Card className="items-center">
      <Text className={typography.headingLg}>{HABIT_LABELS.appName}</Text>
      <Text muted>Completed today: {completedToday}</Text>
      <Button className="mt-2" label={HABIT_LABELS.completeAction} onPress={handleCompleteHabit} />
    </Card>
  );
}
