const express = require('express');
const bOwnerController = require('../controllers/bOwnerController');
const { uploadBusinessPhotos } = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

console.log('[Routes/BOwner] Loaded.');
const log = (req, res, next) => { console.log([Routes/BOwner] Hit: ${req.method} ${req.originalUrl}); next(); };

router.post( '/register', log, uploadBusinessPhotos, bOwnerController.registerBusinessOwner );

router.get( '/', log, protect, authorize('admin'), bOwnerController.getAllBusinessOwners );

module.exports = router;