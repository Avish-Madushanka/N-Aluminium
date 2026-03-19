const multer = require('multer');
const path = require('path');
const fs = require('fs');

const alumniUploadDir = path.join(__dirname, '../uploads/alumni');

if (!fs.existsSync(alumniUploadDir)) {
  fs.mkdirSync(alumniUploadDir, { recursive: true });
}

const alumniStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, alumniUploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const fieldPrefix = file.fieldname === 'idPhoto' ? 'id' : 'cv';
    cb(null, `alumni-${fieldPrefix}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'idPhoto') {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('ID photo must be an image file'), false);
    }
  }
  
  if (file.fieldname === 'cvFile') {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('CV must be PDF or Word document'), false);
    }
  }
  
  cb(null, true);
};

const uploadAlumniFiles = multer({
  storage: alumniStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
}).fields([
  { name: 'idPhoto', maxCount: 1 },
  { name: 'cvFile', maxCount: 1 }
]);

module.exports = { uploadAlumniFiles };