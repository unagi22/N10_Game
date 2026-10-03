import React, { useEffect, useState } from 'react';
import { CalendarDays, Check, Share2 } from 'lucide-react';
import { Modal, ModalButton } from './Modal';
import { DailyProgress, GameStats } from '../types/game';
import { TOTAL_SLOTS } from '../constants/game';
import { buildShareText, msUntilTomorrow } from '../utils/daily';
import { cn } from '../utils/cn';

interface DailyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayClassic: () => void;
  daily: DailyProgress | null;
  dailyNumber: number;
  stats: GameStats;
}

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, '0');
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export function DailyModal({ isOpen, onClose, onPlayClassic, daily, dailyNumber, stats }: DailyModalProps) {
  const [countdown, setCountdown] = useState(msUntilTomorrow());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCountdown(msUntilTomorrow());
    const interval = setInterval(() => setCountdown(msUntilTomorrow()), 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!daily) return null;

  const placed = daily.placed;
  const won = daily.won;
  const shareText = buildShareText(placed, won, dailyNumber);
  const winRate = stats.dailyPlayed ? Math.round((stats.dailyWins / stats.dailyPlayed) * 100) : 0;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
        return;
      }
    } catch {
      // User cancelled the share sheet, fall back to copying
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy your result:', shareText);
    }
  };

  const stat = [
    { label: 'Played', value: stats.dailyPlayed },
    { label: 'Win %', value: winRate },
    { label: 'Streak', value: stats.dailyStreak },
    { label: 'Max', value: stats.dailyMaxStreak },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-sky-400/15 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-200">
          <CalendarDays className="h-3.5 w-3.5" /> Daily #{dailyNumber}
        </p>
        <h2 className="mt-3 font-display text-5xl font-bold">
          {won ? 'Perfect!' : <>{placed}<span className="text-2xl text-slate-400 dark:text-slate-500">/{TOTAL_SLOTS}</span></>}
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {won ? 'You solved today\'s board. Legend.' : placed >= 7 ? 'Strong run. Same numbers for everyone today.' : 'Same numbers for everyone today. Can your friends do better?'}
        </p>

        <div className="my-5 flex justify-center gap-1.5" aria-hidden>
          {Array.from({ length: TOTAL_SLOTS }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-6 w-6 rounded-md',
                won ? 'bg-emerald-400' : i < placed ? 'bg-indigo-400' : i === placed ? 'bg-rose-500' : 'bg-slate-200/70 dark:bg-white/10'
              )}
            />
          ))}
        </div>

        <ModalButton onClick={handleShare}>
          {copied ? <><Check className="h-5 w-5" /> Copied!</> : <><Share2 className="h-5 w-5" /> Share result</>}
        </ModalButton>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {stat.map(item => (
            <div key={item.label} className="rounded-2xl bg-slate-100 dark:bg-white/5 py-2.5">
              <p className="font-display text-xl font-bold">{item.value}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Next daily in</p>
        <p className="font-display text-2xl font-bold tabular-nums">{formatCountdown(countdown)}</p>

        <ModalButton onClick={onPlayClassic} variant="ghost" className="mt-5">Play Classic</ModalButton>
      </div>
    </Modal>
  );
}
