import React from 'react';

const ordreEncheres = [
    'Pass',
    '1C', '1D', '1H', '1S', '1NT',
    '2C', '2D', '2H', '2S', '2NT',
    '3C', '3D', '3H', '3S', '3NT',
    '4C', '4D', '4H', '4S', '4NT',
    '5C', '5D', '5H', '5S', '5NT',
    '6C', '6D', '6H', '6S', '6NT',
    '7C', '7D', '7H', '7S', '7NT',
    'X',
    'XX'
];

function enchereEstSuperieure(a: string, b: string): boolean {
    if (a === 'Pass') return false;
    if (b === 'Pass') return true;
    if (a === 'X' || a === 'XX') return false;
    if (b === 'X' || b === 'XX') return true;
    return ordreEncheres.indexOf(a) > ordreEncheres.indexOf(b);
}

type Props = {
    seuil: string;
    onSelect: (enchere: string) => void;
};

const BiddingBox: React.FC<Props> = ({ seuil, onSelect }) => {
    const encheresValides = ordreEncheres.filter(e => {
        if (e === 'Pass' || e === 'X' || e === 'XX') return true;
        return enchereEstSuperieure(e, seuil);
    });

    const getCouleur = (enchere: string) => {
        if (enchere.length > 1 && ['C', 'D', 'H', 'S', 'NT'].includes(enchere.charAt(1))) {
            return enchere.charAt(1);
        }
        return null;
    };

    const getNiveau = (enchere: string) => {
        if (enchere.length > 1 && ['1', '2', '3', '4', '5', '6', '7'].includes(enchere.charAt(0))) {
            return parseInt(enchere.charAt(0));
        }
        return 0;
    };

    const encheresParNiveau = [1, 2, 3, 4, 5, 6, 7].map(niveau => {
        return ordreEncheres.filter(e => getNiveau(e) === niveau);
    });

    const autresEncheres = ordreEncheres.filter(e => !getNiveau(e));

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 8,
            borderRadius: 4,
            backgroundColor: '#f8f8f8',
            maxWidth: 500,
            margin: 'auto',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        }}>
            {encheresParNiveau.map((niveauEncheres, index) => (
                <div key={index + 1} style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                    {niveauEncheres.map(e => {
                        const estValide = encheresValides.includes(e);
                        const couleur = getCouleur(e);
                        let bgColor = 'white';
                        let textColor = '#333';

                        if (couleur) {
                            switch (couleur) {
                                case 'T': bgColor = '#f0fff0'; textColor = 'black'; break;
                                case 'D': bgColor = '#fff0f0'; textColor = 'red'; break;
                                case 'H': bgColor = '#fff0f0'; textColor = 'red'; break;
                                case 'S': bgColor = '#f0f0f0'; textColor = 'black'; break;
                            }
                        }

                        return (
                            <button
                                key={e}
                                onClick={() => estValide ? onSelect(e) : undefined}
                                style={{
                                    padding: '6px 10px',
                                    borderRadius: 4,
                                    border: '1px solid #ddd',
                                    backgroundColor: estValide ? bgColor : '#eee',
                                    color: estValide ? textColor : '#aaa',
                                    fontWeight: 400,
                                    cursor: estValide ? 'pointer' : 'default',
                                    minWidth: 45,
                                    userSelect: 'none',
                                    transition: estValide ? 'background-color 0.15s' : 'none',
                                    opacity: estValide ? 1 : 0.6,
                                    fontSize: '0.9em',
                                    marginRight: 4,
                                }}
                                onMouseDown={ev => ev.preventDefault()}
                                onMouseOver={ev => { if (estValide) ev.currentTarget.style.backgroundColor = '#e9e9e9'; }}
                                onMouseOut={ev => { if (estValide) ev.currentTarget.style.backgroundColor = bgColor; }}
                                title={estValide ? "Cliquer pour proposer cette enchère" : "Enchère non valide"}
                                disabled={!estValide}
                            >
                                {e}
                            </button>
                        );
                    })}
                </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
                {autresEncheres.map(e => {
                    const estValide = encheresValides.includes(e);
                    let bgColor = 'white';
                    let textColor = '#333';

                    if (e === 'Pass') {
                        bgColor = '#90ee90';
                        textColor = 'black';
                    } else if (e === 'X') {
                        bgColor = '#ffcccb';
                        textColor = 'red';
                    } else if (e === 'XX') {
                        bgColor = '#d3d3d3';
                        textColor = 'black';
                    }

                    let displayValue = e;
                    if (e === 'X') displayValue = 'X';
                    if (e === 'XX') displayValue = 'XX';

                    return (
                        <button
                            key={e}
                            onClick={() => estValide ? onSelect(e) : undefined}
                            style={{
                                padding: '6px 10px',
                                borderRadius: 4,
                                border: '1px solid #ddd',
                                backgroundColor: estValide ? bgColor : '#eee',
                                color: estValide ? textColor : '#aaa',
                                fontWeight: 400,
                                cursor: estValide ? 'pointer' : 'default',
                                minWidth: 45,
                                userSelect: 'none',
                                transition: estValide ? 'background-color 0.15s' : 'none',
                                opacity: estValide ? 1 : 0.6,
                                fontSize: '0.9em',
                                marginRight: 4,
                            }}
                            onMouseDown={ev => ev.preventDefault()}
                            onMouseOver={ev => { if (estValide) ev.currentTarget.style.backgroundColor = '#e9e9e9'; }}
                            onMouseOut={ev => { if (estValide) ev.currentTarget.style.backgroundColor = bgColor; }}
                            title={estValide ? "Cliquer pour proposer cette enchère" : "Enchère non valide"}
                            disabled={!estValide}
                        >
                            {displayValue}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BiddingBox;