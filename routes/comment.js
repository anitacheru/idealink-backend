const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth'); // FIXED import

const commentController = require('../controller/commentcontroller');
// Ensure correct path

// Get all comments for an idea (public)
router.get('/idea/:ideaId', commentController.getCommentsByIdea);

// Create a comment (authenticated)
router.post('/', authenticate, commentController.createComment);

// Update a comment (authenticated, owner only)
router.put('/:id', authenticate, commentController.updateComment);

// Delete a comment (authenticated, owner only)
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;
