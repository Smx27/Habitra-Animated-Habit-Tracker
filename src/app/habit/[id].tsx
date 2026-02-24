import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { AnimatedProgressRing } from '@/components/habit/AnimatedProgressRing';
import { Text } from '@/components/ui';
import { calculateCurrentStreak, isCompletedOnDate } from '@/features/habits/utils/streak';
import { useHabitActions } from '@/hooks/useHabitActions';
import { useHabitStore } from '@/store/habitStore';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

const HISTORY_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

const getTodayISODate = () => new Date().toISOString().split('T')[0];

const toIsoDay = (timestamp: number) => new Date(timestamp).toISOString().split('T')[0];

type DayHistory = {
  label: string;
  isoDate: string;
  completed: boolean;
};

function buildHistory(completedDates: string[]): DayHistory[] {
  const today = new Date();
  const dateSet = new Set(completedDates);

  return Array.from({ length: HISTORY_DAYS }, (_, index) => {
    const offset = HISTORY_DAYS - 1 - index;
    const timestamp = today.getTime() - offset * DAY_MS;
    const date = new Date(timestamp);
    const isoDate = toIsoDay(timestamp);

    return {
      label: date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2),
      isoDate,
      completed: dateSet.has(isoDate),
    };
  });
}

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { spacing, typography } = useThemeTokens();
  const insets = useSafeAreaInsets();
  const habits = useHabitStore((state) => state.habits);
  const habit = useMemo(() => habits.find((item) => item.id === id), [habits, id]);
  const { handleCompleteHabit } = useHabitActions();

  const today = getTodayISODate();
  const completedToday = habit ? isCompletedOnDate(habit, today) : false;
  const streak = habit ? calculateCurrentStreak(habit.completedDates, today) : 0;
  const completionPercent = habit
    ? Math.min(habit.completedDates.length / Math.max(Math.ceil((Date.now() - habit.createdAt.getTime()) / DAY_MS) + 1, 1), 1)
    : 0;
  const history = habit ? buildHistory(habit.completedDates) : [];

  return (
    <View className="flex-1 bg-slate-950">
      <Stack.Screen options={{ title: habit?.title ?? 'Habit details' }} />
      <LinearGradient colors={['#020617', '#1e1b4b', '#312e81']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute inset-0" />

      {!habit ? (
        <View className={cn('flex-1 items-center justify-center px-8', spacing.screenX)}>
          <Animated.View entering={FadeInUp.springify().damping(16)} className="items-center gap-3">
            <Text className={cn('text-2xl', typography.heading)}>Habit not found</Text>
            <Text muted className="text-center">
              This habit id does not exist anymore. Return to the dashboard and pick another habit.
            </Text>
          </Animated.View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 }} className={cn('flex-1', spacing.screenX)}>
          <Animated.View entering={FadeInDown.delay(60).springify()} layout={Layout.springify()} className="mb-5 gap-2">
            <Text className={cn(typography.caption, 'uppercase tracking-[2px] text-indigo-200/80')}>Habit stats</Text>
            <Text className={cn(typography.heading, 'text-white')}>{habit.title}</Text>
            <Text muted>
              {completedToday ? 'Completed today. Great consistency.' : 'Not completed today yet. Keep your streak alive.'}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(130).springify()} layout={Layout.springify()} className="mb-4 rounded-3xl border border-white/20 bg-white/10 p-5">
            <View className="items-center gap-4">
              <AnimatedProgressRing completionPercent={completionPercent} label="Completion rate" size={132} strokeWidth={11} />
              <View className="flex-row items-center gap-8">
                <View className="items-center">
                  <Text className={cn(typography.caption, 'text-slate-300')}>Current streak</Text>
                  <AnimatedCounter value={streak} className={cn(typography.heading, 'text-amber-300')} />
                </View>
                <View className="items-center">
                  <Text className={cn(typography.caption, 'text-slate-300')}>Total completions</Text>
                  <AnimatedCounter value={habit.completedDates.length} className={cn(typography.heading, 'text-emerald-300')} />
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).springify()} layout={Layout.springify()} className="mb-4 rounded-3xl border border-white/20 bg-white/10 p-5">
            <Text className={cn(typography.subheading, 'mb-4 text-white')}>Last 14 days</Text>
            <View className="flex-row items-end justify-between gap-2">
              {history.map((day, index) => (
                <Animated.View
                  key={day.isoDate}
                  entering={FadeInUp.delay(220 + index * 25).springify().damping(18)}
                  className="flex-1 items-center gap-1"
                >
                  <View
                    className={cn('w-full rounded-full', day.completed ? 'bg-emerald-400' : 'bg-white/20')}
                    style={{ height: day.completed ? 42 : 16 }}
                  />
                  <Text className="text-[10px] text-slate-300">{day.label}</Text>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(220).springify()} layout={Layout.springify()} className="rounded-3xl border border-white/20 bg-white/10 p-5">
            <Text className={cn(typography.subheading, 'mb-2 text-white')}>Quick action</Text>
            <Text muted className="mb-4">
              Uses the same completion toggle logic as swipe/check from the dashboard card.
            </Text>
            <Pressable
              onPress={() => {
                void handleCompleteHabit(habit.id);
              }}
              className={cn(
                'items-center justify-center rounded-2xl px-4 py-3',
                completedToday ? 'bg-emerald-500/30' : 'bg-indigo-500/40',
              )}
            >
              <Text className="text-base text-white">{completedToday ? 'Mark incomplete' : 'Mark complete'}</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      )}
    </View>
  );
}
