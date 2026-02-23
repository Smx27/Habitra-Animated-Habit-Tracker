import { Pressable, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { useThemeTokens } from '@/theme';
import { triggerImpact } from '@/utils/haptics';
import { cn } from '@/utils/cn';

type FABProps = PressableProps & {
  icon?: string;
};

export function FAB({ className, icon = '+', onPressIn, onPressOut, onPress, ...props }: FABProps) {
  const { color, radius, shadows } = useThemeTokens();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="absolute bottom-8 right-6">
      <Pressable
        className={cn('h-16 w-16 items-center justify-center', radius.pill, color.actionPrimaryClass, shadows.floating, className)}
        onPressIn={(event) => {
          scale.value = withSpring(0.92, { damping: 12, stiffness: 230 });
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          scale.value = withSpring(1, { damping: 12, stiffness: 230 });
          onPressOut?.(event);
        }}
        onPress={(event) => {
          triggerImpact();
          onPress?.(event);
        }}
        {...props}
      >
        <Text className={cn('text-3xl', color.actionPrimaryTextClass)}>{icon}</Text>
      </Pressable>
    </Animated.View>
  );
}
