const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken, requireAdmin } = require('../middleware/authMiddleware');

// Trasy wymagające autoryzacji
router.use(authenticateToken);

// Tworzenie zamówienia
router.post('/', orderController.createOrder);

// Pobieranie zamówień użytkownika
router.get('/my-orders', orderController.getUserOrders);

// Pobieranie pojedynczego zamówienia
router.get('/:id', orderController.getOrder);

// Anulowanie zamówienia
router.post('/:id/cancel', orderController.cancelOrder);

// Generowanie faktury
router.post('/:id/invoice', orderController.generateInvoice);

// Dodawanie zwrotu
router.post('/:id/return', orderController.addReturn);

// Trasy tylko dla adminów
router.get('/admin/all', requireAdmin, orderController.getAllOrders);
router.get('/admin/stats', requireAdmin, orderController.getOrderStats);
router.put('/admin/:id/status', requireAdmin, orderController.updateOrderStatus);

module.exports = router; 