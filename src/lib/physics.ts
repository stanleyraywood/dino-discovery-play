// Game physics + tuning constants

export const PHYSICS = {
  // Jump
  JUMP_INITIAL_VELOCITY: -12,
  JUMP_HOLD_GRAVITY: 0.45,
  JUMP_RELEASE_GRAVITY: 1.6,
  FALL_GRAVITY: 1.0,
  MAX_FALL_SPEED: 14,
  JUMP_HOLD_MAX_FRAMES: 12,

  // Forgiveness
  COYOTE_FRAMES: 6,
  JUMP_BUFFER_FRAMES: 6,

  // Squash & stretch
  LAND_SQUASH: { scaleX: 1.3, scaleY: 0.7 },
  JUMP_STRETCH: { scaleX: 0.85, scaleY: 1.2 },
  SQUASH_RECOVERY_SPEED: 0.12,

  // Ground
  GROUND_Y: 0,
  JUMP_CLEARANCE: -6,

  // Speed
  GAME_SPEED_BASE: 1.8,
  GAME_SPEED_MAX: 3.2,
  GAME_DURATION: 40000,       // Timer end (secondary — hearts are primary)
  OBSTACLE_INTERVAL_START: 2600,
  OBSTACLE_INTERVAL_MIN: 1400,

  // Fossils — the core collectible
  FOSSIL_SPAWN_INTERVAL: 650,  // Frequent! Every 0.65s
  FOSSIL_VALUE: 1,

  // Fact eggs — rare treasure
  FACT_EGG_SPAWN_TIMES: [15000, 30000], // Fixed spawn at 15s and 30s
  FACT_EGG_VALUE: 100,

  // Hearts / damage
  MAX_HEARTS: 3,
  HIT_INVINCIBILITY: 1500,    // Brief immunity after hit
  SCATTER_COUNT: 8,            // How many fossils scatter visually on hit
  SCATTER_DURATION: 1500,      // How long scattered fossils are recoverable
  STUMBLE_DURATION: 600,

  // Streak
  STREAK_TIMEOUT: 500,         // ms gap before streak resets
  STREAK_X2: 5,                // 5+ = x2
  STREAK_X3: 10,               // 10+ = x3
} as const;

export type SquashStretch = { scaleX: number; scaleY: number };

export function lerpSquash(current: SquashStretch, speed: number, dt: number): SquashStretch {
  const factor = speed * (dt / 16.67);
  return {
    scaleX: current.scaleX + (1 - current.scaleX) * Math.min(factor, 1),
    scaleY: current.scaleY + (1 - current.scaleY) * Math.min(factor, 1),
  };
}

export function getStreakMultiplier(streak: number): number {
  if (streak >= PHYSICS.STREAK_X3) return 3;
  if (streak >= PHYSICS.STREAK_X2) return 2;
  return 1;
}
