const express = require('express');
const router = express.Router();
const {
  saveTimelineItem,
  saveTimelineSelection,
  saveTimelineTextInputs, // Add this new route
  getUserTimeline,
  saveCompleteTimeline,
  clearUserTimeline,
  deleteTimelineItem
} = require('../controllers/timelineController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get user's timeline
router.get('/', getUserTimeline);

// Save individual timeline item (structure/metadata)
router.post('/item', saveTimelineItem);

// Save single timeline option selection (radio or single text input)
router.post('/selection', saveTimelineSelection);

// Save multiple text inputs for a timeline item (bulk text input save)
router.post('/text-inputs', saveTimelineTextInputs);

// Save complete timeline (bulk operation)
router.post('/bulk', saveCompleteTimeline);

// Clear user's entire timeline
router.delete('/clear', clearUserTimeline);

// Delete specific timeline item
router.delete('/item/:itemId', deleteTimelineItem);

module.exports = router;