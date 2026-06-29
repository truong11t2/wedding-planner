const express = require('express');
const router = express.Router();
const {
  saveWeddingDate,
  saveTimeline,
  loadTimeline,
  addSelectedVendor,
  deleteTimeline,
  getTimelineStatus,
} = require('../controllers/timelineController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/timeline/wedding-date - Save wedding date to user profile
router.post('/wedding-date', protect, saveWeddingDate);

// POST /api/timeline/save - Save timeline to user profile
router.post('/', protect, saveTimeline);

// POST /api/timeline/select-vendor - Add a vendor to user's timeline
router.post('/select-vendor', protect, addSelectedVendor);

// GET /api/timeline/get - Get timeline from user profile
router.get('/', protect, loadTimeline);

// DELETE /api/timeline/delete - Delete timeline from user profile
router.delete('/', protect, deleteTimeline);

// GET /api/timeline/status - Get timeline status
router.get('/status', protect, getTimelineStatus);

module.exports = router;