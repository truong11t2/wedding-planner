const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  socialLogin, 
  getMe: getProfile 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/social', socialLogin);
router.get('/profile', protect, getProfile);

module.exports = router;