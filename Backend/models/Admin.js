const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password must be at least 6 characters long.'],
        select: false
    },
    name: {
        type: String,
        required: [true, 'Name is required.'],
        trim: true
    },
    role: {
        type: String,
        default: 'admin',
        enum: ['admin']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log(`[AdminModel] Password for ${this.email} hashed successfully during pre-save.`);
        next();
    } catch (error) {
        console.error(`[AdminModel] Error hashing password for ${this.email} during pre-save:`, error);
        next(error);
    }
});

adminSchema.methods.comparePassword = async function(enteredPassword) {
    if (!this.password) {
        console.error(`[AdminModel] comparePassword called on user ${this.email} but this.password is not available.`);
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

let Admin;
try {
    Admin = mongoose.model('Admin');
} catch (error) {
    Admin = mongoose.model('Admin', adminSchema);
}
module.exports = Admin;