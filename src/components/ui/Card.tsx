import { BlurView } from 'expo-blur';
import { View, type ViewProps } from 'react-native';

import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type Props = ViewProps & {
  intensity?: number;
};

export function Card({ children, className, intensity = 35, ...props }: Props) {
  const { color, radius, spacing, shadows, scheme } = useThemeTokens();

  return (
    <BlurView intensity={intensity} tint={scheme} className={cn('w-full max-w-sm overflow-hidden', radius.card, color.cardBackgroundClass)}>
      <View className={cn(spacing.stackSm, spacing.cardPadding, shadows.card, className)} {...props}>
        {children}
      </View>
    </BlurView>
  );
}
