// Backend/models/reviewModel.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject for your review'],
        trim: true,
        maxlength: [200, 'Subject cannot be more than 200 characters']
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot be more than 5'],
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value for rating'
        }
    },
    reviewText: { // Changed from 'comment' to match frontend formData
        type: String,
        required: [true, 'Please provide your review text'],
        trim: true,
        maxlength: [2000, 'Review text cannot be more than 2000 characters']
    },
    // Optional: Link to a user if reviews are tied to logged-in users
    // userId: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Client', // Or a generic 'User' model
    //   required: false // Make it optional if guest reviews are allowed
    // },
    // Optional: Link to a product/service if reviews are for specific items
    // itemId: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Product', // Example
    //   required: false
    // },
    isApproved: { // For admin moderation
        type: Boolean,
        default: false // Reviews might need approval before displaying
    }
}, { timestamps: true }); // Adds createdAt and updatedAt

// Prevent duplicate reviews from the same email for the same subject quickly (optional)
// reviewSchema.index({ email: 1, subject: 1 }, { unique: true, partialFilterExpression: { /* condition if needed */ } });

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);