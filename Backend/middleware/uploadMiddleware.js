// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
console.log(`[Multer Config] Uploads directory target: ${uploadsDir}`);
if (!fs.existsSync(uploadsDir)) { try { fs.mkdirSync(uploadsDir, { recursive: true }); console.log(`[Multer Config] Created uploads directory.`); } catch (err) { console.error(`[Multer Config] Error creating uploads dir: ${err}`); } } else { console.log(`[Multer Config] Uploads directory exists.`); }

const storage = multer.diskStorage({ destination: uploadsDir, filename: (req, file, cb) => { const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'); cb(null, `${file.fieldname}-${Date.now()}${path.extname(safeName)}`); } });
const imageFileFilter = (req, file, cb) => { if (file.mimetype.startsWith('image/')) { cb(null, true); } else { cb(new Error('Invalid file type. Only images allowed.'), false); } };
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFileFilter });
const uploadProfilePhoto = upload.single('profilePhoto');
const uploadBusinessPhotos = upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'coverPhoto', maxCount: 1 }]);
module.exports = { uploadProfilePhoto, uploadBusinessPhotos, upload };