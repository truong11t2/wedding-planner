const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google OAuth profile:', profile);
    
    // Check if user already exists with this Google ID
    let user = await User.findOne({
      where: { googleId: profile.id }
    });

    if (user) {
      console.log('Existing Google user found:', user.email);
      return done(null, user);
    }

    // Check if user exists with same email
    user = await User.findOne({
      where: { email: profile.emails[0].value }
    });

    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      user.avatar = profile.photos[0]?.value || user.avatar;
      await user.save();
      console.log('Linked Google account to existing user:', user.email);
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      googleId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      avatar: profile.photos[0]?.value,
      isEmailVerified: true, // Google emails are pre-verified
      provider: 'google'
    });

    console.log('Created new Google user:', user.email);
    done(null, user);
  } catch (error) {
    console.error('Google OAuth error:', error);
    done(error, null);
  }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL || "/api/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name', 'picture.type(large)']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Facebook OAuth profile:', profile);
    
    // Check if user already exists with this Facebook ID
    let user = await User.findOne({
      where: { facebookId: profile.id }
    });

    if (user) {
      console.log('Existing Facebook user found:', user.email);
      return done(null, user);
    }

    // Check if user exists with same email
    if (profile.emails && profile.emails[0]) {
      user = await User.findOne({
        where: { email: profile.emails[0].value }
      });

      if (user) {
        // Link Facebook account to existing user
        user.facebookId = profile.id;
        user.avatar = profile.photos[0]?.value || user.avatar;
        await user.save();
        console.log('Linked Facebook account to existing user:', user.email);
        return done(null, user);
      }
    }

    // Create new user
    user = await User.create({
      facebookId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails ? profile.emails[0].value : null,
      avatar: profile.photos[0]?.value,
      isEmailVerified: profile.emails ? true : false,
      provider: 'facebook'
    });

    console.log('Created new Facebook user:', user.email);
    done(null, user);
  } catch (error) {
    console.error('Facebook OAuth error:', error);
    done(error, null);
  }
}));

module.exports = passport;