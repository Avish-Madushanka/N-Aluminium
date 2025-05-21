const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required.'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required.'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required.'],
        trim: true,
    },
    district: {
        type: String,
        required: [true, 'District is required.'],
    },
    province: {
        type: String,
        required: [true, 'Province is required.'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required.'],
        min: [0, 'Price cannot be negative.'],
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required.'],
        trim: true,
    },
    type: { 
        type: String,
        required: [true, 'Item type is required.'],
    },
    imagePath: { 
        type: String,
        required: [true, 'Image is required.'],
    },
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
    isSold: {
        type: Boolean,
        default: false,
    },
    
}, { timestamps: true });

module.exports = mongoose.model('SaleItem', saleItemSchema);