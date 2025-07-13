const express = require('express');
const router = express.Router();
const loyaltyController = require('../controllers/loyaltyController');
const authMiddleware = require('../middleware/authMiddleware');

// Wszystkie trasy wymagają autoryzacji
router.use(authMiddleware.authenticateToken);

// Pobieranie informacji o lojalności użytkownika
router.get('/', loyaltyController.getUserLoyalty);

// Pobieranie historii lojalności
router.get('/history', loyaltyController.getLoyaltyHistory);

// Pobieranie odznak użytkownika
router.get('/badges', loyaltyController.getUserBadges);

// Sprawdzanie i przyznawanie odznak
router.post('/check-badges', loyaltyController.checkBadges);

// Generowanie kuponu zniżkowego
router.post('/generate-coupon', loyaltyController.generateDiscountCoupon);

// Pobieranie dostępnych nagród
router.get('/rewards', loyaltyController.getAvailableRewards);

// Wykupienie nagrody
router.post('/redeem', loyaltyController.redeemReward);

// Pobieranie informacji o poziomach
router.get('/levels', loyaltyController.getLevelsInfo);

// Pobieranie rankingu użytkowników
router.get('/leaderboard', loyaltyController.getLeaderboard);

// Statystyki lojalności (tylko dla adminów)
router.get('/stats', authMiddleware.requireAdmin, loyaltyController.getLoyaltyStats);

// Resetowanie punktów użytkownika (tylko dla adminów)
router.post('/reset/:userId', authMiddleware.requireAdmin, loyaltyController.resetUserPoints);

// Dodawanie punktów użytkownikowi (tylko dla adminów)
router.post('/add-points/:userId', authMiddleware.requireAdmin, loyaltyController.addUserPoints);

module.exports = router; 