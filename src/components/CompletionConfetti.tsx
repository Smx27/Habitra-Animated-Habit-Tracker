import { useEffect, useMemo, useState, type ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';

export interface CompletionConfettiProps {
  visible: boolean;
  playKey: number;
  onAnimationFinish?: () => void;
}

export function CompletionConfetti({ visible, playKey, onAnimationFinish }: CompletionConfettiProps) {
  const [isMounted, setIsMounted] = useState(visible);
  const [LottieView, setLottieView] = useState<ComponentType<any> | null>(null);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
    }
  }, [visible, playKey]);

  useEffect(() => {
    if (!isMounted || LottieView) {
      return;
    }

    let mounted = true;

    void import('lottie-react-native').then((module) => {
      if (mounted) {
        setLottieView(() => module.default as ComponentType<any>);
      }
    });

    return () => {
      mounted = false;
    };
  }, [isMounted, LottieView]);

  const lottieKey = useMemo(() => `completion-confetti-${playKey}`, [playKey]);

  if (!isMounted || !LottieView) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.overlay}>
      <LottieView
        key={lottieKey}
        source={require('@/assets/lottie/confetti-burst.json')}
        autoPlay={visible}
        loop={false}
        style={styles.lottie}
        onAnimationFinish={() => {
          setIsMounted(false);
          onAnimationFinish?.();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    elevation: 20,
  },
  lottie: {
    width: 220,
    height: 220,
  },
});
