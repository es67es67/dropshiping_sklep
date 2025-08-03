
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Wszystkie trasy wymagają autoryzacji
router.use(authenticateToken);

// Pobieranie powiadomień użytkownika
router.get('/', notificationController.getNotifications);

// Oznaczanie powiadomienia jako przeczytane
router.put('/:notificationId/read', notificationController.markAsRead);

// Oznaczanie wszystkich powiadomień jako przeczytane
router.put('/read-all', notificationController.markAllAsRead);

// Usuwanie powiadomienia
router.delete('/:notificationId', notificationController.deleteNotification);

// Archiwizowanie powiadomienia
router.put('/:notificationId/archive', notificationController.archiveNotification);

module.exports = router;

