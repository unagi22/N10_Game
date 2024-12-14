import React from 'react';
import { Zap } from 'lucide-react';

interface BeastModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOverlayClick: () => void;
  onStart: () => void;
}

export function BeastModeModal({ isOpen, onClose, onOverlayClick, onStart }: BeastModeModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onOverlayClick}
    >
      <div 
        className="bg-red-50 rounded-xl p-6 max-w-sm w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-2">Beast Mode</h2>
          <p className="text-red-600 mb-4">
            Not for everyone! You have only 12 seconds to complete the entire board.
            Success rewards you with 3 brags instead of 1. Help is not available in Beast Mode.
            Are you ready for the challenge?
          </p>
          <div className="space-y-3">
            <button
              onClick={onStart}
              className="w-full bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 transition-colors"
            >
              Start Beast Mode
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-800 rounded-lg py-2 px-4 hover:bg-gray-300 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}