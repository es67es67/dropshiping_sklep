const ErrorModel = require('../models/errorModel');
const crypto = require('crypto');

/**
 * 🔴 UNIVERSAL ERROR SERVICE
 * Zależności: ErrorModel
 * Wpływ: WSZYSTKIE operacje na błędach w całym portalu
 * Jeśli się zepsuje: brak obsługi błędów
 * Używane w: Wszystkie kontrolery, middleware, serwisy
 */
class UniversalErrorService {
  constructor() {
    this.isInitialized = false;
    this.errorQueue = [];
    this.maxQueueSize = 100;
    this.isProcessing = false;
  }

  // Inicjalizacja serwisu
  static async initialize() {
    try {
      console.log('🔧 Inicjalizacja UniversalErrorService...');
      
      // Sprawdź połączenie z bazą danych
      const ErrorModel = require('../models/errorModel');
      await ErrorModel.findOne().exec();
      
      console.log('✅ UniversalErrorService zainicjalizowany');
      return true;
    } catch (error) {
      console.error('❌ Błąd inicjalizacji UniversalErrorService:', error);
      return false;
    }
  }

  // Generowanie unikalnego ID błędu
  static generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generowanie hashu błędu
  static generateErrorHash(message, stack = '', componentStack = '') {
    const hashInput = `${message}${stack}${componentStack}`;
    return crypto.createHash('md5').update(hashInput).digest('hex');
  }

  // Określanie ważności błędu
  static determineSeverity(error, type = 'unknown') {
    const message = error.message?.toLowerCase() || '';
    
    // Błędy krytyczne
    if (message.includes('enomem') || 
        message.includes('econnreset') ||
        message.includes('database connection') ||
        message.includes('mongodb') ||
        message.includes('memory') ||
        type === 'database_error' ||
        type === 'system_error') {
      return 'critical';
    }
    
    // Błędy wysokiej ważności
    if (message.includes('authentication') ||
        message.includes('authorization') ||
        message.includes('validation') ||
        message.includes('jwt') ||
        message.includes('token') ||
        type === 'authentication_error' ||
        type === 'validation_error' ||
        type === 'authorization_error') {
      return 'high';
    }
    
    // Błędy średniej ważności
    if (type === 'api_error' || 
        type === 'network_error' ||
        type === 'react_error') {
      return 'medium';
    }
    
    // Błędy niskiej ważności
    return 'low';
  }

  // Kategoryzacja typu błędu
  static categorizeErrorType(error, context = {}) {
    const message = error.message?.toLowerCase() || '';
    const stack = error.stack?.toLowerCase() || '';
    
    if (message.includes('validation') || message.includes('required')) {
      return 'validation_error';
    }
    
    if (message.includes('authentication') || message.includes('jwt') || message.includes('token')) {
      return 'authentication_error';
    }
    
    if (message.includes('authorization') || message.includes('permission')) {
      return 'authorization_error';
    }
    
    if (message.includes('database') || message.includes('mongodb') || message.includes('mongoose')) {
      return 'database_error';
    }
    
    if (message.includes('network') || message.includes('fetch') || message.includes('axios')) {
      return 'network_error';
    }
    
    if (context.componentName || stack.includes('react')) {
      return 'react_error';
    }
    
    if (context.isApiCall || context.route) {
      return 'api_error';
    }
    
    return 'unknown';
  }

  // Główna funkcja logowania błędu
  static async logError(error, context = {}) {
    try {
      // Przygotuj podstawowe dane błędu
      const errorData = {
        id: this.generateErrorId(),
        message: error.message || 'Nieznany błąd',
        stack: error.stack || '',
        componentStack: error.componentStack || '',
        type: this.categorizeErrorType(error, context),
        severity: this.determineSeverity(error, context.type),
        url: context.url || 'unknown',
        userAgent: context.userAgent || 'unknown',
        route: context.route || 'unknown',
        userId: context.userId || 'anonymous',
        sessionId: context.sessionId || 'unknown',
        context: {
          componentName: context.componentName || 'unknown',
          filename: context.filename || 'unknown',
          lineno: context.lineno || 0,
          colno: context.colno || 0,
          additionalData: {
            ...context.additionalData,
            method: context.method,
            ip: context.ip,
            headers: context.headers,
            body: context.body,
            query: context.query,
            params: context.params
          }
        },
        performance: {
          loadTime: context.loadTime,
          memoryUsage: context.memoryUsage,
          cpuUsage: context.cpuUsage
        },
        timestamp: new Date()
      };

      // Generuj hash
      errorData.hash = this.generateErrorHash(errorData.message, errorData.stack, errorData.componentStack);

      // Sprawdź czy błąd już istnieje
      const existingError = await ErrorModel.findByHash(errorData.hash);
      
      if (existingError) {
        // Aktualizuj istniejący błąd
        await existingError.updateOccurrence();
        console.log('📝 Błąd zaktualizowany:', {
          id: existingError._id,
          message: existingError.message,
          occurrences: existingError.occurrenceCount
        });
        return existingError;
      } else {
        // Utwórz nowy błąd
        const newError = new ErrorModel(errorData);
        await newError.save();
        
        console.log('📝 Nowy błąd zapisany:', {
          id: newError._id,
          message: newError.message,
          type: newError.type,
          severity: newError.severity
        });
        
        return newError;
      }

    } catch (logError) {
      console.error('💥 Błąd podczas logowania błędu:', logError);
      
      // Dodaj do kolejki offline
      this.addToQueue({
        error: error,
        context: context,
        timestamp: new Date()
      });
      
      throw logError;
    }
  }

