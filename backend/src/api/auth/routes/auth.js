const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const authController = require('../controllers/auth');

router.post('/signup', userController.registerUser);

router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

module.exports = router;