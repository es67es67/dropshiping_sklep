const crypto = require('crypto');
const ErrorModel = require('../models/ErrorModel');
const ErrorGroupModel = require('../models/ErrorGroupModel');
const ErrorService = require('../services/ErrorService');

// 🔴 CRITICAL MIDDLEWARE: Error Handler
// Zależności: ErrorModel, ErrorGroupModel, ErrorService
// Wpływ: WSZYSTKIE błędy w aplikacji
// Jeśli się zepsuje: brak logowania błędów
// Używane w: server.js (global error handler)

class ErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.isProcessing = false;
    this.maxQueueSize = 100;
  }

  // Middleware do przechwytywania błędów Express
  static async handleExpressError(err, req, res, next) {
    try {
      console.error('🚨 Express Error:', {
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: req.user?.id || 'anonymous'
      });

      // Przygotuj dane błędu
      const errorData = {
        message: err.message || 'Unknown error',
        stack: err.stack || '',
        errorType: 'api',
        severity: ErrorHandler.determineSeverity(err),
        url: req.originalUrl,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        userId: req.user?.id || null,
        sessionId: req.session?.id || null,
        metadata: {
          headers: JSON.stringify(req.headers),
          body: JSON.stringify(req.body),
          query: JSON.stringify(req.query),
          params: JSON.stringify(req.params)
        }
      };

      // Zapisz błąd asynchronicznie
      ErrorHandler.logError(errorData);

      // Wyślij odpowiedź klientowi
      const statusCode = err.statusCode || 500;
      const message = process.env.NODE_ENV === 'production' 
        ? 'Wystąpił błąd serwera' 
        : err.message;

      res.status(statusCode).json({
        error: message,
        statusCode,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
      });

    } catch (handlerError) {
      console.error('💥 Error in error handler:', handlerError);
      
      // Fallback response
      res.status(500).json({
        error: 'Internal server error',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Middleware do przechwytywania 404
  static handleNotFound(req, res, next) {
    const error = new Error(`Endpoint not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
  }

  // Middleware do przechwytywania błędów walidacji
  static handleValidationError(err, req, res, next) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        error: 'Validation error',
        details: errors,
        statusCode: 400,
        timestamp: new Date().toISOString()
      });
    }
    next(err);
  }

  // Middleware do przechwytywania błędów MongoDB
  static handleMongoError(err, req, res, next) {
    if (err.name === 'MongoError' || err.name === 'MongoServerError') {
      console.error('🗄️ MongoDB Error:', err);
      
      return res.status(500).json({
        error: 'Database error',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
    next(err);
  }

  // Middleware do przechwytywania błędów JWT
  static handleJWTError(err, req, res, next) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        statusCode: 401,
        timestamp: new Date().toISOString()
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        statusCode: 401,
        timestamp: new Date().toISOString()
      });
    }
    
    next(err);
  }

  // Asynchroniczne logowanie błędów
  static async logError(errorData) {
    try {
      // Generuj hash błędu
      const errorHash = ErrorHandler.generateErrorHash(errorData);
      
      // Sprawdź czy błąd już istnieje
      let existingError = await ErrorModel.findByHash(errorHash);
      
      if (existingError) {
        // Aktualizuj istniejący błąd
        await existingError.updateOccurrence();
      } else {
        // Utwórz nowy błąd
        existingError = new ErrorModel({
          ...errorData,
          errorHash,
          occurrenceCount: 1
        });
        await existingError.save();
      }

      // Sprawdź/utwórz grupę błędów
      await ErrorHandler.handleErrorGroup(existingError);

      console.log('✅ Błąd zapisany:', {
        id: existingError._id,
        message: existingError.message,
        hash: errorHash
      });

    } catch (logError) {
      console.error('💥 Błąd podczas logowania błędu:', logError);
      
      // Dodaj do kolejki offline
      ErrorHandler.addToQueue(errorData);
    }
  }

  // Obsługa grup błędów
  static async handleErrorGroup(error) {
    try {
      let group = await ErrorGroupModel.findByHash(error.errorHash);
      
      if (!group) {
        // Utwórz nową grupę
        group = new ErrorGroupModel({
          name: ErrorHandler.generateGroupName(error.message),
          errorHash: error.errorHash,
          message: error.message,
          stack: error.stack,
          errorType: error.errorType,
          severity: error.severity,
          totalOccurrences: 1,
          uniqueUsers: 1,
          affectedUrls: [error.url],
          firstSeen: error.firstSeen,
          lastSeen: error.lastSeen
        });
        await group.save();
      } else {
        // Aktualizuj istniejącą grupę
        await group.updateStats(1, 1, [error.url]);
      }

      // Przypisz błąd do grupy
      error.groupId = group._id;
      await error.save();

      // Sprawdź czy należy wysłać alert
      await ErrorHandler.checkAlerting(group);

    } catch (groupError) {
      console.error('💥 Błąd podczas obsługi grupy błędów:', groupError);
    }
  }

  // Sprawdzanie alertów
  static async checkAlerting(group) {
    try {
      const shouldAlert = 
        group.severity === 'critical' ||
        (group.totalOccurrences > 10 && group.isRecent) ||
        (group.totalOccurrences > 50 && group.isFrequent);

      if (shouldAlert && !group.alerted) {
        group.alerted = true;
        group.alertLevel = group.severity === 'critical' ? 'critical' : 'email';
        await group.save();

        // Wyślij alert
        await ErrorService.sendAlert(group);
      }
    } catch (alertError) {
      console.error('💥 Błąd podczas sprawdzania alertów:', alertError);
    }
  }

  // Generowanie hash błędu
  static generateErrorHash(errorData) {
    const hashInput = `${errorData.message}|${errorData.stack}|${errorData.errorType}`;
    return crypto.createHash('sha256').update(hashInput).digest('hex');
  }

  // Generowanie nazwy grupy
  static generateGroupName(message) {
    // Usuń parametry z URL w komunikacie
    let name = message.replace(/\/[^\/]+\/[^\/]+/g, '/:id');
    
    // Skróć zbyt długie nazwy
    if (name.length > 100) {
      name = name.substring(0, 97) + '...';
    }
    
    return name;
  }

  // Określanie ważności błędu
  static determineSeverity(err) {
    if (err.statusCode >= 500) return 'critical';
    if (err.statusCode >= 400) return 'high';
    if (err.statusCode >= 300) return 'medium';
    return 'low';
  }

  // Kolejka offline
  static addToQueue(errorData) {
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.errorQueue.shift(); // Usuń najstarszy
    }
    this.errorQueue.push(errorData);
    
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  // Przetwarzanie kolejki
  static async processQueue() {
    if (this.isProcessing || this.errorQueue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      while (this.errorQueue.length > 0) {
        const errorData = this.errorQueue.shift();
        await this.logError(errorData);
        await new Promise(resolve => setTimeout(resolve, 100)); // Rate limiting
      }
    } catch (error) {
      console.error('💥 Błąd podczas przetwarzania kolejki:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Logowanie błędów systemowych
  static async logSystemError(error, type = 'system') {
    const errorData = {
      message: error.message || 'System error',
      stack: error.stack || '',
      errorType: type,
      severity: 'critical',
      url: 'system',
      method: 'SYSTEM',
      userAgent: 'system',
      ip: 'system',
      userId: null,
      sessionId: null,
      metadata: {
        type: type,
        processId: process.pid,
        memoryUsage: JSON.stringify(process.memoryUsage()),
        uptime: process.uptime()
      }
    };

    await this.logError(errorData);
  }
}

module.exports = ErrorHandler; 