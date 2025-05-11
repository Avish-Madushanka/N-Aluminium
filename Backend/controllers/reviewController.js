// Backend/controllers/reviewController.js
const Review = require('../models/reviewModel');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Public (or Protected if only logged-in users can review)
exports.createReview = asyncHandler(async (req, res, next) => {
    console.log('--- BACKEND: /api/reviews POST ---');
    console.log('Review Data Received:', JSON.stringify(req.body, null, 2));

    const { name, email, subject, rating, reviewText } = req.body;

    // --- Basic Server-Side Validation (Mongoose schema will also validate) ---
    if (!name || !email || !subject || !rating || !reviewText) {
        return next(new ErrorResponse('Please provide all required review fields.', 400));
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return next(new ErrorResponse('Rating must be a number between 1 and 5.', 400));
    }
    // You could add more specific validation for email format, lengths etc. here,
    // but Mongoose schema validation is generally preferred for that.

    try {
        // Optional: If reviews are tied to users, you'd get userId from req.user (if protected route)
        // const userId = req.user ? req.user.id : null;

        const review = await Review.create({
            name,
            email,
            subject,
            rating,
            reviewText,
            // userId: userId, // Uncomment if linking to user
            isApproved: false // Default to not approved, admin can approve later
        });

        console.log(`Review created successfully: ${review._id}`);
        res.status(201).json({
            success: true,
            message: 'Thank you! Your review has been submitted successfully and is pending approval.',
            data: review
        });

    } catch (error) {
        // Let the global errorHandler handle Mongoose validation errors or other DB issues
        next(error);
    }
});

// @desc    Get all reviews (potentially for admin or public display after approval)
// @route   GET /api/reviews
// @access  Public (for approved reviews) or Admin
exports.getReviews = asyncHandler(async (req, res, next) => {
    // For public display, only fetch approved reviews
    // For admin, fetch all or allow filtering
    const query = req.user?.role === 'admin' ? {} : { isApproved: true };

    const reviews = await Review.find(query).sort({ createdAt: -1 }); // Newest first

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

// --- Add other review controller functions as needed (e.g., for admin) ---
// exports.getReviewById = asyncHandler(async (req, res, next) => { ... });
// exports.updateReviewApproval = asyncHandler(async (req, res, next) => { ... }); // Admin: approve/reject
// exports.deleteReview = asyncHandler(async (req, res, next) => { ... });         // Admin: delete