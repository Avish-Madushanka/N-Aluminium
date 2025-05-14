// backend/routes/clientRoutes.js
const express = require('express');
const clientController = require('../controllers/clientController');
const { uploadProfilePhoto } = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

console.log('[Routes/Client] Loaded.');
const log = (req, res, next) => { console.log(`[Routes/Client] Hit: ${req.method} ${req.originalUrl}`); next(); };

// POST /api/clients/register (Public)
router.post( '/register', log, uploadProfilePhoto, clientController.registerClient );

// GET /api/clients/:id (Fetch Client Profile - Protected for client or admin)
router.get( '/:id', log, authMiddleware.protect, authMiddleware.authorize('client', 'admin'), authMiddleware.checkOwnershipOrAdmin(), clientController.getClientProfile );

// PUT /api/clients/:id (Update Client Profile - Protected for client owning profile OR admin)
router.put( '/:id', log, authMiddleware.protect, authMiddleware.authorize('client', 'admin'), authMiddleware.checkOwnershipOrAdmin(), uploadProfilePhoto, clientController.updateClientProfile );

module.exports = router;