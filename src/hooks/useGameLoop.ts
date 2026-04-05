import { useRef, useEffect, useCallback } from 'react';

const MAX_DT = 33; // Cap delta time at ~30fps to prevent physics explosion on tab-away

export function useGameLoop(
  active: boolean,
  onTick: (dt: number, elapsed: number) => boolean // return false to stop
) {
  const animId = useRef(0);
  const startTime = useRef(0);
  const lastTime = useRef(0);

  const tickRef = useRef(onTick);
  tickRef.current = onTick;

  useEffect(() => {
    if (!active) return;

    startTime.current = performance.now();
    lastTime.current = startTime.current;

    const loop = (now: number) => {
      const rawDt = now - lastTime.current;
      const dt = Math.min(rawDt, MAX_DT);
      lastTime.current = now;
      const elapsed = now - startTime.current;

      const shouldContinue = tickRef.current(dt, elapsed);
      if (shouldContinue) {
        animId.current = requestAnimationFrame(loop);
      }
    };

    animId.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId.current);
  }, [active]);

  const getElapsed = useCallback(() => {
    return performance.now() - startTime.current;
  }, []);

  return { getElapsed };
}
