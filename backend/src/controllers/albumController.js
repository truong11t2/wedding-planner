const fs = require('fs').promises;
const path = require('path');
const Album = require('../models/Album');
const { v4: uuidv4 } = require('uuid');

exports.generateAlbum = async (req, res) => {
  try {
    const { coupleNames, albumTitle, weddingDate, photos } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!coupleNames || !albumTitle || !photos || photos.length === 0) {
      return res.status(400).json({ 
        message: 'Missing required fields: coupleNames, albumTitle, and photos are required' 
      });
    }

    // Generate unique filename
    const uniqueId = uuidv4();
    const htmlFileName = `${uniqueId}.html`;
    
    // Read the template file
    const templatePath = path.join(__dirname, '../../public/templates/wedding-album-template.html');
    let templateContent = await fs.readFile(templatePath, 'utf-8');

    // Format photos data for JavaScript
    const photosData = photos.slice(1).map(photo => { // Skip first photo
      return `{
        id: "${photo.id}",
        url: "${photo.url}",
        caption: "${photo.caption ? photo.caption.replace(/"/g, '\\"') : ''}",
        order: ${photo.order}
      }`;
    }).join(',\n            ');

    // Replace placeholders
    templateContent = templateContent
      .replace(/\{\{COUPLE_NAMES\}\}/g, coupleNames)
      .replace(/\{\{ALBUM_TITLE\}\}/g, albumTitle)
      .replace(/\{\{WEDDING_DATE\}\}/g, weddingDate || '')
      .replace('{{HERO_BACKGROUND_IMAGE_URL}}', photos[0].url)
      .replace('{{PHOTOS_DATA}}', photosData);

    // Create albums directory if it doesn't exist
    const albumsDir = path.join(__dirname, '../../public/albums');
    try {
      await fs.access(albumsDir);
    } catch {
      await fs.mkdir(albumsDir, { recursive: true, mode: 0o755 });
    }

    // Write the generated HTML file
    const outputPath = path.join(albumsDir, htmlFileName);
    await fs.writeFile(outputPath, templateContent, 'utf-8');
    
    // Ensure file has correct permissions
    try {
      await fs.chmod(outputPath, 0o644);
    } catch (error) {
      console.log('Could not set file permissions:', error.message);
    }

    // Generate public URL
    const publicUrl = `/albums/${htmlFileName}`;

    // Check if user already has an album and update or create new
    let album = await Album.findOne({ where: { userId } });
    
    if (album) {
      // Delete old HTML file if it exists
      try {
        const oldFilePath = path.join(albumsDir, album.htmlFileName);
        await fs.unlink(oldFilePath);
      } catch (error) {
        // File might not exist, continue
        console.log('Old album file not found, continuing...');
      }

      // Update existing album
      album.coupleNames = coupleNames;
      album.albumTitle = albumTitle;
      album.weddingDate = weddingDate;
      album.htmlFileName = htmlFileName;
      album.publicUrl = publicUrl;
      album.photos = photos;
      await album.save();
    } else {
      // Create new album
      album = await Album.create({
        userId,
        coupleNames,
        albumTitle,
        weddingDate,
        htmlFileName,
        publicUrl,
        photos
      });
    }

    res.status(200).json({
      success: true,
      message: 'Album generated successfully',
      album: {
        id: album.id,
        publicUrl: album.publicUrl,
        htmlFileName: album.htmlFileName
      }
    });

  } catch (error) {
    console.error('Error generating album:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error generating album', 
      error: error.message 
    });
  }
};

exports.getAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const album = await Album.findOne({ where: { userId } });
    
    if (!album) {
      return res.status(404).json({ 
        success: false,
        message: 'Album not found' 
      });
    }

    res.status(200).json({
      success: true,
      album: {
        id: album.id,
        coupleNames: album.coupleNames,
        albumTitle: album.albumTitle,
        weddingDate: album.weddingDate,
        publicUrl: album.publicUrl,
        photos: album.photos,
        isPublished: album.isPublished
      }
    });

  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching album', 
      error: error.message 
    });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const { coupleNames, albumTitle, weddingDate, photos } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!coupleNames || !albumTitle || !photos || photos.length === 0) {
      return res.status(400).json({ 
        message: 'Missing required fields: coupleNames, albumTitle, and photos are required' 
      });
    }

    // Find existing album
    const album = await Album.findOne({ where: { userId } });
    
    if (!album) {
      return res.status(404).json({ 
        success: false,
        message: 'Album not found. Please generate an album first.' 
      });
    }

    // Read the template file
    const templatePath = path.join(__dirname, '../../public/templates/wedding-album-template.html');
    let templateContent = await fs.readFile(templatePath, 'utf-8');

    // Format photos data for JavaScript (skip first photo)
    const photosData = photos.slice(1).map(photo => {
      return `{
        id: "${photo.id}",
        url: "${photo.url}",
        caption: "${photo.caption ? photo.caption.replace(/"/g, '\\"') : ''}",
        order: ${photo.order}
      }`;
    }).join(',\n            ');

    // Replace placeholders
    templateContent = templateContent
      .replace(/\{\{COUPLE_NAMES\}\}/g, coupleNames)
      .replace(/\{\{ALBUM_TITLE\}\}/g, albumTitle)
      .replace(/\{\{WEDDING_DATE\}\}/g, weddingDate || '')
      .replace('{{HERO_BACKGROUND_IMAGE_URL}}', photos[0].url)
      .replace('{{PHOTOS_DATA}}', photosData);

    // Update the existing HTML file (keep same filename)
    const albumsDir = path.join(__dirname, '../../public/albums');
    const outputPath = path.join(albumsDir, album.htmlFileName);
    await fs.writeFile(outputPath, templateContent, 'utf-8');
    
    // Ensure file has correct permissions
    try {
      await fs.chmod(outputPath, 0o644);
    } catch (error) {
      console.log('Could not set file permissions:', error.message);
    }

    // Update album in database
    album.coupleNames = coupleNames;
    album.albumTitle = albumTitle;
    album.weddingDate = weddingDate;
    album.photos = photos;
    await album.save();

    res.status(200).json({
      success: true,
      message: 'Album updated successfully',
      album: {
        id: album.id,
        publicUrl: album.publicUrl,
        htmlFileName: album.htmlFileName
      }
    });

  } catch (error) {
    console.error('Error updating album:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating album', 
      error: error.message 
    });
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const album = await Album.findOne({ where: { userId } });
    
    if (!album) {
      return res.status(404).json({ 
        success: false,
        message: 'Album not found' 
      });
    }

    // Delete the HTML file
    const albumsDir = path.join(__dirname, '../../public/albums');
    const filePath = path.join(albumsDir, album.htmlFileName);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.log('HTML file not found, continuing with deletion...');
    }

    // Delete from database
    await album.destroy();

    res.status(200).json({
      success: true,
      message: 'Album deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting album', 
      error: error.message 
    });
  }
};
