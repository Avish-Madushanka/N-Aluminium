const express = require('express');
const router = express.Router();
const aluQuotationController = require('../controllers/aluQuotationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadQuotationFiles, uploadAdminFiles } = require('../middleware/aluQuotationUpload');

router.post('/', protect, uploadQuotationFiles, aluQuotationController.createQuotationRequest);

router.get('/my-requests', protect, aluQuotationController.getMyQuotationRequests);

router.get('/stats', protect, authorize('admin'), aluQuotationController.getQuotationStats);

router.get('/', protect, authorize('admin'), aluQuotationController.getAllQuotationRequests);

router.get('/:id', protect, aluQuotationController.getQuotationRequestById);

router.put('/:id/status', protect, authorize('admin'), uploadAdminFiles, aluQuotationController.updateQuotationStatus);

router.delete('/:id', protect, aluQuotationController.deleteQuotationRequest);

module.exports = router;