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

const ensureUploadDirExists = (dir) => { if (!fs.existsSync(dir)){ try { fs.mkdirSync(dir, { recursive: true }); console.log(`Created directory: ${dir}`); } catch (err) { console.error(`FATAL: Could not create directory ${dir}.`, err); process.exit(1); }}};
ensureUploadDirExists(profileUploadDir);
ensureUploadDirExists(coverUploadDir);

const deleteUploadedFilesOnError = (files) => { let d=[];if(files&&typeof files==='object'){Object.values(files).forEach(fA=>{if(Array.isArray(fA)){fA.forEach(f=>{if(f?.path&&fs.existsSync(f.path)){try{fs.unlinkSync(f.path);d.push(f.path);}catch(e){console.error(`Cleanup Error: ${e}`)}}})}});}if(d.length>0){console.log('Cleaned files:',d)}};
const storage = multer.diskStorage({ destination: (req, file, cb) => { if (file.fieldname === 'profilePhoto') cb(null, profileUploadDir); else if (file.fieldname === 'coverPhoto') cb(null, coverUploadDir); else cb(new Error('Invalid field name.'), null); }, filename: (req, file, cb) => { const uS = Date.now() + '-' + Math.round(Math.random() * 1E9); cb(null, `${file.fieldname}-${uS}${path.extname(file.originalname)}`); }});
const fileFilter = (req, file, cb) => { if (ALLOWED_MIME_TYPES.includes(file.mimetype)) { cb(null, true); } else { req.fileValidationError = `Invalid file type for '${file.fieldname}'.`; cb(null, false); }};
const upload = multer({ storage: storage, limits: { fileSize: MAX_FILE_SIZE_BYTES }, fileFilter: fileFilter });

const handleMultiFieldUpload = (fields) => (req, res, next) => {
    const uploader = upload.fields(fields);
    uploader(req, res, function (err) {
        if (req.fileValidationError) { deleteUploadedFilesOnError(req.files); return res.status(400).json({ success: false, message: req.fileValidationError }); }
        else if (err instanceof multer.MulterError) { deleteUploadedFilesOnError(req.files); if (err.code === 'LIMIT_FILE_SIZE') { return res.status(400).json({ success: false, message: `File size limit (${MAX_FILE_SIZE_MB}MB) exceeded for ${err.field}.` }); } return res.status(400).json({ success: false, message: `Upload error: ${err.message}` }); }
        else if (err) { deleteUploadedFilesOnError(req.files); console.error("Unknown upload error:", err); return res.status(500).json({ success: false, message: `Upload processing error: ${err.message}` }); }
        next();
    });
};

router.post('/register', handleMultiFieldUpload([{ name: 'profilePhoto', maxCount: 1 }, { name: 'coverPhoto', maxCount: 1 }]), bOwnerController.registerBOwner);
router.get('/profile/:id', protectBOwner, bOwnerController.getBOwnerProfile);
// router.put('/profile/:id', protectBOwner, handleMultiFieldUpload([...]), bOwnerController.updateBOwner);
// router.delete('/:id', protectBOwner, bOwnerController.deleteBOwner);

module.exports = router;