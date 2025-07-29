const Error = require('../models/errorModel');
const ErrorGroup = require('../models/errorGroupModel');
const crypto = require('crypto');

// Offline queue dla błędów
let offlineQueue = [];
const MAX_QUEUE_SIZE = 100;

// Funkcja do generowania hashu błędu
const generateErrorHash = (message, stack) => {
  const hashInput = `${message}${stack || ''}`;
  return crypto.createHash('md5').update(hashInput).digest('hex');
};

// Funkcja do określania ważności błędu
const determineSeverity = (error, type) => {
  // Błędy krytyczne
  if (error.message?.includes('ENOMEM') || 
      error.message?.includes('ECONNRESET') ||
      error.message?.includes('database connection') ||
      type === 'database_error') {
    return 'critical';
  }
  
  // Błędy wysokiej ważności
  if (error.message?.includes('authentication') ||
      error.message?.includes('authorization') ||
      error.message?.includes('validation') ||
      type === 'authentication_error' ||
      type === 'validation_error') {
    return 'high';
  }
  
  // Błędy średniej ważności
  if (type === 'api_error' || type === 'network_error') {
    return 'medium';
  }
  
  // Błędy niskiej ważności
  return 'low';
};

// Funkcja do zapisywania błędu w bazie danych
const saveError = async (errorData) => {
  try {
    // Sprawdź czy błąd już istnieje (na podstawie hashu)
    const existingError = await Error.findByHash(errorData.hash);
    
    if (existingError) {
      // Aktualizuj istniejący błąd
      await existingError.updateOccurrence();
      return existingError;
    } else {
      // Sprawdź czy istnieje grupa błędów
      let errorGroup = await ErrorGroup.findByHash(errorData.hash);
      
      if (!errorGroup) {
        // Utwórz nową grupę błędów
        errorGroup = new ErrorGroup({
          hash: errorData.hash,
          message: errorData.message,
          stack: errorData.stack,
          type: errorData.type,
          severity: errorData.severity,
          firstSeen: new Date(),
          lastSeen: new Date()
        });
        await errorGroup.save();
      } else {
        // Aktualizuj istniejącą grupę
        await errorGroup.updateStats(errorData);
      }
      
      // Utwórz nowy błąd
      const newError = new Error({
        ...errorData,
        groupId: errorGroup._id
      });
      
      await newError.save();
      return newError;
    }
  } catch (dbError) {
    console.error('Błąd podczas zapisywania błędu w bazie danych:', dbError);
    
    // Dodaj do kolejki offline
    if (offlineQueue.length < MAX_QUEUE_SIZE) {
      offlineQueue.push(errorData);
    }
    
    throw dbError;
  }
};

// Middleware do przechwytywania błędów Express
const expressErrorHandler = (err, req, res, next) => {
  console.error('Express Error Handler:', err);
  
  const errorData = {
    id: `api_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    message: err.message || 'Unknown API Error',
    stack: err.stack,
    type: 'api_error',
    severity: determineSeverity(err, 'api_error'),
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    route: req.path,
    userId: req.user?.id || 'anonymous',
    sessionId: req.sessionID,
    context: {
      method: req.method,
      ip: req.ip,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params
    },
    timestamp: new Date().toISOString()
  };
  
  // Generuj hash
  errorData.hash = generateErrorHash(errorData.message, errorData.stack);
  
  // Zapisz błąd (asynchronicznie)
  saveError(errorData).catch(console.error);
  
  // Wyślij odpowiedź klientowi
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: {
      message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message,
      status: statusCode,
      timestamp: new Date().toISOString()
    }
  });
};

// Middleware do przechwytywania nieobsłużonych błędów
const unhandledErrorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err);
  
  const errorData = {
    id: `unhandled_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    message: err.message || 'Unhandled Error',
    stack: err.stack,
    type: 'unknown',
    severity: determineSeverity(err, 'unknown'),
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    route: req.path,
    userId: req.user?.id || 'anonymous',
    sessionId: req.sessionID,
    context: {
      method: req.method,
      ip: req.ip,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params
    },
    timestamp: new Date().toISOString()
  };
  
  // Generuj hash
  errorData.hash = generateErrorHash(errorData.message, errorData.stack);
  
  // Zapisz błąd (asynchronicznie)
  saveError(errorData).catch(console.error);
  
  // Wyślij odpowiedź klientowi
  res.status(500).json({
    error: {
      message: 'Internal Server Error',
      status: 500,
      timestamp: new Date().toISOString()
    }
  });
};

// Middleware do przechwytywania błędów 404
const notFoundHandler = (req, res, next) => {
  const errorData = {
    id: `not_found_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    type: 'api_error',
    severity: 'low',
    url: req.originalUrl,
    userAgent: req.get('User-Agent'),
    route: req.path,
    userId: req.user?.id || 'anonymous',
    sessionId: req.sessionID,
    context: {
      method: req.method,
      ip: req.ip,
      headers: req.headers,
      query: req.query,
      params: req.params
    },
    timestamp: new Date().toISOString()
  };
  
  // Generuj hash
  errorData.hash = generateErrorHash(errorData.message);
  
  // Zapisz błąd (asynchronicznie)
  saveError(errorData).catch(console.error);
  
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404,
      timestamp: new Date().toISOString()
    }
  });
};

// Funkcja do przetwarzania kolejki offline
const processOfflineQueue = async () => {
  if (offlineQueue.length === 0) return;
  
  console.log(`Przetwarzanie ${offlineQueue.length} błędów z kolejki offline...`);
  
  const errorsToProcess = [...offlineQueue];
  offlineQueue = [];
  
  for (const errorData of errorsToProcess) {
    try {
      await saveError(errorData);
    } catch (err) {
      console.error('Błąd podczas przetwarzania błędu z kolejki:', err);
      // Dodaj z powrotem do kolejki jeśli nie udało się zapisać
      if (offlineQueue.length < MAX_QUEUE_SIZE) {
        offlineQueue.push(errorData);
      }
    }
  }
  
  console.log(`Przetworzono ${errorsToProcess.length} błędów z kolejki offline`);
};

// Funkcja do dodawania błędu do kolejki offline
const addToOfflineQueue = (errorData) => {
  if (offlineQueue.length < MAX_QUEUE_SIZE) {
    offlineQueue.push(errorData);
  }
};

// Funkcja do pobierania statystyk kolejki
const getQueueStats = () => {
  return {
    queueSize: offlineQueue.length,
    maxQueueSize: MAX_QUEUE_SIZE
  };
};

module.exports = {
  expressErrorHandler,
  unhandledErrorHandler,
  notFoundHandler,
  saveError,
  processOfflineQueue,
  addToOfflineQueue,
  getQueueStats,
  generateErrorHash,
  determineSeverity
}; 