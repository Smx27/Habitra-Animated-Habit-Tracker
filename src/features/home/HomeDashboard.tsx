import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, type ListRenderItem, View } from 'react-native';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CompletionConfetti } from '@/components/CompletionConfetti';
import { HabitCard } from '@/components/habit/HabitCard';
import { HabitCardSkeleton } from '@/components/habit/HabitCardSkeleton';
import { FAB } from '@/components/ui';
import { AddHabitModal } from '@/features/habits/AddHabitModal';
import { calculateCurrentStreak, isCompletedOnDate } from '@/features/habits/utils/streak';
import { useHabitActions } from '@/hooks/useHabitActions';
import { selectDailyProgress, selectHabits, useHabitStore } from '@/store/habitStore';
import { useThemeTokens } from '@/theme';
import type { AddHabitPayload, Habit } from '@/types/habit';
import { cn } from '@/utils/cn';

import { HeaderSection } from './HeaderSection';
import { ProgressSection } from './ProgressSection';

type HabitListItemProps = {
  habit: Habit;
  completedToday: boolean;
  streak: number;
  index: number;
  onOpenHabit: (habitId: Habit['id']) => void;
  onCompleteHabit: (habitId: Habit['id']) => void;
  onCompletionTransition: (habitId: Habit['id']) => void;
};

const getTodayISODate = () => new Date().toISOString().split('T')[0];

const HYDRATE_WINDOW_MS = 550;
const SKELETON_CARD_COUNT = 5;
const SKELETON_IDS = Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => `skeleton-${index}`);

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const HabitListItem = memo(function HabitListItem({
  habit,
  completedToday,
  streak,
  index,
  onOpenHabit,
  onCompleteHabit,
  onCompletionTransition,
}: HabitListItemProps) {
  return (
    <HabitCard
      habit={habit}
      index={index}
      completedToday={completedToday}
      streak={streak}
      onPress={onOpenHabit}
      onComplete={onCompleteHabit}
      onToggleCompletion={onCompleteHabit}
      onCompletionTransition={onCompletionTransition}
    />
  );
});

export function HomeDashboard() {
  const router = useRouter();
  const dailyProgress = useHabitStore(selectDailyProgress);
  const { completed: completedCount, percent: completionPercent } = dailyProgress;
  const habits = useHabitStore(selectHabits);
  const addHabit = useHabitStore((state) => state.addHabit);
  const { handleCompleteHabit } = useHabitActions();
  const { color, spacing, typography, themeProgress } = useThemeTokens();
  const insets = useSafeAreaInsets();
  const [isAddHabitOpen, setAddHabitOpen] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);
  const [confettiPlayKey, setConfettiPlayKey] = useState(0);
  const [isHydrating, setHydrating] = useState(true);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHydrating(false);
    }, HYDRATE_WINDOW_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    contentOpacity.value = withTiming(isHydrating ? 0 : 1, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [contentOpacity, isHydrating]);

  const skeletonOpacityStyle = useAnimatedStyle(() => ({
    opacity: 1 - contentOpacity.value,
  }));

  const contentOpacityStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const lightGradientStyle = useAnimatedStyle(() => ({
    opacity: 1 - themeProgress.value,
  }));

  const darkGradientStyle = useAnimatedStyle(() => ({
    opacity: themeProgress.value,
  }));

  const animatedSectionTitleStyle = useAnimatedStyle(() => ({
    color: interpolateColor(themeProgress.value, [0, 1], ['#1e293b', '#f8fafc']),
  }));

  const handleOpenHabit = useCallback(
    (habitId: Habit['id']) => {
      router.push(`/habit/${habitId}`);
    },
    [router],
  );

  const handleCompleteHabitPress = useCallback(
    (habitId: Habit['id']) => {
      void handleCompleteHabit(habitId);
    },
    [handleCompleteHabit],
  );

  const handleCompletionTransition = useCallback(() => {
    setConfettiPlayKey((current) => current + 1);
    setConfettiVisible(true);
  }, []);

  const renderHabitItem = useCallback<ListRenderItem<Habit>>(
    ({ item, index }) => {
      const today = getTodayISODate();
      const completedToday = isCompletedOnDate(item, today);
      const streak = calculateCurrentStreak(item.completedDates, today);

      return (
        <HabitListItem
          habit={item}
          completedToday={completedToday}
          streak={streak}
          index={index}
          onOpenHabit={handleOpenHabit}
          onCompleteHabit={handleCompleteHabitPress}
          onCompletionTransition={handleCompletionTransition}
        />
      );
    },
    [handleCompleteHabitPress, handleCompletionTransition, handleOpenHabit],
  );

  const renderSkeletonItem = useCallback<ListRenderItem<string>>(({ index }) => <HabitCardSkeleton index={index} />, []);

  const contentContainerStyle = useMemo(
    () => ({
      paddingTop: insets.top + 16,
      paddingBottom: insets.bottom + 112,
    }),
    [insets.bottom, insets.top],
  );

  const headerComponent = useMemo(
    () => (
      <View className="gap-5 pb-2">
        <HeaderSection completedCount={completedCount} />
        <ProgressSection completedCount={completedCount} completionPercent={completionPercent} />
        <Animated.Text style={animatedSectionTitleStyle} className={typography.subheading}>
          Habit List
        </Animated.Text>
      </View>
    ),
    [animatedSectionTitleStyle, completedCount, completionPercent, typography.subheading],
  );

  const handleSaveHabit = useCallback(
    (payload: AddHabitPayload) => {
      addHabit(payload);
    },
    [addHabit],
  );

  return (
    <View className="flex-1">
      <StatusBar style={color.statusBarStyle} />
      <AnimatedLinearGradient
        colors={['#eef2ff', '#e0e7ff', '#dbeafe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
        style={lightGradientStyle}
      />
      <AnimatedLinearGradient
        colors={['#020617', '#1e1b4b', '#312e81']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
        style={darkGradientStyle}
      />

      <Animated.View className="absolute inset-0" pointerEvents="none" style={skeletonOpacityStyle}>
        <FlatList
          data={SKELETON_IDS}
          keyExtractor={(item) => item}
          initialNumToRender={SKELETON_CARD_COUNT}
          scrollEnabled={false}
          contentContainerClassName={cn('gap-3', spacing.screenX)}
          contentContainerStyle={contentContainerStyle}
          ListHeaderComponent={headerComponent}
          renderItem={renderSkeletonItem}
        />
      </Animated.View>

      <Animated.View className="flex-1" style={contentOpacityStyle}>
        <FlatList
          data={habits}
          keyExtractor={(habit) => habit.id}
          initialNumToRender={8}
          windowSize={7}
          removeClippedSubviews
          maxToRenderPerBatch={8}
          updateCellsBatchingPeriod={40}
          contentContainerClassName={cn('gap-3', spacing.screenX)}
          contentContainerStyle={contentContainerStyle}
          ListHeaderComponent={headerComponent}
          renderItem={renderHabitItem}
        />
      </Animated.View>

      <FAB accessibilityLabel="Create habit" onPress={() => setAddHabitOpen(true)} />

      <CompletionConfetti
        visible={confettiVisible}
        playKey={confettiPlayKey}
        onAnimationFinish={() => setConfettiVisible(false)}
      />

      <AddHabitModal visible={isAddHabitOpen} onClose={() => setAddHabitOpen(false)} onSave={handleSaveHabit} />
    </View>
  );
}
