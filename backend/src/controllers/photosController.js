const User = require('../models/User');

// Get user's photos
exports.getPhotos = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Return photos data or default empty array
    const photosData = user.photosData || [];

    res.status(200).json({
      success: true,
      data: photosData,
      message: 'Photos retrieved successfully'
    });

  } catch (error) {
    console.error('Get photos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving photos'
    });
  }
};

// Save user's entire photos collection
exports.savePhotos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { photos } = req.body;

    // Validate photos array
    if (!Array.isArray(photos)) {
      return res.status(400).json({
        success: false,
        message: 'Photos must be an array'
      });
    }

    // Validate each photo structure
    const isValidPhoto = (photo) => {
      return (
        photo &&
        typeof photo.id === 'string' &&
        typeof photo.url === 'string' &&
        typeof photo.thumbnailUrl === 'string' &&
        typeof photo.category === 'string' &&
        Array.isArray(photo.tags) &&
        typeof photo.isFavorite === 'boolean' &&
        photo.uploadDate
      );
    };

    const invalidPhotos = photos.filter(photo => !isValidPhoto(photo));
    if (invalidPhotos.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid photo format',
        invalidPhotos
      });
    }

    // Update user's photos
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.photosData = photos;
    await user.save();

    res.status(200).json({
      success: true,
      data: user.photosData,
      message: 'Photos saved successfully'
    });

  } catch (error) {
    console.error('Save photos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving photos'
    });
  }
};

// Add a single photo
exports.addPhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      url, 
      thumbnailUrl, 
      category, 
      tags, 
      description,
      name,
      size
    } = req.body;

    // Validate required fields
    if (!url || !thumbnailUrl || !category) {
      return res.status(400).json({
        success: false,
        message: 'URL, thumbnail URL, and category are required'
      });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get existing photos or initialize empty array
    const currentPhotos = user.photosData || [];
    
    // Generate new ID
    const newId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    // Create new photo
    const newPhoto = {
      id: newId,
      name: name || `photo-${newId}.jpg`,
      url: url.trim(),
      thumbnailUrl: thumbnailUrl.trim(),
      size: size || 0,
      uploadDate: new Date().toISOString(),
      category: category.trim(),
      tags: Array.isArray(tags) ? tags.map(tag => tag.trim()).filter(tag => tag) : [],
      isFavorite: false,
      description: description?.trim() || ''
    };

    // Add to photos list
    const updatedPhotos = [newPhoto, ...currentPhotos];
    user.photosData = updatedPhotos;
    await user.save();

    res.status(201).json({
      success: true,
      data: newPhoto,
      message: 'Photo added successfully'
    });

  } catch (error) {
    console.error('Add photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding photo'
    });
  }
};

// Update a photo
exports.updatePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { photoId } = req.params;
    const updates = req.body;

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentPhotos = user.photosData || [];
    const photoIndex = currentPhotos.findIndex(photo => photo.id === photoId);

    if (photoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Update the photo
    const updatedPhoto = { 
      ...currentPhotos[photoIndex], 
      ...updates,
      // Ensure we don't change the ID or uploadDate
      id: currentPhotos[photoIndex].id,
      uploadDate: currentPhotos[photoIndex].uploadDate
    };
    
    currentPhotos[photoIndex] = updatedPhoto;
    
    user.photosData = currentPhotos;
    await user.save();

    res.status(200).json({
      success: true,
      data: updatedPhoto,
      message: 'Photo updated successfully'
    });

  } catch (error) {
    console.error('Update photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating photo'
    });
  }
};

// Delete a photo
exports.deletePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { photoId } = req.params;

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentPhotos = user.photosData || [];
    const photoIndex = currentPhotos.findIndex(photo => photo.id === photoId);

    if (photoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Remove the photo
    const deletedPhoto = currentPhotos.splice(photoIndex, 1)[0];
    
    user.photosData = currentPhotos;
    await user.save();

    res.status(200).json({
      success: true,
      data: deletedPhoto,
      message: 'Photo deleted successfully'
    });

  } catch (error) {
    console.error('Delete photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting photo'
    });
  }
};

// Toggle photo favorite status
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { photoId } = req.params;

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentPhotos = user.photosData || [];
    const photoIndex = currentPhotos.findIndex(photo => photo.id === photoId);

    if (photoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Photo not found'
      });
    }

    // Toggle favorite status
    currentPhotos[photoIndex].isFavorite = !currentPhotos[photoIndex].isFavorite;
    
    user.photosData = currentPhotos;
    await user.save();

    res.status(200).json({
      success: true,
      data: currentPhotos[photoIndex],
      message: `Photo ${currentPhotos[photoIndex].isFavorite ? 'added to' : 'removed from'} favorites`
    });

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling favorite'
    });
  }
};

// Get photos by category
exports.getPhotosByCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category } = req.params;

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const photosData = user.photosData || [];
    const filteredPhotos = category === 'all' 
      ? photosData 
      : photosData.filter(photo => photo.category === category);

    res.status(200).json({
      success: true,
      data: filteredPhotos,
      message: 'Photos retrieved successfully'
    });

  } catch (error) {
    console.error('Get photos by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving photos'
    });
  }
};

// Get photo statistics
exports.getPhotoStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const photosData = user.photosData || [];
    
    const stats = {
      total: photosData.length,
      favorites: photosData.filter(p => p.isFavorite).length,
      categories: [...new Set(photosData.map(p => p.category))].length,
      totalSize: photosData.reduce((sum, photo) => sum + (photo.size || 0), 0),
      byCategory: {},
      recentUploads: photosData
        .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
        .slice(0, 5)
    };

    // Calculate photos by category
    photosData.forEach(photo => {
      if (!stats.byCategory[photo.category]) {
        stats.byCategory[photo.category] = 0;
      }
      stats.byCategory[photo.category]++;
    });

    res.status(200).json({
      success: true,
      data: stats,
      message: 'Photo statistics retrieved successfully'
    });

  } catch (error) {
    console.error('Get photo stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving photo statistics'
    });
  }
};

// Search photos
exports.searchPhotos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const photosData = user.photosData || [];
    const searchTerm = query.toLowerCase();

    const filteredPhotos = photosData.filter(photo => {
      return (
        photo.name?.toLowerCase().includes(searchTerm) ||
        photo.description?.toLowerCase().includes(searchTerm) ||
        photo.category?.toLowerCase().includes(searchTerm) ||
        photo.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    });

    res.status(200).json({
      success: true,
      data: filteredPhotos,
      message: 'Search completed successfully'
    });

  } catch (error) {
    console.error('Search photos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching photos'
    });
  }
};