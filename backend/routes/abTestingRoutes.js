const express = require('express');
const router = express.Router();
const abTestingService = require('../services/abTestingService');
const authMiddleware = require('../middleware/authMiddleware');

// Wszystkie trasy wymagają autoryzacji
router.use(authMiddleware.authenticateToken);

// Pobieranie wariantu testu dla użytkownika
router.get('/variant/:testId', (req, res) => {
  try {
    const { testId } = req.params;
    const userId = req.userId;
    
    const variant = abTestingService.getUserVariant(userId, testId);
    
    res.json({
      success: true,
      testId,
      variant,
      userId
    });
  } catch (error) {
    console.error('Błąd pobierania wariantu:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania wariantu testu'
    });
  }
});

// Śledzenie wyświetlenia (impression)
router.post('/track-impression', (req, res) => {
  try {
    const { testId, variant } = req.body;
    const userId = req.userId;
    
    abTestingService.trackImpression(userId, testId, variant);
    
    res.json({
      success: true,
      message: 'Impression zarejestrowane'
    });
  } catch (error) {
    console.error('Błąd śledzenia impression:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd śledzenia impression'
    });
  }
});

// Śledzenie konwersji
router.post('/track-conversion', (req, res) => {
  try {
    const { testId, variant, value = 0 } = req.body;
    const userId = req.userId;
    
    abTestingService.trackConversion(userId, testId, variant, value);
    
    res.json({
      success: true,
      message: 'Konwersja zarejestrowana'
    });
  } catch (error) {
    console.error('Błąd śledzenia konwersji:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd śledzenia konwersji'
    });
  }
});

// Śledzenie kliknięcia
router.post('/track-click', (req, res) => {
  try {
    const { testId, variant } = req.body;
    const userId = req.userId;
    
    abTestingService.trackClick(userId, testId, variant);
    
    res.json({
      success: true,
      message: 'Kliknięcie zarejestrowane'
    });
  } catch (error) {
    console.error('Błąd śledzenia kliknięcia:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd śledzenia kliknięcia'
    });
  }
});

// Pobieranie wyników testu (tylko dla adminów)
router.get('/results/:testId', authMiddleware.requireAdmin, (req, res) => {
  try {
    const { testId } = req.params;
    const results = abTestingService.getTestResults(testId);
    
    if (!results) {
      return res.status(404).json({
        success: false,
        error: 'Test nie znaleziony'
      });
    }
    
    res.json({
      success: true,
      results
    });
  } catch (error) {
    console.error('Błąd pobierania wyników:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania wyników testu'
    });
  }
});

// Pobieranie wszystkich aktywnych testów (tylko dla adminów)
router.get('/active', authMiddleware.requireAdmin, (req, res) => {
  try {
    const activeTests = abTestingService.getActiveTests();
    
    res.json({
      success: true,
      tests: activeTests
    });
  } catch (error) {
    console.error('Błąd pobierania aktywnych testów:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd pobierania aktywnych testów'
    });
  }
});

// Zatrzymanie testu (tylko dla adminów)
router.post('/stop/:testId', authMiddleware.requireAdmin, (req, res) => {
  try {
    const { testId } = req.params;
    abTestingService.stopTest(testId);
    
    res.json({
      success: true,
      message: 'Test został zatrzymany'
    });
  } catch (error) {
    console.error('Błąd zatrzymywania testu:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd zatrzymywania testu'
    });
  }
});

// Usunięcie testu (tylko dla adminów)
router.delete('/:testId', authMiddleware.requireAdmin, (req, res) => {
  try {
    const { testId } = req.params;
    abTestingService.removeTest(testId);
    
    res.json({
      success: true,
      message: 'Test został usunięty'
    });
  } catch (error) {
    console.error('Błąd usuwania testu:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd usuwania testu'
    });
  }
});

// Eksport wyników testu (tylko dla adminów)
router.get('/export/:testId', authMiddleware.requireAdmin, (req, res) => {
  try {
    const { testId } = req.params;
    const { format = 'json' } = req.query;
    
    const exported = abTestingService.exportTestResults(testId, format);
    
    if (!exported) {
      return res.status(404).json({
        success: false,
        error: 'Test nie znaleziony'
      });
    }
    
    res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="ab-test-${testId}.${format}"`);
    
    res.send(exported);
  } catch (error) {
    console.error('Błąd eksportu wyników:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd eksportu wyników'
    });
  }
});

// Tworzenie nowego testu (tylko dla adminów)
router.post('/create', authMiddleware.requireAdmin, (req, res) => {
  try {
    const { testId, config } = req.body;
    
    if (!testId || !config) {
      return res.status(400).json({
        success: false,
        error: 'Brak wymaganych parametrów'
      });
    }
    
    abTestingService.createTest(testId, config);
    
    res.json({
      success: true,
      message: 'Test został utworzony',
      testId
    });
  } catch (error) {
    console.error('Błąd tworzenia testu:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd tworzenia testu'
    });
  }
});

// Czyszczenie wygasłych testów (tylko dla adminów)
router.post('/cleanup', authMiddleware.requireAdmin, (req, res) => {
  try {
    abTestingService.cleanupExpiredTests();
    
    res.json({
      success: true,
      message: 'Wygasłe testy zostały wyczyszczone'
    });
  } catch (error) {
    console.error('Błąd czyszczenia testów:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd czyszczenia testów'
    });
  }
});

module.exports = router; 