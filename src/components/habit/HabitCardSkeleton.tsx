import { memo, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type HabitCardSkeletonProps = {
  index: number;
};

function HabitCardSkeletonComponent({ index }: HabitCardSkeletonProps) {
  const { color, palette, radius, shadows, spacing } = useThemeTokens();
  const shimmerTranslateX = useSharedValue(-320);

  useEffect(() => {
    shimmerTranslateX.value = withRepeat(
      withTiming(320, {
        duration: 1200,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      false,
    );
  }, [shimmerTranslateX]);

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslateX.value }],
  }));

  return (
    <Animated.View
      className="w-full overflow-hidden"
      style={{ opacity: 0.7 + Math.max(0, 2 - index) * 0.05 }}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading habit"
    >
      <View className={cn('overflow-hidden border border-white/15', radius.card, color.cardBackgroundClass)}>
        <View className={cn('flex-row items-center justify-between', spacing.cardPadding, shadows.card)}>
          <View className="flex-1 flex-row items-center gap-3">
            <View className={cn('size-11', radius.pill)} style={{ backgroundColor: palette.ringTrack }} />

            <View className="flex-1 gap-2">
              <View className="h-5 w-2/3 rounded-full" style={{ backgroundColor: palette.ringTrack }} />
              <View className="h-4 w-5/12 rounded-full" style={{ backgroundColor: palette.ringTrack }} />
            </View>
          </View>

          <View className="ml-4 h-9 w-9 rounded-full" style={{ backgroundColor: palette.ringTrack }} />
        </View>

        <Animated.View
          pointerEvents="none"
          className="absolute inset-y-0 w-24"
          style={[
            shimmerAnimatedStyle,
            {
              backgroundColor: palette.ringProgress,
              opacity: 0.22,
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

export const HabitCardSkeleton = memo(HabitCardSkeletonComponent);
