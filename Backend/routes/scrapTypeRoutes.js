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

// Public route to get scrap types (e.g., for the calculator)
// Frontend can filter by isActive: true if needed, or use query param ?active=true
router.get('/', getAllScrapTypes);

// Admin only routes
router.post('/', protect, authorize('admin'), createScrapType);

// Specific ID routes
// Make getScrapTypeById public if your calculator needs to fetch one by ID for some reason
// Otherwise, keep it admin-only. For now, making it admin-only.
router.get('/:id', protect, authorize('admin'), getScrapTypeById);
router.put('/:id', protect, authorize('admin'), updateScrapType);
router.delete('/:id', protect, authorize('admin'), deleteScrapType); // Soft delete
router.delete('/:id/force', protect, authorize('admin'), forceDeleteScrapType); // Hard delete

module.exports = router;