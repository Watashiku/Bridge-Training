import React from 'react';
import BidDisplay from './BidDisplay';
import '../styles/BidTable.css';

const joueurs = ['North', 'East', 'South', 'West'];

function getJoueurIndex(joueur) {
  return joueurs.indexOf(joueur);
}

function isEnchereValide(e) {
  return e === '?' || /^[1-7](NT|S|H|D|C)$/.test(e);
}

function getDernierContrat(encheres) {
  for (let i = encheres.length - 1; i >= 0; i--) {
    if (isEnchereValide(encheres[i])) return { index: i, valeur: encheres[i] };
  }
  return null;
}

export default function BidTable({ encheres, donneur }) {
  const startIndex = getJoueurIndex(donneur);
  const colonnes = joueurs;

  const lignes = [[], [], [], []];

  for (let i = 0; i < 4; i++) {
      if (i < startIndex) {
          lignes[i].push("");
      }
  }

  encheres.forEach((enchere, i) => {
    const joueurIndex = (startIndex + i) % 4;
    lignes[joueurIndex].push(enchere);
  });

  const maxCol = Math.max(...lignes.map((l) => l.length));
  const contrat = getDernierContrat(encheres);

  return (
    <div className="bid-table-container">
      <table className="bid-table">
        <thead>
          <tr>
            {colonnes.map((j) => (
              <th key={j} className="bid-table-header">{j}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxCol }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {lignes.map((col, colIdx) => {
                const ench = col[rowIdx] ?? '';
                
                const isContrat = ench !== '' && contrat?.valeur === ench && encheres.indexOf(ench) === contrat?.index;

                return (
                  <td key={colIdx} className="bid-table-cell">
                    <BidDisplay bid={ench} isCurrentBid={isContrat} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {contrat && (
        <div className="final-contract">
          <strong>Contrat final :</strong> <BidDisplay bid={contrat.valeur} />
        </div>
      )}
    </div>
  );
}