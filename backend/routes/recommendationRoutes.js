const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middleware/authMiddleware');

// Wszystkie trasy wymagają autoryzacji
router.use(authMiddleware.authenticateToken);

// Pobieranie rekomendacji dla użytkownika
router.get('/', recommendationController.getUserRecommendations);

// Pobieranie rekomendacji dla produktu
router.get('/product/:productId', recommendationController.getProductRecommendations);

// Pobieranie popularnych produktów
router.get('/popular', recommendationController.getPopularProducts);

// Pobieranie trendujących produktów
router.get('/trending', recommendationController.getTrendingProducts);

// Śledzenie kliknięcia rekomendacji
router.post('/track-click', recommendationController.trackRecommendationClick);

// Śledzenie zakupu z rekomendacji
router.post('/track-purchase', recommendationController.trackRecommendationPurchase);

// Statystyki rekomendacji (tylko dla adminów)
router.get('/stats', authMiddleware.requireAdmin, recommendationController.getRecommendationStats);

// Czyszczenie cache rekomendacji (tylko dla adminów)
router.post('/clear-cache', authMiddleware.requireAdmin, recommendationController.clearRecommendationCache);

module.exports = router; 