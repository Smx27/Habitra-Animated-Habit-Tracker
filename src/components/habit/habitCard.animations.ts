import { interpolateColor, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

export function useCompletionBackgroundStyle(completionProgress: SharedValue<number>) {
  return useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(completionProgress.value, [0, 1], ['rgba(15, 23, 42, 0.08)', 'rgba(16, 185, 129, 0.24)']),
  }));
}

export function useCompletionCheckStyle(completionProgress: SharedValue<number>) {
  return useAnimatedStyle(() => ({
    opacity: completionProgress.value,
    transform: [
      {
        scale: 0.8 + completionProgress.value * 0.2,
      },
    ],
  }));
}
