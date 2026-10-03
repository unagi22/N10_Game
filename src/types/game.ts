export interface GameState {
  slots: (number | null)[];
  currentNumber: number | null;
  gameOver: boolean;
  victory: boolean;
  score: number;
  brags: number;
  helpCount: number;
  lastHelpTimestamp: number | null;
  beastMode: boolean;
  beastTimer: number | null;
  countdown: number | null;
  dailyMode: boolean;
  lossReason: 'wrong' | 'stuck' | 'timeout' | null;
  daily: DailyProgress | null;
  stats: GameStats;
  classicToday: { key: string; count: number };
}

export interface DailyProgress {
  key: string;
  slots: (number | null)[];
  finished: boolean;
  won: boolean;
  placed: number;
}

export interface GameStats {
  classicPlayed: number;
  classicWins: number;
  bestScore: number;
  dailyPlayed: number;
  dailyWins: number;
  dailyStreak: number;
  dailyMaxStreak: number;
  lastDailyKey: string | null;
}

export type GameAction = 
  | { type: 'PLACE_NUMBER'; position: number }
  | { type: 'GENERATE_NUMBER' }
  | { type: 'RESET_GAME' }
  | { type: 'USE_HELP' }
  | { type: 'START_BEAST_MODE' }
  | { type: 'UPDATE_BEAST_TIMER' }
  | { type: 'END_BEAST_MODE' };