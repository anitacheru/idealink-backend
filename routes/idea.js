const express = require('express');
const ideaController = require('../controller/ideacontroller');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, ideaController.createIdea);      // create new idea
router.get('/', auth, ideaController.getIdeas);         // get all ideas
router.get('/:id', auth, ideaController.getIdeaById);   // get single idea

module.exports = router;
