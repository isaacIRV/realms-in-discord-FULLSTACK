// Detectar si estamos en desarrollo o producción
const isDevelopment = process.env.NODE_ENV === 'development';

const API_BASE_URL = isDevelopment 
  ? 'http://localhost:8080/api'  // Desarrollo
  : 'http://TU-EC2-IP:8080/api'; // Producción ← CAMBIAR POR TU IP REAL

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
    }
};