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

// --- Subdirectory for Project Images ---
const projectImagesUploadsDir = path.join(uploadsDir, 'projects');
if (!fs.existsSync(projectImagesUploadsDir)) {
    try {
        fs.mkdirSync(projectImagesUploadsDir, { recursive: true });
        console.log(`[Multer Config] Created 'projects' uploads subdirectory at ${projectImagesUploadsDir}`);
    } catch (err) {
        console.error(`[Multer Config] Error creating 'projects' uploads subdirectory '${projectImagesUploadsDir}': ${err.message}`);
    }
} else {
    console.log(`[Multer Config] 'projects' subdirectory exists at ${projectImagesUploadsDir}`);
}


// --- Storage for Sale Items ---
const saleItemStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (!fs.existsSync(saleItemsUploadsDir)) {
            try {
                fs.mkdirSync(saleItemsUploadsDir, { recursive: true });
            } catch (mkdirErr) {
                return cb(mkdirErr);
            }
        }
        cb(null, saleItemsUploadsDir);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E3);
        const finalFilename = `saleitem-${uniqueSuffix}${path.extname(safeName)}`;
        cb(null, finalFilename);
    }
});

// --- Storage for Project Images ---
const projectImageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        if (!fs.existsSync(projectImagesUploadsDir)) {
            try {
                fs.mkdirSync(projectImagesUploadsDir, { recursive: true });
            } catch (mkdirErr) {
                return cb(mkdirErr);
            }
        }
        cb(null, projectImagesUploadsDir);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E3);
        const finalFilename = `project-${uniqueSuffix}${path.extname(safeName)}`;
        cb(null, finalFilename);
    }
});

// --- File Filter for Images ---
const imageFileFilter = (req, file, cb) => {
    console.log(`[Multer FileFilter] Checking file - Fieldname: '${file.fieldname}', Original Filename: '${file.originalname}', Mimetype: '${file.mimetype}'`);
    if (file.mimetype && file.mimetype.startsWith('image/')) {
        console.log(`[Multer FileFilter] Accepting file: '${file.originalname}'`);
        cb(null, true);
    } else {
        console.warn(`[Multer FileFilter] Rejecting file: '${file.originalname}' due to mimetype '${file.mimetype}'.`);
        const err = new Error('Invalid file type. Only image files are allowed (e.g., PNG, JPG). Rejected by filter.');
        err.code = 'INVALID_FILE_TYPE_FILTER';
        cb(err, false);
    }
};

// --- Direct Multer Middleware for Sale Item Image ---
const directSaleItemUploadMiddleware = multer({
    storage: saleItemStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: imageFileFilter
}).single('image');

// --- Multer Middleware for Project Images ---
// The frontend ProAddForm.jsx sends files under the field name that corresponds to the input's `name` attribute,
// or if using FormData explicitly, the name used in `formData.append(name, file)`.
// Let's assume 'projectImages' will be used by the frontend.
const uploadProjectImagesMiddleware = multer({
    storage: projectImageStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file, adjust as needed
    fileFilter: imageFileFilter
}).array('projectImages', 10); // 'projectImages' is the field name, allowing up to 10 files


// --- Other Uploaders (Kept for completeness, if used elsewhere) ---
const generalStorage = multer.diskStorage({ destination: uploadsDir, filename: (req, file, cb) => { cb(null, `general-${Date.now()}-${file.originalname}`); } });
const generalUpload = multer({ storage: generalStorage, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadProfilePhoto = generalUpload.single('profilePhoto');
const uploadBusinessPhotos = generalUpload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'coverPhoto', maxCount: 1 }]);

module.exports = {
    uploadProfilePhoto,
    uploadBusinessPhotos,
    upload: generalUpload,
    uploadSaleItemImage: directSaleItemUploadMiddleware,
    uploadProjectImages: uploadProjectImagesMiddleware // New export
};