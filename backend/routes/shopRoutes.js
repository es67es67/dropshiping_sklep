const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const authMiddleware = require('../middleware/authMiddleware');

// 🟡 SHARED API ROUTES: /api/shops
// Zależności: MongoDB shops collection, auth middleware
// Wpływ: WSZYSTKIE operacje na sklepach (15+ komponentów)
// Jeśli się zepsuje: wszystkie listy i szczegóły sklepów nie działają
// Używane w: ShopList, ShopDetails, MyShops, ShopManagement, Country, TerytSearch, etc.
const { uploadShop } = require('../middleware/uploadMiddleware');

// Publiczne trasy (bez autoryzacji)
router.get('/', shopController.getShops);
router.get('/search/teryt', shopController.searchShopsByTeryt);
router.get('/radius', shopController.getShopsInRadius);

// Trasy wymagające autoryzacji
router.use(authMiddleware.authenticateToken);

router.post('/', shopController.createShop);
router.post('/:id/upload', uploadShop, shopController.uploadImages);
router.get('/user', shopController.getUserShops);
router.get('/search', shopController.searchShops);
// Route dla pobierania wszystkich sklepów (włącznie z nieaktywnymi)
router.get('/all', shopController.getAllShopsIncludingInactive);
router.put('/:id', shopController.updateShop);
router.delete('/:id', shopController.deleteShop);

// Publiczne trasy (po autoryzacji, ale przed /:id)
router.get('/:id', shopController.getShop); // Przeniesione tutaj - publiczny dostęp

// Publiczne trasy (po autoryzacji, ale przed /:id)
// router.get('/:id', shopController.getShop); // Usunięte stąd

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
