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
    reviewText: {
        type: String,
        required: [true, 'Please provide your review text'],
        trim: true,
        maxlength: [2000, 'Review text cannot be more than 2000 characters']
    },
    
    isApproved: { 
        type: Boolean,
        default: false 
    }
}, { timestamps: true }); 

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);