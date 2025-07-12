const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, productController.createProduct);
router.get('/user', authMiddleware, productController.getUserProducts);
router.get('/shop/:shopId', productController.getShopProducts);
router.get('/local', productController.getLocalProducts);
router.get('/search', productController.searchProducts);
router.get('/', productController.getProducts);
router.put('/:id', authMiddleware, productController.updateProduct);
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
