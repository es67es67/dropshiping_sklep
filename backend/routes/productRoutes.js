const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/', authenticateToken, productController.createProduct);
router.get('/user', authenticateToken, productController.getUserProducts);
router.get('/shop/:shopId', productController.getShopProducts);
router.get('/local', productController.getLocalProducts);
router.get('/search', productController.searchProducts);
router.get('/', productController.getProducts);
router.put('/:id', authenticateToken, productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);

module.exports = router;
