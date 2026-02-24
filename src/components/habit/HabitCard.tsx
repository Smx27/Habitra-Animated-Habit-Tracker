import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, View, type LayoutChangeEvent } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeInDown,
  Layout,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { Text } from '@/components/ui';
import {
  COMPLETION_SPRING_CONFIG,
  MAX_SWIPE_RATIO,
  PRESS_SCALE_ACTIVE,
  PRESS_SPRING_CONFIG,
  SWIPE_COMPLETE_THRESHOLD_RATIO,
  SWIPE_SPRING_CONFIG,
} from '@/components/habit/habitCard.constants';
import { useCompletionBackgroundStyle, useCompletionCheckStyle } from '@/components/habit/habitCard.animations';
import { HABIT_CATEGORY_COLORS, type Habit, type HabitCategory } from '@/types/habit';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

export interface HabitCardProps {
  onCompletionTransition?: (habitId: Habit['id']) => void;
  habit: Pick<Habit, 'id' | 'title' | 'icon' | 'category' | 'streak' | 'completedToday' | 'accentColor'>;
  onPress: (habitId: Habit['id']) => void;
  onComplete: (habitId: Habit['id']) => void | Promise<void>;
  onToggleCompletion?: (habitId: Habit['id']) => void | Promise<void>;
  disabled?: boolean;
  testID?: string;
  index?: number;
}

const categoryLabelMap: Record<HabitCategory, string> = {
  health: 'Health',
  mindfulness: 'Mindfulness',
  learning: 'Learning',
  productivity: 'Productivity',
  wellness: 'Wellness',
};

