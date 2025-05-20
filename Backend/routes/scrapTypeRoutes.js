const express = require('express');
const router = express.Router();
const {
    createScrapType,
    getAllScrapTypes,
    getScrapTypeById,
    updateScrapType,
    deleteScrapType,
    forceDeleteScrapType
} = require('../controllers/scrapTypeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getAllScrapTypes);

router.post('/', protect, authorize('admin'), createScrapType);

router.get('/:id', protect, authorize('admin'), getScrapTypeById);
router.put('/:id', protect, authorize('admin'), updateScrapType);
router.delete('/:id', protect, authorize('admin'), deleteScrapType); 
router.delete('/:id/force', protect, authorize('admin'), forceDeleteScrapType);

module.exports = router;