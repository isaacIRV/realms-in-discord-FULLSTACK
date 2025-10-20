// App.js - Versión corregida y simplificada

import './styles/index.css';
import './styles/App.css';
import React, { useState } from 'react';
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
    localStorage.setItem('currentUser', username);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // Nueva función para manejar el cambio de nombre de usuario
  const handleUsernameChange = (newUsername) => {
    // Actualizar localStorage
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const userData = users[currentUser];
    
    if (userData) {
      // Eliminar el usuario antiguo y crear el nuevo
      delete users[currentUser];
      users[newUsername] = userData;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Actualizar el usuario actual en localStorage
      localStorage.setItem('currentUser', newUsername);
      
      // Actualizar estado
      setCurrentUser(newUsername);
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/register"
            element={currentUser ? <Navigate to="/" /> : <RegisterPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/"
            element={currentUser ? 
              <Home 
                currentUser={currentUser} 
                onLogout={handleLogout} 
                onUsernameChange={handleUsernameChange} // ← Nueva prop
              /> : 
              <Navigate to="/login" />
            }
          />
          <Route
            path="/library"
            element={currentUser ? 
              <Library 
                currentUser={currentUser} 
                onLogout={handleLogout} 
              /> : 
              <Navigate to="/login" />
            }
          />
          <Route
            path="/deck"
            element={currentUser ? 
              <Deck 
                currentUser={currentUser} 
                onLogout={handleLogout} 
              /> : 
              <Navigate to="/login" />
            }
          />
          <Route
            path="/play"
            element={currentUser ? 
              <Play 
                currentUser={currentUser} 
                onLogout={handleLogout} 
              /> : 
              <Navigate to="/login" />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;