import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressRingProps = {
  size?: number;
  strokeWidth?: number;
  progress: number;
  label?: string;
};

export function ProgressRing({ size = 120, strokeWidth = 10, progress, label }: ProgressRingProps) {
  const { palette, typography } = useThemeTokens();
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: withTiming(circumference * (1 - clampedProgress), { duration: 450 }),
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
        <Text className={cn(typography.subheading)}>{Math.round(clampedProgress * 100)}%</Text>
        {label ? <Text muted className="text-xs">{label}</Text> : null}
      </View>
    </View>
  );
}
