const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Publiczne trasy (bez parametrów)
router.get('/', productController.getProducts);
router.get('/search', productController.searchProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/shop/:shopId', productController.getProductsByShop);

// Trasy z parametrami (muszą być po trasach bez parametrów)
router.get('/:productId/reviews', productController.getProductReviews);
router.get('/:id', productController.getProduct);

// Chronione trasy (wymagają autoryzacji)
router.post('/', authenticateToken, productController.createProduct);
router.put('/:id', authenticateToken, productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);
router.post('/:id/rating', authenticateToken, productController.addRating);
router.post('/:productId/reviews', authenticateToken, productController.addProductReview);

module.exports = router;
