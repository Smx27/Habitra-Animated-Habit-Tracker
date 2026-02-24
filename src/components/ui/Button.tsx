import { Pressable, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type Props = PressableProps & {
  label: string;
};

export function Button({ className, label, onPressIn, onPressOut, onPress, ...props }: Props) {
  const { color, radius, spacing, typography, shadows } = useThemeTokens();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        className={cn(
          radius.button,
          color.actionPrimaryClass,
          spacing.buttonX,
          spacing.buttonY,
          shadows.floating,
          className,
        )}
        onPressIn={(event) => {
          scale.value = withSpring(0.97, { damping: 12, stiffness: 240 });
          opacity.value = withTiming(0.9, { duration: 140 });
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withSpring(1, { damping: 12, stiffness: 240 });
          opacity.value = withTiming(1, { duration: 140 });
          onPressOut?.(event);
        }}
        onPress={onPress}
        {...props}
      >
        <Text className={cn('text-center', color.actionPrimaryTextClass, typography.button)}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}
