import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

export function useBeastMode() {
  const { 
    beastMode, 
    beastTimer, 
    countdown, 
    gameOver,
    generateNumber,
    updateBeastTimer,
    endBeastMode 
  } = useGameStore();

  useEffect(() => {
    let interval: number;
    
    if (beastMode && countdown !== null) {
      interval = window.setInterval(() => {
        if (countdown > 1) {
          useGameStore.setState({ countdown: countdown - 1 });
        } else {
          useGameStore.setState({ countdown: null, beastTimer: 12 });
          generateNumber();
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [beastMode, countdown, generateNumber]);

  useEffect(() => {
    let interval: number;
    
    if (beastMode && beastTimer !== null && countdown === null && !gameOver) {
      interval = window.setInterval(() => {
        if (beastTimer > 0) {
          updateBeastTimer(beastTimer - 1);
        } else {
          endBeastMode();
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [beastMode, beastTimer, countdown, gameOver, updateBeastTimer, endBeastMode]);
}