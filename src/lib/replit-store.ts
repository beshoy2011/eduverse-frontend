import { REPLIT_ACHIEVEMENTS } from './replit-challenge-data';

export interface UserAcceleratorState {
  xp: number;
  level: number;
  coins: number;
  streakDays: number;
  rankPosition: number;
  completedModules: number[];
  unlockedBadgeIds: string[];
  submittedProject?: {
    name: string;
    tagline: string;
    description: string;
    replitUrl: string;
    demoUrl: string;
    githubUrl: string;
    category: string;
    submittedAt: string;
    score?: number;
    finalist?: boolean;
  };
}

const STORAGE_KEY = 'eduverse_replit_challenge_state';

const DEFAULT_STATE: UserAcceleratorState = {
  xp: 1250,
  level: 3,
  coins: 240,
  streakDays: 4,
  rankPosition: 14,
  completedModules: [1, 2],
  unlockedBadgeIds: ['ach-1', 'ach-2', 'ach-9'],
  submittedProject: undefined
};

export function getAcceleratorState(): UserAcceleratorState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
      return DEFAULT_STATE;
    }
    return JSON.parse(raw) as UserAcceleratorState;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveAcceleratorState(state: UserAcceleratorState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save accelerator state:', err);
  }
}

export function addXPAndCoins(xpReward: number, coinsReward: number): UserAcceleratorState {
  const current = getAcceleratorState();
  const newXP = current.xp + xpReward;
  const newCoins = current.coins + coinsReward;
  
  // Calculate level: every 1000 XP is 1 Level
  const newLevel = Math.max(1, Math.floor(newXP / 1000) + 1);

  const updated: UserAcceleratorState = {
    ...current,
    xp: newXP,
    coins: newCoins,
    level: newLevel
  };

  saveAcceleratorState(updated);
  return updated;
}

export function markModuleCompleted(moduleId: number, xpReward: number, coinsReward: number): UserAcceleratorState {
  const current = getAcceleratorState();
  if (current.completedModules.includes(moduleId)) {
    return current;
  }

  const newCompleted = [...current.completedModules, moduleId];
  const newXP = current.xp + xpReward;
  const newCoins = current.coins + coinsReward;
  const newLevel = Math.max(1, Math.floor(newXP / 1000) + 1);

  // Check badges unlock
  const newUnlockedBadges = [...current.unlockedBadgeIds];
  if (newCompleted.length >= 1 && !newUnlockedBadges.includes('ach-1')) newUnlockedBadges.push('ach-1');
  if (newCompleted.length >= 3 && !newUnlockedBadges.includes('ach-2')) newUnlockedBadges.push('ach-2');
  if (newCompleted.length >= 6 && !newUnlockedBadges.includes('ach-4')) newUnlockedBadges.push('ach-4');
  if (newCompleted.length >= 10 && !newUnlockedBadges.includes('ach-5')) newUnlockedBadges.push('ach-5');
  if (newCompleted.length >= 12 && !newUnlockedBadges.includes('ach-6')) newUnlockedBadges.push('ach-6');

  const updated: UserAcceleratorState = {
    ...current,
    completedModules: newCompleted,
    xp: newXP,
    coins: newCoins,
    level: newLevel,
    unlockedBadgeIds: newUnlockedBadges
  };

  saveAcceleratorState(updated);
  return updated;
}

export function submitStartupProject(project: {
  name: string;
  tagline: string;
  description: string;
  replitUrl: string;
  demoUrl: string;
  githubUrl: string;
  category: string;
}): UserAcceleratorState {
  const current = getAcceleratorState();
  const updated: UserAcceleratorState = {
    ...current,
    xp: current.xp + 1500,
    coins: current.coins + 500,
    unlockedBadgeIds: [...new Set([...current.unlockedBadgeIds, 'ach-7', 'ach-8', 'ach-10'])],
    submittedProject: {
      ...project,
      submittedAt: new Date().toLocaleDateString(),
      score: 94.5,
      finalist: true
    }
  };

  saveAcceleratorState(updated);
  return updated;
}
