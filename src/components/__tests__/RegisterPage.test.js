/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../RegisterPage'; 
import '@testing-library/jest-dom'; 

// 1. MOCK (SIMULACIÓN) DE LOCALSTORAGE
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; }
  };
})();

// Reemplazamos el objeto global window.localStorage con nuestra versión simulada
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// 2. MOCK (SIMULACIÓN) DEL HOOK useNavigate

jest.mock('react-router-dom');

describe('Pruebas del Componente RegisterPage', () => {
  // Función simulada que pasaremos como prop onLoginSuccess
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    // Limpieza: Se ejecuta antes de cada 'test' para aislar las pruebas.
    localStorage.clear(); 
    jest.spyOn(window, 'alert').mockImplementation(() => {}); // Simula las alertas del navegador
    jest.useFakeTimers(); // Habilita la simulación del tiempo (para setTimeout)
  });

  afterEach(() => {
    // Limpieza: Se ejecuta después de cada 'test'.
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  // Función de ayuda para renderizar el componente dentro del Router
  const renderComponent = () => 
    render(
      <BrowserRouter>
        <RegisterPage onLoginSuccess={mockOnLoginSuccess} />
      </BrowserRouter>
    );

  // Caso de Prueba 1: Registro Exitoso

  test('1. Debería registrar un nuevo usuario, persistir los datos y llamar a onLoginSuccess', async () => {
    renderComponent();

    // 1. INPUT (código de simulación de inputs)
    fireEvent.change(screen.getByPlaceholderText(/Correo Electronico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Usuario/i), { target: { value: 'nuevo_usuario' } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'password123' } });
    
    // 2. ACCIÓN
    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
    jest.advanceTimersByTime(1000); 

    // 4. VERIFICACIÓN (ASSERTS)
    await waitFor(() => {
      
      // I. Verificación de Éxito
      expect(mockOnLoginSuccess).toHaveBeenCalledWith('nuevo_usuario');
      
      // II. Verificación de Persistencia (Manejo de NULL y Parseo)
      const storedJson = localStorage.getItem('users');
      
      // III. Verificación de la Estructura de Datos
      // 1. Verificamos que el valor exista
      expect(storedJson).not.toBeNull(); 
      
      // 2. Parseamos el JSON
      const storedUsers = JSON.parse(storedJson);
      
      // 3. Verificamos que el objeto tenga la clave principal
      expect(storedUsers).toHaveProperty('nuevo_usuario');
      
      // 4. Verificamos la contraseña guardada
      expect(storedUsers['nuevo_usuario'].password).toBe('password123');
    });
  });

  // -------------------------------------------------------------------
  // Caso de Prueba 2: Usuario ya Existente (Fallo por duplicidad)
  // -------------------------------------------------------------------
  test('2. Debería mostrar un error si el nombre de usuario ya existe', async () => {
    // 1. PREPARACIÓN: Colocar un usuario en el localStorage simulado ANTES de renderizar
    localStorage.setItem('users', JSON.stringify({ existente: { email: 'e@x.com', password: '123' } }));
    
    renderComponent();

    // 2. INPUT: Intentar registrar con el mismo nombre que ya existe
    fireEvent.change(screen.getByPlaceholderText(/Usuario/i), { target: { value: 'existente' } }); 
    fireEvent.change(screen.getByPlaceholderText(/Correo Electronico/i), { target: { value: 'otro@ejemplo.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'password123' } });

    // 3. ACCIÓN
    fireEvent.click(screen.getByRole('button', { name: /Registrarse/i }));
    jest.advanceTimersByTime(1000); 

    // 4. VERIFICACIÓN
    await waitFor(() => {
      // Verifica que se muestre el mensaje de error en la pantalla
      expect(screen.getByText(/El usuario ya existe/i)).toBeInTheDocument();
    });
    // Verifica que la función de éxito NO haya sido llamada
    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
  });
});