const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 🟡 SHARED API ROUTES: /api/products
// Zależności: MongoDB products collection, auth middleware
// Wpływ: WSZYSTKIE operacje na produktach (12+ komponentów)
// Jeśli się zepsuje: wszystkie listy i szczegóły produktów nie działają
// Używane w: Products, ProductList, ProductDetails, ShopProducts, ProductManagement, etc.

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
