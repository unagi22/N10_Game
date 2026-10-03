import React from 'react';
import { Trophy } from 'lucide-react';
import { Modal, ModalButton } from './Modal';
import { GameStats } from '../types/game';
import { TOTAL_SLOTS } from '../constants/game';

interface BragsModalProps {
  isOpen: boolean;
  onClose: () => void;
  brags: number;
  stats: GameStats;
}

export function BragsModal({ isOpen, onClose, brags, stats }: BragsModalProps) {
  const winRate = stats.classicPlayed ? Math.round((stats.classicWins / stats.classicPlayed) * 100) : 0;
  const items = [
    { label: 'Games', value: stats.classicPlayed },
    { label: 'Wins', value: stats.classicWins },
    { label: 'Win %', value: winRate },
    { label: 'Best', value: `${stats.bestScore}/${TOTAL_SLOTS}` },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} tone="gold">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/20">
          <Trophy className="h-10 w-10 text-amber-600 dark:text-amber-300" />
        </div>
        <p className="font-display text-5xl font-bold text-amber-700 dark:text-amber-200">{brags}</p>
        <h2 className="text-sm uppercase tracking-widest text-amber-700/80 dark:text-amber-100/70">Brags</h2>
        <p className="mt-3 text-slate-600 dark:text-slate-300">
          {brags === 0 ? "Keep playing, you've got this!" : `Be proud. ${brags} ${brags === 1 ? 'brag' : 'brags'} in a game this hard is no joke.`}
        </p>

        <p className="mt-6 mb-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Classic stats</p>
        <div className="mb-6 grid grid-cols-4 gap-2">
          {items.map(item => (
            <div key={item.label} className="rounded-2xl bg-slate-100 dark:bg-white/5 py-2.5">
              <p className="font-display text-xl font-bold">{item.value}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.label}</p>
            </div>
          ))}
        </div>
        <ModalButton onClick={onClose} variant="gold">Close</ModalButton>
      </div>
    </Modal>
  );
}
