const express = require('express');
const router = express.Router();
const {
    createReview,
    getReviews,
    getReviewStats,
    approveReview,
    rejectReview,
    deleteReview,
    sendReviewReply
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', createReview);

router.get('/', protect, authorize('admin'), getReviews);

router.get('/stats', protect, authorize('admin'), getReviewStats);

router.put('/:id/approve', protect, authorize('admin'), approveReview);

router.put('/:id/reject', protect, authorize('admin'), rejectReview);

router.delete('/:id', protect, authorize('admin'), deleteReview);

router.post('/:id/reply', protect, authorize('admin'), sendReviewReply);

module.exports = router;