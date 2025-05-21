// backend/models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required.'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Project description is required.'],
        trim: true,
    },
    projectType: { // Corresponds to the 'type' select element in ProAddForm.jsx
        type: String,
        required: [true, 'Project type is required.'],
        enum: ['web', 'mobile', 'design', 'other'], // 'other' added for flexibility
        trim: true,
    },
    images: [{ // Array of strings (paths to images relative to /uploads)
        type: String,
        required: [true, 'At least one project image is required.'],
    }],
    userId: { // User who created the project
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userModel', // Dynamic reference based on userModel
        required: true,
    },
    userModel: { // Model of the user (e.g., 'Client', 'BusinessOwner', 'Admin')
        type: String,
        required: true,
        enum: ['Client', 'BusinessOwner', 'Admin'],
    },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);