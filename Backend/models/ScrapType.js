const mongoose = require('mongoose');

const scrapTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Scrap type name is required.'],
        trim: true,
        unique: true, 
    },
    price: {
        type: Number,
        required: [true, 'Price is required.'],
        min: [0, 'Price cannot be negative.'],
    },
    unit: {
        type: String,
        required: [true, 'Unit is required.'],
        default: 'kg', 
        trim: true,
        lowercase: true,
    },
    description: {
        type: String,
        trim: true,
    },
    isActive: { 
        type: Boolean,
        default: true,
    },
}, { timestamps: true });


module.exports = mongoose.model('ScrapType', scrapTypeSchema);