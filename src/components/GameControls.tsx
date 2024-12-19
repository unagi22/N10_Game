import React, { useState } from 'react';
import { RotateCcw, Zap, Hash, Medal } from 'lucide-react';
import { cn } from '../utils/cn';
import { LevelInfoModal } from './LevelInfoModal';

interface GameControlsProps {
  score: number;
  totalScore: number;
  level: number;
  gameOver: boolean;
  beastMode: boolean;
  onBeastMode: () => void;
  onReset: () => void;
}

const LEVEL_NAMES = [
  "Beginner",
  "Number Ninja",
  "Digit Master",
  "Math Wizard",
  "Number God",
  "Legendary Calculator",
  "Infinity Brain"
];

export function GameControls({ 
  score, 
  totalScore,
  level,
  gameOver, 
  beastMode, 
  onBeastMode, 
  onReset 
}: GameControlsProps) {
  const [showLevelInfo, setShowLevelInfo] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1.5 bg-blue-100 px-3 py-1 rounded-lg">
            <Hash className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Score: {score}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-100 px-3 py-1 rounded-lg">
            <Hash className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Total: {totalScore}</span>
          </div>
          <button
            onClick={() => setShowLevelInfo(true)}
            className="flex items-center gap-1.5 bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-lg transition-colors"
          >
            <Medal className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-700">{LEVEL_NAMES[level]}</span>
          </button>
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

      <LevelInfoModal
        isOpen={showLevelInfo}
        onClose={() => setShowLevelInfo(false)}
        onOverlayClick={() => setShowLevelInfo(false)}
        totalScore={totalScore}
        level={level}
      />
    </>
  );
}