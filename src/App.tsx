import React, { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { BeastModeModal } from './components/BeastModeModal';
import { ChangeNumberButton } from './components/ChangeNumberButton';
import { GameControls } from './components/GameControls';
import { cn } from './utils/cn';
import { GameHeader } from './components/GameHeader';
import { LevelUpModal } from './components/LevelUpModal';

export default function App() {
  const { 
    slots, currentNumber, nextNumbers, gameOver, victory, score, brags, 
    beastMode, beastTimer, countdown, totalScore, level,
    placeNumber, generateNumber, resetGame, startBeastMode, updateBeastTimer, endBeastMode 
  } = useGameStore();

  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showBeastModeModal, setShowBeastModeModal] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; name: string; reward: number } | null>(null);

  useEffect(() => {
    if (victory) {
      setTimeout(() => {
        setShowVictoryModal(true);
      }, 1000);
    }
  }, [victory]);

  useEffect(() => {
    if (gameOver && !victory && !showGameOverModal) {
      setShowGameOverModal(true);
    }
  }, [gameOver, victory]);

  useEffect(() => {
    if (currentNumber === null && !gameOver && !victory && countdown === null) {
      generateNumber();
    }
  }, [currentNumber, gameOver, victory, countdown, generateNumber]);

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
  }, [beastMode, countdown]);

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

  const handlePlayAgain = () => {
    setShowVictoryModal(false);
    resetGame();
  };

  const handleBeastModeStart = () => {
    setShowBeastModeModal(false);
    startBeastMode();
    localStorage.setItem('lastBeastModeIntro', new Date().toDateString());
  };

  const handleBeastModeClick = () => {
    const lastIntro = localStorage.getItem('lastBeastModeIntro');
    const today = new Date().toDateString();
    
    if (lastIntro !== today) {
      setShowBeastModeModal(true);
    } else {
      startBeastMode();
    }
  };

  const handleLevelUp = (level: number, name: string, reward: number) => {
    setLevelUpInfo({ level, name, reward });
    setShowLevelUpModal(true);
  };

  const gameState = { 
    slots, currentNumber, nextNumbers, gameOver, victory, score, brags,
    beastMode, beastTimer, countdown, totalScore, level
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 flex flex-col items-center px-4">
      <div className="w-full max-w-4xl space-y-4">
        <GameHeader />

        <div className={cn(
          "rounded-xl shadow-lg p-4",
          beastMode ? "bg-red-100" : "bg-white"
        )}>
          <GameControls 
            score={score}
            totalScore={totalScore}
            level={level}
            gameOver={gameOver}
            beastMode={beastMode}
            onBeastMode={handleBeastModeClick}
            onReset={resetGame}
          />

          <div className="flex flex-col md:flex-row md:gap-4">
            <div className="mb-4 md:mb-0 md:w-1/3 space-y-2">
              <GameStatus state={gameState} />
              {!beastMode && !victory && !gameOver && (
                <ChangeNumberButton />
              )}
            </div>
            
            <div className="md:w-2/3">
              <GameBoard 
                gameState={gameState} 
                onSlotSelect={placeNumber}
              />
            </div>
          </div>
        </div>
      </div>

      <VictoryModal
        isOpen={showVictoryModal}
        onClose={handlePlayAgain}
        onOverlayClick={() => setShowVictoryModal(false)}
        score={score}
        beastMode={beastMode}
      />

      <GameOverModal
        isOpen={showGameOverModal}
        onClose={() => {
          setShowGameOverModal(false);
          resetGame();
        }}
        onOverlayClick={() => setShowGameOverModal(false)}
        onBeastMode={() => {
          setShowGameOverModal(false);
          handleBeastModeClick();
        }}
        wasBeastMode={beastMode}
      />

      <BeastModeModal
        isOpen={showBeastModeModal}
        onClose={() => setShowBeastModeModal(false)}
        onOverlayClick={() => setShowBeastModeModal(false)}
        onStart={handleBeastModeStart}
      />

      {levelUpInfo && (
        <LevelUpModal
          isOpen={showLevelUpModal}
          onClose={() => setShowLevelUpModal(false)}
          onOverlayClick={() => setShowLevelUpModal(false)}
          level={levelUpInfo.level}
          levelName={levelUpInfo.name}
          bonusHelps={levelUpInfo.reward}
        />
      )}
    </div>
  );
}