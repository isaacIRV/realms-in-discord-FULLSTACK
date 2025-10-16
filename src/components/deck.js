import React from 'react';
import { Link } from 'react-router-dom';

const Deck = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
            <h1>Constructor de Mazos (Deck Builder)</h1>
            <p>Aquí diseñarás tu estrategia.</p>
            <Link to="/" style={{ color: '#61dafb' }}>Volver al Home</Link>
        </div>
    );
};

export default Deck;