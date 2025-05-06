// utils/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config'); // For MAX_FILE_SIZE and ALLOWED_FILE_TYPES

const uploadDir = './uploads/'; // Relative to project root

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Uploads directory for Multer created at ${path.resolve(uploadDir)}`);
  } catch (err) {
    console.error(`Error creating uploads directory for Multer: ${err.message}`);
    // Don't exit here, let server.js handle overall creation
  }
}


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir); // Use the defined uploadDir
  },
  filename: function(req, file, cb) {
    // Example: client-timestamp-originalextension
    cb(null, `client-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!config.ALLOWED_FILE_TYPES || config.ALLOWED_FILE_TYPES.length === 0) {
    console.warn('ALLOWED_FILE_TYPES not configured in config/config.js or .env. Allowing all files.');
    return cb(null, true); // Or cb(new Error('File types not configured'), false); for stricter control
  }
  if (!config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new Error(`Only ${config.ALLOWED_FILE_TYPES.join(', ')} files are allowed. You tried to upload: ${file.mimetype}`), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: config.MAX_FILE_SIZE || (1024 * 1024 * 5) }, // Default 5MB if not set
  fileFilter: fileFilter,
});

module.exports = upload;