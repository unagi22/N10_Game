import React from 'react';
import { Trophy, Gift } from 'lucide-react';
import { cn } from '../utils/cn';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOverlayClick: () => void;
  level: number;
  levelName: string;
  bonusHelps: number;
}

export function LevelUpModal({ 
  isOpen, 
  onClose, 
  onOverlayClick,
  level,
  levelName,
  bonusHelps
}: LevelUpModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onOverlayClick}
    >
      <div 
        className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">
            Level Up!
          </h2>
          <p className="text-gray-600 mb-4">
            Congratulations! You've reached level {level}: <span className="font-semibold text-purple-600">{levelName}</span>
          </p>
          <div className="bg-purple-50 rounded-lg p-4 mb-4 flex items-center justify-center gap-2">
            <Gift className="w-6 h-6 text-purple-600" />
            <p className="text-purple-700 font-medium">
              You've earned {bonusHelps} Bonus Helps!
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full rounded-lg py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white transition-colors"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
}
