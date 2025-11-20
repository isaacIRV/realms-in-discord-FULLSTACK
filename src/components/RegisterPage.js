import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Portada from '../background/Portada_R&D.png';
import { apiService } from '../services/api';  // ← Importar el servicio

function RegisterPage({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password || !email) {
            setError("Por favor, ingresa tu usuario, correo y contraseña.");
            return;
        }

        setError('');
        setLoading(true);

        try {
            // LLAMADA REAL AL BACKEND
            await apiService.register({
                username: username,
                email: email,
                password: password
            });

            alert("Registro exitoso! Ahora puedes ingresar.");
            onLoginSuccess(username);
            
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
            <h1>Crear Cuenta R&D</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Correo Electronico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
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
                    {isLoading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
            <p onClick={() => navigate('/login')} style={{ cursor: 'pointer', marginTop: '15px', color: '#61dafb' }}>
                ¿Ya tienes una cuenta? Inicia Sesión
            </p>
        </div>
    );
}

export default RegisterPage;