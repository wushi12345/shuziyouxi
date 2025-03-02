import { AIStrategy, GameMode } from './types';

// 经典模式：标准二分法算法
export class ClassicStrategy implements AIStrategy {
  nextGuess(min: number, max: number, history: Array<{ number: number; result: 'smaller' | 'bigger' | 'correct' }>): number {
    // 基本二分法
    let guess = Math.floor((min + max) / 2);
    
    // 根据历史记录更新范围
    if (history.length > 0) {
      let validMin = min;
      let validMax = max;
      
      for (const record of history) {
        if (record.result === 'bigger') {
          validMin = Math.max(validMin, record.number + 1);
        } else if (record.result === 'smaller') {
          validMax = Math.min(validMax, record.number - 1);
        }
      }
      
      // 在有效范围内选择一个未猜测过的数字
      if (validMin <= validMax) {
        guess = Math.floor((validMin + validMax) / 2);
        let attempts = 0;
        while (history.some(h => h.number === guess) && attempts < 10) {
          guess = Math.floor(Math.random() * (validMax - validMin + 1)) + validMin;
          attempts++;
        }
      }
    }
    
    return guess;
  }
}

// 极速模式：预判跳跃算法
export class SpeedStrategy implements AIStrategy {
  nextGuess(min: number, max: number, history: Array<{ number: number; result: 'smaller' | 'bigger' | 'correct' }>): number {
    if (history.length === 0) {
      return Math.floor((min + max) / 2);
    }

    // 分析历史猜测模式，调整跳跃步长
    const lastGuess = history[history.length - 1];
    // 根据历史记录计算有效范围
    let validMin = min;
    let validMax = max;
    
    for (const record of history) {
      if (record.result === 'bigger') {
        validMin = Math.max(validMin, record.number + 1);
      } else if (record.result === 'smaller') {
        validMax = Math.min(validMax, record.number - 1);
      }
    }
    
    const range = validMax - validMin;
    const step = Math.max(1, Math.floor(range * 0.2)); // 增加步长以加快收敛
    
    let guess: number;
    if (lastGuess.result === 'bigger') {
      guess = Math.min(validMax, lastGuess.number + step);
    } else {
      guess = Math.max(validMin, lastGuess.number - step);
    }

    // 避免重复猜测
    let attempts = 0;
    while (history.some(h => h.number === guess) && attempts < 100) {
      guess = lastGuess.result === 'bigger' ?
        Math.min(validMax, guess + 1) :
        Math.max(validMin, guess - 1);
      attempts++;
      
      // 如果尝试次数过多，使用二分法
      if (attempts >= 50) {
        guess = Math.floor((validMin + validMax) / 2);
        break;
      }
    }

    return guess;
  }
}

// 地狱模式：智能随机策略
export class HellStrategy implements AIStrategy {
  nextGuess(min: number, max: number, history: Array<{ number: number; result: 'smaller' | 'bigger' | 'correct' }>): number {
    // 首次猜测使用二分法
    if (history.length === 0) {
      return Math.floor((min + max) / 2);
    }

    // 使用上一次猜测的结果缩小范围
    const lastGuess = history[history.length - 1];
    let validMin = min;
    let validMax = max;

    // 根据历史记录更新有效范围
    for (const record of history) {
      if (record.result === 'bigger') {
        validMin = Math.max(validMin, record.number + 1);
      } else if (record.result === 'smaller') {
        validMax = Math.min(validMax, record.number - 1);
      }
    }

    // 检查范围有效性
    if (validMin > validMax) {
      // 如果范围无效，回退到基本二分法
      return Math.floor((min + max) / 2);
    }

    // 使用自适应随机策略
    let guess: number;
    const useRandomChance = Math.random() < 0.7; // 70%概率使用随机策略
    
    if (useRandomChance) {
      // 在有效范围内随机选择
      let attempts = 0;
      do {
        const randomFactor = Math.random() * 0.6 + 0.7; // 0.7-1.3的随机因子
        const baseGuess = Math.floor((validMin + validMax) / 2);
        guess = Math.floor(baseGuess * randomFactor);
        guess = Math.max(validMin, Math.min(validMax, guess));
        attempts++;
        
        if (attempts >= 10) {
          guess = Math.floor((validMin + validMax) / 2);
          break;
        }
      } while (history.some(h => h.number === guess));
    } else {
      // 使用二分法
      guess = Math.floor((validMin + validMax) / 2);
    }

    return guess;
  }
}

// 策略工厂
export class StrategyFactory {
  static createStrategy(mode: GameMode): AIStrategy {
    switch (mode) {
      case GameMode.CLASSIC:
        return new ClassicStrategy();
      case GameMode.SPEED:
        return new SpeedStrategy();
      case GameMode.HELL:
        return new HellStrategy();
      default:
        return new ClassicStrategy();
    }
  }
}