const Review = require('../models/reviewModel');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');
const { sendReviewReplyEmail } = require('../utils/emailService');

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
    console.log('--- GET /api/reviews ---');
    console.log('User role:', req.user?.role);
    
    const query = req.user?.role === 'admin' ? {} : { isApproved: true };
    const reviews = await Review.find(query).sort({ createdAt: -1 });

    console.log(`Found ${reviews.length} reviews`);
    
    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

exports.getReviewStats = asyncHandler(async (req, res, next) => {
    console.log('--- GET /api/reviews/stats ---');
    
    const total = await Review.countDocuments();
    const approved = await Review.countDocuments({ isApproved: true });
    const pending = await Review.countDocuments({ isApproved: false });

    console.log(`Stats - Total: ${total}, Approved: ${approved}, Pending: ${pending}`);
    
    res.status(200).json({
        success: true,
        data: { total, approved, pending, rejected: 0 }
    });
});

exports.approveReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(new ErrorResponse('Review not found', 404));
    }

    review.isApproved = true;
    await review.save();

    res.status(200).json({
        success: true,
        message: 'Review approved successfully',
        data: review
    });
});

exports.rejectReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(new ErrorResponse('Review not found', 404));
    }

    review.isApproved = false;
    await review.save();

    res.status(200).json({
        success: true,
        message: 'Review rejected successfully',
        data: review
    });
});

exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if (!review) {
        return next(new ErrorResponse('Review not found', 404));
    }

    await review.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
    });
});

exports.sendReviewReply = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { reply, subject } = req.body;

    if (!reply || reply.trim() === '') {
        return next(new ErrorResponse('Reply message is required', 400));
    }

    const review = await Review.findById(id);
    if (!review) {
        return next(new ErrorResponse('Review not found', 404));
    }

    review.adminReply = reply.trim();
    review.repliedAt = new Date();
    await review.save();

    await sendReviewReplyEmail(review.email, review.name, subject || `Re: ${review.subject}`, reply, review);

    res.status(200).json({
        success: true,
        message: 'Reply sent successfully',
        data: review
    });
});