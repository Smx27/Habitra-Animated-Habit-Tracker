import { Badge, Button, Card, ProgressRing, Text } from '@/components/ui';
import { HABIT_LABELS } from '@/constants/habits';
import { useHabitActions } from '@/hooks/useHabitActions';
import { useThemeTokens } from '@/theme';

type Props = {
  completedCount: number;
  completionPercent: number;
};

export function HabitCounterCard({ completedCount, completionPercent }: Props) {
  const { handleCompleteNextHabit } = useHabitActions();
  const { typography } = useThemeTokens();

  return (
    <Card className="items-center gap-4">
      <Badge label={`🔥 ${completedCount} completed`} />
      <Text className={typography.heading}>{HABIT_LABELS.appName}</Text>
      <ProgressRing progress={completionPercent} label="Daily goal" />
      <Text muted>Completed today: {completedCount}</Text>
      <Button className="mt-1 w-full" label={HABIT_LABELS.completeAction} onPress={handleCompleteNextHabit} />
    </Card>
  );
}
