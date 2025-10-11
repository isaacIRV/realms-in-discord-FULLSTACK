import './App.css';
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import Home from './components/home';
function App() {
  // Verifica si el usuario esta logueado
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Guarda el usuario actual
  const [currentUser, setCurrentUser] = useState(null);

  // Maneja el exito del login
  const handleLoginSuccess = (username) => {
    setCurrentUser(username);
    setIsLoggedIn(true);
  };
  // Para cerrar sesion
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    
  }

  return (
    <div className="App">
      {isLoggedIn ? (
        <Home currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}
   
export default App;
