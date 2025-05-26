import React from 'react';
import '../styles/Hand.css';

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
const CARD_OVERLAP_FACTOR = 0.5; // Augmentation du chevauchement pour que les cartes soient plus proches

const toCardFilename = (carte: string): string =>
    `/cards/${MAP_VALEUR[carte.slice(0, -1)]}${MAP_COULEUR[carte.slice(-1)]}.svg`;

interface HandProps {
    cards: string[];
    onCardClick: (carte: string) => void;
}

const Hand: React.FC<HandProps> = ({ cards, onCardClick }) => {
    const cartes = cards.map(el => [el[0], el[el.length-1]]);

    const total = cartes.length;

    cartes.sort((a, b) =>
        ORDRE_COULEURS[a[1]] !== ORDRE_COULEURS[b[1]]
            ? ORDRE_COULEURS[a[1]] - ORDRE_COULEURS[b[1]]
            : ORDRE_VALEURS.indexOf(a[0]) - ORDRE_VALEURS.indexOf(b[0])
    );

    // Estimation des dimensions des cartes en fonction du CSS
    const cardBaseWidth = 100; // Largeur par défaut ajustée
    const cardBaseHeight = 145; // Hauteur par défaut ajustée
    const overlapAmount = cardBaseWidth * CARD_OVERLAP_FACTOR;

    const containerWidth = (total > 0 ? (total - 1) * overlapAmount + cardBaseWidth : 0);
    const visibleCardHeight = cardBaseHeight * 0.4; // Afficher environ 40% du haut de la carte

    return (
        <div className="hand-container" style={{
            width: `${containerWidth}px`,
            height: `${visibleCardHeight}px`,
        }}>
            {cartes.map((el, idx) => {
                const carte = `${el[0]}${el[1]}`;
                const src = toCardFilename(carte);
                const left = idx * overlapAmount;

                return (
                    <img
                        key={carte}
                        src={src}
                        alt={carte}
                        onClick={() => onCardClick(carte)}
                        className="hand-card"
                        style={{
                            left: `${left}px`,
                            zIndex: idx,
                            bottom: `-${cardBaseHeight - visibleCardHeight}px`,
                        }}
                    />
                );
            })}
        </div>
    );
};

export default Hand;