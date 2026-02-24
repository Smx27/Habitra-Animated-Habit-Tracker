import { useEffect, useState, type ComponentType } from 'react';

export function SuccessLottie() {
  const [LottieView, setLottieView] = useState<ComponentType<any> | null>(null);

  useEffect(() => {
    let mounted = true;

    void import('lottie-react-native').then((module) => {
      if (mounted) {
        setLottieView(() => module.default as ComponentType<any>);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!LottieView) {
    return null;
  }

  return <LottieView source={require('@/assets/lottie/success-bounce.json')} autoPlay loop={false} style={{ width: 120, height: 120 }} />;
}
