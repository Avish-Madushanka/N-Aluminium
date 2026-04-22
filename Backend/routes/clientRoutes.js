const express = require('express');
const clientController = require('../controllers/clientController');
const { uploadProfilePhoto } = require('../middleware/uploadMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

console.log('[Routes/Client] Loaded.');

router.post('/register', uploadProfilePhoto, clientController.registerClient);

router.get('/:id', authMiddleware.protect, authMiddleware.authorize('client', 'admin'), authMiddleware.checkOwnershipOrAdmin(), clientController.getClientProfile);

router.put('/:id', authMiddleware.protect, authMiddleware.authorize('client', 'admin'), authMiddleware.checkOwnershipOrAdmin(), uploadProfilePhoto, clientController.updateClientProfile);

module.exports = router;