import React from 'react';
import { GameSlot } from './GameSlot';
import { GameState } from '../types/game';
import { TOTAL_SLOTS } from '../constants/game';

interface GameBoardProps {
  gameState: GameState;
  onSlotSelect: (position: number) => void;
  disabled?: boolean;
}

export function GameBoard({ gameState, onSlotSelect, disabled }: GameBoardProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {gameState.slots.map((value, index) => (
        <GameSlot
          key={index}
          value={value}
          position={index}
          onSelect={() => onSlotSelect(index)}
          disabled={disabled || gameState.currentNumber === null || gameState.gameOver}
        />
      ))}
    </div>
  );
}