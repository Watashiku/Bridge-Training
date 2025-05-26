import React, { useState } from 'react';
import './styles/App.css';
import BidExercise from './components/BidExercise';
import LeadExercise from './components/LeadExercise';

function App() {
    const [exercise, setExercise] = useState<'menu' | 'bidding' | 'lead'>('menu');

    const renderExercise = () => {
        switch (exercise) {
            case 'bidding':
                return <BidExercise onBackToMenu={() => setExercise('menu')} />;
            case 'lead':
                return <LeadExercise onBackToMenu={() => setExercise('menu')} />;
            case 'menu':
            default:
                return (
                    <div className="menu-container">
                        <h1 className="menu-title">Bridge Trainer</h1>
                        <button className="menu-button" onClick={() => setExercise('bidding')}>Exercice d'enchère</button>
                        <button className="menu-button" onClick={() => setExercise('lead')}>Exercice d'entame</button>
                    </div>
                );
        }
    };

    return (
        <div className="app-container">
            {renderExercise()}
        </div>
    );
}

export default App;