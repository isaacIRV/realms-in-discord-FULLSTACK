import React from 'react';
import './Navbar_style.css'; 

const Navbar = ({currentUser, onLogout}) => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">Play</li>
        <li className="navbar-item">Mazo</li>
        <li className="navbar-item">Biblioteca</li>
      </ul>

      <div style={{ display: 'flex', alignItems:'center', color: '#ffffffff' }}>
        <span style={{ color: '#fffffff',marginRight: '10px' }}>Hola. {currentUser}</span>
        <button onClick={onLogout} style={{ padding: '5px 10px', cursor: 'pointer' }}>
          Cerrar Sesion
        </button>
      </div>
    </nav>
  );
};

export default Navbar;