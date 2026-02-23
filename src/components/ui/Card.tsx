import { BlurView } from 'expo-blur';
import { View, type ViewProps } from 'react-native';

import { cn } from '@/utils/cn';

type Props = ViewProps & {
  intensity?: number;
};

export function Card({ children, className, intensity = 35, ...props }: Props) {
  return (
    <BlurView intensity={intensity} tint="dark" className="w-full max-w-sm overflow-hidden rounded-2xl">
      <View className={cn('gap-2 p-5', className)} {...props}>
        {children}
      </View>
    </BlurView>
  );
}
