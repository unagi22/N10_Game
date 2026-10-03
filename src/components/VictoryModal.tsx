import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Zap } from 'lucide-react';
import { cn } from '../utils/cn';
import { Modal, ModalButton } from './Modal';

interface VictoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOverlayClick: () => void;
  score: number;
  beastMode: boolean;
}

export function VictoryModal({ isOpen, onClose, onOverlayClick, score, beastMode }: VictoryModalProps) {
  useEffect(() => {
    if (isOpen) {
      const duration = beastMode ? 5000 : 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { 
        startVelocity: beastMode ? 45 : 30, 
        spread: beastMode ? 360 : 180, 
        ticks: 60, 
        zIndex: 60 
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: number = window.setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen, beastMode]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onOverlayClick} tone={beastMode ? 'beast' : 'gold'}>
      <div className="text-center">
        <div className={cn(
          "mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full",
          beastMode ? "bg-rose-500/20" : "bg-amber-400/20"
        )}>
          {beastMode ? <Zap className="h-10 w-10 text-rose-600 dark:text-rose-300" /> : <Trophy className="h-10 w-10 text-amber-600 dark:text-amber-300" />}
        </div>
        <h2 className="font-display text-3xl font-bold">
          {beastMode ? "Beast Mode Victory!" : "Perfect board!"}
        </h2>
        <p className="mt-2 mb-6 text-slate-600 dark:text-slate-300">
          {beastMode
            ? "You beat the clock. I salute you. +3 brags!"
            : `All ${score} numbers in perfect order. Most games never get here. +1 brag!`}
        </p>
        <ModalButton onClick={onClose} variant={beastMode ? 'beast' : 'gold'}>Play again</ModalButton>
      </div>
    </Modal>
  );
}
