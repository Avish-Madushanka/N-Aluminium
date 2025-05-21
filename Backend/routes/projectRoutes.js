// backend/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadProjectImages } = require('../middleware/uploadMiddleware'); // .array('projectImages', 10)

// --- Middleware for logging requests to these routes ---
const logProjectRequest = (req, res, next) => {
    console.log(`[ProjectRoutes] ${req.method} ${req.originalUrl} - User: ${req.user ? req.user.id + '(' + req.user.role + ')' : 'Guest'}`);
    next();
};
router.use(logProjectRequest);


// --- Public Routes (adjust as needed) ---
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// --- Private Routes ---

// Middleware for handling multer errors specifically for project image uploads
const handleProjectImageUploadError = (err, req, res, next) => {
    if (err) {
        console.error('[ProjectRoutes UploadError] Multer error:', err.message, 'Code:', err.code);
        if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.message.includes("Unexpected field")) {
            return res.status(400).json({ success: false, message: `File upload error: Too many files, or incorrect field name. Expected field "projectImages" with up to 10 files.` });
        }
        if (err.code === 'INVALID_FILE_TYPE_FILTER') {
             return res.status(400).json({ success: false, message: err.message });
        }
        return res.status(400).json({ success: false, message: err.message || 'File upload error.' });
    }
    next(); // Proceed if no error from multer
};

router.post(
    '/',
    protect,
    authorize('admin', 'businessOwner'), // Example: Admins and Business Owners can create
    uploadProjectImages, // This is multer().array('projectImages', 10)
    handleProjectImageUploadError, // Handle errors from uploadProjectImages
    createProject
);

router.put(
    '/:id',
    protect,
    authorize('admin', 'businessOwner'), // Controller also has ownership/admin check
    uploadProjectImages, // For adding/replacing images during update
    handleProjectImageUploadError,
    updateProject
);

router.delete(
    '/:id',
    protect,
    authorize('admin', 'businessOwner'), // Controller also has ownership/admin check
    deleteProject
);

module.exports = router;