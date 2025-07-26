const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

function safeRoute(method, path, ...handlers) {
  // Ostatni handler musi być funkcją
  const last = handlers[handlers.length - 1];
  if (typeof last === 'function') {
    router[method](path, ...handlers);
  } else {
    console.warn(`⚠️  Handler dla ${method.toUpperCase()} ${path} nie jest funkcją! Pomijam trasę.`);
  }
}

// Publiczne routes
safeRoute('post', '/register', userController.register);
safeRoute('post', '/login', userController.login);
safeRoute('get', '/search', userController.searchUsers);
safeRoute('get', '/status', (req, res) => res.json({ status: 'OK', message: 'Users API działa poprawnie' }));

// Chronione routes
safeRoute('get', '/profile', authMiddleware.authenticateToken, userController.getMyProfile);
safeRoute('get', '/profile/:id', authMiddleware.authenticateToken, userController.getProfile);
safeRoute('put', '/profile', authMiddleware.authenticateToken, userController.updateProfile);
safeRoute('post', '/follow/:userId', authMiddleware.authenticateToken, userController.followUser);
safeRoute('get', '/', authMiddleware.authenticateToken, userController.list);

// Layout settings routes
safeRoute('post', '/layout-settings', authMiddleware.authenticateToken, userController.saveLayoutSettings);
safeRoute('get', '/layout-settings/:type', authMiddleware.authenticateToken, userController.getLayoutSettings);

module.exports = router; 