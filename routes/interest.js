const express = require('express');
const { expressInterest, getInterests, updateInterest } = require('../controller/interestcontroller');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, expressInterest);       // investor expresses interest
router.get('/', auth, getInterests);           // list interests
router.put('/:id', auth, updateInterest);      // accept/reject interest

module.exports = router;
