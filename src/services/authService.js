import config from '../config/env.cfg';
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`http://localhost:3002/api/users/login`, { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Response:', response); 
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const data = await response.json();
    localStorage.setItem('authToken', data.token);
    return data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const register = async (userData) => {
  
    const response = await fetch(`${config.baseUrl}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrar usuario');
    }

    return await response.json();
  }


export const logout = async () => {
    const response = await fetch(`${config.baseUrl}/users/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al cerrar sesión');
    }

    return true;
  } 

// Eliminamos la función getCurrentUser