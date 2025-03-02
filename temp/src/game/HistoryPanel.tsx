import React, { useState } from 'react';
import { GameState } from './types';
import './HistoryPanel.css';

interface HistoryPanelProps {
  guessHistory: GameState['guessHistory'];
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ guessHistory }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`history-panel ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="history-header" onClick={() => setIsExpanded(!isExpanded)}>
        <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
        <h4>猜测历史</h4>
      </div>
      <div className="history-content">
        {guessHistory.map((guess, index) => (
          <div key={index} className={`history-item ${guess.result}`}>
            <span className="guess-number">{guess.number}</span>
            <span className={`guess-result ${guess.result}`}>
              {guess.result === 'smaller' ? '更小' :
               guess.result === 'bigger' ? '更大' : '正确'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};