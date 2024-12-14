import React from 'react';
import { Trophy } from 'lucide-react';

interface BragsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOverlayClick: () => void;
  brags: number;
}

export function BragsModal({ isOpen, onClose, onOverlayClick, brags }: BragsModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onOverlayClick}
    >
      <div 
        className="bg-yellow-50 rounded-xl p-6 max-w-sm w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-14 h-14 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-yellow-900 mb-4">Your Brags</h2>
          <p className="text-yellow-700 text-lg mb-6">
            {brags === 0 
              ? "Keep playing, you've got this!" 
              : `Be proud of yourself for having ${brags} ${brags === 1 ? 'Brag' : 'Brags'} in such a hard game!`}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-yellow-600 text-white rounded-lg py-2 px-4 hover:bg-yellow-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}