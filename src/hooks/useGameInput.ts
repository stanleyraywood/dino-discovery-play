import { useRef, useEffect, useCallback } from 'react';

export interface GameInput {
  jumpPressed: boolean;   // True only on the frame jump was pressed
  jumpHeld: boolean;      // True while jump key/touch is held
  jumpReleased: boolean;  // True only on the frame jump was released
}

export function useGameInput(active: boolean) {
  const jumpPressedThisFrame = useRef(false);
  const jumpReleasedThisFrame = useRef(false);
  const jumpHeld = useRef(false);
  const touchActive = useRef(false);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        if (!jumpHeld.current) {
          jumpPressedThisFrame.current = true;
          jumpHeld.current = true;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        jumpReleasedThisFrame.current = true;
        jumpHeld.current = false;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (touchActive.current) return;
      touchActive.current = true;
      jumpPressedThisFrame.current = true;
      jumpHeld.current = true;
    };

    const handleTouchEnd = () => {
      if (!touchActive.current) return;
      touchActive.current = false;
      jumpReleasedThisFrame.current = true;
      jumpHeld.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [active]);

  const poll = useCallback((): GameInput => {
    const input: GameInput = {
      jumpPressed: jumpPressedThisFrame.current,
      jumpHeld: jumpHeld.current,
      jumpReleased: jumpReleasedThisFrame.current,
    };
    jumpPressedThisFrame.current = false;
    jumpReleasedThisFrame.current = false;
    return input;
  }, []);

  return { poll };
}
