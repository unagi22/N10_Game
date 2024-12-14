import React from 'react';
import { RotateCcw, Zap } from 'lucide-react';

interface GameControlsProps {
  score: number;
  gameOver: boolean;
  beastMode: boolean;
  onBeastMode: () => void;
  onReset: () => void;
}

export function GameControls({ 
  score, 
  gameOver, 
  beastMode, 
  onBeastMode, 
  onReset 
}: GameControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
      <div className="text-lg font-semibold text-gray-700">
        Score: {score}
      </div>
      <div className="flex items-center gap-2">
        {!gameOver && !beastMode && (
          <button
            onClick={onBeastMode}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-red-100 hover:bg-red-200 transition-colors whitespace-nowrap"
          >
            <Zap className="w-4 h-4" />
            Beast Mode
          </button>
        )}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}