export interface GameState {
  slots: (number | null)[];
  currentNumber: number | null;
  nextNumbers: [number | null, number | null];
  gameOver: boolean;
  victory: boolean;
  score: number;
  brags: number;
  helpCount: number;
  lastHelpTimestamp: number | null;
  bonusHelps: number;
  lastBonusHelpCheck: number | null;
  totalScore: number;
  level: number;
  beastMode: boolean;
  beastTimer: number | null;
  countdown: number | null;
}

export type GameAction = 
  | { type: 'PLACE_NUMBER'; position: number }
  | { type: 'GENERATE_NUMBER' }
  | { type: 'RESET_GAME' }
  | { type: 'USE_HELP' }
  | { type: 'START_BEAST_MODE' }
  | { type: 'UPDATE_BEAST_TIMER' }
  | { type: 'END_BEAST_MODE' };