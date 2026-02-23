import { BlurView } from 'expo-blur';
import { View } from 'react-native';

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
    <BlurView intensity={30} tint="default" className={cn('overflow-hidden border border-white/20 p-5', radius.card, color.surfaceClass)}>
      <View className="gap-4">
        <View className="gap-1">
          <Text className={typography.subheading}>Progress</Text>
          <Text muted>
            {completedCount} habits completed
          </Text>
        </View>
        <View className={cn('h-3 overflow-hidden', radius.pill, color.backgroundClass)}>
          <View className={cn('h-full', color.actionPrimaryClass)} style={{ width: `${Math.max(completionPercent * 100, 6)}%` }} />
        </View>
        <Button label="Mark one done" onPress={handleCompleteNextHabit} />
      </View>
    </BlurView>
  );
}
