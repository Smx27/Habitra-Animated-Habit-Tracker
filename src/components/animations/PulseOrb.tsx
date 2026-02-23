import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { useThemeTokens } from '@/theme';

export function PulseOrb() {
  const pulse = useSharedValue(1);
  const { palette } = useThemeTokens();

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.1, { duration: 1000 }), -1, true);
  }, [pulse]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View style={animatedStyle} className="mb-4">
      <Svg width={72} height={72} viewBox="0 0 72 72">
        <Circle cx={36} cy={36} r={30} fill={palette.orbCore} opacity={0.25} />
        <Circle cx={36} cy={36} r={20} fill={palette.orbCore} />
      </Svg>
    </Animated.View>
  );
}
