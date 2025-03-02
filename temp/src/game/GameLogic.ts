// 游戏模式枚举
export enum GameMode {
  CLASSIC = 'classic',
  SPEED = 'speed',
  HELL = 'hell'
}

// 游戏难度配置
interface GameConfig {
  minNumber: number;
  maxNumber: number;
  mode: GameMode;
}

// 游戏历史记录
interface GameHistory {
  guess: number;
  feedback: 'bigger' | 'smaller' | 'correct';
  timestamp: number;
}

// 游戏评级
export type GameRating = 'SSS' | 'SS' | 'S';

// 游戏结果
export interface GameResult {
  targetNumber: number;
  guessCount: number;
  timeTaken: number;
  history: GameHistory[];
  rating: GameRating;
}

export class GameLogic {
  private config: GameConfig;
  private targetNumber: number;
  private history: GameHistory[];
  private startTime: number;
  private isGameOver: boolean;

  constructor(mode: GameMode = GameMode.CLASSIC, minNumber: number = 1, maxNumber: number = 9999) {
    this.config = {
      mode,
      minNumber,
      maxNumber
    };
    this.history = [];
    this.startTime = Date.now();
    this.isGameOver = false;
    this.targetNumber = this.generateRandomNumber();
  }

  // 生成随机目标数字
  private generateRandomNumber(): number {
    return Math.floor(Math.random() * (this.config.maxNumber - this.config.minNumber + 1)) + this.config.minNumber;
  }

  // AI猜测逻辑
  public getAIGuess(): number {
    switch (this.config.mode) {
      case GameMode.CLASSIC:
        return this.classicModeGuess();
      case GameMode.SPEED:
        return this.speedModeGuess();
      case GameMode.HELL:
        return this.hellModeGuess();
      default:
        return this.classicModeGuess();
    }
  }

  // 经典模式：二分查找
  private classicModeGuess(): number {
    const history = this.history;
    if (history.length === 0) {
      return Math.floor((this.config.maxNumber + this.config.minNumber) / 2);
    }

    let min = this.config.minNumber;
    let max = this.config.maxNumber;

    for (const record of history) {
      if (record.feedback === 'bigger') {
        min = record.guess + 1;
      } else if (record.feedback === 'smaller') {
        max = record.guess - 1;
      }
    }

    return Math.floor((max + min) / 2);
  }

  // 极速模式：预判跳跃
  private speedModeGuess(): number {
    const guess = this.classicModeGuess();
    const jumpFactor = Math.random() * 0.4 + 0.8; // 0.8-1.2的随机因子
    return Math.floor(guess * jumpFactor);
  }

  // 地狱模式：随机延迟
  private hellModeGuess(): number {
    const baseGuess = this.classicModeGuess();
    const randomOffset = Math.floor(Math.random() * 100) - 50; // -50到50的随机偏移
    return baseGuess + randomOffset;
  }

  // 处理猜测结果
  public processGuess(guess: number): 'bigger' | 'smaller' | 'correct' {
    let feedback: 'bigger' | 'smaller' | 'correct';

    if (guess < this.targetNumber) {
      feedback = 'bigger';
    } else if (guess > this.targetNumber) {
      feedback = 'smaller';
    } else {
      feedback = 'correct';
      this.isGameOver = true;
    }

    this.history.push({
      guess,
      feedback,
      timestamp: Date.now()
    });

    return feedback;
  }

  // 获取游戏结果
  public getGameResult(): GameResult | null {
    if (!this.isGameOver) return null;

    const timeTaken = Date.now() - this.startTime;
    const rating = this.calculateRating(timeTaken);

    return {
      targetNumber: this.targetNumber,
      guessCount: this.history.length,
      timeTaken,
      history: this.history,
      rating
    };
  }

  // 计算游戏评级
  private calculateRating(timeTaken: number): GameRating {
    const guessCount = this.history.length;
    const theoreticalMinGuesses = Math.ceil(Math.log2(this.config.maxNumber - this.config.minNumber + 1));

    if (timeTaken <= 3000 && guessCount <= theoreticalMinGuesses) {
      return 'SSS';
    } else if (timeTaken <= 5000 && guessCount <= theoreticalMinGuesses + 2) {
      return 'SS';
    } else {
      return 'S';
    }
  }

  // 获取游戏历史
  public getHistory(): GameHistory[] {
    return this.history;
  }
}