/**
 * @fileoverview Configuración de la API y constantes globales para la aplicación Secretary
 * @version 1.0.0
 * @license MIT
 */

/**
 * Configuración del servidor
 * @constant {string}
 */
const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:3002';
const API_BASE = `${API_HOST}/api`;



/**
 * Formatos de fecha y hora utilizados en la aplicación
 * @constant {Object}
 * @property {string} DISPLAY - Formato para mostrar fechas (DD/MM/YYYY)
 * @property {string} API - Formato para envío a la API (YYYY-MM-DD)
 * @property {string} TIME - Formato para horas (HH:mm)
 */
const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  TIME: 'HH:mm'
};

/**
 * Configuración de paginación por defecto
 * @constant {Object}
 * @property {number} DEFAULT_PAGE - Página inicial
 * @property {number} DEFAULT_LIMIT - Límite de elementos por página
 * @property {number} MAX_LIMIT - Límite máximo de elementos por página
 */
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50
};

/**
 * Configuración de timeouts (en milisegundos)
 * @constant {Object} TIMEOUTS
 * @property {number} default - Timeout por defecto (10 segundos)
 * @property {number} auth - Timeout para operaciones de autenticación (5 segundos)
 * @property {number} upload - Timeout para subida de archivos (30 segundos)
 * @property {number} search - Timeout para búsquedas y filtrados (15 segundos)
 */
const TIMEOUTS = {
  default: 10000,    // 10 seconds - timeout por defecto
  auth: 5000,        // 5 seconds - operaciones de autenticación
  upload: 30000,     // 30 seconds - subida de archivos
  search: 15000      // 15 seconds - búsquedas y filtrados
};

/**
 * Configuración principal de la aplicación
 * @constant {Object} config
 * @property {string} baseUrl - URL base de la API
 * @property {Object} auth - Endpoints de autenticación
 * @property {Object} timeouts - Configuración de timeouts
 * @property {Object} constants - Constantes de la aplicación
 * @property {Object} storage - Claves para almacenamiento local
 * @property {Object} responseCodes - Códigos de respuesta HTTP
 * @property {Object} defaultMessages - Mensajes de error por defecto
 */
const config = {
  // API Base URL
  baseUrl: API_BASE,
  
  // Auth endpoints
  auth: {
    login: `${API_BASE}/users/login`,
    register: `${API_BASE}/users/register`,
    logout: `${API_BASE}/users/logout`
  },



  // Request timeouts
  timeouts: TIMEOUTS,

  // Constantes de la aplicación
  constants: {
    dateFormats: DATE_FORMATS,
    pagination: PAGINATION
  },

  // Local storage keys
  storage: {
    token: 'secretary_auth_token',
    user: 'secretary_user_data',
    theme: 'secretary_theme',
    preferences: 'secretary_preferences'
  },

  // API response codes y mensajes por defecto
  responseCodes: {
    success: 200,
    created: 201,
    noContent: 204,
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    tooManyRequests: 429,
    serverError: 500
  },

  // Mensajes de error por defecto
  defaultMessages: {
    networkError: 'No se pudo conectar con el servidor. Por favor, verifique su conexión a internet',
    serverError: 'Error interno del servidor. Por favor, inténtelo más tarde',
    unauthorized: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente',
    validationError: 'Por favor, verifique los datos ingresados',
    notFound: 'El recurso solicitado no fue encontrado',
    corsError: 'Error de acceso al servidor. Por favor, contacte al administrador',
    defaultError: 'Ocurrió un error. Por favor, inténtelo nuevamente',
    urlError: {
      invalid: 'URL inválida para la solicitud',
      missingParams: (params) => `Faltan parámetros requeridos en la URL: ${params}`,
      invalidParam: (param) => `Valor inválido para el parámetro: ${param}`
    }
  },

  // Configuración de CORS
  cors: {
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true'
    }
  }
};

/**
 * Valida un valor de timeout
 * @param {number} timeout - Valor de timeout a validar
 * @param {string} name - Nombre del timeout para mensajes de error
 * @throws {Error} Si el timeout no es válido
 * @private
 */
const validateTimeout = (timeout, name) => {
  if (typeof timeout !== 'number') {
    throw new Error(`Timeout inválido para ${name}: debe ser un número`);
  }
  if (timeout <= 0) {
    throw new Error(`Timeout inválido para ${name}: debe ser mayor a 0`);
  }
  if (timeout > 60000) { // Máximo 1 minuto
    throw new Error(`Timeout inválido para ${name}: no puede ser mayor a 60 segundos`);
  }
};

/**
 * Valida que la configuración tenga todos los valores requeridos y sean válidos
 * @throws {Error} Si falta alguna configuración requerida o hay valores inválidos
 * @private
 */
const validateConfig = () => {
  const required = [
    'baseUrl',
    'auth.login',
    'auth.register',
    'auth.logout',
    'timeouts.default',
    'storage.token',
    'storage.user'
  ];

  // Validar configuración requerida
  for (const path of required) {
    const value = path.split('.').reduce((obj, key) => obj?.[key], config);
    if (value === undefined) {
      throw new Error(`Configuración requerida no encontrada: ${path}`);
    }
  }

  // Validar timeouts
  Object.entries(TIMEOUTS).forEach(([name, value]) => {
    try {
      validateTimeout(value, name);
    } catch (error) {
      console.error(`Error al validar timeout ${name}:`, error.message);
      throw error;
    }
  });

  // Validar que existan todos los timeouts necesarios
  const requiredTimeouts = ['default', 'auth', 'appointment'];
  requiredTimeouts.forEach(name => {
    if (!TIMEOUTS[name]) {
      throw new Error(`Timeout requerido no encontrado: ${name}`);
    }
  });
};

