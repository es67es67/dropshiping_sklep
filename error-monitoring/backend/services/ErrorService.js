const ErrorModel = require('../models/ErrorModel');
const ErrorGroupModel = require('../models/ErrorGroupModel');
const AlertService = require('./AlertService');

// 🔴 CRITICAL SERVICE: Error Service
// Zależności: ErrorModel, ErrorGroupModel, AlertService
// Wpływ: WSZYSTKIE operacje na błędach
// Jeśli się zepsuje: brak obsługi błędów
// Używane w: ErrorHandler, controllers, routes

class ErrorService {
  constructor() {
    this.isInitialized = false;
    this.alertThresholds = {
      critical: 1,    // 1 błąd krytyczny = alert
      high: 5,        // 5 błędów wysokich = alert
      medium: 20,     // 20 błędów średnich = alert
      low: 100        // 100 błędów niskich = alert
    };
  }

  // Inicjalizacja serwisu
  static async initialize() {
    try {
      console.log('🔄 Inicjalizacja ErrorService...');
      
      // Sprawdź i utwórz indeksy
      await ErrorModel.createIndexes();
      await ErrorGroupModel.createIndexes();
      
      // Uruchom zadania cykliczne
      ErrorService.startPeriodicTasks();
      
      console.log('✅ ErrorService zainicjalizowany');
      return true;
    } catch (error) {
      console.error('❌ Błąd inicjalizacji ErrorService:', error);
      return false;
    }
  }

  // Rejestracja nowego błędu
  static async reportError(errorData) {
    try {
      console.log('📝 Rejestracja błędu:', {
        message: errorData.message,
        type: errorData.errorType,
        severity: errorData.severity
      });

      // Walidacja danych
      if (!errorData.message || !errorData.stack) {
        throw new Error('Brak wymaganych danych błędu');
      }

      // Zapisz błąd
      const error = new ErrorModel({
        ...errorData,
        firstSeen: new Date(),
        lastSeen: new Date(),
        occurrenceCount: 1
      });

      await error.save();

      // Sprawdź/utwórz grupę
      await ErrorService.handleErrorGroup(error);

      // Sprawdź alerty
      await ErrorService.checkAlerting(error);

      return error;
    } catch (error) {
      console.error('💥 Błąd podczas rejestracji błędu:', error);
      throw error;
    }
  }

