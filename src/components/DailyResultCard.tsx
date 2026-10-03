import React, { useState } from 'react';
import { BarChart3, CalendarDays, Check, Copy, Share2 } from 'lucide-react';
import { DailyProgress } from '../types/game';
import { TOTAL_SLOTS } from '../constants/game';
import { buildShareText } from '../utils/daily';
import { shareResult, useMidnightCountdown } from '../utils/share';
import { cn } from '../utils/cn';

interface DailyResultCardProps {
  daily: DailyProgress;
  dailyNumber: number;
  onShowStats: () => void;
}

export function DailyResultCard({ daily, dailyNumber, onShowStats }: DailyResultCardProps) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');
  const countdown = useMidnightCountdown();
  const { placed, won } = daily;
  const shareText = buildShareText(placed, won, dailyNumber);

  const handleShare = async () => {
    const outcome = await shareResult(shareText);
    if (outcome === 'shared') return;
    setStatus(outcome);
    if (outcome === 'copied') setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <section
      className={cn(
        'rounded-3xl border p-5 text-center shadow-sm',
        won
          ? 'border-emerald-400/40 bg-emerald-400/10'
          : 'border-slate-200 bg-white shadow-indigo-900/5 dark:border-white/10 dark:bg-white/[0.04]'
      )}
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/15 px-2.5 py-1 text-xs font-semibold text-sky-700 dark:text-sky-200">
          <CalendarDays className="h-3.5 w-3.5" /> Daily #{dailyNumber}
        </span>
        <button
          onClick={onShowStats}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
        >
          <BarChart3 className="h-3.5 w-3.5" /> Stats
        </button>
      </div>

      <p className="mt-3 font-display text-5xl font-bold">
        {won ? (
          <span className="text-emerald-600 dark:text-emerald-300">Perfect!</span>
        ) : (
          <>{placed}<span className="text-2xl text-slate-400 dark:text-slate-500">/{TOTAL_SLOTS}</span></>
        )}
      </p>

      <div className="my-4 flex justify-center gap-1" aria-label={`${placed} of ${TOTAL_SLOTS} placed`}>
        {Array.from({ length: TOTAL_SLOTS }, (_, i) => (
          <span key={i} className="text-[1.3rem] leading-none sm:text-2xl" aria-hidden>
            {won ? '🟩' : i < placed ? '🟦' : i === placed ? '🟥' : '⬜'}
          </span>
        ))}
      </div>

      <button
        onClick={handleShare}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-indigo-500 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 active:scale-[0.98]"
      >
        {status === 'copied' ? (
          <><Check className="h-5 w-5" /> Copied! Paste it anywhere</>
        ) : (
          <><Share2 className="h-5 w-5" /> Share result</>
        )}
      </button>

      {status === 'failed' && (
        <div className="mt-3 rounded-xl bg-slate-100 p-3 text-left dark:bg-white/5">
          <p className="mb-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><Copy className="h-3.5 w-3.5" /> Copy your result:</p>
          <pre className="select-all whitespace-pre-wrap font-sans text-sm">{shareText}</pre>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
        Next daily in <span className="font-display font-bold tabular-nums text-slate-700 dark:text-slate-200">{countdown}</span>
      </p>
    </section>
  );
}
