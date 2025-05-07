const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(safeOriginalName)}`);
    }
});

const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter
});

const uploadProfilePhoto = upload.single('profilePhoto');
const uploadBusinessPhotos = upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
]);

module.exports = { uploadProfilePhoto, uploadBusinessPhotos, upload };