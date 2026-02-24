import { BlurView } from 'expo-blur';
import { memo, useEffect, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import type { Habit } from '@/types/habit';
import { cn } from '@/utils/cn';

type StreakHeatmapCalendarProps = {
  habits: Habit[];
  weeksToRender?: number;
};

type HeatmapDay = {
  date: string;
  completions: number;
  intensity: number;
};

const DAYS_PER_WEEK = 7;
const DEFAULT_WEEKS = 16;

const formatDateLabel = (isoDate: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${isoDate}T00:00:00.000Z`));

const getISODate = (date: Date) => date.toISOString().split('T')[0];

const buildHeatmap = (habits: Habit[], weeksToRender: number) => {
  const totalDays = weeksToRender * DAYS_PER_WEEK;
  const today = new Date();
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const start = new Date(end);
  start.setUTCDate(end.getUTCDate() - totalDays + 1);

  const completionsByDate = new Map<string, number>();
  habits.forEach((habit) => {
    habit.completedDates.forEach((completedDate) => {
      completionsByDate.set(completedDate, (completionsByDate.get(completedDate) ?? 0) + 1);
    });
  });

  const maxCompletionsInDay = Math.max(1, habits.length);
  const days: HeatmapDay[] = [];

  for (let offset = 0; offset < totalDays; offset += 1) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + offset);
    const isoDate = getISODate(date);
    const completions = completionsByDate.get(isoDate) ?? 0;

    days.push({
      date: isoDate,
      completions,
      intensity: Math.min(completions / maxCompletionsInDay, 1),
    });
  }

  const weeks: HeatmapDay[][] = [];

  for (let index = 0; index < days.length; index += DAYS_PER_WEEK) {
    weeks.push(days.slice(index, index + DAYS_PER_WEEK));
  }

  return { days, weeks };
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const HeatmapCell = memo(function HeatmapCell({ day, scheme }: { day: HeatmapDay; scheme: 'light' | 'dark' }) {
  const hoverValue = useSharedValue(0);
  const pressValue = useSharedValue(0);
  const intensityValue = useSharedValue(day.intensity);

  useEffect(() => {
    intensityValue.value = withTiming(day.intensity, {
      duration: 420,
      easing: Easing.out(Easing.cubic),
    });
  }, [day.intensity, intensityValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const baseColor = scheme === 'dark' ? '#1e293b' : '#dbeafe';
    const activeColor = scheme === 'dark' ? '#22c55e' : '#16a34a';
    const interactionLift = hoverValue.value * 0.06 + pressValue.value * 0.09;

    return {
      backgroundColor: interpolateColor(intensityValue.value, [0, 1], [baseColor, activeColor]),
      transform: [{ scale: 1 + hoverValue.value * 0.08 - pressValue.value * 0.12 }],
      opacity: 0.88 + interactionLift,
    };
  });

  return (
    <AnimatedPressable
      onHoverIn={() => {
        hoverValue.value = withTiming(1, { duration: 170 });
      }}
      onHoverOut={() => {
        hoverValue.value = withTiming(0, { duration: 170 });
      }}
      onPressIn={() => {
        pressValue.value = withTiming(1, { duration: 120 });
      }}
      onPressOut={() => {
        pressValue.value = withTiming(0, { duration: 180 });
      }}
      accessibilityRole="button"
      accessibilityLabel={`${day.completions} habits completed on ${formatDateLabel(day.date)}`}
      className="h-3.5 w-3.5 rounded-[4px]"
      style={animatedStyle}
    />
  );
});

export function StreakHeatmapCalendar({ habits, weeksToRender = DEFAULT_WEEKS }: StreakHeatmapCalendarProps) {
  const { color, radius, typography, scheme } = useThemeTokens();

  const { days, weeks } = useMemo(() => buildHeatmap(habits, weeksToRender), [habits, weeksToRender]);

  const activeDays = useMemo(() => days.filter((day) => day.completions > 0).length, [days]);
  const consistencyRate = Math.round((activeDays / days.length) * 100);

  const monthLabels = useMemo(
    () =>
      weeks.map((week, weekIndex) => {
        const topDay = week[0];
        const month = new Date(`${topDay.date}T00:00:00.000Z`).toLocaleString('en-US', { month: 'short' });
        return {
          key: `${topDay.date}-${weekIndex}`,
          month,
          isBoundary: weekIndex === 0 || week[0].date.endsWith('-01'),
        };
      }),
    [weeks],
  );

  return (
    <BlurView intensity={44} tint="default" className={cn('overflow-hidden border border-white/25 p-4', radius.card, color.surfaceClass)}>
      <View className="gap-3">
        <View className="gap-1">
          <Text className={cn(typography.title, color.textPrimaryClass)}>Consistency streak map</Text>
          <Text muted className={typography.bodySmall}>
            {consistencyRate}% active days over the last {weeksToRender} weeks
          </Text>
        </View>

        <View className="gap-2">
          <View className="flex-row justify-between px-0.5">
            {monthLabels.map((label) => (
              <Text key={label.key} muted className="text-[10px]">
                {label.isBoundary ? label.month : ''}
              </Text>
            ))}
          </View>

          <View className="flex-row gap-1">
            {weeks.map((week) => (
              <View key={week[0].date} className="gap-1">
                {week.map((day) => (
                  <HeatmapCell key={day.date} day={day} scheme={scheme} />
                ))}
              </View>
            ))}
          </View>
        </View>
      </View>
    </BlurView>
  );
}
