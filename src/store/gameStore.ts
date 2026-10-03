import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState, DailyProgress, GameStats } from '../types/game';
import { TOTAL_SLOTS } from '../constants/game';
import { generateUniqueNumber } from '../utils/numberGenerator';
import { dailySequence, todayKey } from '../utils/daily';

interface GameStore extends GameState {
  placeNumber: (position: number) => void;
  generateNumber: () => void;
  resetGame: () => void;
  useHelp: () => void;
  resetHelps: () => void;
  startBeastMode: () => void;
  updateBeastTimer: (time: number) => void;
  endBeastMode: () => void;
  endStuck: () => void;
  startDaily: () => void;
}

export const HELP_LIMIT = 1; // free number changes per Classic game
export const CLASSIC_DAILY_LIMIT = 10;
const BEAST_MODE_COUNTDOWN = 3;

const emptySlots = () => Array(TOTAL_SLOTS).fill(null) as (number | null)[];

const initialStats: GameStats = {
  classicPlayed: 0,
  classicWins: 0,
  bestScore: 0,
  dailyPlayed: 0,
  dailyWins: 0,
  dailyStreak: 0,
  dailyMaxStreak: 0,
  lastDailyKey: null,
};

function yesterdayKey(): string {
  const now = new Date();
  return todayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
}

// Returns updated stats/daily progress for a finished game (classic and daily only)
function recordResult(state: GameState, won: boolean, placed: number): Partial<GameState> {
  const stats = { ...initialStats, ...state.stats };

  if (state.dailyMode && state.daily) {
    if (state.daily.finished) return {};
    const key = state.daily.key;
    stats.dailyPlayed += 1;
    if (won) stats.dailyWins += 1;
    stats.dailyStreak = stats.lastDailyKey === yesterdayKey() ? stats.dailyStreak + 1 : 1;
    stats.dailyMaxStreak = Math.max(stats.dailyMaxStreak, stats.dailyStreak);
    stats.lastDailyKey = key;
    return { stats, daily: { ...state.daily, finished: true, won, placed } };
  }

  if (!state.beastMode) {
    stats.classicPlayed += 1;
    if (won) stats.classicWins += 1;
    stats.bestScore = Math.max(stats.bestScore, placed);
  }
  return { stats };
}

export function classicGamesToday(classicToday: { key: string; count: number } | undefined): number {
  return classicToday && classicToday.key === todayKey() ? classicToday.count : 0;
}

export function isHelpAvailable(helpCount: number): boolean {
  return helpCount < HELP_LIMIT;
}

