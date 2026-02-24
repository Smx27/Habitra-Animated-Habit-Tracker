import { memo, useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { Easing, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { useAdaptivePerformance } from '@/hooks/useAdaptivePerformance';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type AnimatedProgressRingProps = {
  completionPercent: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  duration?: number;
  animate?: boolean;
};

function AnimatedProgressRingComponent({
  completionPercent,
  label,
  size = 120,
  strokeWidth = 10,
  duration = 900,
  animate = true,
}: AnimatedProgressRingProps) {
  const { palette, typography } = useThemeTokens();
  const { shouldReduceMotion, timingDurationScale } = useAdaptivePerformance();

  const clampedProgress = Math.min(Math.max(completionPercent, 0), 1);
  const progress = useSharedValue(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const resolvedDuration = animate && !shouldReduceMotion ? Math.round(duration * timingDurationScale) : 0;

    progress.value = withTiming(clampedProgress, {
      duration: resolvedDuration,
      easing: Easing.out(Easing.cubic),
    });
  }, [animate, clampedProgress, duration, progress, shouldReduceMotion, timingDurationScale]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke={palette.ringTrack} strokeWidth={strokeWidth} fill="transparent" />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={palette.ringProgress}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View className="absolute items-center">
        <Text className={cn(typography.subheading)}>{Math.round(clampedProgress * 100)}%</Text>
        {label ? <Text muted className="text-xs">{label}</Text> : null}
      </View>
    </View>
  );
}

export const AnimatedProgressRing = memo(AnimatedProgressRingComponent);
