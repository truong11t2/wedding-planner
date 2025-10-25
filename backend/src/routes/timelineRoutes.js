const express = require('express');
const router = express.Router();
const {
  saveTimeline,
  loadTimeline,
  deleteTimeline,
  getTimelineStatus,
} = require('../controllers/timelineController');
const { protect } = require('../middleware/auth');

// POST /api/timeline/save - Save timeline to user profile
router.post('/save', protect, saveTimeline);

// GET /api/timeline/get - Get timeline from user profile
router.get('/get', protect, loadTimeline);

// DELETE /api/timeline/delete - Delete timeline from user profile
router.delete('/delete', protect, deleteTimeline);

// GET /api/timeline/status - Get timeline status
router.get('/status', protect, getTimelineStatus);

module.exports = router;