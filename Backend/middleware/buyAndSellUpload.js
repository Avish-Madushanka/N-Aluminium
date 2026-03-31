const multer = require('multer');
const path = require('path');
const fs = require('fs');

const saleItemsUploadDir = path.join(__dirname, '../uploads/saleitems');

if (!fs.existsSync(saleItemsUploadDir)) {
    fs.mkdirSync(saleItemsUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, saleItemsUploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `saleitem-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF images are allowed.'), false);
    }
};

const uploadBuyAndSell = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
}).fields([
    { name: 'imagePath', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 }
]);

module.exports = { uploadBuyAndSell };