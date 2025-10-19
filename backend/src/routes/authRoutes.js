const express = require('express');
const router = express.Router();
const {
  register,
  login,
  // logout,
  getProfile,
  // updateProfile,
  socialLogin,
  saveWeddingDate
} = require('../controllers/authController');

// Import timeline controller functions
const {
  saveTimelineItem,
  saveTimelineSelection,
  saveTimelineTextInputs,
  getUserTimeline,
  saveCompleteTimeline,
  clearUserTimeline,
  deleteTimelineItem
} = require('../controllers/timelineController');

const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
// router.post('/logout', logout);
router.post('/social-login', socialLogin);

// Protected routes
router.get('/profile', protect, getProfile);
// router.put('/profile/update', protect, updateProfile);
router.post('/wedding-date', protect, saveWeddingDate);

// Timeline routes (protected)
router.get('/timeline', protect, getUserTimeline);
router.post('/timeline/item', protect, saveTimelineItem);
router.post('/timeline/selection', protect, saveTimelineSelection);
router.post('/timeline/text-inputs', protect, saveTimelineTextInputs);
router.post('/timeline/bulk', protect, saveCompleteTimeline);
router.delete('/timeline/clear', protect, clearUserTimeline);
router.delete('/timeline/item/:itemId', protect, deleteTimelineItem);

module.exports = router;