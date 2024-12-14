export interface MultiplayerState {
  gameId: string | null;
  isHost: boolean;
  connected: boolean;
  playerTurn: boolean;
  friendConnected: boolean;
  friendError: boolean;
}

export interface MultiplayerAction {
  type: 'JOIN_GAME' | 'CREATE_GAME' | 'FRIEND_CONNECTED' | 'FRIEND_ERROR' | 'SET_TURN' | 'DISCONNECT';
  gameId?: string;
}