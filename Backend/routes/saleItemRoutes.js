const express = require('express');
const router = express.Router();
const saleItemController = require('../controllers/saleItemController');
const { protectClient } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const { protectClientOrBOwner } = require('../middleware/authMiddleware'); // Add if needed

const uploadDir = path.join(__dirname, '..', 'uploads', 'sale_items');
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = 1024 * 1024 * MAX_FILE_SIZE_MB;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];

const ensureUploadDirExists = (dir) => { if (!fs.existsSync(dir)){ try { fs.mkdirSync(dir, { recursive: true }); console.log(`Created directory: ${dir}`); } catch (err) { console.error(`FATAL: Could not create upload directory ${dir}.`, err); process.exit(1); }}};
ensureUploadDirExists(uploadDir);

const storage = multer.diskStorage({ destination: (req, file, cb) => cb(null, uploadDir), filename: (req, file, cb) => { const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); cb(null, `saleitem-${uniqueSuffix}${path.extname(file.originalname)}`); }});
const fileFilter = (req, file, cb) => { if (ALLOWED_MIME_TYPES.includes(file.mimetype)) { cb(null, true); } else { req.fileValidationError = 'Invalid file type. Only JPG, PNG, GIF allowed.'; cb(null, false); }};
const upload = multer({ storage: storage, limits: { fileSize: MAX_FILE_SIZE_BYTES }, fileFilter: fileFilter });

const saleItemImageUploader = upload.single('image');
const handleSaleItemUpload = (req, res, next) => {
    saleItemImageUploader(req, res, function (err) {
        if (req.fileValidationError) { return res.status(400).json({ success: false, message: req.fileValidationError }); }
        else if (err instanceof multer.MulterError) { if (err.code === 'LIMIT_FILE_SIZE') { return res.status(400).json({ success: false, message: `File size too large. Maximum ${MAX_FILE_SIZE_MB}MB allowed.` }); } return res.status(400).json({ success: false, message: `File upload error: ${err.message}` }); }
        else if (err) { console.error("Unknown sale item upload error:", err); return res.status(500).json({ success: false, message: `Image upload error: ${err.message}` }); }
        next();
    });
};

router.post('/', /* protectClientOrBOwner, */ handleSaleItemUpload, saleItemController.addSaleItem);
router.get('/', saleItemController.getAllSaleItems);

module.exports = router;