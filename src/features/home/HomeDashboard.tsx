import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';

import { FAB } from '@/components/ui';
import { selectCompletedCount, selectCompletionPercent, useHabitStore } from '@/store/habitStore';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

import { HabitListSection } from './HabitListSection';
import { HeaderSection } from './HeaderSection';
import { ProgressSection } from './ProgressSection';

export function HomeDashboard() {
  const completedCount = useHabitStore(selectCompletedCount);
  const completionPercent = useHabitStore(selectCompletionPercent);
  const { color, spacing, scheme } = useThemeTokens();

  const gradientColors =
    scheme === 'dark'
      ? (['#020617', '#1e1b4b', '#312e81'] as const)
      : (['#eef2ff', '#e0e7ff', '#dbeafe'] as const);

  return (
    <View className="flex-1">
      <StatusBar style={color.statusBarStyle} />
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />

      <ScrollView className="flex-1" contentContainerClassName={cn('gap-5 pb-28 pt-16', spacing.screenX)}>
        <HeaderSection completedCount={completedCount} />
        <ProgressSection completedCount={completedCount} completionPercent={completionPercent} />
        <HabitListSection />
      </ScrollView>

      <FAB accessibilityLabel="Create habit" />
    </View>
  );
}
