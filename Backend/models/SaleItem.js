const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: 0, min: 0 },
    phoneNumber: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    condition: { 
        type: String, 
        enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'], 
        default: 'Good' 
    },
    brand: { type: String, trim: true, default: '' },
    imagePath: { type: String, required: true },
    additionalImages: [{ type: String }],
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: 'userModel', 
        required: true 
    },
    userModel: { 
        type: String, 
        required: true, 
        enum: ['Client', 'BusinessOwner', 'Admin'] 
    },
    isSold: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SaleItem', saleItemSchema);