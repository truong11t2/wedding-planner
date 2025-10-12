const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  socialLogin, 
  getProfile,
  saveWeddingDate
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/social', socialLogin);
router.get('/profile', protect, getProfile);
router.post('/wedding-date', protect, saveWeddingDate);

module.exports = router;