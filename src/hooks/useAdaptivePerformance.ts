import { useEffect, useMemo, useState } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';

const DEFAULT_REFRESH_RATE = 60;
const HIGH_REFRESH_RATE_THRESHOLD = 100;
const SAMPLE_COUNT = 20;

type AdaptivePerformance = {
  refreshRate: number;
  isHighRefreshRate: boolean;
  shouldReduceMotion: boolean;
  timingDurationScale: number;
  staggerDelayMs: number;
};

const estimateRefreshRate = async () => {
  if (Platform.OS === 'web') {
    return DEFAULT_REFRESH_RATE;
  }

  return await new Promise<number>((resolve) => {
    let frameCount = 0;
    let start = 0;

    const step = (timestamp: number) => {
      if (frameCount === 0) {
        start = timestamp;
      }

      frameCount += 1;

      if (frameCount >= SAMPLE_COUNT) {
        const elapsedMs = timestamp - start;
        const fps = Math.round(((frameCount - 1) * 1000) / Math.max(elapsedMs, 1));
        resolve(Math.max(30, Math.min(144, fps)));
        return;
      }

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
};

export function useAdaptivePerformance(): AdaptivePerformance {
  const [refreshRate, setRefreshRate] = useState(DEFAULT_REFRESH_RATE);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    let mounted = true;

    void estimateRefreshRate().then((rate) => {
      if (mounted) {
        setRefreshRate(rate);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppState);

    return () => {
      subscription.remove();
    };
  }, []);

  return useMemo(() => {
    const isHighRefreshRate = refreshRate >= HIGH_REFRESH_RATE_THRESHOLD;
    const shouldReduceMotion = appState !== 'active';

    return {
      refreshRate,
      isHighRefreshRate,
      shouldReduceMotion,
      timingDurationScale: shouldReduceMotion ? 0.3 : isHighRefreshRate ? 0.9 : 1,
      staggerDelayMs: shouldReduceMotion ? 0 : isHighRefreshRate ? 26 : 42,
    };
  }, [appState, refreshRate]);
}
