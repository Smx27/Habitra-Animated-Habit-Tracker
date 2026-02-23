import { View, type ViewProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type BadgeProps = ViewProps & {
  label: string;
};

export function Badge({ label, className, ...props }: BadgeProps) {
  const { color, radius, shadows, typography } = useThemeTokens();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className={cn('self-start', radius.pill, color.surfaceClass, shadows.glow, className)}
      onTouchStart={() => {
        scale.value = withSequence(withTiming(0.96, { duration: 90 }), withTiming(1, { duration: 120 }));
      }}
      {...props}
    >
      <View className={cn('flex-row items-center gap-2 px-3 py-1.5')}>
        <View className={cn('h-2.5 w-2.5 rounded-full', color.accentClass)} />
        <Text className={cn(typography.caption)}>{label}</Text>
      </View>
    </Animated.View>
  );
}
