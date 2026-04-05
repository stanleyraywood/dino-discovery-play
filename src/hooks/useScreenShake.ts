import { useRef, useCallback, useState } from 'react';

interface ShakeState {
  x: number;
  y: number;
}

export function useScreenShake() {
  const [offset, setOffset] = useState<ShakeState>({ x: 0, y: 0 });
  const animId = useRef(0);

  const shake = useCallback((intensity: number = 8, durationMs: number = 300) => {
    cancelAnimationFrame(animId.current);
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = elapsed / durationMs;

      if (t >= 1) {
        setOffset({ x: 0, y: 0 });
        return;
      }

      // Decaying sinusoidal shake
      const decay = 1 - t;
      const freq = 30; // oscillations per second feel
      const x = Math.sin(elapsed * freq * 0.05) * intensity * decay;
      const y = Math.cos(elapsed * freq * 0.07) * intensity * decay * 0.6;

      setOffset({ x, y });
      animId.current = requestAnimationFrame(tick);
    };

    animId.current = requestAnimationFrame(tick);
  }, []);

  const style: React.CSSProperties = {
    transform: `translate(${offset.x}px, ${offset.y}px)`,
  };

  return { shake, style };
}
