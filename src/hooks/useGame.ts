import { useReducer, useCallback } from 'react';
import { GameState, GameAction } from '../types/game';
import { TOTAL_SLOTS } from '../constants/game';
import { generateUniqueNumber } from '../utils/numberGenerator';

const STORAGE_KEY = 'numberGame_brags';

const getBragsFromStorage = (): number => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : 0;
};

const initialState: GameState = {
  slots: Array(TOTAL_SLOTS).fill(null),
  currentNumber: null,
  gameOver: false,
  victory: false,
  score: 0,
  brags: getBragsFromStorage(),
};

function isValidPlacement(slots: (number | null)[], position: number, number: number): boolean {
  const leftNumber = position > 0 ? slots[position - 1] : -Infinity;
  const rightNumber = position < slots.length - 1 ? slots[position + 1] : Infinity;
  
  return (leftNumber === null || leftNumber < number) && 
         (rightNumber === null || number < rightNumber);
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'GENERATE_NUMBER':
      return {
        ...state,
        currentNumber: generateUniqueNumber(state.slots),
      };
      
    case 'PLACE_NUMBER': {
      if (state.currentNumber === null || state.gameOver) return state;
      
      if (!isValidPlacement(state.slots, action.position, state.currentNumber)) {
        return { ...state, gameOver: true };
      }
      
      const newSlots = [...state.slots];
      newSlots[action.position] = state.currentNumber;
      
      const filledSlots = newSlots.filter(slot => slot !== null).length;
      const victory = filledSlots === TOTAL_SLOTS;
      
      if (victory) {
        const newBrags = state.brags + 1;
        localStorage.setItem(STORAGE_KEY, newBrags.toString());
        return {
          ...state,
          slots: newSlots,
          currentNumber: null,
          victory,
          score: state.score + 1,
          brags: newBrags,
        };
      }
      
      return {
        ...state,
        slots: newSlots,
        currentNumber: null,
        victory,
        score: state.score + 1,
      };
    }
    
    case 'RESET_GAME':
      return {
        ...initialState,
        brags: state.brags,
      };
      
    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  const placeNumber = useCallback((position: number) => {
    dispatch({ type: 'PLACE_NUMBER', position });
  }, []);
  
  const generateNumber = useCallback(() => {
    dispatch({ type: 'GENERATE_NUMBER' });
  }, []);
  
  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);
  
  return {
    state,
    placeNumber,
    generateNumber,
    resetGame,
  };
}