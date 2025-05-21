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
const { uploadProjectImages } = require('../middleware/uploadMiddleware'); 

const logProjectRequest = (req, res, next) => {
    console.log(`[ProjectRoutes] ${req.method} ${req.originalUrl} - User: ${req.user ? req.user.id + '(' + req.user.role + ')' : 'Guest'}`);
    next();
};
router.use(logProjectRequest);

router.get('/', getAllProjects);
router.get('/:id', getProjectById);

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
    next(); 
};

router.post(
    '/',
    protect,
    authorize('admin', 'businessOwner'),
    uploadProjectImages, 
    handleProjectImageUploadError, 
    createProject
);

router.put(
    '/:id',
    protect,
    authorize('admin', 'businessOwner'), 
    uploadProjectImages, 
    handleProjectImageUploadError,
    updateProject
);

router.delete(
    '/:id',
    protect,
    authorize('admin', 'businessOwner'), 
    deleteProject
);

module.exports = router;