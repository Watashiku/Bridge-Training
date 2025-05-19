import React, { useEffect, useState } from 'react';
import { Donne, BiddingRequest, BiddingResponse } from '../models/types';
import { fetchBidding, postBidding } from '../api/bridgeApi';
import BiddingTable from './BiddingTable';
import Hand from './Hand';
import BiddingBox from './BiddingBox';

export default function BiddingExercice({onBackToMenu}: {onBackToMenu: () => void}) {
  const [donne, setDonne] = useState<Donne | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function fetchRandom() {
    setMessage(null);
    setDonne(await fetchBidding());
  }

  async function postProposition(proposition: string) {
    if (!donne) return;

    const res = await postBidding({
      Id: donne.id,
      Joueur: donne.joueur,
      EncheresDejaFaites: donne.encheresDejaFaites,
      Proposition: proposition,
    });

    if (!res.ok) {
      const err = await res.text();
      setMessage(`Erreur: ${err}`);
      return;
    }

    const data: BiddingResponse = await res.json();

    if (!data.correct) {
      setMessage(data.message || 'Proposition incorrecte');
      return;
    }

    setMessage('Correct !');
    const nouvellesEncheres = [...donne.encheresDejaFaites, proposition, ...data.suivantes!];
    setDonne({
      ...donne,
      encheresDejaFaites: nouvellesEncheres
    });

    if (data.fin) {
      setMessage('Enchères terminées');
    }
  }

  useEffect(() => {
    fetchRandom();
  }, []);

  if (!donne) return <div>Chargement...</div>;

  const encheres = message === 'Enchères terminées' ? donne.encheresDejaFaites : [...donne.encheresDejaFaites, '?'];


function isEnchereValide(e: string): boolean {
  return /^[1-7](SA|♠|♥|♦|♣)$/.test(e);
}
  function getDernierContrat(encheres: string[]) {
    for (let i = encheres.length - 1; i >= 0; i--) {
      if (isEnchereValide(encheres[i])) return { index: i, valeur: encheres[i] };
    }
    return null;
  }

  return (
    <div style={{maxWidth: 800, margin: 'auto'}}>
      <h2>Mode Enchères - Donne #{donne.id}</h2>
      <p>Donneur : {donne.donneur}</p>
      <p>Joueur : {donne.joueur} (à vous de jouer)</p>

      <Hand lignes={donne.mainJoueur} onCardClick={() => {}} />
      <BiddingTable encheres={encheres} donneur={donne.donneur} />
      <BiddingBox seuil={getDernierContrat(donne.encheresDejaFaites)?.valeur} onSelect={postProposition}/>

      {message && <p style={{color: message.includes('Erreur') ? 'red' : 'green'}}>{message}</p>}

      <button className="menu-button" onClick={onBackToMenu} style={{margin: 30, backgroundColor:'red'}}>Retour</button>
      <button className="menu-button" onClick={fetchRandom} style={{margin: 30}}>Donne suivante</button>
    </div>
  );
}
