const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const { 
  register, 
  login, 
  logout, 
  getProfile, 
  saveWeddingDate,
  updateProfile, 
  linkSocialAccount, 
  unlinkSocialAccount,
  initiateGoogleAuth, 
  googleCallback, 
  initiateFacebookAuth, 
  facebookCallback, 
  initiateTwitterAuth, 
  initiateOutlookAuth
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Regular authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', protect, getProfile);
router.post('/wedding-date', protect, saveWeddingDate);
router.put('/profile', protect, updateProfile);
router.post('/link-social', protect, linkSocialAccount);
router.post('/unlink-social', protect, unlinkSocialAccount);

// Google OAuth routes
router.get('/google', 
  initiateGoogleAuth,
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    session: false 
  }),
  googleCallback
);

// Facebook OAuth routes
router.get('/facebook', 
  initiateFacebookAuth,
  passport.authenticate('facebook', { 
    scope: ['email'] 
  })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=facebook_auth_failed`,
    session: false 
  }),
  facebookCallback
);

// Social OAuth routes (not implemented yet)
router.get('/twitter', initiateTwitterAuth);
router.get('/outlook', initiateOutlookAuth);

module.exports = router;