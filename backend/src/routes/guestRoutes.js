const express = require('express');
const router = express.Router();
const {
  getGuestList,
  getGuestStats,
  saveGuestList,
  addGuest,
  updateGuest,
  deleteGuest,
  updateRSVP
} = require('../controllers/guestController');
const { protect } = require('../middleware/auth');

// GET /api/guests - Get user's guest list
router.get('/', protect, getGuestList);

// GET /api/guests/stats - Get guest statistics
router.get('/stats', protect, getGuestStats);

// POST /api/guests - Save entire guest list
router.post('/', protect, saveGuestList);

// POST /api/guests/add - Add single guest
router.post('/add', protect, addGuest);

// PUT /api/guests/:guestId - Update guest
router.put('/:guestId', protect, updateGuest);

// DELETE /api/guests/:guestId - Delete guest
router.delete('/:guestId', protect, deleteGuest);

// PATCH /api/guests/:guestId/rsvp - Update RSVP status
router.patch('/:guestId/rsvp', protect, updateRSVP);

module.exports = router;