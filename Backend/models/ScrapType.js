// backend/models/ScrapType.js
const mongoose = require('mongoose');

const scrapTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Scrap type name is required.'],
        trim: true,
        unique: true, // Ensure names like "Clean Aluminum" are unique
    },
    price: {
        type: Number,
        required: [true, 'Price is required.'],
        min: [0, 'Price cannot be negative.'],
    },
    unit: {
        type: String,
        required: [true, 'Unit is required.'],
        default: 'kg', // Default unit
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
    },
    isActive: { // For soft delete or hiding from public view
        type: Boolean,
        default: true,
    },
    // Automatically add createdAt and updatedAt
}, { timestamps: true });

// To make searches case-insensitive for name, you could add an index
// scrapTypeSchema.index({ name: 'text' }); // For more complex text search
// Or ensure your queries handle case-insensitivity if needed.

module.exports = mongoose.model('ScrapType', scrapTypeSchema);