// Validar la configuración al cargar el módulo
validateConfig();

/**
 * Realiza una petición HTTP con timeout y manejo de parámetros en la URL
 * @param {string} url - URL de la solicitud, puede contener parámetros en formato :paramName
 * @param {Object} options - Opciones de fetch y configuración adicional
 * @param {Object} [options.params] - Parámetros para reemplazar en la URL (e.g., { id: '123' } para '/api/:id')
 * @param {Object} [options.headers] - Cabeceras HTTP adicionales
 * @param {string} [options.method='GET'] - Método HTTP
 * @param {number} [timeout] - Timeout en milisegundos, usa el valor por defecto si no se especifica
 * @returns {Promise<Response>} Respuesta de la solicitud
 * @throws {Error} Si la URL es inválida
 * @throws {Error} Si faltan parámetros requeridos en la URL
 * @throws {Error} Si la solicitud excede el timeout
 * @throws {Error} Si hay errores de red o CORS
 */
export const fetchWithTimeout = async (url, options = {}, timeout = null) => {
  // Validar URL y procesar parámetros si existen
  if (!url || typeof url !== 'string') {
    throw new Error(config.defaultMessages.urlError.invalid);
  }

  // Procesar parámetros de URL si existen
  let finalUrl = url;
  if (options.params) {
    try {
      finalUrl = replaceUrlParams(url, options.params);
      // Remover params del objeto options para evitar conflictos con fetch
      const { params, ...restOptions } = options;
      options = restOptions;
    } catch (error) {
      // Propagar el error de validación de parámetros
      throw new Error(`Error en los parámetros de la URL: ${error.message}`);
    }
  }

  // Validar y configurar el timeout
  const actualTimeout = timeout || TIMEOUTS.default;
  try {
    validateTimeout(actualTimeout, 'request');
  } catch (error) {
    console.warn('Timeout inválido, usando timeout por defecto:', error.message);
  }

  // Configurar el controlador de abort
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), actualTimeout);

  try {
    // Configurar headers y opciones por defecto
    const headers = {
      ...config.cors.headers,
      'X-Client-Timeout': actualTimeout.toString(),
      ...options.headers
    };

    // Realizar la petición
    const response = await fetch(finalUrl, {
      ...options,
      signal: controller.signal,
      headers,
      credentials: config.cors.credentials,
      mode: config.cors.mode
    });

    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);

    // Determinar el tipo de error y devolver un mensaje apropiado
    let errorMessage;

    if (error.name === 'AbortError') {
      const timeoutSeconds = Math.round(actualTimeout / 1000);
      errorMessage = `La solicitud excedió el tiempo límite de ${timeoutSeconds} segundos`;
    } else if (error instanceof TypeError) {
      if (error.message.includes('fetch') || 
          error.message.includes('Failed to fetch') ||
          error.message.includes('Network request failed')) {
        errorMessage = config.defaultMessages.networkError;
      } else if (error.message.includes('CORS') || 
                error.message.includes('cross-origin')) {
        errorMessage = config.defaultMessages.corsError;
      } else {
        errorMessage = config.defaultMessages.defaultError;
      }
    } else if (
      // Errores de URL y parámetros
      error.message === config.defaultMessages.urlError.invalid ||
      error.message.includes('parámetros requeridos en la URL:') ||
      error.message.includes('Valor inválido para el parámetro:')
    ) {
      // Mantener el mensaje original para errores de URL
      errorMessage = error.message;
    } else {
      errorMessage = config.defaultMessages.defaultError;
    }

    // Registrar el error para debugging
    const errorDetails = {
      url: finalUrl,
      originalUrl: url !== finalUrl ? url : undefined,
      method: options.method || 'GET',
      error: error.message,
      type: error.name,
      category: error.name === 'AbortError' ? 'timeout' :
               error instanceof TypeError ? 'network' :
               error.message === config.defaultMessages.urlError.invalid ? 'url' :
               error.message.includes('parámetros requeridos') ? 'params' :
               'unknown'
    };

    // Filtrar propiedades undefined
    const cleanErrorDetails = Object.fromEntries(
      Object.entries(errorDetails).filter(([_, v]) => v !== undefined)
    );

    console.error('Error en fetchWithTimeout:', cleanErrorDetails);

    throw new Error(errorMessage);
  }
};

/**
 * Reemplaza los parámetros en una URL con sus valores correspondientes
 * @param {string} url - URL con parámetros en formato :paramName
 * @param {Object} params - Objeto con los valores de los parámetros
 * @returns {string} URL con los parámetros reemplazados
 */
export const replaceUrlParams = (url, params = {}) => {
  if (!url || typeof url !== 'string') {
    throw new Error(config.defaultMessages.urlError.invalid);
  }

  let finalUrl = url;
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      throw new Error(config.defaultMessages.urlError.invalidParam(key));
    }
    finalUrl = finalUrl.replace(`:${key}`, encodeURIComponent(value));
  });

  // Verificar que no queden parámetros sin reemplazar
  const remainingParams = finalUrl.match(/:[a-zA-Z]+/g);
  if (remainingParams) {
    throw new Error(config.defaultMessages.urlError.missingParams(remainingParams.join(', ')));
  }

  return finalUrl;
};

// Exportar constantes útiles
export {
  DATE_FORMATS,
  PAGINATION,
  TIMEOUTS
};

// Exportar la configuración por defecto
export default config;