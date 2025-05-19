const mongoose = require('mongoose');

const shopLocationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Store name is required.'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required.'],
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    hours: {
        type: String,
        trim: true,
    },
    additional: { 
        type: String,
        trim: true,
    },
    type: {
        type: String,
        required: [true, 'Location type is required.'],
        enum: ['main', 'partner', 'outlet'],
        default: 'main',
    },
    position: {
        lat: {
            type: Number,
            required: [true, 'Latitude is required.'],
        },
        lng: {
            type: Number,
            required: [true, 'Longitude is required.'],
        },
    },
}, { timestamps: true });

module.exports = mongoose.model('ShopLocation', shopLocationSchema);