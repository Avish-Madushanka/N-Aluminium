const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadVideoMiddleware } = require('../middleware/videoUploadMiddleware');

router.get('/', videoController.getAllVideos);
router.get('/stats', protect, authorize('admin'), videoController.getVideoStats);
router.get('/:id', videoController.getVideoById);

router.post(
    '/',
    protect,
    authorize('admin', 'businessOwner'),
    uploadVideoMiddleware,
    videoController.createVideo
);

router.put(
    '/:id',
    protect,
    authorize('admin', 'businessOwner'),
    uploadVideoMiddleware,
    videoController.updateVideo
);

router.delete(
    '/:id',
    protect,
    authorize('admin', 'businessOwner'),
    videoController.deleteVideo
);

module.exports = router;