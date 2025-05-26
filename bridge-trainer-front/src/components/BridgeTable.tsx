import React, { useMemo } from 'react';
import PlayerPanel from './PlayerPanel';
import BidTable from './BidTable';
import BidBox from './BidBox';
import Hand from './Hand';
import '../styles/BridgeTable.css';

const joueurs = ['North', 'East', 'South', 'West'];

const getCurrentPlayer = (donneur, encheres) => {
  const donneurIndex = joueurs.indexOf(donneur);
  const currentPlayerIndex = (donneurIndex + encheres.length) % 4;
  return joueurs[currentPlayerIndex];
};

const getBidsPerPlayer = (donneur, allBids) => {
  const dealerIndex = joueurs.indexOf(donneur);
  const playerBids = {
    North: [],
    East: [],
    South: [],
    West: [],
  };

  allBids.forEach((bid, index) => {
    const playerIndex = (dealerIndex + index) % 4;
    playerBids[joueurs[playerIndex]].push(bid);
  });
  return playerBids;
};

export default function BridgeTable({
  initialEncheres = [],
  donneur,
  joueurActuelNom,
  mainJoueurActuel = [],
  onCardSelect,
  onBidSelect,
  currentBid,
  biddingEnded = false
}) {
  const currentPlayer = getCurrentPlayer(donneur, initialEncheres);
  const bidsPerPlayer = useMemo(() => getBidsPerPlayer(donneur, initialEncheres), [donneur, initialEncheres]);

  const playerOrder = useMemo(() => {
    const playerIndex = joueurs.indexOf(joueurActuelNom);
    const orderedPlayers = [
      joueurs[(playerIndex + 2) % 4],
      joueurs[(playerIndex + 3) % 4],
      joueurs[playerIndex],
      joueurs[(playerIndex + 1) % 4]
    ];
    return {
      top: orderedPlayers[0],
      right: orderedPlayers[1],
      bottom: orderedPlayers[2],
      left: orderedPlayers[3]
    };
  }, [joueurActuelNom]);


  return (
    <div className="bridge-table-container">
      <div className="table-top-section">
        <PlayerPanel
          player={playerOrder.top}
          bids={bidsPerPlayer[playerOrder.top]}
          isCurrentPlayer={currentPlayer === playerOrder.top && !biddingEnded}
          isDealer={donneur === playerOrder.top}
        />
      </div>

      <div className="table-middle-section">
        <PlayerPanel
          player={playerOrder.left}
          bids={bidsPerPlayer[playerOrder.left]}
          isCurrentPlayer={currentPlayer === playerOrder.left && !biddingEnded}
          isDealer={donneur === playerOrder.left}
        />
        <div className="bidding-area">
          <BidTable encheres={initialEncheres} donneur={donneur} />
          {!biddingEnded && currentPlayer === joueurActuelNom && (
            <div className="bid-box-wrapper">
              <BidBox currentBid={currentBid} onSelectBid={onBidSelect} />
            </div>
          )}
        </div>
        <PlayerPanel
          player={playerOrder.right}
          bids={bidsPerPlayer[playerOrder.right]}
          isCurrentPlayer={currentPlayer === playerOrder.right && !biddingEnded}
          isDealer={donneur === playerOrder.right}
        />
      </div>

      <div className="table-bottom-section">
        <PlayerPanel
          player={playerOrder.bottom}
          bids={bidsPerPlayer[playerOrder.bottom]}
          isCurrentPlayer={currentPlayer === playerOrder.bottom && !biddingEnded}
          isDealer={donneur === playerOrder.bottom}
        />
      </div>

      {mainJoueurActuel.length > 0 && (
        <div className="player-hand-wrapper">
          <Hand cards={mainJoueurActuel} onCardClick={onCardSelect}/>
        </div>
      )}
    </div>
  );
}