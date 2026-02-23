import { Badge, Button, Card, ProgressRing, Text } from '@/components/ui';
import { HABIT_LABELS } from '@/constants/habits';
import { useHabitActions } from '@/hooks/useHabitActions';
import { useThemeTokens } from '@/theme';

type Props = {
  completedToday: number;
};

const DAILY_GOAL = 8;

export function HabitCounterCard({ completedToday }: Props) {
  const { handleCompleteHabit } = useHabitActions();
  const { typography } = useThemeTokens();
  const progress = completedToday / DAILY_GOAL;

  return (
    <Card className="items-center gap-4">
      <Badge label={`🔥 ${completedToday} day streak`} />
      <Text className={typography.heading}>{HABIT_LABELS.appName}</Text>
      <ProgressRing progress={progress} label="Daily goal" />
      <Text muted>
        Completed today: {completedToday}/{DAILY_GOAL}
      </Text>
      <Button className="mt-1 w-full" label={HABIT_LABELS.completeAction} onPress={handleCompleteHabit} />
    </Card>
  );
}
