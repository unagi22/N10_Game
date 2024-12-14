import React from 'react';
import { GameState } from '../types/game';
import { Timer, Zap } from 'lucide-react';
import { cn } from '../utils/cn';

interface GameStatusProps {
  state: GameState;
}

export function GameStatus({ state }: GameStatusProps) {
  if (state.gameOver) {
    return (
      <div className="text-center p-3 bg-red-50 rounded-lg h-full flex flex-col justify-center">
        <p className="text-lg font-semibold text-red-600">Game Over!</p>
        <p className="text-sm text-gray-600">Final Score: {state.score}</p>
      </div>
    );
  }

  if (state.victory) {
    return (
      <div className="text-center p-3 bg-green-50 rounded-lg h-full flex flex-col justify-center">
        <p className="text-lg font-semibold text-green-600">Victory!</p>
        <p className="text-sm text-gray-600">Perfect Score: {state.score}</p>
      </div>
    );
  }

  const cardClass = cn(
    "text-center p-3 rounded-lg h-full flex flex-col justify-center relative",
    state.beastMode ? "bg-red-50" : "bg-blue-50"
  );

  const numberClass = cn(
    "text-3xl font-bold",
    state.beastMode ? "text-red-700" : "text-blue-700"
  );

  return (
    <div className={cardClass}>
      {state.countdown !== null ? (
        <>
          <p className="text-sm text-red-600 mb-1">Get Ready!</p>
          <p className="text-3xl font-bold text-red-700">{state.countdown}</p>
        </>
      ) : (
        <>
          {state.beastTimer !== null && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-200 px-4 py-2 rounded-full">
              <Timer className="w-6 h-6 text-red-600" />
              <span className="text-xl font-bold text-red-700">{state.beastTimer}s</span>
            </div>
          )}
          <p className={cn("text-sm mb-1", state.beastMode ? "text-red-600" : "text-blue-600")}>
            Current Number
          </p>
          <p className={numberClass}>
            {state.currentNumber ?? '...'}
          </p>
        </>
      )}
    </div>
  );
}