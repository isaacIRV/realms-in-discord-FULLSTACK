import React, { useState } from 'react';
import './Navbar_style.css'; 

const Navbar = ({currentUser, onLogout}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = () => {
    setIsModalOpen(false);
    onLogout();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <ul className="navbar-list">
            <li className="navbar-item">Play</li>
            <li className="navbar-item">Mazo</li>
            <li className="navbar-item">Biblioteca</li>
          </ul>

          <button className="user-menu-btn" onClick={toggleModal}>
            <div className="profile-circle">
              <span className="profile-initial">
                {currentUser ? currentUser.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <span className="user-greeting">Hola, {currentUser}</span>
            <span className="dropdown-arrow">▼</span>
          </button>
        </div>
      </nav>

      {/* Modal del perfil del usuario */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header del modal */}
            <div className="modal-header">
              <h2>Perfil de Usuario</h2>
              <button className="close-btn" onClick={toggleModal}>×</button>
            </div>

            {/* Contenido del perfil */}
            <div className="profile-content">
              <div className="profile-image-section">
                <div className="modal-profile-circle">
                  <span className="modal-profile-initial">
                    {currentUser ? currentUser.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <h3 className="modal-username">{currentUser}</h3>
                <p className="user-level">Nivel 15</p>
              </div>

              {/* Barra de experiencia */}
              <div className="experience-section">
                <div className="exp-header">
                  <span>Experiencia</span>
                  <span className="exp-progress">2,450 / 3,000 XP</span>
                </div>
                <div className="exp-bar-container">
                  <div 
                    className="exp-bar-progress" 
                    style={{width: '81.6%'}}
                  ></div>
                </div>
                <div className="exp-next-level">
                  Próximo nivel en 550 XP
                </div>
              </div>

              {/* Estadísticas rápidas */}
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">24</span>
                  <span className="stat-label">Victorias</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">8</span>
                  <span className="stat-label">Derrotas</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">75%</span>
                  <span className="stat-label">Win Rate</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="modal-actions">
                <button className="modal-btn primary">Ver Perfil Completo</button>
                <button className="modal-btn secondary">Configuración</button>
                <button className="modal-btn logout" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;