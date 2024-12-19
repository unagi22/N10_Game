import React, { useState, useEffect } from 'react';
import { Wand2, Gift } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { cn } from '../utils/cn';

function formatTimeRemaining(timestamp: number | null, cooldown: number): string {
  if (!timestamp) return '';
  const now = Date.now();
  const diff = Math.max(0, (timestamp + cooldown) - now);
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}

export function ChangeNumberButton() {
  const { 
    helpCount,
    bonusHelps,
    lastBonusHelpCheck,
    useHelp,
    useBonusHelp,
    beastMode,
    HELP_COOLDOWN 
  } = useGameStore();

  const [timeLeft, setTimeLeft] = useState('');
  const [showBonusAvailable, setShowBonusAvailable] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (lastBonusHelpCheck) {
      setTimeLeft(formatTimeRemaining(lastBonusHelpCheck, HELP_COOLDOWN));
    } else {
      setTimeLeft('');
    }
  }, [lastBonusHelpCheck, HELP_COOLDOWN]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (lastBonusHelpCheck && bonusHelps < 3) {
      interval = setInterval(() => {
        const now = Date.now();
        if (now - lastBonusHelpCheck >= HELP_COOLDOWN) {
          setShowBonusAvailable(true);
          setTimeLeft('');
          
          setTimeout(() => {
            setShowBonusAvailable(false);
          }, 1000);
          
          if (interval) {
            clearInterval(interval);
          }
        } else {
          setTimeLeft(formatTimeRemaining(lastBonusHelpCheck, HELP_COOLDOWN));
        }
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [lastBonusHelpCheck, HELP_COOLDOWN, bonusHelps]);

  // Trigger animation when bonusHelps changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, [bonusHelps]);

  if (beastMode) return null;

  return (
    <div className="space-y-2">
      <button
        onClick={useHelp}
        disabled={helpCount >= 1}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors font-medium",
          helpCount >= 1
            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
            : "bg-purple-100 hover:bg-purple-200 text-purple-700"
        )}
      >
        <Wand2 className="w-4 h-4" />
        <span>Change a number {helpCount === 0 ? "(1 available)" : "(used)"}</span>
      </button>

      {(bonusHelps > 0 || timeLeft) && (
        <div className="relative">
          <button
            onClick={useBonusHelp}
            disabled={bonusHelps === 0}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-300 font-medium",
              bonusHelps === 0
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-yellow-100 hover:bg-yellow-200 text-yellow-700",
              isAnimating && "animate-bonus-pulse"
            )}
          >
            <Gift className={cn(
              "w-4 h-4 transition-transform",
              isAnimating && "animate-bounce"
            )} />
            <span>Bonus Change ({bonusHelps} left)</span>
          </button>
          {timeLeft && bonusHelps < 3 && (
            <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-gray-500">
              Next bonus in: {timeLeft}
            </div>
          )}
          {showBonusAvailable && (
            <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-green-600 font-medium">
              New bonus help available!
            </div>
          )}
        </div>
      )}
    </div>
  );
}