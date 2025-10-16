import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Portada from '../background/Portada_R&D.png';

function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Limpiamos los estados de error y carga
        setError("");
        setLoading(true);

        try {
            // Simula una llamada a la API con tiempo de espera
            await new Promise((resolve) => setTimeout(resolve, 1000));
            
            // Lógica de login
            const users = JSON.parse(localStorage.getItem('users')) || {};
            const user = users[username];

            // Validacion del usuario y contraseña
            if (user && user.password === password) {
                onLoginSuccess(username);
            } else {
                setError('Usuario o contraseña incorrecta.');
            }
        } catch (err) {
            // Manejo de errores de red
            setError('Error de red. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div style={{ marginBottom: '20px' }}>
                <img src={Portada} alt="Logo de Realms in Discord" style={{ width: '150px', height: 'auto' }} />
            </div>

            <h1>Realms in Discord TCG</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isLoading}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                />
                {error && <p className="error-message">{error}</p>}
                
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>

            <p onClick={() => navigate('/register')} style={{ cursor: 'pointer', marginTop: '15px', color: '#61dafb' }}>
                ¿No tienes cuenta? Regístrate YA
            </p>
        </div>
    );
};

export default LoginPage;