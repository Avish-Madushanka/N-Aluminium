const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

console.log('[BusinessOwnerModel] File loaded. Defining schema...');

const businessOwnerSchema = new mongoose.Schema({

    businessId: { type: String, required: [true, 'Business ID required.'], unique: true, trim: true },
    businessName: { type: String, required: [true, 'Business Name required.'], trim: true },
    ownerName: { type: String, required: [true, 'Owner Name required.'], trim: true },
    address: { type: String, required: [true, 'Address required.'], trim: true, minlength: [10] },
    contactNumber: { type: String, required: [true, 'Contact Number required.'], trim: true, match: [/^[0-9]{10}$/, 'Invalid 10-digit contact number.'] },
    district: { type: String, required: [true, 'District required.'] },
    province: { type: String, required: [true, 'Province required.'] },
    email: { type: String, required: [true, 'Email required.'], unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email address.'] },
    password: { type: String, required: [true, 'Password required.'], minlength: [6], select: false },
    profilePhoto: { type: String },
    coverPhoto: { type: String },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: 'businessOwner', enum: ['businessOwner'] },
    createdAt: { type: Date, default: Date.now }
});

console.log('[BusinessOwnerModel] Schema defined.');

businessOwnerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    console.log(`[BusinessOwnerModel] Hashing password for ${this.email}...`);
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error(`[BusinessOwnerModel] Hashing error for ${this.email}:`, error);
        next(error);
    }
});

businessOwnerSchema.methods.comparePassword = async function(enteredPassword) {
    if (!this.password) {
        console.error(`[BusinessOwnerModel] comparePassword error: Stored password missing for ${this.email}.`);
        return false;
    }

    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (compareError) {
        console.error(`[BusinessOwnerModel] bcrypt comparison error for ${this.email}:`, compareError);
        return false;
    }
};

console.log('[BusinessOwnerModel] Hooks and methods defined.');

console.log(`[BusinessOwnerModel] Compiling and exporting model 'BusinessOwner'...`);
const BusinessOwner = mongoose.model('BusinessOwner', businessOwnerSchema);
console.log(`[BusinessOwnerModel] Exporting type: ${typeof BusinessOwner}, Has findOne: ${typeof BusinessOwner?.findOne === 'function'}`);

module.exports = BusinessOwner;