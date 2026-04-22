const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadsDir)) {
    try {
        fs.mkdirSync(uploadsDir, { recursive: true });
    } catch (err) {
        console.error(`[Multer Config] Error creating uploads dir '${uploadsDir}': ${err.message}`);
    }
}

const subdirectories = ['saleitems', 'projects', 'profiles', 'items', 'cart', 'quotations'];
subdirectories.forEach(subDir => {
    const subDirPath = path.join(uploadsDir, subDir);
    if (!fs.existsSync(subDirPath)) {
        try {
            fs.mkdirSync(subDirPath, { recursive: true });
        } catch (err) {
            console.error(`[Multer Config] Error creating '${subDir}' uploads subdirectory: ${err.message}`);
        }
    }
});

const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (file.mimetype && allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const err = new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF images are allowed.');
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

const cartStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const cartUploadsDir = path.join(uploadsDir, 'cart');
        if (!fs.existsSync(cartUploadsDir)) {
            try {
                fs.mkdirSync(cartUploadsDir, { recursive: true });
            } catch (mkdirErr) {
                return cb(mkdirErr);
            }
        }
        cb(null, cartUploadsDir);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E3);
        const finalFilename = `cart-${uniqueSuffix}${path.extname(safeName)}`;
        cb(null, finalFilename);
    }
});

const profilePhotoStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const profilesUploadsDir = path.join(uploadsDir, 'profiles');
        if (!fs.existsSync(profilesUploadsDir)) {
            try {
                fs.mkdirSync(profilesUploadsDir, { recursive: true });
            } catch (mkdirErr) {
                return cb(mkdirErr);
            }
        }
        cb(null, profilesUploadsDir);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E3);
        const finalFilename = `profile-${uniqueSuffix}${path.extname(safeName)}`;
        cb(null, finalFilename);
    }
});

const coverPhotoStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const profilesUploadsDir = path.join(uploadsDir, 'profiles');
        if (!fs.existsSync(profilesUploadsDir)) {
            try {
                fs.mkdirSync(profilesUploadsDir, { recursive: true });
            } catch (mkdirErr) {
                return cb(mkdirErr);
            }
        }
        cb(null, profilesUploadsDir);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E3);
        const finalFilename = `cover-${uniqueSuffix}${path.extname(safeName)}`;
        cb(null, finalFilename);
    }
});

const quotationStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const quotationsUploadsDir = path.join(uploadsDir, 'quotations');
        if (!fs.existsSync(quotationsUploadsDir)) {
            try {
                fs.mkdirSync(quotationsUploadsDir, { recursive: true });
            } catch (mkdirErr) {
                return cb(mkdirErr);
            }
        }
        cb(null, quotationsUploadsDir);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E3);
        const finalFilename = `quotation-${uniqueSuffix}${path.extname(safeName)}`;
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

const uploadCartImageMiddleware = multer({
    storage: cartStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter
}).single('cartImage');

const uploadProfilePhotoMiddleware = multer({
    storage: profilePhotoStorage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: imageFileFilter
}).single('profilePhoto');

const uploadCoverPhotoMiddleware = multer({
    storage: coverPhotoStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter
}).single('coverPhoto');

const uploadQuotationFilesMiddleware = multer({
    storage: quotationStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function(req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'), false);
        }
    }
}).array('files', 10);

const uploadAdminFilesMiddleware = multer({
    storage: quotationStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function(req, file, cb) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, PNG, and PDF files are allowed.'), false);
        }
    }
}).array('adminFiles', 10);

const generalUpload = multer({ 
    storage: generalStorage, 
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter
});

const uploadBusinessPhotosMiddleware = multer({
    storage: profilePhotoStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter
}).fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
]);

module.exports = {
    uploadProfilePhoto: uploadProfilePhotoMiddleware,
    uploadCoverPhoto: uploadCoverPhotoMiddleware,
    uploadBusinessPhotos: uploadBusinessPhotosMiddleware,
    upload: generalUpload,
    uploadSaleItemImage: directSaleItemUploadMiddleware,
    uploadProjectImages: uploadProjectImagesMiddleware,
    uploadItemImage: uploadItemImageMiddleware,
    uploadCartImage: uploadCartImageMiddleware,
    uploadQuotationFiles: uploadQuotationFilesMiddleware,
    uploadAdminFiles: uploadAdminFilesMiddleware
};