import React from 'react';
import { Medal } from 'lucide-react';
import { cn } from '../utils/cn';

interface LevelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOverlayClick: () => void;
  totalScore: number;
  level: number;
}

const LEVELS = [
  { name: "Beginner", threshold: 0 },
  { name: "Number Ninja", threshold: 100 },
  { name: "Digit Master", threshold: 300 },
  { name: "Math Wizard", threshold: 750 },
  { name: "Number God", threshold: 1000 },
  { name: "Legendary Calculator", threshold: 5000 },
  { name: "Infinity Brain", threshold: 10000 }
];

export function LevelInfoModal({ 
  isOpen, 
  onClose, 
  onOverlayClick,
  totalScore,
  level
}: LevelInfoModalProps) {
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
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
            <Medal className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Progress
            </h2>
            <p className="text-gray-600">
              Total Score: <span className="font-semibold text-yellow-600">{totalScore}</span>
            </p>
            <p className="text-gray-600">
              Current Level: <span className="font-semibold text-yellow-600">{LEVELS[level].name}</span>
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Level Requirements</h3>
            <div className="space-y-2">
              {LEVELS.map((lvl, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex justify-between items-center p-2 rounded-lg",
                    index === level ? "bg-yellow-100" : "bg-gray-50"
                  )}
                >
                  <span className={cn(
                    "font-medium",
                    index === level ? "text-yellow-700" : "text-gray-600"
                  )}>
                    {lvl.name}
                  </span>
                  <span className={cn(
                    "text-sm",
                    index === level ? "text-yellow-600" : "text-gray-500"
                  )}>
                    {lvl.threshold.toLocaleString()} points
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full rounded-lg py-2 px-4 bg-yellow-600 hover:bg-yellow-700 text-white transition-colors mt-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
