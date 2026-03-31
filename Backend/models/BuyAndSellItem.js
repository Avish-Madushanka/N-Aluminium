const mongoose = require('mongoose');

const buyAndSellItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    oldPrice: {
        type: Number,
        min: [0, 'Old price cannot be negative'],
        default: null
    },
    type: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Doors', 'Windows', 'Pan-Light', 'Glass', 'Others'],
        default: 'Others'
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
        default: 'Good'
    },
    brand: {
        type: String,
        trim: true,
        default: ''
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    imagePath: {
        type: String,
        required: [true, 'Main image is required']
    },
    additionalImages: {
        type: [String],
        default: []
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userModel',
        required: true
    },
    userModel: {
        type: String,
        enum: ['Client', 'BusinessOwner', 'Admin'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BuyAndSellItem', buyAndSellItemSchema);