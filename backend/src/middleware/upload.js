const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 20, // Maximum 20 files at once
    fieldSize: 10 * 1024 * 1024, // 10MB for field data
    fields: 10 // Maximum number of non-file fields
  },
  fileFilter: (req, file, cb) => {
    console.log('Multer processing file:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    
    // Check file type
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/webp',
      'image/tiff'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${allowedMimes.join(', ')}`), false);
    }
  }
});

// Middleware to handle file upload
const uploadMiddleware = (req, res, next) => {
  console.log('Upload middleware called');
  
  // Use multer array for multiple photos
  const uploadArray = upload.array('photos', 20);
  
  uploadArray(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 50MB per file.'
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 20 files per upload.'
        });
      }
      if (err.code === 'LIMIT_FIELD_COUNT') {
        return res.status(400).json({
          success: false,
          message: 'Too many fields in the form.'
        });
      }
      if (err.code === 'LIMIT_FIELD_VALUE') {
        return res.status(400).json({
          success: false,
          message: 'Field value too large.'
        });
      }
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`
      });
    } else if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    console.log('Upload middleware - processing complete');
    console.log('Files processed:', req.files ? req.files.length : 0);
    console.log('Form fields:', Object.keys(req.body || {}));
    
    next();
  });
};

// Debug middleware to log form data
const debugFormData = (req, res, next) => {
  console.log('=== DEBUG FORM DATA ===');
  console.log('req.body:', req.body);
  console.log('req.files:', req.files);
  console.log('req.headers content-type:', req.headers['content-type']);
  
  // Log all form fields
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      console.log(`Form field [${key}]:`, req.body[key]);
    });
  }
  
  // Log file info
  if (req.files && req.files.length > 0) {
    req.files.forEach((file, index) => {
      console.log(`File ${index}:`, {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      });
    });
  }
  
  console.log('=== END DEBUG ===');
  next();
};

module.exports = {
  uploadMiddleware,
  debugFormData
};