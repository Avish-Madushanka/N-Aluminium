const express = require('express');
const {
    createSaleItem,
    getAllSaleItems,
    getSaleItemById,
    updateSaleItem,
    deleteSaleItem
} = require('../controllers/saleItemController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadSaleItemImage } = require('../middleware/uploadMiddleware'); 

const router = express.Router();

console.log('[Routes/SaleItem] SaleItem routes loaded. `uploadSaleItemImage` is now direct multer middleware.');


router.get('/', getAllSaleItems);
router.get('/:id', getSaleItemById);


router.post(
    '/',
    (req, res, next) => { console.log(`[Route POST /saleitems @ ${new Date().toISOString()}] Request received. Before protect.`); next(); },
    protect,
    (req, res, next) => { console.log(`[Route POST /saleitems @ ${new Date().toISOString()}] After protect. User: ${req.user?.id}. Before authorize.`); next(); },
    authorize('client', 'businessOwner', 'admin'),
    (req, res, next) => { console.log(`[Route POST /saleitems @ ${new Date().toISOString()}] After authorize. Before 'uploadSaleItemImage' (direct multer).`); next(); },

    uploadSaleItemImage,

    (req, res, next) => {
        console.log(`[Route POST /saleitems @ ${new Date().toISOString()}] Immediately AFTER 'uploadSaleItemImage' (direct multer).`);
        console.log('[Route POST /saleitems] req.file:', req.file ? { filename: req.file.filename, path: req.file.path, size: req.file.size } : 'undefined');
        console.log('[Route POST /saleitems] req.body:', req.body);

        if (!req.file && req.body && typeof req.body.image === 'object' && Object.keys(req.body.image).length === 0) {
            console.error('[Route POST /saleitems] DIAGNOSTIC: image: {} found in req.body AND req.file is undefined after direct multer. This indicates multer did not process the "image" field as a file.');
            return res.status(400).json({ success: false, message: 'Server Diagnosis: The "image" field in the form data was not processed as a file by the server. Ensure it is sent correctly as a file.' });
        }

        next(); 
    },

    (err, req, res, next) => {
        console.log(`[Route POST /saleitems @ ${new Date().toISOString()}] Error handler for multer entered.`);
        if (err) {
            console.error('[Route POST /saleitems] Error caught after multer (possibly from fileFilter or MulterError):', err.message);
            if (err.code) console.error('[Route POST /saleitems] Error code:', err.code);

            const multer = require('multer'); 
            if (err instanceof multer.MulterError) { 
                return res.status(400).json({ success: false, message: `File Upload Error (Multer): ${err.message} (Code: ${err.code})` });
            } else if (err.code === 'INVALID_FILE_TYPE_FILTER') { 
                return res.status(400).json({ success: false, message: err.message });
            }
            return res.status(500).json({ success: false, message: `File processing error: ${err.message || 'Unknown error'}` });
        }
        next();
    },
    createSaleItem
);

router.put(
    '/:id',
    protect,
    authorize('client', 'businessOwner', 'admin'),
    uploadSaleItemImage, 
    (err, req, res, next) => { /* Similar error handler as above for PUT if needed */ if(err) { console.error("Multer error on PUT:", err); return res.status(400).json({msg: "put multer err"});} next();},
    updateSaleItem
);

router.delete('/:id', protect, authorize('client', 'businessOwner', 'admin'), deleteSaleItem);

module.exports = router;