// --- START OF FILE routes/clientRoutes.js ---
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { protectClient } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads', 'profiles');
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = 1024 * 1024 * MAX_FILE_SIZE_MB;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

const ensureUploadDirExists = (dir) => {
    if (!fs.existsSync(dir)){
        try { fs.mkdirSync(dir, { recursive: true }); console.log(`Created directory: ${dir}`); }
        catch (err) { console.error(`FATAL: Could not create upload directory ${dir}.`, err); process.exit(1); }
    }
}
ensureUploadDirExists(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `client-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) { cb(null, true); }
  else { req.fileValidationError = 'Invalid file type. Only JPG, PNG, GIF allowed.'; cb(null, false); }
};

const upload = multer({ storage: storage, limits: { fileSize: MAX_FILE_SIZE_BYTES }, fileFilter: fileFilter });

const handleProfilePhotoUpload = (req, res, next) => {
    const uploader = upload.single('profilePhoto');
    uploader(req, res, function (err) {
        if (req.fileValidationError) { return res.status(400).json({ success: false, message: req.fileValidationError }); }
        else if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') { return res.status(400).json({ success: false, message: `File size too large. Maximum ${MAX_FILE_SIZE_MB}MB allowed.` }); }
            return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
        } else if (err) {
            console.error("Unknown profile photo upload error:", err);
            return res.status(500).json({ success: false, message: `Profile photo upload processing error: ${err.message}` });
        }
        next();
    });
};

router.post('/register', handleProfilePhotoUpload, clientController.registerClient);
router.get('/:id', protectClient, clientController.getClientById);
router.put('/:id', protectClient, handleProfilePhotoUpload, clientController.updateClient);
router.delete('/:id', protectClient, clientController.deleteClient);

module.exports = router;
// --- END OF FILE routes/clientRoutes.js ---