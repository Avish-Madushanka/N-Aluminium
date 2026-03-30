const express = require('express');
const router = express.Router();
const {
    createProject,
    getAllProjects,
    getProjectById,
    getProjectsByCategory,
    getFeaturedProjects,
    updateProject,
    deleteProject,
    getProjectStats
} = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadProjectImages } = require('../middleware/uploadMiddleware');

const handleProjectImageUploadError = (err, req, res, next) => {
    if (err) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ 
                success: false, 
                message: 'File upload error: Too many files, or incorrect field name. Expected field "projectImages" with up to 10 files.' 
            });
        }
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                success: false, 
                message: 'File size too large. Maximum file size is 10MB.' 
            });
        }
        if (err.code === 'INVALID_FILE_TYPE_FILTER') {
            return res.status(400).json({ success: false, message: err.message });
        }
        return res.status(400).json({ success: false, message: err.message || 'File upload error.' });
    }
    next();
};

router.get('/', getAllProjects);
router.get('/stats', getProjectStats);
router.get('/featured', getFeaturedProjects);
router.get('/category/:category', getProjectsByCategory);
router.get('/:id', getProjectById);

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