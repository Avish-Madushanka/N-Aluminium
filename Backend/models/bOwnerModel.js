// --- START OF FILE models/bOwnerModel.js ---
const mongoose = require('mongoose');

const businessOwnerSchema = new mongoose.Schema({
  businessId: { type: String, required: [true, 'Business ID is required'], unique: true, trim: true },
  businessName: { type: String, required: [true, 'Business Name is required'], trim: true },
  ownerName: { type: String, required: [true, 'Owner Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] },
  contactNumber: { type: String, required: [true, 'Contact number is required'], trim: true },
  password: { type: String, required: [true, 'Password is required'], minlength: [6, 'Password must be at least 6 characters long'], select: false },
  address: { type: String, required: [true, 'Address is required'], trim: true },
  district: { type: String, required: [true, 'District is required'], trim: true },
  province: { type: String, required: [true, 'Province is required'], trim: true },
  profilePhoto: { type: String, default: '' },
  coverPhoto: { type: String, default: '' },
  role: { type: String, enum: ['bowner', 'admin'], default: 'bowner' } // Example role field
}, { timestamps: true });

const BusinessOwner = mongoose.model('BusinessOwner', businessOwnerSchema);
module.exports = BusinessOwner;
// --- END OF FILE models/bOwnerModel.js ---