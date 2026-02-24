import { View } from 'react-native';

import { HabitCard } from '@/components/habit/HabitCard';
import { calculateCurrentStreak, isCompletedOnDate } from '@/features/habits/utils/streak';
import { Text } from '@/components/ui';
import { useHabitActions } from '@/hooks/useHabitActions';
import { selectHabits, useHabitStore } from '@/store/habitStore';
import { useThemeTokens } from '@/theme';
import type { Habit } from '@/types/habit';

export function HabitListSection() {
  const habits = useHabitStore(selectHabits);
  const { handleCompleteHabit } = useHabitActions();
  const { typography } = useThemeTokens();

  const handleHabitPress = (habitId: Habit['id']) => {
    void handleCompleteHabit(habitId);
  };

  const today = new Date();

  return (
    <View className="gap-3">
      <Text className={typography.subheading}>HabitList</Text>
      {habits.map((habit, index) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          completedToday={isCompletedOnDate(habit, today)}
          streak={calculateCurrentStreak(habit.completedDates, today)}
          index={index}
          onPress={handleHabitPress}
          onComplete={handleHabitPress}
          onToggleCompletion={handleHabitPress}
        />
      ))}
    </View>
  );
}
