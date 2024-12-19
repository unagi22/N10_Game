import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameState } from '../types/game';
import { TOTAL_SLOTS } from '../constants/game';
import { generateUniqueNumber } from '../utils/numberGenerator';

interface GameStore extends GameState {
  placeNumber: (position: number) => void;
  generateNumber: () => void;
  resetGame: () => void;
  useHelp: () => void;
  useBonusHelp: () => void;
  resetHelps: () => void;
  startBeastMode: () => void;
  updateBeastTimer: (time: number) => void;
  endBeastMode: () => void;
  HELP_COOLDOWN: number;
}

const HELP_LIMIT = 2;
const HELP_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds
const BONUS_HELP_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds
const BEAST_MODE_TIME = 12;
const BEAST_MODE_COUNTDOWN = 3;
const MAX_BONUS_HELPS = 3;
const MIN_NUMBER = 1;
const MAX_NUMBER = 100;

// Level thresholds and rewards
const LEVELS = [
  { name: "Beginner", threshold: 0, reward: 0 },
  { name: "Number Ninja", threshold: 100, reward: 2 },
  { name: "Digit Master", threshold: 300, reward: 3 },
  { name: "Math Wizard", threshold: 750, reward: 4 },
  { name: "Number God", threshold: 1000, reward: 5 },
  { name: "Legendary Calculator", threshold: 5000, reward: 7 },
  { name: "Infinity Brain", threshold: 10000, reward: 10 }
];

function calculateLevel(totalScore: number) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalScore >= LEVELS[i].threshold) {
      return i;
    }
  }
  return 0;
}

// Track all numbers that have been used in the current game
let gameNumbers = new Set<number>();

