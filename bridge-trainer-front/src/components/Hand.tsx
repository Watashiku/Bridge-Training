import React from 'react';

const COULEURS = ['♠', '♥', '♦', '♣'];
const ORDRE_COULEURS: Record<string, number> = { '♠': 0, '♥': 1, '♦': 3, '♣': 2 };
const ORDRE_VALEURS = ['A', 'R', 'D', 'V', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const MAP_COULEUR: Record<string, string> = {
    '♠': '_of_spades',
    '♥': '_of_hearts',
    '♦': '_of_diamonds',
    '♣': '_of_clubs'
};
const MAP_VALEUR: Record<string, string> = {
    '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7',
    '8': '8', '9': '9', '10': '10', 'V': 'jack', 'D': 'queen',
    'R': 'king', 'A': 'ace'
};
const CARD_WIDTH = 60; 
const CARD_SCALE = 1.5;
const CARD_OVERLAP = CARD_WIDTH * CARD_SCALE * 0.7;

const toCardFilename = (carte: string): string =>
    `/cards/${MAP_VALEUR[carte.slice(0, -1)]}${MAP_COULEUR[carte.slice(-1)]}.svg`;

interface HandProps {
    lignes: string[];
    onCardClick: (carte: string) => void;
}

const Hand: React.FC<HandProps> = ({ lignes, onCardClick }) => {
    const cartes = lignes.reduce((acc, ligne, idx) => {
        const couleur = COULEURS[idx];
        const valeurs = ligne.split(' ').filter(Boolean);
        return acc.concat(valeurs.map(valeur => ({ valeur, couleur })));
    }, [] as { valeur: string; couleur: string }[]);

    const total = cartes.length;

    cartes.sort((a, b) =>
        ORDRE_COULEURS[a.couleur] !== ORDRE_COULEURS[b.couleur]
            ? ORDRE_COULEURS[a.couleur] - ORDRE_COULEURS[b.couleur]
            : ORDRE_VALEURS.indexOf(a.valeur) - ORDRE_VALEURS.indexOf(b.valeur)
    );

    const containerWidth = total * CARD_OVERLAP + CARD_WIDTH * CARD_SCALE;
    const containerHeight = CARD_WIDTH * CARD_SCALE;

    return (
        <div style={{
            position: 'relative',
            height: `${containerHeight}px`,
            width: `${containerWidth}px`,
            margin: 'auto',
            marginBottom: 20,
        }}>
            {cartes.map(({ valeur, couleur }, idx) => {
                const carte = `${valeur}${couleur}`;
                const src = toCardFilename(carte);
                const left = idx * CARD_OVERLAP;
                const zIndex = idx;

                return (
                    <img
                        key={carte}
                        src={src}
                        alt={carte}
                        onClick={() => onCardClick(carte)}
                        style={{
                            position: 'absolute',
                            left: `${left}px`,
                            bottom: '0px',
                            width: `${CARD_WIDTH * CARD_SCALE}px`,
                            cursor: 'pointer',
                            zIndex,
                            transition: 'transform 0.2s',
                        }}
                    />
                );
            })}
        </div>
    );
};

export default Hand;