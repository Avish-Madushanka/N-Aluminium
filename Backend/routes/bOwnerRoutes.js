const express = require('express');
const bOwnerController = require('../controllers/bOwnerController');
const { uploadBusinessPhotos } = require('../middleware/uploadMiddleware');
const { protect, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

console.log('[Routes/BOwner] Loaded.');
const log = (req, res, next) => { console.log(`[Routes/BOwner] Hit: ${req.method} ${req.originalUrl}`); next(); };

router.post( '/register', log, uploadBusinessPhotos, bOwnerController.registerBusinessOwner);

router.get( '/', log, protect, authorize('admin'), bOwnerController.getAllBusinessOwners);

// Route for business owner to get their own profile
router.get('/me', log, protect, authorize('businessOwner'), bOwnerController.getMyBOwnerProfile);

// Route for business owner to update their own profile
router.put('/me', log, protect, authorize('businessOwner'), uploadBusinessPhotos, bOwnerController.updateMyBOwnerProfile);


module.exports = router;
