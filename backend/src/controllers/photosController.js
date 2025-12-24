const User = require('../models/User');
const imageProcessor = require('../utils/imageProcessor');
const path = require('path');
const fs = require('fs').promises;

// Serve uploaded images - with authentication
exports.serveImage = async (req, res) => {
  try {
    const { userId, size, filename } = req.params;
    
    // Check if user is accessing their own photos
    if (req.user.id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Validate size parameter
    const allowedSizes = ['thumbnails', 'medium', 'full'];
    if (!allowedSizes.includes(size)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image size requested'
      });
    }

    // Construct file path
    const uploadsDir = process.env.UPLOADS_DIR;
    const filePath = path.join(uploadsDir, 'images', userId, size, filename);

    console.log('Serving file from:', filePath); // Debug log

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error('File not found:', filePath);
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Determine content type based on file extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'image/jpeg';
    
    switch (ext) {
      case '.png':
        contentType = 'image/png';
        break;
      case '.webp':
        contentType = 'image/webp';
        break;
      case '.gif':
        contentType = 'image/gif';
        break;
      default:
        contentType = 'image/jpeg';
    }

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS
    
    // Send file
    res.sendFile(filePath);

  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while serving image'
    });
  }
};

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

// Upload and process multiple photos
exports.uploadPhotos = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Debug: Log what we receive
    console.log('=== UPLOAD PHOTOS DEBUG ===');
    console.log('req.body:', req.body);
    console.log('req.files count:', req.files ? req.files.length : 0);
    console.log('Body keys:', Object.keys(req.body || {}));
    
    // Extract form data - handle FormData strings
    const category = req.body.category || 'other';
    const description = req.body.description || '';
    const tagsString = req.body.tags || '';
    
    // Parse tags if it's a string from FormData
    let parsedTags = [];
    if (tagsString) {
      if (typeof tagsString === 'string') {
        parsedTags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else if (Array.isArray(tagsString)) {
        parsedTags = tagsString;
      }
    }

    console.log('Parsed form data:', {
      category,
      description,
      parsedTags,
      filesCount: req.files ? req.files.length : 0
    });
    console.log('=========================');

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const currentPhotos = user.photosData || [];
    const processedPhotos = [];
    const errors = [];

    // Process each uploaded file
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      try {
        console.log(`Processing file ${i + 1}/${req.files.length}: ${file.originalname}`);
        
        const processedPhoto = await imageProcessor.processImage(
          file.buffer,
          userId,
          file.originalname,
          category
        );

        // Add user-provided data
        processedPhoto.description = description;
        processedPhoto.tags = parsedTags;

        processedPhotos.push(processedPhoto);
        
        console.log(`Successfully processed: ${file.originalname}`);
        
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
        errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }

    // Save processed photos to database
    if (processedPhotos.length > 0) {
      const updatedPhotos = [...processedPhotos, ...currentPhotos];
      user.photosData = updatedPhotos;
      await user.save();
      
      console.log(`Saved ${processedPhotos.length} photos to database`);
    }

    // Prepare response
    const response = {
      success: processedPhotos.length > 0,
      data: processedPhotos,
      message: `Successfully processed ${processedPhotos.length} of ${req.files.length} photos`
    };

    if (errors.length > 0) {
      response.errors = errors;
      response.message += `. ${errors.length} photos failed to process.`;
    }

    res.status(processedPhotos.length > 0 ? 201 : 400).json(response);

  } catch (error) {
    console.error('Upload photos error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading photos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Save user's entire photos collection (for compatibility)
exports.savePhotos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { photos } = req.body;

    if (!Array.isArray(photos)) {
      return res.status(400).json({
        success: false,
        message: 'Photos must be an array'
      });
    }

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

// Update a photo metadata
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

    // Update the photo metadata (don't allow changing file paths or IDs)
    const updatedPhoto = { 
      ...currentPhotos[photoIndex], 
      ...updates,
      // Preserve these fields
      id: currentPhotos[photoIndex].id,
      url: currentPhotos[photoIndex].url,
      thumbnailUrl: currentPhotos[photoIndex].thumbnailUrl,
      mediumUrl: currentPhotos[photoIndex].mediumUrl,
      uploadDate: currentPhotos[photoIndex].uploadDate,
      takenDate: currentPhotos[photoIndex].takenDate,
      exifData: currentPhotos[photoIndex].exifData,
      originalMetadata: currentPhotos[photoIndex].originalMetadata
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

    // Remove the photo from database
    const deletedPhoto = currentPhotos.splice(photoIndex, 1)[0];
    user.photosData = currentPhotos;
    await user.save();

    // Delete physical files
    await imageProcessor.deleteUserImages(userId, photoId);

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
      totalProcessedSize: photosData.reduce((sum, photo) => {
        if (photo.processedSizes) {
          return sum + photo.processedSizes.thumbnail + photo.processedSizes.medium + photo.processedSizes.full;
        }
        return sum;
      }, 0),
      byCategory: {},
      recentUploads: photosData
        .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
        .slice(0, 5),
      recentlyTaken: photosData
        .sort((a, b) => new Date(b.takenDate).getTime() - new Date(a.takenDate).getTime())
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
        photo.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        photo.exifData?.camera?.toLowerCase().includes(searchTerm) ||
        photo.exifData?.lens?.toLowerCase().includes(searchTerm)
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
