import { Pressable, type PressableProps } from 'react-native';

import { Text } from '@/components/ui/Text';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type Props = PressableProps & {
  label: string;
};

export function Button({ className, label, ...props }: Props) {
  const { color, radius, spacing, typography, shadows } = useThemeTokens();

  return (
    <Pressable
      className={cn(radius.button, color.actionPrimaryClass, spacing.buttonX, spacing.buttonY, shadows.floating, className)}
      {...props}
    >
      <Text className={cn('text-center', color.actionPrimaryTextClass, typography.button)}>{label}</Text>
    </Pressable>
  );
}
