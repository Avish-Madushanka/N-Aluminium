// --- START OF FILE routes/bOwnerRoutes.js ---
const express = require('express');
const router = express.Router();
const bOwnerController = require('../controllers/bOwnerController');
const { protectBOwner } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = 1024 * 1024 * MAX_FILE_SIZE_MB;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

const profileUploadDir = path.join(__dirname, '..', 'uploads', 'b_owner_profiles');
const coverUploadDir = path.join(__dirname, '..', 'uploads', 'b_owner_covers');

const ensureUploadDirExists = (dir) => {
    if (!fs.existsSync(dir)){
        try { fs.mkdirSync(dir, { recursive: true }); console.log(`Created directory: ${dir}`); }
        catch (err) { console.error(`FATAL: Could not create upload directory ${dir}.`, err); process.exit(1); }
    }
}
ensureUploadDirExists(profileUploadDir);
ensureUploadDirExists(coverUploadDir);

const deleteUploadedFilesOnError = (files) => {
    let deletedPaths = [];
    if (files && typeof files === 'object') {
        Object.values(files).forEach(fileArray => {
            if (Array.isArray(fileArray)) {
                fileArray.forEach(file => {
                    if (file && file.path && fs.existsSync(file.path)) {
                        try { fs.unlinkSync(file.path); deletedPaths.push(file.path); }
                        catch (err) { console.error(`Middleware File Cleanup Error: Failed to delete ${file.path}`, err); }
                    }
                });
            }
        });
    }
     if(deletedPaths.length > 0){ console.log('Middleware cleaned up files:', deletedPaths); }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profilePhoto') cb(null, profileUploadDir);
    else if (file.fieldname === 'coverPhoto') cb(null, coverUploadDir);
    else cb(new Error('Invalid file field name received.'), null);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) { cb(null, true); }
  else { req.fileValidationError = `Invalid file type for '${file.fieldname}'. Only JPG, PNG, GIF allowed.`; cb(null, false); }
};

const upload = multer({ storage: storage, limits: { fileSize: MAX_FILE_SIZE_BYTES }, fileFilter: fileFilter });

const handleMultiFieldUpload = (fields) => (req, res, next) => {
    const uploader = upload.fields(fields);
    uploader(req, res, function (err) {
        if (req.fileValidationError) {
            deleteUploadedFilesOnError(req.files);
            return res.status(400).json({ success: false, message: req.fileValidationError });
        } else if (err instanceof multer.MulterError) {
             deleteUploadedFilesOnError(req.files);
            if (err.code === 'LIMIT_FILE_SIZE') { return res.status(400).json({ success: false, message: `File size too large for field '${err.field}'. Maximum ${MAX_FILE_SIZE_MB}MB allowed.` }); }
            return res.status(400).json({ success: false, message: `File upload error: ${err.message} (Field: ${err.field})` });
        } else if (err) {
             deleteUploadedFilesOnError(req.files);
            console.error("Unknown Multer processing error:", err);
            return res.status(500).json({ success: false, message: `File upload processing error: ${err.message}` });
        }
        next();
    });
};

router.post('/register', handleMultiFieldUpload([{ name: 'profilePhoto', maxCount: 1 }, { name: 'coverPhoto', maxCount: 1 }]), bOwnerController.registerBOwner);
router.get('/profile/:id', protectBOwner, bOwnerController.getBOwnerProfile);
// router.put('/profile/:id', protectBOwner, handleMultiFieldUpload([...]), bOwnerController.updateBOwner);
// router.delete('/:id', protectBOwner, bOwnerController.deleteBOwner);

module.exports = router;
// --- END OF FILE routes/bOwnerRoutes.js ---