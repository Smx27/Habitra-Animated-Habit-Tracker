import { AppStateStatus } from 'react-native';

export type PerformanceMode = 'adaptive' | 'high-performance' | 'battery-saver';

export type PerformanceProfile = {
  mode: PerformanceMode;
  refreshRate: number;
  isHighRefreshRate: boolean;
  shouldReduceMotion: boolean;
  timingDurationScale: number;
  staggerDelayMs: number;
};

type Listener = () => void;

const DEFAULT_MODE: PerformanceMode = 'adaptive';
const HIGH_REFRESH_RATE_THRESHOLD = 100;

class PerformanceConfigStore {
  private mode: PerformanceMode = DEFAULT_MODE;
  private listeners = new Set<Listener>();

  getMode() {
    return this.mode;
  }

  setMode(nextMode: PerformanceMode) {
    if (this.mode === nextMode) {
      return;
    }

    this.mode = nextMode;
    this.listeners.forEach((listener) => listener());
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }
}

export const performanceConfig = new PerformanceConfigStore();

export const setPerformanceMode = (mode: PerformanceMode) => performanceConfig.setMode(mode);

export const getPerformanceMode = () => performanceConfig.getMode();

export const resolvePerformanceProfile = ({
  mode,
  refreshRate,
  appState,
}: {
  mode: PerformanceMode;
  refreshRate: number;
  appState: AppStateStatus;
}): PerformanceProfile => {
  const isHighRefreshRate = refreshRate >= HIGH_REFRESH_RATE_THRESHOLD;
  const appInactive = appState !== 'active';

  if (mode === 'high-performance') {
    return {
      mode,
      refreshRate,
      isHighRefreshRate,
      shouldReduceMotion: appInactive,
      timingDurationScale: appInactive ? 0.6 : isHighRefreshRate ? 0.82 : 0.9,
      staggerDelayMs: appInactive ? 12 : 20,
    };
  }

  if (mode === 'battery-saver') {
    return {
      mode,
      refreshRate,
      isHighRefreshRate,
      shouldReduceMotion: true,
      timingDurationScale: 0.35,
      staggerDelayMs: 0,
    };
  }

  const shouldReduceMotion = appInactive;

  return {
    mode,
    refreshRate,
    isHighRefreshRate,
    shouldReduceMotion,
    timingDurationScale: shouldReduceMotion ? 0.3 : isHighRefreshRate ? 0.9 : 1,
    staggerDelayMs: shouldReduceMotion ? 0 : isHighRefreshRate ? 26 : 42,
  };
};
