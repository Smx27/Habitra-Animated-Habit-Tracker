import { Text as RNText, type TextProps } from 'react-native';

import { cn } from '@/utils/cn';

type Props = TextProps & {
  muted?: boolean;
};

export function Text({ className, muted = false, ...props }: Props) {
  return <RNText className={cn(muted ? 'text-slate-300' : 'text-slate-50', className)} {...props} />;
}
