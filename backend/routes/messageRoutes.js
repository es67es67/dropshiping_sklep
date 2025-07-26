const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// Wszystkie trasy wymagają autoryzacji
router.use(authMiddleware.authenticateToken);

// Podstawowe operacje na wiadomościach
router.post('/', messageController.sendMessage);
router.get('/', messageController.getMessages);

// Konwersacje
router.get('/conversations', messageController.getConversations);

// Oznaczanie jako przeczytane
router.put('/:messageId/read', messageController.markAsRead);
router.put('/conversation/:conversationId/read', messageController.markConversationAsRead);

// Edycja i usuwanie wiadomości
router.put('/:messageId', messageController.editMessage);
router.delete('/:messageId', messageController.deleteMessage);

// Statystyki
router.get('/unread/count', messageController.getUnreadCount);

module.exports = router;
