import React, { useEffect, useState } from 'react';
import { Donne, BiddingRequest, BiddingResponse } from '../models/types';
import { fetchBidding, postBidding } from '../api/bridgeApi';
import BiddingTable from './BiddingTable';
import Hand from './Hand';
import BiddingBox from './BiddingBox';

export default function BiddingExercice({onBackToMenu}: {onBackToMenu: () => void}) {
  const [deal, setDeal] = useState<Donne | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function fetchRandom() {
    setMessage(null);
    const res = await fetchBidding();
    res.playerHand = res.playerHand.map(mapCard);
    res.bidsUpToPlayer = res.bidsUpToPlayer.map(mapBid);
    console.log(res);
    setDeal(res);
  }

  async function postProposition(proposition: string) {
    if (!deal) return;

    const res = await postBidding({
      Id: deal.id,
      BidNumber: deal.bidsUpToPlayer.length,
      Proposition: proposition,
    });

    if (!res.ok) {
      const err = await res.text();
      setMessage(`Erreur: ${err}`);
      return;
    }

    const data: BiddingResponse = await res.json();

    if (!data.correct) {
      setMessage('Proposition incorrecte');
      return;
    }

    setMessage('Correct !');
    setDeal({
      ...deal,
      bidsUpToPlayer: data.nextBids!.map(mapBid)
    });

    if (data.sequenceEnded) {
      setMessage('Enchères terminées');
    }
  }

  useEffect(() => {
    fetchRandom();
  }, []);

  if (!deal) return <div>Chargement...</div>;

  const encheres = message === 'Enchères terminées' ? deal.bidsUpToPlayer : [...deal.bidsUpToPlayer, '?'];


function isEnchereValide(e: string): boolean {
  return /^[1-7](NT|S|H|D|C)$/.test(e);
}
  function getDernierContrat(encheres: string[]) {
    for (let i = encheres.length - 1; i >= 0; i--) {
      if (isEnchereValide(encheres[i])) return { index: i, valeur: encheres[i] };
    }
    return null;
  }

  return (
    <div style={{maxWidth: 800, margin: 'auto'}}>
      <h2>Mode Enchères - Donne #{deal.id}</h2>
      <p>Donneur : {deal.dealer}</p>
      <p>Joueur : {deal.player} (à vous de jouer)</p>

      <BiddingBox seuil={getDernierContrat(deal.bidsUpToPlayer)?.valeur} onSelect={postProposition}/>
      <BiddingTable encheres={encheres} donneur={deal.dealer} />
      <Hand lignes={deal.playerHand} onCardClick={() => {}} />

      {message && <p style={{color: message.includes('Erreur') ? 'red' : 'green'}}>{message}</p>}

      <button className="menu-button" onClick={onBackToMenu} style={{margin: 30, backgroundColor:'red'}}>Retour</button>
      <button className="menu-button" onClick={fetchRandom} style={{margin: 30}}>Donne suivante</button>
    </div>
  );
}


const rankMap: Record<string, string> = {
  "Ace": "A",
  "King": "K",
  "Queen": "Q",
  "Jack": "J",
  "Ten": "10",
  "Nine": "9",
  "Eight": "8",
  "Seven": "7",
  "Six": "6",
  "Five": "5",
  "Four": "4",
  "Three": "3",
  "Deuce": "2",
};

const suitMap: Record<string, string> = {
  "Spade": "S",
  "Heart": "H",
  "Diamond": "D",
  "Club": "C",
  "NoTrump": "NT",
};

function mapCard(card: string): string {
  const rankMatch = card.match(/Rank\s*=\s*(\w+)/);
  const suitMatch = card.match(/Suit\s*=\s*(\w+)/);

  if (!rankMatch || !suitMatch) return "?";
  
  const rank = rankMap[rankMatch[1]] ?? "?";
  const suit = suitMap[suitMatch[1]] ?? "?";

  return `${rank}${suit}`;
}

function mapBid(bid: string): string {
  if (bid.includes("PassBid")) return "Pass";
  if (bid.includes("X")) return "X";
  if (bid.includes("Double")) return "X";
  if (bid.includes("XX")) return "XX";
  if (bid.includes("Redouble")) return "XX";

  const levelMatch = bid.match(/Level\s*=\s*(\d)/);
  const suitMatch = bid.match(/Suit\s*=\s*(\w+)/);

  if (!levelMatch || !suitMatch) return "?";

  const level = levelMatch[1];
  const suit = suitMap[suitMatch[1]] ?? "?";

  return `${level}${suit}`;
}