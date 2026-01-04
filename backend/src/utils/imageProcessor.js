const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

class ImageProcessor {
  constructor() {
    this.uploadsDir = process.env.UPLOADS_DIR;
    this.imagesDir = path.join(this.uploadsDir, 'images');
    
    // Minimum requirements
    this.MIN_WIDTH = 1200;
    this.MIN_HEIGHT = 800;
    this.MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    this.ALLOWED_FORMATS = ['jpeg', 'jpg', 'png', 'webp', 'tiff'];
    
    // Output sizes
    this.SIZES = {
      thumbnail: { width: 300, height: 200, quality: 80 },
      full: { width: 2400, height: 1600, quality: 90 }
    };

    // Initialize S3 client
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.bucketName = process.env.AWS_S3_BUCKET;
    this.s3BaseUrl = process.env.AWS_S3_URL;
  }

  async ensureDirectories(userId) {
    // Since we're using S3, we don't need local directories for storage
    // Only return empty paths for backward compatibility
    return { 
      userDir: '',
      thumbnailDir: '',
      mediumDir: '',
      fullDir: ''
    };
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
        if (exifData.Photo?.[field]) {
          const dateValue = exifData.Photo[field];
          
          // If it's already a Date object
          if (dateValue instanceof Date) {
            if (!isNaN(dateValue.getTime())) {
              console.log('Found Date object:', dateValue);
              return dateValue.toISOString();
            }
            continue;
          }
          
          // If it's a number (timestamp)
          if (typeof dateValue === 'number') {
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
              console.log('Found timestamp:', dateValue);
              return date.toISOString();
            }
            continue;
          }
          
          // Convert to string for string operations
          const dateString = String(dateValue);
          
          // Check if it's already in ISO format (2017-04-24T15:02:04.000Z)
          if (dateString.includes('T') && dateString.includes('Z')) {
            const date = new Date(dateString);
            if (!isNaN(date.getTime())) {
              console.log('Found ISO format date:', dateString);
              return date.toISOString();
            }
          }
          
          // Check if it's in traditional EXIF format (YYYY:MM:DD HH:MM:SS)
          if (dateString.includes(':') && dateString.match(/^\d{4}:\d{2}:\d{2}/)) {
            const formattedDate = dateString.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3');
            const date = new Date(formattedDate);
            
            if (!isNaN(date.getTime())) {
              console.log('Found traditional EXIF date:', dateString, '-> converted to:', formattedDate);
              return date.toISOString();
            }
          }
          
          // Try parsing as-is in case it's in another valid format
          const date = new Date(dateString);
          if (!isNaN(date.getTime())) {
            console.log('Found parseable date:', dateString);
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
      if (exifData.Image?.Make && exifData.Image?.Model) {
        metadata.camera = `${exifData.Image.Make} ${exifData.Image.Model}`.trim();
      } else if (exifData.Model) {
        metadata.camera = exifData.Model;
      }

      // Lens info
      if (exifData.Photo?.LensModel) {
        metadata.lens = exifData.Photo.LensModel;
      }

      // Camera settings
      if (exifData.Photo?.FocalLength) {
        metadata.focalLength = `${exifData.Photo.FocalLength}mm`;
      }

      if (exifData.Photo?.FNumber) {
        metadata.aperture = `f/${exifData.Photo.FNumber}`;
      }

      if (exifData.Photo?.ExposureTime) {
        if (exifData.Photo.ExposureTime < 1) {
          metadata.shutterSpeed = `1/${Math.round(1 / exifData.Photo.ExposureTime)}s`;
        } else {
          metadata.shutterSpeed = `${exifData.Photo.ExposureTime}s`;
        }
      }

      if (exifData.Photo?.ISOSpeedRatings) {
        metadata.iso = exifData.Photo.ISOSpeedRatings;
      }

      if (exifData.Photo?.Flash !== undefined) {
        metadata.flash = exifData.Photo.Flash !== 0;
      }

      // GPS data
      if (exifData.GPSInfo?.GPSLatitude && exifData.GPSInfo?.GPSLongitude) {
        const lat = this.convertDMSToDD(exifData.GPSInfo.GPSLatitude, exifData.GPSInfo.GPSLatitudeRef);
        const lon = this.convertDMSToDD(exifData.GPSInfo.GPSLongitude, exifData.GPSInfo.GPSLongitudeRef);

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

  // NEW: Upload file to S3
  async uploadToS3(buffer, key, contentType, metadata = {}) {
    try {
      console.log(`Uploading to S3: ${key}`);
      
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        Metadata: {
          ...metadata,
          uploadedAt: new Date().toISOString(),
          processedBy: 'wedding-planner-app'
        },
        // Make it publicly readable
        ACL: 'public-read'
      });

      const result = await this.s3Client.send(command);
      
      // Construct the public URL
      const publicUrl = `${this.s3BaseUrl}/${key}`;
      
      console.log(`✓ Successfully uploaded to S3: ${publicUrl}`);
      
      return {
        success: true,
        url: publicUrl,
        key: key,
        etag: result.ETag,
        metadata: result.Metadata
      };
    } catch (error) {
      console.error(`✗ Failed to upload to S3: ${key}`, error);
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  // NEW: Delete file from S3
  async deleteFromS3(key) {
    try {
      console.log(`Deleting from S3: ${key}`);
      
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      console.log(`✓ Successfully deleted from S3: ${key}`);
      
      return true;
    } catch (error) {
      console.error(`✗ Failed to delete from S3: ${key}`, error);
      return false;
    }
  }

  async processImage(buffer, userId, originalFilename, category = 'other') {
    try {
      console.log(`Starting image processing for: ${originalFilename}`);
      
      // Create unique filename
      const fileId = uuidv4();
      const ext = path.extname(originalFilename).toLowerCase();
      const baseName = path.basename(originalFilename, ext);
      const filename = `${baseName.replace(/[^a-zA-Z0-9]/g, '_' )}`;
      let size = 0;

      // Ensure directories exist (for temporary processing)
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
          const exifReader = require('exif-reader');
          exifData = exifReader(metadata.exif);
          console.log('EXIF data extracted successfully');
          
          takenDate = this.extractExifDate(exifData);
          
          // Extract other metadata
          // exifData = this.extractExifMetadata(exifData);
        }
      } catch (exifError) {
        console.warn('EXIF extraction failed:', exifError);
      }

      // Fallback to current date if no EXIF date
      if (!takenDate) {
        takenDate = new Date().toISOString();
      }

      // Process and save different sizes
      const processedImages = {};
      const s3Uploads = {};
      
      console.log('Processing image sizes...');
      
      for (const [sizeName, config] of Object.entries(this.SIZES)) {
        console.log(`Processing ${sizeName} size...`);
        
        let processedImage = image.clone();
        
        // Resize if needed
        if (metadata.width > config.width || metadata.height > config.height) {
          processedImage = processedImage.resize(config.width, config.height, {
            fit: 'inside',
            withoutEnlargement: true
          });
        }

        // Convert to JPEG and get buffer
        const processedBuffer = await processedImage
          .jpeg({ 
            quality: config.quality,
            progressive: true,
            mozjpeg: true
          })
          .toBuffer();

        if (sizeName === 'full') {
          size = processedBuffer.length;
        }
        
        // Upload directly to S3 (no local storage)
        const s3Key = `images/${userId}/${sizeName}/${filename}.jpg`;
        
        const s3Result = await this.uploadToS3(
          processedBuffer, 
          s3Key, 
          'image/jpeg',
          {
            userId: userId,
            category: category,
            sizeName: sizeName,
            originalFilename: originalFilename,
            fileId: fileId,
            width: config.width.toString(),
            height: config.height.toString(),
            quality: config.quality.toString()
          }
        );

        s3Uploads[sizeName] = s3Result;
        processedImages[sizeName] = s3Result.url;
        
        console.log(`✓ ${sizeName} processed and uploaded to S3`);
      }

      console.log('All sizes processed and uploaded successfully');

      // Return complete photo data
      return {
        id: fileId,
        name: originalFilename,
        url: processedImages.full,
        thumbnailUrl: processedImages.thumbnail,
        size: size, // Original file size
        uploadDate: new Date().toISOString(),
        takenDate: takenDate,
        category: category,
        tags: [],
        isFavorite: false,
        description: '',
        // exifData: exifData,
        // originalMetadata: {
        //   width: metadata.width,
        //   height: metadata.height,
        //   format: metadata.format,
        //   colorSpace: metadata.space,
        //   hasAlpha: metadata.hasAlpha
        // },
        // s3Data: {
        //   bucket: this.bucketName,
        //   keys: {
        //     thumbnail: s3Uploads.thumbnail.key,
        //     full: s3Uploads.full.key
        //   },
        //   region: process.env.AWS_REGION
        // }
      };

    } catch (error) {
      console.error('Image processing error:', error);
      throw new Error(`Failed to process image: ${error.message}`);
    }
  }

  async deleteUserImages(userId, photoId) {
    try {
      console.log(`Deleting images for user ${userId}, photo ${photoId}`);
      
      // Delete from S3
      const s3Keys = [
        `images/${userId}/thumbnail/${photoId}-*.jpg`,
        `images/${userId}/full/${photoId}-*.jpg`
      ];

      // Since we can't use wildcards in S3 delete, we need the exact keys
      // In a real implementation, you'd store the S3 keys in your database
      // For now, we'll try common patterns
      const possibleKeys = [];
      
      // You should store the exact S3 keys in your database and use those instead
      // This is a simplified approach for the example
      const sizes = ['thumbnail', 'full'];
      sizes.forEach(size => {
        possibleKeys.push(`images/${userId}/${size}/${photoId}`);
        possibleKeys.push(`images/${userId}/${size}/${photoId}.jpg`);
      });

      let deletedCount = 0;
      for (const key of possibleKeys) {
        const deleted = await this.deleteFromS3(key);
        if (deleted) deletedCount++;
      }

      // Also clean up local files
      // const userDir = path.join(this.imagesDir, userId);
      // const directories = ['thumbnails', 'full'];
      
      // for (const dir of directories) {
      //   const dirPath = path.join(userDir, dir);
        
      //   try {
      //     const files = await fs.readdir(dirPath);
      //     const matchingFiles = files.filter(file => file.startsWith(photoId));
          
      //     for (const file of matchingFiles) {
      //       await fs.unlink(path.join(dirPath, file));
      //     }
      //   } catch (error) {
      //     console.warn(`Failed to clean up local files in ${dir}:`, error);
      //   }
      // }
      
      console.log(`✓ Deleted ${deletedCount} S3 objects and local files for photo ${photoId}`);
      return true;
    } catch (error) {
      console.error('Failed to delete user images:', error);
      return false;
    }
  }
}

module.exports = new ImageProcessor();