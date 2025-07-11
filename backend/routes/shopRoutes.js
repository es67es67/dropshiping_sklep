const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadShop } = require('../middleware/uploadMiddleware');

// Podstawowe operacje CRUD
router.post('/', authMiddleware, shopController.createShop);
router.post('/:id/upload', authMiddleware, uploadShop, shopController.uploadImages);
router.get('/user', authMiddleware, shopController.getUserShops);
router.get('/search', shopController.searchShops);
// Route dla pobierania wszystkich sklepów (musi być przed /:id)
router.get('/', shopController.getAllShops);
// Route dla pobierania wszystkich sklepów (włącznie z nieaktywnymi)
router.get('/all', shopController.getAllShopsIncludingInactive);
router.get('/:id', shopController.getShop);
router.put('/:id', authMiddleware, shopController.updateShop);
router.delete('/:id', authMiddleware, shopController.deleteShop);

// Recenzje i oceny
router.post('/:id/review', authMiddleware, shopController.addReview);

// Obserwowanie sklepu
router.post('/:id/follow', authMiddleware, shopController.toggleFollow);

// Stories
router.post('/:id/story', authMiddleware, shopController.addStory);

// Live Shopping
router.post('/:id/live/start', authMiddleware, shopController.startLiveStream);
router.post('/:id/live/:streamId/end', authMiddleware, shopController.endLiveStream);

// Wydarzenia
router.post('/:id/event', authMiddleware, shopController.addEvent);

// Statystyki (tylko dla właściciela)
router.get('/:id/stats', authMiddleware, shopController.getShopStats);

module.exports = router;
