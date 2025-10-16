// App.js - Versión corregida y simplificada

import './styles/index.css';
import './styles/App.css';
import React, { useState } from 'react'; // Eliminamos useEffect
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Home from './components/home';
import Library from './components/library';
import Deck from './components/deck';
import Play from './components/play';

function App() {
  
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser'));

  const handleLoginSuccess = (username) => {
    // Cuando el login es exitoso:
    // a) Guardamos el usuario en localStorage para persistir la sesión.
    localStorage.setItem('currentUser', username);
    // b) Actualizamos el estado para que la app reaccione y renderice las rutas protegidas.
    setCurrentUser(username);
  };

  const handleLogout = () => {
    // Al cerrar sesión:
    // a) Limpiamos el localStorage.
    localStorage.removeItem('currentUser');
    // b) Actualizamos el estado a null para volver a la pantalla de login.
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            // 2. Usamos 'currentUser' directamente. Si existe, navega a home.
            element={currentUser ? <Navigate to="/" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/register"
            element={currentUser ? <Navigate to="/" /> : <RegisterPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/"
            // 3. La lógica es la misma para todas las rutas protegidas.
            element={currentUser ? <Home currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/library"
            element={currentUser ? <Library currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/deck"
            element={currentUser ? <Deck currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route
            path="/play"
            element={currentUser ? <Play currentUser={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;