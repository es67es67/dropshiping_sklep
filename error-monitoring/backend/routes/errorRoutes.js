const express = require('express');
const router = express.Router();
const ErrorController = require('../controllers/errorController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 🔴 CRITICAL ROUTES: Error Routes
// Zależności: ErrorController, authMiddleware
// Wpływ: Wszystkie endpointy API dla błędów
// Jeśli się zepsuje: brak API dla błędów
// Używane w: server.js

// Publiczne endpointy (nie wymagają autoryzacji)
router.post('/report', ErrorController.reportError);

// Chronione endpointy (wymagają autoryzacji)
router.use(authenticateToken);

// Pobieranie błędów
router.get('/', ErrorController.getErrors);
router.get('/stats', ErrorController.getErrorStats);
router.get('/groups', ErrorController.getErrorGroups);

// Operacje na pojedynczych błędach
router.get('/:id', ErrorController.getError);
router.put('/:id/status', ErrorController.updateErrorStatus);
router.delete('/:id', ErrorController.deleteError);

// Operacje na grupach błędów
router.get('/groups/:id', ErrorController.getErrorGroup);
router.put('/groups/:id/status', ErrorController.updateErrorGroupStatus);

// Masowe operacje
router.post('/bulk', ErrorController.bulkUpdateErrors);

// Alerty
router.post('/alerts/test', ErrorController.sendTestAlert);
router.get('/alerts/config', ErrorController.getAlertConfig);

module.exports = router; 