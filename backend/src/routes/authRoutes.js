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
  initiateOutlookAuth,
  sanitizeReturnTo
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

/**
 * Kick off an OAuth flow, carrying the post-login destination through the
 * provider's `state` parameter.
 *
 * The destination cannot live in the frontend's `sessionStorage` because the
 * OAuth callback always returns on `FRONTEND_URL`, which may differ from the
 * origin the user started on (e.g. `192.168.1.40:3000` vs `localhost:3000`).
 * `state` survives the round-trip regardless of origin.
 */
function authenticateWithReturnTo(strategy) {
  return (req, res, next) => {
    const returnTo = sanitizeReturnTo(req.query.returnTo);

    passport.authenticate(strategy, {
      scope: strategy === 'google' ? ['profile', 'email'] : ['email'],
      ...(returnTo ? { state: returnTo } : {})
    })(req, res, next);
  };
}

// Regular authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/link-social', protect, linkSocialAccount);
router.post('/unlink-social', protect, unlinkSocialAccount);

// Google OAuth routes
router.get('/google', initiateGoogleAuth, authenticateWithReturnTo('google'));

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_auth_failed`,
    session: false 
  }),
  googleCallback
);

// Facebook OAuth routes
router.get('/facebook', initiateFacebookAuth, authenticateWithReturnTo('facebook'));

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