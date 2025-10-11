import React from 'react';
import './Navbar_style.css'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">Play</li>
        <li className="navbar-item">Mazo</li>
        <li className="navbar-item">Biblioteca</li>
      </ul>
    </nav>
  );
};

export default Navbar;