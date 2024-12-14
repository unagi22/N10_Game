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
  resetHelps: () => void;
  startBeastMode: () => void;
  updateBeastTimer: (time: number) => void;
  endBeastMode: () => void;
  HELP_COOLDOWN: number;
}

const HELP_LIMIT = 2;
const HELP_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds
const BEAST_MODE_TIME = 12;
const BEAST_MODE_COUNTDOWN = 3;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      slots: Array(TOTAL_SLOTS).fill(null),
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
        
        set({
          slots: newSlots,
          currentNumber: null,
          victory,
          score: state.score + 1,
          brags: victory ? (state.beastMode ? state.brags + 3 : state.brags + 1) : state.brags,
        });
      },
      
      generateNumber: () => {
        const state = get();
        set({ currentNumber: generateUniqueNumber(state.slots) });
      },
      
      resetGame: () => {
        const { brags, helpCount, lastHelpTimestamp } = get();
        set({
          slots: Array(TOTAL_SLOTS).fill(null),
          currentNumber: null,
          gameOver: false,
          victory: false,
          score: 0,
          brags,
          helpCount,
          lastHelpTimestamp,
          beastMode: false,
          beastTimer: null,
          countdown: null,
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
        const now = Date.now();
        
        // Reset help count if cooldown has passed
        if (state.lastHelpTimestamp && now - state.lastHelpTimestamp >= HELP_COOLDOWN) {
          set({ 
            helpCount: 0,
            lastHelpTimestamp: null,
            currentNumber: generateUniqueNumber(state.slots)
          });
          return;
        }
        
        // Use help if available
        if (state.helpCount < HELP_LIMIT) {
          const newHelpCount = state.helpCount + 1;
          set({ 
            helpCount: newHelpCount,
            lastHelpTimestamp: newHelpCount === HELP_LIMIT ? now : null,
            currentNumber: generateUniqueNumber(state.slots)
          });
        }
      },

      startBeastMode: () => {
        set({
          beastMode: true,
          countdown: BEAST_MODE_COUNTDOWN,
          slots: Array(TOTAL_SLOTS).fill(null),
          currentNumber: null,
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