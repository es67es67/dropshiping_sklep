const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Publiczne trasy (bez autoryzacji)
router.post('/register', userController.register);
router.post('/login', userController.login);

// Trasy wymagające autoryzacji
router.use(authMiddleware.authenticateToken);

// Podstawowe operacje
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/', userController.getUsers);
router.get('/search/teryt', userController.searchUsersByTeryt);
router.get('/radius', userController.getUsersInRadius);

module.exports = router;
