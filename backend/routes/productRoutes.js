const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Publiczne trasy
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/shop/:shopId', productController.getProductsByShop);
router.get('/:id', productController.getProduct);

// Chronione trasy (wymagają autoryzacji)
router.post('/', authenticateToken, productController.createProduct);
router.put('/:id', authenticateToken, productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);
router.post('/:id/rating', authenticateToken, productController.addRating);

module.exports = router;
