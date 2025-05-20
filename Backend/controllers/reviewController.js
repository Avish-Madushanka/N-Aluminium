const Review = require('../models/reviewModel');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');

exports.createReview = asyncHandler(async (req, res, next) => {
    console.log('--- BACKEND: /api/reviews POST ---');
    console.log('Review Data Received:', JSON.stringify(req.body, null, 2));

    const { name, email, subject, rating, reviewText } = req.body;

    if (!name || !email || !subject || !rating || !reviewText) {
        return next(new ErrorResponse('Please provide all required review fields.', 400));
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return next(new ErrorResponse('Rating must be a number between 1 and 5.', 400));
    }

    try {

        const review = await Review.create({
            name,
            email,
            subject,
            rating,
            reviewText,
            isApproved: false 
        });

        console.log(`Review created successfully: ${review._id}`);
        res.status(201).json({
            success: true,
            message: 'Thank you! Your review has been submitted successfully and is pending approval.',
            data: review
        });

    } catch (error) {
        next(error);
    }
});

exports.getReviews = asyncHandler(async (req, res, next) => {
    const query = req.user?.role === 'admin' ? {} : { isApproved: true };

    const reviews = await Review.find(query).sort({ createdAt: -1 }); 

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});
