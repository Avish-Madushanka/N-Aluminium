const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Video title is required'],
        trim: true
    },
    videoUrl: {
        type: String,
        required: [true, 'Video URL is required'],
        trim: true
    },
    thumbnail: {
        type: String,
        default: null
    },
    duration: {
        type: String,
        default: '00:00'
    },
    color: {
        type: String,
        default: '#3498db'
    },
    isYouTube: {
        type: Boolean,
        default: false
    },
    youtubeId: {
        type: String,
        default: null
    },
    localVideoPath: {
        type: String,
        default: null
    },
    size: {
        type: Number,
        default: 0
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'uploadedByModel',
        required: true
    },
    uploadedByModel: {
        type: String,
        enum: ['Admin', 'Client', 'BusinessOwner'],
        default: 'Admin'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Video', videoSchema);