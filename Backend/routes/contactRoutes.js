const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/submit', contactController.submitContactForm);

router.get('/stats', protect, authorize('admin'), contactController.getContactStats);

router.get('/', protect, authorize('admin'), contactController.getAllContacts);

router.get('/:id', protect, authorize('admin'), contactController.getContactById);

router.put('/:id/status', protect, authorize('admin'), contactController.updateContactStatus);

router.post('/:id/reply', protect, authorize('admin'), contactController.sendReply);

router.delete('/:id', protect, authorize('admin'), contactController.deleteContact);

module.exports = router;