export function hasValidSlot(slots: (number | null)[], number: number): boolean {
  return slots.some((slot, i) => slot === null && isValidPlacement(slots, i, number));
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      slots: emptySlots(),
      currentNumber: null,
      gameOver: false,
      victory: false,
      score: 0,
      brags: 0,
      helpCount: 0,
      lastHelpTimestamp: null,
      beastMode: false,
      beastTimer: null,
      countdown: null,
      dailyMode: false,
      lossReason: null,
      daily: null,
      stats: initialStats,
      classicToday: { key: todayKey(), count: 0 },

      placeNumber: (position) => {
        const state = get();
        if (state.currentNumber === null || state.gameOver || state.victory) return;

        // A Classic game counts toward the daily limit once its first number is placed
        const isClassic = !state.dailyMode && !state.beastMode;
        if (isClassic && state.score === 0) {
          const used = classicGamesToday(state.classicToday);
          if (used >= CLASSIC_DAILY_LIMIT) return;
          set({ classicToday: { key: todayKey(), count: used + 1 } });
        }

        const newSlots = [...state.slots];
        const isValid = isValidPlacement(newSlots, position, state.currentNumber);

        if (!isValid) {
          set({ gameOver: true, lossReason: 'wrong', ...recordResult(state, false, state.score) });
          return;
        }

        newSlots[position] = state.currentNumber;
        const filledSlots = newSlots.filter(slot => slot !== null).length;
        const victory = filledSlots === TOTAL_SLOTS;
        const score = state.score + 1;

        set({
          slots: newSlots,
          currentNumber: null,
          victory,
          score,
          brags: victory ? (state.beastMode ? state.brags + 3 : state.brags + 1) : state.brags,
          beastTimer: victory ? null : state.beastTimer,
          ...(state.dailyMode && state.daily
            ? { daily: { ...state.daily, slots: newSlots, placed: score } }
            : {}),
        });

        if (victory) {
          set(recordResult(get(), true, score));
        }
      },

      generateNumber: () => {
        const state = get();
        if (state.dailyMode && state.daily) {
          const filled = state.slots.filter(slot => slot !== null).length;
          set({ currentNumber: dailySequence(state.daily.key)[filled] ?? null });
          return;
        }
        set({ currentNumber: generateUniqueNumber(state.slots) });
      },

      resetGame: () => {
        const { brags } = get();
        set({
          slots: emptySlots(),
          currentNumber: null,
          gameOver: false,
          lossReason: null,
          victory: false,
          score: 0,
          brags,
          helpCount: 0, // every new Classic game gets a fresh change
          lastHelpTimestamp: null,
          beastMode: false,
          beastTimer: null,
          countdown: null,
          dailyMode: false,
        });
      },

      resetHelps: () => {
        set({
          helpCount: 0,
          lastHelpTimestamp: null
        });
      },

      useHelp: () => {
        const state = get();
        if (state.beastMode || state.dailyMode || state.gameOver || state.victory) return;
        if (state.helpCount >= HELP_LIMIT) return;

        set({
          helpCount: state.helpCount + 1,
          currentNumber: generateUniqueNumber([...state.slots, state.currentNumber])
        });
      },

      startBeastMode: () => {
        set({
          beastMode: true,
          dailyMode: false,
          countdown: BEAST_MODE_COUNTDOWN,
          beastTimer: null,
          slots: emptySlots(),
          currentNumber: null,
          gameOver: false,
          lossReason: null,
          victory: false,
          score: 0,
        });
      },

      updateBeastTimer: (time) => {
        set({ beastTimer: time });
      },

      endBeastMode: () => {
        if (get().victory) return;
        // Keep beastMode on so the Game Over modal offers a Beast Mode rematch
        set({
          beastTimer: null,
          countdown: null,
          gameOver: true,
          lossReason: 'timeout',
        });
      },

      // Current number has no valid slot left
      endStuck: () => {
        const state = get();
        if (state.gameOver || state.victory) return;
        set({ gameOver: true, lossReason: 'stuck', beastTimer: null, ...recordResult(state, false, state.score) });
      },

      startDaily: () => {
        const state = get();
        const key = todayKey();
        const daily: DailyProgress =
          state.daily && state.daily.key === key
            ? state.daily
            : { key, slots: emptySlots(), finished: false, won: false, placed: 0 };

        if (daily.finished) {
          // Show today's finished board with its result
          set({
            daily,
            dailyMode: true,
            beastMode: false,
            beastTimer: null,
            countdown: null,
            slots: [...daily.slots],
            score: daily.placed,
            victory: daily.won,
            gameOver: !daily.won,
            lossReason: null,
            currentNumber: daily.won ? null : dailySequence(key)[daily.placed] ?? null,
          });
          return;
        }

        set({
          daily,
          dailyMode: true,
          beastMode: false,
          beastTimer: null,
          countdown: null,
          slots: [...daily.slots],
          score: daily.placed,
          gameOver: false,
          lossReason: null,
          victory: false,
          currentNumber: dailySequence(key)[daily.placed] ?? null,
        });
      },
    }),
    {
      name: 'number-game-storage',
      partialize: (state) => ({
        brags: state.brags,
        daily: state.daily,
        stats: state.stats,
        classicToday: state.classicToday,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<GameStore>;
        return { ...current, ...p, helpCount: 0, lastHelpTimestamp: null, stats: { ...initialStats, ...(p.stats ?? {}) } };
      },
    }
  )
);

function isValidPlacement(slots: (number | null)[], position: number, number: number): boolean {
  if (slots[position] !== null) return false;

  // Check left side
  for (let i = position - 1; i >= 0; i--) {
    if (slots[i] !== null) {
      if (slots[i]! >= number) return false;
      break;
    }
  }

  // Check right side
  for (let i = position + 1; i < slots.length; i++) {
    if (slots[i] !== null) {
      if (slots[i]! <= number) return false;
      break;
    }
  }

  return true;
}
