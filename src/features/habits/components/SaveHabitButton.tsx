import { Pressable } from 'react-native';

import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type SaveHabitButtonProps = {
  disabled?: boolean;
  onPress: () => void;
};

export function SaveHabitButton({ disabled, onPress }: SaveHabitButtonProps) {
  const { color, typography } = useThemeTokens();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={cn(
        'h-12 items-center justify-center rounded-2xl',
        disabled ? 'bg-white/15' : color.actionPrimaryClass,
      )}
    >
      <Text className={cn(typography.button, disabled ? 'text-white/60' : color.actionPrimaryTextClass)}>Save Habit</Text>
    </Pressable>
  );
}
