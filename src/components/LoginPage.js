import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Portada from '../background/Portada_R&D.png';
import { apiService } from '../services/api';  // ← Importar el servicio

function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            // LLAMADA REAL AL BACKEND
            const response = await apiService.login({
                username: username,
                password: password
            });

            onLoginSuccess(response.username);
            
        } catch (err) {
            setError(err.message);
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