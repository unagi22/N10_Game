import React, { useState } from 'react';
import { Moon, Sun, Trophy } from 'lucide-react';
import { useTheme } from '../utils/theme';
import { useGameStore } from '../store/gameStore';
import { BragsModal } from './BragsModal';

export function GameHeader() {
  const brags = useGameStore(state => state.brags);
  const stats = useGameStore(state => state.stats);
  const [showBragsModal, setShowBragsModal] = useState(false);
  const { theme, toggle } = useTheme();

  return (
    <header className="flex items-start justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          N<span className="text-indigo-600 dark:text-indigo-400">10</span>
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-snug max-w-[15rem]">
          10 random numbers (1-100). 10 spots. Perfect order. Good luck.
        </p>
      </div>

      <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>
      <button
        onClick={() => setShowBragsModal(true)}
        className="flex items-center gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-3 py-2 transition hover:bg-amber-400/20 active:scale-95"
        aria-label={`Brags: ${brags}. Open stats`}
      >
        <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-300" />
        <div className="text-left leading-none">
          <span className="block text-[10px] font-medium uppercase tracking-wider text-amber-700/80 dark:text-amber-200/80">Brags</span>
          <span className="font-display text-lg font-bold text-amber-700 dark:text-amber-200">{brags}</span>
        </div>
      </button>
      </div>

      <BragsModal
        isOpen={showBragsModal}
        onClose={() => setShowBragsModal(false)}
        brags={brags}
        stats={stats}
      />
    </header>
  );
}
