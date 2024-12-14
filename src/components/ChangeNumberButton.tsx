import React, { useState, useEffect } from 'react';
import { Wand2, Timer } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { cn } from '../utils/cn';

function formatTimeRemaining(timestamp: number | null): string {
  if (!timestamp) return '';
  const now = Date.now();
  const diff = Math.max(0, (timestamp + 2 * 60 * 60 * 1000) - now);
  const hours = Math.floor(diff / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `available in ${hours}h ${minutes}m ${seconds}s`;
}

export function ChangeNumberButton() {
  const { helpCount, lastHelpTimestamp, useHelp, beastMode } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(formatTimeRemaining(lastHelpTimestamp));
  const [showAvailableMessage, setShowAvailableMessage] = useState(false);
  
  useEffect(() => {
    if (helpCount >= 2) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (lastHelpTimestamp && now - lastHelpTimestamp >= 2 * 60 * 60 * 1000) {
          setShowAvailableMessage(true);
          setTimeLeft('');
          clearInterval(interval);
        } else {
          setTimeLeft(formatTimeRemaining(lastHelpTimestamp));
        }
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setShowAvailableMessage(false);
    }
  }, [helpCount, lastHelpTimestamp]);

  useEffect(() => {
    if (showAvailableMessage) {
      const timeout = setTimeout(() => {
        setShowAvailableMessage(false);
      }, 3000); // Hide the message after 3 seconds
      return () => clearTimeout(timeout);
    }
  }, [showAvailableMessage]);

  if (beastMode) return null;

  const helpsLeft = 2 - helpCount;
  const isDisabled = helpsLeft <= 0 && !showAvailableMessage;

  return (
    <button
      onClick={() => {
        useHelp();
        setShowAvailableMessage(false);
      }}
      disabled={isDisabled}
      className={cn(
        "w-full flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors font-medium",
        isDisabled 
          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
          : showAvailableMessage
          ? "bg-green-100 hover:bg-green-200 text-green-700"
          : "bg-purple-100 hover:bg-purple-200 text-purple-700"
      )}
    >
      {showAvailableMessage ? (
        <>
          <Wand2 className="w-4 h-4" />
          <span>Help is now available! (2 left)</span>
        </>
      ) : isDisabled ? (
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