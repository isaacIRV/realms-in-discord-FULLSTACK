import React from 'react';
import Navbar from './Navbar_home';
import background from '../background/home_background.png';
import '../styles/home_style.css';

const Home = ({currentUser, onLogout, onUsernameChange}) => {
  return (
    <div className='home-container' style={{
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      width: '100vw'
    }}>
      <Navbar 
        currentUser={currentUser} 
        onLogout={onLogout}
        onUsernameChange={onUsernameChange} // ← Agregar esta prop
      />
      
      {/* Contenido principal con la imagen de fondo */}
      <div style={{
        backgroundImage: `url(${background})`, // Usa la variable importada
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: 'calc(100vh - 60px)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white'
      }}>
        <h1>Bienvenido, {currentUser}!</h1>
        <p>Contenido de tu aplicación</p>
      </div>
    </div>
  );
};

export default Home;