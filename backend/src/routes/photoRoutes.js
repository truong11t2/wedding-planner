const express = require('express');
const router = express.Router();
const {
  getPhotos,
  getPhotoStats,
  searchPhotos,
  getPhotosByCategory,
  uploadPhotos,
  savePhotos,
  updatePhoto,
  deletePhoto,
  toggleFavorite,
  serveImage
} = require('../controllers/photosController');
const { protect } = require('../middleware/authMiddleware');
const { uploadMiddleware, debugFormData } = require('../middleware/uploadMiddleware'); // Import from middleware

// GET /api/photos - Get user's photos
router.get('/', protect, getPhotos);

// GET /api/photos/stats - Get photo statistics
router.get('/stats', protect, getPhotoStats);

// GET /api/photos/search - Search photos
router.get('/search', protect, searchPhotos);

// GET /api/photos/category/:category - Get photos by category
router.get('/category/:category', protect, getPhotosByCategory);

// GET /api/photos/serve/:userId/:size/:filename - Serve images
router.get('/serve/:userId/:size/:filename', protect, serveImage);

// POST /api/photos/upload - Upload and process photos
router.post('/upload', protect, uploadMiddleware, debugFormData, uploadPhotos);

// POST /api/photos - Save entire photos collection
router.post('/', protect, savePhotos);

// PUT /api/photos/:photoId - Update photo
router.put('/:photoId', protect, updatePhoto);

// DELETE /api/photos/:photoId - Delete photo
router.delete('/:photoId', protect, deletePhoto);

// PATCH /api/photos/:photoId/favorite - Toggle photo favorite
router.patch('/:photoId/favorite', protect, toggleFavorite);

module.exports = router;