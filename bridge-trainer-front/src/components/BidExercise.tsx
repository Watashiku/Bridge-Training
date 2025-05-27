import React, { useEffect, useState } from 'react';
import { Donne, BiddingResponse } from '../models/types';
import { fetchBidding, postBidding } from '../api/bridgeApi';
import BridgeTable from './BridgeTable';
import { mapBid, mapCard } from '../utils/mapper';

export default function BidExercise({onBackToMenu}: {onBackToMenu: () => void}) {
  const [deal, setDeal] = useState<Donne | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isBiddingDisabled, setIsBiddingDisabled] = useState<boolean>(false);
  const [biddingEnded, setBiddingEnded] = useState<boolean>(false);

  async function fetchRandom() {
    setMessage(null);
    setIsBiddingDisabled(false);
    setBiddingEnded(false);
    const res = await fetchBidding();
    res.playerHand = res.playerHand.map(mapCard);
    res.bidsUpToPlayer = res.bidsUpToPlayer.map(mapBid);
    setDeal(res);
  }

  async function postProposition(proposition: string) {
    if (!deal || isBiddingDisabled) return;

    setIsBiddingDisabled(true); 
    setMessage(null);

    const res = await postBidding({
      Id: deal.id,
      BidNumber: deal.bidsUpToPlayer.length,
      Proposition: proposition,
    });

    if (!res.ok) {
      const err = await res.text();
      setMessage(`Erreur: ${err}`);
      setIsBiddingDisabled(false);
      return;
    }

    const data: BiddingResponse = await res.json();

    if (!data.correct) {
      setMessage('Proposition incorrecte.');
      setIsBiddingDisabled(false);
      return;
    }

    setDeal(prevDeal => {
      if (!prevDeal) return null;
      return { ...prevDeal, bidsUpToPlayer: data.nextBids!.map(mapBid) };
    });

    setMessage('Correct !');

    if (data.sequenceEnded) {
      setMessage('Enchères terminées.');
      setBiddingEnded(true);
    } else {
      setMessage(null);
    }
    setIsBiddingDisabled(false);
  }

  useEffect(() => {
    fetchRandom();
  }, []);

  if (!deal) return <div>Chargement...</div>;

  const getDernierContrat = (encheres: string[]) => {
    const valideBids = encheres.filter(e => e !== 'Passe' && e !== 'Contre' && e !== 'Surcontre');
    return valideBids.length > 0 ? valideBids[valideBids.length - 1] : null;
  };

  const currentHighestBid = getDernierContrat(deal.bidsUpToPlayer);

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <BridgeTable
        encheres={deal.bidsUpToPlayer}
        donneur={deal.dealer}
        joueurActuelNom={deal.player}
        mainJoueurActuel={deal.playerHand}
        onBidSelect={postProposition}
        currentBid={currentHighestBid}
        biddingEnded={biddingEnded}
        onCardSelect={undefined}
        />

      {message && <p style={{color: message.includes('Erreur') ? 'red' : (message.includes('incorrecte') ? 'orange' : 'green'), marginTop: '10px'}}>{message}</p>}

      <div style={{marginTop: '20px', display: 'flex', gap: '20px'}}>
        <button className="menu-button" onClick={onBackToMenu} style={{backgroundColor:'red'}}>Retour</button>
        <button className="menu-button" onClick={fetchRandom} disabled={isBiddingDisabled}>Donne suivante</button>
      </div>
    </div>
  );
}