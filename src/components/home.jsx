import React, { useState, useEffect } from 'react';
import Navbar from './Navbar_home';
import background from '../background/home_background.png';
import '../styles/home_style.css';

const Home = ({currentUser, onLogout, onUsernameChange}) => {
  const [gold, setGold] = useState(0);
  const [missions, setMissions] = useState([]);

  // Cargar datos del usuario al iniciar
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData')) || {
      gold: 100,
      missions: [
        {
          id: 1,
          title: "Gana una partida",
          description: "Consigue tu primera victoria",
          reward: 50,
          progress: 0,
          target: 1,
          completed: false,
          type: "win"
        },
        {
          id: 2,
          title: "Construye un mazo",
          description: "Crea un mazo completo de 22 cartas",
          reward: 30,
          progress: 0,
          target: 1,
          completed: false,
          type: "build_deck"
        },
        {
          id: 3,
          title: "Juega 3 partidas",
          description: "Participa en 3 partidas diferentes",
          reward: 75,
          progress: 0,
          target: 3,
          completed: false,
          type: "play_games"
        },
        {
          id: 4,
          title: "Usa 5 cartas diferentes",
          description: "Juega con 5 cartas únicas en partidas",
          reward: 40,
          progress: 0,
          target: 5,
          completed: false,
          type: "use_cards"
        }
      ]
    };
    
    setGold(userData.gold);
    setMissions(userData.missions);
    
    // Guardar en localStorage si no existe
    if (!localStorage.getItem('userData')) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, []);

  // Función para reclamar recompensa de misión
  const claimReward = (missionId) => {
    const mission = missions.find(m => m.id === missionId);
    if (mission && mission.completed && !mission.claimed) {
      const newGold = gold + mission.reward;
      setGold(newGold);
      
      const updatedMissions = missions.map(m => 
        m.id === missionId ? { ...m, claimed: true } : m
      );
      setMissions(updatedMissions);
      
      // Actualizar localStorage
      const userData = JSON.parse(localStorage.getItem('userData')) || {};
      userData.gold = newGold;
      userData.missions = updatedMissions;
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Actualizar el navbar a través del callback
      if (onUsernameChange) {
        onUsernameChange(currentUser, newGold);
      }
    }
  };

  // Función para actualizar oro (desde el navbar u otros componentes)
  const updateGold = (newGold) => {
    setGold(newGold);
  };

  return (
    <div className='home-container'>
      <Navbar 
        currentUser={currentUser} 
        onLogout={onLogout}
        onUsernameChange={onUsernameChange}
        gold={gold}
        onGoldUpdate={updateGold}
      />
      
      {/* Contenido principal con la imagen de fondo */}
      <div className="home-background" style={{
        backgroundImage: `url(${background})`,
      }}>
        {/* Espacio central libre para futuros contenidos */}
        <div className="home-main-content">
          {/* Aquí puedes agregar más contenido en el futuro */}
        </div>

        {/* Contenedor de misiones en la parte inferior */}
        <div className="missions-container">
          <h3 className="missions-title">Misiones Diarias</h3>
          <div className="missions-grid">
            {missions.map(mission => (
              <div key={mission.id} className={`mission-card ${mission.completed ? 'completed' : ''} ${mission.claimed ? 'claimed' : ''}`}>
                <div className="mission-header">
                  <h4 className="mission-title">{mission.title}</h4>
                  <div className="mission-reward">
                    <span className="gold-icon">🪙</span>
                    <span className="reward-amount">+{mission.reward}</span>
                  </div>
                </div>
                <p className="mission-description">{mission.description}</p>
                <div className="mission-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(mission.progress / mission.target) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {mission.progress}/{mission.target}
                  </span>
                </div>
                <button 
                  className={`claim-btn ${mission.completed && !mission.claimed ? 'available' : ''}`}
                  onClick={() => claimReward(mission.id)}
                  disabled={!mission.completed || mission.claimed}
                >
                  {mission.claimed ? 'Reclamado' : mission.completed ? 'Reclamar' : 'En progreso'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;