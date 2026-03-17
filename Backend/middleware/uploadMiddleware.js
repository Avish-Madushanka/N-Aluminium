const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

const subdirectories = ['saleitems', 'projects', 'profiles', 'items'];
subdirectories.forEach(subDir => {
    const subDirPath = path.join(uploadsDir, subDir);
    if (!fs.existsSync(subDirPath)) {
        try {
            fs.mkdirSync(subDirPath, { recursive: true });
            console.log(`[Multer Config] Created '${subDir}' uploads subdirectory at ${subDirPath}`);
        } catch (err) {
            console.error(`[Multer Config] Error creating '${subDir}' uploads subdirectory: ${err.message}`);
        }
    } else {
        console.log(`[Multer Config] '${subDir}' subdirectory exists at ${subDirPath}`);
    }
});

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

const saleItemStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const saleItemsUploadsDir = path.join(uploadsDir, 'saleitems');
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

const projectImageStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const projectImagesUploadsDir = path.join(uploadsDir, 'projects');
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

const itemStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const itemsUploadsDir = path.join(uploadsDir, 'items');
        if (!fs.existsSync(itemsUploadsDir)) {
            try {
                fs.mkdirSync(itemsUploadsDir, { recursive: true });
            } catch (mkdirErr) {
                return cb(mkdirErr);
            }
        }
        cb(null, itemsUploadsDir);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E3);
        const finalFilename = `item-${uniqueSuffix}${path.extname(safeName)}`;
        cb(null, finalFilename);
    }
});

const generalStorage = multer.diskStorage({ 
    destination: function(req, file, cb) {
        cb(null, uploadsDir);
    }, 
    filename: (req, file, cb) => { 
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `general-${Date.now()}-${safeName}`); 
    } 
});

const directSaleItemUploadMiddleware = multer({
    storage: saleItemStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter
}).single('image');

const uploadProjectImagesMiddleware = multer({
    storage: projectImageStorage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: imageFileFilter
}).array('projectImages', 10);

const uploadItemImageMiddleware = multer({
    storage: itemStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter
}).single('image');

const generalUpload = multer({ 
    storage: generalStorage, 
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter
});

module.exports = {
    uploadProfilePhoto: generalUpload.single('profilePhoto'),
    uploadBusinessPhotos: generalUpload.fields([
        { name: 'profilePhoto', maxCount: 1 }, 
        { name: 'coverPhoto', maxCount: 1 }
    ]),
    upload: generalUpload,
    uploadSaleItemImage: directSaleItemUploadMiddleware,
    uploadProjectImages: uploadProjectImagesMiddleware,
    uploadItemImage: uploadItemImageMiddleware
};