import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { memo, useCallback, useMemo } from 'react';
import { FlatList, type ListRenderItem, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HabitCard } from '@/components/habit/HabitCard';
import { FAB, Text } from '@/components/ui';
import { useHabitActions } from '@/hooks/useHabitActions';
import { selectCompletedCount, selectCompletionPercent, selectHabits, useHabitStore } from '@/store/habitStore';
import { useThemeTokens } from '@/theme';
import type { Habit } from '@/types/habit';
import { cn } from '@/utils/cn';

import { HeaderSection } from './HeaderSection';
import { ProgressSection } from './ProgressSection';

type HabitListItemProps = {
  habit: Habit;
  index: number;
  onCompleteHabit: (habitId: Habit['id']) => void;
};

const HabitListItem = memo(function HabitListItem({ habit, index, onCompleteHabit }: HabitListItemProps) {
  return (
    <HabitCard
      habit={habit}
      index={index}
      onPress={onCompleteHabit}
      onComplete={onCompleteHabit}
      onToggleCompletion={onCompleteHabit}
    />
  );
});

export function HomeDashboard() {
  const completedCount = useHabitStore(selectCompletedCount);
  const completionPercent = useHabitStore(selectCompletionPercent);
  const habits = useHabitStore(selectHabits);
  const { handleCompleteHabit } = useHabitActions();
  const { color, spacing, scheme, typography } = useThemeTokens();
  const insets = useSafeAreaInsets();

  const gradientColors =
    scheme === 'dark'
      ? (['#020617', '#1e1b4b', '#312e81'] as const)
      : (['#eef2ff', '#e0e7ff', '#dbeafe'] as const);

  const handleCompleteHabitPress = useCallback(
    (habitId: Habit['id']) => {
      void handleCompleteHabit(habitId);
    },
    [handleCompleteHabit],
  );

  const renderHabitItem = useCallback<ListRenderItem<Habit>>(
    ({ item, index }) => <HabitListItem habit={item} index={index} onCompleteHabit={handleCompleteHabitPress} />,
    [handleCompleteHabitPress],
  );

  const contentContainerStyle = useMemo(
    () => ({
      paddingTop: insets.top + 16,
      paddingBottom: insets.bottom + 112,
    }),
    [insets.bottom, insets.top],
  );

  return (
    <View className="flex-1">
      <StatusBar style={color.statusBarStyle} />
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />

      <FlatList
        data={habits}
        keyExtractor={(habit) => habit.id}
        initialNumToRender={8}
        windowSize={7}
        removeClippedSubviews
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={40}
        contentContainerClassName={cn('gap-3', spacing.screenX)}
        contentContainerStyle={contentContainerStyle}
        ListHeaderComponent={
          <View className="gap-5 pb-2">
            <HeaderSection completedCount={completedCount} />
            <ProgressSection completedCount={completedCount} completionPercent={completionPercent} />
            <Text className={typography.subheading}>Habit List</Text>
          </View>
        }
        renderItem={renderHabitItem}
      />

      <FAB accessibilityLabel="Create habit" />
    </View>
  );
}
