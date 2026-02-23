import { BlurView } from 'expo-blur';
import { useEffect } from 'react';
import { View, type ViewProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type Props = ViewProps & {
  intensity?: number;
};

export function Card({ children, className, intensity = 45, ...props }: Props) {
  const { color, radius, spacing, shadows, scheme } = useThemeTokens();
  const scale = useSharedValue(0.98);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 260 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="w-full max-w-sm">
      <BlurView intensity={intensity} tint={scheme} className={cn('overflow-hidden border border-white/20', radius.card, color.cardBackgroundClass)}>
        <View className={cn(spacing.stackSm, spacing.cardPadding, shadows.card, className)} {...props}>
          {children}
        </View>
      </BlurView>
    </Animated.View>
  );
}
