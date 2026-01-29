const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth'); // FIXED import

const {
  getCommentsByIdea,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController'); // Ensure correct path

// Get all comments for an idea (public)
router.get('/idea/:ideaId', getCommentsByIdea);

// Create a comment (authenticated)
router.post('/', authenticate, createComment);

// Update a comment (authenticated, owner only)
router.put('/:id', authenticate, updateComment);

// Delete a comment (authenticated, owner only)
router.delete('/:id', authenticate, deleteComment);

module.exports = router;
