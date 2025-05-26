import React from 'react';
import '../styles/BidDisplay.css';

const BidDisplay = ({ bid, isCurrentBid = false, isDisabled = false }) => {
  if (!bid) {
    return <div className="bid-display empty-bid">-</div>;
  }

  const getBidClass = (bidString) => {
    if (bidString === 'Passe') return 'pass';
    if (bidString === 'Contre') return 'contre';
    if (bidString === 'Surcontre') return 'surcontre';

    const suit = bidString[1];
    switch (suit) {
      case 'C': return 'clubs';
      case 'D': return 'diamonds';
      case 'H': return 'hearts';
      case 'S': return 'spades';
      case 'N': return 'no-trump';
      default: return '';
    }
  };

  const getSuitIconAndColor = (suit) => {
    let icon = null;
    let color = 'black';

    switch (suit) {
      case 'C':
        icon = <span>&clubs;</span>;
        color = 'green';
        break;
      case 'D':
        icon = <span>&diams;</span>;
        color = 'red';
        break;
      case 'H':
        icon = <span>&hearts;</span>;
        color = 'red';
        break;
      case 'S':
        icon = <span>&spades;</span>;
        color = 'black';
        break;
      case 'N':
        icon = null;
        break;
      default:
        icon = null;
    }
    return { icon, color };
  };

  const level = parseInt(bid[0]);
  const suit = bid[1];
  const isSpecialBid = isNaN(level);

  const { icon: suitIcon, color: iconColor } = getSuitIconAndColor(suit);

  return (
    <div
      className={`bid-display ${getBidClass(bid)} ${isCurrentBid ? 'current-bid' : ''} ${isDisabled ? 'disabled' : ''}`}
    >
      {isSpecialBid ? (
        bid
      ) : (
        <>
          <span>{level}</span>
          {suitIcon && <span className="suit-icon" style={{ color: iconColor }}>{suitIcon}</span>}
          {suit === 'N' ? 'NT' : null}
        </>
      )}
    </div>
  );
};

export default BidDisplay;