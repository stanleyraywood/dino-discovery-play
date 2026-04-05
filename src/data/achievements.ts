export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (stats: PlayerStats) => boolean;
}

export interface PlayerStats {
  totalRuns: number;
  totalDistance: number;
  totalEggs: number;
  maxCombo: number;
  perfectRuns: number; // runs with 0 stumbles
  dinosUnlocked: number;
  factsCollected: number;
  maxDistance: number;
  abilityUses: number;
  powerUpsCollected: number;
}

export const DEFAULT_STATS: PlayerStats = {
  totalRuns: 0,
  totalDistance: 0,
  totalEggs: 0,
  maxCombo: 0,
  perfectRuns: 0,
  dinosUnlocked: 1,
  factsCollected: 0,
  maxDistance: 0,
  abilityUses: 0,
  powerUpsCollected: 0,
};

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first run',
    icon: '\u{1F463}',
    check: (s) => s.totalRuns >= 1,
  },
  {
    id: 'runner-10',
    name: 'Getting Warmed Up',
    description: 'Complete 10 runs',
    icon: '\u{1F3C3}',
    check: (s) => s.totalRuns >= 10,
  },
  {
    id: 'marathon',
    name: 'Marathon Dino',
    description: 'Run 10,000m total',
    icon: '\u{1F3C5}',
    check: (s) => s.totalDistance >= 10000,
  },
  {
    id: 'egg-hunter',
    name: 'Egg Hunter',
    description: 'Collect 20 eggs total',
    icon: '\u{1F95A}',
    check: (s) => s.totalEggs >= 20,
  },
  {
    id: 'combo-king',
    name: 'Combo King',
    description: 'Get a 5x combo',
    icon: '\u{1F525}',
    check: (s) => s.maxCombo >= 5,
  },
  {
    id: 'perfect-run',
    name: 'Perfect Run',
    description: 'Complete a run with 0 stumbles',
    icon: '\u{2B50}',
    check: (s) => s.perfectRuns >= 1,
  },
  {
    id: 'collector',
    name: 'Dino Collector',
    description: 'Unlock 5 dinosaurs',
    icon: '\u{1F996}',
    check: (s) => s.dinosUnlocked >= 5,
  },
  {
    id: 'encyclopedia',
    name: 'Encyclopedia',
    description: 'Discover 20 facts',
    icon: '\u{1F4DA}',
    check: (s) => s.factsCollected >= 20,
  },
  {
    id: 'all-dinos',
    name: 'Gotta Catch Em All',
    description: 'Unlock all 10 dinosaurs',
    icon: '\u{1F3C6}',
    check: (s) => s.dinosUnlocked >= 10,
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Run 500m in a single run',
    icon: '\u{26A1}',
    check: (s) => s.maxDistance >= 500,
  },
  {
    id: 'power-player',
    name: 'Power Player',
    description: 'Collect 10 power-ups',
    icon: '\u{1F4AA}',
    check: (s) => s.powerUpsCollected >= 10,
  },
  {
    id: 'ability-master',
    name: 'Ability Master',
    description: 'Use abilities 20 times',
    icon: '\u{2728}',
    check: (s) => s.abilityUses >= 20,
  },
];

// localStorage persistence
const STATS_KEY = 'dino-player-stats';
const ACHIEVEMENTS_KEY = 'dino-achievements';

export function getPlayerStats(): PlayerStats {
  const saved = localStorage.getItem(STATS_KEY);
  return saved ? { ...DEFAULT_STATS, ...JSON.parse(saved) } : { ...DEFAULT_STATS };
}

export function savePlayerStats(stats: PlayerStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function getUnlockedAchievements(): string[] {
  const saved = localStorage.getItem(ACHIEVEMENTS_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function checkAndUnlockAchievements(stats: PlayerStats): Achievement[] {
  const unlocked = getUnlockedAchievements();
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlocked.includes(achievement.id) && achievement.check(stats)) {
      unlocked.push(achievement.id);
      newlyUnlocked.push(achievement);
    }
  }

  if (newlyUnlocked.length > 0) {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
  }

  return newlyUnlocked;
}
