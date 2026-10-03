import React from 'react';
import { GameSlot } from './GameSlot';
import { GameState } from '../types/game';
import { cn } from '../utils/cn';

interface GameBoardProps {
  gameState: GameState;
  onSlotSelect: (position: number) => void;
  disabled?: boolean;
}

export function GameBoard({ gameState, onSlotSelect, disabled }: GameBoardProps) {
  const lost = gameState.gameOver && !gameState.victory;
  return (
    <div className={cn('grid grid-cols-5 gap-2 sm:gap-3', lost && 'animate-shake')}>
      {gameState.slots.map((value, index) => (
        <GameSlot
          key={index}
          value={value}
          position={index}
          beastMode={gameState.beastMode}
          onSelect={() => onSlotSelect(index)}
          disabled={!!disabled || gameState.currentNumber === null || gameState.gameOver || gameState.victory}
        />
      ))}
    </div>
  );
}
