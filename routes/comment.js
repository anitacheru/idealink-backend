const express = require('express');
const router = express.Router();

// ✅ import middleware correctly
const authenticate = require('../middleware/auth'); 
// OR use { authenticate } depending on export

// ✅ correct controller path & casing
const {
  getCommentsByIdea,
  createComment,
  updateComment,
  deleteComment
} = require('../controller/commentcontroller');

// Get all comments for an idea (public)
router.get('/idea/:ideaId', getCommentsByIdea);

// Create a comment (authenticated)
router.post('/', authenticate, createComment);

// Update a comment (authenticated, owner only)
router.put('/:id', authenticate, updateComment);

// Delete a comment (authenticated, owner only)
router.delete('/:id', authenticate, deleteComment);

module.exports = router;
