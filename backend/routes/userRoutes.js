const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Dodajemy szczegółowe logowanie wszystkich funkcji z kontrolera
console.log('🔍 Sprawdzanie funkcji w userController:');
console.log('register:', typeof userController.register, userController.register ? '✅' : '❌');
console.log('login:', typeof userController.login, userController.login ? '✅' : '❌');
console.log('searchUsers:', typeof userController.searchUsers, userController.searchUsers ? '✅' : '❌');
console.log('getMyProfile:', typeof userController.getMyProfile, userController.getMyProfile ? '✅' : '❌');
console.log('getProfile:', typeof userController.getProfile, userController.getProfile ? '✅' : '❌');
console.log('updateProfile:', typeof userController.updateProfile, userController.updateProfile ? '✅' : '❌');
console.log('followUser:', typeof userController.followUser, userController.followUser ? '✅' : '❌');
console.log('list:', typeof userController.list, userController.list ? '✅' : '❌');
console.log('saveLayoutSettings:', typeof userController.saveLayoutSettings, userController.saveLayoutSettings ? '✅' : '❌');
console.log('getLayoutSettings:', typeof userController.getLayoutSettings, userController.getLayoutSettings ? '✅' : '❌');

// Sprawdzamy middleware - authMiddleware to obiekt z funkcjami
console.log('🔍 Sprawdzanie authMiddleware:');
console.log('  Typ:', typeof authMiddleware, authMiddleware ? '✅' : '❌');
console.log('  authenticateToken:', typeof authMiddleware.authenticateToken, authMiddleware.authenticateToken ? '✅' : '❌');
console.log('  requireRole:', typeof authMiddleware.requireRole, authMiddleware.requireRole ? '✅' : '❌');
console.log('  requireAdmin:', typeof authMiddleware.requireAdmin, authMiddleware.requireAdmin ? '✅' : '❌');

function safeRoute(method, path, ...handlers) {
  console.log(`\n🛣️  Rejestracja trasy: ${method.toUpperCase()} ${path}`);
  
  // Logujemy wszystkie handlery
  handlers.forEach((handler, index) => {
    console.log(`  Handler ${index + 1}:`, typeof handler, handler ? '✅' : '❌');
    if (handler && handler.name) {
      console.log(`    Nazwa: ${handler.name}`);
    }
    if (handler === undefined) {
      console.log(`    ⚠️  Handler ${index + 1} jest undefined!`);
    }
  });
  
  // Ostatni handler musi być funkcją
  const last = handlers[handlers.length - 1];
  if (typeof last === 'function') {
    router[method](path, ...handlers);
    console.log(`  ✅ Trasa ${method.toUpperCase()} ${path} zarejestrowana pomyślnie`);
  } else {
    console.warn(`⚠️  Handler dla ${method.toUpperCase()} ${path} nie jest funkcją! Pomijam trasę.`);
    console.warn('Typ handlera:', typeof last, '| Handler:', last);
    if (last === undefined) {
      console.warn('Handler jest undefined! Sprawdź eksport w kontrolerze.');
    }
    if (last && last.name) {
      console.warn('Nazwa handlera:', last.name);
    }
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

console.log('\n📋 Podsumowanie zarejestrowanych tras:');
console.log('Router stack length:', router.stack.length);

module.exports = router;
