import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { PulseOrb } from '@/components/animations/PulseOrb';
import { HabitCounterCard } from '@/components/habit/HabitCounterCard';
import { Text } from '@/components/ui';
import { SuccessLottie } from '@/components/SuccessLottie';
import { useHabitStore } from '@/store/habitStore';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';
import type { HabitStore } from '@/types/habit';

export default function HomeScreen() {
  const completedToday = useHabitStore((state: HabitStore) => state.completedToday);
  const { color, spacing, radius, scheme } = useThemeTokens();

  return (
    <View className={cn('flex-1 items-center justify-center', color.backgroundClass, spacing.screenX)}>
      <StatusBar style={color.statusBarStyle} />
      <PulseOrb />
      <SuccessLottie />
      <View className={cn('mb-4 mt-2', radius.button, color.surfaceClass, 'px-3 py-2')}>
        <Text className="text-sm">Theme preview: {scheme === 'dark' ? 'Dark mode' : 'Light mode'}</Text>
      </View>
      <View className="w-full items-center">
        <HabitCounterCard completedToday={completedToday} />
      </View>
    </View>
  );
}
