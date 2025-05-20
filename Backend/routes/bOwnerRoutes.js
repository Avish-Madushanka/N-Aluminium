const express = require('express');
const bOwnerController = require('../controllers/bOwnerController');
const { uploadBusinessPhotos } = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

console.log('[Routes/BOwner] Loaded.');
const log = (req, res, next) => { console.log([Routes/BOwner] Hit: ${req.method} ${req.originalUrl}); next(); };

// POST /api/b-owners/register
router.post( '/register', log, uploadBusinessPhotos, bOwnerController.registerBusinessOwner );

// GET /api/b-owners (Admin only - get all business owners)
router.get( '/', log, protect, authorize('admin'), bOwnerController.getAllBusinessOwners );

// Add GET/PUT etc. for business owners here later if needed, using authMiddleware

module.exports = router;