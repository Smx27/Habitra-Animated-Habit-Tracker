import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { FlatList, View } from 'react-native';

import { HabitCard } from '@/components/habit/HabitCard';
import { Text } from '@/components/ui';
import { useHabitActions } from '@/hooks/useHabitActions';
import { FAB } from '@/components/ui';
import { selectCompletedCount, selectCompletionPercent, selectHabits, useHabitStore } from '@/store/habitStore';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

import { HeaderSection } from './HeaderSection';
import { ProgressSection } from './ProgressSection';

export function HomeDashboard() {
  const completedCount = useHabitStore(selectCompletedCount);
  const completionPercent = useHabitStore(selectCompletionPercent);
  const habits = useHabitStore(selectHabits);
  const { handleCompleteHabit } = useHabitActions();
  const { color, spacing, scheme, typography } = useThemeTokens();

  const gradientColors =
    scheme === 'dark'
      ? (['#020617', '#1e1b4b', '#312e81'] as const)
      : (['#eef2ff', '#e0e7ff', '#dbeafe'] as const);

  return (
    <View className="flex-1">
      <StatusBar style={color.statusBarStyle} />
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />

      <FlatList
        data={habits}
        keyExtractor={(habit) => habit.id}
        contentContainerClassName={cn('gap-3 pb-28 pt-16', spacing.screenX)}
        ListHeaderComponent={
          <View className="gap-5 pb-2">
            <HeaderSection completedCount={completedCount} />
            <ProgressSection completedCount={completedCount} completionPercent={completionPercent} />
            <Text className={typography.subheading}>Habit List</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <HabitCard
            habit={item}
            isCompleted={item.completedToday}
            index={index}
            onPress={(habitId) => {
              void handleCompleteHabit(habitId);
            }}
            onToggleCompletion={(habitId) => {
              void handleCompleteHabit(habitId);
            }}
          />
        )}
      />

      <FAB accessibilityLabel="Create habit" />
    </View>
  );
}
