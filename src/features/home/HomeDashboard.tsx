import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, type ListRenderItem, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CompletionConfetti } from '@/components/CompletionConfetti';
import { HabitCard } from '@/components/habit/HabitCard';
import { HabitCardSkeleton } from '@/components/habit/HabitCardSkeleton';
import { FAB, Text } from '@/components/ui';
import { AddHabitModal } from '@/features/habits/AddHabitModal';
import { useHabitActions } from '@/hooks/useHabitActions';
import { selectCompletedCount, selectCompletionPercent, selectHabits, useHabitStore } from '@/store/habitStore';
import { useThemeTokens } from '@/theme';
import type { AddHabitPayload, Habit } from '@/types/habit';
import { cn } from '@/utils/cn';

import { HeaderSection } from './HeaderSection';
import { ProgressSection } from './ProgressSection';

type HabitListItemProps = {
  habit: Habit;
  index: number;
  onCompleteHabit: (habitId: Habit['id']) => void;
  onCompletionTransition: (habitId: Habit['id']) => void;
};

const HYDRATE_WINDOW_MS = 550;
const SKELETON_CARD_COUNT = 5;
const SKELETON_IDS = Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => `skeleton-${index}`);

const HabitListItem = memo(function HabitListItem({
  habit,
  index,
  onCompleteHabit,
  onCompletionTransition,
}: HabitListItemProps) {
  return (
    <HabitCard
      habit={habit}
      index={index}
      onPress={onCompleteHabit}
      onComplete={onCompleteHabit}
      onToggleCompletion={onCompleteHabit}
      onCompletionTransition={onCompletionTransition}
    />
  );
});

export function HomeDashboard() {
  const completedCount = useHabitStore(selectCompletedCount);
  const completionPercent = useHabitStore(selectCompletionPercent);
  const habits = useHabitStore(selectHabits);
  const addHabit = useHabitStore((state) => state.addHabit);
  const { handleCompleteHabit } = useHabitActions();
  const { color, spacing, scheme, typography } = useThemeTokens();
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

  const gradientColors =
    scheme === 'dark'
      ? (['#020617', '#1e1b4b', '#312e81'] as const)
      : (['#eef2ff', '#e0e7ff', '#dbeafe'] as const);

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
    ({ item, index }) => (
      <HabitListItem
        habit={item}
        index={index}
        onCompleteHabit={handleCompleteHabitPress}
        onCompletionTransition={handleCompletionTransition}
      />
    ),
    [handleCompleteHabitPress, handleCompletionTransition],
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
        <Text className={typography.subheading}>Habit List</Text>
      </View>
    ),
    [completedCount, completionPercent, typography.subheading],
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
      <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />

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
