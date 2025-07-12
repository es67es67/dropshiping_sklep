const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { authenticateToken, requireShopOwner } = require('../middleware/authMiddleware');
const { uploadShop } = require('../middleware/uploadMiddleware');

// Podstawowe operacje CRUD
router.post('/', authenticateToken, shopController.createShop);
router.post('/:id/upload', authenticateToken, uploadShop, shopController.uploadImages);
router.get('/user', authenticateToken, shopController.getUserShops);
router.get('/search', shopController.searchShops);
// Route dla pobierania wszystkich sklepów (musi być przed /:id)
router.get('/', shopController.getAllShops);
// Route dla pobierania wszystkich sklepów (włącznie z nieaktywnymi)
router.get('/all', shopController.getAllShopsIncludingInactive);
router.get('/:id', shopController.getShop);
router.put('/:id', authenticateToken, shopController.updateShop);
router.delete('/:id', authenticateToken, shopController.deleteShop);

// Recenzje i oceny
router.post('/:id/review', authenticateToken, shopController.addReview);

// Obserwowanie sklepu
router.post('/:id/follow', authenticateToken, shopController.toggleFollow);

// Stories
router.post('/:id/story', authenticateToken, shopController.addStory);

// Live Shopping
router.post('/:id/live/start', authenticateToken, shopController.startLiveStream);
router.post('/:id/live/:streamId/end', authenticateToken, shopController.endLiveStream);

// Wydarzenia
router.post('/:id/event', authenticateToken, shopController.addEvent);

// Statystyki (tylko dla właściciela)
router.get('/:id/stats', authenticateToken, shopController.getShopStats);

module.exports = router;
