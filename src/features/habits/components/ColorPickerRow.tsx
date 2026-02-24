import { memo, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type ColorPickerRowProps = {
  options: readonly string[];
  selectedColor: string;
  onSelect: (color: string) => void;
};

type ColorChipProps = {
  colorValue: string;
  isSelected: boolean;
  onSelect: (color: string) => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.View;

const ColorChip = memo(function ColorChip({ colorValue, isSelected, onSelect }: ColorChipProps) {
  const selectionProgress = useSharedValue(isSelected ? 1 : 0);
  const pressProgress = useSharedValue(0);

  useEffect(() => {
    selectionProgress.value = withTiming(isSelected ? 1 : 0, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
  }, [isSelected, selectionProgress]);

  const chipStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale:
          interpolate(selectionProgress.value, [0, 1], [1, 1.08]) *
          interpolate(pressProgress.value, [0, 1], [1, 0.92]),
      },
    ],
    opacity: interpolate(selectionProgress.value, [0, 1], [0.55, 1]),
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + selectionProgress.value * 0.6,
    borderColor: interpolateColor(selectionProgress.value, [0, 1], ['rgba(255,255,255,0.28)', 'rgba(255,255,255,0.9)']),
    transform: [{ scale: interpolate(selectionProgress.value, [0, 1], [0.8, 1]) }],
  }));

  const highlightStyle = useAnimatedStyle(() => ({
    opacity: interpolate(selectionProgress.value, [0, 1], [0.2, 1]),
    backgroundColor: interpolateColor(
      selectionProgress.value,
      [0, 1],
      ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.28)'],
    ),
    transform: [{ scale: interpolate(selectionProgress.value, [0, 1], [0.86, 1.04]) }],
  }));

  const handlePressIn = () => {
    pressProgress.value = withSpring(1, { damping: 16, stiffness: 280, mass: 0.4 });
  };

  const handlePressOut = () => {
    pressProgress.value = withSpring(0, { damping: 14, stiffness: 230, mass: 0.45 });
  };

  return (
    <AnimatedPressable
      onPress={() => onSelect(colorValue)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={chipStyle}
      className="h-9 w-9 items-center justify-center rounded-full"
    >
      <AnimatedView style={ringStyle} className="absolute inset-0 rounded-full border-2 border-white/80" />
      <AnimatedView style={highlightStyle} className="absolute inset-[4px] rounded-full" />
      <View style={{ backgroundColor: colorValue }} className="h-5 w-5 rounded-full" />
    </AnimatedPressable>
  );
});

export const ColorPickerRow = memo(function ColorPickerRow({ options, selectedColor, onSelect }: ColorPickerRowProps) {
  const { color, typography } = useThemeTokens();

  return (
    <View className="gap-2">
      <Text className={cn(typography.caption, color.textMutedClass)}>Color</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => (
          <ColorChip key={option} colorValue={option} isSelected={option === selectedColor} onSelect={onSelect} />
        ))}
      </View>
    </View>
  );
});
