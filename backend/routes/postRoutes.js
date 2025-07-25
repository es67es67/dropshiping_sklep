const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

// Wszystkie routes wymagają autoryzacji
router.use(authMiddleware.authenticateToken);

// Posty
router.post('/', postController.createPost);
router.get('/user', postController.getUserPosts);
router.get('/', postController.getPosts);
router.get('/:id', postController.getPost);
router.delete('/:id', postController.deletePost);

// Interakcje
router.post('/:id/like', postController.toggleLike);
router.post('/:id/comment', postController.addComment);

// NOWE ENDPOINTY DLA PROFILU UŻYTKOWNIKA

// Pobierz posty konkretnego użytkownika (publiczne)
router.get('/user/:userId', postController.getUserPostsPublic);

// Polub/odlub post (alias)
router.post('/:id/like', postController.likePost);

module.exports = router;
