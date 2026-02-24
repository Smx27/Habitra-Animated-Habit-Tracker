import { memo, useCallback, useEffect } from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';
import { triggerImpact } from '@/utils/haptics';

type SaveHabitButtonProps = {
  disabled?: boolean;
  isSaving?: boolean;
  onPress: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

export const SaveHabitButton = memo(function SaveHabitButton({ disabled, isSaving, onPress }: SaveHabitButtonProps) {
  const { color, typography } = useThemeTokens();
  const pressProgress = useSharedValue(0);
  const loadingProgress = useSharedValue(isSaving ? 1 : 0);

  useEffect(() => {
    loadingProgress.value = withTiming(isSaving ? 1 : 0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [isSaving, loadingProgress]);

  const handlePressIn = useCallback(() => {
    pressProgress.value = withSpring(1, { damping: 16, stiffness: 260 });
    void triggerImpact();
  }, [pressProgress]);

  const handlePressOut = useCallback(() => {
    pressProgress.value = withSpring(0, { damping: 16, stiffness: 260 });
  }, [pressProgress]);

  const containerStyle = useAnimatedStyle(() => {
    const scale = interpolate(pressProgress.value, [0, 1], [1, 0.97]);
    const opacity = interpolate(pressProgress.value, [0, 1], [1, 0.9]);
    const maxWidth = interpolate(loadingProgress.value, [0, 1], [999, 165]);

    return {
      transform: [{ scale }],
      opacity,
      maxWidth,
      alignSelf: 'center',
      width: '100%',
    };
  });

  const labelStyle = useAnimatedStyle(() => ({
    opacity: 1 - loadingProgress.value,
    transform: [{ translateY: interpolate(loadingProgress.value, [0, 1], [0, -6]) }],
  }));

  const spinnerStyle = useAnimatedStyle(() => ({
    opacity: loadingProgress.value,
    transform: [{ translateY: interpolate(loadingProgress.value, [0, 1], [6, 0]) }],
  }));

  const isDisabled = disabled || isSaving;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      style={containerStyle}
      className={cn('h-12 items-center justify-center overflow-hidden rounded-2xl', isDisabled ? 'bg-white/15' : color.actionPrimaryClass)}
    >
      <AnimatedView style={labelStyle} className="absolute inset-0 items-center justify-center">
        <Text className={cn(typography.button, isDisabled ? 'text-white/60' : color.actionPrimaryTextClass)}>Save Habit</Text>
      </AnimatedView>

      <AnimatedView style={spinnerStyle} className="absolute inset-0 items-center justify-center">
        <ActivityIndicator color="white" />
      </AnimatedView>
    </AnimatedPressable>
  );
});
