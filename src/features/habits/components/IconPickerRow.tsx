import { memo } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type IconPickerRowProps = {
  icons: string[];
  selectedIcon: string;
  onSelect: (icon: string) => void;
};

export const IconPickerRow = memo(function IconPickerRow({ icons, selectedIcon, onSelect }: IconPickerRowProps) {
  const { color, typography } = useThemeTokens();

  return (
    <View className="gap-2">
      <Text className={cn(typography.caption, color.textMutedClass)}>Icon</Text>
      <View className="flex-row flex-wrap gap-2">
        {icons.map((icon) => {
          const isSelected = icon === selectedIcon;

          return (
            <Pressable
              key={icon}
              onPress={() => onSelect(icon)}
              className={cn(
                'h-11 w-11 items-center justify-center rounded-2xl border',
                isSelected ? 'border-white/70 bg-white/25' : 'border-white/20 bg-white/10',
              )}
            >
              <Text className="text-xl">{icon}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});
