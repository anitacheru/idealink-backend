const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const {
  expressInterest,
  getMyInterests,
  getIdeaInterests,
  removeInterest
} = require('../controller/interestcontroller');

// Express interest (authenticated investors)
router.post('/', authenticate, expressInterest);

// Get my interests (authenticated investors)
router.get('/my-interests', authenticate, getMyInterests);

// Get interests for a specific idea (authenticated idea owners)
router.get('/idea/:ideaId', authenticate, getIdeaInterests);

// Remove interest (authenticated)
router.delete('/:id', authenticate, removeInterest);

module.exports = router;