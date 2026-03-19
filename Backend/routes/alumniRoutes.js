const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadAlumniFiles } = require('../middleware/alumniUploadMiddleware');

router.post('/register', uploadAlumniFiles, alumniController.registerAlumni);
router.get('/stats', protect, authorize('admin'), alumniController.getAlumniStats);
router.get('/', protect, authorize('admin'), alumniController.getAllAlumniRegistrations);
router.get('/:id', protect, authorize('admin'), alumniController.getAlumniRegistrationById);
router.put('/:id/status', protect, authorize('admin'), alumniController.updateAlumniStatus);
router.delete('/:id', protect, authorize('admin'), alumniController.deleteAlumniRegistration);

module.exports = router;