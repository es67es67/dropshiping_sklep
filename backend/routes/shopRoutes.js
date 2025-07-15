const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadShop } = require('../middleware/uploadMiddleware');

// Publiczne trasy (bez autoryzacji)
router.get('/', shopController.getShops);
router.get('/search/teryt', shopController.searchShopsByTeryt);
router.get('/radius', shopController.getShopsInRadius);
router.get('/:id', shopController.getShop);

// Trasy wymagające autoryzacji
router.use(authMiddleware.authenticateToken);

router.post('/', shopController.createShop);
router.post('/:id/upload', uploadShop, shopController.uploadImages);
router.get('/user', shopController.getUserShops);
router.get('/search', shopController.searchShops);
// Route dla pobierania wszystkich sklepów (musi być przed /:id)
router.get('/', shopController.getAllShops);
// Route dla pobierania wszystkich sklepów (włącznie z nieaktywnymi)
router.get('/all', shopController.getAllShopsIncludingInactive);
router.put('/:id', shopController.updateShop);
router.delete('/:id', shopController.deleteShop);

// Recenzje i oceny
router.post('/:id/review', shopController.addReview);

// Obserwowanie sklepu
router.post('/:id/follow', shopController.toggleFollow);

// Stories
router.post('/:id/story', shopController.addStory);

// Live Shopping
router.post('/:id/live/start', shopController.startLiveStream);
router.post('/:id/live/:streamId/end', shopController.endLiveStream);

// Wydarzenia
router.post('/:id/event', shopController.addEvent);

// Statystyki (tylko dla właściciela)
router.get('/:id/stats', shopController.getShopStats);

module.exports = router;
