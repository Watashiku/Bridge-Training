import React from 'react';

const COULEURS = ['S', 'H', 'D', 'C'];
const ORDRE_COULEURS: Record<string, number> = { 'S': 0, 'H': 1, 'D': 3, 'C': 2 };
const ORDRE_VALEURS = ['A', 'K', 'Q', 'J', '1', '9', '8', '7', '6', '5', '4', '3', '2'];
const MAP_COULEUR: Record<string, string> = {
    'S': '_of_spades',
    'H': '_of_hearts',
    'D': '_of_diamonds',
    'C': '_of_clubs'
};
const MAP_VALEUR: Record<string, string> = {
    '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7',
    '8': '8', '9': '9', '1': '10', 'J': 'jack', 'Q': 'queen',
    'K': 'king', 'A': 'ace'
};
const CARD_WIDTH = 60; 
const CARD_SCALE = 3.5;
const CARD_OVERLAP = CARD_WIDTH * CARD_SCALE * 0.2;

const toCardFilename = (carte: string): string =>
    `/cards/${MAP_VALEUR[carte.slice(0, -1)]}${MAP_COULEUR[carte.slice(-1)]}.svg`;

interface HandProps {
    lignes: string[];
    onCardClick: (carte: string) => void;
}

const Hand: React.FC<HandProps> = ({ lignes, onCardClick }) => {
    const cartes = lignes.map(el => [el[0], el[el.length-1]]);

     console.log('lignes', lignes);
     console.log('cartes', cartes);

    const total = cartes.length;

    cartes.sort((a, b) =>
        ORDRE_COULEURS[a[1]] !== ORDRE_COULEURS[b[1]]
            ? ORDRE_COULEURS[a[1]] - ORDRE_COULEURS[b[1]]
            : ORDRE_VALEURS.indexOf(a[0]) - ORDRE_VALEURS.indexOf(b[0])
    );
     console.log('cartes', cartes);

    const containerWidth = total * CARD_OVERLAP + CARD_WIDTH * CARD_SCALE;
    const containerHeight = CARD_WIDTH * CARD_SCALE * 1.5;

    return (
        <div style={{
            position: 'relative',
            height: `${containerHeight}px`,
            width: `${containerWidth}px`,
            margin: 'auto',
            marginBottom: 20,
        }}>
            {cartes.map((el, idx) => {
                const carte = `${el[0]}${el[1]}`;
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