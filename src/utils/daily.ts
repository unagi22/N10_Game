import { MIN_NUMBER, MAX_NUMBER, TOTAL_SLOTS } from '../constants/game';

// Day #1 of the Daily Challenge
const DAILY_EPOCH = new Date(2026, 9, 3); // 3 Oct 2026, local time

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function dailyNumber(date = new Date()): number {
  const start = new Date(DAILY_EPOCH.getFullYear(), DAILY_EPOCH.getMonth(), DAILY_EPOCH.getDate());
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((day.getTime() - start.getTime()) / 86400000) + 1;
}

function hashString(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Same 10 numbers for everyone on the same day
export function dailySequence(key = todayKey()): number[] {
  const rand = mulberry32(hashString(`n10-${key}`));
  const used = new Set<number>();
  const seq: number[] = [];
  while (seq.length < TOTAL_SLOTS) {
    const n = Math.floor(rand() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER;
    if (!used.has(n)) {
      used.add(n);
      seq.push(n);
    }
  }
  return seq;
}

export function msUntilTomorrow(now = new Date()): number {
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return tomorrow.getTime() - now.getTime();
}

export function buildShareText(placed: number, won: boolean, number: number): string {
  const squares = Array.from({ length: TOTAL_SLOTS }, (_, i) => {
    if (won) return '🟩';
    if (i < placed) return '🟦';
    if (i === placed) return '🟥';
    return '⬜';
  }).join('');
  const headline = won ? `${TOTAL_SLOTS}/${TOTAL_SLOTS} 🏆` : `${placed}/${TOTAL_SLOTS}`;
  return `N10 Daily #${number} ${headline}\n${squares}\nhttps://n10game.unagify.com`;
}
