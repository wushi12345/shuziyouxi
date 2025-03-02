// 游戏模式枚举
export enum GameMode {
  CLASSIC = 'classic',
  SPEED = 'speed',
  HELL = 'hell'
}

// 游戏配置接口
export interface GameConfig {
  mode: GameMode;
  minNumber: number;
  maxNumber: number;
}

// 游戏状态接口
export interface GameState {
  config: GameConfig;
  currentGuess: number | null;
  guessHistory: Array<{
    number: number;
    result: 'smaller' | 'bigger' | 'correct';
  }>;
  isGameOver: boolean;
  startTime: number;
  endTime: number | null;
  targetNumber: number; // 添加目标数字字段
}

// AI策略接口
export interface AIStrategy {
  nextGuess: (min: number, max: number, history: GameState['guessHistory']) => number;
}