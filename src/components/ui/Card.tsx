import { BlurView } from 'expo-blur';
import { useEffect } from 'react';
import { View, type ViewProps } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type Props = ViewProps & {
  intensity?: number;
};

export function Card({ children, className, intensity = 45, ...props }: Props) {
  const { color, radius, spacing, shadows, scheme, themeProgress } = useThemeTokens();
  const scale = useSharedValue(0.98);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 260 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedSurfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(themeProgress.value, [0, 1], ['rgba(255,255,255,0.72)', 'rgba(15,23,42,0.7)']),
  }));

  return (
    <Animated.View style={animatedStyle} className="w-full max-w-sm">
      <BlurView intensity={intensity} tint={scheme} className={cn('overflow-hidden border border-white/20', radius.card, color.cardBackgroundClass)}>
        <Animated.View style={animatedSurfaceStyle} className="absolute inset-0" pointerEvents="none" />
        <View className={cn(spacing.stackSm, spacing.cardPadding, shadows.card, className)} {...props}>
          {children}
        </View>
      </BlurView>
    </Animated.View>
  );
}
