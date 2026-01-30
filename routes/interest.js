const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/auth'); // ✅ correct (default export)

const {
  expressInterest,
  getMyInterests,
  getIdeaInterests,
  removeInterest
} = require('../controller/interestcontroller'); // ✅ casing fixed

// Express interest (authenticated investors)
router.post('/interest', authenticate, expressInterest);

// Get my interests
router.get('/my-interests', authenticate, getMyInterests);

// Get interests for a specific idea
router.get('/idea/:ideaId', authenticate, getIdeaInterests);

// Remove interest
router.delete('/:id', authenticate, removeInterest);

module.exports = router;
