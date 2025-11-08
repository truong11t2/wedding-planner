const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class ImageProcessor {
  constructor() {
    this.uploadsDir = path.join(__dirname, '../../uploads');
    this.imagesDir = path.join(this.uploadsDir, 'images');
    
    // Minimum requirements
    this.MIN_WIDTH = 800;
    this.MIN_HEIGHT = 600;
    this.MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    this.ALLOWED_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'tiff'];
    
    // Output sizes
    this.SIZES = {
      thumbnail: { width: 300, height: 300, quality: 80 },
      medium: { width: 1200, height: 1200, quality: 85 },
      full: { width: 2400, height: 2400, quality: 90 }
    };
  }

  async ensureDirectories(userId) {
    const userDir = path.join(this.imagesDir, userId);
    const thumbnailDir = path.join(userDir, 'thumbnails');
    const mediumDir = path.join(userDir, 'medium');
    const fullDir = path.join(userDir, 'full');

    try {
      await fs.mkdir(this.uploadsDir, { recursive: true });
      await fs.mkdir(this.imagesDir, { recursive: true });
      await fs.mkdir(userDir, { recursive: true });
      await fs.mkdir(thumbnailDir, { recursive: true });
      await fs.mkdir(mediumDir, { recursive: true });
      await fs.mkdir(fullDir, { recursive: true });
      
      return { userDir, thumbnailDir, mediumDir, fullDir };
    } catch (error) {
      throw new Error(`Failed to create directories: ${error.message}`);
    }
  }

  async validateImage(buffer, originalFilename) {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      const validation = {
        isValid: true,
        errors: [],
        metadata: metadata
      };

      // Check file size
      if (buffer.length > this.MAX_FILE_SIZE) {
        validation.isValid = false;
        validation.errors.push(`File size ${(buffer.length / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`);
      }

      // Check format
      if (!this.ALLOWED_FORMATS.includes(metadata.format?.toLowerCase())) {
        validation.isValid = false;
        validation.errors.push(`Format '${metadata.format}' is not supported. Allowed formats: ${this.ALLOWED_FORMATS.join(', ')}`);
      }

      // Check dimensions
      if (metadata.width && metadata.width < this.MIN_WIDTH) {
        validation.isValid = false;
        validation.errors.push(`Image width ${metadata.width}px is below minimum required ${this.MIN_WIDTH}px`);
      }

      if (metadata.height && metadata.height < this.MIN_HEIGHT) {
        validation.isValid = false;
        validation.errors.push(`Image height ${metadata.height}px is below minimum required ${this.MIN_HEIGHT}px`);
      }

      // Check if image is corrupted
      if (!metadata.width || !metadata.height) {
        validation.isValid = false;
        validation.errors.push('Image appears to be corrupted or invalid');
      }

      return validation;
    } catch (error) {
      return {
        isValid: false,
        errors: [`Failed to process image: ${error.message}`],
        metadata: null
      };
    }
  }

  extractExifDate(exifData) {
    try {
      // Try different EXIF date fields in order of preference
      const dateFields = [
        'DateTimeOriginal',
        'DateTime', 
        'DateTimeDigitized',
        'CreateDate'
      ];

      for (const field of dateFields) {
        if (exifData[field]) {
          const dateString = exifData[field];
          
          // EXIF date format: "YYYY:MM:DD HH:MM:SS"
          const formattedDate = dateString.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
          const date = new Date(formattedDate);
          
          if (!isNaN(date.getTime())) {
            return date.toISOString();
          }
        }
      }

      return null;
    } catch (error) {
      console.warn('Error extracting EXIF date:', error);
      return null;
    }
  }

  extractExifMetadata(exifData) {
    try {
      const metadata = {};

      // Camera info
      if (exifData.Make && exifData.Model) {
        metadata.camera = `${exifData.Make} ${exifData.Model}`.trim();
      } else if (exifData.Model) {
        metadata.camera = exifData.Model;
      }

      // Lens info
      if (exifData.LensModel) {
        metadata.lens = exifData.LensModel;
      }

      // Camera settings
      if (exifData.FocalLength) {
        metadata.focalLength = `${exifData.FocalLength}mm`;
      }

      if (exifData.FNumber) {
        metadata.aperture = `f/${exifData.FNumber}`;
      }

      if (exifData.ExposureTime) {
        if (exifData.ExposureTime < 1) {
          metadata.shutterSpeed = `1/${Math.round(1 / exifData.ExposureTime)}s`;
        } else {
          metadata.shutterSpeed = `${exifData.ExposureTime}s`;
        }
      }

      if (exifData.ISOSpeedRatings) {
        metadata.iso = exifData.ISOSpeedRatings;
      }

      if (exifData.Flash !== undefined) {
        metadata.flash = exifData.Flash !== 0;
      }

      // GPS data
      if (exifData.GPSLatitude && exifData.GPSLongitude) {
        const lat = this.convertDMSToDD(exifData.GPSLatitude, exifData.GPSLatitudeRef);
        const lon = this.convertDMSToDD(exifData.GPSLongitude, exifData.GPSLongitudeRef);
        
        if (lat !== null && lon !== null) {
          metadata.location = { latitude: lat, longitude: lon };
        }
      }

      return metadata;
    } catch (error) {
      console.warn('Error extracting EXIF metadata:', error);
      return {};
    }
  }

  convertDMSToDD(dms, ref) {
    try {
      if (!Array.isArray(dms) || dms.length !== 3) return null;
      
      let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
      if (ref === 'S' || ref === 'W') {
        dd = dd * -1;
      }
      return dd;
    } catch (error) {
      return null;
    }
  }

  async processImage(buffer, userId, originalFilename, category = 'other') {
    try {
      // Create unique filename
      const fileId = uuidv4();
      const ext = path.extname(originalFilename).toLowerCase();
      const baseName = path.basename(originalFilename, ext);
      const filename = `${fileId}-${baseName.replace(/[^a-zA-Z0-9]/g, '_')}`;

      // Ensure directories exist
      const directories = await this.ensureDirectories(userId);

      // Validate image
      const validation = await this.validateImage(buffer, originalFilename);
      if (!validation.isValid) {
        throw new Error(`Image validation failed: ${validation.errors.join(', ')}`);
      }

      const image = sharp(buffer);
      const metadata = validation.metadata;

      // Extract EXIF data
      let exifData = {};
      let takenDate = null;

      try {
        if (metadata.exif) {
          // Parse EXIF data using exif-reader
          const exifReader = require('exif-reader');
          exifData = exifReader(metadata.exif);
          
          // Extract taken date
          takenDate = this.extractExifDate(exifData);
          
          // Extract other metadata
          exifData = this.extractExifMetadata(exifData);
        }
      } catch (exifError) {
        console.warn('EXIF extraction failed:', exifError);
      }

      // Fallback to file stats if no EXIF date
      if (!takenDate) {
        takenDate = new Date().toISOString();
      }

      // Process and save different sizes
      const processedImages = {};
      
      for (const [sizeName, config] of Object.entries(this.SIZES)) {
        const outputPath = path.join(directories[sizeName === 'thumbnail' ? 'thumbnailDir' : sizeName === 'medium' ? 'mediumDir' : 'fullDir'], `${filename}.jpg`);
        
        let processedImage = image.clone();
        
        // Resize if needed
        if (metadata.width > config.width || metadata.height > config.height) {
          processedImage = processedImage.resize(config.width, config.height, {
            fit: 'inside',
            withoutEnlargement: true
          });
        }

        // Convert to JPEG and compress
        await processedImage
          .jpeg({ 
            quality: config.quality,
            progressive: true,
            mozjpeg: true
          })
          .toFile(outputPath);

        // Generate URL path for frontend
        const relativePath = `${filename}.jpg`;
        processedImages[sizeName] = `/api/photos/serve/${userId}/${sizeName === 'thumbnail' ? 'thumbnails' : sizeName}/${relativePath}`;
      }

      // Get final file size
      const thumbnailStats = await fs.stat(path.join(directories.thumbnailDir, `${filename}.jpg`));
      const mediumStats = await fs.stat(path.join(directories.mediumDir, `${filename}.jpg`));
      const fullStats = await fs.stat(path.join(directories.fullDir, `${filename}.jpg`));

      return {
        id: fileId,
        name: originalFilename,
        url: processedImages.full,
        thumbnailUrl: processedImages.thumbnail,
        mediumUrl: processedImages.medium,
        size: buffer.length, // Original file size
        processedSizes: {
          thumbnail: thumbnailStats.size,
          medium: mediumStats.size,
          full: fullStats.size
        },
        uploadDate: new Date().toISOString(),
        takenDate: takenDate,
        category: category,
        tags: [],
        isFavorite: false,
        description: '',
        exifData: exifData,
        originalMetadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          colorSpace: metadata.space,
          hasAlpha: metadata.hasAlpha
        }
      };

    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  async deleteUserImages(userId, photoId) {
    try {
      const userDir = path.join(this.imagesDir, userId);
      
      // Find files matching the photoId
      const directories = ['thumbnails', 'medium', 'full'];
      
      for (const dir of directories) {
        const dirPath = path.join(userDir, dir);
        
        try {
          const files = await fs.readdir(dirPath);
          const matchingFiles = files.filter(file => file.startsWith(photoId));
          
          for (const file of matchingFiles) {
            await fs.unlink(path.join(dirPath, file));
          }
        } catch (error) {
          console.warn(`Failed to clean up files in ${dir}:`, error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to delete user images:', error);
      return false;
    }
  }
}

module.exports = new ImageProcessor();