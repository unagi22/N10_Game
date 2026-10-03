import React from 'react';
import { GameState } from '../types/game';
import { AlertTriangle, CalendarDays, Timer, Zap } from 'lucide-react';
import { cn } from '../utils/cn';
import { TOTAL_SLOTS } from '../constants/game';

const BEAST_MODE_TIME = 12;

interface GameStatusProps {
  state: GameState;
  stuck?: boolean;
  dailyNumber?: number;
}

export function GameStatus({ state, stuck, dailyNumber }: GameStatusProps) {
  const lost = state.gameOver && !state.victory;

  const modeLabel = state.beastMode ? (
    <><Zap className="h-3.5 w-3.5" /> Beast Mode</>
  ) : state.dailyMode ? (
    <><CalendarDays className="h-3.5 w-3.5" /> Daily #{dailyNumber}</>
  ) : (
    <>Classic</>
  );

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-3xl border p-5 transition-colors',
        state.beastMode ? 'border-rose-500/30 bg-rose-500/10' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] shadow-sm shadow-indigo-900/5',
        state.victory && 'border-emerald-400/40 bg-emerald-400/10',
        lost && 'border-rose-500/40 bg-rose-500/10'
      )}
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
            state.beastMode ? 'bg-rose-500/20 text-rose-700 dark:text-rose-200' : state.dailyMode ? 'bg-sky-400/15 text-sky-700 dark:text-sky-200' : 'bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-slate-300'
          )}
        >
          {modeLabel}
        </span>

        <div className="flex items-center gap-1" aria-label={`${state.score} of ${TOTAL_SLOTS} placed`}>
          {Array.from({ length: TOTAL_SLOTS }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-1.5 w-2.5 rounded-full transition-colors',
                i < state.score ? (state.beastMode ? 'bg-rose-400' : 'bg-indigo-400') : 'bg-slate-200 dark:bg-white/15'
              )}
            />
          ))}
          <span className="ml-1.5 font-display text-sm font-bold text-slate-600 dark:text-slate-300">{state.score}/{TOTAL_SLOTS}</span>
        </div>
      </div>

      <div className="flex min-h-[8.5rem] flex-col items-center justify-center text-center">
        {state.countdown !== null ? (
          <>
            <p className="text-sm text-rose-700 dark:text-rose-200">Get ready!</p>
            <p key={state.countdown} className="animate-pop font-display text-7xl font-bold text-rose-600 dark:text-rose-300">{state.countdown}</p>
          </>
        ) : state.victory ? (
          <>
            <p className="font-display text-4xl font-bold text-emerald-600 dark:text-emerald-300">Perfect!</p>
            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-100/80">All {TOTAL_SLOTS} in order. Brag away.</p>
          </>
        ) : lost ? (
          <>
            <p className="text-sm text-rose-700 dark:text-rose-200">
              {state.lossReason === 'timeout' ? 'Out of time with' : state.lossReason === 'stuck' ? 'No spot left for' : 'Wrong spot for'}
            </p>
            <p className="font-display text-6xl font-bold text-rose-600 dark:text-rose-300 line-through decoration-4">{state.currentNumber ?? '-'}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Final score {state.score}/{TOTAL_SLOTS}</p>
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Place this number</p>
            <p
              key={state.currentNumber ?? 'none'}
              className={cn(
                'animate-pop font-display text-7xl font-bold tabular-nums',
                state.beastMode ? 'text-rose-700 dark:text-rose-200' : 'text-slate-900 dark:text-white'
              )}
            >
              {state.currentNumber ?? '...'}
            </p>
          </>
        )}
      </div>

      {stuck && !state.gameOver && (
        <p className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-400/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          No spot fits this number. Change it or tap any spot to end.
        </p>
      )}

      {state.beastMode && state.beastTimer !== null && state.countdown === null && (
        <div className="mt-2">
          <div className="mb-1 flex items-center justify-end gap-1 text-sm font-bold text-rose-700 dark:text-rose-200">
            <Timer className="h-4 w-4" /> {state.beastTimer}s
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-rose-100 dark:bg-rose-950">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400 transition-[width] duration-1000 ease-linear"
              style={{ width: `${(state.beastTimer / BEAST_MODE_TIME) * 100}%` }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
