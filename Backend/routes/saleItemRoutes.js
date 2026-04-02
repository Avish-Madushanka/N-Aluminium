const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, authorize } = require('../middleware/authMiddleware');
const saleItemController = require('../controllers/saleItemController');

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads/saleitems');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `item-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const saleFields = upload.fields([
    { name: 'imagePath', maxCount: 1 },
    { name: 'additionalImages', maxCount: 10 }
]);

router.get('/', saleItemController.getAllSaleItems);

router.post(
    '/', 
    protect, 
    authorize('client', 'businessOwner', 'admin'), 
    saleFields, 
    saleItemController.createSaleItem
);

router.get('/:id', saleItemController.getSaleItemById);
router.delete('/:id', protect, saleItemController.deleteSaleItem);

module.exports = router;