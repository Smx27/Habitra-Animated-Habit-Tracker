import { BlurView } from 'expo-blur';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import { type AddHabitPayload, HABIT_CATEGORY_COLORS, type HabitCategory } from '@/types/habit';
import { cn } from '@/utils/cn';
import { triggerImpact } from '@/utils/haptics';

import { ColorPickerRow } from './components/ColorPickerRow';
import { IconPickerRow } from './components/IconPickerRow';
import { SaveHabitButton } from './components/SaveHabitButton';

type AddHabitModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (payload: AddHabitPayload) => void;
};

const ICON_OPTIONS = ['✨', '💪', '📚', '🧘', '💧', '🌙', '🏃', '📝'];

const COLOR_OPTIONS: Array<{ category: HabitCategory; color: string; label: string }> = [
  { category: 'health', color: HABIT_CATEGORY_COLORS.health.accent, label: 'Health' },
  { category: 'mindfulness', color: HABIT_CATEGORY_COLORS.mindfulness.accent, label: 'Mind' },
  { category: 'learning', color: HABIT_CATEGORY_COLORS.learning.accent, label: 'Learning' },
  { category: 'productivity', color: HABIT_CATEGORY_COLORS.productivity.accent, label: 'Work' },
  { category: 'wellness', color: HABIT_CATEGORY_COLORS.wellness.accent, label: 'Wellness' },
];

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function AddHabitModal({ visible, onClose, onSave }: AddHabitModalProps) {
  const { color, radius, typography } = useThemeTokens();
  const [isMounted, setIsMounted] = useState(visible);
  const [title, setTitle] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>('wellness');

  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(520);

  const resetForm = useCallback(() => {
    setTitle('');
    setSelectedIcon(ICON_OPTIONS[0]);
    setSelectedCategory('wellness');
  }, []);

  const animateIn = useCallback(() => {
    backdropOpacity.value = withTiming(1, { duration: 180 });
    translateY.value = withSpring(0, { damping: 20, stiffness: 180, mass: 0.9 });
  }, [backdropOpacity, translateY]);

  const hideWithoutClose = useCallback(() => {
    setIsMounted(false);
  }, []);

  const animateOut = useCallback(
    (onDone?: () => void) => {
      backdropOpacity.value = withTiming(0, { duration: 150 });
      translateY.value = withTiming(520, { duration: 220 }, (finished) => {
        if (!finished) {
          return;
        }

        runOnJS(hideWithoutClose)();
        if (onDone) {
          runOnJS(onDone)();
        }
      });
    },
    [backdropOpacity, hideWithoutClose, translateY],
  );

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      animateIn();
      return;
    }

    if (isMounted) {
      animateOut();
    }
  }, [animateIn, animateOut, isMounted, visible]);

  const closeWithAnimation = useCallback(() => {
    void triggerImpact();
    animateOut(onClose);
  }, [animateOut, onClose]);

  const handleSave = useCallback(() => {
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      return;
    }

    void triggerImpact();

    onSave({
      title: cleanTitle,
      icon: selectedIcon,
      category: selectedCategory,
      accentColor: HABIT_CATEGORY_COLORS[selectedCategory].accent,
    });

    resetForm();
    animateOut(onClose);
  }, [animateOut, onClose, onSave, resetForm, selectedCategory, selectedIcon, title]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const isSaveDisabled = useMemo(() => title.trim().length === 0, [title]);

  if (!isMounted) {
    return null;
  }

  return (
    <View className="absolute inset-0 z-50 justify-end">
      <Pressable onPress={closeWithAnimation} className="absolute inset-0">
        <AnimatedBlurView intensity={50} tint="dark" style={[{ flex: 1 }, backdropStyle]} />
      </Pressable>

      <Animated.View style={sheetStyle} className={cn('rounded-t-3xl border border-white/20 px-5 pb-8 pt-5', color.surfaceClass, radius.card)}>
        <View className="mb-4 flex-row items-center justify-between">
          <Text className={cn(typography.subheading, color.textPrimaryClass)}>Add Habit</Text>
          <Pressable onPress={closeWithAnimation} className="rounded-xl bg-white/10 px-3 py-2">
            <Text className={cn(typography.caption, color.textPrimaryClass)}>Close</Text>
          </Pressable>
        </View>

        <View className="gap-4">
          <View className="gap-2">
            <Text className={cn(typography.caption, color.textMutedClass)}>Title</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What habit do you want to build?"
              placeholderTextColor="rgba(148,163,184,0.9)"
              className={cn('rounded-2xl border border-white/20 bg-white/10 px-4 py-3', color.textPrimaryClass)}
            />
          </View>

          <IconPickerRow icons={ICON_OPTIONS} selectedIcon={selectedIcon} onSelect={setSelectedIcon} />
          <ColorPickerRow options={COLOR_OPTIONS} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
          <SaveHabitButton disabled={isSaveDisabled} onPress={handleSave} />
        </View>
      </Animated.View>
    </View>
  );
}
