const express = require('express');
const router = express.Router();
const invitationWishController = require('../controllers/invitationWishController');

router.get('/:invitationId/wishes', invitationWishController.getWishes);
router.post('/:invitationId/wishes', invitationWishController.createWish);

module.exports = router;