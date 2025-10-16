import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Portada from '../background/Portada_R&D.png';

function RegisterPage({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validacion en el cliente
        if (!username || !password || !email) {
            setError("Por favor, ingresa tu usuario, correo y contraseña.");
            return;
        }

        setError('');
        setLoading(true); // Bloquea el formulario

        // Logica de autenticacion (simulada)
        try {
            // Simula una llamada a la API con tiempo de espera
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Logica de registro
            const users = JSON.parse(localStorage.getItem('users')) || {};

            if (users[username]) {
                setError("El usuario ya existe. Por favor elige otro.");
            } else if (Object.values(users).some(user => user.email === email)) {
                setError("El correo ya esta en uso. Por favor elige otro.");
            } else {
                // Guarda el nuevo usuario
                users[username] = { email, password };
                localStorage.setItem('users', JSON.stringify(users));
                alert("Registro exitoso! Ahora puedes ingresar.");
                onLoginSuccess(username); // Loguea automaticamente despues de registrar
            }
        } catch (err) {
            // Manejo de errores de red
            setError("Error de red. Por favor intenta de nuevo.");
        } finally {
            setLoading(false); // Desbloquea el formulario
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