function generateUniqueNumbers(slots: (number | null)[], count: number): number[] {
  // Get all available numbers (1-100) that haven't been used yet
  const availableNumbers = Array.from({ length: MAX_NUMBER }, (_, i) => i + 1)
    .filter(n => !gameNumbers.has(n));
  
  // Shuffle available numbers
  for (let i = availableNumbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableNumbers[i], availableNumbers[j]] = [availableNumbers[j], availableNumbers[i]];
  }
  
  // Take only the numbers we need
  const remainingSlots = TOTAL_SLOTS - slots.filter(slot => slot !== null).length;
  const numbersToGenerate = Math.min(count, remainingSlots, availableNumbers.length);
  const result = availableNumbers.slice(0, numbersToGenerate);
  
  // Add new numbers to the tracking set
  result.forEach(n => gameNumbers.add(n));
  
  return result;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      slots: Array(TOTAL_SLOTS).fill(null),
      currentNumber: null,
      nextNumbers: [null, null],
      gameOver: false,
      victory: false,
      score: 0,
      brags: 0,
      helpCount: 0,
      lastHelpTimestamp: null,
      bonusHelps: MAX_BONUS_HELPS,
      lastBonusHelpCheck: Date.now(),
      totalScore: 0,
      level: 0,
      beastMode: false,
      beastTimer: null,
      countdown: null,
      HELP_COOLDOWN,
      
      placeNumber: (position) => {
        const state = get();
        if (state.currentNumber === null || state.gameOver) return;
        
        const newSlots = [...state.slots];
        const isValid = isValidPlacement(newSlots, position, state.currentNumber);
        
        if (!isValid) {
          set({ gameOver: true });
          return;
        }
        
        newSlots[position] = state.currentNumber;
        const filledSlots = newSlots.filter(slot => slot !== null).length;
        const victory = filledSlots === TOTAL_SLOTS;
        const newTotalScore = state.totalScore + 1;
        const levelUp = get().checkLevelUp(newTotalScore);
        
        set({
          slots: newSlots,
          currentNumber: null,
          victory,
          score: state.score + 1,
          totalScore: newTotalScore,
          brags: victory ? (state.beastMode ? state.brags + 3 : state.brags + 1) : state.brags,
        });
      },
      
      generateNumber: () => {
        const state = get();
        const filledSlots = state.slots.filter(slot => slot !== null).length;
        
        if (filledSlots >= TOTAL_SLOTS) {
          set({ currentNumber: null, nextNumbers: [null, null] });
          return;
        }
        
        // If we don't have next numbers queued up
        if (state.nextNumbers[0] === null) {
          const numbersNeeded = Math.min(3, TOTAL_SLOTS - filledSlots);
          const numbers = generateUniqueNumbers(state.slots, numbersNeeded);
          
          set({ 
            currentNumber: numbers[0],
            nextNumbers: [
              numbers.length > 1 ? numbers[1] : null,
              numbers.length > 2 ? numbers[2] : null
            ]
          });
        } else {
          // Use the next number and generate a new one if needed
          const remainingSlots = TOTAL_SLOTS - filledSlots;
          const nextNumber = remainingSlots > 1 ? generateUniqueNumbers(state.slots, 1)[0] : null;
          
          set({ 
            currentNumber: state.nextNumbers[0],
            nextNumbers: [state.nextNumbers[1], nextNumber]
          });
        }
      },
      
      resetGame: () => {
        const { brags, bonusHelps, lastBonusHelpCheck, totalScore, level } = get();
        // Reset the game numbers tracking set
        gameNumbers = new Set<number>();
        set({
          slots: Array(TOTAL_SLOTS).fill(null),
          currentNumber: null,
          nextNumbers: [null, null],
          gameOver: false,
          victory: false,
          score: 0,
          brags,
          helpCount: 0,
          bonusHelps,
          lastBonusHelpCheck,
          totalScore,
          level,
          beastMode: false,
          beastTimer: null,
          countdown: null,
        });
      },

      checkLevelUp: (newScore: number) => {
        const state = get();
        const currentLevel = state.level;
        const newLevel = calculateLevel(newScore);
        
        if (newLevel > currentLevel) {
          // Give bonus helps for leveling up (2 helps per level gained)
          const levelsGained = newLevel - currentLevel;
          const bonusHelpsFromLevel = levelsGained * 2;
          
          set(state => ({ 
            level: newLevel,
            bonusHelps: state.bonusHelps + bonusHelpsFromLevel // No maximum limit for level-up bonuses
          }));
          return true;
        }
        return false;
      },

      useHelp: () => {
        const state = get();
        if (state.helpCount >= 1) return;
        
        set({ 
          helpCount: 1,
          currentNumber: generateUniqueNumbers(state.slots, 1)[0]
        });
      },

      useBonusHelp: () => {
        const state = get();
        const now = Date.now();
        
        // Check and update hourly bonus helps (max 3)
        if (state.lastBonusHelpCheck) {
          const hoursPassed = Math.floor((now - state.lastBonusHelpCheck) / BONUS_HELP_COOLDOWN);
          if (hoursPassed > 0) {
            // Only apply the maximum limit to hourly bonus helps
            const currentHourlyHelps = Math.min(state.bonusHelps, MAX_BONUS_HELPS);
            const newHourlyHelps = Math.min(MAX_BONUS_HELPS, currentHourlyHelps + hoursPassed);
            const bonusHelpsFromLevels = Math.max(0, state.bonusHelps - MAX_BONUS_HELPS);
            
            set({ 
              bonusHelps: newHourlyHelps + bonusHelpsFromLevels,
              lastBonusHelpCheck: now
            });
          }
        } else {
          set({ lastBonusHelpCheck: now });
        }
        
        // Use bonus help if available
        if (state.bonusHelps > 0) {
          set(state => ({ 
            bonusHelps: state.bonusHelps - 1,
            currentNumber: generateUniqueNumbers(state.slots, 1)[0]
          }));
        }
      },

      resetHelps: () => {
        set({ 
          helpCount: 0,
          lastHelpTimestamp: null
        });
      },
      
      startBeastMode: () => {
        set({
          beastMode: true,
          countdown: BEAST_MODE_COUNTDOWN,
          slots: Array(TOTAL_SLOTS).fill(null),
          currentNumber: null,
          nextNumbers: [null, null],
          gameOver: false,
          victory: false,
          score: 0,
        });
      },

      updateBeastTimer: (time) => {
        set({ beastTimer: time });
      },

      endBeastMode: () => {
        set({
          beastMode: false,
          beastTimer: null,
          countdown: null,
          gameOver: true,
        });
      },
    }),
    {
      name: 'number-game-storage',
      partialize: (state) => ({ 
        brags: state.brags,
        helpCount: state.helpCount,
        lastHelpTimestamp: state.lastHelpTimestamp,
        bonusHelps: state.bonusHelps,
        lastBonusHelpCheck: state.lastBonusHelpCheck,
        totalScore: state.totalScore,
        level: state.level,
      }),
    }
  )
);

function isValidPlacement(slots: (number | null)[], position: number, number: number): boolean {
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