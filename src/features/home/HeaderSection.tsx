import { BlurView } from 'expo-blur';
import { Pressable, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type HeaderSectionProps = {
  completedCount: number;
};

export function HeaderSection({ completedCount }: HeaderSectionProps) {
  const { color, radius, typography, themeMode, toggleTheme, themeProgress } = useThemeTokens();

  const animatedSurfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(themeProgress.value, [0, 1], ['rgba(255,255,255,0.75)', 'rgba(15,23,42,0.78)']),
  }));

  const animatedHeadingStyle = useAnimatedStyle(() => ({
    color: interpolateColor(themeProgress.value, [0, 1], ['#0f172a', '#f8fafc']),
  }));

  return (
    <BlurView intensity={35} tint="default" className={cn('overflow-hidden border border-white/20 p-5', radius.card, color.surfaceClass)}>
      <Animated.View style={animatedSurfaceStyle} className="absolute inset-0" pointerEvents="none" />
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className={cn(typography.caption, color.textMutedClass)}>Good morning</Text>
          <Pressable onPress={toggleTheme} className="rounded-full border border-white/30 px-3 py-1.5">
            <Text className={cn(typography.caption, color.textMutedClass)}>
              {themeMode === 'system' ? 'Theme: Auto' : `Theme: ${themeMode === 'dark' ? 'Dark' : 'Light'}`}
            </Text>
          </Pressable>
        </View>
        <Animated.Text style={animatedHeadingStyle} className={typography.heading}>
          Ready to make today count?
        </Animated.Text>
        <Text muted className={typography.body}>
          You have completed {completedCount} habits today.
        </Text>
      </View>
    </BlurView>
  );
}
