import { BlurView } from 'expo-blur';
import { View } from 'react-native';

import { Button, Text } from '@/components/ui';
import { useHabitActions } from '@/hooks/useHabitActions';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type ProgressSectionProps = {
  completedToday: number;
};

const DAILY_GOAL = 8;

export function ProgressSection({ completedToday }: ProgressSectionProps) {
  const { radius, typography, color } = useThemeTokens();
  const { handleCompleteHabit } = useHabitActions();
  const progress = Math.min(completedToday / DAILY_GOAL, 1);

  return (
    <BlurView intensity={30} tint="default" className={cn('overflow-hidden border border-white/20 p-5', radius.card, color.surfaceClass)}>
      <View className="gap-4">
        <View className="gap-1">
          <Text className={typography.subheading}>Progress</Text>
          <Text muted>
            {completedToday}/{DAILY_GOAL} habits completed
          </Text>
        </View>
        <View className={cn('h-3 overflow-hidden', radius.pill, color.backgroundClass)}>
          <View className={cn('h-full', color.actionPrimaryClass)} style={{ width: `${Math.max(progress * 100, 6)}%` }} />
        </View>
        <Button label="Mark one done" onPress={handleCompleteHabit} />
      </View>
    </BlurView>
  );
}
