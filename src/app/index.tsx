import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { PulseOrb } from '@/components/animations/PulseOrb';
import { HabitCounterCard } from '@/components/habit/HabitCounterCard';
import { FAB, Text } from '@/components/ui';
import { SuccessLottie } from '@/components/SuccessLottie';
import { useHabitStore } from '@/store/habitStore';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';
import type { HabitStore } from '@/types/habit';

export default function HomeScreen() {
  const completedToday = useHabitStore((state: HabitStore) => state.completedToday);
  const { color, spacing, radius, scheme, typography } = useThemeTokens();

  return (
    <View className={cn('flex-1 items-center justify-center', color.backgroundClass, spacing.screenX)}>
      <StatusBar style={color.statusBarStyle} />
      <PulseOrb />
      <SuccessLottie />
      <View className={cn('mb-4 mt-2 border border-white/20 px-4 py-2', radius.button, color.surfaceClass)}>
        <Text className={typography.caption}>Theme: {scheme === 'dark' ? 'Dark' : 'Light'}</Text>
      </View>
      <View className="w-full items-center">
        <HabitCounterCard completedToday={completedToday} />
      </View>
      <FAB accessibilityLabel="Create habit" />
    </View>
  );
}
