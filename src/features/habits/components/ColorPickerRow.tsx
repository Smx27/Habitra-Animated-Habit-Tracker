import { memo } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type ColorPickerRowProps = {
  options: readonly string[];
  selectedColor: string;
  onSelect: (color: string) => void;
};

export const ColorPickerRow = memo(function ColorPickerRow({ options, selectedColor, onSelect }: ColorPickerRowProps) {
  const { color, typography } = useThemeTokens();

  return (
    <View className="gap-2">
      <Text className={cn(typography.caption, color.textMutedClass)}>Color</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = option === selectedColor;

          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              className={cn(
                'h-9 w-9 items-center justify-center rounded-full border',
                isSelected ? 'border-white/70 bg-white/25' : 'border-white/20 bg-white/10',
              )}
            >
              <View style={{ backgroundColor: option }} className="h-4 w-4 rounded-full" />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});
