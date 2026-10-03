import React from 'react';
import { cn } from '../utils/cn';

interface GameSlotProps {
  value: number | null;
  position: number;
  onSelect: () => void;
  disabled: boolean;
  beastMode?: boolean;
}

export function GameSlot({ value, position, onSelect, disabled, beastMode }: GameSlotProps) {
  const filled = value !== null;
  return (
    <button
      onClick={onSelect}
      disabled={disabled || filled}
      aria-label={filled ? `Spot ${position + 1}: ${value}` : `Place in spot ${position + 1}`}
      className={cn(
        'relative aspect-[4/5] w-full rounded-2xl font-display font-bold transition-all duration-200',
        'flex items-center justify-center select-none',
        filled
          ? cn(
              'animate-pop text-white text-2xl sm:text-3xl shadow-lg',
              beastMode
                ? 'bg-gradient-to-br from-rose-500 to-orange-500 shadow-rose-500/30'
                : 'bg-gradient-to-br from-indigo-500 to-violet-500 shadow-indigo-500/30'
            )
          : cn(
              'border-2 border-dashed border-slate-300 dark:border-white/15 bg-white dark:bg-white/[0.03] text-transparent',
              !disabled && 'hover:border-indigo-400/70 hover:bg-indigo-50 dark:hover:bg-indigo-400/10 active:scale-95 cursor-pointer',
              disabled && 'cursor-not-allowed opacity-60'
            )
      )}
    >
      <span className={cn('absolute left-2 top-1.5 text-[10px] font-sans font-medium', filled ? 'text-white/60' : 'text-slate-400 dark:text-white/40')}>
        {position + 1}
      </span>
      {value}
    </button>
  );
}
