const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Publiczne trasy
router.get('/active', auctionController.getActiveAuctions);
router.get('/:productId/bids', auctionController.getBidHistory);

// Chronione trasy (wymagają autoryzacji)
router.post('/:productId/bid', authenticateToken, auctionController.placeBid);
router.put('/:productId/end', authenticateToken, auctionController.endAuction);
router.get('/:productId/winners', authenticateToken, auctionController.getAuctionWinners);

module.exports = router; 