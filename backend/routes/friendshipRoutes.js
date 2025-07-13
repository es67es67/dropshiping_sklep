const express = require('express');
const router = express.Router();
const friendshipController = require('../controllers/friendshipController');
const authMiddleware = require('../middleware/authMiddleware');

// Wszystkie trasy wymagają autoryzacji
router.use(authMiddleware.authenticateToken);

// Wysyłanie zaproszenia do znajomych
router.post('/send-request', friendshipController.sendFriendRequest);

// Akceptowanie zaproszenia
router.post('/accept/:friendshipId', friendshipController.acceptFriendRequest);

// Odrzucanie zaproszenia
router.post('/reject/:friendshipId', friendshipController.rejectFriendRequest);

// Blokowanie użytkownika
router.post('/block/:userId', friendshipController.blockUser);

// Odblokowanie użytkownika
router.post('/unblock/:userId', friendshipController.unblockUser);

// Usuwanie znajomego
router.delete('/remove/:friendshipId', friendshipController.removeFriend);

// Pobieranie listy znajomych
router.get('/friends', friendshipController.getFriends);

// Pobieranie oczekujących zaproszeń
router.get('/pending-requests', friendshipController.getPendingRequests);

// Pobieranie wysłanych zaproszeń
router.get('/sent-requests', friendshipController.getSentRequests);

// Pobieranie zablokowanych użytkowników
router.get('/blocked-users', friendshipController.getBlockedUsers);

// Pobieranie wspólnych znajomych
router.get('/mutual-friends/:userId', friendshipController.getMutualFriends);

// Pobieranie sugestii znajomych
router.get('/suggestions', friendshipController.getFriendSuggestions);

// Aktualizacja ustawień powiadomień
router.put('/notifications/:friendshipId', friendshipController.updateNotificationSettings);

// Statystyki znajomych
router.get('/stats', friendshipController.getFriendsStats);

module.exports = router; 