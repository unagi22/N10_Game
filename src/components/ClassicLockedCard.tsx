import React from 'react';
import { Moon } from 'lucide-react';
import { useMidnightCountdown } from '../utils/share';
import { CLASSIC_DAILY_LIMIT } from '../store/gameStore';

export function ClassicLockedCard() {
  const countdown = useMidnightCountdown();
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm shadow-indigo-900/5 dark:border-white/10 dark:bg-white/[0.04]" aria-live="polite">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10">
        <Moon className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
      </div>
      <p className="font-display text-2xl font-bold">That's {CLASSIC_DAILY_LIMIT} for today</p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        New Classic games in <span className="font-display font-bold tabular-nums text-slate-700 dark:text-slate-200">{countdown}</span>
      </p>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Daily and Beast Mode are still open.</p>
    </section>
  );
}
