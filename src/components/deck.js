import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cards } from '../data/cards';
import { deckService } from '../services/deckService'; // ← NUEVO IMPORT
import '../styles/deck.css';

const Deck = ({ currentUser }) => { // ← AGREGAR currentUser como prop
    const [deck, setDeck] = useState([]);
    const [availableCards, setAvailableCards] = useState([]);
    const [heroCard, setHeroCard] = useState(null);
    const [error, setError] = useState('');
    const [savedDecks, setSavedDecks] = useState([]);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [showDeckModal, setShowDeckModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const DECK_MAX_SIZE = 22;

    // Cargar mazos guardados desde el MICROSERVICIO
    useEffect(() => {
        loadSavedDecks();
        setAvailableCards(cards);
    }, [currentUser]); // ← Agregar currentUser como dependencia

    // Cargar mazos guardados desde el MICROSERVICIO
    const loadSavedDecks = async () => {
        if (!currentUser) return;
        
        try {
            setLoading(true);
            const decks = await deckService.getUserDecks(currentUser);
            setSavedDecks(decks);
        } catch (err) {
            setError('Error al cargar mazos: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // ... (MANTENER TODAS TUS FUNCIONES EXISTENTES: countCardInDeck, isHeroCard, calculateCostStats, addCardToDeck, removeCardFromDeck, etc.)

    // MODIFICAR: Guardar el mazo en el MICROSERVICIO
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
            
            // Convertir el mazo a formato para el microservicio
            const cardIds = deck.map(card => card.id);
            
            const newDeck = await deckService.createDeck({
                userId: currentUser,
                deckName: deckName,
                cards: cardIds
            });
            
            // Agregar datos locales para mantener la compatibilidad
            const deckWithLocalData = {
                ...newDeck,
                localData: {
                    hero: heroCard,
                    fullCards: deck // Guardar objetos completos de cartas localmente
                }
            };
            
            setSavedDecks([...savedDecks, deckWithLocalData]);
            alert('¡Mazo guardado exitosamente!');
            setError('');
        } catch (err) {
            setError('Error al guardar mazo: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // MODIFICAR: Eliminar un mazo guardado
    const deleteDeck = async (deckId, event) => {
        event.stopPropagation();
        if (!window.confirm('¿Estás seguro de que quieres eliminar este mazo?')) return;

        try {
            await deckService.deleteDeck(deckId, currentUser);
            const updatedDecks = savedDecks.filter(deck => deck.id !== deckId);
            setSavedDecks(updatedDecks);
        } catch (err) {
            setError('Error al eliminar mazo: ' + err.message);
        }
    };

    // MODIFICAR: Cargar un mazo guardado para editarlo
    const loadDeckForEditing = async (deck) => {
        try {
            // Obtener el mazo completo del microservicio
            const fullDeck = await deckService.getDeck(deck.id, currentUser);
            
            // Reconstruir los objetos completos de cartas desde availableCards
            const fullCards = fullDeck.cards.map(cardId => 
                availableCards.find(card => card.id === cardId)
            ).filter(card => card); // Filtrar cartas no encontradas
            
            const hero = fullCards.find(card => heroCard(card));
            
            setDeck(fullCards);
            setHeroCard(hero || null);
            setShowDeckModal(false);
        } catch (err) {
            setError('Error al cargar mazo: ' + err.message);
        }
    };

    // ... (MANTENER el resto de tus funciones y JSX existente)

    return (
        <div className="deck-builder-container">
            <h1>Constructor de Mazos (Deck Builder)</h1>
            <p>Usuario: {currentUser}</p> {/* ← Mostrar usuario actual */}
            
            {/* ... (MANTENER todo tu JSX existente) */}

            {loading && <p>Cargando...</p>}
            
            <Link to="/" style={{ color: '#61dafb', marginTop: '20px', display: 'block' }}>
                Volver al Home
            </Link>
        </div>
    );
};

export default Deck;