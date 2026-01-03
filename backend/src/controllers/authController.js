const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');


// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

const { validationResult } = require('express-validator');

// @desc    Google OAuth initiation
// @route   GET /api/auth/google
// @access  Public
exports.initiateGoogleAuth = (req, res, next) => {
  // This will be handled by passport middleware
  next();
};

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
// @access  Public
exports.googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      console.error('No user found in Google callback');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }

    // Generate JWT token
    const token = generateToken(req.user.id);

    console.log('Generated JWT token for Google user:', req.user.email);

    // Set HTTP-only cookie with the token
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      path: '/',
    });

    // Redirect to frontend callback WITHOUT token in URL
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?provider=google`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
  }
};

// @desc    Facebook OAuth initiation
// @route   GET /api/auth/facebook
// @access  Public
exports.initiateFacebookAuth = (req, res, next) => {
  // This will be handled by passport middleware
  next();
};

// @desc    Facebook OAuth callback
// @route   GET /api/auth/facebook/callback
// @access  Public
exports.facebookCallback = async (req, res) => {
  try {
    if (!req.user) {
      console.error('No user found in Facebook callback');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=facebook_auth_failed`);
    }

    // Generate JWT token
    const token = generateToken(req.user.id);

    console.log('Generated JWT token for Facebook user:', req.user.email);

    // Set HTTP-only cookie with the token
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      path: '/',
    });

    // Redirect to frontend callback WITHOUT token in URL
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?provider=facebook`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Facebook callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
  }
};

// @desc    Twitter OAuth (not implemented)
// @route   GET /api/auth/twitter
// @access  Public
exports.initiateTwitterAuth = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Twitter OAuth not implemented yet',
    error: 'NOT_IMPLEMENTED'
  });
};

// @desc    Outlook OAuth (not implemented)
// @route   GET /api/auth/outlook
// @access  Public
exports.initiateOutlookAuth = (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Outlook OAuth not implemented yet',
    error: 'NOT_IMPLEMENTED'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      provider: 'local'
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user registered with social login
    if (!user.password && (user.googleId || user.facebookId)) {
      return res.status(400).json({
        success: false,
        message: 'Please use social login to access your account',
        socialProvider: user.googleId ? 'Google' : 'Facebook'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        weddingDate: user.weddingDate,
        hasGeneratedTimeline: user.hasGeneratedTimeline,
        provider: user.provider,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, weddingDate } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (weddingDate) user.weddingDate = weddingDate;

    await user.save();

    console.log('User profile updated:', user.email);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        weddingDate: user.weddingDate,
        provider: user.provider,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  try {
    // Clear the authToken cookie
    res.cookie('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      expires: new Date(0), // Set expiry to past date
      path: '/',
    });

    // If using sessions, destroy them
    if (req.session) {
      req.session.destroy();
    }

    console.log('User logged out, cookie cleared');

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout'
    });
  }
};

// @desc    Link social account to existing account
// @route   POST /api/auth/link-social
// @access  Private
exports.linkSocialAccount = async (req, res) => {
  try {
    const { provider, socialId } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update social ID based on provider
    if (provider === 'google') {
      user.googleId = socialId;
    } else if (provider === 'facebook') {
      user.facebookId = socialId;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unsupported social provider'
      });
    }

    await user.save();

    res.json({
      success: true,
      message: `${provider} account linked successfully`
    });
  } catch (error) {
    console.error('Link social account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// @desc    Unlink social account
// @route   POST /api/auth/unlink-social
// @access  Private
exports.unlinkSocialAccount = async (req, res) => {
  try {
    const { provider } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has password (can't unlink if no password)
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'Cannot unlink social account without setting a password first'
      });
    }

    // Remove social ID based on provider
    if (provider === 'google') {
      user.googleId = null;
    } else if (provider === 'facebook') {
      user.facebookId = null;
    } else {
      return res.status(400).json({
        success: false,
        message: 'Unsupported social provider'
      });
    }

    await user.save();

    res.json({
      success: true,
      message: `${provider} account unlinked successfully`
    });
  } catch (error) {
    console.error('Unlink social account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};