const UniversalErrorService = require('../services/universalErrorService');

// Offline queue dla błędów
let offlineQueue = [];
const MAX_QUEUE_SIZE = 100;

// Middleware do przechwytywania błędów Express
const expressErrorHandler = (err, req, res, next) => {
  console.error('Express Error Handler:', err);
  
  // Zapisz błąd używając UniversalErrorService
  UniversalErrorService.logExpressError(err, req, res, {
    type: 'api_error',
    componentName: 'ExpressErrorHandler',
    filename: 'errorHandler.js'
  }).catch(console.error);
  
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
  
  // Zapisz błąd używając UniversalErrorService
  UniversalErrorService.logExpressError(err, req, res, {
    type: 'unknown',
    componentName: 'UnhandledErrorHandler',
    filename: 'errorHandler.js'
  }).catch(console.error);
  
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
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  
  // Zapisz błąd używając UniversalErrorService
  UniversalErrorService.logExpressError(error, req, res, {
    type: 'api_error',
    severity: 'low',
    componentName: 'NotFoundHandler',
    filename: 'errorHandler.js'
  }).catch(console.error);
  
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
  await UniversalErrorService.processQueue();
};

// Funkcja do dodawania błędu do kolejki offline
const addToOfflineQueue = (errorData) => {
  UniversalErrorService.addToQueue(errorData);
};

// Funkcja do pobierania statystyk kolejki
const getQueueStats = () => {
  return UniversalErrorService.getQueueStats ? UniversalErrorService.getQueueStats() : {
    queueSize: 0,
    maxQueueSize: MAX_QUEUE_SIZE
  };
};

// 🔧 EKSPORT FUNKCJI DLA ERRORCONTROLLER
const generateErrorHash = UniversalErrorService.generateErrorHash;
const determineSeverity = UniversalErrorService.determineSeverity;

// Funkcja saveError - wrapper dla UniversalErrorService.logError
const saveError = async (errorData) => {
  try {
    const error = new Error(errorData.message || 'Unknown error');
    error.stack = errorData.stack;
    
    const savedError = await UniversalErrorService.logError(error, {
      type: errorData.type || 'unknown',
      severity: errorData.severity || 'medium',
      componentName: errorData.component || 'Unknown',
      filename: errorData.filename || 'Unknown',
      url: errorData.url,
      userAgent: errorData.userAgent,
      userId: errorData.userId,
      hash: errorData.hash,
      id: errorData.id
    });
    
    return savedError;
  } catch (saveError) {
    console.error('Błąd podczas zapisywania błędu:', saveError);
    throw saveError;
  }
};

module.exports = {
  expressErrorHandler,
  unhandledErrorHandler,
  notFoundHandler,
  processOfflineQueue,
  addToOfflineQueue,
  getQueueStats,
  // 🔧 NOWE FUNKCJE DLA ERRORCONTROLLER
  generateErrorHash,
  saveError,
  determineSeverity
}; 