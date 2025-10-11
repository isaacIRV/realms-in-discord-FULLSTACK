import React, { useState } from 'react';

function LoginPage({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();


        // Validacion en el cliente
        if (!username || !password) 
            {setError("Porfavor, Ingresa tu usuario y contraseña");
            return;
            }

    setError("");
    setLoading(true); //Bloquea el formulario


        // Logica de autenticacion (simulada)

        try {
            // Simula una llamada a la API con tiempo de espera
            await new Promise((resolve) => setTimeout(resolve, 1000)); 
            // Simula la respuesta de la API
            if (username === 'admin' && password === 'admin') {
                // Autenticacion exitosa, llama a la funcion del componente padre
                onLoginSuccess(username);
            }else {
                setError("Usuario o contraseña incorrecta");
            }
        } catch (err) {
            // Manejo de errores de red
            setError("Error de red. Porfavor intenta de nuevo.");
        } finally {
            setLoading(false); // Desbloquea el formulario
        }
    };

    return (
        <div className="login-container">
            <h1>Realms in Discord</h1>
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

                {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
}   

export default LoginPage;
