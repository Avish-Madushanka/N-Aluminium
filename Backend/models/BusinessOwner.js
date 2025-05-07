const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema first
const businessOwnerSchema = new mongoose.Schema({
    businessId: { type: String, required: true, unique: true, trim: true },
    businessName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    profilePhoto: { type: String },
    coverPhoto: { type: String },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: 'businessOwner', enum: ['businessOwner'] },
    createdAt: { type: Date, default: Date.now }
});

// Pre-save hook for password hashing
businessOwnerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log(`[BusinessOwnerModel] Password for ${this.email} hashed successfully during pre-save.`);
        next();
    } catch (error) {
        console.error(`[BusinessOwnerModel] Error hashing password for ${this.email}:`, error);
        next(error);
    }
});

// Method for password comparison
businessOwnerSchema.methods.comparePassword = async function(enteredPassword) {
    if (!this.password) {
        console.error(`[BusinessOwnerModel] comparePassword called on user ${this.email} but this.password is not available.`);
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

// Check if the model already exists before trying to compile it
// Export the model
let BusinessOwner;
try {
    // Try to get the existing model if it has been compiled
    BusinessOwner = mongoose.model('BusinessOwner');
} catch (error) {
    // If the model doesn't exist, compile it
    BusinessOwner = mongoose.model('BusinessOwner', businessOwnerSchema);
}
module.exports = BusinessOwner;