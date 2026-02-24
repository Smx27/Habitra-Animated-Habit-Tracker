import { View } from 'react-native';

import { HabitCard } from '@/components/habit/HabitCard';
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

  const today = new Date().toISOString().split('T')[0];

  return (
    <View className="gap-3">
      <Text className={typography.subheading}>HabitList</Text>
      {habits.map((habit, index) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          completedToday={habit.completedDates.includes(today)}
          streak={habit.completedDates.length}
          index={index}
          onPress={handleHabitPress}
          onComplete={handleHabitPress}
          onToggleCompletion={handleHabitPress}
        />
      ))}
    </View>
  );
}
