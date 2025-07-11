const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Publiczne routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/search', userController.searchUsers);

// Chronione routes
router.get('/profile', authMiddleware, userController.getMyProfile);
router.get('/profile/:id', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.post('/follow/:userId', authMiddleware, userController.followUser);
router.get('/', authMiddleware, userController.list);

// Layout settings routes
router.post('/layout-settings', authMiddleware, userController.saveLayoutSettings);
router.get('/layout-settings/:type', authMiddleware, userController.getLayoutSettings);

module.exports = router;
