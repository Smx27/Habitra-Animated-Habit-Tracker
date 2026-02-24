import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { AppState, type AppStateStatus, Platform } from 'react-native';

import {
  getPerformanceMode,
  performanceConfig,
  resolvePerformanceProfile,
  setPerformanceMode,
  type PerformanceMode,
} from '@/utils/performanceConfig';

const DEFAULT_REFRESH_RATE = 60;
const SAMPLE_COUNT = 20;

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

export function useAdaptivePerformance() {
  const [refreshRate, setRefreshRate] = useState(DEFAULT_REFRESH_RATE);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const mode = useSyncExternalStore(performanceConfig.subscribe.bind(performanceConfig), getPerformanceMode);

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

  const profile = useMemo(() => resolvePerformanceProfile({ mode, refreshRate, appState }), [appState, mode, refreshRate]);

  return {
    ...profile,
    setPerformanceMode: (nextMode: PerformanceMode) => setPerformanceMode(nextMode),
  };
}
