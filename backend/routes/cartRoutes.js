const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Wszystkie trasy wymagają autoryzacji
router.use(authenticateToken);

// Pobieranie koszyka
router.get('/', cartController.getCart);

// Dodawanie produktu do koszyka
router.post('/add', cartController.addToCart);

// Aktualizacja ilości
router.put('/update', cartController.updateQuantity);

// Usuwanie produktu z koszyka
router.delete('/remove/:itemId', cartController.removeFromCart);

// Czyszczenie koszyka
router.delete('/clear', cartController.clearCart);

// Aplikowanie kuponu
router.post('/coupon', cartController.applyCoupon);

// Usuwanie kuponu
router.delete('/coupon', cartController.removeCoupon);

// Aktualizacja dostawy
router.put('/shipping', cartController.updateShipping);

// Podsumowanie koszyka
router.get('/summary', cartController.getCartSummary);

module.exports = router; 