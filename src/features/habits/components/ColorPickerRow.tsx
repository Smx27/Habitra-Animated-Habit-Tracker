import { memo } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import type { HabitCategory } from '@/types/habit';
import { cn } from '@/utils/cn';

type ColorOption = {
  category: HabitCategory;
  color: string;
  label: string;
};

type ColorPickerRowProps = {
  options: ColorOption[];
  selectedCategory: HabitCategory;
  onSelect: (category: HabitCategory) => void;
};

export const ColorPickerRow = memo(function ColorPickerRow({ options, selectedCategory, onSelect }: ColorPickerRowProps) {
  const { color, typography } = useThemeTokens();

  return (
    <View className="gap-2">
      <Text className={cn(typography.caption, color.textMutedClass)}>Color</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option.category === selectedCategory;

          return (
            <Pressable
              key={option.category}
              onPress={() => onSelect(option.category)}
              className={cn(
                'h-9 min-w-9 items-center justify-center rounded-full border px-3',
                isSelected ? 'border-white/70 bg-white/25' : 'border-white/20 bg-white/10',
              )}
            >
              <View style={{ backgroundColor: option.color }} className="mb-1 h-2.5 w-6 rounded-full" />
              <Text className={cn('text-[10px]', color.textPrimaryClass)}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});
