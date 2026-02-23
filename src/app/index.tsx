import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { PulseOrb } from '@/components/animations/PulseOrb';
import { HabitCounterCard } from '@/components/habit/HabitCounterCard';
import { SuccessLottie } from '@/components/SuccessLottie';
import { useHabitStore } from '@/store/habitStore';
import { theme } from '@/theme';

export default function HomeScreen() {
  const completedToday = useHabitStore((state) => state.completedToday);

  return (
    <View className={`flex-1 items-center justify-center ${theme.color.background} ${theme.spacing.screenX}`}>
      <StatusBar style="light" />
      <PulseOrb />
      <SuccessLottie />
      <View className="mt-4 w-full items-center">
        <HabitCounterCard completedToday={completedToday} />
      </View>
    </View>
  );
}
