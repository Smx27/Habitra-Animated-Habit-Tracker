import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { SuccessLottie } from '@/components/SuccessLottie';
import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';
import { triggerImpact } from '@/utils/haptics';

type PremiumOnboardingProps = {
  visible: boolean;
  onStart: () => void;
};

export function PremiumOnboarding({ visible, onStart }: PremiumOnboardingProps) {
  const { color, radius, typography } = useThemeTokens();
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [glow]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + glow.value * 0.45,
    transform: [{ scale: 0.92 + glow.value * 0.1 }],
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn.duration(280)} exiting={FadeOut.duration(220)} className="absolute inset-0 z-[70] justify-end">
      <LinearGradient colors={['rgba(2,6,23,0.35)', 'rgba(15,23,42,0.92)']} className="absolute inset-0" />
      <BlurView intensity={55} tint="dark" className={cn('border-t border-white/20 p-6', color.surfaceClass, radius.card)}>
        <View className="items-center gap-5">
          <Animated.View style={glowStyle} className="absolute top-4 h-36 w-36 rounded-full bg-violet-400/25" />
          <SuccessLottie />
          <View className="items-center gap-2">
            <Text className={cn(typography.hero, 'text-center text-slate-50')}>Welcome to Habitra</Text>
            <Text className={cn(typography.body, 'text-center text-slate-200')}>
              Craft meaningful routines with cinematic motion, thoughtful streak tracking, and daily ritual clarity.
            </Text>
          </View>

          <Pressable
            className="w-full rounded-2xl border border-white/30 bg-white/15 px-5 py-4"
            onPress={() => {
              void triggerImpact();
              onStart();
            }}
          >
            <Text className={cn(typography.button, 'text-center text-white')}>Start premium experience</Text>
          </Pressable>
        </View>
      </BlurView>
    </Animated.View>
  );
}
