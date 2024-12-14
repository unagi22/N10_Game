import React from 'react';
import { Users } from 'lucide-react';
import { useMultiplayerStore } from '../store/multiplayerStore';
import { useGameStore } from '../store/gameStore';

export function MultiplayerStatus() {
  const { gameId, connected, friendConnected, playerTurn } = useMultiplayerStore();
  const { createGame, disconnect } = useMultiplayerStore();
  const { resetGame } = useGameStore();

  const handleCreateGame = async () => {
    const newGameId = await createGame();
    const gameUrl = `${window.location.origin}?game=${newGameId}`;
    await navigator.clipboard.writeText(gameUrl);
    alert('Game URL copied to clipboard! Share it with your friend.');
    resetGame();
  };

  if (!gameId) {
    return (
      <button
        onClick={handleCreateGame}
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors"
      >
        <Users className="w-4 h-4" />
        Play with Friend
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-blue-100">
      <Users className="w-4 h-4" />
      {connected ? (
        friendConnected ? (
          <span>{playerTurn ? "Your turn" : "Friend's turn"}</span>
        ) : (
          <span>Waiting for friend...</span>
        )
      ) : (
        <span>Connecting...</span>
      )}
    </div>
  );
}