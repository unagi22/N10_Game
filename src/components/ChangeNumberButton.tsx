import React from 'react';
import { Wand2 } from 'lucide-react';
import { useGameStore, HELP_LIMIT } from '../store/gameStore';
import { cn } from '../utils/cn';

export function ChangeNumberButton({ highlight }: { highlight?: boolean }) {
  const { helpCount, useHelp, beastMode } = useGameStore();

  if (beastMode) return null;

  const isUsed = helpCount >= HELP_LIMIT;

  return (
    <button
      onClick={useHelp}
      disabled={isUsed}
      className={cn(
        "w-full h-11 flex items-center justify-center gap-2 px-3 text-sm rounded-2xl border font-medium transition active:scale-[0.98]",
        isUsed
          ? "border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.03] text-slate-400 dark:text-slate-500 cursor-not-allowed"
          : highlight
          ? "border-amber-300/60 bg-amber-400/20 text-amber-800 dark:text-amber-100 animate-pulse"
          : "border-violet-400/20 bg-violet-500/10 hover:bg-violet-500/20 text-violet-700 dark:text-violet-200"
      )}
    >
      <Wand2 className="w-4 h-4" />
      <span>{isUsed ? 'Change used this game' : 'Change number (1 per game)'}</span>
    </button>
  );
}
