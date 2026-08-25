const express = require('express');
const router = express.Router();
const invitationController = require('../controllers/invitationController');
const invitationRsvpController = require('../controllers/invitationRsvpController');
const { protect } = require('../middleware/authMiddleware');

// Auth required: render/refresh the current user's single preview invitation file
router.post('/render', protect, invitationController.renderInvitation);

// Auth required: persist the invitation link to the current user's account
router.post('/generate', protect, invitationController.generateInvitation);

// Get the current user's invitation (for editing)
router.get('/mine', protect, invitationController.getMyInvitation);

// Delete the current user's invitation
router.delete('/', protect, invitationController.deleteInvitation);

// Public RSVP submission and private RSVP results for the invitation owner
router.post('/:invitationId/rsvp', invitationRsvpController.createRsvp);
router.get('/mine/rsvps', protect, invitationRsvpController.getMyRsvps);

// Public: resolve a shareable slug to its backend file URL
router.get('/:slug', invitationController.getInvitationBySlug);

module.exports = router;
