
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.authenticateToken, notificationController.getNotifications);
router.post('/mark-as-read', authMiddleware.authenticateToken, notificationController.markAsRead);

module.exports = router;

