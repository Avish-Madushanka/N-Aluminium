const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    password: { type: String, required: true, select: false },
    address: { type: String, required: true, trim: true },
    district: { type: String, required: true },
    province: { type: String, required: true },
    profilePhoto: { type: String },
    role: { type: String, default: 'client', enum: ['client'] },
    createdAt: { type: Date, default: Date.now }
});

clientSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        console.log(`[ClientModel] Password for ${this.email} hashed successfully during pre-save.`);
        next();
    } catch (error) {
        console.error(`[ClientModel] Error hashing password for ${this.email}:`, error);
        next(error);
    }
});

clientSchema.methods.comparePassword = async function(enteredPassword) {
    if (!this.password) {
        console.error(`[ClientModel] comparePassword called on user ${this.email} but this.password is not available.`);
        return false;
    }
    return await bcrypt.compare(enteredPassword, this.password);
};

let Client;
try {
    Client = mongoose.model('Client');
} catch (error) {
    Client = mongoose.model('Client', clientSchema);
}
module.exports = Client;