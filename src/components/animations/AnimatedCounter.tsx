import { memo, useCallback, useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export interface AnimatedCounterProps {
  value: number;
  className?: string;
  duration?: number;
}

function AnimatedCounterComponent({ value, className, duration = 280 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  const animatedValue = useSharedValue(value);

  const updateDisplayValue = useCallback((nextValue: number) => {
    setDisplayValue((prevValue) => (prevValue === nextValue ? prevValue : nextValue));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const syncReduceMotionState = async () => {
      const enabled = await AccessibilityInfo.isReduceMotionEnabled();
      if (isMounted) {
        setReduceMotionEnabled(enabled);
      }
    };

    void syncReduceMotionState();

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      setReduceMotionEnabled(enabled);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (reduceMotionEnabled) {
      animatedValue.value = value;
      setDisplayValue(value);
      return;
    }

    animatedValue.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [animatedValue, duration, reduceMotionEnabled, value]);

  useAnimatedReaction(
    () => Math.round(animatedValue.value),
    (nextValue, previousValue) => {
      if (nextValue !== previousValue) {
        runOnJS(updateDisplayValue)(nextValue);
      }
    },
    [updateDisplayValue],
  );

  return <Animated.Text className={className}>{displayValue}</Animated.Text>;
}

export const AnimatedCounter = memo(AnimatedCounterComponent);
