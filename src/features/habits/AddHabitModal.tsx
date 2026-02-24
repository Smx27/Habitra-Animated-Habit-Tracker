import { BlurView } from 'expo-blur';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedKeyboard,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { HABIT_COLOR_OPTIONS } from '@/constants/habits';
import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import { type AddHabitPayload } from '@/types/habit';
import { cn } from '@/utils/cn';
import { triggerImpact } from '@/utils/haptics';

import { ColorPickerRow } from './components/ColorPickerRow';
import { SaveHabitButton } from './components/SaveHabitButton';

type AddHabitModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (payload: AddHabitPayload) => void;
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export function AddHabitModal({ visible, onClose, onSave }: AddHabitModalProps) {
  const { color, radius, typography } = useThemeTokens();
  const [isMounted, setIsMounted] = useState(visible);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedAccentColor, setSelectedAccentColor] = useState<string>(HABIT_COLOR_OPTIONS[0]);

  const backdropOpacity = useSharedValue(0);
  const translateY = useSharedValue(520);
  const titleEntrance = useSharedValue(0);
  const colorEntrance = useSharedValue(0);
  const buttonEntrance = useSharedValue(0);
  const inputFocusProgress = useSharedValue(0);
  const keyboard = useAnimatedKeyboard();

  const resetForm = useCallback(() => {
    setTitle('');
    setSelectedAccentColor(HABIT_COLOR_OPTIONS[0]);
    setIsSaving(false);
  }, []);

  const animateIn = useCallback(() => {
    backdropOpacity.value = withTiming(1, { duration: 180 });
    translateY.value = withSpring(0, { damping: 20, stiffness: 180, mass: 0.9 });
    titleEntrance.value = withTiming(1, {
      duration: 240,
      easing: Easing.out(Easing.cubic),
    });
    colorEntrance.value = withDelay(
      70,
      withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.cubic),
      }),
    );
    buttonEntrance.value = withDelay(
      140,
      withSpring(1, {
        damping: 16,
        stiffness: 190,
        mass: 0.9,
      }),
    );
  }, [backdropOpacity, translateY]);

  const hideWithoutClose = useCallback(() => {
    setIsMounted(false);
    setIsSaving(false);
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
      titleEntrance.value = withTiming(0, { duration: 120 });
      colorEntrance.value = withTiming(0, { duration: 120 });
      buttonEntrance.value = withTiming(0, { duration: 120 });
      inputFocusProgress.value = withTiming(0, { duration: 120 });
    },
    [backdropOpacity, buttonEntrance, colorEntrance, hideWithoutClose, inputFocusProgress, titleEntrance, translateY],
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
    if (isSaving) {
      return;
    }

    void triggerImpact();
    animateOut(onClose);
  }, [animateOut, isSaving, onClose]);

  const handleSave = useCallback(async () => {
    if (isSaving) {
      return;
    }

    const cleanTitle = title.trim();
    const normalizedTitle = cleanTitle.replace(/\s+/g, ' ');

    if (!normalizedTitle || !selectedAccentColor) {
      return;
    }

    setIsSaving(true);

    try {
      await Promise.resolve(
        onSave({
          title: normalizedTitle,
          color: selectedAccentColor,
        }),
      );

      resetForm();
      animateOut(onClose);
    } finally {
      setIsSaving(false);
    }
  }, [animateOut, isSaving, onClose, onSave, resetForm, selectedAccentColor, title]);

  const handleSelectAccentColor = useCallback((nextColor: string) => {
    setSelectedAccentColor((currentColor) => (currentColor === nextColor ? currentColor : nextColor));
  }, []);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value - keyboard.height.value * 0.35 }],
  }));

  const titleBlockStyle = useAnimatedStyle(() => ({
    opacity: titleEntrance.value,
    transform: [
      { translateY: (1 - titleEntrance.value) * 14 },
      { scale: 0.96 + titleEntrance.value * 0.04 },
    ],
  }));

  const colorBlockStyle = useAnimatedStyle(() => ({
    opacity: colorEntrance.value,
    transform: [
      { translateY: (1 - colorEntrance.value) * 14 },
      { scale: 0.96 + colorEntrance.value * 0.04 },
    ],
  }));

  const buttonBlockStyle = useAnimatedStyle(() => ({
    opacity: buttonEntrance.value,
    transform: [
      { translateY: (1 - buttonEntrance.value) * 12 },
      { scale: 0.95 + buttonEntrance.value * 0.05 },
    ],
  }));

  const inputContainerStyle = useAnimatedStyle(() => ({
    borderColor: inputFocusProgress.value > 0 ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.2)',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.08 + inputFocusProgress.value * 0.28,
    shadowRadius: 8 + inputFocusProgress.value * 10,
    shadowOffset: { width: 0, height: 0 },
    transform: [{ scale: 1 + inputFocusProgress.value * 0.02 }],
  }));

  const handleTitleFocus = useCallback(() => {
    inputFocusProgress.value = withSpring(1, { damping: 18, stiffness: 220, mass: 0.7 });
  }, [inputFocusProgress]);

  const handleTitleBlur = useCallback(() => {
    inputFocusProgress.value = withTiming(0, { duration: 170, easing: Easing.out(Easing.cubic) });
  }, [inputFocusProgress]);

  const isSaveDisabled = useMemo(() => title.trim().length === 0, [title]);

  if (!isMounted) {
    return null;
  }

  return (
    <View className="absolute inset-0 z-50 justify-end">
      <Pressable onPress={closeWithAnimation} disabled={isSaving} className="absolute inset-0">
        <AnimatedBlurView intensity={50} tint="dark" style={[{ flex: 1 }, backdropStyle]} />
      </Pressable>

      <Animated.View style={sheetStyle} className={cn('rounded-t-3xl border border-white/20 px-5 pb-8 pt-5', color.surfaceClass, radius.card)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View className="mb-4 flex-row items-center justify-between">
            <Text className={cn(typography.subheading, color.textPrimaryClass)}>Add Habit</Text>
            <Pressable onPress={closeWithAnimation} disabled={isSaving} className="rounded-xl bg-white/10 px-3 py-2">
              <Text className={cn(typography.caption, color.textPrimaryClass)}>Close</Text>
            </Pressable>
          </View>

          <View className="gap-4">
            <Animated.View style={titleBlockStyle} className="gap-2">
              <Text className={cn(typography.caption, color.textMutedClass)}>Title</Text>
              <Animated.View style={inputContainerStyle} className="rounded-2xl border bg-white/10">
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  onFocus={handleTitleFocus}
                  onBlur={handleTitleBlur}
                  placeholder="What habit do you want to build?"
                  placeholderTextColor="rgba(148,163,184,0.9)"
                  className={cn('px-4 py-3', color.textPrimaryClass)}
                />
              </Animated.View>
            </Animated.View>

            <Animated.View style={colorBlockStyle}>
              <ColorPickerRow options={HABIT_COLOR_OPTIONS} selectedColor={selectedAccentColor} onSelect={handleSelectAccentColor} />
            </Animated.View>
            <Animated.View style={buttonBlockStyle}>
              <SaveHabitButton disabled={isSaveDisabled} isSaving={isSaving} onPress={handleSave} />
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  );
}
