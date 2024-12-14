import React from 'react';
import { useMultiplayerStore } from '../store/multiplayerStore';
import { useGameStore } from '../store/gameStore';

interface FriendErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FriendErrorModal({ isOpen, onClose }: FriendErrorModalProps) {
  const { disconnect } = useMultiplayerStore();
  const { resetGame } = useGameStore();

  if (!isOpen) return null;

  const handlePlayAlone = () => {
    disconnect();
    resetGame();
    onClose();
  };

  const handlePlayTogether = async () => {
    disconnect();
    resetGame();
    onClose();
    // This will trigger the creation of a new game and copy the URL
    const { createGame } = useMultiplayerStore.getState();
    const newGameId = await createGame();
    const gameUrl = `${window.location.origin}?game=${newGameId}`;
    await navigator.clipboard.writeText(gameUrl);
    alert('New game URL copied to clipboard! Share it with your friend.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your friend made a mistake!</h2>
        <div className="space-y-3">
          <button
            onClick={handlePlayTogether}
            className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors"
          >
            Play another game together
          </button>
          <button
            onClick={handlePlayAlone}
            className="w-full bg-gray-200 text-gray-800 rounded-lg py-2 px-4 hover:bg-gray-300 transition-colors"
          >
            Play another game alone
          </button>
        </div>
      </div>
    </div>
  );
}