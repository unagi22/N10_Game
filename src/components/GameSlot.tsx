import React from 'react';
import { cn } from '../utils/cn';

interface GameSlotProps {
  value: number | null;
  position: number;
  onSelect: () => void;
  disabled: boolean;
}

export function GameSlot({ value, position, onSelect, disabled }: GameSlotProps) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled || value !== null}
      className={cn(
        'w-full aspect-square rounded-lg font-semibold text-lg transition-all duration-300',
        'flex items-center justify-center',
        value === null 
          ? 'bg-gray-100 hover:bg-gray-200 text-gray-400'
          : 'bg-blue-500 text-white',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {value ?? position + 1}
    </button>
  );
}