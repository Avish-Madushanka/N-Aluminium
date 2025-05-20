const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

const clientProfileUploadDir = path.join(__dirname, '..', 'uploads', 'profiles');

if (!fs.existsSync(clientProfileUploadDir)) {
  try {
    fs.mkdirSync(clientProfileUploadDir, { recursive: true });
    console.log(`Client profiles upload directory created at ${clientProfileUploadDir}`);
  } catch (err) {
    console.error(`Error creating client profiles upload directory: ${err.message}`);
  }
}

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, clientProfileUploadDir);
  },
  filename: function(req, file, cb) {
    cb(null, `client-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!config.ALLOWED_FILE_TYPES || config.ALLOWED_FILE_TYPES.length === 0) {
    console.warn('ALLOWED_FILE_TYPES not configured. Allowing all files for client upload.');
    return cb(null, true);
  }
  if (!config.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    req.fileValidationError = `Only ${config.ALLOWED_FILE_TYPES.join(', ')} files are allowed. You tried: ${file.mimetype}`;
    return cb(null, false); 
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: config.MAX_FILE_SIZE_MB * 1024 * 1024 }, // Use MB from config
  fileFilter: fileFilter,
});

module.exports = upload;