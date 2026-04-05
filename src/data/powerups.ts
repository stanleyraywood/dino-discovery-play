export type PowerUpType = 'shield' | 'magnet' | 'slowmo' | 'megajump';

export interface PowerUpDef {
  type: PowerUpType;
  name: string;
  color: string;
  glowColor: string;
  duration: number; // ms
  icon: string;
}

export const POWERUPS: Record<PowerUpType, PowerUpDef> = {
  shield: {
    type: 'shield',
    name: 'Shield',
    color: '#4A9BD9',
    glowColor: '#4A9BD9',
    duration: 5000,
    icon: '\u{1F6E1}', // shield emoji
  },
  magnet: {
    type: 'magnet',
    name: 'Magnet',
    color: '#FFD700',
    glowColor: '#FFD700',
    duration: 6000,
    icon: '\u{1F9F2}', // magnet emoji
  },
  slowmo: {
    type: 'slowmo',
    name: 'Slow-Mo',
    color: '#9C27B0',
    glowColor: '#9C27B0',
    duration: 4000,
    icon: '\u{1F551}', // clock emoji
  },
  megajump: {
    type: 'megajump',
    name: 'Mega Jump',
    color: '#4CAF50',
    glowColor: '#4CAF50',
    duration: 5000,
    icon: '\u{1F680}', // rocket emoji
  },
};

export const POWERUP_TYPES: PowerUpType[] = ['shield', 'magnet', 'slowmo', 'megajump'];

export const POWERUP_SPAWN_INTERVAL_MIN = 8000;
export const POWERUP_SPAWN_INTERVAL_MAX = 12000;
