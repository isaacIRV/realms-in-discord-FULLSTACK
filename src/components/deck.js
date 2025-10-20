import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cards } from '../data/cards';
import '../styles/deck.css';

const Deck = () => {
    const [deck, setDeck] = useState([]);
    const [availableCards, setAvailableCards] = useState([]);
    const [heroCard, setHeroCard] = useState(null);
    const [error, setError] = useState('');
    const [savedDecks, setSavedDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [showDeckModal, setShowDeckModal] = useState(false);
    const DECK_MAX_SIZE = 22;

    // Cargar mazos guardados al inicializar
    useEffect(() => {
        loadSavedDecks();
        setAvailableCards(cards);
    }, []);

    // Cargar mazos guardados desde localStorage
    const loadSavedDecks = () => {
        const decks = JSON.parse(localStorage.getItem('savedDecks')) || [];
        setSavedDecks(decks);
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

    // Guardar el mazo
    const saveDeck = () => {
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

        // CORRECCIÓN: Usar el estado actual de savedDecks en lugar de redeclararlo
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
        
        alert('¡Mazo guardado exitosamente!');
        setError('');
        loadSavedDecks(); // Recargar la lista de mazos
    };

    // Mostrar detalles de un mazo guardado
    const viewDeckDetails = (deck) => {
        setSelectedDeck(deck);
        setShowDeckModal(true);
    };

    // Eliminar un mazo guardado
    const deleteDeck = (deckId, event) => {
        event.stopPropagation(); // Evitar que se active el viewDeckDetails
        if (window.confirm('¿Estás seguro de que quieres eliminar este mazo?')) {
            const updatedDecks = savedDecks.filter(deck => deck.id !== deckId);
            localStorage.setItem('savedDecks', JSON.stringify(updatedDecks));
            setSavedDecks(updatedDecks);
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

    return (
        <div className="deck-builder-container">
            <h1>Constructor de Mazos (Deck Builder)</h1>
            <p>Aquí diseñarás tu estrategia.</p>
            
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
                            disabled={deck.length !== DECK_MAX_SIZE || !heroCard}
                        >
                            Guardar Mazo
                        </button>
                        <button className="clear-btn" onClick={clearDeck}>
                            Limpiar Mazo
                        </button>
                    </div>
                </div>
                
                {error && <p className="error-message">{error}</p>}
                
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
                            
                            <div className="deck-cards-list-modal">
                                <h3>Lista de Cartas ({selectedDeck.cards.length} cartas)</h3>
                                <div className="cards-table">
                                    <div className="table-header">
                                        <span>Nombre</span>
                                        <span>Coste</span>
                                        <span>Tipo</span>
                                    </div>
                                    {selectedDeck.cards.map((card, index) => (
                                        <div key={`${card.id}-${index}`} className="table-row">
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