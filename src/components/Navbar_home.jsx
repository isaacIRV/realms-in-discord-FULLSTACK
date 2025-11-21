import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar_style.css'; 
import { apiService } from '../services/api'; // ← AGREGAR IMPORT

const Navbar = ({currentUser, onLogout, onUsernameChange, gold = 0, onGoldUpdate}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUser || '');
  const [usernameError, setUsernameError] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' o 'history'
  const [isUpdating, setIsUpdating] = useState(false); // ← NUEVO ESTADO

  // Datos de ejemplo para el historial de partidas
  const matchHistory = [
    {
      id: 1,
      result: 'win',
      userDeck: 'Mazo Solar',
      opponent: 'DarkMage23',
      opponentDeck: 'Sombras Nocturnas',
      duration: '12:45',
      date: '2024-01-15'
    },
    {
      id: 2,
      result: 'lose',
      userDeck: 'Mazo Solar',
      opponent: 'IceQueen',
      opponentDeck: 'Congelación Eterna',
      duration: '18:32',
      date: '2024-01-14'
    },
    {
      id: 3,
      result: 'draw',
      userDeck: 'Mazo Real',
      opponent: 'ThunderKing',
      opponentDeck: 'Tormenta Eléctrica',
      duration: '25:17',
      date: '2024-01-13'
    },
    {
      id: 4,
      result: 'win',
      userDeck: 'Mazo Real',
      opponent: 'FireDragon',
      opponentDeck: 'Llama Ancestral',
      duration: '08:21',
      date: '2024-01-12'
    },
    {
      id: 5,
      result: 'win',
      userDeck: 'Mazo Solar',
      opponent: 'EarthGuardian',
      opponentDeck: 'Defensas Naturales',
      duration: '15:43',
      date: '2024-01-11'
    },
    {
      id: 6,
      result: 'lose',
      userDeck: 'Mazo Real',
      opponent: 'WindRider',
      opponentDeck: 'Vientos Veloces',
      duration: '22:08',
      date: '2024-01-10'
    },
    {
      id: 7,
      result: 'win',
      userDeck: 'Mazo Solar',
      opponent: 'WaterSpirit',
      opponentDeck: 'Olas Profundas',
      duration: '11:29',
      date: '2024-01-09'
    }
  ];

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setIsEditingUsername(false);
    setUsernameError('');
    setNewUsername(currentUser || '');
    setActiveTab('profile');
    setIsUpdating(false); // ← RESETEAR ESTADO
  };

  const handleLogout = () => {
    setIsModalOpen(false);
    onLogout();
  };

  const handleEditUsername = () => {
    setIsEditingUsername(true);
  };

  // FUNCIÓN ACTUALIZADA PARA GUARDAR USERNAME
  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      setUsernameError('El nombre de usuario no puede estar vacío');
      return;
    }

    if (newUsername.length < 3) {
      setUsernameError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    if (newUsername.length > 20) {
      setUsernameError('El nombre de usuario no puede tener más de 20 caracteres');
      return;
    }

    setIsUpdating(true);
    setUsernameError('');

    try {
      // Llamar a la función del padre que se comunica con el backend
      await onUsernameChange(newUsername.trim());

      setIsEditingUsername(false);
      setUsernameError('');
      
    } catch (error) {
      setUsernameError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingUsername(false);
    setNewUsername(currentUser || '');
    setUsernameError('');
    setIsUpdating(false);
  };

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
    if (usernameError) {
      setUsernameError('');
    }
  };

  const getResultBadge = (result) => {
    const badges = {
      win: { text: 'VICTORIA', class: 'result-badge win' },
      lose: { text: 'DERROTA', class: 'result-badge lose' },
      draw: { text: 'EMPATE', class: 'result-badge draw' }
    };
    return badges[result] || badges.draw;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <ul className="navbar-list">
            <li className="navbar-item">
              <Link to="/home">Play</Link>
            </li>
            <li className="navbar-item">
              <Link to="/deck">Mazo</Link>
            </li>
            <li className="navbar-item">
              <Link to="/library">Cartas</Link>
            </li>
          </ul>

          <button className="user-menu-btn" onClick={toggleModal}>
            <div className="profile-circle">
              <span className="profile-initial">
                {currentUser ? currentUser.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="user-info">
              <span className="user-greeting">Hola, {currentUser}</span>
              <div className="gold-display">
                <span className="gold-icon">🪙</span>
                <span className="gold-amount">{gold}</span>
              </div>
            </div>
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

            {/* Tabs de navegación */}
            <div className="modal-tabs">
              <button 
                className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                Perfil
              </button>
              <button 
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                Historial de Partidas
              </button>
            </div>

            {/* Contenido del perfil */}
            <div className="modal-body-scrollable">
              {activeTab === 'profile' ? (
                <div className="profile-content">
                  <div className="profile-image-section">
                    <div className="modal-profile-circle">
                      <span className="modal-profile-initial">
                        {currentUser ? currentUser.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    
                    {isEditingUsername ? (
                      <div className="username-edit-section">
                        <input
                          type="text"
                          value={newUsername}
                          onChange={handleUsernameChange}
                          className="username-input"
                          placeholder="Nuevo nombre de usuario"
                          maxLength={20}
                          autoFocus
                          disabled={isUpdating}
                        />
                        {usernameError && (
                          <p className="username-error">{usernameError}</p>
                        )}
                        <div className="username-edit-actions">
                          <button 
                            className="modal-btn primary save-username-btn"
                            onClick={handleSaveUsername}
                            disabled={isUpdating}
                          >
                            {isUpdating ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button 
                            className="modal-btn secondary"
                            onClick={handleCancelEdit}
                            disabled={isUpdating}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="modal-username">{currentUser}</h3>
                        <div className="user-gold-display">
                          <span className="gold-icon">🪙</span>
                          <span className="gold-amount-large">{gold} Oro</span>
                        </div>
                        <p className="user-level">Nivel 15</p>
                        <button 
                          className="edit-username-btn"
                          onClick={handleEditUsername}
                        >
                          ✏️ Cambiar nombre
                        </button>
                      </>
                    )}
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
                      <span className="stat-value">3</span>
                      <span className="stat-label">Empates</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="modal-actions">
                    <button className="modal-btn primary">Ver Perfil Completo</button>
                    <button className="modal-btn logout" onClick={handleLogout}>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                /* Historial de partidas */
                <div className="match-history-content">
                  <h3 className="history-title">Historial de Partidas</h3>
                  <div className="matches-stats">
                    <div className="match-stat">
                      <span className="match-stat-value">{matchHistory.filter(m => m.result === 'win').length}</span>
                      <span className="match-stat-label">Victorias</span>
                    </div>
                    <div className="match-stat">
                      <span className="match-stat-value">{matchHistory.filter(m => m.result === 'lose').length}</span>
                      <span className="match-stat-label">Derrotas</span>
                    </div>
                    <div className="match-stat">
                      <span className="match-stat-value">{matchHistory.filter(m => m.result === 'draw').length}</span>
                      <span className="match-stat-label">Empates</span>
                    </div>
                    <div className="match-stat">
                      <span className="match-stat-value">{matchHistory.length}</span>
                      <span className="match-stat-label">Total</span>
                    </div>
                  </div>

                  <div className="matches-list">
                    {matchHistory.map(match => {
                      const resultBadge = getResultBadge(match.result);
                      return (
                        <div key={match.id} className="match-item">
                          <div className="match-header">
                            <span className={resultBadge.class}>
                              {resultBadge.text}
                            </span>
                            <span className="match-date">
                              {formatDate(match.date)}
                            </span>
                          </div>
                          <div className="match-details">
                            <div className="match-player">
                              <strong>{currentUser}</strong>
                              <span className="deck-name">{match.userDeck}</span>
                            </div>
                            <div className="match-vs">VS</div>
                            <div className="match-opponent">
                              <strong>{match.opponent}</strong>
                              <span className="deck-name">{match.opponentDeck}</span>
                            </div>
                          </div>
                          <div className="match-footer">
                            <span className="match-duration">
                              ⏱️ {match.duration}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;