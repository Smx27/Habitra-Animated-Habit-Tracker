import { BlurView } from 'expo-blur';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import { useThemeTokens } from '@/theme';
import { cn } from '@/utils/cn';

type HeaderSectionProps = {
  completedToday: number;
};

export function HeaderSection({ completedToday }: HeaderSectionProps) {
  const { color, radius, typography } = useThemeTokens();

  return (
    <BlurView intensity={35} tint="default" className={cn('overflow-hidden border border-white/20 p-5', radius.card, color.surfaceClass)}>
      <View className="gap-2">
        <Text className={cn(typography.caption, color.textMutedClass)}>Good morning</Text>
        <Text className={typography.heading}>Ready to make today count?</Text>
        <Text muted className={typography.body}>
          You have completed {completedToday} habits today.
        </Text>
      </View>
    </BlurView>
  );
}
