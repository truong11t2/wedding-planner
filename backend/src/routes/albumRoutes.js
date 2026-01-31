const express = require('express');
const router = express.Router();
const albumController = require('../controllers/albumController');
const { protect } = require('../middleware/authMiddleware');

// Generate album
router.post('/generate', protect, albumController.generateAlbum);

// Update album
router.put('/update', protect, albumController.updateAlbum);

// Get user's album
router.get('/', protect, albumController.getAlbum);

// Delete album
router.delete('/', protect, albumController.deleteAlbum);

module.exports = router;
