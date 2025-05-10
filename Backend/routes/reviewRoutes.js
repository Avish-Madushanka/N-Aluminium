// Backend/routes/reviewRoutes.js
const express = require('express');
const { createReview, getReviews } = require('../controllers/reviewController');
// const { protect, authorize } = require('../middleware/authMiddleware'); // If needed

const router = express.Router();

// Corresponds to POST /api/reviews
router.post('/', createReview);

// Corresponds to GET /api/reviews
router.get('/', getReviews);

// Example Admin routes for managing reviews
// router.put('/:id/approve', protect, authorize('admin'), updateReviewApproval);
// router.delete('/:id', protect, authorize('admin'), deleteReview);

module.exports = router;