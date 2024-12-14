import React, { useState, useEffect } from 'react';
import { Wand2, Timer } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { cn } from '../utils/cn';

function formatTimeRemaining(timestamp: number | null, cooldown: number): string {
  if (!timestamp) return '';
  const now = Date.now();
  const diff = Math.max(0, (timestamp + cooldown) - now);
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `available in ${hours}h ${minutes}m ${seconds}s`;
}

export function ChangeNumberButton() {
  const { helpCount, lastHelpTimestamp, useHelp, beastMode, HELP_COOLDOWN } = useGameStore();
  const [timeLeft, setTimeLeft] = useState('');
  const [showAvailableMessage, setShowAvailableMessage] = useState(false);
  
  // Update timeLeft whenever lastHelpTimestamp changes
  useEffect(() => {
    if (lastHelpTimestamp) {
      setTimeLeft(formatTimeRemaining(lastHelpTimestamp, HELP_COOLDOWN));
    } else {
      setTimeLeft('');
    }
  }, [lastHelpTimestamp, HELP_COOLDOWN]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (lastHelpTimestamp) {
      interval = setInterval(() => {
        const now = Date.now();
        if (now - lastHelpTimestamp >= HELP_COOLDOWN) {
          setShowAvailableMessage(true);
          setTimeLeft('');
          
          // After 1 second, hide the message
          setTimeout(() => {
            setShowAvailableMessage(false);
            useHelp(); // This will reset the helps
          }, 1000);
          
          if (interval) {
            clearInterval(interval);
          }
        } else {
          setTimeLeft(formatTimeRemaining(lastHelpTimestamp, HELP_COOLDOWN));
        }
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [lastHelpTimestamp, HELP_COOLDOWN, useHelp]);

  if (beastMode) return null;

  const helpsLeft = 2 - helpCount;
  const isDisabled = showAvailableMessage || (lastHelpTimestamp !== null && helpsLeft <= 0);

  return (
    <button
      onClick={useHelp}
      disabled={isDisabled}
      className={cn(
        "w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors font-medium",
        showAvailableMessage
          ? "bg-green-100 text-green-700 cursor-not-allowed"
          : isDisabled 
          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
          : "bg-purple-100 hover:bg-purple-200 text-purple-700"
      )}
    >
      {showAvailableMessage ? (
        <>
          <Wand2 className="w-4 h-4" />
          <span>Help is now available!</span>
        </>
      ) : isDisabled && timeLeft ? (
        <>
          <Timer className="w-4 h-4" />
          <span>Change a number ({timeLeft})</span>
        </>
      ) : (
        <>
          <Wand2 className="w-4 h-4" />
          <span>Change a number ({helpsLeft} left)</span>
        </>
      )}
    </button>
  );
}