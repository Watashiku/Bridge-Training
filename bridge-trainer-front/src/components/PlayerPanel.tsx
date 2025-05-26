import React from 'react';
import BidDisplay from './BidDisplay';
import '../styles/PlayerPanel.css';

const PlayerPanel = ({ player, bids, isCurrentPlayer, isDealer }) => {
  return (
    <div className={`player-panel ${player.toLowerCase()} ${isCurrentPlayer ? 'current-player' : ''}`}>
      <div className="player-info">
        <span className="player-name">{player}</span>
        {isDealer && <span className="dealer-icon">D</span>}
      </div>
      <div className="player-bids">
        {bids.map((bid, index) => (
          <BidDisplay key={index} bid={bid} />
        ))}
        {bids.length === 0 && <BidDisplay bid="" />}
      </div>
    </div>
  );
};

export default PlayerPanel;