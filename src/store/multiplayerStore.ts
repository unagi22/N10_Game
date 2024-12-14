import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { MultiplayerState } from '../types/multiplayer';

const SOCKET_URL = 'wss://your-websocket-server.com'; // Replace with actual WebSocket server URL

interface MultiplayerStore extends MultiplayerState {
  socket: Socket | null;
  createGame: () => Promise<string>;
  joinGame: (gameId: string) => void;
  disconnect: () => void;
  makeMove: (position: number, number: number) => void;
}

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
  gameId: null,
  isHost: false,
  connected: false,
  playerTurn: false,
  friendConnected: false,
  friendError: false,
  socket: null,

  createGame: async () => {
    const socket = io(SOCKET_URL);
    const gameId = Math.random().toString(36).substring(2, 8);

    socket.on('connect', () => {
      set({ connected: true, isHost: true, playerTurn: true });
    });

    socket.on('friendJoined', () => {
      set({ friendConnected: true });
    });

    socket.on('friendMove', (data: { position: number; number: number }) => {
      // Handle friend's move
      set({ playerTurn: true });
    });

    socket.on('friendError', () => {
      set({ friendError: true });
    });

    set({ socket, gameId });
    return gameId;
  },

  joinGame: (gameId: string) => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      socket.emit('joinGame', { gameId });
      set({ connected: true, gameId, isHost: false, playerTurn: false });
    });

    socket.on('gameMove', (data: { position: number; number: number }) => {
      // Handle game move
      set({ playerTurn: true });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({
      socket: null,
      gameId: null,
      connected: false,
      isHost: false,
      playerTurn: false,
      friendConnected: false,
      friendError: false,
    });
  },

  makeMove: (position: number, number: number) => {
    const { socket, gameId } = get();
    if (socket && gameId) {
      socket.emit('makeMove', { gameId, position, number });
      set({ playerTurn: false });
    }
  },
}));