import { store } from '../redux/store';
import { logoutAsync } from '../redux/slices/authSlice';


export const _getHeaders = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        store.dispatch(logoutAsync()).then(() => {
            window.location.href = '/login';
        });
        throw new Error('No hay token de autenticación');
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const _handleError = async (method, error) => {
    console.error(`Error in ${method}:`, error);
    
    // Si es un error de autenticación, manejarlo apropiadamente
    if (error.message && (
        error.message.includes('token') ||
        error.message.includes('autenticación') ||
        error.message.includes('sesión') ||
        error.message.includes('401') ||
        error.message.includes('403')
    )) {
        await store.dispatch(logoutAsync());
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Su sesión ha expirado. Por favor, inicie sesión nuevamente.');
    }

    // Personalizar mensajes de error comunes
    let errorMessage = error.message || `Error en ${method}: Ocurrió un error inesperado`;
    if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'No se pudo conectar con el servidor. Por favor, verifique su conexión a internet.';
    } else if (errorMessage.includes('NetworkError')) {
        errorMessage = 'Error de red. Por favor, verifique su conexión a internet.';
    } else if (errorMessage.includes('timeout')) {
        errorMessage = 'La solicitud tardó demasiado tiempo. Por favor, inténtelo nuevamente.';
    }
    
    throw new Error(errorMessage);
};

export const handleUnauthorizedError = async (response) => {
    if (response.status === 401 || response.status === 403) {
        await store.dispatch(logoutAsync());
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    }
    if (!response.ok) {
        const error = await handleApiError(response);
        throw new Error(error.message || `Error ${response.status}: ${response.statusText}`);
    }
    return response;
};

export const handleApiError = async (response) => {
    if (!response.ok) {
        try {
            const error = await response.json();
            let errorMessage = '';
            
            // Manejar diferentes tipos de errores
            if (error.message && typeof error.message === 'string') {
                errorMessage = error.message;
            } else if (error.error && typeof error.error === 'string') {
                errorMessage = error.error;
            } else if (Array.isArray(error.errors)) {
                errorMessage = error.errors.join('. ');
            } else {
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }

            // Personalizar mensajes comunes
            if (response.status === 404) {
                errorMessage = 'El recurso solicitado no fue encontrado';
            } else if (response.status === 400) {
                errorMessage = `Error en la solicitud: ${errorMessage}`;
            } else if (response.status === 500) {
                errorMessage = 'Error interno del servidor. Por favor, inténtelo más tarde';
            }

            throw new Error(errorMessage);
        } catch (e) {
            if (e.message && typeof e.message === 'string') {
                throw e;
            }
            throw new Error(`Error inesperado: ${response.statusText || 'No se pudo completar la solicitud'}`);
        }
    }
    return response.json();
};

export const formatApiUrl = (endpoint) => {
    const baseUrl = (typeof process !== 'undefined' && process.env.REACT_APP_API_URL) || 'http://localhost:3002/api';
    // Asegurar que el endpoint comience con '/' y eliminar duplicados
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${formattedEndpoint}`.replace(/([^:]\/)\/+/g, '$1');
};

export const handleNetworkError = async (error) => {
    if (!navigator.onLine) {
        throw new Error('No hay conexión a internet. Por favor, verifique su conexión y vuelva a intentarlo.');
    }

    // Detectar errores de CORS
    if (error instanceof TypeError && error.message.includes('CORS')) {
        throw new Error('Error de acceso al servidor. Por favor, contacte al administrador.');
    }

    // Detectar errores de timeout
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
        throw new Error('La conexión con el servidor está tardando demasiado. Por favor, inténtelo más tarde.');
    }

    await _handleError('Network', error);
};

export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
    let lastError;
    const baseDelay = delay;

    for (let i = 0; i < maxRetries; i++) {
        try {
            // Agregar un timeout a la solicitud
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('TimeoutError')), 10000); // 10 segundos de timeout
            });
            return await Promise.race([requestFn(), timeoutPromise]);
        } catch (error) {
            lastError = error;
            console.log(`Intento ${i + 1} fallido:`, error.message);

            // No reintentar ciertos tipos de errores
            if (error.message && (
                // Errores de autenticación
                error.message.includes('token') ||
                error.message.includes('autenticación') ||
                error.message.includes('sesión') ||
                // Errores de validación
                error.message.includes('validación') ||
                error.message.includes('400') ||
                // Errores de recurso no encontrado
                error.message.includes('404')
            )) {
                break;
            }

            if (i === maxRetries - 1) break;

            // Retardo exponencial con jitter
            const jitter = Math.random() * 1000;
            const exponentialDelay = baseDelay * Math.pow(2, i) + jitter;
            await new Promise(resolve => setTimeout(resolve, exponentialDelay));
        }
    }

    await _handleError('RetryRequest', lastError);
};

export const validateResponse = (data, schema) => {
    const errors = {};
    Object.keys(schema).forEach(key => {
        if (schema[key].required && !data[key]) {
            errors[key] = `El campo ${key} es requerido`;
        }
        if (schema[key].validate && data[key]) {
            const error = schema[key].validate(data[key]);
            if (error) errors[key] = error;
        }
    });
    return errors;
};

export const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

export const throttle = (fn, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};