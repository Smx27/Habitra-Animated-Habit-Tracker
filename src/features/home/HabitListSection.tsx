import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { useHabitActions } from '@/hooks/useHabitActions';
import { selectHabits, useHabitStore } from '@/store/habitStore';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

export function HabitListSection() {
  const habits = useHabitStore(selectHabits);
  const { handleCompleteHabit } = useHabitActions();
  const { color, radius, typography } = useThemeTokens();

  return (
    <View className="gap-3">
      <Text className={typography.subheading}>HabitList</Text>
      {habits.map((habit) => (
        <Pressable
          key={habit.id}
          className={cn('border border-white/15 px-4 py-3', radius.card, color.surfaceClass)}
          onPress={() => {
            void handleCompleteHabit(habit.id);
          }}
        >
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-1 flex-row items-center gap-3">
              {habit.icon ? <Text className={typography.body}>{habit.icon}</Text> : null}
              <Text className={typography.body}>{habit.title}</Text>
            </View>
            <Text className={cn(typography.caption, habit.completedToday ? 'text-emerald-300' : color.textMutedClass)}>
              {habit.completedToday ? 'Done' : 'Open'}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}
