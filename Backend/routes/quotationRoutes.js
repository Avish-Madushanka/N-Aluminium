const express = require('express');
const router = express.Router();
const quotationController = require('../controllers/quotationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, quotationController.createQuotationRequest);
router.get('/my-requests', protect, quotationController.getUserQuotationRequests);
router.get('/stats', protect, authorize('admin'), quotationController.getQuotationStats);
router.get('/', protect, authorize('admin'), quotationController.getAllQuotationRequests);
router.get('/:id', protect, quotationController.getQuotationRequestById);
router.put('/:id/status', protect, authorize('admin'), quotationController.updateQuotationStatus);
router.delete('/:id', protect, quotationController.deleteQuotationRequest);

module.exports = router;