import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type AnimatedProgressRingProps = {
  completionPercent: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
  duration?: number;
};

export function AnimatedProgressRing({
  completionPercent,
  label,
  size = 120,
  strokeWidth = 10,
  duration = 900,
}: AnimatedProgressRingProps) {
  const { palette, typography } = useThemeTokens();
  const [displayPercent, setDisplayPercent] = useState(0);

  const clampedProgress = Math.min(Math.max(completionPercent, 0), 1);
  const progress = useSharedValue(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(clampedProgress, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [clampedProgress, duration, progress]);

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      runOnJS(setDisplayPercent)(Math.round(value * 100));
    },
    [progress],
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={palette.ringTrack}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
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
        <Text className={cn(typography.subheading)}>{displayPercent}%</Text>
        {label ? <Text muted className="text-xs">{label}</Text> : null}
      </View>
    </View>
  );
}
