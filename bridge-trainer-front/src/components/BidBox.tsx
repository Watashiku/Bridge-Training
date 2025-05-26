import React from 'react';
import BidDisplay from './BidDisplay';
import '../styles/BidBox.css';

const BidBox = ({ currentBid, onSelectBid }) => {
  const bids = [
    '1C', '1D', '1H', '1S', '1NT',
    '2C', '2D', '2H', '2S', '2NT',
    '3C', '3D', '3H', '3S', '3NT',
    '4C', '4D', '4H', '4S', '4NT',
    '5C', '5D', '5H', '5S', '5NT',
    '6C', '6D', '6H', '6S', '6NT',
    '7C', '7D', '7H', '7S', '7NT',
    'Passe', 'Contre', 'Surcontre'
  ];

  const getBidValue = (bid) => {
    if (bid === 'Passe') return 0;
    if (bid === 'Contre') return 98;
    if (bid === 'Surcontre') return 99;

    const level = parseInt(bid[0]);
    const suit = bid[1];
    let suitValue;
    switch (suit) {
      case 'C': suitValue = 1; break;
      case 'D': suitValue = 2; break;
      case 'H': suitValue = 3; break;
      case 'S': suitValue = 4; break;
      case 'N': suitValue = 5; break;
      default: suitValue = 0;
    }
    return level * 10 + suitValue;
  };

  const currentBidValue = currentBid ? getBidValue(currentBid) : 0;

  return (
    <div className="bid-box-container">
      {bids.map((bid) => {
        const bidValue = getBidValue(bid);
        const isDisabled = bidValue > 0 && bidValue <= currentBidValue &&
                           bid !== 'Contre' && bid !== 'Surcontre';

        const isCurrentBid = bid === currentBid;

        return (
          <button
            key={bid}
            className="bid-button"
            onClick={() => !isDisabled && onSelectBid(bid)}
            disabled={isDisabled}
          >
            <BidDisplay
              bid={bid}
              isCurrentBid={isCurrentBid}
              isDisabled={isDisabled}
            />
          </button>
        );
      })}
    </div>
  );
};

export default BidBox;