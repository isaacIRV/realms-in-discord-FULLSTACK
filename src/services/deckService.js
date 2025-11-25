// src/services/deckService.js
const getDeckApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // Si estamos en desarrollo local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8081/api/decks';
  }
  
  // Si estamos en S3 (producción) - conectar a EC2
  return 'http://98.95.11.209:8081/api/decks';  // ← NUEVA IP
};

const DECK_API_BASE_URL = getDeckApiBaseUrl();

export const deckService = {
    // Obtener todos los mazos de un usuario
    async getUserDecks(userId) {
        const response = await fetch(`${DECK_API_BASE_URL}/user/${userId}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener mazos');
        }
        
        return await response.json();
    },

    // Obtener un mazo específico
    async getDeck(deckId, userId) {
        const response = await fetch(`${DECK_API_BASE_URL}/${deckId}`, {
            headers: {
                'userId': userId
            }
        });
        
        if (!response.ok) {
            throw new Error('Error al obtener el mazo');
        }
        
        return await response.json();
    },

    // Crear nuevo mazo
    async createDeck(deckData) {
        const response = await fetch(`${DECK_API_BASE_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deckData),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al crear mazo');
        }
        
        return await response.json();
    },

    // Actualizar mazo
    async updateDeck(deckId, userId, updates) {
        const response = await fetch(`${DECK_API_BASE_URL}/${deckId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'userId': userId
            },
            body: JSON.stringify(updates),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al actualizar mazo');
        }
        
        return await response.json();
    },

    // Eliminar mazo
    async deleteDeck(deckId, userId) {
        const response = await fetch(`${DECK_API_BASE_URL}/${deckId}`, {
            method: 'DELETE',
            headers: {
                'userId': userId
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al eliminar mazo');
        }
        
        return await response.json();
    },

    // Agregar carta al mazo
    async addCardToDeck(deckId, cardId, userId) {
        const response = await fetch(`${DECK_API_BASE_URL}/${deckId}/cards/${cardId}`, {
            method: 'POST',
            headers: {
                'userId': userId
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al agregar carta');
        }
        
        return await response.json();
    },

    // Remover carta del mazo
    async removeCardFromDeck(deckId, cardId, userId) {
        const response = await fetch(`${DECK_API_BASE_URL}/${deckId}/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                'userId': userId
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al remover carta');
        }
        
        return await response.json();
    }
};