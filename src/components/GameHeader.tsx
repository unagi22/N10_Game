import React, { useState } from 'react';
import { Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { BragsModal } from './BragsModal';

export function GameHeader() {
  const brags = useGameStore(state => state.brags);
  const [showBragsModal, setShowBragsModal] = useState(false);

  return (
    <div className="flex flex-col items-center mb-6 relative w-full">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 sm:top-0 sm:translate-y-0">
        <button
          onClick={() => setShowBragsModal(true)}
          className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-sm hover:bg-yellow-100 transition-colors"
        >
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
          <div className="flex flex-col items-center">
            <span className="text-[10px] sm:text-xs font-medium text-yellow-700">Brags</span>
            <span className="text-lg sm:text-xl font-bold text-yellow-800">{brags}</span>
          </div>
        </button>
      </div>
      
      <div className="text-center max-w-md mx-auto px-8 sm:px-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">N10 Game</h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-snug max-w-[200px] sm:max-w-none mx-auto">
          Place random numbers (1-100) in just 10 spots... in perfect order! Ridiculously hard? Yes. But hey, if you win, brag all you want - you've earned it! 🏆
        </p>
      </div>

      <BragsModal
        isOpen={showBragsModal}
        onClose={() => setShowBragsModal(false)}
        onOverlayClick={() => setShowBragsModal(false)}
        brags={brags}
      />
    </div>
  );
}