import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cards } from '../data/cards';
import '../styles/deck.css';

const Deck = ({ currentUser }) => {
    const [deck, setDeck] = useState([]);
    const [availableCards, setAvailableCards] = useState([]);
    const [heroCard, setHeroCard] = useState(null);
    const [error, setError] = useState('');
    const [savedDecks, setSavedDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [showDeckModal, setShowDeckModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const DECK_MAX_SIZE = 22;

    // Cargar mazos guardados al inicializar
    useEffect(() => {
        loadSavedDecks();
        setAvailableCards(cards);
    }, [currentUser]);

    // Cargar mazos guardados desde MONGODB
    const loadSavedDecks = async () => {
        if (!currentUser) {
            // Fallback a localStorage si no hay usuario
            const decks = JSON.parse(localStorage.getItem('savedDecks')) || [];
            setSavedDecks(decks);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8081/api/decks/user/${currentUser}`);
            
            if (!response.ok) {
                throw new Error('Error al cargar mazos');
            }
            
            const decksFromAPI = await response.json();
            
            // Convertir los mazos de la API al formato que espera tu UI
            const convertedDecks = decksFromAPI.map(apiDeck => ({
                id: apiDeck.id,
                name: apiDeck.deckName,
                cards: apiDeck.cards.map(cardId => availableCards.find(card => card.id === cardId)).filter(card => card),
                hero: availableCards.find(card => card.id === apiDeck.cards.find(cardId => {
                    const card = availableCards.find(c => c.id === cardId);
                    return card && (card.name.toLowerCase().includes('heroe') || card.name.toLowerCase().includes('héroe'));
                })),
                createdAt: apiDeck.createdAt
            })).filter(deck => deck.cards.length > 0); // Filtrar mazos con cartas válidas
            
            setSavedDecks(convertedDecks);
        } catch (err) {
            console.error('Error cargando mazos:', err);
            // Fallback a localStorage
            const decks = JSON.parse(localStorage.getItem('savedDecks')) || [];
            setSavedDecks(decks);
        } finally {
            setLoading(false);
        }
    };

    // Contar cuántas copias de una carta hay en el mazo
    const countCardInDeck = (cardId) => {
        return deck.filter(card => card.id === cardId).length;
    };

    // Verificar si una carta es un héroe
    const isHeroCard = (card) => {
        return card.name.toLowerCase().includes('heroe') || 
               card.name.toLowerCase().includes('héroe');
    };

    // Calcular distribución de costes y promedio - VERSIÓN MEJORADA
    const calculateCostStats = (deckCards) => {
        const costDistribution = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0
        };
        
        let totalCost = 0;
        let cardCount = 0;

        deckCards.forEach(card => {
            if (!isHeroCard(card)) { // Excluir el héroe del cálculo
                const cost = Math.min(Math.max(1, card.cost), 8); // Agrupar costes >=8 en 8 y asegurar mínimo 1
                costDistribution[cost] = (costDistribution[cost] || 0) + 1;
                totalCost += card.cost;
                cardCount++;
            }
        });

        const averageCost = cardCount > 0 ? (totalCost / cardCount).toFixed(2) : '0.00';
        
        return { costDistribution, averageCost };
    };

    // Agregar una carta al mazo
    const addCardToDeck = (card) => {
        if (isHeroCard(card)) {
            if (heroCard) {
                setError('Ya tienes un héroe en tu mazo. Solo puedes tener uno.');
                return;
            }
            setHeroCard(card);
            setDeck([...deck, card]);
        } else {
            const cardCount = countCardInDeck(card.id);
            if (cardCount >= 3) {
                setError('No puedes tener más de 3 copias de esta carta.');
                return;
            }
            
            if (deck.length >= DECK_MAX_SIZE) {
                setError(`Tu mazo ya tiene ${DECK_MAX_SIZE} cartas. No puedes agregar más.`);
                return;
            }
            
            setDeck([...deck, card]);
        }
        
        setError('');
    };

    // Eliminar una carta del mazo
    const removeCardFromDeck = (cardToRemove, index) => {
        const cardIndex = deck.findIndex((card, i) => 
            card.id === cardToRemove.id && i === index
        );
        
        if (cardIndex !== -1) {
            const newDeck = [...deck];
            newDeck.splice(cardIndex, 1);
            setDeck(newDeck);
            
            if (isHeroCard(cardToRemove) && heroCard && heroCard.id === cardToRemove.id) {
                setHeroCard(null);
            }
        }
        
        setError('');
    };

    // Guardar el mazo EN MONGODB
    const saveDeck = async () => {
        if (deck.length !== DECK_MAX_SIZE) {
            setError(`Tu mazo debe tener exactamente ${DECK_MAX_SIZE} cartas. Actualmente tienes ${deck.length}.`);
            return;
        }
        
        if (!heroCard) {
            setError('Tu mazo debe tener exactamente 1 héroe.');
            return;
        }

        const deckName = prompt('Ingresa un nombre para tu mazo:', `Mazo ${savedDecks.length + 1}`);
        if (!deckName) return;

        try {
            setLoading(true);
            
            // Convertir el mazo a IDs para MongoDB
            const cardIds = deck.map(card => card.id);
            
            // Guardar en MongoDB
            const response = await fetch('http://localhost:8081/api/decks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': currentUser
                },
                body: JSON.stringify({
                    userId: currentUser,
                    deckName: deckName,
                    cards: cardIds
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar mazo');
            }
            
            const newDeckFromAPI = await response.json();
            
            // Crear objeto para la UI local
            const newDeckForUI = {
                id: newDeckFromAPI.id,
                name: newDeckFromAPI.deckName,
                cards: deck, // Mantener objetos completos localmente
                hero: heroCard,
                createdAt: newDeckFromAPI.createdAt
            };
            
            // Actualizar estado local
            setSavedDecks([...savedDecks, newDeckForUI]);
            
            // También guardar en localStorage como backup
            const currentLocalDecks = JSON.parse(localStorage.getItem('savedDecks')) || [];
            localStorage.setItem('savedDecks', JSON.stringify([...currentLocalDecks, newDeckForUI]));
            
            alert('¡Mazo guardado exitosamente en la nube!');
            setError('');
            
        } catch (err) {
            console.error('Error guardando en MongoDB:', err);
            
            // FALLBACK: Guardar solo en localStorage
            const currentSavedDecks = JSON.parse(localStorage.getItem('savedDecks')) || [];
            const newDeck = {
                id: Date.now(),
                name: deckName,
                cards: [...deck],
                hero: heroCard,
                createdAt: new Date().toISOString()
            };
            
            const updatedDecks = [...currentSavedDecks, newDeck];
            localStorage.setItem('savedDecks', JSON.stringify(updatedDecks));
            setSavedDecks(updatedDecks);
            
            alert('¡Mazo guardado localmente! (Error de conexión con la nube)');
            setError('');
        } finally {
            setLoading(false);
        }
    };

    // Mostrar detalles de un mazo guardado
    const viewDeckDetails = (deck) => {
        setSelectedDeck(deck);
        setShowDeckModal(true);
    };

    // Eliminar un mazo guardado DE MONGODB
    const deleteDeck = async (deckId, event) => {
        event.stopPropagation();
        if (!window.confirm('¿Estás seguro de que quieres eliminar este mazo?')) return;

        try {
            // Eliminar de MongoDB
            if (currentUser) {
                const response = await fetch(`http://localhost:8081/api/decks/${deckId}`, {
                    method: 'DELETE',
                    headers: {
                        'userId': currentUser
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Error al eliminar mazo de la nube');
                }
            }
            
            // Eliminar localmente
            const updatedDecks = savedDecks.filter(deck => deck.id !== deckId);
            setSavedDecks(updatedDecks);
            
            // Actualizar localStorage
            localStorage.setItem('savedDecks', JSON.stringify(updatedDecks));
            
        } catch (err) {
            console.error('Error eliminando mazo:', err);
            // Solo eliminar localmente si falla la API
            const updatedDecks = savedDecks.filter(deck => deck.id !== deckId);
            setSavedDecks(updatedDecks);
            localStorage.setItem('savedDecks', JSON.stringify(updatedDecks));
        }
    };

    // Cargar un mazo guardado para editarlo
    const loadDeckForEditing = (deck) => {
        setDeck(deck.cards);
        setHeroCard(deck.hero);
        setShowDeckModal(false);
    };

    // Limpiar el mazo
    const clearDeck = () => {
        setDeck([]);
        setHeroCard(null);
        setError('');
    };

    // Cerrar modal
    const closeModal = () => {
        setShowDeckModal(false);
        setSelectedDeck(null);
    };

    // Renderizar gráfico de costes - VERSIÓN COMPLETAMENTE CORREGIDA
    const renderCostChart = (deckCards) => {
        const { costDistribution, averageCost } = calculateCostStats(deckCards);
        const maxCount = Math.max(...Object.values(costDistribution));
        
        // Altura máxima para las barras (en porcentaje)
        const maxBarHeight = 100;
        
        return (
            <div className="cost-chart">
                <h4>Distribución de Costes</h4>
                <p className="average-cost">Coste Promedio: <strong>{averageCost}</strong></p>
                <div className="chart-bars">
                    {Object.entries(costDistribution).map(([cost, count]) => {
                        // Calcular altura basada en el conteo máximo
                        const height = maxCount > 0 ? (count / maxCount) * maxBarHeight : 0;
                        
                        return (
                            <div key={cost} className="chart-bar-container">
                                <div className="chart-bar-label">{cost}{cost === '8' ? '+' : ''}</div>
                                <div className="chart-bar">
                                    <div 
                                        className="chart-bar-fill"
                                        style={{ 
                                            height: `${height}%`,
                                            minHeight: count > 0 ? '5px' : '0px'
                                        }}
                                    ></div>
                                </div>
                                <div className="chart-bar-count">{count}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="deck-builder-container">
            <h1>Constructor de Mazos (Deck Builder)</h1>
            <p>Usuario: {currentUser}</p>
            
            {/* Información del mazo actual */}
            <div className="deck-info">
                <h2>Tu Mazo Actual</h2>
                <div className="deck-stats">
                    <p>Cartas en el mazo: {deck.length}/{DECK_MAX_SIZE}</p>
                    <p>Héroe: {heroCard ? heroCard.name : 'No seleccionado'}</p>
                    <div className="deck-actions">
                        <button 
                            className="save-btn" 
                            onClick={saveDeck}
                            disabled={deck.length !== DECK_MAX_SIZE || !heroCard || loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Mazo (Nube)'}
                        </button>
                        <button className="clear-btn" onClick={clearDeck}>
                            Limpiar Mazo
                        </button>
                    </div>
                </div>
                
                {error && <p className="error-message">{error}</p>}
                {loading && <p className="loading-message">Conectando con la nube...</p>}
                
                {/* Lista de cartas en el mazo */}
                <div className="deck-cards">
                    <h3>Cartas en tu mazo:</h3>
                    {deck.length === 0 ? (
                        <p>Tu mazo está vacío. Agrega cartas desde la biblioteca.</p>
                    ) : (
                        <div className="deck-cards-list">
                            {deck.map((card, index) => (
                                <div key={`${card.id}-${index}`} className="deck-card-item">
                                    <div className="deck-card-info">
                                        <span className="card-name">{card.name}</span>
                                        <span className="card-cost">Coste: {card.cost}</span>
                                        {isHeroCard(card) && <span className="hero-badge">HÉROE</span>}
                                    </div>
                                    <button 
                                        className="remove-btn"
                                        onClick={() => removeCardFromDeck(card, index)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Mazos Guardados */}
            <div className="saved-decks-section">
                <h2>Mazos Guardados</h2>
                {savedDecks.length === 0 ? (
                    <p className="no-decks-message">No tienes mazos guardados todavía.</p>
                ) : (
                    <div className="saved-decks-grid">
                        {savedDecks.map(deck => (
                            <div 
                                key={deck.id} 
                                className="saved-deck-card"
                                onClick={() => viewDeckDetails(deck)}
                            >
                                <div className="saved-deck-header">
                                    <h3 className="saved-deck-name">{deck.name}</h3>
                                    <button 
                                        className="delete-deck-btn"
                                        onClick={(e) => deleteDeck(deck.id, e)}
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="saved-deck-info">
                                    <p>Héroe: {deck.hero.name}</p>
                                    <p>Total de cartas: {deck.cards.length}</p>
                                    <p>Creado: {new Date(deck.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Biblioteca de cartas disponibles */}
            <div className="cards-library">
                <h2>Biblioteca de Cartas</h2>
                <div className="cards-grid">
                    {availableCards.map(card => (
                        <div 
                            key={card.id} 
                            className={`card-item ${isHeroCard(card) ? 'hero-card' : ''}`}
                            onClick={() => addCardToDeck(card)}
                        >
                            <img src={card.image} alt={card.name} className="card-image" />
                            <div className="card-info">
                                <h3 className="card-name">{card.name}</h3>
                                <div className="card-stats">
                                    <span className="card-cost">Coste: {card.cost}</span>
                                    <span className="card-attack">Ataque: {card.attack}</span>
                                    <span className="card-health">Salud: {card.health}</span>
                                </div>
                                <p className="card-description">{card.description}</p>
                                <span className="card-faction">{card.faction}</span>
                                <div className="card-count">
                                    En tu mazo: {countCardInDeck(card.id)}
                                    {countCardInDeck(card.id) >= 3 && !isHeroCard(card) && 
                                        <span className="max-copies"> (MÁXIMO)</span>
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de detalles del mazo */}
            {showDeckModal && selectedDeck && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedDeck.name}</h2>
                            <button className="close-modal-btn" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="deck-hero-info">
                                <h3>Héroe del Mazo</h3>
                                <div className="hero-card-display">
                                    <strong>{selectedDeck.hero.name}</strong> - Coste: {selectedDeck.hero.cost}
                                </div>
                            </div>
                            
                            {/* Gráfico de distribución de costes */}
                            {renderCostChart(selectedDeck.cards)}
                            
                            <div className="deck-cards-list-modal">
                                <h3>Lista de Cartas ({selectedDeck.cards.length} cartas)</h3>
                                <div className="cards-table">
                                    <div className="table-header">
                                        <span>Nombre</span>
                                        <span>Coste</span>
                                        <span>Tipo</span>
                                    </div>
                                    {selectedDeck.cards.map((card, index) => (
                                        <div 
                                            key={`${card.id}-${index}`} 
                                            className={`table-row ${isHeroCard(card) ? 'hero-row' : ''}`}
                                            style={{
                                                '--card-image': `url(${card.image})`
                                            }}
                                        >
                                            <span className="card-name">{card.name}</span>
                                            <span className="card-cost">{card.cost}</span>
                                            <span className="card-type">
                                                {isHeroCard(card) ? 'Héroe' : 'Tropa'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="modal-actions">
                                <button 
                                    className="load-deck-btn"
                                    onClick={() => loadDeckForEditing(selectedDeck)}
                                >
                                    Cargar para Editar
                                </button>
                                <button className="close-btn" onClick={closeModal}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <Link to="/" style={{ color: '#61dafb', marginTop: '20px', display: 'block' }}>
                Volver al Home
            </Link>
        </div>
    );
};

export default Deck;