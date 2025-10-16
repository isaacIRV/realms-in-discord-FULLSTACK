import React from 'react';
import { Link } from 'react-router-dom';

const Play = () => {
    return (
        <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
            <h1>Pantalla de Juego</h1>
            <p>¡Prepárate para la batalla!</p>
            <Link to="/" style={{ color: '#61dafb' }}>Volver al Home</Link>
        </div>
    );
};

export default Play;