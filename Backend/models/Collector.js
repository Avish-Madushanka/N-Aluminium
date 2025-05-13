// backend/models/Collector.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const collectorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true,
        match: [/^[a-zA-Z\s]{3,50}$/, 'Name must be 3-50 letters and spaces only.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.']
    },
    primaryPhone: {
        type: String,
        required: [true, 'Primary phone number is required.'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Enter a 10-digit primary phone number.']
    },
    secondaryPhone: {
        type: String,
        trim: true,
        match: [/^[0-9]{10}$/, 'Enter a 10-digit secondary phone number.'],
        default: null
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password must be at least 6 characters.'],
        // Consider not selecting password by default for general queries
        select: false
    },
    address: {
        type: String,
        required: [true, 'Address is required.'],
        trim: true,
        minlength: [10, 'Address must be at least 10 characters.']
    },
    role: {
        type: String,
        default: 'collector',
        enum: ['collector'] // Ensures role is always 'collector'
    },
    isVerified: { // For admin approval or email verification later
        type: Boolean,
        default: false
    },
    isActive: { // For admin to enable/disable collector
        type: Boolean,
        default: true
    },
    // You might want to add fields for:
    // - assignedAreas: [String]
    // - vehicleDetails: String
    // - etc.
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook for password hashing
collectorSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log(`[CollectorModel] Password for ${this.email} hashed successfully during pre-save.`);
        next();
    } catch (error) {
        console.error(`[CollectorModel] Error hashing password for ${this.email} during pre-save:`, error);
        next(error);
    }
});

// Method for password comparison
collectorSchema.methods.comparePassword = async function(enteredPassword) {
    if (!this.password) {
        // This can happen if the document was fetched without selecting the password
        console.error(`[CollectorModel] comparePassword called on user ${this.email} but this.password is not available.`);
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

// Ensure the model is not recompiled if it already exists
module.exports = mongoose.models.Collector || mongoose.model('Collector', collectorSchema);