function HabitCardComponent({
  habit,
  onPress,
  onComplete,
  onToggleCompletion,
  onCompletionTransition,
  disabled = false,
  testID,
  index = 0,
}: HabitCardProps) {
  const { color, radius, shadows, spacing, scheme, typography } = useThemeTokens();
  const [cardWidth, setCardWidth] = useState(1);
  const completionTriggeredRef = useRef(false);

  const translateX = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const completionProgress = useSharedValue(habit.completedToday ? 1 : 0);

  const categoryColors = HABIT_CATEGORY_COLORS[habit.category];
  const accentColor = habit.accentColor ?? categoryColors.accent;

  useEffect(() => {
    completionTriggeredRef.current = false;
    completionProgress.value = withSpring(habit.completedToday ? 1 : 0, COMPLETION_SPRING_CONFIG);
    if (!habit.completedToday) {
      translateX.value = withSpring(0, SWIPE_SPRING_CONFIG);
    }
  }, [completionProgress, habit.completedToday, translateX]);

  const triggerCompletion = useCallback(() => {
    if (completionTriggeredRef.current || habit.completedToday) {
      return;
    }

    completionTriggeredRef.current = true;
    completionProgress.value = withSpring(1, COMPLETION_SPRING_CONFIG);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onCompletionTransition?.(habit.id);
    void onComplete(habit.id);
  }, [completionProgress, habit.completedToday, habit.id, onComplete, onCompletionTransition]);

  const handlePressIn = useCallback(() => {
    pressScale.value = withSpring(PRESS_SCALE_ACTIVE, PRESS_SPRING_CONFIG);
  }, [pressScale]);

  const handlePressOut = useCallback(() => {
    pressScale.value = withSpring(1, PRESS_SPRING_CONFIG);
  }, [pressScale]);

  const handleMainPress = useCallback(() => {
    if (disabled) {
      return;
    }

    onPress(habit.id);
  }, [disabled, habit.id, onPress]);

  const handleTogglePress = useCallback(() => {
    if (disabled) {
      return;
    }

    if (habit.completedToday && onToggleCompletion) {
      void onToggleCompletion(habit.id);
      return;
    }

    triggerCompletion();
  }, [disabled, habit.completedToday, habit.id, onToggleCompletion, triggerCompletion]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled && Platform.OS !== 'web')
        .activeOffsetX(10)
        .onUpdate((event) => {
          const clamped = Math.max(0, Math.min(event.translationX, cardWidth * MAX_SWIPE_RATIO));
          translateX.value = clamped;
        })
        .onEnd(() => {
          const threshold = cardWidth * SWIPE_COMPLETE_THRESHOLD_RATIO;
          const shouldComplete = translateX.value >= threshold && !habit.completedToday;

          if (shouldComplete) {
            translateX.value = withSpring(cardWidth * 0.18, SWIPE_SPRING_CONFIG);
            runOnJS(triggerCompletion)();
            return;
          }

          translateX.value = withSpring(0, SWIPE_SPRING_CONFIG);
        }),
    [cardWidth, disabled, habit.completedToday, translateX, triggerCompletion],
  );

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { scale: pressScale.value }],
  }));

  const completionBackgroundStyle = useCompletionBackgroundStyle(completionProgress);
  const checkAnimatedStyle = useCompletionCheckStyle(completionProgress);

  return (
    <Animated.View
      layout={Layout.springify().damping(18).stiffness(180)}
      entering={FadeInDown.delay(index * 60).springify().damping(20).stiffness(210)}
      className="w-full"
      testID={testID}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[cardAnimatedStyle]}>
          <LinearGradient
            colors={[`${accentColor}66`, `${accentColor}22`, 'rgba(255,255,255,0.08)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={cn('rounded-3xl p-[1px]')}
            onLayout={(event: LayoutChangeEvent) => {
              setCardWidth(event.nativeEvent.layout.width);
            }}
          >
            <BlurView
              intensity={42}
              tint={scheme}
              className={cn('overflow-hidden border border-white/20', radius.card, color.cardBackgroundClass)}
            >
              <Animated.View style={completionBackgroundStyle}>
                <Pressable
                  className={cn('flex-row items-center justify-between', spacing.cardPadding, shadows.card)}
                  onPress={handleMainPress}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  accessibilityRole="button"
                  accessibilityLabel={`${habit.title}, ${habit.completedToday ? 'completed' : 'not completed'}`}
                  accessibilityHint="Tap to open habit details or swipe right to complete."
                  disabled={disabled}
                >
                  <View className="flex-1 flex-row items-center gap-3">
                    <View className={cn('size-11 items-center justify-center border border-white/30 bg-white/20', radius.pill)}>
                      <Text className="text-xl">{habit.icon ?? '✨'}</Text>
                    </View>

                    <View className="flex-1 gap-1">
                      <View className="flex-row items-center gap-2">
                        <Text className={cn(typography.body, habit.completedToday ? 'text-emerald-300' : undefined)}>{habit.title}</Text>
                        <View className={cn('rounded-full bg-black/15 px-2 py-0.5')}>
                          <Text className="text-xs text-amber-200">🔥 {habit.streak}</Text>
                        </View>
                      </View>

                      <View className="flex-row items-center gap-2">
                        <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: categoryColors.background }}>
                          <Text className="text-[11px] font-medium" style={{ color: categoryColors.text }}>
                            {categoryLabelMap[habit.category]}
                          </Text>
                        </View>
                        <Text className={cn(typography.caption, habit.completedToday ? 'text-emerald-300/80' : color.textMutedClass)}>
                          {habit.completedToday ? 'Completed today' : 'Swipe right or tap check'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="ml-4 flex-row items-center gap-2">
                    <Animated.View
                      className={cn('size-8 items-center justify-center rounded-full bg-emerald-500/20')}
                      style={checkAnimatedStyle}
                    >
                      <Text className="text-base text-emerald-300">✓</Text>
                    </Animated.View>

                    <Pressable
                      className={cn(
                        'size-9 items-center justify-center border',
                        radius.pill,
                        habit.completedToday ? 'border-emerald-300/70 bg-emerald-400/20' : 'border-white/35 bg-white/10',
                      )}
                      onPress={handleTogglePress}
                      accessibilityRole="button"
                      accessibilityLabel={habit.completedToday ? `Mark ${habit.title} incomplete` : `Mark ${habit.title} complete`}
                      accessibilityHint={habit.completedToday ? 'Double tap to undo completion.' : 'Double tap to complete this habit.'}
                      disabled={disabled}
                    >
                      <Text className={cn(typography.body, habit.completedToday ? 'text-emerald-300' : color.textMutedClass)}>
                        {habit.completedToday ? '✓' : '○'}
                      </Text>
                    </Pressable>
                  </View>
                </Pressable>
              </Animated.View>
            </BlurView>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

export const HabitCard = memo(HabitCardComponent);