  // Logowanie błędu z kontekstem Express
  static async logExpressError(error, req, res, context = {}) {
    const errorContext = {
      ...context,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      route: req.path,
      userId: req.user?.id || 'anonymous',
      sessionId: req.sessionID,
      method: req.method,
      ip: req.ip,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params
    };

    return this.logError(error, errorContext);
  }

  // Logowanie błędu z kontekstem React
  static async logReactError(error, errorInfo, context = {}) {
    const errorContext = {
      ...context,
      componentStack: errorInfo.componentStack,
      type: 'react_error',
      additionalData: {
        ...context.additionalData,
        componentStack: errorInfo.componentStack
      }
    };

    return this.logError(error, errorContext);
  }

  // Logowanie błędu walidacji
  static async logValidationError(validationErrors, context = {}) {
    const error = new Error(`Błędy walidacji: ${validationErrors.join(', ')}`);
    const errorContext = {
      ...context,
      type: 'validation_error',
      additionalData: {
        ...context.additionalData,
        validationErrors: validationErrors
      }
    };

    return this.logError(error, errorContext);
  }

  // Logowanie błędu autoryzacji
  static async logAuthError(error, context = {}) {
    const errorContext = {
      ...context,
      type: 'authentication_error'
    };

    return this.logError(error, errorContext);
  }

  // Logowanie błędu bazy danych
  static async logDatabaseError(error, context = {}) {
    const errorContext = {
      ...context,
      type: 'database_error'
    };

    return this.logError(error, errorContext);
  }

  // Dodanie błędu do kolejki offline
  static addToQueue(errorData) {
    if (this.errorQueue.length < this.maxQueueSize) {
      this.errorQueue.push(errorData);
      console.log(`📦 Błąd dodany do kolejki offline (${this.errorQueue.length}/${this.maxQueueSize})`);
    }
  }

  // Przetwarzanie kolejki offline
  static async processQueue() {
    if (this.isProcessing || this.errorQueue.length === 0) return;

    this.isProcessing = true;
    console.log(`🔄 Przetwarzanie ${this.errorQueue.length} błędów z kolejki offline...`);

    const errorsToProcess = [...this.errorQueue];
    this.errorQueue = [];

    for (const errorData of errorsToProcess) {
      try {
        await this.logError(errorData.error, errorData.context);
      } catch (err) {
        console.error('❌ Błąd podczas przetwarzania błędu z kolejki:', err);
        // Dodaj z powrotem do kolejki
        if (this.errorQueue.length < this.maxQueueSize) {
          this.errorQueue.push(errorData);
        }
      }
    }

    this.isProcessing = false;
    console.log(`✅ Przetworzono ${errorsToProcess.length} błędów z kolejki offline`);
  }

  // Pobieranie statystyk błędów
  static async getErrorStats() {
    try {
      const stats = await ErrorModel.getErrorStats();
      return stats[0] || {
        totalErrors: 0,
        criticalErrors: 0,
        highErrors: 0,
        mediumErrors: 0,
        lowErrors: 0,
        resolvedErrors: 0,
        newErrors: 0
      };
    } catch (error) {
      console.error('❌ Błąd podczas pobierania statystyk błędów:', error);
      return null;
    }
  }

  // Pobieranie błędów według typu
  static async getErrorsByType() {
    try {
      return await ErrorModel.getErrorsByType();
    } catch (error) {
      console.error('❌ Błąd podczas pobierania błędów według typu:', error);
      return [];
    }
  }

  // Pobieranie błędów według URL
  static async getErrorsByUrl() {
    try {
      return await ErrorModel.getErrorsByUrl();
    } catch (error) {
      console.error('❌ Błąd podczas pobierania błędów według URL:', error);
      return [];
    }
  }

  // Pobieranie ostatnich błędów
  static async getRecentErrors(limit = 20) {
    try {
      return await ErrorModel.findRecentErrors(24).limit(limit);
    } catch (error) {
      console.error('❌ Błąd podczas pobierania ostatnich błędów:', error);
      return [];
    }
  }

  // Oznaczanie błędu jako rozwiązany
  static async markErrorAsResolved(errorId, resolvedBy = 'system') {
    try {
      const error = await ErrorModel.findById(errorId);
      if (error) {
        await error.markAsResolved();
        console.log(`✅ Błąd ${errorId} oznaczony jako rozwiązany`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Błąd podczas oznaczania błędu jako rozwiązany:', error);
      return false;
    }
  }

  // Dodanie notatki do błędu
  static async addNoteToError(errorId, content, author = 'system') {
    try {
      const error = await ErrorModel.findById(errorId);
      if (error) {
        await error.addNote(content, author);
        console.log(`📝 Dodano notatkę do błędu ${errorId}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Błąd podczas dodawania notatki do błędu:', error);
      return false;
    }
  }

  // Czyszczenie starych błędów (starszych niż X dni)
  static async cleanupOldErrors(daysOld = 30) {
    try {
      const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
      const result = await ErrorModel.deleteMany({
        timestamp: { $lt: cutoffDate },
        status: { $in: ['resolved', 'ignored'] }
      });
      
      console.log(`🧹 Usunięto ${result.deletedCount} starych błędów`);
      return result.deletedCount;
    } catch (error) {
      console.error('❌ Błąd podczas czyszczenia starych błędów:', error);
      return 0;
    }
  }
}

module.exports = UniversalErrorService; 