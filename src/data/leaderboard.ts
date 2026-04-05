export type HatType = 'none' | 'tophat' | 'crown' | 'party' | 'cowboy' | 'beanie';
export type AccessoryType = 'none' | 'bowtie' | 'scarf' | 'sunglasses' | 'monocle';

export interface AvatarConfig {
  dinoType: 'biped' | 'quadruped' | 'flyer' | 'longneck';
  bodyColor: string;
  accentColor: string;
  hat: HatType;
  accessory: AccessoryType;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;    // distance
  eggs: number;     // facts collected
  dinoId: string;
  avatar: AvatarConfig;
  timestamp: number;
}

const BRIGHT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#AED6F1', '#D7BDE2',
  '#A3E4D7', '#FAD7A0', '#A9CCE3', '#D5F5E3', '#FADBD8',
];

const HATS: HatType[] = ['none', 'tophat', 'crown', 'party', 'cowboy', 'beanie'];
const ACCESSORIES: AccessoryType[] = ['none', 'bowtie', 'scarf', 'sunglasses', 'monocle'];

function randomColor(): string {
  return BRIGHT_COLORS[Math.floor(Math.random() * BRIGHT_COLORS.length)];
}

export function generateAvatar(dinoType: 'biped' | 'quadruped' | 'flyer' | 'longneck'): AvatarConfig {
  let bodyColor = randomColor();
  let accentColor = randomColor();
  // Ensure they're different
  while (accentColor === bodyColor) {
    accentColor = randomColor();
  }

  return {
    dinoType,
    bodyColor,
    accentColor,
    hat: HATS[Math.floor(Math.random() * HATS.length)],
    accessory: ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)],
  };
}

const STORAGE_KEY = 'dino-dash-leaderboard';
const MAX_ENTRIES = 10;

export function getLeaderboard(): LeaderboardEntry[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

export function isHighScore(eggs: number, score: number): boolean {
  const board = getLeaderboard();
  if (board.length < MAX_ENTRIES) return true;
  const worst = board.sort((a, b) => b.score - a.score)[MAX_ENTRIES - 1];
  return score > worst.score;
}

export function addToLeaderboard(entry: LeaderboardEntry): LeaderboardEntry[] {
  const board = getLeaderboard();
  board.push(entry);
  board.sort((a, b) => b.score - a.score);
  const trimmed = board.slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return trimmed;
}
