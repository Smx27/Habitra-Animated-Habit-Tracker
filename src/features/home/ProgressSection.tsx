import { BlurView } from 'expo-blur';
import { View } from 'react-native';

import { AnimatedProgressRing } from '@/components/habit/AnimatedProgressRing';
import { Button, Text } from '@/components/ui';
import { useHabitActions } from '@/hooks/useHabitActions';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type ProgressSectionProps = {
  completedCount: number;
  completionPercent: number;
};

export function ProgressSection({ completedCount, completionPercent }: ProgressSectionProps) {
  const { radius, typography, color } = useThemeTokens();
  const { handleCompleteNextHabit } = useHabitActions();

  return (
    <BlurView intensity={44} tint="default" className={cn('overflow-hidden border border-white/25 p-5', radius.card, color.surfaceClass)}>
      <View className="gap-5">
        <View className="gap-1.5">
          <Text className={cn(typography.title, color.textPrimaryClass)}>Progress</Text>
          <Text muted className={typography.bodySmall}>
            {completedCount} habits completed
          </Text>
        </View>
        <View className="items-center">
          <AnimatedProgressRing completionPercent={completionPercent} label="Daily goal" size={134} strokeWidth={11} duration={1000} />
        </View>
        <Button label="Mark one done" onPress={handleCompleteNextHabit} />
      </View>
    </BlurView>
  );
}
