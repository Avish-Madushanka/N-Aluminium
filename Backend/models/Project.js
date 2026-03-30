const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required.'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters.']
    },
    description: {
        type: String,
        required: [true, 'Project description is required.'],
        trim: true,
        minlength: [10, 'Description must be at least 10 characters.']
    },
    projectType: {
        type: String,
        required: [true, 'Project type is required.'],
        enum: [
            'Aluminum Doors',
            'Aluminum Windows',
            'Full House Aluminum',
            'Curtain Walls',
            'Facade Systems',
            'Skylights',
            'Structural Glazing',
            'Other'
        ],
        trim: true
    },
    location: {
        type: String,
        trim: true,
        default: ''
    },
    projectDate: {
        type: String,
        trim: true,
        default: ''
    },
    featured: {
        type: Boolean,
        default: false
    },
    coverImage: {
        type: String,
        required: [true, 'Cover image is required.']
    },
    galleryImages: [{
        type: String,
        required: true
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userModel',
        required: true
    },
    userModel: {
        type: String,
        required: true,
        enum: ['Client', 'BusinessOwner', 'Admin']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);