import { Pressable, type PressableProps } from 'react-native';

import { Text } from '@/components/ui/Text';
import { cn } from '@/utils/cn';

type Props = PressableProps & {
  label: string;
};

export function Button({ className, label, ...props }: Props) {
  return (
    <Pressable className={cn('rounded-xl bg-emerald-500 px-4 py-3', className)} {...props}>
      <Text className="text-center font-semibold text-slate-950">{label}</Text>
    </Pressable>
  );
}
