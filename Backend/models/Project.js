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
    projectType: { 
        type: String,
        required: [true, 'Project type is required.'],
        enum: ['web', 'mobile', 'design', 'other'], 
        trim: true,
    },
    images: [{ 
        type: String,
        required: [true, 'At least one project image is required.'],
    }],
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userModel', 
        required: true,
    },
    userModel: { 
        type: String,
        required: true,
        enum: ['Client', 'BusinessOwner', 'Admin'],
    },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);