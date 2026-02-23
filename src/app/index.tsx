import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { SuccessLottie } from '@/components/SuccessLottie';
import { useHabitStore } from '@/store/useHabitStore';
import { triggerSuccessHaptic } from '@/utils/haptics';

export default function HomeScreen() {
  const completedToday = useHabitStore((state) => state.completedToday);
  const incrementCompletedToday = useHabitStore((state) => state.incrementCompletedToday);

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.1, { duration: 1000 }), -1, true);
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handleComplete = async () => {
    incrementCompletedToday();
    await triggerSuccessHaptic();
  };

  return (
    <View className="flex-1 items-center justify-center bg-slate-900 px-6">
      <StatusBar style="light" />

      <Animated.View style={animatedStyle} className="mb-4">
        <Svg width={72} height={72} viewBox="0 0 72 72">
          <Circle cx={36} cy={36} r={30} fill="#22c55e" opacity={0.25} />
          <Circle cx={36} cy={36} r={20} fill="#22c55e" />
        </Svg>
      </Animated.View>

      <SuccessLottie />

      <BlurView intensity={35} tint="dark" className="mt-4 w-full max-w-sm overflow-hidden rounded-2xl">
        <View className="items-center gap-2 p-5">
          <Text className="text-3xl font-bold text-slate-50">Habitra</Text>
          <Text className="text-slate-300">Completed today: {completedToday}</Text>
          <Pressable className="mt-2 rounded-xl bg-emerald-500 px-4 py-3" onPress={handleComplete}>
            <Text className="font-semibold text-slate-950">Complete habit + haptic</Text>
          </Pressable>
        </View>
      </BlurView>
    </View>
  );
}
