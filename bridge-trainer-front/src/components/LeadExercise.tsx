import { useEffect, useState } from 'react';
import { fetchLead, sendLead, LeadResponse } from '../api/bridgeApi';
import Hand from './Hand';
import BiddingTable from './BiddingTable';

export default function LeadExercise({onBackToMenu}: {onBackToMenu: () => void}) {
  const [donne, setDonne] = useState<LeadResponse | null>(null);
  const [resultat, setResultat] = useState<string | null>(null);

  const chargerNouvelleDonne = async () => {
    setResultat(null);
    setDonne(await fetchLead());
  };

  useEffect(() => {
    chargerNouvelleDonne();
  }, []);

  const handleCardClick = async (carte: string) => {
    if (!donne) return;
    const res = await sendLead(donne.id, carte);
    setResultat(res.correct ? '✅ Bonne entame' : `❌ Mauvaise entame : ${res.message ?? ''}`);
  };

  if (!donne) return <p>Chargement...</p>;

  return (
    <div style={{maxWidth: 800, margin: 'auto'}}>
      <h2>Entame - Joueur: {donne.joueur} | Donneur: {donne.donneur}</h2>
      <h4>Enchères</h4>
      <BiddingTable encheres={donne.encheres} donneur={donne.donneur} />
      <Hand lignes={donne.mainJoueur} onCardClick={handleCardClick} />
      {resultat && (
        <div>
          <p>{resultat}</p>
          <button className="menu-button" onClick={chargerNouvelleDonne}>Suivant</button>
        </div>
      )}
      <button className="menu-button" onClick={onBackToMenu} style={{margin: 30}}>Retour</button>
    </div>
  );
}
