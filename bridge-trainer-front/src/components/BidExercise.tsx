import React, { useEffect, useState } from 'react';
import { Donne, BiddingRequest, BiddingResponse } from '../models/types';
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

    // Désactiver les boutons de bid immédiatement
    setIsBiddingDisabled(true); 
    setMessage(null); // Effacer le message précédent

    const res = await postBidding({
      Id: deal.id,
      BidNumber: deal.bidsUpToPlayer.length,
      Proposition: proposition,
    });

    if (!res.ok) {
      const err = await res.text();
      setMessage(`Erreur: ${err}`);
      setIsBiddingDisabled(false); // Réactiver en cas d'échec d'API
      return;
    }

    const data: BiddingResponse = await res.json();

    if (!data.correct) {
      setMessage('Proposition incorrecte.');
      setIsBiddingDisabled(false); // Réactiver si la proposition est incorrecte
      return;
    }

    // Mise à jour de l'état des enchères avec les nouvelles enchères complètes
    setDeal(prevDeal => {
      if (!prevDeal) return null;
      return { ...prevDeal, bidsUpToPlayer: data.nextBids!.map(mapBid) };
    });

    // Le message "Correct !" s'affiche brièvement, puis l'état de fin d'enchère est vérifié
    setMessage('Correct !');

    // Délai avant de réactiver les boutons et de vérifier la fin de séquence
    setTimeout(() => {
      if (data.sequenceEnded) {
        setMessage('Enchères terminées.');
        setBiddingEnded(true); // Passer les enchères à l'état terminé
      } else {
        setMessage(null); // Effacer le message "Correct !" si la séquence continue
      }
      setIsBiddingDisabled(false); // Réactiver les boutons
    }, 800); // Délai augmenté à 0.8s pour une meilleure lisibilité
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
        initialEncheres={deal.bidsUpToPlayer}
        donneur={deal.dealer}
        joueurActuelNom={deal.player}
        mainJoueurActuel={deal.playerHand}
        onBidSelect={postProposition}
        currentBid={currentHighestBid}
        biddingEnded={biddingEnded}
      />

      {message && <p style={{color: message.includes('Erreur') ? 'red' : (message.includes('incorrecte') ? 'orange' : 'green'), marginTop: '10px'}}>{message}</p>}

      <div style={{marginTop: '20px', display: 'flex', gap: '20px'}}>
        <button className="menu-button" onClick={onBackToMenu} style={{backgroundColor:'red'}}>Retour</button>
        <button className="menu-button" onClick={fetchRandom} disabled={isBiddingDisabled}>Donne suivante</button>
      </div>
    </div>
  );
}