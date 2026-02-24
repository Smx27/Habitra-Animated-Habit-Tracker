import { BlurView } from 'expo-blur';
import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';
import { triggerImpact } from '@/utils/haptics';

type EmptyStateCardProps = {
  onCreateHabit: () => void;
};

export function EmptyStateCard({ onCreateHabit }: EmptyStateCardProps) {
  const { color, radius, typography } = useThemeTokens();
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [float]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -8 * float.value }],
  }));

  return (
    <BlurView intensity={38} tint="default" className={cn('overflow-hidden border border-white/25 p-5', radius.card, color.surfaceClass)}>
      <View className="gap-5">
        <View className="items-center gap-3">
          <Animated.View style={orbStyle} className="h-28 w-28 items-center justify-center rounded-full bg-indigo-400/20">
            <View className="h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/15">
              <Text className="text-3xl">🌱</Text>
            </View>
          </Animated.View>
          <View className="items-center gap-1">
            <Text className={cn(typography.title, color.textPrimaryClass)}>Start your first habit journey</Text>
            <Text className={cn(typography.bodySmall, color.textMutedClass, 'text-center')}>
              Build momentum with one tiny daily promise. Add your first habit and unlock streak celebrations.
            </Text>
          </View>
        </View>

        <Pressable
          className="rounded-2xl border border-white/30 bg-white/10 px-4 py-3"
          onPress={() => {
            void triggerImpact();
            onCreateHabit();
          }}
        >
          <Text className={cn(typography.button, color.textPrimaryClass, 'text-center')}>Create your first habit</Text>
        </Pressable>
      </View>
    </BlurView>
  );
}
