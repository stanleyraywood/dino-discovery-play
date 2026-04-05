import { useRef, useCallback } from 'react';
import { PHYSICS, lerpSquash, type SquashStretch } from '@/lib/physics';
import type { GameInput } from './useGameInput';

export interface PhysicsState {
  y: number;
  velocityY: number;
  isGrounded: boolean;
  isJumping: boolean;
  squash: SquashStretch;
  justLanded: boolean;
  justJumped: boolean;
}

export function useGamePhysics() {
  const y = useRef(0);
  const velocityY = useRef(0);
  const isGrounded = useRef(true);

  // Variable jump height tracking
  const jumpHeldFrames = useRef(0);
  const jumpHoldActive = useRef(false);

  // Coyote time
  const coyoteCounter = useRef(0);

  // Jump buffering
  const jumpBufferCounter = useRef(0);

  // Squash & stretch
  const squash = useRef<SquashStretch>({ scaleX: 1, scaleY: 1 });

  const justLanded = useRef(false);
  const justJumped = useRef(false);
  const wasGrounded = useRef(true);

  const doJump = useCallback((velocity: number) => {
    velocityY.current = velocity;
    isGrounded.current = false;
    jumpHoldActive.current = true;
    jumpHeldFrames.current = 0;
    coyoteCounter.current = 0;
    justJumped.current = true;
    squash.current = { ...PHYSICS.JUMP_STRETCH };
  }, []);

  const tick = useCallback((input: GameInput, dt: number = 16.67): PhysicsState => {
    justLanded.current = false;
    justJumped.current = false;

    // Buffer: remember jump press for a few frames
    if (input.jumpPressed) {
      jumpBufferCounter.current = PHYSICS.JUMP_BUFFER_FRAMES;
    } else if (jumpBufferCounter.current > 0) {
      jumpBufferCounter.current--;
    }

    // Coyote time
    if (isGrounded.current) {
      coyoteCounter.current = PHYSICS.COYOTE_FRAMES;
    } else if (coyoteCounter.current > 0) {
      coyoteCounter.current--;
    }

    // Can we jump?
    const canCoyoteJump = coyoteCounter.current > 0 && velocityY.current >= 0;
    const wantsJump = input.jumpPressed || jumpBufferCounter.current > 0;

    if (wantsJump && canCoyoteJump) {
      doJump(PHYSICS.JUMP_INITIAL_VELOCITY);
      jumpBufferCounter.current = 0;
    }

    // Variable jump height (hold to jump higher)
    if (jumpHoldActive.current && input.jumpHeld) {
      jumpHeldFrames.current++;
      if (jumpHeldFrames.current >= PHYSICS.JUMP_HOLD_MAX_FRAMES) {
        jumpHoldActive.current = false;
      }
    }
    if (input.jumpReleased) {
      jumpHoldActive.current = false;
    }

    // Gravity selection
    let gravity: number;
    if (velocityY.current < 0) {
      gravity = jumpHoldActive.current
        ? PHYSICS.JUMP_HOLD_GRAVITY
        : PHYSICS.JUMP_RELEASE_GRAVITY;
    } else {
      gravity = PHYSICS.FALL_GRAVITY;
    }

    // Apply physics
    velocityY.current += gravity;
    if (velocityY.current > PHYSICS.MAX_FALL_SPEED) {
      velocityY.current = PHYSICS.MAX_FALL_SPEED;
    }
    y.current += velocityY.current;

    // Ground collision
    if (y.current >= PHYSICS.GROUND_Y) {
      y.current = PHYSICS.GROUND_Y;
      const wasAirborne = !wasGrounded.current;
      if (wasAirborne) {
        justLanded.current = true;
        squash.current = { ...PHYSICS.LAND_SQUASH };

        // Auto-trigger buffered jump on landing
        if (jumpBufferCounter.current > 0) {
          doJump(PHYSICS.JUMP_INITIAL_VELOCITY);
          jumpBufferCounter.current = 0;
        }
      }
      velocityY.current = 0;
      isGrounded.current = true;
    } else {
      isGrounded.current = false;
    }

    wasGrounded.current = isGrounded.current;

    // Recover squash/stretch toward (1, 1) — frame-rate independent
    squash.current = lerpSquash(squash.current, PHYSICS.SQUASH_RECOVERY_SPEED, dt);

    return {
      y: y.current,
      velocityY: velocityY.current,
      isGrounded: isGrounded.current,
      isJumping: !isGrounded.current,
      squash: { ...squash.current },
      justLanded: justLanded.current,
      justJumped: justJumped.current,
    };
  }, [doJump]);

  const reset = useCallback(() => {
    y.current = 0;
    velocityY.current = 0;
    isGrounded.current = true;
    jumpHeldFrames.current = 0;
    jumpHoldActive.current = false;
    coyoteCounter.current = 0;
    jumpBufferCounter.current = 0;
    squash.current = { scaleX: 1, scaleY: 1 };
    wasGrounded.current = true;
  }, []);

  return { tick, reset };
}
