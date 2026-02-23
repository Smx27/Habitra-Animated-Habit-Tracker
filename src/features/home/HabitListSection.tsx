import { View } from 'react-native';

import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

const habits = ['Morning stretch', 'Drink water', 'Read 10 minutes', 'Evening review'];

export function HabitListSection() {
  const { color, radius, typography } = useThemeTokens();

  return (
    <View className="gap-3">
      <Text className={typography.subheading}>HabitList</Text>
      {habits.map((habit) => (
        <View key={habit} className={cn('border border-white/15 px-4 py-3', radius.card, color.surfaceClass)}>
          <Text className={typography.body}>{habit}</Text>
        </View>
      ))}
    </View>
  );
}
