const express = require('express');
const authController = require('../controller/authcontroller');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', authController.register);   // register new user
router.post('/login', authController.login);         // login
router.get('/profile', auth, authController.profile); // get logged-in user profile

module.exports = router;
