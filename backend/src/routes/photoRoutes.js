const express = require('express');
const router = express.Router();
const {
  getPhotos,
  getPhotoStats,
  searchPhotos,
  getPhotosByCategory,
  savePhotos,
  addPhoto,
  updatePhoto,
  deletePhoto,
  toggleFavorite
} = require('../controllers/photosController');
const { protect } = require('../middleware/auth');

// GET /api/photos - Get user's photos
router.get('/', protect, getPhotos);

// GET /api/photos/stats - Get photo statistics
router.get('/stats', protect, getPhotoStats);

// GET /api/photos/search - Search photos
router.get('/search', protect, searchPhotos);

// GET /api/photos/category/:category - Get photos by category
router.get('/category/:category', protect, getPhotosByCategory);

// POST /api/photos - Save entire photos collection
router.post('/', protect, savePhotos);

// POST /api/photos/add - Add single photo
router.post('/add', protect, addPhoto);

// PUT /api/photos/:photoId - Update photo
router.put('/:photoId', protect, updatePhoto);

// DELETE /api/photos/:photoId - Delete photo
router.delete('/:photoId', protect, deletePhoto);

// PATCH /api/photos/:photoId/favorite - Toggle photo favorite
router.patch('/:photoId/favorite', protect, toggleFavorite);

module.exports = router;