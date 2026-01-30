const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/adminauth');
const {
  getDashboardStats,
  getPendingIdeas,
  approveIdea,
  rejectIdea,
  getAllUsers,
  deleteUser,
  deleteIdea
} = require('../controller/admincontroller');

// All routes require admin authentication
router.use(adminAuth);

// Dashboard stats
router.get('/stats', getDashboardStats);

// Ideas management
router.get('/ideas/pending', getPendingIdeas);
router.put('/ideas/:id/approve', approveIdea);
router.put('/ideas/:id/reject', rejectIdea);
router.delete('/ideas/:id', deleteIdea);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;