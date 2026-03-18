const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    discountedPrice: {
        type: Number,
        min: [0, 'Discounted price cannot be negative']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        enum: ['piece', 'kg', 'meter', 'sq ft', 'tube', 'box', 'set', 'dozen'],
        default: 'piece'
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'glass', 'cradding', 'silicon', 'rubber', 'pvc',
            'box-bars', 'u-channels', 'l-bars', 't-channels',
            'j-channels', 'sivilim', 'cutters', 'grill',
            'rivet-guns', 'rubber-blade', 'glass-cutters', 'rivet-box'
        ]
    },
    subCategory: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Product image is required']
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    discount: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%'],
        default: 0
    },
    featured: {
        type: Boolean,
        default: false
    },
    colors: [{
        type: String,
        enum: ['white', 'black', 'grey', 'wood', 'maroon', 'blue', 'red', 'green', 'cream']
    }],
    sizes: [{
        type: String,
        enum: ['10mm', '15mm', '45mm', '50mm', '60mm', '80mm', '100mm']
    }],
    inStock: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'userModel'
    },
    userModel: {
        type: String,
        enum: ['Client', 'BusinessOwner', 'Admin']
    }
}, {
    timestamps: true
});

itemSchema.pre('save', function(next) {
    this.inStock = this.stock > 0;
    next();
});

itemSchema.pre('save', function(next) {
    if (this.discount > 0) {
        this.discountedPrice = this.price * (1 - this.discount / 100);
    } else {
        this.discountedPrice = this.price;
    }
    next();
});

module.exports = mongoose.model('Item', itemSchema);