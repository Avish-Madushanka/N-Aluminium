const express = require('express');
const clientController = require('../controllers/clientController');
const { uploadProfilePhoto } = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

console.log('[Routes/Client] Loaded.');
const log = (req, res, next) => { console.log(`[Routes/Client] Hit: ${req.method} ${req.originalUrl}`); next(); };

router.post( '/register', log, uploadProfilePhoto, clientController.registerClient );

router.get( '/:id', log, authMiddleware.protect, authMiddleware.authorize('client', 'admin'), authMiddleware.checkOwnershipOrAdmin(), clientController.getClientProfile );

router.put( '/:id', log, authMiddleware.protect, authMiddleware.authorize('client', 'admin'), authMiddleware.checkOwnershipOrAdmin(), uploadProfilePhoto, clientController.updateClientProfile );

module.exports = router;