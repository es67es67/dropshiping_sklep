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
router.post('/', errorController.reportError); // Zgłaszanie nowych błędów (bez autoryzacji)

// Routes wymagające autoryzacji
router.get('/', requireAuth, errorController.getErrors);
router.get('/:id', requireAuth, errorController.getErrorById);
router.put('/:id/status', requireAuth, errorController.updateErrorStatus);
router.delete('/:id', requireAuth, requireAdmin, errorController.deleteError);

// Routes dla statystyk
router.get('/stats', requireAuth, errorController.getErrorStats);

// Routes dla grup błędów
router.get('/groups', requireAuth, errorController.getErrorGroups);
router.get('/groups/:id', requireAuth, errorController.getErrorGroupById);
router.put('/groups/:id/status', requireAuth, errorController.updateErrorGroupStatus);
router.delete('/groups/:id', requireAuth, requireAdmin, errorController.deleteErrorGroup);
router.get('/groups/stats', requireAuth, errorController.getErrorGroupStats);

// Bulk actions
router.post('/bulk-update', requireAuth, errorController.bulkUpdateErrors);

module.exports = router; 