import React, { useState, useEffect } from 'react';
import { GameState, GameConfig, GameMode } from './types';
import { StrategyFactory } from './strategies';
import { HistoryPanel } from './HistoryPanel';
import './HistoryPanel.css';

interface GameComponentProps {
  onGameOver: (state: GameState) => void;
  selectedMode: GameMode;
}

export const GameComponent: React.FC<GameComponentProps> = ({ onGameOver, selectedMode }) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [numberRange, setNumberRange] = useState({ min: 1, max: 9999 });
  
  // 初始化游戏
  const initializeGame = () => {
    if (!numberRange.min || !numberRange.max) {
      alert('请输入有效的数字范围');
      return;
    }

    if (numberRange.min >= numberRange.max) {
      alert('最小值必须小于最大值');
      return;
    }
    
    const config: GameConfig = {
      mode: selectedMode,
      minNumber: numberRange.min,
      maxNumber: numberRange.max
    };

    // 生成目标数字
    const newTargetNumber = Math.floor(Math.random() * (config.maxNumber - config.minNumber + 1)) + config.minNumber;
    setTargetNumber(newTargetNumber);

    const newGameState: GameState = {
      config,
      currentGuess: null,
      guessHistory: [],
      isGameOver: false,
      startTime: Date.now(),
      endTime: null,
      targetNumber: newTargetNumber // 将目标数字添加到游戏状态中
    };

    setGameState(newGameState);
  };

  // 处理AI的猜测
  const handleAIGuess = () => {
    if (!gameState || !targetNumber) return;

    const strategy = StrategyFactory.createStrategy(gameState.config.mode);
    const biggerGuesses = gameState.guessHistory.filter(g => g.result === 'bigger').map(g => g.number);
    const smallerGuesses = gameState.guessHistory.filter(g => g.result === 'smaller').map(g => g.number);
    
    const currentMin = biggerGuesses.length > 0 ? Math.max(...biggerGuesses) : gameState.config.minNumber;
    const currentMax = smallerGuesses.length > 0 ? Math.min(...smallerGuesses) : gameState.config.maxNumber;

    const guess = strategy.nextGuess(currentMin, currentMax, gameState.guessHistory);
    setGameState(prev => prev ? { ...prev, currentGuess: guess } : null);
  };

  // 处理玩家反馈
  const handleFeedback = (result: 'smaller' | 'bigger' | 'correct') => {
    if (!gameState || !gameState.currentGuess || targetNumber === null) return;
  
    // 使用玩家的反馈
    const newHistory = [...gameState.guessHistory, { number: gameState.currentGuess, result }];
    const isGameOver = result === 'correct';
  
    const updatedGameState = {
      ...gameState,
      guessHistory: newHistory,
      isGameOver,
      endTime: isGameOver ? Date.now() : null
    };
  
    setGameState(updatedGameState);
  
    if (isGameOver) {
      onGameOver(updatedGameState);
    } else if (!isGameOver) {
      // 只有在游戏没有结束时，才继续进行AI猜测
      handleAIGuess();
    }
  };

  // 自动进行下一次猜测
  useEffect(() => {
    if (gameState && !gameState.isGameOver && gameState.guessHistory.length > 0) {
      const timer = setTimeout(handleAIGuess, selectedMode === GameMode.HELL ? 1000 : 0);
      return () => clearTimeout(timer);
    }
  }, [gameState?.guessHistory]);

  // 初始猜测
  useEffect(() => {
    if (gameState && !gameState.currentGuess && !gameState.isGameOver) {
      handleAIGuess();
    }
  }, [gameState]);

  if (!gameState) {
    return (
      <div className="game-setup">
        <h3>设置游戏范围</h3>
        <div className="number-range-inputs">
          <input
            type="number"
            min="1"
            max="9999"
            value={numberRange.min}
            onChange={(e) => setNumberRange(prev => ({ ...prev, min: parseInt(e.target.value) || 1 }))}
            placeholder="最小值"
          />
          <span>至</span>
          <input
            type="number"
            min="1"
            max="9999"
            value={numberRange.max}
            onChange={(e) => setNumberRange(prev => ({ ...prev, max: parseInt(e.target.value) || 9999 }))}
            placeholder="最大值"
          />
        </div>
        <button className="cyber-button" style={{ marginTop: '2rem' }} onClick={initializeGame}>开始游戏</button>
      </div>
    );
  }

  return (
    <div className="game-interface">
      <div className="game-status">
        <h3>当前猜测: {gameState.currentGuess}</h3>
        <p>已猜测次数: {gameState.guessHistory.length}</p>
      </div>

      <HistoryPanel guessHistory={gameState.guessHistory} />

      {!gameState.isGameOver && (
        <div className="feedback-buttons">
          <button className="cyber-button" onClick={() => handleFeedback('smaller')}>更小</button>
          <button className="cyber-button" onClick={() => handleFeedback('correct')}>正确</button>
          <button className="cyber-button" onClick={() => handleFeedback('bigger')}>更大</button>
        </div>
      )}
    </div>
  );
};