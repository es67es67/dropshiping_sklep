const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 🟡 SHARED API ROUTES: /api/categories
// Zależności: MongoDB categories collection, auth middleware
// Wpływ: Zarządzanie kategoriami produktów
// Jeśli się zepsuje: brak możliwości zarządzania kategoriami
// Używane w: CategoryManagement, ProductCreate, Products

// Publiczne trasy
router.get('/', categoryController.getCategories);
router.get('/menu', categoryController.getMenuCategories);
router.get('/homepage', categoryController.getHomepageCategories);
router.get('/:id', categoryController.getCategory);
router.get('/:id/breadcrumbs', categoryController.getCategoryBreadcrumbs);

// Chronione trasy (wymagają autoryzacji)
router.post('/', authenticateToken, categoryController.createCategory);
router.put('/:id', authenticateToken, categoryController.updateCategory);
router.delete('/:id', authenticateToken, categoryController.deleteCategory);

module.exports = router; 