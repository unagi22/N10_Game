import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Zap } from 'lucide-react';
import { cn } from '../utils/cn';

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
        zIndex: 0 
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
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onOverlayClick}
    >
      <div 
        className={cn(
          "rounded-xl p-6 max-w-sm w-full mx-4 relative",
          beastMode ? "bg-red-50" : "bg-white"
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
            beastMode ? "bg-red-100" : "bg-yellow-100"
          )}>
            {beastMode ? (
              <Zap className="w-8 h-8 text-red-600" />
            ) : (
              <Trophy className="w-8 h-8 text-yellow-600" />
            )}
          </div>
          <h2 className={cn(
            "text-2xl font-bold mb-2",
            beastMode ? "text-red-900" : "text-gray-900"
          )}>
            {beastMode ? "Beast Mode Victory!" : "Victory!"}
          </h2>
          <p className={cn(
            "mb-4",
            beastMode ? "text-red-600" : "text-gray-600"
          )}>
            {beastMode ? (
              "Wow, you won in Beast Mode. I salute you. You won 2 brags!"
            ) : (
              `Congratulations! You've completed the board with a perfect score of ${score}!`
            )}
          </p>
          <button
            onClick={onClose}
            className={cn(
              "w-full rounded-lg py-2 px-4 text-white transition-colors",
              beastMode ? 
                "bg-red-600 hover:bg-red-700" : 
                "bg-blue-600 hover:bg-blue-700"
            )}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}