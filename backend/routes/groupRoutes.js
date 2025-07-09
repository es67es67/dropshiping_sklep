const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, groupController.createGroup);
router.post('/:groupId/events', authMiddleware, groupController.addEvent);

module.exports = router;
