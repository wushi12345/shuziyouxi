import { useState } from 'react'
import './App.css'
import { GameComponent } from './game/GameComponent'
import { GameMode } from './game/types'

// 定义游戏阶段枚举
enum GameStage {
  START = 'start',
  GAME = 'game',
  RESULT = 'result'
}

function App() {
  const [gameStage, setGameStage] = useState<GameStage>(GameStage.START)
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.CLASSIC)

  // 处理游戏结束
  const handleGameOver = (gameState: any) => {
    setGameStage(GameStage.RESULT)
  }

  // 渲染启动界面
  const renderStartScreen = () => (
    <div className="glass-panel start-screen">
      <h1>AI数字游戏</h1>
      <div className="mode-selection">
        <button 
          className="cyber-button" 
          onClick={() => {
            setSelectedMode(GameMode.CLASSIC)
            setGameStage(GameStage.GAME)
          }}
        >
          经典模式
        </button>
        <button 
          className="cyber-button" 
          onClick={() => {
            setSelectedMode(GameMode.SPEED)
            setGameStage(GameStage.GAME)
          }}
        >
          极速模式
        </button>
        <button 
          className="cyber-button" 
          onClick={() => {
            setSelectedMode(GameMode.HELL)
            setGameStage(GameStage.GAME)
          }}
        >
          地狱模式
        </button>
      </div>
    </div>
  )

  // 渲染游戏界面
  const renderGameScreen = () => (
    <div className="glass-panel game-screen">
      <div className="game-header">
        <h2>游戏进行中</h2>
      </div>
      <div className="game-content">
        <GameComponent 
          selectedMode={selectedMode} 
          onGameOver={handleGameOver}
        />
      </div>
      <div className="game-controls">
        <button className="cyber-button" onClick={() => setGameStage(GameStage.START)}>
          结束游戏
        </button>
      </div>
    </div>
  )

  // 渲染结算界面
  const renderResultScreen = () => (
    <div className="glass-panel result-screen">
      <h2>游戏结果</h2>
      <div className="result-content">
        <button className="cyber-button" onClick={() => setGameStage(GameStage.START)}>
          返回主菜单
        </button>
      </div>
    </div>
  )

  return (
    <div className="app-container">
      {gameStage === GameStage.START && renderStartScreen()}
      {gameStage === GameStage.GAME && renderGameScreen()}
      {gameStage === GameStage.RESULT && renderResultScreen()}
    </div>
  )
}

export default App
