const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/auth');

const {
  expressInterest,
  getMyInterests,
  getIdeaInterests,
  removeInterest,
  getAllInterests,      // ADD THIS
  updateInterestStatus  // ADD THIS
} = require('../controller/interestcontroller');

// Express interest (authenticated investors)
router.post('/interest', authenticate, expressInterest);

// Get my interests
router.get('/my-interests', authenticate, getMyInterests);

// Get ALL interests (for admin) - ADD THIS
router.get('/', authenticate, getAllInterests);

// Get interests for a specific idea
router.get('/idea/:ideaId', authenticate, getIdeaInterests);

// Update interest status (accept/reject) - ADD THIS
router.put('/:id', authenticate, updateInterestStatus);

// Remove interest
router.delete('/:id', authenticate, removeInterest);

module.exports = router;