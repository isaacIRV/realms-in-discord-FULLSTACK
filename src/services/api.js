// Detectar si estamos en desarrollo o producción
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  
  // Si estamos en desarrollo local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8080/api';
  }
  
  // Si estamos en S3 (producción) - conectar a EC2
  return 'http://98.95.11.209:8080/api';
};

const API_BASE_URL = getApiBaseUrl();

export const apiService = {
    async login(credentials) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en el login');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    },

    async register(userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en el registro');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    },

    async getUserProfile(username) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${username}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener perfil');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error obteniendo perfil:', error);
            throw error;
        }
    },

    async updateUser(username, userData) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar usuario');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error actualizando usuario:', error);
            throw error;
        }
    },

    async getUserDecks(userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/decks/user/${userId}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener mazos');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error obteniendo mazos:', error);
            throw error;
        }
    },

    async createDeck(deckData) {
        try {
            const response = await fetch(`${API_BASE_URL}/decks`, {
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
        } catch (error) {
            console.error('Error creando mazo:', error);
            throw error;
        }
    },

    async updateDeck(deckId, userId, deckData) {
        try {
            const response = await fetch(`${API_BASE_URL}/decks/${deckId}?userId=${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(deckData),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar mazo');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error actualizando mazo:', error);
            throw error;
        }
    },

    async deleteDeck(deckId, userId) {
        try {
            const response = await fetch(`${API_BASE_URL}/decks/${deckId}?userId=${userId}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar mazo');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error eliminando mazo:', error);
            throw error;
        }
    }
};