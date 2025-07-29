const ErrorService = require('../services/ErrorService');
const AlertService = require('../services/AlertService');

// 🔴 CRITICAL CONTROLLER: Error Controller
// Zależności: ErrorService, AlertService
// Wpływ: Wszystkie operacje na błędach przez API
// Jeśli się zepsuje: brak API dla błędów
// Używane w: errorRoutes.js

class ErrorController {
  // Rejestracja nowego błędu
  static async reportError(req, res) {
    try {
      const {
        message,
        stack,
        errorType = 'unknown',
        severity = 'medium',
        url,
        userAgent,
        browser,
        os,
        device,
        sessionId,
        performance,
        metadata = {}
      } = req.body;

      // Walidacja wymaganych pól
      if (!message || !stack) {
        return res.status(400).json({
          error: 'Brak wymaganych pól: message, stack',
          statusCode: 400,
          timestamp: new Date().toISOString()
        });
      }

      // Przygotuj dane błędu
      const errorData = {
        message,
        stack,
        errorType,
        severity,
        url: url || req.headers.referer || 'unknown',
        userAgent: userAgent || req.get('User-Agent'),
        browser,
        os,
        device,
        sessionId,
        performance,
        metadata: {
          ...metadata,
          ip: req.ip,
          method: req.method,
          headers: JSON.stringify(req.headers),
          body: JSON.stringify(req.body)
        }
      };

      // Zapisz błąd
      const error = await ErrorService.reportError(errorData);

      res.status(201).json({
        success: true,
        error: {
          id: error._id,
          message: error.message,
          severity: error.severity,
          status: error.status,
          groupId: error.groupId
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('💥 Błąd podczas rejestracji błędu:', error);
      res.status(500).json({
        error: 'Błąd podczas rejestracji błędu',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Pobieranie listy błędów
  static async getErrors(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        severity,
        errorType,
        url,
        message,
        userId,
        dateFrom,
        dateTo
      } = req.query;

      const filters = {
        status,
        severity,
        errorType,
        url,
        message,
        userId,
        dateFrom,
        dateTo
      };

      const result = await ErrorService.getErrors(filters, parseInt(page), parseInt(limit));

      res.json({
        success: true,
        data: result.errors,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('💥 Błąd podczas pobierania błędów:', error);
      res.status(500).json({
        error: 'Błąd podczas pobierania błędów',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Pobieranie szczegółów błędu
  static async getError(req, res) {
    try {
      const { id } = req.params;

      const error = await ErrorService.getErrorById(id);
      if (!error) {
        return res.status(404).json({
          error: 'Błąd nie został znaleziony',
          statusCode: 404,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        data: error,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('💥 Błąd podczas pobierania błędu:', error);
      res.status(500).json({
        error: 'Błąd podczas pobierania błędu',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Aktualizacja statusu błędu
  static async updateErrorStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      if (!status) {
        return res.status(400).json({
          error: 'Brak wymaganego pola: status',
          statusCode: 400,
          timestamp: new Date().toISOString()
        });
      }

      const error = await ErrorService.updateErrorStatus(id, status, userId);

      res.json({
        success: true,
        data: error,
        message: `Status błędu zaktualizowany na: ${status}`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('💥 Błąd podczas aktualizacji statusu błędu:', error);
      res.status(500).json({
        error: 'Błąd podczas aktualizacji statusu błędu',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Usuwanie błędu
  static async deleteError(req, res) {
    try {
      const { id } = req.params;

      const result = await ErrorService.deleteError(id);

      res.json({
        success: true,
        message: 'Błąd został usunięty',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('💥 Błąd podczas usuwania błędu:', error);
      res.status(500).json({
        error: 'Błąd podczas usuwania błędu',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Pobieranie statystyk błędów
  static async getErrorStats(req, res) {
    try {
      const { timeRange = '24h' } = req.query;

      const stats = await ErrorService.getStats(timeRange);

      res.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('💥 Błąd podczas pobierania statystyk:', error);
      res.status(500).json({
        error: 'Błąd podczas pobierania statystyk',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Pobieranie listy grup błędów
  static async getErrorGroups(req, res) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        severity,
        errorType,
        trend,
        priority
      } = req.query;

      const filters = {
        status,
        severity,
        errorType,
        trend,
        priority
      };

      const result = await ErrorService.getErrorGroups(filters, parseInt(page), parseInt(limit));

      res.json({
        success: true,
        data: result.groups,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('💥 Błąd podczas pobierania grup błędów:', error);
      res.status(500).json({
        error: 'Błąd podczas pobierania grup błędów',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Pobieranie szczegółów grupy błędów
  static async getErrorGroup(req, res) {
    try {
      const { id } = req.params;

      const group = await ErrorService.getErrorGroupById(id);
      if (!group) {
        return res.status(404).json({
          error: 'Grupa błędów nie została znaleziona',
          statusCode: 404,
          timestamp: new Date().toISOString()
        });
      }

      res.json({
        success: true,
        data: group,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('💥 Błąd podczas pobierania grupy błędów:', error);
      res.status(500).json({
        error: 'Błąd podczas pobierania grupy błędów',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Aktualizacja statusu grupy błędów
  static async updateErrorGroupStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user?.id;

      if (!status) {
        return res.status(400).json({
          error: 'Brak wymaganego pola: status',
          statusCode: 400,
          timestamp: new Date().toISOString()
        });
      }

      const group = await ErrorService.updateGroupStatus(id, status, userId);

      res.json({
        success: true,
        data: group,
        message: `Status grupy błędów zaktualizowany na: ${status}`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('💥 Błąd podczas aktualizacji statusu grupy błędów:', error);
      res.status(500).json({
        error: 'Błąd podczas aktualizacji statusu grupy błędów',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Wysyłanie testowego alertu
  static async sendTestAlert(req, res) {
    try {
      const { type = 'email' } = req.body;

      await AlertService.sendTestAlert(type);

      res.json({
        success: true,
        message: `Test alert (${type}) wysłany`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('💥 Błąd podczas wysyłania test alertu:', error);
      res.status(500).json({
        error: 'Błąd podczas wysyłania test alertu',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Pobieranie konfiguracji alertów
  static async getAlertConfig(req, res) {
    try {
      const config = AlertService.getAlertConfig();

      res.json({
        success: true,
        data: config,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('💥 Błąd podczas pobierania konfiguracji alertów:', error);
      res.status(500).json({
        error: 'Błąd podczas pobierania konfiguracji alertów',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Masowe operacje na błędach
  static async bulkUpdateErrors(req, res) {
    try {
      const { errorIds, action, status } = req.body;
      const userId = req.user?.id;

      if (!errorIds || !Array.isArray(errorIds) || errorIds.length === 0) {
        return res.status(400).json({
          error: 'Brak wymaganych pól: errorIds (array)',
          statusCode: 400,
          timestamp: new Date().toISOString()
        });
      }

      let updatedCount = 0;

      switch (action) {
        case 'resolve':
          for (const id of errorIds) {
            await ErrorService.updateErrorStatus(id, 'resolved', userId);
            updatedCount++;
          }
          break;
        case 'ignore':
          for (const id of errorIds) {
            await ErrorService.updateErrorStatus(id, 'ignored', userId);
            updatedCount++;
          }
          break;
        case 'assign':
          if (!status) {
            return res.status(400).json({
              error: 'Brak wymaganego pola: status dla akcji assign',
              statusCode: 400,
              timestamp: new Date().toISOString()
            });
          }
          for (const id of errorIds) {
            await ErrorService.updateErrorStatus(id, status, userId);
            updatedCount++;
          }
          break;
        default:
          return res.status(400).json({
            error: 'Nieprawidłowa akcja. Dozwolone: resolve, ignore, assign',
            statusCode: 400,
            timestamp: new Date().toISOString()
          });
      }

      res.json({
        success: true,
        message: `Zaktualizowano ${updatedCount} błędów`,
        updatedCount,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('💥 Błąd podczas masowej aktualizacji błędów:', error);
      res.status(500).json({
        error: 'Błąd podczas masowej aktualizacji błędów',
        statusCode: 500,
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = ErrorController; 