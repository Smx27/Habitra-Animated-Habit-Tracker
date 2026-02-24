import { useEffect } from 'react';

type UsePerformanceLoggerOptions = {
  enabled?: boolean;
  label?: string;
  dropThresholdMs?: number;
};

export function usePerformanceLogger({ enabled = __DEV__, label = 'ui', dropThresholdMs = 20 }: UsePerformanceLoggerOptions = {}) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    let frameId = 0;
    let lastTime = 0;

    const onFrame = (time: number) => {
      if (lastTime > 0) {
        const delta = time - lastTime;

        if (delta > dropThresholdMs) {
          console.debug(`[perf:${label}] dropped frame detected (${Math.round(delta)}ms)`);
        }
      }

      lastTime = time;
      frameId = requestAnimationFrame(onFrame);
    };

    frameId = requestAnimationFrame(onFrame);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [dropThresholdMs, enabled, label]);
}
