const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, trim: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, default: () => Date.now() + 3600000 },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('PasswordReset', passwordResetSchema);