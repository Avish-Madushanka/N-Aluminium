// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Base Uploads Directory ---
const uploadsDir = path.join(__dirname, '../uploads');
console.log(`[Multer Config] Uploads directory target: ${uploadsDir}`);
if (!fs.existsSync(uploadsDir)) {
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log(`[Multer Config] Created uploads directory: ${uploadsDir}`);
    } catch (err) {
        console.error(`[Multer Config] Error creating uploads dir '${uploadsDir}': ${err.message}`);
    }
} else {
    console.log(`[Multer Config] Uploads directory exists: ${uploadsDir}`);
}

// --- Subdirectory for Sale Item Images ---
const saleItemsUploadsDir = path.join(uploadsDir, 'saleitems');
if (!fs.existsSync(saleItemsUploadsDir)) {
    try {
        fs.mkdirSync(saleItemsUploadsDir, { recursive: true });
        console.log(`[Multer Config] Created 'saleitems' uploads subdirectory at ${saleItemsUploadsDir}`);
    } catch (err) {
        console.error(`[Multer Config] Error creating 'saleitems' uploads subdirectory '${saleItemsUploadsDir}': ${err.message}`);
    }
} else {
    console.log(`[Multer Config] 'saleitems' subdirectory exists at ${saleItemsUploadsDir}`);
}

// --- Storage for Sale Items ---
const saleItemStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Ensure directory exists at the time of saving
        if (!fs.existsSync(saleItemsUploadsDir)) {
            try {
                fs.mkdirSync(saleItemsUploadsDir, { recursive: true });
                console.log(`[Multer DiskStorage] Destination: Re-created 'saleitems' dir: ${saleItemsUploadsDir}`);
            } catch (mkdirErr) {
                console.error(`[Multer DiskStorage] Destination: Error re-creating dir '${saleItemsUploadsDir}': ${mkdirErr.message}`);
                return cb(mkdirErr);
            }
        }
        console.log(`[Multer DiskStorage] Destination: Using dir: ${saleItemsUploadsDir} for file: ${file.originalname}`);
        cb(null, saleItemsUploadsDir);
    },
    filename: (req, file, cb) => {
        console.log(`[Multer DiskStorage] Filename: Generating for: ${file.originalname}`);
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E3);
        const finalFilename = `saleitem-${uniqueSuffix}${path.extname(safeName)}`;
        console.log(`[Multer DiskStorage] Filename: Generated as: ${finalFilename}`);
        cb(null, finalFilename);
    }
});

// --- File Filter for Images ---
const imageFileFilter = (req, file, cb) => {
    // This log is CRITICAL to see if multer is even attempting to process the field as a file
    console.log(`[Multer FileFilter] Checking file - Fieldname: '${file.fieldname}', Original Filename: '${file.originalname}', Mimetype: '${file.mimetype}'`);
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        console.log(`[Multer FileFilter] Accepting file: '${file.originalname}'`);
        cb(null, true); // Accept file
    } else {
        console.warn(`[Multer FileFilter] Rejecting file: '${file.originalname}' due to mimetype '${file.mimetype}'.`);
        const err = new Error('Invalid file type. Only image files are allowed (e.g., PNG, JPG). Rejected by filter.');
        err.code = 'INVALID_FILE_TYPE_FILTER'; // Custom code for easier identification
        cb(err, false); // Reject file, pass error
    }
};

// --- Direct Multer Middleware for Sale Item Image ---
// This is what will be imported and used directly in the route.
// It's an instance of multer configured to handle a single file from the 'image' field.
const directSaleItemUploadMiddleware = multer({
    storage: saleItemStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter
}).single('image'); // The field name from FormData MUST be 'image'

// --- Other Uploaders (Kept for completeness, if used elsewhere) ---
const generalStorage = multer.diskStorage({ destination: uploadsDir, filename: (req, file, cb) => { cb(null, `general-${Date.now()}-${file.originalname}`); } });
const generalUpload = multer({ storage: generalStorage, limits: { fileSize: 5 * 1024 * 1024 } }); // Example: general filter could be different
const uploadProfilePhoto = generalUpload.single('profilePhoto');
const uploadBusinessPhotos = generalUpload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'coverPhoto', maxCount: 1 }]);

module.exports = {
    uploadProfilePhoto,
    uploadBusinessPhotos,
    upload: generalUpload, // Exporting the general purpose multer instance if needed
    uploadSaleItemImage: directSaleItemUploadMiddleware // Exporting the direct multer middleware for sale items
};