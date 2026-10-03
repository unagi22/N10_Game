import React, { useEffect, useState } from 'react';
import { useGameStore, hasValidSlot, isHelpAvailable, classicGamesToday, CLASSIC_DAILY_LIMIT } from './store/gameStore';
import { DailyResultCard } from './components/DailyResultCard';
import { ClassicLockedCard } from './components/ClassicLockedCard';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { BeastModeModal } from './components/BeastModeModal';
import { DailyModal } from './components/DailyModal';
import { ChangeNumberButton } from './components/ChangeNumberButton';
import { GameControls } from './components/GameControls';
import { GameHeader } from './components/GameHeader';
import { dailyNumber, todayKey } from './utils/daily';

export default function App() {
  const {
    slots, currentNumber, gameOver, victory, score, brags,
    beastMode, beastTimer, countdown, dailyMode, daily, stats, lossReason,
    helpCount, lastHelpTimestamp, classicToday,
    placeNumber, generateNumber, resetGame, startBeastMode, updateBeastTimer, endBeastMode,
    endStuck, startDaily,
  } = useGameStore();

  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showBeastModeModal, setShowBeastModeModal] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);

  const todaysDaily = daily && daily.key === todayKey() ? daily : null;
  const dailyDone = !!todaysDaily?.finished;
  const stuck = currentNumber !== null && !gameOver && !victory && !hasValidSlot(slots, currentNumber);
  const classicLeft = Math.max(0, CLASSIC_DAILY_LIMIT - classicGamesToday(classicToday));
  const classicLocked = !dailyMode && !beastMode && countdown === null && score === 0 && !gameOver && !victory && classicLeft === 0;
  const canChange = !beastMode && !dailyMode && isHelpAvailable(helpCount);

  // Game end: show the right modal
  useEffect(() => {
    if (!gameOver && !victory) return;
    const timer = setTimeout(() => {
      if (dailyMode) return; // Daily result shows in the card
      if (victory) setShowVictoryModal(true);
      else setShowGameOverModal(true);
    }, victory ? 1000 : 700);
    return () => clearTimeout(timer);
  }, [gameOver, victory, dailyMode]);

  useEffect(() => {
    if (currentNumber === null && !gameOver && !victory && countdown === null) {
      generateNumber();
    }
  }, [currentNumber, gameOver, victory, countdown, generateNumber]);

  // Dead board: no spot fits the current number and it can't be changed
  useEffect(() => {
    if (stuck && !canChange) endStuck();
  }, [stuck, canChange, endStuck]);

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

    if (beastMode && beastTimer !== null && countdown === null && !gameOver && !victory) {
      interval = window.setInterval(() => {
        if (beastTimer > 1) {
          updateBeastTimer(beastTimer - 1);
        } else {
          updateBeastTimer(0);
          endBeastMode();
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [beastMode, beastTimer, countdown, gameOver, victory, updateBeastTimer, endBeastMode]);

  const closeAllModals = () => {
    setShowVictoryModal(false);
    setShowGameOverModal(false);
    setShowDailyModal(false);
  };

  const handleNewGame = () => {
    closeAllModals();
    resetGame();
  };

  const handleBeastModeStart = () => {
    setShowBeastModeModal(false);
    startBeastMode();
    localStorage.setItem('lastBeastModeIntro', new Date().toDateString());
  };

  const handleBeastModeClick = () => {
    closeAllModals();
    const lastIntro = localStorage.getItem('lastBeastModeIntro');
    const today = new Date().toDateString();

    if (lastIntro !== today) {
      setShowBeastModeModal(true);
    } else {
      startBeastMode();
    }
  };

  const handleDailyClick = () => {
    closeAllModals();
    startDaily();
  };

  const gameState = {
    slots, currentNumber, gameOver, victory, score, brags,
    beastMode, beastTimer, countdown, dailyMode, daily, stats, lossReason,
    helpCount, lastHelpTimestamp, classicToday,
  };

  const finished = gameOver || victory;

  return (
    <div className="min-h-[100dvh] flex justify-center px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <main className="flex w-full max-w-md flex-col gap-4">
        <GameHeader />

        {dailyMode && todaysDaily?.finished ? (
          <DailyResultCard daily={todaysDaily} dailyNumber={dailyNumber()} onShowStats={() => setShowDailyModal(true)} />
        ) : classicLocked ? (
          <ClassicLockedCard />
        ) : (
          <GameStatus state={gameState} stuck={stuck} dailyNumber={dailyNumber()} />
        )}

        <GameBoard gameState={gameState} onSlotSelect={placeNumber} disabled={classicLocked} />

        <div className="min-h-[2.75rem]">
          {classicLocked || (finished && dailyMode) ? null : finished ? (
            <button
              onClick={beastMode ? handleBeastModeClick : handleNewGame}
              className="h-11 w-full rounded-2xl bg-indigo-500 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:bg-indigo-400 active:scale-[0.98]"
            >
              {beastMode ? 'Beast Mode rematch' : classicLeft === 0 ? 'Done for today' : `Play again (${classicLeft} left today)`}
            </button>
          ) : dailyMode ? (
            <p className="py-3 text-center text-xs text-slate-400">
              One attempt per day, no number changes. Everyone gets the same numbers.
            </p>
          ) : !beastMode && countdown === null ? (
            <ChangeNumberButton highlight={stuck} />
          ) : null}
        </div>

        <div className="mt-auto">
          <GameControls
            beastMode={beastMode}
            dailyMode={dailyMode}
            dailyDone={dailyDone}
            classicLeft={classicLeft}
            onDaily={handleDailyClick}
            onBeastMode={handleBeastModeClick}
            onReset={handleNewGame}
          />
        </div>
      </main>

      <VictoryModal
        isOpen={showVictoryModal}
        onClose={handleNewGame}
        onOverlayClick={() => setShowVictoryModal(false)}
        score={score}
        beastMode={beastMode}
      />

      <GameOverModal
        isOpen={showGameOverModal}
        onClose={handleNewGame}
        onOverlayClick={() => setShowGameOverModal(false)}
        onBeastMode={handleBeastModeClick}
        wasBeastMode={beastMode}
        score={score}
        bestScore={stats.bestScore}
        lossReason={lossReason}
        lastNumber={currentNumber}
        classicLeft={classicLeft}
      />

      <BeastModeModal
        isOpen={showBeastModeModal}
        onClose={() => setShowBeastModeModal(false)}
        onOverlayClick={() => setShowBeastModeModal(false)}
        onStart={handleBeastModeStart}
      />

      <DailyModal
        isOpen={showDailyModal}
        onClose={() => setShowDailyModal(false)}
        onPlayClassic={handleNewGame}
        daily={todaysDaily}
        dailyNumber={dailyNumber()}
        stats={stats}
      />
    </div>
  );
}
