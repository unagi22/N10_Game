import React from 'react';
import { Zap } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOverlayClick: () => void;
  onBeastMode: () => void;
  wasBeastMode: boolean;
}

export function GameOverModal({ isOpen, onClose, onOverlayClick, onBeastMode, wasBeastMode }: GameOverModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onOverlayClick}
    >
      <div 
        className="bg-white rounded-xl p-6 max-w-sm w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Game Over!</h2>
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors"
            >
              New Game
            </button>
            {wasBeastMode ? (
              <button
                onClick={onBeastMode}
                className="w-full bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                New Beast Mode Game
              </button>
            ) : (
              <button
                onClick={onBeastMode}
                className="w-full bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Try Beast Mode
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}