const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

// Middleware do sprawdzania autoryzacji (opcjonalne)
const requireAuth = (req, res, next) => {
  // Sprawdź token w headerze Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Brak tokenu autoryzacji' });
  }
  
  // Tutaj możesz dodać weryfikację JWT tokenu
  // Na razie przepuszczamy wszystkie żądania z tokenem
  next();
};

// Middleware do sprawdzania uprawnień admina (opcjonalne)
const requireAdmin = (req, res, next) => {
  // Sprawdź czy użytkownik ma uprawnienia admina
  // Na razie przepuszczamy wszystkie żądania
  next();
};

// Routes dla błędów
router.post('/errors', errorController.reportError); // Zgłaszanie nowych błędów (bez autoryzacji)

// Routes wymagające autoryzacji
router.get('/errors', requireAuth, errorController.getErrors);
router.get('/errors/:id', requireAuth, errorController.getErrorById);
router.put('/errors/:id/status', requireAuth, errorController.updateErrorStatus);
router.delete('/errors/:id', requireAuth, requireAdmin, errorController.deleteError);

// Routes dla statystyk
router.get('/errors/stats', requireAuth, errorController.getErrorStats);

// Routes dla grup błędów
router.get('/error-groups', requireAuth, errorController.getErrorGroups);
router.get('/error-groups/:id', requireAuth, errorController.getErrorGroupById);
router.put('/error-groups/:id/status', requireAuth, errorController.updateErrorGroupStatus);
router.delete('/error-groups/:id', requireAuth, requireAdmin, errorController.deleteErrorGroup);
router.get('/error-groups/stats', requireAuth, errorController.getErrorGroupStats);

// Bulk actions
router.post('/errors/bulk-update', requireAuth, errorController.bulkUpdateErrors);

module.exports = router; 