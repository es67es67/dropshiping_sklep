
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.authenticateToken, reviewController.addReview);
router.get('/:id', reviewController.getReviews);

module.exports = router;