  // Obsługa grup błędów
  static async handleErrorGroup(error) {
    try {
      let group = await ErrorGroupModel.findByHash(error.errorHash);
      
      if (!group) {
        // Utwórz nową grupę
        group = new ErrorGroupModel({
          name: ErrorService.generateGroupName(error.message),
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
        await group.updateTrend();
      }

      // Przypisz błąd do grupy
      error.groupId = group._id;
      await error.save();

      return group;
    } catch (error) {
      console.error('💥 Błąd podczas obsługi grupy błędów:', error);
      throw error;
    }
  }

  // Sprawdzanie alertów
  static async checkAlerting(error) {
    try {
      const group = await ErrorGroupModel.findById(error.groupId);
      if (!group) return;

      const shouldAlert = 
        group.severity === 'critical' ||
        (group.totalOccurrences >= this.alertThresholds[group.severity] && group.isRecent) ||
        (group.totalOccurrences > 50 && group.isFrequent);

      if (shouldAlert && !group.alerted) {
        group.alerted = true;
        group.alertLevel = group.severity === 'critical' ? 'critical' : 'email';
        await group.save();

        // Wyślij alert
        await AlertService.sendAlert(group);
      }
    } catch (error) {
      console.error('💥 Błąd podczas sprawdzania alertów:', error);
    }
  }

  // Pobieranie statystyk
  static async getStats(timeRange = '24h') {
    try {
      const now = new Date();
      let startDate;

      switch (timeRange) {
        case '1h':
          startDate = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case '24h':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      const [errorStats, groupStats] = await Promise.all([
        ErrorModel.aggregate([
          { $match: { createdAt: { $gte: startDate } } },
          {
            $group: {
              _id: null,
              totalErrors: { $sum: 1 },
              newErrors: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
              resolvedErrors: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
              criticalErrors: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } },
              avgOccurrences: { $avg: '$occurrenceCount' }
            }
          }
        ]),
        ErrorGroupModel.aggregate([
          { $match: { lastSeen: { $gte: startDate } } },
          {
            $group: {
              _id: null,
              totalGroups: { $sum: 1 },
              activeGroups: { $sum: { $cond: [{ $in: ['$status', ['new', 'investigating']] }, 1, 0] } },
              criticalGroups: { $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] } },
              totalOccurrences: { $sum: '$totalOccurrences' }
            }
          }
        ])
      ]);

      return {
        errors: errorStats[0] || {
          totalErrors: 0,
          newErrors: 0,
          resolvedErrors: 0,
          criticalErrors: 0,
          avgOccurrences: 0
        },
        groups: groupStats[0] || {
          totalGroups: 0,
          activeGroups: 0,
          criticalGroups: 0,
          totalOccurrences: 0
        },
        timeRange
      };
    } catch (error) {
      console.error('💥 Błąd podczas pobierania statystyk:', error);
      throw error;
    }
  }

  // Pobieranie błędów z filtrowaniem
  static async getErrors(filters = {}, page = 1, limit = 20) {
    try {
      const query = {};

      // Filtry
      if (filters.status) query.status = filters.status;
      if (filters.severity) query.severity = filters.severity;
      if (filters.errorType) query.errorType = filters.errorType;
      if (filters.url) query.url = { $regex: filters.url, $options: 'i' };
      if (filters.message) query.message = { $regex: filters.message, $options: 'i' };
      if (filters.userId) query.userId = filters.userId;
      if (filters.dateFrom) query.createdAt = { $gte: new Date(filters.dateFrom) };
      if (filters.dateTo) {
        if (query.createdAt) {
          query.createdAt.$lte = new Date(filters.dateTo);
        } else {
          query.createdAt = { $lte: new Date(filters.dateTo) };
        }
      }

      const skip = (page - 1) * limit;

      const [errors, total] = await Promise.all([
        ErrorModel.find(query)
          .populate('groupId', 'name severity status')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        ErrorModel.countDocuments(query)
      ]);

      return {
        errors,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('💥 Błąd podczas pobierania błędów:', error);
      throw error;
    }
  }

  // Pobieranie grup błędów
  static async getErrorGroups(filters = {}, page = 1, limit = 20) {
    try {
      const query = {};

      // Filtry
      if (filters.status) query.status = filters.status;
      if (filters.severity) query.severity = filters.severity;
      if (filters.errorType) query.errorType = filters.errorType;
      if (filters.trend) query.trend = filters.trend;
      if (filters.priority) query.priority = filters.priority;

      const skip = (page - 1) * limit;

      const [groups, total] = await Promise.all([
        ErrorGroupModel.find(query)
          .populate('assignedTo', 'username email')
          .sort({ lastSeen: -1 })
          .skip(skip)
          .limit(limit),
        ErrorGroupModel.countDocuments(query)
      ]);

      return {
        groups,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('💥 Błąd podczas pobierania grup błędów:', error);
      throw error;
    }
  }

  // Aktualizacja statusu błędu
  static async updateErrorStatus(errorId, status, userId = null) {
    try {
      const error = await ErrorModel.findById(errorId);
      if (!error) {
        throw new Error('Błąd nie został znaleziony');
      }

      switch (status) {
        case 'resolved':
          await error.resolve(userId);
          break;
        case 'ignored':
          await error.ignore();
          break;
        case 'investigating':
          await error.assign(userId);
          break;
        default:
          error.status = status;
          await error.save();
      }

      return error;
    } catch (error) {
      console.error('💥 Błąd podczas aktualizacji statusu:', error);
      throw error;
    }
  }

  // Aktualizacja statusu grupy
  static async updateGroupStatus(groupId, status, userId = null) {
    try {
      const group = await ErrorGroupModel.findById(groupId);
      if (!group) {
        throw new Error('Grupa błędów nie została znaleziona');
      }

      switch (status) {
        case 'resolved':
          await group.resolve(userId);
          break;
        case 'ignored':
          await group.ignore();
          break;
        case 'investigating':
          await group.assign(userId);
          break;
        default:
          group.status = status;
          await group.save();
      }

      return group;
    } catch (error) {
      console.error('💥 Błąd podczas aktualizacji statusu grupy:', error);
      throw error;
    }
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

  // Zadania cykliczne
  static startPeriodicTasks() {
    // Czyszczenie starych błędów (co 24h)
    setInterval(async () => {
      try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const result = await ErrorModel.deleteMany({
          createdAt: { $lt: thirtyDaysAgo },
          status: 'resolved'
        });
        console.log(`🧹 Usunięto ${result.deletedCount} starych błędów`);
      } catch (error) {
        console.error('💥 Błąd podczas czyszczenia starych błędów:', error);
      }
    }, 24 * 60 * 60 * 1000);

    // Aktualizacja trendów (co godzinę)
    setInterval(async () => {
      try {
        const groups = await ErrorGroupModel.find({ status: { $ne: 'resolved' } });
        for (const group of groups) {
          await group.updateTrend();
        }
        console.log(`📈 Zaktualizowano trendy dla ${groups.length} grup błędów`);
      } catch (error) {
        console.error('💥 Błąd podczas aktualizacji trendów:', error);
      }
    }, 60 * 60 * 1000);
  }

  // Wysyłanie alertów
  static async sendAlert(group) {
    try {
      await AlertService.sendAlert(group);
    } catch (error) {
      console.error('💥 Błąd podczas wysyłania alertu:', error);
    }
  }

  // Logowanie błędów systemowych
  static async logSystemError(error, type = 'system') {
    try {
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

      await ErrorService.reportError(errorData);
    } catch (logError) {
      console.error('💥 Błąd podczas logowania błędu systemowego:', logError);
    }
  }
}

module.exports = ErrorService; 