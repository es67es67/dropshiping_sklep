const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.authenticateToken, groupController.createGroup);
router.post('/:groupId/events', authMiddleware.authenticateToken, groupController.addEvent);

module.exports = router;
