import { useEffect, useState } from 'react';

const joueurs = ['Nord', 'Est', 'Sud', 'Ouest'] as const;

function getJoueurIndex(joueur: string) {
  return joueurs.indexOf(joueur);
}

function isEnchereValide(e: string): boolean {
  return e === '?' || /^[1-7](SA|♠|♥|♦|♣)$/.test(e);
}

function getDernierContrat(encheres: string[]) {
  for (let i = encheres.length - 1; i >= 0; i--) {
    if (isEnchereValide(encheres[i])) return { index: i, valeur: encheres[i] };
  }
  return null;
}

export default function BiddingTable({ encheres, donneur }: { encheres: string[]; donneur: string }) {
  const startIndex = getJoueurIndex(donneur);
  const colonnes = joueurs;

  const lignes: string[][] = [[], [], [], []];

  for(let i = 0; i < startIndex; i++) {
    lignes[i].push("");
  }
  encheres.forEach((enchere, i) => {
    const joueurIndex = (startIndex + i) % 4;
    lignes[joueurIndex].push(enchere);
  });

  const maxCol = Math.max(...lignes.map((l) => l.length));
  const contrat = getDernierContrat(encheres);

  return (
    <div style={{ marginBottom: 16 }}>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            {colonnes.map((j) => (
              <th key={j} style={{ border: '1px solid #ccc', padding: 4 }}>{j}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxCol }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {lignes.map((col, colIdx) => {
                const ench = col[rowIdx] ?? '';
                const isContrat = contrat?.index === rowIdx * 4 + ((4 + colIdx) % 4) - startIndex;
                return (
                  <td
                    key={colIdx}
                    style={{
                      border: '1px solid #ccc',
                      padding: 4,
                      textAlign: 'center',
                      fontWeight: isContrat ? 'bold' : 'normal',
                      backgroundColor: isContrat ? '#d1ffd1' : 'transparent'
                    }}
                  >
                    {ench}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {contrat && (
        <div style={{ marginTop: 8 }}>
          <strong>Contrat final :</strong> {contrat.valeur}
        </div>
      )}
    </div>
  );
}

