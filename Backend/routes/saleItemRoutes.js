// backend/routes/saleItemRoutes.js
const express = require('express');
const {
    createSaleItem,
    getAllSaleItems,
    getSaleItemById,
    updateSaleItem,
    deleteSaleItem
} = require('../controllers/saleItemController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadSaleItemImage } = require('../middleware/uploadMiddleware'); // This now imports directSaleItemUploadMiddleware

const router = express.Router();

console.log('[Routes/SaleItem] SaleItem routes loaded. `uploadSaleItemImage` is now direct multer middleware.');

// Public routes
router.get('/', getAllSaleItems);
router.get('/:id', getSaleItemById);

// Private route for creating a sale item
router.post(
    '/',
    (req, res, next) => { console.log(`[Route POST /saleitems @ ${new Date().toISOString()}] Request received. Before protect.`); next(); },
    protect,
    (req, res, next) => { console.log(`[Route POST /saleitems @ ${new Date().toISOString()}] After protect. User: ${req.user?.id}. Before authorize.`); next(); },
    authorize('client', 'businessOwner', 'admin'),
    (req, res, next) => { console.log(`[Route POST /saleitems @ ${new Date().toISOString()}] After authorize. Before 'uploadSaleItemImage' (direct multer).`); next(); },

    // Applying the direct multer middleware for the 'image' field
    // This middleware will try to process the file. If it encounters an error (e.g., from fileFilter),
    // it should ideally call next(err). If successful, it populates req.file and req.body.
    uploadSaleItemImage,

    // Middleware to explicitly log state AFTER multer and handle potential multer errors passed via next(err)
    (req, res, next) => {
        console.log(`[Route POST /saleitems @ ${new Date().toISOString()}] Immediately AFTER 'uploadSaleItemImage' (direct multer).`);
        console.log('[Route POST /saleitems] req.file:', req.file ? { filename: req.file.filename, path: req.file.path, size: req.file.size } : 'undefined');
        console.log('[Route POST /saleitems] req.body:', req.body);

        // This check is mostly for the stubborn "image: {}" case if multer silently fails for the 'image' field
        if (!req.file && req.body && typeof req.body.image === 'object' && Object.keys(req.body.image).length === 0) {
            console.error('[Route POST /saleitems] DIAGNOSTIC: image: {} found in req.body AND req.file is undefined after direct multer. This indicates multer did not process the "image" field as a file.');
            // Sending a specific error here to make it clear this check was hit.
            return res.status(400).json({ success: false, message: 'Server Diagnosis: The "image" field in the form data was not processed as a file by the server. Ensure it is sent correctly as a file.' });
        }
        // If req.file is still undefined here but the above condition wasn't met (e.g. image field entirely missing from body),
        // the controller's check for !req.file will catch it.
        next(); // Proceed to controller or next error handler
    },
    // Error handling middleware specifically for errors from the preceding `uploadSaleItemImage`
    (err, req, res, next) => {
        console.log(`[Route POST /saleitems @ ${new Date().toISOString()}] Error handler for multer entered.`);
        if (err) {
            console.error('[Route POST /saleitems] Error caught after multer (possibly from fileFilter or MulterError):', err.message);
            if (err.code) console.error('[Route POST /saleitems] Error code:', err.code);

            const multer = require('multer'); // Import multer here to check instanceof
            if (err instanceof multer.MulterError) { // Specific Multer errors
                return res.status(400).json({ success: false, message: `File Upload Error (Multer): ${err.message} (Code: ${err.code})` });
            } else if (err.code === 'INVALID_FILE_TYPE_FILTER') { // Custom error from our filter
                return res.status(400).json({ success: false, message: err.message });
            }
            // Other unexpected errors during upload
            return res.status(500).json({ success: false, message: `File processing error: ${err.message || 'Unknown error'}` });
        }
        // If no error, but somehow this middleware was called, proceed. (Unlikely path)
        next();
    },
    createSaleItem
);

// PUT and DELETE routes (ensure they also use appropriate upload middleware if they can update images)
router.put(
    '/:id',
    protect,
    authorize('client', 'businessOwner', 'admin'),
    uploadSaleItemImage, // If PUT can also change the image
    (err, req, res, next) => { /* Similar error handler as above for PUT if needed */ if(err) { console.error("Multer error on PUT:", err); return res.status(400).json({msg: "put multer err"});} next();},
    updateSaleItem
);

router.delete('/:id', protect, authorize('client', 'businessOwner', 'admin'), deleteSaleItem);

module.exports = router;