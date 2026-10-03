import React from 'react';
import { Zap, RotateCcw } from 'lucide-react';
import { Modal, ModalButton } from './Modal';
import { TOTAL_SLOTS } from '../constants/game';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOverlayClick: () => void;
  onBeastMode: () => void;
  wasBeastMode: boolean;
  score: number;
  bestScore: number;
  lossReason: 'wrong' | 'stuck' | 'timeout' | null;
  lastNumber: number | null;
  classicLeft: number;
}

const MESSAGES = ['Ouch.', 'So close... not really.', 'The numbers win again.', 'That one hurt.'];

export function GameOverModal({
  isOpen, onClose, onOverlayClick, onBeastMode, wasBeastMode, score, bestScore, lossReason, lastNumber, classicLeft,
}: GameOverModalProps) {
  const reason =
    lossReason === 'timeout' ? 'Time ran out.'
    : lossReason === 'stuck' ? `No spot left for ${lastNumber}.`
    : `${lastNumber} didn't fit there.`;
  const headline = score >= 8 ? 'So close!' : MESSAGES[score % MESSAGES.length];

  return (
    <Modal isOpen={isOpen} onClose={onOverlayClick} tone={wasBeastMode ? 'beast' : 'default'}>
      <div className="text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">{reason}</p>
        <h2 className="mt-1 font-display text-3xl font-bold">{headline}</h2>
        <div className="my-5 flex justify-center gap-3">
          <div className="flex-1 rounded-2xl bg-slate-100 dark:bg-white/5 py-3">
            <p className="font-display text-3xl font-bold">{score}<span className="text-lg text-slate-400 dark:text-slate-500">/{TOTAL_SLOTS}</span></p>
            <p className="text-xs text-slate-500 dark:text-slate-400">This game</p>
          </div>
          {!wasBeastMode && (
            <div className="flex-1 rounded-2xl bg-slate-100 dark:bg-white/5 py-3">
              <p className="font-display text-3xl font-bold">{bestScore}<span className="text-lg text-slate-400 dark:text-slate-500">/{TOTAL_SLOTS}</span></p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Best</p>
            </div>
          )}
        </div>
        <div className="space-y-2.5">
          <ModalButton onClick={onClose}>
            <RotateCcw className="h-5 w-5" />
            {classicLeft === 0 ? 'Done for today' : `New game (${classicLeft} left today)`}
          </ModalButton>
          <ModalButton onClick={onBeastMode} variant={wasBeastMode ? 'beast' : 'ghost'}>
            <Zap className="h-5 w-5" /> {wasBeastMode ? 'Beast Mode rematch' : 'Try Beast Mode'}
          </ModalButton>
        </div>
      </div>
    </Modal>
  );
}
