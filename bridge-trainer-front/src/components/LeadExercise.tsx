import React, { useEffect, useState } from 'react';
import { fetchLead, sendLead } from '../api/bridgeApi';
import BridgeTable from './BridgeTable';
import { mapBid, mapCard } from '../utils/mapper';
import '../styles/LeadExercise.css';
import { LeadResponse } from '../models/types';

export default function LeadExercise({ onBackToMenu }: { onBackToMenu: () => void }) {
  const [deal, setDeal] = useState<LeadResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLeadDisabled, setIsLeadDisabled] = useState<boolean>(false);

  const chargerNouvelleDonne = async () => {
    setMessage(null);
    setIsLeadDisabled(false);
    try {
      let res = await fetchLead();
      res.mainJoueur = res.mainJoueur.map(mapCard);
      res.encheres = res.encheres.map(mapBid);
      setDeal(res);
    } catch (error) {
      setMessage(`Erreur lors du chargement de la donne : ${error instanceof Error ? error.message : 'inconnue'}`);
      console.error("Erreur fetchLead:", error);
    }
  };

  useEffect(() => {
    chargerNouvelleDonne();
  }, []);

  const handleCardClick = async (carte: string) => {
    if (!deal || isLeadDisabled) return;

    setIsLeadDisabled(true);
    setMessage(null);

    try {
      const res = await sendLead(deal.id, carte);

      if (res.correct) {
        setMessage('✅ Bonne entame !');
      } else {
        setIsLeadDisabled(false);
        setMessage(`❌ Mauvaise entame : ${res.message ?? 'Erreur inconnue.'}`);
      }
    } catch (error) {
      setMessage(`Erreur lors de l'envoi de l'entame : ${error instanceof Error ? error.message : 'inconnue'}`);
      console.error("Erreur sendLead:", error);
    }
  };

  if (!deal) return <p>Chargement...</p>;

  const getMessageClass = (msg: string | null) => {
    if (!msg) return '';
    if (msg.startsWith('❌')) return 'result-error';
    if (msg.startsWith('✅')) return 'result-success';
    return '';
  };

  return (
    <div className="lead-exercise-container">
      <h2>Entame - Joueur: {deal.joueur} | Contrat: {deal.contrat}</h2>
      <BridgeTable
        encheres={deal.encheres}
        donneur={deal.donneur}
        joueurActuelNom={deal.joueur}
        mainJoueurActuel={deal.mainJoueur}
        onCardSelect={handleCardClick}
        biddingEnded={true}
        onBidSelect={() => {}}
        currentBid={null}
      />

      {message && (
        <div className="result-section">
          <p className={getMessageClass(message)}>{message}</p>
        </div>
      )}

      <div className="controls-section">
        <button className="menu-button menu-button-back" onClick={onBackToMenu}>Retour</button>
        <button className="menu-button menu-button-next" onClick={chargerNouvelleDonne}>Donne Suivante</button>
      </div>
    </div>
  );
}