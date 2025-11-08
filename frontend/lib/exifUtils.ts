import EXIF from 'exif-js';

export interface ExifData {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  flash?: boolean;
  takenDate?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
}

export const extractExifData = (file: File): Promise<ExifData> => {
  return new Promise((resolve) => {
    EXIF.getData(file as any, function(this: any) {
      const exifData: ExifData = {};
      
      // Get camera info
      const make = EXIF.getTag(this, "Make");
      const model = EXIF.getTag(this, "Model");
      if (make && model) {
        exifData.camera = `${make} ${model}`.trim();
      } else if (model) {
        exifData.camera = model;
      }

      // Get lens info
      const lensModel = EXIF.getTag(this, "LensModel");
      if (lensModel) {
        exifData.lens = lensModel;
      }

      // Get focal length
      const focalLength = EXIF.getTag(this, "FocalLength");
      if (focalLength) {
        exifData.focalLength = `${focalLength}mm`;
      }

      // Get aperture (f-number)
      const fNumber = EXIF.getTag(this, "FNumber");
      if (fNumber) {
        exifData.aperture = `f/${fNumber}`;
      }

      // Get shutter speed (exposure time)
      const exposureTime = EXIF.getTag(this, "ExposureTime");
      if (exposureTime) {
        if (exposureTime < 1) {
          exifData.shutterSpeed = `1/${Math.round(1/exposureTime)}s`;
        } else {
          exifData.shutterSpeed = `${exposureTime}s`;
        }
      }

      // Get ISO
      const iso = EXIF.getTag(this, "ISOSpeedRatings");
      if (iso) {
        exifData.iso = iso;
      }

      // Get flash info
      const flash = EXIF.getTag(this, "Flash");
      if (flash !== undefined) {
        exifData.flash = flash !== 0;
      }

      // Get date taken - try multiple EXIF date fields
      const dateTimeOriginal = EXIF.getTag(this, "DateTimeOriginal");
      const dateTime = EXIF.getTag(this, "DateTime");
      const dateTimeDigitized = EXIF.getTag(this, "DateTimeDigitized");
      
      const takenDateString = dateTimeOriginal || dateTime || dateTimeDigitized;
      if (takenDateString) {
        // EXIF date format: "YYYY:MM:DD HH:MM:SS"
        const formattedDate = takenDateString.replace(/:/g, '-', 2).replace(/:/g, ':');
        try {
          const date = new Date(formattedDate);
          if (!isNaN(date.getTime())) {
            exifData.takenDate = date.toISOString();
          }
        } catch (error) {
          console.warn('Error parsing EXIF date:', error);
        }
      }

      // Get GPS location
      const lat = EXIF.getTag(this, "GPSLatitude");
      const latRef = EXIF.getTag(this, "GPSLatitudeRef");
      const lon = EXIF.getTag(this, "GPSLongitude");
      const lonRef = EXIF.getTag(this, "GPSLongitudeRef");

      if (lat && lon) {
        const latitude = convertDMSToDD(lat, latRef);
        const longitude = convertDMSToDD(lon, lonRef);
        
        if (latitude !== null && longitude !== null) {
          exifData.location = { latitude, longitude };
        }
      }

      resolve(exifData);
    });
  });
};

// Helper function to convert GPS coordinates from DMS to Decimal Degrees
const convertDMSToDD = (dms: number[], ref: string): number | null => {
  try {
    if (!dms || dms.length !== 3) return null;
    
    let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
    if (ref === 'S' || ref === 'W') {
      dd = dd * -1;
    }
    return dd;
  } catch (error) {
    return null;
  }
};

// Fallback: try to get date from file's lastModified if no EXIF date
export const getPhotoTakenDate = async (file: File): Promise<string> => {
  try {
    const exifData = await extractExifData(file);
    
    if (exifData.takenDate) {
      return exifData.takenDate;
    }
    
    // Fallback to file's last modified date
    return new Date(file.lastModified).toISOString();
  } catch (error) {
    console.warn('Error extracting EXIF date, using file modified date:', error);
    return new Date(file.lastModified).toISOString();
  }
};

// Format date for display
export const formatPhotoDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Unknown date';
  }
};