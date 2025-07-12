const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware.authenticateToken, messageController.sendMessage);
router.get('/', authMiddleware.authenticateToken, messageController.getMessages);

module.exports = router;
