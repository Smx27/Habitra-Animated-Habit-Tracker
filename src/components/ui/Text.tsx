import { Text as RNText, type TextProps } from 'react-native';

import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type Props = TextProps & {
  muted?: boolean;
};

export function Text({ className, muted = false, ...props }: Props) {
  const { color, typography } = useThemeTokens();

  return (
    <RNText
      className={cn(muted ? color.textMutedClass : color.textPrimaryClass, typography.body, className)}
      {...props}
    />
  );
}
