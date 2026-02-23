import { BlurView } from 'expo-blur';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

import { Text } from '@/components/ui';
import type { Habit } from '@/types/habit';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type HabitCardProps = {
  habit: Habit;
  isCompleted: boolean;
  index: number;
  onPress: (habitId: Habit['id']) => void;
  onToggleCompletion: (habitId: Habit['id']) => void;
};

export function HabitCard({ habit, isCompleted, index, onPress, onToggleCompletion }: HabitCardProps) {
  const { color, radius, shadows, spacing, scheme, typography } = useThemeTokens();

  return (
    <Animated.View
      layout={Layout.springify().damping(18).stiffness(180)}
      entering={FadeInDown.delay(index * 60).springify().damping(20).stiffness(210)}
      className="w-full"
    >
      <BlurView intensity={42} tint={scheme} className={cn('overflow-hidden border border-white/20', radius.card, color.cardBackgroundClass)}>
        <Pressable
          className={cn('flex-row items-center justify-between', spacing.cardPadding, shadows.card)}
          onPress={() => {
            onPress(habit.id);
          }}
        >
          <View className="flex-1 flex-row items-center gap-3">
            <View className={cn('size-11 items-center justify-center border border-white/30 bg-white/20', radius.pill)}>
              <Text className="text-xl">{habit.icon ?? '✨'}</Text>
            </View>

            <View className="flex-1 gap-1">
              <Text className={cn(typography.body, isCompleted ? 'text-emerald-300' : undefined)}>{habit.title}</Text>
              <Text className={cn(typography.caption, isCompleted ? 'text-emerald-300/80' : color.textMutedClass)}>
                {isCompleted ? 'Completed today' : 'Tap to complete'}
              </Text>
            </View>
          </View>

          <Pressable
            className={cn(
              'ml-4 size-9 items-center justify-center border',
              radius.pill,
              isCompleted ? 'border-emerald-300/70 bg-emerald-400/20' : 'border-white/35 bg-white/10',
            )}
            onPress={() => {
              onToggleCompletion(habit.id);
            }}
          >
            <Text className={cn(typography.body, isCompleted ? 'text-emerald-300' : color.textMutedClass)}>{isCompleted ? '✓' : '○'}</Text>
          </Pressable>
        </Pressable>
      </BlurView>
    </Animated.View>
  );
}
