import { useRef, useCallback, useState } from 'react';

export interface ComboState {
  count: number;
  multiplier: number;
  active: boolean;
}

const COMBO_WINDOW_MS = 3000;

function getMultiplier(count: number): number {
  if (count >= 5) return 3;
  if (count >= 3) return 2;
  if (count >= 2) return 1.5;
  return 1;
}

export function useCombo() {
  const [combo, setCombo] = useState<ComboState>({ count: 0, multiplier: 1, active: false });
  const lastCollectTime = useRef(0);
  const count = useRef(0);
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();

  const collect = useCallback(() => {
    const now = Date.now();
    const timeSinceLast = now - lastCollectTime.current;

    if (timeSinceLast < COMBO_WINDOW_MS && count.current > 0) {
      count.current++;
    } else {
      count.current = 1;
    }

    lastCollectTime.current = now;

    const multiplier = getMultiplier(count.current);
    setCombo({ count: count.current, multiplier, active: count.current >= 2 });

    // Reset combo after window expires
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      count.current = 0;
      setCombo({ count: 0, multiplier: 1, active: false });
    }, COMBO_WINDOW_MS);
  }, []);

  const reset = useCallback(() => {
    count.current = 0;
    lastCollectTime.current = 0;
    clearTimeout(timeoutId.current);
    setCombo({ count: 0, multiplier: 1, active: false });
  }, []);

  return { combo, collect, reset };
}
