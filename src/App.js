<<<<<<< Updated upstream
import React from 'react';
=======
import './App.css';
import React, { useState, useEffect} from 'react';
import { BrowserRouter,Routes,Route,Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
>>>>>>> Stashed changes
import Home from './components/home';
import './index.css';

function App() {
<<<<<<< Updated upstream
  return (
    <Home />
  );
}

export default App;
=======
  // Guarda el usuario actual
   const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser'));
  // Verifica si el usuario esta logueado
   const [isLoggedIn, setIsLoggedIn] = useState(!!currentUser);

  // Este useEffect se ejecuta cada vez que 'currentUser' cambia.
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', currentUser);
    } else {
      localStorage.removeItem('currentUser');
    }
    // Sincroniza el estado de isLoggedIn con el de currentUser
    setIsLoggedIn(!!currentUser);
  }, [currentUser]);

  // Maneja el exito del login
  const handleLoginSuccess = (username) => {
    setCurrentUser(username);
  };
  // Para cerrar sesion
  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route 
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/"/>
              ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate to="/"/>
              ) : (
                <RegisterPage onLoginSuccess={handleLoginSuccess}/>
              )
            }
          />
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Home currentUser={currentUser} onLogout={handleLogout}/>
              ) : (
                <Navigate to="/login"/>
              )
            }
          />
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;
>>>>>>> Stashed changes
